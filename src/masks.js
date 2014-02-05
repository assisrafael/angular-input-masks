(function() {
	'use strict';

	var ZEROS = '00000000000000000000';
	var rgxGroupDigits = /(\d+)(\d{3})/;

	var addDefaultDelimiter = function(value, rgxDecimalDelimiter) {
		return value.replace(rgxDecimalDelimiter, '$1' + '.' + '$2');
	};

	var fillWithZeros = function(value, minLength) {
		if(!value || value.length < minLength) {
			value = (ZEROS + value).slice(-minLength);
		}

		return value;
	};

	var genericNumberFormat = function(number, decimalDelimiter, thousandsDelimiter) {
		number = number.toString().split('.');
		var thousands = number[0];
		var decimals = number.length > 1 ? decimalDelimiter + number[1] : '';
		
		while (rgxGroupDigits.test(thousands)) {
			thousands = thousands.replace(rgxGroupDigits, '$1' + thousandsDelimiter + '$2');
		}
		return thousands + decimals;
	};

	angular.module('inputMasks', [])
	.directive('imNumber', ['$locale', function ($locale) {
		var localizedNumberFormat = function(value) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
			var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
			return genericNumberFormat(value, decimalDelimiter, thousandsDelimiter);
		};

		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				decimals: '=?imNumber',
				min: '=min',
				max: '=max'
			},
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				if(typeof scope.decimals === 'undefined') {
					scope.decimals = 2;
				}

				var minLength = scope.decimals + 1;
				var rgxDecimalDelimiter = new RegExp('^(\\d+)(\\d{' + scope.decimals + '})$');

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return localizedNumberFormat(value);
				});

				ctrl.$parsers.push(function(value) {
					ctrl.$setValidity('min', true);
					ctrl.$setValidity('max', true);

					if(!value) {
						return value;
					}
					
					var cleanValue = value.replace(/[^0-9]/g, '');
					var zeroFilledValue = fillWithZeros(cleanValue, minLength);
					var delimitedValue = addDefaultDelimiter(zeroFilledValue, rgxDecimalDelimiter);
					var actualNumber = parseFloat(delimitedValue).toFixed(scope.decimals);
					var formatedValue = localizedNumberFormat(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();

						if(scope.min && scope.min > actualNumber) {
							ctrl.$setValidity('min', false);
						}

						if(scope.max && scope.max < actualNumber) {
							ctrl.$setValidity('max', false);
						}
					}

					return actualNumber;
				});
			}
		};
	}]);
})();
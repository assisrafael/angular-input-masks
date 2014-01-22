(function() {
	'use strict';

	var ZEROS = '00000000000000000000';
	var rgxGroupDigits = /(\d+)(\d{3})/;

	angular.module('inputMask', [])
	.directive('imNumber', ['$locale', function ($locale) {
		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				decimals: '=imNumber'
			},
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var minLength = scope.decimals + 1;
				var rgxDecimalDelimiter = new RegExp('^(\\d+)(\\d{' + scope.decimals + '})$');

				var fillWithZeros = function(value) {
					if(!value || value.length < minLength) {
						value = (ZEROS + value).slice(-minLength);
					}

					return value;
				};

				var addDefaultDelimiter = function(value) {
					return value.replace(rgxDecimalDelimiter, '$1' + '.' + '$2');
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

				var localizedNumberFormat = function(value) {
					var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
					var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
					return genericNumberFormat(value, decimalDelimiter, thousandsDelimiter);
				};

				ctrl.$parsers.push(function(value) {
					var cleanValue = value.replace(/[^0-9]/g, '');
					var zeroFilledValue = fillWithZeros(cleanValue);
					var delimitedValue = addDefaultDelimiter(zeroFilledValue);
					var actualNumber = parseFloat(delimitedValue).toFixed(scope.decimals);
					var formatedValue = localizedNumberFormat(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				});
			}
		};
	}]);
})();
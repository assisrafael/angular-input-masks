(function() {
	'use strict';

	var ZEROS = '00000000000000000000';
	var rgxGroupDigits = /(\d+)(\d{3})/;

	function addDefaultDelimiter(value, rgxDecimalDelimiter) {
		return value.replace(rgxDecimalDelimiter, '$1' + '.' + '$2');
	}

	function fillWithZeros(value, minLength) {
		if(!value || value.length < minLength) {
			value = (ZEROS + value).slice(-minLength);
		}

		return value;
	}

	function genericNumberFormat(number, decimalDelimiter, thousandsDelimiter) {
		number = number.toString().split('.');
		var thousands = number[0];
		var decimals = number.length > 1 ? decimalDelimiter + number[1] : '';
		
		while (rgxGroupDigits.test(thousands)) {
			thousands = thousands.replace(rgxGroupDigits, '$1' + thousandsDelimiter + '$2');
		}
		return thousands + decimals;
	}

	function formatToDecimals (value, decimals) {
		var cleanValue = value.replace(/[^0-9]/g, '');
		var minLength = decimals + 1;
		var zeroFilledValue = fillWithZeros(cleanValue, minLength);
		var rgxDecimalDelimiter = new RegExp('^(\\d+)(\\d{' + decimals + '})$');
		var delimitedValue = addDefaultDelimiter(zeroFilledValue, rgxDecimalDelimiter);
		return parseFloat(delimitedValue).toFixed(decimals);
	}

	function maxValidator(ctrl, value, limit) {
		var max = parseFloat(limit);
		var validity = ctrl.$isEmpty(value) || isNaN(max)|| value <= max;
		ctrl.$setValidity('max', validity);
		return value;
	}

	function minValidator(ctrl, value, limit) {
		var min = parseFloat(limit);
		var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
		ctrl.$setValidity('min', validity);
		return value;
	}

	angular.module('ui.utils.masks', [])
	.directive('uiPercentageMask', ['$locale', function ($locale) {
		function localizedNumberFormat(value) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
			var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
			return genericNumberFormat(value, decimalDelimiter, thousandsDelimiter);
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				min: '=?min',
				max: '=?max'
			},
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var decimals = parseInt(attrs.uiPercentageMask);
				if(!decimals) {
					decimals = 2;
				}
				var numberDecimals = decimals + 2;

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return localizedNumberFormat((parseFloat(value)*100).toFixed(decimals));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					
					var actualNumber = formatToDecimals(value, decimals);
					var formatedValue = localizedNumberFormat(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
						actualNumber = formatToDecimals(value, numberDecimals);
					}

					return actualNumber;
				});

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						return minValidator(ctrl, value, scope.min);
					});

					scope.$watch('min', function() {
						minValidator(ctrl, ctrl.$modelValue, scope.min);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						return maxValidator(ctrl, value, scope.max);
					});

					scope.$watch('max', function() {
						maxValidator(ctrl, ctrl.$modelValue, scope.max);
					});
				}
			}
		};
	}])
	.directive('uiNumberMask', ['$locale', function ($locale) {
		function localizedNumberFormat(value) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
			var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
			return genericNumberFormat(value, decimalDelimiter, thousandsDelimiter);
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				min: '=?min',
				max: '=?max'
			},
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var decimals = parseInt(attrs.uiNumberMask);
				if(!decimals) {
					decimals = 2;
				}

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return localizedNumberFormat(parseFloat(value).toFixed(decimals));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					
					var actualNumber = formatToDecimals(value, decimals);
					var formatedValue = localizedNumberFormat(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				});

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						return minValidator(ctrl, value, scope.min);
					});

					scope.$watch('min', function() {
						minValidator(ctrl, ctrl.$modelValue, scope.min);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						return maxValidator(ctrl, value, scope.max);
					});

					scope.$watch('max', function() {
						maxValidator(ctrl, ctrl.$modelValue, scope.max);
					});
				}
			}
		};
	}]);
})();
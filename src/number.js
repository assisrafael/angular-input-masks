'use strict';

angular.module('ui.utils.masks.number', [])
.directive('uiNumberMask',
	['$locale', '$parse', 'PreFormatters', 'NumberMasks', 'NumberValidators',
	function ($locale, $parse, PreFormatters, NumberMasks, NumberValidators) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = $parse(attrs.uiNumberMask)(scope);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = NumberMasks.modelMask(decimals);

				function parse(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if(angular.isDefined(attrs.uiNegativeNumber)){
						var isNegative = (value[0] === '-'),
							needsToInvertSign = (value.slice(-1) === '-');

						//only apply the minus sign if it is negative or(exclusive)
						//needs to be negative and the number is different from zero
						if(needsToInvertSign ^ isNegative && !!actualNumber) {
							actualNumber *= -1;
							formatedValue = '-' + formatedValue;
						}
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$formatters.push(function(value) {
					var prefix = '';
					if(angular.isDefined(attrs.uiNegativeNumber) && value < 0){
						prefix = '-';
					}

					if(!value) {
						return value;
					}

					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return prefix + viewMask.apply(valueToFormat);
				});

				ctrl.$parsers.push(parse);

				if (attrs.uiNumberMask) {
					scope.$watch(attrs.uiNumberMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(decimals);

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch(attrs.min, function(value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch(attrs.max, function(value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}
]);

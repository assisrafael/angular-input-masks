var validators = require('validators');

function NumberMaskDirective($locale, $parse, PreFormatters, NumberMasks) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ctrl) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				decimals = $parse(attrs.uiNumberMask)(scope);

			if (angular.isDefined(attrs.uiHideGroupSep)){
				thousandsDelimiter = '';
			}

			if(isNaN(decimals)) {
				decimals = 2;
			}

			var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
				modelMask = NumberMasks.modelMask(decimals);

			function parser(value) {
                if (ctrl.$isEmpty(value)) {
                    return null;
                }

                var actualNumber;
                var formattedValue;

                if (angular.isDefined(attrs.uiNegativeNumber) && value === '-') {
                    actualNumber = value;
                    formattedValue = value;
                }
                else {
                    var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value);
                    if (valueToFormat) {
                        actualNumber = parseFloat(modelMask.apply(valueToFormat));
                        formattedValue = viewMask.apply(valueToFormat);

                        if (angular.isDefined(attrs.uiNegativeNumber)) {
                            var minusCount = 0;
                            for (var i = 0; i < value.length; i++) {
                                if (value[i] === '-') {
                                    minusCount++;
                                }
                            }

                            //Number will be negative if there is only one or odd count of minus sign. 
                            //More than 2 minus signs are not possible. 
                            if (minusCount == 1) {
                                actualNumber *= -1;
                                formattedValue = '-' + formattedValue;
                            }
                        }
                    }
                    else {
                        formattedValue = '';
                        actualNumber = '';
                    }
                }

                if (ctrl.$viewValue !== formattedValue) {
                    ctrl.$setViewValue(formattedValue);
                    ctrl.$render();
                }

                return actualNumber;
            }

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var prefix = (angular.isDefined(attrs.uiNegativeNumber) && value < 0) ? '-' : '';
				var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
				return prefix + viewMask.apply(valueToFormat);
			}

			ctrl.$formatters.push(formatter);
			ctrl.$parsers.push(parser);

			if (attrs.uiNumberMask) {
				scope.$watch(attrs.uiNumberMask, function(_decimals) {
					decimals = isNaN(_decimals) ? 2 : _decimals;
					viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
					modelMask = NumberMasks.modelMask(decimals);

					parser(ctrl.$viewValue);
				});
			}

			if (attrs.min) {
				var minVal;

				ctrl.$validators.min = function(modelValue) {
					return validators.minNumber(ctrl, modelValue, minVal);
				};

				scope.$watch(attrs.min, function(value) {
					minVal = value;
					ctrl.$validate();
				});
			}

			if (attrs.max) {
				var maxVal;

				ctrl.$validators.max = function(modelValue) {
					return validators.maxNumber(ctrl, modelValue, maxVal);
				};

				scope.$watch(attrs.max, function(value) {
					maxVal = value;
					ctrl.$validate();
				});
			}
		}
	};
}
NumberMaskDirective.$inject = ['$locale', '$parse', 'PreFormatters', 'NumberMasks'];

module.exports = NumberMaskDirective;

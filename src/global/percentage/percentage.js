var validators = require('validators');

function PercentageMaskDirective($locale, $parse, PreFormatters, NumberMasks) {
	function preparePercentageToFormatter(value, decimals, modelMultiplier) {
		return PreFormatters.clearDelimitersAndLeadingZeros((parseFloat(value)*modelMultiplier).toFixed(decimals));
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ctrl) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				decimals = parseInt(attrs.uiPercentageMask);

			var bWasEmpty = true;

			var modelValue = {
				multiplier : 100,
				decimalMask: 2
			};

			if (angular.isDefined(attrs.uiHideGroupSep)){
				thousandsDelimiter = '';
			}

			if (angular.isDefined(attrs.uiPercentageValue)) {
				modelValue.multiplier  = 1;
				modelValue.decimalMask = 0;
			}

			if(isNaN(decimals)) {
				decimals = 2;
			}

			var numberDecimals = decimals + modelValue.decimalMask;
			var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
				modelMask = NumberMasks.modelMask(numberDecimals);

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					bWasEmpty = true;
					return value;
				} else {
					bWasEmpty = false;
				}

				var valueToFormat = preparePercentageToFormatter(value, decimals, modelValue.multiplier);
				return viewMask.apply(valueToFormat) + ' %';
			}

			function parse(value) {
				if (ctrl.$isEmpty(value)) {
					bWasEmpty = true;
					return value;
				}

				var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
				if (value.length > 0 && value.indexOf('%') === -1 && !bWasEmpty) {
					valueToFormat = (value.length === 1) ? 0 : valueToFormat.slice(0, valueToFormat.length - 1);
				}

				bWasEmpty = false;
				var formatedValue = viewMask.apply(valueToFormat) + ' %';
				var actualNumber = parseFloat(modelMask.apply(valueToFormat));
				actualNumber = (isNaN(actualNumber)) ? 0 : actualNumber;

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return actualNumber;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$parsers.push(parse);

			if (attrs.uiPercentageMask) {
				scope.$watch(attrs.uiPercentageMask, function(_decimals) {
					decimals = isNaN(_decimals) ? 2 : _decimals;

					if (angular.isDefined(attrs.uiPercentageValue)) {
						modelValue.multiplier  = 1;
						modelValue.decimalMask = 0;
					}

					numberDecimals = decimals + modelValue.decimalMask;
					viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
					modelMask = NumberMasks.modelMask(numberDecimals);

					parse(ctrl.$viewValue);
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
PercentageMaskDirective.$inject = ['$locale', '$parse', 'PreFormatters', 'NumberMasks'];

module.exports = PercentageMaskDirective;

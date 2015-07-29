var StringMask = require('string-mask');
var validators = require('validators');

function MoneyMaskDirective($locale, $parse, PreFormatters) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ctrl) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
				thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
				currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM,
				decimals = $parse(attrs.uiMoneyMask)(scope);

			function maskFactory(decimals) {
					var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
					var maskPattern = currencySym + ' #' + thousandsDelimiter + '##0' + decimalsPattern;
					return new StringMask(maskPattern, {reverse: true});
			}

			if (angular.isDefined(attrs.uiHideGroupSep)){
				thousandsDelimiter = '';
			}

			if(isNaN(decimals)) {
				decimals = 2;
			}

			var moneyMask = maskFactory(decimals);

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}
				var prefix = (angular.isDefined(attrs.uiNegativeNumber) && value < 0) ? '-' : '';
				var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
				return prefix + moneyMask.apply(valueToFormat);
			}

			function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var actualNumber = value.replace(/[^\d]+/g,'');
				actualNumber = actualNumber.replace(/^[0]+([1-9])/,'$1');
				var formatedValue = moneyMask.apply(actualNumber);

				if (angular.isDefined(attrs.uiNegativeNumber)) {
						var isNegative = (value[0] === '-'),
						needsToInvertSign = (value.slice(-1) === '-');

					//only apply the minus sign if it is negative or(exclusive)
					//needs to be negative and the number is different from zero
					if (needsToInvertSign ^ isNegative && !!actualNumber) {
						actualNumber *= -1;
						formatedValue = '-' + formatedValue;
					}
				}

				if (value !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return formatedValue ? parseInt(formatedValue.replace(/[^\d\-]+/g,''))/Math.pow(10,decimals) : null;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$parsers.push(parser);

			if (attrs.uiMoneyMask) {
				scope.$watch(attrs.uiMoneyMask, function(_decimals) {
					decimals = isNaN(_decimals) ? 2 : _decimals;
					moneyMask = maskFactory(decimals);

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
MoneyMaskDirective.$inject = ['$locale', '$parse', 'PreFormatters'];

module.exports = MoneyMaskDirective;

var moment = require('moment');
var StringMask = require('string-mask');

function DateMaskDirective($locale) {
	var dateFormatMapByLocalle = {
		'pt-br': 'DD/MM/YYYY',
	};

	var dateFormat = dateFormatMapByLocalle[$locale.id] || 'YYYY-MM-DD';

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			var dateMask = new StringMask(dateFormat.replace(/[YMD]/g,'0'));

			function applyMask (value) {
				var cleanValue = value.replace(/[^0-9]/g, '');
				var formatedValue = dateMask.process(cleanValue).result || '';

				return formatedValue.trim().replace(/[^0-9]$/, '');
			}

			function formatter (value) {
				if(ctrl.$isEmpty(value)) {
					return value;
				}

				var formatedValue = applyMask(moment(value).format(dateFormat));
				validator(formatedValue);
				return formatedValue;
			}

			function parser(value) {
				if(ctrl.$isEmpty(value)) {
					validator(value);
					return value;
				}

				var formatedValue = applyMask(value);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}
				validator(formatedValue);

				var modelValue = moment(formatedValue, dateFormat);
				return modelValue.toDate();
			}

			function validator(value) {
				var isValid = moment(value, dateFormat).isValid() &&
					value.length === dateFormat.length;
				ctrl.$setValidity('date', ctrl.$isEmpty(value) || isValid);
			}

			ctrl.$formatters.push(formatter);
			ctrl.$parsers.push(parser);
		}
	};
}
DateMaskDirective.$inject = ['$locale'];

module.exports = DateMaskDirective;

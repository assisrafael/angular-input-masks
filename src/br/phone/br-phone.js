var StringMask = require('string-mask');

function BrPhoneNumberDirective() {
	/**
	 * FIXME: all numbers will have 9 digits after 2016.
	 * see http://portal.embratel.com.br/embratel/9-digito/
	 */
	var phoneMask8D = new StringMask('(00) 0000-0000'),
		phoneMask9D = new StringMask('(00) 00000-0000');

	function removeNonDigits(value) {
		return value.toString().replace(/[^0-9]/g, '');
	}

	function applyPhoneMask(value) {
		var formatedValue;

		if(value.length < 11){
			formatedValue = phoneMask8D.apply(value) || '';
		}else{
			formatedValue = phoneMask9D.apply(value);
		}

		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				return applyPhoneMask(removeNonDigits(value));
			}

			function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var formatedValue = applyPhoneMask(removeNonDigits(value));
				var actualValue = removeNonDigits(formatedValue);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return angular.isNumber(ctrl.$modelValue) ? parseInt(actualValue) : actualValue;
			}

			function validator(value) {
				var valueLength = value && value.toString().length;
				var valid = ctrl.$isEmpty(value) || valueLength === 10 || valueLength === 11;
				ctrl.$setValidity('brPhoneNumber', valid);
				return value;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}

module.exports = BrPhoneNumberDirective;

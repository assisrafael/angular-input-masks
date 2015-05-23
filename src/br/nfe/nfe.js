var StringMask = require('string-mask');

function NfeAccessKeyMaskDirective() {
	var nfeAccessKeyMask = new StringMask('0000 0000 0000 0000 0000' +
		' 0000 0000 0000 0000 0000 0000');

	function clearValue (value) {
		return value.replace(/[^0-9]/g, '').slice(0, 44);
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var formattedValue = nfeAccessKeyMask.apply(value);
				return formattedValue.replace(/[^0-9]$/, '');
			}

			function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var modelValue = clearValue(value);
				var viewValue = formatter(modelValue);

				if(ctrl.$viewValue !== viewValue) {
					ctrl.$setViewValue(viewValue);
					ctrl.$render();
				}

				return modelValue;
			}

			function validator (value) {
				var isValid = ctrl.$isEmpty(value) || value.toString().length === 44;

				ctrl.$setValidity('nfeAccessKey', isValid);
				return value;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}

module.exports = NfeAccessKeyMaskDirective;

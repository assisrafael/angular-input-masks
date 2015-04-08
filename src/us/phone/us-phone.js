'use strict';

angular.module('ui.utils.masks.us.phone', [])
.directive('uiUsPhoneNumber', [function() {
	var phoneMaskUS = new StringMask('(000) 000-0000'),
		phoneMaskINTL = new StringMask('+00-00-000-000000');

	function removeNonDigits(value) {
		return value.replace(/[^0-9]/g, '');
	}

	function applyPhoneMask (value) {
		var formatedValue;

		if(value.length < 11){
			formatedValue = phoneMaskUS.apply(value) || '';
		}else{
			formatedValue = phoneMaskINTL.apply(value);
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

				return actualValue;
			}

			function validator(value) {
				var valid = ctrl.$isEmpty(value) || (value.length > 9);
				ctrl.$setValidity('usPhoneNumber', valid);
				return value;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}]);

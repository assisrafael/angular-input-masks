'use strict';

angular.module('ui.utils.masks.br.phone', [])
.factory('PhoneValidators', [function() {
	return {
		brPhoneNumber: function (ctrl, value) {
			var valid = ctrl.$isEmpty(value) || value.length === 10 || value.length === 11;
			ctrl.$setValidity('br-phone-number', valid);
			return value;
		}
	};
}])
.directive('uiBrPhoneNumber', ['PhoneValidators', function(PhoneValidators) {
	/**
	 * FIXME: all numbers will have 9 digits after 2016.
	 * see http://portal.embratel.com.br/embratel/9-digito/
	 */
	var phoneMask8D = new StringMask('(00) 0000-0000'),
		phoneMask9D = new StringMask('(00) 00000-0000');

	function clearValue (value) {
		if(!value) {
			return value;
		}

		return value.replace(/[^0-9]/g, '');
	}

	function applyPhoneMask (value) {
		if(!value) {
			return value;
		}

		var formatedValue;
		if(value.length < 11){
			formatedValue = phoneMask8D.apply(value);
		}else{
			formatedValue = phoneMask9D.apply(value);
		}

		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			if (!ctrl) {
				return;
			}

			ctrl.$formatters.push(function(value) {
				return applyPhoneMask(PhoneValidators.brPhoneNumber(ctrl, value));
			});

			ctrl.$parsers.push(function(value) {
				if (!value) {
					return value;
				}

				var cleanValue = clearValue(value);
				var formatedValue = applyPhoneMask(cleanValue);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return clearValue(formatedValue);
			});

			ctrl.$parsers.push(function(value) {
				return PhoneValidators.brPhoneNumber(ctrl, value);
			});
		}
	};
}]);

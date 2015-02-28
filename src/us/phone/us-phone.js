'use strict';

angular.module('ui.utils.masks.us.phone', [])
.factory('PhoneValidators', [function() {
	return {
		usPhoneNumber: function (ctrl, value) {
			var valid = ctrl.$isEmpty(value) || value.length > 9;
			ctrl.$setValidity('us-phone-number', valid);
			return value;
		}
	};
}])
.directive('uiUsPhoneNumber', ['PhoneValidators', function(PhoneValidators) {
	var phoneMaskUS = new StringMask('(000) 000-0000'),
		phoneMaskINTL = new StringMask('+00-00-000-00000');

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
			formatedValue = phoneMaskUS.apply(value);
		}else{
			formatedValue = phoneMaskINTL.apply(value);
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
				return applyPhoneMask(PhoneValidators.usPhoneNumber(ctrl, value));
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
				return PhoneValidators.usPhoneNumber(ctrl, value);
			});
		}
	};
}]);

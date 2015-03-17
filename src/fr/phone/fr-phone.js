'use strict';

angular.module('ui.utils.masks.fr.phone', [])
.factory('PhoneValidators', [function() {
	return {
		frPhoneNumber: function (ctrl, value) {
			var valid = ctrl.$isEmpty(value) || value.length === 10;
			ctrl.$setValidity('fr-phone-number', valid);
			return value;
		}
	};
}])
.directive('uiFrPhoneNumber', ['PhoneValidators', function(PhoneValidators) {
	var phoneMask10D = new StringMask('00 00 00 00 00');

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
			formatedValue = phoneMask10D.apply(value);

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
				return applyPhoneMask(PhoneValidators.frPhoneNumber(ctrl, value));
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
				return PhoneValidators.frPhoneNumber(ctrl, value);
			});
		}
	};
}]);

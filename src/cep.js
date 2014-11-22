'use strict';

angular.module('ui.utils.masks.cep', [])
.directive('uiBrCepMask', [function() {
	var cepMask = new StringMask('00000-000');

	function clearValue (value) {
		if(!value) {
			return value;
		}

		return value.replace(/[^0-9]/g, '');
	}

	function applyCepMask (value, ctrl) {
		if(!value) {
			ctrl.$setValidity('cep', true);
			return value;
		}
		var processed = cepMask.process(value);
		ctrl.$setValidity('cep', processed.valid);
		var formatedValue = processed.result;
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
				return applyCepMask(value, ctrl);
			});

			ctrl.$parsers.push(function(value) {
				if (!value) {
					return applyCepMask(value, ctrl);
				}

				var cleanValue = clearValue(value);
				var formatedValue = applyCepMask(cleanValue, ctrl);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return clearValue(formatedValue);
			});
		}
	};
}]);

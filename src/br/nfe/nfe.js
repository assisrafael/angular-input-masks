'use strict';

angular.module('ui.utils.masks.br.nfe', [])
.directive('uiNfeAccessKeyMask', ['$log', function($log) {
	var nfeAccessKeyMask = new StringMask('0000 0000 0000 0000 0000' +
		' 0000 0000 0000 0000 0000 0000');

	function clearValue (value) {
		if (angular.isUndefined(value) || value.length === 0) {
			return value;
		}

		return value.replace(/[^0-9]/g, '').slice(0, 44);
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			function formatter (value) {
				$log.debug('[uiNfeAccessKeyMask] Formatter called: ', value);
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				var formattedValue = nfeAccessKeyMask.apply(value);
				return formattedValue.replace(/[^0-9]$/, '');
			}

			function parser (value) {
				$log.debug('[uiNfeAccessKeyMask] Parser called: ', value);

				var modelValue = clearValue(value);
				var viewValue = formatter(modelValue);

				if(ctrl.$viewValue !== viewValue) {
					ctrl.$setViewValue(viewValue);
					ctrl.$render();
				}

				return modelValue;
			}

			function validator (value) {
				$log.debug('[uiNfeAccessKeyMask] Validator called: ', value);

				if(angular.isUndefined(value)) {
					return value;
				}

				var isValid = value.toString().length === 44;

				ctrl.$setValidity('nfe-access-key', ctrl.$isEmpty(value) || isValid);
				return value;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}]);

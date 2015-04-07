'use strict';

angular.module('ui.utils.masks.br.cep', [])
.directive('uiBrCepMask', [function() {
	var cepMask = new StringMask('00000-000');

	function clearValue(value) {
		return value.replace(/[^0-9]/g, '');
	}

	function applyCepMask (value) {
		var processed = cepMask.process(value);
		var formatedValue = processed.result || '';
		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			function validator(value) {
				var processed = cepMask.process(value);
				ctrl.$setValidity('cep', ctrl.$isEmpty(value) || processed.valid);

				return value;
			}

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				return applyCepMask(value);
			}

			function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var cleanValue = clearValue(value);
				var formatedValue = applyCepMask(cleanValue);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return clearValue(formatedValue);
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}]);

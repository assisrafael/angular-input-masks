'use strict';

/*global BrV*/
var globalBrV;
if (typeof BrV !== 'undefined') {
	globalBrV = BrV;
}

(function() {
	var cnpjPattern = new StringMask('00.000.000\/0000-00');
	var cpfPattern = new StringMask('000.000.000-00');

	function validateCPF (ctrl, value) {
		if (!globalBrV) {
			return value;
		}

		var valid = ctrl.$isEmpty(value) || globalBrV.cpf.validate(value);
		ctrl.$setValidity('cpf', valid);
		return value;
	}

	function validateCNPJ (ctrl, value) {
		if (!globalBrV) {
			return value;
		}

		var valid = ctrl.$isEmpty(value) || globalBrV.cnpj.validate(value);
		ctrl.$setValidity('cnpj', valid);
		return value;
	}

	function validateCPForCNPJ (ctrl, value) {
		if(!value || value.length <= 11) {
			validateCNPJ(ctrl, '');
			return validateCPF(ctrl, value);
		}else {
			validateCPF(ctrl, '');
			return validateCNPJ(ctrl, value);
		}
	}

	function removeNonDigits(value) {
		return value.replace(/[^\d]/g, '');
	}

	function uiBrCpfMask() {
		function applyCpfMask (value) {
			var formatedValue = cpfPattern.apply(value) || '';
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyCpfMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyCpfMask(removeNonDigits(value));
					var actualNumber = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				function validator(value) {
					return validateCPF(ctrl, value);
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}

	function uiBrCnpjMask() {
		function applyCnpjMask (value) {
			var formatedValue = cnpjPattern.apply(value) || '';
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyCnpjMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyCnpjMask(removeNonDigits(value));
					var actualNumber = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				function validator(value) {
					return validateCNPJ(ctrl, value);
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}

	function uiBrCpfCnpjMask() {
		function applyCpfCnpjMask (value) {
			var formatedValue;
			if (value.length > 11) {
				formatedValue = cnpjPattern.apply(value);
			} else {
				formatedValue = cpfPattern.apply(value) || '';
			}
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					return applyCpfCnpjMask(removeNonDigits(value));
				}

				function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var formatedValue = applyCpfCnpjMask(removeNonDigits(value));
					var actualNumber = removeNonDigits(formatedValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				function validator(value) {
					return validateCPForCNPJ(ctrl, value);
				}

				ctrl.$formatters.push(formatter);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}

	angular.module('ui.utils.masks.br.cpfCnpj', [])
	.directive('uiBrCpfMask', [uiBrCpfMask])
	.directive('uiBrCnpjMask', [uiBrCnpjMask])
	.directive('uiBrCpfcnpjMask', [uiBrCpfCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfMask', [uiBrCpfMask])
	// deprecated: will be removed in the next major version
	.directive('uiCnpjMask', [uiBrCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfcnpjMask', [uiBrCpfCnpjMask]);
})();

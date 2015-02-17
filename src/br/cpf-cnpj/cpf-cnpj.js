'use strict';

(function() {
	var cnpjPattern = new StringMask('00.000.000\/0000-00');
	var cpfPattern = new StringMask('000.000.000-00');

	function validateCPF (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cpf.validate(value);
		ctrl.$setValidity('cpf', valid);
		return value;
	}

	function validateCNPJ (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cnpj.validate(value);
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

	function uiBrCpfMask() {
		function applyCpfMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cpfPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfMask(validateCPF(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]/g,'');
					var formatedValue = applyCpfMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPF(ctrl, value);
				});
			}
		};
	}

	function uiBrCnpjMask() {
		function applyCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cnpjPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCnpjMask(validateCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCNPJ(ctrl, value);
				});
			}
		};
	}

	function uiBrCpfCnpjMask() {
		function applyCpfCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue;
			if (value.length > 11) {
				formatedValue = cnpjPattern.apply(value);
			} else {
				formatedValue = cpfPattern.apply(value);
			}
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfCnpjMask(validateCPForCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCpfCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPForCNPJ(ctrl, value);
				});
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

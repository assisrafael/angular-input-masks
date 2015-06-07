var StringMask = require('string-mask');
var BrV = require('br-validations');
var maskFactory = require('mask-factory');

var cnpjPattern = new StringMask('00.000.000\/0000-00');
var cpfPattern = new StringMask('000.000.000-00');

function validateCPF(ctrl, value) {
	var valid = ctrl.$isEmpty(value) || BrV.cpf.validate(value);
	ctrl.$setValidity('cpf', valid);
	return value;
}

function validateCNPJ(ctrl, value) {
	var valid = ctrl.$isEmpty(value) || BrV.cnpj.validate(value);
	ctrl.$setValidity('cnpj', valid);
	return value;
}

function validateCPForCNPJ(ctrl, value) {
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

var uiBrCpfMask = maskFactory({
	validationErrorKey: 'cpf',
	clearValue: function(rawValue) {
		return rawValue.replace(/[^\d]/g, '').slice(0, 11);
	},
	format: function(cleanValue) {
		return (cpfPattern.apply(cleanValue) || '').trim().replace(/[^0-9]$/, '');
	},
	validate: function(value) {
		return BrV.cpf.validate(value);
	}
});

var uiBrCnpjMask = maskFactory({
	validationErrorKey: 'cnpj',
	clearValue: function(rawValue) {
		return rawValue.replace(/[^\d]/g, '').slice(0, 14);
	},
	format: function(cleanValue) {
		return (cnpjPattern.apply(cleanValue) || '').trim().replace(/[^0-9]$/, '');
	},
	validate: function(value) {
		return BrV.cnpj.validate(value);
	}
});

function uiBrCpfCnpjMask() {
	function applyCpfCnpjMask(value) {
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

var m = angular.module('ui.utils.masks.br.cpfCnpj', [])
.directive('uiBrCpfMask', [uiBrCpfMask])
.directive('uiBrCnpjMask', [uiBrCnpjMask])
.directive('uiBrCpfcnpjMask', [uiBrCpfCnpjMask])
// deprecated: will be removed in the next major version
.directive('uiCpfMask', [uiBrCpfMask])
// deprecated: will be removed in the next major version
.directive('uiCnpjMask', [uiBrCnpjMask])
// deprecated: will be removed in the next major version
.directive('uiCpfcnpjMask', [uiBrCpfCnpjMask]);

module.exports = m.name;

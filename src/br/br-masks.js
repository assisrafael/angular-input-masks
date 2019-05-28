'use strict';

var m = angular.module('ui.utils.masks.br', [])
	.directive('uiBrBoletoBancarioMask', require('./boleto-bancario/boleto-bancario'))
	.directive('uiBrCarPlateMask', require('./car-plate/car-plate'))
	.directive('uiBrCepMask', require('./cep/cep'))
	.directive('uiBrCnpjMask', require('./cnpj/cnpj'))
	.directive('uiBrCpfMask', require('./cpf/cpf'))
	.directive('uiBrCpfcnpjMask', require('./cpf-cnpj/cpf-cnpj'))
	.directive('uiBrNumeroBeneficioMask', require('./numero-beneficio/numero-beneficio'))
	.directive('uiBrIeMask', require('./inscricao-estadual/ie'))
	.directive('uiNfeAccessKeyMask', require('./nfe/nfe'))
	.directive('uiBrPhoneNumberMask', require('./phone/br-phone'));

module.exports = m.name;

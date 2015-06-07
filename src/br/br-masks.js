var m = angular.module('ui.utils.masks.br', [
	require('../helpers'),
	require('./cpf-cnpj/cpf-cnpj')
])
.directive('uiBrBoletoBancarioMask', require('./boleto-bancario/boleto-bancario'))
.directive('uiBrCepMask', require('./cep/cep'))
.directive('uiBrIeMask', require('./inscricao-estadual/ie'))
.directive('uiNfeAccessKeyMask', require('./nfe/nfe'))
.directive('uiBrPhoneNumber', require('./phone/br-phone'));

module.exports = m.name;

'use strict';

var StringMask = require('string-mask');
// TODO! Descomentar quando aplicado ao br-validations.
//var BrV = require('br-validations');

var maskFactory = require('../../helpers/mask-factory');

var numeroBeneficioPattern = new StringMask('###.###.###-#', {reverse: true});

module.exports = maskFactory({
	clearValue: function(rawValue) {
		return rawValue.replace(/[^\d]/g, '').slice(0, 10);
	},
	format: function(cleanValue) {
		return (numeroBeneficioPattern.apply(cleanValue) || '').trim().replace(/[^0-9]$/, '');
	},
	validations: {
		// TODO! Descomentar quando aplicado ao br-validations.
		//numeroBeneficio: function(value) {
		//	return BrV.numeroBeneficio.validate(value);
		//}
	}
});

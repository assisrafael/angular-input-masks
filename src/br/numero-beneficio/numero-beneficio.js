'use strict';

var StringMask = require('string-mask');

var maskFactory = require('../../helpers/mask-factory');

var numeroBeneficioPattern = new StringMask('###.###.###-#', {reverse: true});

module.exports = maskFactory({
	clearValue: function(rawValue) {
		return rawValue.replace(/[^\d]/g, '').slice(0, 10);
	},
	format: function(cleanValue) {
		return (numeroBeneficioPattern.apply(cleanValue) || '').trim().replace(/[^0-9]$/, '');
	},
	validations: {}
});

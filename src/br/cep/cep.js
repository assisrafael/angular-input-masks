'use strict';

var StringMask = require('string-mask');
var maskFactory = require('../../helpers/mask-factory');

var cepMask = new StringMask('00000-000');

module.exports = maskFactory({
	clearValue: function(rawValue) {
		return rawValue.toString().replace(/[^0-9]/g, '').slice(0, 8);
	},
	format: function(cleanValue) {
		return (cepMask.apply(cleanValue) || '').replace(/[^0-9]$/, '');
	},
	validations: {
		cep: function(value) {
			return value.toString().trim().length === 8;
		}
	}
});

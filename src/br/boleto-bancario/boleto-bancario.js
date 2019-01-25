'use strict';

var StringMask = require('string-mask');
var maskFactory = require('../../helpers/mask-factory');

var boletoBancarioMask = new StringMask('00000.00000 00000.000000 00000.000000 0 00000000000000');
var tributoBancarioMask = new StringMask('00000000000-0 00000000000-0 00000000000-0 00000000000-0');

module.exports = maskFactory({
	clearValue: function (rawValue) {
		return rawValue.replace(/[^0-9]/g, '').slice(0, 48);
	},
	format: function (cleanValue) {
		if (cleanValue.length === 0) {
			return cleanValue;
		}
		if (cleanValue[0] === '8')
			return tributoBancarioMask.apply(cleanValue).replace(/[^0-9]$/, '');
		return boletoBancarioMask.apply(cleanValue).replace(/[^0-9]$/, '');
	},
	validations: {
		brBoletoBancario: function (value) {
			return [47, 48].indexOf(value.length) >= 0;
		}
	}
});

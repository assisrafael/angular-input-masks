'use strict';

var StringMask = require('string-mask');
var maskFactory = require('../../helpers/mask-factory');

var defaultSize = 16;
var amexSize = 15;

var defaultMask = new StringMask('0000 0000 0000 0000');
var amexMask = new StringMask('0000 000000 00000');


module.exports = maskFactory({
	clearValue: function(rawValue) {
		return rawValue.toString().replace(/[^0-9]/g, '').slice(0, defaultSize);
	},
	format: function(cleanValue) {
		var formatedValue;

		if (cleanValue.startsWith("34") || cleanValue.startsWith("37")) {
			formatedValue = amexMask.apply(cleanValue) || '';
		} else {
			formatedValue = defaultMask.apply(cleanValue) || '';
		}

		return formatedValue.trim().replace(/[^0-9]$/, '');
	},
	validations: {
		creditCard: function(value) {
			var valueLength = value && value.toString().length;
			return valueLength === defaultSize || valueLength === amexSize;
		}
	}
});

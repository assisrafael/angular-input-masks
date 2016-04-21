'use strict';

var StringMask = require('string-mask');
var maskFactory = require('mask-factory');

var phoneMask = new StringMask('+00 00 000 00 00');
	//phoneMask9D = new StringMask('(00) 00000-0000'),
	//phoneMask0800 = new StringMask('0000-000-0000');

module.exports = maskFactory({
	clearValue: function(rawValue) {
		return rawValue.toString().replace(/[^0-9]/g, '').slice(0, 11);
	},
	format: function(cleanValue) {
		var formatedValue;
		/*if (cleanValue.indexOf('0800') === 0) {
			formatedValue = phoneMask0800.apply(cleanValue);
		} else if (cleanValue.length < 11) {
			formatedValue = phoneMask8D.apply(cleanValue) || '';
		} else {
			formatedValue = phoneMask9D.apply(cleanValue);
		}*/

		formatedValue = phoneMask.apply(cleanValue) || '';

		return formatedValue.trim().replace(/[^0-9]$/, '');
	},
	validations: {
		chPhoneNumber: function(value) {
			var valueLength = value && value.toString().length;
			return valueLength === 11;
		}
	}
});

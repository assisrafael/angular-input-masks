'use strict';

var StringMask = require('string-mask');
var maskFactory = require('mask-factory');

/**
 * FIXME: all numbers will have 9 digits after 2016.
 * see http://portal.embratel.com.br/embratel/9-digito/
 */
var phoneMask8D = {
		areaCode: new StringMask('(00) 0000-0000'), 	//with area code
		simple: new StringMask('0000-0000') 			//without area code
	}, phoneMask9D = {
		areaCode: new StringMask('(00) 00000-0000'), 	//with area code
		simple: new StringMask('00000-0000') 			//without area code
	}, phoneMask0800 = {
		areaCode: null,									//N/A
		simple: new StringMask('0000-000-0000') 		//N/A, so it's "simple"
	};

module.exports = maskFactory({
	clearValue: function(rawValue) {
		return rawValue.toString().replace(/[^0-9]/g, '').slice(0, 11);
	},
	format: function(cleanValue) {
		var formattedValue;

		if (cleanValue.indexOf('0800') === 0) {
			formattedValue = phoneMask0800.simple.apply(cleanValue);
		} else if (cleanValue.length < 9) {
			formattedValue = phoneMask8D.simple.apply(cleanValue) || '';
		} else if (cleanValue.length < 10) {
			formattedValue = phoneMask9D.simple.apply(cleanValue);
		} else if (cleanValue.length < 11) {
			formattedValue = phoneMask8D.areaCode.apply(cleanValue);
		} else {
			formattedValue = phoneMask9D.areaCode.apply(cleanValue);
		}

		return formattedValue.trim().replace(/[^0-9]$/, '');
	},
	getModelValue: function(formattedValue, originalModelType) {
		var cleanValue = this.clearValue(formattedValue);
		return originalModelType === 'number' ? parseInt(cleanValue) : cleanValue;
	},
	validations: {
		brPhoneNumber: function(value) {
			var valueLength = value && value.toString().length;

			//8- 8D without DD
			//9- 9D without DD
			//10- 9D with DD
			//11- 8D with DD and 0800
			return valueLength >= 8 && valueLength <= 11;
		}
	}
});

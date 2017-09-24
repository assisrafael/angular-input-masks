'use strict';

var StringMask = require('string-mask');

function viewMask(decimals, decimalDelimiter, thousandsDelimiter) {
	var mask = '#' + thousandsDelimiter + '##0';

	if (decimals > 0) {
		mask += decimalDelimiter;
		for (var i = 0; i < decimals; i++) {
			mask += '0';
		}
	}

	return new StringMask(mask, {
		reverse: true
	});
}

function modelMask(decimals) {
	var mask = '###0';

	if (decimals > 0) {
		mask += '.';
		for (var i = 0; i < decimals; i++) {
			mask += '0';
		}
	}

	return new StringMask(mask, {
		reverse: true
	});
}

module.exports = {
	viewMask: viewMask,
	modelMask: modelMask
};

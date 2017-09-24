'use strict';

function clearDelimitersAndLeadingZeros(value) {
	if (value === '0') {
		return '0';
	}

	var cleanValue = value.toString().replace(/^-/,'').replace(/^0*/, '');
	return cleanValue.replace(/[^0-9]/g, '');
}

function prepareNumberToFormatter(value, decimals) {
	return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
}

module.exports = {
	clearDelimitersAndLeadingZeros: clearDelimitersAndLeadingZeros,
	prepareNumberToFormatter: prepareNumberToFormatter
};

var StringMask = require('string-mask');
var maskFactory = require('mask-factory');

var phoneMaskFR = new StringMask('00 00 00 00 00');

module.exports = maskFactory({
    clearValue: function(rawValue) {
        return rawValue.toString().replace(/[^0-9]/g, '');
    },
    format: function(cleanValue) {
        var formattedValue;

        formattedValue = phoneMaskFR.apply(cleanValue) || '';

        return formattedValue.trim().replace(/[^0-9]$/, '');
    },
    validations: {
        frPhoneNumber: function(value) {
            var valueLength = value && value.toString().length;
            return valueLength === 10;
        }
    }
});

'use strict';

var StringMask = require('string-mask');

describe('uiNfeAccessKeyMask', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/nfe/nfe.html');
		expect(browser.getTitle()).toEqual('NF-e Spec');
	});

	it('should format a NF-e access key', function() {
		var nfeAccessKeyFormatter = new StringMask('0000 0000 0000 0000 0000' +
				' 0000 0000 0000 0000 0000 0000'),
			inputKeysToSend = '34958723405162304548623240917012593348590495',
			formatedNfeAccessKeyAsString, numberToFormat = '';

		var input = element(by.model('accessKeyField'));

		var i;
		for (i = 0; i < 44; i++) {
			var key = inputKeysToSend.charAt(i);
			input.sendKeys(key);
			numberToFormat += key;
			formatedNfeAccessKeyAsString = nfeAccessKeyFormatter.apply(numberToFormat).replace(/[^0-9]$/,'');
			expect(input.getAttribute('value')).toEqual(formatedNfeAccessKeyAsString);
		}

		for (i = 43; i >= 0; i--) {
			if (i % 4 === 0) {
				input.sendKeys(protractor.Key.BACK_SPACE);
			}

			input.sendKeys(protractor.Key.BACK_SPACE);
			numberToFormat = numberToFormat.slice(0, -1);
			if (numberToFormat) {
				formatedNfeAccessKeyAsString = nfeAccessKeyFormatter.apply(numberToFormat).replace(/[^0-9]$/,'');
				expect(input.getAttribute('value')).toEqual(formatedNfeAccessKeyAsString);
			}
		}
	});

	it('should be valid if the model is a valid time', function() {
		var inputKeysToSend = '23304920235802085168523045823045892349519349';

		var input = element(by.model('accessKeyField')),
			valid = element(by.binding('form.accessKeyField.$error'));

		var i;
		for (i = 0; i < 43; i++) {
			input.sendKeys(inputKeysToSend.charAt(i));
			expect(valid.getText()).toEqual('{ "nfeAccessKey": true }');
		}

		input.sendKeys(inputKeysToSend.charAt(5));
		expect(valid.getText()).toEqual('{}');

		for (i = 43; i > 0; i--) {
			if (i % 4 === 0) {
				input.sendKeys(protractor.Key.BACK_SPACE);
			}

			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(valid.getText()).toEqual('{ "nfeAccessKey": true }');
		}

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(valid.getText()).toEqual('{}');
	});
});

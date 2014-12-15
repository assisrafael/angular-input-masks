var StringMask = require('../bower_components/string-mask/src/string-mask.js');

describe('ui.utils.masks.time', function() {
	beforeEach(function() {
		browser.get('/test/time.html');
	});

	it('should load the demo page', function() {
		expect(browser.getTitle()).toEqual('Time Spec');
	});

	describe('ui-time-mask:', function() {
		it('should format a time with default ("00:00:00") format', function() {
			var timeFormatter = new StringMask('00:00:00'),
				formatedTimeAsString, numberToFormat = '', inputKeysToSend = '235959';

			var input = element(by.model('timeMask')),
				value = element(by.binding('timeMask'));

			for (var i = 0; i < 6; i++) {
				var key = inputKeysToSend.charAt(i);
				input.sendKeys(key);
				numberToFormat += key;
				formatedTimeAsString = timeFormatter.apply(numberToFormat).replace(/:$/,'');
				expect(input.getAttribute('value')).toEqual(formatedTimeAsString);
			}

			for (var i = 5; i >= 0; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(numberToFormat) {
					formatedTimeAsString = timeFormatter.apply(numberToFormat).replace(/:$/,'');
					expect(input.getAttribute('value')).toEqual(formatedTimeAsString);
				}
			}
		});

		it('should be valid if the model is a valid time', function() {
			var inputKeysToSend = '235959';

			var input = element(by.model('timeMask')),
				value = element(by.binding('timeMask')),
				valid = element(by.binding('form.timeMaskInput.$error'));

			for (var i = 0; i < 5; i++) {
				input.sendKeys(inputKeysToSend.charAt(i));
				expect(valid.getText()).toEqual('{ "time": true }');
			}

			input.sendKeys(inputKeysToSend.charAt(5));
			expect(valid.getText()).toEqual('{ "time": false }');

			for (var i = 5; i > 0; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				expect(valid.getText()).toEqual('{ "time": true }');
			}

			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(valid.getText()).toEqual('{ "time": false }');
		});
	});
});

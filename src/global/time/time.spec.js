var StringMask = require('string-mask');

describe('ui.utils.masks.time', function() {
	it('should load the demo page', function() {
		browser.get('/src/global/time/time.html');
		expect(browser.getTitle()).toEqual('Time Spec');
	});

	describe('ui-time-mask:', function() {
		describe('full mode: HH:MM:SS (default)', function() {
			it('should format a time input with default ("00:00:00") format', function() {
				var timeFormatter = new StringMask('00:00:00'),
					formatedTimeAsString, numberToFormat = '', inputKeysToSend = '235959';

				var input = element(by.model('timeMask')),
					value = element(by.exactBinding('timeMask'));

				for (var i = 0; i < 6; i++) {
					var key = inputKeysToSend.charAt(i);
					input.sendKeys(key);
					numberToFormat += key;
					formatedTimeAsString = timeFormatter.apply(numberToFormat).replace(/:$/,'');
					expect(input.getAttribute('value')).toEqual(formatedTimeAsString);
					expect(value.getText()).toEqual(formatedTimeAsString);
				}

				for (var i = 5; i >= 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					numberToFormat = numberToFormat.slice(0, -1);
					if(numberToFormat) {
						formatedTimeAsString = timeFormatter.apply(numberToFormat).replace(/:$/,'');
						expect(input.getAttribute('value')).toEqual(formatedTimeAsString);
						expect(value.getText()).toEqual(formatedTimeAsString);
					}
				}
			});

			it('should be valid if the model is a valid time', function() {
				var inputKeysToSend = '235959';

				var input = element(by.model('timeMask')),
					value = element(by.exactBinding('timeMask')),
					valid = element(by.binding('form.timeMaskInput.$error'));

				for (var i = 0; i < 5; i++) {
					input.sendKeys(inputKeysToSend.charAt(i));
					expect(valid.getText()).toEqual('{ "time": true }');
				}

				input.sendKeys(inputKeysToSend.charAt(5));
				expect(valid.getText()).toEqual('{}');

				for (var i = 5; i > 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					expect(valid.getText()).toEqual('{ "time": true }');
				}

				input.sendKeys(protractor.Key.BACK_SPACE);
				expect(valid.getText()).toEqual('{}');
			});
		});

		describe('short mode: HH:MM', function() {
			it('should format a time input with "00:00" format', function() {
				var timeFormatter = new StringMask('00:00'),
					formatedTimeAsString, numberToFormat = '', inputKeysToSend = '2359';

				var input = element(by.model('shortTimeMask')),
					value = element(by.exactBinding('shortTimeMask'));

				for (var i = 0; i < 4; i++) {
					var key = inputKeysToSend.charAt(i);
					input.sendKeys(key);
					numberToFormat += key;
					formatedTimeAsString = timeFormatter.apply(numberToFormat).replace(/:$/,'');
					expect(input.getAttribute('value')).toEqual(formatedTimeAsString);
					expect(value.getText()).toEqual(formatedTimeAsString);
				}

				for (var i = 3; i >= 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					numberToFormat = numberToFormat.slice(0, -1);
					if(numberToFormat) {
						formatedTimeAsString = timeFormatter.apply(numberToFormat).replace(/:$/,'');
						expect(input.getAttribute('value')).toEqual(formatedTimeAsString);
						expect(value.getText()).toEqual(formatedTimeAsString);
					}
				}
			});

			it('should be valid if the model is a valid time', function() {
				var inputKeysToSend = '235959';

				var input = element(by.model('shortTimeMask')),
					value = element(by.exactBinding('shortTimeMask')),
					valid = element(by.binding('form.shortTimeMaskInput.$error'));

				for (var i = 0; i < 3; i++) {
					input.sendKeys(inputKeysToSend.charAt(i));
					expect(valid.getText()).toEqual('{ "time": true }');
				}

				input.sendKeys(inputKeysToSend.charAt(3));
				expect(valid.getText()).toEqual('{}');

				for (var i = 3; i > 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					expect(valid.getText()).toEqual('{ "time": true }');
				}

				input.sendKeys(protractor.Key.BACK_SPACE);
				expect(valid.getText()).toEqual('{}');
			});
		});
	});
});

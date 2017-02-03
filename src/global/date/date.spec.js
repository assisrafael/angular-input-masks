'use strict';

var StringMask = require('string-mask'),
	moment = require('moment');

describe('ui.utils.masks.date', function() {
	describe('default ("YYYY-MM-DD") mask', function() {
		it('should load the demo page', function() {
			browser.get('/src/global/date/date.html');
			expect(browser.getTitle()).toEqual('Date Spec');
		});

		describe('ui-date-mask:', function() {
			it('should format a date', function() {
				var dateFormatter = new StringMask('0000-00-00'),
					formatedDateAsString, numberToFormat = '', inputKeysToSend = '19991231';

				var input = element(by.model('dateMask')),
					value = element(by.exactBinding('dateMask'));

				var i;
				for (i = 0; i < 8; i++) {
					var key = inputKeysToSend.charAt(i);
					input.sendKeys(key);
					numberToFormat += key;
					formatedDateAsString = dateFormatter.apply(numberToFormat).replace(/-$/,'');
					expect(input.getAttribute('value')).toEqual(formatedDateAsString);
				}

				expect(value.evaluate('dateMask.toString()')).toEqual(moment(formatedDateAsString, 'YYYY-MM-DD').toDate().toString());

				for (i = 7; i >= 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					numberToFormat = numberToFormat.slice(0, -1);
					if (numberToFormat) {
						formatedDateAsString = dateFormatter.apply(numberToFormat).replace(/-$/, '');
						expect(input.getAttribute('value')).toEqual(formatedDateAsString);
					}
				}
			});

			it('should format a model initialized with a date object', function() {
				var input = element(by.model('initializedDateMask')),
					value = element(by.exactBinding('initializedDateMask'));

				value.evaluate('initializedDateMask').then((initialValue) => {
					var dateValue = moment(initialValue).format('YYYY-MM-DD');
					expect(input.getAttribute('value')).toEqual(dateValue);
				});
			});

			it('should format a model initialized with a ISO string', function() {
				var input = element(by.model('initializedWithISOStringDateMask')),
					value = element(by.exactBinding('initializedWithISOStringDateMask'));

				value.getText().then((textValue) => {
					var dateValue = moment(new Date(textValue)).format('YYYY-MM-DD');
					expect(input.getAttribute('value')).toEqual(dateValue);
				});
			});

			it('should be valid if the model is a valid date', function() {
				var inputKeysToSend = '19991231';

				var input = element(by.model('dateMask')),
					valid = element(by.binding('form.dateMaskInput.$error'));

				var i;
				for (i = 0; i < 7; i++) {
					input.sendKeys(inputKeysToSend.charAt(i));
					expect(valid.getText()).toEqual('{ "date": true }');
				}

				input.sendKeys(inputKeysToSend.charAt(7));
				expect(valid.getText()).toEqual('{}');

				for (i = 7; i > 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					expect(valid.getText()).toEqual('{ "date": true }');
				}

				input.sendKeys(protractor.Key.BACK_SPACE);
				expect(valid.getText()).toEqual('{}');
			});
		});
	});

	describe('pt-br ("DD/MM/YYYY") mask', function() {
		it('should load the demo page', function() {
			browser.get('/src/global/date/date-pt-br.html');
			expect(browser.getTitle()).toEqual('Date Spec');
		});

		describe('ui-date-mask:', function() {
			it('should format a date', function() {
				var dateFormatter = new StringMask('00/00/0000'),
					formatedDateAsString, numberToFormat = '', inputKeysToSend = '31121999';

				var input = element(by.model('dateMask')),
					value = element(by.exactBinding('dateMask'));

				var i;
				for (i = 0; i < 8; i++) {
					var key = inputKeysToSend.charAt(i);
					input.sendKeys(key);
					numberToFormat += key;
					formatedDateAsString = dateFormatter.apply(numberToFormat).replace(/\/$/,'');
					expect(input.getAttribute('value')).toEqual(formatedDateAsString);
				}

				expect(value.evaluate('dateMask.toString()')).toEqual(moment(formatedDateAsString, 'DD/MM/YYYY').toDate().toString());

				for (i = 7; i >= 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					numberToFormat = numberToFormat.slice(0, -1);
					if (numberToFormat) {
						formatedDateAsString = dateFormatter.apply(numberToFormat).replace(/\/$/,'');
						expect(input.getAttribute('value')).toEqual(formatedDateAsString);
					}
				}
			});

			it('should format a model initialized with a date object', function() {
				var input = element(by.model('initializedDateMask')),
					value = element(by.exactBinding('initializedDateMask'));

				value.evaluate('initializedDateMask').then((initialValue) => {
					var dateValue = moment(initialValue).format('DD/MM/YYYY');
					expect(input.getAttribute('value')).toEqual(dateValue);
				});
			});

			it('should format a model initialized with a ISO string', function() {
				var input = element(by.model('initializedWithISOStringDateMask')),
					value = element(by.exactBinding('initializedWithISOStringDateMask'));

				value.getText().then((textValue) => {
					var dateValue = moment(new Date(textValue)).format('DD/MM/YYYY');
					expect(input.getAttribute('value')).toEqual(dateValue);
				});
			});

			it('should be valid if the model is a valid date', function() {
				var inputKeysToSend = '31121999';

				var input = element(by.model('dateMask')),
					valid = element(by.binding('form.dateMaskInput.$error'));

				var i;
				for (i = 0; i < 7; i++) {
					input.sendKeys(inputKeysToSend.charAt(i));
					expect(valid.getText()).toEqual('{ "date": true }');
				}

				input.sendKeys(inputKeysToSend.charAt(7));
				expect(valid.getText()).toEqual('{}');

				for (i = 7; i > 0; i--) {
					input.sendKeys(protractor.Key.BACK_SPACE);
					expect(valid.getText()).toEqual('{ "date": true }');
				}

				input.sendKeys(protractor.Key.BACK_SPACE);
				expect(valid.getText()).toEqual('{}');
			});
		});
	});
});

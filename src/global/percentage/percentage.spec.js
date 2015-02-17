var StringMask = require('string-mask');

describe('ui.utils.masks.percentage', function() {
	beforeEach(function() {
		browser.get('/demo');
	});

	it('should load the demo page', function() {
		expect(browser.getTitle()).toEqual('Angular Mask Demo');
	});

	describe('ui-percentage-mask:', function() {
		it('should format percentage numbers with two decimal places (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.0000', {reverse: true}),
				numberToFormat = '', percent = ' %', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWithDefaultDecimals')),
				value = element(by.binding('percentageWithDefaultDecimals'));

			expect(input.getAttribute('value')).toEqual('76,54'+percent);
			input.clear();

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);
			}
		});

		it('should accept 0 in all configurations', function() {
			var input = element(by.model('percentageWithDefaultDecimals')),
				value = element(by.binding('percentageWithDefaultDecimals'));

			input.clear();
			input.sendKeys(0);
			expect(input.getAttribute('value')).toEqual('0,00 %');
			expect(value.getText()).toEqual('0');

			input = element(by.model('percentageWith4Decimals'));
			value = element(by.binding('percentageWith4Decimals'));

			input.clear();
			input.sendKeys(0);
			expect(input.getAttribute('value')).toEqual('0,0000 %');
			expect(value.getText()).toEqual('0');
		});

		it('should not include the % symbol when the input is empty', function() {
			var input = element(by.model('percentageWith4Decimals')),
				value = element(by.binding('percentageWith4Decimals'));

			input.clear();
			expect(input.getAttribute('value')).toEqual('');
		});

		it('should format percentage numbers with four decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,0000', {reverse: true}),
				formatterModel =  new StringMask('###0.000000', {reverse: true}),
				numberToFormat = '', percent = ' %', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWith4Decimals')),
				value = element(by.binding('percentageWith4Decimals'));

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);
			}
		});
	});
});

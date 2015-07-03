var StringMask = require('string-mask');

describe('ui.utils.masks.money', function() {
	it('should load the demo page', function() {
		browser.get('/src/global/money/money.html');
		expect(browser.getTitle()).toEqual('Money Spec');
	});

	describe('ui-money-mask:', function() {
		it('should format money with two decimal places (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', currency = 'R$ ', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('defaultMoney')),
				value = element(by.binding('defaultMoney'));

			expect(input.getAttribute('value')).toEqual(currency + '153,12');
			input.clear();

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(currency + formatedNumberAsString);

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
				expect(input.getAttribute('value')).toEqual(currency + formatedNumberAsString);
			}
		});

		it('should format a field with 0 as the initial value', function() {
			var currency = 'R$ ';

			var input = element(by.model('moneyStartedWith0'));

			expect(input.getAttribute('value')).toEqual(currency+'0,00');
		});

		it('should format a field with an initial value with string type', function() {
			var currency = 'R$ ';

			var input = element(by.model('moneyInitializedWithString'));

			expect(input.getAttribute('value')).toEqual(currency+'3,53');
		});

		it('should format money with three decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,000', {reverse: true}),
				formatterModel =  new StringMask('###0.000', {reverse: true}),
				numberToFormat = '', currency = 'R$ ', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('money3Decimals')),
				value = element(by.binding('money3Decimals'));

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(currency + formatedNumberAsString);

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
				expect(input.getAttribute('value')).toEqual(currency + formatedNumberAsString);
			}
		});
	});
});

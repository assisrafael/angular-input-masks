var StringMask = require('./../lib/string-mask.js');

describe('ui.utils.masks', function() {
	beforeEach(function() {
		browser.get('/demo');
	});

	it('deveria carregar a página de demonstração', function() {
		expect(browser.getTitle()).toEqual('Angular Mask Demo');
	});

	describe('ui-number-mask', function() {
		it('deveria formatar números com 2 casas decimais (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWithDefaultDecimals')),
				value = element(by.binding('numberWithDefaultDecimals'));

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;
				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});

		it('deveria formatar números com 2 casas decimais (parâmetro)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith2Decimals')),
				value = element(by.binding('numberWith2Decimals'));

			expect(input.getAttribute('value')).toEqual('1.234,18');
			input.clear();

			for (var i = 1; i <= 5; i++) {
				input.sendKeys(i);
				numberToFormat += i;
				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 5; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});

		it('deveria formatar números com 3 casas decimais (parâmetro)', function() {
			var formatterView = new StringMask('#.##0,000', {reverse: true}),
				formatterModel =  new StringMask('###0.000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith3Decimals')),
				value = element(by.binding('numberWith3Decimals'));

			for (var i = 1; i <= 5; i++) {
				input.sendKeys(i);
				numberToFormat += i;
				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 5; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});

		it('deveria formatar números com 0 casas decimais (parâmetro)', function() {
			var formatterView = new StringMask('#.##0', {reverse: true}),
				formatterModel =  new StringMask('###0', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith0Decimals')),
				value = element(by.binding('numberWith0Decimals'));

			for (var i = 1; i <= 5; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 5; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);

				if(!numberToFormat) {
					formatedNumberAsString = '';
					formatedNumberAsNumber = '';
				}else {
					formatedNumberAsString = formatterView.apply(numberToFormat);
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				}

				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});
	});

	describe('ui-percentage-mask', function() {
		it('deveria formatar porcentagens com 2 casas decimais (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.0000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWithDefaultDecimals')),
				value = element(by.binding('percentageWithDefaultDecimals'));

			expect(input.getAttribute('value')).toEqual('76,54');
			input.clear();

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});

		it('deveria formatar porcentagens com 4 casas decimais (parâmetro)', function() {
			var formatterView = new StringMask('#.##0,0000', {reverse: true}),
				formatterModel =  new StringMask('###0.000000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWith4Decimals')),
				value = element(by.binding('percentageWith4Decimals'));

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});
	});
});

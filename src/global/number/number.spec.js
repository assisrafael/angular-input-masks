var StringMask = require('string-mask');

describe('ui.utils.masks.number', function() {
	it('should load the demo page', function() {
		browser.get('/src/global/number/number.html');
		expect(browser.getTitle()).toEqual('Number Spec');
	});

	describe('ui-number-mask:', function() {

		it('should format number with two decimal places (default)', function() {
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
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should format number with two decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith2Decimals')),
				value = element(by.binding('numberWith2Decimals'));

			expect(input.getAttribute('value')).toEqual('-1.234,18');
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
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should accept negative numbers when the ui-negative attribute is present', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith2Decimals')),
				value = element(by.binding('numberWith2Decimals'));

			input.sendKeys('123418-');
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys(9);
			expect(input.getAttribute('value')).toEqual('-12.341,89');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys('-');
			input.sendKeys(9);
			expect(input.getAttribute('value')).toEqual('12.341,89');
		});

		it('should not allow -0 parsing it to 0', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith2Decimals')),
				value = element(by.binding('numberWith2Decimals'));

			input.clear();
			input.sendKeys('123418-');
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('-123,41');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('-12,34');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('-1,23');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('-0,12');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('-0,01');
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('0,00');
			input.sendKeys(1);
			expect(input.getAttribute('value')).toEqual('0,01');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('-0,01');
			input.sendKeys(2);
			expect(input.getAttribute('value')).toEqual('-0,12');
			input.sendKeys(3);
			expect(input.getAttribute('value')).toEqual('-1,23');
			input.sendKeys(4);
			expect(input.getAttribute('value')).toEqual('-12,34');
			input.sendKeys(1);
			expect(input.getAttribute('value')).toEqual('-123,41');
			input.sendKeys(protractor.Key.BACK_SPACE);
			input.sendKeys(protractor.Key.BACK_SPACE);
			input.sendKeys(protractor.Key.BACK_SPACE);
			input.sendKeys(protractor.Key.BACK_SPACE);
			input.sendKeys(protractor.Key.BACK_SPACE);
			expect(input.getAttribute('value')).toEqual('0,00');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('0,00');
		});

		it('should not accept negative numbers when the ui-negative attribute is not present', function() {
			var formatterView = new StringMask('#.##0,000', {reverse: true}),
				formatterModel =  new StringMask('###0.000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith3Decimals')),
				value = element(by.binding('numberWith3Decimals'));

			input.sendKeys('1234.178');
			expect(input.getAttribute('value')).toEqual('1.234,178');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('1.234,178');
		});

		it('should format number with three decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,000', {reverse: true}),
				formatterModel =  new StringMask('###0.000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith3Decimals')),
				value = element(by.binding('numberWith3Decimals'));

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
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should format number without decimal places (parameter)', function() {
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

		it('should format number without thousands delimiters', function() {
			var formatterView = new StringMask('###0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWithoutGrupoSep')),
				value = element(by.binding('numberWithoutGrupoSep'));

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
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should accept 0 in all configurations', function() {
			var input = element(by.model('numberWithDefaultDecimals')),
				value = element(by.binding('numberWithDefaultDecimals'));

			input.clear();
			input.sendKeys(0);
			expect(input.getAttribute('value')).toEqual('0,00');
			expect(value.getText()).toEqual('0');

			input = element(by.model('numberWith2Decimals'));
			value = element(by.binding('numberWith2Decimals'));

			input.clear();
			input.sendKeys(0);
			expect(input.getAttribute('value')).toEqual('0,00');
			expect(value.getText()).toEqual('0');

			input = element(by.model('numberWith3Decimals'));
			value = element(by.binding('numberWith3Decimals'));

			input.clear();
			input.sendKeys(0);
			expect(input.getAttribute('value')).toEqual('0,000');
			expect(value.getText()).toEqual('0');
			input = element(by.model('numberWith0Decimals'));
			value = element(by.binding('numberWith0Decimals'));

			input.clear();
			input.sendKeys(0);
			expect(input.getAttribute('value')).toEqual('0');
			expect(value.getText()).toEqual('0');
		});

		it('should reformat number when decimals config changes', function() {
			var input = element(by.model('numberWithDynamicDecimals')),
				value = element(by.binding('numberWithDynamicDecimals')),
				decimalsInput = element(by.model('decimals'));

			input.sendKeys('123');
			expect(input.getAttribute('value')).toEqual('1,23');
			expect(value.getText()).toEqual('1.23');

			decimalsInput.sendKeys('3');
			expect(input.getAttribute('value')).toEqual('0,123');
			expect(value.getText()).toEqual('0.123');

			decimalsInput.clear();
			decimalsInput.sendKeys('0');
			expect(input.getAttribute('value')).toEqual('123');
			expect(value.getText()).toEqual('123');
		});
	});
});

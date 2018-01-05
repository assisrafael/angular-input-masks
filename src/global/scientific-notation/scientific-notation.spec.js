'use strict';

var StringMask = require('string-mask');

describe('uiScientificNotationMask', function() {
	it('should load the demo page', function() {
		browser.get('/src/global/scientific-notation/scientific-notation.html');
		expect(browser.getTitle()).toEqual('Scientific Notation Spec');
	});

	it('should format scientific notation number with two decimal places (default)', function() {
		var significandViewMask = new StringMask('0,00',{reverse:true}),
			significandToFormat = '',
			exponentToFormat = '',
			formatedSignificand;

		var input = element(by.model('scientificNotationMask')),
			value = element(by.exactBinding('scientificNotationMask'));

		var i;
		for (i = 1; i <= 3; i++) {
			input.sendKeys(i);
			significandToFormat += i;
			formatedSignificand = significandViewMask.apply(significandToFormat);
			expect(input.getAttribute('value')).toEqual(formatedSignificand);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		for (i = 1; i <= 3; i++) {
			input.sendKeys(i);
			exponentToFormat += i;
			expect(input.getAttribute('value')).toEqual(formatedSignificand + 'e' + exponentToFormat);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		for (i = 1; i < 3; i++) {
			input.sendKeys(protractor.Key.BACK_SPACE);
			exponentToFormat = exponentToFormat.slice(0, -1);
			expect(input.getAttribute('value')).toEqual(formatedSignificand + 'e' + exponentToFormat);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(input.getAttribute('value')).toEqual(formatedSignificand);
		for (i = 1; i < 3; i++) {
			input.sendKeys(protractor.Key.BACK_SPACE);
			significandToFormat = significandToFormat.slice(0, -1);
			formatedSignificand = significandViewMask.apply(significandToFormat);
			expect(input.getAttribute('value')).toEqual(formatedSignificand);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(input.getAttribute('value')).toEqual('0,00');
		expect(value.getText()).toEqual('0');
	});

	it('should format scientific notation number with four decimal places (parameter)', function() {
		var significandViewMask = new StringMask('0,0000',{reverse:true}),
			significandToFormat = '',
			exponentToFormat = '',
			formatedSignificand;

		var input = element(by.model('initializedScientificNotationMask')),
			value = element(by.exactBinding('initializedScientificNotationMask'));

		input.clear();
		var i;
		for (i = 1; i <= 5; i++) {
			input.sendKeys(i);
			significandToFormat += i;
			formatedSignificand = significandViewMask.apply(significandToFormat);
			expect(input.getAttribute('value')).toEqual(formatedSignificand);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		for (i = 1; i <= 3; i++) {
			input.sendKeys(i);
			exponentToFormat += i;
			expect(input.getAttribute('value')).toEqual(formatedSignificand + 'e' + exponentToFormat);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		for (i = 1; i < 3; i++) {
			input.sendKeys(protractor.Key.BACK_SPACE);
			exponentToFormat = exponentToFormat.slice(0, -1);
			expect(input.getAttribute('value')).toEqual(formatedSignificand + 'e' + exponentToFormat);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(input.getAttribute('value')).toEqual(formatedSignificand);
		for (i = 1; i < 5; i++) {
			input.sendKeys(protractor.Key.BACK_SPACE);
			significandToFormat = significandToFormat.slice(0, -1);
			formatedSignificand = significandViewMask.apply(significandToFormat);
			expect(input.getAttribute('value')).toEqual(formatedSignificand);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(input.getAttribute('value')).toEqual('0,0000');
		expect(value.getText()).toEqual('0');
	});

	it('should format number without decimal places (parameter)', function() {
		var significandToFormat = '',
			exponentToFormat = '',
			formatedSignificand;

		var input = element(by.model('scientificNotationMaskWithoutDigits')),
			value = element(by.exactBinding('scientificNotationMaskWithoutDigits'));

		input.sendKeys(7);
		significandToFormat = '7';
		formatedSignificand = '7';
		expect(input.getAttribute('value')).toEqual(significandToFormat);
		expect(value.getText()).toEqual(significandToFormat);

		var i;
		for (i = 1; i <= 3; i++) {
			input.sendKeys(i);
			exponentToFormat += i;
			expect(input.getAttribute('value')).toEqual(formatedSignificand + 'e' + exponentToFormat);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		for (i = 1; i < 3; i++) {
			input.sendKeys(protractor.Key.BACK_SPACE);
			exponentToFormat = exponentToFormat.slice(0, -1);
			expect(input.getAttribute('value')).toEqual(formatedSignificand + 'e' + exponentToFormat);
			expect(value.getText()).toMatch(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);
		}

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(input.getAttribute('value')).toEqual(formatedSignificand);

		input.sendKeys(protractor.Key.BACK_SPACE);
		expect(input.getAttribute('value')).toEqual('');
		expect(value.getText()).toEqual('');
	});

	it('should accept 0 in all configurations', function() {
		var input = element(by.model('scientificNotationMask')),
			value = element(by.exactBinding('scientificNotationMask'));

		input.clear();
		input.sendKeys(0);
		expect(input.getAttribute('value')).toEqual('0,00');
		expect(value.getText()).toEqual('0');

		input = element(by.model('initializedScientificNotationMask'));
		value = element(by.exactBinding('initializedScientificNotationMask'));

		input.clear();
		input.sendKeys(0);
		expect(input.getAttribute('value')).toEqual('0,0000');
		expect(value.getText()).toEqual('0');

		input = element(by.model('scientificNotationMaskWithoutDigits'));
		value = element(by.exactBinding('scientificNotationMaskWithoutDigits'));

		input.clear();
		input.sendKeys(0);
		expect(input.getAttribute('value')).toEqual('0');
		expect(value.getText()).toEqual('0');
	});

	it('should format numbers with negative exponent', function() {
		var input = element(by.model('scientificNotationMask')),
			value = element(by.exactBinding('scientificNotationMask'));

		input.clear();
		input.sendKeys('1234');
		expect(input.getAttribute('value')).toEqual('1,23e4');
		expect(value.getText()).toEqual('12300');
		input.sendKeys('-');
		expect(input.getAttribute('value')).toEqual('1,23e-4');
		expect(value.getText()).toEqual('0.000123');
	});

	it('should accept negative numbers when the ui-negative attribute is present', function() {
		var input = element(by.model('scientificNotationMaskWithNegativeNumber')),
			value = element(by.exactBinding('scientificNotationMaskWithNegativeNumber'));

		input.clear();

		input.sendKeys('1234');
		expect(input.getAttribute('value')).toEqual('1,23e4');
		expect(value.getText()).toEqual('12300');
		input.sendKeys('-');
		expect(input.getAttribute('value')).toEqual('1,23e-4');
		expect(value.getText()).toEqual('0.000123');
		input.sendKeys('-');
		expect(input.getAttribute('value')).toEqual('-1,23e4');
		expect(value.getText()).toEqual('-12300');
		input.sendKeys('-');
		expect(input.getAttribute('value')).toEqual('-1,23e-4');
		expect(value.getText()).toEqual('-0.000123');
		input.sendKeys('-');
		expect(input.getAttribute('value')).toEqual('1,23e4');
		expect(value.getText()).toEqual('12300');
	});
});

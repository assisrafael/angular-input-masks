var StringMask = require('string-mask');

describe('ui.utils.masks.us.phone', function () {
	it('should load the demo page', function () {
		browser.get('/src/us/phone/us-phone.html');
		expect(browser.getTitle()).toEqual('US Phone Number Spec');
	});

	describe('ui-us-phone-number:', function () {
		var runTests = function (input, value) {
			var BS = protractor.Key.BACK_SPACE;
			var tests = [
				{key: '1', viewValue: '(1', modelValue: '1'},
				{key: '2', viewValue: '(12', modelValue: '12'},
				{key: '3', viewValue: '(123', modelValue: '123'},
				{key: '4', viewValue: '(123) 4', modelValue: '1234'},
				{key: '5', viewValue: '(123) 45', modelValue: '12345'},
				{key: '6', viewValue: '(123) 456', modelValue: '123456'},
				{key: '7', viewValue: '(123) 456-7', modelValue: '1234567'},
				{key: '8', viewValue: '(123) 456-78', modelValue: '12345678'},
				{key: '9', viewValue: '(123) 456-789', modelValue: '123456789'},
				{key: '0', viewValue: '(123) 456-7890', modelValue: '1234567890'},
				{key: '1', viewValue: '+12-34-567-8901', modelValue: '12345678901'},
				{key: '2', viewValue: '+12-34-567-89012', modelValue: '123456789012'},
				{key: '3', viewValue: '+12-34-567-890123', modelValue: '1234567890123'},
				{key: BS, viewValue: '+12-34-567-89012', modelValue: '123456789012'},
				{key: BS, viewValue: '+12-34-567-8901', modelValue: '12345678901'},
				{key: BS, viewValue: '(123) 456-7890', modelValue: '1234567890'},
				{key: BS, viewValue: '(123) 456-789', modelValue: '123456789'},
				{key: BS, viewValue: '(123) 456-78', modelValue: '12345678'},
				{key: BS, viewValue: '(123) 456-7', modelValue: '1234567'},
				{key: BS, viewValue: '(123) 456', modelValue: '123456'},
				{key: BS, viewValue: '(123) 45', modelValue: '12345'},
				{key: BS, viewValue: '(123) 4', modelValue: '1234'},
				{key: BS, viewValue: '(123', modelValue: '123'},
				{key: BS, viewValue: '(12', modelValue: '12'},
				{key: BS, viewValue: '(1', modelValue: '1'},
				{key: BS, viewValue: '', modelValue: ''},
			];

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		}

		it('should apply a phone number mask while the user is typing:', function () {
			var input = element(by.id('us-phone-input')),
				value = element(by.id('us-phone-value'));

			runTests(input, value);
		});

		it('should apply a phone number mask in a model with default value:', function () {
			var input = element(by.id('init-us-phone-input')),
				value = element(by.id('init-us-phone-value'));

			expect(input.getAttribute('value')).toEqual('(313) 353-6767');
			input.clear();

			runTests(input, value);
		});
	});
});

var StringMask = require('string-mask');

describe('ui.utils.masks.us.phone', function() {
	beforeEach(function() {
		browser.get('/demo');
	});

	it('should load the demo page', function() {
		expect(browser.getTitle()).toEqual('Angular Mask US Phone Demo');
	});

	describe('ui-us-phone-number:', function() {
		it('should apply a phone number mask while the user is typing:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'(1', modelValue:'1'},
				{key:'2', viewValue:'(12', modelValue:'12'},
				{key:'3', viewValue:'(123)', modelValue:'123'},
				{key:'4', viewValue:'(123) 4', modelValue:'1234'},
				{key:'5', viewValue:'(123) 45', modelValue:'12345'},
				{key:'6', viewValue:'(123) 456', modelValue:'123456'},
				{key:'7', viewValue:'(123) 456-7', modelValue:'1234567'},
				{key:'8', viewValue:'(123) 456-78', modelValue:'12345678'},
				{key:'9', viewValue:'(123) 456-789', modelValue:'123456789'},
				{key:'0', viewValue:'(123) 456-7890', modelValue:'1234567890'},
				{key:BS, viewValue:'(123) 456-789', modelValue:'123456789'},
				{key:BS, viewValue:'(123) 456-78', modelValue:'12345678'},
				{key:BS, viewValue:'(123) 456-7', modelValue:'1234567'},
				{key:BS, viewValue:'(123) 456', modelValue:'123456'},
				{key:BS, viewValue:'(123) 45', modelValue:'12345'},
				{key:BS, viewValue:'(123) 4', modelValue:'1234'},
				{key:BS, viewValue:'(123)', modelValue:'123'},
				{key:BS, viewValue:'(12', modelValue:'12'},
				{key:BS, viewValue:'(1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('phoneNumberUS')),
				value = element(by.binding('phoneNumberUS'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a phone number mask in a model with default value:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'(1', modelValue:'1'},
				{key:'2', viewValue:'(12', modelValue:'12'},
				{key:'3', viewValue:'(123) ', modelValue:'123'},
				{key:'4', viewValue:'(123) 4', modelValue:'1234'},
				{key:'5', viewValue:'(123) 45', modelValue:'12345'},
				{key:'6', viewValue:'(123) 456', modelValue:'123456'},
				{key:'7', viewValue:'(123) 456-7', modelValue:'1234567'},
				{key:BS, viewValue:'(123) 456', modelValue:'123456'},
				{key:BS, viewValue:'(123) 45', modelValue:'12345'},
				{key:BS, viewValue:'(123) 4', modelValue:'1234'},
				{key:BS, viewValue:'(123) ', modelValue:'123'},
				{key:BS, viewValue:'(12', modelValue:'12'},
				{key:BS, viewValue:'(1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('initializedPhoneNumberUS')),
				value = element(by.binding('initializedPhoneNumberUS'));

			expect(input.getAttribute('value')).toEqual('(313) 353-6767');
			input.clear();

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});
	});
});

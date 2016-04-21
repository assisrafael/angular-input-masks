'use strict';

describe('ui.utils.masks.number', function() {
	it('should load the demo page', function() {
		browser.get('/src/ch/phone/ch-phone.html');
		expect(browser.getTitle()).toEqual('CH Phone Number Spec');
	});

	describe('ui-ch-phone-number:', function() {
		it('should apply a phone number mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'+1', modelValue:'1'},
				{key:'2', viewValue:'+12', modelValue:'12'},
				{key:'3', viewValue:'+12 3', modelValue:'123'},
				{key:'4', viewValue:'+12 34', modelValue:'1234'},
				{key:'5', viewValue:'+12 34 5', modelValue:'12345'},
				{key:'6', viewValue:'+12 34 56', modelValue:'123456'},
				{key:'7', viewValue:'+12 34 567', modelValue:'1234567'},
				{key:'8', viewValue:'+12 34 567 8', modelValue:'12345678'},
				{key:'9', viewValue:'+12 34 567 89', modelValue:'123456789'},
				{key:'0', viewValue:'+12 34 567 89 0', modelValue:'1234567890'},
				{key:'1', viewValue:'+12 34 567 89 01', modelValue:'12345678901'},
				{key:'2', viewValue:'+12 34 567 89 01', modelValue:'12345678901'},
				{key:BS, viewValue:'+12 34 567 89 0', modelValue:'1234567890'},
				{key:BS, viewValue:'+12 34 567 89 ', modelValue:'123456789'},
				{key:BS, viewValue:'+12 34 567 89', modelValue:'123456789'},
				{key:BS, viewValue:'+12 34 567 8', modelValue:'12345678'},
				{key:BS, viewValue:'+12 34 567 ', modelValue:'1234567'},
				{key:BS, viewValue:'+12 34 567', modelValue:'1234567'},
				{key:BS, viewValue:'+12 34 56', modelValue:'123456'},
				{key:BS, viewValue:'+12 34 5', modelValue:'12345'},
				{key:BS, viewValue:'+12 34 ', modelValue:'1234'},
				{key:BS, viewValue:'+12 34', modelValue:'1234'},
				{key:BS, viewValue:'+12 3', modelValue:'123'},
				{key:BS, viewValue:'+12 ', modelValue:'12'},
				{key:BS, viewValue:'+12', modelValue:'12'},
				{key:BS, viewValue:'+1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('phoneNumber')),
				value = element(by.exactBinding('phoneNumber'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a phone number mask in a model with default value:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'+1', modelValue:'1'},
				{key:'2', viewValue:'+12', modelValue:'12'},
				{key:'3', viewValue:'+12 3', modelValue:'123'},
				{key:'4', viewValue:'+12 34', modelValue:'1234'},
				{key:'5', viewValue:'+12 34 5', modelValue:'12345'},
				{key:'6', viewValue:'+12 34 56', modelValue:'123456'},
				{key:'7', viewValue:'+12 34 567', modelValue:'1234567'},
				{key:BS, viewValue:'+12 34 56', modelValue:'123456'},
				{key:BS, viewValue:'+12 34 5', modelValue:'12345'},
				{key:BS, viewValue:'+12 34 ', modelValue:'1234'},
				{key:BS, viewValue:'+12 34', modelValue:'1234'},
				{key:BS, viewValue:'+12 3', modelValue:'123'},
				{key:BS, viewValue:'+12 ', modelValue:'12'},
				{key:BS, viewValue:'+12', modelValue:'12'},
				{key:BS, viewValue:'+1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('initializedPhoneNumber')),
				value = element(by.exactBinding('initializedPhoneNumber'));

			expect(input.getAttribute('value')).toEqual('+41 79 000 00 00');
			input.clear();

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});
	});
});

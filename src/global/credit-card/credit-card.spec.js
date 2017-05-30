'use strict';

describe('ui.utils.masks.number', function() {
	it('should load the demo page', function() {
		browser.get('/src/global/credit-card/credit-card.html');
		expect(browser.getTitle()).toEqual('Credit Card Spec');
	});

	describe('ui-credit-card:', function() {
		it('should apply a credit card number mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue:'1'},
				{key:'2', viewValue:'12', modelValue:'12'},
				{key:'3', viewValue:'123', modelValue:'123'},
				{key:'4', viewValue:'1234', modelValue:'1234'},
				{key:'5', viewValue:'1234 5', modelValue:'12345'},
				{key:'6', viewValue:'1234 56', modelValue:'123456'},
				{key:'7', viewValue:'1234 567', modelValue:'1234567'},
				{key:'8', viewValue:'1234 5678', modelValue:'12345678'},
				{key:'9', viewValue:'1234 5678 9', modelValue:'123456789'},
				{key:'0', viewValue:'1234 5678 90', modelValue:'1234567890'},
				{key:'1', viewValue:'1234 5678 901', modelValue:'12345678901'},
				{key:'2', viewValue:'1234 5678 9012', modelValue:'123456789012'},
				{key:'3', viewValue:'1234 5678 9012 3', modelValue:'1234567890123'},
				{key:'4', viewValue:'1234 5678 9012 34', modelValue:'12345678901234'},
				{key:'5', viewValue:'1234 5678 9012 345', modelValue:'123456789012345'},
				{key:'6', viewValue:'1234 5678 9012 3456', modelValue:'1234567890123456'},
				{key:'7', viewValue:'1234 5678 9012 3456', modelValue:'1234567890123456'},
				{key:BS,  viewValue:'1234 5678 9012 345', modelValue:'123456789012345'},
				{key:BS,  viewValue:'1234 5678 9012 34', modelValue:'12345678901234'},
				{key:BS,  viewValue:'1234 5678 9012 3', modelValue:'1234567890123'},
				{key:BS,  viewValue:'1234 5678 9012 ', modelValue:'123456789012'},
				{key:BS,  viewValue:'1234 5678 9012', modelValue:'123456789012'},
				{key:BS,  viewValue:'1234 5678 901', modelValue:'12345678901'},
				{key:BS,  viewValue:'1234 5678 90', modelValue:'1234567890'},
				{key:BS,  viewValue:'1234 5678 9', modelValue:'123456789'},
				{key:BS,  viewValue:'1234 5678 ', modelValue:'12345678'},
				{key:BS,  viewValue:'1234 5678', modelValue:'12345678'},
				{key:BS,  viewValue:'1234 567', modelValue:'1234567'},
				{key:BS,  viewValue:'1234 56', modelValue:'123456'},
				{key:BS,  viewValue:'1234 5', modelValue:'12345'},
				{key:BS,  viewValue:'1234 ', modelValue:'1234'},
				{key:BS,  viewValue:'1234', modelValue:'1234'},
				{key:BS,  viewValue:'123', modelValue:'123'},
				{key:BS,  viewValue:'12', modelValue:'12'},
				{key:BS,  viewValue:'1', modelValue:'1'},
				{key:BS,  viewValue:'', modelValue:''},
			];

			var input = element(by.model('creditCard')),
				value = element(by.exactBinding('creditCard'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a credit card number mask in a model with default value:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue:'1'},
				{key:'2', viewValue:'12', modelValue:'12'},
				{key:'3', viewValue:'123', modelValue:'123'},
				{key:'4', viewValue:'1234', modelValue:'1234'},
				{key:'5', viewValue:'1234 5', modelValue:'12345'},
				{key:'6', viewValue:'1234 56', modelValue:'123456'},
				{key:'7', viewValue:'1234 567', modelValue:'1234567'},
				{key:BS, viewValue:'1234 56', modelValue:'123456'},
				{key:BS, viewValue:'1234 5', modelValue:'12345'},
				{key:BS, viewValue:'1234 ', modelValue:'1234'},
				{key:BS, viewValue:'1234', modelValue:'1234'},
				{key:BS, viewValue:'123', modelValue:'123'},
				{key:BS, viewValue:'12', modelValue:'12'},
				{key:BS, viewValue:'1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('initializedCC')),
				value = element(by.exactBinding('initializedCC'));

			expect(input.getAttribute('value')).toEqual('4242 4242 4242 4242');
			input.clear();

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});
	});
});

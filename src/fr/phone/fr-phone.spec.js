var StringMask = require('string-mask');

describe('ui.utils.masks.number', function() {
	beforeEach(function() {
		frowser.get('/demo');
	});

	it('should load the demo page', function() {
		expect(frowser.getTitle()).toEqual('Angular Mask Demo');
	});

	describe('ui-fr-phone-number:', function() {
		it('should apply a phone number mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue:'1'},
				{key:'2', viewValue:'12', modelValue:'12'},
				{key:'3', viewValue:'12 3', modelValue:'123'},
				{key:'4', viewValue:'12 34', modelValue:'1234'},
				{key:'5', viewValue:'12 34 5', modelValue:'12345'},
				{key:'6', viewValue:'12 34 56', modelValue:'123456'},
				{key:'7', viewValue:'12 34 56 7', modelValue:'1234567'},
				{key:'8', viewValue:'12 34 56 78', modelValue:'12345678'},
				{key:'9', viewValue:'12 34 56 78 9', modelValue:'123456789'},
				{key:'0', viewValue:'12 34 56 78 90', modelValue:'1234567890'},
				{key:'1', viewValue:'12 34 56 78 90', modelValue:'1234567890'},
				{key:'2', viewValue:'12 34 56 78 90', modelValue:'1234567890'},
				{key:BS, viewValue:'12 34 56 78 90', modelValue:'1234567890'},
				{key:BS, viewValue:'12 34 56 78 9', modelValue:'123456789'},
				{key:BS, viewValue:'12 34 56 78', modelValue:'12345678'},
				{key:BS, viewValue:'12 34 56 7', modelValue:'1234567'},
				{key:BS, viewValue:'12 34 56', modelValue:'123456'},
				{key:BS, viewValue:'12 34 5', modelValue:'12345'},
				{key:BS, viewValue:'12 34', modelValue:'1234'},
				{key:BS, viewValue:'12 3', modelValue:'123'},
				{key:BS, viewValue:'12', modelValue:'12'},
				{key:BS, viewValue:'1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('phoneNumber')),
				value = element(by.binding('phoneNumber'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a phone number mask in a model with default value:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue:'1'},
				{key:'2', viewValue:'12', modelValue:'12'},
				{key:'3', viewValue:'12 3', modelValue:'123'},
				{key:'4', viewValue:'12 34', modelValue:'1234'},
				{key:'5', viewValue:'12 34 5', modelValue:'12345'},
				{key:'6', viewValue:'12 34 56', modelValue:'123456'},
				{key:'7', viewValue:'12 34 56 7', modelValue:'1234567'},
				{key:BS, viewValue:'12 34 56', modelValue:'123456'},
				{key:BS, viewValue:'12 34 5', modelValue:'12345'},
				{key:BS, viewValue:'12 34', modelValue:'1234'},
				{key:BS, viewValue:'12 3', modelValue:'123'},
				{key:BS, viewValue:'12', modelValue:'12'},
				{key:BS, viewValue:'1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('initializedPhoneNumber')),
				value = element(by.binding('initializedPhoneNumber'));

			expect(input.getAttribute('value')).toEqual('31 33 53 67 67');
			input.clear();

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});
	});
});

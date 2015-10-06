var StringMask = require('string-mask');

describe('ui.utils.masks.number', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/phone/br-phone.html');
		expect(browser.getTitle()).toEqual('BR Phone Number Spec');
	});

	describe('ui-br-phone-number:', function() {
		it('should apply a 0800 phone number mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'0', viewValue:'(0', modelValue:'0'},
				{key:'8', viewValue:'(08', modelValue:'08'},
				{key:'0', viewValue:'(08) 0', modelValue:'080'},
				{key:'0', viewValue:'0800', modelValue:'0800'},
				{key:'1', viewValue:'0800-1', modelValue:'08001'},
				{key:'2', viewValue:'0800-12', modelValue:'080012'},
				{key:'3', viewValue:'0800-123', modelValue:'0800123'},
				{key:'1', viewValue:'0800-123-1', modelValue:'08001231'},
				{key:'2', viewValue:'0800-123-12', modelValue:'080012312'},
				{key:'3', viewValue:'0800-123-123', modelValue:'0800123123'},
				{key:'4', viewValue:'0800-123-1234', modelValue:'08001231234'},
				{key:'5', viewValue:'0800-123-1234', modelValue:'08001231234'},
				{key:BS, viewValue:'0800-123-123', modelValue:'0800123123'},
				{key:BS, viewValue:'0800-123-12', modelValue:'080012312'},
				{key:BS, viewValue:'0800-123-1', modelValue:'08001231'},
				{key:BS, viewValue:'0800-123', modelValue:'0800123'},
				{key:BS, viewValue:'0800-12', modelValue:'080012'},
				{key:BS, viewValue:'0800-1', modelValue:'08001'},
				{key:BS, viewValue:'0800', modelValue:'0800'},
				{key:BS, viewValue:'(08) 0', modelValue:'080'},
				{key:BS, viewValue:'(08', modelValue:'08'},
				{key:BS, viewValue:'(0', modelValue:'0'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('freeLinePhoneNumber')),
				value = element(by.exactBinding('freeLinePhoneNumber'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a phone number mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'(1', modelValue:'1'},
				{key:'2', viewValue:'(12', modelValue:'12'},
				{key:'3', viewValue:'(12) 3', modelValue:'123'},
				{key:'4', viewValue:'(12) 34', modelValue:'1234'},
				{key:'5', viewValue:'(12) 345', modelValue:'12345'},
				{key:'6', viewValue:'(12) 3456', modelValue:'123456'},
				{key:'7', viewValue:'(12) 3456-7', modelValue:'1234567'},
				{key:'8', viewValue:'(12) 3456-78', modelValue:'12345678'},
				{key:'9', viewValue:'(12) 3456-789', modelValue:'123456789'},
				{key:'0', viewValue:'(12) 3456-7890', modelValue:'1234567890'},
				{key:'1', viewValue:'(12) 34567-8901', modelValue:'12345678901'},
				{key:'2', viewValue:'(12) 34567-8901', modelValue:'12345678901'},
				{key:BS, viewValue:'(12) 3456-7890', modelValue:'1234567890'},
				{key:BS, viewValue:'(12) 3456-789', modelValue:'123456789'},
				{key:BS, viewValue:'(12) 3456-78', modelValue:'12345678'},
				{key:BS, viewValue:'(12) 3456-7', modelValue:'1234567'},
				{key:BS, viewValue:'(12) 3456', modelValue:'123456'},
				{key:BS, viewValue:'(12) 345', modelValue:'12345'},
				{key:BS, viewValue:'(12) 34', modelValue:'1234'},
				{key:BS, viewValue:'(12) 3', modelValue:'123'},
				{key:BS, viewValue:'(12', modelValue:'12'},
				{key:BS, viewValue:'(1', modelValue:'1'},
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
				{key:'1', viewValue:'(1', modelValue:'1'},
				{key:'2', viewValue:'(12', modelValue:'12'},
				{key:'3', viewValue:'(12) 3', modelValue:'123'},
				{key:'4', viewValue:'(12) 34', modelValue:'1234'},
				{key:'5', viewValue:'(12) 345', modelValue:'12345'},
				{key:'6', viewValue:'(12) 3456', modelValue:'123456'},
				{key:'7', viewValue:'(12) 3456-7', modelValue:'1234567'},
				{key:BS, viewValue:'(12) 3456', modelValue:'123456'},
				{key:BS, viewValue:'(12) 345', modelValue:'12345'},
				{key:BS, viewValue:'(12) 34', modelValue:'1234'},
				{key:BS, viewValue:'(12) 3', modelValue:'123'},
				{key:BS, viewValue:'(12', modelValue:'12'},
				{key:BS, viewValue:'(1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('initializedPhoneNumber')),
				value = element(by.exactBinding('initializedPhoneNumber'));

			expect(input.getAttribute('value')).toEqual('(31) 3353-6767');
			input.clear();

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});
	});
});

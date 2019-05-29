'use strict';

describe('uiBrNumeroBeneficioMask', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/numero-beneficio/numero-beneficio.html');
		expect(browser.getTitle()).toEqual('Número Benefício Spec');
	});

	it('should apply a Número Benefício mask while the user is typping:', function() {
		var BS = protractor.Key.BACK_SPACE;

		var tests = [
			{key:'-', viewValue:'', modelValue: ''},
			{key:'3', viewValue:'3', modelValue: '3'},
			{key:'5', viewValue:'3-5', modelValue: '35'},
			{key:'2', viewValue:'35-2', modelValue: '352'},
			{key:'4', viewValue:'352-4', modelValue: '3524'},
			{key:'4', viewValue:'3.524-4', modelValue: '35244'},
			{key:'4', viewValue:'35.244-4', modelValue: '352444'},
			{key:'5', viewValue:'352.444-5', modelValue: '3524445'},
			{key:'7', viewValue:'3.524.445-7', modelValue: '35244457'},
			{key:'6', viewValue:'35.244.457-6', modelValue: '352444576'},
			{key:'4', viewValue:'352.444.576-4', modelValue: '3524445764'},
			{key:'0', viewValue:'352.444.576-4', modelValue: '3524445764'},
			{key:BS, viewValue:'35.244.457-6', modelValue: '352444576'},
			{key:BS, viewValue:'3.524.445-7', modelValue: '35244457'},
			{key:BS, viewValue:'352.444-5', modelValue: '3524445'},
			{key:BS, viewValue:'35.244-4', modelValue: '352444'},
			{key:BS, viewValue:'3.524-4', modelValue: '35244'},
			{key:BS, viewValue:'352-4', modelValue: '3524'},
			{key:BS, viewValue:'35-2', modelValue: '352'},
			{key:BS, viewValue:'3-5', modelValue: '35'},
			{key:BS, viewValue:'3', modelValue: '3'},
		];

		var input = element(by.model('fieldNumeroBeneficio')),
			value = element(by.binding('fieldNumeroBeneficio'));

		for (var i = 0; i < tests.length; i++) {
			input.sendKeys(tests[i].key);
			expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
			expect(value.getText()).toEqual(tests[i].modelValue);
		}
	});
});

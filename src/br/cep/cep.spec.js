var StringMask = require('string-mask');

describe('ui.utils.masks.br.cep', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/cep/cep.html');
		expect(browser.getTitle()).toEqual('CEP Spec');
	});

	describe('ui-br-cep-mask:', function() {
		it('should apply a CEP mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'@', viewValue:'', modelValue:''},
				{key:'3', viewValue:'3', modelValue:'3'},
				{key:'0', viewValue:'30', modelValue:'30'},
				{key:'1', viewValue:'301', modelValue:'301'},
				{key:'1', viewValue:'3011', modelValue:'3011'},
				{key:'2', viewValue:'30112', modelValue:'30112'},
				{key:'-', viewValue:'30112', modelValue:'30112'},
				{key:'0', viewValue:'30112-0', modelValue:'301120'},
				{key:'1', viewValue:'30112-01', modelValue:'3011201'},
				{key:'0', viewValue:'30112-010', modelValue:'30112010'},
				{key:'9', viewValue:'30112-010', modelValue:'30112010'},
				{key:BS, viewValue:'30112-01', modelValue:'3011201'},
				{key:BS, viewValue:'30112-0', modelValue:'301120'},
				{key:BS, viewValue:'30112', modelValue:'30112'},
				{key:BS, viewValue:'3011', modelValue:'3011'},
				{key:BS, viewValue:'301', modelValue:'301'},
				{key:BS, viewValue:'30', modelValue:'30'},
				{key:BS, viewValue:'3', modelValue:'3'}
			];

			var input = element(by.model('cep')),
				value = element(by.binding('cep'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a CEP mask in a model with default value:', function() {
			var input = element(by.model('initializedCep')),
				value = element(by.binding('initializedCep'));

			expect(input.getAttribute('value')).toEqual('30112-010');
		});
	});
});

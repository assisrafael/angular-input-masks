var StringMask = require('string-mask');

describe('ui.utils.masks.cpfCnpj', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/cpf-cnpj/cpf-cnpj.html');
		expect(browser.getTitle()).toEqual('CPF-CNPJ Spec');
	});

	describe('ui-br-cpfcnpj:', function() {
		it('should apply a CPF/CNPJ mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue: '1'},
				{key:'3', viewValue:'13', modelValue: '13'},
				{key:'8', viewValue:'138', modelValue: '138'},
				{key:'8', viewValue:'138.8', modelValue: '1388'},
				{key:'3', viewValue:'138.83', modelValue: '13883'},
				{key:'8', viewValue:'138.838', modelValue: '138838'},
				{key:'7', viewValue:'138.838.7', modelValue: '1388387'},
				{key:'5', viewValue:'138.838.75', modelValue: '13883875'},
				{key:'0', viewValue:'138.838.750', modelValue: '138838750'},
				{key:'0', viewValue:'138.838.750-0', modelValue: '1388387500'},
				{key:'0', viewValue:'138.838.750-00', modelValue: '13883875000'},

				{key:'1', viewValue:'13.883.875/0001', modelValue: '138838750001'},
				{key:'2', viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
				{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
				{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
				{key:BS, viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
				{key:BS, viewValue:'13.883.875/0001', modelValue: '138838750001'},

				{key:BS, viewValue:'138.838.750-00', modelValue: '13883875000'},
				{key:BS, viewValue:'138.838.750-0', modelValue: '1388387500'},
				{key:BS, viewValue:'138.838.750', modelValue: '138838750'},
				{key:BS, viewValue:'138.838.75', modelValue: '13883875'},
				{key:BS, viewValue:'138.838.7', modelValue: '1388387'},
				{key:BS, viewValue:'138.838', modelValue: '138838'},
				{key:BS, viewValue:'138.83', modelValue: '13883'},
				{key:BS, viewValue:'138.8', modelValue: '1388'},
				{key:BS, viewValue:'138', modelValue: '138'},
				{key:BS, viewValue:'13', modelValue: '13'},
				{key:BS, viewValue:'1', modelValue: '1'}
			];

			var input = element(by.model('cpfcnpj')),
				value = element(by.binding('cpfcnpj'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a CPFCNPJ mask in a model with default CPF value:', function() {
			var input = element(by.model('initializedCpfCnpj1')),
				value = element(by.binding('initializedCpfCnpj1'));

			expect(input.getAttribute('value')).toEqual('563.383.329-58');
		});

		it('should apply a CPFCNPJ mask in a model with default CNPJ value:', function() {
			var input = element(by.model('initializedCpfCnpj2')),
				value = element(by.binding('initializedCpfCnpj2'));

			expect(input.getAttribute('value')).toEqual('23.212.161/0001-44');
		});
	});
});

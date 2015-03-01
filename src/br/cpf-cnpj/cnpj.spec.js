var StringMask = require('string-mask');

describe('ui-br-cnpj:', function() {
	beforeEach(function() {
		browser.get('/demo');
	});

	it('should apply a CNPJ mask while the user is typping:', function() {
		var BS = protractor.Key.BACK_SPACE;

		var tests = [
			{key:'1', viewValue:'1', modelValue: '1'},
			{key:'3', viewValue:'13', modelValue: '13'},
			{key:'8', viewValue:'13.8', modelValue: '138'},
			{key:'8', viewValue:'13.88', modelValue: '1388'},
			{key:'3', viewValue:'13.883', modelValue: '13883'},
			{key:'8', viewValue:'13.883.8', modelValue: '138838'},
			{key:'7', viewValue:'13.883.87', modelValue: '1388387'},
			{key:'5', viewValue:'13.883.875', modelValue: '13883875'},
			{key:'0', viewValue:'13.883.875/0', modelValue: '138838750'},
			{key:'0', viewValue:'13.883.875/00', modelValue: '1388387500'},
			{key:'0', viewValue:'13.883.875/000', modelValue: '13883875000'},
			{key:'1', viewValue:'13.883.875/0001', modelValue: '138838750001'},
			{key:'2', viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
			{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
			{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
			{key:BS, viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
			{key:BS, viewValue:'13.883.875/0001', modelValue: '138838750001'},
			{key:BS, viewValue:'13.883.875/000', modelValue: '13883875000'},
			{key:BS, viewValue:'13.883.875/00', modelValue: '1388387500'},
			{key:BS, viewValue:'13.883.875/0', modelValue: '138838750'},
			{key:BS, viewValue:'13.883.875', modelValue: '13883875'},
			{key:BS, viewValue:'13.883.87', modelValue: '1388387'},
			{key:BS, viewValue:'13.883.8', modelValue: '138838'},
			{key:BS, viewValue:'13.883', modelValue: '13883'},
			{key:BS, viewValue:'13.88', modelValue: '1388'},
			{key:BS, viewValue:'13.8', modelValue: '138'},
			{key:BS, viewValue:'13', modelValue: '13'},
			{key:BS, viewValue:'1', modelValue: '1'}
		];

		var input = element(by.model('fieldCnpj')),
			value = element(by.binding('fieldCnpj'));

		for (var i = 0; i < tests.length; i++) {
			input.sendKeys(tests[i].key);
			expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
			expect(value.getText()).toEqual(tests[i].modelValue);
		}
	});

	it('should apply a CNPJ mask in a model with default value:', function() {
		var input = element(by.model('initializedCnpj')),
			value = element(by.binding('initializedCnpj'));

		expect(input.getAttribute('value')).toEqual('13.883.875/0001-20');
		input.clear();
	});
});

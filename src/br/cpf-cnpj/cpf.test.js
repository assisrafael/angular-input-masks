describe('ui-br-cpf', function() {
	beforeEach(module('ui.utils.masks.br.cpfCnpj'));

	it('should not throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-cpf-mask>');
		}).not.toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-cpf-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 2);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	//FIXME: br-validations is not being properly loaded
	xit('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cpf-mask>', {
			model: '35244457640'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('352.444.576-40');
	});
});

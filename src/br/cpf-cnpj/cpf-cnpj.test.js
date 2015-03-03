describe('ui-br-cpfcnpj', function() {
	beforeEach(module('ui.utils.masks.br.cpfCnpj'));

	it('should not throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-cpfcnpj-mask>');
		}).not.toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-cpfcnpj-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 2);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});
});

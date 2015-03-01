describe('ui-br-ie-mask', function() {
	beforeEach(module('ui.utils.masks.br.ie'));

	it('should not throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-ie-mask>');
		}).not.toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-ie-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});
});

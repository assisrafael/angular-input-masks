describe('ui-nfe-access-key-mask', function() {
	beforeEach(module('ui.utils.masks.br.nfe'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-nfe-access-key-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-nfe-access-key-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 2);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 2);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-nfe-access-key-mask>', {
			model: '34958723405162304548623240917012593348590495'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('3495 8723 4051 6230 4548 6232 4091 7012 5933 4859 0495');
	});
});

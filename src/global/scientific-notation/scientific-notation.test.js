describe('ui-scientific-notation-mask', function() {
	beforeEach(module('ui.utils.masks.global.scientific-notation'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-scientific-notation-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-scientific-notation-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 2);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 2);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask>', {
			model: 12345.67890123456
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1.23e4');
	});
});

describe('ui-br-ie-mask', function() {
	beforeEach(module('ui.utils.masks.br.ie'));

	it('should not throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-ie-mask="\'MG\'">');
		}).not.toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-ie-mask="\'MG\'">');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	//FIXME: br-validations is not being properly loaded
	xit('should format initial model value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-ie-mask="\'MG\'">', {
			model: '0623079040081'
		});
		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('062.307.904/0081');
	});
});

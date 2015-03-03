describe('ui-date-mask', function() {
	beforeEach(module('ui.utils.masks.global.date'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-date-mask>');
		}).toThrow();
	});

	it('should throw an error if moment.js is not found', function() {
		var _globalMomentJS = globalMomentJS;
		globalMomentJS = undefined;
		expect(function() {
			TestUtil.compile('<input ng-model="model" ui-date-mask>');
		}).toThrow();
		globalMomentJS = _globalMomentJS;
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-date-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-date-mask>', {
			model: new Date('1999-12-31')
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1999-12-31');
	});
});

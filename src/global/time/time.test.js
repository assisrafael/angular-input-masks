require('../global-masks');

describe('ui-time-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-time-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-time-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-time-mask>', {
			model: '142645'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('14:26:45');
	});

	it('should format initial model values (short mode)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-time-mask="short">', {
			model: '142645'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('14:26');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}" ui-time-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'2', modelValue:'2'},
			{value:'23a', viewValue:'23', modelValue:'23'},
			{value:'23_34', viewValue:'23:34', modelValue:'23:34'},
			{value:'23346!324', viewValue:'23:34:63', modelValue:'23:34:63'}
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

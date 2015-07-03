require('../br-masks');

describe('ui-br-cep-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-cep-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-cep-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cep-mask>', {
			model: '30112010'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('30112-010');
	});

	it('should accept formatted initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cep-mask>', {
			model: '30112-010'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('30112-010');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}" ui-br-cep-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'2', modelValue:'2'},
			{value:'23a', viewValue:'23', modelValue:'23'},
			{value:'23_34', viewValue:'2334', modelValue:'2334'},
			{value:'23346!', viewValue:'23346', modelValue:'23346'},
			{value:'23346!324', viewValue:'23346-324', modelValue:'23346324'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

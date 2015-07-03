require('../br-masks');

describe('ui-nfe-access-key-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

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

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-nfe-access-key-mask>', {
			model: '34958723405162304548623240917012593348590495'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('3495 8723 4051 6230 4548 6232 4091 7012 5933 4859 0495');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-nfe-access-key-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'2', modelValue:'2'},
			{value:'23a', viewValue:'23', modelValue:'23'},
			{value:'23_34', viewValue:'2334', modelValue:'2334'},
			{value:'23346!324', viewValue:'2334 6324', modelValue:'23346324'},
			{value:'23346!324sdfg9870', viewValue:'2334 6324 9870', modelValue:'233463249870'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

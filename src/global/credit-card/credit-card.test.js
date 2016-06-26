'use strict';

require('../global-masks');

describe('ui-credit-card', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-credit-card>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-credit-card>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-credit-card>', {
			model: '4242424242424242'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('4242 4242 4242 4242');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-credit-card>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'2', modelValue:'2'},
			{value:'23a', viewValue:'23', modelValue:'23'},
			{value:'23_34', viewValue:'2334', modelValue:'2334'},
			{value:'23346!', viewValue:'2334 6', modelValue:'23346'},
			{value:'23346!324', viewValue:'2334 6324', modelValue:'23346324'},
			{value:'23346!324a32', viewValue:'2334 6324 32', modelValue:'2334632432'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});

	it('should validate a credit card number', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-credit-card>', {
			model: '417900'
		});

		var model = input.controller('ngModel');
		expect(model.$error.creditCard).toBe(true);
		input.val('1111222244445555').triggerHandler('input');
		expect(model.$error.creditCard).toBeUndefined();
	});

	it('should use the type of the model value (if initialized)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-credit-card>', {
			model: '7777333300008888'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('7777 3333 0000 8888');
		expect(model.$modelValue).toBe('7777333300008888');
		input.val('1234098712340987').triggerHandler('input');
		expect(model.$viewValue).toBe('1234 0987 1234 0987');
		expect(model.$modelValue).toBe('1234098712340987');
	});
});

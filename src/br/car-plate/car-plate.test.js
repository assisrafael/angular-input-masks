'use strict';

require('../br-masks');

describe('ui-br-car-plate-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-car-plate-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-car-plate-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-car-plate-mask>', {
			model: 'ABC2010'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('ABC-2010');
	});

	it('should accept formatted initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-car-plate-mask>', {
			model: 'ABC-2010'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('ABC-2010');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model"' +
		'ng-model-options="{allowInvalid:true}" ui-br-car-plate-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'A-', viewValue:'A', modelValue:'A'},
			{value:'ABC_2', viewValue:'ABC-2', modelValue:'ABC2'},
			{value:'ABC!2', viewValue:'ABC-2', modelValue:'ABC2'},
			{value:'ABC!2324', viewValue:'ABC-2324', modelValue:'ABC2324'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

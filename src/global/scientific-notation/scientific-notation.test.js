'use strict';

require('../global-masks');

describe('uiScientificNotationMask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

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

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask>', {
			model: 12345.67890123456
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1.23e4');
	});

	it('should format initial model values with 0 decimals', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask="0">', {
			model: 12345.67890123456
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1e4');
	});

	it('should format initial model values with 3 decimals', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask="3">', {
			model: 12345.67890123456
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1.235e4');
	});

	it('should format initial model values with negative exponent', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask>', {
			model: 1.3456e-3
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1.35e-3');
	});

	it('should format input', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask>');
		var model = input.controller('ngModel');

		input.val('123').triggerHandler('input');
		expect(model.$viewValue).toBe('1.23');
		expect(model.$modelValue).toBe(1.23);
		input.val('1.2345').triggerHandler('input');
		expect(model.$viewValue).toBe('1.23e45');
		expect(model.$modelValue).toBe(1.23e45);
		input.val('1.2345e-9').triggerHandler('input');
		expect(model.$viewValue).toBe('1.23e-9');
		expect(model.$modelValue).toBe(1.23e-9);
	});

	it('should accept negative numbers if "ui-negative-number" is defined', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask ui-negative-number>', {
			model: -1.3456e3
		});
		var model = input.controller('ngModel');

		expect(model.$viewValue).toBe('-1.35e3');
		expect(model.$modelValue).toBe(-1345.6);

		input.val('-1.23e45').triggerHandler('input');
		expect(model.$viewValue).toBe('-1.23e45');
		expect(model.$modelValue).toBe(-1.23e45);

		input.val('1.23e45-').triggerHandler('input');
		expect(model.$viewValue).toBe('1.23e-45');
		expect(model.$modelValue).toBe(1.23e-45);

		input.val('1.23e-45-').triggerHandler('input');
		expect(model.$viewValue).toBe('-1.23e45');
		expect(model.$modelValue).toBe(-1.23e45);

		input.val('-1.23e45-').triggerHandler('input');
		expect(model.$viewValue).toBe('-1.23e-45');
		expect(model.$modelValue).toBe(-1.23e-45);

		input.val('-1.23e-45-').triggerHandler('input');
		expect(model.$viewValue).toBe('1.23e45');
		expect(model.$modelValue).toBe(1.23e45);
	});

	it('should handle corner cases', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-scientific-notation-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: '0', viewValue: '0.00'},
			{modelValue: '0.0', viewValue: '0.00'},
			{modelValue: '.0', viewValue: '0.00'},
			{modelValue: 0, viewValue: '0.00'}
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});

		input.val('').triggerHandler('input');
		expect(model.$viewValue).toBe('');
	}));
});

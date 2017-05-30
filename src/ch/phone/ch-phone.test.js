'use strict';

require('../ch-masks');

describe('ui-ch-phone-number', function() {
	beforeEach(angular.mock.module('ui.utils.masks.ch'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-ch-phone-number>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-ch-phone-number>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-ch-phone-number>', {
			model: '41790000000'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('+41 79 000 00 00');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-ch-phone-number>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'+2', modelValue:'2'},
			{value:'23a', viewValue:'+23', modelValue:'23'},
			{value:'23_34', viewValue:'+23 34', modelValue:'2334'},
			{value:'23346!', viewValue:'+23 34 6', modelValue:'23346'},
			{value:'23346!324', viewValue:'+23 34 632 4', modelValue:'23346324'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});

	it('should validate a phone number', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-ch-phone-number>', {
			model: '417900'
		});

		var model = input.controller('ngModel');
		expect(model.$error.chPhoneNumber).toBe(true);
		input.val('41790000000').triggerHandler('input');
		expect(model.$error.chPhoneNumber).toBeUndefined();
	});

	it('should use the type of the model value (if initialized)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-ch-phone-number>', {
			model: '41790000000'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('+41 79 000 00 00');
		expect(model.$modelValue).toBe('41790000000');
		input.val('41619618686').triggerHandler('input');
		expect(model.$viewValue).toBe('+41 61 961 86 86');
		expect(model.$modelValue).toBe('41619618686');
	});
});

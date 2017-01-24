'use strict';

require('../global-masks');

describe('ui-date-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-date-mask>');
		}).toThrow();
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
			model: new Date('1999-12-31 00:00:00')
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1999-12-31');
	});

	it('should use specified mask', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-date-mask="DD.MM.YYYY">', {
			model: new Date('1999-12-31 00:00:00')
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('31.12.1999');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-date-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:''},
			{value:'1-', viewValue:'1'},
			{value:'1999a', viewValue:'1999'},
			{value:'1999_12', viewValue:'1999-12'},
			{value:'1999123!', viewValue:'1999-12-3'},
			{value:'199912*31', viewValue:'1999-12-31'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
		});
	});

	it('should parse input', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-date-mask>');

		input.val('1999-12-31').triggerHandler('input');
		expect($rootScope.model instanceof Date).toBe(true);
	}));

	it('should not parse input when parse disabled', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-date-mask parse="false">');

		input.val('1999-12-31').triggerHandler('input');
		expect(typeof ($rootScope.model) === 'string').toBe(true);
	}));

	it('should handle corner cases', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-date-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: null, viewValue: null},
			{}, //tests undefined values
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});
	}));
});

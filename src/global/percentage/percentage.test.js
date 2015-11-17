require('../global-masks');

describe('ui-percentage-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-percentage-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-percentage-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask>', {
			model: '12.345'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1,234.50 %');
	});

	it('should return null if field is empty', function () {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask>', {
			model: 12.3
		});

		var model = input.controller('ngModel');
		input.val('').triggerHandler('input');

		expect(model.$viewValue).toBe('');
		expect(model.$modelValue).toBeNull();
		expect(model.$valid).toBe(true);

	});

	it('should hide thousands delimiter when ui-hide-group-sep is present', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask ui-hide-group-sep>', {
			model: '12.345'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1234.50 %');
	});

	it('should allow changing the number of decimals', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask="decimals">', {
			model: '12.345',
			decimals: 2
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1,234.50 %');
		$rootScope.decimals = 3;
		$rootScope.$digest();
		expect(model.$viewValue).toBe('123.450 %');
		$rootScope.decimals = 'invalid value';
		$rootScope.$digest();
		expect(model.$viewValue).toBe('1,234.50 %');
	}));

	it('should handle corner cases', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: '0', viewValue: '0.00 %'},
			{modelValue: '0.0', viewValue: '0.00 %'},
			{modelValue: 0, viewValue: '0.00 %'},
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});
	}));

	it('should validate minimum value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask min="0.7">', {
			model: 0.75
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('75.00 %');
		expect(model.$valid).toBe(true);
		input.val('69920').triggerHandler('input');
		expect(model.$valid).toBe(false);
		input.val('108120').triggerHandler('input');
		expect(model.$valid).toBe(true);
	});

	it('should validate maximum value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask max="1.0">', {
			model: 0.75
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('75.00 %');
		expect(model.$valid).toBe(true);
		input.val('101000').triggerHandler('input');
		expect(model.$valid).toBe(false);
		input.val('99990').triggerHandler('input');
		expect(model.$valid).toBe(true);
	});

	it('should format initial model values with percentage value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask ui-percentage-value>', {
			model: '1234.5'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1,234.50 %');
	});

	it('should allow changing the number of decimals', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-percentage-mask="decimals" ui-percentage-value>', {
			model: '1234.501',
			decimals: 2
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1,234.50 %');
		$rootScope.decimals = 3;
		$rootScope.$digest();
		expect(model.$viewValue).toBe('123.450 %');
		$rootScope.decimals = 'invalid value';
		$rootScope.$digest();
		expect(model.$viewValue).toBe('1,234.50 %');
	}));

});

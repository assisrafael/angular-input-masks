describe('ui-percentage-mask', function() {
	beforeEach(module('ui.utils.masks.global.percentage'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-percentage-mask>');
		}).not.toThrow();
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
});

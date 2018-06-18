'use strict';

require('../global-masks');

var StringMask = require('string-mask');

describe('ui-money-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-money-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-money-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask>', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3,456.79');
	});

	it('should support number values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask>', {
			model: 345.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 345.00');
	});

	it('should hide thousands delimiter when ui-hide-group-sep is present', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-hide-group-sep>', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3456.79');
	});

	it('should allow changing the number of decimals', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask="decimals">', {
			model: '3456.79',
			decimals: 2
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3,456.79');
		$rootScope.decimals = 3;
		$rootScope.$digest();
		expect(model.$viewValue).toBe('$ 345.679');
		$rootScope.decimals = 'invalid value';
		$rootScope.$digest();
		expect(model.$viewValue).toBe('$ 3,456.79');
	}));

	it('should allow changing the currency', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask currency="currentCurrency">', {
			model: '3456.79',
			currentCurrency: '$'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3,456.79');
		$rootScope.currentCurrency = 'R$';
		$rootScope.$digest();
		expect(model.$viewValue).toBe('R$ 3,456.79');
		$rootScope.currentCurrency = '$';
		$rootScope.$digest();
		expect(model.$viewValue).toBe('$ 3,456.79');
	}));

	it('shold allow string as definition of decimals', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask="decimals">', {
			model: '3456.79',
			decimals: '2'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3,456.79');
		$rootScope.decimals = '3';
		$rootScope.$digest();
		expect(model.$viewValue).toBe('$ 345.679');
	}));

	it('should validate minimum value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask min="50">', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3,456.79');
		expect(model.$valid).toBe(true);
		input.val('12.34').triggerHandler('input');
		expect(model.$valid).toBe(false);
		input.val('129.34').triggerHandler('input');
		expect(model.$valid).toBe(true);
	});

	it('should validate minimum value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask max="50">', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 3,456.79');
		expect(model.$valid).toBe(false);
		input.val('12.34').triggerHandler('input');
		expect(model.$valid).toBe(true);
		input.val('129.34').triggerHandler('input');
		expect(model.$valid).toBe(false);
	});

	it('should allow negative value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-negative-number>', {
			model: '-3456.78'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('-$ 3,456.78');
		expect(model.$valid).toBe(true);
		input.val('$ 3,456.78-').triggerHandler('input');
		expect(model.$viewValue).toBe('-$ 3,456.78');
		input.val('-$ 3,456.78-').triggerHandler('input');
		expect(model.$viewValue).toBe('$ 3,456.78');
	});

	it('should format money with three decimal places', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask="3">');
		var model = input.controller('ngModel');

		var formatterView = new StringMask('$ #,##0.000', {reverse: true}),
			formatterModel =  new StringMask('###0.000', {reverse: true}),
			numberToFormat = '';

		for (var i = 1; i <= 9; i++) {
			numberToFormat += i;
			input.val(numberToFormat).triggerHandler('input');
			expect(model.$viewValue).toBe(formatterView.apply(numberToFormat));
			expect(model.$modelValue).toBe(parseFloat(formatterModel.apply(numberToFormat)));
		}
	});

	it('should handle corner cases', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '0', viewValue: '$ 0.00'},
			{modelValue: '0.0', viewValue: '$ 0.00'},
			{modelValue: 0, viewValue: '$ 0.00'},
			{modelValue: null, viewValue: ''},
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});
	}));

	it('should return empty if $isEmpty value', angular.mock.inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask>', {});
		var model = input.controller('ngModel');
		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: null, viewValue: null},
			{modelValue: NaN, viewValue: NaN}
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe('');
		});
	}));

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask>', {});
		var model = input.controller('ngModel');

		var tests = [
			{value: '@', viewValue: '$ 0.00', modelValue: 0},
			{value: '1*', viewValue: '$ 0.01', modelValue: 0.01},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});

	it('should convert invalid values to zero', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask>', {});
		var model = input.controller('ngModel');

		input.val('').triggerHandler('input');
		input.val('a').triggerHandler('input');
		expect(model.$viewValue).toBe('$ 0.00');
		expect(model.$modelValue).toBe(0);
	});

	it('should hide space after currency symbol if ui-hide-space is present', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-hide-space>', {
			model: 345.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$345.00');
	});

	it('should change currency symbol if defined', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask currency-symbol="F$">', {
			model: 345.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('F$ 345.00');
	});

	it('should remove space if currency symbol is defined but empty', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask currency-symbol="">', {
			model: 345.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('345.00');
	});

	it('should employ a custom thousands delimiter', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-thousands-delimiter="|">', {
			model: 1234567.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 1|234|567.00');
	});

	it('should employ a custom decimal delimiter', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-decimal-delimiter="|">', {
			model: 123.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 123|00');
	});

	it('should add currency after value', function() {
		var input = TestUtil.compile('<input ng-model="model" currency-symbol="EUR"  ui-currency-after ui-money-mask="mdecimals">', {
			model: 345.00
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('345.00 EUR');
	});

	it('should format integer models', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-integer-model>', {
			model: 12345
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('$ 123.45');
	});

	it('should parse integer models', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-money-mask ui-integer-model>', {});
		var model = input.controller('ngModel');

		input.val('123.45').triggerHandler('input');
		expect(model.$viewValue).toBe('$ 123.45');
		expect(model.$modelValue).toBe(12345);
	});
});

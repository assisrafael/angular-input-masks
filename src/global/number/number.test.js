require('../global-masks');

var StringMask = require('string-mask');

describe('ui-number-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.global'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-number-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-number-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask>', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('3,456.79');
	});

	it('should allow negative values if ui-negative-number is defined', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask ui-negative-number>', {
			model: '-3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('-3,456.79');
	});

	it('should hide thousands delimiter when ui-hide-group-sep is present', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask ui-hide-group-sep>', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('3456.79');
	});

	it('should return null if field is empty', function () {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask>', {
			model: 1000
		});

		var model = input.controller('ngModel');
		input.val('').triggerHandler('input');

		expect(model.$viewValue).toBe('');
		expect(model.$modelValue).toBeNull();
		expect(model.$valid).toBe(true);

	});

	it('should validate minimum value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask min="50">', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('3,456.79');
		expect(model.$valid).toBe(true);
		input.val('12.34').triggerHandler('input');
		expect(model.$valid).toBe(false);
		input.val('129.34').triggerHandler('input');
		expect(model.$valid).toBe(true);
	});

	it('should validate maximum value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask max="50">', {
			model: '3456.79'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('3,456.79');
		expect(model.$valid).toBe(false);
		input.val('12.34').triggerHandler('input');
		expect(model.$valid).toBe(true);
		input.val('129.34').triggerHandler('input');
		expect(model.$valid).toBe(false);
	});

	it('should format number with three decimal places', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask="3">');
		var model = input.controller('ngModel');

		var formatterView = new StringMask('#,##0.000', {reverse: true}),
			formatterModel =  new StringMask('###0.000', {reverse: true}),
			numberToFormat = '';

		for (var i = 1; i <= 9; i++) {
			numberToFormat += i;
			input.val(numberToFormat).triggerHandler('input');
			expect(model.$viewValue).toBe(formatterView.apply(numberToFormat));
			expect(model.$modelValue).toBe(parseFloat(formatterModel.apply(numberToFormat)));
		}
	});

	it('should handle corner cases', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: '0', viewValue: '0.00'},
			{modelValue: '0.0', viewValue: '0.00'},
			{modelValue: 0, viewValue: '0.00'}
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});
	}));

	it('should show zero when the model value is zero and the precision is set to 0', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask="0">');
		var model = input.controller('ngModel');


		$rootScope.model = 0;
		$rootScope.$digest();
		expect(model.$viewValue).toBe('0');
	}));

	it('should accept negative numbers if "ui-negative-number" is defined', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-number-mask ui-negative-number>');
		var model = input.controller('ngModel');

		input.val('-1234.56').triggerHandler('input');
		expect(model.$viewValue).toBe('-1,234.56');
		expect(model.$modelValue).toBe(-1234.56);
		input.val('-1,234.56-').triggerHandler('input');
		expect(model.$viewValue).toBe('1,234.56');
		expect(model.$modelValue).toBe(1234.56);
		input.val('1,234.56-').triggerHandler('input');
		expect(model.$viewValue).toBe('-1,234.56');
		expect(model.$modelValue).toBe(-1234.56);
	});
});

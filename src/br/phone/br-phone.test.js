'use strict';

require('../br-masks');

describe('uiBrPhoneNumberMask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-phone-number-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-phone-number-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values (free line)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '08001231234'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('0800-123-1234');
	});

	it('should format initial model values (2+8D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: 1234567890
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('(12) 3456-7890');
	});

	it('should format initial model values (2+9D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '12345678901'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('(12) 34567-8901');
	});

	it('should format initial model values (8D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '12345678'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('1234-5678');
	});

	it('should format initial model values (9D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '123456789'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('12345-6789');
	});

	it('should format initial model values (2+2+8D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '123456789012'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('+12 (34) 5678-9012');
	});

	it('should format initial model values (2+2+9D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '1234567890123'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('+12 (34) 56789-0123');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-br-phone-number-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value: '@', viewValue: '', modelValue: ''},
			{value: '2-', viewValue: '2', modelValue: '2'},
			{value: '23a', viewValue: '23', modelValue: '23'},
			{value: '23_34', viewValue: '2334', modelValue: '2334'},
			{value: '23346!', viewValue: '2334-6', modelValue: '23346'},
			{value: '23346!324', viewValue: '2334-6324', modelValue: '23346324'}
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});

	it('should validate a phone number', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '123456'
		});

		var model = input.controller('ngModel');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('1234567').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val(1234567).triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		[
			'12345678', '12345678901',
			'1234567890', '123456789',
			'12345678', '123456789012',
			'1234567890123'
		].forEach(function(number) {
			input.val(number).triggerHandler('input');
			expect(model.$error.brPhoneNumber).toBeUndefined();
		});

		expect(model.$error.brPhoneNumber).toBeUndefined();
	});

	it('should validate a phone number (all)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask="all">', {
			model: '123456'
		});

		var model = input.controller('ngModel');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('1234567').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val(1234567).triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		[
			'12345678', '12345678901',
			'1234567890', '123456789',
			'12345678', '123456789012',
			'1234567890123'
		].forEach(function(number) {
			input.val(number).triggerHandler('input');
			expect(model.$error.brPhoneNumber).toBeUndefined();
		});

		expect(model.$error.brPhoneNumber).toBeUndefined();
	});

	it('should only validate a (8D and 9D) phone number (simple)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask="simple">', {
			model: '123456'
		});

		var model = input.controller('ngModel');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('1234567').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val(1234567).triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		[
			'12345678', '123456789',
			'1234567890', '12345678901',
			'123456789012', '1234567890123'
		].forEach(function(number) {
			input.val(number).triggerHandler('input');
			expect(model.$error.brPhoneNumber).toBeUndefined();
		});

		expect(model.$error.brPhoneNumber).toBeUndefined();
	});

	it('should only validate a (2+8D and 2+9D) phone number (areaCode)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask="areaCode">', {
			model: '123456'
		});

		var model = input.controller('ngModel');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('1234567').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('12345678').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('123456789').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		[
			'1234567890', '12345678901',
			'123456789012', '1234567890123'
		].forEach(function(number) {
			input.val(number).triggerHandler('input');
			expect(model.$error.brPhoneNumber).toBeUndefined();
		});

		expect(model.$error.brPhoneNumber).toBeUndefined();
	});

	it('should only validate a (2+2+8D and 2+2+9D) phone number (countryCode)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask="countryCode">', {
			model: '123456'
		});

		var model = input.controller('ngModel');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('1234567').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('12345678').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('123456789').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('1234567890').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		input.val('12345678901').triggerHandler('input');
		expect(model.$error.brPhoneNumber).toBe(true);

		[
			'123456789012', '1234567890123'
		].forEach(function(number) {
			input.val(number).triggerHandler('input');
			expect(model.$error.brPhoneNumber).toBeUndefined();
		});

		expect(model.$error.brPhoneNumber).toBeUndefined();
	});

	it('should use the type of the model value (if initialized)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: 1234567890
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('(12) 3456-7890');
		expect(model.$modelValue).toBe(1234567890);
		input.val('12345678901').triggerHandler('input');
		expect(model.$viewValue).toBe('(12) 34567-8901');
		expect(model.$modelValue).toBe(12345678901);
	});

	it('should use the type of the model value (if initialized)', function() {
		var numberInput = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: 1234567890
		});

		var model = numberInput.controller('ngModel');
		expect(model.$viewValue).toBe('(12) 3456-7890');
		expect(model.$modelValue).toBe(1234567890);

		numberInput.val('12345678901').triggerHandler('input');
		expect(model.$viewValue).toBe('(12) 34567-8901');
		expect(model.$modelValue).toBe(12345678901);

		numberInput.val('32375486').triggerHandler('input');
		expect(model.$viewValue).toBe('3237-5486');
		expect(model.$modelValue).toBe(32375486);

		var stringInput = TestUtil.compile('<input ng-model="model" ui-br-phone-number-mask>', {
			model: '992561546'
		});

		stringInput.val('992561546').triggerHandler('input');
		expect(model.$viewValue).toBe('99256-1546');
		expect(model.$modelValue).toBe('992561546');

		stringInput.val('08001231234').triggerHandler('input');
		expect(model.$viewValue).toBe('0800-123-1234');
		expect(model.$modelValue).toBe('08001231234');
	});
});

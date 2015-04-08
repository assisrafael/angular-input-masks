describe('ui-us-phone-mask', function() {
	beforeEach(module('ui.utils.masks.us.phone'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-us-phone-number>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-us-phone-number>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 2);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 2);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-us-phone-number>', {
			model: '3011201034'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('(301) 120-1034');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-us-phone-number>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'(2', modelValue:'2'},
			{value:'23a', viewValue:'(23', modelValue:'23'},
			{value:'23_34', viewValue:'(233) 4', modelValue:'2334'},
			{value:'23346!', viewValue:'(233) 46', modelValue:'23346'},
			{value:'23346!32400', viewValue:'(233) 463-2400', modelValue:'2334632400'},
			{value:'23346!32400932', viewValue:'+23-34-632-400932', modelValue:'2334632400932'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

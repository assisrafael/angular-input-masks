describe('ui-br-phone-number', function() {
	beforeEach(module('ui.utils.masks.br.phone'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-phone-number>');
		}).not.toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-phone-number>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 2);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values (2+8D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number>', {
			model: '1234567890'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('(12) 3456-7890');
	});

	it('should format initial model values (2+9D)', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number>', {
			model: '12345678901'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('(12) 34567-8901');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-phone-number>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'(2', modelValue:'2'},
			{value:'23a', viewValue:'(23', modelValue:'23'},
			{value:'23_34', viewValue:'(23) 34', modelValue:'2334'},
			{value:'23346!', viewValue:'(23) 346', modelValue:'23346'},
			{value:'23346!324', viewValue:'(23) 3463-24', modelValue:'23346324'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

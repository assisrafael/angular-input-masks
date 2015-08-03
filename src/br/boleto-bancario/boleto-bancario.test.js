require('../br-masks');

describe('ui-br-boleto-bancario-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-boleto-bancario-mask>', {
			model: '34958723405162304548623240917012593348590495345'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('34958.72340 51623.045486 23240.917012 5 93348590495345');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"'+
			' ui-br-boleto-bancario-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'2-', viewValue:'2', modelValue:'2'},
			{value:'23a', viewValue:'23', modelValue:'23'},
			{value:'23_346', viewValue:'23346', modelValue:'23346'},
			{value:'23346!324', viewValue:'23346.324', modelValue:'23346324'},
			{value:'23346!324sdfg9870', viewValue:'23346.32498 70', modelValue:'233463249870'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});

	it('should validate a "boleto bancário"', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-boleto-bancario-mask>', {
			model: '104914433855119000002000000001413252'
		});

		var model = input.controller('ngModel');
		expect(model.$error.brBoletoBancario).toBe(true);
		input.val('10491443385511900000200000000141325230000093423').triggerHandler('input');
		expect(model.$error.brBoletoBancario).toBe(undefined);
	});
});

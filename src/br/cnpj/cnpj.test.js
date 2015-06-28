require('../br-masks');

describe('ui-br-cnpj-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-cnpj-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-cnpj-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cnpj-mask>', {
			model: '13883875000120'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('13.883.875/0001-20');
	});

	it('should handle corner cases', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cnpj-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: '0', viewValue: '0'},
			{modelValue: null, viewValue: null},
			{modelValue: undefined, viewValue: undefined},
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});
	}));

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}" ui-br-cnpj-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'13', viewValue:'13', modelValue:'13'},
			{value:'13$8', viewValue:'13.8', modelValue:'138'},
			{value:'13$88#3', viewValue:'13.883', modelValue:'13883'},
			{value:'13$88#3875', viewValue:'13.883.875', modelValue:'13883875'},
			{value:'13$88#3875-0', viewValue:'13.883.875/0', modelValue:'138838750'},
			{value:'13$88#3875-0001', viewValue:'13.883.875/0001', modelValue:'138838750001'},
			{value:'13$88#3875-000120', viewValue:'13.883.875/0001-20', modelValue:'13883875000120'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

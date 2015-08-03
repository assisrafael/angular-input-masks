require('../br-masks');

describe('ui-br-cpfcnpj-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-cpfcnpj-mask>');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-cpfcnpj-mask>');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model values', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cpfcnpj-mask>', {
			model: '35244457640'
		});

		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('352.444.576-40');
	});

	it('should handle corner cases', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ui-br-cpfcnpj-mask>');
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
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-br-cpfcnpj-mask>');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'3!', viewValue:'3', modelValue:'3'},
			{value:'35$2', viewValue:'352', modelValue:'352'},
			{value:'35$24%4.', viewValue:'352.44', modelValue:'35244'},
			{value:'35$24%445&', viewValue:'352.444.5', modelValue:'3524445'},
			{value:'35$24%445&76', viewValue:'352.444.576', modelValue:'352444576'},
			{value:'35$24%445&7640', viewValue:'352.444.576-40', modelValue:'35244457640'},
			{value:'13$88#3875-000120', viewValue:'13.883.875/0001-20', modelValue:'13883875000120'},
			{value:'13$88#3875-0001', viewValue:'13.883.875/0001', modelValue:'138838750001'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

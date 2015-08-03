require('../br-masks');

describe('ui-br-ie-mask', function() {
	beforeEach(angular.mock.module('ui.utils.masks.br'));

	it('should throw an error if used without ng-model', function() {
		expect(function() {
			TestUtil.compile('<input ui-br-ie-mask="\'MG\'">');
		}).toThrow();
	});

	it('should register a $parser and a $formatter', function() {
		var input = TestUtil.compile('<input ng-model="model">');
		var model = input.controller('ngModel');

		var maskedInput = TestUtil.compile('<input ng-model="maskedModel" ui-br-ie-mask="\'MG\'">');
		var maskedModel = maskedInput.controller('ngModel');

		expect(maskedModel.$parsers.length).toBe(model.$parsers.length + 1);
		expect(maskedModel.$formatters.length).toBe(model.$formatters.length + 1);
	});

	it('should format initial model value', function() {
		var input = TestUtil.compile('<input ng-model="model" ui-br-ie-mask="\'SP\'">', {
			model: 'P011004243002'
		});
		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('P-01100424.3/002');
	});

	it('should handle corner cases', inject(function($rootScope) {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-br-ie-mask="\'MG\'">');
		var model = input.controller('ngModel');

		var tests = [
			{modelValue: '', viewValue: ''},
			{modelValue: null, viewValue: null},
			{modelValue: undefined, viewValue: undefined},
		];

		tests.forEach(function(test) {
			$rootScope.model = test.modelValue;
			$rootScope.$digest();
			expect(model.$viewValue).toBe(test.viewValue);
		});
	}));

	it('should not format when state is invalid', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-br-ie-mask="\'XA\'">', {
			model: '0623079040081'
		});
		var model = input.controller('ngModel');
		expect(model.$viewValue).toBe('0623079040081');
		input.val('0623079040082').triggerHandler('input');
		expect(model.$viewValue).toBe('0623079040082');

		var input2 = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-br-ie-mask>', {
			model: '0623079040081'
		});
		var model2 = input.controller('ngModel');
		expect(model2.$viewValue).toBe('0623079040081');
		input2.val('0623079040082').triggerHandler('input');
		expect(model2.$viewValue).toBe('0623079040082');
	});

	it('should ignore non digits', function() {
		var input = TestUtil.compile('<input ng-model="model" ng-model-options="{allowInvalid:true}"' +
			' ui-br-ie-mask="\'MG\'">');
		var model = input.controller('ngModel');

		var tests = [
			{value:'@', viewValue:'', modelValue:''},
			{value:'0.', viewValue:'0', modelValue:'0'},
			{value:'062&', viewValue:'062', modelValue:'062'},
			{value:'062&30!7', viewValue:'062.307', modelValue:'062307'},
			{value:'062&3079%04', viewValue:'062.307.904', modelValue:'062307904'},
			{value:'062&30*79040', viewValue:'062.307.904/0', modelValue:'0623079040'},
			{value:'062&30*79040081', viewValue:'062.307.904/0081', modelValue:'0623079040081'},
		];

		tests.forEach(function(test) {
			input.val(test.value).triggerHandler('input');
			expect(model.$viewValue).toBe(test.viewValue);
			expect(model.$modelValue).toBe(test.modelValue);
		});
	});
});

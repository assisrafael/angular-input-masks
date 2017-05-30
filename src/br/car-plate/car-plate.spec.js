'use strict';

describe('ui.utils.masks.br.car-plate', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/car-plate/car-plate.html');
		expect(browser.getTitle()).toEqual('Car Plate Spec');
	});

	describe('ui-br-car-plate-mask:', function() {
		it('should apply a Car Plate mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'@', viewValue:'', modelValue:''},
				{key:'A', viewValue:'A', modelValue:'A'},
				{key:'B', viewValue:'AB', modelValue:'AB'},
				{key:'C', viewValue:'ABC', modelValue:'ABC'},
				{key:'-', viewValue:'ABC', modelValue:'ABC'},
				{key:'2', viewValue:'ABC-2', modelValue:'ABC2'},
				{key:'0', viewValue:'ABC-20', modelValue:'ABC20'},
				{key:'1', viewValue:'ABC-201', modelValue:'ABC201'},
				{key:'0', viewValue:'ABC-2010', modelValue:'ABC2010'},
				{key:'9', viewValue:'ABC-2010', modelValue:'ABC2010'},
				{key:BS, viewValue:'ABC-201', modelValue:'ABC201'},
				{key:BS, viewValue:'ABC-20', modelValue:'ABC20'},
				{key:BS, viewValue:'ABC-2', modelValue:'ABC2'},
				{key:BS, viewValue:'ABC', modelValue:'ABC'},
				{key:BS, viewValue:'AB', modelValue:'AB'},
				{key:BS, viewValue:'A', modelValue:'A'},
			];

			var input = element(by.model('carPlate')),
				value = element(by.binding('carPlate'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a Car Plate mask in a model with default value:', function() {
			var input = element(by.model('initializedCarPlate'));

			expect(input.getAttribute('value')).toEqual('ABC-2010');
		});
	});
});

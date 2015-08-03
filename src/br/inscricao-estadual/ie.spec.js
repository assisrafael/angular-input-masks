var StringMask = require('string-mask');

describe('ui.utils.masks.number', function() {
	it('should load the demo page', function() {
		browser.get('/src/br/inscricao-estadual/ie.html');
		expect(browser.getTitle()).toEqual('Inscricão Estadual Spec');
	});

	describe('ui-br-ie-mask:', function() {
		it('should apply a IE mask in a model with default value:', function() {
			var input = element(by.model('initializedIE')),
				value = element(by.binding('initializedIE'));

			expect(input.getAttribute('value')).toEqual('P-35887477.0/971');
		});

		it('should validate in a model with default value', function() {
			var valid = element(by.binding('form.field19.$error'));

			expect(valid.getText()).toEqual('{}');
		});

		it('should not have validation errors when empty', function() {
			var inputIE = element(by.model('inscEst')),
				inputUF = element(by.model('state')),
				valid = element(by.binding('form.field20.$error'));

			for (var i = 1; i < 27; i++) {
				inputIE.clear();
				inputUF.all(by.tagName('option')).get(i).click();
				expect(valid.getText()).toEqual('{}');
				inputIE.sendKeys(1);
				expect(valid.getText()).toEqual('{ "ie": true }');
			}
		});

		it('should be valid if the model is a valid I.E', function() {
			var inputIE = element(by.model('inscEst')),
				inputUF = element(by.model('state')),
				valid = element(by.binding('form.field20.$error'));

			inputUF.all(by.tagName('option')).get(26).click();
			inputIE.clear();
			inputIE.sendKeys('P-35887477.0/971');
			expect(valid.getText()).toEqual('{}');
		});

		it('should apply a I.E. mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;
			var tests = [
				{uf:'AC', option:  1, modelValue: '0100482300112', viewValue: '01.004.823/001-12'},
				{uf:'AL', option:  2, modelValue: '240000048', viewValue: '240000048'},
				{uf:'AM', option:  3, modelValue: '198712308', viewValue: '19.871.230-8'},
				{uf:'AP', option:  4, modelValue: '030123459', viewValue: '030123459'},
				{uf:'BA', option:  5, modelValue: '090493871', viewValue: '090493-87', viewValue2: '0904938-71', valid: true},
				{uf:'CE', option:  6, modelValue: '060000015', viewValue: '06000001-5'},
				{uf:'DF', option:  7, modelValue: '0730000100109', viewValue: '07300001001-09'},
				{uf:'ES', option:  8, modelValue: '198712308', viewValue: '19871230-8'},
				{uf:'GO', option:  9, modelValue: '109876547', viewValue: '10.987.654-7'},
				{uf:'MA', option: 10, modelValue: '120000385', viewValue: '120000385'},
				{uf:'MG', option: 11, modelValue: '0623079040081', viewValue: '062.307.904/0081'},
				{uf:'MS', option: 12, modelValue: '285730383', viewValue: '285730383'},
				{uf:'MT', option: 13, modelValue: '00130000019', viewValue: '0013000001-9'},
				{uf:'PA', option: 14, modelValue: '159999995', viewValue: '15-999999-5'},
				{uf:'PB', option: 15, modelValue: '060000015', viewValue: '06000001-5'},
				{uf:'PE', option: 16, modelValue: '03214184023459', viewValue: '0321418-40', viewValue2: '03.2.141.8402345-9'},
				{uf:'PI', option: 17, modelValue: '012345679', viewValue: '012345679'},
				{uf:'PR', option: 18, modelValue: '1234567850', viewValue: '123.45678-50'},
				{uf:'RJ', option: 19, modelValue: '40732128', viewValue: '40.732.12-8'},
				{uf:'RN', option: 20, modelValue: '2004004012', viewValue: '20.040.040-1', viewValue2: '20.0.400.401-2'},
				{uf:'RO', option: 21, modelValue: '06012306625217', viewValue: '0601230662521-7'},
				{uf:'RR', option: 22, modelValue: '240066281', viewValue: '24006628-1'},
				{uf:'RS', option: 23, modelValue: '2243658792', viewValue: '224/3658792'},
				{uf:'SC', option: 24, modelValue: '251040852', viewValue: '251.040.852'},
				{uf:'SE', option: 25, modelValue: '271234563', viewValue: '27123456-3'},
				{uf:'SP', option: 26, modelValue: '110042490114', viewValue: '110.042.490.114'},
				{uf:'SP', option: 26, modelValue: 'P011004243002', viewValue: 'P-01100424.3/002'},
				{uf:'TO', option: 27, modelValue: '29010227836', viewValue: '29010227836'}
			];

			function getExpectedViewValue(viewValue, i, viewValue2) {
				var values = viewValue.split('');
				if (i > viewValue.replace(/[^P0-9]/ig,'').length && viewValue2) {
					values = viewValue2.split('');
				}
				var expected = ''
				var count = 0;
				while(count < i && values.length > 0) {
					var c = values.splice(0,1);
					expected += c;
					count += /[P0-9]/i.test(c);
				}
				return expected;
			}

			var inputIE = element(by.model('inscEst')),
				inputUF = element(by.model('state')),
				value = element(by.binding('inscEst'));

			for (var t = 0; t < tests.length; t++) {
				inputIE.clear();
				var test = tests[t];
				var values = test.modelValue.split('');
				var viewValue = test.viewValue;
				var viewValue2 = test.viewValue2;

				inputUF.all(by.tagName('option')).get(test.option).click();
				var i;
				for (i = 0; i < values.length; i++) {
					inputIE.sendKeys(values[i]);
					var erroMsg = 'Estado: '+test.uf+'; i: '+i+'; key: '+values[i];
					var expected = getExpectedViewValue(viewValue, i+1, viewValue2);
					expect(inputIE.getAttribute('value')).toEqual(expected, erroMsg);
					expect(value.getText()).toEqual(test.modelValue.substr(0,i+1), erroMsg);
				}
				for (; i > 0; i--) {
					inputIE.sendKeys(BS);
					var erroMsg = 'Estado: '+test.uf+'; i: '+i+'; key: BS';
					var expected = getExpectedViewValue(viewValue, i-1, viewValue2);
					expect(inputIE.getAttribute('value')).toEqual(expected, erroMsg);
					expect(value.getText()).toEqual(test.modelValue.substr(0,i-1), erroMsg);
				}
			}
		}, 600000);
	});
});

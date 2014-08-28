var StringMask = require('../bower_components/string-mask/src/string-mask.js');

describe('ui.utils.masks:', function() {
	beforeEach(function() {
		browser.get('/demo');
	});

	it('should load the demo page', function() {
		expect(browser.getTitle()).toEqual('Angular Mask Demo');
	});

	describe('ui-number-mask:', function() {
		it('should format number with two decimal places (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWithDefaultDecimals')),
				value = element(by.binding('numberWithDefaultDecimals'));

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;
				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should format number with two decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith2Decimals')),
				value = element(by.binding('numberWith2Decimals'));

			expect(input.getAttribute('value')).toEqual('1.234,18');
			input.clear();

			for (var i = 1; i <= 5; i++) {
				input.sendKeys(i);
				numberToFormat += i;
				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 5; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should accept negative numbers when the ui-negative attribute is present', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.00', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith2Decimals')),
				value = element(by.binding('numberWith2Decimals'));

			expect(input.getAttribute('value')).toEqual('1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('-1.234,18');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('1.234,18');
		});

		it('should not accept negative numbers when the ui-negative attribute is not present', function() {
			var formatterView = new StringMask('#.##0,000', {reverse: true}),
				formatterModel =  new StringMask('###0.000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith3Decimals')),
				value = element(by.binding('numberWith3Decimals'));

			input.sendKeys('1234.178');
			expect(input.getAttribute('value')).toEqual('1.234,178');
			input.sendKeys('-');
			expect(input.getAttribute('value')).toEqual('1.234,178');
		});

		it('should format number with three decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,000', {reverse: true}),
				formatterModel =  new StringMask('###0.000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith3Decimals')),
				value = element(by.binding('numberWith3Decimals'));

			for (var i = 1; i <= 5; i++) {
				input.sendKeys(i);
				numberToFormat += i;
				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 5; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
			}
		});

		it('should format number without decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0', {reverse: true}),
				formatterModel =  new StringMask('###0', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('numberWith0Decimals')),
				value = element(by.binding('numberWith0Decimals'));

			for (var i = 1; i <= 5; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 5; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);

				if(!numberToFormat) {
					formatedNumberAsString = '';
					formatedNumberAsNumber = '';
				}else {
					formatedNumberAsString = formatterView.apply(numberToFormat);
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				}

				expect(input.getAttribute('value')).toEqual(formatedNumberAsString);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}
		});
	});

	describe('ui-percentage-mask:', function() {
		it('should format percentage numbers with two decimal places (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.0000', {reverse: true}),
				numberToFormat = '', percent = ' %', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWithDefaultDecimals')),
				value = element(by.binding('percentageWithDefaultDecimals'));

			expect(input.getAttribute('value')).toEqual('76,54'+percent);
			input.clear();

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);
			}
		});

		it('should format percentage numbers with four decimal places (parameter)', function() {
			var formatterView = new StringMask('#.##0,0000', {reverse: true}),
				formatterModel =  new StringMask('###0.000000', {reverse: true}),
				numberToFormat = '', percent = ' %', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWith4Decimals')),
				value = element(by.binding('percentageWith4Decimals'));

			for (var i = 1; i <= 9; i++) {
				input.sendKeys(i);
				numberToFormat += i;

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);

				formatedNumberAsNumber = formatterModel.apply(numberToFormat);
				expect(value.getText()).toEqual(formatedNumberAsNumber);
			}

			for (var i = 9; i >= 1; i--) {
				input.sendKeys(protractor.Key.BACK_SPACE);
				numberToFormat = numberToFormat.slice(0, -1);
				if(!numberToFormat) {
					numberToFormat = '0';
				}else{
					formatedNumberAsNumber = formatterModel.apply(numberToFormat);
					expect(value.getText()).toEqual(formatedNumberAsNumber);
				}

				formatedNumberAsString = formatterView.apply(numberToFormat);
				expect(input.getAttribute('value')).toEqual(formatedNumberAsString + percent);
			}
		});
	});

	describe('ui-br-cpf:', function() {
		it('should apply a CPF mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'-', viewValue:'', modelValue: ''},
				{key:'3', viewValue:'3', modelValue: '3'},
				{key:'5', viewValue:'35', modelValue: '35'},
				{key:'2', viewValue:'352', modelValue: '352'},
				{key:'4', viewValue:'352.4', modelValue: '3524'},
				{key:'4', viewValue:'352.44', modelValue: '35244'},
				{key:'4', viewValue:'352.444', modelValue: '352444'},
				{key:'5', viewValue:'352.444.5', modelValue: '3524445'},
				{key:'7', viewValue:'352.444.57', modelValue: '35244457'},
				{key:'6', viewValue:'352.444.576', modelValue: '352444576'},
				{key:'4', viewValue:'352.444.576-4', modelValue: '3524445764'},
				{key:'0', viewValue:'352.444.576-40', modelValue: '35244457640'},
				{key:'9', viewValue:'352.444.576-40', modelValue: '35244457640'},
				{key:BS, viewValue:'352.444.576-4', modelValue: '3524445764'},
				{key:BS, viewValue:'352.444.576', modelValue: '352444576'},
				{key:BS, viewValue:'352.444.57', modelValue: '35244457'},
				{key:BS, viewValue:'352.444.5', modelValue: '3524445'},
				{key:BS, viewValue:'352.444', modelValue: '352444'},
				{key:BS, viewValue:'352.44', modelValue: '35244'},
				{key:BS, viewValue:'352.4', modelValue: '3524'},
				{key:BS, viewValue:'352', modelValue: '352'},
				{key:BS, viewValue:'35', modelValue: '35'},
				{key:BS, viewValue:'3', modelValue: '3'},
			];

			var input = element(by.model('fieldCpf')),
				value = element(by.binding('fieldCpf'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a CPF mask in a model with default value:', function() {
			var input = element(by.model('initializedCpf')),
				value = element(by.binding('initializedCpf'));

			expect(input.getAttribute('value')).toEqual('352.444.576-40');
			input.clear();
		});
	});

	describe('ui-br-cnpj:', function() {
		it('should apply a CNPJ mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue: '1'},
				{key:'3', viewValue:'13', modelValue: '13'},
				{key:'8', viewValue:'13.8', modelValue: '138'},
				{key:'8', viewValue:'13.88', modelValue: '1388'},
				{key:'3', viewValue:'13.883', modelValue: '13883'},
				{key:'8', viewValue:'13.883.8', modelValue: '138838'},
				{key:'7', viewValue:'13.883.87', modelValue: '1388387'},
				{key:'5', viewValue:'13.883.875', modelValue: '13883875'},
				{key:'0', viewValue:'13.883.875/0', modelValue: '138838750'},
				{key:'0', viewValue:'13.883.875/00', modelValue: '1388387500'},
				{key:'0', viewValue:'13.883.875/000', modelValue: '13883875000'},
				{key:'1', viewValue:'13.883.875/0001', modelValue: '138838750001'},
				{key:'2', viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
				{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
				{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
				{key:BS, viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
				{key:BS, viewValue:'13.883.875/0001', modelValue: '138838750001'},
				{key:BS, viewValue:'13.883.875/000', modelValue: '13883875000'},
				{key:BS, viewValue:'13.883.875/00', modelValue: '1388387500'},
				{key:BS, viewValue:'13.883.875/0', modelValue: '138838750'},
				{key:BS, viewValue:'13.883.875', modelValue: '13883875'},
				{key:BS, viewValue:'13.883.87', modelValue: '1388387'},
				{key:BS, viewValue:'13.883.8', modelValue: '138838'},
				{key:BS, viewValue:'13.883', modelValue: '13883'},
				{key:BS, viewValue:'13.88', modelValue: '1388'},
				{key:BS, viewValue:'13.8', modelValue: '138'},
				{key:BS, viewValue:'13', modelValue: '13'},
				{key:BS, viewValue:'1', modelValue: '1'}
			];

			var input = element(by.model('fieldCnpj')),
				value = element(by.binding('fieldCnpj'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a CNPJ mask in a model with default value:', function() {
			var input = element(by.model('initializedCnpj')),
				value = element(by.binding('initializedCnpj'));

			expect(input.getAttribute('value')).toEqual('13.883.875/0001-20');
			input.clear();
		});
	});

	describe('ui-br-cpfcnpj:', function() {
		it('should apply a CPF/CNPJ mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'1', modelValue: '1'},
				{key:'3', viewValue:'13', modelValue: '13'},
				{key:'8', viewValue:'138', modelValue: '138'},
				{key:'8', viewValue:'138.8', modelValue: '1388'},
				{key:'3', viewValue:'138.83', modelValue: '13883'},
				{key:'8', viewValue:'138.838', modelValue: '138838'},
				{key:'7', viewValue:'138.838.7', modelValue: '1388387'},
				{key:'5', viewValue:'138.838.75', modelValue: '13883875'},
				{key:'0', viewValue:'138.838.750', modelValue: '138838750'},
				{key:'0', viewValue:'138.838.750-0', modelValue: '1388387500'},
				{key:'0', viewValue:'138.838.750-00', modelValue: '13883875000'},

				{key:'1', viewValue:'13.883.875/0001', modelValue: '138838750001'},
				{key:'2', viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
				{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
				{key:'0', viewValue:'13.883.875/0001-20', modelValue: '13883875000120'},
				{key:BS, viewValue:'13.883.875/0001-2', modelValue: '1388387500012'},
				{key:BS, viewValue:'13.883.875/0001', modelValue: '138838750001'},

				{key:BS, viewValue:'138.838.750-00', modelValue: '13883875000'},
				{key:BS, viewValue:'138.838.750-0', modelValue: '1388387500'},
				{key:BS, viewValue:'138.838.750', modelValue: '138838750'},
				{key:BS, viewValue:'138.838.75', modelValue: '13883875'},
				{key:BS, viewValue:'138.838.7', modelValue: '1388387'},
				{key:BS, viewValue:'138.838', modelValue: '138838'},
				{key:BS, viewValue:'138.83', modelValue: '13883'},
				{key:BS, viewValue:'138.8', modelValue: '1388'},
				{key:BS, viewValue:'138', modelValue: '138'},
				{key:BS, viewValue:'13', modelValue: '13'},
				{key:BS, viewValue:'1', modelValue: '1'}
			];

			var input = element(by.model('cpfcnpj')),
				value = element(by.binding('cpfcnpj'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a CPFCNPJ mask in a model with default CPF value:', function() {
			var input = element(by.model('initializedCpfCnpj1')),
				value = element(by.binding('initializedCpfCnpj1'));

			expect(input.getAttribute('value')).toEqual('563.383.329-58');
		});

		it('should apply a CPFCNPJ mask in a model with default CNPJ value:', function() {
			var input = element(by.model('initializedCpfCnpj2')),
				value = element(by.binding('initializedCpfCnpj2'));

			expect(input.getAttribute('value')).toEqual('23.212.161/0001-44');
		});
	});

	describe('ui-br-phone-number:', function() {
		it('should apply a phone number mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'(1', modelValue:'1'},
				{key:'2', viewValue:'(12', modelValue:'12'},
				{key:'3', viewValue:'(12) 3', modelValue:'123'},
				{key:'4', viewValue:'(12) 34', modelValue:'1234'},
				{key:'5', viewValue:'(12) 345', modelValue:'12345'},
				{key:'6', viewValue:'(12) 3456', modelValue:'123456'},
				{key:'7', viewValue:'(12) 3456-7', modelValue:'1234567'},
				{key:'8', viewValue:'(12) 3456-78', modelValue:'12345678'},
				{key:'9', viewValue:'(12) 3456-789', modelValue:'123456789'},
				{key:'0', viewValue:'(12) 3456-7890', modelValue:'1234567890'},
				{key:'1', viewValue:'(12) 34567-8901', modelValue:'12345678901'},
				{key:'2', viewValue:'(12) 34567-8901', modelValue:'12345678901'},
				{key:BS, viewValue:'(12) 3456-7890', modelValue:'1234567890'},
				{key:BS, viewValue:'(12) 3456-789', modelValue:'123456789'},
				{key:BS, viewValue:'(12) 3456-78', modelValue:'12345678'},
				{key:BS, viewValue:'(12) 3456-7', modelValue:'1234567'},
				{key:BS, viewValue:'(12) 3456', modelValue:'123456'},
				{key:BS, viewValue:'(12) 345', modelValue:'12345'},
				{key:BS, viewValue:'(12) 34', modelValue:'1234'},
				{key:BS, viewValue:'(12) 3', modelValue:'123'},
				{key:BS, viewValue:'(12', modelValue:'12'},
				{key:BS, viewValue:'(1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('phoneNumber')),
				value = element(by.binding('phoneNumber'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a phone number mask in a model with default value:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'1', viewValue:'(1', modelValue:'1'},
				{key:'2', viewValue:'(12', modelValue:'12'},
				{key:'3', viewValue:'(12) 3', modelValue:'123'},
				{key:'4', viewValue:'(12) 34', modelValue:'1234'},
				{key:'5', viewValue:'(12) 345', modelValue:'12345'},
				{key:'6', viewValue:'(12) 3456', modelValue:'123456'},
				{key:'7', viewValue:'(12) 3456-7', modelValue:'1234567'},
				{key:BS, viewValue:'(12) 3456', modelValue:'123456'},
				{key:BS, viewValue:'(12) 345', modelValue:'12345'},
				{key:BS, viewValue:'(12) 34', modelValue:'1234'},
				{key:BS, viewValue:'(12) 3', modelValue:'123'},
				{key:BS, viewValue:'(12', modelValue:'12'},
				{key:BS, viewValue:'(1', modelValue:'1'},
				{key:BS, viewValue:'', modelValue:''},
			];

			var input = element(by.model('initializedPhoneNumber')),
				value = element(by.binding('initializedPhoneNumber'));

			expect(input.getAttribute('value')).toEqual('(31) 3353-6767');
			input.clear();

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});
	});

	describe('ui-br-cep-mask:', function() {
		it('should apply a CEP mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;

			var tests = [
				{key:'@', viewValue:'', modelValue:''},
				{key:'3', viewValue:'3', modelValue:'3'},
				{key:'0', viewValue:'30', modelValue:'30'},
				{key:'1', viewValue:'301', modelValue:'301'},
				{key:'1', viewValue:'3011', modelValue:'3011'},
				{key:'2', viewValue:'30112', modelValue:'30112'},
				{key:'-', viewValue:'30112', modelValue:'30112'},
				{key:'0', viewValue:'30112-0', modelValue:'301120'},
				{key:'1', viewValue:'30112-01', modelValue:'3011201'},
				{key:'0', viewValue:'30112-010', modelValue:'30112010'},
				{key:'9', viewValue:'30112-010', modelValue:'30112010'},
				{key:BS, viewValue:'30112-01', modelValue:'3011201'},
				{key:BS, viewValue:'30112-0', modelValue:'301120'},
				{key:BS, viewValue:'30112', modelValue:'30112'},
				{key:BS, viewValue:'3011', modelValue:'3011'},
				{key:BS, viewValue:'301', modelValue:'301'},
				{key:BS, viewValue:'30', modelValue:'30'},
				{key:BS, viewValue:'3', modelValue:'3'}
			];

			var input = element(by.model('cep')),
				value = element(by.binding('cep'));

			for (var i = 0; i < tests.length; i++) {
				input.sendKeys(tests[i].key);
				expect(input.getAttribute('value')).toEqual(tests[i].viewValue);
				expect(value.getText()).toEqual(tests[i].modelValue);
			}
		});

		it('should apply a CEP mask in a model with default value:', function() {
			var input = element(by.model('initializedCep')),
				value = element(by.binding('initializedCep'));

			expect(input.getAttribute('value')).toEqual('30112-010');
		});
	});

	describe('ui-br-ie-mask:', function() {
		it('should apply a I.E. mask while the user is typping:', function() {
			var BS = protractor.Key.BACK_SPACE;
			var tests = [
				{uf:'AC', option:  1, modelValue: '0100482300112', viewValue: '01.004.823/001-12'},
				{uf:'AL', option:  2, modelValue: '240000048', viewValue: '240000048'},
				{uf:'AM', option:  3, modelValue: '198712308', viewValue: '19.871.230-8'},
				{uf:'AP', option:  4, modelValue: '030123459', viewValue: '030123459'},
				{uf:'BA', option:  5, modelValue: '090493871', viewValue: '090493-87', viewValue2: '0904938-71',valid: true},
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

		it('should apply a IE mask in a model with default value:', function() {
			var input = element(by.model('initializedIE')),
				value = element(by.binding('initializedIE'));

			expect(input.getAttribute('value')).toEqual('P-35887477.0/971');
		});
	});
});

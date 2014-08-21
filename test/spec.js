var StringMask = require('./../lib/string-mask.js');

describe('ui.utils.masks:', function() {
	beforeEach(function() {
		browser.get('/demo');
	});

	it('deveria carregar a página de demonstração', function() {
		expect(browser.getTitle()).toEqual('Angular Mask Demo');
	});

	describe('ui-number-mask:', function() {
		it('deveria formatar números com 2 casas decimais (default)', function() {
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

		it('deveria formatar números com 2 casas decimais (parâmetro)', function() {
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

		it('deveria aceitar números negativos quando o atributo ui-negative number estiver presente', function() {
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

		it('não deveria aceitar números negativos quando o atributo ui-negative number estiver ausente', function() {
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

		it('deveria formatar números com 3 casas decimais (parâmetro)', function() {
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

		it('deveria formatar números com 0 casas decimais (parâmetro)', function() {
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
		it('deveria formatar porcentagens com 2 casas decimais (default)', function() {
			var formatterView = new StringMask('#.##0,00', {reverse: true}),
				formatterModel =  new StringMask('###0.0000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWithDefaultDecimals')),
				value = element(by.binding('percentageWithDefaultDecimals'));

			expect(input.getAttribute('value')).toEqual('76,54');
			input.clear();

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

		it('deveria formatar porcentagens com 4 casas decimais (parâmetro)', function() {
			var formatterView = new StringMask('#.##0,0000', {reverse: true}),
				formatterModel =  new StringMask('###0.000000', {reverse: true}),
				numberToFormat = '', formatedNumberAsString, formatedNumberAsNumber;

			var input = element(by.model('percentageWith4Decimals')),
				value = element(by.binding('percentageWith4Decimals'));

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
			input.clear();
		});

		it('should apply a CPFCNPJ mask in a model with default CNPJ value:', function() {
			var input = element(by.model('initializedCpfCnpj2')),
				value = element(by.binding('initializedCpfCnpj2'));

			expect(input.getAttribute('value')).toEqual('23.212.161/0001-44');
			input.clear();
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
});

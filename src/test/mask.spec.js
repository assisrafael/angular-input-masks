(function() {
	'use strict';

	describe('Angular Input Masks', function() {
		var element, scope;

		var getTemplate = function(attrs) {
			if(!attrs) {
				attrs = '';
			}

			return '<form name="form">' +
					'<input type="text" name="field" ng-model="field" ' + attrs + '>' +
				'</form>';
		};

		var compileDirective = function(tpl) {
			inject(function($compile) {
				var form = $compile(tpl)(scope);
				element = form.find('input');
			});

			scope.$digest();
		};

		var changeInputValueTo = function (inputEl, value) {
			inputEl.val(value);
			inject(function($sniffer) {
				inputEl.triggerHandler($sniffer.hasEvent('input') ? 'input' : 'change');
			});
			
			scope.$digest();
		};

		beforeEach(module('inputMask'));

		beforeEach(inject(function($rootScope){
			scope = $rootScope.$new();
			scope.field = '12';
		}));

		describe('initialization', function() {
			beforeEach(function() {
				compileDirective(getTemplate());
			});

			it('should have a scope', function() {
				expect(element.scope()).toBeDefined();
			});

			it('should input be linked to scope', function() {
				expect(scope.form.field.$modelValue).toEqual('12');
				expect(scope.form.field.$viewValue).toEqual('12');
				expect(scope.field).toEqual('12');

				changeInputValueTo(element, '1,5');

				expect(scope.form.field.$modelValue).toEqual('1,5');
				expect(scope.form.field.$viewValue).toEqual('1,5');
				expect(scope.field).toEqual('1,5');

				changeInputValueTo(element, '1.45');

				expect(scope.form.field.$modelValue).toEqual('1.45');
				expect(scope.form.field.$viewValue).toEqual('1.45');
				expect(scope.field).toEqual('1.45');
			});
		});

		describe('imNumber', function() {
			beforeEach(function() {
				compileDirective(getTemplate('im-number'));
			});

			it('should allow only numbers', function() {
				//TODO: implement more tests
			});
		});
	});
}());
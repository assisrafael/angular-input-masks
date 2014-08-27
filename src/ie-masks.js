(function() {
	'use strict';

	angular.module('ui.utils.masks.ie', [])
	.directive('uiBrIeMask',function() {

		var ieMasks = {
			'AC': [{mask: new StringMask('00.000.000/000-00')}],
			'AL': [{mask: new StringMask('000000000')}],
			'AM': [{mask: new StringMask('00.000.000-0')}],
			'AP': [{mask: new StringMask('000000000')}],
			'BA': [{chars: 8, mask: new StringMask('000000-00')},
				   {mask: new StringMask('0000000-00')}],
			'CE': [{mask: new StringMask('00000000-0')}],
			'DF': [{mask: new StringMask('00000000000-00')}],
			'ES': [{mask: new StringMask('00000000-0')}],
			'GO': [{mask: new StringMask('00.000.000-0')}],
			'MA': [{mask: new StringMask('000000000')}],
			'MG': [{mask: new StringMask('000.000.000/0000')}],
			'MS': [{mask: new StringMask('000000000')}],
			'MT': [{mask: new StringMask('0000000000-0')}],
			'PA': [{mask: new StringMask('00-000000-0')}],
			'PB': [{mask: new StringMask('00000000-0')}],
			'PE': [{chars: 9, mask: new StringMask('0000000-00')},
				   {mask: new StringMask('00.0.000.0000000-0')}],
			'PI': [{mask: new StringMask('000000000')}],
			'PR': [{mask: new StringMask('000.00000-00')}],
			'RJ': [{mask: new StringMask('00.000.00-0')}],
			'RN': [{chars: 9, mask: new StringMask('00.000.000-0')},
				   {mask: new StringMask('00.0.000.000-0')}],
			'RO': [{mask: new StringMask('0000000000000-0')}],
			'RR': [{mask: new StringMask('00000000-0')}],
			'RS': [{mask: new StringMask('000/0000000')}],
			'SC': [{mask: new StringMask('000.000.000')}],
			'SE': [{mask: new StringMask('00000000-0')}],
			'SP': [{mask: new StringMask('000.000.000.000')},
				   {mask: new StringMask('-00000000.0/000')}],
			'TO': [{mask: new StringMask('00000000000')}]
		};

		function clearValue (value) {
			if(!value) {
				return value;
			}
			return value.replace(/[^0-9]/g, '');
		}

		function getMask(uf, value) {
			if(!uf || !ieMasks[uf]) {
				return undefined;
			}
			var _uf = uf.toUpperCase();
			if (_uf === 'SP' && /^P/i.test(value)) {
				return ieMasks.SP[1].mask;
			}
			var masks = ieMasks[uf];
			var i = 0;
			while(masks[i].chars && masks[i].chars < clearValue(value).length && i < masks.length - 1) {
				i++;
			}
			return masks[i].mask;
		}

		function applyIEMask (value, uf, ctrl) {
			var mask = getMask(uf, value);
			if(!value || !mask) {
				return value;
			}
			var processed = mask.process(clearValue(value));
			ctrl.$setValidity('ie', BrV.ie(uf).validate(value));
			var formatedValue = processed.result;
			if (uf && uf.toUpperCase() === 'SP' && /^p/i.test(value)) {
				return 'P'+(formatedValue ? formatedValue.trim().replace(/[^0-9]$/, '') : '');
			}
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				state: '=uiBrIeMask'
			},
			link: function(scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				scope.$watch('state', function(state) {
					console.log('');
					console.log('state changed to: '+state);
					console.log('ctrl.$viewValue: '+ctrl.$viewValue);
					applyIEMask(ctrl.$viewValue, state, ctrl);
				});

				ctrl.$formatters.push(function(value) {
					console.log('');
					console.log('format('+value+')');
					console.log('scope.state: '+scope.state);
					return applyIEMask(value, scope.state, ctrl);
				});

				ctrl.$parsers.push(function(value) {
					console.log('');
					console.log('parse('+value+')');
					console.log('scope.state: '+scope.state);
					if (!value) {
						return value;
					}

					var formatedValue = applyIEMask(value, scope.state, ctrl);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					if (scope.state && scope.state.toUpperCase() === 'SP' && /^p/i.test(value)) {
						return 'P'+clearValue(formatedValue);
					}
					return clearValue(formatedValue);
				});
			}
		};
	});

})();
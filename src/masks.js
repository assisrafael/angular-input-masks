(function() {
	'use strict';

	function maxValidator(ctrl, value, limit) {
		var max = parseFloat(limit);
		var validity = ctrl.$isEmpty(value) || isNaN(max)|| value <= max;
		ctrl.$setValidity('max', validity);
		return value;
	}

	function minValidator(ctrl, value, limit) {
		var min = parseFloat(limit);
		var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
		ctrl.$setValidity('min', validity);
		return value;
	}

	var cnpjPattern = new StringMask('00.000.000\/0000-00');
	var cpfPattern = new StringMask('000.000.000-00');

	function numberViewMask (decimals, decimalDelimiter, thousandsDelimiter) {
		var mask = '###0';

		if(decimals > 0) {
			mask = '#' + thousandsDelimiter + '##0';
			mask += decimalDelimiter;
			for (var i = 0; i < decimals; i++) {
				mask += '0';
			}
		}

		return new StringMask(mask, {
			reverse:true
		});
	}

	function numberModelMask (decimals) {
		var mask = '###0';

		if(decimals > 0) {
			mask += '.';
			for (var i = 0; i < decimals; i++) {
				mask += '0';
			}
		}

		return new StringMask(mask, {
			reverse:true
		});
	}

	function clearDelimitersAndLeadingZeros (value) {
		var cleanValue = value.replace(/^0*/, '');
		cleanValue = cleanValue.replace(/[^0-9]/g, '');
		return cleanValue;
	}

	function preparePercentageToFormatter (value, decimals) {
		return clearDelimitersAndLeadingZeros((parseFloat(value)*100).toFixed(decimals));
	}

	function prepareNumberToFormatter (value, decimals) {
		return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
	}

	function uiBrCpfMask() {
		function applyCpfMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cpfPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfMask(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]/g,'');
					var formatedValue = applyCpfMask(actualNumber);
					ctrl.$setValidity('cpf', BrV.cpf.validate(formatedValue));

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}

	function uiBrCnpjMask() {
		function applyCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue = cnpjPattern.apply(value);
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCnpjMask(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCnpjMask(actualNumber);
					ctrl.$setValidity('cnpj', BrV.cnpj.validate(formatedValue));

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}

	function uiBrCpfCnpjMask() {
		function applyCpfCnpjMask (value) {
			if(!value) {
				return value;
			}
			var formatedValue;
			if (value.length > 11) {
				formatedValue = cnpjPattern.apply(value);
			} else {
				formatedValue = cpfPattern.apply(value);
			}
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCpfCnpjMask(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					var actualNumber = value.replace(/[^\d]+/g,'');

					var formatedValue = applyCpfCnpjMask(actualNumber);
					if (actualNumber.length > 11) {
						ctrl.$setValidity('cnpj', BrV.cnpj.validate(formatedValue));
						ctrl.$setValidity('cpf', true);
					} else {
						ctrl.$setValidity('cpf', BrV.cpf.validate(formatedValue));
						ctrl.$setValidity('cnpj', true);
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}

	angular.module('ui.utils.masks', [])
	.directive('uiPercentageMask', ['$locale', function ($locale) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
			thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;

		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				min: '=?min',
				max: '=?max'
			},
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var decimals = parseInt(attrs.uiPercentageMask);
				if(isNaN(decimals)) {
					decimals = 2;
				}
				var numberDecimals = decimals + 2;
				var viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = numberModelMask(numberDecimals);

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return ' %';
					}

					var valueToFormat = preparePercentageToFormatter(value, decimals);
					return viewMask.apply(valueToFormat) + ' %';
				});

				ctrl.$parsers.push(function(value) {
					function renderValue(formatedValue) {
						if (ctrl.$viewValue !== formatedValue) {
							ctrl.$setViewValue(formatedValue);
							ctrl.$render();
						}	
					}
					if(!value) {
						renderValue(' %');
						return value;
					}

					var valueToFormat = clearDelimitersAndLeadingZeros(value);
					if(value && value.indexOf('%') < 0 && valueToFormat.length >= 1) {
						valueToFormat = valueToFormat.substr(0,valueToFormat.length-1);
					}
					var formatedValue = ' %';
					var actualNumber;
					if (valueToFormat) {
						formatedValue = viewMask.apply(valueToFormat) + ' %';
						actualNumber = parseFloat(modelMask.apply(valueToFormat));
					}
					renderValue(formatedValue);

					return actualNumber;
				});

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						return minValidator(ctrl, value, scope.min);
					});

					scope.$watch('min', function() {
						minValidator(ctrl, ctrl.$modelValue, scope.min);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						return maxValidator(ctrl, value, scope.max);
					});

					scope.$watch('max', function() {
						maxValidator(ctrl, ctrl.$modelValue, scope.max);
					});
				}
			}
		};
	}])
	.directive('uiNumberMask', ['$locale', function ($locale) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
			thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;

		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				min: '=?min',
				max: '=?max'
			},
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var decimals = parseInt(attrs.uiNumberMask);
				if(isNaN(decimals)) {
					decimals = 2;
				}
				var viewMask = numberViewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = numberModelMask(decimals);

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = prepareNumberToFormatter(value, decimals);
					return viewMask.apply(valueToFormat);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = clearDelimitersAndLeadingZeros(value);
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if(angular.isDefined(attrs.uiNegativeNumber)){
						var isNegative = (value[0] === '-'),
							needsToInvertSign = (value.slice(-1) === '-');

						//only apply the minus sign if is negative or(exclusive) needs to be negative
						if(needsToInvertSign ^ isNegative) {
							actualNumber *= -1;
							formatedValue = '-' + formatedValue;
						}
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				});

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						return minValidator(ctrl, value, scope.min);
					});

					scope.$watch('min', function() {
						minValidator(ctrl, ctrl.$modelValue, scope.min);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						return maxValidator(ctrl, value, scope.max);
					});

					scope.$watch('max', function() {
						maxValidator(ctrl, ctrl.$modelValue, scope.max);
					});
				}
			}
		};
	}])
	.directive('uiBrCpfMask', [uiBrCpfMask])
	.directive('uiBrCnpjMask', [uiBrCnpjMask])
	.directive('uiBrCpfcnpjMask', [uiBrCpfCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfMask', [uiBrCpfMask])
	// deprecated: will be removed in the next major version
	.directive('uiCnpjMask', [uiBrCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfcnpjMask', [uiBrCpfCnpjMask])
	.directive('uiMoneyMask', ['$locale', function ($locale) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
		var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
		var currencySym = $locale.NUMBER_FORMATS.CURRENCY_SYM;
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var decimals = parseInt(attrs.uiMoneyMask);
				if(isNaN(decimals)) {
					decimals = 2;
				}
				var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
				var maskPattern = currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern;
				var moneyMask = new StringMask(maskPattern, {reverse: true});

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return moneyMask.apply(value.toFixed(decimals).replace(/[^\d]+/g,''));
				});

				ctrl.$parsers.push(function(value) {
					if (!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					actualNumber = actualNumber.replace(/^[0]+([1-9])/,'$1');
					var formatedValue = moneyMask.apply(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return parseInt(formatedValue.replace(/[^\d]+/g,''))/Math.pow(10,decimals);
				});
			}
		};
	}])
	.directive('uiBrPhoneNumber',function() {
		/**
		 * FIXME: all numbers will have 9 digits after 2016.
		 * see http://portal.embratel.com.br/embratel/9-digito/
		 */
		var phoneMask8D = new StringMask('(00) 0000-0000'),
			phoneMask9D = new StringMask('(00) 00000-0000');

		function clearValue (value) {
			if(!value) {
				return value;
			}

			return value.replace(/[^0-9]/g, '');
		}

		function applyPhoneMask (value) {
			if(!value) {
				return value;
			}

			var formatedValue;
			if(value.length < 11){
				formatedValue = phoneMask8D.apply(value);
			}else{
				formatedValue = phoneMask9D.apply(value);
			}

			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyPhoneMask(value);
				});

				ctrl.$parsers.push(function(value) {
					if (!value) {
						return value;
					}

					var cleanValue = clearValue(value);
					var formatedValue = applyPhoneMask(cleanValue);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return clearValue(formatedValue);
				});
			}
		};
	})
	.directive('uiBrCepMask',function() {
		var cepMask = new StringMask('00000-000');

		function clearValue (value) {
			if(!value) {
				return value;
			}

			return value.replace(/[^0-9]/g, '');
		}

		function applyCepMask (value, ctrl) {
			if(!value) {
				return value;
			}
			var processed = cepMask.process(value);
			ctrl.$setValidity('cep', processed.valid);
			var formatedValue = processed.result;
			return formatedValue.trim().replace(/[^0-9]$/, '');
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					return applyCepMask(value, ctrl);
				});

				ctrl.$parsers.push(function(value) {
					if (!value) {
						return value;
					}

					var cleanValue = clearValue(value);
					var formatedValue = applyCepMask(cleanValue, ctrl);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return clearValue(formatedValue);
				});
			}
		};
	})
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
					applyIEMask(ctrl.$viewValue, state, ctrl);
				});

				ctrl.$formatters.push(function(value) {
					return applyIEMask(value, scope.state, ctrl);
				});

				ctrl.$parsers.push(function(value) {
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

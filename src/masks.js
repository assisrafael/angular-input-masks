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
	function validateCNPJ(c) {
		var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
		c = c.replace(/[^\d]/g,'').split('');
		if(c.length !== 14) {
			return false;
		}

		for (var i = 0, n = 0; i < 12; i++) {
			n += c[i] * b[i+1];
		}
		n = 11 - n%11;
		n = n >= 10 ? 0 : n;
		if (parseInt(c[12]) !== n)  {
			return false;
		}

		for (i = 0, n = 0; i <= 12; i++) {
			n += c[i] * b[i];
		}
		n = 11 - n%11;
		n = n >= 10 ? 0 : n;
		if (parseInt(c[13]) !== n)  {
			return false;
		}
		return true;
	}

	var cpfPattern = new StringMask('000.000.000-00');
	function validateCPF(cpf) {
		cpf = cpf.replace(/[^\d]+/g,'');
		if (cpf === '' || cpf === '00000000000' || cpf.length !== 11) {
			return false;
		}
		function validateDigit(digit) {
			var add = 0;
			var init = digit - 9;
			for (var i = 0; i < 9; i ++) {
				add += parseInt(cpf.charAt(i + init)) * (i+1);
			}
			return (add%11)%10 === parseInt(cpf.charAt(digit));
		}
		return validateDigit(9) && validateDigit(10);
	}

	function numberViewMask (decimals, decimalDelimiter, thousandsDelimiter) {
		var mask = '#' + thousandsDelimiter + '##0';

		if(decimals > 0) {
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
						return value;
					}

					var valueToFormat = preparePercentageToFormatter(value, decimals);
					return viewMask.apply(valueToFormat);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = clearDelimitersAndLeadingZeros(value);
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

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
	.directive('uiCpfMask', [function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return cpfPattern.apply(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = cpfPattern.apply(actualNumber);
					ctrl.$setValidity('cpf', validateCPF(formatedValue));

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}])
	.directive('uiCnpjMask', [function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return cnpjPattern.apply(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = cnpjPattern.apply(actualNumber);
					ctrl.$setValidity('cnpj', validateCNPJ(formatedValue));

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}])
	.directive('uiCpfcnpjMask', [function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}
					var actualNumber = value.replace(/[^\d]+/g,'');
					if(actualNumber.length > 11) {
						return cnpjPattern.apply(value);
					}
					return cpfPattern.apply(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					var actualNumber = value.replace(/[^\d]+/g,'');

					var formatedValue = '';
					if (actualNumber.length > 11) {
						formatedValue = cnpjPattern.apply(actualNumber);
						ctrl.$setValidity('cnpj', validateCNPJ(formatedValue));
						ctrl.$setValidity('cpf', true);
					} else {
						formatedValue = cpfPattern.apply(actualNumber);
						ctrl.$setValidity('cpf', validateCPF(formatedValue));
						ctrl.$setValidity('cnpj', true);
					}

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}])
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
				var moneyMask = new StringMask(currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern, {reverse: true});

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

		function removeLastNonDigitChar (value) {
			if(!value) {
				return value;
			}

			return value.trim().replace(/[^0-9]$/, '');
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
		}
	});
})();

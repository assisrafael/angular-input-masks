(function() {
	'use strict';

	var ZEROS = '00000000000000000000';
	var rgxGroupDigits = /(\d+)(\d{3})/;

	function addDefaultDelimiter(value, rgxDecimalDelimiter) {
		return value.replace(rgxDecimalDelimiter, '$1' + '.' + '$2');
	}

	function fillWithZeros(value, minLength) {
		if(!value || value.length < minLength) {
			value = (ZEROS + value).slice(-minLength);
		}

		return value;
	}

	function genericNumberFormat(number, decimalDelimiter, thousandsDelimiter) {
		number = number.toString().split('.');
		var thousands = number[0];
		var decimals = number.length > 1 ? decimalDelimiter + number[1] : '';
		
		while (rgxGroupDigits.test(thousands)) {
			thousands = thousands.replace(rgxGroupDigits, '$1' + thousandsDelimiter + '$2');
		}
		return thousands + decimals;
	}

	function formatToDecimals (value, decimals) {
		var cleanValue = value.replace(/[^0-9]/g, '');
		var minLength = decimals + 1;
		var zeroFilledValue = fillWithZeros(cleanValue, minLength);
		var rgxDecimalDelimiter = new RegExp('^(\\d+)(\\d{' + decimals + '})$');
		var delimitedValue = addDefaultDelimiter(zeroFilledValue, rgxDecimalDelimiter);
		return parseFloat(delimitedValue).toFixed(decimals);
	}

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

	angular.module('ui.utils.masks', [])
	.directive('uiPercentageMask', ['$locale', function ($locale) {
		function localizedNumberFormat(value) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
			var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
			return genericNumberFormat(value, decimalDelimiter, thousandsDelimiter);
		}

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

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return localizedNumberFormat((parseFloat(value)*100).toFixed(decimals));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					
					var actualNumber = formatToDecimals(value, decimals);
					var formatedValue = localizedNumberFormat(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
						actualNumber = formatToDecimals(value, numberDecimals);
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
		function localizedNumberFormat(value) {
			var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP;
			var thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP;
			return genericNumberFormat(value, decimalDelimiter, thousandsDelimiter);
		}

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

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return localizedNumberFormat(parseFloat(value).toFixed(decimals));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					
					var actualNumber = formatToDecimals(value, decimals);
					var formatedValue = localizedNumberFormat(actualNumber);

					if (value !== formatedValue) {
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

					//console.log(value);
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
		console.log($locale);
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				if (!ctrl) {
					return;
				}

				var decimals = parseInt(attrs.uiMoneyMask);
				if(isNaN(decimals)) {
					decimals = decimalDelimiter+'00';
				} else if(decimals > 0) {
					decimals = decimalDelimiter+new Array(decimals + 1).join('0');
				} else {
					decimals = '';
				}
				var moneyMask = new StringMask(currencySym+' #'+thousandsDelimiter+'##0'+decimals, {reverse: true});

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					return moneyMask.apply(value);
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}
					
					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = moneyMask.apply(actualNumber);

					if (value !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});
			}
		};
	}]);
})();
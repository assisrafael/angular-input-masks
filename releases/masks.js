/**
 * angular-mask
 * Personalized input masks for AngularJS
 * @version v1.3.1
 * @link http://github.com/assisrafael/angular-input-masks
 * @license MIT
 */
(function (angular) {

'use strict';

angular.module('ui.utils.masks.helpers', [])
.factory('PreFormatters', [function(){
	function clearDelimitersAndLeadingZeros(value) {
		var cleanValue = value.replace(/^-/,'').replace(/^0*/, '');
		cleanValue = cleanValue.replace(/[^0-9]/g, '');
		return cleanValue;
	}

	function prepareNumberToFormatter (value, decimals) {
		return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
	}

	return {
		clearDelimitersAndLeadingZeros: clearDelimitersAndLeadingZeros,
		prepareNumberToFormatter: prepareNumberToFormatter
	};
}])
.factory('NumberValidators', [function() {
	return {
		maxNumber: function maxValidator(ctrl, value, limit) {
			var max = parseFloat(limit);
			var validity = ctrl.$isEmpty(value) || isNaN(max)|| value <= max;
			ctrl.$setValidity('max', validity);
			return value;
		},
		minNumber: function minValidator(ctrl, value, limit) {
			var min = parseFloat(limit);
			var validity = ctrl.$isEmpty(value) || isNaN(min) || value >= min;
			ctrl.$setValidity('min', validity);
			return value;
		}
	};
}])
.factory('NumberMasks', [function(){
	return {
		viewMask: function (decimals, decimalDelimiter, thousandsDelimiter) {
			var mask = '#' + thousandsDelimiter + '##0';

			if(decimals > 0) {
				mask += decimalDelimiter;
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		},
		modelMask: function (decimals) {
			var mask = '###0';

			if(decimals > 0) {
				mask += '.';
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		}
	};
}]);

'use strict';

angular.module('ui.utils.masks', [
	'ui.utils.masks.global',
	'ui.utils.masks.br'
])
.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

'use strict';

angular.module('ui.utils.masks.br', [
	'ui.utils.masks.helpers',
	'ui.utils.masks.br.cep',
	'ui.utils.masks.br.cpfCnpj',
	'ui.utils.masks.br.ie',
	'ui.utils.masks.br.nfe',
	'ui.utils.masks.br.phone'
]);

'use strict';

angular.module('ui.utils.masks.global', [
	'ui.utils.masks.helpers',
	'ui.utils.masks.global.date',
	'ui.utils.masks.global.money',
	'ui.utils.masks.global.number',
	'ui.utils.masks.global.percentage',
	'ui.utils.masks.global.scientific-notation',
	'ui.utils.masks.global.time'
]);

'use strict';

angular.module('ui.utils.masks.br.cep', [])
.directive('uiBrCepMask', [function() {
	var cepMask = new StringMask('00000-000');

	function clearValue (value) {
		if(!value) {
			return value;
		}

		return value.replace(/[^0-9]/g, '');
	}

	function applyCepMask (value, ctrl) {
		if(!value) {
			ctrl.$setValidity('cep', true);
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
					return applyCepMask(value, ctrl);
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
}]);

'use strict';

(function() {
	var cnpjPattern = new StringMask('00.000.000\/0000-00');
	var cpfPattern = new StringMask('000.000.000-00');

	function validateCPF (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cpf.validate(value);
		ctrl.$setValidity('cpf', valid);
		return value;
	}

	function validateCNPJ (ctrl, value) {
		var valid = ctrl.$isEmpty(value) || BrV.cnpj.validate(value);
		ctrl.$setValidity('cnpj', valid);
		return value;
	}

	function validateCPForCNPJ (ctrl, value) {
		if(!value || value.length <= 11) {
			validateCNPJ(ctrl, '');
			return validateCPF(ctrl, value);
		}else {
			validateCPF(ctrl, '');
			return validateCNPJ(ctrl, value);
		}
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
					return applyCpfMask(validateCPF(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]/g,'');
					var formatedValue = applyCpfMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPF(ctrl, value);
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
					return applyCnpjMask(validateCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCNPJ(ctrl, value);
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
					return applyCpfCnpjMask(validateCPForCNPJ(ctrl, value));
				});

				ctrl.$parsers.push(function(value) {
					if(!value) {
						return value;
					}

					var actualNumber = value.replace(/[^\d]+/g,'');
					var formatedValue = applyCpfCnpjMask(actualNumber);

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return formatedValue.replace(/[^\d]+/g,'');
				});

				ctrl.$parsers.push(function(value) {
					return validateCPForCNPJ(ctrl, value);
				});
			}
		};
	}

	angular.module('ui.utils.masks.br.cpfCnpj', [])
	.directive('uiBrCpfMask', [uiBrCpfMask])
	.directive('uiBrCnpjMask', [uiBrCnpjMask])
	.directive('uiBrCpfcnpjMask', [uiBrCpfCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfMask', [uiBrCpfMask])
	// deprecated: will be removed in the next major version
	.directive('uiCnpjMask', [uiBrCnpjMask])
	// deprecated: will be removed in the next major version
	.directive('uiCpfcnpjMask', [uiBrCpfCnpjMask]);
})();

'use strict';

angular.module('ui.utils.masks.br.ie', [])
.directive('uiBrIeMask', ['$parse', function($parse) {
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
			ctrl.$setValidity('ie', true);
			return value;
		}
		var processed = mask.process(clearValue(value));
		ctrl.$setValidity('ie', BrV.ie(uf).validate(value));
		var formatedValue = processed.result;
		if (uf && uf.toUpperCase() === 'SP' && /^p/i.test(value)) {
			return 'P'+(formatedValue ? formatedValue.trim().replace(/[^0-9]$/, '') : '');
		}
		if(!formatedValue) {
			return formatedValue;
		}
		return formatedValue.trim().replace(/[^0-9]$/, '');
	}

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			var state = $parse(attrs.uiBrIeMask)(scope);

			if (!ctrl) {
				return;
			}

			scope.$watch(attrs.uiBrIeMask, function(newState) {
				state = newState;
				applyIEMask(ctrl.$viewValue, state, ctrl);
			});

			ctrl.$formatters.push(function(value) {
				return applyIEMask(value, state, ctrl);
			});

			ctrl.$parsers.push(function(value) {
				if (!value) {
					return applyIEMask(value, state, ctrl);
				}

				var formatedValue = applyIEMask(value, state, ctrl);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				if (state && state.toUpperCase() === 'SP' && /^p/i.test(value)) {
					return 'P'+clearValue(formatedValue);
				}
				return clearValue(formatedValue);
			});
		}
	};
}]);

'use strict';

angular.module('ui.utils.masks.br.nfe', [])
.directive('uiNfeAccessKeyMask', ['$log', function($log) {
	var nfeAccessKeyMask = new StringMask('0000 0000 0000 0000 0000' +
		' 0000 0000 0000 0000 0000 0000');

	function clearValue (value) {
		if (angular.isUndefined(value) || value.length === 0) {
			return value;
		}

		return value.replace(/[^0-9]/g, '').slice(0, 44);
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			function formatter (value) {
				$log.debug('[uiNfeAccessKeyMask] Formatter called: ', value);
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				var formattedValue = nfeAccessKeyMask.apply(value);
				return formattedValue.replace(/[^0-9]$/, '');
			}

			function parser (value) {
				$log.debug('[uiNfeAccessKeyMask] Parser called: ', value);

				var modelValue = clearValue(value);
				var viewValue = formatter(modelValue);

				if(ctrl.$viewValue !== viewValue) {
					ctrl.$setViewValue(viewValue);
					ctrl.$render();
				}

				return modelValue;
			}

			function validator (value) {
				$log.debug('[uiNfeAccessKeyMask] Validator called: ', value);

				if(angular.isUndefined(value)) {
					return value;
				}

				var isValid = value.toString().length === 44;

				ctrl.$setValidity('nfe-access-key', ctrl.$isEmpty(value) || isValid);
				return value;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}]);

'use strict';

angular.module('ui.utils.masks.br.phone', [])
.factory('PhoneValidators', [function() {
	return {
		brPhoneNumber: function (ctrl, value) {
			var valid = ctrl.$isEmpty(value) || value.length === 10 || value.length === 11;
			ctrl.$setValidity('br-phone-number', valid);
			return value;
		}
	};
}])
.directive('uiBrPhoneNumber', ['PhoneValidators', function(PhoneValidators) {
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
				return applyPhoneMask(PhoneValidators.brPhoneNumber(ctrl, value));
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

			ctrl.$parsers.push(function(value) {
				return PhoneValidators.brPhoneNumber(ctrl, value);
			});
		}
	};
}]);

'use strict';

/*global moment*/
var globalMomentJS;
if (typeof moment !== 'undefined') {
	globalMomentJS = moment;
}

var dependencies = [];

try {
	//Check if angular-momentjs is available
	angular.module('angular-momentjs');
	dependencies.push('angular-momentjs');
} catch (e) {}

angular.module('ui.utils.masks.global.date', dependencies)
.directive('uiDateMask', ['$locale', '$log', '$injector', function($locale, $log, $injector) {
	var moment;

	if (typeof globalMomentJS === 'undefined') {
		if ($injector.has('MomentJS')) {
			moment = $injector.get('MomentJS');
		} else {
			throw new Error('Moment.js not found. Check if it is available.');
		}
	} else {
		moment = globalMomentJS;
	}

	var dateFormatMapByLocalle = {
		'pt-br': 'DD/MM/YYYY',
	};

	var dateFormat = dateFormatMapByLocalle[$locale.id] || 'YYYY-MM-DD';

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			var dateMask = new StringMask(dateFormat.replace(/[YMD]/g,'0'));

			function clearValue (value) {
				if(angular.isUndefined(value)) {
					return value;
				}

				return value.replace(/[^0-9]/g, '');
			}

			function applyMask (value) {
				if(angular.isUndefined(value) || value.length === 0) {
					return;
				}

				var cleanValue = clearValue(value);
				var formatedValue = dateMask.process(cleanValue).result;

				return formatedValue.trim().replace(/[^0-9]$/, '');
			}

			function formatter (value) {
				$log.debug('[uiDateMask] Formatter called: ', value);
				if(angular.isUndefined(value)) {
					return;
				}

				var formatedValue = applyMask(moment(value).format(dateFormat));
				validator(formatedValue);
				return formatedValue;
			}

			function parser(value) {
				$log.debug('[uiDateMask] Parser called: ', value);

				var formatedValue = applyMask(value);
				$log.debug('[uiDateMask] Formated value: ', formatedValue);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}
				validator(formatedValue);

				var modelValue = moment(formatedValue, dateFormat);
				return modelValue.toDate();
			}

			function validator(value) {
				$log.debug('[uiDateMask] Validator called: ', value);

				var isValid = moment(value, dateFormat).isValid() &&
					value.length === dateFormat.length;
				ctrl.$setValidity('date', ctrl.$isEmpty(value) || isValid);
			}

			ctrl.$formatters.push(formatter);
			ctrl.$parsers.push(parser);
		}
	};
}]);

'use strict';

angular.module('ui.utils.masks.global.money', [])
.directive('uiMoneyMask',
	['$locale', '$parse', 'PreFormatters', 'NumberValidators',
	function ($locale, $parse, PreFormatters, NumberValidators) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					currencySym = attrs.currencySymbol || $locale.NUMBER_FORMATS.CURRENCY_SYM,
					decimals = parseInt(attrs.uiMoneyMask);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
				var maskPattern = currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern;
				var moneyMask = new StringMask(maskPattern, {reverse: true});

				ctrl.$formatters.push(function(value) {
					if(angular.isUndefined(value)) {
						return value;
					}

					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return moneyMask.apply(valueToFormat);
				});

				function parse(value) {
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

					return formatedValue ? parseInt(formatedValue.replace(/[^\d]+/g,''))/Math.pow(10,decimals) : null;
				}

				ctrl.$parsers.push(parse);

				if (attrs.uiMoneyMask) {
					scope.$watch(attrs.uiMoneyMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
						maskPattern = currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern;
						moneyMask = new StringMask(maskPattern, {reverse: true});

						parse(ctrl.$viewValue || '');
					});
				}

				if (attrs.currencySymbol) {
					scope.$watch(attrs.currencySymbol, function(symbol) {
						if (!symbol) {
							return ;
						}
						currencySym = symbol;
						decimalsPattern = decimals > 0 ? decimalDelimiter + new Array(decimals + 1).join('0') : '';
						maskPattern = currencySym+' #'+thousandsDelimiter+'##0'+decimalsPattern;
						moneyMask = new StringMask(maskPattern, {reverse: true});

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch(attrs.min, function(value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch(attrs.max, function(value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}
]);

'use strict';

angular.module('ui.utils.masks.global.number', [])
.directive('uiNumberMask',
	['$locale', '$parse', 'PreFormatters', 'NumberMasks', 'NumberValidators',
	function ($locale, $parse, PreFormatters, NumberMasks, NumberValidators) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = $parse(attrs.uiNumberMask)(scope);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = NumberMasks.modelMask(decimals);

				function parse(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					var formatedValue = viewMask.apply(valueToFormat);
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if(angular.isDefined(attrs.uiNegativeNumber)){
						var isNegative = (value[0] === '-'),
							needsToInvertSign = (value.slice(-1) === '-');

						//only apply the minus sign if it is negative or(exclusive)
						//needs to be negative and the number is different from zero
						if(needsToInvertSign ^ isNegative && !!actualNumber) {
							actualNumber *= -1;
							formatedValue = '-' + formatedValue;
						}
					}

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$formatters.push(function(value) {
					var prefix = '';
					if(angular.isDefined(attrs.uiNegativeNumber) && value < 0){
						prefix = '-';
					}

					if(!value) {
						return value;
					}

					var valueToFormat = PreFormatters.prepareNumberToFormatter(value, decimals);
					return prefix + viewMask.apply(valueToFormat);
				});

				ctrl.$parsers.push(parse);

				if (attrs.uiNumberMask) {
					scope.$watch(attrs.uiNumberMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(decimals);

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch(attrs.min, function(value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch(attrs.max, function(value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}
]);

'use strict';

angular.module('ui.utils.masks.global.percentage', [])
.directive('uiPercentageMask',
	['$locale', '$parse', 'PreFormatters', 'NumberMasks', 'NumberValidators',
	function ($locale, $parse, PreFormatters, NumberMasks, NumberValidators) {
		function preparePercentageToFormatter (value, decimals) {
			return PreFormatters.clearDelimitersAndLeadingZeros((parseFloat(value)*100).toFixed(decimals));
		}

		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ctrl) {
				var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
					thousandsDelimiter = $locale.NUMBER_FORMATS.GROUP_SEP,
					decimals = parseInt(attrs.uiPercentageMask);

				if (!ctrl) {
					return;
				}

				if (angular.isDefined(attrs.uiHideGroupSep)){
					thousandsDelimiter = '';
				}

				if(isNaN(decimals)) {
					decimals = 2;
				}
				var numberDecimals = decimals + 2;
				var viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter),
					modelMask = NumberMasks.modelMask(numberDecimals);

				ctrl.$formatters.push(function(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = preparePercentageToFormatter(value, decimals);
					return viewMask.apply(valueToFormat) + ' %';
				});

				function parse(value) {
					if(!value) {
						return value;
					}

					var valueToFormat = PreFormatters.clearDelimitersAndLeadingZeros(value) || '0';
					if(value.length > 1 && value.indexOf('%') === -1) {
						valueToFormat = valueToFormat.slice(0,valueToFormat.length-1);
					}
					var formatedValue = viewMask.apply(valueToFormat) + ' %';
					var actualNumber = parseFloat(modelMask.apply(valueToFormat));

					if (ctrl.$viewValue !== formatedValue) {
						ctrl.$setViewValue(formatedValue);
						ctrl.$render();
					}

					return actualNumber;
				}

				ctrl.$parsers.push(parse);

				if (attrs.uiPercentageMask) {
					scope.$watch(attrs.uiPercentageMask, function(decimals) {
						if(isNaN(decimals)) {
							decimals = 2;
						}
						numberDecimals = decimals + 2;
						viewMask = NumberMasks.viewMask(decimals, decimalDelimiter, thousandsDelimiter);
						modelMask = NumberMasks.modelMask(numberDecimals);

						parse(ctrl.$viewValue || '');
					});
				}

				if(attrs.min){
					ctrl.$parsers.push(function(value) {
						var min = $parse(attrs.min)(scope);
						return NumberValidators.minNumber(ctrl, value, min);
					});

					scope.$watch('min', function(value) {
						NumberValidators.minNumber(ctrl, ctrl.$modelValue, value);
					});
				}

				if(attrs.max) {
					ctrl.$parsers.push(function(value) {
						var max = $parse(attrs.max)(scope);
						return NumberValidators.maxNumber(ctrl, value, max);
					});

					scope.$watch('max', function(value) {
						NumberValidators.maxNumber(ctrl, ctrl.$modelValue, value);
					});
				}
			}
		};
	}
]);

'use strict';

angular.module('ui.utils.masks.global.scientific-notation', [])
.directive('uiScientificNotationMask', ['$locale', '$parse', '$log',
	function($locale, $parse, $log) {
		var decimalDelimiter = $locale.NUMBER_FORMATS.DECIMAL_SEP,
			defaultPrecision = 2;

		function significandMaskBuilder (decimals) {
			var mask = '0';

			if(decimals > 0) {
				mask += decimalDelimiter;
				for (var i = 0; i < decimals; i++) {
					mask += '0';
				}
			}

			return new StringMask(mask, {
				reverse: true
			});
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				var decimals = $parse(attrs.uiScientificNotationMask)(scope);

				if(isNaN(decimals)) {
					decimals = defaultPrecision;
				}

				var significandMask = significandMaskBuilder(decimals);

				function splitNumber (value) {
					var stringValue = value.toString(),
						splittedNumber = stringValue.match(/(-?[0-9]*)[\.]?([0-9]*)?[Ee]?([\+-]?[0-9]*)?/);

					return {
						integerPartOfSignificand: splittedNumber[1],
						decimalPartOfSignificand: splittedNumber[2],
						exponent: splittedNumber[3] | 0
					};
				}

				function formatter (value) {
					$log.debug('[uiScientificNotationMask] Formatter called: ', value);

					if (angular.isUndefined(value)) {
						return value;
					}

					if (typeof value === 'string') {
						if (value.length === 0) {
							return value;
						}

						value = value.replace(decimalDelimiter, '.');
					} else if (typeof value === 'number') {
						value = value.toExponential(decimals);
					}

					var formattedValue, exponent;
					var splittedNumber = splitNumber(value);

					var integerPartOfSignificand = splittedNumber.integerPartOfSignificand | 0;
					var numberToFormat = integerPartOfSignificand.toString();
					if (angular.isDefined(splittedNumber.decimalPartOfSignificand)) {
						numberToFormat += splittedNumber.decimalPartOfSignificand;
					}

					var needsNormalization =
						(integerPartOfSignificand >= 1 || integerPartOfSignificand <= -1) &&
						(
							(angular.isDefined(splittedNumber.decimalPartOfSignificand) &&
							splittedNumber.decimalPartOfSignificand.length > decimals) ||
							(decimals === 0 && numberToFormat.length >= 2)
						);

					if (needsNormalization) {
						exponent = numberToFormat.slice(decimals + 1, numberToFormat.length);
						numberToFormat = numberToFormat.slice(0, decimals + 1);
					}

					formattedValue = significandMask.apply(numberToFormat);

					if (splittedNumber.exponent !== 0) {
						exponent = splittedNumber.exponent;
					}

					if (angular.isDefined(exponent)) {
						formattedValue += 'e' + exponent;
					}

					return formattedValue;
				}

				function parser (value) {
					$log.debug('[uiScientificNotationMask] Parser called: ', value);

					if(angular.isUndefined(value) || value.toString().length === 0) {
						return value;
					}

					var viewValue = formatter(value),
						modelValue = parseFloat(viewValue.replace(decimalDelimiter, '.'));

					if (ctrl.$viewValue !== viewValue) {
						ctrl.$setViewValue(viewValue);
						ctrl.$render();
					}

					return modelValue;
				}

				function validator (value) {
					$log.debug('[uiScientificNotationMask] Validator called: ', value);

					if(angular.isUndefined(value)) {
						return value;
					}

					var isMaxValid = value < Number.MAX_VALUE;
					ctrl.$setValidity('max', ctrl.$isEmpty(value) || isMaxValid);
					return value;
				}

				ctrl.$formatters.push(formatter);
				ctrl.$formatters.push(validator);
				ctrl.$parsers.push(parser);
				ctrl.$parsers.push(validator);
			}
		};
	}
]);

'use strict';

angular.module('ui.utils.masks.global.time', [])
.directive('uiTimeMask', ['$log', function($log) {
	if(typeof StringMask === 'undefined') {
		throw new Error('StringMask not found. Check if it is available.');
	}

	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			var unformattedValueLength = 6,
				formattedValueLength = 8,
				timeFormat = '00:00:00';

			if (angular.isDefined(attrs.uiTimeMask) && attrs.uiTimeMask === 'short') {
				unformattedValueLength = 4;
				formattedValueLength = 5;
				timeFormat = '00:00';
			}

			var timeMask = new StringMask(timeFormat);

			function clearValue (value) {
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				return value.replace(/[^0-9]/g, '').slice(0, unformattedValueLength);
			}

			function formatter (value) {
				$log.debug('[uiTimeMask] Formatter called: ', value);
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				var formattedValue = timeMask.process(clearValue(value)).result;
				return formattedValue.replace(/[^0-9]$/, '');
			}

			function parser (value) {
				$log.debug('[uiTimeMask] Parser called: ', value);

				var modelValue = formatter(value);
				var viewValue = modelValue;

				if(ctrl.$viewValue !== viewValue) {
					ctrl.$setViewValue(viewValue);
					ctrl.$render();
				}

				return modelValue;
			}

			function validator (value) {
				$log.debug('[uiTimeMask] Validator called: ', value);

				if(angular.isUndefined(value)) {
					return value;
				}

				var splittedValue = value.toString().split(/:/).filter(function(v) {
					return !!v;
				});

				var hours = parseInt(splittedValue[0]),
					minutes = parseInt(splittedValue[1]),
					seconds = parseInt(splittedValue[2] || 0);

				var isValid = value.toString().length === formattedValueLength &&
					hours < 24 && minutes < 60 && seconds < 60;

				ctrl.$setValidity('time', ctrl.$isEmpty(value) || isValid);
				return value;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$formatters.push(validator);
			ctrl.$parsers.push(parser);
			ctrl.$parsers.push(validator);
		}
	};
}]);

})(angular);

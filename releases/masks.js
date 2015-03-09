/**
 * angular-mask
 * Personalized input masks for AngularJS
 * @version v1.3.1
 * @link http://github.com/assisrafael/angular-input-masks
 * @license MIT
 */
(function (angular) {

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

/**
 * Created by lsneto on 26/02/15.
 */

'use strict';

angular.module('ui.utils.masks.data', [])
  .directive('uiDataMask', [function() {
    var dataMask = new StringMask('00/00/0000');

    function clearValue (value) {
      if(!value) {
        return value;
      }

      return value.replace(/[^0-9]/g, '');
    }

    function applyDataMask (value, ctrl) {
      if(!value) {
        ctrl.$setValidity('data', true);
        return value;
      }
      var processed = dataMask.process(value);
      ctrl.$setValidity('data', processed.valid);
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
          return applyDataMask(value, ctrl);
        });

        ctrl.$parsers.push(function(value) {
          if (!value) {
            return applyDataMask(value, ctrl);
          }

          var cleanValue = clearValue(value);
          var formatedValue = applyDataMask(cleanValue, ctrl);

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

angular.module('ui.utils.masks.br.phone', [])
.factory('PhoneValidators', [function() {
	return {
		brPhoneNumber: function (ctrl, value) {
			var valid = ctrl.$isEmpty(value) || value.length === 10 || value.length === 11;
			ctrl.$setValidity('brPhoneNumber', valid);
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

angular.module('ui.utils.masks', [
	'ui.utils.masks.br'
])
.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

})(angular);

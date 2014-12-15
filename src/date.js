'use strict';

/*global moment */
angular.module('ui.utils.masks.date', [])
.directive('uiDateMask', ['$locale', '$log', function($locale, $log) {
	if(typeof moment === 'undefined') {
		throw new Error('Moment.js not found. Check if it is available.');
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

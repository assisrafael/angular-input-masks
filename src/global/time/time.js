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
				return value.replace(/[^0-9]/g, '').slice(0, unformattedValueLength);
			}

			function formatter (value) {
				$log.debug('[uiTimeMask] Formatter called: ', value);
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				var cleanValue = clearValue(value);

				if (cleanValue.length == 0) {
					return '';
				}

				var formattedValue = timeMask.process(cleanValue).result;
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

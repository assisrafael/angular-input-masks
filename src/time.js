'use strict';

angular.module('ui.utils.masks.time', [])
.directive('uiTimeMask', ['$log', function($log) {
	if(typeof StringMask === 'undefined') {
		throw new Error('StringMask not found. Check if it is available.');
	}

	var timeMask = new StringMask('00:00:00');
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ctrl) {
			function clearValue (value) {
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				return value.replace(/[^0-9]/g, '').slice(0, 6);
			}

			function formatter (value) {
				$log.debug('[uiTimeMask] Formatter called: ', value);
				if(angular.isUndefined(value) || value.length === 0) {
					return value;
				}

				var formattedValue = timeMask.process(value).result;
				return formattedValue.replace(/[^0-9]$/, '');
			}

			function parser (value) {
				$log.debug('[uiTimeMask] Parser called: ', value);

				var modelValue = clearValue(value);
				var viewValue = formatter(modelValue);

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

				var splittedValue = value.toString().split(/([0-9]{2})/).filter(function(v) {
					return !!v;
				});

				var hours = parseInt(splittedValue[0]),
					minutes = parseInt(splittedValue[1]),
					seconds = parseInt(splittedValue[2]);

				var isValid = value.toString().length === 6 && hours < 24 && minutes < 60 && seconds < 60;

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

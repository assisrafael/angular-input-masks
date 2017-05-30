'use strict';

var StringMask = require('string-mask');

module.exports = function TimeMaskDirective() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			var timeFormat = '00:00:00';

			if (angular.isDefined(attrs.uiTimeMask) && attrs.uiTimeMask === 'short') {
				timeFormat = '00:00';
			}

			var formattedValueLength = timeFormat.length;
			var unformattedValueLength = timeFormat.replace(':', '').length;
			var timeMask = new StringMask(timeFormat);

			function formatter(value) {
				var cleanValue, correctedValue, separatedTimeValues, hours, minutes, seconds;

				if (ctrl.$isEmpty(value)) {
					return value;
				}

				cleanValue = value.replace(/[^0-9]/g, '').slice(0, unformattedValueLength) || '';
				separatedTimeValues = cleanValue.match(/.{1,2}/g);

				hours = parseInt(separatedTimeValues[0]);
				minutes = parseInt(separatedTimeValues[1]);
				seconds = parseInt(separatedTimeValues[2] || 0);

				if (hours > 24) {
					hours = 24;
				}

				if (minutes > 60) {
					minutes = 60;
				}

				if (seconds > 60) {
					seconds = 60;
				}

				correctedValue = '' + hours + minutes + seconds;

				return (timeMask.apply(correctedValue) || '').replace(/[^0-9]$/, '');
			}

			ctrl.$formatters.push(formatter);

			ctrl.$parsers.push(function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var viewValue = formatter(value);
				var modelValue = viewValue;

				console.info('Wowowowowow');
				console.debug(modelValue, viewValue, formatter(value), value);

				if (ctrl.$viewValue !== viewValue) {
					ctrl.$setViewValue(viewValue);
					ctrl.$render();
				}

				return modelValue;
			});

			ctrl.$validators.time = function(modelValue) {
				if (ctrl.$isEmpty(modelValue)) {
					return true;
				}

				var splittedValue = modelValue.toString().split(/:/).filter(function(v) {
					return !!v;
				});

				var hours = parseInt(splittedValue[0]),
					minutes = parseInt(splittedValue[1]),
					seconds = parseInt(splittedValue[2] || 0);

				return modelValue.toString().length === formattedValueLength &&
					hours < 24 && minutes < 60 && seconds < 60;
			};
		}
	};
};

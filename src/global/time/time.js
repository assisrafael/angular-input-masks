'use strict';

var StringMask = require('string-mask');

module.exports = function TimeMaskDirective() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			var timeFormat = null;

			if (angular.isDefined(attrs.uiTimeMask) && (attrs.uiTimeMask === 'short' || attrs.uiTimeMask === 'long')) {
				timeFormat = attrs.uiTimeMask;
			}

			var timeFormatVars = {
				short: {
					formattedValueLength: '00:00'.length,
					unformattedValueLength: '00:00'.replace(':', '').length,
					timeMask: new StringMask('00:00')
				},
				long: {
					formattedValueLength: '00:00:00'.length,
					unformattedValueLength: '00:00:00'.replace(':', '').length,
					timeMask: new StringMask('00:00:00')
				}
			};

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}
				var cleanValue = value.replace(/[^0-9]/g, '')
					.slice(0, unformattedValueLength(value.replace(/[^0-9]/g, ''))) || '';
				return (timeMask(value.replace(/[^0-9]/g, '')).apply(cleanValue) || '')
					.replace(/[^0-9]$/, '');
			}

			function getTimeFormat(s, cleanValue) {
				if (timeFormat) {
					return timeFormat;
				} else {
					if (cleanValue) {
						if (s.length <= 4) {
							return 'short';
						} else {
							return 'long';
						}
					} else {
						if (s && s.split(':').length >= 3) {
							return 'long';
						} else {
							return 'short';
						}
					}
				}
			}

			function formattedValueLength(s) {
				return timeFormatVars[getTimeFormat(s, false)].formattedValueLength;
			}

			function unformattedValueLength(s) {
				return timeFormatVars[getTimeFormat(s, true)].unformattedValueLength;
			}

			function timeMask(s) {
				return timeFormatVars[getTimeFormat(s, true)].timeMask;
			}

			ctrl.$formatters.push(formatter);

			ctrl.$parsers.push(function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var viewValue = formatter(value);
				var modelValue = viewValue;

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

				return modelValue.toString().length ===
					formattedValueLength(modelValue.toString()) &&
					hours < 24 && minutes < 60 && seconds < 60;
			};
		}
	};
};

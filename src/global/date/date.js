'use strict';

var formatDate = require('date-fns/format');
var parseDate = require('date-fns/parse');
var isValidDate = require('date-fns/isValid');
var StringMask = require('string-mask');

function isISODateString(date) {
	return /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}([-+][0-9]{2}:[0-9]{2}|Z)$/
		.test(date.toString());
}

var dateFormatMapByLocale = {
	'pt-br': 'DD/MM/YYYY',
	'es-ar': 'DD/MM/YYYY',
	'es-mx': 'DD/MM/YYYY',
	'es'   : 'DD/MM/YYYY',
	'en-us': 'MM/DD/YYYY',
	'en'   : 'MM/DD/YYYY',
	'fr-fr': 'DD/MM/YYYY',
	'fr'   : 'DD/MM/YYYY',
	'ru'   : 'DD.MM.YYYY'
};

function DateMaskDirective($locale) {
	var dateFormat = dateFormatMapByLocale[$locale.id] || 'YYYY-MM-DD';

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			attrs.parse = attrs.parse || 'true';

			dateFormat = attrs.uiDateMask || dateFormat;

			var dateMask = new StringMask(dateFormat.replace(/[YMD]/g,'0'));

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return null;
				}

				var cleanValue = value;
				if (typeof value === 'object' || isISODateString(value)) {
					cleanValue = formatDate(value, dateFormat);
				}

				cleanValue = cleanValue.replace(/[^0-9]/g, '');
				var formatedValue = dateMask.apply(cleanValue) || '';

				return formatedValue.trim().replace(/[^0-9]$/, '');
			}

			ctrl.$formatters.push(formatter);

			ctrl.$parsers.push(function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var formatedValue = formatter(value);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				return attrs.parse === 'false'
					? formatedValue
					: parseDate(formatedValue, dateFormat, new Date());
			});

			ctrl.$validators.date =	function validator(modelValue, viewValue) {
				if (ctrl.$isEmpty(modelValue)) {
					return true;
				}

				return isValidDate(parseDate(viewValue, dateFormat, new Date())) && viewValue.length === dateFormat.length;
			};
		}
	};
}
DateMaskDirective.$inject = ['$locale'];

module.exports = DateMaskDirective;

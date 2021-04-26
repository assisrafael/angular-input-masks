'use strict';

var StringMask = require('string-mask');
var BrV = require('br-validations');

var brPhoneMask8D = {
	countryCode : new StringMask('+00 (00) 0000-0000'),   //with country code
	areaCode    : new StringMask('(00) 0000-0000'),       //with area code
	simple      : new StringMask('0000-0000')             //without area code
}, brPhoneMask9D = {
	countryCode : new StringMask('+00 (00) 00000-0000'), //with country code
	areaCode    : new StringMask('(00) 00000-0000'),     //with area code
	simple      : new StringMask('00000-0000')           //without area code
}, brPhoneMask0800 = {
	countryCode : null,                                   //N/A
	areaCode    : null,                                   //N/A
	simple      : new StringMask('0000-000-0000')         //N/A, so it's "simple"
}, brPhoneMaskOptions = {
	'countryCode': {sliceSize: 13, min: 12, max: 13},
	'areaCode': {sliceSize: 11, min: 10, max: 11},
	'simple': {sliceSize: 9, min: 8, max: 9},
	'all': {sliceSize: 13, min: 8, max: 13}
};

function BrIeMaskDirective($parse) {
	function clearValue(value) {
		if (!value) {
			return value;
		}

		return value.replace(/[^0-9]/g, '');
	}

	function getMask(uf, value) {
		if (!uf || !ieMasks[uf]) {
			return;
		}

		if (uf === 'SP' && /^P/i.test(value)) {
			return ieMasks.SP[1].mask;
		}

		var masks = ieMasks[uf];
		var i = 0;
		while (masks[i].chars && masks[i].chars < clearValue(value).length && i < masks.length - 1) {
			i++;
		}

		return masks[i].mask;
	}

	function applyIEMask(value, uf) {
		var mask = getMask(uf, value);

		if (!mask) {
			return value;
		}

		var processed = mask.process(clearValue(value));
		var formatedValue = processed.result || '';
		formatedValue = formatedValue.trim().replace(/[^0-9]$/, '');

		if (uf === 'SP' && /^p/i.test(value)) {
			return 'P' + formatedValue;
		}

		return formatedValue;
	}

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {
			var state = ($parse(attrs.uiBrIeMask)(scope) || '').toUpperCase();

			function formatter(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				return applyIEMask(value, state);
			}

			function parser(value) {
				if (ctrl.$isEmpty(value)) {
					return value;
				}

				var formatedValue = applyIEMask(value, state);
				var actualValue = clearValue(formatedValue);

				if (ctrl.$viewValue !== formatedValue) {
					ctrl.$setViewValue(formatedValue);
					ctrl.$render();
				}

				if (state && state.toUpperCase() === 'SP' && /^p/i.test(value)) {
					return 'P' + actualValue;
				}

				return actualValue;
			}

			ctrl.$formatters.push(formatter);
			ctrl.$parsers.push(parser);

			ctrl.$validators.ie = function validator(modelValue) {
				return ctrl.$isEmpty(modelValue) || BrV.ie(state).validate(modelValue);
			};

			scope.$watch(attrs.uiBrIeMask, function(newState) {
				state = (newState || '').toUpperCase();

				parser(ctrl.$viewValue);
				ctrl.$validate();
			});
		}
	};
}

BrIeMaskDirective.$inject = ['$parse'];

module.exports = BrIeMaskDirective;

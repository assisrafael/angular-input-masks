'use strict';

module.exports = function maskFactory(maskDefinition) {
	return function MaskDirective() {
		var isBackspace = false;
		var caretCtrl = {
			get: function getCaretPosition(element) {
				var caretPosition = 0;
				if (document.selection) {
					element.focus();
					var range = document.selection.createRange();
					range.moveStart('character', -element.value.length);
					caretPosition = range.text.length;
				} else if (element.selectionStart || element.selectionStart === '0') {
					caretPosition = element.selectionStart;
				}
				return caretPosition;
			},
			set: function setCaretPosition(element, position) {
				if (/[^\w]/gi.test(element.value.charAt(position - 1))
					&& element.value.charAt(position + 1) === null && !isBackspace) {
					position += /\s/.test(element.value.charAt(position)) ? 3 : 2;
				} else if (/[^\w]/gi.test(element.value.charAt(position - 1))
					&& element.value.charAt(position + 1) !== null && !isBackspace) {
					position += /\s/.test(element.value.charAt(position)) ? 2 : 1;
				}
				
				if(element.setSelectionRange) {
					element.focus();
					setTimeout(function () {
						element.setSelectionRange(position, position);
					}, 0);
				} else if (element.createTextRange) {
					var range = element.createTextRange();
					range.collapse(true);
					range.moveEnd('character', position);
					range.moveStart('character', position);
					range.select();
				}
			}
		}
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {

				element.on('keydown', function (event) {
					isBackspace = event.keyCode === '8' || event.keyCode === '46';
				});
				
				ctrl.$formatters.push(function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var cleanValue = maskDefinition.clearValue(value.toString(), attrs);
					return maskDefinition.format(cleanValue);
				});

				ctrl.$parsers.push(function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var cleanValue = maskDefinition.clearValue(value.toString(), attrs);
					var formattedValue = maskDefinition.format(cleanValue);

					var currentCaretPosition = caretCtrl.get(element[0]);

					if (ctrl.$viewValue !== formattedValue) {
						ctrl.$setViewValue(formattedValue);
						ctrl.$render();
					}

					caretCtrl.set(element[0], currentCaretPosition);

					if (angular.isUndefined(maskDefinition.getModelValue)) {
						return cleanValue;
					}

					var actualModelType = typeof ctrl.$modelValue;
					return maskDefinition.getModelValue(formattedValue, actualModelType);
				});

				angular.forEach(maskDefinition.validations, function(validatorFn, validationErrorKey) {
					ctrl.$validators[validationErrorKey] = function validator(modelValue, viewValue) {
						return ctrl.$isEmpty(modelValue) || validatorFn(modelValue, viewValue, attrs);
					};
				});
			}
		};
	};
};

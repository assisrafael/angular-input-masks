'use strict';

module.exports = function maskFactory(maskDefinition) {
	return function MaskDirective() {
		
		var caret = {
			set : function caretSet(element, currentPos, pos) {				

				if (element[0].setSelectionRange) {
					element[0].focus();
					window.setTimeout(function() {
						if(currentPos!==element[0].selectionStart){
							currentPos=element[0].selectionStart;
						}
						pos=currentPos+pos;
						element[0].setSelectionRange(pos, pos);
					}, 0);
					

				} else if (element[0].createTextRange) {
					pos=currentPos+pos;
					var range = element[0].createTextRange();
					range.collapse(true);
					range.moveEnd('character', pos);
					range.moveStart('character', pos);
					range.select();
				}
			},
			get : function caretGet(element) {
				var iCaretPos = 0;
				if (document.selection) {
					element[0].focus();
					var oSel = document.selection.createRange();
					oSel.moveStart('character', -element[0].value.length);
					iCaretPos = oSel.text.length;
				} else if (
					element[0].selectionStart || element[0].selectionStart === '0'
				) {
					iCaretPos = element[0].selectionStart;
				}
				return iCaretPos;
			}
		};

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl) {
				ctrl.$formatters.push(function formatter(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}

					var cleanValue = maskDefinition.clearValue(value);
					return maskDefinition.format(cleanValue);
				});

				ctrl.$parsers.push(function parser(value) {
					if (ctrl.$isEmpty(value)) {
						return value;
					}


						var cleanValue = maskDefinition.clearValue(value);
						var formattedValue = maskDefinition.format(cleanValue);

						var currentCaretPosition = caret.get(element),
							lengthBefore = ctrl.$viewValue.length,
							lengthAfter = 0;

						if (ctrl.$viewValue !== formattedValue) {
							ctrl.$setViewValue(formattedValue);
							ctrl.$render();

							lengthAfter = ctrl.$viewValue.length;
						}

						var caretFormatDiffer = (lengthAfter - lengthBefore) < 0
												? 0
												: lengthAfter - lengthBefore;

						caret.set(element, currentCaretPosition, caretFormatDiffer);

						if (angular.isUndefined(maskDefinition.getModelValue)) {
							return cleanValue;
						}

						var actualModelType = typeof ctrl.$modelValue;
						return maskDefinition.getModelValue(formattedValue, actualModelType);
				

					
				});

				angular.forEach(maskDefinition.validations, function(validatorFn, validationErrorKey) {
					ctrl.$validators[validationErrorKey] = function validator(modelValue, viewValue) {
						return ctrl.$isEmpty(modelValue) || validatorFn(modelValue, viewValue);
					};
				});
			}
		};
	};
};
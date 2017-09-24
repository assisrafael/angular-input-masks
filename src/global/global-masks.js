'use strict';

var m = angular.module('ui.utils.masks.global', [])
	.directive('uiCreditCardMask', require('./credit-card/credit-card'))
	.directive('uiDateMask', require('./date/date'))
	.directive('uiMoneyMask', require('./money/money'))
	.directive('uiNumberMask', require('./number/number'))
	.directive('uiPercentageMask', require('./percentage/percentage'))
	.directive('uiScientificNotationMask', require('./scientific-notation/scientific-notation'))
	.directive('uiTimeMask', require('./time/time'));

module.exports = m.name;

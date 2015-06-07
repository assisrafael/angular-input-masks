var m = angular.module('ui.utils.masks.global', [
	require('../helpers'),
])
.directive('uiDateMask', require('./date/date'))
.directive('uiMoneyMask', require('./money/money'))
.directive('uiNumberMask', require('./number/number'))
.directive('uiPercentageMask', require('./percentage/percentage'))
.directive('uiScientificNotationMask', require('./scientific-notation/scientific-notation'))
.directive('uiTimeMask', require('./time/time'));

module.exports = m.name;

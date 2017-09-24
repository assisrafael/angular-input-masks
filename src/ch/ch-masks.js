'use strict';

var m = angular.module('ui.utils.masks.ch', [])
	.directive('uiChPhoneNumberMask', require('./phone/ch-phone'));

module.exports = m.name;

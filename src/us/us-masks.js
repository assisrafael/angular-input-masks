'use strict';

var m = angular.module('ui.utils.masks.us', [])
	.directive('uiUsPhoneNumberMask', require('./phone/us-phone'));

module.exports = m.name;

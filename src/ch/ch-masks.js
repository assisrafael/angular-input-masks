'use strict';

var m = angular.module('ui.utils.masks.ch', [])
	.directive('uiChPhoneNumber', require('./phone/ch-phone'));

module.exports = m.name;

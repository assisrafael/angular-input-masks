'use strict';

var m = angular.module('ui.utils.masks.us', [])
	.directive('uiUsPhoneNumber', require('./phone/us-phone'));

module.exports = m.name;

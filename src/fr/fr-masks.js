'use strict';

var m = angular.module('ui.utils.masks.fr', [])
	.directive('uiFrPhoneNumberMask', require('./phone/fr-phone'));

module.exports = m.name;

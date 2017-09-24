'use strict';

var m = angular.module('ui.utils.masks.fr', [])
	.directive('uiFrPhoneNumber', require('./phone/fr-phone'));

module.exports = m.name;

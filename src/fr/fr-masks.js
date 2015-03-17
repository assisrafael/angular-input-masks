'use strict';

var m = angular.module('ui.utils.masks.fr', [
	require('../helpers')
])
	.directive('uiFrPhoneNumber', require('./phone/fr-phone'));

module.exports = m.name;

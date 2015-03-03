'use strict';

var availableDependencies = [
	'ui.utils.masks.global',
	'ui.utils.masks.br',
	'ui.utils.masks.us'
].filter(function(dependency) {
	try {
		angular.module(dependency);
		return true;
	} catch (e) {
		return false;
	}
});

angular.module('ui.utils.masks', availableDependencies)
.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

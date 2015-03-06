'use strict';

angular.module('ui.utils.masks', [
	'ui.utils.masks.br'
])
.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

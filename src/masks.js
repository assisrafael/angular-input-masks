'use strict';

angular.module('ui.utils.masks', [
	'ui.utils.masks.helpers',
	'ui.utils.masks.number',
	'ui.utils.masks.percentage',
	'ui.utils.masks.money',
	'ui.utils.masks.phone',
	'ui.utils.masks.cep',
	'ui.utils.masks.ie',
	'ui.utils.masks.cpfCnpj',
	'ui.utils.masks.date',
	'ui.utils.masks.time'
])
.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(false);
}]);

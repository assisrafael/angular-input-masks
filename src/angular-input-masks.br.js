/**
 * angular-input-masks
 * Personalized input masks for AngularJS
 * @version __VERSION__
 * @link http://github.com/assisrafael/angular-input-masks
 * @license MIT
 */

module.exports = angular.module('ui.utils.masks', [
	require('./global/global-masks'),
	require('./br/br-masks')
]).name;

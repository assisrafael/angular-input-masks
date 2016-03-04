'use strict';

describe('angular-input-masks-standalone', function() {
	var moduleName = require('./index.js');

	beforeEach(angular.mock.module('ui.utils.masks'));

	it('should export the module name', function() {
		expect(moduleName).toBe('ui.utils.masks');
	});
});

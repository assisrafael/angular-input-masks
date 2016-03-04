'use strict';

/*eslint no-process-env: 0*/

var config = {
	specs: [
		'../src/**/*.spec.js'
	],
	directConnect: true,
	framework: 'jasmine',
	multiCapabilities: [{
		browserName: 'chrome'
	}],
	baseUrl: 'http://localhost:8000/demo',
	beforeLaunch: function() {
		var exec = require('child_process').exec;

		exec('gulp serve');
	}
};

if (process.env.TRAVIS) {
	config.allScriptsTimeout = 110000;
	config.jasmineNodeOpts = {
		defaultTimeoutInterval: 100000
	};
	config.multiCapabilities = [{
		browserName: 'firefox'
	}];
}

exports.config = config;

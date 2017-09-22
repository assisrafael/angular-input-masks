'use strict';

/*eslint no-process-env: 0*/

const {SpecReporter} = require('jasmine-spec-reporter');

var config = {
	allScriptsTimeout: 11000,
	directConnect: true,
	capabilities: {
		browserName: 'chrome'
	},
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print() {}
	},
	specs: [
		'../src/**/*.spec.js'
	],
	baseUrl: 'http://localhost:9090/demo',
	beforeLaunch() {
		var exec = require('child_process').exec;

		exec('gulp serve');
		return new Promise((resolve) => {
			setTimeout(resolve, 5000);
		});
	},
	onPrepare() {
		jasmine.getEnv().addReporter(new SpecReporter({
			spec: {
				displayStacktrace: true
			}
		}));
	}
};

if (process.env.CI) {
	config.capabilities.chromeOptions = {
		args: ['--headless', '--disable-gpu', '--window-size=800x600']
	};
}

exports.config = config;

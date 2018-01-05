'use strict';

/*eslint no-process-env: 0*/
/*eslint no-console: 0*/
/*eslint no-empty-function: 0*/

const {SpecReporter} = require('jasmine-spec-reporter');

const PORT = process.env.PORT || 9090;

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
	baseUrl: `http://localhost:${PORT}/demo`,
	beforeLaunch() {
		var server = require('../server');

		return new Promise((resolve) => {
			server.listen(PORT, function() {
				console.log(`Server running in port ${PORT}`);
				resolve();
			});
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

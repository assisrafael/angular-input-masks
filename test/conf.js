exports.config = {
	allScriptsTimeout: 11000,
	jasmineNodeOpts: {
		defaultTimeoutInterval: 100000
	},
	multiCapabilities: [/*{
		'browserName': 'firefox'
	}, */{
		'browserName': 'chrome'
	}],
	specs: ['spec.js'],
	baseUrl: 'http://localhost:8000/demo'
}

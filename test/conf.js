exports.config = {
	seleniumServerJar: './../node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',
	multiCapabilities: [/*{
		'browserName': 'firefox'
	}, */{
		'browserName': 'chrome'
	}],
	specs: ['spec.js'],
	baseUrl: 'http://localhost:8000/demo'
}

exports.config = {
	multiCapabilities: [/*{
		'browserName': 'firefox'
	}, */{
		'browserName': 'chrome'
	}],
	specs: ['spec.js'],
	baseUrl: 'http://localhost:8000/demo'
}

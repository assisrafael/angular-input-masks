var config = {
	directConnect: true,
	multiCapabilities: [{
		'browserName': 'chrome'
	}],
	baseUrl: 'http://localhost:8000/demo'
};

if(process.env.TRAVIS){
	config.allScriptsTimeout = 110000;
	config.jasmineNodeOpts = {
		defaultTimeoutInterval: 100000
	};
	config.multiCapabilities = [{'browserName':'firefox'}];
}

exports.config = config;

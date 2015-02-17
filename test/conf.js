var config = {
	directConnect: true,
	multiCapabilities: [{
		'browserName': 'chrome'
	}],
	specs: [
		'cep-spec.js',
		'cpf-cnpj-spec.js',
		'date-spec.js',
		'ie-spec.js',
		'money-spec.js',
		'nfe-spec.js',
		'number-spec.js',
		'percentage-spec.js',
		'phone-spec.js',
		'scientific-notation-spec.js',
		'time-spec.js'
	],
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

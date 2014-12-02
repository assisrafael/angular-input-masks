exports.config = {
	multiCapabilities: [/*{
		'browserName': 'firefox'
	}, */{
		'browserName': 'chrome'
	}],
	specs: [
		'cep-spec.js',
		'cpf-cnpj-spec.js',
		'date-spec.js',
		'ie-spec.js',
		'money-spec.js',
		'number-spec.js',
		'percentage-spec.js',
		'phone-spec.js'
	],
	baseUrl: 'http://localhost:8000/demo'
}

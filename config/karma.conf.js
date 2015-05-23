module.exports = function(config) {
	var configuration = {
		basePath: __dirname + '/..',
		frameworks: ['browserify', 'jasmine'],
		files: [
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'bower_components/br-validations/releases/br-validations.js',
			'config/test-utils.js',
			{ //ignore e2e specs
				pattern: 'src/**/*.spec.js',
				included: false,
				served: false,
				watched: false
			},
			'src/**/*.js',
		],
		port: 9876,
		reporters: ['progress', 'coverage'],
		preprocessors: {
			'src/**/*.js': [ 'browserify' ],
			'src/**/!(*test).js': ['coverage']
		},
		browserify: {
			debug: true
		},
		coverageReporter: {
			dir: 'coverage',
			reporters: [{
				type: 'lcov',
				subdir: 'report-lcov'
			}, {
				type: 'html',
				subdir: 'report-html'
			}]
		},
		colors: true,
		autoWatch: false,
		singleRun: false,
		browsers: ['Chrome'],
		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
	};

	if(process.env.TRAVIS){
		configuration.browsers = ['Chrome_travis_ci'];

		configuration.reporters.push('coveralls');
	}

	config.set(configuration);
};

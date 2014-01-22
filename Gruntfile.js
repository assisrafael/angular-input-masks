module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			jshint: {
				files: ['src/**/*.js'],
				tasks: ['jshint', 'karma']
			}
		},
		jshint: {
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish'),
				ignores: ['node_modules']
			},
			all: ['src/**/*.js']
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		}
	});

	require('jit-grunt')(grunt);

	grunt.registerTask('default', 'Log some stuff.', function() {
		grunt.log.write('Logging some stuff...').ok();
	});

	grunt.registerTask('test', function (target) {
		if (target === 'single') {
			grunt.task.run([
				'jshint',
				'karma'
			]);
		}

		grunt.task.run([
			'watch'
		]);
	});
};
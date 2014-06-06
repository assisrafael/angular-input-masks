module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			jshint: {
				files: ['src/**/*.js'],
				tasks: ['jshint']
			}
		},
		build: {
			src: 'node_modules/'	
		},
		jshint: {
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish'),
				ignores: ['node_modules']
			},
			all: ['src/**/*.js']
		}
	});

	require('jit-grunt')(grunt);

	grunt.registerTask('lib', function() {
		grunt.file.copy('bower_components/string-mask/src/string-mask.js', 'lib/string-mask.js');
	});

	grunt.registerTask('default', ['lib', 'jshint']);

	grunt.registerTask('test', function (target) {
		if (target === 'single') {
			grunt.task.run([
				'lib',
				'jshint'
			]);
			
			return;
		}

		grunt.task.run([
			'lib',
			'watch'
		]);
	});
};
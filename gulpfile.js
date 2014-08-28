var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var path = {
	src: {
		files: ['src/**/*.js']
	},
	lib: {
		files: [
			'bower_components/string-mask/src/string-mask.js',
			'bower_components/br-validations/releases/br-validations.js'
		]
	}
}

gulp.task('jshint', function() {
	gulp.src(path.src.files)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter));
});

gulp.task('build', function() {
	var pkg = require('./package.json');

	var header = ['/**',
		' * <%= pkg.name %>',
		' * <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		''].join('\n');

	var stream1 = gulp.src(path.lib.files);

	var stream2 = gulp.src(path.src.files)
	.pipe(plugins.header(header, {pkg: pkg}));

	require('event-stream')
	.merge(stream1, stream2)
	.pipe(plugins.concat('masks.js'))
	.pipe(gulp.dest('./releases'))
	.pipe(plugins.uglify())
	.pipe(plugins.concat('masks.min.js'))
	.pipe(gulp.dest('./releases'));
});

gulp.task('default', ['jshint', 'build'], function() {
	gulp.watch(path.src.files, ['jshint', 'build']);
});

gulp.task('webdriver_update', require('gulp-protractor').webdriver_update);
gulp.task('webdriver_standalone', ['webdriver_update'], require('gulp-protractor').webdriver_standalone);

gulp.task('serve', function() {
	var express = require('express');
	var server = express();

	server.use(express.static('./'));
	server.listen(8000, function() {
		console.log('Server running in port 8000');
	});
});

gulp.task('test', ['webdriver_update', 'serve'], function() {
	var protractor = require('gulp-protractor').protractor;

	gulp.src(['./test/spec.js'])
	.pipe(protractor({
		configFile: 'test/conf.js'
	}))
	.on('error', function(e) { throw e });
});

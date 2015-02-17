var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var path = {
	src: {
		files: ['src/**/*.js'],
		e2e: ['src/**/*.spec.js']
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
		'(function (angular) {',
		'',
		''].join('\n');

	var footer = [
		'',
		'})(angular);',
		''].join('\n');

	gulp.src(
		path.lib.files.concat(path.src.files)
	)
	.pipe(filterNonCodeFiles())
	.pipe(plugins.concat('masks.js'))
	.pipe(plugins.header(header, {pkg: pkg}))
	.pipe(plugins.footer(footer))
	.pipe(gulp.dest('./releases/'))
	.pipe(plugins.uglify())
	.pipe(plugins.concat('masks.min.js'))
	.pipe(gulp.dest('./releases/'));
});

gulp.task('default', ['jshint', 'build'], function() {
	gulp.watch(path.src.files, ['jshint', 'build']);
});

gulp.task('serve', ['build'], function() {
	var express = require('express');
	var server = express();

	server.use(express.static('./'));
	server.listen(8000, function() {
		console.log('Server running in port 8000');
	});
});

gulp.task('test', ['serve'], function() {
	var protractor = require('gulp-protractor').protractor;

	gulp.src(path.src.e2e)
	.pipe(protractor({
		configFile: 'config/protractor.conf.js'
	}))
	.pipe(plugins.exit());
});

function filterNonCodeFiles() {
	return plugins.filter(function(file) {
		return !/\.json|\.spec.js/.test(file.path);
	});
}

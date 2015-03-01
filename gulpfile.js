var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	karma = require('karma').server,
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var path = {
	src: {
		files: ['src/**/*.js'],
		jshint: ['src/**/*.js', '!src/**/*.spec.js'],
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
	gulp.src(path.src.jshint)
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

gulp.task('test:unit', function(done) {
	var karmaConfig = {
		singleRun: true,
		configFile: __dirname + '/config/karma.conf.js'
	};

	karma.start(karmaConfig, done);
});

gulp.task('test-watch', function(done) {
	var karmaConfig = {
		singleRun: false,
		autoWatch: true,
		configFile: __dirname + '/config/karma.conf.js'
	};

	karma.start(karmaConfig, done);
});

gulp.task('webdriver_update', require('gulp-protractor').webdriver_update);

gulp.task('test:e2e', ['webdriver_update', 'serve'], function() {
	var protractor = require('gulp-protractor').protractor;

	gulp.src(path.src.e2e)
	.pipe(protractor({
		configFile: 'config/protractor.conf.js'
	}))
	.pipe(plugins.exit());
});

gulp.task('test', ['test:unit', 'test:e2e']);

function filterNonCodeFiles() {
	return plugins.filter(function(file) {
		return !/\.json|\.spec.js|\.test.js/.test(file.path);
	});
}

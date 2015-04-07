var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	karma = require('karma').server,
	runSequence = require('run-sequence'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var pkg = require('./package.json'),
	header = ['/**',
		' * <%= pkg.name %>',
		' * <%= pkg.description %>',
		' * @version v<%= pkg.version %>',
		' * @link <%= pkg.homepage %>',
		' * @license <%= pkg.license %>',
		' */',
		'(function (angular) {',
		'',
		''
	].join('\n'),
	footer = [
		'',
		'})(angular);',
		''
	].join('\n');

var path = {
	src: {
		files: ['src/**/*.js'],
		jshint: ['src/**/*.js', '!src/**/*.spec.js'],
		e2e: ['src/**/*.spec.js']
	}
};

var commonBuild = {
	libs: [
		'bower_components/string-mask/src/string-mask.js',
	],
	files: [
		'src/global/**/*.js',
		'src/*.js'
	]
};

var builds = {
	br: [
		'bower_components/br-validations/releases/br-validations.js',
		'src/br/**/*.js'
	],
	us: [
		'src/us/**/*.js'
	],
};

function customBuild(files, buildName) {
	var buildFilename = 'angular-input-masks';

	if (buildName) {
		buildFilename += '.' + buildName;
	}

	var buildFiles = commonBuild.libs.concat(files).concat(commonBuild.files);

	return function() {
		return gulp.src(buildFiles)
			.pipe(filterNonCodeFiles())
			.pipe(plugins.concat(buildFilename + '.js'))
			.pipe(plugins.header(header, {pkg: pkg}))
			.pipe(plugins.footer(footer))
			.pipe(gulp.dest('./releases/'))
			.pipe(plugins.uglify())
			.pipe(plugins.concat(buildFilename + '.min.js'))
			.pipe(gulp.dest('./releases/'));
	};
}

var buildTasks = [];
var fullBuildFiles = [];
Object.keys(builds).forEach(function(buildName) {
	var taskName = 'build:' + buildName;
	var buildFiles = builds[buildName];
	gulp.task(taskName, customBuild(buildFiles, buildName));
	buildTasks.push(taskName);
	fullBuildFiles = fullBuildFiles.concat(buildFiles);
});

gulp.task('build', buildTasks, customBuild(fullBuildFiles));

gulp.task('jshint', function() {
	return gulp.src(path.src.jshint)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter))
	.pipe(plugins.jshint.reporter('fail'));
});

gulp.task('default', ['jshint', 'build'], function() {
	gulp.watch(path.src.files, ['jshint', 'build']);
});

gulp.task('serve', ['build'], function(done) {
	var express = require('express');
	var server = express();

	server.use(express.static('./'));
	server.listen(8000, function() {
		console.log('Server running in port 8000');
		done();
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

gulp.task('test', function(done) {
	runSequence('jshint', 'test:unit', 'test:e2e', done);
});

function filterNonCodeFiles() {
	return plugins.filter(function(file) {
		return !/\.json$|\.spec\.js$|\.test\.js$/.test(file.path);
	});
}

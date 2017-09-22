'use strict';

/*eslint no-console: 0*/
/*eslint no-process-env: 0*/

const path = require('path');

const gulp = require('gulp'),
	mergeStream = require('merge-stream'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	loadPlugins = require('gulp-load-plugins');

const plugins = loadPlugins({
	config: path.join(__dirname, 'package.json')
});

const pkg = require('./package.json');

const header = ['/**',
	' * <%= pkg.name %>',
	' * <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' */',
	''
].join('\n');

gulp.task('build-dependencies', function() {
	return browserify()
		.require('string-mask', {
			expose: 'string-mask'
		})
		.require('moment', {
			expose: 'moment'
		})
		.require('br-validations', {
			expose: 'br-validations'
		})
		.bundle()
		.pipe(source('angular-input-masks-dependencies.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./releases/'))
		.pipe(plugins.uglify())
		.pipe(plugins.rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('./releases/'));
});

gulp.task('build', ['build-dependencies'], function() {
	var files = [{
		fileName: 'angular-input-masks.js',
		debug: false,
		bundleExternal: false
	}, {
		fileName: 'angular-input-masks.br.js',
		debug: false,
		bundleExternal: false
	}, {
		fileName: 'angular-input-masks.ch.js',
		debug: false,
		bundleExternal: false
	}, {
		fileName: 'angular-input-masks.fr.js',
		debug: false,
		bundleExternal: false
	}, {
		fileName: 'angular-input-masks.us.js',
		debug: false,
		bundleExternal: false
	}, {
		fileName: 'angular-input-masks.js',
		outputFileName: 'angular-input-masks-standalone.js',
		debug: false,
		bundleExternal: true
	}, {
		fileName: 'angular-input-masks.js',
		outputFileName: 'angular-input-masks-debug.js',
		debug: true,
		bundleExternal: true
	}];

	var tasks = files.map(function(entry) {
		return browserify({
			entries: entry.fileName,
			detectGlobals: false,
			basedir: './src/',
			debug: entry.debug,
			bundleExternal: entry.bundleExternal,
		})
			.bundle()
			.pipe(source(entry.outputFileName || entry.fileName))
			.pipe(buffer())
			.pipe(plugins.header(header, {pkg: pkg}))
			.pipe(gulp.dest('./releases/'))
			.pipe(plugins.uglify())
			.pipe(plugins.rename({
				extname: '.min.js'
			}))
			.pipe(gulp.dest('./releases/'));
	});

	return mergeStream(tasks);
});

gulp.task('default', ['build'], function() {
	gulp.watch('src/**/*.js', ['build']);
});

gulp.task('serve', ['build'], function(done) {
	var server = require('./server');

	const PORT = process.env.PORT || 9090;
	server.listen(PORT, function() {
		console.log(`Server running in port ${PORT}`);
		done();
	});
});

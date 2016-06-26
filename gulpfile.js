'use strict';

/*eslint no-console: 0*/

var path = require('path');

var gulp = require('gulp'),
	mergeStream = require('merge-stream'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	loadPlugins = require('gulp-load-plugins');

var plugins = loadPlugins({
	config: path.join(__dirname, 'package.json')
});

var pkg = require('./package.json');

var header = ['/**',
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
		fileName: 'angular-input-masks.us.js',
		debug: false,
		bundleExternal: false
	}, {
		fileName: 'angular-input-masks.ch.js',
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
		.require('mask-factory', {
			expose: 'mask-factory'
		})
		.require('validators', {
			expose: 'validators'
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

var VERSION;

gulp.task('getVersion', function() {
	var argv = require('minimist')(process.argv.slice(2));

	VERSION = argv.version || pkg.version;
});

var bowerConfig = {
	repository: 'git@github.com:assisrafael/bower-angular-input-masks.git',
	path: './bower-angular-input-masks'
};

gulp.task('default', ['build'], function() {
	gulp.watch('src/**/*.js', ['build']);
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

function bumpVersion(folder) {
	return gulp.src([
		'bower.json',
		'package.json'
	], {
		cwd: folder
	})
	.pipe(plugins.bump({
		version: VERSION
	}))
	.pipe(gulp.dest(folder));
}

gulp.task('bower-clone', ['build'], function(done) {
	plugins.git.clone(bowerConfig.repository, {
		args: '--depth=2'
	}, function(err) {
		if (err) {
			throw err;
		}

		done();
	});
});

gulp.task('bower-commit', ['getVersion', 'bower-clone'], function() {
	return mergeStream(
			bumpVersion(bowerConfig.path),
			gulp.src('./releases/**/*.*')
				.pipe(gulp.dest(bowerConfig.path))
		)
		.pipe(plugins.git.add({
			cwd: bowerConfig.path
		}))
		.pipe(plugins.git.commit('release: version ' + VERSION, {
			cwd: bowerConfig.path
		}));
});

gulp.task('bower-tag', ['getVersion', 'bower-commit'], function(done) {
	plugins.git.tag(VERSION, 'v' + VERSION, {
		cwd: bowerConfig.path
	}, function(err) {
		if (err) {
			throw err;
		}

		done();
	});
});

gulp.task('bower-push', ['bower-tag'], function(done) {
	plugins.git.push('origin', 'master', {
		args: ' --follow-tags',
		cwd: bowerConfig.path
	}, function(err) {
		if (err) {
			throw err;
		}

		done();
	});
});

gulp.task('bower-release', ['bower-push']);

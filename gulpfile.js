var fs = require('fs'),
	path = require('path');

var gulp = require('gulp'),
	mergeStream = require('merge-stream'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	plugins = require('gulp-load-plugins')({
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
            fileName: 'angular-input-masks.fr.js',
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

var filePaths = {
	src: {
		files: ['src/**/*.js'],
		jshint: ['src/**/*.js', '!src/**/*.spec.js'],
		e2e: ['src/**/*.spec.js']
	}
};

gulp.task('jshint', function() {
	return gulp.src(filePaths.src.jshint)
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter(require('jshint-stylish')))
		.pipe(plugins.jshint.reporter('fail'));
});

gulp.task('default', ['jshint', 'build'], function() {
	gulp.watch(filePaths.src.files, ['jshint', 'build']);
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
	var karma = require('karma').server;

	var karmaConfig = {
		singleRun: true,
		configFile: __dirname + '/config/karma.conf.js'
	};

	karma.start(karmaConfig, done);
});

gulp.task('test-watch', function(done) {
	var karma = require('karma').server;

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

	gulp.src(filePaths.src.e2e)
	.pipe(protractor({
		configFile: 'config/protractor.conf.js'
	}))
	.pipe(plugins.exit());
});

gulp.task('test', function(done) {
	require('run-sequence')('jshint', 'test:unit', 'test:e2e', done);
});

gulp.task('changelog', ['getVersion'], function() {
	var changelog = require('conventional-changelog');

	var options = {
		repository: pkg.homepage,
		version: VERSION,
		file: 'CHANGELOG.md'
	};

	var filePath = path.join(__dirname, options.file);
	changelog(options, function(err, log) {
		if (err) {
			throw err;
		}

		fs.writeFileSync(filePath, log);
	});
});

function bumpVersion (folder) {
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

gulp.task('version-bump', ['getVersion'], function() {
	return bumpVersion('./');
});

gulp.task('release', ['version-bump', 'changelog']);

gulp.task('bower-clone', ['build'], function(done) {
	plugins.git.clone(bowerConfig.repository, {
		args: '--depth=2'
	}, function (err) {
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
		.pipe(plugins.git.add({cwd:bowerConfig.path}))
		.pipe(plugins.git.commit('release: version ' + VERSION, {
			cwd:bowerConfig.path
		}));
});

gulp.task('bower-tag', ['getVersion', 'bower-commit'], function(done) {
	plugins.git.tag(VERSION, 'v' + VERSION, {
		cwd: bowerConfig.path
	}, function (err) {
		if (err) {
			throw err;
		}

		done();
	});
});

gulp.task('bower-push', ['bower-tag'], function(done) {
	plugins.git.push('origin', 'master', {
		args:' --follow-tags',
		cwd: bowerConfig.path
	}, function (err) {
		if (err) {
			throw err;
		}

		done();
	});
});

gulp.task('bower-release', ['bower-push']);

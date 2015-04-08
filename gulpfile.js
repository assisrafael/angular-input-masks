var fs = require('fs'),
	path = require('path');

var gulp = require('gulp'),
	jshintReporter = require('jshint-stylish'),
	karma = require('karma').server,
	runSequence = require('run-sequence'),
	pkg = require('./package.json'),
	argv = require('minimist')(process.argv.slice(2)),
	mergeStream = require('merge-stream'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var VERSION = argv.version || pkg.version;

var header = ['/**',
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
	].join('\n'),
	bowerConfig = {
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
	return gulp.src(filePaths.src.jshint)
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter))
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

	gulp.src(filePaths.src.e2e)
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

gulp.task('changelog', function() {
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

gulp.task('version-bump', function() {
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

gulp.task('bower-commit', ['bower-clone'], function() {
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

gulp.task('bower-tag', ['bower-commit'], function(done) {
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

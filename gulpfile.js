var gulp = require('gulp'),
jshint = require('gulp-jshint'),
jshintReporter = require('jshint-stylish'),
changed = require('gulp-changed');

var path = {
	src: {
		files: 'src/**/*.js'
	}
}

gulp.task('jshint', function() {
	gulp.src(path.src.files)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});

gulp.task('lib', function() {
	gulp.src(['string-mask/src/string-mask.js', 'br-validations/releases/br-validations.min.js'], {
		cwd: 'bower_components/'
	})
	.pipe(changed('lib'))
	.pipe(gulp.dest('lib'));
});

gulp.task('default', ['jshint', 'lib'], function() {
	gulp.watch(path.src.files, ['jshint']);
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

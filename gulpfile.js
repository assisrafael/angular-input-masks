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
	gulp.src(['string-mask/src/string-mask.js'], {
		cwd: 'bower_components/'
	})
	.pipe(changed("lib"))
	.pipe(gulp.dest("lib"));
});

gulp.task('default', ['jshint', 'lib'], function() {
    gulp.watch(path.src.files, ['jshint']);
});

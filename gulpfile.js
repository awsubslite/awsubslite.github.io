var gulp = require('gulp');
var pump = require('pump');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglifyjs = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-string-replace');

/* Gulp Path */
var paths = {
	css: ['css/*.css', '!css/*.min.css', '!css/*.map'],
	js: ['./app.js']
};

/* Gulp Tasks */

gulp.task('css', function() {
 	return gulp.src(paths.css)
		.pipe(sourcemaps.init())
		.pipe(prefix({
		    browsers: ["> 0%"]
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("dist/css"));
});
gulp.task('js', function(cb) {
	pump([
	 	gulp.src(paths.js),
	 	gulp.dest("dist/js"),
		uglifyjs(),
		rename({suffix: '.min'}),
		gulp.dest("dist/js")
	], cb);
});

/* Gulp Controller */
gulp.task('release', function() {
	gulp.start('js', 'css');
});

var gulp = require('gulp');
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var webpack = require("webpack");

var webpackConfig = require("./webpack.config.js");


gulp.task("default", ["webpack", 'uglify-primus', 'copy-img']);


gulp.task('webpack', function (callback) {

	var config = Object.create(webpackConfig);
	//Alter the config
	config.devtool = 'source-map';
	config.plugins.push(new webpack.optimize.UglifyJsPlugin());

    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('uglify-primus', function () {
	//TODO
	return gulp.src('primus.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-img', function () {
	gulp.src(['img/**/*']).pipe(gulp.dest('dist/img'));
})
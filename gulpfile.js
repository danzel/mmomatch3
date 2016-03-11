var fs = require('fs');
var gulp = require('gulp');
var GulpSSH = require('gulp-ssh');
var gutil = require("gulp-util");
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var webpack = require("webpack");
var zip = require("gulp-zip");

var webpackConfig = require("./webpack.config.js");
var gulpSSH = new GulpSSH({
	ignoreErrors: false,
	sshConfig: {
		host: 'mmomatch.australiaeast.cloudapp.azure.com',
		port: 22,
		username: 'azureuser',
		privateKey: fs.readFileSync('./z_id_rsa')
	}
})
var gulpSSHusw = new GulpSSH({
	ignoreErrors: false,
	sshConfig: {
		host: 'mmomatch.westus.cloudapp.azure.com',
		port: 22,
		username: 'azureuser',
		privateKey: fs.readFileSync('./z_id_rsa')
	}
})


gulp.task("default", ["webpack", 'uglify-primus', 'copy-img', 'server']);


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
	return gulp.src('primus.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-img', function () {
	gulp.src(['img/**/*']).pipe(gulp.dest('dist/img'));
})

gulp.task('server', function() {
	return gulp.src(['typings/**/*.d.ts', 'app/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(ts({
			module: 'commonjs',
			target: 'es5',
			noImplicitAny: true
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('built_server'));
});

gulp.task('package', ['default'], function () {
	return gulp.src([
		'./built_server/**/*',
		'./dist/**/*',
		'./package.json'
	], { base: '.' })
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest(''));
});

gulp.task('deploy', ['package'], function () {
	return gulp.src('archive.zip')
		.pipe(gulpSSH.sftp('write', '/home/azureuser/archive.zip'));
})

gulp.task('deployusw', ['package'], function () {
	return gulp.src('archive.zip')
		.pipe(gulpSSHusw.sftp('write', '/home/azureuser/archive.zip'));
})

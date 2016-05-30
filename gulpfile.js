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
var gulpSSHoce = new GulpSSH({
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
var gulpSSHeu = new GulpSSH({
	ignoreErrors: false,
	sshConfig: {
		host: 'eu1.massivematch.io',
		port: 22,
		username: 'azureuser',
		privateKey: fs.readFileSync('./z_id_rsa')
	}
})


gulp.task("default", ["webpack", 'uglify-primus', 'server']);


gulp.task('webpack', function(callback) {

	var config = Object.create(webpackConfig);
	//Alter the config
	config.devtool = 'source-map';
	config.plugins.push(new webpack.optimize.UglifyJsPlugin());

	webpack(config, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('uglify-primus', function() {
	return gulp.src('primus.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

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

gulp.task('sentry-release', ['webpack'], function() {
	['https://massivematch.io'].forEach(function (domain) {
		var opt = {
			DOMAIN: domain,
			API_URL: 'https://app.getsentry.com/api/0/projects/ironshod/massivematch-client/',
			API_KEY: '0b971a8f7c21469781db28468a3251ae',
			debug: true,
			versionPrefix: '', // Append before the version number in package.json 
		}
		var sentryRelease = require('gulp-sentry-release')('./package.json', opt);

		gulp.src('./dist/bundle.js.map', { base: './dist/' })
			.pipe(sentryRelease.release(fs.readFileSync('./hash.txt')));
	});
});

gulp.task('package', ['sentry-release', 'default'], function() {
	return gulp.src([
		'./built_server/**/*',
		'./dist/**/*',
		'./package.json',
		'./hash.txt',
		'./upstart-mmomatch.conf',
		'!./**/*.map'
	], { base: '.' })
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest(''));
});

gulp.task('copy-oce', ['package'], function() {
	return gulp.src('archive.zip')
		.pipe(gulpSSHoce.sftp('write', '/home/azureuser/archive.zip'));
});
gulp.task('copy-usw', ['package'], function() {
	return gulp.src('archive.zip')
		.pipe(gulpSSHusw.sftp('write', '/home/azureuser/archive.zip'));
});
gulp.task('copy-eu', ['package'], function() {
	return gulp.src('archive.zip')
		.pipe(gulpSSHeu.sftp('write', '/home/azureuser/archive.zip'));
});

gulp.task('deploy-oce', ['copy-oce'], function() {
	return gulpSSHoce
		.shell([
			'cd /home/azureuser/a',
			'rm -rf built_server dist package.json',
			'unzip -o ../archive.zip',
			'chmod 700 built_server -R',
			'sudo service mmomatch restart'
		], { filePath: 'shell-oce.log' })
		.on('ssh2Data', function(data) {
			process.stdout.write(data.toString());
		});
});
gulp.task('deploy-usw', ['copy-usw'], function() {
	return gulpSSHusw
		.shell([
			'cd /home/azureuser/a',
			'rm -rf built_server dist package.json',
			'unzip -o ../archive.zip',
			'chmod 700 built_server -R',
			'sudo service mmomatch restart'
		], { filePath: 'shell-usw.log' })
		.on('ssh2Data', function(data) {
			process.stdout.write(data.toString());
		});
});
gulp.task('deploy-eu', ['copy-eu'], function() {
	return gulpSSHeu
		.shell([
			'cd /home/azureuser/a',
			'rm -rf built_server dist package.json',
			'unzip -o ../archive.zip',
			'chmod 700 built_server -R',
			'sudo service mmomatch restart'
		], { filePath: 'shell-eu.log' })
		.on('ssh2Data', function(data) {
			process.stdout.write(data.toString());
		});
});

gulp.task('deploy', ['deploy-oce', 'deploy-usw', 'deploy-eu']);

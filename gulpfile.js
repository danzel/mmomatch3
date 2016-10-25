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

//Configuration of ssh nodes
var sites = {
	'oce': {
		username: 'azureuser',
		host: 'mmomatch.australiaeast.cloudapp.azure.com'
	},
	'usw': {
		username: 'azureuser',
		host: 'mmomatch.westus.cloudapp.azure.com'
	},
	'usw2': {
		username: 'ubuntu',
		host: 'usw2.massivematch.io'
	}
};
var privateKey = fs.readFileSync('./z_id_rsa');

var siteKeys = [];
for (var siteKey in sites) {
	siteKeys.push(siteKey);
	var site = sites[siteKey];
	site.ssh = new GulpSSH({
		ignoreErrors: false,
		sshConfig: {
			host: site.host,
			port: 22,
			username: site.username,
			privateKey: privateKey
		}
	});
}

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
			API_KEY: 'eb10b459a71c43a79a40106982deefc9d723eb71395142fc896d42ed7b9f0433',
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
	], { base: '.', nodir: true })
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest(''));
});

//Per site copy/deploy sets
siteKeys.forEach(function (siteKey) {
	var site = sites[siteKey];

	gulp.task('copy-' + siteKey, ['package'], function() {
		return gulp.src('archive.zip')
			.pipe(site.ssh.sftp('write', 'archive.zip'));
	});

	gulp.task('deploy-' + siteKey, ['copy-' + siteKey], function() {
		return site.ssh.shell([
				'cd a',
				'rm -rf built_server dist package.json',
				'unzip -o ../archive.zip',
				'sudo iptables -I INPUT -p tcp --dport 8092 --syn -j DROP',
				'sudo service mmomatch restart',
				'sleep 2',
				'sudo iptables -D INPUT -p tcp --dport 8092 --syn -j DROP'
			], { filePath: 'shell-' + siteKey + '.log' })
			.on('ssh2Data', function(data) {
				process.stdout.write(data.toString());
			});
	});
});

gulp.task('deploy', siteKeys.map(function(siteKey) { return 'deploy-' + siteKey; }));

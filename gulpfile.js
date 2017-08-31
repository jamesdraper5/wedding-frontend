// Node modules
var fs = require('fs'),
	vm = require('vm'),
	merge = require('deeply'),
	chalk = require('chalk'),
	es = require('event-stream'),
	path = require('path'),
	url = require('url'),
	del = require('del');

// Gulp and plugins
var gulp = require('gulp'),
	rjs = require('gulp-requirejs-bundler'),
	concat = require('gulp-concat'),
	filter = require('gulp-filter'),
	replace = require('gulp-replace'),
	uglify = require('gulp-uglify'),
	htmlreplace = require('gulp-html-replace'),
	connect = require('gulp-connect'),
	babelCore = require('babel-core'),
	objectAssign = require('object-assign'),
	proxy = require('http-proxy-middleware'),
	less = require('gulp-less'),
	serveStatic = require('serve-static'),
	gutil = require('gulp-util'),
	argv = require('yargs').argv,
	awspublish = require('gulp-awspublish'),
	revAll = require('gulp-rev-all'),
	cloudfront = require('gulp-cloudfront-invalidate-aws-publish'),
	AWS = require('aws-sdk'),
	parallelize = require("concurrent-transform");

// Sets it to production if it the ENV var is production. If it's anything else (including undefined), then it's false


//
//
// TO DO: this is probably no good any more, since we don't run gulp on a production server - it's run locally before assets are deployed to s3
//
//
var gulpConfig = {
	isProduction: !!argv.production
}

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
	requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
		out: 'scripts.js',
		baseUrl: 'src',
		name: 'app/startup',
		optimize: 'uglify2',
		generateSourceMaps: true,
		preserveLicenseComments: false,
		paths: {
			requireLib: 'bower_modules/requirejs/require'
		},
		include: [
			'requireLib',
			'components/page-404/page-404',
			'components/page-home/home',
			'components/page-login/page-login',
			'components/page-error/page-error',
			'components/page-login/page-login',
			'components/page-forgot-password/page-forgot-password',
			'components/page-reset-password/page-reset-password',
			'components/modal-confirm/modal-confirm',
			'components/nav-bar/nav-bar',
			'components/section-intro/section-intro',
			'components/section-maps/section-maps',
			'components/section-rsvp/section-rsvp',
			'components/section-wedding-party/section-wedding-party',
			'components/widget-map/widget-map'
		],
		insertRequire: ['app/startup'],
		bundles: {
			// If you want parts of the site to load on demand, remove them from the 'include' list
			// above, and group them into bundles here.
			'adminFiles': [
				'components/admin-header/admin-header',
				'components/admin-panel/admin-panel',
				'components/modal-upload-image/modal-upload-image',
				'components/overlay-editor-intro/overlay-editor-intro',
				'components/overlay-editor-maps/overlay-editor-maps',
				'components/overlay-editor-rsvp/overlay-editor-rsvp',
				'components/overlay-editor-weddingparty/overlay-editor-weddingparty',
				'components/overlay-settings-general/overlay-settings-general',
				'components/widget-image-editor/widget-image-editor',
				'components/widget-text-editor/widget-text-editor',
				'components/widget-toggle-switch/widget-toggle-switch'
			]
			// 'another-bundle-name': [ 'yet-another-module' ]
		}
	}),
	transpilationConfig = {
		root: 'src',
		skip: [
			'bower_modules/**',
			'libs/**',
			'app/require.config.js'
		],
		babelConfig: {
			presets: [
			  	'latest',
			  	'es2015',
				'stage-2'
			],
			plugins: [
				'transform-es2015-modules-commonjs'
			],
			ignore: [
				'bower_modules',
				'libs'
			]
		}
	},
	babelIgnoreRegexes = transpilationConfig.skip.map(function(item) {
		return babelCore.util.regexify(item);
	});

// Pushes all the source files through Babel for transpilation
gulp.task('js:babel', function() {
	var excludeIndex = filter(['**', '!*index.js'], {restore: true});
		return gulp.src(requireJsOptimizerConfig.baseUrl + '/**')
			.pipe(excludeIndex)
			.pipe(es.map(function(data, cb) {
				if (!data.isNull()) {
					babelTranspile(data.relative, function(err, res) {
						if (res) {
							data.contents = new Buffer(res.code);
						}
						cb(err, data);
					});
				} else {
					cb(null, data);
				}
			}))
			.pipe(gulp.dest('./temp'))
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js:optimize', ['js:babel'], function() {
	var config = objectAssign({}, requireJsOptimizerConfig, { baseUrl: 'temp' });
	return rjs(config)
		.pipe(gulpConfig.isProduction ? uglify({ preserveComments: 'some' }) : gutil.noop())
		.pipe(gulp.dest('./build/'));
})

// Builds the distributable .js files by calling Babel then the r.js optimizer
gulp.task('js', ['js:optimize'], function () {
	// Now clean up
	return del(['./temp/**/*']);
});

gulp.task('less', function () {
	return gulp.src('./src/less/main.less')
		.pipe(less({
			paths: [
				path.join(__dirname, './src/bower_modules/components-bootstrap/less'),
				path.join(__dirname, './src/bower_modules/toastr'),
				path.join(__dirname, './src/bower_modules/darkroom/build'),
				path.join(__dirname, './src/bower_modules/rome/dist'),
				path.join(__dirname, './src/less/font-awesome')
			]
		}))
		.pipe(gulp.dest('./src/css'))
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', ['less'], function () {
	// Include stylesheets for any third party libs here:
	var laddaStyles = gulp.src('src/bower_modules/ladda/dist/ladda.min.css'),
		quillStyles = gulp.src('src/libs/quill/quill.snow.css'),
		libCss = es.concat(laddaStyles, quillStyles).pipe(concat('libs.css')),
		appCss = gulp.src('src/css/*.css');
	return es.concat(appCss, libCss)
		.pipe(concat('css.css'))
		.pipe(gulp.dest('./build/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
	return gulp.src('./src/index.html')
		.pipe(htmlreplace({
			'css': 'http://cdn.wedding.dev/css.css',
			'js': 'http://cdn.wedding.dev/scripts.js',
			'debug': '<script>window.devMode = ' + !gulpConfig.isProduction + ';</script>'
		}))
		.pipe(gulp.dest('./')) // needed for testing locally through connect server
		.pipe(gulp.dest('./build'));
});

// Copies assets from public directory into build folder
gulp.task('assets', function () {
	// Include stylesheets for any third party libs here:
	return gulp.src('./public/**')
		.pipe(gulp.dest('./build/'));
});

gulp.task('watch', function() {
	gulp.watch(['./src/less/*.less'], ['less']);
	gulp.watch(['./src/**/*.js'], ['reloadJS']);
	gulp.watch(['./src/**/*.html'], ['reloadHtml']);
});

gulp.task('reloadLess', function(){
	//gulp.src('./src/less/**/*.less')
	//	.pipe(connect.reload())
	connect.reload('index.html')
});

gulp.task('reloadJS', function(){
	gulp.src('./src/**/*.js')
		.pipe(connect.reload())
});

gulp.task('reloadHtml', function(){
	gulp.src('./src/**/*.html')
		.pipe(connect.reload())
});

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:src', ['watch'], function() {
	var staticFiles = serveStatic("public");
	return connect.server({
		port: 3000,
		root: transpilationConfig.root,
		fallback: transpilationConfig.root + '/index.html',
		middleware: function(connect, opt) {
			return [
				staticFiles,
				function (req, res, next) {
					var pathname = path.normalize(url.parse(req.url).pathname);
					babelTranspile(pathname, function(err, result) {
						if (err) {
							next(err);
						} else if (result) {
							res.setHeader('Content-Type', 'application/javascript');
							res.end(result.code);
						} else {
							next();
						}
					});
				}
			];
		}
	});
});

gulp.task('clean', function() {
	return del(['./temp/**/*', './build/**/*', './dist/**/*']);
});

gulp.task('deploy', ['default'], function() {

	var awsCredentials = new AWS.SharedIniFileCredentials({profile: 'default'});

	// create a new publisher using S3 options
	var publisher = awspublish.create({
		region: 'us-east-1',
		params: {
			Bucket: 'wedding-pixie-app'
		},
		credentials: awsCredentials
	});

	// define custom headers
	var headers = {
		'Cache-Control': 'max-age=315360000, no-transform, public'
	};

	var cloudfrontOpts = {
		distribution: 'E1IV4IALXFUTAM', // Cloudfront distribution ID
		wait: false,                     // Whether to wait until invalidation is completed
		indexRootPath: true,             // Invalidate index.html root paths
		credentials: awsCredentials
	}

	gutil.log('Updating file references...');

	return gulp.src('./build/**')

		// set a new revision if files have changed
		.pipe(revAll.revision({
			dontRenameFile: [ 'index.html' ],
			dontGlobal: [
				/^\/fonts/,
				/^\/images/
			]
		}))

		// gzip, Set Content-Encoding headers and add .gz extension
		.on('end', function(){ gutil.log('Gzipping files...'); })

		.pipe(gulp.dest('dist')) // keep a copy in the dist directory so we can see what was deployed

		.pipe(awspublish.gzip())

		// publisher will add Content-Length, Content-Type and headers specified above
		// If not specified it will set x-amz-acl to public-read by default
		.on('end', function(){ gutil.log('Publishing files to s3...'); })
		.pipe(parallelize(publisher.publish(headers), 10)) // upload 10 at a time in parallel

		// invalidate Cloudfront cache on any files that were updated
		.on('end', function(){ gutil.log('Invalidating Cloudfront caches...'); })
		.pipe(cloudfront(cloudfrontOpts))

		// create a cache file to speed up consecutive uploads
		.on('end', function(){ gutil.log('Updating s3 cache...'); })
		.pipe(publisher.cache())

		// print upload updates to console
		.on('end', function(){ gutil.log('Done'); })
		.pipe(awspublish.reporter());

});

function babelTranspile(pathname, callback) {
	if (babelIgnoreRegexes.some(function (re) { return re.test(pathname); })) return callback();
	if (!babelCore.util.canCompile(pathname)) return callback();
	var src  = path.join(transpilationConfig.root, pathname);
	var opts = objectAssign({ sourceFileName: '/source' + pathname }, transpilationConfig.babelConfig);
	babelCore.transformFile(src, opts, callback);
}

gulp.task('default', ['html', 'js', 'css', 'assets'], function(callback) {
	gutil.log('Placed optimized files in ' + chalk.magenta('build/'));
	callback();
});

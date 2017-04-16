// Node modules
var fs = require('fs'),
	vm = require('vm'),
	merge = require('deeply'),
	chalk = require('chalk'),
	es = require('event-stream'),
	path = require('path'),
	url = require('url');

// Gulp and plugins
var gulp = require('gulp'),
	rjs = require('gulp-requirejs-bundler'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	filter = require('gulp-filter'),
	replace = require('gulp-replace'),
	uglify = require('gulp-uglify'),
	htmlreplace = require('gulp-html-replace'),
	connect = require('gulp-connect'),
	babelCore = require('babel-core'),
	babel = require('gulp-babel'),
	objectAssign = require('object-assign'),
	proxy = require('http-proxy-middleware'),
	less = require('gulp-less'),
	serveStatic = require('serve-static'),
	util = require('gulp-util');

var gulpConfig = {
	isProduction: !!util.env.production
}

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
	requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
		out: 'scripts.js',
		baseUrl: 'src',
		name: 'app/startup',
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
			'editor': [
				'components/admin-panel/admin-panel',
				'components/modal-upload-image/modal-upload-image',
				'components/overlay-edit-intro/overlay-edit-intro',
				'components/overlay-edit-maps/overlay-edit-maps',
				'components/overlay-edit-rsvp/overlay-edit-rsvp',
				'components/overlay-edit-weddingparty/overlay-edit-weddingparty',
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
		.pipe(gulpConfig.isProduction ? uglify({ preserveComments: 'some' }) : util.noop())
		.pipe(gulp.dest('./dist/'));
})

// Builds the distributable .js files by calling Babel then the r.js optimizer
gulp.task('js', ['js:optimize'], function () {
	// Now clean up
	return gulp.src('./temp', { read: false }).pipe(clean());
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
		.pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
	return gulp.src('./src/index.html')
		.pipe(htmlreplace({
			'css': '/css.css',
			'js': '/scripts.js',
			'debug': '<script>window.devMode = ' + gulpConfig.isProduction + ';</script>'
		}))
		.pipe(gulp.dest('./'));
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

gulp.task('deploy', ['default'], function() {
	// TO DO: copy index.html into dist folder, then run a gulp s3 plugin to deploy new build
});

function babelTranspile(pathname, callback) {
	if (babelIgnoreRegexes.some(function (re) { return re.test(pathname); })) return callback();
	if (!babelCore.util.canCompile(pathname)) return callback();
	var src  = path.join(transpilationConfig.root, pathname);
	var opts = objectAssign({ sourceFileName: '/source' + pathname }, transpilationConfig.babelConfig);
	babelCore.transformFile(src, opts, callback);
}

gulp.task('default', ['html', 'js', 'css'], function(callback) {
	callback();
	console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

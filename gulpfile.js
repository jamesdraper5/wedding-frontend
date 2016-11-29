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
	server = require('gulp-express'),
	serveStatic = require('serve-static');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
	requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
		out: 'scripts.js',
		baseUrl: './src',
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
			modules: 'amd',
			sourceMaps: 'inline'
		}
	},
	babelIgnoreRegexes = transpilationConfig.skip.map(function(item) {
		return babelCore.util.regexify(item);
	});

// Pushes all the source files through Babel for transpilation
gulp.task('js:babel', function() {
	var excludeIndex = filter(['**', '!*index.js'], {restore: true}),
		getIndex = filter('index.js');
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
		.pipe(excludeIndex.restore)
		.pipe(getIndex) // compile index.js separately and move straight to root folder
		.pipe(babel({
			presets: ['es2015', 'stage-2']
		}))
		.pipe(gulp.dest('./'))
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js:optimize', ['js:babel'], function() {
	var config = objectAssign({}, requireJsOptimizerConfig, { baseUrl: 'temp' });
	return rjs(config)
		.pipe(uglify({ preserveComments: 'some' }))
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
				path.join(__dirname, './src/bower_modules/darkroom/lib/css'),
				path.join(__dirname, './src/less/font-awesome')
			]
		}))
		.pipe(gulp.dest('./src/css'))
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', ['less'], function () {
	/*
	var bowerCss = gulp.src('src/bower_modules/components-bootstrap/css/bootstrap.min.css')
			.pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
	var mainCss = gulp.src('src/css/*.css').pipe(concat('css.css')),
		allFonts = gulp.src('./src/bower_modules/components-bootstrap/fonts/*').pipe(gulp.dest('./src/fonts'));
	return es.concat(mainCss, allFonts)
		.pipe(gulp.dest('./dist/'));
	*/
	return gulp.src('src/css/*.css')
		.pipe(concat('css.css'))
		.pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
	return gulp.src('./src/index.html')
		.pipe(htmlreplace({
			'css': 'css.css',
			'js': 'scripts.js'
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
	var apiProxy = proxy('/api', { target: 'http://localhost:5000', changeOrigin: true, logLevel: 'debug'});
	var staticFiles = serveStatic("public");
	return connect.server({
		root: transpilationConfig.root,
		middleware: function(connect, opt) {
			return [
				apiProxy,
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

// After building, starts a trivial static file server
gulp.task('serve', ['default'], function() {
	server.run(['index.js']);
});

function babelTranspile(pathname, callback) {
	if (babelIgnoreRegexes.some(function (re) { return re.test(pathname); })) return callback();
	if (!babelCore.canCompile(pathname)) return callback();
	var src  = path.join(transpilationConfig.root, pathname);
	var opts = objectAssign({ sourceFileName: '/source/' + pathname }, transpilationConfig.babelConfig);
	babelCore.transformFile(src, opts, callback);
}

gulp.task('default', ['html', 'js', 'css'], function(callback) {
	callback();
	console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

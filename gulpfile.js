var gulp = require('gulp');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var gutil = require("gulp-util");
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var watchWebpack = null;

function initWebpack(dev, cb) {
    var config = {
        context: __dirname + '/src/js',
        entry: './ColorEditor.jsx',
        output: {
            path: __dirname,
            filename: dev ? 'coloreditor.js' : 'coloreditor.min.js',
            library: 'ColorEditor',
            libraryTarget: 'umd'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel'
                }
            ]
        },
        plugins: dev ? [] : [new webpack.optimize.UglifyJsPlugin({})]
    };

    if (dev) {
        config.debug = true;
        config.devtool = 'sourcemap';
    }

    var callback;

    if (cb) {
        callback = function(err, stats) {
            if(err) {
                throw new gutil.PluginError("webpack", err);
            }

            gutil.log("[webpack]", stats.toString({
                colors: true
            }));

            cb();
        };
    }

    return webpack(config, callback);
}

gulp.task('watch-js', function (cb) {
    watchWebpack.run(function(err, stats) {
        if(err) {
            throw new gutil.PluginError("webpack:build-dev", err);
        }

        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));

        cb();
    });
});

gulp.task('development-js', function (cb) {
    initWebpack(true, cb);
});

gulp.task('production-js', function (cb) {
    initWebpack(false, cb);
});

gulp.task('development-less', function () {
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('production-less', function () {
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(rename('coloreditor.min.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['development-js', 'production-js', 'development-less', 'production-less']);

gulp.task('watch', function () {

    watchWebpack = initWebpack(true);

    gulp.watch('src/js/**/*.jsx', ['watch-js']);
    gulp.watch('src/less/**/*.less', ['development-less']);
});
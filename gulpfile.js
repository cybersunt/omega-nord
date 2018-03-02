'use strict';

// Определим необходимые инструменты
var gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    include = require("posthtml-include"),
    rsp = require('remove-svg-properties').stream,

    fs = require('fs'),
    sassGlob = require('gulp-sass-glob'),

    importcss = require('postcss-import'),
    autoprefixer = require('autoprefixer'),

    del = require('del'),
    cssunit = require('gulp-css-unit'),
    browserSync = require('browser-sync').create();

// ЗАДАЧА: Компиляция CSS
gulp.task('styles', function() {
  return gulp.src('./source/scss/path/style.scss')
    .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(sassGlob())
    .pipe(gp.sass())
    .pipe(gp.autoprefixer({
      browsers : ['last 2 version'],
      cascade : false
    }))
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('./public/css'))
    .pipe(gp.csso())
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.reload({stream : true}));
});

// ЗАДАЧА: Сборка HTML
gulp.task('markup', function() {
  return gulp.src('./source/pug/index.pug')
    .pipe(gp.pug({
      locals : JSON.parse(fs.readFileSync('./source/pug/content.json', 'utf8')),
      pretty: true,
    }))
    .pipe(gulp.dest('./public/'));
});

// ЗАДАЧА: Оптимизируем декоративные PNG, JPG, SVG
gulp.task('images:decor', function() {
  return gulp.src('./source/img/decoration/**/*.{png,jpg,jpeg,svg}')
  .pipe(gp.plumber())
  .pipe(gp.imagemin([
    gp.imagemin.jpegtran({progressive: true}),
    gp.imagemin.optipng({optimizationLevel: 3}),
    gp.imagemin.svgo()
  ]))
  .pipe(gulp.dest('./public/img/decoration'));
});

// ЗАДАЧА: Оптимизируем контентные PNG, JPG, SVG
gulp.task('images:content', function() {
  return gulp.src('./source/img/content/**/*.{png,jpg,jpeg,svg}')
  .pipe(gp.plumber())
  .pipe(gp.imagemin([
    gp.imagemin.jpegtran({progressive: true}),
    gp.imagemin.optipng({optimizationLevel: 3}),
    gp.imagemin.svgo()
  ]))
  .pipe(gulp.dest('./public/img/content'));
});

// ЗАДАЧА: Создаем файлы WEBP для хромиум-браузеров
gulp.task('webp', function () {
  return gulp.src('./source/img/content/**/*.{png,jpg}')
    .pipe(gp.plumber())
    .pipe(gp.webp({quality: 80}))
    .pipe(gulp.dest('./public/img/content'));
});

// ЗАДАЧА: Создаем SVG-спрайт
gulp.task('sprite', function () {
  return gulp.src('./source/img/sprite/*.svg')
    .pipe(gp.plumber())
    .pipe(rsp.remove({
        properties: [rsp.PROPS_FILL]
    }))
    .pipe(gp.svgstore({
      inlineSvg: true
    }))
    .pipe(gp.rename('sprite.svg'))
    .pipe(gulp.dest('./public/img/'));
});

// ЗАДАЧА: Минимизируем JS
gulp.task('scripts', function () {
  return gulp.src('./source/js/**/*.js')
    .pipe(gp.jslint())
    .pipe(gp.plumber())
    .pipe(gulp.dest('./public/js/'))
    .pipe(gp.uglify())
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/js/'))
});

// ЗАДАЧА: Копируем шрифты
gulp.task('fonts', function() {
  return gulp.src('./source/fonts/**')
  .pipe(gulp.dest('./public/fonts/'));
});

// ЗАДАЧА: BrowserSync
gulp.task('serve', function() {
    browserSync.init({
      open: false,
      server: {
        baseDir: 'public/'
     }
    });
    browserSync.watch(['./public/**/*.*'], browserSync.reload);
  });

// ЗАДАЧА: Автоматическая пересборка
gulp.task('watch', function() {
  gulp.watch('./source/fonts/**', gulp.series('fonts'));
  gulp.watch('./source/js/**/*.js', gulp.series('scripts'));
  gulp.watch('./source/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('./source/**/*.pug', gulp.series('markup'));
  gulp.watch('./source/img/content/**/*.*', gulp.series('images:content'));
  gulp.watch('./source/img/decoration/**/*.*', gulp.series('images:decor'));
    // gulp.watch('./source/img/content/**/*.*', gulp.series('webp'));
    // gulp.watch('./source/img/sprite/**/*.*', gulp.series('sprite'));
});

// ЗАДАЧА: Сборка всего
gulp.task('default',
  gulp.series(
  'fonts',
  // 'sprite',
  gulp.parallel(
    'styles',
    'scripts',
    'markup',
    'images:decor',
    'images:content',
    // 'webp',
  ),
  gulp.parallel(
    'watch',
    'serve'
  )
));

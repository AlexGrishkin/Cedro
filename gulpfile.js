const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();

function styles() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src("src/js/**/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src("src/images/**/*")
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: "./dist",
  });

  gulp.watch("src/scss/**/*.scss", styles);
  gulp.watch("src/js/**/*.js", scripts);
  gulp.watch("src/images/**/*", images);
  gulp
    .watch("src/*.html")
    .on("change", gulp.series(copyHTML, browserSync.reload));
}

function copyHTML() {
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.serve = serve;
exports.copyHTML = copyHTML;
exports.default = gulp.series(
  copyHTML,
  gulp.parallel(styles, scripts, images),
  serve
);

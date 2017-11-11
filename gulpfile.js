var gulp = require('gulp');
var purify = require('gulp-purifycss');
var gulpCopy = require('gulp-copy');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var critical = require('critical').stream;

gulp.task('critical', function () {
    return gulp.src('build/*.html')
        .pipe(critical({base: 'build/', inline: true,minify:true, css: ['build/css/combined.css']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
        .pipe(gulp.dest('build'));
});

function css() {
    return gulp.src('./build/css/*.css')
      .pipe(purify(['index.html']))
      .pipe(cleanCss({}))
      .pipe(gulp.dest('./build/css'));
}

function minBuildHtml(){    
    return gulp.src('build/index.html')
        .pipe(htmlmin({collapseWhitespace: true,removeComments:true}))
        .pipe(gulp.dest('build'));
}

gulp.task('min-html', function(){
    return gulp.src('index.html')
        .pipe(htmlmin({collapseWhitespace: true,removeComments:true}))
        .pipe(gulp.dest('build'));
})

gulp.task('copy-img', function(){
    return gulp
    .src('img/**/*.*')
    .pipe(gulpCopy('build', {}));
})

gulp.task('copy-fonts', function(){
    return gulp
    .src('fonts/**/*.*')
    .pipe(gulpCopy('build', {}));
})

gulp.task('copy-other', function(){
    return gulp
    .src(['submit.php','sys/.htaccess'])
    .pipe(gulpCopy('build', {}))
})


gulp.task('useref', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCss()))        
      //  .pipe(revReplace())
        .pipe(gulp.dest('build'));
});

gulp.task('build',['useref','copy-img','copy-fonts','copy-other'], function(){
    css();
    minBuildHtml();
 })
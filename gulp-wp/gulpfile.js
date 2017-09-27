// ---  Project Variables  ------

// replace with the name of your theme
var themeDir = 'yellowhammer';
var pathToHost =  'localhost/wordpress';



// ---  Require Gulp Libraries  ------
var fs              = require('fs');
var gulp            = require('gulp');
var sass            = require('gulp-sass');
var notify          = require('gulp-notify');
var plumber         = require('gulp-plumber');
var browserSync     = require('browser-sync').create();
var mainBowerFiles  = require('main-bower-files');
var filter          = require('gulp-filter');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var bower           = require('gulp-bower');
var order           = require('gulp-order');
var minify          = require('gulp-minify');
var clean           = require('gulp-clean-css');
var useref          = require('gulp-useref');
var gulpIf          = require('gulp-if');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var rename          = require('gulp-rename');
var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
})
};

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];



// Compile Sass 
gulp.task('sass', function(){
    var filterCSS = filter('app/css/*.css', { restore: true });

    return gulp.src('app/scss/**/style.scss')    
        .pipe(plumber(plumberErrorHandler))
        .pipe(sourcemaps.init())
        .pipe(sass({
            style: 'compressed'
         }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('app/css'))
        .pipe(filterCSS)
        .pipe(concat('theme-styles.css'))
        .pipe(clean())
        .pipe(sourcemaps.write( '/maps' ))
        .pipe(gulp.dest('../' + themeDir + '/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('js', function(){
    return gulp.src('app/js/*.js')
        .pipe(concat('theme-scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../' + themeDir  + '/js/'))
});

gulp.task('browserSync', function(){
    browserSync.init({
        proxy: pathToHost,
        injectChanges: true,
        // Use a specific port.
        //port: 8000,
    });
});

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', [ 'js', browserSync.reload ] )
    gulp.watch('../' + themeDir + '/**/*.php', browserSync.reload);
    // gulp.watch('app/*.html', browserSync.reload);
});


// Prep Bower Components
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('bower_components'))
});

// WARNING this will override customizations made to bootstrap
gulp.task('vendorscss', function(){
    var filterSCSS = filter('**/*.scss', { restore: true });
    return gulp.src('./bower_components/**/*.scss')
        .pipe(gulp.dest('app/scss/libs'));
})

gulp.task('vendorfonts', function() {
    console.log("fonts: ", themeDir + '/fonts/');
    return gulp.src('./bower_components/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(rename(function(path){
            var re = new RegExp("^glyphicons.*$");
            if(re.test(path.basename)){
                 path.dirname = '/bootstrap/';
             } else {
                 path.dirname = '/';
             }
           
        }))
        .pipe(gulp.dest('../' + themeDir + '/fonts/'));

});

gulp.task('vendorjs', function() {
    var filterJS = filter('**/*.js', { restore: true });
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest('../' + themeDir + '/js'));
});

gulp.task('dirExists', function(){
    console.log('Bootstrap directory exists, to overwrite sass files, run "gulp vendorscss"');
})

// Run at start of project to initiate bower/libraries
gulp.task('default', ['bower', 'vendorjs', 'vendorfonts', gulpIf(fs.existsSync('app/scss/libs/bootstrap-sass'), 'dirExists', 'vendorscss'), 'sass']);




// IMAGES

// 








// // BUILD Client Code/Files
// gulp.task('buildFonts', function(){
//  return gulp.src('app/fonts/*')
//      .pipe(gulp.dest('dist/fonts'))
// })

// // Prepairs ugly code
// gulp.task('useref', function(){
//  return gulp.src('app/*.html')
//      .pipe(useref())
//      .pipe(gulpIf('*.js', uglify()))
//      .pipe(gulpIf('*.css', clean()))
//      .pipe(gulp.dest('dist'))
// })

// gulp.task('build', ['buildFonts', 'useref']);






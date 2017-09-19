// ---  Project Variables  ------

// replace with the name of your theme
var themeDir = 'theme-dir';
var pathToHost =  'localhost/wordpress';



// ---  Require Gulp Libraries  ------

var gulp 			= require('gulp');
var sass 			= require('gulp-sass');
var notify 			= require('gulp-notify');
var plumber 		= require('gulp-plumber');
var browserSync 	= require('browser-sync').create();
var mainBowerFiles 	= require('gulp-main-bower-files');
var filter 			= require('gulp-filter');
var concat 			= require('gulp-concat');
var uglify 			= require('gulp-uglify');
var bower 			= require('gulp-bower');
var order 			= require('gulp-order');
var minify			= require('gulp-minify');
var clean			= require('gulp-clean-css');
var useref			= require('gulp-useref');
var gulpIf 			= require('gulp-if');
var sourcemaps 	    = require('gulp-sourcemaps');
var plumberErrorHandler = { errorHandler: notify.onError({
	title: 'Gulp',
	message: 'Error: <%= error.message %>'
})
};







// Compile Sass 
gulp.task('sass', function(){
    var filterCSS = filter('app/css/*.css', { restore: true });

	return gulp.src('app/scss/**/*.scss')    
		.pipe(plumber(plumberErrorHandler))
		.pipe(sass({
            style: 'compressed',
			includePaths: [
               	'app/sass',
               	'bower_components/bootstrap-sass/assets/stylesheets',
                'bower_components/font-awesome/scss'
   	       ]
  	     }))
        .pipe(sourcemaps.init())
		.pipe(gulp.dest('app/css'))
        .pipe(filterCSS)
        .pipe(concat('theme-styles.css'))
        .pipe(clean())
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('../' + themeDir + '/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
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
    gulp.watch('app/js/**/*.js', browserSync.reload)
    gulp.watch('../' + themeDir + '/**/*.php', browserSync.reload);
	// gulp.watch('app/*.html', browserSync.reload);
	
});





// Prep Bower Components
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('bower_components'))
});

gulp.task('fonts', function() {
    console.log("fonts: ", themeDir + '/fonts/');
	return gulp.src('./bower_components/**/*.{eot,svg,ttf,woff,woff2}')
    	.pipe(gulp.dest('../' + themeDir + '/fonts/'));

});

gulp.task('js', function() {
	var filterJS = filter('**/*.js', { restore: true });
    return gulp.src('bower.json')
        .pipe(mainBowerFiles({
        	overrides: {
                'bootstrap-sass': {
                    main: [
                        '../' + themeDir + '/js/bootstrap.js',
                        '../' + themeDir + '/css/*.min.*',
                        '../' + themeDir + '/fonts/*.*'
                    ]
                },
                'font-awesome':{
                	main: [
                		'../' + themeDir + '/fonts/*.*'
                    ]
                }

            }
        }))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest('../' + themeDir + '/js'));
});

gulp.task('css', function(){
	return gulp.src('app/css/*')
		.pipe(clean())
		.pipe(gulp.dest('../' + themeDir + '/css'))
});

// Run at start of project to initiate bower/libraries
gulp.task('default', ['bower', 'js', 'fonts', 'sass']);




// IMAGES

// 








// // BUILD Client Code/Files
// gulp.task('buildFonts', function(){
// 	return gulp.src('app/fonts/*')
// 		.pipe(gulp.dest('dist/fonts'))
// })

// // Prepairs ugly code
// gulp.task('useref', function(){
// 	return gulp.src('app/*.html')
// 		.pipe(useref())
// 		.pipe(gulpIf('*.js', uglify()))
// 		.pipe(gulpIf('*.css', clean()))
// 		.pipe(gulp.dest('dist'))
// })

// gulp.task('build', ['buildFonts', 'useref']);






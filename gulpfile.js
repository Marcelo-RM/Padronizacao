const gulp = require("gulp");
const babel = require("gulp-babel");
const uglifycss = require("gulp-uglifycss");
const bless = require("gulp-bless");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const ts = require('gulp-typescript');

gulp.task("default", () => {
    return new Promise(function(resolve, reject){

        //Minificando javascript e adicionando suporte a browser antigo
        gulp.src("src/js/MM.js")
        .pipe(babel({
            minified: true,
            comments: false,
            presets: ["env"]
        }))
        .on("error", (err) => console.log(err))
        //.pipe(concat("UQFN.min.js"))
        .pipe(rename("MM.min.js"))
        .pipe(gulp.dest("build"));
        
        //Minificando Css
        gulp.src("src/sass/MM.scss")
            .pipe(sass().on("error", sass.logError))
            .pipe(bless())
            .pipe(uglifycss({"uglyCoomments": true}))
            .pipe(concat("MM.min.css"))
            .pipe(gulp.dest("build"));

        resolve();
    })
});
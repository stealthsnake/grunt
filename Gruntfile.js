const sassImpl = require('node-sass');
module.exports = function (grunt) {

    require('grunt-task-loader')(grunt);

    grunt.initConfig({
        // reads the json file and assign to to variable
        // the package does have, name of the project, path where to store js & css
        // pkg.name : project name
        // pkg.projectPath.cssLocation : path for css files
        // pkg.projectPath.JSLocation : path for js files
        pkg: grunt.file.readJSON("package.json"),
        sass: { // compile scss files to css using grunt-sass
            options: {
                // grunt sass has to implementation to compile scss - Dart Sass or Node Sass.
                // the const value of implSass defined on the top is used here
                implementation: sassImpl,
                sourceMap: "inline",
                style: 'expanded'
            },
            dist: {
                files: {
                    // destination file: soruce file
                    "<%= pkg.projectPath.cssLocation %>/<%= pkg.name%>.css": "src/scss/<%= pkg.name %>.scss"
                }
            }
        },
        postcss: {// browser prefixes
            dev: {
                options: {
                    processors: [
                        require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes last 2 for each browser
                    ]
                },
                src: "<%= pkg.projectPath.cssLocation %>/<%= pkg.name%>.css",
                dest: "<%= pkg.projectPath.cssLocation %>/<%= pkg.name%>.css",
            },
            build:{
                options: {
                    processors: [
                        require('cssnano')() // minify the result
                    ]
                },
                src: "<%= pkg.projectPath.cssLocation %>/<%= pkg.name%>.css",
                dest: "<%= pkg.projectPath.cssLocation %>/<%= pkg.name%>.min.css",
            }
        },
        uglify: { // minify js file
            options: {
                sourceMap: true
            },
            build: {
                src: "src/js/<%= pkg.name %>.js",
                dest: "<%= pkg.projectPath.JSLocation %>/<%= pkg.name %>.min.js"
            }
        },
        watch: {
            // watch command for any changes on the files
            scss: {// for scss
                // files to watch
                files: ['src/**/*.scss'],
                // task to do when there is change
                tasks: ['sass:dist', 'postcss'],
                options: {
                    spawn: false
                }
            },
            js: {// for js
                // files to watch
                files: ['src/**/*.js'],
                // task to do when there is change
                tasks: ['uglify:build']
            }
        }
    });
    grunt.registerTask('default', 'watch');
}
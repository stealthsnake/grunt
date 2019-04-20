const sassImpl = require('node-sass');
module.exports = function (grunt) {

    require('grunt-task-loader')(grunt);

    grunt.initConfig({
        // reads the json file and assign to to variable
        // the package.json does have, name of the project, path where to store js & css
        // pkg.name : project name
        // pkg.project.path.cssLocation : path for css files
        // pkg.project.path.JSLocation : path for js files
        pkg: grunt.file.readJSON("package.json"),
        sass: { // compile scss files to css using grunt-sass
            options: {
                // grunt sass has two implementation to compile scss - Dart Sass or Node Sass.
                // the const value of implSass defined on the top is used here
                implementation: sassImpl,
                sourceMap: true,
                style: 'expanded'
            },
            dist: {
                files: {
                    // destination file: soruce file
                    "<%= pkg.project.path.cssLocation %>/<%= pkg.name%>.css": "src/scss/<%= pkg.name %>.scss"
                }
            }
        },
        postcss: {// browser prefixes
            development: {// task for postcss for development env
                options: {
                    processors: [
                        require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes last 2 for each browser
                    ]
                },
                src: "<%= pkg.project.path.cssLocation %>/<%= pkg.name%>.css",
                dest: "<%= pkg.project.path.cssLocation %>/<%= pkg.name%>.css",
            },
            production:{ // task for postcss for production env
                options: {
                    processors: [
                        require('cssnano')() // minify the result
                    ]
                },
                src: "<%= pkg.project.path.cssLocation %>/<%= pkg.name%>.css",
                dest: "<%= pkg.project.path.cssLocation %>/<%= pkg.name%>.min.css",
            }
        },
        uglify: { // minify js file
            options: {
                sourceMap: true
            },
            build: {
                src: "src/js/<%= pkg.name %>.js",
                dest: "<%= pkg.project.path.JSLocation %>/<%= pkg.name %>.min.js"
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
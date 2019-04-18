const sass = require('node-sass');
module.exports = function (grunt) {

    require('grunt-task-loader')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    "<%= pkg.projectPath.cssLocation %>/<%= pkg.name%>.css": "src/scss/<%= pkg.name %>.scss"
                }
            }
        },
        uglify: {
            options:{
                sourceMap:true
            },
            build: {
                src: "src/js/<%= pkg.name %>.js",
                dest: "<%= pkg.projectPath.JSLocation %>/<%= pkg.name %>min.js"
            }
        },
        watch: {
            scss: {
                files: ['src/**/*.scss'],
                tasks: ['sass:dist'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['uglify:build']
            }
        }
    });
    grunt.registerTask('default', 'watch');
}
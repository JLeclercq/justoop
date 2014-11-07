module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                banner: '/*! <%= pkg.name %>-r <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
	    dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        browserify: {
            options:{
                exclude:["external"]
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>-browser.js'
            }
            
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.registerTask('test', [ ]);

    grunt.registerTask('default', ['concat',  'uglify',]);

};
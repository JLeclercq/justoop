module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                banner:"/*  <%= pkg.name %> <%= pkg.version%> . Lightweight Object Oriented Library For Javascript */\n"
            },
            dist: {
                src: ['src/justoop.js'],
                dest: 'dist/<%= pkg.name %>.js'
            },
            with_underscore: {
                src: ['src/justoop.js', 'node_modules/underscore/underscore.js'],
                dest: 'dist/<%= pkg.name %>-with-underscore.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                mangle:["eval"],
                reserved:["f_"],
                banner: '/*! <%= pkg.name %> <%= pkg.version%> -r <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
	    dist: {
                files: {
                    'dist/<%= pkg.name %>.<%= pkg.version%>.min.js': ["<%= concat.dist.dest %>"],
                    'dist/<%= pkg.name %>.<%= pkg.version%>-with-underscore.min.js': ["<%= concat.with_underscore.dest %>"]
                }
            }
        }
        /*,
        browserify: {
            options:{
                exclude:["external"]
            },
            dist: {
                src: ['src/justoop.js'],
                dest: 'dist/<%= pkg.name %>-with-underscore.js'
            }
            
        }*/
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.loadNpmTasks('grunt-browserify');
    //grunt.registerTask('test', [ ]);

    grunt.registerTask('default', ['concat',  'uglify',]);

};
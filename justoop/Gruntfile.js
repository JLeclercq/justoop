module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist/*"],
        concat: {
            options: {
                separator: ';',
                banner:"/*  <%= pkg.name %> <%= pkg.version%> . Lightweight Object Oriented Library For Javascript */\n"
            },
            dist: {
                src: ['src/justoop.js'],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version%>.js'
            },
            with_underscore: {
                src: ['src/justoop.js', 'node_modules/underscore/underscore.js'],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version%>-with-underscore.js'
            }
        },
        replace:
        {
            first: {
               src: ['dist/*.js'],             // source files array (supports minimatch)
               dest: 'dist/',             // destination directory or file
               replacements: [{
                 from: 'eval',                   // string replacement
                 to: '_eval'
             }]
            },
            second: {
               src: ['dist/*.js'],             // source files array (supports minimatch)
               dest: 'dist/',             // destination directory or file
               replacements: [{
                 from: '_eval',                   // string replacement
                 to: 'eval'
             }]
            }
        },
        uglify: {
            options: {
                sourceMap: false,
                reserved:["f_", "_eval"],
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

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-browserify');
    //grunt.registerTask('test', [ ]);

    grunt.registerTask('default', ['clean', 'concat', 'replace:first', 'uglify','replace:second']);

};

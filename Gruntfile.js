module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist/*", "justoop.*.js", "justoop.*.map"],
        concat: {
            options: {
                separator: ';',
                banner:"/*  <%= pkg.name %> <%= pkg.version%> . Lightweight Object Oriented Library For Javascript */\n"
            },
            dist: {
                src: ['src/justoop.js'],
                dest: 'dist/<%= pkg.name %>.<%= pkg.version%>.js'
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
                sourceMap: true,
                reserved:["f_", "_eval"],
                banner: '/*! <%= pkg.name %> <%= pkg.version%> -r <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
	        dist: {
                files: {
                    'dist/<%= pkg.name %>.<%= pkg.version%>.min.js': ["<%= concat.dist.dest %>"]
                }
            }
        },
        nodeunit:
        {
            test: ['src/test.js']
        },
        copy:{
            main:{
                flatten: true,
                cwd:'dist/',
                src: '*',
                expand: true ,
                dest: '.',
                filter: 'isFile'
            }
        },
        env: {
           test:{
               NODE_PATH:"./src/"
           }
         }
        /*browserify: {
            options:{
                exclude:["underscore", "justoop"]
            },
            dist: {
                src: ['src/test.js'],
                dest: 'dist/btest.js'
            }

        }*/
    });

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-browserify');
    //grunt.loadNpmTasks('grunt-browserify');
    //grunt.registerTask('test', [ ]);

    grunt.registerTask('default', ['nodeunit', 'clean', 'concat', 'replace:first', 'uglify','replace:second', 'copy']);
};

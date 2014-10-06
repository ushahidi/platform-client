module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'a/css/screen.css': 'a/sass/screen.scss'
				}
			}
		},

    	concat: {
			frontend: {
				src: [
					'a/js/_libs/1_jquery-1.10.2.js',
					'a/js/_plugins/*.js', // All JS in the top-level plugins folder
					'a/js/_custom/**/*.js'  // All JS in the top-level custom folder
				],
				dest: 'a/js/frontend.js'
			}
        },

		uglify: {
			frontend: {
				src: 'a/js/frontend.js',
				dest: 'a/js/frontend.min.js'
			}
		},

		watch: {
			options: {
				livereload: true,
			},
			any: {
				files: ['**/*.html']
			},
			css: {
				files: ['a/**/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false,
				}
			},
			scripts: {
				files: ['a/js/_custom/*.js'],
				tasks: ['concat','uglify'],
				options: {
					spawn: false
				}
			}
		}

  });

	require('load-grunt-tasks')(grunt);
	grunt.registerTask('default', ['sass','concat','uglify']);
};
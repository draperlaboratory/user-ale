'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      src: {
        src: [
        'lib/app/app.js',
        'lib/app/services.js',
        'lib/app/**/*.js',
        'lib/app/controllers/*.js',
        'lib/app/models/*.js',
        'lib/app/views/*.js'
        ],
        dest: 'dist/js/src.js'
      },
      assets: {
        src: [
        'lib/assets/jquery.min.js',
        'lib/assets/angular/angular.min.js',
        'lib/assets/angular/*.js',
        'lib/assets/angular/extensions/*.js',
        'lib/assets/bootstrap.js',
        'lib/assets/*.js'
        ],
        dest: 'dist/js/assets.js'
      }
    },
    copy: {
      main: {
        files: [
          {expand: false, src: ['lib/index.html'], dest: 'server/views/index.html', filter: 'isFile'},
          {expand: true, cwd: 'lib/fonts/', src: ['*'], dest: 'dist/fonts/'},
          {expand: true, cwd: 'lib/static/', src: ['**/*'], dest: 'dist/static/'},
          {expand: true, cwd: 'lib/templates/', src: ['**/*'], dest: 'dist/templates/'},
          {expand: true, cwd: 'lib/assets/packages', src: ['**/*'], dest: 'dist/assets/'}
        ]
      }
    },
    less: {
      bootstrap: {
        options: {
          // modifyVars: {
          //   // 'icon-font-path': '../fonts/'
          // },
        },
        files: {
          'dist/css/bootstrap.css': 'lib/less/bootstrap/bootstrap.less',
        }
      },
      style: {
        files: {
          'dist/css/style.css': 'lib/less/*.less'
        }
      }
    },
    jshint: {
      options: {
        // jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      // lib: {
      //   options: {
      //     jshintrc: 'lib/.jshintrc'
      //   },
      //   src: ['lib/**/*.js']
      // }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      copy: {
        files: ['lib/index.html', 'lib/fonts/*', 'lib/templates/**/*.html', 'lib/static/**/*.html', 'lib/static/**/*.js'],
        tasks: ['copy']
      },
      concatAssets: {
        files: ['<%= concat.assets.src %>'],
        tasks: ['concat:assets']
      },
      concatSrc: {
        files: ['<%= concat.src.src %>'],
        tasks: ['concat:src']
      },
      less: {
        files: ['lib/less/bootstrap/*.less'],
        tasks: ['less:bootstrap']
      },
      myLess: {
        files: ['lib/less/*.less'],
        tasks: ['less:style']
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task.
  grunt.registerTask('default', ['copy', 'concat:assets', 'concat:src', 'less']);

};

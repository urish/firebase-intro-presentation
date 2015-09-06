/* global module:false */

module.exports = function (grunt) {
  grunt.initConfig({
    sass: {
      themes: {
        files: [
          {
            expand: true,
            cwd: 'css/theme/source',
            src: ['*.scss'],
            dest: 'css/theme',
            ext: '.css'
          }
        ]
      }
    }
  });

  // Dependencies
  grunt.loadNpmTasks('grunt-sass');

  // Theme CSS
  grunt.registerTask('css-themes', ['sass:themes']);
};

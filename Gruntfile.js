module.exports = (grunt) => {
  grunt.initConfig({
    eslint: {
      target: [
        'src/**/*.js',
        'Gruntfile.js',
      ],
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['eslint'],
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['eslint']);
};

module.exports = (grunt) => {
  grunt.initConfig({
    eslint: {
      target: [
        './src/**/*.ts',
        'Gruntfile.js',
      ],
    },
    watch: {
      files: ['./src/*'],
      tasks: ['shell:build'],
    },
    shell: {
      build: {
        command: 'npm run build',
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('linst', ['eslint']);
  grunt.registerTask('build', ['shell:build']);
};

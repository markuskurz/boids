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
      tasks: ['shell:build'],
    },
    browserSync: {
      bsFiles: {
        src: './src/*',
      },
      options: {
        watchTask: true,
        server: {
          baseDir: './',
        },
      },
    },
    shell: {
      // options: {
      //   stderr: false,
      // },
      build: {
        command: 'npm run build',
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('default', ['browserSync', 'watch']);
  grunt.registerTask('linst', ['eslint']);
  grunt.registerTask('build', ['shell:build']);
};

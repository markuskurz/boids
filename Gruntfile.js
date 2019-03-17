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
        command: 'npx webpack',
      },
      clean: {
        command: 'rm -r ./dist',
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.html', '**/*.css'],
            dest: 'dist',
          },
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('build', ['copy', 'shell:build']);
  grunt.registerTask('clean', ['shell:clean']);
};

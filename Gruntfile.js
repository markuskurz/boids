module.exports = (grunt) => {
  grunt.initConfig({
    tslint: {
      options: {
        configuration: 'tslint.json',
        force: true,
      },
      files: {
        src: [
          './src/**/*.ts',
        ],
      },
    },
    watch: {
      files: ['./src/*'],
      tasks: ['lint', 'build'],
      options: {
        atBegin: true,
      }
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

  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['lint', 'clean', 'build']);
  grunt.registerTask('lint', ['tslint']);
  grunt.registerTask('clean', ['shell:clean']);
  grunt.registerTask('build', ['copy', 'shell:build']);
};

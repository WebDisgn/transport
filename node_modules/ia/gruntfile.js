var grunt = require('grunt');
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

grunt.initConfig({
    babel: {
        options: {
            sourceMap: true,
            modules: "common",
        },
        dist: {
            files: {
                'dist/ia.js': 'src/ia.js',
            }
        }
    }
});

grunt.registerTask('default', ['babel']);
module.exports = function( grunt ) {

  var scripts = [
    'js/pwnd.js'
  ];

  var testScripts = [];

  var includes = [];

  var buildScripts = includes.concat( scripts );
  var testBuildScripts = includes.concat( scripts ).concat(testScripts);

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    nodeunit: {
      all: ['test/*-test.js'],
      options: {
        reporter: 'junit',
        reporterOptions: {
          output: 'test/result'
        }
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit');


  grunt.registerTask( 'test', [
    'nodeunit'
  ] )

}

module.exports = function( grunt ) {
  var config;

  grunt.initConfig({

    config: {
      production: grunt.file.readJSON('app/services/production.json'),
      homolog: grunt.file.readJSON('app/services/homolog.json')
    },

    paths: {
      dist: 'public'
    },

    selected_config: {},

    s3: {
      options: {
        bucket: '<%= selected_config.bucket %>',
        gzip: true,
        cache: false
      },
      build: {
        cwd: 'public',
        src: '**/*.{css,js,html,png,svg,eot,ttf,woff,woff2}',
      }
    },

    cloudfront: {
      options: {
        distributionId: '<%= selected_config.distributionId %>',
      },
      html: {
        options: {
          invalidations: [
            '/*'
          ],
        }
      }
    },

    clean: ['<%= paths.dist %>'],

  });

  config = grunt.config.get(['config']);

  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask( 'deploy', function(env) {
    grunt.config.set('selected_config.bucket', config[env].bucket);

    if(env === 'homolog') {
      grunt.task.run('s3');
      grunt.config.set('selected_config.distributionId', config[env].distributionId);
      grunt.task.run('cloudfront');
    }

    if(env === 'production') {
      grunt.task.run('s3');
      grunt.config.set('selected_config.distributionId', config[env].distributionId);
      grunt.task.run('cloudfront');
    }
  });

};

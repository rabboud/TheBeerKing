var path = require('path');

module.exports = (config) => {
    config.set({
        browsers: ['Chrome'],
        files: [
            'app/tests/**/*.spec.js'
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'app/tests/**/*.spec.js': ['webpack']
        },
        singleRun: false,
        colors : true,
        webpack: {
            resolve: {
                modulesDirectories: ['node_modules', '.']
            },
            module: {
                loaders: [{
                    test: /.js$/,
                    loader: 'babel?presets[]=es2015&presets[]=react',
                    include: [
                        path.resolve(__dirname, 'app')
                    ]
                }
            ]},
            watch: true
        },
        webpackMiddleware: {
            noInfo: true
        }
    });
};

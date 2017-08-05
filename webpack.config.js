var path = require('path');
var autoprefixer = require('autoprefixer');
var Spritesmith = require('webpack-spritesmith');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ENV = require('./_env.js');

const svgoConfig = JSON.stringify({
  plugins: [
    {removeTitle: true},
    {convertColors: {shorthex: false}},
    {convertPathData: false}
  ]
});

module.exports = {
    devtool: 'eval',
    devServer: {
        host: '0.0.0.0',
        port: 1337,
        colors: true,
        contentBase: 'public',
        historyApiFallback: true
    },
    entry: path.resolve(__dirname, 'app'),
    output: {
        path: 'public',
        filename: 'facelift.js'
    },
    eslint: {
        configFile: '.eslintrc'
    },
    postcss: function() {
        return [autoprefixer];
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            '.',
            'spritesmith-generated',
            'app/screens/Components'
        ]
    },
    plugins: [
        new Spritesmith({
            src: {
                cwd: path.resolve(__dirname, 'app/assets/images/sprite/'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'app/assets/images/sprite.png'),
                css: path.resolve(__dirname, 'app/screens/Components/style/trumps/_sprite.sass')
            },
            apiOptions: {
                cssImageRef: "/assets/images/sprite.png"
            }
        }),
        new ExtractTextPlugin('fa.css')
    ],
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel?presets[]=es2015&presets[]=react!eslint',
                include: [
                    path.resolve(__dirname, 'app')
                ]
            }, {
                test: /.s[a,c]ss$/,
                loader: 'style!css!postcss!sass',
            }, {
                test: /\.(jpe?g|png)$/i,
                loader: 'url?limit=10000'
            }, {
                test: /\.gif$/,
                loader: 'url?limit=10000&name=[name].[ext]'
            }, {
                test: /\.svg$/,
                loader: 'svg-inline!svgo?' + svgoConfig,
                exclude: path.resolve(__dirname, 'node_modules/')
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]',
                exclude: path.resolve(__dirname, 'node_modules/')
            }, {
                test: /\.json$/,
                loaders: ['json']
            }
        ]
    }
};

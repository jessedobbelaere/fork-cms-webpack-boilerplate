const webpack = require('webpack');
const exec = require('child_process').exec;
const glob = require('glob-all');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

module.exports = {
    output: {
        filename: '[name].[chunkhash].js', // Use hashed filenames based on changes, for long-term browser caching!
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', // Interprets @import and url() just like import/require statements and resolves them.
                    'postcss-loader', // Apply PostCSS plugins defined in postcss.config.js
                    'sass-loader', // Loads a sass file and compiles it to CSS
                ],
            },
            {
                test: /.*\.(gif|png|jpe?g|svg|gif|ico|cur)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: 'img/[name].[hash].[ext]',
                        },
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-mozjpeg')({}),
                                require('imagemin-optipng')({}),
                                require('imagemin-svgo')({}),
                            ],
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        // Lightweight CSS extraction plugin built on top of features available in Webpack v4 (performance!).
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),

        // PurgeCSS to keep the css size small by removing unused css.
        new PurgecssPlugin({
            // Specify the locations of any files you want to scan for class names.
            paths: glob.sync([
                path.join(__dirname, 'Core/Layout/Templates/**/*.twig'),
                path.join(__dirname, 'Core/Layout/Templates/**/*.html'),
                path.join(__dirname, 'Core/Js/**/*.js'),
                path.join(__dirname, 'Modules/*/Layout/Templates/**/*.twig'),
            ]),
            whitelistPatternsChildren: [/^content|^editor/],
            extractors: [
                {
                    extractor: TailwindExtractor,

                    // Specify the file extensions to include when scanning for
                    // class names.
                    extensions: ['html', 'twig', 'js', 'php'],
                },
            ],
        }),

        // Enable concatenation of the scope of modules into one closure for faster execution time (similar to Rollup "hoisting").
        // It enables the ability to concatenate the scope of all your modules into one closure and allow for your
        // code to have a faster execution time in the browser.
        new webpack.optimize.ModuleConcatenationPlugin(),

        // Anonymous Webpack plugin to copy css to the Core/Layout/Css/app.css location AFTER webpack finishes.
        // Make sure Fork CMS has a Core/Layout/Css/app.css file in the theme by copying the compiled app.*.css after compilation finishes.
        // This CSS file is used to load the theme styles in the backend in CKEditor.
        {
            apply: compiler => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', compilation => {
                    const commands = [
                        'echo "Copying dist/app.*.css to Core/Layout/Css/screen.css..."',
                        'mkdir -p Core/Layout/Css && cp dist/app.*.css Core/Layout/Css/screen.css',
                        '([ -e "Core/Layout/Css/screen.css" ] && echo "Finished copying dist/app.*.css to Core/Layout/Css/screen.css" || (echo "ERROR: Failed copying app.css" && exit 1))',
                    ].join(' && ');
                    exec(commands, (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            },
        },
    ],

    optimization: {
        splitChunks: {
            // Extract css into one css file
            cacheGroups: {
                // Extract all non-dynamic imported node_modules imports into a vendor file
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: /node_modules/,
                    enforce: true,
                },
                // Extract css into one css file
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
            }),
        ],
    },
};

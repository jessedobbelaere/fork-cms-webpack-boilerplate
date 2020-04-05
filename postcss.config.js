const purgecss = require('@fullhuman/postcss-purgecss')({
    // Specify the paths to all of the template files in your project
    content: [
        'Core/Layout/Templates/**/*.{twig,html}',
        'Core/Js/**/*.{js,jsx,ts,tsx}',
        'Modules/*/Layout/{Templates,Widgets}/**/*.{twig,html}',
    ],

    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],

    // https://github.com/FullHuman/purgecss-docs/blob/master/whitelisting.md
    // We add all selectors from antd that should not get forgotten, like the animation classes.
    // Also add the .content and .editor css classes we define to use in the Fork CMS editor styles.
    whitelistPatterns: [],
    whitelistPatternsChildren: [/^content|^editor/],
});


module.exports = {
    plugins: [
        // Tailwind as a PostCSS plugin
        require('tailwindcss'),

        // PostCSS plugin to unwrap nested rules like how Sass does it.
        require('postcss-nested'),

        // PostCSS Preset Env lets you convert modern CSS into something most browsers can understand,
        // determining the polyfills you need based on your targeted browsers or runtime environments.
        require('postcss-preset-env')({
            browserslist: ['last 2 versions', '> 5% in BE'],
        }),

        // PostCSS plugin to inline @import rules content
        require('postcss-import'),

        // Sass-like variables in CSS
        require('postcss-simple-vars'),

        // PurgeCSS to keep the css size small by removing all unused css.
        ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),

        // Minify CSS
        ...(process.env.NODE_ENV === 'production' ? [require('postcss-clean')({ level: 2 })] : []),
    ],
};

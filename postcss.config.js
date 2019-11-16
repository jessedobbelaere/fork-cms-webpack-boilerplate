module.exports = {
    plugins: [
        require('tailwindcss'),
        require('postcss-nested'),
        require('postcss-preset-env')({
            browserslist: ['last 2 versions', '> 5% in BE'],
        }),
        require('postcss-import'),
        require('postcss-simple-vars'),
        require('postcss-clean')({
            level: 2,
        }),
    ],
};

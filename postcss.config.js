module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {
            browsers: ["last 2 versions", "> 5%", "not ie < 11", "Safari >= 8"],
        },
        'cssnano': {
            autoprefixer: false
        }
    }
}

module.exports = {
    env: {
        es6: true,
        jest: true,
        browser: true
    },
    extends: [
        'omaha-prime-grade',
        'plugin:lit/recommended'
    ],
    parser: 'babel-eslint',
    plugins: [
        'lit'
    ],
    rules: {
        'compat/compat': 'off'
    }
};
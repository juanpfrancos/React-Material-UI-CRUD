const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        main: "./src/index.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "React Base Template",
            template: "./src/index.html",
            favicon: "./src/favicon.ico",
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
            },
        ]
    },

}
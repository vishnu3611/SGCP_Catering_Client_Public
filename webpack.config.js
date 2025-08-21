const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    // Other rules...
    plugins: [
        new NodePolyfillPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                        { from: 'src/data/products.json', to: 'data/products.json'  },
            ],
                
        })
    ]
}

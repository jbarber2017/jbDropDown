module.exports = {
    entry: "./main-with-styles.js",
    output: {
        path: __dirname + "/dist",
        library: ["jbDropDown"],
        libraryTarget: "umd",
        filename: "jbDropDown.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};
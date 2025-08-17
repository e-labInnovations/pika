const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

/**
 * @see https://stackoverflow.com/a/38132106/11409930
 * @see https://stackoverflow.com/a/45278943/11409930
 */

var indexConfig = Object.assign({}, defaultConfig, {
  name: "index",
  entry: {
    "main": "./backend-dev/main.js",
  },
  output: { 
    path: path.resolve(__dirname, "backend/admin/build"),
    filename: "[name].js",
  },
  plugins: [
    ...defaultConfig.plugins
  ],
});

module.exports = [defaultConfig, indexConfig];
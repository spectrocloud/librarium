module.exports = {
  plugins: ["macros"],
  presets: [
    require.resolve("@docusaurus/core/lib/babel/preset"),
    ["@babel/preset-env"],
    "@babel/preset-typescript",
  ],
};

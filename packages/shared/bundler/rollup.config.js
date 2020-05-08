import babel from "rollup-plugin-babel";
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
  external: "react",
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    postcss({
      plugins: [],
      minimize: true,
      sourceMap: 'inline',
    }),
    babel({
      presets: ["react-app"],
      plugins: [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties",
        "transform-react-remove-prop-types",
      ],
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    commonjs()
  ],
};

/**
 * Convert CommonJS modules to ES6,
 * so they can be includedin a Rollup bundle
 * SEE https://github.com/rollup/rollup-plugin-commonjs
 */
import commonjs from 'rollup-plugin-commonjs'

/**
 * Locate modules using the Node resolution algorithm,
 * for using third party modules in node_modules
 * SEE https://github.com/rollup/rollup-plugin-node-resolve
 */
import resolve from 'rollup-plugin-node-resolve'

/**
 * buble instead of babel(with babel-preset-env),
 * the latter is much more powerful, while the former is simpler
 */
import buble from 'rollup-plugin-buble'

const plugins = [
  resolve({
    jsnext: true,
    main: true,
    browser: true,
    extensions: ['.js', '.json']
  }),
  commonjs(),
  buble()
]

/**
 * Rollup: https://rollupjs.org/
 */
export default [
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
      strict: true
    },
    external: id => /^lodash/.test(id),
    plugins
  },
  {
    input: './src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'vCtrl',
      sourcemap: true,
      strict: true
    },
    plugins
  }
]

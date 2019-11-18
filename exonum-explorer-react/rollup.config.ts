import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// import tslint from 'rollup-plugin-tslint'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'

const pkg = require('./package.json')

const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes'
}

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: pkg.name, format: 'umd', sourcemap: true, globals },
    { file: pkg.module, format: 'cjs', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['react', 'react-dom', 'prop-types'],
  watch: {
    include: ['src/**']
  },
  plugins: [
    // tslint(),
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    resolve({ extensions: ['.ts', '.tsx'], browser: true, dedupe: ['axios'] }),
    commonjs()
  ]
}

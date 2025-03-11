import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        echarts: 'echarts'
      }
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        echarts: 'echarts'
      }
    }
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime', 'echarts'],
  plugins: [
    peerDepsExternal(),
    typescript(),
    resolve(),
    commonjs()
  ]
};

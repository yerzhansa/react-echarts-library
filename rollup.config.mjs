import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { dts } from "rollup-plugin-dts";

// Shared external dependencies
const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "echarts",
  "echarts/core",
  "echarts/charts",
  "echarts/components",
  "echarts/renderers",
];

// Shared globals for UMD/IIFE
const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  echarts: "echarts",
  "echarts/core": "echarts",
};

// Helper to create output config
const createOutput = (file, format) => ({
  file,
  format,
  sourcemap: true,
  exports: "named",
  globals,
  banner: '"use client";',
});

// Helper to create plugins for JS bundles (no declarations - dts handles those)
const createPlugins = () => [
  peerDepsExternal(),
  typescript({
    tsconfig: "./tsconfig.json",
    declaration: false,
    declarationMap: false,
    exclude: ["node_modules", "example", "**/*.stories.tsx", "**/*.spec.tsx", "__tests__/**"],
  }),
  resolve(),
  commonjs(),
];

const config = [
  // Main bundle (full ECharts)
  {
    input: "src/index.ts",
    output: [
      createOutput("dist/index.js", "cjs"),
      createOutput("dist/index.esm.js", "esm"),
    ],
    external,
    plugins: createPlugins(),
  },
  // Core bundle (tree-shakeable)
  {
    input: "src/core/index.ts",
    output: [
      createOutput("dist/core/index.js", "cjs"),
      createOutput("dist/core/index.esm.js", "esm"),
    ],
    external,
    plugins: createPlugins(),
  },
  // Type declarations - main
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
  // Type declarations - core
  {
    input: "src/core/index.ts",
    output: [{ file: "dist/core/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];

export default config;

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// Define external dependencies that shouldn't be bundled
const externalDeps = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@xyflow/react',
  '@monaco-editor/react',
  '@radix-ui/react-slot',
  'react-resizable-panels',
  'lucide-react',
  'js-yaml',
  'swr',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  /^@xyflow\/react/,
  /^@monaco-editor\/react/,
  /^@radix-ui\/react-/,
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
        interop: 'auto',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        interop: 'auto',
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      postcss({
        extract: true,
        modules: false,
        minimize: true,
        plugins: [
          require('@tailwindcss/postcss'),
          require('autoprefixer'),
        ],
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        rootDir: './src',
        exclude: ['**/*.test.*', '**/*.stories.*'],
      }),
    ],
    external: (id) => {
      // Handle external dependencies
      if (externalDeps.some(dep => 
        typeof dep === 'string' ? id === dep : dep.test(id)
      )) {
        return true;
      }
      
      // Handle Node.js built-ins
      if (id.startsWith('node:')) return true;
      
      return false;
    },
    onwarn(warning, warn) {
      // Suppress specific warnings
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/, /\.scss$/, /\.sass$/, /\.less$/],
  },
];

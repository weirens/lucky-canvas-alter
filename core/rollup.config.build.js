import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'
import alias from '@rollup/plugin-alias'
import virtual from '@rollup/plugin-virtual'
import pkg from './package.json'

// 路径别名配置
const pathAliases = {
  '../utils/polyfill': path.resolve(__dirname, './src/utils/polyfill.js')
}

export default [
  // 主构建配置
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.jsdelivr,
        format: 'umd',
        name: 'LuckyCanvas',
        sourcemap: false,
      },
    ],
    plugins: [
      alias({
        entries: Object.entries(pathAliases).map(([find, replacement]) => ({
          find,
          replacement
        }))
      }),
      ts({
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '../utils/polyfill': ['./src/utils/polyfill']
            }
          }
        },
        include: ['src/**/*'],
        exclude: ['node_modules']
      }),
      json(),
      resolve({
        extensions: ['.js', '.ts'],
        preferBuiltins: true
      }),
      commonjs(),
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts']
      }),
      terser()
    ]
  },
  
  // 类型声明构建配置
  {
    input: "dist/src/index.d.ts",
    output: [
      {
        file: "types/index.d.ts",
        format: "es"
      }
    ],
    plugins: [
      virtual({
        ...Object.fromEntries(
          Object.entries(pathAliases).map(([find]) => [
            find,
            'export default {}'
          ])
        )
      }),
      resolve({
        extensions: ['.d.ts', '.ts'],
        mainFields: ['types', 'typings']
      }),
      commonjs(),
      dts({
        compilerOptions: {
          baseUrl: '.',
          paths: {
            '../utils/polyfill': ['./src/utils/polyfill']
          },
          allowSyntheticDefaultImports: true
        }
      }),
      del({
        targets: ['dist/src'],
        hook: 'buildEnd'
      })
    ],
  }
]
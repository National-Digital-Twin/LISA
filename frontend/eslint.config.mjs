/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", "__dirname"] }] */

import globals from 'globals';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import tsEslint from 'typescript-eslint';
import reactRefresh from 'eslint-plugin-react-refresh';
import html from 'eslint-plugin-html';
import testingLibrary from 'eslint-plugin-testing-library';
import jest from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default tsEslint.config(
  js.configs.recommended,
  tsEslint.configs.recommended,
  {
    ignores: ['dev-dist/**', 'dist/**', 'qa/**']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...jest.environments.globals.globals
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: __dirname
      }
    },

    plugins: {
      'react-refresh': fixupPluginRules(reactRefresh),
      html: fixupPluginRules(html),
      react: fixupPluginRules(reactPlugin),
      import: fixupPluginRules(importPlugin)
    },

    settings: {
      'import/extensions': ['.mjs', '.js', '.jsx', '.ts', '.tsx'],

      'import/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
        }
      },
      react: {
        version: 'detect'
      }
    },

    rules: {
      indent: [
        'error',
        2,
        {
          SwitchCase: 1
        }
      ],

      'max-len': ['error', 180],

      'react-refresh/only-export-components': 'warn',
      'react/function-component-definition': 'off',

      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ],

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      'react/require-default-props': [
        'error',
        {
          functions: 'defaultArguments'
        }
      ],

      'comma-dangle': ['error', 'only-multiline'],

      'object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            consistent: true
          },

          ObjectPattern: {
            multiline: true
          },

          ImportDeclaration: {
            multiline: true
          },

          ExportDeclaration: {
            multiline: true
          }
        }
      ],

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          '': 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true
        }
      ],

      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\.svg\\?react$', 'react-map-gl']
        }
      ],

      'no-unused-vars': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'import/prefer-default-export': 'off'
    }
  },
  {
    files: ['**/__tests__/*.ts', '**/__tests__/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...jest.environments.globals.globals
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {}
    },

    extends: fixupConfigRules(
      compat.extends('plugin:testing-library/react', 'plugin:jest/recommended')
    ),

    plugins: {
      'testing-library': fixupPluginRules(testingLibrary),
      jest: fixupPluginRules(jest)
    },

    settings: {
      'import/extensions': ['.mjs', '.js', '.jsx', '.ts', '.tsx'],

      'import/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
        }
      }
    }
  }
);

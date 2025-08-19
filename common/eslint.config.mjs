/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", "__dirname"] }]*/

import globals from 'globals';
import tsEslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupPluginRules } from '@eslint/compat';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default tsEslint.config(js.configs.recommended, ...tsEslint.configs.recommended, {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    globals: {
      ...globals.browser
    },

    parser: tsEslint.parser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {}
  },

  extends: fixupPluginRules(compat.extends('prettier')),

  plugins: {
    import: fixupPluginRules(importPlugin)
  },

  settings: {
    'import/extensions': ['.mjs', '.js', '.jsx', '.ts', '.tsx'],

    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
      }
    }
  },

  rules: {
    indent: ['error', 2],
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
        ts: 'never'
      }
    ],

    'import/prefer-default-export': 'off',
    'no-unused-vars': 'off'
  }
});

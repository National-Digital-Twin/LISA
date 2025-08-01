/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", "__dirname"] }] */

import { fixupConfigRules } from '@eslint/compat';
import tsEslint from 'typescript-eslint';
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

export default tsEslint.config(js.configs.recommended, tsEslint.configs.recommended, {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    globals: {},
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {}
  },

  extends: fixupConfigRules(compat.extends('airbnb', 'prettier')),

  plugins: {},

  settings: {
    'import/extensions': ['.mjs', '.js', '.jsx', '.ts', '.tsx'],

    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.d.ts', '.tsx']
      }
    }
  },

  rules: {
    'no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': ['error', 180],
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
    'import/no-extraneous-dependencies': 'off',

    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: `
            for..in loops iterate over the entire prototype chain, which is virtually never what you want.
            Use Object.{keys,values,entries}, and iterate over the resulting array.
          `
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],

    'max-classes-per-file': 'off',
    'no-console': 'off'
  }
});

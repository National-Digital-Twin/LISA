module.exports = {
  env: { es2020: true },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: [],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx']
      }
    }
  },
  rules: {
    'no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    indent: ['error', 2],
    'max-len': ['error', 180],
    'comma-dangle': ['error', 'only-multiline'],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { consistent: true },
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true },
        ExportDeclaration: { multiline: true }
      }
    ],
    'import/extensions': ['error', 'ignorePackages', { '': 'never', ts: 'never' }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. ' +
          'Use Object.{keys,values,entries}, and iterate over the resulting array.'
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
};

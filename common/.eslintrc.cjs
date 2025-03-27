module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: [],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    indent: ['error', 2],
    'comma-dangle': ['error', 'only-multiline'],
    'object-curly-newline': ['error', {
      ObjectExpression: { consistent: true },
      ObjectPattern: { multiline: true },
      ImportDeclaration: { multiline: true },
      ExportDeclaration: { multiline: true }
    }],
    'import/extensions': ['error', 'ignorePackages', { '': 'never', ts: 'never' }],
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'off',
  }
};

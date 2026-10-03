import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/', 'coverage/'],
  },

  js.configs.recommended,

  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];

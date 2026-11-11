// Minimal flat ESLint config for CI lint gate (CICD-F-072).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'cypress/videos/**', 'cypress/screenshots/**'],
  },
  {
    files: ['**/*.{ts,js,mjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);

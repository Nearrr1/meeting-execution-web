import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  globalIgnores([
    '.next/**',
    'node_modules/**',
    '.yarn/**',
    'next-env.d.ts',
    'coverage/**',
  ]),
]);

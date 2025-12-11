import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Что игнорировать
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],

    // базовые рекомендации
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier, // ← самое главное: отключает конфликт ESLint и Prettier
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser, // нужен для TS
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      // Применяем Prettier как ошибку:
      'prettier/prettier': ['error'],

      // React Hooks стандарт
      ...reactHooks.configs.flat.recommended.rules,
    },
  },
])
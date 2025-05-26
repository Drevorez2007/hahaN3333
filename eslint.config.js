import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended, 

  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        jest: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,

      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off', 
      'react/prop-types': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  prettierConfig, 
];

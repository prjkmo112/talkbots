import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.ts"],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: {
      js,
      '@stylistic': stylistic,
    }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: {...globals.browser, ...globals.node},
      parserOptions: { projectService: true },
    } 
  },
  tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      'prefer-const': 'error',
      'linebreak-style': 'off',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'indent': ['error', 4, {
          SwitchCase: 1,
          ignoredNodes: [
              'ConditionalExpression',
              'ConditionalExpression > *'
          ]
      }],
      'require-jsdoc': 'off',
      'max-len': ["warn", {
          "code": 130, "tabWidth": 4,
          "ignoreComments": true,
          "ignoreUrls": true,
          "ignoreStrings": true,
          "ignoreRegExpLiterals": true,
          "ignorePattern": "`[^`]+`(?:\\);)?$"
      }],
      'quotes': 'off',
      'object-curly-spacing': ["warn", "always"],
      'eol-last': ["warn", "never"],
      'guard-for-in': 'off',
      'curly': ['warn', 'multi-or-nest'],
      'camelcase': ['warn', {
          "ignoreImports": true,
          "ignoreGlobals": true,
          "properties": "never"
      }],
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn'
    }
  }
]);

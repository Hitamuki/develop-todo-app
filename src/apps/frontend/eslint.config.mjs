import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import angular from 'angular-eslint';
import jsDoc from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginSecurity from 'eslint-plugin-security';
import eslintConfigPrettier from 'eslint-config-prettier';
// import importAccess from 'eslint-plugin-import-access; TODO: importの制限

export default tsEslint.config(
  {
    ignores: ['src/app/api/**'],
  },
  {
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,js}'],
    extends: [
      eslint.configs.recommended,
      ...tsEslint.configs.recommended,
      ...tsEslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      jsDoc.configs['flat/recommended-typescript'],
      importPlugin.flatConfigs.recommended,
      pluginSecurity.configs.recommended,
    ],
    plugins: {
      'unused-imports': unusedImports,
      '@typescript-eslint': tsEslint.plugin,
    },
    processor: angular.processInlineTemplates,
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // デフォルトルール
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // カスタムルール
      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#importorder-enforce-a-convention-in-module-import-order
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            // TODO: src/app/api/**の順番をカスタマイズ
            // {
            //   "pattern": "",
            //   "group": "",
            //   "position": ""
            // }
          ],
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'off', // TODO: @typescript-eslint/no-unused-varsと比較 https://github.com/sweepline/eslint-plugin-unused-imports
      'jsdoc/require-jsdoc': [
        'warn',
        {
          publicOnly: true,
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
          contexts: [
            'VariableDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSPropertySignature',
            'TSMethodSignature',
          ],
        },
      ],
      // TODO: jsdoc記載する
      // 'jsdoc/require-description': [
      //   'warn',
      //   {
      //     contexts: [
      //       'ArrowFunctionExpression',
      //       'ClassDeclaration',
      //       'ClassExpression',
      //       'FunctionDeclaration',
      //       'FunctionExpression',
      //       'MethodDefinition',
      //       'PropertyDefinition',
      //       'VariableDeclaration',
      //       'TSInterfaceDeclaration',
      //       'TSTypeAliasDeclaration',
      //       'TSPropertySignature',
      //       'TSMethodSignature',
      //     ],
      //   },
      // ],
      'jsdoc/require-returns': ['off'],
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  eslintConfigPrettier, // Prettierと競合するルールを無効化する 不要？ https://eslint.org/blog/2023/10/deprecating-formatting-rules/
);

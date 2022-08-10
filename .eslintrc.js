module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  overrides: [
    {
      files: ['*.component.ts', '*.page.ts'],
      extends: [
        'plugin:@angular-eslint/template/process-inline-templates',
      ]
    }, // *.component.ts, *.page.ts
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'airbnb-typescript/base',
        'plugin:prettier/recommended',
        'prettier',
      ],
      plugins: ['import'],
      settings: {
        'import/extensions': ['.js', '.ts'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.js', '.ts'],
        },
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts'],
          },
        },
      },
      rules: {
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'lines-between-class-members': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            'devDependencies': false,
            'optionalDependencies': false,
            'peerDependencies': false,
          },
        ],
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true,
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            'type': 'attribute',
            'prefix': 'app',
            'style': 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            'type': 'element',
            'prefix': 'app',
            'style': 'kebab-case'
          }
        ]
      }
    }, // *.ts
    {
      files: ['*.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended'
      ],
      rules: {}
    }, // *.html
    {
      files: ['src/**/*.spec.ts', 'src/**/*.d.ts'],
      parserOptions: {
        project: './src/tsconfig.spec.json',
      },
      extends: ['plugin:jasmine/recommended'],
      plugins: ['jasmine'],
      env: { jasmine: true },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }, // src/**/*.spec.ts, src/**/*.d.ts
  ]
}

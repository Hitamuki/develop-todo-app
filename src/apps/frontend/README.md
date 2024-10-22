# 画面

## フロントエンド（画面）

- Angular
  - RxJS
- TypeScript
- Scss
- ng-bootstrap
- VoltaでNode.jsバージョン管理
- pnpmでパッケージ管理
- jestで単体テスト
- Cypress,PlaywrightでE2Eテスト
- ESLint
- Prettier
- OpenAPI generatorでAPIスキーマ生成
- husky、 lint-staged
  - <https://qiita.com/akym03/items/7e4db720a9e1bfad7747>

## パッケージ管理

- Volta 経由で pnpm を管理
- <https://pnpm.io/ja/motivation>

``` bash
volta install pnpm
pnpm store prune # キャッシュをクリア
pnpm install
npx pnpm --version
pnpm list
pnpm add <pkg>
pnpm remove <pkg>
```

## 自動生成README

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

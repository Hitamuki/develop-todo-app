# ToDoアプリケーション

## 技術構成

### フロントエンド

| カテゴリ           | 使用技術        | 備考                                                                                                                            |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 開発対象           | Web画面         |                                                                                                                                 |
| ランタイム         | Node.js 22.15.0 | [サポート期間](https://nodejs.org/ja/about/previous-releases)                                                                   |
| パッケージ管理     | yarn 4.1.1      | [サポート期間](https://endoflife.date/yarn)                                                                                     |
| プログラミング言語 | TypeScript      |                                                                                                                                 |
| フレームワーク     | Angular 19      | [サポート期間](https://angular.jp/reference/releases)<br>レンダリング方式：CSR（SPA）<br>フォーム方式：テンプレート駆動フォーム |

### バックエンド

| カテゴリ             | 使用技術     | 備考                                                                                   |
| -------------------- | ------------ | -------------------------------------------------------------------------------------- |
| 開発対象             | Web API      | API方式：RESTful API<br>スキーマ仕様：OpenAPI                                          |
| ランタイム/SDK       | .NET 8       | [サポート期間](https://dotnet.microsoft.com/ja-jp/platform/support/policy/dotnet-core) |
| プログラミング言語   | C#           |                                                                                        |
| フレームワーク       | ASP.NET Core |                                                                                        |
| テストフレームワーク | xUnit        |                                                                                        |
| パッケージ管理       | NuGet        |                                                                                        |
| CLIツール            | .NET CLI     |                                                                                        |

### データベース

| カテゴリ | 使用技術 | 備考                                         |
| -------- | -------- | -------------------------------------------- |
| DB       | MySQL 8  | [サポート期間](https://endoflife.date/mysql) |

## README

- ドキュメント
  - [README](docs/README.md)

- フロントエンド（Web画面）
  - [README](src/apps/frontend/README.md)

- バックエンド（Web API）
  - [README](src/apps/backend/README.md)

- バッチ処理
  - [README](src/batchs/README.md)

- 共通パッケージ、ライブラリ
  - [README](src/libs/README.md)

- スクリプト
  - [README](src/scripts/README.md)

- ツール
  - [README](src/tools/README.md)

## 参考

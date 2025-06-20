# ToDoアプリケーション

## 概要

ログイン機能がある単純なToDoアプリです。

## 技術構成

### フロントエンド

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?logo=typescript&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-red.svg?logo=angular&logoColor=black)
![Yarn](https://img.shields.io/badge/yarn-black.svg?logo=yarn)

| カテゴリ           | 使用技術        | 備考                                                                                                                            |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 開発対象           | -               | Web画面                                                                                                                         |
| ランタイム         | Node.js 22.15.0 | [サポート期間](https://nodejs.org/ja/about/previous-releases)                                                                   |
| パッケージ管理     | yarn 4.1.1      | [サポート期間](https://endoflife.date/yarn)                                                                                     |
| プログラミング言語 | TypeScript      |                                                                                                                                 |
| フレームワーク     | Angular 19      | [サポート期間](https://angular.jp/reference/releases)<br>レンダリング方式：CSR（SPA）<br>フォーム方式：テンプレート駆動フォーム |

### バックエンド

![C#](https://img.shields.io/badge/C%23-512BD4?logo=dotnet)

| カテゴリ             | 使用技術     | 備考                                                                                   |
| -------------------- | ------------ | -------------------------------------------------------------------------------------- |
| 開発対象             | -            | Web API<br>API方式：RESTful API<br>スキーマ仕様：OpenAPI                               |
| ランタイム/SDK       | .NET 8       | [サポート期間](https://dotnet.microsoft.com/ja-jp/platform/support/policy/dotnet-core) |
| プログラミング言語   | C#           |                                                                                        |
| フレームワーク       | ASP.NET Core |                                                                                        |
| テストフレームワーク | xUnit        |                                                                                        |
| パッケージ管理       | NuGet        |                                                                                        |
| CLIツール            | .NET CLI     |                                                                                        |

### ミドルウェア

![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg?logo=mysql&logoColor=white)
![DBeaver](https://img.shields.io/badge/DBeaver-brown.svg?logo=dbeaver)

| カテゴリ       | 使用技術 | 備考                                         |
| -------------- | -------- | -------------------------------------------- |
| DB             | MySQL 8  | [サポート期間](https://endoflife.date/mysql) |
| DBクライアント | DBeaver  |                                              |
| ローカルDB     | Docker   |                                              |

### インフラ

| カテゴリ | 使用技術 | 備考 |
| -------- | -------- | ---- |
|          |          |      |

### AIツール

| カテゴリ               | 使用技術                        | 備考 |
| ---------------------- | ------------------------------- | ---- |
| SWE                    | Google Jules                    |      |
| PRレビュー             | Gemini Code Assist              |      |
| エージェント(エディタ) | Roo Code                        |      |
| エージェント(CLI)      | Amazon Q Developer、Claude Code |      |
| コードアシスタント     | GitHub Copilot                  |      |
| MCPサーバー            | GitHub                          |      |

### その他

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC.svg?logo=visual-studio-code)

| カテゴリ | 使用技術           | 備考 |
| -------- | ------------------ | ---- |
| エディタ | Visual Studio Code |      |
| 開発環境 | Dev Container      |      |

## README

- [ドキュメント](docs/README.md)
- [フロントエンド（Web画面）](src/apps/frontend/README.md)
- [バックエンド（Web API）](src/apps/backend/README.md)
- [バッチ処理](src/batchs/README.md)
- [共通パッケージ、ライブラリ](src/libs/README.md)
- [スクリプト](src/scripts/README.md)
- [ツール](src/tools/README.md)

# WebAPI

## バックエンド（Web API）

- C#(.NET8.0、ASP.NET Core)
  - ホットリロード
  - デザインパターン
    - Abstract Factory
    - Adapter
    - Builder
    - Factory
    - Composite
    - Command
    - Iterator
    - Observer
    - State
    - Strategy
- OpenAPI Specificationのopenapi.ymlを生成
- MySQL操作
  - Entity Framework Core
  - (Dapper)
- 単体テスト
  - xUnit
  - (MSTest)
  - Moq
- フォーマッタ
  - dotnet-format
  - (csharpier)
- 静的解析
  - StyleCop.Analyzers
- コード分析
  - CodeAnalysisRuleSet
    - Nugetで配布
- コードメトリクス、サイクロマティック複雑度
  - Microsoft.CodeAnalysis.Metrics
- コードパフォーマンス計測
- プロファイラー（CPU、メモリ使用率などの計測）
- DDDを取り入れたアーキテクチャ
- パッケージ、ツール
  - dotnet-reportgenerator-globaltool 単体テストのコードカバレッジ
  - FluentValidation APIの入力検証
  - ログ
    - NLog
    - (Serilog)
    - (log4net)
※バックエンドの共通メソッドを管理するNugetパッケージを作成

## メモ

<https://learn.microsoft.com/ja-jp/aspnet/core/web-api/?view=aspnetcore-8.0>
<https://learn.microsoft.com/ja-jp/aspnet/core/tutorials/getting-started-with-nswag?view=aspnetcore-8.0&tabs=visual-studio-code>

dotnet add package Microsoft.EntityFrameworkCore.InMemory

memo.mdを作成し、参考にURLなどを記載

## コマンド

フォーマット TODO: shファイルで実行

```bash
# OpenAPIGeneratorとEFCoreのスキャフォールディングは対象外
dotnet format style --exclude ./src/OpenApiGenerator ./src/ToDoApp.Infrastructure/EFCoreGenerator
```

MySQLコンテナのIPアドレスを確認
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' todo_db

HTTPS 開発証明書 ※初回のみ

```bash
dotnet dev-certs https --trust
```

## DB設定

- 「…develop-todo-app/src/apps/backend」で「docker compose up -d」
- DBeaver接続
  - 「Public Key Retrieval is not allowed」が出たら「allowPublicKeyRetrieval=true」
- DBeaverでER図表示
  - テーブル右クリック
  - View Diagram
- DBeaverからDDLを生成
  - 全テーブルを選択
  - SQLの生成
  - DDL
- DB定義更新
  - docker-compose down --volumes --rmi all --remove-orphans

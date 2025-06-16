# WebAPI

## 注意点、反省点

- 作りが微妙
  - AIエージェントでコーディング、「TODO:」コメントで後回しにしたことで、依存関係の問題を放置したまま進めて、手戻りが増えた
    - プレゼンテーション層でドメイン層を参照したまま放置してしまった
- レイヤードアーキテクチャで作る場合、コードファーストの方がシンプルに作れたはず
  - OpenAPI Generator、EF Coreのスキャフォールディングは初期構築の段階では便利に感じたが、柔軟性が無いことや、整合性を保つためのマッピング処理が冗長
  - レイヤー分けに悩む（最初OpenAPI Generatorで生成されたコードをプレゼンテーション層に紐付けてしまった。DDD原則違反。現在はアプリケーション層に紐づけているが、インフラ層が適切だったかも）
- ToDoアプリのタスクを表す「Task」は予約語と被っていて、名前空間指定が必要になり、コードの可読性が下がった
  - →Reserved Word チェックをすると良いらしい？

## 概要

- OpenAPI Generatorを活用したスキーマファーストのスキーマ駆動開発（コードファーストではないので、openapi.ymlの編集が必要）を採用
  - Generation GapパターンでControllerクラスを実装
- EFCoreのスキャフォールディングを活用したデータベースファースト（コードファーストのマイグレーションは実施しない）を採用

## コマンド

よく使う

```bash
dotnet --version
dotnet --list-sdks
dotnet --info
dotnet restore
dotnet clean
dotnet build
dotnet test
dotnet run
```

フォーマット TODO: shファイルで実行

```bash
# OpenAPIGeneratorとEFCoreのスキャフォールディングは対象外
dotnet format style --exclude ./src/OpenApiGenerator ./src/ToDoApp.Infrastructure/EFCoreGenerator
# お任せのフォーマット
dotnet format --exclude ./src/OpenApiGenerator ./src/ToDoApp.Infrastructure/EFCoreGenerator --severity info
```

MySQLコンテナのIPアドレスを確認
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' todo_db

HTTPS 開発証明書 ※初回のみ

```bash
dotnet dev-certs https --trust
```

NuGetパッケージの更新状況をチェック

```bash
dotnet outdated
# マイナーバージョンに制限してアップグレード
dotnet outdated -u --version-lock Minor src/ToDoApp.Application
dotnet outdated -u --version-lock Minor src/ToDoApp.Domain
dotnet outdated -u --version-lock Minor src/ToDoApp.Infrastructure
dotnet outdated -u --version-lock Minor src/ToDoApp.Presentation
dotnet outdated -u tests/ToDoApp.Tests
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

    ```bash
    docker-compose down --volumes --rmi all --remove-orphans
    docker-compose up -d
   ```

## Todo

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

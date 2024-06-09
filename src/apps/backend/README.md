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
  - Dapper
- 単体テスト
  - xUnit
  - MSTest
  - Moq
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
  - Serilog、NLog、log4net ログ
※バックエンドの共通メソッドを管理するNugetパッケージを作成

## メモ

<https://learn.microsoft.com/ja-jp/aspnet/core/web-api/?view=aspnetcore-8.0>
<https://learn.microsoft.com/ja-jp/aspnet/core/tutorials/getting-started-with-nswag?view=aspnetcore-8.0&tabs=visual-studio-code>

dotnet add package Microsoft.EntityFrameworkCore.InMemory
HTTPS 開発証明書
  dotnet dev-certs https --trust

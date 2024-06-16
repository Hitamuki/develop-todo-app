# Todoアプリのテスト

## 単体テスト

- xUnit
<https://learn.microsoft.com/ja-jp/dotnet/core/testing/unit-testing-with-dotnet-test>

## 用語

- スタブ
- モック

## UnitTests

### 概要_UnitTests

- ドメイン層とアプリケーション層のビジネスロジックをテストする。
ここでは、小さな単位でコードの振る舞いを検証する。

## IntegrationTests

### 概要_IntegrationTests

- インフラ層のコンポーネントが正しく連携して機能するかを検証する。
データベースや外部サービスとの接続をテストする。

## FunctionTests

### 概要_FunctionTests

- システム全体が要件を満たしているかをエンドツーエンドでテストする。
主にプレゼンテーション層で実施するが、全層を通じてシナリオを実行する。

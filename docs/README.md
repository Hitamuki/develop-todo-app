# ドキュメント

## コマンド

- backendのOpenApiGeneratorを生成する（スキーマファースト）
  - slnやcsprojを再生成しないため、「 --skip-overwrite」オプションを付けている
  - 差分更新がある場合、「OpenApiGenerator/src/Org.OpenAPITools/Controllers」、「src/OpenApiGenerator/src/Org.OpenAPITools/Models」フォルダを削除する
  - コードファーストのほうが良かったかも...

``` bash
docker compose up
```

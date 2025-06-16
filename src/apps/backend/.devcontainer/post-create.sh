#!/bin/bash

# NuGetパッケージの依存関係を復元
dotnet restore
# ローカルツールマニフェストファイルに設定の.NETツールをインストール
dotnet tool restore
# ローカル開発用の HTTPS 開発証明書を生成
dotnet dev-certs https --trust

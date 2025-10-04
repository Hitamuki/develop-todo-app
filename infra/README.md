# インフラ

## 概要

Infrastructure as Code (IaC) を活用し、Terraform によってAWS上にWebアプリを構築・デプロイする

## 目的

手作業のインフラ構築を排除し、コードによる一貫性・再現性・自動化を実現することで、運用コストの削減・信頼性向上・スケーラビリティ対応を目指す

## ドキュメント

| 名称                                                        | 概要                               | 備考 |
| ----------------------------------------------------------- | ---------------------------------- | ---- |
| [AWS](https://docs.aws.amazon.com/ja_jp/)                   | クラウドコンピューティングサービス |      |
| [Terraform](https://developer.hashicorp.com/terraform/docs) | IaC                                |      |
|                                                             |                                    |      |

## システム構成

| レイヤー | 技術                | 説明                               |
| -------- | ------------------- | ---------------------------------- |
| Web画面  | Angular v19         | S3 + CloudFront で静的ホスティング |
| Web API  | ASP.NET Core(.NET8) | ECS (Fargate)                      |
| DB       | MySQL 8             | Aurora                             |

## AWSサービス

| カテゴリ         | AWSサービス         | 役割                                                                                   |
| ---------------- | ------------------- | -------------------------------------------------------------------------------------- |
| ネットワーク基盤 | VPC                 | AWS内の自分専用ネットワーク空間（他人のリソースと隔離）                                |
|                  | サブネット          | VPC内の区画。ALBやECSなどの配置先。セキュリティや用途でパブリック/プライベートに分ける |
| DNS              | Route53             | 独自ドメインのルーティング                                                             |
| セキュリティ     | WAF                 | ファイアウォール                                                                       |
|                  | IAM                 | ロール・ポリシーでアクセス制御（ECSやS3、SSMなどへのアクセスを制御）                   |
| 配信/CDN         | S3, CloudFront      | Angular SPAの静的ホスティング＋高速CDN配信                                             |
| API公開          | ALB                 | APIエントリポイント。ECSへのトラフィックをルーティング                                 |
|                  | ECS on Fargate      | APIのロードバランスとコンテナ実行                                                      |
| コンテナ管理     | ECR                 | APIのDockerイメージを格納し、ECSで実行するためのレジストリ                             |
| データベース     | Aurora MySQL        | 高可用性のMySQL互換RDB。スケーラブルかつバックアップ自動化                             |
| パラメータ管理   | SSM Parameter Store | 環境変数・シークレット管理                                                             |
| モニタリング     | CloudWatch Logs     | APIやアプリのログを収集・可視化。トラブルシュートや監視に使用                          |

## 環境構築手順

### Terraform導入

``` bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
brew update
brew upgrade hashicorp/tap/terraform
terraform version
```

### AWS設定

1. AWSアカウント作成
2. IAMユーザー作成
   - 「AdministratorAccess」を持つユーザーグループ作成
   - 管理者権限を持つIAMユーザー作成
   - アクセスキー作成
3. AWS CLI設定

    ``` bash
    brew install awscli
    aws --version
    aws configure
    ```

### Terraform & AWS準備

1. tfファイル作成
1. AWS SSMに環境変数・シークレットを保存

    ``` bash
    aws ssm put-parameter --name "/todo-app/prod/db_password" --value "<値>" --type "SecureString"
    aws ssm put-parameter --name "/todo-app/prod/Jwt__Secret" --value "<値>" --type "SecureString"
    aws ssm put-parameter --name "/todo-app/prod/Jwt__Issuer" --value "<値>" --type "String"
    aws ssm put-parameter --name "/todo-app/prod/Jwt__Audience" --value "<値>" --type "String"
    aws ssm put-parameter --name "/todo-app/prod/Cors__AllowedOrigins" --value "<値>" --type "String"
    aws ssm put-parameter --name "/todo-app/prod/Logging__LogLevel__Default" --value "<値>" --type "String"
    aws ssm put-parameter --name "/todo-app/prod/Logging__LogLevel__Microsoft_AspNetCore" --value "<値>" --type "String"
    ```

1. ECRリポジトリ作成
1. Dockerイメージをビルド

    ``` bash
    # ルートディレクトリで実行
    docker build -t todo-app-backend:local -f src/apps/backend/Dockerfile .
    # 動作確認
    docker run -p 8080:8080 todo-app-backend:local
    ```

1. ビルドしたイメージをECRにプッシュ

    ``` bash
    # DockerがECRにアクセスできるように認証情報を取得する
    aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin (AWSアカウントID).dkr.ecr.ap-northeast-1.amazonaws.com
    # ローカルにビルドしたイメージに、ECRリポジトリのURIを別名としてタグ付け
    docker push $(terraform output -raw ecr_repository_url):latest
    ```

### 構築

``` bash
# 初期化
terraform init
# 実行計画の確認
terraform plan
# 構築
terraform apply
# 削除
terraform destroy
```

## メモ

- Terraformでインフラ構築
  - ローカル環境で技術検証＆学習（HCL構文）
  - リントやフォーマット
  - Terragrunt、tflint、terraform-docs
- CI/CD構築
  - GitHub ActionsでAWSにデプロイ

## 参考

<https://zenn.dev/oyasumipants/articles/6f8c03380d7171>

## 補足情報

- CloudFormationやAWS Cloud Development Kit (AWS CDK) 、AWS Copilot CLIからもコードでインフラ環境を構築できる

# ToDo

## 開発習慣

- ngコマンド活用
- Emmet活用

## 問題

- モーダル画面のAngular Materialの日付ピッカーが表示されない
- リロードによる描画の遅延によりちらつきが気になる
  - おそらくウィンドウのリロードをしているから
- デバッグ時にブレークポイントを置くと画面の読み込みが進まない
- environment.tsでVSCodeのデバッグとdotnet runのポートが変わるので切り替えできるようにする

## 実装

- 必須項目未入力時にエラーメッセージ表示、ボタン非活性
- 登録・更新・削除時にトースターメッセージ表示
- カテゴリをドロップダウンで切り替え(ng-select)
- WebAPIのレスポンスに対してのコントローラー作成
- UI修正
  - 一覧のデザイン
- ルーティング
- tsconfig.jsonのstrictをtrueにして@deprecatedをマークしたい
- package.json詳細化(description、private、author、license、resolutions、overrides)
- gitignore見直し
- cspell整理
- 単体テストコード(Jest、TestingLibraryでファンクションとコンポーネントのユニットテスト)
- jsDoc設定（ESLintのコメントを外す、privateメソッドにも）
- Sassのパーシャルファイル
  - bootstrap、ng-bootstrap、Angular Material
  - 組み込みモジュール
  - index、component、page
- Angular Material（tree、list）使う
  - <https://qiita.com/shida_h/items/e58872bd4501260c07e2>
- DDDのフォルダ構成に変更
  - <https://kasaharu.hatenablog.com/entry/20230301/1677622695>
  - その他共通処理など区分け

## Angular

- テンプレート駆動フォームからリアクティブフォーム
- NgRXやSignalsを活用して状態管理
- DIコンテナ
- ルーティング
- provider
  - guard
  - resolver
  - interceptor
- assets
- カスタムフォームコントロール
- コンテンツ投影
- ダイナミックコンポーネント
- schematicsの活用とカスタマイズ

## パッケージ

- npm-run-allですべてのlintとformat同時実行
- auditでパッケージの脆弱性チェック
- npm-check-updateで手軽にすべてのパッケージのバージョン確認
- license-checkerでライセンスチェック
- es-toolkit
- fakerjsでモックの値作成
- ag-grid
- ng-select
- ngx-translate
- ngx-toastr

## ツール系

- Vercelにデプロイ
- husky、lint-stage
- biomeの設定<https://tech.bitbank.cc/biome-js/>
- OpenAPI Generatorとchokidar<https://tech.smarthr.jp/entry/2020/08/25/135631>
- OpenAPIとPrismでモックサーバー<https://zenn.dev/horitaka/articles/openapi-prism-mock-server>
  - msw
  - Prism
- yarnのPlug’n’Play（PnP）に移行するか検討
- Docker環境構築 or devcontainer
- lighthouse
- Angular Dev Tools
- Volta
- Jest(いつかVitest試したい)
- Testing Library
- Cypress(※ いつかPlaywright試したい)
- Storybook

## 機能

- モーダル画面（新規登録、編集）
- トースターメッセージ
- 検索
- 並び替え
- アプリのアイコン作成
- ドラッグアンドドロップ
- ヘッダー、フッター、サイドバー
- アクセシビリティ
  - 国際化
  - マルチデバイス対応
  - レスポンシブデザイン
  - マテリアルデザイン
- 設定
  - テーマ
- ヘルプ・FAQ
- PWA
- 外部API
- ログイン画面
  - 認証/認可
  - 個人情報保護方針、利用規約
- 広告
- サブスクリプション
  - 解約

## 知識

- アトミックデザイン
- HTML セマンティック
- Modular Architecture
- feature driven architecture
- CSS設計ルール
  - BEM
  - SMACSS

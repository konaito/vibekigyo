# プロジェクトルール

## ビルドシステム
- このプロジェクトはBunをJavaScriptランタイムおよびパッケージマネージャーとして使用
- `npm`や`yarn`の代わりに`bun`コマンドを使用すること
- 例: `bun install`, `bun run dev`, `bun test`など
- 重要: `bun run dev`は実行しない - ユーザーが常に自分で実行する
- 重要: ビルド/テストコマンドを実行する前に必ず`cd frontend`でfrontendディレクトリに移動すること

## Gitワークフロー
- 新しい作業には常にfeatureブランチを作成
- `feature/feature-name`のような説明的なブランチ名を使用
- mainブランチに直接pushしない
- すべての変更にプルリクエストを作成

## Push Workflow
When user says "push", follow this complete workflow:
1. Run `bun run build` to verify the code compiles without errors
2. Create a new feature branch with descriptive name
3. Stage and commit all changes with meaningful commit message
4. Push the branch to remote
5. Create a pull request using `gh pr create`
6. **プルリクエスト確認**: `open <PR_URL>`コマンドでブラウザでプルリクエストを開く

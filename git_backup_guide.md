# Gitバックアップ手順

## 初期設定（1回だけ）

```bash
# Git初期化
git init

# ユーザー設定（未設定の場合）
git config user.email "your@email.com"
git config user.name "Your Name"
```

## 毎回の保存手順

```bash
# 変更を確認
git status

# ファイルを追加
git add Metroidpro_code.html

# コミット（保存）
git commit -m "YYYY-MM-DD: 正常動作版 - 変更内容メモ"
```

## バックアップ名付きタグ（重要ポイント）

```bash
# 動作確認済み版にタグ付け
git tag -a v1.0_working -m "2025/04/16 17:27 正常動作確認済"

# 一覧表示
git tag

# 特定バージョンに戻す
git checkout v1.0_working
```

## 破損時の復元

```bash
# 最新の正常版に戻す
git checkout HEAD -- Metroidpro_code.html

# または特定コミットに戻す
git log --oneline  # コミットID確認
git checkout <コミットID> -- Metroidpro_code.html
```

## GitHub連携（永久保存）

```bash
# GitHubにプッシュ
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
git push origin --tags  # タグも送信
```

---

## 推奨ワークフロー

1. **動作確認したら即コミット**
2. **AIに変更依頼する前に必ずコミット**
3. **破損したら即座に戻す**

## ファイル命名規則（手動バックアップ用）

| パターン | 用途 |
|---------|------|
| `Metroidpro_code_BACKUP_YYYYMMDD_HHMM.html` | 時刻付きバックアップ |
| `Metroidpro_code_v1.0_working.html` | バージョン付き |
| `Metroidpro_code_BEFORE_AI_EDIT.html` | AI編集前 |
| `Metroidpro_code_stable.html` | 最新安定版 |

---

## VSCode Local History活用

VSCode標準機能で自動保存される：
- `Ctrl+Shift+P` → 「Local History: ファイル履歴を表示」
- 過去のバージョンに比較・復元可能

# Gitタグ使い方まとめ

## 基本コマンド

| コマンド | 用途 |
|---------|------|
| `git tag` | タグ一覧表示 |
| `git tag v_name -m "メモ"` | 新規タグ作成 |
| `git tag -d v_name` | ローカルタグ削除 |
| `git push origin --tags` | タグをGitHubに送信 |

---

## バックアップフロー（推奨）

### 1. 動作確認したら即タグ付け
```bash
git tag v_working -m "正常動作版"
```

### 2. AI編集前に保存
```bash
git tag v_before_ai -m "AI編集前"
```

### 3. 壊れたら即復元
```bash
git checkout v_working -- Metroidpro_code.html
```

---

## 実例（今日の流れ）

```bash
# 1. タグ作成
git tag v_working -m "正常動作版"

# 2. GitHubに送信
git push origin --tags

# 3. テスト用タグも作成
git tag v_test -m "テスト用"

# 4. 一覧確認
git tag
# → v_working
# → v_test

# 5. 壊れたら復元
git checkout v_working -- Metroidpro_code.html
```

---

## タグ命名ルール

| パターン | 用途 |
|---------|------|
| `v_working` | 安定版 |
| `v_before_ai` | AI編集前 |
| `v_test` | テスト用 |
| `v_YYYYMMDD` | 日付付き |

---

## 復元手順

```bash
# mainに戻る
git switch main

# ファイル復元（タグから）
git checkout v_working -- Metroidpro_code.html

# 確認
git status
```

---

## 注意点

- **タグは複数作れる**（いくらでもOK）
- **復元は上書き**になる（注意）
- **GitHubにプッシュ**すると永久保存
- **ローカルだけ**なら削除可能

---

## 最短手順

```bash
# 保存
git tag v_ok -m "OK"

# 復元
git checkout v_ok -- Metroidpro_code.html
```

# JavaScript セキュリティ セットアップガイド

このガイドは VSCode で JavaScript プロジェクトのセキュリティを簡単に設定するための簡単な接続ガイドです。

## 簡単な設定

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境の設定
```bash
# 例示環境ファイルのコピー
cp .env.example .env

# .env を実際の値で編集
# .env をバージョン管理にコミットしないように
```

### 3. 開発コマンド
```bash
# 開発サーバーの起動
npm run dev

# ゲーム開発サーバーの起動
npm run game

# セキュリティ監査の実行
npm run security:audit

# セキュリティ問題の修正
npm run security:fix

# 生産用のビルド
npm run build
```

## 実装されたセキュリティ機能

### 1. 環境変数の管理
- **`.env.example`**: 環境変数のテンプレート
- **`.gitignore`**: 監視するファイルをコミットから防止
- **`dotenv`**: 安全な環境変数のロード

### 2. ESLint セキュリティルール
- **セキュリティプラグイン**: よくあるセキュリティ脆弱性の検出
- **インポートルール**: 不安全なモジュールインポートを防止
- **ベストプラクティス**: 安全なコーディング基準の実行

### 3. コンテンツセキュリティポリシー (CSP)
- **HTML メタタグ**: 静的ファイル用の CSP ヘッダー
- **Express ミドルウェア**: サーバーサイド CSP 実装
- **厳格ポリシー**: XSS とインジェクション攻撃の防止

### 4. ビルドセキュリティ
- **Webpack 生産モード**: コードの最適化とミニファイ
- **デバッグコードの削除**: 開発用だけのコードの排除
- **ソースマップ**: 生産で無効

### 5. VSCode 設定
- **セキュリティ設定**: 信頼されるワークスペースの設定
- **ファイル除外**: エディタから監視するファイルを隠す
- **オートリント**: 保存時のセキュリティ問題の修正

## セキュリティベストプラクティス

### 環境変数
```javascript
// 環境変数のロード
require('dotenv').config();

// 環境変数の使用
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// 秘密をハードコードしない
// 悪い: const apiKey = "sk-1234567890abcdef";
// 良い: const apiKey = process.env.API_KEY;
```

### 入力の検証
```javascript
// ユーザー入力の検証
function validateInput(input) {
    if (!input || typeof input !== 'string') {
        throw new Error('無効な入力');
    }
    
    if (input.length > 1000) {
        throw new Error('入力が長すぎる');
    }
    
    // 入力のサニタイズ
    return input.replace(/[<>]/g, '');
}

// innerHTML の代わりに textContent を使用
// 悪い: element.innerHTML = userInput;
// 良い: element.textContent = userInput;
```

### 安全な API コール
```javascript
async function secureApiCall(endpoint, data) {
    const response = await fetch(`${process.env.API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('API コールが失敗しました');
    }
    
    return response.json();
}
```

### CSP 設定
```javascript
// Express.js CSP ミドルウェア
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.example.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    }
}));
```

## セキュリティチェックリスト

### 開発
- [ ] 環境変数が適切に設定されている
- [ ] `.env` が `.gitignore` に入る
- [ ] ESLint セキュリティルールが有効
- [ ] コードにハードコードされた秘密がない
- [ ] 入力の検証が実装されている

### 生産
- [ ] CSP ヘッダーが設定されている
- [ ] デバッグコードが削除されている
- [ ] ソースマップが無効
- [ ] セキュリティヘッダーが設定されている
- [ ] 依存関係が監査されている

### 定期の点検
- [ ] `npm audit` を定期的に実行
- [ ] 依存関係をよくアップデート
- [ ] セキュリティログを資料
- [ ] 脆弱性を監視

## ファイル構成
```
プロジェクト/
|
|-- .env.example              # 環境変数のテンプレート
|-- .env                      # 実際の環境変数 (コミットしない)
|-- .gitignore                # Git 無視ルール
|-- .eslintrc.json           # ESLint セキュリティ設定
|-- package.json             # 依存関係とスクリプト
|-- webpack.config.js         # ビルド設定
|-- express-csp-middleware.js # Express セキュリティミドルウェア
|-- csp-example.html         # CSP 実装の例
|-- vscode-settings.json     # VSCode セキュリティ設定
|-- SECURITY_SETUP.md        # 英語ガイド
|-- SECURITY_USAGE_JAPANESE.md # この日本語ガイド
|-- test-security.html       # セキュリティテストページ
|
|-- Metroidpro_code.html     # メイングームファイル
|-- src/                     # ソースコード
|-- dist/                    # ビルド出力
|-- node_modules/            # 依存関係
```

## ゲーム開発とセキュリティの統合

### 開発時のセキュリティチェック
```bash
# 1. セキュリティテストを実行
npm run security:test

# 2. ゲームを起動
npm run game

# 3. セキュリティ監査
npm run security:audit
```

### 製品用ビルド
```bash
# セキュアなビルド
npm run build:secure

# すべてのセキュリティチェックを通過
npm run security:full
```

## 回避すべきよくあるセキュリティ問題

### 1. ハードコードされた秘密
```javascript
// 避ける
const apiKey = "sk-1234567890abcdef";

// 使用
const apiKey = process.env.API_KEY;
```

### 2. XSS 脆弱性
```javascript
// 避ける
element.innerHTML = userInput;

// 使用
element.textContent = userInput;
```

### 3. 不安全な Eval の使用
```javascript
// 避ける
eval(userInput);

// 使用
JSON.parse(userInput); // 検証とともに
```

### 4. 入力検証の欠如
```javascript
// 避ける
app.post('/data', (req, res) => {
    const data = req.body.data; // 検証なし
});

// 使用
app.post('/data', (req, res) => {
    const data = validateInput(req.body.data);
});
```

## リソース

- [OWASP JavaScript セキュリティ](https://owasp.org/www-project-cheat-sheets/cheatsheets/Javascript_Security_Cheat_Sheet.html)
- [MDN Web セキュリティ](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Node.js セキュリティ ベストプラクティス](https://nodejs.org/en/docs/guides/security/)
- [ESLint セキュリティ ルール](https://github.com/nodesecurity/eslint-plugin-security)

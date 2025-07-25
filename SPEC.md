# 仕様書：ちょっとした決断支援アプリ（Vanilla JavaScript版）

## 概要
ユーザーが複数の選択肢を入力し、「決める！」ボタンを押すと、ランダムで1つの選択肢を表示するアプリ。選択履歴はローカルストレージに保存され、一覧として閲覧・削除が可能。

---

## 要件

### 1. 機能要件

#### 1.1 選択肢入力  
- テキストエリアで、複数の選択肢（カンマまたは改行区切り）を入力できる

#### 1.2 決断（ランダム選択）  
- 「決める！」ボタンを押すと、入力された選択肢の中から1つをランダムで選び、画面に表示する

#### 1.3 履歴保存  
- 各決断の結果（日時・入力した選択肢・選ばれた結果）をローカルストレージに保存
- 履歴は新しい順に表示する

#### 1.4 履歴管理  
- 履歴一覧を画面に表示
- 各履歴に「削除」ボタンを表示し、個別削除できる
- 全履歴削除ボタン（任意）

#### 1.5 UI
- スマホ・PC両対応のシンプルなデザイン  
- 入力エリア、決断ボタン、結果表示、履歴リストがあること

---

### 2. 非機能要件

- Vanilla JS（フレームワーク・ライブラリ不使用）
- ローカルストレージのみ利用（サーバ不要）
- 1ページ構成（index.html, style.css, script.js推奨）
- 日本語UI
- アクセシビリティ基本対応（ラベル付与、ボタンのキーボード操作等）

---

### 3. 画面イメージ（簡易ワイヤーフレーム）

```
+---------------------------+
| 決断支援アプリ            |
+---------------------------+
| [選択肢入力エリア]        |
| 例: ラーメン,カレー,パスタ|
| [決める！]                |
|---------------------------|
| 結果: [カレー]            |
|---------------------------|
| 履歴                       |
| 2025/07/02 12:00 選択肢:...|
|    結果: ラーメン [削除]   |
| 2025/07/01 13:20 選択肢:...|
|    結果: パスタ  [削除]    |
|   ...                      |
| [全履歴削除]（任意）       |
+---------------------------+
```

---

### 4. データ仕様

#### 4.1 ローカルストレージ保存形式（例）

キー名: `decision_history`  
値（JSON文字列）:  
```json
[
  {
    "date": "2025-07-02T12:00:00+09:00",
    "choices": ["ラーメン", "カレー", "パスタ"],
    "result": "カレー"
  },
  ...
]
```

---

### 5. 将来的な拡張性（例：必須ではない）

- 選択肢セットの保存・再利用
- 結果ごとのメモ追加
- SNSシェア機能
- 履歴のエクスポート・インポート

---

### 6. 制作ファイル

- `index.html` … アプリ本体
- `style.css` … スタイル
- `script.js` … ロジック

---

## 以上
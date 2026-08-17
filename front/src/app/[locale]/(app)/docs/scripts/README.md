# Dropbox教材URL 一括更新

`html.json / css.json / js.json / php.json / react.json` の教材名と、Dropbox内のファイル名を照合し、各 `url` をDropboxのプレビュー用共有URLに一括更新します。

## 配置

```text
src/app/docs/
├── page.js
├── Docs.module.css
├── html.json
├── css.json
├── js.json
├── php.json
├── react.json
└── scripts/
    ├── update-dropbox-links.mjs
    └── README.md
```

## 1. Dropbox Appを用意

Dropbox App ConsoleでAPIアプリを作り、既存のDropboxフォルダを対象にする場合は Full Dropbox access を選びます。

Permissionsでは最低限、次を有効にします。

- files.metadata.read
- sharing.read
- sharing.write

その後、テスト用アクセストークンを発行します。

## 2. `.env.local`

Next.jsプロジェクト直下の `.env.local` に追加します。

```env
DROPBOX_ACCESS_TOKEN=YOUR_TOKEN
DROPBOX_ROOT=/Teaching Materials
```

アクセストークンはGitにコミットしないでください。

## 3. まず確認だけ

プロジェクトのルートで実行します。

```bash
node src/app/docs/scripts/update-dropbox-links.mjs --dry-run
```

`--dry-run` ではDropboxファイルとの照合だけ行い、JSONの変更や新規共有リンク作成はしません。

結果は以下に出ます。

```text
src/app/docs/scripts/dropbox-link-report.json
```

## 4. 本実行

```bash
node src/app/docs/scripts/update-dropbox-links.mjs
```

共有リンクがすでに存在すれば再利用し、存在しなければ作成します。Dropbox URLは `dl=0` に整えて、クリック時にDropboxプレビューを開くURLとしてJSONへ保存します。

更新前JSONは自動的に以下へバックアップされます。

```text
src/app/docs/scripts/.backup/<日時>/
```

バックアップ不要の場合:

```bash
node src/app/docs/scripts/update-dropbox-links.mjs --no-backup
```

## ファイル名の照合

最初に教材名とDropboxファイル名（拡張子なし）の厳密な正規化一致を試します。その後、先頭の `1.1` などの番号を除いた一致を試します。

一意に判断できない場合は勝手にURLを書き換えません。

- `unmatched`: 一致なし
- `ambiguous`: 候補が複数
- `errors`: Dropbox APIなどのエラー

これらは `dropbox-link-report.json` で確認できます。

# D·Sc · パララックス層スクロール（プロダクトページ版）

> 多層パララックスに**製品の 3D 微回転＋スペック注釈の指差し**を乗せた scrollytelling。実イラストではなく **UI 要素**（製品・注釈・CTA）を深度レイヤーで動かす製品紹介ページの実用形。デモは架空オーディオブランド『HARMONIC LAB / MARK I』。

**Live demo**: `./index.html`

## 概要

| 項目 | 内容 |
|---|---|
| ジャンル | D · 3D・空間 |
| 用途 | Sc · スクロール連動 |
| 主な参考 | Apple AirPods Max, Bang & Olufsen, Three.js Journey |
| 依存 | なし（Pure HTML + CSS + Vanilla JS） |
| 推奨配置 | プロダクト紹介ページ、ブランドのオリジンストーリー、長尺記事 |


## スキルとして導入 / Install as a skill

このリポジトリは Claude Code / Codex CLI 共通の **`SKILL.md`**（オープン標準）を同梱しており、AI エージェントのスキルとして使えます。リポジトリ自体をスキルディレクトリへリンクするだけです。

This repo ships a cross-agent **`SKILL.md`** (open standard) usable by both Claude Code and Codex CLI. Just link the repo into the agent's skills directory.

```bash
# Claude Code
ln -s "$(pwd)" ~/.claude/skills/anim-layered-parallax
# Codex CLI
ln -s "$(pwd)" ~/.codex/skills/anim-layered-parallax
```

エージェントを再起動すると `description` に基づき自動でマッチします（スキル名: `anim-layered-parallax`）。
Restart the agent; it is matched automatically by the skill's `description` (skill name: `anim-layered-parallax`).

## 仕組み（位置ベース・汎用 transform）

1. 背の高い `.parallax[data-parallax]`（既定 `--pa-section: 400vh`）の中で `.pa-stage` が `position:sticky`
2. JS が進捗 `p = -section.top / (section.height - viewport)` を 0..1 で算出
3. **任意要素**に `data-speed` / `data-rotate-y` / `data-rotate-x` / `data-scale` を付けると、JS が 1 本の `transform` にまとめて毎フレーム反映：
   - `translate3d(0, -p × speed × RANGE, 0)`
   - `rotateY(p × value deg)`
   - `rotateX(p × value deg)`
   - `scale(1 + p × value)`
4. `[data-from][data-to]` の注釈/キャプションは進捗範囲内で `.is-on`（fade + slide）
5. `[data-pct]` が進捗テキスト、`[data-progress]` が進捗バーを更新

> 同 B 流体の B·Sc（ウェーブパララックス）は**速度ベース**、こちらは**位置ベース**。止めれば動きも止まり、巻き戻せば逆再生する。

## デモ構成

| レイヤー | 役割 |
|---|---|
| `.pa-bg` | 静的グラデ + 装飾の放射光 |
| `.pa-blob--a/b` | 大きなぼかしブロブ（speed 0.08 / 0.18） |
| `.pa-spot` | スポットライト（speed 0.10） |
| `.pa-product-wrap` | 製品のラッパー（speed 0.34、緩やかに上昇） |
| `.pa-product` | 製品本体（rotateY 22 / rotateX -6 / scale +.06） |
| `.pa-annot × 4` | スペック注釈（章ごとに出現＆製品を指す線） |
| `.pa-progress` / `[data-pct]` | 進捗バー / テキスト |

## 組み込み手順

### 1. 2 ファイルをコピー

`style.css` / `script.js` を移植先へ。外部依存ゼロ。

### 2. マークアップ

```html
<section class="parallax" data-parallax>
  <div class="pa-stage">
    <!-- 任意の深度レイヤー（speed = 0…1） -->
    <div class="bg-blob" data-speed="0.1"></div>

    <!-- 中央の主役（rotate + scale も付与可） -->
    <div class="product-wrap" data-speed="0.34">
      <div class="product" data-rotate-y="22" data-rotate-x="-6" data-scale=".06">…</div>
    </div>

    <!-- 章ごとの注釈 -->
    <aside class="annot" data-from=".06" data-to=".34">…</aside>
    <aside class="annot" data-from=".26" data-to=".55">…</aside>

    <!-- 任意：進捗 UI -->
    <span data-pct>0%</span>
    <div data-progress><span></span></div>
  </div>
</section>
<script src="./layered-parallax.js"></script>
```

- `data-speed`：奥は小さく、手前ほど大きく
- `data-rotate-y/x`：進捗 0→1 で 0→指定度。微回転 10〜30 度くらいが自然
- `data-scale`：進捗 0→1 で 0→指定の加算。`.06` くらいで「少し迫ってくる」
- `data-from/to`：進捗範囲（0..1）。重ねて配置で章送りを滑らかに

## CSS 変数

| 変数 | 役割 | デフォルト |
|---|---|---|
| `--pa-section` | セクション全体の高さ（=スクロール量） | `400vh` |
| `--pa-range` | レイヤー最大移動量の基準（vh / px） | `50vh` |

## アクセシビリティ

`prefers-reduced-motion: reduce` のとき、レイヤー・製品の `transform` を停止し、注釈の出現だけ残す。

## 制約 / 既知の挙動

- スクロール位置に張り付くため逆再生する（仕様）
- レイヤー数が増えると DOM コスト増。6 層程度を目安
- `data-rotate-y` で大きな角度を与えると、製品の構成（CSS シェイプ）次第で歪んで見えるため、20° 前後を推奨

## ライセンス

ANIMATION DESIGN STUDY の一部として公開（コピペ自由）。

---

## 変更履歴

### v0.4 — 2026-05-29 · 立体感補強と見切れ修正

**製品の円柱表現**
- 本体グラデを縦のみ → **横方向の円柱シェード**（端 `#050507` → 中央 `#3c3c44` → 端）に置き換え。「中央が明るく端が暗い」円柱の核心を実装
- 上に天光（明）・下に地暗（暗）を重ね、二方向のライティングで曲面を強調
- 縫い目（接合線）を上下 2 本（白の薄い水平グラデ）

**キャップのお椀化を解除**
- キャップ内側下端の暗いグラデを削除（凹んだ皿に見えていた原因）
- 上のスペキュラ + 緩い球面シェードに作り直し、上端にメタリックなふち（`inset 0 2px 0 rgba(255,255,255,.55)`）

**メッシュを「筒に巻く」**
- 上下フェードのみ → **楕円 radial マスク**で左右端もフェード。ドット模様が円柱に巻きついて見える

**ライティング**
- specular shine をワイドな左サイドハイライト → 中央やや左の縦長ソフト specular（blur 7px）
- rim を青みがかった控えめなトーンに調整、位置と幅を微調整

**3D 構造**
- `.pa-product` に `transform-style: preserve-3d` を付与
- cap +8px / shine +5px / led +7px / rim +2px の `translateZ` で本物の前後関係を作り、回転時に視差で動く
- 製品全体に `drop-shadow(0 60px 50px …)` の深い落ち影

**見切れ修正**
- サイトヘッダー（`LAYERED PARALLAX` 行、`position:sticky`）がステージ天板に被っていた問題：
  - ステージの `top` を `0` → `var(--site-header-h, 56px)` に
  - ステージ `height` を `100vh` → `calc(100vh - var(--site-header-h))` に
- `.pa-product-wrap` に `padding:64px clamp(1rem,4vw,3rem)` を入れて topbar/bottombar 領域を常時確保
- 製品サイズ `clamp(200px,28vw,320px)` → `clamp(180px,24vw,270px)`、`aspect-ratio .56` → `.58`
- 製品ラッパーの `data-speed` を `0.34` → `0.12`（スクロールでの上方移動を抑え、進行中盤でキャップが topbar に隠れない）

### v0.3 — 2026-05-29 · Apple/B&O 系プロダクトページにリファイン

- マゼンタ/青のブロブ系カラフル背景を排除し、ほぼ真っ黒のステージ（`#0c0c0e → #060608`）に
- ステージ上下にヘアライン区切り＋小モノ文字（`HARMONIC LAB · MARK I` / `Designed in Tokyo. Acoustic at home.`）
- 注釈：背景パネル廃止 → 完全透明＋ヘアラインで製品を指す UI に。出現時に `scaleX` で線が右→左に伸び、最後にマゼンタの 7px ドットが灯る
- intro/after のタイポを Apple 級に大型化（H1 `clamp(4rem, 16vw, 10.5rem)`、`letter-spacing -.04em`）
- CTA は色反転ホバーのみの抑制設計
- 進捗バーを 3px → 1px のヘアラインに

### v0.2 — 2026-05-29 · 実用文脈の差し替え（mountains → product page）

- 山のイラスト（mountains scrollytelling）を廃し、架空オーディオブランド **HARMONIC LAB / MARK I** の product page に転換
- 中央に CSS で組んだ円柱スピーカー、スクロールで 3D 微回転＋わずかなスケール
- スペック注釈 × 4（DRIVER 50mm / WEIGHT 320g / BATTERY 18h / MATERIAL Recycled Al）が章ごとに出現し、製品を線で指す
- JS を `data-speed` 専用 → `data-speed` / `data-rotate-y` / `data-rotate-x` / `data-scale` を読み 1 本の transform に集約する汎用版へ拡張
- 一段下に `Pre-order · Spec Sheet` の CTA を配置

### v0.1 — 2026-05-29 · 初版（layered mountain parallax）

- 空 / 遠山 / 中景 / 霧 / 近景 / 草の 6 層を異速度で動かす scrollytelling
- 3 章のキャプション（`data-from / data-to`）と進捗バー
- 架空フィールドノート『北アルプス、霧の朝』として実装（後に v0.2 で製品ページに差し替え）

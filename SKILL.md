---
name: anim-layered-parallax
description: "3d / spatial scroll-linked animation (pure HTML/CSS/JS, no deps). Use when you need a scroll-linked effect with a 3D / spatial feel — e.g. プロダクト紹介ページ、ブランドのオリジンストーリー、長尺記事. 多層パララックスに**製品の 3D 微回転＋スペック注釈の指差し**を乗せた scrollytelling。実イラストではなく **UI 要素**（製品・注釈・CTA）を深度レイヤーで動かす製品紹介ページの実用形。デモは架空オーディオブランド『HARMONIC LAB / MARK I』。"
---

# anim-layered-parallax (D·Sc · パララックス層スクロール（プロダクトページ版）)

Pure HTML + CSS + vanilla JS, **zero dependencies**. 多層パララックスに**製品の 3D 微回転＋スペック注釈の指差し**を乗せた scrollytelling。実イラストではなく **UI 要素**（製品・注釈・CTA）を深度レイヤーで動かす製品紹介ページの実用形。デモは架空オーディオブランド『HARMONIC LAB / MARK I』。

## When to use / 使いどころ
- **EN:** a *scroll-linked* effect with a *3D / spatial* feel.
- **JP:** 3D・空間 × スクロール連動。推奨配置: プロダクト紹介ページ、ブランドのオリジンストーリー、長尺記事

## Bundled assets / 同梱アセット
This skill folder is the reference implementation — copy from these files:
- `index.html` — full working demo (open to preview)
- `style.css` — component styles
- `script.js` — the self-contained logic
- `README.md` — full human-facing doc (JP): mechanism, accessibility, constraints

## How to apply / 組み込み手順
Copy the component CSS block from `style.css` and the script from `script.js` (no build step), then follow the markup/parameters below.

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

## Customize / カスタマイズ
### CSS 変数
| 変数 | 役割 | デフォルト |
|---|---|---|
| `--pa-section` | セクション全体の高さ（=スクロール量） | `400vh` |
| `--pa-range` | レイヤー最大移動量の基準（vh / px） | `50vh` |

---
> Full mechanism, accessibility and known constraints: see **`README.md`** / 詳細・機構・アクセシビリティは README.md 参照。

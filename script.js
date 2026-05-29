/* ────────────────────────────────────────────
   D·Sc · Layered Parallax — product page edition
   - data-speed / data-rotate-y / data-rotate-x / data-scale
     のどれを持つ要素にも、進捗 p に応じた transform を毎フレーム適用
   - [data-from][data-to] は進捗範囲内で .is-on
   - [data-pct] は進捗テキスト、[data-progress] は進捗バー
   - rAF + IntersectionObserver で安価に更新
   ──────────────────────────────────────────── */

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const init = (root) => {
    const stage = root.querySelector('.pa-stage');
    const prog = root.querySelector('[data-progress]');
    const pctEl = root.querySelector('[data-pct]');
    if (!stage) return;

    // モーション対象（複合 transform を 1 本に集約）
    const motionEls = [
      ...root.querySelectorAll('[data-speed],[data-rotate-y],[data-rotate-x],[data-scale]'),
    ];
    const ms = motionEls.map((el) => ({
      el,
      s: parseFloat(el.dataset.speed) || 0,
      ry: parseFloat(el.dataset.rotateY) || 0,
      rx: parseFloat(el.dataset.rotateX) || 0,
      sc: parseFloat(el.dataset.scale) || 0,
    }));

    // 進捗範囲つきキャプション/注釈
    const caps = [...root.querySelectorAll('[data-from][data-to]')];

    // --pa-range の px 換算（vh / px サポート）
    let RANGE = 400;
    const sync = () => {
      const r = getComputedStyle(root).getPropertyValue('--pa-range').trim();
      if (r.endsWith('vh')) RANGE = (parseFloat(r) / 100) * window.innerHeight;
      else if (r.endsWith('px')) RANGE = parseFloat(r);
    };
    sync();

    let ticking = false;
    let inView = true;

    const update = () => {
      ticking = false;
      if (!inView) return;
      const rect = root.getBoundingClientRect();
      const scrollable = root.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / Math.max(1, scrollable), 0, 1);

      if (!reduce) {
        for (const m of ms) {
          const parts = [];
          if (m.s)  parts.push(`translate3d(0,${(-p * m.s * RANGE).toFixed(1)}px,0)`);
          if (m.ry) parts.push(`rotateY(${(p * m.ry).toFixed(2)}deg)`);
          if (m.rx) parts.push(`rotateX(${(p * m.rx).toFixed(2)}deg)`);
          if (m.sc) parts.push(`scale(${(1 + p * m.sc).toFixed(3)})`);
          m.el.style.transform = parts.length ? parts.join(' ') : '';
        }
      }

      caps.forEach((c) => {
        const a = parseFloat(c.dataset.from) || 0;
        const b = parseFloat(c.dataset.to) || 1;
        c.classList.toggle('is-on', p >= a && p <= b);
      });

      if (prog) prog.style.setProperty('--p', `${(p * 100).toFixed(1)}%`);
      if (pctEl) pctEl.textContent = `${Math.round(p * 100)}%`;
    };

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { sync(); onScroll(); });

    new IntersectionObserver(
      (es) => { inView = es[0].isIntersecting; if (inView) onScroll(); },
      { rootMargin: '50px 0px' }
    ).observe(root);

    update();
  };

  document.querySelectorAll('[data-parallax]').forEach(init);
})();

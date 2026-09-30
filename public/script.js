/* ================================================================
   Sir Csomó Kutyakozmetika – mozgás és apró okosságok
   ================================================================ */
(() => {
  "use strict";

  const SALON = {
    mapQuery: "Budapest, Erzsébet királyné útja 70/A, 1142", // a kattintásra betöltött térkép címe
    // nyitvatartás: a hét napja (0 = vasárnap) → [nyit, zár] percben
    hours: { 3: [540, 1200], 5: [540, 1200], 0: [540, 1200] },
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.replace("no-js", "js");

  /* ---------- fejléc és telefonos menü ---------- */
  const nav = $("[data-nav]");
  const toggle = $(".nav__toggle");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü bezárása" : "Menü");
    updateDock();
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });
  window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- beúszó elemek (telefonon azonnal látszanak) ---------- */
  const reveals = $$(".reveal");
  if (reduced || !("IntersectionObserver" in window) || window.matchMedia("(max-width: 640px)").matches) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const siblings = [...en.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
        en.target.style.transitionDelay = `${Math.min(siblings.indexOf(en.target), 6) * 70}ms`;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ================================================================
     A tábla: egy összegubancolódott szál kibomlik,
     és csokornyakkendővé áll össze – csomóból úriember.
     ================================================================ */
  const plate = $("[data-knot]");
  if (plate) knot(plate);

  function knot(root) {
    const frame = $(".plate__frame", root);
    const canvas = $("canvas", root);
    const ctx = canvas.getContext("2d");
    const N = 440;          // pontok száma a szálon
    const M = 7;            // párhuzamos szőrszálak
    let W = 0, H = 0, dpr = 1, S = 1, cx = 0, cy = 0;
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    /* --- a cél: csokornyakkendő körvonala (egységnyi koordinátákban) --- */
    const cubic = (p0, p1, p2, p3, n, out) => {
      for (let i = 1; i <= n; i++) {
        const t = i / n, u = 1 - t;
        out.push([
          u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
          u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
        ]);
      }
    };
    const line = (a, b, n, out) => cubic(a, a, b, b, n, out);
    const right = [[0, -0.2]];
    line([0, -0.2], [0.1, -0.2], 10, right);
    cubic([0.1, -0.2], [0.13, -0.2], [0.145, -0.19], [0.15, -0.16], 8, right);
    cubic([0.15, -0.16], [0.38, -0.3], [0.7, -0.53], [0.93, -0.5], 60, right);
    cubic([0.93, -0.5], [1.0, -0.495], [1.025, -0.46], [1.0, -0.4], 10, right);
    cubic([1.0, -0.4], [0.9, -0.14], [0.9, 0.14], [1.0, 0.4], 50, right);
    cubic([1.0, 0.4], [1.025, 0.46], [1.0, 0.495], [0.93, 0.5], 10, right);
    cubic([0.93, 0.5], [0.7, 0.53], [0.38, 0.3], [0.15, 0.16], 60, right);
    cubic([0.15, 0.16], [0.145, 0.19], [0.13, 0.2], [0.1, 0.2], 8, right);
    line([0.1, 0.2], [0, 0.2], 10, right);
    // bal fél: a jobb tükörképe, alulról felfelé haladva, hogy zárt, folytonos legyen
    const left = right.slice(1, -1).map(([x, y]) => [-x, y]).reverse();
    const closed = right.concat(left);
    const target = resample(closed, N);

    function resample(pts, n) {
      const d = [0];
      for (let i = 1; i <= pts.length; i++) {
        const a = pts[i - 1], b = pts[i % pts.length];
        d.push(d[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
      }
      const total = d[d.length - 1], out = [];
      let j = 0;
      for (let i = 0; i < n; i++) {
        const s = (i / n) * total;
        while (d[j + 1] < s) j++;
        const a = pts[j % pts.length], b = pts[(j + 1) % pts.length];
        const t = (s - d[j]) / (d[j + 1] - d[j] || 1);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
      return out;
    }

    /* --- a kiindulás: zárt, gubancos szál (felharmonikusok összege) --- */
    let tangle = [];
    function makeTangle() {
      const K = [];
      for (let k = 1; k <= 17; k++) {
        const amp = (k <= 9 ? 1 : 0.28) / Math.pow(k, 0.62);
        K.push({ k, ax: amp * (0.4 + rnd()), ay: amp * (0.4 + rnd()), px: rnd() * 6.283, py: rnd() * 6.283 });
      }
      const raw = [];
      for (let i = 0; i < N; i++) {
        const s = (i / N) * Math.PI * 2;
        let x = 0, y = 0;
        for (const h of K) { x += h.ax * Math.cos(h.k * s + h.px); y += h.ay * Math.sin(h.k * s + h.py); }
        raw.push([x, y]);
      }
      // a befoglaló téglalap közepére igazítva, hogy a gubanc a tábla közepén üljön
      const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]);
      const mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2;
      const r = Math.max(Math.max(...xs) - mx, Math.max(...ys) - my);
      tangle = raw.map(([x, y]) => [((x - mx) / r) * 0.74, ((y - my) / r) * 0.66]);
    }
    makeTangle();

    /* --- állapot --- */
    let t = 0, start = 0, playing = false, running = false, visible = true;
    const DUR = 3800;
    const ruffle = new Float32Array(N * 2);
    let ruffleEnergy = 0;
    const pts = new Float32Array(N * 2);
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const clamp = (x) => Math.max(0, Math.min(1, x));
    const W_STAG = 0.55; // mennyire fut végig a kibomlás a szálon

    function resize() {
      const r = frame.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      S = Math.min(W * 0.37, H * 0.62);
      cx = W / 2; cy = H / 2 + H * 0.01;
      draw(performance.now());
    }

    function compute(now) {
      const time = now / 1000;
      for (let i = 0; i < N; i++) {
        const u = Math.min(i, N - i) / (N / 2); // 0 a csomónál, 1 a szárnyak végén
        const e = ease(clamp((t * (1 + W_STAG) - u * W_STAG)));
        const wob = Math.sin(Math.PI * e) * 0.045;
        const a = tangle[i], b = target[i];
        let x = a[0] + (b[0] - a[0]) * e + Math.sin(i * 0.21 + time * 2.1) * wob;
        let y = a[1] + (b[1] - a[1]) * e + Math.cos(i * 0.17 + time * 1.7) * wob;
        pts[i * 2] = cx + x * S + ruffle[i * 2];
        pts[i * 2 + 1] = cy + y * S + ruffle[i * 2 + 1];
      }
    }

    const path = (off) => {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const k = i % N, p = (i + 1) % N;
        const x = pts[k * 2] + off[k * 2], y = pts[k * 2 + 1] + off[k * 2 + 1];
        const nx = pts[p * 2] + off[p * 2], ny = pts[p * 2 + 1] + off[p * 2 + 1];
        const mx = (x + nx) / 2, my = (y + ny) / 2;
        if (i === 0) ctx.moveTo(mx, my); else ctx.quadraticCurveTo(x, y, mx, my);
      }
      ctx.closePath();
    };

    const zero = new Float32Array(N * 2);
    const offs = Array.from({ length: M }, () => new Float32Array(N * 2));
    const STRAND = ["#15171b", "#2a2c31", "#a8844a", "#15171b", "#3a3c41", "#c9a66b", "#15171b"];

    function draw(now) {
      if (!W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      compute(now);
      const time = now / 1000;
      const fill = clamp((t - 0.82) / 0.18);
      const loose = 1 - ease(clamp(t * 1.1));

      // árnyék a kész csokor alatt
      if (fill > 0) {
        const g = ctx.createRadialGradient(cx, cy + S * 0.62, 0, cx, cy + S * 0.62, S * 1.05);
        g.addColorStop(0, `rgba(60,45,20,${0.16 * fill})`);
        g.addColorStop(1, "rgba(60,45,20,0)");
        ctx.save(); ctx.translate(cx, cy + S * 0.62); ctx.scale(1, 0.12); ctx.translate(-cx, -(cy + S * 0.62));
        ctx.fillStyle = g; ctx.fillRect(cx - S * 1.2, cy + S * 0.62 - S * 1.2, S * 2.4, S * 2.4); ctx.restore();
      }

      // szőrszálak: normálirányban széttartanak, gubancos állapotban kócosak
      for (let j = 0; j < M; j++) {
        const o = offs[j], lane = j - (M - 1) / 2;
        for (let i = 0; i < N; i++) {
          const p = (i + 1) % N, q = (i + N - 1) % N;
          let tx = pts[p * 2] - pts[q * 2], ty = pts[p * 2 + 1] - pts[q * 2 + 1];
          const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
          const rf = Math.hypot(ruffle[i * 2], ruffle[i * 2 + 1]);
          const spread = (0.9 + loose * 3.2) + rf * 0.25;
          const frizz = (loose * 5 + rf * 0.4) * Math.sin(i * 0.93 + j * 2.3 + time * 1.3);
          const d = lane * spread + frizz * (j % 2 ? 1 : -0.7);
          o[i * 2] = -ty * d; o[i * 2 + 1] = tx * d;
        }
        ctx.strokeStyle = STRAND[j];
        ctx.globalAlpha = (j === 2 || j === 5 ? 0.85 : 0.7) * (1 - fill);
        ctx.lineWidth = j === 3 ? 1.5 : 1;
        path(o); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // a kész csokor: szatén kitöltés, csomó, redők
      if (fill > 0) {
        ctx.save();
        ctx.globalAlpha = fill;
        const sat = ctx.createLinearGradient(cx - S, cy - S * 0.5, cx + S, cy + S * 0.5);
        sat.addColorStop(0, "#0f1114"); sat.addColorStop(0.22, "#30343b"); sat.addColorStop(0.42, "#121417");
        sat.addColorStop(0.58, "#121417"); sat.addColorStop(0.78, "#30343b"); sat.addColorStop(1, "#0f1114");
        path(zero); ctx.fillStyle = sat; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = "rgba(168,132,74,.55)"; ctx.stroke();

        // redők a szárnyakon
        ctx.strokeStyle = "rgba(245,242,235,.13)"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
        for (const sx of [1, -1]) {
          const P = (x, y) => [cx + x * sx * S, cy + y * S];
          const fold = (a, b, c, d) => { ctx.beginPath(); ctx.moveTo(...P(...a)); ctx.bezierCurveTo(...P(...b), ...P(...c), ...P(...d)); ctx.stroke(); };
          fold([0.2, -0.07], [0.42, -0.16], [0.66, -0.3], [0.86, -0.36]);
          fold([0.2, 0.07], [0.42, 0.16], [0.66, 0.3], [0.86, 0.36]);
          fold([0.24, 0], [0.45, -0.02], [0.65, 0.02], [0.84, 0]);
        }
        // a csomó
        const kw = 0.16 * S, kh = 0.23 * S, kr = 0.05 * S;
        ctx.beginPath(); ctx.roundRect(cx - kw, cy - kh, kw * 2, kh * 2, kr);
        const kg = ctx.createLinearGradient(cx - kw, 0, cx + kw, 0);
        kg.addColorStop(0, "#1b1d22"); kg.addColorStop(0.5, "#3a3f47"); kg.addColorStop(1, "#1b1d22");
        ctx.fillStyle = kg; ctx.fill();
        ctx.strokeStyle = "rgba(168,132,74,.7)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = "rgba(245,242,235,.14)";
        for (const f of [-0.35, 0.35]) { ctx.beginPath(); ctx.moveTo(cx + f * kw, cy - kh * 0.8); ctx.quadraticCurveTo(cx + f * kw * 1.3, cy, cx + f * kw, cy + kh * 0.8); ctx.stroke(); }

        // fénycsík végigfut a szatén felületen
        const sweep = doneAt ? (now - doneAt) / 1400 : 0;
        if (sweep > 0 && sweep < 1) {
          path(zero); ctx.clip();
          const x0 = cx - S * 1.3 + sweep * S * 2.6;
          const sh = ctx.createLinearGradient(x0 - S * 0.25, 0, x0 + S * 0.25, 0);
          sh.addColorStop(0, "rgba(255,248,230,0)"); sh.addColorStop(0.5, "rgba(255,248,230,.16)"); sh.addColorStop(1, "rgba(255,248,230,0)");
          ctx.fillStyle = sh; ctx.fillRect(x0 - S * 0.3, cy - S, S * 0.6, S * 2);
        }
        ctx.restore();
      }
    }

    let doneAt = 0;
    function frame_(now) {
      running = false;
      if (!visible) return;
      if (playing) {
        t = clamp((now - start) / DUR);
        if (t >= 1) { playing = false; doneAt = now; root.classList.add("is-done"); }
      }
      if (ruffleEnergy > 0.01) {
        ruffleEnergy = 0;
        for (let i = 0; i < N * 2; i++) { ruffle[i] *= 0.9; ruffleEnergy += Math.abs(ruffle[i]); }
        ruffleEnergy /= N;
      }
      draw(now);
      const sweeping = doneAt && now - doneAt < 1500;
      if (playing || ruffleEnergy > 0.01 || sweeping || t < 1) loop();
    }
    const loop = () => { if (!running) { running = true; requestAnimationFrame(frame_); } };

    function play(delay = 0) {
      root.classList.remove("is-done");
      doneAt = 0; t = 0; playing = false;
      if (reduced) { t = 1; root.classList.add("is-done"); draw(performance.now()); return; }
      setTimeout(() => { start = performance.now(); playing = true; loop(); }, delay);
      loop();
    }

    // egér/ujj: összeborzolja a szálat a közelében, ami aztán visszasimul
    let last = null;
    frame.addEventListener("pointermove", (e) => {
      if (reduced) return;
      const r = frame.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const vx = last ? x - last[0] : 0, vy = last ? y - last[1] : 0;
      last = [x, y];
      const R = Math.max(40, S * 0.32);
      for (let i = 0; i < N; i++) {
        const dx = pts[i * 2] - x, dy = pts[i * 2 + 1] - y, d = Math.hypot(dx, dy);
        if (d > R) continue;
        const f = (1 - d / R) ** 2;
        ruffle[i * 2] += (vx * 0.35 + Math.sin(i * 1.7) * 3) * f;
        ruffle[i * 2 + 1] += (vy * 0.35 + Math.cos(i * 1.3) * 3) * f;
      }
      for (let i = 0; i < N * 2; i++) ruffle[i] = Math.max(-38, Math.min(38, ruffle[i]));
      ruffleEnergy = 1;
      loop();
    });
    frame.addEventListener("pointerleave", () => { last = null; });

    $("[data-knot-reset]", root).addEventListener("click", () => { seed = (seed * 7 + 13) % 2147483647 || 3; makeTangle(); play(150); });

    new ResizeObserver(resize).observe(frame);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(); }).observe(frame);
    }
    resize();
    play(700);
  }

  /* ---------- „Egy délután” – a lépések görgetésre kigyulladnak ---------- */
  const journey = $("[data-journey]");
  if (journey) {
    const steps = $$("li", journey);
    const upd = () => {
      const r = journey.getBoundingClientRect(), vh = window.innerHeight;
      const mobile = window.matchMedia("(max-width: 640px)").matches;
      const p = reduced ? 1 : Math.max(0, Math.min(1, (vh * (mobile ? 0.7 : 0.8) - r.top) / (mobile ? r.height : vh * 0.45)));
      journey.style.setProperty("--p", p.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle("is-lit", p >= (i / (steps.length - 1)) * 0.98 && p > 0));
    };
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ---------- nyitvatartás: a mai nap kiemelése, budapesti idő szerint ---------- */
  const hoursEl = $("[data-hours]");
  if (hoursEl) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Budapest", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    const min = +parts.hour * 60 + +parts.minute;
    $$("li", hoursEl).forEach((li) => {
      const d = +li.dataset.day;
      li.classList.toggle("is-today", d === day);
      li.classList.toggle("is-closed", !SALON.hours[d]);
    });
    const h = SALON.hours[day];
    const open = !!h && min >= h[0] && min < h[1];
    const badge = $("[data-open]");
    badge.textContent = open ? "Most nyitva" : "Most zárva";
    badge.classList.toggle("is-open", open);
  }

  /* ---------- térkép: csak kattintásra tölt be bármit a Google-tól ---------- */
  const mapBtn = $("[data-map-load]");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = `https://www.google.com/maps?q=${encodeURIComponent(SALON.mapQuery)}&z=16&output=embed`;
      f.title = "Sir Csomó Kutyakozmetika a térképen";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      mapBtn.replaceWith(f);
    });
  }

  /* ---------- telefonos alsó sáv: a nyitókép után jelenik meg, és elbújik, ha ugyanaz már látszik ---------- */
  const dock = $("[data-dock]");
  const seen = new Set();
  function updateDock() {
    if (!dock) return;
    const hide = seen.size > 0 || nav.classList.contains("is-open");
    dock.classList.toggle("is-hidden", hide);
    dock.toggleAttribute("inert", hide);
  }
  if (dock && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
      updateDock();
    }, { threshold: 0 });
    [$(".hero"), $("#idopont"), $(".foot")].forEach((el) => el && io.observe(el));
  }

  /* ---------- évszám ---------- */
  const y = $("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
})();

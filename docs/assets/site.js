// Kit Commit 소개 사이트. 고양이 그림은 앱의 렌더러로 미리 뽑아 둔 가로 띠 PNG(48px 칸, 1초 12장)를 재생한다.
// 페이지마다 window.KC = { base, sprites: {이름: 장 수}, lines: {종류: [대사]}, names, labels } 를 넣어 준다 (site/build.js)
(() => {
  const KC = window.KC;
  const FPS = 12;
  const G = 48;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  // 손가락으로 쓰는 기기면 "클릭" 대신 "탭" 문구로 (html 의 data-phone 은 머리의 작은 스크립트가 붙인다)
  const phone = !!document.documentElement.dataset.phone;
  if (phone) $$('[data-touch]').forEach((el) => (el.innerHTML = el.dataset.touch));

  // ---------- 프레임 재생 ----------
  const imgs = {};
  const img = (name) => {
    if (!imgs[name]) { const i = new Image(); i.src = KC.base + name + '.png'; imgs[name] = i; }
    return imgs[name];
  };
  const all = new Set();
  class Sprite {
    constructor(canvas, name) {
      this.c = canvas;
      canvas.width = canvas.height = G;
      this.g = canvas.getContext('2d');
      this.visible = true;
      this.set(name);
      all.add(this);
    }
    // once 면 한 번만 돌고 then 을 부른다 (없으면 마지막 장에서 멈춘다)
    set(name, once = false, then = null) {
      this.name = name;
      this.n = KC.sprites[name] || 1;
      this.t0 = performance.now();
      this.once = once;
      this.then = then;
      this.img = img(name);
      this.last = -1;
    }
    draw(now) {
      if (!this.visible || !this.img.complete) return;
      let f = Math.floor(((now - this.t0) / 1000) * FPS);
      if (this.once && f >= this.n) {
        const cb = this.then;
        this.once = false;
        this.then = null;
        if (cb) return cb();
        f = this.n - 1;
      }
      f %= this.n;
      if (f === this.last && this.lastName === this.name) return;
      this.last = f;
      this.lastName = this.name;
      this.g.clearRect(0, 0, G, G);
      this.g.drawImage(this.img, f * G, 0, G, G, 0, 0, G, G);
    }
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.target._sp) e.target._sp.visible = e.isIntersecting; }), { rootMargin: '120px' });
  const mount = (canvas, name) => {
    const s = new Sprite(canvas, name || canvas.dataset.sp);
    canvas._sp = s;
    io.observe(canvas);
    return s;
  };
  $$('canvas[data-sp]').forEach((c) => mount(c));
  const loop = (now) => { for (const s of all) s.draw(now); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);

  // ---------- 말풍선 · 효과 ----------
  const fill = (s) => String(s).replace(/\{name\}/g, KC.names.cat).replace(/\{tool\}/g, 'Bash').replace(/\{hl\}/g, '1').replace(/\{dur\}/g, KC.names.dur);
  const say = (el, kind, cls = '', ms = 2800) => {
    if (!el) return;
    const text = fill(pick(KC.lines[kind] || [kind])).split('||')[0];
    el.textContent = text;
    el.className = 'bubble show' + (cls ? ' ' + cls : '');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  };
  const pop = (host, text, x, y) => {
    const d = document.createElement('div');
    d.className = 'fx';
    d.textContent = text;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    host.appendChild(d);
    setTimeout(() => d.remove(), 1200);
  };
  const hearts = (host, cx, top) => { for (let i = 0; i < 3; i++) setTimeout(() => pop(host, '♥', cx - 30 + Math.random() * 60, top + Math.random() * 20), i * 120); };

  // ---------- 첫 화면: 커서를 따라오는 고양이 (누르면 쓰다듬기, 끌면 들어 올리기) ----------
  function walker(stage, opts = {}) {
    const pet = $('.pet', stage);
    const bubble = $('.bubble', pet);
    const sp = mount($('canvas', pet), 'mood-idle');
    const W = () => stage.clientWidth;
    const size = () => pet.clientWidth;
    let x = opts.start != null ? opts.start * W() : W() * 0.3;
    let target = x;
    let lift = 0;
    let vy = 0;
    let mode = 'idle'; // idle · walk · act · held · fall
    let lastPointer = 0;
    let nextIdle = performance.now() + 7000;
    let drag = null;
    const clampX = (v) => Math.max(size() * 0.35, Math.min(W() - size() * 0.35, v));
    const idle = () => { mode = 'idle'; sp.set('mood-idle'); nextIdle = performance.now() + 8000 + Math.random() * 6000; };
    const act = (name, then) => { mode = 'act'; sp.set(name, true, then || idle); };

    const area = opts.follow || stage;
    if (!opts.noFollow) area.addEventListener('pointermove', (e) => {
      if (drag) return;
      const r = stage.getBoundingClientRect();
      target = clampX(e.clientX - r.left);
      lastPointer = performance.now();
    });

    pet.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      pet.setPointerCapture(e.pointerId);
      drag = { x0: e.clientX, y0: e.clientY, moved: false };
    });
    pet.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
      if (!drag.moved) { drag.moved = true; mode = 'held'; sp.set('held'); pet.classList.add('dragging'); say(bubble, 'held'); }
      const r = stage.getBoundingClientRect();
      x = clampX(e.clientX - r.left);
      target = x;
      lift = Math.max(0, Math.min(r.height - size() * 0.6, r.bottom - e.clientY - size() * 0.55));
    });
    pet.addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      pet.classList.remove('dragging');
      if (moved) { mode = 'fall'; vy = 0; return; }
      // 쓰다듬기
      act('a-happy');
      hearts(stage, x, stage.clientHeight - size() - 10 - lift);
      say(bubble, 'poke');
      if (opts.onPet) opts.onPet();
    });

    let prev = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (mode === 'fall') {
        vy += 1800 * dt;
        lift = Math.max(0, lift - vy * dt);
        if (lift === 0) { act('a-pounce'); say(bubble, 'landed'); }
      } else if (mode === 'idle' || mode === 'walk') {
        // 한동안 커서가 없으면 알아서 돌아다닌다
        if (!opts.noFollow && now - lastPointer > 5000 && Math.abs(target - x) < 4 && Math.random() < 0.004) target = clampX(Math.random() * W());
        const d = target - x;
        if (Math.abs(d) > 6) {
          if (mode !== 'walk') { mode = 'walk'; sp.set('walk'); }
          x += Math.sign(d) * Math.min(Math.abs(d), 120 * dt);
          pet.classList.toggle('flip', d < 0);
        } else if (mode === 'walk') idle();
        else if (opts.idleMotions && now > nextIdle) act(pick(opts.idleMotions));
      }
      pet.style.left = x - size() / 2 + 'px';
      pet.style.bottom = 3 + lift + 'px';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // loop: 끝없이 반복 (다른 걸 틀 때까지)
    const loopOn = (name) => { if (mode === 'held' || mode === 'fall') return; mode = 'act'; sp.set(name); };
    return { sp, bubble, act, idle, loop: loopOn, say: (k, cls, ms) => say(bubble, k, cls, ms) };
  }

  // 첫 화면: 터미널에서 일이 돌아가는 동안 고양이가 따라 연기한다 (같이 타이핑 → 허락 기다림 → 끝났다고 박수)
  const hero = $('#hero-stage');
  if (hero) runTerm(walker(hero, { noFollow: true, start: 0.5 }), $('#term'));
  async function runTerm(h, term) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const line = (cls, text = '') => {
      const d = document.createElement('div');
      d.className = cls;
      d.textContent = text;
      term.appendChild(d);
      while (term.children.length > 7) term.firstChild.remove();
      return d;
    };
    const type = async (d, text) => {
      d.classList.add('cur');
      for (const ch of text) { d.textContent += ch; await sleep(40 + Math.random() * 50); }
      d.classList.remove('cur');
    };
    await sleep(700);
    h.say('session');
    await sleep(2400);
    for (let i = 0; ; i++) {
      const s = KC.term[i % KC.term.length];
      term.innerHTML = '';
      await type(line('p'), s.cmd);
      await sleep(350);
      h.loop('mood-thinking');
      for (const o of s.out) { await sleep(1100); line('o', o); }
      await sleep(900);
      line('a', s.ask + ' (y/n)');
      h.loop('m-enterwait');
      h.say('notifyPermission', 'notify', 3000);
      await sleep(3300);
      await type(line('p'), 'y');
      h.loop('mood-thinking');
      for (const o of s.after) { await sleep(1200); line('o', o); }
      await sleep(900);
      line('d', s.done);
      h.act(s.end);
      h.say('stop', '', 3600);
      await sleep(Math.max(4200, ((KC.sprites[s.end] || 48) / FPS) * 1000 + 600));
      h.idle();
      await sleep(2600);
    }
  }
  const outro = $('#cta-stage');
  if (outro) walker(outro, { start: 0.5, idleMotions: ['m-blowkiss', 'm-slowblink', 'a-wave'] });

  // ---------- 놀이터: 앱처럼 움직이는 작은 바탕화면 ----------
  // 고양이는 들어 올리고 떨어뜨릴 수 있고, 밥은 하늘에서 떨어져 야금야금 먹고, 장난감은 앱과 같은 방식으로 조작한다.
  // 장난감 그림(방울 · 도미노 · 물줄기)은 field 캔버스에 도트로 찍는다. 고양이는 미리 뽑은 띠 그림을 갈아 끼운다.
  const playStage = $('#play-stage');
  if (playStage) playground(playStage);
  function playground(stage) {
    const pet = $('.pet', stage);
    const bubble = $('.bubble', pet);
    const cap = $('.caption', stage);
    const go = $('.go', stage);
    const field = $('.field', stage);
    const ctx = field.getContext('2d');
    const sp = mount($('canvas', pet), 'mood-idle');
    const home = cap.textContent;
    const D = 3; // 장난감 도트 한 칸
    const W = () => stage.clientWidth;
    const H = () => stage.clientHeight;
    const P = () => pet.clientWidth;
    const floor = () => H() - FL;
    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const clampX = (v) => clamp(v, P() * 0.28, W() - P() * 0.28);
    const snap = (v) => Math.floor(v / D) * D;
    let FL = 47; // 바닥 선 높이 (site.css 의 --floor)
    const fit = () => { FL = parseFloat(getComputedStyle(stage).getPropertyValue('--floor')) || 47; field.width = W(); field.height = H(); ctx.imageSmoothingEnabled = false; };
    fit();
    addEventListener('resize', fit);

    let x = W() / 2;
    let lift = 0;
    let vy = 0;
    let air = null; // 'fall'(들었다 놓음) · 'jump'
    let mode = 'free'; // free · held · float(큰 방울 속)
    let facing = 1;
    let cur = '';
    let actUntil = 0;
    let actThen = null;
    let scene = null; // 버튼으로 시킨 연기 (일 · 허락 · 잠)
    let sceneId = 0;
    let toy = null;
    let toyN = -1;
    let treats = [];
    let drag = null;
    const mouse = { x: W() / 2, y: H() / 2, in: false, down: false, downAt: 0 };

    const dur = (n) => ((KC.sprites[n] || 12) / FPS) * 1000;
    const loopAnim = (n) => { if (cur !== n) { cur = n; sp.set(n); } };
    const once = (n, then) => { cur = n; sp.set(n, true); actUntil = performance.now() + dur(n); actThen = then || null; };
    const cancelAct = () => { actUntil = 0; actThen = null; };
    const busy = (now) => now < actUntil;
    const face = (tx) => { if (Math.abs(tx - x) > 2) facing = tx < x ? -1 : 1; };
    const walkTo = (tx, dt, speed = 1, near = 6) => {
      const d = tx - x;
      if (Math.abs(d) <= near) return Math.abs(d);
      face(tx);
      loopAnim('walk');
      x = clampX(x + Math.sign(d) * Math.min(Math.abs(d), 170 * speed * dt));
      return Math.abs(tx - x);
    };
    const catMid = () => floor() - lift - P() * 0.2;
    const catTop = () => floor() - lift - P() * 0.42;
    const hitsCat = (px, py, pad = 0) => Math.abs(px - x) < P() * 0.17 + pad && py > catTop() - pad && py < floor() - lift + pad;
    const talk = (kind, cls, ms) => say(bubble, kind, cls, ms);
    const setCap = (t) => { cap.textContent = t || home; };
    const clearScene = () => { scene = null; sceneId++; };
    const icon = (k) => img('i-' + k);
    const stamp = (k, cx, cy, flip) => {
      const im = icon(k);
      if (!im.complete || !im.naturalWidth) return;
      const s = 16 * D;
      ctx.save();
      ctx.translate(Math.round(cx), Math.round(cy));
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(im, -s / 2, -s / 2, s, s);
      ctx.restore();
    };
    const dot = (px, py, col) => { ctx.fillStyle = col; ctx.fillRect(snap(px), snap(py), D, D); };

    // ----- 마우스 -----
    const at = (e) => { const r = stage.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    stage.addEventListener('pointerenter', (e) => { mouse.in = true; at(e); });
    stage.addEventListener('pointerleave', () => { mouse.in = false; });
    stage.addEventListener('pointermove', (e) => { const ox = mouse.x, oy = mouse.y; at(e); if (toy && toy.move) toy.move(Math.hypot(mouse.x - ox, mouse.y - oy)); });
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.pet, button, .toyitem')) return;
      at(e);
      mouse.in = true;
      mouse.down = true;
      mouse.downAt = performance.now();
      if (toy && toy.down) toy.down();
    });
    addEventListener('pointerup', () => {
      if (!mouse.down) return;
      mouse.down = false;
      if (toy && toy.up) toy.up(performance.now() - mouse.downAt);
    });

    // ----- 고양이: 누르면 쓰다듬기, 끌면 들어 올리기 -----
    pet.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      pet.setPointerCapture(e.pointerId);
      drag = { x0: e.clientX, y0: e.clientY, moved: false };
    });
    pet.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        if (toy && toy.grab) toy.grab();
        clearScene();
        cancelAct();
        mode = 'held';
        air = null;
        loopAnim('held');
        pet.classList.add('dragging');
        talk('held');
      }
      const r = stage.getBoundingClientRect();
      x = clampX(e.clientX - r.left);
      lift = clamp(r.bottom - FL - e.clientY - P() * 0.25, 0, H() - FL - P() * 0.5);
    });
    pet.addEventListener('pointerup', () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      pet.classList.remove('dragging');
      if (moved) { mode = 'free'; air = 'fall'; vy = 0; return; }
      if (mode !== 'free' || air) return;
      clearScene();
      once('a-happy');
      hearts(stage, x, catTop() - 30);
      talk('poke');
    });

    // ----- 밥: 하늘에서 떨어지고, 고양이가 걸어가서 네 입에 먹는다 -----
    const BITES = 4;
    function feed() {
      const key = pick(KC.foods);
      const el = document.createElement('canvas');
      el.className = 'food';
      el.width = el.height = 16;
      stage.appendChild(el);
      // 고양이 바로 위는 피해서 떨어뜨린다
      let fx = rand(40, W() - 40);
      if (Math.abs(fx - x) < P() * 0.35) fx = clamp(x + (fx < x ? -1 : 1) * P() * 0.4, 40, W() - 40);
      const o = { key, el, x: fx, y: -30, vy: 0, rest: false, bites: 0, eating: false, next: 0 };
      paintFood(o, 0, true);
      treats.push(o);
      setCap(KC.ui.feed);
    }
    function paintFood(o, frac, fromLeft) {
      const g = o.el.getContext('2d');
      const im = icon(o.key);
      const draw = () => {
        g.clearRect(0, 0, 16, 16);
        g.drawImage(im, 0, 0);
        // 고양이 쪽 가장자리부터 이빨 자국처럼 파먹는다 (가운데 줄이 더 깊다)
        for (let y = 0; y < 16 && frac > 0; y++) {
          const cut = Math.round(frac * 16 + Math.sin((y / 15) * Math.PI) * 2.5 * frac + (y % 3 === 0 ? 1 : 0));
          g.clearRect(fromLeft ? 0 : 16 - cut, y, cut, 1);
        }
      };
      if (im.complete && im.naturalWidth) draw();
      else im.addEventListener('load', draw, { once: true });
    }
    function stepFoods(dt) {
      for (const o of treats) {
        if (!o.rest) {
          o.vy += 1500 * dt;
          o.y += o.vy * dt;
          const gy = floor() - 8 * D;
          if (o.y >= gy) {
            o.y = gy;
            if (o.vy > 160) o.vy *= -0.35;
            else { o.vy = 0; o.rest = true; }
          }
        }
        o.el.style.left = Math.round(o.x - 8 * D) + 'px';
        o.el.style.top = Math.round(o.y - 8 * D) + 'px';
      }
    }
    function stepTreat(dt, now) {
      const o = treats[0];
      if (o.eating) {
        loopAnim('a-nibble');
        if (now < o.next) return;
        if (o.bites >= BITES) {
          o.el.remove();
          treats = treats.filter((t) => t !== o);
          cur = '';
          hearts(stage, x, catTop() - 20);
          talk('fed');
          if (!treats.length) setCap(toy ? toy.hint : '');
          return;
        }
        o.bites++;
        paintFood(o, o.bites / (BITES + 1), x < o.x);
        o.next = now + (o.bites >= BITES ? 520 : 560);
        return;
      }
      const side = x <= o.x ? -1 : 1;
      const d = walkTo(o.x + side * P() * 0.2, dt, 1.1, 6);
      if (d <= 6) {
        face(o.x);
        if (o.rest) { o.eating = true; o.next = now + 250; }
        else loopAnim('mood-idle');
      }
    }

    // ----- 장난감 -----
    const SOAP = ['rgba(143,207,245,0.95)', 'rgba(185,166,245,0.95)', 'rgba(245,176,214,0.95)', 'rgba(250,226,160,0.9)', 'rgba(160,232,204,0.95)', 'rgba(143,207,245,0.95)'];
    function soap(bx, by, R, phase) {
      ctx.fillStyle = 'rgba(215,238,255,0.14)';
      ctx.beginPath();
      ctx.arc(bx, by, Math.max(1, R - D), 0, Math.PI * 2);
      ctx.fill();
      const n = Math.max(8, Math.ceil((Math.PI * 2 * R) / D));
      for (let i = 0; i < n; i++) {
        const a = i / n;
        dot(bx + Math.cos(a * Math.PI * 2) * R, by + Math.sin(a * Math.PI * 2) * R, SOAP[Math.floor(((a + phase) % 1) * 6)]);
      }
      if (R > D * 2) {
        dot(bx - R * 0.5, by - R * 0.5, '#ffffff');
        dot(bx - R * 0.5 + D, by - R * 0.5 - D, '#ffffff');
      }
    }
    const TOYS = {
      // 비눗방울: 휘젓거나 클릭하면 방울, 꾹 누르면 큰 방울이 고양이를 가둔다
      bubbles() {
        const list = [];
        const pops = [];
        let giant = null;
        let stir = 0;
        let jumpAt = 0;
        const blow = (n) => {
          for (let i = 0; i < n && list.length < 40; i++) list.push({ x: mouse.x + 7 * D + rand(-10, 10), y: mouse.y - 9 * D + rand(-10, 10), r: rand(2, 5) * D, vx: rand(-30, 30), vy: rand(-45, -10), wob: Math.random(), born: performance.now() });
        };
        const popOne = (b) => { pops.push({ x: b.x, y: b.y, r: b.r, age: 0 }); list.splice(list.indexOf(b), 1); };
        const popGiant = () => {
          if (giant) pops.push({ x: giant.x, y: giant.y, r: giant.r, age: 0 });
          giant = null;
          if (mode === 'float') { mode = 'free'; air = 'fall'; vy = 0; cur = ''; }
        };
        return {
          cursor: true,
          move(d) { stir += d; if (stir > 70) { stir = 0; blow(1); } },
          down() {},
          up(ms) {
            if (ms < 260) { if (giant && giant.growing) giant = null; return blow(7); }
            if (!giant || !giant.growing) return;
            if (giant.r < P() * 0.22) giant = null;
            else Object.assign(giant, { growing: false, born: performance.now() });
          },
          grab: popGiant,
          end: popGiant,
          step(dt, now) {
            if (mouse.down && !giant && now - mouse.downAt > 260) giant = { x: mouse.x, y: mouse.y, r: 8, growing: true };
            for (const b of [...list]) {
              b.x += (b.vx + Math.sin(now / 400 + b.wob * 9) * 14) * dt;
              b.y += b.vy * dt;
              b.vx *= 1 - dt;
              if (now - b.born > 7000 || b.y < -20 || b.x < -20 || b.x > W() + 20) popOne(b);
            }
            for (const p of [...pops]) { p.age += dt; if (p.age > 0.3) pops.splice(pops.indexOf(p), 1); }
            if (giant) {
              if (giant.growing) {
                giant.r = Math.min(P() * 0.4, giant.r + 55 * dt);
                giant.x = mouse.x + 7 * D;
                giant.y = mouse.y - 9 * D - giant.r * 0.6;
              } else if (giant.trapped) {
                giant.y -= 42 * dt;
                giant.x = clampX(giant.x + Math.sin(now / 500) * 10 * dt);
                x = giant.x;
                lift = Math.max(0, floor() - giant.y - P() * 0.2);
                if (now > giant.popAt || giant.y - giant.r < 8) popGiant();
              } else {
                giant.y += 60 * dt;
                giant.x += Math.sin(now / 700) * 6 * dt;
                if (mode === 'free' && !air && Math.hypot(giant.x - x, giant.y - catMid()) < giant.r + P() * 0.08) {
                  Object.assign(giant, { trapped: true, popAt: now + 4200 });
                  mode = 'float';
                  cancelAct();
                  loopAnim('t-float');
                } else if (giant.y + giant.r >= floor() || now - giant.born > 9000) popGiant();
              }
            }
            // 뛰어오른 동안 방울에 닿으면 터뜨린다
            if (air === 'jump') for (const b of [...list]) if (Math.hypot(b.x - x, b.y - catTop()) < b.r + P() * 0.13) popOne(b);
          },
          brain(dt, now) {
            let best = null;
            let score = Infinity;
            for (const b of list) {
              const h = floor() - b.y;
              if (h > P() * 1.25) continue;
              const s = Math.abs(b.x - x) + h * 0.4;
              if (s < score) { score = s; best = b; }
            }
            if (!best) { face(mouse.x); return loopAnim(list.length || mouse.in ? 't-chatter' : 'mood-idle'); }
            if (walkTo(best.x, dt, 1.25, 16) > 16) return;
            const h = floor() - best.y;
            if (h < P() * 0.45) { popOne(best); once('t-pop'); } else if (now > jumpAt) {
              jumpAt = now + 900;
              air = 'jump';
              vy = -Math.sqrt(2 * 1800 * clamp(h - P() * 0.35, 30, P() * 0.95));
              cancelAct();
              loopAnim('t-leap');
            } else loopAnim('t-chatter');
          },
          draw(now) {
            for (const b of list) soap(b.x, b.y, b.r, now / 2800 + b.wob);
            if (giant) soap(giant.x, giant.y, giant.r, now / 2800);
            for (const p of pops) {
              const k = p.age / 0.3;
              for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; dot(p.x + Math.cos(a) * p.r * (1 + k), p.y + Math.sin(a) * p.r * (1 + k), `rgba(170,215,245,${1 - k})`); }
            }
            if (mouse.in) stamp('bubbles', mouse.x, mouse.y);
          },
        };
      },
      // 공: 끌었다 놓으면 던지고, 톡 누르면 뻥. 고양이가 쫓아가 덮치거나 앞발로 톡톡 굴린다
      ball() {
        const el = document.createElement('img');
        el.className = 'toyitem';
        el.src = KC.base + 'i-ball.png';
        el.alt = '';
        el.draggable = false;
        stage.appendChild(el);
        const R = 8 * D;
        const o = { x: clamp(x + (x > W() / 2 ? -1 : 1) * 190, R, W() - R), y: floor() - 220, vx: 0, vy: 0, rot: 0, held: null, pounceUntil: 0, batUntil: 0, n: 0 };
        el.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          el.setPointerCapture(e.pointerId);
          o.held = { x0: e.clientX, y0: e.clientY, moved: false, trail: [] };
          o.batUntil = 0;
        });
        el.addEventListener('pointermove', (e) => {
          if (!o.held) return;
          if (Math.hypot(e.clientX - o.held.x0, e.clientY - o.held.y0) > 5) o.held.moved = true;
          const r = stage.getBoundingClientRect();
          o.x = clamp(e.clientX - r.left, R, W() - R);
          o.y = clamp(e.clientY - r.top, R, floor() - R);
          o.held.trail.push({ x: o.x, y: o.y, t: performance.now() });
          if (o.held.trail.length > 5) o.held.trail.shift();
        });
        el.addEventListener('pointerup', () => {
          const h = o.held;
          if (!h) return;
          o.held = null;
          if (!h.moved) { o.vy = -680; o.vx += rand(-90, 90); return; }
          const a = h.trail[0];
          const b = h.trail[h.trail.length - 1];
          const t = Math.max(16, b.t - a.t) / 1000;
          o.vx = clamp((b.x - a.x) / t, -1100, 1100);
          o.vy = clamp((b.y - a.y) / t, -1100, 1100);
        });
        return {
          end() { el.remove(); },
          step(dt, now) {
            if (!o.held && now >= o.batUntil) {
              o.vy += 1500 * dt;
              o.x += o.vx * dt;
              o.y += o.vy * dt;
              if (o.x < R) { o.x = R; o.vx = Math.abs(o.vx) * 0.7; }
              if (o.x > W() - R) { o.x = W() - R; o.vx = -Math.abs(o.vx) * 0.7; }
              const gy = floor() - R;
              if (o.y >= gy) {
                o.y = gy;
                o.vy = Math.abs(o.vy) > 120 ? -o.vy * 0.55 : 0;
                o.vx *= 1 - 1.6 * dt;
              }
              o.rot += o.vx * dt * 1.6;
            }
            el.style.left = Math.round(o.x - R) + 'px';
            el.style.top = Math.round(o.y - R) + 'px';
            el.style.transform = `rotate(${Math.round(o.rot / 45) * 45}deg)`;
          },
          brain(dt, now) {
            if (now < o.batUntil) {
              // 앞발로 이쪽저쪽 톡톡
              o.x = clamp(x + facing * P() * 0.2 + Math.sin(now / 90) * 9, R, W() - R);
              o.y = floor() - R;
              if (o.batUntil - now < 40) { o.batUntil = 0; o.vx = facing * 360; o.vy = -160; }
              return;
            }
            const low = o.y > floor() - P() * 0.4;
            const d = walkTo(o.x - Math.sign(o.x - x || 1) * P() * 0.12, dt, 1.2, 10);
            if (d > 10) return;
            face(o.x);
            if (low && !o.held && now > o.pounceUntil) {
              o.pounceUntil = now + 1100;
              o.n++;
              if (o.n % 3 === 0) talk('caught');
              if (Math.random() < 0.35) { once('t-bat'); o.batUntil = now + 1300; o.vx = o.vy = 0; } else {
                once('a-pounce');
                o.vy = -430;
                o.vx = facing * 260;
              }
            } else loopAnim(low ? 'mood-idle' : 't-chatter');
          },
          draw() {},
        };
      },
      // 도미노: 더미에서 끌어다 세우고, 시작을 누르면 고양이가 첫 장을 톡 친다
      domino() {
        const d = 4;
        const dW = 3 * d;
        const dH = 11 * d;
        const MAX = 14;
        const side = x > W() / 2 ? -1 : 1;
        const pileX = clamp(x - side * W() * 0.36, 40, W() - 40);
        let list = [];
        let run = null;
        let held = null;
        let shown = null;
        // 바로 해 볼 수 있게 네 장은 미리 세워 둔다
        for (let i = 0; i < 4; i++) list.push({ x: clamp(x + side * (P() * 0.32 + i * dH * 0.62), 20, W() - 20), ang: 0, av: 0, dir: 1 });
        const label = () => { go.textContent = run && run.done ? KC.ui.restand : KC.ui.go; go.disabled = !(run && run.done) && list.filter((q) => q.ang === 0).length < 2; };
        const pickAt = (mx, my) => {
          const gy = floor();
          if (Math.abs(mx - pileX) < dH * 0.7 && my > gy - dH && my < gy + 8 && list.length < MAX) return 'pile';
          for (let i = list.length - 1; i >= 0; i--) {
            const q = list[i];
            const lying = q.ang > 0.6;
            const cx = q.x + (lying ? q.dir * dH * 0.45 : 0);
            if (Math.abs(mx - cx) < (lying ? dH * 0.8 : dW) && my > gy - dH - 6 && my < gy + 8) return q;
          }
          return null;
        };
        const start = () => {
          const up = list.filter((q) => q.ang === 0).sort((a, b) => a.x - b.x);
          if (up.length < 2) return;
          const fromLeft = Math.abs(x - up[0].x) <= Math.abs(x - up[up.length - 1].x);
          const chain = fromLeft ? up : up.reverse();
          const dir = fromLeft ? 1 : -1;
          for (const q of chain) Object.assign(q, { dir, falling: false, av: 0, fell: false });
          run = { chain, dir, phase: 'walk', at: 0, quietAt: 0, done: false };
          go.hidden = true;
        };
        const restand = () => { for (const q of list) Object.assign(q, { ang: 0, av: 0, fell: false, falling: false }); run = null; label(); };
        go.onclick = () => (run && run.done ? restand() : start());
        go.hidden = false;
        label();
        const drawOne = (px0, gy, ang, dir, lit) => {
          const px = px0 + (dir * dW) / 2;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          for (let v = 0; v < 11; v++)
            for (let u = 0; u < 3; u++) {
              const edge = u === 0 || u === 2 || v === 0 || v === 10;
              const col = edge || v === 5 ? '#2b1a10' : v === 2 || v === 8 ? '#e5463f' : lit ? '#ffffff' : '#fffaf3';
              const dx = (u - 3 + 0.5) * d;
              const dy = -(v + 0.5) * d;
              ctx.fillStyle = col;
              ctx.fillRect(Math.round(px + dir * (dx * cos - dy * sin) - d / 2), Math.round(gy + dx * sin + dy * cos - d / 2), d + 1, d + 1);
            }
        };
        return {
          hintCursor: (mx, my) => !!held || !!pickAt(mx, my),
          down() {
            if (run && !run.done) return;
            const hit = pickAt(mouse.x, mouse.y);
            if (!hit) return;
            if (hit === 'pile') { held = { x: mouse.x, ang: 0, av: 0, dir: 1 }; list.push(held); } else held = hit;
          },
          up() {
            const q = held;
            held = null;
            if (!q) return;
            if (Math.abs(q.x - pileX) < dH * 0.9) { list = list.filter((z) => z !== q); return label(); }
            const R = P() * 0.24;
            if (Math.abs(q.x - x) < R) q.x = x + (Math.sign(q.x - x) || 1) * R;
            q.x = clamp(q.x, 12, W() - 12);
            for (const z of list) if (z !== q && Math.abs(z.x - q.x) < dW * 1.5) q.x = z.x + (Math.sign(q.x - z.x) || 1) * dW * 1.5;
            Object.assign(q, { ang: 0, av: 0, fell: false, falling: false });
            if (run && run.done) { run = null; for (const z of list) Object.assign(z, { ang: 0, av: 0, fell: false, falling: false }); }
            label();
          },
          end() { go.hidden = true; go.onclick = null; },
          step(dt, now) {
            if (held) held.x = mouse.x;
            go.style.left = Math.round(x) + 'px';
            go.style.top = Math.round(catTop() - 44) + 'px';
            if (!run || run.done || run.phase !== 'fall') return;
            let moving = false;
            run.chain.forEach((q, i) => {
              if (!q.falling) return;
              const nx = run.chain[i + 1];
              const gap = nx ? Math.abs(nx.x - q.x) - dW : Infinity;
              const stop = gap < dH ? Math.asin(Math.max(0, gap) / dH) : Math.PI / 2;
              q.av += 16 * Math.sin(q.ang + 0.12) * dt;
              q.ang = Math.min(stop, q.ang + q.av * dt);
              if (q.ang >= stop) {
                if (!q.fell) {
                  q.fell = true;
                  if (nx && gap < dH && !nx.falling) { nx.falling = true; nx.av = Math.max(1.2, q.av * 0.75); }
                }
                q.av = 0;
                q.falling = false;
              } else moving = true;
            });
            if (moving) run.quietAt = now;
            else if (now - run.quietAt > 500) {
              run.done = true;
              const n = run.chain.filter((q) => q.fell).length;
              const all = n === run.chain.length;
              once(all ? 't-yay' : 't-deadpan');
              shown = { text: all ? 'PERFECT!' : `${n}/${run.chain.length}`, until: now + 2600 };
              pop(stage, shown.text, x - 40, catTop() - 70);
              go.hidden = false;
              label();
            }
          },
          brain(dt, now) {
            if (!run || run.done) { if (held) face(mouse.x); return loopAnim('mood-idle'); }
            if (run.phase === 'walk') {
              const first = run.chain[0];
              if (walkTo(first.x - run.dir * (P() * 0.2 + dW), dt, 1, 3) <= 3) {
                face(first.x);
                once('t-swipe');
                run.phase = 'tap';
                run.at = now;
              }
              return;
            }
            if (run.phase === 'tap' && now - run.at > 280) {
              run.phase = 'fall';
              run.quietAt = now;
              run.chain[0].av = 2.2;
              run.chain[0].falling = true;
            }
            if (!busy(now)) loopAnim('mood-idle');
          },
          draw() {
            const gy = floor();
            const left = MAX - list.length;
            for (let i = 0; i < Math.min(5, left); i++) drawOne(pileX - dH / 2 + (i % 2 ? d : -d), gy - i * dW, Math.PI / 2, 1);
            if (left > 0) { ctx.fillStyle = '#8b6f60'; ctx.font = '13px Galmuri11, monospace'; ctx.textAlign = 'center'; ctx.fillText('x' + left, pileX, gy - Math.min(5, left) * dW - 8); }
            for (const q of list) {
              if (q === held) drawOne(q.x, Math.min(gy, mouse.y + dH / 2), 0, 1, true);
              else drawOne(q.x, gy, q.ang, q.dir);
            }
          },
        };
      },
      // 물총: 클릭하면 물줄기, 꾹 누르면 연사. 세 번 맞으면 등 돌리고 삐진다
      squirtgun() {
        let drops = [];
        let splash = [];
        let hits = 0;
        let nextShot = 0;
        let wetUntil = 0;
        let sulkUntil = 0;
        let sulkFrom = 0;
        let backTo = null;
        let stepBackAt = 0;
        const dir = () => (x >= mouse.x ? 1 : -1);
        const shoot = (delay = 0) => {
          const mx = mouse.x + dir() * 8 * D;
          const my = mouse.y - 3 * D;
          const dist = Math.max(40, Math.hypot(x - mx, catMid() - my));
          drops.push({ x: mx, y: my, vx: ((x - mx) / dist) * 720 + rand(-30, 30), vy: ((catMid() - my) / dist) * 720 - 90 + rand(-30, 30), t: performance.now() + delay * 1000 });
        };
        return {
          cursor: true,
          down() {},
          up(ms) { if (ms < 220) for (let i = 0; i < 5; i++) shoot(i * 0.02); },
          end() {},
          step(dt, now) {
            if (mouse.down && now - mouse.downAt > 220 && now > nextShot) { nextShot = now + 70; shoot(); }
            for (const q of drops) {
              if (now < q.t) continue;
              q.vy += 600 * dt;
              q.x += q.vx * dt;
              q.y += q.vy * dt;
              if (hitsCat(q.x, q.y, 4)) {
                q.dead = true;
                if (mode === 'free' && now > wetUntil && now > sulkUntil) {
                  wetUntil = now + 1500;
                  hits++;
                  clearScene();
                  once('t-wet');
                  pop(stage, 'SPLASH', x - 30, catTop() - 40);
                  if (hits >= 3) { hits = 0; sulkFrom = now + 1400; sulkUntil = now + 5500; }
                }
              } else if (q.y >= floor() - 2) {
                q.dead = true;
                for (let i = 0; i < 3; i++) splash.push({ x: q.x, y: floor() - 4, vx: rand(-90, 90), vy: rand(-160, -60), age: 0 });
              }
            }
            drops = drops.filter((q) => !q.dead && q.x > -20 && q.x < W() + 20);
            for (const s of splash) { s.age += dt; s.vy += 700 * dt; s.x += s.vx * dt; s.y += s.vy * dt; }
            splash = splash.filter((s) => s.age < 0.35);
          },
          brain(dt, now) {
            if (now < sulkUntil) {
              if (now < sulkFrom) return;
              facing = Math.sign(x - mouse.x) || 1; // 등 돌리고 삐짐
              return loopAnim('t-sulk');
            }
            if (Math.abs(mouse.x - x) < P() * 0.32 && mouse.in && now > stepBackAt) {
              stepBackAt = now + 1500;
              backTo = clampX(x + (Math.sign(x - mouse.x) || 1) * 80);
            }
            if (backTo != null) { if (walkTo(backTo, dt, 0.8, 3) <= 3) backTo = null; return; }
            face(mouse.x);
            loopAnim(mouse.in ? 't-chatter' : 'mood-idle');
          },
          draw(now) {
            for (const q of drops) if (now >= q.t) { dot(q.x, q.y, '#6fc3f0'); dot(q.x - q.vx * 0.012, q.y - q.vy * 0.012, '#bfe6ff'); }
            for (const s of splash) dot(s.x, s.y, s.age < 0.18 ? '#9fd8f5' : '#cfe8f7');
            if (mouse.in) stamp('squirtgun', mouse.x, mouse.y, dir() < 0);
          },
        };
      },
    };
    const toyBtn = $('[data-act="toy"] small');
    const nextLabel = () => { if (toyBtn) { const n = (toyN + 1) % (KC.toys.length + 1); toyBtn.textContent = n < KC.toys.length ? `${KC.ui.next}: ${KC.toys[n][1]}` : ''; } };
    function endToy() {
      if (!toy) return;
      if (toy.end) toy.end();
      toy = null;
      cur = '';
      stage.classList.remove('tool');
    }
    function nextToy() {
      endToy();
      toyN = (toyN + 1) % (KC.toys.length + 1);
      nextLabel();
      if (toyN >= KC.toys.length) return setCap(KC.ui.away);
      const [key, name, mouseHow, touchHow] = KC.toys[toyN];
      const how = (phone && touchHow) || mouseHow;
      toy = TOYS[key]();
      toy.hint = `${name} — ${how}`;
      stage.classList.toggle('tool', !!toy.cursor);
      setCap(toy.hint);
    }
    nextLabel();

    // ----- 버튼 -----
    const ACT = {
      feed: () => { clearScene(); feed(); },
      toy: () => { clearScene(); nextToy(); },
      work: () => {
        endToy();
        const id = ++sceneId;
        scene = { anim: 'mood-thinking' };
        bubble.textContent = '…';
        bubble.className = 'bubble show';
        setTimeout(() => { if (id !== sceneId) return; scene = null; once('m-donebell'); talk('stop'); }, 2800);
      },
      notify: () => {
        endToy();
        const id = ++sceneId;
        scene = { anim: 'm-raisehand' };
        talk('notifyPermission', 'notify', 4200);
        setTimeout(() => { if (id === sceneId) scene = null; }, 4800);
      },
      lunch: () => {
        endToy();
        const id = ++sceneId;
        scene = { anim: 'mood-idle' };
        talk('lunch', '', 1700);
        setTimeout(() => { if (id !== sceneId) return; scene = null; once('m-fooddream'); }, 1800);
      },
      sleep: () => { endToy(); sceneId++; scene = { anim: 'm-snot' }; talk('late', '', 3000); },
      motion: () => { endToy(); clearScene(); const k = pick(KC.randomMotions); once(k); setCap(KC.motionNames[k]); },
    };
    const buttons = $$('.actions .btn', stage.parentNode);
    buttons.forEach((b) => b.addEventListener('click', () => {
      buttons.forEach((q) => q.classList.toggle('on', q === b && b.dataset.act !== 'feed'));
      if (!['toy', 'feed', 'motion'].includes(b.dataset.act)) setCap(b.dataset.label);
      if (mode === 'held') return;
      ACT[b.dataset.act]();
    }));

    // ----- 한 장면 -----
    let prev = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      stepFoods(dt);
      if (toy) toy.step(dt, now);
      if (air) {
        vy += 1800 * dt;
        lift = Math.max(0, lift - vy * dt);
        if (lift === 0 && vy > 0) {
          const fell = air === 'fall';
          air = null;
          vy = 0;
          cur = '';
          if (fell) { once('a-pounce'); talk('landed'); }
        }
      } else if (mode === 'free' && !busy(now)) {
        if (actThen) { const f = actThen; actThen = null; f(); }
        if (cur && actUntil) { cur = ''; actUntil = 0; }
        if (treats.length) { if (scene) clearScene(); stepTreat(dt, now); }
        else if (scene) loopAnim(scene.anim);
        else if (toy) toy.brain(dt, now);
        else loopAnim('mood-idle');
      }
      ctx.clearRect(0, 0, field.width, field.height);
      if (toy) toy.draw(now);
      if (toy && toy.hintCursor) stage.style.cursor = toy.hintCursor(mouse.x, mouse.y) ? 'grab' : '';
      else stage.style.cursor = '';
      pet.classList.toggle('flip', facing < 0);
      pet.style.left = Math.round(x - P() / 2) + 'px';
      pet.style.bottom = Math.round(FL + lift) + 'px';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- 갤러리 탭 (고른 칸만 보인다) ----------
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => {
    $$('.tabs button').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    $$('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== b.dataset.tab));
    const note = $('#tab-note');
    if (note) note.textContent = b.dataset.note || '';
  }));

  // ---------- 보기 방식 바꾸기 (데스크톱 ↔ 모바일). 화면 폭으로 저절로 정해질 값과 같으면 고른 값을 지운다 ----------
  $$('[data-view-toggle]').forEach((b) => b.addEventListener('click', () => {
    const next = document.documentElement.dataset.view === 'mobile' ? 'desktop' : 'mobile';
    const auto = Math.min(innerWidth || 9999, screen.width || 9999) <= 760 ? 'mobile' : 'desktop';
    try { if (next === auto) localStorage.removeItem('kc-view'); else localStorage.setItem('kc-view', next); } catch (e) { return; }
    location.reload();
  }));

  // ---------- 보는 사람의 기기에 맞춰: 맥이면 맥 버튼을 앞에 두고, 휴대폰이면 PC 에서 열라고 알려 준다 ----------
  const ua = navigator.userAgent || '';
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1);
  if (!mobile && /Mac/i.test(navigator.platform || ua)) {
    $$('[data-dl="mac"]').forEach((m) => {
      const w = $('[data-dl="win"]', m.parentNode);
      if (w) m.parentNode.insertBefore(m, w);
    });
  }
  if (mobile) $$('.mobile-note').forEach((el) => (el.hidden = false));
  // 휴대폰에서 'PC로 보내기': 공유 시트로 나에게 보내기(카톡 나와의 채팅 · 메모 · 메일 등). 공유 시트가 없으면 메일 · 복사만
  const pcLink = location.origin + location.pathname;
  $$('[data-send]').forEach((b) => {
    if (!navigator.share) return;
    b.hidden = false;
    b.addEventListener('click', () => navigator.share({ title: b.dataset.title, text: b.dataset.text, url: pcLink }).catch(() => {}));
  });
  $$('[data-mail]').forEach((a) => (a.href = 'mailto:?subject=' + encodeURIComponent(a.dataset.title) + '&body=' + encodeURIComponent(a.dataset.text + pcLink)));
  $$('[data-copy]').forEach((b) => b.addEventListener('click', () => {
    const done = () => { b.textContent = b.dataset.done; };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, () => {});
  }));

  // ---------- 받기: 최신 Release 에서 파일 · 버전 · SHA-256 ----------
  fetch('https://api.github.com/repos/elliott-json-park/kitcommit-releases/releases/latest')
    .then((r) => (r.ok ? r.json() : null))
    .then((rel) => {
      if (!rel || !rel.assets) return;
      const find = (re) => rel.assets.find((a) => re.test(a.name));
      const win = find(/^KitCommit-Setup-.*\.exe$/);
      const mac = find(/\.dmg$/);
      const sha = (name) => { const m = String(rel.body || '').match(new RegExp('`' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`\\s*\\|\\s*`([0-9a-f]{64})`')); return m ? m[1] : ''; };
      $$('[data-dl="win"]').forEach((a) => win && (a.href = win.browser_download_url));
      $$('[data-dl="mac"]').forEach((a) => mac && (a.href = mac.browser_download_url));
      $$('[data-ver]').forEach((el) => (el.textContent = rel.tag_name));
      $$('[data-sha="win"]').forEach((el) => win && sha(win.name) && (el.textContent = win.name + ' · SHA-256 ' + sha(win.name)));
      $$('[data-sha="mac"]').forEach((el) => mac && sha(mac.name) && (el.textContent = mac.name + ' · SHA-256 ' + sha(mac.name)));
    })
    .catch(() => {}); // 실패하면 버튼은 Releases 페이지로 간다
})();

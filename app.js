/* ================= utils ================= */
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s ?? '').toLowerCase().replace(/ё/g, 'е');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => 1 - Math.pow(1 - t, 4);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const APP_VERSION = '1.0.0';

const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
function plural(n, f) { const a = Math.abs(n) % 100, b = a % 10; return n + ' ' + (a > 10 && a < 20 ? f[2] : b > 1 && b < 5 ? f[1] : b === 1 ? f[0] : f[2]); }
const PL = { plan: ['план', 'плана', 'планов'], step: ['шаг', 'шага', 'шагов'] };
function ago(t) {
  const d = (Date.now() - t) / 1000;
  if (d < 60) return 'только что';
  if (d < 3600) return Math.floor(d / 60) + ' мин назад';
  if (d < 86400) return Math.floor(d / 3600) + ' ч назад';
  const days = Math.floor(d / 86400);
  if (days === 1) return 'вчера';
  if (days < 7) return days + ' дн. назад';
  return new Date(t).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
function hl(text, q) {
  text = String(text ?? '');
  if (!q) return esc(text);
  const n = norm(text), nq = norm(q); let out = '', i = 0, j;
  while ((j = n.indexOf(nq, i)) !== -1) { out += esc(text.slice(i, j)) + '<mark>' + esc(text.slice(j, j + nq.length)) + '</mark>'; i = j + nq.length; }
  return out + esc(text.slice(i));
}

const I = {
  logo: `<svg width="28" height="28" viewBox="0 0 28 28"><path d="M3 8h10a7 7 0 0 1 7 7v10" fill="none" stroke="#0A0B09" stroke-width="9"/><path d="M3 8h10a7 7 0 0 1 7 7v10" fill="none" stroke="#4A4D45" stroke-width="7"/><path d="M3 7h10a8 8 0 0 1 8 8v10" fill="none" stroke="#7B7E75" stroke-width="1.6" opacity=".7"/><rect x="1" y="3" width="3.5" height="10" rx="1" fill="#8B8E84"/><rect x="15" y="23.5" width="10" height="3.5" rx="1" fill="#8B8E84"/><circle cx="23.5" cy="5" r="2.6" fill="#FFA314"/></svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 7h14M7 13h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  back: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  more: `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="4.5" cy="10" r="1.6" fill="currentColor"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/><circle cx="15.5" cy="10" r="1.6" fill="currentColor"/></svg>`,
  search: `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M13 13l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  arrow: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9h11M10 5l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  fit: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 7V3h4M11 3h4v4M15 11v4h-4M7 15H3v-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 4v10M4 9h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  minus: `<svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 9h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  valve: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 6v28M6 20h28" stroke="currentColor" stroke-width="2.4"/><circle cx="20" cy="20" r="4.5" fill="currentColor"/></svg>`,
  emptyPipe: `<svg viewBox="0 0 84 84" class="e-ico"><path d="M8 30h26a14 14 0 0 1 14 14v32" fill="none" stroke="#0A0B09" stroke-width="16"/><path d="M8 30h26a14 14 0 0 1 14 14v32" fill="none" stroke="#3A3D36" stroke-width="12"/><path d="M8 27h26a17 17 0 0 1 17 17v32" fill="none" stroke="#5A5D55" stroke-width="2"/><rect x="4" y="20" width="7" height="20" rx="2" fill="#5A5D55"/><rect x="38" y="72" width="20" height="7" rx="2" fill="#5A5D55"/><circle cx="66" cy="18" r="5" fill="#FFA314"/></svg>`
};

const TYPES = [
  { k: 'step', label: 'Этап' }, { k: 'scene', label: 'Сцена' }, { k: 'dialog', label: 'Диалог' },
  { k: 'fight', label: 'Бой' }, { k: 'choice', label: 'Выбор' }, { k: 'task', label: 'Задача' }
];
const typeLabel = k => (TYPES.find(t => t.k === k) || TYPES[0]).label;

/* ================= data ================= */
const KEY = 'pipeliner.v1';
function seed() {
  const now = Date.now(), H = 3600e3, D = 24 * H;
  const S = { id: 'start', type: 'start' };
  const mk = (nodes, edges) => ({ nodes: [S, ...nodes.map(([id, type, title, desc]) => ({ id, type, title, desc: desc || '' }))], edges: edges.map(([from, to]) => ({ from, to })) });
  return { projects: [
    { id: uid(), name: 'Кампания D&D', updated: now - 2 * H, plans: [
      { id: uid(), name: 'Акт II — Винодельня', updated: now - 2 * H, ...mk([
        ['a1', 'dialog', 'Встреча с виноторговцем', 'Торговец нервничает и путается в датах поставок. Если надавить — проговорится про погреба под винодельней.'],
        ['a2', 'scene', 'Приезд на винодельню', 'Сумерки, пустой двор, ворота открыты. На бочках свежие метки, которых нет в накладных.'],
        ['a3', 'scene', 'Путь к замку', ''],
        ['a4', 'choice', 'Спуск в погреба', 'Развилка: тихо через сток или открыто через главный вход.'],
        ['a5', 'fight', 'Стража погребов', 'Двое наёмников и сторожевой пёс. Можно обойти проверкой Скрытности.'],
        ['a6', 'scene', 'Ворота замка', 'Обе ветки сходятся здесь.']
      ], [['start', 'a1'], ['a1', 'a2'], ['a2', 'a3'], ['a2', 'a4'], ['a4', 'a5'], ['a3', 'a6'], ['a5', 'a6']]) },
      { id: uid(), name: 'Акт I — Пролог', updated: now - 3 * D, ...mk([
        ['b1', 'scene', 'Таверна «Кривой гвоздь»', 'Сбор партии, знакомство.'],
        ['b2', 'dialog', 'Заказчик в капюшоне', ''],
        ['b3', 'fight', 'Засада на тракте', '']
      ], [['start', 'b1'], ['b1', 'b2'], ['b2', 'b3']]) }
    ] },
    { id: uid(), name: 'Pipeliner', updated: now - 5 * H, plans: [
      { id: uid(), name: 'MVP', updated: now - 5 * H, ...mk([
        ['c1', 'task', 'Макет на телефоне', 'Проекты, поиск, схема из труб, создание шага стрелкой.'],
        ['c2', 'task', 'Редактор схем', ''],
        ['c3', 'task', 'Анимации', 'Появление шага, «прокладка» трубы, приглушение остальных шагов.'],
        ['c4', 'task', 'Адаптация под браузер', 'Горизонтальная схема, док-панель справа.'],
        ['c5', 'task', 'Синхронизация', '']
      ], [['start', 'c1'], ['c1', 'c2'], ['c1', 'c3'], ['c2', 'c4'], ['c3', 'c4'], ['c4', 'c5']]) }
    ] },
    { id: uid(), name: 'Переезд', updated: now - 9 * D, plans: [] }
  ] };
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (!d || !Array.isArray(d.projects)) return null;
    d.projects.forEach(p => p.plans.forEach(pl => { if (!pl.nodes.find(n => n.id === 'start')) pl.nodes.unshift({ id: 'start', type: 'start' }); }));
    return d;
  } catch (e) { return null; }
}
let db = load() || seed();
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
const proj = id => db.projects.find(p => p.id === id);
const plan = (pid, plid) => proj(pid)?.plans.find(p => p.id === plid);
const stepCount = pl => pl.nodes.length - 1;

/* ================= graph ================= */
function graph(pl) {
  const ids = pl.nodes.map(n => n.id);
  const indeg = new Map(ids.map(i => [i, 0])), out = new Map(ids.map(i => [i, []])), inc = new Map(ids.map(i => [i, []]));
  for (const e of pl.edges) {
    if (!indeg.has(e.from) || !indeg.has(e.to)) continue;
    indeg.set(e.to, indeg.get(e.to) + 1); out.get(e.from).push(e.to); inc.get(e.to).push(e.from);
  }
  const depth = new Map(), q = [], deg = new Map(indeg);
  for (const id of ids) if (indeg.get(id) === 0) { depth.set(id, id === 'start' ? 0 : 1); q.push(id); }
  while (q.length) {
    const u = q.shift();
    for (const v of out.get(u)) { depth.set(v, Math.max(depth.get(v) ?? 0, depth.get(u) + 1)); deg.set(v, deg.get(v) - 1); if (deg.get(v) === 0) q.push(v); }
  }
  let mx = Math.max(0, ...depth.values());
  for (const id of ids) if (!depth.has(id)) depth.set(id, ++mx);
  return { depth, inc, out };
}
function reaches(pl, a, b) { // is b reachable from a
  const seen = new Set([a]), st = [a];
  while (st.length) { const u = st.pop(); if (u === b) return true; for (const e of pl.edges) if (e.from === u && !seen.has(e.to)) { seen.add(e.to); st.push(e.to); } }
  return false;
}
function orth(x1, y1, x2, y2, V, gap) {
  if (V) {
    if (y2 - y1 < 8) return `M${x1} ${y1}C${x1} ${y1 + 50} ${x2} ${y2 - 50} ${x2} ${y2}`;
    const mid = y2 - y1 > gap ? y2 - gap / 2 : (y1 + y2) / 2, dx = x2 - x1;
    if (Math.abs(dx) < .5) return `M${x1} ${y1}V${y2}`;
    const s = Math.sign(dx), r = Math.max(0, Math.min(14, Math.abs(dx) / 2, mid - y1, y2 - mid));
    return `M${x1} ${y1}V${mid - r}Q${x1} ${mid} ${x1 + s * r} ${mid}H${x2 - s * r}Q${x2} ${mid} ${x2} ${mid + r}V${y2}`;
  }
  if (x2 - x1 < 8) return `M${x1} ${y1}C${x1 + 50} ${y1} ${x2 - 50} ${y2} ${x2} ${y2}`;
  const mid = x2 - x1 > gap ? x2 - gap / 2 : (x1 + x2) / 2, dy = y2 - y1;
  if (Math.abs(dy) < .5) return `M${x1} ${y1}H${x2}`;
  const s = Math.sign(dy), r = Math.max(0, Math.min(14, Math.abs(dy) / 2, mid - x1, x2 - mid));
  return `M${x1} ${y1}H${mid - r}Q${mid} ${y1} ${mid} ${y1 + s * r}V${y2 - s * r}Q${mid} ${y2} ${mid + r} ${y2}H${x2}`;
}
function miniSVG(pl) {
  const { depth, inc } = graph(pl);
  const layers = [];
  pl.nodes.forEach(n => (layers[depth.get(n.id)] ||= []).push(n.id));
  const pos = new Map(), W = 34, HH = 12, GX = 18, GY = 8;
  let x = 0;
  layers.forEach((L, d) => {
    if (!L) return;
    const want = L.map(id => { const ps = inc.get(id).filter(p => pos.has(p)); return { id, a: ps.length ? ps.reduce((s, p) => s + pos.get(p).cy, 0) / ps.length : 0 }; }).sort((a, b) => a.a - b.a);
    const tot = want.length * HH + (want.length - 1) * GY; const mean = want.reduce((s, o) => s + o.a, 0) / want.length;
    want.forEach((o, i) => { const w = o.id === 'start' ? 10 : W; pos.set(o.id, { x, y: mean - tot / 2 + i * (HH + GY), w, cy: mean - tot / 2 + i * (HH + GY) + HH / 2 }); });
    x += (d === 0 ? 10 : W) + GX;
  });
  let minY = Infinity, maxY = -Infinity, maxX = 0;
  pos.forEach(p => { minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y + HH); maxX = Math.max(maxX, p.x + p.w); });
  let s = '';
  pl.edges.forEach(e => { const a = pos.get(e.from), b = pos.get(e.to); if (!a || !b) return; s += `<path d="${orth(a.x + a.w, a.cy, b.x, b.cy, false, GX)}" fill="none" stroke="#0A0B09" stroke-width="5.5"/><path d="${orth(a.x + a.w, a.cy, b.x, b.cy, false, GX)}" fill="none" stroke="#474A43" stroke-width="3.5"/>`; });
  pos.forEach((p, id) => { s += id === 'start' ? `<circle cx="${p.x + 5}" cy="${p.cy}" r="5.5" fill="#3A3D36" stroke="#5A5D55" stroke-width="1.2"/>` : `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${HH}" rx="3.5" fill="#262822" stroke="#3E413A"/>`; });
  const vw = Math.max(maxX + 8, 60), vh = maxY - minY + 8;
  return `<svg viewBox="-4 ${minY - 4} ${vw} ${vh}" style="width:${vw * 1.7}px" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}

/* ================= canvas engine ================= */
class PlanCanvas {
  constructor(root, pl, opts = {}) {
    this.root = root; this.plan = pl;
    this.world = $('.world', root); this.svg = $('svg.pipes', root); this.nodesEl = $('.nodes', root);
    this.els = new Map(); this.pos = new Map(); this.size = new Map(); this.tgt = new Map(); this.edgeEls = new Map();
    this.cam = { x: 0, y: 0, s: 1 }; this.editing = null; this.isNew = false; this.open = new Set(); this.ptrs = new Map();
    this.orient = this.calcOrient(); this.applyOrient();
    this.on = [];
    const L = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); this.on.push([t, ev, fn, o]); };
    L(root, 'pointerdown', e => this.onDown(e));
    L(window, 'pointermove', e => this.onMove(e));
    L(window, 'pointerup', e => this.onUp(e));
    L(window, 'pointercancel', e => this.onUp(e));
    L(root, 'click', e => this.onClick(e));
    L(root, 'dblclick', e => { const n = e.target.closest('.node'); if (n && n.dataset.id !== 'start' && !this.editing) this.edit(n.dataset.id); });
    L(root, 'wheel', e => this.onWheel(e), { passive: false });
    L(root, 'input', e => { if (e.target.matches('.e-title,.e-desc')) { grow(e.target); this.layout(); } });
    L(root, 'keydown', e => {
      if (e.target.matches('.e-title') && e.key === 'Enter') { e.preventDefault(); this.commitEdit(); }
      if (e.key === 'Escape') this.commitEdit();
    });
    this.ro = new ResizeObserver(() => this.onResize()); this.ro.observe(root);
    this.svgEdges = document.createElementNS('http://www.w3.org/2000/svg', 'g'); this.svg.append(this.svgEdges);
    this.tempG = document.createElementNS('http://www.w3.org/2000/svg', 'g'); this.svg.append(this.tempG);
    this.hint = $('.hint', root);
    this.sync(); this.layout(true); this.fit(false); this.updateHint(); this.startConveyor();
    if (opts.focus && this.pos.has(opts.focus)) { this.open.add(opts.focus); this.sync(); this.layout(); setTimeout(() => this.focusNode(opts.focus), 60); }
    document.fonts?.ready.then(() => { if (!this.dead) this.layout(true); });
  }
  destroy() { this.dead = true; this.on.forEach(([t, ev, fn, o]) => t.removeEventListener(ev, fn, o)); this.ro.disconnect(); cancelAnimationFrame(this.raf); cancelAnimationFrame(this.camRaf); cancelAnimationFrame(this.convRaf); }
  calcOrient() { return this.root.clientWidth < 720 ? 'v' : 'h'; }
  applyOrient() {
    this.root.classList.toggle('v', this.orient === 'v'); this.root.classList.toggle('h', this.orient === 'h');
    this.W = this.orient === 'v' ? clamp(this.root.clientWidth - 90, 220, 300) : 256;
  }
  onResize() {
    if (this.dead) return;
    const o = this.calcOrient(), changed = o !== this.orient; this.orient = o;
    const oldW = this.W; this.applyOrient();
    if (changed || oldW !== this.W) { this.sync(); this.layout(); if (changed) setTimeout(() => this.fit(true), 30); }
  }
  node(id) { return this.plan.nodes.find(n => n.id === id); }
  touch() { this.plan.updated = Date.now(); const p = db.projects.find(p => p.plans.includes(this.plan)); if (p) p.updated = this.plan.updated; save(); }

  /* ---- render ---- */
  html(n, mode) {
    const stubOut = `<span class="stub"></span><button class="outlet" aria-label="Добавить шаг">+</button>`;
    if (mode === 'start') return `<div class="valve">${I.valve}</div><span class="valve-label mono">Старт</span>${stubOut}`;
    if (mode === 'edit') return `<div class="n-card"><div class="n-head"><span class="tag mono">${this.isNew ? 'Новый шаг' : 'Шаг'} <span class="num"></span></span></div>
      <textarea class="e-title" rows="1" maxlength="140" placeholder="Что происходит?">${esc(n.title)}</textarea>
      <div class="n-panel"><div class="n-inner">
        <textarea class="e-desc" rows="3" placeholder="Описание — по желанию">${esc(n.desc)}</textarea>
        <div class="n-actions"><button data-a="del">Удалить</button><button class="primary" data-a="done">Готово</button></div>
      </div></div></div>${stubOut}`;
    return `<div class="n-card"><div class="n-head"><span class="tag mono">Шаг <span class="num"></span></span><span class="n-idx mono">${n.desc ? '<i></i>' : ''}</span></div>
      <div class="n-title">${esc(n.title)}</div>
      <div class="n-panel"><div class="n-inner">
        <div class="n-desc">${n.desc ? esc(n.desc) : '<span class="none">Описания нет</span>'}</div>
        <div class="n-actions"><button data-a="edit">Изменить</button><button data-a="del">Удалить</button></div>
      </div></div></div>${stubOut}`;
  }
  sync() {
    const ids = new Set(this.plan.nodes.map(n => n.id));
    for (const [id, el] of this.els) if (!ids.has(id)) { el.remove(); this.els.delete(id); this.pos.delete(id); }
    for (const n of this.plan.nodes) {
      let el = this.els.get(n.id), fresh = false;
      if (!el) {
        el = document.createElement('div'); el.className = 'node'; el.dataset.id = n.id;
        this.nodesEl.append(el); this.els.set(n.id, el); fresh = true;
        if (n.id !== 'start' && this.ready) { el.classList.add('spawn'); setTimeout(() => el.classList.remove('spawn'), 700); }
      }
      const mode = n.id === 'start' ? 'start' : this.editing === n.id ? 'edit' : 'view';
      const sig = mode + '|' + (mode === 'view' ? n.title + '\u0001' + n.desc : '');
      const wantOpen = mode === 'edit' || (mode === 'view' && this.open.has(n.id));
      el.classList.toggle('start', mode === 'start');
      el.classList.toggle('editing', mode === 'edit');
      el.style.setProperty('--nw', (mode === 'start' ? 64 : this.W) + 'px');
      el.style.width = (mode === 'start' ? 64 : this.W) + 'px';
      if (el._sig !== sig) {
        el._sig = sig; el.innerHTML = this.html(n, mode);
        if (wantOpen && !fresh) { el.classList.remove('is-open'); void el.offsetHeight; }
        if (mode === 'edit') el.querySelectorAll('textarea').forEach(grow);
      }
      el.classList.toggle('is-open', wantOpen);
    }
    this.root.classList.toggle('focus', !!this.editing);
    this.ready = true;
  }
  measureH(el) {
    const panel = el.querySelector('.n-panel'), inner = el.querySelector('.n-inner');
    if (!panel) return el.offsetHeight;
    return el.offsetHeight - panel.offsetHeight + (el.classList.contains('is-open') ? inner.scrollHeight : 0);
  }
  layout(instant) {
    const V = this.orient === 'v', GM = V ? 72 : 100, GC = V ? 22 : 28, P = 32;
    this.GM = GM;
    const { depth, inc } = graph(this.plan), nodes = this.plan.nodes;
    const order = new Map(nodes.map((n, i) => [n.id, i]));
    for (const n of nodes) { const el = this.els.get(n.id); this.size.set(n.id, n.id === 'start' ? { w: 64, h: 64 } : { w: this.W, h: this.measureH(el) }); }
    const layers = []; nodes.forEach(n => (layers[depth.get(n.id)] ||= []).push(n.id));
    const anchor = new Map(); let main = 0; this.tgt = new Map();
    for (const L of layers) {
      if (!L) continue;
      const items = L.map(id => {
        const ps = inc.get(id).filter(p => anchor.has(p)); const a = ps.length ? ps.reduce((s, p) => s + anchor.get(p), 0) / ps.length : 0;
        const sz = this.size.get(id), cs = V ? sz.w : sz.h, off = V ? sz.w / 2 : P;
        return { id, a, cs, off, want: a - off };
      }).sort((A, B) => A.a - B.a || order.get(A.id) - order.get(B.id));
      let end = -1e9;
      for (const it of items) { it.pos = Math.max(it.want, end + GC); end = it.pos + it.cs; }
      const shift = (items.reduce((s, i) => s + i.want, 0) - items.reduce((s, i) => s + i.pos, 0)) / items.length;
      let mm = 0;
      for (const it of items) {
        it.pos += shift; anchor.set(it.id, it.pos + it.off);
        const sz = this.size.get(it.id); mm = Math.max(mm, V ? sz.h : sz.w);
        this.tgt.set(it.id, V ? { x: it.pos, y: main } : { x: main, y: it.pos });
      }
      main += mm + GM;
    }
    // numbering
    const seq = nodes.filter(n => n.id !== 'start').sort((a, b) => depth.get(a.id) - depth.get(b.id) || anchor.get(a.id) - anchor.get(b.id));
    seq.forEach((n, i) => { const el = this.els.get(n.id); el?.querySelectorAll('.num').forEach(s => s.textContent = String(i + 1).padStart(2, '0')); });
    // tween
    for (const [id, t] of this.tgt) {
      let p = this.pos.get(id);
      if (!p || instant) { p = { x: t.x, y: t.y, ...(p || {}) }; if (instant) { p.x = t.x; p.y = t.y; } this.pos.set(id, p); }
      p.fx = p.x; p.fy = p.y; p.tx = t.x; p.ty = t.y;
    }
    this.t0 = performance.now(); this.dur = instant ? 0 : 480; this.until = this.t0 + (instant ? 0 : 560);
    if (instant) this.step(this.t0); else this.kick();
  }
  kick() {
    if (this.raf) return;
    const f = now => { this.step(now); if (now < this.until && !this.dead) this.raf = requestAnimationFrame(f); else this.raf = null; };
    this.raf = requestAnimationFrame(f);
  }
  step(now) {
    const k = this.dur ? ease(clamp((now - this.t0) / this.dur, 0, 1)) : 1;
    for (const [id, p] of this.pos) {
      p.x = p.fx + (p.tx - p.fx) * k; p.y = p.fy + (p.ty - p.fy) * k;
      const el = this.els.get(id); if (el) el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
    }
    this.drawEdges();
  }
  ports(id) {
    const p = this.pos.get(id), sz = this.size.get(id), el = this.els.get(id); if (!p) return null;
    const hh = id === 'start' ? 64 : el.offsetHeight;
    return this.orient === 'v'
      ? { ox: p.x + sz.w / 2, oy: p.y + hh, ix: p.x + sz.w / 2, iy: p.y }
      : { ox: p.x + sz.w, oy: p.y + 32, ix: p.x, iy: p.y + 32 };
  }
  drawEdges() {
    const NS = 'http://www.w3.org/2000/svg', V = this.orient === 'v', keys = new Set();
    for (const e of this.plan.edges) {
      const key = e.from + '>' + e.to, a = this.ports(e.from), b = this.ports(e.to);
      if (!a || !b) continue; keys.add(key);
      let g = this.edgeEls.get(key);
      if (!g) {
        g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'edge');
        g.innerHTML = `<path class="pipe-o"/><path class="pipe-b"/><path class="pipe-h"/><g class="chev"></g><rect class="flange" rx="1.5"/>`;
        this.svgEdges.append(g); this.edgeEls.set(key, g);
      }
      const d = orth(a.ox, a.oy, b.ix, b.iy, V, this.GM);
      if (g._d !== d) { g._d = d; for (const p of g.querySelectorAll(':scope>path')) p.setAttribute('d', d); g._len = null; }
      const r = g.querySelector('rect');
      if (V) { r.setAttribute('x', b.ix - 12); r.setAttribute('y', b.iy - 8); r.setAttribute('width', 24); r.setAttribute('height', 6); }
      else { r.setAttribute('x', b.ix - 8); r.setAttribute('y', b.iy - 12); r.setAttribute('width', 6); r.setAttribute('height', 24); }
      g.classList.toggle('hot', !!this.editing && (e.from === this.editing || e.to === this.editing));
    }
    for (const [k, g] of this.edgeEls) if (!keys.has(k)) { g.remove(); this.edgeEls.delete(k); }
    this.tickChev(performance.now());
    // temp connector
    if (this.conn?.moved) {
      const a = this.ports(this.conn.from), x = this.conn.wx, y = this.conn.wy;
      const d = V ? `M${a.ox} ${a.oy}C${a.ox} ${a.oy + 60} ${x} ${y - 60} ${x} ${y}` : `M${a.ox} ${a.oy}C${a.ox + 60} ${a.oy} ${x - 60} ${y} ${x} ${y}`;
      this.tempG.innerHTML = `<path class="temp" d="${d}"/><circle class="temp-end" cx="${x}" cy="${y}" r="5"/>`;
    } else if (this.tempG.firstChild) this.tempG.innerHTML = '';
  }

  /* ---- slow conveyor chevrons ---- */
  tickChev(now) {
    const SP = 34, SPEED = REDUCED ? 0 : 6; // px between chevrons, px per second
    const off = (now / 1000 * SPEED) % SP, NS = 'http://www.w3.org/2000/svg';
    for (const g of this.edgeEls.values()) {
      const path = g.querySelector('.pipe-b'), cg = g.querySelector('.chev');
      if (g._len == null) g._len = path.getTotalLength();
      const L = g._len, pts = [];
      for (let s = 12 + off; s < L - 14; s += SP) pts.push(s);
      while (cg.childNodes.length < pts.length) { const c = document.createElementNS(NS, 'path'); c.setAttribute('d', 'M-2.5 -3.5L1.5 0L-2.5 3.5'); cg.append(c); }
      while (cg.childNodes.length > pts.length) cg.lastChild.remove();
      pts.forEach((s, i) => {
        const a = path.getPointAtLength(s), b = path.getPointAtLength(Math.min(L, s + 1));
        const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        const fade = Math.min(1, (s - 12) / 10, (L - 14 - s) / 10);
        const c = cg.childNodes[i]; c.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`); c.style.opacity = Math.max(0, fade).toFixed(2);
      });
    }
  }
  startConveyor() {
    let last = 0;
    const f = now => { if (this.dead) return; if (now - last > 60 && !this.raf) { last = now; this.tickChev(now); } this.convRaf = requestAnimationFrame(f); };
    this.convRaf = requestAnimationFrame(f);
  }

  /* ---- camera ---- */
  applyCam() {
    const { x, y, s } = this.cam;
    this.world.style.transform = `translate3d(${x}px,${y}px,0) scale(${s})`;
    this.root.style.backgroundPosition = `${x}px ${y}px`;
    this.root.style.backgroundSize = `${22 * s}px ${22 * s}px`;
  }
  animateCam(to, dur = 560) {
    cancelAnimationFrame(this.camRaf);
    const from = { ...this.cam }, t0 = performance.now();
    if (!dur) { this.cam = { ...to }; this.applyCam(); return; }
    const f = now => {
      const k = ease(clamp((now - t0) / dur, 0, 1));
      this.cam = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, s: from.s + (to.s - from.s) * k };
      this.applyCam(); if (k < 1 && !this.dead) this.camRaf = requestAnimationFrame(f);
    };
    this.camRaf = requestAnimationFrame(f);
  }
  bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [id, t] of this.tgt) { const s = this.size.get(id); x0 = Math.min(x0, t.x); y0 = Math.min(y0, t.y); x1 = Math.max(x1, t.x + s.w); y1 = Math.max(y1, t.y + s.h); }
    return { x0: x0 - 30, y0: y0 - 30, x1: x1 + 50, y1: y1 + 50 };
  }
  fit(anim = true) {
    const b = this.bounds(), vw = this.root.clientWidth, vh = this.root.clientHeight, top = 78, bot = 90;
    const bw = b.x1 - b.x0, bh = b.y1 - b.y0; let s, x, y;
    if (this.orient === 'v') {
      s = clamp(Math.min(1, (vw - 24) / bw), .5, 1);
      x = vw / 2 - (b.x0 + bw / 2) * s;
      y = bh * s < vh - top - bot ? top + (vh - top - bot - bh * s) / 2 - b.y0 * s : top - b.y0 * s;
    } else {
      s = clamp(Math.min(1, (vw - 60) / bw, (vh - top - bot) / bh), .72, 1);
      x = bw * s < vw - 60 ? (vw - bw * s) / 2 - b.x0 * s : 30 - b.x0 * s;
      y = top + Math.max(0, (vh - top - bot - bh * s) / 2) - b.y0 * s;
    }
    this.animateCam({ x, y, s }, anim ? 560 : 0);
  }
  focusNode(id) {
    const t = this.tgt.get(id), sz = this.size.get(id); if (!t) return;
    const vw = this.root.clientWidth, vh = this.root.clientHeight, s = clamp(this.cam.s, .85, 1.1);
    const x = vw / 2 - (t.x + sz.w / 2) * s;
    const y = this.orient === 'v' ? Math.min(110, vh * .2) - t.y * s : vh * .38 - (t.y + 30) * s;
    this.animateCam({ x, y, s });
  }
  zoomBy(f, cx, cy) {
    const vw = this.root.clientWidth, vh = this.root.clientHeight;
    cx ??= vw / 2; cy ??= vh / 2;
    const s = clamp(this.cam.s * f, .3, 2.2), wx = (cx - this.cam.x) / this.cam.s, wy = (cy - this.cam.y) / this.cam.s;
    return { x: cx - wx * s, y: cy - wy * s, s };
  }

  /* ---- input ---- */
  local(e) { const r = this.root.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  toWorld(e) { const l = this.local(e); return { x: (l.x - this.cam.x) / this.cam.s, y: (l.y - this.cam.y) / this.cam.s }; }
  onDown(e) {
    const outlet = e.target.closest('.outlet');
    if (outlet) { this.startConnect(e, outlet.closest('.node').dataset.id); return; }
    if (e.target.closest('textarea,input,button')) return;
    cancelAnimationFrame(this.camRaf);
    this.ptrs.set(e.pointerId, this.local(e));
    if (this.ptrs.size === 1) this.pan = { ...this.local(e), cx: this.cam.x, cy: this.cam.y, moved: false };
    if (this.ptrs.size === 2) {
      const [a, b] = [...this.ptrs.values()], m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      this.pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y), s0: this.cam.s, wx: (m.x - this.cam.x) / this.cam.s, wy: (m.y - this.cam.y) / this.cam.s };
      if (this.pan) this.pan.moved = true;
    }
  }
  onMove(e) {
    if (this.conn && e.pointerId === this.conn.pid) return this.moveConnect(e);
    if (!this.ptrs.has(e.pointerId)) return;
    this.ptrs.set(e.pointerId, this.local(e));
    if (this.pinch && this.ptrs.size >= 2) {
      const [a, b] = [...this.ptrs.values()], m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const s = clamp(this.pinch.s0 * Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.d0, .3, 2.2);
      this.cam = { s, x: m.x - this.pinch.wx * s, y: m.y - this.pinch.wy * s }; this.applyCam(); return;
    }
    if (this.pan) {
      const l = this.local(e), dx = l.x - this.pan.x, dy = l.y - this.pan.y;
      if (!this.pan.moved && Math.hypot(dx, dy) > 6) this.pan.moved = true;
      if (this.pan.moved) { this.cam.x = this.pan.cx + dx; this.cam.y = this.pan.cy + dy; this.applyCam(); }
    }
  }
  onUp(e) {
    if (this.conn && e.pointerId === this.conn.pid) return this.endConnect(e);
    if (!this.ptrs.has(e.pointerId)) return;
    this.ptrs.delete(e.pointerId);
    if (this.ptrs.size < 2) this.pinch = null;
    if (this.ptrs.size === 0) { if (this.pan?.moved) this.suppressClick(); this.pan = null; }
    else if (this.ptrs.size === 1) { const p = [...this.ptrs.values()][0]; this.pan = { ...p, cx: this.cam.x, cy: this.cam.y, moved: true }; }
  }
  suppressClick() { this.noClick = true; clearTimeout(this.ncT); this.ncT = setTimeout(() => this.noClick = false, 350); }
  onWheel(e) {
    e.preventDefault(); cancelAnimationFrame(this.camRaf);
    if (e.ctrlKey || e.metaKey) { const l = this.local(e); this.cam = this.zoomBy(Math.exp(-e.deltaY * .0025), l.x, l.y); }
    else { this.cam.x -= e.deltaX; this.cam.y -= e.deltaY; }
    this.applyCam();
  }
  onClick(e) {
    if (this.noClick) { this.noClick = false; return; }
    const act = e.target.closest('[data-a]'), nodeEl = e.target.closest('.node'), id = nodeEl?.dataset.id;
    if (act) {
      const a = act.dataset.a;
      if (a === 'done') return this.commitEdit();
      if (a === 'edit') return this.edit(id);
      if (a === 'del') return this.deleteNode(id);
      return;
    }
    if (nodeEl) {
      if (this.editing) { if (id !== this.editing) this.commitEdit(); return; }
      if (id === 'start') return;
      this.open.has(id) ? this.open.delete(id) : this.open.add(id);
      this.sync(); this.layout(); return;
    }
    if (this.editing) this.commitEdit();
    else if (this.open.size) { this.open.clear(); this.sync(); this.layout(); }
  }

  /* ---- connecting ---- */
  startConnect(e, from) {
    e.preventDefault(); e.stopPropagation();
    this.conn = { from, pid: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, target: null };
  }
  moveConnect(e) {
    const c = this.conn;
    if (!c.moved && Math.hypot(e.clientX - c.x0, e.clientY - c.y0) > 8) { c.moved = true; this.root.classList.add('connecting'); }
    if (!c.moved) return;
    const w = this.toWorld(e); c.wx = w.x; c.wy = w.y;
    const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('.node');
    const tid = t && t.dataset.id !== c.from && t.dataset.id !== 'start' ? t.dataset.id : null;
    if (tid !== c.target) { if (c.target) this.els.get(c.target)?.classList.remove('drop'); c.target = tid; if (tid) t.classList.add('drop'); }
    this.drawEdges();
  }
  endConnect() {
    const c = this.conn; this.conn = null; this.root.classList.remove('connecting');
    if (c.target) this.els.get(c.target)?.classList.remove('drop');
    this.drawEdges(); this.suppressClick();
    if (c.target) return this.connect(c.from, c.target);
    this.createChild(c.from, c.moved ? { x: c.wx, y: c.wy } : null);
  }
  connect(a, b) {
    if (this.editing) this.commitEdit();
    if (this.plan.edges.some(e => e.from === a && e.to === b)) return toast('Эти шаги уже соединены');
    if (reaches(this.plan, b, a)) return toast('Так получится петля — труба не встанет');
    this.plan.edges.push({ from: a, to: b }); this.growKey = a + '>' + b; this.touch(); this.sync(); this.layout();
  }
  createChild(from, at) {
    if (this.editing) this.commitEdit();
    const parent = this.node(from); if (!parent) return;
    const n = { id: uid(), title: '', desc: '' };
    this.plan.nodes.push(n); this.plan.edges.push({ from, to: n.id });
    const pp = this.pos.get(from), ps = this.size.get(from);
    let sx, sy;
    if (at) { sx = at.x - this.W / 2; sy = at.y - 24; }
    else if (this.orient === 'v') { sx = pp.x + ps.w / 2 - this.W / 2; sy = pp.y + ps.h + 30; }
    else { sx = pp.x + ps.w + 40; sy = pp.y; }
    this.pos.set(n.id, { x: sx, y: sy });
    this.editing = n.id; this.isNew = true; this.growKey = from + '>' + n.id;
    this.touch(); this.sync(); this.layout(); this.focusNode(n.id); this.updateHint();
    const ta = this.els.get(n.id)?.querySelector('.e-title'); ta?.focus({ preventScroll: true });
  }
  edit(id) {
    if (this.editing) this.commitEdit();
    this.editing = id; this.isNew = false; this.open.delete(id);
    this.sync(); this.layout(); this.focusNode(id);
    const ta = this.els.get(id)?.querySelector('.e-title');
    if (ta) { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }
  }
  commitEdit() {
    const id = this.editing; if (!id) return;
    const el = this.els.get(id), n = this.node(id);
    if (el && n) {
      const t = el.querySelector('.e-title'), d = el.querySelector('.e-desc');
      if (t) n.title = t.value.trim() || 'Без названия';
      if (d) n.desc = d.value.trim();
    }
    this.editing = null; this.isNew = false;
    if (document.activeElement && this.root.contains(document.activeElement)) document.activeElement.blur();
    this.touch(); this.sync(); this.layout();
  }
  deleteNode(id) {
    const snap = JSON.stringify({ nodes: this.plan.nodes, edges: this.plan.edges });
    const ins = this.plan.edges.filter(e => e.to === id).map(e => e.from), outs = this.plan.edges.filter(e => e.from === id).map(e => e.to);
    this.plan.nodes = this.plan.nodes.filter(n => n.id !== id);
    this.plan.edges = this.plan.edges.filter(e => e.from !== id && e.to !== id);
    for (const a of ins) for (const b of outs) if (!this.plan.edges.some(e => e.from === a && e.to === b)) this.plan.edges.push({ from: a, to: b });
    if (this.editing === id) { this.editing = null; this.isNew = false; }
    this.open.delete(id);
    const el = this.els.get(id);
    if (el) { el.style.transition = 'opacity .25s, transform .25s'; el.style.opacity = '0'; }
    setTimeout(() => { this.touch(); this.sync(); this.layout(); this.updateHint(); }, el ? 180 : 0);
    toast('Шаг удалён', 'Вернуть', () => { const s = JSON.parse(snap); this.plan.nodes = s.nodes; this.plan.edges = s.edges; this.touch(); this.sync(); this.layout(); this.updateHint(); });
  }
  updateHint() {
    const empty = this.plan.nodes.length <= 1;
    this.hint?.classList.toggle('off', !empty);
    this.els.get('start')?.classList.toggle('pulse', empty);
  }
}
function grow(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }

/* ================= app ================= */
const st = { view: 'home', pid: null, plid: null, q: '' };
let canvas = null, cur = null;

function bar(left, title, right) { return `<header class="bar">${left}${title}${right}</header>`; }
const menuBtn = `<button class="icon-btn menu-btn" data-act="menu" aria-label="Меню">${I.menu}</button>`;
const backBtn = `<button class="icon-btn" data-act="back" aria-label="Назад">${I.back}</button>`;

function viewHome() {
  const el = h(`<div class="view">
    ${bar(`<div class="logo">${I.logo}<span>Pipeliner</span></div>`, '<div class="spacer"></div>', menuBtn)}
    <div class="scroll"><div class="wrap">
      <div class="hero"><h1>Проекты</h1><span class="count mono">${String(db.projects.length).padStart(2, '0')}</span></div>
      <label class="search">${I.search}<input type="search" placeholder="Проекты, планы, шаги…" autocomplete="off"><button class="clear" aria-label="Очистить">${I.close}</button></label>
      <div class="results"></div>
    </div></div></div>`);
  const input = $('input', el), res = $('.results', el), box = $('.search', el);
  input.value = st.q;
  const draw = () => { res.innerHTML = homeResults(st.q); box.classList.toggle('has', !!st.q); };
  input.addEventListener('input', () => { st.q = input.value; draw(); });
  $('.clear', el).addEventListener('click', e => { e.preventDefault(); st.q = ''; input.value = ''; draw(); input.focus(); });
  draw(); el._draw = draw;
  return el;
}
function projectCard(p, i) {
  const steps = p.plans.reduce((s, pl) => s + stepCount(pl), 0);
  return `<button class="pcard" data-proj="${p.id}" style="--i:${i}"><span class="pc-tab"></span><span class="pc-arrow">${I.arrow}</span>
    <div class="pc-name">${esc(p.name)}</div>
    <div class="pc-meta mono">${plural(p.plans.length, PL.plan)} · ${plural(steps, PL.step)} · ${ago(p.updated)}</div>
    ${p.plans.length ? `<div class="pc-plans">${p.plans.slice(0, 3).map(pl => `<span>${esc(pl.name)}</span>`).join('')}${p.plans.length > 3 ? `<span class="more">+${p.plans.length - 3}</span>` : ''}</div>` : ''}
  </button>`;
}
function homeResults(q) {
  const nq = norm(q.trim());
  const projects = [...db.projects].sort((a, b) => b.updated - a.updated);
  if (!nq) {
    if (!projects.length) return `<div class="empty">${I.emptyPipe}<h4>Пока ни одной трубы</h4><p>Проект — это папка для твоих планов.</p><button class="btn primary" style="max-width:220px" data-act="new-project">+ Проект</button></div>`;
    return `<div class="plist-home">${projects.map(projectCard).join('')}</div>`;
  }
  const P = projects.filter(p => norm(p.name).includes(nq));
  const PLs = [], Ss = [];
  for (const p of projects) for (const pl of p.plans) {
    if (norm(pl.name).includes(nq)) PLs.push([p, pl]);
    for (const n of pl.nodes) if (n.id !== 'start' && (norm(n.title).includes(nq) || norm(n.desc).includes(nq))) Ss.push([p, pl, n]);
  }
  if (!P.length && !PLs.length && !Ss.length) return `<div class="empty"><h4>Ничего не нашлось</h4><p>По запросу «${esc(q.trim())}» нет ни проектов, ни планов, ни шагов.</p></div>`;
  let s = '', i = 0;
  if (P.length) s += `<div class="sec mono">Проекты <b>${P.length}</b></div>` + P.map(p => `<button class="rrow" data-proj="${p.id}" style="--i:${i++}"><div class="r-t">${hl(p.name, q.trim())}</div><div class="r-s mono">${plural(p.plans.length, PL.plan)}</div></button>`).join('');
  if (PLs.length) s += `<div class="sec mono">Планы <b>${PLs.length}</b></div>` + PLs.map(([p, pl]) => `<button class="rrow" data-plan="${p.id}:${pl.id}" style="--i:${i++}"><div class="r-t">${hl(pl.name, q.trim())}</div><div class="r-s mono">${esc(p.name)} · ${plural(stepCount(pl), PL.step)}</div></button>`).join('');
  if (Ss.length) s += `<div class="sec mono">Шаги <b>${Ss.length}</b></div>` + Ss.slice(0, 30).map(([p, pl, n]) => {
    let snip = '';
    const k = norm(n.desc).indexOf(nq);
    if (k >= 0) { const a = Math.max(0, k - 40), b = Math.min(n.desc.length, k + nq.length + 60); snip = `<div class="r-d">${a ? '…' : ''}${hl(n.desc.slice(a, b), q.trim())}${b < n.desc.length ? '…' : ''}</div>`; }
    return `<button class="rrow" data-plan="${p.id}:${pl.id}" data-node="${n.id}" style="--i:${i++}"><div class="r-t">${hl(n.title, q.trim())}</div><div class="r-s mono">${esc(pl.name)} › ${esc(p.name)}</div>${snip}</button>`;
  }).join('');
  return s;
}
function viewProject() {
  const p = proj(st.pid);
  if (!p) return viewHome();
  const plans = [...p.plans].sort((a, b) => b.updated - a.updated);
  return h(`<div class="view">
    ${bar(backBtn, `<div class="bar-title"><span class="crumb mono">Проект</span><span class="t">${esc(p.name)}</span></div>`, `<button class="icon-btn" data-act="project-more" aria-label="Ещё">${I.more}</button>${menuBtn}`)}
    <div class="scroll"><div class="wrap" style="max-width:980px">
      <div class="hero small"><h1>${esc(p.name)}</h1></div>
      <div class="sub-meta mono">${plural(p.plans.length, PL.plan)} · обновлён ${ago(p.updated)}</div>
      ${plans.length ? `<div class="plist">${plans.map((pl, i) => planCard(p, pl, i)).join('')}</div>`
      : `<div class="empty">${I.emptyPipe}<h4>В проекте нет планов</h4><p>План — это схема из шагов, соединённых трубами.</p><button class="btn primary" style="max-width:220px" data-act="new-plan">+ План</button></div>`}
    </div></div></div>`);
}
function planCard(p, pl, i) {
  return `<button class="plcard" data-plan="${p.id}:${pl.id}" style="--i:${i}">
    <div class="pv">${miniSVG(pl)}</div>
    <div class="pl-row"><div><div class="pl-name">${esc(pl.name)}</div><div class="pc-meta mono">${plural(stepCount(pl), PL.step)} · ${ago(pl.updated)}</div></div><span class="arr">${I.arrow}</span></div>
  </button>`;
}
function viewPlan() {
  const p = proj(st.pid), pl = plan(st.pid, st.plid);
  if (!pl) return viewProject();
  return h(`<div class="view plan">
    <div class="canvas"><div class="world"><svg class="pipes" width="1" height="1"></svg><div class="nodes"></div></div>
      <div class="hint off"><span class="k">+</span>Потяни или нажми на «+» у старта — появится первый шаг</div></div>
    ${bar(backBtn, `<button class="bar-title" data-act="rename-plan"><span class="crumb mono">${esc(p.name)}</span><span class="t">${esc(pl.name)}</span></button>`, `<button class="icon-btn" data-act="plan-more" aria-label="Ещё">${I.more}</button>${menuBtn}`)}
    <div class="dock">
      <button class="icon-btn" data-act="zin" aria-label="Приблизить">${I.plus}</button>
      <button class="icon-btn" data-act="zout" aria-label="Отдалить">${I.minus}</button>
      <button class="icon-btn" data-act="fit" aria-label="Вся схема">${I.fit}</button>
    </div></div>`);
}

function go(view, params = {}, dir = 'push') {
  Object.assign(st, { view, focus: null }, params);
  const el = view === 'plan' ? viewPlan() : view === 'project' ? viewProject() : viewHome();
  if (canvas) { canvas.commitEdit(); canvas.destroy(); canvas = null; }
  const old = cur; cur = el;
  if (old && dir === 'none') old.remove();
  else if (old) {
    old.classList.add('leave-' + dir);
    const rm = () => old.remove(); old.addEventListener('animationend', rm, { once: true }); setTimeout(rm, 600);
    el.classList.add('enter-' + dir); el.addEventListener('animationend', () => el.classList.remove('enter-' + dir), { once: true });
  }
  $('#views').append(el);
  if (el.classList.contains('plan')) canvas = new PlanCanvas($('.canvas', el), plan(st.pid, st.plid), { focus: params.focus });
  renderDrawer();
}
function back() { if (st.view === 'plan') go('project', {}, 'pop'); else if (st.view === 'project') go('home', {}, 'pop'); }
function rerender() { go(st.view, { pid: st.pid, plid: st.plid }, 'none'); }

/* drawer */
function renderDrawer() {
  const projects = [...db.projects].sort((a, b) => b.updated - a.updated);
  $('#dnav').innerHTML = `<button class="drow ${st.view === 'home' ? 'on' : ''}" data-act="home"><span class="ell">Все проекты</span><span class="n mono">${db.projects.length}</span></button>` +
    projects.map((p, i) => `<div class="dproj" style="--i:${i}">
      <button class="drow ${st.view === 'project' && st.pid === p.id ? 'on' : ''}" data-proj="${p.id}"><span class="ell">${esc(p.name)}</span><span class="n mono">${p.plans.length}</span></button>
      ${p.plans.length ? `<div class="dplans">${p.plans.map(pl => `<button class="drow sub ${st.view === 'plan' && st.plid === pl.id ? 'on' : ''}" data-plan="${p.id}:${pl.id}"><span class="ell">${esc(pl.name)}</span></button>`).join('')}</div>` : ''}
    </div>`).join('');
}
const openDrawer = () => $('#app').classList.add('drawer-open');
const closeDrawer = () => $('#app').classList.remove('drawer-open');

/* sheets */
function openSheet(title, html, mount) {
  const r = $('#sheet-root');
  r.innerHTML = `<div class="sheet-scrim"></div><div class="sheet" role="dialog"><div class="grab"></div><h3>${title}</h3>${html}</div>`;
  void r.offsetHeight; r.classList.add('on');
  const close = () => { r.classList.remove('on'); setTimeout(() => { if (!r.classList.contains('on')) r.innerHTML = ''; }, 450); };
  $('.sheet-scrim', r).onclick = close;
  r.querySelectorAll('[data-x]').forEach(b => b.onclick = close);
  mount?.($('.sheet', r), close);
}
const sheetOpen = () => $('#sheet-root').classList.contains('on');
function inputSheet({ title, value = '', placeholder, ok, onOk, extra = '', mountExtra }) {
  openSheet(title, `<input class="field" maxlength="60" placeholder="${esc(placeholder)}" value="${esc(value)}">${extra}
    <div class="sheet-actions"><button class="btn ghost" data-x>Отмена</button><button class="btn primary" data-ok>${ok}</button></div>`, (s, close) => {
    const i = $('input', s); i.focus({ preventScroll: true }); i.select();
    const submit = () => { onOk(i.value.trim(), s); close(); };
    $('[data-ok]', s).onclick = submit;
    i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    mountExtra?.(s);
  });
}
function bindDraft(el, onCommit) {
  const i = $('input', el); let done = false;
  const finish = ok => {
    if (done) return; done = true;
    const v = i.value.trim();
    if (ok && v) onCommit(v); else { el.classList.add('gone'); setTimeout(() => el.remove(), 230); }
  };
  i.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); finish(true); } if (e.key === 'Escape') { e.stopPropagation(); finish(false); } });
  i.addEventListener('blur', () => finish(true));
  i.focus({ preventScroll: true });
  el.scrollIntoView({ block: 'nearest' });
}
function draftProject() {
  if (st.view !== 'home') go('home', {}, 'pop');
  if (st.q) { st.q = ''; $('.search input', cur).value = ''; cur._draw(); }
  const res = $('.results', cur), ex = $('.draft', res);
  if (ex) return $('input', ex).focus();
  $('.empty', res)?.remove();
  let list = $('.plist-home', res);
  if (!list) { list = h('<div class="plist-home"></div>'); res.append(list); }
  const el = h(`<div class="pcard draft"><span class="pc-tab"></span><input class="inline-in" maxlength="60" placeholder="Название проекта"><div class="pc-meta mono">Новый проект</div></div>`);
  list.prepend(el);
  bindDraft(el, name => {
    const p = { id: uid(), name, updated: Date.now(), plans: [] };
    db.projects.push(p); save();
    el.replaceWith(h(projectCard(p, 0)));
    const c = $('.hero .count', cur); if (c) c.textContent = String(db.projects.length).padStart(2, '0');
    renderDrawer();
  });
}
function draftPlan() {
  const recent = [...db.projects].sort((a, b) => b.updated - a.updated)[0];
  const pid = st.view !== 'home' && proj(st.pid) ? st.pid : recent?.id;
  if (!pid) { draftProject(); toast('Сначала проект — планы живут внутри него'); return; }
  if (st.view !== 'project' || st.pid !== pid) go('project', { pid }, st.view === 'plan' ? 'pop' : 'push');
  const wrap = $('.wrap', cur), ex = $('.draft', wrap);
  if (ex) return $('input', ex).focus();
  $('.empty', wrap)?.remove();
  let list = $('.plist', wrap);
  if (!list) { list = h('<div class="plist"></div>'); wrap.append(list); }
  const p = proj(pid);
  const el = h(`<div class="plcard draft"><div class="pv">${miniSVG({ nodes: [{ id: 'start' }], edges: [] })}</div><div class="pl-row"><div><input class="inline-in" maxlength="60" placeholder="Название плана"><div class="pc-meta mono">Новый план</div></div></div></div>`);
  list.prepend(el);
  bindDraft(el, name => {
    const pl = { id: uid(), name, updated: Date.now(), nodes: [{ id: 'start', type: 'start' }], edges: [] };
    p.plans.push(pl); p.updated = pl.updated; save();
    el.replaceWith(h(planCard(p, pl, 0)));
    const m = $('.sub-meta', cur); if (m) m.textContent = `${plural(p.plans.length, PL.plan)} · обновлён ${ago(p.updated)}`;
    renderDrawer();
  });
}
function confirmSheet(title, text, label, onYes) {
  openSheet(title, `<p class="note">${text}</p><div class="sheet-actions"><button class="btn ghost" data-x>Отмена</button><button class="btn danger" data-y>${label}</button></div>`, (s, close) => { $('[data-y]', s).onclick = () => { close(); onYes(); }; });
}
function optionsSheet(title, opts) {
  openSheet(title, `<div class="opts">${opts.map((o, i) => `<button class="opt ${o.danger ? 'danger' : ''}" data-i="${i}">${o.label}</button>`).join('')}</div>`, (s, close) => {
    s.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { close(); setTimeout(() => opts[b.dataset.i].fn(), 220); });
  });
}
function renamePlan() {
  const pl = plan(st.pid, st.plid);
  inputSheet({ title: 'Название плана', value: pl.name, placeholder: 'Название', ok: 'Сохранить', onOk: v => { if (v) { pl.name = v; pl.updated = Date.now(); save(); const t = $('.view.plan .bar-title .t'); if (t) t.textContent = v; renderDrawer(); } } });
}

/* toast */
let toastT;
function toast(msg, act, fn) {
  const t = $('#toast');
  t.innerHTML = `<span>${esc(msg)}</span>${act ? `<button>${esc(act)}</button>` : ''}`;
  if (act) $('button', t).onclick = () => { fn(); t.classList.remove('on'); };
  t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), act ? 4500 : 2200);
}

/* global clicks */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-proj],[data-plan]');
  if (!t || t.closest('.canvas') || t.closest('#sheet-root')) return;
  if (t.dataset.plan) { const [pid, plid] = t.dataset.plan.split(':'); closeDrawer(); go('plan', { pid, plid, focus: t.dataset.node || null }); return; }
  if (t.dataset.proj) { closeDrawer(); go('project', { pid: t.dataset.proj }); return; }
  switch (t.dataset.act) {
    case 'menu': openDrawer(); break;
    case 'close-drawer': closeDrawer(); break;
    case 'home': closeDrawer(); if (st.view !== 'home') go('home', {}, 'pop'); break;
    case 'back': back(); break;
    case 'new-project': closeDrawer(); draftProject(); break;
    case 'new-plan': closeDrawer(); draftPlan(); break;
    case 'fit': canvas?.fit(true); break;
    case 'zin': canvas && canvas.animateCam(canvas.zoomBy(1.25), 300); break;
    case 'zout': canvas && canvas.animateCam(canvas.zoomBy(.8), 300); break;
    case 'rename-plan': renamePlan(); break;
    case 'export-all': exportAll(); break;
    case 'import': importMode = 'add'; $('#importFile').click(); break;
    case 'project-more': {
      const p = proj(st.pid);
      optionsSheet(p.name, [
        { label: '+ Новый план в проекте', fn: draftPlan },
        { label: 'Экспорт проекта в файл', fn: () => exportProject(p) },
        { label: 'Переименовать', fn: () => inputSheet({ title: 'Название проекта', value: p.name, placeholder: 'Название', ok: 'Сохранить', onOk: v => { if (v) { p.name = v; save(); rerender(); } } }) },
        { label: 'Удалить проект', danger: true, fn: () => confirmSheet('Удалить проект?', `«${esc(p.name)}» и ${plural(p.plans.length, PL.plan)} внутри исчезнут без возможности вернуть.`, 'Удалить', () => { db.projects = db.projects.filter(x => x !== p); save(); go('home', {}, 'pop'); }) }
      ]); break;
    }
    case 'plan-more': {
      const p = proj(st.pid), pl = plan(st.pid, st.plid);
      optionsSheet(pl.name, [
        { label: 'Показать всю схему', fn: () => canvas?.fit(true) },
        { label: 'Переименовать', fn: renamePlan },
        { label: 'Удалить план', danger: true, fn: () => confirmSheet('Удалить план?', `«${esc(pl.name)}» и все его шаги будут удалены.`, 'Удалить', () => { p.plans = p.plans.filter(x => x !== pl); save(); go('project', {}, 'pop'); }) }
      ]); break;
    }
  }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (sheetOpen()) { $('#sheet-root .sheet-scrim').click(); return; }
  if ($('#app').classList.contains('drawer-open')) closeDrawer();
});

/* ================= экспорт / импорт ================= */
const dayStamp = () => new Date().toISOString().slice(0, 10);
function saveBlob(name, blob, ext) {
  name = String(name).replace(/[\/:*?"<>|]+/g, '_');
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.' + ext;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  return true;
}
const packJSON = (kind, projects) => new Blob([JSON.stringify({ app: 'pipeliner', kind, version: 1, exported: new Date().toISOString(), projects }, null, 1)], { type: 'application/json' });
async function exportAll() {
  closeDrawer();
  if (!db.projects.length) return toast('Пока нечего экспортировать');
  if (await saveBlob(`Pipeliner — все проекты ${dayStamp()}`, packJSON('workspace', db.projects), 'json', 'Pipeliner (JSON)')) toast('Файл сохранён в загрузки');
}
async function exportProject(p) {
  if (await saveBlob(`Pipeliner — ${p.name}`, packJSON('project', [p]), 'json', 'Pipeliner (JSON)')) toast('Файл сохранён в загрузки');
}
function validPack(d) {
  return d && d.app === 'pipeliner' && Array.isArray(d.projects) &&
    d.projects.every(p => p && typeof p.name === 'string' && Array.isArray(p.plans) && p.plans.every(pl => Array.isArray(pl.nodes) && Array.isArray(pl.edges)));
}
function normalize(p) {
  p.plans.forEach(pl => { if (!pl.nodes.find(n => n.id === 'start')) pl.nodes.unshift({ id: 'start', type: 'start' }); pl.updated ||= Date.now(); });
  p.updated ||= Date.now(); return p;
}
let importMode = 'add';
$('#importFile').addEventListener('change', async e => {
  const file = e.target.files[0]; e.target.value = '';
  if (!file) return;
  let d; try { d = JSON.parse(await file.text()); } catch (err) { importMode = 'add'; return toast('Файл не читается — это не JSON'); }
  if (!validPack(d)) { importMode = 'add'; return toast('Это не файл Pipeliner'); }
  closeDrawer();
  if (importMode === 'restore') {
    importMode = 'add';
    return confirmSheet('Заменить всё?', `Все текущие проекты заменятся содержимым копии (${plural(d.projects.length, ['проект', 'проекта', 'проектов'])}). Отменить это будет нельзя.`, 'Заменить', () => {
      db = { projects: d.projects.map(normalize) }; save(); st.q = ''; go('home', {}, 'none'); toast('Восстановлено из копии');
    });
  }
  // добавляем, ничего не затирая: проектам и планам — новые id
  for (const p of d.projects) {
    const np = normalize({ ...p, id: uid(), plans: p.plans.map(pl => ({ ...pl, id: uid() })) });
    db.projects.push(np);
  }
  save(); st.q = ''; go('home', {}, st.view === 'home' ? 'none' : 'pop');
  toast('Добавлено: ' + plural(d.projects.length, ['проект', 'проекта', 'проектов']));
});

$('#appVer').textContent = APP_VERSION;

/* boot */
$('#d-logo').innerHTML = I.logo + '<span>Pipeliner</span>';
$('#d-close').innerHTML = I.close;
go('home');

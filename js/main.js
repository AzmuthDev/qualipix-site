import { lousaDims, SIZES } from './products.js';

const root = document.documentElement;
root.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const WA = '551126904299';
const header = document.querySelector('.site-header');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const fmt = (n, d = 2) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

function progressOf(el) {
  const r = el.getBoundingClientRect();
  const total = r.height - innerHeight;
  return total > 0 ? clamp(-r.top / total) : 0;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

async function fontsReady() {
  if (!document.fonts) return;
  const wait = Promise.all([
    document.fonts.load('700 100px "Caveat"'),
    document.fonts.load('600 30px "Archivo"'),
    document.fonts.load('800 30px "Archivo"'),
  ]);
  await Promise.race([wait, new Promise((r) => setTimeout(r, 2500))]);
}

// ------------------------------------------------------------ rolagem suave
let lenis = null;
if (!reduced && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const el = document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  closeMenu();
  // nas seções fixadas, pula a abertura do hero
  const offset = id === '#inicio' ? 0 : -8;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  history.replaceState(null, '', id);
});

// ------------------------------------------------------------------- menu
const toggle = document.querySelector('.menu-toggle');
const mnav = document.getElementById('mobile-nav');
function closeMenu() {
  if (!toggle) return;
  toggle.setAttribute('aria-expanded', 'false');
  mnav.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  mnav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

// ---------------------------------------------- toque nos botões (feedback)
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.btn');
  if (!b || reduced) return;
  const r = b.getBoundingClientRect();
  const s = document.createElement('span');
  const size = Math.max(r.width, r.height) * 2.2;
  s.className = 'ripple';
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px`;
  b.appendChild(s);
  setTimeout(() => s.remove(), 650);
});

// -------------------------------------------------------------------- hero
const heroEl = document.getElementById('inicio');
const heroCanvas = document.getElementById('hero-canvas');
const heroCopy = heroEl.querySelector('.hero-copy');
const heroCurtain = heroEl.querySelector('.hero-curtain');
const heroTools = heroEl.querySelector('.hero-tools');
const heroCaption = heroEl.querySelector('.hero-caption');
let hero = null;

function booted() {
  root.classList.add('is-booted');
  header.classList.remove('is-hidden-boot');
}

async function initHero() {
  header.classList.add('is-hidden-boot');
  if (!hasWebGL()) { root.classList.add('no-webgl'); booted(); return; }
  await fontsReady();
  try {
    const { createHero } = await import('./hero.js');
    hero = createHero({ canvas: heroCanvas, coarse, reduced, onBooted: booted });
    hero.boot();
  } catch (err) {
    console.error(err);
    root.classList.add('no-webgl');
    booted();
  }
}
initHero();

const drawBtn = heroEl.querySelector('.draw-toggle');
const clearBtn = heroEl.querySelector('.draw-clear');
drawBtn?.addEventListener('click', () => {
  const on = drawBtn.getAttribute('aria-pressed') !== 'true';
  drawBtn.setAttribute('aria-pressed', String(on));
  drawBtn.textContent = on ? 'Concluir' : 'Escrever na tela';
  heroTools.classList.toggle('is-drawing', on);
  hero?.setDrawMode(on);
});
clearBtn?.addEventListener('click', () => hero?.clear());

// ---------------------------------------------------------------- anatomia
const anatomyEl = document.getElementById('produto');
const layerEls = [...anatomyEl.querySelectorAll('.layer')];
const loupe = anatomyEl.querySelector('.loupe');
let anatomy = null;
let anatomyLoading = false;
const nearObserver = new IntersectionObserver((entries) => {
  entries.forEach(async (en) => {
    if (!en.isIntersecting) return;
    if (en.target === anatomyEl && !anatomy && !anatomyLoading && hasWebGL()) {
      anatomyLoading = true;
      await fontsReady();
      const { createAnatomy } = await import('./anatomy.js');
      anatomy = createAnatomy({ canvas: document.getElementById('anatomy-canvas'), coarse });
    }
    if (en.target.classList.contains('film')) loadFilm(en.target);
  });
}, { rootMargin: '120% 0px' });
nearObserver.observe(anatomyEl);

// ------------------------------------------------- vídeos guiados pela rolagem
const films = [...document.querySelectorAll('.film')].map((el) => ({
  el,
  video: el.querySelector('video'),
  steps: [...el.querySelectorAll('.film-steps li')],
  bar: el.querySelector('.film-bar span'),
  cur: 0,
  ready: false,
}));
films.forEach((f) => nearObserver.observe(f.el));

function loadFilm(el) {
  const f = films.find((x) => x.el === el);
  if (!f || f.video.src) return;
  f.video.src = el.dataset.video;
  f.video.load();
  f.video.addEventListener('loadedmetadata', () => {
    f.ready = true;
    // iOS precisa de um play() para liberar a busca por quadro
    const p = f.video.play();
    if (p) p.then(() => f.video.pause()).catch(() => {});
  }, { once: true });
}

// ------------------------------------------------------------------ loop
let lastTheme = '';
function themeAt(y) {
  const sections = document.querySelectorAll('main > section, .site-footer');
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) {
      if (s === heroEl) return heroCurtain.style.opacity > 0.55 ? 'light' : 'dark';
      return s.dataset.theme || 'light';
    }
  }
  return 'dark';
}

function frame(t) {
  lenis?.raf(t);

  // hero
  const hp = progressOf(heroEl);
  const heroVisible = heroEl.getBoundingClientRect().bottom > 0;
  if (hero) {
    hero.setScroll(reduced ? 0 : hp);
    hero.setRunning(heroVisible);
  }
  if (!reduced) {
    const fade = 1 - smooth(0.02, 0.22, hp);
    heroCopy.style.opacity = fade;
    heroEl.style.setProperty('--hero-fade', fade.toFixed(3));
    heroCopy.style.transform = `translateY(${(1 - fade) * -40}px)`;
    heroTools.style.opacity = fade;
    heroCaption.style.opacity = root.classList.contains('is-booted') ? fade : '';
    heroCurtain.style.opacity = smooth(0.7, 0.97, hp);
  }

  // anatomia
  if (anatomy) {
    const r = anatomyEl.getBoundingClientRect();
    const vis = r.bottom > 0 && r.top < innerHeight;
    anatomy.setRunning(vis);
    if (vis) {
      const ap = progressOf(anatomyEl);
      anatomy.setProgress(ap);
      const active = anatomy.exploded ? anatomy.active : 0;
      layerEls.forEach((li, i) => li.classList.toggle('is-active', i === active));
      const showLoupe = anatomy.exploded && active === 2;
      loupe.classList.toggle('is-on', showLoupe);
      if (showLoupe) {
        const p = anatomy.loupePoint();
        loupe.style.left = `${p.x}px`;
        loupe.style.top = `${p.y}px`;
      }
    }
  }

  // filmes
  for (const f of films) {
    const r = f.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const p = progressOf(f.el);
    let activeIdx = 0;
    f.steps.forEach((li, i) => { if (p >= parseFloat(li.dataset.at)) activeIdx = i; });
    f.steps.forEach((li, i) => li.classList.toggle('is-active', i === activeIdx));
    if (f.bar) f.bar.style.width = `${p * 100}%`;
    if (f.ready && f.video.duration) {
      const target = p * (f.video.duration - 0.05);
      f.cur += (target - f.cur) * (reduced ? 1 : 0.18);
      if (Math.abs(f.video.currentTime - f.cur) > 0.012 && !f.video.seeking) f.video.currentTime = f.cur;
    }
  }

  // cabeçalho
  const theme = themeAt(36);
  if (theme !== lastTheme) { header.dataset.theme = theme; lastTheme = theme; }
  header.classList.toggle('is-scrolled', scrollY > 8);
  document.querySelector('.wa-float')?.classList.toggle('is-on', scrollY > innerHeight * 1.2);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ----------------------------------------------------------------- produtos
const rail = document.querySelector('.rail');
const railBar = document.querySelector('.rail-progress span');
function railUpdate() {
  const vis = rail.clientWidth / rail.scrollWidth;
  const max = rail.scrollWidth - rail.clientWidth;
  railBar.style.width = `${vis * 100}%`;
  railBar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
}
rail.addEventListener('scroll', railUpdate, { passive: true });
addEventListener('resize', railUpdate);
railUpdate();
document.querySelectorAll('[data-rail]').forEach((b) => b.addEventListener('click', () => {
  const card = rail.querySelector('.product');
  const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 24);
  rail.scrollBy({ left: step * Number(b.dataset.rail), behavior: reduced ? 'auto' : 'smooth' });
}));

// pedido de orçamento a partir do card preenche o formulário
document.querySelectorAll('[data-product]').forEach((a) => a.addEventListener('click', () => {
  const msg = document.getElementById('f-msg');
  msg.value = `Quero um orçamento de ${a.dataset.product}.`;
}));

// ---------------------------------------------------------------- tamanhos
const range = document.getElementById('size-range');
const sz = {
  num: document.getElementById('size-num'),
  line: document.getElementById('size-line'),
  area: document.getElementById('size-area'),
  ext: document.getElementById('size-ext'),
  dist: document.getElementById('size-dist'),
  body: document.getElementById('size-body'),
  screen: document.getElementById('size-screen'),
  dimLine: document.getElementById('dim-line'),
  dimText: document.getElementById('dim-text'),
};
const K = 100; // px por metro no desenho
const FLOOR = 360, CX = 315, CENTER_H = 1.45;
const shown = { ...lousaDims(86) };
function drawSize(dm) {
  const bx = CX - (dm.W * K) / 2, by = FLOOR - (CENTER_H + dm.H / 2) * K;
  sz.body.setAttribute('x', bx); sz.body.setAttribute('y', by);
  sz.body.setAttribute('width', dm.W * K); sz.body.setAttribute('height', dm.H * K);
  const side = ((dm.W - dm.aw) / 2) * K;
  sz.screen.setAttribute('x', bx + side); sz.screen.setAttribute('y', by + side);
  sz.screen.setAttribute('width', dm.aw * K); sz.screen.setAttribute('height', dm.ah * K);
  const ly = by - 16;
  sz.dimLine.setAttribute('x1', bx); sz.dimLine.setAttribute('x2', bx + dm.W * K);
  sz.dimLine.setAttribute('y1', ly); sz.dimLine.setAttribute('y2', ly);
  sz.dimText.setAttribute('x', CX); sz.dimText.setAttribute('y', ly - 8);
  sz.dimText.textContent = `${fmt(dm.W)} m`;
}
function setSize(i, animate = true) {
  const diag = SIZES[i];
  const dm = lousaDims(diag);
  sz.num.textContent = diag;
  sz.line.textContent = diag <= 55 ? 'Linha SX, usa o seu computador' : 'Linha DX, Android 14 embarcado';
  sz.area.textContent = `${fmt(dm.aw)} × ${fmt(dm.ah)} m`;
  sz.ext.textContent = `${fmt(dm.W)} × ${fmt(dm.H)} m`;
  sz.dist.textContent = `até ${fmt(dm.ah * 6, 1)} m`;
  range.setAttribute('aria-valuetext', `${diag} polegadas`);
  range.style.setProperty('--fill', `${(i / 6) * 100}%`);
  if (animate && window.gsap && !reduced) {
    window.gsap.to(shown, { ...dm, duration: 0.6, ease: 'power3.out', onUpdate: () => drawSize(shown) });
  } else { Object.assign(shown, dm); drawSize(shown); }
}
range.addEventListener('input', () => setSize(Number(range.value)));
setSize(5, false);

// ---------------------------------------------------------------- escolher
const answers = {};
const resultEmpty = document.querySelector('.result-empty');
const resultCard = document.querySelector('.result-card');
const R = {
  dx: { name: 'Lousa Digital DX', img: 'lousa', why: 'Tudo em um: Android 14, câmera e microfone integrados e 20 toques simultâneos, sem depender de computador. Disponível em 65", 75", 86" e 98".' },
  sx: { name: 'Lousa Digital SX', img: 'lousa', why: 'Tela 4K com touch nativo de 32" a 55" que usa o computador que você já tem. O caminho mais direto para uma tela interativa de verdade.' },
  sxSaude: { name: 'Lousa Digital SX 55"', img: 'lousa', why: 'Tamanho certo para mostrar exames de perto ao paciente, em 4K e ligada ao computador do consultório.' },
  moldura: { name: 'Moldura Touch', img: 'moldura', why: 'Você aproveita a TV que já está na parede e adiciona 20 pontos de toque com investimento menor. Brilho e qualidade de escrita acompanham a TV.' },
  max80: { name: 'Lousa Branca Interativa Max80', img: 'max80', why: 'Usa o seu projetor e o seu computador: é o menor investimento inicial. Funciona melhor em salas com pouca luz.' },
  totem: { name: 'Totem Interativo', img: 'totem', why: 'Feito para uso em pé: check-in, cadastro, cardápio e mídia, com computador embutido e base de piso estável.' },
  flip: { name: 'Flip Chart Digital', img: 'flip', why: 'Em pedestal com rodízios e ajuste de altura: vai de uma sala para outra e liga pronto para anotar.' },
  quadro: { name: 'Quadro Híbrido', img: 'quadro', why: 'Mantém o quadro branco que todo mundo domina e soma a lousa digital no centro, com 6.000 materiais prontos, IA, instalação e treinamento inclusos.' },
};
function recommend({ lugar, tem, prioridade }) {
  if (tem === 'tv') return R.moldura;
  if (tem === 'projetor' && prioridade === 'economia') return R.max80;
  if (prioridade === 'mobilidade') return R.flip;
  if (lugar === 'recepcao' || lugar === 'eventos') return R.totem;
  if (tem === 'quadro') return R.quadro;
  if (lugar === 'consultorio') return prioridade === 'completo' ? R.dx : R.sxSaude;
  if (prioridade === 'economia') return R.sx;
  if (tem === 'projetor') return { ...R.dx, why: 'Troca o projetor por uma tela com brilho de verdade: sem calibrar, sem sombra e visível com a luz acesa. ' + R.dx.why };
  return R.dx;
}
document.querySelectorAll('.chooser input[type="radio"]').forEach((inp) => inp.addEventListener('change', () => {
  answers[inp.name] = inp.value;
  const r = recommend(answers);
  resultEmpty.hidden = true;
  resultCard.hidden = false;
  resultCard.classList.remove('is-swap'); void resultCard.offsetWidth; resultCard.classList.add('is-swap');
  resultCard.querySelector('.result-name').textContent = r.name;
  resultCard.querySelector('.result-why').textContent = r.why;
  const img = resultCard.querySelector('.result-img');
  img.src = `assets/renders/${r.img}.webp`;
  img.alt = r.name;
  const cta = resultCard.querySelector('.result-cta');
  cta.href = waLink(`Olá! Usei o guia do site e a indicação foi ${r.name}. Quero um orçamento.`);
  cta.target = '_blank'; cta.rel = 'noopener';
}));

// --------------------------------------------------------------- segmentos
const tabs = [...document.querySelectorAll('.seg-tabs [role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const dir = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (dir) { e.preventDefault(); selectTab(tabs[(i + dir + tabs.length) % tabs.length], true); }
    if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
    if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
  });
});

// marquee contínuo: duplica os logos
const track = document.querySelector('.marquee-track');
if (track && !reduced) track.append(...[...track.children].map((n) => { const c = n.cloneNode(true); c.alt = ''; c.setAttribute('aria-hidden', 'true'); return c; }));

// ----------------------------------------------------------------- contato
const form = document.getElementById('contact-form');
const formError = document.getElementById('form-error');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const missing = [];
  ['nome', 'tel'].forEach((k) => {
    const el = form.elements[k];
    const bad = !String(data[k] || '').trim() || (k === 'tel' && String(data[k]).replace(/\D/g, '').length < 10);
    el.setAttribute('aria-invalid', String(bad));
    if (bad) missing.push(k === 'nome' ? 'seu nome' : 'um telefone com DDD');
  });
  if (missing.length) {
    formError.textContent = `Preencha ${missing.join(' e ')} para enviar.`;
    formError.hidden = false;
    form.elements[missing[0] === 'seu nome' ? 'nome' : 'tel'].focus();
    return;
  }
  formError.hidden = true;
  const lines = [
    'Olá! Quero agendar uma demonstração.',
    `Nome: ${data.nome}`,
    data.org ? `Empresa ou escola: ${data.org}` : '',
    `Telefone: ${data.tel}`,
    `Área: ${data.area}`,
    data.msg ? `Preciso de: ${data.msg}` : '',
  ].filter(Boolean);
  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

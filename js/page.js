// Páginas internas (produtos, segmentos, institucionais): cabeçalho, revelação ao rolar,
// vídeos do YouTube só depois do clique, formulário que abre o WhatsApp.
import './consent.js';
import './nav.js';

const root = document.documentElement;
root.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5511971756835';
const header = document.querySelector('.site-header');
const subnav = document.querySelector('.subnav');

// ------------------------------------------ cor do cabeçalho segue a seção embaixo dele
const sections = [...document.querySelectorAll('main > section, main > .doc-page, .site-footer')];
function onScroll() {
  header.classList.toggle('is-scrolled', scrollY > 8);
  const y = header.offsetHeight / 2;
  const s = sections.find((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
  if (s && !header.classList.contains('has-menu')) header.dataset.theme = s.classList.contains('doc-page') ? 'light' : s.dataset.theme || 'light';
  if (subnav) {
    const stuck = subnav.getBoundingClientRect().top <= header.offsetHeight + 1;
    subnav.classList.toggle('is-stuck', stuck);
    header.classList.toggle('under-subnav', stuck);
  }
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ------------------------------------------------------ link ativo do menu da página
if (subnav) {
  const links = [...subnav.querySelectorAll('.subnav-links a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach((t) => io.observe(t));
}

// ----------------------------------------------------------------- revelar ao rolar
const reveal = document.querySelectorAll('[data-reveal]');
if (!reduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  reveal.forEach((el, i) => { el.style.setProperty('--d', `${(i % 4) * 70}ms`); io.observe(el); });
} else reveal.forEach((el) => el.classList.add('is-in'));

// ------------------------------------------- produto do topo inclina com o ponteiro
const tilt = document.querySelector('[data-tilt]');
if (tilt && !reduced && matchMedia('(pointer: fine)').matches) {
  const hero = tilt.closest('section');
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    tilt.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`);
    tilt.style.setProperty('--gx', `${(50 + x * 40).toFixed(1)}%`);
    tilt.style.setProperty('--gy', `${(50 + y * 40).toFixed(1)}%`);
  });
  hero.addEventListener('pointerleave', () => { tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg'); });
}

// ------------------------------------------------ YouTube carrega só depois do clique
document.addEventListener('click', (e) => {
  const play = e.target.closest('.yt-play');
  if (!play) return;
  const box = play.closest('.yt');
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
  f.title = play.getAttribute('aria-label');
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  box.replaceChildren(f);
  box.classList.add('is-playing');
});

// ------------------------------------------------- toque nos botões (feedback)
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

// ----------------------------------------------------------- formulários de contato
for (const form of document.querySelectorAll('.lead-form')) {
  const error = form.querySelector('.form-error');
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
      error.textContent = `Preencha ${missing.join(' e ')} para enviar.`;
      error.hidden = false;
      form.elements[missing[0] === 'seu nome' ? 'nome' : 'tel'].focus();
      return;
    }
    error.hidden = true;
    const suporte = data.departamento === 'Suporte técnico';
    const lines = [
      suporte ? 'Olá! Preciso de suporte técnico.' : `Olá! Tenho interesse em: ${form.dataset.interest}.`,
      `Nome: ${data.nome}`,
      `Telefone: ${data.tel}`,
      data.email ? `E-mail: ${data.email}` : '',
      data.area ? `Área: ${data.area}` : '',
      data.assunto ? `Assunto: ${data.assunto}` : '',
      data.msg ? `Mensagem: ${data.msg}` : '',
    ].filter(Boolean);
    window.dispatchEvent(new CustomEvent('qpx:lead', { detail: { source: 'form', area: data.area || data.departamento } }));
    const num = suporte ? '5531991577018' : WA;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
}

// ------------------------------------------------ compra pelo WhatsApp (produtos da loja)
for (const box of document.querySelectorAll('.buy-box')) {
  const price = box.querySelector('[data-price]');
  box.addEventListener('change', (e) => {
    if (e.target.name === 'v') price.textContent = e.target.dataset.price;
  });
  box.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = box.querySelector('input[name="v"]:checked') || box.querySelector('input[name="v"]');
    const item = [box.dataset.buy, v?.value].filter(Boolean).join(' ');
    const text = `Olá! Quero comprar: ${item}, por R$ ${v?.dataset.price}. Pode me passar o frete e as formas de pagamento?`;
    window.dispatchEvent(new CustomEvent('qpx:lead', { detail: { source: 'compra', product: item } }));
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}

// --------------------------------------------- mapa do Google só depois do clique
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.map-load');
  if (!btn) return;
  const box = btn.closest('[data-map]');
  const f = document.createElement('iframe');
  f.src = box.dataset.map;
  f.title = 'Mapa do showroom da Qualipix em São Paulo';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  box.replaceChildren(f);
});

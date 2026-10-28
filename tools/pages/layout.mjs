// Partes comuns das páginas: <head>, cabeçalho com menus, rodapé e blocos de conteúdo.
// Os links do menu e do rodapé repetem os caminhos do site atual (www.qualipix.com.br).
export const WA = '5511971756835';
export const WA_SUPORTE = '5531991577018';
export const V = 4; // versão dos arquivos estáticos (cache)

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const wa = (text, num = WA) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

// ------------------------------------------------------------ menus do site atual
export const PRODUCTS = [
  { href: '/lousa-digital/', name: 'Lousa Digital', desc: 'Monitor com função touchscreen nativa de 32" a 98"', img: 'lousa' },
  { href: '/moldura-touch', name: 'Molduras Touch', desc: 'Transforme sua TV comum em uma TV touch de 32" a 85"', img: 'moldura' },
  { href: '/lousamax80', name: 'Lousa Branca Interativa', desc: 'Lousa interativa para uso com Data Show', img: 'max80' },
  { href: '/quadro-branco', name: 'Quadro Híbrido', desc: 'Quadro branco com lousa digital integrada e plataforma com IA', img: 'quadro' },
  { href: '/totem-interativo', name: 'Totens', desc: 'Display angulado com base de piso especial de 32" a 55"', img: 'totem' },
  { href: '/flip-chart', name: 'Flip Chart Digital', desc: 'Monitor touch na vertical com suporte de piso', img: 'flip' },
  { href: '/acessorios/', name: 'Acessórios', desc: 'Suportes, ponteiras e computador OPS para a sua lousa', img: 'acessorios' },
];
export const SEGMENTS = [
  { href: '/corporativo', name: 'Corporativo', desc: 'Lousas digitais para reuniões, treinamentos e colaboração' },
  { href: '/educacao', name: 'Educação', desc: 'Tecnologia que transforma a forma de ensinar e aprender' },
  { href: '/eventos', name: 'Eventos', desc: 'Experiências visuais de alto impacto para eventos memoráveis' },
  { href: '/governo', name: 'Governo', desc: 'Tecnologia para escolas públicas' },
  { href: '/saude', name: 'Saúde', desc: 'Apresente exames e diagnósticos com mais interatividade' },
  { href: '/arquitetos', name: 'Arquitetos e Engenheiros', desc: 'Tecnologia touch para elevar a experiência dos seus projetos' },
];
const INSTITUCIONAL = [
  ['/blog/', 'Nosso blog'], ['/catalogos/', 'Catálogos'], ['/m/empresa/', 'Empresa'], ['/class/', 'QualipixClass'],
  ['https://heyzine.com/flip-book/df2b60bda2.html', 'Catálogo de Produtos'], ['/m/instrucoes-dx-series/', 'Instruções DX Series'],
  ['/m/instrucoes-sx-series/', 'Instruções SX Series'], ['/m/qual-solucao-escolher/', 'Qual solução escolher'],
  ['/m/politica-de-privacidade/', 'Política de privacidade'], ['/m/tutoriais/', 'Tutoriais'], ['/m/download/', 'Download'],
];
const AJUDA = [
  ['/central/pedidos/', 'Meus pedidos'], ['/central/dados/', 'Meus dados'], ['/faq/', 'Dúvidas frequentes'],
  ['/m/trocas-e-devolucoes/', 'Trocas e devoluções'], ['/fale-conosco/', 'Fale conosco'],
];

const link = (href, label, extra = '') => {
  const ext = /^https?:/.test(href);
  return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}${extra}>${label}</a>`;
};
const thumb = (img) => img === 'acessorios'
  ? `<span class="menu-thumb menu-thumb-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20 14 10m2-6 4 4-3 3-4-4zM9 15l-2-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>`
  : `<span class="menu-thumb" aria-hidden="true"><img src="/assets/renders/${img}.webp" alt="" width="96" height="72" loading="lazy"></span>`;

export function header({ theme = 'dark', current = '' } = {}) {
  const prodMenu = PRODUCTS.map((p) => `<a class="menu-card" href="${p.href}">${thumb(p.img)}<span><strong>${esc(p.name)}</strong><small>${esc(p.desc)}</small></span></a>`).join('');
  const segMenu = SEGMENTS.map((s) => `<a class="menu-card menu-card-text" href="${s.href}"><span><strong>${esc(s.name)}</strong><small>${esc(s.desc)}</small></span></a>`).join('');
  const cur = (h) => (current === h ? ' aria-current="page"' : '');
  const waHref = wa('Olá! Vim pelo site e quero falar com um especialista.');
  return `<header class="site-header" data-theme="${theme}">
    <div class="wrap header-row">
      <a class="brand" href="/" aria-label="Qualipix, página inicial">
        <img class="logo-light" src="/assets/img/logo-qualipix-branco.png" alt="Qualipix" width="350" height="93"><img class="logo-dark" src="/assets/img/logo-qualipix.png" alt="" width="350" height="93">
      </a>
      <nav class="nav" aria-label="Principal">
        <a href="/"${cur('/')}>Início</a>
        <div class="nav-item">
          <button class="nav-btn" type="button" aria-expanded="false" aria-controls="menu-produtos">Produtos</button>
          <div class="nav-menu nav-menu-products" id="menu-produtos">${prodMenu}</div>
        </div>
        <div class="nav-item">
          <button class="nav-btn" type="button" aria-expanded="false" aria-controls="menu-segmentos">Segmentos</button>
          <div class="nav-menu nav-menu-segments" id="menu-segmentos">${segMenu}</div>
        </div>
        <a href="/m/empresa/"${cur('/m/empresa/')}>Empresa</a>
        <a href="/fale-conosco/"${cur('/fale-conosco/')}>Contato</a>
      </nav>
      <a class="btn btn-primary btn-sm header-cta" href="${waHref}" target="_blank" rel="noopener">Falar com especialista</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span><span class="sr-only">Abrir menu</span></button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Menu">
      <a href="/">Início</a>
      <details><summary>Produtos</summary><div>${PRODUCTS.map((p) => `<a href="${p.href}">${esc(p.name)}</a>`).join('')}</div></details>
      <details><summary>Segmentos</summary><div>${SEGMENTS.map((s) => `<a href="${s.href}">${esc(s.name)}</a>`).join('')}</div></details>
      <a href="/m/empresa/">Empresa</a>
      <a href="/fale-conosco/">Contato</a>
      <a class="btn btn-primary" href="${waHref}" target="_blank" rel="noopener">Falar com especialista</a>
    </nav>
  </header>`;
}

export function footer() {
  const col = (title, items) => `<div class="footer-col"><h2>${title}</h2><ul role="list">${items.map(([h, l]) => `<li>${link(h, esc(l))}</li>`).join('')}</ul></div>`;
  return `<footer class="site-footer" data-theme="dark">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-about">
          <a class="brand brand-footer" href="/" aria-label="Qualipix, página inicial">
            <img class="logo-light" src="/assets/img/logo-qualipix-branco.png" alt="Qualipix" width="350" height="93"><img class="logo-dark" src="/assets/img/logo-qualipix.png" alt="" width="350" height="93">
          </a>
          <p>Fabricante brasileira de lousas digitais, molduras touch, quadros híbridos, totens e flip charts digitais desde 2012.</p>
          <div class="footer-social">
            <a href="https://www.instagram.com/qualipix/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg></a>
            <a href="https://www.facebook.com/Qualipix-494746560550329/" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h2.5V4.5H14c-2.2 0-3.8 1.7-3.8 3.9V11H8v3.4h2.2V21h3.5v-6.6h2.5l.5-3.4h-3V8.6c0-.4.2-.6.3-.6z" fill="currentColor"/></svg></a>
            <a href="https://www.youtube.com/channel/UCKTfaSCrtlIroarM-C3dU4g" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg></a>
          </div>
        </div>
        <div class="footer-cols">
          ${col('Produtos', PRODUCTS.map((p) => [p.href, p.name]))}
          ${col('Segmentos', SEGMENTS.map((s) => [s.href, s.name]))}
          ${col('Institucional', INSTITUCIONAL)}
          ${col('Precisa de ajuda?', AJUDA)}
        </div>
      </div>
      <div class="footer-contact">
        <div><h2>Unidade São Paulo</h2><p>Alameda Santos, 1773, conj. 1003, Cerqueira César, São Paulo/SP, CEP 01419-100</p><p><a href="tel:+551126904299">(11) 2690-4299</a> telefone · <a href="https://wa.me/${WA}" target="_blank" rel="noopener">(11) 97175-6835</a> WhatsApp</p></div>
        <div><h2>Unidade Belo Horizonte</h2><p>Rua das Canoas, 970, Betânia, Belo Horizonte/MG, CEP 30570-068</p><p><a href="tel:+553135686835">(31) 3568-6835</a> telefone</p></div>
        <div><h2>Suporte técnico</h2><p><a href="https://wa.me/${WA_SUPORTE}" target="_blank" rel="noopener">(31) 99157-7018</a> WhatsApp</p><p><a href="mailto:contato@qualipix.com.br">contato@qualipix.com.br</a></p></div>
      </div>
      <div class="footer-legal">
        <p>© 2026 Qualipix Tecnologia em Equipamentos Audiovisuais Ltda. CNPJ 16.915.236/0001-98. Todos os direitos reservados.</p>
        <button type="button" class="footer-link-btn" data-cookie-prefs>Preferências de cookies</button>
      </div>
    </div>
  </footer>

  <a class="wa-float is-on" href="${wa('Olá! Vim pelo site da Qualipix.')}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5.1 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.7-.5z"/></svg>
  </a>`;
}

export function head(page, site) {
  const url = site + page.path;
  const canonical = site + (page.canonical || page.path);
  const title = page.metaTitle || `${page.title} | Qualipix`;
  const ld = (page.ld || []).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ');
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <script src="/js/env.js?v=${V}"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(page.description)}">
  ${page.noindex ? '<meta name="robots" content="noindex, follow">\n  ' : ''}<meta name="theme-color" content="#081217">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${site}/assets/img/og-qualipix.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${esc(canonical)}">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css?v=${V}">
  <link rel="stylesheet" href="/css/pages.css?v=${V}">
  <script type="module" src="/js/page.js?v=${V}"></script>
  ${ld}
</head>`;
}

// Desenhos de traço para acessórios sem render 3D
const svg = (d) => `<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const ICONS = {
  pen: svg('<path d="M30 70 82 18l8 8-52 52-12 4z"/><path d="m76 24 8 8"/><path d="M30 70l-4 12"/><circle cx="92" cy="72" r="3" fill="currentColor"/>'),
  stand: svg('<rect x="34" y="10" width="52" height="32" rx="2"/><path d="M60 42v34M42 76h36M44 82h0M76 82h0"/><path d="M48 58h24"/><circle cx="44" cy="82" r="3"/><circle cx="76" cy="82" r="3"/>'),
  pc: svg('<rect x="30" y="22" width="60" height="44" rx="4"/><path d="M38 34h20M38 42h12"/><circle cx="78" cy="56" r="3"/><path d="M84 30v6"/>'),
  frame: svg('<rect x="16" y="14" width="88" height="56" rx="3"/><rect x="24" y="22" width="72" height="40" rx="1" stroke-dasharray="3 4"/><path d="M52 80h16M60 70v10"/>'),
  tool: svg('<path d="M70 18a14 14 0 0 0-18 18L24 64l8 8 28-28a14 14 0 0 0 18-18l-8 8-8-8z"/>'),
  box: svg('<path d="M60 12 98 30v32L60 80 22 62V30z"/><path d="M22 30l38 18 38-18M60 48v32"/>'),
};

// --------------------------------------------------------------- blocos de conteúdo
const para = (t) => (Array.isArray(t) ? t : t ? [t] : []).map((p) => `<p>${p}</p>`).join('');
const crumbs = (items) => items?.length ? `<nav class="crumbs" aria-label="Você está em"><ol role="list"><li><a href="/">Página inicial</a></li>${items.map(([h, l], i) => `<li>${i === items.length - 1 ? `<span aria-current="page">${esc(l)}</span>` : `<a href="${h}">${esc(l)}</a>`}</li>`).join('')}</ol></nav>` : '';
const btn = (a) => `<a class="btn ${a.primary ? 'btn-primary' : 'btn-ghost'}" href="${esc(a.href)}"${/^https?:/.test(a.href) ? ' target="_blank" rel="noopener"' : ''}${a.product ? ` data-product="${esc(a.product)}"` : ''}>${esc(a.label)}</a>`;

export const blocks = {
  hero(b, page) {
    const media = b.img
      ? `<div class="p-hero-media" data-tilt><div class="p-hero-glow" aria-hidden="true"></div><img src="/assets/renders/${b.img}.webp" alt="${esc(b.imgAlt || '')}" width="1200" height="900" fetchpriority="high"></div>`
      : b.photo ? `<div class="p-hero-media p-hero-photo"><img src="${b.photo}" alt="${esc(b.imgAlt || '')}" width="800" height="800" fetchpriority="high"></div>` : '';
    return `<section class="p-hero${media ? '' : ' p-hero-text'}" data-theme="dark">
      <div class="p-hero-bg" aria-hidden="true"></div>
      <div class="wrap p-hero-grid">
        <div class="p-hero-copy">
          ${crumbs(page.crumbs)}
          ${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}
          <h1 class="p-title">${b.title}</h1>
          ${b.lead ? `<p class="p-lead">${b.lead}</p>` : ''}
          ${b.actions?.length ? `<div class="p-actions">${b.actions.map(btn).join('')}</div>` : ''}
        </div>
        ${media}
      </div>
      ${b.chips?.length ? `<div class="wrap"><ul class="p-chips" role="list">${b.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
    </section>`;
  },

  subnav(b) {
    return `<nav class="subnav" aria-label="Nesta página"><div class="wrap subnav-row">
      <p class="subnav-title">${esc(b.title)}</p>
      <div class="subnav-links">${b.items.map(([h, l]) => `<a href="${esc(h)}">${esc(l)}</a>`).join('')}</div>
      ${b.cta ? `<a class="btn btn-primary btn-sm" href="${esc(b.cta[0])}"${b.product ? ` data-product="${esc(b.product)}"` : ''}>${esc(b.cta[1])}</a>` : ''}
    </div></nav>`;
  },

  intro(b) {
    return `<section class="p-section p-intro" ${b.id ? `id="${b.id}" ` : ''}data-theme="light">
      <div class="wrap p-intro-grid">
        <div><h2 class="h2 p-h2">${b.title}</h2></div>
        <div class="p-prose">${para(b.text)}${b.list ? `<ul class="p-list">${b.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}</div>
      </div>
    </section>`;
  },

  benefits(b) {
    return `<section class="p-section p-benefits" ${b.id ? `id="${b.id}" ` : ''}data-theme="${b.dark ? 'dark' : 'light'}">
      <div class="wrap">
        <header class="p-head">${b.title ? `<h2 class="h2 p-h2">${b.title}</h2>` : ''}${b.lead ? `<p class="lead">${b.lead}</p>` : ''}</header>
        <ol class="benefit-grid${b.items.length === 3 ? ' is-3' : ''}" role="list">${b.items.map((it, i) => `<li class="benefit" data-reveal><span class="benefit-n">${String(i + 1).padStart(2, '0')}</span><h3>${it.t}</h3><p>${it.d}</p></li>`).join('')}</ol>
      </div>
    </section>`;
  },

  lines(b) {
    return `<section class="p-section p-lines" id="${b.id || 'linhas'}" data-theme="light">
      <div class="wrap">
        <header class="p-head"><h2 class="h2 p-h2">${b.title}</h2>${b.lead ? `<p class="lead">${b.lead}</p>` : ''}</header>
        <div class="line-grid">${b.items.map((l) => `<article class="line-card" data-reveal>
          <div class="line-top">${l.kicker ? `<p class="kicker kicker-dark">${esc(l.kicker)}</p>` : ''}<h3>${esc(l.name)}</h3>${l.sizes ? `<p class="line-sizes">${esc(l.sizes)}</p>` : ''}</div>
          ${l.img ? `<div class="line-img"><img src="/assets/renders/${l.img}.webp" alt="" width="1200" height="900" loading="lazy"></div>` : ''}
          <ul class="line-points" role="list">${l.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <div class="line-actions">${(l.actions || []).map(btn).join('')}</div>
        </article>`).join('')}</div>
      </div>
    </section>`;
  },

  products(b) {
    const items = b.items.map((h) => PRODUCTS.find((p) => p.href === h) || h);
    return `<section class="p-section p-products" ${b.id ? `id="${b.id}" ` : ''}data-theme="light">
      <div class="wrap">
        <header class="p-head"><h2 class="h2 p-h2">${b.title}</h2>${b.lead ? `<p class="lead">${b.lead}</p>` : ''}</header>
        <div class="card-grid">${items.map((p) => `<a class="p-card" href="${p.href}" data-reveal>
          <div class="p-card-img">${p.img && p.img !== 'acessorios' ? `<img src="/assets/renders/${p.img}.webp" alt="" width="1200" height="900" loading="lazy">` : p.photo ? `<img src="${p.photo}" alt="" loading="lazy">` : `<span class="p-card-icon" aria-hidden="true">${ICONS[p.icon] || ICONS.box}</span>`}</div>
          <div class="p-card-body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>${p.price ? `<p class="p-card-price">${esc(p.price)}</p>` : ''}<span class="link">${esc(p.cta || 'Conhecer')}</span></div>
        </a>`).join('')}</div>
      </div>
    </section>`;
  },

  video(b) {
    return `<section class="p-section p-video" ${b.id ? `id="${b.id}" ` : ''}data-theme="dark">
      <div class="wrap p-video-grid">
        <header><h2 class="h2 p-h2">${b.title}</h2>${b.lead ? `<p class="lead">${b.lead}</p>` : ''}</header>
        <div class="yt" data-yt="${esc(b.youtube)}">
          ${b.poster ? `<img src="/assets/renders/${b.poster}.webp" alt="" width="1200" height="900" loading="lazy">` : ''}
          <button type="button" class="yt-play" aria-label="Assistir ao vídeo: ${esc(b.label || b.title.replace(/<[^>]+>/g, ''))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>Assistir ao vídeo</span></button>
          <p class="yt-note">O vídeo abre do YouTube quando você clicar.</p>
        </div>
      </div>
    </section>`;
  },

  faq(b) {
    return `<section class="faq p-faq" id="${b.id || 'faq'}" data-theme="light">
      <div class="wrap faq-grid">
        <h2 class="h2 p-h2">${b.title || 'Perguntas frequentes'}</h2>
        <div class="faq-list">${b.items.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}</div>
      </div>
    </section>`;
  },

  specs(b) {
    return `<section class="p-section p-specs" id="${b.id || 'especificacoes'}" data-theme="light">
      <div class="wrap p-specs-grid">
        <header><h2 class="h2 p-h2">${b.title || 'Especificações'}</h2>${b.lead ? `<p class="lead">${b.lead}</p>` : ''}</header>
        <dl class="spec-table">${b.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${Array.isArray(v) ? `<ul role="list">${v.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </section>`;
  },

  statement(b) {
    return `<section class="p-section p-statement" data-theme="dark">
      <div class="wrap"><p class="statement" data-reveal>${b.text}</p>${b.sub ? `<p class="lead">${b.sub}</p>` : ''}</div>
    </section>`;
  },

  prose(b, page) {
    return `<div class="doc-page${b.wide ? ' doc-wide' : ''}">
      <div class="wrap">
        ${crumbs(page.crumbs)}
        <h1>${b.title || page.title}</h1>
        ${b.updated ? `<p class="updated">${esc(b.updated)}</p>` : ''}
        ${b.html}
      </div>
    </div>`;
  },

  // produto da loja: preço por tamanho e compra pelo WhatsApp
  buy(b, page) {
    const vars = b.variations || [];
    const first = vars[0];
    const media = b.img
      ? `<div class="p-hero-media" data-tilt><div class="p-hero-glow" aria-hidden="true"></div><img src="/assets/renders/${b.img}.webp" alt="${esc(b.imgAlt || b.name)}" width="1200" height="900" fetchpriority="high"></div>`
      : `<div class="p-hero-media buy-icon" aria-hidden="true">${ICONS[b.icon] || ICONS.box}</div>`;
    const groups = b.groups || [{ label: b.varLabel || 'Tamanho', items: vars }];
    return `<section class="p-hero p-buy" data-theme="dark">
      <div class="p-hero-bg" aria-hidden="true"></div>
      <div class="wrap p-hero-grid">
        <div class="p-hero-copy">
          ${crumbs(page.crumbs)}
          ${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}
          <h1 class="p-title p-title-sm">${esc(b.name)}</h1>
          ${b.lead ? `<p class="p-lead">${b.lead}</p>` : ''}
          <form class="buy-box" data-buy="${esc(b.name)}">
            <p class="buy-price"><small>${vars.length > 1 ? 'Preço do tamanho escolhido' : 'Preço'}</small><strong data-price>${esc(first?.[1] || b.price || 'Sob consulta')}</strong></p>
            ${vars.length > 1 ? groups.map((g, gi) => `<fieldset class="buy-vars"><legend>${esc(g.label)}</legend><div class="chips">${g.items.map(([l, p], i) => `<label><input type="radio" name="v" value="${esc(l)}" data-price="${esc(p)}"${gi === 0 && i === 0 ? ' checked' : ''}><span>${esc(l)}</span></label>`).join('')}</div></fieldset>`).join('') : `<input type="hidden" name="v" value="" data-price="${esc(first?.[1] || b.price || '')}">`}
            <div class="p-actions">
              <button class="btn btn-primary" type="submit">Comprar pelo WhatsApp</button>
              ${b.landing ? `<a class="btn btn-ghost" href="${esc(b.landing[0])}">${esc(b.landing[1])}</a>` : ''}
            </div>
            <p class="buy-note">${b.note || 'Preços da loja em 28/10/2026, sujeitos a alteração. O frete é calculado no atendimento, pelo seu CEP.'}</p>
          </form>
        </div>
        ${media}
      </div>
    </section>`;
  },

  columns(b) {
    return `<section class="p-section p-columns" ${b.id ? `id="${b.id}" ` : ''}data-theme="light">
      <div class="wrap">
        ${b.title ? `<header class="p-head"><h2 class="h2 p-h2">${b.title}</h2>${b.lead ? `<p class="lead">${b.lead}</p>` : ''}</header>` : ''}
        <div class="col-grid">${b.cols.map((c) => `<div class="col-card" data-reveal><h3>${esc(c.title)}</h3>${c.text ? `<p>${c.text}</p>` : ''}<ul class="line-points" role="list">${c.items.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>
      </div>
    </section>`;
  },

  html(b) { return b.html; },

  cta(b, page) {
    const areas = ['Educação', 'Corporativo', 'Governo', 'Saúde', 'Eventos', 'Arquitetura e engenharia'];
    return `<section class="contact p-cta" id="${b.id || 'help'}" data-theme="dark">
      <div class="wrap contact-grid">
        <div class="contact-text">
          <h2 class="h2">${b.title || 'Precisa de ajuda?'}</h2>
          <p class="lead">${b.lead || 'Fale com um de nossos especialistas. A mensagem abre no WhatsApp da Qualipix já preenchida, e respondemos em horário comercial.'}</p>
          <ul class="perks-mini" role="list">
            <li><strong>Suporte humanizado</strong> Atendimento via WhatsApp e chamada de vídeo.</li>
            <li><strong>Vasta experiência</strong> Há mais de 10 anos no mercado brasileiro.</li>
            <li><strong>Tecnologia de ponta</strong> Garantia de precisão e sensibilidade no touch.</li>
            <li><strong>Satisfação garantida</strong> Qualidade no produto com atendimento de excelência.</li>
          </ul>
        </div>
        <form class="contact-form lead-form" novalidate data-interest="${esc(b.interest || page.title)}">
          <div class="field"><label for="f-nome">Nome completo</label><input id="f-nome" name="nome" autocomplete="name" required></div>
          <div class="field"><label for="f-tel">Telefone</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" required></div>
          <div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
          <div class="field"><label for="f-area">Área de atuação</label>
            <select id="f-area" name="area">${areas.map((a) => `<option${a === b.area ? ' selected' : ''}>${a}</option>`).join('')}</select>
          </div>
          <div class="field field-wide"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="msg" rows="4" placeholder="${esc(b.placeholder || 'Conte o que você precisa: quantidade, tamanho, cidade')}"></textarea></div>
          <p class="form-error" role="alert" hidden></p>
          <button class="btn btn-primary btn-lg" type="submit">Falar com especialista</button>
        </form>
      </div>
    </section>`;
  },
};

export function render(page, site) {
  const body = page.blocks.map((b) => blocks[b.type](b, page)).join('\n');
  const isDoc = page.blocks.some((b) => b.type === 'prose');
  const theme = isDoc || page.lightHeader ? 'light' : 'dark';
  return `${head(page, site)}
<body class="page-${page.kind || 'inner'}">
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  ${header({ theme, current: page.path })}
  <main id="conteudo">
${body}
  </main>
  ${footer()}
</body>
</html>
`;
}

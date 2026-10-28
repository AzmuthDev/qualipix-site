// Blog: posts exportados do painel da Wbuy (blog/posts-wbuy.json) em 28/10/2026.
// O HTML do painel vem com estilos e atributos colados de editores; aqui fica só a estrutura.
import fs from 'node:fs';
import { esc } from '../layout.mjs';

const posts = JSON.parse(fs.readFileSync(new URL('./blog/posts-wbuy.json', import.meta.url), 'utf8'));
// datas da listagem do painel (o arquivo exportado não traz a data)
const DATES = { 26816: '2026-10-19', 26246: '2026-08-31', 26046: '2026-08-17', 25898: '2026-08-06', 25841: '2026-07-30', 25447: '2026-07-17', 9780: '2023-07-21', 585: '2020-04-27', 496: '2020-03-13', 458: '2020-02-21', 456: '2020-02-21', 455: '2020-02-21', 391: '2019-12-18', 390: '2019-12-18', 389: '2019-12-18', 388: '2019-12-18', 387: '2019-12-18' };
const ALLOWED = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'img', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'br', 'figure', 'figcaption']);
const RENAME = { b: 'strong', i: 'em', h1: 'h2', h5: 'h4', h6: 'h4' };
const CDN = 'https://cdn.sistemawbuy.com.br';

// links antigos dos posts que já não existem no site atual
const OLD = { '/lousas/': '/m/lousas/', '/faleconosco': '/fale-conosco/', '/monitores---tv-touch': '/lousa-digital/' };

function absolute(url) {
  if (/^\/arquivos\//.test(url)) return CDN + url;
  const local = url.replace(/^https?:\/\/(www\.)?qualipix\.com\.br(?=\/)/, '');
  return OLD[local] || local;
}

export function clean(html) {
  let s = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<iframe[^>]*src="https?:\/\/www\.youtube\.com\/embed\/([\w-]+)[^"]*"[^>]*>\s*<\/iframe>/gi, '\u0000yt:$1\u0000')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  s = s.replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, (m, close, tag, attrs) => {
    tag = tag.toLowerCase();
    tag = RENAME[tag] || tag;
    if (!ALLOWED.has(tag)) return tag === 'div' || tag === 'section' ? (close ? '\n' : '\n') : '';
    if (close) return `</${tag}>`;
    if (tag === 'a') {
      const href = attrs.match(/href="([^"]*)"/i)?.[1];
      if (!href) return '<a>';
      const url = absolute(href);
      return /^https?:/.test(url) ? `<a href="${url}" target="_blank" rel="noopener">` : `<a href="${url}">`;
    }
    if (tag === 'img') {
      const src = attrs.match(/src="([^"]*)"/i)?.[1];
      const alt = attrs.match(/alt="([^"]*)"/i)?.[1] || '';
      return src ? `<img src="${absolute(src)}" alt="${alt}" loading="lazy">` : '';
    }
    return `<${tag}>`;
  });
  s = s
    .replace(/&nbsp;/g, ' ')
    .replace(/<a>([\s\S]*?)<\/a>/g, '$1')
    .replace(/<(p|h2|h3|h4|li|strong|em)>\s*<\/\1>/g, '')
    .replace(/\u0000yt:([\w-]+)\u0000/g, (m, id) => `<div class="yt" data-yt="${id}"><button type="button" class="yt-play" aria-label="Assistir ao vídeo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>Assistir ao vídeo</span></button></div>`)
    .replace(/\n{2,}/g, '\n')
    .trim();
  // texto solto fora de bloco vira parágrafo
  s = s.split('\n').map((line) => (line && !/^<(p|h\d|ul|ol|li|blockquote|table|thead|tbody|tr|figure|div|\/)/.test(line.trim()) ? `<p>${line.trim()}</p>` : line)).join('\n');
  return s;
}

const fmt = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const list = posts.map((p) => {
  const body = clean(p.html);
  const byline = body.match(/^<p>(Por [^<]{3,80})<\/p>/);
  const text = plain(body.replace(/^<p>Por [^<]*<\/p>/, ''));
  return { ...p, body: byline ? body.replace(byline[0], '') : body, byline: byline?.[1], iso: DATES[p.id], excerpt: p.seo_description || text.slice(0, 155).replace(/\s\S*$/, '') + '…' };
}).sort((a, b) => b.iso.localeCompare(a.iso) || b.id - a.id);

const art = (p) => `<p class="post-meta"><time datetime="${p.iso}">${fmt(p.iso)}</time>${p.byline ? ` · ${esc(p.byline)}` : ''}</p>
  <div class="post-body">${p.body}</div>
  <div class="doc-note">Quer ver isso na prática? <a href="/fale-conosco/">Agende uma demonstração</a> ou fale com um especialista pelo <a href="https://wa.me/5511971756835" target="_blank" rel="noopener">WhatsApp</a>.</div>`;

export default [
  {
    path: '/blog/', title: 'Nosso blog', kind: 'doc', description: 'Blog da Qualipix: lousas digitais, tecnologia na educação, salas de reunião e comunicação interativa.',
    crumbs: [['/blog/', 'Blog']],
    blocks: [{ type: 'prose', title: 'Nosso blog', wide: true, html: `<p class="lead-text">Lousas digitais, tecnologia na educação, reuniões mais produtivas e comunicação interativa.</p>
      <div class="doc-cards post-list">${list.map((p) => `<a class="doc-card post-card" href="/blog/${p.slug}/"><p class="post-meta"><time datetime="${p.iso}">${fmt(p.iso)}</time></p><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="link">Ler artigo</span></a>`).join('')}</div>` }],
  },
  ...list.map((p) => ({
    path: `/blog/${p.slug}/`, title: p.title, kind: 'doc', description: p.excerpt,
    metaTitle: `${p.seo_title || p.title} | Blog Qualipix`,
    crumbs: [['/blog/', 'Blog'], [`/blog/${p.slug}/`, p.title]],
    ld: [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, datePublished: p.iso, author: { '@type': p.byline ? 'Person' : 'Organization', name: p.byline ? p.byline.replace(/^Por\s+/, '').split('|')[0].trim() : 'Qualipix' }, publisher: { '@id': 'https://www.qualipix.com.br/#organizacao' } }],
    blocks: [{ type: 'prose', title: esc(p.title), html: art(p) }],
  })),
];

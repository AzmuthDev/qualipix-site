// Gera as páginas internas com os mesmos caminhos do site atual (www.qualipix.com.br).
// Uso: node tools/pages/build.mjs
//   - cada página de tools/pages/content/*.mjs vira <caminho>/index.html na raiz do site
//   - o cabeçalho e o rodapé da página inicial (index.html) são atualizados com os mesmos menus
//   - seo/pages.json lista as páginas para o sitemap (tools/migration/build.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, header, footer, esc, V } from './layout.mjs';
import produtos from './content/produtos.mjs';
import segmentos from './content/segmentos.mjs';
import loja from './content/loja.mjs';
import institucional from './content/institucional.mjs';
import extra from './content/extra.mjs';
import blog from './content/blog.mjs';
import { GALLERIES, SEGMENT_PHOTOS, HOME_SEGMENTS } from './content/fotos.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'seo/config.json'), 'utf8'));
const site = cfg.siteUrl.replace(/\/$/, '');
const pages = [...produtos, ...segmentos, ...loja, ...institucional, ...extra, ...blog];

// fotos reais: mosaico antes do vídeo (ou das perguntas, ficha, contato) e foto no topo dos segmentos
for (const p of pages) {
  if (p.redirect) continue;
  const seg = p.kind === 'segmento' && SEGMENT_PHOTOS[(p.canonical || p.path).replace(/\//g, '')];
  const g = GALLERIES[p.path] || (seg && { title: 'Veja onde a Qualipix já está.', items: seg.items });
  if (seg) {
    const hero = p.blocks.find((b) => b.type === 'hero');
    hero.bg = seg.bg;
    delete hero.img;
  }
  if (!g) continue;
  const { second, ...gallery } = g;
  const top = p.blocks.findIndex((b) => b.type === 'subnav');
  const at = second ? (top > -1 ? top : 0) + 1 : ['video', 'faq', 'specs', 'cta'].map((t) => p.blocks.findIndex((b) => b.type === t)).find((i) => i > -1);
  p.blocks.splice(at ?? p.blocks.length, 0, { type: 'gallery', ...gallery });
  // capa do vídeo: a segunda foto do mosaico (a primeira já aparece grande logo acima)
  const video = p.blocks.find((b) => b.type === 'video');
  if (video) video.photo = (g.items[1] || g.items[0])[0];
}

// caminhos repetidos ou que colidem com arquivos do site
const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) throw new Error(`caminho repetido: ${p.path}`);
  seen.add(p.path);
}

const fileOf = (p) => path.join(ROOT, p.endsWith('/') ? p + 'index.html' : p);
function write(p, html) {
  const f = fileOf(p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

// endereço antigo: página mínima que leva à equivalente (o nginx faz o 301 quando aplicado)
const redirectHtml = (p) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${esc(p.title)} | Qualipix</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${site}${p.redirect}">
  <meta http-equiv="refresh" content="0; url=${p.redirect}">
</head>
<body><p>Esta página mudou de endereço: <a href="${p.redirect}">${esc(p.title)}</a>.</p></body>
</html>
`;

const manifest = [];
for (const p of pages) {
  if (p.redirect) { write(p.path, redirectHtml(p)); continue; }
  write(p.path, render(p, site));
  if (!p.canonical && !p.noindex) manifest.push({ path: p.path, kind: p.kind || 'inner' });
}

// página inicial: mesmo cabeçalho e rodapé das internas
const homeFile = path.join(ROOT, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
const mark = (name, html) => `<!-- layout:${name} (gerado por tools/pages/build.mjs) -->\n  ${html}\n  <!-- /layout:${name} -->`;
const swap = (name, re, html) => {
  const marked = new RegExp(`<!-- layout:${name} [\\s\\S]*?<!-- /layout:${name} -->`);
  home = marked.test(home) ? home.replace(marked, mark(name, html)) : home.replace(re, mark(name, html));
};
swap('header', /<header class="site-header"[\s\S]*?<\/header>/, header({ theme: 'dark', current: '/' }));
swap('footer', /<footer class="site-footer"[\s\S]*?<\/footer>\s*<a class="wa-float"[\s\S]*?<\/a>/, footer().replace('class="wa-float is-on"', 'class="wa-float"'));
for (const [id, [file, alt]] of Object.entries(HOME_SEGMENTS)) {
  const start = home.indexOf(`id="${id}"`);
  if (start < 0) continue;
  const end = home.indexOf('</div>', start);
  if (home.slice(start, end).includes('seg-photo')) continue;
  const ul = home.lastIndexOf('</ul>', end);
  const at = ul > start ? ul + 5 : end;
  home = home.slice(0, at) + `
              <figure class="seg-photo"><img src="assets/img/fotos/${file}.webp" alt="${alt}" loading="lazy" width="1600" height="870"></figure>` + home.slice(at);
}
if (!home.includes('css/pages.css')) home = home.replace(/(<link rel="stylesheet" href="css\/style\.css\?v=)\d+(">)/, `$1${V}$2\n  <link rel="stylesheet" href="css/pages.css?v=${V}">`);
home = home.replace(/(css\/(?:style|pages)\.css\?v=)\d+/g, `$1${V}`).replace(/(js\/(?:main|env)\.js\?v=)\d+/g, `$1${V}`);
fs.writeFileSync(homeFile, home);

fs.writeFileSync(path.join(ROOT, 'seo/pages.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`${pages.length} páginas geradas (${pages.filter((p) => p.redirect).length} redirecionamentos, ${pages.filter((p) => p.canonical).length} duplicadas com canonical); ${manifest.length} no sitemap`);

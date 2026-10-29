// Confere as páginas geradas: links internos, arquivos referenciados, erros no navegador.
// Uso: node tools/pages/check.mjs [--shots 1440 /lousa-digital/ /fale-conosco/ ...]
//   sem --shots: só a verificação de links (rápida, sem navegador)
//   com --shots: também abre cada caminho no Chrome e salva a página inteira em _review/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE || 'http://localhost:8090';
// caminhos que continuam na loja da Wbuy (área do cliente, carrinho)
const LOJA = /^\/(central|carrinho|checkout|login|contato)(\/|$)/;

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'tools', '.git', '_review', 'deploy', 'seo', '.claude', 'dist-seven'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const exists = (url) => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  const p = path.join(ROOT, clean);
  if (clean.endsWith('/')) return fs.existsSync(path.join(p, 'index.html'));
  return fs.existsSync(p) || fs.existsSync(path.join(p, 'index.html'));
};

let bad = 0;
const external = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = '/' + path.relative(ROOT, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, attr, url] of html.matchAll(/\s(href|src|data-yt|data-map)="([^"]+)"/g)) {
    if (attr === 'data-yt' || attr === 'data-map') continue;
    if (/^(mailto:|tel:|data:|javascript:)/.test(url)) continue;
    if (/^https?:/.test(url)) { external.add(new URL(url).host); continue; }
    if (url.startsWith('#')) { if (url.length > 1 && !ids.has(url.slice(1))) { bad++; console.log(`  âncora sem destino ${rel} -> ${url}`); } continue; }
    const abs = url.startsWith('/') ? url : path.posix.join(rel.endsWith('/') ? rel : path.posix.dirname(rel) + '/', url);
    if (LOJA.test(abs)) continue;
    if (!exists(abs)) { bad++; console.log(`  quebrado ${rel} -> ${url}`); }
  }
}
console.log(`${files.length} páginas, ${bad} link(s) quebrado(s). Domínios externos: ${[...external].sort().join(', ')}`);

const si = process.argv.indexOf('--shots');
if (si > -1) {
  const { default: puppeteer } = await import(pathToFileURL(path.join(ROOT, 'tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js')).href);
  const width = Number(process.argv[si + 1]) || 1440;
  const paths = process.argv.slice(si + 2);
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    defaultViewport: { width, height: width < 768 ? 800 : 900, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 },
  });
  fs.mkdirSync(path.join(ROOT, '_review'), { recursive: true });
  for (const p of paths) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.evaluateOnNewDocument(() => localStorage.setItem('qpx-consent-v1', JSON.stringify({ v: 1, at: Date.now(), analytics: false, ads: false })));
    await page.goto(BASE + p, { waitUntil: 'networkidle2' });
    // revela tudo para a captura de página inteira
    await page.evaluate(async () => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      await Promise.all([...document.images].map((img) => (img.complete ? 0 : new Promise((r) => { img.onload = img.onerror = r; }))));
      await new Promise((r) => setTimeout(r, 1200));
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const name = `pages-${width}-${p.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home'}.png`;
    await page.screenshot({ path: path.join(ROOT, '_review', name), fullPage: true });
    console.log(`${p}: ${errors.length ? 'ERROS ' + errors.join(' | ') : 'sem erros'}${overflow > 0 ? `, rolagem horizontal de ${overflow}px` : ''} -> _review/${name}`);
    await page.close();
  }
  await browser.close();
}

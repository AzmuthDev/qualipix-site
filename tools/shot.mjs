// Capturas de revisão: node tools/shot.mjs <largura>x<altura> <alvo>[@progresso] ...
// alvo = id de seção (ex.: produtos) ou número de pixels; @0.5 = metade da seção fixada
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:8090';
const [size = '1440x900', ...targets] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const mobile = w < 768;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
  defaultViewport: { width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 4500));
fs.mkdirSync(path.join(ROOT, '_review'), { recursive: true });
for (const t of targets.length ? targets : ['0']) {
  const [id, prog] = t.split('@');
  await page.evaluate(async (id, prog) => {
    let y = 0;
    if (/^\d+$/.test(id)) y = Number(id);
    else {
      const el = document.getElementById(id);
      y = el.getBoundingClientRect().top + scrollY;
      if (prog) y += (el.offsetHeight - innerHeight) * Number(prog);
    }
    window.scrollTo(0, y);
  }, id, prog);
  await new Promise((r) => setTimeout(r, 1800));
  const file = path.join(ROOT, '_review', `shot-${w}-${t.replace(/[@.]/g, '_')}.png`);
  await page.screenshot({ path: file });
  console.log('salvo', path.relative(ROOT, file));
}
if (errors.length) console.log('ERROS:\n' + [...new Set(errors)].join('\n'));
await browser.close();

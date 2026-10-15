// Uso (com o site servido em http://localhost:8090):
//   node tools/render/render.mjs stills            -> assets/renders/*.webp
//   node tools/render/render.mjs video moldura     -> assets/video/moldura.mp4 (+ poster)
//   node tools/render/render.mjs video quadro
//   node tools/render/render.mjs preview quadro 4.5 -> _review/quadro-4.5.webp
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE || 'http://localhost:8090';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [cmd = 'stills', ...args] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 60 * 60 * 1000,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl', '--window-size=1400,900'],
  defaultViewport: { width: 1400, height: 900 },
});

try {
  const page = await browser.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  await page.exposeFunction('renderLog', (s) => console.log(s));
  await page.exposeFunction('saveChunk', (rel, n, b64) => {
    const file = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const buf = Buffer.from(b64, 'base64');
    if (n === 0) fs.writeFileSync(file, buf); else fs.appendFileSync(file, buf);
  });
  await page.goto(`${BASE}/tools/render/render.html`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.RENDER_READY === true', { timeout: 60000 });
  const gl = await page.evaluate(() => {
    const c = document.createElement('canvas').getContext('webgl2');
    const ext = c && c.getExtension('WEBGL_debug_renderer_info');
    return ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'desconhecido';
  });
  console.log('GPU:', gl);

  const t0 = Date.now();
  if (cmd === 'stills') {
    await page.evaluate((names) => window.RENDER.stills(names.length ? names : undefined), args);
  } else if (cmd === 'video') {
    await page.evaluate((name) => window.RENDER.video(name), args[0]);
  } else if (cmd === 'preview') {
    const data = await page.evaluate((name, t) => window.RENDER.preview(name, Number(t)), args[0], args[1] || '0');
    const out = path.join(ROOT, '_review', `${args[0]}-${args[1] || 0}.webp`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
    console.log('salvo', out);
  }
  console.log(`concluído em ${((Date.now() - t0) / 1000).toFixed(1)} s`);
} finally {
  await browser.close();
}

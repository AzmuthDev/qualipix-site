// Verificação rápida das interações: node tools/check.mjs
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE || 'http://localhost:8090';
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) errors.push(m.text()); });
const opened = [];
await page.exposeFunction('__opened', (u) => opened.push(u));
await page.evaluateOnNewDocument(() => { window.open = (u) => { window.__opened(u); return null; }; });
await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 4000));
const results = {};

results.booted = await page.evaluate(() => document.documentElement.classList.contains('is-booted'));

// guia de escolha
await page.evaluate(() => document.getElementById('escolher').scrollIntoView());
await page.click('input[name="lugar"][value="aula"] + span');
await page.click('input[name="tem"][value="quadro"] + span');
results.chooser1 = await page.$eval('.result-name', (e) => e.textContent);
await page.click('input[name="tem"][value="tv"] + span');
results.chooser2 = await page.$eval('.result-name', (e) => e.textContent);
await page.click('input[name="tem"][value="projetor"] + span');
await page.click('input[name="prioridade"][value="economia"] + span');
results.chooser3 = await page.$eval('.result-name', (e) => e.textContent);
results.chooserCta = await page.$eval('.result-cta', (e) => e.href.slice(0, 60));

// tamanhos
await page.evaluate(() => { const r = document.getElementById('size-range'); r.value = 0; r.dispatchEvent(new Event('input')); });
await new Promise((r) => setTimeout(r, 800));
results.size32 = await page.evaluate(() => [document.getElementById('size-num').textContent, document.getElementById('size-area').textContent, document.getElementById('size-line').textContent, document.getElementById('size-body').getAttribute('width')]);

// abas
await page.evaluate(() => document.getElementById('tab-saude').click());
results.tab = await page.evaluate(() => [document.getElementById('seg-saude').hidden, document.getElementById('seg-edu').hidden]);

// formulário: vazio deve mostrar erro, preenchido abre WhatsApp
await page.evaluate(() => document.getElementById('contato').scrollIntoView());
await page.click('#contact-form button[type="submit"]');
results.formError = await page.$eval('#form-error', (e) => [e.hidden, e.textContent]);
await page.type('#f-nome', 'Maria Teste');
await page.type('#f-tel', '(31) 99999-0000');
await page.type('#f-msg', '2 lousas de 75 polegadas');
await page.click('#contact-form button[type="submit"]');
await new Promise((r) => setTimeout(r, 300));
results.formOpened = opened.map((u) => decodeURIComponent(u).slice(0, 140));

// links internos apontam para ids existentes
results.brokenAnchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.querySelector(h)));
results.missingImgs = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));

// menu no celular
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await new Promise((r) => setTimeout(r, 500));
await page.evaluate(() => window.scrollTo(0, 0));
await page.click('.menu-toggle');
results.menu = await page.$eval('#mobile-nav', (e) => e.classList.contains('is-open'));
results.overflowX = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

console.log(JSON.stringify(results, null, 2));
if (errors.length) console.log('ERROS:\n' + [...new Set(errors)].join('\n'));
await browser.close();

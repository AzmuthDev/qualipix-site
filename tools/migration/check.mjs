// Verificação de migração: confere um endereço publicado antes e depois da troca.
// Uso:
//   node tools/migration/check.mjs https://lpqualipix.googlar.com.br --env staging
//   node tools/migration/check.mjs https://lp.qualipix.com.br --env production
//   node tools/migration/check.mjs https://www.qualipix.com.br --env production --redirects
//   (--redirects confere as 63 URLs de seo/urls.csv; use só no caminho 3)
// Sai com código 1 se algum item falhar. Sem dependências: Node 18+.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) || 'http://localhost:8090').replace(/\/$/, '');
const env = args.includes('--env') ? args[args.indexOf('--env') + 1] : 'staging';
const checkRedirects = args.includes('--redirects');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'seo/config.json'), 'utf8'));
const WA = '5511971756835';

let fails = 0, warns = 0;
const ok = (m) => console.log(`  ok    ${m}`);
const fail = (m) => { fails++; console.log(`  FALHA ${m}`); };
const warn = (m) => { warns++; console.log(`  AVISO ${m}`); };
const get = (p, opts = {}) => fetch(p.startsWith('http') ? p : base + p, { redirect: 'manual', ...opts, headers: { 'User-Agent': 'qualipix-migration-check', ...(opts.headers || {}) } });

console.log(`\nVerificando ${base} (ambiente: ${env})\n`);

// 1. página inicial
const home = await get('/');
const html = await home.text();
home.status === 200 ? ok('página inicial responde 200') : fail(`página inicial respondeu ${home.status}`);
if (!base.startsWith('https://') && !/localhost|127\.0\.0\.1/.test(base)) warn('endereço sem HTTPS');

// 2. indexação
const robotsHeader = home.headers.get('x-robots-tag') || '';
const staticNoindex = /<meta[^>]+name="robots"[^>]+noindex/i.test(html);
if (env === 'production') {
  !/noindex/i.test(robotsHeader) && !staticNoindex ? ok('produção sem noindex') : fail('produção está com noindex: o Google vai tirar o site do índice');
} else {
  /noindex/i.test(robotsHeader) ? ok('teste com cabeçalho X-Robots-Tag: noindex') : warn('teste sem cabeçalho X-Robots-Tag (só o meta noindex do js/env.js protege); aplique deploy/nginx.staging.conf');
}

// 3. metadados
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
canonical ? ok(`canonical: ${canonical}`) : fail('sem link canonical');
if (env === 'production' && canonical && !canonical.startsWith(base)) warn(`canonical aponta para outro domínio (${canonical}); ajuste seo/config.json e rode tools/migration/build.mjs`);
/property="og:image" content="https:\/\//.test(html) ? ok('og:image com URL absoluta') : fail('og:image sem URL absoluta');
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
let ldOk = ld.length > 0;
for (const m of ld) { try { JSON.parse(m[1]); } catch { ldOk = false; } }
ldOk ? ok(`${ld.length} blocos de dados estruturados válidos`) : fail('dados estruturados ausentes ou inválidos');

// 4. medição: nada carregado antes do consentimento
/googletagmanager\.com\/gtm\.js|fbq\(|gtag\/js/.test(html) ? fail('tag de medição fixa no HTML: deve carregar só via js/consent.js após o aceite') : ok('nenhuma tag de medição fixa no HTML');
/js\/env\.js/.test(html) && /consent/.test(fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8')) ? ok('controle de ambiente e de consentimento presentes') : fail('js/env.js ou js/consent.js não estão ligados');

// 5. robots.txt e sitemap
const robots = await get('/robots.txt');
const robotsTxt = robots.status === 200 ? await robots.text() : '';
robots.status === 200 ? ok('robots.txt responde') : fail(`robots.txt respondeu ${robots.status}`);
if (env === 'production' && /^Disallow:\s*\/\s*$/m.test(robotsTxt)) fail('robots.txt bloqueia o site inteiro');
const sm = await get('/sitemap.xml');
const smTxt = sm.status === 200 ? await sm.text() : '';
const locs = [...smTxt.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
locs.length ? ok(`sitemap.xml com ${locs.length} URLs`) : fail('sitemap.xml ausente ou vazio');
for (const loc of locs) {
  if (env === 'production' && !loc.startsWith(base)) { warn(`sitemap aponta para outro domínio: ${loc}`); continue; }
  const r = await get(base + new URL(loc).pathname);
  r.status === 200 ? ok(`sitemap ${new URL(loc).pathname} responde 200`) : fail(`sitemap ${loc} respondeu ${r.status}`);
}

// 6. arquivos da página
const refs = new Set();
for (const m of html.matchAll(/(?:src|href|poster|data-video)="([^"#]+)"/g)) {
  const u = m[1];
  if (/^(https?:|mailto:|tel:|data:)/.test(u) || u.startsWith('//')) continue;
  refs.add('/' + u.replace(/^\.?\//, '').split('?')[0]);
}
const broken = [];
for (const r of refs) {
  const res = await get(r, r.endsWith('.mp4') ? { headers: { Range: 'bytes=0-1' } } : { method: 'HEAD' });
  if (![200, 206].includes(res.status)) broken.push(`${r} (${res.status})`);
}
broken.length ? fail(`arquivos quebrados: ${broken.join(', ')}`) : ok(`${refs.size} arquivos referenciados respondem`);
const vid = [...refs].find((r) => r.endsWith('.mp4'));
if (vid) { const r = await get(vid, { headers: { Range: 'bytes=0-99' } }); r.status === 206 ? ok('vídeos aceitam Range (rolagem do vídeo funciona)') : fail(`vídeo sem suporte a Range (${r.status})`); }

// 7. âncoras internas
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const missing = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))].filter((id) => !ids.has(id));
missing.length ? fail(`links internos sem destino: ${missing.join(', ')}`) : ok('links internos têm destino');

// 8. WhatsApp
const nums = [...new Set([...html.matchAll(/wa\.me\/(\d+)/g)].map((m) => m[1]))];
const other = nums.filter((n) => n !== WA && n !== '5531991577018');
other.length ? warn(`números de WhatsApp inesperados: ${other.join(', ')}`) : ok(`WhatsApp comercial ${WA} e suporte técnico`);

// 9. arquivos internos não podem ser públicos
for (const p of ['/tools/render/render.js', '/README.md', '/seo/urls.csv', '/deploy/nginx.home.conf']) {
  const r = await get(p, { method: 'HEAD' });
  r.status === 200 ? warn(`${p} está público; aplique a configuração de deploy/`) : ok(`${p} não está público (${r.status})`);
}

// 10. página inexistente
const nf = await get('/pagina-que-nao-existe-qpx/');
if (checkRedirects) nf.status === 301 && (nf.headers.get('location') || '').startsWith(cfg.lojaUrl) ? ok('endereço desconhecido segue para a loja') : fail(`endereço desconhecido respondeu ${nf.status}, esperado 301 para a loja`);
else nf.status === 404 ? ok('endereço inexistente responde 404') : warn(`endereço inexistente respondeu ${nf.status} (esperado 404)`);

// 11. URLs antigas (caminho 3)
if (checkRedirects) {
  const lines = fs.readFileSync(path.join(ROOT, 'seo/urls.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
  let good = 0;
  for (const line of lines) {
    const [url, , destino] = line.split(',');
    if (url === '/') continue;
    const r = await get(url);
    const loc = r.headers.get('location') || '';
    if (r.status === 301 && (loc === destino || loc === base + destino)) good++;
    else fail(`${url} -> ${r.status} ${loc || ''} (esperado 301 para ${destino})`);
  }
  ok(`${good} de ${lines.length - 1} URLs antigas redirecionam corretamente`);
}

console.log(`\n${fails} falha(s), ${warns} aviso(s)\n`);
process.exit(fails ? 1 : 0);

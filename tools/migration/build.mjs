// Prepara os arquivos de SEO e de redirecionamento a partir de seo/config.json e seo/urls.csv.
// Uso: node tools/migration/build.mjs
//   - robots.txt e sitemap.xml com o domínio de seo/config.json
//   - canonical, og:url, og:image e JSON-LD das páginas apontando para esse domínio
//   - deploy/nginx.home.conf: configuração do caminho 3 (novo site na home, loja em subdomínio),
//     com um 301 para cada URL antiga com destino próprio e as demais seguindo para a loja no mesmo caminho
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => { fs.writeFileSync(path.join(ROOT, p), s); console.log('gerado', p); };

const cfg = JSON.parse(read('seo/config.json'));
const site = cfg.siteUrl.replace(/\/$/, '');
const loja = cfg.lojaUrl.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- robots + sitemap
write('robots.txt', `User-agent: *
Allow: /
Disallow: /tools/
Disallow: /deploy/
Disallow: /seo/

Sitemap: ${site}/sitemap.xml
`);

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cfg.pages.map((p) => `  <url>
    <loc>${site}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);

// ------------------------------------------------------- domínio nas páginas HTML
for (const file of ['index.html', 'privacidade.html']) {
  let html = read(file);
  const before = html;
  const current = html.match(/<link rel="canonical" href="(https?:\/\/[^/"]+)/)?.[1];
  if (current && current !== site) html = html.split(current).join(site);
  if (html !== before) write(file, html); else console.log('sem mudança', file);
}

// ----------------------------------------------------------- redirecionamentos
function parseCsv(text) {
  const rows = [];
  for (const line of text.trim().split(/\r?\n/).slice(1)) {
    const cells = [];
    let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === ',') { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    rows.push(cells);
  }
  return rows;
}

const urls = parseCsv(read('seo/urls.csv')).map(([url, grupo, destino]) => ({ url, grupo, destino }));
const own = urls.filter((u) => u.url !== '/' && u.destino && !u.destino.startsWith(loja) && u.destino !== '(nova home)');
const toLoja = urls.filter((u) => u.destino.startsWith(loja));
const bad = urls.filter((u) => u.url !== '/' && !u.destino);
if (bad.length) { console.error('URLs sem destino em seo/urls.csv:', bad.map((u) => u.url).join(', ')); process.exit(1); }

const exact = own.map((u) => `    location = ${u.url} { return 301 ${u.destino}; }`).join('\n');
const staging = read('deploy/nginx.staging.conf');
const home = staging
  .replace(/^# Coolify.*$/m, `# Coolify > Configuration > General > Custom Nginx Configuration (caminho 3: novo site na home, loja em ${loja})
# GERADO por tools/migration/build.mjs a partir de seo/urls.csv: não edite à mão.
# ${own.length} URLs antigas com destino próprio e ${toLoja.length} que seguem para a loja no mesmo caminho.`)
  .replace(/^# Igual à landing.*$/m, '# Qualquer endereço que não exista neste site vai para a loja com 301, sem perder a URL.')
  .replace(/^\s*add_header X-Robots-Tag.*\n/m, '')
  .replace('    location / { try_files $uri $uri/ =404; }\n    error_page 404 /404.html;',
    `    # URLs antigas com destino próprio no novo site
${exact}

    location / { try_files $uri $uri/ @loja; }
    location @loja { return 301 ${loja}$request_uri; }`);
write('deploy/nginx.home.conf', home);

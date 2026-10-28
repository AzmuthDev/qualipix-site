// Prepara os arquivos de SEO e de redirecionamento a partir de seo/config.json e seo/urls.csv.
// Uso: node tools/migration/build.mjs
//   - robots.txt e sitemap.xml com o domínio de seo/config.json
//   - canonical, og:url, og:image e JSON-LD das páginas apontando para esse domínio
//   - deploy/nginx.home.conf: configuração do caminho 3 (novo site na home, loja em subdomínio),
//     com um 301 para cada URL antiga com destino próprio e as demais seguindo para a loja no mesmo caminho
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInventory } from './csv.mjs';

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

// ------------------------------------------------- llms.txt (assistentes de IA)
// Formato de https://llmstxt.org: resumo em Markdown com os links que importam.
write('llms.txt', `# Qualipix

> Fabricante brasileira de lousas digitais 4K de 32" a 98", molduras touch, quadros híbridos, totens interativos, flip charts digitais e lousas brancas interativas. Atende educação, empresas, governo, saúde e eventos em todo o Brasil desde 2012, com unidades em São Paulo (showroom) e Belo Horizonte (matriz).

Vendemos equipamentos (não alugamos). Garantia de 2 anos; no Quadro Híbrido, 3 anos na superfície de escrita. Orçamentos e demonstrações pelo WhatsApp (11) 97175-6835 ou contato@qualipix.com.br.

## Produtos

- [Lousa Digital](${site}/#lousa-digital): tela 4K touch, linha SX (32" a 55", usa computador) e linha DX (65" a 98", Android 14 embarcado)
- [Moldura Touch NX](${site}/#moldura-touch): transforma uma TV de 32" a 85" em tela touch via USB
- [Quadro Híbrido](${site}/#quadro-hibrido-produto): quadro branco cerâmico com lousa digital central, 4,00 × 1,30 m ou 3,20 × 1,30 m
- [Totem Interativo](${site}/#totem-interativo): 32", 43" e 55", com computador embutido
- [Flip Chart Digital](${site}/#flip-chart): 43" e 55", pedestal com rodízios
- [Lousa Branca Interativa Max80i](${site}/#lousa-branca): 80", torna touch a imagem de um projetor

## Escolha e contato

- [Qual solução escolher](${site}/#escolher): guia por ambiente, equipamento existente e prioridade
- [Tamanhos](${site}/#tamanhos): medidas de cada tamanho de tela
- [Perguntas frequentes](${site}/#duvidas)
- [Contato e unidades](${site}/#empresa)

## Opcional

- [Loja online](${loja}/produtos/)
- [Política de privacidade](${site}/privacidade.html)
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
const urls = readInventory(path.join(ROOT, 'seo/urls.csv')).map((r) => ({ url: r.url_atual, destino: r.destino_caminho_3 }));
// mesma URL na loja = coberto pela regra geral; qualquer outro destino (duplicada, quebrada, página nova) = 301 explícito
const own = urls.filter((u) => u.url !== '/' && u.destino && u.destino !== loja + u.url);
const toLoja = urls.filter((u) => u.destino === loja + u.url);
const bad = urls.filter((u) => u.url !== '/' && !u.destino);
if (bad.length) { console.error('URLs sem destino em seo/urls.csv:', bad.map((u) => u.url).join(', ')); process.exit(1); }

const exact = own.map((u) => `    location = ${u.url} { return 301 ${u.destino}; }`).join('\n');
const staging = read('deploy/nginx.staging.conf');
const home = staging
  .replace(/^# Coolify.*$/m, `# Coolify > Configuration > General > Custom Nginx Configuration (caminho 3: novo site na home, loja em ${loja})
# GERADO por tools/migration/build.mjs a partir de seo/urls.csv: não edite à mão.
# ${own.length} URLs antigas com destino próprio (duplicadas, quebradas ou páginas novas) e ${toLoja.length} que seguem para a loja no mesmo caminho.`)
  .replace(/^# Igual à landing.*$/m, '# Qualquer endereço que não exista neste site vai para a loja com 301, sem perder a URL.')
  .replace(/^\s*add_header X-Robots-Tag.*\n/m, '')
  .replace('    location / { try_files $uri $uri/ =404; }\n    error_page 404 /404.html;',
    `    # URLs antigas com destino próprio
${exact}

    location / { try_files $uri $uri/ @loja; }
    location @loja { return 301 ${loja}$request_uri; }`);
write('deploy/nginx.home.conf', home);

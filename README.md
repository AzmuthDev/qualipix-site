# Site Qualipix

Site institucional estático (HTML, CSS e JavaScript) da Qualipix, com cenas 3D em tempo real (Three.js) e vídeos de animação renderizados a partir dos mesmos modelos 3D.

## Rodar localmente

```bash
npx http-server . -p 8080 -c-1
```

Abre em http://localhost:8080. Não há etapa de build nem `package.json` na raiz: é um site estático puro (por isso o Coolify/Nixpacks o detecta como site estático e não como app Node). As ferramentas de render ficam isoladas em `tools/` com o próprio `package.json`.

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | Página única com todas as seções |
| `css/style.css` | Estilos e tokens de cor/tipografia |
| `js/main.js` | Rolagem, seções fixadas, vídeos guiados pela rolagem, guia de escolha, tamanhos, formulário |
| `js/hero.js` | Cena do topo: a lousa liga pelo "Q" de power e o visitante escreve na tela |
| `js/anatomy.js` | Vista explodida das 5 camadas da Lousa Digital |
| `js/products.js` | Modelos 3D procedurais (lousa, TV + moldura, quadro híbrido, totem, flip chart, Max80, caneta) |
| `js/screen-ui.js` | Conteúdo desenhado nas telas (quadro interativo, gráficos, aula de frações) |
| `assets/renders/` | Imagens dos produtos geradas pelo renderizador |
| `assets/video/` | Vídeos `moldura.mp4` e `quadro.mp4` (H.264, quadro-chave a cada 6 quadros para rolagem suave) |
| `tools/render/` | Renderizador offline dos vídeos e imagens |

## Gerar de novo imagens e vídeos

Instale as dependências uma vez (`cd tools && npm install`). Depois, com o site rodando em http://localhost:8090 (`npx http-server . -p 8090`) e o Google Chrome instalado, na raiz do projeto:

```bash
node tools/render/render.mjs stills
```

```bash
node tools/render/render.mjs video moldura
```

```bash
node tools/render/render.mjs video quadro
```

Para conferir um quadro específico antes de renderizar tudo: `node tools/render/render.mjs preview quadro 4.5` (salva em `_review/`).

## Contatos usados no site

- WhatsApp SP: (11) 97175-6835
- Telefone SP: (11) 2690-4299
- Telefone BH: (31) 3568-6835
- Suporte técnico (WhatsApp): (31) 99157-7018
- contato@qualipix.com.br

O formulário de contato não guarda dados: ele monta a mensagem e abre o WhatsApp (11) 97175-6835 (unidade SP).

## Preparação da migração

Documentação completa do processo (caminhos, SEO, medição, checklist): https://claude.ai/artifact/XqXZvWNVr9C61deHUCPBGA

| Arquivo | Para que serve |
| --- | --- |
| `js/env.js` | Detecta o ambiente. Fora de `productionHosts` o site recebe `noindex` e não carrega tags. Ao escolher o caminho da migração, ajuste a lista (ex.: `lp.qualipix.com.br`). |
| `js/consent.js` | Aviso de cookies (LGPD), Consent Mode do Google e Google Tag Manager `GTM-WZBGG23`, carregado só em produção e após o aceite. Envia ao `dataLayer` os eventos `whatsapp_click`, `phone_click`, `email_click`, `quote_request` e `generate_lead`. |
| `privacidade.html` | Política de privacidade (rascunho para revisão jurídica do cliente). |
| `404.html` | Página de endereço inexistente. |
| `seo/urls.csv` | Inventário das 63 URLs do site atual, com grupo e destino no caminho 3. Preencha `cliques_90_dias` com o Search Console. |
| `seo/config.json` | Domínio oficial do novo site e endereço da loja. |
| `deploy/nginx.staging.conf` | Configuração do Coolify para o ambiente de teste (cabeçalho `noindex`, arquivos internos bloqueados). |
| `deploy/nginx.landing.conf` | Configuração para o caminho 2 (landing em endereço próprio). |
| `deploy/nginx.home.conf` | Gerada: caminho 3, com os 301 das URLs antigas e o restante seguindo para a loja. |

Depois de mudar `seo/config.json` ou `seo/urls.csv`, gere de novo `robots.txt`, `sitemap.xml`, os domínios das páginas e `deploy/nginx.home.conf`:

```bash
node tools/migration/build.mjs
```

Para conferir um endereço publicado (sai com erro se algo falhar):

```bash
node tools/migration/check.mjs https://lpqualipix.googlar.com.br --env staging
```

Antes de colar qualquer arquivo de `deploy/` no Coolify, valide no terminal do servidor com `nginx -t`.

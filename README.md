# Site Qualipix

Site institucional estático (HTML, CSS e JavaScript) da Qualipix, com cenas 3D em tempo real (Three.js) e vídeos de animação renderizados a partir dos mesmos modelos 3D.

## Rodar localmente

```bash
npm start
```

Abre em http://localhost:8080. Não há etapa de build: para publicar, envie a pasta inteira, exceto `node_modules/` e `tools/`, para qualquer hospedagem estática (Hostinger, Vercel, Netlify, Nixpacks com servidor estático).

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

Com o site rodando em http://localhost:8090 (`npx http-server . -p 8090`) e o Google Chrome instalado:

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

- WhatsApp e telefone SP: (11) 2690-4299
- Telefone BH: (31) 3568-6835
- Suporte técnico (WhatsApp): (31) 99157-7018
- contato@qualipix.com.br

O formulário de contato não guarda dados: ele monta a mensagem e abre o WhatsApp da unidade SP.

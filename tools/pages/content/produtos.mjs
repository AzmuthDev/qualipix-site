// Páginas de produto do menu "Produtos". Texto do site atual, revisado.
// "Preços" aponta para os mesmos endereços do site atual.
const subnav = (title, preco, product) => ({
  type: 'subnav', title, product,
  items: [['#visao-geral', 'Visão geral'], ['#faq', 'Perguntas frequentes'], ['#especificacoes', 'Especificações']],
  cta: [preco, 'Preços'],
});
const help = (interest, area) => ({ type: 'cta', interest, area });

export default [
  {
    path: '/lousa-digital/', title: 'Lousa digital', kind: 'produto',
    metaTitle: 'Lousa Digital 4K de 32" a 98", linhas SX e DX | Qualipix',
    description: 'Lousa digital Qualipix: tela 4K touch com até 2x o brilho de uma TV, vidro antirreflexo e 7 tamanhos, de 32" a 98", nas linhas SX e DX.',
    crumbs: [['/lousa-digital/', 'Lousa digital']],
    blocks: [
      {
        type: 'hero', kicker: 'Lousa Digital Qualipix', img: 'lousa', imgAlt: 'Lousa Digital Qualipix com tela 4K exibindo um quadro interativo',
        title: 'Solução profissional completa.',
        lead: 'A lousa digital Qualipix oferece todos os recursos para apresentações, reuniões, aulas e treinamentos. Disponível em 2 linhas, SX e DX, com 7 opções de tamanho: 32", 43", 55", 65", 75", 86" e 98".',
        actions: [{ label: 'Ver preços', href: '#linhas', primary: true }, { label: 'Falar com especialista', href: '#help' }],
        chips: ['Tela 4K com até 2x mais brilho que uma TV comum', 'Acabamento premium com tratamento antirreflexo', 'Tecnologia touch screen de última geração', 'Perfeito para educação e mercado corporativo'],
      },
      subnav('Lousa digital', '#linhas'),
      {
        type: 'benefits', id: 'visao-geral', title: 'Recursos avançados de produtividade.', items: [
          { t: 'Multitoque de verdade', d: 'Suporte total a gestos multitoque, como rotação e zoom, com até 20 toques ao mesmo tempo.' },
          { t: 'Anote em qualquer documento', d: 'Faça anotações em qualquer documento usando seus dedos ou a caneta.' },
          { t: 'Internet e Office integrados', d: 'Navegue pela internet e abra documentos Office com os aplicativos integrados.' },
        ],
      },
      {
        type: 'lines', title: 'Duas linhas, sete tamanhos.', lead: 'A linha SX trabalha com o seu computador. A linha DX já vem com Android 14, câmera e microfone.',
        items: [
          { kicker: 'Linha SX', name: '32", 43" ou 55"', points: ['Imagem 4K', 'Superfície em vidro antirreflexo', 'Requer computador', 'Som 10 W × 2'], actions: [{ label: 'Preços', href: '/monitor-touch-qualipix-linha-sx', primary: true, product: 'Lousa Digital SX' }] },
          { kicker: 'Linha DX', name: '65", 75", 86" ou 98"', points: ['Android 14 embarcado', '8 GB de RAM e 128 GB', 'Câmera e microfone integrados', 'Som 15 W × 2'], actions: [{ label: 'Preços', href: '/lousa-digital-qualipix-linha-dx', primary: true, product: 'Lousa Digital DX' }] },
        ],
      },
      { type: 'video', youtube: 'UDRfsfOapLE', poster: 'lousa', title: 'Veja a lousa em uso.', lead: 'Aulas, reuniões e treinamentos com a Lousa Digital Qualipix.' },
      {
        type: 'faq', items: [
          ['Qual a resolução dos displays?', '4K, 3.840 × 2.160 pixels.'],
          ['Todos os displays possuem tratamento antirreflexo?', 'Sim.'],
          ['Posso usar meu computador?', 'Sim.'],
          ['Acompanha suporte de parede?', 'Sim.'],
          ['Posso baixar aplicativos na Play Store?', 'Somente na linha DX, desde que o aplicativo seja compatível com a resolução de displays 4K.'],
          ['Quais acessórios acompanham o produto?', 'Suporte de parede, cabo USB, controle remoto, 2 ponteiras e cabo de energia.'],
        ],
      },
      {
        type: 'specs', lead: 'Valores de 32" a 98". Fale com a equipe para a ficha de um tamanho específico.', rows: [
          ['Tamanho diagonal', 'De 32 a 98 polegadas'], ['Cor', 'Preto'], ['Área ativa', 'De 699 × 393 mm a 2158 × 1214 mm'],
          ['Dimensões externas', 'De 740 × 433 × 55 mm a 2216 × 1318 × 121 mm'], ['Resolução', '4K, 3840 × 2160 px'], ['Contraste', '3000:1'],
          ['Brilho', '350 cd/m²'], ['Ângulo de visão', '178°'], ['Vida útil', '60.000 horas'], ['Superfície', 'Vidro ultrarresistente antirreflexo'],
          ['Taxa de atualização', '60 Hz'], ['Toques simultâneos', '20 pontos'], ['Tecnologia touch', 'Infravermelho'], ['Precisão do touch', '2 mm'],
          ['Reconhecimento do touch', 'Dedos (SX) ou dedos e ponteira (DX)'], ['Tempo de resposta', 'Menos de 5 ms'],
          ['Compatibilidade', 'Windows 7, 8, 10 e 11, Chrome OS, macOS e Linux'], ['Conexões traseiras', 'Variam de acordo com o modelo'],
          ['Peso sem embalagem', 'De 9,9 kg a 80 kg'], ['Peso com embalagem', 'De 13,4 kg a 93 kg'], ['Alto-falantes', '10 W × 2 (SX) ou 15 W × 2 (DX)'],
          ['Voltagem', '110 a 240 V AC'], ['Consumo em standby', 'Menos de 0,5 W'], ['Consumo em funcionamento', 'Máximo de 225 W'],
          ['Temperatura de utilização', '0 °C a 50 °C'], ['Temperatura de armazenamento', '-20 °C a 60 °C'],
          ['Itens inclusos', ['1 display', '1 cabo de energia', '1 suporte de parede', '1 caneta (stylus)']], ['Garantia', '2 anos'],
        ],
      },
      help('Lousa Digital', 'Educação'),
    ],
  },

  {
    path: '/moldura-touch/', title: 'Moldura touch', kind: 'produto',
    metaTitle: 'Moldura Touch: transforme sua TV em tela touch | Qualipix',
    description: 'Moldura interativa Qualipix de 32" a 85": transforma a TV convencional em tela touch screen com 20 toques, vidro de 4 mm e conexão USB, sem driver.',
    crumbs: [['/moldura-touch/', 'Moldura touch']],
    blocks: [
      {
        type: 'hero', kicker: 'Moldura Touch Qualipix', img: 'moldura', imgAlt: 'Moldura Touch Qualipix encaixada em uma TV',
        title: 'Transforme sua TV convencional em uma tela touch screen.',
        lead: 'Impacte seus clientes e colaboradores com uma experiência visual moderna e imersiva usando a tecnologia de moldura interativa Qualipix.',
        actions: [{ label: 'Quero saber mais', href: '#help', primary: true }, { label: 'Ver preços', href: '/moldura-touch-qualipix' }],
        chips: ['Design slim', 'Acabamento premium', 'Fácil instalação', 'Touch preciso'],
      },
      subnav('Moldura touch', '/moldura-touch-qualipix', 'Moldura Touch'),
      {
        type: 'intro', id: 'visao-geral', title: 'A solução interativa que vai levar seu negócio ao próximo nível.',
        text: 'A solução em moldura touch screen da Qualipix é feita para negócios que buscam qualidade e inovação, sem perder a praticidade tão importante no dia a dia. Ideal para:',
        list: ['Escolas, institutos educacionais e redes de ensino', 'Empresas com sala de reunião, apresentação ou videoconferência', 'Negócios que apresentam soluções ao público', 'Gestão à vista em empresas (Power BI, dashboards)'],
      },
      {
        type: 'benefits', title: 'Reuniões, aulas e eventos com mais performance.', lead: 'Entenda como a moldura interativa muda o seu dia a dia.', items: [
          { t: 'Mais praticidade', d: 'Com o sistema touch screen você escreve, acessa a internet, troca de guias e captura imagens em poucos instantes.' },
          { t: 'Rapidez', d: 'A moldura interativa Qualipix responde rapidamente aos comandos, com agilidade e fluidez durante as atividades.' },
          { t: 'Otimização de tempo', d: 'As horas gastas escrevendo em lousa de giz ou quadro branco são substituídas por alguns toques na tela.' },
          { t: 'Dinamismo', d: 'Aulas, reuniões e eventos mais dinâmicos e interativos. Capturar e reter a atenção das pessoas deixa de ser um problema.' },
        ],
      },
      { type: 'video', youtube: 'jb-pUm4LnCg', poster: 'moldura', title: 'A TV que você já tem, agora com touch.', lead: 'Veja a Moldura Touch Qualipix instalada e funcionando.' },
      {
        type: 'faq', items: [
          ['É compatível com qualquer TV do mercado?', 'Recomendamos LG e Samsung. Para outras marcas, sugerimos verificar as medidas antes com a nossa equipe.'],
          ['Posso instalar em TV com bordas finas?', 'Sim, porém elas exigem um processo de instalação ainda mais reforçado.'],
          ['Acompanha vidro?', 'Sim.'],
          ['Posso usar com Mac?', 'Sim. Não há necessidade de driver (plug and play).'],
          ['Qual o tamanho do cabo USB?', '1,4 metro.'],
          ['Quais acessórios acompanham o produto?', 'QR code com instruções e software de escrita, 2 ponteiras, suporte de segurança e kit de fixação.'],
        ],
      },
      {
        type: 'specs', rows: [
          ['Tamanho diagonal', 'De 32 a 85 polegadas'], ['Cor', 'Preto'], ['Área ativa', 'De 702 × 395 mm a 1888 × 1060 mm'],
          ['Dimensões externas', 'De 740 × 433 mm a 1926 × 1098 mm'], ['Resolução', '32768 (L) × 32768 (A)'], ['Superfície', 'Vidro ultrarresistente de 4 mm'],
          ['Toques simultâneos', '20 pontos'], ['Tecnologia touch', 'Infravermelho óptico'], ['Tempo de resposta', '3 a 10 ms'], ['Alimentação', 'USB'],
          ['Vida útil', 'Indeterminada'], ['Protocolos', 'HID, TUIO, Flash'], ['Sistema operacional', 'Windows 7, 8, 10 e 11, macOS e Linux (toque único)'],
          ['Computador mínimo', 'Celeron, 2 GB de RAM, HD de 250 GB, USB'], ['Computador recomendado', 'Core i5, 8 GB de RAM, SSD de 128 GB, USB'],
          ['Temperatura de utilização', '-20 °C a 70 °C'], ['Temperatura de armazenamento', '-40 °C a 85 °C'],
          ['Itens inclusos', ['1 moldura touch', '1 manual de instruções', '1 kit de fixação', '2 canetas (stylus)']],
          ['Garantia', '2 anos (3 meses de garantia legal e 21 meses concedidos pela Qualipix)'],
        ],
      },
      help('Moldura Touch', 'Corporativo'),
    ],
  },

  {
    path: '/lousamax80/', title: 'Lousa branca interativa', kind: 'produto',
    metaTitle: 'Lousa Branca Interativa Max80i para projetor | Qualipix',
    description: 'Lousa branca interativa Qualipix Max80i de 80": deixa touch a imagem do seu projetor, com software de escrita, 10 toques e conexão USB.',
    crumbs: [['/lousamax80/', 'Lousa branca interativa']],
    blocks: [
      {
        type: 'hero', kicker: 'Lousa Branca Interativa Max80i', img: 'max80', imgAlt: 'Lousa Branca Interativa Max80i com projetor de curta distância',
        title: 'Transforme suas apresentações com a lousa digital Qualipix.',
        lead: 'Aumente a retenção do conteúdo apresentado em até 30%. Usada e aprovada por escolas como CCAA, CNA, Achieve e Biologia Total.',
        actions: [{ label: 'Ver preços', href: '/lousa-branca-interativa-qualipix', primary: true, product: 'Lousa Branca Interativa Max80i' }, { label: 'Falar com especialista', href: '#help' }],
        chips: ['80 polegadas de área ativa', 'Até 10 toques simultâneos', 'Superfície em alumínio branco fosco', 'Conexão USB com o computador'],
      },
      subnav('Lousa branca interativa', '/lousa-branca-interativa-qualipix', 'Lousa Branca Interativa Max80i'),
      {
        type: 'intro', id: 'visao-geral', title: 'Como funciona a Qualipix Max80i.',
        text: ['A lousa funciona como uma tela de computador sensível ao toque. Qualquer movimento do professor em contato com a superfície gera interação com o conteúdo que está sendo projetado.', 'Para operar, a lousa é conectada a um computador, que por sua vez é conectado a um projetor multimídia.'],
      },
      {
        type: 'benefits', title: 'Aulas mais dinâmicas e produtivas.', items: [
          { t: 'Internet e desenho na lousa', d: 'Acesse páginas na internet, desenhe e trabalhe conteúdos de forma interativa.' },
          { t: 'Software de escrita', d: 'Canetas de diversas espessuras, linhas e figuras geométricas automáticas.' },
          { t: 'Aula salva em PDF', d: 'Salve os arquivos e envie por e-mail em PDF para a turma.' },
          { t: 'Grave a aula', d: 'Grave a tela com o áudio do professor e disponibilize para os alunos.' },
        ],
      },
      { type: 'video', youtube: 'ttqHq1ejSZQ', poster: 'max80', title: 'A imagem do projetor, agora touch.', lead: 'Veja a Max80i em uma sala de aula.' },
      {
        type: 'faq', items: [
          ['Além da lousa, quais equipamentos eu preciso?', 'Projetor e computador.'],
          ['Existem outros tamanhos?', 'Não. A lousa é de tamanho único: 80".'],
          ['Qual é o material da superfície?', 'XPS alumínio.'],
          ['Quais marcas de projetor vocês indicam?', 'Epson e BenQ.'],
          ['Como é feita a conexão?', 'Cabo USB entre a lousa e o computador, e cabo HDMI entre o computador e o projetor.'],
          ['Quais acessórios acompanham a lousa?', 'Cabo USB de 5 metros, 2 ponteiras, bastão retrátil, suporte de parede, parafusos e buchas, e apagador.'],
        ],
      },
      {
        type: 'specs', rows: [
          ['Dimensões externas', '174 × 125 × 3 cm'], ['Área ativa com projeção', '80 polegadas'], ['Resolução', '32768 × 32768'],
          ['Superfície', 'Alumínio branco fosco, apagável'], ['Tecnologia', 'Touch screen, até 10 toques simultâneos'], ['Velocidade', '300 pontos por segundo'],
          ['Consumo de energia', 'Menos de 1 W'], ['Temperatura de utilização', '-15 °C a 50 °C'], ['Temperatura de armazenamento', '-40 °C a 50 °C'],
          ['Compatibilidade', 'Windows 2000, XP, Vista, 7, 8 e 10'],
          ['Itens inclusos', ['1 lousa interativa', '1 suporte de parede', '2 canetas (stylus)', '1 cabo USB', '1 manual de instruções', 'Software DrawView']],
          ['Garantia', '2 anos'],
        ],
      },
      help('Lousa Branca Interativa Max80i', 'Educação'),
    ],
  },

  {
    path: '/quadro-branco/', title: 'Quadro Branco Cerâmico com Display Interativo Integrado', kind: 'produto',
    metaTitle: 'Quadro Híbrido: quadro branco cerâmico com lousa digital | Qualipix',
    description: 'Quadro Híbrido Qualipix: quadro branco em aço cerâmico com 3 anos de garantia, lousa digital de 65" a 86" e plataforma QualipixClass com IA.',
    crumbs: [['/quadro-branco/', 'Quadro Híbrido']],
    blocks: [
      {
        type: 'hero', kicker: 'Quadro Híbrido (Quadro Branco + Lousa Digital)', img: 'quadro', imgAlt: 'Quadro Híbrido Qualipix: quadro branco cerâmico com lousa digital no centro',
        title: 'Leve suas aulas e reuniões a um novo nível.',
        lead: 'Quadro branco analógico e lousa digital no mesmo conjunto: uma solução completa para professores, palestrantes e equipes que querem inovação e interatividade no dia a dia.',
        actions: [{ label: 'Saiba mais', href: '/fale-conosco/', primary: true }, { label: 'Ver especificações', href: '#especificacoes' }],
        chips: ['Superfície em aço cerâmico com 3 anos de garantia', 'Plataforma com inteligência artificial', 'Display de 65", 75" ou 86"', 'Design moderno e funcional'],
      },
      { type: 'subnav', title: 'Quadro Híbrido', items: [['#visao-geral', 'Visão geral'], ['#especificacoes', 'Especificações'], ['#faq', 'Dúvidas']], cta: ['/fale-conosco/', 'Saiba mais'] },
      {
        type: 'benefits', id: 'visao-geral', title: 'Do quadro branco ao digital, tudo em um só lugar.', items: [
          { t: 'Superfície em aço cerâmico', d: 'Muito mais resistente a arranhões e manchas, de fácil limpeza e longa vida útil. São 3 anos de garantia.' },
          { t: 'Plataforma com inteligência artificial', d: 'Potencialize o desenvolvimento de aulas com sugestões de conteúdo, atividades e testes baseados em IA.' },
          { t: 'Design moderno e funcional', d: 'Elegante e minimalista, se integra a ambientes educacionais e corporativos.' },
        ],
      },
      {
        type: 'benefits', dark: true, title: 'Como o Quadro Híbrido ajuda sua escola, universidade ou empresa.', items: [
          { t: 'Aulas e reuniões otimizadas', d: 'Com a IA, você cria conteúdos didáticos de forma mais rápida e eficaz e economiza tempo na preparação.' },
          { t: 'Maior engajamento', d: 'A lousa digital oferece uma experiência imersiva e deixa aulas e reuniões mais dinâmicas.' },
          { t: 'Personalização inteligente', d: 'A IA cria slides a partir de comandos simples e sugere atividades adaptadas a cada turma.' },
          { t: 'Colaboração em tempo real', d: 'Ideal para brainstorms e discussões em grupo, com compartilhamento simultâneo na tela.' },
        ],
      },
      { type: 'statement', text: 'Experimente o futuro da <em>educação e colaboração</em>.', sub: 'Superfície cerâmica com 3 anos de garantia, lousa digital e uma plataforma de criação com IA: a escolha para quem busca eficiência e inovação, no ensino ou no trabalho.' },
      { type: 'video', youtube: '9soZV1q43jM', poster: 'quadro', title: 'O quadro branco fica. A lousa digital chega.', lead: 'Veja o Quadro Híbrido Qualipix em uma sala de aula.' },
      {
        type: 'specs', rows: [
          ['Dimensões externas', '4000 × 1305 mm ou 3200 × 1305 mm'], ['Superfície de escrita', 'Cerâmica de 0,3 mm, cor porcelana branca; aceita qualquer caneta de quadro branco'],
          ['Parte traseira', 'Painel de aço galvanizado, 0,16 mm'], ['Moldura lateral', 'Plástico ABS antienvelhecimento, champanhe ou branco prateado'],
          ['Rodas da prancha', 'Laterais em formato de "U", com mangas de borracha amortecedoras'], ['Dimensões do display', 'De 1484 × 887 × 118 mm a 1953 × 1151 mm'],
          ['Área ativa do display', 'De 1431 × 806 mm a 1898 × 1069 mm'], ['Tamanho do display', '65", 75" ou 86"'], ['Tecnologia do display', 'Touch screen, até 20 toques simultâneos'],
          ['Itens inclusos', ['Quadro branco em aço cerâmico', 'Lousa Digital Qualipix', 'OPS-PC Intel Core i5, 16 GB de RAM, SSD de 256 GB, Wi-Fi', '12 meses de acesso à plataforma QualipixClass, com mais de 6.000 materiais prontos']],
          ['Garantia', '3 anos na superfície de escrita; 2 anos na lousa digital (3 meses de garantia legal e 21 meses concedidos pela Qualipix)'],
        ],
      },
      {
        type: 'faq', items: [
          ['Qual o material da superfície do quadro?', 'Aço cerâmico.'],
          ['Qual a medida do quadro?', '4,00 m de largura por 1,30 m de altura. Também há a versão de 3,20 m × 1,30 m.'],
          ['É possível usar outros tamanhos de lousa digital?', 'Sim, 65" ou 86". Consulte nossa equipe.'],
          ['Entrega em todo o Brasil?', 'Apenas nas regiões Sul e Sudeste.'],
        ],
      },
      help('Quadro Híbrido', 'Educação'),
    ],
  },

  {
    path: '/totem-interativo/', title: 'Totem interativo', kind: 'produto',
    metaTitle: 'Totem Interativo touch de 32", 43" e 55" | Qualipix',
    description: 'Totem interativo Qualipix de 32", 43" e 55": display 4K com touch nativo, acabamento em metal, base de piso estável e OPS-PC Core i5 incluso.',
    crumbs: [['/totem-interativo/', 'Totem interativo']],
    blocks: [
      {
        type: 'hero', kicker: 'Totem Interativo Qualipix', img: 'totem', imgAlt: 'Totem Interativo Qualipix com tela inclinada sobre base de piso',
        title: 'Totem interativo de 32, 43 e 55 polegadas.',
        lead: 'Suporte e expositor para telas touch em feiras, exposições, eventos corporativos, lojas, recepções e áreas de espera.',
        actions: [{ label: 'Quero saber mais', href: '#help', primary: true }, { label: 'Ver preços', href: '/totens-qualipix' }],
        chips: ['Display 4K com touch nativo', 'Acabamento premium em metal', 'Base de piso super estável', 'Perfeito para o mercado corporativo'],
      },
      subnav('Totem interativo', '/totens-qualipix', 'Totem Interativo'),
      {
        type: 'intro', id: 'visao-geral', title: 'Interatividade e engajamento onde o público está.',
        text: ['Os totens da Qualipix são projetados para servir como suporte e expositor para equipamentos touch.', 'Com diversas aplicações, eles podem ser usados em feiras, exposições, eventos corporativos, lojas, recepções e áreas de espera para oferecer interatividade e engajamento aos usuários.'],
      },
      { type: 'statement', text: 'Qualidade e <em>resistência</em>.', sub: 'O acabamento do totem tem design moderno e, ao mesmo tempo, robustez para ambientes com grande fluxo de pessoas. A interação pode ser feita com os dedos, e o produto acompanha caneta magnética de ponta fina.' },
      { type: 'video', youtube: 'F-drUtv4r2s', poster: 'totem', title: 'Veja o totem em ação.', lead: 'Autoatendimento, cadastro e mídia em pé.' },
      {
        type: 'faq', items: [
          ['Quais os tamanhos disponíveis?', '32", 43" e 55".'],
          ['Tem ajuste de inclinação?', 'Não. A inclinação de fábrica já tem o ângulo ideal para um adulto em pé.'],
          ['Já acompanha PC?', 'Sim: OPS-PC Qualipix Intel Core i5 de 10ª geração, 16 GB de RAM, SSD de 256 GB e Windows 11.'],
          ['Tem rodízio?', 'Não, mas é possível incluir. Verifique com a equipe antes, caso seja necessário.'],
          ['Quais as cores disponíveis?', 'No momento, apenas preto.'],
          ['Qual a resolução do totem?', '32" Full HD; 43" e 55" em 4K.'],
        ],
      },
      {
        type: 'specs', rows: [
          ['Tamanho diagonal', 'De 32 a 55 polegadas'], ['Cor', 'Preto'], ['Área ativa', 'De 698 × 392 mm a 1210 × 680 mm'],
          ['Dimensões externas', 'De 739 × 432 × 72 mm a 1250 × 720 × 77 mm'], ['Resolução', '4K, 3840 × 2160 px (32": Full HD)'], ['Contraste', '3000:1'],
          ['Brilho', '350 cd/m²'], ['Ângulo de visão', '178°'], ['Vida útil', '60.000 horas'], ['Superfície', 'Vidro antirreflexo ultrarresistente'],
          ['Taxa de atualização', '60 Hz'], ['Toques simultâneos', '20 pontos'], ['Tecnologia touch', 'Infravermelho'], ['Precisão do touch', '2 mm'],
          ['Reconhecimento do touch', 'Dedos e ponteiras'], ['Tempo de resposta', 'Menos de 5 ms'], ['Compatibilidade', 'Windows 7, 8, 10 e 11, Chrome OS, macOS e Linux'],
          ['Peso sem embalagem', 'De 9,9 kg a 20 kg'], ['Peso com embalagem', 'De 13,4 kg a 25 kg'], ['Voltagem', '110 a 240 V AC'],
          ['Consumo em standby', 'Menos de 0,5 W'], ['Consumo em funcionamento', 'Máximo de 225 W'], ['Temperatura de utilização', '0 °C a 50 °C'],
          ['Temperatura de armazenamento', '-20 °C a 60 °C'], ['Itens inclusos', ['1 monitor', '1 cabo de energia', '1 base de piso', '1 caneta (stylus)']], ['Garantia', '2 anos'],
        ],
      },
      help('Totem Interativo', 'Eventos'),
    ],
  },

  {
    path: '/flip-chart/', title: 'Flip Chart Digital 43" e 55"', kind: 'produto',
    metaTitle: 'Flip Chart Digital 43" e 55" com suporte de piso | Qualipix',
    description: 'Flip Chart Digital Qualipix de 43" e 55": tela 4K touch na vertical, pedestal com rodízios e ajuste de altura, OPS-PC e software de anotação.',
    crumbs: [['/flip-chart/', 'Flip Chart Digital']],
    blocks: [
      {
        type: 'hero', kicker: 'Flip Chart Digital Qualipix', img: 'flip', imgAlt: 'Flip Chart Digital Qualipix com tela vertical em pedestal com rodízios',
        title: 'Transforme suas reuniões, aulas e apresentações.',
        lead: 'Escreva, desenhe, compartilhe e colabore em tempo real com alta precisão e fluidez.',
        actions: [{ label: 'Quero saber mais', href: '#help', primary: true }, { label: 'Ver preços', href: '/flip-chart-digital-qualipix-43-e-55/' }],
        chips: ['Tamanhos 43" e 55"', 'Touch screen de alta precisão', 'Para palestras, reuniões e salas de aula', 'Imagem 4K e conectividade total'],
      },
      subnav('Flip Chart', '/flip-chart-digital-qualipix-43-e-55/', 'Flip Chart Digital'),
      {
        type: 'benefits', id: 'visao-geral', title: 'Uma solução versátil para qualquer espaço.', items: [
          { t: 'Para cada formato de encontro', d: 'Reuniões corporativas, workshops, aulas interativas ou treinamentos: o flip chart se adapta a diversas necessidades e espaços.' },
          { t: 'Fácil de usar', d: 'O touch é simples e permite trocar o flip chart de papel pelo digital sem conhecimento técnico avançado.' },
          { t: 'Menos papel, menos custo', d: 'Economize recursos, reduza custos com materiais e gere um impacto positivo no meio ambiente.' },
        ],
      },
      { type: 'video', youtube: 'WKPB7CbPnww', poster: 'flip', title: 'Leva, liga e usa.', lead: 'Veja o Flip Chart Digital Qualipix em uma reunião.' },
      {
        type: 'faq', items: [
          ['Quais os tamanhos disponíveis?', '43" e 55".'],
          ['Acompanha software de escrita?', 'Sim.'],
          ['É possível usar no modo paisagem?', 'Sim.'],
          ['Entrega em todo o Brasil?', 'Sim. Consulte o frete.'],
        ],
      },
      {
        type: 'specs', rows: [
          ['Resolução do display', '4K'], ['Dimensões externas', '1900 × 720 × 72 mm (55") e 1700 × 569 × 72 mm (43")'], ['Contraste', '1200:1 / 4000:1'],
          ['Cores', '1,07 bilhão'], ['Brilho', '350 nits'], ['Ângulo do painel', '178°'], ['Alto-falantes', '10 W × 2'], ['Tecnologia', 'Infravermelho'],
          ['Toques simultâneos', '20'], ['Conexões', '1 HDMI e 1 USB'], ['Peso líquido', '43": 15 kg; 55": 25 kg'], ['Peso bruto', '43": 38 kg; 55": 57 kg'],
          ['OPS-PC', 'Intel Core i5 de 10ª geração, SSD de 256 GB, 8 GB de RAM, Wi-Fi, Windows'],
          ['Suporte de piso', ['Ajuste de altura', 'Bandeja para notebook com ajuste de altura', 'Passagem interna para fiação', 'Rodízios para superfícies planas']],
          ['Itens inclusos', ['Monitor Qualipix 43" ou 55"', 'Suporte de piso', 'OPS-PC', '2 canetas', 'Cabos para usar um PC externo', 'Software de anotação']],
          ['Garantia', '2 anos (3 meses de garantia legal e 21 meses concedidos pela Qualipix)'],
        ],
      },
      help('Flip Chart Digital', 'Corporativo'),
    ],
  },
];

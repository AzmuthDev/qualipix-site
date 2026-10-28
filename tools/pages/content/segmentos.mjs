// Páginas de segmento do menu "Segmentos" e as listagens /segmentos/... do site atual.
const RESIST = 'Os equipamentos da Qualipix têm design moderno e, ao mesmo tempo, robustez e resistência para ambientes com grande fluxo de pessoas. A interação pode ser feita com os dedos, e o produto acompanha caneta magnética de ponta fina.';
const FAQ = (tamanhos = '32" a 98".') => [
  ['Quais os tamanhos disponíveis?', tamanhos],
  ['Quais soluções a Qualipix oferece?', 'Lousas digitais com touch nativo, molduras que transformam a TV em touch, quadro híbrido, totem e flip chart digital.'],
  ['Posso comprar e alugar?', 'Atualmente trabalhamos somente com venda de equipamentos.'],
  ['Qual o tempo de garantia?', '2 anos.'],
  ['Quanto tempo para entrega?', 'Em poucos dias você já poderá usar seu equipamento.'],
  ['Qual a resolução das lousas?', '4K.'],
];

const SEG = [
  {
    path: '/corporativo/', sub: '/segmentos/corporativo/', title: 'Corporativo', area: 'Corporativo', yt: 'UDRfsfOapLE', poster: 'lousa',
    description: 'Lousa digital para empresas, gestão à vista e monitor touch: lousas, molduras, totens e flip charts Qualipix para reuniões mais produtivas.',
    h1: 'Reuniões mais produtivas.', lead: 'Lousas, molduras, totens e flip charts digitais touchscreen para salas de reunião, treinamentos e gestão à vista.',
    chips: ['Imagem 4K com touch nativo', 'Acabamento premium de alta resistência', 'Interaja com total confiança', 'Perfeito para o mercado corporativo'],
    intro: ['Os equipamentos da Qualipix são projetados para tornar apresentações mais dinâmicas.', 'Com diversas aplicações, eles podem ser usados em salas de reunião, treinamentos, feiras de negócios, eventos corporativos, lojas, recepções e áreas de espera para oferecer interatividade e engajamento aos usuários.'],
    products: ['/lousa-digital/', '/moldura-touch', '/flip-chart', '/totem-interativo'], faq: FAQ(),
  },
  {
    path: '/educacao/', sub: '/segmentos/educacao/', title: 'Educação', metaTitle: 'Lousa digital para escolas e universidades | Qualipix', area: 'Educação', yt: 'UDRfsfOapLE', poster: 'quadro',
    description: 'Lousas digitais, quadro híbrido e a plataforma QualipixClass para salas de aula mais interativas e alunos mais engajados.',
    h1: 'Aulas mais interativas. Alunos mais engajados.', lead: 'Lousas digitais, quadro híbrido e plataforma educacional para a sala de aula.',
    chips: ['Imagem 4K com touch nativo', 'Acabamento premium de alta resistência', 'Interaja com total confiança', 'Perfeito para o mercado educacional'],
    intro: ['Os equipamentos da Qualipix são desenvolvidos para tornar as aulas mais dinâmicas, interativas e envolventes.', 'Com diversas aplicações e benefícios para o aprendizado, podem ser usados em salas de aula, laboratórios, bibliotecas, auditórios e salas de formação, levando interatividade e engajamento a professores e alunos.'],
    products: ['/lousa-digital/', '/quadro-branco', '/lousamax80', '/moldura-touch'],
    faq: FAQ('Lousas de 32" a 98". O Quadro Híbrido tem 2 tamanhos: 4,00 × 1,30 m e 3,20 × 1,30 m.'),
  },
  {
    path: '/eventos/', sub: '/segmentos/eventos/', title: 'Eventos', area: 'Eventos', yt: 'UDRfsfOapLE', poster: 'totem',
    description: 'Totens e lousas digitais Qualipix para criar experiências memoráveis em feiras, exposições e eventos corporativos.',
    h1: 'Experiências memoráveis em feiras e eventos.', lead: 'Totens e lousas digitais touch para estandes, credenciamento e apresentações de alto impacto.',
    chips: ['Imagem 4K com touch nativo', 'Acabamento premium de alta resistência', 'Interaja com total confiança', 'Perfeito para feiras e exposições'],
    intro: ['Os equipamentos da Qualipix são projetados para tornar apresentações mais dinâmicas.', 'Podem ser usados em salas de reunião, treinamentos, feiras de negócios, eventos corporativos, lojas, recepções e áreas de espera para oferecer interatividade e engajamento ao público.'],
    products: ['/totem-interativo', '/lousa-digital/', '/flip-chart', '/moldura-touch'], faq: FAQ(),
  },
  {
    path: '/governo/', sub: '/segmentos/governo/', title: 'Governo', metaTitle: 'Quadro Híbrido para escolas públicas e licitação | Qualipix', area: 'Governo', yt: '9soZV1q43jM', poster: 'quadro',
    description: 'Quadro Híbrido Qualipix para escolas públicas: quadro cerâmico, lousa digital e plataforma pedagógica com IA, com instalação e treinamento.',
    h1: 'Mais aprendizado. Mais inclusão. Mais resultados para a educação pública.', lead: 'O Quadro Híbrido une quadro cerâmico, lousa digital e plataforma pedagógica em uma única solução para escolas públicas.',
    chips: ['Lousa digital integrada', 'Plataforma com mais de 6.000 materiais prontos e IA', 'Quadro branco convencional cerâmico', 'Perfeito para a educação pública'],
    intro: ['O Quadro Híbrido Qualipix foi desenvolvido para modernizar as salas de aula de escolas públicas.', 'Ele une a praticidade do quadro tradicional aos recursos da tecnologia interativa em uma única solução: quadro cerâmico, lousa digital e plataforma pedagógica, para aulas mais dinâmicas, colaborativas e eficientes.'],
    resist: 'O Quadro Híbrido foi desenvolvido para o uso intenso das salas de aula. Ele integra o quadro tradicional à lousa digital e oferece mais recursos ao professor sem abandonar a forma de ensinar que ele já domina. Com estrutura robusta, superfície em aço cerâmico e 3 anos de garantia na área de escrita, é uma solução durável, de baixa manutenção e preparada para atender milhares de alunos, valorizando cada real investido pela gestão pública.',
    products: ['/quadro-branco', '/lousa-digital/', '/class/'],
    faq: [
      ['Quais os tamanhos disponíveis?', '4,00 m × 1,30 m e 3,20 m × 1,30 m.'],
      ['A instalação está inclusa?', 'Sim. Além da instalação, a Qualipix oferece também o treinamento.'],
      ['Posso comprar e alugar?', 'Atualmente trabalhamos somente com venda de equipamentos.'],
      ['Qual o tempo de garantia?', '2 anos na lousa digital e 3 anos na superfície de escrita.'],
      ['Quanto tempo para entrega?', 'Em poucos dias você já poderá usar seu equipamento.'],
      ['Qual a resolução das lousas?', '4K.'],
    ],
  },
  {
    path: '/saude/', sub: '/segmentos/saude/', title: 'Saúde', metaTitle: 'Monitor touch 4K para consultórios e clínicas | Qualipix', area: 'Saúde', yt: 'vEiQGEWIX9I', poster: 'lousa',
    description: 'Monitores touch 4K Qualipix para consultórios: apresente exames, diagnósticos e planejamentos com clareza ao paciente.',
    h1: 'Tecnologia que fortalece a confiança entre profissional e paciente.', lead: 'Apresente diagnósticos, exames e planejamentos em uma tela interativa de alta definição.',
    chips: ['Monitor touch 4K', 'Acabamento premium de alta resistência', 'Confiança na apresentação', 'Perfeito para consultórios'],
    intro: ['Os equipamentos da Qualipix foram desenvolvidos para tornar consultas mais claras, dinâmicas e interativas.', 'Com resolução 4K e tecnologia touchscreen, permitem apresentar radiografias, tomografias, exames, planejamentos e imagens clínicas com riqueza de detalhes, facilitando a comunicação entre o profissional e o paciente.'],
    products: ['/lousa-digital/', '/totem-interativo', '/moldura-touch'], faq: FAQ(),
  },
  {
    path: '/arquitetos/', sub: '/segmentos/arquitetos-e-engenheiros/', title: 'Arquitetos, Engenheiros, Imobiliárias e Incorporadoras', menu: 'Arquitetos e Engenheiros', area: 'Arquitetura e engenharia', yt: 'UDRfsfOapLE', poster: 'lousa',
    description: 'Telas touch 4K Qualipix para escritórios de arquitetura e engenharia, imobiliárias e estandes de vendas: projetos mais claros e decisões mais rápidas.',
    h1: 'Projetos mais claros. Decisões mais rápidas.', lead: 'Apresente plantas, renders e projetos em telas touch 4K para clientes e equipes.',
    chips: ['Imagem 4K com touch nativo', 'Acabamento premium de alta resistência', 'Interaja com total confiança', 'Perfeito para escritórios de arquitetura e engenharia'],
    intro: ['Os equipamentos da Qualipix são projetados para tornar apresentações mais dinâmicas.', 'Podem ser usados em escritórios, feiras de negócios, eventos corporativos e estandes de vendas para oferecer interatividade e engajamento aos clientes.'],
    products: ['/lousa-digital/', '/totem-interativo', '/flip-chart', '/moldura-touch'], faq: FAQ(),
  },
];

const CLASS_CARD = { href: '/class/', name: 'QualipixClass', desc: 'Plataforma de aulas com inteligência artificial e milhares de materiais prontos.', img: 'quadro' };

function segPage(s) {
  return {
    path: s.path, title: s.title, metaTitle: s.metaTitle, description: s.description, kind: 'segmento',
    crumbs: [['/segmentos/', 'Segmentos'], [s.path, s.menu || s.title]],
    blocks: [
      { type: 'hero', kicker: s.menu || s.title, title: s.h1, lead: s.lead, actions: [{ label: 'Quero saber mais', href: '#help', primary: true }, { label: 'Ver soluções', href: '#solucoes' }], chips: s.chips, img: s.poster, imgAlt: '' },
      { type: 'subnav', title: s.menu || s.title, items: [['#visao-geral', 'Diferenciais'], ['#faq', 'Perguntas frequentes'], ['#help', 'Fale com um especialista']] },
      { type: 'intro', id: 'visao-geral', title: s.chips[3] + '.', text: s.intro },
      { type: 'statement', text: 'Qualidade e <em>resistência</em>.', sub: s.resist || RESIST },
      { type: 'products', id: 'solucoes', title: 'Soluções indicadas', items: s.products.map((h) => (h === '/class/' ? CLASS_CARD : h)) },
      { type: 'video', youtube: s.yt, poster: s.poster, title: 'Veja na prática.', lead: `Equipamentos Qualipix em uso no segmento ${s.menu || s.title}.` },
      { type: 'faq', items: s.faq },
      { type: 'cta', interest: `soluções para ${s.menu || s.title}`, area: s.area },
    ],
  };
}

export default [
  ...SEG.map(segPage),
  // listagens antigas /segmentos/... : mesmo conteúdo, página principal é a do menu
  ...SEG.map((s) => ({ ...segPage(s), path: s.sub, canonical: s.path })),
  {
    path: '/segmentos/', title: 'Segmentos', kind: 'lista',
    description: 'Soluções Qualipix por segmento: educação, corporativo, governo, saúde, eventos, arquitetura e engenharia.',
    crumbs: [['/segmentos/', 'Segmentos']],
    blocks: [
      { type: 'hero', kicker: 'Segmentos', title: 'Descubra a solução ideal para o seu segmento.', lead: 'Onde tem inovação, #temQualipix: escolas, empresas, órgãos públicos, consultórios, eventos e escritórios de projeto.' },
      { type: 'products', title: 'Escolha um segmento', items: SEG.map((s) => ({ href: s.path, name: s.menu || s.title, desc: s.lead, img: s.poster, cta: 'Ver soluções' })) },
      { type: 'cta', interest: 'soluções por segmento' },
    ],
  },
];

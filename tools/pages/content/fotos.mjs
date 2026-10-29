// Fotos reais da Qualipix (ensaio do site atual, exportado pelo painel da Wbuy em 28/10/2026).
// Arquivos em assets/img/fotos/. O gerador põe o mosaico "Na prática" antes do vídeo de cada página
// (ou antes das perguntas frequentes) e, nos segmentos, usa a foto do ambiente no topo.
// second: true põe o mosaico logo depois do topo (segunda dobra).
const G = {
  lousa: { title: 'Do plano de aula à planta do projeto.', items: [['lousa-planta', 'Apresentador explicando uma planta de arquitetura na Lousa Digital Qualipix', 'Projetos em 4K'], ['lousa-grafico', 'Mãos desenhando sobre um gráfico na lousa', 'Anotações sobre qualquer conteúdo'], ['lousa-planta-close', 'Caneta apontando detalhes de uma planta na lousa', 'Precisão de 2 mm']] },
  moldura: { title: 'A moldura encaixa na TV que você já tem.', items: [['moldura-apresentador', 'Apresentador segurando a Moldura Touch Qualipix', 'Moldura de alumínio com vidro de 4 mm'], ['moldura-menu', 'Menu do software de escrita na moldura', 'Software de escrita incluso'], ['moldura-usb', 'Cabo USB da moldura', 'Um cabo USB, sem driver']] },
  max80: { title: 'A imagem do projetor, agora com toque.', items: [['lousa-branca-apresentador', 'Professor sorrindo ao lado da Lousa Branca Interativa Max80i', 'Lousa de 80"'], ['lousa-branca-detalhe', 'Detalhe da superfície branca da lousa interativa', 'Superfície em alumínio branco fosco']] },
  quadro: { title: 'O quadro branco fica. A lousa digital chega.', items: [['quadro-sistema-solar', 'Professor apresentando o sistema solar no Quadro Híbrido Qualipix', 'Aula pronta em segundos'], ['quadro-escrita', 'Professor escrevendo no quadro branco cerâmico', 'Aço cerâmico, 3 anos de garantia'], ['quadro-paineis', 'Painéis deslizantes do Quadro Híbrido', 'Painéis que deslizam no trilho']] },
  totem: { title: 'Autoatendimento com presença.', items: [['totem-apresentador', 'Apresentador usando o Totem Interativo Qualipix', 'Base de piso estável'], ['totem-toque', 'Mão tocando a tela do totem', 'Touch 4K com 20 pontos'], ['totem-conexoes', 'Conexões laterais do totem', 'OPS-PC Windows integrado']] },
  flip: { title: 'Leva para a sala, liga e apresenta.', items: [['flip-produto', 'Flip Chart Digital Qualipix com tela vertical em pedestal', 'Pedestal com rodízios'], ['flip-reuniao', 'Pessoa marcando informações em um gráfico no flip chart', 'Anotações em tempo real'], ['flip-dados', 'Silhueta apontando dados em uma tabela no flip chart', 'Imagem 4K na vertical']] },
};

// caminho da página -> mosaico
export const GALLERIES = {
  '/lousa-digital/': { ...G.lousa, second: true }, '/monitor-touch-qualipix-linha-sx/': G.lousa, '/lousa-digital-qualipix-linha-dx/': G.lousa,
  '/moldura-touch/': { ...G.moldura, second: true }, '/moldura-touch-qualipix/': G.moldura,
  '/lousamax80/': G.max80, '/lousa-branca-interativa-qualipix/': G.max80,
  '/quadro-branco/': G.quadro, '/quadro-branco-integrado-com-lousa-digital-e-plataforma-de-ia/': G.quadro,
  '/totem-interativo/': G.totem, '/totens-qualipix/': G.totem,
  '/flip-chart/': G.flip, '/flip-chart-digital-qualipix-43-e-55/': G.flip,
  '/class/': { title: 'A plataforma na sala de aula.', items: [['quadro-sistema-solar', 'Professor usando a QualipixClass no Quadro Híbrido', 'Aulas prontas com IA'], ['class-chat', 'Tela de conversa com a assistente Professora Stacy', 'Professora Stacy'], ['edu-escrita', 'Professor escrevendo na lousa digital', 'Integrada às lousas Qualipix']] },
  '/m/empresa/': { kicker: 'A Qualipix', title: 'Quem usa, recomenda.', items: [['lousa-planta', 'Apresentador da Qualipix usando a lousa digital'], ['totem-apresentador', 'Totem Interativo Qualipix em uso'], ['quadro-sistema-solar', 'Quadro Híbrido Qualipix em aula']] },
};

// segmentos: foto do topo e mosaico
export const SEGMENT_PHOTOS = {
  corporativo: { bg: 'seg-corporativo', items: [['seg-corporativo', 'Reunião com gráficos na lousa digital em uma sala corporativa', 'Salas de reunião'], ['lousa-grafico', 'Anotações sobre um gráfico na lousa', 'Gestão à vista'], ['flip-dados', 'Dados apresentados no flip chart digital', 'Flip chart para squads']] },
  educacao: { bg: 'seg-educacao', items: [['edu-anatomia', 'Professor explicando anatomia na lousa digital', 'Aulas mais visuais'], ['edu-coracao', 'Desenho sobre o coração humano na lousa', 'Anotações em tempo real'], ['edu-escrita', 'Professor escrevendo na lousa', 'Escrita com a caneta']] },
  eventos: { bg: 'seg-eventos', items: [['totem-apresentador', 'Totem Interativo Qualipix em um evento', 'Totem para credenciamento'], ['seg-eventos', 'Telas Qualipix em um ambiente de evento', 'Impacto visual'], ['totem-toque', 'Visitante tocando a tela do totem', 'Interação com o público']] },
  governo: { bg: 'seg-governo', items: [['quadro-sistema-solar', 'Professor usando o Quadro Híbrido em sala de aula', 'Quadro Híbrido'], ['seg-governo', 'Sala de aula de escola pública com lousa digital', 'Escolas públicas'], ['quadro-escrita', 'Professor escrevendo no quadro cerâmico', 'Superfície cerâmica']] },
  saude: { bg: 'seg-saude', items: [['saude-consulta', 'Médico explicando um exame para a paciente em uma tela Qualipix', 'Consultas mais claras'], ['saude-raio-x', 'Profissional apontando uma radiografia na tela touch', 'Exames em 4K'], ['saude-paciente', 'Médico e paciente conversando diante do monitor', 'Confiança do paciente']] },
  arquitetos: { bg: 'seg-arquitetos', items: [['arq-planta', 'Arquiteto apresentando uma planta na lousa digital', 'Plantas em tamanho real'], ['arq-planta-close', 'Caneta sobre os detalhes da planta', 'Detalhes com zoom'], ['seg-arquitetos', 'Escritório de arquitetura com lousa digital', 'Escritórios e estandes']] },
};

// página inicial: foto de cada aba de segmento
export const HOME_SEGMENTS = {
  'seg-edu': ['edu-anatomia', 'Professor explicando anatomia na lousa digital'],
  'seg-corp': ['seg-corporativo', 'Reunião com gráficos na lousa digital'],
  'seg-gov': ['quadro-sistema-solar', 'Quadro Híbrido em uma sala de aula'],
  'seg-saude': ['saude-consulta', 'Médico explicando um exame para a paciente'],
  'seg-eventos': ['totem-apresentador', 'Totem Interativo Qualipix'],
};

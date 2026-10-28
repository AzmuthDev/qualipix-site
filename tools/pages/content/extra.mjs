// QualipixClass e Video Wall.
export default [
  {
    path: '/class/', title: 'Qualipix Class', kind: 'produto',
    metaTitle: 'QualipixClass: plataforma de aulas com inteligência artificial | Qualipix',
    description: 'QualipixClass: crie, planeje e gerencie aulas com IA, com a assistente Professora Stacy, milhares de materiais prontos, cursos gratuitos e botão de pânico.',
    crumbs: [['/class/', 'QualipixClass']],
    blocks: [
      {
        type: 'hero', kicker: 'QualipixClass', img: 'quadro', imgAlt: 'Quadro Híbrido Qualipix com a plataforma QualipixClass na tela',
        title: 'Sua sala de aula na era da inteligência artificial.',
        lead: 'Crie, planeje e gerencie aulas com IA, conectando professores, alunos e responsáveis de forma simples.',
        actions: [{ label: 'Quero saber mais', href: '#help', primary: true }, { label: 'Experimente', href: '/fale-conosco/' }],
        chips: ['Criação de aulas com IA', 'Milhares de materiais prontos', 'Mais de 150 cursos gratuitos', 'Integrada às lousas digitais Qualipix'],
      },
      { type: 'subnav', title: 'QualipixClass', items: [['#visao-geral', 'Visão geral'], ['#faq', 'Perguntas frequentes']], cta: ['/fale-conosco/', 'Experimente'] },
      {
        type: 'intro', id: 'visao-geral', title: 'A solução para quem busca eficiência, inovação e segurança na gestão educacional.',
        text: ['A QualipixClass é uma plataforma intuitiva, com ferramentas inteligentes para criar aulas interativas, gerir tarefas e colaborar.', 'Integrada às <a href="/lousa-digital/">lousas digitais Qualipix</a>, oferece milhares de recursos, como vídeos, imagens e planos de aula, prontos para uso imediato.', 'A assistente virtual Professora Stacy ajuda os professores a usar as ferramentas da plataforma, mesmo sem conhecimento técnico.'],
      },
      {
        type: 'benefits', title: 'Os principais recursos da QualipixClass.', items: [
          { t: 'Criação de aulas com IA', d: 'Planeje aulas passo a passo ou gere conteúdos completos com a Professora Stacy, sem pesquisa externa.' },
          { t: 'Gestão de tarefas', d: 'Crie e corrija exercícios, acompanhe o progresso dos alunos e organize materiais em pastas automáticas.' },
          { t: 'Colaboração', d: 'Converse com os alunos por chat, compartilhe aulas com colegas e mantenha os pais informados em uma área dedicada.' },
          { t: 'Materiais prontos', d: 'Milhares de recursos, como vídeos, imagens e planos de aula, prontos para usar.' },
          { t: 'Segurança', d: 'O botão de pânico envia alertas por WhatsApp, SMS e e-mail, com chamada de vídeo em emergências.' },
          { t: 'Capacitação', d: 'Mais de 150 cursos gratuitos em diversas áreas para o crescimento profissional.' },
        ],
      },
      { type: 'video', youtube: 'oL5u33UyX8M', poster: 'quadro', title: 'Conheça a plataforma.', lead: 'A Professora Stacy montando uma aula em poucos minutos.' },
      {
        type: 'faq', items: [
          ['A plataforma é fácil de usar?', 'Sim. A interface é intuitiva, e a assistente virtual Professora Stacy guia você em cada etapa, mesmo sem familiaridade com tecnologia. Também oferecemos treinamentos e tutoriais em vídeo.'],
          ['Preciso de uma Lousa Digital Qualipix para usar a QualipixClass?', 'Não. A QualipixClass é uma plataforma web e funciona em qualquer dispositivo com navegador: computador, tablet ou celular. A integração com as lousas Qualipix potencializa a experiência em sala de aula.'],
          ['Os conteúdos gerados pela IA são confiáveis?', 'Sim. Os conteúdos gerados pela Professora Stacy são alinhados à BNCC e podem ser revisados pelos professores.'],
          ['Quais cursos de capacitação estão disponíveis?', 'Mais de 150 cursos gratuitos em áreas como programação, design, inglês e administração, para professores e alunos.'],
          ['Como obtenho suporte?', 'Pela assistente virtual Professora Stacy, pelos tutoriais em vídeo ou com a nossa equipe por WhatsApp ou chamada de vídeo.'],
        ],
      },
      { type: 'cta', interest: 'QualipixClass', area: 'Educação' },
    ],
  },
  {
    path: '/video-wall/', title: 'Video Wall', kind: 'produto',
    metaTitle: 'Video Wall para salas de comando, vitrines e auditórios | Qualipix',
    description: 'Video Wall Qualipix: painel com várias telas para grande impacto visual, monitoramento 24/7, salas de comando, vitrines e auditórios.',
    crumbs: [['/video-wall/', 'Video Wall']],
    blocks: [
      {
        type: 'hero', kicker: 'Video Wall', title: 'Grande impacto visual, em escala.',
        lead: 'Um painel com várias telas para salas de comando, monitoramento 24/7, vitrines, auditórios e eventos. A Qualipix dimensiona o projeto com você.',
        actions: [{ label: 'Pedir um projeto', href: '#help', primary: true }, { label: 'Comparar soluções', href: '/m/qual-solucao-escolher/' }],
        chips: ['Painel com várias telas', 'Monitoramento 24/7', 'Salas de comando e NOC', 'Vitrines e auditórios'],
      },
      {
        type: 'benefits', id: 'visao-geral', title: 'Quando escolher um video wall.', items: [
          { t: 'Salas de comando', d: 'Centros de controle, NOC e war rooms que precisam ver muitos dados ao mesmo tempo.' },
          { t: 'Vitrines e varejo', d: 'Mídia em grande formato que para quem passa.' },
          { t: 'Auditórios e eventos', d: 'Imagem grande e brilhante, mesmo com a luz acesa.' },
          { t: 'Indústria e logística', d: 'Painéis de status no centro de controle operacional.' },
        ],
      },
      {
        type: 'columns', title: 'Na comparação com as outras soluções', lead: 'Dados do guia <a href="/m/qual-solucao-escolher/">Qual solução escolher</a>.', cols: [
          { title: 'Onde ganha', items: ['Escala e visibilidade', 'Ótimo em ambientes muito iluminados', 'Mídia e projeção em grande formato'] },
          { title: 'O que considerar', items: ['Interatividade baixa (opcional com sensor)', 'Instalação média: estrutura e controladora', 'Custo total alto'] },
        ],
      },
      { type: 'cta', interest: 'Video Wall', area: 'Corporativo', title: 'Vamos dimensionar o seu video wall?', lead: 'Conte o espaço, a distância de visão e o uso. Um especialista responde pelo WhatsApp.' },
    ],
  },
];

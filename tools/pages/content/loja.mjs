// Produtos da loja (endereços com preço do site atual), categorias e serviços.
// Texto e preços lidos no painel da Wbuy em 28/10/2026.
const R = (v) => `R$ ${v}`;
const help = (interest, area) => ({ type: 'cta', interest, area, title: 'Ficou com alguma dúvida?', lead: 'Fale com um especialista antes de comprar. A mensagem abre no WhatsApp da Qualipix já preenchida.' });

// ------------------------------------------------------------------ catálogo
// cat: categoria da loja; card: dados do cartão nas listagens
export const CATALOG = [
  {
    slug: 'monitor-touch-qualipix-linha-sx', name: 'Monitor Touch Qualipix Linha SX', cat: 'lousa', img: 'lousa',
    card: 'Lousa digital 4K de 32", 43" e 55" para usar com computador Windows.', from: '3.990,00',
    variations: [['32"', '3.990,00'], ['43"', '6.990,00'], ['55"', '8.540,50']], landing: ['/lousa-digital/', 'Conhecer a lousa digital'],
    kicker: 'Lousa Digital · Linha SX', lead: 'Solução versátil para atendimento, autosserviço e apresentações em ambientes corporativos e educacionais. Requer PC Windows; o computador OPS é opcional.',
    apps: [['Recepções corporativas', 'Check-in e direcionamento'], ['Saúde', 'Clínicas e hospitais com autoatendimento'], ['Indústria', 'Painéis operacionais e controle'], ['Alimentação', 'Cardápios digitais interativos'], ['Varejo', 'Consulta de produtos e autosserviço'], ['Educação', 'Estações interativas e apoio pedagógico'], ['Espaços compartilhados', 'Portaria digital e acesso'], ['Fitness', 'Check-in e gestão de alunos']],
    features: ['<strong>Alta precisão ao toque:</strong> navegação fluida e rápida', '<strong>Construção robusta:</strong> ideal para uso contínuo', '<strong>Vidro temperado:</strong> mais resistência e segurança', '<strong>Operação 24/7:</strong> funcionamento ininterrupto', '<strong>Design profissional:</strong> valoriza o ambiente'],
    results: ['Redução de filas e gargalos', 'Aumento da produtividade', 'Melhoria na experiência do usuário', 'Padronização de processos', 'Integração com sistemas existentes'],
    specs: [['32"', 'Área ativa 698 × 392 mm; externas 739 × 432 × 72 mm'], ['43"', 'Área ativa 941 × 529 mm; externas 980 × 569 × 72 mm'], ['55"', 'Área ativa 1210 × 680 mm; externas 1250 × 720 × 77 mm'],
      ['Estrutura', 'Metal e alumínio, preto'], ['Display', '4K, 350 nits, vidro temperado antirreflexo'], ['Áudio', '2 alto-falantes de 10 W'], ['Touch', 'Infravermelho, 20 toques simultâneos'],
      ['Computador', 'Compatível com módulo OPS e com computadores Windows externos'], ['Conexões', '1 HDMI, 1 USB touch, 1 USB mídia'], ['Sistemas', 'Não compatível com Mac ou Linux'],
      ['Energia', 'Bivolt, consumo máximo de 225 W'], ['Itens inclusos', ['1 display', '1 cabo de energia', '1 caneta magnética', '1 suporte de parede']], ['Garantia', '2 anos']],
  },
  {
    slug: 'lousa-digital-qualipix-linha-dx', name: 'Lousa Digital Qualipix Linha DX', cat: 'lousa', img: 'lousa',
    card: 'Lousa digital 4K de 65" a 98" com Android 14, câmera e microfone.', from: '10.915,50',
    variations: [['65"', '10.915,50'], ['75"', '12.815,50'], ['86"', '16.625,00'], ['98"', '28.490,50']], landing: ['/lousa-digital/', 'Conhecer a lousa digital'],
    kicker: 'Lousa Digital · Linha DX', lead: 'Solução completa para aulas, reuniões e apresentações. Android 14, 8 GB de RAM, 128 GB, câmera e microfone: uso imediato, sem computador externo. PC Windows (OPS) opcional.',
    apps: [['Salas de reunião', 'Apresentações dinâmicas e colaborativas'], ['Educação', 'Aulas mais interativas e engajadoras'], ['Treinamentos corporativos', 'Maior retenção de conteúdo'], ['Centros de controle', 'Visualização estratégica de dados'], ['Coworkings', 'Colaboração em tempo real'], ['Empresas', 'Reuniões e alinhamentos internos']],
    features: ['<strong>Multitoque de alta precisão:</strong> várias pessoas interagindo ao mesmo tempo', '<strong>Android integrado:</strong> uso imediato, sem depender de PC', '<strong>Resolução 4K:</strong> máxima qualidade de imagem', '<strong>Vidro temperado antirreflexo:</strong> durabilidade e boa visibilidade', '<strong>Operação contínua:</strong> preparada para uso intensivo', '<strong>Espelhamento de tela:</strong> conexão sem fio com celulares e notebooks'],
    results: ['Reuniões mais curtas', 'Mais engajamento em aulas e treinamentos', 'Substituição de projetores e redução de custos', 'Padronização de apresentações', 'Mais colaboração entre equipes'],
    specs: [['65"', 'Área ativa 1431 × 806 mm; 1484 × 887 × 118 mm'], ['75"', 'Área ativa 1653 × 931 mm; 1706 × 1012 × 118 mm'], ['86"', 'Área ativa 1898 × 1069 mm; 1953 × 1151 × 118 mm'], ['98"', 'Área ativa 2158 × 1214 mm; 2216 × 1301 × 118 mm'],
      ['Estrutura', 'Metal e alumínio, preto'], ['Display', '4K, 350 nits, antirreflexo'], ['Touch', 'Infravermelho, 20 toques simultâneos'], ['Sistema', 'Android 14, 8 GB de RAM, 128 GB; apps de quadro branco, navegador e espelhamento'],
      ['Expansão', 'Pronta para módulo OPS (Windows)'], ['Compatibilidade', 'Windows 7, 8, 10 e 11, macOS e Linux'], ['Conexões', 'HDMI, USB touch, USB mídia'], ['Recursos', 'Câmera e microfone integrados'],
      ['Energia', 'Bivolt, consumo máximo de 225 W'], ['Itens inclusos', ['Monitor', 'Caneta (stylus) e 2 ponteiras', 'Cabo de energia', 'Controle remoto', 'Suporte de parede', 'QR code com instruções']], ['Garantia', '2 anos']],
  },
  {
    slug: 'moldura-touch-qualipix', name: 'Moldura Touch Qualipix', cat: 'moldura', img: 'moldura',
    card: 'Transforma TVs LED/LCD de 32" a 85" em tela touch. Com ou sem vidro antirreflexo.', from: '1.200,00',
    groups: [
      { label: 'Sem vidro antirreflexo', items: [['32"', '1.200,00'], ['39"', '1.700,50'], ['40"', '1.795,50'], ['42"', '2.080,50'], ['43"', '2.080,50'], ['48"', '2.175,50'], ['49"', '2.175,50'], ['50"', '2.270,50'], ['55"', '2.365,50'], ['58"', '2.365,50'], ['60"', '2.555,50'], ['65"', '2.745,50'], ['70"', '2.935,50'], ['75"', '3.410,50'], ['82"', '3.315,50'], ['85"', '4.990,00']] },
      { label: 'Com vidro antirreflexo', items: [['32" antirreflexo', '1.705,00'], ['39" antirreflexo', '1.800,00'], ['43" antirreflexo', '2.180,00'], ['49" antirreflexo', '2.275,00'], ['50" antirreflexo', '2.370,00'], ['55" antirreflexo', '2.465,00'], ['58" antirreflexo', '2.465,00'], ['60" antirreflexo', '2.655,00'], ['65" antirreflexo', '2.845,00'], ['70" antirreflexo', '3.035,00'], ['75" antirreflexo', '3.510,00']] },
    ],
    landing: ['/moldura-touch/', 'Conhecer a moldura'],
    kicker: 'Molduras Touch', lead: 'Transforme qualquer TV LED/LCD em uma tela interativa para aulas, reuniões e apresentações, sem investir em um display completo. Requer TV e PC Windows.',
    apps: [['Salas de aula', 'Aulas mais dinâmicas e interativas'], ['Treinamentos corporativos', 'Mais engajamento e retenção'], ['Salas de reunião', 'Apresentações colaborativas'], ['Eventos', 'Experiências digitais e interativas'], ['Empresas', 'Alto custo-benefício']],
    features: ['<strong>Transformação imediata:</strong> converte TVs em telas touch profissionais', '<strong>Alta precisão:</strong> navegação fluida e resposta rápida', '<strong>Instalação simples:</strong> integração rápida com TV e PC', '<strong>Compatibilidade ampla:</strong> funciona com diversos modelos', '<strong>Com antirreflexo:</strong> menos reflexo e acabamento premium, para salas claras e auditórios', '<strong>Sem antirreflexo:</strong> ideal para ambientes com pouca iluminação'],
    results: ['Aproveitamento das TVs que você já tem', 'Menor custo de implantação', 'Mais engajamento em aulas e reuniões', 'Implementação rápida', 'Escala com eficiência financeira'],
    specs: [['Tamanhos', '32", 39", 40", 42", 43", 48", 49", 50", 55", 58", 60", 65", 70", 75", 82" e 85"'], ['Medidas', 'De 703 × 396 mm (área ativa) e 741 × 434 mm (externa) no 32" até 1888 × 1060 mm e 1926 × 1098 mm no 85"'],
      ['Estrutura', 'Alumínio, preto'], ['Resolução', '32768 × 32768'], ['Tempo de resposta', '3 a 10 ms'], ['Touch', 'Infravermelho óptico, 20 toques, 450 fps, detecção mínima de 5 mm'],
      ['Conexão', 'USB 2.0, alimentação pela USB, plug and play, sem driver'], ['Luz ambiente', 'Até 150.000 lux'], ['Protocolos', 'HID, TUIO, Flash'], ['Software', 'Caneta, marca-texto, borracha, linhas e captura de tela'],
      ['Sistemas', 'Windows 7, 8, 10 e 11; Linux e macOS com toque único (no Mac, a tela deve ter o mesmo tamanho do display)'], ['Computador', 'Mínimo i3, 4 GB, HD de 250 GB; recomendado i5, 16 GB, SSD de 128 GB'],
      ['Ambiente', 'Operação de -20 °C a 70 °C, umidade de 10% a 90%'],
      ['Itens inclusos', ['Moldura touch com cabo USB', 'Vidro de proteção de 4 mm fixado à moldura', 'Kit de fixação', '2 suportes de segurança', '2 ponteiras de ponta fina', 'QR codes com instruções de fixação e software de escrita']], ['Garantia', '2 anos']],
  },
  {
    slug: 'lousa-branca-interativa-qualipix', name: 'Lousa Branca Interativa Max80', cat: 'max80', img: 'max80',
    card: 'Lousa de 80" que deixa touch a imagem do seu projetor.', from: '3.410,00', variations: [['80"', '3.410,00']], landing: ['/lousamax80', 'Conhecer a lousa branca'],
    kicker: 'Lousa Branca Interativa', lead: 'Transforme uma projeção em uma superfície interativa: escreva, interaja e controle conteúdos direto na imagem projetada. Requer projetor (data show) e PC Windows.',
    apps: [['Salas de aula', 'Interação direta com os conteúdos projetados'], ['Treinamentos', 'Explicações mais visuais e participativas'], ['Salas de reunião', 'Anotações e navegação sobre as apresentações'], ['Instituições de ensino', 'Modernização sem trocar os projetores'], ['Empresas', 'Apresentações mais dinâmicas e colaborativas']],
    features: ['<strong>Interação sobre a projeção:</strong> escreva, desenhe e navegue na imagem exibida', '<strong>Alta precisão ao toque:</strong> resposta rápida e controle fluido', '<strong>Integração com projetor:</strong> aproveita a estrutura que você já tem', '<strong>Instalação simplificada</strong>', '<strong>Compatível</strong> com softwares educacionais e corporativos'],
    results: ['Projetores comuns viram soluções interativas', 'Mais engajamento em aulas, treinamentos e reuniões', 'Atualização tecnológica com custo menor', 'Conteúdos mais fáceis de entender', 'Mais interação entre os participantes'],
    specs: [['Quadro', '82" de diagonal, 1712 × 1211 mm'], ['Área ativa', '80" de diagonal, 1656 × 1155 mm'], ['Peso', '18 kg (lousa e suporte); 20 kg com embalagem'], ['Superfície', 'Whiteboard film XPS em alumínio branco fosco'],
      ['Touch', 'Infravermelho óptico, 10 toques simultâneos, 300 pontos por segundo'], ['Resolução', '32768 × 32768'], ['Consumo', 'Menos de 1 W'], ['Temperatura', 'Operação de -15 °C a 50 °C'], ['Sistemas', 'Windows 7, 8, 10 e 11; Linux com toque único'],
      ['Funções do software', ['Escrever, desenhar, apagar', 'Salvar, imprimir ou enviar o conteúdo', 'Pausar vídeos e anotar sobre eles', 'Gravar a voz do professor com o que foi feito na tela', 'Inserir imagens, usar PowerPoint, calculadora e biblioteca de imagens', 'Zoom com movimento de pinça', 'Software em português e acesso à internet']],
      ['Itens inclusos', ['Suporte de parede', '2 canetas', 'Cabo USB 2.0', 'Manual em português', 'Software DrawView', 'Certificado de garantia']], ['Garantia', '2 anos']],
  },
  {
    slug: 'totens-qualipix', name: 'Totem Interativo Qualipix', cat: 'totem', img: 'totem',
    card: 'Display Qualipix, base de piso e OPS-PC Windows. 32", 43" e 55".', from: '10.440,00',
    variations: [['32"', '10.440,00'], ['43"', '11.390,50'], ['55"', '12.340,50']], landing: ['/totem-interativo', 'Conhecer o totem'],
    kicker: 'Totens', lead: 'Atendimento digital, autosserviço e interação em ambientes corporativos e comerciais. Já vem com PC Windows (OPS) integrado: pronto para usar.',
    apps: [['Recepções', 'Check-in digital e direcionamento de visitantes'], ['Clínicas e hospitais', 'Autoatendimento e gestão de filas'], ['Varejo', 'Consulta de produtos e autosserviço'], ['Restaurantes', 'Cardápio digital e pedidos'], ['Eventos', 'Credenciamento e interação com o público'], ['Empresas', 'Apresentações institucionais e onboarding'], ['Academias', 'Check-in e controle de acesso']],
    features: ['<strong>OPS integrado:</strong> pronto para uso imediato', '<strong>Touch de alta precisão:</strong> navegação fluida', '<strong>Base de piso robusta:</strong> estabilidade e presença profissional', '<strong>Construção reforçada:</strong> ideal para ambientes públicos', '<strong>Integração com sistemas:</strong> compatível com softwares de gestão', '<strong>Operação contínua:</strong> feito para uso intensivo'],
    results: ['Menos filas e tempo de atendimento', 'Equipe mais produtiva', 'Processos automatizados', 'Melhor experiência do cliente', 'Implantação rápida e sem complexidade'],
    specs: [['32"', 'Área ativa 699 × 393 mm; externas 1000 × 740 × 440 mm'], ['43"', 'Área ativa 941 × 529 mm; externas 1160 × 990 × 58 mm'], ['55"', 'Área ativa 1209 × 680 mm; externas 1260 × 1260 × 740 mm'],
      ['Base de piso', 'Aço carbono, preto'], ['Display', '3.840 × 2.160 (4K), contraste 3000:1, 350 cd/m², 178°, 60 Hz, 60.000 horas'], ['Superfície', 'Vidro temperado de 2 mm'],
      ['Touch', 'Infravermelho, 20 pontos, precisão de 3 mm, resposta abaixo de 5 ms'], ['Conexões', '1 HDMI, 1 USB 2.0'], ['Áudio', '2 alto-falantes de 10 W'], ['Energia', '110 a 240 V, máximo de 200 W'],
      ['Computador incluso', 'OPS Intel Core i5, 8 GB de RAM, SSD de 256 GB, Windows'], ['Itens inclusos', ['Cabo de energia', '2 ponteiras de ponta fina', 'Link com software de escrita']], ['Garantia', '2 anos']],
  },
  {
    slug: 'flip-chart-digital-qualipix-43-e-55', name: 'Flip Chart Digital Qualipix 43" e 55"', cat: 'flip', img: 'flip',
    card: 'Tela 4K touch na vertical, pedestal com rodízios e OPS-PC Windows.', from: '11.390,50',
    variations: [['43"', '11.390,50'], ['55"', '12.340,50']], landing: ['/flip-chart', 'Conhecer o flip chart'],
    kicker: 'Flip Chart Digital', lead: 'Solução móvel para apresentações, reuniões e treinamentos. Já vem com PC Windows (OPS) integrado e reduz o tempo de preparação.',
    apps: [['Salas de reunião', 'Apresentações colaborativas e dinâmicas'], ['Treinamentos', 'Explicações visuais com maior retenção'], ['Empresas', 'Alinhamentos e reuniões estratégicas'], ['Educação', 'Apoio a aulas interativas'], ['Eventos', 'Apresentações itinerantes']],
    features: ['<strong>OPS integrado:</strong> pronto para uso imediato', '<strong>Mobilidade total:</strong> estrutura com rodízios', '<strong>Touch de alta precisão</strong>', '<strong>Resolução 4K</strong>', '<strong>Design profissional</strong>', '<strong>Compatível</strong> com softwares de apresentação'],
    results: ['Apresentações interativas em qualquer ambiente', 'Menos tempo de preparação', 'Menos equipamentos externos', 'Mais engajamento', 'Comunicação mais clara e decisões mais rápidas'],
    specs: [['Display', '4K, contraste 1200:1 / 4000:1, 1,07 bilhão de cores, 350 nits, 178°'], ['Áudio', '2 alto-falantes de 10 W'], ['Touch', 'Infravermelho, 20 pontos, precisão de 2 mm, dedo ou caneta'], ['Sistemas', 'Windows 7, 8, 10 e 11'],
      ['Conexões', '1 HDMI, 1 USB touch'], ['Peso', '43": 15 kg (38 kg com embalagem); 55": 25 kg (57 kg)'], ['Energia', 'Bivolt; máximo de 335 W (43") e 450 W (55")'], ['Computador incluso', 'OPS Intel Core i5 de 10ª geração, 8 GB de RAM, SSD de 256 GB, Wi-Fi, Windows'],
      ['Suporte de piso', ['Aço carbono com pintura epóxi anticorrosão, preto', 'Altura de 1100 a 1500 mm, a cada 50 mm', 'Rodízios com trava', 'Bandeja para notebook de 500 × 290 mm', 'Passagem interna para fiação']],
      ['Itens inclusos', ['Display interativo 43" ou 55"', 'Suporte de piso', 'OPS-PC', '2 canetas', 'Cabos para PC externo', 'Software de anotação']], ['Garantia', '2 anos']],
  },
  {
    slug: 'quadro-branco-integrado-com-lousa-digital-e-plataforma-de-ia', name: 'Quadro Branco Integrado com Lousa Digital e Plataforma de IA', cat: 'quadro', img: 'quadro',
    card: 'Quadro cerâmico de 4 × 1,30 m, lousa de 75", OPS-PC e 12 meses de QualipixClass.', from: '25.222,00', variations: [['4,00 × 1,30 m com lousa de 75"', '25.222,00']], landing: ['/quadro-branco', 'Conhecer o Quadro Híbrido'],
    kicker: 'Quadro Híbrido', lead: 'Quadro branco cerâmico de 4 m × 1,30 m com lousa digital de 75" integrada e plataforma de inteligência artificial para criar aulas interativas.',
    apps: [['Alta durabilidade', 'Superfície cerâmica resistente a manchas e fácil de limpar'], ['Interatividade', 'Sincronize dispositivos e chame os alunos para participar'], ['Recursos avançados', 'Anotação em tempo real e compartilhamento de tela'], ['IA na sala de aula', 'Criação de aulas, textos e imagens com a QualipixClass']],
    features: ['Superfície de porcelana branca de 0,3 mm; aceita qualquer caneta de quadro branco', 'Estrutura de dupla camada: placa interna fixa e placa externa deslizante com trava', 'Espuma de alta densidade de 14,5 mm e traseira em aço galvanizado', 'Perfil de alumínio champanhe ou branco prateado; cantos em ABS', 'Rodas laterais em "U" com borracha amortecedora'],
    results: ['Quadro branco, criador de aulas e texto automático', 'Criador de imagens e auxiliar pedagógica por IA', 'Seletor de vídeos e imagens', 'Mais de 3.000 materiais prontos e aulas alinhadas à BNCC', 'Botão de pânico e treinamentos gravados'],
    resultsTitle: 'QualipixClass por 12 meses',
    specs: [['Quadro', '4000 × 1305 mm'], ['Display', '75", área ativa 1649 × 927 mm, 1706 × 1008 × 121 mm'], ['Imagem', '3840 × 2160 (4K), contraste 1200:1 / 4000:1, 350 cd/m², 178°'], ['Superfície do display', 'Vidro antirreflexo de 4 mm, dureza Mohs 7'],
      ['Touch', 'Infravermelho, 20 pontos, precisão de 2 mm, dedos e ponteiras'], ['Itens inclusos', ['Quadro branco', 'Display interativo 75"', 'OPS-PC Windows', 'Licença anual QualipixClass com 5 acessos']], ['Garantia', '3 anos']],
  },
  {
    slug: 'ponteira-loua-digital-qualipix-linha-dx-e-linha-sx', name: 'Ponteira Lousa Digital Qualipix linha DX e linha SX', cat: 'acessorio', icon: 'pen',
    card: 'Caneta touch passiva para lousas digitais Qualipix, sem bateria.', from: '180,00', variations: [['Unidade', '180,00']],
    kicker: 'Acessórios', lead: 'Caneta touch passiva para lousas digitais com tecnologia infravermelha. Escrita precisa e confortável para escrever, desenhar, selecionar e navegar, sem bateria ou recarga.',
    specs: [['Tipo', 'Caneta touch passiva'], ['Compatibilidade', 'Lousas Digitais Qualipix com tecnologia infravermelha (IR)'], ['Alimentação', 'Não usa bateria nem recarga'], ['Ponta', 'Arredondada'], ['Cor', 'Preta'], ['Construção', 'Corpo leve e ergonômico'], ['Garantia', '3 meses']],
  },
  {
    slug: 'suporte-de-piso-max120-com-ajuste-eletrico-de-altura-para-lousa-digital-qualipix', name: 'Suporte de Piso MAX120 com ajuste elétrico de altura', cat: 'acessorio', icon: 'stand',
    card: 'Pedestal motorizado com controle remoto para telas de 75" a 120".', from: '5.690,00', variations: [['Unidade', '5.690,00']],
    kicker: 'Acessórios', lead: 'Ajuste elétrico de altura para passar da posição sentada para em pé, com controle remoto, rodízios com trava e capacidade para displays grandes.',
    features: ['<strong>Ajuste elétrico de altura:</strong> transições suaves entre sentado e em pé, com ergonomia e acessibilidade', '<strong>Controle remoto:</strong> ajuste sem esforço físico', '<strong>Rodízios com travas:</strong> mobilidade e segurança', '<strong>Design moderno</strong> para ambientes corporativos e educacionais'],
    specs: [['Telas compatíveis', '75" a 120"'], ['Carga', 'Até 136,4 kg'], ['Furação VESA', '200 × 200 até 1000 × 600 mm'], ['Curso elétrico', '500 mm'], ['Altura do centro da tela', '1250 a 1750 mm do chão'], ['Altura máxima da estrutura', '2650 mm'],
      ['Base', '1170 mm de largura, 200 mm de profundidade'], ['Largura máxima', '1250 mm'], ['Energia', '100 a 240 V, 50/60 Hz, máximo de 150 W'], ['Controle', 'Controle remoto sem fio e painel touch'], ['Embalagem', '1277 × 718 × 205 mm, 44 kg'], ['Garantia', '1 ano']],
  },
  {
    slug: 'suporte-de-piso-para-display-e-tv-ate-86-polegadas', name: 'Suporte de piso para TV e display de 32" a 86"', cat: 'acessorio', icon: 'stand',
    card: 'Pedestal com rodízios, bandeja para notebook e ajuste de altura.', from: '1.605,50', variations: [['Unidade', '1.605,50']],
    kicker: 'Acessórios', lead: 'Pedestal de chão para lousa digital, monitor ou TV, com bandeja para notebook, passagem interna de fiação e rodízios com trava. Confira a furação VESA da sua TV antes de comprar.',
    specs: [['Material', 'Aço carbono com tratamento anticorrosão e pintura epóxi eletrostática, preto'], ['Telas compatíveis', '32" a 86", com até 55 kg'], ['Furação VESA', '200×100, 200×200, 200×300, 300×200, 300×300, 400×200, 400×300, 400×400, 600×200 ou 600×400 mm'],
      ['Carga', 'Até 90 kg no suporte e 5 kg na bandeja'], ['Altura', '1100 a 1500 mm do chão ao centro do monitor, a cada 50 mm'], ['Bandeja', '500 × 290 mm, com ajuste de altura'], ['Funções', ['Ajuste de altura da tela', 'Passagem interna para fiação', 'Rodízios com trava']],
      ['Observação', 'Parafusos nos padrões mais comuns do mercado; TV e notebook das fotos não acompanham']],
  },
  {
    slug: 'ops-windows-pc-qualipix-fixacao-inteligente', name: 'OPS Windows PC Qualipix', cat: 'acessorio', icon: 'pc',
    card: 'Computador que encaixa na lousa: Core i5, 8 GB, SSD de 256 GB, Windows 11 Pro.', from: '3.591,00', variations: [['Unidade', '3.591,00']],
    kicker: 'Acessórios', lead: 'Computador no padrão OPS (Open Pluggable Specification) que encaixa no compartimento traseiro da lousa digital, sem cabos aparentes.',
    specs: [['Processador', 'Intel Core i5 de 10ª geração (Ice Lake-U)'], ['Memória', '8 GB DDR4'], ['Armazenamento', 'SSD SATA de 256 GB'], ['Vídeo', 'HDMI e DisplayPort'], ['Rede', 'Wi-Fi (M.2 2230) e Ethernet gigabit'],
      ['Sistema', 'Windows 11 Professional em português'], ['Conexões', '1 HDMI, 1 DisplayPort, 6 USB 3.0, 1 USB-C, 1 RJ45, áudio P2 e microfone'], ['Alimentação', '19 V (não use fontes de 12 V)'], ['Dimensões e peso', '195 × 180 × 42 mm, 1,2 kg']],
  },
  {
    slug: 'tela-touch-moldura-qualipix-86-pol', name: 'Moldura Touch Qualipix 86"', cat: 'moldura', icon: 'frame',
    card: 'Moldura NX86 para TVs de 86", para ambientes de até 100 m².', from: '4.990,00', variations: [['86"', '4.990,00']], landing: ['/moldura-touch/', 'Conhecer a moldura'],
    kicker: 'Molduras Touch', lead: 'A Moldura Touchscreen NX86, com uma TV LED ou LCD do mesmo tamanho e um computador, é a solução para ambientes de até 100 m². Vidro antirreflexo opcional por mais R$ 350,00.',
    specs: [['Área ativa', '1900 × 1074 mm'], ['Dimensões externas', '1938 × 1112 mm'], ['Estrutura', 'Alumínio, preto'], ['Touch', 'Infravermelho, 10 toques, 450 fps, detecção mínima de 5 mm'], ['Resolução', '32768 × 32768'],
      ['Conexão', 'USB 2.0, plug and play'], ['Sistemas', 'Windows 7, 8, 10 e 11; Linux com toque único'], ['Computador', 'Mínimo Celeron, 2 GB, HD de 250 GB; recomendado i5, 8 GB, SSD de 128 GB'],
      ['Itens inclusos', ['Moldura com cabo USB', 'Vidro temperado de 4 mm fixado', 'Kit de fixação', '2 suportes metálicos de segurança', 'Caneta', 'Manual', 'Pen drive com software e driver']], ['Garantia', '1 ano']],
  },
  {
    slug: 'moldura-interativa-tela-touch-58-pol-qualipix-pro58', name: 'Moldura Touch Qualipix 58" PRO58', cat: 'moldura', icon: 'frame',
    card: 'Moldura slim para TVs de 58", para ambientes de até 60 m².', from: '2.250,00', variations: [['58"', '2.250,00']], landing: ['/moldura-touch/', 'Conhecer a moldura'],
    kicker: 'Molduras Touch', lead: 'A Moldura PRO58, com uma TV LED ou LCD do mesmo tamanho e um computador, atende ambientes de até 60 m². Ideal para escolas, empresas, eventos, PDV, espelho mágico e totem.',
    specs: [['Estrutura', 'Alumínio, preto; design slim de 1,8 mm'], ['Touch', 'Infravermelho, 20 toques, 450 fps, detecção mínima de 5 mm'], ['Resolução', '32768 × 32768'], ['Conexão', 'USB 2.0, plug and play'],
      ['Sistemas', 'Windows 7, 8, 10 e 11; macOS e Linux com toque único'], ['Itens inclusos', ['Moldura slim com conexão PIN', 'Vidro de 4 mm já instalado', '2 canetas magnéticas de ponta fina', 'Manual de instruções', 'Acesso ao portal educacional TouchEdu', 'Kit de fixação com promotor de aderência e lixa']], ['Garantia', '1 ano']],
  },
  {
    slug: 'caneta-magnetica-ponta-fina', name: 'Ponteira Magnética para Molduras Qualipix', cat: 'acessorio', icon: 'pen',
    card: 'Caneta magnética de ponta fina para as molduras touch.', from: '100,00', variations: [['Unidade', '100,00']],
    kicker: 'Acessórios', lead: 'A caneta magnética de ponta fina permite escrever e interagir com as telas interativas: mais precisão, mais conforto, design moderno e mais praticidade para guardar o acessório.',
  },
  {
    slug: 'ponteira-para-escrita-em-tela-touch-qualipix', name: 'Ponteira convencional para lousa Qualipix', cat: 'acessorio', icon: 'pen',
    card: 'Ponteira de plástico com ponta de feltro.', from: '100,00', variations: [['Unidade', '100,00']],
    kicker: 'Acessórios', lead: 'Ponteira de escrita para telas touch Qualipix, em plástico com ponta de feltro.',
    specs: [['Material', 'Plástico'], ['Ponta', 'Feltro']],
  },
];

const CITIES = [
  ['instalacao-de-moldura-interativa-em-sao-paulo-sp', 'São Paulo-SP', 'na cidade de São Paulo', '590,00'],
  ['instalacao-de-moldura-interativa-em-belo-horizonte-mg', 'Belo Horizonte-MG', 'na cidade de Belo Horizonte', '250,00'],
  ['instalacao-de-moldura-interativa-na-cidade-do-rio-de-janeiro', 'Rio de Janeiro-RJ', 'na cidade do Rio de Janeiro', '490,00'],
];
for (const [slug, city, where, price] of CITIES) {
  CATALOG.push({
    slug, name: `Instalação de Moldura Interativa em ${city}`, cat: 'servico', icon: 'tool',
    card: `Instalação de moldura touch de 32" a 86" ${where}.`, from: price, variations: [['Serviço', price]], landing: ['/moldura-touch/', 'Conhecer a moldura'],
    kicker: 'Serviços', lead: `Serviço de instalação de Moldura Touch de 32" a 86" ${where}, com agendamento prévio.`,
    note: 'Preço da loja em 28/10/2026, sujeito a alteração. A data da instalação é combinada no atendimento.',
    local: city,
  });
}

// --------------------------------------------------------------- páginas
const page = (p) => ({
  path: `/${p.slug}/`, title: p.name, kind: 'loja',
  metaTitle: `${p.name} | Qualipix`,
  description: `${p.card} ${p.from ? `A partir de ${R(p.from)}.` : ''} Compre com a Qualipix pelo WhatsApp.`.trim(),
  crumbs: [[catPath(p.cat), CAT_NAMES[p.cat]], [`/${p.slug}/`, p.name]],
  ld: [{
    '@context': 'https://schema.org', '@type': p.cat === 'servico' ? 'Service' : 'Product', name: p.name, description: p.card,
    brand: { '@type': 'Brand', name: 'Qualipix' },
    ...(p.cat === 'servico' ? { areaServed: p.local, provider: { '@id': 'https://www.qualipix.com.br/#organizacao' } } : {}),
  }],
  blocks: [
    { type: 'buy', name: p.name, kicker: p.kicker, lead: p.lead, img: p.img, icon: p.icon, variations: p.variations || p.groups.flatMap((g) => g.items), groups: p.groups, landing: p.landing, note: p.note, varLabel: p.cat === 'servico' ? 'Serviço' : undefined },
    ...(p.apps ? [{ type: 'benefits', title: 'Principais aplicações', items: p.apps.map(([t, d]) => ({ t, d })) }] : []),
    ...(p.features ? [{ type: 'columns', title: 'Características e benefícios', cols: [{ title: 'O que ele oferece', items: p.features }, ...(p.results ? [{ title: p.resultsTitle || 'Resultados diretos', items: p.results }] : [])] }] : []),
    ...(p.specs ? [{ type: 'specs', rows: p.specs }] : []),
    help(p.name, p.cat === 'lousa' || p.cat === 'quadro' || p.cat === 'max80' ? 'Educação' : 'Corporativo'),
  ],
});

const CAT_NAMES = { lousa: 'Lousa Digital', moldura: 'Molduras Touch', max80: 'Lousa Branca Interativa', totem: 'Totens', flip: 'Flip Chart Digital', quadro: 'Quadro Híbrido', acessorio: 'Acessórios', servico: 'Serviços' };
function catPath(cat) {
  return { lousa: '/produtos/lousa-digital/', moldura: '/produtos/molduras-touch/', max80: '/produtos/lousa-branca-interativa/', totem: '/produtos/totens/', flip: '/produtos/flip-chart-digital/', quadro: '/produtos/quadro-hibrido/', acessorio: '/acessorios/', servico: '/servicos/' }[cat];
}
const card = (p) => ({ href: `/${p.slug}/`, name: p.name, desc: p.card, price: p.from ? `${p.variations?.length > 1 || p.groups ? 'A partir de ' : ''}${R(p.from)}` : '', img: p.img, icon: p.icon, cta: 'Ver preços' });
const byCat = (...cats) => CATALOG.filter((p) => cats.includes(p.cat)).map(card);

// Listagens: caminho, título, texto, produtos e, nas duplicadas, a página principal (canonical)
const LISTS = [
  ['/produtos/', 'Produtos', 'Lousas digitais, molduras touch, lousa branca interativa, quadro híbrido, totens, flip charts e acessórios Qualipix.', ['lousa', 'moldura', 'max80', 'quadro', 'totem', 'flip', 'acessorio']],
  ['/produtos/lousa-digital/', 'Lousa Digital', 'Monitores com função touchscreen nativa de 32" a 98", nas linhas SX e DX.', ['lousa']],
  ['/produtos/molduras-touch/', 'Molduras Touch', 'Transforme sua TV comum em uma TV touch de 32" a 86".', ['moldura']],
  ['/produtos/lousa-branca-interativa/', 'Lousa Branca Interativa', 'Lousa interativa para uso com projetor (data show).', ['max80']],
  ['/produtos/quadro-hibrido/', 'Quadro Híbrido', 'Quadro branco cerâmico com lousa digital integrada e plataforma com IA.', ['quadro']],
  ['/produtos/totens/', 'Totens', 'Display angulado com base de piso especial de 32" a 55".', ['totem']],
  ['/produtos/flip-chart-digital/', 'Flip Chart Digital', 'Monitor touch na vertical com suporte de piso e rodízios.', ['flip']],
  // o menu do site atual aponta para /acessorios/: ela é a principal
  ['/acessorios/', 'Acessórios', 'Soluções complementares para usar seus dispositivos Qualipix com ainda mais facilidade e eficiência.', ['acessorio']],
  ['/produtos/acessorios/', 'Acessórios', 'Soluções complementares para usar seus dispositivos Qualipix com ainda mais facilidade e eficiência.', ['acessorio'], '/acessorios/'],
  ['/totems/', 'Totens', 'Display angulado com base de piso especial de 32" a 55".', ['totem', 'flip'], '/produtos/totens/'],
  ['/lousa-branca-interativa/', 'Lousa Branca Interativa', 'Lousa interativa para uso com projetor (data show).', ['max80'], '/produtos/lousa-branca-interativa/'],
  ['/molduras-touch/', 'Molduras Touch', 'Transforme sua TV comum em uma TV touch de 32" a 86".', ['moldura'], '/produtos/molduras-touch/'],
  ['/molduras/', 'Molduras Touch', 'Transforme sua TV comum em uma TV touch de 32" a 86".', ['moldura'], '/produtos/molduras-touch/'],
  ['/monitores-linha-dx/', 'Lousa Digital', 'Lousas digitais Qualipix das linhas SX e DX, de 32" a 98".', ['lousa'], '/produtos/lousa-digital/'],
  ['/servicos/', 'Serviços', 'Instalação de molduras interativas em São Paulo, Belo Horizonte e Rio de Janeiro.', ['servico']],
];

export default [
  ...CATALOG.map(page),
  ...LISTS.map(([path, title, lead, cats, canonical]) => ({
    path, title, canonical, kind: 'lista', description: `${title} Qualipix: ${lead}`,
    crumbs: path === '/produtos/' ? [[path, title]] : [['/produtos/', 'Produtos'], [path, title]],
    blocks: [
      { type: 'hero', kicker: path.startsWith('/servicos') ? 'Serviços' : 'Produtos Qualipix', title, lead: `${lead} Compre pelo WhatsApp ou fale com um especialista.` },
      { type: 'products', title: path === '/produtos/' ? 'Toda a linha' : `${title}: modelos e preços`, items: byCat(...cats) },
      help(title, 'Educação'),
    ],
  })),
];

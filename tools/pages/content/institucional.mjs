// Páginas institucionais (/m/...), contato, ajuda, QualipixClass e páginas de apoio.
// Texto das "Páginas de conteúdo" do painel da Wbuy, revisado.
import fs from 'node:fs';
import { WA, WA_SUPORTE } from '../layout.mjs';

const priv = fs.readFileSync(new URL('./privacidade.fragment.html', import.meta.url), 'utf8');
const doc = (path, title, html, extra = {}) => ({ path, title, kind: 'doc', description: extra.description || title, crumbs: [[path, extra.crumb || title]], ...extra, blocks: [{ type: 'prose', html, title: extra.h1, updated: extra.updated, wide: extra.wide }] });
const ext = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
const cards = (items) => `<div class="doc-cards">${items.map(([h, t, d, cta = 'Abrir']) => `<a class="doc-card" href="${h}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ''}><h3>${t}</h3>${d ? `<p>${d}</p>` : ''}<span class="link">${cta}</span></a>`).join('')}</div>`;

const EMPRESA = `
  <p class="lead-text">A Qualipix® é fabricante de lousas digitais, molduras interativas, quadros híbridos, totens interativos e lousas brancas interativas de 32" a 98".</p>
  <p>Inaugurada em 2012, a empresa conta com especialistas que estão no mercado desde 1999, sempre inovando e trazendo facilidades para a sua empresa.</p>
  <p>Fundada no princípio da excelência e conectada aos recursos mais recentes do mercado, a Qualipix® oferece seus produtos em todo o território nacional, sempre agregando resultados eficazes aos clientes. Conheça os trabalhos já realizados no nosso <a href="/m/portfolio/">portfólio</a>.</p>
  <p>Toda essa experiência une tecnologia inovadora, alta performance dos equipamentos e longa vida útil dos produtos, além de preços competitivos.</p>
  <h2>Duas unidades para te receber</h2>
  <p>Uma no coração comercial do Brasil, na Alameda Santos, 1773, em São Paulo/SP, onde fica o nosso showroom; e a matriz em Belo Horizonte, na Rua das Canoas, 970, no estado mais acolhedor do mundo*. Se preferir, estamos à disposição por WhatsApp, telefone ou e-mail.</p>
  ${cards([
    ['https://www.google.com/maps/search/?api=1&query=Alameda+Santos+1773+S%C3%A3o+Paulo', 'São Paulo, showroom', 'Alameda Santos, 1773, conj. 1003, Cerqueira César. (11) 2690-4299', 'Abrir no mapa'],
    ['https://www.google.com/maps/search/?api=1&query=Rua+das+Canoas+970+Belo+Horizonte', 'Belo Horizonte, matriz', 'Rua das Canoas, 970, Betânia. (31) 3568-6835', 'Abrir no mapa'],
  ])}
  <p>E então, <a href="/fale-conosco/">vamos nos conectar?</a></p>
  <p class="updated">*Fonte: Traveller Review Awards 2021, da Booking.com.</p>`;

const TROCAS = `
  <p class="lead-text">Você comprou algum produto na Qualipix? Ficamos super felizes! Mas, se por acaso quiser trocar ou devolver, aqui a gente explica tintim por tintim como funciona.</p>
  <p>Respeitamos bastante nossos clientes e queremos que você fique feliz com a sua compra. Por isso, temos uma política de trocas e devoluções que respeita o direito do consumidor.</p>
  <h2>Como solicitar</h2>
  <ul>
    <li>As ocorrências de troca ou devolução devem ser comunicadas por e-mail para <a href="mailto:contato@qualipix.com.br">contato@qualipix.com.br</a>.</li>
    <li>Produtos devolvidos sem essa comunicação ou fora do prazo serão reenviados sem consulta prévia.</li>
    <li>O produto deve ser encaminhado na embalagem original.</li>
  </ul>
  <h2>Prazos</h2>
  <ul>
    <li><strong>Desistência da compra:</strong> até 7 dias corridos a partir do recebimento.</li>
    <li><strong>Troca:</strong> até 10 dias corridos a partir do recebimento.</li>
    <li><strong>Defeito de fabricação:</strong> até 3 dias corridos a partir do recebimento. Escreva para <a href="mailto:atendimento@qualipix.com.br">atendimento@qualipix.com.br</a> informando a nota fiscal, o produto e o defeito. Solicitações após esse prazo não são aceitas.</li>
  </ul>
  <h2>Reembolso e envio</h2>
  <ul>
    <li>Na devolução, o reembolso é do valor total do(s) produto(s) devolvido(s), em até 15 dias úteis.</li>
    <li>Na troca, cumpridas as condições, a Qualipix envia o produto escolhido em até 7 dias úteis. O frete pago pela devolução é devolvido ou revertido em crédito para uma próxima compra.</li>
    <li>Não trocamos produtos por créditos na loja: todo produto deve ser trocado por outro produto.</li>
    <li>Reservamo-nos o direito de não cancelar, trocar ou consertar produtos com indícios claros de mau uso. Nesse caso, a Qualipix pode reenviar o produto ao cliente sem consulta prévia, com a justificativa da recusa.</li>
  </ul>
  <p>Dúvidas? Fale com o nosso atendimento pelo e-mail <a href="mailto:contato@qualipix.com.br">contato@qualipix.com.br</a>.</p>`;

const FAQ_MOLDURA = [
  ['Quais os tamanhos disponíveis da moldura?', 'De 32" a 85": 32", 39", 40", 42", 43", 48", 49", 50", 55", 58", 60", 65", 70", 75", 82" e 85". Para outros tamanhos, fale com a nossa equipe pelo WhatsApp.'],
  ['É compatível com qualquer TV do mercado?', 'Recomendamos TVs LG e Samsung. Para outras marcas, confira as medidas com a nossa equipe antes da compra.'],
  ['A TV precisa ser Smart?', 'Não. A moldura funciona em qualquer modelo de TV, Smart ou não.'],
  ['É necessário um computador?', 'Sim, é necessário um computador para fazer a conexão da moldura.'],
  ['Como é feita a conexão?', 'Fixe a moldura na TV, conecte o cabo USB da moldura no computador e ligue o computador na TV pelo HDMI, normalmente.'],
  ['É possível pausar vídeos e fazer anotações?', 'Sim. Você pode pausar o vídeo que estiver passando e fazer anotações na tela sobre ele.'],
  ['Quais acessórios acompanham o produto?', '2 canetas, cabo USB, kit de fixação, QR code com instruções e suporte de segurança.'],
  ['É compatível com quais sistemas operacionais?', 'Windows 7, 8, 10 e 11. No macOS e no Linux, funciona com toque único.'],
  ['A instalação é fácil?', 'Sim. É simples e não precisa de mão de obra especializada: você e mais uma pessoa conseguem instalar. Enviamos um manual de instruções, e também oferecemos <a href="/servicos/">instalação em São Paulo, Belo Horizonte e Rio de Janeiro</a>.'],
  ['Acompanha suporte de segurança?', 'Sim. O produto acompanha dois suportes de segurança para evitar qualquer risco de dano à moldura.'],
  ['Posso conectar o USB da moldura direto na TV?', 'Não. O cabo USB precisa ser conectado ao computador ou notebook, que carrega os softwares de funcionamento.'],
  ['Qual o prazo de entrega?', 'De 1 a 8 dias úteis. Para as capitais do Sudeste e do Sul, 3 dias úteis.'],
];

const CONTATO = `
  <p class="lead-text">Escolha o departamento e envie a sua mensagem. Ela abre no WhatsApp da Qualipix já preenchida.</p>
  <form class="contact-form lead-form" novalidate data-interest="atendimento">
    <div class="field"><label for="c-dep">Departamento</label><select id="c-dep" name="departamento"><option>Vendas</option><option>Suporte técnico</option></select></div>
    <div class="field"><label for="c-nome">Nome</label><input id="c-nome" name="nome" autocomplete="name" required></div>
    <div class="field"><label for="c-tel">Telefone</label><input id="c-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" required></div>
    <div class="field"><label for="c-email">E-mail</label><input id="c-email" name="email" type="email" autocomplete="email"></div>
    <div class="field field-wide"><label for="c-assunto">Assunto</label><input id="c-assunto" name="assunto"></div>
    <div class="field field-wide"><label for="c-msg">Mensagem</label><textarea id="c-msg" name="msg" rows="4"></textarea></div>
    <p class="form-error" role="alert" hidden></p>
    <button class="btn btn-primary btn-lg" type="submit">Entrar em contato</button>
  </form>
  <h2>Atendimento</h2>
  <ul>
    <li><a href="tel:+551126904299">(11) 2690-4299</a>, atendimento telefônico (São Paulo)</li>
    <li><a href="https://wa.me/${WA}" target="_blank" rel="noopener">(11) 97175-6835</a>, WhatsApp (vendas)</li>
    <li><a href="tel:+553135686835">(31) 3568-6835</a>, atendimento telefônico (Belo Horizonte)</li>
    <li><a href="https://wa.me/${WA_SUPORTE}" target="_blank" rel="noopener">(31) 99157-7018</a>, suporte técnico por WhatsApp</li>
    <li><a href="mailto:contato@qualipix.com.br">contato@qualipix.com.br</a></li>
    <li>CNPJ 16.915.236/0001-98</li>
  </ul>
  <h2>Showroom em São Paulo</h2>
  <p>Alameda Santos, 1773, conj. 1003, Cerqueira César, São Paulo/SP, CEP 01419-100.</p>
  <div class="doc-map" data-map="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14628.749495667427!2d-46.6584695!3d-23.561713!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa883b6a4e9dfba!2sQualipix!5e0!3m2!1spt-BR!2sbr!4v1642107798970!5m2!1spt-BR!2sbr">
    <button type="button" class="btn btn-primary map-load">Mostrar o mapa (Google Maps)</button>
  </div>`;

const SOLUCAO = `
  <p class="lead-text">Diferenças entre Lousa Digital, Moldura Interativa, Lousa Branca Interativa, Totem Interativo, Flip Chart Digital e Video Wall. Um guia objetivo para quem precisa decidir com rapidez e base técnica.</p>
  <h2>Resumo em 30 segundos</h2>
  <ul>
    <li><a href="/lousa-digital/"><strong>Lousa Digital</strong></a>: tudo em um (tela, touch, som e apps). Salva, compartilha e roda arquivos. É a solução mais completa (a linha SX exige computador).</li>
    <li><a href="/moldura-touch"><strong>Moldura Interativa</strong></a>: transforma a sua TV em touch. Ideal para aproveitar TVs que você já tem. Exige computador.</li>
    <li><a href="/lousamax80"><strong>Lousa Branca Interativa</strong></a>: quadro branco de alumínio especial para projeção. Exige projetor e computador.</li>
    <li><a href="/totem-interativo"><strong>Totem Interativo</strong></a>: ponto de autosserviço e mídia em pé. Vendas, cadastro, fila e check-in.</li>
    <li><a href="/flip-chart"><strong>Flip Chart Digital</strong></a>: display vertical e portátil, para reuniões rápidas e palestras.</li>
    <li><a href="/video-wall/"><strong>Video Wall</strong></a>: painel grande com várias telas. Impacto visual e monitoramento 24/7.</li>
  </ul>
  <h2>Tabela comparativa</h2>
  <div class="table-scroll"><table>
    <thead><tr><th>Recurso</th><th>Lousa Digital</th><th>Moldura Interativa</th><th>Lousa Branca Interativa</th><th>Totem Interativo</th><th>Flip Chart Digital</th><th>Video Wall</th></tr></thead>
    <tbody>
      <tr><td>Interatividade (multitoque)</td><td>Alta (10 a 40 toques)</td><td>Alta (depende da TV)</td><td>Média (calibração)</td><td>Alta</td><td>Média</td><td>Baixa (opcional com sensor)</td></tr>
      <tr><td>Precisão de escrita</td><td>Excelente</td><td>Boa</td><td>Média</td><td>Boa</td><td>Boa</td><td>—</td></tr>
      <tr><td>Instalação</td><td>Simples (plug and play)</td><td>Simples (encaixa na TV)</td><td>Complexa (projetor e alinhamento)</td><td>Simples</td><td>Muito simples</td><td>Média (estrutura e controladora)</td></tr>
      <tr><td>Recursos nativos (apps, salvar, QR)</td><td>Completo</td><td>Depende do sistema da TV ou PC</td><td>Limitado</td><td>Mídia e formulários</td><td>Anotações básicas</td><td>Mídia e projeção</td></tr>
      <tr><td>Luminosidade do ambiente</td><td>Ótima</td><td>Boa (depende da TV)</td><td>Fraca com luz forte</td><td>Ótima</td><td>Boa</td><td>Ótima</td></tr>
      <tr><td>Cenários ideais</td><td>Salas de aula e reuniões</td><td>Salas com TV existente</td><td>Orçamento baixo com projetor</td><td>Recepção, PDV, autosserviço</td><td>Reuniões rápidas, portabilidade</td><td>Comando, vitrines, auditórios</td></tr>
      <tr><td>Custo total</td><td>Médio</td><td>Baixo a médio</td><td>Baixo no início, alto na manutenção</td><td>Médio</td><td>Baixo a médio</td><td>Alto</td></tr>
    </tbody>
  </table></div>
  <h2>Quando escolher cada um</h2>
  <h3>Lousa Digital (display interativo)</h3>
  <ul><li><strong>Use se</strong> precisa escrever, salvar, compartilhar por QR code e integrar vídeos e arquivos em segundos.</li><li><strong>Ganha</strong> produtividade, padrão nas aulas e reuniões e menos cabos.</li><li><strong>Evite</strong> se já tem uma TV muito boa e só quer toque básico: considere a Moldura Interativa.</li></ul>
  <h3>Moldura Interativa</h3>
  <ul><li><strong>Use se</strong> quer reaproveitar TVs e monitores e adicionar toque com baixo investimento.</li><li><strong>Ganha</strong> custo menor e atualização rápida.</li><li><strong>Atenção:</strong> a qualidade de escrita e o brilho dependem da TV.</li></ul>
  <h3>Lousa Branca Interativa (projeção)</h3>
  <ul><li><strong>Use se</strong> já tem projetor e precisa de uma solução intermediária.</li><li><strong>Ganha</strong> investimento inicial menor.</li><li><strong>Perde</strong> com calibragem recorrente, sombra e baixo contraste em ambientes claros.</li></ul>
  <h3>Totem Interativo</h3>
  <ul><li><strong>Use se</strong> precisa de autosserviço, cadastro, cardápio, filas, check-in ou campanhas.</li><li><strong>Ganha</strong> captação de leads e mídia no ponto de contato.</li></ul>
  <h3>Flip Chart Digital</h3>
  <ul><li><strong>Use se</strong> quer reuniões rápidas, mobilidade e anotações simples.</li><li><strong>Ganha</strong> praticidade: leva, liga e usa.</li></ul>
  <h3>Video Wall</h3>
  <ul><li><strong>Use se</strong> precisa de grande impacto visual, monitoramento (NOC), vitrines e salas de comando.</li><li><strong>Ganha</strong> escala e visibilidade.</li></ul>
  <h2>Casos de uso por segmento</h2>
  <ul>
    <li><a href="/educacao">Educação</a>: lousa digital nas salas, totem na secretaria e video wall em eventos.</li>
    <li><a href="/corporativo">Corporativo</a>: lousa digital nas salas, flip chart para squads e video wall para war room.</li>
    <li>Varejo e <a href="/saude">saúde</a>: totem para autosserviço e moldura nas TVs existentes para catálogos.</li>
    <li>Indústria e logística: lousa digital no chão de fábrica e video wall no centro de controle.</li>
  </ul>
  <h2>Perguntas rápidas</h2>
  <ul>
    <li>Preciso salvar e compartilhar a reunião? Vá de Lousa Digital.</li>
    <li>Já tenho TVs boas nas salas? A Moldura Interativa pode bastar.</li>
    <li>Quero autosserviço na recepção? Totem Interativo.</li>
    <li>Preciso de um painel grande de status? Video Wall.</li>
  </ul>
  <h2>Próximo passo</h2>
  <p>Queremos te ajudar a decidir em 10 minutos. Fale com o nosso time e peça uma demonstração.</p>
  <p><a class="btn btn-primary" href="https://wa.me/${WA}?text=${encodeURIComponent('Olá! Quero um orçamento e ajuda para escolher a solução ideal.')}" target="_blank" rel="noopener" data-product="Qual solução escolher">Solicitar orçamento</a> <a class="btn btn-ghost" href="https://wa.me/${WA}?text=${encodeURIComponent('Olá! Quero agendar uma demonstração.')}" target="_blank" rel="noopener">Agendar demonstração</a></p>
  <p>Prefere um guia interativo? Use o <a href="/#escolher">assistente de escolha da página inicial</a>.</p>`;

const SX = `
  <p class="lead-text">Este guia ajuda você a aproveitar ao máximo o seu Display Interativo Qualipix SX, da instalação aos recursos de uso.</p>
  <h2>Etapas de instalação</h2>
  <ol>
    <li><strong>Estrutura ideal:</strong> parede firme (alvenaria), ambiente seco e plano.</li>
    <li><strong>Altura recomendada:</strong> centro da tela a 1,40 m do chão.</li>
    <li><strong>Fixação:</strong> use o suporte VESA padrão (incluso), com furos e bucha nº 10.</li>
    <li><strong>Segurança:</strong> instale sempre com 2 pessoas e use nivelador para o ajuste.</li>
    <li><strong>Energia:</strong> conecte à tomada (110/220 V) e ligue o interruptor. O LED vermelho de energia deve acender.</li>
    <li><strong>Computador externo:</strong> conecte o cabo HDMI (áudio e vídeo) e o cabo USB (função touch).</li>
    <li><strong>Computador OPS:</strong> encaixe o módulo OPS no compartimento traseiro.</li>
    <li><strong>Software de escrita:</strong> online em ${ext('https://www.webwhiteboard.com', 'webwhiteboard.com')} (escrita e compartilhamento) ou ${ext('https://drive.google.com/file/d/1KhAGzNWqc3nJRHTTx-L60ZFRsYVJgRe_/view?usp=sharing', 'baixe a versão para usar offline')}.</li>
  </ol>
  <h2>Rede</h2>
  <p>O Wi-Fi ou a internet a cabo devem ser conectados no computador, não no monitor.</p>
  <h2>Em sala de aula</h2>
  <ul><li>Use como lousa digital interativa para aulas dinâmicas e visuais.</li><li>Grave aulas com áudio e exporte as anotações.</li><li>Exiba vídeos educativos, simulações, mapas e apresentações.</li></ul>
  <h2>Em empresas</h2>
  <ul><li>Reuniões, treinamentos e apresentações de alto impacto.</li><li>Compatível com Zoom, Meet, Teams e softwares de produtividade.</li><li>Anotações em tempo real em documentos e PDFs.</li><li>Substitui projetor, quadro branco e TV em um só equipamento.</li></ul>
  <h2>Cuidados e suporte</h2>
  <ul><li><strong>Limpeza:</strong> pano limpo umedecido com álcool líquido 70%. Nunca use produtos químicos.</li><li><strong>Garantia:</strong> com suporte técnico nacional. Consulte o prazo no seu certificado.</li><li><strong>Dúvidas:</strong> ${ext(`https://wa.me/${WA_SUPORTE}`, 'fale com o suporte técnico pelo WhatsApp')}.</li></ul>`;

const TUTORIAIS = [
  ['https://qualipix-touch-guide.lovable.app/', 'Fixação das molduras', 'Passo a passo para instalar a Moldura Touch na TV.'],
  ['https://tutoriallousaqualipix.lovable.app', 'Lousa Digital linha DX', 'Utilização da lousa de 65", 75", 86" e 98".'],
  ['/m/instrucoes-sx-series/', 'Lousa Digital linha SX', 'Utilização do monitor touch de 32", 43" e 55".'],
  ['https://www.youtube.com/watch?v=9Ht-Q04xOmg', 'Lousa Max80i com DrawView', 'Vídeo de utilização da lousa branca interativa.', 'Assistir'],
  ['https://www.youtube.com/watch?v=fCS7rL9DRG0', 'Software de escrita NOTE', 'Para as lousas digitais da linha DX.', 'Assistir'],
  ['https://www.youtube.com/watch?v=donziCslEXQ', 'Software de escrita X Board', 'Para as molduras touch e as lousas da linha SX.', 'Assistir'],
  ['https://guia-totemqualipix.lovable.app/', 'Totem Interativo', 'Guia de utilização do totem Qualipix.'],
  ['https://flipqualipix.lovable.app', 'Flip Chart Digital', 'Guia de utilização do flip chart Qualipix.'],
];
const DOWNLOADS = [
  ['https://drive.google.com/file/d/1seJeSTm3PKGMhj2SFXUCgi7bblpkpqrd/view?usp=sharing', 'Calibrador para Windows', 'Moldura Qualipix linha NX.', 'Baixar'],
  ['https://drive.google.com/file/d/1_uSQuL55utq4gddnFFj9N10VWPQzt2f9/view?usp=sharing', 'Driver da Lousa Max80i', 'DrawView e calibrador da Lousa Branca Interativa.', 'Baixar'],
  ['https://drive.google.com/file/d/1KhAGzNWqc3nJRHTTx-L60ZFRsYVJgRe_/view', 'Software de quadro branco', 'Anotações sobrepostas no Windows.', 'Baixar'],
];

const redirect = (path, to, title) => ({ path, title, redirect: to });

export default [
  doc('/m/empresa/', 'Empresa', EMPRESA, { description: 'A Qualipix® fabrica lousas digitais, molduras interativas, quadros híbridos, totens e lousas brancas interativas de 32" a 98" desde 2012.', h1: 'Empresa' }),
  { ...doc('/sobre/', 'Empresa', EMPRESA, { description: 'Sobre a Qualipix, fabricante brasileira de lousas digitais desde 2012.', h1: 'Empresa' }), canonical: '/m/empresa/' },
  doc('/fale-conosco/', 'Fale conosco', CONTATO, { description: 'Fale com a Qualipix: vendas pelo WhatsApp (11) 97175-6835, telefone (11) 2690-4299 e suporte técnico (31) 99157-7018.', wide: true }),
  doc('/faq/', 'Dúvidas frequentes', `<div class="faq doc-faq"><div class="faq-list">${FAQ_MOLDURA.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div><p>Tem dúvidas sobre a lousa digital, o quadro híbrido ou o totem? Veja as perguntas frequentes em cada <a href="/produtos/">página de produto</a> ou <a href="/fale-conosco/">fale com a gente</a>.</p>`, {
    description: 'Dúvidas frequentes sobre a Moldura Touch Qualipix: tamanhos, compatibilidade com TVs, conexão, instalação e prazo de entrega.',
    ld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_MOLDURA.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) }],
  }),
  doc('/m/trocas-e-devolucoes/', 'Trocas e devoluções', TROCAS, { description: 'Política de trocas e devoluções da Qualipix: prazos de 7 dias para desistência, 10 dias para troca e 3 dias para defeito de fabricação.' }),
  doc('/m/satisfacao-garantida/', 'Satisfação garantida', `
    <p class="lead-text">Você comprou a Moldura Touch Qualipix? Ficamos super felizes! Enviamos todas as instruções para um funcionamento perfeito. Se mesmo assim não ficar satisfeito, devolvemos o valor pago.</p>
    <ul>
      <li>As ocorrências de devolução devem ser comunicadas por e-mail para <a href="mailto:atendimento@qualipix.com.br">atendimento@qualipix.com.br</a>.</li>
      <li>O prazo para desistir da compra e pedir a devolução é de até 7 dias corridos a partir do recebimento. Pedidos após esse prazo não são aceitos.</li>
      <li>O produto deve ser encaminhado na embalagem original.</li>
      <li>Produtos com indícios claros de mau uso podem ser reenviados ao cliente, com a justificativa da recusa.</li>
      <li>O reembolso é do valor total do(s) produto(s) devolvido(s), em até 15 dias úteis.</li>
    </ul>
    <p>Veja também a política completa de <a href="/m/trocas-e-devolucoes/">trocas e devoluções</a>.</p>`, { description: 'Satisfação garantida na Moldura Touch Qualipix: devolução em até 7 dias com reembolso integral.' }),
  doc('/m/frete/', 'Frete', `
    <p class="lead-text">Enviamos para todo o Brasil pela transportadora conveniada JAMEF Transportes.</p>
    <p>O valor do frete é calculado pelo seu CEP no atendimento, junto com o pedido. O prazo de entrega varia de 1 a 8 dias úteis; para as capitais do Sudeste e do Sul, 3 dias úteis.</p>
    <p>O Quadro Híbrido é entregue nas regiões Sul e Sudeste.</p>
    <p><a class="btn btn-primary" href="https://wa.me/${WA}?text=${encodeURIComponent('Olá! Quero calcular o frete. Meu CEP é: ')}" target="_blank" rel="noopener">Calcular o frete pelo WhatsApp</a></p>`, { description: 'Frete da Qualipix para todo o Brasil pela JAMEF Transportes, calculado pelo CEP.' }),
  doc('/catalogos/', 'Catálogos', `<p class="lead-text">Baixe nossos catálogos e conheça a linha completa.</p>${cards([
    ['https://heyzine.com/flip-book/df2b60bda2.html', 'Catálogo de Produtos', 'Versão digital para folhear no navegador.', 'Folhear'],
    ['https://assets.sistemawbuy.com.br/arquivos/90e95093a4a44a8b956e5b81b4902101/catalogos/cata-logo-de-produtos-qualipix-2023-2024-1-111.pdf', 'Catálogo Qualipix 2023/2024', 'PDF para baixar.', 'Baixar'],
    ['https://heyzine.com/flip-book/12e579bc5e.html', 'Portfólio', 'Projetos e instalações realizados pela Qualipix.', 'Folhear'],
  ])}`, { description: 'Baixe os catálogos da Qualipix e conheça a linha completa de lousas digitais e displays interativos.' }),
  doc('/m/catalogo-de-produtos/', 'Catálogo de Produtos', `<p class="lead-text">Folheie o catálogo digital com toda a linha Qualipix.</p><p><a class="btn btn-primary" href="https://heyzine.com/flip-book/df2b60bda2.html" target="_blank" rel="noopener">Abrir o catálogo</a></p><p>Também disponível em PDF na página de <a href="/catalogos/">catálogos</a>.</p>`, { description: 'Catálogo de produtos Qualipix em versão digital.' }),
  doc('/m/portfolio/', 'Portfólio', `<p class="lead-text">Projetos e instalações realizados pela Qualipix, de estúdios de TV a salas de aula.</p><p><a class="btn btn-primary" href="https://heyzine.com/flip-book/12e579bc5e.html" target="_blank" rel="noopener">Abrir o portfólio</a></p><p>Veja também os <a href="/m/projetos-recentes/">projetos recentes</a>.</p>`, { description: 'Portfólio de projetos e instalações da Qualipix.' }),
  doc('/m/projetos-recentes/', 'Projetos recentes', `<p class="lead-text">Do estúdio de TV à sala de aula: alguns lugares onde #temQualipix.</p>
    <div class="doc-gallery">${[['globonews', 'Estúdio GloboNews'], ['mgtv', 'Estúdio MGTV'], ['defesa-civil-mg', 'Defesa Civil de Minas Gerais'], ['unoeste', 'Unoeste'], ['feira-odontologia', 'Feira de odontologia'], ['quadro-hibrido', 'Quadro Híbrido em sala de aula']].map(([f, t]) => `<figure><img src="/assets/img/instalacoes/${f}.png" alt="${t}" loading="lazy"><figcaption>${t}</figcaption></figure>`).join('')}</div>
    <p>Clientes como Cruzeiro, TIM, Delaport e Unimed também usam soluções Qualipix. Veja mais no <a href="/m/portfolio/">portfólio</a>.</p>`, { description: 'Projetos recentes da Qualipix em estúdios de TV, órgãos públicos, universidades e eventos.', wide: true }),
  doc('/m/qual-solucao-escolher/', 'Qual solução escolher', SOLUCAO, { description: 'Diferenças entre lousa digital, moldura interativa, lousa branca interativa, totem, flip chart digital e video wall: tabela comparativa e quando escolher cada um.', h1: 'Qual solução escolher?', wide: true }),
  doc('/m/instrucoes-sx-series/', 'Instruções SX Series', SX, { description: 'Guia de instalação e utilização do Display Interativo Qualipix SX.', h1: 'Guia completo: instalação e utilização do Display Interativo Qualipix SX' }),
  doc('/m/instrucoes-dx-series/', 'Instruções DX Series', `<p class="lead-text">Assista ao tutorial interativo de instalação e utilização da Lousa Digital Qualipix linha DX (65", 75", 86" e 98").</p><p><a class="btn btn-primary" href="https://tutoriallousaqualipix.lovable.app/" target="_blank" rel="noopener">Assistir ao vídeo</a></p><p>Precisa de ajuda? ${ext(`https://wa.me/${WA_SUPORTE}`, 'Fale com o suporte técnico pelo WhatsApp')}.</p>`, { description: 'Tutorial de instalação e utilização da Lousa Digital Qualipix linha DX.' }),
  doc('/m/tutoriais/', 'Tutoriais', `<p class="lead-text">Guias e vídeos para instalar e usar cada equipamento Qualipix.</p>${cards(TUTORIAIS)}`, { description: 'Tutoriais Qualipix: fixação das molduras, lousas digitais DX e SX, Max80i, softwares de escrita, totem e flip chart.', wide: true }),
  doc('/m/download/', 'Download', `<p class="lead-text">Drivers, calibradores e softwares dos equipamentos Qualipix.</p>${cards(DOWNLOADS)}`, { description: 'Downloads Qualipix: calibrador da moldura NX, driver da Max80i e software de quadro branco.' }),
  doc('/m/instalacao-moldura-touch/', 'Instalação Moldura Touch', `<p class="lead-text">Siga o guia de instalação da Moldura Touch Qualipix.</p><p><a class="btn btn-primary" href="/instalacao-moldura-touch/">Abrir o guia de instalação</a></p>`, { description: 'Guia de instalação da Moldura Touch Qualipix.' }),
  doc('/instalacao-moldura-touch/', 'Instalação da Moldura Touch', `
    <p class="lead-text">A instalação é simples e pode ser feita por você e mais uma pessoa. Veja o passo a passo e, se preferir, contrate a instalação.</p>
    ${cards([
      ['https://qualipix-touch-guide.lovable.app/', 'Guia de fixação das molduras', 'Passo a passo interativo da instalação na TV.', 'Abrir o guia'],
      ['https://drive.google.com/file/d/1seJeSTm3PKGMhj2SFXUCgi7bblpkpqrd/view?usp=sharing', 'Calibrador para Windows', 'Para a moldura Qualipix linha NX.', 'Baixar'],
      ['/servicos/', 'Instalação pela Qualipix', 'Em São Paulo, Belo Horizonte e Rio de Janeiro, com agendamento.', 'Ver serviços'],
    ])}
    <h2>Antes de começar</h2>
    <ul><li>Confira se a moldura tem o mesmo tamanho da TV.</li><li>Tenha o computador por perto: o cabo USB da moldura vai no computador, e o computador vai na TV pelo HDMI.</li><li>Use os dois suportes de segurança que vêm na caixa.</li></ul>
    <p>Dúvidas? ${ext(`https://wa.me/${WA_SUPORTE}`, 'Fale com o suporte técnico pelo WhatsApp')}.</p>`, { description: 'Como instalar a Moldura Touch Qualipix: guia, calibrador e serviço de instalação.' }),
  doc('/m/lousas/', 'Lousas', `
    <p class="lead-text">Lousa interativa touch screen com 10 toques simultâneos e software completo. Quem conhece, recomenda!</p>
    <p>A lousa educacional interativa funciona como uma tela de computador sensível ao toque. Qualquer movimento do professor na superfície gera interação com o conteúdo projetado. Para operar, a lousa é conectada a um computador, que por sua vez é conectado a um projetor multimídia.</p>
    <p>O objetivo é facilitar e tornar as aulas mais produtivas, reunindo em um único recurso as melhores tecnologias para transmitir conhecimento a todas as idades: acessar páginas na internet, escrever, desenhar e gravar tudo o que foi trabalhado em aula, mantendo os alunos atentos e envolvidos.</p>
    <h2>Vantagens</h2>
    <ul><li>Aulas mais dinâmicas e produtivas</li><li>Acesso às melhores tecnologias disponíveis</li><li>Conteúdos trabalhados de forma interativa</li><li>Aulas gravadas podem ser distribuídas aos alunos</li><li>Mais interesse e participação dos alunos</li></ul>
    <p><a class="btn btn-primary" href="/lousamax80">Conhecer a Lousa Branca Interativa Max80i</a></p>`, { description: 'Lousa interativa touch screen para projetor, com 10 toques simultâneos e software completo.' }),
  doc('/m/compra-whatsapp/', 'Compra pelo WhatsApp', `
    <p class="lead-text">Pagamento recebido! Obrigado por comprar com a Qualipix.</p>
    <p>Para concluir o pedido, envie os dados abaixo pelo e-mail <a href="mailto:financeiro@qualipix.com.br">financeiro@qualipix.com.br</a> ou pelo WhatsApp de vendas:</p>
    <ul><li>Nome completo</li><li>CPF ou CNPJ</li><li>Endereço, número, bairro e complemento</li><li>Cidade, estado e CEP</li><li>DDD e telefone</li><li>E-mail</li></ul>
    <p><a class="btn btn-primary" href="https://wa.me/${WA}?text=${encodeURIComponent('Olá! Fiz o pagamento e vou enviar os dados para concluir o pedido.')}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a></p>`, { description: 'Conclua a sua compra pelo WhatsApp da Qualipix.', noindex: true }),
  doc('/m/politica-de-privacidade/', 'Política de privacidade', priv, { description: 'Como a Qualipix trata dados pessoais e cookies no site, conforme a LGPD.', updated: 'Atualizada em 28 de outubro de 2026' }),
  { ...doc('/politica-privacidade/', 'Política de privacidade', priv, { description: 'Como a Qualipix trata dados pessoais e cookies no site, conforme a LGPD.', updated: 'Atualizada em 28 de outubro de 2026' }), canonical: '/m/politica-de-privacidade/' },
  doc('/termos/', 'Termos de uso', `
    <p class="lead-text">Estes termos valem para o uso deste site e para as compras feitas com a Qualipix Tecnologia em Equipamentos Audiovisuais Ltda., CNPJ 16.915.236/0001-98.</p>
    <h2>Preços e pedidos</h2>
    <p>Os preços exibidos no site são informativos e podem mudar sem aviso. O valor final, o prazo e a forma de pagamento são confirmados pela equipe de vendas no atendimento, antes do pagamento.</p>
    <h2>Entrega</h2>
    <p>Entregamos em todo o Brasil pela JAMEF Transportes, com frete calculado pelo CEP. Veja os detalhes na página de <a href="/m/frete/">frete</a>.</p>
    <h2>Garantia, trocas e devoluções</h2>
    <p>A garantia de cada equipamento está na página do produto. As regras de troca e devolução estão em <a href="/m/trocas-e-devolucoes/">trocas e devoluções</a>.</p>
    <h2>Privacidade</h2>
    <p>O tratamento de dados pessoais segue a nossa <a href="/m/politica-de-privacidade/">política de privacidade</a>.</p>
    <h2>Contato</h2>
    <p>Dúvidas sobre estes termos: <a href="mailto:contato@qualipix.com.br">contato@qualipix.com.br</a>.</p>`, { description: 'Termos de uso do site e condições de compra da Qualipix.', updated: 'Rascunho de 28 de outubro de 2026, para revisão jurídica' }),
  doc('/avaliacoes/', 'Avaliações', `
    <p class="lead-text">A opinião de quem usa a Qualipix todos os dias, em escolas, empresas, estúdios de TV e órgãos públicos.</p>
    <div class="doc-logos">${['globo', 'cbf', 'fiat', 'gm', 'electrolux', 'panasonic', 'dhl', 'cruzeiro', 'ccaa', 'cna'].map((c) => `<img src="/assets/img/clientes/${c}.jpg" alt="${c.toUpperCase()}" loading="lazy">`).join('')}</div>
    <p>Somos avaliados no Reclame Aqui: ${ext('https://www.reclameaqui.com.br/empresa/qualipix-tecnologia-em-equipamentos-audiovisuais/', 'veja a reputação da Qualipix')}.</p>
    <p>Comprou com a gente? Conte como foi pelo <a href="https://wa.me/${WA}?text=${encodeURIComponent('Olá! Quero deixar a minha avaliação sobre a Qualipix.')}" target="_blank" rel="noopener">WhatsApp</a> ou pelo e-mail <a href="mailto:contato@qualipix.com.br">contato@qualipix.com.br</a>.</p>`, { description: 'Avaliações de clientes da Qualipix e reputação no Reclame Aqui.' }),

  // endereços que já não existem no site atual: seguem para a página equivalente
  redirect('/display-interativo/', '/lousa-digital/', 'Lousa digital'),
  redirect('/m/a-empresa/', '/m/empresa/', 'Empresa'),
  redirect('/m/multimidia/', '/produtos/', 'Produtos'),
  redirect('/sala-de-aula-qualipix-n-1/', '/educacao/', 'Educação'),
  redirect('/m/qualipixclass/', '/class/', 'QualipixClass'),
  redirect('/privacidade.html', '/m/politica-de-privacidade/', 'Política de privacidade'),
];

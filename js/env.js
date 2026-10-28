// Ambiente do site. Carregado antes de tudo, sem defer.
// Só os domínios oficiais são indexados pelo Google e carregam as tags de medição;
// qualquer outro endereço (teste, homologação, localhost) recebe noindex e fica sem tags.
// Ao escolher o caminho da migração, ajuste productionHosts (ex.: 'lp.qualipix.com.br').
(function () {
  var cfg = (window.QPX_CONFIG = {
    productionHosts: ['www.qualipix.com.br', 'qualipix.com.br'],
    gtmId: 'GTM-WZBGG23',
    consentKey: 'qpx-consent-v1',
  });
  var host = location.hostname;
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(host) || /\.(localhost|test)$/.test(host);
  cfg.env = cfg.productionHosts.indexOf(host) >= 0 ? 'production' : local ? 'local' : 'staging';
  cfg.isProduction = cfg.env === 'production';
  document.documentElement.setAttribute('data-env', cfg.env);
  if (!cfg.isProduction) {
    var m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex, nofollow';
    document.head.appendChild(m);
  }
})();

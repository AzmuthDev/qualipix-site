// Aviso de cookies (LGPD) + Google Tag Manager.
// Regras:
// - o GTM só carrega no domínio oficial (ver js/env.js) e depois do aceite;
// - o Consent Mode do Google começa tudo negado e só libera o que a pessoa escolheu;
// - os eventos de clique (WhatsApp, telefone, e-mail, formulário) entram no dataLayer sempre,
//   mas só saem do navegador se o GTM estiver carregado.
const cfg = window.QPX_CONFIG || { isProduction: false, gtmId: '', consentKey: 'qpx-consent-v1' };

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
});

function readChoice() {
  try { return JSON.parse(localStorage.getItem(cfg.consentKey) || 'null'); } catch { return null; }
}
function saveChoice(choice) {
  try { localStorage.setItem(cfg.consentKey, JSON.stringify(choice)); } catch { /* modo privado: vale só nesta visita */ }
}

let gtmLoaded = false;
function loadGTM() {
  if (gtmLoaded || !cfg.isProduction || !cfg.gtmId) return;
  gtmLoaded = true;
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtmId)}`;
  document.head.appendChild(s);
}

function apply(choice) {
  gtag('consent', 'update', {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: choice.ads ? 'granted' : 'denied',
    ad_user_data: choice.ads ? 'granted' : 'denied',
    ad_personalization: choice.ads ? 'granted' : 'denied',
  });
  if (choice.analytics || choice.ads) loadGTM();
}

// ------------------------------------------------------------------ aviso
const banner = document.createElement('section');
banner.className = 'cookie-banner';
banner.setAttribute('aria-label', 'Aviso de cookies');
banner.hidden = true;
banner.innerHTML = `
  <div class="cookie-inner">
    <p class="cookie-text">Usamos cookies para medir visitas e melhorar nossas campanhas. O site funciona do mesmo jeito se você recusar. <a href="privacidade.html">Política de privacidade</a></p>
    <form class="cookie-prefs" hidden>
      <label><input type="checkbox" name="analytics"> Medição de visitas <span>Google Analytics e Microsoft Clarity</span></label>
      <label><input type="checkbox" name="ads"> Anúncios <span>Google Ads, Meta e LinkedIn</span></label>
    </form>
    <div class="cookie-actions">
      <button type="button" class="btn btn-ghost btn-sm" data-cookie="choose">Escolher</button>
      <button type="button" class="btn btn-ghost btn-sm" data-cookie="reject">Recusar</button>
      <button type="button" class="btn btn-primary btn-sm" data-cookie="accept">Aceitar</button>
    </div>
  </div>`;
document.body.appendChild(banner);
const prefs = banner.querySelector('.cookie-prefs');
const chooseBtn = banner.querySelector('[data-cookie="choose"]');

function decide(choice) {
  const full = { v: 1, at: new Date().toISOString(), analytics: !!choice.analytics, ads: !!choice.ads };
  saveChoice(full);
  apply(full);
  banner.hidden = true;
  window.dataLayer.push({ event: 'consent_choice', consent_analytics: full.analytics, consent_ads: full.ads });
}

function openBanner() {
  const c = readChoice();
  prefs.elements.analytics.checked = !!c?.analytics;
  prefs.elements.ads.checked = !!c?.ads;
  banner.hidden = false;
  banner.querySelector('[data-cookie="accept"]').focus({ preventScroll: true });
}

banner.addEventListener('click', (e) => {
  const action = e.target.closest('[data-cookie]')?.dataset.cookie;
  if (action === 'accept') {
    if (!prefs.hidden) decide({ analytics: prefs.elements.analytics.checked, ads: prefs.elements.ads.checked });
    else decide({ analytics: true, ads: true });
  } else if (action === 'reject') {
    decide({ analytics: false, ads: false });
  } else if (action === 'choose') {
    prefs.hidden = !prefs.hidden;
    chooseBtn.textContent = prefs.hidden ? 'Escolher' : 'Voltar';
    banner.querySelector('[data-cookie="accept"]').textContent = prefs.hidden ? 'Aceitar' : 'Salvar escolha';
  }
});

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-cookie-prefs]')) { e.preventDefault(); openBanner(); }
});

const stored = readChoice();
if (stored) apply(stored); else banner.hidden = false;

// --------------------------------------------------- eventos de conversão
function sectionOf(el) { return el.closest('section[id], header, footer')?.id || el.closest('footer, header')?.tagName.toLowerCase() || 'pagina'; }

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  let event = null;
  if (/wa\.me|whatsapp\.com/.test(href)) event = 'whatsapp_click';
  else if (href.startsWith('tel:')) event = 'phone_click';
  else if (href.startsWith('mailto:')) event = 'email_click';
  else if (a.dataset.product) event = 'quote_request';
  if (event) window.dataLayer.push({ event, link_location: sectionOf(a), link_text: a.textContent.trim().slice(0, 80), product: a.dataset.product || undefined });
}, true);

// o formulário de contato avisa quando um lead é enviado (js/main.js)
window.addEventListener('qpx:lead', (e) => {
  window.dataLayer.push({ event: 'generate_lead', lead_source: e.detail?.source || 'form', lead_area: e.detail?.area });
});

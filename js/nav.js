// Cabeçalho comum: menus Produtos e Segmentos, menu do celular.
const header = document.querySelector('.site-header');

// ---------------------------------------------------- menus suspensos (desktop)
const items = [...document.querySelectorAll('.nav-item')];
let closeTimer = 0;
function setOpen(item, open) {
  const btn = item.querySelector('.nav-btn');
  btn.setAttribute('aria-expanded', String(open));
  item.classList.toggle('is-open', open);
  header?.classList.toggle('has-menu', items.some((i) => i.classList.contains('is-open')));
}
const closeAll = (except) => items.forEach((i) => i !== except && setOpen(i, false));

for (const item of items) {
  const btn = item.querySelector('.nav-btn');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    closeAll(item);
    setOpen(item, open);
  });
  // abre ao passar o mouse; o atraso evita fechar ao atravessar o vão até o painel
  item.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer);
    closeAll(item);
    setOpen(item, true);
  });
  item.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    closeTimer = setTimeout(() => setOpen(item, false), 160);
  });
  item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) setOpen(item, false); });
}
document.addEventListener('click', (e) => { if (!e.target.closest('.nav-item')) closeAll(); });

// ------------------------------------------------------------- menu do celular
const toggle = document.querySelector('.menu-toggle');
const mnav = document.getElementById('mobile-nav');
export function closeMenu() {
  if (!toggle) return;
  toggle.setAttribute('aria-expanded', 'false');
  mnav.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  mnav.classList.toggle('is-open', open);
});
mnav?.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeMenu();
  const open = items.find((i) => i.classList.contains('is-open'));
  if (open) { setOpen(open, false); open.querySelector('.nav-btn').focus(); }
});

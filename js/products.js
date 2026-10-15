// Modelos 3D procedurais da linha Qualipix (unidades em metros).
// Usados no site em tempo real e no renderizador offline dos vídeos.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { makeCanvas, canvasTexture, drawWordmark, drawQ, UI } from './screen-ui.js';

export const INCH = 0.0254;
export const SIZES = [32, 43, 55, 65, 75, 86, 98];

export function screenDims(diag) {
  return { w: diag * INCH * 0.8716, h: diag * INCH * 0.4903 };
}

// Interpola as bordas a partir das medidas oficiais de 32" e 98"
export function lousaDims(diag) {
  const { w, h } = screenDims(diag);
  const t = (diag - 32) / (98 - 32);
  return {
    aw: w,
    ah: h,
    W: w + 0.041 + 0.017 * t,
    H: h + 0.04 + 0.064 * t,
    D: 0.055 + 0.066 * t,
  };
}

export function makeMaterials({ env = 1 } = {}) {
  const m = {
    body: new THREE.MeshPhysicalMaterial({ color: 0x1f2225, metalness: 0.7, roughness: 0.34, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: env }),
    bezel: new THREE.MeshStandardMaterial({ color: 0x0a0b0c, roughness: 0.38, metalness: 0.15, envMapIntensity: env }),
    black: new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 0.28, metalness: 0.3, envMapIntensity: env }),
    alu: new THREE.MeshStandardMaterial({ color: 0x2b2e31, metalness: 0.9, roughness: 0.26, envMapIntensity: env }),
    silver: new THREE.MeshStandardMaterial({ color: 0xb9bec2, metalness: 0.9, roughness: 0.3, envMapIntensity: env }),
    champagne: new THREE.MeshStandardMaterial({ color: 0xc9b996, metalness: 0.6, roughness: 0.34, envMapIntensity: env }),
    ceramic: new THREE.MeshPhysicalMaterial({ color: 0xf6f7f5, roughness: 0.2, metalness: 0, clearcoat: 0.9, clearcoatRoughness: 0.1, envMapIntensity: env }),
    matteWhite: new THREE.MeshStandardMaterial({ color: 0xf1f2f0, roughness: 0.75, metalness: 0, envMapIntensity: env }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x111213, roughness: 0.85, metalness: 0, envMapIntensity: env }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transmission: 1, thickness: 0.004, ior: 1.5, transparent: true, envMapIntensity: env, attenuationColor: new THREE.Color(0x9fe7ee), attenuationDistance: 0.6 }),
    glassCheap: new THREE.MeshPhysicalMaterial({ color: 0x0a1215, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.16, envMapIntensity: env * 1.5, depthWrite: false }),
    ledRed: new THREE.MeshBasicMaterial({ color: 0xff3a24, toneMapped: false }),
    ledCyan: new THREE.MeshBasicMaterial({ color: 0x00c1dd, toneMapped: false }),
    lens: new THREE.MeshPhysicalMaterial({ color: 0x0b1a2a, roughness: 0.05, metalness: 0.4, clearcoat: 1, envMapIntensity: env * 2 }),
  };
  return m;
}

export function screenMaterial(texture, { env = 1, intensity = 1 } = {}) {
  return new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.12,
    metalness: 0,
    emissive: 0xffffff,
    emissiveMap: texture,
    emissiveIntensity: intensity,
    envMapIntensity: env,
  });
}

let wordmarkTex = null;
function wordmarkTexture() {
  if (wordmarkTex) return wordmarkTex;
  const c = makeCanvas(512, 128);
  const ctx = c.getContext('2d');
  drawWordmark(ctx, 40, 24, 80, { color: '#8e979b' });
  wordmarkTex = canvasTexture(c, 4);
  return wordmarkTex;
}

function box(w, h, d, mat, r = 0) {
  const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(g, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function plane(w, h, mat) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
}

// ---------------------------------------------------------------------------
// Lousa Digital (linha SX ou DX). Frente do display em z = 0.
// ---------------------------------------------------------------------------
export function buildLousa({ diag = 86, line = 'DX', texture = null, mats = makeMaterials(), screenMat = null } = {}) {
  const d = lousaDims(diag);
  const g = new THREE.Group();
  g.name = `lousa-${diag}`;

  const body = box(d.W, d.H, d.D, mats.body, 0.012);
  body.position.z = -d.D / 2;
  g.add(body);

  const bezel = plane(d.W - 0.012, d.H - 0.012, mats.bezel);
  bezel.position.z = 0.0006;
  g.add(bezel);

  const side = (d.W - d.aw) / 2;
  const bottom = d.H - d.ah - side;
  const sy = d.H / 2 - side - d.ah / 2;

  const sm = screenMat || screenMaterial(texture);
  const screen = plane(d.aw, d.ah, sm);
  screen.position.set(0, sy, 0.0014);
  screen.name = 'screen';
  g.add(screen);

  const logo = plane(0.16 * (diag / 86) + 0.04, 0.04 * (diag / 86) + 0.01, new THREE.MeshBasicMaterial({ map: wordmarkTexture(), transparent: true, toneMapped: false }));
  logo.position.set(0, -d.H / 2 + bottom / 2, 0.0012);
  logo.scale.setScalar(0.85);
  g.add(logo);

  const led = new THREE.Mesh(new THREE.CircleGeometry(0.0028, 16), mats.ledRed.clone());
  led.position.set(d.W / 2 - side - 0.03, -d.H / 2 + bottom / 2, 0.0013);
  led.name = 'led';
  g.add(led);

  if (line === 'DX') {
    // câmera e microfone integrados na borda superior
    const cam = box(0.11, 0.022, 0.03, mats.black, 0.006);
    cam.position.set(0, d.H / 2 + 0.008, -0.012);
    g.add(cam);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.006, 24), mats.lens);
    lens.position.set(0, d.H / 2 + 0.009, 0.0035);
    g.add(lens);
    [-0.035, 0.035].forEach((x) => {
      const mic = new THREE.Mesh(new THREE.CircleGeometry(0.0016, 12), mats.rubber);
      mic.position.set(x, d.H / 2 + 0.009, 0.0035);
      g.add(mic);
    });
  }

  // portas frontais (USB/HDMI) no canto inferior
  for (let i = 0; i < 3; i++) {
    const p = plane(0.012, 0.005, mats.black);
    p.position.set(-d.W / 2 + side + 0.05 + i * 0.022, -d.H / 2 + bottom / 2, 0.0012);
    g.add(p);
  }

  g.userData = { dims: d, screen, led, sy };
  return g;
}

// ---------------------------------------------------------------------------
// TV comum + Moldura Touch
// ---------------------------------------------------------------------------
export function buildTV({ diag = 65, texture = null, mats = makeMaterials(), screenMat = null } = {}) {
  const { w, h } = screenDims(diag);
  const g = new THREE.Group();
  const body = box(w + 0.018, h + 0.018, 0.028, mats.black, 0.004);
  body.position.z = -0.014;
  g.add(body);
  const back = box(w * 0.7, h * 0.6, 0.04, mats.body, 0.01);
  back.position.z = -0.045;
  g.add(back);
  const sm = screenMat || screenMaterial(texture);
  const screen = plane(w, h, sm);
  screen.position.z = 0.0008;
  g.add(screen);
  g.userData = { w, h, screen };
  return g;
}

export function buildMoldura({ diag = 65, mats = makeMaterials(), glass = true } = {}) {
  const { w, h } = screenDims(diag);
  const fw = 0.034, fd = 0.03;
  const ow = w + 0.03 + fw * 2, oh = h + 0.03 + fw * 2;
  const g = new THREE.Group();
  const bars = new THREE.Group();
  const top = box(ow, fw, fd, mats.alu, 0.006); top.position.set(0, oh / 2 - fw / 2, 0);
  const bot = box(ow, fw, fd, mats.alu, 0.006); bot.position.set(0, -oh / 2 + fw / 2, 0);
  const l = box(fw, oh - fw * 2, fd, mats.alu, 0.006); l.position.set(-ow / 2 + fw / 2, 0, 0);
  const r = box(fw, oh - fw * 2, fd, mats.alu, 0.006); r.position.set(ow / 2 - fw / 2, 0, 0);
  bars.add(top, bot, l, r);
  g.add(bars);

  // fileiras de LEDs infravermelho (vermelho só para visualização)
  const ledGeo = new THREE.BoxGeometry(0.004, 0.004, 0.002);
  const nx = Math.round(w / 0.03), ny = Math.round(h / 0.03);
  const leds = new THREE.InstancedMesh(ledGeo, mats.ledRed.clone(), (nx + ny) * 2);
  const m4 = new THREE.Matrix4();
  let k = 0;
  for (let i = 0; i < nx; i++) {
    const x = -w / 2 + (i + 0.5) * (w / nx);
    m4.makeTranslation(x, oh / 2 - fw - 0.002, fd / 2 - 0.006); leds.setMatrixAt(k++, m4);
    m4.makeTranslation(x, -oh / 2 + fw + 0.002, fd / 2 - 0.006); leds.setMatrixAt(k++, m4);
  }
  for (let i = 0; i < ny; i++) {
    const y = -h / 2 + (i + 0.5) * (h / ny);
    m4.makeTranslation(-ow / 2 + fw + 0.002, y, fd / 2 - 0.006); leds.setMatrixAt(k++, m4);
    m4.makeTranslation(ow / 2 - fw - 0.002, y, fd / 2 - 0.006); leds.setMatrixAt(k++, m4);
  }
  leds.material.transparent = true;
  leds.material.opacity = 0;
  g.add(leds);

  let pane = null;
  if (glass) {
    pane = plane(ow - fw * 1.2, oh - fw * 1.2, mats.glassCheap.clone());
    pane.position.z = fd / 2 - 0.002;
    g.add(pane);
  }

  // feixes infravermelho cruzando o vidro
  const beams = new THREE.Group();
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xff4632, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const bx = 14, by = 8;
  for (let i = 1; i < bx; i++) {
    const b = plane(0.0025, h + 0.02, beamMat); b.position.set(-w / 2 + (i * w) / bx, 0, fd / 2 - 0.004); beams.add(b);
  }
  for (let i = 1; i < by; i++) {
    const b = plane(w + 0.02, 0.0025, beamMat); b.position.set(0, -h / 2 + (i * h) / by, fd / 2 - 0.004); beams.add(b);
  }
  g.add(beams);

  const logo = plane(0.12, 0.03, new THREE.MeshBasicMaterial({ map: wordmarkTexture(), transparent: true, toneMapped: false }));
  logo.position.set(0, -oh / 2 + fw / 2, fd / 2 + 0.0006);
  g.add(logo);

  g.userData = { ow, oh, fd, leds, beams, beamMat, pane };
  return g;
}

// ---------------------------------------------------------------------------
// Quadro Híbrido: quadro cerâmico de 4 m com painéis deslizantes e display central
// ---------------------------------------------------------------------------
export function buildQuadro({ width = 4.0, height = 1.305, display = 86, texture = null, mats = makeMaterials(), screenMat = null, panelTexture = null } = {}) {
  const g = new THREE.Group();
  const fr = 0.028;

  const back = box(width, height, 0.02, mats.ceramic, 0.004);
  back.position.z = -0.01;
  g.add(back);
  // moldura champanhe
  const ft = box(width + fr, fr, 0.04, mats.champagne, 0.006); ft.position.set(0, height / 2, 0.005);
  const fb = box(width + fr, fr, 0.04, mats.champagne, 0.006); fb.position.set(0, -height / 2, 0.005);
  const fl = box(fr, height, 0.04, mats.champagne, 0.006); fl.position.set(-width / 2, 0, 0.005);
  const frt = box(fr, height, 0.04, mats.champagne, 0.006); frt.position.set(width / 2, 0, 0.005);
  g.add(ft, fb, fl, frt);

  // calha para pincéis
  const tray = box(width * 0.98, 0.022, 0.08, mats.champagne, 0.006);
  tray.position.set(0, -height / 2 - 0.02, 0.05);
  g.add(tray);

  // display central
  const lousa = buildLousa({ diag: display, line: 'DX', texture, mats, screenMat });
  lousa.position.set(0, 0.0, 0.11);
  g.add(lousa);

  // trilho superior
  const rail = box(width, 0.035, 0.05, mats.champagne, 0.006);
  rail.position.set(0, height / 2 + 0.012, 0.17);
  g.add(rail);

  const dims = lousa.userData.dims;
  const pw = dims.W / 2 + 0.03;
  const ph = height - 0.02;
  const panels = [];
  [-1, 1].forEach((side) => {
    const p = new THREE.Group();
    const face = box(pw, ph, 0.022, mats.ceramic, 0.004);
    p.add(face);
    const edgeMat = mats.champagne;
    const e1 = box(pw, 0.018, 0.03, edgeMat, 0.004); e1.position.y = ph / 2;
    const e2 = box(pw, 0.018, 0.03, edgeMat, 0.004); e2.position.y = -ph / 2;
    const e3 = box(0.018, ph, 0.03, edgeMat, 0.004); e3.position.x = (side * pw) / 2;
    const e4 = box(0.018, ph, 0.03, edgeMat, 0.004); e4.position.x = (-side * pw) / 2;
    p.add(e1, e2, e3, e4);
    if (panelTexture) {
      const wr = plane(pw - 0.03, ph - 0.03, new THREE.MeshBasicMaterial({ map: panelTexture, transparent: true, depthWrite: false }));
      wr.position.z = 0.0115;
      // cada painel mostra metade da textura de escrita
      wr.geometry = wr.geometry.clone();
      const uv = wr.geometry.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setX(i, side < 0 ? uv.getX(i) * 0.5 : 0.5 + uv.getX(i) * 0.5);
      p.add(wr);
    }
    p.userData.closedX = (side * pw) / 2;
    p.userData.openX = side * (dims.W / 2 + pw / 2 + 0.04);
    p.position.set(p.userData.closedX, -0.005, 0.15);
    g.add(p);
    panels.push(p);
  });

  g.userData = { lousa, panels, width, height };
  return g;
}

// ---------------------------------------------------------------------------
// Totem interativo: tela 4K inclinada sobre coluna metálica
// ---------------------------------------------------------------------------
export function buildTotem({ diag = 55, texture = null, mats = makeMaterials(), screenMat = null } = {}) {
  const g = new THREE.Group();
  const base = box(0.78, 0.022, 0.56, mats.alu, 0.01);
  base.position.y = 0.011;
  g.add(base);
  const col = box(0.3, 0.92, 0.1, mats.body, 0.02);
  col.position.set(0, 0.48, -0.04);
  g.add(col);
  const head = new THREE.Group();
  const lousa = buildLousa({ diag, line: 'SX', texture, mats, screenMat });
  head.add(lousa);
  head.position.set(0, 0.98 + lousa.userData.dims.H / 2 * Math.cos(0.33), 0.02);
  head.rotation.x = -0.33;
  g.add(head);
  const back = box(lousa.userData.dims.W * 0.98, lousa.userData.dims.H * 0.95, 0.06, mats.body, 0.02);
  back.position.z = -0.1;
  head.add(back);
  g.userData = { lousa };
  return g;
}

// ---------------------------------------------------------------------------
// Flip Chart Digital: tela em retrato sobre pedestal com rodízios
// ---------------------------------------------------------------------------
export function buildFlip({ diag = 55, texture = null, mats = makeMaterials(), screenMat = null } = {}) {
  const g = new THREE.Group();
  const lousa = buildLousa({ diag, line: 'SX', texture, mats, screenMat });
  lousa.rotation.z = Math.PI / 2;
  const H = lousa.userData.dims.W;
  lousa.position.set(0, 0.62 + H / 2, 0.02);
  g.add(lousa);
  // gira a textura para retrato: a própria textura já é desenhada em retrato, compensamos o UV
  const scr = lousa.userData.screen;
  scr.geometry = scr.geometry.clone();
  const uv = scr.geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) { const u = uv.getX(i), v = uv.getY(i); uv.setXY(i, 1 - v, u); }
  const pole = box(0.08, 0.72, 0.05, mats.silver, 0.01);
  pole.position.set(0, 0.42, -0.06);
  g.add(pole);
  const tray = box(0.42, 0.016, 0.26, mats.alu, 0.006);
  tray.position.set(0, 0.56, 0.08);
  g.add(tray);
  const foot = box(0.7, 0.04, 0.08, mats.alu, 0.01);
  foot.position.set(0, 0.07, -0.06);
  g.add(foot);
  [-1, 1].forEach((s) => {
    const leg = box(0.06, 0.04, 0.6, mats.alu, 0.01);
    leg.position.set(s * 0.33, 0.07, 0.0);
    g.add(leg);
    [-1, 1].forEach((z) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 20), mats.rubber);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(s * 0.33, 0.03, z * 0.26);
      wheel.castShadow = true;
      g.add(wheel);
    });
  });
  g.userData = { lousa };
  return g;
}

// ---------------------------------------------------------------------------
// Lousa Branca Interativa Max80 + projetor de curta distância
// ---------------------------------------------------------------------------
export function buildMax80({ texture = null, mats = makeMaterials() } = {}) {
  const g = new THREE.Group();
  const W = 1.74, H = 1.25;
  const frame = box(W, H, 0.03, mats.silver, 0.01);
  frame.position.z = -0.015;
  g.add(frame);
  const surfMat = texture
    ? new THREE.MeshStandardMaterial({ color: 0x1a1a1a, map: texture, roughness: 0.85, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.92 })
    : mats.matteWhite;
  const surf = plane(W - 0.05, H - 0.05, surfMat);
  surf.position.z = 0.0008;
  g.add(surf);
  const tray = box(0.5, 0.02, 0.06, mats.silver, 0.006);
  tray.position.set(0, -H / 2 - 0.012, 0.025);
  g.add(tray);
  // projetor em braço de parede
  const arm = box(0.05, 0.05, 0.42, mats.silver, 0.01);
  arm.position.set(0, H / 2 + 0.24, 0.2);
  g.add(arm);
  const proj = box(0.36, 0.11, 0.3, mats.matteWhite, 0.03);
  proj.position.set(0, H / 2 + 0.17, 0.42);
  g.add(proj);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.03, 24), mats.lens);
  lens.position.set(0.09, H / 2 + 0.115, 0.27);
  lens.rotation.x = Math.PI / 2 + 0.6;
  g.add(lens);
  g.userData = { surf, W, H };
  return g;
}

// Caneta magnética que acompanha os displays
export function buildPen({ mats = makeMaterials() } = {}) {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0062, 0.0062, 0.13, 24), mats.body);
  shaft.position.y = 0.075;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.0062, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.body);
  cap.position.y = 0.14;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.0062, 0.016, 24), mats.black);
  tip.rotation.x = Math.PI;
  tip.position.y = 0.002;
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.0064, 0.0064, 0.004, 24), mats.ledCyan);
  ring.position.y = 0.118;
  [shaft, cap, tip, ring].forEach((m) => { m.castShadow = true; g.add(m); });
  tip.position.y = 0.002;
  // ponta na origem: a caneta "fica em pé" no eixo Y
  g.children.forEach((c) => { c.position.y += 0.006; });
  return g;
}

// Q de power em 3D (para o selo do hero e da vista explodida)
export function qBadgeTexture(size = 256, color = UI.cyan) {
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  drawQ(ctx, size / 2 - size * 0.04, size / 2 - size * 0.02, size * 0.28, { color, lw: size * 0.09 });
  return canvasTexture(c);
}

// Renderizador offline: imagens dos produtos e vídeos das seções "Moldura" e "Quadro Híbrido".
// Roda no Chrome (puppeteer) e codifica MP4 H.264 com WebCodecs + mp4-muxer.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import {
  buildLousa, buildTV, buildMoldura, buildQuadro, buildTotem, buildFlip, buildMax80, buildPen,
  makeMaterials, screenDims,
} from '/js/products.js';
import {
  makeCanvas, canvasTexture, drawDashboard, drawFractionLesson, drawKiosk, drawFlipNotes, drawProjection, drawQ, UI,
} from '/js/screen-ui.js';

RectAreaLightUniformsLib.init();
const log = (...a) => { console.log(...a); window.renderLog?.(a.join(' ')); };
const ease = {
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  in: (t) => t * t * t,
};
const seg = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const lerp = THREE.MathUtils.lerp;

function makeRenderer(w, h, { alpha = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.style.width = '480px';
  document.body.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if (alpha) renderer.setClearColor(0x000000, 0);
  return { renderer, canvas };
}

function envMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
}

function screenTex(draw, w = 1920, h = 1080) {
  const c = makeCanvas(w, h);
  draw(c.getContext('2d'), w, h);
  return canvasTexture(c, 16);
}
function vividScreen(tex) {
  return new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 1, roughness: 0.14, toneMapped: false });
}

function enableShadows(obj) {
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
}

function fitCamera(camera, obj, dir, margin = 1.12, target = null) {
  const box = new THREE.Box3().setFromObject(obj);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const center = target || sphere.center;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const fitH = sphere.radius / Math.sin(fov / 2);
  const fitW = sphere.radius / Math.sin(Math.atan(Math.tan(fov / 2) * camera.aspect));
  const dist = Math.max(fitH, fitW) * margin * 0.82;
  camera.position.copy(center).add(dir.clone().normalize().multiplyScalar(dist));
  camera.lookAt(center);
  camera.updateProjectionMatrix();
}

// textura de piso de madeira e de parede com leve ruído
function woodTexture() {
  const c = makeCanvas(2048, 2048); const x = c.getContext('2d');
  const pw = 2048 / 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      const off = (i % 2) * 256;
      const base = 120 + Math.random() * 26;
      x.fillStyle = `rgb(${base + 38},${base + 8},${base - 30})`;
      x.fillRect(i * pw, j * 512 + off - 512, pw - 3, 509);
      x.fillRect(i * pw, j * 512 + off, pw - 3, 509);
      x.strokeStyle = 'rgba(70,40,20,0.10)';
      for (let k = 0; k < 26; k++) {
        x.lineWidth = 1 + Math.random() * 2;
        x.beginPath(); const sx = i * pw + Math.random() * pw;
        x.moveTo(sx, j * 512 + off); x.bezierCurveTo(sx + 10, j * 512 + off + 150, sx - 10, j * 512 + off + 350, sx + 4, j * 512 + off + 509); x.stroke();
      }
    }
  }
  const t = canvasTexture(c, 16);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function noiseTexture(r, g, b, amp = 6) {
  const c = makeCanvas(512, 512); const x = c.getContext('2d');
  const img = x.createImageData(512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * amp;
    img.data[i] = r + n; img.data[i + 1] = g + n; img.data[i + 2] = b + n; img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const t = canvasTexture(c, 8);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// ===========================================================================
// IMAGENS DOS PRODUTOS
// ===========================================================================
const STILLS = {
  lousa() {
    const mats = makeMaterials({ env: 1 });
    const tex = screenTex((c, w, h) => drawFractionLesson(c, w, h));
    const o = buildLousa({ diag: 86, line: 'DX', mats, screenMat: vividScreen(tex) });
    o.rotation.y = -0.42;
    return { obj: o, dir: new THREE.Vector3(0.12, 0.08, 1), floor: false };
  },
  moldura() {
    const mats = makeMaterials({ env: 1 });
    const g = new THREE.Group();
    const tex = screenTex((c, w, h) => drawDashboard(c, w, h, { highlight: 3 }));
    const tv = buildTV({ diag: 65, mats, screenMat: vividScreen(tex) });
    g.add(tv);
    const m = buildMoldura({ diag: 65, mats });
    m.position.z = 0.016;
    m.userData.leds.material.opacity = 1;
    g.add(m);
    g.rotation.y = -0.5;
    return { obj: g, dir: new THREE.Vector3(0.1, 0.08, 1), floor: false };
  },
  quadro() {
    const mats = makeMaterials({ env: 1 });
    const tex = screenTex((c, w, h) => drawFractionLesson(c, w, h));
    const pTex = screenTex((c, w, h) => panelWriting(c, w, h, 1), 2048, 1024);
    const q = buildQuadro({ mats, screenMat: vividScreen(tex), panelTexture: pTex });
    q.userData.panels.forEach((p) => { p.position.x = p.userData.openX; });
    q.rotation.y = -0.36;
    return { obj: q, dir: new THREE.Vector3(0.1, 0.06, 1), floor: false, margin: 0.92 };
  },
  totem() {
    const mats = makeMaterials({ env: 1 });
    const tex = screenTex((c, w, h) => drawKiosk(c, w, h));
    const o = buildTotem({ diag: 55, mats, screenMat: vividScreen(tex) });
    o.rotation.y = -0.6;
    return { obj: o, dir: new THREE.Vector3(0.1, 0.32, 1), floor: true };
  },
  flip() {
    const mats = makeMaterials({ env: 1 });
    const tex = screenTex((c, w, h) => drawFlipNotes(c, w, h), 1080, 1920);
    const o = buildFlip({ diag: 55, mats, screenMat: vividScreen(tex) });
    o.rotation.y = -0.55;
    return { obj: o, dir: new THREE.Vector3(0.1, 0.22, 1), floor: true };
  },
  max80() {
    const mats = makeMaterials({ env: 1 });
    const tex = screenTex((c, w, h) => drawProjection(c, w, h));
    const o = buildMax80({ texture: tex, mats });
    o.rotation.y = -0.45;
    return { obj: o, dir: new THREE.Vector3(0.1, 0.1, 1), floor: false };
  },
};

function panelWriting(ctx, w, h, p = 1) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, w * Math.min(1, p * 1.0001), h); ctx.clip();
  ctx.fillStyle = '#1d2a4a';
  ctx.font = `700 150px ${UI.hand}`;
  ctx.fillText('Frações', 230, 270);
  ctx.font = `700 120px ${UI.hand}`;
  ctx.fillText('½ + ¼ = ?', 260, 520);
  ctx.strokeStyle = '#1d2a4a'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  // pizza desenhada a mão
  const cx = 1500, cy = 470, r = 230;
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.97, 0.1, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
  ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(250, 590); ctx.bezierCurveTo(500, 570, 700, 600, 900, 580); ctx.stroke();
  ctx.restore();
}

async function renderStill(name, { w = 1200, h = 900, ss = 2 } = {}) {
  const { renderer, canvas } = makeRenderer(w * ss, h * ss, { alpha: true });
  const scene = new THREE.Scene();
  scene.environment = envMap(renderer);
  const camera = new THREE.PerspectiveCamera(26, w / h, 0.05, 50);
  renderer.shadowMap.type = THREE.VSMShadowMap;
  const spec = STILLS[name]();
  const obj = spec.obj;
  if (spec.floor) enableShadows(obj);
  else obj.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  scene.add(obj);
  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  if (!spec.floor) obj.position.y -= center.y; // centraliza peças de parede

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-2.2, 7, 3.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 24;
  key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfefff, 1.2);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb0c4c9, 0.5));

  if (spec.floor) {
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.16 }));
    sh.rotation.x = -Math.PI / 2;
    sh.receiveShadow = true;
    scene.add(sh);
  }
  fitCamera(camera, obj, spec.dir, spec.margin || 0.94);
  renderer.render(scene, camera);
  const out = makeCanvas(w, h);
  const c2 = out.getContext('2d');
  c2.imageSmoothingQuality = 'high';
  c2.drawImage(canvas, 0, 0, w, h);
  const data = out.toDataURL('image/webp', 0.9);
  renderer.dispose();
  canvas.remove();
  return data;
}

// ===========================================================================
// VÍDEOS
// ===========================================================================
function roomBase(scene, { wall = [216, 219, 214], floor = 'wood' } = {}) {
  const wallMat = new THREE.MeshStandardMaterial({ map: noiseTexture(...wall, 5), roughness: 0.92, envMapIntensity: 0.5 });
  wallMat.map.repeat.set(8, 3);
  const w = new THREE.Mesh(new THREE.PlaneGeometry(30, 8), wallMat);
  w.position.set(0, 4, 0);
  w.receiveShadow = true;
  scene.add(w);
  let fm;
  if (floor === 'wood') {
    const t = woodTexture(); t.repeat.set(4, 4);
    fm = new THREE.MeshStandardMaterial({ map: t, roughness: 0.42, envMapIntensity: 0.6 });
  } else {
    const t = noiseTexture(196, 199, 198, 8); t.repeat.set(10, 10);
    fm = new THREE.MeshStandardMaterial({ map: t, roughness: 0.35, envMapIntensity: 0.6 });
  }
  const f = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), fm);
  f.rotation.x = -Math.PI / 2;
  f.receiveShadow = true;
  scene.add(f);
  // rodapé
  const sk = new THREE.Mesh(new THREE.BoxGeometry(30, 0.1, 0.015), new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.6 }));
  sk.position.set(0, 0.05, 0.008);
  sk.receiveShadow = true;
  scene.add(sk);
}

function daylight(scene, { intensity = 2.4, x = -4, y = 5, z = 4 } = {}) {
  const sun = new THREE.DirectionalLight(0xfff3e4, intensity);
  sun.position.set(x, y, z);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  const s = sun.shadow.camera; s.left = -5; s.right = 5; s.top = 5; s.bottom = -2; s.near = 0.5; s.far = 20;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xf4f8ff, 0x8a7a6a, 0.55));
  return sun;
}

// painel ripado de madeira (muito usado em salas de reunião)
function slatWall(scene, { width = 8, height = 3.2, color = 0x5a3d2a, slat = 0.034, gap = 0.022, depth = 0.02 } = {}) {
  const back = new THREE.Mesh(new THREE.PlaneGeometry(width + 2, height + 2), new THREE.MeshStandardMaterial({ color: 0x0d0a08, roughness: 0.95 }));
  back.position.set(0, height / 2, 0);
  back.receiveShadow = true;
  scene.add(back);
  const n = Math.floor(width / (slat + gap));
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0, envMapIntensity: 0.35 });
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(slat, height, depth), mat, n);
  const m4 = new THREE.Matrix4();
  const base = new THREE.Color(color), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    m4.makeTranslation(-width / 2 + i * (slat + gap), height / 2, depth / 2); inst.setMatrixAt(i, m4);
    const k = 0.86 + ((i * 7919) % 100) / 100 * 0.26;
    c.copy(base).multiplyScalar(k); inst.setColorAt(i, c);
  }
  inst.castShadow = true; inst.receiveShadow = true;
  scene.add(inst);
  return { front: depth };
}

function concreteFloor(scene, rgb = [58, 60, 62]) {
  const t = noiseTexture(...rgb, 10); t.repeat.set(12, 12);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: t, roughness: 0.38, envMapIntensity: 0.4 }));
  f.rotation.x = -Math.PI / 2;
  f.receiveShadow = true;
  scene.add(f);
}

function spot(scene, { color = 0xffe2bd, intensity = 30, pos, target, angle = 0.55, penumbra = 0.9, shadow = true }) {
  const s = new THREE.SpotLight(color, intensity, 0, angle, penumbra, 2);
  s.position.set(...pos);
  s.target.position.set(...target);
  if (shadow) {
    s.castShadow = true;
    s.shadow.mapSize.set(2048, 2048);
    s.shadow.bias = -0.0002;
    s.shadow.normalBias = 0.02;
  }
  scene.add(s, s.target);
  return s;
}

function chair(mat) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), mat); seat.position.y = 0.46; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.38, 0.04), mat); back.position.set(0, 0.7, -0.2); back.rotation.x = -0.12; g.add(back);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x111214, metalness: 0.7, roughness: 0.35 });
  [[-0.2, -0.18], [0.2, -0.18], [-0.2, 0.18], [0.2, 0.18]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 10), legMat); l.position.set(x, 0.225, z); g.add(l); });
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

// ---------------------------------------------------------------- moldura
function sceneMoldura() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07090a);
  slatWall(scene, { width: 8, height: 3.2, color: 0x6b4a33 });
  concreteFloor(scene, [46, 48, 50]);
  scene.add(new THREE.HemisphereLight(0xb7c9d6, 0x1a1410, 0.22));
  // luz rasante de teto sobre o ripado
  spot(scene, { pos: [-1.6, 3.1, 0.55], target: [-1.3, 0.6, 0], intensity: 26, angle: 0.62, color: 0xffd9ad });
  spot(scene, { pos: [1.7, 3.1, 0.55], target: [1.4, 0.6, 0], intensity: 22, angle: 0.62, color: 0xffd9ad });
  spot(scene, { pos: [0.4, 3.2, 2.6], target: [0, 1.2, 0], intensity: 9, angle: 0.5, color: 0xfff1df });
  const mats = makeMaterials({ env: 0.55 });

  // aparador laqueado preto com tampo de madeira
  const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x0e0f10, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const oak = new THREE.MeshStandardMaterial({ color: 0xb08a63, roughness: 0.5, map: woodTexture() });
  const cred = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.44, 0.44), lacquer);
  cred.position.set(0, 0.3, 0.26);
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.03, 0.46), oak);
  top.position.set(0, 0.535, 0.26);
  scene.add(cred, top);
  [cred, top].forEach((m) => { m.castShadow = true; m.receiveShadow = true; });
  const vase = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.085, 0.08], [0.075, 0.2], [0.04, 0.3], [0.045, 0.34], [0, 0.34]].map(([x, y]) => new THREE.Vector2(x, y)), 48), new THREE.MeshStandardMaterial({ color: 0xe9e3d8, roughness: 0.55 }));
  vase.position.set(-0.78, 0.55, 0.27); vase.castShadow = true; scene.add(vase);
  // abajur
  const brass = new THREE.MeshStandardMaterial({ color: 0xb08d57, metalness: 0.9, roughness: 0.3 });
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 32), brass); lampBase.position.set(0.82, 0.56, 0.24);
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.36, 12), brass); lampPole.position.set(0.82, 0.74, 0.24);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.17, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0xf3e6cf, emissive: 0xffc98a, emissiveIntensity: 0.9, side: THREE.DoubleSide, roughness: 0.8 }));
  shade.position.set(0.82, 0.95, 0.24);
  scene.add(lampBase, lampPole, shade);
  const bulb = new THREE.PointLight(0xffc27a, 1.6, 0, 2); bulb.position.set(0.82, 0.93, 0.24); scene.add(bulb);
  const bookCols = [0x22343d, 0xbfae8c, 0x7a3326];
  bookCols.forEach((c, i) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.034, 0.22), new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 }));
    b.position.set(0.42, 0.567 + i * 0.035, 0.27); b.rotation.y = i * 0.1 - 0.1; b.castShadow = true; scene.add(b);
  });
  // cadeira desfocada em primeiro plano
  const ch = chair(new THREE.MeshStandardMaterial({ color: 0x24292c, roughness: 0.8 }));
  ch.position.set(-1.25, 0, 2.05); ch.rotation.y = 0.5; scene.add(ch);

  // TV com tela animada
  const tvC = makeCanvas(1920, 1080);
  const tvCtx = tvC.getContext('2d');
  const tvTex = canvasTexture(tvC, 16);
  const tv = buildTV({ diag: 65, mats, screenMat: vividScreen(tvTex) });
  const TVY = 1.42;
  tv.position.set(0, TVY, 0.095);
  tv.userData.screen.material.emissiveIntensity = 1.45;
  scene.add(tv);
  enableShadows(tv);
  const { w: sw, h: sh } = screenDims(65);

  const frame = buildMoldura({ diag: 65, mats });
  enableShadows(frame);
  frame.userData.beams.children.forEach((b) => { b.material = frame.userData.beamMat.clone(); });
  frame.userData.leds.castShadow = false;
  scene.add(frame);
  const finalPos = new THREE.Vector3(0, TVY, 0.095 + 0.017);

  const screenLight = new THREE.RectAreaLight(0xcfe9f2, 3.2, sw, sh);
  screenLight.position.set(0, TVY, 0.1);
  screenLight.lookAt(0, TVY, 2);
  scene.add(screenLight);

  const pen = buildPen({ mats });
  pen.scale.setScalar(1.7);
  enableShadows(pen);
  scene.add(pen);

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.05, 60);
  const BAR = 3; // Sudeste
  const s = 1;
  const barCX = (120 + BAR * (170 + 100) + 85) * s; // centro da barra em px
  const barTop = 1080 - 170 - 560 * 0.86;
  const toWorld = (px, py, z = 0.02) => new THREE.Vector3((px / 1920 - 0.5) * sw, TVY + (0.5 - py / 1080) * sh, 0.095 + z);

  function update(t) {
    // tela da TV
    const hl = t > 4.35 ? BAR : -1;
    drawDashboard(tvCtx, 1920, 1080, { highlight: hl });
    if (t > 4.3) {
      const k = seg(t, 4.3, 5.0);
      tvCtx.strokeStyle = `rgba(0,193,221,${1 - k})`; tvCtx.lineWidth = 8;
      tvCtx.beginPath(); tvCtx.arc(barCX, barTop - 10, 20 + k * 120, 0, Math.PI * 2); tvCtx.stroke();
    }
    let penPx = null;
    if (t > 4.8) {
      const k = ease.inOut(seg(t, 4.8, 5.75));
      const cx = barCX, cy = barTop + 200, rx = 150, ry = 330;
      tvCtx.strokeStyle = '#FF4632'; tvCtx.lineWidth = 9; tvCtx.lineCap = 'round';
      tvCtx.beginPath();
      const a0 = -Math.PI * 0.6;
      tvCtx.ellipse(cx, cy, rx, ry, 0.06, a0, a0 + k * Math.PI * 2.08);
      tvCtx.stroke();
      const a = a0 + k * Math.PI * 2.08;
      penPx = [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    }
    tvTex.needsUpdate = true;

    // moldura voando até a TV
    const fk = ease.outQuint(seg(t, 1.0, 2.9));
    frame.position.set(lerp(0.25, finalPos.x, fk), lerp(TVY + 0.35, finalPos.y, fk), lerp(2.6, finalPos.z, fk));
    frame.rotation.set(lerp(-0.35, 0, fk), lerp(0.55, 0, fk), lerp(-0.12, 0, fk));
    frame.visible = t > 1.0;

    // sensores infravermelho ligando
    const led = seg(t, 3.0, 3.25);
    frame.userData.leds.material.opacity = led;
    frame.userData.beams.children.forEach((b, i, arr) => {
      const delay = (i / arr.length) * 0.5;
      const k = seg(t, 3.1 + delay, 3.35 + delay) * (1 - seg(t, 3.7 + delay, 4.1 + delay));
      b.material.opacity = k * 0.85;
    });

    // caneta: entra pela direita, toca a barra e circula
    let penPos;
    const tapPx = [barCX, barTop - 10];
    if (t < 3.7) {
      penPos = toWorld(2400, 520, 0.6);
    } else if (t < 4.35) {
      const k = ease.out(seg(t, 3.7, 4.3));
      const a = toWorld(2300, 400, 0.5), b = toWorld(...tapPx, 0.012);
      penPos = a.lerp(b, k);
    } else if (t < 4.8) {
      const k = ease.inOut(seg(t, 4.35, 4.8));
      const a = toWorld(...tapPx, 0.012);
      const p0 = [barCX + Math.cos(-Math.PI * 0.6) * 150, barTop + 200 + Math.sin(-Math.PI * 0.6) * 330];
      const b = toWorld(...p0, 0.012);
      a.z += Math.sin(k * Math.PI) * 0.05;
      penPos = a.lerp(b, k);
    } else if (penPx && t < 5.75) {
      penPos = toWorld(...penPx, 0.012);
    } else {
      const k = ease.inOut(seg(t, 5.75, 6.4));
      const a = toWorld(barCX + Math.cos(-Math.PI * 0.6 + Math.PI * 2.08) * 150, barTop + 200 + Math.sin(-Math.PI * 0.6 + Math.PI * 2.08) * 330, 0.012);
      penPos = a.lerp(toWorld(2350, 300, 0.5), k);
    }
    pen.position.copy(penPos);
    pen.rotation.set(1.05, 0, -0.5);

    // câmera
    const ck = ease.inOut(seg(t, 0, 6.4));
    camera.position.set(lerp(-1.3, -0.85, ck), lerp(1.5, 1.44, ck), lerp(3.75, 3.2, ck));
    camera.lookAt(lerp(-0.55, -0.55, ck), lerp(1.3, 1.36, ck), 0);
  }
  const focus = () => camera.position.distanceTo(new THREE.Vector3(0, TVY, 0.1));
  return { scene, camera, update, duration: 6.4, focus, exposure: 1.0, bloom: [0.14, 0.45, 0.9], aperture: 0.0013 };
}

// ---------------------------------------------------------- quadro híbrido
function sceneQuadro() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d0e);
  // parede em dois tons: lambri verde até 0,7 m e reboco claro acima
  const upperTex = noiseTexture(205, 200, 188, 6); upperTex.repeat.set(6, 2);
  const upper = new THREE.Mesh(new THREE.PlaneGeometry(14, 3), new THREE.MeshStandardMaterial({ map: upperTex, roughness: 0.92, envMapIntensity: 0.4 }));
  upper.position.set(0, 0.7 + 1.5, 0); upper.receiveShadow = true; scene.add(upper);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(14, 0.7, 0.03), new THREE.MeshStandardMaterial({ color: 0x2c4640, roughness: 0.6 }));
  lower.position.set(0, 0.35, 0.015); lower.receiveShadow = true; scene.add(lower);
  const wrail = new THREE.Mesh(new THREE.BoxGeometry(14, 0.04, 0.05), new THREE.MeshStandardMaterial({ color: 0x23392f, roughness: 0.5 }));
  wrail.position.set(0, 0.71, 0.025); scene.add(wrail);
  concreteFloor(scene, [128, 126, 120]);
  scene.add(new THREE.HemisphereLight(0xdfe9f2, 0x3a3228, 0.35));
  // luz de janela vindo da esquerda
  const sun = new THREE.DirectionalLight(0xffe7c8, 2.6);
  sun.position.set(-6, 4.2, 3.2);
  sun.target.position.set(0.5, 1.2, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 4, bottom: -2, near: 0.5, far: 20 });
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  // caixilho projetando sombra de janela
  const mull = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const winGroup = new THREE.Group();
  [[0, 1.0, 0.06, 2.4], [0.9, 1.0, 0.06, 2.4], [0.45, 2.2, 1.0, 0.06], [0.45, 1.2, 1.0, 0.06]].forEach(([x, y, w, h]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), mull); m.position.set(x, y, 0); m.castShadow = true; winGroup.add(m);
  });
  winGroup.position.set(-3.6, 1.0, 2.0); winGroup.rotation.y = 0.9;
  scene.add(winGroup);
  spot(scene, { pos: [2.6, 3.2, 2.4], target: [1.2, 1.3, 0], intensity: 14, angle: 0.6, color: 0xfff4e6, shadow: false });
  const mats = makeMaterials({ env: 0.7 });

  // carteiras desfocadas em primeiro plano
  const deskMat = new THREE.MeshStandardMaterial({ color: 0xcaa978, roughness: 0.55 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x1f2a2e, roughness: 0.75 });
  [[-0.3, 3.1, 0.15], [1.9, 3.3, -0.1], [3.6, 2.6, 0.25]].forEach(([x, z, ry]) => {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.03, 0.46), deskMat); top.position.y = 0.74; g.add(top);
    [[-0.27, -0.19], [0.27, -0.19], [-0.27, 0.19], [0.27, 0.19]].forEach(([lx, lz]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.73, 8), mats.alu); l.position.set(lx, 0.365, lz); g.add(l); });
    const c = chair(seatMat); c.position.set(0, 0, 0.5); c.rotation.y = Math.PI; g.add(c);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.position.set(x, 0, z); g.rotation.y = ry;
    scene.add(g);
  });

  const scrC = makeCanvas(1920, 1080);
  const scrCtx = scrC.getContext('2d');
  const scrTex = canvasTexture(scrC, 16);
  const pC = makeCanvas(2048, 1024);
  const pCtx = pC.getContext('2d');
  const pTex = canvasTexture(pC, 16);
  const scrMat = vividScreen(scrTex);
  const q = buildQuadro({ mats, screenMat: scrMat, panelTexture: pTex });
  const QY = 1.4;
  q.position.set(0, QY, 0.03);
  enableShadows(q);
  scene.add(q);
  const lousa = q.userData.lousa;
  const { dims, sy } = lousa.userData;

  const screenLight = new THREE.RectAreaLight(0xd8f4fa, 0, dims.aw, dims.ah);
  screenLight.position.set(0, QY + sy, 0.03 + 0.11 + 0.01);
  screenLight.lookAt(0, QY + sy, 3);
  scene.add(screenLight);

  const marker = buildPen({ mats });
  marker.scale.set(1.9, 1.05, 1.9);
  enableShadows(marker);
  scene.add(marker);

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.05, 60);
  const pw = q.userData.panels[0].userData;
  // coordenadas da escrita (textura 2048x1024 cobre os dois painéis fechados)
  const closedW = (dims.W / 2 + 0.03) * 2 - 0.03;
  const closedH = q.userData.height - 0.05;
  const panelZ = 0.03 + 0.15 + 0.012;
  const toWorld = (px, py, z = 0) => new THREE.Vector3((px / 2048 - 0.5) * closedW, QY - 0.005 + (0.5 - py / 1024) * closedH, panelZ + z);

  function update(t) {
    // 1) escrita com pincel nos painéis fechados
    const wk = seg(t, 0.2, 2.1);
    panelWriting(pCtx, 2048, 1024, wk);
    pTex.needsUpdate = true;
    const revealX = 2048 * wk;
    const wy = revealX < 1200 ? (revealX < 1000 ? 230 + Math.sin(revealX * 0.05) * 40 + (revealX > 500 ? 220 : 0) : 560) : 470 + Math.sin(revealX * 0.02) * 200;
    if (t < 2.1) marker.position.copy(toWorld(Math.max(230, revealX), wy, 0.006));
    else {
      const k = ease.inOut(seg(t, 2.1, 2.7));
      marker.position.copy(toWorld(1720, 560, 0.006).lerp(new THREE.Vector3(1.75, QY - 0.68, 0.1), k));
    }
    marker.rotation.set(lerp(1.15, 0, seg(t, 2.1, 2.7)), 0, lerp(-0.45, Math.PI / 2, seg(t, 2.1, 2.7)));

    // 2) painéis deslizam
    const sk = ease.inOut(seg(t, 2.6, 4.0));
    q.userData.panels.forEach((p) => { p.position.x = lerp(p.userData.closedX, p.userData.openX, sk); });

    // 3) display liga
    const boot = seg(t, 3.9, 4.6);
    const power = ease.out(seg(t, 4.5, 5.0));
    scrCtx.fillStyle = '#020405'; scrCtx.fillRect(0, 0, 1920, 1080);
    if (boot > 0 && power < 1) {
      scrCtx.save(); scrCtx.globalAlpha = 1 - power; scrCtx.shadowColor = UI.cyan; scrCtx.shadowBlur = 30;
      drawQ(scrCtx, 960, 540, 90, { progress: boot, lw: 30 }); scrCtx.restore();
    }
    if (power > 0) {
      scrCtx.save(); scrCtx.globalAlpha = power;
      drawFractionLesson(scrCtx, 1920, 1080, { t: ease.out(seg(t, 5.0, 6.0)) });
      // toque no botão "Quiz com IA"
      if (t > 6.2) {
        const k = seg(t, 6.2, 6.9);
        scrCtx.strokeStyle = `rgba(0,193,221,${1 - k})`; scrCtx.lineWidth = 7;
        scrCtx.beginPath(); scrCtx.arc(1046 + 2 * 250 + 114, 798, 18 + k * 110, 0, Math.PI * 2); scrCtx.stroke();
      }
      scrCtx.restore();
    }
    scrTex.needsUpdate = true;
    scrMat.emissiveIntensity = (0.06 + power * 0.94 + (boot > 0 ? 0.3 * (1 - power) : 0)) * 1.7;
    screenLight.intensity = power * 4.5;

    // câmera: plano aberto e aproximação final
    const ck = ease.inOut(seg(t, 0, 7.2));
    camera.position.set(lerp(1.15, 0.62, ck), lerp(1.55, 1.45, ck), lerp(6.4, 4.1, ck));
    camera.lookAt(lerp(1.15, 0.8, ck), lerp(1.3, 1.36, ck), 0);
  }
  const focus = () => camera.position.distanceTo(new THREE.Vector3(0.4, QY, 0.15));
  return { scene, camera, update, duration: 7.2, focus, exposure: 0.92, bloom: [0.05, 0.4, 1.6], aperture: 0.0007 };
}

const VIDEOS = { moldura: sceneMoldura, quadro: sceneQuadro };

async function renderVideo(name, { w = 1920, h = 1080, fps = 30, ss = 1.5, bitrate = 6_500_000, gop = 6 } = {}) {
  const { renderer, canvas } = makeRenderer(Math.round(w * ss), Math.round(h * ss));
  const spec = VIDEOS[name]();
  spec.scene.environment = envMap(renderer);
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(1);
  composer.setSize(canvas.width, canvas.height);
  renderer.toneMappingExposure = spec.exposure || 1;
  composer.addPass(new RenderPass(spec.scene, spec.camera));
  const bokeh = new BokehPass(spec.scene, spec.camera, { focus: 4, aperture: spec.aperture || 0.001, maxblur: 0.006 });
  composer.addPass(bokeh);
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(canvas.width / 2, canvas.height / 2), ...(spec.bloom || [0.12, 0.4, 0.95])));
  composer.addPass(new OutputPass());

  const out = makeCanvas(w, h);
  const ctx = out.getContext('2d');
  ctx.imageSmoothingQuality = 'high';

  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: 'avc', width: w, height: h, frameRate: fps }, fastStart: 'in-memory', firstTimestampBehavior: 'offset' });
  let encErr = null;
  const encoder = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { encErr = e; } });
  const codecs = ['avc1.640028', 'avc1.4d0028', 'avc1.42e028'];
  let cfg = null;
  for (const codec of codecs) {
    const c = { codec, width: w, height: h, bitrate, framerate: fps, latencyMode: 'quality', avc: { format: 'avc' } };
    const sup = await VideoEncoder.isConfigSupported(c);
    if (sup.supported) { cfg = c; break; }
  }
  if (!cfg) throw new Error('H.264 encoder não suportado');
  encoder.configure(cfg);
  log(`codec ${cfg.codec}`);

  const frames = Math.round(spec.duration * fps);
  let poster = null;
  for (let i = 0; i < frames; i++) {
    const t = i / fps;
    spec.update(t);
    if (spec.focus) bokeh.uniforms.focus.value = spec.focus(t);
    composer.render();
    ctx.drawImage(canvas, 0, 0, w, h);
    if (i === 0) poster = out.toDataURL('image/webp', 0.82);
    const vf = new VideoFrame(out, { timestamp: Math.round((i * 1e6) / fps), duration: Math.round(1e6 / fps) });
    encoder.encode(vf, { keyFrame: i % gop === 0 });
    vf.close();
    while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 4));
    if (encErr) throw encErr;
    if (i % 30 === 0) log(`${name}: quadro ${i}/${frames}`);
  }
  await encoder.flush();
  muxer.finalize();
  const buf = muxer.target.buffer;
  // último quadro, útil para revisão
  const last = out.toDataURL('image/webp', 0.82);
  renderer.dispose();
  canvas.remove();
  return { buf, poster, last };
}

function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let s = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) s += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
  return btoa(s);
}

async function save(path, b64) {
  const CH = 1 << 20;
  for (let i = 0, n = 0; i < b64.length; i += CH, n++) await window.saveChunk(path, n, b64.slice(i, i + CH));
}

async function fontsReady() {
  await Promise.all([document.fonts.load('700 100px "Caveat"'), document.fonts.load('800 40px "Archivo"'), document.fonts.load('600 40px "Archivo"'), document.fonts.load('500 40px "Archivo"')]);
}

window.RENDER = {
  async stills(names = Object.keys(STILLS)) {
    await fontsReady();
    for (const n of names) {
      const data = await renderStill(n);
      await save(`assets/renders/${n}.webp`, data.split(',')[1]);
      log(`imagem ${n} ok`);
    }
  },
  async video(name, opts = {}) {
    await fontsReady();
    const { buf, poster, last } = await renderVideo(name, opts);
    await save(`assets/video/${name}.mp4`, bufToB64(buf));
    await save(`assets/video/${name}-poster.webp`, poster.split(',')[1]);
    await save(`_review/${name}-last.webp`, last.split(',')[1]);
    log(`vídeo ${name} ok (${(buf.byteLength / 1e6).toFixed(1)} MB)`);
  },
  async preview(name, t) {
    await fontsReady();
    const { renderer, canvas } = makeRenderer(1280, 720);
    const spec = VIDEOS[name]();
    spec.scene.environment = envMap(renderer);
    renderer.toneMappingExposure = spec.exposure || 1;
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(spec.scene, spec.camera));
    const bokeh = new BokehPass(spec.scene, spec.camera, { focus: 4, aperture: spec.aperture || 0.001, maxblur: 0.006 });
    composer.addPass(bokeh);
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(640, 360), ...(spec.bloom || [0.12, 0.4, 0.95])));
    composer.addPass(new OutputPass());
    spec.update(t);
    if (spec.focus) bokeh.uniforms.focus.value = spec.focus(t);
    composer.render();
    const d = canvas.toDataURL('image/webp', 0.85);
    renderer.dispose(); canvas.remove();
    return d;
  },
};
window.RENDER_READY = true;
log('render pronto');

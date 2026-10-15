// Vista explodida: as cinco camadas de uma Lousa Digital Qualipix.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { lousaDims, makeMaterials } from './products.js';
import { makeCanvas, canvasTexture, drawFractionLesson, drawQ, UI } from './screen-ui.js';

const BG = '#F2F6F7';

export function createAnatomy({ canvas, coarse = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-2, 3, 4);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfdde1, 0.6));

  const d = lousaDims(86);
  const stack = new THREE.Group();
  scene.add(stack);
  const layers = [];

  function layer() {
    const g = new THREE.Group();
    g.userData.mats = [];
    stack.add(g);
    layers.push(g);
    return g;
  }
  function track(g, mesh) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      m.transparent = true;
      m.userData.baseOpacity = m.opacity;
      g.userData.mats.push(m);
    });
    g.add(mesh);
    return mesh;
  }
  const base = makeMaterials({ env: 1 });
  const mat = (k) => base[k].clone();

  // 1. vidro
  {
    const g = layer();
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xe6f6f8, roughness: 0.04, metalness: 0, opacity: 0.2, envMapIntensity: 1.4, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false });
    const pane = track(g, new THREE.Mesh(new RoundedBoxGeometry(d.aw + 0.04, d.ah + 0.04, 0.01, 2, 0.004), glass));
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(pane.geometry, 30), new THREE.LineBasicMaterial({ color: 0x8fd8e3 }));
    track(g, edge);
  }

  // 2. moldura infravermelho
  let beams;
  {
    const g = layer();
    const fw = 0.04, fd = 0.024;
    const W = d.aw + 0.09, H = d.ah + 0.09;
    const alu = mat('alu');
    [[0, H / 2 - fw / 2, W, fw], [0, -H / 2 + fw / 2, W, fw], [-W / 2 + fw / 2, 0, fw, H - 2 * fw], [W / 2 - fw / 2, 0, fw, H - 2 * fw]].forEach(([x, y, w, h]) => {
      const m = track(g, new THREE.Mesh(new RoundedBoxGeometry(w, h, fd, 2, 0.005), alu));
      m.position.set(x, y, 0);
    });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xff4632, toneMapped: false });
    const geo = new THREE.BoxGeometry(0.008, 0.008, 0.004);
    const inst = new THREE.InstancedMesh(geo, ledMat, 220);
    const m4 = new THREE.Matrix4();
    let k = 0;
    const nx = 70, ny = 40;
    for (let i = 0; i < nx; i++) {
      const x = -d.aw / 2 + (i + 0.5) * (d.aw / nx);
      m4.makeTranslation(x, H / 2 - fw, fd / 2); inst.setMatrixAt(k++, m4);
      m4.makeTranslation(x, -H / 2 + fw, fd / 2); inst.setMatrixAt(k++, m4);
    }
    for (let i = 0; i < ny; i++) {
      const y = -d.ah / 2 + (i + 0.5) * (d.ah / ny);
      m4.makeTranslation(-W / 2 + fw, y, fd / 2); inst.setMatrixAt(k++, m4);
      m4.makeTranslation(W / 2 - fw, y, fd / 2); inst.setMatrixAt(k++, m4);
    }
    inst.count = k;
    track(g, inst);
    beams = new THREE.Group();
    const bm = new THREE.MeshBasicMaterial({ color: 0xff4632, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
    for (let i = 1; i < 18; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.003, d.ah), bm); p.position.set(-d.aw / 2 + (i * d.aw) / 18, 0, 0.004); beams.add(p); }
    for (let i = 1; i < 10; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(d.aw, 0.003), bm); p.position.set(0, -d.ah / 2 + (i * d.ah) / 10, 0.004); beams.add(p); }
    beams.userData.mat = bm;
    g.add(beams);
  }

  // 3. painel 4K
  {
    const g = layer();
    const c = makeCanvas(1920, 1080);
    drawFractionLesson(c.getContext('2d'), 1920, 1080);
    const tex = canvasTexture(c, 8);
    const body = track(g, new THREE.Mesh(new RoundedBoxGeometry(d.aw + 0.02, d.ah + 0.02, 0.02, 2, 0.004), mat('bezel')));
    body.position.z = -0.01;
    const scr = track(g, new THREE.Mesh(new THREE.PlaneGeometry(d.aw, d.ah), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 1, roughness: 0.3, toneMapped: false })));
    scr.position.z = 0.0012;
    g.userData.loupe = new THREE.Vector3(-d.aw * 0.18, d.ah * 0.02, 0.002);
  }

  // 4. eletrônica: Android 14, alto-falantes, câmera e slot OPS
  {
    const g = layer();
    const pcbC = makeCanvas(1024, 512);
    const x = pcbC.getContext('2d');
    x.fillStyle = '#10241f'; x.fillRect(0, 0, 1024, 512);
    x.strokeStyle = 'rgba(120,200,170,0.35)'; x.lineWidth = 2;
    for (let i = 0; i < 46; i++) {
      x.beginPath(); const y0 = 20 + Math.random() * 470; x.moveTo(0, y0);
      x.lineTo(200 + Math.random() * 300, y0); x.lineTo(260 + Math.random() * 400, 40 + Math.random() * 430); x.lineTo(1024, 40 + Math.random() * 430); x.stroke();
    }
    x.fillStyle = 'rgba(220,240,232,0.8)'; x.font = `700 30px ${UI.font}`;
    x.fillText('QUALIPIX DX', 40, 470);
    x.font = `500 22px ${UI.font}`;
    x.fillText('Android 14  8 GB  128 GB', 40, 500);
    drawQ(x, 960, 450, 22, { color: UI.cyan, lw: 8 });
    const pcbTex = canvasTexture(pcbC, 4);
    const pcb = track(g, new THREE.Mesh(new THREE.BoxGeometry(d.aw * 0.5, d.ah * 0.42, 0.006), [mat('rubber'), mat('rubber'), mat('rubber'), mat('rubber'), new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.55, metalness: 0.2 }), mat('rubber')]));
    pcb.position.set(0, -d.ah * 0.12, 0);
    const chip = (w, h, dd, px, py, m = mat('black')) => { const c = track(g, new THREE.Mesh(new RoundedBoxGeometry(w, h, dd, 2, 0.003), m)); c.position.set(px, py, dd / 2 + 0.003); return c; };
    const soc = chip(0.16, 0.16, 0.03, -0.12, -d.ah * 0.1);
    // dissipador
    for (let i = 0; i < 9; i++) { const f = track(g, new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.16, 0.05), mat('silver'))); f.position.set(-0.19 + i * 0.018, -d.ah * 0.1, 0.055); }
    chip(0.09, 0.05, 0.012, 0.1, -d.ah * 0.02);
    chip(0.09, 0.05, 0.012, 0.1, -d.ah * 0.1);
    chip(0.12, 0.07, 0.01, 0.22, -d.ah * 0.22);
    const ledC = new THREE.MeshBasicMaterial({ color: 0x00c1dd, toneMapped: false });
    chip(0.012, 0.012, 0.006, 0.3, -d.ah * 0.02, ledC);
    // alto-falantes
    const grille = (() => {
      const c = makeCanvas(256, 128); const y = c.getContext('2d');
      y.fillStyle = '#1b1e21'; y.fillRect(0, 0, 256, 128); y.fillStyle = '#05070a';
      for (let i = 0; i < 18; i++) for (let j = 0; j < 9; j++) { y.beginPath(); y.arc(10 + i * 14, 10 + j * 13.5, 3.6, 0, Math.PI * 2); y.fill(); }
      return canvasTexture(c, 4);
    })();
    [-1, 1].forEach((s) => {
      const sp = track(g, new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.1, 0.05, 2, 0.01), [mat('body'), mat('body'), mat('body'), mat('body'), new THREE.MeshStandardMaterial({ map: grille, roughness: 0.6 }), mat('body')]));
      sp.position.set(s * (d.aw / 2 - 0.2), -d.ah / 2 + 0.07, 0.02);
    });
    // câmera
    const cam = track(g, new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.035, 0.035, 2, 0.008), mat('black')));
    cam.position.set(0, d.ah / 2 + 0.01, 0.01);
    const lens = track(g, new THREE.Mesh(new THREE.CircleGeometry(0.009, 24), mat('lens')));
    lens.position.set(0, d.ah / 2 + 0.01, 0.0285);
    // módulo OPS
    const ops = track(g, new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.3, 0.03, 2, 0.006), mat('alu')));
    ops.position.set(d.aw / 2 - 0.24, -d.ah * 0.08, 0.018);
  }

  // 5. chassi traseiro
  {
    const g = layer();
    const shell = track(g, new THREE.Mesh(new RoundedBoxGeometry(d.W, d.H, 0.05, 3, 0.014), mat('body')));
    shell.position.z = -0.02;
    const inner = track(g, new THREE.Mesh(new THREE.PlaneGeometry(d.W - 0.08, d.H - 0.08), new THREE.MeshStandardMaterial({ color: 0x2a2e31, roughness: 0.55, metalness: 0.6 })));
    inner.position.z = 0.0055;
    // furação VESA e nervuras
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x222528, roughness: 0.5, metalness: 0.6 });
    for (let i = -2; i <= 2; i++) { const r = track(g, new THREE.Mesh(new THREE.BoxGeometry(0.012, d.H - 0.16, 0.012), ribMat)); r.position.set(i * 0.3, 0, 0.012); }
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x050607 });
    [[-0.3, 0.2], [0.3, 0.2], [-0.3, -0.2], [0.3, -0.2]].forEach(([hx, hy]) => { const h = track(g, new THREE.Mesh(new THREE.CircleGeometry(0.014, 20), holeMat)); h.position.set(hx, hy, 0.0065); });
  }

  const GAP = 0.34;
  // posição de cada camada com o display montado
  const ASSEMBLED = [0.018, 0.006, 0, -0.11, -0.125];
  const view = { explode: 0, active: 0, rotY: -0.42, smooth: { explode: 0, rotY: -0.42 } };
  let mobile = false;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    mobile = camera.aspect < 0.9;
    camera.fov = mobile ? 42 : 30;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let progress = 0;
  function setProgress(p) {
    progress = p;
    view.explode = smooth(0.0, 0.16, p);
    const k = THREE.MathUtils.clamp((p - 0.12) / 0.86, 0, 0.9999);
    view.active = Math.floor(k * 5);
    view.rotY = THREE.MathUtils.lerp(-0.38, -0.95, smooth(0, 1, p));
  }

  const tmpV = new THREE.Vector3();
  let running = true;
  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const s = view.smooth;
    s.explode += (view.explode - s.explode) * Math.min(1, dt * 6);
    s.rotY += (view.rotY - s.rotY) * Math.min(1, dt * 5);

    layers.forEach((g, i) => {
      const isActive = i === view.active && s.explode > 0.5;
      g.userData.focus = (g.userData.focus ?? 0) + ((isActive ? 1 : 0) - (g.userData.focus ?? 0)) * Math.min(1, dt * 6);
      const f = g.userData.focus;
      g.position.z = ASSEMBLED[i] * (1 - s.explode) + (2 - i) * GAP * s.explode + f * 0.1;
      g.position.y = f * 0.04;
      const dim = s.explode > 0.5 ? 0.22 + 0.78 * f : 1;
      g.userData.mats.forEach((m) => { m.opacity = m.userData.baseOpacity * dim; m.depthWrite = dim > 0.9 && m.userData.baseOpacity === 1; });
    });
    beams.userData.mat.opacity = layers[1].userData.focus * (0.55 + Math.sin(t * 6) * 0.15);

    stack.rotation.y = s.rotY;
    stack.rotation.x = 0.1;
    stack.position.y = Math.sin(t * 0.8) * 0.01;

    if (mobile) {
      camera.position.set(0.5, 0.75, 6.6);
      camera.lookAt(0.0, -0.55, -0.2);
      stack.position.x = 0;
    } else {
      camera.position.set(0.9, 0.6, 5.2);
      camera.lookAt(0.62, 0.02, -0.2);
      stack.position.x = -0.42;
    }
    renderer.render(scene, camera);
  }
  tick();

  return {
    setProgress,
    get active() { return view.active; },
    get exploded() { return view.smooth.explode > 0.6; },
    loupePoint() {
      const g = layers[2];
      tmpV.copy(g.userData.loupe);
      g.localToWorld(tmpV);
      tmpV.project(camera);
      return { x: (tmpV.x * 0.5 + 0.5) * canvas.clientWidth, y: (-tmpV.y * 0.5 + 0.5) * canvas.clientHeight };
    },
    setRunning(v) { if (v && !running) clock.getDelta(); running = v; },
  };
}

function smooth(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

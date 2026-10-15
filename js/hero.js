// Hero: sala escura, a lousa liga pelo "Q" de power e o visitante escreve nela.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildLousa, buildPen, makeMaterials, screenMaterial } from './products.js';
import { WhiteboardScreen } from './screen-ui.js';

const ROOM = 0x081217;

export function createHero({ canvas, coarse = false, reduced = false, onBooted = () => {} }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(ROOM);
  scene.fog = new THREE.Fog(ROOM, 6, 16);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 60);

  // --- sala --------------------------------------------------------------
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x050a0d, roughness: coarse ? 0.7 : 0.42, metalness: 0.0, envMapIntensity: 0.03 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 12),
    new THREE.MeshStandardMaterial({ color: 0x0d1a20, roughness: 0.92, metalness: 0, envMapIntensity: 0.04 })
  );
  wall.position.set(0, 6, -0.07);
  scene.add(wall);


  // --- lousa -------------------------------------------------------------
  const board = new WhiteboardScreen({ hint: coarse ? 'Toque em "Escrever na tela"' : 'Clique e arraste para escrever' });
  const mats = makeMaterials({ env: 0.25 });
  const sMat = screenMaterial(board.texture, { env: 0.6, intensity: 0 });
  sMat.emissiveIntensity = 1;
  const lousa = buildLousa({ diag: 86, line: 'DX', mats, screenMat: sMat });
  const MOUNT_Y = 1.42;
  lousa.position.set(0, MOUNT_Y, 0);
  scene.add(lousa);
  const { dims, screen, led, sy } = lousa.userData;
  const screenCenter = new THREE.Vector3(0, MOUNT_Y + sy, 0);

  // luz emitida pela tela
  const screenLight = new THREE.RectAreaLight(0xdff7fb, 0, dims.aw, dims.ah);
  screenLight.position.set(0, MOUNT_Y + sy, 0.01);
  screenLight.lookAt(0, MOUNT_Y + sy, 2);
  scene.add(screenLight);

  // halo na parede atrás do display
  const haloTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(120,225,240,0.55)');
    gr.addColorStop(0.45, 'rgba(0,160,190,0.18)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.2), new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.position.set(0, MOUNT_Y + sy, -0.065);
  scene.add(halo);

  // poeira no feixe de luz
  const dustCount = coarse ? 160 : 420;
  const dustGeo = new THREE.BufferGeometry();
  const dp = new Float32Array(dustCount * 3);
  const dseed = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3] = (Math.random() - 0.5) * 3.2;
    dp[i * 3 + 1] = 0.2 + Math.random() * 2.6;
    dp[i * 3 + 2] = 0.1 + Math.random() * 3.2;
    dseed[i] = Math.random() * 100;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.012, map: dotTex, color: 0xbfefff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dust);

  // caneta magnética
  const pen = buildPen({ mats });
  scene.add(pen);
  const dock = new THREE.Vector3(dims.W / 2 + 0.012, MOUNT_Y - 0.05, 0.004);
  pen.position.copy(dock);
  const penTarget = { pos: dock.clone(), tilt: 0, docked: true };

  // luz de preenchimento muito sutil para recortar a moldura
  const rim = new THREE.DirectionalLight(0x6fb6c8, 0.0);
  rim.position.set(-3, 3, 2);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x1a3540, 0x020405, 0.25));

  // --- pós-processamento ----------------------------------------------------
  let composer = null, bloom = null;
  if (!coarse) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.1, 0.4, 0.92);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // --- enquadramento ------------------------------------------------------
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let scrollP = 0;
  const camBase = new THREE.Vector3(), lookBase = new THREE.Vector3();
  let baseFov = 32;

  function frame(w, h) {
    const a = w / h;
    // retrato (celular) -> paisagem (desktop)
    const t = THREE.MathUtils.clamp((a - 0.55) / (1.6 - 0.55), 0, 1);
    baseFov = THREE.MathUtils.lerp(40, 32, t);
    camBase.set(THREE.MathUtils.lerp(-0.25, -1.6, t), THREE.MathUtils.lerp(0.95, 1.5, t), THREE.MathUtils.lerp(7.6, 5.1, t));
    lookBase.set(THREE.MathUtils.lerp(-0.02, -1.05, t), THREE.MathUtils.lerp(0.45, 1.4, t), 0);
    if (a > 2.1) { camBase.z += (a - 2.1) * 0.6; }
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    frame(w, h);
    if (composer) { composer.setSize(w, h); bloom.setSize(w / 2, h / 2); }
  }
  resize();
  window.addEventListener('resize', resize);

  // distância em que a tela preenche toda a viewport
  function fillDistance() {
    const vf = THREE.MathUtils.degToRad(32);
    const byH = dims.ah / 2 / Math.tan(vf / 2);
    const byW = dims.aw / 2 / (Math.tan(vf / 2) * camera.aspect);
    return Math.min(byH, byW) * 0.92;
  }

  const tmpCam = new THREE.Vector3(), tmpLook = new THREE.Vector3();
  function placeCamera() {
    const e = easeInOut(scrollP);
    tmpCam.copy(camBase);
    tmpCam.x += pointer.sx * 0.18 * (1 - e);
    tmpCam.y += pointer.sy * 0.1 * (1 - e);
    const end = new THREE.Vector3(screenCenter.x, screenCenter.y, fillDistance());
    tmpCam.lerp(end, e);
    tmpLook.copy(lookBase).lerp(screenCenter, Math.min(1, e * 1.4));
    camera.fov = THREE.MathUtils.lerp(baseFov, 32, e);
    camera.position.copy(tmpCam);
    camera.lookAt(tmpLook);
    camera.updateProjectionMatrix();
  }

  // --- interação ---------------------------------------------------------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let drawMode = !coarse; // no celular só desenha após tocar em "Escrever"
  const activeIds = new Set();

  function hitUV(ev) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(screen, false)[0];
    return hit ? hit.uv : null;
  }

  function screenToWorld(u, v, out = new THREE.Vector3()) {
    out.set((u - 0.5) * dims.aw, (v - 0.5) * dims.ah + sy, 0.0016);
    return lousa.localToWorld(out);
  }

  canvas.addEventListener('pointermove', (ev) => {
    if (ev.pointerType === 'mouse') {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
    }
    if (board.power < 1 || scrollP > 0.15) return;
    const uv = hitUV(ev);
    if (ev.pointerType === 'mouse') {
      board.hover(uv ? uv.x : null, uv ? uv.y : null);
      canvas.style.cursor = uv ? 'none' : '';
      if (uv) { penTarget.pos.copy(screenToWorld(uv.x, uv.y)); penTarget.docked = false; }
      else penTarget.docked = true;
    }
    if (uv && activeIds.has(ev.pointerId)) board.pointerMove(ev.pointerId, uv.x, uv.y);
  });

  canvas.addEventListener('pointerdown', (ev) => {
    if (board.power < 1 || scrollP > 0.15) return;
    const uv = hitUV(ev);
    if (!uv) return;
    if (!drawMode) { const [x, y] = board.toPx(uv.x, uv.y); board.addRipple(x, y); return; }
    stopDemo();
    if (board.pointerDown(ev.pointerId, uv.x, uv.y)) {
      activeIds.add(ev.pointerId);
      canvas.setPointerCapture(ev.pointerId);
    }
    pressing = true;
  });
  const up = (ev) => { activeIds.delete(ev.pointerId); board.pointerUp(ev.pointerId); pressing = activeIds.size > 0; };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', (ev) => {
    if (ev.pointerType === 'mouse') { board.hover(null); penTarget.docked = true; canvas.style.cursor = ''; }
  });
  let pressing = false;

  // --- boot (liga a tela) ---------------------------------------------------
  const state = { power: 0, boot: 0, demo: 0, room: 0 };
  let demoTween = null;
  function stopDemo() {
    if (demoTween) { demoTween.kill(); demoTween = null; }
    if (board.demoProgress < 1) board.demoProgress = 1;
  }

  function boot() {
    const gsap = window.gsap;
    if (reduced || !gsap) {
      Object.assign(state, { power: 1, boot: 1, room: 1 });
      board.demoProgress = 1;
      onBooted();
      return;
    }
    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(state, { boot: 1, duration: 1.15, ease: 'power2.inOut' })
      .to(state, { power: 1, duration: 0.9, ease: 'power3.out' }, '+=0.15')
      .to(state, { room: 1, duration: 1.4, ease: 'power2.out' }, '<')
      .add(() => onBooted(), '<0.2')
      .add(() => {
        demoTween = gsap.to(board, { demoProgress: 1, duration: 2.4, ease: 'none', onUpdate: () => { board.dirty = true; } });
      }, '+=0.1');
  }

  // --- loop ---------------------------------------------------------------
  const clock = new THREE.Clock();
  let running = true, rafId = 0, last = 0;
  const qOff = new THREE.Color(0xff3a24), qOn = new THREE.Color(0x00c1dd);
  const penQuat = new THREE.Quaternion(), tmpQ = new THREE.Quaternion();
  const e1 = new THREE.Euler();

  function tick() {
    rafId = requestAnimationFrame(tick);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3);
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);

    board.boot = state.boot;
    board.power = state.power;
    const flicker = state.power < 1 ? 1 + Math.sin(t * 90) * 0.04 * state.power : 1;
    sMat.emissiveIntensity = 0.02 + state.power * 1.0 * flicker + (state.boot > 0 ? 0.6 * (1 - state.power) : 0);
    screenLight.intensity = state.power * 7.5 * flicker;
    halo.material.opacity = state.power * 0.6;
    dust.material.opacity = state.room * 0.5;
    rim.intensity = state.room * 0.6;
    led.material.color.copy(qOff).lerp(qOn, state.power);

    // poeira flutuando
    const pa = dust.geometry.attributes.position;
    for (let i = 0; i < dustCount; i++) {
      const s = dseed[i];
      pa.array[i * 3] += Math.sin(t * 0.2 + s) * 0.0006;
      pa.array[i * 3 + 1] += 0.0009 + Math.cos(t * 0.3 + s) * 0.0004;
      if (pa.array[i * 3 + 1] > 2.9) pa.array[i * 3 + 1] = 0.15;
    }
    pa.needsUpdate = true;

    // demonstração: a caneta acompanha a escrita automática
    if (board.demoProgress > 0 && board.demoProgress < 1 && !board.demoHidden) {
      const p = board.demoProgress;
      const x = 540 + (1700 - 540) * p;
      const y = 470 + Math.sin(p * 64) * 46 + (p > 0.8 ? (p - 0.8) * 900 : 0);
      penTarget.pos.copy(screenToWorld(x / board.w, 1 - y / board.h));
      penTarget.docked = false;
      penTarget.demo = true;
    } else if (penTarget.demo) {
      penTarget.demo = false;
      penTarget.docked = true;
    }

    // caneta: encosta na tela quando pressionando, descansa na lateral quando ociosa
    const target = penTarget.docked ? dock : penTarget.pos;
    const lift = penTarget.docked ? 0 : (pressing || penTarget.demo ? 0.002 : 0.035);
    tmpCam.copy(target); tmpCam.z += lift;
    pen.position.lerp(tmpCam, Math.min(1, dt * (penTarget.docked ? 6 : 14)));
    if (penTarget.docked) e1.set(0, 0, 0);
    else e1.set(1.05, 0, -0.38 + pointer.sx * 0.08);
    tmpQ.setFromEuler(e1);
    penQuat.slerp(tmpQ, Math.min(1, dt * 8));
    pen.quaternion.copy(penQuat);
    pen.visible = state.room > 0.05;

    board.update(dt);
    placeCamera();
    if (composer) composer.render(); else renderer.render(scene, camera);
  }
  tick();

  return {
    boot,
    setScroll(p) { scrollP = p; },
    setRunning(v) { if (v && !running) clock.getDelta(); running = v; },
    setDrawMode(v) {
      drawMode = v;
      canvas.style.touchAction = v ? 'none' : 'pan-y';
      if (v) { board.hint = 'Use até 20 dedos ao mesmo tempo'; board.userDrew = false; board.dirty = true; stopDemo(); }
    },
    clear() { board.clear(); },
    get board() { return board; },
    dispose() { cancelAnimationFrame(rafId); renderer.dispose(); },
  };
}

function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

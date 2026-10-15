// Conteúdo das telas: tudo desenhado em <canvas> e usado como textura nas lousas 3D.
import * as THREE from 'three';

export const UI = {
  bg: '#F2F6F7',
  grid: '#CCD8DC',
  ink: '#1E2427',
  cyan: '#00C1DD',
  graphite: '#343436',
  ir: '#FF4632',
  green: '#1FA36B',
  font: '"Archivo", "Segoe UI", system-ui, sans-serif',
  hand: '"Caveat", "Segoe Print", cursive',
};

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function canvasTexture(canvas, anisotropy = 8) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
}

// O "Q" da marca: um botão de power com o ponto de toque.
// progress 0..1 desenha o anel, depois a haste e por fim o ponto.
export function drawQ(ctx, cx, cy, r, { color = UI.cyan, lw = r * 0.34, progress = 1 } = {}) {
  const gap = 0.5;
  const a0 = -Math.PI / 2 + gap;
  const a1 = -Math.PI / 2 - gap + Math.PI * 2;
  const p1 = Math.min(1, progress / 0.6);
  const p2 = clamp01((progress - 0.45) / 0.35);
  const p3 = clamp01((progress - 0.78) / 0.22);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  if (p1 > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a0 + (a1 - a0) * p1);
    ctx.stroke();
  }
  if (p2 > 0) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.12);
    ctx.lineTo(cx, cy - r * 1.12 + r * 0.98 * p2);
    ctx.stroke();
  }
  if (p3 > 0) {
    ctx.beginPath();
    ctx.arc(cx + r * 1.02, cy + r * 1.02, lw * 0.6 * easeOutBack(p3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Logo pequeno para o rodapé das telas (bezel)
export function drawWordmark(ctx, x, y, h, { color = '#9aa3a7', q = UI.cyan } = {}) {
  const r = h * 0.36;
  drawQ(ctx, x + r + h * 0.08, y + h * 0.5, r, { color: q, lw: r * 0.36 });
  ctx.fillStyle = color;
  ctx.font = `800 ${h * 0.92}px ${UI.font}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('ualipix', x + r * 2 + h * 0.3, y + h * 0.56);
}

export function dotGrid(ctx, w, h, step, color, r = 2.2, bg = UI.bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  for (let y = step; y < h; y += step) {
    for (let x = step; x < w; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function shadowCard(ctx, x, y, w, h, r, fill = '#fff') {
  ctx.save();
  ctx.shadowColor = 'rgba(20,40,48,0.14)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

// Ícones simples da barra de ferramentas
function icon(ctx, name, cx, cy, s, color) {
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = s * 0.11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.translate(cx, cy);
  if (name === 'pen') {
    ctx.rotate(-Math.PI / 4);
    roundRect(ctx, -s * 0.13, -s * 0.42, s * 0.26, s * 0.62, s * 0.06); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.13, s * 0.2); ctx.lineTo(0, s * 0.44); ctx.lineTo(s * 0.13, s * 0.2); ctx.stroke();
  } else if (name === 'marker') {
    ctx.rotate(-Math.PI / 4);
    roundRect(ctx, -s * 0.18, -s * 0.42, s * 0.36, s * 0.56, s * 0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.12, s * 0.14); ctx.lineTo(-s * 0.08, s * 0.4); ctx.lineTo(s * 0.12, s * 0.32); ctx.lineTo(s * 0.12, s * 0.14); ctx.stroke();
  } else if (name === 'shape') {
    ctx.strokeRect(-s * 0.36, -s * 0.06, s * 0.4, s * 0.4);
    ctx.beginPath(); ctx.arc(s * 0.12, -s * 0.12, s * 0.24, 0, Math.PI * 2); ctx.stroke();
  } else if (name === 'clear') {
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.24); ctx.lineTo(s * 0.3, -s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.36); ctx.lineTo(s * 0.1, -s * 0.36); ctx.stroke();
    roundRect(ctx, -s * 0.22, -s * 0.16, s * 0.44, s * 0.52, s * 0.06); ctx.stroke();
  } else if (name === 'qr') {
    const q = s * 0.17;
    [[-1, -1], [1, -1], [-1, 1]].forEach(([a, b]) => { ctx.strokeRect(a * q * 1.25 - q * 0.7, b * q * 1.25 - q * 0.7, q * 1.4, q * 1.4); });
    ctx.fillRect(q * 0.6, q * 0.6, q * 0.8, q * 0.8);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Tela do hero: um quadro interativo onde o visitante escreve de verdade.
// ---------------------------------------------------------------------------
export class WhiteboardScreen {
  constructor({ width = 2048, height = 1152, hint = 'Experimente: escreva na tela' } = {}) {
    this.w = width; this.h = height;
    this.canvas = makeCanvas(width, height);
    this.ctx = this.canvas.getContext('2d');
    this.base = makeCanvas(width, height);
    this.ink = makeCanvas(width, height);
    this.inkCtx = this.ink.getContext('2d');
    this.demo = makeCanvas(width, height);
    this.texture = canvasTexture(this.canvas, 8);
    this.hint = hint;
    this.colors = [UI.ink, UI.cyan, UI.ir, UI.green];
    this.color = UI.ink;
    this.tool = 'pen';
    this.ripples = [];
    this.strokes = new Map();
    this.power = 0;      // 0 desligada .. 1 ligada
    this.boot = 0;       // progresso do desenho do Q de boot
    this.demoProgress = 0;
    this.userDrew = false;
    this.hintAlpha = 0;
    this.dirty = true;
    this.regions = [];
    this.drawBase();
    this.drawDemo();
  }

  drawBase() {
    const { w, h } = this;
    const ctx = this.base.getContext('2d');
    dotGrid(ctx, w, h, 48, UI.grid, 2.1);

    // barra superior
    drawQ(ctx, 78, 70, 20, { lw: 7.5 });
    ctx.fillStyle = UI.graphite;
    ctx.font = `600 30px ${UI.font}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('Quadro 1', 124, 72);
    ctx.fillStyle = '#7d898e';
    ctx.font = `500 26px ${UI.font}`;
    ctx.fillText('Aula de quinta-feira', 262, 72);

    shadowCard(ctx, w - 330, 38, 286, 68, 34);
    icon(ctx, 'qr', w - 290, 72, 44, UI.graphite);
    ctx.fillStyle = UI.graphite;
    ctx.font = `600 26px ${UI.font}`;
    ctx.fillText('Compartilhar', w - 252, 73);

    // barra de ferramentas lateral
    const tx = 40, ty = h / 2 - 330, tw = 104, th = 660;
    shadowCard(ctx, tx, ty, tw, th, 52);
    this.regions = [];
    const tools = ['pen', 'marker', 'shape', 'clear'];
    tools.forEach((name, i) => {
      const cy = ty + 70 + i * 104;
      this.regions.push({ kind: 'tool', name, x: tx, y: cy - 48, w: tw, h: 96, cx: tx + tw / 2, cy });
    });
    this.colors.forEach((c, i) => {
      const cy = ty + 70 + 4 * 104 + 6 + i * 52;
      this.regions.push({ kind: 'color', color: c, x: tx, y: cy - 24, w: tw, h: 48, cx: tx + tw / 2, cy });
    });

    // rodapé
    ctx.fillStyle = '#93a0a5';
    ctx.font = `500 24px ${UI.font}`;
    ctx.textAlign = 'right';
    ctx.fillText('1 / 3', w - 52, h - 52);
    ctx.textAlign = 'left';
  }

  drawToolbarState(ctx) {
    for (const r of this.regions) {
      if (r.kind === 'tool') {
        const active = r.name === this.tool;
        if (active) {
          ctx.fillStyle = 'rgba(0,193,221,0.16)';
          ctx.beginPath(); ctx.arc(r.cx, r.cy, 38, 0, Math.PI * 2); ctx.fill();
        }
        icon(ctx, r.name, r.cx, r.cy, 46, active ? '#0590a6' : UI.graphite);
      } else {
        const active = r.color === this.color;
        ctx.fillStyle = r.color;
        ctx.beginPath(); ctx.arc(r.cx, r.cy, active ? 15 : 12, 0, Math.PI * 2); ctx.fill();
        if (active) {
          ctx.strokeStyle = r.color; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(r.cx, r.cy, 22, 0, Math.PI * 2); ctx.stroke();
        }
      }
    }
  }

  drawDemo() {
    const ctx = this.demo.getContext('2d');
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = UI.ink;
    ctx.font = `700 196px ${UI.hand}`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Escreva aqui', 560, 560);
    // sublinhado
    ctx.strokeStyle = UI.cyan; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(570, 618);
    ctx.bezierCurveTo(860, 590, 1180, 640, 1490, 600);
    ctx.stroke();
    // seta
    ctx.strokeStyle = UI.ink; ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(1560, 470); ctx.bezierCurveTo(1660, 520, 1680, 640, 1610, 760);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1572, 712); ctx.lineTo(1608, 766); ctx.lineTo(1664, 735);
    ctx.stroke();
  }

  // --- interação --------------------------------------------------------
  // u,v em 0..1 (origem no canto inferior esquerdo, convenção do three)
  toPx(u, v) { return [u * this.w, (1 - v) * this.h]; }

  hitToolbar(px, py) {
    for (const r of this.regions) {
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return r;
    }
    return null;
  }

  pointerDown(id, u, v) {
    const [x, y] = this.toPx(u, v);
    this.addRipple(x, y);
    const hit = this.hitToolbar(x, y);
    if (hit) {
      if (hit.kind === 'color') { this.color = hit.color; if (this.tool === 'clear') this.tool = 'pen'; }
      else if (hit.name === 'clear') { this.clear(); }
      else this.tool = hit.name;
      this.dirty = true;
      return false;
    }
    this.strokes.set(id, { x, y, lx: x, ly: y });
    this.userDrew = true;
    return true;
  }

  pointerMove(id, u, v) {
    const s = this.strokes.get(id);
    if (!s) return;
    const [x, y] = this.toPx(u, v);
    const ctx = this.inkCtx;
    const mx = (s.x + x) / 2, my = (s.y + y) / 2;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (this.tool === 'marker') {
      ctx.globalAlpha = 0.32; ctx.lineWidth = 44; ctx.strokeStyle = this.color === UI.ink ? '#F2D21B' : this.color;
    } else if (this.tool === 'shape') {
      ctx.lineWidth = 6; ctx.strokeStyle = this.color; ctx.setLineDash([2, 18]);
    } else {
      ctx.lineWidth = 9; ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.moveTo(s.lx, s.ly);
    ctx.quadraticCurveTo(s.x, s.y, mx, my);
    ctx.stroke();
    ctx.restore();
    s.lx = mx; s.ly = my; s.x = x; s.y = y;
    this.dirty = true;
  }

  pointerUp(id) { this.strokes.delete(id); }

  hover(u, v) {
    if (u == null) { this.cursor = null; this.dirty = true; return; }
    this.cursor = this.toPx(u, v);
    this.dirty = true;
  }

  addRipple(x, y) {
    this.ripples.push({ x, y, t: 0 });
    this.dirty = true;
  }

  clear() {
    this.inkCtx.clearRect(0, 0, this.w, this.h);
    this.demoProgress = 1.01; // não refaz a demonstração
    this.demoHidden = true;
    this.dirty = true;
  }

  get touches() { return this.strokes.size; }

  // --- composição -------------------------------------------------------
  update(dt) {
    const { ctx, w, h } = this;
    if (this.ripples.length) this.dirty = true;
    if (this.power > 0 && this.power < 1) this.dirty = true;
    if (this.boot > 0 && this.power === 0) this.dirty = true;

    const targetHint = this.power >= 1 && this.demoProgress >= 1 && !this.userDrew ? 1 : 0;
    if (Math.abs(this.hintAlpha - targetHint) > 0.01) {
      this.hintAlpha += (targetHint - this.hintAlpha) * Math.min(1, dt * 4);
      this.dirty = true;
    }
    if (!this.dirty) return false;

    // fundo apagado com o Q de boot
    ctx.fillStyle = '#020405';
    ctx.fillRect(0, 0, w, h);
    if (this.power < 1 && this.boot > 0) {
      ctx.save();
      ctx.globalAlpha = 1 - this.power;
      ctx.shadowColor = UI.cyan; ctx.shadowBlur = 40;
      drawQ(ctx, w / 2, h / 2, 92, { progress: this.boot, lw: 30 });
      ctx.restore();
    }

    if (this.power > 0) {
      ctx.save();
      ctx.globalAlpha = this.power;
      ctx.drawImage(this.base, 0, 0);
      this.drawToolbarState(ctx);

      if (!this.demoHidden && this.demoProgress > 0) {
        const p = Math.min(1, this.demoProgress);
        ctx.save();
        ctx.beginPath();
        // revela da esquerda para a direita, como uma mão escrevendo
        const x0 = 540, x1 = 1700;
        ctx.rect(0, 0, x0 + (x1 - x0) * p, h);
        ctx.clip();
        ctx.drawImage(this.demo, 0, 0);
        ctx.restore();
      }
      ctx.drawImage(this.ink, 0, 0);

      if (this.hintAlpha > 0.01) {
        ctx.globalAlpha = this.power * this.hintAlpha;
        ctx.font = `600 30px ${UI.font}`;
        const tw = ctx.measureText(this.hint).width;
        const bw = tw + 120, bx = w / 2 - bw / 2, by = h - 140;
        shadowCard(ctx, bx, by, bw, 72, 36, UI.graphite);
        ctx.fillStyle = UI.cyan;
        ctx.beginPath(); ctx.arc(bx + 44, by + 36, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.hint, bx + 72, by + 38);
        ctx.globalAlpha = this.power;
      }

      // ondas de toque
      for (const r of this.ripples) {
        r.t += dt;
        const k = r.t / 0.7;
        ctx.strokeStyle = `rgba(0,193,221,${(1 - k) * 0.9})`;
        ctx.lineWidth = 6 * (1 - k) + 1;
        ctx.beginPath(); ctx.arc(r.x, r.y, 16 + k * 90, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(0,193,221,${(1 - k) * 0.25})`;
        ctx.beginPath(); ctx.arc(r.x, r.y, 14, 0, Math.PI * 2); ctx.fill();
      }
      this.ripples = this.ripples.filter((r) => r.t < 0.7);

      if (this.cursor && !this.strokes.size) {
        const [cx, cy] = this.cursor;
        ctx.strokeStyle = 'rgba(0,193,221,0.85)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.stroke();
      }
      if (this.strokes.size > 1) {
        const label = `${this.strokes.size} de 20 toques simultâneos`;
        ctx.font = `600 28px ${UI.font}`;
        const tw = ctx.measureText(label).width;
        shadowCard(ctx, w - tw - 100, 130, tw + 60, 60, 30, UI.cyan);
        ctx.fillStyle = '#062a31';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, w - tw - 70, 161);
      }
      ctx.restore();
    }

    this.texture.needsUpdate = true;
    this.dirty = false;
    return true;
  }
}

// ---------------------------------------------------------------------------
// Telas estáticas (usadas nos renders e nos vídeos)
// ---------------------------------------------------------------------------
export function drawDashboard(ctx, w, h, { highlight = -1, t = 1 } = {}) {
  ctx.fillStyle = '#0F1C22';
  ctx.fillRect(0, 0, w, h);
  const s = w / 1920;
  ctx.fillStyle = '#E8F1F3';
  ctx.font = `700 ${56 * s}px ${UI.font}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Resultados do trimestre', 110 * s, 170 * s);
  ctx.fillStyle = '#7F9BA4';
  ctx.font = `500 ${30 * s}px ${UI.font}`;
  ctx.fillText('Vendas por região, em milhares', 110 * s, 222 * s);
  const vals = [0.48, 0.66, 0.54, 0.86, 0.72, 0.58];
  const labels = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul', 'Exterior'];
  const bx = 120 * s, by = h - 170 * s, bw = 170 * s, gap = 100 * s, maxH = 560 * s;
  ctx.strokeStyle = '#25414A'; ctx.lineWidth = 2 * s;
  for (let i = 0; i <= 4; i++) {
    const y = by - (maxH * i) / 4;
    ctx.beginPath(); ctx.moveTo(bx - 20 * s, y); ctx.lineTo(w - 120 * s, y); ctx.stroke();
  }
  vals.forEach((v, i) => {
    const x = bx + i * (bw + gap);
    const hh = maxH * v * t;
    ctx.fillStyle = i === highlight ? UI.cyan : '#3B5A63';
    roundRect(ctx, x, by - hh, bw, hh, 10 * s); ctx.fill();
    ctx.fillStyle = '#8FA9B1';
    ctx.font = `500 ${26 * s}px ${UI.font}`;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + bw / 2, by + 50 * s);
    ctx.textAlign = 'left';
  });
}

export function drawFractionLesson(ctx, w, h, { t = 1 } = {}) {
  const s = w / 1920;
  dotGrid(ctx, w, h, 44 * s, '#D5DFE2', 1.8 * s);
  ctx.fillStyle = UI.graphite;
  ctx.font = `800 ${70 * s}px ${UI.font}`;
  ctx.fillText('Frações', 150 * s, 190 * s);
  ctx.fillStyle = '#6E7E84';
  ctx.font = `500 ${32 * s}px ${UI.font}`;
  ctx.fillText('Matemática  |  6º ano', 150 * s, 246 * s);
  drawQ(ctx, w - 150 * s, 160 * s, 26 * s, { lw: 9 * s });
  // pizza
  const cx = 600 * s, cy = 640 * s, r = 280 * s;
  const parts = [[0, 0.5, UI.cyan], [0.5, 0.75, '#F2B33D'], [0.75, 1, '#E7EEF0']];
  parts.forEach(([a, b, c]) => {
    const e = a + (b - a) * Math.min(1, t * 1.2);
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, -Math.PI / 2 + a * Math.PI * 2, -Math.PI / 2 + e * Math.PI * 2);
    ctx.closePath(); ctx.fill();
  });
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 8 * s;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = UI.graphite;
  ctx.font = `800 ${120 * s}px ${UI.font}`;
  ctx.fillText('½ + ¼ = ¾', 1040 * s, 600 * s);
  ctx.fillStyle = '#6E7E84';
  ctx.font = `500 ${36 * s}px ${UI.font}`;
  ctx.fillText('Toque nas fatias para montar a fração', 1046 * s, 690 * s);
  // botões de atividade
  ['Atividade 1', 'Atividade 2', 'Quiz com IA'].forEach((l, i) => {
    const x = 1046 * s + i * 250 * s, y = 760 * s;
    ctx.fillStyle = i === 2 ? UI.cyan : '#fff';
    roundRect(ctx, x, y, 228 * s, 76 * s, 38 * s); ctx.fill();
    ctx.fillStyle = i === 2 ? '#062a31' : UI.graphite;
    ctx.font = `600 ${28 * s}px ${UI.font}`;
    ctx.textAlign = 'center';
    ctx.fillText(l, x + 114 * s, y + 48 * s);
    ctx.textAlign = 'left';
  });
}

export function drawKiosk(ctx, w, h) {
  const s = w / 1920;
  ctx.fillStyle = '#F2F6F7'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = UI.graphite;
  ctx.font = `800 ${86 * s}px ${UI.font}`;
  ctx.fillText('Bem-vindo', 130 * s, 230 * s);
  ctx.fillStyle = '#6E7E84';
  ctx.font = `500 ${40 * s}px ${UI.font}`;
  ctx.fillText('Toque para fazer seu check-in', 134 * s, 300 * s);
  const items = [['Check-in', UI.cyan], ['Retirar senha', '#fff'], ['Mapa do evento', '#fff'], ['Cadastro', '#fff']];
  items.forEach(([l, c], i) => {
    const x = 130 * s + (i % 2) * 840 * s, y = 400 * s + Math.floor(i / 2) * 290 * s;
    ctx.fillStyle = c; roundRect(ctx, x, y, 800 * s, 250 * s, 24 * s); ctx.fill();
    ctx.fillStyle = c === UI.cyan ? '#062a31' : UI.graphite;
    ctx.font = `700 ${54 * s}px ${UI.font}`;
    ctx.fillText(l, x + 60 * s, y + 145 * s);
  });
}

export function drawFlipNotes(ctx, w, h) {
  // w < h: tela em retrato
  const s = w / 1080;
  dotGrid(ctx, w, h, 40 * s, '#D3DDE0', 1.6 * s);
  ctx.fillStyle = UI.graphite;
  ctx.font = `800 ${72 * s}px ${UI.font}`;
  ctx.fillText('Sprint 14', 90 * s, 170 * s);
  const notes = [['#FFE58A', 'Onboarding'], ['#BDEFF7', 'Novo app'], ['#FFC9B9', 'Pesquisa'], ['#C9F0D8', 'Lançamento'], ['#FFE58A', 'Métricas'], ['#BDEFF7', 'Treinar time']];
  notes.forEach(([c, l], i) => {
    const x = 90 * s + (i % 2) * 470 * s, y = 270 * s + Math.floor(i / 2) * 420 * s;
    ctx.save(); ctx.translate(x + 190 * s, y + 170 * s); ctx.rotate(((i * 37) % 7 - 3) * 0.01);
    ctx.fillStyle = c; ctx.fillRect(-190 * s, -170 * s, 380 * s, 340 * s);
    ctx.fillStyle = UI.graphite; ctx.font = `700 ${48 * s}px ${UI.hand}`;
    ctx.fillText(l, -150 * s, -60 * s);
    ctx.restore();
  });
  ctx.strokeStyle = UI.cyan; ctx.lineWidth = 9 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(140 * s, h - 260 * s); ctx.bezierCurveTo(400 * s, h - 340 * s, 650 * s, h - 180 * s, 940 * s, h - 280 * s); ctx.stroke();
}

export function drawProjection(ctx, w, h) {
  const s = w / 1920;
  ctx.fillStyle = '#F4F6F2'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#2E4A57';
  ctx.font = `800 ${80 * s}px ${UI.font}`;
  ctx.fillText('Sistema Solar', 120 * s, 190 * s);
  const planets = [[60, '#F2B33D'], [22, '#9C8F84'], [30, '#E4A35F'], [32, '#3F8FD0'], [26, '#D36A47'], [74, '#D9B38C'], [64, '#E8D29E']];
  let x = 220 * s;
  planets.forEach(([r, c], i) => {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(x, 600 * s, r * s * (i === 0 ? 2.4 : 1.4), 0, Math.PI * 2); ctx.fill();
    x += (i === 0 ? 300 : 210) * s;
  });
  ctx.strokeStyle = UI.ir; ctx.lineWidth = 8 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(220 * s + 300 * s + 630 * s, 600 * s, 90 * s, 80 * s, 0, 0, Math.PI * 2); ctx.stroke();
}

// Subpixels RGB (camada do painel 4K na vista explodida)
export function drawSubpixels(ctx, w, h, cell = 18) {
  ctx.fillStyle = '#05080a'; ctx.fillRect(0, 0, w, h);
  const cols = ['#ff3b30', '#34e36b', '#2e7bff'];
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      for (let k = 0; k < 3; k++) {
        const b = 0.55 + 0.45 * Math.sin((x * 0.013 + y * 0.009) + k);
        ctx.globalAlpha = b;
        ctx.fillStyle = cols[k];
        ctx.fillRect(x + k * (cell / 3) + 1, y + 2, cell / 3 - 2, cell - 4);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function easeOutBack(t) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

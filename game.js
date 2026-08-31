/**
 * EL DESQUITE: BOXEA AL PELÓN 🥊👨‍🦲
 * Un juego arcade interactivo de boxeo con soporte completo para Celulares y PC,
 * físicas elásticas, audio procedural, feedback háptico (vibración),
 * personalización de muñeco y guantes, modo furia y combos.
 */

// Polyfill seguro para roundRect en navegadores antiguos
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === 'number') radii = [radii, radii, radii, radii];
    if (radii.length === 1) radii = [radii[0], radii[0], radii[0], radii[0]];
    if (radii.length === 2) radii = [radii[0], radii[1], radii[0], radii[1]];
    const [tl, tr, br, bl] = radii;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
    return this;
  };
}

// ==========================================
// 1. MOTOR DE AUDIO PROCEDURAL (Web Audio API)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playPunch(type = 'jab', isCrit = false, gloveType = 'classic') {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    if (gloveType === 'rubber_hand') {
      this.playSlapSound(t, isCrit);
      return;
    }
    if (gloveType === 'squeak_hammer') {
      this.playSqueakSound(t, isCrit);
      return;
    }

    // Ruido blanco para el impacto seco (impact noise)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(type === 'uppercut' ? 350 : 600, t);
    noiseFilter.Q.setValueAtTime(2, t);

    const noiseGain = this.ctx.createGain();
    const vol = isCrit ? 0.9 : 0.6;
    noiseGain.gain.setValueAtTime(vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // Oscilador de graves (sub-bass punch)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const startFreq = type === 'uppercut' ? 180 : (type === 'hook' ? 140 : 110);
    const endFreq = 30;

    osc.type = isCrit ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.15);

    oscGain.gain.setValueAtTime(isCrit ? 0.8 : 0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);

    if (isCrit) {
      this.playCritChirp(t);
    }
  }

  playSlapSound(t, isCrit) {
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isCrit ? 0.9 : 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playSqueakSound(t, isCrit) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(1600, t + 0.08);
    osc.frequency.linearRampToValueAtTime(600, t + 0.16);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);
  }

  playCritChirp(t) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playBell() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [0, 0.2, 0.4].forEach((offset) => {
      const time = t + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, time);

      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.6);
    });
  }

  playKoFanfare() {
    if (!this.enabled) return;
    this.init();
    this.playBell();
    const t = this.ctx.currentTime + 0.2;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.8);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.9);
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, t);
    osc1.frequency.setValueAtTime(1318.51, t + 0.08);
    osc2.frequency.setValueAtTime(1318.51, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t + 0.08);
    osc1.stop(t + 0.32);
    osc2.stop(t + 0.32);
  }

  playRageRoar() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.linearRampToValueAtTime(260, t + 0.3);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.8);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.95);
  }
}

// ==========================================
// 2. CATÁLOGO DE ITEMS Y TIENDA
// ==========================================
const SHOP_GLOVES = [
  {
    id: 'classic',
    name: 'Guantes Clásicos',
    desc: 'Los tradicionales de cuero rojo para dar buenos mamporros.',
    icon: '🥊',
    price: 0,
    color: '#ff2a4b',
    critChance: 0.15,
    damageMultiplier: 1.0,
    coinBonus: 1.0,
    unlocked: true
  },
  {
    id: 'fire',
    name: 'Puños de Fuego',
    desc: '¡Queman al muñeco y causan explosiones de chispas!',
    icon: '🔥',
    price: 150,
    color: '#ff6600',
    critChance: 0.30,
    damageMultiplier: 1.4,
    coinBonus: 1.2,
    unlocked: false
  },
  {
    id: 'rubber_hand',
    name: 'Manita Pegajosa',
    desc: '¡Produce un sonoro CACHETADÓN y deforma la cara cómicamente!',
    icon: '🖐️',
    price: 300,
    color: '#00ffcc',
    critChance: 0.25,
    damageMultiplier: 1.2,
    coinBonus: 1.3,
    unlocked: false
  },
  {
    id: 'squeak_hammer',
    name: 'Martillo Chillón',
    desc: 'Martillo de hule de payaso. ¡Saca estrellas gigantes!',
    icon: '🔨',
    price: 500,
    color: '#ff00aa',
    critChance: 0.40,
    damageMultiplier: 1.6,
    coinBonus: 1.5,
    unlocked: false
  },
  {
    id: 'cyber',
    name: 'Nudillos Láser',
    desc: 'Carga cibernética con rayos eléctricos de alto voltaje.',
    icon: '⚡',
    price: 800,
    color: '#00d2ff',
    critChance: 0.50,
    damageMultiplier: 2.0,
    coinBonus: 2.0,
    unlocked: false
  },
  {
    id: 'golden',
    name: 'Guantelete de Oro',
    desc: '¡El guante de los campeones! Genera lluvia de monedas.',
    icon: '👑',
    price: 1500,
    color: '#ffd200',
    critChance: 0.60,
    damageMultiplier: 2.5,
    coinBonus: 3.0,
    unlocked: false
  }
];

const SHOP_ACCESSORIES = [
  {
    id: 'none',
    name: 'Pelón al Natural',
    desc: 'Su calva resplandeciente en todo su esplendor.',
    icon: '👨‍🦲',
    price: 0,
    unlocked: true
  },
  {
    id: 'toupee',
    name: 'Peluquín Elegante',
    desc: 'Peluquín postizo que sale volando cuando le das un buen gancho.',
    icon: '💇‍♂️',
    price: 100,
    unlocked: false
  },
  {
    id: 'glasses',
    name: 'Gafas de Nerd',
    desc: 'Lentes que se van quebrando con los golpes directos a los ojos.',
    icon: '👓',
    price: 200,
    unlocked: false
  },
  {
    id: 'sombrero',
    name: 'Sombrero de Fiesta',
    desc: 'Un sombrero colorido que rebota con cada puñetazo.',
    icon: '🎩',
    price: 350,
    unlocked: false
  },
  {
    id: 'mustache',
    name: 'Bigote Falso',
    desc: 'Un bigote cómico que tiembla cuando le pegas en la boca.',
    icon: '🥸',
    price: 250,
    unlocked: false
  }
];

// ==========================================
// 3. FÍSICAS DEL MUÑECO PELÓN ("EL PELÓN")
// ==========================================
class DummyPhysics {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.baseX = this.canvas.width / 2;
    this.baseY = this.canvas.height * 0.85;

    // Torso spring
    this.torsoX = 0;
    this.torsoY = 0;
    this.torsoVx = 0;
    this.torsoVy = 0;

    // Head spring
    this.headX = 0;
    this.headY = 0;
    this.headVx = 0;
    this.headVy = 0;
    this.headRot = 0;
    this.headVrot = 0;
    this.squashX = 1;
    this.squashY = 1;

    // Toupee / Glasses physics
    this.toupeeDetached = false;
    this.toupeeX = 0;
    this.toupeeY = 0;
    this.toupeeVx = 0;
    this.toupeeVy = 0;
    this.toupeeRot = 0;

    // Damage states (0 to 1)
    this.leftEyeDamage = 0;
    this.rightEyeDamage = 0;
    this.mouthDamage = 0;
    this.bruises = [];
    this.bandaids = [];
    this.bumps = [];

    this.isDizzy = false;
    this.isKO = false;
    this.koTimer = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
  }

  applyHit(impactX, impactY, forceX, forceY, punchType) {
    this.headVx += forceX * 1.6;
    this.headVy += forceY * 1.4;
    this.headVrot += (forceX * 0.008);

    this.torsoVx += forceX * 0.7;
    this.torsoVy += forceY * 0.5;

    if (Math.abs(forceX) > Math.abs(forceY)) {
      this.squashX = 0.82;
      this.squashY = 1.2;
    } else {
      this.squashX = 1.25;
      this.squashY = 0.75;
    }

    // Peluquín volador
    if (!this.toupeeDetached && (punchType === 'uppercut' || Math.abs(forceX) > 20)) {
      if (Math.random() < 0.45) {
        this.toupeeDetached = true;
        this.toupeeX = this.headX;
        this.toupeeY = this.headY - 80;
        this.toupeeVx = forceX * 0.8 + (Math.random() * 6 - 3);
        this.toupeeVy = -15 - Math.random() * 8;
        this.toupeeRot = 0;
      }
    }

    if (impactX < 0) {
      this.leftEyeDamage = Math.min(1, this.leftEyeDamage + 0.15);
    } else {
      this.rightEyeDamage = Math.min(1, this.rightEyeDamage + 0.15);
    }
    if (impactY > 0) {
      this.mouthDamage = Math.min(1, this.mouthDamage + 0.18);
    }

    // Moretones aleatorios
    if (Math.random() < 0.35 && this.bruises.length < 10) {
      this.bruises.push({
        relX: (Math.random() * 90 - 45),
        relY: (Math.random() * 80 - 70),
        r: 10 + Math.random() * 12,
        color: Math.random() > 0.5 ? 'rgba(92, 45, 145, 0.45)' : 'rgba(200, 50, 50, 0.4)'
      });
    }

    // Curitas
    if (Math.random() < 0.2 && this.bandaids.length < 5) {
      this.bandaids.push({
        relX: (Math.random() * 80 - 40),
        relY: (Math.random() * 70 - 60),
        rot: Math.random() * Math.PI
      });
    }

    // Chichón cómico
    if (punchType === 'uppercut' || Math.random() < 0.25) {
      if (this.bumps.length < 3) {
        this.bumps.push({
          relX: (Math.random() * 60 - 30),
          relY: -85,
          h: 0,
          maxH: 20 + Math.random() * 15
        });
      }
    }
  }

  update(dt) {
    this.baseX = this.canvas.width / 2;
    this.baseY = this.canvas.height * 0.85;

    // Resorte Cabeza
    const kHead = 0.09;
    const dHead = 0.86;
    const axHead = -kHead * this.headX;
    const ayHead = -kHead * this.headY;
    const aRotHead = -0.06 * this.headRot;

    this.headVx = (this.headVx + axHead) * dHead;
    this.headVy = (this.headVy + ayHead) * dHead;
    this.headVrot = (this.headVrot + aRotHead) * 0.84;

    this.headX += this.headVx;
    this.headY += this.headVy;
    this.headRot += this.headVrot;

    // Resorte Torso
    const kTorso = 0.06;
    const dTorso = 0.88;
    const axTorso = -kTorso * this.torsoX;
    const ayTorso = -kTorso * this.torsoY;

    this.torsoVx = (this.torsoVx + axTorso) * dTorso;
    this.torsoVy = (this.torsoVy + ayTorso) * dTorso;

    this.torsoX += this.torsoVx;
    this.torsoY += this.torsoVy;

    // Recuperación Squash & Stretch
    this.squashX += (1 - this.squashX) * 0.15;
    this.squashY += (1 - this.squashY) * 0.15;

    // Chichones
    for (let b of this.bumps) {
      if (b.h < b.maxH) b.h += 0.8;
    }

    // Peluquín
    if (this.toupeeDetached) {
      this.toupeeX += this.toupeeVx;
      this.toupeeY += this.toupeeVy;
      this.toupeeVy += 0.7;
      this.toupeeRot += 0.1;
      if (this.toupeeY > 200) {
        this.toupeeDetached = false;
      }
    }

    // Parpadeo
    this.blinkTimer += dt;
    if (this.blinkTimer > 3.5) {
      this.isBlinking = true;
      if (this.blinkTimer > 3.65) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }
  }

  heal() {
    this.leftEyeDamage = 0;
    this.rightEyeDamage = 0;
    this.mouthDamage = 0;
    this.bruises = [];
    this.bandaids = [];
    this.bumps = [];
    this.toupeeDetached = false;
  }
}

// ==========================================
// 4. SISTEMA DE PARTÍCULAS Y TEXTOS
// ==========================================
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.texts = [];
    this.shockwaves = [];
  }

  addSparks(x, y, count = 12, color = '#ffd200') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.03
      });
    }
  }

  addSweat(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI;
      const speed = 5 + Math.random() * 8;
      this.particles.push({
        type: 'sweat',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 4 + Math.random() * 4,
        color: 'rgba(180, 230, 255, 0.9)',
        life: 1.0,
        decay: 0.025
      });
    }
  }

  addTeeth(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI;
      const speed = 6 + Math.random() * 8;
      this.particles.push({
        type: 'tooth',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        rot: 0,
        vRot: (Math.random() - 0.5) * 0.4,
        size: 10,
        color: '#ffffff',
        life: 1.0,
        decay: 0.015
      });
    }
  }

  addCoins(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 6 + Math.random() * 7;
      this.particles.push({
        type: 'coin',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: 0,
        size: 16,
        life: 1.0,
        decay: 0.02
      });
    }
  }

  addComicText(x, y, text, color = '#ffd200', size = 38) {
    this.texts.push({
      x: x + (Math.random() * 40 - 20),
      y: y + (Math.random() * 30 - 15),
      text,
      color,
      size,
      scale: 0.2,
      maxScale: 1.2 + Math.random() * 0.3,
      rot: (Math.random() - 0.5) * 0.4,
      life: 1.0,
      decay: 0.028
    });
  }

  addShockwave(x, y, color = 'rgba(255, 255, 255, 0.8)') {
    this.shockwaves.push({
      x,
      y,
      r: 10,
      maxR: 90,
      color,
      life: 1.0,
      decay: 0.05
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.life -= p.decay;
      if (p.type === 'tooth') p.rot += p.vRot;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      if (t.scale < t.maxScale) {
        t.scale += (t.maxScale - t.scale) * 0.3;
      }
      t.y -= 1.2;
      t.life -= t.decay;
      if (t.life <= 0) this.texts.splice(i, 1);
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.r += (s.maxR - s.r) * 0.25;
      s.life -= s.decay;
      if (s.life <= 0) this.shockwaves.splice(i, 1);
    }
  }

  render(ctx) {
    for (let s of this.shockwaves) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.life;
      ctx.lineWidth = 6 * s.life;
      ctx.stroke();
      ctx.restore();
    }

    for (let p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'sweat') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.6, p.size, Math.atan2(p.vy, p.vx) + Math.PI/2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'tooth') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-4, -6, 8, 12, 3);
        ctx.fill();
        ctx.stroke();
      } else if (p.type === 'coin') {
        ctx.translate(p.x, p.y);
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪙', 0, 0);
      }
      ctx.restore();
    }

    for (let t of this.texts) {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rot);
      ctx.scale(t.scale, t.scale);
      ctx.globalAlpha = Math.max(0, t.life);

      ctx.font = `900 ${t.size}px 'Bangers', cursive, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';
      ctx.strokeText(t.text, 0, 0);

      ctx.fillStyle = t.color;
      ctx.fillText(t.text, 0, 0);

      ctx.restore();
    }
  }
}

// ==========================================
// 5. MOTOR PRINCIPAL DEL JUEGO
// ==========================================
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.sound = new SoundEngine();
    this.dummy = new DummyPhysics(this.canvas);
    this.particles = new ParticleSystem();

    // Estado del juego
    this.score = 0;
    this.coins = parseInt(localStorage.getItem('boxeo_coins')) || 0;
    this.equippedGlove = localStorage.getItem('boxeo_glove') || 'classic';
    this.equippedAccessory = localStorage.getItem('boxeo_accessory') || 'none';

    this.unlockedGloves = JSON.parse(localStorage.getItem('boxeo_unlocked_gloves')) || ['classic'];
    this.unlockedAccessories = JSON.parse(localStorage.getItem('boxeo_unlocked_acc')) || ['none'];

    this.hp = 100;
    this.maxHp = 100;
    this.rage = 0;
    this.isRageMode = false;
    this.rageTimer = 0;

    this.combo = 0;
    this.maxCombo = 0;
    this.comboTimer = 0;

    this.screenShake = 0;
    this.screenShakeX = 0;
    this.screenShakeY = 0;

    // Posiciones de los guantes del jugador
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
    this.leftGlove = { x: window.innerWidth * 0.35, y: window.innerHeight * 0.7, punchProgress: 0, punching: false, targetX: 0, targetY: 0 };
    this.rightGlove = { x: window.innerWidth * 0.65, y: window.innerHeight * 0.7, punchProgress: 0, punching: false, targetX: 0, targetY: 0 };

    // Modos de Juego
    this.mode = 'free';
    this.timeRemaining = 30;
    this.timerInterval = null;
    this.totalDamageInflicted = 0;
    this.koCount = 0;

    this.lastTime = performance.now();

    this.initCanvasSize();
    this.initEvents();
    this.initShop();
    this.updateHUD();

    // Iniciar loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  // Vibración háptica en celulares
  vibrate(pattern = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  initCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.dummy.baseX = this.canvas.width / 2;
    this.dummy.baseY = this.canvas.height * 0.85;
  }

  initEvents() {
    window.addEventListener('resize', () => this.initCanvasSize());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.initCanvasSize(), 150);
    });

    // Movimiento del cursor y clics en PC
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.handlePointerPunch(e.clientX, e.clientY, e.button === 2 ? 'right' : 'left');
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Soporte táctil móvil multitáctil (Multi-Touch)
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.sound.init(); // Desbloquear audio en iOS/Android
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        this.mouse.x = touch.clientX;
        this.mouse.y = touch.clientY;
        const headPos = this.getDummyHeadScreenPos();
        const hand = touch.clientX < headPos.x ? 'left' : 'right';
        this.handlePointerPunch(touch.clientX, touch.clientY, hand);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    // Botonera táctil dedicada para celulares
    const btnTouchLeft = document.getElementById('touch-btn-left');
    const btnTouchRight = document.getElementById('touch-btn-right');
    const btnTouchUppercut = document.getElementById('touch-btn-uppercut');
    const btnTouchRage = document.getElementById('touch-btn-rage');

    if (btnTouchLeft) {
      btnTouchLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sound.init();
        this.performPunch('left', 'hook');
      }, { passive: false });
      btnTouchLeft.addEventListener('click', () => this.performPunch('left', 'hook'));
    }

    if (btnTouchRight) {
      btnTouchRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sound.init();
        this.performPunch('right', 'hook');
      }, { passive: false });
      btnTouchRight.addEventListener('click', () => this.performPunch('right', 'hook'));
    }

    if (btnTouchUppercut) {
      btnTouchUppercut.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sound.init();
        this.performPunch(Math.random() > 0.5 ? 'left' : 'right', 'uppercut');
      }, { passive: false });
      btnTouchUppercut.addEventListener('click', () => this.performPunch(Math.random() > 0.5 ? 'left' : 'right', 'uppercut'));
    }

    if (btnTouchRage) {
      btnTouchRage.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sound.init();
        this.activateRageMode();
      }, { passive: false });
      btnTouchRage.addEventListener('click', () => this.activateRageMode());
    }

    // Teclas de atajo en teclado
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') {
        this.performPunch('left', 'hook');
      } else if (key === 'd' || key === 'arrowright') {
        this.performPunch('right', 'hook');
      } else if (key === 'w' || key === 'arrowup') {
        this.performPunch(Math.random() > 0.5 ? 'left' : 'right', 'uppercut');
      } else if (key === 's' || key === 'arrowdown') {
        this.performPunch(Math.random() > 0.5 ? 'left' : 'right', 'body');
      } else if (key === ' ' || key === 'space') {
        e.preventDefault();
        this.activateRageMode();
      }
    });

    // Botones del HUD
    document.getElementById('btn-start-game').addEventListener('click', () => {
      document.getElementById('start-overlay').classList.add('hidden');
      this.sound.init();
      this.sound.playBell();
      this.vibrate([30, 40, 50]);
      this.setBanner('¡SUENA LA CAMPANA! 🥊 ¡DALE AL PELÓN!');
    });

    document.getElementById('btn-sound').addEventListener('click', () => {
      const on = this.sound.toggle();
      document.getElementById('sound-icon').textContent = on ? '🔊' : '🔇';
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      this.dummy.heal();
      this.hp = this.maxHp;
      this.updateHUD();
      this.setBanner('¡Pelón restaurado y listo para más golpes!');
      this.sound.playWhoosh();
      this.vibrate(20);
    });

    document.getElementById('btn-shop').addEventListener('click', () => {
      this.openShop();
    });

    document.getElementById('btn-close-shop').addEventListener('click', () => {
      document.getElementById('shop-modal').classList.add('hidden');
    });

    document.getElementById('btn-mode').addEventListener('click', () => {
      this.toggleMode();
    });

    document.getElementById('btn-play-again').addEventListener('click', () => {
      document.getElementById('results-modal').classList.add('hidden');
      this.startAttackMode();
    });

    // Botón de Pantalla Completa
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Tabs de la tienda
    document.querySelectorAll('.shop-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.shop-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      });
    });
  }

  handlePointerPunch(clientX, clientY, preferredHand = 'left') {
    const headPos = this.getDummyHeadScreenPos();
    const dy = clientY - headPos.y;
    const dx = clientX - headPos.x;

    let punchType = 'jab';
    if (dy > 30) {
      punchType = 'uppercut';
    } else if (Math.abs(dx) > 40) {
      punchType = 'hook';
    }

    const hand = preferredHand === 'right' || clientX > headPos.x ? 'right' : 'left';
    this.performPunch(hand, punchType, clientX, clientY);
  }

  getDummyHeadScreenPos() {
    const baseX = this.dummy.baseX;
    const baseY = this.dummy.baseY;
    const torsoScreenX = baseX + this.dummy.torsoX;
    const torsoScreenY = baseY - 160 + this.dummy.torsoY;
    return {
      x: torsoScreenX + this.dummy.headX,
      y: torsoScreenY - 140 + this.dummy.headY
    };
  }

  performPunch(hand = 'left', punchType = 'jab', targetX = null, targetY = null) {
    const glove = hand === 'left' ? this.leftGlove : this.rightGlove;
    const headPos = this.getDummyHeadScreenPos();

    glove.punching = true;
    glove.punchProgress = 0;
    glove.targetX = targetX !== null ? targetX : (headPos.x + (hand === 'left' ? -25 : 25));
    glove.targetY = targetY !== null ? targetY : (punchType === 'uppercut' ? headPos.y + 30 : headPos.y);

    // Calcular daño y críticos
    const activeGloveData = SHOP_GLOVES.find(g => g.id === this.equippedGlove) || SHOP_GLOVES[0];
    const isCrit = Math.random() < activeGloveData.critChance || this.isRageMode;
    let baseDmg = punchType === 'uppercut' ? 22 : (punchType === 'hook' ? 16 : 10);
    if (this.isRageMode) baseDmg *= 2.2;
    if (isCrit) baseDmg *= 1.8;
    baseDmg *= activeGloveData.damageMultiplier;

    const finalDamage = Math.round(baseDmg);
    this.totalDamageInflicted += finalDamage;

    // Físicas
    let forceX = hand === 'left' ? (15 + Math.random() * 10) : (-15 - Math.random() * 10);
    let forceY = punchType === 'uppercut' ? -28 : (punchType === 'body' ? 12 : -8);
    if (this.isRageMode) {
      forceX *= 1.5;
      forceY *= 1.4;
    }

    this.dummy.applyHit(hand === 'left' ? -1 : 1, forceY, forceX, forceY, punchType);
    this.sound.playPunch(punchType, isCrit, this.equippedGlove);

    // Vibración
    this.vibrate(isCrit ? [25, 10, 25] : 15);

    // Sacudida de pantalla
    this.screenShake = isCrit ? 18 : 8;

    // Partículas
    const hitX = glove.targetX;
    const hitY = glove.targetY;
    this.particles.addShockwave(hitX, hitY, isCrit ? 'rgba(255, 210, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)');

    if (this.equippedGlove === 'fire') {
      this.particles.addSparks(hitX, hitY, 18, '#ff4500');
    } else if (this.equippedGlove === 'cyber') {
      this.particles.addSparks(hitX, hitY, 15, '#00d2ff');
    } else {
      this.particles.addSparks(hitX, hitY, isCrit ? 20 : 10, isCrit ? '#ffd200' : '#ffffff');
    }

    this.particles.addSweat(hitX, hitY, isCrit ? 8 : 4);

    if (isCrit) {
      this.particles.addTeeth(hitX, hitY, Math.random() > 0.5 ? 2 : 1);
    }

    // Textos de cómic
    const comicWords = isCrit
      ? ['¡BOOM!', '¡CRITICAL!', '¡BRUTAL!', '¡ZASCA!', '¡TOMA!']
      : ['POW!', 'BAM!', 'ZAS!', 'OUCH!', 'WHACK!', 'PLAF!'];
    const word = isCrit ? (punchType === 'uppercut' ? '¡UPPERCUT!' : comicWords[Math.floor(Math.random() * comicWords.length)])
                        : comicWords[Math.floor(Math.random() * comicWords.length)];
    this.particles.addComicText(hitX, hitY - 30, word, isCrit ? '#ff0055' : (this.equippedGlove === 'fire' ? '#ff6600' : '#ffd200'), isCrit ? 46 : 34);

    // Monedas y Puntuación
    let earnedCoins = Math.max(1, Math.round((finalDamage / 8) * activeGloveData.coinBonus));
    if (isCrit) earnedCoins *= 2;
    this.coins += earnedCoins;
    this.score += finalDamage * 10;
    this.particles.addCoins(hitX, hitY, isCrit ? 5 : 2);
    this.sound.playCoin();

    localStorage.setItem('boxeo_coins', this.coins);

    // Combos
    this.combo++;
    this.comboTimer = 1.8;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    // Furia
    if (!this.isRageMode) {
      this.rage = Math.min(100, this.rage + (isCrit ? 12 : 5));
    }

    // Actualizar salud
    this.hp = Math.max(0, this.hp - (finalDamage * 0.45));
    if (this.hp <= 0 && !this.dummy.isKO) {
      this.knockoutDummy();
    }

    this.updateHUD();
  }

  knockoutDummy() {
    this.dummy.isKO = true;
    this.koCount++;
    this.sound.playKoFanfare();
    this.vibrate([60, 40, 90, 40, 120]);
    this.screenShake = 30;

    const headPos = this.getDummyHeadScreenPos();
    this.particles.addComicText(headPos.x, headPos.y - 60, '¡¡K.O.!!', '#ff0000', 70);
    this.particles.addShockwave(headPos.x, headPos.y, 'rgba(255, 0, 0, 0.9)');
    this.particles.addTeeth(headPos.x, headPos.y, 4);
    this.particles.addCoins(headPos.x, headPos.y, 10);
    this.coins += 50;
    localStorage.setItem('boxeo_coins', this.coins);

    this.setBanner('💥 ¡¡NOQUEADO!! ¡EL PELÓN BESÓ LA LONA! 💥');

    setTimeout(() => {
      this.dummy.isKO = false;
      this.hp = this.maxHp;
      this.dummy.heal();
      this.updateHUD();
      this.sound.playBell();
      this.setBanner('¡EL PELÓN SE LEVANTA PARA OTRA RONDA!');
    }, 1600);
  }

  activateRageMode() {
    if (this.rage >= 100 && !this.isRageMode) {
      this.isRageMode = true;
      this.rageTimer = 8.0;
      this.sound.playRageRoar();
      this.vibrate([40, 30, 40, 30, 70]);
      this.setBanner('🔥 ¡¡MODO FURIA ACTIVADO!! ¡DESATA EL PODER! 🔥');

      const headPos = this.getDummyHeadScreenPos();
      this.particles.addComicText(headPos.x, headPos.y - 80, '¡¡FURIA TOTAL!!', '#ff4500', 58);
      this.screenShake = 22;
      this.updateHUD();
    }
  }

  setBanner(msg) {
    const banner = document.getElementById('status-banner');
    banner.textContent = msg;
    banner.style.transform = 'translateX(-50%) scale(1.15)';
    setTimeout(() => {
      banner.style.transform = 'translateX(-50%) scale(1)';
    }, 300);
  }

  toggleMode() {
    if (this.mode === 'free') {
      this.startAttackMode();
    } else {
      this.endAttackMode(false);
    }
  }

  startAttackMode() {
    this.mode = 'timeAttack';
    this.timeRemaining = 30;
    this.koCount = 0;
    this.totalDamageInflicted = 0;
    document.getElementById('time-attack-overlay').classList.remove('hidden');
    document.getElementById('mode-text').textContent = 'Finalizar Reto';
    this.setBanner('⏱️ ¡MODO RETO 30s! ¡NOQUEA AL PELÓN RÁPIDO!');
    this.sound.playBell();

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      document.getElementById('timer-seconds').textContent = this.timeRemaining;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.showResultsModal();
      }
    }, 1000);
  }

  endAttackMode(showModal = true) {
    this.mode = 'free';
    clearInterval(this.timerInterval);
    document.getElementById('time-attack-overlay').classList.add('hidden');
    document.getElementById('mode-text').textContent = 'Modo Libre';
    this.setBanner('🥊 Modo Libre: Desahógate a tu ritmo.');
    if (showModal) {
      this.showResultsModal();
    }
  }

  showResultsModal() {
    document.getElementById('res-kos').textContent = this.koCount;
    document.getElementById('res-damage').textContent = this.totalDamageInflicted;
    document.getElementById('res-combo').textContent = this.maxCombo;
    const bonusCoins = this.koCount * 50 + Math.round(this.totalDamageInflicted / 20);
    this.coins += bonusCoins;
    localStorage.setItem('boxeo_coins', this.coins);
    document.getElementById('res-coins').textContent = `🪙 +${bonusCoins}`;
    document.getElementById('results-modal').classList.remove('hidden');
    this.sound.playBell();
  }

  updateHUD() {
    document.getElementById('score-display').textContent = this.score.toLocaleString();
    document.getElementById('coins-display').textContent = this.coins.toLocaleString();
    document.getElementById('shop-coins-display').textContent = this.coins.toLocaleString();

    // HP
    const hpPercent = Math.max(0, Math.min(100, (this.hp / this.maxHp) * 100));
    document.getElementById('hp-fill').style.width = `${hpPercent}%`;
    document.getElementById('hp-text').textContent = `${Math.round(hpPercent)}%`;

    // Furia
    const ragePercent = this.isRageMode ? ((this.rageTimer / 8.0) * 100) : this.rage;
    document.getElementById('rage-fill').style.width = `${ragePercent}%`;
    document.getElementById('rage-text').textContent = this.isRageMode ? '¡ACTIVO!' : `${Math.round(this.rage)}%`;

    // Botón de furia en panel táctil
    const rageTouchBtn = document.getElementById('touch-btn-rage');
    if (rageTouchBtn) {
      if (this.rage >= 100 || this.isRageMode) {
        rageTouchBtn.classList.add('ready');
      } else {
        rageTouchBtn.classList.remove('ready');
      }
    }

    // Combos
    const comboHud = document.getElementById('combo-hud');
    if (this.combo > 1) {
      comboHud.classList.remove('hidden');
      document.getElementById('combo-number').textContent = this.combo;

      let rank = '¡BUENO!';
      let rankColor = '#ffd200';
      if (this.combo >= 50) {
        rank = '⚡ ¡¡DIOS DEL RING!! ⚡';
        rankColor = '#00e5ff';
      } else if (this.combo >= 30) {
        rank = '🔥 ¡¡BRUTAL!! 🔥';
        rankColor = '#ff2a4b';
      } else if (this.combo >= 15) {
        rank = '💥 ¡¡GENIAL!! 💥';
        rankColor = '#ff9500';
      }
      const rankEl = document.getElementById('combo-rank');
      rankEl.textContent = rank;
      rankEl.style.color = rankColor;
    } else {
      comboHud.classList.add('hidden');
    }

    if (this.mode === 'timeAttack') {
      document.getElementById('ko-count').textContent = this.koCount;
    }
  }

  // ==========================================
  // 6. TIENDA DE GUANTES Y ACCESORIOS
  // ==========================================
  initShop() {
    this.renderShopGloves();
    this.renderShopAccessories();
  }

  openShop() {
    document.getElementById('shop-coins-display').textContent = this.coins.toLocaleString();
    this.renderShopGloves();
    this.renderShopAccessories();
    document.getElementById('shop-modal').classList.remove('hidden');
  }

  renderShopGloves() {
    const grid = document.getElementById('gloves-grid');
    grid.innerHTML = '';

    SHOP_GLOVES.forEach(glove => {
      const isUnlocked = this.unlockedGloves.includes(glove.id);
      const isEquipped = this.equippedGlove === glove.id;

      const card = document.createElement('div');
      card.className = `shop-card ${isEquipped ? 'equipped' : ''}`;

      card.innerHTML = `
        <div class="shop-card-icon">${glove.icon}</div>
        <div class="shop-card-title">${glove.name}</div>
        <div class="shop-card-desc">${glove.desc}</div>
        <button class="shop-card-btn ${isEquipped ? 'btn-equipped' : (isUnlocked ? 'btn-equip' : 'btn-buy')}">
          ${isEquipped ? '✓ EQUIPADO' : (isUnlocked ? 'EQUIPAR' : `🪙 ${glove.price}`)}
        </button>
      `;

      const btn = card.querySelector('.shop-card-btn');
      btn.addEventListener('click', () => {
        if (isEquipped) return;
        if (isUnlocked) {
          this.equippedGlove = glove.id;
          localStorage.setItem('boxeo_glove', glove.id);
          this.renderShopGloves();
          this.sound.playWhoosh();
          this.vibrate(15);
        } else {
          if (this.coins >= glove.price) {
            this.coins -= glove.price;
            this.unlockedGloves.push(glove.id);
            this.equippedGlove = glove.id;
            localStorage.setItem('boxeo_coins', this.coins);
            localStorage.setItem('boxeo_unlocked_gloves', JSON.stringify(this.unlockedGloves));
            localStorage.setItem('boxeo_glove', glove.id);
            this.updateHUD();
            this.renderShopGloves();
            this.sound.playCoin();
            this.vibrate([20, 20, 40]);
          } else {
            alert('¡No tienes suficientes monedas! Sigue golpeando al pelón para ganar más.');
          }
        }
      });

      grid.appendChild(card);
    });
  }

  renderShopAccessories() {
    const grid = document.getElementById('accessories-grid');
    grid.innerHTML = '';

    SHOP_ACCESSORIES.forEach(acc => {
      const isUnlocked = this.unlockedAccessories.includes(acc.id);
      const isEquipped = this.equippedAccessory === acc.id;

      const card = document.createElement('div');
      card.className = `shop-card ${isEquipped ? 'equipped' : ''}`;

      card.innerHTML = `
        <div class="shop-card-icon">${acc.icon}</div>
        <div class="shop-card-title">${acc.name}</div>
        <div class="shop-card-desc">${acc.desc}</div>
        <button class="shop-card-btn ${isEquipped ? 'btn-equipped' : (isUnlocked ? 'btn-equip' : 'btn-buy')}">
          ${isEquipped ? '✓ EQUIPADO' : (isUnlocked ? 'EQUIPAR' : `🪙 ${acc.price}`)}
        </button>
      `;

      const btn = card.querySelector('.shop-card-btn');
      btn.addEventListener('click', () => {
        if (isEquipped) return;
        if (isUnlocked) {
          this.equippedAccessory = acc.id;
          localStorage.setItem('boxeo_accessory', acc.id);
          this.renderShopAccessories();
          this.sound.playWhoosh();
          this.vibrate(15);
        } else {
          if (this.coins >= acc.price) {
            this.coins -= acc.price;
            this.unlockedAccessories.push(acc.id);
            this.equippedAccessory = acc.id;
            localStorage.setItem('boxeo_coins', this.coins);
            localStorage.setItem('boxeo_unlocked_acc', JSON.stringify(this.unlockedAccessories));
            localStorage.setItem('boxeo_accessory', acc.id);
            this.updateHUD();
            this.renderShopAccessories();
            this.sound.playCoin();
            this.vibrate([20, 20, 40]);
          } else {
            alert('¡No tienes suficientes monedas!');
          }
        }
      });

      grid.appendChild(card);
    });
  }

  // ==========================================
  // 7. LOOP PRINCIPAL DE ACTUALIZACIÓN Y RENDER
  // ==========================================
  gameLoop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    this.dummy.update(dt);
    this.particles.update();

    if (this.isRageMode) {
      this.rageTimer -= dt;
      if (this.rageTimer <= 0) {
        this.isRageMode = false;
        this.rage = 0;
        this.setBanner('El modo furia se ha calmado.');
      }
      this.updateHUD();
    }

    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.updateHUD();
      }
    }

    if (this.screenShake > 0) {
      this.screenShakeX = (Math.random() - 0.5) * this.screenShake;
      this.screenShakeY = (Math.random() - 0.5) * this.screenShake;
      this.screenShake *= 0.88;
      if (this.screenShake < 0.5) {
        this.screenShake = 0;
        this.screenShakeX = 0;
        this.screenShakeY = 0;
      }
    }

    const targetLeftX = this.mouse.x - 70;
    const targetLeftY = this.mouse.y + 40;
    const targetRightX = this.mouse.x + 70;
    const targetRightY = this.mouse.y + 40;

    this.leftGlove.x += (targetLeftX - this.leftGlove.x) * 0.22;
    this.leftGlove.y += (targetLeftY - this.leftGlove.y) * 0.22;

    this.rightGlove.x += (targetRightX - this.rightGlove.x) * 0.22;
    this.rightGlove.y += (targetRightY - this.rightGlove.y) * 0.22;

    [this.leftGlove, this.rightGlove].forEach(glove => {
      if (glove.punching) {
        glove.punchProgress += 0.25;
        if (glove.punchProgress >= 1) {
          glove.punching = false;
          glove.punchProgress = 0;
        }
      }
    });
  }

  // ==========================================
  // 8. RENDERIZADO GRÁFICO (Canvas 2D)
  // ==========================================
  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.screenShakeX, this.screenShakeY);

    this.renderRingBackground();
    this.renderDummy();
    this.particles.render(this.ctx);
    this.renderPlayerGloves();

    if (this.isRageMode) {
      this.renderRageOverlay();
    }

    this.ctx.restore();
  }

  renderRingBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    const spotGradient = this.ctx.createRadialGradient(w / 2, h * 0.4, 60, w / 2, h * 0.4, w * 0.65);
    spotGradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    spotGradient.addColorStop(0.5, 'rgba(20, 28, 55, 0.4)');
    spotGradient.addColorStop(1, 'rgba(5, 7, 15, 0.95)');
    this.ctx.fillStyle = spotGradient;
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.strokeStyle = 'rgba(255, 42, 75, 0.3)';
    this.ctx.lineWidth = 6;
    [0.35, 0.5, 0.65].forEach(ratio => {
      this.ctx.beginPath();
      this.ctx.moveTo(0, h * ratio);
      this.ctx.lineTo(w, h * ratio);
      this.ctx.stroke();
    });

    const floorY = this.dummy.baseY + 40;
    const floorGrad = this.ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#1a2238');
    floorGrad.addColorStop(1, '#0c101c');
    this.ctx.fillStyle = floorGrad;
    this.ctx.fillRect(0, floorY, w, h - floorY);

    this.ctx.strokeStyle = '#ffd200';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(0, floorY);
    this.ctx.lineTo(w, floorY);
    this.ctx.stroke();
  }

  renderDummy() {
    const ctx = this.ctx;
    const d = this.dummy;

    const baseX = d.baseX;
    const baseY = d.baseY;

    // --- A. Base de Acero ---
    ctx.save();
    ctx.fillStyle = '#222736';
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(baseX, baseY + 30, 90, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Resorte
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const springTopY = baseY - 80 + d.torsoY * 0.4;
    const springSegments = 5;
    ctx.moveTo(baseX, baseY + 20);
    for (let i = 1; i <= springSegments; i++) {
      const segY = baseY + 20 - (i * (baseY + 20 - springTopY) / springSegments);
      const segX = baseX + (i % 2 === 0 ? 18 : -18) + (d.torsoX * (i / springSegments) * 0.3);
      ctx.lineTo(segX, segY);
    }
    ctx.lineTo(baseX + d.torsoX * 0.4, springTopY);
    ctx.stroke();
    ctx.restore();

    // --- B. Torso ---
    const torsoX = baseX + d.torsoX;
    const torsoY = baseY - 160 + d.torsoY;

    ctx.save();
    ctx.translate(torsoX, torsoY);

    ctx.fillStyle = '#ff2a4b';
    ctx.strokeStyle = '#99001a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-55, -20, 110, 110, [25, 25, 10, 10]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-45, -20, 18, 110);
    ctx.fillRect(27, -20, 18, 110);

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥊', 0, 45);

    ctx.fillStyle = '#ffcc99';
    ctx.strokeStyle = '#d49b6a';
    ctx.lineWidth = 3;
    ctx.fillRect(-18, -60, 36, 45);
    ctx.strokeRect(-18, -60, 36, 45);

    ctx.restore();

    // --- C. Cabeza Calva ---
    const headX = torsoX + d.headX;
    const headY = torsoY - 140 + d.headY;

    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(d.headRot);
    ctx.scale(d.squashX, d.squashY);

    // Orejas
    ctx.fillStyle = '#ffcc99';
    ctx.strokeStyle = '#d49b6a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(-62, -5, 14, 20, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(62, -5, 14, 20, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cráneo Calvo
    const headGrad = ctx.createRadialGradient(-15, -30, 20, 0, -10, 75);
    headGrad.addColorStop(0, '#ffe0bd');
    headGrad.addColorStop(0.7, '#ffcc99');
    headGrad.addColorStop(1, '#e09f67');

    ctx.fillStyle = headGrad;
    ctx.strokeStyle = '#b87540';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, -10, 60, 72, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Brillo de calvicie
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.ellipse(-24, -50, 18, 9, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-8, -62, 7, 4, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Moretones
    for (let b of d.bruises) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.relX, b.relY, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Curitas
    for (let bd of d.bandaids) {
      ctx.save();
      ctx.translate(bd.relX, bd.relY);
      ctx.rotate(bd.rot);
      ctx.fillStyle = '#e8b88a';
      ctx.strokeStyle = '#c48f60';
      ctx.lineWidth = 2;
      ctx.roundRect(-15, -6, 30, 12, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff7b7b';
      ctx.fillRect(-4, -6, 8, 12);
      ctx.restore();
    }

    // Chichones
    for (let bump of d.bumps) {
      ctx.save();
      ctx.translate(bump.relX, bump.relY);
      ctx.fillStyle = '#ff5e7e';
      ctx.strokeStyle = '#c42345';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, bump.h, 0, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Cejas
    ctx.strokeStyle = '#5a3d28';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    if (d.isKO) {
      ctx.beginPath();
      ctx.moveTo(-38, -30); ctx.lineTo(-12, -35);
      ctx.moveTo(38, -30); ctx.lineTo(12, -35);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-40, -38); ctx.lineTo(-14, -32);
      ctx.moveTo(40, -38); ctx.lineTo(14, -32);
      ctx.stroke();
    }

    this.renderDummyEyes(ctx, d);

    // Nariz
    ctx.fillStyle = '#f09b70';
    ctx.strokeStyle = '#c46e40';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -2, 11, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    this.renderDummyMouth(ctx, d);
    this.renderAccessory(ctx, d);

    ctx.restore();

    if (d.toupeeDetached && this.equippedAccessory === 'toupee') {
      ctx.save();
      ctx.translate(headX + d.toupeeX, headY + d.toupeeY);
      ctx.rotate(d.toupeeRot);
      this.drawToupeeSprite(ctx);
      ctx.restore();
    }
  }

  renderDummyEyes(ctx, d) {
    const eyeY = -20;
    const eyeSpacing = 24;

    this.renderSingleEye(ctx, -eyeSpacing, eyeY, d.leftEyeDamage, d.isBlinking, d.isKO);
    this.renderSingleEye(ctx, eyeSpacing, eyeY, d.rightEyeDamage, d.isBlinking, d.isKO);
  }

  renderSingleEye(ctx, x, y, damage, isBlinking, isKO) {
    ctx.save();
    ctx.translate(x, y);

    if (damage > 0) {
      ctx.fillStyle = `rgba(80, 20, 120, ${damage * 0.7})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isKO) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-10, -10); ctx.lineTo(10, 10);
      ctx.moveTo(10, -10); ctx.lineTo(-10, 10);
      ctx.stroke();
    } else if (isBlinking || damage > 0.8) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.quadraticCurveTo(0, 6, 12, 0);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const dx = this.mouse.x - (this.dummy.baseX + x);
      const dy = this.mouse.y - (this.dummy.baseY - 300 + y);
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const pupilX = Math.min(5, Math.max(-5, (dx / dist) * 5));
      const pupilY = Math.min(6, Math.max(-6, (dy / dist) * 6));

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(pupilX, pupilY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pupilX - 2, pupilY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderDummyMouth(ctx, d) {
    ctx.save();
    ctx.translate(0, 24);

    if (d.isKO) {
      ctx.fillStyle = '#3a0c10';
      ctx.strokeStyle = '#1a0507';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath();
      ctx.ellipse(4, 12, 10, 8, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.mouthDamage > 0.4) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-22, 2);
      ctx.quadraticCurveTo(0, -6, 22, 6);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#2b1b11';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-18, 2);
      ctx.quadraticCurveTo(0, 10, 18, 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderAccessory(ctx, d) {
    if (this.equippedAccessory === 'toupee' && !d.toupeeDetached) {
      ctx.save();
      ctx.translate(0, -66);
      this.drawToupeeSprite(ctx);
      ctx.restore();
    } else if (this.equippedAccessory === 'glasses') {
      ctx.save();
      ctx.translate(0, -20);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(-42, -15, 32, 28, 6);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(10, -15, 32, 28, 6);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, -3); ctx.lineTo(10, -3);
      ctx.stroke();
      ctx.restore();
    } else if (this.equippedAccessory === 'sombrero') {
      ctx.save();
      ctx.translate(0, -74);
      ctx.fillStyle = '#222222';
      ctx.strokeStyle = '#ffd200';
      ctx.lineWidth = 3;
      ctx.fillRect(-35, -45, 70, 50);
      ctx.fillStyle = '#ff2a4b';
      ctx.fillRect(-35, -12, 70, 14);
      ctx.fillStyle = '#181818';
      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (this.equippedAccessory === 'mustache') {
      ctx.save();
      ctx.translate(0, 14);
      ctx.fillStyle = '#3a2312';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-15, -10, -30, 2);
      ctx.quadraticCurveTo(-15, 12, 0, 4);
      ctx.quadraticCurveTo(15, 12, 30, 2);
      ctx.quadraticCurveTo(15, -10, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  drawToupeeSprite(ctx) {
    ctx.fillStyle = '#4a2c16';
    ctx.strokeStyle = '#2d180a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 54, 22, 0, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-30, -12); ctx.quadraticCurveTo(-20, -28, -5, -18);
    ctx.quadraticCurveTo(10, -30, 25, -14);
    ctx.stroke();
  }

  // ==========================================
  // 9. RENDERIZADO DE GUANTES
  // ==========================================
  renderPlayerGloves() {
    this.renderSingleGlove(this.leftGlove, 'left');
    this.renderSingleGlove(this.rightGlove, 'right');
  }

  renderSingleGlove(glove, side) {
    const ctx = this.ctx;
    const isPunching = glove.punching;
    const progress = glove.punchProgress;

    let curX = glove.x;
    let curY = glove.y;
    let scale = 1.0;
    let angle = side === 'left' ? 0.2 : -0.2;

    if (isPunching) {
      const punchFactor = Math.sin(progress * Math.PI);
      curX = glove.x + (glove.targetX - glove.x) * punchFactor;
      curY = glove.y + (glove.targetY - glove.y) * punchFactor;
      scale = 1.0 + punchFactor * 0.45;
      angle = (side === 'left' ? -0.3 : 0.3) * punchFactor;
    }

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(angle);
    ctx.scale(side === 'left' ? scale : -scale, scale);

    const gloveData = SHOP_GLOVES.find(g => g.id === this.equippedGlove) || SHOP_GLOVES[0];

    if (this.equippedGlove === 'fire' || this.isRageMode) {
      ctx.save();
      ctx.shadowColor = '#ff4500';
      ctx.shadowBlur = 25;
      ctx.fillStyle = 'rgba(255, 100, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this.equippedGlove === 'golden') {
      ctx.save();
      ctx.shadowColor = '#ffd200';
      ctx.shadowBlur = 20;
      ctx.restore();
    }

    if (this.equippedGlove === 'rubber_hand') {
      ctx.fillStyle = '#00ffcc';
      ctx.strokeStyle = '#00b38f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-30, -25, 60, 50, 16);
      ctx.fill();
      ctx.stroke();
      [-20, -7, 6, 19].forEach(dx => {
        ctx.beginPath();
        ctx.roundRect(dx, -45, 10, 24, 5);
        ctx.fill();
        ctx.stroke();
      });
    } else if (this.equippedGlove === 'squeak_hammer') {
      ctx.fillStyle = '#ff0077';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-45, -30, 90, 60, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffd200';
      ctx.fillRect(-10, 25, 20, 60);
    } else {
      const baseColor = gloveData.color;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-24, 30, 48, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = baseColor;
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 42, 46, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(side === 'left' ? 32 : -32, 6, 18, 16, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(-14, -16, 16, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderRageOverlay() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const rageGrad = this.ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7);
    rageGrad.addColorStop(0, 'rgba(255, 0, 0, 0)');
    rageGrad.addColorStop(1, 'rgba(255, 60, 0, 0.35)');
    this.ctx.fillStyle = rageGrad;
    this.ctx.fillRect(0, 0, w, h);
  }
}

// Iniciar
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

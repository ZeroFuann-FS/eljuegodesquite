/**
 * EL DESQUITE 3D: FPS & SANDBOX DEL PELÓN 🥊🔫👨‍🦲
 * Motor 3D en Three.js con físicas de resorte e impacto,
 * armas de fuego y cuerpo a cuerpo, controles táctiles móviles y audio procedural.
 */

// ==========================================
// 1. MOTOR DE AUDIO PROCEDURAL (Web Audio API)
// ==========================================
class SoundEngine3D {
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

  playPunch(type = 'jab', isCrit = false) {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // Ruido de impacto
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isCrit ? 0.9 : 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Golpe grave
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'uppercut' ? 180 : 130, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.15);

    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playBatHit() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    // Golpe de madera seco
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playPistolShot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // Chasquido inicial
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);

    // Explosión de pólvora
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playShotgunShot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    // Cañonazo pesado
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Sub-bass thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.25);

    oscGain.gain.setValueAtTime(0.9, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  playRpgLaunch() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(380, t + 0.25);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playExplosion() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.6);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playLaserShot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playCoin() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, t); // C6
    osc.frequency.setValueAtTime(1318.5, t + 0.08); // E6

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
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

      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.5);
    });
  }

  playRageRoar() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(320, t + 0.3);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.8);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.9);
  }
}

// ==========================================
// 2. CATÁLOGO DE ARMAS Y ACCESORIOS 3D
// ==========================================
const WEAPONS_DATA = {
  gloves: {
    id: 'gloves',
    name: 'Guantes de Box',
    desc: 'Golpea cuerpo a cuerpo con combinaciones rápidas.',
    icon: '🥊',
    price: 0,
    damage: 15,
    critMultiplier: 2.2,
    cooldown: 0.22,
    range: 3.5,
    type: 'melee'
  },
  bat: {
    id: 'bat',
    name: 'Bate de Béisbol',
    desc: 'Impacto pesado de madera con gran empuje.',
    icon: '🏏',
    price: 200,
    damage: 32,
    critMultiplier: 2.5,
    cooldown: 0.45,
    range: 4.0,
    type: 'melee'
  },
  pistol: {
    id: 'pistol',
    name: 'Pistola Táctica',
    desc: 'Disparos precisos semiautomáticos.',
    icon: '🔫',
    price: 350,
    damage: 25,
    critMultiplier: 3.0,
    cooldown: 0.25,
    range: 60.0,
    type: 'hitscan'
  },
  shotgun: {
    id: 'shotgun',
    name: 'Escopeta de Combate',
    desc: 'Ráfaga de 8 perdigones con dispersión destructiva.',
    icon: '💥',
    price: 600,
    damage: 65,
    critMultiplier: 2.0,
    cooldown: 0.75,
    range: 35.0,
    type: 'shotgun'
  },
  rpg: {
    id: 'rpg',
    name: 'Lanzacohetes RPG',
    desc: 'Misil balístico explosivo que lanza al Pelón por los aires.',
    icon: '🚀',
    price: 1000,
    damage: 120,
    critMultiplier: 1.5,
    cooldown: 1.2,
    range: 100.0,
    type: 'projectile'
  },
  laser: {
    id: 'laser',
    name: 'Rifle Láser Plasma',
    desc: 'Rayo continuo de alta energía.',
    icon: '⚡',
    price: 1500,
    damage: 40,
    critMultiplier: 2.5,
    cooldown: 0.12,
    range: 80.0,
    type: 'laser'
  },
  grenade: {
    id: 'grenade',
    name: 'Granadas TNT',
    desc: 'Lanza explosivos con rebote y temporizador.',
    icon: '💣',
    price: 500,
    damage: 90,
    critMultiplier: 2.0,
    cooldown: 0.6,
    range: 20.0,
    type: 'grenade'
  }
};

const ACCESSORIES_DATA = [
  { id: 'none', name: 'Pelón al Natural', desc: 'Calva brillante sin accesorios.', icon: '👨‍🦲', price: 0 },
  { id: 'toupee', name: 'Peluquín Elegante', desc: 'Peluquín que vuela por los aires en explosiones.', icon: '💇‍♂️', price: 150 },
  { id: 'glasses', name: 'Gafas de Nerd', desc: 'Lentes que se quiebran con los impactos.', icon: '👓', price: 250 },
  { id: 'sombrero', name: 'Sombrero de Fiesta', desc: 'Sombrero festivo que rebota con la física.', icon: '🎩', price: 400 },
  { id: 'mustache', name: 'Bigote Falso', desc: 'Bigote clásico de detective.', icon: '🥸', price: 300 }
];

// ==========================================
// 3. MODELO 3D Y FÍSICAS DEL PELÓN ("EL PELÓN 3D")
// ==========================================
class Dummy3D {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // Posición base
    this.initialPos = new THREE.Vector3(0, 0, 0);
    this.root.position.copy(this.initialPos);

    // Físicas balísticas / corporales (vuelo por explosiones)
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    this.isAirborne = false;

    // Físicas de resorte de la cabeza y torso
    this.torsoRot = new THREE.Vector3(0, 0, 0);
    this.torsoVRot = new THREE.Vector3(0, 0, 0);

    this.headOffset = new THREE.Vector3(0, 0, 0);
    this.headVOffset = new THREE.Vector3(0, 0, 0);
    this.headRot = new THREE.Vector3(0, 0, 0);
    this.headVRot = new THREE.Vector3(0, 0, 0);

    // Estados de daño
    this.bruiseCount = 0;
    this.bumpCount = 0;
    this.isKO = false;
    this.isBlinking = false;
    this.blinkTimer = 0;

    // Accesorio equipado
    this.currentAccessory = localStorage.getItem('boxeo_accessory') || 'none';
    this.accessoryMesh = null;
    this.isAccessoryDetached = false;
    this.accessoryVel = new THREE.Vector3(0, 0, 0);

    this.buildModel();
  }

  buildModel() {
    // 1. Base metálica pesada en el suelo
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222736, roughness: 0.4, metalness: 0.7 });
    this.baseMesh = new THREE.Mesh(baseGeo, baseMat);
    this.baseMesh.position.y = 0.2;
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = true;
    this.root.add(this.baseMesh);

    // 2. Resorte de acero vertical
    const springGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16);
    const springMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.3, metalness: 0.9 });
    this.springMesh = new THREE.Mesh(springGeo, springMat);
    this.springMesh.position.y = 1.0;
    this.root.add(this.springMesh);

    // 3. Grupo del Torso
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.6;
    this.root.add(this.torsoGroup);

    // Cuerpo / Camiseta de tirantes roja
    const torsoGeo = new THREE.BoxGeometry(1.6, 1.8, 1.0);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xff2a4b, roughness: 0.6 });
    this.torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    this.torsoMesh.position.y = 0.9;
    this.torsoMesh.castShadow = true;
    this.torsoGroup.add(this.torsoMesh);

    // Tirantes blancos
    const strapMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const strapLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.82, 1.02), strapMat);
    strapLeft.position.set(-0.5, 0.9, 0);
    this.torsoGroup.add(strapLeft);
    const strapRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.82, 1.02), strapMat);
    strapRight.position.set(0.5, 0.9, 0);
    this.torsoGroup.add(strapRight);

    // Cuello
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.6, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.5 });
    this.neckMesh = new THREE.Mesh(neckGeo, skinMat);
    this.neckMesh.position.y = 1.95;
    this.torsoGroup.add(this.neckMesh);

    // 4. Grupo de la Cabeza
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 2.8;
    this.torsoGroup.add(this.headGroup);

    // Cabeza Calva (Esfera brillante grande)
    const headGeo = new THREE.SphereGeometry(0.95, 32, 32);
    // Material ultra brillante y reflectante
    this.headMat = new THREE.MeshStandardMaterial({
      color: 0xffd2a6,
      roughness: 0.25,
      metalness: 0.1
    });
    this.headMesh = new THREE.Mesh(headGeo, this.headMat);
    this.headMesh.scale.set(1.0, 1.15, 1.0);
    this.headMesh.castShadow = true;
    this.headGroup.add(this.headMesh);

    // Orejas
    const earGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.position.set(-1.0, 0, 0);
    earL.scale.set(0.5, 1.2, 0.8);
    this.headGroup.add(earL);
    const earR = new THREE.Mesh(earGeo, skinMat);
    earR.position.set(1.0, 0, 0);
    earR.scale.set(0.5, 1.2, 0.8);
    this.headGroup.add(earR);

    // Nariz cómica
    const noseGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xf29d74, roughness: 0.4 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -0.05, 0.95);
    nose.scale.set(1.0, 1.2, 1.3);
    this.headGroup.add(nose);

    // Ojos
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    
    // Ojo Izquierdo
    this.leftEye = new THREE.Group();
    this.leftEye.position.set(-0.35, 0.25, 0.85);
    const leftEyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eyeWhiteMat);
    leftEyeBall.scale.set(1, 1.2, 0.5);
    this.leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), pupilMat);
    this.leftPupil.position.set(0, 0, 0.12);
    this.leftEye.add(leftEyeBall);
    this.leftEye.add(this.leftPupil);
    this.headGroup.add(this.leftEye);

    // Ojo Derecho
    this.rightEye = new THREE.Group();
    this.rightEye.position.set(0.35, 0.25, 0.85);
    const rightEyeBall = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eyeWhiteMat);
    rightEyeBall.scale.set(1, 1.2, 0.5);
    this.rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), pupilMat);
    this.rightPupil.position.set(0, 0, 0.12);
    this.rightEye.add(rightEyeBall);
    this.rightEye.add(this.rightPupil);
    this.headGroup.add(this.rightEye);

    // Boca
    const mouthGeo = new THREE.TorusGeometry(0.25, 0.06, 12, 24, Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x4a1818 });
    this.mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    this.mouthMesh.position.set(0, -0.42, 0.88);
    this.mouthMesh.rotation.x = Math.PI;
    this.headGroup.add(this.mouthMesh);

    // Construir accesorios
    this.buildAccessory();
  }

  buildAccessory() {
    if (this.accessoryMesh) {
      this.headGroup.remove(this.accessoryMesh);
      this.scene.remove(this.accessoryMesh);
      this.accessoryMesh = null;
    }

    if (this.currentAccessory === 'toupee') {
      const wigGeo = new THREE.SphereGeometry(0.98, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const wigMat = new THREE.MeshStandardMaterial({ color: 0x4a2c16, roughness: 0.9 });
      this.accessoryMesh = new THREE.Mesh(wigGeo, wigMat);
      this.accessoryMesh.position.set(0, 0.35, 0);
      this.accessoryMesh.scale.set(1.02, 1.05, 1.02);
      this.headGroup.add(this.accessoryMesh);
    } else if (this.currentAccessory === 'glasses') {
      const glassesGroup = new THREE.Group();
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.4 });
      
      const lensL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16), glassMat);
      lensL.rotation.x = Math.PI / 2;
      lensL.position.set(-0.35, 0.25, 0.95);
      const lensR = lensL.clone();
      lensR.position.x = 0.35;
      
      glassesGroup.add(lensL);
      glassesGroup.add(lensR);
      this.accessoryMesh = glassesGroup;
      this.headGroup.add(this.accessoryMesh);
    } else if (this.currentAccessory === 'sombrero') {
      const hatGroup = new THREE.Group();
      const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.08, 32), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.9, 32), new THREE.MeshStandardMaterial({ color: 0x181818 }));
      hatTop.position.y = 0.45;
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.2, 32), new THREE.MeshStandardMaterial({ color: 0xff2a4b }));
      ribbon.position.y = 0.15;
      
      hatGroup.add(hatBrim);
      hatGroup.add(hatTop);
      hatGroup.add(ribbon);
      hatGroup.position.set(0, 1.15, 0);
      this.accessoryMesh = hatGroup;
      this.headGroup.add(this.accessoryMesh);
    } else if (this.currentAccessory === 'mustache') {
      const stache = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.12), new THREE.MeshStandardMaterial({ color: 0x2b1b11 }));
      stache.position.set(0, -0.28, 0.96);
      this.accessoryMesh = stache;
      this.headGroup.add(this.accessoryMesh);
    }
  }

  applyHit(hitPoint, impulseVec, damage, isExplosion = false) {
    // Si es una explosión masiva (RPG / Granadas / TNT), lanzamos al muñeco por los aires
    if (isExplosion || impulseVec.length() > 25) {
      this.isAirborne = true;
      this.velocity.copy(impulseVec);
      this.velocity.y = Math.max(12, this.velocity.y + 14);
      this.angularVelocity.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8
      );

      // Desprender peluquín si tiene uno
      if (this.accessoryMesh && !this.isAccessoryDetached && Math.random() < 0.8) {
        this.detachAccessory();
      }
    } else {
      // Impulso angular al torso y cabeza
      this.torsoVRot.x += impulseVec.z * 0.08;
      this.torsoVRot.z -= impulseVec.x * 0.08;
      this.headVRot.x += impulseVec.z * 0.15;
      this.headVRot.z -= impulseVec.x * 0.15;
      this.headVRot.y += (Math.random() - 0.5) * 0.3;
    }

    // Añadir chichones 3D si es golpe fuerte
    if (damage > 35 && this.bumpCount < 5) {
      this.add3DBump();
    }
  }

  detachAccessory() {
    if (!this.accessoryMesh || this.isAccessoryDetached) return;
    this.isAccessoryDetached = true;
    
    // Convertir coordenadas al espacio mundial
    const worldPos = new THREE.Vector3();
    this.accessoryMesh.getWorldPosition(worldPos);
    this.headGroup.remove(this.accessoryMesh);
    this.scene.add(this.accessoryMesh);
    this.accessoryMesh.position.copy(worldPos);
    this.accessoryVel.set((Math.random() - 0.5) * 8, 12 + Math.random() * 5, (Math.random() - 0.5) * 8);
  }

  add3DBump() {
    this.bumpCount++;
    const bumpGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const bumpMat = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.3 });
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set((Math.random() - 0.5) * 0.8, 0.85 + Math.random() * 0.2, (Math.random() - 0.5) * 0.8);
    this.headGroup.add(bump);
  }

  update(dt, gravityMult = 1.0) {
    const gravity = -24.0 * gravityMult;

    // Físicas balísticas si está volando
    if (this.isAirborne) {
      this.velocity.y += gravity * dt;
      this.root.position.addScaledVector(this.velocity, dt);

      this.root.rotation.x += this.angularVelocity.x * dt;
      this.root.rotation.y += this.angularVelocity.y * dt;
      this.root.rotation.z += this.angularVelocity.z * dt;

      // Colisión con el suelo
      if (this.root.position.y <= 0) {
        this.root.position.y = 0;
        this.velocity.y = -this.velocity.y * 0.4;
        this.velocity.x *= 0.7;
        this.velocity.z *= 0.7;
        this.angularVelocity.multiplyScalar(0.6);

        if (Math.abs(this.velocity.y) < 2.0 && this.root.position.distanceTo(this.initialPos) < 12) {
          this.isAirborne = false;
          // Volver a la base gradualmente
          this.root.rotation.set(0, 0, 0);
          this.root.position.copy(this.initialPos);
        }
      }
    }

    // Físicas de resorte del Torso (Spring-Damper)
    const kTorso = 45.0;
    const dTorso = 6.5;
    this.torsoVRot.x += (-kTorso * this.torsoRot.x - dTorso * this.torsoVRot.x) * dt;
    this.torsoVRot.z += (-kTorso * this.torsoRot.z - dTorso * this.torsoVRot.z) * dt;
    this.torsoRot.addScaledVector(this.torsoVRot, dt);
    this.torsoGroup.rotation.set(this.torsoRot.x, 0, this.torsoRot.z);

    // Físicas de resorte de la Cabeza
    const kHead = 65.0;
    const dHead = 7.5;
    this.headVRot.x += (-kHead * this.headRot.x - dHead * this.headVRot.x) * dt;
    this.headVRot.y += (-kHead * this.headRot.y - dHead * this.headVRot.y) * dt;
    this.headVRot.z += (-kHead * this.headRot.z - dHead * this.headVRot.z) * dt;
    this.headRot.addScaledVector(this.headVRot, dt);
    this.headGroup.rotation.set(this.headRot.x, this.headRot.y, this.headRot.z);

    // Físicas del accesorio volando
    if (this.isAccessoryDetached && this.accessoryMesh) {
      this.accessoryVel.y += gravity * dt;
      this.accessoryMesh.position.addScaledVector(this.accessoryVel, dt);
      this.accessoryMesh.rotation.x += 4 * dt;
      if (this.accessoryMesh.position.y < 0) {
        this.accessoryMesh.position.y = 0;
        this.accessoryVel.set(0, 0, 0);
      }
    }

    // Parpadeo
    this.blinkTimer += dt;
    if (this.blinkTimer > 3.0) {
      this.leftEye.scale.y = 0.1;
      this.rightEye.scale.y = 0.1;
      if (this.blinkTimer > 3.18) {
        this.leftEye.scale.y = 1.0;
        this.rightEye.scale.y = 1.0;
        this.blinkTimer = 0;
      }
    }
  }

  heal() {
    this.isAirborne = false;
    this.root.position.copy(this.initialPos);
    this.root.rotation.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.torsoRot.set(0, 0, 0);
    this.headRot.set(0, 0, 0);
    this.bumpCount = 0;
    this.isAccessoryDetached = false;
    this.buildAccessory();
  }
}

// ==========================================
// 4. MOTOR PRINCIPAL 3D (Three.js & FPS Sandbox)
// ==========================================
class Game3D {
  constructor() {
    this.container = document.getElementById('threejs-container');

    // Three.js Core
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0d18);
    this.scene.fog = new THREE.FogExp2(0x0a0d18, 0.025);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Audio & Dummy
    this.sound = new SoundEngine3D();
    this.dummy = new Dummy3D(this.scene);

    // Estado del Jugador / Economía
    this.score = 0;
    this.coins = parseInt(localStorage.getItem('boxeo_coins')) || 0;
    this.activeWeapon = 'gloves';
    this.hp = 100;
    this.maxHp = 100;
    this.rage = 0;
    this.isRageMode = false;
    this.rageTimer = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.comboTimer = 0;
    this.gravityMult = 1.0;

    // Control de Disparo / Cooldown
    this.canAttack = true;
    this.attackCooldownTimer = 0;

    // Físicas del Jugador FPS
    this.playerPos = new THREE.Vector3(0, 1.8, 5.5);
    this.playerVel = new THREE.Vector3(0, 0, 0);
    this.isGrounded = true;
    this.cameraPitch = 0;
    this.cameraYaw = 0;

    // Entradas de Control
    this.keys = {};
    this.joystickVector = { x: 0, y: 0 };
    this.isPointerLocked = false;

    // Proyectiles / Barriles TNT
    this.projectiles = [];
    this.tntBarrels = [];
    this.particles3D = [];

    this.initLighting();
    this.initEnvironment();
    this.initWeaponViewModels();
    this.initEvents();
    this.initShop();
    this.updateHUD();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  // Vibración móvil
  vibrate(pattern = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  initLighting() {
    // Luz ambiental
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x141b2d, 0.6);
    this.scene.add(hemiLight);

    // Foco cenital principal sobre el ring
    this.spotLight = new THREE.SpotLight(0xfff5ea, 1.4);
    this.spotLight.position.set(0, 14, 0);
    this.spotLight.angle = Math.PI / 3;
    this.spotLight.penumbra = 0.5;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight);

    // Luces de acento neón alrededor del ring
    const blueLight = new THREE.PointLight(0x00d2ff, 1.2, 20);
    blueLight.position.set(-6, 3, -6);
    this.scene.add(blueLight);

    const redLight = new THREE.PointLight(0xff2a4b, 1.2, 20);
    redLight.position.set(6, 3, 6);
    this.scene.add(redLight);
  }

  initEnvironment() {
    // 1. Suelo del Gimnasio / Arena
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f1320, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Ring de Boxeo 3D
    const ringGroup = new THREE.Group();

    // Plataforma del ring
    const ringPlatformGeo = new THREE.BoxGeometry(10, 0.8, 10);
    const ringPlatformMat = new THREE.MeshStandardMaterial({ color: 0x1e2742, roughness: 0.7 });
    const ringPlatform = new THREE.Mesh(ringPlatformGeo, ringPlatformMat);
    ringPlatform.position.y = 0.4;
    ringPlatform.receiveShadow = true;
    ringPlatform.castShadow = true;
    ringGroup.add(ringPlatform);

    // Lona azul/roja del ring
    const canvasGeo = new THREE.PlaneGeometry(9.6, 9.6);
    const canvasMat = new THREE.MeshStandardMaterial({ color: 0x22325c, roughness: 0.9 });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.rotation.x = -Math.PI / 2;
    canvasMesh.position.y = 0.81;
    canvasMesh.receiveShadow = true;
    ringGroup.add(canvasMesh);

    // 4 Postes en las esquinas
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16);
    const postColors = [0xff2a4b, 0x00d2ff, 0xffffff, 0xffffff];
    const postPositions = [
      [-4.6, 1.6, -4.6],
      [4.6, 1.6, 4.6],
      [-4.6, 1.6, 4.6],
      [4.6, 1.6, -4.6]
    ];

    postPositions.forEach((pos, idx) => {
      const postMat = new THREE.MeshStandardMaterial({ color: postColors[idx], metalness: 0.6 });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(...pos);
      post.castShadow = true;
      ringGroup.add(post);
    });

    // 4 Cuerdas del ring
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xff2a4b, roughness: 0.5 });
    [1.4, 2.0, 2.6].forEach(height => {
      const points = [
        new THREE.Vector3(-4.6, height, -4.6),
        new THREE.Vector3(4.6, height, -4.6),
        new THREE.Vector3(4.6, height, 4.6),
        new THREE.Vector3(-4.6, height, 4.6),
        new THREE.Vector3(-4.6, height, -4.6)
      ];
      const ropeGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ropeLine = new THREE.Line(ropeGeo, new THREE.LineBasicMaterial({ color: 0xff3355, linewidth: 3 }));
      ringGroup.add(ropeLine);
    });

    this.scene.add(ringGroup);
  }

  // Viewmodel de armas en primera persona (unido a la cámara)
  initWeaponViewModels() {
    this.weaponGroup = new THREE.Group();
    this.camera.add(this.weaponGroup);
    this.scene.add(this.camera);

    // 1. Guantes de Boxeo (Manos)
    this.glovesModel = new THREE.Group();
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xff2a4b, roughness: 0.3 });
    const leftGloveMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), gloveMat);
    leftGloveMesh.position.set(-0.35, -0.3, -0.6);
    this.rightGloveMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), gloveMat);
    this.rightGloveMesh.position.set(0.35, -0.3, -0.6);
    this.glovesModel.add(leftGloveMesh);
    this.glovesModel.add(this.rightGloveMesh);
    this.weaponGroup.add(this.glovesModel);

    // 2. Bate de Béisbol
    this.batModel = new THREE.Group();
    const batMat = new THREE.MeshStandardMaterial({ color: 0xba8c59, roughness: 0.6 });
    const batMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 0.9, 16), batMat);
    batMesh.position.set(0.35, -0.2, -0.5);
    batMesh.rotation.z = -Math.PI / 4;
    this.batModel.add(batMesh);
    this.weaponGroup.add(this.batModel);
    this.batModel.visible = false;

    // 3. Pistola Táctica
    this.pistolModel = new THREE.Group();
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.35), gunMat);
    barrel.position.set(0.3, -0.22, -0.5);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.08), gunMat);
    grip.position.set(0.3, -0.32, -0.38);
    grip.rotation.x = 0.2;
    this.pistolModel.add(barrel);
    this.pistolModel.add(grip);
    this.weaponGroup.add(this.pistolModel);
    this.pistolModel.visible = false;

    // 4. Escopeta
    this.shotgunModel = new THREE.Group();
    const sBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16), gunMat);
    sBarrel.rotation.x = Math.PI / 2;
    sBarrel.position.set(0.3, -0.22, -0.6);
    this.shotgunModel.add(sBarrel);
    this.weaponGroup.add(this.shotgunModel);
    this.shotgunModel.visible = false;

    // 5. Lanzacohetes RPG
    this.rpgModel = new THREE.Group();
    const rpgTube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 16), new THREE.MeshStandardMaterial({ color: 0x3d4a36, metalness: 0.5 }));
    rpgTube.rotation.x = Math.PI / 2;
    rpgTube.position.set(0.35, -0.15, -0.55);
    this.rpgModel.add(rpgTube);
    this.weaponGroup.add(this.rpgModel);
    this.rpgModel.visible = false;

    // 6. Rifle Láser
    this.laserModel = new THREE.Group();
    const laserBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.6), new THREE.MeshStandardMaterial({ color: 0x00d2ff, metalness: 0.9 }));
    laserBody.position.set(0.3, -0.22, -0.55);
    this.laserModel.add(laserBody);
    this.weaponGroup.add(this.laserModel);
    this.laserModel.visible = false;

    // 7. Granada
    this.grenadeModel = new THREE.Group();
    const grenadeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x224422, roughness: 0.4 }));
    grenadeMesh.position.set(0.3, -0.25, -0.5);
    this.grenadeModel.add(grenadeMesh);
    this.weaponGroup.add(this.grenadeModel);
    this.grenadeModel.visible = false;
  }

  setWeapon(weaponId) {
    if (!WEAPONS_DATA[weaponId]) return;
    this.activeWeapon = weaponId;

    // Ocultar todos los viewmodels
    this.glovesModel.visible = (weaponId === 'gloves');
    this.batModel.visible = (weaponId === 'bat');
    this.pistolModel.visible = (weaponId === 'pistol');
    this.shotgunModel.visible = (weaponId === 'shotgun');
    this.rpgModel.visible = (weaponId === 'rpg');
    this.laserModel.visible = (weaponId === 'laser');
    this.grenadeModel.visible = (weaponId === 'grenade');

    // Actualizar UI
    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.classList.toggle('active', slot.dataset.weapon === weaponId);
    });
    const attackIcon = document.getElementById('m-attack-icon');
    if (attackIcon) attackIcon.textContent = WEAPONS_DATA[weaponId].icon;

    this.sound.playPunch('jab');
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Teclado
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Cambio rápido de arma con números 1-7
      if (e.key >= '1' && e.key <= '7') {
        const weaponKeys = ['gloves', 'bat', 'pistol', 'shotgun', 'rpg', 'laser', 'grenade'];
        this.setWeapon(weaponKeys[parseInt(e.key) - 1]);
      } else if (e.code === 'KeyG') {
        this.spawnTNT();
      } else if (e.code === 'KeyR') {
        this.healPelon();
      } else if (e.code === 'Space' && !this.isPointerLocked) {
        this.activateRageMode();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // PointerLock para PC
    this.container.addEventListener('click', () => {
      if (!this.isPointerLocked && window.innerWidth > 768) {
        this.container.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.container);
      const pauseBanner = document.getElementById('pause-overlay');
      if (pauseBanner) {
        pauseBanner.classList.toggle('hidden', this.isPointerLocked || window.innerWidth <= 768);
      }
    });

    // Rotación de cámara con Ratón
    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        const sens = 0.0022;
        this.cameraYaw -= e.movementX * sens;
        this.cameraPitch -= e.movementY * sens;
        this.cameraPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.cameraPitch));
      }
    });

    // Clic para disparar / golpear
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0 && (this.isPointerLocked || window.innerWidth > 768)) {
        this.executeAttack();
      }
    });

    // Rueda del ratón para cambiar de arma
    window.addEventListener('wheel', (e) => {
      const weaponKeys = Object.keys(WEAPONS_DATA);
      let idx = weaponKeys.indexOf(this.activeWeapon);
      if (e.deltaY > 0) {
        idx = (idx + 1) % weaponKeys.length;
      } else {
        idx = (idx - 1 + weaponKeys.length) % weaponKeys.length;
      }
      this.setWeapon(weaponKeys[idx]);
    });

    // Selector de armas en la UI
    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        this.setWeapon(slot.dataset.weapon);
      });
    });

    // Botones de acción táctiles en móvil
    const mAttack = document.getElementById('m-btn-attack');
    const mJump = document.getElementById('m-btn-jump');
    const mTnt = document.getElementById('m-btn-tnt');
    const mRage = document.getElementById('m-btn-rage');

    if (mAttack) {
      mAttack.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.sound.init();
        this.executeAttack();
      }, { passive: false });
    }
    if (mJump) {
      mJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (this.isGrounded) {
          this.playerVel.y = 8.5;
          this.isGrounded = false;
        }
      }, { passive: false });
    }
    if (mTnt) {
      mTnt.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.spawnTNT();
      }, { passive: false });
    }
    if (mRage) {
      mRage.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.activateRageMode();
      }, { passive: false });
    }

    // Joystick Virtual Izquierdo
    this.initTouchJoystick();

    // Botones del HUD
    document.getElementById('btn-start-game').addEventListener('click', () => {
      document.getElementById('start-overlay').classList.add('hidden');
      this.sound.init();
      this.sound.playBell();
      this.vibrate([30, 40, 50]);
    });

    document.getElementById('btn-sound').addEventListener('click', () => {
      const on = this.sound.toggle();
      document.getElementById('sound-icon').textContent = on ? '🔊' : '🔇';
    });

    document.getElementById('btn-spawn-tnt').addEventListener('click', () => this.spawnTNT());
    document.getElementById('btn-reset').addEventListener('click', () => this.healPelon());

    document.getElementById('btn-gravity').addEventListener('click', () => {
      if (this.gravityMult === 1.0) {
        this.gravityMult = 0.3;
        document.getElementById('grav-text').textContent = 'Gravedad: Lunar 🌙';
      } else if (this.gravityMult === 0.3) {
        this.gravityMult = 0.05;
        document.getElementById('grav-text').textContent = 'Gravedad: Cero 🌌';
      } else {
        this.gravityMult = 1.0;
        document.getElementById('grav-text').textContent = 'Gravedad: 1x 🌍';
      }
    });

    document.getElementById('btn-shop').addEventListener('click', () => {
      document.getElementById('shop-modal').classList.remove('hidden');
      document.getElementById('shop-coins-display').textContent = this.coins.toLocaleString();
    });

    document.getElementById('btn-close-shop').addEventListener('click', () => {
      document.getElementById('shop-modal').classList.add('hidden');
    });

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
      tab.addEventListener('click', () => {
        document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.shop-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      });
    });
  }

  initTouchJoystick() {
    const zone = document.getElementById('joystick-zone');
    const stick = document.getElementById('joystick-stick');
    let touchId = null;
    let startX = 0, startY = 0;

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      const rect = zone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId) {
          const dx = touch.clientX - startX;
          const dy = touch.clientY - startY;
          const dist = Math.hypot(dx, dy);
          const maxDist = 45;
          const angle = Math.atan2(dy, dx);
          const clampedDist = Math.min(dist, maxDist);

          const stickX = Math.cos(angle) * clampedDist;
          const stickY = Math.sin(angle) * clampedDist;
          stick.style.transform = `translate(${stickX}px, ${stickY}px)`;

          this.joystickVector.x = stickX / maxDist;
          this.joystickVector.y = stickY / maxDist;
        }
      }
    }, { passive: true });

    const resetStick = () => {
      touchId = null;
      stick.style.transform = 'translate(0px, 0px)';
      this.joystickVector.x = 0;
      this.joystickVector.y = 0;
    };

    zone.addEventListener('touchend', resetStick);
    zone.addEventListener('touchcancel', resetStick);

    // Zona derecha de arrastre para mirar (Touch Look)
    const lookZone = document.getElementById('touch-look-zone');
    let lookTouchId = null;
    let lastLookX = 0, lastLookY = 0;

    lookZone.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      lookTouchId = touch.identifier;
      lastLookX = touch.clientX;
      lastLookY = touch.clientY;
    }, { passive: true });

    lookZone.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === lookTouchId) {
          const dx = touch.clientX - lastLookX;
          const dy = touch.clientY - lastLookY;
          lastLookX = touch.clientX;
          lastLookY = touch.clientY;

          const sens = 0.0055;
          this.cameraYaw -= dx * sens;
          this.cameraPitch -= dy * sens;
          this.cameraPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.cameraPitch));
        }
      }
    }, { passive: true });

    lookZone.addEventListener('touchend', () => { lookTouchId = null; });
  }

  // ==========================================
  // 5. SISTEMA DE ATAQUE Y ARMAS
  // ==========================================
  executeAttack() {
    if (!this.canAttack) return;
    const weapon = WEAPONS_DATA[this.activeWeapon];
    this.canAttack = false;
    this.attackCooldownTimer = weapon.cooldown;

    // Animación de retroceso del arma
    this.weaponGroup.position.z += 0.08;
    setTimeout(() => { this.weaponGroup.position.z = 0; }, 80);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    if (weapon.type === 'melee') {
      this.performMeleeAttack(weapon, raycaster);
    } else if (weapon.type === 'hitscan' || weapon.type === 'shotgun') {
      this.performGunAttack(weapon, raycaster);
    } else if (weapon.type === 'projectile') {
      this.fireRocket();
    } else if (weapon.type === 'laser') {
      this.fireLaser(weapon, raycaster);
    } else if (weapon.type === 'grenade') {
      this.throwGrenade();
    }
  }

  performMeleeAttack(weapon, raycaster) {
    if (weapon.id === 'gloves') {
      this.sound.playPunch('hook');
      this.vibrate(20);
    } else {
      this.sound.playBatHit();
      this.vibrate(30);
    }

    const intersects = raycaster.intersectObjects([this.dummy.headMesh, this.dummy.torsoMesh, this.dummy.baseMesh], true);
    if (intersects.length > 0 && intersects[0].distance <= weapon.range) {
      const hit = intersects[0];
      const isHead = (hit.object === this.dummy.headMesh);
      const isCrit = isHead || this.isRageMode;
      const dmg = Math.round(weapon.damage * (isCrit ? weapon.critMultiplier : 1.0) * (this.isRageMode ? 2.0 : 1.0));

      const dir = this.camera.getWorldDirection(new THREE.Vector3());
      const impulse = dir.clone().multiplyScalar(isCrit ? 22 : 12);
      this.dummy.applyHit(hit.point, impulse, dmg);
      this.onHitTarget(hit.point, dmg, isCrit);
    }
  }

  performGunAttack(weapon, raycaster) {
    if (weapon.id === 'pistol') {
      this.sound.playPistolShot();
      this.vibrate(25);
    } else {
      this.sound.playShotgunShot();
      this.vibrate([35, 15, 35]);
    }

    const pelletCount = weapon.type === 'shotgun' ? 8 : 1;
    for (let i = 0; i < pelletCount; i++) {
      const spread = weapon.type === 'shotgun' ? 0.04 : 0.005;
      const spreadX = (Math.random() - 0.5) * spread;
      const spreadY = (Math.random() - 0.5) * spread;

      const r = new THREE.Raycaster();
      r.setFromCamera(new THREE.Vector2(spreadX, spreadY), this.camera);

      // Comprobar colisión con el Pelón y con barriles TNT
      const targets = [this.dummy.headMesh, this.dummy.torsoMesh, this.dummy.baseMesh];
      this.tntBarrels.forEach(b => targets.push(b.mesh));

      const intersects = r.intersectObjects(targets, true);
      if (intersects.length > 0 && intersects[0].distance <= weapon.range) {
        const hit = intersects[0];
        // Si golpeó un barril TNT
        const hitBarrel = this.tntBarrels.find(b => b.mesh === hit.object);
        if (hitBarrel) {
          hitBarrel.detonate();
          continue;
        }

        const isHead = (hit.object === this.dummy.headMesh);
        const isCrit = isHead || this.isRageMode;
        const dmgPerPellet = Math.round((weapon.damage / pelletCount) * (isCrit ? weapon.critMultiplier : 1.0) * (this.isRageMode ? 2.0 : 1.0));

        const dir = this.camera.getWorldDirection(new THREE.Vector3());
        const impulse = dir.clone().multiplyScalar(isCrit ? 18 : 8);
        this.dummy.applyHit(hit.point, impulse, dmgPerPellet);
        this.onHitTarget(hit.point, dmgPerPellet, isCrit);
      }
    }
  }

  fireRocket() {
    this.sound.playRpgLaunch();
    this.vibrate(40);

    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const rocketGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12);
    const rocketMat = new THREE.MeshStandardMaterial({ color: 0xff3300 });
    const rocket = new THREE.Mesh(rocketGeo, rocketMat);
    rocket.rotation.x = Math.PI / 2;
    rocket.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    const startPos = this.camera.position.clone().addScaledVector(dir, 0.8);
    rocket.position.copy(startPos);
    this.scene.add(rocket);

    this.projectiles.push({
      mesh: rocket,
      velocity: dir.multiplyScalar(32),
      life: 3.0,
      type: 'rocket'
    });
  }

  fireLaser(weapon, raycaster) {
    this.sound.playLaserShot();
    this.vibrate(15);

    // Rayo láser visual
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const start = this.camera.position.clone().addScaledVector(dir, 0.5);
    const end = start.clone().addScaledVector(dir, 50);

    const laserLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([start, end]),
      new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 4 })
    );
    this.scene.add(laserLine);
    setTimeout(() => this.scene.remove(laserLine), 60);

    const intersects = raycaster.intersectObjects([this.dummy.headMesh, this.dummy.torsoMesh, this.dummy.baseMesh], true);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const isHead = (hit.object === this.dummy.headMesh);
      const isCrit = isHead || this.isRageMode;
      const dmg = Math.round(weapon.damage * (isCrit ? weapon.critMultiplier : 1.0) * (this.isRageMode ? 2.0 : 1.0));
      this.dummy.applyHit(hit.point, dir.clone().multiplyScalar(10), dmg);
      this.onHitTarget(hit.point, dmg, isCrit);
    }
  }

  throwGrenade() {
    this.sound.playPunch('jab');
    this.vibrate(20);

    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const gMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0x2d4a22 }));
    gMesh.position.copy(this.camera.position).addScaledVector(dir, 0.6);
    this.scene.add(gMesh);

    this.projectiles.push({
      mesh: gMesh,
      velocity: dir.multiplyScalar(18).add(new THREE.Vector3(0, 6, 0)),
      life: 1.8,
      type: 'grenade'
    });
  }

  spawnTNT() {
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const pos = this.camera.position.clone().addScaledVector(dir, 3.0);
    pos.y = Math.max(0.6, pos.y);

    const barrelGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0xcc2200, roughness: 0.4 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.copy(pos);
    barrel.castShadow = true;
    this.scene.add(barrel);

    const tntObj = {
      mesh: barrel,
      detonated: false,
      detonate: () => {
        if (tntObj.detonated) return;
        tntObj.detonated = true;
        this.scene.remove(barrel);
        this.createExplosion(barrel.position, 140, 7.0);
      }
    };

    this.tntBarrels.push(tntObj);
    this.sound.playPunch('jab');
    this.setBanner('💣 ¡Barril TNT colocado! ¡Dispárale para detonar!');
  }

  createExplosion(pos, damage, radius) {
    this.sound.playExplosion();
    this.vibrate([60, 40, 90]);

    // Flash de luz de explosión
    const expLight = new THREE.PointLight(0xff6600, 4.0, radius * 2);
    expLight.position.copy(pos);
    this.scene.add(expLight);
    setTimeout(() => this.scene.remove(expLight), 150);

    // Empujar y dañar al Pelón si está dentro del radio
    const dummyPos = new THREE.Vector3();
    this.dummy.root.getWorldPosition(dummyPos);
    dummyPos.y += 2.0;

    const dist = pos.distanceTo(dummyPos);
    if (dist <= radius) {
      const forceMult = 1.0 - (dist / radius);
      const impulse = dummyPos.clone().sub(pos).normalize().multiplyScalar(35 * forceMult);
      const dmg = Math.round(damage * forceMult);
      this.dummy.applyHit(pos, impulse, dmg, true);
      this.onHitTarget(dummyPos, dmg, true);
    }

    // Reacción en cadena con otros barriles TNT
    this.tntBarrels.forEach(b => {
      if (!b.detonated && b.mesh.position.distanceTo(pos) <= radius) {
        setTimeout(() => b.detonate(), 100);
      }
    });
  }

  onHitTarget(pos, damage, isCrit) {
    // Crosshair hit feedback
    const ch = document.getElementById('crosshair');
    ch.classList.add('hit');
    setTimeout(() => ch.classList.remove('hit'), 90);

    // Monedas y puntuación
    const earned = Math.max(1, Math.round(damage / 5));
    this.coins += isCrit ? earned * 2 : earned;
    this.score += damage * 10;
    localStorage.setItem('boxeo_coins', this.coins);
    this.sound.playCoin();

    // Combos
    this.combo++;
    this.comboTimer = 2.0;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    // Furia
    if (!this.isRageMode) {
      this.rage = Math.min(100, this.rage + (isCrit ? 10 : 4));
    }

    // Actualizar vida del Pelón
    this.hp = Math.max(0, this.hp - (damage * 0.4));
    if (this.hp <= 0 && !this.dummy.isKO) {
      this.knockoutPelon();
    }

    this.updateHUD();
  }

  knockoutPelon() {
    this.dummy.isKO = true;
    this.sound.playBell();
    this.vibrate([60, 40, 80, 40, 100]);
    this.setBanner('💥 ¡¡K.O. TOTAL!! ¡EL PELÓN HA SIDO DESTRUIDO! 💥');
    this.coins += 80;
    localStorage.setItem('boxeo_coins', this.coins);

    setTimeout(() => {
      this.dummy.isKO = false;
      this.hp = this.maxHp;
      this.dummy.heal();
      this.updateHUD();
      this.sound.playBell();
      this.setBanner('¡EL PELÓN SE LEVANTA PARA OTRA RONDA!');
    }, 1800);
  }

  activateRageMode() {
    if (this.rage >= 100 && !this.isRageMode) {
      this.isRageMode = true;
      this.rageTimer = 8.0;
      this.sound.playRageRoar();
      this.vibrate([40, 30, 40, 30, 80]);
      this.setBanner('🔥 ¡¡MODO FURIA 3D!! ¡DAÑO MULTIPLICADO! 🔥');
    }
  }

  healPelon() {
    this.dummy.heal();
    this.hp = this.maxHp;
    this.updateHUD();
    this.sound.playPunch('jab');
    this.setBanner('🩹 ¡Pelón curado y colocado en el ring!');
  }

  setBanner(msg) {
    const b = document.getElementById('status-banner');
    b.textContent = msg;
    b.style.transform = 'translateX(-50%) scale(1.1)';
    setTimeout(() => { b.style.transform = 'translateX(-50%) scale(1)'; }, 250);
  }

  updateHUD() {
    document.getElementById('score-display').textContent = this.score.toLocaleString();
    document.getElementById('coins-display').textContent = this.coins.toLocaleString();
    document.getElementById('shop-coins-display').textContent = this.coins.toLocaleString();

    // HP Bar
    const hpPct = Math.max(0, Math.min(100, (this.hp / this.maxHp) * 100));
    document.getElementById('hp-fill').style.width = `${hpPct}%`;
    document.getElementById('hp-text').textContent = `${Math.round(hpPct)}%`;

    // Rage Bar
    const ragePct = this.isRageMode ? ((this.rageTimer / 8.0) * 100) : this.rage;
    document.getElementById('rage-fill').style.width = `${ragePct}%`;
    document.getElementById('rage-text').textContent = this.isRageMode ? '¡ACTIVO!' : `${Math.round(this.rage)}%`;

    // Botón de furia móvil
    const mRage = document.getElementById('m-btn-rage');
    if (mRage) {
      mRage.classList.toggle('ready', this.rage >= 100 || this.isRageMode);
    }

    // Combos
    const comboHud = document.getElementById('combo-hud');
    if (this.combo > 1) {
      comboHud.classList.remove('hidden');
      document.getElementById('combo-number').textContent = this.combo;
    } else {
      comboHud.classList.add('hidden');
    }
  }

  initShop() {
    // Armas
    const wGrid = document.getElementById('weapons-grid');
    wGrid.innerHTML = '';
    Object.values(WEAPONS_DATA).forEach(w => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-icon">${w.icon}</div>
        <div class="shop-card-title">${w.name}</div>
        <div class="shop-card-desc">${w.desc}</div>
        <button class="shop-card-btn btn-buy">SELECCIONAR</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        this.setWeapon(w.id);
        document.getElementById('shop-modal').classList.add('hidden');
      });
      wGrid.appendChild(card);
    });

    // Accesorios
    const aGrid = document.getElementById('accessories-grid');
    aGrid.innerHTML = '';
    ACCESSORIES_DATA.forEach(acc => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-icon">${acc.icon}</div>
        <div class="shop-card-title">${acc.name}</div>
        <div class="shop-card-desc">${acc.desc}</div>
        <button class="shop-card-btn btn-equip">EQUIPAR</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        this.dummy.currentAccessory = acc.id;
        localStorage.setItem('boxeo_accessory', acc.id);
        this.dummy.buildAccessory();
        document.getElementById('shop-modal').classList.add('hidden');
      });
      aGrid.appendChild(card);
    });
  }

  // ==========================================
  // 6. BUCLE PRINCIPAL (Game Loop)
  // ==========================================
  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // Cooldown de ataque
    if (!this.canAttack) {
      this.attackCooldownTimer -= dt;
      if (this.attackCooldownTimer <= 0) {
        this.canAttack = true;
      }
    }

    // Modo Furia
    if (this.isRageMode) {
      this.rageTimer -= dt;
      if (this.rageTimer <= 0) {
        this.isRageMode = false;
        this.rage = 0;
        this.setBanner('El modo furia se ha calmado.');
      }
      this.updateHUD();
    }

    // Combos
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.updateHUD();
      }
    }

    // Movimiento del Jugador FPS
    this.updatePlayerMovement(dt);

    // Actualizar Pelón 3D
    this.dummy.update(dt, this.gravityMult);

    // Actualizar Proyectiles
    this.updateProjectiles(dt);
  }

  updatePlayerMovement(dt) {
    // Orientación de la cámara
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.cameraYaw;
    this.camera.rotation.x = this.cameraPitch;

    // Vectores de movimiento local
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);

    const moveDir = new THREE.Vector3();

    // Teclado
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.add(forward);
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.sub(forward);
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.sub(right);
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.add(right);

    // Joystick Móvil
    if (this.joystickVector.x !== 0 || this.joystickVector.y !== 0) {
      moveDir.addScaledVector(right, this.joystickVector.x);
      moveDir.addScaledVector(forward, -this.joystickVector.y);
    }

    const speed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 9.0 : 6.0;
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      this.playerPos.addScaledVector(moveDir, speed * dt);
    }

    // Gravedad y Salto
    const gravity = -20.0 * this.gravityMult;
    this.playerVel.y += gravity * dt;
    this.playerPos.y += this.playerVel.y * dt;

    if (this.playerPos.y <= 1.8) {
      this.playerPos.y = 1.8;
      this.playerVel.y = 0;
      this.isGrounded = true;
    }

    if (this.keys['Space'] && this.isGrounded && this.isPointerLocked) {
      this.playerVel.y = 8.5;
      this.isGrounded = false;
    }

    // Límites de la arena
    this.playerPos.x = Math.max(-25, Math.min(25, this.playerPos.x));
    this.playerPos.z = Math.max(-25, Math.min(25, this.playerPos.z));

    this.camera.position.copy(this.playerPos);
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;

      if (p.type === 'grenade') {
        p.velocity.y += -20.0 * dt;
        p.mesh.position.addScaledVector(p.velocity, dt);

        if (p.mesh.position.y <= 0.18) {
          p.mesh.position.y = 0.18;
          p.velocity.y = -p.velocity.y * 0.5;
          p.velocity.x *= 0.8;
          p.velocity.z *= 0.8;
        }
      } else if (p.type === 'rocket') {
        p.mesh.position.addScaledVector(p.velocity, dt);

        // Raycast de colisión para el cohete
        const dummyPos = new THREE.Vector3();
        this.dummy.root.getWorldPosition(dummyPos);
        dummyPos.y += 1.8;

        if (p.mesh.position.distanceTo(dummyPos) < 1.8 || p.mesh.position.y <= 0) {
          this.scene.remove(p.mesh);
          this.createExplosion(p.mesh.position, 120, 6.5);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (p.life <= 0) {
        if (p.type === 'grenade') {
          this.createExplosion(p.mesh.position, 90, 5.0);
        }
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }
}

// Iniciar
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game3D();
});

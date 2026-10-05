/**
 * EL DESQUITE 3D: AUTÉNTICO BATTLE ROYALE DEL PELÓN 🏆🏝️🪂🔫👨‍🦲
 * Motor Three.js completo con personajes humanoides articulados (brazos, piernas, cabeza),
 * caída en paracaídas, inventario dinámico de 5 ranuras desde cero (solo puños),
 * botín 3D en el suelo (armas, pociones, botiquines), aldeas con casas y búnkeres,
 * e IA autónoma de Pelones que saquean y combaten entre sí y contra el jugador.
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

  playPunch(type = 'jab') {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'uppercut' ? 190 : 130, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.15);
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playBatHit() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
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
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.14);
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playShotgunShot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playRifleShot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(850, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.1);
    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.11);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playRpgLaunch() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(360, t + 0.25);
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
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playChestOpen() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const time = t + (i * 0.07);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.32);
    });
  }

  playPickupLoot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [783.99, 1174.66].forEach((freq, i) => {
      const time = t + (i * 0.05);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.2);
    });
  }

  playDrinkPotion() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [300, 420, 360, 500].forEach((freq, i) => {
      const time = t + (i * 0.12);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.12);
    });
  }

  playHitmarker() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.06);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playVictoryFanfare() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const time = t + (i * 0.12);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.65);
    });
  }

  playBell() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.8);
    gain.gain.setValueAtTime(0.6, t);
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
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, t);
    osc.frequency.setValueAtTime(1318.5, t + 0.07);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
  }
}

// ==========================================
// 2. CATÁLOGO DE ARMAS Y CONSUMIBLES (ITEMS)
// ==========================================
const ITEMS_DATA = {
  fists: {
    id: 'fists',
    name: 'Puños Limpios',
    icon: '🥊',
    damage: 22,
    range: 3.8,
    cooldown: 0.22,
    type: 'melee',
    rarity: 'Común',
    color: 0x94a3b8
  },
  bat: {
    id: 'bat',
    name: 'Bate Espinado',
    icon: '🏏',
    damage: 45,
    range: 4.2,
    cooldown: 0.38,
    type: 'melee',
    rarity: 'Poco Común',
    color: 0x22c55e
  },
  pistol: {
    id: 'pistol',
    name: 'Pistola Táctica',
    icon: '🔫',
    damage: 30,
    range: 65.0,
    cooldown: 0.2,
    type: 'hitscan',
    rarity: 'Común',
    color: 0x94a3b8
  },
  shotgun: {
    id: 'shotgun',
    name: 'Escopeta Pesada',
    icon: '💥',
    damage: 95,
    range: 35.0,
    cooldown: 0.65,
    type: 'shotgun',
    rarity: 'Rara',
    color: 0x00d2ff
  },
  rifle: {
    id: 'rifle',
    name: 'Fusil de Asalto',
    icon: '⚡',
    damage: 35,
    range: 85.0,
    cooldown: 0.12,
    type: 'hitscan',
    rarity: 'Épico',
    color: 0xa855f7
  },
  rpg: {
    id: 'rpg',
    name: 'Lanzacohetes RPG',
    icon: '🚀',
    damage: 150,
    range: 120.0,
    cooldown: 1.1,
    type: 'projectile',
    rarity: 'Legendario',
    color: 0xffd200
  },
  grenade: {
    id: 'grenade',
    name: 'Granadas TNT',
    icon: '💣',
    damage: 110,
    range: 25.0,
    cooldown: 0.5,
    type: 'grenade',
    rarity: 'Poco Común',
    color: 0x22c55e
  },
  shield_mini: {
    id: 'shield_mini',
    name: 'Mini Escudo (+25)',
    icon: '🛡️',
    type: 'consumable',
    shield: 25,
    maxShieldCap: 50,
    useTime: 1.5,
    rarity: 'Poco Común',
    color: 0x00f0ff
  },
  shield_big: {
    id: 'shield_big',
    name: 'Gran Escudo (+50)',
    icon: '🧪',
    type: 'consumable',
    shield: 50,
    maxShieldCap: 100,
    useTime: 2.5,
    rarity: 'Rara',
    color: 0x0088ff
  },
  medkit: {
    id: 'medkit',
    name: 'Botiquín (+100 HP)',
    icon: '🩹',
    type: 'consumable',
    hp: 100,
    useTime: 3.0,
    rarity: 'Rara',
    color: 0x10b981
  }
};

// ==========================================
// 3. CLASE PELÓN HUMANOIDE 3D (Articulated Puppet)
// ==========================================
class PelonHumanoid3D {
  constructor(scene, id, pos, isBoss = false) {
    this.scene = scene;
    this.id = id;
    this.name = isBoss ? '👑 MEGA-PELÓN BOSS' : ('👨‍🦲 Pelón #' + id);
    this.isBoss = isBoss;
    this.maxHp = isBoss ? 400 : 100;
    this.hp = this.maxHp;
    this.shield = 0;
    this.isDead = false;

    // Estado Battle Royale
    this.state = 'SKYDIVING'; // SKYDIVING, LOOTING, ROAMING, COMBAT
    this.weapon = 'fists';
    this.targetItem = null;
    this.combatTarget = null;
    this.attackCooldown = 0.5;
    this.moveSpeed = isBoss ? 4.5 : (4.5 + Math.random() * 2.0);

    // Físicas
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    this.isAirborne = false;
    this.walkCycle = Math.random() * 10;

    // Raíz de la malla 3D
    this.root = new THREE.Group();
    this.root.position.copy(pos);
    this.scene.add(this.root);

    this.scale = isBoss ? 1.6 : (0.9 + Math.random() * 0.2);
    this.root.scale.set(this.scale, this.scale, this.scale);

    this.buildHumanoidBody();
  }

  buildHumanoidBody() {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd3a5, roughness: 0.35 });
    const colors = [0xff2a4b, 0x00d2ff, 0xffa500, 0x9333ea, 0x10b981, 0xe11d48, 0x3b82f6];
    const shirtColor = colors[this.id % colors.length];
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const bootsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

    // 1. Cadera / Pelvis
    this.hips = new THREE.Group();
    this.hips.position.y = 1.0;
    this.root.add(this.hips);

    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.45), pantsMat);
    this.hips.add(pelvisMesh);

    // 2. Pierna Izquierda
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.22, -0.15, 0);
    this.hips.add(this.leftLegGroup);

    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.5, 8), pantsMat);
    thighL.position.y = -0.25;
    this.leftLegGroup.add(thighL);

    const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8), pantsMat);
    calfL.position.y = -0.65;
    this.leftLegGroup.add(calfL);

    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.3), bootsMat);
    bootL.position.set(0, -0.9, 0.05);
    this.leftLegGroup.add(bootL);

    // 3. Pierna Derecha
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.22, -0.15, 0);
    this.hips.add(this.rightLegGroup);

    const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.5, 8), pantsMat);
    thighR.position.y = -0.25;
    this.rightLegGroup.add(thighR);

    const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.45, 8), pantsMat);
    calfR.position.y = -0.65;
    this.rightLegGroup.add(calfR);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.3), bootsMat);
    bootR.position.set(0, -0.9, 0.05);
    this.rightLegGroup.add(bootR);

    // 4. Torso / Pecho
    this.torso = new THREE.Group();
    this.torso.position.y = 0.2;
    this.hips.add(this.torso);

    const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.7, 0.45), shirtMat);
    chestMesh.position.y = 0.35;
    chestMesh.castShadow = true;
    this.torso.add(chestMesh);

    // Cinturón
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.1, 0.48), bootsMat);
    belt.position.y = 0.05;
    this.torso.add(belt);

    // 5. Cuello y Cabeza Calva (El Pelón)
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.18, 8), skinMat);
    neck.position.y = 0.78;
    this.torso.add(neck);

    this.head = new THREE.Group();
    this.head.position.y = 1.15;
    this.torso.add(this.head);

    // Cabeza Calva Redonda
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 20), skinMat);
    skull.scale.set(1.0, 1.15, 1.05);
    skull.castShadow = true;
    this.head.add(skull);

    // Ojos Expresivos
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), eyeWhiteMat);
    eyeL.position.set(-0.13, 0.06, 0.34);
    const pupL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pupilMat);
    pupL.position.set(0, 0, 0.06);
    eyeL.add(pupL);
    this.head.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), eyeWhiteMat);
    eyeR.position.set(0.13, 0.06, 0.34);
    const pupR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pupilMat);
    pupR.position.set(0, 0, 0.06);
    eyeR.add(pupR);
    this.head.add(eyeR);

    // Nariz
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 0.12), skinMat);
    nose.position.set(0, 0.0, 0.38);
    this.head.add(nose);

    // Orejas
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
    earL.position.set(-0.4, 0.02, 0);
    this.head.add(earL);
    const earR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
    earR.position.set(0.4, 0.02, 0);
    this.head.add(earR);

    // 6. Brazo Izquierdo
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.46, 0.62, 0);
    this.torso.add(this.leftArmGroup);

    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), shirtMat);
    this.leftArmGroup.add(shoulderL);

    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.35, 8), shirtMat);
    upperArmL.position.y = -0.2;
    this.leftArmGroup.add(upperArmL);

    const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.35, 8), skinMat);
    foreArmL.position.y = -0.52;
    this.leftArmGroup.add(foreArmL);

    const fistL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), new THREE.MeshStandardMaterial({ color: 0xff2a4b }));
    fistL.position.y = -0.74;
    this.leftArmGroup.add(fistL);

    // 7. Brazo Derecho (Armado)
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.46, 0.62, 0);
    this.torso.add(this.rightArmGroup);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), shirtMat);
    this.rightArmGroup.add(shoulderR);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.35, 8), shirtMat);
    upperArmR.position.y = -0.2;
    this.rightArmGroup.add(upperArmR);

    const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.35, 8), skinMat);
    foreArmR.position.y = -0.52;
    this.rightArmGroup.add(foreArmR);

    const fistR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), new THREE.MeshStandardMaterial({ color: 0xff2a4b }));
    fistR.position.y = -0.74;
    this.rightArmGroup.add(fistR);

    // Socket para armas
    this.weaponSocket = new THREE.Group();
    this.weaponSocket.position.set(0, -0.74, 0.15);
    this.rightArmGroup.add(this.weaponSocket);

    // 8. Paracaídas / Glider (Activo durante descenso)
    this.gliderMesh = new THREE.Group();
    const canopyMat = new THREE.MeshStandardMaterial({ color: shirtColor, side: THREE.DoubleSide });
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 0.4, 12, 1, true, 0, Math.PI), canopyMat);
    canopy.position.set(0, 2.8, 0);
    canopy.rotation.x = Math.PI / 2;
    this.gliderMesh.add(canopy);
    this.root.add(this.gliderMesh);

    // 9. Barra de Vida Flotante
    const hpCanvas = document.createElement('canvas');
    hpCanvas.width = 160;
    hpCanvas.height = 36;
    this.hpCtx = hpCanvas.getContext('2d');
    this.hpTexture = new THREE.CanvasTexture(hpCanvas);
    const hpSpriteMat = new THREE.SpriteMaterial({ map: this.hpTexture, depthTest: false });
    this.hpSprite = new THREE.Sprite(hpSpriteMat);
    this.hpSprite.position.set(0, 2.6, 0);
    this.hpSprite.scale.set(2.0, 0.45, 1.0);
    this.root.add(this.hpSprite);
    this.updateHpSprite();
  }

  setWeapon(weaponId) {
    this.weapon = weaponId;
    while (this.weaponSocket.children.length > 0) {
      this.weaponSocket.remove(this.weaponSocket.children[0]);
    }
    const item = ITEMS_DATA[weaponId];
    if (!item || weaponId === 'fists') return;

    const gunMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    if (weaponId === 'bat') {
      const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.7, 10), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
      bat.rotation.x = Math.PI / 4;
      this.weaponSocket.add(bat);
    } else if (weaponId === 'pistol') {
      const pistol = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.28), gunMat);
      pistol.position.set(0, 0, 0.1);
      this.weaponSocket.add(pistol);
    } else if (weaponId === 'shotgun') {
      const shotgun = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 10), gunMat);
      shotgun.rotation.x = Math.PI / 2;
      this.weaponSocket.add(shotgun);
    } else if (weaponId === 'rifle') {
      const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.55), gunMat);
      rifle.position.set(0, 0, 0.2);
      this.weaponSocket.add(rifle);
    } else if (weaponId === 'rpg') {
      const rpg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 10), new THREE.MeshStandardMaterial({ color: 0x15803d }));
      rpg.rotation.x = Math.PI / 2;
      this.weaponSocket.add(rpg);
    }
  }

  updateHpSprite() {
    const ctx = this.hpCtx;
    ctx.clearRect(0, 0, 160, 36);
    ctx.fillStyle = 'rgba(10, 14, 25, 0.85)';
    ctx.fillRect(0, 0, 160, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(this.name, 8, 14);

    const hpPct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpPct > 0.35 ? '#00ff66' : '#ff2a4b';
    ctx.fillRect(8, 20, Math.floor(144 * hpPct), 10);

    this.hpTexture.needsUpdate = true;
  }

  applyHit(hitPoint, impulseVec, damage, attackerName = 'Jugador') {
    if (this.isDead) return;
    this.hp -= damage;
    this.updateHpSprite();

    if (impulseVec && impulseVec.length() > 18) {
      this.isAirborne = true;
      this.velocity.copy(impulseVec);
      this.velocity.y = Math.max(10, this.velocity.y + 10);
      this.angularVelocity.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    }

    if (this.hp <= 0) {
      this.die(attackerName);
    }
  }

  die(killerName) {
    this.isDead = true;
    this.isAirborne = true;
    this.velocity.set((Math.random() - 0.5) * 12, 14, (Math.random() - 0.5) * 12);
    this.angularVelocity.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);

    if (this.gliderMesh) this.gliderMesh.visible = false;
    setTimeout(() => {
      this.scene.remove(this.root);
    }, 1800);
  }

  update(dt, game) {
    if (this.isDead) {
      this.velocity.y += -22.0 * dt;
      this.root.position.addScaledVector(this.velocity, dt);
      this.root.rotation.x += this.angularVelocity.x * dt;
      this.root.rotation.z += this.angularVelocity.z * dt;
      return;
    }

    // 1. Estado Descenso en Paracaídas (Skydiving)
    if (this.state === 'SKYDIVING') {
      this.gliderMesh.visible = true;
      this.root.position.y -= 14.0 * dt;
      if (this.root.position.y <= 0) {
        this.root.position.y = 0;
        this.state = 'LOOTING';
        this.gliderMesh.visible = false;
      }
      return;
    }

    // 2. Físicas en el Aire (Salto o Impacto)
    if (this.isAirborne) {
      this.velocity.y += -22.0 * dt;
      this.root.position.addScaledVector(this.velocity, dt);
      this.root.rotation.x += this.angularVelocity.x * dt;
      this.root.rotation.z += this.angularVelocity.z * dt;

      if (this.root.position.y <= 0) {
        this.root.position.y = 0;
        this.isAirborne = false;
        this.velocity.set(0, 0, 0);
        this.root.rotation.set(0, this.root.rotation.y, 0);
      }
      return;
    }

    // 3. IA de Batalla / Saqueo / Combate
    this.attackCooldown -= dt;
    this.walkCycle += dt * 9.0;

    let moveDir = new THREE.Vector3();
    const playerDist = this.root.position.distanceTo(game.playerPos);

    // Buscar Botín si solo tiene puños
    if (this.weapon === 'fists' && (!this.targetItem || !game.groundLoot.includes(this.targetItem))) {
      let nearestDist = 50;
      for (let loot of game.groundLoot) {
        const d = this.root.position.distanceTo(loot.mesh.position);
        if (d < nearestDist) {
          nearestDist = d;
          this.targetItem = loot;
        }
      }
    }

    // Si tiene un ítem objetivo, corre hacia él y lo recoge
    if (this.targetItem && game.groundLoot.includes(this.targetItem)) {
      const lootPos = this.targetItem.mesh.position;
      moveDir.subVectors(lootPos, this.root.position).setY(0);
      if (moveDir.length() < 2.0) {
        // Recoger botín
        this.setWeapon(this.targetItem.item.id);
        game.removeGroundLoot(this.targetItem);
        this.targetItem = null;
      } else {
        moveDir.normalize();
        this.root.position.addScaledVector(moveDir, this.moveSpeed * dt);
        this.root.lookAt(lootPos.x, this.root.position.y, lootPos.z);
      }
    }
    // Si el jugador está cerca (menos de 28m), combate al jugador
    else if (playerDist < 28 && !game.isGliding) {
      moveDir.subVectors(game.playerPos, this.root.position).setY(0);
      const dist = moveDir.length();
      this.root.lookAt(game.playerPos.x, this.root.position.y, game.playerPos.z);

      if (this.weapon === 'fists' || this.weapon === 'bat') {
        if (dist > 3.0) {
          moveDir.normalize();
          this.root.position.addScaledVector(moveDir, this.moveSpeed * dt);
        } else if (this.attackCooldown <= 0) {
          // Golpe Melee
          this.attackCooldown = 0.6;
          this.rightArmGroup.rotation.x = -Math.PI / 2;
          game.sound.playPunch('hook');
          game.takePlayerDamage(ITEMS_DATA[this.weapon].damage);
        }
      } else {
        // Disparo con Arma
        if (dist > 18) {
          moveDir.normalize();
          this.root.position.addScaledVector(moveDir, (this.moveSpeed * 0.7) * dt);
        }
        if (this.attackCooldown <= 0) {
          this.attackCooldown = ITEMS_DATA[this.weapon].cooldown + 0.3;
          this.botFireWeapon(game.playerPos, game);
        }
      }
    }
    // Combate entre Bots (Bot vs Bot)
    else {
      let targetBot = null;
      let minBotDist = 24;
      for (let other of game.enemies) {
        if (other !== this && !other.isDead && other.state !== 'SKYDIVING') {
          const d = this.root.position.distanceTo(other.root.position);
          if (d < minBotDist) {
            minBotDist = d;
            targetBot = other;
          }
        }
      }

      if (targetBot) {
        const botPos = targetBot.root.position;
        this.root.lookAt(botPos.x, this.root.position.y, botPos.z);
        if (this.attackCooldown <= 0 && this.weapon !== 'fists') {
          this.attackCooldown = ITEMS_DATA[this.weapon].cooldown + 0.4;
          this.botFireWeapon(botPos, game, targetBot);
        } else {
          moveDir.subVectors(botPos, this.root.position).setY(0).normalize();
          this.root.position.addScaledVector(moveDir, (this.moveSpeed * 0.5) * dt);
        }
      } else {
        // Moverse hacia la zona segura de la tormenta
        const toCenter = new THREE.Vector3().subVectors(game.stormCenter, this.root.position).setY(0);
        if (toCenter.length() > 5) {
          toCenter.normalize();
          this.root.position.addScaledVector(toCenter, (this.moveSpeed * 0.4) * dt);
          this.root.lookAt(game.stormCenter.x, this.root.position.y, game.stormCenter.z);
        }
      }
    }

    // 4. Animaciones Naturales de Marcha y Brazos
    const isMoving = moveDir.lengthSq() > 0.01;
    if (isMoving) {
      const legAngle = Math.sin(this.walkCycle) * 0.6;
      this.leftLegGroup.rotation.x = legAngle;
      this.rightLegGroup.rotation.x = -legAngle;

      this.leftArmGroup.rotation.x = -legAngle * 0.7;
      if (this.attackCooldown > 0) {
        this.rightArmGroup.rotation.x = -Math.PI / 2.5; // Pose de disparo / golpe
      } else {
        this.rightArmGroup.rotation.x = legAngle * 0.7;
      }
    } else {
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
      this.leftArmGroup.rotation.x = 0;
      if (this.attackCooldown <= 0) this.rightArmGroup.rotation.x = 0;
    }
  }

  botFireWeapon(targetPos, game, targetBot = null) {
    const item = ITEMS_DATA[this.weapon];
    if (!item) return;

    // Sonido de disparo
    if (this.weapon === 'pistol') game.sound.playPistolShot();
    else if (this.weapon === 'shotgun') game.sound.playShotgunShot();
    else if (this.weapon === 'rifle') game.sound.playRifleShot();
    else if (this.weapon === 'rpg') game.sound.playRpgLaunch();

    // Trazador balístico
    const origin = this.root.position.clone().add(new THREE.Vector3(0, 1.4, 0));
    const dir = new THREE.Vector3().subVectors(targetPos, origin).normalize();
    // Añadir leve dispersión de IA
    dir.x += (Math.random() - 0.5) * 0.08;
    dir.z += (Math.random() - 0.5) * 0.08;
    dir.normalize();

    game.createTracer(origin, dir, 40, item.color);

    if (targetBot) {
      // Impacto a otro bot
      targetBot.applyHit(targetPos, dir.clone().multiplyScalar(12), item.damage, this.name);
      if (targetBot.isDead) {
        game.addKillfeedEntry(this.name, targetBot.name, item.name);
      }
    } else {
      // Impacto al jugador (si acierta)
      if (Math.random() < 0.65) {
        game.takePlayerDamage(item.damage);
      }
    }
  }
}

// ==========================================
// 4. CLASE BOTÍN EN EL SUELO 3D (Ground Loot)
// ==========================================
class GroundLoot3D {
  constructor(scene, item, pos) {
    this.scene = scene;
    this.item = item;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(pos);
    this.mesh.position.y = 0.5;

    // Haz de luz y pilar de rareza
    this.light = new THREE.PointLight(item.color, 1.2, 5);
    this.light.position.y = 0.6;
    this.mesh.add(this.light);

    // Malla 3D del ítem flotante
    this.itemMesh = this.buildItemMesh(item);
    this.mesh.add(this.itemMesh);

    this.scene.add(this.mesh);
  }

  buildItemMesh(item) {
    const mat = new THREE.MeshStandardMaterial({ color: item.color, metalness: 0.6, roughness: 0.3 });
    const g = new THREE.Group();

    if (item.id === 'bat') {
      const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.9, 10), mat);
      bat.rotation.z = Math.PI / 4;
      g.add(bat);
    } else if (item.id === 'pistol') {
      const pistol = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.4), mat);
      g.add(pistol);
    } else if (item.id === 'shotgun') {
      const shotgun = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.85, 12), mat);
      shotgun.rotation.x = Math.PI / 2;
      g.add(shotgun);
    } else if (item.id === 'rifle') {
      const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.8), mat);
      g.add(rifle);
    } else if (item.id === 'rpg') {
      const rpg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 12), mat);
      rpg.rotation.x = Math.PI / 2;
      g.add(rpg);
    } else if (item.id === 'grenade') {
      const nade = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), mat);
      g.add(nade);
    } else if (item.id.includes('shield')) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.45, 12), mat);
      g.add(pot);
    } else if (item.id === 'medkit') {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.2), mat);
      g.add(box);
    }
    return g;
  }

  update(dt) {
    this.mesh.rotation.y += 1.8 * dt;
    this.itemMesh.position.y = Math.sin(Date.now() * 0.003) * 0.12;
  }
}

// ==========================================
// 5. CLASE COFRE DE BOTÍN DORADO 3D (Loot Chest)
// ==========================================
class LootChest3D {
  constructor(scene, pos) {
    this.scene = scene;
    this.opened = false;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(pos);

    // Base del Cofre
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd200, roughness: 0.25, metalness: 0.85 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.65, 0.85), goldMat);
    base.position.y = 0.32;
    base.castShadow = true;
    this.mesh.add(base);

    // Tapa con pivote
    this.lidGroup = new THREE.Group();
    this.lidGroup.position.set(0, 0.65, -0.42);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.3, 16, 1, false, 0, Math.PI), goldMat);
    lid.rotation.z = Math.PI / 2;
    lid.position.set(0, 0, 0.42);
    this.lidGroup.add(lid);
    this.mesh.add(this.lidGroup);

    // Luz de brillo
    this.light = new THREE.PointLight(0xffd200, 1.4, 7);
    this.light.position.y = 0.9;
    this.mesh.add(this.light);

    this.scene.add(this.mesh);
  }

  open(game) {
    if (this.opened) return;
    this.opened = true;
    this.lidGroup.rotation.x = -Math.PI / 1.6;
    this.light.color.setHex(0x00ff66);

    // Expulsar 2 a 3 ítems alrededor
    const pool = ['shotgun', 'rifle', 'rpg', 'shield_mini', 'shield_big', 'medkit', 'grenade'];
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const chosenId = pool[Math.floor(Math.random() * pool.length)];
      const offset = new THREE.Vector3((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3);
      const lootPos = this.mesh.position.clone().add(offset);
      game.spawnGroundLoot(chosenId, lootPos);
    }
  }
}

// ==========================================
// 6. MOTOR PRINCIPAL DEL BATTLE ROYALE 3D
// ==========================================
class Game3D {
  constructor() {
    this.container = document.getElementById('threejs-container');

    // Three.js Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.sound = new SoundEngine3D();

    // Estado del Jugador (Inicia con solo Puños)
    this.playerPos = new THREE.Vector3(0, 90, 0); // Inicia en el aire para paracaídas
    this.playerVel = new THREE.Vector3(0, 0, 0);
    this.isGliding = true;
    this.isGrounded = false;
    this.cameraPitch = 0;
    this.cameraYaw = 0;

    this.hp = 100;
    this.maxHp = 100;
    this.shield = 0;
    this.maxShield = 100;
    this.score = 0;
    this.coins = parseInt(localStorage.getItem('boxeo_coins')) || 0;
    this.kills = 0;

    // Inventario de 5 Ranuras (Slot 0: Puños, Slots 1-4: Vacíos)
    this.inventory = ['fists', null, null, null, null];
    this.activeSlot = 0;
    this.canAttack = true;
    this.attackCooldown = 0;
    this.usingConsumable = null;
    this.useTimer = 0;

    // Modos y Mapas
    this.currentMode = 'royale';
    this.currentMap = 'island';

    // Tormenta Battle Royale (Multi-Fase)
    this.stormRadius = 130.0;
    this.targetStormRadius = 25.0;
    this.stormCenter = new THREE.Vector3(0, 0, 0);
    this.stormTimer = 60;
    this.stormPhase = 1;

    // Entidades del Mundo
    this.enemies = [];
    this.chests = [];
    this.groundLoot = [];
    this.tntBarrels = [];
    this.projectiles = [];
    this.tracers = [];
    this.mapObjects = [];

    // Controles
    this.keys = {};
    this.joystickVector = { x: 0, y: 0 };
    this.isPointerLocked = false;
    this.nearbyLoot = null;
    this.nearbyChest = null;

    // Minimapa
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this.initLighting();
    this.initPlayerViewModel();
    this.loadMap(this.currentMap);
    this.initEvents();
    this.initShop();
    this.updateHUD();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  vibrate(pattern = 15) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  initLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x141b2d, 0.7);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.25);
    this.sunLight.position.set(50, 80, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);
  }

  initPlayerViewModel() {
    this.weaponGroup = new THREE.Group();
    this.camera.add(this.weaponGroup);
    this.scene.add(this.camera);

    const gunMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

    // 1. Manos con Guantes (Fists)
    this.glovesModel = new THREE.Group();
    const gMat = new THREE.MeshStandardMaterial({ color: 0xff2a4b, roughness: 0.3 });
    const lG = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), gMat);
    lG.position.set(-0.32, -0.28, -0.55);
    const rG = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), gMat);
    rG.position.set(0.32, -0.28, -0.55);
    this.glovesModel.add(lG, rG);
    this.weaponGroup.add(this.glovesModel);

    // 2. Bate
    this.batModel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.85, 14), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
    this.batModel.position.set(0.32, -0.2, -0.5);
    this.batModel.rotation.z = -Math.PI / 4;
    this.weaponGroup.add(this.batModel);
    this.batModel.visible = false;

    // 3. Pistola
    this.pistolModel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.35), gunMat);
    this.pistolModel.position.set(0.28, -0.22, -0.5);
    this.weaponGroup.add(this.pistolModel);
    this.pistolModel.visible = false;

    // 4. Escopeta
    this.shotgunModel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 14), gunMat);
    this.shotgunModel.rotation.x = Math.PI / 2;
    this.shotgunModel.position.set(0.28, -0.22, -0.55);
    this.weaponGroup.add(this.shotgunModel);
    this.shotgunModel.visible = false;

    // 5. Fusil de Asalto
    this.rifleModel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.65), gunMat);
    this.rifleModel.position.set(0.28, -0.22, -0.55);
    this.weaponGroup.add(this.rifleModel);
    this.rifleModel.visible = false;

    // 6. RPG
    this.rpgModel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.95, 14), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    this.rpgModel.rotation.x = Math.PI / 2;
    this.rpgModel.position.set(0.32, -0.15, -0.55);
    this.weaponGroup.add(this.rpgModel);
    this.rpgModel.visible = false;

    // 7. Granada
    this.grenadeModel = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3f6212 }));
    this.grenadeModel.position.set(0.28, -0.25, -0.45);
    this.weaponGroup.add(this.grenadeModel);
    this.grenadeModel.visible = false;

    // 8. Poción / Consumible
    this.consumableModel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.35, 12), new THREE.MeshStandardMaterial({ color: 0x00f0ff }));
    this.consumableModel.position.set(0.28, -0.25, -0.45);
    this.weaponGroup.add(this.consumableModel);
    this.consumableModel.visible = false;
  }

  loadMap(mapType) {
    this.currentMap = mapType;

    // Limpiar mapa anterior
    this.mapObjects.forEach(obj => this.scene.remove(obj));
    this.mapObjects = [];
    this.enemies.forEach(e => this.scene.remove(e.root));
    this.enemies = [];
    this.chests.forEach(c => this.scene.remove(c.mesh));
    this.chests = [];
    this.groundLoot.forEach(l => this.scene.remove(l.mesh));
    this.groundLoot = [];
    this.tntBarrels.forEach(b => this.scene.remove(b.mesh));
    this.tntBarrels = [];

    // Reiniciar Inventario (Solo Puños al empezar)
    this.inventory = ['fists', null, null, null, null];
    this.activeSlot = 0;
    this.hp = 100;
    this.shield = 0;
    this.kills = 0;
    this.score = 0;

    // Iniciar Caída en Paracaídas
    this.playerPos.set(0, 85, 0);
    this.isGliding = true;
    const gStatus = document.getElementById('glider-status');
    if (gStatus) gStatus.classList.remove('hidden');

    const label = document.getElementById('map-name-label');
    if (label) {
      label.textContent =
        mapType === 'island' ? '🏝️ Isla Royale' :
        (mapType === 'city' ? '🏙️ Ciudad Neón' :
        (mapType === 'volcano' ? '🌋 Volcán Magma' : '🥊 Ring Boxeo'));
    }

    if (mapType === 'island') {
      this.buildIslandRoyaleMap();
    } else if (mapType === 'city') {
      this.buildCityMap();
    } else if (mapType === 'volcano') {
      this.buildVolcanoMap();
    } else {
      this.buildRingMap();
    }

    this.spawnStormMesh();
    this.spawnEnemiesForMode();
    this.updateHUD();
    this.updateWeaponView();
  }

  buildIslandRoyaleMap() {
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.009);

    // Suelo verde de la Isla
    const groundGeo = new THREE.PlaneGeometry(280, 280, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.mapObjects.push(ground);

    // Océano que rodea la isla
    const oceanGeo = new THREE.PlaneGeometry(600, 600);
    const oceanMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.5;
    this.scene.add(ocean);
    this.mapObjects.push(ocean);

    // 1. Aldea de Cabañas (POIs con casas y botín dentro)
    const cabinCoords = [
      { x: -25, z: -25 },
      { x: -10, z: -35 },
      { x: 30, z: -20 },
      { x: -35, z: 25 },
      { x: 25, z: 30 },
      { x: 45, z: -40 }
    ];

    cabinCoords.forEach(pos => {
      this.buildWoodenCabin(pos.x, pos.z);
    });

    // 2. Torre de Vigilancia / Francotirador
    this.buildWatchtower(0, -45);
    this.buildWatchtower(-40, 0);

    // 3. Búnker Militar
    this.buildMilitaryBunker(0, 40);

    // 4. Naturaleza: Palmeras y Rocas
    for (let i = 0; i < 35; i++) {
      const x = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      if (Math.hypot(x, z) > 10) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
        trunk.position.set(x, 2.25, z);
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
        leaves.position.set(x, 4.8, z);
        leaves.scale.set(1.4, 0.6, 1.4);
        this.scene.add(trunk); this.scene.add(leaves);
        this.mapObjects.push(trunk, leaves);
      }
    }

    // 5. Generar Cofres Dorados en POIs
    this.spawnLootChests();
  }

  buildWoodenCabin(x, z) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });

    const house = new THREE.Group();
    house.position.set(x, 0, z);

    // Paredes
    const walls = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 6), woodMat);
    walls.position.y = 1.6;
    walls.castShadow = true;
    house.add(walls);

    // Techo
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.8, 1.8, 4), roofMat);
    roof.position.y = 4.1;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    this.scene.add(house);
    this.mapObjects.push(house);

    // Botín dentro / cerca de la cabaña
    const items = ['pistol', 'shotgun', 'rifle', 'shield_mini', 'medkit', 'grenade', 'bat'];
    const chosen = items[Math.floor(Math.random() * items.length)];
    this.spawnGroundLoot(chosen, new THREE.Vector3(x + (Math.random() - 0.5) * 3, 0, z + (Math.random() - 0.5) * 3));
  }

  buildWatchtower(x, z) {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const tower = new THREE.Group();
    tower.position.set(x, 0, z);

    // 4 Columnas
    [-1.2, 1.2].forEach(cx => {
      [-1.2, 1.2].forEach(cz => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 7, 8), metalMat);
        pole.position.set(cx, 3.5, cz);
        tower.add(pole);
      });
    });

    // Plataforma Superior
    const plat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 3.2), metalMat);
    plat.position.y = 7;
    tower.add(plat);

    this.scene.add(tower);
    this.mapObjects.push(tower);

    // Cofre dorado o arma pesada en la torre
    this.chests.push(new LootChest3D(this.scene, new THREE.Vector3(x, 7.15, z)));
  }

  buildMilitaryBunker(x, z) {
    const concMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const bunker = new THREE.Group();
    bunker.position.set(x, 0, z);

    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(12, 3.5, 9), concMat);
    bMesh.position.y = 1.75;
    bunker.add(bMesh);

    this.scene.add(bunker);
    this.mapObjects.push(bunker);

    // Botín legendario en el búnker
    this.spawnGroundLoot('rpg', new THREE.Vector3(x - 2, 0, z));
    this.spawnGroundLoot('shield_big', new THREE.Vector3(x + 2, 0, z));
  }

  buildCityMap() {
    this.scene.background = new THREE.Color(0x090d16);
    this.scene.fog = new THREE.FogExp2(0x090d16, 0.018);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.mapObjects.push(ground);

    for (let i = 0; i < 24; i++) {
      const h = 14 + Math.random() * 28;
      const w = 8 + Math.random() * 8;
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;
      if (Math.hypot(x, z) > 10) {
        const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 }));
        building.position.set(x, h / 2, z);
        this.scene.add(building);
        this.mapObjects.push(building);

        // Botín en callejones
        const items = ['pistol', 'shotgun', 'rifle', 'shield_mini'];
        this.spawnGroundLoot(items[i % items.length], new THREE.Vector3(x + 5, 0, z));
      }
    }
    this.spawnLootChests();
  }

  buildVolcanoMap() {
    this.scene.background = new THREE.Color(0x200505);
    this.scene.fog = new THREE.FogExp2(0x200505, 0.022);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshStandardMaterial({ color: 0x18181b }));
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.mapObjects.push(ground);

    const lava = new THREE.Mesh(new THREE.PlaneGeometry(180, 25), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
    lava.rotation.x = -Math.PI / 2;
    lava.position.y = 0.05;
    this.scene.add(lava);
    this.mapObjects.push(lava);

    this.spawnLootChests();
  }

  buildRingMap() {
    this.scene.background = new THREE.Color(0x0a0e1c);
    this.scene.fog = new THREE.FogExp2(0x0a0e1c, 0.03);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
    this.mapObjects.push(floor);

    const ringPlat = new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 14), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
    ringPlat.position.y = 0.4;
    this.scene.add(ringPlat);
    this.mapObjects.push(ringPlat);

    this.spawnGroundLoot('bat', new THREE.Vector3(3, 0.8, 3));
    this.spawnGroundLoot('shield_mini', new THREE.Vector3(-3, 0.8, -3));
  }

  spawnStormMesh() {
    if (this.stormMesh) this.scene.remove(this.stormMesh);
    const stormGeo = new THREE.CylinderGeometry(this.stormRadius, this.stormRadius, 80, 32, 1, true);
    const stormMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    this.stormMesh = new THREE.Mesh(stormGeo, stormMat);
    this.stormMesh.position.y = 40;
    this.scene.add(this.stormMesh);
    this.mapObjects.push(this.stormMesh);
  }

  spawnEnemiesForMode() {
    const count = this.currentMode === 'royale' ? 20 : (this.currentMode === 'horde' ? 10 : 4);
    for (let i = 1; i <= count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 20 + Math.random() * 65;
      const pos = new THREE.Vector3(Math.cos(angle) * dist, 70 + Math.random() * 25, Math.sin(angle) * dist);
      const isBoss = (i === count && this.currentMode === 'horde');
      const enemy = new PelonHumanoid3D(this.scene, i, pos, isBoss);
      this.enemies.push(enemy);
    }
    const aliveEl = document.getElementById('alive-count');
    if (aliveEl) aliveEl.textContent = this.enemies.length + 1;
  }

  spawnLootChests() {
    const chestPositions = [
      new THREE.Vector3(12, 0, 12),
      new THREE.Vector3(-22, 0, 20),
      new THREE.Vector3(32, 0, -25),
      new THREE.Vector3(-35, 0, -30),
      new THREE.Vector3(0, 0, -22),
      new THREE.Vector3(40, 0, 35)
    ];
    chestPositions.forEach(pos => {
      this.chests.push(new LootChest3D(this.scene, pos));
    });
  }

  spawnGroundLoot(itemId, pos) {
    const item = ITEMS_DATA[itemId];
    if (!item) return;
    const loot = new GroundLoot3D(this.scene, item, pos);
    this.groundLoot.push(loot);
  }

  removeGroundLoot(loot) {
    const idx = this.groundLoot.indexOf(loot);
    if (idx !== -1) {
      this.scene.remove(loot.mesh);
      this.groundLoot.splice(idx, 1);
    }
  }

  createTracer(start, dir, length = 35, color = 0xffff00) {
    const geom = new THREE.BufferGeometry().setFromPoints([
      start,
      start.clone().addScaledVector(dir, length)
    ]);
    const mat = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
    const line = new THREE.Line(geom, mat);
    this.scene.add(line);
    setTimeout(() => this.scene.remove(line), 70);
  }

  // ==========================================
  // 7. GESTIÓN DE INVENTARIO Y COMBATE
  // ==========================================
  selectSlot(index) {
    if (index < 0 || index > 4) return;
    this.activeSlot = index;
    this.updateWeaponView();
  }

  updateWeaponView() {
    const currentId = this.inventory[this.activeSlot];

    // Ocultar todos los modelos de primera persona
    this.glovesModel.visible = (currentId === 'fists' || !currentId);
    this.batModel.visible = (currentId === 'bat');
    this.pistolModel.visible = (currentId === 'pistol');
    this.shotgunModel.visible = (currentId === 'shotgun');
    this.rifleModel.visible = (currentId === 'rifle');
    this.rpgModel.visible = (currentId === 'rpg');
    this.grenadeModel.visible = (currentId === 'grenade');
    this.consumableModel.visible = (currentId && currentId.includes('shield')) || (currentId === 'medkit');

    // Actualizar ranuras del HUD
    for (let i = 0; i < 5; i++) {
      const slotEl = document.querySelector('.weapon-slot[data-slot="' + i + '"]');
      const iconEl = document.getElementById('slot-icon-' + i);
      const nameEl = document.getElementById('slot-name-' + i);
      const itemId = this.inventory[i];

      if (slotEl) {
        slotEl.classList.toggle('active', i === this.activeSlot);
        slotEl.classList.toggle('empty', !itemId);
      }

      if (itemId && ITEMS_DATA[itemId]) {
        const item = ITEMS_DATA[itemId];
        if (iconEl) iconEl.textContent = item.icon;
        if (nameEl) nameEl.textContent = item.name.split(' ')[0];
      } else {
        if (iconEl) iconEl.textContent = '➕';
        if (nameEl) nameEl.textContent = 'Vacío';
      }
    }

    // Actualizar icono de ataque móvil
    const mAttackIcon = document.getElementById('m-attack-icon');
    const mAttackLabel = document.getElementById('m-attack-label');
    if (currentId && ITEMS_DATA[currentId]) {
      const item = ITEMS_DATA[currentId];
      if (mAttackIcon) mAttackIcon.textContent = item.icon;
      if (mAttackLabel) mAttackLabel.textContent = item.type === 'consumable' ? 'USAR' : (item.type === 'melee' ? 'GOLPE' : 'FUEGO');
    } else {
      if (mAttackIcon) mAttackIcon.textContent = '🥊';
      if (mAttackLabel) mAttackLabel.textContent = 'GOLPE';
    }
  }

  pickupItem(item) {
    // Buscar si hay ranura vacía
    let targetIndex = -1;
    if (!this.inventory[this.activeSlot] || this.inventory[this.activeSlot] === 'fists') {
      targetIndex = this.activeSlot;
    } else {
      for (let i = 0; i < 5; i++) {
        if (!this.inventory[i]) {
          targetIndex = i;
          break;
        }
      }
    }

    // Si todo está lleno, reemplazar el slot activo y soltar el anterior
    if (targetIndex === -1) {
      const oldItem = this.inventory[this.activeSlot];
      if (oldItem && oldItem !== 'fists') {
        this.spawnGroundLoot(oldItem, this.playerPos.clone().add(new THREE.Vector3(0, 0, 1)));
      }
      targetIndex = this.activeSlot;
    }

    this.inventory[targetIndex] = item.id;
    this.activeSlot = targetIndex;
    this.sound.playPickupLoot();
    this.setBanner('🎁 ¡Recogiste ' + item.name + '!');
    this.updateWeaponView();
  }

  executeAttack() {
    if (!this.canAttack || this.isGliding) return;
    const currentId = this.inventory[this.activeSlot] || 'fists';
    const item = ITEMS_DATA[currentId];
    if (!item) return;

    if (item.type === 'consumable') {
      this.startConsumable(item);
      return;
    }

    this.canAttack = false;
    this.attackCooldown = item.cooldown;

    // Animación de retroceso / golpe
    this.weaponGroup.position.z = 0.12;
    setTimeout(() => { this.weaponGroup.position.z = 0; }, 100);

    if (item.type === 'melee') {
      if (item.id === 'fists') this.sound.playPunch('jab');
      else this.sound.playBatHit();
      this.checkMeleeHit(item.damage, item.range);
    } else if (item.type === 'hitscan' || item.type === 'shotgun') {
      if (item.id === 'pistol') { this.sound.playPistolShot(); this.vibrate(20); }
      else if (item.id === 'rifle') { this.sound.playRifleShot(); this.vibrate(15); }
      else { this.sound.playShotgunShot(); this.vibrate([30, 10, 30]); }
      this.fireHitscan(item);
    } else if (item.type === 'projectile') {
      this.sound.playRpgLaunch();
      this.fireRocket();
    } else if (item.type === 'grenade') {
      this.throwGrenade();
    }
  }

  startConsumable(item) {
    if (this.usingConsumable) return;
    if (item.shield && this.shield >= item.maxShieldCap) {
      this.setBanner('⚠️ ¡Ya tienes el escudo al máximo permitido para este ítem!');
      return;
    }
    if (item.hp && this.hp >= this.maxHp) {
      this.setBanner('⚠️ ¡Ya tienes la salud al máximo!');
      return;
    }

    this.usingConsumable = item;
    this.useTimer = item.useTime;
    const progressBox = document.getElementById('use-progress-container');
    const label = document.getElementById('use-progress-label');
    if (progressBox) progressBox.classList.remove('hidden');
    if (label) label.textContent = '🧪 USANDO ' + item.name.toUpperCase() + '...';
    this.sound.playDrinkPotion();
  }

  finishConsumable() {
    const item = this.usingConsumable;
    if (!item) return;

    if (item.shield) {
      this.shield = Math.min(item.maxShieldCap, this.shield + item.shield);
      this.setBanner('🛡️ +' + item.shield + ' de Escudo obtenido!');
    }
    if (item.hp) {
      this.hp = Math.min(this.maxHp, this.hp + item.hp);
      this.setBanner('❤️ +' + item.hp + ' de Salud restaurada!');
    }

    // Consumir del inventario
    this.inventory[this.activeSlot] = null;
    this.usingConsumable = null;
    const progressBox = document.getElementById('use-progress-container');
    if (progressBox) progressBox.classList.add('hidden');
    this.updateHUD();
    this.updateWeaponView();
  }

  checkMeleeHit(damage, range) {
    const fwd = new THREE.Vector3(0, 0, -1).applyEuler(this.camera.rotation);
    for (let enemy of this.enemies) {
      if (!enemy.isDead && enemy.state !== 'SKYDIVING') {
        const dist = this.playerPos.distanceTo(enemy.root.position);
        if (dist < range) {
          enemy.applyHit(this.playerPos, fwd.clone().multiplyScalar(15), damage, 'Jugador');
          this.triggerHitmarker();
          this.addScore(damage * 5);
          if (enemy.isDead) this.onEnemyKilled(enemy);
          break;
        }
      }
    }
  }

  fireHitscan(item) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const origin = this.playerPos.clone().add(new THREE.Vector3(0, -0.2, 0));
    const dir = raycaster.ray.direction;

    this.createTracer(origin, dir, item.range, item.color);

    for (let enemy of this.enemies) {
      if (!enemy.isDead && enemy.state !== 'SKYDIVING') {
        const dist = this.playerPos.distanceTo(enemy.root.position);
        if (dist < item.range) {
          const toEnemy = new THREE.Vector3().subVectors(enemy.root.position.clone().add(new THREE.Vector3(0, 1.2, 0)), origin).normalize();
          const dot = dir.dot(toEnemy);
          if (dot > 0.94) {
            enemy.applyHit(this.playerPos, dir.clone().multiplyScalar(22), item.damage, 'Jugador');
            this.triggerHitmarker();
            this.addScore(item.damage * 8);
            if (enemy.isDead) this.onEnemyKilled(enemy);
            break;
          }
        }
      }
    }
  }

  fireRocket() {
    const rGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 12);
    const rMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const mesh = new THREE.Mesh(rGeo, rMat);
    mesh.position.copy(this.playerPos);

    const dir = new THREE.Vector3(0, 0, -1).applyEuler(this.camera.rotation);
    this.scene.add(mesh);
    this.projectiles.push({ mesh, velocity: dir.multiplyScalar(35), life: 3.5, type: 'rocket' });
  }

  throwGrenade() {
    const nMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), nMat);
    mesh.position.copy(this.playerPos);

    const dir = new THREE.Vector3(0, 0, -1).applyEuler(this.camera.rotation).multiplyScalar(18);
    dir.y += 6;
    this.scene.add(mesh);
    this.projectiles.push({ mesh, velocity: dir, life: 2.2, type: 'grenade' });
  }

  triggerHitmarker() {
    this.sound.playHitmarker();
    const ch = document.getElementById('crosshair');
    if (ch) {
      ch.classList.add('hit');
      setTimeout(() => ch.classList.remove('hit'), 120);
    }
  }

  onEnemyKilled(enemy) {
    this.kills++;
    this.coins += 100;
    localStorage.setItem('boxeo_coins', this.coins);
    this.addKillfeedEntry('Tú', enemy.name, ITEMS_DATA[this.inventory[this.activeSlot] || 'fists'].name);
    this.setBanner('💀 ¡Eliminaste a ' + enemy.name + '! (+100 🪙)');
    this.checkRemainingEnemies();
    this.updateHUD();
  }

  checkRemainingEnemies() {
    const alive = this.enemies.filter(e => !e.isDead).length;
    const aliveCountEl = document.getElementById('alive-count');
    if (aliveCountEl) aliveCountEl.textContent = alive + 1;

    if (alive === 0 && this.currentMode === 'royale') {
      this.triggerVictory();
    }
  }

  triggerVictory() {
    this.sound.playVictoryFanfare();
    const vm = document.getElementById('victory-modal');
    if (vm) vm.classList.remove('hidden');
    const vk = document.getElementById('v-kills');
    const vd = document.getElementById('v-damage');
    if (vk) vk.textContent = this.kills;
    if (vd) vd.textContent = (this.kills * 100).toLocaleString();
  }

  takePlayerDamage(amount) {
    if (this.hp <= 0) return;

    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.hp += this.shield;
        this.shield = 0;
      }
    } else {
      this.hp -= amount;
    }

    this.vibrate(30);
    this.updateHUD();

    if (this.hp <= 0) {
      this.hp = 0;
      const gom = document.getElementById('gameover-modal');
      if (gom) gom.classList.remove('hidden');
      const gok = document.getElementById('go-kills');
      if (gok) gok.textContent = this.kills;
    }
  }

  addKillfeedEntry(killer, victim, weaponName) {
    const kf = document.getElementById('killfeed');
    if (!kf) return;
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    entry.innerHTML = '<b>' + killer + '</b> ⚔️ <b>' + victim + '</b> <small>(' + weaponName + ')</small>';
    kf.appendChild(entry);
    setTimeout(() => entry.remove(), 4000);
  }

  setBanner(msg) {
    const banner = document.getElementById('status-banner');
    if (banner) {
      banner.textContent = msg;
      banner.style.opacity = '1';
    }
  }

  addScore(pts) {
    this.score += Math.round(pts);
    this.updateHUD();
  }

  // ==========================================
  // 8. EVENTOS Y CONTROLES (Móvil y PC)
  // ==========================================
  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.key >= '1' && e.key <= '5') {
        this.selectSlot(parseInt(e.key) - 1);
      } else if (e.code === 'KeyE') {
        this.interactNearest();
      }
    });

    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

    this.container.addEventListener('click', () => {
      if (!this.isPointerLocked && window.innerWidth > 768) {
        this.container.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.container);
      const pauseOverlay = document.getElementById('pause-overlay');
      if (pauseOverlay) {
        pauseOverlay.classList.toggle('hidden', this.isPointerLocked || window.innerWidth <= 768);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        const sens = 0.0022;
        this.cameraYaw -= e.movementX * sens;
        this.cameraPitch -= e.movementY * sens;
        this.cameraPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.cameraPitch));
      }
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 0 && (this.isPointerLocked || window.innerWidth > 768)) {
        this.executeAttack();
      }
    });

    // Ranuras táctiles
    document.querySelectorAll('.weapon-slot').forEach(s => {
      s.addEventListener('click', () => this.selectSlot(parseInt(s.dataset.slot)));
    });

    this.initTouchControls();

    // Botones de Modales
    const btnMaps = document.getElementById('btn-open-maps');
    const btnCloseMaps = document.getElementById('btn-close-maps');
    if (btnMaps) btnMaps.addEventListener('click', () => document.getElementById('maps-modal').classList.remove('hidden'));
    if (btnCloseMaps) btnCloseMaps.addEventListener('click', () => document.getElementById('maps-modal').classList.add('hidden'));

    const btnModes = document.getElementById('btn-open-modes');
    const btnCloseModes = document.getElementById('btn-close-modes');
    if (btnModes) btnModes.addEventListener('click', () => document.getElementById('modes-modal').classList.remove('hidden'));
    if (btnCloseModes) btnCloseModes.addEventListener('click', () => document.getElementById('modes-modal').classList.add('hidden'));

    const btnShop = document.getElementById('btn-open-shop');
    const btnCloseShop = document.getElementById('btn-close-shop');
    if (btnShop) btnShop.addEventListener('click', () => {
      document.getElementById('shop-modal').classList.remove('hidden');
      const sc = document.getElementById('shop-coins-display');
      if (sc) sc.textContent = this.coins.toLocaleString();
    });
    if (btnCloseShop) btnCloseShop.addEventListener('click', () => document.getElementById('shop-modal').classList.add('hidden'));

    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) btnStart.addEventListener('click', () => {
      document.getElementById('start-overlay').classList.add('hidden');
      this.sound.init();
      this.sound.playBell();
    });

    const btnRestart = document.getElementById('btn-restart-royale');
    if (btnRestart) btnRestart.addEventListener('click', () => {
      document.getElementById('victory-modal').classList.add('hidden');
      this.loadMap(this.currentMap);
    });

    const btnRespawn = document.getElementById('btn-respawn');
    if (btnRespawn) btnRespawn.addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.add('hidden');
      this.loadMap(this.currentMap);
    });

    const btnSpawnEnemy = document.getElementById('btn-spawn-enemy');
    if (btnSpawnEnemy) btnSpawnEnemy.addEventListener('click', () => {
      const p = this.playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 15, 0, (Math.random() - 0.5) * 15));
      this.enemies.push(new PelonHumanoid3D(this.scene, this.enemies.length + 1, p));
      this.checkRemainingEnemies();
      this.setBanner('➕ ¡Nuevo Pelón enemigo generado!');
    });

    document.querySelectorAll('.map-card').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.map-card').forEach(mc => mc.classList.remove('active'));
        c.classList.add('active');
        this.loadMap(c.dataset.map);
        document.getElementById('maps-modal').classList.add('hidden');
      });
    });

    document.querySelectorAll('.mode-card').forEach(m => {
      m.addEventListener('click', () => {
        document.querySelectorAll('.mode-card').forEach(mc => mc.classList.remove('active'));
        m.classList.add('active');
        this.currentMode = m.dataset.mode;
        const lbl = document.getElementById('current-mode-label');
        if (lbl) lbl.textContent = m.querySelector('.mode-title').textContent.split(' ')[0];
        document.getElementById('modes-modal').classList.add('hidden');
        this.loadMap(this.currentMap);
      });
    });

    const btnSound = document.getElementById('btn-sound');
    if (btnSound) btnSound.addEventListener('click', () => {
      const on = this.sound.toggle();
      const sIcon = document.getElementById('sound-icon');
      if (sIcon) sIcon.textContent = on ? '🔊' : '🔇';
    });

    const btnFs = document.getElementById('btn-fullscreen');
    if (btnFs) btnFs.addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    });
  }

  interactNearest() {
    if (this.nearbyLoot) {
      this.pickupItem(this.nearbyLoot.item);
      this.removeGroundLoot(this.nearbyLoot);
      this.nearbyLoot = null;
    } else if (this.nearbyChest && !this.nearbyChest.opened) {
      this.sound.playChestOpen();
      this.nearbyChest.open(this);
      this.nearbyChest = null;
    }
  }

  initTouchControls() {
    const zone = document.getElementById('joystick-zone');
    const stick = document.getElementById('joystick-stick');
    if (!zone || !stick) return;

    let touchId = null, startX = 0, startY = 0;
    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      touchId = t.identifier;
      const rect = zone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchId) {
          const dx = t.clientX - startX;
          const dy = t.clientY - startY;
          const dist = Math.min(Math.hypot(dx, dy), 40);
          const angle = Math.atan2(dy, dx);
          const sx = Math.cos(angle) * dist;
          const sy = Math.sin(angle) * dist;
          stick.style.transform = 'translate(' + sx + 'px, ' + sy + 'px)';
          this.joystickVector.x = sx / 40;
          this.joystickVector.y = sy / 40;
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

    const lookZone = document.getElementById('touch-look-zone');
    if (lookZone) {
      let lookId = null, lastX = 0, lastY = 0;
      lookZone.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        lookId = t.identifier;
        lastX = t.clientX; lastY = t.clientY;
      }, { passive: true });

      lookZone.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === lookId) {
            this.cameraYaw -= (t.clientX - lastX) * 0.0055;
            this.cameraPitch -= (t.clientY - lastY) * 0.0055;
            this.cameraPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.cameraPitch));
            lastX = t.clientX; lastY = t.clientY;
          }
        }
      }, { passive: true });
      lookZone.addEventListener('touchend', () => { lookId = null; });
    }

    const mAtk = document.getElementById('m-btn-attack');
    const mJmp = document.getElementById('m-btn-jump');
    const mChest = document.getElementById('m-btn-chest');
    const mTnt = document.getElementById('m-btn-tnt');
    const mPickup = document.getElementById('m-btn-pickup');

    if (mAtk) mAtk.addEventListener('touchstart', (e) => { e.preventDefault(); this.sound.init(); this.executeAttack(); }, { passive: false });
    if (mJmp) mJmp.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.isGrounded) { this.playerVel.y = 8.5; this.isGrounded = false; }
    }, { passive: false });
    if (mChest) mChest.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.interactNearest();
    }, { passive: false });
    if (mTnt) mTnt.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.throwGrenade();
    }, { passive: false });
    if (mPickup) mPickup.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.interactNearest();
    }, { passive: false });
  }

  // ==========================================
  // 9. BUCLE PRINCIPAL DEL JUEGO (Game Loop)
  // ==========================================
  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt);
    this.renderMinimap();
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (!this.canAttack) {
      this.attackCooldown -= dt;
      if (this.attackCooldown <= 0) this.canAttack = true;
    }

    // Progreso de uso de consumible
    if (this.usingConsumable) {
      this.useTimer -= dt;
      const pct = Math.max(0, 1 - (this.useTimer / this.usingConsumable.useTime)) * 100;
      const fill = document.getElementById('use-progress-fill');
      if (fill) fill.style.width = pct + '%';
      if (this.useTimer <= 0) {
        this.finishConsumable();
      }
    }

    // Tormenta Battle Royale
    if (this.currentMode === 'royale') {
      this.stormTimer -= dt;
      if (this.stormTimer <= 0) {
        this.stormTimer = 45;
        this.stormPhase++;
        this.targetStormRadius = Math.max(8, this.targetStormRadius * 0.65);
      }
      const st = document.getElementById('storm-timer');
      if (st) st.textContent = '0:' + Math.ceil(this.stormTimer).toString().padStart(2, '0');

      if (this.stormRadius > this.targetStormRadius) {
        this.stormRadius -= 2.5 * dt;
        if (this.stormMesh) this.stormMesh.scale.set(this.stormRadius / 130, 1, this.stormRadius / 130);
      }

      const distToStormCenter = Math.hypot(this.playerPos.x - this.stormCenter.x, this.playerPos.z - this.stormCenter.z);
      const isOutside = distToStormCenter > this.stormRadius;
      const warn = document.getElementById('storm-warning');
      if (warn) warn.classList.toggle('hidden', !isOutside);
      if (isOutside) {
        this.takePlayerDamage(5 * dt);
      }
    }

    this.updatePlayer(dt);
    this.enemies.forEach(e => e.update(dt, this));
    this.groundLoot.forEach(l => l.update(dt));
    this.updateProjectiles(dt);
    this.checkProximityLoot();
  }

  updatePlayer(dt) {
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.cameraYaw;
    this.camera.rotation.x = this.cameraPitch;

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
    const moveDir = new THREE.Vector3();

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.add(forward);
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.sub(forward);
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.sub(right);
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.add(right);

    if (this.joystickVector.x !== 0 || this.joystickVector.y !== 0) {
      moveDir.addScaledVector(right, this.joystickVector.x);
      moveDir.addScaledVector(forward, -this.joystickVector.y);
    }

    // Comportamiento de Caída en Paracaídas
    if (this.isGliding) {
      const glideSpeed = 16.0;
      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        this.playerPos.addScaledVector(moveDir, glideSpeed * dt);
      }
      this.playerPos.y -= 14.0 * dt;

      if (this.playerPos.y <= 1.8) {
        this.playerPos.y = 1.8;
        this.isGliding = false;
        this.isGrounded = true;
        const gStatus = document.getElementById('glider-status');
        if (gStatus) gStatus.classList.add('hidden');
        this.setBanner('📍 ¡Aterrizaje completado! ¡Busca armas en las casas!');
      }
      this.camera.position.copy(this.playerPos);
      return;
    }

    // Movimiento Normal Terrestre
    const speed = (this.keys['ShiftLeft']) ? 10.0 : 6.5;
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      this.playerPos.addScaledVector(moveDir, speed * dt);
    }

    this.playerVel.y += -22.0 * dt;
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

    this.camera.position.copy(this.playerPos);
  }

  checkProximityLoot() {
    let closestLoot = null;
    let minLootDist = 3.5;

    for (let loot of this.groundLoot) {
      const d = this.playerPos.distanceTo(loot.mesh.position);
      if (d < minLootDist) {
        minLootDist = d;
        closestLoot = loot;
      }
    }

    let closestChest = null;
    let minChestDist = 4.0;
    for (let chest of this.chests) {
      if (!chest.opened) {
        const d = this.playerPos.distanceTo(chest.mesh.position);
        if (d < minChestDist) {
          minChestDist = d;
          closestChest = chest;
        }
      }
    }

    this.nearbyLoot = closestLoot;
    this.nearbyChest = closestChest;

    const prompt = document.getElementById('loot-prompt');
    const pIcon = document.getElementById('loot-prompt-icon');
    const pTitle = document.getElementById('loot-prompt-title');
    const pSub = document.getElementById('loot-prompt-sub');
    const mPickup = document.getElementById('m-btn-pickup');
    const mPickupTitle = document.getElementById('m-pickup-title');
    const mPickupIcon = document.getElementById('m-pickup-icon');

    if (closestLoot) {
      if (prompt) prompt.classList.remove('hidden');
      if (pIcon) pIcon.textContent = closestLoot.item.icon;
      if (pTitle) pTitle.textContent = closestLoot.item.name;
      if (pSub) pSub.textContent = '[E] o Toca para recoger (' + closestLoot.item.rarity + ')';

      if (mPickup) {
        mPickup.classList.remove('hidden');
        if (mPickupTitle) mPickupTitle.textContent = 'RECOGER ' + closestLoot.item.name.split(' ')[0];
        if (mPickupIcon) mPickupIcon.textContent = closestLoot.item.icon;
      }
    } else if (closestChest) {
      if (prompt) prompt.classList.remove('hidden');
      if (pIcon) pIcon.textContent = '🎁';
      if (pTitle) pTitle.textContent = 'Cofre Dorado de Botín';
      if (pSub) pSub.textContent = '[E] o Toca para abrir';

      if (mPickup) {
        mPickup.classList.remove('hidden');
        if (mPickupTitle) mPickupTitle.textContent = 'ABRIR COFRE';
        if (mPickupIcon) mPickupIcon.textContent = '🎁';
      }
    } else {
      if (prompt) prompt.classList.add('hidden');
      if (mPickup) mPickup.classList.add('hidden');
    }
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      p.mesh.position.addScaledVector(p.velocity, dt);

      if (p.type === 'rocket') {
        for (let enemy of this.enemies) {
          if (!enemy.isDead && p.mesh.position.distanceTo(enemy.root.position) < 2.2) {
            this.createExplosion(p.mesh.position, 150, 7.5);
            this.scene.remove(p.mesh);
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }

      if (p.life <= 0) {
        if (p.type === 'grenade') this.createExplosion(p.mesh.position, 110, 6.5);
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  createExplosion(pos, damage, radius) {
    this.sound.playExplosion();

    // Efecto visual de explosión
    const expGeo = new THREE.SphereGeometry(radius * 0.7, 16, 16);
    const expMat = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.85 });
    const expMesh = new THREE.Mesh(expGeo, expMat);
    expMesh.position.copy(pos);
    this.scene.add(expMesh);

    setTimeout(() => {
      this.scene.remove(expMesh);
    }, 180);

    for (let enemy of this.enemies) {
      if (!enemy.isDead) {
        const d = pos.distanceTo(enemy.root.position);
        if (d < radius) {
          const dmg = Math.round(damage * (1 - d / radius));
          const dir = new THREE.Vector3().subVectors(enemy.root.position, pos).normalize();
          enemy.applyHit(pos, dir.multiplyScalar(30), dmg, 'Jugador');
          if (enemy.isDead) this.onEnemyKilled(enemy);
        }
      }
    }

    const pDist = pos.distanceTo(this.playerPos);
    if (pDist < radius) {
      const pDmg = Math.round(damage * 0.5 * (1 - pDist / radius));
      this.takePlayerDamage(pDmg);
    }
  }

  renderMinimap() {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const w = 110, h = 110;
    ctx.clearRect(0, 0, w, h);

    const scale = 0.45;
    const cx = w / 2, cy = h / 2;

    // Tormenta
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, (this.stormRadius * scale), 0, Math.PI * 2);
    ctx.stroke();

    // Cofres (amarillos)
    ctx.fillStyle = '#ffd200';
    this.chests.forEach(c => {
      if (!c.opened) {
        const mx = cx + (c.mesh.position.x - this.playerPos.x) * scale;
        const my = cy + (c.mesh.position.z - this.playerPos.z) * scale;
        ctx.fillRect(mx - 2, my - 2, 4, 4);
      }
    });

    // Botín terrestre (verde)
    ctx.fillStyle = '#00ff66';
    this.groundLoot.forEach(l => {
      const mx = cx + (l.mesh.position.x - this.playerPos.x) * scale;
      const my = cy + (l.mesh.position.z - this.playerPos.z) * scale;
      ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
    });

    // Enemigos (rojos)
    ctx.fillStyle = '#ff2a4b';
    this.enemies.forEach(e => {
      if (!e.isDead && e.state !== 'SKYDIVING') {
        const mx = cx + (e.root.position.x - this.playerPos.x) * scale;
        const my = cy + (e.root.position.z - this.playerPos.z) * scale;
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Jugador (azul con flecha)
    ctx.fillStyle = '#00d2ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(this.cameraYaw) * 8, cy - Math.cos(this.cameraYaw) * 8);
    ctx.stroke();
  }

  updateHUD() {
    const sD = document.getElementById('score-display');
    const cD = document.getElementById('coins-display');
    const kC = document.getElementById('kills-count');
    if (sD) sD.textContent = this.score.toLocaleString();
    if (cD) cD.textContent = this.coins.toLocaleString();
    if (kC) kC.textContent = this.kills;

    const hpPct = Math.max(0, (this.hp / this.maxHp) * 100);
    const hpF = document.getElementById('hp-fill');
    const hpT = document.getElementById('hp-val-text');
    if (hpF) hpF.style.width = hpPct + '%';
    if (hpT) hpT.textContent = Math.round(this.hp) + ' / ' + this.maxHp;

    const shPct = Math.max(0, (this.shield / this.maxShield) * 100);
    const shF = document.getElementById('shield-fill');
    const shT = document.getElementById('shield-val-text');
    if (shF) shF.style.width = shPct + '%';
    if (shT) shT.textContent = Math.round(this.shield) + ' / ' + this.maxShield;
  }

  initShop() {
    const wGrid = document.getElementById('weapons-grid');
    if (!wGrid) return;
    wGrid.innerHTML = '';
    Object.values(ITEMS_DATA).forEach(w => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = [
        '<div class="shop-card-icon">' + w.icon + '</div>',
        '<div class="shop-card-title">' + w.name + '</div>',
        '<button class="shop-card-btn btn-buy">EQUIPAR</button>'
      ].join('');
      card.querySelector('button').addEventListener('click', () => {
        this.pickupItem(w);
        document.getElementById('shop-modal').classList.add('hidden');
      });
      wGrid.appendChild(card);
    });
  }
}

// Iniciar al cargar
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game3D();
});

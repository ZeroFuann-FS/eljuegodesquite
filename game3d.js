/**
 * EL DESQUITE 3D: BATTLE ROYALE & SANDBOX 🏆🏝️🔫👨‍🦲
 * Motor 3D en Three.js con múltiples mapas, IA de hordas de Pelones,
 * sistema de tormenta Battle Royale, cofres de botín, minimapa y arsenal completo.
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
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  playShotgunShot() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
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
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
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
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
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
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.14);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playChestOpen() {
    if (!this.enabled) return;
    this.init();
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const time = t + (i * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.36);
    });
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
// 2. CATÁLOGO DE ARMAS
// ==========================================
const WEAPONS_DATA = {
  gloves: { id: 'gloves', name: 'Guantes de Box', icon: '🥊', damage: 20, critMultiplier: 2.2, cooldown: 0.2, range: 3.8, type: 'melee' },
  bat: { id: 'bat', name: 'Bate Espinado', icon: '🏏', damage: 38, critMultiplier: 2.5, cooldown: 0.4, range: 4.2, type: 'melee' },
  pistol: { id: 'pistol', name: 'Pistola Táctica', icon: '🔫', damage: 28, critMultiplier: 3.0, cooldown: 0.22, range: 70.0, type: 'hitscan' },
  shotgun: { id: 'shotgun', name: 'Escopeta Pesada', icon: '💥', damage: 80, critMultiplier: 2.0, cooldown: 0.7, range: 40.0, type: 'shotgun' },
  rpg: { id: 'rpg', name: 'Lanzacohetes RPG', icon: '🚀', damage: 140, critMultiplier: 1.5, cooldown: 1.1, range: 120.0, type: 'projectile' },
  laser: { id: 'laser', name: 'Rifle Láser', icon: '⚡', damage: 45, critMultiplier: 2.5, cooldown: 0.12, range: 90.0, type: 'laser' },
  grenade: { id: 'grenade', name: 'Granadas TNT', icon: '💣', damage: 100, critMultiplier: 2.0, cooldown: 0.55, range: 25.0, type: 'grenade' },
  medkit: { id: 'medkit', name: 'Botiquín / Escudo', icon: '🧪', damage: 0, cooldown: 1.0, type: 'heal' }
};

// ==========================================
// 3. CLASE PELÓN ENEMIGO 3D (Autonomous Multi-Enemy)
// ==========================================
class PelonEnemy3D {
  constructor(scene, id, pos, isBoss = false) {
    this.scene = scene;
    this.id = id;
    this.name = isBoss ? `👑 MEGA-PELÓN BOSS` : `👨‍🦲 Pelón #${id}`;
    this.isBoss = isBoss;
    this.maxHp = isBoss ? 450 : 100;
    this.hp = this.maxHp;
    this.isDead = false;

    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.root.position.copy(pos);

    this.scale = isBoss ? 1.8 : (0.85 + Math.random() * 0.3);
    this.root.scale.set(this.scale, this.scale, this.scale);

    // Físicas
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    this.isAirborne = false;
    this.moveSpeed = isBoss ? 3.5 : (4.0 + Math.random() * 2.5);

    // IA
    this.aiTimer = Math.random() * 2.0;
    this.targetPos = new THREE.Vector3().copy(pos);
    this.attackCooldown = 1.0;

    this.buildMesh();
  }

  buildMesh() {
    // 1. Base metálica
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x222736, roughness: 0.4 });
    this.baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.35, 16), baseMat);
    this.baseMesh.position.y = 0.18;
    this.baseMesh.castShadow = true;
    this.root.add(this.baseMesh);

    // 2. Torso
    const colors = [0xff2a4b, 0x00d2ff, 0xffa500, 0x9333ea, 0x10b981];
    const shirtColor = colors[this.id % colors.length];
    this.torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.9), new THREE.MeshStandardMaterial({ color: shirtColor }));
    this.torsoMesh.position.y = 1.2;
    this.torsoMesh.castShadow = true;
    this.root.add(this.torsoMesh);

    // 3. Cabeza Calva
    this.headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffd2a6, roughness: 0.25, metalness: 0.1 })
    );
    this.headMesh.position.y = 2.4;
    this.headMesh.scale.set(1.0, 1.15, 1.0);
    this.headMesh.castShadow = true;
    this.root.add(this.headMesh);

    // Ojos
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), eyeMat);
    eyeL.position.set(-0.3, 2.6, 0.75);
    const pL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pupMat);
    pL.position.set(0, 0, 0.12);
    eyeL.add(pL);
    this.root.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), eyeMat);
    eyeR.position.set(0.3, 2.6, 0.75);
    const pR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pupMat);
    pR.position.set(0, 0, 0.12);
    eyeR.add(pR);
    this.root.add(eyeR);

    // Barra de vida 3D flotante
    const hpCanvas = document.createElement('canvas');
    hpCanvas.width = 128; hpCanvas.height = 24;
    this.hpCtx = hpCanvas.getContext('2d');
    this.hpTexture = new THREE.CanvasTexture(hpCanvas);
    const hpSpriteMat = new THREE.SpriteMaterial({ map: this.hpTexture });
    this.hpSprite = new THREE.Sprite(hpSpriteMat);
    this.hpSprite.position.set(0, 3.7, 0);
    this.hpSprite.scale.set(1.8, 0.35, 1.0);
    this.root.add(this.hpSprite);
    this.updateHpSprite();
  }

  updateHpSprite() {
    const ctx = this.hpCtx;
    ctx.clearRect(0, 0, 128, 24);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 128, 24);
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = pct > 0.4 ? '#00ff66' : '#ff2a4b';
    ctx.fillRect(4, 4, Math.floor(120 * pct), 16);
    this.hpTexture.needsUpdate = true;
  }

  applyHit(hitPoint, impulseVec, damage, isExplosion = false) {
    if (this.isDead) return;
    this.hp -= damage;
    this.updateHpSprite();

    if (isExplosion || impulseVec.length() > 22) {
      this.isAirborne = true;
      this.velocity.copy(impulseVec);
      this.velocity.y = Math.max(10, this.velocity.y + 12);
      this.angularVelocity.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8);
    } else {
      this.root.position.addScaledVector(impulseVec.clone().setY(0).normalize(), 0.6);
    }

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.isAirborne = true;
    this.velocity.set((Math.random() - 0.5) * 15, 16, (Math.random() - 0.5) * 15);
    this.angularVelocity.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
    setTimeout(() => {
      this.scene.remove(this.root);
    }, 1500);
  }

  update(dt, playerPos, stormRadius, stormCenter) {
    if (this.isDead) {
      this.velocity.y += -22.0 * dt;
      this.root.position.addScaledVector(this.velocity, dt);
      this.root.rotation.x += this.angularVelocity.x * dt;
      this.root.rotation.z += this.angularVelocity.z * dt;
      return;
    }

    // Físicas en el aire
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

    // IA: Movimiento y Persecución
    this.aiTimer -= dt;
    const distToPlayer = this.root.position.distanceTo(playerPos);

    if (distToPlayer < 35) {
      // Perseguir al jugador
      const dir = playerPos.clone().sub(this.root.position).setY(0).normalize();
      this.root.position.addScaledVector(dir, this.moveSpeed * dt);
      this.root.lookAt(playerPos.x, this.root.position.y, playerPos.z);
    } else {
      // Patrullar hacia el centro de la tormenta
      if (this.aiTimer <= 0) {
        this.aiTimer = 3.0 + Math.random() * 3.0;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (stormRadius * 0.8);
        this.targetPos.set(stormCenter.x + Math.cos(angle) * dist, 0, stormCenter.z + Math.sin(angle) * dist);
      }
      const dir = this.targetPos.clone().sub(this.root.position).setY(0).normalize();
      this.root.position.addScaledVector(dir, (this.moveSpeed * 0.6) * dt);
      this.root.lookAt(this.targetPos.x, this.root.position.y, this.targetPos.z);
    }
  }
}

// ==========================================
// 4. CLASE COFRE DE BOTÍN 3D (Loot Chest)
// ==========================================
class LootChest3D {
  constructor(scene, pos) {
    this.scene = scene;
    this.opened = false;
    this.mesh = new THREE.Group();

    // Caja dorada
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xffd200, roughness: 0.3, metalness: 0.8 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.8), boxMat);
    box.position.y = 0.4;
    box.castShadow = true;
    this.mesh.add(box);

    // Luz de brillo
    this.light = new THREE.PointLight(0xffd200, 1.2, 6);
    this.light.position.y = 0.8;
    this.mesh.add(this.light);

    this.mesh.position.copy(pos);
    this.scene.add(this.mesh);
  }

  open() {
    if (this.opened) return null;
    this.opened = true;
    this.mesh.scale.set(1.2, 0.6, 1.2);
    this.light.color.setHex(0x00ff66);
    return {
      shield: 50,
      coins: 100,
      weapon: ['rpg', 'shotgun', 'laser', 'bat'][Math.floor(Math.random() * 4)]
    };
  }
}

// ==========================================
// 5. MOTOR PRINCIPAL DEL JUEGO BATTLE ROYALE 3D
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

    // Estado del Jugador
    this.playerPos = new THREE.Vector3(0, 1.8, 20);
    this.playerVel = new THREE.Vector3(0, 0, 0);
    this.isGrounded = true;
    this.cameraPitch = 0;
    this.cameraYaw = 0;

    this.hp = 100;
    this.maxHp = 100;
    this.shield = 100;
    this.maxShield = 100;
    this.score = 0;
    this.coins = parseInt(localStorage.getItem('boxeo_coins')) || 0;
    this.kills = 0;

    this.activeWeapon = 'gloves';
    this.canAttack = true;
    this.attackCooldown = 0;

    // Modos y Mapas
    this.currentMode = 'royale'; // 'royale', 'horde', 'sandbox'
    this.currentMap = 'island'; // 'island', 'city', 'volcano', 'ring'

    // Tormenta Battle Royale
    this.stormRadius = 120.0;
    this.targetStormRadius = 20.0;
    this.stormCenter = new THREE.Vector3(0, 0, 0);
    this.stormTimer = 45;
    this.stormPhase = 1;

    // Entidades del Mundo
    this.enemies = [];
    this.chests = [];
    this.tntBarrels = [];
    this.projectiles = [];
    this.mapObjects = [];

    // Controles
    this.keys = {};
    this.joystickVector = { x: 0, y: 0 };
    this.isPointerLocked = false;

    // Minimapa
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas.getContext('2d');

    this.initLighting();
    this.initWeaponViewModels();
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
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x141b2d, 0.65);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    this.sunLight.position.set(40, 60, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);
  }

  // ==========================================
  // GENERADOR DE MAPAS / PAISAJES 3D
  // ==========================================
  loadMap(mapType) {
    this.currentMap = mapType;

    // Limpiar mapa previo
    this.mapObjects.forEach(obj => this.scene.remove(obj));
    this.mapObjects = [];
    this.enemies.forEach(e => this.scene.remove(e.root));
    this.enemies = [];
    this.chests.forEach(c => this.scene.remove(c.mesh));
    this.chests = [];
    this.tntBarrels.forEach(b => this.scene.remove(b.mesh));
    this.tntBarrels = [];

    document.getElementById('map-name-label').textContent =
      mapType === 'island' ? '🏝️ Isla Royale' :
      (mapType === 'city' ? '🏙️ Ciudad Neón' :
      (mapType === 'volcano' ? '🌋 Volcán Magma' : '🥊 Ring Boxeo'));

    if (mapType === 'island') {
      this.buildIslandMap();
    } else if (mapType === 'city') {
      this.buildCityMap();
    } else if (mapType === 'volcano') {
      this.buildVolcanoMap();
    } else {
      this.buildRingMap();
    }

    this.spawnStormMesh();
    this.spawnEnemiesForMode();
    this.spawnLootChests();
  }

  buildIslandMap() {
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.012);

    // Suelo verde con colinas
    const groundGeo = new THREE.PlaneGeometry(240, 240, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.mapObjects.push(ground);

    // Mar alrededor
    const oceanGeo = new THREE.PlaneGeometry(500, 500);
    const oceanMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.5;
    this.scene.add(ocean);
    this.mapObjects.push(ocean);

    // Palmeras y Rocas
    for (let i = 0; i < 28; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;
      if (Math.hypot(x, z) > 8) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 4.5, 8), new THREE.MeshStandardMaterial({ color: 0x854d0e }));
        trunk.position.set(x, 2.25, z);
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0x15803d }));
        leaves.position.set(x, 4.8, z);
        leaves.scale.set(1.4, 0.6, 1.4);
        this.scene.add(trunk); this.scene.add(leaves);
        this.mapObjects.push(trunk, leaves);
      }
    }
  }

  buildCityMap() {
    this.scene.background = new THREE.Color(0x090d16);
    this.scene.fog = new THREE.FogExp2(0x090d16, 0.02);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.mapObjects.push(ground);

    // Rascacielos con ventanas de neón
    for (let i = 0; i < 22; i++) {
      const h = 12 + Math.random() * 26;
      const w = 8 + Math.random() * 8;
      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      if (Math.hypot(x, z) > 10) {
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, w),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 })
        );
        building.position.set(x, h / 2, z);
        building.castShadow = true;
        this.scene.add(building);
        this.mapObjects.push(building);
      }
    }
  }

  buildVolcanoMap() {
    this.scene.background = new THREE.Color(0x200505);
    this.scene.fog = new THREE.FogExp2(0x200505, 0.025);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x18181b }));
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.mapObjects.push(ground);

    // Ríos de lava brillante
    const lava = new THREE.Mesh(new THREE.PlaneGeometry(160, 20), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
    lava.rotation.x = -Math.PI / 2;
    lava.position.y = 0.05;
    this.scene.add(lava);
    this.mapObjects.push(lava);
  }

  buildRingMap() {
    this.scene.background = new THREE.Color(0x0a0e1c);
    this.scene.fog = new THREE.FogExp2(0x0a0e1c, 0.03);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
    this.mapObjects.push(floor);

    // Ring central
    const ringPlat = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
    ringPlat.position.y = 0.4;
    this.scene.add(ringPlat);
    this.mapObjects.push(ringPlat);
  }

  spawnStormMesh() {
    if (this.stormMesh) this.scene.remove(this.stormMesh);
    const stormGeo = new THREE.CylinderGeometry(this.stormRadius, this.stormRadius, 60, 32, 1, true);
    const stormMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.stormMesh = new THREE.Mesh(stormGeo, stormMat);
    this.stormMesh.position.y = 30;
    this.scene.add(this.stormMesh);
    this.mapObjects.push(this.stormMesh);
  }

  spawnEnemiesForMode() {
    const count = this.currentMode === 'royale' ? 15 : (this.currentMode === 'horde' ? 8 : 4);
    for (let i = 1; i <= count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 14 + Math.random() * 50;
      const pos = new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      const isBoss = (i === count && this.currentMode === 'horde');
      const enemy = new PelonEnemy3D(this.scene, i, pos, isBoss);
      this.enemies.push(enemy);
    }
    document.getElementById('alive-count').textContent = this.enemies.length + 1;
  }

  spawnLootChests() {
    const chestPositions = [
      new THREE.Vector3(8, 0, 8),
      new THREE.Vector3(-15, 0, 18),
      new THREE.Vector3(25, 0, -20),
      new THREE.Vector3(-30, 0, -25),
      new THREE.Vector3(0, 0, -35)
    ];
    chestPositions.forEach(pos => {
      this.chests.push(new LootChest3D(this.scene, pos));
    });
  }

  // ==========================================
  // VIEWMODELS DE ARMAS
  // ==========================================
  initWeaponViewModels() {
    this.weaponGroup = new THREE.Group();
    this.camera.add(this.weaponGroup);
    this.scene.add(this.camera);

    const gunMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

    // 1. Guantes
    this.glovesModel = new THREE.Group();
    const gMat = new THREE.MeshStandardMaterial({ color: 0xff2a4b });
    const lG = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), gMat);
    lG.position.set(-0.32, -0.28, -0.6);
    const rG = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), gMat);
    rG.position.set(0.32, -0.28, -0.6);
    this.glovesModel.add(lG, rG);
    this.weaponGroup.add(this.glovesModel);

    // 2. Bate
    this.batModel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.85, 16), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
    this.batModel.position.set(0.35, -0.2, -0.5);
    this.batModel.rotation.z = -Math.PI / 4;
    this.weaponGroup.add(this.batModel);
    this.batModel.visible = false;

    // 3. Pistola
    this.pistolModel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.35), gunMat);
    this.pistolModel.position.set(0.28, -0.22, -0.5);
    this.weaponGroup.add(this.pistolModel);
    this.pistolModel.visible = false;

    // 4. Escopeta
    this.shotgunModel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16), gunMat);
    this.shotgunModel.rotation.x = Math.PI / 2;
    this.shotgunModel.position.set(0.28, -0.22, -0.55);
    this.weaponGroup.add(this.shotgunModel);
    this.shotgunModel.visible = false;

    // 5. RPG
    this.rpgModel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.0, 16), new THREE.MeshStandardMaterial({ color: 0x15803d }));
    this.rpgModel.rotation.x = Math.PI / 2;
    this.rpgModel.position.set(0.32, -0.15, -0.55);
    this.weaponGroup.add(this.rpgModel);
    this.rpgModel.visible = false;

    // 6. Láser
    this.laserModel = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.55), new THREE.MeshStandardMaterial({ color: 0x00d2ff }));
    this.laserModel.position.set(0.28, -0.22, -0.5);
    this.weaponGroup.add(this.laserModel);
    this.laserModel.visible = false;

    // 7. Granada
    this.grenadeModel = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshStandardMaterial({ color: 0x3f6212 }));
    this.grenadeModel.position.set(0.28, -0.25, -0.45);
    this.weaponGroup.add(this.grenadeModel);
    this.grenadeModel.visible = false;

    // 8. Botiquín
    this.medkitModel = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    this.medkitModel.position.set(0.28, -0.25, -0.45);
    this.weaponGroup.add(this.medkitModel);
    this.medkitModel.visible = false;
  }

  setWeapon(weaponId) {
    if (!WEAPONS_DATA[weaponId]) return;
    this.activeWeapon = weaponId;

    this.glovesModel.visible = (weaponId === 'gloves');
    this.batModel.visible = (weaponId === 'bat');
    this.pistolModel.visible = (weaponId === 'pistol');
    this.shotgunModel.visible = (weaponId === 'shotgun');
    this.rpgModel.visible = (weaponId === 'rpg');
    this.laserModel.visible = (weaponId === 'laser');
    this.grenadeModel.visible = (weaponId === 'grenade');
    this.medkitModel.visible = (weaponId === 'medkit');

    document.querySelectorAll('.weapon-slot').forEach(slot => {
      slot.classList.toggle('active', slot.dataset.weapon === weaponId);
    });
    const mAttackIcon = document.getElementById('m-attack-icon');
    if (mAttackIcon) mAttackIcon.textContent = WEAPONS_DATA[weaponId].icon;
  }

  // ==========================================
  // DISPARO Y ACCIONES
  // ==========================================
  executeAttack() {
    if (!this.canAttack) return;
    const w = WEAPONS_DATA[this.activeWeapon];

    if (w.type === 'heal') {
      this.useMedkit();
      return;
    }

    this.canAttack = false;
    this.attackCooldown = w.cooldown;

    // Retroceso visual
    this.weaponGroup.position.z += 0.08;
    setTimeout(() => { this.weaponGroup.position.z = 0; }, 70);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    if (w.type === 'melee') {
      if (w.id === 'gloves') this.sound.playPunch('hook');
      else this.sound.playBatHit();
      this.vibrate(20);

      this.checkHitEnemies(raycaster, w, 1);
    } else if (w.type === 'hitscan' || w.type === 'shotgun') {
      if (w.id === 'pistol') { this.sound.playPistolShot(); this.vibrate(25); }
      else { this.sound.playShotgunShot(); this.vibrate([35, 15, 35]); }

      const count = w.type === 'shotgun' ? 8 : 1;
      this.checkHitEnemies(raycaster, w, count);
    } else if (w.type === 'projectile') {
      this.fireRocket();
    } else if (w.type === 'laser') {
      this.fireLaser(w, raycaster);
    } else if (w.type === 'grenade') {
      this.throwGrenade();
    }
  }

  checkHitEnemies(raycaster, weapon, count = 1) {
    for (let i = 0; i < count; i++) {
      const spread = count > 1 ? 0.05 : 0.005;
      const r = new THREE.Raycaster();
      r.setFromCamera(new THREE.Vector2((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread), this.camera);

      // Comprobar cofres
      this.chests.forEach(c => {
        if (!c.opened) {
          const hits = r.intersectObject(c.mesh, true);
          if (hits.length > 0 && hits[0].distance < 6) {
            this.openChest(c);
          }
        }
      });

      // Comprobar Pelones
      for (let enemy of this.enemies) {
        if (enemy.isDead) continue;
        const hits = r.intersectObjects([enemy.headMesh, enemy.torsoMesh, enemy.baseMesh], true);
        if (hits.length > 0 && hits[0].distance <= weapon.range) {
          const hit = hits[0];
          const isHead = (hit.object === enemy.headMesh);
          const dmg = Math.round(weapon.damage * (isHead ? weapon.critMultiplier : 1.0));
          const dir = this.camera.getWorldDirection(new THREE.Vector3());
          enemy.applyHit(hit.point, dir.multiplyScalar(isHead ? 20 : 10), dmg);

          this.onDamageDealt(dmg, isHead, enemy);
          break;
        }
      }
    }
  }

  fireRocket() {
    this.sound.playRpgLaunch();
    this.vibrate(40);
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const rMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xff3300 }));
    rMesh.rotation.x = Math.PI / 2;
    rMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    rMesh.position.copy(this.camera.position).addScaledVector(dir, 0.8);
    this.scene.add(rMesh);

    this.projectiles.push({ mesh: rMesh, velocity: dir.multiplyScalar(35), life: 3.0, type: 'rocket' });
  }

  fireLaser(w, raycaster) {
    this.sound.playLaserShot();
    this.vibrate(15);
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const start = this.camera.position.clone().addScaledVector(dir, 0.5);
    const end = start.clone().addScaledVector(dir, 60);

    const laserLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([start, end]),
      new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 4 })
    );
    this.scene.add(laserLine);
    setTimeout(() => this.scene.remove(laserLine), 50);

    for (let enemy of this.enemies) {
      if (enemy.isDead) continue;
      const hits = raycaster.intersectObjects([enemy.headMesh, enemy.torsoMesh, enemy.baseMesh], true);
      if (hits.length > 0) {
        enemy.applyHit(hits[0].point, dir.multiplyScalar(12), w.damage);
        this.onDamageDealt(w.damage, false, enemy);
        break;
      }
    }
  }

  throwGrenade() {
    this.sound.playPunch('jab');
    const dir = this.camera.getWorldDirection(new THREE.Vector3());
    const gMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0x225522 }));
    gMesh.position.copy(this.camera.position).addScaledVector(dir, 0.6);
    this.scene.add(gMesh);

    this.projectiles.push({ mesh: gMesh, velocity: dir.multiplyScalar(20).add(new THREE.Vector3(0, 6, 0)), life: 1.6, type: 'grenade' });
  }

  useMedkit() {
    if (this.hp >= this.maxHp && this.shield >= this.maxShield) {
      this.setBanner('¡Ya tienes vida y escudo al máximo!');
      return;
    }
    this.hp = Math.min(this.maxHp, this.hp + 50);
    this.shield = Math.min(this.maxShield, this.shield + 50);
    this.sound.playCoin();
    this.vibrate([20, 40]);
    this.setBanner('🧪 ¡Salud y Escudo restaurados!');
    this.updateHUD();
  }

  createExplosion(pos, damage, radius) {
    this.sound.playExplosion();
    this.vibrate([60, 40, 90]);

    // Daño radial a enemigos
    this.enemies.forEach(e => {
      if (!e.isDead) {
        const dist = e.root.position.distanceTo(pos);
        if (dist <= radius) {
          const factor = 1.0 - (dist / radius);
          const impulse = e.root.position.clone().sub(pos).normalize().multiplyScalar(32 * factor);
          const dmg = Math.round(damage * factor);
          e.applyHit(pos, impulse, dmg, true);
          this.onDamageDealt(dmg, true, e);
        }
      }
    });

    // Daño al jugador si está cerca
    const distToP = this.playerPos.distanceTo(pos);
    if (distToP <= radius) {
      const pDmg = Math.round(damage * 0.4 * (1.0 - distToP / radius));
      this.takePlayerDamage(pDmg);
    }
  }

  openChest(chest) {
    const reward = chest.open();
    if (!reward) return;

    this.sound.playChestOpen();
    this.vibrate([30, 40, 60]);
    this.coins += reward.coins;
    this.shield = Math.min(this.maxShield, this.shield + reward.shield);
    this.setWeapon(reward.weapon);
    this.setBanner(`🎁 ¡Cofre abierto! Obtuviste: ${WEAPONS_DATA[reward.weapon].name} y +${reward.coins}🪙`);
    this.updateHUD();
  }

  onDamageDealt(dmg, isCrit, enemy) {
    const ch = document.getElementById('crosshair');
    ch.classList.add('hit');
    setTimeout(() => ch.classList.remove('hit'), 75);

    this.score += dmg * 10;
    this.coins += Math.max(1, Math.round(dmg / 6));
    localStorage.setItem('boxeo_coins', this.coins);

    if (enemy.isDead) {
      this.kills++;
      this.addKillfeed(`${enemy.name} eliminado`);
      this.checkRemainingEnemies();
    }
    this.updateHUD();
  }

  addKillfeed(msg) {
    const feed = document.getElementById('killfeed');
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    entry.textContent = `💀 ${msg}`;
    feed.appendChild(entry);
    setTimeout(() => { if (entry.parentNode) entry.remove(); }, 3500);
  }

  checkRemainingEnemies() {
    const alive = this.enemies.filter(e => !e.isDead).length;
    document.getElementById('alive-count').textContent = alive + 1;

    if (alive === 0 && this.currentMode === 'royale') {
      this.triggerVictory();
    }
  }

  triggerVictory() {
    this.sound.playVictoryFanfare();
    this.vibrate([80, 50, 120, 50, 200]);
    document.getElementById('v-kills').textContent = this.kills;
    document.getElementById('v-damage').textContent = this.score;
    this.coins += 500;
    localStorage.setItem('boxeo_coins', this.coins);
    document.getElementById('victory-modal').classList.remove('hidden');
  }

  takePlayerDamage(amount) {
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, amount);
      this.shield -= absorbed;
      amount -= absorbed;
    }
    if (amount > 0) {
      this.hp = Math.max(0, this.hp - amount);
    }
    this.vibrate(30);

    if (this.hp <= 0) {
      this.triggerGameOver();
    }
    this.updateHUD();
  }

  triggerGameOver() {
    document.getElementById('go-kills').textContent = this.kills;
    document.getElementById('go-coins').textContent = `+${this.kills * 20}🪙`;
    document.getElementById('gameover-modal').classList.remove('hidden');
  }

  setBanner(msg) {
    const b = document.getElementById('status-banner');
    b.textContent = msg;
    b.style.transform = 'translateX(-50%) scale(1.1)';
    setTimeout(() => { b.style.transform = 'translateX(-50%) scale(1)'; }, 200);
  }

  // ==========================================
  // EVENTOS Y CONTROLES
  // ==========================================
  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.key >= '1' && e.key <= '8') {
        const list = ['gloves', 'bat', 'pistol', 'shotgun', 'rpg', 'laser', 'grenade', 'medkit'];
        this.setWeapon(list[parseInt(e.key) - 1]);
      } else if (e.code === 'KeyE') {
        // Abrir cofre más cercano
        this.chests.forEach(c => {
          if (!c.opened && c.mesh.position.distanceTo(this.playerPos) < 5) {
            this.openChest(c);
          }
        });
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
      document.getElementById('pause-overlay').classList.toggle('hidden', this.isPointerLocked || window.innerWidth <= 768);
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

    // Selector de armas
    document.querySelectorAll('.weapon-slot').forEach(s => {
      s.addEventListener('click', () => this.setWeapon(s.dataset.weapon));
    });

    // Controles táctiles
    this.initTouchControls();

    // Modales y menús
    document.getElementById('btn-open-maps').addEventListener('click', () => document.getElementById('maps-modal').classList.remove('hidden'));
    document.getElementById('btn-close-maps').addEventListener('click', () => document.getElementById('maps-modal').classList.add('hidden'));

    document.getElementById('btn-open-modes').addEventListener('click', () => document.getElementById('modes-modal').classList.remove('hidden'));
    document.getElementById('btn-close-modes').addEventListener('click', () => document.getElementById('modes-modal').classList.add('hidden'));

    document.getElementById('btn-open-shop').addEventListener('click', () => {
      document.getElementById('shop-modal').classList.remove('hidden');
      document.getElementById('shop-coins-display').textContent = this.coins.toLocaleString();
    });
    document.getElementById('btn-close-shop').addEventListener('click', () => document.getElementById('shop-modal').classList.add('hidden'));

    document.getElementById('btn-start-game').addEventListener('click', () => {
      document.getElementById('start-overlay').classList.add('hidden');
      this.sound.init();
      this.sound.playBell();
    });

    document.getElementById('btn-restart-royale').addEventListener('click', () => {
      document.getElementById('victory-modal').classList.add('hidden');
      this.loadMap(this.currentMap);
    });

    document.getElementById('btn-respawn').addEventListener('click', () => {
      document.getElementById('gameover-modal').classList.add('hidden');
      this.hp = 100;
      this.shield = 100;
      this.playerPos.set(0, 1.8, 20);
      this.updateHUD();
    });

    document.getElementById('btn-spawn-enemy').addEventListener('click', () => {
      const p = this.playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 10, 0, (Math.random() - 0.5) * 10));
      this.enemies.push(new PelonEnemy3D(this.scene, this.enemies.length + 1, p));
      this.checkRemainingEnemies();
      this.setBanner('➕ ¡Nuevo Pelón enemigo generado!');
    });

    // Selector de mapas modal
    document.querySelectorAll('.map-card').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.map-card').forEach(mc => mc.classList.remove('active'));
        c.classList.add('active');
        this.loadMap(c.dataset.map);
        document.getElementById('maps-modal').classList.add('hidden');
      });
    });

    // Selector de modos modal
    document.querySelectorAll('.mode-card').forEach(m => {
      m.addEventListener('click', () => {
        document.querySelectorAll('.mode-card').forEach(mc => mc.classList.remove('active'));
        m.classList.add('active');
        this.currentMode = m.dataset.mode;
        document.getElementById('current-mode-label').textContent = m.querySelector('.mode-title').textContent.split(' ')[0];
        document.getElementById('modes-modal').classList.add('hidden');
        this.loadMap(this.currentMap);
      });
    });

    document.getElementById('btn-sound').addEventListener('click', () => {
      const on = this.sound.toggle();
      document.getElementById('sound-icon').textContent = on ? '🔊' : '🔇';
    });

    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    });
  }

  initTouchControls() {
    const zone = document.getElementById('joystick-zone');
    const stick = document.getElementById('joystick-stick');
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
          stick.style.transform = `translate(${sx}px, ${sy}px)`;
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

    // Look Touch
    const lookZone = document.getElementById('touch-look-zone');
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

    // Botones móviles
    const mAtk = document.getElementById('m-btn-attack');
    const mJmp = document.getElementById('m-btn-jump');
    const mChest = document.getElementById('m-btn-chest');
    const mTnt = document.getElementById('m-btn-tnt');

    if (mAtk) mAtk.addEventListener('touchstart', (e) => { e.preventDefault(); this.sound.init(); this.executeAttack(); }, { passive: false });
    if (mJmp) mJmp.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.isGrounded) { this.playerVel.y = 8.5; this.isGrounded = false; }
    }, { passive: false });
    if (mChest) mChest.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.chests.forEach(c => {
        if (!c.opened && c.mesh.position.distanceTo(this.playerPos) < 6) this.openChest(c);
      });
    }, { passive: false });
    if (mTnt) mTnt.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.throwGrenade();
    }, { passive: false });
  }

  // ==========================================
  // LOOP PRINCIPAL Y MINIMAPA
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

    // Tormenta Battle Royale
    if (this.currentMode === 'royale') {
      this.stormTimer -= dt;
      if (this.stormTimer <= 0) {
        this.stormTimer = 45;
        this.stormPhase++;
        this.targetStormRadius = Math.max(8, this.targetStormRadius * 0.65);
      }
      document.getElementById('storm-timer').textContent = `0:${Math.ceil(this.stormTimer).toString().padStart(2, '0')}`;

      // Encoger radio
      if (this.stormRadius > this.targetStormRadius) {
        this.stormRadius -= 2.5 * dt;
        this.stormMesh.scale.set(this.stormRadius / 120, 1, this.stormRadius / 120);
      }

      // Daño por tormenta
      const distToStormCenter = Math.hypot(this.playerPos.x - this.stormCenter.x, this.playerPos.z - this.stormCenter.z);
      const isOutside = distToStormCenter > this.stormRadius;
      document.getElementById('storm-warning').classList.toggle('hidden', !isOutside);
      if (isOutside) {
        this.takePlayerDamage(4 * dt);
      }
    }

    // Movimiento Jugador
    this.updatePlayer(dt);

    // Actualizar Enemigos
    this.enemies.forEach(e => e.update(dt, this.playerPos, this.stormRadius, this.stormCenter));

    // Proyectiles
    this.updateProjectiles(dt);
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

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.life -= dt;
      p.mesh.position.addScaledVector(p.velocity, dt);

      if (p.type === 'rocket') {
        for (let enemy of this.enemies) {
          if (!enemy.isDead && p.mesh.position.distanceTo(enemy.root.position) < 2.0) {
            this.createExplosion(p.mesh.position, 140, 7.0);
            this.scene.remove(p.mesh);
            this.projectiles.splice(i, 1);
            break;
          }
        }
      }

      if (p.life <= 0) {
        if (p.type === 'grenade') this.createExplosion(p.mesh.position, 100, 6.0);
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  renderMinimap() {
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

    // Cofres
    ctx.fillStyle = '#ffd200';
    this.chests.forEach(c => {
      if (!c.opened) {
        const mx = cx + (c.mesh.position.x - this.playerPos.x) * scale;
        const my = cy + (c.mesh.position.z - this.playerPos.z) * scale;
        ctx.fillRect(mx - 2, my - 2, 4, 4);
      }
    });

    // Enemigos
    ctx.fillStyle = '#ff2a4b';
    this.enemies.forEach(e => {
      if (!e.isDead) {
        const mx = cx + (e.root.position.x - this.playerPos.x) * scale;
        const my = cy + (e.root.position.z - this.playerPos.z) * scale;
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Jugador (Punto cyan central con flecha de dirección)
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
    document.getElementById('score-display').textContent = this.score.toLocaleString();
    document.getElementById('coins-display').textContent = this.coins.toLocaleString();
    document.getElementById('kills-count').textContent = this.kills;

    // Salud & Escudo
    const hpPct = Math.max(0, (this.hp / this.maxHp) * 100);
    document.getElementById('hp-fill').style.width = `${hpPct}%`;
    document.getElementById('hp-val-text').textContent = `${Math.round(this.hp)} / ${this.maxHp}`;

    const shPct = Math.max(0, (this.shield / this.maxShield) * 100);
    document.getElementById('shield-fill').style.width = `${shPct}%`;
    document.getElementById('shield-val-text').textContent = `${Math.round(this.shield)} / ${this.maxShield}`;
  }

  initShop() {
    const wGrid = document.getElementById('weapons-grid');
    wGrid.innerHTML = '';
    Object.values(WEAPONS_DATA).forEach(w => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-icon">${w.icon}</div>
        <div class="shop-card-title">${w.name}</div>
        <button class="shop-card-btn btn-buy">EQUIPAR</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        this.setWeapon(w.id);
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

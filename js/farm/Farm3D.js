/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Farm3D: Escenario 3D de la Granja Universitaria & Navegación por Zonas
 */

import { store } from "../core/Store.js";

export class Farm3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.worldGroup = new THREE.Group();
    this.zonesGroup = new THREE.Group();
    this.natureGroup = new THREE.Group();
    this.interactiveObjects = [];

    // Cámara y Puntos de Vista de Zonas de la Granja
    this.cameraTargets = {
      overview: { pos: new THREE.Vector3(12, 9, 14), look: new THREE.Vector3(0, 1.0, 0) },
      pasture:  { pos: new THREE.Vector3(-6, 4.5, 5), look: new THREE.Vector3(-3.5, 0.6, 0) },
      stable:   { pos: new THREE.Vector3(6, 4, -1),   look: new THREE.Vector3(3.5, 0.8, -2) },
      feeder:   { pos: new THREE.Vector3(0, 3.5, 6),  look: new THREE.Vector3(0, 0.8, 2.4) }
    };

    this.currentLookAt = new THREE.Vector3(0, 1.0, 0);
    this.targetCameraPos = this.cameraTargets.overview.pos.clone();
    this.targetLookAt = this.cameraTargets.overview.look.clone();

    this.orbit = {
      down: false,
      lastX: 0,
      lastY: 0,
      rotX: 0.45,
      rotY: 0.75,
      dist: 16.0,
      isTransitioning: false
    };

    this.init();
  }

  init() {
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a1922, 0.022);

    const width = this.canvas.clientWidth || 800;
    const height = this.canvas.clientHeight || 520;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    this.camera.position.copy(this.targetCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (this.renderer.outputEncoding !== undefined) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    this.setupLighting();
    this.scene.add(this.worldGroup);
    this.worldGroup.add(this.zonesGroup);
    this.worldGroup.add(this.natureGroup);

    this.buildFarmEnvironment();
    this.loadNatureProps();
    this.setupControls();

    window.addEventListener("resize", () => this.onResize());
    this.animate();
  }

  setupLighting() {
    const hemi = new THREE.HemisphereLight(0xdff9fb, 0x13242b, 1.8);
    this.scene.add(hemi);

    this.sun = new THREE.DirectionalLight(0xffffff, 2.2);
    this.sun.position.set(8, 14, 9);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.width = 1024;
    this.sun.shadow.mapSize.height = 1024;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 40;
    this.sun.shadow.camera.left = -12;
    this.sun.shadow.camera.right = 12;
    this.sun.shadow.camera.top = 12;
    this.sun.shadow.camera.bottom = -12;
    this.sun.shadow.bias = -0.0005;
    this.scene.add(this.sun);
  }

  mat(color, rough = 0.75, metal = 0.05) {
    return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  }

  buildFarmEnvironment() {
    // 1. Suelo Principal de la Granja (Terreno)
    const groundGeo = new THREE.BoxGeometry(22, 0.6, 16);
    const ground = new THREE.Mesh(groundGeo, this.mat(0x16382c, 0.85));
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    this.zonesGroup.add(ground);

    // 2. Zona de Potrero / Pastoreo (Izquierda)
    const pastureGeo = new THREE.BoxGeometry(9.5, 0.15, 13.5);
    const pasture = new THREE.Mesh(pastureGeo, this.mat(0x27593f, 0.7));
    pasture.position.set(-5.5, 0.08, 0);
    pasture.receiveShadow = true;
    pasture.userData = { zoneId: "pasture", label: "Potrero de Pastoreo Rotacional" };
    this.zonesGroup.add(pasture);
    this.interactiveObjects.push(pasture);

    // 3. Zona de Establo y Manejo (Derecha)
    const stableFloor = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.15, 13.5), this.mat(0x524438, 0.9));
    stableFloor.position.set(5.5, 0.08, 0);
    stableFloor.receiveShadow = true;
    stableFloor.userData = { zoneId: "stable", label: "Establo & Área de Manejo" };
    this.zonesGroup.add(stableFloor);
    this.interactiveObjects.push(stableFloor);

    // Estructura de Establo
    const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.8, 4), this.mat(0x8a4b38, 0.7));
    barnRoof.rotation.y = Math.PI / 4;
    barnRoof.position.set(6.5, 2.9, -3.5);
    this.zonesGroup.add(barnRoof);

    const barnBody = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 3.2), this.mat(0x6b372a, 0.8));
    barnBody.position.set(6.5, 1.0, -3.5);
    barnBody.castShadow = true;
    barnBody.receiveShadow = true;
    this.zonesGroup.add(barnBody);

    // 4. Comedero Central y Bebedero
    const trough = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 0.9), this.mat(0x423326, 0.7));
    trough.position.set(0, 0.25, 2.4);
    trough.castShadow = true;
    trough.receiveShadow = true;
    trough.userData = { zoneId: "feeder", label: "Comedero de Suplementación" };
    this.zonesGroup.add(trough);
    this.interactiveObjects.push(trough);

    // Cercas perimetrales y divisorias
    const fenceMat = this.mat(0x785a42, 0.8);
    for (let x = -10; x <= 10; x += 2.0) {
      for (const z of [-7.2, 7.2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.15, 0.16), fenceMat);
        post.position.set(x, 0.6, z);
        post.castShadow = true;
        this.zonesGroup.add(post);
      }
    }
    // Cerca divisoria central
    for (let z = -6.5; z <= 6.5; z += 1.8) {
      if (Math.abs(z) > 1.2) { // Dejar paso libre
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.14), fenceMat);
        post.position.set(0, 0.55, z);
        post.castShadow = true;
        this.zonesGroup.add(post);
      }
    }
  }

  loadNatureProps() {
    if (typeof THREE.GLTFLoader === "undefined") return;
    const loader = new THREE.GLTFLoader();

    const assets = [
      // Modelos de Vegetación y Terreno
      { url: "models/nature/TreeHigh001.glb", pos: [-9.5, 0, -6.0], scale: 1.8 },
      { url: "models/nature/TreeMed001.glb",  pos: [-9.0, 0,  5.5], scale: 1.6 },
      { url: "models/nature/TreeMed002.glb",  pos: [ 9.5, 0, -6.0], scale: 1.6 },
      { url: "models/polyfork/PineTree.glb",  pos: [ 9.2, 0,  5.8], scale: 1.6 },
      { url: "models/polyfork/MapleTree.glb", pos: [-2.0, 0, -6.5], scale: 1.5 },
      { url: "models/nature/Bush001.glb",     pos: [-7.0, 0, -6.5], scale: 1.3 },
      { url: "models/nature/Bush002.glb",     pos: [ 4.0, 0,  6.2], scale: 1.2 },
      { url: "models/nature/Rock001.glb",     pos: [-8.5, 0,  2.0], scale: 1.3 },
      { url: "models/nature/Grass001.glb",    pos: [-4.0, 0,  2.5], scale: 1.2 },

      // Modelos de Infraestructura Agropecuaria (Polyfork)
      { url: "models/polyfork/ToolShed.glb",    pos: [ 7.2, 0, -5.2], scale: 1.6 },
      { url: "models/polyfork/WaterTrough.glb", pos: [-1.2, 0,  2.8], scale: 1.5 },
      { url: "models/polyfork/HayBale.glb",     pos: [-3.8, 0,  4.2], scale: 1.4 },
      { url: "models/polyfork/HayBale.glb",     pos: [-3.3, 0.4, 4.2], scale: 1.4 },
      { url: "models/polyfork/Wheelbarrow.glb", pos: [ 2.2, 0,  3.2], scale: 1.3 },
      { url: "models/polyfork/WoodenCrate.glb", pos: [ 4.8, 0,  4.8], scale: 1.4 },
      { url: "models/polyfork/WoodenBarrel.glb",pos: [ 1.5, 0,  4.5], scale: 1.4 },
      { url: "models/polyfork/CropPlant.glb",   pos: [-7.5, 0,  4.5], scale: 1.3 },
      { url: "models/polyfork/CropPlant.glb",   pos: [-7.5, 0,  3.2], scale: 1.3 }
    ];

    assets.forEach(item => {
      loader.load(item.url, gltf => {
        const prop = gltf.scene;
        
        // Auto-normalización de dimensiones para evitar modelos con escalas desproporcionadas
        const box = new THREE.Box3().setFromObject(prop);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetDim = item.targetDim || (item.scale * 1.2);
        const factor = targetDim / maxDim;

        prop.scale.setScalar(factor);
        prop.position.set(item.pos[0], 0, item.pos[2]);

        const updatedBox = new THREE.Box3().setFromObject(prop);
        prop.position.y = -updatedBox.min.y; // Apoyar exactamente sobre el suelo

        prop.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        this.natureGroup.add(prop);
      }, undefined, () => {});
    });
  }

  setZone(zoneId) {
    if (this.cameraTargets[zoneId]) {
      this.targetCameraPos.copy(this.cameraTargets[zoneId].pos);
      this.targetLookAt.copy(this.cameraTargets[zoneId].look);
      this.orbit.isTransitioning = true;
      store.set("currentZone", zoneId);
    }
  }

  setupControls() {
    this.canvas.addEventListener("pointerdown", e => {
      this.orbit.down = true;
      this.orbit.lastX = e.clientX;
      this.orbit.lastY = e.clientY;
      this.orbit.isTransitioning = false;
    });

    window.addEventListener("pointerup", () => this.orbit.down = false);

    window.addEventListener("pointermove", e => {
      if (!this.orbit.down) return;
      this.orbit.rotY -= (e.clientX - this.orbit.lastX) * 0.005;
      this.orbit.rotX = Math.max(-0.6, Math.min(1.2, this.orbit.rotX + (e.clientY - this.orbit.lastY) * 0.005));
      this.orbit.lastX = e.clientX;
      this.orbit.lastY = e.clientY;
      this.updateCameraOrbit();
    });

    this.canvas.addEventListener("wheel", e => {
      e.preventDefault();
      this.orbit.dist = Math.max(6.0, Math.min(26.0, this.orbit.dist + e.deltaY * 0.012));
      this.updateCameraOrbit();
    }, { passive: false });
  }

  updateCameraOrbit() {
    if (this.orbit.isTransitioning) return;
    this.camera.position.x = this.currentLookAt.x + Math.sin(this.orbit.rotY) * Math.cos(this.orbit.rotX) * this.orbit.dist;
    this.camera.position.y = this.currentLookAt.y + 2.5 + Math.sin(this.orbit.rotX) * this.orbit.dist;
    this.camera.position.z = this.currentLookAt.z + Math.cos(this.orbit.rotY) * Math.cos(this.orbit.rotX) * this.orbit.dist;
    this.camera.lookAt(this.currentLookAt);
  }

  onResize() {
    if (!this.renderer || !this.canvas) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Transición suave de cámara hacia la zona objetivo
    if (this.orbit.isTransitioning) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.currentLookAt.lerp(this.targetLookAt, 0.05);
      this.camera.lookAt(this.currentLookAt);

      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.1) {
        this.orbit.isTransitioning = false;
      }
    }

    // Efecto Anti-Gravedad si está activo
    const isGravity = store.get("gravity");
    if (isGravity) {
      this.worldGroup.rotation.y = Math.sin(performance.now() * 0.0003) * 0.03;
    } else {
      this.worldGroup.rotation.y = 0;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

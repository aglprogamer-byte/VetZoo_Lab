/**
 * ZOOTECNIA 3D - Granja Escuela Virtual
 * Farm: AnimalManager.js - Gestión de Entidades Animales 3D, Modelos GLB y Animaciones
 */

import { store, ACTION_TYPES } from "../core/Store.js";
import { AudioFx } from "../core/SimEngine.js";

export class AnimalManager {
  constructor(farm3D, { storeInstance = store } = {}) {
    this.farm = farm3D;
    this.store = storeInstance;
    this.animalsGroup = new THREE.Group();
    this.farm.worldGroup.add(this.animalsGroup);

    this.entities = {};
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.modelPaths = {
      vaca: "models/cow.glb",
      caballo: "models/horse.glb",
      oveja: "models/sheep.glb",
      cerdo: "models/pig.glb"
    };

    // Posiciones en el mapa universitario
    this.defaultPositions = {
      cow_017:   { pos: new THREE.Vector3(-3.2, 0.1, 1.5), rot: 0.3,  scaleTarget: 2.5 },
      horse_004: { pos: new THREE.Vector3( 4.5, 0.1, -1.2), rot: -0.6, scaleTarget: 2.5 },
      sheep_031: { pos: new THREE.Vector3(-6.0, 0.1, -2.5), rot: 1.1,  scaleTarget: 1.6 },
      pig_088:   { pos: new THREE.Vector3( 5.5, 0.1, 3.5),  rot: -1.8, scaleTarget: 1.5 }
    };

    this.init();
  }

  init() {
    this.loadAllAnimals();
    this.setupInteraction();
  }

  loadAllAnimals() {
    const loader = new THREE.GLTFLoader();
    const animals = store.get("animals");

    for (const id in animals) {
      const data = animals[id];
      const url = this.modelPaths[data.species] || "models/cow.glb";
      const config = this.defaultPositions[id] || { pos: new THREE.Vector3(0, 0.1, 0), rot: 0, scaleTarget: 2.0 };

      const animalContainer = new THREE.Group();
      animalContainer.position.copy(config.pos);
      animalContainer.rotation.y = config.rot;
      animalContainer.userData = { animalId: id, species: data.species };
      this.animalsGroup.add(animalContainer);

      const entity = {
        id,
        data,
        container: animalContainer,
        model: null,
        mixer: null,
        clipDuration: 0,
        animTime: 0,
        currentSegment: { from: 0, to: 29, loop: true, fps: 24, name: "idle" }
      };
      this.entities[id] = entity;

      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          entity.model = model;

          model.traverse(obj => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
              if (obj.material) {
                obj.material.roughness = 0.75;
                obj.material.metalness = 0.05;
              }
            }
          });

          // Auto-normalización de dimensiones y centrado
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);

          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scaleFactor = config.scaleTarget / maxDim;
          model.scale.setScalar(scaleFactor);

          const updatedBox = new THREE.Box3().setFromObject(model);
          model.position.x = -center.x * scaleFactor;
          model.position.y = -updatedBox.min.y;
          model.position.z = -center.z * scaleFactor;

          // Animación controlada por frame scrubbing
          if (gltf.animations && gltf.animations.length > 0) {
            entity.mixer = new THREE.AnimationMixer(model);
            const clip = gltf.animations[0];
            entity.clipDuration = clip.duration;
            const action = entity.mixer.clipAction(clip);
            action.play();
          }

          animalContainer.add(model);
        },
        undefined,
        () => {
          // Fallback procedural en caso de ausencia de archivo
          this.createFallbackModel(entity, config.scaleTarget);
        }
      );
    }

    this.startAnimationLoop();
  }

  createFallbackModel(entity, targetScale) {
    const colors = { vaca: 0xe7e2d4, caballo: 0x8b5a2b, cerdo: 0xf1a8a8, oveja: 0xd8d8d8 };
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.0, 1),
      new THREE.MeshStandardMaterial({ color: colors[entity.data.species] || 0xe7e2d4, roughness: 0.8 })
    );
    body.scale.set(1.3, 0.8, 0.8);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.55, 1),
      new THREE.MeshStandardMaterial({ color: colors[entity.data.species] || 0xe7e2d4, roughness: 0.8 })
    );
    head.position.set(0.9, 1.1, 0);
    head.castShadow = true;
    group.add(head);

    group.scale.setScalar(targetScale * 0.5);
    entity.model = group;
    entity.container.add(group);
  }

  setAnimation(animalId, animKey, durationMs = null) {
    const entity = this.entities[animalId];
    if (!entity) return;

    const segments = {
      idle:   { from: 0,  to: 29, loop: true,  fps: 24, name: "idle" },
      attack: { from: 30, to: 59, loop: false, fps: 24, name: "attack" },
      dead:   { from: 60, to: 89, loop: false, fps: 24, name: "dead" },
      walk:   { from: 90, to: 119, loop: true, fps: 24, name: "walk" }
    };

    entity.currentSegment = segments[animKey] || segments.idle;
    entity.animTime = 0;

    if (durationMs) {
      setTimeout(() => {
        entity.currentSegment = segments.idle;
        entity.animTime = 0;
      }, durationMs);
    }
  }

  setupInteraction() {
    this.farm.canvas.addEventListener("click", e => {
      const rect = this.farm.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.farm.camera);
      const hits = this.raycaster.intersectObjects(this.animalsGroup.children, true);

      if (hits.length > 0) {
        let parent = hits[0].object;
        while (parent && !parent.userData.animalId && parent !== this.animalsGroup) {
          parent = parent.parent;
        }

        if (parent && parent.userData.animalId) {
          const animalId = parent.userData.animalId;
          store.set("selectedAnimalId", animalId);
          store.emit("animal:selected", store.get("animals")[animalId]);
          this.setAnimation(animalId, "idle", 1500);
          AudioFx.click();
        }
      }
    });
  }

  startAnimationLoop() {
    const update = () => {
      requestAnimationFrame(update);
      const delta = this.clock.getDelta();

      for (const id in this.entities) {
        const entity = this.entities[id];
        if (entity.mixer && entity.clipDuration > 0) {
          entity.animTime += delta;
          const seg = entity.currentSegment;
          const startTime = seg.from / seg.fps;
          const endTime = seg.to / seg.fps;
          const dur = Math.max(0.01, endTime - startTime);

          let sampleTime;
          if (seg.loop) {
            sampleTime = startTime + (entity.animTime % dur);
          } else {
            sampleTime = startTime + Math.min(entity.animTime, dur);
          }

          entity.mixer.setTime(Math.min(sampleTime, entity.clipDuration));
        }
      }
    };
    update();
  }
}

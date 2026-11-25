import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getCharacter, getCharacterUrl } from '../../data/characters';
import { useCharacterStore } from '../../stores/characterStore';
import { usePlayerStore } from '../../stores/playerStore';

/**
 * Adapta o personagem equipado à camada Three.js que o mapa já usa.
 * Não cria uma segunda camada MapLibre e não altera encontros.
 */
export function createMapCharacterController(scene, map) {
  const loader = new GLTFLoader();
  const clock = new THREE.Clock();
  let model = null;
  let mixer = null;
  let actions = {};
  let activeAnimation = '';
  let generation = 0;
  let lastPosition = null;
  let movingUntil = 0;
  let disposed = false;

  const selectAnimation = (name) => {
    if (!actions[name] || activeAnimation === name) return;
    const previous = actions[activeAnimation];
    actions[name].reset().fadeIn(0.2).play();
    if (previous) previous.fadeOut(0.2);
    activeAnimation = name;
  };

  const load = (id) => {
    const request = ++generation;
    loader.load(getCharacterUrl(getCharacter(id)), (gltf) => {
      if (disposed || request !== generation) return;
      if (model) scene.remove(model);
      if (mixer) mixer.stopAllAction();
      model = gltf.scene;

      // Normaliza a altura da malha para aproximadamente 1,6 unidade do mapa.
      // Pode ser ajustado após visualização no dispositivo.
      const bounds = new THREE.Box3().setFromObject(model);
      const height = bounds.getSize(new THREE.Vector3()).y;
      if (height > 0) model.scale.setScalar(1.6 / height);
      const bottom = new THREE.Box3().setFromObject(model).min.y;
      model.position.y = -bottom;
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      actions = {};
      for (const clip of gltf.animations) {
        if (clip.name === 'Idle' || clip.name === 'Walk') {
          actions[clip.name] = mixer.clipAction(clip);
        }
      }
      activeAnimation = '';
      selectAnimation('Idle');
      map.triggerRepaint();
    }, undefined, (error) => console.error('Falha ao carregar personagem no mapa:', id, error));
  };

  const unsubscribeCharacter = useCharacterStore.subscribe((next, previous) => {
    if (next.equippedId !== previous.equippedId) load(next.equippedId);
  });
  const unsubscribePlayer = usePlayerStore.subscribe((state) => {
    const lat = state.latitude;
    const lng = state.longitude;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (!lastPosition) {
      lastPosition = { lat, lng };
      return;
    }

    const dLat =
      (lat - lastPosition.lat) * 111_000;

    const dLng =
      (lng - lastPosition.lng) *
      111_000 *
      Math.cos(lat * Math.PI / 180);

    const distance = Math.hypot(dLat, dLng);

    // Ignora oscilações pequenas e saltos absurdos do GPS.
    if (distance >= 0.7 && distance <= 100) {
      movingUntil = performance.now() + 1400;
      lastPosition = { lat, lng };
    }

    // Em caso de salto muito grande, redefine a referência.
    if (distance > 100) {
      lastPosition = { lat, lng };
    }
  });

  load(useCharacterStore.getState().equippedId);

  return {
    update() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (mixer) mixer.update(dt);
      selectAnimation(performance.now() < movingUntil ? 'Walk' : 'Idle');
      if (mixer) map.triggerRepaint();
    },
    dispose() {
      disposed = true;
      generation += 1;
      unsubscribeCharacter();
      unsubscribePlayer();
      if (mixer) mixer.stopAllAction();
      if (model) scene.remove(model);
    },
  };
}

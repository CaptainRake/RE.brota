import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@google/model-viewer';

import { useProgressStore } from '../stores/progressStore';
import { useCharacterStore } from '../stores/characterStore';
import { characters, getCharacterUrl } from '../data/characters';

function CharacterPreview({ character, active = false }) {
  const modelRef = useRef(null);

  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    function playIdle() {
      if (model.availableAnimations?.includes('Idle')) {
        model.animationName = 'Idle';
        model.currentTime = 0;
        model.play();
      }
    }

    model.addEventListener('load', playIdle);
    if (model.loaded) playIdle();

    return () => model.removeEventListener('load', playIdle);
  }, [character.id]);

  return (
    <model-viewer
      ref={modelRef}
      src={getCharacterUrl(character)}
      alt={`Personagem 3D: ${character.name}`}
      {...(active ? { 'camera-controls': true } : {})}
      autoplay
      animation-name="Idle"
      animation-crossfade-duration="0"
      interaction-prompt="none"
      camera-orbit="180deg 75deg auto"
      shadow-intensity="0.8"
      exposure="1"
      class="shop-character-model"
    />
  );
}

export default function Shop() {
  const navigate = useNavigate();
  const leaves = useProgressStore((state) => state.leaves ?? 0);
  const equippedId = useCharacterStore((state) => state.equippedId);
  const unlockedIds = useCharacterStore((state) => state.unlockedIds);
  const purchaseCharacter = useCharacterStore((state) => state.purchaseCharacter);
  const equipCharacter = useCharacterStore((state) => state.equipCharacter);

  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState('');

  const character = characters[activeIndex];
  const owned = unlockedIds.includes(character.id);
  const equipped = equippedId === character.id;
  // Distância circular: mantém cada GLB montado enquanto desliza.
  function getOffset(index) {
    const count = characters.length;
    let offset = (index - activeIndex + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  }

  function navigateCarousel(step) {
    setMessage('');
    setActiveIndex((index) => (index + step + characters.length) % characters.length);
  }

  function handleAction() {
    if (equipped) return;
    if (owned) {
      equipCharacter(character.id);
      setMessage(`${character.name} equipado!`);
      return;
    }
    const result = purchaseCharacter(character.id);
    if (result.ok) {
      setMessage(`${character.name} desbloqueado e equipado!`);
    } else if (result.reason === 'funds') {
      setMessage('Você ainda não tem folhas suficientes.');
    } else {
      setMessage('Não foi possível realizar a compra.');
    }
  }

  return (
    <main className="shop-page">
      <header className="shop-header">
        <button className="shop-back" type="button" aria-label="Voltar" onClick={() => navigate('/home')}>
          <img src={`${import.meta.env.BASE_URL}ui/common/back.svg`} alt="" />
        </button>
        <div className="shop-header-copy">
          <span>BARRACA DE EXPEDIÇÃO</span>
          <h1>Personagens</h1>
        </div>
        <div className="shop-balance" aria-label={`${leaves} folhas disponíveis`}>
          <span aria-hidden="true">🍃</span>
          <strong>{leaves}</strong>
        </div>
      </header>

      <section className="shop-content" aria-label="Escolha seu personagem">
        <div className="shop-category-header">
          <span>COLEÇÃO 01</span>
          <h2>Personagens Iniciais</h2>
        </div>

        <div className="shop-stage" aria-label={`Selecionado: ${character.name}`}>
          {characters.map((item, index) => {
            const offset = getOffset(index);
            const isCenter = offset === 0;
            const isNeighbor = Math.abs(offset) === 1;

            return (
              <div
                key={item.id}
                className={`shop-character-slide ${isCenter ? 'is-center' : ''} ${isNeighbor ? 'is-neighbor' : ''}`}
                data-offset={offset}
                aria-hidden={!isCenter}
              >
                <CharacterPreview character={item} active={isCenter} />
                {isNeighbor && (
                  <button
                    type="button"
                    className="shop-character-hitarea"
                    aria-label={`Selecionar ${item.name}`}
                    onClick={() => navigateCarousel(Math.sign(offset))}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="shop-item-info">
          <h3>{character.name}</h3>
          <span>{equipped ? 'Equipado' : owned ? 'Desbloqueado' : `${character.price} folhas`}</span>
        </div>

        <div className="shop-carousel-controls" aria-label="Navegar pelos personagens">
          <button type="button" onClick={() => navigateCarousel(-1)} aria-label="Personagem anterior">‹</button>
          <span className="shop-page-number">{activeIndex + 1} / {characters.length}</span>
          <button type="button" onClick={() => navigateCarousel(1)} aria-label="Próximo personagem">›</button>
        </div>

        <button
          type="button"
          className="shop-action"
          onClick={handleAction}
          disabled={equipped || (!owned && leaves < character.price)}
        >
          {equipped ? 'Equipado ✓' : owned ? 'Equipar' : `Comprar · 🍃 ${character.price}`}
        </button>
        <p className="shop-feedback" role="status">
          {message || (!owned && leaves < character.price ? 'Continue explorando para juntar mais folhas.' : '\u00a0')}
        </p>
      </section>
    </main>
  );
}

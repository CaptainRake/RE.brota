import { useState } from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  badges,
  getBadgeIcon,
} from '../data/badges';

import {
  useProgressStore,
} from '../stores/progressStore';

export default function Badges() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedBadge, setSelectedBadge] =
    useState(null);

  const unlockedBadges = useProgressStore(
    (state) => state.badges
  );

  const unlockedCount = badges.filter(
    (badge) => unlockedBadges.includes(badge.id)
  ).length;

  const progress =
    (unlockedCount / badges.length) * 100;

  const selectedUnlocked =
    selectedBadge &&
    unlockedBadges.includes(selectedBadge.id);

  function goBack() {
    navigate(
      searchParams.get('from') === 'profile'
        ? '/profile'
        : '/backpack'
    );
  }

  return (
    <main className="badges-page">

      {/* CABEÇALHO */}

      <header className="badges-header">

        <button
          type="button"
          className="badges-back"
          onClick={goBack}
          aria-label="Voltar"
        >
          <img
            src={`${import.meta.env.BASE_URL}ui/common/back.svg`}
            alt=""
          />
        </button>

        <h1>Distintivos</h1>

      </header>

      {/* PROGRESSO */}

      <section className="badges-progress-card">

        <div className="badges-progress-heading">

          <div>
            <span>SUAS CONQUISTAS</span>
            <h2>Coleção de distintivos</h2>
          </div>

          <strong>
            {unlockedCount}/{badges.length}
          </strong>

        </div>

        <div className="badges-progress-bar">

          <div
            className="badges-progress-fill"
            style={{ width: `${progress}%` }}
          />

        </div>

        <p>
          Complete desafios e colecione distintivos
          durante suas expedições.
        </p>

      </section>

      {/* COLEÇÃO */}

      <section className="badges-grid">

        {badges.map((badge, index) => {
          const unlocked =
            unlockedBadges.includes(badge.id);

          return (
            <button
              type="button"
              key={badge.id}

              className={`badge-card ${
                unlocked ? 'unlocked' : 'locked'
              }`}

              onClick={() =>
                setSelectedBadge(badge)
              }
            >

              <span className="badge-card-number">
                #{String(index + 1).padStart(2, '0')}
              </span>

              <img
                className="badge-card-image"
                src={getBadgeIcon(badge.id)}
                alt=""
                draggable={false}
              />

              <strong className="badge-card-name">
                {badge.name}
              </strong>

              <span className="badge-card-status">
                {unlocked
                  ? 'Conquistado ✓'
                  : 'Não conquistado'}
              </span>

            </button>
          );
        })}

      </section>

      {/* FICHA DO DISTINTIVO */}

      {selectedBadge && (

        <div
          className="badge-detail-overlay"
          onClick={() => setSelectedBadge(null)}
        >

          <article
            className="badge-detail"
            role="dialog"
            aria-modal="true"
            aria-label={selectedBadge.name}

            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="badge-detail-close"
              aria-label="Fechar"

              onClick={() =>
                setSelectedBadge(null)
              }
            >
              ×
            </button>

            <div className="badge-detail-visual">

              <img
                src={getBadgeIcon(selectedBadge.id)}
                alt={selectedBadge.name}

                className={
                  selectedUnlocked ? '' : 'locked'
                }

                draggable={false}
              />

            </div>

            <div className="badge-detail-content">

              <span
                className={`badge-detail-status ${
                  selectedUnlocked ? 'unlocked' : ''
                }`}
              >
                {selectedUnlocked
                  ? 'DISTINTIVO CONQUISTADO'
                  : 'DISTINTIVO BLOQUEADO'}
              </span>

              <h2>{selectedBadge.name}</h2>

              <p>{selectedBadge.description}</p>

              <div className="badge-detail-requirement">

                <strong>
                  {selectedUnlocked
                    ? 'Requisito cumprido ✓'
                    : 'Como conquistar'}
                </strong>

                <p>{selectedBadge.requirement}</p>

              </div>

              {!selectedUnlocked && (

                <button
                  type="button"
                  className="badge-action-button"

                  onClick={() =>
                    navigate(
                      selectedBadge.id === 'fashion'
                        ? '/shop'
                        : '/challenges'
                    )
                  }
                >
                  {selectedBadge.id === 'fashion'
                    ? 'Ver coleção de personagens'
                    : 'Ver missões'}
                </button>

              )}

            </div>

          </article>

        </div>

      )}

    </main>
  );
}
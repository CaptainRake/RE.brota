import {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  encounters,
} from '../data/encounters';

import {
  useProgressStore,
} from '../stores/progressStore';


export default function Guide() {
  const navigate =
    useNavigate();


  const [
    activeTab,
    setActiveTab,
  ] =
    useState('fauna');


  const [
    selectedAnimal,
    setSelectedAnimal,
  ] =
    useState(null);


  const discoveries =
    useProgressStore(
      (state) =>
        state.discoveries
    );


  const readAnimals =
    useProgressStore(
      (state) =>
        state.readAnimals
    );


  const markGuideRead =
    useProgressStore(
      (state) =>
        state.markGuideRead
    );


  const registeredCount =
    discoveries.length;


  const totalCount =
    encounters.length;


  const progress =
    totalCount > 0
      ? (
          registeredCount /
          totalCount
        ) * 100
      : 0;


  function openAnimal(
    animal
  ) {
    if (
      !discoveries.includes(
        animal.id
      )
    ) {
      return;
    }


    markGuideRead(
      animal.id
    );


    setSelectedAnimal(
      animal
    );
  }


  return (
    <main className="field-guide-page">

      {/* =========================
          CABEÇALHO
          ========================= */}

      <header className="field-guide-header">

        <button
          type="button"
          className="field-guide-back"
          onClick={() =>
            navigate('/backpack')
          }
          aria-label="Voltar"
        >

          <img
            src={
              `${import.meta.env.BASE_URL}ui/common/back.svg`
            }
            alt=""
            onLoad={(
              event
            ) => {
              event.currentTarget
                .nextElementSibling
                ?.classList
                .add(
                  'hidden'
                );
            }}
            onError={(
              event
            ) => {
              event.currentTarget
                .style
                .display =
                'none';
            }}
          />


          <span className="field-guide-back-fallback">
            ←
          </span>

        </button>


        <h1>
          Guia de Campo
        </h1>

      </header>


      {/* =========================
          ABAS
          ========================= */}

      <nav className="field-guide-tabs">

        <button
          type="button"

          className={`field-guide-tab ${
            activeTab ===
            'progress'
              ? 'active'
              : ''
          }`}

          onClick={() =>
            setActiveTab(
              'progress'
            )
          }
        >
          PROGRESSO
        </button>


        <button
          type="button"

          className={`field-guide-tab ${
            activeTab ===
            'fauna'
              ? 'active'
              : ''
          }`}

          onClick={() =>
            setActiveTab(
              'fauna'
            )
          }
        >
          FAUNA
        </button>


        <button
          type="button"

          className={`field-guide-tab ${
            activeTab ===
            'flora'
              ? 'active'
              : ''
          }`}

          onClick={() =>
            setActiveTab(
              'flora'
            )
          }
        >
          FLORA
        </button>

      </nav>


      {/* =========================
          PROGRESSO
          ========================= */}

      {activeTab ===
        'progress' && (

        <section className="field-guide-tab-content">

          <div className="field-guide-progress-panel">

            <span className="field-guide-panel-kicker">
              PROGRESSO GERAL
            </span>


            <div className="field-guide-progress-number">

              <strong>
                {
                  registeredCount
                }
              </strong>

              <span>
                /
                {
                  totalCount
                }
              </span>

            </div>


            <p>
              espécies da fauna
              registradas
            </p>


            <div className="field-guide-progress-bar">

              <div
                className="field-guide-progress-fill"

                style={{
                  width:
                    `${progress}%`,
                }}
              />

            </div>

          </div>


          <div className="field-guide-progress-stats">

            <div>

              <span>
                Encontradas
              </span>

              <strong>
                {
                  registeredCount
                }
              </strong>

            </div>


            <div>

              <span>
                Restantes
              </span>

              <strong>
                {
                  Math.max(
                    totalCount -
                    registeredCount,
                    0
                  )
                }
              </strong>

            </div>


            <div>

              <span>
                Conclusão
              </span>

              <strong>
                {
                  Math.round(
                    progress
                  )
                }%
              </strong>

            </div>

          </div>

        </section>

      )}


      {/* =========================
          FAUNA
          ========================= */}

      {activeTab ===
        'fauna' && (

        <section className="field-guide-tab-content">

          <div className="field-guide-section-heading">

            <div>

              <span>
                REGISTROS
              </span>

              <h2>
                Fauna
              </h2>

            </div>


            <strong>
              {
                registeredCount
              }
              /
              {
                totalCount
              }
            </strong>

          </div>


          <div className="field-guide-grid">

            {encounters.map(
              (
                animal,
                index
              ) => {

                const registered =
                  discoveries.includes(
                    animal.id
                  );


                const read =
                  readAnimals.includes(
                    animal.id
                  );


                return (
                  <button
                    type="button"

                    key={
                      animal.id
                    }

                    className={`field-guide-animal-card ${
                      registered
                        ? 'registered'
                        : 'locked'
                    }`}

                    onClick={() =>
                      openAnimal(
                        animal
                      )
                    }
                  >

                    <div className="field-guide-animal-visual">

                      {registered ? (

                        <model-viewer
                          src={
                            `${import.meta.env.BASE_URL}models/${animal.model}`
                          }

                          camera-orbit="0deg 75deg 105%"

                          interaction-prompt="none"

                          disable-zoom

                          class="field-guide-card-model"
                        />

                      ) : (

                        <div className="field-guide-unknown">
                          ?
                        </div>

                      )}


                      {registered &&
                        !read && (

                        <span className="field-guide-new-dot" />

                      )}

                    </div>


                    <div className="field-guide-animal-info">

                      <span className="field-guide-number">

                        #
                        {
                          String(
                            index +
                            1
                          ).padStart(
                            2,
                            '0'
                          )
                        }

                      </span>


                      <strong>

                        {registered
                          ? animal.name
                          : 'Não identificado'}

                      </strong>


                      <span className="field-guide-card-status">

                        {registered
                          ? getRarityLabel(
                              animal.rarity
                            )
                          : 'Não encontrado'}

                      </span>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </section>

      )}


      {/* =========================
          FLORA
          ========================= */}

      {activeTab ===
        'flora' && (

        <section className="field-guide-tab-content">

          <div className="field-guide-section-heading">

            <div>

              <span>
                REGISTROS
              </span>

              <h2>
                Flora
              </h2>

            </div>

          </div>


          <div className="field-guide-empty">

            <div className="field-guide-empty-icon">
              ♧
            </div>


            <strong>
              Novos registros em breve
            </strong>


            <p>
              As espécies vegetais
              encontradas durante a
              exploração aparecerão
              aqui.
            </p>

          </div>

        </section>

      )}


      {/* =========================
          FICHA DO ANIMAL
          ========================= */}

      {selectedAnimal && (

        <div
          className="field-guide-detail-overlay"

          onClick={() =>
            setSelectedAnimal(
              null
            )
          }
        >

          <article
            className="field-guide-detail"

            onClick={(
              event
            ) =>
              event
                .stopPropagation()
            }
          >

            <button
              type="button"

              className="field-guide-detail-close"

              onClick={() =>
                setSelectedAnimal(
                  null
                )
              }
            >
              ×
            </button>


            <div className="field-guide-detail-model-wrap">

              <span className="field-guide-detail-number">

                #
                {
                  String(
                    encounters.findIndex(
                      (item) =>
                        item.id ===
                        selectedAnimal.id
                    ) + 1
                  ).padStart(
                    2,
                    '0'
                  )
                }

              </span>


              <model-viewer
                src={
                  `${import.meta.env.BASE_URL}models/${selectedAnimal.model}`
                }

                camera-controls

                auto-rotate

                interaction-prompt="none"

                class="field-guide-detail-model"
              />

            </div>


            <div className="field-guide-detail-content">

              <div className="field-guide-detail-tags">

                <span>
                  FAUNA
                </span>


                <span>
                  {
                    getRarityLabel(
                      selectedAnimal.rarity
                    )
                  }
                </span>

              </div>


              <h2>
                {
                  selectedAnimal.name
                }
              </h2>


              <em>
                {
                  selectedAnimal.scientificName
                }
              </em>


              <div className="field-guide-detail-divider" />


              <h3>
                Sobre
              </h3>


              <p>
                {
                  selectedAnimal.description
                }
              </p>


              {selectedAnimal.facts &&
                selectedAnimal.facts.length >
                  0 && (

                <div className="field-guide-facts">

                  {selectedAnimal.facts.map(
                    (
                      fact,
                      index
                    ) => (

                      <div
                        className="field-guide-fact"

                        key={
                          index
                        }
                      >

                        <span>
                          {
                            fact.label
                          }
                        </span>


                        <strong>
                          {
                            fact.value
                          }
                        </strong>

                      </div>

                    )
                  )}

                </div>

              )}


              <div className="field-guide-observed">

                <span>
                  ✓
                </span>


                <div>

                  <strong>
                    Registro confirmado
                  </strong>


                  <small>
                    Espécie adicionada ao
                    Guia de Campo
                  </small>

                </div>

              </div>

            </div>

          </article>

        </div>

      )}

    </main>
  );
}


function getRarityLabel(
  rarity
) {
  const labels = {
    common:
      'Comum',

    uncommon:
      'Incomum',

    rare:
      'Rara',

    legendary:
      'Muito rara',
  };


  return (
    labels[rarity] ??
    rarity
  );
}
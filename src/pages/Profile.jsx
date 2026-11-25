import {
  useNavigate,
} from 'react-router-dom';

import {
  useProgressStore,
} from '../stores/progressStore';

import {
  useOnboardingStore,
} from '../stores/onboardingStore';

import {
  backpacks,
} from '../data/backpacks';

import {
  encounters,
} from '../data/encounters';


export default function Profile() {
  const navigate =
    useNavigate();


  /* =============================
     PROGRESSO
     ============================= */

  const xp =
    useProgressStore(
      (state) =>
        state.xp
    );


  const leaves =
    useProgressStore(
      (state) =>
        state.leaves
    );


  const badges =
    useProgressStore(
      (state) =>
        state.badges
    );


  const discoveries =
    useProgressStore(
      (state) =>
        state.discoveries
    );


  /* =============================
     IDENTIDADE
     ============================= */

  const playerName =
    useOnboardingStore(
      (state) =>
        state.playerName
    );


  const researcherCode =
    useOnboardingStore(
      (state) =>
        state.researcherCode
    );


  const joinedAt =
    useOnboardingStore(
      (state) =>
        state.joinedAt
    );


  const selectedBackpack =
    useOnboardingStore(
      (state) =>
        state.selectedBackpack
    );


  const backpack =
    backpacks.find(
      (item) =>
        item.id ===
        selectedBackpack
    ) ??
    backpacks[0];


  /* =============================
     NÍVEL
     ============================= */

  const level =
    Math.floor(
      xp / 100
    ) + 1;


  const xpInLevel =
    xp % 100;


  const xpPercent =
    Math.min(
      xpInLevel,
      100
    );


  /* =============================
     GUIA
     ============================= */

  const guideProgress =
    encounters.length > 0
      ? Math.round(
          (
            discoveries.length /
            encounters.length
          ) * 100
        )
      : 0;


  const formattedDate =
    joinedAt
      ? new Date(
          joinedAt
        ).toLocaleDateString(
          'pt-BR',
          {
            day:
              '2-digit',

            month:
              '2-digit',

            year:
              'numeric',
          }
        )
      : '—';


  const displayName =
    playerName ||
    'Explorador visitante';


  const displayCode =
    researcherCode ||
    '00000000';


  return (
    <main className="profile-page">

      {/* =============================
          HEADER
          ============================= */}

      <header className="profile-header">

        <button
          type="button"

          className="profile-back"

          onClick={() =>
            navigate(
              '/home'
            )
          }

          aria-label="Voltar"
        >
          <img
            src={
              `${import.meta.env.BASE_URL}ui/common/back.svg`
            }

            alt=""
          />
        </button>


        <div className="profile-header-copy">

          <span>
            IDENTIFICAÇÃO
          </span>


          <h1>
            Perfil
          </h1>

        </div>

      </header>


      {/* =============================
          CRACHÁ
          ============================= */}

      <section className="researcher-card">

        <div className="researcher-card-hole">
          <span />
        </div>


        <div className="researcher-card-top">

          <div>

            <strong className="researcher-card-label">
              RE:BROTA
            </strong>

            <span className="researcher-card-subtitle">
              Jardim Botânico UFSM
            </span>

          </div>


          <span className="researcher-card-status">
            EXPLORADOR
          </span>

        </div>


        <div className="researcher-card-body">

          <div className="researcher-avatar">

            <img
              src={
                `${import.meta.env.BASE_URL}ui/hud/Profile+Level.svg`
              }

              alt=""
            />


            <span>
              {level}
            </span>

          </div>


          <div className="researcher-info">

            <span className="researcher-small-label">
              PESQUISADOR(A)
            </span>


            <h2>
              {displayName}
            </h2>


            <span className="researcher-id">
              ID {displayCode}
            </span>

          </div>

        </div>


        <div className="researcher-meta">

          <div>

            <span>
              MEMBRO DESDE
            </span>

            <strong>
              {formattedDate}
            </strong>

          </div>


          <div>

            <span>
              STATUS
            </span>

            <strong>
              Em campo
            </strong>

          </div>

        </div>


        <div className="researcher-divider" />


        <div className="researcher-card-footer">

          <div className="researcher-card-bottom">

            <div>

              <span>
                Nível
              </span>

              <strong>
                {level}
              </strong>

            </div>


            <div>

              <span>
                Registros
              </span>

              <strong>
                {
                  discoveries.length
                }
              </strong>

            </div>


            <div>

              <span>
                Distintivos
              </span>

              <strong>
                {
                  badges.length
                }
              </strong>

            </div>

          </div>


          <ResearcherQR
            value={
              displayCode
            }
          />

        </div>

      </section>


      {/* =============================
          EXPERIÊNCIA
          ============================= */}

      <section className="profile-section">

        <div className="profile-section-title">

          <div>

            <span>
              PROGRESSO
            </span>

            <h2>
              Experiência
            </h2>

          </div>


          <strong>
            {xp} XP
          </strong>

        </div>


        <div className="profile-xp-card">

          <div className="profile-xp-level">

            <span>
              Nível
            </span>

            <strong>
              {level}
            </strong>

          </div>


          <div className="profile-xp-content">

            <div className="profile-xp-bar">

              <div
                className="profile-xp-fill"

                style={{
                  width:
                    `${xpPercent}%`,
                }}
              />

            </div>


            <div className="profile-xp-info">

              <span>
                {xpInLevel} XP
              </span>

              <span>
                100 XP
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =============================
          ESTATÍSTICAS
          ============================= */}

      <section className="profile-section">

        <div className="profile-section-title">

          <div>

            <span>
              EXPLORAÇÃO
            </span>

            <h2>
              Estatísticas
            </h2>

          </div>

        </div>


        <div className="profile-stats">

          <article className="profile-stat-card">

            <span className="profile-stat-icon">
              🍃
            </span>


            <div>

              <span>
                Folhas
              </span>

              <strong>
                {leaves}
              </strong>

            </div>

          </article>


          <article className="profile-stat-card">

            <span className="profile-stat-icon">
              📖
            </span>


            <div>

              <span>
                Guia
              </span>

              <strong>
                {guideProgress}%
              </strong>

            </div>

          </article>


          <article className="profile-stat-card">

            <span className="profile-stat-icon">
              🏅
            </span>


            <div>

              <span>
                Selos
              </span>

              <strong>
                {
                  badges.length
                }
              </strong>

            </div>

          </article>

        </div>

      </section>


      {/* =============================
          EQUIPAMENTO
          ============================= */}

      <section className="profile-section">

        <div className="profile-section-title">

          <div>

            <span>
              INVENTÁRIO
            </span>

            <h2>
              Equipamento
            </h2>

          </div>

        </div>


        <button
          type="button"

          className="profile-backpack-card"

          onClick={() =>
            navigate(
              '/backpack-select'
            )
          }
        >

          <div className="profile-backpack-image">

            <img
              src={
                `${import.meta.env.BASE_URL}ui/hud/${backpack.icon}`
              }

              alt={
                `Mochila ${backpack.name}`
              }
            />

          </div>


          <div className="profile-backpack-copy">

            <span>
              MOCHILA ATUAL
            </span>

            <strong>
              {
                backpack.name
              }
            </strong>

            <small>
              Toque para trocar
            </small>

          </div>


          <span className="profile-backpack-arrow">
            ›
          </span>

        </button>

      </section>


      {/* =============================
          DISTINTIVOS
          ============================= */}

      <section className="profile-section">

        <div className="profile-section-title">

          <div>

            <span>
              CONQUISTAS
            </span>

            <h2>
              Distintivos
            </h2>

          </div>


          <strong>
            {
              badges.length
            }
          </strong>

        </div>


        {badges.length ===
        0 ? (

          <div className="profile-empty">

            <span className="profile-empty-icon">
              ◇
            </span>


            <strong>
              Nenhum distintivo ainda
            </strong>


            <p>
              Continue explorando o Jardim Botânico para conquistar seus primeiros distintivos.
            </p>

          </div>

        ) : (

          <div className="profile-badges">

            {badges.map(
              (
                badge,
                index
              ) => (

                <article
                  key={
                    badge
                  }

                  className="profile-badge"
                >

                  <span className="profile-badge-number">

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


                  <div className="profile-badge-icon">
                    🏅
                  </div>


                  <strong>
                    {
                      getBadgeName(
                        badge
                      )
                    }
                  </strong>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}


/* =========================================================
   QR DECORATIVO
   ========================================================= */

function ResearcherQR({
  value,
}) {
  const size =
    11;


  function hashString(
    text
  ) {
    let hash =
      0;


    for (
      let i = 0;
      i < text.length;
      i += 1
    ) {

      hash =
        (
          (
            hash << 5
          ) -
          hash
        ) +
        text.charCodeAt(
          i
        );


      hash |=
        0;
    }


    return Math.abs(
      hash
    );
  }


  const seed =
    hashString(
      value
    );


  function isFinder(
    x,
    y
  ) {
    const areas = [
      [0, 0],

      [
        size - 3,
        0,
      ],

      [
        0,
        size - 3,
      ],
    ];


    return areas.some(
      (
        [
          startX,
          startY,
        ]
      ) =>
        x >=
          startX &&

        x <
          startX +
            3 &&

        y >=
          startY &&

        y <
          startY +
            3
    );
  }


  function isDark(
    x,
    y
  ) {
    if (
      isFinder(
        x,
        y
      )
    ) {
      return true;
    }


    const number =
      (
        seed +
        x * 17 +
        y * 31 +
        x * y * 7
      );


    return (
      number %
        3 !==
      0
    );
  }


  const cells =
    [];


  for (
    let y = 0;
    y < size;
    y += 1
  ) {

    for (
      let x = 0;
      x < size;
      x += 1
    ) {

      cells.push(
        <span
          key={
            `${x}-${y}`
          }

          className={
            isDark(
              x,
              y
            )
              ? 'dark'
              : ''
          }
        />
      );
    }
  }


  return (
    <div
      className="researcher-qr"

      aria-label="Código visual do pesquisador"
    >
      {cells}
    </div>
  );
}


function getBadgeName(
  badge
) {
  switch (
    badge
  ) {

    case 'first-steps':
      return 'Primeiros passos';


    default:
      return 'Distintivo';

  }
}
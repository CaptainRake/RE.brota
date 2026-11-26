import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useProgressStore,
  getActiveMissions,
  getCompletedMissions,
  isMissionReady,
  FUTURE_MISSIONS,
} from '../stores/progressStore';

export default function Challenges() {
  const navigate = useNavigate();

  const [showCompleted, setShowCompleted] =
    useState(false);

  const [showFuture, setShowFuture] =
    useState(false);

  const state = useProgressStore();

  const markMissionsSeen = useProgressStore(
    (state) => state.markMissionsSeen
  );

  const refreshDaily = useProgressStore(
    (state) => state.refreshDaily
  );

  useEffect(() => {
    refreshDaily();
    markMissionsSeen();
  }, [refreshDaily, markMissionsSeen]);

  const active = getActiveMissions(state);

  const completed = getCompletedMissions(state);

  const daily = active.filter(
    (mission) => mission.daily
  );

  const main = active.filter(
    (mission) =>
      !mission.daily &&
      (
        mission.id === 'first-steps' ||
        mission.line
      )
  );

  const special = active.filter(
    (mission) =>
      !mission.daily &&
      mission.id !== 'first-steps' &&
      !mission.line
  );

  function renderMission(mission, completed = false) {
    return (
      <MissionCard
        key={
          completed
            ? mission.id
            : mission.line ?? mission.id
        }

        mission={mission}
        state={state}
        completed={completed}

        onClaim={() =>
          state.claimMission(mission.id)
        }
      />
    );
  }

  return (
    <main className="missions-page">

      <header className="missions-header">

        <button
          type="button"
          className="missions-back"
          onClick={() => navigate('/home')}
          aria-label="Voltar"
        >
          <img
            src={`${import.meta.env.BASE_URL}ui/common/back.svg`}
            alt=""
          />
        </button>

        <div>
          <h1>Desafios</h1>

          <p>
            Complete missões durante suas explorações.
          </p>
        </div>

      </header>

      {/* DIÁRIAS */}

      {daily.length > 0 && (
        <section className="mission-section">

          <h2>Missão diária</h2>

          {daily.map((mission) =>
            renderMission(mission)
          )}

        </section>
      )}

      {/* PRINCIPAIS */}

      {main.length > 0 && (
        <section className="mission-section">

          <h2>Missões de campo</h2>

          {main.map((mission) =>
            renderMission(mission)
          )}

        </section>
      )}

      {/* ESPECIAIS */}

      {special.length > 0 && (
        <section className="mission-section">

          <h2>Missões especiais</h2>

          {special.map((mission) =>
            renderMission(mission)
          )}

        </section>
      )}

      {/* CONCLUÍDAS */}

      {completed.length > 0 && (
        <section className="mission-section">

          <button
            type="button"
            className="missions-completed-toggle"

            aria-expanded={showCompleted}

            onClick={() =>
              setShowCompleted((value) => !value)
            }
          >
            <span>Missões concluídas</span>

            <strong>
              {completed.length}
            </strong>

            <span
              className={`missions-toggle-arrow ${
                showCompleted ? 'open' : ''
              }`}
            >
              ▾
            </span>

          </button>

          {showCompleted && (
            <div className="missions-completed-list">

              {completed.map((mission) =>
                renderMission(mission, true)
              )}

            </div>
          )}

        </section>
      )}

      {/* FUTURAS */}

      <section className="mission-section">

        <button
          type="button"
          className="missions-completed-toggle"

          aria-expanded={showFuture}

          onClick={() =>
            setShowFuture((value) => !value)
          }
        >
          <span>Novas expedições</span>

          <span
            className={`missions-toggle-arrow ${
              showFuture ? 'open' : ''
            }`}
          >
            ▾
          </span>

        </button>

        {showFuture && (
          <div className="missions-completed-list">

            {FUTURE_MISSIONS.map((mission) => (
              <article
                key={mission.id}
                className="mission-card mission-card-future"
              >
                <span className="mission-tag">
                  Em breve
                </span>

                <h3>{mission.title}</h3>

                <p>{mission.description}</p>
              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

/* =========================================================
   CARD DA MISSÃO
   ========================================================= */

function MissionCard({
  mission,
  state,
  completed,
  onClaim,
}) {
  const [expanded, setExpanded] = useState(
    !completed
  );

  const ready =
    !completed && isMissionReady(mission, state);

  const objectives = mission.objectives(state);

  const completedCount = completed
    ? objectives.length
    : objectives.filter(
        (item) => item.completed
      ).length;

  const title = mission.stage
    ? `${mission.title} (${mission.stage}/${mission.totalStages})`
    : mission.title;

  return (
    <article
      className={`mission-card mission-card-v2
        ${mission.daily ? 'mission-card-daily' : ''}
        ${completed ? 'mission-card-completed' : ''}
        ${ready ? 'mission-card-ready' : ''}
      `}
    >

      {/* CATEGORIA */}

      <div className="mission-category-band">
        {mission.category}
      </div>

      {/* TÍTULO E EXPANSÃO */}

      <button
        type="button"
        className="mission-expand-button"

        aria-expanded={expanded}

        onClick={() =>
          setExpanded((value) => !value)
        }
      >

        <h3>{title}</h3>

        {ready && (
          <span className="mission-ready-indicator">
            ✓
          </span>
        )}

        <span
          className={`mission-expand-arrow ${
            expanded ? 'expanded' : ''
          }`}
        >
          ▾
        </span>

      </button>

      {expanded && (
        <div className="mission-card-body">

          <p className="mission-description">
            {mission.description}
          </p>

          {/* OBJETIVOS INDIVIDUAIS */}

          <div className="mission-task-list">

            {objectives.map((item, index) => {
              const done =
                completed || item.completed;

              const value = done
                ? item.goal
                : Math.min(
                    Math.floor(item.value),
                    item.goal
                  );

              const progress =
                Math.min(
                  (value / item.goal) * 100,
                  100
                );

              return (
                <div
                  key={index}
                  className={`mission-task ${
                    done ? 'done' : ''
                  }`}
                >

                  <div className="mission-task-top">

                    <span>
                      {item.text}
                    </span>

                    {done && (
                      <strong className="mission-task-check">
                        ✓
                      </strong>
                    )}

                  </div>

                  {!done && (
                    <>
                      <div className="mission-task-count">
                        {value}/{item.goal}
                      </div>

                      <div className="mission-progress">

                        <div
                          className="mission-progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>
                    </>
                  )}

                </div>
              );
            })}

          </div>

          {/* TAREFAS COMPLETADAS */}

          <div
            className={`mission-task-summary ${
              ready || completed ? 'all-done' : ''
            }`}
          >
            <span>
              {completedCount}/{objectives.length}
              {' '}tarefas completadas
            </span>

            {(ready || completed) && (
              <strong>✓</strong>
            )}
          </div>

          {/* RECOMPENSAS */}

          <div className="mission-reward-panel">

            <div className="mission-reward-heading">

              {completed
                ? 'RECOMPENSAS COLETADAS'
                : 'RECOMPENSAS'}

            </div>

            <div className="mission-reward-display">

              <div className="mission-xp-reward">
                <strong>
                  {mission.reward.xp}
                </strong>

                <span>XP</span>
              </div>

              <div className="mission-leaves-reward">
                <span>🍃</span>

                <strong>
                  ×{mission.reward.leaves}
                </strong>
              </div>

            </div>

          </div>

          {/* COLETAR */}

          {ready && (
            <button
              type="button"
              className="mission-claim-button"

              onClick={onClaim}
            >
              Coletar recompensas
            </button>
          )}

        </div>
      )}

      {!expanded && (
        <div className="mission-collapsed-summary">

          {completed
            ? 'Recompensas coletadas ✓'
            : ready
              ? 'Recompensas disponíveis!'
              : `${completedCount}/${objectives.length} tarefas completadas`}

        </div>
      )}

    </article>
  );
}
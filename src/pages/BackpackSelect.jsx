import {
  useNavigate,
} from 'react-router-dom';

import {
  backpacks,
} from '../data/backpacks';

import {
  useOnboardingStore,
} from '../stores/onboardingStore';


export default function BackpackSelect() {
  const navigate =
    useNavigate();


  const selectedBackpack =
    useOnboardingStore(
      (state) =>
        state.selectedBackpack
    );


  const selectBackpack =
    useOnboardingStore(
      (state) =>
        state.selectBackpack
    );


  const startTutorial =
    useOnboardingStore(
      (state) =>
        state.startTutorial
    );


  const hasCompletedOnboarding =
    useOnboardingStore(
      (state) =>
        state.hasCompletedOnboarding
    );


  function handleContinue() {
    if (!selectedBackpack) {
      return;
    }


    if (!hasCompletedOnboarding) {
      startTutorial();
    }


    navigate('/home');
  }


  return (
    <main className="backpack-select-page">

      <div className="backpack-select-scroll">

        <header className="backpack-select-header">

          <span className="backpack-select-kicker">
            EQUIPAMENTO
          </span>


          <h1>
            Escolha sua mochila
          </h1>


          <p>
            Ela vai acompanhar você durante suas explorações.
          </p>

        </header>


        <section className="backpack-options">

          {backpacks.map(
            (backpack) => {

              const isSelected =
                selectedBackpack ===
                backpack.id;


              return (
                <button
                  key={
                    backpack.id
                  }

                  type="button"

                  className={
                    `backpack-option ${
                      isSelected
                        ? 'selected'
                        : ''
                    }`
                  }

                  onClick={() =>
                    selectBackpack(
                      backpack.id
                    )
                  }

                  aria-label={
                    `Selecionar mochila ${backpack.name}`
                  }

                  aria-pressed={
                    isSelected
                  }
                >

                  <div className="backpack-option-visual">

                    <img
                      src={
                        `${import.meta.env.BASE_URL}ui/hud/${backpack.icon}`
                      }

                      alt=""
                    />

                  </div>


                  {isSelected && (

                    <span className="backpack-option-check">
                      ✓
                    </span>

                  )}

                </button>
              );
            }
          )}

        </section>

      </div>


      <footer className="backpack-select-actions">

        <button
          type="button"

          className="backpack-continue"

          disabled={
            !selectedBackpack
          }

          onClick={
            handleContinue
          }
        >
          Continuar
        </button>

      </footer>

    </main>
  );
}
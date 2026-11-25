
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  getAnalyticsConsent,
  initializeAnalytics,
  setAnalyticsConsent,
} from '../../utils/privacy';

export default function PrivacyConsent() {
  const [consent, setConsent] = useState(
    getAnalyticsConsent
  );

  useEffect(() => {
    initializeAnalytics();

    function updateConsent() {
      setConsent(getAnalyticsConsent());
    }

    window.addEventListener(
      'rebrota-privacy-change',
      updateConsent
    );

    return () => {
      window.removeEventListener(
        'rebrota-privacy-change',
        updateConsent
      );
    };
  }, []);

  function handleChoice(accepted) {
    if (setAnalyticsConsent(accepted)) {
      setConsent(accepted ? 'accepted' : 'rejected');
    }
  }

  if (consent !== null) {
    return null;
  }

  return (
    <aside
      className="privacy-consent"
      aria-labelledby="privacy-consent-title"
    >
      <div className="privacy-consent-content">
        <span className="privacy-eyebrow">
          PRIVACIDADE
        </span>

        <h2 id="privacy-consent-title">
          Sua aventura, sua privacidade!
        </h2>

        <p>
          O RE:brota utiliza o Microsoft Clarity para
          entender como os visitantes navegam pelo
          jogo e melhorar a experiência.
        </p>

        <p>
          Com sua autorização, poderemos analisar
          cliques, interações e reconstruções de
          sessões. Você pode recusar e continuar
          jogando normalmente.
        </p>

        <div className="privacy-actions">
          <button
            type="button"
            className="privacy-button-primary"
            onClick={() => handleChoice(true)}
          >
            Aceitar análise
          </button>

          <button
            type="button"
            className="privacy-button-secondary"
            onClick={() => handleChoice(false)}
          >
            Recusar e continuar
          </button>
        </div>

        <Link to="/privacidade">
          Como seus dados são utilizados?
        </Link>
      </div>
    </aside>
  );
}


const CONSENT_KEY = 'rebrota-clarity-consent-v1';
const CLARITY_ID = 'zj65f09aqt';

export function getAnalyticsConsent() {
  try {
    const value = localStorage.getItem(CONSENT_KEY);

    if (value === 'accepted' || value === 'rejected') {
      return value;
    }
  } catch {
    // Se o armazenamento estiver indisponível,
    // o Clarity permanece desativado.
  }

  return null;
}

function loadClarity() {
  if (document.getElementById('rebrota-clarity-script')) {
    return;
  }

  window.clarity = window.clarity || function (...args) {
    (window.clarity.q = window.clarity.q || []).push(args);
  };

  const script = document.createElement('script');
  script.id = 'rebrota-clarity-script';
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  script.async = true;

  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (getAnalyticsConsent() === 'accepted') {
    loadClarity();
  }
}

export function setAnalyticsConsent(accepted) {
  const value = accepted ? 'accepted' : 'rejected';

  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Não inicializamos análises quando não é
    // possível guardar a autorização.
    return false;
  }

  if (accepted) {
    loadClarity();
  } else {
    // Encerra a execução do aplicativo atual.
    // Na próxima carga, o Clarity não será inserido.
    window.location.reload();
  }

  window.dispatchEvent(
    new CustomEvent('rebrota-privacy-change')
  );

  return true;
}

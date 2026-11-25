import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from '../utils/privacy';

export default function Settings() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(
    () => getAnalyticsConsent() === 'accepted'
  );

  function handleAnalytics() {
    const next = !analytics;

    if (setAnalyticsConsent(next)) {
      setAnalytics(next);
    }
  }

  function openDocument(tab) {
    navigate(`/privacidade?tab=${tab}`);
  }

  return (
    <main className="settings-page">

      <header className="settings-header">
        <button
          type="button"
          className="settings-back"
          onClick={() => navigate('/home')}
          aria-label="Voltar"
        >
          <img
            src={`${import.meta.env.BASE_URL}ui/common/back.svg`}
            alt=""
          />
        </button>

        <h1>Configurações</h1>
      </header>

      <section className="settings-section">
        <h2>Privacidade</h2>

        <div className="settings-card">

          <div className="settings-option">
            <div className="settings-option-text">
              <strong>Análise de navegação</strong>
              <span>Microsoft Clarity</span>
            </div>

            <button
              type="button"
              role="switch"
              aria-label="Permitir análise de navegação"
              aria-checked={analytics}
              className={`settings-switch ${
                analytics ? 'active' : ''
              }`}
              onClick={handleAnalytics}
            >
              <span />
            </button>
          </div>

          <button
            className="settings-option"
            onClick={() => openDocument('privacy')}
          >
            Política de Privacidade
            <span>›</span>
          </button>

          <button
            className="settings-option"
            onClick={() => openDocument('terms')}
          >
            Termos de Uso
            <span>›</span>
          </button>

          <button
            className="settings-option"
            onClick={() => openDocument('cookies')}
          >
            Política de Cookies
            <span>›</span>
          </button>

        </div>
      </section>

      <section className="settings-section">
        <h2>Sobre o jogo</h2>

        <div className="settings-card settings-about">
          <h3>RE:brota</h3>

          <p>
            Uma experiência educativa de exploração
            da biodiversidade do Jardim Botânico
            da UFSM.
          </p>

          <p>
            Projeto acadêmico desenvolvido no curso
            de Desenho Industrial da Universidade
            Federal de Santa Maria.
          </p>
        </div>
      </section>

      <footer className="settings-footer">
        <strong>RE:brota</strong>
        <span>Desenho Industrial — UFSM</span>
        <span>2026</span>
      </footer>

    </main>
  );
}
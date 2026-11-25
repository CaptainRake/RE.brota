
import { useState } from 'react';
import { useNavigate, useSearchParams,} from 'react-router-dom';
import { getAnalyticsConsent, setAnalyticsConsent,} from '../utils/privacy';

const documents = {
  privacy: {
    title: 'Política de Privacidade',
    sections: [
      {
        title: 'Sobre o RE:brota',
        text: 'O RE:brota é uma experiência digital educativa, gratuita e sem login, desenvolvida como projeto acadêmico no curso de Desenho Industrial da UFSM. Esta política explica como informações podem ser utilizadas durante a experiência.',
      },
      {
        title: 'Progresso e preferências',
        text: 'O nome ou apelido de explorador, o personagem equipado, as descobertas, os pontos, as folhas e demais informações de progresso podem ser armazenados localmente no navegador. Não é necessário informar e-mail ou senha para jogar.',
      },
      {
        title: 'Geolocalização',
        text: 'Com a permissão do navegador, o jogo acessa a localização do dispositivo para representar o jogador no mapa e permitir encontros virtuais. A precisão pode variar. A utilização de mapas também pode envolver requisições a serviços externos.',
      },
      {
        title: 'Câmera e realidade aumentada',
        text: 'A câmera é utilizada, mediante permissão, para visualizar modelos virtuais em realidade aumentada. O RE:brota não oferece uma funcionalidade própria de gravação ou publicação de imagens da câmera.',
      },
      {
        title: 'Microsoft Clarity',
        text: 'Com autorização, o Microsoft Clarity pode analisar interações, cliques, duração das sessões, características técnicas do navegador e reconstruções da navegação. Essas reconstruções não são filmagens feitas pela câmera. O serviço pode utilizar cookies e processar informações em infraestrutura de terceiros, inclusive fora do Brasil.',
      },
      {
        title: 'Serviços externos',
        text: 'O funcionamento do jogo envolve hospedagem na Vercel, serviços de mapas, recursos do navegador e, quando autorizado, o Microsoft Clarity. Esses serviços podem tratar informações técnicas necessárias ao seu funcionamento.',
      },
      {
        title: 'Armazenamento e segurança',
        text: 'O progresso pode permanecer no navegador até sua remoção. Os serviços externos possuem práticas próprias de armazenamento e retenção. O projeto busca utilizar conexão segura, permissões do dispositivo e medidas apropriadas de proteção.',
      },
      {
        title: 'Seus direitos',
        text: 'Nos termos da LGPD, você poderá solicitar informações sobre o tratamento de seus dados e exercer os direitos aplicáveis, incluindo a revogação do consentimento para análise de navegação. O contato do responsável pelo projeto será disponibilizado nesta página.',
      },
      {
        title: 'Contato',
        text: '[INSERIR RESPONSÁVEL FORMAL PELO TRATAMENTO E E-MAIL DE PRIVACIDADE]',
      },
      {
        title: 'Crianças e adolescentes',
        text: 'O jogo pode ser utilizado em atividades educativas. A participação de menores exige cuidados e salvaguardas adequados à faixa etária. Para atividades escolares, o uso de análise comportamental deverá ser avaliado e autorizado conforme as exigências aplicáveis.',
      },
    ],
  },

  terms: {
    title: 'Termos de Uso',
    sections: [
      {
        title: 'Sobre o jogo',
        text: 'O RE:brota é uma experiência educativa e não comercial criada para incentivar o conhecimento e o respeito à biodiversidade do Jardim Botânico da UFSM. O acesso é gratuito, sem criação de conta.',
      },
      {
        title: 'Uso responsável',
        text: 'Permaneça nos caminhos autorizados, respeite a sinalização, observe o ambiente e não utilize o celular durante deslocamentos que apresentem risco. O mapa e a localização podem conter imprecisões.',
      },
      {
        title: 'Proteção da natureza',
        text: 'Não toque, alimente, capture ou persiga animais silvestres. Não retire ou danifique plantas. Animais, plantas e resíduos apresentados no jogo são representações virtuais e não exigem interação física com elementos naturais.',
      },
      {
        title: 'Funcionalidades',
        text: 'O jogo inclui mapa, desafios, descobertas, modelos tridimensionais, realidade aumentada, personagens e recompensas simbólicas. Algumas funcionalidades dependem de conexão à internet e de permissões do dispositivo.',
      },
      {
        title: 'Pontos e folhas',
        text: 'Pontos, folhas, conquistas e personagens são recursos virtuais, sem valor monetário. O progresso pode ser perdido caso os dados do navegador sejam apagados ou o aplicativo seja modificado.',
      },
      {
        title: 'Projeto acadêmico',
        text: 'A aplicação está em desenvolvimento e poderá apresentar erros, alterações ou interrupções. Pesquisas acadêmicas com participantes, quando realizadas, serão apresentadas separadamente destes Termos de Uso.',
      },
      {
        title: 'Direitos autorais',
        text: 'Os elementos autorais do RE:brota são protegidos pela legislação aplicável, respeitados os direitos e as licenças dos recursos de terceiros utilizados no projeto.',
      },
      {
        title: 'Contato',
        text: '[INSERIR E-MAIL DO PROJETO]',
      },
    ],
  },

  cookies: {
    title: 'Cookies e análise de uso',
    sections: [
      {
        title: 'Armazenamento funcional',
        text: 'O RE:brota utiliza armazenamento local para manter informações e preferências do jogo, como progresso e personagem selecionado. Esse armazenamento não depende da autorização para análise de navegação.',
      },
      {
        title: 'Microsoft Clarity',
        text: 'Quando autorizado, o Microsoft Clarity pode utilizar cookies e identificadores técnicos para analisar sessões e interações. Entre os cookies que podem ser utilizados estão _clck e _clsk.',
      },
      {
        title: 'Sua escolha',
        text: 'Você pode aceitar ou recusar a análise opcional sem perder o acesso ao jogo. Também pode alterar essa escolha nesta página. A revogação impede o carregamento do Clarity nas próximas visitas, mas não elimina automaticamente informações que já tenham sido processadas pela Microsoft.',
      },
      {
        title: 'Mais informações',
        text: 'Consulte https://clarity.microsoft.com/privacy/ e https://privacy.microsoft.com/pt-br/privacystatement para informações sobre as práticas da Microsoft.',
      },
    ],
  },
};

export default function Privacy() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

    const initialTab = searchParams.get('tab');

    const [tab, setTab] = useState(
    ['privacy', 'terms', 'cookies'].includes(initialTab)
        ? initialTab
        : 'privacy'
    );
  const [consent, setConsent] = useState(
    getAnalyticsConsent
  );

  function changeConsent(accepted) {
    if (setAnalyticsConsent(accepted)) {
      setConsent(accepted ? 'accepted' : 'rejected');
    }
  }

  const document = documents[tab];

  return (
    <main className="privacy-page">
      <header className="privacy-page-header">
        <button
          type="button"
          className="privacy-back"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          <img
            src={`${import.meta.env.BASE_URL}ui/common/back.svg`}
            alt=""
          />
        </button>

        <h1>Privacidade</h1>
      </header>

      <p className="privacy-intro">
        Conheça seus direitos e saiba como o
        RE:brota utiliza informações durante
        a exploração.
      </p>

      <nav
        className="privacy-tabs"
        aria-label="Documentos"
      >
        {[
          ['privacy', 'Privacidade'],
          ['terms', 'Termos'],
          ['cookies', 'Cookies'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={tab === key ? 'active' : ''}
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
          >
            {label}
          </button>
        ))}
      </nav>

      <article className="privacy-document">
        <h2>{document.title}</h2>

        <p className="privacy-updated">
          Última atualização: 25/11/2026
        </p>

        {document.sections.map((section) => (
          <section key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </section>
        ))}
      </article>

      <section className="privacy-preferences">
        <h2>Análise de navegação</h2>

        <p>
          {consent === 'accepted'
            ? 'Você autorizou a análise de uso.'
            : consent === 'rejected'
              ? 'Você recusou a análise de uso.'
              : 'Você ainda não escolheu.'}
        </p>

        <div className="privacy-actions">
          <button
            type="button"
            className="privacy-button-primary"
            onClick={() => changeConsent(true)}
            disabled={consent === 'accepted'}
          >
            Permitir análise
          </button>

          <button
            type="button"
            className="privacy-button-secondary"
            onClick={() => changeConsent(false)}
            disabled={consent === 'rejected'}
          >
            Desativar análise
          </button>
        </div>
      </section>
    </main>
  );
}

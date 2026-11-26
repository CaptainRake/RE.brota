export const badges = [
  {
    id: 'first-steps',
    name: 'Primeiros passos',
    description: 'Toda grande descoberta começa com um primeiro passo.',
    requirement: 'Conclua a missão Primeiros passos e colete sua recompensa.',
  },

  {
    id: 'eyes-open',
    name: 'Olhos atentos',
    description: 'Um olhar atento revela a diversidade escondida na natureza.',
    requirement: 'Conclua as três etapas da missão Olhos atentos.',
  },

  {
    id: 'field-researcher',
    name: 'Pesquisador de campo',
    description: 'Conhecer a biodiversidade é o primeiro passo para protegê-la.',
    requirement: 'Conclua as três etapas da missão Pesquisador de campo.',
  },

  {
    id: 'trail-guardian',
    name: 'Guardião da trilha',
    description: 'Pequenas atitudes ajudam a preservar grandes riquezas naturais.',
    requirement: 'Conclua as três etapas da missão Guardião da trilha.',
  },

  {
    id: 'trail-explorer',
    name: 'Desbravador',
    description: 'Cada caminho percorrido é uma oportunidade para novas descobertas.',
    requirement: 'Conclua as três etapas da missão Desbravando caminhos.',
  },

  {
    id: 'collector',
    name: 'Colecionador',
    description: 'Um registro de cada encontro com a biodiversidade local.',
    requirement: 'Conclua a missão Guia completo.',
  },

  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Explorar a natureza também é uma questão de estilo!',
    requirement: 'Desbloqueie todos os personagens da coleção inicial.',
  },
];

export const getBadge = (id) =>
  badges.find((badge) => badge.id === id);

export const getBadgeIcon = (id) =>
  `${import.meta.env.BASE_URL}ui/badges/${id}.svg`;
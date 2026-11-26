import { create } from 'zustand';
import { persist, createJSONStorage,} from 'zustand/middleware';
import { encounters } from '../data/encounters';

/* =========================================================
   CONFIGURAÇÃO DAS MISSÕES
   ========================================================= */

function objective(text, goal, value) {
  return {
    text,
    goal,
    value: Math.min(goal, value ?? 0),
    completed: (value ?? 0) >= goal,
  };
}

function createMission(config) {
  return {
    ...config,

    getValue(state) {
      return config.objectives(state)
        .reduce((total, item) => total + item.value, 0);
    },
  };
}

function createStage({
  line,
  title,
  category,
  stage,
  description,
  xp,
  leaves,
  metric,
  goal,
  badge,
}) {
  const id = `${line}-${stage}`;

  return createMission({
    id,
    line,
    title,
    category,
    stage,
    totalStages: 3,
    description,
    goal,
    badge,

    reward: { xp, leaves },

    objectives: (state) => [
      objective(
        description,
        goal,
        state.missionProgress[id]?.[metric] ?? 0
      ),
    ],
  });
}

/* =========================================================
   PRIMEIROS PASSOS
   ========================================================= */

const INITIAL_FIRST_STEPS = {
  foundAnimal: false,
  registeredAnimal: false,
  registeredAnimalId: null,
  readGuide: false,
  completed: false,
};

const INTRO_MISSION = createMission({
  id: 'first-steps',
  title: 'Primeiros passos',
  category: 'Exploração',

  description:
    'Faça sua primeira descoberta e conheça o Guia de Campo.',

  goal: 3,

  reward: {
    xp: 150,
    leaves: 15,
  },

  badge: 'first-steps',

  objectives: (state) => [
    objective(
      'Encontre um animal silvestre',
      1,
      Number(state.firstSteps.foundAnimal)
    ),

    objective(
      'Registre o animal no Guia de Campo',
      1,
      Number(state.firstSteps.registeredAnimal)
    ),

    objective(
      'Conheça sua descoberta no Guia',
      1,
      Number(state.firstSteps.readGuide)
    ),
  ],
});

/* =========================================================
   OLHOS ATENTOS
   ========================================================= */

const EXPLORATION_MISSIONS = [2, 5, 10].map(
  (goal, index) =>
    createStage({
      line: 'eyes-open',
      title: 'Olhos atentos',
      category: 'Exploração',
      stage: index + 1,

      description: `Encontre ${goal} animais silvestres.`,

      goal,
      metric: 'found',

      xp: [100, 200, 350][index],
      leaves: [10, 20, 35][index],

      badge: index === 2 ? 'eyes-open' : null,
    })
);

/* =========================================================
   PESQUISADOR DE CAMPO
   ========================================================= */

const RESEARCH_MISSIONS = [
  createStage({
    line: 'field-researcher',
    title: 'Pesquisador de campo',
    category: 'Pesquisa',
    stage: 1,

    description: 'Consulte fichas de 2 espécies diferentes.',

    goal: 2,
    metric: 'readCount',

    xp: 100,
    leaves: 10,
  }),

  createMission({
    id: 'field-researcher-2',
    line: 'field-researcher',
    title: 'Pesquisador de campo',
    category: 'Pesquisa',

    stage: 2,
    totalStages: 3,

    description:
      'Registre animais durante novos encontros e estude suas características.',

    goal: 4,

    reward: {
      xp: 200,
      leaves: 20,
    },

    objectives: (state) => {
      const progress =
        state.missionProgress['field-researcher-2'] ?? {};

      return [
        objective(
          'Registre 2 espécies diferentes',
          2,
          progress.registeredCount
        ),

        objective(
          'Consulte as fichas de 2 espécies registradas nesta etapa',
          2,
          progress.registeredReadCount
        ),
      ];
    },
  }),

  createStage({
    line: 'field-researcher',
    title: 'Pesquisador de campo',
    category: 'Pesquisa',
    stage: 3,

    description: 'Consulte fichas de 3 espécies diferentes.',

    goal: 3,
    metric: 'readCount',

    xp: 350,
    leaves: 35,

    badge: 'field-researcher',
  }),
];

/* =========================================================
   GUARDIÃO DA TRILHA
   ========================================================= */

export const SIDE_MISSIONS = [3, 7, 15].map(
  (goal, index) =>
    createStage({
      line: 'trail-guardian',
      title: 'Guardião da trilha',
      category: 'Cuidado ambiental',

      stage: index + 1,

      description: `Recolha ${goal} resíduos pelo caminho.`,

      goal,
      metric: 'trash',

      xp: [100, 200, 350][index],
      leaves: [10, 20, 35][index],

      badge: index === 2 ? 'trail-guardian' : null,
    })
);

/* =========================================================
   DESBRAVANDO CAMINHOS
   ========================================================= */

const WALK_MISSIONS = [100, 250, 500].map(
  (goal, index) =>
    createStage({
      line: 'trail-explorer',
      title: 'Desbravando caminhos',
      category: 'Exploração',

      stage: index + 1,

      description: `Caminhe ${goal} metros.`,

      goal,
      metric: 'walkedMeters',

      xp: [50, 100, 200][index],
      leaves: [5, 10, 20][index],

      badge: index === 2 ? 'trail-explorer' : null,
    })
);

/* =========================================================
   MISSÕES ESPECIAIS
   ========================================================= */

function hasRareDiscovery(state) {
  return state.discoveries.some(
    (id) =>
      encounters.find((animal) => animal.id === id)
        ?.rarity === 'rare'
  );
}

export const SPECIAL_MISSIONS = [
  createMission({
    id: 'rare-encounter',
    title: 'Encontro raro',
    category: 'Descoberta',

    description:
      'Registre uma espécie rara no Guia de Campo.',

    goal: 1,

    reward: {
      xp: 250,
      leaves: 25,
    },

    objectives: (state) => [
      objective(
        'Registre uma espécie rara',
        1,
        Number(hasRareDiscovery(state))
      ),
    ],
  }),

  createMission({
    id: 'collector-half',
    title: 'Colecionador de descobertas',
    category: 'Guia',

    description:
      'Complete metade do Guia de Campo.',

    goal: Math.max(1, Math.ceil(encounters.length / 2)),

    reward: {
      xp: 300,
      leaves: 30,
    },

    objectives: (state) => [
      objective(
        'Registre 50% das espécies disponíveis',
        Math.max(1, Math.ceil(encounters.length / 2)),
        state.discoveries.length
      ),
    ],
  }),

  createMission({
    id: 'complete-guide',
    title: 'Guia completo',
    category: 'Guia',

    description:
      'Registre todas as espécies disponíveis.',

    goal: Math.max(1, encounters.length),

    reward: {
      xp: 500,
      leaves: 50,
    },

    badge: 'collector',

    objectives: (state) => [
      objective(
        'Complete o Guia de Campo',
        Math.max(1, encounters.length),
        state.discoveries.length
      ),
    ],
  }),
];

/* =========================================================
   EXPORTAÇÕES
   ========================================================= */

export const MAIN_MISSIONS = [
  INTRO_MISSION,
  ...EXPLORATION_MISSIONS,
  ...RESEARCH_MISSIONS,
  ...WALK_MISSIONS,
  ...SPECIAL_MISSIONS,
];

const MISSION_LINES = [
  EXPLORATION_MISSIONS,
  RESEARCH_MISSIONS,
  SIDE_MISSIONS,
  WALK_MISSIONS,
];

export const FUTURE_MISSIONS = [
  {
    id: 'beginner-botanist',
    title: 'Botânica iniciante',
    description: 'Registre 2 espécies de plantas.',
  },
  {
    id: 'leave-no-trace',
    title: 'Sem deixar rastros',
    description: 'Explore uma trilha cuidando do caminho.',
  },
  {
    id: 'waters-edge',
    title: 'À beira d’água',
    description: 'Encontre uma espécie associada à água.',
  },
  {
    id: 'local-diversity',
    title: 'Diversidade local',
    description: 'Registre um animal e uma planta.',
  },
];

/* =========================================================
   MISSÕES DIÁRIAS
   ========================================================= */

function createDaily(
  id,
  title,
  description,
  metric,
  goal,
  xp,
  leaves
) {
  return createMission({
    id,
    title,
    description,
    category: 'Diária',
    daily: true,

    goal,

    reward: { xp, leaves },

    objectives: (state) => [
      objective(
        description,
        goal,
        state.daily[metric]
      ),
    ],
  });
}

export const DAILY_MISSIONS = [
  createDaily(
    'daily-explorer',
    'Pesquisador do dia',
    'Registre uma espécie durante um encontro.',
    'registered',
    1,
    50,
    5
  ),

  createDaily(
    'daily-walk',
    'Passeio de campo',
    'Caminhe 100 metros.',
    'walkedMeters',
    100,
    50,
    5
  ),

  createDaily(
    'daily-observer',
    'Pesquisador atento',
    'Encontre um animal silvestre.',
    'found',
    1,
    40,
    5
  ),

  createDaily(
    'daily-study',
    'Dia de pesquisa',
    'Consulte uma ficha no Guia de Campo.',
    'read',
    1,
    40,
    5
  ),

  createDaily(
    'daily-discovery',
    'Nova descoberta',
    'Adicione uma espécie inédita ao Guia de Campo.',
    'newDiscoveries',
    1,
    75,
    10
  ),
];

function getDayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ].join('-');
}

function createDailyState(discoveries = []) {
  const today = new Date();

  const dayNumber = Math.floor(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ) / 86400000
  );

  const available = DAILY_MISSIONS.filter(
    (mission) =>
      mission.id !== 'daily-discovery' ||
      discoveries.length < encounters.length
  );

  const mission =
    available[dayNumber % available.length];

  return {
    date: getDayKey(),
    missionId: mission.id,

    completed: false,

    found: 0,
    registered: 0,
    read: 0,
    walkedMeters: 0,
    newDiscoveries: 0,
  };
}

/* =========================================================
   CONTROLE DE MISSÕES ATIVAS
   ========================================================= */

export function isMissionReady(mission, state) {
  return mission.objectives(state).every(
    (item) => item.completed
  );
}

export function getActiveMissions(state) {
  const completed = new Set([
    ...state.completedMissions,
    ...(state.completedSideMissions ?? []),
  ]);

  const active = [];

  if (!completed.has('first-steps')) {
    active.push(INTRO_MISSION);
  } else {
    MISSION_LINES.forEach((line) => {
      const next = line.find(
        (mission) => !completed.has(mission.id)
      );

      if (next) active.push(next);
    });
  }

  SPECIAL_MISSIONS.forEach((mission) => {
    if (!completed.has(mission.id)) {
      active.push(mission);
    }
  });

  const daily = DAILY_MISSIONS.find(
    (mission) => mission.id === state.daily.missionId
  );

  if (daily && !state.daily.completed) {
    active.push(daily);
  }

  return active;
}

export function getCompletedMissions(state) {
  const completed = new Set([
    ...state.completedMissions,
    ...(state.completedSideMissions ?? []),
  ]);

  const missions = [
    ...MAIN_MISSIONS,
    ...SIDE_MISSIONS,
  ].filter((mission) => completed.has(mission.id));

  if (state.daily.completed) {
    const daily = DAILY_MISSIONS.find(
      (mission) =>
        mission.id === state.daily.missionId
    );

    if (daily) missions.push(daily);
  }

  return missions;
}

/* =========================================================
   PROGRESSO INDIVIDUAL POR ETAPA
   ========================================================= */

function addUnique(array, item) {
  return array.includes(item)
    ? array
    : [...array, item];
}

function applyMissionEvent(state, event) {
  // Só as missões já ativas recebem a ação.
  const active = getActiveMissions(state);

  const missionProgress = {
    ...state.missionProgress,
  };

  const daily = { ...state.daily };
  const firstSteps = { ...state.firstSteps };

  active.forEach((mission) => {
    if (isMissionReady(mission, state)) return;

    if (mission.id === 'first-steps') {
      if (event.type === 'found') {
        firstSteps.foundAnimal = true;
      }

      if (
        event.type === 'registered' &&
        firstSteps.foundAnimal
      ) {
        firstSteps.registeredAnimal = true;

        firstSteps.registeredAnimalId ??=
          event.animalId;
      }

      if (
        event.type === 'read' &&
        firstSteps.registeredAnimal &&
        event.animalId === firstSteps.registeredAnimalId
      ) {
        firstSteps.readGuide = true;
      }

      return;
    }

    if (mission.daily) {
      switch (event.type) {
        case 'found':
          daily.found++;
          break;

        case 'registered':
          daily.registered++;

          if (event.isNewDiscovery) {
            daily.newDiscoveries++;
          }

          break;

        case 'read':
          daily.read++;
          break;

        case 'walk':
          daily.walkedMeters += event.meters;
          break;
      }

      return;
    }

    // Missões especiais usam as estatísticas gerais.
    if (!mission.line) return;

    const progress = {
      found: 0,
      trash: 0,
      walkedMeters: 0,

      registeredIds: [],
      readIds: [],
      registeredReadIds: [],

      ...missionProgress[mission.id],
    };

    switch (event.type) {
      case 'found':
        progress.found++;
        break;

      case 'registered':
        progress.registeredIds = addUnique(
          progress.registeredIds,
          event.animalId
        );
        break;

      case 'read':
        progress.readIds = addUnique(
          progress.readIds,
          event.animalId
        );

        if (
          progress.registeredIds.includes(event.animalId)
        ) {
          progress.registeredReadIds = addUnique(
            progress.registeredReadIds,
            event.animalId
          );
        }

        break;

      case 'trash':
        progress.trash++;
        break;

      case 'walk':
        progress.walkedMeters += event.meters;
        break;
    }

    progress.registeredCount =
      progress.registeredIds.length;

    progress.readCount =
      progress.readIds.length;

    progress.registeredReadCount =
      progress.registeredReadIds.length;

    missionProgress[mission.id] = progress;
  });

  return {
    missionProgress,
    daily,
    firstSteps,
  };
}

function refreshDailyState(state) {
  if (state.daily.date === getDayKey()) {
    return state;
  }

  const mission = DAILY_MISSIONS.find(
    (item) => item.id === state.daily.missionId
  );

  // Preserva a recompensa de uma diária anterior
  // se ela foi cumprida, mas ainda não coletada.

  if (
    mission &&
    !state.daily.completed &&
    isMissionReady(mission, state)
  ) {
    return state;
  }

  return {
    ...state,
    daily: createDailyState(state.discoveries),
  };
}

/* =========================================================
   ESTADO INICIAL
   ========================================================= */

function initialState() {
  return {
    xp: 0,
    leaves: 0,

    badges: [],
    discoveries: [],
    foundAnimals: [],
    readAnimals: [],

    trashCollected: 0,

    activeEncounterId: null,
    activeEncounterKey: null,
    lastRegisteredKey: null,

    firstSteps: { ...INITIAL_FIRST_STEPS },

    currentMissionId: 'first-steps',

    completedMissions: [],
    completedSideMissions: [],

    missionProgress: {},

    missionsUnread: true,

    daily: createDailyState(),
  };
}

function applyEvent(original, event, changes = {}) {
  const state = refreshDailyState(original);

  const progress = applyMissionEvent(state, event);

  const next = {
    ...state,
    ...changes,
    ...progress,
  };

  const newlyReady = getActiveMissions(state).some(
    (mission) =>
      !isMissionReady(mission, state) &&
      isMissionReady(mission, next)
  );

  return {
    ...next,

    missionsUnread:
      next.missionsUnread || newlyReady,
  };
}

/* =========================================================
   STORE
   ========================================================= */

export const useProgressStore = create(
  persist(
    (set) => ({
      ...initialState(),

      flagMissionUpdate: () =>
        set({ missionsUnread: true }),

      markMissionsSeen: () =>
        set({ missionsUnread: false }),

      refreshDaily: () =>
        set((state) => refreshDailyState(state)),

      /* ENCONTRO COM ANIMAL */

      markAnimalFound: (animalId, instanceId) =>
        set((state) => {
          const key = `${animalId}-${instanceId ?? 'default'}`;

          // Impede contabilizar o mesmo encontro
          // repetidamente ao tocar no animal.

          if (state.activeEncounterKey === key) {
            return {};
          }

          return applyEvent(
            state,
            {
              type: 'found',
              animalId,
            },
            {
              activeEncounterId: animalId,
              activeEncounterKey: key,

              foundAnimals: addUnique(
                state.foundAnimals,
                animalId
              ),
            }
          );
        }),

      /* REGISTRO */

      registerDiscovery: (animalId) =>
        set((state) => {
          if (
            state.activeEncounterId !== animalId ||
            !state.activeEncounterKey ||
            state.lastRegisteredKey === state.activeEncounterKey
          ) {
            return {};
          }

          const isNewDiscovery =
            !state.discoveries.includes(animalId);

          return applyEvent(
            state,
            {
              type: 'registered',
              animalId,
              isNewDiscovery,
            },
            {
              discoveries: addUnique(
                state.discoveries,
                animalId
              ),

              lastRegisteredKey:
                state.activeEncounterKey,
            }
          );
        }),

      /* LEITURA DO GUIA */

      markGuideRead: (animalId) =>
        set((state) => {
          if (!state.discoveries.includes(animalId)) {
            return {};
          }

          return applyEvent(
            state,
            {
              type: 'read',
              animalId,
            },
            {
              readAnimals: addUnique(
                state.readAnimals,
                animalId
              ),
            }
          );
        }),

      /* COLETA DE RESÍDUOS */

      collectTrashProgress:
        ({ xp = 0, leaves = 0 } = {}) =>
          set((state) =>
            applyEvent(
              state,
              { type: 'trash' },
              {
                trashCollected:
                  state.trashCollected + 1,

                xp: state.xp + xp,
                leaves: state.leaves + leaves,
              }
            )
          ),

      /* CAMINHADA */

      addWalkDistance: (meters) =>
        set((state) => {
          if (
            !Number.isFinite(meters) ||
            meters <= 0
          ) {
            return {};
          }

          return applyEvent(state, {
            type: 'walk',
            meters,
          });
        }),

      /* ===================================================
         COLETAR RECOMPENSAS
         =================================================== */

      claimMission: (missionId) =>
        set((state) => {
          const mission = getActiveMissions(state).find(
            (item) => item.id === missionId
          );

          if (
            !mission ||
            !isMissionReady(mission, state)
          ) {
            return {};
          }

          const next = {
            ...state,

            xp: state.xp + mission.reward.xp,
            leaves: state.leaves + mission.reward.leaves,

            missionsUnread: true,

            badges: mission.badge
              ? addUnique(state.badges, mission.badge)
              : state.badges,
          };

          if (mission.daily) {
            next.daily = {
              ...state.daily,
              completed: true,
            };
          } else {
            next.completedMissions = addUnique(
              state.completedMissions,
              mission.id
            );
          }

          if (mission.id === 'first-steps') {
            next.firstSteps = {
              ...state.firstSteps,
              completed: true,
            };
          }

          const upcoming = getActiveMissions(next);

          next.currentMissionId =
            upcoming.find(
              (item) =>
                item.id === 'first-steps' ||
                item.line
            )?.id ?? null;

          return next;
        }),

      /* RESET */

      resetProgress: () =>
        set(initialState()),
    }),

    {
      name: 'rebrota-progress',

      storage: createJSONStorage(
        () => sessionStorage
      ),

      version: 1,

      migrate: (saved) => ({
        ...initialState(),
        ...saved,

        missionProgress:
          saved?.missionProgress ?? {},

        activeEncounterKey: null,
        lastRegisteredKey: null,

        daily: {
          ...createDailyState(
            saved?.discoveries ?? []
          ),
          ...saved?.daily,
          date: saved?.daily?.date ?? getDayKey(),
        },
      }),
    }
  )
);
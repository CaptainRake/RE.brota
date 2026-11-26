export const characters = [
  {
    id: 'explorador',
    name: 'Guarda Florestal',
    model: 'GuardaFlorestal.glb',
    portrait: 'GuardaFlorestal.png',
    price: 0,
  },
  {
    id: 'banhista',
    name: 'Banhista',
    model: 'Banhista.glb',
    portrait: 'Banhista.png',
    price: 200,
  },
  {
    id: 'trilheiro',
    name: 'Trilheiro',
    model: 'Trilheiro.glb',
    portrait: 'Trilheiro.png',
    price: 50,
  },
  {
    id: 'turista',
    name: 'Turista',
    model: 'Turista.glb',
    portrait: 'Turista.png',
    price: 150,
  },
  {
    id: 'mochileiro',
    name: 'Mochileiro',
    model: 'Mochileiro.glb',
    portrait: 'Mochileiro.png',
    price: 100,
  },
  {
    id: 'desbravador',
    name: 'Desbravador',
    model: 'Desbravador.glb',
    portrait: 'Desbravador.png',
    price: 50,
  },
];

export const getCharacter = (id) =>
  characters.find(
    (character) => character.id === id
  ) ?? characters[0];

export const getCharacterUrl = (character) =>
  `${import.meta.env.BASE_URL}models/characters/${character.model}`;

export const getCharacterPortrait = (character) =>
  `${import.meta.env.BASE_URL}ui/characters/portraits/${character.portrait}`;
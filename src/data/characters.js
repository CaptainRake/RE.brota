// Preços iniciais ajustáveis. O Explorador é gratuito e já equipado.
export const characters = [
  { id: 'explorador', name: 'Explorador', model: 'Explorador.glb', price: 0 },
  { id: 'banhista', name: 'Banhista', model: 'Banhista.glb', price: 100 },
  { id: 'trilheiro', name: 'Trilheiro', model: 'Trilheiro.glb', price: 120 },
  { id: 'turista', name: 'Turista', model: 'Turista.glb', price: 140 },
  { id: 'mochileiro', name: 'Mochileiro', model: 'Mochileiro.glb', price: 160 },
  { id: 'desbravador', name: 'Desbravador', model: 'Desbravador.glb', price: 180 },
];

export const getCharacter = (id) =>
  characters.find((character) => character.id === id) ?? characters[0];

export const getCharacterUrl = (character) =>
  `${import.meta.env.BASE_URL}models/characters/${character.model}`;

RE:BROTA — organização de CSS

Estrutura:
src/styles/
  index.css
  base.css
  splash.css
  login.css
  game.css
  backpack.css
  missions.css
  tutorial.css
  shop.css
  profile.css
  explorer.css
  maplibre.css
  trash.css
  guide.css

No main.jsx (ou onde hoje você importa o global.css), troque:
  import './global.css';

por:
  import './styles/index.css';

Se o global.css estiver dentro de src/styles hoje, ajuste o caminho conforme a sua estrutura.

O index.css é o único arquivo que deve ser importado pela aplicação.
Os demais são importados por ele.

Correções de limpeza aplicadas:
- \#root -> #root
- .missions-toggle-arrow\.open -> .missions-toggle-arrow.open
- *background* -> background
- comentários escapados de Markdown normalizados

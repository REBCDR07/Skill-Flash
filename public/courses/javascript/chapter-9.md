# Chapitre 9 : Modules & Outillage

Pour les projets d'envergure, il est nécessaire de découper le code en modules.

## Export & Import

### Exportation
```javascript
// math.js
export const additionner = (a, b) => a + b;
export default class Calculatrice {}
```

### Importation
```javascript
// main.js
import { additionner } from './math.js';
import MaCalc from './math.js';
```

## L'Écosystème NPM
NPM (Node Package Manager) permet d'installer des milliers de bibliothèques tierces.
- `npm init`
- `npm install lodash`

## Build Tools
- **Babel** : Transpile le JS moderne en JS compatible avec les vieux navigateurs.
- **Webpack/Vite** : Bundle vos fichiers pour la production.

## Exercice Pratique
Essayez de scinder un script complexe en deux fichiers et utilisez `import/export` pour les faire communiquer.

# Custom Hooks

Les Custom Hooks permettent d'extraire la logique de composant dans des fonctions réutilisables.

## Règle de nommage

Un Custom Hook doit toujours commencer par `use`.

## Exemple : useWindowWidth

```jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

# Le State et les Hooks

Le **State** (état) est ce qui permet à un composant de "se souvenir" d'informations.

## useState

Le Hook `useState` permet d'ajouter un état local à un composant fonctionnel.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Cliquez ici : {count}
    </button>
  );
}
```

## useEffect

Le Hook `useEffect` permet d'effectuer des effets de bord (fetching de données, abonnements, etc.).

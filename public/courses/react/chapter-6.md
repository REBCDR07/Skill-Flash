# useEffect Avancé

Le Hook `useEffect` est puissant mais peut être piégeux.

## Tableau de Dépendances

Le tableau de dépendances détermine quand l'effet doit être réexécuté.
- `[]` : Exécuté une seule fois au montage.
- `[prop, state]` : Exécuté quand `prop` ou `state` change.
- Pas de tableau : Exécuté à chaque rendu (dangereux).

## Nettoyage (Cleanup)

Si votre effet crée une souscription ou un timer, vous devez le nettoyer pour éviter les fuites de mémoire.

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log('Tick'), 1000);
  
  // Fonction de nettoyage
  return () => clearInterval(timer);
}, []);
```

# Performance

React est rapide, mais des rendus inutiles peuvent ralentir l'application.

## React.memo

`React.memo` est un HOC (Higher Order Component) qui mémoïse un composant fonctionnel. Il ne se re-rendra que si ses props changent.

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* rendu seulement si props change */
});
```

## useCallback et useMemo

- `useCallback` : Mémoïse une fonction.
- `useMemo` : Mémoïse une valeur calculée coûteuse.

Utilisez-les pour stabiliser les props passées aux composants enfants optimisés avec `React.memo`.

# Context API

Le Contexte permet de passer des données à travers l'arborescence des composants sans avoir à passer manuellement les props à chaque niveau (prop drilling).

## Créer un Contexte

```jsx
const ThemeContext = React.createContext('light');
```

## Provider

Utilisez le Provider pour envelopper les composants qui ont besoin d'accéder au contexte.

```jsx
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>
```

## Consommer le Contexte

```jsx
const theme = useContext(ThemeContext);
```

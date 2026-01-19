# React Router

React Router est la bibliothèque standard pour le routage dans React.

## Installation

```bash
npm install react-router-dom
```

## Composants de base

- `BrowserRouter` : Enveloppe l'application.
- `Routes` et `Route` : Définissent le mapping URL -> Composant.
- `Link` : Remplace la balise `<a>` pour la navigation sans rechargement.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

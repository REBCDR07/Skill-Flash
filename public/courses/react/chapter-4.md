# Gestion des Événements

React gère les événements de manière similaire au DOM standard, mais avec quelques différences syntaxiques (camelCase).

## Exemple

```jsx
function Button() {
  function handleClick() {
    alert('Bouton cliqué !');
  }

  return (
    <button onClick={handleClick}>
      Cliquez-moi
    </button>
  );
}
```

## Passer des arguments

Pour passer un argument à un gestionnaire d'événements, utilisez une fonction fléchée :

```jsx
<button onClick={() => handleDelete(id)}>Supprimer</button>
```

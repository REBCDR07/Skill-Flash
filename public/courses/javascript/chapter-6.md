# Chapitre 6 : JavaScript Asynchrone

Le JavaScript est mono-thread, mais il peut gérer des opérations asynchrones (comme des appels API) sans bloquer l'exécution.

## Les Promises

Une Promise représente une valeur qui sera disponible dans le futur.

```javascript
fetch('https://api.exemple.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Async / Await

Syntaxe moderne et plus lisible pour gérer les Promises.

```javascript
async function chargerDonnees() {
  try {
    const response = await fetch('https://api.exemple.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Erreur :", error);
  }
}
```

## setTimeout & setInterval

```javascript
setTimeout(() => {
  console.log("Exécuté après 2 secondes");
}, 2000);
```

## Exercice Pratique
Utilisez `fetch` (avec une API publique gratuite comme JSONPlaceholder) pour récupérer et afficher une liste de tâches sur votre page.

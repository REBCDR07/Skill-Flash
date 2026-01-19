# Chapitre 8 : Gestion d'Erreurs & Debugging

Savoir identifier et corriger les erreurs est une compétence cruciale.

## Try...Catch

```javascript
try {
  // Code risqué
  const data = JSON.parse(invalidJson);
} catch (error) {
  console.log("Une erreur est survenue : " + error.message);
} finally {
  console.log("S'exécute toujours.");
}
```

## Throwing Errors

```javascript
function diviser(a, b) {
  if (b === 0) {
    throw new Error("Division par zéro impossible !");
  }
  return a / b;
}
```

## Debugging Workflow
- Utilisez `console.table()` pour les objets/tableaux.
- Utilisez le mot-clé `debugger` pour forcer un point d'arrêt.
- Inspectez le call stack dans les outils de développement (F12).

## Exercice Pratique
Simulez un formulaire de connexion et utilisez `throw` pour gérer les cas de champs vides ou de mot de passe trop court.

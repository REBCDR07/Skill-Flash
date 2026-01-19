# Chapitre 3 : Fonctions & ES6+

Les fonctions sont les blocs de construction de base de JavaScript. Elles permettent de regrouper du code réutilisable.

## Déclarations de Fonctions

```javascript
function saluer(nom) {
  return `Bonjour ${nom} !`;
}
```

## Fonctions Fléchées (Arrow Functions)

Introduites avec ES6, elles offrent une syntaxe plus courte.

```javascript
const saluer = (nom) => {
  return `Bonjour ${nom} !`;
};

// Version ultra-courte
const doubler = n => n * 2;
```

## Template Literals

Utilisez les backticks (`) pour intégrer des variables facilement dans des chaînes.

```javascript
const age = 25;
console.log(`J'ai ${age} ans.`);
```

## Destructuration

Extraire des données de tableaux ou d'objets simplement.

```javascript
const personne = { nom: "Alice", ville: "Paris" };
const { nom, ville } = personne;
```

## Exercice Pratique
Transformez une fonction classique en fonction fléchée et utilisez les template literals pour afficher un message complexe.

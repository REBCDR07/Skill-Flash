# Chapitre 4 : Tableaux et Objets

Les structures de données sont essentielles pour organiser les informations dans vos applications.

## Les Tableaux (Arrays)

```javascript
const fruits = ["Pomme", "Banane", "Orange"];

// Méthodes courantes
fruits.push("Fraise"); // Ajoute à la fin
fruits.pop(); // Retire le dernier
fruits.map(f => f.toUpperCase()); // Transforme chaque élément
```

## Les Objets (Objects)

```javascript
const voiture = {
  marque: "Tesla",
  modele: "Model 3",
  demarrer: function() {
    console.log("Vroum !");
  }
};
```

## Manipulation Avancée

### Spread Operator (...)
```javascript
const nouveauxFruits = [...fruits, "Mangue"];
```

### Méthodes de Recherche
- `find()` : Trouve le premier élément correspondant.
- `filter()` : Retourne un nouveau tableau avec tous les éléments correspondants.

## Exercice Pratique
Créez un tableau d'objets représentant des utilisateurs et utilisez `filter` pour trouver ceux qui habitent dans une ville spécifique.

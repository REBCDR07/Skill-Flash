# Chapitre 2 : Types de données & Opérateurs

JavaScript est un langage à typage dynamique. Cela signifie que vous n'avez pas besoin de spécifier le type d'une variable lors de sa déclaration.

## Les Types Primitifs

Il existe 7 types primitifs en JavaScript :
1. **String** : Chaînes de caractères.
2. **Number** : Nombres (entiers et flottants).
3. **Boolean** : `true` ou `false`.
4. **Undefined** : Une variable déclarée mais non initialisée.
5. **Null** : Représente intentionnellement l'absence de valeur.
6. **Symbol** : Identifiant unique et immuable.
7. **BigInt** : Pour les nombres entiers très grands.

## Les Opérateurs

### Opérateurs Arithmétiques
```javascript
let somme = 10 + 5;
let produit = 10 * 5;
let modulo = 10 % 3; // Reste de la division
```

### Opérateurs de Comparaison
```javascript
console.log(10 == "10"); // true (comparaison de valeur)
console.log(10 === "10"); // false (comparaison de valeur ET de type)
```

### Opérateurs Logiques
- `&&` (ET)
- `||` (OU)
- `!` (NON)

## Exercice Pratique
Essayez de créer une variable pour chaque type primitif et utilisez les opérateurs pour les manipuler dans la console de votre navigateur.

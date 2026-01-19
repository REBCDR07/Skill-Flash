# Introduction & Variables

JavaScript est le langage de programmation du Web. Il permet de créer des sites interactifs, des applications mobiles, des serveurs et bien plus encore.

## Un peu d'histoire
Créé en 1995 en seulement 10 jours par Brendan Eich, JavaScript est devenu l'un des langages les plus populaires au monde.

## Où s'exécute-t-il ?
Il s'exécute principalement dans le **navigateur** (client-side), mais aussi sur le **serveur** grâce à Node.js.

## Déclarer des variables
En JavaScript moderne (ES6+), nous utilisons principalement `let` et `const`.

1.  **const** : Pour les valeurs qui ne changent pas (constantes).
    ```javascript
    const pi = 3.14159;
    ```
2.  **let** : Pour les valeurs qui peuvent être réinitialisées.
    ```javascript
    let score = 0;
    score = 10; // Valide
    ```
3.  **var** : L'ancienne façon de déclarer des variables (à éviter car sa portée est moins prévisible).

## Les types simples
- **String** : Du texte. `"Bonjour"`
- **Number** : Des nombres. `42` ou `3.14`
- **Boolean** : `true` ou `false`
- **Null** : Une valeur intentionnellement vide.
- **Undefined** : Une variable déclarée mais non définie.

```javascript
let nom = "SkillFlash";
let estActif = true;
let points = 100;
```

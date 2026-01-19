# Chapitre 5 : Manipulation du DOM

Le DOM (Document Object Model) est l'interface qui permet de manipuler le contenu HTML avec JavaScript.

## Sélectionner des Éléments

```javascript
const titre = document.querySelector('h1');
const boutons = document.querySelectorAll('.btn');
```

## Modifier le Contenu

```javascript
titre.textContent = "Nouveau Titre";
titre.style.color = "blue";
titre.classList.add('active');
```

## Gérer les Événements

```javascript
const btn = document.getElementById('monBouton');
btn.addEventListener('click', () => {
  alert('Cliqué !');
});
```

## Créer dynamiquement des éléments

```javascript
const nouveauPara = document.createElement('p');
nouveauPara.textContent = "Je suis nouveau !";
document.body.appendChild(nouveauPara);
```

## Exercice Pratique
Créez un petit compteur : un chiffre affiché, et deux boutons "+" et "-" qui modifient la valeur en temps réel.

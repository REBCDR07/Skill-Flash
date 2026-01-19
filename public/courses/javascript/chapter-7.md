# Chapitre 7 : Classes & Programmation Orientée Objet

JavaScript utilise des prototypes, mais la syntaxe `class` rend la POO plus intuitive.

## Déclarer une Classe

```javascript
class Animal {
  constructor(nom) {
    this.nom = nom;
  }

  crier() {
    console.log(`${this.nom} fait du bruit.`);
  }
}
```

## Héritage

```javascript
class Chien extends Animal {
  crier() {
    console.log(`${this.nom} aboie !`);
  }
}

const monChien = new Chien("Rex");
monChien.crier();
```

## Getters & Setters

```javascript
class Rectangle {
  constructor(largeur, hauteur) {
    this.largeur = largeur;
    this.hauteur = hauteur;
  }

  get aire() {
    return this.largeur * this.hauteur;
  }
}
```

## Exercice Pratique
Créez une classe `Utilisateur` avec des propriétés privées et une méthode pour afficher un profil complet.

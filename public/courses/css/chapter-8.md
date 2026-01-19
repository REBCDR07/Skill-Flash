# Chapitre 8 : Variables CSS et Fonctions

CSS est devenu un véritable langage programmable grâce aux variables (Custom Properties) et aux fonctions.

## 1. Déclarer des variables

On les définit généralement dans le sélecteur `:root` pour une portée globale.

```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --spacing: 20px;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing);
}
```

## 2. La fonction calc()

Pratique pour mélanger des unités différentes.

```css
.sidebar {
  width: calc(100% - 300px);
}
```

## 3. Fonctions de couleur moderne

- `rgba()` : Couleur avec transparence.
- `hsl()` : Teinte, Saturation, Luminosité (plus intuitif).

```css
.overlay {
  background-color: hsla(210, 100%, 50%, 0.5);
}
```

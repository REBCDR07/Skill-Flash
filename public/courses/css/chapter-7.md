# Chapitre 7 : Sélecteurs Avancés et Pseudo-classes

Maîtriser les sélecteurs CSS vous permet d'écrire moins de code et de cibler précisément vos éléments.

## 1. Sélecteurs combinés

- `div p` : Tous les `<p>` à l'intérieur d'un `<div>`.
- `div > p` : Uniquement les `<p>` qui sont des enfants directs d'un `<div>`.
- `h2 + p` : Le premier `<p>` juste après un `<h2>`.

## 2. Pseudo-classes d'état

```css
a:hover { color: gold; }
a:active { transform: scale(0.95); }
input:focus { border-color: primary; }
```

## 3. Pseudo-classes de structure

- `:first-child` : Le premier élément.
- `:last-child` : Le dernier élément.
- `:nth-child(2n)` : Tous les éléments pairs.

```css
li:nth-child(odd) {
  background-color: #f9f9f9;
}
```

## 4. Pseudo-éléments

Utilisez `::before` et `::after` pour ajouter du contenu décoratif sans toucher au HTML.

```css
.quote::before {
  content: "“";
  font-size: 2em;
}
```

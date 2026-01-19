# Chapitre 4 : CSS Grid : La puissance du layout

Contrairement à Flexbox, CSS Grid est un système de mise en page bidimensionnel (lignes et colonnes).

## 1. Définir une grille

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes égales */
  grid-template-rows: auto;
  gap: 15px;
}
```

## 2. Placer des éléments

Vous pouvez décider exactement où un élément commence et s'arrête.

```css
.header {
  grid-column: 1 / 4; /* Prend les 3 colonnes */
}

.sidebar {
  grid-row: 2 / 4;   /* Prend 2 lignes */
}
```

## 3. Grid Template Areas

Une façon très visuelle de construire des layouts.

```css
.page {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main  main"
    "footer footer footer";
}
```

---
> **Astuce :** Utilisez Flexbox pour les petits alignements et Grid pour la structure globale de votre page.

# Chapitre 3 : Flexbox : Le guide complet

Flexbox est un module de mise en page unidimensionnel qui facilite l'alignement et la distribution de l'espace entre les éléments.

## 1. Le Conteneur Flex

Tout commence avec `display: flex;`.

```css
.container {
  display: flex;
  justify-content: center; /* Aligne sur l'axe principal */
  align-items: center;     /* Aligne sur l'axe secondaire */
  gap: 20px;               /* Espace entre les éléments */
}
```

## 2. Propriétés principales

- `flex-direction` : `row` (par défaut) ou `column`.
- `justify-content` : `flex-start`, `flex-end`, `center`, `space-between`, `space-around`.
- `align-items` : `stretch`, `center`, `flex-start`, `flex-end`.

## 3. Les éléments enfants (Items)

- `flex-grow` : Capacité de l'élément à s'étirer.
- `flex-shrink` : Capacité de l'élément à se réduire.
- `flex-basis` : Taille initiale de l'élément.

## Exemple concret : Barre de navigation

```html
<nav style="display: flex; justify-content: space-between; padding: 20px;">
  <div>Logo</div>
  <ul style="display: flex; gap: 15px; list-style: none;">
    <li>Accueil</li>
    <li>Cours</li>
    <li>Contact</li>
  </ul>
</nav>
```

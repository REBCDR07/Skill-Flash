# Chapitre 10 : Optimisation et Architecture CSS

Écrire du CSS c'est bien, écrire du CSS maintenable et performant c'est mieux.

## 1. Méthodologie BEM

BEM (Block Element Modifier) est une convention de nommage qui aide à garder votre code clair.

```css
/* Block */
.card {}

/* Element (imbriqué avec __) */
.card__title {}
.card__image {}

/* Modifier (variation avec --) */
.card--featured {}
```

## 2. Performance CSS

- **Minification :** Supprimez les espaces inutiles en production.
- **Réduction du code inutilisé :** Utilisez des outils comme PurgeCSS.
- **Chargement critique :** Chargez en priorité le CSS nécessaire au-dessus de la ligne de flottaison.

## 3. Bonnes pratiques

- Évitez l'usage excessif de `!important`.
- Utilisez une structure de dossiers claire (7-1 pattern en Sass).
- Commentez les sections complexes de votre code.

## Conclusion du cours

Bravo ! Vous avez maîtrisé les bases et les concepts avancés du **CSS3**. Vous avez maintenant tous les outils pour créer des interfaces web époustouflantes, responsives et animées.

---
> **Prochaine étape :** Relevez le défi du test final CSS pour obtenir votre certification officielle !

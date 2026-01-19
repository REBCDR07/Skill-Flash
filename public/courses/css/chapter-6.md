# Chapitre 6 : Responsive Design & Media Queries

Le web est consulté sur une multitude d'écrans : mobiles, tablettes, desktops. Votre site doit s'adapter à tous.

## 1. La Viewport Meta Tag

C'est la première étape indispensable dans votre HTML.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 2. Les Media Queries

Appliquez des styles spécifiques selon la taille de l'écran.

```css
/* Style par défaut (Mobile first) */
.container { width: 100%; }

/* Tablettes et plus (>= 768px) */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktops et plus (>= 1024px) */
@media (min-width: 1024px) {
  .container { width: 1000px; }
}
```

## 3. Unités relatives

Évitez les `px` pour les mises en page. Utilisez :
- `%` : Pourcentage du parent.
- `vw` / `vh` : Pourcentage de la largeur/hauteur de la fenêtre.
- `em` / `rem` : Basé sur la taille de la police.

### Exercice Pratique

1. Créez un tableau de bord avec une grille 3x3.
2. Ajoutez un menu de navigation responsive.
3. Optimisez les images pour le web.

---

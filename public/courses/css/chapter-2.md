# Le Modèle de Boîte (Box Model)

Le modèle de boîte est l'un des concepts les plus fondamentaux du CSS. Chaque élément HTML est considéré comme une boîte rectangulaire.

## Composition d'une boîte
Une boîte CSS se compose de quatre parties (de l'intérieur vers l'extérieur) :

1.  **Content** : Le contenu réel (texte, image).
2.  **Padding** : L'espace entre le contenu et la bordure (invisible).
3.  **Border** : La bordure autour du contenu et du padding.
4.  **Margin** : L'espace à l'extérieur de la bordure, pour séparer les éléments.

![Box Model Diagram](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model/box-model.png)

## Propriétés clés

### Width & Height
Définit la taille de la zone de contenu (par défaut).
```css
.box {
  width: 300px;
  height: 200px;
}
```

### Box-Sizing
La propriété `box-sizing: border-box;` est très utile car elle inclut le padding et la bordure dans la largeur/hauteur définie.
```css
* {
  box-sizing: border-box;
}
```

### Padding et Margins
On peut définir les quatre côtés d'un coup ou séparément.
```css
.box {
  padding: 20px; /* Tous les côtés */
  margin-top: 10px;
  margin-right: 5px;
}
```

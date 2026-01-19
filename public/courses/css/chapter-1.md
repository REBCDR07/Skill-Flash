# Introduction au CSS3

Cascading Style Sheets (CSS) est le langage utilisé pour styliser et mettre en page les pages web. C'est ce qui transforme un document HTML brut en une expérience visuelle attrayante.

## Qu'est-ce que le CSS ?
CSS est un langage de feuilles de style. Il permet d'appliquer des styles (couleurs, polices, espacement) à des éléments HTML.

### Pourquoi "Cascading" ?
Le terme "Cascading" (en cascade) signifie que plusieurs règles peuvent s'appliquer à un même élément. Le navigateur suit une hiérarchie spécifique pour déterminer quelle règle l'emporte.

## Intégration du CSS
Il existe trois façons d'ajouter du CSS à un document HTML :

1.  **Externe** : Lien vers un fichier `.css` externe (recommandé).
    ```html
    <link rel="stylesheet" href="style.css">
    ```
2.  **Interne** : Dans une balise `<style>` dans le `<head>`.
    ```html
    <style>
      body { background-color: #f0f0f0; }
    </style>
    ```
3.  **En ligne** : Directement sur l'élément (à éviter).
    ```html
    <h1 style="color: blue;">Bonjour</h1>
    ```

## Syntaxe de base
Une règle CSS se compose d'un **sélecteur** et d'un **bloc de déclaration**.

```css
h1 {
  color: #6E56CF;
  font-size: 24px;
  text-align: center;
}
```

- **Sélecteur** : Cible l'élément HTML (`h1`).
- **Propriété** : Ce que vous voulez changer (`color`).
- **Valeur** : La nouvelle apparence (`#6E56CF`).

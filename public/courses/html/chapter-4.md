# Chapitre 4 : Liens et Images

Une page web isolée n'est pas très utile. Les liens créent le réseau du web, et les images le rendent vivant.

## 1. Les Liens Hypertexte

Utilisez la balise `<a>` (anchor) avec l'attribut `href`.

```html
<!-- Lien externe -->
<a href="https://google.com">Aller sur Google</a>

<!-- Lien vers une page du site -->
<a href="contact.html">Nous contacter</a>

<!-- Lien avec cible -->
<a href="doc.pdf" target="_blank">Ouvrir le PDF (nouvel onglet)</a>
```

## 2. Les Images

La balise `<img>` est une balise Auto-fermante. Elle nécessite `src` (source) et `alt` (texte alternatif).

```html
<img src="logo.png" alt="Logo de SkillFlash Academy" width="200">
```

> **Attention :** N'oubliez jamais l'attribut `alt`. Il est crucial pour l'accessibilité (lecteurs d'écran) et le SEO.

## 3. Liens sur des images

Vous pouvez imbriquer une image à l'intérieur d'un lien.

```html
<a href="index.html">
  <img src="home-icon.png" alt="Accueil">
</a>
```

## Exercice pratique

Essayez de créer un lien qui pointe vers votre profil LinkedIn avec une icône personnalisée !

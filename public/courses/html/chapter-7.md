# Chapitre 7 : HTML5 Sémantique

Le HTML sémantique consiste à utiliser des balises qui décrivent précisément la nature du contenu qu'elles renferment, plutôt que d'utiliser des `<div>` partout.

## 1. Pourquoi la sémantique ?

- **Accessibilité :** Aide les lecteurs d'écran à comprendre la structure.
- **SEO :** Aide les moteurs de recherche à indexer le contenu important.
- **Maintenabilité :** Le code est plus lisible pour les développeurs.

## 2. Les balises sémantiques clés

- `<header>` : En-tête du site ou d'une section.
- `<nav>` : Liens de navigation.
- `<main>` : Contenu principal unique de la page.
- `<section>` : Un groupe thématique de contenu.
- `<article>` : Un contenu autonome (blog post, news).
- `<aside>` : Contenu indirectement lié (sidebar).
- `<footer>` : Pied de page.

## Exemple de structure moderne

```html
<header>
  <h1>Mon Blog Tech</h1>
  <nav>
    <a href="/">Accueil</a>
  </nav>
</header>

<main>
  <article>
    <h2>Le futur du HTML</h2>
    <p>Le HTML continue d'évoluer...</p>
  </article>
</main>

<footer>
  <p>© 2026 SkillFlash Academy</p>
</footer>
```

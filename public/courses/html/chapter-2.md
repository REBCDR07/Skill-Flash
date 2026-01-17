# Structure d'une page HTML

## Anatomie d'un document HTML5

Un document HTML5 bien structuré suit une hiérarchie précise. Comprendre cette structure est essentiel pour créer des pages web accessibles et optimisées pour le SEO.

### 🎯 Objectifs de ce chapitre

- Maîtriser la structure d'un document HTML5
- Comprendre les balises sémantiques
- Organiser le contenu de manière logique

---

## Structure de base

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Description de la page">
    <title>Titre de la page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav><!-- Navigation --></nav>
    </header>
    
    <main>
        <article><!-- Contenu principal --></article>
    </main>
    
    <footer><!-- Pied de page --></footer>
</body>
</html>
```

---

## Les balises sémantiques HTML5

HTML5 a introduit des balises **sémantiques** qui donnent du sens au contenu :

| Balise | Description |
|--------|-------------|
| `<header>` | En-tête de page ou de section |
| `<nav>` | Navigation principale |
| `<main>` | Contenu principal (unique) |
| `<article>` | Contenu indépendant |
| `<section>` | Section thématique |
| `<aside>` | Contenu complémentaire |
| `<footer>` | Pied de page ou de section |

### Pourquoi utiliser des balises sémantiques ?

1. **Accessibilité** : Les lecteurs d'écran comprennent mieux la structure
2. **SEO** : Les moteurs de recherche indexent mieux le contenu
3. **Maintenabilité** : Le code est plus lisible

---

## L'élément `<head>`

Le `<head>` contient les métadonnées importantes :

```html
<head>
    <!-- Encodage des caractères -->
    <meta charset="UTF-8">
    
    <!-- Responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO -->
    <meta name="description" content="Description pour les moteurs de recherche">
    <meta name="keywords" content="mots, clés, importants">
    
    <!-- Titre de l'onglet -->
    <title>Mon Site Web</title>
    
    <!-- Favicon -->
    <link rel="icon" href="favicon.ico">
    
    <!-- Feuilles de style -->
    <link rel="stylesheet" href="styles.css">
</head>
```

---

## 💡 Mini-activité

Créez une structure HTML5 complète pour un blog avec :
- Un header avec navigation
- Un article principal
- Une sidebar avec des liens
- Un footer avec des informations de contact

---

## Points clés à retenir

✅ Utilisez les balises sémantiques pour structurer votre contenu  
✅ Le `<main>` doit être unique sur chaque page  
✅ Les métadonnées dans `<head>` sont cruciales pour le SEO  
✅ `<meta viewport>` est essentiel pour le responsive design

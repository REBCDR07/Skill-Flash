# Chapitre 5 : Formulaires HTML

Les formulaires permettent l'interaction utilisateur : connexion, recherche, inscription, etc.

## 1. Structure de base

Tout commence par la balise `<form>`.

```html
<form action="/submit" method="POST">
  <!-- Les champs ici -->
</form>
```

## 2. Les Champs Typiques

- `<input type="text">` : Texte simple.
- `<input type="email">` : Pour les adresses mail (inclut une validation de base).
- `<input type="password">` : Masque les caractères.
- `<textarea>` : Pour de longs textes.

## 3. Labels et Boutons

Utilisez `<label>` pour l'accessibilité.

```html
<label for="username">Nom d'utilisateur :</label>
<input type="text" id="username" name="user">

<button type="submit">Envoyer</button>
```

## Exemple : Formulaire de contact

```html
<form>
  <div>
    <label>Nom :</label>
    <input type="text" placeholder="Votre nom">
  </div>
  <div>
    <label>Message :</label>
    <textarea></textarea>
  </div>
  <button type="submit">Envoyer mon message</button>
</form>
```

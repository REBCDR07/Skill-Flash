# Chapitre 9 : Frameworks CSS (Tailwind, Bootstrap)

Les frameworks sont des bibliothèques de styles pré-écrits qui accélèrent le développement.

## 1. Frameworks de Composants (Bootstrap)

Fournit des composants prêts à l'emploi (boutons, modales, navbars).

```html
<button class="btn btn-primary">Mon Bouton Bootstrap</button>
```

## 2. Frameworks Utility-First (Tailwind CSS)

Vous appliquez des classes utilitaires directement dans le HTML. C'est l'approche moderne la plus populaire.

```html
<div class="bg-blue-500 p-4 text-white rounded-lg shadow-lg">
  Ceci est stylé avec Tailwind
</div>
```

## 3. Choisir son outil

- **Bootstrap :** Rapide pour des prototypes standards.
- **Tailwind :** Liberté totale sans quitter le HTML, code final plus léger.
- **Sass :** Préprocesseur pour organiser votre CSS complexe.

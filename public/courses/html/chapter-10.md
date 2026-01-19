# Chapitre 10 : Accessibilité et Web Design

Créer un site web n'est pas seulement une question de code, c'est aussi une question d'expérience utilisateur (UX) pour **tous**.

## 1. Accessibilité (A11y)

L'accessibilité permet aux personnes en situation de handicap d'utiliser le web.

- **Attributs Aria :** Fournissent des informations supplémentaires.
- **Contrastes :** Assurez-vous que le texte est lisible sur le fond.
- **Navigation au clavier :** Tout doit être cliquable avec `Tab`.

```html
<button aria-label="Fermer le menu" onclick="closeMenu()">X</button>
```

## 2. Le Design propre

- **Espacement :** Ne surchargez pas vos pages.
- **Hiérarchie :** Utilisez correctement les titres pour guider l'œil.
- **Simplicité :** Moins c'est mieux (KISS : Keep It Simple, Stupid).

## 3. Les Outils de validation

Utilisez le validateur du **W3C** pour vérifier la propreté de votre code HTML.

```bash
# Exemple de commande pour tester localement (si outil installé)
html-validator --file index.html
```

## Conclusion du cours

Félicitations ! Vous avez parcouru les 10 piliers du HTML. Vous êtes maintenant prêt à passer à l'étape suivante : le style avec **CSS3**.

---
> **Prochaine étape :** Validez le test final pour obtenir votre certificat SkillFlash HTML !

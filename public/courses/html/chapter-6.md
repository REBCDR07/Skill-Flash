# Chapitre 6 : Listes et Tableaux

L'organisation des données est fondamentale pour la lisibilité d'une page web.

## 1. Les Listes

Il existe deux types principaux de listes :
- **Listes à puces (Non ordonnées) :** `<ul>`
- **Listes numérotées (Ordonnées) :** `<ol>`

Chaque élément de la liste est défini par `<li>`.

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JS</li>
</ul>

```

## 2. Les Tableaux

Utilisez `<table>` pour afficher des données tabulaires.

- `<tr>` : Ligne (Table Row)
- `<th>` : En-tête (Table Header)
- `<td>` : Cellule (Table Data)

```html

<table border="1">
  <tr>
    <th>Technologie</th>
    <th>Difficulté</th>
  </tr>
  <tr>
    <td>HTML</td>
    <td>Débutant</td>
  </tr>
</table>
```

## 3. Structure avancée de tableau

Pour des tableaux propres, utilisez `<thead>`, `<tbody>` et `<tfoot>`.

```html
<table>
  <thead>
    <tr><th>Mois</th><th>Ventes</th></tr>
  </thead>
  <tbody>
    <tr><td>Janvier</td><td>1500€</td></tr>
  </tbody>
</table>
```

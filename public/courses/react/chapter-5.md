# Rendu Conditionnel et Listes

## Rendu Conditionnel

Vous pouvez utiliser les opérateurs logiques JavaScript comme `&&` ou l'opérateur ternaire `? :`.

```jsx
<div>
  {isLoggedIn ? (
    <LogoutButton />
  ) : (
    <LoginButton />
  )}
</div>
```

## Listes et Clés

Pour afficher une liste d'éléments, utilisez la méthode `.map()`. N'oubliez pas la prop `key`.

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

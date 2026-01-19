# Chapitre 5 : Animations et Transitions

Le CSS ne sert pas qu'à positionner, il sert aussi à dynamiser l'expérience utilisateur.

## 1. Les Transitions

Passez d'un état A à un état B en douceur.

```css
.button {
  background-color: blue;
  transition: background-color 0.3s ease-in-out;
}

.button:hover {
  background-color: navy;
}
```

## 2. Les Animations (@keyframes)

Pour des mouvements plus complexes et répétitifs.

```css
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.glow-card {
  animation: pulse 2s infinite ease;
}
```

## 3. Propriétés d'animation

- `animation-name`
- `animation-duration`
- `animation-iteration-count` (infinite, 1, 2...)
- `animation-delay`

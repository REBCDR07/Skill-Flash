# Chapitre 8 : Multimédia (Audio & Vidéo)

Le web moderne ne se limite pas au texte et aux images fixes. HTML5 a introduit des balises natives pour les médias riches.

## 1. Vidéo

La balise `<video>` permet d'afficher des vidéos sans plugin externe.

```html
<video width="640" controls poster="image_apercu.jpg">
  <source src="cours.mp4" type="video/mp4">
  Votre navigateur ne supporte pas la balise vidéo.
</video>
```
- `controls` : Affiche lecture, pause, volume.
- `poster` : Image affichée avant le lancement.

## 2. Audio

Similaire à la vidéo, mais pour le son.

```html
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
  Votre navigateur ne supporte pas l'audio.
</audio>
```

## 3. iFrames (Contenu Externe)

Pour intégrer une vidéo YouTube ou une carte Google Maps.

```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  frameborder="0">
</iframe>
```

---
> **Conseil :** Hébergez vos vidéos lourdes sur des plateformes dédiées (YouTube, Vimeo) pour ne pas ralentir votre propre serveur.

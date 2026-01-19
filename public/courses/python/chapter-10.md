# Mini-Projet Final

Combinons tout ce que nous avons appris pour créer un script de gestion de tâches (To-Do List) sauvegardé dans un fichier JSON.

## Structure

1.  Charger les tâches depuis `tasks.json`.
2.  Menu principal : Ajouter, Voir, Supprimer, Quitter.
3.  Sauvegarder à chaque modification.

## Code de départ

```python
import json

def load_tasks():
    try:
        with open('tasks.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_tasks(tasks):
    with open('tasks.json', 'w') as f:
        json.dump(tasks, f)

# À vous de jouer pour la boucle principale !
```

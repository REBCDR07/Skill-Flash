# Introduction aux APIs

Les APIs permettent de communiquer avec d'autres services.

## Le module Requests

Bien que non standard, c'est la référence. (À installer avec `pip install requests`).

```python
import requests

x = requests.get('https://api.github.com')

print(x.status_code)
print(x.json())
```

## Méthodes HTTP

- **GET** : Récupérer des données
- **POST** : Envoyer des données
- **PUT/PATCH** : Mettre à jour des données
- **DELETE** : Supprimer des données

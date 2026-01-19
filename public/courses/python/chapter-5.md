# Manipulation de Fichiers

Python permet de lire et écrire des fichiers facilement.

## Lire un fichier

```python
f = open("demofile.txt", "r")
print(f.read())
f.close()
```

## Écrire dans un fichier

```python
f = open("demofile.txt", "a")
f.write("Une nouvelle ligne !")
f.close()
```

Utilisez toujours `with` pour une gestion plus sûre :

```python
with open("file.txt", "r") as f:
    print(f.read())
```

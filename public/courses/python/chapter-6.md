# Gestion des Erreurs

Il est impossible de prévoir toutes les erreurs, mais on peut les gérer pour éviter le crash du programme.

## Try / Except

```python
try:
  print(x)
except NameError:
  print("Variable x non définie")
except:
  print("Une autre erreur est survenue")
```

## Finally

Le bloc `finally` s'exécute toujours, erreur ou pas.

```python
try:
  f = open("demofile.txt")
  f.write("Lorum Ipsum")
except:
  print("Quelque chose s'est mal passé lors de l'écriture")
finally:
  f.close()
```

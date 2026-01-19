# Programmation Orientée Objet (POO)

Python est un langage orienté objet. Tout est objet.

## Classes et Objets

Une Classe est comme un plan (blueprint), un Objet est une instance de ce plan.

```python
class Person:
  def __init__(self, name, age):
    self.name = name
    self.age = age

  def myfunc(self):
    print("Bonjour, je suis " + self.name)

p1 = Person("Alice", 36)
p1.myfunc()
```

## Héritage

```python
class Student(Person):
  pass
```

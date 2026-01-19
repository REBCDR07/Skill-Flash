# Bibliothèques Standards

Python vient avec une "batterie incluse" de modules utiles.

## Math

```python
import math

x = math.pi
y = math.sqrt(64)
```

## DateTime

```python
import datetime

x = datetime.datetime.now()
print(x.year)
print(x.strftime("%A"))
```

## JSON

```python
import json

x =  '{ "name":"John", "age":30, "city":"New York"}'
y = json.loads(x)
print(y["age"])
```

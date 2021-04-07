# Design
Data Types:
- macro set:
  - Calories
  - Protein
  - Fat
  - Carbs
- food:
  - name
  - macro set or list of names of other foods

State:
- food:
  - key is name
  - value is macro set
- targets:
  - key is day
  - value is macro set
- actuals:
  - key is day
  - value is an ordered list of foods

Views:
- create a new food
- create a new target
- create a new day
  - Incremental visualization, maybe https://vega.github.io/vega/examples/radar-chart/
  - Sugggest a list of possible foods (select macros allowed to go over)

# Actual Data
- Protein 1.2g/pound = ~220g = 1144 calories
- Fat: >= 20% = >=425 calories = 48g
- Carbs = <= 556 calories = 139g
- Total = maintenance - 15% = 2500–2750* 0.85 = 2125—2337

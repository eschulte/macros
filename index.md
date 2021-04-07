---
layout: default
title: Macros
---

# Target calculation
- Total calories = maintenance - 15% = 2500–2750* 0.85 = 2125—2337 calories
- Protein 1.2g/pound = ~220g = 1144 calories
- Fat: >= 20% = >=425 calories = 48g
- Carbs = <= 556 calories = 139g

# Today

<div class="w3-row-padding">
<div class="w3-half w3-container">

Table: Actual/Target
<table id="today-content"></table>

Add a food:
<form id="add-a-food">
<label for="food">Food:</label>
<input type="text" id="food" name="food">
<button type="submit">Add</button>
</form>

Foods:
<ul id="foods"></ul>

</div>
<div class="w3-half w3-container" id="view"></div>
</div>

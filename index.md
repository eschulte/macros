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

<table id="today-content"></table></br>

<form id="add-a-food" onsubmit="add_food()">
<label for="food">Ate:</label>
<input type="text" id="add-food" name="food" autocomplete="off" style="position: relative;">
<button type="submit">Add</button>
</form>

Foods today:
<ul id="foods"></ul>

</div>
<div class="w3-half w3-container" id="view"></div>
</div>

---
layout: default
title: Macros
---

# Target calculation
The instructions I've heard are to:
1. Start with your *maintenance calories* and then either add or drop
   10-20% based on if you're looking more to lose weight or add
   muscle, basically based on if you're currently a little over or
   under weight.
2. Then you calculate how much protein you should be consuming daily.
   Which for me came to 1.2g/pound.
3. You want *at least* (you can do more) 20% of your calories from fat.
4. I forget how carbs were calculated.

So for me this all works out to:
- Total calories = maintenance - 15% = 2500–2750* 0.85 = 2125—2337 calories
- Protein 1.2g/pound = ~220g = 1144 calories
- Fat: >= 20% = >=425 calories = 48g
- Carbs = <= 556 calories = 139g

# Today

<div class="w3-row-padding">
<div class="w3-half w3-container">

<table id="today-content"></table></br>

<form action="#" id="add-a-food" onsubmit="add_food();return false">
<label for="food">Food:</label>
<input type="text" id="add-food" name="food" autocomplete="off" style="position: relative;">
<button type="submit">Add</button>
</form>
<ul id="foods"></ul>
</div>
<div class="w3-half w3-container" id="view" style="position:relative;left:-60px;"></div>
</div>

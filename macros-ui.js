function macro_table(macros) {
  let tgt = get_target()
  return "<table>"+
    "<tr><th></th><th>actual/target</th><th></th><th>actual/target</th></tr>"+
    "<tr>"+
    "<th>Total</th><td style='text-align:center'>"+macros['total']['calories']+"/"+tgt['total']['calories']+"cal</td>"+
    "<th>Fat</th><td style='text-align:center'>"+macros['fat']['grams']+"/"+tgt['fat']['grams']+"g</td>"+
    "</tr>"+
    "<tr>"+"<th>Protein</th><td style='text-align:center'>"+macros['protein']['grams']+"/"+tgt['protein']['grams']+"g</td>"+
    "<th>Carbs</th><td style='text-align:center'>"+macros['carbs']['grams']+"/"+tgt['carbs']['grams']+"g</td>"+
    "</tr>"+
    "</table>"
}

function macro_radial_json(macros) {
  let tgt = get_target()
  let actual_protein = macros['protein']['grams']
  let target_protein = tgt['protein']['grams']
  let actual_cal = +(macros['total']['calories']/10).toFixed(2)
  let target_cal = +(tgt['total']['calories']/10).toFixed(2)
  let actual_fat = macros['fat']['grams']
  let target_fat = tgt['fat']['grams']
  let actual_carbs = macros['carbs']['grams']
  let target_carbs = tgt['carbs']['grams']
  return {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A actual and target macros.",
    "width": 340,
    "height": 340,
    "padding": 0,
    "autosize": {"type": "none", "contains": "padding"},

    "signals": [
      {"name": "radius", "update": "width / 2"}
    ],

    "data": [
      {
        "name": "table",
        "values": [
          {"key": "protein", "value": target_protein, "category": 0},
          {"key": "cal/10", "value": target_cal, "category": 0},
          {"key": "fat", "value": target_fat, "category": 0},
          {"key": "carbs", "value": target_carbs, "category": 0},
          {"key": "protein", "value": actual_protein, "category": 1},
          {"key": "cal/10", "value": actual_cal, "category": 1},
          {"key": "fat", "value": actual_fat, "category": 1},
          {"key": "carbs", "value": actual_carbs, "category": 1},
        ]
      },
      {
        "name": "keys",
        "source": "table",
        "transform": [
          {
            "type": "aggregate",
            "groupby": ["key"]
          }
        ]
      }
    ],

    "scales": [
      {
        "name": "angular",
        "type": "point",
        "range": {"signal": "[-PI, PI]"},
        "padding": 0.5,
        "domain": {"data": "table", "field": "key"}
      },
      {
        "name": "radial",
        "type": "linear",
        "range": {"signal": "[0, radius]"},
        "zero": true,
        "nice": false,
        "domain": {"data": "table", "field": "value"},
        "domainMin": 0
      },
      {
        "name": "color",
        "type": "ordinal",
        "domain": {"data": "table", "field": "category"},
        "range": {"scheme": "category10"}
      }
    ],

    "encode": {
      "enter": {
        "x": {"signal": "radius"},
        "y": {"signal": "radius"}
      }
    },

    "marks": [
      {
        "type": "group",
        "name": "categories",
        "zindex": 1,
        "from": {
          "facet": {"data": "table", "name": "facet", "groupby": ["category"]}
        },
        "marks": [
          {
            "type": "line",
            "name": "category-line",
            "from": {"data": "facet"},
            "encode": {
              "enter": {
                "interpolate": {"value": "linear-closed"},
                "x": {"signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))"},
                "y": {"signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))"},
                "stroke": {"scale": "color", "field": "category"},
                "strokeWidth": {"value": 1},
                "fill": {"scale": "color", "field": "category"},
                "fillOpacity": {"value": 0.1}
              }
            }
          },
          {
            "type": "text",
            "name": "value-text",
            "from": {"data": "category-line"},
            "encode": {
              "enter": {
                "x": {"signal": "datum.x"},
                "y": {"signal": "datum.y"},
                "text": {"signal": "datum.datum.value"},
                "align": {"value": "center"},
                "baseline": {"value": "middle"},
                "fill": {"value": "lightgray"}
              }
            }
          }
        ]
      },
      {
        "type": "rule",
        "name": "radial-grid",
        "from": {"data": "keys"},
        "zindex": 0,
        "encode": {
          "enter": {
            "x": {"value": 0},
            "y": {"value": 0},
            "x2": {"signal": "radius * cos(scale('angular', datum.key))"},
            "y2": {"signal": "radius * sin(scale('angular', datum.key))"},
            "stroke": {"value": "lightgray"},
            "strokeWidth": {"value": 1}
          }
        }
      },
      {
        "type": "text",
        "name": "key-label",
        "from": {"data": "keys"},
        "zindex": 1,
        "encode": {
          "enter": {
            "x": {"signal": "(radius + 5) * cos(scale('angular', datum.key))"},
            "y": {"signal": "(radius + 5) * sin(scale('angular', datum.key))"},
            "text": {"field": "key"},
            "align": [
              {
                "test": "abs(scale('angular', datum.key)) > PI / 2",
                "value": "right"
              },
              {
                "value": "left"
              }
            ],
            "baseline": [
              {
                "test": "scale('angular', datum.key) > 0", "value": "top"
              },
              {
                "test": "scale('angular', datum.key) == 0", "value": "middle"
              },
              {
                "value": "bottom"
              }
            ],
            "fill": {"value": "lightgray"},
            "fontWeight": {"value": "bold"}
          }
        }
      },
      {
        "type": "line",
        "name": "outer-line",
        "from": {"data": "radial-grid"},
        "encode": {
          "enter": {
            "interpolate": {"value": "linear-closed"},
            "x": {"field": "x2"},
            "y": {"field": "y2"},
            "stroke": {"value": "lightgray"},
            "strokeWidth": {"value": 1}
          }
        }
      }
    ]
  }
}

function macro_line_json(actuals) {
  values = []
  for(date of Object.keys(actuals)){
    mac = macros(actuals[date])
    values.push({'x': date, 'y': +(mac['total']['calories']/10).toFixed(2), 'c':'cal/10'})
    values.push({'x': date, 'y': mac['protein']['grams'], 'c':'protein'})
    values.push({'x': date, 'y': mac['fat']['grams'], 'c':'fat'})
    values.push({'x': date, 'y': mac['carbs']['grams'], 'c':'carbs'})
  }

  return {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "Macros by day.",
    "width": 340,
    "height": 340,
    "padding": 0,

    "signals": [
      {
        "name": "interpolate",
        "value": "monotone",
        // "bind": {
        //   "input": "select",
        //   "options": [
        //     "basis",
        //     "cardinal",
        //     "catmull-rom",
        //     "linear",
        //     "monotone",
        //     "natural",
        //     "step",
        //     "step-after",
        //     "step-before"
        //   ]
        // }
      }
    ],

    "data": [
      {
        "name": "table",
        "values": values
      }
    ],

    "scales": [
      {
        "name": "x",
        "type": "point",
        "range": "width",
        "domain": {"data": "table", "field": "x"}
      },
      {
        "name": "y",
        "type": "linear",
        "range": "height",
        "nice": true,
        "zero": true,
        "domain": {"data": "table", "field": "y"}
      },
      {
        "name": "color",
        "type": "ordinal",
        "range": "category",
        "domain": {"data": "table", "field": "c"}
      }
    ],

    "axes": [
      {"orient": "bottom", "scale": "x", "labelOverlap":true, "labelColor":"lightgray"},
      {"orient": "left", "scale": "y", "labelColor":"lightgray"}
    ],

    "legends": [
      {
        "fill": "color",
        "labelColor":"lightgray",
        "title": "Macro",
        "titleColor":"lightgray",
        "orient": "top-left",
        "encode": {
          "symbols": {
            "enter": {
              "fillOpacity": {"value": 0.5}
            }
          },
        }
      }
    ],

    "marks": [
      {
        "type": "group",
        "from": {
          "facet": {
            "name": "series",
            "data": "table",
            "groupby": "c"
          }
        },
        "marks": [
          {
            "type": "line",
            "from": {"data": "series"},
            "encode": {
              "enter": {
                "x": {"scale": "x", "field": "x"},
                "y": {"scale": "y", "field": "y"},
                "stroke": {"scale": "color", "field": "c"},
                "strokeWidth": {"value": 2}
              },
              "update": {
                "interpolate": {"signal": "interpolate"},
                "strokeOpacity": {"value": 1}
              },
              "hover": {
                "strokeOpacity": {"value": 0.5}
              }
            }
          }
        ]
      }
    ]
  }
}

function macro_stacked_area_json(actuals) {
  calories_per_gram = {'protein':4,
                       'carbs':4,
                       'fat':9}

  values = []
  for(date of Object.keys(actuals)){
    mac = macros(actuals[date])

    calories = mac['total']['calories']
    protein = mac['protein']['grams'] * calories_per_gram['protein']
    fat = mac['fat']['grams'] * calories_per_gram['fat']
    carbs = mac['carbs']['grams'] * calories_per_gram['carbs']
    other = calories - (fat + carbs + protein)

    if(other > 0){
      values.push({'x': date, 'y': other, 'c':'other'})
    } else {
      values.push({'x': date, 'y': 0, 'c':'other'})
    }
    values.push({'x': date, 'y': protein, 'c':'protein'})
    values.push({'x': date, 'y': fat, 'c':'fat'})
    values.push({'x': date, 'y': carbs, 'c':'carbs'})
  }

  return {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "Stacked macros by calorie.",
    "width": 340,
    "height": 340,
    "padding": 0,

    "data": [
      {
        "name": "table",
        "values": values,
        "transform": [
          {
            "type": "stack",
            "groupby": ["x"],
            "sort": {"field": "c"},
            "field": "y"
          }
        ]
      }
    ],

    "scales": [
      {
        "name": "x",
        "type": "point",
        "range": "width",
        "domain": {"data": "table", "field": "x"}
      },
      {
        "name": "y",
        "type": "linear",
        "range": "height",
        "nice": true, "zero": true,
        "domain": {"data": "table", "field": "y1"}
      },
      {
        "name": "color",
        "type": "ordinal",
        "range": "category",
        "domain": {"data": "table", "field": "c"}
      }
    ],

    "axes": [
      {"orient": "bottom", "scale": "x", "zindex": 1, "labelOverlap":true, "labelColor":"lightgray"},
      {"orient": "left", "scale": "y", "zindex": 1, "labelColor":"lightgray"}
    ],

    "legends": [
      {
        "fill": "color",
        "labelColor":"lightgray",
        "title": "Macro",
        "titleColor":"lightgray",
        "orient": "top-left",
        "encode": {
          "symbols": {
            "enter": {
              "fillOpacity": {"value": 0.5}
            }
          },
        }
      }
    ],

    "marks": [
      {
        "type": "group",
        "from": {
          "facet": {
            "name": "series",
            "data": "table",
            "groupby": "c"
          }
        },
        "marks": [
          {
            "type": "area",
            "from": {"data": "series"},
            "encode": {
              "enter": {
                "interpolate": {"value": "monotone"},
                "x": {"scale": "x", "field": "x"},
                "y": {"scale": "y", "field": "y0"},
                "y2": {"scale": "y", "field": "y1"},
                "fill": {"scale": "color", "field": "c"}
              },
              "update": {
                "fillOpacity": {"value": 1}
              },
              "hover": {
                "fillOpacity": {"value": 0.5}
              }
            }
          }
        ]
      }
    ]
  }
}

var view

var date_offset = 0

var plot_type = "radial"

function plot(){
  switch(plot_type){
  case "radial": return plot_radial(); break;
  case "line": return plot_line(); break;
  case "stacked_area": return plot_stacked_area(); break;
  default: alert("Unknown plot type:'"+plot_type+"'"); return null; break;
  }
}

function run_plot(spec){
  view = new vega.View(vega.parse(spec),
                       {
                         renderer:  'canvas',  // renderer (canvas or svg)
                         container: '#view',   // parent DOM container
                         hover:     true       // enable hover processing
                       })
  return view.runAsync()
}

function plot_radial(){
  return run_plot(macro_radial_json(macros(date_string())))
}

function plot_line(){
  return run_plot(macro_line_json(actuals))
}

function plot_stacked_area(){
  return run_plot(macro_stacked_area_json(actuals))
}

function show_today() {
  var div = document.getElementById("today-content")
  div.innerHTML = macro_table(macros(date_string()))
  // div.innerHTML = actuals[date_string()]
}

function show_foods() {
  var div = document.getElementById("foods")
  var text = "<ul>"
  var index = 0
  for (food of actuals[date_string()]) {
    // Add onclick to remove this ID from the food list.
    text = text+"<li class='food' onclick='drop_food("+index+")'>"+food+"</li>"
    index = index + 1
  }
  div.innerHTML = text+"</ul>"
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function date_string() {
  var today = new Date().addDays(date_offset)
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()

  return yyyy + "-" + mm + '-' + dd
}

function update_ui(){
  show_today()
  plot()
  show_foods()
  document.getElementById("today").innerHTML = date_string()
}

function drop_food(index){
  actuals[date_string()].splice(index, 1)
  local_actuals_down()
  update_ui()
}

String.prototype.clean = function(){
  return this.trim().toLowerCase().replaceAll(/[??????"']/g, "\"")
}

function add_food(){
  actuals[date_string()].push(document.getElementById("add-food").value.clean())
  document.getElementById("add-food").value = null
  try{
    local_actuals_down()
    update_ui()
  }
  catch(err){
    alert(err)
    actuals[date_string()].pop()
    local_actuals_down()
  }
}

function add_actuals(){
  let actuals_string = document.getElementById("paste-actuals").value.clean()
  actuals = JSON.parse(actuals_string)
  hide_actuals_paste()
  local_actuals_down()
  update_ui()
}

// local storage:
// explicit JSON serialization needed
function local_actuals_up() {
  actuals = JSON.parse(window.localStorage.getItem("actuals"))
}

function local_clear() {
  localStorage.removeItem("actuals")
}

function local_actuals_down() {
  window.localStorage.setItem("actuals", JSON.stringify(actuals))
}

if (typeof(Storage) !== "undefined") {
  // Don't overwrite, but initialize if not already present.
} else {
  alert("Not usable without local storage")
}

function ensure_today(){
  if ((typeof(actuals) != 'object') ||
      actuals === null)
    actuals = {}
  if (actuals[date_string()] === undefined) {
    actuals[date_string()] = []
  }
}

// Touch Events
var touch_start = false

function handle_start(event){
  event.preventDefault()
  touch_start = event.changedTouches[0].pageX
}

function handle_move(id){
  return function(event){
    event.preventDefault()
    let touch_now = event.changedTouches[0].pageX
    if(touch_start){
      if((touch_now - touch_start) < 0){
        switch(id){
        case "today": date_offset = date_offset + 1; break;
        case "view":
          if(plot_type == "radial"){
            plot_type = "line";
          } else {
            plot_type = "radial";
          }
          break;
        default: alert("Unknown id:'"+id+"'"); break;
        }
      } else if((touch_now - touch_start) > 0){
        switch(id){
        case "today": date_offset = date_offset - 1; break;
        case "view":
          if(plot_type == "radial"){
            plot_type = "stacked_area";
          } else {
            plot_type = "radial";
          }
          break;
        default: alert("Unknown id:'"+id+"'"); break;
        }
      }
      touch_start = false
      update_ui()
    }
  }
}

function handle_cancel(event){
  event.preventDefault()
  touch_start = false
}

function handle_end(event){
  event.preventDefault()
  touch_start = false
}

// Actuals Paste
function show_actuals_paste(){
  document.getElementById("paste-actuals-container").style.display = "block"
  document.getElementById("paste-actuals").value = JSON.stringify(actuals)
}

function hide_actuals_paste(){
  document.getElementById("paste-actuals-container").style.display = "none"
}

function toggle_actuals_paste(){
  if((document.getElementById("paste-actuals-container").style.display == "none") ||
     (document.getElementById("paste-actuals-container").style.display == "")){
    show_actuals_paste()
  } else {
    hide_actuals_paste()
  }
}

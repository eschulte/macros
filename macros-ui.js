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
  let actual_cal = macros['total']['calories']
  let target_cal = tgt['total']['calories']
  let actual_protein = macros['protein']['grams']
  let target_protein = tgt['protein']['grams']
  let actual_fat = macros['fat']['grams']
  let target_fat = tgt['fat']['grams']
  let actual_carbs = macros['carbs']['grams']
  let target_carbs = tgt['carbs']['grams']
  return {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A actual and target macros.",
    "width": 400,
    "height": 400,
    "padding": 20,
    "autosize": {"type": "none", "contains": "padding"},

    "signals": [
      {"name": "radius", "update": "width / 2"}
    ],

    "data": [
      {
        "name": "table",
        "values": [
          // {"key": "calories", "value": target_cal, "category": 0},
          {"key": "protein", "value": target_protein, "category": 0},
          {"key": "fat", "value": target_fat, "category": 0},
          {"key": "carbs", "value": target_carbs, "category": 0},
          // {"key": "calories", "value": actual_cal, "category": 1},
          {"key": "protein", "value": actual_protein, "category": 1},
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

var view;

function plot_radial(){
  let spec = macro_radial_json(macros(date_string()))
  view = new vega.View(vega.parse(spec),
                       {
                         renderer:  'canvas',  // renderer (canvas or svg)
                         container: '#view',   // parent DOM container
                         hover:     true       // enable hover processing
                       })
  return view.runAsync();
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

function actuals_download() {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(actuals));
  var download_link = document.getElementById('download-link');
  download_link.setAttribute("href",     dataStr     );
  download_link.setAttribute("download", "actuals.json");
}

function date_string() {
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()

  return yyyy + "-" + mm + '-' + dd
}

function update_ui(){
  show_today()
  plot_radial()
  show_foods()
  actuals_download()
}

function drop_food(index){
  actuals[date_string()].splice(index, 1)
  local_actuals_down()
  update_ui()
}

function add_food(){
  actuals[date_string()].push(document.getElementById("add-food").value.trim().toLowerCase())
  document.getElementById("add-food").value = null
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

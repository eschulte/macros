function macro_plus(one, two){
  return {'total': {'calories':
                    (one['total'] && one['total']['calories'] || 0) +
                    (two['total'] && two['total']['calories'] || 0)
                   },
          'protein':{'grams':
                     (one['protein'] && one['protein']['grams'] || 0) +
                     (two['protein'] && two['protein']['grams'] || 0)
                    },
          'fat':{'grams':
                 (one['fat'] && one['fat']['grams'] || 0) +
                 (two['fat'] && two['fat']['grams'] || 0)
                },
          'carbs':{'grams':
                   (one['carbs'] && one['carbs']['grams'] || 0) +
                   (two['carbs'] && two['carbs']['grams'] || 0)
                  }}
}

function portion(portion, base) {
  return {'total': {'calories': +((base['total'] && base['total']['calories'] || 0) * portion).toFixed(2) },
          'protein':{'grams': +((base['protein'] && base['protein']['grams'] || 0) * portion).toFixed(2) },
          'fat':{'grams': +((base['fat'] && base['fat']['grams'] || 0) * portion).toFixed(2) },
          'carbs':{'grams': +((base['carbs'] && base['carbs']['grams'] || 0) * portion).toFixed(2) }}
}

function macros(food){
  if (typeof food === 'string') {
    if(foods[food] === undefined){
      if(actuals[food] === undefined){
        portion_re = /^([\d.]+)x(.*)$/
        if(food.search(portion_re) === 0){
          let match = portion_re.exec(food)
          return portion(match[1], macros(match[2]))
        } else {
          if(/\d\d\d\d-\d\d-\d\d/.test(food)){
            console.error("empty day: "+food)
            actuals[food] = []
            return macros(actuals[food])
          } else {
            throw("undefined food: '"+food+"'")
          }
        }
      } else {
        return macros(actuals[food])
      }
    } else {
      return macros(foods[food])
    }
  } else if (Array.isArray(food)) {
    return food.map(macros).reduce(macro_plus, macro_plus({},{}))
  } else if(typeof [] === 'object'){
    return macro_plus(food, {})
  } else {
    throw("bad argument to macros: '"+food+"'")
  }
}

function get_target() {
  let vals = Object.values(targets)
  return vals[vals.length - 1]
}

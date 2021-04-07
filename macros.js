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

function macros(food){
  if (typeof food === 'string') {
    if(foods[food] === undefined){
      if(actuals[food] === undefined){
        throw("undefined food: '"+food+"'")
      } else {
        return macros(actuals[food])
      }
    } else {
      return macros(foods[food])
    }
  } else if (Array.isArray(food)) {
    return food.map(macros).reduce(macro_plus)
  } else if(typeof [] === 'object'){
    return macro_plus(food, {})
  } else {
    throw("bad argument to macros: '"+food+"'")
  }
}

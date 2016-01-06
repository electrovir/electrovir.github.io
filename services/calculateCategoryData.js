function calculateCategoryData(databaseController) {
  if (typeof databaseController !== 'object') {
  throw new Error('Missing construction parameters!');
  }
  function calculateTotals() {
    var total = {
      Expenses: 0,
      Income: 0
    };
    
    database.entries.forEach( function(entry) {
      if (entry.Category === 'Income') {
        total.Income += entry.Amount;
      }
      else {
        total.Expenses += entry.Amount;
      }
    });
    
    for (var key in total) {
      if (total.hasOwnProperty(key)) {
        total[key] = total[key].roundToTwoDPoints();
      }
    }
    
    return total;
  }
  
  function calculateCategories() {
    var categoryData = {};
    var subTotal = 0;
    
    // build the properties inside categoryData
    database.organization.Categories.forEach( function(categoryName) {
      categoryData[categoryName] = {
        Amount: 0,
        Percent: 0
      };
    });
    
    // go through every entry, add the amount to the respective category
    database.entries.forEach( function(entry) {
      var currentCategory = entry.Category;
      
      if (categoryData.hasOwnProperty(currentCategory)) {
        categoryData[currentCategory].Amount += entry.Amount;
      }
      else {
        if (entry.Category === '') {
          console.warn('Entry #', entry.id, 'has a blank category name.');
        }
        else {
          console.warn('Entry #', entry.id, 'has an unlisted category:', entry.Category);
        }
      }
      if (entry.Category !== 'Income') {
        subTotal += entry.Amount;
      }
    });
    
    // calculate the percentage of each category
    for (var key in categoryData) {
      if (categoryData.hasOwnProperty(key)) {
        if (subTotal === 0) {
          categoryData[key].Percent = 0;
        }
        else {
          categoryData[key].Percent = (categoryData[key].Amount / subTotal).roundToTwoDPoints();
        }
        categoryData[key].Amount = categoryData[key].Amount.roundToTwoDPoints();
      }
    }
    
    return categoryData;
  }
  
  function calculateSubCategories() {
    var subCategoryData = {};
    // build the object properties of subCategoryData
    database.organization.Categories.forEach( function(categoryName) {
      // turn the array elements into object keys
      subCategoryData[categoryName] = {};
      
      subCategoryData[categoryName] = database.organization['Sub-Categories'][categoryName].reduce( function(o, v, i) {
        o[v] = {
          Amount: 0,
          Percent: 0
        };
        return o;
      }, {});
    });
    
    // accumulate sub-category totals
    database.entries.forEach( function(entry) {
      if (subCategoryData[entry.Category] && typeof subCategoryData[entry.Category][entry['Sub-Category']] !== 'undefined') {
        subCategoryData[entry.Category][entry['Sub-Category']].Amount += entry.Amount;
      }
    });
    // calculate and round the percentages
    for (var category in subCategoryData) {
      if (subCategoryData.hasOwnProperty(category)) {
          
        for (var subCategory in subCategoryData[category]) {
          if (subCategoryData[category].hasOwnProperty(subCategory)) {
            // set/round the percent
            
            if (finishedObject.categoryData[category].Amount !== 0) {
              subCategoryData[category][subCategory].Percent = (subCategoryData[category][subCategory].Amount / finishedObject.categoryData[category].Amount).roundToTwoDPoints();
            }
            else {
              subCategoryData[category][subCategory].Percent = (0).roundToTwoDPoints();
            }
            
            // round the amount
            subCategoryData[category][subCategory].Amount = subCategoryData[category][subCategory].Amount.roundToTwoDPoints();
          }
        }
      }  
    }
  return subCategoryData;
  }
  
  var finishedObject = {};
  var database = databaseController;
  finishedObject.totals = calculateTotals.call(finishedObject);
  finishedObject.categoryData = calculateCategories.call(finishedObject);
  finishedObject.subCategoryData = calculateSubCategories.call(finishedObject);
  
  return finishedObject;
}
/*
financesScript.js
Financial Vir
Summer 2015 (first created)
*/

function newUserPrompt(overlayController, newEntryController) {
  console.log('Empty database!');
  document.getElementById('overlayNewUser').removeAttribute('style');
  document.getElementById('newUserNewButton').addEventListener('click', function() {
    
    document.getElementById('overlayNewUser').setAttribute('style', 'display:none;');
    overlayController.hide();
    newEntryController.display();
  });
  overlayController.display(false);
}

function prepareMonthCalculations(calc) {
  // TODO: code this
  console.log('month calculations');
  return {};
}

function prepareCategoryCalculations(calc) {
  
  var obj = {};
  
  obj.primaryData = calc.categoryData;
  obj.secondaryData = calc.subCategoryData;
  
  return obj;
}


//  ==========================
//  INITIALIZE
//  ==========================
function init(controllers, calculations, callback) {
  
  
  //  ==========================
  // LOAD CONTROLLERS
  function loadOtherControllers(controllers, calc) {    
    
    // Data Table
    controllers.dataTable = new DataTableController(document.getElementById('dataTable'), controllers.database.organization.Columns);
    controllers.dataTable.addAllRows(controllers.database.entries);
    
    // New Entry
    controllers.newEntry = new DataEntryController(document.getElementById('overlayNewEntry'), controllers.database.organization, controllers.overlay);
    
    // Tithing Calculator
    controllers.tithing = new TithingController(document.getElementById('tithingOwe'), calc);
    
    // Main Menu
    controllers.mainMenu = new MenuController(document.getElementById('mainMenu'), controllers.database.organization, controllers.dataTable, controllers.newEntry);
    
    // Category Details Table
    controllers.categoryData = new DetailsTableController('Categories', document.getElementById('categoryDataWrapper'), prepareCategoryCalculations(calc));
    
    // Month Details Table
    // TODO: create setup functions so this controller can be used
    // controllers.monthData = new DetailsTableController(document.getElementById('monthDataWrapper'), prepareMonthCalculations(calc));
  }
  
  
  //  ==========================
  //  LOAD LOADING CONTROLLERS
  function loadLoadingControllers(controllers) {
    // Overlay
    controllers.overlay = new OverlayController(document.getElementById('overlay'));
    
    // Loading Screen
    controllers.loading = new LoadingController(document.getElementById('overlayLoading'), controllers.overlay);
  }
  
  //  --- ACTUAL EXECUTION ---
  
  // load the controllers that are necessary before initialization
  loadLoadingControllers(controllers);
  controllers.loading.display();
  controllers.database = new DatabaseController();
  
  // initialize!
  controllers.database.initializeDatabase( function(numEntries) {
    calculations.category = calculateCategoryData(controllers.database);
    loadOtherControllers(controllers, calculations.category);
    controllers.loading.hide();
    
    if (numEntries === 0) {
      newUserPrompt(controllers.overlay, controllers.newEntry);
    }
    if (typeof callback === 'function') {
      callback();
    }
  });
  
}




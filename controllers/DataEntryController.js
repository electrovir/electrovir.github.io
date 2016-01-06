function DataEntryController(dom, org, overlayController, databaseController) {
  if (typeof org !== 'object' || typeof dom !== 'object' || typeof overlayController !== 'object') {
    console.dir(arguments);
    throw new Error('Invalid constructing parameters!');
  }
  
  // =================================
  // POPULATE ENTRY DIV
  // =================================
  this.populate = function() {
    
    function addCategorySelectEventListener() {
      var that = this;
      document.getElementById('CategorySelect').addEventListener('change', function categorySelectChange() {
        var subCategorySelect = document.getElementById('Sub-CategorySelect');
        subCategorySelect.removeAttribute('disabled');
        subCategorySelect.innerHTML = '';
        subCategorySelect.appendChild(disabledDefaultOption('Select Sub-Category...'));
        subCategorySelect.populateDropDown(that.org['Sub-Categories'][this.value]);
      });
    }
    
    function addFormInputEventListener(form) {
      form.addEventListener('input', function formChange(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
          event.target.removeAttribute('class');
        }
      });
    }
    
    var newEntryDiv = this.dom;
    newEntryDiv.innerHTML = 
      '<h2>Transaction Entry</h2>' +
        '<form id="entryForm" action="javascript:handleFormInput(this.entryForm, controllers.database, controllers.newEntry, controllers.dataTable, controllers.tithing, controllers.categoryData, calculations);">' +
        '</form>';
    var entryForm = newEntryDiv.childNodes[1];
    
    for (var i in this.org.Columns) {
      if (this.org.Columns.hasOwnProperty(i)) {
        var columnName = this.org.Columns[i];
        var P = document.createElement('p');
        
        if (columnName !== 'Category' && columnName !== 'Sub-Category') {
          P.innerHTML = 
            '<label for="' + columnName +'">' + 
              columnName +
            '</label>' +
            '<br />';
          var inputField = document.createElement('input');
          inputField.setAttribute('id', columnName + 'Input');
          inputField.setAttribute('name', columnName);
          
          if (columnName === 'Amount') {
            P.innerHTML += '$';
            inputField.setAttribute('type', 'number');
            inputField.setAttribute('step', '0.01');
          }
          else if (columnName === 'Date') {
            inputField.setAttribute('type', 'date');
          }
          else {
            inputField.setAttribute('type', 'text');
          }
          P.appendChild(inputField);
        }
        else {
          selectField = document.createElement('select');
          selectField.setAttribute('id', columnName + 'Select');
          selectField.setAttribute('name', columnName);
          P.appendChild(selectField);
          
          //Category Select
          if (columnName === 'Category') {
            selectField.appendChild(disabledDefaultOption('Select Category...'));
            selectField.populateDropDown(this.org.Categories);
            
          }
          else {
            // generate the subCategory select with its initial state
            resetSubCategory(selectField);
          }
        }
        
        entryForm.appendChild(P);
      }
    } //end for var i in columns loop
    
    entryForm.innerHTML +=  
      '<button id="cancelButton" type="button">Cancel</button>' +
      '<button id="resetButton" type="reset">Reset</button>' +
      '<button id="submitButton" type="submit">Submit</button>';
    
    entryForm.setAttribute('onReset', 'resetAllInvalidFields(this);resetSubCategory(document.getElementById(\'Sub-CategorySelect\'));' +
    '');
    var that = this;
    entryForm.querySelector('#cancelButton').addEventListener('click', function cancelClick() {
      that.hide();
    });
    addCategorySelectEventListener.call(this);
    addFormInputEventListener(entryForm);
  };
  
  
  // =================================
  // SHOW THE DIV
  // =================================
  this.display = function() {
    this.dom.removeAttribute('style');
    this.overlay.display(true, this.hide.bind(this));
    this.dom.querySelector('#DateInput').focus();
  };
  
  
  // =================================
  // HIDE THE DIV
  // =================================
  this.hide = function() {
    this.dom.setAttribute('style', 'display:none;');
    this.dom.querySelector('#entryForm').reset();
    this.overlay.hide();
  };
  
  
  // =================================
  // DATA MEMBERS
  // =================================
  this.overlay = overlayController;
  this.database = databaseController;
  this.dom = dom;
  this.org = org;
  
  
  // --- ACTUAL EXECUTION ---
  this.populate();
}
// ---------------------------------------------------------------------------------------




// =================================
// POPULATE A DROPDOWN ITEM
// =================================
Object.prototype.populateDropDown = function(items) {
  for (var key in items) {
    if (items.hasOwnProperty(key)) {
      var newOption = document.createElement('option');
      newOption.innerHTML = items[key];
      
      this.appendChild(newOption);
    }
  }
};

// =================================
// RESET SUB CATEGORY SELECT
// =================================
function resetSubCategory(select) {
  select.innerHTML = '';
  select.appendChild(disabledDefaultOption('Select Category First'));
  select.setAttribute('disabled', true);
  return select;
}

// =================================
// CLEAR INVALID MARKER
// =================================
function resetAllInvalidFields(form) {
  form.forEach( function(element) {
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
      element.removeAttribute('class');
    }
  });
}

// =================================
// HANDLE FORM INPUT
// =================================
function handleFormInput(form, databaseController, newEntryController, dataTableController, tithingController, categoryDataTableController, calculations) {
  console.log(arguments);
  var org = databaseController.organization;
  
  // Validate one object
  function validateData(element, org) {
    if (element.name === 'Date' ) {
      if (isNaN(new Date(element.value)) || element.value === '') {
        return false;
      }
    }
    else if (element.name === 'Amount') {
      if (isNaN(element.value) || element.value === '') {
        return false;
      }
    }
    else if (element.name === 'Category') {
      if (org.Categories.indexOf(element.value) === -1) {
        return false;
      }
    }
    else if (element.name === 'Sub-Category') {
      var category = document.getElementById('CategorySelect').value;
      if (org.Categories.indexOf(category) !== -1) {
        if (org['Sub-Categories'][category].indexOf(element.value) === -1) {
          return false;
        }
      }
      else {
        return false;
      }
    }
    return true;
  }
  
  // Validate them all!
  function validateAllFormData(form, org) {
    var invalidElements = [];
    form.forEach( function(element) {
      if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
        if (!validateData(element, org)) {
          invalidElements.push(element);
        }
      }
    });
    
    return invalidElements;
  }
  
  // Grab all input!
  function grabInputs() {
    var newObject = {};
    form.forEach( function grabFormInputs(element) {
      if (element.tagName === 'SELECT' || element.tagName === 'INPUT') {
        if (element.name === 'Date') {
          newObject[element.name] = new Date(element.value);
        }
        else if (element.name === 'Amount') {
          newObject[element.name] = Number(element.value);
        }
        else {
          newObject[element.name] = element.value;
        }
      }
    });
    
    if (newObject.Category != 'Income') {
      newObject.Amount *= -1;
    }
    return newObject;
  }
  
  function entryComplete(addThis) {
    newEntryController.hide();
    dataTableController.addRow(addThis);
    
    databaseController.entries.push(addThis);
    // TODO: come up with a way to pass the calculations around without it being a global variable
    //    perhaps make it a controller
    calculations.category = calculateCategoryData(databaseController);
    
    tithingController.update(calculations.category);
    categoryDataTableController.update(prepareCategoryCalculations(calculations.category));
  }
  //
  // Execution!
  //
  var invalidElements = validateAllFormData(form, org);
  if (invalidElements.length !== 0) {
    invalidElements.forEach( function setInvalidClass(element) {
      element.setAttribute('class', 'invalid');
    });
  }
  else {
    var addThis = grabInputs();
    databaseController.addEntry(addThis, function() {
      return entryComplete(addThis);
    });
  }
}

// =================================
// CREATE DISABLED OPTION
// =================================
function disabledDefaultOption(text) {
  var newOption = document.createElement('option');
  newOption.innerHTML = text;
  newOption.setAttribute('selected', 'selected');
  newOption.setAttribute('disabled', true);
  
  return newOption;
}

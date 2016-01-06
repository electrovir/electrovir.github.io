function DetailsTableController(name, dom, passedCalculations) {
  if (typeof name !== 'string' || typeof dom !== 'object' || typeof passedCalculations !== 'object' || passedCalculations.primaryData === undefined || passedCalculations.secondaryData === undefined) {
    console.log(arguments);
    throw new Error('Invalid construction parameters!');
  }
  
  
  //  --- PUBLIC FUNCTIONS ---
  
  //  ==========================
  //  UPDATE
  //  ==========================
  this.update = function(passedCalculations) {
    if (typeof passedCalculations !== 'object' || passedCalculations.primaryData === undefined || passedCalculations.secondaryData === undefined) {
      throw new Error('Invalid calculations!');
    }
    primary = passedCalculations.primaryData;
    secondary = passedCalculations.secondaryData;
    while (this.dom.rows.length > 1) {
      this.dom.deleteRow(1);
    }
    populateRows.call(this);
  };
  
  
  //  --- PRIVATE FUNCTIONS ---
  
  //  ==========================
  //  SHOW TOP HEADERS
  //  ==========================
  function showTopHeaders() {
    var headerRow = document.createElement('TR');
    headerRow.innerHTML = '<th>' + name + '</th>';
    
    var firstKey = Object.keys(primary)[0];
    if (primary[firstKey]) {
      for (var header in primary[firstKey]) {
        if (primary[firstKey].hasOwnProperty(header)) {
          var newHeader = document.createElement('TH');
          newHeader.innerHTML = header;
          headerRow.appendChild(newHeader);
        }
      }
    }
    this.dom.appendChild(headerRow);
  }
  
  
  //  ==========================
  //  POPULATE ALL
  //  ==========================
  function populate() {
    showTopHeaders.call(this);
    populateRows.call(this);
  }
  
  
  //  ==========================
  //  POPULATE ROWS
  //  ==========================
  function populateRows() {
    for (var key in primary) {
      if (primary.hasOwnProperty(key)) {
        var newRow = document.createElement('TR');
        var sideHeader = document.createElement('TH');
        sideHeader.setAttribute('class', 'leftSideHeader');
        sideHeader.innerHTML = key;
        newRow.appendChild(sideHeader);
        
        for (var innerKey in primary[key]) {
          if (primary[key].hasOwnProperty(innerKey)) {
            var newCell = document.createElement('TD');
            var text = primary[key][innerKey];
            // TODO: format text and stuff
            if (innerKey === 'Percent') {
              text = text.toPercent();
              newCell.setAttribute('class', 'numberFormat');
            }
            else if (innerKey === 'Amount') {
              text = text.toMyCurrencyString();
              if (text.replace(/[,]+/g, "") >= 0) {
                newCell.setAttribute('class', 'numberFormat positive');
              }
              else {
                newCell.setAttribute('class', 'numberFormat negative');
              }
            }
            newCell.innerHTML = text;
            newRow.appendChild(newCell);
            
          }
        }
        this.dom.appendChild(newRow);
        
      }
    }
  }
  
  //  ==========================
  //  DATA MEMBERS
  //  ==========================
  this.dom = dom.querySelector('.primaryTable');
  this.seconaryTable = dom.querySelector('.secondaryTable');
  
  // --- ACTUAL EXECUTION ---
  
  var primary = passedCalculations.primaryData;
  var seoncdary = passedCalculations.secondaryData;
  populate.call(this);
}
// ---------------------------------------------------------------------------------------


/*
FORMAT:

passedCalculations {
  key: {
    amount: ,
    percent:
  },
  key: {
    amount: ,
    percent:
  }
}
*/


//  ==========================
//  TO PERCENT
//  ==========================
Number.prototype.toPercent = function() {
  var fixThis = Number(this);
  if (isNaN(fixThis) === true) {
    throw new Error('Invalid Percentage Value: ' + fixThis);
  }
  fixThis *= 100;
  fixThis.roundToTwoDPoints();
  return String(fixThis.roundToTwoDPoints()).concat('%');
};
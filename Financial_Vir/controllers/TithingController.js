function TithingController(dom, calc, list) {
  if (typeof dom !== 'object' || typeof calc !== 'object') {
    console.log(arguments);
    throw new Error('Mising construction parameters!');
  }
  
  function displayTithingOwed() {
    //
    //
    function calculateOwed(i, t) {
      var owe = i/10;
      var oweStr = String(owe);
      if (oweStr.substr(oweStr.indexOf('.')+3,1) !== '0') {
        owe += .01;
      }
      owe += t; //tithing is a negative value
      
      return owe;
    }
    
    //  --- EXECUTION ---
    var tithing = this.calc.subCategoryData.Church.Tithing.Amount;
    var income = this.calc.categoryData.Income.Amount;
    var owe = 0;
    
    if (typeof list === 'object') {
      list.forEach(function(element) {
        income += calc.subCategoryData[element][list[element]].Amount;
      });
    }
    
    var owe = calculateOwed(income, tithing).toMyCurrencyString();
    
    if (owe === '0.00') {
      this.dom.setAttribute('class', 'tithing default');
    }
    else {
      this.dom.setAttribute('class', 'tithing tithingOwe');
    }
    
    this.dom.innerHTML = 'Tithing Owed: &nbsp;&nbsp;'+owe;
  }
  
  this.update = function(newCalc) {
    if (typeof newCalc !== 'object') {
      console.log(arguments);
      throw new Error('Missing construction parameters!');
    }
    
    this.calc = newCalc;
    return displayTithingOwed.call(this);
  };
  
  this.list = list;
  this.calc = calc;
  this.dom = dom;
  displayTithingOwed.call(this);
}
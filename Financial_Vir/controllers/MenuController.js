function MenuController(dom, org, dataTableController, newEntryController, settingsController) {
  if (typeof dom !== 'object' || typeof org !== 'object' || typeof dataTableController !== 'object' || typeof newEntryController !== 'object') {
    throw new Error('Invalid constructor parameters!');
  }
  this.dom = dom;
  this.org = org;
  this.dataTable = dataTableController;
  this.newEntry = newEntryController;
  this.settings = settingsController;
  
  var that = this;
  
  // add category view select change event
  this.dom.querySelector('#categoryViewSelect').addEventListener('change', function viewCategorySelectChange() {
    if (this.value === 'View All') {
      that.dataTable.showAllRows();
    }
    else {
      that.dataTable.showAllRows();
      that.dataTable.filterRows(this.value, that.org.Columns.indexOf('Category'));
    }
  });
  this.dom.querySelector('#categoryViewSelect').populateDropDown(this.org.Categories);
  // add the new button click event
  this.dom.querySelector('#newButton').addEventListener('click', function newButtonClickEvent() {
    that.newEntry.display();
  });
}
// ---------------------------------------------------------------------------------------












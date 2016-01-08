function LoadingController(dom, overlayController) {
  if (typeof overlayController !== 'object') {
    throw new Error('Invalid construction parameters!');
  }
  
  //  --- PUBLIC FUNCTIONS ---
  
  // =================================
  // DISPLAY
  // =================================
  this.display = function() {
    this.dom.removeAttribute('style');
    overlay.display(false);
  };
  
  // =================================
  // HIDE
  // =================================
  this.hide = function() {
    this.dom.setAttribute('style', 'display:none;');
    overlay.hide();
  };
  
  //  --- ACTUAL EXECUTION ---
  
  overlay = overlayController;
  this.dom = dom;
}
// ---------------------------------------------------------------------------------------

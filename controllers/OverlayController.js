function OverlayController(dom) {
  if (typeof dom !== 'object' || dom === null) {
    console.dir(dom);
    throw new Error('Invalid object passed!');
  }
  
  //  --- PUBLIC FUNCTIONS ---
  
  //  ==========================
  //  DISPLAY
  //  ==========================
  this.display = function(addEventListener, eventFunction) {
    this.dom.removeAttribute('style');
    
    if (addEventListener === true) {
      
      this.dom.addEventListener('click', overlayClick, false);
      document.addEventListener('keyup', overlayKeyPress, false);
    }
    
  };
  
  
  //  ==========================
  //  SHOW TOP HEADERS
  //  ==========================
  this.hide = function(callback) {
    this.dom.removeEventListener('click', overlayClick);
    document.removeEventListener('keyup', overlayKeyPress);
    this.dom.setAttribute('style', 'display:none;');
    this.dom.children.forEach(function hideChildren(element) {
      element.setAttribute('style', 'display:none;');
    });
  };
  
  //  --- PRIVATE FUNCTIONS ---
  
  //  ==========================
  //  OVERLAY CLICK
  //  ==========================
  function overlayClick(event) {
    if (event.target === overlay.dom) {
      overlay.hide();
      if (typeof eventFunction === 'function') {
        eventFunction();
      }
    }
  }
  
  
  //  ==========================
  //  OVERLAY KEY PRESS
  //  ==========================
  function overlayKeyPress(event) {
    if (event.which === 27) {
      overlay.hide();
      if (typeof eventFunction === 'function') {
        eventFunction();
      }
    }
  }
  
  //  --- ACTUAL EXECUTION ---
  
  this.dom = dom;
}
// ---------------------------------------------------------------------------------------

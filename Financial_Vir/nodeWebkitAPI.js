/*
  This is for use only within the Node Webkit (nw.js) app framework.
*/

if (typeof process !== 'undefined' && process.platform === 'darwin') {
  setupNW();
}

function setupNW() {
  
  function refreshApp() {
    var Window = gui.Window.get();
    Window.reloadDev();
  }

  function openConsole() {
    gui.Window.get().showDevTools();
  }
  
  var gui = require('nw.gui');

  var menuBar = new gui.Menu({type:"menubar"});
  menuBar.createMacBuiltin("Financial Vir");
  
  
  var menuItems = new gui.Menu();

  menuItems.append(new gui.MenuItem({
    label: 'Console',
    click: openConsole,
    modifiers: 'cmd+alt',
    key: 'c'
    }));
  menuItems.append(new gui.MenuItem({
    label: 'Refresh',
    click: refreshApp,
    modifiers: 'cmd',
    key: 'r'
  }));
  
  menuBar.append(
    new gui.MenuItem({
      label: 'Debug',
      submenu: menuItems
    })
  );
  
  gui.Window.get().menu = menuBar;
}
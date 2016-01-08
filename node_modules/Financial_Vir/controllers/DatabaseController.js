function DatabaseController() {
  
  
  // =================================
  // INITIALIZE DATABASE
  // =================================
  this.initializeDatabase = function(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Invalid callback');
    }
    var that = this;
    openDataBase( function(database) {
      db = database;
      loadOrganizationData( function(orgObject) {
        that.organization = orgObject;
        
        loadAllEntries( function(entriesArray) {
          that.entries = entriesArray;          
          callback(entriesArray.length);
        });
      });
    });
  };
  
  
  // =================================
  // ADD ENTRY TO DATABASE
  // =================================
  this.addEntry = function(addThis, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Invalid callback');
    }
    
    function getLastId(database, storeName, innerCallback) {
      if (typeof innerCallback !== 'function') {
        throw new Error('Invalid callback');
      }
      var store = database.transaction([storeName], 'readonly').objectStore(storeName);
      
      store.openCursor(null, 'prev').onsuccess = function(prevEvent) {
        var cursor = prevEvent.target.result;
        if (cursor) {
          innerCallback(cursor.key + 1);
        }
        else {
          innerCallback(0);
        }
      };
    }
    
    addThis.Created = new Date();
    addThis.Deleted = null;
    getLastId(db, entryStoreName, function addThing(newId) {
      addThis.id = newId;
      var store = db.transaction([entryStoreName], 'readwrite').objectStore(entryStoreName);
      
      var request = store.add(addThis, newId);
      
      request.onerror = function(event) {
        console.log(newId);
        throw new Error('Add failed!', event);
      };
      request.onsuccess = function(event) {
        console.log('Add success!', 'ID:', event.target.result);
        callback(addThis, event.target.result);
      };
      
      
    });
  };
  
  
  // =================================
  // OPEN DATABASE
  // =================================
  function openDataBase(callback) {
    if (!('indexedDB' in window)) {
      throw new Error('IndexedDB not supported!');
    }
    that = this;
    var openRequest = indexedDB.open(dbName, dbVersion);
    //
    // Handle Errors
    //
    openRequest.onerror = function(event) {
      throw new Error('Database open failed:', event.target);
    };
    //
    // Pass on the Database
    //
    openRequest.onsuccess = function(event) {
      var database = this.result;
      
      var orgStore = database.transaction([orgStoreName], 'readonly').objectStore(orgStoreName);
      
      var countRequest = orgStore.count();
      countRequest.onsuccess = function() {
        var count = this.result;
        if (count === 0) {
          insertDefaultOrganization(database, orgStoreName, function() {
            console.log('Defaults loaded.');
            console.log('Database successfully opened.');
            that.db = database;
            if (typeof callback === 'function') {
              callback(database);
            }
          });
        }
        else {
          console.log('Database successfully opened.');
          that.db = database;
          if (typeof callback === 'function') {
            callback(database);
          }
        }
      };
    };
    //
    // Upgrade/Create Database
    //
    openRequest.onupgradeneeded = function(event) {
      // console.log('Upgrading database to version:', dbVersion);
      var database = this.result;
      
      for (var key in stores) {
        if (stores.hasOwnProperty(key)) {
          if (!database.objectStoreNames.contains(stores[key].name)) {
            var newStore = database.createObjectStore(stores[key].name, {keypath: stores[key].keypath, unique: stores[key].unique});
            
            if (stores[key].name === 'entries') {
              newStore.createIndex('Date', 'Date', {unique: false});
            }
          }
        }
      }
      // why can't i load default organization here?
      // insertDefaultOrganization(database, orgStoreName);
    };
  }
  
  
  // =================================
  // INSERT DEFAULT ORGANIZATION
  // =================================
  function insertDefaultOrganization(database, storeName, callback) {
    loadJSON('Default_Organization.json', function(object) {
      var tx = database.transaction([storeName], 'readwrite');
      var store = tx.objectStore(storeName);
      
      tx.oncomplete = function() {
        if (typeof callback === 'function') {
          callback();
        }
      };
      
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          var addRequest = store.add(object[key], key);
        }
      }
    });
  }
  
  
  // =================================
  // LOAD JSON FILE
  // =================================
  function loadJSON(file, callback) {
    
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', file, true);
    
    xobj.onreadystatechange = function() {
      if (xobj.readyState === 4) {
        if (typeof callback === 'function') {
          callback(JSON.parse(xobj.responseText));
        }
        else {
          return JSON.parse(xobj.responseText);
        }
      }
    };
    
    xobj.send(null);
  }
  
  
  // =================================
  // LOAD ORGANIZATION DATA
  // =================================
  function loadOrganizationData(callback) {
    var returnObject = {};
    
    loadFromStore(orgStoreName, function(result) {
      returnObject[result.key] = result.value;
    }, function() {
      callback(returnObject);
    });
  }
  
  
  // =================================
  // LOAD ALL ENTRIES
  // =================================
  function loadAllEntries(callback) {
    var returnArray = [];
    
    loadFromIndex(entryStoreName, 'Date', function(result) {
      returnArray.push(result.value);
    }, function() {
      callback(returnArray);
    });
  }
  
  
  // =================================
  // LOAD FROM A STORE
  // =================================
  function loadFromStore(storeName, innerFunction, callback) {
    var cursor = db.transaction([storeName], 'readonly').objectStore(storeName).openCursor();
    
    cursor.onsuccess = function(event) {
      var result = this.result;
      if (result) {
        innerFunction(result);
        result.continue();
      }
      else {
        callback();
      }
    };
  }
  
  
  // =================================
  // LOAD FROM AN INDEX
  // =================================
  function loadFromIndex(storeName, indexName, innerFunction, callback) {
    var cursor = db.transaction([storeName], 'readonly').objectStore(storeName).index(indexName).openCursor();
    
    cursor.onsuccess = function(event) {
      var result = this.result;
      if (result) {
        innerFunction(result);
        result.continue();
      }
      else {
        callback();
      }
    };
    
  }
  
  
  // =================================
  // Data Members
  // =================================
    // public
  this.organization = {};
  this.entries = [];
  this.calculations = {};
    // private
  var db = {};
  var entryStoreName = 'entries';
  var orgStoreName = 'organization';
  var dbName = 'Financial Vir Database';
  var dbVersion = 1;
  var stores= [
    {
      name: entryStoreName,
      keypath: 'id',
      unique: true
    },
    {
      name: orgStoreName,
      keypath: 'id',
      unique: false
    }
  ];
}
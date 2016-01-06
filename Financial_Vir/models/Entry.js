function Entry(copyThis) {
  this.dataObj = {
    date: new Date(),
    id: -1
  };
  // this.Created = new Date();
  // Default Values
  // this.Date = new Date();
  // this.Amount = 0;
  // this.Method = '';
  // this['Method Notes'] = '';
  // this.Place = '';
  // this.Category = 'Money';
  // this['Sub-Category'] = 'Give Out';
  // this.Description = 'Untitled transaction';
  // this.id = -1;
  // for (var key in copyThis) {
  //   if (copyThis.hasOwnProperty(key)) {
  //     this[key] = copyThis[key];
  //   }
  // }
  var storeName = 'entries';
  var that = this;
  getNewId(storeName, function(newId) {
    that.dataObj.id = newId;
  });
  
  this.save = function(callback) {
    //Save to database
    var store = db.transaction([storeName], 'readwrite').objectStore(storeName);
    console.log('DO I EVEN GET THIS FAR?', that);
    //
    //  It's this line that's giving me problems
    //
    var addRequest = store.add(that.dataObj, that.dataObj.id);
    //
    //
    addRequest.onsuccess = function(event) {
      if (typeof callback === 'function') {
        callback(event.target.result);
      }
    };
    addRequest.onerror = function(event) {
      throw new Error('Add error', event.target.error.name, event.target.result);
    };
  };
}

function getNewId(storeName, callback) {
  //db is the global variable in this project that points to the DataBase
  var store = db.transaction([storeName], 'readonly').objectStore(storeName);
  store.openCursor(null, 'prev').onsuccess = function(event) {
    var cursor = this.result;
    if (cursor) {
      callback(cursor.key + 1);
    }
    else {
      callback(0);
    }
  };
}
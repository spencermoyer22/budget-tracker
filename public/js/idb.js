let db;
const request = indexedDB.open('budget_tracker', 1);

// if version changes
request.onupgradeneeded = function(event) {
    // save reference to the database
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
  
    // check if app is online
    if (navigator.onLine) {
      // 
    }
  };

request.onerror = function(event) {
  // log error
  console.log(event.target.errorCode);
};

// function will run if no connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_budget'], 'readwrite');
  
    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_budget');
  
    // add record to your store with add method
    pizzaObjectStore.add(record);
  }
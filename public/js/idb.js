let db;
const request = indexedDB.open('budget_tracker', 1);

// if version changes
request.onupgradeneeded = function (event) {
    // save reference to the database
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    // check if app is online
    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (event) {
    // log error
    console.log(event.target.errorCode);
};

// function will run if no connection
function saveBudget(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_budget');

    // add record to your store with add method
    pizzaObjectStore.add(record);
};

function uploadBudget() {
    // open a transaction
    const transaction = db.transaction(['new_budget'], 'readwrite');
    // access object store
    const pizzaObjectStore = transaction.objectStore('new_budget');
    //get all data from object store
    const getAll = pizzaObjectStore.getAll();
    // if .getAll() is successful
    getAll.onsuccess = function() {
        // if there is data send it to api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open transaction
                const transaction = db.transaction(['new_budget'], 'readwrite');
                //access object store
                const budgetObjectStore = transaction.objectStore('new_budget');
                // clear items in store
                budgetObjectStore.clear();
                alert('All saved budgets have been submitted.')
            })
            .catch(err => console.log(err));
        }
    }
};

window.addEventListener('online', uploadBudget);
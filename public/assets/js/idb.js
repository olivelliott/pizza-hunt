let db;

const request = indexedDB.open('pizza_hunt', 1);

// this will emit if the database version changes
request.onupgradeneeded = function (event) {
  // save a reference to the db
  const db = event.target.result;
  // create an object store (table) called 'new_pizza', set it to have an auto incrementing key
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store or established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online 
  if (navigator.onLine) {
    // send all local db data to api
    uploadPizza();
  }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    const getAll = pizzaObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
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
                    throw new Error (serverResponse);
                }
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                pizzaObjectStore.clear();
            });
        }
    };
};

window.addEventListener('online', uploadPizza);

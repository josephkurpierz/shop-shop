export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
};

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    //open connection to the database with a version of 1
    const request = window.indexedDB.open('shop-shop',1);
    //create variables to hold reference to the database transaction and object store
    let db, tx, store;

    //if version has changed, run this to create the three object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      //create object store for each type of data and set 'primary' key index to be '_id'
      db.createObjectStore('products', {keyPath: '_id'});
      db.createObjectStore('categories', {keyPath: '_id'});
      db.createObjectStore('cart', {keyPath: '_id'});
    };
    //handle any errors with connecting
    request.onerror = function (e) {
      console.log('There was an error');
    };
    //  on successful db open
    request.onsuccess = function(e) {
      //save a reference of the database to the 'db' variable
      db = request.result;
      //open a transaction to do whatever we pass into storename
      tx = db.transaction(storeName, 'readwrite');
      //save a reference to that object store
      store = tx.objectStore(storeName);

      //if there is any error
      db.onerror = function(e){
        console.log('error',e);
      };

      switch(method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('no valis method');
          break;
      }
      //when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      }
    }
  });
}

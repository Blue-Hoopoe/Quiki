'use strict';

function QuikiStorageManager() {

    // Clears local storage from key or from all exsisting data.
    this.clear = function(key = false){
        key ? localStorage.clear(key) : localStorage.clear();
    }

    // Returns requested value in local storage.
    this.get = function (key = false) {
        return key ? localStorage[key] : localStorage;
    }

    // Sets given value in local storage.
    this.set = function (key, value) {
        localStorage[key] = value;
    }

    // Returns array in local storage.
    this.setArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            localStorage[array[i].key] = array[i].value
        }
    }

}
'use strict';

const quikiStorageSchema = '1.1';
const quikiStorageDefault = [{
        'key': 'storage-schema',
        'value': quikiStorageSchema
    },
    {
        'key': 'setting-doubleclick-modal',
        'value': true
    }
];

function QuikiService() {

    var self = this;

    // Create storage manager.
    this.qsm = new QuikiStorageManager();

    // Sets default settings, preferences, etc.
    this.setDefaultStorage = function () {
        this.qsm.setArray(quikiStorageDefault);
    }

    // Checks local version and local storage.
    var storageSchema = this.qsm.get('storage-schema');
    if (!storageSchema || storageSchema != quikiStorageSchema) {
        this.qsm.clear();
        this.setDefaultStorage();
    }

    // Context menu on selection function handler.
    this.searchOnDiki = function (event) {
        chrome.tabs.create({
            url: "https://www.diki.pl/slownik-angielskiego?origin=quiki&q=" + event.selectionText,
        });
    }

    // Creating router functions.
    this.getLocalValue = function (quikiId) {
        return self.qsm.get(quikiId);
    }

    this.setLocalValue = function (quikiId, value) {
        self.qsm.set(quikiId, value);
        return value;
    }

    // Creating request router.
    this.route = function (request, sender) {
        if (request.action === 'get') {
            return {
                'status': 'ok',
                'value': self.getLocalValue(request.quikiId)
            };
        } else if (request.action === 'set') {
            return {
                'status': 'ok',
                'value': self.setLocalValue(request.quikiId, request.value)
            };
        }
    }

    // Creating listener and attach routing.
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        sendResponse(
            self.route(request, sender)
        );
    });

    // Creating context menu.
    chrome.contextMenus.create({
        "title": "Wyszukaj \"%s\" na diki.pl",
        "contexts": ["selection"],
        "onclick": self.searchOnDiki
    });

}
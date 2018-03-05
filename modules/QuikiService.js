'use strict';

const quikiStorageSchema = '1.0';

function QuikiService() {

    var self = this;

    // Create storage manager.
    this.qsm = new QuikiStorageManager();

    // Sets default settings, preferences, etc.
    this.setDefaultStorage = function () {
        this.qsm.setArray([{
                'key': 'storage-schema',
                'value': quikiStorageSchema
            },
            {
                'key': 'setting-modal',
                'value': true
            }
        ]);
    }

    // Checks local version and local storage.
    var storageSchema = this.qsm.get('storage-schema');
    if (!storageSchema || storageSchema != quikiStorageSchema) {
        this.qsm.clear();
        this.setDefaultStorage();
    }

    // Create request router.
    this.route = function (request, sender) {
        if (request.action === 'get-setting-modal') {
            return {
                'status': 'ok',
                'value': self.qsm.get('setting-modal')
            };
        } else if (request.action === 'set-setting-modal') {
            self.qsm.set('setting-modal', request.value);
            return {
                'status': 'ok',
                'value': self.qsm.get('setting-modal')
            }
        }
        return null;
    }

    // Create listener and attach routing.
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        sendResponse(
            self.route(request, sender)
        );
    });

}
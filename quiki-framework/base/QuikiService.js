'use strict';

const quikiStorageSchema = '1.1';
const quikiStorageDefault = [{
        'key': 'storage-schema',
        'value': quikiStorageSchema,
    },
    {
        'key': 'setting-doubleclick-modal',
        'value': true,
    },
    {
        'key': 'setting-analytics-data',
        'value': false,
    }
];
const urlPatterns = [
    "http://*/*",
    "https://*/*",
];

function QuikiService() {

    var self = this;

    // Adding optional Google Analytics code.
    this.qa = new QuikiAnalytics();

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

    // Creating router functions.
    this.getLocalValue = function (quikiId) {
        return self.qsm.get(quikiId);
    }

    this.setLocalValue = function (quikiId, value) {
        if (quikiId == 'setting-analytics-data') {
            self.qa.setPrivacyAgreement((String(value) == "true"));
        }
        self.qsm.set(quikiId, value);
        return value;
    }

    // Context menu on selection function handler.
    this.searchOnDiki = function (event) {
        self.qa.pushEvent({
            'category': 'quiki-service',
            'action': 'word-search',
        });
        chrome.tabs.create({
            url: "https://www.diki.pl/slownik-angielskiego?origin=quiki&q=" + event.selectionText,
        });
    }

    // Sends modal request to active tab.
    this.sendModalRequest = function (event) {
        self.qa.pushEvent({
            'category': 'quiki-service',
            'action': 'modal-request',
        });
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "considerModal",
                parameters: event,
            });
        });
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
        } else if (request.action === 'ga-event') {
            this.qa.pushEvent(request.parameters);
            return {
                'status': 'ok',
            }
        } else if (request.action === 'ga-page'){
            this.qa.pushPage(request.parameters);
            return {
                'status': 'ok',
            }
        }
        return {
            'status': 'exception',
            'msg': 'There is no exsisting route that can be fired with this request.',
            'request': request,
        }
    }

    // Creating listener and attach routing.
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        sendResponse(
            self.route(request, sender)
        );
    });

    // Creating context menus.
    chrome.contextMenus.create({
        "title": "Sprawdź znaczenie \"%s\"",
        "contexts": ["selection"],
        "documentUrlPatterns": urlPatterns,
        "onclick": self.sendModalRequest
    });

    chrome.contextMenus.create({
        "title": "Wyszukaj \"%s\" w nowym oknie",
        "contexts": ["selection"],
        "documentUrlPatterns": urlPatterns,
        "onclick": self.searchOnDiki
    });

    // Passing local private policy settings.
    this.qa.setPrivacyAgreement((String(this.getLocalValue('setting-analytics-data')) == "true"));

}
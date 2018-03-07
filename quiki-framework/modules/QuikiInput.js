'use strict';

function QuikiInput(properties) {

    var self = this;

    // Setting basic properties.
    this.properties = properties;

    // Setting specyfic and common definers.
    this.quikiId = properties.quikiId;
    this.label = properties.label;
    this.type = properties.type;

    // Creating getters...
    this.getValue = function () {
        chrome.runtime.sendMessage({
            action: 'get',
            quikiId: self.quikiId,
        }, function (response) {
            self.value = (String(response.value) == "true");
        });
    }

    // ...and setters that are trying to communicate with available QuikiService instance.
    this.setValue = function () {
        chrome.runtime.sendMessage({
            action: 'set',
            quikiId: self.quikiId,
            value: self.value,
        }, function (response) {
            self.value = (String(response.value) == "true");
        });
    }

    // Setting initial value given from QuikiService instance.
    this.getValue();

}
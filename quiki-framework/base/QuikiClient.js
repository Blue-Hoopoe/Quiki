'use strict';

function QuikiClient() {

    var self = this;

    // Returns user selection.
    this.getWindowSelection = function () {
        return window.getSelection().toString();
    }

    // Checks if modal should be displayed.
    this.considerModal = function (event, origin = 'background') {

        // Create query word from given event or window selection.
        var word = self.getWindowSelection();
        if (event.selectionText) {
            word = event.selectionText;
        }
        word = word.trim();

        // Check if word is not empty or whitespace.
        if (!word || !/.*\S.*/.test(word)) {
            return;
        }

        // Check if global modal setting is on or just fire modal if event is sent from background page.
        if (origin != 'self') {
            self.createModal(word, event);
        } else {
            chrome.runtime.sendMessage({
                action: "get",
                quikiId: "setting-doubleclick-modal"
            }, function (response) {
                if ((String(response.value) == "true")) {
                    self.createModal(word, event);
                }
            });
        }
    }

    // Creates new modal.
    this.createModal = function (word, event) {

        // Inform quiki analytics.
        chrome.runtime.sendMessage({
            'action': 'ga-event',
            'parameters': {
                'category': 'quiki-client',
                'action': 'create-modal',
            }
        });

        // If modal alredy exsists just change its source.
        if ($('#quiki-modal').length) {
            $('#quiki-modal').find('iframe').first().attr('src', 'https://www.diki.pl/slownik-angielskiego?q=' + word + '&origin=quiki');
        } else {
            $('html').addClass('quiki-presenting');
            var $modal = $('<div id="quiki-modal"><div id="quiki-iframe-wrap"><div id="quiki-x"><span>&times;</span> Zamknij okno</div><iframe src="https://www.diki.pl/slownik-angielskiego?q=' + word + '&origin=quiki" frameborder="0"></iframe></div><div id="quiki-poke"></div></div>').appendTo('body');
            var $iframe = $modal.find('iframe').first();
        }

        $('#quiki-poke, #quiki-x').on('click', function () {
            self.removeModal();
        });
    }

    // Removes exsisting modals.
    this.removeModal = function () {
        $('#quiki-modal').remove();
        $('html').removeClass('quiki-presenting');
    }

    // Watches 'esc' press on main window scope (to be continued).
    this.startWatchingKeys = function () {

        // Escape key handler.
        $(document).keydown(function (event) {
            if (event.originalEvent.keyCode == 27) {
                self.removeModal();
            }
        });

        // Attaching double click event handler.
        $('html').on('dblclick', function (event) {
            self.considerModal(event, 'self');
        });
    }
    this.startWatchingKeys();

    // Create listener.
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        self[request.action](request.parameters);
    });

}
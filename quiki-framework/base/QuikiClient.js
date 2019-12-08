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
                action: 'get',
                quikiId: 'setting-doubleclick-modal'
            }, function (response) {
                if ((String(response.value) == "true")) {
                    self.createModal(word, event);
                }
            });
        }
    }

    // Creates new modal.
    this.createModal = function (word, event) {

        // If modal alredy exsists just change its source.
        let modal = document.querySelector('#quiki-modal');
        if (modal) {
            modal.querySelector('iframe').setAttribute('src', `https://www.diki.pl/slownik-angielskiego?q=${word}&origin=quiki`);
        } else {
            document.querySelector('html').classList.add('quiki-presenting');
            document.body.insertAdjacentHTML('beforeend', `
                <div id="quiki-modal">
                    <div id="quiki-iframe-wrap">
                    <div id="quiki-x"><span>&times;</span> Zamknij okno</div>
                    <div class="quiki-spinner"></div>
                    <iframe src="https://www.diki.pl/slownik-angielskiego?q=${word}&origin=quiki" frameborder="0"></iframe>
                    </div>
                    <div id="quiki-poke"></div>
                </div>
            `);
        }

        // Listen for overlay click.
        document.querySelectorAll('#quiki-poke, #quiki-x').forEach(el => {
            el.addEventListener('click', self.removeModal);
        })
    }

    // Removes exsisting modals.
    this.removeModal = function () {
        document.querySelector('#quiki-modal').remove();
        document.querySelector('html').classList.remove('quiki-presenting');
    }

    // Watches 'esc' press on main window scope (to be continued).
    this.startWatchingKeys = function () {

        // "Escape" key handler.
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 27) {
                self.removeModal();
            }
        });

        // Attaching double click event handler.
        document.querySelector('html').addEventListener('dblclick', function (event) {
            self.considerModal(event, 'self');
        });
    }
    this.startWatchingKeys();

    // Create listener.
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        self[request.action](request.parameters);
    });

}
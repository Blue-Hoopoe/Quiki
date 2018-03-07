'use strict';

function QuikiClient() {

    var self = this;

    // Checks if modal should be displayed.
    this.considerModal = function (event) {
        var word = window.getSelection().toString().trim();
        if ($('#quiki-modal').length || !word || /^$|\s+/.test(word)) {
            return;
        }

        // Check if global modal setting is on.
        chrome.runtime.sendMessage({
            action: "get",
            quikiId: "setting-doubleclick-modal"
        }, function (response) {
            if((String(response.value) == "true")){
                self.createModal(word, event);
            }
        });
    }

    // Creates new modal.
    this.createModal = function (word, event) {
        $('html').addClass('quiki-presenting');
        var $modal = $('<div id="quiki-modal"><div id="quiki-iframe-wrap"><div id="quiki-x"><span>&times;</span> Zamknij okno</div><iframe src="https://www.diki.pl/slownik-angielskiego?q=' + word + '&origin=quiki" frameborder="0"></iframe></div><div id="quiki-poke"></div></div>').appendTo('body');
        var $iframe = $modal.find('iframe').first();
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
        $(document).keydown(function (event) {
            if (event.originalEvent.keyCode == 27){
                self.removeModal();
            }          
        });
    }
    this.startWatchingKeys();

}
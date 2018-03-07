'use strict';

function QuikiClient() {

    var self = this;

    // Checks if popup should be displayed.
    this.considerPopup = function (event) {
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
                self.createPopup(word, event);
            }
        });
    }

    // Creates new popup.
    this.createPopup = function (word, event) {
        $('html').addClass('quiki-presenting');
        $('<div id="quiki-modal"><div id="quiki-iframe-wrap"><div id="quiki-x"><span>&times;</span> Zamknij okno</div><iframe src="https://www.diki.pl/slownik-angielskiego?q=' + word + '&origin=quiki" frameborder="0"></iframe> </div><div id="quiki-poke"></div></div>').appendTo('body');
        $('#quiki-poke, #quiki-x').on('click', function () {
            self.removePopup();
        });
    }

    // Removes exsisting popups.
    this.removePopup = function () {
        $('#quiki-modal').remove();
        $('html').removeClass('quiki-presenting');
    }

    // Watches 'esc' press on main window scope (to be continued).
    this.startWatchingKeys = function () {
        $(document).keydown(function (event) {
            if (event.originalEvent.keyCode == 27){
                self.removePopup();
            }          
        });
    }
    this.startWatchingKeys();

}
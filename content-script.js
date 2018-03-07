'use strict';

// If user is not on diki origin page...
if (window.location.host != 'www.diki.pl'){

    // Create instance of quiki client.
    var quikiClient = new QuikiClient();

    // Create event listener on double click.
    $("html").on('dblclick', function(event) {
        quikiClient.considerModal(event);
    });

}
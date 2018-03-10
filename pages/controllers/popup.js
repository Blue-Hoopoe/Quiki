'use strict';

// Bind all data to the view.
rivets.bind($('#popup'), {
    settings: [
        new QuikiInput({
            'quikiId': 'setting-analytics-data',
            'label': 'Ulepszaj quiki wysyłająć anonimowe informacje',
            'type': 'checkbox',
        }),
        new QuikiInput({
            'quikiId': 'setting-doubleclick-modal',
            'label': 'Szukaj definicji przy podwójnym kliknięciu',
            'type': 'checkbox',
        }),
    ]
});

// Attach autocompletion feature to diki form.
var dikiAutocomplete = new autoComplete({
    selector: '#diki-query',
    minChars: 2,
    cache: true,
    source: function (query, response) {
        try{ xhr.abort(); } catch(e){}
        $.getJSON('https://www.diki.pl/dictionary/autocomplete', {
            q: query,
            langpair: 'en::pl',
            origin: 'quiki',
        }, function (data) {
            response(data);
        });
    }
});

// Prevent sending empty request to diki.
$('#diki-form').on('submit', function(event){
    if ($('#diki-query').val() === ''){
        event.preventDefault();
    }
});

// Attach qa (quki analytics) events.
$(document).ready(function(){
    $('[qa-event]').each(function(i, element){
        var $this = $(element);
        $this.on($this.attr('qa-event'), function(e){
            var $this = $(this);
            var value = $this.attr('qa-value');
            console.log($this.attr('qa-action') + (value ? '-' + value : ''))
            chrome.runtime.sendMessage({
                'action': 'ga-event',
                'parameters': {
                    'category': $this.attr('qa-category'),
                    'action': $this.attr('qa-action') + (value ? '-' + value : ''),
                }
            });
        })
    });
});

chrome.runtime.sendMessage({
    'action': 'ga-page',
    'parameters': {
        'page': 'popup',
    }
});
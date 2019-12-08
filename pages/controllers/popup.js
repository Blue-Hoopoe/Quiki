'use strict';

// Bind all data to the view.
rivets.bind(document.querySelector('#popup') , {
    settings: [
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
        
        // Create an endpoint.
        const endpoint = new URL('https://www.diki.pl/dictionary/autocomplete');
        endpoint.search = new URLSearchParams({
            q: query,
            langpair: 'en::pl',
            origin: 'quiki',
        });

        // Retrieve a data fron endpoint.
        fetch(endpoint)
            .then(data => data.json())
            .then(response);
    }
});

// Prevent sending empty request to diki.
document.querySelector('#diki-form').addEventListener('submit', function(event){
    const query = document.querySelector('#diki-query').value;
    if (query === ''){
        event.preventDefault();
    }
});

// Create custom new tab linking logic...
document.querySelectorAll('[quiki-href]').forEach(el => {
    el.addEventListener('click', (event) => {
        chrome.tabs.create({
            url: el.getAttribute('href'),
        });
        event.preventDefault();
    });
});

//...and custom new tab form.
document.querySelector('[quiki-form]').addEventListener('submit', function(event){
    event.preventDefault();

    // Create a dynamic endpoint.
    const params = new URLSearchParams();

    // Retrieve data from form.
    this.querySelectorAll('input, textarea').forEach(function (inputable) {
        params.append(
            inputable.getAttribute('name'),
            inputable.value
        );
    });
    const endpoint = new URL(this.getAttribute('action'));
    endpoint.search = params;

    // Open desired enpoint in new chrome tab.
    chrome.tabs.create({
        url: endpoint.toString(),
    });
});
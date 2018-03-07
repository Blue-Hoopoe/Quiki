'use strict';

// Bind all data to the view.
rivets.bind($('#popup'), {
    settings: [
        new QuikiInput({
            'quikiId': 'setting-doubleclick-modal',
            'label': 'Szukaj definicji przy podwójnym kliknięciu',
            'type': 'checkbox',
        }),
    ]
})
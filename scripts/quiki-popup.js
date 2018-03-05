// Get settings from QuickiService.
chrome.runtime.sendMessage({
    action: "get-setting-modal"
}, function (response) {
    $('#settings-double-click').prop('checked', response.value == 'true');
});

// Set settings.
$('#settings-double-click').change(function () {
    chrome.runtime.sendMessage({
        action: "set-setting-modal",
        value: $(this).prop('checked')
    }, function (response) {
        $('#settings-double-click').prop('checked', response.value == 'true');
    });
});
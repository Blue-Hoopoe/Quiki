'use strict';

const quikiGAAccount = 'UA-115186780-1';

var _gaq = _gaq || [];

function QuikiAnalytics() {

    var self = this;
    var privacyAgreement;

    // Getters and setter for privacyAgreement
    this.getPrivacyAgreement = function(){
        return privacyAgreement;
    }
    this.setPrivacyAgreement = function(value){
        privacyAgreement = value;
        if (value){
            this.confirmTracking();
        }
    }

    // Adds analytics script to the html.
    this.confirmTracking = function () {

        // Abort if Client doesn't want to send data.
        if (!privacyAgreement) {
            return false;
        }

        // Abort also if google script already exsists.
        if (document.getElementById('quiki-analytics')){
            return true;
        }

        // Inserting script tag background page.
        var ga = document.createElement('script');
        ga.id = 'quiki-analytics'
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);

        // Setting account.
        _gaq = _gaq || [];
        _gaq.push(['_setAccount', quikiGAAccount]);
        _gaq.push(['_trackPageview', '/background']);

        return true;
    }

    // Push data to Google Analytics.
    this.pushCustomData = function (query) {
        if (privacyAgreement) {
            _gaq.push(query);
            return true;
        } else {
            return false;
        }
    }

    // Pushes page tracking.
    this.pushPage = function (parameters) {
        this.pushCustomData([
            '_trackPageview',
            parameters.page,
        ]);
    }

    // Pushes event to Google Analytics.
    this.pushEvent = function (parameters) {
        this.pushCustomData([
            '_trackEvent',
            parameters.category,
            parameters.action,
            parameters.value ? parameters.value : null,
        ]);
    }

}
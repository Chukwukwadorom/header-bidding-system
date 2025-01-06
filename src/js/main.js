// src/js/main.js
import { PREBID_TIMEOUT, adUnits } from './prebid-config.js';

// Initialize Prebid.js
window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

window.pbjs.que.push(function() {
    window.pbjs.addAdUnits(adUnits);
    window.pbjs.requestBids({
        timeout: PREBID_TIMEOUT,
        bidsBackHandler: function() {
            // Here you can handle what happens after bids are returned
            // For example, if you're using Google Publisher Tags:
            // window.pbjs.setTargetingForGPTAsync();
            console.log('Bids are in');
            // Your logic to display ads or handle bid responses goes here
        }
    });
});
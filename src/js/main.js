// src/js/main.js
import { PREBID_TIMEOUT, adUnits, lazyLoadAds, FAILOVER_AD } from './prebid-config.js';

window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

// Initialize Prebid.js
window.pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);

    // Request bids
    pbjs.requestBids({
        timeout: PREBID_TIMEOUT,
        bidsBackHandler: function () {
            console.log('Bids received');
            try {
                pbjs.setTargetingForGPTAsync();
                displayAds();
            } catch (err) {
                console.error('Error setting targeting:', err);
                displayFallbackAd();
            }
        }
    });
});

// Display fallback ad if bids fail
function displayFallbackAd() {
    let adContainers = document.querySelectorAll('.ad-container');
    adContainers.forEach(container => {
        if (!container.innerHTML.trim()) {
            container.innerHTML = FAILOVER_AD;
        }
    });
}

// Handle lazy-loading ads on scroll
document.addEventListener('scroll', lazyLoadAds);

// GPT setup example (for integration with Google Publisher Tags)
function displayAds() {
    googletag.cmd.push(function () {
        googletag.pubads().refresh();
    });
}

// Error handling for failed bids
window.pbjs.que.push(function () {
    pbjs.onEvent('auctionEnd', function (data) {
        if (!data || data.noBids) {
            console.warn('No bids received for auction:', data);
        }
    });
});

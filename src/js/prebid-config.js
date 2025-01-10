var PREBID_TIMEOUT = 1000; // Set timeout in milliseconds
const FAILOVER_AD = '<div>Fallback Ad Content</div>';  // incase i have a fall ad

var adUnits = [
    {
        code: 'div-gpt-ad-1',
        mediaTypes: {
            banner: {
                sizes: [[300, 250], [300, 600]], // Default sizes
                sizeMapping: [
                    {
                        minWidth: 0,
                        sizes: [[300, 250]] // For mobile devices
                    },
                    {
                        minWidth: 768,
                        sizes: [[728, 90], [300, 600]] // For tablets
                    },
                    {
                        minWidth: 1024,
                        sizes: [[300, 250], [300, 600]] // For desktops
                    }
                ]
            }
        },
        bids: [
            { bidder: 'appnexus', params: { placementId: '13232321' } },
            { bidder: 'rubicon', params: { accountId: '12345', siteId: '67890', zoneId: '123456' } }
        ]
    }
];

// Dynamic floor pricing
function getFloorPrice(size, deviceType) {
    let basePrice = 0.50;
    if (deviceType === 'mobile') basePrice = 0.30;
    if (deviceType === 'desktop') basePrice = 0.70;
    if (size[0] > 700) return basePrice * 1.2; // Larger ads cost more
    return basePrice;
}

// Detect device type
function detectDeviceType() {
    return window.innerWidth < 768 ? 'mobile' : 'desktop'; 
}

/// Apply floor prices dynamically
adUnits.forEach(unit => {
    unit.bids.forEach(bid => {
        let deviceType = detectDeviceType();
        let size = unit.mediaTypes.banner.sizes[0]; // Taking the first size as a reference
        bid.params.floor = getFloorPrice(size, deviceType);
    });
});

// Lazy-loading helper function
function lazyLoadAds() {
    let adElements = document.querySelectorAll('[data-lazy-ad]');
    adElements.forEach(ad => {
        if (ad.getBoundingClientRect().top < window.innerHeight) {
            ad.setAttribute('id', ad.dataset.lazyAd);
        }
    });
}

// Initialize Prebid analytics
window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];
window.pbjs.que.push(function () {
    pbjs.enableAnalytics([
        {
            provider: 'ga',
            options: { trackerId: 'UA-123456-1' } //note to self, circle back!
        }
    ]);
});

// Export configuration
export { PREBID_TIMEOUT, adUnits, lazyLoadAds, FAILOVER_AD };
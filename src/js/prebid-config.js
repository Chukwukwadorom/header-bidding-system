var PREBID_TIMEOUT = 1000; // Set timeout in milliseconds

var adUnits = [
    {
        code: 'div-gpt-ad-1460505748561-0',
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

// Function to dynamically set floor price based on size and device type
function getFloorPrice(size, deviceType) {
    let basePrice = 0.50; // Base floor price
    if (deviceType === 'mobile') {
        basePrice = 0.30; // Lower price for mobile
    } else if (deviceType === 'desktop') {
        basePrice = 0.70; // Higher price for desktop
    }
    
    // Adjust based on size - this is just an example. You might want more nuanced logic
    if (size[0] > 700) { // Width greater than 700px
        return basePrice * 1.2; // 20% increase for larger ads
    }
    return basePrice;
}

// Simplified device type detection based on viewport width
function detectDeviceType() {
    return window.innerWidth < 768 ? 'mobile' : 'desktop'; // Simplified detection
}

// Apply dynamic floor pricing
adUnits.forEach(unit => {
    unit.bids.forEach(bid => {
        let deviceType = detectDeviceType();
        let size = unit.mediaTypes.banner.sizes[0]; // Taking the first size as a reference
        bid.params.floor = getFloorPrice(size, deviceType);
    });
});

// Export configuration
export { PREBID_TIMEOUT, adUnits, getFloorPrice, detectDeviceType };
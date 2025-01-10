const mockAdUnits = require('../src/js/prebid-config').adUnits;
const { displayFallbackAd, lazyLoadAds } = require('../src/js/main');

global.window = {
    innerHeight: 1000,
    pbjs: {
        addAdUnits: jest.fn(),
        requestBids: jest.fn(),
        setTargetingForGPTAsync: jest.fn(),
        onEvent: jest.fn(),
        que: []
    },
    googletag: {
        cmd: {
            push: jest.fn()
        }
    },
    document: {
        querySelectorAll: jest.fn(),
        addEventListener: jest.fn()
    }
};

describe('Main JS Functionality', () => {
    describe('Prebid Initialization', () => {
        test('should initialize Prebid with ad units', () => {
            require('../src/js/main'); // This should trigger the code in main.js
            expect(window.pbjs.addAdUnits).toHaveBeenCalledWith(mockAdUnits);
            expect(window.pbjs.requestBids).toHaveBeenCalled();
        });

        test('should handle bids back', () => {
            require('../src/js/main');
            expect(window.googletag.cmd.push).toHaveBeenCalled();
        });
    });

    describe('Fallback Ad', () => {
        test('should display fallback ad for empty containers', () => {
            const mockContainers = [
                { innerHTML: '', set innerHTML(value) {} },
                { innerHTML: 'Some content', set innerHTML(value) {} }
            ];
            window.document.querySelectorAll.mockReturnValue(mockContainers);
            displayFallbackAd();
            expect(mockContainers[0].innerHTML).toBe('FALLBACK_AD_CONTENT'); // Assuming FAILOVER_AD is string content
            expect(mockContainers[1].innerHTML).toBe('Some content'); // Should not change
        });
    });

    describe('Lazy Loading', () => {
        test('should lazy load ads when in view', () => {
            const mockAd = {
                getBoundingClientRect: jest.fn(() => ({ top: 500, bottom: 550 })),
                setAttribute: jest.fn(),
                dataset: { lazyAd: 'ad-1' }
            };
            window.document.querySelectorAll.mockReturnValue([mockAd]);
            lazyLoadAds();
            expect(mockAd.setAttribute).toHaveBeenCalledWith('id', 'ad-1');
        });
    });

    describe('Error Handling', () => {
        test('should log error on auction end with no bids', () => {
            const originalConsoleWarn = console.warn;
            console.warn = jest.fn();
            require('../src/js/main');
            window.pbjs.que[0](); // Execute the first function in the queue
            window.pbjs.onEvent.mock.calls[0][1]({ noBids: true }); // Simulate auctionEnd event with no bids
            expect(console.warn).toHaveBeenCalledWith('No bids received for auction:', { noBids: true });
            console.warn = originalConsoleWarn; // Restore console.warn
        });
    });
});
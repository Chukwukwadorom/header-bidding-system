const adUnits = require('../src/js/prebid-config'); 

describe('Prebid.js Configuration', () => {
    test('should have a valid ad unit structure', () => {
        expect(adUnits).toBeDefined();
        expect(adUnits).toBeInstanceOf(Array);
        adUnits.forEach(unit => {
            expect(unit).toHaveProperty('code');
            expect(unit).toHaveProperty('mediaTypes');
            expect(unit).toHaveProperty('bids');
        });
    });

    test('should define bids for each ad unit', () => {
        adUnits.forEach(unit => {
            expect(unit.bids.length).toBeGreaterThan(0);
            unit.bids.forEach(bid => {
                expect(bid).toHaveProperty('bidder');
                expect(bid).toHaveProperty('params');
            });
        });
    });
});

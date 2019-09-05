import { Utils } from '../../../src/misc/utils';

describe('Utils Service', () => {
    describe('getDomain', () => {
        it('should fail for invalid urls', () => {
            expect(Utils.getDomain(null)).toBeNull();
            expect(Utils.getDomain(undefined)).toBeNull();
            expect(Utils.getDomain(' ')).toBeNull();
            expect(Utils.getDomain('https://bit!:"_&ward.com')).toBeNull();
            expect(Utils.getDomain('bytegarden')).toBeNull();
        });

        it('should handle urls without protocol', () => {
            expect(Utils.getDomain('bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getDomain('wrong://bytegarden.com')).toBe('bytegarden.com');
        });

        it('should handle valid urls', () => {
            expect(Utils.getDomain('https://bytegarden')).toBe('bytegarden');
            expect(Utils.getDomain('https://bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getDomain('http://bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getDomain('http://vault.bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getDomain('https://user:password@bytegarden.com:8080/password/sites?and&query#hash'))
                .toBe('bytegarden.com');
            expect(Utils.getDomain('https://bytegarden.unknown')).toBe('bytegarden.unknown');
        });

        it('should support localhost and IP', () => {
            expect(Utils.getDomain('https://localhost')).toBe('localhost');
            expect(Utils.getDomain('https://192.168.1.1')).toBe('192.168.1.1');
        });
    });

    describe('getHostname', () => {
        it('should fail for invalid urls', () => {
            expect(Utils.getHostname(null)).toBeNull();
            expect(Utils.getHostname(undefined)).toBeNull();
            expect(Utils.getHostname(' ')).toBeNull();
            expect(Utils.getHostname('https://bit!:"_&ward.com')).toBeNull();
            expect(Utils.getHostname('bytegarden')).toBeNull();
        });

        it('should handle valid urls', () => {
            expect(Utils.getHostname('bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getHostname('https://bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getHostname('http://bytegarden.com')).toBe('bytegarden.com');
            expect(Utils.getHostname('http://vault.bytegarden.com')).toBe('vault.bytegarden.com');

            if (Utils.isNode || window.navigator.userAgent.indexOf(' Edge/') === -1) {
                // Note: Broken in Edge browser. See
                // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8004284/
                expect(Utils.getHostname('https://user:password@bytegarden.com:8080/password/sites?and&query#hash'))
                    .toBe('bytegarden.com');
            }
        });

        it('should support localhost and IP', () => {
            expect(Utils.getHostname('https://localhost')).toBe('localhost');
            expect(Utils.getHostname('https://192.168.1.1')).toBe('192.168.1.1');
        });
    });

    describe('newGuid', () => {
        it('should create a valid guid', () => {
            const validGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(Utils.newGuid()).toMatch(validGuid);
        });
    });
});

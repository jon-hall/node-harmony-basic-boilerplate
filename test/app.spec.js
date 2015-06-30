var app = require('../src/app');
// Make sure this is called before the first spec using a generator for it/fit/beforeEach/afterEach
require('./util/jasmine-generator-patch');

describe('app', function() {
    /*
     * it, fit, beforeEach, and afterEach can all be passed generators after loading the patch
     */
    it('test', function* () {
        var t = +(new Date());
        yield* app(500);
        expect(+(new Date()) - t).toBeGreaterThan(499);
        console.log('Test completed OK!');
    });
});

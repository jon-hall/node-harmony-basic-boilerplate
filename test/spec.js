var app = require('../src/app'),
    genIt = require('./util/gen-it');

describe('app', function() {
    genIt('test', function* () {
        var t = +(new Date());
        yield* app(500);
        expect(+(new Date()) - t).toBeGreaterThan(499);
        console.log('Test completed OK!');
    });
});

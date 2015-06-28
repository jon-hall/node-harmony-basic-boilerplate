var suspend = require('suspend'),
    isGeneratorFn = require('is-generator').fn;

/**
 * Adds very crude generator support to jasmine's 'it', 'fit', 'beforeEach',
 * and 'afterEach' methods.
 * Achieved with the help of a bit of bodgery to jasmine's 'env'.
 *
 * Once this has been 'require'd in, the above jasmine methods will all accept
 * generator functions, and will wait for the entire generator to run (similar
 * to calling with 'yield*') before the test/step is considered completed.
 */
module.exports = (function() {
    var isIt = /it$/,
        funcs = ['fit', 'it', 'beforeEach', 'afterEach'];

    var env = jasmine.getEnv();
    funcs.forEach(name => {
        var fnArg = isIt.test(name) ? 1 : 0,
            shouldArg = !!fnArg ? 0 : undefined,
            original;

        original = env[name];
        env[name] = wrapForGen(original, env, fnArg, shouldArg);
    });

    function wrapForGen(method, env, fnArg, shouldArg) {
        return function() {
            var fn = arguments[fnArg],
                should = shouldArg === undefined ? '' : arguments[shouldArg],
                outArgs = [];

            if(isGeneratorFn(fn)) {
                outArgs[fnArg] = function(done) {
                    suspend.run(fn, done);
                };

                should && (outArgs[shouldArg] = should);
                return method.apply(env, outArgs);
            } else {
                return method.apply(env, arguments);
            }
        };
    }
})();

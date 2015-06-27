var suspend = require('suspend'),
    resumeRaw = suspend.resumeRaw;

module.exports = function*(delay) {
    yield setTimeout(resumeRaw(), delay);
}

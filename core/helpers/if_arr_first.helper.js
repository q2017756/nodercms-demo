module.exports = function (a, options) {
    if (options.data.key === 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};
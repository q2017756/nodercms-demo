module.exports = function (context, options) {
    if(context === '/news') {
        return options.fn(this);
    }
}
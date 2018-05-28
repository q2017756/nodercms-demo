module.exports = function (context, options) {
    if(context === '/contact') {
        return options.fn(this);
    }
}
module.exports = function (context, options) {
    if(context === '/product') {
        return options.fn(this);
    }
}
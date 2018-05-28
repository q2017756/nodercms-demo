module.exports = function (context, options) {
    if(context === '/about') {
        return options.fn(this);
    }
}
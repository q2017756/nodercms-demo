module.exports = function (context, options) {
    if(context === '/material') {
        return options.fn(this);
    }
}
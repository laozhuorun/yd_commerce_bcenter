var abp = abp || {};
(function() {

    /* DEFAULTS *************************************************/

    var defaultOptions = {
        nzDuration: 1000
    };

    abp.notify.success = function(message, title, options) {
        if (title === '' || title === undefined) {
            window.NzMessage.success(message, defaultOptions);
        } else {
            window.NzMessage.success(title + ':' + message, defaultOptions);
        }
    };

    abp.notify.info = function(message, title, options) {
        if (title === '' || title === undefined) {
            window.NzMessage.info(message, defaultOptions);
        } else {
            window.NzMessage.info(title + ':' + message, defaultOptions);
        }
    };

    abp.notify.warn = function(message, title, options) {
        if (title === '' || title === undefined) {
            window.NzMessage.warning(message, defaultOptions);
        } else {
            window.NzMessage.warning(title + ':' + message, defaultOptions);
        }
    };

    abp.notify.error = function(message, title, options) {
        if (title === '' || title === undefined) {
            window.NzMessage.error(message, defaultOptions);
        } else {
            window.NzMessage.error(title + ':' + message, defaultOptions);
        }
    };
})();
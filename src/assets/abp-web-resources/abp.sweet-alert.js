var abp = abp || {};
(function() {
    abp.message.info = function(message, title, isHtml, opts) {
        window.NzNotification.error(title, message);
    };

    abp.message.success = function(message, title, isHtml, opts) {
        window.NzNotification.error(title, message);
    };

    abp.message.warn = function(message, title, isHtml, opts) {
        window.NzNotification.warning(title, message);
    };

    abp.message.error = function(message, title, isHtml, opts) {
        window.NzNotification.error(title, message);
    };

    abp.message.confirm = function(message, titleOrCallback, callback, isHtml, opts) {

    };
})();
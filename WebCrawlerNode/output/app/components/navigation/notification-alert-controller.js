"use strict";
var moment = require('moment');
var NotificationAlertController = (function () {
    function NotificationAlertController($scope, $cookies, $element) {
        this.$cookies = $cookies;
        this.showNotification = $cookies.get("NotificationViewed") == undefined;
        if (this.showNotification) {
            var screenColor = $element.find('.notification-content-js').css('fill');
            this.originalColor = $('.site-wrapper').css('fill');
            $('header').css('fill', screenColor);
            $('header').css('color', screenColor);
            $('header').css('background-color', 'transparent');
            $('.cookie-notification').css('background-color', screenColor);
        }
    }
    NotificationAlertController.prototype.closeNotification = function () {
        this.$cookies.put('NotificationViewed', 'true', { expires: moment(window['bootStrappedData'].NotificationAlertEndTime).toDate() });
        this.showNotification = false;
        $('header').css('fill', this.originalColor);
        $('header').css('color', this.originalColor);
        $('header').css('background-color', '');
        $('.cookie-notification').css('background-color', this.originalColor);
    };
    NotificationAlertController.$inject = ['$scope', '$cookies', '$element'];
    return NotificationAlertController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotificationAlertController;
//# sourceMappingURL=notification-alert-controller.js.map
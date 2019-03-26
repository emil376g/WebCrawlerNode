"use strict";
var angular = require('angular');
var navigation_menu_1 = require('./navigation-menu');
var index_1 = require('../common/index');
var angularTimer = require('angular-timer');
var site_search_1 = require('../search/site-search');
var search_api_1 = require('../../apis/search-api');
var ngSanitize = require('angular-sanitize');
var notification_alert_controller_1 = require('./notification-alert-controller');
var angularCookies = require('angular-cookies');
angular.module('navigation-module', [navigation_menu_1.default.name, index_1.default, angularTimer.name, ngSanitize, angularCookies])
    .directive('siteSearch', site_search_1.default)
    .controller('NotificationAlertController', notification_alert_controller_1.default)
    .service('searchApi', search_api_1.default);
angular.bootstrap($('.main-nav'), ['navigation-module']);
//# sourceMappingURL=navigation.js.map
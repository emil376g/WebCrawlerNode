"use strict";
var angular = require('angular');
var angulartics = require('angulartics');
var angularticsGa = require('angulartics-google-analytics');
// Import all common components
var sticky_section_nav_directive_1 = require('./sticky-section-nav/sticky-section-nav-directive');
var secondary_nav_directive_1 = require('./secondary-nav/secondary-nav-directive');
var accordion_menu_1 = require('./accordion-menu');
var email_signup_controller_1 = require('./email-signup-controller');
var voucher_lookup_controller_1 = require('./voucher-lookup-controller');
var email_signup_api_1 = require('../../apis/email-signup-api');
var voucher_lookup_api_1 = require('../../apis/voucher-lookup-api');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('common-components', ['angulartics', 'angulartics.google.analytics'])
    .directive('rdtStickySectionNav', sticky_section_nav_directive_1.default)
    .controller('SecondaryNavController', secondary_nav_directive_1.SecondaryNavController)
    .controller('EmailSignupController', email_signup_controller_1.default)
    .controller('VoucherLookupController', voucher_lookup_controller_1.default)
    .directive('rdtSecondaryNav', secondary_nav_directive_1.secondaryNavDirective)
    .directive('accordionMenu', accordion_menu_1.default)
    .service('emailSignupService', email_signup_api_1.emailSignupService)
    .service('voucherLookupService', voucher_lookup_api_1.voucherLookupService)
    .config(function ($analyticsProvider, $locationProvider) {
    $analyticsProvider.virtualPageviews(false);
    if (window.locationProviderConfigured != true) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            rewriteLinks: false
        });
    }
})
    .name;
//# sourceMappingURL=index.js.map
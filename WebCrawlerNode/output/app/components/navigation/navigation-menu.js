"use strict";
var angular = require('angular');
var _ = require('lodash');
var NavigationMenuController = (function () {
    function NavigationMenuController($scope) {
        var _this = this;
        this.$scope = $scope;
        this.selectedNavMenu = "";
        this.navMenuOpen = false;
        this.loginMenuOpen = false;
        this.setImageBackgroundFlag();
        $(window).on('scroll', _.throttle(function () {
            _this.setImageBackgroundFlag();
        }, 20));
    }
    Object.defineProperty(NavigationMenuController.prototype, "mobileMenu", {
        //boolean representing if the current opened menu is in mobile
        get: function () {
            return window.innerWidth < 1025;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "SelectedNavMenu", {
        get: function () {
            return this.selectedNavMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "LoginMenuOpen", {
        get: function () {
            return this.loginMenuOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "SearchMenuOpen", {
        get: function () {
            return this.searchMenuOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "mobileMenuLevel", {
        get: function () {
            return this._mobileMenuLevel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "isIndividual", {
        get: function () {
            return this._isIndividual;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "ForgotPassword", {
        get: function () {
            return this._forgotPassword;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "NavMenuOpen", {
        get: function () {
            return this.navMenuOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "hasBackgroundImage", {
        get: function () {
            return this._hasBackgroundImage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "isAccountOverview", {
        get: function () {
            return this._isAccountOverview;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationMenuController.prototype, "OpenMenus", {
        get: function () {
            return this.selectedNavMenu.length > 0 || this.loginMenuOpen;
        },
        enumerable: true,
        configurable: true
    });
    NavigationMenuController.prototype.setImageBackgroundFlag = function () {
        var _this = this;
        var currentSection = $('section').filter(function (index, element) {
            return $(element).offset().top <= (window.scrollY || window.pageYOffset) && (window.scrollY || window.pageYOffset) <= $(element).offset().top + $(element).height();
        });
        this.$scope.$applyAsync(function () {
            _this._hasBackgroundImage = currentSection.hasClass('background-wrapper');
        });
        this.$scope.$applyAsync(function () {
            _this._isAccountOverview = currentSection.hasClass('account-overview');
        });
    };
    NavigationMenuController.prototype.toggleLoginMenu = function () {
        this.selectedNavMenu = "";
        this.navMenuOpen = false;
        this.loginMenuOpen = !this.loginMenuOpen;
        this._isIndividual = true;
    };
    NavigationMenuController.prototype.openIndividualLogin = function () {
        this._forgotPassword = false;
        this._isIndividual = true;
    };
    NavigationMenuController.prototype.openOrganizationLogin = function () {
        this._forgotPassword = false;
        this._isIndividual = false;
    };
    NavigationMenuController.prototype.openForgotPassword = function () {
        this._forgotPassword = true;
    };
    NavigationMenuController.prototype.toggleSearchMenu = function () {
        this.loginMenuOpen = false;
        this.selectedNavMenu = "";
        this.navMenuOpen = false;
        this.searchMenuOpen = !this.searchMenuOpen;
    };
    NavigationMenuController.prototype.toggleNavMenu = function (topNavMenuId) {
        //close other menus
        this.searchMenuOpen = false;
        this._forgotPassword = false;
        this.loginMenuOpen = false;
        if (this.selectedNavMenu == topNavMenuId) {
            this.navMenuOpen = !this.navMenuOpen;
            this.selectedNavMenu = "";
        }
        else {
            this.selectedNavMenu = topNavMenuId;
            this.navMenuOpen = true;
        }
    };
    NavigationMenuController.prototype.closeMenu = function () {
        this.selectedNavMenu = "";
        this.searchMenuOpen = false;
        this.navMenuOpen = false;
        this.loginMenuOpen = false;
        this._forgotPassword = false;
    };
    //mobile
    NavigationMenuController.prototype.toggleMobileNav = function () {
        this._mobileMenuLevel = 1;
        this.toggleNavMenu("");
    };
    NavigationMenuController.prototype.openSecondaryNavMenu = function (navId) {
        this._mobileMenuLevel = 2;
        this.selectedNavMenu = navId;
    };
    NavigationMenuController.prototype.moveUpMobileNav = function () {
        this._mobileMenuLevel = this._mobileMenuLevel - 1;
        if (this._mobileMenuLevel <= 1)
            this.selectedNavMenu = "";
    };
    NavigationMenuController.$inject = ['$scope'];
    return NavigationMenuController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular.module('navigationMenu', [])
    .controller('NavigationMenuController', NavigationMenuController);
//# sourceMappingURL=navigation-menu.js.map
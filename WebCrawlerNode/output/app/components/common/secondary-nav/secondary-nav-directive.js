"use strict";
/// <reference path="../../../../Scripts/typings/lodash/lodash.d.ts" />
var _ = require('lodash');
function secondaryNavDirective($window) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/app/components/common/secondary-nav/secondary-nav.html',
        scope: {
            sections: '=',
            primaryButtonText: '@',
            primaryButtonUrl: '@',
            primaryButtonNewWindow: '@',
            primaryColor: '@',
        },
        link: link,
        controller: 'SecondaryNavController',
        controllerAs: 'ctrl',
        bindToController: true
    };
    function link($scope, element, attrs, controller) {
        // Perform initial update
        updateModel(window.pageYOffset);
        // Construct a debounced version of updateModel
        var debouncedUpdate = _.throttle(updateModel, 100);
        // Subscribe to the window's 'scroll' events and update the nav
        angular.element($window).on('scroll', function () {
            $scope.$applyAsync(function () { return debouncedUpdate($window.pageYOffset); });
        });
        function updateModel(windowTop) {
            // Get the offset().top of each section and mark whether or not its been
            // scrolled to yet.
            $scope.ctrl.sections = $scope.ctrl.sections
                .map(function (s) {
                var position = $("#" + s.id).offset();
                if (position) {
                    s.top = position.top;
                    s.belowTop = (s.top - 100) < windowTop;
                }
                return s;
            })
                .sort(function (a, b) { return a.top - b.top; }); // Sort by top, ascending
            // Update whether or not the directive is shown
            if ($scope.ctrl.sections.length > 0)
                $scope.ctrl.isVisible = windowTop > $scope.ctrl.sections[0].top;
            // Set the current section to the lowest section that the user has scrolled to
            var lowestIdx = $scope.ctrl.sections
                .filter(function (s) { return s.top; }) // Ignore sections with no 'top' property
                .filter(function (s) { return s.belowTop; }) // Ignore sections that have not been scrolled to yet
                .length;
            // Set the current section
            $scope.ctrl.currentSection = $scope.ctrl.sections[lowestIdx - 1];
            // Check if the current seection has a backgroundImage
            $scope.ctrl.hasBackgroundImage = currentSectionHasBackgroundImage();
        }
        function currentSectionHasBackgroundImage() {
            var currentSection = $('section').filter(function (index, element) {
                return $(element).offset().top <= window.scrollY && window.scrollY <= $(element).offset().top + $(element).height();
            });
            return currentSection.hasClass('background-wrapper');
        }
        controller.insideClicks($('.mobile-menu-js'))
            .subscribe(function (event) {
            $scope.$applyAsync(function () { return controller.currentSection = null; });
        });
    }
}
exports.secondaryNavDirective = secondaryNavDirective;
;
var SecondaryNavController = (function () {
    function SecondaryNavController(insideClicks) {
        if (this.lightColor == true) {
            this.textColor = "#575757";
        }
        this.styles = "background-color: " + this.primaryColor + "; border-color: " + this.primaryColor + "; color: " + this.textColor;
        this.showSections = false;
        this.hasBackgroundImage = false;
        this.insideClicks = insideClicks;
    }
    SecondaryNavController.prototype.toggleSections = function () {
        this.showSections = !this.showSections;
    };
    SecondaryNavController.$inject = ['insideClicksService'];
    return SecondaryNavController;
}());
exports.SecondaryNavController = SecondaryNavController;
//# sourceMappingURL=secondary-nav-directive.js.map
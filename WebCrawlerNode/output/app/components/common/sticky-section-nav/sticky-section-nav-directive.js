"use strict";
/// <reference path="../../../../Scripts/typings/lodash/lodash.d.ts" />
var _ = require('lodash');
function stickySectionNavigationDirective($window) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/app/components/common/sticky-section-nav/sticky-section-nav.html',
        scope: {
            sections: '=',
            primaryButtonText: '@',
            primaryButtonUrl: '@',
            primaryButtonNewWindow: '@',
            primaryColor: '@',
            lightColor: '=',
            buttonBorder: '=',
            textColor: '@',
            transitionOffset: '='
        },
        link: link,
        controller: controller
    };
    function controller($scope) {
        if (typeof $scope.transitionOffset !== 'number') {
            throw new Error('The transition-offset parameter must be specified.');
        }
        if ($scope.lightColor == true && $scope.buttonBorder == true) {
            $scope.textColor = "#575757";
            $scope.borderColor = "#575757";
        }
        else if ($scope.lightColor == true && $scope.buttonBorder == false) {
            $scope.textColor = "#575757";
            $scope.borderColor = $scope.primaryColor;
        }
        else if ($scope.lightColor == false && $scope.buttonBorder == true) {
            $scope.borderColor = "#575757";
        }
        $scope.styles = "background-color: " + $scope.primaryColor + "; border-color: " + $scope.borderColor + "; color: " + $scope.textColor;
        if (!$scope.primaryButtonUrl)
            $scope.primaryStyles = "background-color: grey; border-color: grey";
    }
    function link($scope, element, attrs) {
        var elementTop = element.offset().top - $scope.transitionOffset;
        // Perform initial update
        updateModel(window.pageYOffset, elementTop, false);
        // Construct a debounced version of updateModel
        var debouncedUpdate = _.throttle(updateModel, 100);
        // Subscribe to the window's 'scroll' events and update the nav
        angular.element($window)
            .on('scroll', function () { return debouncedUpdate($window.pageYOffset, elementTop); });
        // Subscribe to the sections' 'hover' event and  update the sections
        element.find('ul').on('mouseenter', function () {
            $scope.hovered = true;
            $scope.$apply();
        });
        element.find('ul').on('mouseleave', function () {
            $scope.hovered = false;
            $scope.$apply();
        });
        element.find('ul').on('click', function () {
            $scope.hovered = !$scope.hovered;
            $scope.$apply();
        });
        function updateModel(windowTop, elementTop, performDigest) {
            if (performDigest === void 0) { performDigest = true; }
            // Update whether or not the directive is fixed
            $scope.isSticky = windowTop > elementTop;
            // Get the offset().top of each section and mark whether or not its been
            // scrolled to yet.
            $scope.sections = $scope.sections
                .map(function (s) {
                var position = $("#" + s.id).offset();
                if (position) {
                    s.top = position.top;
                    s.belowTop = (s.top - 100) < windowTop;
                }
                return s;
            })
                .sort(function (a, b) { return a.top - b.top; }); // Sort by top, ascending
            // Set the current section to the lowest section that the user has scrolled to
            var lowestIdx = $scope.sections
                .filter(function (s) { return s.top; }) // Ignore sections with no 'top' property
                .filter(function (s) { return s.belowTop; }) // Ignore sections that have not been scrolled to yet
                .length;
            $scope.currentSection = $scope.sections[lowestIdx - 1];
            if (performDigest) {
                $scope.$apply();
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stickySectionNavigationDirective;
;
//# sourceMappingURL=sticky-section-nav-directive.js.map
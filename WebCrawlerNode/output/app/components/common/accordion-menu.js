/// <reference path="../../../Scripts/typings/lodash/lodash.d.ts" />
"use strict";
function accordionMenuDirective() {
    return {
        name: 'accordionParent',
        restrict: 'E',
        replace: true,
        controller: AccordionController,
        controllerAs: 'accordion',
        bindToController: true,
        templateUrl: '/app/templates/accordion-menu.html',
        scope: {
            accordionHeaderText: '@',
            accordionHref: '@',
            accordionButtonClass: '@'
        },
        link: link,
        transclude: true
    };
    function link($scope, element, attrs, controller) {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = accordionMenuDirective;
;
var AccordionController = (function () {
    function AccordionController() {
        this.accordionOpen = false;
        this.buttonText = "( + )";
    }
    AccordionController.prototype.toggleAccordion = function () {
        this.accordionOpen = !this.accordionOpen;
        this.buttonText = this.accordionOpen ? "( - )" : "( + )";
    };
    return AccordionController;
}());
//# sourceMappingURL=accordion-menu.js.map
"use strict";
function siteSearchDirective() {
    return {
        restrict: 'E',
        controller: SiteSearchController,
        bindToController: true,
        controllerAs: "search",
        link: link,
        templateUrl: '/app/components/search/site-search.html',
        scope: {
            searchProductionText: '@',
            searchErrorMessage: '@'
        },
        replace: true
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = siteSearchDirective;
var SiteSearchController = (function () {
    function SiteSearchController($scope, searchApi) {
        var _this = this;
        this.searchErrored = false;
        this.searchApi = searchApi;
        this.searchQuery = "";
        this.searchResults = [];
        this.isSearching = false;
        this.nonProductionSearchOnly = false;
        this.culture = window.rdtCurrentCulture;
        $scope.$watchCollection(function () { return [_this.searchQuery, _this.nonProductionSearchOnly]; }, function (_a) {
            var query = _a[0], searchProduction = _a[1];
            _this.searchResults = [];
            if (query.length > 0) {
                _this.searchErrored = false;
                _this.isSearching = true;
                _this.searchApi.search(_this.culture, query, _this.nonProductionSearchOnly).then(function (queryResults) {
                    _this.isSearching = false;
                    $scope.$applyAsync(function () {
                        if (_this.nonProductionSearchOnly)
                            _this.searchResults = queryResults.filter(function (page) { return !page.isProductionPage; });
                        else
                            _this.searchResults = queryResults;
                    });
                }).catch(function (error) {
                    _this.searchErrored = true;
                });
            }
        });
    }
    SiteSearchController.$inject = ['$scope', 'searchApi'];
    return SiteSearchController;
}());
function link($scope, element, attrs, controller) {
    element.find('.close-search').on('click', function (event) {
        angular.element('.search-toggle').triggerHandler('click');
    });
    element.find('[name="site-search-input"]').focus();
}
//# sourceMappingURL=site-search.js.map
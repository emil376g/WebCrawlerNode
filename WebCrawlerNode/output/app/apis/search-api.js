"use strict";
var SearchApi = (function () {
    function SearchApi(_httpService, $q) {
        this._httpService = _httpService;
        this.$q = $q;
    }
    SearchApi.prototype.searchProductions = function (culture, query) {
        return this._httpService
            .get("/api/search/productions?culture=" + culture + "&q=" + query)
            .then(function (response) { return response.data; });
    };
    SearchApi.prototype.search = function (culture, query, filterPdps) {
        return this._httpService
            .get("/api/search?culture=" + culture + "&q=" + query + "&filterPdps=" + filterPdps)
            .then(function (response) { return response.data; });
    };
    SearchApi.$inject = ['$http', '$q'];
    return SearchApi;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchApi;
//# sourceMappingURL=search-api.js.map
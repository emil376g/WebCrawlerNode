"use strict";
var voucherLookupService = (function () {
    function voucherLookupService(_httpService) {
        this._httpService = _httpService;
    }
    voucherLookupService.prototype.lookupVoucherAmount = function (voucherCode) {
        var url = "/api/voucher?voucherCode=" + voucherCode;
        return this._httpService.get(url);
    };
    voucherLookupService.$inject = ['$http'];
    return voucherLookupService;
}());
exports.voucherLookupService = voucherLookupService;
//# sourceMappingURL=voucher-lookup-api.js.map
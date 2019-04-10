"use strict";
var VoucherLookupController = (function () {
    function VoucherLookupController(voucherLookupService) {
        this.voucherLookupService = voucherLookupService;
        this.self = this;
    }
    VoucherLookupController.prototype.lookupVoucher = function () {
        var _this = this;
        this.didSubmit = false;
        this.voucherLookupService.lookupVoucherAmount(this.voucherCode)
            .then(function (voucherAmount) { return _this.onVoucherLookupSuccess(voucherAmount); }, function () { return _this.onVoucherLookupFailure(); });
    };
    VoucherLookupController.prototype.onVoucherLookupSuccess = function (voucherAmount) {
        this.didSubmit = true;
        this.didLookupSuccessfully = true;
        var retObj = JSON.parse(JSON.stringify(voucherAmount));
        var voucherAmountArr = retObj['data']['balance'].split(' ');
        if (voucherAmountArr[1].substr(voucherAmountArr[1].length - 3) === ",00") {
            voucherAmountArr[1] = voucherAmountArr[1].substr(0, voucherAmountArr[1].length - 3);
        }
        this.voucherAmount = voucherAmountArr[1] + " " + voucherAmountArr[0];
        this.voucherExpiry = retObj['data']['expiry'];
        console.log(this.voucherExpiry);
    };
    VoucherLookupController.prototype.onVoucherLookupFailure = function () {
        this.didSubmit = true;
        this.didLookupSuccessfully = false;
    };
    VoucherLookupController.prototype.getDidLookupSuccessfully = function () {
        return this.didLookupSuccessfully;
    };
    VoucherLookupController.prototype.getDidSubmit = function () {
        return this.didSubmit;
    };
    VoucherLookupController.$inject = ['voucherLookupService'];
    return VoucherLookupController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VoucherLookupController;
//# sourceMappingURL=voucher-lookup-controller.js.map
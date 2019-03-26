"use strict";
var EmailSignupController = (function () {
    function EmailSignupController(emailSignupService) {
        this.emailSignupService = emailSignupService;
        this.constituencyNumber = window["bootStrappedData"].ConstituencyNumber;
        this.userAttributes = window["bootStrappedData"].UserAttributes;
        this.self = this;
    }
    EmailSignupController.prototype.registerUser = function () {
        var _this = this;
        this.didSubmit = false;
        this.emailSignupService.registerEmailLogin(this.firstName, this.lastName, this.emailAddress, this.constituencyNumber, this.userAttributes)
            .then(function () { return _this.onEmailRegistrationSuccess(); }, function () { return _this.onEmailRegistrationFailure(); });
    };
    EmailSignupController.prototype.onEmailRegistrationSuccess = function () {
        this.didSubmit = true;
        this.didRegisterSuccessfully = true;
    };
    EmailSignupController.prototype.onEmailRegistrationFailure = function () {
        this.didSubmit = true;
        this.didRegisterSuccessfully = false;
    };
    EmailSignupController.prototype.getDidRegisterSuccessfully = function () {
        return this.didRegisterSuccessfully;
    };
    EmailSignupController.prototype.getDidSubmit = function () {
        return this.didSubmit;
    };
    EmailSignupController.$inject = ['emailSignupService'];
    return EmailSignupController;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EmailSignupController;
//# sourceMappingURL=email-signup-controller.js.map
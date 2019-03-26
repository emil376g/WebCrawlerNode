"use strict";
var emailSignupService = (function () {
    function emailSignupService(_httpService) {
        this._httpService = _httpService;
    }
    emailSignupService.prototype.registerEmailLogin = function (firstName, lastName, emailAddress, constituencyNumber, userAttributes) {
        return this._httpService.post('/api/login/registerEmailLogin', {
            firstName: firstName, lastName: lastName, email: emailAddress, constituencyNumber: constituencyNumber, userAttributes: userAttributes
        });
    };
    emailSignupService.$inject = ['$http'];
    return emailSignupService;
}());
exports.emailSignupService = emailSignupService;
//# sourceMappingURL=email-signup-api.js.map
var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        Javascript.Version = "1.7.50";
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

var QueueIt;
(function (QueueIt) {
    var Tools;
    (function (Tools) {
        var EnvironmentHelper = /** @class */ (function () {
            function EnvironmentHelper() {
            }
            EnvironmentHelper.retrieveEnvInfoFromScriptTag = function () {
                if (EnvironmentHelper.environemntVariable)
                    return EnvironmentHelper.environemntVariable;
                try {
                    var scripts = document.getElementsByTagName("script");
                    for (var i = 0; i < scripts.length; i++) {
                        var scriptTag = scripts[i];
                        var cid = scriptTag.getAttribute("data-queueit-c");
                        if (cid) {
                            var host = scriptTag.getAttribute("data-queueit-host") || "";
                            var interceptAttr = scriptTag.getAttribute("data-queueit-intercept") || "";
                            var intercept = interceptAttr.toLowerCase() == "true";
                            var domainToIntercept = scriptTag.getAttribute("data-queueit-intercept-domain") || "";
                            var jsHost = scriptTag.getAttribute("data-queueit-jshost") || "";
                            var noCacheRAttr = scriptTag.getAttribute("data-queueit-nocachereq") || "";
                            var noCacheR = noCacheRAttr.toLowerCase() == 'true';
                            var noAutorunAttr = scriptTag.getAttribute("data-queueit-noautorun") || "";
                            var noAutorun = noAutorunAttr.toLowerCase() == 'true';
                            EnvironmentHelper.environemntVariable = {
                                cid: cid, intercept: intercept, host: host,
                                jsHost: jsHost, noCacheRequest: noCacheR, noAutorun: noAutorun,
                                domainToIntercept: domainToIntercept
                            };
                            return EnvironmentHelper.environemntVariable;
                        }
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
                return null;
            };
            EnvironmentHelper.cleanUp = function () {
                EnvironmentHelper.environemntVariable = undefined;
            };
            return EnvironmentHelper;
        }());
        Tools.EnvironmentHelper = EnvironmentHelper;
    })(Tools = QueueIt.Tools || (QueueIt.Tools = {}));
})(QueueIt || (QueueIt = {}));

var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var KnownUser;
        (function (KnownUser) {
            var AjaxInterceptor = /** @class */ (function () {
                function AjaxInterceptor() {
                }
                AjaxInterceptor.interceptOpen = function (domainToIntercept, getCurrentUrl, redirector) {
                    if (getCurrentUrl === void 0) { getCurrentUrl = null; }
                    if (redirector === void 0) { redirector = null; }
                    if (!redirector) {
                        redirector = function (url) {
                            window.location.href = url;
                            document.close();
                        };
                    }
                    if (!getCurrentUrl) {
                        getCurrentUrl = function () { return window.location.href; };
                    }
                    if (typeof XMLHttpRequest === 'function' && XMLHttpRequest.prototype) {
                        var orgOpen = XMLHttpRequest.prototype.open;
                        var stateIsUpdated = function (xhr) {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                try {
                                    var queueUrl = xhr.getResponseHeader("x-queueit-redirect");
                                    if (queueUrl) {
                                        redirector(decodeURIComponent(queueUrl));
                                    }
                                }
                                catch (ex) {
                                    console.log("getResponseHeader('x-queueit-redirect') error" + ex);
                                }
                            }
                        };
                        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                            var args = [method, url, async, user, password];
                            var xhr = this;
                            var addQueueITHeaders = false;
                            try {
                                addQueueITHeaders = AjaxInterceptor.isUrlDomainMatchingOrIsRelativeURL(url, domainToIntercept);
                                if (addQueueITHeaders) {
                                    xhr.addEventListener("readystatechange", function (event) { return stateIsUpdated(xhr); });
                                }
                            }
                            catch (ex) {
                            }
                            finally {
                                orgOpen.apply(xhr, args);
                                if (addQueueITHeaders) {
                                    xhr.setRequestHeader("x-queueit-ajaxpageurl", encodeURIComponent(getCurrentUrl()));
                                }
                            }
                        };
                    }
                };
                //Is request Url matching the domain to intecept?
                AjaxInterceptor.isUrlDomainMatchingOrIsRelativeURL = function (targetUrl, domainToIntercept) {
                    var absoluteUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
                    if (!absoluteUrlRegex.test(targetUrl)) {
                        return true;
                    }
                    if (domainToIntercept) {
                        var tmp = document.createElement('a');
                        tmp.href = targetUrl;
                        if (tmp.hostname.indexOf(domainToIntercept) > -1) {
                            return true;
                        }
                    }
                    return false;
                };
                return AjaxInterceptor;
            }());
            KnownUser.AjaxInterceptor = AjaxInterceptor;
        })(KnownUser = Javascript.KnownUser || (Javascript.KnownUser = {}));
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var KnownUser;
        (function (KnownUser) {
            var UrlQueueClientInitializer = /** @class */ (function () {
                function UrlQueueClientInitializer() {
                }
                UrlQueueClientInitializer.tryInitQueueClientFromToken = function (en, url) {
                    if (url === void 0) { url = null; }
                    if (!url)
                        url = window.location.href;
                    if (!en || !en.cid)
                        return;
                    var token = UrlQueueClientInitializer.getQueueITToken(url);
                    if (!token ||
                        !token.eventId || !QueueIt.Javascript.QueueClient || window.myQueueClient)
                        return;
                    var options = { removeTokenFromUrl: true };
                    if (en.host)
                        options.host = en.host;
                    window.myQueueClient = window.queueClient(en.cid, token.eventId, options);
                };
                UrlQueueClientInitializer.getQueueITToken = function (currentUrl) {
                    var regex = /queueittoken=([^&]*)/i;
                    var match = regex.exec(currentUrl);
                    if (!match || !match[1])
                        return null;
                    var result = new QueueItToken();
                    result.rawQueueItToken = match[1];
                    var tokenParts = result.rawQueueItToken.split("~");
                    for (var _i = 0, tokenParts_1 = tokenParts; _i < tokenParts_1.length; _i++) {
                        var nameVal = tokenParts_1[_i];
                        var nameValArray = nameVal.split("_");
                        switch (nameValArray[0].toLowerCase()) {
                            case "e":
                                result.eventId = nameValArray[1];
                                break;
                        }
                    }
                    return result;
                };
                return UrlQueueClientInitializer;
            }());
            KnownUser.UrlQueueClientInitializer = UrlQueueClientInitializer;
            var QueueItToken = /** @class */ (function () {
                function QueueItToken() {
                }
                return QueueItToken;
            }());
            KnownUser.QueueItToken = QueueItToken;
        })(KnownUser = Javascript.KnownUser || (Javascript.KnownUser = {}));
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var IntegrationConfig;
        (function (IntegrationConfig) {
            var Model;
            (function (Model) {
                function isNumber(arg) {
                    var isNaN2 = function (value) {
                        return typeof value === "number" && isNaN(value);
                    };
                    return !isNaN2(parseFloat(arg)) && isFinite(arg);
                }
                var QueueClientEventConfig = /** @class */ (function () {
                    function QueueClientEventConfig() {
                    }
                    return QueueClientEventConfig;
                }());
                Model.QueueClientEventConfig = QueueClientEventConfig;
                var RedirectionLogic = /** @class */ (function () {
                    function RedirectionLogic() {
                    }
                    RedirectionLogic.AllowTParameter = "AllowTParameter";
                    RedirectionLogic.EventTargetUrl = "EventTargetUrl";
                    RedirectionLogic.ForcedTargetUrl = "ForcedTargetUrl";
                    /**
                    Because of typo in enum value we need to support this for some time (all old configs would contain the value with typo)
                    **/
                    RedirectionLogic.ForecedTargetUrl = "ForecedTargetUrl";
                    return RedirectionLogic;
                }());
                Model.RedirectionLogic = RedirectionLogic;
                var ValidatorType = /** @class */ (function () {
                    function ValidatorType() {
                    }
                    ValidatorType.UrlValidator = "UrlValidator";
                    ValidatorType.CookieValidator = "CookieValidator";
                    ValidatorType.JSVariableValidator = "JSVariableValidator";
                    ValidatorType.UserAgentValidator = "UserAgentValidator";
                    return ValidatorType;
                }());
                Model.ValidatorType = ValidatorType;
                var ComparisonOperatorType = /** @class */ (function () {
                    function ComparisonOperatorType() {
                    }
                    ComparisonOperatorType.Equals = "Equals";
                    ComparisonOperatorType.Contains = "Contains";
                    ComparisonOperatorType.ContainsAny = "ContainsAny";
                    ComparisonOperatorType.EqualsAny = "EqualsAny";
                    //Old version
                    ComparisonOperatorType.NotEquals = "NotEquals";
                    ComparisonOperatorType.NotContains = "NotContains";
                    ComparisonOperatorType.IgEquals = "IgEquals";
                    ComparisonOperatorType.IgContains = "IgContains";
                    return ComparisonOperatorType;
                }());
                Model.ComparisonOperatorType = ComparisonOperatorType;
                var UrlPartSelectorType = /** @class */ (function () {
                    function UrlPartSelectorType() {
                    }
                    UrlPartSelectorType.PagePath = "PagePath";
                    UrlPartSelectorType.HostName = "HostName";
                    UrlPartSelectorType.PageUrl = "PageUrl";
                    return UrlPartSelectorType;
                }());
                Model.UrlPartSelectorType = UrlPartSelectorType;
                var ActionType = /** @class */ (function () {
                    function ActionType() {
                    }
                    ActionType.CancelAction = "Cancel";
                    ActionType.QueueAction = "Queue";
                    ActionType.IgnoreAction = "Ignore";
                    return ActionType;
                }());
                Model.ActionType = ActionType;
            })(Model = IntegrationConfig.Model || (IntegrationConfig.Model = {}));
        })(IntegrationConfig = Javascript.IntegrationConfig || (Javascript.IntegrationConfig = {}));
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var QueueIt;
(function (QueueIt) {
    var Javascript;
    (function (Javascript) {
        var IntegrationConfig;
        (function (IntegrationConfig) {
            function isNumber(arg) {
                var isNaN2 = function (value) {
                    return typeof value === "number" && isNaN(value);
                };
                return !isNaN2(parseFloat(arg)) && isFinite(arg);
            }
            var IntegrationPointBase = /** @class */ (function () {
                function IntegrationPointBase(model, _triggerFactory) {
                    this.model = model;
                    this._triggerFactory = _triggerFactory;
                    this.initTriggers();
                }
                IntegrationPointBase.CreateIntegrationPoint = function (model, triggerFactory) {
                    if (triggerFactory === void 0) { triggerFactory = Trigger.CreateTrigger; }
                    if (IntegrationPointBase.getActionType(model) === IntegrationConfig.Model.ActionType.QueueAction) {
                        return new IntegrationPointQueue(model, triggerFactory);
                    }
                    else if (IntegrationPointBase.getActionType(model) === IntegrationConfig.Model.ActionType.CancelAction) {
                        return new IntegrationPointCancel(model, triggerFactory);
                    }
                    else {
                        return new IntegrationPointIgnore(model, triggerFactory);
                    }
                };
                IntegrationPointBase.prototype.initTriggers = function () {
                    this._triggers = new Array();
                    for (var _i = 0, _a = this.model.triggers; _i < _a.length; _i++) {
                        var triggerModel = _a[_i];
                        this._triggers.push(this._triggerFactory(triggerModel));
                    }
                };
                IntegrationPointBase.prototype.evaluate = function () {
                    for (var _i = 0, _a = this._triggers; _i < _a.length; _i++) {
                        var trigger = _a[_i];
                        if (trigger.evaluate())
                            return true;
                    }
                    return false;
                };
                IntegrationPointBase.prototype.getActionType = function () {
                    return IntegrationPointBase.getActionType(this.model);
                };
                IntegrationPointBase.getActionType = function (model) {
                    if (model.actionType)
                        return model.actionType;
                    return IntegrationConfig.Model.ActionType.QueueAction;
                };
                return IntegrationPointBase;
            }());
            IntegrationConfig.IntegrationPointBase = IntegrationPointBase;
            var IntegrationPointQueue = /** @class */ (function (_super) {
                __extends(IntegrationPointQueue, _super);
                function IntegrationPointQueue(model, triggerFactory) {
                    return _super.call(this, model, triggerFactory) || this;
                }
                IntegrationPointQueue.prototype.getQueueClientConfig = function (customerId) {
                    var result = new IntegrationConfig.Model.QueueClientEventConfig();
                    result.eventId = this.model.eventId;
                    result.cookieDomain = this.model.cookieDomain;
                    result.culture = this.model.culture;
                    result.extendValidity = this.model.extendValidity;
                    result.layoutName = this.model.layoutName;
                    result.validity = this.model.validity;
                    if (this.model.queueDomain) {
                        result.host = this.model.queueDomain;
                    }
                    if (this.model.removeTokenFromUrl) {
                        result.removeTokenFromUrl = true;
                        result.queryStringPrefix = this.model.queryStringPrefix;
                    }
                    var that = this;
                    if (this.model.onVerified) {
                        result.onVerified = function () {
                            (function (customerId, eventId) {
                                eval(that.model.onVerified);
                            })(customerId, that.model.eventId);
                        };
                    }
                    if (this.model.onDisabled) {
                        result.onDisabled = function () {
                            (function (customerId, eventId) {
                                eval(that.model.onDisabled);
                            })(customerId, that.model.eventId);
                        };
                    }
                    if (this.model.onTimeout) {
                        result.onTimeout = function () {
                            (function (customerId, eventId) {
                                eval(that.model.onTimeout);
                            })(customerId, that.model.eventId);
                        };
                    }
                    if (this.model.redirectLogic == IntegrationConfig.Model.RedirectionLogic.EventTargetUrl || this.model.redirectLogic == 1) {
                        result.useEventTargetUrl = true;
                        result.targetUrl = null;
                    }
                    else if (this.model.redirectLogic == IntegrationConfig.Model.RedirectionLogic.ForcedTargetUrl || this.model.redirectLogic == IntegrationConfig.Model.RedirectionLogic.ForecedTargetUrl || this.model.redirectLogic == 2) {
                        result.useEventTargetUrl = false;
                        result.targetUrl = this.model.forcedTargetUrl;
                    }
                    else if (this.model.redirectLogic == IntegrationConfig.Model.RedirectionLogic.AllowTParameter || this.model.redirectLogic == 0) {
                        result.useEventTargetUrl = false;
                        result.targetUrl = null;
                    }
                    return result;
                };
                return IntegrationPointQueue;
            }(IntegrationPointBase));
            IntegrationConfig.IntegrationPointQueue = IntegrationPointQueue;
            var IntegrationPointCancel = /** @class */ (function (_super) {
                __extends(IntegrationPointCancel, _super);
                function IntegrationPointCancel(model, triggerFactory) {
                    return _super.call(this, model, triggerFactory) || this;
                }
                IntegrationPointCancel.prototype.getEventId = function () {
                    return this.model.eventId;
                };
                IntegrationPointCancel.prototype.getCookieDomain = function () {
                    return this.model.cookieDomain;
                };
                IntegrationPointCancel.prototype.getQueueDomain = function () {
                    return this.model.queueDomain;
                };
                return IntegrationPointCancel;
            }(IntegrationPointBase));
            IntegrationConfig.IntegrationPointCancel = IntegrationPointCancel;
            var IntegrationPointIgnore = /** @class */ (function (_super) {
                __extends(IntegrationPointIgnore, _super);
                function IntegrationPointIgnore(model, triggerFactory) {
                    return _super.call(this, model, triggerFactory) || this;
                }
                return IntegrationPointIgnore;
            }(IntegrationPointBase));
            IntegrationConfig.IntegrationPointIgnore = IntegrationPointIgnore;
            var Trigger = /** @class */ (function () {
                function Trigger(_triggerModel, _triggerPartFactory) {
                    //backward compatibility
                    this._triggerModel = _triggerModel;
                    this._triggerPartFactory = _triggerPartFactory;
                    this.logicalOperator = _triggerModel.logicalOperator || "And";
                    this.initOperators();
                }
                Trigger.CreateTrigger = function (model, triggerPartFactory) {
                    if (triggerPartFactory === void 0) { triggerPartFactory = ValidatorBase.CreateValidator; }
                    return new Trigger(model, triggerPartFactory);
                };
                Trigger.prototype.initOperators = function () {
                    this._expersions = new Array();
                    for (var _i = 0, _a = this._triggerModel.triggerParts; _i < _a.length; _i++) {
                        var operator = _a[_i];
                        this._expersions.push(this._triggerPartFactory(operator));
                    }
                };
                Trigger.prototype.evaluate = function () {
                    if (this.logicalOperator.toLowerCase() == "and") {
                        for (var _i = 0, _a = this._expersions; _i < _a.length; _i++) {
                            var exp = _a[_i];
                            if (!exp.evaluate())
                                return false;
                        }
                        return true;
                    }
                    else if (this.logicalOperator.toLowerCase() == "or") {
                        for (var _b = 0, _c = this._expersions; _b < _c.length; _b++) {
                            var exp = _c[_b];
                            if (exp.evaluate())
                                return true;
                        }
                        return false;
                    }
                    else
                        throw "Not supported logical operator";
                };
                return Trigger;
            }());
            IntegrationConfig.Trigger = Trigger;
            var ValidatorBase = /** @class */ (function () {
                function ValidatorBase(triggerPartModel) {
                    this.triggerPartModel = triggerPartModel;
                }
                ValidatorBase.CreateValidator = function (triggerPartModel) {
                    //backward compatibility
                    triggerPartModel.validatorType = triggerPartModel.validatorType || "UrlValidator";
                    switch (triggerPartModel.validatorType) {
                        case IntegrationConfig.Model.ValidatorType.UrlValidator:
                            return new UrlValidator(triggerPartModel);
                        case IntegrationConfig.Model.ValidatorType.CookieValidator:
                            return new CookieValidator(triggerPartModel);
                        case IntegrationConfig.Model.ValidatorType.JSVariableValidator:
                            return new JSVariableValidator(triggerPartModel);
                        case IntegrationConfig.Model.ValidatorType.UserAgentValidator:
                            return new UserAgentValidator(triggerPartModel);
                        default:
                            return new FalsyValidator(triggerPartModel);
                    }
                };
                ValidatorBase.getDocumentCookie = function () {
                    return document.cookie;
                };
                ValidatorBase.getWindowLocation = function () {
                    return window.location;
                };
                ValidatorBase.getJSVariableValue = function (variableName) {
                    return window[variableName];
                };
                ValidatorBase.getUserAgent = function () {
                    return window.navigator.userAgent;
                };
                return ValidatorBase;
            }());
            IntegrationConfig.ValidatorBase = ValidatorBase;
            var UrlValidator = /** @class */ (function (_super) {
                __extends(UrlValidator, _super);
                function UrlValidator(triggerPartModel) {
                    return _super.call(this, triggerPartModel) || this;
                }
                UrlValidator.prototype.evaluate = function () {
                    return ComparisonOperator.evaluate(this.triggerPartModel.operator, this.getUrlPart(), this.triggerPartModel.valueToCompare, this.triggerPartModel.isNegative, this.triggerPartModel.isIgnoreCase, this.triggerPartModel.valuesToCompare);
                };
                UrlValidator.prototype.getUrlPart = function () {
                    var documnetLocation = ValidatorBase.getWindowLocation();
                    switch (this.triggerPartModel.urlPart) {
                        case IntegrationConfig.Model.UrlPartSelectorType.HostName:
                            return documnetLocation.hostname;
                        case IntegrationConfig.Model.UrlPartSelectorType.PagePath:
                            return documnetLocation.pathname;
                        case IntegrationConfig.Model.UrlPartSelectorType.PageUrl:
                            return documnetLocation.href;
                        default:
                            throw "Not supported url part selector" + this.triggerPartModel.urlPart;
                    }
                };
                return UrlValidator;
            }(ValidatorBase));
            IntegrationConfig.UrlValidator = UrlValidator;
            var CookieValidator = /** @class */ (function (_super) {
                __extends(CookieValidator, _super);
                function CookieValidator(triggerPartModel) {
                    return _super.call(this, triggerPartModel) || this;
                }
                CookieValidator.prototype.evaluate = function () {
                    var cookieValue = this.getCookie(this.triggerPartModel.cookieName);
                    return ComparisonOperator.evaluate(this.triggerPartModel.operator, cookieValue, this.triggerPartModel.valueToCompare, this.triggerPartModel.isNegative, this.triggerPartModel.isIgnoreCase, this.triggerPartModel.valuesToCompare);
                };
                CookieValidator.prototype.getCookie = function (cookieName) {
                    var documentCookie = ValidatorBase.getDocumentCookie();
                    var name = cookieName + "=";
                    var ca = documentCookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) == 0) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return "";
                };
                return CookieValidator;
            }(ValidatorBase));
            IntegrationConfig.CookieValidator = CookieValidator;
            var JSVariableValidator = /** @class */ (function (_super) {
                __extends(JSVariableValidator, _super);
                function JSVariableValidator(triggerPartModel) {
                    return _super.call(this, triggerPartModel) || this;
                }
                JSVariableValidator.prototype.evaluate = function () {
                    return ComparisonOperator.evaluate(this.triggerPartModel.operator, ValidatorBase.getJSVariableValue(this.triggerPartModel.variableName), this.triggerPartModel.valueToCompare, this.triggerPartModel.isNegative, this.triggerPartModel.isIgnoreCase, this.triggerPartModel.valuesToCompare);
                };
                return JSVariableValidator;
            }(ValidatorBase));
            IntegrationConfig.JSVariableValidator = JSVariableValidator;
            var UserAgentValidator = /** @class */ (function (_super) {
                __extends(UserAgentValidator, _super);
                function UserAgentValidator(triggerPartModel) {
                    return _super.call(this, triggerPartModel) || this;
                }
                UserAgentValidator.prototype.evaluate = function () {
                    return ComparisonOperator.evaluate(this.triggerPartModel.operator, ValidatorBase.getUserAgent(), this.triggerPartModel.valueToCompare, this.triggerPartModel.isNegative, this.triggerPartModel.isIgnoreCase, this.triggerPartModel.valuesToCompare);
                };
                return UserAgentValidator;
            }(ValidatorBase));
            IntegrationConfig.UserAgentValidator = UserAgentValidator;
            var FalsyValidator = /** @class */ (function (_super) {
                __extends(FalsyValidator, _super);
                function FalsyValidator(triggerPartModel) {
                    return _super.call(this, triggerPartModel) || this;
                }
                FalsyValidator.prototype.evaluate = function () {
                    return false;
                };
                return FalsyValidator;
            }(ValidatorBase));
            IntegrationConfig.FalsyValidator = FalsyValidator;
            var ComparisonOperator = /** @class */ (function () {
                function ComparisonOperator() {
                }
                ComparisonOperator.containsAny = function (isNegative, isIgnoreCase, left, rightList) {
                    for (var _i = 0, _a = rightList || []; _i < _a.length; _i++) {
                        var right = _a[_i];
                        if (ComparisonOperator.contains(false, isIgnoreCase, left, right)) {
                            return !isNegative;
                        }
                    }
                    return isNegative;
                };
                ComparisonOperator.equalsAny = function (isNegative, isIgnoreCase, left, rightList) {
                    for (var _i = 0, _a = rightList || []; _i < _a.length; _i++) {
                        var right = _a[_i];
                        if (ComparisonOperator.equals(false, isIgnoreCase, left, right))
                            return !isNegative;
                    }
                    return isNegative;
                };
                ComparisonOperator.contains = function (isNegative, isIgnoreCase, left, right) {
                    if (right == "*")
                        return true;
                    var evaluation = false;
                    if (isIgnoreCase)
                        evaluation = left.toUpperCase().indexOf(right.toUpperCase()) > -1;
                    else
                        evaluation = left.indexOf(right) > -1;
                    if (isNegative)
                        return !evaluation;
                    else
                        return evaluation;
                };
                ComparisonOperator.equals = function (isNegative, isIgnoreCase, left, right) {
                    var evaluation = false;
                    if (isIgnoreCase)
                        evaluation = left.toUpperCase() === right.toUpperCase();
                    else
                        evaluation = left === right;
                    if (isNegative)
                        return !evaluation;
                    else
                        return evaluation;
                };
                ComparisonOperator.evaluate = function (operator, value, valueToCompare, isNegative /*nullable bcz of backward compatibility*/, isIgnoreCase /*nullable bcz of backward compatibility*/, valuesToCompare) {
                    var valueS = String(value);
                    //oldVersion does not provide isNegatvie  neither isIgnoreCase
                    if (isNegative == undefined) {
                        return this.evaluate_1_0_0_1(operator, valueS, String(valueToCompare));
                    }
                    switch (operator) {
                        case IntegrationConfig.Model.ComparisonOperatorType.Equals:
                            return ComparisonOperator.equals(isNegative, isIgnoreCase, valueS, String(valueToCompare));
                        case IntegrationConfig.Model.ComparisonOperatorType.Contains:
                            return ComparisonOperator.contains(isNegative, isIgnoreCase, valueS, String(valueToCompare));
                        case IntegrationConfig.Model.ComparisonOperatorType.ContainsAny:
                            return ComparisonOperator.containsAny(isNegative, isIgnoreCase, valueS, valuesToCompare);
                        case IntegrationConfig.Model.ComparisonOperatorType.EqualsAny:
                            return ComparisonOperator.equalsAny(isNegative, isIgnoreCase, valueS, valuesToCompare);
                        default:
                            throw "Not supported  operator : " + operator;
                    }
                };
                ComparisonOperator.evaluate_1_0_0_1 = function (operator, leftS, rightS) {
                    switch (operator) {
                        case IntegrationConfig.Model.ComparisonOperatorType.Equals:
                            return ComparisonOperator.equals(false, false, leftS, rightS);
                        case IntegrationConfig.Model.ComparisonOperatorType.NotEquals:
                            return this.equals(true, false, leftS, rightS);
                        case IntegrationConfig.Model.ComparisonOperatorType.Contains:
                            return ComparisonOperator.contains(false, false, leftS, rightS);
                        case IntegrationConfig.Model.ComparisonOperatorType.NotContains:
                            return ComparisonOperator.contains(true, false, leftS, rightS);
                        case IntegrationConfig.Model.ComparisonOperatorType.IgEquals:
                            return ComparisonOperator.equals(false, true, leftS, rightS);
                        case IntegrationConfig.Model.ComparisonOperatorType.IgContains:
                            return ComparisonOperator.contains(false, true, leftS, rightS);
                        default:
                            throw "Not supported  operator : " + operator;
                    }
                };
                return ComparisonOperator;
            }());
            IntegrationConfig.ComparisonOperator = ComparisonOperator;
            function applyIntegrationConfig(config, integrationPointFactory, getCurrentProtocol) {
                if (integrationPointFactory === void 0) { integrationPointFactory = IntegrationPointBase.CreateIntegrationPoint; }
                if (getCurrentProtocol === void 0) { getCurrentProtocol = null; }
                if (!config)
                    return;
                for (var _i = 0, _a = config.integrations; _i < _a.length; _i++) {
                    var model = _a[_i];
                    var integraionPoint = integrationPointFactory(model);
                    if (integraionPoint.evaluate()) {
                        if (integraionPoint.getActionType() === IntegrationConfig.Model.ActionType.QueueAction) {
                            var selectedConfig = integraionPoint.getQueueClientConfig(config.customerId);
                            window.myQueueClient = window.queueClient(config.customerId, selectedConfig.eventId, selectedConfig);
                        }
                        else if (integraionPoint.getActionType() === IntegrationConfig.Model.ActionType.CancelAction) {
                            var integration = integraionPoint;
                            if (!getCurrentProtocol)
                                getCurrentProtocol = function () { return window.location.protocol; };
                            var queueDomain = integration.getQueueDomain();
                            if (!queueDomain) {
                                queueDomain = config.customerId + '.queue-it.net';
                            }
                            var cookieManager = new QueueIt.Javascript.CookieManager(config.customerId, integration.getEventId(), getCurrentProtocol() + '//' + queueDomain, integration.getCookieDomain());
                            cookieManager.cancelQueueId();
                        }
                        else if (integraionPoint.getActionType() === IntegrationConfig.Model.ActionType.IgnoreAction) {
                            var en_1 = QueueIt.Tools.EnvironmentHelper.retrieveEnvInfoFromScriptTag();
                            if (en_1.intercept)
                                QueueIt.Javascript.KnownUser.UrlQueueClientInitializer.tryInitQueueClientFromToken(en_1);
                        }
                        return;
                    }
                }
                var en = QueueIt.Tools.EnvironmentHelper.retrieveEnvInfoFromScriptTag();
                if (en.intercept)
                    QueueIt.Javascript.KnownUser.UrlQueueClientInitializer.tryInitQueueClientFromToken(en);
            }
            IntegrationConfig.applyIntegrationConfig = applyIntegrationConfig;
            function loadIntegrationConfig(nowDate) {
                if (nowDate === void 0) { nowDate = new Date(); }
                var environmentInfo = QueueIt.Tools.EnvironmentHelper.retrieveEnvInfoFromScriptTag();
                if (environmentInfo.noAutorun) {
                    return;
                }
                loadIntegrationConfigFromServer(nowDate, environmentInfo);
            }
            IntegrationConfig.loadIntegrationConfig = loadIntegrationConfig;
            function loadIntegrationConfigFromServer(nowDate, environmentInfo) {
                if (nowDate === void 0) { nowDate = new Date(); }
                if (environmentInfo === void 0) { environmentInfo = null; }
                if (!environmentInfo) {
                    environmentInfo = QueueIt.Tools.EnvironmentHelper.retrieveEnvInfoFromScriptTag();
                }
                if (!environmentInfo) {
                    throw "No queueit attribute is found in script tag";
                }
                var versionTimestamp = "";
                if (!environmentInfo.noCacheRequest) {
                    var yyyy = nowDate.getFullYear();
                    var month = nowDate.getMonth() + 1; //January is 0!
                    var dd = nowDate.getDate();
                    var hh = nowDate.getHours();
                    var mm = Math.floor(nowDate.getMinutes() / 5);
                    versionTimestamp = yyyy + ''
                        + (month < 10 ? '0' + month : month) + ''
                        + (dd < 10 ? '0' + dd : dd) + ''
                        + (hh < 10 ? '0' : hh) + hh
                        + (mm < 10 ? '0' + mm : mm);
                }
                else {
                    versionTimestamp = (nowDate).getTime().toString();
                }
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = getIntegrationConfigUrl(environmentInfo) + '?versionTimestamp=' + versionTimestamp;
                document.getElementsByTagName('head')[0].appendChild(script);
            }
            IntegrationConfig.loadIntegrationConfigFromServer = loadIntegrationConfigFromServer;
            function getIntegrationConfigUrl(envInfo) {
                if (!envInfo || !envInfo.cid)
                    throw "customer id is not found";
                var configRootUrl = "https://assets.queue-it.net/";
                //should be customized for different regions
                if (envInfo.jsHost) {
                    configRootUrl = envInfo.jsHost;
                }
                return configRootUrl + envInfo.cid + "/integrationconfig/javascript/queueclientConfig.js";
            }
            //backward compatibility (javascript created by queuefront)
            QueueIt.Javascript.PageEventIntegration = { initQueueClient: applyIntegrationConfig };
            function initQueueClient(config) {
                applyIntegrationConfig(config);
            }
            IntegrationConfig.initQueueClient = initQueueClient;
            //exposing functions for SPA apps
            function validateUser(reloadConfig) {
                if (reloadConfig === void 0) { reloadConfig = false; }
                if (reloadConfig) {
                    loadIntegrationConfigFromServer();
                }
                else {
                    if (window.queueit_clientside_config) {
                        applyIntegrationConfig(window.queueit_clientside_config);
                    }
                }
            }
            function isIntegrationConfigReady() {
                if (window.queueit_clientside_config)
                    return true;
                return false;
            }
            function getIntegrationConfig() {
                return window.queueit_clientside_config;
            }
            QueueIt.validateUser = validateUser;
            QueueIt.getIntegrationConfig = getIntegrationConfig;
            QueueIt.isIntegrationConfigReady = isIntegrationConfigReady;
        })(IntegrationConfig = Javascript.IntegrationConfig || (Javascript.IntegrationConfig = {}));
    })(Javascript = QueueIt.Javascript || (QueueIt.Javascript = {}));
})(QueueIt || (QueueIt = {}));

/// <reference path="integrationconfigmanager.ts" />
var en = QueueIt.Tools.EnvironmentHelper.retrieveEnvInfoFromScriptTag();
if (en && en.cid && en.intercept) {
    QueueIt.Javascript.KnownUser.AjaxInterceptor.interceptOpen(en.domainToIntercept);
}
QueueIt.Javascript.IntegrationConfig.loadIntegrationConfig();
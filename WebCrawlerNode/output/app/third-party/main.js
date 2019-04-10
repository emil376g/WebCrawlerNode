var angular = require('angular');
var angularAnimate = require('angular-animate');
var angularScroll = require('angular-scroll');
var angularTouch = require('angular-touch');
var moment = require('moment');

/**
 * @ngdoc overview
 * @name kgl.models.calendar
 *
 * @description
 * This is a base module for general configuration and keeping
 * track of all the necesarry submodules.
 */

angular.module('dkt.core', [
    'ngAnimate',
    'ngTouch',
    'dkt.core.services.utils',
    'dkt.core.services.utils.params',
    'dkt.core.filters'
])

.provider('dktComponents', function dktComponentsProvider() {
    var host = '';
    var language = window.preferredCulture;
    var callbacks = {};

    var proxy = {
        enabled: false,
        path: './proxy.php?url='
    };

    var endpoints = {
        'events': '/%language/rdt-api/filtered-events',
        'productions': '/api/v1/productions?culture=%language',
        'localization': '/%language/api/localization/calendar',
        'cast': '/api/cast/GetPerformanceCredits?productionSeasonId=%production-id',
        'castProductions': '/api/cast/GetCastSeasonCredits?productionSeasonId=%production-id&personnelId=%personel-id&culture=%language',
        'castInformation': '/api/cast/GetCastInformation?%personel-ids',
        'getFavorites': '/api/favourites/GetFavourites?ListType=%type&StatusString=%status',
        'updateFavorites': '/api/favourites/UpdateFavourites?ListType=%type&Mode=%mode%&ProductionSeasonNumber=%production-id'
    };

    this.enableProxy = function () {
        proxy.enabled = true;
    };

    this.disableProxy = function () {
        proxy.enabled = false;
    };

    this.setHost = function (_host) {
        host = _host || '';
    };

    this.setLanguage = function (_language) {
        language = _language || 'da';
    };

    this.setEndpoint = function (name, value) {
        name = name || null;
        value = value || null;

        if (name && value) {
            endpoints[name] = value;
        }
    };

    function dktComponents() {
        this.$on = function (event, callback) {
            if (angular.isUndefined(callbacks[event])) {
                callbacks[event] = [];
            }

            callbacks[event].push(callback);
        };

        this.$trigger = function (event, parameters) {
            parameters = parameters || {};

            if (angular.isDefined(callbacks[event])) {
                for (var callback in callbacks[event]) {
                    callback = callbacks[event][callback];

                    callback(parameters);
                }
            }
        };

        this.setLanguage = function (_language) {
            if (_language !== language) {
                language = _language || 'da';

                this.$trigger('LANGUAGE_CHANGED', { 'language': _language });
            }
        };

        this.getLanguage = function () {
            return language;
        };

        this.getHost = function () {
            return host;
        };

        this.getEndpoint = function (name, replacements) {
            name = name || null;
            replacements = replacements || null;

            var endpoint = null;

            if (name && angular.isDefined(endpoints[name])) {
                endpoint = endpoints[name].split('%language').join(this.getLanguage());

                if (replacements) {
                    for (var replacement in replacements) {
                        endpoint = endpoint.split('%' + replacement).join(replacements[replacement]);
                    }
                }

                if (proxy.enabled) {
                    endpoint = proxy.path + encodeURIComponent(endpoint);
                }
            }

            return endpoint;
        };
    }

    this.$get = function () {
        return new dktComponents();
    };
})

;

/*jshint multistr: true */

/**
 * @ngdoc overview
 * @name dkt.components.cast
 *
 * @description
 * Description
 */

angular.module('dkt.components.cast', [
    'dkt.components.cast.castFilter',
    'dkt.components.cast.castList'
])

.directive('dktCastBlock', ["dktComponents", "dktCast", function (dktComponents, dktCast) {
    return {
        restrict: 'E',
        scope: {
            'productionId': '@',
            'title': '@'
        },
        replace: true,
        template:'<div class="dkt-cast-block"><dkt-spinner active="!ready"></dkt-spinner><div class="large-8 large-push-4 medium-8 medium-push-4 small-12 columns" ng-show="ready && !emptyCast"><dkt-cast-list title="{{title}}" production-id="{{productionId}}"></dkt-cast-list></div><div class="large-4 large-pull-8 medium-4 medium-pull-8 small-12 columns" ng-if="ready && !emptyCast"><dkt-cast-filter production-id="{{productionId}}"></dkt-cast-filter></div><div class="dkt-cast-no-results large-8 large-push-4 medium-8 medium-push-4 small-12 columns" ng-if="ready && emptyCast"><h2 class="block-header block-head ng-binding ng-scope">{{title}}</h2>{{\'cast.no_results\' | translate}}</div></div>',
        link: function (scope, element, attrs) {
        	scope.ready = false;
        	scope.emptyCast = false;

            var baseColor = $('.site-wrapper').css('color');
            var baseColorString = baseColor.replace('rgb(', '').replace(')', '');
            var darkColors = $('.pdp-page-wrapper.dark-color').length > 0 ? true : false;
            var buttonBorder = $('.pdp-page-wrapper.button-border').length > 0 ? true : false;
            var styleOutput = '';

            styleOutput = '\
            .dkt-datepicker .dkt-datepicker-weeks .dkt-datepicker-week .dkt-datepicker-date .dkt-datepicker-date-number.back,\
            .no-touchevents .dkt-advanced-tile .dkt-advanced-tile-btn-close:hover:before, \
            .no-touchevents .dkt-advanced-tile .dkt-advanced-tile-btn-close:hover:after,\
            .dkt-cast-filter-times .dkt-cast-filter-time.selected .front {\
                background-color: ' + baseColor + ';\
            }\
             .dkt-cast-filter-times .dkt-cast-filter-time.selected .front {\
                border-color: ' + baseColor + ';\
            }\
            .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile .dkt-advanced-tile-navigation:hover,\
            .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile:hover .text,\
            .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile:hover .dkt-advanced-tile-profile.no-image .text,\
            .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile:hover .dkt-advanced-tile-profile .dkt-advanced-tile-profile-initials {\
                color: ' + baseColor + ';\
            }\
            .dkt-cast-block .dkt-spinner .dkt-spinner-throbber:before {\
                border-top: 0.2rem solid ' + baseColor + ';\
                border-right: 0.2rem solid rgba(' + baseColorString + ', 0.4);\
                border-bottom: 0.2rem solid rgba(' + baseColorString + ', 0.4);\
                border-left: 0.2rem solid rgba(' + baseColorString + ', 0.4);\
            }';

            if (darkColors) {
                styleOutput += '\
                    .dkt-datepicker .dkt-datepicker-weeks .dkt-datepicker-week .dkt-datepicker-date.active .front, \
                    .dkt-datepicker .dkt-datepicker-weeks .dkt-datepicker-week .dkt-datepicker-date.active .back {\
                        font-weight: 700;\
                    }\
                    .dkt-datepicker .dkt-datepicker-weeks .dkt-datepicker-week .dkt-datepicker-date .dkt-datepicker-date-number.back,\
                    .dkt-cast-filter-times .dkt-cast-filter-time.selected .front {\
                        color: inherit !important;\
                    }\
                    .no-touchevents .dkt-cast-filter .dkt-cast-filter-acts > span:hover,\
                    .no-touchevents .dkt-cast-filter .dkt-filter > ul > li > label:hover span,\
                    .no-touchevents .dkt-cast-filter .dkt-filter > ul > li > label:hover:after,\
                    .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile:hover .dkt-advanced-tile-profile.no-image .text,\
                    .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile:hover .dkt-advanced-tile-profile .dkt-advanced-tile-profile-initials, \
                    .dkt-cast-filter .dkt-filter > ul > li > label.active,\
                    .no-touchevents .dkt-datepicker .dkt-datepicker-header .dkt-datepicker-navigation:hover,\
                    .no-touchevents .dkt-cast-filter .dkt-cast-filter-acts .options .options-container .dkt-dropdown-simple-item:hover,\
                    .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile .dkt-advanced-tile-info .dkt-cast-production-credits a.dkt-cast-production-credits-item:hover,\
                    .no-touchevents .dkt-cast-list .dkt-advanced-tiles .dkt-advanced-tile .dkt-advanced-tile-info .dkt-cast-info-readmore:hover,\
                    .no-touchevents .dkt-cast-list .dkt-cast-listing-container .dkt-cast-listing-item a:hover,\
                    .dkt-cast-filter .dkt-cast-filter-acts.active > span {\
                        color: #bbb; \
                    }\
                    .no-touchevents .dkt-advanced-tiles.tile-selected .dkt-advanced-tile:hover .text {\
                        color: #fff; \
                    }\
                    .no-touchevents .dkt-cast-filter .dkt-filter > ul > li > label:hover:before,\
                    .dkt-cast-filter .dkt-filter > ul > li > label.active:before {\
                        border-color: #bbb;\
                    }\
                    .no-touchevents .dkt-cast-filter-times .dkt-cast-filter-time .front:hover {\
                        background-color: #f2f2f2;\
                    }\
                    .no-touchevents .dkt-cast-filter-times .dkt-cast-filter-time.selected .front:hover {\
                        background-color: ' + baseColor + ';\
                    }\
                ';
            }

            if (buttonBorder) {
                styleOutput += '\
                    .dkt-datepicker .dkt-datepicker-weeks .dkt-datepicker-week .dkt-datepicker-date.active.selected .dkt-datepicker-date-number.back {\
                        border: 1px solid #575757;\
                    }\
                    .dkt-cast-filter-times .dkt-cast-filter-time.selected .front {\
                        border-color: #575757;\
                    }\
                ';
            }

            styleOutput = '<style type="text/css">' + styleOutput + '</style>';

            $(element).append(styleOutput);

        	scope.$on('CAST_READY', function(e, cast) {
        		if (cast.length === 0) {
        			scope.emptyCast = true;
        		}

        		scope.ready = true;
        	});
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.calendar
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar', [
    'duScroll',
    'dkt.core',
    'dkt.core.services.events',
    'dkt.core.services.localization',
    'dkt.components.calendar.calendarFilterBar',
    'dkt.components.calendar.calendarMonth'
])

.directive('dktCalendar', ["$window", "$timeout", "$document", "dktEvents", "dktLocalization", "dktParams", "dktComponents", "dktUtils", function ($window, $timeout, $document, dktEvents, dktLocalization, dktParams, dktComponents, dktUtils) {
    return {
        restrict: 'E',
        scope: {
            'initialLimit': '@',
            'infiniteScrollLimit': '@',
            'infiniteScrollOffset': '@'
        },
        replace: true,
        template:'<div class="dkt-calendar" ng-class="{\'ready\': ready}"><dkt-calendar-filter-bar></dkt-calendar-filter-bar><div class="calendar-list"><dkt-calendar-month month="{{monthId}}" dates="month.dates" total-events="{{month.totalEvents}}" ng-repeat="(monthId, month) in events"></dkt-calendar-month><div class="no-results" ng-if="noResults && ready"><div class="description">{{noResultsDescription}}</div><div class="btn btn-all-results" ng-click="resetDate()" ng-if="resultsOutsideRange.count > 0" ng-bind-html="resultsOutsideRange.text | html"></div></div></div><div class="calendar-loader-overlay" ng-if="loader.active && loader.overlay"></div><div class="dkt-spinner-element" ng-class="{\'overlay\': loader.overlay}" ng-if="loader.active"></div></div>',
        link: function (scope, element, attrs) {
            var limit = angular.isDefined(scope.initialLimit) ? parseInt(scope.initialLimit, 10) : 20;
            var loaded = 0;
            var currentDate = new Date();
            var today = new Date();
            var lastScrollPosition = 0;
            var noMoreResults = false;
            var filtersReady = false;
            var filtersReadyTrigger = null;

            currentDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() <= 8 ? '0' : '') + (currentDate.getMonth() + 1) + '-' + (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();

            if (dktParams.get('start')) {
                var startDate = dktParams.get('start').split('-');

                currentDate = startDate[1] + '-' + (parseInt(startDate[0], 10) <= 9 ? '0' : '') + startDate[0] + '-' + (today.getMonth() - 1 === parseInt(startDate[0], 10) ? (today.getDate() < 10 ? '0' : '') + today.getDate() : '01');
            }

            scope.events = {};
            scope.localization = {};
            scope.ready = false;
            scope.noResults = false;
            scope.noResultsDescription = dktLocalization.getItem('event', 'no_results');
            scope.resultsOutsideRange = {
                count: 0,
                text: ''
            };

            scope.loader = {
                active: false,
                overlay: false
            };

            scope.resetDate = function () {
                dktParams.unset('start');
            };

            scope.$on('FILTERS_READY', function () {
                filtersReady = true;

                if (filtersReadyTrigger) {
                    filtersReadyTrigger();

                    filtersReadyTrigger = null;
                }
            });

            var scrollEvent = function () {
                if (!scope.noResults && !noMoreResults) {
                    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    var scrollY = (window.innerHeight + scrollTop);
                    scrollY += parseInt(scope.infiniteScrollOffset, 10);

                    if (scope.loader.active) {
                        lastScrollPosition = scrollY;

                        return;
                    }

                    if (scrollY >= document.body.scrollHeight && scrollY > lastScrollPosition) {
                        limit += angular.isDefined(scope.infiniteScrollLimit) ? parseInt(scope.infiniteScrollLimit, 10) : 10;

                        scope.loader.active = true;

                        loadEvents(function () {
                            scope.loader.active = false;
                        });
                    }

                    lastScrollPosition = scrollY;
                    scrollY = null;
                }
            };

            angular.element($window).bind('scroll', scrollEvent);

            var loadEvents = function (callback, clear, preCallback) {
                callback = callback || null;
                clear = clear || false;
                preCallback = preCallback || null;

                scope.noResults = false;
                noMoreResults = false;

                var existingEventsCount = dktUtils.object.count(scope.events);
                var options = {
                    'host': dktComponents.getHost(),
                    'index': loaded,
                    'count': limit - loaded,
                    'startDate': currentDate,
                    'endDate': '2050-01-01'
                };

                dktEvents.get(
                    options,
                    clear ? {} : scope.events,
                    function (events, reachedEnd) {
                        loaded = this.limit;

                        if (dktUtils.object.count(events) > 0) {
                            scope.noResults = false;

                            if (callback) {
                                callback();
                            }
                        } else {
                            checkForAllResults(callback);
                        }

                        noMoreResults = reachedEnd;

                        if (this.clear) {
                            scope.events = {};

                            $timeout(function () {
                                scope.events = events;
                            }, 400);
                        }
                    }.bind({ 'limit': limit, 'clear': clear }),
                    function () {
                        if (preCallback) {
                            preCallback();
                        }
                    }
                );

                return true;
            };

            var checkForAllResults = function (callback) {
                callback = callback || null;

                var selectedStartDate = dktParams.get('start');

                if (selectedStartDate && selectedStartDate !== (today.getMonth() + 1) + '-' + today.getFullYear()) {
                    var startDate = today.getFullYear() + '-' + (today.getMonth() <= 8 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate();
                    var options = {
                        'host': dktComponents.getHost(),
                        'index': 0,
                        'count': 1000,
                        'startDate': startDate,
                        'endDate': '2050-01-01'
                    };

                    dktEvents.count(
                        options,
                        function (count) {
                            scope.resultsOutsideRange.count = count;
                            scope.resultsOutsideRange.text = dktLocalization.getItem('event', 'results_outside_range').split('%count').join('<b>' + count + '</b>');

                            if (count > 0) {
                                scope.noResultsDescription = dktLocalization.getItem('event', 'no_results_date_range');
                            } else {
                                scope.noResultsDescription = dktLocalization.getItem('event', 'no_results');
                            }

                            $timeout(function () {
                                scope.noResults = true;

                                if (callback) {
                                    callback();
                                }
                            });
                        }
                    );

                    startDate = null;
                    options = null;
                } else {
                    scope.noResultsDescription = dktLocalization.getItem('event', 'no_results');

                    scope.resultsOutsideRange.count = 0;

                    scope.noResults = true;

                    if (callback) {
                        callback();
                    }
                }
            };

            var urlListener = scope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
                dktParams.reload();

                if (filtersReady) {
                    var newFilter = dktParams.getAllFilters();
                    var existingFilter = dktEvents.getDataFilter();

                    existingFilter = existingFilter || {};
                    newFilter = newFilter || {};

                    if (angular.toJson(newFilter) !== angular.toJson(existingFilter)) {
                        $document.scrollTopAnimated(0);

                        if (dktParams.get('id')) {
                            dktParams.set('id', '');
                        }
                        //dktParams.set('start', null);

                        //currentDate = new Date();
                        //currentDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() <= 8 ? '0' : '') + (currentDate.getMonth() + 1) + '-' + (currentDate.getDate() <= 10 ? '0' : '') + currentDate.getDate();

                        scope.loader.overlay = true;
                        scope.loader.active = true;

                        limit = angular.isDefined(scope.initialLimit) ? parseInt(scope.initialLimit, 10) : 20;
                        loaded = 0;

                        dktEvents.setFilter(newFilter);

                        loadEvents(function () {
                            $timeout(function () {
                                scope.loader.overlay = false;
                                scope.loader.active = false;
                            }, 400, false);
                        }, true, function () {
                        });
                    } else {
                        var paramDate = dktParams.get('start');
                        var newDate;

                        if (paramDate) {
                            newDate = paramDate.split('-');
                            newDate = newDate[1] + '-' + (parseInt(newDate[0], 10) <= 9 ? '0' : '') + newDate[0] + '-' + (today.getMonth() - 1 === parseInt(newDate[0], 10) ? (today.getDate() < 10 ? '0' : '') + today.getDate() : '01');
                        } else {
                            newDate = new Date();
                            newDate = newDate.getFullYear() + '-' + (newDate.getMonth() <= 8 ? '0' : '') + (newDate.getMonth() + 1) + '-' + (newDate.getDate() < 10 ? '0' : '') + newDate.getDate();
                        }

                        if (newDate !== currentDate) {
                            $document.scrollTopAnimated(0);

                            dktParams.set('id', '');

                            scope.loader.overlay = true;
                            scope.loader.active = true;

                            limit = angular.isDefined(scope.initialLimit) ? parseInt(scope.initialLimit, 10) : 20;
                            loaded = 0;

                            currentDate = newDate;

                            loadEvents(function () {
                                $timeout(function () {
                                    scope.loader.overlay = false;
                                    scope.loader.active = false;
                                }, 400, false);
                            }, true, function () {
                            });
                        }
                    }
                }
            });

            // Listen on destroy, to clean up the module when it gets removed.
            scope.$on('$Destroy', function () {
                // Unbind scroll event
                angular.element($window).unbind('scroll', scrollEvent);

                // Destroy the url listener $on-event
                urlListener();
            });

            // Initialise the calendar and load the necessary data.
            function init() {
                $document.scrollTopAnimated(0);

                scope.loader.overlay = true;
                scope.loader.active = true;
                filtersReady = false;
                filtersReadyTrigger = null;

                // Load the default month view
                dktLocalization.init({}, function (localization) {
                    filtersReadyTrigger = function () {
                        $document.scrollTopAnimated(0);

                        scope.loader.overlay = true;
                        scope.loader.active = true;

                        limit = angular.isDefined(scope.initialLimit) ? parseInt(scope.initialLimit, 10) : 20;
                        loaded = 0;

                        dktEvents.setFilter(dktParams.getAllFilters());
                        scope.events = {};

                        loadEvents(function () {
                            scope.ready = true;
                            scope.loader.overlay = false;
                            scope.loader.active = false;
                        }, false, function () {
                        });
                    };

                    if (filtersReady) {
                        filtersReadyTrigger();
                    }
                }, true);
            }

            init();
        }
    };
}])
;

/**
 * @ngdoc overview
 * @name dkt.components.shows
 *
 * @description
 * Description
 */

angular.module('dkt.components.shows', [
    'dkt.core.services.localization',
    'dkt.core.services.productions',
    'dkt.core.services.favorites',
    'dkt.components.misc.slideshow',
    'dkt.components.misc.tiles',
    'dkt.components.misc.filter',
    'dkt.core.services.utils.images'
])

.directive('dktShows', ["$timeout", "dktProductions", "dktLocalization", "dktFavorites", "dktParams", function ($timeout, dktProductions, dktLocalization, dktFavorites, dktParams) {
    return {
        restrict: 'E',
        scope: {
        },
        replace: true,
        template:'<div class="dkt-shows" ng-class="{\'ready\': ready}"><div class="modal-wrapper modal-generic modal-wrapper-js" ng-class="{\'modal-open\': modal === \'NOT_LOGGED_IN\'}" data-modal-id="modal-not-logged-in"><div class="modal modal-js"><a class="close-modal close-modal-js" ng-click="hideModal()"><svg class="D-close-big"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#D-close-big"></use></svg></a><div class="modal-inner"><div class="wysiwyg"><h2>{{\'misc.not_logged_in_headline\' | translate}}</h2><p>{{\'misc.not_logged_in_message\' | translate}}</p><a class="button" href="/account/login/">{{\'misc.not_logged_in_button\' | translate}}</a></div></div></div></div><dkt-slideshow elements="slideshow" ng-if="slideshow" double-sided="true" interval="6000" ratio="0.304" bullets-enabled="true"></dkt-slideshow><dkt-filter title="{{title}}" choose-all="Alle" elements="categories" name="type"></dkt-filter><dkt-tiles elements="productions" grid="{{grid}}" ng-if="!noFavorites.enabled"></dkt-tiles><div class="dkt-shows-no-results" ng-if="noFavorites.enabled"><h2 class="dkt-shows-no-results-title" ng-bind-html="noFavorites.title | html"></h2><span class="dkt-shows-no-results-message" ng-bind-html="noFavorites.message | html"></span></div><div class="dkt-spinner-overlay solid" ng-if="loader.active"></div><div class="dkt-spinner-element" ng-if="loader.active"></div></div>',
        link: function (scope, element, attrs) {
            var init = true;
            var oldTypes = dktParams.getFilter('type');

            scope.loader = {
                active: true
            };

            scope.ready = false;
            scope.grid = 'grid-' + Math.ceil(Math.random() * 4);
            scope.categories = [];
            scope.slideshow = window.bootStrappedData.SlideshowItems;
            scope.modal = '';
            scope.noFavorites = {
                enabled: false,
                title: dktLocalization.getItem('misc', 'no_favorites_title', true),
                message: dktLocalization.getItem('misc', 'no_favorites_message', true)
            };

            scope.tiles = [];
            scope.productions = [];

            scope.$on('SHOW_MODAL', function(e, type) {
                scope.modal = type;
            });

            scope.$on('HIDE_MODAL', function(e) {
                scope.modal = '';
            });

            scope.hideModal = function() {
                scope.modal = '';
            };

            function getProductions(noDelay, cache) {
                noDelay = noDelay || false;
                cache = cache || false;

                scope.productions = [];

                dktProductions.get({}, function (_productions) {
                    var productions = [];
                    var productionIndex;
                    var production;
                    var typeFilter = dktParams.getFilter('type');
                    var titleFilter = dktParams.getFilter('title');
                    var isFavorites = false;

                    if (typeFilter) {
                        typeFilter = typeFilter.split(',');
                    } else {
                        var categoryOptions = dktLocalization.getItem('productionFilters');

                        for (var categoryItem in categoryOptions) {
                            if (
                                angular.isDefined(categoryOptions[categoryItem].name) &&
                                angular.isDefined(categoryOptions[categoryItem].value) &&
                                (categoryOptions[categoryItem].name.toLowerCase() === 'all' || categoryOptions[categoryItem].name.toLowerCase() === 'alle')
                                ) {
                                typeFilter = categoryOptions[categoryItem].value.split(',');
                            }
                        }
                    }

                    if (typeFilter.length > 0) {
                        for (var filterItem in typeFilter) {
                            if (typeFilter[filterItem].indexOf('favorit') !== -1) {
                                typeFilter.splice(filterItem);

                                isFavorites = true;
                            }
                        }
                    }

                    if (typeFilter.length === 0) {
                        typeFilter = null;
                    }

                    if (titleFilter) {
                        titleFilter = titleFilter.split(',');
                    } else {
                        titleFilter = '';
                    }

                    for (productionIndex in _productions) {
                        production = _productions[productionIndex];
                        if ((
                                (!typeFilter || typeFilter.indexOf(production.performanceType.toLowerCase()) !== -1) &&
                                (!titleFilter || titleFilter === '' || titleFilter.indexOf(production.productionSeasonNumber.toString()) !== -1)
                            ) &&
                            production.showReadMoreButton && production.detailsLink !== '') {
                            productions.push({
                                'id': production.productionSeasonNumber,
                                'index': productionIndex,
                                'image': '',
                                'imageMobileHeroUrl': production.imageMobileHeroUrl,
                                'imageThumbnailUrl': production.imageThumbnailUrl,
                                'imageHeroUrl': production.imageHeroUrl,
                                'label': production.category,
                                'link': production.detailsLink,
                                'link_target': '_self',
                                'text': production.title,
                                'preferedFormat': production.preferredListingImageFormat
                            });
                        }
                    }

                    productions = sortProductions(productions);

                    $timeout(function () {
                        scope.loader.active = false;
                        scope.ready = true;
                    }, 200);

                    $timeout(function () {
                        scope.productions = this;

                        init = false;
                    }.bind(productions), (noDelay ? 0 : 600));

                    _productions = null;
                    productions = null;
                    productionIndex = null;
                    production = null;
                    typeFilter = null;
                    titleFilter = null;
                }, cache);
            }

            function sortProductions(productions) {
                var preferedFormat;
                var tileCount = 0;
                var productionsToFill = productions.slice();
                var gridCount = 1;
                var sortedProductions = [];
                var foundPreferedFormat = false;
                var preferedProductionFormat;

                for (tileCount = 0; tileCount < productions.length; tileCount++) {
                    preferedFormat = 'lowlight';
                    foundPreferedFormat = false;

                    if (scope.grid === 'grid-1' && (gridCount === 1 || gridCount === 7 || gridCount === 8)) {
                        preferedFormat = 'highlight';
                    } else if (scope.grid === 'grid-2' && (gridCount === 1 || gridCount === 3 || gridCount === 5)) {
                        preferedFormat = 'highlight';
                    } else if (scope.grid === 'grid-3' && (gridCount === 3 || gridCount === 5 || gridCount === 6 || gridCount === 7 || gridCount === 8)) {
                        preferedFormat = 'highlight';
                    } else if (scope.grid === 'grid-4' && (gridCount === 1 || gridCount === 2 || gridCount === 6 || gridCount === 8 || gridCount === 10)) {
                        preferedFormat = 'highlight';
                    } else if (scope.grid === 'grid-5' && (gridCount === 1 || gridCount === 7)) {
                        preferedFormat = 'highlight';
                    }

                    for (var element in productionsToFill) {
                        preferedProductionFormat = productionsToFill[element].preferedFormat;

                        if (preferedProductionFormat === preferedFormat || preferedProductionFormat === 'standard') {
                            sortedProductions.push(productionsToFill.splice(element, 1)[0]);

                            foundPreferedFormat = true;

                            break;
                        }
                    }

                    if (!foundPreferedFormat && productionsToFill.length > 0) {
                        sortedProductions.push(productionsToFill.splice(productionsToFill.length - 1, 1)[0]);
                    }

                    gridCount++;

                    if ((scope.grid === 'grid-1' || scope.grid === 'grid-3' || scope.grid === 'grid-4') && gridCount > 10) {
                        gridCount = 1;
                    } else if (scope.grid === 'grid-2' && gridCount > 6) {
                        gridCount = 1;
                    } else if (scope.grid === 'grid-5' && gridCount > 11) {
                        gridCount = 1;
                    }
                }

                return sortedProductions;
            }

            function checkFavorites() {
                var type = dktParams.getFilter('type');
                var title = dktParams.getFilter('title');

                if (type && (type.indexOf('favorit') !== -1 || type.indexOf('favourit') !== -1) && (!title || title === '')) {
                    scope.noFavorites.enabled = true;
                } else {
                    scope.noFavorites.enabled = false;
                }
            }

            dktLocalization.init({}, function (localization) {
                var categoryOptions = dktLocalization.getItem('productionFilters');
                var type = dktParams.getFilter('type');
                var categoryItem;

                scope.title = dktLocalization.getItem('misc', 'shows_filter_title');
                scope.loader.active = true;

                if (!type || type === '' && categoryOptions && categoryOptions.length > 0) {
                    //dktParams.setFilter('type', categoryOptions[0].value);
                }

                if (categoryOptions && angular.isArray(categoryOptions)) {
                    categoryOptions.splice(0, 0, {name: '&heart; Favoritter', 'value': 'favoritter', 'order': 0});
                }

                for (categoryItem in categoryOptions) {
                    if (
                        angular.isDefined(categoryOptions[categoryItem].name) &&
                        angular.isDefined(categoryOptions[categoryItem].value) &&
                        (categoryOptions[categoryItem].name.toLowerCase() === 'all' || categoryOptions[categoryItem].name.toLowerCase() === 'alle')
                        ) {
                        categoryOptions.splice(categoryItem, 1);
                    }
                }

                dktFavorites.get( function() {
                    if (this && angular.isArray(this)) {
                        for (categoryItem in this) {
                            if (this[categoryItem].value.indexOf('favorit') !== -1 || this[categoryItem].value.indexOf('favourit') !== -1) {
                                if (!dktFavorites.loggedIn) {
                                    this.splice(categoryItem, 1);
                                } else {
                                    this[categoryItem].name = this[categoryItem].name.replace('\u2665', '<span class="icon-heart"></span>');
                                    this[categoryItem].name = this[categoryItem].name.replace('&heart;', '<span class="icon-heart"></span>');
                                    this[categoryItem].name = this[categoryItem].name.replace('♥', '<span class="icon-heart"></span>');
                                }
                            }
                        }
                    }

                    if (dktFavorites.loggedIn && type && (type.indexOf('favorit') !== -1 || type.indexOf('favourit') !== -1)) {
                        dktFavorites.setFilter();
                    }

                    scope.categories = this;

                    getProductions();
                    checkFavorites();
                }.bind(categoryOptions));

                localization = null;
                categoryOptions = null;
            });

            var urlListener = scope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (!init) {
                    var type = dktParams.getFilter('type');

                    if (oldTypes !== type) {
                        getProductions(true, true);

                        checkFavorites();
                    }

                    oldTypes = type;
                }
            });
        }
    };
}])
;

/**
 * @ngdoc overview
 * @name dkt.core.services.cast
 *
 * @description
 * This data-model handles loading and
 * parsing the data for the cast API.
 */

angular.module('dkt.core.services.cast', [
    'dkt.core',
    'dkt.core.services.data',
    'dkt.core.services.localization'
])

.factory('dktCast', ["dktData", "dktComponents", "dktLocalization", "dktUtils", function (dktData, dktComponents, dktLocalization, dktUtils) {
    var service = {
        loaded: false,
        loading: false,
        cast: [],
        filters: {
            titles: [],
            dates: []
        }
    };

    var callbacks = {};
    var filteredCast = [];

    service.get = function(productionID, filters, callback) {
        // Check if the parameter is defined and if not set the variable to null.
        productionID = productionID || null;
        callback = callback || null;
        filters = filters || {};

        if (callback) {
            if (angular.isUndefined(callbacks.get)) {
                callbacks.get = [];
            }

            callbacks.get.push(callback);
        }

        if (productionID && !service.loading) {
            if (service.loaded) {
                filteredCast = filterCast(service.cast, filters);
                handleCallbacks('get', filteredCast);
            } else {
                service.loading = true;

                dktData.get(dktComponents.getEndpoint('cast', {'production-id': productionID}), {}).then(function success(response) {
                    if (response.data) {
                        service.cast = parseCast(response.data);
                        filteredCast = filterCast(service.cast, this.filters);

                        handleCallbacks('get', filteredCast);

                        service.loaded = true;
                        service.loading = false;
                    }
                }.bind({filters: filters}), function error(response) {

                });
            }
        }
    };

    service.getSpecificCast = function(personelIDs, callback) {
        // Check if the parameter is defined and if not set the variable to null.
        personelIDs = personelIDs || null;
        callback = callback || null;

        if (personelIDs) {
            var personelIdString = '';
            var listingFormats = {};

            personelIDs = personelIDs.split(',');

            for (var nr in personelIDs) {
                if (nr > 0) {
                    personelIdString += '&';
                }

                if (personelIDs[nr].indexOf('|') !== -1) {
                    personelIDs[nr] = personelIDs[nr].split('|');

                    listingFormats[personelIDs[nr][0]] = personelIDs[nr][1];

                    personelIdString += 'personnelIds=' + personelIDs[nr][0];
                } else {
                    listingFormats[personelIDs[nr]] = 3;

                    personelIdString += 'personnelIds=' + personelIDs[nr];
                }
            }

            dktData.get(dktComponents.getEndpoint('castInformation', {'personel-ids': personelIdString}), {}).then(function success(response) {
                if (response.data) {
                    if (callback) {
                        callback(parseCast(response.data, listingFormats));
                    }
                }
            }, function error(response) {

            });
        }
    };

    service.getProductions = function(productionID, personelID, callback) {
        // Check if the parameter is defined and if not set the variable to null.
        productionID = productionID || 0;
        personelID = personelID || null;
        callback = callback || null;

        if (personelID) {
            dktData.get(dktComponents.getEndpoint('castProductions', {'production-id': productionID, 'personel-id': personelID}), {}).then(function success(response) {
                if (response.data) {
                    if (callback) {
                        callback(response.data);
                    }
                }
            }, function error(response) {

            });
        }
    };

    function filterCast(data, filters) {
        var filteredCast = [];
        var castCount;
        var castItem;
        var include;
        var hasCreditTitle;
        var roles = [];

        var dateFilter = (angular.isDefined(filters.date) && filters.date && filters.date !== '' ? filters.date : null);
        var timeFilter = (angular.isDefined(filters.time) && filters.time && filters.time !== '' ? filters.time : null);

        var performanceDateArray = null;

        filters = angular.copy(filters);
        for (castCount in data) {
            include = true;
            hasCreditTitle = true;
            roles = [];
            castItem = data[castCount];

            if (dateFilter) {
                if (angular.isUndefined(castItem.dates[dateFilter])) {
                    include = false;
                } else {
                    if (timeFilter) {
                        if (castItem.dates[filters.date].times.indexOf(timeFilter) === -1) {
                            include = false;
                        }
                    }
                }
            }

            if (angular.isDefined(filters.title) && filters.title && filters.title !== '') {
                hasCreditTitle = false;

                for (var performance in castItem.performances) {
                    performance = castItem.performances[performance];
                    performanceDateArray = performance.performanceDate.toLowerCase().split('t');

                    if ((!dateFilter || dateFilter === performanceDateArray[0]) && (!timeFilter || timeFilter === performanceDateArray[1].substring(0, performanceDateArray[1].length - 3))) {
                        if (performance.creditTitle.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/ig,'') === filters.title) {
                            hasCreditTitle = true;

                            if (angular.isDefined(castItem.roleMap[performance.creditTitle]) && roles.indexOf(castItem.roleMap[performance.creditTitle]) === -1) {
                                roles.push(castItem.roleMap[performance.creditTitle]);
                            }
                        }
                    }
                }
            }

            if (roles.length > 0) {
                roles.sort();
                castItem.roles = roles.join(', ');
            } else {
                castItem.roles = castItem.roleList.join(', ');
            }

            if (!hasCreditTitle) {
                include = false;
            }

            if (include) {
                filteredCast.push(castItem);
            }
        }

        return filteredCast;
    }

    function parseCast(data, listingFormats) {
        listingFormats = listingFormats || null;

        var castCount;
        var castItem;
        var newCastItem;

        for (castCount in data) {
            castItem = data[castCount];

            newCastItem = {};

            if (angular.isDefined(castItem.artistNumber)) {
                castItem.artistId = castItem.artistNumber;
            }

            if (angular.isDefined(castItem.name)) {
                castItem.artistName = castItem.name;
            }

            if (angular.isDefined(castItem.imageUrl)) {
                castItem.artistImageUrl = castItem.imageUrl;
            }

            if (angular.isDefined(castItem.artistUrl)) {
                castItem.artistPageUrl = castItem.artistUrl;
            }

            newCastItem.id = castItem.artistId;
            newCastItem.name = castItem.artistName;
            newCastItem.roles = '';
            newCastItem.roleList = []; //castItem.roleName;
            newCastItem.roleMap = {};
            newCastItem.description = castItem.artistBio;
            newCastItem.readmoreLink = castItem.artistPageUrl && castItem.artistPageUrl !== '' ? dktComponents.getHost() + castItem.artistPageUrl : '';
            newCastItem.personelId = castItem.personnelId;
            newCastItem.productionId = castItem.productionSeasonID;
            newCastItem.performances = castItem.performances;
            newCastItem.creditTitle = []; //castItem.creditTitle;

            if (listingFormats) {
                castItem.artistImageSize = parseInt(listingFormats[newCastItem.personelId], 10);
            }

            switch(castItem.artistImageSize) {
                case 0:
                    newCastItem.preferredListingImageFormat = 'none';
                break;
                case 1:
                    newCastItem.preferredListingImageFormat = 'text';
                break;
                case 2:
                    newCastItem.preferredListingImageFormat = 'standard';
                break;
                case 3:
                    newCastItem.preferredListingImageFormat = 'portrait';
                break;
                case 4:
                    newCastItem.preferredListingImageFormat = 'landscape';
                break;
                default:
                    newCastItem.preferredListingImageFormat = 'standard';
                break;
            }

            newCastItem.imageMobileHeroUrl = castItem.artistImageUrl && castItem.artistImageUrl !== '' ? dktComponents.getHost() + castItem.artistImageUrl : '';
            newCastItem.imageThumbnailUrl = castItem.artistImageUrl && castItem.artistImageUrl !== '' ? dktComponents.getHost() + castItem.artistImageUrl : '';
            newCastItem.imageHeroUrl = castItem.artistImageUrl && castItem.artistImageUrl !== '' ? dktComponents.getHost() + castItem.artistImageUrl : '';


            if (angular.isDefined(castItem.performances) && castItem.performances && castItem.performances.length > 0) {
                var performanceDateArray;

                newCastItem.dates = {};

                for (var performance in castItem.performances) {
                    performance = castItem.performances[performance];

                    if (angular.isDefined(performance.roleName) && newCastItem.roleList.indexOf(performance.roleName) === -1) {
                        newCastItem.roleList.push(performance.roleName);
                        newCastItem.roleMap[performance.creditTitle] = performance.roleName;
                    }

                    if (angular.isDefined(performance.creditTitle) && newCastItem.creditTitle.indexOf(performance.creditTitle) === -1) {
                        newCastItem.creditTitle.push(performance.creditTitle);
                    }

                    if (performance.performanceDate && performance.performanceDate !== '') {
                        performanceDateArray = performance.performanceDate.toLowerCase().split('t');

                        if (angular.isUndefined(service.filters.dates[performanceDateArray[0]])) {
                            service.filters.dates[performanceDateArray[0]] = {
                                date: performanceDateArray[0],
                                times: []
                            };
                        }

                        if (angular.isUndefined(newCastItem.dates[performanceDateArray[0]])) {
                            newCastItem.dates[performanceDateArray[0]] = {
                                date: performanceDateArray[0],
                                times: []
                            };
                        }

                        if (performanceDateArray.length > 1) {
                            if (service.filters.dates[performanceDateArray[0]].times.indexOf(performanceDateArray[1].substring(0, performanceDateArray[1].length - 3)) === -1) {
                                service.filters.dates[performanceDateArray[0]].times.push(performanceDateArray[1].substring(0, performanceDateArray[1].length - 3));
                            }

                            newCastItem.dates[performanceDateArray[0]].times.push(performanceDateArray[1].substring(0, performanceDateArray[1].length - 3));
                        }
                    }
                }
            }

            if (newCastItem.roleList.length > 0) {
                newCastItem.roleList.sort();

                newCastItem.roles = newCastItem.roleList.join(', ');
            }

            if (newCastItem.creditTitle.length > 0) {
                for (var creditTitle in newCastItem.creditTitle) {
                    creditTitle = newCastItem.creditTitle[creditTitle];

                    if (service.filters.titles.indexOf(creditTitle) === -1) {
                        service.filters.titles.push(creditTitle);
                    }
                }
            }

            data[castCount] = newCastItem;
        }

        category = null;

        return data;
    }

    function handleCallbacks(name, parameters) {
        name = name || null;
        parameters = parameters || null;

        if (name && angular.isDefined(callbacks[name]) && callbacks[name].length > 0) {
            var callback;

            for (callback in callbacks[name]) {
                callback = callbacks[name][callback];

                if (angular.isFunction(callback)) {
                    callback(parameters);
                }
            }

            callbacks[name] = [];
        }
    }

    return service;
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.services.data
 *
 * @description
 * A general data-layer containing a service handling all requests of external data.
 * This service should only be called from data-models.
 */


angular.module('dkt.core.services.data', [])

.factory('dktData', ["$http", "dktUtils", function($http, dktUtils) {
    var service = {};

    service.get = function(url, data) {
        data = data || {};

        return $http.get(url, {
            params: data,
            timeout: 99000
        });
    };

    service.post = function(url, data, headers, json, method) {
        data = data || {};
        headers = headers || {};
        json = json || false;
        method = method || 'POST';

        if (json) {
            headers['Content-Type'] = 'application/json';
            data = angular.toJson(data);
        } else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            data = dktUtils.object.serialize(data);
        }

        return $http({
            url: url,
            method: method,
            data: data,
            headers: headers,
            timeout: 99000
        });
    };

    service.jsonp = function(url, data) {
        data = data || null;

        var options = {};

        if (data) {
            options.data = data;
        }

        return $http.jsonp(url, options);
    };

    service.remove = function(url, data) {
        data = data || {};

        return $http({
            url: url,
            method: "DELETE",
            data: data,
            timeout: 99000
        });
    };

    return service;
}]);

/**
 * @ngdoc overview
 * @name dkt.core.services.events
 *
 * @description
 * This data-model handles loading and
 * parsing the data for the events API.
 */

angular.module('dkt.core.services.events', [
    'dkt.core',
    'dkt.core.services.data',
    'dkt.core.services.localization'
])

.constant('dktEventsConfig', {
    "venues": {
        12: { "venueId": 12, "name": "Gamle Scene" },
        13: { "venueId": 13, "name": "Skuespilhuset, Lille Scene" },
        15: { "venueId": 15, "name": "Operaen,Takkelloftet" },
        76: { "venueId": 76, "name": "Operaen, Store Scene" },
        77: { "venueId": 77, "name": "Skuespilhuset, Det R\u00f8de Rum" },
        78: { "venueId": 78, "name": "Skuespilhuset, Store Scene" },
        14: { "venueId": 14, "name": "Operaen, Takkelloftets Foyer" },
        16: { "venueId": 16, "name": "Gamle Scene, A-Salen" },
        26: { "venueId": 26, "name": "Gamle Scene, Pr\u00f8vesal G" },
        36: { "venueId": 36, "name": "Gamle Scene, Balkonfoyer" },
        46: { "venueId": 46, "name": "Rundvisning p\u00e5 Gamle Scene" },
        66: { "venueId": 66, "name": "Rundvisning i Skuespilhuset" },
        79: { "venueId": 79, "name": "Operaens Foyer" },
        56: { "venueId": 56, "name": "Skuespilhuset, Portscenen" },
        81: { "venueId": 81, "name": "Ulvedalene" },
        83: { "venueId": 83, "name": "Skuespilhusets Foyer" },
        84: { "venueId": 84, "name": "Rundvisning i Operaen" },
        87: { "venueId": 87, "name": "Skuespilhuset, Store Pr\u00f8vesal" },
        88: { "venueId": 88, "name": "Balletskolen" },
        99: { "venueId": 99, "name": "Skuespilhuset, Ofelia" },
        104: { "venueId": 104, "name": "Skuespilhuset, Dronningeg\u00e5rden" },
        112: { "venueId": 112, "name": "Scenografiske V\u00e6rksteder" },
        113: { "venueId": 113, "name": "Rundvisning i Scenografisk V\u00e6rksted" },
        116: { "venueId": 116, "name": "Gamle Scene" },
        131: { "venueId": 131, "name": "Gamle Scene, Pr\u00f8vesal B" },
        127: { "venueId": 127, "name": "Operaen, Pr\u00f8vesal 3" },
        128: { "venueId": 128, "name": "Operaen, Pr\u00f8vesal 4" },
        129: { "venueId": 129, "name": "Operaen, Pr\u00f8vesal 5" },
        130: { "venueId": 130, "name": "Operaen, Pr\u00f8vesal 6" },
        132: { "venueId": 132, "name": "Gamle Scene, Pr\u00f8vesal F" },
        133: { "venueId": 133, "name": "Gamle Scene, Pr\u00f8vesal H" },
        134: { "venueId": 134, "name": "Gamle Scene, Pr\u00f8vesal E" },
        135: { "venueId": 135, "name": "Gamle Scenes Foyer" },
        136: { "venueId": 136, "name": "Operaen, Pr\u00f8vesal 1" },
        137: { "venueId": 137, "name": "Operaen, Pr\u00f8vesal 2" },
        138: { "venueId": 138, "name": "Operaen, Pr\u00f8vesal 7" },
        105: { "venueId": 105, "name": "Turn\u00e9" },
        140: { "venueId": 140, "name": "Gamle Scene (unummereret)" },
        89: { "venueId": 89, "name": "Balletskolen, Summer School" }
    }
})

.factory('dktEvents', ["$q", "$sce", "$timeout", "dktComponents", "dktData", "dktUtils", "dktEventsConfig", "dktLocalization", function ($q, $sce, $timeout, dktComponents, dktData, dktUtils, dktEventsConfig, dktLocalization) {
    var service = {
        loaded: false,
        events: {},
        filter: null,
        dataFilter: null
    };

    service.get = function (options, currentEvents, onComplete, onDataLoaded) {
        // Check if the parameter is defined and if not set the variable to null.
        onComplete = onComplete || null;
        onDataLoaded = onDataLoaded || null;

        // Set default filter
        if (service.filter === null) {
            service.setFilter();
        }

        angular.extend(options, service.filter);

        dktData.post(dktComponents.getEndpoint('events'), options, {}, true).then(function success(response) {
            if (onDataLoaded) {
                onDataLoaded();
            }

            if (response.data) {
                $timeout(function () {
                    service.events = parseEvents(response.data, currentEvents);

                    if (onComplete) {
                        onComplete(service.events, response.data.length === 0);
                    }
                }, 1000);
            }
        }, function error(response) {
        });

        service.loaded = true;
    };

    service.count = function (options, onComplete) {
        // Check if the parameter is defined and if not set the variable to null.
        onComplete = onComplete || null;

        // Set default filter
        if (service.filter === null) {
            service.setFilter();
        }

        angular.extend(options, service.filter);

        dktData.post(dktComponents.getEndpoint('events'), options, {}, true).then(function success(response) {
            if (onComplete) {
                onComplete(response.data.length);
            }
        }, function error(response) {
            if (onComplete) {
                onComplete(0);
            }
        });
    };

    /**
     * Set what filtering to use.
     *
     * @param {Object} filter
     */
    service.setFilter = function (filter) {
        filter = filter || {};

        service.dataFilter = filter;

        service.filter = {};

        //var categories = dktLocalization.getItem('categories');

        if (angular.isDefined(filter.weekday) && filter.weekday !== '') {
            service.filter.weekdays = filter.weekday.split(',');

            for (var weekday in service.filter.weekdays) {
                service.filter.weekdays[weekday] -= 1;
            }
        }

        if (angular.isDefined(filter.venue) && filter.venue !== '') {
            var venueIds;

            service.filter.venueIds = [];

            for (var venueGroup in filter.venue) {
                venueIds = dktLocalization.getItem('venues', parseInt(filter.venue[venueGroup], 10) - 1).venueIds;

                if (angular.isDefined(venueIds) && venueIds.length > 0) {
                    for (var venue in venueIds) {
                        service.filter.venueIds.push(venueIds[venue]);
                    }
                }
            }
        }

        if (angular.isDefined(filter.title) && filter.title !== '') {
            service.filter.productionIds = filter.title.split(',');
        }

        if (angular.isDefined(filter.category) && filter.category !== '') {
            service.filter.keywords = filter.category.split(',');
        }

        if (angular.isDefined(filter.keywords) && filter.keywords !== '') {
            service.filter.keywords = filter.keywords.split(',');
        }

        if (angular.isDefined(filter.price) && filter.price !== '') {
            var prices = filter.price.split(',');

            service.filter.minPrice = 0;
            service.filter.maxPrice = prices.indexOf('0-250') !== -1 ? 250 : 0;
        }

        if (angular.isUndefined(service.filter.keywords) || service.filter.keywords.length === 0) {
            service.filter.keywords = dktLocalization.getItem('keywordFilters');
        }
    };

    /**
     * Get what filtering currently used.
     */
    service.getFilter = function () {
        return service.filter;
    };

    /**
     * Get what filtering currently used.
     */
    service.getDataFilter = function () {
        return service.dataFilter;
    };

    /**
     * Return a promise of loading the API data. This is used when a state/page needs to have the
     * API data resolved before initialising the page.
     *
     * @params {Object} A promise template to be resolved
     * @returns {Object} Return the actual promise
     */
    service.resolve = function ($q, id) {
        var deferred = $q.defer();

        if (service.loaded) {
            deferred.resolve(service);
            return deferred.promise;
        }

        // Load and prepare all the data. On callback resolve the promise.
        service.get(id, function () {
            deferred.resolve(service);
        });

        return deferred.promise;
    };

    service.getVenueName = function (venueId) {
        if (angular.isDefined(venueId) && angular.isDefined(dktEventsConfig.venues[venueId])) {
            return dktEventsConfig.venues[venueId].name;
        } else {
            return '';
        }
    };

    service.getVenueGroupByVenueId = function (venueId) {
        venueId = venueId || null;

        var venueGroup = null;

        if (venueId) {
            var venueGroups = dktLocalization.getItem('venues');

            for (var index in venueGroups) {
                if (angular.isDefined(venueGroups[index].venueIds) && venueGroups[index].venueIds.indexOf(venueId) !== -1) {
                    venueGroup = venueGroups[index];

                    break;
                }
            }

            index = null;
            venueGroups = null;
        }

        return venueGroup;
    };

    function parseEvents(events, eventsByMonth) {
        eventsByMonth = eventsByMonth || {};

        var event;
        var newEvent;
        var eventDate;
        var eventMonthId;
        var eventDateId;
        var prices;
        var noDescriptionText = dktLocalization.getItem('event', 'no_description');
        var applyCount = 0;
        var keywords = dktLocalization.getItem('keywordFilters');
        var hasKeyword = false;

        for (event in events) {
            event = events[event];
            eventDate = parseDate(event.eventDate);
            //eventDate = new Date(eventDate.getTime() + (eventDate.getTimezoneOffset() * 60000));
            eventMonthId = (eventDate.getMonth() + 1) + '-' + eventDate.getFullYear();
            eventDateId = eventDate.getDate() + '-' + (eventDate.getMonth() + 1) + '-' + eventDate.getFullYear();

            prices = [];

            if (angular.isDefined(event.lowPrice) && event.lowPrice > 0) {
                prices.push(event.lowPrice);
            }

            if (angular.isDefined(event.highPrice) && event.highPrice > 0) {
                if (prices.length === 0 || event.highPrice !== prices[0]) {
                    prices.push(event.highPrice);
                }
            }

            newEvent = {
                id: event.id,
                title: event.name,
                description: (angular.isDefined(event.synopsis) && event.synopsis !== '' ? event.synopsis : noDescriptionText),
                imageUrl: (angular.isDefined(event.imageUrl) && event.imageUrl !== '' ? dktComponents.getHost() + event.imageUrl : ''),
                category: dktLocalization.getItem('categoriesById', event.performanceType),
                seasonId: event.productionSeasonId,
                onSale: event.onSale,
                available: angular.isDefined(event.seatingAvailability) && event.seatingAvailability ? event.seatingAvailability.toLowerCase() : '',
                date: event.eventDate,
                dateObj: new Date(event.eventDate),
                time: (eventDate.getHours() <= 9 ? '0' : '') + eventDate.getHours() + ':' + (eventDate.getMinutes() <= 9 ? '0' : '') + eventDate.getMinutes(),
                cancelled: event.cancelled,
                seats: event.availableSeats,
                price: $sce.trustAsHtml(prices.length > 0 ? prices.join('-') + ' kr.' : ''),
                keywords: (angular.isDefined(event.keywords) && event.keywords && event.keywords.length > 0 ? event.keywords.join(',') : null),
                prices: {
                    low: event.lowPrice,
                    high: event.highPrice
                },
                venue: {
                    id: event.venueId,
                    name: service.getVenueName(event.venueId),
                    group: service.getVenueGroupByVenueId(event.venueId)
                },
                urls: {
                    buy: (angular.isDefined(event.buyTicketsLink) && event.buyTicketsLink !== '' ? dktComponents.getHost() + event.buyTicketsLink : ''),
                    buyTarget: '_self',
                    details: (angular.isDefined(event.detailsLink) && event.detailsLink !== '' ? dktComponents.getHost() + event.detailsLink : '')
                },
                shown: false,
                monthId: eventMonthId,
                applyCount: applyCount,
                external: false
            };

            if (angular.isDefined(event.buyTicketsOverrideLink) && event.buyTicketsOverrideLink !== '') {
                newEvent.urls.buy = event.buyTicketsOverrideLink;
                newEvent.urls.buyTarget = '_blank';
                newEvent.external = true;
            }

            if (angular.isUndefined(eventsByMonth[eventMonthId])) {
                eventsByMonth[eventMonthId] = {
                    totalEvents: 0,
                    dates: {}
                };
            }

            eventsByMonth[eventMonthId].totalEvents++;

            if (angular.isUndefined(eventsByMonth[eventMonthId].dates[eventDateId])) {
                eventsByMonth[eventMonthId].dates[eventDateId] = {
                    events: []
                };
            }

            eventsByMonth[eventMonthId].dates[eventDateId].events.push(newEvent);

            applyCount++;

            if (applyCount > 20) {
                applyCount = 0;
            }
        }

        noDescriptionText = null;
        event = null;
        newEvent = null;
        eventDate = null;
        eventMonthId = null;
        eventDateId = null;
        prices = null;

        //service.applyFilter(eventsByMonth, false);

        return eventsByMonth;
    }
    function parseDate(date) {
        var datetimeArray = date.split('T');
        var dateArray = datetimeArray[0].split('-');
        var timeArray = datetimeArray[1].split(':');

        date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2], 0);

        datetimeArray = null;
        dateArray = null;
        timeArray = null;

        return date;
    }
    // Return the service for injection.
    return service;
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.services.favorites
 *
 * @description
 * This data-model handles loading and
 * parsing the data for the favorites API.
 */

angular.module('dkt.core.services.favorites', [
    'dkt.core',
    'dkt.core.services.data'
])

.factory('dktFavorites', ["dktData", "dktComponents", "dktParams", function (dktData, dktComponents, dktParams) {
    var service = {
        loaded: false,
        loading: false,
        favorites: [],
        loggedIn: false,
        filters: {
            titles: [],
            dates: []
        }
    };

    var callbacks = {};
    var filteredCast = [];

    service.get = function(callback) {
        callback = callback || null;

        if (callback) {
            if (angular.isUndefined(callbacks.get)) {
                callbacks.get = [];
            }

            callbacks.get.push(callback);
        }

        if (!service.loading) {
            if (service.loaded) {
                handleCallbacks('get');
            } else {
                service.loading = true;

                dktData.get(dktComponents.getEndpoint('getFavorites',  {'type': 1, 'status': '0,1'}), {}).then(function success(response) {
                    if (angular.isArray(response.data)) {
                        service.loggedIn = true;
                        service.favorites = response.data;
                    } else {
                        service.loggedIn = false;
                        service.favorites = [];
                    }

                    handleCallbacks('get');

                    service.loaded = true;
                    service.loading = false;
                }, function error(response) {
                    service.loggedIn = false;
                    service.favorites = [];

                    handleCallbacks('get');

                    service.loaded = true;
                    service.loading = false;
                });
            }
        }
    };

    service.isFavorite = function(productionId) {
        productionId = productionId || 0;
        productionId = parseInt(productionId, 10);

        if (service.favorites) {
            for (var favorite in service.favorites) {
                if (parseInt(service.favorites[favorite].productionSeasonNumber, 10) === productionId) {
                    return true;
                }
            }
        }

        return false;
    };

    service.removeByProductionId = function(productionId) {
        productionId = productionId || 0;
        productionId = parseInt(productionId, 10);

        if (service.favorites && productionId) {
            for (var favorite in service.favorites) {
                if (parseInt(service.favorites[favorite].productionSeasonNumber, 10) === productionId) {
                    service.favorites.splice(favorite, 1);

                    return true;
                }
            }
        }

        return false;
    };

    service.add = function(productionId, callback) {
        callback = callback || null;
        productionId = productionId || null;

        if (productionId) {
            service.favorites.push({
                'customerNumber': '-',
                'productionSeasonNumber': productionId,
                'performanceNumber': 0,
                'zoneNumber': 0,
                'seatCount': 0,
                'listType': 1,
                'status':'Active'
            });

            dktData.post(dktComponents.getEndpoint('updateFavorites'), {'ListType': 1, 'Mode': 'A', 'ProductionSeasonNumber': productionId}).then(function success(response) {
                if (callback) {
                    callback(true);
                }
            }, function error(response) {
                if (callback) {
                    callback(false);
                }
            });
        }
    };

    service.remove = function(productionId, callback) {
        callback = callback || null;
        productionId = productionId || null;

        if (productionId) {
            service.removeByProductionId(productionId);

            dktData.post(dktComponents.getEndpoint('updateFavorites'), {'ListType': 1, 'Mode': 'D', 'ProductionSeasonNumber': productionId}).then(function success(response) {
                if (callback) {
                    callback(true);
                }
            }, function error(response) {
                if (callback) {
                    callback(false);
                }
            });
        }
    };

    service.setFilter = function() {
        var favoriteList = [];

        if (service.favorites) {
            for (var favorite in service.favorites) {
                favoriteList.push(service.favorites[favorite].productionSeasonNumber);
            }
        }

        dktParams.setFilter(
            'title',
            favoriteList.join(',')
        );
    };

    service.removeFilter = function() {
        dktParams.setFilter(
            'title',
            null
        );
    };

    function handleCallbacks(name, parameters) {
        name = name || null;
        parameters = parameters || null;

        if (name && angular.isDefined(callbacks[name]) && callbacks[name].length > 0) {
            var callback;

            for (callback in callbacks[name]) {
                callback = callbacks[name][callback];

                if (angular.isFunction(callback)) {
                    callback(parameters);
                }
            }

            callbacks[name] = [];
        }
    }

    return service;
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.services.localization
 *
 * @description
 * This data-model handles loading and
 * parsing the data for the localization API.
 */

angular.module('dkt.core.services.localization', [
    'dkt.core',
    'dkt.core.services.data'
])

.constant('dktLocalizationConfig', {
    'venue': {
        'images': {
            'gamle-scene': '/app/third-party/assets/styles/assets/images/places/gamle-scene.gif',
            'the-old-stage': '/app/third-party/assets/styles/assets/images/places/gamle-scene.gif',
            'skuespilhuset': '/app/third-party/assets/styles/assets/images/places/skuespilhuset.gif',
            'the-playhouse': '/app/third-party/assets/styles/assets/images/places/skuespilhuset.gif',
            'ude-i-landet': '/app/third-party/assets/styles/assets/images/places/ude-i-landet.png',
            'out-and-about': '/app/third-party/assets/styles/assets/images/places/ude-i-landet.png',
            'ulvedalene': '/app/third-party/assets/styles/assets/images/places/venue-default.png',
            'operaen': '/app/third-party/assets/styles/assets/images/places/operaen.gif',
            'the-opera-house': '/app/third-party/assets/styles/assets/images/places/operaen.gif',
            'default': '/app/third-party/assets/styles/assets/images/places/venue-default.png'
        }
    },
    'static': {
        'da': {
            'misc': {
                'all': 'Alle',
                'all_shows': 'V\u00e6lg alle',
                'events': 'arrangementer',
                'event': 'arrangement',
                'filter': 'Filtr\u00e9r',
                'calendar': 'Kalender',
                'shows': 'Forestillinger',
                'shows_filter_title': 'V\u00e6lg en eller flere',
                'close': 'Luk',
                'not_logged_in_headline': 'Du skal v\u00e6re logget ind',
                'not_logged_in_message': 'For at kunne tilf\u00f8je favoritter til din profil, skal du f\u00f8rst v\u00e6re logget ind. Klik p\u00e5 knappen nedenfor, for at logge ind.',
                'not_logged_in_button': 'Log ind',
                'shows_show_dates': 'Vis datoer',
                'shows_read_more': 'Se mere',
                'add_favorite': 'Tilf\u00f8j som favorit',
                'no_favorites_title': 'Du har ingen gemte favoritter',
                'no_favorites_message': 'Du tilf\u00f8jer forestillinger som favoritter, ved at klikke p\u00e5 hjerterne i oversigten.<br /><br />Alle forestillinger markeret med et r\u00f8dt hjerte vises her og under “Min profil” som favoritter.<br /><br />Hvis der er favoritter du endnu ikke har k\u00f8bt billet til, kan du ogs\u00e5 f\u00e5 adgang til dem direkte i kurven via knappen "Tilf\u00f8j fra favoritter”.'
            },
            'filters': {
                'category': 'Kategori/titel',
                'category_headline': 'V\u00e6lg kategori/titel',
                'category_all_shown_description': 'Du har valgt at sortere p\u00e5 alle forestillinger.',
                'category_select_description': 'V\u00e6lg kategori til venstre.',
                'show_results': 'Vis resultater',
                'shows_filter_title': 'V\u00e6lg en eller flere'
            },
            'event': {
                'free': 'Gratis',
                'few_tickets': 'F\u00e5 ledige',
                'no_description': 'Ingen beskrivelse',
                'no_results': 'Ingen matchende arrangementer fundet.',
                'no_results_month': 'Der blev ikke fundet nogen forestillinger p\u00e5 denne m\u00e5ned, udfra den valgte filtrering',
                'no_results_date_range': 'Der er ingen matchende arrangementer i den aktuelle periode.',
                'results_outside_range': 'Vis %count tidligere arrangementer'
            },
            'cast': {
                'readmore': 'Om kunstneren',
                'participating': 'Medvirker',
                'cast': 'Medvirkende',
                'all_performances': 'Alle titler',
                'all_days': 'Alle dage',
                'select_date': 'V\u00e6lg dato',
                'title': 'Titel',
                'select_time': 'V\u00e6lg tidspunkt',
                'also_in': 'Medvirker ogs\u00e5 i',
                'performing_in': 'Medvirker i',
                'no_results': 'Den endelige liste af medvirkende er stadig ved at blive udarbejdet og er derfor ikke tilg\u00e6ngelig online endnu.',
                'no_results_filter': 'Der blev ikke fundet nogen medvirkende',
                'and_more': 'med flere ...'
            }
        },
        'en': {
            'misc': {
                'all': 'All',
                'all_shows': 'Select all',
                'events': 'events',
                'event': 'event',
                'filter': 'Filter',
                'calendar': 'Calendar',
                'shows': 'Shows',
                'shows_filter_title': 'Select one or multiple',
                'close': 'Close',
                'not_logged_in_headline': 'You need to be logged in',
                'not_logged_in_message': 'To add favourites to your profile you need to be logged in. Click the button below to log in.',
                'not_logged_in_button': 'Log in',
                'shows_show_dates': 'Show dates',
                'shows_read_more': 'Read more',
                'add_favorite': 'Add to favorites',
                'no_favorites_title': 'You have no saved favourites',
                'no_favorites_message': 'You can add productions as favourites by clicking the hearts on the images.<br /><br />All productions marked with a red heart are shown here and on your “My Profile” page as favourites.<br /><br />Any favourite without purchased tickets can also be accessed directly from the basket via the button “Add from favourites”.'
            },
            'filters': {
                'category': 'Category/title',
                'category_headline': 'Select category/title',
                'category_all_shown_description': 'You have selected to sort on all productions.',
                'category_select_description': 'Select a category to the left.',
                'show_results': 'Show results'
            },
            'event': {
                'free': 'Free',
                'few_tickets': 'Few left',
                'no_description': 'No description',
                'no_results': 'No matching events found.',
                'no_results_month': 'No shows were found on the month, within the defined filters',
                'no_results_date_range': 'There are no matching events in the current time period.',
                'results_outside_range': 'Show %count previous events.'
            },
            'cast': {
                'readmore': 'About The Artist',
                'participating': 'Performing on',
                'cast': 'Cast',
                'all_performances': 'All titles',
                'all_days': 'All dates',
                'select_date': 'Select date',
                'title': 'Title',
                'select_time': 'Select time',
                'also_in': 'Also appearing in',
                'performing_in': 'Appearing in',
                'no_results': 'The final casting for this production is still being planned and is therefore not yet available online.',
                'no_results_filter': 'No cast information was found',
                'and_more': 'and more ...'
            }
        }
    }
})

.factory('dktLocalization', ["dktData", "dktUtils", "dktComponents", "dktLocalizationConfig", function (dktData, dktUtils, dktComponents, dktLocalizationConfig) {
    var loaded = false;
    var loading = false;
    var staticLocalization = dktLocalizationConfig.static[dktComponents.getLanguage()];
    var callbacks = {};

    var service = {
        localization: {}
    };

    dktComponents.$on('LANGUAGE_CHANGED', function (params) {
        loaded = false;

        service.init({});
    });

    service.init = function (options, callback) {
        // Check if the parameter is defined and if not set the variable to null.
        callback = callback || null;

        if (callback) {
            if (angular.isUndefined(callbacks.init)) {
                callbacks.init = [];
            }

            callbacks.init.push(callback);
        }

        if (loaded && !loading) {
            if (callback) {
                callback(service.localization);
            }
        } else if (!loading) {
            loading = true;

            dktData.get(dktComponents.getEndpoint('localization'), options).then(function success(response) {
                staticLocalization = dktLocalizationConfig.static[dktComponents.getLanguage()];

                if (response.data) {
                    service.localization = parseLocalization(response.data);
                }

                handleCallbacks('init', service.localization);

                loading = false;
                loaded = true;
            }, function error(response) {
            });
        }

        return function () {
            callbacks.init.splice(callbacks.init.indexOf(this));
        }.bind(callback);
    };

    service.isLoaded = function () {
        return loaded;
    };

    service.onInit = function (callback) {
        callback = callback || null;

        if (callback) {
            if (angular.isUndefined(callbacks.init)) {
                callbacks.init = [];
            }

            callbacks.init.push(callback);
        }
    };

    service.getItem = function (category, name, noFormatting) {
        category = category || null;
        name = angular.isDefined(name) ? name : null;
        noFormatting = noFormatting || false;

        var item = null;

        if (name !== null && angular.isDefined(staticLocalization[category]) && angular.isDefined(staticLocalization[category][name])) {
            item = staticLocalization[category][name];
        } else if (name !== null && angular.isDefined(service.localization[category]) && angular.isDefined(service.localization[category][name])) {
            item = service.localization[category][name];
        } else if (name === null && angular.isDefined(service.localization[category])) {
            item = angular.copy(service.localization[category]);
        } else {
            if (name !== null) {
                item = name;
            } else {
                item = category;
            }
        }

        if (!noFormatting && item && angular.isString(item)) {
            item = dktUtils.string.capitalize(item);
        }

        return item;
    };

    function parseLocalization(data) {
        var index;
        var item;
        var parsedData = {
            'filters': {
                'price': data.filterHeadings.costFiltersLabel,
                'weekday': data.filterHeadings.dayFiltersLabel,
                'category': data.filterHeadings.typeFiltersLabel,
                'venue': data.filterHeadings.venueFiltersLabel
            },
            'event': {
                'readmore': data.performance.performanceDetailLinkText,
                'buy': data.performance.buyTicketsText,
                'soldout': data.performance.soldOutText,
                'not_available': data.performance.performanceDetailLinkText,
                'cancelled': data.performance.canceledText,
                'limited_availability': data.performance.limitedQuantityText
            },
            'weekdays': [],
            'months': [],
            'monthsById': {},
            'categories': [],
            'categoriesById': {},
            'productionFilters': [],
            'keywordFilters': [],
            'venues': [],
            'prices': []
        };

        for (index in data.dateTimeLocalization.days) {
            item = data.dateTimeLocalization.days[index];

            item.name = dktUtils.string.capitalize(item.longName);
            item.value = (item.dayOfWeek + 1).toString();
            item.order = item.sortOrder + 1;

            parsedData.weekdays.push(item);
        }

        for (index in data.dateTimeLocalization.months) {
            item = data.dateTimeLocalization.months[index];

            item.name = dktUtils.string.capitalize(item.longName);
            item.value = item.id;
            item.order = index + 1;

            parsedData.months.push(item);
            parsedData.monthsById[item.id] = item.name;
        }

        for (index in data.performanceTypes) {
            item = data.performanceTypes[index];

            item.value = item.id;
            item.order = index + 1;

            parsedData.categories.push(item);
            parsedData.categoriesById[item.id] = item;
        }

        if (angular.isDefined(data.productionFilters) && data.productionFilters) {
            for (index in data.productionFilters) {
                item = data.productionFilters[index];

                item.value = item.keywords;
                item.order = item.id;

                parsedData.productionFilters.push(item);
            }
        }

        if (angular.isDefined(data.keywordFilters) && data.keywordFilters) {
            for (index in data.keywordFilters) {
                if (angular.isDefined(data.keywordFilters[index].keywords) && data.keywordFilters[index].keywords) {
                    parsedData.keywordFilters.push(data.keywordFilters[index].keywords.toLowerCase());
                }
            }
        }

        for (index in data.venueGroups) {
            item = data.venueGroups[index];

            item.name = dktUtils.string.capitalize(item.name);
            item.id = item.name.toLowerCase();
            item.value = (parseInt(index, 10) + 1).toString();
            item.order = parseInt(index, 10) + 1;

            if (angular.isDefined(dktLocalizationConfig.venue.images[item.id.split(' ').join('-')])) {
                item.image = dktLocalizationConfig.venue.images[item.id.split(' ').join('-')];
            } else {
                item.image = dktLocalizationConfig.venue.images.default;
            }

            parsedData.venues.push(item);
        }

        for (index in data.pricingRules) {
            item = data.pricingRules[index];

            item.name = dktUtils.string.capitalize(item.name);
            item.value = '0' + (item.maxPrice > 0 ? '-' + item.maxPrice : '');
            item.order = index + 1;

            parsedData.prices.push(item);
        }

        index = null;
        item = null;

        return parsedData;
    }

    function handleCallbacks(name, parameters) {
        name = name || null;
        parameters = parameters || null;

        if (name && angular.isDefined(callbacks[name]) && callbacks[name].length > 0) {
            var callback;

            for (callback in callbacks[name]) {
                callback = callbacks[name][callback];

                if (angular.isFunction(callback)) {
                    callback(parameters);
                }
            }

            //callbacks[name] = [];
        }
    }

    // Return the service for injection.
    return service;
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.services.productions
 *
 * @description
 * This data-model handles loading and
 * parsing the data for the productions API.
 */

angular.module('dkt.core.services.productions', [
    'dkt.core',
    'dkt.core.services.data',
    'dkt.core.services.localization'
])

.factory('dktProductions', ["dktData", "dktComponents", "dktLocalization", function (dktData, dktComponents, dktLocalization) {
    var service = {
        loaded: false,
        productions: {},
        productionsByCategory: {}
    };

    service.get = function(options, onComplete, cache) {
        cache = cache || false;

        // Check if the parameter is defined and if not set the variable to null.
        onComplete = onComplete || null;

        if (service.loaded && cache) {
            if (onComplete) {
                onComplete(service.productions);
            }
        } else {
            dktData.get(dktComponents.getEndpoint('productions'), options).then(function success(response) {
                if (response.data) {
                    service.productions = parseProductions(response.data);

                    if (onComplete) {
                        onComplete(service.productions);
                    }
                }
            }, function error(response) {

            });

            service.loaded = true;
        }
    };

    service.getByCategory = function(category) {
        category = category || null;

        var productions = [];

        if (angular.isDefined(service.productionsByCategory[category])) {
            productions = angular.copy(service.productionsByCategory[category]);
        }

        return productions;
    };

    function parseProductions(data) {
        var category;

        service.productionsByCategory = {};

        for (var production in data) {
            production = data[production];

            production.name = production.title;
            production.value = angular.isDefined(production.productionSeasonNumber) ? production.productionSeasonNumber.toString() : '';

            category = dktLocalization.getItem('categoriesById', production.performanceType.toLowerCase());

            production.category = category && angular.isDefined(category.name) ? category.name : '';

            production.detailsLink = production.detailsLink !== '' ? dktComponents.getHost() + production.detailsLink : '';

            production.imageMobileHeroUrl = production.imageMobileHeroUrl !== '' ? dktComponents.getHost() + production.imageMobileHeroUrl : '';
            production.imageThumbnailUrl = production.imageThumbnailUrl !== '' ? dktComponents.getHost() + production.imageThumbnailUrl : '';
            production.imageHeroUrl = production.imageHeroUrl !== '' ? dktComponents.getHost() + production.imageHeroUrl : '';
            production.order = 1;

            if (angular.isUndefined(service.productionsByCategory[production.performanceType])) {
                service.productionsByCategory[production.performanceType] = [];
            }

            service.productionsByCategory[production.performanceType].push(production);
        }

        category = null;

        return data;
    }

    // Return the service for injection.
    return service;
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.filters
 *
 * @description
 * Contains general filters for the app.
 */

angular.module('dkt.core.filters', [
    'dkt.core.services.localization'
])

.filter('html', ["$sce", function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}])

.filter('url', ["$sce", function($sce) {
    return function(url) {
        return $sce.trustAsUrl(url);
    };
}])

.filter('resourceUrl', ["$sce", function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.filter('capitalize', function() {
    return function(input) {
        input = input.toLowerCase();
        return input.substring(0,1).toUpperCase() + input.substring(1);
    };
})

.filter('classify', ["$filter", function($filter) {
    return function(input) {
        return input.split('.').join('-');
    };
}])

.filter('classify', ["$filter", function($filter) {
    return function(input) {
        return input.split('.').join('-');
    };
}])

.filter('shorten', function() {
    return function(input, length) {
        return input && input.length > 0 ? input.substring(0, length) : input;
    };
})

.filter('truncate', ["$sce", function($sce) {
    return function(input, length) {
        if (input) {
            input = input.replace('&nbsp;', ' ').replace(/<(?!br\s*\/?)[^>]+>/g, '');
            input = input && input.length > 0  && input.length > length ? input.substring(0, length - 2) + '..' : input;

            return $sce.trustAsHtml(input);
        } else {
            return '';
        }
    };
}])

.filter('translate', ["dktLocalization", function(dktLocalization) {
    var translateFilter = function(input, noFormatting) {
        if (input.indexOf('.') !== -1) {
            input = input.split('.');

            return dktLocalization.getItem(input[0], input[1], noFormatting);
        } else {
            return dktLocalization.getItem(input, null, noFormatting);
        }
    };

    translateFilter.$stateful = true;

    return translateFilter;
}])


;

/**
 * @ngdoc overview
 * @name dkt.core.filters.images
 *
 * @description
 * Contains filters and helpers for images.
 */

angular.module('dkt.core.filters.images', [])

.filter('image', function () {
    return function (val) {
        if (!val) {
            return null;
        }

        return (angular.isDefined(val) ? encodeURI(val) : '/app/third-party/assets/images/blank.gif');
    };
})

;
/**
 * @ngdoc overview
 * @name dkt.components.castList
 *
 * @description
 * Description
 */

angular.module('dkt.components.cast.castList', [
    'dkt.core.services.localization',
    'dkt.core.services.cast',
    'dkt.core.services.utils.images',
    'dkt.components.misc.advancedTiles'
])

.directive('dktCastList', ["$timeout", "dktComponents", "dktCast", "dktLocalization", "dktParams", "dktSpinner", "dktCastFilter", "dktUtils", function ($timeout, dktComponents, dktCast, dktLocalization, dktParams, dktSpinner, dktCastFilter, dktUtils) {
    return {
        restrict: 'E',
        scope: {
            'productionId': '@',
            'personelIds': '@',
            'size': '@',
            'title': '@'
        },
        replace: true,
        template:'<div class="dkt-cast-list"><h2 class="block-header block-head" ng-if="!personelIds || personelIds == \'\'">{{title ? title : \'Medvirkende\'}}<span class="dkt-selection">: <span class="dkt-selection-inner" ng-repeat="selectionValue in selection">{{selectionValue}}</span></span></h2><span class="dkt-filter-button mobile" ng-click="toggleFilter()">Filtrer</span><dkt-advanced-tiles param-id="personel-id" elements="cast" ng-if="cast.length > 0" size="{{size}}"></dkt-advanced-tiles><div class="dkt-cast-listing-container" ng-if="extras.length > 0"><span class="dkt-cast-listing-item" ng-repeat="item in extras"><a ng-href="{{item.data.readmoreLink}}">{{item.text}}</a><span class="subtext" ng-if="item.subtext && item.subtext !== \'\'">&nbsp;/ {{item.subtext}}</span></span></div><div class="dkt-cast-no-results" ng-if="noResults">{{\'cast.no_results_filter\' | translate}}</div></div>',
        link: function (scope, element, attrs) {
            var init = true;
            var filters = null;

            scope.cast = [];
            scope.extras = [];
            scope.selection = [];
            scope.filtersExist = false;
            scope.noResults = false;

            moment.locale(dktComponents.getLanguage());

            function getCast(delay, filters) {
                delay = delay || false;

                scope.cast = [];
                scope.extras = [];
                scope.noResults = false;

                if (angular.isDefined(scope.personelIds) && scope.personelIds !== '') {
                    dktCast.getSpecificCast(scope.personelIds, function(cast) {
                        parseCast(cast, delay);
                    });
                } else {
                    dktCast.get(scope.productionId, filters, function(cast) {
                        parseCast(cast, delay);
                    });
                }
            }

            function parseCast(cast, delay) {
                delay = delay || false;

                var newCastList = {tiles: [], text: []};
                var castCount;
                var castItem;
                var castItemInfo;
                var format;
                var date;
                var dateCount;
                var participationDatesOutput ;

                for (castCount in cast) {
                    castItem = cast[castCount];

                    participationDatesOutput = '';
                    dateCount = 0;

                    if (angular.isDefined(castItem.dates) && castItem.dates) {
                        castItem.dates = sortObjectByKey(castItem.dates);

                        for (date in castItem.dates) {
                            /*if (dateCount > 8) {
                                console.log(dktLocalization.getItem('cast', 'and_more'));
                                participationDatesOutput += '<br />' + dktLocalization.getItem('cast', 'and_more', true);

                                break;
                            }*/

                            if (participationDatesOutput !== '') {
                                participationDatesOutput += ', ';
                            }

                            date = date.split('-');

                            participationDatesOutput += date[2] + '/' + date[1];

                            dateCount++;
                        }
                    }

                    castItem.participationDates = participationDatesOutput;

                    if (castItem.preferredListingImageFormat !== 'none') {
                        newCastList[castItem.preferredListingImageFormat === 'text' ? 'text' : 'tiles'].push({
                            'id': castItem.personelId,
                            'index': castCount,
                            'imageMobileHeroUrl': castItem.imageMobileHeroUrl,
                            'imageThumbnailUrl': castItem.imageThumbnailUrl,
                            'imageHeroUrl': castItem.imageHeroUrl,
                            'text': castItem.name,
                            'subtext': castItem.roles,
                            'preferedFormat': castItem.preferredListingImageFormat,
                            'info': renderCastInfo,
                            'data': castItem
                        });
                    }
                }

                $timeout(function () {
                    if (init) {
                        scope.$emit('CAST_READY', dktCast.cast);
                    }

                    if (cast.length === 0) {
                        scope.noResults = true;
                    }

                    dktSpinner.hide();

                    init = false;
                }, 200);

                $timeout(function () {
                    scope.cast = this.tiles;
                }.bind(newCastList), (delay ? 600 : 0));

                $timeout(function () {
                    scope.extras = this.text;
                }.bind(newCastList), (delay ? 600 : 300));
            }

            dktLocalization.init({}, function (localization) {
                dktSpinner.show();

                filters = dktParams.getAllFilters();
                scope.filtersExist = dktCastFilter.exist;

                getCast(true, filters);
            });

            scope.toggleFilter = function() {
                if (!dktCastFilter.active) {
                    dktCastFilter.show();
                } else {
                    dktCastFilter.hide();
                }
            };

            scope.$on('$locationChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (!init) {
                    var newFilters = dktParams.getAllFilters();

                    filters = filters || {};
                    newFilters = newFilters || {};

                    if (angular.isDefined(newFilters.selection) && newFilters.selection === 'all') {
                        newFilters.date = '';
                    }

                    if (angular.toJson(filters) !== angular.toJson(newFilters)) {
                        getCast(false, newFilters);
                    }

                    filters = newFilters;
                }

                var selectionFilter = dktParams.getFilter('selection');
                if (selectionFilter && selectionFilter === 'date') {
                    var dateFilter = dktParams.getFilter('date');
                    var timeFilter = dktParams.getFilter('time');

                    if (dateFilter) {
                        scope.selection = [moment((dateFilter ? dateFilter : '') + (timeFilter ? ' ' + timeFilter : '')).format('Do MMMM YYYY' + (timeFilter ? ' [kl.] H:mm' : ''))];
                    } else {
                        scope.selection = [dktLocalization.getItem('cast', 'all_days')];
                        //scope.selection = moment().format('Do MMMM YYYY' + (timeFilter ? ' [kl.] H:mm' : ''));
                    }

                } else {
                    scope.selection = [dktLocalization.getItem('cast', 'all_days')];
                }
            });

            function renderCastInfo(tileItem) {
                var showProductionCredits = true;

                if (tileItem.data) {
                    if (dktUtils.window.width() > 1024) {
                        if (dktUtils.object.count(tileItem.data.dates) > 25) {
                            showProductionCredits = false;
                        }
                    } else if (dktUtils.window.width() > 768) {
                        if (dktUtils.object.count(tileItem.data.dates) > 48) {
                            showProductionCredits = false;
                        }
                    } else if (dktUtils.window.width() > 736) {
                        if (dktUtils.object.count(tileItem.data.dates) > 16) {
                            showProductionCredits = false;
                        }
                    } else {
                        if (dktUtils.object.count(tileItem.data.dates) > 40) {
                            showProductionCredits = false;
                        }
                    }
                }

                /*jshint multistr: true */
                return '\
                    <h5 class="dkt-cast-info-headline" ng-if="tileItem.data.productionId">{{::\'cast.participating\' | translate}}</h5>\
                    <span class="dkt-cast-info-dates" ng-if="tileItem.data.participationDates" ng-bind-html="tileItem.data.participationDates | html"></span>\
                    <span class="dkt-cast-info-bio" ng-if="!tileItem.data.productionId" ng-bind-html="tileItem.data.description | truncate : 180"></span>\
                    ' + (showProductionCredits ? '<dkt-cast-production-credits title="{{::(tileItem.data.productionId ? \'cast.also_in\' : \'cast.performing_in\') | translate}}" personel-id="{{tileItem.data.personelId}}" production-id="{{tileItem.data.productionId}}"></dkt-cast-production-credits>' : '') + '\
                    <a href="{{tileItem.data.readmoreLink}}" ng-if="tileItem.data.readmoreLink && tileItem.data.readmoreLink !== \'\'" class="dkt-cast-info-readmore">{{::\'cast.readmore\' | translate}}</a>\
                ';
            }

            function sortObjectByKey(obj) {
                var keys = [];
                var sorted_obj = {};

                for(var key in obj){
                    if(obj.hasOwnProperty(key)){
                        keys.push(key);
                    }
                }

                // sort keys
                keys.sort();

                // create new array based on Sorted Keys
                jQuery.each(keys, function(i, key){
                    sorted_obj[key] = obj[key];
                });

                return sorted_obj;
            }
        }
    };
}])

.directive('dktCastProductionCredits', ["$timeout", "dktCast", "dktComponents", function ($timeout, dktCast, dktComponents) {
    return {
        restrict: 'E',
        scope: {
            'personelId': '@',
            'productionId': '@',
            'title': '@'
        },
        replace: true,
        /*jshint multistr: true */
        template: '<div class="dkt-cast-production-credits" ng-show="credits && credits.length > 0">\
            <h5 class="dkt-cast-production-credits-headline" ng-if="title && title !== \'\'">{{title}}</h5>\
            <a ng-href="{{production.pdpUrl}}" class="dkt-cast-production-credits-item" ng-repeat="production in credits" ng-if="production.pdpUrl != \'\'">{{production.productionTitle}}</a>\
            <span class="dkt-cast-production-credits-item" ng-repeat="production in credits" ng-if="production.pdpUrl == \'\'">{{production.productionTitle}}</span>\
            <span class="dkt-cast-production-credits-item-more" ng-if="more">{{\'cast.and_more\' | translate : true}}</span>\
        </div>',
        link: function (scope, element, attrs) {
            scope.credits = [];
            scope.more = false;

            dktCast.getProductions(scope.productionId, scope.personelId, function(response) {
                if (response && response.length > 0) {
                    var creditsCount = 0;
                    var credits = [];
                    var usedProductionIds = [];

                    for (var production in response) {
                        if (parseInt(response[production].prodSeasonNumber, 10) !== parseInt(scope.productionId, 10) && usedProductionIds.indexOf(response[production].prodSeasonNumber) === -1 && response[production].thisSeason) {

                            response[production].pdpUrl = response[production].pdpUrl && response[production].pdpUrl !== '' ? dktComponents.getHost() + response[production].pdpUrl : '';

                            credits.push(response[production]);
                            usedProductionIds.push(response[production].prodSeasonNumber);

                            creditsCount++;

                            if (creditsCount >= 3) {
                                scope.more = true;
                                break;
                            }
                        }
                    }

                    $timeout( function() {
                        scope.credits = credits;
                    });
                }
            });
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.shows
 *
 * @description
 * Description
 */

angular.module('dkt.components.cast.castFilter', [
    'dkt.core.services.localization',
    'dkt.components.misc.filter',
    'dkt.components.misc.datepicker'
])

.factory('dktCastFilter', function() {
    var service = {};

    service.active = false;
    service.exist = false;
    service.show = function() {};
    service.hide = function() {};

    return service;
})

.directive('dktCastFilter', ["$timeout", "dktCast", "dktLocalization", "dktParams", "dktCastFilter", function ($timeout, dktCast, dktLocalization, dktParams, dktCastFilter) {
    return {
        restrict: 'E',
        scope: {
            'productionId': '@'
        },
        replace: true,
        template:'<div class="dkt-cast-filter" ng-class="{\'ready\': ready, \'active\': active}"><dkt-dropdown class="dkt-cast-filter-acts" ng-if="filter.titles.length > 1" simple="true" selected-item="{{filter.filters.title}}" name="title" elements="filter.titles"></dkt-dropdown><dkt-filter class="dkt-cast-filter-selection" elements="filter.selection" name="selection" radio="true"></dkt-filter><div ng-if="filter"><dkt-datepicker ng-class="{\'active\': filter.filters.selection == \'date\'}" dates="filter.dates" on-select-date="setFilter(\'date\', $date)" selected-date="filter.filters.date"></dkt-datepicker></div><div class="dkt-cast-filter-times-container dkt-filter-time" ng-class="{\'active\': filter.times && filter.times.length > 0}"><div class="dkt-cast-filter-times-height-wrapper"><h4 class="dkt-cast-filter-headline">{{::\'cast.select_time\' | translate}}</h4><div class="dkt-cast-filter-times-container-inner"><div class="dkt-cast-filter-times" ng-repeat="timegroup in filter.times"><span class="dkt-button dkt-cast-filter-time" ng-click="setFilter(\'time\', time)" ng-class="{\'selected\': time === filter.filters.time}" ng-class-odd="\'odd\'" ng-repeat="time in timegroup"><span class="front">{{time}}</span> <span class="back">{{time}}</span></span></div></div></div></div><span class="dkt-cast-filter-close" ng-click="close()"></span></div>',
        link: function (scope, element, attrs) {
            var selectedDate = null;

            dktCastFilter.exist = true;

            dktCast.get(scope.productionId, dktParams.getAllFilters(), function() {
                var titles = [];

                if (dktCast.filters.titles.length > 1) {
                    titles.push({
                        value: dktLocalization.getItem('cast', 'all_performances'),
                        key: ''
                    });

                    for (var title in dktCast.filters.titles) {
                        titles.push({
                            value: dktCast.filters.titles[title],
                            key: dktCast.filters.titles[title].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/ig,'')
                        });
                    }
                }

                scope.filter = {
                    titles: titles,
                    selection: [
                        {
                            name: dktLocalization.getItem('cast', 'cast') + ': ' + dktLocalization.getItem('cast', 'all_days'),
                            value: 'all'
                        },
                        {
                            name: dktLocalization.getItem('cast', 'select_date'),
                            value: 'date'
                        }
                    ],
                    dates: dktCast.filters.dates,
                    times: [],
                    filters: dktParams.getAllFilters()
                };

                if (scope.filter.filters && angular.isDefined(scope.filter.filters.selection) && scope.filter.filters.selection === 'all') {
                    dktParams.setFilter('date', '');
                    dktParams.setFilter('time', '');
                }

                if (scope.filter.filters && (angular.isUndefined(scope.filter.filters.date) || scope.filter.filters.date === '')) {
                    dktParams.setFilter('time', '');
                }

                if (scope.filter.filters && angular.isDefined(scope.filter.filters.date) && scope.filter.filters.date !== '' && angular.isDefined(dktCast.filters.dates[scope.filter.filters.date]) && dktCast.filters.dates[scope.filter.filters.date].times && dktCast.filters.dates[scope.filter.filters.date].times.length > 1) {
                    scope.filter.times = [dktCast.filters.dates[scope.filter.filters.date].times];
                }
            });

            dktCastFilter.show = function() {
                scope.active = dktCastFilter.active = true;
            };

            dktCastFilter.hide = function() {
                scope.active = dktCastFilter.active = false;
            };

            scope.close = function() {
                dktCastFilter.hide();
            };

            scope.setFilter = function(name, value) {
                dktParams.setFilter(name, value);
            };

            var urlListener = scope.$on('$locationChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (angular.isDefined(scope.filter)) {
                    scope.filter.filters = dktParams.getAllFilters();

                    if (scope.filter.filters && angular.isDefined(scope.filter.filters.selection) && scope.filter.filters.selection === 'all') {
                        dktParams.setFilter('date', '');
                        dktParams.setFilter('time', '');
                    }

                    if (scope.filter.filters && angular.isDefined(scope.filter.filters.date) && scope.filter.filters.date !== selectedDate) {
                        dktParams.setFilter('time', '');
                    }

                    if (scope.filter.filters && angular.isDefined(scope.filter.filters.date) && scope.filter.filters.date !== '' && angular.isDefined(dktCast.filters.dates[scope.filter.filters.date]) && dktCast.filters.dates[scope.filter.filters.date].times && dktCast.filters.dates[scope.filter.filters.date].times.length > 1) {
                        scope.filter.times = [dktCast.filters.dates[scope.filter.filters.date].times];
                    } else {
                        scope.filter.times = [];
                    }

                    selectedDate = scope.filter.filters ? scope.filter.filters.date : null;
                }
            });
        }
    };
}])

.directive('dktFilterTime', ["$timeout", "dktParams", "dktCast", function ($timeout, dktParams, dktCast) {
    return {
        restrict: 'C',
        scope: {},
        link: function (scope, element, attrs) {
            var filters;
            var init = true;

            var urlListener = scope.$on('$locationChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                filters = dktParams.getAllFilters();

                if (filters && angular.isDefined(filters.date) && filters.date !== '' && angular.isDefined(dktCast.filters.dates[filters.date]) && dktCast.filters.dates[filters.date].times && dktCast.filters.dates[filters.date].times.length > 1) {
                    console.log(dktCast.filters.dates[filters.date].times);

                    if (!init) {
                        $(element).css('height', $(element).find('.dkt-cast-filter-times-height-wrapper').outerHeight());
                    }
                } else {
                    $(element).css('height', $(element).find('.dkt-cast-filter-times-height-wrapper').outerHeight());

                    $timeout( function() {
                        $(element).css('height', 0);
                    }, 0, false);
                }
            });

            filters = dktParams.getAllFilters();

            $timeout( function() {
                init = false;
            }, 100, false);
        }
    };
}])
;

/**
 * @ngdoc overview
 * @name dkt.components.calendar.calendarDate
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar.calendarDate', [
    'dkt.core',
    'dkt.core.services.localization',
    'dkt.core.services.utils.touch',
    'dkt.components.calendar.calendarEvent'
])

.constant('dktCalenderDateConfig', {
    'dayNames': ['S\u00f8ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'L\u00f8rdag'],
    'monthNames': ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December']
})

.filter('getEventsAvailable', function () {
    var getEventsAvailableFilter = function (events) {
        var available = 0;

        for (var eventItem in events) {
            if (events[eventItem].shown) {
                available++;
            }
        }

        return available;
    };

    getEventsAvailableFilter.$stateful = true;

    return getEventsAvailableFilter;
})

.directive('dktCalendarDate', ["$window", "$timeout", "dktLocalization", function ($window, $timeout, dktLocalization) {
    return {
        restrict: 'E',
        scope: {
            'events': '=',
            'date': '@'
        },
        replace: true,
        template:'<div class="calendar-date shown" ng-class="{\'ready\': ready}"><div class="date" dkt-sticky-date><span class="weekday"><span class="long">{{dayOfWeek}}</span> <span class="short">{{dayOfWeekShort}}</span></span> <span class="date"><span>{{dateOfMonth}}</span> <span class="month">{{shortMonthName}}</span></span></div><div class="events"><dkt-calendar-event event="event" ng-repeat="event in events"></dkt-calendar-event></div></div>',
        link: function (scope, element, attrs) {
            angular.element($window).bind('scroll', scroll);

            $timeout(function () {
                scope.ready = true;
            }, 0, false);

            function scroll() {
                scope.$emit('WINDOW_SCROLL');
            }

            var datePieces = angular.isDefined(attrs.date) ? attrs.date.split('-') : null;

            if (datePieces && datePieces.length > 2) {
                var dateObject = new Date(datePieces[2], datePieces[1] - 1, datePieces[0]);

                scope.shortMonthName = dktLocalization.getItem('monthsById', datePieces[1]).substring(0, 3) + '.';
                scope.dayOfWeek = dktLocalization.getItem('weekdays', dateObject.getDay()).name;
                scope.dayOfWeekShort = dktLocalization.getItem('weekdays', dateObject.getDay()).shortName;
                scope.dateOfMonth = dateObject.getDate();
            }

            scope.$on('$Destroy', function () {
                angular.element($window).unbind('scroll', scroll);
            });
        }
    };
}])

.directive('dktStickyDate', ["$window", "dktTouch", function ($window, dktTouch) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var dateElement = element[0];
            var container = element.parent()[0];
            var offset = 0;

            if (!dktTouch.isTouch()) {
                scope.$on('WINDOW_SCROLL', function () {
                    var top = 0;
                    var o = null;

                    if ($window.innerWidth >= 736 && $window.innerWidth <= 1024) {
                        offset = Math.round(($('body').hasClass('app-view') ? 85 : 145) * 0.8);
                    } else {
                        offset = ($('body').hasClass('app-view') ? 85 : 145);
                    }

                    if ((container.offsetTop - offset) <= $window.pageYOffset) {
                        var topOffset = $window.pageYOffset - (container.offsetTop - offset);

                        top = Math.min(topOffset, (container.clientHeight - dateElement.clientHeight));

                        if (top > 0 && top < (container.clientHeight - dateElement.clientHeight)) {
                            dateElement.style.position = 'fixed';
                            dateElement.style.top = offset + 'px';
                            o = dateElement.offsetLeft;
                            o = null;
                        }
                        else {
                            dateElement.style.position = 'relative';
                            dateElement.style.top = top + 'px';
                            o = dateElement.offsetLeft;
                            o = null;
                        }
                    }
                    else {
                        dateElement.style.position = 'relative';
                        dateElement.style.top = '0px';
                        o = dateElement.offsetLeft;
                        o = null;
                    }
                });
            }
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.calendar.calendarEvent
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar.calendarEvent', [
    'duScroll',
    'dkt.core',
    'dkt.core.services.localization',
    'dkt.core.services.utils.images',
    'dkt.components.calendar.calendarEventButton'
])

.constant('dktCalenderEventConfig', {
    'minHeight': 155
})

.directive('dktCalendarEvent', ["$timeout", "$window", "$document", "dktCalenderEventConfig", "dktParams", "dktLocalization", function ($timeout, $window, $document, dktCalenderEventConfig, dktParams, dktLocalization) {
    return {
        restrict: 'E',
        scope: {
            event: '='
        },
        replace: true,
        template:'<div class="calendar-event shown" ng-class="{\'open\': open, \'last\': $last}"><ul class="row"><li class="column time" ng-click="toggleEvent()"><span class="time">{{::event.time}}</span></li><li class="column category-title" ng-click="toggleEvent()"><span class="time" ng-class="{\'no-category\': !event.category || !event.category.name || event.category.name == \'\'}">{{::event.time}}</span> <span class="category"><span class="text">{{::event.category.name}}</span> <span class="keywords" ng-if="::event.keywords">{{::event.keywords}}</span></span> <span class="title"><span class="text"><span>{{::event.title}}</span> <span class="keywords" ng-if="::event.keywords">{{::event.keywords}}</span></span></span></li><li class="column venue" ng-click="toggleEvent()">{{::event.venue.group.name}}</li><li class="column price" ng-click="toggleEvent()"><span class="value" ng-if="::event.price != \'\'" ng-bind-html="::event.price"></span> <span class="free" ng-if="::event.price == \'\' && !soldout && !event.external">{{::\'event.free\' | translate}}</span></li><li class="column action"><dkt-calendar-event-button ng-if="button && !button.hide" color="{{button.color}}" title="{{button.title}}" title-mobile="{{button.titleMobile}}" splash="{{button.splash}}" href="{{button.href}}" target="{{button.target}}"></dkt-calendar-event-button></li></ul><div class="details" ng-if="open"><div class="details-inner clearfix" ng-class="{\'has-image\': hasImage}"><div class="image" ng-if="::hasImage"><img ng-src="{{::event.imageUrl}}" dkt-image-load="imageLoaded()"></div><div class="meta"><span class="venue">{{::event.venue.name}}</span> <span class="price"><span class="value" ng-if="::event.price != \'\'" ng-bind-html="::event.price"></span> <span class="free" ng-if="::event.price == \'\' && !soldout && !event.external">{{::\'event.free\' | translate}}</span></span></div><div class="description"><span class="description-inner" ng-bind-html="::event.description | html"></span> <a ng-href="{{::event.urls.details}}" ng-if="::event.urls.details !== \'\'" class="btn btn-readmore">{{::\'event.readmore\' | translate}}</a> <span class="btn-close" ng-click="close()">{{::\'misc.close\' | translate}}</span></div></div></div></div>',
        link: function (scope, element, attrs) {
            var offset;
            var noEventOpen = true;
            var button = {
                title: dktLocalization.getItem('event', 'buy'),
                titleMobile: dktLocalization.getItem('event', 'buy').substring(0, 3),
                disabled: false
            };

            if (!scope.event.onSale && !scope.event.external && scope.event.urls.details !== '') {
                button.title = dktLocalization.getItem('event', 'not_available');
                button.titleMobile = dktLocalization.getItem('event', 'not_available');
                button.href = scope.event.urls.details;
            }

            if (scope.event.available === 'udsolgt' || scope.event.available === 'sold out' || scope.event.seats === 0) {
                if (scope.event.onSale || scope.event.external) {
                    button.title = dktLocalization.getItem('event', 'soldout');
                    button.titleMobile = dktLocalization.getItem('event', 'soldout');
                    button.disabled = true;

                    button.href = '';
                }

                scope.soldout = true;
            }

            if (scope.event.cancelled) {
                button.color = 'dark';
                button.title = dktLocalization.getItem('event', 'cancelled');
                button.titleMobile = dktLocalization.getItem('event', 'cancelled');
                button.disabled = true;
                scope.event.available = '';
                button.href = '';
            }
            else {
                button.color = 'light';
            }

            if ((scope.event.onSale || scope.event.external) && scope.event.available !== '') {
                button.splash = scope.event.available;

                if (button.splash.toLowerCase().indexOf('f\u00e5 ledige') !== -1 || button.splash.toLowerCase().indexOf('limited availability') !== -1) {
                    button.splash = dktLocalization.getItem('event', 'few_tickets');
                    button.titleMobile = dktLocalization.getItem('event', 'few_tickets');
                }
            }

            if (!button.disabled && scope.event.urls.buy !== '' && (scope.event.onSale || scope.event.external)) {
                button.href = scope.event.urls.buy;
                button.target = scope.event.urls.buyTarget;
            }
            else if ((!scope.event.onSale && !scope.event.external) && !button.disabled && scope.event.urls.details === '') {
                button.hide = true;
            } else if (!button.disabled && scope.event.urls.details !== '') {
                button.href = scope.event.urls.details;

                button.title = dktLocalization.getItem('event', 'not_available');
                button.titleMobile = dktLocalization.getItem('event', 'not_available');
            }

            element[0].style.animationDelay =
            element[0].style.WebkitAnimationDelay =
            element[0].style.MsAnimationDelay = (scope.event.applyCount * 0.07) + 's';

            scope.button = button;
            scope.hasImage = scope.event.imageUrl !== '' ? true : false;
            scope.ready = scope.hasImage ? false : true;
            scope.open = false;
            scope.toggleEvent = function () {
                if (dktParams.get('id') == scope.event.id) {
                    dktParams.set('id', '');
                }
                else {
                    dktParams.set('id', scope.event.id);
                }
            };

            scope.imageLoaded = function () {
                scope.ready = true;
            };

            scope.toggle = function () {
                noEventOpen = true;

                if (scope.open) {
                    $timeout(function () {
                        if ($window.innerWidth >= 736 && $window.innerWidth <= 1024) {
                            $document.scrollToElementAnimated(element, ($('body').hasClass('app-view') ? 47 : 119), 400);
                        } else {
                            $document.scrollToElementAnimated(element, ($('body').hasClass('app-view') ? 59 : 119), 400);
                        }
                    }, noEventOpen ? 100 : 100);
                }
            };

            scope.close = function () {
                dktParams.set('id', '');
            };

            var locationChangeStart = scope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $timeout(function () {
                    if (dktParams.get('id') === scope.event.id) {
                        scope.open = true;

                        scope.toggle();
                    }
                    else if (scope.open) {
                        scope.open = false;

                        scope.toggle();
                    }

                    if (dktParams.get('id') && dktParams.get('id') !== '') {
                        noEventOpen = false;
                    } else {
                        noEventOpen = true;
                    }
                }, 0);
            });

            if (dktParams.get('id') === scope.event.id) {
                scope.open = true;

                $timeout(function () {
                    scope.toggle();
                }, 1000, false);
            }

            if (dktParams.get('id') && dktParams.get('id') !== '') {
                $timeout(function () {
                    noEventOpen = false;
                }, 1050, false);
            }

            scope.$on('$Destroy', function () {
                locationChangeStart();
            });
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.calendar.calendarEvent
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar.calendarEventButton', [
    'dkt.core'
])

.directive('dktCalendarEventButton', function() {
    return {
        restrict: 'E',
        scope: {
            'title': '@',
            'titleMobile': '@',
            'subtitle': '@',
            'splash': '@',
            'color': '@',
            'href': '@'
        },
        replace: true,
        template:'<a class="calendar-event-button" ng-class="::buttonClass"><span class="splash" ng-bo="splash">{{splash}}</span> <span class="title"><span class="desktop">{{title}}</span> <span class="mobile">{{titleMobile}}</span></span></a>',
        link: function(scope, element, attrs) {
            scope.buttonClass = {};

            if (angular.isDefined(scope.color) && scope.color !== '') {
                scope.buttonClass[scope.color] = true;
            }

            if (angular.isDefined(scope.subtitle) && scope.subtitle !== '') {
                scope.buttonClass['has-subtitle'] = true;
            }

            if (angular.isUndefined(scope.href) || scope.href === '') {
                scope.buttonClass.disabled = true;
            }

            if (scope.titleMobile.length > 5) {
                scope.buttonClass['small-text'] = true;
            }
        }
    };
})

;

/**
 * @ngdoc overview
 * @name dkt.components.calendar.calendarFilter
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar.calendarFilter', [
    'dkt.core',
    'dkt.core.services.localization',
    'dkt.core.services.utils.touch'
])

.filter('activeCount', function() {
    var activeCount = function(options) {
        var active = 0;

        for (var item in options) {
            if (options[item].active === true && options[item].value !== '') {
                active++;
            }
        }

        return (active === 0 ? '' : active);
    };

    activeCount.$stateful = true;

    return activeCount;
})

.directive('dktCalendarFilter', ["$window", "$document", "dktParams", "dktUtils", "dktTouch", "dktLocalization", "$timeout", function($window, $document, dktParams, dktUtils, dktTouch, dktLocalization, $timeout) {
    return {
        restrict: 'E',
        scope:  {
            'filterName': '@',
            'filterTitle': '@',
            'filterTitleMobile': '@',
            'filterSuboptionsId': '@',
            'filterOptions': '=',
            'filterAdvanced': '='
        },
        replace: true,
        template:'<div class="calendar-filter" ng-class="{\'active\': active}"><div class="filter-toggle" ng-click="toggle()"><span class="filter-toggle-inner"><span class="desktop">{{filterTitle}}</span> <span class="mobile">{{filterTitleMobile}}</span></span></div><div class="filter-drop-mask"><div class="filter-drop" ng-if="active && !filterAdvanced"><div class="filter-drop-inner"><span class="filter-option" ng-class="{\'active\': option.active, \'has-image\': option.image}" ng-repeat="option in filterOptions | orderBy : \'order\'" ng-click="setFilter(option)"><img ng-if="option.image" ng-src="{{option.image}}"> {{option.name}}</span></div></div><div class="filter-drop advanced" ng-class="{\'category-selected\': currentCategory}" ng-if="active && filterAdvanced"><div class="filter-main-options"><span class="filter-option" ng-class="{\'active\': option.active, \'selected\': option.selected, \'default\': option.value == \'\'}" ng-repeat="option in filterOptions | orderBy : \'order\'"><span class="checkbox" ng-click="setCategory(option)"></span> <span class="name" ng-click="setCategory(option)">{{option.name}}</span> <span class="count">{{option.suboptions | activeCount}}</span></span> <span class="btn-close-category" ng-click="closeCategory()"></span></div><div class="filter-sub-options"><span class="btn-close-advanced-filter" ng-click="toggle()">{{\'misc.close\' | translate}}</span> <span class="sub-filter-title" ng-class="{\'changed\': changed}">{{currentCategory ? currentCategory.name : defaultCategoryTitle}}</span> <span class="filter-desc" ng-if="allShown && suboptions.length == 0">{{\'filters.category_all_shown_description\' | translate}}</span> <span class="filter-desc" ng-if="suboptions.length == 0">{{\'filters.category_select_description\' | translate}}<b></b></span> <span class="option-container"><span class="filter-option clearfix" ng-class="{\'active\': suboption.active, \'default\': suboption.value == \'\'}" ng-repeat="suboption in suboptions | orderBy : [\'order\', \'name\']" ng-click="setFilter(suboption, true)">{{suboption.name}}</span></span> <span class="btn btn-show-results" ng-click="toggle()"><span class="description">{{\'filters.show_results\' | translate}}</span> <span class="results-count" ng-repeat="result in resultCount">{{result}}</span></span></div></div></div></div>',
        link: function(scope, element, attrs) {
            var defaultTitle = scope.filterTitle;
            var defaultTitleMobile = scope.filterTitleMobile;
            var noTitleUpdate = false;

            scope.$watch('filterTitle', function() {
                if (!noTitleUpdate) {
                    defaultTitle = scope.filterTitle;
                    defaultTitleMobile = scope.filterTitleMobile;
                    scope.defaultCategoryTitle = dktLocalization.getItem('filters', 'category_headline');

                    //checkActiveOptions(scope.filterName, scope.filterOptions, false, true);
                }

                noTitleUpdate = false;
            });

            var checkActiveOptions = function(paramName, options, suboption, titleUpdate) {
                suboption = suboption || false;
                titleUpdate = titleUpdate || false;

                var suboptionsId = (angular.isDefined(scope.filterSuboptionsId) ? scope.filterSuboptionsId : 'sub-' + scope.filterName);
                var activeOptionsList = dktParams.getFilter(paramName);
                var activeSuboptionsList;
                var option;
                var allSelected = true;
                var eventCount = 0;
                var suboptionItem;
                var activeOptionTitles = [];
                var tmpFilterTitle = '';

                if (angular.isUndefined(scope.filterTitleMobile) || scope.filterTitleMobile === '') {
                    scope.filterTitleMobile = scope.filterTitle;
                }

                if (!activeOptionsList) {
                    activeOptionsList = [];
                } else {
                    activeOptionsList = activeOptionsList.split(',');
                }

                if (scope.filterAdvanced && !suboption) {
                    activeSuboptionsList = dktParams.getFilter(suboptionsId);

                    if (!activeSuboptionsList) {
                        activeSuboptionsList = [];
                    } else {
                        activeSuboptionsList = activeSuboptionsList.split(',');
                    }
                }

                for (option in options) {
                    option = options[option];

                    if (scope.filterAdvanced && !suboption) {
                        if (activeSuboptionsList.length > 0) {
                            var hasActiveSuboption = false;

                            for (suboptionItem in option.suboptions) {
                                if (activeSuboptionsList.indexOf(option.suboptions[suboptionItem].value) !== -1) {
                                    hasActiveSuboption = true;
                                    option.suboptions[suboptionItem].active = true;

                                    eventCount += option.suboptions[suboptionItem].performanceCount;
                                }
                            }

                            if (hasActiveSuboption) {
                                option.active = true;
                                scope.allShown = false;
                            } else {
                                option.active = false;
                            }

                            hasActiveSuboption = null;
                        } else if (option.value === '') {
                            scope.allShown = true;

                            option.active = true;
                        } else {
                            option.active = false;
                        }
                    } else {
                        if (activeOptionsList.length > 0) {
                            if (activeOptionsList.indexOf(option.value) !== -1) {
                                option.active = true;
                            } else {
                                option.active = false;

                                if (option.value !== '') {
                                    allSelected = false;
                                }
                            }
                        } else if (option.value === '') {
                            if (!suboption) {
                                option.active = true;
                            }
                        } else {
                            option.active = false;
                            allSelected = false;
                        }
                    }

                    if (option.active) {
                        activeOptionTitles.push(option.name.toLowerCase());
                    }
                }

                if (suboption && allSelected) {
                    for (option in options) {
                        option = options[option];

                        if (option.value === '') {
                            option.active = true;
                        }
                    }
                }

                if (scope.filterAdvanced && paramName === 'category' && !suboption) {
                    if (activeSuboptionsList && activeSuboptionsList.length === 0 && allSelected) {
                        eventCount = 0;

                        for (option in options) {
                            option = options[option];

                            for (suboptionItem in option.suboptions) {
                                suboptionItem = option.suboptions[suboptionItem];

                                eventCount += suboptionItem.performanceCount;
                            }
                        }
                    }

                    scope.resultCount = [eventCount.toString()];
                }

                tmpFilterTitle = (activeOptionTitles.length > 0 ? dktUtils.string.capitalize(activeOptionTitles.join(', ')) : '');

                if (tmpFilterTitle !== '') {
                    if (tmpFilterTitle.toLowerCase() === dktLocalization.getItem('misc', 'all').toLowerCase()) {
                        tmpFilterTitle = '';
                    } else {
                        /*if (tmpFilterTitle.length > 10) {
                            tmpFilterTitle = tmpFilterTitle.substring(0, 8) + '..';
                        }*/
                    }
                }

                if (!titleUpdate) {
                    $timeout( function() {
                        if (tmpFilterTitle !== '' && tmpFilterTitle !== defaultTitle) {
                            noTitleUpdate = true;
                        }

                        scope.filterTitle = (tmpFilterTitle !== '' ? tmpFilterTitle : defaultTitle);
                        //scope.filterTitleMobile = (tmpFilterTitle !== '' ? tmpFilterTitle : defaultTitleMobile);

                        tmpFilterTitle = null;
                    });
                }

                suboptionItem = null;
                activeOptionsList = null;
                option = null;
                activeOptionTitles = null;
            };

            scope.active = false;
            scope.suboptions = [];
            scope.currentCategory = null;
            scope.allShown = false;
            scope.changed = false;
            scope.defaultCategoryTitle = dktLocalization.getItem('filters', 'category_headline');
            scope.resultCount = ['0'];

            checkActiveOptions(scope.filterName, scope.filterOptions);

            var documentClick = function(e) {
                if (angular.isDefined(element.children().eq(1).children()[0])) {
                    var barBounds = element.parent()[0].getBoundingClientRect();
                    var elementBounds = element.children().eq(1).children()[0].getBoundingClientRect();

                    if (e.pageY - $window.pageYOffset < barBounds.top - 20 || e.pageY - $window.pageYOffset > barBounds.top + barBounds.height + 50) {
                        if (e.pageY - $window.pageYOffset < elementBounds.top - 20 || e.pageY - $window.pageYOffset > elementBounds.top + elementBounds.height + 50) {
                            $timeout( function() {
                                scope.active = false;
                                $document.unbind('mousedown', documentClick);
                                angular.element($window).unbind('scroll', windowScroll);

                                scope.$emit('FILTER_TOGGLE', scope.active, scope.$id);
                            });
                        }
                    }

                    barBounds = null;
                    elementBounds = null;
                }
            };

            var windowScroll = function(e) {
                $timeout( function() {
                    scope.active = false;
                    $document.unbind('mousedown', documentClick);
                    angular.element($window).unbind('scroll', windowScroll);

                    scope.$emit('FILTER_TOGGLE', scope.active, scope.$id);
                });
            };

            scope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams) {
                var filters = dktParams.getAllFilters();

                if (filters === null) {
                    checkActiveOptions(scope.filterName, scope.filterOptions);

                    for (var option in scope.filterOptions) {
                        scope.filterOptions[option].selected = false;

                        if (scope.filterOptions[option].suboptions) {
                            for (var suboption in scope.filterOptions[option].suboptions) {
                                scope.filterOptions[option].suboptions[suboption].active = false;
                            }
                        }
                    }
                }
            });

            scope.toggle = function() {
                $document.unbind('click', documentClick);
                angular.element($window).unbind('scroll', windowScroll);
                scope.active = !scope.active;

                if ($window.innerWidth > 736) {
                    if (scope.active) {
                        $document.bind('mousedown', documentClick);

                        if (!scope.filterAdvanced) {
                            angular.element($window).bind('scroll', windowScroll);
                        }
                    }
                }

                scope.$emit('FILTER_TOGGLE', scope.active, scope.$id);
            };

            scope.closeCategory = function() {
                if (scope.currentCategory) {
                    scope.currentCategory.selected = false;
                    scope.currentCategory = null;
                }
            };

            scope.setCategory = function(option, setAllActive, setAllInactive) {
                var new_category = ((!scope.currentCategory || (scope.currentCategory && option.name != scope.currentCategory.name)) ? true : false);

                if (new_category) {
                    scope.changed = true;
                }

                if (scope.currentCategory) {
                    scope.currentCategory.selected = false;
                    scope.currentCategory = null;
                }

                if (option.value === '') {
                    scope.setFilter(option);
                } else {
                    setAllActive = setAllActive || false;

                    if (angular.isDefined(option.suboptions) && option.suboptions.length > 0) {
                      scope.suboptions = option.suboptions;
                    } else {
                      scope.suboptions = [];
                    }

                    if ($window.innerWidth > 736 || (!setAllActive && !setAllInactive)) {
                        scope.currentCategory = option;
                        scope.currentCategory.selected = true;
                    }

                    if (setAllActive || setAllInactive) {
                        var suboption;

                        var activeOptionsList = dktParams.getFilter((angular.isDefined(scope.filterSuboptionsId) ? scope.filterSuboptionsId : 'sub-' + scope.filterName));

                        if (!activeOptionsList) {
                            activeOptionsList = [];
                        } else {
                            activeOptionsList = activeOptionsList.split(',');
                        }

                        for (suboption in scope.suboptions) {
                            scope.suboptions[suboption].active = setAllActive;

                            var foundSuboptionIndex = activeOptionsList.indexOf(scope.suboptions[suboption].value);

                            if (foundSuboptionIndex === -1) {
                                if (setAllActive && scope.suboptions[suboption].value !== '') {
                                    activeOptionsList.push(scope.suboptions[suboption].value);
                                }
                            } else if (setAllInactive || activeOptionsList[foundSuboptionIndex] === '') {
                                activeOptionsList.splice(foundSuboptionIndex, 1);
                            }
                        }

                        activeOptionsList = activeOptionsList.join(',');

                        dktParams.setFilter((angular.isDefined(scope.filterSuboptionsId) ? scope.filterSuboptionsId : 'sub-' + scope.filterName), activeOptionsList);

                        suboption = null;
                    } else {
                        checkActiveOptions((angular.isDefined(scope.filterSuboptionsId) ? scope.filterSuboptionsId : 'sub-' + scope.filterName), scope.suboptions, true);
                    }
                }

                if (new_category) {
                    $timeout(function () {
                        scope.changed = false;
                    }, 0, false);
                }
            };

            scope.setFilter = function(option, suboption) {
                suboption = suboption || false;

                var paramName = (suboption ? (angular.isDefined(scope.filterSuboptionsId) ? scope.filterSuboptionsId : 'sub-' + scope.filterName) : scope.filterName);

                if (scope.filterAdvanced && !suboption && option.value === '') {
                    dktParams.setFilter((angular.isDefined(scope.filterSuboptionsId) ? scope.filterSuboptionsId : 'sub-' + scope.filterName), '');

                    if (scope.currentCategory) {
                        scope.currentCategory.selected = false;
                    }

                    scope.currentCategory = null;
                    scope.suboptions = [];

                    checkActiveOptions(scope.filterName, scope.filterOptions);
                } else {
                    if ((scope.filterAdvanced && !suboption) || (suboption && option.value === '')) {
                        option.active = !option.active;
                    } else {
                        if (option.value === '') {
                            dktParams.setFilter(paramName, '');
                        } else {
                            var activeOptionsList = dktParams.getFilter(paramName);
                            var optionIndex;

                            if (!activeOptionsList) {
                                activeOptionsList = [];
                            } else {
                                activeOptionsList = activeOptionsList.split(',');
                            }

                            optionIndex = activeOptionsList.indexOf(option.value);

                            if (optionIndex === -1) {
                                activeOptionsList.push(option.value);
                            } else {
                                activeOptionsList.splice(optionIndex, 1);
                            }

                            activeOptionsList = activeOptionsList.join(',');

                            dktParams.setFilter(paramName, activeOptionsList);

                            activeOptionsList = null;
                            optionIndex = null;
                        }

                        checkActiveOptions(paramName, (suboption ? scope.suboptions : scope.filterOptions), suboption);

                        if (suboption) {
                            checkActiveOptions(scope.filterName, scope.filterOptions);
                        } else {
                            angular.element($window).unbind('scroll', windowScroll);

                            $timeout( function() {
                                if ($window.innerWidth > 736) {
                                    if (scope.active) {
                                        if (!scope.filterAdvanced) {
                                            angular.element($window).bind('scroll', windowScroll);
                                        }
                                    }
                                }
                            }, 600, false);
                        }
                    }

                    if (scope.filterAdvanced && !suboption) {
                        scope.setCategory(option, option.active, !option.active);

                        checkActiveOptions(scope.filterName, scope.filterOptions);
                    } else if (scope.filterAdvanced && suboption && option.value === '') {
                        scope.setCategory(scope.currentCategory, option.active, !option.active);

                        checkActiveOptions(scope.filterName, scope.filterOptions);
                    }
                }
            };

            scope.$parent.$parent.$on('FILTER_TOGGLE', function(e, toggleOn, scopeId) {
                if (scope.$id !== scopeId && scope.active && toggleOn) {
                    scope.active = false;
                }
            });
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.calendar.calendarFilterBar
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar.calendarFilterBar', [
    'dkt.core',
    'dkt.core.services.localization',
    'dkt.core.services.productions',
    'dkt.components.calendar.calendarFilter'
])

.directive('dktCalendarFilterBar', ["$timeout", "dktParams", "dktUtils", "dktLocalization", "dktProductions", function($timeout, dktParams, dktUtils, dktLocalization, dktProductions) {
    return {
        restrict: 'E',
        scope: false,
        replace: true,
        template:'<div class="calendar-filter-bar" ng-class="{\'extra-filters-open\': extraFiltersOpen}"><dkt-calendar-filter class="{{key}}" filter-name="{{key}}" filter-options="filter.options" filter-advanced="filter.advanced" filter-title="{{filter.title}}" filter-title-mobile="{{filter.titleMobile}}" filter-suboptions-id="{{filter.suboptionsId}}" ng-repeat="(key, filter) in filters"></dkt-calendar-filter><span class="btn-extra-filters" ng-click="toggleExtraFilters()"><span class="text">{{\'misc.filter\' | translate}}</span></span> <span class="btn-close" ng-click="reset()" ng-class="{\'active\' : resetActive, \'filter-open\': filterOpen}"></span></div>',
        link: function(scope, element, attrs) {
            var checkFilters = function() {
                var filters = dktParams.getAllFilters();

                if (filters === null) {
                    scope.resetActive = false;
                }
                else {
                    scope.resetActive = true;
                }

                scope.$evalAsync();
            };

            checkFilters();

            scope.filterOpen = false;
            scope.extraFiltersOpen = false;
            scope.toggleExtraFilters = function() {
                scope.extraFiltersOpen = !scope.extraFiltersOpen;

                scope.$emit('FILTER_TOGGLE', true, 'none');
            };

            scope.$on('FILTER_TOGGLE', function(e, toggleOn, scopeId) {
                $timeout( function() {
                    scope.filterOpen = toggleOn;
                }, 50);
            });

            scope.reset = function () {
                dktParams.resetFilters();
                checkFilters();
            };

            scope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams) {
                checkFilters();
            });

            dktLocalization.init({}, function() {
                dktProductions.get({}, function() {
                    var weekdayOptions = dktLocalization.getItem('weekdays');
                    var categoryOptions = dktLocalization.getItem('categories');
                    var venueOptions = dktLocalization.getItem('venues');
                    var priceOptions = dktLocalization.getItem('prices');

                    for (var category in categoryOptions) {
                        category = categoryOptions[category];
                        category.suboptions = dktProductions.getByCategory(category.id);

                        if (category.suboptions) {
                            category.suboptions.unshift({name: dktLocalization.getItem('misc', 'all_shows'), 'value': '', 'order': 0, 'performanceCount': 0});
                        }
                    }

                    weekdayOptions.unshift({name: dktLocalization.getItem('misc', 'all'), 'value': '', 'order': 0});
                    categoryOptions.unshift({name: dktLocalization.getItem('misc', 'all'), 'value': '', 'order': 0});
                    priceOptions.unshift({name: dktLocalization.getItem('misc', 'all'), 'value': '', 'order': 0});

                    scope.filters = {
                        weekday: {
                            title: dktLocalization.getItem('filters', 'weekday'),
                            titleMobile: (dktLocalization.getItem('filters', 'weekday').length > 3 ? dktLocalization.getItem('filters', 'weekday').substring(3) : dktLocalization.getItem('filters', 'weekday')),
                            options: weekdayOptions
                        },
                        category: {
                            title: dktLocalization.getItem('filters', 'category'),
                            titleMobile: dktLocalization.getItem('filters', 'category'),
                            advanced: true,
                            suboptionsId: 'title',
                            options: categoryOptions
                        },
                        venue: {
                            title: dktLocalization.getItem('filters', 'venue'),
                            titleMobile: dktLocalization.getItem('filters', 'venue'),
                            options: venueOptions
                        },
                        price: {
                            title: dktLocalization.getItem('filters', 'price'),
                            titleMobile: dktLocalization.getItem('filters', 'price'),
                            options: priceOptions
                        }
                    };

                    scope.$broadcast('FILTERS_READY');
                });
            });
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.calendar.calendarMonth
 *
 * @description
 * Description
 */

angular.module('dkt.components.calendar.calendarMonth', [
    'dkt.core',
    'dkt.core.services.localization',
    'dkt.components.calendar.calendarDate',
    'dkt.components.misc.dropdown'
])

.filter('getMonthEventsAvailable', function() {
    var getMonthEventsAvailableFilter = function(dates) {
        var available = 0;

        for (var date in dates) {
            for (var eventItem in dates[date].events) {
                if (dates[date].events[eventItem].shown) {
                    available++;
                }
            }
        }

        return available;
    };

    getMonthEventsAvailableFilter.$stateful = true;

    return getMonthEventsAvailableFilter;
})

.directive('dktCalendarMonth', ["dktParams", "dktLocalization", function(dktParams, dktLocalization) {
    return {
        restrict: 'E',
        scope: {
            'dates': '=',
            'month': '@',
            'totalEvents': '@'
        },
        replace: true,
        template:'<div class="calendar-month shown"><div class="header"><div class="name"><dkt-dropdown onchange="monthChange" selected-label="{{ monthIndex }}-{{ year }}" selected-item="{{ currentMonthSelected }}" groups="months" ng-if="::months"></dkt-dropdown></div><span class="results"><span ng-bind="totalEvents"></span> {{totalEvents > 1 ? \'misc.events\' : \'misc.event\' | translate : true}}</span></div><dkt-calendar-date date="{{ dateId }}" events="date.events" ng-repeat="(dateId, date) in dates"></dkt-calendar-date><div class="no-results" ng-if="!dates || dates.length == 0">{{\'event.no_results_month\' | translate}}</div></div>',
        link: function(scope, element, attrs) {
            var monthPieces = angular.isDefined(attrs.month) ? attrs.month.split('-') : null;

            if (monthPieces && monthPieces.length > 1) {
                scope.monthName = dktLocalization.getItem('monthsById', monthPieces[0]);
                scope.monthIndex = monthPieces[0];
                scope.year = monthPieces[1];
            }

            scope.months = [];

            var currentMonth = parseInt(new Date().getMonth() + 1, 10);
            var currentYear = parseInt(new Date().getFullYear(), 10);
            var monthsLeft = 16;
            var i = 0;

            scope.currentMonthSelected = dktParams.get('start');

            if (!scope.currentMonthSelected) {
                scope.currentMonthSelected = (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
            }

            while (monthsLeft > 0 && i < 100) {
                var yearExists = null;

                for (var group in scope.months) {
                    if (scope.months[group].label == currentYear) {
                        yearExists = scope.months[group];
                    }
                }

                if (yearExists === null) {
                    scope.months.push({
                        'label': currentYear + '',
                        'items': [
                            {
                                'key': currentMonth + '-' + currentYear,
                                'value': dktLocalization.getItem('monthsById', currentMonth)
                            }
                        ]
                    });
                }
                else {
                    yearExists.items.push({
                        'key': currentMonth + '-' + currentYear,
                        'value': dktLocalization.getItem('monthsById', currentMonth)
                    });
                }

                currentMonth++;
                monthsLeft--;

                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }

                i++;
            }

            scope.monthChange = function (index) {
                if (index != dktParams.get('start')) {
                    dktParams.set('start', index);
                    dktParams.unset('id');

                    return true;
                }

                return false;
            };

            monthPieces = null;
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.misc.advancedTiles
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.advancedTiles', [
    'ngTouch',
    'dkt.components.misc.advancedTiles.advancedTile'
])

.directive('dktAdvancedTiles', ["$window", "$timeout", "dktParams", "dktUtils", function($window, $timeout, dktParams, dktUtils) {
    return {
        restrict: 'E',
        scope: {
            'elements': '=',
            'size': '@',
            'paramId': '@'
        },
        replace: true,
        template:'<div class="dkt-advanced-tiles columns-{{size}} clearfix" ng-class="tilesClass" ng-style="tilesStyle"><dkt-advanced-tile ng-click="tileClick(tile)" on-close="tileClose()" get-tile="getTile(index)" tile="tile" total-tiles="{{render_elements.length}}" ng-repeat="(key, tile) in render_elements track by tile.index"></dkt-advanced-tile><div class="dkt-advanced-tiles-overlay" ng-if="overlayActive" ng-click="tileClose()"></div></div>',
        link: function(scope, element, attrs) {
            scope.tilesStyle = {};
            scope.render_elements = [];
            scope.activeTile = null;
            scope.paramId = scope.paramId || 'tileId';
            scope.tilesClass = {};
            scope.overlayActive = false;
            scope.size = angular.isDefined(scope.size) && scope.size !== '' ? scope.size : 'medium';
            scope.columnsPrRow = dktUtils.window.width() > 736 ? (angular.isDefined(scope.size) && scope.size === 'small' ? 7 : 5) : 3;

            scope.$watch('elements', function(elements) {
                //if (elements) {
                    var tile;

                    for (tile in elements) {
                        tile = elements[tile];

                        switch (tile.preferedFormat) {
                            case 'portrait':
                                tile.image = tile.imageMobileHeroUrl;
                            break;
                            case 'landscape':
                                tile.image = tile.imageHeroUrl;
                            break;
                            default:
                                tile.image = tile.imageThumbnailUrl;
                            break;
                        }

                        if (tile.text && tile.text !== '') {
                            tile.initials = getInitials(tile.text);
                        }
                    }

                    //elements = shuffle(elements);

                    if (elements && elements.length > 0) {
                        elements = sortTiles(elements);
                    }

                    scope.render_elements = elements;

                    if (scope.render_elements && scope.render_elements.length > 0) {
                        $timeout( function() {
                            setActiveTile();
                        });

                    }

                    tile = null;
                //}
            });

            scope.tileClick = function(tile) {
                if (!scope.activeTile) {
                    dktParams.set(scope.paramId, tile.id);
                } else {
                    //dktParams.unset(scope.paramId);
                }
            };

            scope.getTile = function(index) {
                return (angular.isDefined(scope.render_elements[index]) ? scope.render_elements[index] : null);
            };

            scope.tileClose = function() {
                dktParams.unset(scope.paramId);
            };

            function sortTiles(tiles, keepIndex) {
                keepIndex = keepIndex || false;

                var sortedTiles = [];
                var tilesToAdd = angular.copy(tiles);
                var tile;
                var totalTiles = tilesToAdd.length;
                var foundFittingTile;
                var maxColumnsPrRow = scope.columnsPrRow;
                var rowCount = 0;
                var rowColumnCount = 0;
                var tileSize;
                var rowSize;
                var blockedRowSpaces = [];
                var tileInBlockedSpace;
                var rowBlockCount;
                var tryingDefaultFormat = false;
                var tileIndex;
                var tileSizes = {
                    portrait: {
                        rows: 2,
                        columns: 2
                    },
                    landscape: {
                        rows: 2,
                        columns: 3
                    }
                };

                var tileSizeDimensions = {};

                tileSizeDimensions.width = ($(element).outerWidth()) / maxColumnsPrRow;
                tileSizeDimensions.height = tileSizeDimensions.width * 1.25;

                for (tileIndex in tilesToAdd) {
                    tilesToAdd[tileIndex].tileIndex = tileIndex;
                }

                for (var tileCount = 0; tileCount < totalTiles; tileCount++) {
                    foundFittingTile = false;

                    for (tileIndex in tilesToAdd) {
                        tile = tilesToAdd[tileIndex];

                        tileSize = (angular.isDefined(tileSizes[tile.preferedFormat]) ? tileSizes[tile.preferedFormat].columns : 1);
                        rowSize = (angular.isDefined(tileSizes[tile.preferedFormat]) ? tileSizes[tile.preferedFormat].rows : 1);

                        tileInBlockedSpace = false;

                        if (angular.isDefined(blockedRowSpaces[rowCount]) && angular.isArray(blockedRowSpaces[rowCount])) {
                            for (var blockedSpace in blockedRowSpaces[rowCount]) {
                                blockedSpace = blockedRowSpaces[rowCount][blockedSpace];

                                if (rowColumnCount === blockedSpace.from) {
                                    rowColumnCount = blockedSpace.to;
                                }

                                if ((rowColumnCount < blockedSpace.to) && (rowColumnCount + tileSize > blockedSpace.from)) {
                                    tileInBlockedSpace = true;
                                }
                            }
                        }

                        if (rowColumnCount + tileSize <= maxColumnsPrRow && !tileInBlockedSpace) {
                            foundFittingTile = true;

                            for (rowBlockCount = 1; rowBlockCount < rowSize; rowBlockCount++) {
                                if (angular.isUndefined(blockedRowSpaces[rowCount + rowBlockCount])) {
                                    blockedRowSpaces[rowCount + rowBlockCount] = [];
                                }

                                blockedRowSpaces[rowCount + rowBlockCount].push({
                                    from: rowColumnCount,
                                    to: rowColumnCount + tileSize
                                });
                            }

                            if (keepIndex) {
                                tiles[tile.tileIndex].column = rowColumnCount;
                                tiles[tile.tileIndex].row = rowCount;
                                tiles[tile.tileIndex].style = {
                                    left: (rowColumnCount * tileSizeDimensions.width) + 'px',
                                    top: (rowCount * tileSizeDimensions.height) + 'px',
                                    '-webkit-animation-delay': (sortedTiles.length * 70) + 'ms',
                                    '-moz-animation-delay': (sortedTiles.length * 70) + 'ms',
                                    'animation-delay': (sortedTiles.length * 70) + 'ms'
                                };

                                tilesToAdd.splice(tileIndex, 1);
                            } else {
                                tile.column = rowColumnCount;
                                tile.row = rowCount;
                                tile.style = {
                                    left: (rowColumnCount * tileSizeDimensions.width) + 'px',
                                    top: (rowCount * tileSizeDimensions.height) + 'px',
                                    '-webkit-animation-delay': (sortedTiles.length * 70) + 'ms',
                                    '-moz-animation-delay': (sortedTiles.length * 70) + 'ms',
                                    'animation-delay': (sortedTiles.length * 70) + 'ms'
                                };

                                sortedTiles.push(tilesToAdd.splice(tileIndex, 1)[0]);
                            }

                            rowColumnCount += tileSize;

                            if (rowColumnCount === maxColumnsPrRow) {
                                rowCount++;
                                rowColumnCount = 0;
                            }

                            break;
                        }
                    }

                    if (!foundFittingTile && tileCount > 0) {
                        //if (tryingDefaultFormat) {
                            rowCount++;
                            rowColumnCount = 0;
                            tryingDefaultFormat = false;
                        //} else {
                            //tilesToAdd[0].preferedFormat = 'standard';
                            //tryingDefaultFormat = true;
                        //}

                        tileCount--;
                    }
                }

                if (angular.isDefined(blockedRowSpaces[rowCount + 1])) {
                    rowCount += 1;
                }

                rowCount += 1;

                scope.tilesStyle.height = (rowCount * tileSizeDimensions.height) + 'px';

                return keepIndex ? tiles : sortedTiles;
            }

            scope.$on('$locationChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (angular.isDefined(scope.render_elements) && scope.render_elements.length > 0) {
                    setActiveTile();
                }
            });

            var toggleTilePromise = null;
            function setActiveTile() {
                var activeTileId = dktParams.get(scope.paramId);

                if (activeTileId && activeTileId === '') {
                    activeTileId = null;
                }

                if (activeTileId) {
                    activeTileId = activeTileId;
                }

                if (scope.activeTile !== activeTileId) {
                    if (toggleTilePromise) {
                        $timeout.cancel(toggleTilePromise);
                        toggleTilePromise = null;
                    }

                    var lastActiveTile = null;

                    if (scope.activeTile) {
                        lastActiveTile = getTileById(scope.activeTile);

                        if (lastActiveTile) {
                            lastActiveTile.active = false;
                            lastActiveTile.closing = true;
                        }
                    }

                    scope.tilesClass['transition-tiles'] = true;

                    toggleTilePromise = $timeout( function() {
                        if (lastActiveTile) {
                            lastActiveTile.closing = false;
                        }

                        scope.tilesClass['transition-tiles'] = false;
                    }, 500);

                    scope.activeTile = activeTileId;

                    if (scope.activeTile) {
                        var activeTile = getTileById(scope.activeTile);

                        if (activeTile) {
                            activeTile.active = true;
                            scope.overlayActive = true;
                        }
                    } else {
                        scope.overlayActive = false;
                    }
                }

                scope.tilesClass['tile-selected'] = activeTileId ? true : false;
            }

            var resizePromise = null;
            angular.element($window).bind('resize orientationchange', function () {
                if (resizePromise) {
                    $timeout.cancel(resizePromise);
                    resizePromise = null;
                }

                resizePromise = $timeout( function() {
                    scope.tilesClass['transition-tiles'] = true;

                    sortTiles(scope.render_elements, true);

                    $timeout( function() {
                        scope.tilesClass['transition-tiles'] = false;
                    }, 500);
                }, 300);
            });

            function getInitials(string) {
                var names = string.split(' '),
                    initials = names[0].substring(0, 1).toUpperCase();

                if (names.length > 1) {
                    initials += names[names.length - 1].substring(0, 1).toUpperCase();
                }

                return initials;
            }

            function getTileById(tileId) {
                for (var tile in scope.render_elements) {
                    if (scope.render_elements[tile].id.toString() === tileId.toString()) {
                        return scope.render_elements[tile];
                    }
                }

                return null;
            }

            function shuffle(a) {
                var j, x, i, shuffled = [];
                for (i = a.length; i; i--) {
                    j = Math.floor(Math.random() * i);

                    shuffled.push(a.splice(j, 1)[0]);
                }

                return shuffled;
            }
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.misc.datepicker
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.datepicker', [
    'ngTouch',
    'dkt.core'
])

.directive('dktDatepicker', ["$timeout", "dktParams", "dktComponents", "dktLocalization", function($timeout, dktParams, dktComponents, dktLocalization) {
    return {
        restrict: 'E',
        scope: {
            'dates': '=',
            'selectedDate': '=',
            'onSelectDate': '&'
        },
        replace: true,
        template:'<div class="dkt-datepicker"><div class="dkt-datepicker-header"><span class="dkt-datepicker-navigation previous" ng-click="previous()"></span> <span class="dkt-datepicker-month-name {{direction}}" ng-repeat="monthName in currentMonth">{{monthName.name}} <span class="dkt-datepicker-next-month-count" ng-if="datesNextMonth > 0">{{datesNextMonth}}</span></span> <span class="dkt-datepicker-navigation next" ng-click="next()"></span></div><div class="dkt-datepicker-daynames"><span class="dkt-datepicker-dayname">{{weekdays.mon}}</span> <span class="dkt-datepicker-dayname">{{weekdays.tue}}</span> <span class="dkt-datepicker-dayname">{{weekdays.wed}}</span> <span class="dkt-datepicker-dayname">{{weekdays.thu}}</span> <span class="dkt-datepicker-dayname">{{weekdays.fri}}</span> <span class="dkt-datepicker-dayname">{{weekdays.sat}}</span> <span class="dkt-datepicker-dayname">{{weekdays.sun}}</span></div><div class="dkt-datepicker-month {{direction}}" ng-style="monthStyle"><div class="dkt-datepicker-weeks" ng-repeat="monthName in currentMonth"><div class="dkt-datepicker-week" ng-repeat="week in weeks"><span class="dkt-datepicker-date" ng-class="{today: date.isToday, active: date.active, \'different-month\': !date.isCurrentMonth, selected: isDateSelected(date)}" ng-click="select(date)" ng-repeat="date in week.dates"><span class="dkt-datepicker-date-number front">{{date.number}}</span> <span class="dkt-datepicker-date-number back">{{date.number}}</span></span></div></div></div></div>',
        link: function(scope, element, attrs) {
            moment.locale(dktComponents.getLanguage());

            scope.today = moment();

            var firstDate = null;

            for (var eventDate in scope.dates) {
                eventDate = moment(eventDate);

                if (eventDate >= scope.today && (!firstDate || eventDate < firstDate)) {
                    firstDate = eventDate;
                }
            }

            scope.monthStyle = {};
            scope.currentDate = angular.isDefined(scope.selectedDate) && scope.selectedDate ? moment(scope.selectedDate) : firstDate; //removeTime(moment());

            scope.month = scope.currentDate ? scope.currentDate.clone() : moment();
            scope.direction = null;
            scope.currentMonth = [{
                name: scope.month.format("MMMM YYYY")
            }];

            dktLocalization.init({}, function (localization) {
                scope.weekdays = {
                    'sun': dktLocalization.getItem('weekdays', 0).longName.substring(0, 3),
                    'mon': dktLocalization.getItem('weekdays', 1).longName.substring(0, 3),
                    'tue': dktLocalization.getItem('weekdays', 2).longName.substring(0, 3),
                    'wed': dktLocalization.getItem('weekdays', 3).longName.substring(0, 3),
                    'thu': dktLocalization.getItem('weekdays', 4).longName.substring(0, 3),
                    'fri': dktLocalization.getItem('weekdays', 5).longName.substring(0, 3),
                    'sat': dktLocalization.getItem('weekdays', 6).longName.substring(0, 3)
                };
            });

            var start = scope.currentDate ? scope.currentDate.clone() : (firstDate ? firstDate : moment());

            start.date(1);
            start.day(1);

            scope.weeks = buildMonth(start, scope.month, scope.dates);
            scope.datesNextMonth = getDatesInNextMonth(scope.month, scope.dates);

            $timeout( function() {
                scope.monthStyle.height = $(element).find('.dkt-datepicker-weeks').outerHeight() + 'px';
            });

            scope.$watch('selectedDate', function(newDate) {
                scope.currentDate = angular.isDefined(newDate) && newDate ? moment(scope.selectedDate) : null; //removeTime(moment());
            });

            scope.isDateSelected = function(date) {
                return scope.currentDate ? date.date.hour(0).minute(0).second(0).millisecond(0).isSame(scope.currentDate.hour(0).minute(0).second(0).millisecond(0)) : false;
            };

            scope.select = function(date) {
                if (date.isCurrentMonth && date.active) {
                    $timeout( function() {
                        scope.currentDate = date.date;
                    });

                    if (angular.isDefined(scope.onSelectDate)) {
                        scope.onSelectDate({$date: date.date.format("YYYY-MM-DD")});
                    }
                }
            };

            scope.next = function() {
                var next = scope.month.clone();

                next.month(next.month() + 1).date(1).day(1);
                scope.month.month(scope.month.month() + 1);

                scope.direction = 'next';

                $timeout( function() {
                    scope.currentMonth = [{
                        name: scope.month.format("MMMM YYYY")
                    }];

                    scope.weeks = buildMonth(next, scope.month, scope.dates);
                    scope.datesNextMonth = getDatesInNextMonth(scope.month, scope.dates);

                    $timeout( function() {
                        scope.monthStyle.height = $(element).find('.dkt-datepicker-weeks.ng-enter').outerHeight() + 'px';
                    });
                });
            };

            scope.previous = function() {
                var previous = scope.month.clone();

                previous.month(previous.month() - 1).date(1).day(1);
                scope.month.month(scope.month.month() - 1);

                scope.direction = 'previous';

                $timeout( function() {
                    scope.currentMonth = [{
                        name: scope.month.format("MMMM YYYY")
                    }];

                    scope.weeks = buildMonth(previous, scope.month, scope.dates);
                    scope.datesNextMonth = getDatesInNextMonth(scope.month, scope.dates);

                    $timeout( function() {
                        scope.monthStyle.height = $(element).find('.dkt-datepicker-weeks.ng-enter').outerHeight() + 'px';
                    });
                });
            };
        }
    };

    function removeTime(date) {
        return date; //.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function getDatesInNextMonth(month, activeDates) {
        var date = month.clone();
        var datesInMonth = 0;

        date.month(date.month() + 1).date(1);

        for (var count = 1; count <= date.daysInMonth(); count++) {
            date.date(count);

            if (angular.isDefined(activeDates) && angular.isDefined(activeDates[date.format("YYYY-MM-DD")])) {
                datesInMonth++;
            }
        }

        return datesInMonth;
    }

    function buildMonth(start, month, activeDates) {
        var weeks = [];
        var done = false;
        var date = start.clone();
        var monthIndex = date.month();
        var count = 0;

        while (!done) {
            weeks.push({dates: buildWeek(date.clone(), month, activeDates)});

            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }

        return weeks;
    }

    function buildWeek(date, month, activeDates) {
        var dates = [];
        var active;

        for (var i = 0; i < 7; i++) {
            active = false;

            if (angular.isUndefined(activeDates)) {
                active = true;
            } else if (angular.isDefined(activeDates[date.format("YYYY-MM-DD")])) {
                active = true;
            }

            dates.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                active: active
            });


            date = date.clone();
            date.add(1, "d");
        }

        return dates;
    }
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.misc.dropdown
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.dropdown', [
    'ngTouch',
    'dkt.core'
])

.filter('getDropdownValue', function() {
    var getDropdownValueFilter = function(input, scope) {
        for (var group in scope.groups) {
            for (var item in scope.groups[group].items) {
                if (scope.groups[group].items[item].key == input) {
                    return scope.groups[group].items[item].value;
                }
            }
        }

        return '';
    };

    getDropdownValueFilter.$stateful = true;

    return getDropdownValueFilter;
})

.filter('getDropdownGroupValue', function() {
    var getDropdownGroupValueFilter = function(input, scope) {
        for (var group in scope.groups) {
            for (var item in scope.groups[group].items) {
                if (scope.groups[group].items[item].key == input) {
                    return scope.groups[group].label;
                }
            }
        }

        return '';
    };

    getDropdownGroupValueFilter.$stateful = true;

    return getDropdownGroupValueFilter;
})

.directive('dktDropdown', ["$timeout", "dktParams", function($timeout, dktParams) {
    return {
        restrict: 'E',
        scope: {
            'onchange': '=',
            'selectedItem': '@',
            'selectedLabel': '@',
            'groups': '=',
            'elements': '=',
            'simple': '@',
            'name': '@'
        },
        replace: true,
        template:'<div class="dkt-dropdown" ng-class="{\'active\': open, \'simple\': simple}"><div class="dropdown-overlay" ng-if="open" ng-click="toggle()"></div><span ng-click="toggle()" class="desktop" ng-if="!simple">{{ selectedLabel | getDropdownValue:this | translate }} {{ selectedLabel | getDropdownGroupValue:this }}</span> <span ng-click="toggle()" class="mobile" ng-if="!simple">{{ selectedLabel | getDropdownValue:this | translate | shorten : 3 }} {{ selectedLabel | getDropdownGroupValue:this }}</span> <span ng-click="toggle()" ng-if="simple">{{selectedLabel}}</span><div class="options" ng-if="open"><div class="options-container"><ul ng-if="!simple"><li ng-repeat="group in groups"><span>{{ group.label | translate }}</span><ul><li ng-repeat="item in group.items" ng-click="select(item.key)" ng-class="{\'active\': (selectedItem == item.key)}">{{ item.value | translate }}</li></ul></li></ul><ul ng-if="simple"><li class="dkt-dropdown-simple-item" ng-repeat="item in elements" ng-click="select(item.key)" ng-class="{\'active\': (selectedItem == item.key)}">{{ item.value }}</li></ul></div></div></div>',
        link: function(scope, element, attrs) {
            scope.open = false;
            scope.simple = scope.simple === 'true' ? true : false;

            if (scope.simple) {
                scope.$watch('selectedItem', function(value) {
                    if (scope.elements) {
                        for (var item in scope.elements) {
                            if (scope.elements[item].key === scope.selectedItem) {
                                scope.elements[item].active = true;
                                scope.selectedLabel = scope.elements[item].value;
                            } else {
                                scope.elements[item].active = false;
                            }
                        }
                    }
                });
            }

            scope.toggle = function () {
                if (!scope.open) {
                    scope.open = true;
                }
                else {
                    scope.open = false;
                }
            };

            scope.select = function (key) {
                if (scope.simple) {
                    dktParams.setFilter(
                        scope.name,
                        key
                    );

                    scope.toggle();
                } else {
                    scope.onchange(
                        key
                    );
                }
            };
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.misc.filter
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.filter', [
    'ngTouch',
    'dkt.core',
    'dkt.core.services.favorites',
])

.directive('dktFilter', ["dktParams", "dktFavorites", function(dktParams, dktFavorites) {
    return {
        restrict: 'E',
        scope: {
            'title': '@',
            'elements': '=',
            'name': '@',
            'radio': '@',
            'default': '@'
        },
        replace: true,
        template:'<div class="dkt-filter"><b ng-bind-html="title | html" ng-if="title"></b><ul><li ng-repeat="(key, filter) in elements"><label ng-click="handleClick(filter.value)" ng-class="{\'active\': filter.checked || (!radio && filters.length == 0 && default === \'checked\') || (filter.value == \'\' && filters.length == 0) || (radio && filters.length == 0 && key == 0) || (radio && filters.indexOf(filter.value) !== -1), \'has-image\': filter.image}"><span class="checkbox"><span class="front"></span> <span class="back"></span></span> <img ng-src="{{filter.image}}" ng-if="filter.image"> <span ng-bind-html="filter.name | html"></span></label></li></ul></div>',
        link: function(scope, element, attrs) {
            var paramValue;
            var hasFavorites = false;

            scope.filters = [];

            scope.$watch('elements', function(elements) {
                if (elements && elements.length > 0) {
                    paramValue = dktParams.getFilter(scope.name);

                    if ((paramValue === null || paramValue === '') && angular.isDefined(scope.default) && scope.default === 'checked') {
                        for (var element in elements) {
                            scope.filters.push(elements[element].value);
                        }
                    }

                    if (paramValue !== null) {
                        paramValue = paramValue.split(',');

                        for (var param in paramValue) {
                            //if (paramValue[param] !== '') {
                                scope.filters.push(paramValue[param]);
                            //}
                        }
                    }

                    checkFilters();
                }
            });

            scope.handleClick = function (id) {
                if (id === '') {
                    scope.filters = [];
                } else if (angular.isDefined(scope.radio) && scope.radio) {
                    scope.filters = [id];
                } else {
                    if (id.indexOf(',') !== -1) {
                        var filterIds = id.split(',');
                        var filterId;
                        var matchesAllFilters = true;

                        for (filterId in filterIds) {
                            filterId = filterIds[filterId];

                            if (scope.filters.indexOf(filterId) === -1) {
                                matchesAllFilters = false;
                            }
                        }

                        for (filterId in filterIds) {
                            filterId = filterIds[filterId];

                            if (matchesAllFilters) {
                                if (scope.filters.indexOf(filterId) !== -1)  {
                                    scope.filters.splice(scope.filters.indexOf(filterId), 1);
                                }
                            } else {
                                if (scope.filters.indexOf(filterId) === -1)  {
                                    scope.filters.push(filterId);
                                }
                            }
                        }
                    } else {
                        if (scope.filters.indexOf(id) !== -1) {
                            scope.filters.splice(scope.filters.indexOf(id), 1);
                        } else {
                            scope.filters.push(id);
                        }
                    }
                }

                var filterString = scope.filters.join(',');

                if (scope.name === 'type') {
                    var filterItem;

                    if ((id.indexOf('favorit') !== -1 || id.indexOf('favourit') !== -1) && (filterString.indexOf('favorit') !== -1 || filterString.indexOf('favourit') !== -1)) {
                        for (filterItem in scope.filters) {
                            if (scope.filters[filterItem].indexOf('favorit') !== -1 || scope.filters[filterItem].indexOf('favourit') !== -1) {
                                scope.filters = [scope.filters[filterItem]];

                                break;
                            }
                        }

                        dktFavorites.setFilter();
                        hasFavorites = true;
                    } else {
                        for (filterItem in scope.filters) {
                            if (scope.filters[filterItem].indexOf('favorit') !== -1 || scope.filters[filterItem].indexOf('favourit') !== -1) {
                                scope.filters.splice(filterItem, 1);

                                break;
                            }
                        }

                        if (hasFavorites) {
                            dktFavorites.removeFilter();

                            hasFavorites = false;
                        }
                    }
                }

                dktParams.setFilter(
                    scope.name,
                    scope.filters.join(',')
                );
            };

            var urlListener = scope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (scope.elements && scope.elements.length > 0) {
                    checkFilters();
                }
            });

            function checkFilters() {
                if (!scope.radio) {
                    for (var filter in scope.elements) {
                        filter = scope.elements[filter];

                        if (filter.value.indexOf(',') !== -1) {
                            var matchesAllFilters = true;
                            var filterValues = filter.value.split(',');

                            for (var filterValue in filterValues) {
                                filterValue = filterValues[filterValue];

                                if (scope.filters.indexOf(filterValue) === -1) {
                                    matchesAllFilters = false;

                                    break;
                                }
                            }

                            if (matchesAllFilters) {
                                filter.checked = true;
                            } else {
                                filter.checked = false;
                            }
                        } else {
                            if (scope.filters.indexOf(filter.value) !== -1) {
                                filter.checked = true;
                            } else {
                                filter.checked = false;
                            }
                        }
                    }
                }
            }
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.misc.slideshow
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.slideshow', [
    'dkt.core'
])

.directive('dktSlideshow', ["$timeout", "$window", "dktUtils", function($timeout, $window, dktUtils) {
    return {
        restrict: 'E',
        scope: {
            'elements': '&',
            'doubleSided': '&',
            'interval': '&',
            'ratio': '&',
            'bulletsEnabled': '&'
        },
        replace: true,
        template:'<div class="dkt-slideshow"><div class="images" ng-swipe-right="previous()" ng-swipe-left="next()"><ul><li ng-repeat="(key, value) in elements" ng-class="{\'active\': (key == current_slide), \'double\': doubleSided}"><a href="{{ value.link }}" ng-if="!doubleSided" class="image single"><img ng-src="{{ value.image }}"></a> <a href="{{ value[0].link }}" ng-if="doubleSided && value[0]" class="image double left"><img ng-src="{{ value[0].image }}"></a> <a href="{{ value[1].link }}" ng-if="doubleSided && value[1]" class="image double right"><img ng-src="{{ value[1].image }}"></a></li></ul></div><div class="bullets" ng-if="bulletsEnabled && elements.length > 1"><ul><li ng-repeat="(key, value) in elements" ng-class="{\'active\': (key == current_slide)}" ng-click="goToSlide(key)"></li></ul></div></div>',
        link: function(scope, element, attrs) {
            scope.ratio = parseFloat(scope.ratio());

            if (isNaN(scope.ratio)) {
                scope.ratio = 0.5;
            }

            scope.interval = parseInt(scope.interval(), 10);

            if (isNaN(scope.interval)) {
                scope.interval = null;
            }

            scope.doubleSided = scope.doubleSided();

            if (!angular.isDefined(scope.doubleSided)) {
                scope.doubleSided = false;
            }

            scope.bulletsEnabled = scope.bulletsEnabled();

            if (!angular.isDefined(scope.bulletsEnabled)) {
                scope.bulletsEnabled = false;
            }

            if (dktUtils.devices.iphone || dktUtils.devices.android) {
                if (scope.doubleSided) {
                    scope.ratio = scope.ratio * 2;
                }

                scope.doubleSided = false;
            }

            scope.elements = scope.elements();

            if (scope.doubleSided === true) {
                var new_elements = [],
                    add_element = [],
                    current_index = 1;

                for (var _element in scope.elements) {
                    var index = Math.ceil(((parseInt(_element, 10) + 1) / 2));

                    if (index !== current_index) {
                        current_index = index;
                        new_elements.push(add_element);
                        add_element = [];
                    }

                    add_element.push(
                        scope.elements[_element]
                    );
                }

                if (add_element.length > 0) {
                    new_elements.push(add_element);
                }

                scope.elements = new_elements;
            }

            var container = element[0],
                image_list = container.querySelector('.images > ul'),
                image_list_items = image_list.getElementsByTagName('li'),
                container_size = 0,
                disableDrag = function() { return false; };

            scope.current_slide = 0;

            var render = function(width) {
                container_size = width;
                container.style.height = Math.floor((width * scope.ratio)) + 'px';

                image_list.style.width = (scope.elements.length * width) + 'px';

                for (var li in image_list_items) {
                    if (image_list_items[li].style) {
                        image_list_items[li].style.width = width + 'px';

                        image_list_items[li].ondragstart = disableDrag;
                    }
                }
            };

            var resize = function() {
                render(
                    container.getBoundingClientRect().width
                );

                scope.goToSlide(scope.current_slide);
            };

            scope.goToSlide = function (index) {
                image_list.style.webkitTransform =
                image_list.style.MozTansform =
                image_list.style.MsTransform =
                image_list.style.transform = 'translateX(-' + (container_size * index) + 'px)';

                scope.current_slide = index;

                registerTimer();
            };

            var clearTimer = function() {
                if (angular.isDefined(scope.timer)) {
                    clearTimeout(scope.timer);
                }
            };

            scope.next = function() {
                if ((scope.current_slide + 2) > scope.elements.length) {
                    scope.goToSlide(0);
                }
                else {
                    scope.goToSlide(
                        (scope.current_slide + 1)
                    );
                }
            };

            scope.previous = function() {
                if (scope.current_slide === 0) {
                    scope.goToSlide(
                        (scope.elements.length - 1)
                    );
                }
                else {
                    scope.goToSlide(
                        (scope.current_slide - 1)
                    );
                }
            };

            var registerTimer = function() {
                clearTimer();

                if (angular.isDefined(scope.interval) && scope.interval !== null) {
                    scope.timer = setInterval(function () {
                        $timeout( function() {
                            scope.next();
                        });
                    }, scope.interval);
                }
            };

            angular.element($window).bind('resize', resize);

            scope.$on('$destroy', function () {
                angular.element($window).unbind('resize', resize);

                clearTimer();
            });

            $timeout(function () {
                resize();
            });

            registerTimer();
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.components.misc.spinner
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.spinner', [

])

.factory('dktSpinner', function() {
    var service = {};

    service.active = false;
    service.show = function() {};
    service.hide = function() {};

    return service;
})

.directive('dktSpinner', ["dktSpinner", function (dktSpinner) {
    return {
        restrict: 'E',
        scope: {
            'active': '='
        },
        replace: true,
        template:'<did class="dkt-spinner" ng-if="active"><div class="dkt-spinner-overlay solid"></div><div class="dkt-spinner-throbber"></div></did>',
        link: function (scope, element, attrs) {
            dktSpinner.active = scope.active;

            dktSpinner.show = function() {
                scope.active = dktSpinner.active = true;
            };

            dktSpinner.hide = function() {
                scope.active = dktSpinner.active = false;
            };
        }
    };
}])
;

/**
 * @ngdoc overview
 * @name dkt.components.misc.tiles
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.tiles', [
    'dkt.components.misc.tiles.tile'
])

.directive('dktTiles', ["$window", "$timeout", function($window, $timeout) {
    return {
        restrict: 'E',
        scope: {
            'elements': '=',
            'grid': '@'
        },
        replace: true,
        template:'<div class="dkt-tiles clearfix" ng-class="tilesClass"><dkt-tile ng-repeat="(key, value) in render_elements" data-format="{{value.preferedFormat}}" ng-class="{\'big\': value.big}" tile-id="{{value.id}}" delay="{{value.delay}}" image="{{value.image}}" link="{{value.link}}" link-target="{{value.link_target}}" label="{{value.label}}" text="{{value.text}}"></dkt-tile></div>',
        link: function(scope, element, attrs) {
            scope.render_elements = [];
            scope.tilesClass = {};

            scope.$watch('elements', function(elements) {
                if (elements) {
                    var gridCount = 1;
                    var tile;

                    scope.render_elements = [];
                    scope.tilesClass['grid-1'] = false;
                    scope.tilesClass['grid-2'] = false;
                    scope.tilesClass['grid-3'] = false;
                    scope.tilesClass['grid-4'] = false;
                    scope.tilesClass[scope.grid] = true;

                    if ($window.innerWidth <= 736) {
                        var lastTileBig = false;
                        for (tile in scope.elements) {
                            tile = scope.elements[tile];
                            if (Math.ceil(Math.random() * 4) < 2 && !lastTileBig) {
                                tile.image = tile.imageMobileHeroUrl;
                                tile.big = true;
                                lastTileBig = true;
                            } else {
                                tile.image = tile.imageThumbnailUrl;
                                lastTileBig = false;
                            }
                        }

                        lastTileBig = null;
                    } else {
                        switch (scope.grid) {
                            case 'grid-1':
                                for (tile in scope.elements) {
                                    tile = scope.elements[tile];
                                    switch (gridCount) {
                                        case 1:
                                        case 8:
                                            tile.image = tile.imageMobileHeroUrl;
                                        break;
                                        case 2:
                                        case 3:
                                        case 4:
                                        case 5:
                                        case 6:
                                        case 9:
                                        case 10:
                                            tile.image = tile.imageThumbnailUrl;
                                        break;
                                        case 7:
                                            tile.image = tile.imageHeroUrl;
                                        break;
                                    }

                                    gridCount++;

                                    if (gridCount > 10) {
                                        gridCount = 1;
                                    }
                                }
                            break;
                            case 'grid-2':
                                for (tile in scope.elements) {
                                    tile = scope.elements[tile];

                                    switch (gridCount) {
                                        case 1:
                                        case 3:
                                        case 5:
                                            tile.image = tile.imageMobileHeroUrl;
                                        break;
                                        case 2:
                                        case 4:
                                        case 6:
                                            tile.image = tile.imageThumbnailUrl;
                                        break;
                                    }

                                    gridCount++;

                                    if (gridCount > 6) {
                                        gridCount = 1;
                                    }
                                }
                            break;
                            case 'grid-3':
                                for (tile in scope.elements) {
                                    tile = scope.elements[tile];
                                    switch (gridCount) {
                                        case 3:
                                        case 5:
                                        case 6:
                                        case 7:
                                        case 8:
                                            tile.image = tile.imageMobileHeroUrl;
                                        break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 9:
                                        case 10:
                                            tile.image = tile.imageThumbnailUrl;
                                        break;
                                    }

                                    gridCount++;

                                    if (gridCount > 10) {
                                        gridCount = 1;
                                    }
                                }
                            break;
                            case 'grid-4':
                                for (tile in scope.elements) {
                                    tile = scope.elements[tile];

                                    switch (gridCount) {
                                        case 1:
                                        case 2:
                                        case 6:
                                        case 8:
                                        case 10:
                                            tile.image = tile.imageMobileHeroUrl;
                                        break;
                                        case 3:
                                        case 4:
                                        case 5:
                                        case 7:
                                        case 9:
                                            tile.image = tile.imageThumbnailUrl;
                                        break;
                                    }

                                    gridCount++;

                                    if (gridCount > 10) {
                                        gridCount = 1;
                                    }
                                }
                            break;
                            case 'grid-5':
                                for (tile in scope.elements) {
                                    tile = scope.elements[tile];

                                    switch (gridCount) {
                                        case 1:
                                            tile.image = tile.imageMobileHeroUrl;
                                        break;
                                        case 2:
                                        case 3:
                                        case 4:
                                        case 5:
                                        case 6:
                                        case 8:
                                        case 9:
                                        case 10:
                                        case 11:
                                            tile.image = tile.imageThumbnailUrl;
                                        break;
                                        case 7:
                                            tile.image = tile.imageHeroUrl;
                                        break;
                                    }

                                    gridCount++;

                                    if (gridCount > 11) {
                                        gridCount = 1;
                                    }
                                }
                            break;
                        }
                    }

                    $timeout( function() {
                        addRender(20);
                    }, 0);

                    tile = null;
                }
            });

            angular.element($window).bind('scroll', scroll);

            function scroll() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if ((window.innerHeight + scrollTop) >= document.body.scrollHeight) {
                    addRender(20);
                    scope.$digest();
                }
            }

            function addRender(amount) {
                var tile;

                if (scope.elements.length > 0) {
                    for (var i = 0; i < amount; i++) {
                        if (scope.elements.length > 0) {
                            tile = scope.elements.shift();
                            tile.delay = i * (0.05 + (Math.random() * 0.15));
                            scope.render_elements.push(
                                tile
                            );
                        }
                    }
                }

                amount = null;
                tile = null;
            }

            scope.$on('$Destroy', function () {
                angular.element($window).unbind('scroll', scroll);
            });
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.services.utils.images
 *
 * @description
 * Description
 */

angular.module('dkt.core.services.utils.images', [])

.directive('dktImageLoad', function() {
    return {
        restrict: 'A',
        scope: {
            'callback': '&dktImageLoad'
        },
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                element.addClass('loaded');

                if (angular.isDefined(scope.callback)) {
                    scope.$eval(scope.callback);
                }
            });
        }
    };
})

;
/**
 * @ngdoc overview
 * @name dkt.core.services.utils.params
 *
 * @description
 * This service handles GET parameter setting / getting.
 */

angular.module('dkt.core.services.utils.params', [])

.config(["$locationProvider", function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        rewriteLinks: false
    });

    $locationProvider.hashPrefix('!');
}])

/**
 * Factory for controlling GET parameters.
 * Here you can set parameters, get parameters,
 * reload them or delete them entirely.
 */
.factory('dktParams', ["$location", "dktUtils", function ($location, dktUtils) {
    var service = {
        parameters: {}
    };

    /**
     * Fetch the GET parameters from the $location
     * object. Loop through them & set the initial
     * parameters for the service.
     */
    service.reload = function () {
        service.parameters = {};
        if (dktUtils.object.count($location.$$search) > 0) {
            for (var key in $location.$$search) {
                service.parameters[key] = $location.$$search[key];
            }
        }
    };

    /**
     * Set a value on a key/value basis.
     * Once set it will update the URL to
     * contain the parameters within the
     * service.parameters object.
     */
    service.set = function (key, value) {
        service.parameters[key] = value;

        service.update();
    };

    service.get = function (key) {
        service.reload();

        if (angular.isDefined(service.parameters[key])) {
            return service.parameters[key];
        }
        else {
            return null;
        }
    };

    /**
     * If key is set in service.parameters
     * it will delete it & update the $location
     * object.
     */
    service.unset = function (key) {
        if (angular.isDefined(service.parameters[key])) {
            service.parameters[key] = '';
        }

        service.update();
        //$location.search(service.parameters).replace();
    };

    service.getAllFilters = function () {
        var filters = {};

        if (dktUtils.object.count(service.parameters) > 0) {
            for (var parameter in service.parameters) {
                if (parameter.indexOf('f-') !== -1) {
                    filters[parameter.replace('f-', '')] = service.parameters[parameter];
                }
            }
        }

        return dktUtils.object.count(filters) > 0 ? filters : null;
    };

    service.resetFilters = function () {
        if (dktUtils.object.count(service.parameters) > 0) {
            for (var parameter in service.parameters) {
                if (parameter.indexOf('f-') !== -1) {
                    delete service.parameters[parameter];
                }
            }
        }

        service.update();
    };

    service.getFilter = function (id) {
        return service.get('f-' + id);
    };

    service.setFilter = function (id, value) {
        if (value === '') {
            service.unset('f-' + id);
        }
        else {
            service.set('f-' + id, value);
        }

        service.update();
    };

    /**
     * Update the $location object with
     * latest GET parameters.
     */
    service.update = function () {
        if (JSON.stringify(service.parameters) === '{}')
        {
            $location.search({});
        }
        else
        {
            $location.search(service.parameters).replace();
        }

    };

    // Reload the service on initialization.
    service.reload();

    return service;
}])

;

/**
 * @ngdoc overview
 * @name dkt.core.services.utils.touch
 *
 * @description
 * Contains services used for handling touch events.
 */

angular.module('dkt.core.services.utils.touch', [])

.factory('dktTouch', function() {
    var service = {

    };

    service.isTouch = function() {
        return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    };

    service.getPosition = function(event) {
        var touch = (typeof event.touches !== 'undefined' && event.touches.length > 0) ? event.touches[0] : (typeof event.pageX !== 'undefined' ? event : event.originalEvent.touches[0]);

        return {x: touch.pageX, y: touch.pageY};
    };

    return service;
})

;

/**
 * @ngdoc overview
 * @name dkt.core.services.utils
 *
 * @description
 * Contains different general utilities and helpers used throughout the application.
 * The utilities are accessible through services that can be injected into the module-controllers.
 */

angular.module('dkt.core.services.utils', [])

.factory('dktUtils', function() {
    var browser = null;
    var service = {
        object: {},
        url: {},
        form: {},
        window: {},
        string: {},
        color: {},
        storage: {}
    };

    service.devices = (function () {
        var na = navigator.userAgent.toLowerCase();

        return {
            'ipad': (na.indexOf('ipad') !== -1 ? true : false),
            'iphone': ((na.indexOf('iphone') !== -1 || na.indexOf('ipod') !== -1) ? true : false),
            'android': (na.indexOf('android') !== -1 ? true : false)
        };
    })();

    service.browser = function() {
        if (browser) {
            return browser;
        } else {
            navigator.browserInfo = (function(){
                var ua= navigator.userAgent, tem,
                M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if(/trident/i.test(M[1])){
                    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE '+(tem[1] || '');
                }
                if(M[1]=== 'Chrome'){
                    tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
                    if(tem!== null) {
                        return tem.slice(1).join(' ').replace('OPR', 'Opera');
                    }
                }
                M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem= ua.match(/version\/(\d+)/i))!== null) {
                    M.splice(1, 1, tem[1]);
                }

                return { 'browser': M[0], 'version': M[1] };
            })();

            browser = navigator.browserInfo.browser.toLowerCase();

            return browser;
        }
    };

    service.os = function () {
        var os = '',
            test_string = navigator.appVersion.toLowerCase();

        if (test_string.indexOf('win') !== -1) {
            os = 'Windows';
        }
        else if (test_string.indexOf('mac') !== -1) {
            os = 'Mac';
        }
        else if (test_string.indexOf('linux') !== -1) {
            os = 'Linux';
        }

        return os;
    };

    service.object.count = function(element) {
        var length = 0;
        element = element || null;

        if(element !== null) {
            if (typeof element === "object") {
                length =  Object.keys(element).length;
            } else if (angular.isArray(element)) {
                length = element.length;
            }
        }

        return length;
    };

    service.object.first = function(object, key, item) {
        var first = null;

        key = key || null;
        item = item || null;

        for (var element in object) {
            first = (key?element:(item?(angular.isDefined(object[element][item])?object[element][item]:object[element]):object[element]));

            break;
        }

        return first;
    };

    service.object.last = function(object, key, item) {
        var last = null;

        key = key || null;
        item = item || null;

        for (var element in object) {
            last = (key?element:(item?(angular.isDefined(object[element][item])?object[element][item]:object[element]):object[element]));
        }

        return last;
    };

    service.object.serialize = function(object) {
        return Object.keys(object).reduce(function(a,k){a.push(k+'='+encodeURIComponent(object[k]));return a;},[]).join('&');
    };

    service.string.capitalize = function(string) {
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    };

    service.url.encode = function(url) {
        url = url || '';

        url = escape(url.toLowerCase());

        return url
        .replace(/%20/g, '-')
        .replace(/%E6/g, 'ae')
        .replace(/%F8/g, 'oe')
        .replace(/%E5/g, 'aa')
        .replace(/\//g, '')
        .replace(/%3F/g, '')
        ;
    };

    service.url.externalEncode = function(url) {
        url = url || '';

        return encodeURIComponent(url
            .replace(/\ $/, '')
            .replace(/\.$/, '')
            .replace(/\ $/, '')
            .replace(/\.$/, '')
            .replace(/\ $/, '')
            .replace(/\.$/, '')
        );
    };

    service.window.width = function() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    };

    service.window.height = function() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    };

    service.window.open = function(url, blank, width, height, position, title) {
        url = url || null;
        width = width || 1024;
        height = height || 768;
        position = position || 'center';
        title = title || '';
        blank = blank || false;

        if (url && url !== '') {
            if (blank) {
                window.open(url, '_blank');
            } else {
                var left = 0;
                var top = 0;

                if (position === 'center') {
                    left = Math.round((service.window.width() - width) / 2);
                    top = Math.round((service.window.height() - height) / 2);
                }

                window.open(url, title, 'width=' + width + ', height=' + height + ', left=' + left + ', top='+ top);
            }
        }
    };

    service.color.hexToRgba = function(hex, opacity) {
        hex = hex || '';

        if (hex === '' || hex === 'none') {
            return 'transparent';
        } else {
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            var result;

            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return (result ? 'rgba(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) + ', ' + opacity + ')' : transparent);
        }
    };

    service.storage.set = function(id, type, value) {
        return localStorage.setItem(type + '_' + id, value);
    };

    service.storage.get = function(id, type) {
        return localStorage.getItem(type + '_' + id);
    };

    service.storage.remove = function(id, type) {
        return localStorage.removeItem(type + '_' + id);
    };

    return service;
})

.directive('dktBrowserDetect', ["dktUtils", function(dktUtils) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.addClass(dktUtils.browser());
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name kgl.components.advancedTiles.advancedTile
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.advancedTiles.advancedTile', [
    'ngTouch'
])

.directive('dktAdvancedTile', ["$document", "$compile", "$timeout", "dktUtils", function($document, $compile, $timeout, dktUtils) {
    return {
        restrict: 'E',
        scope: {
            'tile': '=',
            'totalTiles': '@',
            'onClose': '&',
            'getTile': '&'
        },
        replace: true,
        template:'<div class="dkt-advanced-tile column-{{tile.column}} {{preferedFormat}}" ng-style="tile.style" ng-class="{\'big\': tile.big, \'dark-ui\': tiles && !tiles[0].image, \'active\': tile.active, \'closing\': tile.closing, \'transitioning\': transitioning}"><div class="dkt-advanced-tile-inner"><div class="dkt-advanced-tile-slider {{direction}}"><span class="dkt-advanced-tile-profile" ng-class="{\'no-image\': !tileItem.image}" ng-repeat="tileItem in tiles" ng-swipe-left="next($event)" ng-swipe-right="previous($event)"><span class="label" ng-bind="tileItem.label" ng-if="tileItem.label"></span><p class="text" ng-if="tileItem.text"><span class="inner" ng-style="tileItem.textStyle"><span ng-bind="tileItem.text"></span> <span class="subtext" ng-if="tileItem.subtext" ng-bind="tileItem.subtext"></span></span></p><span class="dkt-advanced-tile-profile-initials" ng-if="!tileItem.image && tileItem.initials">{{tileItem.initials}}</span> <img ng-src="{{tileItem.image}}" ng-if="tileItem.image" dkt-image-load></span></div><span class="dkt-advanced-tile-navigation previous" ng-click="previous($event)"></span> <span class="dkt-advanced-tile-navigation next" ng-click="next($event)"></span> <span class="dkt-advanced-tile-btn-close" ng-click="close($event)"></span></div><div class="dkt-advanced-tile-info" ng-if="tile.active"><dkt-advanced-tile-info ng-repeat="tileItem in tiles"></dkt-advanced-tile-info></div></div>',
        link: function(scope, element, attrs) {
            var $textElement;
            var scale = 1;
            var tileIndex = parseInt(scope.tile.tileIndex, 10);
            var totalTiles = parseInt(scope.totalTiles, 10);
            var preferedFormat = scope.tile.preferedFormat;

            scope.tiles = [scope.tile];
            scope.direction = 'next';
            scope.transitioning = false;

            scope.$watch('tile.preferedFormat', function(_preferedFormat) {
                preferedFormat = _preferedFormat;
                scope.preferedFormat = _preferedFormat;
            });

            scope.$watch('tile.active', function(active, oldValue) {
                if (!active && oldValue) {
                    scope.direction = 'init';
                    scope.transitioning = true;

                    $timeout( function() {
                        scope.tiles = [scope.tile];
                        scope.preferedFormat = preferedFormat;

                        $timeout( function() {
                            scope.transitioning = false;
                        }, 500);
                    });
                } else if (active) {
                    var elementHeight = $(element).outerHeight();
                    var elementOffset = $(element).offset().top;
                    var scrollTop = $(window).scrollTop();
                    var windowHeight = dktUtils.window.height();
                    var offsetDifference;

                    if (preferedFormat === 'standard') {
                        elementHeight = (elementHeight * 2);
                    }

                    if (dktUtils.window.width() > 736) {
                        if (elementOffset < scrollTop + 61) {
                            //offsetDifference = Math.abs(elementOffset - 71 - scrollTop);
                            $document.scrollTopAnimated(elementOffset - 71, 500);
                        } else if (elementOffset + elementHeight > windowHeight + scrollTop) {
                            //offsetDifference = Math.abs(elementOffset + elementHeight - windowHeight - scrollTop);
                            $document.scrollTopAnimated(elementOffset + elementHeight - windowHeight, 500);
                        }
                    } else {
                        $document.scrollTopAnimated(elementOffset - 109, 500);
                    }
                }
            });

            scope.close = function($event) {
                if (scope.tile.active) {
                    $event.stopImmediatePropagation();

                    scope.direction = 'init';
                    scope.transitioning = true;

                    $timeout( function() {
                        scope.tiles = [scope.tile];
                        scope.preferedFormat = preferedFormat;

                        if (angular.isDefined(scope.onClose)) {
                            scope.onClose();
                        }

                        $timeout( function() {
                            scope.transitioning = false;
                        }, 500);
                    });
                }
            };

            scope.previous = function($event) {
                if (scope.tile.active) {
                    $event.stopImmediatePropagation();

                    if (angular.isDefined(scope.getTile)) {
                        scope.direction = 'previous';
                        scope.transitioning = true;

                        if (tileIndex === 0) {
                            tileIndex = totalTiles - 1;
                        } else {
                            tileIndex -= 1;
                        }

                        $timeout( function() {
                            scope.tiles = [scope.getTile({index: tileIndex})];
                            scope.preferedFormat = scope.tiles[0].preferedFormat;

                            $timeout( function() {
                                scope.transitioning = false;
                            }, 500);
                        });
                }
                }
            };

            scope.next = function($event) {
                if (scope.tile.active) {
                    $event.stopImmediatePropagation();

                    if (angular.isDefined(scope.getTile)) {
                        scope.direction = 'next';
                        scope.transitioning = true;

                        if (tileIndex + 1 >= totalTiles) {
                            tileIndex = 0;
                        } else {
                            tileIndex += 1;
                        }

                        $timeout( function() {
                            scope.tiles = [scope.getTile({index: tileIndex})];
                            scope.preferedFormat = scope.tiles[0].preferedFormat;

                            $timeout( function() {
                                scope.transitioning = false;
                            }, 500);
                        });
                    }
                }
            };
        }
    };
}])

.directive('dktAdvancedTileInfo', ["$timeout", "$compile", function($timeout, $compile) {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        template: '<div class="dkt-advanced-tile-info-inner"></div>',
        link: function(scope, element, attrs) {
            if (angular.isFunction(scope.tileItem.info)) {
                $timeout( function() {
                    $(element).html($compile(scope.tileItem.info(scope.tileItem))(scope));
                });
            }
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name kgl.components.tiles
 *
 * @description
 * Description
 */

angular.module('dkt.components.misc.tiles.tile', [
    'dkt.core.services.favorites',
    'dkt.core.services.utils.touch',
])

.directive('dktTile', ["$timeout", "dktComponents", "dktFavorites", "dktTouch", "dktUtils", function($timeout, dktComponents, dktFavorites, dktTouch, dktUtils) {
    return {
        restrict: 'E',
        scope: {
            'tileId': '@',
            'image': '@',
            'link': '@',
            'linkTarget': '@',
            'text': '@',
            'label': '@',
            'delay': '@'
        },
        replace: true,
        template:'<div class="tile"><a href="{{link}}" target="{{linkTarget}}"><span class="label" ng-bind="label" ng-if="label"></span><p class="text" ng-style="textWrapperStyle" ng-if="text"><span class="inner" ng-bind="text" ng-style="textStyle"></span></p><span class="image" ng-class="{\'loaded\': imageLoaded}" ng-style="tileStyle" ng-if="image"></span></a> <a href="{{link}}" target="{{linkTarget}}" class="dkt-tile-button dkt-tile-button-left">{{\'misc.shows_read_more\' | translate}}</a> <a href="{{calendarLink}}" target="_self" class="dkt-tile-button dkt-tile-button-right">{{\'misc.shows_show_dates\' | translate}}</a> <span class="dkt-btn-favorite" ng-click="toggleFavorite()" ng-class="{\'dkt-btn-favorite-toggled\': isFavorite}" title="{{\'misc.add_favorite\' | translate}}"><i class="icon-heart"></i><i class="icon-heart icon-heart-ani"></i></span></div>',
        link: function(scope, element, attrs) {
            var $textElement;
            var scale = 1;
            var language = dktComponents.getLanguage();

            scope.isFavorite = dktFavorites.isFavorite(scope.tileId);
            scope.tileStyle = {
                'background-image': 'url(' + scope.image + ')'
            };

            scope.imageLoaded = false;

            $('<img src="' + scope.image + '" />').load( function() {
                scope.$evalAsync( function() {
                    scope.imageLoaded = true;
                });
            });

            scope.textStyle = {};
            scope.textWrapperStyle = {};

            element[0].style.transitionDelay =
            element[0].style.WebkitTransitionDelay =
            element[0].style.MsTransitionDelay = scope.delay + 's';

            scope.calendarLink = (language !== 'da' ? '/' + language : '') + '/calendar/?f-title=' + scope.tileId;

            function resizeText() {
                $textElement = $(element).find('p');

                var ySpacing = 140;
                var elementWidth = $(element).outerWidth(),
                    elementHeight = $(element).outerHeight(),
                    textElementWidth = $textElement.outerWidth(),
                    textElementHeight = $textElement.outerHeight();

                if (dktTouch.isTouch()) {
                    ySpacing = 60;
                } else {
                    if (dktUtils.window.width() <= 1024) {
                        ySpacing = 100;
                    } else if (dktUtils.window.width() <= 1210) {
                        ySpacing = 115;
                    }
                }

                if (textElementHeight > elementHeight - ySpacing) {
                    scale = (elementHeight - ySpacing) / textElementHeight;
                }

                if (textElementWidth * scale > elementWidth - 30) {
                    if ((elementWidth - 30) / (textElementWidth * scale) < scale) {
                        scale = (elementWidth - 30) / (textElementWidth * scale);
                    }
                }

                if (scale !== 1) {
                    scope.textStyle.opacity = 1;
                    scope.textStyle.transform = 'scale(' + scale + ', ' + scale + ') translate3d(0,0,0)';
                    scope.textStyle['-webkit-transform'] = 'scale(' + scale + ', ' + scale + ') translate3d(0,0,0)';
                    scope.textStyle['-moz-transform'] = 'scale(' + scale + ', ' + scale + ') translate3d(0,0,0)';
                    scope.textStyle['-ms-transform'] = 'scale(' + scale + ', ' + scale + ') translate3d(0,0,0)';
                }

                scope.$evalAsync(function() {
                    scope.textWrapperStyle.height = ($textElement.find('span').outerHeight() * scale) + 'px';
                });
            }

            /*scope.$evalAsync(function() {
                resizeText();
            });*/

            $timeout(function () {
                resizeText();
            }, 200);

            $(window).bind('resize', function() {
                scope.$evalAsync(function() {
                   scope.textWrapperStyle.height = ($textElement.find('span').outerHeight() * scale) + 'px';
                });
            });

            scope.toggleFavorite = function() {
                if (dktFavorites.loggedIn) {
                    if (!scope.isFavorite) {
                        dktFavorites.add(scope.tileId, function(success) {});
                    } else {
                        dktFavorites.remove(scope.tileId, function(success) {});
                    }

                    scope.isFavorite = !scope.isFavorite;

                    dktFavorites.setFilter();
                } else {
                    scope.$emit('SHOW_MODAL', 'NOT_LOGGED_IN');
                }
            };
        }
    };
}])

;

/**
 * @ngdoc overview
 * @name dkt
 *
 * @description
 * The main module for the application. Only used for defining the core config.
 */

angular.module('dkt', [
    'ngTouch',
    'dkt.core',
    'dkt.components.shows',
    'dkt.components.calendar',
    'dkt.components.cast',
    'dkt.components.misc.spinner'
])

.config(function(dktComponentsProvider) {
    /*dktComponentsProvider.setLanguage('da');
    dktComponentsProvider.setHost('https://webtest.kglteater.dk');
    dktComponentsProvider.setEndpoint('events', 'https://webtest.kglteater.dk/%language/rdt-api/filtered-events');
    dktComponentsProvider.setEndpoint('productions', 'https://webtest.kglteater.dk/api/v1/productions?culture=%language');
    dktComponentsProvider.setEndpoint('localization', 'https://webtest.kglteater.dk/%language/api/localization/calendar');
    dktComponentsProvider.setEndpoint('cast', 'https://webtest.kglteater.dk/api/cast/GetPerformanceCredits?productionSeasonId=%production-id');
    dktComponentsProvider.setEndpoint('castProductions', 'https://webtest.kglteater.dk/api/cast/GetCastSeasonCredits?productionSeasonId=%production-id&personnelId=%personel-id&culture=%language');
    dktComponentsProvider.setEndpoint('castInformation', 'https://webtest.kglteater.dk/api/cast/GetCastInformation?%personel-ids');
    dktComponentsProvider.setEndpoint('getFavorites', 'https://webtest.kglteater.dk/api/favourites/GetFavourites?ListType=%type&StatusString=%status');
    dktComponentsProvider.setEndpoint('updateFavorites', 'https://webtest.kglteater.dk/api/favourites/UpdateFavourites?ListType=%type&Mode=%mode%&ProductionSeasonNumber=%production-id');
    dktComponentsProvider.enableProxy();*/
});

angular.element(document).ready(function () {
    moment.defineLocale('da', {
        months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
        monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
        weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
        weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
        weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY HH:mm',
            LLLL : 'dddd [d.] D. MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[I dag kl.] LT',
            nextDay : '[I morgen kl.] LT',
            nextWeek : 'dddd [kl.] LT',
            lastDay : '[I går kl.] LT',
            lastWeek : '[sidste] dddd [kl] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'om %s',
            past : '%s siden',
            s : 'få sekunder',
            m : 'et minut',
            mm : '%d minutter',
            h : 'en time',
            hh : '%d timer',
            d : 'en dag',
            dd : '%d dage',
            M : 'en måned',
            MM : '%d måneder',
            y : 'et år',
            yy : '%d år'
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    $('.dkt-components').data('$injector', '');
    angular.bootstrap($('.dkt-components'), ['dkt']);
})

;

//# sourceMappingURL=main.js.map

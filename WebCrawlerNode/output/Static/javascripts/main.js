// ------------- SVG SPRITE ------------- //

$.get('/Static/icons/svg-sprite.svg', function(data) {
    var div = document.createElement('div');
    div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
    $(document).ready(function() {
        document.body.insertBefore(div, document.body.childNodes[0]);
    });
});

// ------------- APPVIEW LINK HANDLER ------------- //

// Add / Update a key-value pair in the URL query parameters
function updateUrlParameter(uri, key, value) {
    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? '' : uri.substr(i);

    uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
        uri = uri + separator + key + '=' + value;
    }

    // finally append the hash as well
    return uri + hash;
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.cookie.replace(/(?:(?:^|.*;\s*)AppView\s*\=\s*([^;]*).*$)|^.*$/, '$1') === 'true') {
        var currentAppViewURL = updateUrlParameter(location.href, 'AppView', 'True');
        document.body.classList.add('app-view');
        history.replaceState(null, null, currentAppViewURL);

        // Using existing jquery's event delegation
        $('body').on('click', 'a[href]', function(e) {
            var linkNode = $(e.currentTarget)[0];

            // check if href exists
            if (linkNode.getAttribute('href') !== '') {
                // check if valid internal link or internal hashtag
                if (location.hostname === linkNode.hostname || (!linkNode.hostname.length && !linkNode.href.startsWith('javascript:'))) {
                    e.preventDefault();

                    const newURL = updateUrlParameter(linkNode.href, 'AppView', 'True');

                    window.location = newURL;
                }
            }
        });
    }
});

// ------------- TEXT PLACEHOLDER ------------- //

$('input,textarea').focus(function() {
    $(this).removeAttr('placeholder');
});

var favoritesModalQuery = 'showFavorites';

// ------------- GENERIC MODAL POPUP ------------- //

$(document).ready(function() {
    var modalTriggers = Array.prototype.slice.call(document.getElementsByClassName('modal-trigger-js'));

    modalTriggers.forEach(function(trigger) {
        var thisID = trigger.getAttribute('data-modal-id');
        var thisModal = document.querySelector('.modal-wrapper-js[data-modal-id="' + thisID + '"]');
        //console.log(thisID);
        //console.log(thisModal);
        trigger.addEventListener('click', function(e) {
            //console.log("clicked");
            //console.log(this.getAttribute('data-modal-id'));
            e.preventDefault();
            e.stopPropagation();
            thisModal.classList.add('modal-open');
            document.addEventListener('click', outsideClick, false);
        });
        var thisClose = Array.prototype.slice.call(thisModal.querySelectorAll('.close-modal-js'));
        thisClose.forEach(function(closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                thisModal.classList.remove('modal-open');
                document.removeEventListener('click', outsideClick, false);
            });
        });
        var openModalOnPageLoad = getParameterByName(favoritesModalQuery);
        //console.log(openModalOnPageLoad);
        if (openModalOnPageLoad == 'true') {
            var favoritesModal = document.getElementById('favoritesModal');
            if (favoritesModal != null) {
                favoritesModal.classList.add('modal-open');
                document.addEventListener('click', outsideClick, false);
            }
        }
    });
    function outsideClick(e) {
        var openModal = document.querySelector('.modal-open');
        if (openModal) {
            var openModalBlock = openModal.querySelector('.modal-js');
            if (!openModalBlock.contains(e.target)) {
                openModal.classList.remove('modal-open');
                document.removeEventListener('click', outsideClick, false);
            }
        }
    }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// ------------- Add To Favourites Button ------------- //

$(document).ready(function() {
    var $buttonContainers = $('.add-to-favourites-container-js');
    $buttonContainers.each(function(index, btnContainer) {
        var $btnContainer = $(btnContainer);
        var prodSeasonIdsString = $btnContainer.find('.prod-season-ids-js').val();
        var $favouritesAdded = $btnContainer.find('.favourites-added-js');
        var $favouritesError = $btnContainer.find('.favourites-error-js');
        var prodSeasonIds = prodSeasonIdsString.split(',');

        var $btn = $btnContainer.find('.button-js');
        $btn.click(function() {
            var promises = [];
            for (var i = 0; i < prodSeasonIds.length; i++) {
                var promise = $.post('/api/favourites/UpdateFavourites', {
                    ListType: 1,
                    Mode: 'A',
                    ProductionSeasonNumber: prodSeasonIds[i]
                });
                promises.push(promise);
            }
            $.when
                .apply(undefined, promises)
                .done(function() {
                    $btn.hide();
                    $favouritesAdded.show();
                    $favouritesError.hide();
                })
                .fail(function() {
                    $btn.show();
                    $favouritesAdded.hide();
                    $favouritesError.show();
                });
        });
    });
});

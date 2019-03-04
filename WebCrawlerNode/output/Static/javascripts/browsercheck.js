$(function () {
    var header, para1, para2, closeMessage, closeLink, browserInfo;
    if (rdtCurrentCulture == 'en') {
        header = "You should update your browser";
        para1 = "The browser you are using have not been updated for several years. In order to ensure that our web site functions correctly, and for safety reasons, please update your browser. On Mac your can update via the App Store, accessible from the Apple Menu. On PC via Windows Update.",
        para2 = "You may also choose to download one of these alternate browsers instead:";
        closeMessage = "You can close this window without updating, but " +
                       "the web site will not function correctly.";
        closeLink = "Close this window";
        browserInfo = {
            chrome: {
                url: 'http://www.google.com/chrome'
            },
            firefox: {
                url: 'http://www.mozilla.com/firefox'
            },
            msie: {
                url: 'http://www.microsoft.com/windows/Internet-explorer/'
            }
        };
    } else {
        header = "Du bør opdatere din internetbrowser";
        para1 = "Vi kan se, at den browser du benytter ikke har været opdateret i et par år. For at sikre, at vores hjemmeside virker korrekt, og af hensyn til sikkerheden, bør du opdatere din browser. På Mac kan du gøre det via App Store som du finder i æblemenuen. På PC via Windows Update.",
        para2 = "Du kan også hente en af disse alternative browsere i stedet:";
        closeMessage = "Du kan lukke dette vindue uden at opdatere, men " +
                       "så vil hjemmesiden ikke fungere korrekt.";
        closeLink = "Luk dette vindue";
        browserInfo = {
            chrome: {
                url: 'https://www.google.dk/chrome'
            },
            firefox: {
                url: 'https://www.mozilla.org/da/firefox/'
            },
            msie: {
                url: 'http://windows.microsoft.com/da-dk/internet-explorer/download-ie'
            }
        };
    }

    $.reject({
        reject: {
            msie: 9,
        },
        beforeReject: function () {
            if ($.os.name === 'iPhone' || $.os.name === 'iPad') {
                this.reject = { all: false };
            }
            if ($.os.name === 'mac' && $.browser.name === 'safari' && $.browser.version.indexOf("7.0") > -1) {
                this.reject = { all: true };
            }
        },
        display: ['chrome', 'firefox', 'msie'],
        browserInfo: browserInfo,
        header: header,
        paragraph1: para1,
        paragraph2: para2,
        closeMessage: closeMessage,
        closeLink: closeLink,
        imagePath: '/Static/images/'
    });
});
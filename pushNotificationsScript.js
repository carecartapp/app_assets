// js-storefront-script.js GH v.1.0.10
// Updated at: 20-12-2018
var isAjax = 0;
var isCartLoading = 0;
var isCheckForCall = true;
function getQueryParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function scriptInjection(src, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";

    script.src = src;
    if (typeof  callback == 'function') {
        script.addEventListener('load', callback);
    }

    document.getElementsByTagName('head')[0].appendChild(script);

}

function cssFileInjection(href) {
    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
}

function PushNotificationsScript() {

    var customer = {};
    var store = {};
    var apiBaseUrl = "https://app-er.carecart.io";
    var ccPnAuthUrl = "https://pn-app-er.carecart.io";

    var pnSubscriptionPopupData = {};
    var pnChildWindowData = {};
    var isImpressionCapturedByPushNotification = false;
    var isImpressionCapturedByEmailCollector = false;

    this.init = function (callback, callbackArgs) {
        console.log("Initialization started Push");
        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
            window.carecartJquery = jQuery.noConflict(true);
            addJqueryEventListeners();
            store = carecartJquery.parseJSON(carecartJquery('#care-cart-shop-information').text());
            pnSubscriptionPopupData = abandonedCart.globalSettingsAndData.pnSubscriptionPopup[0];
            pnChildWindowData = abandonedCart.globalSettingsAndData.pnSubscriptionPopupChildWindow;
            //showProPnSubscriptionPopup(pnSubscriptionPopupData);

        })
    }
    // Called sometime after postMessage is called
    function receiveMessage(event) {
        // Do we trust the sender of this message?
        if (event.origin !== apiBaseUrl)
            return;

        if (event.data.hasOwnProperty('postMessageFunction') && typeof event.data.postMessageFunction === 'string') {
            switch (event.data.postMessageFunction) {
                case 'closeDiscountSpinnerPopup':
                    closeDiscountSpinnerPopup();
                    break;
            }

        }
    }

    function getProductPagePath() {
        var productDetailsPath = /https?\:\/\/([^\/]*)(.*\/products[^\?]*).*/;
        var currentUrl = String(getCurrentURL());
        var matched = currentUrl.match(productDetailsPath);
        return matched != null && matched.length > 2 ? matched[2] : null;
    }

    function getCurrentPageUrlWithoutQueryParameters() {
        var productDetailsPath = /https?\:\/\/([^\/]*)([^\?]*).*/;
        var currentUrl = String(getCurrentURL());
        var matched = currentUrl.match(productDetailsPath);
        return matched != null && matched.length > 2 ? matched[2] : null;
    }

    function getCurrentURL() {
        return window.location.href;
    }

     this.showProPnSubscriptionPopup = function (popupData) {

        var popupStatus = window.localStorage.getItem('cc-pn-subscription-popup');
        if (popupStatus) {
            return false;
        }
        console.log('in function');
        console.log(popupData);
        if (popupData && popupData.popup_is_active && popupData.popup_is_active == 1) {
             populateOptinPopupPreview(popupData, function (preparedHtml) {
                 console.log('after ');
                if (isImpressionCapturedByPushNotification == false) {
                    isImpressionCapturedByPushNotification = true;
                    setTimeout(function () {
                        carecartJquery('body').append(preparedHtml);
                        if (popupData.appearance_location == 'TOP_CENTER') {
                            carecartJquery('#cc_pn_notification_template').css({
                                'top': '5px',
                                'left': '37%'
                            });
                        } else if (popupData.appearance_location == 'TOP_LEFT') {
                            carecartJquery('#cc_pn_notification_template').css({
                                'top': '5px',
                                'left': '5px'
                            });
                        } else if (popupData.appearance_location == 'TOP_RIGHT') {
                            carecartJquery('#cc_pn_notification_template').css({
                                'top': '5px',
                                'right': '15px'
                            });
                        } else if (popupData.appearance_location == 'BOTTOM_RIGHT') {
                            carecartJquery('#cc_pn_notification_template').css({
                                'bottom': '0px',
                                'right': '15px'
                            });
                        }
                    }, popupData.popup_delay_in_seconds + '000');

                    AbandonedCartCreateScript.process(0, '', 0, 'PUSH_NOTIFICATION ');
                }
            });
        }
    }
    function populateOptinPopupPreview(popupData, callback) {

        var popupTitle = popupData.popup_title;
        var popupDescription = popupData.popup_description_text;
        var popupAllowButtonText = popupData.popup_allow_button_text;
        var popupDisAllowButtonText = popupData.popup_disallow_button_text;
        var popupLogoUrl = popupData.popup_logo_public_url || apiBaseUrl + '/img/push-not--pop.png';
        var appearanceLocation = popupData.appearance_location;
        var isPoweredByTextStatus = popupData.is_active_powered_by;
        var popupDelay = popupData.popup_delay_in_seconds;


        var tmplHtml = popupData.pn_subscription_popup_template;

        var preparedHtml = tmplHtml.replace('{CC-PN-POWERED-BY-IMG}', apiBaseUrl + '/img/logo.png');
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-IMAGE}', popupLogoUrl);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-TITLE}', popupTitle);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-DESCRIPTION}', popupDescription);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-ALLOW-BUTTON-TEXT}', popupAllowButtonText);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-DISALLOW-BUTTON-TEXT}', popupDisAllowButtonText);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-BRANDED-TEXT-STATUS}', (isPoweredByTextStatus == 1) ? 'block' : 'none');

        if (typeof callback == 'function') callback(preparedHtml);

    };

    function addJqueryEventListeners() {


        carecartJquery.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });

        carecartJquery('body').on('click', '#pn-optin-disallow-btn-text', function () {
            window.localStorage.setItem('cc-pn-subscription-popup', 'DENIED');
            window.localStorage.setItem('cc-pn-subscription-token', '');
            carecartJquery('#cc_pn_notification_template').hide();
        });
        carecartJquery('body').on('click', '#pn-optin-allow-btn-text', function () {
            var prepareDataForChildWindow = encodeURIComponent(JSON.stringify(pnChildWindowData));
            var permissionViewLink =  ccPnAuthUrl + '/getPnToken?cc_pn_lp=' + prepareDataForChildWindow + '&shop=' + store.domain;
            var permissionPopup = openPermissionTab(permissionViewLink, store.domain, '400px', '400px');
            carecartJquery('#cc_pn_notification_template').hide();
        });

        carecartJquery('body').on('click', '#cc-pn-disallow-subs-btn', function () {
            window.localStorage.setItem('cc-pn-subscription-popup', 'DENIED');
            window.localStorage.setItem('cc-pn-subscription-token', '');
            carecartJquery('#cc-pn-table').hide();

        });


        carecartJquery('body').on('click', '#cc-pn-allow-subs-btn', function () {
         console.log('pnSubscriptionPopupData');
            console.log(pnSubscriptionPopupData);
            var popupData = {
                'title': (pnSubscriptionPopupData && pnSubscriptionPopupData.landing_page_title) ? pnSubscriptionPopupData.landing_page_title : '',
                'text': (pnSubscriptionPopupData && pnSubscriptionPopupData.landing_page_description) ? pnSubscriptionPopupData.landing_page_description : '',
                'logo_url': (pnSubscriptionPopupData && pnSubscriptionPopupData.landing_page_logo_url) ? pnSubscriptionPopupData.landing_page_logo_url : '',
            };
            popupData = encodeURI(JSON.stringify(popupData));

            var permissionViewLink = 'https://' + ccPnAuthUrl + '/getPnToken?cc_pn_lp=' + popupData + '&shop=' + store.domain;
            var permissionPopup = openPermissionTab(permissionViewLink, store.domain, '400px', '400px');
        });

    }


    window.addEventListener("message", function (e) {
        // console.log('Message Received on Parent..!!!!', e);
        if (e.origin != ccPnAuthUrl) {
            return false;
        }
        var fcmToken = (e && e.data && e.data.token) ? e.data.token : '';
        var subsStatus = (e && e.data && e.data.status) ? e.data.status : '';
        window.localStorage.setItem('cc-pn-subscription-popup', subsStatus);
        window.localStorage.setItem('cc-pn-subscription-token', fcmToken);
        carecartJquery('#cc-pn-table').hide();
        window.localStorage.setItem('cartHash_cached', '');
        AbandonedCartCreateScript.process(0);
        return;
    }, false);




    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    function openPermissionTab(url, title, w, h) {
        var left = (screen.width / 2) - (w / 2);
        var top = (screen.height / 2) - (h / 2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    }

}


var PushNotificationsScript = new PushNotificationsScript();
PushNotificationsScript.init();

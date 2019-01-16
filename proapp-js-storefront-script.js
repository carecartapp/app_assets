// proapp-js-storefront-script.js GH v.1.0.22
// Updated at: 09-01-2019

//zeb 8-1-2019 
var isAjax = 0;
function getCurrentURL() {
    return window.location.href;
}

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

function cssFileInjection(href) {
    var link = document.createElement("link");
    link.href = href;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
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

function AbandonedCart() {

    var customer = {};
    var store = {};
    var apiBaseUrl = "https://proapp.carecart.io";
    var ccPnAuthUrl = "https://proapp-notifications.carecart.io";
    var pnSubscriptionPopupData = {};
    var pnChildWindowData = {};
    var facebookCheckboxWidget = {};
    var facebookCheckboxWidgetStatus = null;
    var facebookCheckboxWidgetType = null;
    var facebookPageData = {};
    var facebookAppID = null;
    var isImpressionCapturedByPushNotification = false;
    var isImpressionCapturedByEmailCollector = false;
    var isMessengerWidgetPopulated = false;

    this.init = function (callback, callbackArgs) {
        // console.log("Initialization started");

        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
            scriptInjection("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js", function () { //zeb 8-1-2019
            window.carecartJquery = jQuery.noConflict(true);
            scriptInjection("https://use.fontawesome.com/e0a385ecbc.js");
            cssFileInjection("https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&amp;subset=all");


            if (carecartJquery('#care-cart-customer-information').length == 0 || carecartJquery('#care-cart-shop-information').length == 0) {
                var storeData = {};
                storeData.store = {
                    'domain': Shopify.shop
                }

                carecartJquery.ajax({
                    url: apiBaseUrl + "/api/cart/store-front/need-reinstall-store",
                    type: 'POST',
                    data: storeData,
                    success: function (response) {
                        // console.log('need-reinstall-store response');
                        // console.log(response);
                    },
                    error: function (error) {
                        // console.log('need-reinstall-store error');
                        // console.log(error);
                    }
                });
            } else {

                customer = carecartJquery.parseJSON(carecartJquery('#care-cart-customer-information').text());
                store = carecartJquery.parseJSON(carecartJquery('#care-cart-shop-information').text());
            }


            addJqueryEventListeners();

            // console.log("Initialization completed");
            if (typeof callback == 'function') {
                callback.apply(this, callbackArgs);
            }

        });

        window.addEventListener("message", receiveMessage, false);
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


    function getCart(callback) {
        carecartJquery.ajax({
            url: '/cart.js',
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                callback(response);
            },
            error: function (error) {
                callback(error.responseText);
            }
        });
    }

    function clearCart(callback) {
        carecartJquery.ajax({
            url: '/cart/clear.js',
            type: 'GET',
            dataType: 'JSON',
            success: function (response) {
                callback(response);
            },
            error: function (error) {
                callback(error.responseText);
            }
        });
    }

    function getCartFromCommandCenter(id, callback) {
        carecartJquery.ajax({
            url: apiBaseUrl + "/api/cart/store-front/" + id,
            data: {
                store: store
            },
            success: function (response) {
                if (!response.records.hasOwnProperty('cart')) {
                    window.location = '/cart';
                } else {
                    callback(response.records.cart);
                }
            }
        });
    }

    function addProductToCart(product, callback) {

        carecartJquery.ajax({
            url: "/cart/add.js",
            type: 'POST',
            dataType: 'JSON',
            data: product,
            success: function (response) {
                callback(response);
                // console.log('------------- Recreation of cart started -------------');
                // console.log(response);
                // console.log('------------- Recreation of cart end     -------------');
            }
        });
    }


    function updateCartTokenOnCommandCenter(newToken, cart, callback) {

        var data = {
            newToken: newToken,
            store: store
        };

        carecartJquery.ajax({
            url: apiBaseUrl + "/api/cart/store-front/update-token/" + cart.id,
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (response) {
                callback(response);
                // console.log('------------- Update cart token started -------------');
                // console.log(response);
                // console.log('------------- Update cart token end     -------------');
                callback(response);
            }
        });

    }


    function isOnlyRecoverCart(cart) {

        var queryParametersArray = getQueryParameters();
        if (typeof queryParametersArray != "undefined" && typeof queryParametersArray.recover_care_cart != 'undefined' && queryParametersArray.recover_care_cart != '') {
            carecartJquery('body').html('Loading....');
            getCartFromCommandCenter(queryParametersArray.recover_care_cart, function (recoveryCart) {
                recoverCart(cart, recoveryCart);
            });
            return true;
        }


        return false;


    }

    function recoverCart(cart, recoveryCart) {

        clearCart(function (clearCartResponse) {
            var productsProcessedCount = 0;

            var isProductAddedToCart = undefined;

            if (!recoveryCart.items || !recoveryCart.items.length > 0) {
                window.location = '/cart';
            }

            if (recoveryCart.items.length > 0) {
                var isProductAddedToCartInterval = setInterval(function () {
                    if (isProductAddedToCart == undefined) {
                        isProductAddedToCart = false;
                        addProductToCart(recoveryCart.items[productsProcessedCount], function (addProductToCartResponse) {
                            productsProcessedCount++;
                            isProductAddedToCart = true;
                        });

                    } else if (isProductAddedToCart == true) {
                        isProductAddedToCart = undefined;
                    }

                    if (productsProcessedCount == recoveryCart.items.length) { //all products added to cart now stop that loop
                        // console.log("done ..... " + productsProcessedCount);
                        clearInterval(isProductAddedToCartInterval);
                    }


                }, 100);
            }


            var isAllProductsProcessedInterval = setInterval(function () {

                if (productsProcessedCount == recoveryCart.items.length) {
                    // console.log("Products processed: " + productsProcessedCount);
                    clearInterval(isAllProductsProcessedInterval);
                    if (cart != undefined) {
                        getCart(function (cart) {
                            var newToken = cart.token;
                            var oldToken = recoveryCart.token;

                            updateCartTokenOnCommandCenter(newToken, recoveryCart, function (updateCartTokenOnCommandCenterResponse) {
                                window.location = '/cart';
                            });
                        });
                    } else {

                        location.reload();
                        return false;
                    }
                }
            }, 100);

        });


    };

    this.process = function (isCapturedByPopup, callBack, isCapturedByMagnet, impressionBy) {
        if (!impressionBy) {
            impressionBy = '';
        }
        // console.log("Processing started", isCapturedByPopup);
        getCart(function (cart) {
            if (isCapturedByPopup == 1) {
                cart.is_email_captured_by_popup = 1;
            }
            if (isCapturedByMagnet == 1) {
                cart.is_captured_by_email_magnet = 1;
            }
            var pnSubscriptionData = {
                'token': (window.localStorage.getItem('cc-pn-subscription-token')) ? window.localStorage.getItem('cc-pn-subscription-token') : '',
                'status': (window.localStorage.getItem('cc-pn-subscription-popup')) ? window.localStorage.getItem('cc-pn-subscription-popup') : ''
            };

            var data = {
                customer: customer,
                cart: cart,
                store: store,
                pnData: pnSubscriptionData,
                productPagePath: getProductPagePath(),
                currentPageUrlWithoutQueryParameters: getCurrentPageUrlWithoutQueryParameters(),
                impressionBy: impressionBy
            };

            if (isOnlyRecoverCart(cart)) {
                // console.log('Recovering cart...')
            } else {
                // console.log("Update cart on command center");
                //zeb 8-1-2019
                var proCartHash_cached = "1";
                var proCartHash_live = "2";

                try {
                proCartHash_cached = String(window.localStorage.getItem('proCartHash_cached'));
                proCartHash_live = CryptoJS.MD5(JSON.stringify(cart)).toString();
                } catch (e) { }

                if (proCartHash_cached != proCartHash_live) {
                    //zeb code end 8-1-2019

                carecartJquery.ajax({
                    url: apiBaseUrl + "/api/cart/store-front/create",
                    dataType: 'json',
                    type: 'POST',
                    data: data,
                    success: function (response) {
                        if (response._metadata.outcomeCode == 0 && response.records.cart) {
                            var cartData = response.records.cart;
                            var addToCartPopUpData = response.records.addToCartPopUp;
                            var titleDesignerData = response.records.titleDesigner;
                            pnSubscriptionPopupData = (response && response.records && response.records.pnSubscriptionPopup) ? response.records.pnSubscriptionPopup : {};
                            pnChildWindowData = (response && response.records && response.records.pnSubscriptionPopupChildWindow) ? response.records.pnSubscriptionPopupChildWindow : {};
                            showAdvanceTitleBar(titleDesignerData, cartData.item_count);
                            showPnSubscriptionPopup(pnSubscriptionPopupData);
                            if (response.records.isNeedToReInsert) {
                                recoverCart(undefined, cartData);
                            }

                            if (response.records.hasOwnProperty('gdpr') && response.records.gdpr != null) {//GDPR Processing
                                var gdprData = response.records.gdpr;
                                checkGdprToShow(gdprData);

                            }

                            if (response.records.hasOwnProperty('discountSpinnerPopup') && response.records.discountSpinnerPopup != null) {//Discount Spinner Popup Processing
                                var discountSpinnerPopup = response.records.discountSpinnerPopup;
                                showDiscountSpinnerPopup();

                            }

                            if (response.records.hasOwnProperty('messenger') && response.records.messenger != null) {//Messenger Processing
                                var messengerData = response.records.messenger;
                                if (isMessengerWidgetPopulated == false) {
                                    isMessengerWidgetPopulated = true;
                                    processMessenger(messengerData);
                                }


                            }

                            if (getParameterByName('cc-preview-email-collector')) {
                                showAddToCartPopup(addToCartPopUpData, function () {
                                    carecartJquery('#cc-atcp-table', 'body').show();
                                })
                            } else {

                                carecartJquery('body').on('click', '#cc_f-p-preview-email-btn', function () {
                                    carecartJquery('#cc_f-p-preview-email-placeholder-error', 'body').hide();
                                    var email = carecartJquery('#cc_f-p-preview-email-placeholder', 'body').val();
                                    if (!validateEmail(email)) {
                                        carecartJquery('#cc_f-p-preview-email-placeholder-error', 'body').show();
                                    } else {
                                        customer.email = email;
                                        abandonedCart.process(1, function () {
                                            //zeb 8-1-2019
                                            if(isAjax == 0) {
                                                carecartJquery('form[action="/cart/add"]').submit();
                                            }
                                        }, 0);
                                    }
                                });
                                enableEmailMagnet(cartData);
                                checkAddToCartPopup(cartData, addToCartPopUpData, callBack);
                                //zeb 8-1-2019
                                window.localStorage.setItem('proCartHash_cached', proCartHash_live);

                            }
                        }
                    }
                });
            }
            }

        });

    };
    function enableEmailMagnet(cartData) {
        if (cartData && !cartData.email) {
            carecartJquery(document).on('blur', 'input', function (e) {
                if ($(this).attr('id') == 'cc_f-p-preview-email-placeholder') {
                    return false;
                }
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(String(carecartJquery(this).val()))) {
                    customer.email = carecartJquery(this).val();
                    abandonedCart.process(0, '', 1);
                }
            });
        }
    }

    function checkAddToCartPopup(cartData, addToCartPopUpData, callBack) {

        if (cartData && !cartData.email && cartData.item_count != 0) {
            if (addToCartPopUpData && addToCartPopUpData.is_active && addToCartPopUpData.is_active != 0) {

                if (!cartData.email) {
                    showAddToCartPopup(addToCartPopUpData, function () {
                        carecartJquery('#cc-atcp-table', 'body').show();
                    });
                }

                $('body').one('submit', 'form[action="/cart/add"]', function (e) {

                    submitEvent = e;
                    if (!cartData.email) {
                        showAddToCartPopup(addToCartPopUpData, function () {
                            carecartJquery('#cc-atcp-table', 'body').show();
                        });
                    } else {
                        abandonedCart.process(0);
                    }

                });


            }
        } else {
            if (typeof callBack == 'function') callBack();
            // carecartJquery('#cc_f-p-preview-email-btn', 'body').button('reset');
            if (carecartJquery('#cc-atcp-table', 'body').length > 0) {
                carecartJquery('#cc-atcp-table', 'body').remove();
            }
        }

    }

    function setUpFacebookAPPCredentials(appId) {
        window.fbAsyncInit = function () {
            FB.init({
                appId: appId,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.1'
            });

            FB.Event.subscribe('messenger_checkbox', function (e) {
                // console.log("messenger_checkbox event");
                // console.log(e);

                if (e.event == 'rendered') {
                    // console.log("Plugin was rendered");
                } else if (e.event == 'checkbox') {
                    var checkboxState = e.state;
                    facebookCheckboxWidgetStatus = e.state;
                    if (e.state == 'checked') {

                    }
                    // console.log("Checkbox state: " + checkboxState);
                } else if (e.event == 'not_you') {
                    // console.log("User clicked 'not you'");
                } else if (e.event == 'hidden') {
                    // console.log("Plugin was hidden");
                }

            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));


        var elem = document.createElement('div');
        elem.setAttribute('id', 'fb-root');
        document.body.appendChild(elem);

    }

    function displayFacebookMessenger(facebookPageData, facebookMessengerData) {

        if (!facebookPageData.hasOwnProperty('ref_facebook_page_id') || facebookPageData.ref_facebook_page_id == undefined || !facebookPageData.ref_facebook_page_id) return;
        if (!facebookMessengerData.hasOwnProperty('id') || facebookMessengerData.id == undefined || !facebookMessengerData.id) return;

        if (facebookMessengerData.is_active != 1) return;

        var elem = document.createElement('div');
        elem.setAttribute('class', 'fb-customerchat');
        elem.setAttribute('attribution', 'setup_tool');
        elem.setAttribute('page_id', facebookPageData.ref_facebook_page_id);
        elem.setAttribute('theme_color', facebookMessengerData.theme_color);
        elem.setAttribute('logged_in_greeting', facebookMessengerData.logged_in_users_greeting_text);
        elem.setAttribute('logged_out_greeting', facebookMessengerData.logged_out_users_greeting_text);
        elem.setAttribute('minimized', facebookMessengerData.display_options);
        document.body.appendChild(elem);
    }

    function confirmOptIn() {
        var data = {
            'app_id': (facebookAppID) ? facebookAppID : '',
            'page_id': (facebookPageData.ref_facebook_page_id) ? facebookPageData.ref_facebook_page_id : '',
            'ref': (facebookCheckboxWidget.ref) ? facebookCheckboxWidget.ref : '',
            'user_ref': (facebookCheckboxWidget.user_ref) ? facebookCheckboxWidget.user_ref : ''
        };

        FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, data);
    }

    function displayFacebookCheckboxWidget(appId, facebookPageData, facebookCheckboxWidget) {

        if (!facebookPageData.hasOwnProperty('ref_facebook_page_id') || facebookPageData.ref_facebook_page_id == undefined || !facebookPageData.ref_facebook_page_id) return;
        if (!facebookCheckboxWidget.hasOwnProperty('id') || facebookCheckboxWidget.id == undefined || !facebookCheckboxWidget.id) return;
        if (!facebookCheckboxWidget.hasOwnProperty('checkbox_widget') || facebookCheckboxWidget.checkbox_widget == undefined || facebookCheckboxWidget.checkbox_widget.id == undefined || !facebookCheckboxWidget.checkbox_widget.id) return;
        if (facebookCheckboxWidget.is_active == 0) return;
        var checkBoxWidgetData = facebookCheckboxWidget.checkbox_widget;

        var elem = document.createElement('div');
        elem.setAttribute('origin', facebookCheckboxWidget.origin);
        elem.setAttribute('page_id', facebookPageData.ref_facebook_page_id);
        elem.setAttribute('messenger_app_id', appId);
        elem.setAttribute('user_ref', (facebookCheckboxWidget.user_ref) ? facebookCheckboxWidget.user_ref : '');
        elem.setAttribute('class', 'fb-messenger-checkbox');
        elem.setAttribute('prechecked', 'true');
        elem.setAttribute('allow_login', 'true');
        elem.setAttribute('size', (facebookCheckboxWidget.checkbox_widget.size) ? facebookCheckboxWidget.checkbox_widget.size : '');
        elem.setAttribute('skin', (facebookCheckboxWidget.checkbox_widget.text_color) ? facebookCheckboxWidget.checkbox_widget.text_color : '');
        elem.setAttribute('center_align', (facebookCheckboxWidget.checkbox_widget.center_align == 1) ? 'true' : 'false');

        var mainElem = '<div style="margin: 0 !important;border: 1px solid #ededed;padding: 10px 10px 17px;border-radius: 4px;" id="cc-atc-widget-main-container">' +
            '<div class="name-detail name-detail-edit" style="padding-top: 0 !important;">' +
            '<h4 id="cc_messenger_widget_atc_title">' + facebookCheckboxWidget.checkbox_widget.text + '</h4>' +
            '<div id="cc-atc-widget-container"></div>' +
            '</div>' +
            '</div>';

        if (checkBoxWidgetData.type == 'ATC') {
            facebookCheckboxWidgetType = "ATC";

            populateATCWidget(mainElem, elem, function () {
                $("#cc_messenger_widget_atc_title").css('font-size', facebookCheckboxWidget.checkbox_widget.size);

                if (facebookCheckboxWidget.checkbox_widget.text_color == 'dark') {
                    $("#cc-atc-widget-main-container").css('background-color', '#383838');
                    $("#cc_messenger_widget_atc_title").css('color', '#fff');
                } else {
                    $("#cc-atc-widget-main-container").css('background-color', '');
                    $("#cc_messenger_widget_atc_title").css('color', '#000');
                }

                if (facebookCheckboxWidget.checkbox_widget.center_align == 1) {
                    $("#cc_messenger_widget_atc_title").css('text-align', 'center');
                } else {
                    $("#cc_messenger_widget_atc_title").css('text-align', 'left');
                }
            });
        } else {
            showDiscountWidget(checkBoxWidgetData, elem);
        }
    }

    function showDiscountWidget(checkBoxWidgetData, elem) {
        var careCartMessengerDiv = $("body").find(".carecart-messenger");
        var myvar = '<div id="cc-messenger-discount-popup" class="discount-coupon-wrapper-cc" style="width: 400px;">' +
            '<div style="text-align: center;max-width: 400px;">' +
            '<h4 style="color: #3c495a;font-size: 16px;font-weight: 700;">' + checkBoxWidgetData.title + '</h4>' +
            '<p style="color: #7a8da4;font-size: 12px;">' + checkBoxWidgetData.subtitle + '</p>' +
            '</div>' +
            '<div id="cc-messenger-checkbox-for-copy" style="border: 1px solid #ededed;padding: 10px 10px 7px;border-radius: 4px;display: inline-flex;    min-width: 400px !important;">' +
            '<div style="background-color: #ff008a;font-size: 24px;color: #fff;padding: 13px 20px;border-radius: 4px;border: 1px solid #ededed;width: 85px;height: 65px;float: left;margin-right: 35px;text-align: center;">%</div>' +
            '<div style="padding-top: 0px;" id="cc-messenger-checkbox-optin">' +
            '</div>' +
            '</div>' +
            '<div style="text-align: center;">' +
            '<a id="cc-dw-btn" style="cursor:pointer;background-color: #00a651;color: #fff;font-size: 13px;padding: 12px 25px;     position: relative; top: 20px;;" type="button">' + checkBoxWidgetData.coupon_button + '</a><br>' +
            '<span style="color: red;display: none;position: relative;top: 35px;" id="cc-checkboc--erorr">Please check FB Plugin</span>' +
            '</div>' +

            '</div>';

        if (careCartMessengerDiv.length > 0) {
            carecartJquery(careCartMessengerDiv).append(myvar);
            carecartJquery('#cc-messenger-checkbox-optin').append(elem);
        } else {
            carecartJquery('form[action="/cart/add"]').append(myvar);
            carecartJquery('#cc-messenger-checkbox-optin').append(elem);
        }
    }

    function populateATCWidget(mainElem, elem, callBack) {
        var careCartMessengerDiv = $("body").find(".carecart-messenger");
        if (careCartMessengerDiv.length > 0) {
            carecartJquery(careCartMessengerDiv).append(mainElem);
            carecartJquery('#cc-atc-widget-container').append(elem);
        } else {
            carecartJquery('form[action="/cart/add"]').append(mainElem);
            carecartJquery('#cc-atc-widget-container').append(elem);
        }

        if (typeof callBack == 'function') callBack();
    }

    function populateDiscountWidget(myvar, callBack) {


        if (typeof callBack == 'function') callBack();
    }

    function processMessenger(messengerData) {

        if (messengerData == undefined || messengerData == null) return;
        if (!messengerData.hasOwnProperty('appId') || messengerData.appId == undefined || !messengerData.appId) return;
        var appId = messengerData.appId;
        setUpFacebookAPPCredentials(appId);//initilize facebook app


        if (messengerData.hasOwnProperty('facebookPage') && !(messengerData.facebookPage == undefined) && messengerData.facebookPage) {//verify facebook page property exists
            if (messengerData.hasOwnProperty('facebookMessenger') && !(messengerData.facebookMessenger == undefined) && messengerData.facebookMessenger) {//verify facebook messenger property exists
                displayFacebookMessenger(
                    messengerData.facebookPage,
                    messengerData.facebookMessenger
                );
            }//End verify facebook messenger property exists

            if (messengerData.hasOwnProperty('facebookCheckboxWidget') && !(messengerData.facebookCheckboxWidget == undefined) && messengerData.facebookCheckboxWidget) {//verify facebook checkbox widget property exists
                facebookCheckboxWidget = messengerData.facebookCheckboxWidget;
                facebookPageData = messengerData.facebookPage;
                facebookAppID = messengerData.appId;
                displayFacebookCheckboxWidget(
                    appId,
                    messengerData.facebookPage,
                    messengerData.facebookCheckboxWidget
                );
            }//End verify facebook checkbox widget property exists


        }//End verify facebook page property exists

    }

    $("body").on("click", "#cc-dw-btn", function () {
        var myvar =
            '<div style="background-color: #00a651;font-size: 24px;color: #fff;padding: 4px 20px;border-radius: 4px;border: 1px solid #ededed;width: 85px;height: 45px;float: left;margin-right: 35px;text-align: center;"><i class="fa fa-check"></i></div>' +
            '<h5 style="margin-top:15px">' +
            '<span style="word-break: break-all;">' + facebookCheckboxWidget.checkbox_widget.discount_text + '</span>' +
            '<span id="cc-dw-copy" style="word-break: break-all;">' + facebookCheckboxWidget.checkbox_widget.discount_code + '</span>' +
            '</h5>';

        if (facebookCheckboxWidgetStatus == null || facebookCheckboxWidgetStatus == "unchecked") {
            $("#cc-checkboc--erorr").show();
        } else {
            $("#cc-checkboc--erorr").hide();
            $(this).html(facebookCheckboxWidget.checkbox_widget.copy_button);
            $(this).attr("id", "cc-dw-copy");
            $(this).attr("name", "copy_pre");
            $("#cc-messenger-checkbox-for-copy").html(myvar);
        }
    });

    $('body').on('click', 'a[name=copy_pre]', function () {
        var id = $(this).attr('id');
        var el = document.getElementById(id);
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        alert("Code copied to clipboard.");
        return false;
    });


    function checkGdprToShow(gdprData) {

        if (gdprData && gdprData.is_active && gdprData.is_active != 0 && isGdrpActivated() === null) {
            showGdprHtml(gdprData);
        }
    }

    function showGdprHtml(data) {

        var gdprHtml = '<div id="carecart_gdpr_div" ' +
            'style="font-family: ' + data.notification_message_font_family + ';background: ' + data.bg_color + ';color: ' + data.notification_message_font_color + ';padding: 11px 20px 20px;position: fixed;text-align: left;width: 100%;-webkit-transform: translateY(100%);transform: translateY(100%);transition: -webkit-transform .8s ease 0s;-webkit-transition: -webkit-transform .8s ease 0s;transition: transform .8s ease 0s;transition: transform .8s ease 0s,-webkit-transform .8s ease 0s;left: 0;' + String(data.notification_position).toLowerCase() + ': 0;-webkit-transform: translateY(0);transform: translateY(0);z-index:999;">\n' +
            '  <p style="font-family:' + data.notification_message_font_family + ';  margin: 0 0 5px;font-size: 17px; color:' + data.notification_message_font_color + ';">' + data.notification_message + '</p>\n' +
            '  <div class="">\n' +
            '    <button  ' +
            '     onclick="abandonedCart.updateGdrpAcceptance(1)"' +
            '    style="color: ' + data.accept_btn_text_color + ';\n' +
            '    text-decoration: none;\n' +
            '    background: ' + data.accept_btn_bg_color + ';\n' +
            '    font-size: 14px;\n' +
            '    border-radius: 0;\n' +
            '    padding: 8px;\n' +
            '    width: 140px;\n' +
            '    font-weight: normal;\n' +
            '    margin: 0 5px 0 0;\n' +
            '    border: none !important;">' + data.accept_btn_text + '</button>\n' +
            '    <button' +
            '    onclick="abandonedCart.updateGdrpAcceptance(0)"' +
            '    style="    color: ' + data.decline_btn_text_color + ';\n' +
            '    text-decoration: none;\n' +
            '    background: ' + data.decline_btn_bg_color + ';\n' +
            '    font-size: 14px;\n' +
            '    border-radius: 0;\n' +
            '    padding: 9px;\n' +
            '    width: 140px;\n' +
            '    font-weight: normal;\n' +
            '    margin: 0 5px 0 3px;\n' +
            '    border: none !important;">' + data.decline_btn_text + '</button>\n' +
            '    <button onclick="window.location.href = \'' + data.read_more_btn_target_url + '\'" style="color: ' + data.read_more_btn_text_color + ';\n' +
            '    text-decoration: none;\n' +
            '    background: ' + data.read_more_btn_bg_color + ';\n' +
            '    font-size: 14px;\n' +
            '    border-radius: 0;\n' +
            '    padding: 8px;\n' +
            '    width: 140px;\n' +
            '    font-weight: normal;\n' +
            '    margin: 0 5px 0 0;\n' +
            '    border: none !important;">' + data.read_more_btn_text + '</button>\n' +
            '  </div>\n' +
            '</div>';


        carecartJquery('body').append(gdprHtml);
    }

    function hideGdprHtml() {
        carecartJquery("#carecart_gdpr_div").remove();
    }

    this.updateGdrpAcceptance = function updateGdrpAcceptance(is_accepted) {
        localStorage.setItem('gdrp_accepted_status', is_accepted);
        hideGdprHtml();
    }

    function isGdrpActivated() {
        return localStorage.getItem('gdrp_accepted_status');
    }


    function showAddToCartPopup(data, callBack) {

        if (carecartJquery('body').find('#cc-atcp-table').length > 0) {
            return false;
        }

        var closeButton = "";
        var bannerImageURl = (data.email_banner_public_url != '') ? data.email_banner_public_url : apiBaseUrl + '/img/cart-popup.png';
        var headingFontWeight = (data.heading_is_bold == 1) ? 'bold' : 'normal';
        var headingFontStyle = (data.heading_is_italic == 1) ? 'italic' : 'normal';
        var headingFontSize = data.heading_font_size + 'px';
        var headingTextAlignment = data.heading_text_align.toLowerCase();
        var headingColor = data.heading_color;
        var headingText = data.heading_text;

        var descriptionFontWeight = (data.description_is_bold == 1) ? 'bold' : 'normal';
        var descriptionFontStyle = (data.description_is_italic == 1) ? 'italic' : 'normal';
        var descriptionFontSize = data.description_font_size + 'px';
        var descriptionTextAlignment = data.description_text_align.toLowerCase();
        var descriptionColor = data.description_color;
        var descriptionText = data.description_text;

        var emailPlaceHolder = data.email_placeholder;

        var buttonFontWeight = (data.button_is_bold == 1) ? 'bold' : 'normal';
        var buttonFontStyle = (data.button_is_italic == 1) ? 'italic' : 'normal';
        var buttonFontSize = data.button_font_size + 'px';
        var buttonTextAlignment = data.button_text_align.toLowerCase();
        var buttonColor = data.button_text_color;
        var buttonText = data.button_text;
        var buttonBackgroundColor = data.button_background_color;

        if (data.is_active_close_button == 1) {
            closeButton = '<div id="cc_f-p-close" class="close-action" style="    position: absolute;' +
                'right: 16px;' +
                'font-size: 16px;' +
                'cursor: pointer;' +
                'color: #a6a6a6;">X' +
                '</div>';
        }

        var popUpHTML = '<div id="cc-atcp-table" class="popup-preview" style="font-family: Open Sans, sans-serif; position: fixed;' +
            '    top: 0;right: 0;left: 0;bottom: 0;width: 37%;background: #fff;margin: 90px auto;z-index: 99999999;border: 1px solid #808080;' +
            '    border-radius: 4px;' +
            '    padding: 15px;' +
            '    box-shadow: 0 0 20px 10px #f5f5f5;' +
            '    -moz-box-shadow: 0 0 20px 10px #f5f5f5;' +
            '    -webkit-box-shadow: 0 0 20px 10px #f5f5f5;' +
            '    -o-box-shadow: 0 0 20px 10px #f5f5f5;max-height:400px;">' +
            closeButton +
            '                                                                <div class="img-cart-top"><img id="ec-banner"' +
            ' src="' + bannerImageURl + '" ' +
            ' style="    display: block;' +
            '    margin-left: auto;' +
            '    margin-right: auto;"></div>' +
            '                                                                <h2 id="ec-headline-preview"' +
            ' style="text-transform: unset;font-family: Open Sans, sans-serif;font-size:' + headingFontSize +
            ' ;color: ' + headingColor +
            ' ;text-align: ' + headingTextAlignment +
            ' ;font-weight: ' + headingFontWeight +
            ' ;font-style: ' + headingFontStyle +
            ' ;margin: 30px 0px;' +
            '">'
            + headingText +
            '</h2>' +
            '                                                                <p id="ec-description-preview"' +
            ' style="text-transform: unset;font-family: Open Sans, sans-serif;' +
            'font-size:' + descriptionFontSize +
            ' ;color:' + descriptionColor +
            ' ;text-align: ' + descriptionTextAlignment +
            ' ;font-weight: ' + descriptionFontWeight +
            ' ;font-style:' + descriptionFontStyle +
            ';">' + descriptionText + '</p>' +
            '                                                                <div class="input-custom" style="    text-align: center;' +
            '    margin: 20px 0;">' +
            '                                                                    <input id="cc_f-p-preview-email-placeholder" type="email"' +
            ' placeholder="' + emailPlaceHolder + '"' +
            ' style="text-transform: unset;font-family: Open Sans, sans-serif;height: 46px;' +
            '    font-size: 16px;' +
            '    color: #7a8da4;' +
            '    border: 1px solid #ced9ee;' +
            '    padding: 6px 12px;' +
            '    background-color: #fff;' +
            '    border: 1px solid #c2cad8;' +
            '    border-radius: 4px;' +
            '    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);' +
            '    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);' +
            '    -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;' +
            '    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;' +
            '    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;' +
            '    width: 85%;">' +
            '<p style="text-transform: unset;font-family: Open Sans, sans-serif;color: red;display: none;" id="cc_f-p-preview-email-placeholder-error">Please Enter Valid Email</p>' +
            '                                                                </div>' +
            '                                                                <div class="inline-button" style="    text-align: center;' +
            '    padding: 5px 0 35px;">' +
            '                                                                    <button id="cc_f-p-preview-email-btn" type="button" class="custom-button-inline"' +
            ' style="text-transform: unset;font-family: Open Sans, sans-serif;' +
            'background-color: ' + buttonBackgroundColor +
            ' ;font-size:' + buttonFontSize +
            ' ;color:' + buttonColor +
            ' ;font-style:' + buttonFontStyle +
            ' ;font-weight:' + buttonFontWeight +
            ' ;border: 1px solid rgb(38, 153, 251);' +
            ' padding: 13px 60px;' +
            ' display: inline-block;' +
            ' text-align: center;' +
            ' vertical-align: middle;' +
            ' touch-action: manipulation;' +
            ' cursor: pointer;' +
            ' white-space: nowrap;' +
            ' line-height: 1.42857;' +
            ' border-radius: 4px;' +
            ' user-select: none;' +
            '">' +
            buttonText +
            '</button>' +
            '                                                                </div>' +
            '                                                            </div>';


        // console.log('popUpHTML');
        // console.log(popUpHTML);
        carecartJquery('body').append(popUpHTML);
        if (isImpressionCapturedByEmailCollector == false) {
            isImpressionCapturedByEmailCollector = true;
            abandonedCart.process(0, '', 0, 'EMAIL_COLLECTOR');
        }
        if (typeof callBack == 'function') callBack();

    }

    function showPnSubscriptionPopup(popupData) {

        var popupStatus = window.localStorage.getItem('cc-pn-subscription-popup');
        if (popupStatus) {
            return false;
        }

        if (popupData && popupData.popup_is_active && popupData.popup_is_active == 1) {

            populateOptinPopupPreview(popupData, function (preparedHtml) {
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

                    abandonedCart.process(0, '', 0, 'PUSH_NOTIFICATION ');
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


        var tmplHtml = popupData.pn_subscription_popup_template.html;

        var preparedHtml = tmplHtml.replace('{CC-PN-POWERED-BY-IMG}', apiBaseUrl + '/img/logo.png');
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-IMAGE}', popupLogoUrl);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-TITLE}', popupTitle);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-DESCRIPTION}', popupDescription);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-ALLOW-BUTTON-TEXT}', popupAllowButtonText);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-DISALLOW-BUTTON-TEXT}', popupDisAllowButtonText);
        var preparedHtml = preparedHtml.replace('{CC-PN-SP-BRANDED-TEXT-STATUS}', (isPoweredByTextStatus == 1) ? 'block' : 'none');

        if (typeof callback == 'function') callback(preparedHtml);

    };

    function showAdvanceTitleBar(data, itemCount) {
        scriptInjection(apiBaseUrl + "/plugins/favicon/favico-0.3.10.min.js", function () {//start of favicon scipt injection
            if (getParameterByName('cc-show-title-designer')) {
                var setIntervalForTitleDesigner = setInterval(function () {
                    showTitleDesigner(data, itemCount);
                }, 5000);
            } else if (data && data.is_active && data.is_active == 1 && itemCount > 0) {
                var setIntervalForTitleDesigner = setInterval(function () {
                    showTitleDesigner(data, itemCount);
                }, 5000);
            }

        });//end of favicon scipt injection

    }//end of showAdvanceTitleBar function
    function showTitleDesigner(data, itemCount) {
        var delayIntervalInSeconds = parseInt(data.display_interval_in_seconds) * 1000;

        if (data.title_bar_text && data.title_bar_text != '') {
            window.cc_adv_title_timer = 0;
            window.org_title = window.document.title;
            window.org_title_marq = 0;

            carecartJquery('body').on('mousemove', function (e) {
                // console.log('mousemove');
                if (window.cc_adv_title_timer > 0) {
                    clearTimeout(window.cc_adv_title_timer);
                    window.org_title_marq = 0;
                    window.document.title = window.org_title;

                }

                window.cc_adv_title_timer = setTimeout(function () {
                    // console.log('Timeout');
                    window.org_title_marq = 1;
                    titleScroller(data.title_bar_text + '\u00A0\u00A0\u00A0\u00A0\u00A0');

                }, delayIntervalInSeconds);

            });
        }

        window.onblur = function () {
            window.org_title_marq = 0;
        };

        function titleScroller(titleText) {
            window.document.title = titleText;
            if (window.org_title_marq) setTimeout(function () {
                titleScroller(titleText.substr(1) + titleText.substr(0, 1));
            }, 100);
        }


        if (carecartJquery('[rel="shortcut icon"]').length == 0) {//if there is no favicon then add a default favicon first
            carecartJquery('head').append('<link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMjVERTE3QzA0RTIxMUU4QjRFOUY4OEFCODE1QzgzRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMjVERTE3RDA0RTIxMUU4QjRFOUY4OEFCODE1QzgzRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyNURFMTdBMDRFMjExRThCNEU5Rjg4QUI4MTVDODNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAyNURFMTdCMDRFMjExRThCNEU5Rjg4QUI4MTVDODNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+f1HuRwAAAB9JREFUeNpi/P//PwMlgImBQjBqwKgBowYMFgMAAgwAY5oDHVti48YAAAAASUVORK5CYII=" type="image/png">');
        }

        if (data.favicon_image_public_url != "") {//if user have personalized favicon image then show it
            carecartJquery('[rel="shortcut icon"]').attr('href', data.favicon_image_public_url);
        }

        if (typeof Favico !== 'undefined') {

            var favicon = new Favico({
                bgColor: data.favicon_background_color,
                textColor: data.favicon_text_color,
                animation: data.prepared_badge_animation,
                position: data.prepared_badge_position,
                type: data.prepared_badge_shape,
            });
            favicon.badge(itemCount);

        }

    }

    function showDiscountSpinnerPopup() {

        var subscriptionPopUpHTML = '<div id="cc-spinner-body" style="position: fixed;\n' +
            '    width: 100%;\n' +
            '    height: 100%;\n' +
            '    top: 0px;\n' +
            '    transform: translateX(0%);\n' +
            '    transition: 0.5s;\n' +
            '    position: fixed;\n' +
            '    background-color: rgba(0, 0, 0, 0.4);\n' +
            '    z-index: 2147483647;">\n' +
            '\t<iframe src="' + apiBaseUrl + '/api/discount-spinner-popups/store-front/iframe?store[domain]=' + Shopify.shop + '" style="    width: 100%;\n' +
            '    height: 100%;\n' +
            '    border: 0px;\n' +
            '    display: block;"></iframe>\n' +
            '</div>';

        carecartJquery('body').append(subscriptionPopUpHTML);
    }

    function closeDiscountSpinnerPopup() {
        carecartJquery('#cc-spinner-body').remove();
    }


    function addJqueryEventListeners() {

        carecartJquery.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });


        carecartJquery('body').on('click', '#cc_f-p-close', function (e) {

            carecartJquery('#cc-atcp-table', 'body').hide();
        });

        carecartJquery('body').on('keyup', '#cc_f-p-preview-email-placeholder', function (e) {

            carecartJquery('#cc_f-p-preview-email-placeholder-error', 'body').hide();
        });


        //zeb 8-1-2019

        var proxied = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function() {
        var pointer = this
        var intervalId = window.setInterval(function(){
        if(pointer.readyState != 4){
            return;
        }
        var url = pointer.responseURL;
        var lastPart = url.split('/');
        var name = lastPart[lastPart.length-1];
        if(name == 'add.js' || name == 'change.js') {
            isAjax = 1;
            abandonedCart.process(0);
            //setTimeout(function(){  carecartJquery( '.mfp-wrap' ).css('display', 'block'); }, 2000);
        }
        clearInterval(intervalId);

        }, 1);
            return proxied.apply(this, [].slice.call(arguments));
        };
        carecartJquery('body').on('click', '#pn-optin-disallow-btn-text', function () {
            window.localStorage.setItem('cc-pn-subscription-popup', 'DENIED');
            window.localStorage.setItem('cc-pn-subscription-token', '');
            carecartJquery('#cc_pn_notification_template').hide();

        });


        carecartJquery('body').on('click', '#pn-optin-allow-btn-text', function () {

            var prepareDataForChildWindow = encodeURIComponent(JSON.stringify(pnChildWindowData));
            var permissionViewLink = ccPnAuthUrl + '/getPnToken?cc_pn_lp=' + prepareDataForChildWindow + '&shop=' + store.domain;
            var permissionPopup = openPermissionTab(permissionViewLink, store.domain, '400px', '400px');
        });

        carecartJquery('body').on('submit', 'form[action="/cart/add"]', function (e) {
            if (facebookCheckboxWidgetType == 'ATC' && facebookCheckboxWidgetStatus == 'checked') {
                $("#cc_messenger_widget_atc_title").html(facebookCheckboxWidget.checkbox_widget.subscribed_text);
            }
            // e.preventDefault();
            console.clear();
            // console.log('add to cart clicked....');
            confirmOptIn();
            // zeb 8-1-2019
            isAjax = 0;
            abandonedCart.process(0);
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
        carecartJquery('#cc_pn_notification_template').hide();
        abandonedCart.process(0);

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

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email != undefined && email != null && email != '') {
            return re.test(email.toLowerCase());
            return false;
        }
    }


}


var abandonedCart = new AbandonedCart();
abandonedCart.init(abandonedCart.process, [0], 0);

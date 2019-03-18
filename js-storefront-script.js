// js-storefront-script.js GH v.1.2.2
// Updated at: 25-02-2019
var isAjax = 0;
var isCartLoading = 0;
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

function AbandonedCart() {

    var customer = {};
    var store = {};
    var apiBaseUrl = "https://app-er.carecart.io";
    var ccPnAuthUrl = "pn.carecart.io";
    var pnSubscriptionPopupData = {};
    var isImpressionCapturedByEmailCollector = false;

    this.init = function (callback, callbackArgs) {
        console.log("Initialization started");

        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
            scriptInjection("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js", function () {
                window.carecartJquery = jQuery.noConflict(true);
                scriptInjection(apiBaseUrl + "/plugins/favicon/favico-0.3.10.min.js");
                scriptInjection("https://use.fontawesome.com/e0a385ecbc.js");

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
                            console.log('need-reinstall-store response');
                            console.log(response);
                        },
                        error: function (error) {
                            console.log('need-reinstall-store error');
                            console.log(error);
                        }
                    });
                } else {

                    customer = carecartJquery.parseJSON(carecartJquery('#care-cart-customer-information').text());
                    store = carecartJquery.parseJSON(carecartJquery('#care-cart-shop-information').text());
                }


                addJqueryEventListeners();


                if((new RegExp("cc-preview-email-collector=yes")).test(window.location.href)){
                    checkAddToCartPopup(null, null, function(){}, '');
                }


                console.log("Initialization completed");
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
                console.log('------------- Recreation of cart started -------------');
                console.log(response);
                console.log('------------- Recreation of cart end     -------------');
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
                console.log('------------- Update cart token started -------------');
                console.log(response);
                console.log('------------- Update cart token end     -------------');
                callback(response);
            }
        });

    }


    function isOnlyRecoverCart(cart) {
        if(isCartLoading == 1) {
            return;
        }

        var queryParametersArray = getQueryParameters();
        if (typeof queryParametersArray != "undefined" && typeof queryParametersArray.recover_care_cart != 'undefined' && queryParametersArray.recover_care_cart != '') {
            isCartLoading = 1;

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
                        console.log("done ..... " + productsProcessedCount);
                        clearInterval(isProductAddedToCartInterval);
                    }


                }, 100);
            }


            var isAllProductsProcessedInterval = setInterval(function () {

                if (productsProcessedCount == recoveryCart.items.length) {
                    console.log("Products processed: " + productsProcessedCount);
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
                console.log('Recovering cart...')
            } else {
                console.log("Update cart on command center");

                var cartHash_cached = "1";
                var cartHash_live = "2";

                try {
                    cartHash_cached = String(window.localStorage.getItem('cartHash_cached'));
                    cartHash_live = CryptoJS.MD5(JSON.stringify(cart)).toString();
                } catch (e) {
                }

                if (cartHash_cached != cartHash_live || impressionBy != '') {
                    carecartJquery.ajax({
                        url: apiBaseUrl + "/api/cart/store-front/create",
                        dataType: 'json',
                        type: 'POST',
                        data: data,

                        success: function (response) {
                            if (response._metadata.outcomeCode == 0 && response.records.cart) {
                                var activeInterface = response.records.active_interface;
                                var cartData = response.records.cart;
                                var addToCartPopUpData = response.records.addToCartPopUp;
                                var titleDesignerData = response.records.titleDesigner;
                                pnSubscriptionPopupData = (response && response.records && response.records.pnSubscriptionPopup) ? response.records.pnSubscriptionPopup : {};
                                showAdvanceTitleBar(titleDesignerData, cartData.item_count);
                                showPnSubscriptionPopup(pnSubscriptionPopupData);
                                if (response.records.isNeedToReInsert) {
                                    recoverCart(undefined, cartData);
                                }

                                if (response.records.hasOwnProperty('gdpr') && response.records.gdpr != null) {
                                    var gdprData = response.records.gdpr;
                                    checkGdprToShow(gdprData);

                                }

                                if (response.records.hasOwnProperty('discountSpinnerPopup') && response.records.discountSpinnerPopup != null) {
                                    var discountSpinnerPopup = response.records.discountSpinnerPopup;
                                    showDiscountSpinnerPopup();

                                }

                                checkAddToCartPopup(cartData, addToCartPopUpData, callBack, activeInterface);
                                enableEmailMagnet(cartData);
                                window.localStorage.setItem('cartHash_cached', cartHash_live);
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

                if(!e.originalEvent.isTrusted){
                    return false;
                }
                
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

    function checkAddToCartPopup(cartData, addToCartPopUpData, callBack, activeInterface) {
        if (getParameterByName('cc-preview-email-collector')) {
            return;
        }
        if (cartData && !cartData.email && cartData.item_count != 0) {
            if (addToCartPopUpData && addToCartPopUpData.is_active && addToCartPopUpData.is_active != 0) {

                if (!cartData.email) {
                    if (activeInterface == 'LITE') {
                        showLiteAddToCartPopup(addToCartPopUpData, function () {
                            carecartJquery('#cc-atcp-table', 'body').show();
                        });
                    } else {
                        showProAddToCartPopup(addToCartPopUpData, function () {
                            carecartJquery('#cc-atcp-table', 'body').show();
                        });
                    }
                }

                $('body').one('submit', 'form[action="/cart/add"]', function (e) {
                    e.preventDefault();
                    submitEvent = e;
                    if (!cartData.email) {
                        if (activeInterface == 'LITE') {
                            showLiteAddToCartPopup(addToCartPopUpData, function () {
                                carecartJquery('#cc-atcp-table', 'body').show();
                            });
                        } else {
                            showProAddToCartPopup(addToCartPopUpData, function () {
                                carecartJquery('#cc-atcp-table', 'body').show();
                            });
                        }
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

    function showLiteAddToCartPopup(data, callBack) {

        var closeButton = "";

        if (data.is_active_close_button == 1) {
            closeButton = "<button type='button' id='cc_f-p-close' style='position: absolute; width: unset; top: 0;right: 5px;cursor: pointer;color: #000;z-index: 100;padding: 5px;background-position: center;background-repeat: no-repeat; background-color: transparent;border: 0;-webkit-appearance: none;float: right;font-size: 1.5rem;font-weight: 700;line-height: 1;text-shadow: 0 1px 0 #fff;opacity: .5;}'>x</button>";
        }
        var SCRIPTURL = "https://app.carecart.io/email-collector-pop.html";
        var is_active_close_button = data.is_active_close_button;
        var heading_text = data.heading_text;
        var heading_color = data.heading_color.replace(/^#+/i, '');
        var description_text = data.description_text;
        var description_color = data.description_color.replace(/^#+/i, '');
        var email_placeholder = data.email_placeholder;
        var button_text_color = data.button_text_color.replace(/^#+/i, '');
        var button_background_color = data.button_background_color.replace(/^#+/i, '');
        var button_text = data.button_text;
        var SRC_URL = SCRIPTURL + '?is_active_close_button=' + encodeURI(is_active_close_button) + '&heading_text=' + encodeURI(heading_text) + '&heading_color=' + encodeURI(heading_color) + '&description_text=' + encodeURI(description_text) + '&description_color=' + encodeURI(description_color) + '&button_text=' + encodeURI(button_text) + '&email_placeholder=' + encodeURI(email_placeholder) + '&button_text_color=' + encodeURI(button_text_color) + '&button_background_color=' + encodeURI(button_background_color);

        var popUpHTML = '<style>@media (max-width: 768px) {#cc-atcp-table #cc-atcp-content-body { width: 100% !important; } #cc-atcp-table{ /*position: absolute !important;*/ } } @media (max-width: 420px) {#cc-atcp-table #cc-atcp-content-body { height: 320px !important; } }</style><table id="cc-atcp-table" style="display:none;position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; border:none; text-align: center; vertical-align: middle;width: 100%; height: 100%; background-color: rgba(0,0,0,0.1); z-index: 999992">' +
            '<tr><td align="center" valign="middle"><div id="cc-atcp-content-body" style="border-radius:5px;margin: 0 auto;width: 700px;height: 290px; background: white; border: 1px solid #f3f3f3;">' +
            '<iframe style="border: none; height:100%; width: 100%;" src="' + SRC_URL + '"></iframe></div>' +
            '</td></tr></table>';


        carecartJquery('body').append(popUpHTML);
        if (isImpressionCapturedByEmailCollector == false) {
            isImpressionCapturedByEmailCollector = true;
            abandonedCart.process(0, '', 0, 'EMAIL_COLLECTOR');
        }

        if (typeof callBack == 'function') callBack();

    }

    function showProAddToCartPopup(data, callBack) {

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

        var popUpHTML = '<style>@media (max-width: 768px) {#cc-atcp-table { width: 55% !important; }} @media (max-width: 480px) {#cc-atcp-table { width: 80% !important; } }</style><div id="cc-atcp-table" class="popup-preview" style="font-family: Open Sans, sans-serif; position: fixed;' +
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

            var popupTitle = popupData.popup_title;
            var popupDescription = popupData.popup_description_text;
            var popupAllowButtonText = popupData.popup_allow_button_text;
            var popupAllowButtonText = popupData.popup_allow_button_text;
            var popupDisAllowButtonText = popupData.popup_disallow_button_text;
            var popupLogoUrl = '';
            var popUpLogoImg = '';
            if (popupData.popup_logo_url != '' && popupData.popup_logo_url != null) {
                popupLogoUrl = apiBaseUrl + '/images/' + popupData.popup_logo_url;
                popUpLogoImg = "<img height='40px' src=" + popupLogoUrl + ">";
            }


            // var popupLogoUrl = "<img height='40px' src='https://static.ghostmonitor.com/web-push/cart.svg'>";

            var subscriptionPopUpHTML = '<table id="cc-pn-table" style="position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; text-align: center; vertical-align: middle;width: 100%; height: 100%; background-color: rgba(0,0,0,0.1); z-index: 999992">' +
                '<tr><td align="center" valign="middle"><div id="cc-pn-content-body" style="border-radius:5px;margin: 0 auto;width: 400px; background: white; border: 1px solid #f3f3f3;">' +
                '<div style="position: relative;display: -webkit-box;display: -ms-flexbox;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;width: 100%;pointer-events: auto;background-clip: padding-box;border-radius: .3rem; outline: 0;">' +
                '<div style="padding: 20px;margin: 20px 0 0 0;border-radius: 5px;">' +
                '<div class="cc_preview-email-content" style="width: 100%;text-align: center;vertical-align: middle;padding: 15px;">' +
                '<div class="cc_preview-email-content-container" style="position: relative;border-radius: 5px 5px 0 0;padding-top: 0;padding-bottom: 10px;margin-bottom: 10px;">' +
                popUpLogoImg +
                '<p id="cc-pn-subs-title" class="cc_preview-email-heading" style="margin: 0 0 20px 0;font-size: 15px;font-weight: bold;">' + popupTitle + '</p>' +
                '<p style="margin: 0 0 10px;" id="cc-pn-subs-desc">' + popupDescription + '</p></div>' +
                '<div>' +
                '<button id="cc-pn-allow-subs-btn" type="button" style="word-break:break-all;width:40%;border: none;padding: 7px 5px;border-radius: 2px;cursor: pointer;float: left;">' + popupAllowButtonText + '</button>' +
                '<button id="cc-pn-disallow-subs-btn" type="button" style="word-break:break-all;width:40%;border: none;padding: 7px 5px;border-radius: 2px;cursor: pointer;float: right;">' + popupDisAllowButtonText + '</button>' +
                '</div></div></div></div></div>' +
                '</td></tr></table>';

            setTimeout(function () {
                carecartJquery('body').append(subscriptionPopUpHTML);
            }, popupData.popup_delay + '000');


        }
    }

    function showAdvanceTitleBar(data, itemCount) {

        if (data && data.is_active_title_bar_text && data.is_active_title_bar_text == 1 && data.title_bar_text && data.title_bar_text != '' && itemCount > 0) {

            console.log('cc_adv_title_timer');
            window.cc_adv_title_timer = 0;
            window.org_title = window.document.title;
            window.org_title_marq = 0;

            carecartJquery('body').on('mousemove', function (e) {


                console.log('mousemove');
                if (window.cc_adv_title_timer > 0) {
                    clearTimeout(window.cc_adv_title_timer);
                    window.org_title_marq = 0;
                    window.document.title = window.org_title;

                }

                window.cc_adv_title_timer = setTimeout(function () {
                    console.log('Timeout');
                    window.org_title_marq = 1;
                    titleScroller(data.title_bar_text + '\u00A0\u00A0\u00A0\u00A0\u00A0');

                }, 60000);

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


        if (data && data.is_active_favicon && data.is_active_favicon == 1 && itemCount > 0) {

            if (carecartJquery('[rel="shortcut icon"]').length == 0) {
                carecartJquery('head').append('<link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMjVERTE3QzA0RTIxMUU4QjRFOUY4OEFCODE1QzgzRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMjVERTE3RDA0RTIxMUU4QjRFOUY4OEFCODE1QzgzRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyNURFMTdBMDRFMjExRThCNEU5Rjg4QUI4MTVDODNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAyNURFMTdCMDRFMjExRThCNEU5Rjg4QUI4MTVDODNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+f1HuRwAAAB9JREFUeNpi/P//PwMlgImBQjBqwKgBowYMFgMAAgwAY5oDHVti48YAAAAASUVORK5CYII=" type="image/png">');
            }

            var loadFavIcoInterval = setInterval(function () {
                if (typeof Favico !== 'undefined') {
                    var favicon = new Favico({
                        bgColor: data.favicon_background_color,
                        textColor: data.favicon_text_color
                    });
                    favicon.badge(itemCount);
                    clearInterval(loadFavIcoInterval);
                }

            }, 200);
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

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
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

        if (getParameterByName('cc-preview-email-collector')) {

            carecartJquery.ajax({

                url: apiBaseUrl + "/api/cart/popupSettings?shop="+store.domain,

                dataType: 'json',

                type: 'GET',

                success: function (response) {

                    var addToCartPopUpData = response.records.addToCartPopUp;

                    showProAddToCartPopup(addToCartPopUpData, function () {

                        carecartJquery('#cc-atcp-table', 'body').show();

                    });

                }

            });

        }

        carecartJquery('body').on('click', '#cc_f-p-preview-email-btn', function () {
            if (getParameterByName('cc-preview-email-collector')) {
                carecartJquery('#cc-atcp-table', 'body').hide();
            }
            else {
                carecartJquery('#cc_f-p-preview-email-placeholder-error', 'body').hide();
                var email = carecartJquery('#cc_f-p-preview-email-placeholder', 'body').val();
                if (!validateEmail(email)) {
                    carecartJquery('#cc_f-p-preview-email-placeholder-error', 'body').show();
                } else {
                    customer.email = email;
                    abandonedCart.process(1, function () {
                        if(carecartJquery('form[action="/cart/add"]').length  && window.location.pathname != '/cart') {
                            carecartJquery('form[action="/cart/add"]').submit();
                        }
                    });
                }
            }
        });

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent, function (e) {
            //console.log(e);
            var key = e.message ? "message" : "data";
            var data = e[key];
            //run function//
            //console.log(data.email);
            if (data != null && data == 'close_email') {
                if (getParameterByName('cc-preview-email-collector')) {
                    carecartJquery('#cc-atcp-table', 'body').show();
                }
                else {
                    carecartJquery('#cc-atcp-table', 'body').hide();
                }
            }
            if (data.email != null) {
                customer.email = data.email;
                //console.log(customer.email);
                abandonedCart.process(1, function () {
                    if (isAjax == 0) {
                        if(carecartJquery('form[action="/cart/add"]').length && window.location.pathname != '/cart') {
                            carecartJquery('form[action="/cart/add"]').submit();
                        }
                    }
                });
                if (getParameterByName('cc-preview-email-collector')) {
                    carecartJquery('#cc-atcp-table', 'body').show();
                }
                else {
                    carecartJquery('#cc-atcp-table', 'body').hide();
                }
            }
            if (data == 'mobilefocus') {
                if (carecartJquery('.fancybox-content').width() <= 450) {
                    //carecartJquery( '.fancybox-content' ).css('width', '100%');
                    setTimeout(function () {
                        carecartJquery('.fancybox-content').css('width', '100%');
                    }, 1000);

                }
            }

        }, false);


        var proxied = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function () {
            //console.log( arguments );
            //Here is where you can add any code to process the request.
            //If you want to pass the Ajax request object, pass the 'pointer' below
            var pointer = this
            var intervalId = window.setInterval(function () {
                if (pointer.readyState != 4) {
                    return;
                }
                var url = pointer.responseURL;
                var lastPart = url.split('/');
                var name = lastPart[lastPart.length - 1];
                if (name == 'add.js' || name == 'change.js') {
                    //Show email collector
                    isAjax = 1;
                    console.log('show collector in ajax call');
                    abandonedCart.process(0);
                    setTimeout(function () {
                        carecartJquery('.mfp-wrap').css('display', 'block');
                    }, 2000);

                }
                //Here is where you can add any code to process the response.
                //If you want to pass the Ajax request object, pass the 'pointer' below
                clearInterval(intervalId);

            }, 1);//I found a delay of 1 to be sufficient, modify it as you need.
            return proxied.apply(this, [].slice.call(arguments));
        };


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

            var permissionViewLink = 'https://' + ccPnAuthUrl + '/CCPnPermission.php?cc_pn_lp=' + popupData + '&shop=' + store.domain;
            var permissionPopup = openPermissionTab(permissionViewLink, store.domain, '400px', '400px');
        });

        carecartJquery('body').on('submit', 'form[action="/cart/add"]', function (e) {
            console.clear();
            console.log('add to cart clicked....');
            setTimeout(function () {
                isAjax = 0;
                abandonedCart.process(0);
            }, 2000);
        });

    }


    window.addEventListener("message", function (e) {
        // console.log('Message Received on Parent..!!!!', e);
        if (e.origin != 'https://' + ccPnAuthUrl) {
            return false;
        }
        var fcmToken = (e && e.data && e.data.token) ? e.data.token : '';
        var subsStatus = (e && e.data && e.data.status) ? e.data.status : '';
        window.localStorage.setItem('cc-pn-subscription-popup', subsStatus);
        window.localStorage.setItem('cc-pn-subscription-token', fcmToken);
        carecartJquery('#cc-pn-table').hide();
        abandonedCart.process(0);

        return;
    }, false);

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
abandonedCart.init(abandonedCart.process, [0]);

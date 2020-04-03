// js-storefront-script GH v.1.5.1
// Updated at: 04-03-2020
// https://cdn.jsdelivr.net/gh/carecartapp/app_assets@1.5.1/
var isAjax = 0;
var isCartLoading = 0;
var isCheckForCall = true;
var isCheckForMobile = false;
var cartHash_cached = 0;
var cartHash_live = 0;

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
    var isSupportOfWholeSale =0;
    var store = {};
    var apiBaseUrl = "https://app-er.carecart.io";
    var scriptBuildUrl = 'https://cdn.jsdelivr.net/gh/carecartapp/app_assets@1.5.1/';
    var ccPnAuthUrl = "pn-app-er.carecart.io";
    var pnSubscriptionPopupData = {};
    var pnChildWindowData = {};
    var isImpressionCapturedByPushNotification = false;
    var isImpressionCapturedByEmailCollector = false;

    this.init = function (callback, callbackArgs) {
        console.log("Initialization started");



        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isCheckForMobile = true;
        }

        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
            scriptInjection("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js", function () {
                window.carecartJquery = jQuery.noConflict(true);
                scriptInjection(apiBaseUrl + "/plugins/favicon/favico-0.3.10.min.js");
                scriptInjection("https://use.fontawesome.com/e0a385ecbc.js");
                cssFileInjection(apiBaseUrl+"/css/api/cc.sweetalert2.css");
                scriptInjection(apiBaseUrl+"/js/api/cc.sweetalert2.all.js");
		scriptInjection(scriptBuildUrl+"front-store-spinner.js");

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

    this.process = function (isCapturedByPopup, callBack, isCapturedByMagnet, impressionBy='') {

        getCart(function (cart) {
            if (isCapturedByPopup == 1) {
                cart.is_email_captured_by_popup = 1;
                impressionBy='EMAIL_COLLECTOR'
            }

            if (isCapturedByMagnet == 1) {
                cart.is_captured_by_email_magnet = 1;
            }

            /*Support of WholeSale app */

            if (isSupportOfWholeSale == 1) {
                cart.is_email_discarded = 1;
            }


            var pnSubscriptionData = {
                'token': (window.localStorage.getItem('cc-pn-subscription-token')) ? window.localStorage.getItem('cc-pn-subscription-token') : '',
                'status': (window.localStorage.getItem('cc-pn-subscription-popup')) ? window.localStorage.getItem('cc-pn-subscription-popup') : ''
            };

            /*Support of email magnet*/
            checkIfMagnetEmailExist();
            var cachedEmail = window.localStorage.getItem('cc-magnet-email-captured');
            if(cachedEmail){
                cart.is_captured_by_email_magnet = 1;
            }
            /*end*/
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

                //var cartHash_cached = "1";
               // var cartHash_live = "2";

                try {
                    cartHash_cached = String(window.localStorage.getItem('cartHash_cached'));
                    cartHash_live = CryptoJS.MD5(JSON.stringify(cart)).toString();
                } catch (e) {
                }

                if ((cartHash_cached != cartHash_live || impressionBy != '') && data.cart.item_count > 0) {
		        if(isCheckForCall){

                        isCheckForCall = false;

                        carecartJquery.ajax({
                            url: apiBaseUrl + "/api/cart/store-front/create",
                            dataType: 'json',
                            type: 'POST',
                            data: data,

                            success: function (response) {
                                isCheckForCall = true;
                                if (response._metadata.outcomeCode == 0 && response.records.cart) {
                                    window.localStorage.setItem('cartHash_cached', cartHash_live);
                                    var activeInterface = response.records.active_interface;
                                    var cartData = response.records.cart;
                                    var addToCartPopUpData = response.records.addToCartPopUp;
                                    var titleDesignerData = response.records.titleDesigner;
                                    carecartJquery('#CartDrawer').removeAttr('tabindex');
                                    pnSubscriptionPopupData = (response && response.records && response.records.pnSubscriptionPopup) ? response.records.pnSubscriptionPopup : {};
                                    pnChildWindowData = (response && response.records && response.records.pnSubscriptionPopupChildWindow) ? response.records.pnSubscriptionPopupChildWindow : {};
                                    showAdvanceTitleBar(titleDesignerData, cartData.item_count);
                                    if (activeInterface == 'LITE') {
                                        showPnSubscriptionPopup(pnSubscriptionPopupData);
                                    }else{
                                        ccPnAuthUrl = "pn-app-er.carecart.io";
                                        showProPnSubscriptionPopup(pnSubscriptionPopupData);
                                    }
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
                                }else {
                                    if (getParameterByName('cc-show-title-designer')) {
                                        var titleDesignerData = response.records.titleDesigner;
                                        showAdvanceTitleBar(titleDesignerData, 1);
                                    }
                                }
                            }
                        });
                    }
                }


            }

        });

    };

    function enableEmailMagnet(cartData) {
        if (cartData && !cartData.email) {
            carecartJquery(document).on('blur', 'input:not(.ccswal2-input)', function (e) {

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
        var previousCachedTime = window.localStorage.getItem('timeData');
        if(previousCachedTime!==undefined){
            var currentTime = new Date();
            var previousTime = new Date(previousCachedTime);
            var msec = parseInt(currentTime - previousTime);
            var mins = parseInt(Math.floor(msec / 60000));
            if(mins<=5){
                console.log('Time remaining : '+ mins);
                return;
            }
        }

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

                /*  $('body').one('submit', 'form[action="/cart/add"]', function (e) {
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

                  });*/


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
        if (CCSwal.isVisible()) {
            return;
        }
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

        var titlehtml = "<h2 style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + headingFontSize +";color:"+ headingColor +" ;text-align:" + headingTextAlignment + ";font-weight:" + headingFontWeight +";font-style: " + headingFontStyle +"'>"+ headingText +"</h2>"; //addToCartPopUpData.heading_text,
        var descripionText = "<p style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + descriptionFontSize +";color:"+ descriptionColor +";text-align:" + descriptionTextAlignment +";font-weight: " + descriptionFontWeight +";font-style:" + descriptionFontStyle +";'>" + descriptionText + "</p>";
        CCSwal.fire({
            title: titlehtml,
            html: descripionText,
            input: 'email',
            inputPlaceholder: emailPlaceHolder,
            inputAutoTrim: true,
            confirmButtonText:  "<span style='font-size:" + buttonFontSize +";color:"+ buttonColor +";font-style:"+ buttonFontStyle +";font-weight:" + buttonFontWeight +"'>"+buttonText+"</span>",
            confirmButtonColor: buttonBackgroundColor,
            showCancelButton: false,
            cancelButtonText: 'No, cancel!',
            showCloseButton: (data.is_active_close_button==1?true:false),
            imageUrl: bannerImageURl,
            imageWidth: 100,
            allowOutsideClick: false,
            //footer: 'Footer text',
            //reverseButtons: true,
            //type: 'success'

        }).then(function (result) {
            // console.log({'then':result});
            if (result.value) {
                customer.email = result.value;
                var timeNow = new Date();
                window.localStorage.setItem('timeData', timeNow);

                abandonedCart.process(1, function () {
                    carecartJquery('form[action="/cart/add"]').submit();
                },'', 'EMAIL_COLLECTOR');
                //abandonedCart.process(1,'','','EMAIL_COLLECTOR');
            }else if(result.dismiss){
                var timeNow = new Date();
                window.localStorage.setItem('timeData', timeNow);
                abandonedCart.process(0,'','','EMAIL_COLLECTOR');
            }
        });

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

    function showProPnSubscriptionPopup(popupData) {

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
                        carecartJquery('#cc_pn_notification_template').css({'position': 'fixed'});
                        if(window.innerWidth >= 1012) {
                            var left = '35%';
                            var width = '420px';
                        }else{
                            var left = '25%';
                            var width = '50%';
                        }

                        if (popupData.appearance_location == 'TOP_CENTER') {
                            carecartJquery('#cc_pn_notification_template').css({
                                'top': '5px',
                                'left': left,
                                'width': width
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
                        if(isCheckForMobile){
                            if(window.innerWidth <= 768 && window.innerWidth >= 525) {
                                var left = '20%';
                                var width = '65%';
                                if (popupData.appearance_location == 'TOP_CENTER') {
                                    carecartJquery('#cc_pn_notification_template').css({
                                        'left': left,
                                        'width': width
                                    });
                                }

                            }else if(window.innerWidth <= 525){
                                var left = '-8px';
                                var right = '2%';
                                var width = '95%';
                                carecartJquery('#cc_pn_notification_template').css({
                                    'left': left,
                                    'right': right,
                                    'width': width
                                });
                                carecartJquery('#pn-optin-disallow-btn-text').css({
                                    'width': 'auto'
                                });


                            }
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
        scriptInjection(apiBaseUrl + "/plugins/favicon/favico-0.3.10.min.js?v2", function () {//start of favicon scipt injection
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

            carecartJquery('body').on('mouseleave', function (e) {
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
            //if (window.org_title_marq)

            setTimeout(function () {
                titleScroller(titleText.substr(1) + titleText.substr(0, 1));
            }, 500);
        }

        if (carecartJquery('[rel="shortcut icon"]').length == 0) {//if there is no favicon then add a default favicon first
            carecartJquery('head').append('<link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMjVERTE3QzA0RTIxMUU4QjRFOUY4OEFCODE1QzgzRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMjVERTE3RDA0RTIxMUU4QjRFOUY4OEFCODE1QzgzRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyNURFMTdBMDRFMjExRThCNEU5Rjg4QUI4MTVDODNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAyNURFMTdCMDRFMjExRThCNEU5Rjg4QUI4MTVDODNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+f1HuRwAAAB9JREFUeNpi/P//PwMlgImBQjBqwKgBowYMFgMAAgwAY5oDHVti48YAAAAASUVORK5CYII=" type="image/png">');
        }
        if (data.favicon_image_public_url != "") {//if user have personalized favicon image then show it

            carecartJquery('[rel="shortcut icon"]').attr('href', data.favicon_image_public_url);
            //carecartJquery('[rel="shortcut icon"]').attr('href', 'https://app-er.carecart.io/img/icon-reminder.png');
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

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    /* Global Email Magnet Support */
    function checkIfMagnetEmailExist(){
        console.log('email magnet is checked');
        var cachedEmail = window.localStorage.getItem('cc-magnet-email-captured');
        if (customer && !customer.email && cachedEmail) {
            var previousCachedTime = window.localStorage.getItem('email-magnet-expiry');
            if (previousCachedTime !== undefined) {
                var currentTime = new Date();
                var previousTime = new Date(previousCachedTime);
                var msec = parseInt(currentTime - previousTime);
                var mins = parseInt(Math.floor(msec / 60000));
                if (mins <= 1440) {
                    if (cachedEmail){
                        console.log('email is dispatched with cart');
                        customer.email = cachedEmail;
                    }else{
                        console.log('cached email not available');
                        localStorage.removeItem('email-magnet-expiry');
                        localStorage.removeItem('cc-magnet-email-captured');
                    }
                }else {
                    console.log('email time is expired');
                    localStorage.removeItem('email-magnet-expiry');
                    localStorage.removeItem('cc-magnet-email-captured');
                }
            } else {
                console.log('email time is expired n/o');
                localStorage.removeItem('email-magnet-expiry');
                localStorage.removeItem('cc-magnet-email-captured');
            }
        }else{
            console.log('email already exits');
            localStorage.removeItem('email-magnet-expiry');
            localStorage.removeItem('cc-magnet-email-captured');
        }

    }

    /* Global Email Magnet Support */


    function addJqueryEventListeners() {


        carecartJquery.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });

        carecartJquery('body').on('click', '#cc_f-p-close', function (e) {
            var timeNow = new Date();
            window.localStorage.setItem('timeData', timeNow);
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

                    var data = response.records.addToCartPopUp;

                    if (CCSwal.isVisible()) {
                        return;
                    }
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

                    var titlehtml = "<h2 style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + headingFontSize +";color:"+ headingColor +" ;text-align:" + headingTextAlignment + ";font-weight:" + headingFontWeight +";font-style: " + headingFontStyle +"'>"+ headingText +"</h2>"; //addToCartPopUpData.heading_text,
                    var descripionText = "<p style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + descriptionFontSize +";color:"+ descriptionColor +";text-align:" + descriptionTextAlignment +";font-weight: " + descriptionFontWeight +";font-style:" + descriptionFontStyle +";'>" + descriptionText + "</p>";
                    CCSwal.fire({
                        title: titlehtml,
                        html: descripionText,
                        input: 'email',
                        inputPlaceholder: emailPlaceHolder,
                        inputAutoTrim: true,
                        confirmButtonText:  "<span style='font-size:" + buttonFontSize +";color:"+ buttonColor +";font-style:"+ buttonFontStyle +";font-weight:" + buttonFontWeight +"'>"+buttonText+"</span>",
                        confirmButtonColor: buttonBackgroundColor,
                        showCancelButton: false,
                        cancelButtonText: 'No, cancel!',
                        showCloseButton: (data.is_active_close_button==1?true:false),
                        imageUrl: bannerImageURl,
                        imageWidth: 100,
                        allowOutsideClick: false,
                        //footer: 'Footer text',
                        //reverseButtons: true,
                        //type: 'success'

                    }).then(function (result) {

                    });

                }

            });

        }

        /* Patch for cart reminder */

        if (getParameterByName('cc-show-title-designer')) {

            carecartJquery.ajax({

                url: apiBaseUrl + "/api/cart/cartReminderSettings?shop="+store.domain,

                dataType: 'json',

                type: 'GET',

                success: function (response) {

                    //var data = response.records.addToCartPopUp;
                    var titleDesignerData = response.records.titleDesigner;
                    scriptInjection(apiBaseUrl + "/plugins/favicon/favico-0.3.10.min.js?v2", function () {//start of favicon scipt injection

                            var setIntervalForTitleDesigner = setInterval(function () {
                                showTitleDesigner(titleDesignerData, 1);
                            }, 1000);

                    });//end of favicon scipt injection
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

        carecartJquery('body').on('click', '#pn-optin-disallow-btn-text', function () {
            window.localStorage.setItem('cc-pn-subscription-popup', 'DENIED');
            window.localStorage.setItem('cc-pn-subscription-token', '');
            carecartJquery('#cc_pn_notification_template').hide();
        });
        carecartJquery('body').on('click', '#pn-optin-allow-btn-text', function () {
            var prepareDataForChildWindow = encodeURIComponent(JSON.stringify(pnChildWindowData));
            var permissionViewLink = 'https://' + ccPnAuthUrl + '/getPnToken?cc_pn_lp=' + prepareDataForChildWindow + '&shop=' + store.domain;
            var permissionPopup = openPermissionTab(permissionViewLink, store.domain, '400px', '400px');
            carecartJquery('#cc_pn_notification_template').hide();
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
                if(!isCartLoading){
                    if (name == 'add.js' || name == 'change.js') {
                        //Show email collector
                        isAjax = 1;
                        console.log('show collector in ajax call');
                        abandonedCart.process(0);
                        setTimeout(function () {
                            carecartJquery('.mfp-wrap').css('display', 'block');
                        }, 2000);

                    }
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

            var permissionViewLink = 'https://' + ccPnAuthUrl + '/getPnToken?cc_pn_lp=' + popupData + '&shop=' + store.domain;
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


        /*Support for whole sales app*/
        carecartJquery('body').find('#wh-whModal-container').find('form#net-order-form').on('click', 'button', function (e) {
            isSupportOfWholeSale = 1;
            abandonedCart.process(0);

        });
        /*Global Email Magnet Support*/
        carecartJquery(document).on('blur', 'input:not(.ccswal2-input)', function (e) {

            if(!e.originalEvent.isTrusted){
                return false;
            }

            if (carecartJquery(this).attr('id') == 'cc_f-p-preview-email-placeholder') {
                return false;
            }
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(carecartJquery(this).val()))) {
                var timeNow = new Date();
                window.localStorage.setItem('email-magnet-expiry', timeNow);
                window.localStorage.setItem('cc-magnet-email-captured', carecartJquery(this).val());
                console.log('email magnet is triggered');
            }
        });

        /*End Global Email Magnet Support*/

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
        window.localStorage.setItem('cartHash_cached', '');
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

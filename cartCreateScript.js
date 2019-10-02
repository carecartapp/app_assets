// js-storefront-script.js GH v.1.4.4
// Updated at: 02-10-2019
var isAjax = 0;
var isCartLoading = 0;
var isCheckForCall = true;
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

function AbandonedCartCreateScript() {

    var customer = {};
    var store = {};
    var apiBaseUrl = "https://app-er.carecart.io";
    var ccPnAuthUrl = "https://pn-app-er.carecart.io";
    var pnSubscriptionPopupData = {};
    var pnChildWindowData = {};
    var isImpressionCapturedByPushNotification = false;
    var isImpressionCapturedByEmailCollector = false;

    this.init = function (callback, callbackArgs) {
        console.log("Cart Create Initialization started");
        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
            scriptInjection("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js", function () {
                window.carecartJquery = jQuery.noConflict(true);
                scriptInjection("https://use.fontawesome.com/e0a385ecbc.js");
                customer = carecartJquery.parseJSON(carecartJquery('#care-cart-customer-information').text());
                store = carecartJquery.parseJSON(carecartJquery('#care-cart-shop-information').text());
                addJqueryEventListeners();
                console.log("Cart Create Initialization completed");
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
        console.log("Parameter Now: "+queryParametersArray.recover_care_cart);
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
                            console.log("Cart Now: "+cart);
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
               // var cartHash_cached = "1";
               // var cartHash_live = "2";
                try {
                    cartHash_cached = String(window.localStorage.getItem('cartHash_cached'));
                    cartHash_live = CryptoJS.MD5(JSON.stringify(cart)).toString();
                } catch (e) {
                }
               if ((cartHash_cached != cartHash_live || impressionBy != '') && data.cart.item_count > 0) {
                    carecartJquery.ajax({
                            url: "https://tracking.carecart.io/Cart/create",
                            dataType: 'json',
                            type: 'POST',
                            data: data,
                            crossDomain: true,
                            withCredentials: false,
                            async: false,
                            success: function (response) {
                                if(response.message == "Data Received"){
                                    window.localStorage.setItem('cartHash_cached', cartHash_live);
                                    var cartData = data.cart;
                                    var activeInterface = abandonedCart.globalSettingsAndData.active_interface;
                                    AbandonedCartCreateScript.CartItemData = cartData;
                                    var addToCartPopUpData = abandonedCart.globalSettingsAndData.addToCartPopUp;
                                    if(addToCartPopUpData.length>0){
                                        checkAddToCartPopup(cartData, addToCartPopUpData, callBack, activeInterface);
                                    }
                                    AbandonedCartCreateScript.titleDesignerData = abandonedCart.globalSettingsAndData.titleDesigner;
                                    if(abandonedCart.globalSettingsAndData.titleDesigner.length>0){
                                        CartReminderScript.showAdvanceTitleBar( AbandonedCartCreateScript.titleDesignerData ,AbandonedCartCreateScript.CartItemData.item_count);
                                    }
                                    if(abandonedCart.globalSettingsAndData.pnSubscriptionPopup.length>0){
                                        PushNotificationsScript.showProPnSubscriptionPopup(abandonedCart.globalSettingsAndData.pnSubscriptionPopup[0]);
                                    }
                                    enableEmailMagnet(cartData);
                                }
                            }
                    });
                }else if(data.cart.item_count > 0){
                   AbandonedCartCreateScript.titleDesignerData = abandonedCart.globalSettingsAndData.titleDesigner;
                   if(abandonedCart.globalSettingsAndData.titleDesigner.length>0){
                       CartReminderScript.showAdvanceTitleBar( AbandonedCartCreateScript.titleDesignerData ,data.cart.item_count);
                   }

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
                if ($(this).attr('class') == 'ccswal2-input' &&  $(this).attr('type') == 'email') {
                    return false;
                }
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(String(carecartJquery(this).val()))) {
                    customer.email = carecartJquery(this).val();
                    AbandonedCartCreateScript.process(0, '', 1, 'EMAIL_MAGNET');
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
        carecartJquery('#CartDrawer').removeAttr('tabindex');
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
        //console.log(addToCartPopUpData);
        addToCartPopUpData = addToCartPopUpData[0];
        if(addToCartPopUpData.banner_image!=''){
            bannerImage = addToCartPopUpData.banner_image
        }else{
            bannerImage = 'img/cart-popup.png';
        }
        if (CCSwal.isVisible()) {
            return;
        }
        
        
        var headingFontWeight = (addToCartPopUpData.heading_is_bold == 1) ? 'bold' : 'normal';
        var headingFontStyle = (addToCartPopUpData.heading_is_italic == 1) ? 'italic' : 'normal';
        var headingFontSize = addToCartPopUpData.heading_font_size + 'px';
        var headingTextAlignment = addToCartPopUpData.heading_text_align.toLowerCase();
        var headingColor = addToCartPopUpData.heading_color;
        var headingText = addToCartPopUpData.heading_text;

        var descriptionFontWeight = (addToCartPopUpData.description_is_bold == 1) ? 'bold' : 'normal';
        var descriptionFontStyle = (addToCartPopUpData.description_is_italic == 1) ? 'italic' : 'normal';
        var descriptionFontSize = addToCartPopUpData.description_font_size + 'px';
        var descriptionTextAlignment = addToCartPopUpData.description_text_align.toLowerCase();
        var descriptionColor = addToCartPopUpData.description_color;
        var descriptionText = addToCartPopUpData.description_text;

        var emailPlaceHolder = addToCartPopUpData.email_placeholder;

        var buttonFontWeight = (addToCartPopUpData.button_is_bold == 1) ? 'bold' : 'normal';
        var buttonFontStyle = (addToCartPopUpData.button_is_italic == 1) ? 'italic' : 'normal';
        var buttonFontSize = addToCartPopUpData.button_font_size + 'px';
        var buttonTextAlignment = addToCartPopUpData.button_text_align.toLowerCase();
        var buttonColor = addToCartPopUpData.button_text_color;
        var buttonText = addToCartPopUpData.button_text;
        var buttonBackgroundColor = addToCartPopUpData.button_background_color;

        var titlehtml = "<h2 style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + headingFontSize +";color:"+ headingColor +" ;text-align:" + headingTextAlignment + ";font-weight:" + headingFontWeight +";font-style: " + headingFontStyle +"'>"+ headingText +"</h2>"; //addToCartPopUpData.heading_text,
        var descripionText = "<p style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + descriptionFontSize +";color:"+ descriptionColor +";text-align:" + descriptionTextAlignment +";font-weight: " + descriptionFontWeight +";font-style:" + descriptionFontStyle +";'>" + descriptionText + "</p>";
        CCSwal.fire({
            title: titlehtml,
            html: descripionText,
            input: 'email',
            inputPlaceholder: addToCartPopUpData.email_placeholder,
            inputAutoTrim: true,
            confirmButtonText:  "<span style='font-size:" + buttonFontSize +";color:"+ buttonColor +";font-style:"+ buttonFontStyle +";font-weight:" + buttonFontWeight +"'>"+addToCartPopUpData.button_text+"</span>",
            confirmButtonColor: addToCartPopUpData.button_background_color,
            showCancelButton: false,
            cancelButtonText: 'No, cancel!',
            showCloseButton: (addToCartPopUpData.is_active_close_button==1?true:false),
            imageUrl: apiBaseUrl+'/'+bannerImage,
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
                AbandonedCartCreateScript.process(1, function () {
                    carecartJquery('form[action="/cart/add"]').submit();
                },'', 'EMAIL_COLLECTOR');
            }else if(result.dismiss){
                var timeNow = new Date();
                window.localStorage.setItem('timeData', timeNow);
                AbandonedCartCreateScript.process(0,'','','EMAIL_COLLECTOR'); 
            }
        });
        if (typeof callBack == 'function') callBack();
    }

    function addJqueryEventListeners() {


        carecartJquery.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });

        if (getParameterByName('cc-preview-email-collector')) {

            if(abandonedCart.globalSettingsAndData.addToCartPopUp!=undefined && abandonedCart.globalSettingsAndData.addToCartPopUp.length>0){
                addToCartPopUpData = abandonedCart.globalSettingsAndData.addToCartPopUp[0]
                if(addToCartPopUpData.banner_image!=''){
                    bannerImage = addToCartPopUpData.banner_image
                }else{
                    bannerImage = 'img/cart-popup.png';
                }
                if (CCSwal.isVisible()) {
                    return;
                }
                var headingFontWeight = (addToCartPopUpData.heading_is_bold == 1) ? 'bold' : 'normal';
                var headingFontStyle = (addToCartPopUpData.heading_is_italic == 1) ? 'italic' : 'normal';
                var headingFontSize = addToCartPopUpData.heading_font_size + 'px';
                var headingTextAlignment = addToCartPopUpData.heading_text_align.toLowerCase();
                var headingColor = addToCartPopUpData.heading_color;
                var headingText = addToCartPopUpData.heading_text;

                var descriptionFontWeight = (addToCartPopUpData.description_is_bold == 1) ? 'bold' : 'normal';
                var descriptionFontStyle = (addToCartPopUpData.description_is_italic == 1) ? 'italic' : 'normal';
                var descriptionFontSize = addToCartPopUpData.description_font_size + 'px';
                var descriptionTextAlignment = addToCartPopUpData.description_text_align.toLowerCase();
                var descriptionColor = addToCartPopUpData.description_color;
                var descriptionText = addToCartPopUpData.description_text;

                var emailPlaceHolder = addToCartPopUpData.email_placeholder;

                var buttonFontWeight = (addToCartPopUpData.button_is_bold == 1) ? 'bold' : 'normal';
                var buttonFontStyle = (addToCartPopUpData.button_is_italic == 1) ? 'italic' : 'normal';
                var buttonFontSize = addToCartPopUpData.button_font_size + 'px';
                var buttonTextAlignment = addToCartPopUpData.button_text_align.toLowerCase();
                var buttonColor = addToCartPopUpData.button_text_color;
                var buttonText = addToCartPopUpData.button_text;
                var buttonBackgroundColor = addToCartPopUpData.button_background_color;

                var titlehtml = "<h2 style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + headingFontSize +";color:"+ headingColor +" ;text-align:" + headingTextAlignment + ";font-weight:" + headingFontWeight +";font-style: " + headingFontStyle +"'>"+ headingText +"</h2>"; //addToCartPopUpData.heading_text,
                var descripionText = "<p style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + descriptionFontSize +";color:"+ descriptionColor +";text-align:" + descriptionTextAlignment +";font-weight: " + descriptionFontWeight +";font-style:" + descriptionFontStyle +";'>" + descriptionText + "</p>";
                CCSwal.fire({
                    title: titlehtml,
                    html: descripionText,
                    input: 'email',
                    inputPlaceholder: addToCartPopUpData.email_placeholder,
                    inputAutoTrim: true,
                    confirmButtonText:  "<span style='font-size:" + buttonFontSize +";color:"+ buttonColor +";font-style:"+ buttonFontStyle +";font-weight:" + buttonFontWeight +"'>"+addToCartPopUpData.button_text+"</span>",
                    confirmButtonColor: addToCartPopUpData.button_background_color,
                    showCancelButton: false,
                    cancelButtonText: 'No, cancel!',
                    showCloseButton: (addToCartPopUpData.is_active_close_button==1?true:false),
                    imageUrl: apiBaseUrl+'/'+bannerImage,
                    imageWidth: 100,
                    allowOutsideClick: false,
                    //footer: 'Footer text',
                    //reverseButtons: true,
                    //type: 'success'

                }).then(function (result) {

                });
            }else{
                carecartJquery.ajax({
                    url: apiBaseUrl + "/api/cart/popupSettings?shop="+store.domain,
                    dataType: 'json',
                    type: 'GET',
                    success: function (response) {
                        var addToCartPopUpData = response.records.addToCartPopUp;
                        if(addToCartPopUpData.banner_image!=''){
                            bannerImage = addToCartPopUpData.banner_image
                        }else{
                            bannerImage = 'img/cart-popup.png';
                        }
                        if (CCSwal.isVisible()) {
                            return;
                        }
                        var headingFontWeight = (addToCartPopUpData.heading_is_bold == 1) ? 'bold' : 'normal';
                        var headingFontStyle = (addToCartPopUpData.heading_is_italic == 1) ? 'italic' : 'normal';
                        var headingFontSize = addToCartPopUpData.heading_font_size + 'px';
                        var headingTextAlignment = addToCartPopUpData.heading_text_align.toLowerCase();
                        var headingColor = addToCartPopUpData.heading_color;
                        var headingText = addToCartPopUpData.heading_text;

                        var descriptionFontWeight = (addToCartPopUpData.description_is_bold == 1) ? 'bold' : 'normal';
                        var descriptionFontStyle = (addToCartPopUpData.description_is_italic == 1) ? 'italic' : 'normal';
                        var descriptionFontSize = addToCartPopUpData.description_font_size + 'px';
                        var descriptionTextAlignment = addToCartPopUpData.description_text_align.toLowerCase();
                        var descriptionColor = addToCartPopUpData.description_color;
                        var descriptionText = addToCartPopUpData.description_text;

                        var emailPlaceHolder = addToCartPopUpData.email_placeholder;

                        var buttonFontWeight = (addToCartPopUpData.button_is_bold == 1) ? 'bold' : 'normal';
                        var buttonFontStyle = (addToCartPopUpData.button_is_italic == 1) ? 'italic' : 'normal';
                        var buttonFontSize = addToCartPopUpData.button_font_size + 'px';
                        var buttonTextAlignment = addToCartPopUpData.button_text_align.toLowerCase();
                        var buttonColor = addToCartPopUpData.button_text_color;
                        var buttonText = addToCartPopUpData.button_text;
                        var buttonBackgroundColor = addToCartPopUpData.button_background_color;

                        var titlehtml = "<h2 style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + headingFontSize +";color:"+ headingColor +" ;text-align:" + headingTextAlignment + ";font-weight:" + headingFontWeight +";font-style: " + headingFontStyle +"'>"+ headingText +"</h2>"; //addToCartPopUpData.heading_text,
                        var descripionText = "<p style='text-transform: unset;font-family: Open Sans, sans-serif;font-size:" + descriptionFontSize +";color:"+ descriptionColor +";text-align:" + descriptionTextAlignment +";font-weight: " + descriptionFontWeight +";font-style:" + descriptionFontStyle +";'>" + descriptionText + "</p>";
                        CCSwal.fire({
                            title: titlehtml,
                            html: descripionText,
                            input: 'email',
                            inputPlaceholder: addToCartPopUpData.email_placeholder,
                            inputAutoTrim: true,
                            confirmButtonText:  "<span style='font-size:" + buttonFontSize +";color:"+ buttonColor +";font-style:"+ buttonFontStyle +";font-weight:" + buttonFontWeight +"'>"+addToCartPopUpData.button_text+"</span>",
                            confirmButtonColor: addToCartPopUpData.button_background_color,
                            showCancelButton: false,
                            cancelButtonText: 'No, cancel!',
                            showCloseButton: (addToCartPopUpData.is_active_close_button==1?true:false),
                            imageUrl: apiBaseUrl+'/'+bannerImage,
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
                        carecartJquery('form[action="/cart/add"]').submit();
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
                carecartJquery('#cc-atcp-table', 'body').hide();
            }
            if (data.email != null) {
                customer.email = data.email;
                //console.log(customer.email);
                abandonedCart.process(1, function () {
                    if (isAjax == 0) {
                        carecartJquery('form[action="/cart/add"]').submit();
                    }
                });
                carecartJquery('#cc-atcp-table', 'body').hide();
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
                    AbandonedCartCreateScript.process(0);
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

        carecartJquery('body').on('submit', 'form[action="/cart/add"]', function (e) {
            console.clear();
            console.log('add to cart clicked....');
            setTimeout(function () {
                isAjax = 0;
                AbandonedCartCreateScript.process(0);
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


var AbandonedCartCreateScript = new AbandonedCartCreateScript();
AbandonedCartCreateScript.init(AbandonedCartCreateScript.process, [0]);

// global-js-injector GH v.1.5.10
// Updated at: 21-07-2020
// https://cdn.jsdelivr.net/gh/carecartapp/app_assets@1.5.10/

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
    script.async = false;
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

    var store = {};
    var apiBaseUrl = "https://app-er.carecart.io";
    var scriptBuildUrl = 'https://cdn.jsdelivr.net/gh/carecartapp/app_assets@1.5.10/';
    this.init = function (callback, callbackArgs) {
        console.log("Initialization started");
        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
        cssFileInjection(scriptBuildUrl+"cc.sweetalert2.css");
        scriptInjection(scriptBuildUrl+"cc.sweetalert2.all.js");
        scriptInjection(scriptBuildUrl+"front-store-spinner.js");
            window.carecartJquery = jQuery.noConflict(true);
                if (carecartJquery('#care-cart-customer-information').length == 0 || carecartJquery('#care-cart-shop-information').length == 0) {
                    var storeData = {};
                    storeData.store = {
                        'domain': Shopify.shop
                    }
                    /*carecartJquery.ajax({
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
                    });*/
                } else {

                    customer = carecartJquery.parseJSON(carecartJquery('#care-cart-customer-information').text());
                    store = carecartJquery.parseJSON(carecartJquery('#care-cart-shop-information').text());
                }

                console.log("Initialization completed");
                if (typeof callback == 'function') {
                    callback.apply(this, callbackArgs);
                }
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
    this.process = function (callBack) {
            var data = {
                    store: store,
            };
            globalSettingsDataCachedTime = window.localStorage.getItem('globalSettingsDataCachedTime');
                if(globalSettingsDataCachedTime!==undefined  && globalSettingsDataCachedTime!==null){
                 var currentTime = new Date();
                 var previousTime = new Date(globalSettingsDataCachedTime);
                 var msec = parseInt(currentTime - previousTime);
                 var minutes = parseInt(Math.floor(msec / 60000));
                 if(minutes<=5){
                    var globalSettingsCache = window.localStorage.getItem('globalSettingsAndData');
                    if(globalSettingsCache!==undefined  && globalSettingsCache!==null){
                        abandonedCart.globalSettingsAndData  =  JSON.parse(globalSettingsCache);
                    }
                 }
              }

            if(abandonedCart.globalSettingsAndData===undefined || abandonedCart.globalSettingsAndData.length==0){ 
                  carecartJquery.ajax({
                        url: "https://tracking.carecart.io/index.php/General/settings?shop="+Shopify.shop,
                        dataType: 'json',
                        type: 'GET',
                        data: {},
                        crossDomain: true,
                        async: false,
                        success: function (response) {
                           if (response.Status == 'Success') {
                                abandonedCart.globalSettingsAndData = response.Data.data;
                                var timeNow = new Date();
                                window.localStorage.setItem('globalSettingsDataCachedTime', timeNow);
                                window.localStorage.setItem('globalSettingsAndData', JSON.stringify(abandonedCart.globalSettingsAndData));
                           }
                        }
                    });
            }
            //console.log(abandonedCart.globalSettingsAndData);
            if(abandonedCart.globalSettingsAndData.titleDesigner.length>0){
                scriptInjection(scriptBuildUrl+"cartReminderScript.js");
            }
            if(abandonedCart.globalSettingsAndData.pnSubscriptionPopup.length>0){
                scriptInjection(scriptBuildUrl+"pushNotificationsScript.js");
            }
            scriptInjection(scriptBuildUrl+"cartCreateScript.js");
            if(abandonedCart.globalSettingsAndData.gdpr.length>0){
                console.log(" GDPR ");
            }
            

    };

}

var abandonedCart = new AbandonedCart();
abandonedCart.init(abandonedCart.process, [0]);

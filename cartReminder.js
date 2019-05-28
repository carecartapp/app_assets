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

function CartReminderScript() {

    var apiBaseUrl = "https://app-er.carecart.io";
    var ccPnAuthUrl = "{{Config::get('firebase.cc_pn_auth_url')}}";

    this.init = function (callback, callbackArgs) {
        console.log("Initialization started");
        scriptInjection("https://code.jquery.com/jquery-3.2.1.min.js", function () {
            scriptInjection("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js", function () {
                window.carecartJquery = jQuery.noConflict(true);
                //scriptInjection(apiBaseUrl + "/plugins/favicon/favico-0.3.10.min.js");
                scriptInjection("https://use.fontawesome.com/e0a385ecbc.js");
                //showAdvanceTitleBar(AbandonedCartCreateScript.titleDesignerData, AbandonedCartCreateScript.CartItemData.item_count);
                if (getParameterByName('cc-show-title-designer')) {
                    CartReminderScript.showAdvanceTitleBar( abandonedCart.globalSettingsAndData.titleDesigner,1);
                }

                if (typeof callback == 'function') {
                    callback.apply(this, callbackArgs);
                }
            });
        })
    }

    this.showAdvanceTitleBar = function (data, itemCount) {
        data = data[0];
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
                //console.log('mousemove');
                if (window.cc_adv_title_timer > 0) {
                    clearTimeout(window.cc_adv_title_timer);
                    window.org_title_marq = 0;
                    window.document.title = window.org_title;
                }
                window.cc_adv_title_timer = setTimeout(function () {
                    //console.log('Timeout');
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
        if (data.favicon_image != "" && data.favicon_image != null) {//if user have personalized favicon image then show it
            carecartJquery('[rel="shortcut icon"]').attr('href', data.favicon_image);//carecartJquery('[rel="shortcut icon"]').attr('href', 'https://app-er.carecart.io/img/icon-reminder.png');
        }
        if (typeof Favico !== 'undefined') {
            var favicon = new Favico({
                bgColor: data.favicon_background_color,
                textColor: data.favicon_text_color,
                animation: data.animation.toLowerCase(),
                position: data.badge_position.toLowerCase(),
                type: data.badge_shape.toLowerCase(),
            });
            favicon.badge(itemCount);
        }
    }
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

}
var CartReminderScript = new CartReminderScript();
CartReminderScript.init(CartReminderScript.process, [0]);

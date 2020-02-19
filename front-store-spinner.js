(function () {

    var APP_URL = 'https://app-er.carecart.io/';
    var API_URL = 'https://app-er-sas.carecart.io/';
    var CDN_URL = 'https://cdn.jsdelivr.net/gh/carecartapp/app_assets@1.4.7/';

    var dataSpin = false;

    function scriptInjection(src, callback) {
        var script = document.createElement('script');
        script.type = "text/javascript";

        script.src = src;
        if (typeof callback == 'function') {
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

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    cssFileInjection(API_URL + "public/app/css/front-store-spinner.css");

    setTimeout(function () {
        scriptInjection(CDN_URL + "spinner.js", function () {


            function Spin2WinWheel() {
                var t, e, n, r, i, o, a, l, s, u, h, c, d, g, p, f, S, m, b, w, T, y, x, N, v, A, M, C, E, k, I, P, O,
                    R, B, W, D, G, z, L, V, _, F, H, U = "http://www.w3.org/2000/svg",
                    Y = "http://www.w3.org/1999/xlink",
                    q = function (t) {
                        return document.querySelector(t)
                    },
                    J = this,
                    X = q(".wheelSVG"),
                    j = q(".wheel"),
                    K = q(".wheelOutline"),
                    Q = q(".wheelContainer"),
                    Z = q(".peg"),
                    $ = q(".pegContainer"),
                    tt = q(".mainContainer"),
                    et = q(".valueContainer"),
                    nt = q(".centerCircle"),
                    rt = q(".toast"),
                    it = q(".toast p"),
                    ot = 0,
                    at = 0,
                    lt = 2,
                    st = 0,
                    ut = 0,
                    ht = ut,
                    ct = [],
                    dt = null,
                    gt = [],
                    pt = !0,
                    ft = null,
                    St = !1,
                    mt = function () {
                        r = t.wheelStrokeColor, o = t.wheelSize, a = o / 2, l = t.wheelTextColor, r = t.wheelStrokeColor, i = t.wheelStrokeWidth, s = t.wheelTextOffsetY, u = t.wheelImageOffsetY, c = t.wheelImageSize, h = t.wheelTextSize, p = t.centerCircleStrokeColor, f = t.centerCircleStrokeWidth, S = t.centerCircleFillColor, m = t.centerCircleSize, b = m / 2, w = t.segmentStrokeColor, T = t.segmentStrokeWidth, y = t.segmentValuesArray, x = y.length, N = -1 == t.numSpins ? 1e16 : parseInt(t.numSpins), I = t.minSpinDuration, P = t.gameOverText, O = t.invalidSpinText, R = t.introText, W = t.hasSound, B = t.gameId, G = t.clickToSpin, A = (v = 360 / x) / 2, C = t.centerX, E = t.centerY, k = t.colorArray, D = t.hasShadows, F = t.spinDestinationArray, D && (K.setAttributeNS(null, "filter", "url(#shadow)"), et.setAttributeNS(null, "filter", "url(#shadow)"), nt.setAttributeNS(null, "filter", "url(#shadow)"), $.setAttributeNS(null, "filter", "url(#shadow)"), rt.style.boxShadow = "0px 0px 20px rgba(21,21,21,0.5)")
                    },
                    bt = function () {
                        TweenMax.set("svg", {
                            visibility: "visible"
                        }), TweenMax.set(j, {
                            svgOrigin: C + " " + E,
                            x: 0,
                            y: 0
                        }), TweenMax.set(Z, {
                            x: C - Z.getBBox().width / 2,
                            y: E - a - Z.getBBox().height / 2,
                            transformOrigin: "50% 25%",
                            visibility: "visible"
                        }), TweenMax.set($, {
                            transformOrigin: "50% 100%",
                            scale: o / 600
                        }), TweenMax.set(tt, {
                            svgOrigin: C + " " + E,
                            rotation: -90,
                            x: 0,
                            y: 0
                        }), TweenMax.set([rt], {
                            xPercent: -50,
                            left: "50%"
                        }), TweenMax.set("svg", {
                            xPercent: -50,
                            left: "50%"
                        })
                    },
                    wt = function () {
                        if (0 != N) {
                            if (!St) {
                                if (F.length > 0) {
                                    pt = !1, N = F.length;
                                    for (var t = 0; t < F.length; t++) {
                                        if (F[t] > x || 0 === F[t]) return showInitError("Invalid destination set - please ensure the destination in spinDestinationArray is greater than 0 and less than or equal to the number of segments"), void (rt.style.backgroundColor = "red");
                                        F[t] = F[t] - 1, F[t] = -1 * F[t] * v - 1080 * lt, lt += 2
                                    }
                                }
                                G ? createClickToSpin() : Dt(), showIntroText()
                            }
                        } else showInitError("numSpins MUST BE GREATER THAN 0")
                    },
                    Tt = function (t, e) {
                        return Math.floor(Math.random() * (e - t + 1) + t)
                    },
                    yt = function () {
                        for (var t, e, n, r, i, o, l, s, u = 0; u < x; u++) ht = (ut = -A) + v, t = C + a * Math.cos(Math.PI * ut / 180), n = E + a * Math.sin(Math.PI * ut / 180), e = C + a * Math.cos(Math.PI * ht / 180), r = E + a * Math.sin(Math.PI * ht / 180), i = "M" + C + "," + E + "  L" + t + "," + n + "  A" + a + "," + a + " 0 0,1 " + e + "," + r + "z", l = document.createElementNS(U, "g"), o = document.createElementNS(U, "path"), l.appendChild(o), j.appendChild(l), TweenMax.set(o, {
                            rotation: u * v,
                            svgOrigin: C + " " + E
                        }), o.setAttributeNS(null, "d", i), k[u] ? s = k[u] : (s = k[st], ++st == k.length && (st = 0)), o.setAttributeNS(null, "fill", s), o.setAttributeNS(null, "stroke", 0), ct.push({
                            path: o,
                            x1: t,
                            x2: e,
                            y1: n,
                            y2: r
                        });
                        T > 0 && xt(), Nt()
                    },
                    xt = function () {
                        for (var t = 0; t < x; t++) {
                            var e = document.createElementNS(U, "line");
                            e.setAttributeNS(null, "x1", C), e.setAttributeNS(null, "x2", ct[t].x2), e.setAttributeNS(null, "y1", E), e.setAttributeNS(null, "y2", ct[t].y2), e.setAttributeNS(null, "stroke", w), e.setAttributeNS(null, "stroke-width", T), j.appendChild(e), TweenMax.set(e, {
                                svgOrigin: C + " " + E,
                                rotation: t * v
                            })
                        }
                    },
                    Nt = function () {
                        var t = document.createElementNS(U, "g"),
                            e = document.createElementNS(U, "image");
                        t.appendChild(e), e.setAttribute("class", "wheelLogo"), e.setAttributeNS(null, "x", C - 60), e.setAttributeNS(null, "y", E - 60), e.setAttributeNS(Y, "xlink:href", "https://sw.secomapp.com/img/app_icon.png"), e.setAttributeNS(null, "width", 120), e.setAttributeNS(null, "height", 120), et.appendChild(t);
                        for (var n = 0; n < x; n++) {
                            var r = document.createElementNS(U, "g");
                            if ("image" == y[n].type) {
                                e = document.createElementNS(U, "image");
                                r.appendChild(e), e.setAttribute("class", "wheelImage"), e.setAttributeNS(null, "x", C - c / 2), e.setAttributeNS(null, "y", E - a + u), e.setAttributeNS(null, "width", c), e.setAttributeNS(null, "height", c), e.setAttributeNS(Y, "xlink:href", y[n].value)
                            } else if ("string" == y[n].type) {
                                var i, o, d = document.createElementNS(U, "text");
                                y[n].value.split("^").forEach(function (t, e) {
                                    i = document.createTextNode(t), (o = document.createElementNS(U, "tspan")).setAttributeNS(null, "dy", e ? "1.2em" : 0), o.setAttributeNS(null, "x", C), o.setAttributeNS(null, "text-anchor", "middle"), o.appendChild(i), d.appendChild(o)
                                }), r.appendChild(d), d.setAttribute("class", "wheelText"), d.setAttributeNS(null, "fill", l), d.setAttributeNS(null, "x", C), d.setAttributeNS(null, "y", E - a + s), d.setAttributeNS(null, "transform", "rotate(-90, 590, -2)"), d.setAttributeNS(null, "text-anchor", "middle"), d.style.fontSize = h
                            }
                            et.appendChild(r), TweenMax.set(r, {
                                svgOrigin: C + " " + E,
                                rotation: n * v
                            })
                        }
                        TweenMax.set(et, {
                            svgOrigin: C + " " + E
                        })
                    },
                    vt = function () {
                        var t = document.createElementNS(U, "g"),
                            e = document.createElementNS(U, "circle");
                        return K.appendChild(t), e.setAttributeNS(null, "fill", "transparent"), e.setAttributeNS(null, "stroke", r), e.setAttributeNS(null, "stroke-width", i), e.setAttributeNS(null, "cx", C), e.setAttributeNS(null, "cy", E), e.setAttributeNS(null, "r", a), t.appendChild(e), t
                    },
                    At = function () {
                        var t = document.createElementNS(U, "circle");
                        return t.setAttributeNS(null, "fill", S), t.setAttributeNS(null, "stroke", p), t.setAttributeNS(null, "stroke-width", f), t.setAttributeNS(null, "cx", C), t.setAttributeNS(null, "cy", E), t.setAttributeNS(null, "r", b), t
                    },
                    Mt = function () {
                        null.play()
                    },
                    Ct = function () {
                        rt.style.visibility = "hidden"
                    },
                    Et = function () {
                        rt.style.visibility = "hidden", dt.onclick = null, lt += 2
                    },
                    kt = function () {
                        disableWheel(), pt && (_ = VelocityTracker.track(j, "rotation"))
                    },
                    It = function (t) {
                        if (M = ot, (ot = Math.round(j._gsTransform.rotation / v)) != M) {
                            var e = ot > M ? -35 : 35;
                            TweenMax.fromTo(Z, .2, {
                                rotation: e
                            }, {
                                onStart: W ? Mt : null,
                                rotation: 0,
                                ease: Back.easeOut
                            })
                        }
                        TweenMax.set(et, {
                            rotation: j._gsTransform.rotation
                        })
                    },
                    Pt = function () {
                        g = j._gsTransform.rotation;
                        var t = Math.round(g % 360);
                        if (t = t > 0 ? 360 - t : t, t = t < 0 ? t *= -1 : t, _ && _.getVelocity("rotation") <= .5) return enableWheel(), void showResult("invalidSpin");
                        var e = Math.round(t / v);
                        ct[e].path;
                        if (showResult(Math.abs(e)), pt) {
                            if (!(N > -1)) return;
                            at++
                        } else at++, d[0].vars.snap = [F[at]];
                        VelocityTracker.untrack(j), at >= N ? endGame() : enableWheel()
                    },
                    Ot = function () {
                        G || d[0].applyBounds({
                            minRotation: -1e16,
                            maxRotation: g
                        })
                    },
                    Rt = function (t) {
                        return function (e) {
                            return Math.round(e / v) * v - t
                        }
                    },
                    Bt = function () {
                        return -v * Tt(0, x) - 1080 * lt
                    },
                    Wt = function () {
                        var t = Math.floor(Math.random() * ft.length),
                            e = ft[t];
                        return -v * e - 1080 * lt
                    },
                    Dt = function () {
                        d = Draggable.create(j, {
                            type: "rotation",
                            bounds: {
                                minRotation: -1e16,
                                maxRotation: 0
                            },
                            throwProps: !0,
                            ease: Back.easeOut.config(.2),
                            snap: pt ? Rt(0) : [F[at]],
                            throwResistance: 0,
                            minDuration: I,
                            onThrowComplete: Pt,
                            onPress: Ct,
                            onDrag: It,
                            onThrowUpdate: It,
                            overshootTolerance: 1,
                            onDragEnd: kt
                        })
                    },
                    Gt = function () {
                        St = !0, y.forEach(function (t, e) {
                            isNaN(t.probability) && (St = !1)
                        }), St && (F = [], N = -1 == t.numSpins ? 1e16 : parseInt(t.numSpins), zt())
                    },
                    zt = function () {
                        var t = 0;
                        y.forEach(function (e, n) {
                            t += e.probability
                        }), H = t, Math.ceil(t) == H || Math.floor(t) == H ? createProbabilityArray() : 1 == confirm("Total probability: " + t + " - If you have set JSON probability values they must add up to 100") && (TweenMax.set(Q, {
                            autoAlpha: 0
                        }), TweenMax.set(Q, {
                            autoAlpha: 0
                        }))
                    };
                createProbabilityArray = function () {
                    ft = [], y.forEach(function (t, e) {
                        for (var n = 0; n < t.probability; n++) ft.push(e)
                    })
                }, showProbabilityError = function () {
                }, createClickToSpin = function () {
                    Gt() && createProbabilityArray(), dt ? dt.onclick = getTrigger() : (dt = j, j.onclick = getTrigger())
                }, getTrigger = function () {
                    return function () {
                        if (St) ThrowPropsPlugin.to(j, {
                            throwProps: {
                                rotation: {
                                    velocity: Tt(-700, -500),
                                    end: Wt()
                                }
                            },
                            onStart: Et,
                            onUpdate: It,
                            ease: Back.easeOut.config(.2),
                            overshootTolerance: 0,
                            onComplete: spinComplete
                        });
                        else {
                            ThrowPropsPlugin.to(j, {
                                throwProps: {
                                    rotation: {
                                        velocity: Tt(-700, -500),
                                        end: pt ? Bt() : [F[at]]
                                    }
                                },
                                onStart: Et,
                                onUpdate: It,
                                ease: Back.easeOut.config(.2),
                                overshootTolerance: 0,
                                onComplete: spinComplete
                            })
                        }
                    }
                }, spinComplete = function () {
                    g = j._gsTransform.rotation;
                    var t = Math.round(g % 360);
                    t = (t = t > 0 ? 360 - t : t) < 0 ? t *= -1 : t;
                    var e = Math.round(t / v);
                    ct[e].path;
                    if (showResult(Math.abs(e)), pt) {
                        if (!(N > -1)) return;
                        at++
                    } else at++;
                    at >= N ? endGame() : dt.onclick = getTrigger()
                }, endGame = function () {
                    disableWheel(), TweenMax.set(X, {
                        alpha: .3
                    }), TweenMax.to(it, 1, {
                        text: P,
                        ease: Linear.easeNone,
                        delay: 2
                    }), L({
                        gameId: B,
                        target: J,
                        results: gt
                    })
                }, disableWheel = function () {
                    G || d[0].disable()
                }, enableWheel = function () {
                    G || d[0].enable()
                }, showResult = function (t) {
                    Ot();
                    var e;
                    if ("invalidSpin" == t) return TweenMax.set(j, {
                        rotation: F[at]
                    }), showToast(O), e = {
                        target: J,
                        type: "error",
                        spinCount: at,
                        win: null,
                        msg: O,
                        gameId: B
                    }, V(e), void gt.push(e);
                    if (!isNaN(t)) {
                        var n = y[t].resultText;
                        showToast(n), e = {
                            target: J,
                            type: "result",
                            spinCount: at,
                            win: y[t].win,
                            msg: y[t].resultText,
                            gameId: B,
                            userData: y[t].userData
                        }, z(e), gt.push(e)
                    }
                }, showIntroText = function (t) {
                    showToast(R)
                }, showInitError = function (t) {
                    TweenMax.set([X, Z], {
                        visibility: "hidden"
                    }), alert(t)
                }, showToast = function (t) {
                    rt.style.visibility = "visible", rt.style.backgroundColor = "#E81D62", it.innerHTML = t, TweenMax.fromTo(rt, .6, {
                        y: 20,
                        alpha: 0
                    }, {
                        y: 0,
                        alpha: 1,
                        delay: .2,
                        onStart: onresize,
                        ease: Elastic.easeOut.config(.7, .7)
                    })
                }, checkNumSegments = function () {
                    x <= 1 && (showInitError("Not enough segments. Please add more entries to segmentValuesArray"), TweenMax.set(X, {
                        visibility: "hidden"
                    }), rt.style.backgroundColor = "red")
                }, setSpinTrigger = function () {
                    dt && (G = !0), G && (dt ? dt.onclick = getTrigger() : j.onclick = getTrigger())
                }, z = function (t) {
                    J.onResult(t)
                }, V = function (t) {
                    J.onError(t)
                }, L = function (t) {
                    J.onGameEnd(t)
                }, this.onResult = z, this.onError = V, this.onGameEnd = L, this.getGameProgress = function () {
                    return gt
                }, this.init = function (r) {
                    if (!r) return bt(), void showInitError("PLEASE INCLUDE THE INIT OBJECT");
                    e = r.data.svgWidth, n = r.data.svgHeight, X.setAttribute("viewBox", "0 0 " + e + " " + r.data.svgHeight), t = r.data, L = r.onGameEnd ? r.onGameEnd : function () {
                    }, z = r.onResult ? r.onResult : function () {
                    }, V = r.onError ? r.onError : function () {
                    }, dt = r.spinTrigger ? r.spinTrigger : null, setSpinTrigger(), mt(), bt(), yt(), K.appendChild(vt()), nt.appendChild(At()), wt(), checkNumSegments()
                }, window.onresize = function () {
                    var t = E - n / 2,
                        e = (parseFloat(getComputedStyle(X).width), parseFloat(getComputedStyle(X).height)),
                        r = (parseFloat(getComputedStyle(rt).width), parseFloat(getComputedStyle(rt).height));
                    TweenMax.set(".toast", {
                        y: (e + t) / 2 - r / 2
                    })
                }, this.restart = function () {
                    G || (d[0].kill(), ot = M = null, TweenMax.to([j, et], .3, {
                        rotation: "0_short",
                        onComplete: Dt
                    })), TweenMax.set(X, {
                        alpha: 1
                    }), TweenMax.to([j, et], .3, {
                        rotation: "0_short"
                    }), rt.style.visibility = "hidden", at = 0, lt = 2, gt = [], showIntroText()
                }
            }

            function myGameEnd(i) {
                var t = $(".winContainer"),
                    l = $(".loseContainer"),
                    e = $(".signupContainer"),
                    n = $(".win_text"),
                    a = $(".coupon");

                postSubscribersInformation(i.results[0].userData.coupon, i.results[0].msg)
                window.localStorage.setItem('cc-sas-spinner-cached-coupon-code', i.results[0].userData.coupon);
                window.localStorage.setItem('cc-sas-spinner-cached-coupon-code-message', i.results[0].msg);
                if (i.results[0].userData.coupon) {
                    e.fadeOut(), n.text(i.results[0].msg), a.text(i.results[0].userData.coupon), t.find("input").val(i.results[0].userData.coupon), t.css({
                        paddingTop: ($(window).height() - t.height()) / 2
                    }),
                        $(window).resize(function () {
                            t.css({
                                // paddingTop: ($(window).height() - t.height()) / 2
                            })
                        }),
                        t.fadeIn()
                } else {
                    e.fadeOut(), n.text(i.results[0].msg), t.css({
                        paddingTop: ($(window).height() - t.height()) / 2
                    }),
                        $(window).resize(function () {
                            t.css({
                                // paddingTop: ($(window).height() - t.height()) / 2
                            })
                        }),
                        l.fadeIn()
                }

            }
            function myGameEndTest(i) {
                var t = $(".winContainer"),
                    l = $(".loseContainer"),
                    e = $(".signupContainer"),
                    n = $(".win_text"),
                    a = $(".coupon");

                if (i.results[0].userData.coupon) {
                    e.fadeOut(), n.text(i.results[0].msg), a.text(i.results[0].userData.coupon), t.find("input").val(i.results[0].userData.coupon), t.css({
                        paddingTop: ($(window).height() - t.height()) / 2
                    }),
                        $(window).resize(function () {
                            t.css({
                                // paddingTop: ($(window).height() - t.height()) / 2
                            })
                        }),
                        t.fadeIn()
                } else {
                    e.fadeOut(), n.text(i.results[0].msg), t.css({
                        paddingTop: ($(window).height() - t.height()) / 2
                    }),
                        $(window).resize(function () {
                            t.css({
                                // paddingTop: ($(window).height() - t.height()) / 2
                            })
                        }),
                        l.fadeIn()
                }

            }

            function init() {
                var i = document.querySelector(".btn-submit-form-ok");
                (new Spin2WinWheel).init({
                    data: dataSpin,
                    onGameEnd: myGameEnd,
                    spinTrigger: i
                })
            }

            function isValidEmailAddress(i) {
               // return !/\S+@\S+\.\S+/.test(i)
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return !re.test(String(i).toLowerCase());
            }

            function applySASPlugin() {
                function i() {
                    var i = $(window).width();
                    i < 680 && (t.css({
                        width: "100%",
                        padding: 0
                    }), v.css({
                        width: "100%",
                        padding: 0
                    }), e.css({
                        width: "100%",
                        position: "fixed",
                        bottom: "-30%",
                        left: 0,
                        right: 0,
                        transform: "translate(-51%)"
                    }), n.css({
                        width: "100%",
                        transform: "translateX(0)"
                    }), a.css({
                        maxWidth: "370"
                    })), i < 400 && e.css({
                        bottom: "-23%"
                    }), i >= 680 && t.css({
                        paddingTop: ($(window).height() - t.height()) / 2
                    })
                }

                var t = $(".signupContainer"),
                    v = $(".winContainer"),
                    e = $(".wheelContainer"),
                    n = $(".wheelSVG"),
                    a = $(".form-group input"),
                    o = $(".btn-submit-form"),
                    s = $('input[name="fullname"]'),
                    d = $('input[name="email"]'),
                    u = $("input[name='coupon']");
                $(".copy-button").click(function () {
                    clipboard.writeText(u.val()), $(this).html('<i class="fa fa-clone" aria-hidden="true"></i> Copied')
                }), i(), $(window).resize(function () {
                    i()
                }), o.click(function (i) {
                    i.preventDefault();
                    var t = s.val(),
                        e = d.val(),
                        n = $(".textInfo"),
                        a = $(".btn-submit-form"),
                        o = $(".btn-submit-form-ok");
                    n.text("");
                    return "" == t ? (n.text("You should provide your fullname!"), n.addClass("animated shake"), void setTimeout(function () {
                        n.removeClass("animated shake")
                    }, 1e3)) : "" == e ? (n.text("You should provide your email"), n.addClass("animated shake"), void setTimeout(function () {
                        n.removeClass("animated shake")
                    }, 1e3)) : isValidEmailAddress(e) ? (n.text("Your email is not valid format"), n.addClass("animated shake"), void setTimeout(function () {
                        n.removeClass("animated shake")
                    }, 1e3)) : o.click();/*void $.ajax({
                        type: "POST",
                        url: "https://sw.secomapp.com/api/subscribe/12/12",
                        data: {
                            fullname: t,
                            email: e
                        },
                        success: function (i) {
                            var check = "0";
                            if (check == "1") {
                                a.css({
                                    display: "none"
                                });
                                o.css({
                                    "display": "block"
                                });
                            } else {
                                o.click();
                            }
                        },
                        error: function () {
                        }
                    })*/
                })
            }

            function showSpinASaleModule(type = '') {
                if (type && type == 'triggered') {
                    // carecartJquery("body").find("#spin_a_sale_cc_store_front_module").show(1000);
                    carecartJquery("body").find("#spin_a_sale_cc_store_front_module").fadeIn();
                } else {
                    if (checkCachedTime()) {
                        // carecartJquery("body").find("#spin_a_sale_cc_store_front_module").show(1000);
                        carecartJquery("body").find("#spin_a_sale_cc_store_front_module").fadeIn();
                    }
                }
                init();
                applySASPlugin();
                postImpressionData();
            }

            function hideSpinASaleModule() {
                ///carecartJquery("body").find("#spin_a_sale_cc_store_front_module").hide();
                carecartJquery("body").find("#spin_a_sale_cc_store_front_module").fadeOut();
            }

            function pupulateData(response) {
                console.log('SAS AJAX Success ');
                if (response && response._metadata && response._metadata.outcome && response._metadata.outcome == "SUCCESS") {
                    console.log('SAS Success Response');
                    /* Check If Module is Active*/
                    if (response.records && response.records.store_settings && response.records.store_settings.is_active) {
                        console.log('SAS is active');
                        /* Check If Module template exist*/
                        if (response.records.store_front_template) {
                            console.log('SAS front template exist');
                            /* Append template*/
                            carecartJquery("body").append(response.records.store_front_template);

                            /* Append triggered button */
                            if (response.records.store_settings.settings_data.is_triggered_enable && parseInt(response.records.store_settings.settings_data.is_triggered_enable) == 1) {
                                carecartJquery("body").append(response.records.store_front_trigger_button);
                            }
                            setTimeout(function () {
                                dataSpin = {
                                    colorArray: ["#364C62", "#F1C40F", "#E67E22", "#E74C3C", "#95A5A6", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#1ABC9C", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"],
                                    segmentValuesArray: response.records.store_slices,
                                    svgWidth: 1024,
                                    svgHeight: 768,
                                    wheelStrokeColor: "#D0BD0C",
                                    wheelStrokeWidth: 20,
                                    wheelSize: 1024,
                                    wheelTextOffsetY: 60,
                                    wheelTextColor: "#FFFFFF",
                                    wheelTextSize: "30px",
                                    wheelImageOffsetY: 100,
                                    wheelImageSize: 200,
                                    centerCircleSize: 220,
                                    centerCircleStrokeColor: "#F1DC15",
                                    centerCircleStrokeWidth: 12,
                                    centerCircleFillColor: "#EDEDED",
                                    segmentStrokeColor: "#E2E2E2",
                                    segmentStrokeWidth: 3,
                                    centerX: 512,
                                    centerY: 384,
                                    hasShadows: !0,
                                    numSpins: 1,
                                    spinDestinationArray: [],
                                    minSpinDuration: 6,
                                    gameOverText: "",
                                    invalidSpinText: "INVALID SPIN. PLEASE SPIN AGAIN.",
                                    introText: "",
                                    hasSound: !1,
                                    gameId: "9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
                                    clickToSpin: !0
                                };

                            }, 500);
                            setTimeout(function () {
                                /* dataSpin = {
                                     colorArray: ["#364C62", "#F1C40F", "#E67E22", "#E74C3C", "#95A5A6", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#1ABC9C", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"],
                                     segmentValuesArray: response.records.store_slices,
                                     svgWidth: 1024,
                                     svgHeight: 768,
                                     wheelStrokeColor: "#D0BD0C",
                                     wheelStrokeWidth: 20,
                                     wheelSize: 1024,
                                     wheelTextOffsetY: 60,
                                     wheelTextColor: "#FFFFFF",
                                     wheelTextSize: "30px",
                                     wheelImageOffsetY: 100,
                                     wheelImageSize: 200,
                                     centerCircleSize: 220,
                                     centerCircleStrokeColor: "#F1DC15",
                                     centerCircleStrokeWidth: 12,
                                     centerCircleFillColor: "#EDEDED",
                                     segmentStrokeColor: "#E2E2E2",
                                     segmentStrokeWidth: 3,
                                     centerX: 512,
                                     centerY: 384,
                                     hasShadows: !0,
                                     numSpins: 1,
                                     spinDestinationArray: [],
                                     minSpinDuration: 6,
                                     gameOverText: "",
                                     invalidSpinText: "INVALID SPIN. PLEASE SPIN AGAIN.",
                                     introText: "",
                                     hasSound: !1,
                                     gameId: "9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
                                     clickToSpin: !0
                                 };*/
                                var type = 'auto';
                                showSpinASaleModule(type);

                            }, parseInt(response.records.store_settings.settings_data.delay_time) * 1000);
                        }

                    }

                } else {
                    console.log('Spin A Sale is Disable');
                }
            }

            /* Post Data to Server */

            function postImpressionData() {

                carecartJquery.ajax({
                    url: API_URL + "store-front-api/post-impression-information",
                    type: 'POST',
                    data: {
                        shop: Shopify.shop,
                        postImpression: 'postImpression',
                    },
                    crossDomain: true,
                    dataType: "json",
                    success: function (response) {
                        if (response.result) {
                            console.log('Impression is post successfully');
                            console.log(error);
                        }
                    },
                    error: function (error) {
                        console.log('Error in impression post');
                        console.log(error);
                    }
                });

            }

            function postSubscribersInformation(coupon = null, result = null) {



                var customerName = $('input[name="fullname"]').val();
                var customerEmail = $('input[name="email"]').val();
                var isConsent = (carecartJquery('#cc-spin-a-sale-consent-checkbox').prop('checked') == true) ? 'consent_accepted' : 'consent_rejected';
                var couponUsed = coupon;
                var winResult = result;

                var customerInformation = {
                    name: customerName,
                    email: customerEmail,
                    isConsent: isConsent,
                    couponUsed: couponUsed,
                    winResult: winResult
                }
                console.log(customerInformation);
                carecartJquery.ajax({
                    url: API_URL + "store-front-api/post-customer-information",
                    type: 'POST',
                    data: {
                        shop: Shopify.shop,
                        customerInformation: customerInformation,
                    },
                    crossDomain: true,
                    dataType: "json",
                    success: function (response) {
                        if (response.result) {
                            updateCachedTime();
                            console.log('User information is post successfully');
                            console.log(error);
                        }
                    },
                    error: function (error) {
                        console.log('Error in impression post');
                        console.log(error);
                    }
                });

            }


            function checkCachedTime() {
                var globalSettingsDataCachedTime = window.localStorage.getItem('cc-sas-spinner-cached-time');
                if (globalSettingsDataCachedTime !== undefined && globalSettingsDataCachedTime !== null) {
                    var currentTime = new Date();
                    var previousTime = new Date(globalSettingsDataCachedTime);
                    var msec = parseInt(currentTime - previousTime);
                    var minutes = parseInt(Math.floor(msec / 60000));
                    console.log(' Time : ' + minutes);
                    if (minutes <= 30) {
                        return false;
                    }

                }
                return true;

            }

            /*function checkCachedTimeForCoupon(){
                var globalSettingsDataCachedTime = window.localStorage.getItem('spinnerCachedTime');
                if(globalSettingsDataCachedTime!==undefined  && globalSettingsDataCachedTime!==null){
                    var currentTime = new Date();
                    var previousTime = new Date(globalSettingsDataCachedTime);
                    var msec = parseInt(currentTime - previousTime);
                    var minutes = parseInt(Math.floor(msec / 60000));
                    console.log(' Time : '+minutes);
                    if(minutes<=2){
                        return false;
                    }

                }
                return true;

            }*/

            function updateCachedTime() {
                var timeNow = new Date();
                window.localStorage.setItem('cc-sas-spinner-cached-time', timeNow);
            }

            /* Post Data to Server END */

            if (!getParameterByName('cc-show-spin-a-sale-test')) {

                carecartJquery.ajax({
                    url: API_URL + "store-front-api/get-store-information",
                    type: 'GET',
                    data: {
                        shop: Shopify.shop,

                    },
                    crossDomain: true,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        pupulateData(response);
                    },
                    error: function (error) {
                        console.log('Error in Spin A Sale request');
                        console.log(error);
                    }
                });

            }


            carecartJquery("body").on("click", "#spin_a_sale_cc_store_front_module_close_button", function () {
                if (!getParameterByName('cc-show-spin-a-sale-test')) {
                    updateCachedTime();
                }
                hideSpinASaleModule();
            });

            carecartJquery("body").on("click", "#spin-trigger-cc", function () {

                var type = 'triggered';
                showSpinASaleModule(type);
                if (!checkCachedTime()) {

                    var t = $(".winContainer"),
                        w = $(".wheelContainer"),
                        l = $(".loseContainer"),
                        e = $(".signupContainer"),
                        n = $(".win_text"),
                        a = $(".coupon");
                    w.css('opacity','0.3');
                    var coupon = window.localStorage.getItem('cc-sas-spinner-cached-coupon-code');
                    var msg = window.localStorage.getItem('cc-sas-spinner-cached-coupon-code-message');
                    if (coupon && msg) {
                        if (coupon) {
                            e.fadeOut(), n.text(msg), a.text(coupon), t.find("input").val(coupon), t.css({
                                paddingTop: ($(window).height() - t.height()) / 2
                            }),
                                $(window).resize(function () {
                                    t.css({
                                        // paddingTop: ($(window).height() - t.height()) / 2
                                    })
                                }),
                                t.fadeIn()
                        } else {
                            e.fadeOut(), n.text(msg), t.css({
                                paddingTop: ($(window).height() - t.height()) / 2
                            }),
                                $(window).resize(function () {
                                    t.css({
                                        // paddingTop: ($(window).height() - t.height()) / 2
                                    })
                                }),
                                l.fadeIn()
                        }

                        carecartJquery("body").find("#spin_a_sale_cc_store_front_module").fadeIn();
                        return;
                    }
                }


                //showSpinASaleModule();


            });

            /* Test on your store flow
             * cc-show-spin-a-sale-test=yes
             * */
            if (getParameterByName('cc-show-spin-a-sale-test')) {

                carecartJquery.ajax({
                    url: API_URL + "store-front-api/get-store-information",
                    type: 'GET',
                    data: {
                        shop: Shopify.shop,
                        type: 'test_spinner'
                    },
                    crossDomain: true,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        console.log('SAS test on store Success ');
                        if (response && response._metadata && response._metadata.outcome && response._metadata.outcome == "SUCCESS") {
                            console.log('SAS TEST Success Response');
                            /* Check If Module template exist*/
                            if (response.records.store_front_template) {
                                console.log('SAS front template exist');
                                /* Append template*/
                                carecartJquery("body").append(response.records.store_front_template);

                                /* Append triggered button */
                                /* if(response.records.store_settings.settings_data.is_triggered_enable && parseInt(response.records.store_settings.settings_data.is_triggered_enable)==1){
                                     carecartJquery("body").append(response.records.store_front_trigger_button);
                                 }*/
                                setTimeout(function () {
                                    dataSpin = {
                                        colorArray: ["#364C62", "#F1C40F", "#E67E22", "#E74C3C", "#95A5A6", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#1ABC9C", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"],
                                        segmentValuesArray: response.records.store_slices,
                                        svgWidth: 1024,
                                        svgHeight: 768,
                                        wheelStrokeColor: "#D0BD0C",
                                        wheelStrokeWidth: 20,
                                        wheelSize: 1024,
                                        wheelTextOffsetY: 60,
                                        wheelTextColor: "#FFFFFF",
                                        wheelTextSize: "30px",
                                        wheelImageOffsetY: 100,
                                        wheelImageSize: 200,
                                        centerCircleSize: 220,
                                        centerCircleStrokeColor: "#F1DC15",
                                        centerCircleStrokeWidth: 12,
                                        centerCircleFillColor: "#EDEDED",
                                        segmentStrokeColor: "#E2E2E2",
                                        segmentStrokeWidth: 3,
                                        centerX: 512,
                                        centerY: 384,
                                        hasShadows: !0,
                                        numSpins: 1,
                                        spinDestinationArray: [],
                                        minSpinDuration: 6,
                                        gameOverText: "",
                                        invalidSpinText: "INVALID SPIN. PLEASE SPIN AGAIN.",
                                        introText: "",
                                        hasSound: !1,
                                        gameId: "9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
                                        clickToSpin: !0
                                    };
                                    carecartJquery("body").find("#spin_a_sale_cc_store_front_module").show(1000);
                                    var tb = document.querySelector(".btn-submit-form-ok");
                                    (new Spin2WinWheel).init({
                                        data: dataSpin,
                                        onGameEnd: myGameEndTest,
                                        spinTrigger: tb
                                    })

                                    function i() {
                                        var i = $(window).width();
                                        i < 680 && (t.css({
                                            width: "100%",
                                            padding: 0
                                        }), v.css({
                                            width: "100%",
                                            padding: 0
                                        }), e.css({
                                            width: "100%",
                                            position: "fixed",
                                            bottom: "-30%",
                                            left: 0,
                                            right: 0,
                                            transform: "translate(-51%)"
                                        }), n.css({
                                            width: "100%",
                                            transform: "translateX(0)"
                                        }), a.css({
                                            maxWidth: "370"
                                        })), i < 400 && e.css({
                                            bottom: "-23%"
                                        }), i >= 680 && t.css({
                                            paddingTop: ($(window).height() - t.height()) / 2
                                        })
                                    }

                                    var t = $(".signupContainer"),
                                        v = $(".winContainer"),
                                        e = $(".wheelContainer"),
                                        n = $(".wheelSVG"),
                                        a = $(".form-group input"),
                                        o = $(".btn-submit-form"),
                                        s = $('input[name="fullname"]'),
                                        d = $('input[name="email"]'),
                                        u = $("input[name='coupon']");
                                    $(".copy-button").click(function () {
                                        clipboard.writeText(u.val()), $(this).html('<i class="fa fa-clone" aria-hidden="true"></i> Copied')
                                    }), i(), $(window).resize(function () {
                                        i()
                                    }), o.click(function (i) {
                                        i.preventDefault();
                                        var t = s.val(),
                                            e = d.val(),
                                            n = $(".textInfo"),
                                            a = $(".btn-submit-form"),
                                            o = $(".btn-submit-form-ok");
                                        return "" == t ? (n.text("You should provide your fullname!"), n.addClass("animated shake"), void setTimeout(function () {
                                            n.removeClass("animated shake")
                                        }, 1e3)) : "" == e ? (n.text("You should provide your email"), n.addClass("animated shake"), void setTimeout(function () {
                                            n.removeClass("animated shake")
                                        }, 1e3)) : isValidEmailAddress(e) ? (n.text("You email is not valid format"), n.addClass("animated shake"), void setTimeout(function () {
                                            n.removeClass("animated shake")
                                        }, 1e3)) : o.click();
                                    })

                                }, 2000);
                            }


                        } else {
                            console.log('Spin A Sale is Disable');
                            console.log(error);
                        }
                    },
                    error: function (error) {
                        console.log('Error in Spin A Sale requestTest');
                        console.log(error);
                    }
                });


            }

        });

    }, 1000);


})();

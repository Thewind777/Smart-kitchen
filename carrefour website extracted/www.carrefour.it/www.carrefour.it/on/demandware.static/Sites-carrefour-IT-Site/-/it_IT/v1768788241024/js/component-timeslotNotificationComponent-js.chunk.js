(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [912, 7320], {
        12215: function(e, t, n) {
            var o, i;
            ! function(r) {
                if (void 0 === (i = "function" == typeof(o = r) ? o.call(t, n, t, e) : o) || (e.exports = i), e.exports = r(), !!0) {
                    var s = window.Cookies,
                        c = window.Cookies = r();
                    c.noConflict = function() {
                        return window.Cookies = s, c
                    }
                }
            }(function() {
                function e() {
                    for (var e = 0, t = {}; e < arguments.length; e++) {
                        var n = arguments[e];
                        for (var o in n) t[o] = n[o]
                    }
                    return t
                }

                function t(e) {
                    return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
                }
                return function n(o) {
                    function i() {}

                    function r(t, n, r) {
                        if ("undefined" != typeof document) {
                            "number" == typeof(r = e({
                                path: "/"
                            }, i.defaults, r)).expires && (r.expires = new Date(1 * new Date + 864e5 * r.expires)), r.expires = r.expires ? r.expires.toUTCString() : "";
                            try {
                                var s = JSON.stringify(n);
                                /^[\{\[]/.test(s) && (n = s)
                            } catch (e) {}
                            n = o.write ? o.write(n, t) : encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                            var c = "";
                            for (var a in r) r[a] && (c += "; " + a, !0 !== r[a] && (c += "=" + r[a].split(";")[0]));
                            return document.cookie = t + "=" + n + c
                        }
                    }

                    function s(e, n) {
                        if ("undefined" != typeof document) {
                            for (var i = {}, r = document.cookie ? document.cookie.split("; ") : [], s = 0; s < r.length; s++) {
                                var c = r[s].split("="),
                                    a = c.slice(1).join("=");
                                n || '"' !== a.charAt(0) || (a = a.slice(1, -1));
                                try {
                                    var u = t(c[0]);
                                    if (a = (o.read || o)(a, u) || t(a), n) try {
                                        a = JSON.parse(a)
                                    } catch (e) {}
                                    if (i[u] = a, e === u) break
                                } catch (e) {}
                            }
                            return e ? i[e] : i
                        }
                    }
                    return i.set = r, i.get = function(e) {
                        return s(e, !1)
                    }, i.getJSON = function(e) {
                        return s(e, !0)
                    }, i.remove = function(t, n) {
                        r(t, "", e(n, {
                            expires: -1
                        }))
                    }, i.defaults = {}, i.withConverter = n, i
                }(function() {})
            })
        },
        57467: function(e, t, n) {
            "use strict";
            n.d(t, {
                A: function() {
                    return d
                }
            });
            var o = n(64467),
                i = n(23029),
                r = n(92901),
                s = n(50388),
                c = n(53954),
                a = n(15361),
                u = n(85349),
                l = n.n(u),
                f = n(24263);

            function p(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(e);
                    t && (o = o.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, o)
                }
                return n
            }

            function h() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (h = function() {
                    return !!e
                })()
            }
            var d = function(e) {
                function t(e) {
                    var n, o, r, a;
                    return (0, i.A)(this, t), o = this, r = t, a = [e], r = (0, c.A)(r), (n = (0, s.A)(o, h() ? Reflect.construct(r, a || [], (0, c.A)(o).constructor) : r.apply(o, a)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, a.A)(t, e), (0, r.A)(t, [{
                    key: "$el",
                    get: function() {
                        return this._componentElement
                    }
                }, {
                    key: "$options",
                    get: function() {
                        var e = {},
                            n = function(e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var n = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? p(Object(n), !0).forEach(function(t) {
                                        (0, o.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : p(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(o) {
                            var i, r = t.cleanOptionKey(o);
                            i = n[o].includes("{") && n[o].includes("}") ? JSON.parse(n[o].replace(/'/g, '"')) : t.convertType(n[o]), e[r] = i
                        }), (0, f.A)(e)
                    }
                }, {
                    key: "COMPONENT_NAME",
                    get: function() {
                        return this.$el.getAttribute("data-component")
                    }
                }, {
                    key: "$on",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el,
                            o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && e && t && (o ? l().on(n, e, o, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : l().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        l().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().fire(t, e)
                    }
                }, {
                    key: "loading",
                    value: function(e, t) {
                        this._loading = !0, this.EMIT(this.CUSTOM_MESSAGES.LOADER_EVENTS.show, {
                            container: e || document.body,
                            message: null != t ? t : null
                        })
                    }
                }, {
                    key: "endLoading",
                    value: function(e, t) {
                        var n = this,
                            o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            i = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: o,
                                icon: i
                            })
                        }, 400)
                    }
                }], [{
                    key: "convertType",
                    value: function(e) {
                        var t;
                        switch (e) {
                            case "false":
                                t = !1;
                                break;
                            case "true":
                                t = !0;
                                break;
                            case "null":
                                t = null;
                                break;
                            default:
                                t = e
                        }
                        return t
                    }
                }, {
                    key: "cleanOptionKey",
                    value: function(e) {
                        var t = e.replace("option", "");
                        return "".concat(t.charAt(0).toLocaleLowerCase()).concat(t.slice(1))
                    }
                }])
            }(n(39860).A)
        },
        60171: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                default: function() {
                    return p
                }
            });
            var o = n(64467),
                i = n(23029),
                r = n(92901),
                s = n(50388),
                c = n(53954),
                a = n(15361),
                u = n(57467),
                l = n(67303);

            function f() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (f = function() {
                    return !!e
                })()
            }
            var p = function(e) {
                function t(e) {
                    var n, o, r, a;
                    return (0, i.A)(this, t), o = this, r = t, a = [e], r = (0, c.A)(r), (n = (0, s.A)(o, f() ? Reflect.construct(r, a || [], (0, c.A)(o).constructor) : r.apply(o, a))).handleClose(), n.$options.clickCloseEverywhere && document.addEventListener("click", function(e) {
                        n.$options.isapp ? (0, l.v)({
                            action: "PRODUCT_NA_FLYERS_CLOSE"
                        }) : n.$el.contains(e.target) && !e.target.classList.contains("toaster-close-btn") || n.$el.classList.add(n.CLASSES.hide)
                    }), n.handleAnimationProgressBar(), n
                }
                return (0, a.A)(t, e), (0, r.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)({}, this.CUSTOM_MESSAGES.TOASTER.rendererror, this.showToasterError)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            close: ".close-btn",
                            progressBar: ".timeslot-progress-bar",
                            title: ".toaster-title",
                            text: ".toaster-text"
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            hide: "d-none"
                        }
                    }
                }, {
                    key: "$close",
                    get: function() {
                        return this.$el.querySelector(this.SELECTORS.close)
                    }
                }, {
                    key: "handleAnimationProgressBar",
                    value: function() {
                        var e = this,
                            t = this.$el.querySelector(this.SELECTORS.progressBar);
                        t && t.addEventListener("animationend", function(t) {
                            e.$el.classList.add(e.CLASSES.hide)
                        })
                    }
                }, {
                    key: "handleClose",
                    value: function() {
                        var e = this;
                        this.$close.addEventListener("click", function(t) {
                            e.$el.classList.add(e.CLASSES.hide), e.$options.timed && clearTimeout(e.timed)
                        })
                    }
                }, {
                    key: "showToasterError",
                    value: function(e) {
                        var t = this,
                            n = e.title,
                            o = e.text,
                            i = e.selector;
                        this.$el.classList.contains(i) && (n && (this.$el.querySelector(this.SELECTORS.title).innerHTML = n), this.$el.querySelector(this.SELECTORS.text).innerHTML = o, this.$el.classList.remove(this.CLASSES.hide), this.$options.timed && (clearTimeout(this.timed), this.timed = setTimeout(function() {
                            t.$el.classList.add(t.CLASSES.hide)
                        }, 4e3)))
                    }
                }])
            }(u.A)
        },
        66115: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                default: function() {
                    return d
                }
            });
            var o = n(64467),
                i = n(23029),
                r = n(92901),
                s = n(50388),
                c = n(53954),
                a = n(15361),
                u = n(60171),
                l = n(12215),
                f = n.n(l),
                p = n(67303);

            function h() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (h = function() {
                    return !!e
                })()
            }
            var d = function(e) {
                function t(e) {
                    var n, o, r, a;
                    return (0, i.A)(this, t), o = this, r = t, a = [e], r = (0, c.A)(r), (n = (0, s.A)(o, h() ? Reflect.construct(r, a || [], (0, c.A)(o).constructor) : r.apply(o, a))).timeslotNotification = parseInt(n.$options.timeslotNotification, 10), n.pageType = n.$options.pageType, n.isapp = n.$options.isapp, n.init(), n
                }
                return (0, a.A)(t, e), (0, r.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)({}, this.CUSTOM_MESSAGES.TIMESLOT.EXPIRY_NOTIFICATION, this.showNotification)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            closeBtn: ".close-btn",
                            progressBar: ".timeslot-progress-bar"
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            hide: "d-none"
                        }
                    }
                }, {
                    key: "init",
                    value: function() {
                        "checkout" !== this.pageType && (Number("".concat(this.$options.timeslotMinutes, ".").concat(this.$options.timeslotSeconds)) <= this.timeslotNotification && !f().get("timeslot-expiry-notification") && this.showNotification())
                    }
                }, {
                    key: "handleClose",
                    value: function() {
                        var e = this,
                            t = this.$el.querySelector(this.SELECTORS.closeBtn);
                        t && this.$on("click", function() {
                            e.$el.classList.add(e.CLASSES.hide), e.setExpiryCookie(), e.pushToDatalayer("promo_click", "banner_consegna")
                        }, t)
                    }
                }, {
                    key: "showNotification",
                    value: function() {
                        var e = this;
                        f().get("timeslot-expiry-notification") || "checkout" === this.pageType || (this.isapp ? ((0, p.v)({
                            action: "OPEN_EXPIRY_NOTIFICATION"
                        }), setTimeout(function() {
                            e.setExpiryCookie()
                        }, 10500)) : (this.$el.classList.remove(this.CLASSES.hide), this.pushToDatalayer("promo_impression", "banner_consegna")))
                    }
                }, {
                    key: "handleAnimationProgressBar",
                    value: function() {
                        var e = this,
                            t = this.$el.querySelector(this.SELECTORS.progressBar);
                        t && t.addEventListener("animationend", function(t) {
                            e.$el.classList.add(e.CLASSES.hide), e.setExpiryCookie()
                        })
                    }
                }, {
                    key: "setExpiryCookie",
                    value: function() {
                        var e = new Date((new Date).getTime() + 60 * this.timeslotNotification * 1e3);
                        f().set("timeslot-expiry-notification", !0, {
                            expires: e
                        })
                    }
                }, {
                    key: "pushToDatalayer",
                    value: function(e, t) {
                        window.dataLayer && window.dataLayer.push({
                            event: e,
                            promo_title: "Scadenza slot consegna",
                            promo_template: t,
                            promo_type: "popup"
                        })
                    }
                }])
            }(u.default)
        }
    }
]);
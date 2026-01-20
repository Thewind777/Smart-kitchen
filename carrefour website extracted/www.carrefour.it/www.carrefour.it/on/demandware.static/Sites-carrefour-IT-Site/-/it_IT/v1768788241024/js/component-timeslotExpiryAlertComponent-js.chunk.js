"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [912, 7348], {
        8732: function(t, e, n) {
            n.d(e, {
                Em: function() {
                    return h
                },
                Jt: function() {
                    return d
                },
                bE: function() {
                    return f
                }
            });
            var r = n(10467),
                o = n(80296),
                a = n(54756),
                i = n.n(a),
                c = n(72505),
                s = n.n(c),
                u = n(79889),
                l = (n(57520), s().create({
                    transformRequest: [function(t, e) {
                        if (e && e.skiptransform) return delete e.skiptransform, t;
                        if (t && Object.entries(t)) {
                            for (var n = new FormData, r = 0, a = Object.entries(t); r < a.length; r++) {
                                var i = (0, o.A)(a[r], 2),
                                    c = i[0],
                                    s = i[1];
                                n.append(c, s)
                            }
                            return n
                        }
                    }]
                })),
                p = function() {
                    var t = (0, r.A)(i().mark(function t(e) {
                        var n, r;
                        return i().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    return n = e.googleRecaptchaAction, r = e.googleRecaptchaClientSide, t.abrupt("return", new Promise(function(t, e) {
                                        window.grecaptcha.ready(function() {
                                            window.grecaptcha.execute(r, {
                                                action: n
                                            }).then(function(e) {
                                                t(e)
                                            })
                                        })
                                    }));
                                case 1:
                                case "end":
                                    return t.stop()
                            }
                        }, t)
                    }));
                    return function(e) {
                        return t.apply(this, arguments)
                    }
                }();
            l.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest", l.interceptors.request.use(function() {
                var t = (0, r.A)(i().mark(function t(e) {
                    var n;
                    return i().wrap(function(t) {
                        for (;;) switch (t.prev = t.next) {
                            case 0:
                                if (!(e.data && e.data.googleRecaptchaAction && e.data.googleRecaptchaClientSide && window.grecaptcha)) {
                                    t.next = 2;
                                    break
                                }
                                return t.next = 1, p(e.data);
                            case 1:
                                return n = t.sent, e.data.googleRecaptchaToken = n, t.abrupt("return", e);
                            case 2:
                                return t.abrupt("return", e);
                            case 3:
                            case "end":
                                return t.stop()
                        }
                    }, t)
                }));
                return function(e) {
                    return t.apply(this, arguments)
                }
            }(), function(t) {
                return Promise.reject(t)
            }), l.interceptors.response.use(function(t) {
                var e = new u.A;
                if (t.data && t.data.pushState || t.data.replaceState) t.data.pushState && history.pushState({}, "", t.data.pushState), t.data.replaceState && history.replaceState({}, "", t.data.replaceState), t.data.redirectUrl && setTimeout(function() {
                    location.href = t.data.redirectUrl
                }, 500);
                else if (t.data && t.data.redirectUrl) {
                    var n = t.data.redirectUrl,
                        r = "";
                    t.data.isPaybackPopupActive && (r = n.indexOf("?") > -1 ? "&isPaybackPopupActive=true" : "?isPaybackPopupActive=true"), n += r;
                    var o = "";
                    t.data.subscriptionTrialModalNotEligibleAfterLogin && (o = n.indexOf("?") > -1 ? "&subscriptionTrialModalNotEligibleAfterLogin=true" : "?subscriptionTrialModalNotEligibleAfterLogin=true"), location.href = n + o
                }
                if (t.data && t.data.error && (t.config.data instanceof FormData && (t.config.data = Object.fromEntries(t.config.data), t.config.headers["Content-Type"] = "application/json"), e.EMIT("error.".concat(t.data.error), {
                        res: t
                    })), t.data && t.data.notificationPush && t.data.notificationPush.showNotification && e.EMIT("notification:push", t.data.notificationPush), t.data && t.data.pushPromoPre && t.data.pushPromoPre.length > 0) {
                    var a = t.data.pushPromoPre.sort(function(t, e) {
                        return t.rank > e.rank ? -1 : e.rank > t.rank ? 1 : 0
                    });
                    e.EMIT("notification:pushFirstAvailable", {
                        notifications: a
                    })
                }
                return t.data && t.data.pushPromoPost && e.EMIT("notification:pushall", t.data.pushPromoPost), t
            }, function(t) {
                var e, n;
                return null !== (e = t.response) && void 0 !== e && e.data && null !== (n = t.response) && void 0 !== n && null !== (n = n.data) && void 0 !== n && n.redirectUrl && (location.href = t.response.data.redirectUrl), Promise.reject(t)
            });
            s().CancelToken;
            var d = l.get,
                f = l.post,
                h = (l.all, l.spread, l.request)
        },
        48207: function(t, e, n) {
            n.r(e), n.d(e, {
                default: function() {
                    return f
                }
            });
            var r = n(64467),
                o = n(23029),
                a = n(92901),
                i = n(50388),
                c = n(53954),
                s = n(15361),
                u = n(60171),
                l = n(8732),
                p = n(67303);

            function d() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (d = function() {
                    return !!t
                })()
            }
            var f = function(t) {
                function e(t) {
                    var n, r, a, s;
                    return (0, o.A)(this, e), r = this, a = e, s = [t], a = (0, c.A)(a), (n = (0, i.A)(r, d() ? Reflect.construct(a, s || [], (0, c.A)(r).constructor) : a.apply(r, s))).pageType = n.$options.pageType, n.isApp = n.$options.isapp, n.isReleasedSession = n.$options.releasedSession, n.init(), n
                }
                return (0, s.A)(e, t), (0, a.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, r.A)({}, this.CUSTOM_MESSAGES.TIMESLOT.EXPIRY, this.show)
                    }
                }, {
                    key: "init",
                    value: function() {
                        this.isReleasedSession && this.show()
                    }
                }, {
                    key: "handleClose",
                    value: function() {
                        var t = this;
                        this.$close.addEventListener("click", function(e) {
                            t.pushToDatalayer("promo_click", "banner_consegna");
                            (0, l.Jt)(t.$options.endpoint).data;
                            t.$el.classList.add(t.CLASSES.hide)
                        })
                    }
                }, {
                    key: "show",
                    value: function() {
                        "checkout" !== this.pageType && (this.isApp ? (0, p.v)({
                            action: "OPEN_RELEASE_NOTIFICATION"
                        }) : (this.pushToDatalayer("promo_impression", "banner_consegna"), this.$el.classList.remove(this.CLASSES.hide)))
                    }
                }, {
                    key: "pushToDatalayer",
                    value: function(t, e) {
                        window.dataLayer && window.dataLayer.push({
                            event: t,
                            promo_title: "Prenotazione scaduta",
                            promo_template: e,
                            promo_type: "popup"
                        })
                    }
                }])
            }(u.default)
        },
        57467: function(t, e, n) {
            n.d(e, {
                A: function() {
                    return h
                }
            });
            var r = n(64467),
                o = n(23029),
                a = n(92901),
                i = n(50388),
                c = n(53954),
                s = n(15361),
                u = n(85349),
                l = n.n(u),
                p = n(24263);

            function d(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), n.push.apply(n, r)
                }
                return n
            }

            function f() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (f = function() {
                    return !!t
                })()
            }
            var h = function(t) {
                function e(t) {
                    var n, r, a, s;
                    return (0, o.A)(this, e), r = this, a = e, s = [t], a = (0, c.A)(a), (n = (0, i.A)(r, f() ? Reflect.construct(a, s || [], (0, c.A)(r).constructor) : a.apply(r, s)))._componentElement = t, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, s.A)(e, t), (0, a.A)(e, [{
                    key: "$el",
                    get: function() {
                        return this._componentElement
                    }
                }, {
                    key: "$options",
                    get: function() {
                        var t = {},
                            n = function(t) {
                                for (var e = 1; e < arguments.length; e++) {
                                    var n = null != arguments[e] ? arguments[e] : {};
                                    e % 2 ? d(Object(n), !0).forEach(function(e) {
                                        (0, r.A)(t, e, n[e])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : d(Object(n)).forEach(function(e) {
                                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                                    })
                                }
                                return t
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(t) {
                            return t.includes("option")
                        }).forEach(function(r) {
                            var o, a = e.cleanOptionKey(r);
                            o = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : e.convertType(n[r]), t[a] = o
                        }), (0, p.A)(t)
                    }
                }, {
                    key: "COMPONENT_NAME",
                    get: function() {
                        return this.$el.getAttribute("data-component")
                    }
                }, {
                    key: "$on",
                    value: function(t, e) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el,
                            r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && t && e && (r ? l().on(n, t, r, function(t) {
                            t && t.stopPropagation(), e(t)
                        }) : l().on(n, t, function(t) {
                            t && t.stopPropagation(), e(t)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(t, e) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        l().one(n, t, e)
                    }
                }, {
                    key: "$off",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().off(e, t)
                    }
                }, {
                    key: "$fire",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().fire(e, t)
                    }
                }, {
                    key: "loading",
                    value: function(t, e) {
                        this._loading = !0, this.EMIT(this.CUSTOM_MESSAGES.LOADER_EVENTS.show, {
                            container: t || document.body,
                            message: null != e ? e : null
                        })
                    }
                }, {
                    key: "endLoading",
                    value: function(t, e) {
                        var n = this,
                            r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            o = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: t || document.body,
                                message: e,
                                error: r,
                                icon: o
                            })
                        }, 400)
                    }
                }], [{
                    key: "convertType",
                    value: function(t) {
                        var e;
                        switch (t) {
                            case "false":
                                e = !1;
                                break;
                            case "true":
                                e = !0;
                                break;
                            case "null":
                                e = null;
                                break;
                            default:
                                e = t
                        }
                        return e
                    }
                }, {
                    key: "cleanOptionKey",
                    value: function(t) {
                        var e = t.replace("option", "");
                        return "".concat(e.charAt(0).toLocaleLowerCase()).concat(e.slice(1))
                    }
                }])
            }(n(39860).A)
        },
        60171: function(t, e, n) {
            n.r(e), n.d(e, {
                default: function() {
                    return d
                }
            });
            var r = n(64467),
                o = n(23029),
                a = n(92901),
                i = n(50388),
                c = n(53954),
                s = n(15361),
                u = n(57467),
                l = n(67303);

            function p() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (p = function() {
                    return !!t
                })()
            }
            var d = function(t) {
                function e(t) {
                    var n, r, a, s;
                    return (0, o.A)(this, e), r = this, a = e, s = [t], a = (0, c.A)(a), (n = (0, i.A)(r, p() ? Reflect.construct(a, s || [], (0, c.A)(r).constructor) : a.apply(r, s))).handleClose(), n.$options.clickCloseEverywhere && document.addEventListener("click", function(t) {
                        n.$options.isapp ? (0, l.v)({
                            action: "PRODUCT_NA_FLYERS_CLOSE"
                        }) : n.$el.contains(t.target) && !t.target.classList.contains("toaster-close-btn") || n.$el.classList.add(n.CLASSES.hide)
                    }), n.handleAnimationProgressBar(), n
                }
                return (0, s.A)(e, t), (0, a.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, r.A)({}, this.CUSTOM_MESSAGES.TOASTER.rendererror, this.showToasterError)
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
                        var t = this,
                            e = this.$el.querySelector(this.SELECTORS.progressBar);
                        e && e.addEventListener("animationend", function(e) {
                            t.$el.classList.add(t.CLASSES.hide)
                        })
                    }
                }, {
                    key: "handleClose",
                    value: function() {
                        var t = this;
                        this.$close.addEventListener("click", function(e) {
                            t.$el.classList.add(t.CLASSES.hide), t.$options.timed && clearTimeout(t.timed)
                        })
                    }
                }, {
                    key: "showToasterError",
                    value: function(t) {
                        var e = this,
                            n = t.title,
                            r = t.text,
                            o = t.selector;
                        this.$el.classList.contains(o) && (n && (this.$el.querySelector(this.SELECTORS.title).innerHTML = n), this.$el.querySelector(this.SELECTORS.text).innerHTML = r, this.$el.classList.remove(this.CLASSES.hide), this.$options.timed && (clearTimeout(this.timed), this.timed = setTimeout(function() {
                            e.$el.classList.add(e.CLASSES.hide)
                        }, 4e3)))
                    }
                }])
            }(u.A)
        }
    }
]);
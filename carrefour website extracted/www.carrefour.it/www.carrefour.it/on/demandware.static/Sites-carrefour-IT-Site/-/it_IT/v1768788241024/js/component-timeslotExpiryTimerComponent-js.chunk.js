"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [6146], {
        8732: function(t, e, n) {
            n.d(e, {
                Em: function() {
                    return h
                },
                Jt: function() {
                    return f
                },
                bE: function() {
                    return d
                }
            });
            var r = n(10467),
                a = n(80296),
                o = n(54756),
                i = n.n(o),
                c = n(72505),
                u = n.n(c),
                s = n(79889),
                l = (n(57520), u().create({
                    transformRequest: [function(t, e) {
                        if (e && e.skiptransform) return delete e.skiptransform, t;
                        if (t && Object.entries(t)) {
                            for (var n = new FormData, r = 0, o = Object.entries(t); r < o.length; r++) {
                                var i = (0, a.A)(o[r], 2),
                                    c = i[0],
                                    u = i[1];
                                n.append(c, u)
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
                var e = new s.A;
                if (t.data && t.data.pushState || t.data.replaceState) t.data.pushState && history.pushState({}, "", t.data.pushState), t.data.replaceState && history.replaceState({}, "", t.data.replaceState), t.data.redirectUrl && setTimeout(function() {
                    location.href = t.data.redirectUrl
                }, 500);
                else if (t.data && t.data.redirectUrl) {
                    var n = t.data.redirectUrl,
                        r = "";
                    t.data.isPaybackPopupActive && (r = n.indexOf("?") > -1 ? "&isPaybackPopupActive=true" : "?isPaybackPopupActive=true"), n += r;
                    var a = "";
                    t.data.subscriptionTrialModalNotEligibleAfterLogin && (a = n.indexOf("?") > -1 ? "&subscriptionTrialModalNotEligibleAfterLogin=true" : "?subscriptionTrialModalNotEligibleAfterLogin=true"), location.href = n + a
                }
                if (t.data && t.data.error && (t.config.data instanceof FormData && (t.config.data = Object.fromEntries(t.config.data), t.config.headers["Content-Type"] = "application/json"), e.EMIT("error.".concat(t.data.error), {
                        res: t
                    })), t.data && t.data.notificationPush && t.data.notificationPush.showNotification && e.EMIT("notification:push", t.data.notificationPush), t.data && t.data.pushPromoPre && t.data.pushPromoPre.length > 0) {
                    var o = t.data.pushPromoPre.sort(function(t, e) {
                        return t.rank > e.rank ? -1 : e.rank > t.rank ? 1 : 0
                    });
                    e.EMIT("notification:pushFirstAvailable", {
                        notifications: o
                    })
                }
                return t.data && t.data.pushPromoPost && e.EMIT("notification:pushall", t.data.pushPromoPost), t
            }, function(t) {
                var e, n;
                return null !== (e = t.response) && void 0 !== e && e.data && null !== (n = t.response) && void 0 !== n && null !== (n = n.data) && void 0 !== n && n.redirectUrl && (location.href = t.response.data.redirectUrl), Promise.reject(t)
            });
            u().CancelToken;
            var f = l.get,
                d = l.post,
                h = (l.all, l.spread, l.request)
        },
        57467: function(t, e, n) {
            n.d(e, {
                A: function() {
                    return h
                }
            });
            var r = n(64467),
                a = n(23029),
                o = n(92901),
                i = n(50388),
                c = n(53954),
                u = n(15361),
                s = n(85349),
                l = n.n(s),
                p = n(24263);

            function f(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), n.push.apply(n, r)
                }
                return n
            }

            function d() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (d = function() {
                    return !!t
                })()
            }
            var h = function(t) {
                function e(t) {
                    var n, r, o, u;
                    return (0, a.A)(this, e), r = this, o = e, u = [t], o = (0, c.A)(o), (n = (0, i.A)(r, d() ? Reflect.construct(o, u || [], (0, c.A)(r).constructor) : o.apply(r, u)))._componentElement = t, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, u.A)(e, t), (0, o.A)(e, [{
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
                                    e % 2 ? f(Object(n), !0).forEach(function(e) {
                                        (0, r.A)(t, e, n[e])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : f(Object(n)).forEach(function(e) {
                                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                                    })
                                }
                                return t
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(t) {
                            return t.includes("option")
                        }).forEach(function(r) {
                            var a, o = e.cleanOptionKey(r);
                            a = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : e.convertType(n[r]), t[o] = a
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
                            a = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: t || document.body,
                                message: e,
                                error: r,
                                icon: a
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
        75486: function(t, e, n) {
            n.r(e), n.d(e, {
                default: function() {
                    return v
                }
            });
            var r = n(10467),
                a = n(64467),
                o = n(23029),
                i = n(92901),
                c = n(50388),
                u = n(53954),
                s = n(15361),
                l = n(54756),
                p = n.n(l),
                f = n(57467),
                d = n(8732);

            function h() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (h = function() {
                    return !!t
                })()
            }
            var v = function(t) {
                function e(t) {
                    var n, r, a, i;
                    return (0, o.A)(this, e), r = this, a = e, i = [t], a = (0, u.A)(a), (n = (0, c.A)(r, h() ? Reflect.construct(a, i || [], (0, u.A)(r).constructor) : a.apply(r, i))).init(), n
                }
                return (0, s.A)(e, t), (0, i.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, a.A)((0, a.A)({}, this.CUSTOM_MESSAGES.TIMESLOT.EXPIRY, this.showExpiryBanner), this.CUSTOM_MESSAGES.TIMESLOT.RESERVE_UPDATE, this.hideExpiryBanner)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            timeslotCheckoutBanner: ".timeslot-checkout-expiry-banner"
                        }
                    }
                }, {
                    key: "init",
                    value: function() {
                        var t = parseInt(this.$options.timeslotNotification, 10),
                            e = parseInt(this.$options.timeslotMinutes, 10),
                            n = parseInt(this.$options.timeslotSeconds, 10);
                        isNaN(e) || isNaN(n) || this.timeslotInterval(e, n, t)
                    }
                }, {
                    key: "timeslotInterval",
                    value: function(t, e, n) {
                        var a = this,
                            o = t,
                            i = !1,
                            c = Date.now() + 1e3 * e,
                            u = function() {
                                var t = (0, r.A)(p().mark(function t() {
                                    var e, r, c;
                                    return p().wrap(function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (!(o <= 0) || i) {
                                                    t.next = 3;
                                                    break
                                                }
                                                if (e = a.$options.timeslotCustomerShipmentUuid, r = a.$options.timeslotReleaseEndpoint, i = !0, !e || !r) {
                                                    t.next = 2;
                                                    break
                                                }
                                                return t.next = 1, (0, d.bE)(r, {
                                                    uuid: e
                                                });
                                            case 1:
                                                c = t.sent, c.data.error || a.EMIT(a.CUSTOM_MESSAGES.TIMESLOT.EXPIRY, {});
                                            case 2:
                                                t.next = 4;
                                                break;
                                            case 3:
                                                o <= n && !i ? (a.EMIT(a.CUSTOM_MESSAGES.TIMESLOT.EXPIRY_NOTIFICATION, {}), a.EMIT(a.CUSTOM_MESSAGES.TIMESLOT.UPDATE_PIE, {
                                                    minutesExpiry: o
                                                })) : i || a.EMIT(a.CUSTOM_MESSAGES.TIMESLOT.UPDATE_PIE, {
                                                    minutesExpiry: o
                                                });
                                            case 4:
                                                o--;
                                            case 5:
                                            case "end":
                                                return t.stop()
                                        }
                                    }, t)
                                }));
                                return function() {
                                    return t.apply(this, arguments)
                                }
                            }();
                        setTimeout(function() {
                            var t;
                            i || (u(), c = Date.now() + 6e4, t = function() {
                                var e = (0, r.A)(p().mark(function e() {
                                    var n;
                                    return p().wrap(function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (!i) {
                                                    e.next = 1;
                                                    break
                                                }
                                                return e.abrupt("return");
                                            case 1:
                                                if (!((n = Date.now()) >= c)) {
                                                    e.next = 3;
                                                    break
                                                }
                                                return e.next = 2, u();
                                            case 2:
                                                c += 6e4;
                                            case 3:
                                                setTimeout(t, c - n);
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }, e)
                                }));
                                return function() {
                                    return e.apply(this, arguments)
                                }
                            }(), t())
                        }, 1e3 * e)
                    }
                }, {
                    key: "showExpiryBanner",
                    value: function() {
                        var t = document.querySelector(this.SELECTORS.timeslotCheckoutBanner);
                        t && (t.classList.remove("d-none"), window.dataLayer && window.dataLayer.push({
                            event: "slot_scaduto"
                        }))
                    }
                }, {
                    key: "hideExpiryBanner",
                    value: function() {
                        var t = document.querySelector(this.SELECTORS.timeslotCheckoutBanner);
                        t && t.classList.add("d-none")
                    }
                }])
            }(f.A)
        }
    }
]);
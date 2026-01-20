"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [681], {
        8732: function(t, e, n) {
            n.d(e, {
                Em: function() {
                    return h
                },
                Jt: function() {
                    return p
                },
                bE: function() {
                    return f
                }
            });
            var a = n(10467),
                r = n(80296),
                i = n(54756),
                o = n.n(i),
                c = n(72505),
                u = n.n(c),
                s = n(79889),
                l = (n(57520), u().create({
                    transformRequest: [function(t, e) {
                        if (e && e.skiptransform) return delete e.skiptransform, t;
                        if (t && Object.entries(t)) {
                            for (var n = new FormData, a = 0, i = Object.entries(t); a < i.length; a++) {
                                var o = (0, r.A)(i[a], 2),
                                    c = o[0],
                                    u = o[1];
                                n.append(c, u)
                            }
                            return n
                        }
                    }]
                })),
                d = function() {
                    var t = (0, a.A)(o().mark(function t(e) {
                        var n, a;
                        return o().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    return n = e.googleRecaptchaAction, a = e.googleRecaptchaClientSide, t.abrupt("return", new Promise(function(t, e) {
                                        window.grecaptcha.ready(function() {
                                            window.grecaptcha.execute(a, {
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
                var t = (0, a.A)(o().mark(function t(e) {
                    var n;
                    return o().wrap(function(t) {
                        for (;;) switch (t.prev = t.next) {
                            case 0:
                                if (!(e.data && e.data.googleRecaptchaAction && e.data.googleRecaptchaClientSide && window.grecaptcha)) {
                                    t.next = 2;
                                    break
                                }
                                return t.next = 1, d(e.data);
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
                        a = "";
                    t.data.isPaybackPopupActive && (a = n.indexOf("?") > -1 ? "&isPaybackPopupActive=true" : "?isPaybackPopupActive=true"), n += a;
                    var r = "";
                    t.data.subscriptionTrialModalNotEligibleAfterLogin && (r = n.indexOf("?") > -1 ? "&subscriptionTrialModalNotEligibleAfterLogin=true" : "?subscriptionTrialModalNotEligibleAfterLogin=true"), location.href = n + r
                }
                if (t.data && t.data.error && (t.config.data instanceof FormData && (t.config.data = Object.fromEntries(t.config.data), t.config.headers["Content-Type"] = "application/json"), e.EMIT("error.".concat(t.data.error), {
                        res: t
                    })), t.data && t.data.notificationPush && t.data.notificationPush.showNotification && e.EMIT("notification:push", t.data.notificationPush), t.data && t.data.pushPromoPre && t.data.pushPromoPre.length > 0) {
                    var i = t.data.pushPromoPre.sort(function(t, e) {
                        return t.rank > e.rank ? -1 : e.rank > t.rank ? 1 : 0
                    });
                    e.EMIT("notification:pushFirstAvailable", {
                        notifications: i
                    })
                }
                return t.data && t.data.pushPromoPost && e.EMIT("notification:pushall", t.data.pushPromoPost), t
            }, function(t) {
                var e, n;
                return null !== (e = t.response) && void 0 !== e && e.data && null !== (n = t.response) && void 0 !== n && null !== (n = n.data) && void 0 !== n && n.redirectUrl && (location.href = t.response.data.redirectUrl), Promise.reject(t)
            });
            u().CancelToken;
            var p = l.get,
                f = l.post,
                h = (l.all, l.spread, l.request)
        },
        57467: function(t, e, n) {
            n.d(e, {
                A: function() {
                    return h
                }
            });
            var a = n(64467),
                r = n(23029),
                i = n(92901),
                o = n(50388),
                c = n(53954),
                u = n(15361),
                s = n(85349),
                l = n.n(s),
                d = n(24263);

            function p(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var a = Object.getOwnPropertySymbols(t);
                    e && (a = a.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), n.push.apply(n, a)
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
                    var n, a, i, u;
                    return (0, r.A)(this, e), a = this, i = e, u = [t], i = (0, c.A)(i), (n = (0, o.A)(a, f() ? Reflect.construct(i, u || [], (0, c.A)(a).constructor) : i.apply(a, u)))._componentElement = t, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, u.A)(e, t), (0, i.A)(e, [{
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
                                    e % 2 ? p(Object(n), !0).forEach(function(e) {
                                        (0, a.A)(t, e, n[e])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : p(Object(n)).forEach(function(e) {
                                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                                    })
                                }
                                return t
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(t) {
                            return t.includes("option")
                        }).forEach(function(a) {
                            var r, i = e.cleanOptionKey(a);
                            r = n[a].includes("{") && n[a].includes("}") ? JSON.parse(n[a].replace(/'/g, '"')) : e.convertType(n[a]), t[i] = r
                        }), (0, d.A)(t)
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
                            a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && t && e && (a ? l().on(n, t, a, function(t) {
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
                            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            r = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: t || document.body,
                                message: e,
                                error: a,
                                icon: r
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
        97114: function(t, e, n) {
            n.r(e), n.d(e, {
                default: function() {
                    return g
                }
            });
            var a = n(10467),
                r = n(64467),
                i = n(23029),
                o = n(92901),
                c = n(50388),
                u = n(53954),
                s = n(15361),
                l = n(54756),
                d = n.n(l),
                p = n(57467),
                f = n(8732),
                h = n(35210);

            function v() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (v = function() {
                    return !!t
                })()
            }
            var g = function(t) {
                function e(t) {
                    var n, a, r, o;
                    return (0, i.A)(this, e), a = this, r = e, o = [t], r = (0, u.A)(r), (n = (0, c.A)(a, v() ? Reflect.construct(r, o || [], (0, u.A)(a).constructor) : r.apply(a, o))).updated = !0, n
                }
                return (0, s.A)(e, t), (0, o.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, r.A)((0, r.A)((0, r.A)((0, r.A)({}, this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.totalPriceUpdate, this.isUpdated), this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.quantityUpdate, this.updateBadgeQty), this.CUSTOM_MESSAGES.PRODUCT_UPDATE_QTY.stateupdate, this.reloadAtZero), this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.loadMinicart, this.getMinicart)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            badge: ".minicartsidebar-badge",
                            totalPrice: ".minicartsidebar-price",
                            unavailableProduct: ".product-unavailable-minicart",
                            product: ".line-item-card",
                            promoBannerLink: ".cart-promo-banner--link",
                            hiddenQuantity: ".hidden-quantity"
                        }
                    }
                }, {
                    key: "initPromoClickEvent",
                    value: function() {
                        this.$el.querySelector(this.SELECTORS.promoBannerLink).addEventListener("click", function(t) {
                            t.preventDefault(), window.dataLayer = window.dataLayer || [], window.dataLayer.push({
                                event: "button_click",
                                area: "minicart",
                                type: "generic_button",
                                action: "button_click",
                                text: "Scopri di più"
                            }), window.location.href = t.target.href
                        })
                    }
                }, {
                    key: "getMinicart",
                    value: function(t) {
                        var e = t.force,
                            n = t.eventSend,
                            a = t.toggleActive;
                        if ((this.updated || e) && this.$options.url) {
                            var r = this.$el.querySelector("#cents-div");
                            this.$el.innerHTML = "", this.loading(this.$el), r && window.cents && h.A.off(this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.subTotalPriceUpdate, this.updateCentsContextData), this.loadMinicart(n, a, r), this.updated = !1
                        }
                    }
                }, {
                    key: "isUpdated",
                    value: function(t) {
                        this.updated = !0;
                        var e = this.$el.querySelector(this.SELECTORS.totalPrice);
                        e && (e.innerHTML = t.value)
                    }
                }, {
                    key: "sendDatalayerEvent",
                    value: function() {
                        if (window.dataLayer) {
                            var t = this.getProducts().join("|"),
                                e = this.$options.customerAuthenticated ? "logged_view" : "unlogged_view";
                            window.dataLayer.push({
                                event: "gaEvent",
                                eventCategory: "Mini-cart",
                                eventAction: e,
                                eventLabel: t,
                                minicart_productND: !!this.$el.querySelectorAll(this.SELECTORS.unavailableProduct)
                            })
                        }
                    }
                }, {
                    key: "updateBadgeQty",
                    value: function(t) {
                        var e = this.$el.querySelector(this.SELECTORS.badge),
                            n = this.$el.querySelector(this.SELECTORS.hiddenQuantity);
                        e && (e.innerHTML = t.value), n && (n.innerHTML = t.value > 1 ? "".concat(t.value, " prodotti nel carrello") : "".concat(t.value, " prodotto nel carrello"))
                    }
                }, {
                    key: "reloadAtZero",
                    value: function(t) {
                        0 == parseInt(t.qty) && (this.loadMinicart(), this.updated = !1)
                    }
                }, {
                    key: "getProducts",
                    value: function() {
                        var t = this.$el.querySelectorAll(this.SELECTORS.product);
                        return Array.from(t).map(function(t) {
                            var e = t.classList.toString().match(/pid-\d*/gm);
                            return e && e.toString().replace("pid-", "")
                        })
                    }
                }, {
                    key: "updateCentsContextData",
                    value: function(t) {
                        var e = parseFloat(parseFloat(100 * t.value, 10).toFixed(2), 10);
                        window.cents("set_context_data", {
                            amount: e,
                            currency: "EUR",
                            language: "it",
                            pageType: "cart"
                        });
                        var n = document.querySelector("#cents-div");
                        if (n) {
                            var a, r = parseInt(n.dataset.optionCartThresholdWidget, 10);
                            t.value && (a = parseFloat(parseFloat(t.value, 10).toFixed(2), 10)), t.value && a && a >= r ? n.classList.remove("d-none") : n.classList.add("d-none")
                        }
                    }
                }, {
                    key: "loadMinicart",
                    value: (n = (0, a.A)(d().mark(function t(e, n, a) {
                        var r, i, o, c, u = this;
                        return d().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    if (t.prev = 0, r = !!a, !n) {
                                        t.next = 2;
                                        break
                                    }
                                    return t.next = 1, (0, f.Jt)(this.$options.url + "?toggleActive=" + n + "&cents=" + r);
                                case 1:
                                    c = t.sent, t.next = 4;
                                    break;
                                case 2:
                                    return t.next = 3, (0, f.Jt)(this.$options.url + "?cents=" + r);
                                case 3:
                                    c = t.sent;
                                case 4:
                                    (i = c.data) && (this.$el.innerHTML = i, a && (o = this.$el.querySelector(".cart-wrapper")) && (window.cents && h.A.on(this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.subTotalPriceUpdate, this.updateCentsContextData), o.appendChild(a))), this.endLoading(this.$el), this.initPromoClickEvent(), e && this.sendDatalayerEvent(), t.next = 6;
                                    break;
                                case 5:
                                    t.prev = 5, t.catch(0).message.indexOf("429") > -1 && setTimeout(function() {
                                        u.loadMinicart()
                                    }, 200);
                                case 6:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this, [
                            [0, 5]
                        ])
                    })), function(t, e, a) {
                        return n.apply(this, arguments)
                    })
                }]);
                var n
            }(p.A)
        }
    }
]);
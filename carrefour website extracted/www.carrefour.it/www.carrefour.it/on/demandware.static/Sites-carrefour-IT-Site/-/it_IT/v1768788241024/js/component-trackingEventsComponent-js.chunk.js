"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [1566], {
        8732: function(t, e, n) {
            n.d(e, {
                Em: function() {
                    return f
                },
                Jt: function() {
                    return p
                },
                bE: function() {
                    return v
                }
            });
            var a = n(10467),
                r = n(80296),
                o = n(54756),
                i = n.n(o),
                c = n(72505),
                s = n.n(c),
                u = n(79889),
                l = (n(57520), s().create({
                    transformRequest: [function(t, e) {
                        if (e && e.skiptransform) return delete e.skiptransform, t;
                        if (t && Object.entries(t)) {
                            for (var n = new FormData, a = 0, o = Object.entries(t); a < o.length; a++) {
                                var i = (0, r.A)(o[a], 2),
                                    c = i[0],
                                    s = i[1];
                                n.append(c, s)
                            }
                            return n
                        }
                    }]
                })),
                d = function() {
                    var t = (0, a.A)(i().mark(function t(e) {
                        var n, a;
                        return i().wrap(function(t) {
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
                var t = (0, a.A)(i().mark(function t(e) {
                    var n;
                    return i().wrap(function(t) {
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
                var e = new u.A;
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
            s().CancelToken;
            var p = l.get,
                v = l.post,
                f = (l.all, l.spread, l.request)
        },
        57467: function(t, e, n) {
            n.d(e, {
                A: function() {
                    return f
                }
            });
            var a = n(64467),
                r = n(23029),
                o = n(92901),
                i = n(50388),
                c = n(53954),
                s = n(15361),
                u = n(85349),
                l = n.n(u),
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

            function v() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (v = function() {
                    return !!t
                })()
            }
            var f = function(t) {
                function e(t) {
                    var n, a, o, s;
                    return (0, r.A)(this, e), a = this, o = e, s = [t], o = (0, c.A)(o), (n = (0, i.A)(a, v() ? Reflect.construct(o, s || [], (0, c.A)(a).constructor) : o.apply(a, s)))._componentElement = t, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, s.A)(e, t), (0, o.A)(e, [{
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
                            var r, o = e.cleanOptionKey(a);
                            r = n[a].includes("{") && n[a].includes("}") ? JSON.parse(n[a].replace(/'/g, '"')) : e.convertType(n[a]), t[o] = r
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
        78965: function(t, e, n) {
            n.r(e), n.d(e, {
                default: function() {
                    return T
                }
            });
            var a = n(10467),
                r = n(80296),
                o = n(64467),
                i = n(23029),
                c = n(92901),
                s = n(50388),
                u = n(53954),
                l = n(15361),
                d = n(54756),
                p = n.n(d),
                v = n(57467),
                f = n(8732),
                g = n(87623);

            function h() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (h = function() {
                    return !!t
                })()
            }
            var T = function(t) {
                function e(t) {
                    var n, a, r, o;
                    return (0, i.A)(this, e), a = this, r = e, o = [t], r = (0, u.A)(r), n = (0, s.A)(a, h() ? Reflect.construct(r, o || [], (0, u.A)(a).constructor) : r.apply(a, o)), setTimeout(function() {
                        n.handleClicks(), n.pushErrorsOnLoad()
                    }, 1500), n
                }
                return (0, l.A)(e, t), (0, c.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)({}, this.CUSTOM_MESSAGES.TRACKING_EVENTS.update, this.pushToDataLayer), this.CUSTOM_MESSAGES.TRACKING_EVENTS.filtersEvent, this.pushFilterEventToDataLayer), this.CUSTOM_MESSAGES.TRACKING_EVENTS.newListingFiltersEvent, this.pushNewListingFiltersToDataLayer), this.CUSTOM_MESSAGES.TRACKING_EVENTS.newListingSortingEvent, this.pushNewListingSortingToDataLayer), this.CUSTOM_MESSAGES.TRACKING_EVENTS.errorEvent, this.pushErrorsOnLoad), this.CUSTOM_MESSAGES.TRACKING_EVENTS.newAddToWishlist, this.pushNewAddToWishlistToDatalayer)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            container: ".trackingEventsContainer",
                            link: ".trackingEventsLink",
                            error: ".trackingErrorsContainer"
                        }
                    }
                }, {
                    key: "pushToDataLayer",
                    value: function(t) {
                        if (window.dataLayer) {
                            var e = {},
                                n = ["eventCategory", "eventAction", "eventLabel", "eventText", "_name"];
                            t.eventCategory ? (e.event = "gaEvent", t.eventCategory && (e.eventCategory = t.eventCategory), t.eventAction && (e.eventAction = t.eventAction), t.eventLabel && (e.eventLabel = t.eventLabel)) : t.eventText ? (e.event = t.eventText, "error" !== t.eventText || window.dataLayer.some(function(e) {
                                return e.error_name === t.errorEventDetail
                            }) ? Object.entries(t).forEach(function(t) {
                                var a = (0, r.A)(t, 2),
                                    o = a[0],
                                    i = a[1];
                                i && !n.includes(o) && (e[o] = i)
                            }) : (e.error_name = t.errorEventDetail || "", e.error_location = t.errorEventLocation || "", e.event_detail = t.errorEventDetail)) : t.element && this.pushToDataLayer({
                                eventCategory: t.element.dataset.optionGaeventcategory ? t.element.dataset.optionGaeventcategory : "",
                                eventAction: t.element.dataset.optionGaeventaction ? t.element.dataset.optionGaeventaction : "",
                                eventLabel: t.element.dataset.optionGaeventlabel ? t.element.dataset.optionGaeventlabel : t.element.innerText,
                                area: t.element.dataset.optionTrackingArea ? t.element.dataset.optionTrackingArea : "",
                                type: t.element.dataset.optionTrackingType ? t.element.dataset.optionTrackingType : "",
                                action: t.element.dataset.optionTrackingAction ? t.element.dataset.optionTrackingAction : "",
                                text: t.element.dataset.optionTrackingText ? t.element.dataset.optionTrackingText : "",
                                eventText: t.element.dataset.optionGaeventtext ? t.element.dataset.optionGaeventtext : "",
                                depth: t.element.dataset.optionTrackingDepth ? t.element.dataset.optionTrackingDepth : ""
                            }), 0 !== Object.keys(e).length && window.dataLayer.push(e)
                        }
                    }
                }, {
                    key: "handleClicks",
                    value: function() {
                        var t = this;
                        document.querySelectorAll(this.SELECTORS.link).forEach(function(e) {
                            e.addEventListener("click", function(e) {
                                var n = "";
                                n = e.currentTarget.classList.contains("add-coupon") ? document.querySelector("#couponCode").value : e.currentTarget.dataset.optionTrackingText ? e.currentTarget.dataset.optionTrackingText : "", t.pushToDataLayer({
                                    eventCategory: e.currentTarget.dataset.optionGaeventcategory ? e.currentTarget.dataset.optionGaeventcategory : "",
                                    eventAction: e.currentTarget.dataset.optionGaeventaction ? e.currentTarget.dataset.optionGaeventaction : "",
                                    eventLabel: e.currentTarget.dataset.optionGaeventlabel ? e.currentTarget.dataset.optionGaeventlabel : e.currentTarget.innerText,
                                    area: e.currentTarget.dataset.optionTrackingArea ? e.currentTarget.dataset.optionTrackingArea : "",
                                    type: e.currentTarget.dataset.optionTrackingType ? e.currentTarget.dataset.optionTrackingType : "",
                                    action: e.currentTarget.dataset.optionTrackingAction ? e.currentTarget.dataset.optionTrackingAction : "",
                                    text: n,
                                    eventText: e.currentTarget.dataset.optionGaeventtext ? e.currentTarget.dataset.optionGaeventtext : "",
                                    depth: e.currentTarget.dataset.optionTrackingDepth ? e.currentTarget.dataset.optionTrackingDepth : ""
                                })
                            })
                        }), document.querySelectorAll(this.SELECTORS.container).forEach(function(e) {
                            e.querySelectorAll("a").forEach(function(n) {
                                n.addEventListener("click.tracking", function(a) {
                                    t.pushToDataLayer({
                                        eventCategory: e.dataset.optionGaeventcategory,
                                        eventAction: e.dataset.optionGaeventaction,
                                        eventLabel: a.currentTarget.dataset.optionGaeventlabel ? a.currentTarget.dataset.optionGaeventlabel : a.currentTarget.innerText,
                                        area: n.parentElement.dataset.optionTrackingArea ? n.parentElement.dataset.optionTrackingArea : "",
                                        type: n.parentElement.dataset.optionTrackingType ? n.parentElement.dataset.optionTrackingType : "",
                                        action: n.parentElement.dataset.optionTrackingAction ? n.parentElement.dataset.optionTrackingAction : "",
                                        text: n.parentElement.dataset.optionTrackingText ? n.parentElement.dataset.optionTrackingText : "",
                                        depth: a.currentTarget.dataset.optionTrackingDepth ? a.currentTarget.dataset.optionTrackingDepth : ""
                                    })
                                })
                            }, e)
                        })
                    }
                }, {
                    key: "trackAfterLoadPage",
                    value: (n = (0, a.A)(p().mark(function t() {
                        var e, n, a, r, o;
                        return p().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    if (e = this._componentElement.dataset.optionProduct, n = this._componentElement.dataset.optionMetatags, !(a = this._componentElement.dataset.optionTrackUrl) || !e) {
                                        t.next = 2;
                                        break
                                    }
                                    return t.next = 1, (0, f.bE)(a, {
                                        product: e,
                                        metatags: n,
                                        skipnotifications: !0
                                    });
                                case 1:
                                    r = t.sent, !(o = r.data).error && o.dataLayerEvents && o.dataLayerEvents.forEach(function(t) {
                                        "pageview" == t.event && (t.page_path = window.location.pathname), window.dataLayer.push(t)
                                    });
                                case 2:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    })), function() {
                        return n.apply(this, arguments)
                    })
                }, {
                    key: "pushFilterEventToDataLayer",
                    value: function(t) {
                        if (window.dataLayer && t.filterType && t.filterValue) {
                            var e = "apply_filter";
                            t.removeFilter && (e = "remove_filter"), window.dataLayer.push({
                                event: e,
                                fylter_type: t.filterType,
                                filter_value: t.filterValue
                            })
                        }
                    }
                }, {
                    key: "pushNewListingFiltersToDataLayer",
                    value: function(t) {
                        window.dataLayer && t.filterType && t.filterValue && t.eventAction && t.eventCategory && window.dataLayer.push({
                            event: "gaEvent",
                            eventCategory: t.eventCategory,
                            eventAction: t.eventAction,
                            eventLabel: t.filterType + "|" + t.filterValue
                        })
                    }
                }, {
                    key: "pushNewListingSortingToDataLayer",
                    value: function(t) {
                        window.dataLayer && t.eventCategory && t.eventAction && t.eventLabel && window.dataLayer.push({
                            event: "gaEvent",
                            eventCategory: t.eventCategory,
                            eventAction: t.eventAction,
                            eventLabel: t.eventLabel
                        })
                    }
                }, {
                    key: "pushErrorsOnLoad",
                    value: function() {
                        var t = this;
                        document.querySelectorAll(this.SELECTORS.error).forEach(function(e) {
                            e.dataset.optionErrorEventDetail && t.pushToDataLayer({
                                eventText: "error",
                                errorEventLocation: e.dataset.optionErrorEventLocation || "",
                                errorEventDetail: e.dataset.optionErrorEventDetail || ""
                            })
                        })
                    }
                }, {
                    key: "pushNewAddToWishlistToDatalayer",
                    value: function(t) {
                        var e = document.querySelector('.product.tile[data-pid="'.concat(t.pid, '"]')) || document.querySelector('.product-main[data-pid="'.concat(t.pid, '"]'));
                        if (e) {
                            var n;
                            n = "wishlist" === (0, g.L)(document.location.pathname, e.dataset.vdglist) ? "le_mie_liste" : e.closest(".editorial-product-card") && e.closest(".editorial-product-card").classList.contains("half-width") ? (0, g.L)(document.location.pathname, e.dataset.vdglist) + "_card_single" : e.closest(".editorial-product-card") && e.closest(".editorial-product-card").classList.contains("full-width") ? (0, g.L)(document.location.pathname, e.dataset.vdglist) + "_card_double" : (0, g.L)(document.location.pathname, e.dataset.vdglist);
                            var a = e.dataset.productJson && JSON.parse(e.dataset.productJson),
                                r = e.dataset.optionProductPromotionInfo && JSON.parse(e.dataset.optionProductPromotionInfo),
                                o = e.dataset.optionProductPrice && JSON.parse(e.dataset.optionProductPrice),
                                i = e.dataset.optionProductBreadcrumbs && JSON.parse(e.dataset.optionProductBreadcrumbs),
                                c = {
                                    item_id: a && a.id,
                                    item_name: a && a.name,
                                    price: o && o.sales && o.sales.value,
                                    discount: o && o.list && o.list.value ? (o.list.value - o.sales.value).toFixed(2) : "",
                                    item_brand: a && a.brand,
                                    item_category: i && i.length > 1 ? i[1].htmlValue : "",
                                    item_category2: i && i.length > 2 ? i[2].htmlValue : "",
                                    item_category3: i && i.length > 3 ? i[3].htmlValue : "",
                                    item_category4: i && i.length > 4 ? i[4].htmlValue : "",
                                    item_list_id: n,
                                    item_list_name: n,
                                    promotion_name: r && r.name ? r.name : "",
                                    quantity: 1,
                                    item_type: a.dimension53
                                };
                            window && window.dataLayer && window.dataLayer.push({
                                event: "add_to_wishlist",
                                ecommerce: {
                                    step: t.step,
                                    items: [c]
                                }
                            })
                        }
                    }
                }]);
                var n
            }(v.A)
        },
        87623: function(t, e, n) {
            function a(t, e) {
                var n = "true" === e ? e : function(t) {
                    var e = t.split("/"),
                        n = "s" === e[1] ? "isSandbox" : e;
                    return 0 === e[1].length ? "homepage" : "p" === e[1] || "dettaglio-prodotto" === e[1] ? "product-page" : function(t) {
                        var e = t.toString();
                        e.endsWith(",") && (e = e.slice("", -1));
                        e.endsWith(".html") && (e = e.slice("", -5));
                        0 == e.indexOf(",") && (e = e.slice(1));
                        return e.replaceAll(",", "/")
                    }(n)
                }(t);
                return n
            }
            n.d(e, {
                L: function() {
                    return a
                }
            })
        }
    }
]);
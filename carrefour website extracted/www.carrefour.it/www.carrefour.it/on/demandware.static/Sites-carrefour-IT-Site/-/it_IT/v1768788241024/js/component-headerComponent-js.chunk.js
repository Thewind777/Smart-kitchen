"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [4821], {
        24750: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return m
                }
            });
            var i = n(64467),
                r = n(23029),
                o = n(92901),
                a = n(50388),
                c = n(53954),
                l = n(15361),
                u = n(57467),
                s = (n(95127), n(62070));

            function d() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (d = function() {
                    return !!e
                })()
            }
            var m = function(e) {
                function t(e) {
                    var n, i, o, l;
                    if ((0, r.A)(this, t), i = this, o = t, l = [e], o = (0, c.A)(o), (n = (0, a.A)(i, d() ? Reflect.construct(o, l || [], (0, c.A)(i).constructor) : o.apply(i, l))).handlePostMessage(), !n.$topPage) {
                        var u = document.createElement("div");
                        u.setAttribute("id", n.SELECTORS.topPage), document.body.insertBefore(u, document.body.childNodes[0])
                    }
                    return n.handleScrollHeader(), n.handleNavClick(), n
                }
                return (0, l.A)(t, e), (0, o.A)(t, [{
                    key: "SELECTORS",
                    get: function() {
                        return {
                            topBar: ".top-bar",
                            topPage: "top-page",
                            main: ".header-main",
                            externalMain: ".header-external",
                            logoutBtn: ".header-my-account-bottom"
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            collapsed: "collapsed"
                        }
                    }
                }, {
                    key: "Messages",
                    get: function() {
                        return (0, i.A)({}, this.CUSTOM_MESSAGES.BREAKPOINTER.BREAKPOINT_CHANGE, this.onBreakpointChange)
                    }
                }, {
                    key: "$topBar",
                    get: function() {
                        return this._topBar || (this._topBar = this.$el.querySelector(this.SELECTORS.topBar)), this._topBar
                    }
                }, {
                    key: "$topPage",
                    get: function() {
                        return this._topPage || (this._topPage = document.querySelector("#".concat(this.SELECTORS.topPage))), this._topPage
                    }
                }, {
                    key: "$main",
                    get: function() {
                        return this._main || (this._main = this.$el.querySelector(this.SELECTORS.main)), null == this._main && (this._main = this.$el.querySelector(this.SELECTORS.externalMain)), this._main
                    }
                }, {
                    key: "handlePostMessage",
                    value: function() {
                        var e = document.querySelector(this.SELECTORS.logoutBtn);
                        null == e || e.addEventListener("click", function(e) {
                            var t;
                            null === (t = window.webkit) || void 0 === t || t.messageHandlers.cordova_iab.postMessage(JSON.stringify({
                                action: "LOGOUT"
                            }))
                        })
                    }
                }, {
                    key: "checkHeaderPosition",
                    value: function(e) {
                        this.$el.classList[e ? "add" : "remove"](this.CLASSES.collapsed)
                    }
                }, {
                    key: "handleScrollHeader",
                    value: function() {
                        var e = this;
                        this.$topPage && (this.setTopBarHeight(), new IntersectionObserver(function(t) {
                            e.checkHeaderPosition(0 === t[0].intersectionRatio)
                        }, {
                            threshold: [0, 1]
                        }).observe(this.$topPage))
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function() {
                        this.setTopBarHeight()
                    }
                }, {
                    key: "setTopBarHeight",
                    value: function() {
                        this.$el.style.setProperty("--top-bar-height", "".concat(this.$topBar ? -1 * this.$topBar.offsetHeight : 0, "px"))
                    }
                }, {
                    key: "handleNavClick",
                    value: function() {
                        var e = this;
                        (Array.from(this.$main.querySelector(".container").children).forEach(function(t) {
                            var n = "right_section";
                            t.className.includes("header-logo") ? n = "logo" : t.className.includes("navigation") && (n = "main_nav"), Array.from(t.getElementsByTagName("a")).forEach(function(t) {
                                e.$on("click", function(e) {
                                    var i = e.target.parentElement.classList.contains("payback__text") || e.target.parentElement.classList.contains("payback__badge"),
                                        r = {
                                            area: "header",
                                            type: i ? "generic_button" : n,
                                            url: t.href ? t.href : "",
                                            text: t.innerText ? t.innerText : "",
                                            isPayback: i
                                        };
                                    (0, s.Qw)(r)
                                }, t)
                            })
                        }), this.$topBar) && Array.from(this.$topBar.getElementsByTagName("a")).forEach(function(t) {
                            e.$on("click", function(e) {
                                var n = {
                                    area: "top_bar",
                                    type: "portal",
                                    url: t.href ? t.href : "",
                                    text: t.innerText ? t.innerText : ""
                                };
                                (0, s.Qw)(n)
                            }, t)
                        })
                    }
                }])
            }(u.A)
        },
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return f
                }
            });
            var i = n(64467),
                r = n(23029),
                o = n(92901),
                a = n(50388),
                c = n(53954),
                l = n(15361),
                u = n(85349),
                s = n.n(u),
                d = n(24263);

            function m(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    t && (i = i.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, i)
                }
                return n
            }

            function p() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (p = function() {
                    return !!e
                })()
            }
            var f = function(e) {
                function t(e) {
                    var n, i, o, l;
                    return (0, r.A)(this, t), i = this, o = t, l = [e], o = (0, c.A)(o), (n = (0, a.A)(i, p() ? Reflect.construct(o, l || [], (0, c.A)(i).constructor) : o.apply(i, l)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, l.A)(t, e), (0, o.A)(t, [{
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
                                    t % 2 ? m(Object(n), !0).forEach(function(t) {
                                        (0, i.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : m(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(i) {
                            var r, o = t.cleanOptionKey(i);
                            r = n[i].includes("{") && n[i].includes("}") ? JSON.parse(n[i].replace(/'/g, '"')) : t.convertType(n[i]), e[o] = r
                        }), (0, d.A)(e)
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
                            i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && e && t && (i ? s().on(n, e, i, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : s().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        s().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        s().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        s().fire(t, e)
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
                            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            r = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: i,
                                icon: r
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
        62070: function(e, t, n) {
            n.d(t, {
                GB: function() {
                    return c
                },
                Gf: function() {
                    return d
                },
                LT: function() {
                    return s
                },
                Of: function() {
                    return a
                },
                Qw: function() {
                    return u
                },
                UQ: function() {
                    return l
                },
                if: function() {
                    return _
                },
                sb: function() {
                    return o
                },
                yu: function() {
                    return r
                }
            });
            var i = n(87623),
                r = function(e, t, n, i, r) {
                    if (e && t && window.dataLayer) {
                        var o = {
                            event: e,
                            ecommerce: {
                                items: [{
                                    item_id: t.id,
                                    item_name: t.name,
                                    item_brand: t.brand,
                                    promotion_name: r && r.name ? r.name : "",
                                    quantity: t.quantity || 1,
                                    item_type: t.dimension53
                                }]
                            }
                        };
                        i && p(i, o.ecommerce.items[0]), n && f(n, o.ecommerce.items[0]), h(o.ecommerce.items[0]), t.cardSize && _(t.cardSize, o.ecommerce.items[0]), window.dataLayer.push(o)
                    }
                },
                o = function(e, t, n) {
                    window.dataLayer && window.dataLayer.push({
                        event: "product click",
                        event_category: "ecommerce",
                        event_action: "Product Click",
                        event_label: e.product_name,
                        ecommerce: {
                            currencyCode: t,
                            click: {
                                actionField: {
                                    list: n
                                },
                                products: [e]
                            }
                        }
                    })
                },
                a = function(e, t, n) {
                    if (window.dataLayer) {
                        var i = {
                            event: "select_item",
                            ecommerce: {
                                items: [{
                                    item_id: e.id,
                                    item_name: e.productName,
                                    promotion_name: e.promotionInfo && e.promotionInfo.name ? e.promotionInfo.name : "",
                                    item_brand: e.brand,
                                    quantity: e.qtyincart,
                                    index: n,
                                    item_type: e.itemType
                                }]
                            }
                        };
                        e.cardSize && (i.ecommerce.items[0].item_list_id = e.cardSize), t && p(t, i.ecommerce.items[0]), e.price && f(e.price, i.ecommerce.items[0]), h(i.ecommerce.items[0]), window.dataLayer.push(i)
                    }
                },
                c = function(e) {
                    if (window.dataLayer && (e.promotionInfo && e.promotionInfo.name || e.price && e.price.list && e.price.list)) {
                        var t = {
                            event: "select_promotion",
                            ecommerce: {
                                items: [{
                                    item_id: e.id,
                                    item_name: e.productName,
                                    promotion_name: e.promotionInfo && e.promotionInfo.name ? e.promotionInfo.name : "",
                                    promotion_id: e.promotionInfo && e.promotionInfo.id ? e.promotionInfo.id : e.promotionInfo.name ? e.promotionInfo.name : "",
                                    creative_name: "product card",
                                    location_id: "product listing",
                                    price: e.price.sales.value,
                                    item_type: e.itemType
                                }]
                            }
                        };
                        window.dataLayer.push(t)
                    }
                },
                l = function(e, t) {
                    window.dataLayer && window.dataLayer.push({
                        event: "add_shipping_info",
                        ecommerce: {
                            shipping_tier: m(t),
                            items: e.map(function(e) {
                                var t = e.breadcrumbs,
                                    n = {
                                        item_id: e.id,
                                        item_name: e.productName,
                                        item_brand: e.brand,
                                        quantity: e.qtyincart,
                                        item_type: e.itemType
                                    };
                                return p(t, n), f(e.price, n), n
                            })
                        }
                    })
                },
                u = function(e) {
                    if (window.dataLayer) {
                        var t = !e.url || e.url.includes("/s/carrefour-IT/") || e.url.includes("carrefour.it/");
                        window.dataLayer.push({
                            event: e.isPayback ? "button_click" : "nav_click",
                            area: e.area,
                            type: e.type,
                            action: t ? "redirect_internal" : "outbound",
                            depth: "level_0",
                            text: e.text
                        })
                    }
                },
                s = function(e, t) {
                    window.dataLayer && window.dataLayer.push({
                        event: "error",
                        error_name: t,
                        error_location: e,
                        event_detail: t
                    })
                },
                d = function(e, t) {
                    if (window.dataLayer) {
                        var n = [];
                        e && e.detail && e.detail.errors && (n = e.detail.errors.map(function(e) {
                            return e.id
                        })), window.dataLayer.push({
                            event: "error",
                            error_name: "form_filed_error",
                            error_location: t || (e && e.target && e.target.id ? e.target.id : "form"),
                            event_detail: n.join("|")
                        })
                    }
                },
                m = function(e) {
                    switch (e) {
                        case "pickup_in_store":
                            return "click_and_collect";
                        case "drive":
                            return "click_and_collect_drive";
                        case "deliveryExpress":
                            return "home_delivery_same_day";
                        case "delivery":
                        case "deliverySatellite":
                            return "home_delivery_next_day";
                        default:
                            return null
                    }
                },
                p = function(e, t) {
                    t.item_category = e && e.length > 1 ? e[1].htmlValue.replace(/`/g, "'") : "", t.item_category2 = e && e.length > 2 ? e[2].htmlValue.replace(/`/g, "'") : "", t.item_category3 = e && e.length > 3 ? e[3].htmlValue.replace(/`/g, "'") : "", t.item_category4 = e && e.length > 4 ? e[4].htmlValue.replace(/`/g, "'") : ""
                },
                f = function(e, t) {
                    t.discount = e.list && e.list.value ? (e.list.value - e.sales.value).toFixed(2) : "", t.price = e.sales.value
                },
                h = function(e) {
                    var t;
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, i.L)(document.location.pathname, !1) + e.item_list_id : (0, i.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                _ = function(e, t) {
                    var n, r = (0, i.L)(document.location.pathname, !1);
                    if (n = "Half Width" === e ? r + "_card_single" : r + "_card_double", !t) return n;
                    t.item_list_id = n, t.item_list_name = n
                }
        },
        87623: function(e, t, n) {
            function i(e, t) {
                var n = "true" === t ? t : function(e) {
                    var t = e.split("/"),
                        n = "s" === t[1] ? "isSandbox" : t;
                    return 0 === t[1].length ? "homepage" : "p" === t[1] || "dettaglio-prodotto" === t[1] ? "product-page" : function(e) {
                        var t = e.toString();
                        t.endsWith(",") && (t = t.slice("", -1));
                        t.endsWith(".html") && (t = t.slice("", -5));
                        0 == t.indexOf(",") && (t = t.slice(1));
                        return t.replaceAll(",", "/")
                    }(n)
                }(e);
                return n
            }
            n.d(t, {
                L: function() {
                    return i
                }
            })
        }
    }
]);
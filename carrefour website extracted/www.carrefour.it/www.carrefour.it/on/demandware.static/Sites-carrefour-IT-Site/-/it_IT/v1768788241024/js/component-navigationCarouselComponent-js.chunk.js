"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [4662], {
        23914: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return y
                }
            });
            var i = n(64467),
                r = n(23029),
                o = n(92901),
                a = n(50388),
                c = n(53954),
                u = n(90991),
                l = n(15361),
                s = n(63241),
                m = (0, n(24263).A)({
                    isActiveInPages: ["Home-Show", "Search-Show", "Product-Show", "Search-ShowInternal"],
                    isHomePage: ["Home-Show"],
                    isPLP: ["Search-Show", "Search-ShowInternal"],
                    isPDP: ["Product-Show"]
                }),
                d = n(62070);

            function p(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    t && (i = i.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, i)
                }
                return n
            }

            function f(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? p(Object(n), !0).forEach(function(t) {
                        (0, i.A)(e, t, n[t])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : p(Object(n)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    })
                }
                return e
            }

            function _() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (_ = function() {
                    return !!e
                })()
            }

            function h(e, t, n, i) {
                var r = (0, u.A)((0, c.A)(1 & i ? e.prototype : e), t, n);
                return 2 & i && "function" == typeof r ? function(e) {
                    return r.apply(n, e)
                } : r
            }
            var y = function(e) {
                function t(e) {
                    var n, i, o, u, l;
                    return (0, r.A)(this, t), o = this, u = t, l = [e], u = (0, c.A)(u), (i = (0, a.A)(o, _() ? Reflect.construct(u, l || [], (0, c.A)(o).constructor) : u.apply(o, l))).pageAction = (null === (n = document.querySelector(".page")) || void 0 === n || null === (n = n.dataset) || void 0 === n ? void 0 : n.action) || "", i.setState({
                        isMount: !1
                    }), i.lazyMount(), i.handleClick(), i
                }
                return (0, l.A)(t, e), (0, o.A)(t, [{
                    key: "SELECTORS",
                    get: function() {
                        return f(f({}, h(t, "SELECTORS", this, 1)), {}, {
                            secondLevelNavigation: "#secondLevelNavigation",
                            selectedFirstLevelCategory: "a.category.selected",
                            secondLevelCategoryCardLink: ".card a"
                        })
                    }
                }, {
                    key: "Messages",
                    get: function() {
                        return (0, i.A)({}, this.CUSTOM_MESSAGES.BREAKPOINTER.BREAKPOINT_CHANGE, this.onBreakpointChange)
                    }
                }, {
                    key: "navigationContainer",
                    get: function() {
                        return this._navigationContainer || (this._navigationContainer = document.querySelector(this.SELECTORS.secondLevelNavigation)), this._navigationContainer
                    }
                }, {
                    key: "isSubhome",
                    value: function() {
                        var e;
                        return null === (e = this.navigationContainer) || void 0 === e ? void 0 : e.classList.contains("sub-home-navigation")
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {
                        e.breakPoint;
                        !this.isMountable() && this.isMount ? this.destroy() : this.lazyMount()
                    }
                }, {
                    key: "isMountable",
                    value: function() {
                        return (m.isPDP.includes(this.pageAction) || this.isSubhome()) && window.isDesktop && window.isDesktop() || m.isPLP.includes(this.pageAction) && !this.isSubhome()
                    }
                }, {
                    key: "lazyMount",
                    value: function() {
                        this.isMountable() && (this.isMount || this.mount(this.$el, this.$options))
                    }
                }, {
                    key: "handleClick",
                    value: function() {
                        var e = this;
                        Array.from(this.$el.getElementsByTagName("a")).forEach(function(t) {
                            e.$on("click", function(e) {
                                var n = {
                                    area: "header",
                                    type: "main_nav",
                                    url: t.href ? t.href : "",
                                    text: t.innerText ? t.innerText : ""
                                };
                                (0, d.Qw)(n)
                            }, t)
                        })
                    }
                }])
            }(s.A)
        },
        62070: function(e, t, n) {
            n.d(t, {
                GB: function() {
                    return c
                },
                Gf: function() {
                    return m
                },
                LT: function() {
                    return s
                },
                Of: function() {
                    return a
                },
                Qw: function() {
                    return l
                },
                UQ: function() {
                    return u
                },
                if: function() {
                    return h
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
                        i && p(i, o.ecommerce.items[0]), n && f(n, o.ecommerce.items[0]), _(o.ecommerce.items[0]), t.cardSize && h(t.cardSize, o.ecommerce.items[0]), window.dataLayer.push(o)
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
                        e.cardSize && (i.ecommerce.items[0].item_list_id = e.cardSize), t && p(t, i.ecommerce.items[0]), e.price && f(e.price, i.ecommerce.items[0]), _(i.ecommerce.items[0]), window.dataLayer.push(i)
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
                u = function(e, t) {
                    window.dataLayer && window.dataLayer.push({
                        event: "add_shipping_info",
                        ecommerce: {
                            shipping_tier: d(t),
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
                l = function(e) {
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
                m = function(e, t) {
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
                d = function(e) {
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
                _ = function(e) {
                    var t;
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, i.L)(document.location.pathname, !1) + e.item_list_id : (0, i.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                h = function(e, t) {
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
        },
        90991: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return r
                }
            });
            var i = n(53954);

            function r() {
                return r = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, n) {
                    var r = function(e, t) {
                        for (; !{}.hasOwnProperty.call(e, t) && null !== (e = (0, i.A)(e)););
                        return e
                    }(e, t);
                    if (r) {
                        var o = Object.getOwnPropertyDescriptor(r, t);
                        return o.get ? o.get.call(arguments.length < 3 ? e : n) : o.value
                    }
                }, r.apply(null, arguments)
            }
        }
    }
]);
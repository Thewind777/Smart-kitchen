"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [4732], {
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return p
                }
            });
            var r = n(64467),
                i = n(23029),
                o = n(92901),
                a = n(50388),
                c = n(53954),
                u = n(15361),
                l = n(85349),
                s = n.n(l),
                m = n(24263);

            function d(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, r)
                }
                return n
            }

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
                    var n, r, o, u;
                    return (0, i.A)(this, t), r = this, o = t, u = [e], o = (0, c.A)(o), (n = (0, a.A)(r, f() ? Reflect.construct(o, u || [], (0, c.A)(r).constructor) : o.apply(r, u)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, u.A)(t, e), (0, o.A)(t, [{
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
                                    t % 2 ? d(Object(n), !0).forEach(function(t) {
                                        (0, r.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : d(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(r) {
                            var i, o = t.cleanOptionKey(r);
                            i = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : t.convertType(n[r]), e[o] = i
                        }), (0, m.A)(e)
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
                            r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && e && t && (r ? s().on(n, e, r, function(e) {
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
                            r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            i = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: r,
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
                    return v
                },
                sb: function() {
                    return o
                },
                yu: function() {
                    return i
                }
            });
            var r = n(87623),
                i = function(e, t, n, r, i) {
                    if (e && t && window.dataLayer) {
                        var o = {
                            event: e,
                            ecommerce: {
                                items: [{
                                    item_id: t.id,
                                    item_name: t.name,
                                    item_brand: t.brand,
                                    promotion_name: i && i.name ? i.name : "",
                                    quantity: t.quantity || 1,
                                    item_type: t.dimension53
                                }]
                            }
                        };
                        r && f(r, o.ecommerce.items[0]), n && p(n, o.ecommerce.items[0]), _(o.ecommerce.items[0]), t.cardSize && v(t.cardSize, o.ecommerce.items[0]), window.dataLayer.push(o)
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
                        var r = {
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
                        e.cardSize && (r.ecommerce.items[0].item_list_id = e.cardSize), t && f(t, r.ecommerce.items[0]), e.price && p(e.price, r.ecommerce.items[0]), _(r.ecommerce.items[0]), window.dataLayer.push(r)
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
                                return f(t, n), p(e.price, n), n
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
                f = function(e, t) {
                    t.item_category = e && e.length > 1 ? e[1].htmlValue.replace(/`/g, "'") : "", t.item_category2 = e && e.length > 2 ? e[2].htmlValue.replace(/`/g, "'") : "", t.item_category3 = e && e.length > 3 ? e[3].htmlValue.replace(/`/g, "'") : "", t.item_category4 = e && e.length > 4 ? e[4].htmlValue.replace(/`/g, "'") : ""
                },
                p = function(e, t) {
                    t.discount = e.list && e.list.value ? (e.list.value - e.sales.value).toFixed(2) : "", t.price = e.sales.value
                },
                _ = function(e) {
                    var t;
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, r.L)(document.location.pathname, !1) + e.item_list_id : (0, r.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                v = function(e, t) {
                    var n, i = (0, r.L)(document.location.pathname, !1);
                    if (n = "Half Width" === e ? i + "_card_single" : i + "_card_double", !t) return n;
                    t.item_list_id = n, t.item_list_name = n
                }
        },
        87623: function(e, t, n) {
            function r(e, t) {
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
                    return r
                }
            })
        },
        97655: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return m
                }
            });
            var r = n(23029),
                i = n(92901),
                o = n(50388),
                a = n(53954),
                c = n(15361),
                u = n(57467),
                l = n(62070);

            function s() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (s = function() {
                    return !!e
                })()
            }
            var m = function(e) {
                function t(e) {
                    var n, i, c, u;
                    return (0, r.A)(this, t), i = this, c = t, u = [e], c = (0, a.A)(c), (n = (0, o.A)(i, s() ? Reflect.construct(c, u || [], (0, a.A)(i).constructor) : c.apply(i, u))).handleClick(), n
                }
                return (0, c.A)(t, e), (0, i.A)(t, [{
                    key: "reviewsWidget",
                    get: function() {
                        return this._reviewsWidget || (this._reviewsWidget = document.querySelector(".footer-widget-reviews a")), this._reviewsWidget
                    }
                }, {
                    key: "handleClick",
                    value: function() {
                        var e = this;
                        Array.from(this.$el.querySelectorAll(".footer-customer-care-item")).forEach(function(t) {
                            e.$on("mouseup", function(e) {
                                var n = {
                                    area: "footer",
                                    type: "customer_care",
                                    url: t.href ? t.href : "",
                                    text: t.innerText ? t.innerText : ""
                                };
                                (0, l.Qw)(n)
                            }, t)
                        }), this.reviewsWidget && this.reviewsWidget.addEventListener("click", function(e) {
                            var t = {
                                area: "footer",
                                type: "customer_care",
                                url: e.currentTarget.href ? e.currentTarget.href : "",
                                text: e.currentTarget.firstChild.alt
                            };
                            (0, l.Qw)(t)
                        })
                    }
                }])
            }(u.A)
        }
    }
]);
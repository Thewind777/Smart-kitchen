"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [2081], {
        56450: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return m
                }
            });
            var i = n(23029),
                o = n(92901),
                r = n(50388),
                a = n(53954),
                c = n(15361),
                l = n(57467),
                s = n(62070),
                u = n(27848),
                d = n(87623);

            function p() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (p = function() {
                    return !!e
                })()
            }
            var m = function(e) {
                function t(e) {
                    var n, o, c, l;
                    return (0, i.A)(this, t), o = this, c = t, l = [e], c = (0, a.A)(c), (n = (0, r.A)(o, p() ? Reflect.construct(c, l || [], (0, a.A)(o).constructor) : c.apply(o, l))).handleClick(), n.handlePromoCatClick(), n.handleChangePromoPushTitleInAvancassa(), n
                }
                return (0, c.A)(t, e), (0, o.A)(t, [{
                    key: "handleChangePromoPushTitleInAvancassa",
                    value: function() {
                        var e = this.$el.querySelector("span[data-option-pricebook-description]"),
                            t = this.$options.avancassa && !0 === this.$options.avancassa;
                        if (e && t) {
                            var n, i, o = null === (n = this.$el.closest(".promo-push-cart")) || void 0 === n ? void 0 : n.querySelector(".promo-label"),
                                r = null == o ? void 0 : o.getAttribute("data-option-promo-bundle");
                            if (o && "true" === r) null === (i = o.querySelector("span")) || void 0 === i || i.classList.add("d-none"), o.appendChild(e)
                        }
                    }
                }, {
                    key: "isVolantiniTile",
                    value: function() {
                        return this.$el.classList.contains("flyer-tile")
                    }
                }, {
                    key: "parsePathName",
                    value: function(e) {
                        var t = e.toString();
                        return t.endsWith(",") && (t = t.slice("", -1)), t.endsWith(".html") && (t = t.slice("", -5)), 0 == t.indexOf(",") && (t = t.slice(1)), t.replaceAll(",", "/")
                    }
                }, {
                    key: "handleClick",
                    value: function() {
                        var e = this;
                        this.$el.addEventListener("click", function(t) {
                            var n;
                            if ((e.$options.iscategory || e.isVolantiniTile()) && window.location.hash.indexOf("position") > -1) {
                                var i = window.location.hash,
                                    o = window.location.href,
                                    r = i.split("position=")[1],
                                    a = i.replace(r, e.getPosition(e.$el)),
                                    c = o.replace(i, a);
                                window.history.replaceState("", "", c)
                            }
                            if (window.dataLayer) {
                                var l, u = null === (n = e.$el.querySelector(".add-to-cart")) || void 0 === n ? void 0 : n.dataset.currencyCode,
                                    p = e.$el.closest(".product.tile");
                                if (p && (l = JSON.parse(p.dataset.productJson)), l) {
                                    var m, f, h = (0, d.L)(document.location.pathname, e.$options.vdglist);
                                    e.$el.closest(".zero-search-results") && (h = "searchresult_0"), null !== (m = e.$el.closest(".editorial-product-card")) && void 0 !== m && m.classList.contains("half-width") ? h += "_card_single" : null !== (f = e.$el.closest(".editorial-product-card")) && void 0 !== f && f.classList.contains("full-width") && (h += "_card_double"), (0, s.sb)(l, u, h)
                                }
                                if (e.isVolantiniTile()) e.EMIT(e.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                                    eventCategory: "Volantini",
                                    eventAction: "Products",
                                    eventLabel: "Open"
                                });
                                else document.activeElement.className.match("tooltip") || t.target.className.match("tooltip") || t.target.className.match("discount") || e.triggerSelectItemEvent()
                            }
                        })
                    }
                }, {
                    key: "getPosition",
                    value: function(e) {
                        for (var t = 0; e;) t += e.offsetTop, e = e.offsetParent;
                        return this.compensate(t)
                    }
                }, {
                    key: "compensate",
                    value: function(e) {
                        var t = 0;
                        return document.querySelector(".information-strip.is-visible") && (t += 50), (0, u.YW)(null, "md") ? e - 170 - t : document.body.classList.contains("push-app-in") ? e - 180 - t : e - 130 - t
                    }
                }, {
                    key: "getLastSegment",
                    value: function(e) {
                        if (e) {
                            var t = e.split("/").filter(Boolean).pop();
                            return t.split(".").slice(0, -1).join(".") || t
                        }
                        return ""
                    }
                }, {
                    key: "handlePromoCatClick",
                    value: function() {
                        var e = this,
                            t = this.$el.querySelector(".promocat");
                        t && this.$on("click.link", function(t) {
                            t.currentTarget.dataset.optionGaeventcategory && t.currentTarget.dataset.optionGaeventaction && e.EMIT(e.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                                eventCategory: t.currentTarget.dataset.optionGaeventcategory,
                                eventAction: t.currentTarget.dataset.optionGaeventaction,
                                eventLabel: t.currentTarget.dataset.optionGaeventlabel
                            })
                        }, t)
                    }
                }, {
                    key: "triggerSelectItemEvent",
                    value: function() {
                        var e, t = 0;
                        this.$el.querySelector(".add-to-cart.show-quantity") && (t = this.$el.querySelector(".js-itemquantity").value);
                        var n = this.$el.closest(".editorial-product-card");
                        n && n.classList.contains("half-width") ? e = "_card_single" : n && n.classList.contains("full-width") && (e = "_card_double");
                        var i = {
                                id: JSON.parse(this.$el.closest(".product.tile").dataset.productJson).id,
                                productName: JSON.parse(this.$el.closest(".product.tile").dataset.productJson).name,
                                promotionInfo: this.$options.productPromotionInfo,
                                price: this.$options.productPrice,
                                qtyincart: t,
                                brand: JSON.parse(this.$el.closest(".product.tile").dataset.productJson).brand,
                                itemType: JSON.parse(this.$el.closest(".product.tile").dataset.productJson).dimension53,
                                cardSize: e
                            },
                            o = this.$el.closest(".product-grid") ? this.$el.closest(".product-grid") : this.$el.closest(".glide__slides") ? this.$el.closest(".glide__slides") : this.$el.closest(".editorial-product-card") ? this.$el.closest(".editorial-product-card") : this.$el.closest(".js-tile-container");
                        if (o) {
                            var r = Array.from(o.querySelectorAll(".product.tile")).findIndex(function(e) {
                                return e.dataset && e.dataset.productJson && JSON.parse(e.dataset.productJson).id === i.id
                            });
                            (0, s.Of)(i, this.$options.productBreadcrumbs, r)
                        }(0, s.GB)(i)
                    }
                }])
            }(l.A)
        },
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return f
                }
            });
            var i = n(64467),
                o = n(23029),
                r = n(92901),
                a = n(50388),
                c = n(53954),
                l = n(15361),
                s = n(85349),
                u = n.n(s),
                d = n(24263);

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

            function m() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (m = function() {
                    return !!e
                })()
            }
            var f = function(e) {
                function t(e) {
                    var n, i, r, l;
                    return (0, o.A)(this, t), i = this, r = t, l = [e], r = (0, c.A)(r), (n = (0, a.A)(i, m() ? Reflect.construct(r, l || [], (0, c.A)(i).constructor) : r.apply(i, l)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, l.A)(t, e), (0, r.A)(t, [{
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
                                        (0, i.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : p(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(i) {
                            var o, r = t.cleanOptionKey(i);
                            o = n[i].includes("{") && n[i].includes("}") ? JSON.parse(n[i].replace(/'/g, '"')) : t.convertType(n[i]), e[r] = o
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
                        n && e && t && (i ? u().on(n, e, i, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : u().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        u().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        u().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        u().fire(t, e)
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
                            o = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: i,
                                icon: o
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
                    return u
                },
                Of: function() {
                    return a
                },
                Qw: function() {
                    return s
                },
                UQ: function() {
                    return l
                },
                if: function() {
                    return v
                },
                sb: function() {
                    return r
                },
                yu: function() {
                    return o
                }
            });
            var i = n(87623),
                o = function(e, t, n, i, o) {
                    if (e && t && window.dataLayer) {
                        var r = {
                            event: e,
                            ecommerce: {
                                items: [{
                                    item_id: t.id,
                                    item_name: t.name,
                                    item_brand: t.brand,
                                    promotion_name: o && o.name ? o.name : "",
                                    quantity: t.quantity || 1,
                                    item_type: t.dimension53
                                }]
                            }
                        };
                        i && m(i, r.ecommerce.items[0]), n && f(n, r.ecommerce.items[0]), h(r.ecommerce.items[0]), t.cardSize && v(t.cardSize, r.ecommerce.items[0]), window.dataLayer.push(r)
                    }
                },
                r = function(e, t, n) {
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
                        e.cardSize && (i.ecommerce.items[0].item_list_id = e.cardSize), t && m(t, i.ecommerce.items[0]), e.price && f(e.price, i.ecommerce.items[0]), h(i.ecommerce.items[0]), window.dataLayer.push(i)
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
                            shipping_tier: p(t),
                            items: e.map(function(e) {
                                var t = e.breadcrumbs,
                                    n = {
                                        item_id: e.id,
                                        item_name: e.productName,
                                        item_brand: e.brand,
                                        quantity: e.qtyincart,
                                        item_type: e.itemType
                                    };
                                return m(t, n), f(e.price, n), n
                            })
                        }
                    })
                },
                s = function(e) {
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
                u = function(e, t) {
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
                p = function(e) {
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
                m = function(e, t) {
                    t.item_category = e && e.length > 1 ? e[1].htmlValue.replace(/`/g, "'") : "", t.item_category2 = e && e.length > 2 ? e[2].htmlValue.replace(/`/g, "'") : "", t.item_category3 = e && e.length > 3 ? e[3].htmlValue.replace(/`/g, "'") : "", t.item_category4 = e && e.length > 4 ? e[4].htmlValue.replace(/`/g, "'") : ""
                },
                f = function(e, t) {
                    t.discount = e.list && e.list.value ? (e.list.value - e.sales.value).toFixed(2) : "", t.price = e.sales.value
                },
                h = function(e) {
                    var t;
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, i.L)(document.location.pathname, !1) + e.item_list_id : (0, i.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                v = function(e, t) {
                    var n, o = (0, i.L)(document.location.pathname, !1);
                    if (n = "Half Width" === e ? o + "_card_single" : o + "_card_double", !t) return n;
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
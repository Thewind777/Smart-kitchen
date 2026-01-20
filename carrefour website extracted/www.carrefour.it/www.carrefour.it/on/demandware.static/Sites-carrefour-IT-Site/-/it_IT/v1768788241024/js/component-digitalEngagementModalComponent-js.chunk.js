"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [4806], {
        61829: function(e, t, a) {
            a.r(t), a.d(t, {
                default: function() {
                    return f
                }
            });
            var n = a(10467),
                i = a(23029),
                r = a(92901),
                o = a(50388),
                c = a(53954),
                l = a(15361),
                u = a(54756),
                d = a.n(u),
                m = a(43468),
                s = a(8732),
                p = a(62070);

            function _() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (_ = function() {
                    return !!e
                })()
            }
            var f = function(e) {
                function t(e) {
                    var a, n, r, l;
                    return (0, i.A)(this, t), n = this, r = t, l = [e], r = (0, c.A)(r), (a = (0, o.A)(n, _() ? Reflect.construct(r, l || [], (0, c.A)(n).constructor) : r.apply(n, l))).afterOpen = function() {
                        a.getAgentAvailability(), a.handleChatModalObserver();
                        var e = {
                            area: "top_bar",
                            type: "portal",
                            url: "",
                            text: a.$el.firstElementChild.innerText
                        };
                        (0, p.Qw)(e)
                    }, a
                }
                return (0, l.A)(t, e), (0, r.A)(t, [{
                    key: "SELECTORS",
                    get: function() {
                        return {
                            wrapper: ".js-deWrapper",
                            maiaChat: "maia-chat",
                            chatModal: ".dockableContainer.showDockableContainer",
                            chatModalID: "idChatModal",
                            chatButton: "#vivocha-button-id"
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            agentsAvailable: "agents-available",
                            agentsNotAvailable: "agents-not-available"
                        }
                    }
                }, {
                    key: "getAgentAvailability",
                    value: (a = (0, n.A)(d().mark(function e() {
                        var t, a, n, i, r;
                        return d().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (t = document.querySelector(this.SELECTORS.wrapper), a = null == t ? void 0 : t.dataset.optionEndpoint, (n = null == t ? void 0 : t.querySelector(this.SELECTORS.chatButton)) && (n.ariaHasPopup = "dialog", n.ariaExpanded = !1), e.prev = 1, !a) {
                                        e.next = 3;
                                        break
                                    }
                                    return e.next = 2, (0, s.Jt)(a);
                                case 2:
                                    r = e.sent, e.next = 4;
                                    break;
                                case 3:
                                    r = null;
                                case 4:
                                    null != (i = r.data) && i.deEnabled ? this.checkMaiaStatus() : t.classList.add(this.CLASSES.agentsNotAvailable), e.next = 6;
                                    break;
                                case 5:
                                    e.prev = 5, e.catch(1), t.classList.add(this.CLASSES.agentsNotAvailable);
                                case 6:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this, [
                            [1, 5]
                        ])
                    })), function() {
                        return a.apply(this, arguments)
                    })
                }, {
                    key: "handleChatModalObserver",
                    value: function() {
                        var e = this,
                            t = new MutationObserver(function(a) {
                                var n = document.querySelector(e.SELECTORS.chatModal);
                                n && (e.handleModalA11y(n), t.disconnect())
                            });
                        t.observe(document.body, {
                            childList: !0,
                            subtree: !0
                        })
                    }
                }, {
                    key: "handleModalA11y",
                    value: function(e) {
                        e.id = this.SELECTORS.chatModalID, e.ariaModal = !0
                    }
                }, {
                    key: "checkMaiaStatus",
                    value: function() {
                        var e = this,
                            t = document.querySelector(this.SELECTORS.wrapper),
                            a = document.querySelector(this.SELECTORS.maiaChat),
                            n = null == t ? void 0 : t.querySelector(this.SELECTORS.chatButton),
                            i = !a,
                            r = i ? this.CLASSES.agentsAvailable : this.CLASSES.agentsNotAvailable;
                        n && i && n.addEventListener("click", function() {
                            n.ariaExpanded = !0, n.setAttribute("aria-controls", e.SELECTORS.chatModalID)
                        }), null == t || t.classList.add(r)
                    }
                }]);
                var a
            }(m.default)
        },
        62070: function(e, t, a) {
            a.d(t, {
                GB: function() {
                    return c
                },
                Gf: function() {
                    return m
                },
                LT: function() {
                    return d
                },
                Of: function() {
                    return o
                },
                Qw: function() {
                    return u
                },
                UQ: function() {
                    return l
                },
                if: function() {
                    return h
                },
                sb: function() {
                    return r
                },
                yu: function() {
                    return i
                }
            });
            var n = a(87623),
                i = function(e, t, a, n, i) {
                    if (e && t && window.dataLayer) {
                        var r = {
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
                        n && p(n, r.ecommerce.items[0]), a && _(a, r.ecommerce.items[0]), f(r.ecommerce.items[0]), t.cardSize && h(t.cardSize, r.ecommerce.items[0]), window.dataLayer.push(r)
                    }
                },
                r = function(e, t, a) {
                    window.dataLayer && window.dataLayer.push({
                        event: "product click",
                        event_category: "ecommerce",
                        event_action: "Product Click",
                        event_label: e.product_name,
                        ecommerce: {
                            currencyCode: t,
                            click: {
                                actionField: {
                                    list: a
                                },
                                products: [e]
                            }
                        }
                    })
                },
                o = function(e, t, a) {
                    if (window.dataLayer) {
                        var n = {
                            event: "select_item",
                            ecommerce: {
                                items: [{
                                    item_id: e.id,
                                    item_name: e.productName,
                                    promotion_name: e.promotionInfo && e.promotionInfo.name ? e.promotionInfo.name : "",
                                    item_brand: e.brand,
                                    quantity: e.qtyincart,
                                    index: a,
                                    item_type: e.itemType
                                }]
                            }
                        };
                        e.cardSize && (n.ecommerce.items[0].item_list_id = e.cardSize), t && p(t, n.ecommerce.items[0]), e.price && _(e.price, n.ecommerce.items[0]), f(n.ecommerce.items[0]), window.dataLayer.push(n)
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
                            shipping_tier: s(t),
                            items: e.map(function(e) {
                                var t = e.breadcrumbs,
                                    a = {
                                        item_id: e.id,
                                        item_name: e.productName,
                                        item_brand: e.brand,
                                        quantity: e.qtyincart,
                                        item_type: e.itemType
                                    };
                                return p(t, a), _(e.price, a), a
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
                d = function(e, t) {
                    window.dataLayer && window.dataLayer.push({
                        event: "error",
                        error_name: t,
                        error_location: e,
                        event_detail: t
                    })
                },
                m = function(e, t) {
                    if (window.dataLayer) {
                        var a = [];
                        e && e.detail && e.detail.errors && (a = e.detail.errors.map(function(e) {
                            return e.id
                        })), window.dataLayer.push({
                            event: "error",
                            error_name: "form_filed_error",
                            error_location: t || (e && e.target && e.target.id ? e.target.id : "form"),
                            event_detail: a.join("|")
                        })
                    }
                },
                s = function(e) {
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
                _ = function(e, t) {
                    t.discount = e.list && e.list.value ? (e.list.value - e.sales.value).toFixed(2) : "", t.price = e.sales.value
                },
                f = function(e) {
                    var t;
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, n.L)(document.location.pathname, !1) + e.item_list_id : (0, n.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                h = function(e, t) {
                    var a, i = (0, n.L)(document.location.pathname, !1);
                    if (a = "Half Width" === e ? i + "_card_single" : i + "_card_double", !t) return a;
                    t.item_list_id = a, t.item_list_name = a
                }
        },
        87623: function(e, t, a) {
            function n(e, t) {
                var a = "true" === t ? t : function(e) {
                    var t = e.split("/"),
                        a = "s" === t[1] ? "isSandbox" : t;
                    return 0 === t[1].length ? "homepage" : "p" === t[1] || "dettaglio-prodotto" === t[1] ? "product-page" : function(e) {
                        var t = e.toString();
                        t.endsWith(",") && (t = t.slice("", -1));
                        t.endsWith(".html") && (t = t.slice("", -5));
                        0 == t.indexOf(",") && (t = t.slice(1));
                        return t.replaceAll(",", "/")
                    }(a)
                }(e);
                return a
            }
            a.d(t, {
                L: function() {
                    return n
                }
            })
        }
    }
]);
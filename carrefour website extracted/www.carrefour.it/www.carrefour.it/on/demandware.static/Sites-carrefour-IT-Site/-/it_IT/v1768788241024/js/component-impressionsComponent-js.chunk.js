(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [5418], {
        887: function(t, e, n) {
            var r = n(16993),
                o = n(11791);
            t.exports = function(t, e, n, i, s) {
                return new o(r().w(t, e, n, i), s || Promise)
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        4373: function(t) {
            t.exports = function(t) {
                var e = Object(t),
                    n = [];
                for (var r in e) n.unshift(r);
                return function t() {
                    for (; n.length;)
                        if ((r = n.pop()) in e) return t.value = r, t.done = !1, t;
                    return t.done = !0, t
                }
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        4633: function(t, e, n) {
            var r = n(25172),
                o = n(16993),
                i = n(55869),
                s = n(887),
                u = n(11791),
                a = n(4373),
                c = n(30579);

            function l() {
                "use strict";
                var e = o(),
                    n = e.m(l),
                    p = (Object.getPrototypeOf ? Object.getPrototypeOf(n) : n.__proto__).constructor;

                function f(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === p || "GeneratorFunction" === (e.displayName || e.name))
                }
                var d = {
                    throw: 1,
                    return: 2,
                    break: 3,
                    continue: 3
                };

                function m(t) {
                    var e, n;
                    return function(r) {
                        e || (e = {
                            stop: function() {
                                return n(r.a, 2)
                            },
                            catch: function() {
                                return r.v
                            },
                            abrupt: function(t, e) {
                                return n(r.a, d[t], e)
                            },
                            delegateYield: function(t, o, i) {
                                return e.resultName = o, n(r.d, c(t), i)
                            },
                            finish: function(t) {
                                return n(r.f, t)
                            }
                        }, n = function(t, n, o) {
                            r.p = e.prev, r.n = e.next;
                            try {
                                return t(n, o)
                            } finally {
                                e.next = r.n
                            }
                        }), e.resultName && (e[e.resultName] = r.v, e.resultName = void 0), e.sent = r.v, e.next = r.n;
                        try {
                            return t.call(this, e)
                        } finally {
                            r.p = e.prev, r.n = e.next
                        }
                    }
                }
                return (t.exports = l = function() {
                    return {
                        wrap: function(t, n, r, o) {
                            return e.w(m(t), n, r, o && o.reverse())
                        },
                        isGeneratorFunction: f,
                        mark: e.m,
                        awrap: function(t, e) {
                            return new r(t, e)
                        },
                        AsyncIterator: u,
                        async: function(t, e, n, r, o) {
                            return (f(e) ? s : i)(m(t), e, n, r, o)
                        },
                        keys: a,
                        values: c
                    }
                }, t.exports.__esModule = !0, t.exports.default = t.exports)()
            }
            t.exports = l, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        10467: function(t, e, n) {
            "use strict";

            function r(t, e, n, r, o, i, s) {
                try {
                    var u = t[i](s),
                        a = u.value
                } catch (t) {
                    return void n(t)
                }
                u.done ? e(a) : Promise.resolve(a).then(r, o)
            }

            function o(t) {
                return function() {
                    var e = this,
                        n = arguments;
                    return new Promise(function(o, i) {
                        var s = t.apply(e, n);

                        function u(t) {
                            r(s, o, i, u, a, "next", t)
                        }

                        function a(t) {
                            r(s, o, i, u, a, "throw", t)
                        }
                        u(void 0)
                    })
                }
            }
            n.d(e, {
                A: function() {
                    return o
                }
            })
        },
        11791: function(t, e, n) {
            var r = n(25172),
                o = n(75546);
            t.exports = function t(e, n) {
                function i(t, o, s, u) {
                    try {
                        var a = e[t](o),
                            c = a.value;
                        return c instanceof r ? n.resolve(c.v).then(function(t) {
                            i("next", t, s, u)
                        }, function(t) {
                            i("throw", t, s, u)
                        }) : n.resolve(c).then(function(t) {
                            a.value = t, s(a)
                        }, function(t) {
                            return i("throw", t, s, u)
                        })
                    } catch (t) {
                        u(t)
                    }
                }
                var s;
                this.next || (o(t.prototype), o(t.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
                    return this
                })), o(this, "_invoke", function(t, e, r) {
                    function o() {
                        return new n(function(e, n) {
                            i(t, r, e, n)
                        })
                    }
                    return s = s ? s.then(o, o) : o()
                }, !0)
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        16993: function(t, e, n) {
            var r = n(75546);

            function o() {
                var e, n, i = "function" == typeof Symbol ? Symbol : {},
                    s = i.iterator || "@@iterator",
                    u = i.toStringTag || "@@toStringTag";

                function a(t, o, i, s) {
                    var u = o && o.prototype instanceof l ? o : l,
                        a = Object.create(u.prototype);
                    return r(a, "_invoke", function(t, r, o) {
                        var i, s, u, a = 0,
                            l = o || [],
                            p = !1,
                            f = {
                                p: 0,
                                n: 0,
                                v: e,
                                a: d,
                                f: d.bind(e, 4),
                                d: function(t, n) {
                                    return i = t, s = 0, u = e, f.n = n, c
                                }
                            };

                        function d(t, r) {
                            for (s = t, u = r, n = 0; !p && a && !o && n < l.length; n++) {
                                var o, i = l[n],
                                    d = f.p,
                                    m = i[2];
                                t > 3 ? (o = m === r) && (u = i[(s = i[4]) ? 5 : (s = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = t < 2 && d < i[1]) ? (s = 0, f.v = r, f.n = i[1]) : d < m && (o = t < 3 || i[0] > r || r > m) && (i[4] = t, i[5] = r, f.n = m, s = 0))
                            }
                            if (o || t > 1) return c;
                            throw p = !0, r
                        }
                        return function(o, l, m) {
                            if (a > 1) throw TypeError("Generator is already running");
                            for (p && 1 === l && d(l, m), s = l, u = m;
                                (n = s < 2 ? e : u) || !p;) {
                                i || (s ? s < 3 ? (s > 1 && (f.n = -1), d(s, u)) : f.n = u : f.v = u);
                                try {
                                    if (a = 2, i) {
                                        if (s || (o = "next"), n = i[o]) {
                                            if (!(n = n.call(i, u))) throw TypeError("iterator result is not an object");
                                            if (!n.done) return n;
                                            u = n.value, s < 2 && (s = 0)
                                        } else 1 === s && (n = i.return) && n.call(i), s < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), s = 1);
                                        i = e
                                    } else if ((n = (p = f.n < 0) ? u : t.call(r, f)) !== c) break
                                } catch (t) {
                                    i = e, s = 1, u = t
                                } finally {
                                    a = 1
                                }
                            }
                            return {
                                value: n,
                                done: p
                            }
                        }
                    }(t, i, s), !0), a
                }
                var c = {};

                function l() {}

                function p() {}

                function f() {}
                n = Object.getPrototypeOf;
                var d = [][s] ? n(n([][s]())) : (r(n = {}, s, function() {
                        return this
                    }), n),
                    m = f.prototype = l.prototype = Object.create(d);

                function v(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, f) : (t.__proto__ = f, r(t, u, "GeneratorFunction")), t.prototype = Object.create(m), t
                }
                return p.prototype = f, r(m, "constructor", f), r(f, "constructor", p), p.displayName = "GeneratorFunction", r(f, u, "GeneratorFunction"), r(m), r(m, u, "Generator"), r(m, s, function() {
                    return this
                }), r(m, "toString", function() {
                    return "[object Generator]"
                }), (t.exports = o = function() {
                    return {
                        w: a,
                        m: v
                    }
                }, t.exports.__esModule = !0, t.exports.default = t.exports)()
            }
            t.exports = o, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        23337: function(t, e, n) {
            "use strict";
            n.r(e), n.d(e, {
                default: function() {
                    return v
                }
            });
            var r = n(10467),
                o = n(64467),
                i = n(23029),
                s = n(92901),
                u = n(50388),
                a = n(53954),
                c = n(15361),
                l = n(54756),
                p = n.n(l),
                f = n(57467),
                d = n(87623);

            function m() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (m = function() {
                    return !!t
                })()
            }
            var v = function(t) {
                function e(t) {
                    var n, r, o, s;
                    return (0, i.A)(this, e), r = this, o = e, s = [t], o = (0, a.A)(o), n = (0, u.A)(r, m() ? Reflect.construct(o, s || [], (0, a.A)(r).constructor) : o.apply(r, s)), setTimeout(function() {
                        var t = n.getProductTiles();
                        n.triggerDataLayerEvents(t)
                    }, 2200), n
                }
                return (0, c.A)(e, t), (0, s.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)((0, o.A)((0, o.A)({}, this.CUSTOM_MESSAGES.UPDATE_GRID_EVENTS.done, this.triggerDLEventsUpdateDone), this.CUSTOM_MESSAGES.UPDATE_GRID_EVENTS.multisearchdone, this.triggerDLEventsMultiSearch), this.CUSTOM_MESSAGES.CAROUSEL_EVENTS.RECOMMENDER_MOUNTED, this.triggerDLEventsUpdateDone)
                    }
                }, {
                    key: "PARAMS_BLACK_LIST",
                    get: function() {
                        return []
                    }
                }, {
                    key: "triggerDLEventsUpdateDone",
                    value: function() {
                        var t = this.getProductTiles();
                        this.triggerDataLayerEvents(t, !0)
                    }
                }, {
                    key: "triggerDLEventsMultiSearch",
                    value: function(t) {
                        var e = t.productTiles;
                        this.triggerDataLayerEvents(e)
                    }
                }, {
                    key: "getProductTiles",
                    value: function() {
                        return Array.from(this.$el.querySelectorAll(".product.tile[data-product-json]"))
                    }
                }, {
                    key: "triggerDataLayerEvents",
                    value: function(t, e) {
                        window.dataLayer && (this.triggerProductImpressionsEvents(t), this.triggerViewPromotionEvents(t), e || this.pushPromotionImpressions(), this.triggerViewItemListEvents(t))
                    }
                }, {
                    key: "triggerProductImpressionsEvents",
                    value: function(t, e) {
                        var n = this.getProductImpressionsItems(t, e);
                        this.sendEventsInChunks(n, "productImpressions")
                    }
                }, {
                    key: "getProductImpressionsItems",
                    value: function(t, e) {
                        var n = this,
                            r = t.map(function(t) {
                                return t.dataset.productJson
                            }),
                            o = t.map(function(t) {
                                var e = t.closest(".editorial-product-card");
                                if (e) return e.classList.contains("half-width") ? "_card_single" : null != e && e.classList.contains("full-width") ? "_card_double" : ""
                            }),
                            i = [];
                        if (r.length > 0) {
                            var s = e ? Number(e) : 0,
                                u = r.map(function(t, r) {
                                    if (void 0 !== t) {
                                        var i = JSON.parse(t);
                                        e && (i.list_name = "listing", i.product_index = s, s++);
                                        var u = !!n.$el.querySelector(".zero-search-results");
                                        return u || "wishlist" !== (0, d.L)(document.location.pathname, n.$options.impressionList) ? o.length > 0 && o[r] ? (i.list = (0, d.L)(document.location.pathname, n.$options.impressionList) + o[r], i.list_name = i.list) : i.list = u ? "searchresult_0" : (0, d.L)(document.location.pathname, n.$options.impressionList) : i.list = "le_mie_liste", i
                                    }
                                    return null
                                });
                            i = e ? u.slice(e) : u
                        }
                        return i
                    }
                }, {
                    key: "sendEventsInChunks",
                    value: function(t, e) {
                        if (t.length > 30) {
                            for (var n = 0; n < t.length / 30; n++) {
                                var r = t.slice(30 * n, 30 * (n + 1));
                                this.sendEvent(r, e)
                            }
                            t.length % 30 != 0 && this.sendEvent(t.slice(t.length / 30 * 30), e)
                        } else t.length > 0 && this.sendEvent(t, e)
                    }
                }, {
                    key: "sendEvent",
                    value: function(t, e) {
                        if (t && t.length > 0) switch (e) {
                            case "productImpressions":
                                this.pushProductImpressionsToDL(t);
                                break;
                            case "viewPromotion":
                                this.pushViewPromotionToDL(t);
                                break;
                            case "viewItemList":
                                this.pushViewItemListToDL(t)
                        }
                    }
                }, {
                    key: "triggerViewPromotionEvents",
                    value: function(t) {
                        var e = this.getViewPromotionItems(t);
                        this.sendEventsInChunks(e, "viewPromotion")
                    }
                }, {
                    key: "getViewPromotionItems",
                    value: function(t) {
                        return t.filter(function(t) {
                            var e = t.dataset.optionProductPromotionInfo && JSON.parse(t.dataset.optionProductPromotionInfo),
                                n = t.dataset.optionProductDiscountpercentage;
                            return e && e.name || n
                        }).map(function(t) {
                            var e = t.dataset.productJson && JSON.parse(t.dataset.productJson),
                                n = t.dataset.optionProductPromotionInfo && JSON.parse(t.dataset.optionProductPromotionInfo);
                            return {
                                item_id: e && e.id,
                                item_name: e && e.name,
                                promotion_name: n && n.name,
                                promotion_id: n ? n.id ? n.id : n.name : "",
                                creative_name: "product card",
                                location_id: "product listing",
                                price: e && e.price,
                                item_type: e.dimension53
                            }
                        })
                    }
                }, {
                    key: "pushPromotionImpressions",
                    value: (n = (0, r.A)(p().mark(function t() {
                        var e, n, r;
                        return p().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    if (window.dataLayer) {
                                        t.next = 1;
                                        break
                                    }
                                    return t.abrupt("return");
                                case 1:
                                    (e = this.$el.querySelectorAll(".promoclick")).length > 0 && (n = [], r = {}, e.forEach(function(t) {
                                        if (t && t.dataset) {
                                            var e = ["id", "name", "creative", "position"],
                                                o = JSON.parse(JSON.stringify(t.dataset)),
                                                i = Object.keys(o).filter(function(t) {
                                                    return e.includes(t)
                                                }).reduce(function(t, e) {
                                                    return t[e] = o[e], t
                                                }, {});
                                            n = n.concat(i), o && "true" == o.ga4tracking && (r = {
                                                event: "promo_impression",
                                                promo_title: "null" != o.promoTitle ? o.promoTitle : "",
                                                promo_template: "null" != o.promoTemplate ? o.promoTemplate : "",
                                                promo_type: "null" != o.promoType ? o.promoType : "",
                                                promo_format: "null" != o.promoFormat ? o.promoFormat : ""
                                            })
                                        }
                                    }), window.dataLayer.push({
                                        event: "promotion impressions",
                                        ecommerce: {
                                            promoView: {
                                                promotions: n
                                            }
                                        }
                                    }), Object.keys(r).length > 0 && window.dataLayer.push(r));
                                case 2:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    })), function() {
                        return n.apply(this, arguments)
                    })
                }, {
                    key: "triggerViewItemListEvents",
                    value: function(t) {
                        var e = this.getViewItemListItems(t);
                        this.sendEventsInChunks(e, "viewItemList")
                    }
                }, {
                    key: "getViewItemListItems",
                    value: function(t) {
                        var e, n;
                        e = "wishlist" === (0, d.L)(document.location.pathname, this.$options.impressionList) ? "le_mie_liste" : (0, d.L)(document.location.pathname, this.$options.impressionList);
                        var r = !!this.$el.querySelector(".zero-search-results");
                        return t.map(function(t, o) {
                            var i = t.dataset.productJson && JSON.parse(t.dataset.productJson),
                                s = t.dataset.optionProductPromotionInfo && JSON.parse(t.dataset.optionProductPromotionInfo),
                                u = t.dataset.optionProductPrice && JSON.parse(t.dataset.optionProductPrice),
                                a = t.dataset.optionProductBreadcrumbs && JSON.parse(t.dataset.optionProductBreadcrumbs),
                                c = t.closest(".editorial-product-card");
                            return c && (c.classList.contains("half-width") && (n = e + "_card_single"), c.classList.contains("full-width") && (n = e + "_card_double")), {
                                item_id: i && i.id,
                                item_name: i && i.name,
                                price: u && u.sales && u.sales.value,
                                discount: u && u.list && u.list.value ? (u.list.value - u.sales.value).toFixed(2) : "",
                                promotion_name: s && s.name,
                                index: o,
                                item_brand: i && i.brand,
                                item_category: a && a.length > 1 ? a[1].htmlValue : "",
                                item_category2: a && a.length > 2 ? a[2].htmlValue : "",
                                item_category3: a && a.length > 3 ? a[3].htmlValue : "",
                                item_category4: a && a.length > 4 ? a[4].htmlValue : "",
                                item_list_id: r ? "searchresult_0" : n || e,
                                item_list_name: r ? "searchresult_0" : n || e,
                                item_type: i.dimension53,
                                item_tooltip: Boolean(s && s.promoSpendiRiprendi)
                            }
                        })
                    }
                }, {
                    key: "pushViewPromotionToDL",
                    value: function(t) {
                        window.dataLayer.push({
                            event: "view_promotion",
                            ecommerce: {
                                items: t
                            }
                        })
                    }
                }, {
                    key: "pushProductImpressionsToDL",
                    value: function(t) {
                        var e = this.$el.dataset.currencyCode;
                        window.dataLayer.push({
                            event: "product impressions",
                            ecommerce: {
                                currencyCode: e,
                                impressions: t
                            }
                        })
                    }
                }, {
                    key: "pushViewItemListToDL",
                    value: function(t) {
                        window.dataLayer.push({
                            event: "view_item_list",
                            ecommerce: {
                                items: t
                            }
                        })
                    }
                }]);
                var n
            }(f.A)
        },
        25172: function(t) {
            t.exports = function(t, e) {
                this.v = t, this.k = e
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        30579: function(t, e, n) {
            var r = n(73738).default;
            t.exports = function(t) {
                if (null != t) {
                    var e = t["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
                        n = 0;
                    if (e) return e.call(t);
                    if ("function" == typeof t.next) return t;
                    if (!isNaN(t.length)) return {
                        next: function() {
                            return t && n >= t.length && (t = void 0), {
                                value: t && t[n++],
                                done: !t
                            }
                        }
                    }
                }
                throw new TypeError(r(t) + " is not iterable")
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        54756: function(t, e, n) {
            var r = n(4633)();
            t.exports = r;
            try {
                regeneratorRuntime = r
            } catch (t) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = r : Function("r", "regeneratorRuntime = r")(r)
            }
        },
        55869: function(t, e, n) {
            var r = n(887);
            t.exports = function(t, e, n, o, i) {
                var s = r(t, e, n, o, i);
                return s.next().then(function(t) {
                    return t.done ? t.value : s.next()
                })
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        57467: function(t, e, n) {
            "use strict";
            n.d(e, {
                A: function() {
                    return m
                }
            });
            var r = n(64467),
                o = n(23029),
                i = n(92901),
                s = n(50388),
                u = n(53954),
                a = n(15361),
                c = n(85349),
                l = n.n(c),
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
            var m = function(t) {
                function e(t) {
                    var n, r, i, a;
                    return (0, o.A)(this, e), r = this, i = e, a = [t], i = (0, u.A)(i), (n = (0, s.A)(r, d() ? Reflect.construct(i, a || [], (0, u.A)(r).constructor) : i.apply(r, a)))._componentElement = t, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, a.A)(e, t), (0, i.A)(e, [{
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
                            var o, i = e.cleanOptionKey(r);
                            o = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : e.convertType(n[r]), t[i] = o
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
        73738: function(t) {
            function e(n) {
                return t.exports = e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }, t.exports.__esModule = !0, t.exports.default = t.exports, e(n)
            }
            t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        75546: function(t) {
            function e(n, r, o, i) {
                var s = Object.defineProperty;
                try {
                    s({}, "", {})
                } catch (n) {
                    s = 0
                }
                t.exports = e = function(t, n, r, o) {
                    if (n) s ? s(t, n, {
                        value: r,
                        enumerable: !o,
                        configurable: !o,
                        writable: !o
                    }) : t[n] = r;
                    else {
                        var i = function(n, r) {
                            e(t, n, function(t) {
                                return this._invoke(n, r, t)
                            })
                        };
                        i("next", 0), i("throw", 1), i("return", 2)
                    }
                }, t.exports.__esModule = !0, t.exports.default = t.exports, e(n, r, o, i)
            }
            t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        87623: function(t, e, n) {
            "use strict";

            function r(t, e) {
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
                    return r
                }
            })
        }
    }
]);
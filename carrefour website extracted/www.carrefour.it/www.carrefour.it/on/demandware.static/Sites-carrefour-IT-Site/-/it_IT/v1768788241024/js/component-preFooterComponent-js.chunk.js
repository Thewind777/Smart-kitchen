(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [8666], {
        887: function(e, t, n) {
            var r = n(16993),
                o = n(11791);
            e.exports = function(e, t, n, i, a) {
                return new o(r().w(e, t, n, i), a || Promise)
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        4373: function(e) {
            e.exports = function(e) {
                var t = Object(e),
                    n = [];
                for (var r in t) n.unshift(r);
                return function e() {
                    for (; n.length;)
                        if ((r = n.pop()) in t) return e.value = r, e.done = !1, e;
                    return e.done = !0, e
                }
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        4633: function(e, t, n) {
            var r = n(25172),
                o = n(16993),
                i = n(55869),
                a = n(887),
                c = n(11791),
                u = n(4373),
                s = n(30579);

            function l() {
                "use strict";
                var t = o(),
                    n = t.m(l),
                    f = (Object.getPrototypeOf ? Object.getPrototypeOf(n) : n.__proto__).constructor;

                function p(e) {
                    var t = "function" == typeof e && e.constructor;
                    return !!t && (t === f || "GeneratorFunction" === (t.displayName || t.name))
                }
                var d = {
                    throw: 1,
                    return: 2,
                    break: 3,
                    continue: 3
                };

                function m(e) {
                    var t, n;
                    return function(r) {
                        t || (t = {
                            stop: function() {
                                return n(r.a, 2)
                            },
                            catch: function() {
                                return r.v
                            },
                            abrupt: function(e, t) {
                                return n(r.a, d[e], t)
                            },
                            delegateYield: function(e, o, i) {
                                return t.resultName = o, n(r.d, s(e), i)
                            },
                            finish: function(e) {
                                return n(r.f, e)
                            }
                        }, n = function(e, n, o) {
                            r.p = t.prev, r.n = t.next;
                            try {
                                return e(n, o)
                            } finally {
                                t.next = r.n
                            }
                        }), t.resultName && (t[t.resultName] = r.v, t.resultName = void 0), t.sent = r.v, t.next = r.n;
                        try {
                            return e.call(this, t)
                        } finally {
                            r.p = t.prev, r.n = t.next
                        }
                    }
                }
                return (e.exports = l = function() {
                    return {
                        wrap: function(e, n, r, o) {
                            return t.w(m(e), n, r, o && o.reverse())
                        },
                        isGeneratorFunction: p,
                        mark: t.m,
                        awrap: function(e, t) {
                            return new r(e, t)
                        },
                        AsyncIterator: c,
                        async: function(e, t, n, r, o) {
                            return (p(t) ? a : i)(m(e), t, n, r, o)
                        },
                        keys: u,
                        values: s
                    }
                }, e.exports.__esModule = !0, e.exports.default = e.exports)()
            }
            e.exports = l, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        10467: function(e, t, n) {
            "use strict";

            function r(e, t, n, r, o, i, a) {
                try {
                    var c = e[i](a),
                        u = c.value
                } catch (e) {
                    return void n(e)
                }
                c.done ? t(u) : Promise.resolve(u).then(r, o)
            }

            function o(e) {
                return function() {
                    var t = this,
                        n = arguments;
                    return new Promise(function(o, i) {
                        var a = e.apply(t, n);

                        function c(e) {
                            r(a, o, i, c, u, "next", e)
                        }

                        function u(e) {
                            r(a, o, i, c, u, "throw", e)
                        }
                        c(void 0)
                    })
                }
            }
            n.d(t, {
                A: function() {
                    return o
                }
            })
        },
        11791: function(e, t, n) {
            var r = n(25172),
                o = n(75546);
            e.exports = function e(t, n) {
                function i(e, o, a, c) {
                    try {
                        var u = t[e](o),
                            s = u.value;
                        return s instanceof r ? n.resolve(s.v).then(function(e) {
                            i("next", e, a, c)
                        }, function(e) {
                            i("throw", e, a, c)
                        }) : n.resolve(s).then(function(e) {
                            u.value = e, a(u)
                        }, function(e) {
                            return i("throw", e, a, c)
                        })
                    } catch (e) {
                        c(e)
                    }
                }
                var a;
                this.next || (o(e.prototype), o(e.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
                    return this
                })), o(this, "_invoke", function(e, t, r) {
                    function o() {
                        return new n(function(t, n) {
                            i(e, r, t, n)
                        })
                    }
                    return a = a ? a.then(o, o) : o()
                }, !0)
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        16993: function(e, t, n) {
            var r = n(75546);

            function o() {
                var t, n, i = "function" == typeof Symbol ? Symbol : {},
                    a = i.iterator || "@@iterator",
                    c = i.toStringTag || "@@toStringTag";

                function u(e, o, i, a) {
                    var c = o && o.prototype instanceof l ? o : l,
                        u = Object.create(c.prototype);
                    return r(u, "_invoke", function(e, r, o) {
                        var i, a, c, u = 0,
                            l = o || [],
                            f = !1,
                            p = {
                                p: 0,
                                n: 0,
                                v: t,
                                a: d,
                                f: d.bind(t, 4),
                                d: function(e, n) {
                                    return i = e, a = 0, c = t, p.n = n, s
                                }
                            };

                        function d(e, r) {
                            for (a = e, c = r, n = 0; !f && u && !o && n < l.length; n++) {
                                var o, i = l[n],
                                    d = p.p,
                                    m = i[2];
                                e > 3 ? (o = m === r) && (c = i[(a = i[4]) ? 5 : (a = 3, 3)], i[4] = i[5] = t) : i[0] <= d && ((o = e < 2 && d < i[1]) ? (a = 0, p.v = r, p.n = i[1]) : d < m && (o = e < 3 || i[0] > r || r > m) && (i[4] = e, i[5] = r, p.n = m, a = 0))
                            }
                            if (o || e > 1) return s;
                            throw f = !0, r
                        }
                        return function(o, l, m) {
                            if (u > 1) throw TypeError("Generator is already running");
                            for (f && 1 === l && d(l, m), a = l, c = m;
                                (n = a < 2 ? t : c) || !f;) {
                                i || (a ? a < 3 ? (a > 1 && (p.n = -1), d(a, c)) : p.n = c : p.v = c);
                                try {
                                    if (u = 2, i) {
                                        if (a || (o = "next"), n = i[o]) {
                                            if (!(n = n.call(i, c))) throw TypeError("iterator result is not an object");
                                            if (!n.done) return n;
                                            c = n.value, a < 2 && (a = 0)
                                        } else 1 === a && (n = i.return) && n.call(i), a < 2 && (c = TypeError("The iterator does not provide a '" + o + "' method"), a = 1);
                                        i = t
                                    } else if ((n = (f = p.n < 0) ? c : e.call(r, p)) !== s) break
                                } catch (e) {
                                    i = t, a = 1, c = e
                                } finally {
                                    u = 1
                                }
                            }
                            return {
                                value: n,
                                done: f
                            }
                        }
                    }(e, i, a), !0), u
                }
                var s = {};

                function l() {}

                function f() {}

                function p() {}
                n = Object.getPrototypeOf;
                var d = [][a] ? n(n([][a]())) : (r(n = {}, a, function() {
                        return this
                    }), n),
                    m = p.prototype = l.prototype = Object.create(d);

                function y(e) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(e, p) : (e.__proto__ = p, r(e, c, "GeneratorFunction")), e.prototype = Object.create(m), e
                }
                return f.prototype = p, r(m, "constructor", p), r(p, "constructor", f), f.displayName = "GeneratorFunction", r(p, c, "GeneratorFunction"), r(m), r(m, c, "Generator"), r(m, a, function() {
                    return this
                }), r(m, "toString", function() {
                    return "[object Generator]"
                }), (e.exports = o = function() {
                    return {
                        w: u,
                        m: y
                    }
                }, e.exports.__esModule = !0, e.exports.default = e.exports)()
            }
            e.exports = o, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        25172: function(e) {
            e.exports = function(e, t) {
                this.v = e, this.k = t
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        30579: function(e, t, n) {
            var r = n(73738).default;
            e.exports = function(e) {
                if (null != e) {
                    var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"],
                        n = 0;
                    if (t) return t.call(e);
                    if ("function" == typeof e.next) return e;
                    if (!isNaN(e.length)) return {
                        next: function() {
                            return e && n >= e.length && (e = void 0), {
                                value: e && e[n++],
                                done: !e
                            }
                        }
                    }
                }
                throw new TypeError(r(e) + " is not iterable")
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        35529: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                default: function() {
                    return y
                }
            });
            var r = n(10467),
                o = n(80296),
                i = n(23029),
                a = n(92901),
                c = n(50388),
                u = n(53954),
                s = n(15361),
                l = n(54756),
                f = n.n(l),
                p = n(57467),
                d = n(62070);

            function m() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (m = function() {
                    return !!e
                })()
            }
            var y = function(e) {
                function t(e) {
                    var n, r, o, a;
                    return (0, i.A)(this, t), r = this, o = t, a = [e], o = (0, u.A)(o), (n = (0, c.A)(r, m() ? Reflect.construct(o, a || [], (0, u.A)(r).constructor) : o.apply(r, a))).handleClick(), n.handleTrackingObserver(), n
                }
                return (0, s.A)(t, e), (0, a.A)(t, [{
                    key: "CLASSES",
                    get: function() {
                        return {
                            social: "footer-social"
                        }
                    }
                }, {
                    key: "handleClick",
                    value: function() {
                        var e = this,
                            t = this.$el.className.includes(this.CLASSES.social) ? "social" : "services";
                        Array.from(this.$el.getElementsByTagName("a")).forEach(function(n) {
                            e.$on("click", function(e) {
                                var r = {
                                    area: "pre_footer",
                                    type: t,
                                    url: n.href ? n.href : "",
                                    text: "social" == t ? n.firstElementChild && n.firstElementChild.alt : n.innerText ? n.innerText : ""
                                };
                                (0, d.Qw)(r)
                            }, n)
                        })
                    }
                }, {
                    key: "handleTrackingObserver",
                    value: function() {
                        var e = this;
                        this.$el && this.$options.track && (this.observer = new IntersectionObserver(function(t) {
                            (0, o.A)(t, 1)[0].intersectionRatio >= .1 && e.trackImpression().then(e.observer.unobserve(e.$el))
                        }, {
                            threshold: [.1]
                        }), this.observer.observe(this.$el))
                    }
                }, {
                    key: "trackImpression",
                    value: (n = (0, r.A)(f().mark(function e() {
                        return f().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    window && window.dataLayer && window.dataLayer.push({
                                        event: "prefooter_impression"
                                    });
                                case 1:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    })), function() {
                        return n.apply(this, arguments)
                    })
                }]);
                var n
            }(p.A)
        },
        54756: function(e, t, n) {
            var r = n(4633)();
            e.exports = r;
            try {
                regeneratorRuntime = r
            } catch (e) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = r : Function("r", "regeneratorRuntime = r")(r)
            }
        },
        55869: function(e, t, n) {
            var r = n(887);
            e.exports = function(e, t, n, o, i) {
                var a = r(e, t, n, o, i);
                return a.next().then(function(e) {
                    return e.done ? e.value : a.next()
                })
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        57467: function(e, t, n) {
            "use strict";
            n.d(t, {
                A: function() {
                    return m
                }
            });
            var r = n(64467),
                o = n(23029),
                i = n(92901),
                a = n(50388),
                c = n(53954),
                u = n(15361),
                s = n(85349),
                l = n.n(s),
                f = n(24263);

            function p(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, r)
                }
                return n
            }

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
                    var n, r, i, u;
                    return (0, o.A)(this, t), r = this, i = t, u = [e], i = (0, c.A)(i), (n = (0, a.A)(r, d() ? Reflect.construct(i, u || [], (0, c.A)(r).constructor) : i.apply(r, u)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, u.A)(t, e), (0, i.A)(t, [{
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
                                        (0, r.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : p(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(r) {
                            var o, i = t.cleanOptionKey(r);
                            o = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : t.convertType(n[r]), e[i] = o
                        }), (0, f.A)(e)
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
                        n && e && t && (r ? l().on(n, e, r, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : l().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        l().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().fire(t, e)
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
                            o = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: r,
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
            "use strict";
            n.d(t, {
                GB: function() {
                    return c
                },
                Gf: function() {
                    return f
                },
                LT: function() {
                    return l
                },
                Of: function() {
                    return a
                },
                Qw: function() {
                    return s
                },
                UQ: function() {
                    return u
                },
                if: function() {
                    return v
                },
                sb: function() {
                    return i
                },
                yu: function() {
                    return o
                }
            });
            var r = n(87623),
                o = function(e, t, n, r, o) {
                    if (e && t && window.dataLayer) {
                        var i = {
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
                        r && d(r, i.ecommerce.items[0]), n && m(n, i.ecommerce.items[0]), y(i.ecommerce.items[0]), t.cardSize && v(t.cardSize, i.ecommerce.items[0]), window.dataLayer.push(i)
                    }
                },
                i = function(e, t, n) {
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
                        e.cardSize && (r.ecommerce.items[0].item_list_id = e.cardSize), t && d(t, r.ecommerce.items[0]), e.price && m(e.price, r.ecommerce.items[0]), y(r.ecommerce.items[0]), window.dataLayer.push(r)
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
                                return d(t, n), m(e.price, n), n
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
                l = function(e, t) {
                    window.dataLayer && window.dataLayer.push({
                        event: "error",
                        error_name: t,
                        error_location: e,
                        event_detail: t
                    })
                },
                f = function(e, t) {
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
                d = function(e, t) {
                    t.item_category = e && e.length > 1 ? e[1].htmlValue.replace(/`/g, "'") : "", t.item_category2 = e && e.length > 2 ? e[2].htmlValue.replace(/`/g, "'") : "", t.item_category3 = e && e.length > 3 ? e[3].htmlValue.replace(/`/g, "'") : "", t.item_category4 = e && e.length > 4 ? e[4].htmlValue.replace(/`/g, "'") : ""
                },
                m = function(e, t) {
                    t.discount = e.list && e.list.value ? (e.list.value - e.sales.value).toFixed(2) : "", t.price = e.sales.value
                },
                y = function(e) {
                    var t;
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, r.L)(document.location.pathname, !1) + e.item_list_id : (0, r.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                v = function(e, t) {
                    var n, o = (0, r.L)(document.location.pathname, !1);
                    if (n = "Half Width" === e ? o + "_card_single" : o + "_card_double", !t) return n;
                    t.item_list_id = n, t.item_list_name = n
                }
        },
        73738: function(e) {
            function t(n) {
                return e.exports = t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, e.exports.__esModule = !0, e.exports.default = e.exports, t(n)
            }
            e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        75546: function(e) {
            function t(n, r, o, i) {
                var a = Object.defineProperty;
                try {
                    a({}, "", {})
                } catch (n) {
                    a = 0
                }
                e.exports = t = function(e, n, r, o) {
                    if (n) a ? a(e, n, {
                        value: r,
                        enumerable: !o,
                        configurable: !o,
                        writable: !o
                    }) : e[n] = r;
                    else {
                        var i = function(n, r) {
                            t(e, n, function(e) {
                                return this._invoke(n, r, e)
                            })
                        };
                        i("next", 0), i("throw", 1), i("return", 2)
                    }
                }, e.exports.__esModule = !0, e.exports.default = e.exports, t(n, r, o, i)
            }
            e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        80296: function(e, t, n) {
            "use strict";
            n.d(t, {
                A: function() {
                    return o
                }
            });
            var r = n(27800);

            function o(e, t) {
                return function(e) {
                    if (Array.isArray(e)) return e
                }(e) || function(e, t) {
                    var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                    if (null != n) {
                        var r, o, i, a, c = [],
                            u = !0,
                            s = !1;
                        try {
                            if (i = (n = n.call(e)).next, 0 === t) {
                                if (Object(n) !== n) return;
                                u = !1
                            } else
                                for (; !(u = (r = i.call(n)).done) && (c.push(r.value), c.length !== t); u = !0);
                        } catch (e) {
                            s = !0, o = e
                        } finally {
                            try {
                                if (!u && null != n.return && (a = n.return(), Object(a) !== a)) return
                            } finally {
                                if (s) throw o
                            }
                        }
                        return c
                    }
                }(e, t) || (0, r.A)(e, t) || function() {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }()
            }
        },
        87623: function(e, t, n) {
            "use strict";

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
        }
    }
]);
"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [5485], {
        20454: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return l
                }
            });
            var o = n(23029),
                r = n(92901),
                c = n(50388),
                i = n(53954),
                a = n(15361);

            function u() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (u = function() {
                    return !!e
                })()
            }
            var l = function(e) {
                function t(e) {
                    var n, r, a, l;
                    return (0, o.A)(this, t), r = this, a = t, l = [e], a = (0, i.A)(a), (n = (0, c.A)(r, u() ? Reflect.construct(a, l || [], (0, i.A)(r).constructor) : a.apply(r, l))).handleClick(), n
                }
                return (0, a.A)(t, e), (0, r.A)(t, [{
                    key: "SELECTORS",
                    get: function() {
                        return {
                            promoClick: ".promoclick"
                        }
                    }
                }, {
                    key: "handleClick",
                    value: function() {
                        var e = this.$el.querySelectorAll(this.SELECTORS.promoClick);
                        e && e.length > 0 && e.forEach(function(e) {
                            e.addEventListener("click", function(t) {
                                if (e && e.dataset) {
                                    var n = ["id", "name", "creative", "position"],
                                        o = JSON.parse(JSON.stringify(e.dataset)),
                                        r = Object.keys(o).filter(function(e) {
                                            return n.includes(e)
                                        }).reduce(function(e, t) {
                                            return e[t] = o[t], e
                                        }, {});
                                    window.dataLayer.push({
                                        event: "promotion click",
                                        ecommerce: {
                                            promoClick: {
                                                promotions: [r]
                                            }
                                        }
                                    });
                                    var c = {};
                                    o && "true" == o.ga4tracking && (c = {
                                        event: "promo_click",
                                        promo_title: "null" != o.promoTitle ? o.promoTitle : "",
                                        promo_template: "null" != o.promoTemplate ? o.promoTemplate : "",
                                        promo_type: "null" != o.promoType ? o.promoType : "",
                                        promo_format: "null" != o.promoFormat ? o.promoFormat : ""
                                    }), Object.keys(c).length > 0 && window.dataLayer.push(c)
                                }
                            })
                        })
                    }
                }])
            }(n(57467).A)
        },
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return h
                }
            });
            var o = n(64467),
                r = n(23029),
                c = n(92901),
                i = n(50388),
                a = n(53954),
                u = n(15361),
                l = n(85349),
                p = n.n(l),
                s = n(24263);

            function f(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(e);
                    t && (o = o.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, o)
                }
                return n
            }

            function v() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (v = function() {
                    return !!e
                })()
            }
            var h = function(e) {
                function t(e) {
                    var n, o, c, u;
                    return (0, r.A)(this, t), o = this, c = t, u = [e], c = (0, a.A)(c), (n = (0, i.A)(o, v() ? Reflect.construct(c, u || [], (0, a.A)(o).constructor) : c.apply(o, u)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, u.A)(t, e), (0, c.A)(t, [{
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
                                    t % 2 ? f(Object(n), !0).forEach(function(t) {
                                        (0, o.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : f(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(o) {
                            var r, c = t.cleanOptionKey(o);
                            r = n[o].includes("{") && n[o].includes("}") ? JSON.parse(n[o].replace(/'/g, '"')) : t.convertType(n[o]), e[c] = r
                        }), (0, s.A)(e)
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
                            o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && e && t && (o ? p().on(n, e, o, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : p().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        p().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        p().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        p().fire(t, e)
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
                            o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            r = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: o,
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
        }
    }
]);
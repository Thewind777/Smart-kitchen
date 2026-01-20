"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [3191], {
        57467: function(t, e, n) {
            n.d(e, {
                A: function() {
                    return S
                }
            });
            var o = n(64467),
                c = n(23029),
                r = n(92901),
                i = n(50388),
                u = n(53954),
                a = n(15361),
                l = n(85349),
                s = n.n(l),
                p = n(24263);

            function f(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(t);
                    e && (o = o.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), n.push.apply(n, o)
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
            var S = function(t) {
                function e(t) {
                    var n, o, r, a;
                    return (0, c.A)(this, e), o = this, r = e, a = [t], r = (0, u.A)(r), (n = (0, i.A)(o, d() ? Reflect.construct(r, a || [], (0, u.A)(o).constructor) : r.apply(o, a)))._componentElement = t, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, a.A)(e, t), (0, r.A)(e, [{
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
                                        (0, o.A)(t, e, n[e])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : f(Object(n)).forEach(function(e) {
                                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                                    })
                                }
                                return t
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(t) {
                            return t.includes("option")
                        }).forEach(function(o) {
                            var c, r = e.cleanOptionKey(o);
                            c = n[o].includes("{") && n[o].includes("}") ? JSON.parse(n[o].replace(/'/g, '"')) : e.convertType(n[o]), t[r] = c
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
                            o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && t && e && (o ? s().on(n, t, o, function(t) {
                            t && t.stopPropagation(), e(t)
                        }) : s().on(n, t, function(t) {
                            t && t.stopPropagation(), e(t)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(t, e) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        s().one(n, t, e)
                    }
                }, {
                    key: "$off",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        s().off(e, t)
                    }
                }, {
                    key: "$fire",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        s().fire(e, t)
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
                            o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            c = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: t || document.body,
                                message: e,
                                error: o,
                                icon: c
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
        86276: function(t, e, n) {
            n.r(e), n.d(e, {
                default: function() {
                    return l
                }
            });
            var o = n(23029),
                c = n(92901),
                r = n(50388),
                i = n(53954),
                u = n(15361);

            function a() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (a = function() {
                    return !!t
                })()
            }
            var l = function(t) {
                function e(t) {
                    var n, c, u, l;
                    return (0, o.A)(this, e), c = this, u = e, l = [t], u = (0, i.A)(u), (n = (0, r.A)(c, a() ? Reflect.construct(u, l || [], (0, i.A)(c).constructor) : u.apply(c, l))).checkButtonPosition(), n.initClickEvent(), n
                }
                return (0, u.A)(e, t), (0, c.A)(e, [{
                    key: "CLASSES",
                    get: function() {
                        return {
                            SHOW: "visible",
                            PLP: "plp",
                            CUSTOM_TEMPLATE: "custom-tpl"
                        }
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            backToTopBtn: ".back-to-top",
                            page: ".page"
                        }
                    }
                }, {
                    key: "EVENTS_ID",
                    get: function() {
                        return {
                            BACK_TO_TOP: "click.backToTop"
                        }
                    }
                }, {
                    key: "checkButtonPosition",
                    value: function() {
                        if (document.querySelector(".page[data-action='Account-NewRequest']") && document.querySelector(".chatFourTriggerButton:not(.d-none)")) document.querySelector(this.SELECTORS.backToTopBtn).style.bottom = "164px";
                        else if (document.querySelector(".chatFourTriggerButton:not(.d-none)")) {
                            var t, e = document.body.classList.contains(this.CLASSES.PLP),
                                n = null === (t = document.querySelector(this.SELECTORS.page)) || void 0 === t ? void 0 : t.classList.contains(this.CLASSES.CUSTOM_TEMPLATE);
                            e && !n ? (document.querySelector(this.SELECTORS.backToTopBtn).classList.add("plp-not-custom"), document.querySelector(".chatFourTriggerButton:not(.d-none)").classList.add("plp-not-custom")) : e ? (document.querySelector(this.SELECTORS.backToTopBtn).classList.add("plp-custom"), document.querySelector(".chatFourTriggerButton:not(.d-none)").classList.add("plp-custom")) : document.querySelector(this.SELECTORS.backToTopBtn).style.bottom = "98px"
                        }
                    }
                }, {
                    key: "initClickEvent",
                    value: function() {
                        var t = this;
                        window.addEventListener("scroll", function() {
                            window.pageYOffset > document.documentElement.clientHeight / 2 ? (t.$el.classList.add(t.CLASSES.SHOW), t.checkButtonPosition()) : t.$el.classList.remove(t.CLASSES.SHOW)
                        }), this.$on(this.EVENTS_ID.BACK_TO_TOP, function() {
                            window.pageYOffset != document.documentElement.scrollTop ? document.body.scrollTop = 0 : document.documentElement.scrollTop = 0
                        })
                    }
                }])
            }(n(57467).A)
        }
    }
]);
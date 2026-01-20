"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [7884], {
        12596: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return v
                }
            });
            var r = n(64467),
                o = n(23029),
                c = n(92901),
                i = n(50388),
                u = n(53954),
                a = n(15361),
                s = n(28345);

            function l(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, r)
                }
                return n
            }

            function p(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? l(Object(n), !0).forEach(function(t) {
                        (0, r.A)(e, t, n[t])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : l(Object(n)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    })
                }
                return e
            }

            function f() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (f = function() {
                    return !!e
                })()
            }
            var v = function(e) {
                function t(e) {
                    return (0, o.A)(this, t), n = this, r = t, c = [e], r = (0, u.A)(r), (0, i.A)(n, f() ? Reflect.construct(r, c || [], (0, u.A)(n).constructor) : r.apply(n, c));
                    var n, r, c
                }
                return (0, a.A)(t, e), (0, c.A)(t, [{
                    key: "Messages",
                    get: function() {
                        var e = this;
                        return (0, r.A)({}, this.CUSTOM_MESSAGES.CAROUSEL_EVENTS.UPDATE_CAROUSEL, function() {
                            e.swiperInstance && e.swiperInstance.update()
                        })
                    }
                }, {
                    key: "BASE_CONF",
                    get: function() {
                        return {
                            direction: "horizontal",
                            navigation: {
                                nextEl: this.$options.id ? ".swiper-button-next-" + this.$options.id : ".swiper-button-next",
                                prevEl: this.$options.id ? ".swiper-button-prev-" + this.$options.id : ".swiper-button-prev"
                            },
                            a11y: {
                                prevSlideMessage: "Immagini precedenti",
                                nextSlideMessage: "Immagini successive",
                                paginationBulletMessage: "Vai all`mmagine {{index}}"
                            }
                        }
                    }
                }, {
                    key: "mount",
                    value: function(e, t) {
                        var n = p(p({}, this.BASE_CONF), t);
                        n.spaceBetween && (n.spaceBetween = Number(n.spaceBetween)), this.swiperInstance = new s.A(e, n)
                    }
                }])
            }(n(57467).A)
        },
        27903: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return s
                }
            });
            var r = n(92901),
                o = n(23029),
                c = n(50388),
                i = n(53954),
                u = n(15361);

            function a() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (a = function() {
                    return !!e
                })()
            }
            var s = function(e) {
                function t(e) {
                    var n, r, u, s;
                    return (0, o.A)(this, t), r = this, u = t, s = [e], u = (0, i.A)(u), (n = (0, c.A)(r, a() ? Reflect.construct(u, s || [], (0, i.A)(r).constructor) : u.apply(r, s))).mount(n.$el, n.$options), n
                }
                return (0, u.A)(t, e), (0, r.A)(t)
            }(n(12596).A)
        },
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return h
                }
            });
            var r = n(64467),
                o = n(23029),
                c = n(92901),
                i = n(50388),
                u = n(53954),
                a = n(15361),
                s = n(85349),
                l = n.n(s),
                p = n(24263);

            function f(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    t && (r = r.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, r)
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
                    var n, r, c, a;
                    return (0, o.A)(this, t), r = this, c = t, a = [e], c = (0, u.A)(c), (n = (0, i.A)(r, v() ? Reflect.construct(c, a || [], (0, u.A)(r).constructor) : c.apply(r, a)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, a.A)(t, e), (0, c.A)(t, [{
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
                                        (0, r.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : f(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(r) {
                            var o, c = t.cleanOptionKey(r);
                            o = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : t.convertType(n[r]), e[c] = o
                        }), (0, p.A)(e)
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
        }
    }
]);
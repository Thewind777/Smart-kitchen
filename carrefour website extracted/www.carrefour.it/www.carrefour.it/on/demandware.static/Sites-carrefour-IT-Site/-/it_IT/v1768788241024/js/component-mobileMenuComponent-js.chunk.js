"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [7557], {
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return E
                }
            });
            var o = n(64467),
                i = n(23029),
                r = n(92901),
                c = n(50388),
                a = n(53954),
                u = n(15361),
                s = n(85349),
                l = n.n(s),
                f = n(24263);

            function h(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(e);
                    t && (o = o.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), n.push.apply(n, o)
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
            var E = function(e) {
                function t(e) {
                    var n, o, r, u;
                    return (0, i.A)(this, t), o = this, r = t, u = [e], r = (0, a.A)(r), (n = (0, c.A)(o, p() ? Reflect.construct(r, u || [], (0, a.A)(o).constructor) : r.apply(o, u)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, u.A)(t, e), (0, r.A)(t, [{
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
                                    t % 2 ? h(Object(n), !0).forEach(function(t) {
                                        (0, o.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : h(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(o) {
                            var i, r = t.cleanOptionKey(o);
                            i = n[o].includes("{") && n[o].includes("}") ? JSON.parse(n[o].replace(/'/g, '"')) : t.convertType(n[o]), e[r] = i
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
                            o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && e && t && (o ? l().on(n, e, o, function(e) {
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
                            o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            i = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: o,
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
        58774: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return h
                }
            });
            var o = n(64467),
                i = n(23029),
                r = n(92901),
                c = n(50388),
                a = n(53954),
                u = n(15361),
                s = n(57467),
                l = n(67303);

            function f() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (f = function() {
                    return !!e
                })()
            }
            var h = function(e) {
                function t(e) {
                    var n, o, r, u;
                    return (0, i.A)(this, t), o = this, r = t, u = [e], r = (0, a.A)(r), (n = (0, c.A)(o, f() ? Reflect.construct(r, u || [], (0, a.A)(o).constructor) : r.apply(o, u))).setState({
                        open: !1
                    }), n.$options.isMobileApp ? n.$on("click", function(e) {
                        e.preventDefault(), (0, l.v)({
                            action: "SHOW_MENU"
                        })
                    }) : n.$on("click", function() {
                        return n.setState({
                            open: !n.state.open
                        })
                    }), n
                }
                return (0, u.A)(t, e), (0, r.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)((0, o.A)({}, this.CUSTOM_MESSAGES.BREAKPOINTER.BREAKPOINT_CHANGE, this.close), this.CUSTOM_MESSAGES.MOBILE_MENU.CLOSE, this.close)
                    }
                }, {
                    key: "close",
                    value: function() {
                        this.setState({
                            open: !1
                        })
                    }
                }, {
                    key: "stateChange",
                    value: function(e) {
                        "open" in e ? (this.$el.classList.toggle("hamburger--active", e.open), this.header = document.querySelector(".header"), this.header.classList.toggle("header--mobilemenu", e.open), e.open ? (this.EMIT(this.CUSTOM_MESSAGES.INTERACTION.PUSH, {
                            id: "mobileMenuComponent 2",
                            close: this.close.bind(this)
                        }), this.EMIT(this.CUSTOM_MESSAGES.BODY.TOGGLE_OVERLAY, {
                            scroll: !1
                        }), document.body.classList.add("menu-in"), this.$el.ariaLabel = "Chiudi") : (this.$el.ariaLabel = "Menu", document.body.classList.remove("menu-in"), this.EMIT(this.CUSTOM_MESSAGES.BODY.TOGGLE_SCROLL, {}))) : (this.EMIT(this.CUSTOM_MESSAGES.INTERACTION.REMOVE, {}), this.EMIT(this.CUSTOM_MESSAGES.BODY.TOGGLE_OVERLAY, {}))
                    }
                }])
            }(s.A)
        }
    }
]);
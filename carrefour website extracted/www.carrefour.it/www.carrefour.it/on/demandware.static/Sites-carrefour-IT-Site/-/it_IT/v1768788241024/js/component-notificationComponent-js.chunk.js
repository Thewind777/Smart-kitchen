(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [6951], {
        12215: function(i, t, n) {
            var e, o;
            ! function(a) {
                if (void 0 === (o = "function" == typeof(e = a) ? e.call(t, n, t, i) : e) || (i.exports = o), i.exports = a(), !!0) {
                    var c = window.Cookies,
                        r = window.Cookies = a();
                    r.noConflict = function() {
                        return window.Cookies = c, r
                    }
                }
            }(function() {
                function i() {
                    for (var i = 0, t = {}; i < arguments.length; i++) {
                        var n = arguments[i];
                        for (var e in n) t[e] = n[e]
                    }
                    return t
                }

                function t(i) {
                    return i.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
                }
                return function n(e) {
                    function o() {}

                    function a(t, n, a) {
                        if ("undefined" != typeof document) {
                            "number" == typeof(a = i({
                                path: "/"
                            }, o.defaults, a)).expires && (a.expires = new Date(1 * new Date + 864e5 * a.expires)), a.expires = a.expires ? a.expires.toUTCString() : "";
                            try {
                                var c = JSON.stringify(n);
                                /^[\{\[]/.test(c) && (n = c)
                            } catch (i) {}
                            n = e.write ? e.write(n, t) : encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                            var r = "";
                            for (var s in a) a[s] && (r += "; " + s, !0 !== a[s] && (r += "=" + a[s].split(";")[0]));
                            return document.cookie = t + "=" + n + r
                        }
                    }

                    function c(i, n) {
                        if ("undefined" != typeof document) {
                            for (var o = {}, a = document.cookie ? document.cookie.split("; ") : [], c = 0; c < a.length; c++) {
                                var r = a[c].split("="),
                                    s = r.slice(1).join("=");
                                n || '"' !== s.charAt(0) || (s = s.slice(1, -1));
                                try {
                                    var f = t(r[0]);
                                    if (s = (e.read || e)(s, f) || t(s), n) try {
                                        s = JSON.parse(s)
                                    } catch (i) {}
                                    if (o[f] = s, i === f) break
                                } catch (i) {}
                            }
                            return i ? o[i] : o
                        }
                    }
                    return o.set = a, o.get = function(i) {
                        return c(i, !1)
                    }, o.getJSON = function(i) {
                        return c(i, !0)
                    }, o.remove = function(t, n) {
                        a(t, "", i(n, {
                            expires: -1
                        }))
                    }, o.defaults = {}, o.withConverter = n, o
                }(function() {})
            })
        },
        52436: function(i, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                default: function() {
                    return h
                }
            });
            var e = n(64467),
                o = n(23029),
                a = n(92901),
                c = n(50388),
                r = n(53954),
                s = n(15361),
                f = n(57467),
                l = n(70200),
                u = n.n(l),
                d = n(12215),
                p = n.n(d);

            function _() {
                try {
                    var i = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (i) {}
                return (_ = function() {
                    return !!i
                })()
            }
            var h = function(i) {
                function t(i) {
                    var n, e, a, s;
                    return (0, o.A)(this, t), e = this, a = t, s = [i], a = (0, r.A)(a), (n = (0, c.A)(e, _() ? Reflect.construct(a, s || [], (0, r.A)(e).constructor) : a.apply(e, s))).notificationActiveId = "", n
                }
                return (0, s.A)(t, i), (0, a.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, e.A)((0, e.A)((0, e.A)((0, e.A)({}, this.CUSTOM_MESSAGES.NOTIFICATION.push, this.addNotification), this.CUSTOM_MESSAGES.NOTIFICATION.close, this.closeNotification), this.CUSTOM_MESSAGES.NOTIFICATION.pushall, this.addNotificationAll), this.CUSTOM_MESSAGES.NOTIFICATION.pushFirstAvailable, this.addFirstAvailableNotification)
                    }
                }, {
                    key: "addNotificationAll",
                    value: function(i) {
                        var t = this;
                        i.forEach(function(i) {
                            t.addNotification(i)
                        })
                    }
                }, {
                    key: "addFirstAvailableNotification",
                    value: function(i) {
                        var t = this,
                            n = i.notifications.find(function(i) {
                                return !t.isNotificationClosed(i)
                            });
                        n && setTimeout(function() {
                            t.addNotification(n)
                        }, 3e3)
                    }
                }, {
                    key: "addNotification",
                    value: function(i) {
                        var t = this;
                        if (this.notificationCanBeAdded(i)) {
                            var n = {};
                            n[i.id] = {
                                id: i.id,
                                title: i.notificationTitle,
                                description: i.notificationDescription,
                                icon: i.notificationIcon,
                                quietPeriod: i.notificationQuietPeriod,
                                maxViews: i.notificationMaxViews,
                                image: i.notificationImage,
                                rank: i.rank,
                                notificationPromoPush: i.notificationPromoPush,
                                notificationPost: i.notificationPost,
                                notificationCtaLink: i.notificationCtaLink,
                                notificationCtaLabel: i.notificationCtaLabel,
                                subtitle: i.notificationSubTitle,
                                isfirst: !1
                            }, this.setState(n), i.notificationToClose && this.closeNotification({
                                id: i.notificationToClose
                            }), i.notificationTimer && (setTimeout(function() {
                                t.$el.lastElementChild.classList.add("closing")
                            }, i.notificationTimer), setTimeout(function() {
                                t.closeNotification({
                                    id: i.id,
                                    skipCookie: !0
                                })
                            }, i.notificationTimer + 500)), document.querySelector("body").classList.add("notification-in")
                        }
                    }
                }, {
                    key: "closeNotification",
                    value: function(i) {
                        var t = this,
                            n = i.id,
                            e = i.skipCookie,
                            o = this.state[n];
                        if (o) {
                            e || p().set("c4_notification_closed_" + o.id, "true", {
                                expires: new Date((new Date).getTime() + 60 * o.quietPeriod * 1e3)
                            }), this.incrementViews(o), o.closed = !0;
                            var a = {};
                            a[n] = o, this.setState(a);
                            var c = Object.keys(this.state).some(function(i) {
                                return !t.state[i].closed
                            });
                            c || document.querySelector("body").classList.remove("notification-in"), this.EMIT(this.CUSTOM_MESSAGES.NOTIFICATION.closed, {
                                id: n
                            }), p().get("c4_notification_first_" + o.id) && p().remove("c4_notification_first_" + o.id)
                        }
                        this.$el.querySelectorAll(".push-notification").forEach(function(i) {
                            i.classList.add("opening")
                        })
                    }
                }, {
                    key: "stateChange",
                    value: function(i) {
                        var t = this,
                            n = Object.keys(this.state).map(function(i) {
                                return t.state[i]
                            }).sort(function(i, t) {
                                return i.rank - t.rank
                            }),
                            e = n.slice().reverse().find(function(i) {
                                return !i.closed
                            });
                        if (e) {
                            var o = n.findIndex(function(i) {
                                return i.id === e.id
                            });
                            this.notificationActiveId !== e.id && (this.emitTracking("Impression", null), this.notificationActiveId = e.id), e.notificationCtaLabel && e.notificationCtaLink && (n[o].trackLinkClass = "js-track-link"), p().get("c4_notification_first_" + e.id) || e.notificationTimer ? n[n.length - 1].isfirst = !1 : (n[o].isfirst = !0, setTimeout(function() {
                                p().set("c4_notification_first_" + e.id, "true")
                            }, 1e3))
                        }
                        this.$el.innerHTML = u()({
                            notifications: n
                        }), e && this.trackingClick(e)
                    }
                }, {
                    key: "closeFirtsNotification",
                    value: function() {
                        var i = this,
                            t = Object.keys(this.state).map(function(t) {
                                return i.state[t]
                            }).sort(function(i, t) {
                                return i.rank - t.rank
                            }).slice().reverse().find(function(i) {
                                return !i.closed
                            });
                        t && this.closeNotification({
                            id: t.id
                        })
                    }
                }, {
                    key: "notificationCanBeAdded",
                    value: function(i) {
                        if (!this.state[i.id] || i.closed) {
                            var t = p().get("c4_notification_closed_" + i.id),
                                n = p().get("c4_notification_views_" + i.id),
                                e = p().get("c4_notification_shown_" + i.id);
                            return !(t && "true" === t || n && n >= i.maxViews || n && n >= i.notificationMaxViews || e && "true" === e)
                        }
                    }
                }, {
                    key: "isNotificationClosed",
                    value: function(i) {
                        var t = p().get("c4_notification_closed_" + i.id),
                            n = p().get("c4_notification_views_" + i.id),
                            e = p().get("c4_notification_shown_" + i.id);
                        return !!(t && "true" === t || n && n >= i.notificationMaxViews || e && "true" === e)
                    }
                }, {
                    key: "incrementViews",
                    value: function(i) {
                        var t = p().get("c4_notification_views_" + i.id);
                        p().set("c4_notification_views_" + i.id, t ? +t + 1 : 1)
                    }
                }, {
                    key: "emitTracking",
                    value: function(i, t) {
                        this.EMIT(this.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                            eventCategory: "Push banner",
                            eventAction: i,
                            eventLabel: t
                        })
                    }
                }, {
                    key: "trackingClick",
                    value: function(i) {
                        var t = this,
                            n = document.querySelector(".js-track-link");
                        this.$on("click", function(n) {
                            t.emitTracking("Click", i.id + " - " + i.notificationCtaLabel)
                        }, n)
                    }
                }])
            }(f.A)
        },
        57467: function(i, t, n) {
            "use strict";
            n.d(t, {
                A: function() {
                    return _
                }
            });
            var e = n(64467),
                o = n(23029),
                a = n(92901),
                c = n(50388),
                r = n(53954),
                s = n(15361),
                f = n(85349),
                l = n.n(f),
                u = n(24263);

            function d(i, t) {
                var n = Object.keys(i);
                if (Object.getOwnPropertySymbols) {
                    var e = Object.getOwnPropertySymbols(i);
                    t && (e = e.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(i, t).enumerable
                    })), n.push.apply(n, e)
                }
                return n
            }

            function p() {
                try {
                    var i = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (i) {}
                return (p = function() {
                    return !!i
                })()
            }
            var _ = function(i) {
                function t(i) {
                    var n, e, a, s;
                    return (0, o.A)(this, t), e = this, a = t, s = [i], a = (0, r.A)(a), (n = (0, c.A)(e, p() ? Reflect.construct(a, s || [], (0, r.A)(e).constructor) : a.apply(e, s)))._componentElement = i, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, s.A)(t, i), (0, a.A)(t, [{
                    key: "$el",
                    get: function() {
                        return this._componentElement
                    }
                }, {
                    key: "$options",
                    get: function() {
                        var i = {},
                            n = function(i) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var n = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? d(Object(n), !0).forEach(function(t) {
                                        (0, e.A)(i, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(n)) : d(Object(n)).forEach(function(t) {
                                        Object.defineProperty(i, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return i
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(i) {
                            return i.includes("option")
                        }).forEach(function(e) {
                            var o, a = t.cleanOptionKey(e);
                            o = n[e].includes("{") && n[e].includes("}") ? JSON.parse(n[e].replace(/'/g, '"')) : t.convertType(n[e]), i[a] = o
                        }), (0, u.A)(i)
                    }
                }, {
                    key: "COMPONENT_NAME",
                    get: function() {
                        return this.$el.getAttribute("data-component")
                    }
                }, {
                    key: "$on",
                    value: function(i, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el,
                            e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        n && i && t && (e ? l().on(n, i, e, function(i) {
                            i && i.stopPropagation(), t(i)
                        }) : l().on(n, i, function(i) {
                            i && i.stopPropagation(), t(i)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(i, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        l().one(n, i, t)
                    }
                }, {
                    key: "$off",
                    value: function(i) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().off(t, i)
                    }
                }, {
                    key: "$fire",
                    value: function(i) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        l().fire(t, i)
                    }
                }, {
                    key: "loading",
                    value: function(i, t) {
                        this._loading = !0, this.EMIT(this.CUSTOM_MESSAGES.LOADER_EVENTS.show, {
                            container: i || document.body,
                            message: null != t ? t : null
                        })
                    }
                }, {
                    key: "endLoading",
                    value: function(i, t) {
                        var n = this,
                            e = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            o = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: i || document.body,
                                message: t,
                                error: e,
                                icon: o
                            })
                        }, 400)
                    }
                }], [{
                    key: "convertType",
                    value: function(i) {
                        var t;
                        switch (i) {
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
                                t = i
                        }
                        return t
                    }
                }, {
                    key: "cleanOptionKey",
                    value: function(i) {
                        var t = i.replace("option", "");
                        return "".concat(t.charAt(0).toLocaleLowerCase()).concat(t.slice(1))
                    }
                }])
            }(n(39860).A)
        },
        70200: function(module) {
            module.exports = function anonymous(locals, escapeFn, include, rethrow) {
                rethrow = rethrow || function(i, t, n, e, o) {
                    var a = t.split("\n"),
                        c = Math.max(e - 3, 0),
                        r = Math.min(a.length, e + 3),
                        s = o(n),
                        f = a.slice(c, r).map(function(i, t) {
                            var n = t + c + 1;
                            return (n == e ? " >> " : "    ") + n + "| " + i
                        }).join("\n");
                    throw i.path = s, i.message = (s || "ejs") + ":" + e + "\n" + f + "\n\n" + i.message, i
                }, escapeFn = escapeFn || function(i) {
                    return null == i ? "" : String(i).replace(_MATCH_HTML, encode_char)
                };
                var _ENCODE_HTML_RULES = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&#34;",
                        "'": "&#39;"
                    },
                    _MATCH_HTML = /[&<>'"]/g;

                function encode_char(i) {
                    return _ENCODE_HTML_RULES[i] || i
                }
                var __line = 1,
                    __lines = '<% if (notifications && notifications.length > 0) { %> <% notifications.forEach(function(notification,index){ %> <% if (!notification.closed) { %>\n<div class="push-notification <% if (notification.isfirst) { %> first-time <% } %><% if (notification.notificationPost) { %> post-notification <% } %> ">\n    <div class="notification-header">\n        <p><img src="<%= notification.icon %>" alt="<%= notification.title %>" /><%= notification.title %></p>\n        <button class="notification-close" data-option-notification-id="<%= notification.id %>" data-component="closeNotificationComponent" aria-label="chiudi notifica"></button>\n    </div>\n    <div class="notification-body">\n        <img class="notification-image lazyload" src="<%= notification.image %>" alt="<%- notification.description %>" />\n        <div>\n            <% if (notification.subtitle) {%>\n            <p class="subtitle"><%- notification.subtitle %></p>\n            <%}%>\n            <p><%- notification.description %></p>\n            <% if (notification.notificationCtaLabel && notification.notificationCtaLink) {%>\n            <a href="<%- notification.notificationCtaLink %>" class="btn btn-primary <% if (notification.trackLinkClass) { %> <%- notification.trackLinkClass %> <% } %>"\n                ><%- notification.notificationCtaLabel %></a\n            >\n            <%}%>\n        </div>\n    </div>\n</div>\n<% } %> <% }); %> <% } %>\n',
                    __filename = "src/microtemplates/notification/notificationList.ejs";
                try {
                    var __output = "";

                    function __append(i) {
                        null != i && (__output += i)
                    }
                    with(locals || {}) notifications && notifications.length > 0 && (__append(" "), notifications.forEach(function(i, t) {
                        __append(" "), i.closed || (__append('\n<div class="push-notification '), __line = 2, i.isfirst && __append(" first-time "), i.notificationPost && __append(" post-notification "), __append(' ">\n    <div class="notification-header">\n        <p><img src="'), __line = 4, __append(escapeFn(i.icon)), __append('" alt="'), __append(escapeFn(i.title)), __append('" />'), __append(escapeFn(i.title)), __append('</p>\n        <button class="notification-close" data-option-notification-id="'), __line = 5, __append(escapeFn(i.id)), __append('" data-component="closeNotificationComponent" aria-label="chiudi notifica"></button>\n    </div>\n    <div class="notification-body">\n        <img class="notification-image lazyload" src="'), __line = 8, __append(escapeFn(i.image)), __append('" alt="'), __append(i.description), __append('" />\n        <div>\n            '), __line = 10, i.subtitle && (__append('\n            <p class="subtitle">'), __line = 11, __append(i.subtitle), __append("</p>\n            "), __line = 12), __append("\n            <p>"), __line = 13, __append(i.description), __append("</p>\n            "), __line = 14, i.notificationCtaLabel && i.notificationCtaLink && (__append('\n            <a href="'), __line = 15, __append(i.notificationCtaLink), __append('" class="btn btn-primary '), i.trackLinkClass && (__append(" "), __append(i.trackLinkClass), __append(" ")), __append('"\n                >'), __line = 16, __append(i.notificationCtaLabel), __append("</a\n            >\n            "), __line = 18), __append("\n        </div>\n    </div>\n</div>\n"), __line = 22), __append(" ")
                    }), __append(" ")), __append("\n"), __line = 23;
                    return __output
                } catch (e) {
                    rethrow(e, __lines, __filename, __line, escapeFn)
                }
            }
        }
    }
]);
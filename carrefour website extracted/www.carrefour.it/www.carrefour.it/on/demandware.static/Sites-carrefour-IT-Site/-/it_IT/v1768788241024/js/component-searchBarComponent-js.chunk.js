"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [4663], {
        8732: function(e, t, n) {
            n.d(t, {
                Em: function() {
                    return f
                },
                Jt: function() {
                    return p
                },
                bE: function() {
                    return d
                }
            });
            var r = n(10467),
                a = n(80296),
                i = n(54756),
                s = n.n(i),
                o = n(72505),
                c = n.n(o),
                u = n(79889),
                l = (n(57520), c().create({
                    transformRequest: [function(e, t) {
                        if (t && t.skiptransform) return delete t.skiptransform, e;
                        if (e && Object.entries(e)) {
                            for (var n = new FormData, r = 0, i = Object.entries(e); r < i.length; r++) {
                                var s = (0, a.A)(i[r], 2),
                                    o = s[0],
                                    c = s[1];
                                n.append(o, c)
                            }
                            return n
                        }
                    }]
                })),
                h = function() {
                    var e = (0, r.A)(s().mark(function e(t) {
                        var n, r;
                        return s().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return n = t.googleRecaptchaAction, r = t.googleRecaptchaClientSide, e.abrupt("return", new Promise(function(e, t) {
                                        window.grecaptcha.ready(function() {
                                            window.grecaptcha.execute(r, {
                                                action: n
                                            }).then(function(t) {
                                                e(t)
                                            })
                                        })
                                    }));
                                case 1:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }();
            l.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest", l.interceptors.request.use(function() {
                var e = (0, r.A)(s().mark(function e(t) {
                    var n;
                    return s().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                if (!(t.data && t.data.googleRecaptchaAction && t.data.googleRecaptchaClientSide && window.grecaptcha)) {
                                    e.next = 2;
                                    break
                                }
                                return e.next = 1, h(t.data);
                            case 1:
                                return n = e.sent, t.data.googleRecaptchaToken = n, e.abrupt("return", t);
                            case 2:
                                return e.abrupt("return", t);
                            case 3:
                            case "end":
                                return e.stop()
                        }
                    }, e)
                }));
                return function(t) {
                    return e.apply(this, arguments)
                }
            }(), function(e) {
                return Promise.reject(e)
            }), l.interceptors.response.use(function(e) {
                var t = new u.A;
                if (e.data && e.data.pushState || e.data.replaceState) e.data.pushState && history.pushState({}, "", e.data.pushState), e.data.replaceState && history.replaceState({}, "", e.data.replaceState), e.data.redirectUrl && setTimeout(function() {
                    location.href = e.data.redirectUrl
                }, 500);
                else if (e.data && e.data.redirectUrl) {
                    var n = e.data.redirectUrl,
                        r = "";
                    e.data.isPaybackPopupActive && (r = n.indexOf("?") > -1 ? "&isPaybackPopupActive=true" : "?isPaybackPopupActive=true"), n += r;
                    var a = "";
                    e.data.subscriptionTrialModalNotEligibleAfterLogin && (a = n.indexOf("?") > -1 ? "&subscriptionTrialModalNotEligibleAfterLogin=true" : "?subscriptionTrialModalNotEligibleAfterLogin=true"), location.href = n + a
                }
                if (e.data && e.data.error && (e.config.data instanceof FormData && (e.config.data = Object.fromEntries(e.config.data), e.config.headers["Content-Type"] = "application/json"), t.EMIT("error.".concat(e.data.error), {
                        res: e
                    })), e.data && e.data.notificationPush && e.data.notificationPush.showNotification && t.EMIT("notification:push", e.data.notificationPush), e.data && e.data.pushPromoPre && e.data.pushPromoPre.length > 0) {
                    var i = e.data.pushPromoPre.sort(function(e, t) {
                        return e.rank > t.rank ? -1 : t.rank > e.rank ? 1 : 0
                    });
                    t.EMIT("notification:pushFirstAvailable", {
                        notifications: i
                    })
                }
                return e.data && e.data.pushPromoPost && t.EMIT("notification:pushall", e.data.pushPromoPost), e
            }, function(e) {
                var t, n;
                return null !== (t = e.response) && void 0 !== t && t.data && null !== (n = e.response) && void 0 !== n && null !== (n = n.data) && void 0 !== n && n.redirectUrl && (location.href = e.response.data.redirectUrl), Promise.reject(e)
            });
            c().CancelToken;
            var p = l.get,
                d = l.post,
                f = (l.all, l.spread, l.request)
        },
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return f
                }
            });
            var r = n(64467),
                a = n(23029),
                i = n(92901),
                s = n(50388),
                o = n(53954),
                c = n(15361),
                u = n(85349),
                l = n.n(u),
                h = n(24263);

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
            var f = function(e) {
                function t(e) {
                    var n, r, i, c;
                    return (0, a.A)(this, t), r = this, i = t, c = [e], i = (0, o.A)(i), (n = (0, s.A)(r, d() ? Reflect.construct(i, c || [], (0, o.A)(r).constructor) : i.apply(r, c)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, c.A)(t, e), (0, i.A)(t, [{
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
                            var a, i = t.cleanOptionKey(r);
                            a = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : t.convertType(n[r]), e[i] = a
                        }), (0, h.A)(e)
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
                            a = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: r,
                                icon: a
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
        79356: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return v
                }
            });
            var r = n(10467),
                a = n(64467),
                i = n(45458),
                s = n(23029),
                o = n(92901),
                c = n(50388),
                u = n(53954),
                l = n(15361),
                h = n(54756),
                p = n.n(h),
                d = n(57467),
                f = n(4523),
                S = n(8732);

            function g() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (g = function() {
                    return !!e
                })()
            }
            var v = function(e) {
                function t(e) {
                    var n, r, a, o;
                    return (0, s.A)(this, t), r = this, a = t, o = [e], a = (0, u.A)(a), (n = (0, c.A)(r, g() ? Reflect.construct(a, o || [], (0, u.A)(r).constructor) : a.apply(r, o))).$extWrapper = n.$el.querySelector(".suggestions-ext-wrapper"), n.$wrapper = n.$el.querySelector(".suggestions-wrapper"), n.$input = n.$el.querySelector(".input-bar"), n.$clearSearch = n.$el.querySelector(n.SELECTORS.clearSearch), n.$multiSearch = n.$el.querySelector(n.SELECTORS.multiSearch), n.keywordsSelector = document.querySelector(".js-search-keyword"), n.init(), n.addSearchButtonOnClickAnalytics(), n.$input === document.activeElement && n.open(), n.$on("focus.openSearchBar", function() {
                        n.open()
                    }, n.$input), n.$on("blur.closeSearchBar", function() {
                        if (0 == n.$wrapper.childElementCount && 0 == n.$extWrapper.childElementCount) n.close();
                        else {
                            var e, t = (0, i.A)(document.querySelectorAll("#search-results a")).at(-1),
                                r = null === (e = n.$multiSearch) || void 0 === e ? void 0 : e.querySelector("button");
                            n.$on("blur", function(e) {
                                e.relatedTarget && n.$wrapper.contains(relatedTarget) || (n.close(), r && r.focus())
                            }, t)
                        }
                    }, n.$input), n.$on("click.clearSearchBar", function(e) {
                        e.preventDefault(), n.$clearSearch.classList.remove(n.CLASSES.showClear), n.$input.value = "", n.getSuggestions("")
                    }, n.$clearSearch), n.$on("click.closeSearchBar", function(e) {
                        e.preventDefault(), n.setState({
                            isOpen: !1
                        })
                    }, n.$clearSearch.querySelector("span")), n
                }
                return (0, l.A)(t, e), (0, o.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, a.A)({}, this.CUSTOM_MESSAGES.PRODUCT_SEARCH_EVENTS.closeSearchBar, this.close)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            input: ".input-bar",
                            clearSearch: ".js-clear-btn",
                            wrapper: ".suggestions-wrapper",
                            header: "header.header",
                            multiSearch: ".multi-search",
                            submitButton: ".js-search-btn",
                            extWrapper: ".suggestions-ext-wrapper",
                            staticBanner: ".search-bar-banner",
                            citrusBanner: ".citrus-component-wrapper",
                            form: 'form[name="search-bar-form"]'
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            showClear: "show",
                            active: "active",
                            showSuggestions: "suggestions-true"
                        }
                    }
                }, {
                    key: "init",
                    value: function() {
                        if (this.keywordsSelector) {
                            var e = this.keywordsSelector.textContent;
                            this.$input.setAttribute("value", (null == e ? void 0 : e.trim()) || ""), this.$clearSearch.classList.add(this.CLASSES.showClear)
                        }
                    }
                }, {
                    key: "open",
                    value: function() {
                        this.setState({
                            isOpen: !0
                        }), this.state.isOpen && "" != this.$input.value && (this.$clearSearch.classList.add(this.CLASSES.showClear), this.getSuggestions(this.$input.value))
                    }
                }, {
                    key: "close",
                    value: function() {
                        this.setState({
                            isOpen: !1
                        })
                    }
                }, {
                    key: "stateChange",
                    value: function(e) {
                        if ("isOpen" in e) {
                            var t = document.querySelector(".timeslot-expiry-alert");
                            e.isOpen ? (this.$multiSearch && this.$multiSearch.classList.remove("no-display"), t && t.classList.add("under-search"), this.$el.classList.add(this.CLASSES.active), this.EMIT(this.CUSTOM_MESSAGES.INTERACTION.PUSH, {
                                id: "searchBarComponent",
                                close: this.close.bind(this)
                            }), this.startSuggestions(), document.querySelector(".header").classList.add("overlay-search-bar"), document.body.classList.add("no-scroll"), this.$on("click.outsite", this.clickOutsite.bind(this), document.body), this.getSuggestions(this.$input.value)) : (this.$multiSearch && this.$multiSearch.classList.add("no-display"), this.$input.blur(), this.EMIT(this.CUSTOM_MESSAGES.INTERACTION.REMOVE, {}), this.$el.classList.remove(this.CLASSES.active), t && t.classList.remove("under-search"), this.$wrapper.innerHTML = "", this.checkSuggestionsContent(), this.$off("click.outsite", document.body), this.EMIT(this.CUSTOM_MESSAGES.BODY.TOGGLE_OVERLAY, {}), document.querySelector(".header").classList.remove("overlay-search-bar"), document.body.classList.remove("no-scroll"))
                        }
                        "input" in e && this.getSuggestions(e.input)
                    }
                }, {
                    key: "a11yNavigationOptions",
                    value: function() {
                        var e = this,
                            t = (0, i.A)(this.$wrapper.querySelectorAll('li[role="option"] a'));
                        t && t.length > 0 && t.forEach(function(n, r) {
                            n.addEventListener("keydown", function(n) {
                                if ("ArrowDown" === n.key) {
                                    n.preventDefault();
                                    var a = (r + 1) % t.length;
                                    t[a].focus()
                                }
                                if ("ArrowUp" === n.key) {
                                    n.preventDefault();
                                    var i = (r - 1 + t.length) % t.length;
                                    t[i].focus()
                                }
                                "Escape" === n.key && (e.close(), e.$el.querySelector(e.SELECTORS.submitButton).focus())
                            })
                        })
                    }
                }, {
                    key: "getSuggestions",
                    value: (n = (0, r.A)(p().mark(function e(t) {
                        var n, r, a, i, s, o, c, u, l, h, d;
                        return p().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (!((r = t.trim()).length < 3)) {
                                        e.next = 2;
                                        break
                                    }
                                    return "" == r ? this.$clearSearch.classList.remove(this.CLASSES.showClear) : this.$clearSearch.classList.add(this.CLASSES.showClear), this.$wrapper.innerHTML = "", this.checkSuggestionsContent(), e.next = 1, (0, S.Jt)(this.$wrapper.dataset.popularUrl);
                                case 1:
                                    return i = e.sent, s = i.data, o = s.success, c = s.result, this.$el.querySelector(this.SELECTORS.staticBanner).classList.remove("d-none"), this.endLoading(this.$wrapper), o ? (this.$wrapper.innerHTML = c, this.a11yNavigationOptions(), this.checkSuggestionsContent()) : (this.$wrapper.innerHTML = "", this.checkSuggestionsContent()), null === (a = this.$el.querySelector(this.SELECTORS.citrusBanner)) || void 0 === a || a.classList.add("d-none"), this.addSearchSuggestionsOnClickAnalytics(), e.abrupt("return");
                                case 2:
                                    return this.$clearSearch.classList.add(this.CLASSES.showClear), this.$el.querySelector(this.SELECTORS.staticBanner).classList.add("d-none"), this.$wrapper.innerHTML = "", this.loading(this.$wrapper), this.checkSuggestionsContent(), e.next = 3, (0, S.Jt)(this.$wrapper.dataset.url + encodeURIComponent(r));
                                case 3:
                                    u = e.sent, l = u.data, h = l.success, d = l.result, this.endLoading(this.$wrapper), h ? (this.$wrapper.innerHTML = d, this.a11yNavigationOptions(), this.checkSuggestionsContent()) : (this.$wrapper.innerHTML = "", this.checkSuggestionsContent()), this.addSearchSuggestionsOnClickAnalytics(), null === (n = this.$el.querySelector(this.SELECTORS.citrusBanner)) || void 0 === n || n.classList.remove("d-none");
                                case 4:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function(e) {
                        return n.apply(this, arguments)
                    })
                }, {
                    key: "startSuggestions",
                    value: function() {
                        var e = this;
                        this.$on("input.search-bar", (0, f.sg)(function(t) {
                            e.$input === document.activeElement && e.open(), e.setState({
                                input: t.currentTarget.value
                            })
                        }, 250), this.$input)
                    }
                }, {
                    key: "clickOutsite",
                    value: function(e) {
                        this.$el.contains(e.target) || this.$input === document.activeElement || this.setState({
                            isOpen: !1
                        })
                    }
                }, {
                    key: "checkSuggestionsContent",
                    value: function() {
                        this.$el.classList["" == this.$wrapper.innerHTML ? "remove" : "add"](this.CLASSES.showSuggestions)
                    }
                }, {
                    key: "addSearchButtonOnClickAnalytics",
                    value: function() {
                        var e, t = this,
                            n = this.$el.querySelector(this.SELECTORS.form),
                            r = n.querySelector('input[name="q"]');
                        n.onsubmit = function(e) {
                            (null == r ? void 0 : r.value.trim()) ? t.onClickAnalytics("Submit", "", ""): (e.preventDefault(), e.stopImmediatePropagation(), r.focus())
                        }, (null === (e = this.$multiSearch) || void 0 === e ? void 0 : e.querySelector("button")).onclick = function() {
                            t.onClickAnalytics("Click_Keyword", "ricerca veloce", "ricerca veloce")
                        };
                        var a = this.$el.querySelector(this.SELECTORS.staticBanner);
                        a && (a.onclick = function() {
                            t.onClickAnalytics("Click_Keyword", "search banner", "search banner")
                        })
                    }
                }, {
                    key: "addSearchSuggestionsOnClickAnalytics",
                    value: function() {
                        var e = document.getElementsByClassName("search-results-products");
                        this.appendOnClickToSearchResults(e, "Keyword_suggestion");
                        var t = document.getElementsByClassName("search-results-category");
                        this.appendOnClickToSearchResults(t, "listing");
                        var n = document.getElementsByClassName("search-results-recent");
                        this.appendOnClickToSearchResults(n, "prodotti_piu_cercati")
                    }
                }, {
                    key: "appendOnClickToSearchResults",
                    value: function(e, t) {
                        var n = this;
                        e[0] && [].slice.call(e[0].children).forEach(function(e) {
                            e.children[0] && (e.children[0].onclick = function() {
                                n.onClickAnalytics("Click_Keyword", e.children[0].innerText, t)
                            })
                        })
                    }
                }, {
                    key: "onClickAnalytics",
                    value: function(e, t, n) {
                        var r, a = this.getKeywords("search-results-category"),
                            s = this.getKeywords("search-results-products"),
                            o = this.getKeywords("popular-suggestions"),
                            c = null;
                        null === (r = (0, i.A)(document.getElementsByName("search-bar-form"))) || void 0 === r || r.forEach(function(e) {
                            var t;
                            if (!c) {
                                var n = null === (t = e.querySelector(".input-bar")) || void 0 === t ? void 0 : t.value;
                                n && (c = n)
                            }
                        });
                        var u = [].concat((0, i.A)(a), (0, i.A)(s), (0, i.A)(o));
                        window.dataLayer && window.dataLayer.push({
                            event: "search",
                            search_term: c || "search_interaction",
                            search_action: e,
                            search_suggestion: u.join(","),
                            search_selection: t,
                            search_section: n
                        })
                    }
                }, {
                    key: "getKeywords",
                    value: function(e) {
                        var t = document.getElementsByClassName(e);
                        return t[0] ? [].slice.call(t[0].children).map(function(e) {
                            return e.innerText
                        }) : ""
                    }
                }]);
                var n
            }(d.A)
        }
    }
]);
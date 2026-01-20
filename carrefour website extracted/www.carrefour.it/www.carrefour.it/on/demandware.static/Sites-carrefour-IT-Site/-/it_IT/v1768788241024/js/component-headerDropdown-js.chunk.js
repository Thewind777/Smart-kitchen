"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [3759], {
        8732: function(e, t, n) {
            n.d(t, {
                Em: function() {
                    return f
                },
                Jt: function() {
                    return p
                },
                bE: function() {
                    return m
                }
            });
            var r = n(10467),
                i = n(80296),
                a = n(54756),
                o = n.n(a),
                c = n(72505),
                s = n.n(c),
                u = n(79889),
                d = (n(57520), s().create({
                    transformRequest: [function(e, t) {
                        if (t && t.skiptransform) return delete t.skiptransform, e;
                        if (e && Object.entries(e)) {
                            for (var n = new FormData, r = 0, a = Object.entries(e); r < a.length; r++) {
                                var o = (0, i.A)(a[r], 2),
                                    c = o[0],
                                    s = o[1];
                                n.append(c, s)
                            }
                            return n
                        }
                    }]
                })),
                l = function() {
                    var e = (0, r.A)(o().mark(function e(t) {
                        var n, r;
                        return o().wrap(function(e) {
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
            d.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest", d.interceptors.request.use(function() {
                var e = (0, r.A)(o().mark(function e(t) {
                    var n;
                    return o().wrap(function(e) {
                        for (;;) switch (e.prev = e.next) {
                            case 0:
                                if (!(t.data && t.data.googleRecaptchaAction && t.data.googleRecaptchaClientSide && window.grecaptcha)) {
                                    e.next = 2;
                                    break
                                }
                                return e.next = 1, l(t.data);
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
            }), d.interceptors.response.use(function(e) {
                var t = new u.A;
                if (e.data && e.data.pushState || e.data.replaceState) e.data.pushState && history.pushState({}, "", e.data.pushState), e.data.replaceState && history.replaceState({}, "", e.data.replaceState), e.data.redirectUrl && setTimeout(function() {
                    location.href = e.data.redirectUrl
                }, 500);
                else if (e.data && e.data.redirectUrl) {
                    var n = e.data.redirectUrl,
                        r = "";
                    e.data.isPaybackPopupActive && (r = n.indexOf("?") > -1 ? "&isPaybackPopupActive=true" : "?isPaybackPopupActive=true"), n += r;
                    var i = "";
                    e.data.subscriptionTrialModalNotEligibleAfterLogin && (i = n.indexOf("?") > -1 ? "&subscriptionTrialModalNotEligibleAfterLogin=true" : "?subscriptionTrialModalNotEligibleAfterLogin=true"), location.href = n + i
                }
                if (e.data && e.data.error && (e.config.data instanceof FormData && (e.config.data = Object.fromEntries(e.config.data), e.config.headers["Content-Type"] = "application/json"), t.EMIT("error.".concat(e.data.error), {
                        res: e
                    })), e.data && e.data.notificationPush && e.data.notificationPush.showNotification && t.EMIT("notification:push", e.data.notificationPush), e.data && e.data.pushPromoPre && e.data.pushPromoPre.length > 0) {
                    var a = e.data.pushPromoPre.sort(function(e, t) {
                        return e.rank > t.rank ? -1 : t.rank > e.rank ? 1 : 0
                    });
                    t.EMIT("notification:pushFirstAvailable", {
                        notifications: a
                    })
                }
                return e.data && e.data.pushPromoPost && t.EMIT("notification:pushall", e.data.pushPromoPost), e
            }, function(e) {
                var t, n;
                return null !== (t = e.response) && void 0 !== t && t.data && null !== (n = e.response) && void 0 !== n && null !== (n = n.data) && void 0 !== n && n.redirectUrl && (location.href = e.response.data.redirectUrl), Promise.reject(e)
            });
            s().CancelToken;
            var p = d.get,
                m = d.post,
                f = (d.all, d.spread, d.request)
        },
        12220: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return _
                }
            });
            var r = n(10467),
                i = n(45458),
                a = n(64467),
                o = n(23029),
                c = n(92901),
                s = n(50388),
                u = n(53954),
                d = n(15361),
                l = n(54756),
                p = n.n(l),
                m = n(57467),
                f = n(67303),
                h = n(2078),
                v = n(62070),
                g = n(8732);

            function y() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (y = function() {
                    return !!e
                })()
            }
            var _ = function(e) {
                function t(e) {
                    var n, r, i, a;
                    (0, o.A)(this, t), r = this, i = t, a = [e], i = (0, u.A)(i), (n = (0, s.A)(r, y() ? Reflect.construct(i, a || [], (0, u.A)(r).constructor) : i.apply(r, a))).setState({
                        isOpen: !1
                    }), n.trap = null, n.handleEscapeTrigger();
                    var c = n.$options.isMobileApp,
                        d = n.$options.name;
                    return !c || null != d && "undefined" != d ? n.$on("click", n.openDropdown.bind(n), n.$el, n.$triggers) : n.$on("click", function(e) {
                        e.preventDefault(), (0, f.v)({
                            action: "OPEN_LOGIN"
                        })
                    }), n
                }
                return (0, d.A)(t, e), (0, c.A)(t, [{
                    key: "SELECTORS",
                    get: function() {
                        return {
                            dropdown: ".header-dropdown-panel",
                            triggers: ".header-dropdown-trigger",
                            loginBtn: ".header-button-login"
                        }
                    }
                }, {
                    key: "Messages",
                    get: function() {
                        return (0, a.A)({}, this.CUSTOM_MESSAGES.BREAKPOINTER.BREAKPOINT_CHANGE, this.resetDropdown)
                    }
                }, {
                    key: "$dropdown",
                    get: function() {
                        return this._dropdown || (this._dropdown = this.$el.querySelector(this.SELECTORS.dropdown)), this._dropdown
                    }
                }, {
                    key: "$triggers",
                    get: function() {
                        return this._buttons || (this._buttons = (0, i.A)(this.$el.querySelectorAll(this.SELECTORS.triggers))), this._buttons
                    }
                }, {
                    key: "handleEscapeTrigger",
                    value: function() {
                        var e = this;
                        document.addEventListener("keydown", function(t) {
                            "Escape" === t.key && e.closeDropdown()
                        })
                    }
                }, {
                    key: "openDropdown",
                    value: function(e) {
                        var t;
                        if (e.currentTarget.classList.contains("active")) this.closeDropdown();
                        else {
                            "header-user" == e.currentTarget.getAttribute("data-dropdown-class") && this.EMIT(this.CUSTOM_MESSAGES.DROPDOWN_EVENTS.toclear, {}), document.querySelector(".editorial-dropdown") && document.querySelector(".editorial-dropdown").classList.contains("active") && !e.currentTarget.classList.contains("editorial-dropdown") && document.querySelector(".editorial-dropdown").querySelector(".header-dropdown-trigger.active").click(), document.querySelector(".header-my-account").classList.contains("active") && !e.currentTarget.classList.contains("header-my-account") && document.querySelector(".header-my-account").querySelector(".header-dropdown-trigger.active").click(), this.$triggers.map(function(e) {
                                e.classList.remove("active"), e.ariaExpanded = !1
                            }), e.currentTarget.classList.add("active"), e.currentTarget.ariaExpanded = !0, this.$dropdown.dataset.dropdownClass = null !== (t = e.currentTarget.dataset) && void 0 !== t && t.dropdownClass ? e.currentTarget.dataset.dropdownClass : "", this.setState({
                                isOpen: !0
                            });
                            var n = {
                                area: "header",
                                type: "right_section",
                                url: "",
                                text: e.currentTarget.innerText ? e.currentTarget.innerText : ""
                            };
                            (0, v.Qw)(n), this.setModalTrap(e.currentTarget)
                        }
                    }
                }, {
                    key: "setModalTrap",
                    value: function(e) {
                        var t = this;
                        setTimeout(function() {
                            var n = e.parentElement.querySelector(t.SELECTORS.dropdown);
                            n.setAttribute("aria-labelledby", e.getAttribute("data-id")), n.setAttribute("aria-modal", !0), t.trap = h.K(n, {
                                clickOutsideDeactivates: !0
                            }), t.trap.activate()
                        }, 200)
                    }
                }, {
                    key: "closeDropdown",
                    value: function() {
                        this.setState({
                            isOpen: !1
                        }), this.trap && this.trap.deactivate()
                    }
                }, {
                    key: "stateChange",
                    value: function(e) {
                        "isOpen" in e && this.handleOpen(e.isOpen)
                    }
                }, {
                    key: "handleOpen",
                    value: function(e) {
                        this.EMIT(e ? this.CUSTOM_MESSAGES.INTERACTION.PUSH : this.CUSTOM_MESSAGES.INTERACTION.REMOVE, e ? {
                            id: "headerDropdown",
                            close: this.closeDropdown.bind(this)
                        } : {}), this.addClasses(e), this[e ? "$on" : "$off"]("click.outsite", e ? this.clickOutsite.bind(this) : document.body, document.body), this.EMIT(this.CUSTOM_MESSAGES.BODY.TOGGLE_OVERLAY, e ? {
                            overlayNoHeader: !0,
                            scroll: !1
                        } : {})
                    }
                }, {
                    key: "addClasses",
                    value: function(e) {
                        this.$el.classList[e ? "add" : "remove"]("active"), this.$dropdown.classList[e ? "add" : "remove"]("open"), e || this.$triggers.map(function(e) {
                            e.classList.remove("active"), e.ariaExpanded = !1
                        })
                    }
                }, {
                    key: "clickOutsite",
                    value: function(e) {
                        this.$el.contains(e.target) || this.setState({
                            isOpen: !1
                        })
                    }
                }, {
                    key: "resetDropdown",
                    value: function() {
                        this.closeDropdown(), this.EMIT(this.CUSTOM_MESSAGES.BODY.TOGGLE_OVERLAY, {})
                    }
                }, {
                    key: "renderLoginPopup",
                    value: (n = (0, r.A)(p().mark(function e(t) {
                        var n, r, i, a, o, c, s, u = this;
                        return p().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (!((n = document.querySelectorAll(".header-my-account-container")) && n.length > 0)) {
                                        e.next = 4;
                                        break
                                    }
                                    if (r = n[0].getAttribute("data-option-auth"), i = n[0].getAttribute("data-option-recaptcha-public-key"), "true" === r) {
                                        e.next = 4;
                                        break
                                    }
                                    return a = t.getAttribute("data-option-login-url"), e.prev = 1, e.next = 2, (0, g.Jt)(a, {});
                                case 2:
                                    o = e.sent, (c = o.data) && ((s = document.createElement("script")).src = "https://www.google.com/recaptcha/api.js?render=" + i, s.async = !0, document.head.appendChild(s), n.forEach(function(e) {
                                        e.innerHTML = c
                                    })), setTimeout(function() {
                                        var e = u.$el.querySelector(".cf-turnstile");
                                        e && window.turnstile && window.turnstile.render(e, {
                                            sitekey: e.getAttribute("data-sitekey"),
                                            theme: "light"
                                        })
                                    }, 300), e.next = 4;
                                    break;
                                case 3:
                                    e.prev = 3, e.catch(1);
                                case 4:
                                case "end":
                                    return e.stop()
                            }
                        }, e, null, [
                            [1, 3]
                        ])
                    })), function(e) {
                        return n.apply(this, arguments)
                    })
                }]);
                var n
            }(m.A)
        },
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return f
                }
            });
            var r = n(64467),
                i = n(23029),
                a = n(92901),
                o = n(50388),
                c = n(53954),
                s = n(15361),
                u = n(85349),
                d = n.n(u),
                l = n(24263);

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
                    var n, r, a, s;
                    return (0, i.A)(this, t), r = this, a = t, s = [e], a = (0, c.A)(a), (n = (0, o.A)(r, m() ? Reflect.construct(a, s || [], (0, c.A)(r).constructor) : a.apply(r, s)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, s.A)(t, e), (0, a.A)(t, [{
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
                            var i, a = t.cleanOptionKey(r);
                            i = n[r].includes("{") && n[r].includes("}") ? JSON.parse(n[r].replace(/'/g, '"')) : t.convertType(n[r]), e[a] = i
                        }), (0, l.A)(e)
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
                        n && e && t && (r ? d().on(n, e, r, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : d().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        d().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        d().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        d().fire(t, e)
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
                            i = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            n._loading || n.EMIT(n.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: r,
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
        62070: function(e, t, n) {
            n.d(t, {
                GB: function() {
                    return c
                },
                Gf: function() {
                    return l
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
                    return s
                },
                if: function() {
                    return v
                },
                sb: function() {
                    return a
                },
                yu: function() {
                    return i
                }
            });
            var r = n(87623),
                i = function(e, t, n, r, i) {
                    if (e && t && window.dataLayer) {
                        var a = {
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
                        r && m(r, a.ecommerce.items[0]), n && f(n, a.ecommerce.items[0]), h(a.ecommerce.items[0]), t.cardSize && v(t.cardSize, a.ecommerce.items[0]), window.dataLayer.push(a)
                    }
                },
                a = function(e, t, n) {
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
                o = function(e, t, n) {
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
                        e.cardSize && (r.ecommerce.items[0].item_list_id = e.cardSize), t && m(t, r.ecommerce.items[0]), e.price && f(e.price, r.ecommerce.items[0]), h(r.ecommerce.items[0]), window.dataLayer.push(r)
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
                s = function(e, t) {
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
                l = function(e, t) {
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
                    t = document.location.pathname.indexOf("wishlist") > 0 ? "le_mie_liste" : e.item_list_id ? (0, r.L)(document.location.pathname, !1) + e.item_list_id : (0, r.L)(document.location.pathname, !1), document.querySelector(".minicart-sidebar-wrapper.toggleActive") ? (e.item_list_id = "mini-cart", e.item_list_name = "mini-cart") : document.querySelector(".zero-search-results") ? (e.item_list_id = "searchresult_0", e.item_list_name = "searchresult_0") : (e.item_list_id = t, e.item_list_name = t)
                },
                v = function(e, t) {
                    var n, i = (0, r.L)(document.location.pathname, !1);
                    if (n = "Half Width" === e ? i + "_card_single" : i + "_card_double", !t) return n;
                    t.item_list_id = n, t.item_list_name = n
                }
        },
        87623: function(e, t, n) {
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
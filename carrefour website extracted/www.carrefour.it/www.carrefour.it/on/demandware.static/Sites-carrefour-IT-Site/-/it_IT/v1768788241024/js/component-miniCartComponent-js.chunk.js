"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [9117], {
        57467: function(e, t, n) {
            n.d(t, {
                A: function() {
                    return d
                }
            });
            var o = n(64467),
                r = n(23029),
                i = n(92901),
                a = n(50388),
                c = n(53954),
                s = n(15361),
                l = n(85349),
                u = n.n(l),
                S = n(24263);

            function E(e, t) {
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
            var d = function(e) {
                function t(e) {
                    var n, o, i, s;
                    return (0, r.A)(this, t), o = this, i = t, s = [e], i = (0, c.A)(i), (n = (0, a.A)(o, p() ? Reflect.construct(i, s || [], (0, c.A)(o).constructor) : i.apply(o, s)))._componentElement = e, n._componentElement.setAttribute("data-component-init", "true"), n._checkMessages(), n
                }
                return (0, s.A)(t, e), (0, i.A)(t, [{
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
                                    t % 2 ? E(Object(n), !0).forEach(function(t) {
                                        (0, o.A)(e, t, n[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : E(Object(n)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(n).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(o) {
                            var r, i = t.cleanOptionKey(o);
                            r = n[o].includes("{") && n[o].includes("}") ? JSON.parse(n[o].replace(/'/g, '"')) : t.convertType(n[o]), e[i] = r
                        }), (0, S.A)(e)
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
                        n && e && t && (o ? u().on(n, e, o, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : u().on(n, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        u().one(n, e, t)
                    }
                }, {
                    key: "$off",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        u().off(t, e)
                    }
                }, {
                    key: "$fire",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        u().fire(t, e)
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
        },
        67846: function(e, t, n) {
            n.r(t), n.d(t, {
                default: function() {
                    return E
                }
            });
            var o = n(64467),
                r = n(23029),
                i = n(92901),
                a = n(50388),
                c = n(53954),
                s = n(15361),
                l = n(57467),
                u = n(67303);

            function S() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (S = function() {
                    return !!e
                })()
            }
            var E = function(e) {
                function t(e) {
                    var n, o, i, s;
                    return (0, r.A)(this, t), o = this, i = t, s = [e], i = (0, c.A)(i), (n = (0, a.A)(o, S() ? Reflect.construct(i, s || [], (0, c.A)(o).constructor) : i.apply(o, s))).initClickEvent(), n.checkScrollTop(), n
                }
                return (0, s.A)(t, e), (0, i.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)({}, this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.quantityUpdate, this.updateBadgeQty), this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.totalPriceUpdate, this.updateTotalPrice), this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.closeMinicart, this.resetLayer), this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.maxLineItemsExceeded, this.maxLineItemsExceeded), this.CUSTOM_MESSAGES.BREAKPOINTER.BREAKPOINT_CHANGE, this.onBreakpointChange)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            infoStrip: ".information-strip.is-visible",
                            mainHeader: "header.header",
                            badge: ".minicart__badge",
                            tooltip: ".minicart__tooltip",
                            priceBadge: ".minicart__pricebadge",
                            totalPrice: ".minicart__totalprice",
                            button: ".minicart__button",
                            closeButton: ".minicart-close",
                            pushApp: ".push-app-content-wrapper",
                            floatingError: ".floating-error",
                            floatingErrorMessage: ".floating-error-message"
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            HIDE_BADGE: "no-show",
                            NO_HOVER: "no-hover",
                            SHOW_TOOLTIP: "visible",
                            SCROLL_TOP: "scroll-top"
                        }
                    }
                }, {
                    key: "EVENTS_ID",
                    get: function() {
                        return {
                            SHOW_MINICART_TOOLTIP: "click.miniCart"
                        }
                    }
                }, {
                    key: "initClickEvent",
                    value: function() {
                        var e, t = this;
                        this.anchorButtonReplacer();
                        try {
                            e = parseInt(this.$el.dataset.cartQty), (0, u.v)({
                                qtyInCart: e
                            })
                        } catch (e) {}
                        if (0 == e) {
                            var n = this;
                            this.$on(this.EVENTS_ID.SHOW_MINICART_TOOLTIP, function(e) {
                                return t.handleEmptyCartClick(e, n)
                            })
                        }
                    }
                }, {
                    key: "handleEmptyCartClick",
                    value: function(e, t) {
                        e.preventDefault();
                        var n = t.$el.querySelector(t.SELECTORS.tooltip);
                        n && (n.classList.contains(t.CLASSES.SHOW_TOOLTIP) ? n.classList.remove(t.CLASSES.SHOW_TOOLTIP) : (n.classList.add(t.CLASSES.SHOW_TOOLTIP), setTimeout(function() {
                            n.classList.remove(t.CLASSES.SHOW_TOOLTIP)
                        }, 2500)))
                    }
                }, {
                    key: "updateBadgeQty",
                    value: function(e) {
                        var t = this,
                            n = this.$el.querySelector(this.SELECTORS.badge);
                        if (this.$off(this.EVENTS_ID.SHOW_MINICART_TOOLTIP), parseInt(e.value) > 0) n.classList.remove(this.CLASSES.HIDE_BADGE), this.$el.classList.add(this.CLASSES.NO_HOVER);
                        else {
                            var o = this;
                            this.$el.classList.remove(this.CLASSES.NO_HOVER), this.$on(this.EVENTS_ID.SHOW_MINICART_TOOLTIP, function(e) {
                                return t.handleEmptyCartClick(e, o)
                            }), n.classList.add(this.CLASSES.HIDE_BADGE)
                        }
                        n.innerHTML = e.value;
                        var r = this.$el.querySelector(this.SELECTORS.button);
                        r && r.setAttribute("aria-label", "Carrello".concat(parseInt(e.value) > 0 ? ", " + parseInt(e.value) + (parseInt(e.value) > 1 ? " prodotti" : " prodotto") : "").concat(e.total && parseInt(e.value) > 0 ? ", totale " + e.total.replace("€", "").trim() + "€" : "")), (0, u.v)({
                            qtyInCart: e.value
                        })
                    }
                }, {
                    key: "updateTotalPrice",
                    value: function(e) {
                        var t = this.$el.querySelector(this.SELECTORS.priceBadge),
                            n = this.$el.querySelector(this.SELECTORS.totalPrice);
                        0 != e.value ? t.classList.remove(this.CLASSES.HIDE_BADGE) : t.classList.add(this.CLASSES.HIDE_BADGE), n.innerHTML = e.value.replace("€", "").trim() + "€"
                    }
                }, {
                    key: "checkScrollTop",
                    value: function() {
                        var e = this,
                            t = 0;
                        window.addEventListener("scroll", function() {
                            var n = window.pageYOffset || document.documentElement.scrollTop;
                            n > t && e.$el.classList.contains(e.CLASSES.SCROLL_TOP) ? e.$el.classList.remove(e.CLASSES.SCROLL_TOP) : n < t && !e.$el.classList.contains(e.CLASSES.SCROLL_TOP) && e.$el.classList.add(e.CLASSES.SCROLL_TOP), t = n <= 0 ? 0 : n
                        }, !1)
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function() {
                        this.anchorButtonReplacer()
                    }
                }, {
                    key: "anchorButtonReplacer",
                    value: function() {
                        if (this.$options.sidebar && !document.querySelector("body").classList.contains("cart")) {
                            var e = this.$el.querySelector(this.SELECTORS.button),
                                t = e.getAttribute("aria-label");
                            if (window.isMobile() && "BUTTON" == e.tagName) {
                                var n = document.createElement("a");
                                n.setAttribute("href", this.$options.href), n.setAttribute("class", "minicart__button"), n.setAttribute("aria-label", t), this.$el.removeChild(e), this.$el.appendChild(n)
                            } else if (window.isDesktop() && "A" == e.tagName) {
                                var o = document.createElement("button");
                                o.setAttribute("class", "minicart__button"), o.setAttribute("aria-label", t), o.setAttribute("aria-haspopup", "dialog"), o.setAttribute("aria-controls", "carrello"), this.$el.removeChild(e), this.$el.appendChild(o)
                            }
                        }
                    }
                }, {
                    key: "resetLayer",
                    value: function() {
                        var e = this;
                        setTimeout(function() {
                            document.body.className = document.body.className.replace(/\bopenStoresList.*?\b/g, ""), e.$options.moveInfostrip && document.querySelector(e.SELECTORS.infoStrip) && (window.scrollTo(0, 0), document.querySelector(e.SELECTORS.mainHeader).classList.remove("moveinfostrip"), document.querySelector(e.SELECTORS.mainHeader).classList.add("noanimation"), document.querySelector(e.SELECTORS.mainHeader).insertBefore(document.querySelector(e.SELECTORS.infoStrip), document.querySelector(e.SELECTORS.pushApp) ? document.querySelector(e.SELECTORS.pushApp).nextSibling : document.querySelector(e.SELECTORS.mainHeader).firstChild)), document.body.className = document.body.className.replace(/\bopenExtraLayer.*?\b/g, ""), document.body.className = document.body.className.replace(/\bopenStoresList.*?\b/g, ""), document.body.className = document.body.className.replace(/\bopenSingleStoreDeliveryList.*?\b/g, "")
                        }, 400)
                    }
                }, {
                    key: "maxLineItemsExceeded",
                    value: function(e) {
                        var t, n = document.querySelector(this.SELECTORS.floatingError),
                            o = document.querySelector(this.SELECTORS.floatingErrorMessage);
                        if (n && o) {
                            var r = n.querySelector(".icon-close");
                            o.innerText = e.message, n.style.display = "flex", r.addEventListener("click", function() {
                                clearTimeout(t), n.style.display = "none"
                            }), clearTimeout(t), t = setTimeout(function() {
                                n.style.display = "none"
                            }, 6e3)
                        } else(0, u.v)({
                            action: "MAX_ITEM_IN_CART",
                            message: e.message
                        })
                    }
                }])
            }(l.A)
        }
    }
]);
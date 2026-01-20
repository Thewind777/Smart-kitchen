"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [3106], {
        39121: function(e, t, o) {
            o.r(t), o.d(t, {
                default: function() {
                    return y
                }
            });
            var i = o(45458),
                n = o(23029),
                s = o(92901),
                a = o(50388),
                r = o(53954),
                l = o(15361),
                c = o(57467),
                d = o(27848),
                p = o(67303),
                u = o(2078);

            function h() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (h = function() {
                    return !!e
                })()
            }
            var S = null,
                y = function(e) {
                    function t(e) {
                        var o, i, s, l;
                        return (0, n.A)(this, t), i = this, s = t, l = [e], s = (0, r.A)(s), (o = (0, a.A)(i, h() ? Reflect.construct(s, l || [], (0, r.A)(i).constructor) : s.apply(i, l))).$storeSelectionLayer = document.querySelector(o.SELECTORS.storeSelectionModal), o.$storeSelectionButton = document.querySelector(o.SELECTORS.storeSelectionButton), o.$options.handler && (o.$on("click", o.onClickHandler.bind(o)), "button" === o.$el.role && (o.$el.addEventListener("keydown", function(e) {
                            o.actionButtonKeydownHandler(e)
                        }), o.$el.addEventListener("keyup", function(e) {
                            o.actionButtonKeyupHandler(e)
                        }))), o.$options.expandible && !o.$el.classList.contains("refinement-title") && (o.$el.ariaExpanded = !1), o.$options.filterbar && document.querySelector(".nds") && o.$on("click", o.onFilterbarClickHandler.bind(o)), o.closeBtn = o.$el.querySelector(o.SELECTORS.closeDropdownBtn), o.closeBtn && o.closeBtn.addEventListener("click", function() {
                            o.pushCloseEventToDatalayer(), o.remove()
                        }), o.$el.addEventListener("keydown", function(e) {
                            "Escape" === e.key && (o.pushCloseEventToDatalayer(), o.remove())
                        }), o
                    }
                    return (0, l.A)(t, e), (0, s.A)(t, [{
                        key: "SELECTORS",
                        get: function() {
                            return {
                                infoStrip: ".information-strip.is-visible",
                                mainHeader: "header.header",
                                closeDropdownBtn: ".js-toggle-close",
                                filtersDropdownBtn: ".js-filter-toggle-close",
                                storeSelectionModal: "#store-selection-bar",
                                storeSelectionButton: "#store-selection-button",
                                isApp: ".mobile-layout"
                            }
                        }
                    }, {
                        key: "CLASSES",
                        get: function() {
                            return {
                                isCollapsedClass: "toggleActive",
                                shippingCostButton: "info-shipping-costs-btn"
                            }
                        }
                    }, {
                        key: "componentsEls",
                        get: function() {
                            return this._handlerName || (this._handlerName = this.$options.name), this._relatedEls = document.querySelectorAll("[data-option-name=".concat(this._handlerName, "]")), this._relatedEls
                        }
                    }, {
                        key: "closeComponentsEls",
                        get: function() {
                            return !this._closeHandlerName && this.$options.close && (this._closeHandlerName = this.$options.close), this._closeRelatedEls = document.querySelectorAll("[data-option-name=".concat(this._closeHandlerName, "]")), this._closeRelatedEls
                        }
                    }, {
                        key: "onClickHandler",
                        value: function(e) {
                            if (!(window.isMobile() && this.$options.desktopOnly || document.querySelector("body").classList.contains("cart") && "minicartLayer" == this.$options.name))
                                if (this.$el.classList.contains(this.CLASSES.isCollapsedClass)) this.pushCloseEventToDatalayer(), this.remove();
                                else {
                                    if (this.add(), "minicartLayer" == this.$options.name) {
                                        this.EMIT(this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.loadMinicart, {
                                            eventSend: !0
                                        });
                                        var t = document.querySelector(".minicart-sidebar");
                                        this.trap = u.K(t, {
                                            initialFocus: t,
                                            clickOutsideDeactivates: !0
                                        }), this.trap.activate()
                                    }
                                    var o;
                                    if ("openStoresList-pickup_in_store" == this.$options.name && "pickup_in_store" == this.$options.service) null === (o = document.querySelector(".back-to-services.description.toggleActive.openStoresList-pickup_in_store")) || void 0 === o || o.focus()
                                }
                        }
                    }, {
                        key: "onFilterbarClickHandler",
                        value: function(e) {
                            var t = this,
                                o = e.target.closest(".refinements.accordion"),
                                i = o ? o.querySelectorAll(".refinement-block") : null;
                            i && window.isDesktop() && i.forEach(function(o) {
                                var i = o.querySelector(".refinement-title"),
                                    n = "";
                                i && (n = i.getAttribute("data-option-name") || "");
                                var s = e.target.getAttribute("data-option-name") || "";
                                n && s && n !== s && (i.classList.remove(t.CLASSES.isCollapsedClass), t.$options.expandible ? (i.ariaExpanded = !0, (i.classList.contains("show-hide-refinements") || i.classList.contains("js-sortrule-value")) && (i.ariaExpanded = !1)) : i.ariaPressed = !1, o.querySelector(".refinement-list") && o.querySelector(".refinement-list").classList.remove(t.CLASSES.isCollapsedClass))
                            })
                        }
                    }, {
                        key: "remove",
                        value: function() {
                            var e = this;
                            "storeLayer" == this.$options.name && (S && S.deactivate(), this.$storeSelectionLayer && (this.$storeSelectionLayer.ariaModal = !1, this.$storeSelectionLayer.removeAttribute("tabindex")), window._uxa = window._uxa || [], window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__")]), (0, p.v)({
                                action: "CLOSE_STORELAYER"
                            })), !this.$options.name.includes("deliveryToggle") || "BUTTON" !== this.$el.tagName && "button" !== this.$el.role || (this.$options.expandible ? (this.$el.ariaExpanded = !0, (this.$el.classList.contains("show-hide-refinements") || this.$el.classList.contains("js-sortrule-value")) && (this.$el.ariaExpanded = !1)) : this.$el.ariaPressed = !1, this.$el.ariaDisabled = !1, this.$el.tabIndex = 0), "minicartLayer" == this.$options.name && this.EMIT(this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.closeMinicart), "sidebarLayer" == this.$options.name && document.querySelector(this.SELECTORS.isApp) && (0, p.v)({
                                action: "SHOW_HEADER"
                            }), this.$options.backdrop && this.EMIT(this.CUSTOM_MESSAGES.BACKDROP_EVENTS.animate, {
                                action: close
                            }), this.$options.delay && setTimeout(function() {
                                document.body.classList.remove(e.$options.delayname)
                            }, parseInt(this.$options.delay)), document.body.classList.remove(this.$options.name), this.componentsEls.forEach(function(t) {
                                t.classList.remove(e.CLASSES.isCollapsedClass), "BUTTON" === t.tagName && (e.$options.expandible ? (t.ariaExpanded = !0, (t.classList.contains("show-hide-refinements") || t.classList.contains("info-shipping-costs-btn") || t.classList.contains("js-sortrule-value")) && (t.ariaExpanded = !1)) : t.ariaPressed = !1)
                            }), "storeLayer" == this.$options.name && this.$storeSelectionButton && setTimeout(function() {
                                e.$storeSelectionButton.focus()
                            }, 200)
                        }
                    }, {
                        key: "closeOtherDeliveryToggles",
                        value: function(e) {
                            var t = this;
                            (0, i.A)(document.querySelectorAll("[data-option-name^=deliveryToggle-]")).forEach(function(o) {
                                o.getAttribute("data-option-name") != e && (o.classList.remove(t.CLASSES.isCollapsedClass), "BUTTON" !== o.tagName && "button" !== o.role || (t.$options.expandible ? o.ariaExpanded = !1 : o.ariaPressed = !1, o.ariaDisabled = !1, o.tabIndex = 0))
                            })
                        }
                    }, {
                        key: "add",
                        value: function() {
                            var e = this;
                            if ("storeLayer" == this.$options.name || "delivery-cost-info" == this.$options.name) {
                                var t = {
                                    event: "button_click",
                                    type: "generic_button",
                                    area: "spalla",
                                    action: "button_click"
                                };
                                t.text = "storeLayer" == this.$options.name ? "Open" : this.$el.textContent || "Spese di spedizione", "storeLayer" == this.$options.name && (this.$storeSelectionLayer && (this.$storeSelectionLayer.ariaModal = !0, this.$storeSelectionLayer.setAttribute("tabindex", "-1")), window._uxa = window._uxa || [], window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__") + "?cs-popin-metodo-di-consegna"]), (0, p.v)({
                                    action: "OPEN_STORELAYER"
                                }));
                                var o = this.$options.shippingSelectedCap,
                                    i = this.$options.selectedStoreId;
                                if ("delivery-cost-info" == this.$options.name) {
                                    var n = this.$el.closest(this.SELECTORS.storeSelectionModal);
                                    o = o || (null == n ? void 0 : n.getAttribute("data-option-shipping-selected-cap")), i = i || (null == n ? void 0 : n.getAttribute("data-option-selected-store-id"))
                                }
                                o && "null" !== o && (t.s_store_zipCode = o), o && "null" !== o && i && "null" !== i && (t.s_store_id = i), window.dataLayer.push(t)
                            }
                            if (this.$options.name.includes("deliveryToggle") && ("BUTTON" !== this.$el.tagName && "button" !== this.$el.role || this.$el.closest(".franchise-service-card") || (this.$options.expandible ? (this.$el.ariaExpanded = !1, (this.$el.classList.contains("show-hide-refinements") || this.$el.classList.contains("js-sortrule-value")) && (this.$el.ariaExpanded = !0)) : this.$el.ariaPressed = !0, this.$el.ariaDisabled = !0, this.$el.tabIndex = -1), this.closeOtherDeliveryToggles(this.$options.name)), this.$options.expandible && (this.$el.ariaExpanded = !0), this.$options.gaeventcategory && this.$options.gaeventaction && this.EMIT(this.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                                    eventCategory: this.$options.gaeventcategory,
                                    eventAction: this.$options.gaeventaction,
                                    eventLabel: this.$options.gaeventlabel ? this.$options.gaeventlabel : ""
                                }), this.$options.trackingArea && this.$options.trackingType && this.$options.trackingAction && this.$options.trackingText && this.EMIT(this.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                                    area: this.$options.trackingArea,
                                    type: this.$options.trackingType,
                                    action: this.$options.trackingAction,
                                    text: this.$options.trackingText
                                }), this.$options.service) {
                                var s = {
                                    event: "choose_delivery_method",
                                    area: "spalla",
                                    label: this.$options.service
                                };
                                this.$options.shippingSelectedCap && (s.s_store_zipCode = this.$options.shippingSelectedCap), window.dataLayer.push(s)
                            }!this.$options.backdrop || document.querySelector(this.SELECTORS.isApp) && "storeLayer" == this.$options.name || this.EMIT(this.CUSTOM_MESSAGES.BACKDROP_EVENTS.animate, {
                                action: open
                            }), this.$options.delay && document.body.classList.add(this.$options.delayname), document.body.classList.add(this.$options.name), this.$options.moveInfostrip && document.querySelector(this.SELECTORS.infoStrip) && (window.scrollTo(0, 0), document.querySelector(this.SELECTORS.mainHeader).classList.add("moveinfostrip"), (0, d.YW)(null, "md") && document.querySelector(".page").insertBefore(document.querySelector(this.SELECTORS.infoStrip), document.querySelector(".page").firstChild)), document.querySelector(this.SELECTORS.isApp) && "storeLayer" == this.$options.name || this.componentsEls.forEach(function(t) {
                                (t.classList.add(e.CLASSES.isCollapsedClass), "BUTTON" !== t.tagName || t.classList.contains("minicart-close") || (e.$options.expandible ? (t.ariaExpanded = !1, (t.classList.contains("show-hide-refinements") || t.classList.contains("info-shipping-costs-btn") || t.classList.contains("js-sortrule-value")) && (t.ariaExpanded = !0)) : t.ariaPressed = !0), t.dataset.elfocus) && document.querySelector(t.dataset.elfocus).focus()
                            }), this.$options.close && (document.body.classList.remove(this.$options.close), this.closeComponentsEls.forEach(function(t) {
                                t.classList.remove(e.CLASSES.isCollapsedClass), "BUTTON" === t.tagName && (e.$options.expandible ? (t.ariaExpanded = !0, (t.classList.contains("show-hide-refinements") || t.classList.contains("info-shipping-costs-btn") || t.classList.contains("js-sortrule-value")) && (t.ariaExpanded = !1)) : t.ariaPressed = !1)
                            })), "storeLayer" == this.$options.name && this.$storeSelectionLayer && setTimeout(function() {
                                e.$storeSelectionLayer.focus(), (S = u.K(e.$storeSelectionLayer, {
                                    clickOutsideDeactivates: !0
                                })).activate()
                            }, 500)
                        }
                    }, {
                        key: "actionButtonKeydownHandler",
                        value: function(e) {
                            32 === e.keyCode ? e.preventDefault() : 13 === e.keyCode && (e.preventDefault(), this.onClickHandler())
                        }
                    }, {
                        key: "actionButtonKeyupHandler",
                        value: function(e) {
                            32 === e.keyCode && (e.preventDefault(), this.onClickHandler())
                        }
                    }, {
                        key: "pushCloseEventToDatalayer",
                        value: function() {
                            if ("storeLayer" == this.$options.name) {
                                var e = {
                                    event: "button_click",
                                    type: "generic_button",
                                    area: "spalla",
                                    action: "button_click",
                                    text: "Close"
                                };
                                this.$options.shippingSelectedCap && (e.s_store_zipCode = this.$options.shippingSelectedCap), this.$options.shippingSelectedCap && this.$options.selectedStoreId && (e.s_store_id = this.$options.selectedStoreId), window.dataLayer.push(e)
                            }
                        }
                    }])
                }(c.A)
        },
        57467: function(e, t, o) {
            o.d(t, {
                A: function() {
                    return S
                }
            });
            var i = o(64467),
                n = o(23029),
                s = o(92901),
                a = o(50388),
                r = o(53954),
                l = o(15361),
                c = o(85349),
                d = o.n(c),
                p = o(24263);

            function u(e, t) {
                var o = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    t && (i = i.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), o.push.apply(o, i)
                }
                return o
            }

            function h() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (h = function() {
                    return !!e
                })()
            }
            var S = function(e) {
                function t(e) {
                    var o, i, s, l;
                    return (0, n.A)(this, t), i = this, s = t, l = [e], s = (0, r.A)(s), (o = (0, a.A)(i, h() ? Reflect.construct(s, l || [], (0, r.A)(i).constructor) : s.apply(i, l)))._componentElement = e, o._componentElement.setAttribute("data-component-init", "true"), o._checkMessages(), o
                }
                return (0, l.A)(t, e), (0, s.A)(t, [{
                    key: "$el",
                    get: function() {
                        return this._componentElement
                    }
                }, {
                    key: "$options",
                    get: function() {
                        var e = {},
                            o = function(e) {
                                for (var t = 1; t < arguments.length; t++) {
                                    var o = null != arguments[t] ? arguments[t] : {};
                                    t % 2 ? u(Object(o), !0).forEach(function(t) {
                                        (0, i.A)(e, t, o[t])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(o)) : u(Object(o)).forEach(function(t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(o, t))
                                    })
                                }
                                return e
                            }({}, this.$el.dataset);
                        return Object.keys(o).filter(function(e) {
                            return e.includes("option")
                        }).forEach(function(i) {
                            var n, s = t.cleanOptionKey(i);
                            n = o[i].includes("{") && o[i].includes("}") ? JSON.parse(o[i].replace(/'/g, '"')) : t.convertType(o[i]), e[s] = n
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
                        var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el,
                            i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        o && e && t && (i ? d().on(o, e, i, function(e) {
                            e && e.stopPropagation(), t(e)
                        }) : d().on(o, e, function(e) {
                            e && e.stopPropagation(), t(e)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(e, t) {
                        var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        d().one(o, e, t)
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
                        var o = this,
                            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            n = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            o._loading || o.EMIT(o.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: e || document.body,
                                message: t,
                                error: i,
                                icon: n
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
            }(o(39860).A)
        }
    }
]);
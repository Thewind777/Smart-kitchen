"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [8730], {
        75521: function(t, e, i) {
            i.r(e), i.d(e, {
                default: function() {
                    return A
                }
            });
            var n = i(10467),
                o = i(64467),
                s = i(23029),
                a = i(92901),
                r = i(50388),
                c = i(53954),
                p = i(90991),
                d = i(15361),
                u = i(54756),
                l = i.n(u),
                h = i(30363),
                S = i(8732);

            function E(t, e) {
                var i = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    e && (n = n.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), i.push.apply(i, n)
                }
                return i
            }

            function f(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var i = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? E(Object(i), !0).forEach(function(e) {
                        (0, o.A)(t, e, i[e])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : E(Object(i)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
                    })
                }
                return t
            }

            function T() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (T = function() {
                    return !!t
                })()
            }

            function O(t, e, i, n) {
                var o = (0, p.A)((0, c.A)(1 & n ? t.prototype : t), e, i);
                return 2 & n && "function" == typeof o ? function(t) {
                    return o.apply(i, t)
                } : o
            }
            var A = function(t) {
                function e(t) {
                    var i, n, o, a;
                    return (0, s.A)(this, e), n = this, o = e, a = [t], o = (0, c.A)(o), (i = (0, r.A)(n, T() ? Reflect.construct(o, a || [], (0, c.A)(n).constructor) : o.apply(n, a))).initComponent(), i
                }
                return (0, d.A)(e, t), (0, a.A)(e, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)({}, "error.NO_SHIPPING_METHOD_SELECTED_NO_FOOD", this.handleAddToCart), "error.MAX_QUANTITY_REACHED", this.showOutOfStock), "error.LIMITS_ERROR", this.showOutOfStock), "error.QUANTITY_NOT_AVAILABLE", this.showOutOfStock), this.CUSTOM_MESSAGES.PRODUCT_UPDATE_QTY.quantityupdate, this.triggerEvent), this.CUSTOM_MESSAGES.ADDTOCART_EVENTS.itemAdded, this.setStateOnAddToCart), this.CUSTOM_MESSAGES.PRODUCT_UPDATE_QTY.stateupdate, this.setStateOnUpdateQty), this.CUSTOM_MESSAGES.ADDTOCART_EVENTS.pascolAddToCartFeedback, this.addToCartFeedback), this.CUSTOM_MESSAGES.STORE_SELECTION_SELECT_EVENTS.initialized, this.setAccessibility)
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return f(f({}, O(e, "SELECTORS", this, 1)), {}, {
                            shippingOptions: ".shipping-options",
                            main: ".product-main",
                            promoPushCart: ".promo-push-cart"
                        })
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return f(f({}, O(e, "CLASSES", this, 1)), {}, {
                            optionsSelected: "options-selected",
                            optionsEditing: "options-editing"
                        })
                    }
                }, {
                    key: "$shippingOptions",
                    get: function() {
                        var t;
                        return this._$shippingOptions || (this._$shippingOptions = null === (t = this.$el.closest(this.SELECTORS.main)) || void 0 === t ? void 0 : t.querySelector(this.SELECTORS.shippingOptions)), this._$shippingOptions
                    }
                }, {
                    key: "initComponent",
                    value: (p = (0, n.A)(l().mark(function t() {
                        var e;
                        return l().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    this.$on("click.tooltipsubscription", function(t) {
                                        if (t.currentTarget.parentElement.classList.contains("subscription-disabled") && (t.currentTarget.parentElement.classList.contains("show-quantity") || t.currentTarget.parentElement.classList.contains("subs-active"))) return t.preventDefault(), t.currentTarget.classList.toggle("show-tooltip"), !1
                                    }, this.$addtocartbtn), (!this.$options.quantity || parseInt(this.$options.quantity) < 0) && (e = window.currentBasketQuantities && window.currentBasketQuantities[this.$options.pid]) && this.setState({
                                        qty: e
                                    });
                                case 1:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    })), function() {
                        return p.apply(this, arguments)
                    })
                }, {
                    key: "setAccessibility",
                    value: function(t) {
                        var e = t && t.classList.contains("no-shipping-selected");
                        this.$addtocartbtn.ariaHasPopup = e
                    }
                }, {
                    key: "showOutOfStock",
                    value: function(t) {
                        O(e, "showOutOfStock", this, 3)([t])
                    }
                }, {
                    key: "triggerEvent",
                    value: function(t) {
                        O(e, "triggerEvent", this, 3)([t])
                    }
                }, {
                    key: "handleAddToCartResponse",
                    value: function(t) {
                        var i = t.error,
                            n = t.quantityTotal,
                            o = t.totalPrice,
                            s = t.hideBtn,
                            a = t.foodProductTotalPrice;
                        return !i && this.$shippingOptions && this.$shippingOptions.classList.add(this.CLASSES.optionsSelected), this.inWishlist && s ? this.EMIT(this.CUSTOM_MESSAGES.WISHLIST_ADD_ALL_EVENTS.hide, {}) : this.EMIT(this.CUSTOM_MESSAGES.WISHLIST_ADD_ALL_EVENTS.show, {}), O(e, "handleAddToCartResponse", this, 3)([{
                            error: i,
                            quantityTotal: n,
                            totalPrice: o,
                            foodProductTotalPrice: a
                        }])
                    }
                }, {
                    key: "handleUpdateQtyResponse",
                    value: function(t) {
                        var i = t.error,
                            n = t.items,
                            o = t.numItems,
                            s = t.totalPrice,
                            a = t.hasNxMDiscount,
                            r = t.foodProductTotalPrice;
                        i || n || !this.$shippingOptions || this.$options.ispascol || (this.$shippingOptions.classList.remove(this.CLASSES.optionsSelected), this.$shippingOptions.classList.remove(this.CLASSES.optionsEditing)), O(e, "handleUpdateQtyResponse", this, 3)([{
                            error: i,
                            items: n,
                            numItems: o,
                            totalPrice: s,
                            hasNxMDiscount: a,
                            foodProductTotalPrice: r
                        }])
                    }
                }, {
                    key: "modalOpen",
                    value: function(t, e) {
                        var i = this;
                        this.$options.element && !this.$options.close ? (t || (window._uxa = window._uxa || [], window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__") + "?cs-popin-consegna-e-servizi"])), this.EMIT(this.CUSTOM_MESSAGES.MODAL_EVENTS.show, {
                            selector: this.$options.element,
                            className: "".concat(t, " selectShippingOptions ").concat(t ? "w-550" : "w-400", " full-height"),
                            showCloseButton: !t,
                            afterOpen: function() {
                                t && document.querySelectorAll(".close-pascol").forEach(function(t) {
                                    t.addEventListener("click", function() {
                                        var t = (0, n.A)(l().mark(function t(n) {
                                            return l().wrap(function(t) {
                                                for (;;) switch (t.prev = t.next) {
                                                    case 0:
                                                        i.EMIT(i.CUSTOM_MESSAGES.MODAL_EVENTS.close), i.EMIT(i.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                                                            eventCategory: "Alert Close",
                                                            eventAction: "Pascol",
                                                            eventLabel: e
                                                        });
                                                    case 1:
                                                    case "end":
                                                        return t.stop()
                                                }
                                            }, t)
                                        }));
                                        return function(e) {
                                            return t.apply(this, arguments)
                                        }
                                    }())
                                })
                            },
                            afterClose: function(t) {
                                t || (window._uxa = window._uxa || [], window._uxa.push(["trackPageview", window.location.pathname + window.location.hash.replace("#", "?__")]))
                            }
                        }), t && this.EMIT(this.CUSTOM_MESSAGES.TRACKING_EVENTS.update, {
                            eventCategory: "Alert Open",
                            eventAction: "Pascol",
                            eventLabel: e
                        })) : this.EMIT(this.CUSTOM_MESSAGES.MODAL_EVENTS.close)
                    }
                }, {
                    key: "updateShippingSelection",
                    value: function() {
                        if (this.addToCartPayload) {
                            var t, i, n, o, s, a, r, c, p, d, u;
                            if (this.$checkedShippingOption) o = this.$checkedShippingOption.value, s = null === (a = this.$checkedShippingOption) || void 0 === a ? void 0 : a.dataset.optionId;
                            else o = null === (r = this.$shippingOption) || void 0 === r ? void 0 : r.dataset.optionDefaultValue, s = null === (c = this.$shippingOption) || void 0 === c ? void 0 : c.dataset.optionId;
                            if (this.$checkedRaeeOption) i = this.$checkedRaeeOption.value, n = null === (p = this.$checkedRaeeOption) || void 0 === p ? void 0 : p.dataset.optionId;
                            else i = null === (d = this.$shippingOptionRaee) || void 0 === d ? void 0 : d.dataset.optionDefaultValue, n = null === (u = this.$shippingOptionRaee) || void 0 === u ? void 0 : u.dataset.optionId;
                            var l = [];
                            this.$checkedShippingOption && l.push({
                                productId: this.$options.pid,
                                optionId: s,
                                selectedValueId: o
                            }), this.$checkedRaeeOption && l.push({
                                productId: this.$options.pid,
                                optionId: n,
                                selectedValueId: i
                            }), this.addToCartPayload.res.config.data.options = JSON.stringify(l), this.addToCartPayload.res.config.data.shippingMethodId = (null === (t = this.$checkedShippingMethod) || void 0 === t ? void 0 : t.value) || ""
                        }
                        return this.EMIT(this.CUSTOM_MESSAGES.MODAL_EVENTS.close), O(e, "loading", this, 3)([O(e, "$productTile", this, 1)]), this.addToCartLater(), document.querySelector("#shippingOptionsModal").content.querySelector(".shippingOptionsModalContent").innerHTML = "", O(e, "endLoading", this, 3)([O(e, "$productTile", this, 1)]), this.addToCartPayload.res.config.data
                    }
                }, {
                    key: "addToCartLater",
                    value: (i = (0, n.A)(l().mark(function t() {
                        var e, i;
                        return l().wrap(function(t) {
                            for (;;) switch (t.prev = t.next) {
                                case 0:
                                    return e = this, t.next = 1, (0, S.Em)(this.addToCartPayload.res.config);
                                case 1:
                                    i = t.sent, e.handleAddToCartPLPResponse.call(e, i);
                                case 2:
                                case "end":
                                    return t.stop()
                            }
                        }, t, this)
                    })), function() {
                        return i.apply(this, arguments)
                    })
                }, {
                    key: "handleAddToCartPLPResponse",
                    value: function(t) {
                        t.data.error && "NumberOfProductLineItemsExceededException" === t.data.error ? this.EMIT(this.CUSTOM_MESSAGES.UPDATE_CART_EVENTS.maxLineItemsExceeded, {
                            message: t.data.message
                        }) : document.querySelector(this.SELECTORS.promoPushCart) && this.EMIT(this.CUSTOM_MESSAGES.ADDTOCART_EVENTS.pascolAddToCartFeedback, {
                            fromPascol: !1
                        }), this.handleAddToCartResponse({
                            error: t.data.error,
                            quantityTotal: t.data.quantityTotal,
                            totalPrice: t.data.totalPrice,
                            hideBtn: t.data.hideBtn
                        })
                    }
                }, {
                    key: "handleAddToCart",
                    value: function(t) {
                        var e = this;
                        if (t.res.config.data.pid === this.$options.pid && this.requestSent) {
                            this.requestSent = !1, document.querySelector("#shippingOptionsModal").content.querySelector(".shippingOptionsModalContent").innerHTML = t.res.data.shippingOptions, this.modalOpen(this.$options.ispascol ? "isPascol" : "", this.$options.pid);
                            var i = document.querySelectorAll(".selectShippingOptions");
                            i.length > 1 && i.forEach(function(t, e) {
                                0 != e ? (t.previousElementSibling.remove(), t.remove()) : t.classList.add("active")
                            }), document.querySelector(".addProductAfterShipping").addEventListener("click", function(t) {
                                document.querySelector(".addProductAfterShipping").disabled = !0;
                                var i = e.updateShippingSelection();
                                document.querySelector(e.SELECTORS.promoPushCart) && "true" !== i.isPromoBundle && setTimeout(function() {
                                    window.location.reload()
                                }, 1300), setTimeout(function() {
                                    if (i && i.pid) {
                                        var t = document.querySelector('.product.tile [data-option-pid="'.concat(i.pid, '"]'));
                                        if (t) {
                                            var e = t.querySelector(".js-decrease-quantity");
                                            e && e.focus()
                                        }
                                    }
                                }, 500)
                            }, this.$el), this.addToCartPayload = t
                        }
                    }
                }]);
                var i, p
            }(h.default)
        },
        90991: function(t, e, i) {
            i.d(e, {
                A: function() {
                    return o
                }
            });
            var n = i(53954);

            function o() {
                return o = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(t, e, i) {
                    var o = function(t, e) {
                        for (; !{}.hasOwnProperty.call(t, e) && null !== (t = (0, n.A)(t)););
                        return t
                    }(t, e);
                    if (o) {
                        var s = Object.getOwnPropertyDescriptor(o, e);
                        return s.get ? s.get.call(arguments.length < 3 ? t : i) : s.value
                    }
                }, o.apply(null, arguments)
            }
        }
    }
]);
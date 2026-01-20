"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [3241], {
        57467: function(t, e, i) {
            i.d(e, {
                A: function() {
                    return p
                }
            });
            var n = i(64467),
                r = i(23029),
                s = i(92901),
                o = i(50388),
                a = i(53954),
                l = i(15361),
                u = i(85349),
                c = i.n(u),
                d = i(24263);

            function h(t, e) {
                var i = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    e && (n = n.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), i.push.apply(i, n)
                }
                return i
            }

            function f() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (f = function() {
                    return !!t
                })()
            }
            var p = function(t) {
                function e(t) {
                    var i, n, s, l;
                    return (0, r.A)(this, e), n = this, s = e, l = [t], s = (0, a.A)(s), (i = (0, o.A)(n, f() ? Reflect.construct(s, l || [], (0, a.A)(n).constructor) : s.apply(n, l)))._componentElement = t, i._componentElement.setAttribute("data-component-init", "true"), i._checkMessages(), i
                }
                return (0, l.A)(e, t), (0, s.A)(e, [{
                    key: "$el",
                    get: function() {
                        return this._componentElement
                    }
                }, {
                    key: "$options",
                    get: function() {
                        var t = {},
                            i = function(t) {
                                for (var e = 1; e < arguments.length; e++) {
                                    var i = null != arguments[e] ? arguments[e] : {};
                                    e % 2 ? h(Object(i), !0).forEach(function(e) {
                                        (0, n.A)(t, e, i[e])
                                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : h(Object(i)).forEach(function(e) {
                                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
                                    })
                                }
                                return t
                            }({}, this.$el.dataset);
                        return Object.keys(i).filter(function(t) {
                            return t.includes("option")
                        }).forEach(function(n) {
                            var r, s = e.cleanOptionKey(n);
                            r = i[n].includes("{") && i[n].includes("}") ? JSON.parse(i[n].replace(/'/g, '"')) : e.convertType(i[n]), t[s] = r
                        }), (0, d.A)(t)
                    }
                }, {
                    key: "COMPONENT_NAME",
                    get: function() {
                        return this.$el.getAttribute("data-component")
                    }
                }, {
                    key: "$on",
                    value: function(t, e) {
                        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el,
                            n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                        i && t && e && (n ? c().on(i, t, n, function(t) {
                            t && t.stopPropagation(), e(t)
                        }) : c().on(i, t, function(t) {
                            t && t.stopPropagation(), e(t)
                        }))
                    }
                }, {
                    key: "$one",
                    value: function(t, e) {
                        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.$el;
                        c().one(i, t, e)
                    }
                }, {
                    key: "$off",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        c().off(e, t)
                    }
                }, {
                    key: "$fire",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.$el;
                        c().fire(e, t)
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
                        var i = this,
                            n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            r = arguments.length > 3 ? arguments[3] : void 0;
                        this._loading = !1, setTimeout(function() {
                            i._loading || i.EMIT(i.CUSTOM_MESSAGES.LOADER_EVENTS.hide, {
                                container: t || document.body,
                                message: e,
                                error: n,
                                icon: r
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
            }(i(39860).A)
        },
        63241: function(t, e, i) {
            i.d(e, {
                A: function() {
                    return y
                }
            });
            var n = i(82284),
                r = i(45458),
                s = i(64467),
                o = i(23029),
                a = i(92901),
                l = i(50388),
                u = i(53954),
                c = i(15361),
                d = i(59082),
                h = i(57467),
                f = i(74239),
                p = function(t, e, i) {
                    var n, r = !(null == t || null === (n = t.settings) || void 0 === n || !n.boundTo),
                        s = {
                            mount: function() {
                                i.emit("boundTo.mount")
                            },
                            bound: function() {
                                if (r) {
                                    var i = e.Html.slides.length,
                                        n = b(t.index, i, e.Run.move),
                                        s = i - t.settings.boundTo - 1;
                                    n > s && (e.Run.move = "=".concat(s))
                                }
                            }
                        };
                    return i.on("run.before", function() {
                        s.bound()
                    }), s
                },
                b = function(t, e, i) {
                    return ">" === i.direction ? t + 1 : "<" === i.direction ? t - 1 : i.direction.startsWith("=") ? i.steps : ">>" === i.direction ? e : "<<" === i.direction ? 0 : void 0
                };

            function g(t, e) {
                var i = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(t);
                    e && (n = n.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })), i.push.apply(i, n)
                }
                return i
            }

            function v(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var i = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? g(Object(i), !0).forEach(function(e) {
                        (0, s.A)(t, e, i[e])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i)) : g(Object(i)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(i, e))
                    })
                }
                return t
            }

            function S() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (S = function() {
                    return !!t
                })()
            }
            var y = function(t) {
                function e(t) {
                    var i, n, r, s;
                    return (0, o.A)(this, e), n = this, r = e, s = [t], r = (0, u.A)(r), (i = (0, l.A)(n, S() ? Reflect.construct(r, s || [], (0, u.A)(n).constructor) : r.apply(n, s))).isMount = !1, i.getElements(), i.removeEmptySlides(), i
                }
                return (0, c.A)(e, t), (0, a.A)(e, [{
                    key: "BASE_CONF",
                    get: function() {
                        return {
                            type: "slider",
                            startAt: 0,
                            perView: 1,
                            focusAt: 0,
                            gap: 10,
                            autoplay: !1,
                            hoverpause: !0,
                            keyboard: !0,
                            bound: !0,
                            swipeThreshold: 15,
                            dragThreshold: 10,
                            perTouch: !1,
                            touchRatio: .5,
                            touchAngle: 45,
                            animationDuration: 600,
                            rewind: !1,
                            rewindDuration: 1e3,
                            animationTimingFunc: "cubic-bezier(.165, .840, .440, 1)",
                            throttle: 10,
                            direction: "ltr",
                            peek: 0,
                            breakpoints: {},
                            classes: {
                                direction: {
                                    ltr: "glide--ltr",
                                    rtl: "glide--rtl"
                                },
                                slider: "glide--slider",
                                carousel: "glide--carousel",
                                swipeable: "glide--swipeable",
                                dragging: "glide--dragging",
                                cloneSlide: "glide__slide--clone",
                                activeNav: "glide__bullet--active",
                                activeSlide: "glide__slide--active",
                                disabledArrow: "glide__arrow--disabled"
                            }
                        }
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return {
                            bullets: ".glide__bullets",
                            bullet: ".glide__bullet",
                            slide: ".glide__slide",
                            slides: ".glide__slides",
                            arrows: ".glide__arrows",
                            arrowRight: ".glide__arrow--right",
                            arrowLeft: ".glide__arrow--left",
                            track: ".glide__track",
                            activeNumber: ".active-number",
                            stepFourForward: ".step-four-forward",
                            stepFourBackward: ".step-four-backward",
                            multisearchSkip: ".multisearch-skip"
                        }
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return {
                            unmounted: "unmounted",
                            mounted: "mounted",
                            hide: "d-none",
                            disableLeft: "disable-left",
                            disableRight: "disable-right",
                            ariaDisabled: "aria-disabled",
                            activeSlide: "glide__slide--active"
                        }
                    }
                }, {
                    key: "Messages",
                    get: function() {
                        return (0, s.A)({}, this.CUSTOM_MESSAGES.BREAKPOINTER.BREAKPOINT_CHANGE, this.onBreakpointChange)
                    }
                }, {
                    key: "removeEmptySlides",
                    value: function() {
                        if (this.$slides && 0 !== this.$slides.length) {
                            var t = Array.from(this.$slides).filter(function(t) {
                                var e = "none" === window.getComputedStyle(t).display,
                                    i = !t.textContent.trim() && !t.innerHTML.trim();
                                return e || i
                            });
                            0 !== t.length && (t.forEach(function(t) {
                                return t.remove()
                            }), this.getElements())
                        }
                    }
                }, {
                    key: "getElements",
                    value: function() {
                        this.$track = this.$el.querySelector(this.SELECTORS.track), this.$slides = (0, r.A)(this.$el.querySelectorAll(this.SELECTORS.slide)), this.$bullets = (0, r.A)(this.$el.querySelectorAll(this.SELECTORS.bullet)), this.$arrows = this.$el.querySelector(this.SELECTORS.arrows), this.$activeNumber = this.$el.querySelector(this.SELECTORS.activeNumber), this.$stepFourForward = this.$el.querySelector(this.SELECTORS.stepFourForward), this.$stepFourBackward = this.$el.querySelector(this.SELECTORS.stepFourBackward), this.$multisearchSkip = this.$el.querySelector(this.SELECTORS.multisearchSkip)
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function(t) {
                        this.$br = t.breakPoint, this.$options.carouselBreakpoint && window.mqObj[this.$options.carouselBreakpoint] && (window.innerWidth >= window.mqObj[this.$options.carouselBreakpoint] ? this.glide && this.destroy() : this.glide || this.mount(this.$el, this.$options)), this.$bullets && this.initBullets()
                    }
                }, {
                    key: "mount",
                    value: function(t, e) {
                        var i = this,
                            n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                        this.conf = v(v({}, this.BASE_CONF), e), this.conf.peekCustom && (0, f.Gv)(this.conf.peekCustom) && (this.conf.peekCustom = v({}, this.conf.peekCustom)), "auto" === this.$options.perView && (this.conf.autoSlidesPerView = !0, this.calculateSlidesPerView()), this.limitBoundary(), this.glide = new d.A(t, this.conf), this.$arrows && this.glide.on("build.after", function() {
                            i.updateSlidesFocusability(), i.pauseCarouselAutoplay(), i.enableArrows(), i.$stepFourForward && i.$stepFourBackward && !window.isMobile() && (i.moveStepFour(), i.enableArrows())
                        }), this.glide.on("run.after", function() {
                            if (i.initBulletsAriaCurrent(), i.$arrows && (i.enableArrows(), i.$stepFourForward && i.$stepFourBackward && !window.isMobile() && (i.moveStepFour(), i.enableArrows()), i.$activeNumber)) {
                                var t = i.glide.index;
                                i.$activeNumber.innerHTML = t + 1
                            }
                            i.updateSlidesFocusability()
                        }), this.glide.on("mount.after", function() {
                            i.EMIT(i.CUSTOM_MESSAGES.CAROUSEL_EVENTS.GENERAL_MOUNTED, {
                                element: t
                            }), i.updateSlidesFocusability()
                        }), this.perViewActive = parseInt(this.getActivePerView(), 10), this.glide.on("run", this.handleRunEvent.bind(this)), this.glide.on("resize", function() {
                            return i.perViewActive = parseInt(i.getActivePerView(), 10)
                        }), "auto" === this.$options.perView && this.glide.on("resize", this.handleReSize.bind(this)), this.$options.createbullets && this.createBullets(), this.$bullets && this.initBullets();
                        var r = n;
                        this.conf.boundTo && (r = v(v({}, r), {}, {
                            boundTo: p
                        })), this.conf.peek && this.conf.bound && (0, f.Gv)(this.conf.peek) ? this.glide.mutate([this.fixBoundPeek]).mount(r) : this.glide.mount(r), this.toggleFlags(!0)
                    }
                }, {
                    key: "initBulletsAriaCurrent",
                    value: function() {
                        var t = this;
                        this.$bullets && this.$bullets.length > 0 && this.$bullets[this.glide.index] && this.$bullets.forEach(function(e, i) {
                            t.setAriaCurrent(e, i)
                        })
                    }
                }, {
                    key: "handleRunEvent",
                    value: function() {
                        this.$slides.length <= this.perViewActive && (this.glide.index = 0, this.glide.translate = 0)
                    }
                }, {
                    key: "setAriaCurrent",
                    value: function(t, e) {
                        t.ariaCurrent = e === this.glide.index
                    }
                }, {
                    key: "setAriaLabel",
                    value: function(t, e) {
                        t.ariaLabel = "Vai alla slide " + e
                    }
                }, {
                    key: "moveStepFour",
                    value: function() {
                        var t = this.glide.index,
                            e = this.$slides.length,
                            i = Math.round(this.conf.perView);
                        if (e <= i) return this.$stepFourForward.dataset.glideDir = "=0", void(this.$stepFourBackward.dataset.glideDir = "=0");
                        this.$stepFourForward.dataset.glideDir = e - t >= i + 4 ? "=" + (t + 4) : "=" + (e - i), this.$stepFourBackward.dataset.glideDir = t > 3 ? "=" + (t - 4) : "=0"
                    }
                }, {
                    key: "enableArrows",
                    value: function() {
                        var t = this.$slides.length;
                        if (t <= parseInt(this.getActivePerView(), 10)) return this.$arrows.classList.add(this.CLASSES.disableLeft), this.$arrows.classList.add(this.CLASSES.disableRight), void this.enableArrowsAccessibility();
                        this.$arrows.classList[0 == this.glide.index ? "add" : "remove"](this.CLASSES.disableLeft);
                        var e = this.bulletsNeeded && this.bulletsNeeded > 0 ? this.bulletsNeeded : t - 1,
                            i = !!this.conf.boundTo && this.glide.index >= t - 1 - this.conf.boundTo,
                            n = this.glide.index >= e || this.glide.settings.perView > t - 1 || i || this.$stepFourForward && this.$stepFourBackward && !this.$multisearchSkip && this.glide.index == t - Math.round(this.conf.perView) - 1 && !window.isMobile() || this.$stepFourForward && this.$stepFourBackward && this.$multisearchSkip && this.glide.index >= 5 && !window.isMobile();
                        this.$arrows.classList[n ? "add" : "remove"](this.CLASSES.disableRight), this.enableArrowsAccessibility()
                    }
                }, {
                    key: "enableArrowsAccessibility",
                    value: function() {
                        var t = this.$arrows.querySelector(this.SELECTORS.arrowRight),
                            e = this.$arrows.querySelector(this.SELECTORS.arrowLeft);
                        t && (this.$arrows.classList.contains(this.CLASSES.disableRight) ? (t.setAttribute(this.CLASSES.ariaDisabled, "true"), t.setAttribute("tabindex", "-1")) : (t.setAttribute(this.CLASSES.ariaDisabled, "false"), t.removeAttribute("tabindex", "-1"))), e && (this.$arrows.classList.contains(this.CLASSES.disableLeft) ? (e.setAttribute(this.CLASSES.ariaDisabled, "true"), e.setAttribute("tabindex", "-1")) : (e.setAttribute(this.CLASSES.ariaDisabled, "false"), e.removeAttribute("tabindex", "-1")))
                    }
                }, {
                    key: "getActivePerView",
                    value: function() {
                        for (var t = this.$options.breakpoints || {}, e = window.innerWidth, i = Object.keys(t).sort(function(t, e) {
                                return parseInt(t, 10) - parseInt(e, 10)
                            }), n = this.$options.perView || 1, r = 0; i.length > r; r++) {
                            var s, o = i[r];
                            if (e <= parseInt(o, 10) && null !== (s = t[o]) && void 0 !== s && s.perView) {
                                n = t[o].perView;
                                break
                            }
                        }
                        return n
                    }
                }, {
                    key: "initBullets",
                    value: function() {
                        var t = this;
                        if (this.glide) {
                            var e, i = null === (e = Object.keys(this.conf.breakpoints)) || void 0 === e ? void 0 : e.map(function(t) {
                                    var e = 0;
                                    try {
                                        e = parseInt(t)
                                    } catch (t) {}
                                    return e
                                }),
                                n = 0;
                            Object.values(window.mqObj).forEach(function(t) {
                                window.innerWidth >= t && (n = t)
                            });
                            var r, s = null == i ? void 0 : i.filter(function(e) {
                                    var i;
                                    return e > n && (null === (i = t.conf.breakpoints[e]) || void 0 === i ? void 0 : i.perView)
                                }),
                                o = null == s ? void 0 : s.sort(function(t, e) {
                                    return t - e
                                });
                            if (null != o && o.length) try {
                                r = Math.floor(this.conf.breakpoints[o[0]].perView)
                            } catch (t) {} else try {
                                r = parseInt(this.conf.perView)
                            } catch (t) {}
                            this.bulletsNeeded = this.$slides.length - r, this.$bullets.forEach(function(e, i) {
                                e.ariaHidden = !0, e.tabIndex = -1, t.setAriaLabel(e, i + 1), t.setAriaCurrent(e, i), e.classList.remove(t.CLASSES.hide), i > t.bulletsNeeded && e.classList.add(t.CLASSES.hide)
                            }), this.$el.querySelector(this.SELECTORS.bullets) && (this.$el.querySelector(this.SELECTORS.bullets).ariaHidden = !0)
                        }
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.glide && (this.glide.destroy(), this.glide = void 0, this.toggleFlags(!1))
                    }
                }, {
                    key: "toggleFlags",
                    value: function(t) {
                        this.isMount = t, this.$el.classList[t ? "remove" : "add"](this.CLASSES.unmounted), this.$el.classList[t ? "add" : "remove"](this.CLASSES.mounted)
                    }
                }, {
                    key: "calculateSlidesPerView",
                    value: function() {
                        if (this.conf.autoSlidesPerView) {
                            var t = this.$track.offsetWidth,
                                e = 0;
                            this.conf.peekCustom && isNaN(this.conf.peekCustom) && (e = (e = e + this.conf.peekCustom.before ? this.conf.peekCustom.before : 0) + this.conf.peekCustom.after ? this.conf.peekCustom.after : 0), t -= e || 0, this.perViewAutoSlideWidth || (this.perViewAutoSlideWidth = (0, f.Gq)(this.$slides[0])), this.conf.perView = t / this.perViewAutoSlideWidth
                        }
                    }
                }, {
                    key: "limitBoundary",
                    value: function() {
                        var t = this.$slides.length,
                            e = Math.round(this.conf.perView);
                        this.conf.beyondTheBoundary && (t <= e ? this.conf.startAt = 0 : (this.conf.startAt && this.conf.startAt > 0 && t - Number(this.conf.startAt) >= e - 1 && (this.conf.startAt = Number(this.conf.startAt) - 1), this.conf.startAt && t - Number(this.conf.startAt) < e - 1 && (this.conf.startAt = e > t ? 0 : t - e + 1)))
                    }
                }, {
                    key: "handleReSize",
                    value: function() {
                        this.calculateSlidesPerView(), this.limitBoundary(), this.glide.update({
                            perView: this.conf.perView
                        }), this.enableArrows()
                    }
                }, {
                    key: "createBullets",
                    value: function() {
                        var t = this;
                        if (this.$bulletWrapper = this.$el.querySelector(this.SELECTORS.bullets), this.$bulletWrapper && this.$slides.length > 1) {
                            this.$bulletWrapper.innerHTML = "";
                            var e = document.createDocumentFragment();
                            this.$slides.forEach(function(i, n) {
                                var r = document.createElement("button");
                                r.classList.add("glide__bullet"), r.setAttribute("data-glide-dir", "=".concat(n)), t.setAriaLabel(r, n + 1), e.appendChild(r)
                            }), this.$bulletWrapper.appendChild(e), this.$bullets = (0, r.A)(this.$el.querySelectorAll(this.SELECTORS.bullet))
                        }
                    }
                }, {
                    key: "fixBoundPeek",
                    value: function(t, e, i) {
                        return {
                            modify: function(i) {
                                var r = e.Run.isBound;
                                if ("function" != typeof r && (r = function() {
                                        return t.isType("slider") && "center" !== t.settings.focusAt && t.settings.bound
                                    }), r() && e.Run.isEnd()) {
                                    var s = e.Peek.value;
                                    return "object" === (0, n.A)(s) && s.after ? i - s.after : i - s
                                }
                                return i
                            }
                        }
                    }
                }, {
                    key: "updateSlidesFocusability",
                    value: function() {
                        var t = this;
                        if (this.$options.tabOnlyVisible) {
                            var e = (0, r.A)(this.$el.querySelectorAll(this.SELECTORS.slide));
                            e.forEach(function(e) {
                                var i = e.classList.contains(t.CLASSES.activeSlide),
                                    n = (0, r.A)(e.querySelectorAll("a, button, input, textarea, select, area, [tabindex]"));
                                e.ariaHidden = !i, n.forEach(function(t) {
                                    if (i)
                                        if (t.hasAttribute("data-old-tabindex")) {
                                            var e = t.getAttribute("data-old-tabindex");
                                            "" === e ? t.removeAttribute("tabindex") : t.setAttribute("tabindex", e), t.removeAttribute("data-old-tabindex")
                                        } else "-1" === t.getAttribute("tabindex") && t.removeAttribute("tabindex");
                                    else t.hasAttribute("tabindex") && "-1" !== t.getAttribute("tabindex") ? t.setAttribute("data-old-tabindex", t.getAttribute("tabindex")) : t.hasAttribute("tabindex") || t.setAttribute("data-old-tabindex", ""), t.setAttribute("tabindex", "-1")
                                })
                            })
                        }
                    }
                }, {
                    key: "pauseCarouselAutoplay",
                    value: function() {
                        var t = this;
                        this.$options.tabOnlyVisible && this.$options.autoplay && (this.$el.addEventListener("focusin", function() {
                            t.glide && t.glide.settings.autoplay && (t.glide.pause(), t.glide.settings.autoplay = !1)
                        }), this.$el.addEventListener("focusout", function(e) {
                            setTimeout(function() {
                                !t.$el.contains(document.activeElement) && t.glide && (t.glide.settings.autoplay = t.$options.autoplay, t.glide.play(t.glide.settings.autoplay))
                            }, 0)
                        }))
                    }
                }])
            }(h.A)
        },
        74239: function(t, e, i) {
            i.d(e, {
                Gq: function() {
                    return s
                },
                Gv: function() {
                    return a
                },
                Wp: function() {
                    return o
                },
                Xn: function() {
                    return c
                },
                qG: function() {
                    return u
                }
            });
            var n = i(82284),
                r = i(45458);

            function s(t) {
                var e = t.offsetWidth,
                    i = getComputedStyle(t);
                return e += parseInt(i.marginLeft) + parseInt(i.marginRight)
            }

            function o(t, e) {
                if (t && e) {
                    e instanceof HTMLCollection && (e = (0, r.A)(e)), e instanceof HTMLElement && (e = [e]);
                    var i = document.createDocumentFragment();
                    e.forEach(function(t) {
                        Array.isArray(t) ? t.forEach(function(t) {
                            return i.appendChild(t)
                        }) : i.appendChild(t)
                    }), t.appendChild(i)
                }
            }

            function a(t) {
                var e = void 0 === t ? "undefined" : l(t);
                return "function" === e || "object" === e && !!t
            }
            var l = "function" == typeof Symbol && "symbol" === (0, n.A)(Symbol.iterator) ? function(t) {
                return (0, n.A)(t)
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : (0, n.A)(t)
            };

            function u(t) {
                t.style.opacity = "0", t.classList.remove("transition-hidden"), t.classList.add("transition-show"),
                    function e() {
                        var i = parseFloat(t.style.opacity);
                        (i += .1) <= 1 && (t.style.opacity = "".concat(i), requestAnimationFrame(e))
                    }()
            }

            function c(t) {
                t.style.opacity = "1",
                    function e() {
                        var i = parseFloat(t.style.opacity);
                        (i -= .1) < 0 ? (t.classList.remove("transition-show"), t.classList.add("transition-hidden")) : (t.style.opacity = "".concat(i), requestAnimationFrame(e))
                    }()
            }
        }
    }
]);
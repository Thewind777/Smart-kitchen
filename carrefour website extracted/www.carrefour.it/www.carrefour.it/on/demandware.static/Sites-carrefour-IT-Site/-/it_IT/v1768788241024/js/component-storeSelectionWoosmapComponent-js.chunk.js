"use strict";
(self.webpackChunkapp_project = self.webpackChunkapp_project || []).push([
    [5719], {
        16371: function(e, t, i) {
            i.d(t, {
                F_: function() {
                    return a
                },
                gT: function() {
                    return o
                }
            });
            var n = {};

            function a(e, t) {
                n[e] = t
            }

            function o() {
                window.addEventListener("message", function(e) {
                    try {
                        var t = "string" == typeof e.data ? JSON.parse(e.data) : e.data,
                            i = t.action,
                            a = t.payload;
                        n[i] && n[i](a)
                    } catch (e) {}
                })
            }
        },
        66423: function(e, t, i) {
            i.r(t), i.d(t, {
                default: function() {
                    return _
                }
            });
            var n = i(82284),
                a = i(10467),
                o = i(64467),
                s = i(23029),
                r = i(92901),
                l = i(50388),
                c = i(15361),
                u = i(53954),
                d = i(90991),
                p = i(54756),
                y = i.n(p),
                h = i(39121),
                m = i(8732),
                b = i(95171),
                v = i.n(b),
                S = i(46749),
                f = i.n(S),
                g = i(8983),
                k = i(67303),
                L = i(16371);
            var E = i(77279),
                A = i(4523);

            function C(e, t) {
                var i = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (!i) {
                    if (Array.isArray(e) || (i = function(e, t) {
                            if (e) {
                                if ("string" == typeof e) return T(e, t);
                                var i = {}.toString.call(e).slice(8, -1);
                                return "Object" === i && e.constructor && (i = e.constructor.name), "Map" === i || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? T(e, t) : void 0
                            }
                        }(e)) || t && e && "number" == typeof e.length) {
                        i && (e = i);
                        var n = 0,
                            a = function() {};
                        return {
                            s: a,
                            n: function() {
                                return n >= e.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: e[n++]
                                }
                            },
                            e: function(e) {
                                throw e
                            },
                            f: a
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, s = !0,
                    r = !1;
                return {
                    s: function() {
                        i = i.call(e)
                    },
                    n: function() {
                        var e = i.next();
                        return s = e.done, e
                    },
                    e: function(e) {
                        r = !0, o = e
                    },
                    f: function() {
                        try {
                            s || null == i.return || i.return()
                        } finally {
                            if (r) throw o
                        }
                    }
                }
            }

            function T(e, t) {
                (null == t || t > e.length) && (t = e.length);
                for (var i = 0, n = Array(t); i < t; i++) n[i] = e[i];
                return n
            }

            function P(e, t) {
                var i = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    t && (n = n.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable
                    })), i.push.apply(i, n)
                }
                return i
            }

            function w(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? P(Object(i), !0).forEach(function(t) {
                        (0, o.A)(e, t, i[t])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : P(Object(i)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t))
                    })
                }
                return e
            }

            function O() {
                try {
                    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (e) {}
                return (O = function() {
                    return !!e
                })()
            }

            function R(e, t, i, n) {
                var a = (0, d.A)((0, u.A)(1 & n ? e.prototype : e), t, i);
                return 2 & n && "function" == typeof a ? function(e) {
                    return a.apply(i, e)
                } : a
            }
            var _ = function(e) {
                function t(e) {
                    var i, n, a, o;
                    if ((0, s.A)(this, t), n = this, a = t, o = [e], a = (0, u.A)(a), (i = (0, l.A)(n, O() ? Reflect.construct(a, o || [], (0, u.A)(n).constructor) : a.apply(n, o))).sidebar = document.querySelector(".storeSelectio-sidebar"), i.container = document.querySelector(i.SELECTORS.storeServiceList), i.introbox = document.querySelector(i.SELECTORS.introBoxes), i.placeRecap = document.querySelector(i.SELECTORS.placeRecap), i.input = document.querySelector("#sidebarAddressAutocomplete"), i.btnSubmit = document.querySelector(".js-btn-store"), i.suggestionsList = document.querySelector("#suggestions-list"), i.clearSearchBtn = document.querySelector("#store-selection-clear-btn"), i.currentPosition = null, i.locationPromiseResolver = null, i.locationPromiseRejecter = null, i.waitingForLocation = null, i.language = "it", i.logsEnabled = i.$options.enableLogs, i.provinceList = [{
                            key: "AG",
                            label: "Agrigento"
                        }, {
                            key: "AL",
                            label: "Alessandria"
                        }, {
                            key: "AN",
                            label: "Ancona"
                        }, {
                            key: "AO",
                            label: "Aosta"
                        }, {
                            key: "AR",
                            label: "Arezzo"
                        }, {
                            key: "AP",
                            label: "Ascoli Piceno"
                        }, {
                            key: "AT",
                            label: "Asti"
                        }, {
                            key: "AV",
                            label: "Avellino"
                        }, {
                            key: "BA",
                            label: "Bari"
                        }, {
                            key: "BT",
                            label: "Barletta Andria Trani"
                        }, {
                            key: "BL",
                            label: "Belluno"
                        }, {
                            key: "BN",
                            label: "Benevento"
                        }, {
                            key: "BG",
                            label: "Bergamo"
                        }, {
                            key: "BI",
                            label: "Biella"
                        }, {
                            key: "BO",
                            label: "Bologna"
                        }, {
                            key: "BZ",
                            label: "Bolzano"
                        }, {
                            key: "BS",
                            label: "Brescia"
                        }, {
                            key: "BR",
                            label: "Brindisi"
                        }, {
                            key: "CA",
                            label: "Cagliari"
                        }, {
                            key: "CL",
                            label: "Caltanissetta"
                        }, {
                            key: "CB",
                            label: "Campobasso"
                        }, {
                            key: "CI",
                            label: "Carbonia Iglesias"
                        }, {
                            key: "CE",
                            label: "Caserta"
                        }, {
                            key: "CT",
                            label: "Catania"
                        }, {
                            key: "CZ",
                            label: "Catanzaro"
                        }, {
                            key: "CH",
                            label: "Chieti"
                        }, {
                            key: "CO",
                            label: "Como"
                        }, {
                            key: "CS",
                            label: "Cosenza"
                        }, {
                            key: "CR",
                            label: "Cremona"
                        }, {
                            key: "KR",
                            label: "Crotone"
                        }, {
                            key: "CN",
                            label: "Cuneo"
                        }, {
                            key: "EN",
                            label: "Enna"
                        }, {
                            key: "FM",
                            label: "Fermo"
                        }, {
                            key: "FE",
                            label: "Ferrara"
                        }, {
                            key: "FI",
                            label: "Firenze"
                        }, {
                            key: "FG",
                            label: "Foggia"
                        }, {
                            key: "FC",
                            label: "Forlì Cesena"
                        }, {
                            key: "FR",
                            label: "Frosinone"
                        }, {
                            key: "GE",
                            label: "Genova"
                        }, {
                            key: "GO",
                            label: "Gorizia"
                        }, {
                            key: "GR",
                            label: "Grosseto"
                        }, {
                            key: "IM",
                            label: "Imperia"
                        }, {
                            key: "IS",
                            label: "Isernia"
                        }, {
                            key: "SP",
                            label: "La Spezia"
                        }, {
                            key: "AQ",
                            label: "L'Aquila"
                        }, {
                            key: "LT",
                            label: "Latina"
                        }, {
                            key: "LE",
                            label: "Lecce"
                        }, {
                            key: "LC",
                            label: "Lecco"
                        }, {
                            key: "LI",
                            label: "Livorno"
                        }, {
                            key: "LO",
                            label: "Lodi"
                        }, {
                            key: "LU",
                            label: "Lucca"
                        }, {
                            key: "MC",
                            label: "Macerata"
                        }, {
                            key: "MN",
                            label: "Mantova"
                        }, {
                            key: "MS",
                            label: "Massa Carrara"
                        }, {
                            key: "MT",
                            label: "Matera"
                        }, {
                            key: "VS",
                            label: "Medio Campidano"
                        }, {
                            key: "ME",
                            label: "Messina"
                        }, {
                            key: "MI",
                            label: "Milano"
                        }, {
                            key: "MO",
                            label: "Modena"
                        }, {
                            key: "MB",
                            label: "Monza Brianza"
                        }, {
                            key: "NA",
                            label: "Napoli"
                        }, {
                            key: "NO",
                            label: "Novara"
                        }, {
                            key: "NU",
                            label: "Nuoro"
                        }, {
                            key: "OG",
                            label: "Ogliastra"
                        }, {
                            key: "OT",
                            label: "Olbia Tempio"
                        }, {
                            key: "OR",
                            label: "Oristano"
                        }, {
                            key: "PD",
                            label: "Padova"
                        }, {
                            key: "PA",
                            label: "Palermo"
                        }, {
                            key: "PR",
                            label: "Parma"
                        }, {
                            key: "PV",
                            label: "Pavia"
                        }, {
                            key: "PG",
                            label: "Perugia"
                        }, {
                            key: "PU",
                            label: "Pesaro e Urbino"
                        }, {
                            key: "PE",
                            label: "Pescara"
                        }, {
                            key: "PC",
                            label: "Piacenza"
                        }, {
                            key: "PI",
                            label: "Pisa"
                        }, {
                            key: "PT",
                            label: "Pistoia"
                        }, {
                            key: "PN",
                            label: "Pordenone"
                        }, {
                            key: "PZ",
                            label: "Potenza"
                        }, {
                            key: "PO",
                            label: "Prato"
                        }, {
                            key: "RG",
                            label: "Ragusa"
                        }, {
                            key: "RA",
                            label: "Ravenna"
                        }, {
                            key: "RC",
                            label: "Reggio Calabria"
                        }, {
                            key: "RE",
                            label: "Reggio Emilia"
                        }, {
                            key: "RI",
                            label: "Rieti"
                        }, {
                            key: "RN",
                            label: "Rimini"
                        }, {
                            key: "RM",
                            label: "Roma"
                        }, {
                            key: "RO",
                            label: "Rovigo"
                        }, {
                            key: "SA",
                            label: "Salerno"
                        }, {
                            key: "SS",
                            label: "Sassari"
                        }, {
                            key: "SV",
                            label: "Savona"
                        }, {
                            key: "SI",
                            label: "Siena"
                        }, {
                            key: "SR",
                            label: "Siracusa"
                        }, {
                            key: "SO",
                            label: "Sondrio"
                        }, {
                            key: "TA",
                            label: "Taranto"
                        }, {
                            key: "TE",
                            label: "Teramo"
                        }, {
                            key: "TR",
                            label: "Terni"
                        }, {
                            key: "TO",
                            label: "Torino"
                        }, {
                            key: "TP",
                            label: "Trapani"
                        }, {
                            key: "TN",
                            label: "Trento"
                        }, {
                            key: "TV",
                            label: "Treviso"
                        }, {
                            key: "TS",
                            label: "Trieste"
                        }, {
                            key: "UD",
                            label: "Udine"
                        }, {
                            key: "VA",
                            label: "Varese"
                        }, {
                            key: "VE",
                            label: "Venezia"
                        }, {
                            key: "VB",
                            label: "Verbano Cusio Ossola"
                        }, {
                            key: "VC",
                            label: "Vercelli"
                        }, {
                            key: "VR",
                            label: "Verona"
                        }, {
                            key: "VV",
                            label: "Vibo Valentia"
                        }, {
                            key: "VI",
                            label: "Vicenza"
                        }, {
                            key: "VT",
                            label: "Viterbo"
                        }], i.isMobileApp = document.querySelector(i.SELECTORS.isApp), i.isMobileApp && !i.$options.isVolantiniPage && (0, L.F_)("SEND_LOCATION", function(e) {
                            if (i.locationPromiseResolver) {
                                var t = e.latitude,
                                    n = e.longitude;
                                t && n ? i.locationPromiseResolver({
                                    lat: t,
                                    lng: n
                                }) : i.locationPromiseRejecter("Dati di posizione invalidi"), i.locationPromiseResolver = null, i.locationPromiseRejecter = null
                            }
                        }), i.initWoosmap(), i.restoreLayerOnEmptyInput(), i.autocompleteTypeMapping = i.$options.autocompleteTypeMapping, i.timeslotEnabled = i.$options.timeslotEnabled, i.$areaLabel = i.$el.closest(".store-selection-component") ? "spalla" : i.$el.closest(".vex") ? "modale" : "", !i.$options.isStorePage) {
                        var r = new MutationObserver(function(e) {
                            document.contains(document.querySelector(".pac-container:not(.maps):not(.ws-container)")) && (document.querySelector(".storeSelectio-sidebar").appendChild(document.querySelector(".pac-container:not(.maps):not(.ws-container)")), r.disconnect())
                        });
                        r.observe(document, {
                            attributes: !1,
                            childList: !0,
                            characterData: !1,
                            subtree: !0
                        })
                    }
                    return i
                }
                return (0, c.A)(t, e), (0, r.A)(t, [{
                    key: "Messages",
                    get: function() {
                        return (0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)((0, o.A)({}, this.CUSTOM_MESSAGES.STORE_SELECTION_SELECT_EVENTS.changed, this.save), this.CUSTOM_MESSAGES.SHIPPING_UPDATE_EVENTS.updated, this.updateSelection), "error.NO_SHIPPING_METHOD_SELECTED", this.handleAddToCart), "error.NO_SHIPPING_METHOD_SELECTED_REORDER", this.handleReorder), this.CUSTOM_MESSAGES.STORE_SELECTION_SELECT_EVENTS.close, this.resetLayer), this.CUSTOM_MESSAGES.TIMESLOT.INIT_COMPONENT, this.sendAddToCartPayload)
                    }
                }, {
                    key: "autocompleteOptions",
                    get: function() {
                        return {
                            input: this.input.value,
                            components: {
                                country: "it"
                            },
                            language: this.language,
                            types: ["address", "locality"],
                            excluded_types: ["suburb", "quarter", "neighbourhood"],
                            custom_description: 'locality:"{name}, {administrative_area_level_1}, {administrative_area_level_0} "',
                            extended: "postal_code"
                        }
                    }
                }, {
                    key: "SELECTORS",
                    get: function() {
                        return w(w({}, R(t, "SELECTORS", this, 1)), {}, {
                            storeServiceList: ".services-list",
                            introBoxes: ".informative-info",
                            placeRecap: "#place-recap",
                            paccontainer: ".pac-container",
                            findCurrentPositionBtn: ".storeSelectio-sidebar .iamhere",
                            pushApp: ".push-app-content-wrapper",
                            isApp: ".mobile-layout",
                            selectedSuggestionElement: "li.pac-item-selected"
                        })
                    }
                }, {
                    key: "CLASSES",
                    get: function() {
                        return w(w({}, R(t, "CLASSES", this, 1)), {}, {
                            selectedSuggestion: "pac-item-selected",
                            showClear: "show"
                        })
                    }
                }, {
                    key: "initWoosmapScript",
                    value: function() {
                        return new Promise(function(e, t) {
                            var i = document.createElement("script");
                            i.src = "https://sdk.woosmap.com/localities/localities.2.0.js", i.async = !0, i.onload = function() {
                                return e("Script sdk.woosmap.com/localities/localities loaded successfully.")
                            }, i.onerror = function() {
                                return t(new Error("Failed to load script sdk.woosmap.com/localities/localities."))
                            }, document.head.appendChild(i)
                        })
                    }
                }, {
                    key: "setInputListeners",
                    value: function() {
                        var e = this;
                        this.input.addEventListener("input", (0, A.sg)(this.handleAutocompleteWoosmap.bind(this), 400)), this.sidebar.addEventListener("mousedown", function(t) {
                            var i = document.elementFromPoint(t.clientX, t.clientY);
                            setTimeout(function() {
                                e.input.contains(t.target) || e.suggestionsList.contains(i) || (e.suggestionsList.style.display = "none")
                            }, 500)
                        }), this.input.addEventListener("focus", function() {
                            e.input && "" !== e.input.value && setTimeout(function() {
                                e.suggestionsList.style.display = "block"
                            }, 500)
                        }), this.input.addEventListener("keydown", function(t) {
                            if (e.suggestionsList.checkVisibility()) {
                                var i, n = e.suggestionsList.querySelector(e.SELECTORS.selectedSuggestionElement),
                                    a = e.suggestionsList.querySelector("li");
                                if ("ArrowUp" === t.key)
                                    if (e.removeSelection(), n) n.previousElementSibling && "BUTTON" !== n.previousElementSibling.tagName ? (n.previousElementSibling.classList.add(e.CLASSES.selectedSuggestion), e.input.value = n.previousElementSibling.innerText) : e.input.value = e.input.defaultValue;
                                    else null === (i = e.suggestionsList.lastElementChild) || void 0 === i || i.classList.add(e.CLASSES.selectedSuggestion), e.input.value = e.suggestionsList.lastElementChild.innerText;
                                "ArrowDown" === t.key && (e.removeSelection(), !n && a ? (a.classList.add(e.CLASSES.selectedSuggestion), e.input.value = a.innerText) : n.nextElementSibling ? (n.nextElementSibling.classList.add(e.CLASSES.selectedSuggestion), e.input.value = n.nextElementSibling.innerText) : e.input.value = e.input.defaultValue), "Enter" === t.key && (n ? n.click() : a && a.click())
                            }
                        }), this.clearSearchBtn.addEventListener("click", function() {
                            e.input.value = "", e.suggestionsList.style.display = "none", e.clearSearchBtn.classList.remove(e.CLASSES.showClear), e.input.focus()
                        }), this.btnSubmit.addEventListener("click", function(t) {
                            var i = new KeyboardEvent("keydown", {
                                key: "Enter",
                                code: "Enter",
                                keyCode: 13,
                                which: 13,
                                bubbles: !0,
                                cancelable: !0
                            });
                            e.input.dispatchEvent(i), e.isMobileApp && ((0, k.v)({
                                action: "OK_STORE_LAYER"
                            }), e.input.blur())
                        })
                    }
                }, {
                    key: "initWoosmap",
                    value: function() {
                        var e = this;
                        this.initWoosmapScript().then(function() {
                            e.localitiesAutocompleteService = new window.woosmap.localities.AutocompleteService(e.$options.wskey, e.language), e.input && e.suggestionsList && e.setInputListeners()
                        }).catch(function(e) {})
                    }
                }, {
                    key: "removeSelection",
                    value: function() {
                        var e = this;
                        this.suggestionsList.querySelectorAll("li").forEach(function(t) {
                            t.classList.remove(e.CLASSES.selectedSuggestion)
                        })
                    }
                }, {
                    key: "autocompletePromise",
                    value: function(e) {
                        var t = this,
                            i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                        return new Promise(function(n, a) {
                            t.localitiesAutocompleteService.autocomplete(e, function(e) {
                                return n(e)
                            }, function(e) {
                                return a(e)
                            }, i)
                        })
                    }
                }, {
                    key: "getDetailPromise",
                    value: function(e) {
                        var t = this;
                        return new Promise(function(i, n) {
                            t.localitiesAutocompleteService.getDetails(e, function(e) {
                                return i(e)
                            }, function(e) {
                                return n(e)
                            })
                        })
                    }
                }, {
                    key: "handleAutocompleteWoosmap",
                    value: function() {
                        var e = this;
                        if (this.input && this.suggestionsList) {
                            var t = this.input.value;
                            if (t.replace('"', '\\"').replace(/^\s+|\s+$/g, ""), "" !== t) {
                                var i, n;
                                this.introbox.classList.add("hidden"), document.querySelector(".storeSelectio-sidebar").classList.remove("initial-state");
                                var a = null === (i = this.autocompleteTypeMapping) || void 0 === i || null === (i = i.address) || void 0 === i ? void 0 : i.some(function(e) {
                                        return t.toLowerCase().startsWith(e)
                                    }),
                                    o = null === (n = this.autocompleteTypeMapping) || void 0 === n || null === (n = n.locality) || void 0 === n ? void 0 : n.some(function(e) {
                                        return t.toLowerCase() === e
                                    }),
                                    s = this.autocompleteOptions;
                                s.types = a && !o ? ["address"] : ["address", "locality"], this.autocompletePromise(s).then(function(t) {
                                    e.logsEnabled, e.displaySuggestions(t)
                                }).catch(function(e) {})
                            } else this.suggestionsList.style.display = "none", this.clearSearchBtn.classList.remove(this.CLASSES.showClear)
                        }
                    }
                }, {
                    key: "displaySuggestions",
                    value: (P = (0, a.A)(y().mark(function e(t) {
                        var i, n = this;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (i = t.localities, !this.input || !this.suggestionsList) {
                                        e.next = 2;
                                        break
                                    }
                                    return this.suggestionsList.innerHTML = "", e.next = 1, this.initGeoloc();
                                case 1:
                                    i.length > 0 ? (i.forEach(function(e) {
                                        var t, i = document.createElement("li");
                                        i.classList.add("pac-item"), i.innerHTML = null !== (t = n.formatPredictionList(e)) && void 0 !== t ? t : "", i.addEventListener("click", function() {
                                            var t;
                                            n.input.value = null !== (t = e.description) && void 0 !== t ? t : "", n.suggestionsList.style.display = "none", n.getDetailPromise(e.public_id).then(function(e) {
                                                n.logsEnabled, n.displayLocalitiesResponse(e)
                                            }).catch(function(e) {})
                                        }), n.suggestionsList.appendChild(i)
                                    }), this.suggestionsList.style.display = "block", this.clearSearchBtn.classList.add(this.CLASSES.showClear)) : this.suggestionsList.style.display = "none";
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function(e) {
                        return P.apply(this, arguments)
                    })
                }, {
                    key: "formatPredictionList",
                    value: function(e) {
                        var t = e,
                            i = t.matched_substrings,
                            n = "";
                        n = t.matched_substrings && t.matched_substrings.description ? this.bold_matched_substring(t.description, i.description) : t.description;
                        var a = "";
                        return a += '<div class="prediction '.concat("no-viewpoint", '">').concat(n, "</div>")
                    }
                }, {
                    key: "bold_matched_substring",
                    value: function(e, t) {
                        var i, n = C(t = t.reverse());
                        try {
                            for (n.s(); !(i = n.n()).done;) {
                                var a = i.value,
                                    o = e.substring(a.offset, a.offset + a.length);
                                e = "".concat(e.substring(0, a.offset), "<span class='bold'>").concat(o, "</span>").concat(e.substring(a.offset + a.length))
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                        return e
                    }
                }, {
                    key: "displayLocalitiesResponse",
                    value: function(e) {
                        if (this.clear(), e.geometry) {
                            var t = {
                                lat: "function" == typeof e.geometry.location.lat ? e.geometry.location.lat() : e.geometry.location.lat,
                                long: "function" == typeof e.geometry.location.lng ? e.geometry.location.lng() : e.geometry.location.lng,
                                cap: e.types.includes("postal_code") ? e.name : this.getAddressPart(e.address_components, "cap"),
                                city: e.types.includes("locality") ? e.name : this.getAddressPart(e.address_components, "city"),
                                state: this.getAddressPart(e.address_components, "administrativeAreaLevel1"),
                                address: this.getAddressPart(e.address_components, "address"),
                                civic: this.getAddressPart(e.address_components, "civic"),
                                administrativeAreaLevel3: this.getAddressPart(e.address_components, "administrativeAreaLevel3"),
                                isGeneric: this.getAddressGenericForWoosmap(e.types) ? 1 : 0
                            };
                            t.state && (e.types.includes("locality") || e.types.includes("postal_code")) && this.provinceList && "object" === (0, n.A)(this.provinceList) && (t.state = this.findProvinceOption(t.state)), t.cap && "object" === (0, n.A)(t.cap) && (1 == t.cap.length ? t.cap = t.cap[0] : t.cap.length > 1 && (t.cap = null)), this.save(t)
                        } else this.endLoading(this.sidebar)
                    }
                }, {
                    key: "findProvinceOption",
                    value: function(e) {
                        var t = this.provinceList.filter(function(t) {
                            return e.replaceAll("-", " ") === (t.label || t.key)
                        });
                        return t && t.length > 0 ? t[0].key : e
                    }
                }, {
                    key: "partnerTargetForApp",
                    value: function() {
                        if (this.isMobileApp) {
                            var e = document.querySelectorAll(".partner-link");
                            e && e.length > 0 && e.forEach(function(e) {
                                e.addEventListener("click", function(t) {
                                    t.preventDefault(), (0, k.v)({
                                        goToPartnerUrl: e.href
                                    })
                                })
                            })
                        }
                    }
                }, {
                    key: "restoreLayerOnEmptyInput",
                    value: function() {
                        var e = document.getElementById("sidebarAddressAutocomplete");
                        e.oninput = function(t) {
                            e.setAttribute("value", e.value)
                        };
                        new MutationObserver(function(e, t) {
                            var i, n = C(e);
                            try {
                                for (n.s(); !(i = n.n()).done;) {
                                    "" === i.value.target.value && setTimeout(function() {
                                        var e, t;
                                        null === (e = document.querySelector(".services-list")) || void 0 === e || e.classList.add("hidden"), null === (t = document.querySelector(".informative-info")) || void 0 === t || t.classList.remove("hidden"), document.querySelector(".storeSelectio-sidebar").classList.add("initial-state"), document.querySelector("#suggestions-list").style.display = "none"
                                    }, 400)
                                }
                            } catch (e) {
                                n.e(e)
                            } finally {
                                n.f()
                            }
                        }).observe(e, {
                            attributes: !0,
                            childList: !0,
                            subtree: !0
                        })
                    }
                }, {
                    key: "initGeoloc",
                    value: (T = (0, a.A)(y().mark(function e() {
                        var t, i, n, a, o, s = this;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    document.querySelector(this.SELECTORS.findCurrentPositionBtn) || ((t = document.createElement("button")).classList.add("pac-item", "iamhere"), (i = document.createElement("span")).classList.add("pac-icon", "pac-icon-marker"), (n = document.createElement("span")).classList.add("icon-geolocstore"), t.appendChild(i), t.appendChild(n), a = document.createTextNode("Utilizza la mia posizione attuale"), t.appendChild(a), (o = document.querySelector(this.SELECTORS.paccontainer)) && o.firstChild ? o.insertBefore(t, o.firstChild) : o && o.appendChild(t), t.addEventListener("click", function(e) {
                                        e.stopPropagation(), e.preventDefault(), s.loading(s.sidebar), s.clickFindCurrentPositionCB()
                                    }));
                                case 1:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function() {
                        return T.apply(this, arguments)
                    })
                }, {
                    key: "clickFindCurrentPositionCB",
                    value: (S = (0, a.A)(y().mark(function e() {
                        var t = this;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return e.next = 1, this.getClientLocation();
                                case 1:
                                    if (this.currentPosition && this.currentPosition.lat && this.currentPosition.lng) try {
                                        (0, E.QL)(this.$options.wskey, this.currentPosition.lat, this.currentPosition.lng).then(function(e) {
                                            if (t.logsEnabled, e && e.results[0]) {
                                                var i = e.results[0];
                                                t.input.value = i.formatted_address, t.displayLocalitiesResponse(i)
                                            }
                                        }).catch(function(e) {
                                            t.endLoading(t.sidebar)
                                        })
                                    } catch (e) {
                                        this.endLoading(this.sidebar)
                                    }
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function() {
                        return S.apply(this, arguments)
                    })
                }, {
                    key: "getAppLocation",
                    value: function() {
                        var e = this,
                            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1e4;
                        return new Promise(function(i, n) {
                            e.locationPromiseResolver && e.locationPromiseRejecter("Nuova richiesta di posizione"), e.locationPromiseResolver = i, e.locationPromiseRejecter = n;
                            var a = setTimeout(function() {
                                    e.locationPromiseRejecter && (e.locationPromiseRejecter("Timeout: posizione non ricevuta dall'app"), e.locationPromiseResolver = null, e.locationPromiseRejecter = null)
                                }, t),
                                o = e.locationPromiseResolver,
                                s = e.locationPromiseRejecter;
                            e.locationPromiseResolver = function(e) {
                                clearTimeout(a), o(e)
                            }, e.locationPromiseRejecter = function(e) {
                                clearTimeout(a), s(e)
                            }, (0, k.v)({
                                action: "REQUEST_LOCATION"
                            })
                        })
                    }
                }, {
                    key: "getClientLocation",
                    value: (b = (0, a.A)(y().mark(function e() {
                        var t, i;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (t = null, i = document.querySelector(this.SELECTORS.paccontainer), e.prev = 1, !this.isMobileApp) {
                                        e.next = 3;
                                        break
                                    }
                                    return e.next = 2, this.getAppLocation();
                                case 2:
                                    t = e.sent, e.next = 5;
                                    break;
                                case 3:
                                    return e.next = 4, this.getBrowserLocation();
                                case 4:
                                    t = e.sent;
                                case 5:
                                    t && (this.currentPosition = t, i && (i.style.display = "none")), e.next = 7;
                                    break;
                                case 6:
                                    e.prev = 6, e.catch(1), this.endLoading(this.sidebar);
                                case 7:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this, [
                            [1, 6]
                        ])
                    })), function() {
                        return b.apply(this, arguments)
                    })
                }, {
                    key: "getBrowserLocation",
                    value: (h = (0, a.A)(y().mark(function e() {
                        var t, i, n;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return t = null, i = new Promise(function(e, t) {
                                        setTimeout(function() {
                                            t("Location has timed out")
                                        }, 1e4)
                                    }), e.prev = 1, e.next = 2, Promise.race([(0, g.S)(), i]);
                                case 2:
                                    !(n = e.sent) || isNaN(n.coords.latitude) || isNaN(n.coords.longitude) || (t = {
                                        lat: n.coords.latitude,
                                        lng: n.coords.longitude
                                    }), e.next = 4;
                                    break;
                                case 3:
                                    e.prev = 3, e.catch(1), this.endLoading(this.sidebar);
                                case 4:
                                    return e.abrupt("return", t);
                                case 5:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this, [
                            [1, 3]
                        ])
                    })), function() {
                        return h.apply(this, arguments)
                    })
                }, {
                    key: "clear",
                    value: function() {
                        this.cap = null, this.address = null, this.civic = null, this.lat = null, this.long = null, this.city = null, this.administrativeAreaLevel3 = null
                    }
                }, {
                    key: "save",
                    value: function(e) {
                        var t = e.cap,
                            i = e.city,
                            n = e.address,
                            a = e.state,
                            o = e.civic,
                            s = e.lat,
                            r = e.long,
                            l = e.administrativeAreaLevel3,
                            c = e.isGeneric;
                        t && (this.cap = t, this.inputValue = this.input.value, this.input.value = this.inputValue + " ," + t, this.pushToDatalayer("choose_delivery_address", this.$areaLabel, t)), i && (this.city = i), n && (this.address = n), a && (this.stateCode = a), o && (this.civic = o), s && (this.lat = s), r && (this.long = r), l && (this.administrativeAreaLevel3 = l), this.doSearch(this.cap, this.city, this.stateCode, this.lat, this.long, this.address, this.civic, this.administrativeAreaLevel3, c), this.placeRecap.innerHTML = [this.address, this.civic, this.city, this.cap].filter(function(e) {
                            return e
                        }).join(", ")
                    }
                }, {
                    key: "doSearch",
                    value: (p = (0, a.A)(y().mark(function e(t, i, n, a, o, s, r, l, c) {
                        var u, d, p, h, b, S, g, k, L, E, A, C, T, P, w;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return this.loading(this.sidebar), e.next = 1, (0, m.Jt)(this.$options.url, {
                                        params: {
                                            cap: t,
                                            city: i,
                                            state: n,
                                            lat: a,
                                            long: o,
                                            address: s,
                                            streetNumber: r,
                                            administrativeAreaLevel3: l,
                                            isGeneric: c,
                                            timeslotEnabled: this.timeslotEnabled
                                        }
                                    });
                                case 1:
                                    d = e.sent, p = d.data, this.endLoading(this.sidebar), h = p.services, b = p.capList, S = p.cityList, g = p.selectLabel, k = p.selectPlaceholder, L = p.warningCityCap, E = p.bannerOptions, A = p.errorMessage, C = p.storeIdSelected, T = p.shippingSelectedCAP, P = !1, w = this.isMobileApp, h && h.length > 0 ? (P = h.find(function(e) {
                                        return "pickup_in_store" == e.shippingMethodId
                                    }), this.timeslotEnabled ? this.container.innerHTML = v()({
                                        services: h,
                                        bannerOptions: E,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }) : this.container.innerHTML = f()({
                                        services: h,
                                        bannerOptions: E,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }), this.pushDeliveryPartnersToDataLayer()) : b && b.length > 0 ? this.timeslotEnabled ? this.container.innerHTML = v()({
                                        capList: b,
                                        selectLabel: g,
                                        selectPlaceholder: k,
                                        warningCityCap: L,
                                        bannerOptions: E,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }) : this.container.innerHTML = f()({
                                        capList: b,
                                        selectLabel: g,
                                        selectPlaceholder: k,
                                        warningCityCap: L,
                                        bannerOptions: E,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }) : S && S.length > 0 ? this.timeslotEnabled ? this.container.innerHTML = v()({
                                        cityList: S,
                                        selectLabel: g,
                                        selectPlaceholder: k,
                                        warningCityCap: L,
                                        bannerOptions: E,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }) : this.container.innerHTML = f()({
                                        cityList: S,
                                        selectLabel: g,
                                        selectPlaceholder: k,
                                        warningCityCap: L,
                                        bannerOptions: E,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }) : this.timeslotEnabled ? this.container.innerHTML = v()({
                                        msg: A,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }) : this.container.innerHTML = f()({
                                        msg: A,
                                        isTherePickupInStore: P,
                                        isApp: w,
                                        storeIdSelected: C,
                                        shippingSelectedCAP: T
                                    }), this.btnSubmit.setAttribute("disabled", !0), this.container.classList.remove("hidden"), null === (u = document.querySelector(".method-label")) || void 0 === u || u.focus(), this.partnerTargetForApp();
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function(e, t, i, n, a, o, s, r, l) {
                        return p.apply(this, arguments)
                    })
                }, {
                    key: "getAddressPart",
                    value: function(e, t) {
                        var i = {
                                cap: ["postal_code", "postal_codes"],
                                city: ["locality", "postal_town"],
                                address: ["route"],
                                civic: ["street_number"],
                                administrativeAreaLevel1: ["county", "administrative_area_level_1"],
                                administrativeAreaLevel3: ["locality", "postal_town", "administrative_area_level_2", "administrative_area_level_3"]
                            }[t] || [],
                            n = e.find(function(e) {
                                return e.types.filter(function(e) {
                                    return -1 !== i.indexOf(e)
                                }).length > 0
                            });
                        return n ? n.short_name : null
                    }
                }, {
                    key: "getAddressGeneric",
                    value: function(e) {
                        return e[0] && (e[0].types.includes("postal_code") || e[0].types.includes("locality"))
                    }
                }, {
                    key: "getAddressGenericForWoosmap",
                    value: function(e) {
                        return e[0] && (e[0].includes("postal_code") || e[0].includes("locality"))
                    }
                }, {
                    key: "updateSelection",
                    value: (d = (0, a.A)(y().mark(function e(t) {
                        var i, n, a, o;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (t.shippingSelected, i = t.redirect, n = t.timeslotEnabledForApp, !this.addToCartPayload) {
                                        e.next = 1;
                                        break
                                    }
                                    return e.next = 1, this.addToCart();
                                case 1:
                                    this.reorder || (a = "", a = window.location.hash.indexOf("size") > -1 ? window.location.href.replace(window.location.hash, "") : window.location.href.replace("showDeliveryBar=true", ""), this.addToCartPayload && this.addToCartPayload.res && this.addToCartPayload.res.data && this.addToCartPayload.res.data.promobundle && (a = a + (window.location.search ? "&" : "?") + "promobundle=" + this.addToCartPayload.res.config.data.pid), this.isMobileApp && n && (o = "appTimeslotEnabled=true", -1 === a.indexOf("appTimeslotEnabled=true") && (a = -1 !== a.indexOf("?") ? a + "&" + o : a + "?" + o)), -1 === window.location.href.search("/cart") && (window.location.href = a)), i ? window.location.href = i : document.querySelector(".store-selection-bar") && document.querySelector(".js-store-selector-redirect") && (window.location.href = document.querySelector(".store-selection-bar").dataset.redirect), this.remove();
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function(e) {
                        return d.apply(this, arguments)
                    })
                }, {
                    key: "addToCart",
                    value: (i = (0, a.A)(y().mark(function e() {
                        var t, i, n;
                        return y().wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (!(t = this.addToCartPayload && this.addToCartPayload.res ? this.addToCartPayload.res.config : null)) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.next = 1, (0, m.Em)(t);
                                case 1:
                                    i = e.sent, (n = i.data) && n.quantityTotal && (0, k.v)({
                                        qtyInCart: n.quantityTotal
                                    }), this.reorder && this.EMIT(this.CUSTOM_MESSAGES.REORDER_EVENTS.updated, n);
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                        }, e, this)
                    })), function() {
                        return i.apply(this, arguments)
                    })
                }, {
                    key: "handleAddToCart",
                    value: function(e) {
                        this.add(), this.addToCartPayload = e
                    }
                }, {
                    key: "handleReorder",
                    value: function(e) {
                        this.add(), this.addToCartPayload = e, this.reorder = !0
                    }
                }, {
                    key: "sendAddToCartPayload",
                    value: function() {
                        this.EMIT(this.CUSTOM_MESSAGES.TIMESLOT.CART_PAYLOAD, {
                            cartPayloadData: this.addToCartPayload ? this.addToCartPayload : null,
                            reorder: this.reorder
                        })
                    }
                }, {
                    key: "resetLayer",
                    value: function() {
                        var e = this;
                        document.querySelector("body").classList.remove("js-store-selector-redirect"), setTimeout(function() {
                            e.introbox.classList.remove("hidden"), document.querySelector(".storeSelectio-sidebar").classList.add("initial-state"), e.container.classList.add("hidden"), e.input.value = "", e.suggestionsList.style.display = "none", document.body.className = document.body.className.replace(/\bopenStoresList.*?\b/g, ""), e.$options.moveInfostrip && document.querySelector(e.SELECTORS.infoStrip) && (window.scrollTo(0, 0), document.querySelector(e.SELECTORS.mainHeader).classList.remove("moveinfostrip"), document.querySelector(e.SELECTORS.mainHeader).classList.add("noanimation"), document.querySelector(e.SELECTORS.mainHeader).insertBefore(document.querySelector(e.SELECTORS.infoStrip), document.querySelector(e.SELECTORS.pushApp) ? document.querySelector(e.SELECTORS.pushApp).nextSibling : document.querySelector(e.SELECTORS.mainHeader).firstChild)), document.body.className = document.body.className.replace(/\bopenExtraLayer.*?\b/g, ""), document.body.className = document.body.className.replace(/\bopenStoresList.*?\b/g, ""), document.body.className = document.body.className.replace(/\bopenSingleStoreDeliveryList.*?\b/g, "")
                        }, 400)
                    }
                }, {
                    key: "pushDeliveryPartnersToDataLayer",
                    value: function() {
                        document.querySelector(".store-service-card.partners") && document.querySelector(".partner-link-container") && document.querySelectorAll(".partner-link").forEach(function(e) {
                            e.addEventListener("click", function() {
                                var t = e.className.replace("partner-link", "");
                                window.dataLayer.push({
                                    event: "select_service",
                                    service_name: "partner_delivery",
                                    delivery_type: t
                                })
                            })
                        })
                    }
                }, {
                    key: "pushToDatalayer",
                    value: function(e, t, i) {
                        if (window.dataLayer) {
                            var n = {
                                event: e,
                                area: t,
                                label: i,
                                s_store_zipCode: i
                            };
                            window.dataLayer.push(n)
                        }
                    }
                }]);
                var i, d, p, h, b, S, T, P
            }(h.default)
        }
    }
]);
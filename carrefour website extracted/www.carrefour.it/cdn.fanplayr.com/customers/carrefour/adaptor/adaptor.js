// Fanplayr Adaptor (carrefour) v1.0.38
// Hodor v1.6.2
(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [function(require, module, exports) {
        window.fanplayr_api = window.fanplayr_api || [];

        window.fanplayr_api.push({
            _type: 'platform.config',
            connect: {
                endpoint: window.location.origin + '/on/demandware.store/Sites-carrefour-IT-Site/it_IT/Fanplayr-Connect'
            }
        });

    }, {}],
    2: [function(require, module, exports) {
        var dlReader = module.exports = {};
        // var window = window || require("window-or-global");
        /*
        This module search element in data layer. You could get directly the element, waiting for it, 
        or remain listening to check for it (for example in data layer tracking event)

        For the test, you could pass a function that must return a boolen, that it will be called with data layer element as parameter.
        Otherwise you could pass a string, and it return if the element has this property
        */

        /**
         * Description: Continue wathcing data layer for elements that passed the test, and call the callback
         * 
         * @param {function||string}    testFnOrProp    Test executed on data layer element. If function, called with element as input, if string, check if element has the property
         * @param {function}            callback        Funciton executed with the element that passed the test as input
         * @param {number}              delay           Time between one check and another (in millisecond)
         */
        dlReader.watchDataLayerForElement = function(testFnOrProp, callback, delay) {
            delay = delay || 500;
            var index = 0;
            var interval = setInterval(function() {
                var dataLayer = window.dataLayer || [];
                while (index < dataLayer.length) {
                    if (checkCondition(testFnOrProp, dataLayer[index])) {
                        callback(dataLayer[index++], interval);
                    } else {
                        index++;
                    }
                }
            }, delay);
        };

        /** 
         * Description: Return a promise that resolve when a element in data layer pass the test, rejected when timeout
         * 
         * @param {function|string}     testFnOrProp    Test executed on data layer element. If function, called with element as input, if string, check if element has the property
         * @param {function}            callback        Callback function called when test pass
         * @param {number}              timeout         Time before the function is rejected (in millisecond)
         * @param {number}              delay           Time between one check and another (in millisecond)
         */
        dlReader.waitDataLayerElement = function(testFnOrProp, callback, timeout, delay) {
            timeout = timeout || 0;
            delay = delay || 500;
            var interval = window.setInterval(function() {
                searchElement(testFnOrProp, callback, interval);
            }, delay);
            if (timeout > 0) {
                window.setTimeout(function() {
                    window.clearInterval(interval);
                }, timeout);
            }
        };

        /**
         * Description: Get element in data layer that passed the test
         * 
         * @param {function|string}     testFnOrProp    Test executed on data layer element. If function, called with element as input, if string, check if element has the property
         * @param {function}            callback        Callback function called when test pass
         */
        dlReader.searchElement = function(testFnOrProp, callback) {
            return searchElement(testFnOrProp, callback);
        };

        /**
         * Description: Get element in data layer that passed the test function. If called by waitDataLayerElement stop interval and resolve promise with element
         * 
         * @param {function|string}     testFnOrProp     Test executed on data layer element. If function, called with element as input, if string, check if element has the property
         * @param {function}            resolve         Callback function called when test pass
         * @param {object}              interval        The window setInterval object that must be clear when the element is found  
         */
        function searchElement(testFnOrProp, callback, interval) {
            var dataLayer = window.dataLayer || [];
            for (var i = 0; i < dataLayer.length; i++) {
                if (checkCondition(testFnOrProp, dataLayer[i])) {
                    if (interval) {
                        window.clearInterval(interval);
                    }
                    if (callback) {
                        callback(dataLayer[i]);
                        return;
                    } else {
                        return dataLayer[i];
                    }
                }
            }
        }

        /**
         * Description: Get element in data layer that passed the test function. If the control is a string check if the element has the property, else call as function
         *
         * @param {function|string}    testFnOrProp    Test executed on data layer element. If function, called with element as input, if string, check if element has the property
         * @param {object}              element         Data layer element
         */
        function checkCondition(testFnOrProp, element) {
            if (typeof testFnOrProp === 'string' || testFnOrProp instanceof String) {
                return element[testFnOrProp];
            } else {
                return testFnOrProp(element);
            }
        }

    }, {}],
    3: [function(require, module, exports) {
        var log = require('__hodor/log.js');
        var platform = require('__hodor/platform.js');
        var state = require('__hodor/state.js');
        var stash = require('__hodor/stash.js');
        var _ = require('__hodor/utils.js');
        var capabilities = require('__hodor/capabilities.js');
        var $ = require('__hodor/jquery.js');
        var JSON = window.JSON;
        var dlReader = require("./dlReader");

        var user = state.user;
        var page = state.page;
        var product = page.product;
        var cart = state.cart;
        var order = state.order;

        var mainDlElement;
        stash.load();

        if (window.location.hostname === "shop.carrefour.it") {
            platform.config.storeDomain = "carrefour.stg";
        }

        monitorAddToCart();

        dlReader.waitDataLayerElement(function(element) {
            return element.page_type;
        }, function(element) {
            mainDlElement = element;

            page.type = getPageType();

            if (page.type === "order") {
                dlReader.waitDataLayerElement(function(element) {
                    return element && element.event === "product purchase";
                }, function(element) {
                    order.currency = element.ecommerce.currencyCode;
                    var actionField = _.get(element, "ecommerce.purchase.actionField");
                    order.id = order.number = actionField.id;
                    order.shipping = _.parseFloat(actionField.shipping);
                    order.gross = _.parseFloat(actionField.revenue) - order.shipping;
                    try {
                        var discountInfo = stash.get("discountInfo");
                        if (discountInfo) {
                            discountInfo = JSON.parse(discountInfo);
                            order.discount = discountInfo.discount;
                            order.discountCode = discountInfo.discountCodes.join(",");
                            order.gross += _.parseFloat(order.discount);
                        }
                        stash.del("discountInfo");
                        stash.save();
                    } catch (error) {}
                    order.cartAction = "repeat";
                    trackOrder();
                    if (stash.has("carrefourClub")) {
                        page.data.carrefourClub = 1;
                        trackPage();
                        stash.del("carrefourClub");
                        stash.save();
                    }
                });
            } else {
                page.data.toAmount = window.fpData.total;
                scrapeCart();
                if (mainDlElement.p_login_status === "logged") {
                    page.data.isLoggedIn = 1;
                    if (mainDlElement.user_lastOrderDate) {
                        page.data.orderExecuted = 1;
                    }
                    capabilities.applyToCartUrl = window.location.origin + "/checkout/begin?fp_code=%c";
                }
                if (mainDlElement.store_zipCode !== "" && mainDlElement.store_zipCode !== "undefined") {
                    page.data.storeZipCode = mainDlElement.store_zipCode;
                }
                if (page.type === "prod") {
                    dlReader.waitDataLayerElement(function(element) {
                        return element.event === "pageview";
                    }, function(element) {
                        scrapeProduct(element);
                        trackPage();
                    });
                } else if (page.type === "cart" || page.type === "checkout") {
                    dlReader.waitDataLayerElement(function(element) {
                        return element.ecommerce;
                    }, function(element) {
                        page.data.deliveryType = $(".cart-address-service").text();
                        if (page.data.deliveryType) {
                            stash.set("deliveryType", page.data.deliveryType);
                            stash.save();
                        }
                        trackPage();
                    });
                    if (page.type === "checkout") {
                        capabilities.applyToCartUrl = undefined;
                        capabilities.applyToCart = applyToCart;
                        var params = _.parseUrl(window.location.href).params;
                        if (params && params.fp_code) {
                            applyToCart({
                                code: params.fp_code
                            });
                        }
                    }
                } else {
                    if (/Marketpay-Checkout/.test(window.location.pathname)) {
                        cart.clear();
                        cart.cartAction = "repeat";
                    }
                    trackPage();
                }
            }
        });

        function getPageType() {
            if (/homepage/gi.test(mainDlElement.p_pagename)) {
                return "home";
            }
            if (mainDlElement.page_type === "TYP") {
                return "order";
            }
            if (/^\/search/.test(window.location.pathname)) {
                return "srch";
            }
            if (mainDlElement.page_type === "product_listing") {
                scrapeCategories();
                return "cat";
            }
            if (mainDlElement.page_type === "product") {
                scrapeCategories();
                return "prod";
            }
            if (mainDlElement.page_type === "checkout") {
                if (/cart/.test(window.location.pathname)) {
                    return "cart";
                } else {
                    return "checkout";
                }
            }
            return "page";
        }

        function scrapeCart() {
            cart.clear();
            var fpData = window.fpData;
            cart.gross = fpData.subTotal;
            cart.discount = fpData.discount;
            cart.discountCode = fpData.discountCode;
            cart.lineItemCount = fpData.lineItemCount;
            cart.totalQuantityNumber = fpData.numItems;
            cart.currency = fpData.currency;

            for (var i = 0; i < fpData.products.length; i++) {
                var fpProd = fpData.products[i];
                cart.products.add({
                    id: fpProd.id,
                    sku: fpProd.sku,
                    price: fpProd.price,
                    quantity: fpProd.qty,
                    name: fpProd.name,
                    url: fpProd.url,
                    image: fpProd.image
                });
            }
        }

        function monitorAddToCart() {
            dlReader.watchDataLayerForElement(function(element) {
                return element.event === "product add to cart";
            }, function(element) {
                if (!$("div[data-v-app] div.app").length && !$("div.fp-backdrop").length) {
                    cart.clear();
                    cart.cartAction = "add";
                    var dlProduct = _.get(element, "ecommerce.add.products[0]");
                    if (dlProduct) {
                        dlProduct.sku = dlProduct.id;
                        cart.products.add(dlProduct);
                        page.data.productAdded = 1;
                        trackPage();
                    }
                }
            });
        }

        function scrapeProduct(element) {
            product.id = product.sku = element.pr_id;
            product.name = element.pr_name;
            product.url = origin + window.location.pathname;
            product.price = element.pr_price;
            product.categories.add(element.product_type, element.product_type);
            page.categories.add(element.product_type, element.product_type);
            product.image = window.location.origin + $(".img-fluid").attr("src");
        }

        function scrapeCategories() {
            if (mainDlElement.page_subCategory) {
                page.categories.add(mainDlElement.page_subCategory, mainDlElement.page_subCategory);
            }
            if (mainDlElement.page_subCategory1) {
                page.categories.add(mainDlElement.page_subCategory1, mainDlElement.page_subCategory1);
            }
            if (mainDlElement.page_subCategory2) {
                page.categories.add(mainDlElement.page_subCategory2, mainDlElement.page_subCategory2);
            }
            if (mainDlElement.product_listName) {
                page.categories.add(mainDlElement.product_listName, mainDlElement.product_listName);
            }
        }

        function applyToCart(event) {
            if (event && event.code) {
                $("#couponCode").val(event.code);
                $("#submit-coupon").click();
            }
        }

        function trackPage() {
            // if (page.type === "cart") {
            //   log(JSON.string ify(state.cart, null, 2));
            // } else {
            //   log(JSON.stringify(state.page, null, 2));
            // }
            if (!page.data.deliveryType) {
                if (stash.has("deliveryType")) {
                    page.data.deliveryType = stash.get("deliveryType");
                }
            }
            platform.trackPage();
        }

        function trackOrder() {
            // log(JSON.stringify(state.order, null, 2));
            platform.trackOrder();
        }

        window.fpGtmTracking = function(action, label, trackingUrl) {
            window.dataLayer = window.dataLayer || [];

            var dlElement = {
                'event': 'gaEvent',
                'eventCategory': 'Fanplayr',
                'eventAction': action
            };

            if (label) {
                dlElement.eventLabel = label;
            }

            window.dataLayer.push(dlElement);

            if (trackingUrl) {
                window.fanplayr.trackAfn({
                    'url': trackingUrl,
                    'iframe': true
                });
            }
        };

    }, {
        "./dlReader": 2,
        "__hodor/capabilities.js": 5,
        "__hodor/jquery.js": 9,
        "__hodor/log.js": 10,
        "__hodor/platform.js": 11,
        "__hodor/stash.js": 12,
        "__hodor/state.js": 13,
        "__hodor/utils.js": 14
    }],
    4: [function(require, module, exports) {
        "use strict";

        var Emitter = require("./emitter");

        // `adaptor` is declared at the top of the IIFE during the build process.
        var adaptor = module.exports = {};

        var fanplayr = window.fanplayr = window.fanplayr || {};
        adaptor.api = window.fanplayr_api = window.fanplayr_api || [];

        Emitter.mixin(adaptor);

        var log = adaptor.log = require("./log");
        var config = adaptor.config = require("./config");
        var _ = adaptor.utils = require("./utils");

        adaptor.isInFrame = function() {
            var result = true;
            try {
                var w = window;
                result = w.top === w || w.top === w.self || !w.frameElement;
            } catch (ex) {}
            return !result;
        };

        var isCollector = config.collector;

        if (config.version) {
            adaptor.version = config.version;
        }

        var didInit;

        function init(fanplayr) {
            if (!didInit) {
                didInit = true;

                if (config.accountKey) {
                    fanplayr.platform.config.accountKey = config.accountKey;
                }

                var platformUtils = fanplayr.require("platform/utils");
                for (var key in platformUtils) {
                    _[key] = platformUtils[key];
                }

                adaptor.createStash = fanplayr.require("platform/stash").create;

                var stash = adaptor.stash = adaptor.createStash(_.merge({
                    name: "adaptor",
                    scope: "domain"
                }, config.stash || {}));

                adaptor.fanplayr = fanplayr;
                adaptor.$ = fanplayr.$;
                adaptor._ = _;

                stash.load(function() {
                    var entry = require('__project/main.js');

                    fanplayr.adaptor = _.merge({}, adaptor, entry || {});

                    adaptor.emit("ready", fanplayr, fanplayr.$, _);
                });
            }
        }

        var isInFrame = adaptor.isInFrame();
        if (!isInFrame || fanplayr.allowInFrame || config.allowInFrame) {
            // Prevent adaptor from loading multiple times.
            if (!fanplayr.adaptor || isCollector) {
                fanplayr.adaptor = adaptor;

                var initPlatform = function initPlatform() {
                    // Boot fanplayr.
                    require("./fanplayr-init")(init, adaptor.environment, config);
                };

                var bootFn = require('__project/boot.js');
                if (typeof bootFn === "function") {
                    bootFn(initPlatform);
                } else {
                    // Give implementing adaptor a chance to modify `adaptor.environment`.
                    setTimeout(initPlatform, 0);
                }
            } else {
                log("Adaptor already loaded. Skip.");
                var reloadFn = fanplayr.adaptor && fanplayr.adaptor.onReload;
                if (typeof reloadFn === "function") {
                    reloadFn();
                }
            }
        } else {
            log("Adaptor prevent loading in frame: " + (window.frameElement && window.frameElement.src));
        }

    }, {
        "./config": 6,
        "./emitter": 7,
        "./fanplayr-init": 8,
        "./log": 10,
        "./utils": 14,
        "__project/boot.js": 1,
        "__project/main.js": 3
    }],
    5: [function(require, module, exports) {
        "use strict";

        module.exports = require("./adaptor").fanplayr.platform.capabilities;

    }, {
        "./adaptor": 4
    }],
    6: [function(require, module, exports) {
        "use strict";

        // Magically replaced, do not edit.
        module.exports = {
            "type": "adaptor",
            "name": "carrefour",
            "version": "1.0.38",
            "accountKey": "4046b0b8676033e80a3a1f0a71d43030",
            "adaptorVersion": 1
        };

    }, {}],
    7: [function(require, module, exports) {
        "use strict";

        function Emitter() {
            this.events = {};

            // Last emitted values.
            this.emitCache = {};
        }

        var arraySlice = Array.prototype.slice;

        Emitter.mixin = function(obj) {
            var emitter = new Emitter();

            obj.on = function() {
                return emitter.on.apply(emitter, arraySlice.call(arguments));
            };

            obj.emit = function() {
                return emitter.emit.apply(emitter, arraySlice.call(arguments));
            };

            obj.$emitter = emitter;

            return obj;
        };

        Emitter.prototype = {
            on: function on(eventType, options, cb) {
                var self = this;

                if (typeof options === "function") {
                    var temp = cb;
                    cb = options;
                    options = temp;
                }

                if (!options) {
                    options = {};
                }

                var listeners = self.events[eventType];
                if (!listeners) {
                    listeners = self.events[eventType] = [];
                }

                var listener = {
                    options: options,
                    cb: cb
                };

                if (options.init) {
                    var cached = self.emitCache[eventType];
                    if (cached) {
                        self.invoke(listener, cached);
                    }
                }

                listeners.push(listener);
            },

            emit: function emit(eventType) {
                var self = this;

                var args = arraySlice.call(arguments, 1);
                self.emitCache[eventType] = args;

                var listeners = self.events[eventType];
                if (listeners) {
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        self.invoke(listeners[i], args);
                    }
                }
            },

            invoke: function invoke(listener, args) {
                listener.cb.apply(listener.options.context || listener.cb, args);
            }
        };

        module.exports = Emitter;

    }, {}],
    8: [function(require, module, exports) {
        "use strict";

        var log = require("./log");

        module.exports = function(initFn, environment, config) {
            (function(window, document) {
                var fanplayr = window.fanplayr;
                var fanplayrReady = "fanplayr_ready";

                /*
                  fanplayr._loadState
                    falsy: not initalized
                    1: loading
                    2: ready
                */

                if (fanplayr) {
                    var loadState = fanplayr._loadState;

                    if (loadState === 2) {
                        // Already loaded.
                        initFn(fanplayr);
                    }

                    var origFn = window[fanplayrReady];
                    window[fanplayrReady] = function(f, p) {
                        if (origFn) {
                            origFn(f, p);
                        }
                        initFn(f);
                    };

                    if (!loadState) {
                        // Fanplayr hasn't begun loading, so load it.
                        var script = document.createElement("script");
                        script.async = true;
                        script.src = "//cdn.fanplayr.com/client/" + (environment || "production") + "/loader.js";
                        var first = document.getElementsByTagName("script")[0];
                        var mode = config.injectMode || 'beforeFirstScript';
                        if (first && mode === 'beforeFirstScript') {
                            first.parentNode.insertBefore(script, first);
                        } else if (document.head && mode === 'head') {
                            document.head.appendChild(script);
                        } else if (document.body) {
                            document.body.appendChild(script);
                        }
                    }
                }
            })(window, document);
        };

    }, {
        "./log": 10
    }],
    9: [function(require, module, exports) {
        "use strict";

        module.exports = require("./adaptor").fanplayr.$;

    }, {
        "./adaptor": 4
    }],
    10: [function(require, module, exports) {
        "use strict";

        var console, logFn;

        try {
            console = window.console || window.top.console;
            logFn = console && console.log;
        } catch (e) {}

        var noop = function noop() {};

        function create(name) {
            var log = noop;
            if (logFn) {
                if (typeof logFn.bind === "function") {
                    log = logFn.bind(console, "[" + name + "]");
                } else {
                    log = function log() {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift("[" + name + "]");
                        logFn(args.join(""));
                    };
                }
            }

            log.create = create;
            log.info = log;
            log.error = log;

            return log;
        }

        module.exports = create("adaptor");

    }, {}],
    11: [function(require, module, exports) {
        "use strict";

        module.exports = require("./adaptor").fanplayr.platform;

    }, {
        "./adaptor": 4
    }],
    12: [function(require, module, exports) {
        "use strict";

        module.exports = require("./adaptor").stash;

    }, {
        "./adaptor": 4
    }],
    13: [function(require, module, exports) {
        "use strict";

        module.exports = require("./adaptor").fanplayr.platform.state;

    }, {
        "./adaptor": 4
    }],
    14: [function(require, module, exports) {
        "use strict";

        // modules.exports = require("./req")("platform/utils");

        var _ = module.exports = {};
        var log = require("./log");

        _.parseInt = function(text, defaultValue) {
            var value = _parseFloat(text, defaultValue);
            if (typeof value === "number") {
                return Math.floor(value);
            }
            return value;
        };

        /*
          Extracts the first matched float from a string.

          @param string text       The input string.
          @param * defaultValue    The default value to return if parsing fails.
          @param string chars      Special characters.

          About `chars`:
            - Must include at least two characters.
            - The first character must be the thousands separator.
            - The second character must be the decimal character.
            - Any other characters will be matched as part of the number, but stripped before converting to a float.
        */
        _.parseFloat = _parseFloat;

        function _parseFloat(text, defaultValue, chars) {
            // Get defaults.
            if (typeof defaultValue === "undefined") {
                defaultValue = _parseFloat.defaultValue;
            }
            chars = chars || _parseFloat.chars;

            text = String(text);
            var value = defaultValue;
            if (text) {
                // Find the first occurance of a group of numbers and special characters. Must match:
                // - Optional negative character `-`
                // - Optional single special character
                // - One or more digits
                // - Zero or more digits and special characters
                var pattern = new RegExp("(-?[" + chars.substr(0, 2) + "]?\\d+[0-9" + chars + "]*)");
                var match = text.match(pattern);
                if (match) {
                    // Build a regular expression of bad characters to strip out.
                    // The first char is the separator.
                    var badChars = chars.charAt(0);
                    if (chars.length > 2) {
                        // Add any others.
                        badChars += chars.substr(2);
                    }
                    pattern = new RegExp("[" + badChars + "]", "g");

                    // Strip bad characters.
                    text = match[1].replace(pattern, "");

                    // Replace the decimal character with an actual period
                    // and parse as float.
                    value = parseFloat(text.replace(chars.charAt(1), "."));

                    if (isNaN(value)) {
                        return defaultValue;
                    }
                }
            }
            return value;
        };

        _parseFloat.defaultValue = 0;
        _parseFloat.chars = ",.";

        var decodeHtmlEl;
        _.decodeHtml = function(value) {
            if (value) {
                if (!decodeHtmlEl) {
                    decodeHtmlEl = document.createElement("div");
                }
                decodeHtmlEl.innerHTML = value;
                return decodeHtmlEl.firstChild.nodeValue;
            }
            return value;
        };

        _.waitUntil = function(evaluate, intervalMs, callback) {
            if (arguments.length === 2) {
                callback = intervalMs;
                intervalMs = 500;
            }

            if (typeof evaluate === "string") {
                var evalPath = evaluate;
                evaluate = function evaluate() {
                    return eval(evalPath);
                };
            }

            var iterator = function iterator() {
                var value = evaluate();
                if (value) {
                    callback(value);
                } else {
                    setTimeout(iterator, intervalMs);
                }
            };

            iterator();
        };

    }, {
        "./log": 10
    }]
}, {}, [4]);
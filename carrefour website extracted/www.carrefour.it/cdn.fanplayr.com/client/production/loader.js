/* jshint loopfunc:true */
(function(window, document) {
    var resources = {
        "platform": "1.191.0",
        "services/offers": "1.22.0",
        "services/offers-legacy": "1.8.5",
        "services/intent": "1.4.5",
        "services/widget": "1.17.0",
        "services/runtime": "1.178.0",
        "services/debug": "1.7.1"
    };

    // These accounts are incompatible with the platform
    // and will be forced to use the old fp_smart widget.
    var legacyAccounts = {
        "f72a2b03f99f4a86a9b9804585383771": 1
    };

    // Ignore these accounts completely.
    var blacklistedAccounts = {
        "2926e141811521da8a53d0f7cc2cba65": 1,
        "dafa184bfe313e08b63f8ae6f9110479": 1,
        "59594f7fc30901a2e235afb8a9b91277": 1,
        "e03b4aac8d78a14a32fbd62330c9b98d": 1,
        "9fd0910edec0a9a6d10123c37ddea857": 1,
        "b67c42d72f581d5d24103746aa98902c": 1,
        "4cbbcf8dfb09c2398a9af6eb5825a5b3": 1,
        "490ffda63e1b37c31f335ff5361151db": 1
    };
    var blacklistedDomains = [
        "dekbed-discounter.nl",
        "efarma.com",
        "efarma.it"
    ];
    var environment = 'production';
    var allowedLoaderEnvRE = /^(staging|development)$/;

    function log() {
        try {
            window.console.log.apply(window.console, arguments);
        } catch (ex) {}
    }

    if (environment === 'production') {
        try {
            var loaderEnv;
            var urlMatch = /\bfp_loader_env=([^&]+)\b/.exec(window.location.href);
            if (urlMatch) {
                loaderEnv = urlMatch[1];
            } else {
                loaderEnv = localStorage.getItem('fp_loader_env');
            }
            if (allowedLoaderEnvRE.test(loaderEnv) && loaderEnv !== environment) {
                log('FP: Use ' + loaderEnv + ' loader');
                var script = document.createElement('script');
                script.src = 'https://cdn.fanplayr.com/client/' + loaderEnv + '/loader.js';
                document.body.appendChild(script);
                return;
            }
        } catch (ex) {}
    }

    var fanplayr = window.fanplayr = (window.fanplayr || {}),
        loader = fanplayr.loader = (fanplayr.loader || {}),
        params = loader.params = {};

    var accountKey = getAccountKey();

    var _loadState = "_loadState";

    if (window.top !== window && !allowedInFrame()) {
        log('Fanplayr prevent in frame: ' + (window.frameElement && window.frameElement.src));
        return;
    }

    // Stop immediately if the platform is already loaded/loading
    // OR, the current account key is blacklisted.
    if (fanplayr[_loadState] || isBlacklisted() || isBot()) {
        return;
    }

    // Mark that the platform is loading.
    fanplayr[_loadState] = 1;
    fanplayr._loaderVersion = '1.406';

    if (accountKey && legacyAccounts[accountKey]) {
        loadScript("//d1q7pknmpq2wkm.cloudfront.net/js/my.fanplayr.com/fp_smart.embed.js");
        return;
    }

    var loaderPattern = /(?:d38nbbai6u794i|fanplayr|fpc).*?loader\.js(.*)/i,
        scripts = document.getElementsByTagName("script");

    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (loaderPattern.test(src)) {
            src.replace(/([^?&=]+)=([^?&=]+)/g, function(line, key, value) {
                params[key] = decodeURIComponent(value);
                if (/^cdn|debug|adaptor|cache$/.test(key)) {
                    loader[key] = params[key];
                }
            });
            break;
        }
    }

    var DEFAULT_CDN = "//cdn.fanplayr.com/client/production";

    var fileSuffix = ".min.js";
    if (loader.min === false) {
        fileSuffix = ".js";
    }

    if (typeof loader.cache !== "undefined" && !loader.cache) {
        fileSuffix += "?_=" + (+new Date());
    }

    /**
     * @typedef {object} DebugConfig
     * @property {Record<string, string | undefined>} loaderResources
     */

    /**
     * Attempts to lookup any configured debug resources for testing code changes
     * without pushing to production.
     * @param {string} name Resource name e.g. "services/runtime"
     * @returns The full URI to the resource or undefined if
     * there is no debug version configured.
     */
    function getDebugResourceUri(name) {
        try {
            var json = localStorage.getItem('fp_loader_debug');
            if (!json) {
                return;
            }
            /** @type {DebugConfig} */
            var config = JSON.parse(json); // jshint ignore:line
            return config.loaderResources[name];
        } catch (ex) {}
    }

    loader.uri = function(name) {
        var cdn = loader.cdn = loader.cdn || params.cdn || DEFAULT_CDN,
            res = resources[name],
            path = name.split("/").pop() + fileSuffix;

        var debugUri = getDebugResourceUri(name);
        if (debugUri) {
            log('[FP Loader] Remap "' + name + '" to "' + debugUri + '"');
            return debugUri;
        }

        if (/\.js$/.test(name)) {
            return cdn + "/" + name;
        }

        if (loader.debug) {
            return cdn + "/" + name + "/" + path;
        }

        if (res) {
            return cdn + "/" + name + "/releases/" + res + "/" + path;
        }
    };

    loader.base = function(resource) {
        var path = loader.uri(resource).split("/");
        path.pop();
        return path.join("/");
    };

    loadScript(loader.uri("platform"));

    function getAccountKey() {
        // Search in standard embed data.
        var embedData = fanplayr._i && fanplayr._i.length && fanplayr._i[0];
        var accountKey = embedData && (embedData.accountKey || embedData.ak);
        if (!accountKey) {
            // Search on standard custom adaptor before it finishes loading.
            accountKey = fanplayr.adaptor && fanplayr.adaptor.config && fanplayr.adaptor.config.accountKey;
        }
        if (!accountKey) {
            // Search on very old zanox implementation.
            accountKey = fanplayr.zanox && fanplayr.zanox.config && fanplayr.zanox.config.accountKey;
        }
        if (!accountKey && fanplayr.custom) {
            accountKey = fanplayr.custom.accountKey;
        }
        return accountKey || null;
    }

    function allowedInFrame() {
        var config = fanplayr.adaptor && fanplayr.adaptor.config || {};
        return fanplayr.allowInFrame || config.allowInFrame;
    }

    function loadScript(url) {
        var script = document.createElement("script");
        script.async = true;
        script.src = url;

        if (script.src) {
            var entry = document.getElementsByTagName("script")[0];
            entry.parentNode.insertBefore(script, entry);
        }
    }

    function isBlacklisted() {
        if (blacklistedAccounts[accountKey]) {
            return true;
        }
        var hostname = window.location.hostname;
        for (var i = 0, len = blacklistedDomains.length; i < len; i++) {
            if (hostname.indexOf(blacklistedDomains[i]) !== -1) {
                return true;
            }
        }
    }

    function isBot() {
        return /(GoogleBot|Catchpoint|KTXN|KHTE|GomezAgent|Evidon|Baiduspider|YandexBot|YandexMobileBot)/i
            .test(window.navigator && window.navigator.userAgent);
    }

}(window, document));
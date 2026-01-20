(function() {
    /** vim: et:ts=4:sw=4:sts=4
     * @license RequireJS 2.1.15 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
     * Available via the MIT or new BSD license.
     * see: http://github.com/jrburke/requirejs for details
     */
    //Not using strict: uneven strict support in browsers, #392, and causes
    //problems with requirejs.exec()/transpiler plugins that may not be strict.
    /*jslint regexp: true, nomen: true, sloppy: true */
    /*global window, navigator, document, importScripts, setTimeout, opera */

    var require = {
        context: "fanplayr",
        skipDataMain: true
    };

    var requirejs, require, define;
    (function(global) {
        var req, s, head, baseElement, dataMain, src,
            interactiveScript, currentlyAddingScript, mainScript, subPath,
            version = '2.1.15',
            commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
            cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
            jsSuffixRegExp = /\.js$/,
            currDirRegExp = /^\.\//,
            op = Object.prototype,
            ostring = op.toString,
            hasOwn = op.hasOwnProperty,
            ap = Array.prototype,
            apsp = ap.splice,
            isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
            isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
            //PS3 indicates loaded and complete, but need to wait for complete
            //specifically. Sequence is 'loading', 'loaded', execution,
            // then 'complete'. The UA check is unfortunate, but not sure how
            //to feature test w/o causing perf issues.
            readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
            /^complete$/ : /^(complete|loaded)$/,
            defContextName = '_',
            //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
            isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
            contexts = {},
            cfg = {},
            globalDefQueue = [],
            useInteractive = false;

        function isFunction(it) {
            return ostring.call(it) === '[object Function]';
        }

        function isArray(it) {
            // return ostring.call(it) === '[object Array]';

            // 2016-04-14 Hack to fix weird case where Prototype.js + Babel
            // seem to cause all arrays to appear as an Array Iterator instance.
            // Needed for customer http://www.franklinandmarshall.com.
            var type = ostring.call(it);
            return type === '[object Array]' || type === '[object Array Iterator]';
        }

        /**
         * Helper function for iterating over an array. If the func returns
         * a true value, it will break out of the loop.
         */
        function each(ary, func) {
            if (ary) {
                var i;
                for (i = 0; i < ary.length; i += 1) {
                    if (ary[i] && func(ary[i], i, ary)) {
                        break;
                    }
                }
            }
        }

        /**
         * Helper function for iterating over an array backwards. If the func
         * returns a true value, it will break out of the loop.
         */
        function eachReverse(ary, func) {
            if (ary) {
                var i;
                for (i = ary.length - 1; i > -1; i -= 1) {
                    if (ary[i] && func(ary[i], i, ary)) {
                        break;
                    }
                }
            }
        }

        function hasProp(obj, prop) {
            return hasOwn.call(obj, prop);
        }

        function getOwn(obj, prop) {
            return hasProp(obj, prop) && obj[prop];
        }

        /**
         * Cycles over properties in an object and calls a function for each
         * property value. If the function returns a truthy value, then the
         * iteration is stopped.
         */
        function eachProp(obj, func) {
            var prop;
            for (prop in obj) {
                if (hasProp(obj, prop)) {
                    if (func(obj[prop], prop)) {
                        break;
                    }
                }
            }
        }

        /**
         * Simple function to mix in properties from source into target,
         * but only if target does not already have a property of the same name.
         */
        function mixin(target, source, force, deepStringMixin) {
            if (source) {
                eachProp(source, function(value, prop) {
                    if (force || !hasProp(target, prop)) {
                        if (deepStringMixin && typeof value === 'object' && value &&
                            !isArray(value) && !isFunction(value) &&
                            !(value instanceof RegExp)) {

                            if (!target[prop]) {
                                target[prop] = {};
                            }
                            mixin(target[prop], value, force, deepStringMixin);
                        } else {
                            target[prop] = value;
                        }
                    }
                });
            }
            return target;
        }

        //Similar to Function.prototype.bind, but the 'this' object is specified
        //first, since it is easier to read/figure out what 'this' will be.
        function bind(obj, fn) {
            return function() {
                return fn.apply(obj, arguments);
            };
        }

        function scripts() {
            return document.getElementsByTagName('script');
        }

        function defaultOnError(err) {
            throw err;
        }

        //Allow getting a global that is expressed in
        //dot notation, like 'a.b.c'.
        function getGlobal(value) {
            if (!value) {
                return value;
            }
            var g = global;
            each(value.split('.'), function(part) {
                g = g[part];
            });
            return g;
        }

        /**
         * Constructs an error with a pointer to an URL with more information.
         * @param {String} id the error ID that maps to an ID on a web page.
         * @param {String} message human readable error.
         * @param {Error} [err] the original error, if there is one.
         *
         * @returns {Error}
         */
        function makeError(id, msg, err, requireModules) {
            var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
            e.requireType = id;
            e.requireModules = requireModules;
            if (err) {
                e.originalError = err;
            }
            return e;
        }

        if (typeof define !== 'undefined') {
            //If a define is already in play via another AMD loader,
            //do not overwrite.
            return;
        }

        if (typeof requirejs !== 'undefined') {
            if (isFunction(requirejs)) {
                //Do not overwrite an existing requirejs instance.
                return;
            }
            cfg = requirejs;
            requirejs = undefined;
        }

        //Allow for a require config object
        if (typeof require !== 'undefined' && !isFunction(require)) {
            //assume it is a config object.
            cfg = require;
            require = undefined;
        }

        function newContext(contextName) {
            var inCheckLoaded, Module, context, handlers,
                checkLoadedTimeoutId,
                config = {
                    //Defaults. Do not set a default for map
                    //config to speed up normalize(), which
                    //will run faster if there is no default.
                    waitSeconds: 7,
                    baseUrl: './',
                    paths: {},
                    bundles: {},
                    pkgs: {},
                    shim: {},
                    config: {}
                },
                registry = {},
                //registry of just enabled modules, to speed
                //cycle breaking code when lots of modules
                //are registered, but not activated.
                enabledRegistry = {},
                undefEvents = {},
                defQueue = [],
                defined = {},
                urlFetched = {},
                bundlesMap = {},
                requireCounter = 1,
                unnormalizedCounter = 1;

            /**
             * Trims the . and .. from an array of path segments.
             * It will keep a leading path segment if a .. will become
             * the first path segment, to help with module name lookups,
             * which act like paths, but can be remapped. But the end result,
             * all paths that use this function should look normalized.
             * NOTE: this method MODIFIES the input array.
             * @param {Array} ary the array of path segments.
             */
            function trimDots(ary) {
                var i, part;
                for (i = 0; i < ary.length; i++) {
                    part = ary[i];
                    if (part === '.') {
                        ary.splice(i, 1);
                        i -= 1;
                    } else if (part === '..') {
                        // If at the start, or previous value is still ..,
                        // keep them so that when converted to a path it may
                        // still work when converted to a path, even though
                        // as an ID it is less than ideal. In larger point
                        // releases, may be better to just kick out an error.
                        if (i === 0 || (i == 1 && ary[2] === '..') || ary[i - 1] === '..') {
                            continue;
                        } else if (i > 0) {
                            ary.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
            }

            /**
             * Given a relative module name, like ./something, normalize it to
             * a real name that can be mapped to a path.
             * @param {String} name the relative name
             * @param {String} baseName a real name that the name arg is relative
             * to.
             * @param {Boolean} applyMap apply the map config to the value. Should
             * only be done if this normalization is for a dependency ID.
             * @returns {String} normalized name
             */
            function normalize(name, baseName, applyMap) {
                var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                    foundMap, foundI, foundStarMap, starI, normalizedBaseParts,
                    baseParts = (baseName && baseName.split('/')),
                    map = config.map,
                    starMap = map && map['*'];

                //Adjust any relative paths.
                if (name) {
                    name = name.split('/');
                    lastIndex = name.length - 1;

                    // If wanting node ID compatibility, strip .js from end
                    // of IDs. Have to do this here, and not in nameToUrl
                    // because node allows either .js or non .js to map
                    // to same file.
                    if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                        name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                    }

                    // Starts with a '.' so need the baseName
                    if (name[0].charAt(0) === '.' && baseParts) {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                        name = normalizedBaseParts.concat(name);
                    }

                    trimDots(name);
                    name = name.join('/');
                }

                //Apply map config if available.
                if (applyMap && map && (baseParts || starMap)) {
                    nameParts = name.split('/');

                    outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                        nameSegment = nameParts.slice(0, i).join('/');

                        if (baseParts) {
                            //Find the longest baseName segment match in the config.
                            //So, do joins on the biggest to smallest lengths of baseParts.
                            for (j = baseParts.length; j > 0; j -= 1) {
                                mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                                //baseName segment has config, find if it has one for
                                //this name.
                                if (mapValue) {
                                    mapValue = getOwn(mapValue, nameSegment);
                                    if (mapValue) {
                                        //Match, update name to the new value.
                                        foundMap = mapValue;
                                        foundI = i;
                                        break outerLoop;
                                    }
                                }
                            }
                        }

                        //Check for a star map match, but just hold on to it,
                        //if there is a shorter segment match later in a matching
                        //config, then favor over this star map.
                        if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                            foundStarMap = getOwn(starMap, nameSegment);
                            starI = i;
                        }
                    }

                    if (!foundMap && foundStarMap) {
                        foundMap = foundStarMap;
                        foundI = starI;
                    }

                    if (foundMap) {
                        nameParts.splice(0, foundI, foundMap);
                        name = nameParts.join('/');
                    }
                }

                // If the name points to a package's name, use
                // the package main instead.
                pkgMain = getOwn(config.pkgs, name);

                return pkgMain ? pkgMain : name;
            }

            function removeScript(name) {
                if (isBrowser) {
                    each(scripts(), function(scriptNode) {
                        if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                            scriptNode.parentNode.removeChild(scriptNode);
                            return true;
                        }
                    });
                }
            }

            function hasPathFallback(id) {
                var pathConfig = getOwn(config.paths, id);
                if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                    //Pop off the first array value, since it failed, and
                    //retry
                    pathConfig.shift();
                    context.require.undef(id);

                    //Custom require that does not do map translation, since
                    //ID is "absolute", already mapped/resolved.
                    context.makeRequire(null, {
                        skipMap: true
                    })([id]);

                    return true;
                }
            }

            //Turns a plugin!resource to [plugin, resource]
            //with the plugin being undefined if the name
            //did not have a plugin prefix.
            function splitPrefix(name) {
                var prefix,
                    index = name ? name.indexOf('!') : -1;
                if (index > -1) {
                    prefix = name.substring(0, index);
                    name = name.substring(index + 1, name.length);
                }
                return [prefix, name];
            }

            /**
             * Creates a module mapping that includes plugin prefix, module
             * name, and path. If parentModuleMap is provided it will
             * also normalize the name via require.normalize()
             *
             * @param {String} name the module name
             * @param {String} [parentModuleMap] parent module map
             * for the module name, used to resolve relative names.
             * @param {Boolean} isNormalized: is the ID already normalized.
             * This is true if this call is done for a define() module ID.
             * @param {Boolean} applyMap: apply the map config to the ID.
             * Should only be true if this map is for a dependency.
             *
             * @returns {Object}
             */
            function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
                var url, pluginModule, suffix, nameParts,
                    prefix = null,
                    parentName = parentModuleMap ? parentModuleMap.name : null,
                    originalName = name,
                    isDefine = true,
                    normalizedName = '';

                //If no name, then it means it is a require call, generate an
                //internal name.
                if (!name) {
                    isDefine = false;
                    name = '_@r' + (requireCounter += 1);
                }

                nameParts = splitPrefix(name);
                prefix = nameParts[0];
                name = nameParts[1];

                if (prefix) {
                    prefix = normalize(prefix, parentName, applyMap);
                    pluginModule = getOwn(defined, prefix);
                }

                //Account for relative paths if there is a base name.
                if (name) {
                    if (prefix) {
                        if (pluginModule && pluginModule.normalize) {
                            //Plugin is loaded, use its normalize method.
                            normalizedName = pluginModule.normalize(name, function(name) {
                                return normalize(name, parentName, applyMap);
                            });
                        } else {
                            // If nested plugin references, then do not try to
                            // normalize, as it will not normalize correctly. This
                            // places a restriction on resourceIds, and the longer
                            // term solution is not to normalize until plugins are
                            // loaded and all normalizations to allow for async
                            // loading of a loader plugin. But for now, fixes the
                            // common uses. Details in #1131
                            normalizedName = name.indexOf('!') === -1 ?
                                normalize(name, parentName, applyMap) :
                                name;
                        }
                    } else {
                        //A regular module.
                        normalizedName = normalize(name, parentName, applyMap);

                        //Normalized name may be a plugin ID due to map config
                        //application in normalize. The map config values must
                        //already be normalized, so do not need to redo that part.
                        nameParts = splitPrefix(normalizedName);
                        prefix = nameParts[0];
                        normalizedName = nameParts[1];
                        isNormalized = true;

                        url = context.nameToUrl(normalizedName);
                    }
                }

                //If the id is a plugin id that cannot be determined if it needs
                //normalization, stamp it with a unique ID so two matching relative
                //ids that may conflict can be separate.
                suffix = prefix && !pluginModule && !isNormalized ?
                    '_unnormalized' + (unnormalizedCounter += 1) :
                    '';

                return {
                    prefix: prefix,
                    name: normalizedName,
                    parentMap: parentModuleMap,
                    unnormalized: !!suffix,
                    url: url,
                    originalName: originalName,
                    isDefine: isDefine,
                    id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
                };
            }

            function getModule(depMap) {
                var id = depMap.id,
                    mod = getOwn(registry, id);

                if (!mod) {
                    mod = registry[id] = new context.Module(depMap);
                }

                return mod;
            }

            function on(depMap, name, fn) {
                var id = depMap.id,
                    mod = getOwn(registry, id);

                if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                    if (name === 'defined') {
                        fn(defined[id]);
                    }
                } else {
                    mod = getModule(depMap);
                    if (mod.error && name === 'error') {
                        fn(mod.error);
                    } else {
                        mod.on(name, fn);
                    }
                }
            }

            function onError(err, errback) {
                var ids = err.requireModules,
                    notified = false;

                if (errback) {
                    errback(err);
                } else {
                    each(ids, function(id) {
                        var mod = getOwn(registry, id);
                        if (mod) {
                            //Set error on module, so it skips timeout checks.
                            mod.error = err;
                            if (mod.events.error) {
                                notified = true;
                                mod.emit('error', err);
                            }
                        }
                    });

                    if (!notified) {
                        req.onError(err);
                    }
                }
            }

            /**
             * Internal method to transfer globalQueue items to this context's
             * defQueue.
             */
            function takeGlobalQueue() {
                //Push all the globalDefQueue items into the context's defQueue
                if (globalDefQueue.length) {
                    //Array splice in the values since the context code has a
                    //local var ref to defQueue, so cannot just reassign the one
                    //on context.
                    apsp.apply(defQueue, [defQueue.length, 0].concat(globalDefQueue));
                    globalDefQueue = [];
                }
            }

            handlers = {
                'require': function(mod) {
                    if (mod.require) {
                        return mod.require;
                    } else {
                        return (mod.require = context.makeRequire(mod.map));
                    }
                },
                'exports': function(mod) {
                    mod.usingExports = true;
                    if (mod.map.isDefine) {
                        if (mod.exports) {
                            return (defined[mod.map.id] = mod.exports);
                        } else {
                            return (mod.exports = defined[mod.map.id] = {});
                        }
                    }
                },
                'module': function(mod) {
                    if (mod.module) {
                        return mod.module;
                    } else {
                        return (mod.module = {
                            id: mod.map.id,
                            uri: mod.map.url,
                            config: function() {
                                return getOwn(config.config, mod.map.id) || {};
                            },
                            exports: mod.exports || (mod.exports = {})
                        });
                    }
                }
            };

            function cleanRegistry(id) {
                //Clean up machinery used for waiting modules.
                delete registry[id];
                delete enabledRegistry[id];
            }

            function breakCycle(mod, traced, processed) {
                var id = mod.map.id;

                if (mod.error) {
                    mod.emit('error', mod.error);
                } else {
                    traced[id] = true;
                    each(mod.depMaps, function(depMap, i) {
                        var depId = depMap.id,
                            dep = getOwn(registry, depId);

                        //Only force things that have not completed
                        //being defined, so still in the registry,
                        //and only if it has not been matched up
                        //in the module already.
                        if (dep && !mod.depMatched[i] && !processed[depId]) {
                            if (getOwn(traced, depId)) {
                                mod.defineDep(i, defined[depId]);
                                mod.check(); //pass false?
                            } else {
                                breakCycle(dep, traced, processed);
                            }
                        }
                    });
                    processed[id] = true;
                }
            }

            function checkLoaded() {
                var err, usingPathFallback,
                    waitInterval = config.waitSeconds * 1000,
                    //It is possible to disable the wait interval by using waitSeconds of 0.
                    expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                    noLoads = [],
                    reqCalls = [],
                    stillLoading = false,
                    needCycleCheck = true;

                //Do not bother if this call was a result of a cycle break.
                if (inCheckLoaded) {
                    return;
                }

                inCheckLoaded = true;

                //Figure out the state of all the modules.
                eachProp(enabledRegistry, function(mod) {
                    var map = mod.map,
                        modId = map.id;

                    //Skip things that are not enabled or in error state.
                    if (!mod.enabled) {
                        return;
                    }

                    if (!map.isDefine) {
                        reqCalls.push(mod);
                    }

                    if (!mod.error) {
                        //If the module should be executed, and it has not
                        //been inited and time is up, remember it.
                        if (!mod.inited && expired) {
                            if (hasPathFallback(modId)) {
                                usingPathFallback = true;
                                stillLoading = true;
                            } else {
                                noLoads.push(modId);
                                removeScript(modId);
                            }
                        } else if (!mod.inited && mod.fetched && map.isDefine) {
                            stillLoading = true;
                            if (!map.prefix) {
                                //No reason to keep looking for unfinished
                                //loading. If the only stillLoading is a
                                //plugin resource though, keep going,
                                //because it may be that a plugin resource
                                //is waiting on a non-plugin cycle.
                                return (needCycleCheck = false);
                            }
                        }
                    }
                });

                if (expired && noLoads.length) {
                    //If wait time expired, throw error of unloaded modules.
                    err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                    err.contextName = context.contextName;
                    return onError(err);
                }

                //Not expired, check for a cycle.
                if (needCycleCheck) {
                    each(reqCalls, function(mod) {
                        breakCycle(mod, {}, {});
                    });
                }

                //If still waiting on loads, and the waiting load is something
                //other than a plugin resource, or there are still outstanding
                //scripts, then just try back later.
                if ((!expired || usingPathFallback) && stillLoading) {
                    //Something is still waiting to load. Wait for it, but only
                    //if a timeout is not already in effect.
                    if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                        checkLoadedTimeoutId = setTimeout(function() {
                            checkLoadedTimeoutId = 0;
                            checkLoaded();
                        }, 50);
                    }
                }

                inCheckLoaded = false;
            }

            Module = function(map) {
                this.events = getOwn(undefEvents, map.id) || {};
                this.map = map;
                this.shim = getOwn(config.shim, map.id);
                this.depExports = [];
                this.depMaps = [];
                this.depMatched = [];
                this.pluginMaps = {};
                this.depCount = 0;

                /* this.exports this.factory
                   this.depMaps = [],
                   this.enabled, this.fetched
                */
            };

            Module.prototype = {
                init: function(depMaps, factory, errback, options) {
                    options = options || {};

                    //Do not do more inits if already done. Can happen if there
                    //are multiple define calls for the same module. That is not
                    //a normal, common case, but it is also not unexpected.
                    if (this.inited) {
                        return;
                    }

                    this.factory = factory;

                    if (errback) {
                        //Register for errors on this module.
                        this.on('error', errback);
                    } else if (this.events.error) {
                        //If no errback already, but there are error listeners
                        //on this module, set up an errback to pass to the deps.
                        errback = bind(this, function(err) {
                            this.emit('error', err);
                        });
                    }

                    //Do a copy of the dependency array, so that
                    //source inputs are not modified. For example
                    //"shim" deps are passed in here directly, and
                    //doing a direct modification of the depMaps array
                    //would affect that config.
                    this.depMaps = depMaps && depMaps.slice(0);

                    this.errback = errback;

                    //Indicate this module has be initialized
                    this.inited = true;

                    this.ignore = options.ignore;

                    //Could have option to init this module in enabled mode,
                    //or could have been previously marked as enabled. However,
                    //the dependencies are not known until init is called. So
                    //if enabled previously, now trigger dependencies as enabled.
                    if (options.enabled || this.enabled) {
                        //Enable this module and dependencies.
                        //Will call this.check()
                        this.enable();
                    } else {
                        this.check();
                    }
                },

                defineDep: function(i, depExports) {
                    //Because of cycles, defined callback for a given
                    //export can be called more than once.
                    if (!this.depMatched[i]) {
                        this.depMatched[i] = true;
                        this.depCount -= 1;
                        this.depExports[i] = depExports;
                    }
                },

                fetch: function() {
                    if (this.fetched) {
                        return;
                    }
                    this.fetched = true;

                    context.startTime = (new Date()).getTime();

                    var map = this.map;

                    //If the manager is for a plugin managed resource,
                    //ask the plugin to load it now.
                    if (this.shim) {
                        context.makeRequire(this.map, {
                            enableBuildCallback: true
                        })(this.shim.deps || [], bind(this, function() {
                            return map.prefix ? this.callPlugin() : this.load();
                        }));
                    } else {
                        //Regular dependency.
                        return map.prefix ? this.callPlugin() : this.load();
                    }
                },

                load: function() {
                    var url = this.map.url;

                    //Regular dependency.
                    if (!urlFetched[url]) {
                        urlFetched[url] = true;
                        context.load(this.map.id, url);
                    }
                },

                /**
                 * Checks if the module is ready to define itself, and if so,
                 * define it.
                 */
                check: function() {
                    if (!this.enabled || this.enabling) {
                        return;
                    }

                    var err, cjsModule,
                        id = this.map.id,
                        depExports = this.depExports,
                        exports = this.exports,
                        factory = this.factory;

                    if (!this.inited) {
                        this.fetch();
                    } else if (this.error) {
                        this.emit('error', this.error);
                    } else if (!this.defining) {
                        //The factory could trigger another require call
                        //that would result in checking this module to
                        //define itself again. If already in the process
                        //of doing that, skip this work.
                        this.defining = true;

                        if (this.depCount < 1 && !this.defined) {
                            if (isFunction(factory)) {
                                //If there is an error listener, favor passing
                                //to that instead of throwing an error. However,
                                //only do it for define()'d  modules. require
                                //errbacks should not be called for failures in
                                //their callbacks (#699). However if a global
                                //onError is set, use that.
                                if ((this.events.error && this.map.isDefine) ||
                                    req.onError !== defaultOnError) {
                                    try {
                                        exports = context.execCb(id, factory, depExports, exports);
                                    } catch (e) {
                                        err = e;
                                    }
                                } else {
                                    exports = context.execCb(id, factory, depExports, exports);
                                }

                                // Favor return value over exports. If node/cjs in play,
                                // then will not have a return value anyway. Favor
                                // module.exports assignment over exports object.
                                if (this.map.isDefine && exports === undefined) {
                                    cjsModule = this.module;
                                    if (cjsModule) {
                                        exports = cjsModule.exports;
                                    } else if (this.usingExports) {
                                        //exports already set the defined value.
                                        exports = this.exports;
                                    }
                                }

                                if (err) {
                                    err.requireMap = this.map;
                                    err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                    err.requireType = this.map.isDefine ? 'define' : 'require';
                                    return onError((this.error = err));
                                }

                            } else {
                                //Just a literal value
                                exports = factory;
                            }

                            this.exports = exports;

                            if (this.map.isDefine && !this.ignore) {
                                defined[id] = exports;

                                if (req.onResourceLoad) {
                                    req.onResourceLoad(context, this.map, this.depMaps);
                                }
                            }

                            //Clean up
                            cleanRegistry(id);

                            this.defined = true;
                        }

                        //Finished the define stage. Allow calling check again
                        //to allow define notifications below in the case of a
                        //cycle.
                        this.defining = false;

                        if (this.defined && !this.defineEmitted) {
                            this.defineEmitted = true;
                            this.emit('defined', this.exports);
                            this.defineEmitComplete = true;
                        }

                    }
                },

                callPlugin: function() {
                    var map = this.map,
                        id = map.id,
                        //Map already normalized the prefix.
                        pluginMap = makeModuleMap(map.prefix);

                    //Mark this as a dependency for this plugin, so it
                    //can be traced for cycles.
                    this.depMaps.push(pluginMap);

                    on(pluginMap, 'defined', bind(this, function(plugin) {
                        var load, normalizedMap, normalizedMod,
                            bundleId = getOwn(bundlesMap, this.map.id),
                            name = this.map.name,
                            parentName = this.map.parentMap ? this.map.parentMap.name : null,
                            localRequire = context.makeRequire(map.parentMap, {
                                enableBuildCallback: true
                            });

                        //If current map is not normalized, wait for that
                        //normalized name to load instead of continuing.
                        if (this.map.unnormalized) {
                            //Normalize the ID if the plugin allows it.
                            if (plugin.normalize) {
                                name = plugin.normalize(name, function(name) {
                                    return normalize(name, parentName, true);
                                }) || '';
                            }

                            //prefix and name should already be normalized, no need
                            //for applying map config again either.
                            normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                this.map.parentMap);
                            on(normalizedMap,
                                'defined', bind(this, function(value) {
                                    this.init([], function() {
                                        return value;
                                    }, null, {
                                        enabled: true,
                                        ignore: true
                                    });
                                }));

                            normalizedMod = getOwn(registry, normalizedMap.id);
                            if (normalizedMod) {
                                //Mark this as a dependency for this plugin, so it
                                //can be traced for cycles.
                                this.depMaps.push(normalizedMap);

                                if (this.events.error) {
                                    normalizedMod.on('error', bind(this, function(err) {
                                        this.emit('error', err);
                                    }));
                                }
                                normalizedMod.enable();
                            }

                            return;
                        }

                        //If a paths config, then just load that file instead to
                        //resolve the plugin, as it is built into that paths layer.
                        if (bundleId) {
                            this.map.url = context.nameToUrl(bundleId);
                            this.load();
                            return;
                        }

                        load = bind(this, function(value) {
                            this.init([], function() {
                                return value;
                            }, null, {
                                enabled: true
                            });
                        });

                        load.error = bind(this, function(err) {
                            this.inited = true;
                            this.error = err;
                            err.requireModules = [id];

                            //Remove temp unnormalized modules for this module,
                            //since they will never be resolved otherwise now.
                            eachProp(registry, function(mod) {
                                if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                    cleanRegistry(mod.map.id);
                                }
                            });

                            onError(err);
                        });

                        //Allow plugins to load other code without having to know the
                        //context or how to 'complete' the load.
                        load.fromText = bind(this, function(text, textAlt) {
                            /*jslint evil: true */
                            var moduleName = map.name,
                                moduleMap = makeModuleMap(moduleName),
                                hasInteractive = useInteractive;

                            //As of 2.1.0, support just passing the text, to reinforce
                            //fromText only being called once per resource. Still
                            //support old style of passing moduleName but discard
                            //that moduleName in favor of the internal ref.
                            if (textAlt) {
                                text = textAlt;
                            }

                            //Turn off interactive script matching for IE for any define
                            //calls in the text, then turn it back on at the end.
                            if (hasInteractive) {
                                useInteractive = false;
                            }

                            //Prime the system by creating a module instance for
                            //it.
                            getModule(moduleMap);

                            //Transfer any config to this other module.
                            if (hasProp(config.config, id)) {
                                config.config[moduleName] = config.config[id];
                            }

                            try {
                                req.exec(text);
                            } catch (e) {
                                return onError(makeError('fromtexteval',
                                    'fromText eval for ' + id +
                                    ' failed: ' + e,
                                    e, [id]));
                            }

                            if (hasInteractive) {
                                useInteractive = true;
                            }

                            //Mark this as a dependency for the plugin
                            //resource
                            this.depMaps.push(moduleMap);

                            //Support anonymous modules.
                            context.completeLoad(moduleName);

                            //Bind the value of that module to the value for this
                            //resource ID.
                            localRequire([moduleName], load);
                        });

                        //Use parentName here since the plugin's name is not reliable,
                        //could be some weird string with no path that actually wants to
                        //reference the parentName's path.
                        plugin.load(map.name, localRequire, load, config);
                    }));

                    context.enable(pluginMap, this);
                    this.pluginMaps[pluginMap.id] = pluginMap;
                },

                enable: function() {
                    enabledRegistry[this.map.id] = this;
                    this.enabled = true;

                    //Set flag mentioning that the module is enabling,
                    //so that immediate calls to the defined callbacks
                    //for dependencies do not trigger inadvertent load
                    //with the depCount still being zero.
                    this.enabling = true;

                    //Enable each dependency
                    each(this.depMaps, bind(this, function(depMap, i) {
                        var id, mod, handler;

                        if (typeof depMap === 'string') {
                            //Dependency needs to be converted to a depMap
                            //and wired up to this module.
                            depMap = makeModuleMap(depMap,
                                (this.map.isDefine ? this.map : this.map.parentMap),
                                false, !this.skipMap);
                            this.depMaps[i] = depMap;

                            handler = getOwn(handlers, depMap.id);

                            if (handler) {
                                this.depExports[i] = handler(this);
                                return;
                            }

                            this.depCount += 1;

                            on(depMap, 'defined', bind(this, function(depExports) {
                                this.defineDep(i, depExports);
                                this.check();
                            }));

                            if (this.errback) {
                                on(depMap, 'error', bind(this, this.errback));
                            }
                        }

                        id = depMap.id;
                        mod = registry[id];

                        //Skip special modules like 'require', 'exports', 'module'
                        //Also, don't call enable if it is already enabled,
                        //important in circular dependency cases.
                        if (!hasProp(handlers, id) && mod && !mod.enabled) {
                            context.enable(depMap, this);
                        }
                    }));

                    //Enable each plugin that is used in
                    //a dependency
                    eachProp(this.pluginMaps, bind(this, function(pluginMap) {
                        var mod = getOwn(registry, pluginMap.id);
                        if (mod && !mod.enabled) {
                            context.enable(pluginMap, this);
                        }
                    }));

                    this.enabling = false;

                    this.check();
                },

                on: function(name, cb) {
                    var cbs = this.events[name];
                    if (!cbs) {
                        cbs = this.events[name] = [];
                    }
                    cbs.push(cb);
                },

                emit: function(name, evt) {
                    each(this.events[name], function(cb) {
                        cb(evt);
                    });
                    if (name === 'error') {
                        //Now that the error handler was triggered, remove
                        //the listeners, since this broken Module instance
                        //can stay around for a while in the registry.
                        delete this.events[name];
                    }
                }
            };

            function callGetModule(args) {
                //Skip modules already defined.
                if (!hasProp(defined, args[0])) {
                    getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
                }
            }

            function removeListener(node, func, name, ieName) {
                //Favor detachEvent because of IE9
                //issue, see attachEvent/addEventListener comment elsewhere
                //in this file.
                if (node.detachEvent && !isOpera) {
                    //Probably IE. If not it will throw an error, which will be
                    //useful to know.
                    if (ieName) {
                        node.detachEvent(ieName, func);
                    }
                } else {
                    node.removeEventListener(name, func, false);
                }
            }

            /**
             * Given an event from a script node, get the requirejs info from it,
             * and then removes the event listeners on the node.
             * @param {Event} evt
             * @returns {Object}
             */
            function getScriptData(evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                var node = evt.currentTarget || evt.srcElement;

                //Remove the listeners once here.
                removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
                removeListener(node, context.onScriptError, 'error');

                return {
                    node: node,
                    id: node && node.getAttribute('data-requiremodule')
                };
            }

            function intakeDefines() {
                var args;

                //Any defined modules in the global queue, intake them now.
                takeGlobalQueue();

                //Make sure any remaining defQueue items get properly processed.
                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                    } else {
                        //args are id, deps, factory. Should be normalized by the
                        //define() function.
                        callGetModule(args);
                    }
                }
            }

            context = {
                config: config,
                contextName: contextName,
                registry: registry,
                defined: defined,
                urlFetched: urlFetched,
                defQueue: defQueue,
                Module: Module,
                makeModuleMap: makeModuleMap,
                nextTick: req.nextTick,
                onError: onError,

                /**
                 * Set a configuration for the context.
                 * @param {Object} cfg config object to integrate.
                 */
                configure: function(cfg) {
                    //Make sure the baseUrl ends in a slash.
                    if (cfg.baseUrl) {
                        if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                            cfg.baseUrl += '/';
                        }
                    }

                    //Save off the paths since they require special processing,
                    //they are additive.
                    var shim = config.shim,
                        objs = {
                            paths: true,
                            bundles: true,
                            config: true,
                            map: true
                        };

                    eachProp(cfg, function(value, prop) {
                        if (objs[prop]) {
                            if (!config[prop]) {
                                config[prop] = {};
                            }
                            mixin(config[prop], value, true, true);
                        } else {
                            config[prop] = value;
                        }
                    });

                    //Reverse map the bundles
                    if (cfg.bundles) {
                        eachProp(cfg.bundles, function(value, prop) {
                            each(value, function(v) {
                                if (v !== prop) {
                                    bundlesMap[v] = prop;
                                }
                            });
                        });
                    }

                    //Merge shim
                    if (cfg.shim) {
                        eachProp(cfg.shim, function(value, id) {
                            //Normalize the structure
                            if (isArray(value)) {
                                value = {
                                    deps: value
                                };
                            }
                            if ((value.exports || value.init) && !value.exportsFn) {
                                value.exportsFn = context.makeShimExports(value);
                            }
                            shim[id] = value;
                        });
                        config.shim = shim;
                    }

                    //Adjust packages if necessary.
                    if (cfg.packages) {
                        each(cfg.packages, function(pkgObj) {
                            var location, name;

                            pkgObj = typeof pkgObj === 'string' ? {
                                name: pkgObj
                            } : pkgObj;

                            name = pkgObj.name;
                            location = pkgObj.location;
                            if (location) {
                                config.paths[name] = pkgObj.location;
                            }

                            //Save pointer to main module ID for pkg name.
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                .replace(currDirRegExp, '')
                                .replace(jsSuffixRegExp, '');
                        });
                    }

                    //If there are any "waiting to execute" modules in the registry,
                    //update the maps for them, since their info, like URLs to load,
                    //may have changed.
                    eachProp(registry, function(mod, id) {
                        //If module already has init called, since it is too
                        //late to modify them, and ignore unnormalized ones
                        //since they are transient.
                        if (!mod.inited && !mod.map.unnormalized) {
                            mod.map = makeModuleMap(id);
                        }
                    });

                    //If a deps array or a config callback is specified, then call
                    //require with those args. This is useful when require is defined as a
                    //config object before require.js is loaded.
                    if (cfg.deps || cfg.callback) {
                        context.require(cfg.deps || [], cfg.callback);
                    }
                },

                makeShimExports: function(value) {
                    function fn() {
                        var ret;
                        if (value.init) {
                            ret = value.init.apply(global, arguments);
                        }
                        return ret || (value.exports && getGlobal(value.exports));
                    }
                    return fn;
                },

                makeRequire: function(relMap, options) {
                    options = options || {};

                    function localRequire(deps, callback, errback) {
                        var id, map, requireMod;

                        if (options.enableBuildCallback && callback && isFunction(callback)) {
                            callback.__requireJsBuild = true;
                        }

                        if (typeof deps === 'string') {
                            if (isFunction(callback)) {
                                //Invalid call
                                return onError(makeError('requireargs', 'Invalid require call'), errback);
                            }

                            //If require|exports|module are requested, get the
                            //value for them from the special handlers. Caveat:
                            //this only works while module is being defined.
                            if (relMap && hasProp(handlers, deps)) {
                                return handlers[deps](registry[relMap.id]);
                            }

                            //Synchronous access to one module. If require.get is
                            //available (as in the Node adapter), prefer that.
                            if (req.get) {
                                return req.get(context, deps, relMap, localRequire);
                            }

                            //Normalize module name, if it contains . or ..
                            map = makeModuleMap(deps, relMap, false, true);
                            id = map.id;

                            if (!hasProp(defined, id)) {
                                return onError(makeError('notloaded', 'Module name "' +
                                    id +
                                    '" has not been loaded yet for context: ' +
                                    contextName +
                                    (relMap ? '' : '. Use require([])')));
                            }
                            return defined[id];
                        }

                        //Grab defines waiting in the global queue.
                        intakeDefines();

                        //Mark all the dependencies as needing to be loaded.
                        context.nextTick(function() {
                            //Some defines could have been added since the
                            //require call, collect them.
                            intakeDefines();

                            requireMod = getModule(makeModuleMap(null, relMap));

                            //Store if map config should be applied to this require
                            //call for dependencies.
                            requireMod.skipMap = options.skipMap;

                            requireMod.init(deps, callback, errback, {
                                enabled: true
                            });

                            checkLoaded();
                        });

                        return localRequire;
                    }

                    mixin(localRequire, {
                        isBrowser: isBrowser,

                        /**
                         * Converts a module name + .extension into an URL path.
                         * *Requires* the use of a module name. It does not support using
                         * plain URLs like nameToUrl.
                         */
                        toUrl: function(moduleNamePlusExt) {
                            var ext,
                                index = moduleNamePlusExt.lastIndexOf('.'),
                                segment = moduleNamePlusExt.split('/')[0],
                                isRelative = segment === '.' || segment === '..';

                            //Have a file extension alias, and it is not the
                            //dots from a relative path.
                            if (index !== -1 && (!isRelative || index > 1)) {
                                ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                                moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                            }

                            return context.nameToUrl(normalize(moduleNamePlusExt,
                                relMap && relMap.id, true), ext, true);
                        },

                        defined: function(id) {
                            return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                        },

                        specified: function(id) {
                            id = makeModuleMap(id, relMap, false, true).id;
                            return hasProp(defined, id) || hasProp(registry, id);
                        }
                    });

                    //Only allow undef on top level require calls
                    if (!relMap) {
                        localRequire.undef = function(id) {
                            //Bind any waiting define() calls to this context,
                            //fix for #408
                            takeGlobalQueue();

                            var map = makeModuleMap(id, relMap, true),
                                mod = getOwn(registry, id);

                            removeScript(id);

                            delete defined[id];
                            delete urlFetched[map.url];
                            delete undefEvents[id];

                            //Clean queued defines too. Go backwards
                            //in array so that the splices do not
                            //mess up the iteration.
                            eachReverse(defQueue, function(args, i) {
                                if (args[0] === id) {
                                    defQueue.splice(i, 1);
                                }
                            });

                            if (mod) {
                                //Hold on to listeners in case the
                                //module will be attempted to be reloaded
                                //using a different config.
                                if (mod.events.defined) {
                                    undefEvents[id] = mod.events;
                                }

                                cleanRegistry(id);
                            }
                        };
                    }

                    return localRequire;
                },

                /**
                 * Called to enable a module if it is still in the registry
                 * awaiting enablement. A second arg, parent, the parent module,
                 * is passed in for context, when this method is overridden by
                 * the optimizer. Not shown here to keep code compact.
                 */
                enable: function(depMap) {
                    var mod = getOwn(registry, depMap.id);
                    if (mod) {
                        getModule(depMap).enable();
                    }
                },

                /**
                 * Internal method used by environment adapters to complete a load event.
                 * A load event could be a script load or just a load pass from a synchronous
                 * load call.
                 * @param {String} moduleName the name of the module to potentially complete.
                 */
                completeLoad: function(moduleName) {
                    var found, args, mod,
                        shim = getOwn(config.shim, moduleName) || {},
                        shExports = shim.exports;

                    takeGlobalQueue();

                    while (defQueue.length) {
                        args = defQueue.shift();
                        if (args[0] === null) {
                            args[0] = moduleName;
                            //If already found an anonymous module and bound it
                            //to this name, then this is some other anon module
                            //waiting for its completeLoad to fire.
                            if (found) {
                                break;
                            }
                            found = true;
                        } else if (args[0] === moduleName) {
                            //Found matching define call for this script!
                            found = true;
                        }

                        callGetModule(args);
                    }

                    //Do this after the cycle of callGetModule in case the result
                    //of those calls/init calls changes the registry.
                    mod = getOwn(registry, moduleName);

                    if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                        if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                            if (hasPathFallback(moduleName)) {
                                return;
                            } else {
                                return onError(makeError('nodefine',
                                    'No define call for ' + moduleName,
                                    null, [moduleName]));
                            }
                        } else {
                            //A script that does not call define(), so just simulate
                            //the call for it.
                            callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                        }
                    }

                    checkLoaded();
                },

                /**
                 * Converts a module name to a file path. Supports cases where
                 * moduleName may actually be just an URL.
                 * Note that it **does not** call normalize on the moduleName,
                 * it is assumed to have already been normalized. This is an
                 * internal API, not a public one. Use toUrl for the public API.
                 */
                nameToUrl: function(moduleName, ext, skipExt) {
                    var paths, syms, i, parentModule, url,
                        parentPath, bundleId,
                        pkgMain = getOwn(config.pkgs, moduleName);

                    if (pkgMain) {
                        moduleName = pkgMain;
                    }

                    bundleId = getOwn(bundlesMap, moduleName);

                    if (bundleId) {
                        return context.nameToUrl(bundleId, ext, skipExt);
                    }

                    //If a colon is in the URL, it indicates a protocol is used and it is just
                    //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                    //or ends with .js, then assume the user meant to use an url and not a module id.
                    //The slash is important for protocol-less URLs as well as full paths.
                    if (req.jsExtRegExp.test(moduleName)) {
                        //Just a plain path, not module name lookup, so just return it.
                        //Add extension if it is included. This is a bit wonky, only non-.js things pass
                        //an extension, this method probably needs to be reworked.
                        url = moduleName + (ext || '');
                    } else {
                        //A module that needs to be converted to a path.
                        paths = config.paths;

                        syms = moduleName.split('/');
                        //For each module name segment, see if there is a path
                        //registered for it. Start with most specific name
                        //and work up from it.
                        for (i = syms.length; i > 0; i -= 1) {
                            parentModule = syms.slice(0, i).join('/');

                            parentPath = getOwn(paths, parentModule);
                            if (parentPath) {
                                //If an array, it means there are a few choices,
                                //Choose the one that is desired
                                if (isArray(parentPath)) {
                                    parentPath = parentPath[0];
                                }
                                syms.splice(0, i, parentPath);
                                break;
                            }
                        }

                        //Join the path parts together, then figure out if baseUrl is needed.
                        url = syms.join('/');
                        url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                        url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                    }

                    return config.urlArgs ? url +
                        ((url.indexOf('?') === -1 ? '?' : '&') +
                            config.urlArgs) : url;
                },

                //Delegates to req.load. Broken out as a separate function to
                //allow overriding in the optimizer.
                load: function(id, url) {
                    req.load(context, id, url);
                },

                /**
                 * Executes a module callback function. Broken out as a separate function
                 * solely to allow the build system to sequence the files in the built
                 * layer in the right sequence.
                 *
                 * @private
                 */
                execCb: function(name, callback, args, exports) {
                    return callback.apply(exports, args);
                },

                /**
                 * callback for script loads, used to check status of loading.
                 *
                 * @param {Event} evt the event from the browser for the script
                 * that was loaded.
                 */
                onScriptLoad: function(evt) {
                    //Using currentTarget instead of target for Firefox 2.0's sake. Not
                    //all old browsers will be supported, but this one was easy enough
                    //to support and still makes sense.
                    if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                        //Reset interactive script so a script node is not held onto for
                        //to long.
                        interactiveScript = null;

                        //Pull out the name of the module and the context.
                        var data = getScriptData(evt);
                        context.completeLoad(data.id);
                    }
                },

                /**
                 * Callback for script errors.
                 */
                onScriptError: function(evt) {
                    var data = getScriptData(evt);
                    if (!hasPathFallback(data.id)) {
                        return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                    }
                }
            };

            context.require = context.makeRequire();
            return context;
        }

        /**
         * Main entry point.
         *
         * If the only argument to require is a string, then the module that
         * is represented by that string is fetched for the appropriate context.
         *
         * If the first argument is an array, then it will be treated as an array
         * of dependency string names to fetch. An optional function callback can
         * be specified to execute when all of those dependencies are available.
         *
         * Make a local req variable to help Caja compliance (it assumes things
         * on a require that are not standardized), and to give a short
         * name for minification/local scope use.
         */
        req = requirejs = function(deps, callback, errback, optional) {

            //Find the right context, use default
            var context, config,
                contextName = defContextName;

            // Determine if have config object in the call.
            if (!isArray(deps) && typeof deps !== 'string') {
                // deps is a config object
                config = deps;
                if (isArray(callback)) {
                    // Adjust args if there are dependencies
                    deps = callback;
                    callback = errback;
                    errback = optional;
                } else {
                    deps = [];
                }
            }

            if (config && config.context) {
                contextName = config.context;
            }

            context = getOwn(contexts, contextName);
            if (!context) {
                context = contexts[contextName] = req.s.newContext(contextName);
            }

            if (config) {
                context.configure(config);
            }

            return context.require(deps, callback, errback);
        };

        /**
         * Support require.config() to make it easier to cooperate with other
         * AMD loaders on globally agreed names.
         */
        req.config = function(config) {
            return req(config);
        };

        /**
         * Execute something after the current tick
         * of the event loop. Override for other envs
         * that have a better solution than setTimeout.
         * @param  {Function} fn function to execute later.
         */
        req.nextTick = typeof setTimeout !== 'undefined' ? function(fn) {
            setTimeout(fn, 4);
        } : function(fn) {
            fn();
        };

        /**
         * Export require as a global, but only if it does not already exist.
         */
        if (!require) {
            require = req;
        }

        req.version = version;

        //Used to filter out dependencies that are already paths.
        req.jsExtRegExp = /^\/|:|\?|\.js$/;
        req.isBrowser = isBrowser;
        s = req.s = {
            contexts: contexts,
            newContext: newContext
        };

        //Create default context.
        req({});

        //Exports some context-sensitive methods on global require.
        each([
            'toUrl',
            'undef',
            'defined',
            'specified'
        ], function(prop) {
            //Reference from contexts instead of early binding to default context,
            //so that during builds, the latest instance of the default context
            //with its config gets used.
            req[prop] = function() {
                var ctx = contexts[defContextName];
                return ctx.require[prop].apply(ctx, arguments);
            };
        });

        if (isBrowser) {
            head = s.head = document.getElementsByTagName('head')[0];
            //If BASE tag is in play, using appendChild is a problem for IE6.
            //When that browser dies, this can be removed. Details in this jQuery bug:
            //http://dev.jquery.com/ticket/2709
            baseElement = document.getElementsByTagName('base')[0];
            if (baseElement) {
                head = s.head = baseElement.parentNode;
            }
        }

        /**
         * Any errors that require explicitly generates will be passed to this
         * function. Intercept/override it if you want custom error handling.
         * @param {Error} err the error object.
         */
        req.onError = defaultOnError;

        /**
         * Creates the node for the load command. Only used in browser envs.
         */
        req.createNode = function(config, moduleName, url) {
            var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
            node.type = config.scriptType || 'text/javascript';
            node.charset = 'utf-8';
            node.async = true;
            return node;
        };

        /**
         * Does the request to load a module for the browser case.
         * Make this a separate function to allow other environments
         * to override it.
         *
         * @param {Object} context the require context to find state.
         * @param {String} moduleName the name of the module.
         * @param {Object} url the URL to the module.
         */
        req.load = function(context, moduleName, url) {
            var config = (context && context.config) || {},
                node;
            if (isBrowser) {
                //In the browser so use a script tag
                node = req.createNode(config, moduleName, url);

                node.setAttribute('data-requirecontext', context.contextName);
                node.setAttribute('data-requiremodule', moduleName);

                //Set up load listener. Test attachEvent first because IE9 has
                //a subtle issue in its addEventListener and script onload firings
                //that do not match the behavior of all other browsers with
                //addEventListener support, which fire the onload event for a
                //script right after the script execution. See:
                //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
                //UNFORTUNATELY Opera implements attachEvent but does not follow the script
                //script execution mode.
                if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                    //Probably IE. IE (at least 6-8) do not fire
                    //script onload right after executing the script, so
                    //we cannot tie the anonymous define call to a name.
                    //However, IE reports the script as being in 'interactive'
                    //readyState at the time of the define call.
                    useInteractive = true;

                    node.attachEvent('onreadystatechange', context.onScriptLoad);
                    //It would be great to add an error handler here to catch
                    //404s in IE9+. However, onreadystatechange will fire before
                    //the error handler, so that does not help. If addEventListener
                    //is used, then IE will fire error before load, but we cannot
                    //use that pathway given the connect.microsoft.com issue
                    //mentioned above about not doing the 'script execute,
                    //then fire the script load event listener before execute
                    //next script' that other browsers do.
                    //Best hope: IE10 fixes the issues,
                    //and then destroys all installs of IE 6-9.
                    //node.attachEvent('onerror', context.onScriptError);
                } else {
                    node.addEventListener('load', context.onScriptLoad, false);
                    node.addEventListener('error', context.onScriptError, false);
                }
                node.src = url;

                //For some cache cases in IE 6-8, the script executes before the end
                //of the appendChild execution, so to tie an anonymous define
                //call to the module name (which is stored on the node), hold on
                //to a reference to this node, but clear after the DOM insertion.
                currentlyAddingScript = node;
                if (baseElement) {
                    head.insertBefore(node, baseElement);
                } else {
                    head.appendChild(node);
                }
                currentlyAddingScript = null;

                return node;
            } else if (isWebWorker) {
                try {
                    //In a web worker, use importScripts. This is not a very
                    //efficient use of importScripts, importScripts will block until
                    //its script is downloaded and evaluated. However, if web workers
                    //are in play, the expectation that a build has been done so that
                    //only one script needs to be loaded anyway. This may need to be
                    //reevaluated if other use cases become common.
                    importScripts(url);

                    //Account for anonymous modules
                    context.completeLoad(moduleName);
                } catch (e) {
                    context.onError(makeError('importscripts',
                        'importScripts failed for ' +
                        moduleName + ' at ' + url,
                        e, [moduleName]));
                }
            }
        };

        function getInteractiveScript() {
            if (interactiveScript && interactiveScript.readyState === 'interactive') {
                return interactiveScript;
            }

            eachReverse(scripts(), function(script) {
                if (script.readyState === 'interactive') {
                    return (interactiveScript = script);
                }
            });
            return interactiveScript;
        }

        //Look for a data-main script attribute, which could also adjust the baseUrl.
        if (isBrowser && !cfg.skipDataMain) {
            //Figure out baseUrl. Get it from the script tag with require.js in it.
            eachReverse(scripts(), function(script) {
                //Set the 'head' where we can append children by
                //using the script's parent.
                if (!head) {
                    head = script.parentNode;
                }

                //Look for a data-main attribute to set main script for the page
                //to load. If it is there, the path to data main becomes the
                //baseUrl, if it is not already set.
                dataMain = script.getAttribute('data-main');
                if (dataMain) {
                    //Preserve dataMain in case it is a path (i.e. contains '?')
                    mainScript = dataMain;

                    //Set final baseUrl if there is not already an explicit one.
                    if (!cfg.baseUrl) {
                        //Pull off the directory of data-main for use as the
                        //baseUrl.
                        src = mainScript.split('/');
                        mainScript = src.pop();
                        subPath = src.length ? src.join('/') + '/' : './';

                        cfg.baseUrl = subPath;
                    }

                    //Strip off any trailing .js since mainScript is now
                    //like a module name.
                    mainScript = mainScript.replace(jsSuffixRegExp, '');

                    //If mainScript is still a path, fall back to dataMain
                    if (req.jsExtRegExp.test(mainScript)) {
                        mainScript = dataMain;
                    }

                    //Put the data-main script in the files to load.
                    cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                    return true;
                }
            });
        }

        /**
         * The function that handles definitions of modules. Differs from
         * require() in that a string for the module should be the first argument,
         * and the function to execute after dependencies are loaded should
         * return a value to define the module corresponding to the first argument's
         * name.
         */
        define = function(name, deps, callback) {
            var node, context;

            //Allow for anonymous modules
            if (typeof name !== 'string') {
                //Adjust args appropriately
                callback = deps;
                deps = name;
                name = null;
            }

            //This module may not have dependencies
            if (!isArray(deps)) {
                callback = deps;
                deps = null;
            }

            //If no name, and callback is a function, then figure out if it a
            //CommonJS thing with dependencies.
            if (!deps && isFunction(callback)) {
                deps = [];
                //Remove comments from the callback string,
                //look for require calls, and pull them into the dependencies,
                //but only if there are function args.
                if (callback.length) {
                    callback
                        .toString()
                        .replace(commentRegExp, '')
                        .replace(cjsRequireRegExp, function(match, dep) {
                            deps.push(dep);
                        });

                    //May be a CommonJS thing even without require calls, but still
                    //could use exports, and module. Avoid doing exports and module
                    //work though if it just needs require.
                    //REQUIRES the function to expect the CommonJS variables in the
                    //order listed below.
                    deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
                }
            }

            //If in IE 6-8 and hit an anonymous define() call, do the interactive
            //work.
            if (useInteractive) {
                node = currentlyAddingScript || getInteractiveScript();
                if (node) {
                    if (!name) {
                        name = node.getAttribute('data-requiremodule');
                    }
                    context = contexts[node.getAttribute('data-requirecontext')];
                }
            }

            //Always save off evaluating the def call until the script onload handler.
            //This allows multiple modules to be in a file without prematurely
            //tracing dependencies, and allows for anonymous module support,
            //where the module name is not known until the script onload event
            //occurs. If no context, use the global queue, and get it processed
            //in the onscript load callback.
            (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
        };

        define.amd = {
            jQuery: true
        };


        /**
         * Executes the text. Normally just uses eval, but can be modified
         * to use a better, environment-specific call. Only used for transpiling
         * loader plugins, not for plain JS modules.
         * @param {String} text the text to execute/evaluate.
         */
        req.exec = function(text) {
            /*jslint evil: true */
            return eval(text);
        };

        //Set up with config info.
        req(cfg);
    }(this));

    define("platform/vendor/require", function() {});

    define('platform/vendor/md5', [], function() {
        /*!
         * Joseph Myer's md5() algorithm wrapped in a self-invoked function to prevent
         * global namespace polution, modified to hash unicode characters as UTF-8.
         *
         * Copyright 1999-2010, Joseph Myers, Paul Johnston, Greg Holt, Will Bond <will@wbond.net>
         * http://www.myersdaily.org/joseph/javascript/md5-text.html
         * http://pajhome.org.uk/crypt/md5
         *
         * Released under the BSD license
         * http://www.opensource.org/licenses/bsd-license
         */
        var add32;

        function md5cycle(x, k) {
            var a = x[0],
                b = x[1],
                c = x[2],
                d = x[3];

            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }

        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }

        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function md51(s) {
            // Converts the string to UTF-8 "bytes" when necessary
            if (/[\x80-\xFF]/.test(s)) {
                s = unescape(encodeURI(s));
            }
            var n = s.length,
                state = [1732584193, -271733879, -1732584194, 271733878],
                i;
            for (i = 64; i <= s.length; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++)
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i++) tail[i] = 0;
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }

        function md5blk(s) { /* I figured global was faster.   */
            var md5blks = [],
                i; /* Andy King said do it this way. */
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) +
                    (s.charCodeAt(i + 1) << 8) +
                    (s.charCodeAt(i + 2) << 16) +
                    (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        var hex_chr = '0123456789abcdef'.split('');

        function rhex(n) {
            var s = '',
                j = 0;
            for (; j < 4; j++)
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
                hex_chr[(n >> (j * 8)) & 0x0F];
            return s;
        }

        function hex(x) {
            for (var i = 0; i < x.length; i++)
                x[i] = rhex(x[i]);
            return x.join('');
        }

        /* this function is much faster, so if possible we use it. Some IEs are the
        only ones I know of that need the idiotic second function, generated by an
        if clause.  */
        add32 = function(a, b) {
            return (a + b) & 0xFFFFFFFF;
        };

        function md5(s) {
            return hex(md51(s));
        }

        if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
            add32 = function(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            };
        }

        return md5;
    });

    /*!
     * domready (c) Dustin Diaz 2012 - License MIT
     */
    define('platform/vendor/domReady', ['require'], function(ready) {
        var fns = [],
            fn, f = false,
            doc = document,
            testEl = doc.documentElement,
            hack = testEl.doScroll,
            domContentLoaded = 'DOMContentLoaded',
            addEventListener = 'addEventListener',
            onreadystatechange = 'onreadystatechange',
            readyState = 'readyState',
            loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/,
            loaded = loadedRgx.test(doc[readyState])

        function flush(f) {
            loaded = 1
            while (f = fns.shift()) f()
        }

        /*
        doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
          doc.removeEventListener(domContentLoaded, fn, f)
          flush()
        }, f)
        */

        function pollReadyState() {
            if (loadedRgx.test(doc[readyState])) {
                flush();
            } else {
                setTimeout(pollReadyState, 100);
            }
        }

        if (doc[addEventListener]) {
            // Jan 29, 2015 - Hack to fallback to polling document.readyState
            // when native document.addEventListener is overridden by someone
            // else's stupid code.
            if (doc[addEventListener].toString().indexOf("[native code]") > 0) {
                doc[addEventListener](domContentLoaded, fn = function() {
                    doc.removeEventListener(domContentLoaded, fn, f)
                    flush()
                }, f)
            } else {
                pollReadyState();
            }
        }

        hack && doc.attachEvent(onreadystatechange, fn = function() {
            if (/^c/.test(doc[readyState])) {
                doc.detachEvent(onreadystatechange, fn)
                flush()
            }
        })

        return (ready = hack ?
            function(fn) {
                self != top ?
                    loaded ? fn() : fns.push(fn) :
                    function() {
                        try {
                            testEl.doScroll('left')
                        } catch (e) {
                            return setTimeout(function() {
                                ready(fn)
                            }, 50)
                        }
                        fn()
                    }()
            } :
            function(fn) {
                loaded ? fn() : fns.push(fn)
            });
    });

    define('platform/utils', ['require', 'platform/vendor/md5', 'platform/vendor/domReady'], function(require) {
        /* globals Promise */
        var md5 = require('platform/vendor/md5');
        var domReady = require('platform/vendor/domReady');

        /* jshint curly:false */

        /**
         * @namespace utils
         */

        var _ = {};

        var objectProto = Object.prototype,
            toString = objectProto.toString;

        var arrayProto = Array.prototype,
            nativeIndexOf = arrayProto.indexOf,
            slice = arrayProto.slice;

        var funcProto = Function.prototype,
            nativeBind = funcProto.bind;

        var dateClass = "[object Date]";

        var UNDEFINED = "undefined",
            OBJECT = "object",
            STRING = "string",
            NUMBER = "number",
            FUNCTION = "function";

        var encode = encodeURIComponent;
        var decode = decodeURIComponent;

        var ticks = [],
            maxTickDepth = 100;

        var noOp = function() {};

        _.nextTick = function(cb, name) {
            ticks.push([cb, name]);
            setTimeout(processTicks, 0);
        };

        function processTicks() {
            var i = 0;
            while (ticks.length && i < maxTickDepth) {
                i++;
                var tick = ticks.shift();
                tick[0]();
            }
            if (ticks.length) {
                setTimeout(processTicks, 10);
            }
        }

        /**
         * Determine if a value is `undefined`.
         *
         * @function utils#isUndefined
         * @param {*} value
         * @returns {Boolean}
         *
         * @example
         * var user;
         * _.isUndefined(user)
         * // → true
         */
        _.isUndefined = function(value) {
            return typeof value === UNDEFINED;
        };

        /**
         * Determine if a value is an array.
         *
         * @function utils#isArray
         * @param {*} value
         * @returns {Boolean}
         *
         * @example
         * _.isArray([1, 2, 3])
         * // → true
         */
        _.isArray = function(value) {
            return value && typeof value === OBJECT && typeof value.length === NUMBER;
        };

        /**
         * Determine if a value is an object.
         *
         * @function utils#isPlainObject
         * @param {*} value
         * @returns {Boolean}
         *
         * @example
         * _.isPlainObject([1, 2, 3])
         * // → false
         *
         * _.isPlainObject({ "one": 1 })
         * // → true
         */
        _.isPlainObject = function(value) {
            return value && typeof value === OBJECT && !_.isArray(value);
        };

        /**
         * Determine if a value is a function.
         *
         * @function utils#isFunction
         * @param {*} value
         * @returns {Boolean}
         *
         * @example
         * _.isFunction(Math.random)
         * // → true
         */
        _.isFunction = function(value) {
            return typeof value === FUNCTION;
        };

        /**
         * Determine if a value is an instance of `Date`.
         *
         * @function utils#isDate
         * @param {*} value
         * @returns {value is Date}
         *
         * @example
         * _.isDate(new Date())
         * // → true
         */
        _.isDate = function(value) {
            return value && typeof value === OBJECT && toString.call(value) === dateClass || false;
        };

        /**
         * Determine if a value is or looks like a number.
         *
         * @function utils#isNumeric
         * @param {*} value
         * @returns {Boolean}
         *
         * @example
         * _.isNumeric(0);
         * // → true
         *
         * _.isNumeric(-2.5);
         * // → true
         *
         * _.isNumeric("100.23");
         * // → true
         *
         * _.isNumeric("$200.40");
         * // → false
         */
        var NUMERIC_RE = /^-?(\d+\.\d+|\.\d+|\d+)$/;
        _.isNumeric = function(value) {
            return typeof value === NUMBER || NUMERIC_RE.test(String(value));
        };

        /**
         * Determine the type of a value. Similar to `typeof` except it also differentiates arrays and dates from objects.
         *
         * Types:
         *
         * - boolean
         * - string
         * - number
         * - object
         * - array
         * - date
         *
         * @function utils#getType
         * @param {*} value - The value to inspect
         * @returns {String}
         */
        _.getType = function(value) {
            var type = typeof value;
            if (type === OBJECT) {
                if (_.isArray(value)) {
                    return "array";
                }
                if (_.isDate(value)) {
                    return "date";
                }
            }
            return type;
        };

        /**
         * Removes any whitespace before or after `text`. The `text` is coerced to a string unless it is
         * `undefined` or `null`, in which case an empty string is returned.
         *
         * @function utils#trim
         * @param {String} text - The text to trim.
         * @returns {String}
         *
         * @example
         * _.trim()
         * // → ""
         *
         * _.trim(null)
         * // → ""
         *
         * _.trim(0)
         * // → "0"
         *
         * _.trim({ name: "Matt" })
         * // → "[object Object]"
         *
         * _.trim(false)
         * // → "false"
         *
         * _.trim("    helloworld!   ")
         * // → "helloworld!"
         */
        _.trim = function(text) {
            if (_.isUndefined(text) || text === null) {
                return "";
            }
            return String(text).replace(/^\s+|\s+$/gm, "");
        };

        /**
         * Iterates over elements of `collection` invoking `iterator` for each element.
         * The `iterator` is bound to `thisArg` and invoked with three arguments: (value, index|key, collection).
         * Iterator functions may exit iteration early by explicitly returning `false`.
         *
         * **Note:** As with other "Collections" methods, objects with a `length` property are iterated like arrays.
         * To avoid this behavior _.forIn or _.forOwn may be used for object iteration.
         *
         * @function utils#forEach
         * @param {any[] | Record<string, any>} collection - The collection to iterator over.
         * @param {Function} iterator - The function invoked per iteration.
         * @param {*} [thisArg] - The `this` binding of `iterator`.
         * @returns {any[] | Record<string, any>} - Returns `collection`.
         *
         * @example
         * _.forEach([1, 2], function ( value ) {
         *   log("value: ", value);
         * });
         * // → logs each value from left to right and returns the array
         *
         * _.forEach({ name: "Matt", age: 27 }, function ( value, key ) {
         *   log("value: ", value, "key: ", key);
         * });
         * // → logs each value-key pair and returns the object (iteration order is not guaranteed)
         */
        _.forEach = function(collection, iterator, thisArg) {
            if (!collection) {
                return collection;
            }
            var i, length = collection.length;
            if (length === +length) {
                for (i = 0; i < length; i++) {
                    if (iterator.call(thisArg, collection[i], i, collection) === false) {
                        break;
                    }
                }
            } else {
                for (var key in collection) {
                    if (iterator.call(thisArg, collection[key], key, collection) === false) {
                        break;
                    }
                }
            }
            return collection;
        };

        /**
         * Iterates over own enumerable properties of a `object` invoking `iterator` for each property.
         * The `iterator` is bound to `thisArg` and invoked with three arguments: (value, key, object).
         * Iterator functions may exit iteration early by explicitly returning false.
         *
         * @function utils#forOwn
         * @param {Object} object - The object to iterate over.
         * @param {Function} [iterator=utils.identity] - The function invoked per iteration.
         * @param {*} [thisArg] - The `this` binding of `iterator`.
         * @returns {Object} - Returns `object`.
         *
         * @example
         * function Foo () {
         *   this.a = 1;
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.forOwn(new Foo, function ( value, key ) {
         *   log(key);
         * });
         * // → logs 'a' and 'b' (iteration order is not guaranteed)
         */
        _.forOwn = function(object, iterator, thisArg) {
            iterator = iterator || _.identity;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    if (iterator.call(thisArg, object[key], key, object) === false) {
                        break;
                    }
                }
            }
            return object;
        };

        /**
         * Alias of {@link utils.forEach}.
         * @function utils#each
         */
        _.each = _.forEach;

        /**
         * Tests whether at least one item in the collection passes the test specified
         * by `iteratee`.
         * @param {any[] | Record<string, any>} collection
         * @param {(value: any, key: any) => boolean} iteratee
         * @returns {boolean}
         */
        _.some = function(collection, iteratee) {
            var result = false;
            _.forEach(collection, function(value, key) {
                if (iteratee(value, key)) {
                    result = true;
                    // Exit forEach
                    return false;
                }
            });
            return result;
        };

        /**
         * Tests whether at all items in the collection passes the test specified by
         * `iteratee`.
         * @param {any[] | Record<string, any>} collection
         * @param {(value: any, key: any) => boolean} iteratee
         * @returns {boolean}
         */
        _.every = function(collection, iteratee) {
            var result = true;
            _.forEach(collection, function(value, key) {
                if (!iteratee(value, key)) {
                    result = false;
                    // Exit forEach
                    return false;
                }
            });
            return result;
        };

        /**
         * Creates an array of values by running each element in `collection` through `iterator`.
         * The `iterator` is bound to `thisArg` and invoked with three arguments: (value, index|key, collection).
         *
         * @function utils#map
         * @param {any[] | Record<string, any>} collection - The collection to iterate over.
         * @param {Function} iterator - The function invoked per iteration.
         * @param {any} [thisArg] - The `this` binding of `iterator`.
         * @returns {any[]} - Returns the new mapped array.
         *
         * @example
         * var users = [
         *   { "user": "barney" },
         *   { "user": "fred" }
         * ];
         *
         * _.map(users, function ( value ) {
         *   return value.user;
         * });
         * // → ["barney", "fred"]
         */
        _.map = function(collection, iterator, thisArg) {
            var list = [];
            iterator = iterator || _.identity;
            _.each(collection, function(value, key) {
                list.push(iterator.call(thisArg, value, key, collection));
            });
            return list;
        };

        /**
         * Reduces `collection` to a value which is the accumulated result of running each element in `collection` through `iterator`,
         * where each successive invocation is supplied the return value of the previous. The `iterator` is bound to `thisArg`
         * and invoked with four arguments: (accumulator, value, index|key, collection).
         *
         * @function utils#reduce
         * @param {Array|Object|String} collection - The object to iterate over.
         * @param {Function} iterator - The function invoked per iteration.
         * @param {*} accumulator - The initial value.
         * @param {*} [thisArg] - The `this` binding of `iterator`.
         * @returns {*} - Returns the accumulated value.
         *
         * @example
         * _.reduce([1, 2], function ( sum, n ) {
         *   return sum + n;
         * }, 0);
         * // → 3
         */
        _.reduce = function(collection, iterator, accumulator, thisArg) {
            _.each(collection, function(value, key) {
                accumulator = iterator.call(thisArg, accumulator, value, key, collection);
            });
            return accumulator;
        };

        /**
         * Iterates over elements of `collection`, returning an array of all elements `iterator` returns truthy for.
         * The `iterator` is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
         *
         * @function utils#filter
         * @param {Array|Object} collection - The collection to iterate over.
         * @param {Function} iterator - The function invoked per iteration.
         * @param {*} [thisArg] - The `this` binding of `iterator`.
         * @returns {Array} Returns the new filtered array.
         *
         * @example
         * _.filter([4, 5, 6], function ( value ) {
         *   return value % 2 === 0;
         * });
         * // → [4, 6]
         */
        _.filter = function(collection, iterator, thisArg) {
            var list = [];
            iterator = iterator || _.identity;
            _.each(collection, function(value, key) {
                if (iterator.call(thisArg, value, key, collection)) {
                    list.push(value);
                }
            });
            return list;
        };

        /**
         * Iterates over own enumarable properties of `object`, returning an new object with all the properties `iterator` returns truthy for.
         * The `iterator` is bound to `thisArg` and invoked with three arguments; (value, key, object).
         *
         * @function utils#filterObject
         * @param {Object} object - The object to inspect.
         * @param {Function} iterator - The function invoked per iteration.
         * @param {*} [thisArg] - The `this` binding of `iterator`.
         * @returns {Object} Returns the new filtered object.
         *
         * @example
         * var user = { name: "Matt", age: 27, friends: 500 };
         * _.filterObject(user, function ( value, key ) {
         *   return key !== "name";
         * });
         * // → { age: 27, friends: 500 }
         */
        _.filterObject = function(object, iterator, thisArg) {
            var result = {};
            iterator = iterator || _.identity;
            for (var key in object) {
                if (object.hasOwnProperty(key) && iterator.call(thisArg, object[key], key, object)) {
                    result[key] = object[key];
                }
            }
            return result;
        };

        /**
         * This method returns the first argument provided to it.
         *
         * @function utils#identity
         * @param {*} value - Any value.
         * @returns {*} - Returns `value`.
         *
         * @example
         * _.identity(10, 20, 30);
         * // → 10
         */
        _.identity = function(value) {
            return value;
        };

        /**
         * Gets the index at which the first occurrence of `value` is found in `array`. If `fromIndex` is negative,
         * it is used as the offset from the end of array.
         *
         * @function utils#indexOf
         * @param {Array} array - The array to search.
         * @param {*} value - The value to search for.
         * @param {Number} [fromIndex] - The index to search from.
         * @returns {Number} Returns the index of the matched value, else `-1`.
         *
         * @example
         * _.indexOf([1, 2, 1, 2], 2);
         * // → 1
         */
        _.indexOf = nativeIndexOf ? function(array, value, fromIndex) {
            return nativeIndexOf.call(array, value, fromIndex);
        } : function(array, value, fromIndex) {
            fromIndex = fromIndex || 0;
            var length = array.length;
            if (fromIndex < 0) {
                fromIndex += length;
            }
            if (fromIndex < 0) {
                fromIndex = 0;
            }
            for (var i = fromIndex; i < length; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
            return -1;
        };

        /**
         * Iterates over elements of `collection`, returning the first element `predicate` returns truthy for.
         * The predicate is invoked with three arguments; (value, index|key, collection).
         *
         * @function utils#find
         * @param {Object|Array} collection - The collection to search.
         * @param {Function} predicate - The function invoked per iteration.
         * @returns {*} The matched element, else `undefined`.
         *
         * @example
         * var products = [
         *   { id: "A", sku: "001", price: 20, quantity: 4 },
         *   { id: "B", sku: "002", price: 10, quantity: 2 },
         *   { id: "C", sku: "003", price: 15, quantity: 1 }
         * ];
         *
         * _.find(products, function ( value, index, collection ) {
         *   return value.quantity < 4;
         * });
         * // → { id: "B", sku: "002", price: 10, quantity: 2 }
         */
        _.find = function(collection, predicate) {
            var result, iterator, found;

            var type = _.getType(predicate);
            if (type === FUNCTION) {
                iterator = function(value, key) {
                    if (!found && predicate(value, key)) {
                        result = value;
                        found = 1;
                    }
                };
            } else if (type === STRING) {
                // @ts-ignore
                return collection[predicate];
            } else if (type === OBJECT) {
                var keys = _.keys(predicate);
                if (keys.length) {
                    var findKey = keys[0],
                        findValue = predicate[findKey];
                    iterator = function(value) {
                        if (!found && value[findKey] === findValue) {
                            result = value;
                            found = 1;
                        }
                    };
                }
            }
            if (iterator) {
                _.each(collection, iterator);
            }
            return result;
        };

        /**
         * Creates an array of the own enumerable property names of `object`.
         *
         * @function utils#keys
         * @param {Object} object - The object to inspect.
         * @returns {Array} Returns the array of property names.
         *
         * @example
         * _.keys({ name: "Matt", age: 27 });
         * // → ["name", "age"]
         */
        _.keys = function(object) {
            var keys = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };

        /**
         * Creates an array of the own enumerable property values of `object`.
         *
         * @function utils#values
         * @param {Object} object - The object to query.
         * @returns {Array} Returns the array of property values.
         *
         * @example
         * _.values({ name: "Matt", age: 27 });
         * // → ["Matt", 27]
         */
        _.values = function(object) {
            var values = [];
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    values.push(object[key]);
                }
            }
            return values;
        };

        /**
         * Recursively merges own enumerable properties of the source object(s), that don't resolve to `undefined`
         * into the destination object.Subsequent sources overwrite property assignments of previous sources.
         *
         * @function utils#merge
         * @param {Object} target - The destination object.
         * @returns {Object} Returns `target`.
         *
         * @example
         * var user = { name: "Matt", age: 27 };
         * var result = _.merge(user, { age: 28, friends: "none" });
         * // → { name: "Matt", age: 28, friends: "none" }
         * // result === user, user has been modified by reference
         *
         * var user = { name: "Matt", age: 27 };
         * var result = _.merge({}, user, { age: 28, friends: "none" }, { age: 30, name: undefined });
         * // → { name: "Matt", age: 30, friends: "none" }
         * // user has not been modified
         */
        _.merge = function(target) {
            var sources = slice.call(arguments, 1);
            var i, key, source;
            for (i = 0; i < sources.length; i++) {
                source = sources[i];
                for (key in source) {
                    if (source.hasOwnProperty(key) && typeof source[key] !== UNDEFINED) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };

        /**
         * Recursively deep merges own enumerable properties of the source object(s), that don't resolve to `undefined`
         * into the destination object. Subsequent sources overwrite property assignments of previous sources.
         *
         * @function utils#mergeDeep
         * @param {Object} target - The destination object.
         * @returns {Object} Returns `target`.
         */
        _.mergeDeep = function(target) {
            var sources = slice.call(arguments, 1);
            var i, key, source;
            for (i = 0; i < sources.length; i++) {
                source = sources[i];
                for (key in source) {
                    var value = source[key];
                    if (source.hasOwnProperty(key) && typeof value !== 'undefined') {
                        if (target[key] && typeof target[key] === OBJECT && typeof value === OBJECT) {
                            _.mergeDeep(target[key], value);
                        } else {
                            target[key] = _.clone(value, true);
                        }
                    }
                }
            }
            return target;
        };

        /**
         * Creates a clone of `value`. If `isDeep` is `true`, nested objects are cloned, otherwise they are assigned by reference.
         *
         * @function utils#clone
         * @param {*} value - The value to clone.
         * @param {Boolean} [isDeep] - Specify a deep clone.
         * @returns {*} Returns the cloned value.
         *
         * @example
         * var users = [
         *   { "user": "barney" },
         *   { "user": "fred" }
         * ];
         *
         * var shallow = _.clone(users);
         * shallow[0] === users[0];
         * // → true
         *
         * var deep = _.clone(users, true);
         * deep[0] === users[0];
         * // → false
         */
        _.clone = function(value, isDeep) {
            if (_.isDate(value)) {
                return new Date(value.getTime());
            }
            if (value && typeof value === OBJECT) {
                var clone, key;
                if (_.isArray(value)) {
                    clone = [];
                    for (key = 0; key < value.length; key++) {
                        clone[key] = isDeep ? _.clone(value[key]) : value[key];
                    }
                } else {
                    clone = {};
                    for (key in value) {
                        if (value.hasOwnProperty(key)) {
                            clone[key] = isDeep ? _.clone(value[key]) : value[key];
                        }
                    }
                }
                return clone;
            }
            return value;
        };

        /**
         * Creates a clone of `value`. If `isDeep` is `true`, nested objects are cloned, otherwise they are assigned by reference.
         *
         * @function utils#cloneDeep
         * @template T
         * @param {T} value - The value to clone.
         * @returns {T} Returns the cloned value.
         */
        _.cloneDeep = function(value) {
            return _.clone(value, true);
        };

        _.uuid = function() {
            var crypto = window.crypto;
            if (crypto) {
                if ('randomUUID' in crypto) {
                    return crypto.randomUUID();
                }
                if ('getRandomValues' in crypto) {
                    return ('10000000-1000-4000-8000-100000000000').replace(
                        /[018]/g,
                        function(char) {
                            return (Number(char) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(char) / 4).toString(16);
                        }
                    );
                }
            }
            return fallbackUuid();
        };

        function fallbackUuid() {
            var now = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
                var r = (now + Math.random() * 16) % 16 | 0;
                now = Math.floor(now / 16);
                return (char === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }

        /**
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality
         * @param {any} x
         * @param {any} y
         * @returns {boolean}
         */
        function sameValueZero(x, y) {
            if (typeof x === "number" && typeof y === "number") {
                // x and y are equal (may be -0 and 0) or they are both NaN
                return x === y || (x !== x && y !== y);
            }
            return x === y;
        }

        /**
         * Creates a duplicate-free version of an array, using SameValueZero for
         * equality comparisons, in which only the first occurrence of each element is
         * kept.
         * @param {any[]} array The array to inspect.
         * @returns {any[]} Returns the new duplicate free array.
         */
        _.uniq = function(array) {
            var result = [];
            _.each(array, function(value) {
                var exists = _.some(result, function(other) {
                    return sameValueZero(value, other);
                });
                if (!exists) {
                    result.push(value);
                }
            });
            return result;
        };

        /**
         * Returns a function, that, when invoked, will only be triggered at most once
         * during a given window of time. Normally, the throttled function will run
         * as much as it can, without ever going more than once per `wait` duration;
         * but if you'd like to disable the execution on the leading edge, pass
         * `{leading: false}`. To disable execution on the trailing edge, ditto.
         *
         * @function utils#throttle
         * @param {Function} func - The function to throttle.
         * @param {Number} wait - The minimum timeout in milliseconds to wait before repeated execution of the function.
         * @param {Object} [options]
         * @param {Boolean} [options.leading=true] - Set to `false` to disable execution on the leading edge.
         * @param {Boolean} [options.trailing=true] - Set to `false` to disable execution on the trailing edge.
         *
         * @example
         * // Avoid excessively updating the position while scrolling
         * $(window).on("scroll", _.throttle(updatePosition, 100));
         */
        _.throttle = function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function() {
                // @ts-ignore
                previous = options.leading === false ? 0 : _.now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var now = _.now();
                // @ts-ignore
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                    // @ts-ignore
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };

        /**
         * Returns a function, that, as long as it continues to be invoked, will not
         * be triggered.
         *
         * @function utils#debounce
         * @param {Function} func - The function to wrap.
         * @param {Number} wait - Number of milliseconds to wait before calling the debounced function.
         * @param {Boolean} immediate - If `true`, trigger the function on the leading edge, instead of the trailing.
         * @returns Function
         *
         * @example
         * // Avoid costly calculations while the window size is in flux
         * $(window).on("scroll", _.debounce(calculateLayout, 150));
         */
        _.debounce = function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function() {
                var last = _.now() - timestamp;

                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = _.now();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        };

        // Reusable constructor function for prototype setting.
        var Ctor = function() {};

        /**
         * Create a function bound to a given object (assigning `this`, and arguments,
         * optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
         * available.
         *
         * @function utils#bind
         * @param {Function} func - The function to bind.
         * @param {*} [thisArg] - The `this` binding of `func`.
         * @returns {Function} - Returns the new bound function.
         *
         * @example
         * var say = function ( message ) {
         *   return this.name + " says, " + message;
         * };
         *
         * var user = { name: "Matt" };
         *
         * say.call(user, "hello");
         * // → "Matt says, hello"
         *
         * user.speak = _.bind(say, user);
         * user.speak("this is cool!");
         * // → "Matt says, this is cool!"
         */
        _.bind = function(func, thisArg) {
            var args, bound;
            if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
            if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
            args = slice.call(arguments, 2);
            bound = function() {
                if (!(this instanceof bound)) return func.apply(thisArg, args.concat(slice.call(arguments)));
                Ctor.prototype = func.prototype;
                var self = new Ctor();
                Ctor.prototype = null;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (_.isPlainObject(result)) return result;
                return self;
            };
            return bound;
        };

        /**
         * Determine if a string contains url-encoded text.
         *
         * @function utils#isEncoded
         * @param {string} url - The url to examine.
         * @returns {boolean | undefined}
         *
         * @example
         * _.isEncoded("Hello + World")
         * // → false
         *
         * _.isEncoded("Hello%20%2B%20World")
         * // → true
         */
        _.isEncoded = function(url) {
            try {
                return decode(url) !== url;
            } catch (ex) {}
        };

        /**
         * Attempts to decode a url, returning the original input if it fails.
         * Use to always get the decoded version of the url without first knowing
         * if it is already encoded.
         *
         * @function utils#decodeUrl
         * @param {string} url - The url to decode.
         * @return {string | undefined} The decoded url or the original input.
         */
        _.decodeUrl = function(url) {
            if (typeof url === 'string') {
                try {
                    url = decode(url);
                } catch (ex) {}
            }
            return url;
        };

        /**
         * Parses a URL into its various components.
         *
         * @function utils#parseUrl
         * @param  {String} url - The url to parse.
         * @return {Platform.Utils.ParsedUrl} result - An object represented the deconstructed url.
         *
         * @example
         * var url = "http://www.fanplayr.com/product/tumi/alpha-international-expandable-4-wheeled-carry-on/270952?productid=10295430&cartItemId=1&something";
         * _.parseUrl(url)
         * // →
         * {
         *   "protocol": "http:",
         *   "hostname": "www.fanplayr.com",
         *   "port": "",
         *   "pathname": "/product/tumi/alpha-international-expandable-4-wheeled-carry-on/270952",
         *   "search": "?productid=10295430&cartItemId=1&something",
         *   "hash": "",
         *   "host": "www.fanplayr.com",
         *   "href": "http://www.fanplayr.com/product/tumi/alpha-international-expandable-4-wheeled-carry-on/270952?productid=10295430&cartItemId=1&something",
         *   "params": {
         *     "cartItemId": "1",
         *     "productid": "10295430",
         *     "something": true
         *   }
         * }
         */
        var parseUrlAnchor;
        _.parseUrl = function(url) {
            var result = {
                params: {}
            };

            try {
                if (!parseUrlAnchor) {
                    parseUrlAnchor = document.createElement("a");
                }
                parseUrlAnchor.href = url;
                // @ts-ignore
                result = {
                    protocol: parseUrlAnchor.protocol,
                    hostname: parseUrlAnchor.hostname,
                    port: parseUrlAnchor.port,
                    pathname: parseUrlAnchor.pathname,
                    search: parseUrlAnchor.search,
                    hash: parseUrlAnchor.hash,
                    host: parseUrlAnchor.host,
                    href: url
                };

                var params = result.params = {};

                var arrayKeyRegExp = /([^\[\]]+)\[.*?\]/;

                var query = parseUrlAnchor.search || "";
                if (query) {
                    _.each(query.substr(1).split("&"), function(part) {
                        var parts = part.split("=");
                        var key = decode(parts[0]);
                        var value = parts.length > 1 && decode(parts[1]) || true;

                        var match = arrayKeyRegExp.exec(key);
                        if (match) {
                            key = match[1];
                        }

                        var param = params[key];
                        if (_.isUndefined(param)) {
                            param = value;
                        } else {
                            if (_.isArray(param)) {
                                param.push(value);
                            } else {
                                param = [param, value];
                            }
                        }
                        params[key] = param;
                    });
                }

                result.compile = function() {
                    // @ts-ignore
                    return _.compileUrl(result);
                };
            } catch (e) {}

            return result;
        };

        /**
         * Compiles the resulting object from {@link utils.parseUrl} back into a URL.
         *
         * The `host`, `search`, `href` properties are ignored. The query parameter string
         * is constructed from the `params` object.
         *
         * @function utils#compileUrl
         * @param {Object} obj - An object.
         * @param {String} [obj.protocol] - If omitted, a protocol relative url is produced. Must **NOT** contain a `:` (added automatically if necessary).
         * @param {String} obj.hostname - The hostname.
         * @param {Number} [obj.port] - The port number.
         * @param {String} [obj.pathname] - The path to the resource. Must begin with `/`.
         * @param {Object} [obj.params] - An object whose key-value pairs will be url-encoded to build the query string.
         * @param {String} [obj.hash] - The hash fragment. Must begin with `#`.
         * @return {String} - Returns the compiled url.
         *
         * @example
         * var urlObj = _.parseUrl("http://www.fanplayr.com/search/?query=platform%20docs&limit=10");
         * urlObj.protocol = "";
         * urlObj.pathname = "/adv-search";
         * urlObj.params.limit = 50;
         * urlObj.params.order = "desc";
         * urlObj.compile();
         * // → //www.fanplayr.com/adv-search/?query=platform%20docs&limit=50&order=desc
         */
        _.compileUrl = function(obj) {
            var url = "";
            if (obj.protocol) {
                url += obj.protocol;
            }
            url += "//" + obj.hostname;
            if (obj.port) {
                url += ":" + obj.port;
            }
            url += obj.pathname || "";
            var params = [];
            _.each(obj.params, function(value, key) {
                if (_.isArray(value)) {
                    _.each(value, function(value) {
                        params.push(encode(key + "[]") + "=" + encode(value));
                    });
                } else {
                    params.push(encode(key) + "=" + encode(value));
                }
            });
            if (params.length) {
                url += "?" + params.join("&");
            }
            url += obj.hash || "";
            return url;
        };

        /**
         * Returns an absolute url if the input is relative or missing a protocol.
         *
         * @function utils#getAbsoluteUrl
         * @param {String} url - The url.
         * @return {String}
         *
         * @example
         * // Assuming current location is https://demo.fanplayr.com/products/rdb1.html?hello=world
         * _.getAbsoluteUrl("/v/photos/rdb1.jpg")
         * // → https://demo.fanplayr.com/v/photos/rdb1.jpg
         */
        var isAbsoluteUrlRE = /^https?:\/\//;
        _.getAbsoluteUrl = function(urlStr) {
            if (urlStr && !isAbsoluteUrlRE.test(urlStr)) {
                var url = _.parseUrl(urlStr);
                return url.compile();
            }
            return urlStr;
        };

        /**
         * Executes the `tasks` array or object of functions in parallel, passing any error or results to `resultCallback`
         * when all tasks are completed or for the first error is encountered. `resultCallback` is guaranteed
         * to be invoked no more than once.
         *
         * Each task is passed a `done(err, result)` callback which is must invoke on completion or failure
         * (determined by the truthiness of `err`) and an optional `result` value. Invoking `done` more than
         * once has no effect.
         *
         * If any of the tasks invoke `done` with an error, `resultCallback` is immediately invoked with the
         * value of the error and results of any completed tasks so far. Any other tasks that are currently
         * running will continue to run, but will be ignored.
         *
         * Results are given in the order that the tasks are defined, irrespective of the order the tasks actually completed.
         *
         * @function utils#parallel
         * @param {(Function[]|Object)} tasks - An array or object containing functions to run.
         *        Each function is passed a `done(err, result)` callback which it must call on completion or failure (determined
         *        by the truthiness of `err`) and an optional `result` value. Invoking `done` more than once has no effect.
         * @param {function} [callback] - An optional callback in the form `(err, results)` which is invoked once all the
         *        tasks have completed, or for the first error encountered.
         * @param {number} [concurrency=0] - The maximum number of tasks to run in parallel. Zero for unlimited.
         *
         * @example
         * _.parallel([
         *   function ( cb ) {
         *     setTimeout(function () {
         *       cb(null, "one");
         *     }, 1000);
         *   },
         *   function ( cb ) {
         *     setTimeout(function () {
         *       cb(null, "two");
         *     }, 500);
         *   }
         * ], function ( err, results ) {
         *   // The results array will be equal to ["one", "two"] even though
         *   // the second task had a shorter timeout.
         * });
         *
         * _.parallel({
         *   one: function ( cb ) {
         *     setTimeout(function () {
         *       cb(null, 1);
         *     }, 1000);
         *   },
         *   two: function ( cb ) {
         *     setTimeout(function () {
         *       cb(null, 2);
         *     }, 500);
         *   }
         * }, function ( err, results ) {
         *   // The results object will be equal to {one: 1, two: 2}
         * });
         */
        _.parallel = function(tasks, callback, concurrency) {
            // Clone tasks object or array so it cannot be changed by outside code.
            tasks = _.clone(tasks);

            var isArray = _.isArray(tasks);
            var results = isArray ? [] : {};

            // Create a list of keys to access tasks by.
            var keys = _.map(tasks, function(value, key) {
                return key;
            });

            var currentRunningCount = 0;
            var hasCompleted;

            var createDoneFn = function(taskKey, nextFn) {
                var isDone;
                return function(err, result) {
                    if (!isDone) {
                        isDone = 1;
                        if (err) {
                            if (callback) {
                                hasCompleted = 1;
                                callback(err, results);
                            }
                        } else {
                            results[taskKey] = result;
                            currentRunningCount--;
                            nextFn();
                        }
                    }
                };
            };

            var nextFn = function() {
                if (keys.length) {
                    if (!concurrency || currentRunningCount < concurrency) {
                        currentRunningCount++;
                        var taskKey = keys.shift();
                        tasks[taskKey](createDoneFn(taskKey, nextFn));

                        if (!concurrency || currentRunningCount < concurrency) {
                            nextFn();
                        }
                    }
                } else if (currentRunningCount === 0 && !hasCompleted) {
                    hasCompleted = 1;
                    if (callback) {
                        callback(null, results);
                    }
                }
            };

            nextFn();
        };

        /**
         * Run the `tasks` array or object of functions in series, each one running once the previous task has completed.
         *
         * This is just a convenience method for running {@link utils.parallel} with a `concurrency` of 1.
         *
         * @see utils#parallel
         * @function utils#series
         * @param {(Function[]|Object)} tasks
         * @param {function} [callback]
         */
        _.series = function(tasks, callback) {
            _.parallel(tasks, callback, 1);
        };

        /**
         * Returns the current timestamp in milliseconds.
         *
         * @function utils#now
         * @returns {Number} - Returns the current timestamp in milliseconds.
         *
         * @example
         * _.now()
         * // → 1427491510687
         */
        _.now = function() {
            return new Date().getTime();
        };

        /**
         * Takes a variety of inputs and calculates the number of milliseconds since January 1, 1970, 00:00:00.
         *
         * This method should handle the long form of [Date.UTC](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC).
         *
         * This method handles a variety of inputs:
         *
         * - When zero arguments are given it returns the current timestamp.
         * - When a number is given as the only argument, it is assumed to be a timestamp and returned.
         * - When a string is given as the only argument:
         *   - If it doesn't contain time into form of HH:MM:SS it is parsed with Date() which assumes local time.
         *   - If it ends with `"Z"` it is parsed with Date() which assumes universal time.
         *   - If it contains time information with an offset in the form HH:MM:SS[+|-]XX it is parsed with Date() which assumes universal time.
         * - When an instance of Date is given as the only argument, it is assumed to be in local time.
         * - When more than one argument is given, they are all assumed to be numbers and are used to construct a new Date instance
         * before converting it to a timestamp.
         *
         * Local date instances are converted to universal time by negating the date's timezone offset.
         *
         * @function utils#utc
         * @param  {Number|String|Date} value - If this is the only argument provided, it will be used to construct the date,
         *  otherwise it is assumed to be the year.
         * @param  {Number} [month=0] - Integer value representing the month, beginning with 0 for January to 11 for December.
         * @param  {Number} [day=1] - Day of the month.
         * @param  {Number} [hour=0] - Hour, 0 - 23.
         * @param  {Number} [minute=0] - Minute, 0 - 59.
         * @param  {Number} [second=0] - Second, 0 - 59.
         * @param  {Number} [millisecond=0] - Millisecond, 0 - 999.
         * @return {Number} - Returns the number of milliseconds since January 1, 1970, 00:00:00, or `NaN` if parsing fails.
         *
         * @example
         * _.utc(2000, 0, 1)
         * // → 946684800000
         *
         * _.utc(2000, 0, 1) === Date.UTC(2000, 0, 1)
         * // → true
         *
         * _.utc("2000-01-01")
         * // → 946684800000
         *
         * _.utc(946684800000)
         * // → 946684800000
         *
         * _.utc(new Date(2000, 0, 1))
         * // → 946684800000
         */
        _.utc = function(value, month, day, hour, minute, second, millisecond) {
            var date, isLocal = 1;
            var argCount = arguments.length;
            if (argCount === 0) {
                return new Date().getTime();
            } else if (argCount === 1) {
                if (!_.isDate(value)) {
                    date = new Date(value);
                    // @ts-ignore
                    if (!/\d\d:\d\d:\d\d/.test(value) || /Z$/.test(value) || /\d\d:\d\d:\d\d[\-+]([\d:]+)/.test(value)) {
                        // Strings with time components or ending with Z
                        // should be parsed by Date() as UTC.
                        isLocal = 0;
                    }
                } else {
                    date = value;
                }
            } else {
                // @ts-ignore
                date = new Date(value, month || 0, _.isUndefined(day) ? 1 : day, hour || 0, minute || 0, second || 0, millisecond || 0);
            }
            if (isLocal) {
                return date.getTime() - date.getTimezoneOffset() * 60000;
            }
            return date.getTime();
        };

        /**
         * Returns a string in simplified extended ISO format [(ISO 8601)](http://en.wikipedia.org/wiki/ISO_8601),
         * which is always 24 characters long: **YYYY-MM-DDTHH:mm:ss.sssZ**. The timezone is always zero UTC offset,
         * as denoted by the suffix "Z".
         *
         * This method uses {@link utils.utc} internally and accepts the same variety of arguments.
         *
         * @function utils#dateISOString
         * @returns {string | null} - Returns an ISO 8601 date string, or `null` if parsing fails.
         *
         * @example
         * _.dateISOString()
         * // → "2015-03-27T21:43:17.670Z"
         *
         * _.dateISOString(949305600000)
         * // → "2000-01-31T08:00:00.000Z"
         *
         * _.dateISOString("2000-01-01")
         * // → "2000-01-01T00:00:00.000Z"
         */
        _.dateISOString = function() {
            var timestamp = _.utc.apply(null, slice.call(arguments, 0));
            if (isNaN(timestamp)) {
                return null;
            }

            var date = new Date(timestamp);

            function pad(num) {
                return (num < 10) ? "0" + num : num;
            }

            return date.getUTCFullYear() +
                "-" + pad(date.getUTCMonth() + 1) +
                "-" + pad(date.getUTCDate()) +
                "T" + pad(date.getUTCHours()) +
                ":" + pad(date.getUTCMinutes()) +
                ":" + pad(date.getUTCSeconds()) +
                "." + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                "Z";
        };

        /**
         * Determine if `value` is empty, which holds true if it is:
         *
         * - falsy
         * - or, an empty array
         * - or, an object with no own enumarable properties
         *
         * @function utils#isEmpty
         * @param {*} value - The value to examine.
         * @returns {Boolean} - Returns `true` if the value is empty, else `false`.
         */
        _.isEmpty = function(value) {
            return !value ||
                (_.isArray(value) && value.length === 0) ||
                (_.isPlainObject(value) && !_.keys(value).length);
        };

        /**
         * Calculate the MD5 hash of a string.
         *
         * @function utils#md5
         * @param {String} value - The value to calculate the hash of.
         * @returns {String} - The calculated MD5 hash.
         */
        _.md5 = md5;

        /**
         * Determines if the target window is being executed inside a frame.
         *
         * @function utils#isInFrame
         * @param {Window} [w=window] - The target window.
         *   Defaults to the `window` the platform code is running in.
         * @return {Boolean}
         */
        _.isInFrame = function(w) {
            var result = true;
            try {
                w = w || window;
                result =
                    w.top === w ||
                    w.top === w.self ||
                    !w.frameElement;
            } catch (ex) {}
            return !result;
        };

        /**
         * @param {string | string[]} path
         * @returns {string[]}
         */
        function getPathArray(path) {
            if (typeof path === "string") {
                path = path.replace(/\[(["']?)([^\]]+)\1\]/g, ".$2").split(/\.+/);
            }
            return path;
        }

        /**
         * Checks if `path` is a direct property.
         *
         * @function utils#has
         * @param  {Object} object       - The object to query.
         * @param  {Array|String} path   - The path to check.
         * @return {Boolean} Returns `true` if `path` is a direct property, else `false`.
         *
         * @example
         * var object = { 'a': { 'b': { 'c': 3 } } };
         *
         * _.has(object, 'a');
         * // → true
         *
         * _.has(object, 'a.b.c');
         * // → true
         *
         * _.has(object, ['a', 'b', 'c']);
         * // → true
         */
        _.has = function(object, path) {
            return !_.isUndefined(_.get(object, path));
        };

        /**
         * Gets the property value at `path` of `object`. If the resolved value is
         * `undefined` the `defaultValue` is used in its place.
         *
         * @function utils#get
         * @param  {Object} object       - The object to query.
         * @param  {Array|String} path   - The path of the property to get.
         * @param  {*} [defaultValue]      - The value to return if the resolved value is `undefined`.
         * @return {*} Returns the resolved value.
         *
         * @example
         * var object = { 'a': [{ 'b': { 'c': 3 } }] };
         *
         * _.get(object, 'a[0].b.c');
         * // → 3
         *
         * _.get(object, ['a', '0', 'b', 'c']);
         * // → 3
         *
         * _.get(object, 'a.b.c', 'default');
         * // → 'default'
         */
        _.get = function(object, path, defaultValue) {
            var key;
            path = getPathArray(path);
            while (path.length) {
                var type = typeof object;
                if (!object || (type !== "object" && type !== "function")) {
                    object = defaultValue;
                    break;
                }
                key = path.shift();
                object = object[key];
            }
            return (typeof object === "undefined") ? defaultValue : object;
        };

        /**
         * Sets the property value of `path` on `object`. If a portion of `path` does not exist it’s created.
         *
         * @function utils#set
         * @param {Object} object        - The object to augment.
         * @param {Array|String} path    - The path of the property to set.
         * @param {*} value              - The value to set.
         * @return {*} Returns `object`.
         *
         * @example
         * var object = { 'a': [{ 'b': { 'c': 3 } }] };
         *
         *  _.set(object, 'a[0].b.c', 4);
         *  console.log(object.a[0].b.c);
         *  // → 4
         *
         *  _.set(object, 'x[0].y.z', 5);
         *  console.log(object.x[0].y.z);
         *  // → 5
         */
        _.set = function(object, path, value) {
            if (object && (typeof object === "object" || typeof object === "function")) {
                var ctx = object;
                var key;
                path = getPathArray(path);
                while (path.length) {
                    key = path.shift();
                    if (path.length) {
                        if (ctx[key] === null || typeof ctx[key] === "undefined") {
                            ctx[key] = /^\d+$/.test(path[0]) ? [] : {};
                        }
                        ctx = ctx[key];
                        if (typeof ctx !== "object" && typeof ctx !== "function") {
                            break;
                        }
                    } else {
                        ctx[key] = value;
                    }
                }
            }
            return object;
        };

        /**
         * Creates a group object with a `defer` method that wraps functions,
         * deferring their execution until `ready` is called.
         *
         * @example
         * var group = _.createDeferredGroup();
         * var print = group.defer(function (name) {
         *   console.log('Hello', name);
         * });
         * print('Hello'); // queued
         * print('World'); // queued
         * group.ready(); // executes queue
         * print('!'); // Prints '!' instantly
         */
        _.createDeferredGroup = function() {
            var group = {
                /** @type {Function[]} */
                queue: [],
                isReady: false,
                ready: function() {
                    group.isReady = true;
                    for (var i = 0, len = group.queue.length; i < len; i++) {
                        group.queue[i]();
                    }
                    group.queue = [];
                },
                defer: function(fn, name) {
                    return function deferredFn() {
                        var self = this;
                        var args = Array.prototype.slice.call(arguments);
                        if (group.isReady) {
                            fn.apply(self, args);
                        } else {
                            group.queue.push(function() {
                                fn.apply(self, args);
                            });
                        }
                    };
                }
            };
            return group;
        };

        /**
         * Deburrs string by converting Latin-1 Supplement and Latin Extended-A
         * letters to basic Latin letters and removing combining diacritical marks.
         *
         * Based on Lodash 4.17.10 <https://lodash.com/license>
         *
         * @function utils#deburr
         * @param {String} str
         * @return {String} Returns the deburred string.
         */
        _.deburr = (function() {
            var deburredLetters = {
                // Latin-1 Supplement block.
                '\xc0': 'A',
                '\xc1': 'A',
                '\xc2': 'A',
                '\xc3': 'A',
                '\xc4': 'A',
                '\xc5': 'A',
                '\xe0': 'a',
                '\xe1': 'a',
                '\xe2': 'a',
                '\xe3': 'a',
                '\xe4': 'a',
                '\xe5': 'a',
                '\xc7': 'C',
                '\xe7': 'c',
                '\xd0': 'D',
                '\xf0': 'd',
                '\xc8': 'E',
                '\xc9': 'E',
                '\xca': 'E',
                '\xcb': 'E',
                '\xe8': 'e',
                '\xe9': 'e',
                '\xea': 'e',
                '\xeb': 'e',
                '\xcc': 'I',
                '\xcd': 'I',
                '\xce': 'I',
                '\xcf': 'I',
                '\xec': 'i',
                '\xed': 'i',
                '\xee': 'i',
                '\xef': 'i',
                '\xd1': 'N',
                '\xf1': 'n',
                '\xd2': 'O',
                '\xd3': 'O',
                '\xd4': 'O',
                '\xd5': 'O',
                '\xd6': 'O',
                '\xd8': 'O',
                '\xf2': 'o',
                '\xf3': 'o',
                '\xf4': 'o',
                '\xf5': 'o',
                '\xf6': 'o',
                '\xf8': 'o',
                '\xd9': 'U',
                '\xda': 'U',
                '\xdb': 'U',
                '\xdc': 'U',
                '\xf9': 'u',
                '\xfa': 'u',
                '\xfb': 'u',
                '\xfc': 'u',
                '\xdd': 'Y',
                '\xfd': 'y',
                '\xff': 'y',
                '\xc6': 'Ae',
                '\xe6': 'ae',
                '\xde': 'Th',
                '\xfe': 'th',
                '\xdf': 'ss',
                // Latin Extended-A block.
                '\u0100': 'A',
                '\u0102': 'A',
                '\u0104': 'A',
                '\u0101': 'a',
                '\u0103': 'a',
                '\u0105': 'a',
                '\u0106': 'C',
                '\u0108': 'C',
                '\u010a': 'C',
                '\u010c': 'C',
                '\u0107': 'c',
                '\u0109': 'c',
                '\u010b': 'c',
                '\u010d': 'c',
                '\u010e': 'D',
                '\u0110': 'D',
                '\u010f': 'd',
                '\u0111': 'd',
                '\u0112': 'E',
                '\u0114': 'E',
                '\u0116': 'E',
                '\u0118': 'E',
                '\u011a': 'E',
                '\u0113': 'e',
                '\u0115': 'e',
                '\u0117': 'e',
                '\u0119': 'e',
                '\u011b': 'e',
                '\u011c': 'G',
                '\u011e': 'G',
                '\u0120': 'G',
                '\u0122': 'G',
                '\u011d': 'g',
                '\u011f': 'g',
                '\u0121': 'g',
                '\u0123': 'g',
                '\u0124': 'H',
                '\u0126': 'H',
                '\u0125': 'h',
                '\u0127': 'h',
                '\u0128': 'I',
                '\u012a': 'I',
                '\u012c': 'I',
                '\u012e': 'I',
                '\u0130': 'I',
                '\u0129': 'i',
                '\u012b': 'i',
                '\u012d': 'i',
                '\u012f': 'i',
                '\u0131': 'i',
                '\u0134': 'J',
                '\u0135': 'j',
                '\u0136': 'K',
                '\u0137': 'k',
                '\u0138': 'k',
                '\u0139': 'L',
                '\u013b': 'L',
                '\u013d': 'L',
                '\u013f': 'L',
                '\u0141': 'L',
                '\u013a': 'l',
                '\u013c': 'l',
                '\u013e': 'l',
                '\u0140': 'l',
                '\u0142': 'l',
                '\u0143': 'N',
                '\u0145': 'N',
                '\u0147': 'N',
                '\u014a': 'N',
                '\u0144': 'n',
                '\u0146': 'n',
                '\u0148': 'n',
                '\u014b': 'n',
                '\u014c': 'O',
                '\u014e': 'O',
                '\u0150': 'O',
                '\u014d': 'o',
                '\u014f': 'o',
                '\u0151': 'o',
                '\u0154': 'R',
                '\u0156': 'R',
                '\u0158': 'R',
                '\u0155': 'r',
                '\u0157': 'r',
                '\u0159': 'r',
                '\u015a': 'S',
                '\u015c': 'S',
                '\u015e': 'S',
                '\u0160': 'S',
                '\u015b': 's',
                '\u015d': 's',
                '\u015f': 's',
                '\u0161': 's',
                '\u0162': 'T',
                '\u0164': 'T',
                '\u0166': 'T',
                '\u0163': 't',
                '\u0165': 't',
                '\u0167': 't',
                '\u0168': 'U',
                '\u016a': 'U',
                '\u016c': 'U',
                '\u016e': 'U',
                '\u0170': 'U',
                '\u0172': 'U',
                '\u0169': 'u',
                '\u016b': 'u',
                '\u016d': 'u',
                '\u016f': 'u',
                '\u0171': 'u',
                '\u0173': 'u',
                '\u0174': 'W',
                '\u0175': 'w',
                '\u0176': 'Y',
                '\u0177': 'y',
                '\u0178': 'Y',
                '\u0179': 'Z',
                '\u017b': 'Z',
                '\u017d': 'Z',
                '\u017a': 'z',
                '\u017c': 'z',
                '\u017e': 'z',
                '\u0132': 'IJ',
                '\u0133': 'ij',
                '\u0152': 'Oe',
                '\u0153': 'oe',
                '\u0149': "'n",
                '\u017f': 's'
            };
            var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
            var reComboMark = /[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]/g;
            return function deburr(str) {
                return String(str).replace(reLatin, function(key) {
                    return deburredLetters[key];
                }).replace(reComboMark, '');
            };
        }());

        /**
         * Wraps a promise with a race against a timeout that will resolve another
         * value.
         * @template A
         * @template B
         * @param {Promise<A>} promise
         * @param {number} timeoutMs
         * @param {() => B} timeoutValueFn
         * @returns {Promise<A | B>}
         */
        _.promiseTimeout = function(promise, timeoutMs, timeoutValueFn) {
            return new Promise(function(resolve) {
                var timeout = setTimeout(function() {
                    resolve(timeoutValueFn());
                }, timeoutMs);
                promise.then(function(result) {
                    clearTimeout(timeout);
                    resolve(result);
                });
            });
        };

        /*
        var TRACKING_PARAM_CLEAN_MAP = {
          // Fanplayr streams
          fp_action: 1, // action
          fp_id: 1, // node id
          fp_src: 1, // source
          // Fanplayr link decoration
          fp_domain: 1, // domain
          fp_sk: 1, // session key
          // Google
          dclid: 1,
          gclid: 1,
          gclsrc: 1,
          // Other
          adtype: 1,
          creativeid: 1,
          fbclid: 1, // Facebook
          msclkid: 1, // Microsoft
          sourceid: 1,
          yclid: 1 // Yandex
        };
        // Includes all `utm_*` parameters
        var TRACKING_PARAM_CLEAN_RE = /^(utm_.+)$/;
        _.removeTrackingParams = function (urlStr) {
          if (urlStr) {
            var url = _.parseUrl(urlStr);
            for (var key in url.params) {
              if (TRACKING_PARAM_CLEAN_MAP[key] || TRACKING_PARAM_CLEAN_RE.test(key)) {
                delete url.params[key];
              }
            }
            return url.compile();
          }
          return urlStr;
        };
        */

        _.domReady = domReady;

        return _;
    });

    define('platform/emitter', ['require', 'platform/utils'], function(require) {
        var _ = require('platform/utils');
        var slice = Array.prototype.slice;

        var EventEmitter = {
            create: function(context) {
                var events = {};

                function getEventData(eventName) {
                    var data = events[eventName];
                    if (!data) {
                        data = events[eventName] = {
                            listeners: [],
                            lastArgs: null
                        };
                    }
                    return data;
                }

                function invokeListener(listener, args) {
                    // _.nextTick(function () {
                    listener.callback.apply(listener.context || context || null, args);
                    // }, "invoke: " + eventName);
                }

                /**
                 * Subscribes to an event.
                 * 
                 * @param {string} eventName
                 * @param {Platform.Emitter.ListenerOptions} options
                 * @param {Function} callback
                 * @returns {Function} A function to unsubscribe from the event.
                 * //**
                 * @param {string} eventName
                 * @param {Function} callback
                 */
                function on(eventName, options, callback) {
                    var eventData = getEventData(eventName);
                    if (_.isFunction(options)) {
                        callback = options;
                        options = {};
                    }

                    var listener = {
                        callback: callback,
                        context: options.context
                    };
                    eventData.listeners.push(listener);

                    var lastArgs = eventData.lastArgs;
                    if (options.init && lastArgs) {
                        setTimeout(function() {
                            invokeListener(listener, lastArgs);
                        }, 0);
                    }

                    return function() {
                        var index = _.indexOf(eventData.listeners, listener);
                        if (index >= 0) {
                            eventData.listeners.splice(index, 1);
                        }
                    };
                }

                /**
                 * Adds a one-time listener function for the event `eventName`.
                 * 
                 * @param {string} eventName
                 * @param {Platform.Emitter.ListenerOptions} options
                 * @param {Function} callback
                 * //**
                 * @param {string} eventName
                 * @param {Function} callback
                 */
                function once(eventName, options, callback) {
                    if (_.isFunction(options)) {
                        callback = options;
                        options = {};
                    }

                    var offFn = on(eventName, options, function() {
                        offFn();
                        callback.apply(this, slice.call(arguments));
                    });
                }

                /**
                 * Publishes an event.
                 *
                 * The last emitted arguments of each event type are kept internally for future listeners who
                 * subscribe to events using `options.init`. See {@link EventEmitter#on}.
                 *
                 * @memberof EventEmitter#
                 * @function emit
                 * @param {String} event - The name of the event.
                 * @param {Array<*>} args
                 * @param {Function} [callback] - Invoked after all listeners have been called.
                 *
                 * @example
                 * ee.emit("event-name", ["arg1", "arg2"], function () {
                 *   // All listener callbacks have been invoked.
                 * });
                 */
                function emit(eventName, args, callback) {
                    if (_.isFunction(args)) {
                        callback = args;
                        args = [];
                    } else if (arguments.length < 2 || !_.isArray(args)) {
                        args = [];
                    }

                    // // setTimeout(function () {
                    // _.nextTick(function() {
                    //   var eventData = getEventData(eventName);
                    //   eventData.lastArgs = args;
                    //   _.each(eventData.listeners, function ( listener ) {
                    //     invokeListener(listener, args);
                    //   });

                    //   if ( callback ) {
                    //     callback();
                    //   }
                    // }, "emit: " + eventName);
                    // // }, 0);

                    var eventData = getEventData(eventName);
                    eventData.lastArgs = args;

                    _.each(eventData.listeners, function(listener) {
                        setTimeout(function() {
                            invokeListener(listener, args);
                        }, 0);
                    });

                    setTimeout(function() {
                        if (callback) {
                            callback();
                        }
                    }, 0);
                }

                return {
                    on: on,
                    once: once,
                    emit: emit
                };
            },

            /**
             * Creates a new event emitter and attaches its methods to the `target` object.
             *
             * @memberof EventEmitter
             * @function mixin
             * @param {Object} target - The target object to add event emitter methods to.
             * @returns {Object} - The `target` object.
             *
             * @example
             * var service = {};
             * EventEmitter.mixin(service);
             * // service now has .on(), .once() and .emit() methods.
             */
            mixin: function(target, context) {
                var ee = EventEmitter.create(context);
                target.on = ee.on;
                target.once = ee.once;
                target.emit = ee.emit;
                return target;
            }
        };

        return EventEmitter;
    });

    define('platform/json', [], function() {
        // 2019-05-02: Hack to work around a developer who stupidly defined a toJSON
        // method on the Array prototype which causes all arrays to be double
        // stringified on <https://eshop.vodafone.it/checkout/cart/>.
        var JSON = window.JSON;
        if (JSON) {
            var arrayProto = Array.prototype;
            if (arrayProto.toJSON) {
                return {
                    stringify: function() {
                        var temp = arrayProto.toJSON;
                        arrayProto.toJSON = undefined;
                        var result = JSON.stringify.apply(JSON, arguments);
                        arrayProto.toJSON = temp;
                        return result;
                    },
                    parse: function() {
                        return JSON.parse.apply(JSON, arguments);
                    }
                };
            }
        }
        return JSON;
        // return window.JSON;
    });

    /*!
     * jQuery JavaScript Library v1.11.1
     * http://jquery.com/
     *
     * Includes Sizzle.js
     * http://sizzlejs.com/
     *
     * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2014-05-01T17:42Z
     */

    (function(global, factory) {

        define('platform/vendor/jquery-1.11.1', [], function() {
            // return factory(global, true);
            var $ = factory(global, true);
            $.factory = factory;
            return $;
        });

        /*if ( typeof module === "object" && typeof module.exports === "object" ) {
        	// For CommonJS and CommonJS-like environments where a proper window is present,
        	// execute the factory and get jQuery
        	// For environments that do not inherently posses a window with a document
        	// (such as Node.js), expose a jQuery-making factory as module.exports
        	// This accentuates the need for the creation of a real window
        	// e.g. var jQuery = require("jquery")(window);
        	// See ticket #14549 for more info
        	module.exports = global.document ?
        		factory( global, true ) :
        		function( w ) {
        			if ( !w.document ) {
        				throw new Error( "jQuery requires a window with a document" );
        			}
        			return factory( w );
        		};
        } else {
        	factory( global );
        }*/

        // Pass this if window is not defined yet
    }(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

        // Can't do this because several apps including ASP.NET trace
        // the stack via arguments.caller.callee and Firefox dies if
        // you try to trace through "use strict" call chains. (#13335)
        // Support: Firefox 18+
        //

        var deletedIds = [];

        var slice = deletedIds.slice;

        var concat = deletedIds.concat;

        var push = deletedIds.push;

        var indexOf = deletedIds.indexOf;

        var class2type = {};

        var toString = class2type.toString;

        var hasOwn = class2type.hasOwnProperty;

        var support = {};



        var
            version = "1.11.1",

            // Define a local copy of jQuery
            jQuery = function(selector, context) {
                // The jQuery object is actually just the init constructor 'enhanced'
                // Need init if jQuery is called (just allow error to be thrown if not included)
                return new jQuery.fn.init(selector, context);
            },

            // Support: Android<4.1, IE<9
            // Make sure we trim BOM and NBSP
            rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

            // Matches dashed string for camelizing
            rmsPrefix = /^-ms-/,
            rdashAlpha = /-([\da-z])/gi,

            // Used by jQuery.camelCase as callback to replace()
            fcamelCase = function(all, letter) {
                return letter.toUpperCase();
            };

        jQuery.fn = jQuery.prototype = {
            // The current version of jQuery being used
            jquery: version,

            constructor: jQuery,

            // Start with an empty selector
            selector: "",

            // The default length of a jQuery object is 0
            length: 0,

            toArray: function() {
                return slice.call(this);
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function(num) {
                return num != null ?

                    // Return just the one element from the set
                    (num < 0 ? this[num + this.length] : this[num]) :

                    // Return all the elements in a clean array
                    slice.call(this);
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function(elems) {

                // Build a new jQuery matched element set
                var ret = jQuery.merge(this.constructor(), elems);

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;
                ret.context = this.context;

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function(callback, args) {
                return jQuery.each(this, callback, args);
            },

            map: function(callback) {
                return this.pushStack(jQuery.map(this, function(elem, i) {
                    return callback.call(elem, i, elem);
                }));
            },

            slice: function() {
                return this.pushStack(slice.apply(this, arguments));
            },

            first: function() {
                return this.eq(0);
            },

            last: function() {
                return this.eq(-1);
            },

            eq: function(i) {
                var len = this.length,
                    j = +i + (i < 0 ? len : 0);
                return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
            },

            end: function() {
                return this.prevObject || this.constructor(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: deletedIds.sort,
            splice: deletedIds.splice
        };

        jQuery.extend = jQuery.fn.extend = function() {
            var src, copyIsArray, copy, name, options, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !jQuery.isFunction(target)) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = jQuery.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        jQuery.extend({
            // Unique for each copy of jQuery on the page
            expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

            // Assume jQuery is ready without the ready module
            isReady: true,

            error: function(msg) {
                throw new Error(msg);
            },

            noop: function() {},

            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function(obj) {
                return jQuery.type(obj) === "function";
            },

            isArray: Array.isArray || function(obj) {
                return jQuery.type(obj) === "array";
            },

            isWindow: function(obj) {
                /* jshint eqeqeq: false */
                return obj != null && obj == obj.window;
            },

            isNumeric: function(obj) {
                // parseFloat NaNs numeric-cast false positives (null|true|false|"")
                // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
                // subtraction forces infinities to NaN
                return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0;
            },

            isEmptyObject: function(obj) {
                var name;
                for (name in obj) {
                    return false;
                }
                return true;
            },

            isPlainObject: function(obj) {
                var key;

                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                    return false;
                }

                try {
                    // Not own constructor property must be Object
                    if (obj.constructor &&
                        !hasOwn.call(obj, "constructor") &&
                        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    }
                } catch (e) {
                    // IE8,9 Will throw exceptions on certain host objects #9897
                    return false;
                }

                // Support: IE<9
                // Handle iteration over inherited properties before own properties.
                if (support.ownLast) {
                    for (key in obj) {
                        return hasOwn.call(obj, key);
                    }
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.
                for (key in obj) {}

                return key === undefined || hasOwn.call(obj, key);
            },

            type: function(obj) {
                if (obj == null) {
                    return obj + "";
                }
                return typeof obj === "object" || typeof obj === "function" ?
                    class2type[toString.call(obj)] || "object" :
                    typeof obj;
            },

            // Evaluates a script in a global context
            // Workarounds based on findings by Jim Driscoll
            // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            globalEval: function(data) {
                if (data && jQuery.trim(data)) {
                    // We use execScript on Internet Explorer
                    // We use an anonymous function so that context is window
                    // rather than jQuery in Firefox
                    (window.execScript || function(data) {
                        window["eval"].call(window, data);
                    })(data);
                }
            },

            // Convert dashed to camelCase; used by the css and data modules
            // Microsoft forgot to hump their vendor prefix (#9572)
            camelCase: function(string) {
                return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
            },

            nodeName: function(elem, name) {
                return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
            },

            // args is for internal usage only
            each: function(obj, callback, args) {
                var value,
                    i = 0,
                    length = obj.length,
                    isArray = isArraylike(obj);

                if (args) {
                    if (isArray) {
                        for (; i < length; i++) {
                            value = callback.apply(obj[i], args);

                            if (value === false) {
                                break;
                            }
                        }
                    } else {
                        for (i in obj) {
                            value = callback.apply(obj[i], args);

                            if (value === false) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if (isArray) {
                        for (; i < length; i++) {
                            value = callback.call(obj[i], i, obj[i]);

                            if (value === false) {
                                break;
                            }
                        }
                    } else {
                        for (i in obj) {
                            value = callback.call(obj[i], i, obj[i]);

                            if (value === false) {
                                break;
                            }
                        }
                    }
                }

                return obj;
            },

            // Support: Android<4.1, IE<9
            trim: function(text) {
                return text == null ?
                    "" :
                    (text + "").replace(rtrim, "");
            },

            // results is for internal usage only
            makeArray: function(arr, results) {
                var ret = results || [];

                if (arr != null) {
                    if (isArraylike(Object(arr))) {
                        jQuery.merge(ret,
                            typeof arr === "string" ? [arr] : arr
                        );
                    } else {
                        push.call(ret, arr);
                    }
                }

                return ret;
            },

            inArray: function(elem, arr, i) {
                var len;

                if (arr) {
                    if (indexOf) {
                        return indexOf.call(arr, elem, i);
                    }

                    len = arr.length;
                    i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                    for (; i < len; i++) {
                        // Skip accessing in sparse arrays
                        if (i in arr && arr[i] === elem) {
                            return i;
                        }
                    }
                }

                return -1;
            },

            merge: function(first, second) {
                var len = +second.length,
                    j = 0,
                    i = first.length;

                while (j < len) {
                    first[i++] = second[j++];
                }

                // Support: IE<9
                // Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
                if (len !== len) {
                    while (second[j] !== undefined) {
                        first[i++] = second[j++];
                    }
                }

                first.length = i;

                return first;
            },

            grep: function(elems, callback, invert) {
                var callbackInverse,
                    matches = [],
                    i = 0,
                    length = elems.length,
                    callbackExpect = !invert;

                // Go through the array, only saving the items
                // that pass the validator function
                for (; i < length; i++) {
                    callbackInverse = !callback(elems[i], i);
                    if (callbackInverse !== callbackExpect) {
                        matches.push(elems[i]);
                    }
                }

                return matches;
            },

            // arg is for internal usage only
            map: function(elems, callback, arg) {
                var value,
                    i = 0,
                    length = elems.length,
                    isArray = isArraylike(elems),
                    ret = [];

                // Go through the array, translating each of the items to their new values
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback(elems[i], i, arg);

                        if (value != null) {
                            ret.push(value);
                        }
                    }

                    // Go through every key on the object,
                } else {
                    for (i in elems) {
                        value = callback(elems[i], i, arg);

                        if (value != null) {
                            ret.push(value);
                        }
                    }
                }

                // Flatten any nested arrays
                return concat.apply([], ret);
            },

            // A global GUID counter for objects
            guid: 1,

            // Bind a function to a context, optionally partially applying any
            // arguments.
            proxy: function(fn, context) {
                var args, proxy, tmp;

                if (typeof context === "string") {
                    tmp = fn[context];
                    context = fn;
                    fn = tmp;
                }

                // Quick check to determine if target is callable, in the spec
                // this throws a TypeError, but we will just return undefined.
                if (!jQuery.isFunction(fn)) {
                    return undefined;
                }

                // Simulated bind
                args = slice.call(arguments, 2);
                proxy = function() {
                    return fn.apply(context || this, args.concat(slice.call(arguments)));
                };

                // Set the guid of unique handler to the same of original handler, so it can be removed
                proxy.guid = fn.guid = fn.guid || jQuery.guid++;

                return proxy;
            },

            now: function() {
                return +(new Date());
            },

            // jQuery.support is not used in Core but other projects attach their
            // properties to it so it needs to exist.
            support: support
        });

        // Populate the class2type map
        jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        function isArraylike(obj) {
            var length = obj.length,
                type = jQuery.type(obj);

            if (type === "function" || jQuery.isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        }
        var Sizzle =
            /*!
             * Sizzle CSS Selector Engine v1.10.19
             * http://sizzlejs.com/
             *
             * Copyright 2013 jQuery Foundation, Inc. and other contributors
             * Released under the MIT license
             * http://jquery.org/license
             *
             * Date: 2014-04-18
             */
            (function(window) {

                var i,
                    support,
                    Expr,
                    getText,
                    isXML,
                    tokenize,
                    compile,
                    select,
                    outermostContext,
                    sortInput,
                    hasDuplicate,

                    // Local document vars
                    setDocument,
                    document,
                    docElem,
                    documentIsHTML,
                    rbuggyQSA,
                    rbuggyMatches,
                    matches,
                    contains,

                    // Instance-specific data
                    expando = "sizzle" + -(new Date()),
                    preferredDoc = window.document,
                    dirruns = 0,
                    done = 0,
                    classCache = createCache(),
                    tokenCache = createCache(),
                    compilerCache = createCache(),
                    sortOrder = function(a, b) {
                        if (a === b) {
                            hasDuplicate = true;
                        }
                        return 0;
                    },

                    // General-purpose constants
                    strundefined = typeof undefined,
                    MAX_NEGATIVE = 1 << 31,

                    // Instance methods
                    hasOwn = ({}).hasOwnProperty,
                    arr = [],
                    pop = arr.pop,
                    push_native = arr.push,
                    push = arr.push,
                    slice = arr.slice,
                    // Use a stripped-down indexOf if we can't use a native one
                    indexOf = arr.indexOf || function(elem) {
                        var i = 0,
                            len = this.length;
                        for (; i < len; i++) {
                            if (this[i] === elem) {
                                return i;
                            }
                        }
                        return -1;
                    },

                    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

                    // Regular expressions

                    // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
                    whitespace = "[\\x20\\t\\r\\n\\f]",
                    // http://www.w3.org/TR/css3-syntax/#characters
                    characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

                    // Loosely modeled on CSS identifier characters
                    // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
                    // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
                    identifier = characterEncoding.replace("w", "w#"),

                    // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
                    attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
                    // Operator (capture 2)
                    "*([*^$|!~]?=)" + whitespace +
                    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                    "*\\]",

                    pseudos = ":(" + characterEncoding + ")(?:\\((" +
                    // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                    // 1. quoted (capture 3; capture 4 or capture 5)
                    "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                    // 2. simple (capture 6)
                    "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                    // 3. anything else (capture 2)
                    ".*" +
                    ")\\)|)",

                    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
                    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

                    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
                    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

                    rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

                    rpseudo = new RegExp(pseudos),
                    ridentifier = new RegExp("^" + identifier + "$"),

                    matchExpr = {
                        "ID": new RegExp("^#(" + characterEncoding + ")"),
                        "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
                        "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
                        "ATTR": new RegExp("^" + attributes),
                        "PSEUDO": new RegExp("^" + pseudos),
                        "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                            "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                            "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
                        "bool": new RegExp("^(?:" + booleans + ")$", "i"),
                        // For use in libraries implementing .is()
                        // We use this for POS matching in `select`
                        "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                            whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
                    },

                    rinputs = /^(?:input|select|textarea|button)$/i,
                    rheader = /^h\d$/i,

                    rnative = /^[^{]+\{\s*\[native \w/,

                    // Easily-parseable/retrievable ID or TAG or CLASS selectors
                    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

                    rsibling = /[+~]/,
                    rescape = /'|\\/g,

                    // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
                    runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
                    funescape = function(_, escaped, escapedWhitespace) {
                        var high = "0x" + escaped - 0x10000;
                        // NaN means non-codepoint
                        // Support: Firefox<24
                        // Workaround erroneous numeric interpretation of +"0x"
                        return high !== high || escapedWhitespace ?
                            escaped :
                            high < 0 ?
                            // BMP codepoint
                            String.fromCharCode(high + 0x10000) :
                            // Supplemental Plane codepoint (surrogate pair)
                            String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
                    };

                // Optimize for push.apply( _, NodeList )
                try {
                    push.apply(
                        (arr = slice.call(preferredDoc.childNodes)),
                        preferredDoc.childNodes
                    );
                    // Support: Android<4.0
                    // Detect silently failing push.apply
                    arr[preferredDoc.childNodes.length].nodeType;
                } catch (e) {
                    push = {
                        apply: arr.length ?

                            // Leverage slice if possible
                            function(target, els) {
                                push_native.apply(target, slice.call(els));
                            } :

                            // Support: IE<9
                            // Otherwise append directly
                            function(target, els) {
                                var j = target.length,
                                    i = 0;
                                // Can't trust NodeList.length
                                while ((target[j++] = els[i++])) {}
                                target.length = j - 1;
                            }
                    };
                }

                function Sizzle(selector, context, results, seed) {
                    var match, elem, m, nodeType,
                        // QSA vars
                        i, groups, old, nid, newContext, newSelector;

                    if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                        setDocument(context);
                    }

                    context = context || document;
                    results = results || [];

                    if (!selector || typeof selector !== "string") {
                        return results;
                    }

                    if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                        return [];
                    }

                    if (documentIsHTML && !seed) {

                        // Shortcuts
                        if ((match = rquickExpr.exec(selector))) {
                            // Speed-up: Sizzle("#ID")
                            if ((m = match[1])) {
                                if (nodeType === 9) {
                                    elem = context.getElementById(m);
                                    // Check parentNode to catch when Blackberry 4.6 returns
                                    // nodes that are no longer in the document (jQuery #6963)
                                    if (elem && elem.parentNode) {
                                        // Handle the case where IE, Opera, and Webkit return items
                                        // by name instead of ID
                                        if (elem.id === m) {
                                            results.push(elem);
                                            return results;
                                        }
                                    } else {
                                        return results;
                                    }
                                } else {
                                    // Context is not a document
                                    if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                                        contains(context, elem) && elem.id === m) {
                                        results.push(elem);
                                        return results;
                                    }
                                }

                                // Speed-up: Sizzle("TAG")
                            } else if (match[2]) {
                                push.apply(results, context.getElementsByTagName(selector));
                                return results;

                                // Speed-up: Sizzle(".CLASS")
                            } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                                push.apply(results, context.getElementsByClassName(m));
                                return results;
                            }
                        }

                        // QSA path
                        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                            nid = old = expando;
                            newContext = context;
                            newSelector = nodeType === 9 && selector;

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                            if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                                groups = tokenize(selector);

                                if ((old = context.getAttribute("id"))) {
                                    nid = old.replace(rescape, "\\$&");
                                } else {
                                    context.setAttribute("id", nid);
                                }
                                nid = "[id='" + nid + "'] ";

                                i = groups.length;
                                while (i--) {
                                    groups[i] = nid + toSelector(groups[i]);
                                }
                                newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                                newSelector = groups.join(",");
                            }

                            if (newSelector) {
                                try {
                                    push.apply(results,
                                        newContext.querySelectorAll(newSelector)
                                    );
                                    return results;
                                } catch (qsaError) {} finally {
                                    if (!old) {
                                        context.removeAttribute("id");
                                    }
                                }
                            }
                        }
                    }

                    // All others
                    return select(selector.replace(rtrim, "$1"), context, results, seed);
                }

                /**
                 * Create key-value caches of limited size
                 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
                 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
                 *	deleting the oldest entry
                 */
                function createCache() {
                    var keys = [];

                    function cache(key, value) {
                        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                        if (keys.push(key + " ") > Expr.cacheLength) {
                            // Only keep the most recent entries
                            delete cache[keys.shift()];
                        }
                        return (cache[key + " "] = value);
                    }
                    return cache;
                }

                /**
                 * Mark a function for special use by Sizzle
                 * @param {Function} fn The function to mark
                 */
                function markFunction(fn) {
                    fn[expando] = true;
                    return fn;
                }

                /**
                 * Support testing using an element
                 * @param {Function} fn Passed the created div and expects a boolean result
                 */
                function assert(fn) {
                    var div = document.createElement("div");

                    try {
                        return !!fn(div);
                    } catch (e) {
                        return false;
                    } finally {
                        // Remove from its parent by default
                        if (div.parentNode) {
                            div.parentNode.removeChild(div);
                        }
                        // release memory in IE
                        div = null;
                    }
                }

                /**
                 * Adds the same handler for all of the specified attrs
                 * @param {String} attrs Pipe-separated list of attributes
                 * @param {Function} handler The method that will be applied
                 */
                function addHandle(attrs, handler) {
                    var arr = attrs.split("|"),
                        i = attrs.length;

                    while (i--) {
                        Expr.attrHandle[arr[i]] = handler;
                    }
                }

                /**
                 * Checks document order of two siblings
                 * @param {Element} a
                 * @param {Element} b
                 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
                 */
                function siblingCheck(a, b) {
                    var cur = b && a,
                        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                        (~b.sourceIndex || MAX_NEGATIVE) -
                        (~a.sourceIndex || MAX_NEGATIVE);

                    // Use IE sourceIndex if available on both nodes
                    if (diff) {
                        return diff;
                    }

                    // Check if b follows a
                    if (cur) {
                        while ((cur = cur.nextSibling)) {
                            if (cur === b) {
                                return -1;
                            }
                        }
                    }

                    return a ? 1 : -1;
                }

                /**
                 * Returns a function to use in pseudos for input types
                 * @param {String} type
                 */
                function createInputPseudo(type) {
                    return function(elem) {
                        var name = elem.nodeName.toLowerCase();
                        return name === "input" && elem.type === type;
                    };
                }

                /**
                 * Returns a function to use in pseudos for buttons
                 * @param {String} type
                 */
                function createButtonPseudo(type) {
                    return function(elem) {
                        var name = elem.nodeName.toLowerCase();
                        return (name === "input" || name === "button") && elem.type === type;
                    };
                }

                /**
                 * Returns a function to use in pseudos for positionals
                 * @param {Function} fn
                 */
                function createPositionalPseudo(fn) {
                    return markFunction(function(argument) {
                        argument = +argument;
                        return markFunction(function(seed, matches) {
                            var j,
                                matchIndexes = fn([], seed.length, argument),
                                i = matchIndexes.length;

                            // Match elements found at the specified indexes
                            while (i--) {
                                if (seed[(j = matchIndexes[i])]) {
                                    seed[j] = !(matches[j] = seed[j]);
                                }
                            }
                        });
                    });
                }

                /**
                 * Checks a node for validity as a Sizzle context
                 * @param {Element|Object=} context
                 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
                 */
                function testContext(context) {
                    return context && typeof context.getElementsByTagName !== strundefined && context;
                }

                // Expose support vars for convenience
                support = Sizzle.support = {};

                /**
                 * Detects XML nodes
                 * @param {Element|Object} elem An element or a document
                 * @returns {Boolean} True iff elem is a non-HTML XML node
                 */
                isXML = Sizzle.isXML = function(elem) {
                    // documentElement is verified for cases where it doesn't yet exist
                    // (such as loading iframes in IE - #4833)
                    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
                    return documentElement ? documentElement.nodeName !== "HTML" : false;
                };

                /**
                 * Sets document-related variables once based on the current document
                 * @param {Element|Object} [doc] An element or document object to use to set the document
                 * @returns {Object} Returns the current document
                 */
                setDocument = Sizzle.setDocument = function(node) {
                    var hasCompare,
                        doc = node ? node.ownerDocument || node : preferredDoc,
                        parent = doc.defaultView;

                    // If no document and documentElement is available, return
                    if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                        return document;
                    }

                    // Set our document
                    document = doc;
                    docElem = doc.documentElement;

                    // Support tests
                    documentIsHTML = !isXML(doc);

                    // Support: IE>8
                    // If iframe document is assigned to "document" variable and if iframe has been reloaded,
                    // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
                    // IE6-8 do not support the defaultView property so parent will be undefined
                    if (parent && parent !== parent.top) {
                        // IE11 does not have attachEvent, so all must suffer
                        if (parent.addEventListener) {
                            parent.addEventListener("unload", function() {
                                setDocument();
                            }, false);
                        } else if (parent.attachEvent) {
                            parent.attachEvent("onunload", function() {
                                setDocument();
                            });
                        }
                    }

                    /* Attributes
                    ---------------------------------------------------------------------- */

                    // Support: IE<8
                    // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
                    support.attributes = assert(function(div) {
                        div.className = "i";
                        return !div.getAttribute("className");
                    });

                    /* getElement(s)By*
                    ---------------------------------------------------------------------- */

                    // Check if getElementsByTagName("*") returns only elements
                    support.getElementsByTagName = assert(function(div) {
                        div.appendChild(doc.createComment(""));
                        return !div.getElementsByTagName("*").length;
                    });

                    // Check if getElementsByClassName can be trusted
                    support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function(div) {
                        div.innerHTML = "<div class='a'></div><div class='a i'></div>";

                        // Support: Safari<4
                        // Catch class over-caching
                        div.firstChild.className = "i";
                        // Support: Opera<10
                        // Catch gEBCN failure to find non-leading classes
                        return div.getElementsByClassName("i").length === 2;
                    });

                    // Support: IE<10
                    // Check if getElementById returns elements by name
                    // The broken getElementById methods don't pick up programatically-set names,
                    // so use a roundabout getElementsByName test
                    support.getById = assert(function(div) {
                        docElem.appendChild(div).id = expando;
                        return !doc.getElementsByName || !doc.getElementsByName(expando).length;
                    });

                    // ID find and filter
                    if (support.getById) {
                        Expr.find["ID"] = function(id, context) {
                            if (typeof context.getElementById !== strundefined && documentIsHTML) {
                                var m = context.getElementById(id);
                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document #6963
                                return m && m.parentNode ? [m] : [];
                            }
                        };
                        Expr.filter["ID"] = function(id) {
                            var attrId = id.replace(runescape, funescape);
                            return function(elem) {
                                return elem.getAttribute("id") === attrId;
                            };
                        };
                    } else {
                        // Support: IE6/7
                        // getElementById is not reliable as a find shortcut
                        delete Expr.find["ID"];

                        Expr.filter["ID"] = function(id) {
                            var attrId = id.replace(runescape, funescape);
                            return function(elem) {
                                var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                                return node && node.value === attrId;
                            };
                        };
                    }

                    // Tag
                    Expr.find["TAG"] = support.getElementsByTagName ?
                        function(tag, context) {
                            if (typeof context.getElementsByTagName !== strundefined) {
                                return context.getElementsByTagName(tag);
                            }
                        } :
                        function(tag, context) {
                            var elem,
                                tmp = [],
                                i = 0,
                                results = context.getElementsByTagName(tag);

                            // Filter out possible comments
                            if (tag === "*") {
                                while ((elem = results[i++])) {
                                    if (elem.nodeType === 1) {
                                        tmp.push(elem);
                                    }
                                }

                                return tmp;
                            }
                            return results;
                        };

                    // Class
                    Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
                        if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                            return context.getElementsByClassName(className);
                        }
                    };

                    /* QSA/matchesSelector
                    ---------------------------------------------------------------------- */

                    // QSA and matchesSelector support

                    // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                    rbuggyMatches = [];

                    // qSa(:focus) reports false when true (Chrome 21)
                    // We allow this because of a bug in IE8/9 that throws an error
                    // whenever `document.activeElement` is accessed on an iframe
                    // So, we allow :focus to pass through QSA all the time to avoid the IE error
                    // See http://bugs.jquery.com/ticket/13378
                    rbuggyQSA = [];

                    if ((support.qsa = rnative.test(doc.querySelectorAll))) {
                        // Build QSA regex
                        // Regex strategy adopted from Diego Perini
                        assert(function(div) {
                            // Select is set to empty string on purpose
                            // This is to test IE's treatment of not explicitly
                            // setting a boolean content attribute,
                            // since its presence should be enough
                            // http://bugs.jquery.com/ticket/12359
                            div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

                            // Support: IE8, Opera 11-12.16
                            // Nothing should be selected when empty strings follow ^= or $= or *=
                            // The test attribute must be unknown in Opera but "safe" for WinRT
                            // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                            if (div.querySelectorAll("[msallowclip^='']").length) {
                                rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                            }

                            // Support: IE8
                            // Boolean attributes and "value" are not treated correctly
                            if (!div.querySelectorAll("[selected]").length) {
                                rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                            }

                            // Webkit/Opera - :checked should return selected option elements
                            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                            // IE8 throws error here and will not see later tests
                            if (!div.querySelectorAll(":checked").length) {
                                rbuggyQSA.push(":checked");
                            }
                        });

                        assert(function(div) {
                            // Support: Windows 8 Native Apps
                            // The type and name attributes are restricted during .innerHTML assignment
                            var input = doc.createElement("input");
                            input.setAttribute("type", "hidden");
                            div.appendChild(input).setAttribute("name", "D");

                            // Support: IE8
                            // Enforce case-sensitivity of name attribute
                            if (div.querySelectorAll("[name=d]").length) {
                                rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                            }

                            // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                            // IE8 throws error here and will not see later tests
                            if (!div.querySelectorAll(":enabled").length) {
                                rbuggyQSA.push(":enabled", ":disabled");
                            }

                            // Opera 10-11 does not throw on post-comma invalid pseudos
                            div.querySelectorAll("*,:x");
                            rbuggyQSA.push(",.*:");
                        });
                    }

                    if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
                            docElem.webkitMatchesSelector ||
                            docElem.mozMatchesSelector ||
                            docElem.oMatchesSelector ||
                            docElem.msMatchesSelector)))) {

                        assert(function(div) {
                            // Check to see if it's possible to do matchesSelector
                            // on a disconnected node (IE 9)
                            support.disconnectedMatch = matches.call(div, "div");

                            // This should fail with an exception
                            // Gecko does not error, returns false instead
                            matches.call(div, "[s!='']:x");
                            rbuggyMatches.push("!=", pseudos);
                        });
                    }

                    rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
                    rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

                    /* Contains
                    ---------------------------------------------------------------------- */
                    hasCompare = rnative.test(docElem.compareDocumentPosition);

                    // Element contains another
                    // Purposefully does not implement inclusive descendent
                    // As in, an element does not contain itself
                    contains = hasCompare || rnative.test(docElem.contains) ?
                        function(a, b) {
                            var adown = a.nodeType === 9 ? a.documentElement : a,
                                bup = b && b.parentNode;
                            return a === bup || !!(bup && bup.nodeType === 1 && (
                                adown.contains ?
                                adown.contains(bup) :
                                a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                            ));
                        } :
                        function(a, b) {
                            if (b) {
                                while ((b = b.parentNode)) {
                                    if (b === a) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                    /* Sorting
                    ---------------------------------------------------------------------- */

                    // Document order sorting
                    sortOrder = hasCompare ?
                        function(a, b) {

                            // Flag for duplicate removal
                            if (a === b) {
                                hasDuplicate = true;
                                return 0;
                            }

                            // Sort on method existence if only one input has compareDocumentPosition
                            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                            if (compare) {
                                return compare;
                            }

                            // Calculate position if both inputs belong to the same document
                            compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
                                a.compareDocumentPosition(b) :

                                // Otherwise we know they are disconnected
                                1;

                            // Disconnected nodes
                            if (compare & 1 ||
                                (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

                                // Choose the first element that is related to our preferred document
                                if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                                    return -1;
                                }
                                if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                                    return 1;
                                }

                                // Maintain original order
                                return sortInput ?
                                    (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
                                    0;
                            }

                            return compare & 4 ? -1 : 1;
                        } :
                        function(a, b) {
                            // Exit early if the nodes are identical
                            if (a === b) {
                                hasDuplicate = true;
                                return 0;
                            }

                            var cur,
                                i = 0,
                                aup = a.parentNode,
                                bup = b.parentNode,
                                ap = [a],
                                bp = [b];

                            // Parentless nodes are either documents or disconnected
                            if (!aup || !bup) {
                                return a === doc ? -1 :
                                    b === doc ? 1 :
                                    aup ? -1 :
                                    bup ? 1 :
                                    sortInput ?
                                    (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
                                    0;

                                // If the nodes are siblings, we can do a quick check
                            } else if (aup === bup) {
                                return siblingCheck(a, b);
                            }

                            // Otherwise we need full lists of their ancestors for comparison
                            cur = a;
                            while ((cur = cur.parentNode)) {
                                ap.unshift(cur);
                            }
                            cur = b;
                            while ((cur = cur.parentNode)) {
                                bp.unshift(cur);
                            }

                            // Walk down the tree looking for a discrepancy
                            while (ap[i] === bp[i]) {
                                i++;
                            }

                            return i ?
                                // Do a sibling check if the nodes have a common ancestor
                                siblingCheck(ap[i], bp[i]) :

                                // Otherwise nodes in our document sort first
                                ap[i] === preferredDoc ? -1 :
                                bp[i] === preferredDoc ? 1 :
                                0;
                        };

                    return doc;
                };

                Sizzle.matches = function(expr, elements) {
                    return Sizzle(expr, null, null, elements);
                };

                Sizzle.matchesSelector = function(elem, expr) {
                    // Set document vars if needed
                    if ((elem.ownerDocument || elem) !== document) {
                        setDocument(elem);
                    }

                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(rattributeQuotes, "='$1']");

                    if (support.matchesSelector && documentIsHTML &&
                        (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
                        (!rbuggyQSA || !rbuggyQSA.test(expr))) {

                        try {
                            var ret = matches.call(elem, expr);

                            // IE 9's matchesSelector returns false on disconnected nodes
                            if (ret || support.disconnectedMatch ||
                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9
                                elem.document && elem.document.nodeType !== 11) {
                                return ret;
                            }
                        } catch (e) {}
                    }

                    return Sizzle(expr, document, null, [elem]).length > 0;
                };

                Sizzle.contains = function(context, elem) {
                    // Set document vars if needed
                    if ((context.ownerDocument || context) !== document) {
                        setDocument(context);
                    }
                    return contains(context, elem);
                };

                Sizzle.attr = function(elem, name) {
                    // Set document vars if needed
                    if ((elem.ownerDocument || elem) !== document) {
                        setDocument(elem);
                    }

                    var fn = Expr.attrHandle[name.toLowerCase()],
                        // Don't get fooled by Object.prototype properties (jQuery #13807)
                        val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
                        fn(elem, name, !documentIsHTML) :
                        undefined;

                    return val !== undefined ?
                        val :
                        support.attributes || !documentIsHTML ?
                        elem.getAttribute(name) :
                        (val = elem.getAttributeNode(name)) && val.specified ?
                        val.value :
                        null;
                };

                Sizzle.error = function(msg) {
                    throw new Error("Syntax error, unrecognized expression: " + msg);
                };

                /**
                 * Document sorting and removing duplicates
                 * @param {ArrayLike} results
                 */
                Sizzle.uniqueSort = function(results) {
                    var elem,
                        duplicates = [],
                        j = 0,
                        i = 0;

                    // Unless we *know* we can detect duplicates, assume their presence
                    hasDuplicate = !support.detectDuplicates;
                    sortInput = !support.sortStable && results.slice(0);
                    results.sort(sortOrder);

                    if (hasDuplicate) {
                        while ((elem = results[i++])) {
                            if (elem === results[i]) {
                                j = duplicates.push(i);
                            }
                        }
                        while (j--) {
                            results.splice(duplicates[j], 1);
                        }
                    }

                    // Clear input after sorting to release objects
                    // See https://github.com/jquery/sizzle/pull/225
                    sortInput = null;

                    return results;
                };

                /**
                 * Utility function for retrieving the text value of an array of DOM nodes
                 * @param {Array|Element} elem
                 */
                getText = Sizzle.getText = function(elem) {
                    var node,
                        ret = "",
                        i = 0,
                        nodeType = elem.nodeType;

                    if (!nodeType) {
                        // If no nodeType, this is expected to be an array
                        while ((node = elem[i++])) {
                            // Do not traverse comment nodes
                            ret += getText(node);
                        }
                    } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                        // Use textContent for elements
                        // innerText usage removed for consistency of new lines (jQuery #11153)
                        if (typeof elem.textContent === "string") {
                            return elem.textContent;
                        } else {
                            // Traverse its children
                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                ret += getText(elem);
                            }
                        }
                    } else if (nodeType === 3 || nodeType === 4) {
                        return elem.nodeValue;
                    }
                    // Do not include comment or processing instruction nodes

                    return ret;
                };

                Expr = Sizzle.selectors = {

                    // Can be adjusted by the user
                    cacheLength: 50,

                    createPseudo: markFunction,

                    match: matchExpr,

                    attrHandle: {},

                    find: {},

                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: true
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: true
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },

                    preFilter: {
                        "ATTR": function(match) {
                            match[1] = match[1].replace(runescape, funescape);

                            // Move the given value to match[3] whether quoted or unquoted
                            match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

                            if (match[2] === "~=") {
                                match[3] = " " + match[3] + " ";
                            }

                            return match.slice(0, 4);
                        },

                        "CHILD": function(match) {
                            /* matches from matchExpr["CHILD"]
                            	1 type (only|nth|...)
                            	2 what (child|of-type)
                            	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                            	4 xn-component of xn+y argument ([+-]?\d*n|)
                            	5 sign of xn-component
                            	6 x of xn-component
                            	7 sign of y-component
                            	8 y of y-component
                            */
                            match[1] = match[1].toLowerCase();

                            if (match[1].slice(0, 3) === "nth") {
                                // nth-* requires argument
                                if (!match[3]) {
                                    Sizzle.error(match[0]);
                                }

                                // numeric x and y parameters for Expr.filter.CHILD
                                // remember that false/true cast respectively to 0/1
                                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                                match[5] = +((match[7] + match[8]) || match[3] === "odd");

                                // other types prohibit arguments
                            } else if (match[3]) {
                                Sizzle.error(match[0]);
                            }

                            return match;
                        },

                        "PSEUDO": function(match) {
                            var excess,
                                unquoted = !match[6] && match[2];

                            if (matchExpr["CHILD"].test(match[0])) {
                                return null;
                            }

                            // Accept quoted arguments as-is
                            if (match[3]) {
                                match[2] = match[4] || match[5] || "";

                                // Strip excess characters from unquoted arguments
                            } else if (unquoted && rpseudo.test(unquoted) &&
                                // Get excess from tokenize (recursively)
                                (excess = tokenize(unquoted, true)) &&
                                // advance to the next closing parenthesis
                                (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                                // excess is a negative index
                                match[0] = match[0].slice(0, excess);
                                match[2] = unquoted.slice(0, excess);
                            }

                            // Return only captures needed by the pseudo filter method (type and argument)
                            return match.slice(0, 3);
                        }
                    },

                    filter: {

                        "TAG": function(nodeNameSelector) {
                            var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                            return nodeNameSelector === "*" ?
                                function() {
                                    return true;
                                } :
                                function(elem) {
                                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                                };
                        },

                        "CLASS": function(className) {
                            var pattern = classCache[className + " "];

                            return pattern ||
                                (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                                classCache(className, function(elem) {
                                    return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                                });
                        },

                        "ATTR": function(name, operator, check) {
                            return function(elem) {
                                var result = Sizzle.attr(elem, name);

                                if (result == null) {
                                    return operator === "!=";
                                }
                                if (!operator) {
                                    return true;
                                }

                                result += "";

                                return operator === "=" ? result === check :
                                    operator === "!=" ? result !== check :
                                    operator === "^=" ? check && result.indexOf(check) === 0 :
                                    operator === "*=" ? check && result.indexOf(check) > -1 :
                                    operator === "$=" ? check && result.slice(-check.length) === check :
                                    operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
                                    operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                                    false;
                            };
                        },

                        "CHILD": function(type, what, argument, first, last) {
                            var simple = type.slice(0, 3) !== "nth",
                                forward = type.slice(-4) !== "last",
                                ofType = what === "of-type";

                            return first === 1 && last === 0 ?

                                // Shortcut for :nth-*(n)
                                function(elem) {
                                    return !!elem.parentNode;
                                } :

                                function(elem, context, xml) {
                                    var cache, outerCache, node, diff, nodeIndex, start,
                                        dir = simple !== forward ? "nextSibling" : "previousSibling",
                                        parent = elem.parentNode,
                                        name = ofType && elem.nodeName.toLowerCase(),
                                        useCache = !xml && !ofType;

                                    if (parent) {

                                        // :(first|last|only)-(child|of-type)
                                        if (simple) {
                                            while (dir) {
                                                node = elem;
                                                while ((node = node[dir])) {
                                                    if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                                        return false;
                                                    }
                                                }
                                                // Reverse direction for :only-* (if we haven't yet done so)
                                                start = dir = type === "only" && !start && "nextSibling";
                                            }
                                            return true;
                                        }

                                        start = [forward ? parent.firstChild : parent.lastChild];

                                        // non-xml :nth-child(...) stores cache data on `parent`
                                        if (forward && useCache) {
                                            // Seek `elem` from a previously-cached index
                                            outerCache = parent[expando] || (parent[expando] = {});
                                            cache = outerCache[type] || [];
                                            nodeIndex = cache[0] === dirruns && cache[1];
                                            diff = cache[0] === dirruns && cache[2];
                                            node = nodeIndex && parent.childNodes[nodeIndex];

                                            while ((node = ++nodeIndex && node && node[dir] ||

                                                    // Fallback to seeking `elem` from the start
                                                    (diff = nodeIndex = 0) || start.pop())) {

                                                // When found, cache indexes on `parent` and break
                                                if (node.nodeType === 1 && ++diff && node === elem) {
                                                    outerCache[type] = [dirruns, nodeIndex, diff];
                                                    break;
                                                }
                                            }

                                            // Use previously-cached element index if available
                                        } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                            diff = cache[1];

                                            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                        } else {
                                            // Use the same loop as above to seek `elem` from the start
                                            while ((node = ++nodeIndex && node && node[dir] ||
                                                    (diff = nodeIndex = 0) || start.pop())) {

                                                if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                                    // Cache the index of each encountered element
                                                    if (useCache) {
                                                        (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                                                    }

                                                    if (node === elem) {
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        // Incorporate the offset, then check against cycle size
                                        diff -= last;
                                        return diff === first || (diff % first === 0 && diff / first >= 0);
                                    }
                                };
                        },

                        "PSEUDO": function(pseudo, argument) {
                            // pseudo-class names are case-insensitive
                            // http://www.w3.org/TR/selectors/#pseudo-classes
                            // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                            // Remember that setFilters inherits from pseudos
                            var args,
                                fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                                Sizzle.error("unsupported pseudo: " + pseudo);

                            // The user may use createPseudo to indicate that
                            // arguments are needed to create the filter function
                            // just as Sizzle does
                            if (fn[expando]) {
                                return fn(argument);
                            }

                            // But maintain support for old signatures
                            if (fn.length > 1) {
                                args = [pseudo, pseudo, "", argument];
                                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                                    markFunction(function(seed, matches) {
                                        var idx,
                                            matched = fn(seed, argument),
                                            i = matched.length;
                                        while (i--) {
                                            idx = indexOf.call(seed, matched[i]);
                                            seed[idx] = !(matches[idx] = matched[i]);
                                        }
                                    }) :
                                    function(elem) {
                                        return fn(elem, 0, args);
                                    };
                            }

                            return fn;
                        }
                    },

                    pseudos: {
                        // Potentially complex pseudos
                        "not": markFunction(function(selector) {
                            // Trim the selector passed to compile
                            // to avoid treating leading and trailing
                            // spaces as combinators
                            var input = [],
                                results = [],
                                matcher = compile(selector.replace(rtrim, "$1"));

                            return matcher[expando] ?
                                markFunction(function(seed, matches, context, xml) {
                                    var elem,
                                        unmatched = matcher(seed, null, xml, []),
                                        i = seed.length;

                                    // Match elements unmatched by `matcher`
                                    while (i--) {
                                        if ((elem = unmatched[i])) {
                                            seed[i] = !(matches[i] = elem);
                                        }
                                    }
                                }) :
                                function(elem, context, xml) {
                                    input[0] = elem;
                                    matcher(input, null, xml, results);
                                    return !results.pop();
                                };
                        }),

                        "has": markFunction(function(selector) {
                            return function(elem) {
                                return Sizzle(selector, elem).length > 0;
                            };
                        }),

                        "contains": markFunction(function(text) {
                            return function(elem) {
                                return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                            };
                        }),

                        // "Whether an element is represented by a :lang() selector
                        // is based solely on the element's language value
                        // being equal to the identifier C,
                        // or beginning with the identifier C immediately followed by "-".
                        // The matching of C against the element's language value is performed case-insensitively.
                        // The identifier C does not have to be a valid language name."
                        // http://www.w3.org/TR/selectors/#lang-pseudo
                        "lang": markFunction(function(lang) {
                            // lang value must be a valid identifier
                            if (!ridentifier.test(lang || "")) {
                                Sizzle.error("unsupported lang: " + lang);
                            }
                            lang = lang.replace(runescape, funescape).toLowerCase();
                            return function(elem) {
                                var elemLang;
                                do {
                                    if ((elemLang = documentIsHTML ?
                                            elem.lang :
                                            elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

                                        elemLang = elemLang.toLowerCase();
                                        return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                                    }
                                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                                return false;
                            };
                        }),

                        // Miscellaneous
                        "target": function(elem) {
                            var hash = window.location && window.location.hash;
                            return hash && hash.slice(1) === elem.id;
                        },

                        "root": function(elem) {
                            return elem === docElem;
                        },

                        "focus": function(elem) {
                            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                        },

                        // Boolean properties
                        "enabled": function(elem) {
                            return elem.disabled === false;
                        },

                        "disabled": function(elem) {
                            return elem.disabled === true;
                        },

                        "checked": function(elem) {
                            // In CSS3, :checked should return both checked and selected elements
                            // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                            var nodeName = elem.nodeName.toLowerCase();
                            return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                        },

                        "selected": function(elem) {
                            // Accessing this property makes selected-by-default
                            // options in Safari work properly
                            if (elem.parentNode) {
                                elem.parentNode.selectedIndex;
                            }

                            return elem.selected === true;
                        },

                        // Contents
                        "empty": function(elem) {
                            // http://www.w3.org/TR/selectors/#empty-pseudo
                            // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                            //   but not by others (comment: 8; processing instruction: 7; etc.)
                            // nodeType < 6 works because attributes (2) do not appear as children
                            for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                                if (elem.nodeType < 6) {
                                    return false;
                                }
                            }
                            return true;
                        },

                        "parent": function(elem) {
                            return !Expr.pseudos["empty"](elem);
                        },

                        // Element/input types
                        "header": function(elem) {
                            return rheader.test(elem.nodeName);
                        },

                        "input": function(elem) {
                            return rinputs.test(elem.nodeName);
                        },

                        "button": function(elem) {
                            var name = elem.nodeName.toLowerCase();
                            return name === "input" && elem.type === "button" || name === "button";
                        },

                        "text": function(elem) {
                            var attr;
                            return elem.nodeName.toLowerCase() === "input" &&
                                elem.type === "text" &&

                                // Support: IE<8
                                // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                                ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                        },

                        // Position-in-collection
                        "first": createPositionalPseudo(function() {
                            return [0];
                        }),

                        "last": createPositionalPseudo(function(matchIndexes, length) {
                            return [length - 1];
                        }),

                        "eq": createPositionalPseudo(function(matchIndexes, length, argument) {
                            return [argument < 0 ? argument + length : argument];
                        }),

                        "even": createPositionalPseudo(function(matchIndexes, length) {
                            var i = 0;
                            for (; i < length; i += 2) {
                                matchIndexes.push(i);
                            }
                            return matchIndexes;
                        }),

                        "odd": createPositionalPseudo(function(matchIndexes, length) {
                            var i = 1;
                            for (; i < length; i += 2) {
                                matchIndexes.push(i);
                            }
                            return matchIndexes;
                        }),

                        "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
                            var i = argument < 0 ? argument + length : argument;
                            for (; --i >= 0;) {
                                matchIndexes.push(i);
                            }
                            return matchIndexes;
                        }),

                        "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
                            var i = argument < 0 ? argument + length : argument;
                            for (; ++i < length;) {
                                matchIndexes.push(i);
                            }
                            return matchIndexes;
                        })
                    }
                };

                Expr.pseudos["nth"] = Expr.pseudos["eq"];

                // Add button/input type pseudos
                for (i in {
                        radio: true,
                        checkbox: true,
                        file: true,
                        password: true,
                        image: true
                    }) {
                    Expr.pseudos[i] = createInputPseudo(i);
                }
                for (i in {
                        submit: true,
                        reset: true
                    }) {
                    Expr.pseudos[i] = createButtonPseudo(i);
                }

                // Easy API for creating new setFilters
                function setFilters() {}
                setFilters.prototype = Expr.filters = Expr.pseudos;
                Expr.setFilters = new setFilters();

                tokenize = Sizzle.tokenize = function(selector, parseOnly) {
                    var matched, match, tokens, type,
                        soFar, groups, preFilters,
                        cached = tokenCache[selector + " "];

                    if (cached) {
                        return parseOnly ? 0 : cached.slice(0);
                    }

                    soFar = selector;
                    groups = [];
                    preFilters = Expr.preFilter;

                    while (soFar) {

                        // Comma and first run
                        if (!matched || (match = rcomma.exec(soFar))) {
                            if (match) {
                                // Don't consume trailing commas as valid
                                soFar = soFar.slice(match[0].length) || soFar;
                            }
                            groups.push((tokens = []));
                        }

                        matched = false;

                        // Combinators
                        if ((match = rcombinators.exec(soFar))) {
                            matched = match.shift();
                            tokens.push({
                                value: matched,
                                // Cast descendant combinators to space
                                type: match[0].replace(rtrim, " ")
                            });
                            soFar = soFar.slice(matched.length);
                        }

                        // Filters
                        for (type in Expr.filter) {
                            if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                                    (match = preFilters[type](match)))) {
                                matched = match.shift();
                                tokens.push({
                                    value: matched,
                                    type: type,
                                    matches: match
                                });
                                soFar = soFar.slice(matched.length);
                            }
                        }

                        if (!matched) {
                            break;
                        }
                    }

                    // Return the length of the invalid excess
                    // if we're just parsing
                    // Otherwise, throw an error or return tokens
                    return parseOnly ?
                        soFar.length :
                        soFar ?
                        Sizzle.error(selector) :
                        // Cache the tokens
                        tokenCache(selector, groups).slice(0);
                };

                function toSelector(tokens) {
                    var i = 0,
                        len = tokens.length,
                        selector = "";
                    for (; i < len; i++) {
                        selector += tokens[i].value;
                    }
                    return selector;
                }

                function addCombinator(matcher, combinator, base) {
                    var dir = combinator.dir,
                        checkNonElements = base && dir === "parentNode",
                        doneName = done++;

                    return combinator.first ?
                        // Check against closest ancestor/preceding element
                        function(elem, context, xml) {
                            while ((elem = elem[dir])) {
                                if (elem.nodeType === 1 || checkNonElements) {
                                    return matcher(elem, context, xml);
                                }
                            }
                        } :

                        // Check against all ancestor/preceding elements
                        function(elem, context, xml) {
                            var oldCache, outerCache,
                                newCache = [dirruns, doneName];

                            // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                            if (xml) {
                                while ((elem = elem[dir])) {
                                    if (elem.nodeType === 1 || checkNonElements) {
                                        if (matcher(elem, context, xml)) {
                                            return true;
                                        }
                                    }
                                }
                            } else {
                                while ((elem = elem[dir])) {
                                    if (elem.nodeType === 1 || checkNonElements) {
                                        outerCache = elem[expando] || (elem[expando] = {});
                                        if ((oldCache = outerCache[dir]) &&
                                            oldCache[0] === dirruns && oldCache[1] === doneName) {

                                            // Assign to newCache so results back-propagate to previous elements
                                            return (newCache[2] = oldCache[2]);
                                        } else {
                                            // Reuse newcache so results back-propagate to previous elements
                                            outerCache[dir] = newCache;

                                            // A match means we're done; a fail means we have to keep checking
                                            if ((newCache[2] = matcher(elem, context, xml))) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        };
                }

                function elementMatcher(matchers) {
                    return matchers.length > 1 ?
                        function(elem, context, xml) {
                            var i = matchers.length;
                            while (i--) {
                                if (!matchers[i](elem, context, xml)) {
                                    return false;
                                }
                            }
                            return true;
                        } :
                        matchers[0];
                }

                function multipleContexts(selector, contexts, results) {
                    var i = 0,
                        len = contexts.length;
                    for (; i < len; i++) {
                        Sizzle(selector, contexts[i], results);
                    }
                    return results;
                }

                function condense(unmatched, map, filter, context, xml) {
                    var elem,
                        newUnmatched = [],
                        i = 0,
                        len = unmatched.length,
                        mapped = map != null;

                    for (; i < len; i++) {
                        if ((elem = unmatched[i])) {
                            if (!filter || filter(elem, context, xml)) {
                                newUnmatched.push(elem);
                                if (mapped) {
                                    map.push(i);
                                }
                            }
                        }
                    }

                    return newUnmatched;
                }

                function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
                    if (postFilter && !postFilter[expando]) {
                        postFilter = setMatcher(postFilter);
                    }
                    if (postFinder && !postFinder[expando]) {
                        postFinder = setMatcher(postFinder, postSelector);
                    }
                    return markFunction(function(seed, results, context, xml) {
                        var temp, i, elem,
                            preMap = [],
                            postMap = [],
                            preexisting = results.length,

                            // Get initial elements from seed or context
                            elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                            // Prefilter to get matcher input, preserving a map for seed-results synchronization
                            matcherIn = preFilter && (seed || !selector) ?
                            condense(elems, preMap, preFilter, context, xml) :
                            elems,

                            matcherOut = matcher ?
                            // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                            postFinder || (seed ? preFilter : preexisting || postFilter) ?

                            // ...intermediate processing is necessary
                            [] :

                            // ...otherwise use results directly
                            results :
                            matcherIn;

                        // Find primary matches
                        if (matcher) {
                            matcher(matcherIn, matcherOut, context, xml);
                        }

                        // Apply postFilter
                        if (postFilter) {
                            temp = condense(matcherOut, postMap);
                            postFilter(temp, [], context, xml);

                            // Un-match failing elements by moving them back to matcherIn
                            i = temp.length;
                            while (i--) {
                                if ((elem = temp[i])) {
                                    matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                                }
                            }
                        }

                        if (seed) {
                            if (postFinder || preFilter) {
                                if (postFinder) {
                                    // Get the final matcherOut by condensing this intermediate into postFinder contexts
                                    temp = [];
                                    i = matcherOut.length;
                                    while (i--) {
                                        if ((elem = matcherOut[i])) {
                                            // Restore matcherIn since elem is not yet a final match
                                            temp.push((matcherIn[i] = elem));
                                        }
                                    }
                                    postFinder(null, (matcherOut = []), temp, xml);
                                }

                                // Move matched elements from seed to results to keep them synchronized
                                i = matcherOut.length;
                                while (i--) {
                                    if ((elem = matcherOut[i]) &&
                                        (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {

                                        seed[temp] = !(results[temp] = elem);
                                    }
                                }
                            }

                            // Add elements to results, through postFinder if defined
                        } else {
                            matcherOut = condense(
                                matcherOut === results ?
                                matcherOut.splice(preexisting, matcherOut.length) :
                                matcherOut
                            );
                            if (postFinder) {
                                postFinder(null, results, matcherOut, xml);
                            } else {
                                push.apply(results, matcherOut);
                            }
                        }
                    });
                }

                function matcherFromTokens(tokens) {
                    var checkContext, matcher, j,
                        len = tokens.length,
                        leadingRelative = Expr.relative[tokens[0].type],
                        implicitRelative = leadingRelative || Expr.relative[" "],
                        i = leadingRelative ? 1 : 0,

                        // The foundational matcher ensures that elements are reachable from top-level context(s)
                        matchContext = addCombinator(function(elem) {
                            return elem === checkContext;
                        }, implicitRelative, true),
                        matchAnyContext = addCombinator(function(elem) {
                            return indexOf.call(checkContext, elem) > -1;
                        }, implicitRelative, true),
                        matchers = [function(elem, context, xml) {
                            return (!leadingRelative && (xml || context !== outermostContext)) || (
                                (checkContext = context).nodeType ?
                                matchContext(elem, context, xml) :
                                matchAnyContext(elem, context, xml));
                        }];

                    for (; i < len; i++) {
                        if ((matcher = Expr.relative[tokens[i].type])) {
                            matchers = [addCombinator(elementMatcher(matchers), matcher)];
                        } else {
                            matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                            // Return special upon seeing a positional matcher
                            if (matcher[expando]) {
                                // Find the next relative operator (if any) for proper handling
                                j = ++i;
                                for (; j < len; j++) {
                                    if (Expr.relative[tokens[j].type]) {
                                        break;
                                    }
                                }
                                return setMatcher(
                                    i > 1 && elementMatcher(matchers),
                                    i > 1 && toSelector(
                                        // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                        tokens.slice(0, i - 1).concat({
                                            value: tokens[i - 2].type === " " ? "*" : ""
                                        })
                                    ).replace(rtrim, "$1"),
                                    matcher,
                                    i < j && matcherFromTokens(tokens.slice(i, j)),
                                    j < len && matcherFromTokens((tokens = tokens.slice(j))),
                                    j < len && toSelector(tokens)
                                );
                            }
                            matchers.push(matcher);
                        }
                    }

                    return elementMatcher(matchers);
                }

                function matcherFromGroupMatchers(elementMatchers, setMatchers) {
                    var bySet = setMatchers.length > 0,
                        byElement = elementMatchers.length > 0,
                        superMatcher = function(seed, context, xml, results, outermost) {
                            var elem, j, matcher,
                                matchedCount = 0,
                                i = "0",
                                unmatched = seed && [],
                                setMatched = [],
                                contextBackup = outermostContext,
                                // We must always have either seed elements or outermost context
                                elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                                // Use integer dirruns iff this is the outermost matcher
                                dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                                len = elems.length;

                            if (outermost) {
                                outermostContext = context !== document && context;
                            }

                            // Add elements passing elementMatchers directly to results
                            // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                            // Support: IE<9, Safari
                            // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                            for (; i !== len && (elem = elems[i]) != null; i++) {
                                if (byElement && elem) {
                                    j = 0;
                                    while ((matcher = elementMatchers[j++])) {
                                        if (matcher(elem, context, xml)) {
                                            results.push(elem);
                                            break;
                                        }
                                    }
                                    if (outermost) {
                                        dirruns = dirrunsUnique;
                                    }
                                }

                                // Track unmatched elements for set filters
                                if (bySet) {
                                    // They will have gone through all possible matchers
                                    if ((elem = !matcher && elem)) {
                                        matchedCount--;
                                    }

                                    // Lengthen the array for every element, matched or not
                                    if (seed) {
                                        unmatched.push(elem);
                                    }
                                }
                            }

                            // Apply set filters to unmatched elements
                            matchedCount += i;
                            if (bySet && i !== matchedCount) {
                                j = 0;
                                while ((matcher = setMatchers[j++])) {
                                    matcher(unmatched, setMatched, context, xml);
                                }

                                if (seed) {
                                    // Reintegrate element matches to eliminate the need for sorting
                                    if (matchedCount > 0) {
                                        while (i--) {
                                            if (!(unmatched[i] || setMatched[i])) {
                                                setMatched[i] = pop.call(results);
                                            }
                                        }
                                    }

                                    // Discard index placeholder values to get only actual matches
                                    setMatched = condense(setMatched);
                                }

                                // Add matches to results
                                push.apply(results, setMatched);

                                // Seedless set matches succeeding multiple successful matchers stipulate sorting
                                if (outermost && !seed && setMatched.length > 0 &&
                                    (matchedCount + setMatchers.length) > 1) {

                                    Sizzle.uniqueSort(results);
                                }
                            }

                            // Override manipulation of globals by nested matchers
                            if (outermost) {
                                dirruns = dirrunsUnique;
                                outermostContext = contextBackup;
                            }

                            return unmatched;
                        };

                    return bySet ?
                        markFunction(superMatcher) :
                        superMatcher;
                }

                compile = Sizzle.compile = function(selector, match /* Internal Use Only */ ) {
                    var i,
                        setMatchers = [],
                        elementMatchers = [],
                        cached = compilerCache[selector + " "];

                    if (!cached) {
                        // Generate a function of recursive functions that can be used to check each element
                        if (!match) {
                            match = tokenize(selector);
                        }
                        i = match.length;
                        while (i--) {
                            cached = matcherFromTokens(match[i]);
                            if (cached[expando]) {
                                setMatchers.push(cached);
                            } else {
                                elementMatchers.push(cached);
                            }
                        }

                        // Cache the compiled function
                        cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

                        // Save selector and tokenization
                        cached.selector = selector;
                    }
                    return cached;
                };

                /**
                 * A low-level selection function that works with Sizzle's compiled
                 *  selector functions
                 * @param {String|Function} selector A selector or a pre-compiled
                 *  selector function built with Sizzle.compile
                 * @param {Element} context
                 * @param {Array} [results]
                 * @param {Array} [seed] A set of elements to match against
                 */
                select = Sizzle.select = function(selector, context, results, seed) {
                    var i, tokens, token, type, find,
                        compiled = typeof selector === "function" && selector,
                        match = !seed && tokenize((selector = compiled.selector || selector));

                    results = results || [];

                    // Try to minimize operations if there is no seed and only one group
                    if (match.length === 1) {

                        // Take a shortcut and set the context if the root selector is an ID
                        tokens = match[0] = match[0].slice(0);
                        if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                            support.getById && context.nodeType === 9 && documentIsHTML &&
                            Expr.relative[tokens[1].type]) {

                            context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                            if (!context) {
                                return results;

                                // Precompiled matchers will still verify ancestry, so step up a level
                            } else if (compiled) {
                                context = context.parentNode;
                            }

                            selector = selector.slice(tokens.shift().value.length);
                        }

                        // Fetch a seed set for right-to-left matching
                        i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                        while (i--) {
                            token = tokens[i];

                            // Abort if we hit a combinator
                            if (Expr.relative[(type = token.type)]) {
                                break;
                            }
                            if ((find = Expr.find[type])) {
                                // Search, expanding context for leading sibling combinators
                                if ((seed = find(
                                        token.matches[0].replace(runescape, funescape),
                                        rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                                    ))) {

                                    // If seed is empty or no tokens remain, we can return early
                                    tokens.splice(i, 1);
                                    selector = seed.length && toSelector(tokens);
                                    if (!selector) {
                                        push.apply(results, seed);
                                        return results;
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    // Compile and execute a filtering function if one is not provided
                    // Provide `match` to avoid retokenization if we modified the selector above
                    (compiled || compile(selector, match))(
                        seed,
                        context, !documentIsHTML,
                        results,
                        rsibling.test(selector) && testContext(context.parentNode) || context
                    );
                    return results;
                };

                // One-time assignments

                // Sort stability
                support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

                // Support: Chrome<14
                // Always assume duplicates if they aren't passed to the comparison function
                support.detectDuplicates = !!hasDuplicate;

                // Initialize against the default document
                setDocument();

                // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
                // Detached nodes confoundingly follow *each other*
                support.sortDetached = assert(function(div1) {
                    // Should return 1, but returns 4 (following)
                    return div1.compareDocumentPosition(document.createElement("div")) & 1;
                });

                // Support: IE<8
                // Prevent attribute/property "interpolation"
                // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
                if (!assert(function(div) {
                        div.innerHTML = "<a href='#'></a>";
                        return div.firstChild.getAttribute("href") === "#";
                    })) {
                    addHandle("type|href|height|width", function(elem, name, isXML) {
                        if (!isXML) {
                            return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                        }
                    });
                }

                // Support: IE<9
                // Use defaultValue in place of getAttribute("value")
                if (!support.attributes || !assert(function(div) {
                        div.innerHTML = "<input/>";
                        div.firstChild.setAttribute("value", "");
                        return div.firstChild.getAttribute("value") === "";
                    })) {
                    addHandle("value", function(elem, name, isXML) {
                        if (!isXML && elem.nodeName.toLowerCase() === "input") {
                            return elem.defaultValue;
                        }
                    });
                }

                // Support: IE<9
                // Use getAttributeNode to fetch booleans when getAttribute lies
                if (!assert(function(div) {
                        return div.getAttribute("disabled") == null;
                    })) {
                    addHandle(booleans, function(elem, name, isXML) {
                        var val;
                        if (!isXML) {
                            return elem[name] === true ? name.toLowerCase() :
                                (val = elem.getAttributeNode(name)) && val.specified ?
                                val.value :
                                null;
                        }
                    });
                }

                return Sizzle;

            })(window);



        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;



        var rneedsContext = jQuery.expr.match.needsContext;

        var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



        var risSimple = /^.[^:#\[\.,]*$/;

        // Implement the identical functionality for filter and not
        function winnow(elements, qualifier, not) {
            if (jQuery.isFunction(qualifier)) {
                return jQuery.grep(elements, function(elem, i) {
                    /* jshint -W018 */
                    return !!qualifier.call(elem, i, elem) !== not;
                });

            }

            if (qualifier.nodeType) {
                return jQuery.grep(elements, function(elem) {
                    return (elem === qualifier) !== not;
                });

            }

            if (typeof qualifier === "string") {
                if (risSimple.test(qualifier)) {
                    return jQuery.filter(qualifier, elements, not);
                }

                qualifier = jQuery.filter(qualifier, elements);
            }

            return jQuery.grep(elements, function(elem) {
                return (jQuery.inArray(elem, qualifier) >= 0) !== not;
            });
        }

        jQuery.filter = function(expr, elems, not) {
            var elem = elems[0];

            if (not) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 && elem.nodeType === 1 ?
                jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
                jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
                    return elem.nodeType === 1;
                }));
        };

        jQuery.fn.extend({
            find: function(selector) {
                var i,
                    ret = [],
                    self = this,
                    len = self.length;

                if (typeof selector !== "string") {
                    return this.pushStack(jQuery(selector).filter(function() {
                        for (i = 0; i < len; i++) {
                            if (jQuery.contains(self[i], this)) {
                                return true;
                            }
                        }
                    }));
                }

                for (i = 0; i < len; i++) {
                    jQuery.find(selector, self[i], ret);
                }

                // Needed because $( selector, context ) becomes $( context ).find( selector )
                ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
                ret.selector = this.selector ? this.selector + " " + selector : selector;
                return ret;
            },
            filter: function(selector) {
                return this.pushStack(winnow(this, selector || [], false));
            },
            not: function(selector) {
                return this.pushStack(winnow(this, selector || [], true));
            },
            is: function(selector) {
                return !!winnow(
                    this,

                    // If this is a positional/relative selector, check membership in the returned set
                    // so $("p:first").is("p:last") won't return true for a doc with two "p".
                    typeof selector === "string" && rneedsContext.test(selector) ?
                    jQuery(selector) :
                    selector || [],
                    false
                ).length;
            }
        });


        // Initialize a jQuery object


        // A central reference to the root jQuery(document)
        var rootjQuery,

            // Use the correct document accordingly with window argument (sandbox)
            document = window.document,

            // A simple way to check for HTML strings
            // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
            // Strict HTML recognition (#11290: must start with <)
            rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

            init = jQuery.fn.init = function(selector, context) {
                var match, elem;

                // HANDLE: $(""), $(null), $(undefined), $(false)
                if (!selector) {
                    return this;
                }

                // Handle HTML strings
                if (typeof selector === "string") {
                    if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                        // Assume that strings that start and end with <> are HTML and skip the regex check
                        match = [null, selector, null];

                    } else {
                        match = rquickExpr.exec(selector);
                    }

                    // Match html or make sure no context is specified for #id
                    if (match && (match[1] || !context)) {

                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            context = context instanceof jQuery ? context[0] : context;

                            // scripts is true for back-compat
                            // Intentionally let the error be thrown if parseHTML is not present
                            jQuery.merge(this, jQuery.parseHTML(
                                match[1],
                                context && context.nodeType ? context.ownerDocument || context : document,
                                true
                            ));

                            // HANDLE: $(html, props)
                            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                                for (match in context) {
                                    // Properties of context are called as methods if possible
                                    if (jQuery.isFunction(this[match])) {
                                        this[match](context[match]);

                                        // ...and otherwise set as attributes
                                    } else {
                                        this.attr(match, context[match]);
                                    }
                                }
                            }

                            return this;

                            // HANDLE: $(#id)
                        } else {
                            elem = document.getElementById(match[2]);

                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (elem && elem.parentNode) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if (elem.id !== match[2]) {
                                    return rootjQuery.find(selector);
                                }

                                // Otherwise, we inject the element directly into the jQuery object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                        // HANDLE: $(expr, $(...))
                    } else if (!context || context.jquery) {
                        return (context || rootjQuery).find(selector);

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return this.constructor(context).find(selector);
                    }

                    // HANDLE: $(DOMElement)
                } else if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if (jQuery.isFunction(selector)) {
                    return typeof rootjQuery.ready !== "undefined" ?
                        rootjQuery.ready(selector) :
                        // Execute immediately if ready is not present
                        selector(jQuery);
                }

                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray(selector, this);
            };

        // Give the init function the jQuery prototype for later instantiation
        init.prototype = jQuery.fn;

        // Initialize central reference
        rootjQuery = jQuery(document);


        var rparentsprev = /^(?:parents|prev(?:Until|All))/,
            // methods guaranteed to produce a unique set when starting from a unique set
            guaranteedUnique = {
                children: true,
                contents: true,
                next: true,
                prev: true
            };

        jQuery.extend({
            dir: function(elem, dir, until) {
                var matched = [],
                    cur = elem[dir];

                while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                    if (cur.nodeType === 1) {
                        matched.push(cur);
                    }
                    cur = cur[dir];
                }
                return matched;
            },

            sibling: function(n, elem) {
                var r = [];

                for (; n; n = n.nextSibling) {
                    if (n.nodeType === 1 && n !== elem) {
                        r.push(n);
                    }
                }

                return r;
            }
        });

        jQuery.fn.extend({
            has: function(target) {
                var i,
                    targets = jQuery(target, this),
                    len = targets.length;

                return this.filter(function() {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(this, targets[i])) {
                            return true;
                        }
                    }
                });
            },

            closest: function(selectors, context) {
                var cur,
                    i = 0,
                    l = this.length,
                    matched = [],
                    pos = rneedsContext.test(selectors) || typeof selectors !== "string" ?
                    jQuery(selectors, context || this.context) :
                    0;

                for (; i < l; i++) {
                    for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                        // Always skip document fragments
                        if (cur.nodeType < 11 && (pos ?
                                pos.index(cur) > -1 :

                                // Don't pass non-elements to Sizzle
                                cur.nodeType === 1 &&
                                jQuery.find.matchesSelector(cur, selectors))) {

                            matched.push(cur);
                            break;
                        }
                    }
                }

                return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
            },

            // Determine the position of an element within
            // the matched set of elements
            index: function(elem) {

                // No argument, return index in parent
                if (!elem) {
                    return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
                }

                // index in selector
                if (typeof elem === "string") {
                    return jQuery.inArray(this[0], jQuery(elem));
                }

                // Locate the position of the desired element
                return jQuery.inArray(
                    // If it receives a jQuery object, the first element is used
                    elem.jquery ? elem[0] : elem, this);
            },

            add: function(selector, context) {
                return this.pushStack(
                    jQuery.unique(
                        jQuery.merge(this.get(), jQuery(selector, context))
                    )
                );
            },

            addBack: function(selector) {
                return this.add(selector == null ?
                    this.prevObject : this.prevObject.filter(selector)
                );
            }
        });

        function sibling(cur, dir) {
            do {
                cur = cur[dir];
            } while (cur && cur.nodeType !== 1);

            return cur;
        }

        jQuery.each({
            parent: function(elem) {
                var parent = elem.parentNode;
                return parent && parent.nodeType !== 11 ? parent : null;
            },
            parents: function(elem) {
                return jQuery.dir(elem, "parentNode");
            },
            parentsUntil: function(elem, i, until) {
                return jQuery.dir(elem, "parentNode", until);
            },
            next: function(elem) {
                return sibling(elem, "nextSibling");
            },
            prev: function(elem) {
                return sibling(elem, "previousSibling");
            },
            nextAll: function(elem) {
                return jQuery.dir(elem, "nextSibling");
            },
            prevAll: function(elem) {
                return jQuery.dir(elem, "previousSibling");
            },
            nextUntil: function(elem, i, until) {
                return jQuery.dir(elem, "nextSibling", until);
            },
            prevUntil: function(elem, i, until) {
                return jQuery.dir(elem, "previousSibling", until);
            },
            siblings: function(elem) {
                return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
            },
            children: function(elem) {
                return jQuery.sibling(elem.firstChild);
            },
            contents: function(elem) {
                return jQuery.nodeName(elem, "iframe") ?
                    elem.contentDocument || elem.contentWindow.document :
                    jQuery.merge([], elem.childNodes);
            }
        }, function(name, fn) {
            jQuery.fn[name] = function(until, selector) {
                var ret = jQuery.map(this, fn, until);

                if (name.slice(-5) !== "Until") {
                    selector = until;
                }

                if (selector && typeof selector === "string") {
                    ret = jQuery.filter(selector, ret);
                }

                if (this.length > 1) {
                    // Remove duplicates
                    if (!guaranteedUnique[name]) {
                        ret = jQuery.unique(ret);
                    }

                    // Reverse order for parents* and prev-derivatives
                    if (rparentsprev.test(name)) {
                        ret = ret.reverse();
                    }
                }

                return this.pushStack(ret);
            };
        });
        var rnotwhite = (/\S+/g);



        // String to Object options format cache
        var optionsCache = {};

        // Convert String-formatted options into Object-formatted ones and store in cache
        function createOptions(options) {
            var object = optionsCache[options] = {};
            jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
                object[flag] = true;
            });
            return object;
        }

        /*
         * Create a callback list using the following parameters:
         *
         *	options: an optional list of space-separated options that will change how
         *			the callback list behaves or a more traditional option object
         *
         * By default a callback list will act like an event callback list and can be
         * "fired" multiple times.
         *
         * Possible options:
         *
         *	once:			will ensure the callback list can only be fired once (like a Deferred)
         *
         *	memory:			will keep track of previous values and will call any callback added
         *					after the list has been fired right away with the latest "memorized"
         *					values (like a Deferred)
         *
         *	unique:			will ensure a callback can only be added once (no duplicate in the list)
         *
         *	stopOnFalse:	interrupt callings when a callback returns false
         *
         */
        jQuery.Callbacks = function(options) {

            // Convert options from String-formatted to Object-formatted if needed
            // (we check in cache first)
            options = typeof options === "string" ?
                (optionsCache[options] || createOptions(options)) :
                jQuery.extend({}, options);

            var // Flag to know if list is currently firing
                firing,
                // Last fire value (for non-forgettable lists)
                memory,
                // Flag to know if list was already fired
                fired,
                // End of the loop when firing
                firingLength,
                // Index of currently firing callback (modified by remove if needed)
                firingIndex,
                // First callback to fire (used internally by add and fireWith)
                firingStart,
                // Actual callback list
                list = [],
                // Stack of fire calls for repeatable lists
                stack = !options.once && [],
                // Fire callbacks
                fire = function(data) {
                    memory = options.memory && data;
                    fired = true;
                    firingIndex = firingStart || 0;
                    firingStart = 0;
                    firingLength = list.length;
                    firing = true;
                    for (; list && firingIndex < firingLength; firingIndex++) {
                        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                            memory = false; // To prevent further calls using add
                            break;
                        }
                    }
                    firing = false;
                    if (list) {
                        if (stack) {
                            if (stack.length) {
                                fire(stack.shift());
                            }
                        } else if (memory) {
                            list = [];
                        } else {
                            self.disable();
                        }
                    }
                },
                // Actual Callbacks object
                self = {
                    // Add a callback or a collection of callbacks to the list
                    add: function() {
                        if (list) {
                            // First, we save the current length
                            var start = list.length;
                            (function add(args) {
                                jQuery.each(args, function(_, arg) {
                                    var type = jQuery.type(arg);
                                    if (type === "function") {
                                        if (!options.unique || !self.has(arg)) {
                                            list.push(arg);
                                        }
                                    } else if (arg && arg.length && type !== "string") {
                                        // Inspect recursively
                                        add(arg);
                                    }
                                });
                            })(arguments);
                            // Do we need to add the callbacks to the
                            // current firing batch?
                            if (firing) {
                                firingLength = list.length;
                                // With memory, if we're not firing then
                                // we should call right away
                            } else if (memory) {
                                firingStart = start;
                                fire(memory);
                            }
                        }
                        return this;
                    },
                    // Remove a callback from the list
                    remove: function() {
                        if (list) {
                            jQuery.each(arguments, function(_, arg) {
                                var index;
                                while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                    list.splice(index, 1);
                                    // Handle firing indexes
                                    if (firing) {
                                        if (index <= firingLength) {
                                            firingLength--;
                                        }
                                        if (index <= firingIndex) {
                                            firingIndex--;
                                        }
                                    }
                                }
                            });
                        }
                        return this;
                    },
                    // Check if a given callback is in the list.
                    // If no argument is given, return whether or not list has callbacks attached.
                    has: function(fn) {
                        return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
                    },
                    // Remove all callbacks from the list
                    empty: function() {
                        list = [];
                        firingLength = 0;
                        return this;
                    },
                    // Have the list do nothing anymore
                    disable: function() {
                        list = stack = memory = undefined;
                        return this;
                    },
                    // Is it disabled?
                    disabled: function() {
                        return !list;
                    },
                    // Lock the list in its current state
                    lock: function() {
                        stack = undefined;
                        if (!memory) {
                            self.disable();
                        }
                        return this;
                    },
                    // Is it locked?
                    locked: function() {
                        return !stack;
                    },
                    // Call all callbacks with the given context and arguments
                    fireWith: function(context, args) {
                        if (list && (!fired || stack)) {
                            args = args || [];
                            args = [context, args.slice ? args.slice() : args];
                            if (firing) {
                                stack.push(args);
                            } else {
                                fire(args);
                            }
                        }
                        return this;
                    },
                    // Call all the callbacks with the given arguments
                    fire: function() {
                        self.fireWith(this, arguments);
                        return this;
                    },
                    // To know if the callbacks have already been called at least once
                    fired: function() {
                        return !!fired;
                    }
                };

            return self;
        };


        jQuery.extend({

            Deferred: function(func) {
                var tuples = [
                        // action, add listener, listener list, final state
                        ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", jQuery.Callbacks("memory")]
                    ],
                    state = "pending",
                    promise = {
                        state: function() {
                            return state;
                        },
                        always: function() {
                            deferred.done(arguments).fail(arguments);
                            return this;
                        },
                        then: function( /* fnDone, fnFail, fnProgress */ ) {
                            var fns = arguments;
                            return jQuery.Deferred(function(newDefer) {
                                jQuery.each(tuples, function(i, tuple) {
                                    var fn = jQuery.isFunction(fns[i]) && fns[i];
                                    // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                    deferred[tuple[1]](function() {
                                        var returned = fn && fn.apply(this, arguments);
                                        if (returned && jQuery.isFunction(returned.promise)) {
                                            returned.promise()
                                                .done(newDefer.resolve)
                                                .fail(newDefer.reject)
                                                .progress(newDefer.notify);
                                        } else {
                                            newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                        }
                                    });
                                });
                                fns = null;
                            }).promise();
                        },
                        // Get a promise for this deferred
                        // If obj is provided, the promise aspect is added to the object
                        promise: function(obj) {
                            return obj != null ? jQuery.extend(obj, promise) : promise;
                        }
                    },
                    deferred = {};

                // Keep pipe for back-compat
                promise.pipe = promise.then;

                // Add list-specific methods
                jQuery.each(tuples, function(i, tuple) {
                    var list = tuple[2],
                        stateString = tuple[3];

                    // promise[ done | fail | progress ] = list.add
                    promise[tuple[1]] = list.add;

                    // Handle state
                    if (stateString) {
                        list.add(function() {
                            // state = [ resolved | rejected ]
                            state = stateString;

                            // [ reject_list | resolve_list ].disable; progress_list.lock
                        }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                    }

                    // deferred[ resolve | reject | notify ]
                    deferred[tuple[0]] = function() {
                        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                        return this;
                    };
                    deferred[tuple[0] + "With"] = list.fireWith;
                });

                // Make the deferred a promise
                promise.promise(deferred);

                // Call given func if any
                if (func) {
                    func.call(deferred, deferred);
                }

                // All done!
                return deferred;
            },

            // Deferred helper
            when: function(subordinate /* , ..., subordinateN */ ) {
                var i = 0,
                    resolveValues = slice.call(arguments),
                    length = resolveValues.length,

                    // the count of uncompleted subordinates
                    remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

                    // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                    deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                    // Update function for both resolve and progress values
                    updateFunc = function(i, contexts, values) {
                        return function(value) {
                            contexts[i] = this;
                            values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                            if (values === progressValues) {
                                deferred.notifyWith(contexts, values);

                            } else if (!(--remaining)) {
                                deferred.resolveWith(contexts, values);
                            }
                        };
                    },

                    progressValues, progressContexts, resolveContexts;

                // add listeners to Deferred subordinates; treat others as resolved
                if (length > 1) {
                    progressValues = new Array(length);
                    progressContexts = new Array(length);
                    resolveContexts = new Array(length);
                    for (; i < length; i++) {
                        if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                            resolveValues[i].promise()
                                .done(updateFunc(i, resolveContexts, resolveValues))
                                .fail(deferred.reject)
                                .progress(updateFunc(i, progressContexts, progressValues));
                        } else {
                            --remaining;
                        }
                    }
                }

                // if we're not waiting on anything, resolve the master
                if (!remaining) {
                    deferred.resolveWith(resolveContexts, resolveValues);
                }

                return deferred.promise();
            }
        });


        // The deferred used on DOM ready
        var readyList;

        jQuery.fn.ready = function(fn) {
            // Add the callback
            jQuery.ready.promise().done(fn);

            return this;
        };

        jQuery.extend({
            // Is the DOM ready to be used? Set to true once it occurs.
            isReady: false,

            // A counter to track how many items to wait for before
            // the ready event fires. See #6781
            readyWait: 1,

            // Hold (or release) the ready event
            holdReady: function(hold) {
                if (hold) {
                    jQuery.readyWait++;
                } else {
                    jQuery.ready(true);
                }
            },

            // Handle when the DOM is ready
            ready: function(wait) {

                // Abort if there are pending holds or we're already ready
                if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                    return;
                }

                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (!document.body) {
                    return setTimeout(jQuery.ready);
                }

                // Remember that the DOM is ready
                jQuery.isReady = true;

                // If a normal DOM Ready event fired, decrement, and wait if need be
                if (wait !== true && --jQuery.readyWait > 0) {
                    return;
                }

                // If there are functions bound, to execute
                readyList.resolveWith(document, [jQuery]);

                // Trigger any bound ready events
                if (jQuery.fn.triggerHandler) {
                    jQuery(document).triggerHandler("ready");
                    jQuery(document).off("ready");
                }
            }
        });

        /**
         * Clean-up method for dom ready events
         */
        function detach() {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", completed, false);
                window.removeEventListener("load", completed, false);

            } else {
                document.detachEvent("onreadystatechange", completed);
                window.detachEvent("onload", completed);
            }
        }

        /**
         * The ready event handler and self cleanup method
         */
        function completed() {
            // readyState === "complete" is good enough for us to call the dom ready in oldIE
            if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
                detach();
                jQuery.ready();
            }
        }

        jQuery.ready.promise = function(obj) {
            if (!readyList) {

                readyList = jQuery.Deferred();

                // Catch cases where $(document).ready() is called after the browser event has already occurred.
                // we once tried to use readyState "interactive" here, but it caused issues like the one
                // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
                if (document.readyState === "complete") {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    setTimeout(jQuery.ready);

                    // Standards-based browsers support DOMContentLoaded
                } else if (document.addEventListener) {
                    // Use the handy event callback
                    document.addEventListener("DOMContentLoaded", completed, false);

                    // A fallback to window.onload, that will always work
                    window.addEventListener("load", completed, false);

                    // If IE event model is used
                } else {
                    // Ensure firing before onload, maybe late but safe also for iframes
                    document.attachEvent("onreadystatechange", completed);

                    // A fallback to window.onload, that will always work
                    window.attachEvent("onload", completed);

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var top = false;

                    try {
                        top = window.frameElement == null && document.documentElement;
                    } catch (e) {}

                    if (top && top.doScroll) {
                        (function doScrollCheck() {
                            if (!jQuery.isReady) {

                                try {
                                    // Use the trick by Diego Perini
                                    // http://javascript.nwbox.com/IEContentLoaded/
                                    top.doScroll("left");
                                } catch (e) {
                                    return setTimeout(doScrollCheck, 50);
                                }

                                // detach all dom ready events
                                detach();

                                // and execute any waiting functions
                                jQuery.ready();
                            }
                        })();
                    }
                }
            }
            return readyList.promise(obj);
        };


        var strundefined = typeof undefined;



        // Support: IE<9
        // Iteration over object's inherited properties before its own
        var i;
        for (i in jQuery(support)) {
            break;
        }
        support.ownLast = i !== "0";

        // Note: most support tests are defined in their respective modules.
        // false until the test is run
        support.inlineBlockNeedsLayout = false;

        // Execute ASAP in case we need to set body.style.zoom
        jQuery(function() {
            // Minified: var a,b,c,d
            var val, div, body, container;

            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                // Return for frameset docs that don't have a body
                return;
            }

            // Setup
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);

            if (typeof div.style.zoom !== strundefined) {
                // Support: IE<8
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

                support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
                if (val) {
                    // Prevent IE 6 from affecting layout for positioned elements #11048
                    // Prevent IE from shrinking the body in IE 7 mode #12869
                    // Support: IE<8
                    body.style.zoom = 1;
                }
            }

            body.removeChild(container);
        });




        (function() {
            var div = document.createElement("div");

            // Execute the test only if not already executed in another module.
            if (support.deleteExpando == null) {
                // Support: IE<9
                support.deleteExpando = true;
                try {
                    delete div.test;
                } catch (e) {
                    support.deleteExpando = false;
                }
            }

            // Null elements to avoid leaks in IE.
            div = null;
        })();


        /**
         * Determines whether an object can have data
         */
        jQuery.acceptData = function(elem) {
            var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()],
                nodeType = +elem.nodeType || 1;

            // Do not set data on non-element DOM nodes because it will not be cleared (#8335).
            return nodeType !== 1 && nodeType !== 9 ?
                false :

                // Nodes accept data unless otherwise specified; rejection can be conditional
                !noData || noData !== true && elem.getAttribute("classid") === noData;
        };


        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            rmultiDash = /([A-Z])/g;

        function dataAttr(elem, key, data) {
            // If nothing was found internally, try to fetch any
            // data from the HTML5 data-* attribute
            if (data === undefined && elem.nodeType === 1) {

                var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

                data = elem.getAttribute(name);

                if (typeof data === "string") {
                    try {
                        data = data === "true" ? true :
                            data === "false" ? false :
                            data === "null" ? null :
                            // Only convert to a number if it doesn't change the string
                            +data + "" === data ? +data :
                            rbrace.test(data) ? jQuery.parseJSON(data) :
                            data;
                    } catch (e) {}

                    // Make sure we set the data so it isn't changed later
                    jQuery.data(elem, key, data);

                } else {
                    data = undefined;
                }
            }

            return data;
        }

        // checks a cache object for emptiness
        function isEmptyDataObject(obj) {
            var name;
            for (name in obj) {

                // if the public data object is empty, the private is still empty
                if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                    continue;
                }
                if (name !== "toJSON") {
                    return false;
                }
            }

            return true;
        }

        function internalData(elem, name, data, pvt /* Internal Use Only */ ) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            var ret, thisCache,
                internalKey = jQuery.expando,

                // We have to handle DOM nodes and JS objects differently because IE6-7
                // can't GC object references properly across the DOM-JS boundary
                isNode = elem.nodeType,

                // Only DOM nodes need the global jQuery cache; JS object data is
                // attached directly to the object so GC can occur automatically
                cache = isNode ? jQuery.cache : elem,

                // Only defining an ID for JS objects if its cache already exists allows
                // the code to shortcut on the same path as a DOM node with no cache
                id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ((!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string") {
                return;
            }

            if (!id) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if (isNode) {
                    id = elem[internalKey] = deletedIds.pop() || jQuery.guid++;
                } else {
                    id = internalKey;
                }
            }

            if (!cache[id]) {
                // Avoid exposing jQuery metadata on plain JS objects when the object
                // is serialized using JSON.stringify
                cache[id] = isNode ? {} : {
                    toJSON: jQuery.noop
                };
            }

            // An object can be passed to jQuery.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if (typeof name === "object" || typeof name === "function") {
                if (pvt) {
                    cache[id] = jQuery.extend(cache[id], name);
                } else {
                    cache[id].data = jQuery.extend(cache[id].data, name);
                }
            }

            thisCache = cache[id];

            // jQuery data() is stored in a separate object inside the object's internal data
            // cache in order to avoid key collisions between internal data and user-defined
            // data.
            if (!pvt) {
                if (!thisCache.data) {
                    thisCache.data = {};
                }

                thisCache = thisCache.data;
            }

            if (data !== undefined) {
                thisCache[jQuery.camelCase(name)] = data;
            }

            // Check for both converted-to-camel and non-converted data property names
            // If a data property was specified
            if (typeof name === "string") {

                // First Try to find as-is property data
                ret = thisCache[name];

                // Test for null|undefined property data
                if (ret == null) {

                    // Try to find the camelCased property
                    ret = thisCache[jQuery.camelCase(name)];
                }
            } else {
                ret = thisCache;
            }

            return ret;
        }

        function internalRemoveData(elem, name, pvt) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            var thisCache, i,
                isNode = elem.nodeType,

                // See jQuery.data for more information
                cache = isNode ? jQuery.cache : elem,
                id = isNode ? elem[jQuery.expando] : jQuery.expando;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if (!cache[id]) {
                return;
            }

            if (name) {

                thisCache = pvt ? cache[id] : cache[id].data;

                if (thisCache) {

                    // Support array or space separated string names for data keys
                    if (!jQuery.isArray(name)) {

                        // try the string as a key before any manipulation
                        if (name in thisCache) {
                            name = [name];
                        } else {

                            // split the camel cased version by spaces unless a key with the spaces exists
                            name = jQuery.camelCase(name);
                            if (name in thisCache) {
                                name = [name];
                            } else {
                                name = name.split(" ");
                            }
                        }
                    } else {
                        // If "name" is an array of keys...
                        // When data is initially created, via ("key", "val") signature,
                        // keys will be converted to camelCase.
                        // Since there is no way to tell _how_ a key was added, remove
                        // both plain key and camelCase key. #12786
                        // This will only penalize the array argument path.
                        name = name.concat(jQuery.map(name, jQuery.camelCase));
                    }

                    i = name.length;
                    while (i--) {
                        delete thisCache[name[i]];
                    }

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
                        return;
                    }
                }
            }

            // See jQuery.data for more information
            if (!pvt) {
                delete cache[id].data;

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if (!isEmptyDataObject(cache[id])) {
                    return;
                }
            }

            // Destroy the cache
            if (isNode) {
                jQuery.cleanData([elem], true);

                // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
                /* jshint eqeqeq: false */
            } else if (support.deleteExpando || cache != cache.window) {
                /* jshint eqeqeq: true */
                delete cache[id];

                // When all else fails, null
            } else {
                cache[id] = null;
            }
        }

        jQuery.extend({
            cache: {},

            // The following elements (space-suffixed to avoid Object.prototype collisions)
            // throw uncatchable exceptions if you attempt to set expando properties
            noData: {
                "applet ": true,
                "embed ": true,
                // ...but Flash objects (which have this classid) *can* handle expandos
                "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },

            hasData: function(elem) {
                elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
                return !!elem && !isEmptyDataObject(elem);
            },

            data: function(elem, name, data) {
                return internalData(elem, name, data);
            },

            removeData: function(elem, name) {
                return internalRemoveData(elem, name);
            },

            // For internal use only.
            _data: function(elem, name, data) {
                return internalData(elem, name, data, true);
            },

            _removeData: function(elem, name) {
                return internalRemoveData(elem, name, true);
            }
        });

        jQuery.fn.extend({
            data: function(key, value) {
                var i, name, data,
                    elem = this[0],
                    attrs = elem && elem.attributes;

                // Special expections of .data basically thwart jQuery.access,
                // so implement the relevant behavior ourselves

                // Gets all values
                if (key === undefined) {
                    if (this.length) {
                        data = jQuery.data(elem);

                        if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                            i = attrs.length;
                            while (i--) {

                                // Support: IE11+
                                // The attrs elements can be null (#14894)
                                if (attrs[i]) {
                                    name = attrs[i].name;
                                    if (name.indexOf("data-") === 0) {
                                        name = jQuery.camelCase(name.slice(5));
                                        dataAttr(elem, name, data[name]);
                                    }
                                }
                            }
                            jQuery._data(elem, "parsedAttrs", true);
                        }
                    }

                    return data;
                }

                // Sets multiple values
                if (typeof key === "object") {
                    return this.each(function() {
                        jQuery.data(this, key);
                    });
                }

                return arguments.length > 1 ?

                    // Sets one value
                    this.each(function() {
                        jQuery.data(this, key, value);
                    }) :

                    // Gets one value
                    // Try to fetch any internally stored data first
                    elem ? dataAttr(elem, key, jQuery.data(elem, key)) : undefined;
            },

            removeData: function(key) {
                return this.each(function() {
                    jQuery.removeData(this, key);
                });
            }
        });


        jQuery.extend({
            queue: function(elem, type, data) {
                var queue;

                if (elem) {
                    type = (type || "fx") + "queue";
                    queue = jQuery._data(elem, type);

                    // Speed up dequeue by getting out quickly if this is just a lookup
                    if (data) {
                        if (!queue || jQuery.isArray(data)) {
                            queue = jQuery._data(elem, type, jQuery.makeArray(data));
                        } else {
                            queue.push(data);
                        }
                    }
                    return queue || [];
                }
            },

            dequeue: function(elem, type) {
                type = type || "fx";

                var queue = jQuery.queue(elem, type),
                    startLength = queue.length,
                    fn = queue.shift(),
                    hooks = jQuery._queueHooks(elem, type),
                    next = function() {
                        jQuery.dequeue(elem, type);
                    };

                // If the fx queue is dequeued, always remove the progress sentinel
                if (fn === "inprogress") {
                    fn = queue.shift();
                    startLength--;
                }

                if (fn) {

                    // Add a progress sentinel to prevent the fx queue from being
                    // automatically dequeued
                    if (type === "fx") {
                        queue.unshift("inprogress");
                    }

                    // clear up the last queue stop function
                    delete hooks.stop;
                    fn.call(elem, next, hooks);
                }

                if (!startLength && hooks) {
                    hooks.empty.fire();
                }
            },

            // not intended for public consumption - generates a queueHooks object, or returns the current one
            _queueHooks: function(elem, type) {
                var key = type + "queueHooks";
                return jQuery._data(elem, key) || jQuery._data(elem, key, {
                    empty: jQuery.Callbacks("once memory").add(function() {
                        jQuery._removeData(elem, type + "queue");
                        jQuery._removeData(elem, key);
                    })
                });
            }
        });

        jQuery.fn.extend({
            queue: function(type, data) {
                var setter = 2;

                if (typeof type !== "string") {
                    data = type;
                    type = "fx";
                    setter--;
                }

                if (arguments.length < setter) {
                    return jQuery.queue(this[0], type);
                }

                return data === undefined ?
                    this :
                    this.each(function() {
                        var queue = jQuery.queue(this, type, data);

                        // ensure a hooks for this queue
                        jQuery._queueHooks(this, type);

                        if (type === "fx" && queue[0] !== "inprogress") {
                            jQuery.dequeue(this, type);
                        }
                    });
            },
            dequeue: function(type) {
                return this.each(function() {
                    jQuery.dequeue(this, type);
                });
            },
            clearQueue: function(type) {
                return this.queue(type || "fx", []);
            },
            // Get a promise resolved when queues of a certain type
            // are emptied (fx is the type by default)
            promise: function(type, obj) {
                var tmp,
                    count = 1,
                    defer = jQuery.Deferred(),
                    elements = this,
                    i = this.length,
                    resolve = function() {
                        if (!(--count)) {
                            defer.resolveWith(elements, [elements]);
                        }
                    };

                if (typeof type !== "string") {
                    obj = type;
                    type = undefined;
                }
                type = type || "fx";

                while (i--) {
                    tmp = jQuery._data(elements[i], type + "queueHooks");
                    if (tmp && tmp.empty) {
                        count++;
                        tmp.empty.add(resolve);
                    }
                }
                resolve();
                return defer.promise(obj);
            }
        });
        var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

        var cssExpand = ["Top", "Right", "Bottom", "Left"];

        var isHidden = function(elem, el) {
            // isHidden might be called from jQuery#filter function;
            // in that case, element will be second argument
            elem = el || elem;
            return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
        };



        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0,
                length = elems.length,
                bulk = key == null;

            // Sets many values
            if (jQuery.type(key) === "object") {
                chainable = true;
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
                }

                // Sets one value
            } else if (value !== undefined) {
                chainable = true;

                if (!jQuery.isFunction(value)) {
                    raw = true;
                }

                if (bulk) {
                    // Bulk operations run against the entire set
                    if (raw) {
                        fn.call(elems, value);
                        fn = null;

                        // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function(elem, key, value) {
                            return bulk.call(jQuery(elem), value);
                        };
                    }
                }

                if (fn) {
                    for (; i < length; i++) {
                        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    }
                }
            }

            return chainable ?
                elems :

                // Gets
                bulk ?
                fn.call(elems) :
                length ? fn(elems[0], key) : emptyGet;
        };
        var rcheckableType = (/^(?:checkbox|radio)$/i);



        (function() {
            // Minified: var a,b,c
            var input = document.createElement("input"),
                div = document.createElement("div"),
                fragment = document.createDocumentFragment();

            // Setup
            div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

            // IE strips leading whitespace when .innerHTML is used
            support.leadingWhitespace = div.firstChild.nodeType === 3;

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            support.tbody = !div.getElementsByTagName("tbody").length;

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            support.htmlSerialize = !!div.getElementsByTagName("link").length;

            // Makes sure cloning an html5 element does not cause problems
            // Where outerHTML is undefined, this still works
            support.html5Clone =
                document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";

            // Check if a disconnected checkbox will retain its checked
            // value of true after appended to the DOM (IE6/7)
            input.type = "checkbox";
            input.checked = true;
            fragment.appendChild(input);
            support.appendChecked = input.checked;

            // Make sure textarea (and checkbox) defaultValue is properly cloned
            // Support: IE6-IE11+
            div.innerHTML = "<textarea>x</textarea>";
            support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;

            // #11217 - WebKit loses check when the name is after the checked attribute
            fragment.appendChild(div);
            div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

            // Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
            // old WebKit doesn't clone checked state correctly in fragments
            support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

            // Support: IE<9
            // Opera does not clone events (and typeof div.attachEvent === undefined).
            // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
            support.noCloneEvent = true;
            if (div.attachEvent) {
                div.attachEvent("onclick", function() {
                    support.noCloneEvent = false;
                });

                div.cloneNode(true).click();
            }

            // Execute the test only if not already executed in another module.
            if (support.deleteExpando == null) {
                // Support: IE<9
                support.deleteExpando = true;
                try {
                    delete div.test;
                } catch (e) {
                    support.deleteExpando = false;
                }
            }
        })();


        (function() {
            var i, eventName,
                div = document.createElement("div");

            // Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
            for (i in {
                    submit: true,
                    change: true,
                    focusin: true
                }) {
                eventName = "on" + i;

                if (!(support[i + "Bubbles"] = eventName in window)) {
                    // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
                    div.setAttribute(eventName, "t");
                    support[i + "Bubbles"] = div.attributes[eventName].expando === false;
                }
            }

            // Null elements to avoid leaks in IE.
            div = null;
        })();


        var rformElems = /^(?:input|select|textarea)$/i,
            rkeyEvent = /^key/,
            rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
            rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
            rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

        function returnTrue() {
            return true;
        }

        function returnFalse() {
            return false;
        }

        function safeActiveElement() {
            try {
                return document.activeElement;
            } catch (err) {}
        }

        /*
         * Helper functions for managing events -- not part of the public interface.
         * Props to Dean Edwards' addEvent library for many of the ideas.
         */
        jQuery.event = {

            global: {},

            add: function(elem, types, handler, data, selector) {
                var tmp, events, t, handleObjIn,
                    special, eventHandle, handleObj,
                    handlers, type, namespaces, origType,
                    elemData = jQuery._data(elem);

                // Don't attach events to noData or text/comment nodes (but allow plain objects)
                if (!elemData) {
                    return;
                }

                // Caller can pass in an object of custom data in lieu of the handler
                if (handler.handler) {
                    handleObjIn = handler;
                    handler = handleObjIn.handler;
                    selector = handleObjIn.selector;
                }

                // Make sure that the handler has a unique ID, used to find/remove it later
                if (!handler.guid) {
                    handler.guid = jQuery.guid++;
                }

                // Init the element's event structure and main handler, if this is the first
                if (!(events = elemData.events)) {
                    events = elemData.events = {};
                }
                if (!(eventHandle = elemData.handle)) {
                    eventHandle = elemData.handle = function(e) {
                        // Discard the second event of a jQuery.event.trigger() and
                        // when an event is called after a page has unloaded
                        return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
                            jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
                            undefined;
                    };
                    // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                    eventHandle.elem = elem;
                }

                // Handle multiple events separated by a space
                types = (types || "").match(rnotwhite) || [""];
                t = types.length;
                while (t--) {
                    tmp = rtypenamespace.exec(types[t]) || [];
                    type = origType = tmp[1];
                    namespaces = (tmp[2] || "").split(".").sort();

                    // There *must* be a type, no attaching namespace-only handlers
                    if (!type) {
                        continue;
                    }

                    // If event changes its type, use the special event handlers for the changed type
                    special = jQuery.event.special[type] || {};

                    // If selector defined, determine special event api type, otherwise given type
                    type = (selector ? special.delegateType : special.bindType) || type;

                    // Update special based on newly reset type
                    special = jQuery.event.special[type] || {};

                    // handleObj is passed to all event handlers
                    handleObj = jQuery.extend({
                        type: type,
                        origType: origType,
                        data: data,
                        handler: handler,
                        guid: handler.guid,
                        selector: selector,
                        needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                        namespace: namespaces.join(".")
                    }, handleObjIn);

                    // Init the event handler queue if we're the first
                    if (!(handlers = events[type])) {
                        handlers = events[type] = [];
                        handlers.delegateCount = 0;

                        // Only use addEventListener/attachEvent if the special events handler returns false
                        if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                            // Bind the global event handler to the element
                            if (elem.addEventListener) {
                                elem.addEventListener(type, eventHandle, false);

                            } else if (elem.attachEvent) {
                                elem.attachEvent("on" + type, eventHandle);
                            }
                        }
                    }

                    if (special.add) {
                        special.add.call(elem, handleObj);

                        if (!handleObj.handler.guid) {
                            handleObj.handler.guid = handler.guid;
                        }
                    }

                    // Add to the element's handler list, delegates in front
                    if (selector) {
                        handlers.splice(handlers.delegateCount++, 0, handleObj);
                    } else {
                        handlers.push(handleObj);
                    }

                    // Keep track of which events have ever been used, for event optimization
                    jQuery.event.global[type] = true;
                }

                // Nullify elem to prevent memory leaks in IE
                elem = null;
            },

            // Detach an event or set of events from an element
            remove: function(elem, types, handler, selector, mappedTypes) {
                var j, handleObj, tmp,
                    origCount, t, events,
                    special, handlers, type,
                    namespaces, origType,
                    elemData = jQuery.hasData(elem) && jQuery._data(elem);

                if (!elemData || !(events = elemData.events)) {
                    return;
                }

                // Once for each type.namespace in types; type may be omitted
                types = (types || "").match(rnotwhite) || [""];
                t = types.length;
                while (t--) {
                    tmp = rtypenamespace.exec(types[t]) || [];
                    type = origType = tmp[1];
                    namespaces = (tmp[2] || "").split(".").sort();

                    // Unbind all events (on this namespace, if provided) for the element
                    if (!type) {
                        for (type in events) {
                            jQuery.event.remove(elem, type + types[t], handler, selector, true);
                        }
                        continue;
                    }

                    special = jQuery.event.special[type] || {};
                    type = (selector ? special.delegateType : special.bindType) || type;
                    handlers = events[type] || [];
                    tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

                    // Remove matching events
                    origCount = j = handlers.length;
                    while (j--) {
                        handleObj = handlers[j];

                        if ((mappedTypes || origType === handleObj.origType) &&
                            (!handler || handler.guid === handleObj.guid) &&
                            (!tmp || tmp.test(handleObj.namespace)) &&
                            (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                            handlers.splice(j, 1);

                            if (handleObj.selector) {
                                handlers.delegateCount--;
                            }
                            if (special.remove) {
                                special.remove.call(elem, handleObj);
                            }
                        }
                    }

                    // Remove generic event handler if we removed something and no more handlers exist
                    // (avoids potential for endless recursion during removal of special event handlers)
                    if (origCount && !handlers.length) {
                        if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                            jQuery.removeEvent(elem, type, elemData.handle);
                        }

                        delete events[type];
                    }
                }

                // Remove the expando if it's no longer used
                if (jQuery.isEmptyObject(events)) {
                    delete elemData.handle;

                    // removeData also checks for emptiness and clears the expando if empty
                    // so use it instead of delete
                    jQuery._removeData(elem, "events");
                }
            },

            trigger: function(event, data, elem, onlyHandlers) {
                var handle, ontype, cur,
                    bubbleType, special, tmp, i,
                    eventPath = [elem || document],
                    type = hasOwn.call(event, "type") ? event.type : event,
                    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

                cur = tmp = elem = elem || document;

                // Don't do events on text and comment nodes
                if (elem.nodeType === 3 || elem.nodeType === 8) {
                    return;
                }

                // focus/blur morphs to focusin/out; ensure we're not firing them right now
                if (rfocusMorph.test(type + jQuery.event.triggered)) {
                    return;
                }

                if (type.indexOf(".") >= 0) {
                    // Namespaced trigger; create a regexp to match event type in handle()
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    namespaces.sort();
                }
                ontype = type.indexOf(":") < 0 && "on" + type;

                // Caller can pass in a jQuery.Event object, Object, or just an event type string
                event = event[jQuery.expando] ?
                    event :
                    new jQuery.Event(type, typeof event === "object" && event);

                // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
                event.isTrigger = onlyHandlers ? 2 : 3;
                event.namespace = namespaces.join(".");
                event.namespace_re = event.namespace ?
                    new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
                    null;

                // Clean up the event in case it is being reused
                event.result = undefined;
                if (!event.target) {
                    event.target = elem;
                }

                // Clone any incoming data and prepend the event, creating the handler arg list
                data = data == null ? [event] :
                    jQuery.makeArray(data, [event]);

                // Allow special events to draw outside the lines
                special = jQuery.event.special[type] || {};
                if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                    return;
                }

                // Determine event propagation path in advance, per W3C events spec (#9951)
                // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

                    bubbleType = special.delegateType || type;
                    if (!rfocusMorph.test(bubbleType + type)) {
                        cur = cur.parentNode;
                    }
                    for (; cur; cur = cur.parentNode) {
                        eventPath.push(cur);
                        tmp = cur;
                    }

                    // Only add window if we got to document (e.g., not plain obj or detached DOM)
                    if (tmp === (elem.ownerDocument || document)) {
                        eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                    }
                }

                // Fire handlers on the event path
                i = 0;
                while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

                    event.type = i > 1 ?
                        bubbleType :
                        special.bindType || type;

                    // jQuery handler
                    handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                    if (handle) {
                        handle.apply(cur, data);
                    }

                    // Native handler
                    handle = ontype && cur[ontype];
                    if (handle && handle.apply && jQuery.acceptData(cur)) {
                        event.result = handle.apply(cur, data);
                        if (event.result === false) {
                            event.preventDefault();
                        }
                    }
                }
                event.type = type;

                // If nobody prevented the default action, do it now
                if (!onlyHandlers && !event.isDefaultPrevented()) {

                    if ((!special._default || special._default.apply(eventPath.pop(), data) === false) &&
                        jQuery.acceptData(elem)) {

                        // Call a native DOM method on the target with the same name name as the event.
                        // Can't use an .isFunction() check here because IE6/7 fails that test.
                        // Don't do default actions on window, that's where global variables be (#6170)
                        if (ontype && elem[type] && !jQuery.isWindow(elem)) {

                            // Don't re-trigger an onFOO event when we call its FOO() method
                            tmp = elem[ontype];

                            if (tmp) {
                                elem[ontype] = null;
                            }

                            // Prevent re-triggering of the same event, since we already bubbled it above
                            jQuery.event.triggered = type;
                            try {
                                elem[type]();
                            } catch (e) {
                                // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                                // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                            }
                            jQuery.event.triggered = undefined;

                            if (tmp) {
                                elem[ontype] = tmp;
                            }
                        }
                    }
                }

                return event.result;
            },

            dispatch: function(event) {

                // Make a writable jQuery.Event from the native event object
                event = jQuery.event.fix(event);

                var i, ret, handleObj, matched, j,
                    handlerQueue = [],
                    args = slice.call(arguments),
                    handlers = (jQuery._data(this, "events") || {})[event.type] || [],
                    special = jQuery.event.special[event.type] || {};

                // Use the fix-ed jQuery.Event rather than the (read-only) native event
                args[0] = event;
                event.delegateTarget = this;

                // Call the preDispatch hook for the mapped type, and let it bail if desired
                if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                    return;
                }

                // Determine handlers
                handlerQueue = jQuery.event.handlers.call(this, event, handlers);

                // Run delegates first; they may want to stop propagation beneath us
                i = 0;
                while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                    event.currentTarget = matched.elem;

                    j = 0;
                    while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

                        // Triggered event must either 1) have no namespace, or
                        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                        if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {

                            event.handleObj = handleObj;
                            event.data = handleObj.data;

                            ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler)
                                .apply(matched.elem, args);

                            if (ret !== undefined) {
                                if ((event.result = ret) === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            }
                        }
                    }
                }

                // Call the postDispatch hook for the mapped type
                if (special.postDispatch) {
                    special.postDispatch.call(this, event);
                }

                return event.result;
            },

            handlers: function(event, handlers) {
                var sel, handleObj, matches, i,
                    handlerQueue = [],
                    delegateCount = handlers.delegateCount,
                    cur = event.target;

                // Find delegate handlers
                // Black-hole SVG <use> instance trees (#13180)
                // Avoid non-left-click bubbling in Firefox (#3861)
                if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {

                    /* jshint eqeqeq: false */
                    for (; cur != this; cur = cur.parentNode || this) {
                        /* jshint eqeqeq: true */

                        // Don't check non-elements (#13208)
                        // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                        if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
                            matches = [];
                            for (i = 0; i < delegateCount; i++) {
                                handleObj = handlers[i];

                                // Don't conflict with Object.prototype properties (#13203)
                                sel = handleObj.selector + " ";

                                if (matches[sel] === undefined) {
                                    matches[sel] = handleObj.needsContext ?
                                        jQuery(sel, this).index(cur) >= 0 :
                                        jQuery.find(sel, this, null, [cur]).length;
                                }
                                if (matches[sel]) {
                                    matches.push(handleObj);
                                }
                            }
                            if (matches.length) {
                                handlerQueue.push({
                                    elem: cur,
                                    handlers: matches
                                });
                            }
                        }
                    }
                }

                // Add the remaining (directly-bound) handlers
                if (delegateCount < handlers.length) {
                    handlerQueue.push({
                        elem: this,
                        handlers: handlers.slice(delegateCount)
                    });
                }

                return handlerQueue;
            },

            fix: function(event) {
                if (event[jQuery.expando]) {
                    return event;
                }

                // Create a writable copy of the event object and normalize some properties
                var i, prop, copy,
                    type = event.type,
                    originalEvent = event,
                    fixHook = this.fixHooks[type];

                if (!fixHook) {
                    this.fixHooks[type] = fixHook =
                        rmouseEvent.test(type) ? this.mouseHooks :
                        rkeyEvent.test(type) ? this.keyHooks : {};
                }
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

                event = new jQuery.Event(originalEvent);

                i = copy.length;
                while (i--) {
                    prop = copy[i];
                    event[prop] = originalEvent[prop];
                }

                // Support: IE<9
                // Fix target property (#1925)
                if (!event.target) {
                    event.target = originalEvent.srcElement || document;
                }

                // Support: Chrome 23+, Safari?
                // Target should not be a text node (#504, #13143)
                if (event.target.nodeType === 3) {
                    event.target = event.target.parentNode;
                }

                // Support: IE<9
                // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
                event.metaKey = !!event.metaKey;

                return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
            },

            // Includes some event props shared by KeyEvent and MouseEvent
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

            fixHooks: {},

            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(event, original) {

                    // Add which for key events
                    if (event.which == null) {
                        event.which = original.charCode != null ? original.charCode : original.keyCode;
                    }

                    return event;
                }
            },

            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(event, original) {
                    var body, eventDoc, doc,
                        button = original.button,
                        fromElement = original.fromElement;

                    // Calculate pageX/Y if missing and clientX/Y available
                    if (event.pageX == null && original.clientX != null) {
                        eventDoc = event.target.ownerDocument || document;
                        doc = eventDoc.documentElement;
                        body = eventDoc.body;

                        event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                        event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                    }

                    // Add relatedTarget, if necessary
                    if (!event.relatedTarget && fromElement) {
                        event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                    }

                    // Add which for click: 1 === left; 2 === middle; 3 === right
                    // Note: button is not normalized, so don't use it
                    if (!event.which && button !== undefined) {
                        event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                    }

                    return event;
                }
            },

            special: {
                load: {
                    // Prevent triggered image.load events from bubbling to window.load
                    noBubble: true
                },
                focus: {
                    // Fire native event if possible so blur/focus sequence is correct
                    trigger: function() {
                        if (this !== safeActiveElement() && this.focus) {
                            try {
                                this.focus();
                                return false;
                            } catch (e) {
                                // Support: IE<9
                                // If we error on focus to hidden element (#1486, #12518),
                                // let .trigger() run the handlers
                            }
                        }
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === safeActiveElement() && this.blur) {
                            this.blur();
                            return false;
                        }
                    },
                    delegateType: "focusout"
                },
                click: {
                    // For checkbox, fire native event so checked state will be right
                    trigger: function() {
                        if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                            this.click();
                            return false;
                        }
                    },

                    // For cross-browser consistency, don't fire native .click() on links
                    _default: function(event) {
                        return jQuery.nodeName(event.target, "a");
                    }
                },

                beforeunload: {
                    postDispatch: function(event) {

                        // Support: Firefox 20+
                        // Firefox doesn't alert if the returnValue field is not set.
                        if (event.result !== undefined && event.originalEvent) {
                            event.originalEvent.returnValue = event.result;
                        }
                    }
                }
            },

            simulate: function(type, elem, event, bubble) {
                // Piggyback on a donor event to simulate a different one.
                // Fake originalEvent to avoid donor's stopPropagation, but if the
                // simulated event prevents default then we do the same on the donor.
                var e = jQuery.extend(
                    new jQuery.Event(),
                    event, {
                        type: type,
                        isSimulated: true,
                        originalEvent: {}
                    }
                );
                if (bubble) {
                    jQuery.event.trigger(e, null, elem);
                } else {
                    jQuery.event.dispatch.call(elem, e);
                }
                if (e.isDefaultPrevented()) {
                    event.preventDefault();
                }
            }
        };

        jQuery.removeEvent = document.removeEventListener ?
            function(elem, type, handle) {
                if (elem.removeEventListener) {
                    elem.removeEventListener(type, handle, false);
                }
            } :
            function(elem, type, handle) {
                var name = "on" + type;

                if (elem.detachEvent) {

                    // #8545, #7054, preventing memory leaks for custom events in IE6-8
                    // detachEvent needed property on element, by name of that event, to properly expose it to GC
                    if (typeof elem[name] === strundefined) {
                        elem[name] = null;
                    }

                    elem.detachEvent(name, handle);
                }
            };

        jQuery.Event = function(src, props) {
            // Allow instantiation without the 'new' keyword
            if (!(this instanceof jQuery.Event)) {
                return new jQuery.Event(src, props);
            }

            // Event object
            if (src && src.type) {
                this.originalEvent = src;
                this.type = src.type;

                // Events bubbling up the document may have been marked as prevented
                // by a handler lower down the tree; reflect the correct value.
                this.isDefaultPrevented = src.defaultPrevented ||
                    src.defaultPrevented === undefined &&
                    // Support: IE < 9, Android < 4.0
                    src.returnValue === false ?
                    returnTrue :
                    returnFalse;

                // Event type
            } else {
                this.type = src;
            }

            // Put explicitly provided properties onto the event object
            if (props) {
                jQuery.extend(this, props);
            }

            // Create a timestamp if incoming event doesn't have one
            this.timeStamp = src && src.timeStamp || jQuery.now();

            // Mark it as fixed
            this[jQuery.expando] = true;
        };

        // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
        // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
        jQuery.Event.prototype = {
            isDefaultPrevented: returnFalse,
            isPropagationStopped: returnFalse,
            isImmediatePropagationStopped: returnFalse,

            preventDefault: function() {
                var e = this.originalEvent;

                this.isDefaultPrevented = returnTrue;
                if (!e) {
                    return;
                }

                // If preventDefault exists, run it on the original event
                if (e.preventDefault) {
                    e.preventDefault();

                    // Support: IE
                    // Otherwise set the returnValue property of the original event to false
                } else {
                    e.returnValue = false;
                }
            },
            stopPropagation: function() {
                var e = this.originalEvent;

                this.isPropagationStopped = returnTrue;
                if (!e) {
                    return;
                }
                // If stopPropagation exists, run it on the original event
                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                // Support: IE
                // Set the cancelBubble property of the original event to true
                e.cancelBubble = true;
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;

                this.isImmediatePropagationStopped = returnTrue;

                if (e && e.stopImmediatePropagation) {
                    e.stopImmediatePropagation();
                }

                this.stopPropagation();
            }
        };

        // Create mouseenter/leave events using mouseover/out and event-time checks
        jQuery.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(orig, fix) {
            jQuery.event.special[orig] = {
                delegateType: fix,
                bindType: fix,

                handle: function(event) {
                    var ret,
                        target = this,
                        related = event.relatedTarget,
                        handleObj = event.handleObj;

                    // For mousenter/leave call the handler if related is outside the target.
                    // NB: No relatedTarget if the mouse left/entered the browser window
                    if (!related || (related !== target && !jQuery.contains(target, related))) {
                        event.type = handleObj.origType;
                        ret = handleObj.handler.apply(this, arguments);
                        event.type = fix;
                    }
                    return ret;
                }
            };
        });

        // IE submit delegation
        if (!support.submitBubbles) {

            jQuery.event.special.submit = {
                setup: function() {
                    // Only need this for delegated form submit events
                    if (jQuery.nodeName(this, "form")) {
                        return false;
                    }

                    // Lazy-add a submit handler when a descendant form may potentially be submitted
                    jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                        // Node name check avoids a VML-related crash in IE (#9807)
                        var elem = e.target,
                            form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                        if (form && !jQuery._data(form, "submitBubbles")) {
                            jQuery.event.add(form, "submit._submit", function(event) {
                                event._submit_bubble = true;
                            });
                            jQuery._data(form, "submitBubbles", true);
                        }
                    });
                    // return undefined since we don't need an event listener
                },

                postDispatch: function(event) {
                    // If form was submitted by the user, bubble the event up the tree
                    if (event._submit_bubble) {
                        delete event._submit_bubble;
                        if (this.parentNode && !event.isTrigger) {
                            jQuery.event.simulate("submit", this.parentNode, event, true);
                        }
                    }
                },

                teardown: function() {
                    // Only need this for delegated form submit events
                    if (jQuery.nodeName(this, "form")) {
                        return false;
                    }

                    // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                    jQuery.event.remove(this, "._submit");
                }
            };
        }

        // IE change delegation and checkbox/radio fix
        if (!support.changeBubbles) {

            jQuery.event.special.change = {

                setup: function() {

                    if (rformElems.test(this.nodeName)) {
                        // IE doesn't fire change on a check/radio until blur; trigger it on click
                        // after a propertychange. Eat the blur-change in special.change.handle.
                        // This still fires onchange a second time for check/radio after blur.
                        if (this.type === "checkbox" || this.type === "radio") {
                            jQuery.event.add(this, "propertychange._change", function(event) {
                                if (event.originalEvent.propertyName === "checked") {
                                    this._just_changed = true;
                                }
                            });
                            jQuery.event.add(this, "click._change", function(event) {
                                if (this._just_changed && !event.isTrigger) {
                                    this._just_changed = false;
                                }
                                // Allow triggered, simulated change events (#11500)
                                jQuery.event.simulate("change", this, event, true);
                            });
                        }
                        return false;
                    }
                    // Delegated event; lazy-add a change handler on descendant inputs
                    jQuery.event.add(this, "beforeactivate._change", function(e) {
                        var elem = e.target;

                        if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles")) {
                            jQuery.event.add(elem, "change._change", function(event) {
                                if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                    jQuery.event.simulate("change", this.parentNode, event, true);
                                }
                            });
                            jQuery._data(elem, "changeBubbles", true);
                        }
                    });
                },

                handle: function(event) {
                    var elem = event.target;

                    // Swallow native change events from checkbox/radio, we already triggered them above
                    if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
                        return event.handleObj.handler.apply(this, arguments);
                    }
                },

                teardown: function() {
                    jQuery.event.remove(this, "._change");

                    return !rformElems.test(this.nodeName);
                }
            };
        }

        // Create "bubbling" focus and blur events
        if (!support.focusinBubbles) {
            jQuery.each({
                focus: "focusin",
                blur: "focusout"
            }, function(orig, fix) {

                // Attach a single capturing handler on the document while someone wants focusin/focusout
                var handler = function(event) {
                    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
                };

                jQuery.event.special[fix] = {
                    setup: function() {
                        var doc = this.ownerDocument || this,
                            attaches = jQuery._data(doc, fix);

                        if (!attaches) {
                            doc.addEventListener(orig, handler, true);
                        }
                        jQuery._data(doc, fix, (attaches || 0) + 1);
                    },
                    teardown: function() {
                        var doc = this.ownerDocument || this,
                            attaches = jQuery._data(doc, fix) - 1;

                        if (!attaches) {
                            doc.removeEventListener(orig, handler, true);
                            jQuery._removeData(doc, fix);
                        } else {
                            jQuery._data(doc, fix, attaches);
                        }
                    }
                };
            });
        }

        jQuery.fn.extend({

            on: function(types, selector, data, fn, /*INTERNAL*/ one) {
                var type, origFn;

                // Types can be a map of types/handlers
                if (typeof types === "object") {
                    // ( types-Object, selector, data )
                    if (typeof selector !== "string") {
                        // ( types-Object, data )
                        data = data || selector;
                        selector = undefined;
                    }
                    for (type in types) {
                        this.on(type, selector, data, types[type], one);
                    }
                    return this;
                }

                if (data == null && fn == null) {
                    // ( types, fn )
                    fn = selector;
                    data = selector = undefined;
                } else if (fn == null) {
                    if (typeof selector === "string") {
                        // ( types, selector, fn )
                        fn = data;
                        data = undefined;
                    } else {
                        // ( types, data, fn )
                        fn = data;
                        data = selector;
                        selector = undefined;
                    }
                }
                if (fn === false) {
                    fn = returnFalse;
                } else if (!fn) {
                    return this;
                }

                if (one === 1) {
                    origFn = fn;
                    fn = function(event) {
                        // Can use an empty set, since event contains the info
                        jQuery().off(event);
                        return origFn.apply(this, arguments);
                    };
                    // Use same guid so caller can remove using origFn
                    fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
                }
                return this.each(function() {
                    jQuery.event.add(this, types, fn, data, selector);
                });
            },
            one: function(types, selector, data, fn) {
                return this.on(types, selector, data, fn, 1);
            },
            off: function(types, selector, fn) {
                var handleObj, type;
                if (types && types.preventDefault && types.handleObj) {
                    // ( event )  dispatched jQuery.Event
                    handleObj = types.handleObj;
                    jQuery(types.delegateTarget).off(
                        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                        handleObj.selector,
                        handleObj.handler
                    );
                    return this;
                }
                if (typeof types === "object") {
                    // ( types-object [, selector] )
                    for (type in types) {
                        this.off(type, selector, types[type]);
                    }
                    return this;
                }
                if (selector === false || typeof selector === "function") {
                    // ( types [, fn] )
                    fn = selector;
                    selector = undefined;
                }
                if (fn === false) {
                    fn = returnFalse;
                }
                return this.each(function() {
                    jQuery.event.remove(this, types, fn, selector);
                });
            },

            trigger: function(type, data) {
                return this.each(function() {
                    jQuery.event.trigger(type, data, this);
                });
            },
            triggerHandler: function(type, data) {
                var elem = this[0];
                if (elem) {
                    return jQuery.event.trigger(type, data, elem, true);
                }
            }
        });


        function createSafeFragment(document) {
            var list = nodeNames.split("|"),
                safeFrag = document.createDocumentFragment();

            if (safeFrag.createElement) {
                while (list.length) {
                    safeFrag.createElement(
                        list.pop()
                    );
                }
            }
            return safeFrag;
        }

        var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
            rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
            rleadingWhitespace = /^\s+/,
            rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            rtagName = /<([\w:]+)/,
            rtbody = /<tbody/i,
            rhtml = /<|&#?\w+;/,
            rnoInnerhtml = /<(?:script|style|link)/i,
            // checked="checked" or checked
            rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
            rscriptType = /^$|\/(?:java|ecma)script/i,
            rscriptTypeMasked = /^true\/(.*)/,
            rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

            // We have to close these tags to support XHTML (#13200)
            wrapMap = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                area: [1, "<map>", "</map>"],
                param: [1, "<object>", "</object>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

                // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
                // unless wrapped in a div with non-breaking characters in front of it.
                _default: support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
            },
            safeFragment = createSafeFragment(document),
            fragmentDiv = safeFragment.appendChild(document.createElement("div"));

        wrapMap.optgroup = wrapMap.option;
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;

        function getAll(context, tag) {
            var elems, elem,
                i = 0,
                found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag || "*") :
                typeof context.querySelectorAll !== strundefined ? context.querySelectorAll(tag || "*") :
                undefined;

            if (!found) {
                for (found = [], elems = context.childNodes || context;
                    (elem = elems[i]) != null; i++) {
                    if (!tag || jQuery.nodeName(elem, tag)) {
                        found.push(elem);
                    } else {
                        jQuery.merge(found, getAll(elem, tag));
                    }
                }
            }

            return tag === undefined || tag && jQuery.nodeName(context, tag) ?
                jQuery.merge([context], found) :
                found;
        }

        // Used in buildFragment, fixes the defaultChecked property
        function fixDefaultChecked(elem) {
            if (rcheckableType.test(elem.type)) {
                elem.defaultChecked = elem.checked;
            }
        }

        // Support: IE<8
        // Manipulating tables requires a tbody
        function manipulationTarget(elem, content) {
            return jQuery.nodeName(elem, "table") &&
                jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ?

                elem.getElementsByTagName("tbody")[0] ||
                elem.appendChild(elem.ownerDocument.createElement("tbody")) :
                elem;
        }

        // Replace/restore the type attribute of script elements for safe DOM manipulation
        function disableScript(elem) {
            elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
            return elem;
        }

        function restoreScript(elem) {
            var match = rscriptTypeMasked.exec(elem.type);
            if (match) {
                elem.type = match[1];
            } else {
                elem.removeAttribute("type");
            }
            return elem;
        }

        // Mark scripts as having already been evaluated
        function setGlobalEval(elems, refElements) {
            var elem,
                i = 0;
            for (;
                (elem = elems[i]) != null; i++) {
                jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
            }
        }

        function cloneCopyEvent(src, dest) {

            if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
                return;
            }

            var type, i, l,
                oldData = jQuery._data(src),
                curData = jQuery._data(dest, oldData),
                events = oldData.events;

            if (events) {
                delete curData.handle;
                curData.events = {};

                for (type in events) {
                    for (i = 0, l = events[type].length; i < l; i++) {
                        jQuery.event.add(dest, type, events[type][i]);
                    }
                }
            }

            // make the cloned public data object a copy from the original
            if (curData.data) {
                curData.data = jQuery.extend({}, curData.data);
            }
        }

        function fixCloneNodeIssues(src, dest) {
            var nodeName, e, data;

            // We do not need to do anything for non-Elements
            if (dest.nodeType !== 1) {
                return;
            }

            nodeName = dest.nodeName.toLowerCase();

            // IE6-8 copies events bound via attachEvent when using cloneNode.
            if (!support.noCloneEvent && dest[jQuery.expando]) {
                data = jQuery._data(dest);

                for (e in data.events) {
                    jQuery.removeEvent(dest, e, data.handle);
                }

                // Event data gets referenced instead of copied if the expando gets copied too
                dest.removeAttribute(jQuery.expando);
            }

            // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
            if (nodeName === "script" && dest.text !== src.text) {
                disableScript(dest).text = src.text;
                restoreScript(dest);

                // IE6-10 improperly clones children of object elements using classid.
                // IE10 throws NoModificationAllowedError if parent is null, #12132.
            } else if (nodeName === "object") {
                if (dest.parentNode) {
                    dest.outerHTML = src.outerHTML;
                }

                // This path appears unavoidable for IE9. When cloning an object
                // element in IE9, the outerHTML strategy above is not sufficient.
                // If the src has innerHTML and the destination does not,
                // copy the src.innerHTML into the dest.innerHTML. #10324
                if (support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                    dest.innerHTML = src.innerHTML;
                }

            } else if (nodeName === "input" && rcheckableType.test(src.type)) {
                // IE6-8 fails to persist the checked state of a cloned checkbox
                // or radio button. Worse, IE6-7 fail to give the cloned element
                // a checked appearance if the defaultChecked value isn't also set

                dest.defaultChecked = dest.checked = src.checked;

                // IE6-7 get confused and end up setting the value of a cloned
                // checkbox/radio button to an empty string instead of "on"
                if (dest.value !== src.value) {
                    dest.value = src.value;
                }

                // IE6-8 fails to return the selected option to the default selected
                // state when cloning options
            } else if (nodeName === "option") {
                dest.defaultSelected = dest.selected = src.defaultSelected;

                // IE6-8 fails to set the defaultValue to the correct value when
                // cloning other types of input fields
            } else if (nodeName === "input" || nodeName === "textarea") {
                dest.defaultValue = src.defaultValue;
            }
        }

        jQuery.extend({
            clone: function(elem, dataAndEvents, deepDataAndEvents) {
                var destElements, node, clone, i, srcElements,
                    inPage = jQuery.contains(elem.ownerDocument, elem);

                if (support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                    clone = elem.cloneNode(true);

                    // IE<=8 does not properly clone detached, unknown element nodes
                } else {
                    fragmentDiv.innerHTML = elem.outerHTML;
                    fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
                }

                if ((!support.noCloneEvent || !support.noCloneChecked) &&
                    (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

                    // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                    destElements = getAll(clone);
                    srcElements = getAll(elem);

                    // Fix all IE cloning issues
                    for (i = 0;
                        (node = srcElements[i]) != null; ++i) {
                        // Ensure that the destination node is not null; Fixes #9587
                        if (destElements[i]) {
                            fixCloneNodeIssues(node, destElements[i]);
                        }
                    }
                }

                // Copy the events from the original to the clone
                if (dataAndEvents) {
                    if (deepDataAndEvents) {
                        srcElements = srcElements || getAll(elem);
                        destElements = destElements || getAll(clone);

                        for (i = 0;
                            (node = srcElements[i]) != null; i++) {
                            cloneCopyEvent(node, destElements[i]);
                        }
                    } else {
                        cloneCopyEvent(elem, clone);
                    }
                }

                // Preserve script evaluation history
                destElements = getAll(clone, "script");
                if (destElements.length > 0) {
                    setGlobalEval(destElements, !inPage && getAll(elem, "script"));
                }

                destElements = srcElements = node = null;

                // Return the cloned set
                return clone;
            },

            buildFragment: function(elems, context, scripts, selection) {
                var j, elem, contains,
                    tmp, tag, tbody, wrap,
                    l = elems.length,

                    // Ensure a safe fragment
                    safe = createSafeFragment(context),

                    nodes = [],
                    i = 0;

                for (; i < l; i++) {
                    elem = elems[i];

                    if (elem || elem === 0) {

                        // Add nodes directly
                        if (jQuery.type(elem) === "object") {
                            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                            // Convert non-html into a text node
                        } else if (!rhtml.test(elem)) {
                            nodes.push(context.createTextNode(elem));

                            // Convert html into DOM nodes
                        } else {
                            tmp = tmp || safe.appendChild(context.createElement("div"));

                            // Deserialize a standard representation
                            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                            wrap = wrapMap[tag] || wrapMap._default;

                            tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

                            // Descend through wrappers to the right content
                            j = wrap[0];
                            while (j--) {
                                tmp = tmp.lastChild;
                            }

                            // Manually add leading whitespace removed by IE
                            if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                                nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                            }

                            // Remove IE's autoinserted <tbody> from table fragments
                            if (!support.tbody) {

                                // String was a <table>, *may* have spurious <tbody>
                                elem = tag === "table" && !rtbody.test(elem) ?
                                    tmp.firstChild :

                                    // String was a bare <thead> or <tfoot>
                                    wrap[1] === "<table>" && !rtbody.test(elem) ?
                                    tmp :
                                    0;

                                j = elem && elem.childNodes.length;
                                while (j--) {
                                    if (jQuery.nodeName((tbody = elem.childNodes[j]), "tbody") && !tbody.childNodes.length) {
                                        elem.removeChild(tbody);
                                    }
                                }
                            }

                            jQuery.merge(nodes, tmp.childNodes);

                            // Fix #12392 for WebKit and IE > 9
                            tmp.textContent = "";

                            // Fix #12392 for oldIE
                            while (tmp.firstChild) {
                                tmp.removeChild(tmp.firstChild);
                            }

                            // Remember the top-level container for proper cleanup
                            tmp = safe.lastChild;
                        }
                    }
                }

                // Fix #11356: Clear elements from fragment
                if (tmp) {
                    safe.removeChild(tmp);
                }

                // Reset defaultChecked for any radios and checkboxes
                // about to be appended to the DOM in IE 6/7 (#8060)
                if (!support.appendChecked) {
                    jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
                }

                i = 0;
                while ((elem = nodes[i++])) {

                    // #4087 - If origin and destination elements are the same, and this is
                    // that element, do not do anything
                    if (selection && jQuery.inArray(elem, selection) !== -1) {
                        continue;
                    }

                    contains = jQuery.contains(elem.ownerDocument, elem);

                    // Append to fragment
                    tmp = getAll(safe.appendChild(elem), "script");

                    // Preserve script evaluation history
                    if (contains) {
                        setGlobalEval(tmp);
                    }

                    // Capture executables
                    if (scripts) {
                        j = 0;
                        while ((elem = tmp[j++])) {
                            if (rscriptType.test(elem.type || "")) {
                                scripts.push(elem);
                            }
                        }
                    }
                }

                tmp = null;

                return safe;
            },

            cleanData: function(elems, /* internal */ acceptData) {
                var elem, type, id, data,
                    i = 0,
                    internalKey = jQuery.expando,
                    cache = jQuery.cache,
                    deleteExpando = support.deleteExpando,
                    special = jQuery.event.special;

                for (;
                    (elem = elems[i]) != null; i++) {
                    if (acceptData || jQuery.acceptData(elem)) {

                        id = elem[internalKey];
                        data = id && cache[id];

                        if (data) {
                            if (data.events) {
                                for (type in data.events) {
                                    if (special[type]) {
                                        jQuery.event.remove(elem, type);

                                        // This is a shortcut to avoid jQuery.event.remove's overhead
                                    } else {
                                        jQuery.removeEvent(elem, type, data.handle);
                                    }
                                }
                            }

                            // Remove cache only if it was not already removed by jQuery.event.remove
                            if (cache[id]) {

                                delete cache[id];

                                // IE does not allow us to delete expando properties from nodes,
                                // nor does it have a removeAttribute function on Document nodes;
                                // we must handle all of these cases
                                if (deleteExpando) {
                                    delete elem[internalKey];

                                } else if (typeof elem.removeAttribute !== strundefined) {
                                    elem.removeAttribute(internalKey);

                                } else {
                                    elem[internalKey] = null;
                                }

                                deletedIds.push(id);
                            }
                        }
                    }
                }
            }
        });

        jQuery.fn.extend({
            text: function(value) {
                return access(this, function(value) {
                    return value === undefined ?
                        jQuery.text(this) :
                        this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
                }, null, value, arguments.length);
            },

            append: function() {
                return this.domManip(arguments, function(elem) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var target = manipulationTarget(this, elem);
                        target.appendChild(elem);
                    }
                });
            },

            prepend: function() {
                return this.domManip(arguments, function(elem) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var target = manipulationTarget(this, elem);
                        target.insertBefore(elem, target.firstChild);
                    }
                });
            },

            before: function() {
                return this.domManip(arguments, function(elem) {
                    if (this.parentNode) {
                        this.parentNode.insertBefore(elem, this);
                    }
                });
            },

            after: function() {
                return this.domManip(arguments, function(elem) {
                    if (this.parentNode) {
                        this.parentNode.insertBefore(elem, this.nextSibling);
                    }
                });
            },

            remove: function(selector, keepData /* Internal Use Only */ ) {
                var elem,
                    elems = selector ? jQuery.filter(selector, this) : this,
                    i = 0;

                for (;
                    (elem = elems[i]) != null; i++) {

                    if (!keepData && elem.nodeType === 1) {
                        jQuery.cleanData(getAll(elem));
                    }

                    if (elem.parentNode) {
                        if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                            setGlobalEval(getAll(elem, "script"));
                        }
                        elem.parentNode.removeChild(elem);
                    }
                }

                return this;
            },

            empty: function() {
                var elem,
                    i = 0;

                for (;
                    (elem = this[i]) != null; i++) {
                    // Remove element nodes and prevent memory leaks
                    if (elem.nodeType === 1) {
                        jQuery.cleanData(getAll(elem, false));
                    }

                    // Remove any remaining nodes
                    while (elem.firstChild) {
                        elem.removeChild(elem.firstChild);
                    }

                    // If this is a select, ensure that it displays empty (#12336)
                    // Support: IE<9
                    if (elem.options && jQuery.nodeName(elem, "select")) {
                        elem.options.length = 0;
                    }
                }

                return this;
            },

            clone: function(dataAndEvents, deepDataAndEvents) {
                dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
                deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

                return this.map(function() {
                    return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
                });
            },

            html: function(value) {
                return access(this, function(value) {
                    var elem = this[0] || {},
                        i = 0,
                        l = this.length;

                    if (value === undefined) {
                        return elem.nodeType === 1 ?
                            elem.innerHTML.replace(rinlinejQuery, "") :
                            undefined;
                    }

                    // See if we can take a shortcut and just use innerHTML
                    if (typeof value === "string" && !rnoInnerhtml.test(value) &&
                        (support.htmlSerialize || !rnoshimcache.test(value)) &&
                        (support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
                        !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                        value = value.replace(rxhtmlTag, "<$1></$2>");

                        try {
                            for (; i < l; i++) {
                                // Remove element nodes and prevent memory leaks
                                elem = this[i] || {};
                                if (elem.nodeType === 1) {
                                    jQuery.cleanData(getAll(elem, false));
                                    elem.innerHTML = value;
                                }
                            }

                            elem = 0;

                            // If using innerHTML throws an exception, use the fallback method
                        } catch (e) {}
                    }

                    if (elem) {
                        this.empty().append(value);
                    }
                }, null, value, arguments.length);
            },

            replaceWith: function() {
                var arg = arguments[0];

                // Make the changes, replacing each context element with the new content
                this.domManip(arguments, function(elem) {
                    arg = this.parentNode;

                    jQuery.cleanData(getAll(this));

                    if (arg) {
                        arg.replaceChild(elem, this);
                    }
                });

                // Force removal if there was no new content (e.g., from empty arguments)
                return arg && (arg.length || arg.nodeType) ? this : this.remove();
            },

            detach: function(selector) {
                return this.remove(selector, true);
            },

            domManip: function(args, callback) {

                // Flatten any nested arrays
                args = concat.apply([], args);

                var first, node, hasScripts,
                    scripts, doc, fragment,
                    i = 0,
                    l = this.length,
                    set = this,
                    iNoClone = l - 1,
                    value = args[0],
                    isFunction = jQuery.isFunction(value);

                // We can't cloneNode fragments that contain checked, in WebKit
                if (isFunction ||
                    (l > 1 && typeof value === "string" &&
                        !support.checkClone && rchecked.test(value))) {
                    return this.each(function(index) {
                        var self = set.eq(index);
                        if (isFunction) {
                            args[0] = value.call(this, index, self.html());
                        }
                        self.domManip(args, callback);
                    });
                }

                if (l) {
                    fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
                    first = fragment.firstChild;

                    if (fragment.childNodes.length === 1) {
                        fragment = first;
                    }

                    if (first) {
                        scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                        hasScripts = scripts.length;

                        // Use the original fragment for the last item instead of the first because it can end up
                        // being emptied incorrectly in certain situations (#8070).
                        for (; i < l; i++) {
                            node = fragment;

                            if (i !== iNoClone) {
                                node = jQuery.clone(node, true, true);

                                // Keep references to cloned scripts for later restoration
                                if (hasScripts) {
                                    jQuery.merge(scripts, getAll(node, "script"));
                                }
                            }

                            callback.call(this[i], node, i);
                        }

                        if (hasScripts) {
                            doc = scripts[scripts.length - 1].ownerDocument;

                            // Reenable scripts
                            jQuery.map(scripts, restoreScript);

                            // Evaluate executable scripts on first document insertion
                            for (i = 0; i < hasScripts; i++) {
                                node = scripts[i];
                                if (rscriptType.test(node.type || "") &&
                                    !jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {

                                    if (node.src) {
                                        // Optional AJAX dependency, but won't run scripts if not present
                                        if (jQuery._evalUrl) {
                                            jQuery._evalUrl(node.src);
                                        }
                                    } else {
                                        jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
                                    }
                                }
                            }
                        }

                        // Fix #11809: Avoid leaking memory
                        fragment = first = null;
                    }
                }

                return this;
            }
        });

        jQuery.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(name, original) {
            jQuery.fn[name] = function(selector) {
                var elems,
                    i = 0,
                    ret = [],
                    insert = jQuery(selector),
                    last = insert.length - 1;

                for (; i <= last; i++) {
                    elems = i === last ? this : this.clone(true);
                    jQuery(insert[i])[original](elems);

                    // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
                    push.apply(ret, elems.get());
                }

                return this.pushStack(ret);
            };
        });


        var iframe,
            elemdisplay = {};

        /**
         * Retrieve the actual display of a element
         * @param {String} name nodeName of the element
         * @param {Object} doc Document object
         */
        // Called only from within defaultDisplay
        function actualDisplay(name, doc) {
            var style,
                elem = jQuery(doc.createElement(name)).appendTo(doc.body),

                // getDefaultComputedStyle might be reliably used only on attached element
                display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ?

                // Use of this method is a temporary fix (more like optmization) until something better comes along,
                // since it was removed from specification and supported only in FF
                style.display : jQuery.css(elem[0], "display");

            // We don't have any data stored on the element,
            // so use "detach" method as fast way to get rid of the element
            elem.detach();

            return display;
        }

        /**
         * Try to determine the default display value of an element
         * @param {String} nodeName
         */
        function defaultDisplay(nodeName) {
            var doc = document,
                display = elemdisplay[nodeName];

            if (!display) {
                display = actualDisplay(nodeName, doc);

                // If the simple way fails, read from inside an iframe
                if (display === "none" || !display) {

                    // Use the already-created iframe if possible
                    iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);

                    // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                    doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;

                    // Support: IE
                    doc.write();
                    doc.close();

                    display = actualDisplay(nodeName, doc);
                    iframe.detach();
                }

                // Store the correct default display
                elemdisplay[nodeName] = display;
            }

            return display;
        }


        (function() {
            var shrinkWrapBlocksVal;

            support.shrinkWrapBlocks = function() {
                if (shrinkWrapBlocksVal != null) {
                    return shrinkWrapBlocksVal;
                }

                // Will be changed later if needed.
                shrinkWrapBlocksVal = false;

                // Minified: var b,c,d
                var div, body, container;

                body = document.getElementsByTagName("body")[0];
                if (!body || !body.style) {
                    // Test fired too early or in an unsupported environment, exit.
                    return;
                }

                // Setup
                div = document.createElement("div");
                container = document.createElement("div");
                container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
                body.appendChild(container).appendChild(div);

                // Support: IE6
                // Check if elements with layout shrink-wrap their children
                if (typeof div.style.zoom !== strundefined) {
                    // Reset CSS: box-sizing; display; margin; border
                    div.style.cssText =
                        // Support: Firefox<29, Android 2.3
                        // Vendor-prefix box-sizing
                        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
                        "box-sizing:content-box;display:block;margin:0;border:0;" +
                        "padding:1px;width:1px;zoom:1";
                    div.appendChild(document.createElement("div")).style.width = "5px";
                    shrinkWrapBlocksVal = div.offsetWidth !== 3;
                }

                body.removeChild(container);

                return shrinkWrapBlocksVal;
            };

        })();
        var rmargin = (/^margin/);

        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");



        var getStyles, curCSS,
            rposition = /^(top|right|bottom|left)$/;

        if (window.getComputedStyle) {
            getStyles = function(elem) {
                return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
            };

            curCSS = function(elem, name, computed) {
                var width, minWidth, maxWidth, ret,
                    style = elem.style;

                computed = computed || getStyles(elem);

                // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

                if (computed) {

                    if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                        ret = jQuery.style(elem, name);
                    }

                    // A tribute to the "awesome hack by Dean Edwards"
                    // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                    // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                    // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                    if (rnumnonpx.test(ret) && rmargin.test(name)) {

                        // Remember the original values
                        width = style.width;
                        minWidth = style.minWidth;
                        maxWidth = style.maxWidth;

                        // Put in the new values to get a computed value out
                        style.minWidth = style.maxWidth = style.width = ret;
                        ret = computed.width;

                        // Revert the changed values
                        style.width = width;
                        style.minWidth = minWidth;
                        style.maxWidth = maxWidth;
                    }
                }

                // Support: IE
                // IE returns zIndex value as an integer.
                return ret === undefined ?
                    ret :
                    ret + "";
            };
        } else if (document.documentElement.currentStyle) {
            getStyles = function(elem) {
                return elem.currentStyle;
            };

            curCSS = function(elem, name, computed) {
                var left, rs, rsLeft, ret,
                    style = elem.style;

                computed = computed || getStyles(elem);
                ret = computed ? computed[name] : undefined;

                // Avoid setting ret to empty string here
                // so we don't default to auto
                if (ret == null && style && style[name]) {
                    ret = style[name];
                }

                // From the awesome hack by Dean Edwards
                // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

                // If we're not dealing with a regular pixel number
                // but a number that has a weird ending, we need to convert it to pixels
                // but not position css attributes, as those are proportional to the parent element instead
                // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
                if (rnumnonpx.test(ret) && !rposition.test(name)) {

                    // Remember the original values
                    left = style.left;
                    rs = elem.runtimeStyle;
                    rsLeft = rs && rs.left;

                    // Put in the new values to get a computed value out
                    if (rsLeft) {
                        rs.left = elem.currentStyle.left;
                    }
                    style.left = name === "fontSize" ? "1em" : ret;
                    ret = style.pixelLeft + "px";

                    // Revert the changed values
                    style.left = left;
                    if (rsLeft) {
                        rs.left = rsLeft;
                    }
                }

                // Support: IE
                // IE returns zIndex value as an integer.
                return ret === undefined ?
                    ret :
                    ret + "" || "auto";
            };
        }




        function addGetHookIf(conditionFn, hookFn) {
            // Define the hook, we'll check on the first run if it's really needed.
            return {
                get: function() {
                    var condition = conditionFn();

                    if (condition == null) {
                        // The test was not ready at this point; screw the hook this time
                        // but check again when needed next time.
                        return;
                    }

                    if (condition) {
                        // Hook not needed (or it's not possible to use it due to missing dependency),
                        // remove it.
                        // Since there are no other hooks for marginRight, remove the whole object.
                        delete this.get;
                        return;
                    }

                    // Hook needed; redefine it so that the support test is not executed again.

                    return (this.get = hookFn).apply(this, arguments);
                }
            };
        }


        (function() {
            // Minified: var b,c,d,e,f,g, h,i
            var div, style, a, pixelPositionVal, boxSizingReliableVal,
                reliableHiddenOffsetsVal, reliableMarginRightVal;

            // Setup
            div = document.createElement("div");
            div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
            a = div.getElementsByTagName("a")[0];
            style = a && a.style;

            // Finish early in limited (non-browser) environments
            if (!style) {
                return;
            }

            style.cssText = "float:left;opacity:.5";

            // Support: IE<9
            // Make sure that element opacity exists (as opposed to filter)
            support.opacity = style.opacity === "0.5";

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            support.cssFloat = !!style.cssFloat;

            div.style.backgroundClip = "content-box";
            div.cloneNode(true).style.backgroundClip = "";
            support.clearCloneStyle = div.style.backgroundClip === "content-box";

            // Support: Firefox<29, Android 2.3
            // Vendor-prefix box-sizing
            support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" ||
                style.WebkitBoxSizing === "";

            jQuery.extend(support, {
                reliableHiddenOffsets: function() {
                    if (reliableHiddenOffsetsVal == null) {
                        computeStyleTests();
                    }
                    return reliableHiddenOffsetsVal;
                },

                boxSizingReliable: function() {
                    if (boxSizingReliableVal == null) {
                        computeStyleTests();
                    }
                    return boxSizingReliableVal;
                },

                pixelPosition: function() {
                    if (pixelPositionVal == null) {
                        computeStyleTests();
                    }
                    return pixelPositionVal;
                },

                // Support: Android 2.3
                reliableMarginRight: function() {
                    if (reliableMarginRightVal == null) {
                        computeStyleTests();
                    }
                    return reliableMarginRightVal;
                }
            });

            function computeStyleTests() {
                // Minified: var b,c,d,j
                var div, body, container, contents;

                body = document.getElementsByTagName("body")[0];
                if (!body || !body.style) {
                    // Test fired too early or in an unsupported environment, exit.
                    return;
                }

                // Setup
                div = document.createElement("div");
                container = document.createElement("div");
                container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
                body.appendChild(container).appendChild(div);

                div.style.cssText =
                    // Support: Firefox<29, Android 2.3
                    // Vendor-prefix box-sizing
                    "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
                    "box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
                    "border:1px;padding:1px;width:4px;position:absolute";

                // Support: IE<9
                // Assume reasonable values in the absence of getComputedStyle
                pixelPositionVal = boxSizingReliableVal = false;
                reliableMarginRightVal = true;

                // Check for getComputedStyle so that this code is not run in IE<9.
                if (window.getComputedStyle) {
                    pixelPositionVal = (window.getComputedStyle(div, null) || {}).top !== "1%";
                    boxSizingReliableVal =
                        (window.getComputedStyle(div, null) || {
                            width: "4px"
                        }).width === "4px";

                    // Support: Android 2.3
                    // Div with explicit width and no margin-right incorrectly
                    // gets computed margin-right based on width of container (#3333)
                    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                    contents = div.appendChild(document.createElement("div"));

                    // Reset CSS: box-sizing; display; margin; border; padding
                    contents.style.cssText = div.style.cssText =
                        // Support: Firefox<29, Android 2.3
                        // Vendor-prefix box-sizing
                        "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
                        "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
                    contents.style.marginRight = contents.style.width = "0";
                    div.style.width = "1px";

                    reliableMarginRightVal = !parseFloat((window.getComputedStyle(contents, null) || {}).marginRight);
                }

                // Support: IE8
                // Check if table cells still have offsetWidth/Height when they are set
                // to display:none and there are still other visible table cells in a
                // table row; if so, offsetWidth/Height are not reliable for use when
                // determining if an element has been hidden directly using
                // display:none (it is still safe to use offsets if a parent element is
                // hidden; don safety goggles and see bug #4512 for more information).
                div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
                contents = div.getElementsByTagName("td");
                contents[0].style.cssText = "margin:0;border:0;padding:0;display:none";
                reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
                if (reliableHiddenOffsetsVal) {
                    contents[0].style.display = "";
                    contents[1].style.display = "none";
                    reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
                }

                body.removeChild(container);
            }

        })();


        // A method for quickly swapping in/out CSS properties to get correct calculations.
        jQuery.swap = function(elem, options, callback, args) {
            var ret, name,
                old = {};

            // Remember the old values, and insert the new ones
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            ret = callback.apply(elem, args || []);

            // Revert the old values
            for (name in options) {
                elem.style[name] = old[name];
            }

            return ret;
        };


        var
            ralpha = /alpha\([^)]*\)/i,
            ropacity = /opacity\s*=\s*([^)]*)/,

            // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
            // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
            rdisplayswap = /^(none|table(?!-c[ea]).+)/,
            rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"),
            rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"),

            cssShow = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            cssNormalTransform = {
                letterSpacing: "0",
                fontWeight: "400"
            },

            cssPrefixes = ["Webkit", "O", "Moz", "ms"];


        // return a css property mapped to a potentially vendor prefixed property
        function vendorPropName(style, name) {

            // shortcut for names that are not vendor prefixed
            if (name in style) {
                return name;
            }

            // check for vendor prefixed names
            var capName = name.charAt(0).toUpperCase() + name.slice(1),
                origName = name,
                i = cssPrefixes.length;

            while (i--) {
                name = cssPrefixes[i] + capName;
                if (name in style) {
                    return name;
                }
            }

            return origName;
        }

        function showHide(elements, show) {
            var display, elem, hidden,
                values = [],
                index = 0,
                length = elements.length;

            for (; index < length; index++) {
                elem = elements[index];
                if (!elem.style) {
                    continue;
                }

                values[index] = jQuery._data(elem, "olddisplay");
                display = elem.style.display;
                if (show) {
                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if (!values[index] && display === "none") {
                        elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if (elem.style.display === "" && isHidden(elem)) {
                        values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                    }
                } else {
                    hidden = isHidden(elem);

                    if (display && display !== "none" || !hidden) {
                        jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
                    }
                }
            }

            // Set the display of most of the elements in a second loop
            // to avoid the constant reflow
            for (index = 0; index < length; index++) {
                elem = elements[index];
                if (!elem.style) {
                    continue;
                }
                if (!show || elem.style.display === "none" || elem.style.display === "") {
                    elem.style.display = show ? values[index] || "" : "none";
                }
            }

            return elements;
        }

        function setPositiveNumber(elem, value, subtract) {
            var matches = rnumsplit.exec(value);
            return matches ?
                // Guard against undefined "subtract", e.g., when used as in cssHooks
                Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
                value;
        }

        function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
            var i = extra === (isBorderBox ? "border" : "content") ?
                // If we already have the right measurement, avoid augmentation
                4 :
                // Otherwise initialize for horizontal or vertical properties
                name === "width" ? 1 : 0,

                val = 0;

            for (; i < 4; i += 2) {
                // both box models exclude margin, so add it if we want it
                if (extra === "margin") {
                    val += jQuery.css(elem, extra + cssExpand[i], true, styles);
                }

                if (isBorderBox) {
                    // border-box includes padding, so remove it if we want content
                    if (extra === "content") {
                        val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                    }

                    // at this point, extra isn't border nor margin, so remove border
                    if (extra !== "margin") {
                        val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                    }
                } else {
                    // at this point, extra isn't content, so add padding
                    val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

                    // at this point, extra isn't content nor padding, so add border
                    if (extra !== "padding") {
                        val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                    }
                }
            }

            return val;
        }

        function getWidthOrHeight(elem, name, extra) {

            // Start with offset property, which is equivalent to the border-box value
            var valueIsBorderBox = true,
                val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
                styles = getStyles(elem),
                isBorderBox = support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";

            // some non-html elements return undefined for offsetWidth, so check for null/undefined
            // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
            // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
            if (val <= 0 || val == null) {
                // Fall back to computed then uncomputed css if necessary
                val = curCSS(elem, name, styles);
                if (val < 0 || val == null) {
                    val = elem.style[name];
                }

                // Computed unit is not pixels. Stop here and return.
                if (rnumnonpx.test(val)) {
                    return val;
                }

                // we need the check for style in case a browser which returns unreliable values
                // for getComputedStyle silently falls back to the reliable elem.style
                valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

                // Normalize "", auto, and prepare for extra
                val = parseFloat(val) || 0;
            }

            // use the active box-sizing model to add/subtract irrelevant styles
            return (val +
                augmentWidthOrHeight(
                    elem,
                    name,
                    extra || (isBorderBox ? "border" : "content"),
                    valueIsBorderBox,
                    styles
                )
            ) + "px";
        }

        jQuery.extend({
            // Add in style property hooks for overriding the default
            // behavior of getting and setting a style property
            cssHooks: {
                opacity: {
                    get: function(elem, computed) {
                        if (computed) {
                            // We should always get a number back from opacity
                            var ret = curCSS(elem, "opacity");
                            return ret === "" ? "1" : ret;
                        }
                    }
                }
            },

            // Don't automatically add "px" to these possibly-unitless properties
            cssNumber: {
                "columnCount": true,
                "fillOpacity": true,
                "flexGrow": true,
                "flexShrink": true,
                "fontWeight": true,
                "lineHeight": true,
                "opacity": true,
                "order": true,
                "orphans": true,
                "widows": true,
                "zIndex": true,
                "zoom": true
            },

            // Add in properties whose names you wish to fix before
            // setting or getting the value
            cssProps: {
                // normalize float css property
                "float": support.cssFloat ? "cssFloat" : "styleFloat"
            },

            // Get and set the style property on a DOM Node
            style: function(elem, name, value, extra) {
                // Don't set styles on text and comment nodes
                if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                    return;
                }

                // Make sure that we're working with the right name
                var ret, type, hooks,
                    origName = jQuery.camelCase(name),
                    style = elem.style;

                name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));

                // gets hook for the prefixed version
                // followed by the unprefixed version
                hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

                // Check if we're setting a value
                if (value !== undefined) {
                    type = typeof value;

                    // convert relative number strings (+= or -=) to relative numbers. #7345
                    if (type === "string" && (ret = rrelNum.exec(value))) {
                        value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                        // Fixes bug #9237
                        type = "number";
                    }

                    // Make sure that null and NaN values aren't set. See: #7116
                    if (value == null || value !== value) {
                        return;
                    }

                    // If a number was passed in, add 'px' to the (except for certain CSS properties)
                    if (type === "number" && !jQuery.cssNumber[origName]) {
                        value += "px";
                    }

                    // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
                    // but it would mean to define eight (for every problematic property) identical functions
                    if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                        style[name] = "inherit";
                    }

                    // If a hook was provided, use that value, otherwise just set the specified value
                    if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

                        // Support: IE
                        // Swallow errors from 'invalid' CSS values (#5509)
                        try {
                            style[name] = value;
                        } catch (e) {}
                    }

                } else {
                    // If a hook was provided get the non-computed value from there
                    if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                        return ret;
                    }

                    // Otherwise just get the value from the style object
                    return style[name];
                }
            },

            css: function(elem, name, extra, styles) {
                var num, val, hooks,
                    origName = jQuery.camelCase(name);

                // Make sure that we're working with the right name
                name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));

                // gets hook for the prefixed version
                // followed by the unprefixed version
                hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

                // If a hook was provided get the computed value from there
                if (hooks && "get" in hooks) {
                    val = hooks.get(elem, true, extra);
                }

                // Otherwise, if a way to get the computed value exists, use that
                if (val === undefined) {
                    val = curCSS(elem, name, styles);
                }

                //convert "normal" to computed value
                if (val === "normal" && name in cssNormalTransform) {
                    val = cssNormalTransform[name];
                }

                // Return, converting to number if forced or a qualifier was provided and val looks numeric
                if (extra === "" || extra) {
                    num = parseFloat(val);
                    return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
                }
                return val;
            }
        });

        jQuery.each(["height", "width"], function(i, name) {
            jQuery.cssHooks[name] = {
                get: function(elem, computed, extra) {
                    if (computed) {
                        // certain elements can have dimension info if we invisibly show them
                        // however, it must have a current display style that would benefit from this
                        return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ?
                            jQuery.swap(elem, cssShow, function() {
                                return getWidthOrHeight(elem, name, extra);
                            }) :
                            getWidthOrHeight(elem, name, extra);
                    }
                },

                set: function(elem, value, extra) {
                    var styles = extra && getStyles(elem);
                    return setPositiveNumber(elem, value, extra ?
                        augmentWidthOrHeight(
                            elem,
                            name,
                            extra,
                            support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box",
                            styles
                        ) : 0
                    );
                }
            };
        });

        if (!support.opacity) {
            jQuery.cssHooks.opacity = {
                get: function(elem, computed) {
                    // IE uses filters for opacity
                    return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
                        (0.01 * parseFloat(RegExp.$1)) + "" :
                        computed ? "1" : "";
                },

                set: function(elem, value) {
                    var style = elem.style,
                        currentStyle = elem.currentStyle,
                        opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "",
                        filter = currentStyle && currentStyle.filter || style.filter || "";

                    // IE has trouble with opacity if it does not have layout
                    // Force it by setting the zoom level
                    style.zoom = 1;

                    // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                    // if value === "", then remove inline opacity #12685
                    if ((value >= 1 || value === "") &&
                        jQuery.trim(filter.replace(ralpha, "")) === "" &&
                        style.removeAttribute) {

                        // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                        // if "filter:" is present at all, clearType is disabled, we want to avoid this
                        // style.removeAttribute is IE Only, but so apparently is this code path...
                        style.removeAttribute("filter");

                        // if there is no filter style applied in a css rule or unset inline opacity, we are done
                        if (value === "" || currentStyle && !currentStyle.filter) {
                            return;
                        }
                    }

                    // otherwise, set new filter values
                    style.filter = ralpha.test(filter) ?
                        filter.replace(ralpha, opacity) :
                        filter + " " + opacity;
                }
            };
        }

        jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight,
            function(elem, computed) {
                if (computed) {
                    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                    // Work around by temporarily setting element display to inline-block
                    return jQuery.swap(elem, {
                            "display": "inline-block"
                        },
                        curCSS, [elem, "marginRight"]);
                }
            }
        );

        // These hooks are used by animate to expand properties
        jQuery.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(prefix, suffix) {
            jQuery.cssHooks[prefix + suffix] = {
                expand: function(value) {
                    var i = 0,
                        expanded = {},

                        // assumes a single number if not a string
                        parts = typeof value === "string" ? value.split(" ") : [value];

                    for (; i < 4; i++) {
                        expanded[prefix + cssExpand[i] + suffix] =
                            parts[i] || parts[i - 2] || parts[0];
                    }

                    return expanded;
                }
            };

            if (!rmargin.test(prefix)) {
                jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
            }
        });

        jQuery.fn.extend({
            css: function(name, value) {
                return access(this, function(elem, name, value) {
                    var styles, len,
                        map = {},
                        i = 0;

                    if (jQuery.isArray(name)) {
                        styles = getStyles(elem);
                        len = name.length;

                        for (; i < len; i++) {
                            map[name[i]] = jQuery.css(elem, name[i], false, styles);
                        }

                        return map;
                    }

                    return value !== undefined ?
                        jQuery.style(elem, name, value) :
                        jQuery.css(elem, name);
                }, name, value, arguments.length > 1);
            },
            show: function() {
                return showHide(this, true);
            },
            hide: function() {
                return showHide(this);
            },
            toggle: function(state) {
                if (typeof state === "boolean") {
                    return state ? this.show() : this.hide();
                }

                return this.each(function() {
                    if (isHidden(this)) {
                        jQuery(this).show();
                    } else {
                        jQuery(this).hide();
                    }
                });
            }
        });


        function Tween(elem, options, prop, end, easing) {
            return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery.Tween = Tween;

        Tween.prototype = {
            constructor: Tween,
            init: function(elem, options, prop, end, easing, unit) {
                this.elem = elem;
                this.prop = prop;
                this.easing = easing || "swing";
                this.options = options;
                this.start = this.now = this.cur();
                this.end = end;
                this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
            },
            cur: function() {
                var hooks = Tween.propHooks[this.prop];

                return hooks && hooks.get ?
                    hooks.get(this) :
                    Tween.propHooks._default.get(this);
            },
            run: function(percent) {
                var eased,
                    hooks = Tween.propHooks[this.prop];

                if (this.options.duration) {
                    this.pos = eased = jQuery.easing[this.easing](
                        percent, this.options.duration * percent, 0, 1, this.options.duration
                    );
                } else {
                    this.pos = eased = percent;
                }
                this.now = (this.end - this.start) * eased + this.start;

                if (this.options.step) {
                    this.options.step.call(this.elem, this.now, this);
                }

                if (hooks && hooks.set) {
                    hooks.set(this);
                } else {
                    Tween.propHooks._default.set(this);
                }
                return this;
            }
        };

        Tween.prototype.init.prototype = Tween.prototype;

        Tween.propHooks = {
            _default: {
                get: function(tween) {
                    var result;

                    if (tween.elem[tween.prop] != null &&
                        (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                        return tween.elem[tween.prop];
                    }

                    // passing an empty string as a 3rd parameter to .css will automatically
                    // attempt a parseFloat and fallback to a string if the parse fails
                    // so, simple values such as "10px" are parsed to Float.
                    // complex values such as "rotate(1rad)" are returned as is.
                    result = jQuery.css(tween.elem, tween.prop, "");
                    // Empty strings, null, undefined and "auto" are converted to 0.
                    return !result || result === "auto" ? 0 : result;
                },
                set: function(tween) {
                    // use step hook for back compat - use cssHook if its there - use .style if its
                    // available and use plain properties where available
                    if (jQuery.fx.step[tween.prop]) {
                        jQuery.fx.step[tween.prop](tween);
                    } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                        jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                    } else {
                        tween.elem[tween.prop] = tween.now;
                    }
                }
            }
        };

        // Support: IE <=9
        // Panic based approach to setting things on disconnected nodes

        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
            set: function(tween) {
                if (tween.elem.nodeType && tween.elem.parentNode) {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        };

        jQuery.easing = {
            linear: function(p) {
                return p;
            },
            swing: function(p) {
                return 0.5 - Math.cos(p * Math.PI) / 2;
            }
        };

        jQuery.fx = Tween.prototype.init;

        // Back Compat <1.8 extension point
        jQuery.fx.step = {};




        var
            fxNow, timerId,
            rfxtypes = /^(?:toggle|show|hide)$/,
            rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"),
            rrun = /queueHooks$/,
            animationPrefilters = [defaultPrefilter],
            tweeners = {
                "*": [function(prop, value) {
                    var tween = this.createTween(prop, value),
                        target = tween.cur(),
                        parts = rfxnum.exec(value),
                        unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

                        // Starting value computation is required for potential unit mismatches
                        start = (jQuery.cssNumber[prop] || unit !== "px" && +target) &&
                        rfxnum.exec(jQuery.css(tween.elem, prop)),
                        scale = 1,
                        maxIterations = 20;

                    if (start && start[3] !== unit) {
                        // Trust units reported by jQuery.css
                        unit = unit || start[3];

                        // Make sure we update the tween properties later on
                        parts = parts || [];

                        // Iteratively approximate from a nonzero starting point
                        start = +target || 1;

                        do {
                            // If previous iteration zeroed out, double until we get *something*
                            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                            scale = scale || ".5";

                            // Adjust and apply
                            start = start / scale;
                            jQuery.style(tween.elem, prop, start + unit);

                            // Update scale, tolerating zero or NaN from tween.cur()
                            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                        } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
                    }

                    // Update tween properties
                    if (parts) {
                        start = tween.start = +start || +target || 0;
                        tween.unit = unit;
                        // If a +=/-= token was provided, we're doing a relative animation
                        tween.end = parts[1] ?
                            start + (parts[1] + 1) * parts[2] :
                            +parts[2];
                    }

                    return tween;
                }]
            };

        // Animations created synchronously will run synchronously
        function createFxNow() {
            setTimeout(function() {
                fxNow = undefined;
            });
            return (fxNow = jQuery.now());
        }

        // Generate parameters to create a standard animation
        function genFx(type, includeWidth) {
            var which,
                attrs = {
                    height: type
                },
                i = 0;

            // if we include width, step value is 1 to do all cssExpand values,
            // if we don't include width, step value is 2 to skip over Left and Right
            includeWidth = includeWidth ? 1 : 0;
            for (; i < 4; i += 2 - includeWidth) {
                which = cssExpand[i];
                attrs["margin" + which] = attrs["padding" + which] = type;
            }

            if (includeWidth) {
                attrs.opacity = attrs.width = type;
            }

            return attrs;
        }

        function createTween(value, prop, animation) {
            var tween,
                collection = (tweeners[prop] || []).concat(tweeners["*"]),
                index = 0,
                length = collection.length;
            for (; index < length; index++) {
                if ((tween = collection[index].call(animation, prop, value))) {

                    // we're done with this property
                    return tween;
                }
            }
        }

        function defaultPrefilter(elem, props, opts) {
            /* jshint validthis: true */
            var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
                anim = this,
                orig = {},
                style = elem.style,
                hidden = elem.nodeType && isHidden(elem),
                dataShow = jQuery._data(elem, "fxshow");

            // handle queue: false promises
            if (!opts.queue) {
                hooks = jQuery._queueHooks(elem, "fx");
                if (hooks.unqueued == null) {
                    hooks.unqueued = 0;
                    oldfire = hooks.empty.fire;
                    hooks.empty.fire = function() {
                        if (!hooks.unqueued) {
                            oldfire();
                        }
                    };
                }
                hooks.unqueued++;

                anim.always(function() {
                    // doing this makes sure that the complete handler will be called
                    // before this completes
                    anim.always(function() {
                        hooks.unqueued--;
                        if (!jQuery.queue(elem, "fx").length) {
                            hooks.empty.fire();
                        }
                    });
                });
            }

            // height/width overflow pass
            if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
                // Make sure that nothing sneaks out
                // Record all 3 overflow attributes because IE does not
                // change the overflow attribute when overflowX and
                // overflowY are set to the same value
                opts.overflow = [style.overflow, style.overflowX, style.overflowY];

                // Set display property to inline-block for height/width
                // animations on inline elements that are having width/height animated
                display = jQuery.css(elem, "display");

                // Test default display if display is currently "none"
                checkDisplay = display === "none" ?
                    jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

                if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {

                    // inline-level elements accept inline-block;
                    // block-level elements need to be inline with layout
                    if (!support.inlineBlockNeedsLayout || defaultDisplay(elem.nodeName) === "inline") {
                        style.display = "inline-block";
                    } else {
                        style.zoom = 1;
                    }
                }
            }

            if (opts.overflow) {
                style.overflow = "hidden";
                if (!support.shrinkWrapBlocks()) {
                    anim.always(function() {
                        style.overflow = opts.overflow[0];
                        style.overflowX = opts.overflow[1];
                        style.overflowY = opts.overflow[2];
                    });
                }
            }

            // show/hide pass
            for (prop in props) {
                value = props[prop];
                if (rfxtypes.exec(value)) {
                    delete props[prop];
                    toggle = toggle || value === "toggle";
                    if (value === (hidden ? "hide" : "show")) {

                        // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
                        if (value === "show" && dataShow && dataShow[prop] !== undefined) {
                            hidden = true;
                        } else {
                            continue;
                        }
                    }
                    orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);

                    // Any non-fx value stops us from restoring the original display value
                } else {
                    display = undefined;
                }
            }

            if (!jQuery.isEmptyObject(orig)) {
                if (dataShow) {
                    if ("hidden" in dataShow) {
                        hidden = dataShow.hidden;
                    }
                } else {
                    dataShow = jQuery._data(elem, "fxshow", {});
                }

                // store state if its toggle - enables .stop().toggle() to "reverse"
                if (toggle) {
                    dataShow.hidden = !hidden;
                }
                if (hidden) {
                    jQuery(elem).show();
                } else {
                    anim.done(function() {
                        jQuery(elem).hide();
                    });
                }
                anim.done(function() {
                    var prop;
                    jQuery._removeData(elem, "fxshow");
                    for (prop in orig) {
                        jQuery.style(elem, prop, orig[prop]);
                    }
                });
                for (prop in orig) {
                    tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

                    if (!(prop in dataShow)) {
                        dataShow[prop] = tween.start;
                        if (hidden) {
                            tween.end = tween.start;
                            tween.start = prop === "width" || prop === "height" ? 1 : 0;
                        }
                    }
                }

                // If this is a noop like .hide().hide(), restore an overwritten display value
            } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
                style.display = display;
            }
        }

        function propFilter(props, specialEasing) {
            var index, name, easing, value, hooks;

            // camelCase, specialEasing and expand cssHook pass
            for (index in props) {
                name = jQuery.camelCase(index);
                easing = specialEasing[name];
                value = props[index];
                if (jQuery.isArray(value)) {
                    easing = value[1];
                    value = props[index] = value[0];
                }

                if (index !== name) {
                    props[name] = value;
                    delete props[index];
                }

                hooks = jQuery.cssHooks[name];
                if (hooks && "expand" in hooks) {
                    value = hooks.expand(value);
                    delete props[name];

                    // not quite $.extend, this wont overwrite keys already present.
                    // also - reusing 'index' from above because we have the correct "name"
                    for (index in value) {
                        if (!(index in props)) {
                            props[index] = value[index];
                            specialEasing[index] = easing;
                        }
                    }
                } else {
                    specialEasing[name] = easing;
                }
            }
        }

        function Animation(elem, properties, options) {
            var result,
                stopped,
                index = 0,
                length = animationPrefilters.length,
                deferred = jQuery.Deferred().always(function() {
                    // don't match elem in the :animated selector
                    delete tick.elem;
                }),
                tick = function() {
                    if (stopped) {
                        return false;
                    }
                    var currentTime = fxNow || createFxNow(),
                        remaining = Math.max(0, animation.startTime + animation.duration - currentTime),
                        // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                        temp = remaining / animation.duration || 0,
                        percent = 1 - temp,
                        index = 0,
                        length = animation.tweens.length;

                    for (; index < length; index++) {
                        animation.tweens[index].run(percent);
                    }

                    deferred.notifyWith(elem, [animation, percent, remaining]);

                    if (percent < 1 && length) {
                        return remaining;
                    } else {
                        deferred.resolveWith(elem, [animation]);
                        return false;
                    }
                },
                animation = deferred.promise({
                    elem: elem,
                    props: jQuery.extend({}, properties),
                    opts: jQuery.extend(true, {
                        specialEasing: {}
                    }, options),
                    originalProperties: properties,
                    originalOptions: options,
                    startTime: fxNow || createFxNow(),
                    duration: options.duration,
                    tweens: [],
                    createTween: function(prop, end) {
                        var tween = jQuery.Tween(elem, animation.opts, prop, end,
                            animation.opts.specialEasing[prop] || animation.opts.easing);
                        animation.tweens.push(tween);
                        return tween;
                    },
                    stop: function(gotoEnd) {
                        var index = 0,
                            // if we are going to the end, we want to run all the tweens
                            // otherwise we skip this part
                            length = gotoEnd ? animation.tweens.length : 0;
                        if (stopped) {
                            return this;
                        }
                        stopped = true;
                        for (; index < length; index++) {
                            animation.tweens[index].run(1);
                        }

                        // resolve when we played the last frame
                        // otherwise, reject
                        if (gotoEnd) {
                            deferred.resolveWith(elem, [animation, gotoEnd]);
                        } else {
                            deferred.rejectWith(elem, [animation, gotoEnd]);
                        }
                        return this;
                    }
                }),
                props = animation.props;

            propFilter(props, animation.opts.specialEasing);

            for (; index < length; index++) {
                result = animationPrefilters[index].call(animation, elem, props, animation.opts);
                if (result) {
                    return result;
                }
            }

            jQuery.map(props, createTween, animation);

            if (jQuery.isFunction(animation.opts.start)) {
                animation.opts.start.call(elem, animation);
            }

            jQuery.fx.timer(
                jQuery.extend(tick, {
                    elem: elem,
                    anim: animation,
                    queue: animation.opts.queue
                })
            );

            // attach callbacks from options
            return animation.progress(animation.opts.progress)
                .done(animation.opts.done, animation.opts.complete)
                .fail(animation.opts.fail)
                .always(animation.opts.always);
        }

        jQuery.Animation = jQuery.extend(Animation, {
            tweener: function(props, callback) {
                if (jQuery.isFunction(props)) {
                    callback = props;
                    props = ["*"];
                } else {
                    props = props.split(" ");
                }

                var prop,
                    index = 0,
                    length = props.length;

                for (; index < length; index++) {
                    prop = props[index];
                    tweeners[prop] = tweeners[prop] || [];
                    tweeners[prop].unshift(callback);
                }
            },

            prefilter: function(callback, prepend) {
                if (prepend) {
                    animationPrefilters.unshift(callback);
                } else {
                    animationPrefilters.push(callback);
                }
            }
        });

        jQuery.speed = function(speed, easing, fn) {
            var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing ||
                    jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
                opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

            // normalize opt.queue - true/undefined/null -> "fx"
            if (opt.queue == null || opt.queue === true) {
                opt.queue = "fx";
            }

            // Queueing
            opt.old = opt.complete;

            opt.complete = function() {
                if (jQuery.isFunction(opt.old)) {
                    opt.old.call(this);
                }

                if (opt.queue) {
                    jQuery.dequeue(this, opt.queue);
                }
            };

            return opt;
        };

        jQuery.fn.extend({
            fadeTo: function(speed, to, easing, callback) {

                // show any hidden elements after setting opacity to 0
                return this.filter(isHidden).css("opacity", 0).show()

                    // animate to the value specified
                    .end().animate({
                        opacity: to
                    }, speed, easing, callback);
            },
            animate: function(prop, speed, easing, callback) {
                var empty = jQuery.isEmptyObject(prop),
                    optall = jQuery.speed(speed, easing, callback),
                    doAnimation = function() {
                        // Operate on a copy of prop so per-property easing won't be lost
                        var anim = Animation(this, jQuery.extend({}, prop), optall);

                        // Empty animations, or finishing resolves immediately
                        if (empty || jQuery._data(this, "finish")) {
                            anim.stop(true);
                        }
                    };
                doAnimation.finish = doAnimation;

                return empty || optall.queue === false ?
                    this.each(doAnimation) :
                    this.queue(optall.queue, doAnimation);
            },
            stop: function(type, clearQueue, gotoEnd) {
                var stopQueue = function(hooks) {
                    var stop = hooks.stop;
                    delete hooks.stop;
                    stop(gotoEnd);
                };

                if (typeof type !== "string") {
                    gotoEnd = clearQueue;
                    clearQueue = type;
                    type = undefined;
                }
                if (clearQueue && type !== false) {
                    this.queue(type || "fx", []);
                }

                return this.each(function() {
                    var dequeue = true,
                        index = type != null && type + "queueHooks",
                        timers = jQuery.timers,
                        data = jQuery._data(this);

                    if (index) {
                        if (data[index] && data[index].stop) {
                            stopQueue(data[index]);
                        }
                    } else {
                        for (index in data) {
                            if (data[index] && data[index].stop && rrun.test(index)) {
                                stopQueue(data[index]);
                            }
                        }
                    }

                    for (index = timers.length; index--;) {
                        if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                            timers[index].anim.stop(gotoEnd);
                            dequeue = false;
                            timers.splice(index, 1);
                        }
                    }

                    // start the next in the queue if the last step wasn't forced
                    // timers currently will call their complete callbacks, which will dequeue
                    // but only if they were gotoEnd
                    if (dequeue || !gotoEnd) {
                        jQuery.dequeue(this, type);
                    }
                });
            },
            finish: function(type) {
                if (type !== false) {
                    type = type || "fx";
                }
                return this.each(function() {
                    var index,
                        data = jQuery._data(this),
                        queue = data[type + "queue"],
                        hooks = data[type + "queueHooks"],
                        timers = jQuery.timers,
                        length = queue ? queue.length : 0;

                    // enable finishing flag on private data
                    data.finish = true;

                    // empty the queue first
                    jQuery.queue(this, type, []);

                    if (hooks && hooks.stop) {
                        hooks.stop.call(this, true);
                    }

                    // look for any active animations, and finish them
                    for (index = timers.length; index--;) {
                        if (timers[index].elem === this && timers[index].queue === type) {
                            timers[index].anim.stop(true);
                            timers.splice(index, 1);
                        }
                    }

                    // look for any animations in the old queue and finish them
                    for (index = 0; index < length; index++) {
                        if (queue[index] && queue[index].finish) {
                            queue[index].finish.call(this);
                        }
                    }

                    // turn off finishing flag
                    delete data.finish;
                });
            }
        });

        jQuery.each(["toggle", "show", "hide"], function(i, name) {
            var cssFn = jQuery.fn[name];
            jQuery.fn[name] = function(speed, easing, callback) {
                return speed == null || typeof speed === "boolean" ?
                    cssFn.apply(this, arguments) :
                    this.animate(genFx(name, true), speed, easing, callback);
            };
        });

        // Generate shortcuts for custom animations
        jQuery.each({
            slideDown: genFx("show"),
            slideUp: genFx("hide"),
            slideToggle: genFx("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(name, props) {
            jQuery.fn[name] = function(speed, easing, callback) {
                return this.animate(props, speed, easing, callback);
            };
        });

        jQuery.timers = [];
        jQuery.fx.tick = function() {
            var timer,
                timers = jQuery.timers,
                i = 0;

            fxNow = jQuery.now();

            for (; i < timers.length; i++) {
                timer = timers[i];
                // Checks the timer has not already been removed
                if (!timer() && timers[i] === timer) {
                    timers.splice(i--, 1);
                }
            }

            if (!timers.length) {
                jQuery.fx.stop();
            }
            fxNow = undefined;
        };

        jQuery.fx.timer = function(timer) {
            jQuery.timers.push(timer);
            if (timer()) {
                jQuery.fx.start();
            } else {
                jQuery.timers.pop();
            }
        };

        jQuery.fx.interval = 13;

        jQuery.fx.start = function() {
            if (!timerId) {
                timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
            }
        };

        jQuery.fx.stop = function() {
            clearInterval(timerId);
            timerId = null;
        };

        jQuery.fx.speeds = {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        };


        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        jQuery.fn.delay = function(time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue(type, function(next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timeout);
                };
            });
        };


        (function() {
            // Minified: var a,b,c,d,e
            var input, div, select, a, opt;

            // Setup
            div = document.createElement("div");
            div.setAttribute("className", "t");
            div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
            a = div.getElementsByTagName("a")[0];

            // First batch of tests.
            select = document.createElement("select");
            opt = select.appendChild(document.createElement("option"));
            input = div.getElementsByTagName("input")[0];

            a.style.cssText = "top:1px";

            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            support.getSetAttribute = div.className !== "t";

            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            support.style = /top/.test(a.getAttribute("style"));

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            support.hrefNormalized = a.getAttribute("href") === "/a";

            // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
            support.checkOn = !!input.value;

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            support.optSelected = opt.selected;

            // Tests for enctype support on a form (#6743)
            support.enctype = !!document.createElement("form").enctype;

            // Make sure that the options inside disabled selects aren't marked as disabled
            // (WebKit marks them as disabled)
            select.disabled = true;
            support.optDisabled = !opt.disabled;

            // Support: IE8 only
            // Check if we can trust getAttribute("value")
            input = document.createElement("input");
            input.setAttribute("value", "");
            support.input = input.getAttribute("value") === "";

            // Check if an input maintains its value after becoming a radio
            input.value = "t";
            input.setAttribute("type", "radio");
            support.radioValue = input.value === "t";
        })();


        var rreturn = /\r/g;

        jQuery.fn.extend({
            val: function(value) {
                var hooks, ret, isFunction,
                    elem = this[0];

                if (!arguments.length) {
                    if (elem) {
                        hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                        if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                            return ret;
                        }

                        ret = elem.value;

                        return typeof ret === "string" ?
                            // handle most common string cases
                            ret.replace(rreturn, "") :
                            // handle cases where value is null/undef or number
                            ret == null ? "" : ret;
                    }

                    return;
                }

                isFunction = jQuery.isFunction(value);

                return this.each(function(i) {
                    var val;

                    if (this.nodeType !== 1) {
                        return;
                    }

                    if (isFunction) {
                        val = value.call(this, i, jQuery(this).val());
                    } else {
                        val = value;
                    }

                    // Treat null/undefined as ""; convert numbers to string
                    if (val == null) {
                        val = "";
                    } else if (typeof val === "number") {
                        val += "";
                    } else if (jQuery.isArray(val)) {
                        val = jQuery.map(val, function(value) {
                            return value == null ? "" : value + "";
                        });
                    }

                    hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

                    // If set returns undefined, fall back to normal setting
                    if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                        this.value = val;
                    }
                });
            }
        });

        jQuery.extend({
            valHooks: {
                option: {
                    get: function(elem) {
                        var val = jQuery.find.attr(elem, "value");
                        return val != null ?
                            val :
                            // Support: IE10-11+
                            // option.text throws exceptions (#14686, #14858)
                            jQuery.trim(jQuery.text(elem));
                    }
                },
                select: {
                    get: function(elem) {
                        var value, option,
                            options = elem.options,
                            index = elem.selectedIndex,
                            one = elem.type === "select-one" || index < 0,
                            values = one ? null : [],
                            max = one ? index + 1 : options.length,
                            i = index < 0 ?
                            max :
                            one ? index : 0;

                        // Loop through all the selected options
                        for (; i < max; i++) {
                            option = options[i];

                            // oldIE doesn't update selected after form reset (#2551)
                            if ((option.selected || i === index) &&
                                // Don't return options that are disabled or in a disabled optgroup
                                (support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                                (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                                // Get the specific value for the option
                                value = jQuery(option).val();

                                // We don't need an array for one selects
                                if (one) {
                                    return value;
                                }

                                // Multi-Selects return an array
                                values.push(value);
                            }
                        }

                        return values;
                    },

                    set: function(elem, value) {
                        var optionSet, option,
                            options = elem.options,
                            values = jQuery.makeArray(value),
                            i = options.length;

                        while (i--) {
                            option = options[i];

                            if (jQuery.inArray(jQuery.valHooks.option.get(option), values) >= 0) {

                                // Support: IE6
                                // When new option element is added to select box we need to
                                // force reflow of newly added node in order to workaround delay
                                // of initialization properties
                                try {
                                    option.selected = optionSet = true;

                                } catch (_) {

                                    // Will be executed only in IE6
                                    option.scrollHeight;
                                }

                            } else {
                                option.selected = false;
                            }
                        }

                        // Force browsers to behave consistently when non-matching value is set
                        if (!optionSet) {
                            elem.selectedIndex = -1;
                        }

                        return options;
                    }
                }
            }
        });

        // Radios and checkboxes getter/setter
        jQuery.each(["radio", "checkbox"], function() {
            jQuery.valHooks[this] = {
                set: function(elem, value) {
                    if (jQuery.isArray(value)) {
                        return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0);
                    }
                }
            };
            if (!support.checkOn) {
                jQuery.valHooks[this].get = function(elem) {
                    // Support: Webkit
                    // "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                };
            }
        });




        var nodeHook, boolHook,
            attrHandle = jQuery.expr.attrHandle,
            ruseDefault = /^(?:checked|selected)$/i,
            getSetAttribute = support.getSetAttribute,
            getSetInput = support.input;

        jQuery.fn.extend({
            attr: function(name, value) {
                return access(this, jQuery.attr, name, value, arguments.length > 1);
            },

            removeAttr: function(name) {
                return this.each(function() {
                    jQuery.removeAttr(this, name);
                });
            }
        });

        jQuery.extend({
            attr: function(elem, name, value) {
                var hooks, ret,
                    nType = elem.nodeType;

                // don't get/set attributes on text, comment and attribute nodes
                if (!elem || nType === 3 || nType === 8 || nType === 2) {
                    return;
                }

                // Fallback to prop when attributes are not supported
                if (typeof elem.getAttribute === strundefined) {
                    return jQuery.prop(elem, name, value);
                }

                // All attributes are lowercase
                // Grab necessary hook if one is defined
                if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                    name = name.toLowerCase();
                    hooks = jQuery.attrHooks[name] ||
                        (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
                }

                if (value !== undefined) {

                    if (value === null) {
                        jQuery.removeAttr(elem, name);

                    } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                        return ret;

                    } else {
                        elem.setAttribute(name, value + "");
                        return value;
                    }

                } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                    return ret;

                } else {
                    ret = jQuery.find.attr(elem, name);

                    // Non-existent attributes return null, we normalize to undefined
                    return ret == null ?
                        undefined :
                        ret;
                }
            },

            removeAttr: function(elem, value) {
                var name, propName,
                    i = 0,
                    attrNames = value && value.match(rnotwhite);

                if (attrNames && elem.nodeType === 1) {
                    while ((name = attrNames[i++])) {
                        propName = jQuery.propFix[name] || name;

                        // Boolean attributes get special treatment (#10870)
                        if (jQuery.expr.match.bool.test(name)) {
                            // Set corresponding property to false
                            if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                                elem[propName] = false;
                                // Support: IE<9
                                // Also clear defaultChecked/defaultSelected (if appropriate)
                            } else {
                                elem[jQuery.camelCase("default-" + name)] =
                                    elem[propName] = false;
                            }

                            // See #9699 for explanation of this approach (setting first, then removal)
                        } else {
                            jQuery.attr(elem, name, "");
                        }

                        elem.removeAttribute(getSetAttribute ? name : propName);
                    }
                }
            },

            attrHooks: {
                type: {
                    set: function(elem, value) {
                        if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                            // Setting the type on a radio button after the value resets the value in IE6-9
                            // Reset value to default in case type is set after value during creation
                            var val = elem.value;
                            elem.setAttribute("type", value);
                            if (val) {
                                elem.value = val;
                            }
                            return value;
                        }
                    }
                }
            }
        });

        // Hook for boolean attributes
        boolHook = {
            set: function(elem, value, name) {
                if (value === false) {
                    // Remove boolean attributes when set to false
                    jQuery.removeAttr(elem, name);
                } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                    // IE<8 needs the *property* name
                    elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);

                    // Use defaultChecked and defaultSelected for oldIE
                } else {
                    elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
                }

                return name;
            }
        };

        // Retrieve booleans specially
        jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {

            var getter = attrHandle[name] || jQuery.find.attr;

            attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ?
                function(elem, name, isXML) {
                    var ret, handle;
                    if (!isXML) {
                        // Avoid an infinite loop by temporarily removing this function from the getter
                        handle = attrHandle[name];
                        attrHandle[name] = ret;
                        ret = getter(elem, name, isXML) != null ?
                            name.toLowerCase() :
                            null;
                        attrHandle[name] = handle;
                    }
                    return ret;
                } :
                function(elem, name, isXML) {
                    if (!isXML) {
                        return elem[jQuery.camelCase("default-" + name)] ?
                            name.toLowerCase() :
                            null;
                    }
                };
        });

        // fix oldIE attroperties
        if (!getSetInput || !getSetAttribute) {
            jQuery.attrHooks.value = {
                set: function(elem, value, name) {
                    if (jQuery.nodeName(elem, "input")) {
                        // Does not return so that setAttribute is also used
                        elem.defaultValue = value;
                    } else {
                        // Use nodeHook if defined (#1954); otherwise setAttribute is fine
                        return nodeHook && nodeHook.set(elem, value, name);
                    }
                }
            };
        }

        // IE6/7 do not support getting/setting some attributes with get/setAttribute
        if (!getSetAttribute) {

            // Use this for any attribute in IE6/7
            // This fixes almost every IE6/7 issue
            nodeHook = {
                set: function(elem, value, name) {
                    // Set the existing or create a new attribute node
                    var ret = elem.getAttributeNode(name);
                    if (!ret) {
                        elem.setAttributeNode(
                            (ret = elem.ownerDocument.createAttribute(name))
                        );
                    }

                    ret.value = value += "";

                    // Break association with cloned elements by also using setAttribute (#9646)
                    if (name === "value" || value === elem.getAttribute(name)) {
                        return value;
                    }
                }
            };

            // Some attributes are constructed with empty-string values when not defined
            attrHandle.id = attrHandle.name = attrHandle.coords =
                function(elem, name, isXML) {
                    var ret;
                    if (!isXML) {
                        return (ret = elem.getAttributeNode(name)) && ret.value !== "" ?
                            ret.value :
                            null;
                    }
                };

            // Fixing value retrieval on a button requires this module
            jQuery.valHooks.button = {
                get: function(elem, name) {
                    var ret = elem.getAttributeNode(name);
                    if (ret && ret.specified) {
                        return ret.value;
                    }
                },
                set: nodeHook.set
            };

            // Set contenteditable to false on removals(#10429)
            // Setting to empty string throws an error as an invalid value
            jQuery.attrHooks.contenteditable = {
                set: function(elem, value, name) {
                    nodeHook.set(elem, value === "" ? false : value, name);
                }
            };

            // Set width and height to auto instead of 0 on empty string( Bug #8150 )
            // This is for removals
            jQuery.each(["width", "height"], function(i, name) {
                jQuery.attrHooks[name] = {
                    set: function(elem, value) {
                        if (value === "") {
                            elem.setAttribute(name, "auto");
                            return value;
                        }
                    }
                };
            });
        }

        if (!support.style) {
            jQuery.attrHooks.style = {
                get: function(elem) {
                    // Return undefined in the case of empty string
                    // Note: IE uppercases css property names, but if we were to .toLowerCase()
                    // .cssText, that would destroy case senstitivity in URL's, like in "background"
                    return elem.style.cssText || undefined;
                },
                set: function(elem, value) {
                    return (elem.style.cssText = value + "");
                }
            };
        }




        var rfocusable = /^(?:input|select|textarea|button|object)$/i,
            rclickable = /^(?:a|area)$/i;

        jQuery.fn.extend({
            prop: function(name, value) {
                return access(this, jQuery.prop, name, value, arguments.length > 1);
            },

            removeProp: function(name) {
                name = jQuery.propFix[name] || name;
                return this.each(function() {
                    // try/catch handles cases where IE balks (such as removing a property on window)
                    try {
                        this[name] = undefined;
                        delete this[name];
                    } catch (e) {}
                });
            }
        });

        jQuery.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },

            prop: function(elem, name, value) {
                var ret, hooks, notxml,
                    nType = elem.nodeType;

                // don't get/set properties on text, comment and attribute nodes
                if (!elem || nType === 3 || nType === 8 || nType === 2) {
                    return;
                }

                notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

                if (notxml) {
                    // Fix name and attach hooks
                    name = jQuery.propFix[name] || name;
                    hooks = jQuery.propHooks[name];
                }

                if (value !== undefined) {
                    return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ?
                        ret :
                        (elem[name] = value);

                } else {
                    return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ?
                        ret :
                        elem[name];
                }
            },

            propHooks: {
                tabIndex: {
                    get: function(elem) {
                        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                        // Use proper attribute retrieval(#12072)
                        var tabindex = jQuery.find.attr(elem, "tabindex");

                        return tabindex ?
                            parseInt(tabindex, 10) :
                            rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
                            0 :
                            -1;
                    }
                }
            }
        });

        // Some attributes require a special call on IE
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        if (!support.hrefNormalized) {
            // href/src property should get the full normalized URL (#10299/#12915)
            jQuery.each(["href", "src"], function(i, name) {
                jQuery.propHooks[name] = {
                    get: function(elem) {
                        return elem.getAttribute(name, 4);
                    }
                };
            });
        }

        // Support: Safari, IE9+
        // mis-reports the default selected property of an option
        // Accessing the parent's selectedIndex property fixes it
        if (!support.optSelected) {
            jQuery.propHooks.selected = {
                get: function(elem) {
                    var parent = elem.parentNode;

                    if (parent) {
                        parent.selectedIndex;

                        // Make sure that it also works with optgroups, see #5701
                        if (parent.parentNode) {
                            parent.parentNode.selectedIndex;
                        }
                    }
                    return null;
                }
            };
        }

        jQuery.each([
            "tabIndex",
            "readOnly",
            "maxLength",
            "cellSpacing",
            "cellPadding",
            "rowSpan",
            "colSpan",
            "useMap",
            "frameBorder",
            "contentEditable"
        ], function() {
            jQuery.propFix[this.toLowerCase()] = this;
        });

        // IE6/7 call enctype encoding
        if (!support.enctype) {
            jQuery.propFix.enctype = "encoding";
        }




        var rclass = /[\t\r\n\f]/g;

        jQuery.fn.extend({
            addClass: function(value) {
                var classes, elem, cur, clazz, j, finalValue,
                    i = 0,
                    len = this.length,
                    proceed = typeof value === "string" && value;

                if (jQuery.isFunction(value)) {
                    return this.each(function(j) {
                        jQuery(this).addClass(value.call(this, j, this.className));
                    });
                }

                if (proceed) {
                    // The disjunction here is for better compressibility (see removeClass)
                    classes = (value || "").match(rnotwhite) || [];

                    for (; i < len; i++) {
                        elem = this[i];
                        cur = elem.nodeType === 1 && (elem.className ?
                            (" " + elem.className + " ").replace(rclass, " ") :
                            " "
                        );

                        if (cur) {
                            j = 0;
                            while ((clazz = classes[j++])) {
                                if (cur.indexOf(" " + clazz + " ") < 0) {
                                    cur += clazz + " ";
                                }
                            }

                            // only assign if different to avoid unneeded rendering.
                            finalValue = jQuery.trim(cur);
                            if (elem.className !== finalValue) {
                                elem.className = finalValue;
                            }
                        }
                    }
                }

                return this;
            },

            removeClass: function(value) {
                var classes, elem, cur, clazz, j, finalValue,
                    i = 0,
                    len = this.length,
                    proceed = arguments.length === 0 || typeof value === "string" && value;

                if (jQuery.isFunction(value)) {
                    return this.each(function(j) {
                        jQuery(this).removeClass(value.call(this, j, this.className));
                    });
                }
                if (proceed) {
                    classes = (value || "").match(rnotwhite) || [];

                    for (; i < len; i++) {
                        elem = this[i];
                        // This expression is here for better compressibility (see addClass)
                        cur = elem.nodeType === 1 && (elem.className ?
                            (" " + elem.className + " ").replace(rclass, " ") :
                            ""
                        );

                        if (cur) {
                            j = 0;
                            while ((clazz = classes[j++])) {
                                // Remove *all* instances
                                while (cur.indexOf(" " + clazz + " ") >= 0) {
                                    cur = cur.replace(" " + clazz + " ", " ");
                                }
                            }

                            // only assign if different to avoid unneeded rendering.
                            finalValue = value ? jQuery.trim(cur) : "";
                            if (elem.className !== finalValue) {
                                elem.className = finalValue;
                            }
                        }
                    }
                }

                return this;
            },

            toggleClass: function(value, stateVal) {
                var type = typeof value;

                if (typeof stateVal === "boolean" && type === "string") {
                    return stateVal ? this.addClass(value) : this.removeClass(value);
                }

                if (jQuery.isFunction(value)) {
                    return this.each(function(i) {
                        jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                    });
                }

                return this.each(function() {
                    if (type === "string") {
                        // toggle individual class names
                        var className,
                            i = 0,
                            self = jQuery(this),
                            classNames = value.match(rnotwhite) || [];

                        while ((className = classNames[i++])) {
                            // check each className given, space separated list
                            if (self.hasClass(className)) {
                                self.removeClass(className);
                            } else {
                                self.addClass(className);
                            }
                        }

                        // Toggle whole class name
                    } else if (type === strundefined || type === "boolean") {
                        if (this.className) {
                            // store className if set
                            jQuery._data(this, "__className__", this.className);
                        }

                        // If the element has a class name or if we're passed "false",
                        // then remove the whole classname (if there was one, the above saved it).
                        // Otherwise bring back whatever was previously saved (if anything),
                        // falling back to the empty string if nothing was stored.
                        this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                    }
                });
            },

            hasClass: function(selector) {
                var className = " " + selector + " ",
                    i = 0,
                    l = this.length;
                for (; i < l; i++) {
                    if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                        return true;
                    }
                }

                return false;
            }
        });




        // Return jQuery for attributes-only inclusion


        jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
            "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
            "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {

            // Handle event binding
            jQuery.fn[name] = function(data, fn) {
                return arguments.length > 0 ?
                    this.on(name, null, data, fn) :
                    this.trigger(name);
            };
        });

        jQuery.fn.extend({
            hover: function(fnOver, fnOut) {
                return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
            },

            bind: function(types, data, fn) {
                return this.on(types, null, data, fn);
            },
            unbind: function(types, fn) {
                return this.off(types, null, fn);
            },

            delegate: function(selector, types, data, fn) {
                return this.on(types, selector, data, fn);
            },
            undelegate: function(selector, types, fn) {
                // ( namespace ) or ( selector, types [, fn] )
                return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
            }
        });


        var nonce = jQuery.now();

        var rquery = (/\?/);



        var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

        jQuery.parseJSON = function(data) {
            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
                // Support: Android 2.3
                // Workaround failure to string-cast null input
                return window.JSON.parse(data + "");
            }

            var requireNonComma,
                depth = null,
                str = jQuery.trim(data + "");

            // Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
            // after removing valid tokens
            return str && !jQuery.trim(str.replace(rvalidtokens, function(token, comma, open, close) {

                    // Force termination if we see a misplaced comma
                    if (requireNonComma && comma) {
                        depth = 0;
                    }

                    // Perform no more replacements after returning to outermost depth
                    if (depth === 0) {
                        return token;
                    }

                    // Commas must not follow "[", "{", or ","
                    requireNonComma = open || comma;

                    // Determine new depth
                    // array/object open ("[" or "{"): depth += true - false (increment)
                    // array/object close ("]" or "}"): depth += false - true (decrement)
                    // other cases ("," or primitive): depth += true - true (numeric cast)
                    depth += !close - !open;

                    // Remove this token
                    return "";
                })) ?
                (Function("return " + str))() :
                jQuery.error("Invalid JSON: " + data);
        };


        // Cross-browser xml parsing
        jQuery.parseXML = function(data) {
            var xml, tmp;
            if (!data || typeof data !== "string") {
                return null;
            }
            try {
                if (window.DOMParser) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                jQuery.error("Invalid XML: " + data);
            }
            return xml;
        };


        var
            // Document location
            ajaxLocParts,
            ajaxLocation,

            rhash = /#.*$/,
            rts = /([?&])_=[^&]*/,
            rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
            // #7653, #8125, #8152: local protocol detection
            rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            rnoContent = /^(?:GET|HEAD)$/,
            rprotocol = /^\/\//,
            rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

            /* Prefilters
             * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
             * 2) These are called:
             *    - BEFORE asking for a transport
             *    - AFTER param serialization (s.data is a string if s.processData is true)
             * 3) key is the dataType
             * 4) the catchall symbol "*" can be used
             * 5) execution will start with transport dataType and THEN continue down to "*" if needed
             */
            prefilters = {},

            /* Transports bindings
             * 1) key is the dataType
             * 2) the catchall symbol "*" can be used
             * 3) selection will start with transport dataType and THEN go to "*" if needed
             */
            transports = {},

            // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
            allTypes = "*/".concat("*");

        // #8138, IE may throw an exception when accessing
        // a field from window.location if document.domain has been set
        try {
            ajaxLocation = location.href;
        } catch (e) {
            // Use the href attribute of an A element
            // since IE will modify it given document.location
            ajaxLocation = document.createElement("a");
            ajaxLocation.href = "";
            ajaxLocation = ajaxLocation.href;
        }

        // Segment location into parts
        ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

        // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
        function addToPrefiltersOrTransports(structure) {

            // dataTypeExpression is optional and defaults to "*"
            return function(dataTypeExpression, func) {

                if (typeof dataTypeExpression !== "string") {
                    func = dataTypeExpression;
                    dataTypeExpression = "*";
                }

                var dataType,
                    i = 0,
                    dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

                if (jQuery.isFunction(func)) {
                    // For each dataType in the dataTypeExpression
                    while ((dataType = dataTypes[i++])) {
                        // Prepend if requested
                        if (dataType.charAt(0) === "+") {
                            dataType = dataType.slice(1) || "*";
                            (structure[dataType] = structure[dataType] || []).unshift(func);

                            // Otherwise append
                        } else {
                            (structure[dataType] = structure[dataType] || []).push(func);
                        }
                    }
                }
            };
        }

        // Base inspection function for prefilters and transports
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

            var inspected = {},
                seekingTransport = (structure === transports);

            function inspect(dataType) {
                var selected;
                inspected[dataType] = true;
                jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                    var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                    if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                        options.dataTypes.unshift(dataTypeOrTransport);
                        inspect(dataTypeOrTransport);
                        return false;
                    } else if (seekingTransport) {
                        return !(selected = dataTypeOrTransport);
                    }
                });
                return selected;
            }

            return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }

        // A special extend for ajax options
        // that takes "flat" options (not to be deep extended)
        // Fixes #9887
        function ajaxExtend(target, src) {
            var deep, key,
                flatOptions = jQuery.ajaxSettings.flatOptions || {};

            for (key in src) {
                if (src[key] !== undefined) {
                    (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
                }
            }
            if (deep) {
                jQuery.extend(true, target, deep);
            }

            return target;
        }

        /* Handles responses to an ajax request:
         * - finds the right dataType (mediates between content-type and expected dataType)
         * - returns the corresponding response
         */
        function ajaxHandleResponses(s, jqXHR, responses) {
            var firstDataType, ct, finalDataType, type,
                contents = s.contents,
                dataTypes = s.dataTypes;

            // Remove auto dataType and get content-type in the process
            while (dataTypes[0] === "*") {
                dataTypes.shift();
                if (ct === undefined) {
                    ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
                }
            }

            // Check if we're dealing with a known content-type
            if (ct) {
                for (type in contents) {
                    if (contents[type] && contents[type].test(ct)) {
                        dataTypes.unshift(type);
                        break;
                    }
                }
            }

            // Check to see if we have a response for the expected dataType
            if (dataTypes[0] in responses) {
                finalDataType = dataTypes[0];
            } else {
                // Try convertible dataTypes
                for (type in responses) {
                    if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                        finalDataType = type;
                        break;
                    }
                    if (!firstDataType) {
                        firstDataType = type;
                    }
                }
                // Or just use first one
                finalDataType = finalDataType || firstDataType;
            }

            // If we found a dataType
            // We add the dataType to the list if needed
            // and return the corresponding response
            if (finalDataType) {
                if (finalDataType !== dataTypes[0]) {
                    dataTypes.unshift(finalDataType);
                }
                return responses[finalDataType];
            }
        }

        /* Chain conversions given the request and the original response
         * Also sets the responseXXX fields on the jqXHR instance
         */
        function ajaxConvert(s, response, jqXHR, isSuccess) {
            var conv2, current, conv, tmp, prev,
                converters = {},
                // Work with a copy of dataTypes in case we need to modify it for conversion
                dataTypes = s.dataTypes.slice();

            // Create converters map with lowercased keys
            if (dataTypes[1]) {
                for (conv in s.converters) {
                    converters[conv.toLowerCase()] = s.converters[conv];
                }
            }

            current = dataTypes.shift();

            // Convert to each sequential dataType
            while (current) {

                if (s.responseFields[current]) {
                    jqXHR[s.responseFields[current]] = response;
                }

                // Apply the dataFilter if provided
                if (!prev && isSuccess && s.dataFilter) {
                    response = s.dataFilter(response, s.dataType);
                }

                prev = current;
                current = dataTypes.shift();

                if (current) {

                    // There's only work to do if current dataType is non-auto
                    if (current === "*") {

                        current = prev;

                        // Convert response if prev dataType is non-auto and differs from current
                    } else if (prev !== "*" && prev !== current) {

                        // Seek a direct converter
                        conv = converters[prev + " " + current] || converters["* " + current];

                        // If none found, seek a pair
                        if (!conv) {
                            for (conv2 in converters) {

                                // If conv2 outputs current
                                tmp = conv2.split(" ");
                                if (tmp[1] === current) {

                                    // If prev can be converted to accepted input
                                    conv = converters[prev + " " + tmp[0]] ||
                                        converters["* " + tmp[0]];
                                    if (conv) {
                                        // Condense equivalence converters
                                        if (conv === true) {
                                            conv = converters[conv2];

                                            // Otherwise, insert the intermediate dataType
                                        } else if (converters[conv2] !== true) {
                                            current = tmp[0];
                                            dataTypes.unshift(tmp[1]);
                                        }
                                        break;
                                    }
                                }
                            }
                        }

                        // Apply converter (if not an equivalence)
                        if (conv !== true) {

                            // Unless errors are allowed to bubble, catch and return them
                            if (conv && s["throws"]) {
                                response = conv(response);
                            } else {
                                try {
                                    response = conv(response);
                                } catch (e) {
                                    return {
                                        state: "parsererror",
                                        error: conv ? e : "No conversion from " + prev + " to " + current
                                    };
                                }
                            }
                        }
                    }
                }
            }

            return {
                state: "success",
                data: response
            };
        }

        jQuery.extend({

            // Counter for holding the number of active queries
            active: 0,

            // Last-Modified header cache for next request
            lastModified: {},
            etag: {},

            ajaxSettings: {
                url: ajaxLocation,
                type: "GET",
                isLocal: rlocalProtocol.test(ajaxLocParts[1]),
                global: true,
                processData: true,
                async: true,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                /*
                timeout: 0,
                data: null,
                dataType: null,
                username: null,
                password: null,
                cache: null,
                throws: false,
                traditional: false,
                headers: {},
                */

                accepts: {
                    "*": allTypes,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },

                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },

                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },

                // Data converters
                // Keys separate source (or catchall "*") and destination types with a single space
                converters: {

                    // Convert anything to text
                    "* text": String,

                    // Text to html (true = no transformation)
                    "text html": true,

                    // Evaluate text as a json expression
                    "text json": jQuery.parseJSON,

                    // Parse text as xml
                    "text xml": jQuery.parseXML
                },

                // For options that shouldn't be deep extended:
                // you can add your own custom options here if
                // and when you create one that shouldn't be
                // deep extended (see ajaxExtend)
                flatOptions: {
                    url: true,
                    context: true
                }
            },

            // Creates a full fledged settings object into target
            // with both ajaxSettings and settings fields.
            // If target is omitted, writes into ajaxSettings.
            ajaxSetup: function(target, settings) {
                return settings ?

                    // Building a settings object
                    ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

                    // Extending ajaxSettings
                    ajaxExtend(jQuery.ajaxSettings, target);
            },

            ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
            ajaxTransport: addToPrefiltersOrTransports(transports),

            // Main method
            ajax: function(url, options) {

                // If url is an object, simulate pre-1.5 signature
                if (typeof url === "object") {
                    options = url;
                    url = undefined;
                }

                // Force options to be an object
                options = options || {};

                var // Cross-domain detection vars
                    parts,
                    // Loop variable
                    i,
                    // URL without anti-cache param
                    cacheURL,
                    // Response headers as string
                    responseHeadersString,
                    // timeout handle
                    timeoutTimer,

                    // To know if global events are to be dispatched
                    fireGlobals,

                    transport,
                    // Response headers
                    responseHeaders,
                    // Create the final options object
                    s = jQuery.ajaxSetup({}, options),
                    // Callbacks context
                    callbackContext = s.context || s,
                    // Context for global events is callbackContext if it is a DOM node or jQuery collection
                    globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ?
                    jQuery(callbackContext) :
                    jQuery.event,
                    // Deferreds
                    deferred = jQuery.Deferred(),
                    completeDeferred = jQuery.Callbacks("once memory"),
                    // Status-dependent callbacks
                    statusCode = s.statusCode || {},
                    // Headers (they are sent all at once)
                    requestHeaders = {},
                    requestHeadersNames = {},
                    // The jqXHR state
                    state = 0,
                    // Default abort message
                    strAbort = "canceled",
                    // Fake xhr
                    jqXHR = {
                        readyState: 0,

                        // Builds headers hashtable if needed
                        getResponseHeader: function(key) {
                            var match;
                            if (state === 2) {
                                if (!responseHeaders) {
                                    responseHeaders = {};
                                    while ((match = rheaders.exec(responseHeadersString))) {
                                        responseHeaders[match[1].toLowerCase()] = match[2];
                                    }
                                }
                                match = responseHeaders[key.toLowerCase()];
                            }
                            return match == null ? null : match;
                        },

                        // Raw string
                        getAllResponseHeaders: function() {
                            return state === 2 ? responseHeadersString : null;
                        },

                        // Caches the header
                        setRequestHeader: function(name, value) {
                            var lname = name.toLowerCase();
                            if (!state) {
                                name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                                requestHeaders[name] = value;
                            }
                            return this;
                        },

                        // Overrides response content-type header
                        overrideMimeType: function(type) {
                            if (!state) {
                                s.mimeType = type;
                            }
                            return this;
                        },

                        // Status-dependent callbacks
                        statusCode: function(map) {
                            var code;
                            if (map) {
                                if (state < 2) {
                                    for (code in map) {
                                        // Lazy-add the new callback in a way that preserves old ones
                                        statusCode[code] = [statusCode[code], map[code]];
                                    }
                                } else {
                                    // Execute the appropriate callbacks
                                    jqXHR.always(map[jqXHR.status]);
                                }
                            }
                            return this;
                        },

                        // Cancel the request
                        abort: function(statusText) {
                            var finalText = statusText || strAbort;
                            if (transport) {
                                transport.abort(finalText);
                            }
                            done(0, finalText);
                            return this;
                        }
                    };

                // Attach deferreds
                deferred.promise(jqXHR).complete = completeDeferred.add;
                jqXHR.success = jqXHR.done;
                jqXHR.error = jqXHR.fail;

                // Remove hash character (#7531: and string promotion)
                // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
                // Handle falsy url in the settings object (#10093: consistency with old signature)
                // We also use the url parameter if available
                s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

                // Alias method option to type as per ticket #12004
                s.type = options.method || options.type || s.method || s.type;

                // Extract dataTypes list
                s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

                // A cross-domain request is in order when we have a protocol:host:port mismatch
                if (s.crossDomain == null) {
                    parts = rurl.exec(s.url.toLowerCase());
                    s.crossDomain = !!(parts &&
                        (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] ||
                            (parts[3] || (parts[1] === "http:" ? "80" : "443")) !==
                            (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443")))
                    );
                }

                // Convert data if not already a string
                if (s.data && s.processData && typeof s.data !== "string") {
                    s.data = jQuery.param(s.data, s.traditional);
                }

                // Apply prefilters
                inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

                // If request was aborted inside a prefilter, stop there
                if (state === 2) {
                    return jqXHR;
                }

                // We can fire global events as of now if asked to
                fireGlobals = s.global;

                // Watch for a new set of requests
                if (fireGlobals && jQuery.active++ === 0) {
                    jQuery.event.trigger("ajaxStart");
                }

                // Uppercase the type
                s.type = s.type.toUpperCase();

                // Determine if request has content
                s.hasContent = !rnoContent.test(s.type);

                // Save the URL in case we're toying with the If-Modified-Since
                // and/or If-None-Match header later on
                cacheURL = s.url;

                // More options handling for requests with no content
                if (!s.hasContent) {

                    // If data is available, append data to url
                    if (s.data) {
                        cacheURL = (s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data);
                        // #9682: remove data so that it's not used in an eventual retry
                        delete s.data;
                    }

                    // Add anti-cache in url if needed
                    if (s.cache === false) {
                        s.url = rts.test(cacheURL) ?

                            // If there is already a '_' parameter, set its value
                            cacheURL.replace(rts, "$1_=" + nonce++) :

                            // Otherwise add one to the end
                            cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
                    }
                }

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if (s.ifModified) {
                    if (jQuery.lastModified[cacheURL]) {
                        jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
                    }
                    if (jQuery.etag[cacheURL]) {
                        jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
                    }
                }

                // Set the correct header, if data is being sent
                if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                    jqXHR.setRequestHeader("Content-Type", s.contentType);
                }

                // Set the Accepts header for the server, depending on the dataType
                jqXHR.setRequestHeader(
                    "Accept",
                    s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
                    s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
                    s.accepts["*"]
                );

                // Check for headers option
                for (i in s.headers) {
                    jqXHR.setRequestHeader(i, s.headers[i]);
                }

                // Allow custom headers/mimetypes and early abort
                if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                    // Abort if not done already and return
                    return jqXHR.abort();
                }

                // aborting is no longer a cancellation
                strAbort = "abort";

                // Install callbacks on deferreds
                for (i in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) {
                    jqXHR[i](s[i]);
                }

                // Get transport
                transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

                // If no transport, we auto-abort
                if (!transport) {
                    done(-1, "No Transport");
                } else {
                    jqXHR.readyState = 1;

                    // Send global event
                    if (fireGlobals) {
                        globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                    }
                    // Timeout
                    if (s.async && s.timeout > 0) {
                        timeoutTimer = setTimeout(function() {
                            jqXHR.abort("timeout");
                        }, s.timeout);
                    }

                    try {
                        state = 1;
                        transport.send(requestHeaders, done);
                    } catch (e) {
                        // Propagate exception as error if not done
                        if (state < 2) {
                            done(-1, e);
                            // Simply rethrow otherwise
                        } else {
                            throw e;
                        }
                    }
                }

                // Callback for when everything is done
                function done(status, nativeStatusText, responses, headers) {
                    var isSuccess, success, error, response, modified,
                        statusText = nativeStatusText;

                    // Called once
                    if (state === 2) {
                        return;
                    }

                    // State is "done" now
                    state = 2;

                    // Clear timeout if it exists
                    if (timeoutTimer) {
                        clearTimeout(timeoutTimer);
                    }

                    // Dereference transport for early garbage collection
                    // (no matter how long the jqXHR object will be used)
                    transport = undefined;

                    // Cache response headers
                    responseHeadersString = headers || "";

                    // Set readyState
                    jqXHR.readyState = status > 0 ? 4 : 0;

                    // Determine if successful
                    isSuccess = status >= 200 && status < 300 || status === 304;

                    // Get response data
                    if (responses) {
                        response = ajaxHandleResponses(s, jqXHR, responses);
                    }

                    // Convert no matter what (that way responseXXX fields are always set)
                    response = ajaxConvert(s, response, jqXHR, isSuccess);

                    // If successful, handle type chaining
                    if (isSuccess) {

                        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                        if (s.ifModified) {
                            modified = jqXHR.getResponseHeader("Last-Modified");
                            if (modified) {
                                jQuery.lastModified[cacheURL] = modified;
                            }
                            modified = jqXHR.getResponseHeader("etag");
                            if (modified) {
                                jQuery.etag[cacheURL] = modified;
                            }
                        }

                        // if no content
                        if (status === 204 || s.type === "HEAD") {
                            statusText = "nocontent";

                            // if not modified
                        } else if (status === 304) {
                            statusText = "notmodified";

                            // If we have data, let's convert it
                        } else {
                            statusText = response.state;
                            success = response.data;
                            error = response.error;
                            isSuccess = !error;
                        }
                    } else {
                        // We extract error from statusText
                        // then normalize statusText and status for non-aborts
                        error = statusText;
                        if (status || !statusText) {
                            statusText = "error";
                            if (status < 0) {
                                status = 0;
                            }
                        }
                    }

                    // Set data for the fake xhr object
                    jqXHR.status = status;
                    jqXHR.statusText = (nativeStatusText || statusText) + "";

                    // Success/Error
                    if (isSuccess) {
                        deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                    } else {
                        deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                    }

                    // Status-dependent callbacks
                    jqXHR.statusCode(statusCode);
                    statusCode = undefined;

                    if (fireGlobals) {
                        globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
                    }

                    // Complete
                    completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

                    if (fireGlobals) {
                        globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                        // Handle the global AJAX counter
                        if (!(--jQuery.active)) {
                            jQuery.event.trigger("ajaxStop");
                        }
                    }
                }

                return jqXHR;
            },

            getJSON: function(url, data, callback) {
                return jQuery.get(url, data, callback, "json");
            },

            getScript: function(url, callback) {
                return jQuery.get(url, undefined, callback, "script");
            }
        });

        jQuery.each(["get", "post"], function(i, method) {
            jQuery[method] = function(url, data, callback, type) {
                // shift arguments if data argument was omitted
                if (jQuery.isFunction(data)) {
                    type = type || callback;
                    callback = data;
                    data = undefined;
                }

                return jQuery.ajax({
                    url: url,
                    type: method,
                    dataType: type,
                    data: data,
                    success: callback
                });
            };
        });

        // Attach a bunch of functions for handling common AJAX events
        jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(i, type) {
            jQuery.fn[type] = function(fn) {
                return this.on(type, fn);
            };
        });


        jQuery._evalUrl = function(url) {
            return jQuery.ajax({
                url: url,
                type: "GET",
                dataType: "script",
                async: false,
                global: false,
                "throws": true
            });
        };


        jQuery.fn.extend({
            wrapAll: function(html) {
                if (jQuery.isFunction(html)) {
                    return this.each(function(i) {
                        jQuery(this).wrapAll(html.call(this, i));
                    });
                }

                if (this[0]) {
                    // The elements to wrap the target around
                    var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                    if (this[0].parentNode) {
                        wrap.insertBefore(this[0]);
                    }

                    wrap.map(function() {
                        var elem = this;

                        while (elem.firstChild && elem.firstChild.nodeType === 1) {
                            elem = elem.firstChild;
                        }

                        return elem;
                    }).append(this);
                }

                return this;
            },

            wrapInner: function(html) {
                if (jQuery.isFunction(html)) {
                    return this.each(function(i) {
                        jQuery(this).wrapInner(html.call(this, i));
                    });
                }

                return this.each(function() {
                    var self = jQuery(this),
                        contents = self.contents();

                    if (contents.length) {
                        contents.wrapAll(html);

                    } else {
                        self.append(html);
                    }
                });
            },

            wrap: function(html) {
                var isFunction = jQuery.isFunction(html);

                return this.each(function(i) {
                    jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
                });
            },

            unwrap: function() {
                return this.parent().each(function() {
                    if (!jQuery.nodeName(this, "body")) {
                        jQuery(this).replaceWith(this.childNodes);
                    }
                }).end();
            }
        });


        jQuery.expr.filters.hidden = function(elem) {
            // Support: Opera <= 12.12
            // Opera reports offsetWidths and offsetHeights less than zero on some elements
            return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
                (!support.reliableHiddenOffsets() &&
                    ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
        };

        jQuery.expr.filters.visible = function(elem) {
            return !jQuery.expr.filters.hidden(elem);
        };




        var r20 = /%20/g,
            rbracket = /\[\]$/,
            rCRLF = /\r?\n/g,
            rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i;

        function buildParams(prefix, obj, traditional, add) {
            var name;

            if (jQuery.isArray(obj)) {
                // Serialize array item.
                jQuery.each(obj, function(i, v) {
                    if (traditional || rbracket.test(prefix)) {
                        // Treat each array item as a scalar.
                        add(prefix, v);

                    } else {
                        // Item is non-scalar (array or object), encode its numeric index.
                        buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                    }
                });

            } else if (!traditional && jQuery.type(obj) === "object") {
                // Serialize object item.
                for (name in obj) {
                    buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
                }

            } else {
                // Serialize scalar item.
                add(prefix, obj);
            }
        }

        // Serialize an array of form elements or a set of
        // key/values into a query string
        jQuery.param = function(a, traditional) {
            var prefix,
                s = [],
                add = function(key, value) {
                    // If value is a function, invoke it and return its value
                    value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
                    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                };

            // Set traditional to true for jQuery <= 1.3.2 behavior.
            if (traditional === undefined) {
                traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
            }

            // If an array was passed in, assume that it is an array of form elements.
            if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
                // Serialize the form elements
                jQuery.each(a, function() {
                    add(this.name, this.value);
                });

            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for (prefix in a) {
                    buildParams(prefix, a[prefix], traditional, add);
                }
            }

            // Return the resulting serialization
            return s.join("&").replace(r20, "+");
        };

        jQuery.fn.extend({
            serialize: function() {
                return jQuery.param(this.serializeArray());
            },
            serializeArray: function() {
                return this.map(function() {
                        // Can add propHook for "elements" to filter or add form elements
                        var elements = jQuery.prop(this, "elements");
                        return elements ? jQuery.makeArray(elements) : this;
                    })
                    .filter(function() {
                        var type = this.type;
                        // Use .is(":disabled") so that fieldset[disabled] works
                        return this.name && !jQuery(this).is(":disabled") &&
                            rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                            (this.checked || !rcheckableType.test(type));
                    })
                    .map(function(i, elem) {
                        var val = jQuery(this).val();

                        return val == null ?
                            null :
                            jQuery.isArray(val) ?
                            jQuery.map(val, function(val) {
                                return {
                                    name: elem.name,
                                    value: val.replace(rCRLF, "\r\n")
                                };
                            }) : {
                                name: elem.name,
                                value: val.replace(rCRLF, "\r\n")
                            };
                    }).get();
            }
        });


        // Create the request object
        // (This is still attached to ajaxSettings for backward compatibility)
        jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
            // Support: IE6+
            function() {

                // XHR cannot access local files, always use ActiveX for that case
                return !this.isLocal &&

                    // Support: IE7-8
                    // oldIE XHR does not support non-RFC2616 methods (#13240)
                    // See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
                    // and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
                    // Although this check for six methods instead of eight
                    // since IE also does not support "trace" and "connect"
                    /^(get|post|head|put|delete|options)$/i.test(this.type) &&

                    createStandardXHR() || createActiveXHR();
            } :
            // For all other browsers, use the standard XMLHttpRequest object
            createStandardXHR;

        var xhrId = 0,
            xhrCallbacks = {},
            xhrSupported = jQuery.ajaxSettings.xhr();

        // Support: IE<10
        // Open requests must be manually aborted on unload (#5280)
        if (window.ActiveXObject) {
            jQuery(window).on("unload", function() {
                for (var key in xhrCallbacks) {
                    xhrCallbacks[key](undefined, true);
                }
            });
        }

        // Determine support properties
        support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
        xhrSupported = support.ajax = !!xhrSupported;

        // Create transport if the browser can provide an xhr
        if (xhrSupported) {

            jQuery.ajaxTransport(function(options) {
                // Cross domain only allowed if supported through XMLHttpRequest
                if (!options.crossDomain || support.cors) {

                    var callback;

                    return {
                        send: function(headers, complete) {
                            var i,
                                xhr = options.xhr(),
                                id = ++xhrId;

                            // Open the socket
                            xhr.open(options.type, options.url, options.async, options.username, options.password);

                            // Apply custom fields if provided
                            if (options.xhrFields) {
                                for (i in options.xhrFields) {
                                    xhr[i] = options.xhrFields[i];
                                }
                            }

                            // Override mime type if needed
                            if (options.mimeType && xhr.overrideMimeType) {
                                xhr.overrideMimeType(options.mimeType);
                            }

                            // X-Requested-With header
                            // For cross-domain requests, seeing as conditions for a preflight are
                            // akin to a jigsaw puzzle, we simply never set it to be sure.
                            // (it can always be set on a per-request basis or even using ajaxSetup)
                            // For same-domain requests, won't change header if already provided.
                            if (!options.crossDomain && !headers["X-Requested-With"]) {
                                headers["X-Requested-With"] = "XMLHttpRequest";
                            }

                            // Set headers
                            for (i in headers) {
                                // Support: IE<9
                                // IE's ActiveXObject throws a 'Type Mismatch' exception when setting
                                // request header to a null-value.
                                //
                                // To keep consistent with other XHR implementations, cast the value
                                // to string and ignore `undefined`.
                                if (headers[i] !== undefined) {
                                    xhr.setRequestHeader(i, headers[i] + "");
                                }
                            }

                            // Do send the request
                            // This may raise an exception which is actually
                            // handled in jQuery.ajax (so no try/catch here)
                            xhr.send((options.hasContent && options.data) || null);

                            // Listener
                            callback = function(_, isAbort) {
                                var status, statusText, responses;

                                // Was never called and is aborted or complete
                                if (callback && (isAbort || xhr.readyState === 4)) {
                                    // Clean up
                                    delete xhrCallbacks[id];
                                    callback = undefined;
                                    xhr.onreadystatechange = jQuery.noop;

                                    // Abort manually if needed
                                    if (isAbort) {
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        responses = {};
                                        status = xhr.status;

                                        // Support: IE<10
                                        // Accessing binary-data responseText throws an exception
                                        // (#11426)
                                        if (typeof xhr.responseText === "string") {
                                            responses.text = xhr.responseText;
                                        }

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if (!status && options.isLocal && !options.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }

                                // Call complete if needed
                                if (responses) {
                                    complete(status, statusText, responses, xhr.getAllResponseHeaders());
                                }
                            };

                            if (!options.async) {
                                // if we're in sync mode we fire the callback
                                callback();
                            } else if (xhr.readyState === 4) {
                                // (IE6 & IE7) if it's in cache and has been
                                // retrieved directly we need to fire the callback
                                setTimeout(callback);
                            } else {
                                // Add to the list of active xhr callbacks
                                xhr.onreadystatechange = xhrCallbacks[id] = callback;
                            }
                        },

                        abort: function() {
                            if (callback) {
                                callback(undefined, true);
                            }
                        }
                    };
                }
            });
        }

        // Functions to create xhrs
        function createStandardXHR() {
            try {
                return new window.XMLHttpRequest();
            } catch (e) {}
        }

        function createActiveXHR() {
            try {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }




        // Install script dataType
        jQuery.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(text) {
                    jQuery.globalEval(text);
                    return text;
                }
            }
        });

        // Handle cache's special case and global
        jQuery.ajaxPrefilter("script", function(s) {
            if (s.cache === undefined) {
                s.cache = false;
            }
            if (s.crossDomain) {
                s.type = "GET";
                s.global = false;
            }
        });

        // Bind script tag hack transport
        jQuery.ajaxTransport("script", function(s) {

            // This transport only deals with cross domain requests
            if (s.crossDomain) {

                var script,
                    head = document.head || jQuery("head")[0] || document.documentElement;

                return {

                    send: function(_, callback) {

                        script = document.createElement("script");

                        script.async = true;

                        if (s.scriptCharset) {
                            script.charset = s.scriptCharset;
                        }

                        // HACK: Ensure Cloudflare Rocket Loader never caches AJAX calls.
                        script.setAttribute('data-cfasync', 'false');

                        script.src = s.url;

                        // Attach handlers for all browsers
                        script.onload = script.onreadystatechange = function(_, isAbort) {

                            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

                                // Handle memory leak in IE
                                script.onload = script.onreadystatechange = null;

                                // Remove the script
                                if (script.parentNode) {
                                    script.parentNode.removeChild(script);
                                }

                                // Dereference the script
                                script = null;

                                // Callback if not abort
                                if (!isAbort) {
                                    callback(200, "success");
                                }
                            }
                        };

                        // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                        // Use native DOM manipulation to avoid our domManip AJAX trickery
                        head.insertBefore(script, head.firstChild);
                    },

                    abort: function() {
                        if (script) {
                            script.onload(undefined, true);
                        }
                    }
                };
            }
        });




        var oldCallbacks = [],
            rjsonp = /(=)\?(?=&|$)|\?\?/;

        // Default jsonp settings
        jQuery.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
                this[callback] = true;
                return callback;
            }
        });

        // Detect, normalize options and install callbacks for jsonp requests
        jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {

            var callbackName, overwritten, responseContainer,
                jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
                    "url" :
                    typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data"
                );

            // Handle iff the expected data type is "jsonp" or we have a parameter to set
            if (jsonProp || s.dataTypes[0] === "jsonp") {

                // Get callback name, remembering preexisting value associated with it
                callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
                    s.jsonpCallback() :
                    s.jsonpCallback;

                // Insert callback into url or form data
                if (jsonProp) {
                    s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
                } else if (s.jsonp !== false) {
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
                }

                // Use data converter to retrieve json after script execution
                s.converters["script json"] = function() {
                    if (!responseContainer) {
                        jQuery.error(callbackName + " was not called");
                    }
                    return responseContainer[0];
                };

                // force json dataType
                s.dataTypes[0] = "json";

                // Install callback
                overwritten = window[callbackName];
                window[callbackName] = function() {
                    responseContainer = arguments;
                };

                // Clean-up function (fires after converters)
                jqXHR.always(function() {
                    // Restore preexisting value
                    window[callbackName] = overwritten;

                    // Save back as free
                    if (s[callbackName]) {
                        // make sure that re-using the options doesn't screw things around
                        s.jsonpCallback = originalSettings.jsonpCallback;

                        // save the callback name for future use
                        oldCallbacks.push(callbackName);
                    }

                    // Call if it was a function and we have a response
                    if (responseContainer && jQuery.isFunction(overwritten)) {
                        overwritten(responseContainer[0]);
                    }

                    responseContainer = overwritten = undefined;
                });

                // Delegate to script
                return "script";
            }
        });




        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // keepScripts (optional): If true, will include scripts passed in the html string
        jQuery.parseHTML = function(data, context, keepScripts) {
            if (!data || typeof data !== "string") {
                return null;
            }
            if (typeof context === "boolean") {
                keepScripts = context;
                context = false;
            }
            context = context || document;

            var parsed = rsingleTag.exec(data),
                scripts = !keepScripts && [];

            // Single tag
            if (parsed) {
                return [context.createElement(parsed[1])];
            }

            parsed = jQuery.buildFragment([data], context, scripts);

            if (scripts && scripts.length) {
                jQuery(scripts).remove();
            }

            return jQuery.merge([], parsed.childNodes);
        };


        // Keep a copy of the old load method
        var _load = jQuery.fn.load;

        /**
         * Load a url into a page
         */
        jQuery.fn.load = function(url, params, callback) {
            if (typeof url !== "string" && _load) {
                return _load.apply(this, arguments);
            }

            var selector, response, type,
                self = this,
                off = url.indexOf(" ");

            if (off >= 0) {
                selector = jQuery.trim(url.slice(off, url.length));
                url = url.slice(0, off);
            }

            // If it's a function
            if (jQuery.isFunction(params)) {

                // We assume that it's the callback
                callback = params;
                params = undefined;

                // Otherwise, build a param string
            } else if (params && typeof params === "object") {
                type = "POST";
            }

            // If we have elements to modify, make the request
            if (self.length > 0) {
                jQuery.ajax({
                    url: url,

                    // if "type" variable is undefined, then "GET" method will be used
                    type: type,
                    dataType: "html",
                    data: params
                }).done(function(responseText) {

                    // Save response for use in complete callback
                    response = arguments;

                    self.html(selector ?

                        // If a selector was specified, locate the right elements in a dummy div
                        // Exclude scripts to avoid IE 'Permission Denied' errors
                        jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

                        // Otherwise use the full result
                        responseText);

                }).complete(callback && function(jqXHR, status) {
                    self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
                });
            }

            return this;
        };




        jQuery.expr.filters.animated = function(elem) {
            return jQuery.grep(jQuery.timers, function(fn) {
                return elem === fn.elem;
            }).length;
        };





        var docElem = window.document.documentElement;

        /**
         * Gets a window from an element
         */
        function getWindow(elem) {
            return jQuery.isWindow(elem) ?
                elem :
                elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
        }

        jQuery.offset = {
            setOffset: function(elem, options, i) {
                var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
                    position = jQuery.css(elem, "position"),
                    curElem = jQuery(elem),
                    props = {};

                // set position first, in-case top/left are set even on static elem
                if (position === "static") {
                    elem.style.position = "relative";
                }

                curOffset = curElem.offset();
                curCSSTop = jQuery.css(elem, "top");
                curCSSLeft = jQuery.css(elem, "left");
                calculatePosition = (position === "absolute" || position === "fixed") &&
                    jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1;

                // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
                if (calculatePosition) {
                    curPosition = curElem.position();
                    curTop = curPosition.top;
                    curLeft = curPosition.left;
                } else {
                    curTop = parseFloat(curCSSTop) || 0;
                    curLeft = parseFloat(curCSSLeft) || 0;
                }

                if (jQuery.isFunction(options)) {
                    options = options.call(elem, i, curOffset);
                }

                if (options.top != null) {
                    props.top = (options.top - curOffset.top) + curTop;
                }
                if (options.left != null) {
                    props.left = (options.left - curOffset.left) + curLeft;
                }

                if ("using" in options) {
                    options.using.call(elem, props);
                } else {
                    curElem.css(props);
                }
            }
        };

        jQuery.fn.extend({
            offset: function(options) {
                if (arguments.length) {
                    return options === undefined ?
                        this :
                        this.each(function(i) {
                            jQuery.offset.setOffset(this, options, i);
                        });
                }

                var docElem, win,
                    box = {
                        top: 0,
                        left: 0
                    },
                    elem = this[0],
                    doc = elem && elem.ownerDocument;

                if (!doc) {
                    return;
                }

                docElem = doc.documentElement;

                // Make sure it's not a disconnected DOM node
                if (!jQuery.contains(docElem, elem)) {
                    return box;
                }

                // If we don't have gBCR, just use 0,0 rather than error
                // BlackBerry 5, iOS 3 (original iPhone)
                if (typeof elem.getBoundingClientRect !== strundefined) {
                    box = elem.getBoundingClientRect();
                }
                win = getWindow(doc);
                return {
                    top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                    left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
                };
            },

            position: function() {
                if (!this[0]) {
                    return;
                }

                var offsetParent, offset,
                    parentOffset = {
                        top: 0,
                        left: 0
                    },
                    elem = this[0];

                // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
                if (jQuery.css(elem, "position") === "fixed") {
                    // we assume that getBoundingClientRect is available when computed position is fixed
                    offset = elem.getBoundingClientRect();
                } else {
                    // Get *real* offsetParent
                    offsetParent = this.offsetParent();

                    // Get correct offsets
                    offset = this.offset();
                    if (!jQuery.nodeName(offsetParent[0], "html")) {
                        parentOffset = offsetParent.offset();
                    }

                    // Add offsetParent borders
                    parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
                    parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
                }

                // Subtract parent offsets and element margins
                // note: when an element has margin: auto the offsetLeft and marginLeft
                // are the same in Safari causing offset.left to incorrectly be 0
                return {
                    top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
                    left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
                };
            },

            offsetParent: function() {
                return this.map(function() {
                    var offsetParent = this.offsetParent || docElem;

                    while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
                        offsetParent = offsetParent.offsetParent;
                    }
                    return offsetParent || docElem;
                });
            }
        });

        // Create scrollLeft and scrollTop methods
        jQuery.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(method, prop) {
            var top = /Y/.test(prop);

            jQuery.fn[method] = function(val) {
                return access(this, function(elem, method, val) {
                    var win = getWindow(elem);

                    if (val === undefined) {
                        return win ? (prop in win) ? win[prop] :
                            win.document.documentElement[method] :
                            elem[method];
                    }

                    if (win) {
                        win.scrollTo(!top ? val : jQuery(win).scrollLeft(),
                            top ? val : jQuery(win).scrollTop()
                        );

                    } else {
                        elem[method] = val;
                    }
                }, method, val, arguments.length, null);
            };
        });

        // Add the top/left cssHooks using jQuery.fn.position
        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        jQuery.each(["top", "left"], function(i, prop) {
            jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,
                function(elem, computed) {
                    if (computed) {
                        computed = curCSS(elem, prop);
                        // if curCSS returns percentage, fallback to offset
                        return rnumnonpx.test(computed) ?
                            jQuery(elem).position()[prop] + "px" :
                            computed;
                    }
                }
            );
        });


        // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
        jQuery.each({
            Height: "height",
            Width: "width"
        }, function(name, type) {
            jQuery.each({
                padding: "inner" + name,
                content: type,
                "": "outer" + name
            }, function(defaultExtra, funcName) {
                // margin is only for outerHeight, outerWidth
                jQuery.fn[funcName] = function(margin, value) {
                    var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                        extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

                    return access(this, function(elem, type, value) {
                        var doc;

                        if (jQuery.isWindow(elem)) {
                            // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                            // isn't a whole lot we can do. See pull request at this URL for discussion:
                            // https://github.com/jquery/jquery/pull/764
                            return elem.document.documentElement["client" + name];
                        }

                        // Get document width or height
                        if (elem.nodeType === 9) {
                            doc = elem.documentElement;

                            // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                            // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                            return Math.max(
                                elem.body["scroll" + name], doc["scroll" + name],
                                elem.body["offset" + name], doc["offset" + name],
                                doc["client" + name]
                            );
                        }

                        return value === undefined ?
                            // Get width or height on the element, requesting but not forcing parseFloat
                            jQuery.css(elem, type, extra) :

                            // Set width or height on the element
                            jQuery.style(elem, type, value, extra);
                    }, type, chainable ? margin : undefined, chainable, null);
                };
            });
        });


        // The number of elements contained in the matched element set
        jQuery.fn.size = function() {
            return this.length;
        };

        jQuery.fn.andSelf = jQuery.fn.addBack;




        // Register as a named AMD module, since jQuery can be concatenated with other
        // files that may use define, but not via a proper concatenation script that
        // understands anonymous AMD modules. A named AMD is safest and most robust
        // way to register. Lowercase jquery is used because AMD module names are
        // derived from file names, and jQuery is normally delivered in a lowercase
        // file name. Do this after creating the global so that if an AMD module wants
        // to call noConflict to hide this version of jQuery, it will work.

        // Note that for maximum portability, libraries that are not jQuery should
        // declare themselves as anonymous modules, and avoid setting a global if an
        // AMD loader is present. jQuery is a special case. For more information, see
        // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

        if (typeof define === "function" && define.amd) {
            define("jquery", [], function() {
                return jQuery;
            });
        }




        var
            // Map over jQuery in case of overwrite
            _jQuery = window.jQuery,

            // Map over the $ in case of overwrite
            _$ = window.$;

        jQuery.noConflict = function(deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }

            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }

            return jQuery;
        };

        // Expose jQuery and $ identifiers, even in
        // AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
        // and CommonJS for browser emulators (#13566)
        if (typeof noGlobal === strundefined) {
            window.jQuery = window.$ = jQuery;
        }




        return jQuery;

    }));

    define('platform/jquery', ['require', 'platform/vendor/jquery-1.11.1'], function(require) {
        var $ = require('platform/vendor/jquery-1.11.1');
        var origInit = $.fn.init;

        // $.createContext = function ( context ) {
        //   context = context || global.document;

        //   var x = function ( selector, context ) {
        //     return new x.fn.init(selector, context);
        //   };

        //   for ( var prop in $ ) {
        //     if ( $.hasOwnProperty(prop) ) {
        //       x[prop] = $.prop;
        //     }
        //   }
        // };

        $.forWindow = function(window) {
            return $.factory(window, true);
        };

        $.fn.init = function(selector, context, rootjQuery) {
            context = context || document;
            return new origInit(selector, context, rootjQuery);
        };

        $.internal = function(selector, context, rootjQuery) {
            return new origInit(selector, context, rootjQuery);
        };

        return $;
    });

    /**
     * Internally bundled jQuery library (v1.11.1)
     *
     * A reference to the library is also stored on the global `fanplayr` object as `fanplayr.$`.
     *
     * @namespace jquery
     */
    ;
    define('platform/log', [], function() {
        var COLORS = [
            '#84cc16',
            '#22c55e',
            '#10b981',
            '#14b8a6',
            '#0891b2',
            '#0ea5e9',
            '#3b82f6',
            '#6366f1',
            '#8b5cf6',
            '#a855f7',
            '#d946ef',
            '#ec4899',
            '#f43f5e',
            '#ef4444',
            '#f97316',
            '#f59e0b',
            '#eab308'
        ];

        var colorIndex = 0;
        var namespaceMatcher = createNamespaceMatcher();

        /**
         * @param {string} namespace
         */
        function create(namespace) {
            /** @type {Platform.Log.Logger} */
            var logger;
            // @ts-expect-error
            logger = function() {
                if (logger.enabled) {
                    try {
                        var args = Array.prototype.slice.call(arguments);
                        formatArgs(logger, args);
                        /* globals console */
                        var logFn = console.debug || console.log || function() {};
                        logFn.apply(logger, args);
                    } catch (ex) {}
                }
            };
            logger.color = getColor(namespace);
            logger.namespace = namespace;
            logger.enabled = namespaceMatcher(namespace);
            logger.create = create;
            return logger;
        }

        /**
         * Accepts a string of namespace patterns and returns a function that can be
         * used to determine if individual namespaces are enabled.
         *
         * A hyphen (-) at the start of the pattern negates it and excludes it from
         * being enabled. For a logger to be enabled, its namespace must match AT
         * LEAST ONE inclusive pattern and MOST NOT MATCH ANY exclusive patterns.
         *
         * For example a pattern of `*,-platform:*` would enable all loggers except for
         * namespaces starting with "platform:".
         * @returns {(namespace: string) => boolean}
         */
        function createNamespaceMatcher() {
            try {
                var pattern = localStorage.getItem('fp_logger');
                /** @type {RegExp[]} */
                var includeRegExps = [];
                /** @type {RegExp[]} */
                var excludeRegExps = [];
                (pattern || '').split(',').forEach(function(patternPart) {
                    var isNegated = false;
                    if (patternPart[0] === '-') {
                        isNegated = true;
                        patternPart = patternPart.slice(1);
                    }
                    var regExp = createRegExpFromPattern(patternPart);
                    if (isNegated) {
                        excludeRegExps.push(regExp);
                    } else {
                        includeRegExps.push(regExp);
                    }
                });
                /**
                 * @param {string} namespace
                 */
                return function(namespace) {
                    var matchesAnyInclude = includeRegExps.some(function(regExp) {
                        return regExp.test(namespace);
                    });
                    var matchesAnyExclude = excludeRegExps.some(function(regExp) {
                        return regExp.test(namespace);
                    });
                    return matchesAnyInclude && !matchesAnyExclude;
                };
            } catch (ex) {
                return function() {
                    return false;
                };
            }
        }

        /**
         * Creates a regular expression that uses `*` as wildcards to match any
         * character.
         * @param {string} userPattern
         */
        function createRegExpFromPattern(userPattern) {
            var pattern = userPattern
                .replace(/([\^\$\.\+\?\(\)\[\]\{\}|])/g, '\\$1')
                .replace(/\*/g, '.*');
            var regExp = new RegExp('^' + pattern + '$');
            return regExp;
        }

        /**
         * @param {string} namespace
         */
        function getColor(namespace) {
            if (colorIndex + 1 >= COLORS.length) {
                colorIndex = 0;
            }
            var index = ++colorIndex;
            var color = COLORS[index];
            // console.log(
            //   'Logger color for namespace "%s" is %c%s %c%o',
            //   namespace,
            //   'color: ' + color,
            //   color,
            //   'color: inherit',
            //   {
            //     // hash: hash,
            //     index: index
            //   }
            // );
            return color;
        }

        /**
         * @param {Platform.Log.Logger} logger
         * @param {any[]} args
         */
        function formatArgs(logger, args) {
            var namespace = 'fanplayr:' + logger.namespace;
            args[0] = '%c' + namespace + ' %c' + args[0];
            // Insert two CSS values for the `%c` placeholders used in the first argument.
            // These must be inserted directly after the first argument.
            args.splice(1, 0, 'color: ' + logger.color, 'color: inherit');
        }

        var defaultLogger = create('fanplayr');
        return defaultLogger;
    });

    define('platform/parser', [], function() {
        var parser = {};

        parser.parseNumber = function(value, defaultValue) {
            var match = String(value).match(/-?(\d+\.\d+|\.\d+|\d+)/);
            if (match) {
                return parseFloat(match[1]);
            }
            return (typeof defaultValue !== "undefined") ? defaultValue : 0;
        };

        parser.parseCurrency = function(value, defaultValue) {
            if (typeof value === "number") {
                return value;
            }
            if (typeof defaultValue === "undefined") {
                defaultValue = 0;
            }
            if (typeof value === "string") {
                return parser.parseNumber(value.replace(/,/g, ""), defaultValue);
            }
            return defaultValue;
        };

        var iso8601RegEx = /(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}[.+\-:\dZ]*)/;
        parser.extractDateISO = function(value) {
            var match = String(value).match(iso8601RegEx);
            return match && match[1] || null;
        };

        return parser;
    });

    define('platform/dataApi', ['require', 'platform/utils'], function(require) {
        var _ = require('platform/utils');

        /**
         * External Data API
         *
         * The platform treats any objects defined in the global `fanplayr_data` array as API requests,
         * allowing integrations to interact with the platform before it is loaded.
         *
         * All request objects must contain a `_type` property which specifies the API to invoke.
         *
         * @namespace dataApi
         */

        /**
         * For every "platform.config" API, the platform will merge all properties
         * in the request into its config in the order defined. This allows integrations
         * to specify platform configuration variables before Fanplayr has initialized.
         *
         * @event dataApi#"platform.config"
         * @type {object}
         * @property {String} _type - "platform.config"
         *
         * @example
         * // Cross-domain integrations that know their storeDomain and/or accountKey
         * // can specify them ahead of time.
         * fanplayr_data.push({
         *   "_type": "platform.config",
         *   "accountKey": "123",
         *   "storeDomain": "example.com"
         * });
         */

        /**
         * Merges the contents of the object into {@link state.page#data} when the platform initializes.
         * Data will be merged in the order it is pushed.
         *
         * This object should not contain nested data.
         *
         * @event dataApi#"page.data"
         * @type {object}
         * @property {String} _type - "page.data"
         *
         * @example
         * // Sets "state.page.data.numAdults" to "2",
         * // and "state.page.data.destination" to "SFO".
         * fanplayr_data.push({
         *   "_type": "page.data",
         *   "numAdults": "2",
         *   "destination": "SFO"
         * });
         */

        /**
         * Returns an array of all API requests matching a specific type.
         *
         * Each request object is cloned with its special `_type` field removed
         * before adding it to the resulting array.
         *
         * @function dataApi#getByType
         * @param {String} type - The API type to match.
         * @returns {Array}
         *
         * @example
         * // Somwehre externally.
         * var fanplayr_data = [];
         * fanplayr_data.push({ "_type": "platform.config", "accountKey": "xxx" });
         *
         * // Find all requests of a specific type
         * dataApi.getByType("platform.config");
         * // → [{ accountKey: "xxx" }]
         */
        function find(type) {
            // @ts-ignore
            var entries = window.fanplayr_api || window.fanplayr_data || [];
            var results = [];
            _.each(entries, function(entry) {
                if (entry && typeof entry === "object") {
                    var _type = entry._type;
                    if (_type === type) {
                        entry = _.clone(entry);
                        delete entry._type;
                        // Copy functions back to cloned object.
                        _.each(entry, function(val, key) {
                            if (typeof val === "function") {
                                entry[key] = val;
                            }
                        });
                        results.push(entry);
                    }
                }
            });
            return results;
        }

        /** @type {Platform.DataApi.WatchCallback[]} */
        var watchCallbacks = [];

        function watchDataArray() {
            // @ts-ignore
            var array = window.fanplayr_api || window.fanplayr_data;
            if (_.isArray(array)) {
                array.push = function() {
                    var entries = arguments;
                    _.forEach(watchCallbacks, function(callback) {
                        _.forEach(entries, function(entry) {
                            invokeWatcherCallback(entry, callback);
                        });
                    });
                    return Array.prototype.push.apply(this, entries);
                };
            }
        }

        /**
         *
         * @param {Platform.DataApi.Entry} entry
         * @param {Platform.DataApi.WatchCallback} callback
         */
        function invokeWatcherCallback(entry, callback) {
            var type = entry._type;
            entry = _.cloneDeep(entry);
            delete entry._type;
            callback(type, entry);
        }

        watchDataArray();

        return {
            getByType: find,
            watch: function(callback, options) {
                if (options && options.existing) {
                    // @ts-ignore
                    var array = window.fanplayr_api || window.fanplayr_data || [];
                    _.forEach(array, function(item) {
                        invokeWatcherCallback(item, callback);
                    });
                }
                watchCallbacks.push(callback);
            }
        };
    });

    define('platform/state', ['require', 'platform', 'platform/utils', 'platform/json', 'platform/log', 'platform/parser', 'platform/dataApi'], function(require) {
        var platform = require('platform');
        var _ = require('platform/utils');
        var JSON = require('platform/json');
        var log = require('platform/log');
        var parser = require('platform/parser');
        var dataApi = require('platform/dataApi');

        function serialize(obj, defaults) {
            var data = {};
            _.each(defaults, function(defaultValue, prop) {
                data[prop] = obj[prop] || defaultValue;
            });
            return data;
        }

        function deserialize(obj, data, defaults) {
            _.each(defaults, function(defaultValue, prop) {
                obj[prop] = data && data[prop] || defaultValue;
            });
        }

        /**
         * A namespace.
         * @namespace state
         *
         * @property {state.user} user - User details.
         * @property {state.page} page - Page details.
         * @property {state.cart} cart - Cart details.
         * @property {state.order} order - Order details.
         */

        function State() {
            this.user = null;
            this.page = null;
            this.cart = null;
            this.order = null;
            this.clear();
        }

        State.prototype = {
            clear: function() {
                this.user = new User();
                this.page = new Page();
                this.cart = new Cart();
                this.order = new Order();
            },

            serialize: function() {
                return {
                    user: this.user.serialize(),
                    page: this.page.serialize(),
                    cart: this.cart.serialize(),
                    order: this.order.serialize()
                };
            },

            toJson: function() {
                return JSON.stringify(this.serialize(), null, 2);
            }
        };

        /**
         * Used to track details of the user.
         *
         * @namespace state.user
         */
        function User(obj) {
            deserialize(this, obj || {}, User.defaults);
        }

        User.defaults = {
            /**
             * The customer's ID as identified by the e-commerce store.
             *
             * @var {String} state.user.prototype.id
             * @default `null`.
             */
            id: null,

            /**
             * The customer's email.
             *
             * @var {String} state.user.prototype.email
             * @default `null`.
             */
            email: null,

            /**
             * The customer's first name.
             *
             * @var {String} state.user.prototype.firstName
             * @default `null`.
             */
            firstName: null,

            /**
             * The customer's last name.
             *
             * @var {String} state.user.prototype.lastName
             * @default `null`.
             */
            lastName: null,

            /**
             * An arbitrary identifier that can be used to group the user. E.g. "Loyal Customer".
             *
             * @var {String} state.user.prototype.group
             * @default `null`.
             */
            group: null,

            /**
             * An arbitrary identifier that can be used to segment the user.
             *
             * @var {String} state.user.prototype.segment
             * @default `null`.
             */
            segment: null,

            /**
             * Any other attributes that need to be tracked for the user.
             *
             * @var {Object} state.user.prototype.data
             * @default {}.
             */
            data: {}
        };

        User.prototype = {
            serialize: function() {
                return serialize(this, User.defaults);
            }
        };

        /**
         * Manages a collection of categories.
         *
         * <div class="banner banner-warning">This is not a real constructor and you should never have to create an instance of CategoryList.</div>
         *
         * @class state.CategoryList
         */
        function CategoryList(obj) {
            if (_.isArray(obj)) {
                // The input is an array of strings so map it to the internal format of an
                // object with each element in the array as a key in the object.
                this.list = _.reduce(obj, function(map, value) {
                    map[value] = "";
                    return map;
                }, {});
            } else {
                this.list = obj && obj.list || {};
            }
        }

        CategoryList.prototype = {
            serialize: function() {
                // return { list: this.list };
                return this.list;
            },

            /**
             * Adds a category to the list. Duplicates are not an issue as the list is backed by a hash.
             *
             * @function state.CategoryList.prototype.add
             * @param {String} id - The category identifier.
             * @param {String=} [name] - The human-friendly name of the category. If omitted, the `id` is used in its place.
             */
            add: function(id, name) {
                // this.list[id || name] = name || id;
                // Don't default name to ID. The server will handle this.

                // @ts-ignore
                this.list[id || name] = name || "";
            },

            /**
             * Removes a category if it exists.
             *
             * @function state.CategoryList.prototype.remove
             * @param {String} id - The category identifier.
             */
            remove: function(id) {
                delete this.list[id];
            },

            merge: function(obj) {

            },

            /**
             * Converts the instance to an array of objects.
             *
             * @function state.CategoryList.prototype.toArray
             * @returns {Array<{id: string, name: string}>} cat - The point generated by the factory.
             */
            toArray: function() {
                var list = [];
                for (var id in this.list) {
                    list.push({
                        id: id,
                        name: this.list[id]
                    });
                }
                return list;
            },

            /**
             * Converts the internal map object to an array containing only unique keys
             * (category IDs) and values (category names).
             * @returns {string[]}
             */
            toFlatArray: function() {
                var result = [];
                for (var id in this.list) {
                    if (id) {
                        result.push(id);
                    }
                    if (this.list[id]) {
                        result.push(this.list[id]);
                    }
                }
                return _.uniq(result);
            }
        };

        /**
         * Represents a product.
         *
         * <div class="banner banner-warning">This is not a real constructor. Please don't try to create Product instances this way. The correct way is
         * is to use methods that expect product-like plain objects, as described below:</div>
         *
         * @class state.Product
         * @example
         * // The correct way to create products is to pass plain objects
         * // with product details to methods that expect a product.
         * // Any fields that are missing from the product-like object
         * // will be filled with default values when creating the Product instance.
         * var productA = state.cart.add({
         *   id: "A",
         *   price: 25.00,
         *   name: "Big Weird Hat Thingy",
         *   // quantity is missing, so it will default to zero (0)
         * });
         * // productA is an instance of Product.
         *
         * // Now the product instance as normal.
         * productA.categories.add("50", "Hats");
         */
        function Product(obj) {
            deserialize(this, obj || {}, Product.defaults);

            /**
             * See {@link state.CategoryList|CategoryList} definition for more details.
             *
             * @memberof state.Product.prototype
             * @var {state.CategoryList} categories
             */
            this.categories = new CategoryList(obj && obj.categories);
            if (obj && obj.brands) {
                this.brands = _.clone(obj.brands);
            } else {
                this.brands = [];
            }

            if (typeof this.quantity === "string") {
                this.quantity = parser.parseCurrency(this.quantity);
            }

            if (typeof this.price === "string") {
                this.price = parser.parseNumber(this.price);
            }
        }

        Product.defaults = {
            /**
             * A unique identifier to be used internally by Fanplayr to differentiate products.
             * @var {String} state.Product.prototype.id
             * @default `null`
             */
            id: null,

            /**
             * A unique identifier that refers to a specific stock item in the retailer's inventory.
             * @var {String} [state.Product.prototype.sku]
             * @default `null`
             */
            sku: null,

            /**
             * The price of the product, which is applicable to the customer.
             * @var {Number} [state.Product.prototype.price]
             * @default 0
             */
            price: 0,

            /**
             * The total number of the product that is part of the collection.
             * @var {Number} [state.Product.prototype.quantity]
             * @default 0
             */
            quantity: 0,

            /**
             * The human-friendly name of the product, as seen by the customer.
             * @var {String} [state.Product.prototype.name]
             * @default `null`
             */
            name: null,

            /**
             * The URL of the page that displays detailed information about the product.
             * @var {String} [state.Product.prototype.url]
             * @default `null`
             */
            url: null,

            /**
             * The URL of the product's image.
             * @var {String} [state.Product.prototype.image]
             * @default `null`
             */
            image: null,

            /**
             * Any other attributes that relate to the product.
             * @var {Object} [state.Product.prototype.data={}]
             */
            data: {}
        };

        Product.prototype = {
            serialize: function() {
                var obj = serialize(this, Product.defaults);
                obj.categories = this.categories.serialize();
                return obj;
            },

            /**
             * Merges details into the product.
             *
             * @function state.Product.prototype.merge
             * @param {Record<string, any>} obj - The details to merge.
             * @returns {Product} The product.
             */
            merge: function(obj) {
                var self = this;

                _.each(obj, function(value, key) {
                    if (key === "data") {
                        // @ts-ignore
                        self.data = _.merge(self.data || {}, value);
                    } else if (key === "categories") {
                        self.categories.merge(value);
                    } else if (Product.defaults.hasOwnProperty(key)) {
                        self[key] = value;
                    }
                });

                return self;
            }
        };

        /**
         * Manages a collection of products.
         *
         * <div class="banner banner-warning">This is not a real constructor and you should never have to create an instance of ProductList.</div>
         *
         * An array with special instance methods defined on it to help manage products.
         *
         * @class state.ProductList
         */
        function ProductList(list) {
            this.list = list;
        }

        ProductList.wrap = function(array) {
            var list = new ProductList(array);
            array.serialize = _.bind(list.serialize, list);
            array.add = _.bind(list.add, list);
            array.merge = _.bind(list.merge, list);
            array.remove = _.bind(list.remove, list);
            array.replace = _.bind(list.replace, list);
            array.find = _.bind(list.find, list);
            array.clear = _.bind(list.clear, list);
            return array;
        };

        ProductList.prototype = {
            serialize: function() {
                return _.map(this.list, function(product) {
                    return product.serialize();
                });
            },

            /**
             * Empties the list of all products.
             *
             * @function state.ProductList.prototype.clear
             */
            clear: function() {
                // Empty array in place, so reference isn't lost.
                this.list.splice(0, this.list.length);
            },

            /**
             * Iterates over the product list, returning the first product that matches the query.
             *
             * - If `query` is a String, the product whose `id` matches it will be returned.
             * - If `query` is an Object, {@link utils.find} will be used to search the product list.
             * - If `query` is a {@link state.Product|Product}, the product will be returned if it is in the list.
             *
             * @function state.ProductList.prototype.find
             * @param {String|Object|Product} arg - The query.
             */
            find: function(arg) {
                var products = this.list;
                if (arg) {
                    if (arg instanceof Product) {
                        if (_.indexOf(products, arg) >= 0) {
                            return arg;
                        }
                    } else if (_.isPlainObject(arg)) {
                        return _.find(products, arg);
                    } else {
                        arg = String(arg);
                        return _.find(products, function(product) {
                            return String(product.id) === arg;
                        });
                    }
                }
            },

            /**
             * Adds a product to the list. If `object` is not an instance of {@link state.Product|Product} it will be converted to one. If a product with the same `id` already exists, its quantity will be incremented by the quantity of `object` and no other properties will be modified.
             *
             * @function state.ProductList.prototype.add
             * @param {Object|Product} obj - The product to add.
             */
            add: function(obj) {
                var self = this;
                var product = (obj instanceof Product) ? obj : new Product(obj);
                // @ts-ignore
                var existing = self.find(product.id);
                if (existing) {
                    // @ts-ignore
                    existing.quantity += product.quantity;
                    // @ts-ignore
                    log("incremented quantity of '" + product.id + "' by " + product.quantity);
                    return existing;
                } else {
                    self.list.push(product);
                }
                return product;
            },

            /**
             * Merge product details together, if a product with the same `id` exists, otherwise adds the product to the list.
             *
             * @memberof state.ProductList.prototype
             * @function merge
             * @param {Object|Product} obj - The details to merge. Must include an `id` property of an existing product.
             *
             * @example
             * // Set the quantity of the product in cart with `id` equal to "A" to 2.
             * // If there is no product in the cart with that `id`, a new product will be added.
             * var product = state.cart.products.merge({
             *   id: "A",
             *   quantity: 2
             * });
             */
            merge: function(obj) {
                var self = this;
                var existing = self.find(obj);
                if (existing) {
                    return existing.merge(obj);
                }
                return self.add(obj);
            },

            /**
             * First removes any product with a matching `id`, then adds the product to the list.
             *
             * @function state.ProductList#replace
             * @param {Object|Product} obj - The product details. Must include an `id` property.
             */
            replace: function(obj) {
                var self = this;
                self.remove(obj);
                return self.add(obj);
            },

            /**
             * Uses {@link state.ProductList#find} to find a product that matches `query`. If found, the product is removed.
             *
             * @function state.ProductList#removed
             * @param {Object|Product|String} obj - See {@link state.ProductList#find} for details.
             */
            remove: function(obj) {
                var self = this;
                var product = self.find(obj);
                if (product) {
                    var index = self.list.indexOf(product);
                    self.list.splice(index, 1);
                    return product;
                }
                return false;
            }
        };

        /**
         * Used to track details of the current page.
         * @namespace state.page
         */
        function Page(obj) {
            var that = this;
            deserialize(that, obj || {}, Page.getDefaults());
            /**
             * Represents a specific product shown on a product page. See {@link state.Product} for the default values it is initialized with.
             * @var {state.Product} [state.page.prototype.product]
             */
            that.product = new Product(obj && obj.product);

            /**
             * Represents categories on the current page.
             * @var {state.CategoryList} state.page.prototype.categories
             */
            that.categories = new CategoryList(obj && obj.categories);
        }

        Page.getDefaults = function() {
            return {
                /**
                 * The current page url. This defaults to the location of the actual page (`document.location.href`), but can be set as something else for specific tracking needs.
                 * @var {String} [state.page.prototype.url=document.location.href]
                 */
                url: document.location.href,

                /**
                 * The page type.
                 *
                 * Should be one of:
                 *
                 * - `home` - The homepage.
                 * - `cart` - The shopping cart.
                 * - `prod` - A product page.
                 * - `cat` - A category page.
                 * - `srch` - A search page.
                 * - `page` - Any other page.
                 *
                 * @var {String} [state.page.prototype.type="page"]
                 */
                type: "page",

                /**
                 * Custom page-specific data to track. This will be passed to the segmentation engine.
                 * @var {Object} [state.page.prototype.data={}]
                 */
                data: {},

                brands: [],

                /**
                 * If set to `true` the server will repeat the custom data from the
                 * previous page view.
                 *
                 * Any custom data properties defined on the current page will overwrite
                 * previous values (even if the current page value is empty or undefined).
                 *
                 * @var {Boolean} state.page#repeatCustomData
                 * @default false
                 */
                repeatCustomData: false
            };
        };

        Page.prototype = {
            serialize: function() {
                var that = this;
                var obj = serialize(that, Page.getDefaults());
                obj.product = that.product && that.product.serialize();
                obj.categories = that.categories && that.categories.serialize();
                return obj;
            }
        };

        /**
         * Represents cart-level details.
         *
         * @namespace state.cart
         */
        function Cart(obj) {
            var self = this;
            deserialize(self, obj || {}, Cart.defaults);

            /**
             * Products added to the cart.
             *
             * @var {state.ProductList} state.cart#products
             */
            self.products = ProductList.wrap([]);
        }

        Cart.defaults = {
            /**
             * The total dollar amount of the cart, in the cart currency, excluding any shipping, tax or discount.
             *
             * @var {Number} state.cart#gross
             * @default `0`
             */
            gross: 0,

            /**
             * The total discount amount applied to the cart. Must be a positive number.
             *
             * @var {Number} state.cart#discount
             * @default `0`
             */
            discount: 0,

            /**
             * The discount code applied to the cart. Multiple codes should be separated by commas.
             *
             * @var {String} state.cart#discountCode
             * @default `null`.
             */
            discountCode: null,

            /**
             * The shipping dollar amount.
             *
             * @var {Number} state.cart#shipping
             * @default `0`
             */
            shipping: 0,

            /**
             * The tax dollar amount.
             *
             * @var {Number} state.cart#tax
             * @default `0`
             */
            tax: 0,

            /**
             * The currency of the cart as the three letter [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) code.
             *
             * @var {String} state.cart#currency
             * @default `null`
             *
             * @example
             * state.cart.currency = "USD";
             */
            currency: null,

            /**
             * The number of unique products in the cart. This can be calculated automatically using {@link state.cart#updateTotals}
             * providing cart product and quantity information is complete.
             *
             * @var {Number} state.cart#lineItemCount
             * @default `0`
             */
            lineItemCount: 0,

            /**
             * The total combined quantity of all products in the cart.
             *
             * @var {Number} state.cart#totalQuantity
             * @default `0`
             */
            totalQuantity: 0,

            repeat: false,

            /**
             * The action the server should take when tracking cart data.
             *
             * Can be one of:
             *
             * <table>
             *   <thead>
             *     <tr>
             *       <th>Action</th><th>Description</th>
             *     </tr>
             *   </thead>
             *   <tbody>
             *     <tr>
             *       <td>`null`</td>
             *       <td>
             *         **Default behavior**. The server will use only the current cart details for the current page to be tracked.
             *       </td>
             *     </tr>
             *     <tr>
             *       <td>`"repeat"`</td>
             *       <td>
             *         For the current page to be tracked, the server will ignore all current cart details and use the last cart details tracked.
             *       </td>
             *     </tr>
             *     <tr>
             *       <td>`"add"`</td>
             *       <td>
             *         <p>For the current page to be tracked, the server will:</p>
             *         <ol>
             *           <li>Start with the last tracked cart details.</li>
             *           <li>Ignore all current cart details, except for {@link state.cart#products}.</li>
             *           <li>Add the current cart products to the last tracked products. Any products with the same {@link state.Product#id} will have their
             *             quantities added together.</li>
             *           <li>Recalculate the totals of the cart based on the merged details.</li>
             *         </ol>
             *       </td>
             *     </tr>
             *     <tr>
             *       <td>`"subtract"`</td>
             *       <td>
             *         <p>For the current page to be tracked, the server will:</p>
             *         <ol>
             *           <li>Start with the last tracked cart details.</li>
             *           <li>Ignore all current cart details, except for {@link state.cart#products}.</li>
             *           <li>Subtract the current cart products from the last tracked products. Any products with the same {@link state.Product#id} will have their
             *             quantities subtracted from each other and any products with resulting quantites that zero or below will be removed.</li>
             *           <li>Recalculate the totals of the cart based on the merged details.</li>
             *         </ol>
             *       </td>
             *     </tr>
             *     <tr>
             *       <td>`"set"`</td>
             *       <td>
             *         <p>For the current page to be tracked, the server will:</p>
             *         <ol>
             *           <li>Start with the last tracked cart details.</li>
             *           <li>Ignore all current cart details, except for {@link state.cart#products}.</li>
             *           <li>For each previously tracked product, replace all details of any product with a matching {@link state.Product#id} of current products
             *            being tracked. Products that do not already exist will be added.</li>
             *           <li>Recalculate the totals of the cart based on the merged details.</li>
             *         </ol>
             *       </td>
             *     </tr>
             *   </tbody>
             * </table>
             *
             * @var {String} state.cart#cartAction
             * @default `null`
             */
            cartAction: null,

            /**
             * The unique identifier (comma-separated if there is more than one) that the ecommerce
             * software uses to internally identify the cart with the user's session.
             *
             * Fanplayr could use this later in association with an order ID to link a captured order to
             * a tracked session.
             *
             * @var {String} state.cart#quoteId
             * @default `null`
             */
            quoteId: null,

            /**
             * Any other attributes that need to be tracked with the cart.
             *
             * @var {Object} state.cart#data
             * @default `{}`
             */
            data: {}
        };

        Cart.prototype = {
            serialize: function() {
                var self = this;
                var obj = serialize(self, Cart.defaults);
                obj.products = self.products && self.products.serialize() || [];
                return obj;
            },

            /**
             * Resets all the details of the cart to their default values.
             *
             * @function state.cart#clear
             */
            clear: function() {
                var self = this;
                deserialize(self, {}, Cart.defaults);
                self.products.clear();
            },

            /**
             * Updates {@link state.cart#gross gross}, {@link state.cart#totalQuantity totalQuantity} and {@link state.cart#lineItemCount lineItemCount}
             * based on price and quantity of products in the cart.
             *
             * @function state.cart#updateTotals
             */
            updateTotals: function() {
                var self = this;
                // @ts-ignore
                self.totalQuantity = 0;
                // @ts-ignore
                self.gross = 0;
                _.each(self.products, function(product) {
                    var quantity = (typeof product.quantity === "number") ? product.quantity : 1;
                    // @ts-ignore
                    self.totalQuantity += quantity;
                    // @ts-ignore
                    self.gross += (product.price || 0) * quantity;
                });
                // @ts-ignore
                self.lineItemCount = self.products.length;
            }
        };

        /**
         * Used to represent and track the customers current order details.
         *
         * @namespace state.order
         */
        function Order(obj) {
            var self = this;
            deserialize(self, obj || {}, Order.defaults);

            /**
             * Products added to the order.
             *
             * @var {state.ProductList} state.order#products
             */
            self.products = ProductList.wrap([]);
        }

        Order.defaults = {
            /**
             * The identifier used to internallly track the order in ecommerce store.
             *
             * @var {String} state.order#id
             * @default `null`
             */
            id: null,

            /**
             * The order number displayed to the customer. This may be different from the {@link state.order#id}.
             *
             * @var {String} state.order#number
             * @default `null`
             */
            number: null,

            /**
             * The date the order was placed. The server expects this to be a string formatted as [(ISO 8601)](http://en.wikipedia.org/wiki/ISO_8601),
             * but the tracking module will attempt to do the conversion before sending using {@link utils.dateISOString}.
             *
             * @var {String|Date|Number} state.order#date
             * @default `null`
             */
            date: null,

            /**
             * The total dollar amount of the order, in the order currency, excluding any shipping, tax or discount.
             *
             * @var {Number} state.order#gross
             * @default `0`
             */
            gross: 0,

            /**
             * The discount amount of the order.
             *
             * @var {Number} state.order#discount
             * @default `0`
             */
            discount: 0,

            /**
             * The discount code applied to the order. Multiple codes should be separated by commas.
             *
             * @var {String} state.order#discountCode
             * @default `null`.
             */
            discountCode: null,

            /**
             * The shipping dollar amount.
             *
             * @var {Number} state.order#shipping
             * @default `0`
             */
            shipping: 0,

            /**
             * The tax dollar amount.
             *
             * @var {Number} state.order#tax
             * @default `0`
             */
            tax: 0,

            /**
             * The currency of the order as the three letter [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) code.
             *
             * @var {String} state.order#currency
             * @default `null`
             *
             * @example
             * state.order.currency = "USD";
             */
            currency: null,

            /**
             * The email address the user associated with the order. This will be used on the server as `orderEmail`.
             * The server will use {@link state.user#email} for `customerEmail`.
             *
             * @var {Number} state.order#email
             * @default `null`
             */
            email: null,

            /**
             * Internal Fanplayr notes to track with the order. If `note` is an array of strings, it will be
             * joined using `;` as a separator before tracking.
             *
             * @var {String|Array<String>} state.order#note
             * @default `""`
             */
            note: "",

            /**
             * The action the server should take when tracking products in the order. See {@link state.cart#cartAction} for explaination.
             *
             * @var {String} state.order#cartAction
             * @default `null`
             * @see state.cart#cartAction
             */
            cartAction: null,

            /**
             * The unique identifier (comma-separated if there is more than one) that the ecommerce
             * software uses to internally identify the cart with the user's session.
             *
             * Fanplayr could use this later in association with an order ID to link a captured order to
             * a tracked session.
             *
             * @var {String} state.order#quoteId
             * @default `null`
             */
            quoteId: null,

            /**
             * Any other attributes that need to be tracked with the order.
             *
             * @var {Object} state.order#data
             * @default `{}`
             */
            data: {},

            /**
             * If set to `true` the server will repeat the custom data from the
             * previous page view.
             *
             * Any custom data properties defined on the order will overwrite previous
             * values (even if the custom value on the order is empty or undefined).
             *
             * @var {Boolean} state.order#repeatCustomData
             * @default false
             */
            repeatCustomData: false
        };

        Order.prototype = {
            serialize: function() {
                var self = this;
                var obj = serialize(self, Order.defaults);
                obj.products = self.products && self.products.serialize() || [];
                return obj;
            },

            clear: function() {
                var self = this;
                deserialize(self, {}, Order.defaults);
                self.products.clear();
            }
        };

        var state = new State();

        // @ts-ignore
        platform.state = state;

        // @ts-ignore
        state.processDataApiRequests = function() {
            // Merges all calls to "page.data" with the page data
            // in the order they were called.
            if (!state.page.data) {
                state.page.data = {};
            }
            _.each(dataApi.getByType("page.data"), function(data) {
                _.mergeDeep(state.page.data, data);
            });
        };

        // @ts-ignore
        state.processDataApiRequests();

        // @ts-ignore
        state.models = {
            User: User,
            Page: Page,
            Cart: Cart,
            Order: Order,
            Product: Product,
            ProductList: ProductList,
            CategoryList: CategoryList
        };

        return state;
    });

    define('platform/config', ['require', 'platform/utils', 'platform/dataApi', 'platform/log'], function(require) {
        var _ = require('platform/utils');
        var dataApi = require('platform/dataApi');
        var log = require('platform/log').create('platform:config');

        var config = {
            apiEndpoint: "api.fanplayr.com",
            sessionEndpoint: "my.fanplayr.com",
            storeDomain: location.hostname,
            shopType: "custom",
            // Must be HTTPS because LocalStorage is not accessible across protocols.
            xdsTunnel: "https://e1.fanplayr.com/tunnel.html?v8",
            /** @type {boolean | undefined} */
            userConsentMode: undefined,
            /** @type {boolean | undefined} */
            userConsentStatus: undefined
        };

        _.merge(config, {
            "version": "1.191.0",
            "environment": "production",
            "orderScript": "//d1q7pknmpq2wkm.cloudfront.net/js/my.fanplayr.com/fp_custom_orders.js"
        });

        if (config.environment === "development") {
            _.merge(config, {
                sessionEndpoint: "localhost"
            });
        }

        if (config.environment === "staging") {
            _.merge(config, {
                apiEndpoint: "api.fanplayr.com",
                sessionEndpoint: "my-stage.fanplayr.com",
                xdsTunnel: "https://e1.fanplayr.com/tunnel.html?v8"
            });
        }

        // Merges all calls to "platform.config" with the config
        // in the order they were called.
        var configsToMerge = dataApi.getByType("platform.config");
        _.each(configsToMerge, function(data) {
            log('Merge into config', data);
            _.mergeDeep(config, data);
        });

        initUserConsentProperties();

        /**
         * The user consent property values are needed before the Platform JS has been
         * initialized and therefore before any of the normal "embeded data"
         * initalization flows occur.
         *
         * Definition order:
         * - Possibly already merged in from `dataApi` logic above
         * - Fallback to `fanplayr` page embed data
         * - Fallback to `fp_sales_orders` order array (first entry)
         * - Fallback to `fp_sales_orders` single order
         */
        function initUserConsentProperties() {
            var result;
            if (config.userConsentMode === undefined) {
                result = getUserConsentProperty('userConsentMode');
                if (result) {
                    config.userConsentMode = result.value;
                    log('Set userConsentMode to %o from source %s', result.value, result.source);
                }
            }
            if (config.userConsentStatus === undefined) {
                result = getUserConsentProperty('userConsentStatus');
                if (result) {
                    config.userConsentStatus = result.value;
                    log('Set userConsentStatus to %o from source %s', result.value, result.source);
                }
            }
        }

        /**
         * Reads a user consent property from a variety of fallback areas.
         * @param {'userConsentMode' | 'userConsentStatus'} property
         * @returns {{value: boolean, source: string} | undefined}
         */
        function getUserConsentProperty(property) {
            // From page embed data
            var value = _.get(window, 'fanplayr._i[0].' + property);
            if (typeof value === 'boolean') {
                return {
                    value: value,
                    source: 'page_embed'
                };
            }
            // Array of orders
            value = _.get(window, 'fp_sales_orders[0].' + property);
            if (typeof value === 'boolean') {
                return {
                    value: value,
                    source: 'order_embed'
                };
            }
            // Single order
            value = _.get(window, 'fp_sales_orders.' + property);
            if (typeof value === 'boolean') {
                return {
                    value: value,
                    source: 'order_embed'
                };
            }
        }

        /**
         * The platform configuration.
         *
         * @namespace config
         */

        /**
         * The platform version number.
         *
         * @var {String} config#version
         */

        /**
         * If provided, the platform will use this value to namespace any
         * external data it stores. For example, this will used to namespace
         * the platform stash instead of scoping it to {@link config#storeDomain}.
         *
         * @var {String} config#namespace
         * @default `null`
         */

        /**
         * The account key of the integrated site.
         *
         * @var {String} config#accountKey
         */

        /**
         * The campaign key of the integrated site.
         *
         * @var {String} config#campaignKey
         */

        /**
         * The environment of the platform. Either `"development"`, `"staging"` or `"production"`.
         *
         * @var {String} config#environment
         */

        /**
         * The hostname of the server which tracking calls are made to. For example, `"e1.fanplayr.com"`.
         *
         * This value is determined based on the current environment and from tracking calls.
         *
         * @var {String} config#sessionEndpoint
         */

        /**
         * The current session key.
         *
         * @var {String} config#sessionKey
         */

        /**
         * A unique key identifying the current user.
         *
         * @var {String} config#userKey
         */

        /**
         * The hostname of the current integration. This can be overridden for tracking calls.
         *
         * @var {String} config#storeDomain
         * @default `document.location.hostname`.
         */

        /**
         * An internal type used to identify a particular shopping cart platform.
         * Custom one-off integrations should use "custom".
         *
         * @var {String} config#shopType
         * @default `custom`.
         */

        /**
         * The url to the cross-domain storage file.
         *
         * @var {String} config#xdsTunnel
         */

        return config;
    });

    define('platform/legacy', ['require', 'fanplayr', 'platform/utils', 'platform/json', 'platform/config', 'platform/state', 'platform/log', 'platform/parser'], function(require) {
        var fanplayr = require('fanplayr');
        var _ = require('platform/utils');
        var JSON = require('platform/json');
        var Config = require('platform/config');
        var state = require('platform/state');
        var log = require('platform/log').create('platform:legacy');
        var parser = require('platform/parser');

        var legacy = {};
        var lastEmbedData;

        function normalize(data) {
            var applyToCartUrl = data.applyToCartUrl || data.atc;
            if (applyToCartUrl) {
                data.applyToCartUrl = _.decodeUrl(applyToCartUrl);
            }
            var deputizeUrl = data.deputizeUrl || data.depitizeUrl;
            if (deputizeUrl) {
                data.deputizeUrl = _.decodeUrl(deputizeUrl);
            }
            if (data.depitizeUrl) {
                delete data.depitizeUrl;
            }
            if (data.sessionOfferUrl) {
                data.sessionOfferUrl = _.decodeUrl(data.sessionOfferUrl);
            }
            return data;
        }

        function trim(value) {
            // Trim string values and leave others as-is
            return typeof value === 'string' ? value.replace(/^\s+|\s+$/gm, '') : value;
        }

        legacy.getEmbedData = function(data) {
            if (!_.isPlainObject(data)) {
                data = fanplayr._i && fanplayr._i.length && fanplayr._i[0] || lastEmbedData;
            }

            if (_.isPlainObject(data) && (data.type === "st" || typeof data.type === "undefined")) {
                data = normalize(data);
            }
            lastEmbedData = data;
            return data;
        };

        legacy.fillState = function(embedData) {
            embedData = legacy.getEmbedData(embedData);
            if (embedData) {
                var data = embedData.data;

                Config.accountKey = embedData.accountKey || embedData.ak;
                Config.shopType = data.shopType || "custom";

                if (embedData.storeDomain) {
                    Config.storeDomain = embedData.storeDomain;
                }
                if (embedData.language) {
                    Config.language = embedData.language;
                }
                if (typeof embedData.allowNegativeCurrencyAmounts === 'boolean') {
                    Config.allowNegativeCurrencyAmounts = embedData.allowNegativeCurrencyAmounts;
                } else {
                    // Backwards compatability for Mitsubishi client from 2019-08-02.
                    if (Config.accountKey === '3121bdee1f96ad499afa8bc90506aaea') {
                        Config.allowNegativeCurrencyAmounts = true;
                    }
                }

                var user = state.user;
                var page = state.page;
                var cart = state.cart;

                if (typeof embedData.custom_data === "object") {
                    page.data = embedData.custom_data;
                }

                if (typeof data === "object") {
                    page.type = legacy.parsePageType(data.pageType);
                    page.searchQuery = trim(data.searchQuery);

                    if (_.isArray(data.brands)) {
                        page.brands = data.brands;
                    }

                    fillCategories(
                        page.categories,
                        data.categoryId,
                        data.categoryName,
                        data.categories
                    );

                    var product = page.product;
                    product.id = data.productId;
                    product.sku = data.productSku;
                    product.name = data.productName;
                    product.price = data.productPrice;
                    product.image = _.getAbsoluteUrl(data.productImage);
                    product.url = _.getAbsoluteUrl(data.productUrl);

                    if (data.customerEmail) {
                        user.email = data.customerEmail;
                    }

                    user.id = data.customerId || null;
                    user.email = data.customerEmail || null;
                    user.group = data.customerGroup || null;
                    user.segment = data.customerSegment || null;

                    cart.gross = absCurrency(data.gross || data.subTotal);

                    if (!_.isUndefined(data.discount)) {
                        cart.discount = absCurrency(data.discount || 0);
                    } else {
                        // Backwards compatibility.
                        cart.discount = cart.gross - absCurrency(data.total || 0);
                    }

                    cart.discountCode = data.discountCode || data.couponCode || null;

                    cart.currency = data.currency || null;

                    cart.repeat = !!data.repeatCart;
                    cart.cartAction = data.cartAction || "";

                    cart.quoteId = data.quoteId || null;

                    var products = [];
                    try {
                        var dataProducts = data.products;
                        if (_.isArray(dataProducts)) {
                            products = dataProducts;
                        } else if (typeof dataProducts === "string") {
                            products = JSON.parse(dataProducts);
                        }
                    } catch (ex) {
                        products = [];
                    }

                    var cartProducts = cart.products;
                    _.each(products, function(p) {
                        if (cartProducts.find(p.id)) {
                            log("duplicate product in embed data, skipped add to cart");
                        } else {
                            var item = cartProducts.add({
                                id: p.id,
                                sku: p.sku,
                                name: p.name,
                                price: p.price,
                                quantity: typeof p.quantity === 'number' ? p.quantity : p.qty,
                                image: _.getAbsoluteUrl(p.image),
                                url: _.getAbsoluteUrl(p.url),
                                data: p.data
                            });

                            fillCategories(
                                item.categories,
                                p.catId || p.categoryId,
                                p.catName || p.categoryName,
                                p.categories
                            );
                        }
                    });

                    cart.totalQuantity = data.numItems || 0;
                    cart.lineItemCount = data.lineItemCount || 0;
                }

                state.processDataApiRequests();
            }
            return embedData;
        };

        legacy.fillStateFromOrder = function(embedData) {
            if (!embedData || typeof embedData !== "object" || typeof embedData.data !== "object") {
                return;
            }

            if (embedData.accountKey) {
                Config.accountKey = embedData.accountKey;
            }
            if (embedData.storeDomain) {
                Config.storeDomain = embedData.storeDomain;
            }
            if (typeof embedData.allowNegativeCurrencyAmounts === 'boolean') {
                Config.allowNegativeCurrencyAmounts = embedData.allowNegativeCurrencyAmounts;
            } else {
                // Backwards compatability for Mitsubishi client from 2019-08-02.
                if (Config.accountKey === '3121bdee1f96ad499afa8bc90506aaea') {
                    Config.allowNegativeCurrencyAmounts = true;
                }
            }

            var data = embedData.data;

            var order = state.order;
            order.id = data.orderId || null;
            order.number = data.orderNumber || null;

            // Always let the server use the current time.
            order.date = null;

            // 2020-02-24 Support custom data.
            order.data = embedData.custom_data || {};

            /**
             * According to version 2 of the spec:
             *   - `orderTotal` is ?
             *   - `discountAmount` is discount
             *
             * According to version 3 of the spec:
             *   - `subTotal` is gross
             *   - `total` is net
             *   - `discount` is discount
             */
            var version = parser.parseNumber(embedData.version || data.version, 2);
            if (version >= 3) {
                // The legacy custom order code took into account integrations that
                // mixed up `total` and `subTotal`. Assume the larger of the two
                // is the gross.
                var dataTotal = absCurrency(parser.parseCurrency(data.total, 0));
                var dataSubTotal = absCurrency(parser.parseCurrency(data.gross || data.subTotal, 0));
                if (Config.allowNegativeCurrencyAmounts) {
                    // When negative currency values are allowed the `Math.max(..)` line
                    // below will fail for negative values so we need this alternative.
                    if ('gross' in data || 'subTotal' in data) {
                        // Assume if user has specified one of these values then that's what
                        // they actually intend to use without relying on `Math.max(..)`.
                        order.gross = dataSubTotal;
                    } else {
                        order.gross = dataTotal;
                    }
                } else {
                    order.gross = Math.max(dataTotal, dataSubTotal);
                }
                order.discount = absCurrency(parser.parseCurrency(data.discount, 0));
            } else {
                order.gross = absCurrency(parser.parseCurrency(data.orderTotal, 0));
                order.discount = absCurrency(parser.parseCurrency(data.discountAmount, 0));
            }

            order.discountCode = data.discountCode || null;

            order.shipping = absCurrency(parser.parseCurrency(data.shipping, 0));
            order.tax = absCurrency(parser.parseCurrency(data.tax, 0));

            order.currency = data.currency || null;

            order.cartAction = data.cartAction || null;

            order.email = data.orderEmail || null;

            var user = state.user;
            user.id = data.customerId || user.id;
            user.email = data.customerEmail || user.email;
            user.firstName = data.firstName || user.firstName;
            user.lastName = data.lastName || user.lastName;

            var products = [];
            try {
                var dataProducts = data.products;
                if (_.isArray(dataProducts)) {
                    products = dataProducts;
                } else if (typeof dataProducts === "string") {
                    products = JSON.parse(dataProducts);
                }
            } catch (e) {}

            _.each(products, function(p) {
                var item = order.products.add({
                    id: p.id,
                    sku: p.sku,
                    name: p.name,
                    price: p.price,
                    quantity: p.qty,
                    image: _.getAbsoluteUrl(p.image),
                    url: _.getAbsoluteUrl(p.url),
                    data: p.data
                });
                fillCategories(
                    item.categories,
                    p.catId || p.categoryId,
                    p.catName || p.categoryName,
                    p.categories
                );
            });
        };

        legacy.parsePageType = function(value) {
            return trim(value) || "page";
        };

        function parseSplitCategoryData(idStr, nameStr) {
            var ids = String(idStr || "").split(",");
            var names = String(nameStr || "").split(",");
            var count = Math.max(ids.length, names.length);
            var cats = [];
            for (var i = 0; i < count; i++) {
                var cat = {
                    id: _.trim(ids[i]),
                    name: _.trim(names[i])
                };
                if (cat.id || cat.name) {
                    cats.push(cat);
                }
            }
            return cats;
        }

        /**
         *
         * @param {Platform.State.CategoryList} categoryList
         * @param {string} [idStr]
         * @param {string} [nameStr]
         * @param {string[]} [categoryArray]
         */
        function fillCategories(categoryList, idStr, nameStr, categoryArray) {
            if (_.isArray(categoryArray)) {
                _.each(categoryArray, function(value) {
                    categoryList.add(value);
                });
            } else if (idStr || nameStr) {
                var cats = parseSplitCategoryData(idStr, nameStr);
                _.each(cats, function(cat) {
                    categoryList.add(cat.id, cat.name);
                });
            }
        }

        function absCurrency(value) {
            if (Config.allowNegativeCurrencyAmounts) {
                return value;
            }
            return Math.abs(value);
        }

        return legacy;
    });

    define('platform/afn', ['require', 'platform', 'platform/config', 'platform/jquery', 'platform/utils', 'platform/json'], function(require) {
        var platform = require('platform');
        var Config = require('platform/config');
        var $ = require('platform/jquery');
        var _ = require('platform/utils');
        var JSON = require('platform/json');

        /**
         * Affiliate network tracking.
         *
         * See [AFN Tracking documentation](https://docs.google.com/a/fanplayr.com/document/d/1d3-PAGyEoz2Y8m6jPOFcGAOIiWpy392ZULlWq4sw1k4/edit)
         * for more information.
         *
         * @namespace afn
         */

        var didUpdate;

        // Maps stringified option objects to booleans to mark them
        // as being tracked.
        var tracked = {};

        function updateStatus() {
            if (!didUpdate) {
                didUpdate = 1;

                // Wait a second to make sure tracking had a chance to execute.
                // User could have refreshed page.
                setTimeout(function() {
                    $.ajax({
                        url: "//" + Config.sessionEndpoint + "/external.Genius/",
                        dataType: "jsonp",
                        data: {
                            a: "afn-tracking-status",
                            sk: Config.sessionKey,
                            status: "complete"
                        }
                    });
                }, 1000);
            }
        }

        /**
         * Make an affiliate network tracking call.
         *
         * #### Tracker Protocol Support
         * - Some trackers do not support HTTPS in which case the url should begin with `"http://"` to signify that
         * tracking should only be attempted from non-secure pages. (Otherwise the browser would complain that
         * insecure content is being loaded from a secure page).
         *
         * - Trackers that support both HTTP and HTTPS should use a protocol agnostic url beginning with `"//"`.
         *
         * - Trackers that only support HTTPS should use a url beginning with `"https://"`.
         *
         *
         * #### Combining `iframe` & `script` options
         *
         * If both the `iframe` and `script` options are `true`, a blank iframe will be created and
         * a script tag will be injected into it (with `document.write`).
         *
         * @param {Platform.Afn.TrackConfig} options 
         */
        function track(options) {
            var hash = JSON.stringify(options);
            var didTrack = tracked[hash];
            if (didTrack || typeof options !== "object" || !options.url || !(options.iframe || options.script || options.image)) {
                // Nothing to do.
                return;
            }

            if (document.location.protocol === "https:" && /^http:/i.test(options.url)) {
                // AFN url is not compatible with secure protocol.
                return;
            }

            tracked[hash] = true;

            var doc = document;

            function trackEvent() {
                var mode;
                if (options.iframe && options.script) {
                    if (options.script) {
                        mode = 'iframe+script';
                    } else {
                        mode = 'iframe';
                    }
                } else if (options.script) {
                    mode = 'script';
                } else if (options.image) {
                    mode = 'image';
                }
                platform.trackEvent({
                    type: 'widget',
                    subType: 'afn',
                    data: {
                        url: options.url,
                        mode: mode
                    }
                });
            }

            function markCompleted() {
                if (!options.alwaysTrack) {
                    updateStatus();
                }
                trackEvent();
            }

            // Replace special placeholders.
            options.url = options.url
                .replace(/SESSION_KEY/g, Config.sessionKey || '')
                .replace(/CURRENT_TIMESTAMP/g, String(new Date().getTime()));

            if (options.iframe) {
                var iframe = doc.createElement("iframe");
                iframe.style.position = "absolute";
                iframe.style.top = iframe.style.left = "0px";
                iframe.style.width = iframe.style.height = "1px";
                iframe.style.visibility = "hidden";
                doc.body.appendChild(iframe);

                if (options.script) {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document;
                    if (iframeDoc) {
                        iframeDoc.write('<script language="javascript" type="text/javascript" src="' + options.url + '"><\/sc' + 'ript>');
                    }
                } else {
                    iframe.src = options.url;
                }
                markCompleted();
            } else if (options.script) {
                var script = doc.createElement("script");
                // HACK: Ensure Cloudflare Rocket Loader never caches this.
                script.setAttribute("data-cfasync", "false");
                script.src = options.url;
                doc.body.appendChild(script);
                markCompleted();
            } else if (options.image) {
                var img = doc.createElement("img");
                img.src = options.url;
                img.width = 1;
                img.height = 1;
                img.style.position = "absolute";
                img.style.visibility = "hidden";
                doc.body.appendChild(img);
                markCompleted();
            }
        }

        /**
         * Performs one or more affiliate network tracking calls.
         *
         * @function afn#processOptions
         * @param  {Object|Array<Object>} trackers - A single or array of option objects to pass to {@link afn#track}.
         */
        function processOptions(trackers) {
            if (!_.isArray(trackers)) {
                trackers = [trackers];
            }
            _.each(trackers, function(options) {
                track(options);
            });
        }

        return {
            track: processOptions
        };
    });

    define('platform/capabilities', ['require', 'platform/config', 'platform/state', 'platform/legacy', 'platform/utils'], function(require) {
        var Config = require('platform/config');
        var state = require('platform/state');
        var legacy = require('platform/legacy');
        var _ = require('platform/utils');

        var capabilities = {};

        /**
         * This module allows adaptors and other services to augment the platform
         * with various capabilities.
         *
         * @namespace capabilities
         */

        /**
         * Defining this url is one way of enabling the Apply to Cart capability of offer widgets.
         *
         * The platform will redirect the browser to this url when the user attempts to apply an offer to the cart.
         * Any `%c` parameter in the url will be substituted with the discount code being applied.
         *
         * @memberof capabilities#
         * @var {String} applyToCartUrl
         *
         * @example
         * capabilities.applyToCartUrl = "//store.com/apply-offer?code=%c";
         * // When the user attempts to apply the code "FP10" to the cart, the browser will navigate to
         * // //store.com/apply-offer?code=FP10
         */

        /**
         * Defining this callback is one way of enabling the Apply to Cart capability of offer widgets.
         *
         * The platform will invoke this callback with an event object that provides information about
         * the offer to be applied to the cart. It is then the responsibility of the callback to actually
         * apply the offer.
         *
         * <div class="banner banner-warning">The platform will always ignore `applyToCartUrl` when this callback is defined.</div>
         *
         * @memberof capabilities#
         * @function applyToCart
         * @param {ApplyToCartEvent} event - An object describing the offer to be applied to the cart.
         *
         * @example
         * // An example of using jQuery to dynamically apply an offer code to
         * // a discount code field and submit it on the current page.
         * capabilities.applyToCart = function ( event ) {
         *   var $codeInput = $("#discount_code");
         *   var $submitButton = $("#discount_code_submit");
         *   if ( $codeInput.length && $submitButton.length ) {
         *     $codeInput.val(event.code);
         *     $submitButton.click();
         *   }
         * };
         */

        /**
         * Defining this callback is one way of enabling the Deputization (Offer Security) capability of offer widgets.
         *
         * The platform will invoke this callback with an event object that provides information about the
         * offer to be deputized. It is then the responsibility of the callback to complete this process.
         *
         * Fanplayr will keep attempting to deputize an offer on each page view until
         * it successfully links the temporary code to the real code.
         *
         * Fanplayr assumes the operation was successful unless the callback returns `false`,
         * or `false` is passed to the "done" function returned by `event.async()`.
         *
         * @memberOf  capabilities#
         * @function deputizeOffer
         * @param {DeputizeOfferEvent} event - An object describing the offer to be deputized.
         *
         * @example
         * capabilities.deputizeOffer = function ( event ) {
         *   // Do something with `event.code` and `event.tempCode`.
         *
         *   return; // succeeded (or event no return)
         *   return false; // failed
         *
         *   var done = event.async();
         *   setTimeout(function () {
         *     done(false); // failed
         *     done(); // succeeded
         *   }, 1000);
         * };
         */

        /**
         * Defining this url is one way of enabling the Deputization (Offer Security) capability of offer widgets.
         *
         * The platform will open a hidden iframe pointing to this url whenever an offer needs to be
         * deputized. The parameters `%a` and `%d` will be substituted with the actual discount code and temporary
         * (deputy) code respectively.
         *
         * - Each substitued parameter is url-encoded.
         * - The url is invoked using a hidden iframe.
         * - The iframe will be removed once its load event fires unless the url begins with a bang/exclaimation (`"!"`).
         *   The bang will be removed from the url before being set on the iframe.
         *
         * @memberof capabilities#
         * @var {String} deputizeUrl
         *
         * @example
         * capabilities.deputizeUrl = "//store.com/deputize?actualCode=%a&tempCode=%d";
         */

        /**
         * Defining this callback is one way of enabling the Session Offers (Offer Security) capability of offer widgets.
         * [See further documentation here](https://fanplayr.gitbooks.io/integration-custom/content/offer-security/session-offers.html).
         *
         * The platform will invoke this callback with an event object that provides information about the
         * offer to be enabled. It is then the responsibility of the callback to complete this process.
         *
         * Fanplayr will keep attempting to save the enalbement of the offer on each page view until
         * it succeeds.
         *
         * Fanplayr assumes the operation was successful unless the callback returns `false`,
         * or `false` is passed to the "done" function returned by `event.async()`.
         *
         * <div class="banner banner-warning">The platform will always ignore `sessionOfferUrl` when this callback is defined.</div>
         *
         * @memberOf  capabilities#
         * @function sessionOffer
         * @param {SessionOfferEvent} event - An object describing the offer to be enabled.
         *
         * @example
         * // Synchronous
         * capabilities.sessionOffer = function ( event ) {
         *   // Do something with 'event.code'
         *   // return 'false' if failed.
         * };
         *
         * // Asynchronous
         * capabilities.sessionOffer = function ( event ) {
         *   var done = event.async();
         *   // Do something with 'event.code'.
         *   // Invoke 'done' when complete, passing 'false' if failed.
         * };
         */

        /**
         * Defining this url is one way of enabling the Session Offers (Offer Security) capability of offer widgets.
         * [See further documentation here](https://fanplayr.gitbooks.io/integration-custom/content/offer-security/session-offers.html).
         *
         * The platform will open a hidden iframe pointing to this url whenever an offer
         * needs to be enabled. The parameter `%c` will be substituted with the discount code.
         *
         * - Each substitued parameter is url-encoded.
         * - The url is invoked using a hidden iframe.
         * - The iframe will be removed once its load event fires.
         *
         * @memberof capabilities#
         * @var {String} sessionOfferUrl
         *
         * @example
         * capabilities.sessionOfferUrl = "//store.com/sessionOffer?code=%c";
         */

        /**
         * Offer Flyout widgets can be configured to prompt users to apply any collected
         * offers to the cart by forcing open the wallet when no offer has been applied.
         * By default, this feature is only triggered on the cart page.
         *
         * This option used to enabled or disable this feature for the current page
         * (regardless of page type). If a function is provided, the return value is used.
         *
         * **Possible Values**
         *
         * - `true` - Allows offer prompts on current page, including non-cart pages.
         * - `false` - Disables offer prompts on current page.
         *
         * Regardless of the value, the offer prompt feature will only be used if there
         * is no offer currently applied to the cart.
         *
         * @memberof capabilities#
         * @var {Boolean|Function} allowOfferPrompt
         *
         * @example
         * // Allow offer prompt on current page when no discount is applied.
         * capabilities.allowOfferPrompt = true;
         *
         * // Allow on URLs that match "cart" or "checkout" when no discount is applied.
         * capabilities.allowOfferPrompt = function () {
         *   return /(cart|checkout)/.test(document.location.href);
         * };
         */

        capabilities.getConnectInfo = function() {
            if (Config.connect) {
                return Config.connect;
            }
            var order = window.fp_sales_orders;
            if (order && !_.isArray(order) && order.connect) {
                return order.connect;
            }
            var data = legacy.getEmbedData();
            if (data && data.connect) {
                return data.connect;
            }
        };

        capabilities.getPrivacyId = function() {
            if (Config.privacyId) {
                return Config.privacyId;
            }
            var order = window.fp_sales_orders;
            if (order && !_.isArray(order) && order.privacyId) {
                return order.privacyId;
            }
            var data = legacy.getEmbedData();
            if (data && data.privacyId) {
                return data.privacyId;
            }
        };

        /**
         * Determines `allowOfferPrompt` value by through capabilities or embed data.
         *
         * @memberof capabilities#
         * @function getAllowOfferPrompt
         * @return {Boolean}
         */
        capabilities.getAllowOfferPrompt = function() {
            // Check capability first.
            var value = capabilities.allowOfferPrompt;
            // Fallback to embed data.
            if (typeof value === 'undefined') {
                var embedData = legacy.getEmbedData();
                if (embedData) {
                    value = embedData.allowOfferPrompt;
                }
            }
            // Support return value from a function.
            if (typeof value === 'function') {
                value = value();
            }
            // Use the value if one was provided,
            if (typeof value !== 'undefined') {
                return value;
            }
            // otherwise use default behavior, which is only on cart pages.
            // (Widget code will also ensure that no discount is applied).
            return state.page.type === 'cart';
        };

        /**
         * This object describes an offer to be applied to the cart.
         *
         * @typedef {Object} ApplyToCartEvent
         *
         * @property {String} type - The event type, "offer:apply".
         * @property {String} code - The actual discount code to be applied.
         * @property {String} tempCode - The temporary, deputized code, if it is a session-only offer.
         * @property {String} applyToCartUrl - The url the platform will navigate the browser to in order to apply the offer.
         *   This url can be populated from legacy embed code or {@link capabilities.applyToCartUrl}. This may be `undefined` if the event
         *   object is being sent to the {@link capabilities.applyToCart} callback. This url can be overridden.
         * @property {Function} preventDefault - In cases when the platform is using the `applyToCartUrl` to apply an offer,
         *   invoking this method will prevent the platform from redirecting the browser to the `applyToCartUrl`.
         */

        /**
         * This object describes an offer to be deputized.
         *
         * @typedef {Object} DeputizeOfferEvent
         *
         * @property {String} type - The event type, "offer:deputize".
         * @property {String} code - The actual discount code to be applied.
         * @property {String} tempCode - The temporary, deputized code, if it is a session-only offer.
         * @property {String} url - The deputize url with code parameters replaced with values, if applicable.
         * @property {String} originalUrl - The original deputize url, if applicable.
         * @property {Function} async - Marks this operation as asynchronous and returns the "done" callback which
         *   must be invoked when the operation is complete. The platform will attempt to deputize the offer again
         *   on the next page view if the "done" callback is passed `false` as its first parameter.
         */

        /**
         * This object describes an offer to be enabled.
         *
         * @typedef {Object} SessionOfferEvent
         *
         * @property {String} type - The event type, "offer:session".
         * @property {String} code - The discount code to be applied.
         * @property {String} url - The session offer url with code parameters replaced with values, if applicable.
         * @property {String} originalUrl - The original session offer url, if applicable.
         * @property {Function} async - Marks this operation as asynchronous and returns the "done" callback which
         *   must be invoked when the operation is complete. The platform will attempt to deputize the offer again
         *   on the next page view if the "done" callback is passed `false` as its first parameter.
         */

        return capabilities;
    });

    /**
     * @namespace rootDomain
     */

    define('platform/rootDomain', [], function() {
        var topLevel = /^(co|com|net|org|gov|edu|mil|int)$/,
            ccTLD = /^(ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cw|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$/,
            isCrappyIE = /(MSIE|Trident)/i.test(navigator.userAgent);
        var skipLogicRE = /(\.myshopify\.com)/;

        var rootDomain = {
            /**
             * Determines the root domain name of a given hostname.
             *
             * For example "www.fanplayr.com" should resolve to "fanplayr.com".
             *
             * @function rootDomain#get
             * @param {String} [domain] - The hostname to resolve. Defaults to `document.location.hostname` if absent.
             * @returns {String} - The root domain.
             */
            get: function(domain) {
                domain = domain || window.location.hostname;
                if (skipLogicRE.test(domain)) {
                    return domain;
                }
                var names = domain.split(".");
                if (names.length > 2) {
                    var reversed = names.slice(0).reverse();
                    if (ccTLD.test(reversed[0])) {
                        if (topLevel.test(reversed[1])) {
                            return names.slice(-3).join(".");
                        }
                    }
                }

                return names.slice(-2).join(".");
            },

            /**
             * Determines the root domain name of a hostname for cookie operations.
             *
             * For example `"www.fanplayr.com"` should resolve to `".fanplayr.com"`.
             *
             * This method strips out the leading period for Internet Explorer due to a bug
             * in which it doesn't save cookies prefixed with periods, but allows access to
             * cookies on the entire domain despite this. See {@link http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx}.
             *
             * @function rootDomain#forCookie
             * @param {String} [domain] - The hostname to resolve. Defaults to `document.location.hostname` if absent.
             * @returns {String} - The root cookie domain.
             */
            forCookie: function(domain) {
                domain = domain || window.location.hostname;

                // IE doesn't seem to save cookies with leading periods, but
                // allows access for the whole domain anyway.
                //
                // See: http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx
                if (isCrappyIE || /^([a-z]+|[\d\.]+)$/i.test(domain)) {
                    return "";
                }
                return "." + rootDomain.get(domain);
            }
        };

        return rootDomain;
    });

    // https://www.chromium.org/updates/same-site/incompatible-clients
    define('platform/shouldSendSameSiteNone', [], function() {
        function shouldSendSameSiteNone(useragent) {
            return !isSameSiteNoneIncompatible(useragent);
        }

        // Classes of browsers known to be incompatible.

        function isSameSiteNoneIncompatible(useragent) {
            return hasWebKitSameSiteBug(useragent) ||
                dropsUnrecognizedSameSiteCookies(useragent);
        }

        function hasWebKitSameSiteBug(useragent) {
            return isIosVersion(12, useragent) ||
                (
                    isMacosxVersion(10, 14, useragent) &&
                    (isSafari(useragent) || isMacEmbeddedBrowser(useragent))
                );
        }

        function dropsUnrecognizedSameSiteCookies(useragent) {
            if (isUcBrowser(useragent)) {
                return !isUcBrowserVersionAtLeast(12, 13, 2, useragent);
            }
            return isChromiumBased(useragent) &&
                isChromiumVersionAtLeast(51, useragent) &&
                !isChromiumVersionAtLeast(67, useragent);
        }

        // Regex parsing of User-Agent string. (See note above!)

        function isIosVersion(major, useragent) {
            var match = /\(iP.+; CPU .*OS (\d+)[_\d]*.*\) AppleWebKit\//.exec(useragent);
            // Extract digits from first capturing group.
            return match && match[1] === String(major);
        }

        function isMacosxVersion(major, minor, useragent) {
            var match = /\(Macintosh;.*Mac OS X (\d+)_(\d+)[_\d]*.*\) AppleWebKit\//.exec(useragent);
            // Extract digits from first and second capturing groups.
            return match &&
                match[1] === String(major) &&
                match[2] === String(minor);
        }

        function isSafari(useragent) {
            return /Version\/.* Safari\//.test(useragent) &&
                !isChromiumBased(useragent);
        }

        function isMacEmbeddedBrowser(useragent) {
            return /^Mozilla\/[.\d]+ \(Macintosh;.*Mac OS X [_\d]+\) AppleWebKit\/[.\d]+ \(KHTML, like Gecko\)$/.test(useragent);
        }

        function isChromiumBased(useragent) {
            return /Chrom(e|ium)/.test(useragent);
        }

        function isChromiumVersionAtLeast(major, useragent) {
            var match = /Chrom[^ /]+\/(\d+)[.\d]* /.exec(useragent);
            // Extract digits from first capturing group.
            return match && parseInt(match[1], 10) >= major;
        }

        function isUcBrowser(useragent) {
            return /UCBrowser\//.test(useragent);
        }

        function isUcBrowserVersionAtLeast(major, minor, build, useragent) {
            var match = /UCBrowser\/(\d+)\.(\d+)\.(\d+)[.\d]* /.exec(useragent);
            if (match) {
                var major_version = parseInt(match[0], 10);
                var minor_version = parseInt(match[1], 10);
                var build_version = parseInt(match[2], 10);
                if (major_version !== major) {
                    return major_version > major;
                }
                if (minor_version !== minor) {
                    return minor_version > minor;
                }
                return build_version >= build;
            }
            return false;
        }

        return shouldSendSameSiteNone;
    });

    define('platform/cookie', ['require', 'platform/utils', 'platform/rootDomain', 'platform/shouldSendSameSiteNone'], function(require) {
        var _ = require('platform/utils');
        var rootDomain = require('platform/rootDomain');
        var shouldSendSameSiteNone = require('platform/shouldSendSameSiteNone');

        var doc = document,
            encode = encodeURIComponent,
            decode = decodeURIComponent;

        /**
         * Cooke managment.
         *
         * @namespace cookie
         */
        var cookie = {
            /**
             * Retrieve a cookie.
             *
             * @function cookie#get
             * @param {String} name - The name of the cookie.
             * @returns {String|null} - The value of the cookie, or `null` if it doesn't exist.
             */
            get: function(name) {
                var cookies = doc.cookie.split(';'),
                    i, match;
                var value = null;
                for (i = 0; i < cookies.length; i++) {
                    match = cookies[i].match(/([a-z0-9_\-]+)=(.*)/i);
                    if (match && decode(match[1]) === name) {
                        value = decode(match[2]);
                        break;
                    }
                }
                return value;
            },

            /**
             * Set a cookie.
             *
             * @function cookie#set
             * @param {String} name - The name of the cookie.
             * @param {String} value - The value to store.
             * @param {Object} [options] - Optional options.
             * @param {String|Date} [options.expires] - An expiration mode name (String) or `Date` object.
             *
             * If a mode name is given, it must be one of the following:
             *
             *   - `"never"` - Sets the cookie expiration date to 20 years into the future. **This is the default**.
             *   - `"session"` - Instruct the browser to persist the cookie for only as long as the current browsing session. This may vary from browser to browser.
             *   - `"now"` - Sets the cookie expiration date to something in the past, so that it expires right away.
             *
             * Otherwise, `expires` is expected to be a `Date` object.
             *
             * @param {String} [options.domain] - The domain to set the cookie on. If `"*"` is used (default), the root domain of the current site is used.
             * @param {String} [options.path] - The path to store the cookie at. Default is `"/"`.
             * @param {Boolean} [options.secure] - Whether to store this cookie only on HTTPS domains. Default is `false`.
             * @param {Boolean} [options.raw] - If set to `true`, `value` will not be url-encoded.
             */
            set: function(name, value, options) {
                options = _.merge({
                    expires: "never",
                    domain: "*"
                }, options || {});

                if (options.expires === "session") {
                    delete options.expires;
                } else if (options.expires === "never") {
                    // Forever is one year in the future.
                    var forever = new Date();
                    forever.setFullYear(forever.getFullYear() + 1);
                    options.expires = forever;
                } else if (options.expires === "expire" || options.expires === "now") {
                    options.expires = new Date(2000, 1, 1);
                }

                if (options.domain === "*") {
                    options.domain = rootDomain.forCookie();
                }

                if (options.domain && /^([a-z]+|[\d\.]+)$/i.test(options.domain)) {
                    options.domain = "";
                }

                var parts = [
                    encode(name) +
                    "=" +
                    (options.raw ? value : encode(value))
                ];
                if (options.expires && options.expires instanceof Date) {
                    parts.push("expires=" + options.expires.toUTCString());
                }
                parts.push("path=" + (options.path || "/"));
                if (options.domain) {
                    parts.push("domain=" + options.domain);
                }
                if (shouldSendSameSiteNone(navigator.userAgent)) {
                    parts.push("SameSite=None");
                    parts.push("Secure");
                }
                var data = parts.join("; ");
                document.cookie = data;

                return true;
            },

            /**
             * Removes a cookie.
             *
             * This is a shorthand method for calling {@link cookie#set} with `option.expires` set to `"now"`.
             *
             * @function cookie#remove
             * @param {String} name - The name of the cookie.
             * @param {Object} [options] - Optional options to pass to {@link cookie#set}.
             */
            remove: function(name, options) {
                cookie.set(name, '', _.merge({
                    expires: "expire"
                }, options));
            }
        };

        return cookie;
    });

    define('platform/debugConfig', ['require', 'platform/log'], function(require) {
        var log = require('platform/log');
        var config = {};
        try {
            var data = localStorage.getItem('fp_debug_config');
            if (data) {
                config = window.JSON.parse(data);
                log('Using debug config', config);
            }
        } catch (ex) {}
        return config;
    });

    define('platform/productRecApi', ['require', 'platform', 'platform/utils', 'platform/config', 'platform/state', 'platform/json', 'platform/debugConfig'], function(require) {
        var platform = require('platform');
        var _ = require('platform/utils');
        var Config = require('platform/config');
        var State = require('platform/state');
        var JSON = require('platform/json');
        var debugConfig = require('platform/debugConfig');
        // var log = require('platform/log').create('platform:product-rec-api');

        /* globals fetch, Promise */
        var PROJECT_INFO_KEY = 'fpProductRec';
        var EVENT_PAYLOAD_VERSION = '2020-07-15';
        var COLLECT_ENDPOINT = 'https://collect.fanplayr.com/eventsAPI';
        var RECOMMEND_ENDPOINT = 'https://recommendations.fanplayr.com/v1/predict';
        var RECOMMEND_TOKEN_PARAM = 'fp_rec_token';

        var postSetProjectIdTasks = [];

        /**
         * @typedef {Platform.Recommendations.Google.UserEvent['eventType'] | true} AcceptableUserEvent
         */

        /**
         * Maps model types to arrays of supported user event types. A special event
         * type of `true` acts as a wildcard where any event type can take its place.
         *
         * These events should be listed in the order of priority where the first
         * event matched is the highest priority.
         * @type {Record<Platform.Recommendations.AiModelType, AcceptableUserEvent[]>}
         */
        var bestModelEventTypes = {
            FBT: [
                'detail-page-view',
                'add-to-cart',
                'shopping-cart-page-view',
                'purchase-complete',
            ],
            OYML: [
                'detail-page-view',
                'add-to-cart',
                'shopping-cart-page-view'
            ],
            RFY: ['detail-page-view', true],
            RV: ['detail-page-view', true]
        };
        bestModelEventTypes['FREQUENTLY-BOUGHT-TOGETHER'] = bestModelEventTypes.FBT;
        bestModelEventTypes['OTHERS-YOU-MAY-LIKE'] = bestModelEventTypes.OYML;
        bestModelEventTypes['RECOMMENDED-FOR-YOU'] = bestModelEventTypes.RFY;
        bestModelEventTypes['SIMILAR-ITEMS'] = bestModelEventTypes.FBT;
        bestModelEventTypes['RECENTLY-VIEWED'] = bestModelEventTypes.RV;

        /**
         * Array of events tracked for the current page view (until browser is
         * refreshes). Newest events are first.
         * @type {Platform.Recommendations.Google.UserEvent[]}
         */
        var trackedEvents = [];

        /**
         * Used to determine if the browser supports the APIs necessary to use this
         * feature.
         */
        function isSupported() {
            // @ts-ignore
            return !!(window.fetch && window.Promise);
        }

        /**
         *
         * @param {Platform.Recommendations.ProductActivityOptions} opts
         * @return {Promise<Platform.Recommendations.ProductActivityResult>}
         */
        function getProductActivity(opts) {
            var info = getProjectInfo();
            if (!info) {
                return Promise.reject('No project info');
            }
            var display = _.find(info.displays, {
                id: opts.productDisplayId
            });
            if (!display) {
                return Promise.reject('Missing product display');
            }
            var productId = State.page.product.id;
            if (!productId) {
                return Promise.reject('Missing product ID');
            }
            var payload = {
                projectId: display.projectId,
                version: 2,
                algorithm: display.model,
                numPreviousMinutes: display.numPreviousMinutes,
                productId: productId
            };
            return fetch(getMerchandisingQueryEndpoint(), {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function(res) {
                return res.json();
            }).then(
                /**
                 * @param {Platform.Recommendations.ProductActivityResponse} res
                 */
                function(res) {
                    if (!display) {
                        return Promise.reject('Missing product display');
                    }
                    var propertyMap = {
                        'PRODUCT-ACTIVITY-VIEWS': 'views',
                        'PRODUCT-ACTIVITY-CARTS': 'carts',
                        'PRODUCT-ACTIVITY-PURCHASES': 'purchases',
                    };
                    var property = propertyMap[payload.algorithm];
                    var activityCount = 0;
                    if ('views' in res) {
                        // Version 1
                        activityCount = res[property];
                    } else if (_.isArray(res.catalogItems) && res.catalogItems.length > 0) {
                        // Version 2
                        var product = res.catalogItems[0];
                        activityCount = product[property];
                    }
                    var minimumActivityRequired = display.minimumActivity || 0;
                    var maximumActivityRequired = display.maximumActivity || 0;
                    if (minimumActivityRequired > 0 && activityCount < minimumActivityRequired) {
                        return Promise.reject('Minimum activity count unmet');
                    }
                    if (maximumActivityRequired > 0 && activityCount > maximumActivityRequired) {
                        return Promise.reject('Maximum activity count exeeded');
                    }
                    return {
                        count: activityCount
                    };
                });
        }

        function getMerchandisingQueryEndpoint() {
            return _.get(
                debugConfig,
                'merchandising.queryEndpoint',
                'https://merchandising.fanplayr.com/queryMerchandising'
            );
        }

        /**
         * Calls the API to get a list of product recommendations using the last
         * tracked user event as context.
         *
         * @param {Platform.Recommendations.RecommendationOptions} opts
         * @returns {Promise<Platform.Recommendations.RecommendationResult>}
         */
        function getRecommendation(opts) {
            var info = getProjectInfo();
            if (!info) {
                return Promise.reject('No project info');
            }
            /** @type {Platform.Recommendations.PredictRequest | undefined} */
            var payload;

            var pageCategories = getPageCategories();

            /** @type {Platform.Recommendations.RecommendationTrackingInfo} */
            var trackingInfo;
            if (opts.productDisplayId) {
                var display = _.find(info.displays, {
                    id: opts.productDisplayId
                });
                // If a widget refers to a missing display then it is likely that the
                // display has been disabled as the server only returns active ones.
                if (display) {
                    trackingInfo = {
                        display: display
                    };
                    payload = {
                        projectId: display.projectId,
                        placement: display.model,
                        userEvent: getBestEventForModelType(display.modelType),
                        minItems: display.minProducts,
                        maxItems: display.maxProducts,
                        productListId: display.listId,
                        brands: display.filterPageBrand ? State.page.brands : undefined,
                        categories: display.filterPageCategory ? pageCategories : undefined,
                        catalogEndpoint: _.get(debugConfig, 'merchandising.catalogEndpoint'),
                        queryEndpoint: _.get(debugConfig, 'merchandising.queryEndpoint')
                    };
                    if (isModelRankingType(display.modelType)) {
                        payload.ranking = {
                            userKey: Config.userKey || '',
                            numDays: display.numDaysHistory,
                            sortBy: display.sortBy,
                            endpoint: _.get(debugConfig, 'merchandising.rankingEndpoint')
                        };
                    }
                }
            } else {
                var placement = findPlacement(info, opts);
                if (placement) {
                    trackingInfo = {
                        placement: placement
                    };
                    payload = {
                        projectId: info.projectId,
                        placement: placement.googlePlacementId,
                        userEvent: getBestEventForModelType(placement.type),
                        minItems: opts.minItems,
                        maxItems: opts.maxItems
                    };
                    if (isModelRankingType(placement.type)) {
                        payload.ranking = {
                            userKey: Config.userKey || '',
                            numDays: opts.numDays,
                            startPrice: opts.startPrice,
                            endPrice: opts.endPrice,
                            categories: opts.usePageCategory ?
                                pageCategories :
                                (opts.category ? [opts.category] : [])
                        };
                    }
                }
            }
            if (!payload) {
                return Promise.reject('Unable to build recommendation payload');
            }
            if (!payload.userEvent && !payload.ranking) {
                return Promise.reject('No suitable event for placement');
            }
            return fetch(RECOMMEND_ENDPOINT, {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function(res) {
                return res.json();
            }).then(
                /**
                 * @param {Platform.Recommendations.PredictResponse} res
                 */
                function(res) {
                    if (res.error) {
                        throw res.error;
                    }
                    // res.trackingInfo = trackingInfo;
                    res.results = res.results.map(function(product) {
                        product.price = product.priceFormatted;
                        return product;
                    });
                    return {
                        recommendationToken: res.recommendationToken,
                        results: res.results,
                        trackingInfo: trackingInfo
                    };
                }
            );
        }

        /**
         * Returns the most recent event captured which is supported by the model type.
         * @param {Platform.Recommendations.ModelType} modelType
         * @returns {Platform.Recommendations.Google.UserEvent | undefined}
         */
        function getBestEventForModelType(modelType) {
            /**
             * An ordered list of acceptable event types where earlier items take priority.
             * @type {AcceptableUserEvent[]}
             */
            var acceptableEventTypes = bestModelEventTypes[modelType] || [];

            /** @type {Platform.Recommendations.Google.UserEvent[]} */
            var acceptableSortedEvents = trackedEvents
                // Filter only events of suitable type
                .filter(function(event) {
                    return (
                        // Matches the event type exactly
                        acceptableEventTypes.indexOf(event.eventType) >= 0 ||
                        // Or allow any event type if the special `true` value is used
                        acceptableEventTypes.indexOf(true) >= 0
                    );
                })
                // Sort events so that the first acceptable event type takes priority.
                .sort(function(a, b) {
                    var aIndex = acceptableEventTypes.indexOf(a.eventType);
                    var bIndex = acceptableEventTypes.indexOf(b.eventType);
                    // If any event is missing from the acceptable events array it must be
                    // because the acceptable events array includes a wildcard. In this case
                    // use the wildcard position as the index.
                    var wildcardIndex = acceptableEventTypes.indexOf(true);
                    if (aIndex === -1) {
                        aIndex = wildcardIndex;
                    }
                    if (bIndex === -1) {
                        bIndex = wildcardIndex;
                    }
                    return aIndex - bIndex;
                });

            if (acceptableSortedEvents.length) {
                return acceptableSortedEvents[0];
            }
            if (modelType === 'RFY') {
                // HACK: Temporary solution to allow RFY models to work on "other" page
                // types after moving to Google's V2 API.
                return createBaseEvent('home-page-view');
            }
        }

        /**
         * Determines whether a model is one of the product ranking types.
         * @param {Platform.Recommendations.ModelType} type
         */
        function isModelRankingType(type) {
            return [
                'RANKING-NONE',
                'RANKING-BY-VIEWS',
                'RANKING-BY-CARTS',
                'RANKING-BY-PURCHASES',
                'RANKING-BY-REVENUE',
                'RECENTLY-VIEWED'
            ].indexOf(type) >= 0;
        }

        /**
         * Extracts a recommendation token from the document url. This token is
         * included in recommended product URLs.
         */
        function getRecTokenFromDocUrl() {
            var url = _.parseUrl(location.href);
            return url.params[RECOMMEND_TOKEN_PARAM];
        }

        /**
         * Tracks a user event using the Google Recommdnation AI format.
         *
         * The backend will route events to Google if enabled on the catalog. It will
         * also process events for Fanplayr's own "ranking" models if they are
         * enabled.
         * @param {Platform.Recommendations.ProjectInfo} info
         * @param {Platform.Recommendations.Google.UserEvent} event
         */
        function trackEvent(info, event) {
            trackedEvents.unshift(event);
            var payload = {
                type: 'event',
                version: EVENT_PAYLOAD_VERSION,
                projectId: info.projectId,
                event: event
            };
            var url = COLLECT_ENDPOINT +
                '?type=recommendations' +
                '&subType=event' +
                '&format=image' +
                '&body=' + encodeURIComponent(JSON.stringify(payload)) +
                '&version=' + encodeURIComponent(info.version || '') +
                '&ets=' + Date.now(); // Prevent caching
            var img = document.createElement('img');
            img.width = 1;
            img.height = 1;
            img.src = url;
        }

        /**
         * NOTE: This gets called BEFORE page tracking occurs meaning that events
         * tracked here will not include a `pageIndex`.
         */
        function processClicks() {
            processAppClick();
            processWidgetClick();
        }

        // TODO: Remove in future release
        /**
         * Deprecated. Remove in future release since widget-app now tracks next page
         * view events using local storage api instead of appending data to URL.
         * @deprecated
         */
        function processAppClick() {
            try {
                // Use native `URL` class because our internal `parseUrl` utility fails
                // to decode `+` characters to spaces.
                var url = new URL(location.href);
                var appRecommendClick = url.searchParams.get('fp_app_rec_click');
                if (appRecommendClick) {
                    var eventData = JSON.parse(appRecommendClick);
                    platform.trackEvent({
                        type: 'app',
                        subType: 'product-recommend-click',
                        data: eventData
                    });
                }
            } catch (ex) {}
        }

        /**
         * Tracks product clicks from the ProductRec component by extracting
         * parameters from the document url which identify the specific wigdet,
         * placement and product clicked.
         */
        function processWidgetClick() {
            if (/fp_recW/.test(location.href)) {
                try {
                    var url = _.parseUrl(location.href);
                    /**
                     * @type {object}
                     * @property {number | undefined} productDisplayId
                     */
                    var widgetId = parseInt(url.params.fp_recW, 10);

                    /**
                     * @typedef WidgetClickData
                     * @property {number} widgetId
                     * @property {number} [productDisplayId]
                     * @property {number} [placementId]
                     * @property {string} [placementGroupId]
                     * @property {string} [productId]
                     * @property {string | null} [productGroupId]
                     * @property {string} [modelType]
                     * @property {string} [token]
                     */

                    /**
                     * @type {WidgetClickData}
                     */
                    var data = {
                        widgetId: widgetId,
                        productDisplayId: undefined,
                        placementId: undefined,
                        placementGroupId: undefined,
                        productId: url.params.fp_recI,
                        // `_.parseUrl` converts values to `true` if empty
                        productGroupId: typeof url.params.fp_recG === 'string' ?
                            url.params.fp_recG :
                            null
                    };
                    var displayId = Number(url.params.fp_recD);
                    if (displayId) {
                        var modelType = url.params.fp_recMt;
                        // TODO: Remove after next push
                        if (!modelType) {
                            // This is fallback code to find the model type if it is missing
                            // from the page URL.
                            var info = getProjectInfo();
                            var display = info && _.find(info.displays, {
                                id: displayId
                            });
                            if (display) {
                                modelType = display.modelType;
                            }
                        }
                        data.productDisplayId = displayId;
                        data.modelType = modelType;
                    } else {
                        var placementId = Number(url.params.fp_recP);
                        var placementGroupId = url.params.fp_recPg;
                        if (placementId) {
                            data.placementId = placementId;
                            data.placementGroupId = placementGroupId;
                        }
                        // var placement = findPlacement(info, {
                        //   id: url.params.fp_recP
                        // });
                        // if (placement) {
                        //   data.placementId = placement.id;
                        //   data.placementGroupId = placement.groupId;
                        // }
                    }
                    var token = getRecTokenFromDocUrl();
                    data.token = token;
                    platform.trackEvent({
                        type: 'productRec',
                        subType: 'click',
                        data: data
                    });
                } catch (ex) {}
            }
        }

        /**
         * Called by the `tracking` module before the page is tracked.
         */
        function processPageView() {
            var info = getProjectInfo();
            if (!info) {
                postSetProjectIdTasks.push(processPageView);
            } else {
                var events = createPageViewEvents();
                for (var i = 0; i < events.length; i++) {
                    trackEvent(info, events[i]);
                }
            }
            processClicks();
        }

        /**
         * Finds a placement based on Recommendation options.
         *
         * @param {Platform.Recommendations.ProjectInfo} info
         * @param {Object} opts
         * @param {number | string} [opts.id]
         * @param {string} [opts.placementGroupId]
         * @param {string} [opts.placementId] (deprecated)
         * @return {(Platform.Recommendations.Placement | undefined)}
         */
        function findPlacement(info, opts) {
            if (info && info.placements) {
                for (var i = 0, len = info.placements.length; i < len; i++) {
                    var placement = info.placements[i];
                    // Multiple search properties might be present but we want to prioritize
                    // them in the following order: `id`, `placementGroupId`, `placementId`.
                    if (opts.id) {
                        if (Number(opts.id) === placement.id) {
                            return placement;
                        }
                    } else if (opts.placementGroupId) {
                        if (opts.placementGroupId === placement.groupId) {
                            return placement;
                        }
                    } else if (opts.placementId) {
                        if (opts.placementId === placement.googlePlacementId) {
                            return placement;
                        }
                    }
                }
            }
        }

        /**
         * @return {Platform.Recommendations.ProjectInfo | undefined}
         */
        function getProjectInfo() {
            try {
                var json = sessionStorage.getItem(PROJECT_INFO_KEY);
                if (json) {
                    var info = JSON.parse(json);
                    if (info.sessionKey === Config.sessionKey) {
                        return info;
                    }
                    // Ignore cached project info as it belongs to a different session and
                    // may be stale.
                    sessionStorage.removeItem(PROJECT_INFO_KEY);
                }
            } catch (ex) {}
        }

        /**
         * Caches the project info so future browsing events don't need to wait
         * for page tracking response.
         *
         * @param {Platform.Recommendations.ProjectInfo} info
         */
        function setProjectInfo(info) {
            try {
                info.sessionKey = Config.sessionKey;
                sessionStorage.setItem(PROJECT_INFO_KEY, JSON.stringify(info));
                // Run any pending tasks that were queued before we had a project ID.
                if (info && postSetProjectIdTasks.length) {
                    var tasks = postSetProjectIdTasks.slice(0);
                    postSetProjectIdTasks = [];
                    for (var i = 0; i < tasks.length; i++) {
                        tasks[i]();
                    }
                }
            } catch (ex) {}
        }

        /**
         * Normalizes a URL to be sent with an event by ensuring that it does not
         * contain any fragment/hash parts and does not exceed 1500 characters.
         * @param {string} url
         * @returns {string | undefined}
         */
        function normalizeEventUrl(url) {
            if (typeof url === 'string') {
                var hashIndex = url.indexOf('#');
                var index = Math.min(hashIndex >= 0 ? hashIndex : 1500);
                return url.substring(0, index);
            }
            return url;
        }

        /**
         * @param {Platform.Recommendations.Google.EventType} eventType
         * @returns {Platform.Recommendations.Google.UserEvent}
         */
        function createBaseEvent(eventType) {
            var pageViewId = Config.sessionKey + '-' + Date.now();
            var token = getRecTokenFromDocUrl();
            return {
                eventType: eventType,
                visitorId: Config.userKey || '',
                userInfo: {
                    userId: State.user.id || undefined,
                    // Replaced when server processes the event.
                    ipAddress: '__CLIENT_IP_ADDRESS__',
                    userAgent: navigator.userAgent
                },
                uri: normalizeEventUrl(document.location.href),
                referrerUri: normalizeEventUrl(document.referrer) || undefined,
                pageViewId: pageViewId,
                attributionToken: token
            };
        }

        function createPageViewEvents() {
            try {
                /** @type {Platform.Recommendations.Google.UserEvent[]} */
                var events = [];
                var page = State.page;
                var cartId = Config.sessionKey;
                var pageType = page.type;
                /** @type {Platform.Recommendations.Google.UserEvent} */
                var event;
                if (pageType === 'home') {
                    event = createBaseEvent('home-page-view');
                    events.push(event);
                } else if (pageType === 'cat') {
                    var categories = getPageCategories();
                    if (categories.length) {
                        event = createBaseEvent('category-page-view');
                        event.pageCategories = categories;
                        events.push(event);
                    }
                } else if (pageType === 'prod') {
                    event = createBaseEvent('detail-page-view');
                    event.productDetails = [{
                        product: {
                            id: page.product.id || ''
                        }
                    }];
                    events.push(event);
                } else if (pageType === 'cart') {
                    event = createBaseEvent('shopping-cart-page-view');
                    event.productDetails = normalizeProductDetails(State.cart.products);
                    event.cartId = cartId;
                    events.push(event);
                }
                return events;
            } catch (ex) {
                return [];
            }
        }

        /**
         * Called by the `tracking` module when there is server-side cart state to
         * process.
         *
         * @param {Platform.Tracking.TrackPageServerCart} cart
         */
        function processServerCart(cart) {
            var info = getProjectInfo();
            if (!info) {
                postSetProjectIdTasks.push(function() {
                    processServerCart(cart);
                });
            } else {
                if (cart.productsAdded.length) {
                    trackAddRemoveCartEvent(info, 'add-to-cart', cart.productsAdded);
                }
                if (cart.productsRemoved.length) {
                    trackAddRemoveCartEvent(info, 'remove-from-cart', cart.productsRemoved);
                }
            }
        }

        /**
         * Tracks add/remove product events in the cart which were diffed by the
         * server.
         *
         * @param {Platform.Recommendations.ProjectInfo} info
         * @param {'add-to-cart' | 'remove-from-cart'} type
         * @param {Platform.Tracking.ServerProduct[]} products Array of products from the server.
         */
        function trackAddRemoveCartEvent(info, type, products) {
            if (type === 'add-to-cart') {
                var event = createBaseEvent(type);
                event.productDetails = normalizeProductDetails(products);
                event.cartId = Config.sessionKey;
                trackEvent(info, event);
            }
        }

        /**
         * @param {any[]} products
         * @returns {Platform.Recommendations.Google.ProductDetail[]}
         */
        function normalizeProductDetails(products) {
            return _.map(products, function(product) {
                return {
                    product: {
                        id: product.id
                    },
                    // `quantity` is used by client and `qty` is used by server
                    quantity: product.quantity || product.qty
                };
            });
        }

        /**
         * @returns {string[]}
         */
        function getPageCategories() {
            return State.page.categories.toFlatArray();
        }

        /** @type {Platform.Recommendations.Api} */
        var api = {
            isSupported: isSupported,
            processPageView: processPageView,
            processServerCart: processServerCart,
            getProjectInfo: getProjectInfo,
            setProjectInfo: setProjectInfo,
            getRecommendation: getRecommendation,
            getProductActivity: getProductActivity
        };
        return api;
    });

    define('platform/webPush/utils', ['require', 'platform/jquery', 'platform/config', 'platform/json'], function(require) {
        /* globals Promise */
        var $ = require('platform/jquery');
        var config = require('platform/config');
        var JSON = require('platform/json');
        var utils = {};

        utils.hasBaseSupport = function() {
            return (
                // Make sure service workers are supported.
                'serviceWorker' in navigator &&
                // Make sure notifications are supported.
                !!window.Notification &&
                // Make sure the web push api is supported.
                !!window.PushManager &&
                // Make sure Promises are supported with the methods we need.
                typeof Promise === 'function'
            );
        };

        /**
         * Updates the push info state on the session.
         * @param {Platform.WebPush.PushInfo} pushInfo
         */
        utils.setPushInfo = function(pushInfo) {
            return new Promise(function(resolve) {
                config.pushInfo = pushInfo;
                $.ajax({
                    url: '//' + config.sessionEndpoint + '/external.Genius/',
                    dataType: 'jsonp',
                    data: {
                        a: 'pushSubscribe',
                        sk: config.sessionKey,
                        pushInfo: JSON.stringify(config.pushInfo)
                    },
                    complete: function() {
                        // @ts-ignore
                        resolve();
                    }
                });
            });
        };

        /**
         * Converts VAPID public key string to Base64.
         * @param {string} key
         */
        utils.publicKeyToBase64 = function(key) {
            var padding = '='.repeat((4 - key.length % 4) % 4);
            return (key + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');
        };

        /**
         * @param {string} base64String
         */
        utils.base64ToArrayBuffer = function(base64String) {
            return Uint8Array.from(atob(base64String), function(char) {
                return char.charCodeAt(0);
            });
        };

        /**
         * @param {ArrayBuffer} arrayBuffer
         */
        utils.arrayBufferToBase64 = function(arrayBuffer) {
            return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
        };

        return utils;
    });

    define('platform/webPush/inlineApi', ['require', 'platform', 'platform/config', 'platform/json', 'platform/utils', 'platform/webPush/utils', 'platform/log'], function(require) {
        /* globals Promise */
        var platform = require('platform');
        var config = require('platform/config');
        var JSON = require('platform/json');
        var _ = require('platform/utils');
        var utils = require('platform/webPush/utils');
        var log = require('platform/log').create('platform:web-push:inline');

        /**
         * The localStorage key to use when storing the session key that last
         * attempted to resubscribe. This is used to avoid multiple re-subscription
         * attempts in the same session.
         */
        var RESUBSCRIBE_STORAGE_KEY = 'fp_last_resub_sk';

        /** @type {Platform.WebPush.Api} */
        var api = {
            type: 'inline',
            version: 'u',
            // isEnabled: isEnabled,
            isSupported: isSupported,
            getPushInfo: getPushInfo,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            upgradeSubscription: upgradeSubscription,
        };

        function isEnabled() {
            return !!window.fanplayrServiceWorker;
        }

        function isSupported() {
            return isEnabled() && utils.hasBaseSupport();
        }

        function postToWorker(msg) {
            msg.source = 'fanplayr';
            return new Promise(function(resolve, reject) {
                getWorker().then(function() {
                    var controller = navigator.serviceWorker.controller;
                    if (controller) {
                        try {
                            var channel = new MessageChannel();
                            channel.port1.onmessage = function(event) {
                                resolve(event.data);
                            };
                            controller.postMessage(JSON.stringify(msg), [channel.port2]);
                        } catch (ex) {
                            reject(ex);
                        }
                    }
                });
            });
        }

        if (isSupported()) {
            log('Querying worker version..');
            postToWorker({
                action: 'getVersion'
            }).then(function(version) {
                log('Got version', version);
                api.version = version;
            });
        }

        /**
         * Checks if the current subscription is valid and if it does not use the
         * same public key as the current public key, unsubscribes.
         *
         * @param {string} webPushPublicKey
         * @returns {Promise<boolean>} Returns `true` if the subsciption was upgraded.
         */
        function upgradeSubscription(webPushPublicKey) {
            return getWorker().then(function(registration) {
                return registration.pushManager.getSubscription().then(
                    function(subscription) {
                        if (
                            platform.config.webPushResubscribe &&
                            !subscription &&
                            Notification.permission === 'granted'
                        ) {
                            // Make sure we don't attempt to resubscibe the user multiple times
                            // in the same session in case the subscription API fails. We do
                            // this by storing the session key we used to resubscribe and
                            // ensuring we don't encounter that session key twice.
                            var lastResubSessionKey = localStorage.getItem(RESUBSCRIBE_STORAGE_KEY);
                            if (lastResubSessionKey && config.sessionKey === lastResubSessionKey) {
                                log('Already attempt to resubscribe so skip!');
                                return false;
                            }
                            localStorage.setItem(RESUBSCRIBE_STORAGE_KEY, config.sessionKey || '');
                            log('Attempting to resubscribe..');
                            return doSubscribe({
                                registration: registration,
                                publicKey: webPushPublicKey,
                                oldSubscription: null
                            }).then(function(newSubscription) {
                                if (newSubscription) {
                                    log('Resubscribe successful', newSubscription);
                                } else {
                                    log('Resubscribe failed');
                                }
                                // Track whether the resubscription was successful.
                                platform.trackEvent({
                                    type: 'webPush',
                                    subType: newSubscription ? 'resubscribeSuccess' : 'resubscribeFail'
                                });
                                return true;
                            });
                        }

                        if (subscription && subscription.options.applicationServerKey) {
                            var publicKey64 = utils.publicKeyToBase64(webPushPublicKey);
                            var subKey64 = utils.arrayBufferToBase64(
                                subscription.options.applicationServerKey
                            );
                            if (publicKey64 !== subKey64) {
                                // Track that a subscription upgrade is being attempted.
                                platform.trackEvent({
                                    type: 'webPush',
                                    subType: 'upgradeAttempt'
                                });
                                return subscription.unsubscribe().then(function() {
                                    return doSubscribe({
                                        registration: registration,
                                        publicKey: webPushPublicKey,
                                        oldSubscription: subscription
                                    }).then(function(newSubscription) {
                                        // Track whether the upgrade succeeded or failed.
                                        platform.trackEvent({
                                            type: 'webPush',
                                            subType: newSubscription ? 'upgradeSuccess' : 'upgradeFail'
                                        });
                                        return true;
                                    });
                                });
                            }
                        }
                        return false;
                    }
                );
            });
        }

        /**
         * Performs actual subscription request and tracks details to server if
         * successful.
         *
         * @param {object} opts
         * @param {ServiceWorkerRegistration} opts.registration
         * @param {string} opts.publicKey
         * @param {PushSubscription | null} opts.oldSubscription
         * @returns {Promise<PushSubscription | null>}
         */
        function doSubscribe(opts) {
            var currentPermission = Notification.permission;
            return opts.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: utils.base64ToArrayBuffer(
                    utils.publicKeyToBase64(opts.publicKey)
                )
                // Throws if user blocks.
            }).catch(function(err) {
                return null;
            }).then(function(subscription) {
                // The subscription may be null (at least in Chrome) if the user closes
                // the permission dialog without explicitly blocking permission.
                var pushInfo = createPushInfo({
                    subscription: subscription,
                    oldSubscription: opts.oldSubscription,
                    oldPermission: currentPermission
                });
                return utils.setPushInfo(pushInfo).then(function() {
                    return subscription;
                });
            });
        }

        /**
         * @param {Partial<Platform.WebPush.PushInfo>} [options]
         * @returns {Platform.WebPush.PushInfo}
         */
        function createPushInfo(options) {
            // Carefully access notification permission because this method may be
            // called when not supported by browser.
            var Notification = window.Notification;
            /** @type {Platform.WebPush.PushInfo} */
            var defaults = {
                isSupported: isSupported(),
                permission: Notification && Notification.permission,
                oldPermission: undefined,
                subscription: null,
                oldSubscription: null,
                swVer: api.version,
                hostname: location.hostname,
                method: 'inline'
            };
            return _.merge({}, defaults, options);
        }

        function getPushInfo() {
            if (isSupported()) {
                return getWorker().then(function(reg) {
                    return reg.pushManager.getSubscription().then(function(sub) {
                        return createPushInfo({
                            subscription: sub
                        });
                    });
                });
            }
            return Promise.resolve(createPushInfo());
        }

        /**
         * @returns {Promise<ServiceWorkerRegistration>}
         */
        function getWorker() {
            return navigator.serviceWorker.ready;
        }

        /**
         * This method explicitly attempts to subscribe the user to notifications. It
         * can be called from a widget action or from the `webPushSubscribe()` API we
         * publically expose. Returns a subscription if one already exists or was
         * created.
         * @returns {Promise<PushSubscription | null>}
         */
        function subscribe() {
            var webPushPublicKey = config.webPushPublicKey;
            if (!webPushPublicKey) {
                return Promise.resolve(null);
            }
            return getWorker().then(function(registration) {
                return registration.pushManager.getSubscription().then(function(subsciption) {
                    if (subsciption) {
                        log('Already have a subscription', subsciption);
                        return subsciption;
                    }
                    if (!webPushPublicKey) {
                        // Only necessary for typing since we aren't using `const` above.
                        return null;
                    }
                    // There is no subscription so attempt to create one.
                    // Track our attempt to create a subscription. We call this event
                    // "request" but the user will only see a prompt if they have not
                    // already granted permission. E.g. they may have granted permission
                    // perviously but the subscription expired.
                    platform.trackEvent({
                        type: 'webPush',
                        subType: 'request'
                    });
                    return doSubscribe({
                        registration: registration,
                        oldSubscription: null,
                        publicKey: webPushPublicKey
                    });
                });
            });
        }

        function unsubscribe() {
            return getWorker().then(function(registration) {
                return registration.pushManager.getSubscription().then(function(subscription) {
                    if (subscription) {
                        return subscription.unsubscribe();
                        // return subscription.unsubscribe().then(function(didUnsubscribe){
                        //   if (didUnsubscribe) {
                        //     var pushInfo = createPushInfo(null, null);
                        //     utils.setPushInfo(pushInfo);
                        //   }
                        //   return didUnsubscribe;
                        // });
                    }
                    return false;
                });
            });
        }

        return api;
    });

    define('platform/webPush/popupApi', ['require', 'platform', 'platform/utils', 'platform/json', 'platform/config', 'platform/webPush/utils', 'platform/debugConfig', 'platform/log'], function(require) {
        /* globals Promise */
        var platform = require('platform');
        var _ = require('platform/utils');
        var JSON = require('platform/json');
        var platformConfig = require('platform/config');
        var utils = require('platform/webPush/utils');
        var debugConfig = require('platform/debugConfig');
        var log = require('platform/log').create('platform:web-push:popup');

        /** @type {Platform.WebPush.Api} */
        var api = {
            type: 'popup',
            version: 'u',
            // isEnabled: isEnabled,
            isSupported: isSupported,
            getPushInfo: getPushInfo,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            upgradeSubscription: upgradeSubscription
        };

        /** @type {((pushInfo: Platform.WebPush.PushInfo) => void) | undefined} */
        var resolveSubscribe;

        function isEnabled() {
            return !!getPopupUrl();
        }

        function isSupported() {
            var isFirefox = (
                /Firefox\/\w+/i.test(navigator.userAgent) &&
                !/Seamonkey\/\w+/i.test(navigator.userAgent)
            );
            return isEnabled() && utils.hasBaseSupport() && !isFirefox && !!getPopupUrl();
        }

        function getPushInfo() {
            if (!isSupported()) {
                return Promise.resolve(createPushInfo(null, null));
            }
            return invokeAction('getPushInfo').then(
                /**
                 * @param {Platform.WebPush.PushInfo} info
                 */
                function(info) {
                    // Cache the service worker version on the API.
                    if (info.swVer && (api.version === 'u' || info.swVer > api.version)) {
                        api.version = info.swVer;
                        log('Set version to', api.version);
                    }
                    // In the Chrome-like browsers we support, the iframe will always return
                    // a "denied" permission when the actual value is "default". In this
                    // scenario we set the value as "unknown" so that we can fallback to
                    // using the user's last known permission stored on the user site for
                    // segmentation. If the last known permission is "denied" and the
                    // current permission is "unknown" then we will not allow subscribing
                    // via segmentation.
                    if (info.permission === 'denied') {
                        info.permission = 'unknown';
                        log('Set permission to unknown');
                    }
                    return info;
                }
            );
        }

        /** @type {Platform.WebPush.Api['subscribe']} */
        function subscribe() {
            /** @type {Promise<Platform.WebPush.PushInfo>} */
            var promise = new Promise(function(resolve) {
                resolveSubscribe = resolve;
                var pushInfo = platformConfig.pushInfo;
                if (pushInfo && pushInfo.permission === 'granted') {
                    log('Already granted, try using iframe');
                    var config = getPopupConfig();
                    if (!config) {
                        log('Missing config');
                        return;
                    }
                    invokeAction('subscribe', {
                        publicKey: utils.publicKeyToBase64(config.publicKey)
                    });
                } else {
                    openPopup();
                }
            });
            // The promise will get resolved in the window "message" handler.
            return promise.then(function(pushInfo) {
                return utils.setPushInfo(pushInfo).then(function() {
                    return pushInfo.subscription;
                });
            });
        }

        function unsubscribe() {
            return invokeAction('unsubscribe');
        }

        function upgradeSubscription() {
            // Unsupported
            return Promise.resolve(false);
        }

        /**
         * Posts a message to a window.
         * @param {MessageEventSource | undefined | null} target
         * @param {Record<string, any>} message
         */
        // function post(target, message) {
        //   if (target) {
        //     target.postMessage(message, {targetOrigin: '*'});
        //   }
        // }

        /**
         *
         * @returns
         */
        function openPopup() {
            var config = getPopupConfig();
            if (!config) {
                return;
            }
            var urlObj = _.parseUrl(config.url);
            urlObj.params.config = JSON.stringify(config);
            var url = urlObj.compile();
            if (config.target === 'popup' && config.width && config.height) {
                // Center the popup in the middle of the current monitor.
                var width = config.width;
                var height = config.height;
                var left = window.screenX + (screen.width / 2) - (width / 2);
                var top = window.screenY + (screen.height / 2) - (height / 2);
                var features = [
                    'popup',
                    'width=' + width,
                    'height=' + height,
                    'top=' + top,
                    'left=' + left
                ].join(',');
                window.open(url, 'fp-web-push-popup', features);
            } else {
                window.open(url, 'fp-web-push-popup');
            }
        }

        function getPopupConfig() {
            var url = getPopupUrl();
            if (url && (platformConfig.webPushPopup || debugConfig.webPushConfig)) {
                var result = _.mergeDeep({
                    url: url,
                    publicKey: platformConfig.webPushPublicKey
                }, platformConfig.webPushPopup || {}, debugConfig.webPushConfig);
                result.publicKey = utils.publicKeyToBase64(result.publicKey);
                return result;
            }
        }

        function getPageConfig() {
            var config = window.fanplayrServiceWorker;
            if (config && typeof config === 'object') {
                return config;
            }
        }

        function getPopupUrl() {
            var config = getPageConfig();
            if (config && config.domain) {
                return 'https://' + config.domain;
            }
        }

        /**
         * Creates a hidden iframe element which loads the popup URL and passes an
         * action name and unique response ID as parameters. The frame will post a
         * message to this window with the response ID and the result.
         * @param {string} action
         * @param {Record<string, any>} [extraParams]
         */
        function invokeAction(action, extraParams) {
            return new Promise(function(resolve, reject) {
                var popupUrl = getPopupUrl();
                if (!popupUrl) {
                    reject();
                    return;
                }
                var responseId = String(Math.random());
                var frame = document.createElement('iframe');
                var url = _.parseUrl(popupUrl);
                url.params = _.merge({
                    action: action,
                    responseId: responseId
                }, extraParams);
                frame.src = url.compile();
                frame.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 0; height: 0; visibility: hidden; border: 0';
                // log('invoke action', {action: action, responseId: responseId});
                /**
                 * @param {MessageEvent} event
                 */
                var handler = function(event) {
                    var data = event.data;
                    if (
                        _.isPlainObject(data) &&
                        data.source === 'fp-web-push-popup' &&
                        data.responseId === responseId
                    ) {
                        // log('got response for action', action, 'result: ', data.result);
                        window.removeEventListener('message', handler);
                        frame.remove();
                        resolve(data.result);
                    } else {
                        // log('ignore invoke response', data);
                    }
                };
                window.addEventListener('message', handler);
                document.body.appendChild(frame);
            });
        }

        /**
         * @param {PushSubscription | null} subscription
         * @param {PushSubscription | null} oldSubscription
         * @returns {Platform.WebPush.PushInfo}
         */
        function createPushInfo(subscription, oldSubscription) {
            var Notification = window.Notification;
            return {
                isSupported: isSupported(),
                permission: Notification && Notification.permission,
                subscription: subscription,
                oldSubscription: oldSubscription,
                swVer: api.version,
                hostname: location.hostname,
                method: 'popup'
            };
        }

        // Listen to message events on the window which would come from the popup.
        if (isSupported()) {
            window.addEventListener('message', function(event) {
                var data = event.data;
                // Ignore any message which doesn't match our popup or iframe source.
                if (!_.isPlainObject(data) || data.source !== 'fp-web-push-popup') {
                    return;
                }
                // log('got message', data);
                if (data.type === 'popup:ready') {
                    // The popup has loaded so send the configuration payload.
                    // post(event.source, {
                    //   type: 'load',
                    //   config: getPopupConfig()
                    // });
                } else if (data.type === 'popup:requested') {
                    // The user clicked the "subscribe" button in the popup.
                    platform.trackEvent({
                        type: 'webPush',
                        subType: 'request'
                    });
                } else if (data.type === 'popup:subscribed') {
                    // The user subscribed in the popup so fullfil any pending promise.
                    if (resolveSubscribe) {
                        resolveSubscribe(data.info);
                        resolveSubscribe = undefined;
                    }
                } else if (data.type === 'popup:cancel') {
                    if (resolveSubscribe) {
                        resolveSubscribe(createPushInfo(null, null));
                        resolveSubscribe = undefined;
                    }
                } else if (data.type === 'popup:denied') {
                    // log('User opened popup but permission is denied');
                    var info = createPushInfo(null, null);
                    info.permission = 'denied';
                    info.status = 'open-popup-denied';
                    utils.setPushInfo(info);
                }
            });
        }

        return api;
    });

    define('platform/webPush/api', ['require', 'fanplayr', 'platform/webPush/inlineApi', 'platform/webPush/popupApi'], function(require) {
        var fanplayr = require('fanplayr');
        var inlineApi = require('platform/webPush/inlineApi');
        var popupApi = require('platform/webPush/popupApi');

        var config = window.fanplayrServiceWorker;
        var popupDomain = config && typeof config === 'object' && config.domain;
        var api = popupDomain ? popupApi : inlineApi;

        fanplayr.serviceWorkerApi = api;

        return api;
    });

    define('platform/linkDecorator', ['require', 'platform/jquery', 'platform/config'], function(require) {
        var $ = require('platform/jquery');
        // var log = require('platform/log').create('platform:link-decorator');
        var Config = require('platform/config');

        var sessionKeyQueryRE = /fp_sk=_([^&]*)/;
        var _origWindowOpen = null;
        var _augmentRE = null;
        var _anchor = null;
        var _didInit = false;

        /**
         * @example
         * [{
         *   // Config only works on hostnames that match this pattern.
         *   "domainPattern": "slslasvegas\\.com",
         *   // Will only decorate links matching this pattern.
         *   "linkPattern": "slslasvegas\\.restrip\\.com",
         *   // Wrap `window.open()` and decorate the first argument.
         *   "windowOpen": true,
         *   // Decorate all anchors with hrefs matching the link pattern.
         *   "rewriteHrefs": false,
         *   // Decorate all forms with actions matching the link pattern.
         *   "rewriteForms": false,
         *   // Listen for all clicks on page and decorate the closest link.
         *   "monitorClicks": true,
         *   // Delay initialization by X milliseconds.
         *   "delay": 1000
         * }]
         */
        function init(configs) {
            if (_didInit) {
                return;
            }
            _didInit = true;
            // log('init', configs);
            var cfg = null;
            try {
                for (var i = 0, len = configs.length; i < len; i++) {
                    var item = configs[i];
                    var hostname = document.location.hostname;
                    var domainRe = new RegExp(item.domainPattern);
                    if (domainRe.test(hostname)) {
                        cfg = item;
                        break;
                    }
                }
            } catch (ex) {}
            Config.linkDecorator = cfg;
            if (cfg) {
                // log('found config', cfg);
                _anchor = document.createElement('a');
                setTimeout(function() {
                    try {
                        _augmentRE = new RegExp(cfg.linkPattern);
                        if (cfg.monitorClicks) {
                            listenForClicks();
                        }
                        if (cfg.rewriteHrefs) {
                            rewriteHrefs();
                        }
                        if (cfg.rewriteForms) {
                            rewriteForms();
                        }
                        if (cfg.windowOpen) {
                            wrapWindowOpen();
                        }
                    } catch (ex) {
                        // log('Error initializing click tracking', ex);
                    }
                }, cfg.delay || 0);
            }
        }

        function wrapWindowOpen() {
            if (!_origWindowOpen) {
                _origWindowOpen = window.open;
                // log('Wrapping window.open');
                // @ts-ignore
                window.open = function fanplayrWindowOpen() {
                    var args = Array.prototype.slice.call(arguments);
                    if (args.length > 0 && shouldDecorate(args[0])) {
                        args[0] = decorate(args[0]);
                    }
                    return _origWindowOpen.apply(window, args);
                };
            }
        }

        function listenForClicks() {
            // log('Listening for clicks');
            if (document.addEventListener) {
                var handler = function(event) {
                    var el = findClosestAnchor(event.target);
                    // log('capture', el, event.target);
                    if (el && el.nodeName === 'A') {
                        var href = el.href;
                        if (shouldDecorate(href)) {
                            // Augment link and allow default action to continue so that any
                            // additional tracking and/or `target` attributes are respected.
                            el.href = decorate(href);
                        } else {
                            // log('skip link', href);
                        }
                    }
                };
                document.addEventListener('click', handler, true);
                document.addEventListener('touchstart', handler, true);
            }
        }

        function rewriteHrefs() {
            // log('Rewriting hrefs');
            $('a[href]').each(function() {
                var $el = $(this);
                var href = $el.attr('href');
                if (shouldDecorate(href)) {
                    $el.attr('href', decorate(href));
                    // log('Rewrote "' + href + '" to "' + $el.attr('href') + '"');
                }
            });
        }

        function rewriteForms() {
            // log('Rewriting forms');
            $('form[action]').each(function() {
                var $el = $(this);
                var action = $el.attr('action');
                if (shouldDecorate(action)) {
                    $el.attr('action', decorate(action));
                    // log('Rewrote form action "' + decorate(action));
                }
            });
        }

        function shouldDecorate(url) {
            if (sessionKeyQueryRE.test(url)) {
                // log('Already augmented: ', url);
                return false;
            }
            try {
                var urlObj = parseUrl(url);
                var result = _augmentRE.test(urlObj.hostname);
                // log('shouldAgumentLink', url, result);
                return result;
            } catch (ex) {
                // log('Error shouldDecorate', ex);
            }
            return false;
        }

        function decorate(url) {
            if (typeof url === 'string') {
                var obj = parseUrl(url);
                var param = 'fp_sk=_' + Config.sessionKey;
                if (obj.search && obj.search.indexOf('?') === 0) {
                    obj.search += '&' + param;
                } else {
                    obj.search = '?' + param;
                }
                url = compileUrl(obj);
                // log('Augmented link: ', url);
            }
            return url;
        }

        function findClosestAnchor(node) {
            while (node) {
                if (node.nodeName === 'A') {
                    return node;
                }
                node = node.parentElement;
            }
        }

        function parseUrl(url) {
            _anchor.href = url;
            return {
                _url: url,
                hostname: _anchor.hostname,
                path: _anchor.path,
                search: _anchor.search
            };
        }

        function compileUrl(urlObj) {
            _anchor.href = urlObj._url;
            _anchor.hostname = urlObj.hostname;
            _anchor.path = urlObj.path;
            _anchor.search = urlObj.search;
            return _anchor.href;
        }

        function extractUrlInfo(url, source) {
            var sessionKeyMatch = /fp_sk=_([^&]+)/.exec(url);
            if (sessionKeyMatch) {
                var domainMatch = /fp_domain=([^&]+)/.exec(url);
                return {
                    source: source,
                    sessionKey: sessionKeyMatch[1],
                    storeDomain: domainMatch ? domainMatch[1] : null
                };
            }
        }

        function getInfo() {
            var info = extractUrlInfo(document.location.href, 'url');
            if (info) {
                return info;
            }
            info = extractUrlInfo(document.referrer, 'referrer');
            if (info) {
                return info;
            }
        }

        return {
            init: init,
            decorate: decorate,
            shouldDecorate: shouldDecorate,
            getInfo: getInfo
        };
    });

    define('platform/storageMode', ['require', 'fanplayr', 'platform/config'], function(require) {
        var fanplayr = require('fanplayr');
        var Config = require('platform/config');

        /**
         * Migration Mode:
         *
         * - Stop reading/writing user keys in the tunnel.
         * - Stop reading/writing the session key changed detection cookie in the tunnel.
         * - Start using localStorage on the store domain to detect session changes.
         * - Start migrating stash data stored in the tunnel to localStorage on the store domain.
         *  - Reading stash data:
         *    - If data exists in localStorage it is returned.
         *    - Otherwise:
         *      - It is read from the tunnel
         *      - Written to localStorage
         *      - Deleted from the tunnel
         *  - Writing stash data:
         *    - If data does not exist in localStoage, attempt to delete any data in the tunnel.
         *    - Write data to localStorage.
         */

        // Keep using the old tunnel
        var tunnelAccounts = {
            'a7a5ed9742367ddfc87a672f4f4f9907': true, // wakyo-shouten
        };

        // Migrate these from the tunnel to the store
        var migrateAccounts = {};

        var cachedAccountKey = null;

        function getStorageMode() {
            var accountKey = getAccountKey();
            if (tunnelAccounts[accountKey]) {
                // Always use tunnel
                return 'tunnel';
            }
            if (migrateAccounts[accountKey]) {
                // Always migrate
                return 'migrate';
            }
            // // Migrate or stop using tunnel altogether
            // if (shouldMigrate()) {
            //   // Migrate once since we have the cookie and it's missing the flag
            //   return 'migrate';
            // }
            // Already migrated or is a new user
            return 'store';
        }

        /**
         * The ConfigStash will always write `tm = 1` to the "fanplayr" cookie on
         * the store domain for accounts that use the "migrate" or "store" Storage Mode.
         *
         * We want to do a one-off migration for all visitors who have a fanplayr cookie
         * AND are missing the migration flag.
         *
         * Visitors without the cookie will be new users, so ignore them and don't migrate.
         */
        function shouldMigrate() {
            try {
                var match = /fanplayr=([^;]+)/.exec(document.cookie);
                if (match) {
                    var json = decodeURIComponent(match[1]);
                    if (json.indexOf('"tm":1') === -1) {
                        // Migrate since we have the cookie but it's missing the flag.
                        return true;
                    }
                }
            } catch (ex) {}
            return false;
        }

        function getAccountKey() {
            if (cachedAccountKey) {
                return cachedAccountKey;
            }
            var accountKey = Config.accountKey;
            if (!accountKey) {
                var order = window.fp_sales_orders;
                // @ts-ignore
                accountKey = order && order.accountKey;
            }
            if (!accountKey) {
                // Search in standard embed data.
                var embedData = fanplayr._i && fanplayr._i.length && fanplayr._i[0];
                accountKey = embedData && (embedData.accountKey || embedData.ak);
            }
            if (!accountKey) {
                // Search on standard custom adaptor before it finishes loading.
                accountKey =
                    fanplayr.adaptor &&
                    fanplayr.adaptor.config &&
                    fanplayr.adaptor.config.accountKey;
            }
            if (!accountKey) {
                // Search on very old zanox implementation.
                accountKey =
                    fanplayr.zanox &&
                    fanplayr.zanox.config &&
                    fanplayr.zanox.config.accountKey;
            }
            if (!accountKey && fanplayr.custom) {
                accountKey = fanplayr.custom.accountKey;
            }
            cachedAccountKey = accountKey || null;
            return cachedAccountKey;
        }
        // window.console.log('Fanplayr storageMode', getStorageMode());
        return getStorageMode();
    });
    define('platform/loader', ['require', 'fanplayr', 'platform/jquery', 'platform/utils'], function(require) {
        var fanplayr = require('fanplayr');
        var $ = require('platform/jquery');
        var _ = require('platform/utils');

        var loader = fanplayr.loader;
        var services = fanplayr.services = (fanplayr.services || {});

        var api = {
            load: function(name, callback) {
                require([loader.uri(name)], function() {
                    var baseName = name.split("/").pop();
                    var entry = name + "/" + baseName;
                    require([entry], function(obj) {
                        if (callback) {
                            callback(null, obj);
                        }
                        services[baseName] = obj;
                    });
                });
            },

            loadAdaptor: function(name, callback) {
                require([loader.uri("adaptors/" + name + "/latest/" + name + ".min.js")], function() {
                    require(["adaptors/" + name + "/index"], function(adaptor) {
                        if (callback) {
                            callback(adaptor);
                        }
                        fanplayr.adaptor = adaptor;
                    });
                });
            },

            getAssetsFor: function(resource) {
                return new Assets(loader.base(resource));
            },

            debug: loader.debug,

            adaptor: loader.adaptor,

            params: loader.params,

            uri: loader.uri,

            base: loader.base
        };

        var loaderPattern = /(?:d38nbbai6u794i|fanplayr).*?loader\.js(.*)/i;
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (loaderPattern.test(scripts[i].src)) {
                api.params = _.parseUrl(scripts[i].src).params;
                break;
            }
        }

        function Assets(basePath) {
            this.basePath = basePath;
        }

        Assets.prototype = {
            getUrl: function(file) {
                return /^(?:https?:)?\/\//.test(file) ? file : this.basePath + "/assets/" + file;
            },

            loadCss: function(file, options) {
                options = options || {};
                var html = '<link rel="stylesheet" type="text/css" href="' + this.getUrl(file) + '"';
                if (!options.doc) {
                    options.doc = document;
                }
                if (options.id) {
                    $("#" + options.id, options.doc).remove();
                    html += ' id="' + options.id + '" ';
                }
                html += ' />';
                $("head", options.doc).append(html);
            },

            inlineCss: function(id, content, options) {
                options = options || {};
                $("#" + id, options.doc).remove();
                $("head", options.doc).append('<style type="text/css" id="' + id + '">' + content + '</style>');
            }
        };

        return api;

    });

    define('platform/customWidget', ['require', 'fanplayr', 'platform', 'platform/utils', 'platform/afn', 'platform/loader', 'platform/log'], function(require) {
        /* globals Promise */
        var fanplayr = require('fanplayr');
        var platform = require('platform');
        var _ = require('platform/utils');
        var afn = require('platform/afn');
        var loader = require('platform/loader');
        var log = require('platform/log').create('platform:custom-widget');

        var supportsES6 = (function() {
            try {
                /* jslint evil: true */
                new Function("(a = 0) => a");
                return true;
            } catch (err) {
                return false;
            }
        }());

        /** @type {Record<number, Platform.Tracking.WidgetDetails>} */
        var detailMap = {};

        /** @type {Platform.Tracking.TrackPageResponseWidgetInfo} */
        var widgetInfo;

        /** @type {Promise<OfferService.Api>} */
        var offerServicePromise;

        /**
         * @param {Platform.Tracking.WidgetDetails} details
         * @param {Platform.Tracking.TrackPageResponseWidgetInfo} _widgetInfo
         */
        function load(details, _widgetInfo) {
            if (!supportsES6) {
                return;
            }
            detailMap[details.id] = details;
            widgetInfo = _widgetInfo;
            var script = document.createElement('script');
            script.src = details.url;
            script.setAttribute('data-fp-custom-widget-id', String(details.id));
            document.body.appendChild(script);
        }

        fanplayr.createWidget = function(def) {
            var details = detailMap[def.id];
            if (!details) {
                log('no details for widget', def.id);
                return;
            }
            getOfferService().then(function(offerService) {
                /** @type {Platform.CustomWidget.Context} */
                var context = {
                    details: details,
                    config: details.data,
                    trackAfn: function(options) {
                        afn.track(options);
                    },
                    trackAction: function(options) {
                        platform.trackEvent({
                            type: 'widget',
                            subType: options.type + 'Action',
                            data: _.merge({
                                widgetId: details.id,
                                widgetName: details.name,
                                component: options.name
                            }, options.data || {})
                        });
                    },
                    trackDisplay: function() {
                        platform.trackEvent({
                            type: 'widget',
                            subType: 'view',
                            data: {
                                widgetId: details.id,
                                widgetName: details.name
                            }
                        });
                    },
                    trackRecommendation: function(event) {
                        if (event.type === 'display') {
                            platform.trackEvent({
                                type: 'productRec',
                                subType: 'recommend',
                                data: {
                                    widgetId: details.id,
                                    widgetName: details.name,
                                    productDisplayId: event.display.id,
                                    modelType: event.display.modelType,
                                    token: event.token,
                                    productIds: event.productIds
                                }
                            });
                        } else {
                            platform.trackEvent({
                                type: 'productRec',
                                subType: 'click',
                                data: {
                                    widgetId: details.id,
                                    widgetName: details.name,
                                    productDisplayId: event.display.id,
                                    modelType: event.display.modelType,
                                    productId: event.product.id,
                                    productGroupId: event.product.groupId,
                                    token: event.token
                                }
                            });
                        }
                    }
                };
                var widgetInfoData = widgetInfo.data;
                if (details.offerId) {
                    if (widgetInfoData.offer && widgetInfoData.offer.id === details.offerId) {
                        context.offer = wrapOffer(widgetInfoData.offer, offerService);
                    } else if (widgetInfoData.exitOffer && widgetInfoData.exitOffer.id === details.offerId) {
                        context.offer = wrapOffer(widgetInfoData.exitOffer, offerService);
                    }
                }
                def.create(context);
            });
        };

        /**
         * @returns {Promise<OfferService.Api>}
         */
        function getOfferService() {
            if (!offerServicePromise) {
                offerServicePromise = new Promise(function(resolve) {
                    loader.load('services/offers', function(err, service) {
                        if (service) {
                            resolve(service);
                        }
                    });
                });
            }
            return offerServicePromise;
        }

        /**
         * @param {Platform.Tracking.Offer} offer
         * @param {OfferService.Api} service
         * @returns {Platform.CustomWidget.Offer}
         */
        function wrapOffer(offer, service) {
            var inst = new service.Offer();
            inst.code = offer.code || '';
            inst.realCode = inst.code;
            inst.tempCode = offer.tempCode || '';
            if (inst.tempCode) {
                inst.code = inst.tempCode;
            }
            inst.loadState();
            return {
                id: offer.id,
                code: inst.code,
                conditions: offer.conditions || '',
                text: offer.text,
                minimumPurchase: offer.minimumPurchase ?
                    String(offer.minimumPurchase) :
                    '',
                isCollected: inst.hasCollected,
                isControlGroup: offer.isControlGroup,
                collect: function() {
                    return new Promise(function(resolve, reject) {
                        inst.collect(function(err, res) {
                            if (err) {
                                reject();
                            } else {
                                resolve();
                            }
                        });
                    });
                },
                applyToCart: function() {
                    inst.applyToCart();
                }
            };
        }

        return {
            load: load
        };
    });
    define('platform/identityManager', ['require', 'platform/utils', 'platform/dataApi', 'platform/json', 'platform/legacy'], function(require) {
        var _ = require('platform/utils');
        var dataApi = require('platform/dataApi');
        var JSON = require('platform/json');
        var Legacy = require('platform/legacy');
        // var log = require('platform/log').create('platform:identity-manager');

        /**
         * @param {Platform.IdentityManager.IdentityMap[]} maps
         */
        function mergeIdentityMaps(maps) {
            /** @type {Platform.IdentityManager.IdentityMap} */
            var result = {};
            _.forEach(maps, function(map) {
                _.forEach(map, function(item, key) {
                    var existingItem = result[key];
                    if (existingItem && item) {
                        existingItem.userId = item.userId;
                        existingItem.isTransient = item.isTransient;
                        existingItem.data = _.mergeDeep({},
                            existingItem.data || {},
                            item.data || {}
                        );
                    } else {
                        result[key] = item;
                    }
                });
            });
            return result;
        }

        /** @type {Platform.IdentityManager.IdentityMap} */
        var identityMap = {};

        var storageKey = 'fpIdentityMap';

        function load() {
            try {
                var json = sessionStorage.getItem(storageKey);
                if (json) {
                    var map = JSON.parse(json);
                    // log('load storage:', JSON.stringify(map));
                    identityMap = mergeIdentityMaps([identityMap, map]);
                    // log('load storage merged:', JSON.stringify(identityMap));
                }
                dataApi.getByType('identities').forEach(function(entry) {
                    // log('load data api:', JSON.stringify(entry));
                    identityMap = mergeIdentityMaps([identityMap, entry]);
                    // log('load data api merged:', JSON.stringify(identityMap));
                });
                var embedData = Legacy.getEmbedData();
                if (embedData && embedData.identities) {
                    // log('load embed:', JSON.stringify(embedData.identities));
                    identityMap = mergeIdentityMaps([identityMap, embedData.identities]);
                    // log('load embed merged:', JSON.stringify(identityMap));
                }
            } catch (ex) {}
        }

        function init() {
            // Watch for existing and new API calls to maintain a final identity map
            // which is persisted between page views.
            dataApi.watch(function(type, entry) {
                try {
                    if (type === 'identities') {
                        // log('append data api:', JSON.stringify(entry));
                        identityMap = mergeIdentityMaps([identityMap, entry]);
                        // log('append data api merged:', JSON.stringify(identityMap));
                        sessionStorage.setItem(storageKey, JSON.stringify(identityMap));
                        // log('save storage');
                    }
                } catch (ex) {}
            });
        }

        init();

        return {
            // Expose API to clear stored map so that it can be removed after page
            // tracking.
            clear: function() {
                try {
                    identityMap = {};
                    sessionStorage.removeItem(storageKey);
                    // log('clear');
                } catch (ex) {}
            },
            load: load,
            getMap: function() {
                return identityMap;
            }
        };
    });
    // This module should not require anything other than `platform/utils` and
    // `platform/log` so that it can be available to import in most other modules
    // without causing circular dependency issues.
    define('platform/cdp', ['require', 'platform/utils'], function(require) {
        var _ = require('platform/utils');
        // var log = require('platform/log').create('platform/cdp');
        var fp360 = window.fp360;
        var config = getConfig();

        /**
         * @returns {Platform.Cdp.Config}
         */
        function getConfig() {
            var config = _.get(window, 'fanplayr._i[0].cdp');
            if (!config) {
                config = _.get(window, 'fanplayr.cdp');
            }
            if (!config) {
                config = _.get(window, 'fp_sales_orders.cdp');
            }
            if (!_.isPlainObject(config)) {
                config = {};
            }
            return config;
        }

        /** @type {Platform.Cdp.Api} */
        var api = {
            setVersion: function(version) {
                if (version) {
                    config.enabled = true;
                }
            },
            setUserId: function(userId) {
                if (fp360 && config.enabled) {
                    fp360.setUserId(userId);
                }
            },
            setSessionId: function(sessionId) {
                if (fp360 && config.enabled) {
                    fp360.setSessionId(sessionId);
                }
            },
            setPageId: function(pageId) {
                if (fp360 && config.enabled) {
                    if (fp360.setPageId) {
                        fp360.setPageId(pageId);
                    }
                }
            }
        };
        return api;
    });

    define('platform/widgetApp', ['require', 'platform/json', 'platform/utils', 'platform/log', 'platform/productRecApi'], function(require) {
        /* globals fetch, Promise */

        var JSON = require('platform/json');
        var _ = require('platform/utils');
        var log = require('platform/log').create('platform:widget-app');
        var productRecApi = require('platform/productRecApi');

        /**
         * The ID of the current widget being previewed, if any. This will likely be
         * of the form `{number}_draft`.
         * @type {string | undefined}
         */
        var _previewWidgetId;

        /**
         * @type {Platform.WidgetApp.AppInstance[]}
         */
        var activeInstances = [];

        /** @type {Platform.WidgetApp.Api} */
        var api = {
            process: function(apps) {
                if (!Array.isArray(apps)) {
                    apps = [];
                }
                var testAppsJson = localStorage.getItem('fp_test_widget_apps');
                if (testAppsJson) {
                    /** @type {Platform.WidgetApp.PublishedApp[]} */
                    var testApps = JSON.parse(testAppsJson);
                    log('DEBUG -- Replacing (' + apps.length + ') apps with test apps', testApps);
                    apps = testApps;
                }

                // This `process()` method is called after page tracking occurs and we
                // should remove any existing app instances to avoid duplicate apps being
                // created.
                activeInstances.forEach(function(instance) {
                    instance.remove();
                });

                // Reset state
                _previewWidgetId = undefined;
                activeInstances = [];

                handlePreview();

                apps.forEach(function(app) {
                    processApp(app).catch(function(reason) {
                        log('App not processed:', reason);
                    });
                });
            }
        };

        /**
         * @returns {Promise<void>}
         */
        function handlePreview() {
            return new Promise(function(resolve) {
                var match = /fp_app_preview=([^&]+)/.exec(location.href);
                if (!match) {
                    return resolve();
                }
                /** @type {Platform.WidgetApp.PreviewConfig} */
                var previewConfig = JSON.parse(decodeURIComponent(match[1]));
                if (previewConfig) {
                    _previewWidgetId = String(previewConfig.id);
                    var definitionUrl = new URL(previewConfig.definitionUrl);
                    var validHostnameRE = /^(cdn.fanplayr.com|fanplayr.s3.us-east-1.amazonaws.com)$/;
                    if (!validHostnameRE.test(definitionUrl.hostname)) {
                        log('Preview definition URL uses invalid hostname', definitionUrl.hostname);
                        return resolve();
                    }
                    var basenameMatch = /\/([^\/]+)\.json$/.exec(previewConfig.definitionUrl);
                    if (!basenameMatch) {
                        log('Failed to match preview file basename for ' + JSON.stringify(previewConfig.definitionUrl));
                        return resolve();
                    }
                    var widgetId = getBaseWidgetId(basenameMatch[1]);
                    return loadDefinition(previewConfig.definitionUrl).then(function(definition) {
                        log('[app:%s] Preview definition', widgetId, definition);
                        /** @type {Platform.WidgetApp.PublishedApp} */
                        var app = {
                            id: widgetId,
                            type: definition.app,
                            appUrl: definition.uri,
                            definitionUrl: previewConfig.definitionUrl,
                            // Create a copy of the widget level config and override its
                            // displayUrl to "*" so the preview works on any page.
                            config: _.merge({},
                                _.get(definition, 'widgetLevelConfig') || {}, {
                                    displayUrl: '*'
                                }
                            )
                        };
                        return processApp(app, {
                            isPreview: true
                        });
                    }).catch(function(error) {
                        log('[app:%s] Failed to load preview', widgetId, error);
                    });
                } else {
                    resolve();
                }
            });
        }

        /**
         *
         * @param {Platform.WidgetApp.PublishedApp} app
         * @param {object} [opts]
         * @param {boolean} [opts.isPreview]
         * @returns {Promise<void>}
         */
        function processApp(app, opts) {
            log('[app:%s] Processing', app.id, app);
            var isPreview = opts && opts.isPreview || false;
            if (_previewWidgetId && !opts && !isPreview && getBaseWidgetId(app.id) === getBaseWidgetId(_previewWidgetId)) {
                return Promise.reject('Skip published app as it is also being previewed');
            }
            var displayUrl = app.config.displayUrl || app.config.embedUrl;
            if (!displayUrl) {
                log('[app:%s] Missing display URL', app.id);
                return Promise.reject('Missing display URL');
            }
            var matchesPage = matchUserPattern(displayUrl, location.href);
            if (!matchesPage) {
                // Doesn't match current page.
                log('[app:%s] Display URL not matched', app.id);
                return Promise.resolve();
            }
            var isEmbedded = (
                app.config.displayType === 'embedded' ||
                // Fallback for Personal Shopper app which doesn't set this property
                app.config.displayType === undefined
            );
            /** @type {HTMLElement | null} */
            var containerEl = document.body;
            if (isEmbedded) {
                if (!app.config.embedSelector) {
                    return Promise.reject('No embed selector');
                }
                containerEl = document.querySelector(app.config.embedSelector);
                if (!containerEl) {
                    return Promise.reject('No element found for embed selector ' + JSON.stringify(app.config.embedSelector));
                }
            }
            var projectInfo = productRecApi.getProjectInfo();
            var merchandisingProjectId = projectInfo ? projectInfo.projectId : null;
            return Promise.all([
                loadEsmModule(app.appUrl),
                loadDefinition(app.definitionUrl)
            ]).then(function(values) {
                var module = values[0];
                var definition = values[1];
                var Widget = module.Widget;
                /** @type {Platform.WidgetApp.AppInstance} */
                var widget = new Widget({
                    state: definition,
                    context: {
                        appId: app.id,
                        appType: app.type,
                        appName: app.name,
                        isPreview: isPreview,
                        merchandisingProjectId: merchandisingProjectId
                    }
                });
                widget.addEventListener('close', function(event) {
                    // Remove the instance
                    activeInstances = activeInstances.filter(function(instance) {
                        return instance !== widget;
                    });
                    widget.remove();
                });
                widget._isPreview = isPreview;
                activeInstances.push(widget);
                if (!containerEl) {
                    log('[app:%s] Missing container element', app.id);
                    return Promise.reject('Missing container element');
                }
                containerEl.appendChild(widget);
            });
        }

        /**
         * Loads an ESM module and returns all exported properties.
         * @param {string} url
         * @returns {Promise<any>}
         */
        function loadEsmModule(url) {
            var resolveId = 'fp_app_resolver_' + Math.random().toString(16).slice(2);
            return new Promise(function(resolve, reject) {
                window[resolveId] = resolve;
                var script = document.createElement('script');
                script.type = 'module';
                script.textContent = [
                    'import * as module from "' + url + '";',
                    'window.' + resolveId + '(module);'
                ].join('\n');
                document.body.appendChild(script);
            }).then(function(module) {
                delete window[resolveId];
                return module;
            }).catch(function(error) {
                log('Failed to load ESM module:', error);
                return new Error('Failed to load ESM module: ' + String(error));
            });
        }

        /**
         * Loads the app JSON definition.
         * @param {string} url
         * @returns {Promise<Platform.WidgetApp.Definition>}
         */
        function loadDefinition(url) {
            log('Load definition', url);
            return fetch(url, {
                mode: 'cors'
            }).then(function(res) {
                return res.json();
            }).then(function(data) {
                return data;
            });
        }

        /**
         * Creates a regular expression that uses `*` as wildcards to match any
         * character.
         * @param {string} userPattern
         */
        function createRegExpFromPattern(userPattern) {
            var pattern = userPattern
                .replace(/([\^\$\.\+\?\(\)\[\]\{\}|])/g, '\\$1')
                .replace(/\*/g, '.*');
            var regExp = new RegExp('^' + pattern + '$');
            return regExp;
        }

        /**
         * Splits the user pattern list by commas and attempts to match each pattern
         * against the input.
         * @param {string} userPatternList
         * @param {string} input
         */
        function matchUserPattern(userPatternList, input) {
            var list = userPatternList.trim().split(/\s*,\s*/);
            for (var i = 0, len = list.length; i < len; i++) {
                var userPattern = list[i];
                var regExp = createRegExpFromPattern(userPattern);
                if (regExp.test(input)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Published widget IDs are possibly in the form of `{Base ID}_{Timestamp}`
         * and draft widget IDs are in the form of `{Base ID}_draft`. This function
         * extracts the prefixed base ID.
         *
         * @param {string | number} id Widget ID
         * @returns {number}
         */
        function getBaseWidgetId(id) {
            return parseInt(String(id).split('_')[0], 10);
        }

        return api;
    });

    define('platform/tracking', ['require', 'fanplayr', 'platform/utils', 'platform/jquery', 'platform/afn', 'platform/capabilities', 'platform/config', 'platform/cookie', 'platform/json', 'platform/state', 'platform/dataApi', 'platform/productRecApi', 'platform/webPush/api', 'platform/legacy', 'platform/linkDecorator', 'platform/log', 'platform/storageMode', 'platform/customWidget', 'platform/identityManager', 'platform/cdp', 'platform/widgetApp'], function(require) {
        var fanplayr = require('fanplayr');
        var _ = require('platform/utils');
        var $ = require('platform/jquery');
        var AFN = require('platform/afn');
        var capabilities = require('platform/capabilities');
        var Config = require('platform/config');
        var Cookie = require('platform/cookie');
        var JSON = require('platform/json');
        var state = require('platform/state');
        var dataApi = require('platform/dataApi');
        var productRecApi = require('platform/productRecApi');
        var webPush = require('platform/webPush/api');
        var Legacy = require('platform/legacy');
        var linkDecorator = require('platform/linkDecorator');
        var log = require('platform/log').create('platform:tracking');
        var STORAGE_MODE = require('platform/storageMode');
        var customWidget = require('platform/customWidget');
        var identityManager = require('platform/identityManager');
        var cdp = require('platform/cdp');
        var widgetApp = require('platform/widgetApp');
        /* jshint unused:false */

        var platform;

        /**
         * Session Storage key name for the timestamp of the most recent page tracking
         * response. This is used in combination with `lastPageTrackResTimestamp` to
         * detect if the current page is the most recent page view.
         * @type {string}
         */
        var PAGE_TRACK_RESPONSE_TIMESTAMP = 'fppts';

        /**
         * @type {'fp_next_page_events'}
         * Local Storage key for array of events to track on next page view.
         */
        var NextPageEventKey = 'fp_next_page_events';

        /**
         * @typedef NextPageEventsQueue
         * @property {string} sessionKey The session key these events belong to.
         * @property {Record<string, any>[]} events The queue.
         */

        /**
         * The current AB group for the page view.
         * @type {Platform.AbGroup}
         */
        var currentAbGroup = null;
        /**
         * The AB group the session should be placed in if the platform attempts to
         * show an AB-tested action.
         * @type {Platform.AbGroup}
         */
        var pendingAbGroup = null;

        /**
         * The timestamp of the most recent page tracking response.
         * @type {number}
         */
        var lastPageTrackResTimestamp = 0;

        /**
         * Used in v4 segmentation to denote the number of new offers that can be
         * presented for the page view. This includes both instant and latent
         * offers.
         */
        var availableOfferSlots = 0;

        /**
         * Determines how many actions can be triggered for the page view.
         *  - If this value is greater than -1 it represents the remaining number of
         *    actions that can be triggered for this page view.
         *  - When this value is greater than zero, the next action can be triggered
         *    and the value is decremented.
         *  - When the value is -1, an unlimited number of actions can be triggered.
         * @type {number}
         */
        var availableActionSlots = -1;

        /**
         * Keeps track of which offers have been locally allocated to offer slots.
         *
         * - This will include any offers which have been presented on previous page
         *   views.
         *
         * - It will also include any offers for widgets that have been shown,
         *   REGARDLESS of whether the offer was fully marked as presented.
         *
         * This array is used to prevent too many offer widgets from being displayed
         * as there is a limited number of offer slots (max 3 per session). An offer
         * ID being in this array does not mean the offer has been presented.
         */
        var consumedOfferIds = [];

        /**
         * Handles page and order tracking.
         *
         * @namespace tracking
         */

        /**
         * Emitted after successfully tracking a page. The object is the raw response from the server.
         *
         * @event tracking#track:page
         * @type {Object}
         */

        /**
         * Emitted before sending the page tracking request to the server. The object is the request object
         * that will be passed to `jQuery.ajax`.
         *
         * @event tracking#track:page:before
         * @type {Object}
         */

        /**
         * Emitted after successfully tracking an order. The object is the raw response from the server.
         *
         * @event tracking#track:order
         * @type {Object}
         */

        /**
         * Emitted before sending the order tracking request to the server. The object is the request object
         * that will be passed to `jQuery.ajax`.
         *
         * @event tracking#track:order:before
         * @type {Object}
         */

        /**
         * Emitted when the user attempts to apply an offer to the cart.
         *
         * @memberof tracking#
         * @event offer:apply
         * @see capabilities~ApplyToCartEvent
         */

        /**
         * Uses the {@link state} to track the current page.
         *
         * @memberof tracking.prototype
         * @function trackPage
         * @param {Function} [callback] - Node style callback `callback(err, rawTrackResponse, rawOfferResponse)` that will be invoked
         *   after the page has been tracked or if an error occured.
         *
         * @fires tracking#track:page:before
         * @fires tracking#track:page
         *
         * @example
         * platform.trackPage(function(err) {
         *   if (err) {
         *     // There was an error tracking the page.
         *   }
         * });
         *
         * platform.on('track:page', function(res) {
         *   // `res` is the response from tracking a page.
         * });
         */
        function trackPage(callback) {
            if (!Config.accountKey) {
                if (callback) {
                    callback('Missing accountKey');
                }
                return;
            }

            var userKey = Config.userKey;
            if (!userKey || userKey === 'undefined') {
                userKey = '0';
            }

            var sessionKey = Config.sessionKey;
            if (!sessionKey || sessionKey === 'undefined') {
                sessionKey = '0';
            }

            var pageId = _.uuid();
            cdp.setPageId(pageId);

            productRecApi.processPageView();
            identityManager.load();
            var data = {
                a: 'init',
                uuid: Config.uuid,
                user: userKey,
                session: sessionKey,
                url: state.page.url || window.location.href,
                store_domain: Config.storeDomain || '',
                tz: new Date().getTimezoneOffset(),
                account: Config.accountKey,
                store_data: getStoreData(),
                custom_data: buildCustomDataParam(state.page.data),
                invocation: 0,
                ref: document.referrer,
                log_only: 0,
                browser_language: window.navigator && window.navigator.language,
                widget_language: Config.language || '',
                push: webPush.isSupported() ? JSON.stringify(Config.pushInfo) : '',
                swv: webPush.version,
                gacid: getGaClientId(),
                pid: Config.privacyIdUserKey,
                page_id: pageId,
                idmap: JSON.stringify(identityManager.getMap()),
                lv: fanplayr._loaderVersion,
                uc_mode: getBoolFlag(Config.userConsentMode),
                uc_status: getBoolFlag(Config.userConsentStatus)
            };
            if (Config.allowNegativeCurrencyAmounts) {
                data.allowNegativeCurrencyAmounts = 1;
            }
            identityManager.clear();

            var adaptorVersion = getAdaptorVersion();
            if (adaptorVersion) {
                data.adaptor = adaptorVersion;
            }

            platform.emit('track:page:before', [data]);

            $.ajax({
                url: '//' + Config.sessionEndpoint + '/external.Genius/',
                data: data,
                dataType: 'jsonp',
                // timeout: 15000,
                complete: function() {
                    log('Track complete');
                },
                /**
                 * @param {Platform.Tracking.TrackPageResponse} res
                 * @returns
                 */
                success: function(res) {
                    if (res.error) {
                        // 2017-09-11 Exit, most likely error is that this is an invalid
                        // domain for the account. In this case there will be no user key.
                        return;
                    }

                    // Store the timestamp of the lastest tracking resposne so we can detect
                    // which browser tab represents the current page view.
                    lastPageTrackResTimestamp = Date.now();
                    localStorage.setItem(PAGE_TRACK_RESPONSE_TIMESTAMP, String(lastPageTrackResTimestamp));

                    var userKey = res.user_key;
                    var sessionKey = res.session_key;
                    var sessionEndpoint = res.region;
                    var didChangeSession = Config.sessionKey !== sessionKey;

                    var shouldBustUserKey = false;
                    if (Config.userKey && Config.userKey !== userKey) {
                        shouldBustUserKey = true;
                    }

                    if (Config.userKey !== userKey) {
                        log('Update userKey from %o to %o', Config.userKey, userKey);
                        Config.userKey = userKey;
                    }
                    if (Config.sessionKey !== sessionKey) {
                        log('Update sessionKey from %o to %o', Config.sessionKey, sessionKey);
                        Config.sessionKey = sessionKey;
                    }
                    cdp.setVersion(_.get(res, 'cdp.version'));
                    cdp.setUserId(userKey);
                    cdp.setSessionId(sessionKey);

                    Config.campaignKey = res.campaign_key;
                    Config.webPushPublicKey = res.webPushPublicKey;
                    Config.webPushPopup = res.webPushPopup;
                    Config.webPushResubscribe = res.webPushResubscribe;
                    Config.accountTimeZoneOffsetMs = res.accountTimeZoneOffsetMs;
                    Config.pageIndex = res.pageIndex;

                    if (res.cart) {
                        productRecApi.processServerCart(res.cart);
                    }

                    if (webPush.isSupported() && res.webPushPublicKey) {
                        webPush.upgradeSubscription(res.webPushPublicKey).catch(function(err) {
                            // Ignore if upgrade fails.
                        });
                    }

                    if (sessionEndpoint) {
                        Config.sessionEndpoint = sessionEndpoint;
                    }
                    if (res.widgetDisplayCounts) {
                        Config.setWidgetDisplayCounts(res.widgetDisplayCounts);
                    }

                    if (res.afn_tracking) {
                        AFN.track(res.afn_tracking);
                    }

                    var linkAugmentConfig = res.linkAugmentConfig;
                    if (linkAugmentConfig) {
                        linkDecorator.init(linkAugmentConfig);
                    }

                    if (res.productRecProjectId) {
                        productRecApi.setProjectInfo({
                            projectId: res.productRecProjectId,
                            accountCurrencyCode: res.accountCurrencyCode,
                            placements: res.productRecPlacements || [],
                            displays: res.productDisplays || [],
                            version: res.productRecVersion
                        });
                    }

                    if (res.revoked_offer_ids && res.revoked_offer_ids.length) {
                        // The user has fallen into a segment that revokes one or
                        // more offers ids. Emit this data so that the offer states
                        // can be updated and widget hidden if there are no more
                        // offers.
                        platform.emit('offers:revoke', [{
                            ids: res.revoked_offer_ids,
                            hideWidget: res.revoke_widget
                        }]);
                    }

                    availableOfferSlots = res.availableOfferSlots || 0;
                    availableActionSlots = res.availableActionSlots || -1;
                    consumedOfferIds = (res.presentedOfferIds || []).slice(0);
                    currentAbGroup = res.abGroup || null;
                    pendingAbGroup = res.pendingAbGroup || null;

                    Config.save();

                    if (shouldBustUserKey && STORAGE_MODE !== 'store') {
                        setTimeout(bustTunnelUserKey, 2000);
                    }

                    platform.emit('track', [res]);
                    platform.emit('track:page', [res]);

                    var trackCallbacks = dataApi.getByType('onPageView');
                    if (trackCallbacks.length) {
                        var event = {
                            segments: res.segment_tags || []
                        };
                        _.each(trackCallbacks, function(data) {
                            if (data.callback) {
                                data.callback(event);
                            }
                        });
                    }

                    var fanplayr = window.fanplayr;
                    var widget = fanplayr && fanplayr.widget;
                    if (typeof widget === 'object') {
                        if (typeof widget.onLogVisit === 'function') {
                            widget.onLogVisit(res);
                        }
                    }

                    if (res.exitIntent && canEmitOffer('exit-intent', res.exitIntent)) {
                        platform.emit('exitIntent', [res.exitIntent]);
                    }

                    if (res.widget && res.widget.details) {
                        handleWidgets(res.widget, res.apiVersion);
                    } else {
                        handleLegacyWidgetData(res.widget);
                    }
                    trackAndWatchCustomUserData();
                    flushNextPageEvents();
                    widgetApp.process(res.apps);

                    // Trigger the "widgets:processed" event immedialty if there are no
                    // widgets to process for this page view. This event is relied on by
                    // other modules such as SiteSpeed to defer metric tracking until
                    // critical resources have loaded.
                    var widgetCount = _.get(res, 'widget.urls.length', 0);
                    if (!widgetCount) {
                        platform.emit('widgets:processed');
                    }

                    // For legacy offer & exit-intent widgets only.
                    if (res.has_offer && res.widget_url) {
                        var widgetUrlParams = {};
                        res.widget_url.replace(/([^?&=]+)=([^&]+)/g, function(line, key, value) {
                            widgetUrlParams[key] = value;
                            return '';
                        });

                        // Config.campaignKey = widgetUrlParams.campaign;

                        $.ajax({
                            url: res.widget_url,
                            dataType: 'jsonp',
                            // timeout: 15000,
                            success: function(offerRes) {
                                if (canEmitOffer('offer', offerRes)) {
                                    platform.emit('offer', [offerRes]);
                                }

                                if (callback) {
                                    callback(null, res, offerRes);
                                }
                            },
                            error: function() {
                                log('offer failed');
                                if (callback) {
                                    callback('offer failed');
                                }
                            }
                        });
                    } else {
                        if (callback) {
                            callback(null, res);
                        }
                    }

                    if (didChangeSession) {
                        platform.emit('newSession');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    log('Track failed', JSON.stringify(textStatus), JSON.stringify(errorThrown));
                    if (callback) {
                        callback('track failed');
                    }
                }
            });
        }

        /**
         * Gets a tracking flag for boolean values.
         * @param {boolean | undefined} value
         * @returns {'1' | '0' | undefined}
         */
        function getBoolFlag(value) {
            if (value === undefined) {
                return undefined;
            }
            return value ? '1' : '0';
        }

        function bustTunnelUserKey() {
            // jshint -W024
            try {
                window.fetch('https://e1.fanplayr.com/services/xds/init.js', {
                    cache: 'reload',
                    credentials: 'include'
                }).catch(function(err) {
                    log('Caught error busting user key', err);
                });
            } catch (ex) {
                log('Error busting user key', ex);
            }
        }

        /**
         * @param {Platform.Tracking.TrackPageResponseWidgetInfo} widgetInfo
         * @param {number} apiVersion
         */
        function handleWidgets(widgetInfo, apiVersion) {
            var details = widgetInfo.details;
            if (!details) {
                return;
            }
            /** @type {Platform.Tracking.WidgetDetails[]} */
            var normalWidgets = [];
            _.forEach(details, function(def) {
                if (def.type === 'custom') {
                    customWidget.load(def, widgetInfo);
                } else {
                    normalWidgets.push(def);
                }
            });
            if (normalWidgets.length) {
                platform.emit('runtime', [{
                    urls: widgetInfo.urls,
                    widgets: normalWidgets,
                    data: widgetInfo.data,
                    apiVersion: apiVersion || 1
                }]);
            }
        }

        function handleLegacyWidgetData(widgetRes) {
            if (widgetRes && _.isArray(widgetRes.urls)) {
                var v1 = _.clone(widgetRes, true);
                var v2 = _.clone(widgetRes, true);
                v1.urls = [];
                v2.urls = [];
                _.each(widgetRes.urls, function(url) {
                    if (url.indexOf('/v2/') > 0) {
                        v2.urls.push(url);
                    } else {
                        v1.urls.push(url);
                    }
                });
                if (v1.urls.length) {
                    platform.emit('widget', [v1]);
                }
                if (v2.urls.length) {
                    platform.emit('runtime', [v2]);
                }
            }
        }

        function trackAndWatchCustomUserData() {
            dataApi.watch(function(type, entry) {
                if (
                    type === 'user.set' ||
                    type === 'user.setOnce' ||
                    type === 'user.increment' ||
                    type === 'user.unset'
                ) {
                    var subType = type.replace('user.', '');
                    var data = _.merge({}, entry);
                    var event = {
                        type: 'userDataOp',
                        subType: subType,
                        data: data
                    };
                    // Convert any Date instance to its ISO string equivalent.
                    if (data.value instanceof Date) {
                        data.value = data.value.toISOString();
                    }
                    platform.trackEvent(event);
                }
            }, {
                existing: true
            });
        }

        function canEmitOffer(type, data) {
            var beforeEmitOffer = capabilities.beforeEmitOffer;
            if (typeof beforeEmitOffer === 'function') {
                return beforeEmitOffer(type, data);
            }
            return true;
        }

        function getStoreData() {
            var embedData = Legacy.getEmbedData();
            if (embedData && typeof embedData.data === 'string') {
                return embedData.data;
            }

            var data = {};

            var user = state.user;
            var page = state.page;
            var cart = state.cart;

            data.shopType = Config.shopType || 'custom';

            /////////////////////////////////////////////
            // User

            data.customerEmail = user.email;
            data.customerId = user.id;
            data.customerGroup = user.group;
            data.customerSegment = user.segment;

            /////////////////////////////////////////////
            // Page

            data.pageType = page.type;
            data.searchQuery = page.searchQuery;

            var pageCats = page.categories.toArray();
            if (pageCats.length) {
                // TODO: Remove in future
                data.categoryId = _.map(pageCats, function(category) {
                    return category.id;
                }).join(',');
                // TODO: Remove in future
                data.categoryName = _.map(pageCats, function(category) {
                    return category.name;
                }).join(',');
                data.categories = JSON.stringify(page.categories.toFlatArray());
            }

            if (page.brands && page.brands.length) {
                data.brands = JSON.stringify(page.brands);
            }

            if (page.product) {
                data.productId = page.product.id;
                data.productName = page.product.name;
                data.productUrl = page.product.url;
                data.productImage = page.product.image;
                data.productSku = page.product.sku;
                data.productPrice = page.product.price;
            }

            /////////////////////////////////////////////
            // Cart

            data.lineItemCount = cart.lineItemCount;
            data.numItems = cart.totalQuantity;
            data.couponCode = cart.discountCode;
            data.discount = parseNumber(cart.discount, 0);
            data.total = parseNumber(cart.gross, 0) - parseNumber(cart.discount, 0);
            data.currency = cart.currency;

            if (cart.products.length) {
                // The page tracking URL encodes `products` TWICE so we need to use a
                // lower threshold than in order tracking.
                data.products = JSON.stringify(denormalizeProducts(cart.products, 4500));
            }

            data.repeatCart = cart.repeat;
            data.cartAction = cart.cartAction;
            data.repeatCustomData = state.page.repeatCustomData ? 1 : 0;

            data.quoteId = cart.quoteId;

            // Build parameter string.

            var params = [];
            var prop, value;
            for (prop in data) {
                value = data[prop];
                if (value !== null && typeof value !== 'undefined') {
                    params.push(
                        encodeURIComponent(prop) +
                        '=' +
                        encodeURIComponent(trimDeburr(value))
                    );
                }
            }

            params.push('custom=1');
            params.push('version=3');

            return params.join('&');
        }

        function parseNumber(value, defaultValue) {
            var val = parseFloat(value);
            return isNaN(val) ? defaultValue : val;
        }

        function buildCustomDataParam(obj) {
            var params = [];
            if (obj) {
                for (var prop in obj) {
                    var value = trimDeburr(obj[prop]);
                    if (
                        value === undefined ||
                        value === null ||
                        (typeof value === 'string' && !value)
                    ) {
                        continue;
                    }
                    params.push(encodeURIComponent(prop) + '=' + encodeURIComponent(value));
                }
            }
            return params.join('&');
        }

        /**
         * Transforms an array of normalized Product objects to the original format
         * that is expected on the server.
         * @param {Platform.State.Product[] | Platform.State.ProductList} products An
         * array of Products.
         * @param {number} maxChars The character limit to use as a threshold for
         * discarding non-essential product properties in order to save URL length.
         * @returns object[]
         */
        function denormalizeProducts(products, maxChars) {
            var list = [];

            _.each(products, function(product) {
                var cats = product.categories.toArray();
                var flatCats = _.map(product.categories.toFlatArray(), function(cat) {
                    return trimDeburr(cat);
                });
                var item = {
                    id: trimDeburr(product.id),
                    qty: (typeof product.quantity === 'number') ? product.quantity : 1,
                    name: trimDeburr(product.name),
                    sku: trimDeburr(product.sku),
                    price: product.price,
                    image: trimDeburr(product.image),
                    url: trimDeburr(product.url),
                    categories: flatCats,
                    brands: product.brands,
                    // TODO: Remove in future
                    catId: _.map(cats, function(cat) {
                        return trimDeburr(cat.id);
                    }).join(','),
                    // TODO: Remove in future
                    catName: _.map(cats, function(cat) {
                        return trimDeburr(cat.name);
                    }).join(','),
                    data: product.data
                };

                // Create a new object, omitting any properties with empty values,
                // (excludes `id`, `qty` and `price` which are always retained).
                item = _.filterObject(item, function(value, key) {
                    if (key !== 'id' && key !== 'qty' && key !== 'price') {
                        return !_.isEmpty(value);
                    }
                    return true;
                });

                list.push(item);
            });

            return truncateItemProps(
                list,
                // Discard the following properties in order to reduce final size.
                ['catName', 'catId', 'categories', 'data', 'image', 'url'],
                // Try to stay under the character limit
                maxChars
            );
        }

        function trackOrder() {
            /** @type {Platform.Utils.TaskFn<Platform.Tracking.TrackOrderResponse>[]} */
            var tasks = [];

            var embeddedOrder = window.fp_sales_orders;
            if (embeddedOrder) {
                // The page has one or more embedded orders. We do not officially support
                // multiple embedded orders, but the "Mitsubishi Foods" account requires
                // this so while they are active we need to support it.
                var orders = _.isArray(embeddedOrder) ? embeddedOrder : [embeddedOrder];
                tasks = _.map(orders, function(order) {
                    return function(done) {
                        state.order.clear();
                        trackSingleOrder({
                            embeddedOrder: order,
                            callback: done
                        });
                    };
                });
            } else {
                // `trackOrder` was called by an adaptor
                tasks = [
                    function(done) {
                        trackSingleOrder({
                            callback: done
                        });
                    }
                ];
            }
            // Track the orders in series
            _.series(tasks, function(err, results) {
                if (results) {
                    var shouldTrack = _.some(results, function(response) {
                        return !!response.trackPage;
                    });
                    if (shouldTrack) {
                        var origPageType = state.page.type;
                        state.page.type = 'page';
                        trackPage();
                        state.page.type = origPageType;
                    }
                }
            });
        }

        /**
         * @param {Platform.Tracking.TrackOrderOptions} options
         */
        function trackSingleOrder(options) {
            var order = state.order;
            var user = state.user;

            if (!order.id && !order.number && options.embeddedOrder) {
                Legacy.fillStateFromOrder(options.embeddedOrder);
            }

            var scriptVersion = 'platform';
            if (options.embeddedOrder) {
                scriptVersion = options.embeddedOrder.scriptVersion || 'unknown';
            }

            identityManager.load();
            var req = {
                accountKey: Config.accountKey || '',
                sessionKey: Config.sessionKey || '',
                userKey: Config.userKey || '',
                uuid: Config.uuid || '',

                hostname: window.location.hostname,
                storeDomain: Config.storeDomain || window.location.hostname,

                orderId: order.id || '',
                orderNumber: order.number || '',
                orderDate: order.date || '',

                orderTotal: order.gross || 0,
                discountAmount: order.discount || 0,
                discountCode: order.discountCode || '',
                shipping: order.shipping || 0,
                tax: order.tax || 0,
                currency: order.currency || '',

                orderEmail: order.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                customerEmail: user.email || '',
                customerId: user.id || '',

                shopType: Config.shopType || 'custom',
                version: 3,
                scriptVersion: scriptVersion,
                lv: fanplayr._loaderVersion,

                // The order tracking URL only encodes `products` once so we can use a
                // higher threshold than in page tracking.
                products: JSON.stringify(denormalizeProducts(order.products, 9000)),
                notes: getOrderNotes(order.note || order.notes),
                repeatCart: (order.cartAction === 'repeat'),
                quoteId: order.quoteId || '',
                customData: buildCustomDataParam(order.data) || '',
                repeatCustomData: order.repeatCustomData ? 1 : 0,
                url: document.location.href.substring(0, 500),
                // 2024-10-31: Fix issue where https://vitalproteins.it was setting the
                // referrer to `null`.
                referrer: typeof document.referrer === 'string' ?
                    document.referrer.substring(0, 500) :
                    '',
                pid: Config.privacyIdUserKey,
                idmap: JSON.stringify(identityManager.getMap()),
                uc_mode: getBoolFlag(Config.userConsentMode),
                uc_status: getBoolFlag(Config.userConsentStatus)
            };
            if (Config.allowNegativeCurrencyAmounts) {
                req.allowNegativeCurrencyAmounts = 1;
            }
            identityManager.clear();

            if (!order.id && !order.number) {
                log('Empty order, do nothing', req);
                return;
            }

            if (Config.userKey) {
                cdp.setUserId(Config.userKey);
            }
            if (Config.sessionKey) {
                cdp.setSessionId(Config.sessionKey);
            }

            $.ajax({
                url: 'https://' + Config.sessionEndpoint + '/api.logRedemption/',
                data: req,
                dataType: 'jsonp',
                jsonp: false,
                jsonpCallback: 'fanplayr_order_callback',
                success: function(res) {
                    if (options.callback) {
                        options.callback(null, res);
                    }
                },
                error: function() {
                    if (options.callback) {
                        options.callback(true);
                    }
                }
            });
        }

        function getOrderNotes(orderNotes) {
            var notes = [];
            if (_.isArray(orderNotes)) {
                orderNotes = orderNotes.join('; ');
            }
            if (typeof orderNotes === 'string') {
                notes.push(orderNotes);
            }
            // Append platform version.
            notes.push('platform v' + Config.version);
            var adaptorVersion = getAdaptorVersion();
            if (adaptorVersion) {
                notes.push('adaptor v' + adaptorVersion);
            }
            // Append page url.
            var pageUrl = window.location.href;
            if (pageUrl.length > 300) {
                pageUrl = pageUrl.substr(0, 300);
            }
            notes.push(pageUrl);
            return notes.join('; ');
        }

        function getAdaptorVersion() {
            var fanplayr = window.fanplayr;
            var adaptor = fanplayr && fanplayr.adaptor;
            if (adaptor && typeof adaptor === 'object') {
                return (
                    adaptor.version ||
                    (adaptor.config && adaptor.config.version) ||
                    (adaptor._base && adaptor._base.config && adaptor._base.config.version)
                );
            }
        }

        function trackFallbackOrder() {
            try {
                var data = Cookie.get('fp_order_fallback');
                if (data) {
                    var parts = data.split('|');
                    if (!parts[6]) {
                        // @ts-ignore
                        parts[6] = Config.storeDomain;
                    }
                    if (!parts[8]) {
                        // @ts-ignore
                        parts[8] = Config.sessionKey;
                    }
                    if (!parts[9]) {
                        // @ts-ignore
                        parts[9] = Config.userKey;
                    }

                    $.ajax({
                        url: 'https://' + Config.apiEndpoint + '/order',
                        data: {
                            data: parts.join('|')
                        },
                        dataType: 'jsonp',
                        success: function(res) {
                            if (res.status === 'success') {
                                Cookie.remove('fp_order_fallback');
                            }
                        }
                    });
                }
            } catch (ex) {
                log('Track fallback order ex', ex);
            }
        }

        var flushEventQueueTimeoutId;
        /**
         * @type {Platform.Tracking.TrackEventFn}
         */
        function trackEvent(typeOrData, dataOrOptions) {
            var event;
            /** @type {Platform.Tracking.TrackEventOptions | undefined} */
            var options;
            if (typeof typeOrData === 'string') {
                event = {
                    type: 'custom',
                    subType: typeOrData,
                    data: dataOrOptions
                };
            } else if (_.isPlainObject(typeOrData)) {
                event = typeOrData;
                if (_.isPlainObject(dataOrOptions)) {
                    options = dataOrOptions;
                }
            }
            event = _.merge({}, event, {
                pageIndex: Config.pageIndex
            });
            if (options && options.nextPage) {
                // The event should be tracked on the next page view because the browser
                // is about to navigate.
                queueNextPageEvent(event);
                return;
            }

            platform.eventQueue.push(event);
            clearTimeout(flushEventQueueTimeoutId);
            if (event && event.flush) {
                delete event.flush;
                flushEventQueue();
            } else {
                flushEventQueueTimeoutId = setTimeout(flushEventQueue, 1000);
            }
        }

        /**
         * Queues events for tracking after the next page view in local storage.
         * @param {Record<string, any>} event
         */
        function queueNextPageEvent(event) {
            /** @type {NextPageEventsQueue} */
            var queue = {
                sessionKey: Config.sessionKey || '',
                events: []
            };
            // Some events might already be queued for the next page so we need
            // to add to them if necessary.
            try {
                var content = localStorage.getItem(NextPageEventKey);
                if (content) {
                    /** @type {NextPageEventsQueue} */
                    var storedQueue = JSON.parse(content);
                    if (storedQueue && storedQueue.sessionKey === Config.sessionKey) {
                        // Only accept existing queue if it's for the same session
                        queue = storedQueue;
                    }
                }
            } catch (ex) {}
            queue.events.push(event);
            localStorage.setItem(NextPageEventKey, JSON.stringify(queue));
        }

        /**
         * Flushes any events in local storage that were queued for the next page
         * view.
         */
        function flushNextPageEvents() {
            try {
                var content = localStorage.getItem(NextPageEventKey);
                if (content) {
                    // Ensure we remove the item to prevent double-tracking
                    localStorage.removeItem(NextPageEventKey);
                    /** @type {NextPageEventsQueue} */
                    var queue = JSON.parse(content);
                    // Only track events if they belong to the same session
                    if (queue && queue.sessionKey === Config.sessionKey && queue.events.length) {
                        // Append events to actual queue
                        platform.eventQueue = platform.eventQueue.concat(queue.events);
                        // Schedule the next flush
                        flushEventQueueTimeoutId = setTimeout(flushEventQueue, 1000);
                    }
                }
            } catch (ex) {}
        }

        function flushEventQueue() {
            var events = platform.eventQueue.slice(0);
            if (events.length) {
                platform.eventQueue = [];
                // Ensure we don't serialize any "callback" functions on events as
                // different `JSON.stringify` implementations might include these as
                // `null` instead of `undefined`.
                var payload = _.map(events, function(event) {
                    if (typeof event.callback === 'function') {
                        var result = _.cloneDeep(event);
                        delete result.callback;
                        return result;
                    }
                    return event;
                });
                $.ajax({
                    url: '//' + Config.sessionEndpoint + '/external.Genius/',
                    data: {
                        a: 'trackEvents',
                        sk: Config.sessionKey,
                        json: JSON.stringify(payload)
                    },
                    dataType: 'jsonp',
                    success: function() {
                        events.forEach(function(event) {
                            if (typeof event.callback === 'function') {
                                event.callback();
                            }
                        });
                    }
                });
            }
        }

        // 2019-03-25: Deburr all input sent to the platform.
        function trimDeburr(value) {
            return (typeof value === 'string') ? _.trim(_.deburr(value)) : value;
        }

        function getGaClientId() {
            // @ts-ignore
            var ga = window.ga;
            if (ga && typeof ga.getAll === 'function') {
                try {
                    var id = ga.getAll()[0].get('clientId');
                    // Ensure we get something that looks unique.
                    return /^\d{6,12}\.\d{10,12}$/.test(id) ? id : '';
                } catch (ex) {}
            }
            return '';
        }

        function isCurrentPageView() {
            return (
                lastPageTrackResTimestamp &&
                lastPageTrackResTimestamp === Number(localStorage.getItem(PAGE_TRACK_RESPONSE_TIMESTAMP))
            );
        }

        /**
         * Removes properties from items in an array as necessary to ensure the JSON
         * stringified version of the items remains under a maximum string length.
         *
         * @param {object[]} items An array of objects.
         * @param {string[]} props An array of property names to systematically
         * remove.
         * @param {number} maxChars The maximum final JSON string length permitted.
         * Non-essential product properties will be removed in order to stay under
         * this limit.
         */
        function truncateItemProps(items, props, maxChars) {
            var length = JSON.stringify(items).length;
            if (length > maxChars) {
                // Clone items to avoid mutating original data.
                items = JSON.parse(JSON.stringify(items));
                outer:
                    for (var propIndex = 0; propIndex < props.length; propIndex++) {
                        var prop = props[propIndex];
                        for (var i = 0, len = items.length; i < len; i++) {
                            var item = items[i];
                            // Get the stringified value, includes quotes for strings e.g. `"hello"`
                            var value = JSON.stringify(item[prop]);
                            if (typeof value === 'string') {
                                // 4 = 2 quotes around the property name, 1 colon and 1 comma:
                                // {"property name":"value","other property":"other value"}
                                var size = prop.length + 4 + value.length;
                                length -= size;
                                delete item[prop];
                                if (length <= maxChars) {
                                    break outer;
                                }
                            }
                        }
                    }
            }
            return items;
        }

        /**
         * Ensures that the offer can be presented by marking it as a consumed offer
         * slot. This doesn't actually mark the offer as presented, that will only
         * happen when the widget is shown (possibly only when a specific view is
         * shown depending on the widget config).
         *
         * @param {number} offerId
         * @returns {boolean} `true` if successful.
         */
        function consumeOfferSlot(offerId) {
            if (consumedOfferIds.indexOf(offerId) >= 0) {
                // It's already presented
                // log('consumeOfferSlot', offerId, 'already presented');
                return true;
            } else if (availableOfferSlots > 0) {
                // It's a new offer and there is an available slot
                consumedOfferIds.push(offerId);
                availableOfferSlots--;
                // log('consumeOfferSlot', offerId, 'consume slot');
                return true;
            }
            // log('consumeOfferSlot', offerId, 'no space');
            // There is no space for the new offer
            return false;
        }

        /**
         * @param {Platform.AbGroup} abGroup
         */
        function setAbGroup(abGroup) {
            if (!currentAbGroup) {
                currentAbGroup = abGroup;
                platform.trackEvent({
                    type: 'abGroup',
                    data: {
                        group: abGroup
                    }
                });
            }
        }

        return {
            trackPage: trackPage,
            trackOrder: trackOrder,
            trackFallbackOrder: trackFallbackOrder,
            trackEvent: trackEvent,
            init: function(_platform) {
                platform = _platform;
                platform.eventQueue = [];
                platform.isCurrentPageView = isCurrentPageView;

                /**
                 * @param {Runtime.Widget} widget
                 * @returns {boolean}
                 */
                platform.canShowWidget = function(widget) {
                    if (widget.isAnyPreview()) {
                        // All widgets in preview mode to always show. This allows them to
                        // show in the editor.
                        return true;
                    }
                    var offer = widget.data.offer;
                    var details = widget.details;
                    if (!platform.isCurrentPageView()) {
                        // log('Block widget', widget.source.name, 'not current page view');
                        return false;
                    }
                    if (details && details.abTested) {
                        if (currentAbGroup === 'control') {
                            // log('Block widget', widget.source.name, 'already in control group');
                            return false;
                        }
                        if (!currentAbGroup && pendingAbGroup) {
                            setAbGroup(pendingAbGroup);
                            if (pendingAbGroup === 'control') {
                                // log('Block widget', widget.source.name, 'place in control group');
                                return false;
                            }
                        }
                    }
                    if (offer && details) {
                        if (!consumeOfferSlot(offer.id)) {
                            // log('Block widget', widget.source.name, 'not enough offer slots');
                            platform.trackEvent({
                                type: 'exception',
                                subType: 'NotEnoughOfferSlots',
                                data: {
                                    actionIds: [details.actionId]
                                }
                            });
                            return false;
                        }
                    }
                    if (details && availableActionSlots > -1) {
                        if (details.triggerCount === 0) {
                            if (availableActionSlots === 0) {
                                // log('Block widget', widget.source.name, 'not enough action slots');
                                platform.trackEvent({
                                    type: 'exception',
                                    subType: 'TooManyActions',
                                    data: {
                                        actionIds: [details.actionId]
                                    }
                                });
                                return false;
                            } else {
                                // log('Reduce availableActionSlots from', availableActionSlots, 'to', availableActionSlots - 1);
                                availableActionSlots--;
                            }
                        } else {
                            // log('Allow action, already triggered', details.triggerCount, 'times');
                        }
                    }
                    return true;
                };
            }
        };
    });

    define('platform/tunnel', ['require', 'platform/json', 'platform/vendor/domReady'], function(require) {
        var JSON = require('platform/json');
        var domReady = require('platform/vendor/domReady');

        /* jshint scripturl: true */

        /** @type {(...args: any[]) => void} */
        var log = function() {};

        var doc = document;

        function Tunnel(options) {
            var that = this;
            options = that.options = (options || {});

            that._id = 0;
            that._messageQueue = [];
            that._pendingResponses = {};

            that.onMessage = options.onMessage;
            that.onReady = options.onReady;

            that.validateMessage = options.validateMessage || function() {
                return true;
            };

            // Permanently bind this to _onMessage.
            var _onMessage = that._onMessage;
            // @ts-ignore
            that._onMessage = function(event) {
                _onMessage.call(that, event);
            };

            if (options.log) {
                log = options.log;
            }

            if (options.remote) {
                if (!options.lazy) {
                    that._connect(options.remote);
                }
            } else {
                that._listen();
            }
        }

        Tunnel.available = !!window.postMessage;

        Tunnel.prototype = {
            /** @type {Window | null} */
            _target: null,

            /** @type {HTMLIFrameElement | null} */
            _outerFrame: null,

            postMessage: function(body, options, callback) {
                var that = this;
                if (arguments.length < 3) {
                    callback = options;
                    options = {};
                }

                if (that.options.lazy && that.options.remote) {
                    that.options.lazy = false;
                    that._connect(that.options.remote);
                }

                var message = {
                    id: that._id++,
                    body: body
                };

                if (callback) {
                    that._pendingResponses[message.id] = {
                        callback: callback,
                        timeout: options && options.timeout || that.options.timeout || 0
                    };
                }

                that._postRawMessage(message);
            },

            _postRawMessage: function(message) {
                var that = this;
                if (that._target && !that._isDisconnected()) {
                    var pending = that._pendingResponses[message.id];
                    if (pending && pending.timeout && pending.callback) {
                        // Create timeout.
                        pending.timeoutId = setTimeout(function() {
                            // Error.
                            pending.callback("timeout");
                            // Clean up.
                            delete that._pendingResponses[message.id];
                        }, pending.timeout);
                    }

                    // Post the actual message.
                    log("post: ", message);
                    that._target.postMessage(JSON.stringify(message), "*");
                } else {
                    // Queue message until ready.
                    log("queue: ", message);
                    that._messageQueue.push(message);
                }
            },

            _isDisconnected: function() {
                var that = this;
                var outerFrame = that._outerFrame;
                if (outerFrame && document.body && outerFrame.parentNode !== document.body) {
                    log("disconnected");
                    that._destoryClient();

                    setTimeout(function() {
                        log("reconnect");
                        that._connect(that.options.remote);
                    }, 0);

                    return true;
                }
            },

            _onMessage: function(event) {
                var that = this;

                var origin = event.origin || event.domain || event.uri || "";
                var message = parseMessage(event, origin);
                if (!message) {
                    log("Failed to parse tunnel message", event, origin);
                    return false;
                }

                if (that.validateMessage && !that.validateMessage(event, origin)) {
                    log("invalid origin: ", origin);
                    return false;
                }

                log("read: ", message);

                if (message.ready) {
                    that._setTarget(event.source);
                    that._hideFrame();
                    if (that.onReady) {
                        that.onReady(that);
                    }
                } else {
                    // Check to see if this message is a response to
                    // a request that was sent earlier.
                    var responseId = message.rid;
                    if (typeof responseId !== "undefined") {
                        var pending = that._pendingResponses[responseId];
                        if (pending) {
                            // Clean up.
                            delete that._pendingResponses[responseId];
                            if (pending.timeoutId) {
                                clearTimeout(pending.timeoutId);
                            }
                            // Handle response.
                            if (pending.callback) {
                                pending.callback(null, message.body);
                            }
                        }
                    }
                    // Must be a request.
                    else if (that.onMessage) {
                        that.onMessage(message.body, function(responseBody) {
                            // The response ID is the message's transaction ID.
                            that._postRawMessage({
                                rid: message.id,
                                body: responseBody
                            });
                        });
                    }
                }
            },

            _setTarget: function(targetWindow) {
                this._target = targetWindow;
                var queue = this._messageQueue || [];
                while (queue.length) {
                    this._postRawMessage(queue.shift());
                }
            },

            _connect: function(endpoint) {
                var that = this;

                log("connecting");

                // Create an iframe on the same domain as the
                // current page to hide communication.
                var outerFrame = doc.createElement("iframe");
                outerFrame.src = "javascript:false";
                outerFrame.title = "";
                // @ts-ignore
                outerFrame.role = "presentation";
                // @ts-ignore
                (outerFrame.frameElement || outerFrame).style.cssText = "position: absolute; bottom: 0; left: 0; width: 50px; height: 50px; visibility: hidden; border: 0";

                that._outerFrame = outerFrame;

                var loaded = false;

                var outerFrameLoad = function() {
                    if (!loaded) {
                        loaded = true;

                        // The server will post messages to its parent.
                        var outerWin = outerFrame.contentWindow;

                        bindEvent(outerWin, "message", that._onMessage);

                        // Create an inner iframe pointing to the communication
                        // endpoint. This should be a document that uses
                        // `FrameTunnel.listen()`.

                        // @ts-ignore
                        var outerDoc = outerWin.document;
                        var innerFrame = outerDoc.createElement("iframe");
                        // @ts-ignore
                        (innerFrame.frameElement || innerFrame).style.cssText = "width: 50px; height: 50px;";
                        innerFrame.src = endpoint;

                        outerDoc.body.appendChild(innerFrame);

                        // Unbind
                        unbindEvent(outerFrame, "load", outerFrameLoad);
                    }
                };

                bindEvent(outerFrame, "load", outerFrameLoad);

                domReady(function() {
                    doc.body.appendChild(outerFrame);
                });
            },

            _hideFrame: function() {
                if (this._outerFrame) {
                    // @ts-ignore
                    (this._outerFrame.frameElement || this._outerFrame).style.cssText = "position: absolute; bottom: 0; left: 0; width: 0; height: 0; visibility: hidden; border: 0";
                }
            },

            _destoryClient: function() {
                log("destroy client");
                try {
                    var that = this;
                    var outerFrame = that._outerFrame;
                    that._outerFrame = null;

                    // Null the target window to ensure messages are queued
                    // again until the new window has posted its ready message.
                    that._target = null;

                    if (outerFrame) {
                        var outerWin = outerFrame.contentWindow;
                        if (outerWin) {
                            unbindEvent(outerWin, "message", that._onMessage);
                        }
                        doc.body.removeChild(outerFrame);
                    }
                } catch (e) {
                    log("error destroying client", e);
                }
            },

            _listen: function() {
                var that = this,
                    win = window;

                log("listening");

                bindEvent(win, "message", function(event) {
                    that._onMessage(event);
                });

                // Post messages the outer iframe.
                if (win.parent !== win) {
                    that._setTarget(win.parent);

                    // Let the client know the server is ready.
                    setTimeout(function() {
                        that._postRawMessage({
                            ready: 1
                        });
                        if (that.onReady) {
                            that.onReady(that);
                        }
                    }, 10);
                } else {
                    log("no parent");
                }
            }
        };

        function bindEvent(target, eventName, callback) {
            if (target.addEventListener) {
                target.addEventListener(eventName, callback, false);
            } else {
                target.attachEvent("on" + eventName, callback);
            }
        }

        function unbindEvent(target, eventName, callback) {
            if (target.removeEventListener) {
                target.removeEventListener(eventName, callback, false);
            } else {
                target.detachEvent("on" + eventName, callback);
            }
        }

        function parseMessage(event, origin) {
            try {
                var msg = JSON.parse(event.data);
                // Valid formats:
                //  - { "ready": 1 }
                //  - { "id": 0, "body": {} }
                //  - { "rid": 0, ["body": {}] }
                if (msg.ready || (msg.body && typeof msg.id === "number") || typeof msg.rid === "number") {
                    return msg;
                }
            } catch (ex) {}
        }

        return Tunnel;
    });

    define('platform/xds', ['require', 'platform/config', 'platform/tunnel', 'platform/utils', 'platform/json', 'platform/storageMode'], function(require) {
        // var log = require('platform/log').create('platform:xds');
        var Config = require('platform/config');
        var Tunnel = require('platform/tunnel');
        var _ = require('platform/utils');
        var JSON = require('platform/json');
        var STORAGE_MODE = require('platform/storageMode');

        /** @type {Platform.Tunnel.Tunnel} */
        // @ts-ignore
        var tunnel = null;
        if (STORAGE_MODE !== 'store') { // 'migrate' or 'tunnel'
            // log('create tunnel');
            tunnel = new Tunnel({
                remote: Config.xdsTunnel,
                timeout: 2000,
                lazy: true,
                validateMessage: function(event, origin) {
                    return /(fanplayr\.com|site\.fanplayr)/.test(origin);
                }
            });
        }

        var pendingTestCallbacks = [];
        var hasTested, isTesting;

        var xds = {
            isEnabled: false,
            checkEnabled: function(callback) {
                if (STORAGE_MODE === 'store' || hasTested) {
                    callback(this.isEnabled);
                } else {
                    // Append the callback.
                    pendingTestCallbacks.push(callback);

                    if (!isTesting) {
                        isTesting = true;

                        // Test the
                        tunnel.postMessage({
                            action: "ls-test"
                        }, function(err, isEnabled) {
                            hasTested = true;
                            xds.isEnabled = isEnabled;

                            _.each(pendingTestCallbacks, function(cb) {
                                cb(isEnabled);
                            });
                            pendingTestCallbacks = [];
                        });
                    }
                }
            },

            getLocalStorage: function(key, callback) {
                if (!callback) {
                    callback = function() {};
                }
                xds['getLocalStorage_' + STORAGE_MODE](key, callback);
            },
            getLocalStorage_store: function(key, callback) {
                var json = localStorage.getItem(key);
                var value = typeof json === 'string' ? JSON.parse(json) : null;
                callback(null, value);
            },
            getLocalStorage_migrate: function(key, callback) {
                var value = localStorage.getItem(key);
                if (value !== null) {
                    // log('found item on store', key, value);
                    callback(null, JSON.parse(value));
                } else {
                    // log('fallback to FP', key);
                    xds.getLocalStorage_tunnel(key, function(err, resp) {
                        if (!err && resp) {
                            localStorage.setItem(key, JSON.stringify(resp));
                            // log('clear from FP', key);
                            xds.removeLocalStorage_tunnel(key);
                        }
                        callback(err, resp);
                    });
                }
            },
            getLocalStorage_tunnel: function(key, callback) {
                // log("ls-get", key);
                if (tunnel) {
                    tunnel.postMessage({
                        action: "ls-get",
                        key: key
                    }, function(err, resp) {
                        // log("ls-get resp", err, resp);
                        callback(err, resp);
                    });
                } else {
                    callback(null, null);
                }
            },

            setLocalStorage: function(key, value, callback) {
                if (!callback) {
                    callback = function() {};
                }
                xds['setLocalStorage_' + STORAGE_MODE](key, value, callback);
            },
            setLocalStorage_store: function(key, value, callback) {
                localStorage.setItem(key, JSON.stringify(value));
                callback(null, true);
            },
            setLocalStorage_migrate: function(key, value, callback) {
                // log('save store item', key, value);
                var hasLocal = localStorage.getItem(key) !== null;
                localStorage.setItem(key, JSON.stringify(value));
                if (hasLocal) {
                    callback(null, true);
                } else {
                    // log('clear store item after save', key);
                    xds.removeLocalStorage_tunnel(key, callback);
                }
            },
            setLocalStorage_tunnel: function(key, value, callback) {
                // log("ls-set", key, value);
                if (tunnel) {
                    tunnel.postMessage({
                        action: "ls-set",
                        key: key,
                        value: value
                    }, function(err, resp) {
                        // log("ls-set resp", err, resp);
                        callback(err, resp);
                    });
                } else {
                    callback(null, null);
                }
            },

            removeLocalStorage_tunnel: function(key, callback) {
                // log("ls-remove", key);
                if (tunnel) {
                    tunnel.postMessage({
                        action: "ls-remove",
                        key: key
                    }, function(err, resp) {
                        // log("ls-remove resp", err, resp);
                        if (callback) {
                            callback(err, resp);
                        }
                    });
                } else if (callback) {
                    callback(null, null);
                }
            },

            getUserKey: function(callback) {
                if (tunnel) {
                    tunnel.postMessage({
                        action: "uk-get"
                    }, function(err, resp) {
                        // log("uk-get: ", err, resp);
                        if (callback) {
                            callback(err, resp);
                        }
                    });
                } else if (callback) {
                    callback(null, null);
                }
            },

            setUserKey: function(value, callback) {
                if (tunnel) {
                    tunnel.postMessage({
                        action: "uk-set",
                        value: value
                    }, function(err, resp) {
                        // log("uk-set: ", err, resp);
                        if (callback) {
                            callback(err, resp);
                        }
                    });
                } else if (callback) {
                    callback(null, null);
                }
            },

            getSessionCookie: function(key, callback) {
                if (tunnel) {
                    tunnel.postMessage({
                        action: "sc-get",
                        key: key
                    }, function(err, resp) {
                        // log("sc-get: ", err, resp);
                        if (callback) {
                            callback(err, resp);
                        }
                    });
                } else if (callback) {
                    callback(null, null);
                }
            },

            setSessionCookie: function(key, value, callback) {
                if (tunnel) {
                    tunnel.postMessage({
                        action: "sc-set",
                        key: key,
                        value: value
                    }, function(err, resp) {
                        // log("sc-set: ", err, resp);
                        if (callback) {
                            callback(err, resp);
                        }
                    });
                } else if (callback) {
                    callback(null, null);
                }
            }
        };

        if (STORAGE_MODE === 'store') {
            xds.isEnabled = true;
        }

        var isPossible = false;
        try {
            // @ts-ignore
            isPossible = window.localStorage && window.postMessage;
        } catch (ex) {
            hasTested = true;
            xds.isEnabled = false;
        }

        return xds;
    });

    define('platform/debug', ['require', 'platform/utils', 'platform/jquery', 'platform/cookie'], function(require) {
        var _ = require('platform/utils');
        var $ = require('platform/jquery');
        var Cookie = require('platform/cookie');
        var debug = {};

        debug.mark = (function() {
            var firstTime = null;
            var lastTime = null;
            return function mark(label) {
                var now = window.performance && window.performance.now() || +new Date();
                if (firstTime === null) {
                    firstTime = now;
                    lastTime = now;
                }
                var dtFirst = now - firstTime;
                var dtLast = now - lastTime;
                lastTime = now;
                window.console.debug('[mark] ' + label + ' (Nav Start: ' + now.toFixed(2) + 'ms, First Mark: +' + dtFirst.toFixed(2) + 'ms, Last Mark: +' + dtLast.toFixed(2) + 'ms)');
            };
        }());

        debug.once = (function() {
            var cookieName = 'fp_nonce';

            function deserialize(str) {
                var flags = {};
                if (typeof str === 'string') {
                    _.forEach(str.split(';'), function(val) {
                        flags[val] = true;
                    });
                }
                return flags;
            }

            function serialize(flags) {
                return _.keys(flags).join(';');
            }
            return function once(options) {
                var flags = deserialize(Cookie.get(cookieName));
                if (flags[options.id]) {
                    if (options.alreadyExists) {
                        options.alreadyExists();
                    }
                } else {
                    flags[options.id] = true;
                    Cookie.set(cookieName, serialize(flags), {
                        expires: 'never'
                    });
                    if (options.callback) {
                        options.callback();
                    }
                }
            };
        }());

        debug.trackOnce = function(id, data) {
            debug.once({
                id: id,
                callback: function() {
                    $.ajax({
                        url: 'https://api.fanplayr.com/tracker',
                        data: _.merge(data || {}, {
                            action: 'trackOnce_' + id,
                            domain: document.location.hostname
                        }),
                        dataType: 'jsonp'
                    });
                }
            });
        };

        return debug;
    });

    define('platform/stash', ['require', 'platform/utils', 'platform/config', 'platform/log', 'platform/json', 'platform/jquery', 'platform/xds', 'platform/rootDomain'], function(require) {
        var _ = require('platform/utils');
        var Config = require('platform/config');
        var Log = require('platform/log').create('platform:stash');
        var JSON = require('platform/json');
        var $ = require('platform/jquery');
        var XDS = require('platform/xds');
        var RootDomain = require('platform/rootDomain');

        /**
         * Data persistence.
         *
         * @namespace Stash
         */

        /**
         * @typedef StashItem
         * @property {any} v The value
         * @property {string} [e] The expiry string.
         * @property {boolean} [essential] Whether the value is essential and should bypass User Consent.
         */

        /**
         * @typedef StashSetItemOptions
         * @property {boolean} [essential] Marks the item as essential
         * meaning that it will be availble to read/write even when User Consent
         * Mode is active and the user has not given consent.
         * @property {StashExpiryString} [expires] - Expiry string.
         */

        /**
         * @typedef {string} StashExpiryString A string which denotes comma-separated,
         * conditions where a stash item should expire:
         *
         * - `sk` - Expire object when session key changes.
         * - `Xms` - Expire object after `X` milliseconds.
         * - `Xs` - Expire object after `X` seconds.
         * - `Xm` - Expire object after `X` minutes.
         * - `Xh` - Expire object after `X` hours.
         * - `Xd` - Expire object after `X` days.
         *
         * For example a value of `"sk, 30m"` would expire the item when either the
         * session key changes or after 30 minutes.
         */

        var providers = {};

        /**
         * A provider that persists data using memcache at the current {@link config#sessionEndpoint}.
         *
         * @namespace Stash.memcache
         */
        providers.memcache = (function() {
            function sendRequest(method, key, value, callback) {
                if (Config.userKey) {
                    $.ajax({
                        url: "//" + Config.sessionEndpoint + "/external.Genius/",
                        data: {
                            a: "session-data",
                            m: method,
                            uk: Config.userKey,
                            data: JSON.stringify(value),
                            suffix: key
                        },
                        dataType: "jsonp",
                        timeout: 2000,
                        success: function(resp) {
                            callback(null, resp);
                        },
                        error: function() {
                            callback(true);
                        }
                    });
                } else {
                    callback(true);
                }
            }

            return {
                name: "memcache",

                /**
                 * Retrieves a value from the provider.
                 *
                 * @memberof Stash.memcache#
                 * @function get
                 * @param {String} key - The name of the key.
                 * @param {Function} callback - A node-style callback to invoke after the GET operation completes.
                 */
                get: function(key, callback) {
                    sendRequest("get", key, null, function(err, resp) {
                        if (err || resp.error) {
                            callback(err);
                        } else {
                            callback(null, resp.data);
                        }
                    });
                },

                /**
                 * Sets a value on the provider.
                 *
                 * @memberof Stash.memcache#
                 * @function set
                 * @param {String} key - The name of the key.
                 * @param {*} value - The value to store. This is converted to JSON before storing.
                 * @param {Function} callback - A node-style callback to invoke after the SET operation completes.
                 */
                set: _.debounce(function(key, value, callback) {
                    this._set(key, value, callback);
                }, 500),

                // Sends the request immediately.
                _set: function(key, value, callback) {
                    sendRequest("set", key, value, function(err, resp) {
                        callback(err || resp.error);
                    });
                }
            };
        }());

        /**
         * A provider that persists data using iframe tunneling and [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
         *
         * Only supported by IE8 and up.
         *
         * @namespace Stash.remoteStorage
         * @inner
         */
        providers.remoteStorage = (function() {
            return {
                name: "remoteStorage",

                /**
                 * Retrieves a value from the provider.
                 *
                 * @memberof Stash.remoteStorage#
                 * @function get
                 * @param {String} key - The name of the key.
                 * @param {Function} callback - A node-style callback to invoke after the GET operation completes.
                 */
                get: XDS.getLocalStorage,

                /**
                 * Sets a value on the provider.
                 *
                 * @memberof Stash.remoteStorage#
                 * @function set
                 * @param {String} key - The name of the key.
                 * @param {*} value - The value to store. This is converted to JSON before storing.
                 * @param {Function} callback - A node-style callback to invoke after the SET operation completes.
                 */
                set: XDS.setLocalStorage
            };
        }());

        var Stash = {
            /**
             * Creates a new instance.
             *
             * @memberof Stash
             * @function create
             * @param {Object} options
             * @param {String} options.name - The name of the stash. This is the key used
             * by the storage provider to persist the data.
             * @param {String} [options.scope] - The scope of the stash object. If equal
             * to `"domain"`, the name of the stash will be prefixed with the root domain
             * of the current hostname, as defined by {@link config.storeDomain}.
             * @param {StashSetItemOptions} [options.defaultSetOptions] Default "set"
             * options to use when storing items in the stash.
             * @param {Platform.Stash.Provider} [options.provider] - The stroage provider
             * mechanism to use. If a string is given, it should be the name of the
             * provider, otherise the actual provider implementation is expected.
             */
            create: function(options) {
                var name = options.name;
                var stashCreateOptions = options;

                var log = Log.create("stash:" + name);

                if (options.scope === "domain") {
                    name += ":" + RootDomain.get(Config.storeDomain);
                }

                var provider = options.provider;
                if (provider) {
                    if (typeof provider === "string") {
                        provider = providers[provider];
                    }
                } else {
                    if (XDS.isEnabled) {
                        provider = providers.remoteStorage;
                    } else {
                        provider = providers.memcache;
                    }
                }

                var inst = {
                    /**
                     * Internal map of data stored in the stash.
                     *
                     * @memberof Stash#
                     * @var {Object} data
                     * @access private
                     */
                    data: {},

                    log: log,

                    /**
                     * Load the stash instance with data from its provider. A stash only needs to be loaded once per page view,
                     * before any of its data is accessed or updated.
                     *
                     * @memberof Stash#
                     * @function load
                     * @param {Function} callback - Invoked after the stash has loaded. If loading fails, the first parameter will be the error.
                     *
                     * @example
                     * stash.load(function ( err ) {
                     *   // The stash is loaded.
                     *   if ( err ) {
                     *     // There was an error loading the stash.
                     *   }
                     * });
                     */
                    load: function(callback) {
                        // log("loading");
                        // @ts-ignore
                        provider.get(name, function(err, data) {
                            // log("loaded", err, data);
                            inst.data = data || {};
                            inst.gc();
                            if (callback) {
                                callback(err);
                            }
                        });
                    },

                    /**
                     * Saves the current state of the stash instance using its provider.
                     *
                     * @memberof Stash#
                     * @function save
                     * @param {Function} callback - Invoked after the stash has finished saving. If saving fails, the first parameter will be the error.
                     *
                     * @example
                     * stash.save(function ( err ) {
                     *   // The stash has finished saving.
                     *   if ( err ) {
                     *     // There was an error saving the stash.
                     *   }
                     * });
                     */
                    save: function(callback) {
                        // log("saving");
                        var data = inst.data || {};
                        data.$sk = Config.sessionKey;
                        data.$ts = Math.ceil(+new Date() / 1000);
                        // @ts-ignore
                        provider.set(name, data, function(err) {
                            // log("saved", err);
                            if (callback) {
                                callback(err);
                            }
                        });
                    },

                    /**
                     * Check whether `key` is defined in the stash instance (any value that is not `undefined`).
                     *
                     * @memberof Stash#
                     * @function has
                     * @param {String} key - The name of the key.
                     * @returns {Boolean}
                     *
                     * @example
                     * if ( stash.has("something") ) {
                     *   // something exists in the stash
                     * }
                     */
                    has: function(key) {
                        return typeof inst.get(key) !== "undefined";
                    },

                    /**
                     * Retrieves a value from the stash instance named `key`. Internally this will check if the value has expired before returning it.
                     *
                     * @memberof Stash#
                     * @function get
                     * @param {String} key - The name of the key.
                     * @returns {*} - The value.
                     *
                     * @example
                     * var something = stash.get("something");
                     */
                    get: function(key) {
                        var item = inst.data[key];
                        if (isWrappedItem(item)) {
                            if (!garbageCollectItem(inst, key, item)) {
                                return item.v;
                            }
                        } else {
                            return item;
                        }
                    },

                    /**
                     * Stores a `value` in the stash instance under the name `key`.
                     *
                     * <div class="banner banner-warning">{@link Stash#save} must be called in order to commit changes and persist the current state of the stash to its provider.</div>
                     *
                     * @memberof Stash#
                     * @function set
                     * @param {String} key - The name of the key.
                     * @param {*} value - The value to store.
                     * @param {StashSetItemOptions} [options]
                     * @param {boolean} [options.essential] Marks the item as essential
                     * meaning that it will be availble to read/write even when User Consent
                     * Mode is active and the user has not given consent.
                     * @param {String} [options.expires] - Expiry string.
                     *
                     * - `sk` - Expire object when session key changes.
                     * - `Xms` - Expire object after `X` milliseconds.
                     * - `Xs` - Expire object after `X` seconds.
                     * - `Xm` - Expire object after `X` minutes.
                     * - `Xh` - Expire object after `X` hours.
                     * - `Xd` - Expire object after `X` days.
                     *
                     * @example
                     * // Store the username, forever.
                     * stash.set("username", "mattbenton");
                     *
                     * // Store the username, until the session key changes.
                     * stash.set("username", "mattbenton", "sk");
                     *
                     * // Store the username, for the next 3 hours and 10 minutes.
                     * stash.set("username", "mattbenton", "3h, 10m");
                     *
                     * // Store the username, for the next 3 hours or until the session key changes.
                     * stash.set("username", "mattbenton", "3h, sk");
                     */
                    set: function(key, value, options) {
                        /**
                         * @type {StashItem}
                         */
                        var item = inst.data[key] = {
                            v: value
                        };

                        if (arguments.length > 2) {
                            if (typeof options !== "object") {
                                options = {
                                    expires: options
                                };
                            }
                        }

                        if (options && stashCreateOptions.defaultSetOptions) {
                            options = _.merge({},
                                stashCreateOptions.defaultSetOptions,
                                options
                            );
                        }

                        var expires = options && options.expires;
                        if (expires) {
                            expires = normalizeExpiryExpr(expires);
                            if (expires) {
                                // @ts-ignore
                                item.e = expires;
                            }

                            if (expires.indexOf("sk") >= 0) {
                                inst.data.$sk = Config.sessionKey;
                            }
                        }

                        if (options && options.essential) {
                            item.essential = true;
                            // log('set item "' + key + '" to essential');
                        }
                    },

                    /**
                     * Removes a key from the stash instance.
                     *
                     * <div class="banner banner-warning">{@link Stash#save} must be called in order to commit changes and persist the current state of the stash to its provider.</div>
                     *
                     * @memberof Stash#
                     * @function del
                     * @param {String} key - The name of the key.
                     */
                    del: function(key) {
                        delete inst.data[key];
                    },

                    /**
                     * Runs the internal garbage collection algorithm on the stash instance, removing any expired items.
                     *
                     * <div class="banner banner-warning">{@link Stash#save} must be called in order to commit changes and persist the current state of the stash to its provider.</div>
                     *
                     * @memberof Stash#
                     * @function gc
                     */
                    gc: function() {
                        var data = inst.data || {};
                        for (var key in data) {
                            var item = data[key];
                            garbageCollectItem(inst, key, item);
                        }
                    }
                };

                return inst;
            }
        };

        function isWrappedItem(item) {
            return item && _.isPlainObject(item) && item.hasOwnProperty("v");
        }

        /**
         * @param {*} stash
         * @param {string} key
         * @param {StashItem} item
         * @returns
         */
        function garbageCollectItem(stash, key, item) {
            if (isWrappedItem(item)) {
                if (item.hasOwnProperty("e") && isExpired(item.e, stash)) {
                    // Log('GC expired item "' + key + '"', item);
                    delete stash.data[key];
                    return true;
                }
                if (
                    Config.userConsentMode &&
                    !Config.userConsentStatus &&
                    !item.essential
                ) {
                    // Log('GC non-essential item "' + key + '"', item);
                    delete stash.data[key];
                    return true;
                }
            }
        }

        var TIME_UNIT_TO_MS = {
            "ms": 1,
            "s": 1000,
            "m": 1000 * 60,
            "h": 1000 * 60 * 60,
            "d": 1000 * 60 * 60 * 24
        };

        function normalizeExpiryExpr(expr) {
            var now = new Date().getTime();
            var parts = [];
            _.each(String(expr).split(","), function(expr) {
                expr = _.trim(expr);
                var match = expr.match(/(\d+)\s*(ms|s|m|h|d)/i);
                if (match) {
                    var amount = parseInt(match[1], 10);
                    now += (TIME_UNIT_TO_MS[match[2]] || 1) * amount;
                    parts.push(Math.ceil(now / 1000));
                }

                if (expr === "sk" || expr === "sessionKey") {
                    parts.push("sk");
                }
            });
            return parts.join(",");
        }

        /**
         * Returns seconds or "sk".
         */
        // function getExpireValue ( expires ) {
        //   var now = new Date().getTime();
        //   if ( typeof expires === "number" ) {
        //     return Math.ceil((now + expires) / 1000);
        //   }

        //   if ( typeof expires === "string" ) {
        //     var match = expires.match(/(\d+)\s*(ms|s|m|h|d)/i);
        //     if ( match ) {
        //       var amount = parseInt(match[1], 10);
        //       now += (TIME_UNIT_TO_MS[match[2]] || 1) * amount;
        //       return Math.ceil(now / 1000);
        //     }

        //     if ( expires === "sk" || expires === "sessionKey" ) {
        //       return "sk";
        //     }
        //   }
        // }

        function isExpired(expr, stash) {
            var values = String(expr).split(",");
            for (var i = 0; i < values.length; i++) {
                /** @type {any} */
                var value = values[i];
                if (_.isNumeric(value)) {
                    value = parseInt(value, 10);
                    var now = Math.ceil(new Date().getTime() / 1000);
                    if (now >= value) {
                        return true;
                    }
                }

                if (value === "sk" && stash.data.$sk !== Config.sessionKey) {
                    return true;
                }
            }

            // if ( typeof expires === "number" ) {
            //   var now = Math.ceil(new Date().getTime() / 1000);
            //   return now >= expires;
            // }

            // if ( expires === "sk" && stash.data.$sk !== Config.sessionKey ) {
            //   return true;
            // }
        }

        return Stash;
    });

    define('platform/configStash', ['require', 'platform/utils', 'platform/jquery', 'platform/config', 'platform/json', 'platform/xds', 'platform/log', 'platform/cookie', 'platform/stash', 'platform/webPush/api', 'platform/linkDecorator', 'platform/capabilities', 'platform/storageMode'], function(require) {
        var _ = require('platform/utils');
        var $ = require('platform/jquery');
        var Config = require('platform/config');
        var JSON = require('platform/json');
        var XDS = require('platform/xds');
        var log = require('platform/log').create('platform:config-stash');
        var Cookie = require('platform/cookie');
        var Stash = require('platform/stash');
        var webPush = require('platform/webPush/api');
        var linkDecorator = require('platform/linkDecorator');
        var capabilities = require('platform/capabilities');
        var STORAGE_MODE = require('platform/storageMode');

        var hasInitialized = false;

        /** @type {Platform.Stash.StashInstance | undefined} */
        var remoteStash;

        var FANPLAYR_STORE_COOKIE = "fanplayr";
        var FANPLAYR_ESSENTIAL_STORE_COOKIE = "fanplayr_";
        var FANPLAYR_SESSION_CHANGE_COOKIE = "fanplayr_sc";

        // Used to detect if sessionKey changed during `save()`.
        var LAST_SESSION_KEY;

        /**
         * Loads the persisted platform properties (`userKey`, `sessionKey` and `sessionEndpoint`).
         *
         * @memberof config#
         * @function load
         * @param {Function} [callback] - The callback to invoke once loading is complete.
         */
        Config.load = function(callback) {
            init();

            var initSessionEndpoint = Config.sessionEndpoint;
            Config.sessionEndpoint = null;

            var tasks = [];
            var isNewBrowserSession = false;

            var linkInfo = linkDecorator.getInfo();
            if (linkInfo) {
                assign({
                    sessionKey: linkInfo.sessionKey
                }, 'linkDecorator_' + linkInfo.source);
                if (linkInfo.storeDomain) {
                    Config.storeDomain = linkInfo.storeDomain;
                }
            }

            if (STORAGE_MODE === 'tunnel' && XDS.isEnabled) {
                tasks.push(function(next) {
                    XDS.getUserKey(function(err, userKey) {
                        assign({
                            userKey: userKey
                        }, 'xds');
                        next();
                    });
                });

                tasks.push(function(next) {
                    XDS.getSessionCookie(FANPLAYR_SESSION_CHANGE_COOKIE, function(err, value) {
                        if (!value) {
                            isNewBrowserSession = true;
                        }
                        next();
                    });
                });
            }

            if (STORAGE_MODE !== 'tunnel') { // 'store' or 'migrate'
                if (!sessionStorage.getItem(FANPLAYR_SESSION_CHANGE_COOKIE)) {
                    isNewBrowserSession = true;
                }
            }

            tasks.push(function(next) {
                readStoreCookie();
                next();
            });

            if (
                XDS.isEnabled &&
                remoteStash &&
                canUseNonEssentialUserData()
            ) {
                tasks.push(function(next) {
                    // @ts-expect-error
                    remoteStash.load(function() {
                        // @ts-expect-error
                        assign(remoteStash.data, 'remote_stash');
                        next();
                    });
                });
            }

            tasks.push(function(next) {
                var PrivacyID = window.PrivacyID;
                var scriptKey = capabilities.getPrivacyId();
                if (
                    typeof PrivacyID === 'function' &&
                    scriptKey &&
                    typeof scriptKey === 'string'
                ) {
                    var timeoutId = setTimeout(function() {
                        // Prevent waiting forever.
                        next();
                    }, 2000);
                    PrivacyID('getIdentity', scriptKey, function(identity) {
                        Config.privacyIdUserKey = identity;
                        clearInterval(timeoutId);
                        next();
                    });
                } else {
                    // Skip if not enabled.
                    next();
                }
            });

            tasks.push(function(next) {
                if (!Config.userKey && canUseNonEssentialUserData()) {
                    readSecureUserCookie(function(userKey) {
                        assign({
                            userKey: userKey
                        }, 'secureUserCookie');
                        next();
                    });
                } else {
                    next();
                }
            });

            if (webPush.isSupported()) {
                // The web push module relies on promises and checks for their
                // availability so we can use promise-based functions in this block.
                // Create a task that waits up to 3 seconds to get the current push
                // subscription state.
                tasks.push(function(next) {
                    _.promiseTimeout(
                        webPush.getPushInfo(),
                        3000,
                        function() {
                            // This object is created when the process times out with the
                            // primary purpose of returning with `isSupported: false` and no
                            // subscription. It is worth noting that when using the popup flow
                            // the `permission` and `hostname` values will not reflect the
                            // actual state of the popup domain.
                            /** @type {Platform.WebPush.PushInfo} */
                            var info = {
                                isSupported: false,
                                permission: Notification && Notification.permission,
                                subscription: null,
                                oldSubscription: null,
                                swVer: 'u',
                                hostname: location.hostname,
                                status: 'timeout',
                                method: 'unknown'
                            };
                            return info;
                        }
                    ).then(function(info) {
                        Config.pushInfo = info;
                        next();
                    });
                });
            }

            _.series(tasks, function(err, results) {
                if (!Config.uuid) {
                    Config.uuid = generateUUID();
                }

                var sessionEndpoint = Config.sessionEndpoint;
                if (initSessionEndpoint !== sessionEndpoint && !checkSessionEndpoint(sessionEndpoint)) {
                    log("reverted sessionEndpoint from '" + sessionEndpoint + "' to '" + initSessionEndpoint + "'");
                    Config.sessionEndpoint = initSessionEndpoint;
                    writeStoreCookie();
                }

                if (!Config.sessionEndpoint) {
                    Config.sessionEndpoint = initSessionEndpoint;
                }

                if (callback) {
                    callback({
                        isNewBrowserSession: isNewBrowserSession
                    });
                }
            });
        };

        /**
         * Saves the persisted platform properties (`userKey`, `sessionKey` and `sessionEndpoint`).
         *
         * @memberof config#
         * @function save
         */
        Config.save = function() {
            init();

            var didChangeSession = LAST_SESSION_KEY !== Config.sessionKey;
            LAST_SESSION_KEY = Config.sessionKey;

            writeStoreCookie();

            if (didChangeSession && canUseNonEssentialUserData()) {
                writeSecureUserCookie(Config.userKey);
            }

            if (XDS.isEnabled && remoteStash && canUseNonEssentialUserData()) {
                remoteStash.data = {
                    userKey: Config.userKey,
                    sessionKey: Config.sessionKey,
                    sessionEndpoint: Config.sessionEndpoint,
                    displayedWidgets: remoteStash.data.displayedWidgets || []
                };
                remoteStash.save();

                if (STORAGE_MODE === 'tunnel') {
                    XDS.setUserKey(Config.userKey);
                    XDS.setSessionCookie(FANPLAYR_SESSION_CHANGE_COOKIE, 1);
                }
            }

            if (STORAGE_MODE !== 'tunnel') { // 'store' or 'migrate'
                sessionStorage.setItem(FANPLAYR_SESSION_CHANGE_COOKIE, String(new Date().getTime()));
            }
        };

        Config.getWidgetDisplayCountById = function(widgetId) {
            return (Config.widgetDisplayCounts || {})[widgetId] || 0;
        };
        Config.setWidgetDisplayCounts = function(map) {
            Config.widgetDisplayCounts = map;
        };

        /**
         * @param {string} cookieName
         */
        function _readStoreCookie(cookieName) {
            try {
                var cookieValue = Cookie.get(cookieName);
                if (cookieValue) {
                    var data = JSON.parse(cookieValue);
                    var now = new Date().getTime();
                    var dt = typeof data.t === "number" && now - data.t;
                    assign({
                        uuid: data.uuid,
                        userKey: data.uk,
                        sessionKey: data.sk,
                        sessionEndpoint: data.se
                    }, 'store_cookie:' + cookieName);
                }
            } catch (ex) {}
        }

        function readStoreCookie() {
            // Attempt to read non-essential cookie
            if (canUseNonEssentialUserData()) {
                _readStoreCookie(FANPLAYR_STORE_COOKIE);
            }
            // Fallback to essential cookie only when consent mode is enabled
            if (Config.userConsentMode) {
                _readStoreCookie(FANPLAYR_ESSENTIAL_STORE_COOKIE);
            }
        }

        /**
         * @param {string} cookieName
         * @param {Platform.Cookie.SetOptions} options
         */
        function _writeStoreCookie(cookieName, options) {
            var data = {
                uuid: Config.uuid || "",
                uk: Config.userKey || "",
                sk: Config.sessionKey || "",
                se: Config.sessionEndpoint || "",
                // If not always using the tunnel, mark as having migrated.
                // @See storageMode.js
                tm: STORAGE_MODE !== 'tunnel' ? 1 : 0,
                t: new Date().getTime()
            };
            Cookie.set(cookieName, JSON.stringify(data), options);
        }

        function writeStoreCookie() {
            if (Config.userConsentMode) {
                _writeStoreCookie(FANPLAYR_ESSENTIAL_STORE_COOKIE, {
                    expires: 'session'
                });
                if (!Config.userConsentStatus) {
                    // Remove the non-essential cookie if it exists
                    var value = Cookie.get(FANPLAYR_STORE_COOKIE);
                    if (value) {
                        log('Delete non-essential store cookie');
                        Cookie.remove(FANPLAYR_STORE_COOKIE);
                    }
                }
            }
            if (canUseNonEssentialUserData()) {
                _writeStoreCookie(FANPLAYR_STORE_COOKIE, {
                    expires: 'never'
                });
            }
        }

        function readSecureUserCookie(cb) {
            var info = capabilities.getConnectInfo();
            if (info && info.endpoint) {
                $.ajax({
                    url: info.endpoint,
                    dataType: 'json',
                    timeout: 2000,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function(data) {
                        var value = data && data.value;
                        if (!isValueUserKey(value)) {
                            value = null;
                        }
                        cb(value);
                    },
                    error: function(err) {
                        cb(null);
                    }
                });
            } else {
                cb(null);
            }
        }

        function writeSecureUserCookie(userKey) {
            var info = capabilities.getConnectInfo();
            if (info && info.endpoint) {
                $.ajax({
                    url: info.endpoint,
                    data: {
                        data: JSON.stringify({
                            value: userKey,
                            ts: Date.now()
                        }),
                        domain: info.baseDomain || ''
                    },
                    dataType: 'json',
                    timeout: 5000,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true
                });
            }
        }

        function generateUUID() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return (+new Date()) + '-' + s4() + s4() + s4() + s4() + s4() + s4();
        }

        function canUseNonEssentialUserData() {
            return !Config.userConsentMode || Config.userConsentStatus === true;
        }

        function init() {
            if (!hasInitialized) {
                hasInitialized = true;
                if (XDS.isEnabled) {
                    /** @type {Platform.Stash.CreateStashOptions} */
                    var options = {
                        name: "fanplayr:platform",
                        provider: "remoteStorage"
                    };

                    if (Config.namespace) {
                        options.name += ":" + Config.namespace;
                    } else {
                        options.scope = "domain";
                    }

                    remoteStash = Stash.create(options);
                }
            }
        }

        function isDefined(value) {
            return value && _.trim(String(value)).toLowerCase() !== 'undefined';
        }

        function getValidValue(value) {
            if (isDefined(value)) {
                return value;
            }
            return null;
        }

        function assign(props, debugSource) {
            // log('assign from', debugSource, props);
            if (props) {
                Config.uuid = Config.uuid || getValidValue(props.uuid);
                Config.userKey = Config.userKey || getValidValue(props.userKey);
                Config.sessionKey = Config.sessionKey || getValidValue(props.sessionKey);
                Config.sessionEndpoint = Config.sessionEndpoint || getValidValue(props.sessionEndpoint);
                LAST_SESSION_KEY = Config.sessionKey;
                if (!Config.userKeySource && Config.userKey) {
                    Config.userKeySource = debugSource;
                    log('Set userKey to %o from source %o', Config.userKey, debugSource);
                }
                if (!Config.sessionKeySource && Config.sessionKey) {
                    Config.sessionKeySource = debugSource;
                    log('Set sessionKey to %o from source %o', Config.sessionKey, debugSource);
                }
            }
        }

        function checkSessionEndpoint(endpoint) {
            switch (Config.environment) {
                case "development":
                    return /site\.fanplayr/.test(endpoint);
                case "staging":
                    return /(stage|w1s)\.fanplayr\.com/.test(endpoint);
                case "production":
                    return /(my|w1|e1)\.fanplayr\.com/.test(endpoint);
            }
        }

        function isValueUserKey(value) {
            return /^\d.[a-zA-Z0-9]{19}\.\d{10}/.test(value);
        }
    });

    define('platform/googleDataLayerSampler', ['require', 'platform/utils', 'platform/config', 'platform/json'], function(require) {
        var _ = require('platform/utils');
        var config = require('platform/config');
        var JSON = require('platform/json');

        // Our tracking API endpoint.
        var endpoint = 'https://ga.fanplayr.com/collect';

        /**
         * The data layer array being watched.
         * @type {any[] | undefined}
         */
        var dataLayer;

        /**
         * A queue of pending records to send to our API.
         * @type {DataLayerRecord[]}
         */
        var trackingQueue = [];

        // Create a unique ID of the page view so we can differentiate between full page
        // refreshes to the same URL.
        var pageId = _.uuid();

        var sampleGroupStorageKey = 'fp_dl_sample_group';

        // Flush the queue 1 second after the last entry was added.
        var debouncedFlushQueue = _.debounce(flushQueue, 1000);

        // Debug logging function (noop unless debugging is enabled).
        /** @type {Function} */
        var debug = function() {};

        /**
         * @typedef Payload
         * @property {string} pageUrl The current page URL
         * @property {number} timestamp The timestamp of sending the payload
         * @property {string | undefined} sessionKey The Fanplayr session key.
         * @property {string} accountKey The Fanplayr account key.
         * @property {string} pageId A UUID of the page.
         * @property {DataLayerRecord[]} records
         */

        /**
         * @typedef DataLayerRecord
         * @property {number} timestamp The timestamp the record was captured.
         * @property {number} index The index of the record in the data layer.
         * @property {object} data The actual data layer entry.
         */

        /** @type {Platform.GoogleDataLayerSampler.InitOptions} */
        var defaultInitOptions = {
            dataLayerName: 'dataLayer',
            batchSize: 10,
            sampleRate: 1,
            debug: false,
            extraPayloadParams: {}
        };

        /** @type {Platform.GoogleDataLayerSampler.InitOptions} */
        var options = defaultInitOptions;

        /**
         * @param {any} entry
         * @param {number} index
         */
        function addItem(entry, index) {
            try {
                // Check to see if the entry is an Arguments object and transform it to
                // something that will serialize better for our internal sampling.
                if (String(entry) === '[object Arguments]') {
                    entry = {
                        $type: 'Arguments',
                        values: [].slice.call(entry, 0)
                    };
                }
                /** @type {DataLayerRecord} */
                var record = {
                    timestamp: Date.now(),
                    index: index,
                    data: entry
                };
                trackingQueue.push(record);
                debouncedFlushQueue();
            } catch (ex) {
                debug('Caught', ex);
            }
        }

        /**
         * Batches all records in the tracking queue and sends them to our API.
         */
        function flushQueue() {
            // Create a copy of the queue so we can immediately clear it for new items.
            var items = trackingQueue.slice();
            trackingQueue = [];
            debug('Flush queue', items);

            if (!items.length) {
                return;
            }

            // Create batches of messages and send them.
            var chunks = getChunks(items, options.batchSize);
            debug('Sending ' + chunks.length + ' chunks', chunks);

            _.forEach(chunks, function(chunk) {
                try {
                    /** @type {Payload} */
                    var payload = _.mergeDeep({
                        pageId: pageId,
                        pageUrl: location.href,
                        sessionKey: config.sessionKey,
                        accountKey: config.accountKey,
                        timestamp: Date.now(),
                        records: chunk
                    }, options.extraPayloadParams);
                    debug('Sending payload', payload);
                    navigator.sendBeacon(endpoint, JSON.stringify(payload));
                } catch (ex) {
                    debug('Caught', ex);
                }
            });
        }

        /**
         * Splits an array into groups of smaller arrays of size `batchSize`.
         *
         * @template TItem
         * @param {TItem[]} array The array of items.
         * @param {number} batchSize The maximum number of items to put in each chunk.
         * @returns {TItem[][]} An array of chunks.
         */
        function getChunks(array, batchSize) {
            var chunks = [];
            if (array.length < batchSize) {
                chunks.push(array);
            } else {
                var copy = array.slice();
                var chunk = [];
                chunks.push(chunk);
                while (copy.length) {
                    var value = copy.shift();
                    if (chunk.length < batchSize) {
                        chunk.push(value);
                    } else {
                        chunk = [value];
                        chunks.push(chunk);
                    }
                }
            }
            return chunks;
        }

        /**
         * Initializes the data layer sampler.
         *
         * @param {Partial<Platform.GoogleDataLayerSampler.InitOptions>} [_options]
         */
        function init(_options) {
            try {
                options = _.mergeDeep({}, defaultInitOptions, _options || {});

                if (options.debug) {
                    debug = window.console.log.bind(window.console, '[FP GA Sampler]');
                } else {
                    debug = function() {};
                }

                debug('Configured with options', options);

                if (!navigator.sendBeacon) {
                    debug('Browser does not support sendBeacon');
                    return;
                }

                if (dataLayer) {
                    debug('Skip, already enabled');
                    return;
                }

                if (typeof options.sampleRate === 'number' && options.sampleRate < 1) {
                    /** @type {'control' | 'targeted' | null} */
                    // @ts-expect-error
                    var group = sessionStorage.getItem(sampleGroupStorageKey);
                    if (!group) {
                        group = Math.random() <= options.sampleRate ? 'targeted' : 'control';
                        sessionStorage.setItem(sampleGroupStorageKey, group);
                        debug('Placed session in group', group);
                    } else {
                        debug('Session is in group:', group);
                    }
                    if (group === 'control') {
                        debug('Skip sampling');
                        return;
                    }
                }

                dataLayer = window[options.dataLayerName];
                if (!Array.isArray(dataLayer)) {
                    debug('Data layer array not found with name "' + options.dataLayerName + '"');
                    // Data layer doesn't exist so do nothing.
                    return;
                }

                var currentLength = dataLayer.length;
                debug('Initial length is', currentLength);

                // Process the initial items in the data layer.
                if (currentLength > 0) {
                    _.forEach(dataLayer, function(entry, index) {
                        debug('Process initial entry #' + index, entry);
                        addItem(entry, index);
                    });
                }

                // Keep a reference to the original `push` method.
                var originalPushMethod = dataLayer.push;
                // Modify the `push` method to listen for new items being added making sure
                // we call the original method and return the result.
                dataLayer.push = function() {
                    // Create a copy of the arguments.
                    var args = [].slice.call(arguments, 0);
                    // Invoke the original `push` method with the arguments.
                    var newLength = originalPushMethod.apply(dataLayer, args);
                    try {
                        _.forEach(args, function(entry) {
                            debug('Add new entry #' + currentLength, args);
                            addItem(entry, currentLength++);
                        });
                    } catch (ex) {
                        debug('Caught', ex);
                    }
                    // Make sure to return the original result of the push.
                    return newLength;
                };
            } catch (ex) {
                debug('Caught', ex);
            }
        }

        return {
            init: init
        };
    });

    define('platform/api', ['require', 'fanplayr', 'platform', 'platform/afn', 'platform/config', 'platform/json', 'platform/jquery', 'platform/webPush/api', 'platform/state', 'platform/utils', 'platform/googleDataLayerSampler'], function(require) {
        var fanplayr = require('fanplayr');
        var platform = require('platform');
        var Afn = require('platform/afn');
        var Config = require('platform/config');
        var JSON = require('platform/json');
        var $ = require('platform/jquery');
        var webPush = require('platform/webPush/api');
        var state = require('platform/state');
        var _ = require('platform/utils');
        var dataLayerSampler = require('platform/googleDataLayerSampler');

        fanplayr.getSessionInfo = (function() {
            var queue = [];
            var lastInfo = null;
            platform.on('track', {
                init: true
            }, function() {
                lastInfo = {
                    userKey: Config.userKey,
                    sessionKey: Config.sessionKey,
                    sessionEndpoint: Config.sessionEndpoint
                };
                while (queue.length) {
                    queue.shift()(lastInfo);
                }
            });
            return function(callback) {
                if (callback) {
                    if (lastInfo) {
                        callback(lastInfo);
                    } else {
                        queue.push(callback);
                    }
                }
                return lastInfo;
            };
        }());

        function getCart() {
            /** @type {Partial<Platform.State.SerializedCart>} */
            var cart = state.cart.serialize() || {};
            if (cart) {
                delete cart.cartAction;
                delete cart.data;
                delete cart.lineItemCount;
                delete cart.totalQuantity;
                delete cart.quoteId;
                delete cart.repeat;
                cart.products = _.map(cart.products || [], function(product) {
                    // @ts-ignore
                    delete product.data;
                    return product;
                });
            }
            return cart;
        }

        fanplayr.collectEmail = function(opts, callback) {
            platform.once('track', {
                init: true
            }, function() {
                $.ajax({
                    url: '//' + Config.sessionEndpoint + '/external.Genius/',
                    data: {
                        a: 'collectEmailV2',
                        req: JSON.stringify({
                            sessionKey: Config.sessionKey,
                            email: opts.email,
                            espListId: opts.espListId,
                            cartData: getCart(),
                            widgetId: opts.widgetId,
                            widgetRevisionId: opts.widgetRevisionId,
                            widgetScope: opts.widgetScope
                        })
                    },
                    dataType: 'jsonp',
                    complete: function() {
                        if (callback) {
                            callback();
                        }
                    }
                });
            });
        };

        fanplayr.webPushSubscribe = function() {
            return webPush.subscribe();
        };

        fanplayr.trackAfn = function(trackers) {
            // Supports object or array of objects.
            Afn.track(trackers);
        };

        /**
         * Decorates a link with the current values of {@link config#sessionKey} and
         * {@link config#storeDomain} so that the session can continue across domains.
         *
         * This is intented to be used by customers where they are using JavaScript
         * to dynamically redirect the user across domains.
         *
         * @function fanplayr#decorateLink
         * @param {String} _url
         * @return {String} The modified url.
         *
         * @example
         * fanplayr.decorateLink("https://checkout.store.com/?cart=1234")
         * // → "https://checkout.store.com/?cart=1234&fp_sk=_98637555bf7df117a65fd7c637f7baec&fp_domain=store.com"
         */
        fanplayr.decorateLink = function(_url) {
            if (Config.sessionKey) {
                try {
                    var url = _.parseUrl(_url);
                    url.params.fp_sk = '_' + Config.sessionKey;
                    if (Config.storeDomain) {
                        url.params.fp_domain = Config.storeDomain;
                    }
                    return url.compile();
                } catch (ex) {}
            }
            return _url;
        };

        fanplayr.push = function(action, opts, callback) {
            if (action === 'collectEmail') {
                // @ts-ignore
                fanplayr.collectEmail(opts, callback);
            } else if (action === 'webPushSubscribe') {
                fanplayr.webPushSubscribe();
            } else if (action === 'trackAfn') {
                // @ts-ignore
                fanplayr.trackAfn(opts);
            } else if (action === 'dataLayerSampler') {
                dataLayerSampler.init(opts);
            }
        };
    });

    define('platform/siteSpeed', ['require', 'platform', 'platform/config', 'platform/state', 'platform/utils', 'platform/json'], function(require) {
        var platform = require('platform');
        var platformConfig = require('platform/config');
        var platformState = require('platform/state');
        var utils = require('platform/utils');
        var JSON = require('platform/json');
        // var log = require('platform/log').create('platform:site-speed');
        var performance = window.performance;

        var ENDPOINT = 'https://site-speed.fanplayr.com/collect';
        var DEFAULT_MAX_RECORDS = 150;

        // Schedule metric tracking after the current page view response is returned.
        platform.on('track:page', function(pageResponse) {
            try {
                /** @type {Platform.SiteSpeed.Config} */
                var config = pageResponse.siteSpeed;
                if (config === true) {
                    config = {};
                }
                if (performance && config && typeof config === 'object') {
                    scheduleTrack(config);
                }
            } catch (ex) {}
        });

        /**
         * Schedules tracking
         * @param {Platform.SiteSpeed.Config} config
         */
        function scheduleTrack(config) {
            var didTimeout = false;
            var isDomReady = false;
            var didMinWait = false;
            var widgetReady = false;
            var didTrack = false;
            var now = performance.now();

            function check() {
                var isReady = didTimeout || (isDomReady && didMinWait && widgetReady);
                if (isReady && !didTrack) {
                    didTrack = true;
                    track(config);
                }
            }
            // Handle minimum wait time.
            var minWaitMs = isNumber(config.minWait) ?
                config.minWait * 1000 :
                0;
            setTimeout(function() {
                didMinWait = true;
                check();
            }, minWaitMs);
            // Handle overall timeout.
            var maxWaitMs = isNumber(config.maxWait) ?
                config.maxWait * 1000 - now :
                0;
            if (maxWaitMs > 0) {
                setTimeout(function() {
                    didTimeout = true;
                    check();
                }, maxWaitMs);
            }
            // Handle DOM ready.
            utils.domReady(function() {
                isDomReady = true;
                check();
            });
            // Handle widgets processed.
            platform.once('widgets:processed', {
                init: true
            }, function() {
                widgetReady = true;
                check();
            });
        }

        // Order for navigation timing properties.
        var TIMING_PROPS = [
            'navigationStart',
            'unloadEventStart',
            'unloadEventEnd',
            'redirectStart',
            'redirectEnd',
            'fetchStart',
            'domainLookupStart',
            'domainLookupEnd',
            'connectStart',
            'connectEnd',
            'secureConnectionStart',
            'requestStart',
            'responseStart',
            'responseEnd',
            'domLoading',
            'domInteractive',
            'domContentLoadedEventStart',
            'domContentLoadedEventEnd',
            'domComplete',
            'loadEventStart',
            'loadEventEnd'
        ];

        // Order and format for resource entries.
        var RESOURCE_PROPS = [{
                name: 'name',
                type: 'string'
            },
            {
                name: 'startTime',
                type: 'number'
            },
            {
                name: 'duration',
                type: 'number'
            },
            {
                name: 'initiatorType',
                type: 'string'
            },
            {
                name: 'nextHopProtocol',
                type: 'string'
            },
            {
                name: 'workerStart',
                type: 'number'
            },
            {
                name: 'redirectStart',
                type: 'number'
            },
            {
                name: 'redirectEnd',
                type: 'number'
            },
            {
                name: 'fetchStart',
                type: 'number'
            },
            {
                name: 'domainLookupStart',
                type: 'number'
            },
            {
                name: 'domainLookupEnd',
                type: 'number'
            },
            {
                name: 'connectStart',
                type: 'number'
            },
            {
                name: 'connectEnd',
                type: 'number'
            },
            {
                name: 'secureConnectionStart',
                type: 'number'
            },
            {
                name: 'requestStart',
                type: 'number'
            },
            {
                name: 'responseStart',
                type: 'number'
            },
            {
                name: 'responseEnd',
                type: 'number'
            },
            {
                name: 'transferSize',
                type: 'number'
            },
            {
                name: 'encodedBodySize',
                type: 'number'
            },
            {
                name: 'decodedBodySize',
                type: 'number'
            }
        ];

        /**
         * Serializes a resource entry to a smaller format.
         * @param {PerformanceEntry} entry
         * @param {number} index
         */
        function formatResourceEntry(entry, index) {
            var values = RESOURCE_PROPS.map(function(prop) {
                var value = entry[prop.name];
                if (prop.type === 'number') {
                    return isNumber(value) ? Math.round(value) : 0;
                } else if (prop.type === 'string') {
                    return typeof value === 'string' ? value : null;
                }
            });
            values.push(index);
            return values;
        }

        /**
         * @param {Platform.SiteSpeed.Config} config
         */
        function buildPayload(config) {
            try {
                var entries = performance.getEntries();
                var payload = {
                    version: 1,
                    accountKey: platformConfig.accountKey,
                    userKey: platformConfig.userKey,
                    sessionKey: platformConfig.sessionKey,
                    platformVersion: platformConfig.version,
                    pageType: platformState.page.type,
                    url: location.href,
                    transferSize: 0,
                    encodedBodySize: 0,
                    decodedBodySize: 0,
                    navigationType: null,
                    redirectCount: 0,
                    /** @type {any[]} */
                    timing: [],
                    /** @type {any[]} */
                    resources: []
                };
                // Build navigation timing metrics
                var timingMetrics = performance.timing;
                var navigationStart = timingMetrics.navigationStart;
                payload.timing = TIMING_PROPS.map(function(prop) {
                    var value = timingMetrics[prop];
                    if (!isNumber(value)) {
                        // Set any invalid number to the navigation start time so that when we
                        // compute the delta it results in zero.
                        value = navigationStart;
                    }
                    if (prop !== 'navigationStart') {
                        return Math.max(0, value - navigationStart);
                    }
                    return value;
                });
                // Format resource entries
                var hostnameRE = /^https:\/\/(.+?)\//;
                var hostnamePattern = new RegExp(config.hostnamePattern || '');
                var resourceNameRE = new RegExp(config.pattern || '');
                var resourceCount = 0;
                for (var i = 0, len = entries.length; i < len; i++) {
                    var entry = entries[i];
                    if (entry.entryType === 'navigation') {
                        // @ts-ignore
                        payload.navigationType = entry.type;
                        // @ts-ignore
                        payload.redirectCount = entry.redirectCount;
                    } else if (entry.entryType === 'resource') {
                        resourceCount++;
                        var hostnameMatch = hostnameRE.exec(entry.name);
                        if (!hostnameMatch ||
                            !hostnamePattern.test(hostnameMatch[1]) ||
                            !resourceNameRE.test(entry.name)
                        ) {
                            continue;
                        }
                        payload.resources.push(formatResourceEntry(entry, resourceCount - 1));
                        // @ts-ignore
                        if (isNumber(entry.transferSize)) {
                            // @ts-ignore
                            payload.transferSize += entry.transferSize;
                        }
                        // @ts-ignore
                        if (isNumber(entry.encodedBodySize)) {
                            // @ts-ignore
                            payload.encodedBodySize += entry.encodedBodySize;
                        }
                        // @ts-ignore
                        if (isNumber(entry.decodedBodySize)) {
                            // @ts-ignore
                            payload.decodedBodySize += entry.decodedBodySize;
                        }
                    }
                }
                var maxRecords = isNumber(config.maxRecords) ?
                    config.maxRecords :
                    DEFAULT_MAX_RECORDS;
                payload.resources = payload.resources.slice(0, maxRecords);
                return {
                    type: 'BQ-SITE-SPEED',
                    payload: {
                        customPayload: JSON.stringify(payload)
                    }
                };
            } catch (ex) {}
        }

        /**
         * @param {any} value
         * @returns {value is number}
         */
        function isNumber(value) {
            return typeof value === 'number' && !isNaN(value);
        }

        /**
         * @param {Platform.SiteSpeed.Config} config
         */
        function track(config) {
            try {
                var payload = buildPayload(config);
                window.fetch(ENDPOINT, {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (ex) {}
        }
    });

    /*!
     * jQuery-ajaxTransport-XDomainRequest - v1.0.4 - 2015-03-05
     * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
     * Copyright (c) 2015 Jason Moon (@JSONMOON)
     * Licensed MIT (/blob/master/LICENSE.txt)
     */
    define('platform/vendor/jquery.xdr', ['platform/jquery'], function($) {

        // Only continue if we're on IE8/IE9 with jQuery 1.5+ (contains the ajaxTransport function)
        if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) {
            return $;
        }

        var httpRegEx = /^(https?:)?\/\//i;
        var getOrPostRegEx = /^get|post$/i;
        var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');

        // ajaxTransport exists in jQuery 1.5+
        $.ajaxTransport('* text html xml json', function(options, userOptions, jqXHR) {

            // Only continue if the request is: asynchronous, uses GET or POST method, has HTTP or HTTPS protocol, and has the same scheme as the calling page
            if (!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || !httpRegEx.test(options.url) || !sameSchemeRegEx.test(options.url)) {
                return;
            }

            var xdr = null;

            return {
                send: function(headers, complete) {
                    var postData = '';
                    var userType = (userOptions.dataType || '').toLowerCase();

                    xdr = new XDomainRequest();
                    if (/^\d+$/.test(userOptions.timeout)) {
                        xdr.timeout = userOptions.timeout;
                    }

                    xdr.ontimeout = function() {
                        complete(500, 'timeout');
                    };

                    xdr.onload = function() {
                        var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                        var status = {
                            code: 200,
                            message: 'success'
                        };
                        var responses = {
                            text: xdr.responseText
                        };
                        try {
                            if (userType === 'html' || /text\/html/i.test(xdr.contentType)) {
                                responses.html = xdr.responseText;
                            } else if (userType === 'json' || (userType !== 'text' && /\/json/i.test(xdr.contentType))) {
                                try {
                                    responses.json = $.parseJSON(xdr.responseText);
                                } catch (e) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    //throw 'Invalid JSON: ' + xdr.responseText;
                                }
                            } else if (userType === 'xml' || (userType !== 'text' && /\/xml/i.test(xdr.contentType))) {
                                var doc = new ActiveXObject('Microsoft.XMLDOM');
                                doc.async = false;
                                try {
                                    doc.loadXML(xdr.responseText);
                                } catch (e) {
                                    doc = undefined;
                                }
                                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    throw 'Invalid XML: ' + xdr.responseText;
                                }
                                responses.xml = doc;
                            }
                        } catch (parseMessage) {
                            throw parseMessage;
                        } finally {
                            complete(status.code, status.message, responses, allResponseHeaders);
                        }
                    };

                    // set an empty handler for 'onprogress' so requests don't get aborted
                    xdr.onprogress = function() {};
                    xdr.onerror = function() {
                        complete(500, 'error', {
                            text: xdr.responseText
                        });
                    };

                    if (userOptions.data) {
                        postData = ($.type(userOptions.data) === 'string') ? userOptions.data : $.param(userOptions.data);
                    }
                    xdr.open(options.type, options.url);
                    xdr.send(postData);
                },
                abort: function() {
                    if (xdr) {
                        xdr.abort();
                    }
                }
            };
        });

        return $;
    });

    define('platform/detect', ['require', 'platform/log'], function(require) {
        var log = require('platform/log').create('platform:detect');
        var iOS_RE = /iPad|iPhone/i;
        var webkit_RE = /WebKit/i;
        // Chrome running on iOS
        var chromeOnIOS_RE = /CriOS/i;
        var mobile_RE = /Mobile|Android|BlackBerry/i;

        /**
         * @param {string} [ua] The user agent string
         */
        function parse(ua) {
            if (!ua) {
                ua = navigator.userAgent;
            }
            /** @type {Platform.Detect.ParseResult} */
            var result = {
                parse: parse,
                isMobile: mobile_RE.test(ua),
                isMobileSafari: (
                    iOS_RE.test(ua) &&
                    webkit_RE.test(ua) &&
                    !chromeOnIOS_RE.test(ua)
                )
            };
            return result;
        }

        var result = parse();
        log('result', result);
        return result;
    });
    /** @type {Fanplayr.Api} */
    // @ts-ignore
    var fanplayr = window.fanplayr = (window.fanplayr || {});

    /* global require:true */

    /** @ts-ignore */
    fanplayr.require = require;
    fanplayr.define = define;

    // When explicitly defining a named module we need to to manually specify the
    // dependencies. The `require` module must always be listed as the first
    // dependency, followed by all modules that are used with `require`.
    define('platform', ['require', 'platform/emitter'], function(require) {
        var EventEmitter = require('platform/emitter');
        return EventEmitter.mixin({});
    });

    define('fanplayr', [], function() {
        return fanplayr;
    });

    define('platform/platform', ['require', 'platform', 'platform/json', 'platform/jquery', 'platform/utils', 'platform/state', 'platform/config', 'platform/legacy', 'platform/tracking', 'platform/loader', 'platform/capabilities', 'platform/xds', 'platform/debug', 'platform/storageMode', 'platform/tunnel', 'platform/stash', 'platform/configStash', 'platform/api', 'platform/siteSpeed', 'platform/cdp', 'platform/vendor/jquery.xdr', 'platform/detect'], function(require) {
        var platform = require('platform');
        var JSON = require('platform/json');
        var $ = require('platform/jquery');
        var _ = require('platform/utils');
        var State = require('platform/state');
        var Config = require('platform/config');
        var Legacy = require('platform/legacy');
        var Tracking = require('platform/tracking');
        var Loader = require('platform/loader');
        var capabilities = require('platform/capabilities');
        var xds = require('platform/xds');
        var Debug = require('platform/debug');
        var STORAGE_MODE = require('platform/storageMode');

        // Require additional modules to ensure they are included in the bundle.
        require('platform/tunnel');
        require('platform/stash');
        require('platform/configStash');
        require('platform/api');
        require('platform/siteSpeed');
        require('platform/cdp');
        require('platform/vendor/jquery.xdr');
        require('platform/detect');

        var deferredGroup = _.createDeferredGroup();

        // DEBUG.mark('platform start');

        fanplayr.$ = $;
        fanplayr._ = _;

        fanplayr.platform = platform;
        platform.version = Config.version;

        platform.config = Config;
        platform.capabilities = capabilities;

        // 2019-03-25: Abort if there is no native support for JSON and track
        // the user agent once.
        if (!JSON) {
            Debug.trackOnce('noJson', {
                userAgent: navigator.userAgent
            });
            return;
        }

        Tracking.init(platform);
        platform.trackPage = deferredGroup.defer(Tracking.trackPage, 'trackPage');
        platform.trackOrder = deferredGroup.defer(Tracking.trackOrder, 'trackOrder');
        platform.trackEvent = deferredGroup.defer(Tracking.trackEvent, 'trackEvent');

        fanplayr.reinitialize = deferredGroup.defer(function(embedData) {
            State.clear();
            Legacy.fillState(embedData);
            autoFillState();
            platform.trackPage();
        }, 'reinitialize');

        var loadedOfferApi;

        function loadOfferApi() {
            if (!loadedOfferApi) {
                loadedOfferApi = true;
                Loader.load("services/offers");
            }
        }
        platform.once("offer", loadOfferApi);
        platform.once("exitIntent", loadOfferApi);

        platform.once("widget:preview", function() {
            Loader.load("services/widget");
        });

        // Triggered by tracking module.
        platform.once("widget", function() {
            Loader.load("services/widget");
        });

        platform.once("runtime", function() {
            Loader.load("services/runtime");
        });

        var loadedDebugService;
        var loadedDebugTool;
        platform.on('track:page', function(res) {
            if (!loadedDebugService && /fpdebugsession/.test(location.href)) {
                loadedDebugService = true;
                Loader.load('services/debug');
            }

            if (!loadedDebugTool && (
                    /fp_debug_config/.test(location.href) ||
                    localStorage.getItem('fp_debug_config')
                )) {
                loadedDebugTool = true;
                var script = document.createElement('script');
                script.type = 'module';
                script.src = 'https://cdn.fanplayr.com/client/debug-tool/debug-tool.js';
                document.body.append(script);
            }

            handleWidgetPreview();
        });

        /**
         * Looks for the "fp_widget_preview" query parameter in the URL and if found
         * uses the JSON data to preview a widget.
         */
        function handleWidgetPreview() {
            var match = /fp_widget_preview=([^&]+)/.exec(location.href);
            if (match) {
                try {
                    var data = JSON.parse(decodeURIComponent(match[1]));
                    Loader.load('services/runtime', function(err, runtime) {
                        if (runtime) {
                            runtime.loadPreview(data);
                        }
                    });
                } catch (ex) {}
            }
        }

        if (STORAGE_MODE === 'store') {
            loadConfig();
        } else {
            // DEBUG.mark('tunnel start');
            xds.checkEnabled(function() {
                // DEBUG.mark('tunnel loaded');
                // DEBUG.mark('config load');
                loadConfig();
            });
        }

        function loadConfig() {
            Config.load(function(info) {
                // DEBUG.mark('config loaded');
                // Mark that the platform is loaded and ready.
                fanplayr._loadState = 2;

                Tracking.trackFallbackOrder();

                if (info.isNewBrowserSession) {
                    platform.emit("newBrowserSession");
                }

                if (Legacy.fillState()) {
                    // DEBUG.mark('track page');
                    autoFillState();
                    platform.trackPage();
                } else {
                    var adaptorName = Loader.adaptor;
                    if (adaptorName) {
                        Loader.loadAdaptor(adaptorName, function(adaptor) {
                            // log("adaptor", adaptor);
                        });
                    }
                }

                fireReadyEvent();

                checkPreloadServices();
            });
        }

        function fireReadyEvent() {
            var readyFn = window.fanplayr_ready;
            if (typeof readyFn === "function") {
                readyFn(fanplayr, platform);
            }
            platform.emit("ready");
            deferredGroup.ready();
        }

        function autoFillState() {
            // Try and get the Image URL from the Facebook Graph og:image META property
            // if it hasn't been set yet. Only for product pages.
            if (State.page && State.page.type === 'prod' && State.page.product && (!State.page.product.image)) {
                var imageUrl = $('meta[property="og:image"]:first').attr('content');
                if (imageUrl) {
                    State.page.product.image = imageUrl;
                }
            }
        }

        function checkPreloadServices() {
            if (Config.accountKey === "e0e2a95fe7fba7379859362844ec29fc") {
                // log("preloading services");
                // HACK (Aug 7, 2015) - Preload EVERY service for Alitalia as their site
                // throws away most of the DOM, killing RequireJS.
                Loader.load("services/offers", function(err, api) {
                    // log("preloaded offer api");
                });

                Loader.load("services/offers-legacy", function(err, api) {
                    // log("preloaded offer widget");
                });

                Loader.load("services/intent", function(err, api) {
                    // log("preloaded exit intent widget");
                });
            }
        }
    });

    /**
     * The main platform module.
     *
     * This is exposed on the global `fanplayr` object as `fanplayr.platform`.
     *
     * @namespace platform
     */

    /**
     * Subscribe to an event on the platform.
     *
     * @memberof platform#
     * @function on
     * @see EventEmitter#on
     */

    /**
     * Subscribe to an event on the platform once.
     *
     * @memberof platform#
     * @function once
     * @see EventEmitter#once
     */

    /**
     * Emit an event on the platform.
     *
     * @memberof platform#
     * @function emit
     * @see EventEmitter#emit
     */

    /**
     * The platform version number.
     *
     * @memberof platform#
     * @var {String} version
     */

    /**
     * The config module.
     *
     * @memberof platform#
     * @var {config} config
     */

    /**
     * The state module.
     *
     * @memberof platform#
     * @var {state} state
     */

    /**
     * Track the current page.
     *
     * @memberof platform#
     * @function trackPage
     * @see tracking#trackPage
     */

    /**
     * Track the current order.
     *
     * @memberof platform#
     * @function trackOrder
     * @see tracking#trackOrder
     */

    /**
     * Debug a specific offer by forcing the platform to track a page view that will
     * respond with the offer being presented.
     *
     * @memberof platform#
     * @function debugOffer
     * @param {Object} info
     * @param {Number} info.id - The offer ID.
     * @param {String} info.hash - The current debug hash for the site, accessible from the *Engineering* tab in <reports.fanplayr.com>.
     */
    ;
    define('platform/webfont', ['require', 'platform/utils'], function(require) {
        var _ = require('platform/utils');
        var queue = [];
        var isLoading;
        // @ts-ignore
        var WebFont = window.WebFont;
        return {
            get: function(callback) {
                if (!WebFont) {
                    queue.push(callback);
                    if (!isLoading) {
                        isLoading = true;
                        require(["https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js"], function() {
                            // @ts-ignore
                            WebFont = window.WebFont;
                            _.each(queue, function(cb) {
                                cb(WebFont);
                            });
                        });
                    }
                } else {
                    callback(WebFont);
                }
            }
        };
    });


    require(["platform/platform"]);
}());
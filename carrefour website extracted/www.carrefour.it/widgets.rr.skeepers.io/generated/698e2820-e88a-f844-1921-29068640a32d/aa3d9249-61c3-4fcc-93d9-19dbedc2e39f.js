window.skpBus = window.skpBus || function() {
    var p = [];
    Array.prototype.push.apply(p, arguments);
    return (window.skpBus.p = window.skpBus.p || []).push(p);
}; /*! For license information please see aa3d9249-61c3-4fcc-93d9-19dbedc2e39f.js.LICENSE.txt */
var SkeepersBrandWidget;
(() => {
    var M = {
            954: (M, t) => {
                "use strict";
                t.w0 = void 0, t.w0 = function(M) {
                    return M ? function(M, t, e = !1) {
                        return parseFloat(Number(M).toFixed(t)).toLocaleString("en-GB", e ? {
                            minimumFractionDigits: t
                        } : {})
                    }(M, 1, !0) : "..."
                }
            },
            538: (M, t) => {
                "use strict";
                t.byteLength = function(M) {
                    var t = g(M),
                        e = t[0],
                        i = t[1];
                    return 3 * (e + i) / 4 - i
                }, t.toByteArray = function(M) {
                    var t, e, N = g(M),
                        r = N[0],
                        I = N[1],
                        D = new n(function(M, t, e) {
                            return 3 * (t + e) / 4 - e
                        }(0, r, I)),
                        j = 0,
                        o = I > 0 ? r - 4 : r;
                    for (e = 0; e < o; e += 4) t = i[M.charCodeAt(e)] << 18 | i[M.charCodeAt(e + 1)] << 12 | i[M.charCodeAt(e + 2)] << 6 | i[M.charCodeAt(e + 3)], D[j++] = t >> 16 & 255, D[j++] = t >> 8 & 255, D[j++] = 255 & t;
                    return 2 === I && (t = i[M.charCodeAt(e)] << 2 | i[M.charCodeAt(e + 1)] >> 4, D[j++] = 255 & t), 1 === I && (t = i[M.charCodeAt(e)] << 10 | i[M.charCodeAt(e + 1)] << 4 | i[M.charCodeAt(e + 2)] >> 2, D[j++] = t >> 8 & 255, D[j++] = 255 & t), D
                }, t.fromByteArray = function(M) {
                    for (var t, i = M.length, n = i % 3, N = [], r = 16383, g = 0, D = i - n; g < D; g += r) N.push(I(M, g, g + r > D ? D : g + r));
                    return 1 === n ? (t = M[i - 1], N.push(e[t >> 2] + e[t << 4 & 63] + "==")) : 2 === n && (t = (M[i - 2] << 8) + M[i - 1], N.push(e[t >> 10] + e[t >> 4 & 63] + e[t << 2 & 63] + "=")), N.join("")
                };
                for (var e = [], i = [], n = "undefined" != typeof Uint8Array ? Uint8Array : Array, N = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = 0; r < 64; ++r) e[r] = N[r], i[N.charCodeAt(r)] = r;

                function g(M) {
                    var t = M.length;
                    if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                    var e = M.indexOf("=");
                    return -1 === e && (e = t), [e, e === t ? 0 : 4 - e % 4]
                }

                function I(M, t, i) {
                    for (var n, N, r = [], g = t; g < i; g += 3) n = (M[g] << 16 & 16711680) + (M[g + 1] << 8 & 65280) + (255 & M[g + 2]), r.push(e[(N = n) >> 18 & 63] + e[N >> 12 & 63] + e[N >> 6 & 63] + e[63 & N]);
                    return r.join("")
                }
                i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63
            },
            104: (M, t, e) => {
                "use strict";
                var i = e(538),
                    n = e(494),
                    N = e(2);

                function r() {
                    return I.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                }

                function g(M, t) {
                    if (r() < t) throw new RangeError("Invalid typed array length");
                    return I.TYPED_ARRAY_SUPPORT ? (M = new Uint8Array(t)).__proto__ = I.prototype : (null === M && (M = new I(t)), M.length = t), M
                }

                function I(M, t, e) {
                    if (!(I.TYPED_ARRAY_SUPPORT || this instanceof I)) return new I(M, t, e);
                    if ("number" == typeof M) {
                        if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                        return o(this, M)
                    }
                    return D(this, M, t, e)
                }

                function D(M, t, e, i) {
                    if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                    return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(M, t, e, i) {
                        if (t.byteLength, e < 0 || t.byteLength < e) throw new RangeError("'offset' is out of bounds");
                        if (t.byteLength < e + (i || 0)) throw new RangeError("'length' is out of bounds");
                        return t = void 0 === e && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, e) : new Uint8Array(t, e, i), I.TYPED_ARRAY_SUPPORT ? (M = t).__proto__ = I.prototype : M = u(M, t), M
                    }(M, t, e, i) : "string" == typeof t ? function(M, t, e) {
                        if ("string" == typeof e && "" !== e || (e = "utf8"), !I.isEncoding(e)) throw new TypeError('"encoding" must be a valid string encoding');
                        var i = 0 | a(t, e),
                            n = (M = g(M, i)).write(t, e);
                        return n !== i && (M = M.slice(0, n)), M
                    }(M, t, e) : function(M, t) {
                        if (I.isBuffer(t)) {
                            var e = 0 | A(t.length);
                            return 0 === (M = g(M, e)).length || t.copy(M, 0, 0, e), M
                        }
                        if (t) {
                            if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (i = t.length) != i ? g(M, 0) : u(M, t);
                            if ("Buffer" === t.type && N(t.data)) return u(M, t.data)
                        }
                        var i;
                        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                    }(M, t)
                }

                function j(M) {
                    if ("number" != typeof M) throw new TypeError('"size" argument must be a number');
                    if (M < 0) throw new RangeError('"size" argument must not be negative')
                }

                function o(M, t) {
                    if (j(t), M = g(M, t < 0 ? 0 : 0 | A(t)), !I.TYPED_ARRAY_SUPPORT)
                        for (var e = 0; e < t; ++e) M[e] = 0;
                    return M
                }

                function u(M, t) {
                    var e = t.length < 0 ? 0 : 0 | A(t.length);
                    M = g(M, e);
                    for (var i = 0; i < e; i += 1) M[i] = 255 & t[i];
                    return M
                }

                function A(M) {
                    if (M >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");
                    return 0 | M
                }

                function a(M, t) {
                    if (I.isBuffer(M)) return M.length;
                    if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(M) || M instanceof ArrayBuffer)) return M.byteLength;
                    "string" != typeof M && (M = "" + M);
                    var e = M.length;
                    if (0 === e) return 0;
                    for (var i = !1;;) switch (t) {
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return e;
                        case "utf8":
                        case "utf-8":
                        case void 0:
                            return b(M).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * e;
                        case "hex":
                            return e >>> 1;
                        case "base64":
                            return _(M).length;
                        default:
                            if (i) return b(M).length;
                            t = ("" + t).toLowerCase(), i = !0
                    }
                }

                function z(M, t, e) {
                    var i = !1;
                    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                    if ((void 0 === e || e > this.length) && (e = this.length), e <= 0) return "";
                    if ((e >>>= 0) <= (t >>>= 0)) return "";
                    for (M || (M = "utf8");;) switch (M) {
                        case "hex":
                            return x(this, t, e);
                        case "utf8":
                        case "utf-8":
                            return f(this, t, e);
                        case "ascii":
                            return S(this, t, e);
                        case "latin1":
                        case "binary":
                            return d(this, t, e);
                        case "base64":
                            return h(this, t, e);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return U(this, t, e);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + M);
                            M = (M + "").toLowerCase(), i = !0
                    }
                }

                function c(M, t, e) {
                    var i = M[t];
                    M[t] = M[e], M[e] = i
                }

                function y(M, t, e, i, n) {
                    if (0 === M.length) return -1;
                    if ("string" == typeof e ? (i = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, isNaN(e) && (e = n ? 0 : M.length - 1), e < 0 && (e = M.length + e), e >= M.length) {
                        if (n) return -1;
                        e = M.length - 1
                    } else if (e < 0) {
                        if (!n) return -1;
                        e = 0
                    }
                    if ("string" == typeof t && (t = I.from(t, i)), I.isBuffer(t)) return 0 === t.length ? -1 : s(M, t, e, i, n);
                    if ("number" == typeof t) return t &= 255, I.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(M, t, e) : Uint8Array.prototype.lastIndexOf.call(M, t, e) : s(M, [t], e, i, n);
                    throw new TypeError("val must be string, number or Buffer")
                }

                function s(M, t, e, i, n) {
                    var N, r = 1,
                        g = M.length,
                        I = t.length;
                    if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                        if (M.length < 2 || t.length < 2) return -1;
                        r = 2, g /= 2, I /= 2, e /= 2
                    }

                    function D(M, t) {
                        return 1 === r ? M[t] : M.readUInt16BE(t * r)
                    }
                    if (n) {
                        var j = -1;
                        for (N = e; N < g; N++)
                            if (D(M, N) === D(t, -1 === j ? 0 : N - j)) {
                                if (-1 === j && (j = N), N - j + 1 === I) return j * r
                            } else -1 !== j && (N -= N - j), j = -1
                    } else
                        for (e + I > g && (e = g - I), N = e; N >= 0; N--) {
                            for (var o = !0, u = 0; u < I; u++)
                                if (D(M, N + u) !== D(t, u)) {
                                    o = !1;
                                    break
                                }
                            if (o) return N
                        }
                    return -1
                }

                function T(M, t, e, i) {
                    e = Number(e) || 0;
                    var n = M.length - e;
                    i ? (i = Number(i)) > n && (i = n) : i = n;
                    var N = t.length;
                    if (N % 2 != 0) throw new TypeError("Invalid hex string");
                    i > N / 2 && (i = N / 2);
                    for (var r = 0; r < i; ++r) {
                        var g = parseInt(t.substr(2 * r, 2), 16);
                        if (isNaN(g)) return r;
                        M[e + r] = g
                    }
                    return r
                }

                function L(M, t, e, i) {
                    return F(b(t, M.length - e), M, e, i)
                }

                function O(M, t, e, i) {
                    return F(function(M) {
                        for (var t = [], e = 0; e < M.length; ++e) t.push(255 & M.charCodeAt(e));
                        return t
                    }(t), M, e, i)
                }

                function E(M, t, e, i) {
                    return O(M, t, e, i)
                }

                function l(M, t, e, i) {
                    return F(_(t), M, e, i)
                }

                function C(M, t, e, i) {
                    return F(function(M, t) {
                        for (var e, i, n, N = [], r = 0; r < M.length && !((t -= 2) < 0); ++r) i = (e = M.charCodeAt(r)) >> 8, n = e % 256, N.push(n), N.push(i);
                        return N
                    }(t, M.length - e), M, e, i)
                }

                function h(M, t, e) {
                    return 0 === t && e === M.length ? i.fromByteArray(M) : i.fromByteArray(M.slice(t, e))
                }

                function f(M, t, e) {
                    e = Math.min(M.length, e);
                    for (var i = [], n = t; n < e;) {
                        var N, r, g, I, D = M[n],
                            j = null,
                            o = D > 239 ? 4 : D > 223 ? 3 : D > 191 ? 2 : 1;
                        if (n + o <= e) switch (o) {
                            case 1:
                                D < 128 && (j = D);
                                break;
                            case 2:
                                128 == (192 & (N = M[n + 1])) && (I = (31 & D) << 6 | 63 & N) > 127 && (j = I);
                                break;
                            case 3:
                                N = M[n + 1], r = M[n + 2], 128 == (192 & N) && 128 == (192 & r) && (I = (15 & D) << 12 | (63 & N) << 6 | 63 & r) > 2047 && (I < 55296 || I > 57343) && (j = I);
                                break;
                            case 4:
                                N = M[n + 1], r = M[n + 2], g = M[n + 3], 128 == (192 & N) && 128 == (192 & r) && 128 == (192 & g) && (I = (15 & D) << 18 | (63 & N) << 12 | (63 & r) << 6 | 63 & g) > 65535 && I < 1114112 && (j = I)
                        }
                        null === j ? (j = 65533, o = 1) : j > 65535 && (j -= 65536, i.push(j >>> 10 & 1023 | 55296), j = 56320 | 1023 & j), i.push(j), n += o
                    }
                    return function(M) {
                        var t = M.length;
                        if (t <= w) return String.fromCharCode.apply(String, M);
                        for (var e = "", i = 0; i < t;) e += String.fromCharCode.apply(String, M.slice(i, i += w));
                        return e
                    }(i)
                }
                t.lW = I, t.h2 = 50, I.TYPED_ARRAY_SUPPORT = void 0 !== e.g.TYPED_ARRAY_SUPPORT ? e.g.TYPED_ARRAY_SUPPORT : function() {
                    try {
                        var M = new Uint8Array(1);
                        return M.__proto__ = {
                            __proto__: Uint8Array.prototype,
                            foo: function() {
                                return 42
                            }
                        }, 42 === M.foo() && "function" == typeof M.subarray && 0 === M.subarray(1, 1).byteLength
                    } catch (M) {
                        return !1
                    }
                }(), r(), I.poolSize = 8192, I._augment = function(M) {
                    return M.__proto__ = I.prototype, M
                }, I.from = function(M, t, e) {
                    return D(null, M, t, e)
                }, I.TYPED_ARRAY_SUPPORT && (I.prototype.__proto__ = Uint8Array.prototype, I.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && I[Symbol.species] === I && Object.defineProperty(I, Symbol.species, {
                    value: null,
                    configurable: !0
                })), I.alloc = function(M, t, e) {
                    return function(M, t, e, i) {
                        return j(t), t <= 0 ? g(M, t) : void 0 !== e ? "string" == typeof i ? g(M, t).fill(e, i) : g(M, t).fill(e) : g(M, t)
                    }(null, M, t, e)
                }, I.allocUnsafe = function(M) {
                    return o(null, M)
                }, I.allocUnsafeSlow = function(M) {
                    return o(null, M)
                }, I.isBuffer = function(M) {
                    return !(null == M || !M._isBuffer)
                }, I.compare = function(M, t) {
                    if (!I.isBuffer(M) || !I.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                    if (M === t) return 0;
                    for (var e = M.length, i = t.length, n = 0, N = Math.min(e, i); n < N; ++n)
                        if (M[n] !== t[n]) {
                            e = M[n], i = t[n];
                            break
                        }
                    return e < i ? -1 : i < e ? 1 : 0
                }, I.isEncoding = function(M) {
                    switch (String(M).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "latin1":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1
                    }
                }, I.concat = function(M, t) {
                    if (!N(M)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === M.length) return I.alloc(0);
                    var e;
                    if (void 0 === t)
                        for (t = 0, e = 0; e < M.length; ++e) t += M[e].length;
                    var i = I.allocUnsafe(t),
                        n = 0;
                    for (e = 0; e < M.length; ++e) {
                        var r = M[e];
                        if (!I.isBuffer(r)) throw new TypeError('"list" argument must be an Array of Buffers');
                        r.copy(i, n), n += r.length
                    }
                    return i
                }, I.byteLength = a, I.prototype._isBuffer = !0, I.prototype.swap16 = function() {
                    var M = this.length;
                    if (M % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (var t = 0; t < M; t += 2) c(this, t, t + 1);
                    return this
                }, I.prototype.swap32 = function() {
                    var M = this.length;
                    if (M % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (var t = 0; t < M; t += 4) c(this, t, t + 3), c(this, t + 1, t + 2);
                    return this
                }, I.prototype.swap64 = function() {
                    var M = this.length;
                    if (M % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                    for (var t = 0; t < M; t += 8) c(this, t, t + 7), c(this, t + 1, t + 6), c(this, t + 2, t + 5), c(this, t + 3, t + 4);
                    return this
                }, I.prototype.toString = function() {
                    var M = 0 | this.length;
                    return 0 === M ? "" : 0 === arguments.length ? f(this, 0, M) : z.apply(this, arguments)
                }, I.prototype.equals = function(M) {
                    if (!I.isBuffer(M)) throw new TypeError("Argument must be a Buffer");
                    return this === M || 0 === I.compare(this, M)
                }, I.prototype.inspect = function() {
                    var M = "",
                        e = t.h2;
                    return this.length > 0 && (M = this.toString("hex", 0, e).match(/.{2}/g).join(" "), this.length > e && (M += " ... ")), "<Buffer " + M + ">"
                }, I.prototype.compare = function(M, t, e, i, n) {
                    if (!I.isBuffer(M)) throw new TypeError("Argument must be a Buffer");
                    if (void 0 === t && (t = 0), void 0 === e && (e = M ? M.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), t < 0 || e > M.length || i < 0 || n > this.length) throw new RangeError("out of range index");
                    if (i >= n && t >= e) return 0;
                    if (i >= n) return -1;
                    if (t >= e) return 1;
                    if (this === M) return 0;
                    for (var N = (n >>>= 0) - (i >>>= 0), r = (e >>>= 0) - (t >>>= 0), g = Math.min(N, r), D = this.slice(i, n), j = M.slice(t, e), o = 0; o < g; ++o)
                        if (D[o] !== j[o]) {
                            N = D[o], r = j[o];
                            break
                        }
                    return N < r ? -1 : r < N ? 1 : 0
                }, I.prototype.includes = function(M, t, e) {
                    return -1 !== this.indexOf(M, t, e)
                }, I.prototype.indexOf = function(M, t, e) {
                    return y(this, M, t, e, !0)
                }, I.prototype.lastIndexOf = function(M, t, e) {
                    return y(this, M, t, e, !1)
                }, I.prototype.write = function(M, t, e, i) {
                    if (void 0 === t) i = "utf8", e = this.length, t = 0;
                    else if (void 0 === e && "string" == typeof t) i = t, e = this.length, t = 0;
                    else {
                        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t |= 0, isFinite(e) ? (e |= 0, void 0 === i && (i = "utf8")) : (i = e, e = void 0)
                    }
                    var n = this.length - t;
                    if ((void 0 === e || e > n) && (e = n), M.length > 0 && (e < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    i || (i = "utf8");
                    for (var N = !1;;) switch (i) {
                        case "hex":
                            return T(this, M, t, e);
                        case "utf8":
                        case "utf-8":
                            return L(this, M, t, e);
                        case "ascii":
                            return O(this, M, t, e);
                        case "latin1":
                        case "binary":
                            return E(this, M, t, e);
                        case "base64":
                            return l(this, M, t, e);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return C(this, M, t, e);
                        default:
                            if (N) throw new TypeError("Unknown encoding: " + i);
                            i = ("" + i).toLowerCase(), N = !0
                    }
                }, I.prototype.toJSON = function() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                var w = 4096;

                function S(M, t, e) {
                    var i = "";
                    e = Math.min(M.length, e);
                    for (var n = t; n < e; ++n) i += String.fromCharCode(127 & M[n]);
                    return i
                }

                function d(M, t, e) {
                    var i = "";
                    e = Math.min(M.length, e);
                    for (var n = t; n < e; ++n) i += String.fromCharCode(M[n]);
                    return i
                }

                function x(M, t, e) {
                    var i, n = M.length;
                    (!t || t < 0) && (t = 0), (!e || e < 0 || e > n) && (e = n);
                    for (var N = "", r = t; r < e; ++r) N += (i = M[r]) < 16 ? "0" + i.toString(16) : i.toString(16);
                    return N
                }

                function U(M, t, e) {
                    for (var i = M.slice(t, e), n = "", N = 0; N < i.length; N += 2) n += String.fromCharCode(i[N] + 256 * i[N + 1]);
                    return n
                }

                function p(M, t, e) {
                    if (M % 1 != 0 || M < 0) throw new RangeError("offset is not uint");
                    if (M + t > e) throw new RangeError("Trying to access beyond buffer length")
                }

                function k(M, t, e, i, n, N) {
                    if (!I.isBuffer(M)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > n || t < N) throw new RangeError('"value" argument is out of bounds');
                    if (e + i > M.length) throw new RangeError("Index out of range")
                }

                function Q(M, t, e, i) {
                    t < 0 && (t = 65535 + t + 1);
                    for (var n = 0, N = Math.min(M.length - e, 2); n < N; ++n) M[e + n] = (t & 255 << 8 * (i ? n : 1 - n)) >>> 8 * (i ? n : 1 - n)
                }

                function Y(M, t, e, i) {
                    t < 0 && (t = 4294967295 + t + 1);
                    for (var n = 0, N = Math.min(M.length - e, 4); n < N; ++n) M[e + n] = t >>> 8 * (i ? n : 3 - n) & 255
                }

                function R(M, t, e, i, n, N) {
                    if (e + i > M.length) throw new RangeError("Index out of range");
                    if (e < 0) throw new RangeError("Index out of range")
                }

                function m(M, t, e, i, N) {
                    return N || R(M, 0, e, 4), n.write(M, t, e, i, 23, 4), e + 4
                }

                function v(M, t, e, i, N) {
                    return N || R(M, 0, e, 8), n.write(M, t, e, i, 52, 8), e + 8
                }
                I.prototype.slice = function(M, t) {
                    var e, i = this.length;
                    if ((M = ~~M) < 0 ? (M += i) < 0 && (M = 0) : M > i && (M = i), (t = void 0 === t ? i : ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i), t < M && (t = M), I.TYPED_ARRAY_SUPPORT)(e = this.subarray(M, t)).__proto__ = I.prototype;
                    else {
                        var n = t - M;
                        e = new I(n, void 0);
                        for (var N = 0; N < n; ++N) e[N] = this[N + M]
                    }
                    return e
                }, I.prototype.readUIntLE = function(M, t, e) {
                    M |= 0, t |= 0, e || p(M, t, this.length);
                    for (var i = this[M], n = 1, N = 0; ++N < t && (n *= 256);) i += this[M + N] * n;
                    return i
                }, I.prototype.readUIntBE = function(M, t, e) {
                    M |= 0, t |= 0, e || p(M, t, this.length);
                    for (var i = this[M + --t], n = 1; t > 0 && (n *= 256);) i += this[M + --t] * n;
                    return i
                }, I.prototype.readUInt8 = function(M, t) {
                    return t || p(M, 1, this.length), this[M]
                }, I.prototype.readUInt16LE = function(M, t) {
                    return t || p(M, 2, this.length), this[M] | this[M + 1] << 8
                }, I.prototype.readUInt16BE = function(M, t) {
                    return t || p(M, 2, this.length), this[M] << 8 | this[M + 1]
                }, I.prototype.readUInt32LE = function(M, t) {
                    return t || p(M, 4, this.length), (this[M] | this[M + 1] << 8 | this[M + 2] << 16) + 16777216 * this[M + 3]
                }, I.prototype.readUInt32BE = function(M, t) {
                    return t || p(M, 4, this.length), 16777216 * this[M] + (this[M + 1] << 16 | this[M + 2] << 8 | this[M + 3])
                }, I.prototype.readIntLE = function(M, t, e) {
                    M |= 0, t |= 0, e || p(M, t, this.length);
                    for (var i = this[M], n = 1, N = 0; ++N < t && (n *= 256);) i += this[M + N] * n;
                    return i >= (n *= 128) && (i -= Math.pow(2, 8 * t)), i
                }, I.prototype.readIntBE = function(M, t, e) {
                    M |= 0, t |= 0, e || p(M, t, this.length);
                    for (var i = t, n = 1, N = this[M + --i]; i > 0 && (n *= 256);) N += this[M + --i] * n;
                    return N >= (n *= 128) && (N -= Math.pow(2, 8 * t)), N
                }, I.prototype.readInt8 = function(M, t) {
                    return t || p(M, 1, this.length), 128 & this[M] ? -1 * (255 - this[M] + 1) : this[M]
                }, I.prototype.readInt16LE = function(M, t) {
                    t || p(M, 2, this.length);
                    var e = this[M] | this[M + 1] << 8;
                    return 32768 & e ? 4294901760 | e : e
                }, I.prototype.readInt16BE = function(M, t) {
                    t || p(M, 2, this.length);
                    var e = this[M + 1] | this[M] << 8;
                    return 32768 & e ? 4294901760 | e : e
                }, I.prototype.readInt32LE = function(M, t) {
                    return t || p(M, 4, this.length), this[M] | this[M + 1] << 8 | this[M + 2] << 16 | this[M + 3] << 24
                }, I.prototype.readInt32BE = function(M, t) {
                    return t || p(M, 4, this.length), this[M] << 24 | this[M + 1] << 16 | this[M + 2] << 8 | this[M + 3]
                }, I.prototype.readFloatLE = function(M, t) {
                    return t || p(M, 4, this.length), n.read(this, M, !0, 23, 4)
                }, I.prototype.readFloatBE = function(M, t) {
                    return t || p(M, 4, this.length), n.read(this, M, !1, 23, 4)
                }, I.prototype.readDoubleLE = function(M, t) {
                    return t || p(M, 8, this.length), n.read(this, M, !0, 52, 8)
                }, I.prototype.readDoubleBE = function(M, t) {
                    return t || p(M, 8, this.length), n.read(this, M, !1, 52, 8)
                }, I.prototype.writeUIntLE = function(M, t, e, i) {
                    M = +M, t |= 0, e |= 0, i || k(this, M, t, e, Math.pow(2, 8 * e) - 1, 0);
                    var n = 1,
                        N = 0;
                    for (this[t] = 255 & M; ++N < e && (n *= 256);) this[t + N] = M / n & 255;
                    return t + e
                }, I.prototype.writeUIntBE = function(M, t, e, i) {
                    M = +M, t |= 0, e |= 0, i || k(this, M, t, e, Math.pow(2, 8 * e) - 1, 0);
                    var n = e - 1,
                        N = 1;
                    for (this[t + n] = 255 & M; --n >= 0 && (N *= 256);) this[t + n] = M / N & 255;
                    return t + e
                }, I.prototype.writeUInt8 = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 1, 255, 0), I.TYPED_ARRAY_SUPPORT || (M = Math.floor(M)), this[t] = 255 & M, t + 1
                }, I.prototype.writeUInt16LE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 2, 65535, 0), I.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & M, this[t + 1] = M >>> 8) : Q(this, M, t, !0), t + 2
                }, I.prototype.writeUInt16BE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 2, 65535, 0), I.TYPED_ARRAY_SUPPORT ? (this[t] = M >>> 8, this[t + 1] = 255 & M) : Q(this, M, t, !1), t + 2
                }, I.prototype.writeUInt32LE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 4, 4294967295, 0), I.TYPED_ARRAY_SUPPORT ? (this[t + 3] = M >>> 24, this[t + 2] = M >>> 16, this[t + 1] = M >>> 8, this[t] = 255 & M) : Y(this, M, t, !0), t + 4
                }, I.prototype.writeUInt32BE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 4, 4294967295, 0), I.TYPED_ARRAY_SUPPORT ? (this[t] = M >>> 24, this[t + 1] = M >>> 16, this[t + 2] = M >>> 8, this[t + 3] = 255 & M) : Y(this, M, t, !1), t + 4
                }, I.prototype.writeIntLE = function(M, t, e, i) {
                    if (M = +M, t |= 0, !i) {
                        var n = Math.pow(2, 8 * e - 1);
                        k(this, M, t, e, n - 1, -n)
                    }
                    var N = 0,
                        r = 1,
                        g = 0;
                    for (this[t] = 255 & M; ++N < e && (r *= 256);) M < 0 && 0 === g && 0 !== this[t + N - 1] && (g = 1), this[t + N] = (M / r >> 0) - g & 255;
                    return t + e
                }, I.prototype.writeIntBE = function(M, t, e, i) {
                    if (M = +M, t |= 0, !i) {
                        var n = Math.pow(2, 8 * e - 1);
                        k(this, M, t, e, n - 1, -n)
                    }
                    var N = e - 1,
                        r = 1,
                        g = 0;
                    for (this[t + N] = 255 & M; --N >= 0 && (r *= 256);) M < 0 && 0 === g && 0 !== this[t + N + 1] && (g = 1), this[t + N] = (M / r >> 0) - g & 255;
                    return t + e
                }, I.prototype.writeInt8 = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 1, 127, -128), I.TYPED_ARRAY_SUPPORT || (M = Math.floor(M)), M < 0 && (M = 255 + M + 1), this[t] = 255 & M, t + 1
                }, I.prototype.writeInt16LE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 2, 32767, -32768), I.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & M, this[t + 1] = M >>> 8) : Q(this, M, t, !0), t + 2
                }, I.prototype.writeInt16BE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 2, 32767, -32768), I.TYPED_ARRAY_SUPPORT ? (this[t] = M >>> 8, this[t + 1] = 255 & M) : Q(this, M, t, !1), t + 2
                }, I.prototype.writeInt32LE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 4, 2147483647, -2147483648), I.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & M, this[t + 1] = M >>> 8, this[t + 2] = M >>> 16, this[t + 3] = M >>> 24) : Y(this, M, t, !0), t + 4
                }, I.prototype.writeInt32BE = function(M, t, e) {
                    return M = +M, t |= 0, e || k(this, M, t, 4, 2147483647, -2147483648), M < 0 && (M = 4294967295 + M + 1), I.TYPED_ARRAY_SUPPORT ? (this[t] = M >>> 24, this[t + 1] = M >>> 16, this[t + 2] = M >>> 8, this[t + 3] = 255 & M) : Y(this, M, t, !1), t + 4
                }, I.prototype.writeFloatLE = function(M, t, e) {
                    return m(this, M, t, !0, e)
                }, I.prototype.writeFloatBE = function(M, t, e) {
                    return m(this, M, t, !1, e)
                }, I.prototype.writeDoubleLE = function(M, t, e) {
                    return v(this, M, t, !0, e)
                }, I.prototype.writeDoubleBE = function(M, t, e) {
                    return v(this, M, t, !1, e)
                }, I.prototype.copy = function(M, t, e, i) {
                    if (e || (e = 0), i || 0 === i || (i = this.length), t >= M.length && (t = M.length), t || (t = 0), i > 0 && i < e && (i = e), i === e) return 0;
                    if (0 === M.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (e < 0 || e >= this.length) throw new RangeError("sourceStart out of bounds");
                    if (i < 0) throw new RangeError("sourceEnd out of bounds");
                    i > this.length && (i = this.length), M.length - t < i - e && (i = M.length - t + e);
                    var n, N = i - e;
                    if (this === M && e < t && t < i)
                        for (n = N - 1; n >= 0; --n) M[n + t] = this[n + e];
                    else if (N < 1e3 || !I.TYPED_ARRAY_SUPPORT)
                        for (n = 0; n < N; ++n) M[n + t] = this[n + e];
                    else Uint8Array.prototype.set.call(M, this.subarray(e, e + N), t);
                    return N
                }, I.prototype.fill = function(M, t, e, i) {
                    if ("string" == typeof M) {
                        if ("string" == typeof t ? (i = t, t = 0, e = this.length) : "string" == typeof e && (i = e, e = this.length), 1 === M.length) {
                            var n = M.charCodeAt(0);
                            n < 256 && (M = n)
                        }
                        if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                        if ("string" == typeof i && !I.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                    } else "number" == typeof M && (M &= 255);
                    if (t < 0 || this.length < t || this.length < e) throw new RangeError("Out of range index");
                    if (e <= t) return this;
                    var N;
                    if (t >>>= 0, e = void 0 === e ? this.length : e >>> 0, M || (M = 0), "number" == typeof M)
                        for (N = t; N < e; ++N) this[N] = M;
                    else {
                        var r = I.isBuffer(M) ? M : b(new I(M, i).toString()),
                            g = r.length;
                        for (N = 0; N < e - t; ++N) this[N + t] = r[N % g]
                    }
                    return this
                };
                var P = /[^+\/0-9A-Za-z-_]/g;

                function b(M, t) {
                    var e;
                    t = t || 1 / 0;
                    for (var i = M.length, n = null, N = [], r = 0; r < i; ++r) {
                        if ((e = M.charCodeAt(r)) > 55295 && e < 57344) {
                            if (!n) {
                                if (e > 56319) {
                                    (t -= 3) > -1 && N.push(239, 191, 189);
                                    continue
                                }
                                if (r + 1 === i) {
                                    (t -= 3) > -1 && N.push(239, 191, 189);
                                    continue
                                }
                                n = e;
                                continue
                            }
                            if (e < 56320) {
                                (t -= 3) > -1 && N.push(239, 191, 189), n = e;
                                continue
                            }
                            e = 65536 + (n - 55296 << 10 | e - 56320)
                        } else n && (t -= 3) > -1 && N.push(239, 191, 189);
                        if (n = null, e < 128) {
                            if ((t -= 1) < 0) break;
                            N.push(e)
                        } else if (e < 2048) {
                            if ((t -= 2) < 0) break;
                            N.push(e >> 6 | 192, 63 & e | 128)
                        } else if (e < 65536) {
                            if ((t -= 3) < 0) break;
                            N.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128)
                        } else {
                            if (!(e < 1114112)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            N.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128)
                        }
                    }
                    return N
                }

                function _(M) {
                    return i.toByteArray(function(M) {
                        if ((M = function(M) {
                                return M.trim ? M.trim() : M.replace(/^\s+|\s+$/g, "")
                            }(M).replace(P, "")).length < 2) return "";
                        for (; M.length % 4 != 0;) M += "=";
                        return M
                    }(M))
                }

                function F(M, t, e, i) {
                    for (var n = 0; n < i && !(n + e >= t.length || n >= M.length); ++n) t[n + e] = M[n];
                    return n
                }
            },
            494: (M, t) => {
                t.read = function(M, t, e, i, n) {
                    var N, r, g = 8 * n - i - 1,
                        I = (1 << g) - 1,
                        D = I >> 1,
                        j = -7,
                        o = e ? n - 1 : 0,
                        u = e ? -1 : 1,
                        A = M[t + o];
                    for (o += u, N = A & (1 << -j) - 1, A >>= -j, j += g; j > 0; N = 256 * N + M[t + o], o += u, j -= 8);
                    for (r = N & (1 << -j) - 1, N >>= -j, j += i; j > 0; r = 256 * r + M[t + o], o += u, j -= 8);
                    if (0 === N) N = 1 - D;
                    else {
                        if (N === I) return r ? NaN : 1 / 0 * (A ? -1 : 1);
                        r += Math.pow(2, i), N -= D
                    }
                    return (A ? -1 : 1) * r * Math.pow(2, N - i)
                }, t.write = function(M, t, e, i, n, N) {
                    var r, g, I, D = 8 * N - n - 1,
                        j = (1 << D) - 1,
                        o = j >> 1,
                        u = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                        A = i ? 0 : N - 1,
                        a = i ? 1 : -1,
                        z = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (g = isNaN(t) ? 1 : 0, r = j) : (r = Math.floor(Math.log(t) / Math.LN2), t * (I = Math.pow(2, -r)) < 1 && (r--, I *= 2), (t += r + o >= 1 ? u / I : u * Math.pow(2, 1 - o)) * I >= 2 && (r++, I /= 2), r + o >= j ? (g = 0, r = j) : r + o >= 1 ? (g = (t * I - 1) * Math.pow(2, n), r += o) : (g = t * Math.pow(2, o - 1) * Math.pow(2, n), r = 0)); n >= 8; M[e + A] = 255 & g, A += a, g /= 256, n -= 8);
                    for (r = r << n | g, D += n; D > 0; M[e + A] = 255 & r, A += a, r /= 256, D -= 8);
                    M[e + A - a] |= 128 * z
                }
            },
            2: M => {
                var t = {}.toString;
                M.exports = Array.isArray || function(M) {
                    return "[object Array]" == t.call(M)
                }
            },
            745: (M, t, e) => {
                "use strict";
                e.d(t, {
                    BF: () => g,
                    Gh: () => n,
                    lf: () => N,
                    mo: () => I,
                    rG: () => j,
                    r_: () => D,
                    s3: () => i
                });
                const i = "skeepers-widget-wrapper",
                    n = 768;
                var N, r;
                ! function(M) {
                    M.WHITE = "white", M.ORANGE = "orange", M.BLACK = "black"
                }(N || (N = {})),
                function(M) {
                    M.GB = "en_GB", M.US = "en_US", M.DE = "de_DE", M.ES = "es_ES", M.FR = "fr_FR", M.IT = "it_IT", M.BR = "pt_BR", M.PT = "pt_PT", M.NL = "nl_NL", M.BE = "nl_BE", M.CZ = "cz_CZ", M.PL = "pl_PL", M.TH = "th_TH", M.VN = "vi_VN", M.CS = "cs_CZ", M.HU = "hu_HU", M.MX = "es_MX", M.SK = "sk_SK", M.MY = "en_MY", M.TW = "zh_TW", M.JP = "ja_JP", M.KR = "ko_KR", M.DA = "da_DK", M.NN = "nn_NO"
                }(r || (r = {}));
                const g = {
                        __FILL__: "#2F3237",
                        __STROKE__: "#2F3237",
                        "__TEXT-FILL__": "white",
                        "__TEXT2-FILL__": "white",
                        __RECT_FILL__: "white",
                        "__MASK-COLOR__": "#C7DEFF",
                        "__LOGO1-FILL__": "white",
                        "__LOGO2-FILL__": "white",
                        "__MASK-FILL-COLOR__": "#006FF5"
                    },
                    I = {
                        __FILL__: "#006FF5",
                        __STROKE__: "#006FF5",
                        "__TEXT-FILL__": "white",
                        "__TEXT2-FILL__": "white",
                        __RECT_FILL__: "white",
                        "__MASK-COLOR__": "#C7DEFF",
                        "__LOGO1-FILL__": "white",
                        "__LOGO2-FILL__": "white",
                        "__MASK-FILL-COLOR__": "#006FF5"
                    },
                    D = {
                        __FILL__: "white",
                        __STROKE__: "#CFCFCF",
                        "__TEXT-FILL__": "#006FF5",
                        "__TEXT2-FILL__": "#03030A",
                        __RECT_FILL__: "#C7DEFF",
                        "__MASK-COLOR__": "white",
                        "__LOGO1-FILL__": "#006FF5",
                        "__LOGO2-FILL__": "#03030A",
                        "__MASK-FILL-COLOR__": ""
                    },
                    j = {
                        fr_FR: 55,
                        de_DE: 43,
                        en_GB: 53,
                        pl_PL: 53,
                        bg_BG: 53,
                        cs_CZ: 53,
                        hu_HU: 53,
                        sk_SK: 53,
                        cz_CZ: 53,
                        nl_NL: 53,
                        nl_BE: 53,
                        en_US: 53,
                        es_ES: 40,
                        es_PE: 40,
                        it_IT: 48,
                        pt_BR: 47,
                        pt_PT: 47,
                        es_MX: 53,
                        th_TH: 53,
                        vi_VN: 53,
                        en_MY: 53,
                        zh_TW: 53,
                        ja_JP: 53,
                        ko_KR: 53,
                        da_DK: 53,
                        nn_NO: 53
                    }
            },
            77: (M, t, e) => {
                "use strict";
                var i, n, N, r, g, I;
                e.d(t, {
                        dl: () => I,
                        gO: () => n,
                        xr: () => i,
                        yN: () => N
                    }),
                    function(M) {
                        M[M.JS = 0] = "JS", M[M.SVG = 1] = "SVG"
                    }(i || (i = {})),
                    function(M) {
                        M[M.None = 0] = "None", M[M.TopLeft = 1] = "TopLeft", M[M.TopRight = 2] = "TopRight", M[M.BottomLeft = 3] = "BottomLeft", M[M.BottomRight = 4] = "BottomRight"
                    }(n || (n = {})),
                    function(M) {
                        M[M.Float = 0] = "Float", M[M.Relative = 1] = "Relative"
                    }(N || (N = {})),
                    function(M) {
                        M[M.Badge = 0] = "Badge", M[M.MiniBadge = 1] = "MiniBadge"
                    }(r || (r = {})),
                    function(M) {
                        M[M.Rectangular = 0] = "Rectangular", M[M.Circular = 1] = "Circular"
                    }(g || (g = {})),
                    function(M) {
                        M[M.White = 0] = "White", M[M.Orange = 1] = "Orange", M[M.Black = 2] = "Black"
                    }(I || (I = {}))
            },
            416: (M, t, e) => {
                "use strict";
                e.r(t), e.d(t, {
                    buildCircularBadge: () => u
                });
                var i = e(272),
                    n = e(745),
                    N = e(27);
                const r = async () => Promise.resolve().then(e.bind(e, 850)),
                    g = async (M, t) => {
                        t || (t = (0, N.V)(!0));
                        let e = await r();
                        if (!Object.keys(e).includes(t)) {
                            const M = t.split("_")[0];
                            t = `${M}_${M.toUpperCase()}`
                        }
                        return e = await r(), Object.keys(e).includes(t) || (t = "en_US"), e = await r(), e[t][M]
                    };
                var I = e(954);
                const D = async () => await Promise.resolve().then(e.bind(e, 344)),
                    j = async (M, t) => {
                        t || (t = (0, N.V)(!0));
                        let e = await D();
                        if (!Object.keys(e).includes(t)) {
                            const M = t.split("_")[0];
                            t = `${M}_${M.toUpperCase()}`
                        }
                        return e = await D(), Object.keys(e).includes(t) || (t = "en_US"), e = await D(), e[t][M]
                    };
                var o = e(104).lW;
                const u = async (M, t, e, N) => {
                    const r = (0, i._1)({
                        note: M.note
                    });
                    let D = {};
                    switch (t) {
                        case n.lf.BLACK:
                            D = n.BF;
                            break;
                        case n.lf.ORANGE:
                            D = n.mo;
                            break;
                        default:
                            D = n.r_
                    }
                    let u = await (async (M, t, e, i, N) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\n    <defs>\n        <style type="text/css">\n            @font-face {\n                font-family: 'Roboto-Bold';\n                src: url('data:font/woff;charset=utf-8;base64,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') format('woff');\n                font-weight: normal;\n                font-style: normal;\n            }\n        </style>\n    </defs>\n    <g>\n        <circle cx="100" cy="100" r="99" fill="__FILL__" stroke="__STROKE__" stroke-width="1" />\n        <text  x="45%" y="59" font-size="45" fill="__TEXT-FILL__"\n            style="text-anchor: middle; font-family: 'Roboto-Bold';">${(0,I.w0)(M.note)}</text>\n         <text x="${M.note?"68":"62"}%" y="59" font-size="28" fill="__TEXT-FILL__" style="text-anchor: middle; font-family: 'Roboto-Bold';">\n            /5\n        </text>\n        <text x="50%" y="84" font-size="13" fill="__TEXT2-FILL__" style="text-anchor: middle; font-family: 'Roboto-Bold';">${M.historyReviewsCount} ${await g("BRAND_CUSTOMER_REVIEWS")}</text>\n        <svg viewBox="0 0 163 200" x="0" y="15.5" width="200" >\n            <g>\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="31">\n                    <rect x="0" y="0" width="100" height="100" fill="__RECT_FILL__" />\n                    ${e?`<mask id="Mask1">\n                        <rect x="0" y="0" width="${t[0]}" height="100" fill="white" />\n                    </mask>\n                    <rect x="0" y="0" width="100" height="100" fill="__TEXT-FILL__\n" mask="url(#Mask1)" />`:""}\n                </svg>\n                <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="white" />\n                </svg>\n                ${e?"":`<mask id="Mask1">\n                        <rect x="0" y="0" width="${t[0]}" height="100" fill="white" />\n                    </mask>\n                 <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-FILL-COLOR__" mask="url(#Mask1)" />\n                </svg>`}\n            </g>\n            <g transform="translate(33 0)">\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="31">\n                    <rect x="0" y="0" width="100" height="100" fill="__RECT_FILL__" />\n                    ${e?`<mask id="Mask2">\n                        <rect x="0" y="0" width="${t[1]}" height="100" fill="white" />\n                    </mask>\n                    <rect x="0" y="0" width="100" height="100" fill="__TEXT-FILL__\n" mask="url(#Mask2)" />`:""}\n                </svg>\n                <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-COLOR__" />\n                </svg>\n                ${e?"":`<mask id="Mask2">\n                        <rect x="0" y="0" width="${t[1]}" height="100" fill="white" />\n                    </mask>\n                 <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-FILL-COLOR__" mask="url(#Mask2)" />\n                </svg>`}\n            </g>\n            <g transform="translate(66 0)">\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="31">\n                    <rect x="0" y="0" width="100" height="100" fill="__RECT_FILL__" />\n                    ${e?`<mask id="Mask3">\n                        <rect x="0" y="0" width="${t[2]}" height="100" fill="white" />\n                    </mask>\n                    <rect x="0" y="0" width="100" height="100" fill="__TEXT-FILL__\n" mask="url(#Mask3)" />`:""}\n                </svg>\n                <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-COLOR__" />\n                </svg>\n                \n                ${e?"":`<mask id="Mask3">\n                        <rect x="0" y="0" width="${t[2]}" height="100" fill="white" />\n                    </mask>\n                 <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-FILL-COLOR__" mask="url(#Mask3)" />\n                </svg>`}\n            </g>\n            <g transform="translate(99 0)">\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="31">\n                    <rect x="0" y="0" width="100" height="100" fill="__RECT_FILL__" />\n                    ${e?`<mask id="Mask4">\n                        <rect x="0" y="0" width="${t[3]}" height="100" fill="white" />\n                    </mask>\n                    <rect x="0" y="0" width="100" height="100" fill="__TEXT-FILL__\n" mask="url(#Mask4)" />`:""}\n                    \n                </svg>\n                <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-COLOR__" />\n                </svg>\n                ${e?"":`<mask id="Mask4">\n                        <rect x="0" y="0" width="${t[3]}" height="100" fill="white" />\n                    </mask>\n                 <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-FILL-COLOR__" mask="url(#Mask4)" />\n                </svg>`}\n            </g>\n            <g transform="translate(132 0)">\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="31">\n                    <rect x="0" y="0" width="100" height="100" fill="__RECT_FILL__" />\n                    ${e?`<mask id="Mask5">\n                        <rect x="0" y="0" width="${t[4]}" height="100" fill="white" />\n                    </mask>\n                    <rect x="0" y="0" width="100" height="100" fill="__TEXT-FILL__\n" mask="url(#Mask5)" />`:""}\n                </svg>\n                <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-COLOR__" />\n                </svg>\n                \n                ${e?"":`<mask id="Mask5">\n                        <rect x="0" y="0" width="${t[4]}" height="100" fill="white" />\n                    </mask>\n                 <svg width="23" x="4" viewBox="0 0 101 92" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path\n                        d="M53.6038 2.60183L62.6806 29.8371C63.1245 31.1679 64.3862 32.0551 65.823 32.0551H96.6982C99.899 32.0551 101.231 36.0476 98.6374 37.8804L73.6499 55.5547C72.4934 56.3719 72.0144 57.8311 72.4467 59.1503L81.9907 87.763C82.9837 90.7282 79.5025 93.1914 76.9091 91.3586L52.2253 73.8827C50.8936 72.9371 49.118 72.9371 47.7862 73.8827L23.0908 91.3703C20.5091 93.2031 17.0279 90.7399 18.0091 87.7747L27.5532 59.1619C27.9971 57.8311 27.5065 56.3835 26.35 55.5664L1.37416 37.8687C-1.20753 36.0359 0.11252 32.0434 3.31335 32.0434H34.1885C35.6137 32.0434 36.887 31.1445 37.331 29.8254L46.4078 2.59015C47.5526 -0.865327 52.4473 -0.865327 53.6038 2.60183Z"\n                        fill="__MASK-FILL-COLOR__" mask="url(#Mask5)" />\n                </svg>`}\n            </g>\n        </svg>\n        <svg width="112" height="29" y="140" x="${n.rG[i]}" viewBox="0 0 112 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <defs>\n                <style type="text/css">\n                    .logo01 {\n                        fill: __LOGO1-FILL__;\n                    }\n\n                    .logo02 {\n                            fill: __LOGO2-FILL__;\n                    }\n                </style>\n            </defs>\n            ${N}\n        </svg>\n    </g>\n</svg>`)(M, r, t === n.lf.WHITE, e, N);
                    const A = new RegExp(Object.keys(D).join("|"), "gi");
                    return u = u.replace(A, (M => D[M])), `<img style="display: block" src='data:image/svg+xml;base64,${o.from(u).toString("base64")}' alt='${await j("VERIFIED_REVIEWS")} - ${(0,I.w0)(M.note)} ${await j("ON")} 5 - ${M.historyReviewsCount.toFixed(0)}${await g("BRAND_CUSTOMER_REVIEWS")}'>`
                }
            },
            850: (M, t, e) => {
                "use strict";
                e.r(t), e.d(t, {
                    it_IT: () => i
                });
                const i = {
                    BRAND_CUSTOMER_REVIEWS: " recensioni dei clienti"
                }
            },
            272: (M, t, e) => {
                "use strict";
                e.d(t, {
                    Tv: () => N,
                    _1: () => r,
                    iI: () => n
                });
                var i = e(77);
                const n = M => {
                        let t;
                        switch (M) {
                            case i.dl.Black:
                                t = "black";
                                break;
                            case i.dl.Orange:
                                t = "orange";
                                break;
                            case i.dl.White:
                            default:
                                t = "white"
                        }
                        return t
                    },
                    N = ({
                        anchor: M,
                        style: t
                    }) => {
                        switch (M) {
                            case i.gO.TopLeft:
                                return t.concat("position: fixed; top: 1vh; left:1vh;");
                            case i.gO.TopRight:
                                return t.concat("position: fixed; top: 1vh; right:1vh;");
                            case i.gO.BottomRight:
                                return t.concat("position: fixed; bottom: 1vh; right:1vh;");
                            case i.gO.BottomLeft:
                                return t.concat("position: fixed; bottom: 1vh; left:1vh;");
                            default:
                                return t
                        }
                    },
                    r = ({
                        note: M
                    }) => {
                        const t = [];
                        let e = M;
                        for (let M = 0; M < 5; ++M) e >= 1 ? (t.push(100), e -= 1) : (t.push(Math.round(100 * e)), e = 0);
                        return t
                    }
            },
            27: (M, t, e) => {
                "use strict";
                let i;

                function n(M = !1) {
                    return i || (i = "it_IT".replace("_", "-")), M ? i.replace("-", "_") : i
                }

                function N(M) {
                    i = M.replace("_", "-")
                }
                e.d(t, {
                    V: () => n,
                    W: () => N
                })
            },
            344: (M, t, e) => {
                "use strict";
                e.r(t), e.d(t, {
                    it_IT: () => i
                });
                const i = {
                    LOGO_SVG: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgwIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDM4MCAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNy4zOTgyIDIyLjc3MDRDMTUuMTI4NSAyMi43NzA0IDUuMTgxODggMzIuNzE3IDUuMTgxODggNDQuOTg2N0g0Mi4zOTU4TDQ5LjYxNDUgMjIuNzcwNEgyNy4zOTgyWiIgZmlsbD0iIzAwNzNGRiIvPgo8cGF0aCBkPSJNNzMuMzI4NyAyMy44NjA0QzY5LjUzODEgMTIuMTkwNSA1Ny4wMDM2IDUuODA2MDEgNDUuMzMzNyA5LjU5NjUxTDU2LjgzMzEgNDQuOTg5N0g4MC4xOTQyTDczLjMyODcgMjMuODYwNFoiIGZpbGw9IiMwMDczRkYiLz4KPHBhdGggZD0iTTg2LjQ4NzMgNjcuODc4OUM5Ni40MTI3IDYwLjY2NjMgOTguNjEzOSA0Ni43NzM5IDkxLjQwMTMgMzYuODQ1NUw2MS4yOTM1IDU4LjcyMDhMNjguNTEyMiA4MC45MzcxTDg2LjQ4NDMgNjcuODc4OUg4Ni40ODczWiIgZmlsbD0iIzAwNzNGRiIvPgo8cGF0aCBkPSJNNDguNjg4OSA5My45OTUzQzU4LjYxNDMgMTAxLjIwOCA3Mi41MDk3IDk5LjAwNjcgNzkuNzIyMyA4OS4wODEzTDQ5LjYxNDUgNjcuMjA2TDMwLjcxNjggODAuOTM3MUw0OC42ODg5IDkzLjk5NTNaIiBmaWxsPSIjMDA3M0ZGIi8+CjxwYXRoIGQ9Ik0xMi4xNzIzIDY2LjExOTFDOC4zODE4NCA3Ny43ODkgMTQuNzY2MyA5MC4zMjM1IDI2LjQzNjIgOTQuMTE0TDM3LjkzNTYgNTguNzIwOEwxOS4wMzc5IDQ0Ljk4OTdMMTIuMTcyMyA2Ni4xMTkxWiIgZmlsbD0iIzAwNzNGRiIvPgo8cGF0aCBkPSJNMTI0Ljk5NSAzNS4zNDE1SDEzMi4yOTNMMTQwLjAxNyA0OS44MzA2SDE0OC4wMThMMTM5LjQ3OCAzNC4xNjAyQzEzOS43MzQgMzQuMDU2NyAxMzkuOTg3IDMzLjk0NzEgMTQwLjIzIDMzLjgyODNDMTQyLjMxMyAzMi44MjA2IDE0My44OSAzMS4zODY2IDE0NC45NTkgMjkuNTI5NEMxNDYuMDI3IDI3LjY3MjIgMTQ2LjU2IDI1LjQ3NyAxNDYuNTYgMjIuOTQ3QzE0Ni41NiAyMC40MTY5IDE0Ni4wMyAxOC4yMjc5IDE0NC45NzEgMTYuMzI1QzE0My45MTEgMTQuNDIyMiAxNDIuMzUyIDEyLjk0MjUgMTQwLjI5NCAxMS44Nzk5QzEzOC4yMzYgMTAuODE3NCAxMzUuNjg4IDEwLjI4NzYgMTMyLjY1MiAxMC4yODc2SDExNy44NDRWNDkuODMwNkgxMjQuOTk4VjM1LjM0MTVIMTI0Ljk5NVpNMTMxLjUzOCAxNi4yODg1QzEzMy4zNCAxNi4yODg1IDEzNC44MDUgMTYuNTUwMyAxMzUuOTM3IDE3LjA3MDlDMTM3LjA2NyAxNy41OTE2IDEzNy45MDcgMTguMzUyNyAxMzguNDU1IDE5LjM1NDRDMTM5LjAwMyAyMC4zNTMgMTM5LjI3NyAyMS41NTI2IDEzOS4yNzcgMjIuOTVDMTM5LjI3NyAyNC4zNDc1IDEzOS4wMDYgMjUuNTI4OCAxMzguNDcxIDI2LjQ5MzlDMTM3LjkzMiAyNy40NTkxIDEzNy4wOTQgMjguMTg2NyAxMzUuOTUzIDI4LjY4M0MxMzQuODE0IDI5LjE3OTIgMTMzLjM1MyAyOS40MjU4IDEzMS41NjggMjkuNDI1OEgxMjQuOTk4VjE2LjI4ODVIMTMxLjU0MUgxMzEuNTM4WiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMTU0Ljc1IDQ4LjU0MjhDMTU2LjkwNiA0OS43OTEgMTU5LjQ2NiA1MC40MTUyIDE2Mi40MzQgNTAuNDE1MkMxNjQuNzMgNTAuNDE1MiAxNjYuNzY3IDUwLjA2NSAxNjguNTQyIDQ5LjM2NzhDMTcwLjMxNyA0OC42NzA2IDE3MS43NzUgNDcuNjc4MSAxNzIuOTE0IDQ2LjM5NjNDMTc0LjA1MyA0NS4xMTQ2IDE3NC44MzUgNDMuNjEzNiAxNzUuMjU4IDQxLjg5OTVMMTY4Ljc0IDQxLjEyOTJDMTY4LjQyMyA0MS45Nzg2IDE2Ny45NjYgNDIuNjkxMSAxNjcuMzc2IDQzLjI2NjVDMTY2Ljc4NSA0My44NDE5IDE2Ni4wNzkgNDQuMjcxMiAxNjUuMjU3IDQ0LjU1NDRDMTY0LjQzNSA0NC44Mzc1IDE2My41MzEgNDQuOTc3NiAxNjIuNTQxIDQ0Ljk3NzZDMTYxLjAyMiA0NC45Nzc2IDE1OS42OTQgNDQuNjQyNyAxNTguNTUzIDQzLjk2OThDMTU3LjQxNCA0My4yOTcgMTU2LjUzMSA0Mi4zMTk2IDE1NS45MDQgNDEuMDM3OUMxNTUuMzQxIDM5Ljg4NCAxNTUuMDMgMzguNTEzOSAxNTQuOTc1IDM2LjkzNjhIMTc1LjU3NVYzNC43NkMxNzUuNTc1IDMyLjE1OTkgMTc1LjIxMyAyOS45MTYgMTc0LjQ4OCAyOC4wMzE0QzE3My43NjMgMjYuMTQ2OCAxNzIuNzcxIDI0LjU5NDEgMTcxLjUwNyAyMy4zNzMyQzE3MC4yNDQgMjIuMTUyMyAxNjguNzk1IDIxLjI1MTIgMTY3LjE2MyAyMC42NjY2QzE2NS41MjggMjAuMDgyIDE2My44MDEgMTkuNzg5OCAxNjEuOTg0IDE5Ljc4OThDMTU5LjE1OCAxOS43ODk4IDE1Ni43MDIgMjAuNDM1MiAxNTQuNjE5IDIxLjcyNjFDMTUyLjUzMyAyMy4wMTcgMTUwLjkyIDI0LjgxNjQgMTQ5Ljc3MiAyNy4xMjcyQzE0OC42MjQgMjkuNDM1IDE0OC4wNDkgMzIuMTIwMyAxNDguMDQ5IDM1LjE4MzFDMTQ4LjA0OSAzOC4yNDYgMTQ4LjYyNyA0MC45Njc4IDE0OS43ODQgNDMuMjUxM0MxNTAuOTQxIDQ1LjUzNDcgMTUyLjU5NyA0Ny4yOTc1IDE1NC43NTMgNDguNTQ1OEwxNTQuNzUgNDguNTQyOFpNMTU4LjE5MyAyNi4yODk5QzE1OS4yNTMgMjUuNTgzNiAxNjAuNTM1IDI1LjIyNzQgMTYyLjAzNiAyNS4yMjc0QzE2My41MzcgMjUuMjI3NCAxNjQuNzkxIDI1LjU4MDUgMTY1Ljc5OSAyNi4yODk5QzE2Ni44MDYgMjYuOTk5MyAxNjcuNTY1IDI3Ljk3NjYgMTY4LjA3NiAyOS4yMjE5QzE2OC40NDEgMzAuMTEzOSAxNjguNjc2IDMxLjExODYgMTY4Ljc3OSAzMi4yMzNIMTU1QzE1NS4wOTEgMzEuMTE1NiAxNTUuMzUgMzAuMDg2NSAxNTUuNzgyIDI5LjEzOTdDMTU2LjMzIDI3Ljk0NjIgMTU3LjEzNCAyNi45OTYzIDE1OC4xOTMgMjYuMjg2OVYyNi4yODk5WiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMTgzLjU0OSA0OC40NjM2QzE4NS42NjggNDkuNzYzNiAxODguMjA0IDUwLjQxNTIgMTkxLjE1MSA1MC40MTUyQzE5My42MjMgNTAuNDE1MiAxOTUuNzc5IDQ5Ljk1ODUgMTk3LjYxNSA0OS4wNDgyQzE5OS40NSA0OC4xMzc4IDIwMC45MDkgNDYuODc3NCAyMDEuOTg3IDQ1LjI2NjhDMjAzLjA2NCA0My42NTYyIDIwMy42ODIgNDEuNzk5IDIwMy44NDEgMzkuNjk1MkgxOTcuMTY0QzE5Ni44NjMgNDEuMjg3NSAxOTYuMTgxIDQyLjUzNTggMTk1LjExMiA0My40MzdDMTk0LjA0MyA0NC4zMzgyIDE5Mi43NCA0NC43OTE4IDE5MS4yMDYgNDQuNzkxOEMxODkuNzU2IDQ0Ljc5MTggMTg4LjQ5MyA0NC4zOTkxIDE4Ny40MTggNDMuNjEwNUMxODYuMzQgNDIuODI1IDE4NS41MDkgNDEuNjk4NSAxODQuOTI4IDQwLjI0MDJDMTg0LjM0MyAzOC43ODE4IDE4NC4wNTQgMzcuMDQzNCAxODQuMDU0IDM1LjAyNDhDMTg0LjA1NCAzMy4wMDYzIDE4NC4zNTUgMzEuMzEwNCAxODQuOTU1IDI5Ljg3NjRDMTg1LjU1NSAyOC40NDI0IDE4Ni4zODkgMjcuMzQzNCAxODcuNDU4IDI2LjU3MzFDMTg4LjUyNiAyNS44MDI4IDE4OS43NzUgMjUuNDE5MiAxOTEuMjA2IDI1LjQxOTJDMTkyLjMzNSAyNS40MTkyIDE5My4zMTMgMjUuNjQxNCAxOTQuMTM1IDI2LjA4MjlDMTk0Ljk1NyAyNi41MjQ0IDE5NS42MjMgMjcuMTI3MiAxOTYuMTM1IDI3Ljg4ODNDMTk2LjY0NiAyOC42NDk1IDE5Ni45OSAyOS41MDgxIDE5Ny4xNjcgMzAuNDY0SDIwMy44NDRDMjAzLjY4NSAyOC4zMjM3IDIwMy4wNTIgMjYuNDUxMyAyMDEuOTUgMjQuODQ5OEMyMDAuODQ1IDIzLjI0ODQgMTk5LjM2OCAyMi4wMDYyIDE5Ny41MTEgMjEuMTIwMkMxOTUuNjU3IDIwLjIzNDMgMTkzLjUyIDE5Ljc5MjggMTkxLjA5OSAxOS43OTI4QzE4OC4yMTkgMTkuNzkyOCAxODUuNzE5IDIwLjQ0NDMgMTgzLjYgMjEuNzQ0NEMxODEuNDgxIDIzLjA0NDQgMTc5Ljg0NiAyNC44NDY4IDE3OC42OTkgMjcuMTQ1NUMxNzcuNTUxIDI5LjQ0NzIgMTc2Ljk3NSAzMi4xMDgxIDE3Ni45NzUgMzUuMTM0NEMxNzYuOTc1IDM4LjE2MDcgMTc3LjU0MiA0MC43NyAxNzguNjcxIDQzLjA2ODZDMTc5LjgwMSA0NS4zNzAzIDE4MS40MjcgNDcuMTY5NyAxODMuNTQ2IDQ4LjQ2OTdMMTgzLjU0OSA0OC40NjM2WiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMjMwLjExNiA0Ni4zOTMzQzIzMS4yNTQgNDUuMTExNSAyMzIuMDM3IDQzLjYxMDUgMjMyLjQ2IDQxLjg5NjRMMjI1Ljk0MSA0MS4xMjYyQzIyNS42MjUgNDEuOTc1NiAyMjUuMTY4IDQyLjY4OCAyMjQuNTc3IDQzLjI2MzVDMjIzLjk4NyA0My44Mzg5IDIyMy4yOCA0NC4yNjgyIDIyMi40NTggNDQuNTUxM0MyMjEuNjM2IDQ0LjgzNDUgMjIwLjczMiA0NC45NzQ1IDIxOS43NDMgNDQuOTc0NUMyMTguMjIzIDQ0Ljk3NDUgMjE2Ljg5MyA0NC42Mzk2IDIxNS43NTQgNDMuOTY2OEMyMTQuNjE2IDQzLjI5MzkgMjEzLjczMyA0Mi4zMTY2IDIxMy4xMDUgNDEuMDM0OEMyMTIuNTQyIDM5Ljg4MDkgMjEyLjIzMiAzOC41MTA5IDIxMi4xNzcgMzYuOTMzOEgyMzIuNzc3VjM0Ljc1NjlDMjMyLjc3NyAzMi4xNTY4IDIzMi40MTQgMjkuOTEzIDIzMS42OSAyOC4wMjg0QzIzMC45NjUgMjYuMTQzOCAyMjkuOTcyIDI0LjU5MTEgMjI4LjcwOSAyMy4zNzAyQzIyNy40NDUgMjIuMTQ5MyAyMjUuOTk2IDIxLjI0ODEgMjI0LjM2NCAyMC42NjM2QzIyMi43MjkgMjAuMDc5IDIyMS4wMDMgMTkuNzg2NyAyMTkuMTg2IDE5Ljc4NjdDMjE2LjM2IDE5Ljc4NjcgMjEzLjkwMyAyMC40MzIyIDIxMS44MjEgMjEuNzIzMUMyMDkuNzM1IDIzLjAxNCAyMDguMTIyIDI0LjgxMzMgMjA2Ljk3NCAyNy4xMjQxQzIwNS44MjYgMjkuNDMxOSAyMDUuMjUgMzIuMTE3MyAyMDUuMjUgMzUuMTgwMUMyMDUuMjUgMzguMjQzIDIwNS44MjkgNDAuOTY0OCAyMDYuOTg2IDQzLjI0ODJDMjA4LjE0MyA0NS41MzE3IDIwOS43OTkgNDcuMjk0NSAyMTEuOTU1IDQ4LjU0MjhDMjE0LjExIDQ5Ljc5MSAyMTYuNjcxIDUwLjQxNTIgMjE5LjYzOSA1MC40MTUyQzIyMS45MzUgNTAuNDE1MiAyMjMuOTcyIDUwLjA2NTEgMjI1Ljc0NyA0OS4zNjc4QzIyNy41MjIgNDguNjcwNiAyMjguOTggNDcuNjc4MSAyMzAuMTE5IDQ2LjM5NjNMMjMwLjExNiA0Ni4zOTMzWk0yMTUuMzk4IDI2LjI4OTlDMjE2LjQ1OCAyNS41ODM2IDIxNy43MzkgMjUuMjI3NCAyMTkuMjQgMjUuMjI3NEMyMjAuNzQxIDI1LjIyNzQgMjIxLjk5NiAyNS41ODA1IDIyMy4wMDMgMjYuMjg5OUMyMjQuMDExIDI2Ljk5OTMgMjI0Ljc2OSAyNy45NzY2IDIyNS4yODEgMjkuMjIxOUMyMjUuNjQ2IDMwLjExMzkgMjI1Ljg4MSAzMS4xMTg2IDIyNS45ODQgMzIuMjMzSDIxMi4yMDRDMjEyLjI5NiAzMS4xMTU2IDIxMi41NTQgMzAuMDg2NSAyMTIuOTg3IDI5LjEzOTdDMjEzLjUzNSAyNy45NDYyIDIxNC4zMzkgMjYuOTk2MyAyMTUuMzk4IDI2LjI4NjlWMjYuMjg5OVoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTI0Mi40MjIgMzIuNDczNUMyNDIuNDIyIDMxLjAyNDMgMjQyLjY5IDI5Ljc5NzMgMjQzLjIyOSAyOC43OTg3QzI0My43NjcgMjcuOCAyNDQuNTEgMjcuMDMyOCAyNDUuNDU0IDI2LjUwMzFDMjQ2LjM5OCAyNS45NzMzIDI0Ny40ODIgMjUuNzA1NCAyNDguNyAyNS43MDU0QzI1MC41MDIgMjUuNzA1NCAyNTEuOTE1IDI2LjI2ODYgMjUyLjkzOCAyNy4zOTIxQzI1My45NjEgMjguNTE1NSAyNTQuNDc1IDMwLjA2ODMgMjU0LjQ3NSAzMi4wNTAzVjQ5LjgzMDZIMjYxLjQ0NFYzMC45NjM0QzI2MS40NDQgMjguNTkxNiAyNjEuMDI0IDI2LjU3IDI2MC4xODcgMjQuODk4NkMyNTkuMzQ3IDIzLjIyNzEgMjU4LjE2OCAyMS45NTc1IDI1Ni42NDkgMjEuMDg5OEMyNTUuMTMgMjAuMjIyMSAyNTMuMzQ2IDE5Ljc4OTggMjUxLjI5NyAxOS43ODk4QzI0OS4wNzEgMTkuNzg5OCAyNDcuMjM4IDIwLjI3OTkgMjQ1Ljc5OCAyMS4yNjMzQzI0NC4zNTggMjIuMjQzNyAyNDMuMzA1IDIzLjU2ODEgMjQyLjYzMiAyNS4yMzA0SDI0Mi4yODhWMjAuMTYxMkgyMzUuNDUzVjQ5LjgzMDZIMjQyLjQyMlYzMi40NzM1WiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMjgwLjg2NiA0NC4xMDk5QzI3OS44NTggNDQuNzkxOCAyNzguNTI0IDQ1LjEzMjggMjc2Ljg2NSA0NS4xMzI4QzI3NS4yMDYgNDUuMTMyOCAyNzMuOTczIDQ0Ljc5MTggMjcyLjk1OSA0NC4xMDk5QzI3MS45NDIgNDMuNDI3OSAyNzEuMjg0IDQyLjQyMzIgMjcwLjk4NiA0MS4wOTg4TDI2NC4xNzggNDEuNzM1MUMyNjQuNjIgNDQuNDYgMjY1Ljk0MSA0Ni41ODgxIDI2OC4xMzkgNDguMTE2NUMyNzAuMzM3IDQ5LjY0NzkgMjczLjI0OCA1MC40MTIxIDI3Ni44NjggNTAuNDEyMUMyNzkuMzQgNTAuNDEyMSAyODEuNTI2IDUwLjAxMzMgMjgzLjQyNiA0OS4yMTg3QzI4NS4zMjYgNDguNDI0IDI4Ni44MTIgNDcuMzA2NyAyODcuODg5IDQ1Ljg3NTdDMjg4Ljk2NyA0NC40NDE3IDI4OS41MDYgNDIuNzk3NiAyODkuNTA2IDQwLjk0MDRDMjg5LjUwNiAzOC44MzM2IDI4OC44MTggMzcuMTE5NSAyODcuNDM5IDM1Ljc5MjFDMjg2LjA2MyAzNC40NjQ2IDI4My45ODYgMzMuNTA4NiAyODEuMjEzIDMyLjkyNzFMMjc2LjE1MyAzMS44NjQ2QzI3NC42NTIgMzEuNTI5NyAyNzMuNTc3IDMxLjA4MjEgMjcyLjkzNCAzMC41MjQ5QzI3Mi4yODkgMjkuOTY3OCAyNzEuOTY2IDI5LjI1NTQgMjcxLjk2NiAyOC4zODc2QzI3MS45NjYgMjcuMzk4MiAyNzIuNDU2IDI2LjU4MjIgMjczLjQzNyAyNS45NDU5QzI3NC40MTcgMjUuMzA5NiAyNzUuNjMyIDI0Ljk4OTkgMjc3LjA4MSAyNC45ODk5QzI3OC42ODkgMjQuOTg5OSAyNzkuOTM0IDI1LjM2NzQgMjgwLjgxNyAyNi4xMTk0QzI4MS43IDI2Ljg3MTQgMjgyLjI3NSAyNy43MzMxIDI4Mi41NCAyOC43MDczTDI4OC44NzMgMjguMDQzNkMyODguMzk1IDI1LjUzMTggMjg3LjE2NSAyMy41Mjg1IDI4NS4xNzcgMjIuMDMzNkMyODMuMTg5IDIwLjUzODcgMjgwLjQ1OCAxOS43ODk4IDI3Ni45NzggMTkuNzg5OEMyNzQuNjEyIDE5Ljc4OTggMjcyLjUyNiAyMC4xNjEyIDI3MC43MjQgMjAuOTA0MUMyNjguOTIyIDIxLjY0NyAyNjcuNTE4IDIyLjY5MTIgMjY2LjUxIDI0LjAzNjlDMjY1LjUwMyAyNS4zODI2IDI2NSAyNi45NzUgMjY1IDI4LjgxMzlDMjY1IDMwLjk3MjUgMjY1LjY3OSAzMi43NDc1IDI2Ny4wNCAzNC4xMzU4QzI2OC40MDEgMzUuNTI0MSAyNzAuNTAyIDM2LjUyODkgMjczLjM0NSAzNy4xNDY5TDI3OC40MDYgMzguMjA5NUMyODEuMDU0IDM4LjgxMjMgMjgyLjM3OSAzOS45NDQ5IDI4Mi4zNzkgNDEuNjA3MkMyODIuMzc5IDQyLjU5NjcgMjgxLjg3NiA0My40MzQgMjgwLjg2OSA0NC4xMTU5TDI4MC44NjYgNDQuMTA5OVoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTI5OS4xMjEgMjAuMTYxMkgyOTIuMTUyVjQ5LjgzMDZIMjk5LjEyMVYyMC4xNjEyWiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMjk1LjY1IDE1Ljk5MzJDMjk2Ljc0NiAxNS45OTMyIDI5Ny42OSAxNS42MjE3IDI5OC40ODUgMTQuODc4OUMyOTkuMjc5IDE0LjEzNiAyOTkuNjc4IDEzLjIzNDggMjk5LjY3OCAxMi4xNzIyQzI5OS42NzggMTEuMTA5NyAyOTkuMjgyIDEwLjIzNTkgMjk4LjQ4NSA5LjQ5Mjk5QzI5Ny42OSA4Ljc1MDEyIDI5Ni43NDYgOC4zNzg2OCAyOTUuNjUgOC4zNzg2OEMyOTQuNTU0IDguMzc4NjggMjkzLjU4MyA4Ljc1MDEyIDI5Mi43ODggOS40OTI5OUMyOTEuOTk0IDEwLjIzNTkgMjkxLjU5NSAxMS4xMzcxIDI5MS41OTUgMTIuMTk5NkMyOTEuNTk1IDEzLjI2MjIgMjkxLjk5NCAxNC4xMzYgMjkyLjc4OCAxNC44Nzg5QzI5My41ODMgMTUuNjIxNyAyOTQuNTM2IDE1Ljk5MzIgMjk1LjY1IDE1Ljk5MzJaIiBmaWxsPSIjMDMwMzBBIi8+CjxwYXRoIGQ9Ik0zMDguNTUzIDQ4LjUwMzJDMzEwLjY3MiA0OS43NzU4IDMxMy4xODEgNTAuNDE1MiAzMTYuMDc2IDUwLjQxNTJDMzE4Ljk3MSA1MC40MTUyIDMyMS40OCA0OS43Nzg5IDMyMy41OTkgNDguNTAzMkMzMjUuNzE4IDQ3LjIyNzUgMzI3LjM2MiA0NS40NDM0IDMyOC41MjggNDMuMTQxN0MzMjkuNjk1IDQwLjg0MyAzMzAuMjc2IDM4LjE2OTkgMzMwLjI3NiAzNS4xMjgzQzMzMC4yNzYgMzIuMDg2OCAzMjkuNjk1IDI5LjM4MzIgMzI4LjUyOCAyNy4wNzI0QzMyNy4zNjIgMjQuNzY0NiAzMjUuNzIxIDIyLjk3MTMgMzIzLjU5OSAyMS42OTg3QzMyMS40OCAyMC40MjYxIDMxOC45NzEgMTkuNzg2NyAzMTYuMDc2IDE5Ljc4NjdDMzEzLjE4MSAxOS43ODY3IDMxMC42NzIgMjAuNDIzIDMwOC41NTMgMjEuNjk4N0MzMDYuNDM0IDIyLjk3MTMgMzA0Ljc5NiAyNC43NjQ2IDMwMy42MzkgMjcuMDcyNEMzMDIuNDgyIDI5LjM4MDIgMzAxLjkwNCAzMi4wNjU1IDMwMS45MDQgMzUuMTI4M0MzMDEuOTA0IDM4LjE5MTIgMzAyLjQ4MiA0MC44NDMgMzAzLjYzOSA0My4xNDE3QzMwNC43OTYgNDUuNDQwMyAzMDYuNDM0IDQ3LjIyNzUgMzA4LjU1MyA0OC41MDMyWk0zMDkuNzU5IDMwLjE5MzFDMzEwLjI3OSAyOC43MjU2IDMxMS4wNzEgMjcuNTYyNiAzMTIuMTMgMjYuNzA0QzMxMy4xOSAyNS44NDU0IDMxNC41MDUgMjUuNDE2MSAzMTYuMDc5IDI1LjQxNjFDMzE3LjY1MyAyNS40MTYxIDMxOS4wMTEgMjUuODQ1NCAzMjAuMDUyIDI2LjcwNEMzMjEuMDk0IDI3LjU2MjYgMzIxLjg3NiAyOC43MjU2IDMyMi4zOTcgMzAuMTkzMUMzMjIuOTE3IDMxLjY2MDYgMzIzLjE3OSAzMy4zMDc3IDMyMy4xNzkgMzUuMTI4M0MzMjMuMTc5IDM2Ljk0OSAzMjIuOTE3IDM4LjU0NDQgMzIyLjM5NyA0MC4wMTE5QzMyMS44NzYgNDEuNDc5MyAzMjEuMDk0IDQyLjY0MjQgMzIwLjA1MiA0My41MDA5QzMxOS4wMTEgNDQuMzU5NSAzMTcuNjg0IDQ0Ljc4ODggMzE2LjA3OSA0NC43ODg4QzMxNC40NzUgNDQuNzg4OCAzMTMuMTkgNDQuMzU5NSAzMTIuMTMgNDMuNTAwOUMzMTEuMDcxIDQyLjY0MjQgMzEwLjI3OSA0MS40NzkzIDMwOS43NTkgNDAuMDExOUMzMDkuMjM4IDM4LjU0NDQgMzA4Ljk3NiAzNi45MTU1IDMwOC45NzYgMzUuMTI4M0MzMDguOTc2IDMzLjM0MTIgMzA5LjIzOCAzMS42NjA2IDMwOS43NTkgMzAuMTkzMVoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTM1NC4yMzEgMjEuMDg5OEMzNTIuNzEyIDIwLjIyMjEgMzUwLjkyNyAxOS43ODk4IDM0OC44NzggMTkuNzg5OEMzNDYuNjUzIDE5Ljc4OTggMzQ0LjgyIDIwLjI3OTkgMzQzLjM4IDIxLjI2MzNDMzQxLjk0IDIyLjI0MzcgMzQwLjg4NiAyMy41NjgxIDM0MC4yMTQgMjUuMjMwNEgzMzkuODdWMjAuMTYxMkgzMzMuMDM0VjQ5LjgzMDZIMzQwLjAwM1YzMi40NzM1QzM0MC4wMDMgMzEuMDI0MyAzNDAuMjcxIDI5Ljc5NzMgMzQwLjgxIDI4Ljc5ODdDMzQxLjM0OSAyNy44IDM0Mi4wOTIgMjcuMDMyOCAzNDMuMDM2IDI2LjUwMzFDMzQzLjk4IDI1Ljk3MzMgMzQ1LjA2NCAyNS43MDU0IDM0Ni4yODEgMjUuNzA1NEMzNDguMDg0IDI1LjcwNTQgMzQ5LjQ5NiAyNi4yNjg2IDM1MC41MTkgMjcuMzkyMUMzNTEuNTQyIDI4LjUxNTUgMzUyLjA1NyAzMC4wNjgzIDM1Mi4wNTcgMzIuMDUwM1Y0OS44MzA2SDM1OS4wMjZWMzAuOTYzNEMzNTkuMDI2IDI4LjU5MTYgMzU4LjYwNiAyNi41NyAzNTcuNzY5IDI0Ljg5ODZDMzU2LjkyOCAyMy4yMjcxIDM1NS43NSAyMS45NTc1IDM1NC4yMzEgMjEuMDg5OFoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTM2Ni41NzcgMTUuOTkzMkMzNjcuNjczIDE1Ljk5MzIgMzY4LjYxNiAxNS42MjE3IDM2OS40MTEgMTQuODc4OUMzNzAuMjA2IDE0LjEzNiAzNzAuNjA1IDEzLjIzNDggMzcwLjYwNSAxMi4xNzIyQzM3MC42MDUgMTEuMTA5NyAzNzAuMjA5IDEwLjIzNTkgMzY5LjQxMSA5LjQ5Mjk5QzM2OC42MTYgOC43NTAxMiAzNjcuNjczIDguMzc4NjggMzY2LjU3NyA4LjM3ODY4QzM2NS40ODEgOC4zNzg2OCAzNjQuNTA5IDguNzUwMTIgMzYzLjcxNSA5LjQ5Mjk5QzM2Mi45MiAxMC4yMzU5IDM2Mi41MjEgMTEuMTM3MSAzNjIuNTIxIDEyLjE5OTZDMzYyLjUyMSAxMy4yNjIyIDM2Mi45MiAxNC4xMzYgMzYzLjcxNSAxNC44Nzg5QzM2NC41MDkgMTUuNjIxNyAzNjUuNDYyIDE1Ljk5MzIgMzY2LjU3NyAxNS45OTMyWiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMzcwLjA1IDIwLjE2MTJIMzYzLjA4MVY0OS44MzA2SDM3MC4wNVYyMC4xNjEyWiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMTQ0LjA3MyA1OC4yMjc2TDEzMy44MTggODkuMzMxSDEzMy4zOTVMMTIzLjE0MSA1OC4yMjc2SDExNS4yNzRMMTI5LjIwOSA5Ny43Njc1SDEzOC4wMDVMMTUxLjkxNSA1OC4yMjc2SDE0NC4wNzNaIiBmaWxsPSIjMDMwMzBBIi8+CjxwYXRoIGQ9Ik0xNzIuNzI1IDcxLjMxMDFDMTcxLjQ2MiA3MC4wODkyIDE3MC4wMTIgNjkuMTg4MSAxNjguMzggNjguNjAzNUMxNjYuNzQ2IDY4LjAxODkgMTY1LjAxOSA2Ny43MjY3IDE2My4yMDIgNjcuNzI2N0MxNjAuMzc2IDY3LjcyNjcgMTU3LjkxOSA2OC4zNzIxIDE1NS44MzcgNjkuNjYzQzE1My43NTEgNzAuOTUzOSAxNTIuMTM4IDcyLjc1NjMgMTUwLjk5IDc1LjA2NDFDMTQ5Ljg0MiA3Ny4zNzE5IDE0OS4yNjcgODAuMDU3MiAxNDkuMjY3IDgzLjExN0MxNDkuMjY3IDg2LjE3NjggMTQ5Ljg0NSA4OC45MDE3IDE1MS4wMDIgOTEuMTg1MUMxNTIuMTU5IDkzLjQ2ODYgMTUzLjgxNSA5NS4yMzE0IDE1NS45NzEgOTYuNDc5N0MxNTguMTI2IDk3LjcyNzkgMTYwLjY4NyA5OC4zNTIxIDE2My42NTUgOTguMzUyMUMxNjUuOTUxIDk4LjM1MjEgMTY3Ljk4OCA5OC4wMDIgMTY5Ljc2MyA5Ny4zMDQ3QzE3MS41MzggOTYuNjA3NSAxNzIuOTk2IDk1LjYxNSAxNzQuMTM1IDk0LjMzMzJDMTc1LjI3MyA5My4wNTE1IDE3Ni4wNTYgOTEuNTUwNSAxNzYuNDc5IDg5LjgzNjRMMTY5Ljk2MSA4OS4wNjYxQzE2OS42NDQgODkuOTE1NiAxNjkuMTg3IDkwLjYyOCAxNjguNTk3IDkxLjIwMzRDMTY4LjAwNiA5MS43Nzg4IDE2Ny4zIDkyLjIwODEgMTY2LjQ3OCA5Mi40OTEzQzE2NS42NTYgOTIuNzc0NCAxNjQuNzUxIDkyLjkxNDUgMTYzLjc2MiA5Mi45MTQ1QzE2Mi4yNDMgOTIuOTE0NSAxNjAuOTE1IDkyLjU3OTYgMTU5Ljc3MyA5MS45MDY3QzE1OC42MzUgOTEuMjMzOCAxNTcuNzUyIDkwLjI1NjUgMTU3LjEyNSA4OC45NzQ4QzE1Ni41NjEgODcuODIwOSAxNTYuMjUxIDg2LjQ1MDggMTU2LjE5NiA4NC44NzM3SDE3Ni43OTZWODIuNjk2OEMxNzYuNzk2IDgwLjA5NjggMTc2LjQzMyA3Ny44NTI5IDE3NS43MDkgNzUuOTY4M0MxNzQuOTg0IDc0LjA4MzcgMTczLjk5MiA3Mi41MzEgMTcyLjcyOCA3MS4zMTAxSDE3Mi43MjVaTTE1OS40MTEgNzQuMjI5OUMxNjAuNDcxIDczLjUyMzUgMTYxLjc1MiA3My4xNjczIDE2My4yNTMgNzMuMTY3M0MxNjQuNzU0IDczLjE2NzMgMTY2LjAwOSA3My41MjA1IDE2Ny4wMTcgNzQuMjI5OUMxNjguMDI0IDc0LjkzOTMgMTY4Ljc4MiA3NS45MTY2IDE2OS4yOTQgNzcuMTYxOEMxNjkuNjU5IDc4LjA1MzkgMTY5Ljg5NCA3OS4wNTg2IDE2OS45OTcgODAuMTcyOUgxNTYuMjE3QzE1Ni4zMDkgNzkuMDU1NSAxNTYuNTY4IDc4LjAyNjUgMTU3IDc3LjA3OTZDMTU3LjU0OCA3NS44ODYxIDE1OC4zNTIgNzQuOTM2MiAxNTkuNDExIDc0LjIyNjhWNzQuMjI5OVoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTE5My44NTggNjcuNjk5MkMxOTIuMTYyIDY3LjY5OTIgMTkwLjY1MiA2OC4xNjUxIDE4OS4zMjcgNjkuMDkzN0MxODguMDAzIDcwLjAyMjMgMTg3LjA3NCA3MS4zNTI3IDE4Ni41NDQgNzMuMDg4MkgxODYuMjI4VjY4LjA5ODFIMTc5LjQ3MlY5Ny43Njc1SDE4Ni40NDFWODAuMzU4NkMxODYuNDQxIDc5LjA4NiAxODYuNzI3IDc3Ljk2ODYgMTg3LjMwMyA3Ny4wMTU3QzE4Ny44NzUgNzYuMDU5NyAxODguNjY3IDc1LjMwNzcgMTg5LjY3NCA3NC43NTk2QzE5MC42ODIgNzQuMjExNiAxOTEuODMgNzMuOTM3NiAxOTMuMTE4IDczLjkzNzZDMTkzLjcwMiA3My45Mzc2IDE5NC4zMTEgNzMuOTc0MSAxOTQuOTQ0IDc0LjA0NDJDMTk1LjU4MSA3NC4xMTQyIDE5Ni4wNDcgNzQuMjAyNSAxOTYuMzQ4IDc0LjMwOVY2Ny44ODhDMTk2LjAzMSA2Ny44MzYzIDE5NS42MjYgNjcuNzkwNiAxOTUuMTQyIDY3Ljc1NEMxOTQuNjU1IDY3LjcxNzUgMTk0LjIyOSA2Ny43MDIzIDE5My44NTggNjcuNzAyM1Y2Ny42OTkyWiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMjAxLjM4MSA1Ni4zMTU2QzIwMC4yNjcgNTYuMzE1NiAxOTkuMzE0IDU2LjY4NyAxOTguNTE5IDU3LjQyOTlDMTk3LjcyNCA1OC4xNzI4IDE5Ny4zMjUgNTkuMDc0IDE5Ny4zMjUgNjAuMTM2NUMxOTcuMzI1IDYxLjE5OTEgMTk3LjcyNCA2Mi4wNzI5IDE5OC41MTkgNjIuODE1N0MxOTkuMzE0IDYzLjU1ODYgMjAwLjI2NyA2My45MzAxIDIwMS4zODEgNjMuOTMwMUMyMDIuNDk1IDYzLjkzMDEgMjAzLjQyMSA2My41NTg2IDIwNC4yMTUgNjIuODE1N0MyMDUuMDEgNjIuMDcyOSAyMDUuNDA5IDYxLjE3MTcgMjA1LjQwOSA2MC4xMDkxQzIwNS40MDkgNTkuMDQ2NiAyMDUuMDEzIDU4LjE3MjggMjA0LjIxNSA1Ny40Mjk5QzIwMy40MjEgNTYuNjg3IDIwMi40NzcgNTYuMzE1NiAyMDEuMzgxIDU2LjMxNTZaIiBmaWxsPSIjMDMwMzBBIi8+CjxwYXRoIGQ9Ik0yMDQuODU1IDY4LjA5ODFIMTk3Ljg4NVY5Ny43Njc1SDIwNC44NTVWNjguMDk4MVoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTIyMC4wODcgNTYuMzcwNEMyMTguMzkxIDU2LjM3MDQgMjE2Ljg0MSA1Ni42OTkyIDIxNS40MzggNTcuMzUzOEMyMTQuMDM0IDU4LjAwODQgMjEyLjkxNyA1OC45OTc4IDIxMi4wODUgNjAuMzI1M0MyMTEuMjU0IDYxLjY1MjcgMjEwLjg0IDYzLjMxNTEgMjEwLjg0IDY1LjMxNTRWNjguMTAxMUgyMDYuNDk2VjczLjUxNDRIMjEwLjg0Vjk3Ljc3MDZIMjE3Ljc4MlY3My41MTQ0SDIyMy45NTZWNjguMTAxMUgyMTcuNzgyVjY1LjgxNzdDMjE3Ljc4MiA2NC42NTE2IDIxOC4wNTkgNjMuNzQ3NCAyMTguNjE2IDYzLjExMTFDMjE5LjE3MyA2Mi40NzQ4IDIyMC4wOTYgNjIuMTU1MSAyMjEuMzg0IDYyLjE1NTFDMjIxLjk1IDYyLjE1NTEgMjIyLjQ1MiA2Mi4yMDM4IDIyMi44OTQgNjIuMzAxMkMyMjMuMzM1IDYyLjM5ODYgMjIzLjY5NyA2Mi40OTkxIDIyMy45ODEgNjIuNjA1N0wyMjUuNDEyIDU3LjE5MjRDMjI0Ljk3IDU3LjAzNDEgMjI0LjI3NiA1Ni44NTc1IDIyMy4zMzIgNTYuNjYyN0MyMjIuMzg4IDU2LjQ2NzggMjIxLjMwNCA1Ni4zNzA0IDIyMC4wODcgNTYuMzcwNFoiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTIyOS44MzggNTYuMzE1NkMyMjguNzI0IDU2LjMxNTYgMjI3Ljc3MSA1Ni42ODcgMjI2Ljk3NiA1Ny40Mjk5QzIyNi4xODIgNTguMTcyOCAyMjUuNzgzIDU5LjA3NCAyMjUuNzgzIDYwLjEzNjVDMjI1Ljc4MyA2MS4xOTkxIDIyNi4xODIgNjIuMDcyOSAyMjYuOTc2IDYyLjgxNTdDMjI3Ljc3MSA2My41NTg2IDIyOC43MjQgNjMuOTMwMSAyMjkuODM4IDYzLjkzMDFDMjMwLjk1MyA2My45MzAxIDIzMS44NzggNjMuNTU4NiAyMzIuNjczIDYyLjgxNTdDMjMzLjQ2NyA2Mi4wNzI5IDIzMy44NjYgNjEuMTcxNyAyMzMuODY2IDYwLjEwOTFDMjMzLjg2NiA1OS4wNDY2IDIzMy40NzEgNTguMTcyOCAyMzIuNjczIDU3LjQyOTlDMjMxLjg3OCA1Ni42ODcgMjMwLjkzNCA1Ni4zMTU2IDIyOS44MzggNTYuMzE1NloiIGZpbGw9IiMwMzAzMEEiLz4KPHBhdGggZD0iTTIzMy4zMDkgNjguMDk4MUgyMjYuMzRWOTcuNzY3NUgyMzMuMzA5VjY4LjA5ODFaIiBmaWxsPSIjMDMwMzBBIi8+CjxwYXRoIGQ9Ik0yNDYuNTcxIDc0LjUwNjlDMjQ3LjY0IDczLjczNjcgMjQ4Ljg4OCA3My4zNTMgMjUwLjMxOSA3My4zNTNDMjUxLjQ0OSA3My4zNTMgMjUyLjQyNiA3My41NzUzIDI1My4yNDggNzQuMDE2OEMyNTQuMDcgNzQuNDU4MiAyNTQuNzM3IDc1LjA2MSAyNTUuMjQ4IDc1LjgyMjJDMjU1Ljc2IDc2LjU4MzMgMjU2LjEwNCA3Ny40NDE5IDI1Ni4yODEgNzguMzk3OUgyNjIuOTU3QzI2Mi43OTkgNzYuMjU3NiAyNjIuMTY2IDc0LjM4NTEgMjYxLjA2NCA3Mi43ODM3QzI1OS45NTggNzEuMTgyMyAyNTguNDgyIDY5Ljk0MDEgMjU2LjYyNSA2OS4wNTQxQzI1NC43NyA2OC4xNzEyIDI1Mi42MzMgNjcuNzI2NyAyNTAuMjEzIDY3LjcyNjdDMjQ3LjMzMyA2Ny43MjY3IDI0NC44MzMgNjguMzc1MiAyNDIuNzE0IDY5LjY3ODJDMjQwLjU5NSA3MC45NzgzIDIzOC45NiA3Mi43Nzc2IDIzNy44MTIgNzUuMDc5M0MyMzYuNjY0IDc3LjM3OCAyMzYuMDg5IDgwLjA0MiAyMzYuMDg5IDgzLjA2ODNDMjM2LjA4OSA4Ni4wOTQ2IDIzNi42NTUgODguNzAzOCAyMzcuNzg1IDkxLjAwMjVDMjM4LjkxNCA5My4zMDExIDI0MC41NCA5NS4xMDM1IDI0Mi42NTkgOTYuNDAzNUMyNDQuNzc4IDk3LjcwMzYgMjQ3LjMxNCA5OC4zNTUxIDI1MC4yNjEgOTguMzU1MUMyNTIuNzM0IDk4LjM1NTEgMjU0Ljg4OSA5Ny44OTg0IDI1Ni43MjUgOTYuOTg4MUMyNTguNTYxIDk2LjA3NzggMjYwLjAxOSA5NC44MTczIDI2MS4wOTcgOTMuMjA2N0MyNjIuMTc1IDkxLjU5NjIgMjYyLjc5MyA4OS43MzkgMjYyLjk1MSA4Ny42MzIxSDI1Ni4yNzRDMjU1Ljk3MyA4OS4yMjQ0IDI1NS4yOTEgOTAuNDcyNyAyNTQuMjIyIDkxLjM3MzlDMjUzLjE1NCA5Mi4yNzUxIDI1MS44NTEgOTIuNzI4NyAyNTAuMzE2IDkyLjcyODdDMjQ4Ljg2NyA5Mi43Mjg3IDI0Ny42MDMgOTIuMzM2IDI0Ni41MjkgOTEuNTQ3NEMyNDUuNDUxIDkwLjc2MTkgMjQ0LjYyIDg5LjYzNTQgMjQ0LjAzOCA4OC4xNzcxQzI0My40NTQgODYuNzE4NyAyNDMuMTY0IDg0Ljk4MDMgMjQzLjE2NCA4Mi45NjE3QzI0My4xNjQgODAuOTQzMiAyNDMuNDY2IDc5LjI0NzMgMjQ0LjA2NiA3Ny44MTMzQzI0NC42NjUgNzYuMzc5MyAyNDUuNSA3NS4yODAzIDI0Ni41NjggNzQuNTFMMjQ2LjU3MSA3NC41MDY5WiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMjg1Ljg3NCA2OS44NzYxQzI4NC42ODkgNjkuMDk2NyAyODMuMzkyIDY4LjU0NTYgMjgxLjk4IDY4LjIxNjhDMjgwLjU2NyA2Ny44ODggMjc5LjE1NCA2Ny43MjY3IDI3Ny43NDIgNjcuNzI2N0MyNzUuNjc0IDY3LjcyNjcgMjczLjc5IDY4LjAzMTEgMjcyLjA4NSA2OC42NDMxQzI3MC4zOCA2OS4yNTUgMjY4LjkzNyA3MC4xNjU0IDI2Ny43NTIgNzEuMzc3MUMyNjYuNTY4IDcyLjU4ODggMjY1LjcyMiA3NC4wOTU5IDI2NS4yMSA3NS45MDE0TDI3MS43MDEgNzYuODI5OUMyNzIuMDU0IDc1LjgyMjIgMjcyLjczIDc0Ljk0NTQgMjczLjcyOSA3NC4yMDI1QzI3NC43MjggNzMuNDU5NiAyNzYuMDgyIDczLjA4ODIgMjc3Ljc5NyA3My4wODgyQzI3OS40MjIgNzMuMDg4MiAyODAuNjU4IDczLjQ4NyAyODEuNTA1IDc0LjI4MTZDMjgyLjM1NCA3NS4wNzkzIDI4Mi43NzcgNzYuMTkzNiAyODIuNzc3IDc3LjYyNDZWNzcuNzU4NUMyODIuNzc3IDc4LjQzMTQgMjgyLjUzNCA3OC45Mjc3IDI4Mi4wNSA3OS4yNDQzQzI4MS41NjMgNzkuNTY0IDI4MC43ODMgNzkuNzkyMyAyNzkuNzA1IDc5LjkzNTRDMjc4LjYyOCA4MC4wNzg1IDI3Ny4yMTUgODAuMjQ2IDI3NS40NjcgODAuNDQwOEMyNzQuMDM2IDgwLjU4MzkgMjcyLjY1MSA4MC44MjQ0IDI3MS4zMDkgODEuMTcxNUMyNjkuOTY2IDgxLjUxNTUgMjY4Ljc2IDgyLjAxNzkgMjY3LjY5MiA4Mi42Njk0QzI2Ni42MjMgODMuMzI0IDI2NS43OCA4NC4yMDA5IDI2NS4xNjIgODUuMjk2OUMyNjQuNTQzIDg2LjM5MyAyNjQuMjMzIDg3Ljc3NTIgMjY0LjIzMyA4OS40Mzc2QzI2NC4yMzMgOTEuMzgzIDI2NC42NjUgOTMuMDIxIDI2NS41MyA5NC4zNDg1QzI2Ni4zOTUgOTUuNjc1OSAyNjcuNTc5IDk2LjY4MDYgMjY5LjA4IDk3LjM1OTVDMjcwLjU4MSA5OC4wNDE1IDI3Mi4yNzcgOTguMzgyNSAyNzQuMTY3IDk4LjM4MjVDMjc1LjcyIDk4LjM4MjUgMjc3LjA2OSA5OC4xNjAzIDI3OC4yMDggOTcuNzE4OEMyNzkuMzQ2IDk3LjI3NzMgMjgwLjMwMiA5Ni42OTU4IDI4MS4wNjkgOTUuOTgwM0MyODEuODM3IDk1LjI2NDkgMjgyLjQzMyA5NC40OTc2IDI4Mi44NTcgOTMuNjg0N0gyODMuMDdWOTcuNzcwNkgyODkuNzc0Vjc3LjkxOTlDMjg5Ljc3NCA3NS45NTYyIDI4OS40MjEgNzQuMzE4MiAyODguNzE0IDczLjAwOUMyODguMDA4IDcxLjY5OTggMjg3LjA2NCA3MC42NTU1IDI4NS44OCA2OS44NzYxSDI4NS44NzRaTTI4Mi44MjYgODcuMTI2N0MyODIuODI2IDg4LjIyMjggMjgyLjU0MyA4OS4yMzY2IDI4MS45NzcgOTAuMTY1MkMyODEuNDEgOTEuMDkzOCAyODAuNjE2IDkxLjgzNjcgMjc5LjU5MyA5Mi4zOTM4QzI3OC41NjcgOTIuOTUxIDI3Ny4zNDkgOTMuMjMxMSAyNzUuOTM2IDkzLjIzMTFDMjc0LjUyNCA5My4yMzExIDI3My4yOTcgOTIuOTAyMyAyNzIuMzU5IDkyLjI0NzdDMjcxLjQyMSA5MS41OTMxIDI3MC45NTUgOTAuNjE4OCAyNzAuOTU1IDg5LjMyNzlDMjcwLjk1NSA4OC40MjY3IDI3MS4xOTMgODcuNjkzIDI3MS42NzEgODcuMTIzN0MyNzIuMTQ5IDg2LjU1NzQgMjcyLjc5NyA4Ni4xMDk4IDI3My42MTkgODUuNzg0MUMyNzQuNDQxIDg1LjQ1NTIgMjc1LjM3MyA4NS4yMjM5IDI3Ni40MTQgODUuMDgwOEMyNzYuODc0IDg1LjAyOSAyNzcuNDE2IDg0Ljk1NTkgMjc4LjA0MyA4NC44Njc2QzI3OC42NyA4NC43NzkzIDI3OS4zMSA4NC42NzI4IDI3OS45NjQgODQuNTQ4QzI4MC42MTkgODQuNDIzMSAyODEuMiA4NC4yODYxIDI4MS43MTIgODQuMTM2OUMyODIuMjIzIDgzLjk4NzggMjgyLjU5NSA4My44MjMzIDI4Mi44MjYgODMuNjQ2OFY4Ny4xMjM3Vjg3LjEyNjdaIiBmaWxsPSIjMDMwMzBBIi8+CjxwYXRoIGQ9Ik0zMDYuOTY3IDkyLjE5NTlDMzA2LjU5NSA5Mi4yNDc3IDMwNi4yNiA5Mi4yNzUxIDMwNS45NTkgOTIuMjc1MUMzMDQuODQ1IDkyLjI3NTEgMzA0LjAzNSA5MS45OTUgMzAzLjUyIDkxLjQzNzhDMzAzLjAwOSA5MC44ODA3IDMwMi43NTMgOTAuMDE5MSAzMDIuNzUzIDg4Ljg0OTlWNzMuNTExNEgzMDguNjA4VjY4LjA5ODFIMzAyLjc1M1Y2MS4wMzc3SDI5NS43ODRWNjguMDk4MUgyOTEuNjI1VjczLjUxMTRIMjk1Ljc4NFY4OS45OTE3QzI5NS43ODQgOTIuNTIxNyAyOTYuNTY5IDk0LjUxNTkgMjk4LjE0MyA5NS45NzczQzI5OS43MTQgOTcuNDM1NyAzMDEuODc5IDk4LjE2NjQgMzA0LjYzNSA5OC4xNjY0QzMwNS4zOTMgOTguMTY2NCAzMDYuMTU0IDk4LjEwODUgMzA2LjkxMiA5Ny45OTI4QzMwNy42NyA5Ny44NzcxIDMwOC40MjIgOTcuNzA2NiAzMDkuMTY1IDk3LjQ3NTJMMzA3Ljk3MSA5Mi4wMDcyQzMwNy42NyA5Mi4wNzcyIDMwNy4zMzUgOTIuMTQxMSAzMDYuOTY0IDkyLjE5MjlMMzA2Ljk2NyA5Mi4xOTU5WiIgZmlsbD0iIzAzMDMwQSIvPgo8cGF0aCBkPSJNMzMzLjI2MyA3MS4zMTAxQzMzMS45OTkgNzAuMDg5MiAzMzAuNTUgNjkuMTg4MSAzMjguOTE4IDY4LjYwMzVDMzI3LjI4MyA2OC4wMTg5IDMyNS41NTcgNjcuNzI2NyAzMjMuNzM5IDY3LjcyNjdDMzIwLjkxNCA2Ny43MjY3IDMxOC40NTcgNjguMzcyMSAzMTYuMzc0IDY5LjY2M0MzMTQuMjg5IDcwLjk1MzkgMzEyLjY3NSA3Mi43NTYzIDMxMS41MjcgNzUuMDY0MUMzMTAuMzggNzcuMzcxOSAzMDkuODA0IDgwLjA1NzIgMzA5LjgwNCA4My4xMTdDMzA5LjgwNCA4Ni4xNzY4IDMxMC4zODMgODguOTAxNyAzMTEuNTQgOTEuMTg1MUMzMTIuNjk3IDkzLjQ2ODYgMzE0LjM1MyA5NS4yMzE0IDMxNi41MDggOTYuNDc5N0MzMTguNjY0IDk3LjcyNzkgMzIxLjIyNCA5OC4zNTIxIDMyNC4xOTMgOTguMzUyMUMzMjYuNDg4IDk4LjM1MjEgMzI4LjUyNSA5OC4wMDIgMzMwLjMgOTcuMzA0N0MzMzIuMDc1IDk2LjYwNzUgMzMzLjUzNCA5NS42MTUgMzM0LjY3MiA5NC4zMzMyQzMzNS44MTEgOTMuMDUxNSAzMzYuNTkzIDkxLjU1MDUgMzM3LjAxNyA4OS44MzY0TDMzMC40OTggODkuMDY2MUMzMzAuMTgyIDg5LjkxNTYgMzI5LjcyNSA5MC42MjggMzI5LjEzNCA5MS4yMDM0QzMyOC41NDQgOTEuNzc4OCAzMjcuODM3IDkyLjIwODEgMzI3LjAxNSA5Mi40OTEzQzMyNi4xOTMgOTIuNzc0NCAzMjUuMjg5IDkyLjkxNDUgMzI0LjI5OSA5Mi45MTQ1QzMyMi43OCA5Mi45MTQ1IDMyMS40NSA5Mi41Nzk2IDMyMC4zMTEgOTEuOTA2N0MzMTkuMTcyIDkxLjIzMzggMzE4LjI4OSA5MC4yNTY1IDMxNy42NjIgODguOTc0OEMzMTcuMDk5IDg3LjgyMDkgMzE2Ljc4OCA4Ni40NTA4IDMxNi43MzQgODQuODczN0gzMzcuMzMzVjgyLjY5NjhDMzM3LjMzMyA4MC4wOTY4IDMzNi45NzEgNzcuODUyOSAzMzYuMjQ2IDc1Ljk2ODNDMzM1LjUyMiA3NC4wODM3IDMzNC41MjkgNzIuNTMxIDMzMy4yNjYgNzEuMzEwMUgzMzMuMjYzWk0zMTkuOTQ5IDc0LjIyOTlDMzIxLjAwOCA3My41MjM1IDMyMi4yOSA3My4xNjczIDMyMy43OTEgNzMuMTY3M0MzMjUuMjkyIDczLjE2NzMgMzI2LjU0NiA3My41MjA1IDMyNy41NTQgNzQuMjI5OUMzMjguNTYyIDc0LjkzOTMgMzI5LjMyIDc1LjkxNjYgMzI5LjgzMSA3Ny4xNjE4QzMzMC4xOTcgNzguMDUzOSAzMzAuNDMxIDc5LjA1ODYgMzMwLjUzNSA4MC4xNzI5SDMxNi43NTVDMzE2Ljg0NiA3OS4wNTU1IDMxNy4xMDUgNzguMDI2NSAzMTcuNTM3IDc3LjA3OTZDMzE4LjA4NSA3NS44ODYxIDMxOC44ODkgNzQuOTM2MiAzMTkuOTQ5IDc0LjIyNjhWNzQuMjI5OVoiIGZpbGw9IiMwMzAzMEEiLz4KPC9zdmc+Cg==",
                    REPORT: "Segnala",
                    BASED_ON: "Sulla base di ",
                    ON: "su",
                    PREVIOUS_REVIEWS: "Recensioni precedenti",
                    NEXT_REVIEWS: "Recensioni successive",
                    SUBMITTED_REVIEW: " recensioni sottoposte a verifica",
                    SUBMITTED_REVIEW_CAROUSEL: " recensioni",
                    ATTESTATION_LINK: "Vedi tutte le recensioni su questo sito",
                    SORT_REVIEWS: "Ordina le recensioni",
                    ASK_A_QUESTION: "Fai una domanda",
                    QUESTION_LABEL: "Domande",
                    SORT_QUESTIONS: "Ordina le domande",
                    RECENT: "Più recenti",
                    OLDEST: "Meno recenti",
                    HIGHEST_RATING: "Voto più alto",
                    LOWEST_RATING: "Voto più basso",
                    SEARCH: "Cerca",
                    REVIEW_OF: "Recensione del ",
                    REVIEW: "Recensione",
                    EXPERIENCE_OF: ", in seguito ad un'esperienza del ",
                    PSEUDONYMIZED_TEXT: "*Dato pseudonomizzato su richiesta dell'autore.",
                    ANONYMIZED_TEXT: "*Recensione anonimizzata poiché risalente a più di 18 mesi fa",
                    PRIVACY_URL: '<a target="_blank" rel="nofollow" href="https://www.netreviews.com/it/privacy-policy/#it4">per saperne di più</a>',
                    REWARDED_REVIEWS: "Questa recensione è <b>lumified</b>. Il suo autore è stato ricompensato per aver scritto una recensione argomentata e/o con delle foto, più utili per la community e i futuri acquirenti.",
                    REWARDS_URL: '<a rel="nofollow" href="https://rwd.skeepers.io/" class="link simulate-hyperlink" >Per saperne di</a> più su SKEEPERS Rewards.',
                    GIFTED_REVIEWS: "L’autore di questa recensione ha ricevuto il prodotto gratuitamente in cambio di una recensione argomentata e/o con foto, utili per la community e i futuri acquirenti.",
                    GIFTED_URL: '<a rel="nofollow" href="https://skeepers.io/en/transparency-charter" class="link simulate-hyperlink" >Per saperne di più</a> su Influencer Marketing.',
                    COMPENSATED_REVIEWS: "L’autore è stato compensato per lasciare una recensione (codice promozionale, punti fedeltà...) indipendentemente dalla sua valutazione. La recensione è stata raccolta e verificata da",
                    PSEUDONYMIZED_PLACEHOLDER: "NOME N*",
                    EXPERIENCE_BY: " di ",
                    RESPONSE_BY: "Risposta di",
                    COLLECTED_BY: "Raccolta da",
                    TRANSLATE_BUTTON: "Traduci la recensione ",
                    REVIEW_TRANSLATED: "Visualizza la recensione originale",
                    NO_REVIEWS: "Nessuna recensione disponibile",
                    NO_QUESTIONS: "Nessuna domanda disponibile.",
                    NO_QUESTIONS_SUBTEXT: "Puoi essere il primo !",
                    REINITIALISE: "Ripristina",
                    LABEL_FILTER_SORT: "Ordinare le recensioni (aggiornamento automatico dopo la selezione)",
                    LABEL_FILTER_SORT_QUESTION: "Ordina le domande in base alla data più recente o più vecchia",
                    LABEL_SEARCH: "Cercare recensioni per parola chiave",
                    LABEL_FIRST_PAGE: "Vai alla prima pagina delle recensioni",
                    LABEL_PREVIOUS_PAGE: "Recensioni precedenti",
                    LABEL_PAGE_SPECIFIC: "Elenco di recensioni",
                    LABEL_NEXT_PAGE: "Avvisi successivi",
                    LABEL_LAST_PAGE: "Vai all'ultima pagina delle recensioni",
                    LABEL_PAGE: "Pagina",
                    LABEL_POPUP_CLOSE: "Chiudi il popup",
                    RULE_ONE: "Per maggiori informazioni sulle caratteristiche della verifica delle recensioni, la possibilità di contattate l’autore della recensione, i dettagli della pubblicazione e della conservazione delle recensioni, così come le modalità di soppressione o modifica delle recensioni, ",
                    RULE_ONE_LINK: '<a rel="nofollow" href="https://www.netreviews.com/consumers/it/carta-dei-servizi/" class="link simulate-hyperlink">consulta i nostri T&C</a>.',
                    RULE_THREE: 'Non è stato dato alcun compenso in cambio delle recensioni, ad eccezione di quelle contrassegnate come “Incentivata e verificata”, per le quali le procedure di verifica sono disponibili <a rel="nofollow" href="https://it.recensioni-verificate.com/modalita-visualizzazione-prodotto" class="link simulate-hyperlink">qui</a>.',
                    RULE_FOUR: "I nomi mostrati con un * sono stati pseudonimizzati su richiesta dell'autore.",
                    SKEEPERS_AVIS: "recensioni",
                    STARS: "stelle",
                    STARS_SINGLE: "stella",
                    READ_MORE: "leggi tutto",
                    READ_LESS: "vedi meno",
                    RESPONSE_BY_MERCHANT: "Risposta del commerciante",
                    RESPONSE_BY_CONSUMER: "Risposta anonima",
                    ANONYMOUS: "Anonima",
                    CAROUSEL_PREV_SLIDE: "Diapositiva precedente",
                    CAROUSEL_NEXT_SLIDE: "Prossima diapositiva",
                    CAROUSEL_FIRST_SLIDE: "Prima diapositiva",
                    CAROUSEL_LAST_SLIDE: "ultima diapositiva",
                    CAROUSEL_PAGINATION_BULLET: "Vai alla diapositiva",
                    PRODUCT_RESPONSE_VIEW_MORE: "Mostra commenti",
                    PRODUCT_RESPONSE_VIEW_LESS: "Nascondi commenti",
                    MOST_USEFUL: "Più utile",
                    USEFUL_YES: "Sì",
                    USEFUL_NO: "No",
                    POWERED_BY: "Powered by",
                    ANSWER_QUESTION: "Partecipa alla conversazione",
                    QUESTION_FROM: "Domanda di",
                    POSTED_ON: "posta il",
                    PSEUDO: "Pseudonimo",
                    EMAIL: "Email",
                    QUESTION: "Domanda",
                    ANSWER: "Risposta",
                    EMPTY_EMAIL_ERROR: "Il campo email è vuoto",
                    PATTERN_EMAIL_ERROR: "Il campo email non è nel formato corretto",
                    PATTERN_PSEUDO_ERROR: "Il campo pseudonimo non è nel formato corretto",
                    EMPTY_PSEUDO_ERROR: "Il campo dello pseudonimo è vuoto",
                    EMPTY_QUESTION_ERROR: "Il campo delle domande è vuoto",
                    EMPTY_ANSWER_ERROR: "Il campo delle risposte è vuoto",
                    REPONSE_VIEW_MORE: "Mostra tutte le risposte",
                    REPONSE_VIEW_LESS: "Nascondi risposte",
                    RESPONSE_ON: "il",
                    CLOSE: "Chiudere",
                    SEND_FORM: "Invia",
                    NOTIFICATION_QUESTION_SEND: "Grazie per la domanda! Riceverai un'email di conferma. Una volta confermata, la tua domanda sarà moderata prima di essere pubblicata. Potrebbero volerci alcuni giorni.",
                    NOTIFICATION_RESPONSE_SEND: "Grazie per la risposta! Riceverai un'email di conferma. Una volta confermata, la tua risposta sarà moderata prima di essere pubblicata. Potrebbero volerci alcuni giorni.",
                    THANK_YOU_QUESTION_SENT: "Grazie per la domanda, convalida la domanda nelle tue email.",
                    THANK_YOU_ANSWER_SENT: "Grazie per la risposta, convalida la risposta nell'email.",
                    QUESTION_TERMS_AND_CONDITION: 'Accetto <a rel="nofollow" href="https://www.recensioni-verificate.com/it/condizioni-generali-prestazione-servizi/" target="_blank">le Condizioni Generali d’Utilizzo</a> e <a rel="nofollow" href="https://www.recensioni-verificate.com/it/dati-personali/" target="_blank">l\'Informativa sulla Privacy</a> di Recensioni Verificate.',
                    USEFUL_REVIEW: "Questa recensione è stata utile per te?",
                    VERIFIED: "Verificata",
                    VERIFIED_GIFTED: "Incentivata e verificata",
                    COLLECTED_AND_VERIFIED: "Raccolta e verificata da",
                    GIFTED_AND_VERIFIED: "L'autore ha ricevuto il prodotto gratuitamente per lasciare una recensione indipendentemente dalla sua valutazione. La recensione è stata raccolta e verificata da",
                    VERIFIED_REVIEWS: "Recensioni Verificate",
                    VERIFIED_BY: "Verificato da",
                    SPONTANEOUS_REVIEW: "Recensione spontanea senza verifica dell'acquisto",
                    SPONTANEOUS_REVIEW_SYNDICATED: "Recensione spontanea senza verifica dell'acquisto raccolta da",
                    SPONTANEOUS_LABEL: "Spontaneo",
                    REVIEW_SUMMARY_TITLE: "Riepilogo recensioni",
                    REVIEW_SUMMARY_AI_TEXT: "Questo riepilogo è generato da IA",
                    REVIEW_SUMMARY_FEEDBACK_MESSAGE: "Grazie per il vostro feedback!",
                    REVIEW_SUMMARY_HELPFUL: "È stato utile?",
                    REVIEW_SUMMARY_TOOLTIP_BASED_ON: "Riepilogo basato su un campione rappresentativo di <b>almeno 10 recensioni</b> con almeno 20 caratteri.",
                    REVIEW_SUMMARY_TOOLTIP_LAST_UPDATE: "Questo riepilogo viene aggiornato settimanalmente se il prodotto ha ricevuto almeno il 20% di recensioni aggiuntive.",
                    OTHER_IMAGE_TEXT: "Altre immagini in questo recensioni",
                    USEFUL: "Utile",
                    ALL_FIELDS_ARE_REQUIRED: "Tutti i campi sono obbligatori.",
                    LABEL_SEARCH_ICON: "Avvia la ricerca di recensioni per parola chiave",
                    FILTERS_BY_RATINGS: "Filtra le recensioni per numero di stelle",
                    REINITIALISE_DESCRIPTION: "Reimposta la lista delle recensioni",
                    VOTE_HELPFUL: "Voto utile",
                    MORE_INFORMATION: "Ulteriori informazioni su queste recensioni",
                    MORE_INFORMATION_ON_REVIEW: "Ulteriori informazioni sull'origine di questa recensione"
                }
            }
        },
        t = {};

    function e(i) {
        var n = t[i];
        if (void 0 !== n) return n.exports;
        var N = t[i] = {
            exports: {}
        };
        return M[i](N, N.exports, e), N.exports
    }
    e.d = (M, t) => {
        for (var i in t) e.o(t, i) && !e.o(M, i) && Object.defineProperty(M, i, {
            enumerable: !0,
            get: t[i]
        })
    }, e.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (M) {
            if ("object" == typeof window) return window
        }
    }(), e.o = (M, t) => Object.prototype.hasOwnProperty.call(M, t), e.r = M => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(M, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(M, "__esModule", {
            value: !0
        })
    };
    var i = {};
    (() => {
        "use strict";
        e.r(i), e.d(i, {
            generate: () => o
        });
        var M = e(77),
            t = e(272),
            n = e(745);
        const N = e => {
            if (M.xr.JS === e.brandWidget.template.format) {
                window.performance.mark("Skeepers Widget empty : start");
                const n = (i = e.brandWidget.anchorPoint, `<div class="skeepers-widget-wrapper-${e.brandWidget.guid}"\nstyle="height: auto; display: block; z-index: 999999; max-width:100%; text-decoration: none; ${(0,t.Tv)({anchor:i,style:""})}">\n<div style="display:block;"></div>\n</div>`);
                if (e.brandWidget.position === M.yN.Float) document.body.insertBefore(document.createRange().createContextualFragment(n), document.body.firstElementChild);
                else {
                    const M = document.getElementById(`${e.brandWidget.guid}`);
                    M ? M.appendChild(document.createRange().createContextualFragment(n)) : console.warn(`\n                    Verified Reviews: You are using a widget that needs a container, \n                    but the element with ID: ${e.brandWidget.guid} could not be found. \n                    Please add the element <div id='${e.brandWidget.guid}'></div> to display the widget.\n                `)
                }
                window.performance.mark("Skeepers Widget : done")
            }
            var i
        };
        var r, g = e(27);
        ! function(M) {
            M[M.Float = 0] = "Float", M[M.Relative = 1] = "Relative"
        }(r || (r = {}));
        const I = async (i, N, I) => {
                const D = (0, t.iI)(i.brandWidget.template.color);
                let j;
                (0, g.W)(i.langCode);
                const o = document.getElementById(i.brandWidget.guid);
                if (o && (o.innerHTML = ""), i.brandWidget.position === r.Relative) {
                    const M = document.getElementById(i.brandWidget.guid);
                    if (!M) return void console.error("No container found for relative position");
                    j = M
                } else j = document.createElement("div"), j.id = i.brandWidget.guid;
                let u = null;
                !N.isBlocked && I ? (u = document.createElement("a"), u.href = I, u.target = "_blank", u.rel = "author") : u = document.createElement("span"), u.classList.add(`${n.s3}-${i.brandWidget.guid}`), u.style.display = "block";
                const A = `height: ${i.brandWidget.computerHeight};display: block; max-width:100%; text-decoration: none;`,
                    a = i.brandWidget.position === r.Float ? (t => {
                        const e = "position: fixed; z-index: 999999;";
                        switch (t) {
                            case M.gO.TopLeft:
                                return `${e}top: 1vh; left:1vh;`;
                            case M.gO.TopRight:
                                return `${e}top: 1vh; right:1vh;`;
                            case M.gO.BottomRight:
                                return `${e}bottom: 1vh; right:1vh;`;
                            case M.gO.BottomLeft:
                                return `${e}bottom: 1vh; left:1vh`;
                            default:
                                return ""
                        }
                    })(i.brandWidget.anchorPoint) : "";
                u.style.cssText = A + a; {
                    let M;
                    await Promise.resolve().then(e.bind(e, 416)).then((async t => {
                        M = await t.buildCircularBadge(N, D, i.langCode, i.brandWidget.logo_svg)
                    })), u.insertAdjacentHTML("afterbegin", M)
                }
                u.insertAdjacentHTML("afterbegin", (M => `<style>${(M=>{const t=`.${n.s3}-${M.brandWidget.guid}`,e=`${t} { display: none !important; } `,i=`${t} { width: ${M.brandWidget.mobileWidth}px; } `,N=`${t} { width: ${M.brandWidget.computerWidth}px; } `,r=(g=M.brandWidget.isDisplayedOnMobile?i:e,`@media all and (max-width: ${n.Gh}px ) { ${g} } `);var g;const I=(M=>`@media all and (min-width: ${n.Gh}px ) { ${M} } `)(M.brandWidget.isDisplayedOnComputer?N:e);return I+r})(M)}</style>`)(i)), i.brandWidget.position === r.Float && document.body.appendChild(j), j.appendChild(u), ((M, t) => {
                    const e = document.createElement("script"),
                        i = `\nwindow.skpBus=window.skpBus||function(){\nvar p=[];\nArray.prototype.push.apply(p,arguments);\nreturn (window.skpBus.p=window.skpBus.p||[]).push(p);\n}\n        if(typeof sendVisibleEventSent === 'undefined') {\n             let sendVisibleEventSent = false;\n        const observer = new IntersectionObserver((entries, observer) => {\n            if(entries[0].isIntersecting && !sendVisibleEventSent) {\n                 skpBus('emit', 'rr:brand_review_widget_visible',\n                  {widget_id:"${M}", rating:${t.note} , review_count: ${t.reviewCount} });\n                sendVisibleEventSent = true;\n            }\n        });\n        const badgeElem = document.getElementById("${M}")\n        observer.observe(badgeElem);\n        badgeElem.onclick = function() { skpBus('emit', 'rr:brand_review_widget_click',\n        {widget_id:"${M}", rating:${t.note} , review_count: ${t.reviewCount} }) }\n        }\n       `,
                        n = document.createTextNode(i);
                    e.appendChild(n), document.body.appendChild(e)
                })(i.brandWidget.guid, N)
            },
            D = {};
        var j;
        async function o(M) {
            const t = JSON.parse('{"langCode":"it_IT","brandWidget":{"template":{"langCode":"it_IT","shape":1,"color":0,"format":0,"type":0,"version":1},"id":6154,"guid":"aa3d9249-61c3-4fcc-93d9-19dbedc2e39f","websiteId":"698e2820-e88a-f844-1921-29068640a32d","name":"badge_2","disabled":false,"certifiedLink":"https://www.recensioni-verificate.com/avis-clients/carrefour.it","position":1,"anchorPoint":1,"isDisplayedOnComputer":true,"isDisplayedOnMobile":true,"computerWidth":150,"computerHeight":"auto","mobileWidth":140,"mobileHeight":"auto","logo_svg":"<path d=\\"M8.07391 6.30585C4.75931 6.30585 2.07227 8.99289 2.07227 12.3075H12.1255L14.0756 6.30585H8.07391Z\\" class=\\"logo01\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M20.4819 6.60028C19.4579 3.44771 16.0718 1.72297 12.9192 2.74696L16.0257 12.3083H22.3366L20.4819 6.60028Z\\" class=\\"logo01\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M24.0367 18.4917C26.718 16.5432 27.3127 12.7903 25.3642 10.1082L17.2307 16.0177L19.1808 22.0193L24.0359 18.4917H24.0367Z\\" class=\\"logo01\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M13.8256 25.5469C16.5069 27.4954 20.2607 26.9008 22.2091 24.2195L14.0756 18.3099L8.97046 22.0193L13.8256 25.5469Z\\" class=\\"logo01\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M3.9608 18.0163C2.93681 21.1689 4.66155 24.555 7.81412 25.579L10.9206 16.0177L5.81549 12.3083L3.9608 18.0163Z\\" class=\\"logo01\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M34.4393 9.70185H36.4108L38.4975 13.616H40.6589L38.3519 9.38273C38.421 9.35476 38.4892 9.32516 38.555 9.29308C39.1176 9.02084 39.5437 8.63345 39.8323 8.13173C40.121 7.63002 40.265 7.03701 40.265 6.35353C40.265 5.67005 40.1219 5.07869 39.8356 4.56463C39.5494 4.05058 39.1283 3.65086 38.5723 3.36381C38.0163 3.07677 37.3279 2.93365 36.5079 2.93365H32.5073V13.616H34.4402V9.70185H34.4393ZM36.2068 4.55476C36.6938 4.55476 37.0894 4.6255 37.3953 4.76614C37.7005 4.90679 37.9275 5.11241 38.0755 5.383C38.2236 5.65278 38.2976 5.97683 38.2976 6.35435C38.2976 6.73187 38.2244 7.05099 38.0796 7.31172C37.9341 7.57245 37.7079 7.76902 37.3994 7.90309C37.0918 8.03715 36.697 8.10377 36.2151 8.10377H34.4402V4.55476H36.2077H36.2068Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M42.4775 13.2682C43.0598 13.6054 43.7515 13.774 44.5535 13.774C45.1736 13.774 45.7239 13.6794 46.2034 13.491C46.6829 13.3027 47.0768 13.0346 47.3844 12.6883C47.6921 12.342 47.9034 11.9366 48.0178 11.4735L46.2568 11.2654C46.1713 11.4949 46.0479 11.6873 45.8883 11.8428C45.7288 11.9982 45.538 12.1142 45.3159 12.1907C45.0938 12.2672 44.8496 12.305 44.5822 12.305C44.1718 12.305 43.8132 12.2146 43.5048 12.0328C43.1972 11.851 42.9587 11.587 42.7892 11.2407C42.6371 10.929 42.5532 10.5589 42.5384 10.1329H48.1033V9.54478C48.1033 8.84238 48.0054 8.23621 47.8097 7.7271C47.6139 7.21798 47.3458 6.79852 47.0045 6.4687C46.6631 6.13889 46.2716 5.89543 45.8308 5.73752C45.3891 5.5796 44.9228 5.50064 44.4317 5.50064C43.6685 5.50064 43.0047 5.67501 42.4422 6.02374C41.8788 6.37247 41.4428 6.85856 41.1328 7.48282C40.8227 8.10626 40.6672 8.83169 40.6672 9.65911C40.6672 10.4865 40.8235 11.2218 41.1361 11.8387C41.4486 12.4555 41.896 12.9318 42.4783 13.269L42.4775 13.2682ZM43.4077 7.25664C43.694 7.06582 44.0402 6.96959 44.4457 6.96959C44.8512 6.96959 45.1901 7.065 45.4623 7.25664C45.7345 7.44828 45.9393 7.71229 46.0775 8.04869C46.1762 8.28967 46.2395 8.56109 46.2675 8.86212H42.545C42.5696 8.56027 42.6395 8.28227 42.7563 8.02648C42.9044 7.70407 43.1215 7.44745 43.4077 7.25582V7.25664Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M50.2574 13.2468C50.8299 13.598 51.515 13.774 52.3112 13.774C52.979 13.774 53.5613 13.6506 54.0573 13.4047C54.5532 13.1588 54.9472 12.8183 55.2384 12.3832C55.5295 11.9481 55.6965 11.4464 55.7393 10.878H53.9356C53.8541 11.3082 53.6699 11.6454 53.3812 11.8889C53.0925 12.1323 52.7405 12.2549 52.326 12.2549C51.9345 12.2549 51.5931 12.1488 51.3028 11.9357C51.0116 11.7235 50.7871 11.4192 50.63 11.0252C50.4721 10.6313 50.394 10.1616 50.394 9.61634C50.394 9.07103 50.4754 8.61291 50.6374 8.22552C50.7994 7.83813 51.0248 7.54122 51.3135 7.33313C51.6022 7.12504 51.9394 7.02141 52.326 7.02141C52.6311 7.02141 52.8951 7.08145 53.1172 7.20071C53.3393 7.31997 53.5194 7.48282 53.6576 7.68844C53.7957 7.89406 53.8887 8.126 53.9364 8.38426H55.7401C55.6973 7.80606 55.5262 7.30023 55.2285 6.86761C54.9299 6.43498 54.531 6.09941 54.0293 5.86007C53.5284 5.62072 52.951 5.50146 52.2972 5.50146C51.5191 5.50146 50.8439 5.67748 50.2714 6.02867C49.699 6.37987 49.2573 6.86678 48.9472 7.48776C48.6371 8.10955 48.4817 8.8284 48.4817 9.64595C48.4817 10.4635 48.6347 11.1684 48.9398 11.7893C49.2449 12.4111 49.6842 12.8972 50.2566 13.2484L50.2574 13.2468Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M62.8373 12.6875C63.1449 12.3412 63.3563 11.9357 63.4706 11.4727L61.7097 11.2646C61.6242 11.4941 61.5008 11.6865 61.3412 11.842C61.1817 11.9974 60.9908 12.1134 60.7688 12.1899C60.5467 12.2664 60.3024 12.3042 60.0351 12.3042C59.6247 12.3042 59.2653 12.2137 58.9577 12.032C58.6501 11.8502 58.4115 11.5862 58.2421 11.2399C58.09 10.9282 58.0061 10.5581 57.9913 10.132H63.5562V9.54396C63.5562 8.84156 63.4583 8.23539 63.2625 7.72627C63.0668 7.21716 62.7987 6.79769 62.4573 6.46788C62.116 6.13806 61.7245 5.89461 61.2836 5.73669C60.842 5.57878 60.3756 5.49982 59.8846 5.49982C59.1213 5.49982 58.4576 5.67418 57.895 6.02291C57.3316 6.37165 56.8957 6.85773 56.5856 7.482C56.2756 8.10544 56.1201 8.83087 56.1201 9.65828C56.1201 10.4857 56.2764 11.221 56.5889 11.8379C56.9015 12.4547 57.3489 12.9309 57.9312 13.2682C58.5135 13.6054 59.2052 13.774 60.0072 13.774C60.6273 13.774 61.1775 13.6794 61.6571 13.491C62.1366 13.3027 62.5305 13.0346 62.8381 12.6883L62.8373 12.6875ZM58.8614 7.25664C59.1477 7.06582 59.4939 6.96959 59.8994 6.96959C60.3049 6.96959 60.6438 7.065 60.916 7.25664C61.1882 7.44827 61.393 7.71229 61.5312 8.04869C61.6299 8.28967 61.6932 8.56109 61.7212 8.86212H57.9987C58.0233 8.56027 58.0932 8.28227 58.21 8.02648C58.3581 7.70407 58.5752 7.44745 58.8614 7.25581V7.25664Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M66.1617 8.9271C66.1617 8.5356 66.2341 8.20414 66.3797 7.93436C66.5253 7.66459 66.7259 7.45732 66.9809 7.31421C67.2359 7.1711 67.5287 7.09872 67.8577 7.09872C68.3446 7.09872 68.7262 7.25088 69.0026 7.55438C69.2789 7.85787 69.4179 8.27734 69.4179 8.81277V13.6161H71.3006V8.51915C71.3006 7.87843 71.1871 7.33231 70.9609 6.88076C70.7339 6.42922 70.4156 6.08625 70.0052 5.85184C69.5947 5.61743 69.1128 5.50064 68.5592 5.50064C67.958 5.50064 67.4629 5.63306 67.0738 5.89872C66.6848 6.16356 66.4002 6.52134 66.2185 6.97041H66.1255V5.60098H64.2791V13.6161H66.1617V8.9271Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M76.5471 12.0706C76.2748 12.2549 75.9146 12.347 75.4663 12.347C75.0181 12.347 74.685 12.2549 74.4111 12.0706C74.1364 11.8864 73.9587 11.615 73.8781 11.2572L72.0391 11.4291C72.1583 12.1652 72.5153 12.7401 73.1091 13.153C73.7029 13.5667 74.4892 13.7732 75.4672 13.7732C76.135 13.7732 76.7256 13.6654 77.2388 13.4507C77.752 13.2361 78.1534 12.9342 78.4445 12.5477C78.7357 12.1603 78.8813 11.7161 78.8813 11.2144C78.8813 10.6453 78.6954 10.1822 78.3228 9.8236C77.9511 9.465 77.3901 9.20674 76.6408 9.04965L75.2739 8.7626C74.8684 8.67213 74.5781 8.55122 74.4045 8.40071C74.2302 8.2502 74.143 8.05773 74.143 7.82333C74.143 7.55602 74.2754 7.3356 74.5402 7.1637C74.8051 6.9918 75.1332 6.90544 75.5247 6.90544C75.959 6.90544 76.2954 7.00743 76.5339 7.21058C76.7724 7.41373 76.9279 7.64649 76.9994 7.90969L78.7102 7.73039C78.5811 7.05184 78.2488 6.51065 77.7117 6.10681C77.1746 5.70297 76.4369 5.50064 75.4968 5.50064C74.8577 5.50064 74.2943 5.60098 73.8074 5.80167C73.3205 6.00235 72.9413 6.28447 72.6691 6.648C72.3968 7.01154 72.2611 7.4417 72.2611 7.93847C72.2611 8.52161 72.4445 9.00112 72.8122 9.37617C73.1798 9.75122 73.7474 10.0226 74.5156 10.1896L75.8825 10.4767C76.5981 10.6395 76.9559 10.9455 76.9559 11.3945C76.9559 11.6618 76.8201 11.888 76.5479 12.0723L76.5471 12.0706Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M81.4789 5.60098H79.5962V13.6161H81.4789V5.60098Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M80.5411 4.47499C80.8372 4.47499 81.0922 4.37465 81.3068 4.17397C81.5215 3.97328 81.6292 3.72983 81.6292 3.44278C81.6292 3.15573 81.5223 2.91968 81.3068 2.719C81.0922 2.51831 80.8372 2.41797 80.5411 2.41797C80.245 2.41797 79.9826 2.51831 79.768 2.719C79.5533 2.91968 79.4456 3.16314 79.4456 3.45018C79.4456 3.73723 79.5533 3.97328 79.768 4.17397C79.9826 4.37465 80.2401 4.47499 80.5411 4.47499Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M84.0268 13.2575C84.5992 13.6013 85.2769 13.774 86.0591 13.774C86.8413 13.774 87.519 13.6021 88.0915 13.2575C88.6639 12.9128 89.1081 12.4309 89.4231 11.8091C89.7381 11.1881 89.8952 10.466 89.8952 9.6443C89.8952 8.82264 89.7381 8.09228 89.4231 7.46801C89.1081 6.84457 88.6647 6.36013 88.0915 6.01633C87.519 5.67254 86.8413 5.49982 86.0591 5.49982C85.2769 5.49982 84.5992 5.67172 84.0268 6.01633C83.4543 6.36013 83.0118 6.84457 82.6993 7.46801C82.3867 8.09145 82.2305 8.81688 82.2305 9.6443C82.2305 10.4717 82.3867 11.1881 82.6993 11.8091C83.0118 12.43 83.4543 12.9128 84.0268 13.2575ZM84.3525 8.31106C84.4931 7.91462 84.707 7.60043 84.9932 7.36849C85.2794 7.13655 85.6347 7.02058 86.0599 7.02058C86.4852 7.02058 86.852 7.13655 87.1333 7.36849C87.4146 7.60043 87.626 7.91462 87.7666 8.31106C87.9072 8.70749 87.978 9.15246 87.978 9.6443C87.978 10.1361 87.9072 10.5671 87.7666 10.9636C87.626 11.36 87.4146 11.6742 87.1333 11.9061C86.852 12.1381 86.4934 12.254 86.0599 12.254C85.6265 12.254 85.2794 12.1381 84.9932 11.9061C84.707 11.6742 84.4931 11.36 84.3525 10.9636C84.2118 10.5671 84.1411 10.1271 84.1411 9.6443C84.1411 9.1615 84.2118 8.70749 84.3525 8.31106Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M96.3665 5.85184C95.9561 5.61743 95.4741 5.50064 94.9206 5.50064C94.3193 5.50064 93.8242 5.63306 93.4352 5.89872C93.0461 6.16356 92.7616 6.52134 92.5798 6.97041H92.4869V5.60098H90.6404V13.6161H92.523V8.9271C92.523 8.5356 92.5954 8.20414 92.741 7.93436C92.8866 7.66459 93.0873 7.45732 93.3422 7.31421C93.5972 7.1711 93.89 7.09872 94.219 7.09872C94.7059 7.09872 95.0875 7.25088 95.3639 7.55438C95.6402 7.85787 95.7792 8.27734 95.7792 8.81277V13.6161H97.6619V8.51915C97.6619 7.87843 97.5484 7.33231 97.3222 6.88076C97.0952 6.42922 96.7769 6.08625 96.3665 5.85184Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M99.7018 4.47499C99.9978 4.47499 100.253 4.37465 100.467 4.17397C100.682 3.97328 100.79 3.72983 100.79 3.44278C100.79 3.15573 100.683 2.91968 100.467 2.719C100.253 2.51831 99.9978 2.41797 99.7018 2.41797C99.4057 2.41797 99.1433 2.51831 98.9286 2.719C98.7139 2.91968 98.6062 3.16314 98.6062 3.45018C98.6062 3.73723 98.7139 3.97328 98.9286 4.17397C99.1433 4.37465 99.4007 4.47499 99.7018 4.47499Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M100.64 5.60098H98.7573V13.6161H100.64V5.60098Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M39.5931 15.8845L36.823 24.2869H36.7086L33.9385 15.8845H31.8132L35.5777 26.566H37.9539L41.7118 15.8845H39.5931Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M47.3336 19.4187C46.9922 19.0888 46.6007 18.8454 46.1599 18.6875C45.7182 18.5296 45.2519 18.4506 44.7608 18.4506C43.9976 18.4506 43.3338 18.625 42.7713 18.9737C42.2079 19.3224 41.7719 19.8093 41.4619 20.4328C41.1518 21.0562 40.9963 21.7816 40.9963 22.6082C40.9963 23.4348 41.1526 24.1709 41.4652 24.7878C41.7777 25.4047 42.2251 25.8809 42.8074 26.2181C43.3898 26.5553 44.0815 26.7239 44.8834 26.7239C45.5035 26.7239 46.0538 26.6293 46.5333 26.441C47.0128 26.2526 47.4068 25.9845 47.7144 25.6383C48.022 25.292 48.2334 24.8865 48.3477 24.4235L46.5867 24.2154C46.5012 24.4448 46.3778 24.6373 46.2183 24.7927C46.0587 24.9482 45.8679 25.0642 45.6458 25.1407C45.4238 25.2171 45.1795 25.255 44.9122 25.255C44.5018 25.255 44.1432 25.1645 43.8347 24.9827C43.5271 24.801 43.2886 24.537 43.1192 24.1907C42.967 23.879 42.8831 23.5088 42.8683 23.0828H48.4332V22.4947C48.4332 21.7923 48.3353 21.1862 48.1396 20.677C47.9438 20.1679 47.6757 19.7485 47.3344 19.4187H47.3336ZM43.7368 20.2074C44.0231 20.0166 44.3693 19.9204 44.7748 19.9204C45.1803 19.9204 45.5192 20.0158 45.7914 20.2074C46.0636 20.399 46.2684 20.6631 46.4066 20.9995C46.5053 21.2404 46.5686 21.5119 46.5966 21.8129H42.8741C42.8987 21.511 42.9686 21.233 43.0854 20.9773C43.2335 20.6548 43.4506 20.3982 43.7368 20.2066V20.2074Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M53.0422 18.4432C52.5841 18.4432 52.1762 18.569 51.8184 18.8199C51.4606 19.0707 51.2097 19.4302 51.0666 19.899H50.9811V18.5509H49.156V26.566H51.0387V21.8631C51.0387 21.5193 51.116 21.2174 51.2714 20.96C51.4261 20.7017 51.6399 20.4986 51.9121 20.3505C52.1844 20.2025 52.4945 20.1284 52.8424 20.1284C53.0003 20.1284 53.1648 20.1383 53.3359 20.1572C53.5078 20.1761 53.6336 20.2 53.715 20.2288V18.4942C53.6295 18.4802 53.5201 18.4679 53.3893 18.458C53.2577 18.4481 53.1426 18.444 53.0422 18.444V18.4432Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M55.0745 15.3679C54.7735 15.3679 54.5161 15.4683 54.3014 15.6689C54.0867 15.8696 53.979 16.1131 53.979 16.4001C53.979 16.6872 54.0867 16.9232 54.3014 17.1239C54.5161 17.3246 54.7735 17.4249 55.0745 17.4249C55.3756 17.4249 55.6256 17.3246 55.8403 17.1239C56.0549 16.9232 56.1627 16.6798 56.1627 16.3927C56.1627 16.1057 56.0558 15.8696 55.8403 15.6689C55.6256 15.4683 55.3706 15.3679 55.0745 15.3679Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M56.013 18.5509H54.1304V26.566H56.013V18.5509Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M60.1279 15.3828C59.6697 15.3828 59.2511 15.4716 58.8719 15.6484C58.4928 15.8252 58.1909 16.0926 57.9664 16.4512C57.7418 16.8098 57.63 17.2588 57.63 17.7992V18.5518H56.4563V20.0141H57.63V26.5669H59.5052V20.0141H61.1732V18.5518H59.5052V17.9349C59.5052 17.6199 59.5801 17.3756 59.7306 17.2037C59.8811 17.0318 60.1303 16.9455 60.4782 16.9455C60.6312 16.9455 60.7669 16.9586 60.8862 16.9849C61.0054 17.0113 61.1033 17.0384 61.1798 17.0672L61.5664 15.6048C61.4471 15.5621 61.2596 15.5143 61.0046 15.4617C60.7497 15.4091 60.4568 15.3828 60.1279 15.3828Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M62.7623 15.3679C62.4613 15.3679 62.2038 15.4683 61.9892 15.6689C61.7745 15.8696 61.6667 16.1131 61.6667 16.4001C61.6667 16.6872 61.7745 16.9232 61.9892 17.1239C62.2038 17.3246 62.4613 17.4249 62.7623 17.4249C63.0633 17.4249 63.3133 17.3246 63.528 17.1239C63.7427 16.9232 63.8504 16.6798 63.8504 16.3927C63.8504 16.1057 63.7435 15.8696 63.528 15.6689C63.3133 15.4683 63.0584 15.3679 62.7623 15.3679Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M63.7 18.5509H61.8174V26.566H63.7V18.5509Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M67.2827 20.2823C67.5714 20.0742 67.9086 19.9705 68.2952 19.9705C68.6003 19.9705 68.8644 20.0306 69.0864 20.1498C69.3085 20.2691 69.4886 20.4319 69.6268 20.6376C69.765 20.8432 69.8579 21.0751 69.9056 21.3334H71.7093C71.6666 20.7552 71.4955 20.2494 71.1977 19.8167C70.8992 19.3841 70.5003 19.0485 69.9986 18.8092C69.4977 18.5707 68.9203 18.4506 68.2664 18.4506C67.4884 18.4506 66.8131 18.6258 66.2406 18.9778C65.6682 19.329 65.2265 19.8151 64.9164 20.4369C64.6064 21.0579 64.4509 21.7775 64.4509 22.5951C64.4509 23.4126 64.6039 24.1175 64.9091 24.7385C65.2142 25.3594 65.6534 25.8463 66.2258 26.1975C66.7983 26.5487 67.4834 26.7248 68.2796 26.7248C68.9474 26.7248 69.5297 26.6014 70.0257 26.3555C70.5217 26.1095 70.9156 25.769 71.2068 25.3339C71.4979 24.8988 71.6649 24.3971 71.7077 23.828H69.904C69.8226 24.2581 69.6383 24.5953 69.3496 24.8388C69.0609 25.0823 68.7089 25.2048 68.2944 25.2048C67.9029 25.2048 67.5615 25.0987 67.2712 24.8857C66.9801 24.6735 66.7555 24.3692 66.5984 23.9752C66.4405 23.5812 66.3624 23.1116 66.3624 22.5663C66.3624 22.021 66.4438 21.5629 66.6058 21.1755C66.7679 20.7881 66.9932 20.4912 67.2819 20.2831L67.2827 20.2823Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M77.9002 19.0313C77.5802 18.8207 77.2298 18.6718 76.8482 18.583C76.4666 18.4942 76.0849 18.4506 75.7033 18.4506C75.1448 18.4506 74.6357 18.5328 74.1751 18.6982C73.7145 18.8635 73.3247 19.1094 73.0047 19.4367C72.6848 19.7641 72.4562 20.1712 72.318 20.659L74.0715 20.9098C74.1669 20.6376 74.3495 20.4007 74.6193 20.2C74.889 19.9993 75.2551 19.899 75.7181 19.899C76.1573 19.899 76.4912 20.0067 76.7199 20.2214C76.9494 20.4369 77.0637 20.7379 77.0637 21.1245V21.1607C77.0637 21.3424 76.9979 21.4765 76.8671 21.562C76.7355 21.6484 76.525 21.7101 76.2338 21.7487C75.9426 21.7874 75.561 21.8326 75.0889 21.8853C74.7023 21.9239 74.3281 21.9889 73.9654 22.0827C73.6027 22.1756 73.277 22.3113 72.9883 22.4873C72.6996 22.6642 72.4718 22.901 72.3048 23.1971C72.1378 23.4932 72.054 23.8666 72.054 24.3157C72.054 24.8413 72.1707 25.2838 72.4043 25.6424C72.6379 26.001 72.9579 26.2724 73.3633 26.4558C73.7688 26.64 74.227 26.7322 74.7377 26.7322C75.1572 26.7322 75.5215 26.6721 75.8291 26.5529C76.1368 26.4336 76.395 26.2765 76.6023 26.0832C76.8095 25.8899 76.9707 25.6827 77.0851 25.4631H77.1426V26.5668H78.9538V21.2043C78.9538 20.6738 78.8583 20.2313 78.6675 19.8776C78.4767 19.5239 78.2217 19.2418 77.9018 19.0313H77.9002ZM77.0768 23.6914C77.0768 23.9875 77.0004 24.2614 76.8474 24.5123C76.6944 24.7631 76.4797 24.9638 76.2034 25.1143C75.9262 25.2648 75.5972 25.3405 75.2156 25.3405C74.8339 25.3405 74.5025 25.2517 74.2492 25.0749C73.9958 24.898 73.87 24.6348 73.87 24.2861C73.87 24.0426 73.9341 23.8444 74.0633 23.6906C74.1924 23.5376 74.3676 23.4167 74.5897 23.3287C74.8117 23.2399 75.0634 23.1774 75.3447 23.1387C75.4689 23.1248 75.6153 23.105 75.7847 23.0812C75.9542 23.0573 76.1269 23.0285 76.3037 22.9948C76.4805 22.9611 76.6376 22.9241 76.7758 22.8838C76.914 22.8435 77.0143 22.799 77.0768 22.7513V23.6906V23.6914Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M83.5983 25.0609C83.498 25.0749 83.4075 25.0823 83.3261 25.0823C83.0251 25.0823 82.8063 25.0066 82.6673 24.8561C82.5291 24.7056 82.46 24.4728 82.46 24.157V20.0133H84.0417V18.5509H82.46V16.6436H80.5774V18.5509H79.4539V20.0133H80.5774V24.4654C80.5774 25.1489 80.7896 25.6876 81.2148 26.0824C81.6392 26.4764 82.224 26.6738 82.9683 26.6738C83.1731 26.6738 83.3787 26.6581 83.5835 26.6269C83.7883 26.5956 83.9915 26.5496 84.1922 26.4871L83.8698 25.0099C83.7883 25.0288 83.6979 25.0461 83.5975 25.0601L83.5983 25.0609Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>\\n<path d=\\"M90.702 19.4187C90.3606 19.0888 89.9691 18.8454 89.5283 18.6875C89.0866 18.5296 88.6203 18.4506 88.1292 18.4506C87.366 18.4506 86.7022 18.625 86.1397 18.9737C85.5763 19.3224 85.1403 19.8093 84.8303 20.4328C84.5202 21.0562 84.3647 21.7816 84.3647 22.6082C84.3647 23.4348 84.521 24.1709 84.8336 24.7878C85.1461 25.4047 85.5935 25.8809 86.1758 26.2181C86.7582 26.5553 87.4499 26.7239 88.2518 26.7239C88.8719 26.7239 89.4222 26.6293 89.9017 26.441C90.3812 26.2526 90.7752 25.9845 91.0828 25.6383C91.3904 25.292 91.6018 24.8865 91.7161 24.4235L89.9552 24.2154C89.8696 24.4448 89.7462 24.6373 89.5867 24.7927C89.4271 24.9482 89.2363 25.0642 89.0142 25.1407C88.7922 25.2171 88.5479 25.255 88.2806 25.255C87.8702 25.255 87.5107 25.1645 87.2031 24.9827C86.8955 24.801 86.657 24.537 86.4876 24.1907C86.3354 23.879 86.2515 23.5088 86.2367 23.0828H91.8016V22.4947C91.8016 21.7923 91.7037 21.1862 91.508 20.677C91.3122 20.1679 91.0441 19.7485 90.7028 19.4187H90.702ZM87.1053 20.2074C87.3915 20.0166 87.7377 19.9204 88.1432 19.9204C88.5487 19.9204 88.8876 20.0158 89.1598 20.2074C89.4321 20.399 89.6368 20.6631 89.775 20.9995C89.8737 21.2404 89.9371 21.5119 89.965 21.8129H86.2425C86.2671 21.511 86.3371 21.233 86.4538 20.9773C86.6019 20.6548 86.819 20.3982 87.1053 20.2066V20.2074Z\\" class=\\"logo02\\" fill=\\"#0073FF\\"/>"}}'),
                e = await async function(M, t) {
                    const e = t ? `${M}/698e2820-e88a-f844-1921-29068640a32d/${t}/stats.json` : `${M}/698e2820-e88a-f844-1921-29068640a32d/stats.json`,
                        i = await fetch(e);
                    if (!i.ok) return null;
                    const n = await i.json();
                    return {
                        note: n.ratingMean,
                        reviewCount: n.currentCount,
                        historyReviewsCount: n.historyReviewsCount,
                        isBlocked: n.isBlocked
                    }
                }("https://cl-pbr.cxr.skeepers.io", M),
                i = e && (e.historyReviewsCount ? ? e.reviewCount);
            let n = null;
            if (!e.isBlocked) {
                const t = await async function(M) {
                    const t = `698e2820-e88a-f844-1921-29068640a32d${M??""}`;
                    try {
                        if (!D[t]) {
                            let e = "https://cl-pbr.cxr.skeepers.io/698e2820-e88a-f844-1921-29068640a32d";
                            M && (e += `/${M}`);
                            const i = await fetch(`${e}/links.json`);
                            if (403 === i.status) return console.warn(`403 Forbidden: ${e}/links.json`), null;
                            D[t] = await i.json()
                        }
                        return D[t]
                    } catch (M) {
                        return console.warn(M), null
                    }
                }(M);
                n = t ? .certifiedLink ? ? null
            }
            if (!i || i < 1 || t.brandWidget.disabled) return N(t);
            I(t, e, n)
        }! function(M) {
            M[M.Rectangular = 0] = "Rectangular", M[M.Circular = 1] = "Circular"
        }(j || (j = {}));
        const u = document.currentScript ? .dataset ? .shopId;
        "loading" !== document.readyState ? o(u).then() : document.addEventListener("DOMContentLoaded", (() => {
            o(u).then()
        }))
    })(), SkeepersBrandWidget = i
})();
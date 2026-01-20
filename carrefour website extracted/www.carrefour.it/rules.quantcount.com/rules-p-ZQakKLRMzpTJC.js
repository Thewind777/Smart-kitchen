/*
 Quantcast measurement tag
 Copyright (c) 2008-2022, Quantcast Corp.
*/
'use strict';
(function(b, m, h) {
    var n = function(d) {
            var e = h.createElement("a");
            e.href = d;
            return e
        },
        p = [/^http[s]?:\/\/((adservice.google.*)|([^\/]*fls\.doubleclick\.net))\/.*~oref=(?<url>[^;\n]*)/, /^http[s]?:\/\/[^\/]*tealium.*\/.*page_url=(?<url>[^&]*)/],
        q = function(d, e, f) {
            return d ? "nc" === d ? !e || !f || 0 > e.indexOf(f) : "eq" === d ? e === f : "sw" === d ? 0 === e.indexOf(f) : "ew" === d ? (d = e.length - f.length, e = e.lastIndexOf(f, d), -1 !== e && e === d) : "c" === d ? 0 <= e.indexOf(f) : !1 : !1
        },
        a = function(d, e, f) {
            if (m.top !== m.self) {
                try {
                    for (var k = 0; k <
                        p.length; k++) {
                        var l = h.location.href.match(p[k]);
                        if (l && l.groups.url) {
                            var g = decodeURIComponent(l.groups.url);
                            break
                        }
                    }
                } catch (r) {}
                g = g ? n(g) : n(h.referrer)
            } else g = h.location;
            g = g.href;
            q(e, g, f) ? d(g) : d(!1)
        },
        c = function(d) {
            return "array" === {}.toString.call(d).match(/\s([a-zA-Z]+)/)[1].toLowerCase() ? {
                labels: d.join(",")
            } : {
                labels: "" + d
            }
        };
    try {
        __qc("defaults", b, {
            labels: "_fp.event.Default"
        })
    } catch (d) {}
    __qc.apply(null, ["rules", [b, null, [
                [c, "_fp.event.CRF Consegna a domicilio"]
            ],
            [
                [a, "c", "/spesa-consegna-domicilio"]
            ]
        ],
        [b,
            null, [
                [c, "_fp.event.CRF Ritiro in negozio"]
            ],
            [
                [a, "c", "/spesa-ritiro-negozio"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.Homepage EShop"]
            ],
            [
                [a, "sw", "https://myshop.carrefour.it"],
                [a, "nc", "spesa-consegna-domicilio"],
                [a, "nc", "spesa-ritiro-negozio"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF prodotti"]
            ],
            [
                [a, "c", "/prodotti"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine carrefour"]
            ],
            [
                [a, "c", "/magazine-carrefour"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF spesamica payback"]
            ],
            [
                [a, "c", "/spesamica-payback"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate italia"]
            ],
            [
                [a, "c", "/corporate/carrefour-italia"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF filiera"]
            ],
            [
                [a, "c", "/filiera"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF KIDS prodotti"]
            ],
            [
                [a, "c", "/KIDS/Carrefour+KIDS"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF TEX home prodotti"]
            ],
            [
                [a, "c", "/tex-home"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine ricette"]
            ],
            [
                [a, "c", "/ricette-carrefour"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine stile benessere"]
            ],
            [
                [a, "c", "/stile-e-benessere"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine bambini"]
            ],
            [
                [a, "c", "/bambini"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate azienda"]
            ],
            [
                [a, "c", "/azienda-hub"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate lavora hub"]
            ],
            [
                [a, "c", "/lavora-hub"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF punti vendita"]
            ],
            [
                [a, "c", "/punti-vendita"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF volantini"]
            ],
            [
                [a, "c", "/volantini"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF distributori"]
            ],
            [
                [a, "c", "/distributori"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF SELECTION prodotti"]
            ],
            [
                [a, "c", "/SEL/Selection+Carrefour"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF TEX prodotti"]
            ],
            [
                [a, "nc", "-home"],
                [a, "c", "/tex"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine cura della casa"]
            ],
            [
                [a, "c", "/cura-della-casa"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine animali"]
            ],
            [
                [a, "c", "/animali"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate csr hub"]
            ],
            [
                [a, "c", "/csr-hub"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF MDD prodotti"]
            ],
            [
                [a, "c", "/all/MDD/Prodotti+Carrefour"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF BIO prodotti"]
            ],
            [
                [a, "c", "/all/BIO/Carrefour+BIO"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF NOGLUTEN prodotti"]
            ],
            [
                [a, "c", "/NOGLUTEN/No+Gluten"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF BABY prodotti"]
            ],
            [
                [a, "c", "/BABY/Carrefour+Baby"]
            ]
        ],
        [b, null, [
                [c,
                    "_fp.event.CRF magazine guida alla spesa"
                ]
            ],
            [
                [a, "c", "/guida-alla-spesa"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF magazine tech tempo libero"]
            ],
            [
                [a, "c", "/tech-tempo-libero"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate franchise hub"]
            ],
            [
                [a, "c", "/franchising-hub"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate le nostre persone"]
            ],
            [
                [a, "c", "/le-nostre-persone"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF corporate ufficio stampa"]
            ],
            [
                [a, "c", "/ufficio-stampa-hub"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Eventi Section"]
            ],
            [
                [a, "c", "/Azienda/Eventi"]
            ]
        ],
        [b,
            null, [
                [c, "_fp.event.CRF Ortofrutta Section"]
            ],
            [
                [a, "c", "/Ortofrutta"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Mondo animali Section"]
            ],
            [
                [a, "c", "/Mondo-animali"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Gelati e surgelati Section"]
            ],
            [
                [a, "c", "/Gelati-e-surgelati"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Mondo baby Section"]
            ],
            [
                [a, "c", "/Mondo-baby"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Volantini Section"]
            ],
            [
                [a, "c", "/Volantini"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Dispensa dolce e salata Section"]
            ],
            [
                [a, "c", "/Dispensa-dolce-e-salata"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Igiene, bellezza e intimo Section"]
            ],
            [
                [a, "c", "/Igiene-bellezza-e-intimo"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Detersivi e pulizia della casa"]
            ],
            [
                [a, "c", "/Detersivi-e-pulizia-della-casa"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Uova, latte e derivati Section"]
            ],
            [
                [a, "c", "/Uova-latte-e-derivati"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Prodotti freschi Section"]
            ],
            [
                [a, "c", "/Prodotti-freschi"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Acqua, bevande e alcolici Section"]
            ],
            [
                [a, "c", "/Acqua-bevande-e-alcolici"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Carta, plastica e conservazione Section"]
            ],
            [
                [a, "c", "Carta-plastica-e-conservazione"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.Punti Vendita"]
            ],
            [
                [a, "c", "/Punti-Vendita"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.Homepage"]
            ],
            [
                [a, "eq", "https://volantino.carrefour.it/"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Spesa Online"]
            ],
            [
                [a, "c", "/spesa-online/"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Elettronica e Casa"]
            ],
            [
                [a, "c", "/elettronica-casa-e-giocattoli"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Campagne Food - Offerte Speciali"]
            ],
            [
                [a, "c", "/campagne-food/offerte-speciali/"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Campagne Food"]
            ],
            [
                [a, "c", "/campagne-food/"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.CRF Checkout - Step 1"]
            ],
            [
                [a, "c", "/checkout/step1"]
            ]
        ],
        [b, null, [
                [c, "_fp.event.consegna_gratuita"]
            ],
            [
                [a, "c", "utm_source\x3dQuantcast"],
                [a, "c", "/consegna-gratuita/"]
            ]
        ]
    ])
})("p-ZQakKLRMzpTJC", window, document);
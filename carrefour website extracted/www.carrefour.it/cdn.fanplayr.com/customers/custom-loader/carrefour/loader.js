// Carrefour Custom Loader v1.0.12
(function(win, doc) {
    var js = doc.createElement('script');
    var fjs = doc.getElementsByTagName('script')[0];
    js.defer = true;
    if (win.fp_sales_orders) {
        // js.src = 'https://cdn.fanplayr.com/client/production/fp_custom_orders.js';
        js.src = '//cdn.fanplayr.com/customers/carrefour/adaptor/adaptor.js';
        try {
            if (win.fp_sales_orders.data && win.fp_sales_orders.data.products && Array.isArray(win.fp_sales_orders.data.products)) {
                var carrefourClub = win.fp_sales_orders.data.products.find(function(prod) {
                    return prod.id === '8001625695086';
                });
                if (carrefourClub) {
                    var intervalClub = window.setInterval(function() {
                        if (window.fanplayr) {
                            window.fanplayr.platform.state.page.data.carrefourClub = 1;
                            window.fanplayr.platform.trackPage();
                            window.clearInterval(intervalClub);
                        }
                    }, 2000);
                }
            }
        } catch (error) {
            win.console.log(error);
        }
        fjs.parentNode.insertBefore(js, fjs);
    } else {
        var fp = window.fanplayr;
        window.fpData = fp._i[0].data;
        delete fp._i;
        js.src = '//cdn.fanplayr.com/customers/carrefour/adaptor/adaptor.js';
        // win.setTimeout(function () {
        // }, 3000)
        fjs.parentNode.insertBefore(js, fjs);
        var popupInterval = window.setInterval(function() {
            if (fp.$ && fp.$("#zc-plugincontainer").length) {
                window.clearInterval(popupInterval);
                fp.platform.state.page.data.sitePopup = 1;
                fp.platform.trackPage();
            }
        }, 500);
    }
}(window, document));

// (function (w, d, s) {
//     w.fanplayr = undefined;
//     w.fp_sales_orders = undefined;
//     var js = d.createElement(s); js.async = true;
//     js.src = '//cdn.fanplayr.com/customers/carrefour/adaptor/adaptor.js';
//     var fjs = d.getElementsByTagName(s)[0];
//     fjs.parentNode.insertBefore(js, fjs);
// }(window, document, 'script'));
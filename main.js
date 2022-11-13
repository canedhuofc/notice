mw.loader.using( ['jquery.cookie', 'mediawiki.util'] ).done( function () {

(function ($, mw) {

    if (typeof(window.customASNInterval) == 'undefined') {
        window.customASNInterval = 10;
    }
    $(function () {
        $('#mw-dismissable-notice').css('display', 'none');
        if (window.closeASNForever || mw.config.get('wgAction') == 'edit' || mw.config.get('wgAction') == 'submit') {
            return;
        }

        var ln = $('#siteNotice');
        if (!ln.length) {
            return;
        }
        var cname = 'dismissASN1';
        var cval = $.cookie(cname);
        if (cval == '') {
            cval = 0;
        }
        var rev = 0;
        var toid = null;

        var tb = $('<table id="asn-dismissable-notice" width="100%"/>');
        var ct = $('<div id="advancedSiteNotices"/>');
        var sd = $('<a href="#" title="Fechar"><img src="//upload.wikimedia.org/wikipedia/commons/8/8a/Dismiss_button_-_white.png" alt="Fechar" width="15" height="15"></a>');
        tb.append($('<tr/>').append($('<td/>').append(ct)).append($('<td/>').append(sd)));
        var nts = null;

        sd.click(function () {
            $.cookie(cname, rev, {
                expires: 30,
                path: '/'
            });
            clearTimeout(toid);
            tb.remove();
            return false;
        });

        var loadNotices = function (pos) {
            if (!tb.length) {
                return;
            }
            var l = nts.length;
            var nt = null;
            var rt = 0;
            while (!nt || nt.attr('class')) {
                pos = pos % l;
                nt = $(nts[pos++]);
                rt++;
                if (rt == l) {
                    return;
                }
            }
            nt = nt.html();
            if (ct.html()) {
                ct.stop().fadeOut(function () {
                    ct.html(nt).fadeIn();
                });
            } else if (rev == cval) {
                return;
            } else {
                tb.appendTo(ln);
                ct.html(nt).fadeIn();
            }
            toid = setTimeout(function () {
                loadNotices(pos);
            }, window.customASNInterval * 1000);
        };

        $.get(mw.util.wikiScript( 'api' ), {
            page: 'Template:AdvancedSiteNotices/ajax',
            prop: 'text',
            action: 'parse',
            format: 'json',
            maxage: 3600,
            smaxage: 3600
        }, function (d) {
        	if(!d || !d.parse || !d.parse.text) return;
            d = $( '<div />' ).html( d.parse.text['*'] ).find( 'ul.sitents' );
            nts = $('li', d);
            rev = d.data( 'asn-version' );
            var l = nts.length;
            loadNotices(Math.floor(Math.random() * l));
        });
    });
})(jQuery, mediaWiki);
} );

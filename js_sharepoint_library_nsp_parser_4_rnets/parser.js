






$('#MSOZoneCell_WebPartWPQ1').hide();
var nspTable = $('<table/>').attr({
    'id': 'nspTable'
}).css({
    'border-spacing': '0px 10px'
});
nspTable.appendTo($('#nspGrid'));
var url = '/_vti_bin/listdata.svc/Newspapers?' + Math.random();

$.ajax({
    url: url,
    async: 'true',
    success: function(data) {
        var entriesArray = $(data).find('entry');
        entriesArray.sort((function(b, a) {
            return new Date($(a).find('NspDate').html()) - new Date($(b).find('NspDate').html());
        }));

        for (var i = 0; i < entriesArray.length; i++) {
            var entry = $(entriesArray[i]);
            if (i % 4 === 0) {
                var newTr = $('<tr/>').addClass('nspTr' + (Math.floor(i / 4)));
                newTr.appendTo($('#nspTable'));
            }
            var newTd = $('<td/>').addClass('nspTd' + (i)).css({
                'border-bottom': '1.5px solid seagreen',
                'border-top': '1.5px solid seagreen',
                'padding': '10px',
                'width': '280px',
                'height': '385px',
                'position':'relative'
            }).attr({
                'align': 'center'
            });
            newTd.appendTo($('.nspTr' + (Math.floor(i / 4))));
            try {
                var nspLink = entry.find('[type*="pdf"]').attr('src');
                var nspNumber = '';
                $(entry).find('[m\\:type*="Double"]').each(
                        function(){
                            if(~this.tagName.indexOf('NspNumber'))
                                nspNumber=$(this)[0].textContent;
                        }
                );
                var nspDate = new Date('05.05.1990');  //new Date(entry.find('NspDate').html());
                $(entry).find('[m\\:type*="Date"]').each(
                        function(){
                            if(~this.tagName.indexOf('Date'))
                                nspDate=new Date($(this)[0].textContent);
                        }
                );
                var nspPreview = '';//entry.find('NspPreview').html();
                $(entry[0].lastElementChild).children().each(function(){
                    if (~this.tagName.indexOf('NspPreview'))
                        nspPreview = ($(this).text().split(',').length>0)?$(this).text().split(',')[0]:$(this).text();
                });
                var mNames = new Array("Январь", "Февраль", "Март",
                    "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь",
                    "Октябрь", "Ноябрь", "Декабрь");
                var numberDate = '№' + nspNumber + ' ' + mNames[nspDate.getUTCMonth()] + ' ' + nspDate.getUTCFullYear() + ' г.';
                var numberDateDiv = $('<div/>').addClass('numberDate').html(numberDate).css({
                    'text-align': 'center',
                    'position':'absolute',
                    'top':'5px',
                    'width':'100%'
                });
                var hr = $('<hr/>').addClass('nspHr').css({
                    'margin': '10px',
                    'position':'absolute',
                    'top':'30px',
                    'width':'90%'
                });
                var nspImage = $('<img/>').addClass('numberImage').attr({
                    'src': nspPreview,
                    'linkpdf': nspLink
                }).css({
                    'width': '250px',
                    'height': '345px',
                    'position':'absolute',
                    'top':'55px',
                    'left':'15px',
                    'cursor':'pointer'
                });
                numberDateDiv.appendTo($('.nspTd' + i));
                hr.appendTo($('.nspTd' + i));
                nspImage.appendTo($('.nspTd' + i));
                nspImage.bind('click', function() {
                    try{
                        var linkpdf = ($(this).attr('linkpdf'));
                        var pdfDiv = $('<div/>').attr({
                            'id': 'pdfDiv'
                        }).css({
                            'height': '100%'
                        });
                        var pdf = new PDFObject({
                            url: linkpdf,
                            pdfOpenParams: {
                                view: 'FitBH'
                            }
                        });
                        if (pdf) {
                            pdfDiv.modal({
                                modal: true,
                                minWidht: '70%',
                                minHeight: '80%'
                            });
                            pdf.embed('pdfDiv');
                            $('.simplemodal-wrap').css({
                                'overflow': 'hidden'
                            });
                            $('#simplemodal-container').css({
                                'left': '15%',
                                'width': '70%',
                                'top': '10%'
                            });
                        }
                    }catch(e){
                        console.log('b '+e);
                        var linkpdf = ($(this).attr('linkpdf'));
                        location.replace(linkpdf);
                    }
                });
            } catch (e) {
                console.log('a '+ e);
            }
        }
    },
    dataType: "xml"
});

var PDFObject = function(obj) {

    if (!obj || !obj.url) {
        return false;
    }

    var pdfobjectversion = "1.2",
        //Set reasonable defaults
        id = obj.id || false,
        width = obj.width || "100%",
        height = obj.height || "100%",
        pdfOpenParams = obj.pdfOpenParams,
        url,
        pluginTypeFound;


    /* ----------------------------------------------------
	   Supporting functions
	   ---------------------------------------------------- */

    //Tests specifically for Adobe Reader (aka Acrobat) in Internet Explorer
    var hasReaderActiveX = function() {

        var axObj = null;

        if (window.ActiveXObject) {

            axObj = new ActiveXObject("AcroPDF.PDF");

            //If "AcroPDF.PDF" didn't work, try "PDF.PdfCtrl"
            if (!axObj) {
                axObj = new ActiveXObject("PDF.PdfCtrl");
            }

            //If either "AcroPDF.PDF" or "PDF.PdfCtrl" are found, return true
            if (axObj !== null) {
                return true;
            }

        }

        //If you got to this point, there's no ActiveXObject for PDFs
        return false;

    };



    //Tests specifically for Adobe Reader (aka Adobe Acrobat) in non-IE browsers
    var hasReader = function() {

        var i,
            n = navigator.plugins,
            count = n.length,
            regx = /Adobe Reader|Adobe PDF|Acrobat/gi;

        for (i = 0; i < count; i++) {
            if (regx.test(n[i].name)) {
                return true;
            }
        }

        return false;

    };


    //Detects unbranded PDF support
    var hasGeneric = function() {
        var plugin = navigator.mimeTypes["application/pdf"];
        return (plugin && plugin.enabledPlugin);
    };


    //Determines what kind of PDF support is available: Adobe or generic
    var pluginFound = function() {

        var type = null;

        if (hasReader() || hasReaderActiveX()) {

            type = "Adobe";

        } else if (hasGeneric()) {

            type = "generic";

        }

        return type;

    };


    //If setting PDF to fill page, need to handle some CSS first
    var setCssForFullWindowPdf = function() {

        var html = document.getElementsByTagName("html");
        if (!html) {
            return false;
        }

        var html_style = html[0].style,
            body_style = document.body.style;

        html_style.height = "100%";
        html_style.overflow = "hidden";
        body_style.margin = "0";
        body_style.padding = "0";
        body_style.height = "100%";
        body_style.overflow = "hidden";

    };


    //Creating a querystring for using PDF Open parameters when embedding PDF
    var buildQueryString = function(pdfParams) {

        var string = "",
            prop;

        if (!pdfParams) {
            return string;
        }

        for (prop in pdfParams) {

            if (pdfParams.hasOwnProperty(prop)) {

                string += prop + "=";

                if (prop === "search") {

                    string += encodeURI(pdfParams[prop]);

                } else {

                    string += pdfParams[prop];

                }

                string += "&";

            }

        }

        //Remove last ampersand
        return string.slice(0, string.length - 1);

    };


    //Simple function for returning values from PDFObject
    var get = function(prop) {

        var value = null;

        switch (prop) {
            case "url":
                value = url;
                break;
            case "id":
                value = id;
                break;
            case "width":
                value = width;
                break;
            case "height":
                value = height;
                break;
            case "pdfOpenParams":
                value = pdfOpenParams;
                break;
            case "pluginTypeFound":
                value = pluginTypeFound;
                break;
            case "pdfobjectversion":
                value = pdfobjectversion;
                break;
        }

        return value;

    };


    /* ----------------------------------------------------
	   PDF Embedding functions
	   ---------------------------------------------------- */


    var embed = function(targetID) {

        if (!pluginTypeFound) {
            return false;
        }

        var targetNode = null;

        if (targetID) {

            //Allow users to pass an element OR an element's ID
            targetNode = (targetID.nodeType && targetID.nodeType === 1) ? targetID : document.getElementById(targetID);

            //Ensure target element is found in document before continuing
            if (!targetNode) {
                return false;
            }

        } else {

            targetNode = document.body;
            setCssForFullWindowPdf();
            width = "100%";
            height = "100%";

        }

        targetNode.innerHTML = '<object	data="' + url + '" type="application/pdf" width="' + width + '" height="' + height + '"></object>';

        return targetNode.getElementsByTagName("object")[0];

    };

    //The hash (#) prevents odd behavior in Windows
    //Append optional Adobe params for opening document
    url = encodeURI(obj.url) + "#" + buildQueryString(pdfOpenParams);
    pluginTypeFound = pluginFound();

    this.get = function(prop) {
        return get(prop);
    };
    this.embed = function(id) {
        return embed(id);
    };

    return this;

};
(function(b) {
    "function" === typeof define && define.amd ? define(["jquery"], b) : b(jQuery)
})(function(b) {
    var j = [],
        n = b(document),
        k = navigator.userAgent.toLowerCase(),
        l = b(window),
        g = [],
        o = null,
        p = /msie/.test(k) && !/opera/.test(k),
        q = /opera/.test(k),
        m, r;
    m = p && /msie 6./.test(k) && "object" !== typeof window.XMLHttpRequest;
    r = p && /msie 7.0/.test(k);
    b.modal = function(a, h) {
        return b.modal.impl.init(a, h)
    };
    b.modal.close = function() {
        b.modal.impl.close()
    };
    b.modal.focus = function(a) {
        b.modal.impl.focus(a)
    };
    b.modal.setContainerDimensions =
        function() {
            b.modal.impl.setContainerDimensions()
        };
    b.modal.setPosition = function() {
        b.modal.impl.setPosition()
    };
    b.modal.update = function(a, h) {
        b.modal.impl.update(a, h)
    };
    b.fn.modal = function(a) {
        return b.modal.impl.init(this, a)
    };
    b.modal.defaults = {
        appendTo: "body",
        focus: !0,
        opacity: 50,
        overlayId: "simplemodal-overlay",
        overlayCss: {},
        containerId: "simplemodal-container",
        containerCss: {},
        dataId: "simplemodal-data",
        dataCss: {},
        minHeight: null,
        minWidth: null,
        maxHeight: null,
        maxWidth: null,
        autoResize: !1,
        autoPosition: !0,
        zIndex: 1E3,
        close: !0,
        closeHTML: '<a class="modalCloseImg" title="Close"></a>',
        closeClass: "simplemodal-close",
        escClose: !0,
        overlayClose: !1,
        fixed: !0,
        position: null,
        persist: !1,
        modal: !0,
        onOpen: null,
        onShow: null,
        onClose: null
    };
    b.modal.impl = {
        d: {},
        init: function(a, h) {
            if (this.d.data) return !1;
            o = p && !b.support.boxModel;
            this.o = b.extend({}, b.modal.defaults, h);
            this.zIndex = this.o.zIndex;
            this.occb = !1;
            if ("object" === typeof a) {
                if (a = a instanceof b ? a : b(a), this.d.placeholder = !1, 0 < a.parent().parent().size() && (a.before(b("<span></span>").attr("id",
                        "simplemodal-placeholder").css({
                        display: "none"
                    })), this.d.placeholder = !0, this.display = a.css("display"), !this.o.persist)) this.d.orig = a.clone(!0)
            } else if ("string" === typeof a || "number" === typeof a) a = b("<div></div>").html(a);
            else return alert("SimpleModal Error: Unsupported data type: " + typeof a), this;
            this.create(a);
            this.open();
            b.isFunction(this.o.onShow) && this.o.onShow.apply(this, [this.d]);
            return this
        },
        create: function(a) {
            this.getDimensions();
            if (this.o.modal && m) this.d.iframe = b('<iframe src="javascript:false;"></iframe>').css(b.extend(this.o.iframeCss, {
                display: "none",
                opacity: 0,
                position: "fixed",
                height: g[0],
                width: g[1],
                zIndex: this.o.zIndex,
                top: 0,
                left: 0
            })).appendTo(this.o.appendTo);
            this.d.overlay = b("<div></div>").attr("id", this.o.overlayId).addClass("simplemodal-overlay").css(b.extend(this.o.overlayCss, {
                display: "none",
                opacity: this.o.opacity / 100,
                height: this.o.modal ? j[0] : 0,
                width: this.o.modal ? j[1] : 0,
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: this.o.zIndex + 1
            })).appendTo(this.o.appendTo);
            this.d.container = b("<div></div>").attr("id", this.o.containerId).addClass("simplemodal-container").css(b.extend({
                position: this.o.fixed ?
                    "fixed" : "absolute"
            }, this.o.containerCss, {
                display: "none",
                zIndex: this.o.zIndex + 2
            })).append(this.o.close && this.o.closeHTML ? b(this.o.closeHTML).addClass(this.o.closeClass) : "").appendTo(this.o.appendTo);
            this.d.wrap = b("<div></div>").attr("tabIndex", -1).addClass("simplemodal-wrap").css({
                height: "100%",
                outline: 0,
                width: "100%"
            }).appendTo(this.d.container);
            this.d.data = a.attr("id", a.attr("id") || this.o.dataId).addClass("simplemodal-data").css(b.extend(this.o.dataCss, {
                display: "none"
            })).appendTo("body");
            this.setContainerDimensions();
            this.d.data.appendTo(this.d.wrap);
            (m || o) && this.fixIE()
        },
        bindEvents: function() {
            var a = this;
            b("." + a.o.closeClass).bind("click.simplemodal", function(b) {
                b.preventDefault();
                a.close()
            });
            a.o.modal && a.o.close && a.o.overlayClose && a.d.overlay.bind("click.simplemodal", function(b) {
                b.preventDefault();
                a.close()
            });
            n.bind("keydown.simplemodal", function(b) {
                a.o.modal && 9 === b.keyCode ? a.watchTab(b) : a.o.close && a.o.escClose && 27 === b.keyCode && (b.preventDefault(), a.close())
            });
            l.bind("resize.simplemodal orientationchange.simplemodal",
                function() {
                    a.getDimensions();
                    a.o.autoResize ? a.setContainerDimensions() : a.o.autoPosition && a.setPosition();
                    m || o ? a.fixIE() : a.o.modal && (a.d.iframe && a.d.iframe.css({
                        height: g[0],
                        width: g[1]
                    }), a.d.overlay.css({
                        height: j[0],
                        width: j[1]
                    }))
                })
        },
        unbindEvents: function() {
            b("." + this.o.closeClass).unbind("click.simplemodal");
            n.unbind("keydown.simplemodal");
            l.unbind(".simplemodal");
            this.d.overlay.unbind("click.simplemodal")
        },
        fixIE: function() {
            var a = this.o.position;
            b.each([this.d.iframe || null, !this.o.modal ? null : this.d.overlay,
                "fixed" === this.d.container.css("position") ? this.d.container : null
            ], function(b, e) {
                if (e) {
                    var f = e[0].style;
                    f.position = "absolute";
                    if (2 > b) f.removeExpression("height"), f.removeExpression("width"), f.setExpression("height", 'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"'), f.setExpression("width", 'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"');
                    else {
                        var c, d;
                        a && a.constructor ===
                            Array ? (c = a[0] ? "number" === typeof a[0] ? a[0].toString() : a[0].replace(/px/, "") : e.css("top").replace(/px/, ""), c = -1 === c.indexOf("%") ? c + ' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"' : parseInt(c.replace(/%/, "")) + ' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"', a[1] && (d = "number" === typeof a[1] ?
                                a[1].toString() : a[1].replace(/px/, ""), d = -1 === d.indexOf("%") ? d + ' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"' : parseInt(d.replace(/%/, "")) + ' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"')) : (c = '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',
                                d = '(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"');
                        f.removeExpression("top");
                        f.removeExpression("left");
                        f.setExpression("top", c);
                        f.setExpression("left", d)
                    }
                }
            })
        },
        focus: function(a) {
            var h = this,
                a = a && -1 !== b.inArray(a, ["first", "last"]) ? a : "first",
                e = b(":input:enabled:visible:" + a, h.d.wrap);
            setTimeout(function() {
                    0 < e.length ? e.focus() : h.d.wrap.focus()
                },
                10)
        },
        getDimensions: function() {
            var a = "undefined" === typeof window.innerHeight ? l.height() : window.innerHeight;
            j = [n.height(), n.width()];
            g = [a, l.width()]
        },
        getVal: function(a, b) {
            return a ? "number" === typeof a ? a : "auto" === a ? 0 : 0 < a.indexOf("%") ? parseInt(a.replace(/%/, "")) / 100 * ("h" === b ? g[0] : g[1]) : parseInt(a.replace(/px/, "")) : null
        },
        update: function(a, b) {
            if (!this.d.data) return !1;
            this.d.origHeight = this.getVal(a, "h");
            this.d.origWidth = this.getVal(b, "w");
            this.d.data.hide();
            a && this.d.container.css("height", a);
            b && this.d.container.css("width",
                b);
            this.setContainerDimensions();
            this.d.data.show();
            this.o.focus && this.focus();
            this.unbindEvents();
            this.bindEvents();
        },
        setContainerDimensions: function() {
            var a = m || r,
                b = this.d.origHeight ? this.d.origHeight : q ? this.d.container.height() : this.getVal(a ? this.d.container[0].currentStyle.height : this.d.container.css("height"), "h"),
                a = this.d.origWidth ? this.d.origWidth : q ? this.d.container.width() : this.getVal(a ? this.d.container[0].currentStyle.width : this.d.container.css("width"), "w"),
                e = this.d.data.outerHeight(!0),
                f =
                this.d.data.outerWidth(!0);
            this.d.origHeight = this.d.origHeight || b;
            this.d.origWidth = this.d.origWidth || a;
            var c = this.o.maxHeight ? this.getVal(this.o.maxHeight, "h") : null,
                d = this.o.maxWidth ? this.getVal(this.o.maxWidth, "w") : null,
                c = c && c < g[0] ? c : g[0],
                d = d && d < g[1] ? d : g[1],
                i = this.o.minHeight ? this.getVal(this.o.minHeight, "h") : "auto",
                b = b ? this.o.autoResize && b > c ? c : b < i ? i : b : e ? e > c ? c : this.o.minHeight && "auto" !== i && e < i ? i : e : i,
                c = this.o.minWidth ? this.getVal(this.o.minWidth, "w") : "auto",
                a = a ? this.o.autoResize && a > d ? d : a < c ? c : a : f ?
                f > d ? d : this.o.minWidth && "auto" !== c && f < c ? c : f : c;
            this.d.container.css({
                height: b,
                width: a
            });
            this.d.wrap.css({
                overflow: e > b || f > a ? "auto" : "visible"
            });
            this.o.autoPosition && this.setPosition()
        },
        setPosition: function() {
            var a, b;
            a = g[0] / 2 - this.d.container.outerHeight(!0) / 2;
            b = g[1] / 2 - this.d.container.outerWidth(!0) / 2;
            var e = "fixed" !== this.d.container.css("position") ? l.scrollTop() : 0;
            this.o.position && "[object Array]" === Object.prototype.toString.call(this.o.position) ? (a = e + (this.o.position[0] || a), b = this.o.position[1] || b) :
                a = e + a;
            this.d.container.css({
                left: b,
                top: a
            });
        },
        watchTab: function(a) {
            if (0 < b(a.target).parents(".simplemodal-container").length) {
                if (this.inputs = b(":input:enabled:visible:first, :input:enabled:visible:last", this.d.data[0]), !a.shiftKey && a.target === this.inputs[this.inputs.length - 1] || a.shiftKey && a.target === this.inputs[0] || 0 === this.inputs.length) a.preventDefault(), this.focus(a.shiftKey ? "last" : "first")
            } else a.preventDefault(), this.focus();
        },
        open: function() {
            this.d.iframe && this.d.iframe.show();
            b.isFunction(this.o.onOpen) ?
                this.o.onOpen.apply(this, [this.d]) : (this.d.overlay.show(), this.d.container.show(), this.d.data.show());
            this.o.focus && this.focus();
            this.bindEvents()
        },
        close: function() {
            if (!this.d.data) return !1;
            this.unbindEvents();
            if (b.isFunction(this.o.onClose) && !this.occb) this.occb = !0, this.o.onClose.apply(this, [this.d]);
            else {
                if (this.d.placeholder) {
                    var a = b("#simplemodal-placeholder");
                    this.o.persist ? a.replaceWith(this.d.data.removeClass("simplemodal-data").css("display", this.display)) : (this.d.data.hide().remove(), a.replaceWith(this.d.orig));
                } else this.d.data.hide().remove();
                this.d.container.hide().remove();
                this.d.overlay.hide();
                this.d.iframe && this.d.iframe.hide().remove();
                this.d.overlay.remove();
                this.d = {};
            }
        }
    };
});

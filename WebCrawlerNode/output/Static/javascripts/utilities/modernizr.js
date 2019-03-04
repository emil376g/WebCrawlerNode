/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-svg-touchevents-video-prefixes-shiv-teststyles !*/
!function (e, t, n) { function a(e, t) { return typeof e === t } function o() { var e, t, n, o, r, i, s; for (var c in d) if (d.hasOwnProperty(c)) { if (e = [], t = d[c], t.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length)) for (n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase()); for (o = a(t.fn, "function") ? t.fn() : t.fn, r = 0; r < e.length; r++) i = e[r], s = i.split("."), 1 === s.length ? Modernizr[s[0]] = o : (!Modernizr[s[0]] || Modernizr[s[0]] instanceof Boolean || (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])), Modernizr[s[0]][s[1]] = o), l.push((o ? "" : "no-") + s.join("-")) } } function r(e) { var t = p.className, n = Modernizr._config.classPrefix || ""; if (m && (t = t.baseVal), Modernizr._config.enableJSClass) { var a = new RegExp("(^|\\s)" + n + "no-js(\\s|$)"); t = t.replace(a, "$1" + n + "js$2") } Modernizr._config.enableClasses && (t += " " + n + e.join(" " + n), m ? p.className.baseVal = t : p.className = t) } function i() { return "function" != typeof t.createElement ? t.createElement(arguments[0]) : m ? t.createElementNS.call(t, "http://www.w3.org/2000/svg", arguments[0]) : t.createElement.apply(t, arguments) } function s() { var e = t.body; return e || (e = i(m ? "svg" : "body"), e.fake = !0), e } function c(e, n, a, o) { var r, c, l, d, f = "modernizr", u = i("div"), m = s(); if (parseInt(a, 10)) for (; a--;) l = i("div"), l.id = o ? o[a] : f + (a + 1), u.appendChild(l); return r = i("style"), r.type = "text/css", r.id = "s" + f, (m.fake ? m : u).appendChild(r), m.appendChild(u), r.styleSheet ? r.styleSheet.cssText = e : r.appendChild(t.createTextNode(e)), u.id = f, m.fake && (m.style.background = "", m.style.overflow = "hidden", d = p.style.overflow, p.style.overflow = "hidden", p.appendChild(m)), c = n(u, e), m.fake ? (m.parentNode.removeChild(m), p.style.overflow = d, p.offsetHeight) : u.parentNode.removeChild(u), !!c } var l = [], d = [], f = { _version: "3.2.0", _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 }, _q: [], on: function (e, t) { var n = this; setTimeout(function () { t(n[e]) }, 0) }, addTest: function (e, t, n) { d.push({ name: e, fn: t, options: n }) }, addAsyncTest: function (e) { d.push({ name: null, fn: e }) } }, Modernizr = function () { }; Modernizr.prototype = f, Modernizr = new Modernizr, Modernizr.addTest("svg", !!t.createElementNS && !!t.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect); var u = f._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : []; f._prefixes = u; var p = t.documentElement, m = "svg" === p.nodeName.toLowerCase(); m || !function (e, t) { function n(e, t) { var n = e.createElement("p"), a = e.getElementsByTagName("head")[0] || e.documentElement; return n.innerHTML = "x<style>" + t + "</style>", a.insertBefore(n.lastChild, a.firstChild) } function a() { var e = E.elements; return "string" == typeof e ? e.split(" ") : e } function o(e, t) { var n = E.elements; "string" != typeof n && (n = n.join(" ")), "string" != typeof e && (e = e.join(" ")), E.elements = n + " " + e, l(t) } function r(e) { var t = y[e[v]]; return t || (t = {}, g++, e[v] = g, y[g] = t), t } function i(e, n, a) { if (n || (n = t), f) return n.createElement(e); a || (a = r(n)); var o; return o = a.cache[e] ? a.cache[e].cloneNode() : h.test(e) ? (a.cache[e] = a.createElem(e)).cloneNode() : a.createElem(e), !o.canHaveChildren || m.test(e) || o.tagUrn ? o : a.frag.appendChild(o) } function s(e, n) { if (e || (e = t), f) return e.createDocumentFragment(); n = n || r(e); for (var o = n.frag.cloneNode(), i = 0, s = a(), c = s.length; c > i; i++) o.createElement(s[i]); return o } function c(e, t) { t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function (n) { return E.shivMethods ? i(n, e, t) : t.createElem(n) }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + a().join().replace(/[\w\-:]+/g, function (e) { return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")' }) + ");return n}")(E, t.frag) } function l(e) { e || (e = t); var a = r(e); return !E.shivCSS || d || a.hasCSS || (a.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), f || c(e, a), e } var d, f, u = "3.7.3", p = e.html5 || {}, m = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, h = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, v = "_html5shiv", g = 0, y = {}; !function () { try { var e = t.createElement("a"); e.innerHTML = "<xyz></xyz>", d = "hidden" in e, f = 1 == e.childNodes.length || function () { t.createElement("a"); var e = t.createDocumentFragment(); return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement }() } catch (n) { d = !0, f = !0 } }(); var E = { elements: p.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video", version: u, shivCSS: p.shivCSS !== !1, supportsUnknownElements: f, shivMethods: p.shivMethods !== !1, type: "default", shivDocument: l, createElement: i, createDocumentFragment: s, addElements: o }; e.html5 = E, l(t), "object" == typeof module && module.exports && (module.exports = E) }("undefined" != typeof e ? e : this, t), Modernizr.addTest("video", function () { var e = i("video"), t = !1; try { (t = !!e.canPlayType) && (t = new Boolean(t), t.ogg = e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), t.h264 = e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), t.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""), t.vp9 = e.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, ""), t.hls = e.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, "")) } catch (n) { } return t }); var h = f.testStyles = c; Modernizr.addTest("touchevents", function () { var n; if ("ontouchstart" in e || e.DocumentTouch && t instanceof DocumentTouch) n = !0; else { var a = ["@media (", u.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join(""); h(a, function (e) { n = 9 === e.offsetTop }) } return n }), o(), r(l), delete f.addTest, delete f.addAsyncTest; for (var v = 0; v < Modernizr._q.length; v++) Modernizr._q[v](); e.Modernizr = Modernizr }(window, document);
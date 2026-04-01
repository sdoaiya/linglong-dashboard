(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload"))
    return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
    i(r);
  new MutationObserver((r) => {
    for (const n of r)
      if (n.type === "childList")
        for (const a of n.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && i(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(r) {
    const n = {};
    return r.integrity && (n.integrity = r.integrity), r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? n.credentials = "include" : r.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function i(r) {
    if (r.ep)
      return;
    r.ep = !0;
    const n = t(r);
    fetch(r.href, n);
  }
})();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, J = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), se = /* @__PURE__ */ new WeakMap();
let fe = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (J && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const $e = (s) => new fe(typeof s == "string" ? s : s + "", void 0, Z), X = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, r, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new fe(t, s, Z);
}, we = (s, e) => {
  if (J) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = W.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, re = J ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return $e(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ke, defineProperty: _e, getOwnPropertyDescriptor: Ae, getOwnPropertyNames: Se, getOwnPropertySymbols: Ee, getPrototypeOf: Ce } = Object, $ = globalThis, ne = $.trustedTypes, ze = ne ? ne.emptyScript : "", Q = $.reactiveElementPolyfillSupport, M = (s, e) => s, B = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? ze : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, ee = (s, e) => !ke(s, e), ae = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: ee };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && _e(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: n } = Ae(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: r, set(a) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, a), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const e = Ce(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const t = this.properties, i = [...Se(t), ...Ee(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(re(r));
    } else e !== void 0 && t.push(re(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return we(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var n;
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const a = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : B).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, a;
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), o = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : B;
      this._$Em = r;
      const d = o.fromAttribute(t, l.type);
      this[r] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, r = !1, n) {
    var a;
    if (e !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? ee)(n, t) || i.useDefault && i.reflect && n === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: n }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, a] of r) {
        const { wrapped: l } = a, o = this[n];
        l !== !0 || this._$AL.has(n) || o === void 0 || this.C(n, void 0, a, o);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[M("elementProperties")] = /* @__PURE__ */ new Map(), z[M("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: z }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, oe = (s) => s, q = I.trustedTypes, le = q ? q.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ve = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, be = "?" + x, Oe = `<${be}>`, C = document, U = () => C.createComment(""), H = (s) => s === null || typeof s != "object" && typeof s != "function", te = Array.isArray, Pe = (s) => te(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, de = />/g, _ = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, he = /"/g, ye = /^(?:script|style|textarea|title)$/i, Te = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), c = Te(1), O = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), A = C.createTreeWalker(C, 129);
function xe(s, e) {
  if (!te(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const De = (s, e) => {
  const t = s.length - 1, i = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = N;
  for (let l = 0; l < t; l++) {
    const o = s[l];
    let d, u, p = -1, b = 0;
    for (; b < o.length && (a.lastIndex = b, u = a.exec(o), u !== null); ) b = a.lastIndex, a === N ? u[1] === "!--" ? a = ce : u[1] !== void 0 ? a = de : u[2] !== void 0 ? (ye.test(u[2]) && (r = RegExp("</" + u[2], "g")), a = _) : u[3] !== void 0 && (a = _) : a === _ ? u[0] === ">" ? (a = r ?? N, p = -1) : u[1] === void 0 ? p = -2 : (p = a.lastIndex - u[2].length, d = u[1], a = u[3] === void 0 ? _ : u[3] === '"' ? he : pe) : a === he || a === pe ? a = _ : a === ce || a === de ? a = N : (a = _, r = void 0);
    const y = a === _ && s[l + 1].startsWith("/>") ? " " : "";
    n += a === N ? o + Oe : p >= 0 ? (i.push(d), o.slice(0, p) + ve + o.slice(p) + x + y) : o + x + (p === -2 ? l : y);
  }
  return [xe(s, n + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, o = this.parts, [d, u] = De(e, t);
    if (this.el = j.createElement(d, i), A.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = A.nextNode()) !== null && o.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(ve)) {
          const b = u[a++], y = r.getAttribute(p).split(x), R = /([.?@])?(.*)/.exec(b);
          o.push({ type: 1, index: n, name: R[2], strings: y, ctor: R[1] === "." ? Me : R[1] === "?" ? Ie : R[1] === "@" ? Ue : F }), r.removeAttribute(p);
        } else p.startsWith(x) && (o.push({ type: 6, index: n }), r.removeAttribute(p));
        if (ye.test(r.tagName)) {
          const p = r.textContent.split(x), b = p.length - 1;
          if (b > 0) {
            r.textContent = q ? q.emptyScript : "";
            for (let y = 0; y < b; y++) r.append(p[y], U()), A.nextNode(), o.push({ type: 2, index: ++n });
            r.append(p[b], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === be) o.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(x, p + 1)) !== -1; ) o.push({ type: 7, index: n }), p += x.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const i = C.createElement("template");
    return i.innerHTML = e, i;
  }
}
function P(s, e, t = s, i) {
  var a, l;
  if (e === O) return e;
  let r = i !== void 0 ? (a = t._$Co) == null ? void 0 : a[i] : t._$Cl;
  const n = H(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = r : t._$Cl = r), r !== void 0 && (e = P(s, r._$AS(s, e.values), r, i)), e;
}
class Ne {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? C).importNode(t, !0);
    A.currentNode = r;
    let n = A.nextNode(), a = 0, l = 0, o = i[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new L(n, n.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, e) : o.type === 6 && (d = new He(n, this, e)), this._$AV.push(d), o = i[++l];
      }
      a !== (o == null ? void 0 : o.index) && (n = A.nextNode(), a++);
    }
    return A.currentNode = C, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class L {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = P(this, e, t), H(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Pe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = j.createElement(xe(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(t);
    else {
      const a = new Ne(r, this), l = a.u(this.options);
      a.p(t), this.T(l), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = ue.get(e.strings);
    return t === void 0 && ue.set(e.strings, t = new j(e)), t;
  }
  k(e) {
    te(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const n of e) r === t.length ? t.push(i = new L(this.O(U()), this.O(U()), this, this.options)) : i = t[r], i._$AI(n), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const r = oe(e).nextSibling;
      oe(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(e, t = this, i, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = P(this, e, t, 0), a = !H(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
    else {
      const l = e;
      let o, d;
      for (e = n[0], o = 0; o < n.length - 1; o++) d = P(this, l[i + o], t, o), d === O && (d = this._$AH[o]), a || (a = !H(d) || d !== this._$AH[o]), d === h ? e = h : e !== h && (e += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Me extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Ie extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ue extends F {
  constructor(e, t, i, r, n) {
    super(e, t, i, r, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? h) === O) return;
    const i = this._$AH, r = e === h && i !== h || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class He {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const G = I.litHtmlPolyfillSupport;
G == null || G(j, L), (I.litHtmlVersions ?? (I.litHtmlVersions = [])).push("3.3.2");
const je = (s, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = r = new L(e.insertBefore(U(), n), n, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class E extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return O;
  }
}
var ge;
E._$litElement$ = !0, E.finalized = !0, (ge = S.litElementHydrateSupport) == null || ge.call(S, { LitElement: E });
const K = S.litElementPolyfillSupport;
K == null || K({ LitElement: E });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: ee }, Re = (s = Le, e, t) => {
  const { kind: i, metadata: r } = t;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(t.name, s), i === "accessor") {
    const { name: a } = t;
    return { set(l) {
      const o = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, o, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = t;
    return function(l) {
      const o = this[a];
      e.call(this, l), this.requestUpdate(a, o, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function T(s) {
  return (e, t) => typeof t == "object" ? Re(s, e, t) : ((i, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function m(s) {
  return T({ ...s, state: !0, attribute: !1 });
}
class We {
  constructor(e) {
    this.ws = null, this.reconnectAttempts = 0, this.heartbeatTimer = null, this.reconnectTimer = null, this.isIntentionallyClosed = !1, this.messageHandlers = /* @__PURE__ */ new Map(), this.url = e.url, this.reconnectInterval = e.reconnectInterval ?? 3e3, this.maxReconnectAttempts = e.maxReconnectAttempts ?? 10, this.heartbeatInterval = e.heartbeatInterval ?? 3e4, this.onOpenCallback = e.onOpen, this.onCloseCallback = e.onClose, this.onErrorCallback = e.onError, this.onMessageCallback = e.onMessage;
  }
  /**
   * 连接 WebSocket
   */
  connect() {
    var e;
    if (((e = this.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN) {
      console.log("[WebSocket] 已连接");
      return;
    }
    this.isIntentionallyClosed = !1;
    try {
      console.log(`[WebSocket] 连接到: ${this.url}`), this.ws = new WebSocket(this.url), this.ws.onopen = this.handleOpen.bind(this), this.ws.onclose = this.handleClose.bind(this), this.ws.onerror = this.handleError.bind(this), this.ws.onmessage = this.handleMessage.bind(this);
    } catch (t) {
      console.error("[WebSocket] 连接失败:", t), this.scheduleReconnect();
    }
  }
  /**
   * 断开连接
   */
  disconnect() {
    console.log("[WebSocket] 主动断开连接"), this.isIntentionallyClosed = !0, this.clearTimers(), this.ws && (this.ws.close(), this.ws = null);
  }
  /**
   * 发送消息
   */
  send(e, t) {
    var r;
    if (((r = this.ws) == null ? void 0 : r.readyState) !== WebSocket.OPEN)
      return console.warn("[WebSocket] 连接未就绪，无法发送消息"), !1;
    const i = {
      type: e,
      payload: t,
      timestamp: Date.now(),
      id: this.generateMessageId()
    };
    try {
      return this.ws.send(JSON.stringify(i)), !0;
    } catch (n) {
      return console.error("[WebSocket] 发送消息失败:", n), !1;
    }
  }
  /**
   * 订阅特定类型的消息
   */
  on(e, t) {
    this.messageHandlers.has(e) || this.messageHandlers.set(e, []);
    const i = this.messageHandlers.get(e);
    return i.push(t), () => {
      const r = i.indexOf(t);
      r > -1 && i.splice(r, 1);
    };
  }
  /**
   * 发送心跳
   */
  ping() {
    return this.send("ping", {});
  }
  /**
   * 获取连接状态
   */
  get readyState() {
    var e;
    return ((e = this.ws) == null ? void 0 : e.readyState) ?? WebSocket.CLOSED;
  }
  get isConnected() {
    var e;
    return ((e = this.ws) == null ? void 0 : e.readyState) === WebSocket.OPEN;
  }
  /**
   * 处理连接打开
   */
  handleOpen() {
    var e;
    console.log("[WebSocket] 连接成功"), this.reconnectAttempts = 0, this.startHeartbeat(), (e = this.onOpenCallback) == null || e.call(this);
  }
  /**
   * 处理连接关闭
   */
  handleClose(e) {
    var t;
    console.log(`[WebSocket] 连接关闭: code=${e.code}, reason=${e.reason}`), this.clearTimers(), (t = this.onCloseCallback) == null || t.call(this, e), this.isIntentionallyClosed || this.scheduleReconnect();
  }
  /**
   * 处理错误
   */
  handleError(e) {
    var t;
    console.error("[WebSocket] 错误:", e), (t = this.onErrorCallback) == null || t.call(this, e);
  }
  /**
   * 处理收到的消息
   */
  handleMessage(e) {
    var t;
    try {
      const i = JSON.parse(e.data);
      if (console.log("[WebSocket] 收到消息:", i.type), i.type === "pong")
        return;
      (t = this.onMessageCallback) == null || t.call(this, i);
      const r = this.messageHandlers.get(i.type);
      r && r.forEach((n) => {
        try {
          n(i.payload);
        } catch (a) {
          console.error(`[WebSocket] 消息处理器错误 (${i.type}):`, a);
        }
      });
    } catch (i) {
      console.error("[WebSocket] 解析消息失败:", i);
    }
  }
  /**
   * 安排重连
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[WebSocket] 达到最大重连次数，停止重连");
      return;
    }
    this.reconnectAttempts++;
    const e = this.reconnectInterval * Math.min(this.reconnectAttempts, 5);
    console.log(`[WebSocket] ${e}ms 后尝试第 ${this.reconnectAttempts} 次重连...`), this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, e);
  }
  /**
   * 启动心跳
   */
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.isConnected && this.ping();
    }, this.heartbeatInterval);
  }
  /**
   * 清除定时器
   */
  clearTimers() {
    this.heartbeatTimer && (clearInterval(this.heartbeatTimer), this.heartbeatTimer = null), this.reconnectTimer && (clearTimeout(this.reconnectTimer), this.reconnectTimer = null);
  }
  /**
   * 生成消息ID
   */
  generateMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
function Ve(s) {
  return new We(s);
}
var Be = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, k = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? qe(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && Be(e, t, r), r;
};
let f = class extends E {
  constructor() {
    super(...arguments), this.currentView = "organization", this.userName = "管理员", this.userAvatar = "", this.notifications = [], this.showNotifications = !1, this.currentTime = /* @__PURE__ */ new Date(), this.isOnline = !0;
  }
  connectedCallback() {
    super.connectedCallback(), this.startClock();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.timeInterval && clearInterval(this.timeInterval);
  }
  startClock() {
    this.timeInterval = setInterval(() => {
      this.currentTime = /* @__PURE__ */ new Date();
    }, 1e3);
  }
  formatTime(s) {
    return s.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
  formatDate(s) {
    return s.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      weekday: "short"
    });
  }
  handleViewChange(s) {
    this.dispatchEvent(new CustomEvent("view-change", {
      detail: { view: s },
      bubbles: !0,
      composed: !0
    }));
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  getUnreadCount() {
    return this.notifications.filter((s) => !s.read).length;
  }
  render() {
    return c`
      <header class="header">
        <div class="left-section">
          <div class="logo" @click=${() => this.handleViewChange("organization")}>
            <div class="logo-icon">🐉</div>
            <div class="logo-text">
              <span class="logo-title">灵笼看板</span>
              <span class="logo-subtitle">LINGLONG DASHBOARD</span>
            </div>
          </div>
          
          <nav class="nav-tabs">
            ${[
      { id: "organization", label: "组织架构", icon: "🏢" },
      { id: "kanban", label: "任务看板", icon: "📋" },
      { id: "monitor", label: "实时监控", icon: "📊" },
      { id: "actions", label: "快捷操作", icon: "⚡" }
    ].map((e) => c`
              <button 
                class="nav-tab ${this.currentView === e.id ? "active" : ""}"
                @click=${() => this.handleViewChange(e.id)}
              >
                <span class="icon">${e.icon}</span>
                <span>${e.label}</span>
              </button>
            `)}
          </nav>
        </div>

        <div class="right-section">
          <div class="status-indicator ${this.isOnline ? "" : "offline"}">
            <span class="status-dot"></span>
            <span>${this.isOnline ? "系统正常" : "离线中"}</span>
          </div>
          
          <div class="time-display">
            ${this.formatDate(this.currentTime)} ${this.formatTime(this.currentTime)}
          </div>

          <button class="notification-btn" @click=${this.toggleNotifications}>
            🔔
            ${this.getUnreadCount() > 0 ? c`
              <span class="notification-badge">${this.getUnreadCount()}</span>
            ` : null}
          </button>

          <div class="user-profile">
            <div class="user-avatar">
              ${this.userAvatar ? c`<img src="${this.userAvatar}" alt="${this.userName}">` : this.userName.charAt(0)}
            </div>
            <span class="user-name">${this.userName}</span>
          </div>
        </div>
      </header>

      ${this.showNotifications ? c`
        <div class="notification-dropdown">
          <div class="notification-header">
            <span class="notification-title">通知</span>
            ${this.notifications.length > 0 ? c`
              <button class="notification-clear" @click=${() => {
    }}>
                全部已读
              </button>
            ` : null}
          </div>
          <div class="notification-list">
            ${this.notifications.length === 0 ? c`
              <div class="notification-empty">
                <div class="notification-empty-icon">📭</div>
                <div>暂无通知</div>
              </div>
            ` : this.notifications.map((e) => c`
              <div class="notification-item">
                <div class="notification-icon ${e.type}">
                  ${e.type === "info" ? "ℹ️" : e.type === "success" ? "✅" : e.type === "warning" ? "⚠️" : "❌"}
                </div>
                <div class="notification-content">
                  <div class="notification-item-title">${e.title}</div>
                  <div class="notification-item-message">${e.message}</div>
                  <div class="notification-item-time">
                    ${new Date(e.timestamp).toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>
            `)}
          </div>
        </div>
      ` : null}
    `;
  }
};
f.styles = X`
    :host {
      display: block;
      height: 64px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 24px;
      background: linear-gradient(135deg, var(--ll-primary) 0%, var(--ll-primary-dark) 100%);
      border-bottom: 1px solid var(--ll-border);
      box-shadow: var(--ll-shadow);
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: var(--ll-shadow-glow);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: white;
      letter-spacing: 0.05em;
    }

    .logo-subtitle {
      font-size: 11px;
      color: var(--ll-text-secondary);
      letter-spacing: 0.1em;
    }

    .nav-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 32px;
    }

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--ll-text-secondary);
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-tab:hover {
      color: var(--ll-text-primary);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-tab.active {
      color: white;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      box-shadow: var(--ll-shadow-sm);
    }

    .nav-tab .icon {
      font-size: 16px;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 20px;
      font-size: 12px;
      color: var(--ll-success);
    }

    .status-indicator.offline {
      background: rgba(239, 68, 68, 0.1);
      color: var(--ll-error);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator.offline .status-dot {
      animation: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .time-display {
      font-family: var(--ll-font-mono);
      font-size: 14px;
      color: var(--ll-text-secondary);
      letter-spacing: 0.05em;
    }

    .notification-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 18px;
    }

    .notification-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .notification-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background: var(--ll-error);
      border-radius: 9px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px 6px 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-profile:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: white;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--ll-text-primary);
    }

    .notification-dropdown {
      position: absolute;
      top: 72px;
      right: 24px;
      width: 360px;
      max-height: 480px;
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      box-shadow: var(--ll-shadow-lg);
      z-index: 1000;
      overflow: hidden;
    }

    .notification-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--ll-border);
    }

    .notification-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .notification-clear {
      font-size: 12px;
      color: var(--ll-accent);
      cursor: pointer;
      background: none;
      border: none;
    }

    .notification-clear:hover {
      text-decoration: underline;
    }

    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--ll-border);
      cursor: pointer;
      transition: background 0.2s;
    }

    .notification-item:hover {
      background: var(--ll-bg-tertiary);
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .notification-icon.info { background: rgba(59, 130, 246, 0.1); }
    .notification-icon.success { background: rgba(16, 185, 129, 0.1); }
    .notification-icon.warning { background: rgba(245, 158, 11, 0.1); }
    .notification-icon.error { background: rgba(239, 68, 68, 0.1); }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-item-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--ll-text-primary);
      margin-bottom: 4px;
    }

    .notification-item-message {
      font-size: 12px;
      color: var(--ll-text-secondary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .notification-item-time {
      font-size: 11px;
      color: var(--ll-text-tertiary);
      margin-top: 4px;
    }

    .notification-empty {
      padding: 48px 24px;
      text-align: center;
      color: var(--ll-text-secondary);
    }

    .notification-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `;
k([
  T({ type: String })
], f.prototype, "currentView", 2);
k([
  T({ type: String })
], f.prototype, "userName", 2);
k([
  T({ type: String })
], f.prototype, "userAvatar", 2);
k([
  m()
], f.prototype, "notifications", 2);
k([
  m()
], f.prototype, "showNotifications", 2);
k([
  m()
], f.prototype, "currentTime", 2);
k([
  m()
], f.prototype, "isOnline", 2);
f = k([
  ie("linglong-header")
], f);
var V = /* @__PURE__ */ ((s) => (s.OFFICE = "office", s.MARKETING = "marketing", s.DEVELOPMENT = "development", s.OPERATIONS = "operations", s.SECURITY = "security", s.PUBLICITY = "publicity", s))(V || {});
const Fe = {
  office: { name: "集团办公室", icon: "🏢", color: "#1a365d" },
  marketing: { name: "市场部", icon: "📈", color: "#ed8936" },
  development: { name: "开发部", icon: "💻", color: "#3b82f6" },
  operations: { name: "运营部", icon: "⚙️", color: "#10b981" },
  security: { name: "安全部", icon: "🛡️", color: "#ef4444" },
  publicity: { name: "宣传部", icon: "📢", color: "#8b5cf6" }
};
var Qe = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, D = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Ye(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && Qe(e, t, r), r;
};
let w = class extends E {
  constructor() {
    super(...arguments), this.collapsed = !1, this.employees = [], this.selectedDepartment = null, this.searchQuery = "", this.expandedDepartments = /* @__PURE__ */ new Set([
      V.OFFICE,
      V.DEVELOPMENT
    ]);
  }
  getDepartmentStats(s) {
    const e = this.employees.filter((t) => t.department === s);
    return {
      total: e.length,
      online: e.filter((t) => t.status === "online").length,
      busy: e.filter((t) => t.status === "busy").length
    };
  }
  getFilteredEmployees(s) {
    return this.employees.filter((e) => e.department === s).filter((e) => {
      if (!this.searchQuery) return !0;
      const t = this.searchQuery.toLowerCase();
      return e.name.toLowerCase().includes(t) || e.position.toLowerCase().includes(t);
    }).sort((e, t) => t.level - e.level);
  }
  toggleDepartment(s) {
    const e = new Set(this.expandedDepartments);
    e.has(s) ? e.delete(s) : e.add(s), this.expandedDepartments = e;
  }
  selectDepartment(s) {
    this.selectedDepartment = this.selectedDepartment === s ? null : s, this.dispatchEvent(new CustomEvent("department-select", {
      detail: { department: this.selectedDepartment },
      bubbles: !0,
      composed: !0
    }));
  }
  selectEmployee(s) {
    this.dispatchEvent(new CustomEvent("employee-select", {
      detail: { employee: s },
      bubbles: !0,
      composed: !0
    }));
  }
  toggleCollapse() {
    this.dispatchEvent(new CustomEvent("toggle-collapse", {
      bubbles: !0,
      composed: !0
    }));
  }
  getInitials(s) {
    return s.charAt(0).toUpperCase();
  }
  render() {
    const s = Object.values(V), e = this.employees.length, t = this.employees.filter((i) => i.status === "online").length;
    return c`
      <div class="sidebar-header">
        ${this.collapsed ? null : c`
          <span class="sidebar-title">组织架构</span>
        `}
        <button class="collapse-btn" @click=${this.toggleCollapse}>
          ${this.collapsed ? "→" : "←"}
        </button>
      </div>

      ${this.collapsed ? null : c`
        <div class="search-box">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              class="search-input"
              type="text"
              placeholder="搜索成员..."
              .value=${this.searchQuery}
              @input=${(i) => this.searchQuery = i.target.value}
            >
          </div>
        </div>
      `}

      <div class="department-list">
        ${s.map((i) => {
      const r = Fe[i], n = this.getDepartmentStats(i), a = this.expandedDepartments.has(i), l = this.selectedDepartment === i, o = this.getFilteredEmployees(i);
      return this.searchQuery && o.length === 0 ? null : c`
            <div class="department-item">
              <div 
                class="department-header ${l ? "active" : ""}"
                @click=${() => this.selectDepartment(i)}
              >
                ${this.collapsed ? null : c`
                  <span class="expand-icon ${a ? "expanded" : ""}" 
                        @click=${(d) => {
        d.stopPropagation(), this.toggleDepartment(i);
      }}>
                    ▶
                  </span>
                `}
                <div class="department-icon" style="background: ${r.color}20; color: ${r.color}">
                  ${r.icon}
                </div>
                ${this.collapsed ? null : c`
                  <div class="department-info">
                    <div class="department-name">${r.name}</div>
                    <div class="department-stats">
                      ${n.online} 在线 / ${n.total} 人
                    </div>
                  </div>
                  <div class="department-count">
                    ${n.online > 0 ? c`<span class="online-dot"></span>` : null}
                    ${n.total}
                  </div>
                `}
              </div>

              ${!this.collapsed && a ? c`
                <div class="employee-list">
                  ${o.length === 0 ? c`
                    <div class="empty-state">
                      <div class="empty-text">暂无成员</div>
                    </div>
                  ` : o.map((d) => c`
                    <div class="employee-item" @click=${() => this.selectEmployee(d)}>
                      <div class="employee-avatar">
                        ${d.avatar ? c`<img src="${d.avatar}" alt="${d.name}">` : this.getInitials(d.name)}
                      </div>
                      <div class="employee-info">
                        <div class="employee-name">${d.name}</div>
                        <div class="employee-position">${d.position}</div>
                      </div>
                      <span class="employee-status ${d.status}"></span>
                    </div>
                  `)}
                </div>
              ` : null}
            </div>
          `;
    })}
      </div>

      ${this.collapsed ? null : c`
        <div class="sidebar-footer">
          <div class="team-summary">
            <div class="summary-item">
              <div class="summary-value">${e}</div>
              <div class="summary-label">总人数</div>
            </div>
            <div class="summary-item">
              <div class="summary-value" style="color: var(--ll-success)">${t}</div>
              <div class="summary-label">在线</div>
            </div>
            <div class="summary-item">
              <div class="summary-value" style="color: var(--ll-warning)">${e - t}</div>
              <div class="summary-label">离线</div>
            </div>
          </div>
        </div>
      `}
    `;
  }
};
w.styles = X`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--ll-bg-secondary);
      border-right: 1px solid var(--ll-border);
      transition: width 0.3s ease;
    }

    :host([collapsed]) {
      width: 64px;
    }

    :host(:not([collapsed])) {
      width: 280px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--ll-border);
    }

    .sidebar-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: var(--ll-text-secondary);
      transition: all 0.2s;
    }

    .collapse-btn:hover {
      background: var(--ll-bg-tertiary);
      color: var(--ll-text-primary);
    }

    .search-box {
      padding: 12px 16px;
      border-bottom: 1px solid var(--ll-border);
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ll-text-tertiary);
      font-size: 14px;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px 8px 36px;
      font-size: 13px;
      color: var(--ll-text-primary);
      background: var(--ll-bg-tertiary);
      border: 1px solid var(--ll-border);
      border-radius: 8px;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--ll-accent);
      box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.1);
    }

    .search-input::placeholder {
      color: var(--ll-text-tertiary);
    }

    .department-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .department-item {
      margin-bottom: 4px;
    }

    .department-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .department-header:hover {
      background: var(--ll-bg-tertiary);
    }

    .department-header.active {
      background: rgba(237, 137, 54, 0.1);
    }

    .expand-icon {
      font-size: 12px;
      color: var(--ll-text-tertiary);
      transition: transform 0.2s;
    }

    .expand-icon.expanded {
      transform: rotate(90deg);
    }

    .department-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .department-info {
      flex: 1;
      min-width: 0;
    }

    .department-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--ll-text-primary);
    }

    .department-stats {
      font-size: 11px;
      color: var(--ll-text-tertiary);
      margin-top: 2px;
    }

    .department-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--ll-text-secondary);
    }

    .online-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ll-success);
    }

    .employee-list {
      padding-left: 32px;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .employee-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .employee-item:hover {
      background: var(--ll-bg-tertiary);
    }

    .employee-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      background: var(--ll-bg-elevated);
      overflow: hidden;
    }

    .employee-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .employee-info {
      flex: 1;
      min-width: 0;
    }

    .employee-name {
      font-size: 12px;
      font-weight: 500;
      color: var(--ll-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .employee-position {
      font-size: 11px;
      color: var(--ll-text-tertiary);
    }

    .employee-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .employee-status.online {
      background: var(--ll-success);
      box-shadow: 0 0 6px var(--ll-success);
    }

    .employee-status.busy {
      background: var(--ll-warning);
    }

    .employee-status.away {
      background: var(--ll-info);
    }

    .employee-status.offline {
      background: var(--ll-text-tertiary);
    }

    .sidebar-footer {
      padding: 12px 16px;
      border-top: 1px solid var(--ll-border);
    }

    .team-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--ll-bg-tertiary);
      border-radius: 8px;
    }

    .summary-item {
      text-align: center;
    }

    .summary-value {
      font-size: 18px;
      font-weight: 700;
      color: var(--ll-accent);
    }

    .summary-label {
      font-size: 10px;
      color: var(--ll-text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 2px;
    }

    /* 折叠状态样式 */
    :host([collapsed]) .sidebar-title,
    :host([collapsed]) .search-box,
    :host([collapsed]) .department-info,
    :host([collapsed]) .employee-list,
    :host([collapsed]) .department-count,
    :host([collapsed]) .sidebar-footer {
      display: none;
    }

    :host([collapsed]) .department-header {
      justify-content: center;
      padding: 12px;
    }

    :host([collapsed]) .expand-icon {
      display: none;
    }

    :host([collapsed]) .department-icon {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      color: var(--ll-text-tertiary);
    }

    .empty-icon {
      font-size: 32px;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 12px;
    }
  `;
D([
  T({ type: Boolean })
], w.prototype, "collapsed", 2);
D([
  T({ type: Array })
], w.prototype, "employees", 2);
D([
  m()
], w.prototype, "selectedDepartment", 2);
D([
  m()
], w.prototype, "searchQuery", 2);
D([
  m()
], w.prototype, "expandedDepartments", 2);
w = D([
  ie("linglong-sidebar")
], w);
var Ge = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, v = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Ke(e, t) : e, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = (i ? a(e, t, r) : a(r)) || r);
  return i && r && Ge(e, t, r), r;
};
let g = class extends E {
  constructor() {
    super(...arguments), this.currentView = "organization", this.sidebarCollapsed = !1, this.employees = [], this.tasks = [], this.systemStatus = null, this.notifications = [], this.isLoading = !0, this.wsConnected = !1, this.error = null, this.wsService = null;
  }
  connectedCallback() {
    super.connectedCallback(), this.initializeWebSocket(), this.loadInitialData();
  }
  disconnectedCallback() {
    var s;
    super.disconnectedCallback(), (s = this.wsService) == null || s.disconnect();
  }
  initializeWebSocket() {
    this.wsService = Ve({
      url: "ws://127.0.0.1:18789/ws",
      reconnectInterval: 3e3,
      maxReconnectAttempts: 10,
      heartbeatInterval: 3e4,
      onOpen: () => {
        console.log("[Dashboard] WebSocket 已连接"), this.wsConnected = !0;
      },
      onClose: () => {
        console.log("[Dashboard] WebSocket 已断开"), this.wsConnected = !1;
      },
      onError: (s) => {
        console.error("[Dashboard] WebSocket 错误:", s);
      },
      onMessage: (s) => {
        this.handleWebSocketMessage(s);
      }
    }), this.wsService.connect();
  }
  handleWebSocketMessage(s) {
    switch (s.type) {
      case "task_update":
        this.handleTaskUpdate(s.payload);
        break;
      case "employee_update":
        this.handleEmployeeUpdate(s.payload);
        break;
      case "system_status":
        this.systemStatus = s.payload;
        break;
      case "notification":
        this.handleNotification(s.payload);
        break;
    }
  }
  handleTaskUpdate(s) {
    const e = this.tasks.findIndex((t) => t.id === s.id);
    e >= 0 ? this.tasks = [
      ...this.tasks.slice(0, e),
      s,
      ...this.tasks.slice(e + 1)
    ] : this.tasks = [...this.tasks, s];
  }
  handleEmployeeUpdate(s) {
    const e = this.employees.findIndex((t) => t.id === s.id);
    e >= 0 && (this.employees = [
      ...this.employees.slice(0, e),
      s,
      ...this.employees.slice(e + 1)
    ]);
  }
  handleNotification(s) {
    this.notifications = [s, ...this.notifications];
  }
  async loadInitialData() {
    try {
      this.isLoading = !0, await new Promise((s) => setTimeout(s, 1e3)), this.employees = this.generateMockEmployees(), this.tasks = this.generateMockTasks(), this.systemStatus = this.generateMockSystemStatus(), this.isLoading = !1;
    } catch (s) {
      this.error = s instanceof Error ? s.message : "加载失败", this.isLoading = !1;
    }
  }
  generateMockEmployees() {
    const s = ["office", "marketing", "development", "operations", "security", "publicity"];
    return ["张伟", "李娜", "王强", "刘洋", "陈静", "杨帆", "赵敏", "黄磊", "周杰", "吴倩", "徐鹏", "孙丽", "马超", "朱婷", "胡军", "郭芳", "林峰", "何婷", "罗刚"].map((t, i) => ({
      id: `emp_${i}`,
      name: t,
      department: s[i % s.length],
      position: ["总监", "经理", "高级工程师", "工程师", "专员"][i % 5],
      level: [9, 8, 7, 6, 5][i % 5],
      status: ["online", "busy", "offline", "away"][i % 4],
      email: `${t}@linglong.group`
    }));
  }
  generateMockTasks() {
    const s = ["todo", "in_progress", "review", "done"], e = ["low", "medium", "high", "urgent"];
    return Array.from({ length: 20 }, (t, i) => ({
      id: `task_${i}`,
      title: `任务 ${i + 1}: ${["设计新功能", "修复Bug", "代码审查", "文档编写", "性能优化"][i % 5]}`,
      description: "这是一个示例任务描述",
      status: s[i % 4],
      priority: e[i % 4],
      assignee: this.employees[i % this.employees.length],
      creator: this.employees[0],
      department: "development",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      tags: ["前端", "后端", "设计"][i % 3].split(",")
    }));
  }
  generateMockSystemStatus() {
    return {
      gateway: {
        name: "Gateway",
        status: "healthy",
        uptime: 86400,
        lastCheck: /* @__PURE__ */ new Date(),
        message: "运行正常"
      },
      database: {
        name: "Database",
        status: "healthy",
        uptime: 86400,
        lastCheck: /* @__PURE__ */ new Date(),
        message: "连接正常"
      },
      websocket: {
        name: "WebSocket",
        status: this.wsConnected ? "healthy" : "warning",
        uptime: 3600,
        lastCheck: /* @__PURE__ */ new Date(),
        message: this.wsConnected ? "连接正常" : "连接中..."
      },
      agents: [
        { id: "agent_1", name: "灵枢", status: "busy", currentTask: "处理任务", lastHeartbeat: /* @__PURE__ */ new Date() },
        { id: "agent_2", name: "灵市", status: "idle", lastHeartbeat: /* @__PURE__ */ new Date() },
        { id: "agent_3", name: "灵码", status: "busy", currentTask: "代码生成", lastHeartbeat: /* @__PURE__ */ new Date() }
      ]
    };
  }
  handleViewChange(s) {
    this.currentView = s.detail.view;
  }
  handleSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  renderOrganizationView() {
    return c`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">组织架构</h1>
          <p class="content-subtitle">灵笼集团 19 人团队实时状态</p>
        </div>
        <div class="org-grid">
          ${[
      { id: "office", name: "集团办公室", icon: "🏢", color: "#1a365d" },
      { id: "marketing", name: "市场部", icon: "📈", color: "#ed8936" },
      { id: "development", name: "开发部", icon: "💻", color: "#3b82f6" },
      { id: "operations", name: "运营部", icon: "⚙️", color: "#10b981" },
      { id: "security", name: "安全部", icon: "🛡️", color: "#ef4444" },
      { id: "publicity", name: "宣传部", icon: "📢", color: "#8b5cf6" }
    ].map((e) => {
      const t = this.employees.filter((i) => i.department === e.id);
      return c`
              <div class="org-card">
                <div class="org-card-header">
                  <div class="org-card-icon" style="background: ${e.color}20; color: ${e.color}">
                    ${e.icon}
                  </div>
                  <div>
                    <div class="org-card-title">${e.name}</div>
                    <div class="org-card-count">${t.length} 人</div>
                  </div>
                </div>
                <div class="org-members">
                  ${t.slice(0, 5).map((i) => c`
                    <div class="org-member">
                      <div class="org-member-avatar">${i.name.charAt(0)}</div>
                      <span>${i.name}</span>
                    </div>
                  `)}
                  ${t.length > 5 ? c`
                    <div class="org-member">
                      <span>+${t.length - 5}</span>
                    </div>
                  ` : null}
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  renderKanbanView() {
    return c`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">任务看板</h1>
          <p class="content-subtitle">实时任务追踪与管理</p>
        </div>
        <div class="kanban-board">
          ${[
      { id: "todo", title: "待办", color: "#94a3b8" },
      { id: "in_progress", title: "进行中", color: "#3b82f6" },
      { id: "review", title: "审核中", color: "#f59e0b" },
      { id: "done", title: "已完成", color: "#10b981" }
    ].map((e) => {
      const t = this.tasks.filter((i) => i.status === e.id);
      return c`
              <div class="kanban-column">
                <div class="kanban-column-header">
                  <div class="kanban-column-title">
                    <span style="color: ${e.color}">●</span>
                    ${e.title}
                  </div>
                  <span class="kanban-column-count">${t.length}</span>
                </div>
                <div class="kanban-tasks">
                  ${t.map((i) => c`
                    <div class="kanban-task">
                      <div class="kanban-task-title">${i.title}</div>
                      <div class="kanban-task-meta">
                        <span class="kanban-task-priority ${i.priority}">
                          ${i.priority}
                        </span>
                        ${i.assignee ? c`
                          <div class="kanban-task-assignee">
                            ${i.assignee.name.charAt(0)}
                          </div>
                        ` : null}
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  renderMonitorView() {
    return this.systemStatus ? c`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">实时监控</h1>
          <p class="content-subtitle">系统状态与性能监控</p>
        </div>
        <div class="monitor-grid">
          <div class="monitor-card">
            <div class="monitor-card-header">
              <span class="monitor-card-title">Gateway</span>
              <span class="monitor-status ${this.systemStatus.gateway.status}">
                ${this.systemStatus.gateway.status === "healthy" ? "● 正常" : "● 异常"}
              </span>
            </div>
            <div class="monitor-metric">
              <span class="monitor-metric-value">99.9%</span>
              <span class="monitor-metric-unit">可用性</span>
            </div>
          </div>

          <div class="monitor-card">
            <div class="monitor-card-header">
              <span class="monitor-card-title">数据库</span>
              <span class="monitor-status ${this.systemStatus.database.status}">
                ${this.systemStatus.database.status === "healthy" ? "● 正常" : "● 异常"}
              </span>
            </div>
            <div class="monitor-metric">
              <span class="monitor-metric-value">24</span>
              <span class="monitor-metric-unit">ms 响应</span>
            </div>
          </div>

          <div class="monitor-card">
            <div class="monitor-card-header">
              <span class="monitor-card-title">WebSocket</span>
              <span class="monitor-status ${this.wsConnected ? "healthy" : "warning"}">
                ${this.wsConnected ? "● 已连接" : "● 连接中"}
              </span>
            </div>
            <div class="monitor-metric">
              <span class="monitor-metric-value">${this.employees.filter((s) => s.status === "online").length}</span>
              <span class="monitor-metric-unit">在线用户</span>
            </div>
          </div>

          <div class="monitor-card" style="grid-column: span 3;">
            <div class="monitor-card-header">
              <span class="monitor-card-title">Agent 状态</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
              ${this.systemStatus.agents.map((s) => c`
                <div style="padding: 12px; background: var(--ll-bg-tertiary); border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="color: ${s.status === "busy" ? "var(--ll-warning)" : "var(--ll-success)"};">●</span>
                    <span style="font-weight: 600;">${s.name}</span>
                  </div>
                  <div style="font-size: 12px; color: var(--ll-text-secondary);">
                    ${s.currentTask || "空闲中"}
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    ` : c`<div>加载中...</div>`;
  }
  renderActionsView() {
    return c`
      <div class="view-container">
        <div class="content-header">
          <h1 class="content-title">快捷操作</h1>
          <p class="content-subtitle">常用功能快速入口</p>
        </div>
        <div class="actions-grid">
          ${[
      { id: "new-task", icon: "➕", title: "新建任务", desc: "创建新的工作任务" },
      { id: "new-meeting", icon: "📅", title: "预约会议", desc: "安排团队会议" },
      { id: "send-msg", icon: "💬", title: "发送消息", desc: "给团队成员发消息" },
      { id: "view-report", icon: "📊", title: "查看报表", desc: "查看数据报表" },
      { id: "settings", icon: "⚙️", title: "系统设置", desc: "配置系统参数" },
      { id: "help", icon: "❓", title: "帮助中心", desc: "获取使用帮助" }
    ].map((e) => c`
            <div class="action-card" @click=${() => this.handleAction(e.id)}>
              <div class="action-icon">${e.icon}</div>
              <div class="action-title">${e.title}</div>
              <div class="action-desc">${e.desc}</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
  handleAction(s) {
    console.log("执行操作:", s);
  }
  render() {
    return this.isLoading ? c`
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-text">灵笼看板加载中...</div>
        </div>
      ` : this.error ? c`
        <div class="error-overlay">
          <div class="error-icon">❌</div>
          <div class="error-title">加载失败</div>
          <div class="error-message">${this.error}</div>
          <button class="error-retry" @click=${() => this.loadInitialData()}>重试</button>
        </div>
      ` : c`
      <div class="dashboard">
        <linglong-header
          .currentView=${this.currentView}
          @view-change=${this.handleViewChange}
        ></linglong-header>
        
        <div class="dashboard-body">
          <linglong-sidebar
            ?collapsed=${this.sidebarCollapsed}
            .employees=${this.employees}
            @toggle-collapse=${this.handleSidebarToggle}
          ></linglong-sidebar>
          
          <main class="main-content">
            ${this.currentView === "organization" ? this.renderOrganizationView() : this.currentView === "kanban" ? this.renderKanbanView() : this.currentView === "monitor" ? this.renderMonitorView() : this.renderActionsView()}
          </main>
        </div>
      </div>
    `;
  }
};
g.styles = X`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .dashboard {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--ll-bg-primary);
    }

    .dashboard-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow: auto;
      padding: 24px;
      background: linear-gradient(135deg, var(--ll-bg-primary) 0%, var(--ll-primary-dark) 100%);
    }

    .content-header {
      margin-bottom: 24px;
    }

    .content-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--ll-text-primary);
      margin-bottom: 8px;
    }

    .content-subtitle {
      font-size: 14px;
      color: var(--ll-text-secondary);
    }

    .view-container {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 组织架构视图 */
    .org-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .org-card {
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .org-card:hover {
      border-color: var(--ll-accent);
      box-shadow: 0 0 20px rgba(237, 137, 54, 0.1);
    }

    .org-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .org-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .org-card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .org-card-count {
      font-size: 12px;
      color: var(--ll-text-secondary);
    }

    .org-members {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .org-member {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: var(--ll-bg-tertiary);
      border-radius: 20px;
      font-size: 12px;
    }

    .org-member-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--ll-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      color: white;
    }

    /* 任务看板视图 */
    .kanban-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      min-width: 800px;
    }

    .kanban-column {
      background: var(--ll-bg-secondary);
      border-radius: 12px;
      padding: 16px;
      min-height: 400px;
    }

    .kanban-column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--ll-border);
    }

    .kanban-column-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .kanban-column-count {
      padding: 2px 8px;
      background: var(--ll-bg-tertiary);
      border-radius: 10px;
      font-size: 12px;
      color: var(--ll-text-secondary);
    }

    .kanban-tasks {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .kanban-task {
      background: var(--ll-bg-tertiary);
      border: 1px solid var(--ll-border);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .kanban-task:hover {
      border-color: var(--ll-accent);
      transform: translateY(-2px);
    }

    .kanban-task-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--ll-text-primary);
      margin-bottom: 8px;
    }

    .kanban-task-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kanban-task-priority {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .kanban-task-priority.urgent {
      background: rgba(239, 68, 68, 0.2);
      color: var(--ll-error);
    }

    .kanban-task-priority.high {
      background: rgba(245, 158, 11, 0.2);
      color: var(--ll-warning);
    }

    .kanban-task-priority.medium {
      background: rgba(59, 130, 246, 0.2);
      color: var(--ll-info);
    }

    .kanban-task-priority.low {
      background: rgba(16, 185, 129, 0.2);
      color: var(--ll-success);
    }

    .kanban-task-assignee {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--ll-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
    }

    /* 监控视图 */
    .monitor-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .monitor-card {
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      padding: 20px;
    }

    .monitor-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .monitor-card-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .monitor-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .monitor-status.healthy {
      background: rgba(16, 185, 129, 0.1);
      color: var(--ll-success);
    }

    .monitor-status.warning {
      background: rgba(245, 158, 11, 0.1);
      color: var(--ll-warning);
    }

    .monitor-status.error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--ll-error);
    }

    .monitor-metric {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .monitor-metric-value {
      font-size: 32px;
      font-weight: 700;
      color: var(--ll-text-primary);
    }

    .monitor-metric-unit {
      font-size: 14px;
      color: var(--ll-text-secondary);
    }

    /* 快捷操作视图 */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      background: var(--ll-bg-secondary);
      border: 1px solid var(--ll-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      border-color: var(--ll-accent);
      background: var(--ll-bg-tertiary);
      transform: translateY(-4px);
      box-shadow: var(--ll-shadow-lg);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--ll-accent) 0%, var(--ll-accent-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: var(--ll-shadow-glow);
    }

    .action-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--ll-text-primary);
    }

    .action-desc {
      font-size: 12px;
      color: var(--ll-text-secondary);
      text-align: center;
    }

    /* 加载状态 */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--ll-bg-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 9999;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(237, 137, 54, 0.3);
      border-top-color: var(--ll-accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 14px;
      color: var(--ll-text-secondary);
    }

    /* 错误状态 */
    .error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--ll-bg-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 9999;
    }

    .error-icon {
      font-size: 64px;
    }

    .error-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--ll-error);
    }

    .error-message {
      font-size: 14px;
      color: var(--ll-text-secondary);
      max-width: 400px;
      text-align: center;
    }

    .error-retry {
      margin-top: 16px;
      padding: 10px 24px;
      background: var(--ll-accent);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .error-retry:hover {
      background: var(--ll-accent-light);
    }

    /* 响应式 */
    @media (max-width: 1200px) {
      .kanban-board {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .monitor-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
      
      .monitor-grid {
        grid-template-columns: 1fr;
      }
      
      .org-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
v([
  m()
], g.prototype, "currentView", 2);
v([
  m()
], g.prototype, "sidebarCollapsed", 2);
v([
  m()
], g.prototype, "employees", 2);
v([
  m()
], g.prototype, "tasks", 2);
v([
  m()
], g.prototype, "systemStatus", 2);
v([
  m()
], g.prototype, "notifications", 2);
v([
  m()
], g.prototype, "isLoading", 2);
v([
  m()
], g.prototype, "wsConnected", 2);
v([
  m()
], g.prototype, "error", 2);
g = v([
  ie("linglong-dashboard")
], g);
function me() {
  console.log("🐉 灵笼看板启动中...");
  const s = document.getElementById("app");
  if (!s) {
    console.error("找不到 #app 容器");
    return;
  }
  s.innerHTML = "";
  const e = document.createElement("linglong-dashboard");
  s.appendChild(e), console.log("✅ 灵笼看板已启动");
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", me) : me();
//# sourceMappingURL=linglong-dashboard.js.map

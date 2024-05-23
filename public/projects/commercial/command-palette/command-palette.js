class Ue {
  constructor() {
    this.reloadAfterRegistration = !1;
  }
  /**
   * Method called when the plugin is registered with a command palette.
   * 
   * @param {CommandPalette} palette - The command palette that the plugin is being registered with.
   */
  // @ts-ignore
  registered(e) {
  }
  /**
   * Method called when the plugin is unregistered from a command palette.
   * 
   * @param {CommandPalette} palette - The command palette that the plugin is being unregistered from.
   */
  // @ts-ignore
  unregistered(e) {
  }
  /**
   * Pre-render hook for processing items before rendering in the command palette.
   * @param items - An array of items to be processed.
   * @param palette - The command palette instance.
   * @returns An array of processed items.
   */
  // @ts-ignore
  preRender(e, t) {
    return e;
  }
  /**
   * Process an individual item before rendering in the command palette.
   * @param item - The item to be processed.
   * @param palette - The command palette instance.
   * @returns The processed item.
   */
  // @ts-ignore
  processItem(e, t) {
    return e;
  }
  /**
   * Post-render hook for processing the document fragment after rendering in the command palette.
   * @param fragment - The document fragment to be processed.
   * @param palette - The command palette instance.
   * @returns The processed document fragment.
   */
  // @ts-ignore
  postRender(e, t) {
    return e;
  }
}
function pe(a) {
  return a ? a.split(" ").map((t) => t[0].toUpperCase() + t.slice(1)).join("").replace(/[^a-zA-Z0-9]/g, "").replace(/\s/g, "") : "";
}
function ge(a, e) {
  const { name: t, tags: r, commandPrefix: n, items: i } = e, s = document.createElement("command-palette-item-group");
  return s.label = a, t && (s.name = t), r && (s.tags = r), n && (s.commandPrefix = n), i && s.addItems(i), s;
}
const G = {
  bubbles: !0,
  composed: !0
}, ye = new Event("palette-item-init", G), be = new Event("palette-item-connected", G), _e = new Event("palette-item-select", G), xe = new Event("palette-item-deselect", G), Ee = new Event("palette-item-register", G), k = class k extends HTMLElement {
  constructor() {
    super(), this._startContainer = document.createElement("div"), this._endContainer = document.createElement("div"), this._description = document.createElement("div"), this._iconSlot = document.createElement("slot"), this._shortcutSlot = document.createElement("slot"), this._descriptionSlot = document.createElement("slot"), this._textSlot = document.createElement("slot"), this._bindValueToSearch = !1, this._initialized = !1, this._registered = !1, Object.assign(this._startContainer, {
      part: "start",
      classList: ["start flex"]
    }), Object.assign(this._endContainer, {
      part: "end",
      classList: ["end flex"]
    }), Object.assign(this._description, {
      part: "description",
      slot: "description",
      classList: ["description"]
    }), this._configureSlots(), this._startContainer.append(
      this._iconSlot,
      this._textSlot
    ), this._endContainer.append(
      this._descriptionSlot,
      this._shortcutSlot
    ), this.attachShadow({ mode: "open" }), this.shadowRoot.append(
      this._startContainer,
      this._endContainer
    ), this.shadowRoot.adoptedStyleSheets.push(this.styleSheetCore);
  }
  connectedCallback() {
    this.addEventListener("mouseenter", this.handleMouseEnter), this.addEventListener("click", this.handleClick), this.part.add("item"), this.setAttribute("role", "option"), this.ariaSelected = "false", this.setAttribute("data-palette-item", ""), this.hasAttribute("description") && this.querySelector("slot[name=description]") === null && this.createDescription(), this._bindValueToSearch && this.setAttribute("bind-value-to-search", "");
    const e = this.querySelectorAll("[slot=shortcut]");
    for (const t of e) {
      const r = t.textContent, n = this.convertShortcutStringToElements(r);
      t.replaceChildren(...n);
    }
    this.handleInit(), this.handleConnected();
  }
  get shortcuts() {
    return this._shortcutSlot.assignedNodes();
  }
  get selected() {
    return this.getAttribute("aria-selected") === "true";
  }
  get startContainer() {
    return this._startContainer;
  }
  get bindValueToSearch() {
    return this._bindValueToSearch;
  }
  set bindValueToSearch(e) {
    e !== this._bindValueToSearch && (this._bindValueToSearch = e, e ? (this.setAttribute("bind-value-to-search", ""), this.addTag("search")) : (this.removeAttribute("bind-value-to-search"), this.removeTag("search")));
  }
  get initialized() {
    return this._initialized;
  }
  get registered() {
    return this._registered;
  }
  get endContainer() {
    return this._endContainer;
  }
  get startElements() {
    return this._startContainer.children;
  }
  get endElements() {
    return this._endContainer.children;
  }
  set selected(e) {
    e ? (this.ariaSelected = "true", this.setAttribute("selected", "")) : (this.ariaSelected = "false", this.removeAttribute("selected"));
  }
  addTo(e) {
    this._registered || !e || e.items.includes(this) || (e.addItem(this), this._registered = !0, this.dispatchEvent(k.registerEvent));
  }
  get excludeFromSearch() {
    return this.getAttribute("exclude") === "true" || this.hasAttribute("exclude");
  }
  set excludeFromSearch(e) {
    e ? this.setAttribute("exclude", "") : this.removeAttribute("exclude");
  }
  get tags() {
    var e;
    return ((e = this.getAttribute("tags")) == null ? void 0 : e.split(" ")) || [];
  }
  set tags(e) {
    e && (this.setAttribute("tags", e.join(" ").trim()), this.handleTagsChange());
  }
  addTag(e) {
    e && (this.tags = [...this.tags, e]);
  }
  addTags(e) {
    e && (this.tags = this.tags.concat(e));
  }
  removeTag(e) {
    e && (this.tags = this.tags.filter((t) => t !== e));
  }
  removeTags(e) {
    e && (this.tags = this.tags.filter((t) => !e.includes(t)));
  }
  get group() {
    return this.dataset.group || null;
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(e) {
    this.setAttribute("value", e);
  }
  get styleSheets() {
    return this.shadowRoot.adoptedStyleSheets;
  }
  addStyleSheet(e) {
    if (typeof e == "string") {
      const t = new CSSStyleSheet();
      t.replaceSync(e), e = t;
    }
    this.shadowRoot.adoptedStyleSheets.includes(e) || this.shadowRoot.adoptedStyleSheets.push(e);
  }
  removeStyleSheet(e) {
    this.shadowRoot.adoptedStyleSheets = this.shadowRoot.adoptedStyleSheets.filter((t) => t !== e);
  }
  set index(e) {
    e !== null && e >= -1 && this.setAttribute("data-id", e.toString());
  }
  get index() {
    const e = this.getAttribute("data-id");
    return e ? Number(e) : null;
  }
  get description() {
    var e;
    return this.getAttribute("description") || ((e = this.querySelector("[slot=description]")) == null ? void 0 : e.textContent) || "";
  }
  set description(e) {
    this.setAttribute("description", e);
  }
  get command() {
    return this.getAttribute("command") || pe(this.displayText) || "";
  }
  set command(e) {
    this.setAttribute("command", e);
  }
  get displayText() {
    return this._textSlot.assignedNodes({ flatten: !0 }).reduce((n, i) => n + (i.textContent || ""), "").trim().replace(/\s+/g, " ") || "";
  }
  get styleSheetCore() {
    const e = new CSSStyleSheet();
    return e.replaceSync(this._coreShadowStyleSheetString), e;
  }
  convertShortcutStringToElements(e) {
    return e.split(" ").map((r) => {
      if (r === "+") {
        const i = document.createElement("span");
        return i.textContent = "+";
      }
      const n = document.createElement("kbd");
      return n.textContent = r, n;
    });
  }
  createDescription() {
    this.getAttribute("description") && (Object.assign(this._description, {
      id: "description",
      classList: ["description"],
      slot: "description",
      textContent: this.description
    }), this.append(this._description));
  }
  get ignoreHighlight() {
    return this.dataset.ignoreHighlight === "true";
  }
  set ignoreHighlight(e) {
    e ? this.dataset.ignoreHighlight = "true" : delete this.dataset.ignoreHighlight;
  }
  highlight(...e) {
    e && (this.clearHighlights(), e.forEach((t) => this._highlightText(t)));
  }
  clearHighlights() {
    this.querySelectorAll("mark").forEach((e) => {
      const t = e.parentNode;
      t.replaceChild(document.createTextNode(e.textContent), e), t.normalize();
    });
  }
  _highlightText(e) {
    var o, u;
    if (!e)
      return;
    const t = document.createElement("mark");
    t.classList.add("highlight"), t.part.add("highlight");
    const r = [
      "mark",
      "style",
      "script",
      "template",
      "slot",
      "input",
      "textarea"
    ], n = {
      acceptNode: (l) => {
        let h = l.parentNode;
        for (; h && h !== this; ) {
          if (h.getAttribute && h.getAttribute("data-ignore-highlight") || r.includes(
            h.nodeName.toLowerCase()
          ))
            return NodeFilter.FILTER_REJECT;
          h = h.parentNode;
        }
        return l.nodeValue && l.nodeValue.toLowerCase().includes(e.toLowerCase()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }, i = document.createTreeWalker(
      this,
      NodeFilter.SHOW_TEXT,
      n
    );
    let s;
    for (; s = i.nextNode(); ) {
      let l = 0, h;
      for (; (h = s.nodeValue.toLowerCase().indexOf(
        e.toLowerCase(),
        l
      )) !== -1; ) {
        const c = s.parentNode === this, d = h > 0 && ((o = s.nodeValue) == null ? void 0 : o[h - 1]) === " " && c ? "0.5ch" : null, f = ((u = s.nodeValue) == null ? void 0 : u[h + e.length]) === " " && c ? "0.5ch" : null;
        Object.assign(t.style, { marginLeft: d, marginRight: f });
        const m = document.createRange();
        m.setStart(s, h), m.setEnd(s, h + e.length);
        const p = t.cloneNode(!0);
        if (m.surroundContents(p), l = h + e.length, s = i.nextNode(), !s)
          break;
      }
    }
  }
  updateDescription(e) {
    if (!e)
      return;
    this._descriptionSlot.contains(this._description) && (this._description.textContent = e);
  }
  handleClick() {
    this.dispatchEvent(
      new CustomEvent("palette-item-click", {
        detail: {
          command: this.command,
          groupName: this.group,
          value: this.value
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  handleMouseEnter() {
    this.dispatchEvent(k.selectEvent);
  }
  static get observedAttributes() {
    return [
      "description",
      "command",
      "tags",
      "exclude",
      "bind-value-to-search"
    ];
  }
  attributeChangedCallback(e, t, r) {
    if (!this._initialized)
      return;
    const i = {
      description: () => {
        this.updateDescription(r);
      },
      exclude: () => this.handleExcludeChange(t),
      command: () => this.handleCommandChange(),
      tags: () => this.handleTagsChange(),
      "bind-value-to-search": () => this.bindValueToSearch = r === "true" || r === ""
    }[e];
    i && i();
  }
  handleTagsChange() {
    this.dispatchEvent(
      new CustomEvent("palette-item-tags-change", {
        bubbles: !0,
        composed: !0
      })
    );
  }
  handleExcludeChange(e) {
    this.dispatchEvent(
      new CustomEvent("palette-item-exclude-change", {
        detail: {
          previous: e === "true" || e === null,
          exclude: this.excludeFromSearch
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  handleInit() {
    this._initialized || (this._initialized = !0, this.dispatchEvent(k.initEvent));
  }
  handleConnected() {
    this.dispatchEvent(k.connectedEvent);
  }
  get iconSlot() {
    return this._iconSlot;
  }
  get textSlot() {
    return this._textSlot;
  }
  get descriptionSlot() {
    return this._descriptionSlot;
  }
  get shortcutSlot() {
    return this._shortcutSlot;
  }
  _configureSlots() {
    Object.assign(this._iconSlot, {
      id: "icon",
      name: "icon"
    }), Object.assign(this._textSlot, {
      id: "text"
    }), Object.assign(this._descriptionSlot, {
      id: "description",
      name: "description"
    }), Object.assign(this._shortcutSlot, {
      id: "shortcut",
      name: "shortcut"
    });
  }
  handleCommandChange() {
    this.dispatchEvent(
      new CustomEvent("palette-item-command-change", {
        bubbles: !0,
        composed: !0
      })
    );
  }
  disconnectedCallback() {
    this.removeEventListener("mouseenter", this.handleMouseEnter), this.removeEventListener("click", this.handleClick);
  }
  get _coreShadowStyleSheetString() {
    return `
      :host {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        font-family: inherit;
        padding: 10px;
        cursor: pointer;
        background-color: var(--command-palette-item-bg, initial);
        user-select: none;
        text-overflow: ellipsis;
      }

      ::slotted([slot="description"]) {
        font-size: var(--command-palette-item-description-size, 16px);
        color: var(--command-palette-item-description-color, inherit);
        opacity: 0.65;
      }

      :host([aria-selected="true"]) {
        background-color: var(--command-palette-item-bg-selected, #f0f0f0);
      }

      :host([hidden]) {
        display: none !important;
      }

      [name=icon]:not(:empty) {
        font-size: var(--command-palette-item-icon-size, 20px);
      }

      ::slotted([slot="shortcut"]) {
        background-color: var(--command-palette-item-shortcut-background, rgba(0, 0, 0, 0.2));
        color: var(--command-palette-item-shortcut-color, inherit);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.2rem;
        padding: 0.1rem 0.4rem;
        border-radius: 0.2rem;
        font-size: var(--command-palette-item-shortcut-size, 0.75rem);
        margin-left: 8px;
      }

      .flex {
        display: flex;
        align-items: center;
      }
    `;
  }
};
k.initEvent = ye, k.connectedEvent = be, k.selectEvent = _e, k.deselectEvent = xe, k.registerEvent = Ee;
let H = k;
var z = function() {
  return z = Object.assign || function(e) {
    for (var t, r = 1, n = arguments.length; r < n; r++) {
      t = arguments[r];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, z.apply(this, arguments);
};
function Se(a, e, t, r) {
  function n(i) {
    return i instanceof t ? i : new t(function(s) {
      s(i);
    });
  }
  return new (t || (t = Promise))(function(i, s) {
    function o(h) {
      try {
        l(r.next(h));
      } catch (c) {
        s(c);
      }
    }
    function u(h) {
      try {
        l(r.throw(h));
      } catch (c) {
        s(c);
      }
    }
    function l(h) {
      h.done ? i(h.value) : n(h.value).then(o, u);
    }
    l((r = r.apply(a, e || [])).next());
  });
}
function we(a, e) {
  var t = { label: 0, sent: function() {
    if (i[0] & 1)
      throw i[1];
    return i[1];
  }, trys: [], ops: [] }, r, n, i, s;
  return s = { next: o(0), throw: o(1), return: o(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function o(l) {
    return function(h) {
      return u([l, h]);
    };
  }
  function u(l) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; s && (s = 0, l[0] && (t = 0)), t; )
      try {
        if (r = 1, n && (i = l[0] & 2 ? n.return : l[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, l[1])).done)
          return i;
        switch (n = 0, i && (l = [l[0] & 2, i.value]), l[0]) {
          case 0:
          case 1:
            i = l;
            break;
          case 4:
            return t.label++, { value: l[1], done: !1 };
          case 5:
            t.label++, n = l[1], l = [0];
            continue;
          case 7:
            l = t.ops.pop(), t.trys.pop();
            continue;
          default:
            if (i = t.trys, !(i = i.length > 0 && i[i.length - 1]) && (l[0] === 6 || l[0] === 2)) {
              t = 0;
              continue;
            }
            if (l[0] === 3 && (!i || l[1] > i[0] && l[1] < i[3])) {
              t.label = l[1];
              break;
            }
            if (l[0] === 6 && t.label < i[1]) {
              t.label = i[1], i = l;
              break;
            }
            if (i && t.label < i[2]) {
              t.label = i[2], t.ops.push(l);
              break;
            }
            i[2] && t.ops.pop(), t.trys.pop();
            continue;
        }
        l = e.call(a, t);
      } catch (h) {
        l = [6, h], n = 0;
      } finally {
        r = i = 0;
      }
    if (l[0] & 5)
      throw l[1];
    return { value: l[0] ? l[1] : void 0, done: !0 };
  }
}
function b(a) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && a[e], r = 0;
  if (t)
    return t.call(a);
  if (a && typeof a.length == "number")
    return {
      next: function() {
        return a && r >= a.length && (a = void 0), { value: a && a[r++], done: !a };
      }
    };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function V(a, e) {
  var t = typeof Symbol == "function" && a[Symbol.iterator];
  if (!t)
    return a;
  var r = t.call(a), n, i = [], s;
  try {
    for (; (e === void 0 || e-- > 0) && !(n = r.next()).done; )
      i.push(n.value);
  } catch (o) {
    s = { error: o };
  } finally {
    try {
      n && !n.done && (t = r.return) && t.call(r);
    } finally {
      if (s)
        throw s.error;
    }
  }
  return i;
}
var Fe = "ENTRIES", le = "KEYS", he = "VALUES", O = "", q = (
  /** @class */
  function() {
    function a(e, t) {
      var r = e._tree, n = Array.from(r.keys());
      this.set = e, this._type = t, this._path = n.length > 0 ? [{ node: r, keys: n }] : [];
    }
    return a.prototype.next = function() {
      var e = this.dive();
      return this.backtrack(), e;
    }, a.prototype.dive = function() {
      if (this._path.length === 0)
        return { done: !0, value: void 0 };
      var e = W(this._path), t = e.node, r = e.keys;
      if (W(r) === O)
        return { done: !1, value: this.result() };
      var n = t.get(W(r));
      return this._path.push({ node: n, keys: Array.from(n.keys()) }), this.dive();
    }, a.prototype.backtrack = function() {
      if (this._path.length !== 0) {
        var e = W(this._path).keys;
        e.pop(), !(e.length > 0) && (this._path.pop(), this.backtrack());
      }
    }, a.prototype.key = function() {
      return this.set._prefix + this._path.map(function(e) {
        var t = e.keys;
        return W(t);
      }).filter(function(e) {
        return e !== O;
      }).join("");
    }, a.prototype.value = function() {
      return W(this._path).node.get(O);
    }, a.prototype.result = function() {
      switch (this._type) {
        case he:
          return this.value();
        case le:
          return this.key();
        default:
          return [this.key(), this.value()];
      }
    }, a.prototype[Symbol.iterator] = function() {
      return this;
    }, a;
  }()
), W = function(a) {
  return a[a.length - 1];
}, Ce = function(a, e, t) {
  var r = /* @__PURE__ */ new Map();
  if (e === void 0)
    return r;
  for (var n = e.length + 1, i = n + t, s = new Uint8Array(i * n).fill(t + 1), o = 0; o < n; ++o)
    s[o] = o;
  for (var u = 1; u < i; ++u)
    s[u * n] = u;
  return ce(a, e, t, r, s, 1, n, ""), r;
}, ce = function(a, e, t, r, n, i, s, o) {
  var u, l, h = i * s;
  try {
    e:
      for (var c = b(a.keys()), d = c.next(); !d.done; d = c.next()) {
        var f = d.value;
        if (f === O) {
          var m = n[h - 1];
          m <= t && r.set(o, [a.get(f), m]);
        } else {
          for (var p = i, v = 0; v < f.length; ++v, ++p) {
            for (var y = f[v], _ = s * p, g = _ - s, w = n[_], F = Math.max(0, p - t - 1), L = Math.min(s - 1, p + t), x = F; x < L; ++x) {
              var S = y !== e[x], C = n[g + x] + +S, A = n[g + x + 1] + 1, T = n[_ + x] + 1, E = n[_ + x + 1] = Math.min(C, A, T);
              E < w && (w = E);
            }
            if (w > t)
              continue e;
          }
          ce(a.get(f), e, t, r, n, p, s, o + f);
        }
      }
  } catch (D) {
    u = { error: D };
  } finally {
    try {
      d && !d.done && (l = c.return) && l.call(c);
    } finally {
      if (u)
        throw u.error;
    }
  }
}, K = (
  /** @class */
  function() {
    function a(e, t) {
      e === void 0 && (e = /* @__PURE__ */ new Map()), t === void 0 && (t = ""), this._size = void 0, this._tree = e, this._prefix = t;
    }
    return a.prototype.atPrefix = function(e) {
      var t, r;
      if (!e.startsWith(this._prefix))
        throw new Error("Mismatched prefix");
      var n = V(Q(this._tree, e.slice(this._prefix.length)), 2), i = n[0], s = n[1];
      if (i === void 0) {
        var o = V(ie(s), 2), u = o[0], l = o[1];
        try {
          for (var h = b(u.keys()), c = h.next(); !c.done; c = h.next()) {
            var d = c.value;
            if (d !== O && d.startsWith(l)) {
              var f = /* @__PURE__ */ new Map();
              return f.set(d.slice(l.length), u.get(d)), new a(f, e);
            }
          }
        } catch (m) {
          t = { error: m };
        } finally {
          try {
            c && !c.done && (r = h.return) && r.call(h);
          } finally {
            if (t)
              throw t.error;
          }
        }
      }
      return new a(i, e);
    }, a.prototype.clear = function() {
      this._size = void 0, this._tree.clear();
    }, a.prototype.delete = function(e) {
      return this._size = void 0, Ae(this._tree, e);
    }, a.prototype.entries = function() {
      return new q(this, Fe);
    }, a.prototype.forEach = function(e) {
      var t, r;
      try {
        for (var n = b(this), i = n.next(); !i.done; i = n.next()) {
          var s = V(i.value, 2), o = s[0], u = s[1];
          e(o, u, this);
        }
      } catch (l) {
        t = { error: l };
      } finally {
        try {
          i && !i.done && (r = n.return) && r.call(n);
        } finally {
          if (t)
            throw t.error;
        }
      }
    }, a.prototype.fuzzyGet = function(e, t) {
      return Ce(this._tree, e, t);
    }, a.prototype.get = function(e) {
      var t = ee(this._tree, e);
      return t !== void 0 ? t.get(O) : void 0;
    }, a.prototype.has = function(e) {
      var t = ee(this._tree, e);
      return t !== void 0 && t.has(O);
    }, a.prototype.keys = function() {
      return new q(this, le);
    }, a.prototype.set = function(e, t) {
      if (typeof e != "string")
        throw new Error("key must be a string");
      this._size = void 0;
      var r = $(this._tree, e);
      return r.set(O, t), this;
    }, Object.defineProperty(a.prototype, "size", {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
       */
      get: function() {
        if (this._size)
          return this._size;
        this._size = 0;
        for (var e = this.entries(); !e.next().done; )
          this._size += 1;
        return this._size;
      },
      enumerable: !1,
      configurable: !0
    }), a.prototype.update = function(e, t) {
      if (typeof e != "string")
        throw new Error("key must be a string");
      this._size = void 0;
      var r = $(this._tree, e);
      return r.set(O, t(r.get(O))), this;
    }, a.prototype.fetch = function(e, t) {
      if (typeof e != "string")
        throw new Error("key must be a string");
      this._size = void 0;
      var r = $(this._tree, e), n = r.get(O);
      return n === void 0 && r.set(O, n = t()), n;
    }, a.prototype.values = function() {
      return new q(this, he);
    }, a.prototype[Symbol.iterator] = function() {
      return this.entries();
    }, a.from = function(e) {
      var t, r, n = new a();
      try {
        for (var i = b(e), s = i.next(); !s.done; s = i.next()) {
          var o = V(s.value, 2), u = o[0], l = o[1];
          n.set(u, l);
        }
      } catch (h) {
        t = { error: h };
      } finally {
        try {
          s && !s.done && (r = i.return) && r.call(i);
        } finally {
          if (t)
            throw t.error;
        }
      }
      return n;
    }, a.fromObject = function(e) {
      return a.from(Object.entries(e));
    }, a;
  }()
), Q = function(a, e, t) {
  var r, n;
  if (t === void 0 && (t = []), e.length === 0 || a == null)
    return [a, t];
  try {
    for (var i = b(a.keys()), s = i.next(); !s.done; s = i.next()) {
      var o = s.value;
      if (o !== O && e.startsWith(o))
        return t.push([a, o]), Q(a.get(o), e.slice(o.length), t);
    }
  } catch (u) {
    r = { error: u };
  } finally {
    try {
      s && !s.done && (n = i.return) && n.call(i);
    } finally {
      if (r)
        throw r.error;
    }
  }
  return t.push([a, e]), Q(void 0, "", t);
}, ee = function(a, e) {
  var t, r;
  if (e.length === 0 || a == null)
    return a;
  try {
    for (var n = b(a.keys()), i = n.next(); !i.done; i = n.next()) {
      var s = i.value;
      if (s !== O && e.startsWith(s))
        return ee(a.get(s), e.slice(s.length));
    }
  } catch (o) {
    t = { error: o };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (t)
        throw t.error;
    }
  }
}, $ = function(a, e) {
  var t, r, n = e.length;
  e:
    for (var i = 0; a && i < n; ) {
      try {
        for (var s = (t = void 0, b(a.keys())), o = s.next(); !o.done; o = s.next()) {
          var u = o.value;
          if (u !== O && e[i] === u[0]) {
            for (var l = Math.min(n - i, u.length), h = 1; h < l && e[i + h] === u[h]; )
              ++h;
            var c = a.get(u);
            if (h === u.length)
              a = c;
            else {
              var d = /* @__PURE__ */ new Map();
              d.set(u.slice(h), c), a.set(e.slice(i, i + h), d), a.delete(u), a = d;
            }
            i += h;
            continue e;
          }
        }
      } catch (m) {
        t = { error: m };
      } finally {
        try {
          o && !o.done && (r = s.return) && r.call(s);
        } finally {
          if (t)
            throw t.error;
        }
      }
      var f = /* @__PURE__ */ new Map();
      return a.set(e.slice(i), f), f;
    }
  return a;
}, Ae = function(a, e) {
  var t = V(Q(a, e), 2), r = t[0], n = t[1];
  if (r !== void 0) {
    if (r.delete(O), r.size === 0)
      de(n);
    else if (r.size === 1) {
      var i = V(r.entries().next().value, 2), s = i[0], o = i[1];
      fe(n, s, o);
    }
  }
}, de = function(a) {
  if (a.length !== 0) {
    var e = V(ie(a), 2), t = e[0], r = e[1];
    if (t.delete(r), t.size === 0)
      de(a.slice(0, -1));
    else if (t.size === 1) {
      var n = V(t.entries().next().value, 2), i = n[0], s = n[1];
      i !== O && fe(a.slice(0, -1), i, s);
    }
  }
}, fe = function(a, e, t) {
  if (a.length !== 0) {
    var r = V(ie(a), 2), n = r[0], i = r[1];
    n.set(i + e, t), n.delete(i);
  }
}, ie = function(a) {
  return a[a.length - 1];
}, j, ne = "or", me = "and", Ie = "and_not", ze = (
  /** @class */
  function() {
    function a(e) {
      if ((e == null ? void 0 : e.fields) == null)
        throw new Error('MiniSearch: option "fields" must be provided');
      var t = e.autoVacuum == null || e.autoVacuum === !0 ? Z : e.autoVacuum;
      this._options = z(z(z({}, X), e), { autoVacuum: t, searchOptions: z(z({}, ae), e.searchOptions || {}), autoSuggestOptions: z(z({}, Oe), e.autoSuggestOptions || {}) }), this._index = new K(), this._documentCount = 0, this._documentIds = /* @__PURE__ */ new Map(), this._idToShortId = /* @__PURE__ */ new Map(), this._fieldIds = {}, this._fieldLength = /* @__PURE__ */ new Map(), this._avgFieldLength = [], this._nextId = 0, this._storedFields = /* @__PURE__ */ new Map(), this._dirtCount = 0, this._currentVacuum = null, this._enqueuedVacuum = null, this._enqueuedVacuumConditions = re, this.addFields(this._options.fields);
    }
    return a.prototype.add = function(e) {
      var t, r, n, i, s, o, u = this._options, l = u.extractField, h = u.tokenize, c = u.processTerm, d = u.fields, f = u.idField, m = l(e, f);
      if (m == null)
        throw new Error('MiniSearch: document does not have ID field "'.concat(f, '"'));
      if (this._idToShortId.has(m))
        throw new Error("MiniSearch: duplicate ID ".concat(m));
      var p = this.addDocumentId(m);
      this.saveStoredFields(p, e);
      try {
        for (var v = b(d), y = v.next(); !y.done; y = v.next()) {
          var _ = y.value, g = l(e, _);
          if (g != null) {
            var w = h(g.toString(), _), F = this._fieldIds[_], L = new Set(w).size;
            this.addFieldLength(p, F, this._documentCount - 1, L);
            try {
              for (var x = (n = void 0, b(w)), S = x.next(); !S.done; S = x.next()) {
                var C = S.value, A = c(C, _);
                if (Array.isArray(A))
                  try {
                    for (var T = (s = void 0, b(A)), E = T.next(); !E.done; E = T.next()) {
                      var D = E.value;
                      this.addTerm(F, p, D);
                    }
                  } catch (I) {
                    s = { error: I };
                  } finally {
                    try {
                      E && !E.done && (o = T.return) && o.call(T);
                    } finally {
                      if (s)
                        throw s.error;
                    }
                  }
                else
                  A && this.addTerm(F, p, A);
              }
            } catch (I) {
              n = { error: I };
            } finally {
              try {
                S && !S.done && (i = x.return) && i.call(x);
              } finally {
                if (n)
                  throw n.error;
              }
            }
          }
        }
      } catch (I) {
        t = { error: I };
      } finally {
        try {
          y && !y.done && (r = v.return) && r.call(v);
        } finally {
          if (t)
            throw t.error;
        }
      }
    }, a.prototype.addAll = function(e) {
      var t, r;
      try {
        for (var n = b(e), i = n.next(); !i.done; i = n.next()) {
          var s = i.value;
          this.add(s);
        }
      } catch (o) {
        t = { error: o };
      } finally {
        try {
          i && !i.done && (r = n.return) && r.call(n);
        } finally {
          if (t)
            throw t.error;
        }
      }
    }, a.prototype.addAllAsync = function(e, t) {
      var r = this;
      t === void 0 && (t = {});
      var n = t.chunkSize, i = n === void 0 ? 10 : n, s = { chunk: [], promise: Promise.resolve() }, o = e.reduce(function(h, c, d) {
        var f = h.chunk, m = h.promise;
        return f.push(c), (d + 1) % i === 0 ? {
          chunk: [],
          promise: m.then(function() {
            return new Promise(function(p) {
              return setTimeout(p, 0);
            });
          }).then(function() {
            return r.addAll(f);
          })
        } : { chunk: f, promise: m };
      }, s), u = o.chunk, l = o.promise;
      return l.then(function() {
        return r.addAll(u);
      });
    }, a.prototype.remove = function(e) {
      var t, r, n, i, s, o, u = this._options, l = u.tokenize, h = u.processTerm, c = u.extractField, d = u.fields, f = u.idField, m = c(e, f);
      if (m == null)
        throw new Error('MiniSearch: document does not have ID field "'.concat(f, '"'));
      var p = this._idToShortId.get(m);
      if (p == null)
        throw new Error("MiniSearch: cannot remove document with ID ".concat(m, ": it is not in the index"));
      try {
        for (var v = b(d), y = v.next(); !y.done; y = v.next()) {
          var _ = y.value, g = c(e, _);
          if (g != null) {
            var w = l(g.toString(), _), F = this._fieldIds[_], L = new Set(w).size;
            this.removeFieldLength(p, F, this._documentCount, L);
            try {
              for (var x = (n = void 0, b(w)), S = x.next(); !S.done; S = x.next()) {
                var C = S.value, A = h(C, _);
                if (Array.isArray(A))
                  try {
                    for (var T = (s = void 0, b(A)), E = T.next(); !E.done; E = T.next()) {
                      var D = E.value;
                      this.removeTerm(F, p, D);
                    }
                  } catch (I) {
                    s = { error: I };
                  } finally {
                    try {
                      E && !E.done && (o = T.return) && o.call(T);
                    } finally {
                      if (s)
                        throw s.error;
                    }
                  }
                else
                  A && this.removeTerm(F, p, A);
              }
            } catch (I) {
              n = { error: I };
            } finally {
              try {
                S && !S.done && (i = x.return) && i.call(x);
              } finally {
                if (n)
                  throw n.error;
              }
            }
          }
        }
      } catch (I) {
        t = { error: I };
      } finally {
        try {
          y && !y.done && (r = v.return) && r.call(v);
        } finally {
          if (t)
            throw t.error;
        }
      }
      this._storedFields.delete(p), this._documentIds.delete(p), this._idToShortId.delete(m), this._fieldLength.delete(p), this._documentCount -= 1;
    }, a.prototype.removeAll = function(e) {
      var t, r;
      if (e)
        try {
          for (var n = b(e), i = n.next(); !i.done; i = n.next()) {
            var s = i.value;
            this.remove(s);
          }
        } catch (o) {
          t = { error: o };
        } finally {
          try {
            i && !i.done && (r = n.return) && r.call(n);
          } finally {
            if (t)
              throw t.error;
          }
        }
      else {
        if (arguments.length > 0)
          throw new Error("Expected documents to be present. Omit the argument to remove all documents.");
        this._index = new K(), this._documentCount = 0, this._documentIds = /* @__PURE__ */ new Map(), this._idToShortId = /* @__PURE__ */ new Map(), this._fieldLength = /* @__PURE__ */ new Map(), this._avgFieldLength = [], this._storedFields = /* @__PURE__ */ new Map(), this._nextId = 0;
      }
    }, a.prototype.discard = function(e) {
      var t = this, r = this._idToShortId.get(e);
      if (r == null)
        throw new Error("MiniSearch: cannot discard document with ID ".concat(e, ": it is not in the index"));
      this._idToShortId.delete(e), this._documentIds.delete(r), this._storedFields.delete(r), (this._fieldLength.get(r) || []).forEach(function(n, i) {
        t.removeFieldLength(r, i, t._documentCount, n);
      }), this._fieldLength.delete(r), this._documentCount -= 1, this._dirtCount += 1, this.maybeAutoVacuum();
    }, a.prototype.maybeAutoVacuum = function() {
      if (this._options.autoVacuum !== !1) {
        var e = this._options.autoVacuum, t = e.minDirtFactor, r = e.minDirtCount, n = e.batchSize, i = e.batchWait;
        this.conditionalVacuum({ batchSize: n, batchWait: i }, { minDirtCount: r, minDirtFactor: t });
      }
    }, a.prototype.discardAll = function(e) {
      var t, r, n = this._options.autoVacuum;
      try {
        this._options.autoVacuum = !1;
        try {
          for (var i = b(e), s = i.next(); !s.done; s = i.next()) {
            var o = s.value;
            this.discard(o);
          }
        } catch (u) {
          t = { error: u };
        } finally {
          try {
            s && !s.done && (r = i.return) && r.call(i);
          } finally {
            if (t)
              throw t.error;
          }
        }
      } finally {
        this._options.autoVacuum = n;
      }
      this.maybeAutoVacuum();
    }, a.prototype.replace = function(e) {
      var t = this._options, r = t.idField, n = t.extractField, i = n(e, r);
      this.discard(i), this.add(e);
    }, a.prototype.vacuum = function(e) {
      return e === void 0 && (e = {}), this.conditionalVacuum(e);
    }, a.prototype.conditionalVacuum = function(e, t) {
      var r = this;
      return this._currentVacuum ? (this._enqueuedVacuumConditions = this._enqueuedVacuumConditions && t, this._enqueuedVacuum != null ? this._enqueuedVacuum : (this._enqueuedVacuum = this._currentVacuum.then(function() {
        var n = r._enqueuedVacuumConditions;
        return r._enqueuedVacuumConditions = re, r.performVacuuming(e, n);
      }), this._enqueuedVacuum)) : this.vacuumConditionsMet(t) === !1 ? Promise.resolve() : (this._currentVacuum = this.performVacuuming(e), this._currentVacuum);
    }, a.prototype.performVacuuming = function(e, t) {
      return Se(this, void 0, void 0, function() {
        var r, n, i, s, o, u, l, h, c, d, f, m, p, v, y, _, g, w, F, L, x, S, C, A, T;
        return we(this, function(E) {
          switch (E.label) {
            case 0:
              if (r = this._dirtCount, !this.vacuumConditionsMet(t))
                return [3, 10];
              n = e.batchSize || te.batchSize, i = e.batchWait || te.batchWait, s = 1, E.label = 1;
            case 1:
              E.trys.push([1, 7, 8, 9]), o = b(this._index), u = o.next(), E.label = 2;
            case 2:
              if (u.done)
                return [3, 6];
              l = V(u.value, 2), h = l[0], c = l[1];
              try {
                for (d = (S = void 0, b(c)), f = d.next(); !f.done; f = d.next()) {
                  m = V(f.value, 2), p = m[0], v = m[1];
                  try {
                    for (y = (A = void 0, b(v)), _ = y.next(); !_.done; _ = y.next())
                      g = V(_.value, 1), w = g[0], !this._documentIds.has(w) && (v.size <= 1 ? c.delete(p) : v.delete(w));
                  } catch (D) {
                    A = { error: D };
                  } finally {
                    try {
                      _ && !_.done && (T = y.return) && T.call(y);
                    } finally {
                      if (A)
                        throw A.error;
                    }
                  }
                }
              } catch (D) {
                S = { error: D };
              } finally {
                try {
                  f && !f.done && (C = d.return) && C.call(d);
                } finally {
                  if (S)
                    throw S.error;
                }
              }
              return this._index.get(h).size === 0 && this._index.delete(h), s % n !== 0 ? [3, 4] : [4, new Promise(function(D) {
                return setTimeout(D, i);
              })];
            case 3:
              E.sent(), E.label = 4;
            case 4:
              s += 1, E.label = 5;
            case 5:
              return u = o.next(), [3, 2];
            case 6:
              return [3, 9];
            case 7:
              return F = E.sent(), L = { error: F }, [3, 9];
            case 8:
              try {
                u && !u.done && (x = o.return) && x.call(o);
              } finally {
                if (L)
                  throw L.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 9:
              this._dirtCount -= r, E.label = 10;
            case 10:
              return [4, null];
            case 11:
              return E.sent(), this._currentVacuum = this._enqueuedVacuum, this._enqueuedVacuum = null, [
                2
                /*return*/
              ];
          }
        });
      });
    }, a.prototype.vacuumConditionsMet = function(e) {
      if (e == null)
        return !0;
      var t = e.minDirtCount, r = e.minDirtFactor;
      return t = t || Z.minDirtCount, r = r || Z.minDirtFactor, this.dirtCount >= t && this.dirtFactor >= r;
    }, Object.defineProperty(a.prototype, "isVacuuming", {
      /**
       * Is `true` if a vacuuming operation is ongoing, `false` otherwise
       */
      get: function() {
        return this._currentVacuum != null;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(a.prototype, "dirtCount", {
      /**
       * The number of documents discarded since the most recent vacuuming
       */
      get: function() {
        return this._dirtCount;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(a.prototype, "dirtFactor", {
      /**
       * A number between 0 and 1 giving an indication about the proportion of
       * documents that are discarded, and can therefore be cleaned up by vacuuming.
       * A value close to 0 means that the index is relatively clean, while a higher
       * value means that the index is relatively dirty, and vacuuming could release
       * memory.
       */
      get: function() {
        return this._dirtCount / (1 + this._documentCount + this._dirtCount);
      },
      enumerable: !1,
      configurable: !0
    }), a.prototype.has = function(e) {
      return this._idToShortId.has(e);
    }, a.prototype.getStoredFields = function(e) {
      var t = this._idToShortId.get(e);
      if (t != null)
        return this._storedFields.get(t);
    }, a.prototype.search = function(e, t) {
      var r, n;
      t === void 0 && (t = {});
      var i = this.executeQuery(e, t), s = [];
      try {
        for (var o = b(i), u = o.next(); !u.done; u = o.next()) {
          var l = V(u.value, 2), h = l[0], c = l[1], d = c.score, f = c.terms, m = c.match, p = f.length || 1, v = {
            id: this._documentIds.get(h),
            score: d * p,
            terms: Object.keys(m),
            queryTerms: f,
            match: m
          };
          Object.assign(v, this._storedFields.get(h)), (t.filter == null || t.filter(v)) && s.push(v);
        }
      } catch (y) {
        r = { error: y };
      } finally {
        try {
          u && !u.done && (n = o.return) && n.call(o);
        } finally {
          if (r)
            throw r.error;
        }
      }
      return e === a.wildcard && t.boostDocument == null && this._options.searchOptions.boostDocument == null || s.sort(oe), s;
    }, a.prototype.autoSuggest = function(e, t) {
      var r, n, i, s;
      t === void 0 && (t = {}), t = z(z({}, this._options.autoSuggestOptions), t);
      var o = /* @__PURE__ */ new Map();
      try {
        for (var u = b(this.search(e, t)), l = u.next(); !l.done; l = u.next()) {
          var h = l.value, c = h.score, d = h.terms, f = d.join(" "), m = o.get(f);
          m != null ? (m.score += c, m.count += 1) : o.set(f, { score: c, terms: d, count: 1 });
        }
      } catch (F) {
        r = { error: F };
      } finally {
        try {
          l && !l.done && (n = u.return) && n.call(u);
        } finally {
          if (r)
            throw r.error;
        }
      }
      var p = [];
      try {
        for (var v = b(o), y = v.next(); !y.done; y = v.next()) {
          var _ = V(y.value, 2), m = _[0], g = _[1], c = g.score, d = g.terms, w = g.count;
          p.push({ suggestion: m, terms: d, score: c / w });
        }
      } catch (F) {
        i = { error: F };
      } finally {
        try {
          y && !y.done && (s = v.return) && s.call(v);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return p.sort(oe), p;
    }, Object.defineProperty(a.prototype, "documentCount", {
      /**
       * Total number of documents available to search
       */
      get: function() {
        return this._documentCount;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(a.prototype, "termCount", {
      /**
       * Number of terms in the index
       */
      get: function() {
        return this._index.size;
      },
      enumerable: !1,
      configurable: !0
    }), a.loadJSON = function(e, t) {
      if (t == null)
        throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
      return this.loadJS(JSON.parse(e), t);
    }, a.getDefault = function(e) {
      if (X.hasOwnProperty(e))
        return Y(X, e);
      throw new Error('MiniSearch: unknown option "'.concat(e, '"'));
    }, a.loadJS = function(e, t) {
      var r, n, i, s, o, u, l = e.index, h = e.documentCount, c = e.nextId, d = e.documentIds, f = e.fieldIds, m = e.fieldLength, p = e.averageFieldLength, v = e.storedFields, y = e.dirtCount, _ = e.serializationVersion;
      if (_ !== 1 && _ !== 2)
        throw new Error("MiniSearch: cannot deserialize an index created with an incompatible version");
      var g = new a(t);
      g._documentCount = h, g._nextId = c, g._documentIds = U(d), g._idToShortId = /* @__PURE__ */ new Map(), g._fieldIds = f, g._fieldLength = U(m), g._avgFieldLength = p, g._storedFields = U(v), g._dirtCount = y || 0, g._index = new K();
      try {
        for (var w = b(g._documentIds), F = w.next(); !F.done; F = w.next()) {
          var L = V(F.value, 2), x = L[0], S = L[1];
          g._idToShortId.set(S, x);
        }
      } catch (R) {
        r = { error: R };
      } finally {
        try {
          F && !F.done && (n = w.return) && n.call(w);
        } finally {
          if (r)
            throw r.error;
        }
      }
      try {
        for (var C = b(l), A = C.next(); !A.done; A = C.next()) {
          var T = V(A.value, 2), E = T[0], D = T[1], I = /* @__PURE__ */ new Map();
          try {
            for (var P = (o = void 0, b(Object.keys(D))), M = P.next(); !M.done; M = P.next()) {
              var N = M.value, B = D[N];
              _ === 1 && (B = B.ds), I.set(parseInt(N, 10), U(B));
            }
          } catch (R) {
            o = { error: R };
          } finally {
            try {
              M && !M.done && (u = P.return) && u.call(P);
            } finally {
              if (o)
                throw o.error;
            }
          }
          g._index.set(E, I);
        }
      } catch (R) {
        i = { error: R };
      } finally {
        try {
          A && !A.done && (s = C.return) && s.call(C);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return g;
    }, a.prototype.executeQuery = function(e, t) {
      var r = this;
      if (t === void 0 && (t = {}), e === a.wildcard)
        return this.executeWildcardQuery(t);
      if (typeof e != "string") {
        var n = z(z(z({}, t), e), { queries: void 0 }), i = e.queries.map(function(v) {
          return r.executeQuery(v, n);
        });
        return this.combineResults(i, n.combineWith);
      }
      var s = this._options, o = s.tokenize, u = s.processTerm, l = s.searchOptions, h = z(z({ tokenize: o, processTerm: u }, l), t), c = h.tokenize, d = h.processTerm, f = c(e).flatMap(function(v) {
        return d(v);
      }).filter(function(v) {
        return !!v;
      }), m = f.map(Ve(h)), p = m.map(function(v) {
        return r.executeQuerySpec(v, h);
      });
      return this.combineResults(p, h.combineWith);
    }, a.prototype.executeQuerySpec = function(e, t) {
      var r, n, i, s, o = z(z({}, this._options.searchOptions), t), u = (o.fields || this._options.fields).reduce(function(N, B) {
        var R;
        return z(z({}, N), (R = {}, R[B] = Y(o.boost, B) || 1, R));
      }, {}), l = o.boostDocument, h = o.weights, c = o.maxFuzzy, d = o.bm25, f = z(z({}, ae.weights), h), m = f.fuzzy, p = f.prefix, v = this._index.get(e.term), y = this.termResults(e.term, e.term, 1, v, u, l, d), _, g;
      if (e.prefix && (_ = this._index.atPrefix(e.term)), e.fuzzy) {
        var w = e.fuzzy === !0 ? 0.2 : e.fuzzy, F = w < 1 ? Math.min(c, Math.round(e.term.length * w)) : w;
        F && (g = this._index.fuzzyGet(e.term, F));
      }
      if (_)
        try {
          for (var L = b(_), x = L.next(); !x.done; x = L.next()) {
            var S = V(x.value, 2), C = S[0], A = S[1], T = C.length - e.term.length;
            if (T) {
              g == null || g.delete(C);
              var E = p * C.length / (C.length + 0.3 * T);
              this.termResults(e.term, C, E, A, u, l, d, y);
            }
          }
        } catch (N) {
          r = { error: N };
        } finally {
          try {
            x && !x.done && (n = L.return) && n.call(L);
          } finally {
            if (r)
              throw r.error;
          }
        }
      if (g)
        try {
          for (var D = b(g.keys()), I = D.next(); !I.done; I = D.next()) {
            var C = I.value, P = V(g.get(C), 2), M = P[0], T = P[1];
            if (T) {
              var E = m * C.length / (C.length + T);
              this.termResults(e.term, C, E, M, u, l, d, y);
            }
          }
        } catch (N) {
          i = { error: N };
        } finally {
          try {
            I && !I.done && (s = D.return) && s.call(D);
          } finally {
            if (i)
              throw i.error;
          }
        }
      return y;
    }, a.prototype.executeWildcardQuery = function(e) {
      var t, r, n = /* @__PURE__ */ new Map(), i = z(z({}, this._options.searchOptions), e);
      try {
        for (var s = b(this._documentIds), o = s.next(); !o.done; o = s.next()) {
          var u = V(o.value, 2), l = u[0], h = u[1], c = i.boostDocument ? i.boostDocument(h, "", this._storedFields.get(l)) : 1;
          n.set(l, {
            score: c,
            terms: [],
            match: {}
          });
        }
      } catch (d) {
        t = { error: d };
      } finally {
        try {
          o && !o.done && (r = s.return) && r.call(s);
        } finally {
          if (t)
            throw t.error;
        }
      }
      return n;
    }, a.prototype.combineResults = function(e, t) {
      if (t === void 0 && (t = ne), e.length === 0)
        return /* @__PURE__ */ new Map();
      var r = t.toLowerCase();
      return e.reduce(Te[r]) || /* @__PURE__ */ new Map();
    }, a.prototype.toJSON = function() {
      var e, t, r, n, i = [];
      try {
        for (var s = b(this._index), o = s.next(); !o.done; o = s.next()) {
          var u = V(o.value, 2), l = u[0], h = u[1], c = {};
          try {
            for (var d = (r = void 0, b(h)), f = d.next(); !f.done; f = d.next()) {
              var m = V(f.value, 2), p = m[0], v = m[1];
              c[p] = Object.fromEntries(v);
            }
          } catch (y) {
            r = { error: y };
          } finally {
            try {
              f && !f.done && (n = d.return) && n.call(d);
            } finally {
              if (r)
                throw r.error;
            }
          }
          i.push([l, c]);
        }
      } catch (y) {
        e = { error: y };
      } finally {
        try {
          o && !o.done && (t = s.return) && t.call(s);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return {
        documentCount: this._documentCount,
        nextId: this._nextId,
        documentIds: Object.fromEntries(this._documentIds),
        fieldIds: this._fieldIds,
        fieldLength: Object.fromEntries(this._fieldLength),
        averageFieldLength: this._avgFieldLength,
        storedFields: Object.fromEntries(this._storedFields),
        dirtCount: this._dirtCount,
        index: i,
        serializationVersion: 2
      };
    }, a.prototype.termResults = function(e, t, r, n, i, s, o, u) {
      var l, h, c, d, f;
      if (u === void 0 && (u = /* @__PURE__ */ new Map()), n == null)
        return u;
      try {
        for (var m = b(Object.keys(i)), p = m.next(); !p.done; p = m.next()) {
          var v = p.value, y = i[v], _ = this._fieldIds[v], g = n.get(_);
          if (g != null) {
            var w = g.size, F = this._avgFieldLength[_];
            try {
              for (var L = (c = void 0, b(g.keys())), x = L.next(); !x.done; x = L.next()) {
                var S = x.value;
                if (!this._documentIds.has(S)) {
                  this.removeTerm(_, S, t), w -= 1;
                  continue;
                }
                var C = s ? s(this._documentIds.get(S), t, this._storedFields.get(S)) : 1;
                if (C) {
                  var A = g.get(S), T = this._fieldLength.get(S)[_], E = De(A, w, this._documentCount, T, F, o), D = r * y * C * E, I = u.get(S);
                  if (I) {
                    I.score += D, Me(I.terms, e);
                    var P = Y(I.match, t);
                    P ? P.push(v) : I.match[t] = [v];
                  } else
                    u.set(S, {
                      score: D,
                      terms: [e],
                      match: (f = {}, f[t] = [v], f)
                    });
                }
              }
            } catch (M) {
              c = { error: M };
            } finally {
              try {
                x && !x.done && (d = L.return) && d.call(L);
              } finally {
                if (c)
                  throw c.error;
              }
            }
          }
        }
      } catch (M) {
        l = { error: M };
      } finally {
        try {
          p && !p.done && (h = m.return) && h.call(m);
        } finally {
          if (l)
            throw l.error;
        }
      }
      return u;
    }, a.prototype.addTerm = function(e, t, r) {
      var n = this._index.fetch(r, ue), i = n.get(e);
      if (i == null)
        i = /* @__PURE__ */ new Map(), i.set(t, 1), n.set(e, i);
      else {
        var s = i.get(t);
        i.set(t, (s || 0) + 1);
      }
    }, a.prototype.removeTerm = function(e, t, r) {
      if (!this._index.has(r)) {
        this.warnDocumentChanged(t, e, r);
        return;
      }
      var n = this._index.fetch(r, ue), i = n.get(e);
      i == null || i.get(t) == null ? this.warnDocumentChanged(t, e, r) : i.get(t) <= 1 ? i.size <= 1 ? n.delete(e) : i.delete(t) : i.set(t, i.get(t) - 1), this._index.get(r).size === 0 && this._index.delete(r);
    }, a.prototype.warnDocumentChanged = function(e, t, r) {
      var n, i;
      try {
        for (var s = b(Object.keys(this._fieldIds)), o = s.next(); !o.done; o = s.next()) {
          var u = o.value;
          if (this._fieldIds[u] === t) {
            this._options.logger("warn", "MiniSearch: document with ID ".concat(this._documentIds.get(e), ' has changed before removal: term "').concat(r, '" was not present in field "').concat(u, '". Removing a document after it has changed can corrupt the index!'), "version_conflict");
            return;
          }
        }
      } catch (l) {
        n = { error: l };
      } finally {
        try {
          o && !o.done && (i = s.return) && i.call(s);
        } finally {
          if (n)
            throw n.error;
        }
      }
    }, a.prototype.addDocumentId = function(e) {
      var t = this._nextId;
      return this._idToShortId.set(e, t), this._documentIds.set(t, e), this._documentCount += 1, this._nextId += 1, t;
    }, a.prototype.addFields = function(e) {
      for (var t = 0; t < e.length; t++)
        this._fieldIds[e[t]] = t;
    }, a.prototype.addFieldLength = function(e, t, r, n) {
      var i = this._fieldLength.get(e);
      i == null && this._fieldLength.set(e, i = []), i[t] = n;
      var s = this._avgFieldLength[t] || 0, o = s * r + n;
      this._avgFieldLength[t] = o / (r + 1);
    }, a.prototype.removeFieldLength = function(e, t, r, n) {
      if (r === 1) {
        this._avgFieldLength[t] = 0;
        return;
      }
      var i = this._avgFieldLength[t] * r - n;
      this._avgFieldLength[t] = i / (r - 1);
    }, a.prototype.saveStoredFields = function(e, t) {
      var r, n, i = this._options, s = i.storeFields, o = i.extractField;
      if (!(s == null || s.length === 0)) {
        var u = this._storedFields.get(e);
        u == null && this._storedFields.set(e, u = {});
        try {
          for (var l = b(s), h = l.next(); !h.done; h = l.next()) {
            var c = h.value, d = o(t, c);
            d !== void 0 && (u[c] = d);
          }
        } catch (f) {
          r = { error: f };
        } finally {
          try {
            h && !h.done && (n = l.return) && n.call(l);
          } finally {
            if (r)
              throw r.error;
          }
        }
      }
    }, a.wildcard = Symbol("*"), a;
  }()
), Y = function(a, e) {
  return Object.prototype.hasOwnProperty.call(a, e) ? a[e] : void 0;
}, Te = (j = {}, j[ne] = function(a, e) {
  var t, r;
  try {
    for (var n = b(e.keys()), i = n.next(); !i.done; i = n.next()) {
      var s = i.value, o = a.get(s);
      if (o == null)
        a.set(s, e.get(s));
      else {
        var u = e.get(s), l = u.score, h = u.terms, c = u.match;
        o.score = o.score + l, o.match = Object.assign(o.match, c), se(o.terms, h);
      }
    }
  } catch (d) {
    t = { error: d };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (t)
        throw t.error;
    }
  }
  return a;
}, j[me] = function(a, e) {
  var t, r, n = /* @__PURE__ */ new Map();
  try {
    for (var i = b(e.keys()), s = i.next(); !s.done; s = i.next()) {
      var o = s.value, u = a.get(o);
      if (u != null) {
        var l = e.get(o), h = l.score, c = l.terms, d = l.match;
        se(u.terms, c), n.set(o, {
          score: u.score + h,
          terms: u.terms,
          match: Object.assign(u.match, d)
        });
      }
    }
  } catch (f) {
    t = { error: f };
  } finally {
    try {
      s && !s.done && (r = i.return) && r.call(i);
    } finally {
      if (t)
        throw t.error;
    }
  }
  return n;
}, j[Ie] = function(a, e) {
  var t, r;
  try {
    for (var n = b(e.keys()), i = n.next(); !i.done; i = n.next()) {
      var s = i.value;
      a.delete(s);
    }
  } catch (o) {
    t = { error: o };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (t)
        throw t.error;
    }
  }
  return a;
}, j), Le = { k: 1.2, b: 0.7, d: 0.5 }, De = function(a, e, t, r, n, i) {
  var s = i.k, o = i.b, u = i.d, l = Math.log(1 + (t - e + 0.5) / (e + 0.5));
  return l * (u + a * (s + 1) / (a + s * (1 - o + o * r / n)));
}, Ve = function(a) {
  return function(e, t, r) {
    var n = typeof a.fuzzy == "function" ? a.fuzzy(e, t, r) : a.fuzzy || !1, i = typeof a.prefix == "function" ? a.prefix(e, t, r) : a.prefix === !0;
    return { term: e, fuzzy: n, prefix: i };
  };
}, X = {
  idField: "id",
  extractField: function(a, e) {
    return a[e];
  },
  tokenize: function(a) {
    return a.split(ke);
  },
  processTerm: function(a) {
    return a.toLowerCase();
  },
  fields: void 0,
  searchOptions: void 0,
  storeFields: [],
  logger: function(a, e) {
    typeof (console == null ? void 0 : console[a]) == "function" && console[a](e);
  },
  autoVacuum: !0
}, ae = {
  combineWith: ne,
  prefix: !1,
  fuzzy: !1,
  maxFuzzy: 6,
  boost: {},
  weights: { fuzzy: 0.45, prefix: 0.375 },
  bm25: Le
}, Oe = {
  combineWith: me,
  prefix: function(a, e, t) {
    return e === t.length - 1;
  }
}, te = { batchSize: 1e3, batchWait: 10 }, re = { minDirtFactor: 0.1, minDirtCount: 20 }, Z = z(z({}, te), re), Me = function(a, e) {
  a.includes(e) || a.push(e);
}, se = function(a, e) {
  var t, r;
  try {
    for (var n = b(e), i = n.next(); !i.done; i = n.next()) {
      var s = i.value;
      a.includes(s) || a.push(s);
    }
  } catch (o) {
    t = { error: o };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (t)
        throw t.error;
    }
  }
}, oe = function(a, e) {
  var t = a.score, r = e.score;
  return r - t;
}, ue = function() {
  return /* @__PURE__ */ new Map();
}, U = function(a) {
  var e, t, r = /* @__PURE__ */ new Map();
  try {
    for (var n = b(Object.keys(a)), i = n.next(); !i.done; i = n.next()) {
      var s = i.value;
      r.set(parseInt(s, 10), a[s]);
    }
  } catch (o) {
    e = { error: o };
  } finally {
    try {
      i && !i.done && (t = n.return) && t.call(n);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return r;
}, ke = /[\n\r -#%-*,-/:;?@[-\]_{}\u00A0\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2000-\u200A\u2010-\u2029\u202F-\u2043\u2045-\u2051\u2053-\u205F\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u3000-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/u;
class J extends HTMLElement {
  constructor() {
    super(), this._selectedId = -1, this._searchTermAliases = [], this._searchOptions = {}, this._mouseLocked = !1, this._mouseTimeoutDuration = 100, this._minisearch = new ze({
      fields: ["text", "description", "tags", "command"],
      storeFields: ["text", "description", "tags"],
      searchOptions: {
        boost: { text: 2, command: 1.5, description: 1, tags: 1, rawText: 0.5 },
        fuzzy: 1,
        maxFuzzy: 20,
        prefix: !0
      }
    }), this._items = [], this._groups = [], this._header = document.createElement("slot"), this._searchContainer = document.createElement("div"), this._searchSlotStart = document.createElement("slot"), this._searchSlotEnd = document.createElement("slot"), this._searchInput = document.createElement("input"), this._noResults = document.createElement("div"), this._container = document.createElement("div"), this._footer = document.createElement("slot"), this._plugins = [], Object.assign(this._header, {
      part: "header",
      name: "header"
    }), Object.assign(this._searchContainer, {
      part: "search-container",
      classList: ["search-container"]
    }), this._searchSlotStart.name = "search-start", Object.assign(this._searchInput, {
      placeholder: this.placeholder,
      type: "search",
      part: "search",
      classList: ["search-input"]
    }), this._searchSlotEnd.name = "search-end", Object.assign(this._container, {
      classList: ["container"],
      role: "listbox",
      part: "container"
    }), Object.assign(this._noResults, {
      innerText: "No results found",
      part: "no-results",
      classList: ["no-results"],
      hidden: !0
    }), Object.assign(this._footer, {
      part: "footer",
      name: "footer"
    }), this.addEventListener(
      "palette-group-construct",
      this._handleGroupConstructor
    ), this.addEventListener("mouseenter", this._handleMouseEnter), this.addEventListener("palette-item-click", (e) => {
      const { command: t, value: r, groupName: n } = e.detail, i = this._groups.find((s) => s.name === n);
      this.dispatchEvent(
        new CustomEvent("command-palette-execute", {
          detail: {
            command: i ? i.commandPrefix + t : t,
            value: r
          },
          bubbles: !0,
          composed: !0
        })
      );
    }), this.addEventListener("palette-search-item-validator-added", (e) => {
      const { validator: t, command: r } = e.detail;
      this._searchTermAliases.push({ term: r, alias: t });
    }), this.addEventListener("palette-search-item-validator-removed", (e) => {
      const { command: t } = e.detail;
      this._searchTermAliases = this._searchTermAliases.filter(
        (r) => r.term !== t
      );
    }), this.addEventListener("palette-item-init", (e) => {
      const t = e.target;
      this.addItem(t);
    }), this._container.addEventListener(
      "palette-item-select",
      (e) => this._handleItemSelect(e)
    ), this._container.addEventListener("palette-item-command-change", (e) => {
      this._handleItemChange(e);
    }), this._container.addEventListener("palette-item-tags-change", (e) => {
      this._handleItemChange(e);
    }), this.dispatchEvent(
      new CustomEvent("command-palette-init", {
        bubbles: !0,
        composed: !0
      })
    );
  }
  static get observedAttributes() {
    return ["placeholder", "limit"];
  }
  get plugins() {
    return this._plugins;
  }
  /**
   * @deprecated Use `addPlugin` instead.
   */
  registerPlugin(e) {
    this.addPlugin(e);
  }
  /**
   * Adds a plugin to the list of plugins for the current instance.
   *
   * @param {Plugin} plugin - The plugin to be added to the list of plugins.
   * @returns {void}
   *
   * @description
   * This method adds a plugin to the list of plugins for the current instance.
   * If the plugin has the property `reloadAfterRegisteration` set to true,
   * it will trigger a render of the current instance after adding the plugin.
   */
  addPlugin(e) {
    this._plugins.push(e), e.registered && e.registered(this), e.reloadAfterRegistration && this.render();
  }
  /**
   * Adds multiple plugins to the list of plugins for the current instance.
   *
   * @param {Plugin[]} plugins - The list of plugins to be added to the list of plugins.
   * @returns {void}
   */
  addPlugins(...e) {
    for (const t of e)
      this.addPlugin(t);
  }
  /**
   * Removes a plugin from the list of plugins and triggers a re-render of the UI.
   *
   * @param {Plugin} plugin - The plugin to be removed from the list of plugins.
   * @returns {void}
   */
  removePlugin(e) {
    this._plugins = this._plugins.filter((t) => t !== e), e.unregistered && e.unregistered(this), this.render();
  }
  /**
   * Removes multiple plugins from the list of plugins and triggers a re-render of the UI.
   *
   * @param {Plugin[]} plugins - The list of plugins to be removed from the list of plugins.
   * @returns {void}
   */
  removePlugins(...e) {
    for (const t of e)
      this.removePlugin(t);
  }
  get header() {
    return this._header;
  }
  get searchContainer() {
    return this._searchContainer;
  }
  get searchSlotStart() {
    return this._searchSlotStart;
  }
  get searchInput() {
    return this._searchInput;
  }
  get searchSlotEnd() {
    return this._searchSlotEnd;
  }
  /**
   * Returns the search query entered by the user.
   *
   * @returns {string} The search query entered by the user.
   */
  get searchQuery() {
    return this._searchInput.value;
  }
  /**
   * Returns the container element of the component.
   *
   * @returns {HTMLElement} The container element of the component.
   */
  get container() {
    return this._container;
  }
  /**
   * Returns the collection of items within the container element.
   *
   * @returns {HTMLCollection} The collection of items within the container element.
   */
  get containerItems() {
    return this._container.children;
  }
  /**
   * Returns the footer element of the component.
   *
   * @returns {HTMLSlotElement} The footer element of the component.
   */
  get footer() {
    return this._footer;
  }
  /**
   * Returns the element used to display a message when there are no results.
   *
   * @returns {HTMLElement} The element used to display a message when there are no results.
   */
  get noResultsElement() {
    return this._noResults;
  }
  /**
   * Returns the search options currently set for the search functionality.
   *
   * @returns {SearchOptions} The search options currently set.
   */
  get searchOptions() {
    return this._searchOptions;
  }
  /**
   * Returns the MiniSearch instance configured with the search items.
   *
   * @returns {MiniSearch<SearchItem>} The MiniSearch instance configured with the search items.
   */
  get minisearch() {
    return this._minisearch;
  }
  hideItem(e) {
    e.hidden = !0;
  }
  showItem(e) {
    e.hidden = !1;
  }
  get searchTermAliases() {
    return this._searchTermAliases;
  }
  addSearchTermAlias(e, t) {
    this._searchTermAliases.push({ term: e, alias: t });
  }
  removeSearchTermAlias(e) {
    this._searchTermAliases = this._searchTermAliases.filter(
      (t) => t.alias !== e
    );
  }
  clearSearchTermAliases() {
    this._searchTermAliases = [];
  }
  get placeholder() {
    return this._searchInput.placeholder;
  }
  set placeholder(e) {
    this._searchInput.placeholder = e;
  }
  get selectedId() {
    return this._selectedId;
  }
  set selectedId(e) {
    this._selectedId = e;
  }
  get groups() {
    return this._groups;
  }
  get items() {
    return this._items.filter((e) => e instanceof H);
  }
  get selectedItem() {
    return this._container.querySelector("[selected]");
  }
  attributeChangedCallback(e, t, r) {
    e === "placeholder" && (this.placeholder = r);
  }
  connectedCallback() {
    const e = this.attachShadow({ mode: "open" }), t = new CSSStyleSheet();
    t.replaceSync(J.styles), e.adoptedStyleSheets = [t], Object.assign(this, {
      part: "menu",
      ariaLabel: "Command palette"
    }), this._searchInput.placeholder = this.placeholder;
    const r = document.createElement("hr");
    Object.assign(r, {
      part: "divider"
    }), this._searchContainer.append(
      this._searchSlotStart,
      this._searchInput,
      this._searchSlotEnd
    ), e.append(
      this._header,
      this._searchContainer,
      r,
      this._noResults,
      this._container,
      this._footer
    ), this.setupSearch(), this._searchInput.addEventListener("keydown", (n) => {
      n.key === "ArrowDown" && (n.preventDefault(), this._handleArrowDown()), n.key === "ArrowUp" && (n.preventDefault(), this._handleArrowUp()), n.key === "Enter" && (n.preventDefault(), this._handleEnter());
    }), this.dispatchEvent(
      new CustomEvent("command-palette-connected", {
        bubbles: !0,
        composed: !0
      })
    );
  }
  render(e = this._items) {
    this._plugins.forEach((n) => n.preRender(e, this));
    const t = document.createDocumentFragment(), r = /* @__PURE__ */ new Map();
    e.forEach((n) => {
      if (this._plugins.forEach((i) => i.processItem(n, this)), n.bindValueToSearch && (n.value = this.searchQuery), n.group) {
        if (!r.has(n.group)) {
          const i = this._groups.find((s) => s.name === n.group);
          if (i) {
            r.set(n.group, i);
            const s = e.filter((o) => o.group === i.name);
            t.append(i, ...s);
          }
        }
      } else
        t.append(n);
    }), this._plugins.forEach((n) => n.postRender(t, this)), this._container.replaceChildren(t), this.selectFirstVisibleItem(), this._container.dispatchEvent(
      new CustomEvent("command-palette-render", {
        bubbles: !0,
        composed: !0
      })
    ), this._noResults.hidden = this._container.children.length >= 1;
  }
  setupSearch() {
    this._searchInput.addEventListener("input", (e) => {
      let t = e.target.value;
      if (!t) {
        this.render();
        for (const n of this._items)
          n.clearHighlights();
        this._searchTermAliases.length > 0 && this.selectFirstVisibleItem(), this._noResults.hidden = !0;
        return;
      }
      this._searchTermAliases.length > 0 ? this._findAliases(t).forEach((n) => {
        this._searchOptions.combineWith = "or", t = t + ` ${n}`;
      }) : this._searchOptions.combineWith = void 0;
      const r = this._minisearch.search(t, this._searchOptions);
      this._handleSearchResults(r), this.dispatchEvent(
        new CustomEvent("command-palette-search", {
          bubbles: !0,
          composed: !0,
          detail: { query: t, results: r }
        })
      );
    }), this._searchInput.addEventListener("focus", () => {
      this._selectedId === -1 && this._container.children.length > 0 && this.selectFirstVisibleItem();
    });
  }
  _handleSearchResults(e) {
    this._container.replaceChildren(), this._noResults.hidden = e.length > 0;
    const t = e.map((r) => this._items[r.id]);
    if (this.render(t), this.selectFirstVisibleItem(), e.length > 0)
      for (const r of e) {
        const { queryTerms: n } = r, i = this._items[r.id];
        i && i.highlight(...n);
      }
  }
  selectFirstVisibleItem() {
    const e = this._container.querySelector(
      "[data-palette-item]:not([hidden])"
    );
    if (!e) {
      this.select(-1);
      return;
    }
    this.select(e);
  }
  select(e) {
    for (const t of this._container.querySelectorAll(
      "[data-palette-item]"
    ))
      t.selected = !1;
    if (typeof e == "number") {
      if (e === -1) {
        this._selectedId = -1;
        return;
      }
      const t = this._items[e];
      t.selected = !0, this._selectedId = e;
      return;
    }
    e.selected = !0, this._selectedId = e.index;
  }
  _handleGroupConstructor(e) {
    const { name: t, label: r, commandPrefix: n, tags: i, items: s } = e.detail, o = ge(r, {
      name: t,
      items: s
    });
    n && (o.commandPrefix = n), i && (o.tags = i), this.addGroup(o);
  }
  addGroup(e) {
    this._groups.push(e), this.render();
  }
  addItem(e) {
    if (!e || e instanceof J)
      return;
    const t = this._convertItemToSearchable(e);
    e.dataset.id = this._items.length.toString(), this._items.push(e), e.excludeFromSearch || this._minisearch.add(t), this.dispatchEvent(
      new CustomEvent("command-palette-item-add", {
        detail: { item: e },
        bubbles: !0,
        composed: !0
      })
    ), this.render();
  }
  addItems(...e) {
    e.forEach((t) => this.addItem(t));
  }
  removeItem(e) {
    const t = this._items.findIndex((r) => r === e);
    t !== -1 && (this._minisearch.has(e.index) && this._minisearch.discard(e.index), this._items.splice(t, 1), this.render());
  }
  removeItems(...e) {
    e.forEach((t) => this.removeItem(t));
  }
  removeItemByIndex(e) {
    const t = this._items[e];
    this.removeItem(t);
  }
  removeItemsByIndex(...e) {
    e.forEach((t) => this.removeItemByIndex(t));
  }
  updateItem(e) {
    const t = this._convertItemToSearchable(e), r = this._items.findIndex((i) => i === e);
    r === -1 || !this._items.find((i) => i.index === r) || (this._minisearch.has(e.index) && (this._minisearch.discard(e.index), this._minisearch.add(t)), this._items[r] = e);
  }
  _convertItemToSearchable(e) {
    const { index: t, displayText: r, description: n, tags: i, command: s } = e;
    return {
      id: t ?? this._items.length,
      text: r,
      rawText: e.innerText,
      description: n,
      tags: i,
      command: s
    };
  }
  focus() {
    this._searchInput.focus();
  }
  blur() {
    this._searchInput.blur();
  }
  _findNextVisibleItem(e) {
    if (e === null)
      return;
    const t = Array.from(
      this._container.querySelectorAll(
        "[data-palette-item]:not([hidden])"
      )
    ), r = t.indexOf(e), n = t[r + 1];
    if (n)
      return n;
  }
  _findPreviousVisibleItem(e) {
    if (e === null)
      return;
    const t = Array.from(
      this._container.querySelectorAll(
        "[data-palette-item]:not([hidden])"
      )
    ), r = t.indexOf(e), n = t[r - 1];
    if (n)
      return n;
  }
  _findAliases(e) {
    let t = /* @__PURE__ */ new Set();
    for (const { term: r, alias: n } of this._searchTermAliases)
      n instanceof RegExp && n.test(e) && t.add(r), n instanceof Function && n(e) && t.add(r), n === e && t.add(r);
    return t;
  }
  _handleArrowUp() {
    const e = this._findPreviousVisibleItem(this.selectedItem);
    e && (this.select(e), e.scrollIntoView({ behavior: "instant", block: "nearest" }));
  }
  _handleArrowDown() {
    const e = this._findNextVisibleItem(this.selectedItem);
    e && (this.select(e), e.scrollIntoView({ behavior: "instant", block: "nearest" }));
  }
  _handleEnter() {
    this.selectedItem && this.selectedItem.click();
  }
  _handleMouseEnter() {
    this._resetMouseTimeout(), this.addEventListener("mousemove", this._handleMouseMove), this.addEventListener("mouseleave", this._handleMouseLeave, {
      once: !0
    });
  }
  _handleMouseMove() {
    this._resetMouseTimeout();
  }
  _handleMouseLeave() {
    this._resetMouseTimeout(), this.removeEventListener("mousemove", this._handleMouseMove);
  }
  _resetMouseTimeout() {
    this._mouseLocked = !1, this._mouseTimeout && clearTimeout(this._mouseTimeout), this._mouseTimeout = setTimeout(() => {
      this._mouseLocked = !0;
    }, this._mouseTimeoutDuration);
  }
  _handleItemSelect(e) {
    if (!this._mouseLocked) {
      const t = e.target;
      this.select(t);
    }
  }
  _handleItemChange(e) {
    const t = e.target;
    this.updateItem(t);
  }
  static get styles() {
    return `
      :host {
        display: block;
        font-family: inherit;
        overflow: hidden;
        background-color: rgb(255,255,255);
      }

      :host([hidden]) {
        display: none !important;
      }

      .search-container {
        display: flex;
        position: relative;
        align-items: center;
        height: 2em;
        background-color: var(--command-palette-search-bg, #f5f5f5);
      }

      .search-container:focus-within {
        background-color: var(--command-palette-search-bg-focus, #f2f2f2);
      }

      .search-input {
        width: 100%;
        height: 100%;
        padding: 0.5em;
        padding-left: 1em;
        padding-right: 1em;
        border: 0;
        font-size: 1em;
        outline: none;
        appearance: none;
        color: var(--command-palette-search-color, inherit);
        background-color: transparent;
      }

      .no-results {
        padding: 1em;
        text-align: center;
        font-size: 1em;
        color: var(--command-palette-no-results-color, inherit);
      }

      hr {
        margin: 0;
        border: 0;
        border-top: 1px solid currentColor;
        opacity: 0.3;
      }

      .container {
        max-height: 300px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      /* NOTE: This is a workaround to style the mark element in a command item */
      mark.highlight {
        background-color: var(--command-palette-item-bg-highlight, yellow);
        color: var(--command-palette-item-color-highlight, black);
        padding: var(--command-palette-item-highlight-padding, 0 2px);
        border-radius: var(--command-palette-item-highlight-radius, 2px);
        display: inline;
        font-weight: var(--command-palette-item-highlight-weight, bold);
      }`;
  }
}
const ve = new CSSStyleSheet();
ve.replaceSync(`
  :host {
    display: block;
    font-size: var(--command-pallete-group-header-font-size, inherit);
    font-weight: var(--command-pallete-group-header-font-weight, bold);
    color: var(--command-pallete-group-header-color, inherit);
    opacity: var(--command-pallete-group-header-opacity, 0.5);
    padding-left: 10px;
    padding-right: 10px; 
  }
`);
class Pe extends HTMLElement {
  constructor() {
    super(), this._contentSlot = document.createElement("slot"), this.items = [], this.attachShadow({ mode: "open" }), this.shadowRoot.appendChild(this._contentSlot), this.shadowRoot.adoptedStyleSheets = [ve];
  }
  connectedCallback() {
    this.textContent = this.label, this.role = "presentation", this.dataset.palleteGroup = "";
  }
  get name() {
    return this.getAttribute("name") || this.label || this.id || "";
  }
  set name(e) {
    this.setAttribute("name", e);
  }
  get parentGroup() {
    return this.closest("command-pallete-item-group");
  }
  addItem(e) {
    e.dataset.group = this.name, this.items.push(e);
  }
  addItems(e) {
    for (const t of e)
      this.addItem(t);
  }
  removeItem(e) {
    delete e.dataset.group, this.items = this.items.filter((t) => t !== e);
  }
  removeItems(e) {
    for (const t of e)
      this.removeItem(t);
  }
  get commandPrefix() {
    return this.getAttribute("command-prefix") || "";
  }
  set commandPrefix(e) {
    this.setAttribute("command-prefix", e);
  }
  get label() {
    return this.getAttribute("label") || "";
  }
  set label(e) {
    this.setAttribute("label", e);
  }
  get tags() {
    var e;
    return ((e = this.getAttribute("tags")) == null ? void 0 : e.split(" ")) || [];
  }
  set tags(e) {
    this.setAttribute("tags", e.join(" "));
  }
  static get observedAttributes() {
    return ["command-prefix", "tags"];
  }
  attributeChangedCallback(e, t, r) {
    e === "command-prefix" && this.dispatchEvent(
      new CustomEvent("group-command-prefix-change", {
        detail: {
          oldValue: t,
          newValue: r
        },
        bubbles: !0,
        composed: !0
      })
    ), e === "tags" && t !== r && this.dispatchEvent(
      new CustomEvent("group-tags-change", {
        detail: {
          oldValue: t,
          newValue: r
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
}
class Re extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.dispatchEvent(
      new CustomEvent("palette-group-construct", {
        detail: {
          name: this.name,
          commandPrefix: this.commandPrefix,
          tags: this.tags,
          label: this.label,
          items: Array.from(this.children)
        },
        composed: !0,
        bubbles: !0
      })
    );
    for (const e of Array.from(this.children).reverse()) {
      const t = this.nextSibling, r = this.parentElement;
      r && t ? r.insertBefore(e, t) : r == null || r.appendChild(e);
    }
  }
  connectedCallback() {
    this.remove();
  }
  get label() {
    return this.getAttribute("label") || this.getAttribute("header") || "";
  }
  get commandPrefix() {
    return this.getAttribute("command-prefix") || "";
  }
  get name() {
    return this.getAttribute("name") || this.label || this.id || "";
  }
  get tags() {
    var e;
    return ((e = this.getAttribute("tags")) == null ? void 0 : e.split(" ")) || [];
  }
}
const Ne = (a, ...e) => String.raw({ raw: a }, ...e), Be = Ne`
  ::slotted(.search-item-value) {
    color: var(--command-palette-item-value-color, inherit);
    background-color: var(--command-palette-item-value-background, rgba(0, 0, 0, 0.2));
    border-radius: var(--command-palette-item-value-roundness, 0.2em);
    padding: 0.1em 0.25em;
    margin-left: 0.5em;
  }

  ::slotted(.search-item-value:empty) {
    display: none;
  }
`;
class We extends H {
  constructor() {
    super(), this._validators = /* @__PURE__ */ new Set(), this._valueElement = document.createElement("span"), this.addStyleSheet(Be), Object.assign(this._valueElement, {
      part: "search-item-value",
      classList: ["search-item-value"]
    }), this.dataset.validator && this.addValidator(new RegExp(this.dataset.validator)), this._valueElement.setAttribute("data-ignore-highlight", "");
  }
  connectedCallback() {
    super.connectedCallback(), this.append(this._valueElement), this.bindValueToSearch = !0, this.excludeFromSearch = !0, this.hidden = !(this.value && this.validate(this.value)), this._valueElement.textContent = this.value;
  }
  addValidator(e) {
    if (typeof e != "function" && !(e instanceof RegExp) && typeof e != "string")
      throw new Error("Validator must be a function, RegExp or string");
    const t = new CustomEvent(
      "palette-search-item-validator-added",
      {
        detail: {
          validator: e,
          command: this.command
        },
        bubbles: !0,
        composed: !0
      }
    );
    this._validators.add(e), this.dispatchEvent(t);
  }
  addValidators(e) {
    for (const t of e)
      this.addValidator(t);
  }
  removeValidator(e) {
    const t = new CustomEvent(
      "palette-search-item-validator-removed",
      {
        detail: {
          validator: e,
          command: this.command
        },
        bubbles: !0,
        composed: !0
      }
    );
    this._validators.delete(e), this.dispatchEvent(t);
  }
  removeValidators(e) {
    for (const t of e)
      this.removeValidator(t);
  }
  removeValidatorAt(e) {
    const t = Array.from(this._validators);
    this.removeValidator(t[e]);
  }
  removeAllValidators() {
    this._validators.clear();
  }
  validate(e) {
    return this._validators.size === 0 || Array.from(this._validators).every((t) => typeof t == "function" ? t(e) : t instanceof RegExp ? t.test(e) : e.includes(t));
  }
  get vaildators() {
    return this._validators;
  }
  get valueElement() {
    return this._valueElement;
  }
}
function je(a, e) {
  window.customElements.get(a) || window.customElements.define(a, e);
}
function He(a) {
  for (const [e, t] of Object.entries(a))
    je(e, t);
}
function Ge() {
  He({
    "command-palette": J,
    "command-palette-item-group": Pe,
    "command-palette-group": Re,
    "command-palette-item": H,
    "command-palette-item-search": We
  });
}
Ge();
export {
  J as CommandPalette,
  Pe as Group,
  Re as GroupConstructorComponent,
  H as Item,
  Ue as Plugin,
  We as SearchItem
};

const Er = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, Et = (e) => "value" in e && e.value !== void 0, Ut = (e) => "error" in e && e.error !== void 0, Ur = (e) => Et(e) || Ut(e), Tt = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, kt = (e) => {
  const t = e;
  return Tt(e) && t.meta?.hasError || !1;
}, tt = {
  "SHA-256": 32,
  "SHA-512": 64
}, Ee = ["SHA-256", "SHA-512"];
function Ue(e) {
  if (typeof e == "string")
    return e;
  const t = e();
  return typeof t == "string" ? t : (console.error("ASSERTION FAIL VALUE", t), "Assertion Failed");
}
function xe(e, t = "Assertion failed") {
  if (!e)
    throw new Error(Ue(t));
}
const rt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => {
  throw new Error("assertEqualElements: Bitrotted");
}, Ot = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => Array.isArray(e) && Array.isArray(t) ? rt(e, t, r) : xe(e === t, r), It = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is equal to ${JSON.stringify(t)}`)) => xe(e !== t, r);
function Mt(e, t, r = "Assertion failed: Required value is not of correct type") {
  if (!t(e))
    throw new Error(Ue(r));
  return e;
}
function _t(e, t = "Assertion failed: Reached what should be an unreachable section of code") {
  throw new Error(Ue(t));
}
function Rt(e) {
  return e != null && !Number.isNaN(e);
}
function Pt(e, t = "Assertion failed: Required value not defined") {
  return xe(Rt(e), t), e;
}
const W = {
  assert: xe,
  assertUnreachable: _t,
  assertValue: Pt,
  assertEqual: Ot,
  assertNotEqual: It,
  assertEqualElements: rt,
  assertType: Mt
}, Te = (e) => {
  const t = e.flatMap((r) => typeof r == "number" ? [r] : JSON.stringify(r).split("").map((n) => n.codePointAt(0)));
  return new Float64Array(t.length).map((r, n) => t[n]);
}, ee = async (e) => e instanceof ArrayBuffer ? e : e instanceof Blob ? e.arrayBuffer() : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? Te(e) : new ArrayBuffer(0), ge = async ({ bytes: e, algorithm: t = "SHA-512" }) => {
  const r = await ee(e);
  return crypto.subtle.digest(t, r);
}, nt = async (e, t = 16) => {
  const r = await ee(e);
  return [...new Uint8Array(r)].map((n) => n.toString(t).padStart(2, "0")).join("");
}, de = async ({ bytes: e, algorithm: t = "SHA-512", radix: r = 16 }) => {
  const n = await ge({ bytes: e, algorithm: t }), s = await nt(n, r);
  return `${t}:${s}`;
}, Lt = ({ id: e }) => {
  const t = e.split(":");
  W.assert(t.length === 2);
  const [r, n] = t, s = atob(n), c = new Uint8Array(s.length);
  return s.split("").map((l) => l.charCodeAt(0)).forEach((l, h) => {
    c[h] = l;
  }), c;
}, st = async (e) => {
  if (typeof e == "string")
    return e;
  const t = await ee(e);
  return new TextDecoder().decode(t);
}, ie = [];
ie.push(async () => {
  const e = "test", t = await ee(e), r = await st(t);
  return W.assertEqual(e, r);
});
ie.push(async () => Ee.map(async (e) => {
  const t = await ge({ bytes: "test", algorithm: e });
  return W.assertEqual(t.byteLength, tt[e]);
}));
ie.push(async () => {
  {
    const e = await de({
      bytes: "test",
      algorithm: "SHA-256"
    });
    W.assertEqual(e, "SHA-256:n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=");
  }
  {
    const e = await de({
      bytes: "test",
      algorithm: "SHA-512"
    });
    W.assertEqual(e, "SHA-512:7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==");
  }
});
ie.push(async () => Ee.map(async (e) => {
  const t = "test", r = await de({ bytes: t, algorithm: e }), n = new Uint8Array(await ge({ bytes: t, algorithm: e })), s = Lt({ id: r });
  return W.assertEqualElements(s, n);
}));
const Dt = async () => {
  if ((await Promise.all(ie.map(async (t) => {
    try {
      return await t(), !0;
    } catch (r) {
      return console.error(r), !1;
    }
  }))).find((t) => t === !1))
    throw new Error("TESTS FAILED");
  return console.log("TESTS PASS"), !0;
};
function ke(e) {
  const t = new Uint8Array(e.slice(0));
  let r = "";
  for (let n = 0; n < t.length; n++)
    r += String.fromCharCode(t[n]);
  return btoa(r);
}
const Nt = (e) => {
  const t = new Uint8Array(e), r = [];
  for (let n = 0; n < t.length; ++n)
    r.push(t[n].toString(16).padStart(2, "0"));
  return r.join("");
}, Vt = (e) => new TextDecoder().decode(new Uint8Array(e)), Ct = (e, t) => e.slice(0, e.size, t), jt = (e) => {
  const t = globalThis.atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}, qt = (e) => {
  if (!e)
    return;
  const t = e.split(","), n = (t[0].match(/:(.*?);/) ?? [])[1], s = atob(t[1]);
  let c = s.length;
  const l = new Uint8Array(c);
  for (; c--; )
    l[c] = s.charCodeAt(c);
  return new Blob([l], { type: n });
}, Oe = (e) => e instanceof ArrayBuffer ? e : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? Te(e) : new ArrayBuffer(0), $t = async (e, t) => {
  const r = Oe(e);
  return crypto.subtle.digest(t, r);
}, Ie = (e) => {
  const t = e;
  return !!(t instanceof ArrayBuffer || typeof t == "string" || ArrayBuffer.isView(t) || Array.isArray(t));
}, Ft = (e) => e instanceof Blob ? !0 : Ie(e), zt = (e) => {
  if (typeof e == "string")
    return e.length;
  if (e instanceof Blob)
    return e.size;
  if (e instanceof ArrayBuffer || ArrayBuffer.isView(e))
    return e.byteLength;
};
var be;
try {
  be = new TextDecoder();
} catch {
}
var x, J, i = 0, M = {}, E, K, $ = 0, z = 0, N, H, j = [], B, $e = {
  useRecords: !1,
  mapsAsObjects: !0
};
class it {
}
const ft = new it();
ft.name = "MessagePack 0xC1";
var Z = !1, at = 2, Jt;
try {
  new Function("");
} catch {
  at = 1 / 0;
}
class se {
  constructor(t) {
    t && (t.useRecords === !1 && t.mapsAsObjects === void 0 && (t.mapsAsObjects = !0), t.sequential && t.trusted !== !1 && (t.trusted = !0, !t.structures && t.useRecords != !1 && (t.structures = [], t.maxSharedStructures || (t.maxSharedStructures = 0))), t.structures ? t.structures.sharedLength = t.structures.length : t.getStructures && ((t.structures = []).uninitialized = !0, t.structures.sharedLength = 0), t.int64AsNumber && (t.int64AsType = "number")), Object.assign(this, t);
  }
  unpack(t, r) {
    if (x)
      return xt(() => (Ae(), this ? this.unpack(t, r) : se.prototype.unpack.call($e, t, r)));
    !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < "u" ? Buffer.from(t) : new Uint8Array(t)), typeof r == "object" ? (J = r.end || t.length, i = r.start || 0) : (i = 0, J = r > -1 ? r : t.length), z = 0, K = null, N = null, x = t;
    try {
      B = t.dataView || (t.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength));
    } catch (n) {
      throw x = null, t instanceof Uint8Array ? n : new Error("Source must be a Uint8Array or Buffer but was a " + (t && typeof t == "object" ? t.constructor.name : typeof t));
    }
    if (this instanceof se) {
      if (M = this, this.structures)
        return E = this.structures, ce(r);
      (!E || E.length > 0) && (E = []);
    } else
      M = $e, (!E || E.length > 0) && (E = []);
    return ce(r);
  }
  unpackMultiple(t, r) {
    let n, s = 0;
    try {
      Z = !0;
      let c = t.length, l = this ? this.unpack(t, c) : he.unpack(t, c);
      if (r) {
        if (r(l, s, i) === !1) return;
        for (; i < c; )
          if (s = i, r(ce(), s, i) === !1)
            return;
      } else {
        for (n = [l]; i < c; )
          s = i, n.push(ce());
        return n;
      }
    } catch (c) {
      throw c.lastPosition = s, c.values = n, c;
    } finally {
      Z = !1, Ae();
    }
  }
  _mergeStructures(t, r) {
    t = t || [], Object.isFrozen(t) && (t = t.map((n) => n.slice(0)));
    for (let n = 0, s = t.length; n < s; n++) {
      let c = t[n];
      c && (c.isShared = !0, n >= 32 && (c.highByte = n - 32 >> 5));
    }
    t.sharedLength = t.length;
    for (let n in r || [])
      if (n >= 0) {
        let s = t[n], c = r[n];
        c && (s && ((t.restoreStructures || (t.restoreStructures = []))[n] = s), t[n] = c);
      }
    return this.structures = t;
  }
  decode(t, r) {
    return this.unpack(t, r);
  }
}
function ce(e) {
  try {
    if (!M.trusted && !Z) {
      let r = E.sharedLength || 0;
      r < E.length && (E.length = r);
    }
    let t;
    if (M.randomAccessStructure && x[i] < 64 && x[i] >= 32 && Jt || (t = P()), N && (i = N.postBundlePosition, N = null), Z && (E.restoreStructures = null), i == J)
      E && E.restoreStructures && Fe(), E = null, x = null, H && (H = null);
    else {
      if (i > J)
        throw new Error("Unexpected end of MessagePack data");
      if (!Z) {
        let r;
        try {
          r = JSON.stringify(t, (n, s) => typeof s == "bigint" ? `${s}n` : s).slice(0, 100);
        } catch (n) {
          r = "(JSON view not available " + n + ")";
        }
        throw new Error("Data read, but end of buffer not reached " + r);
      }
    }
    return t;
  } catch (t) {
    throw E && E.restoreStructures && Fe(), Ae(), (t instanceof RangeError || t.message.startsWith("Unexpected end of buffer") || i > J) && (t.incomplete = !0), t;
  }
}
function Fe() {
  for (let e in E.restoreStructures)
    E[e] = E.restoreStructures[e];
  E.restoreStructures = null;
}
function P() {
  let e = x[i++];
  if (e < 160)
    if (e < 128) {
      if (e < 64)
        return e;
      {
        let t = E[e & 63] || M.getStructures && ot()[e & 63];
        return t ? (t.read || (t.read = Me(t, e & 63)), t.read()) : e;
      }
    } else if (e < 144)
      if (e -= 128, M.mapsAsObjects) {
        let t = {};
        for (let r = 0; r < e; r++) {
          let n = lt();
          n === "__proto__" && (n = "__proto_"), t[n] = P();
        }
        return t;
      } else {
        let t = /* @__PURE__ */ new Map();
        for (let r = 0; r < e; r++)
          t.set(P(), P());
        return t;
      }
    else {
      e -= 144;
      let t = new Array(e);
      for (let r = 0; r < e; r++)
        t[r] = P();
      return M.freezeData ? Object.freeze(t) : t;
    }
  else if (e < 192) {
    let t = e - 160;
    if (z >= i)
      return K.slice(i - $, (i += t) - $);
    if (z == 0 && J < 140) {
      let r = t < 16 ? _e(t) : ct(t);
      if (r != null)
        return r;
    }
    return me(t);
  } else {
    let t;
    switch (e) {
      case 192:
        return null;
      case 193:
        return N ? (t = P(), t > 0 ? N[1].slice(N.position1, N.position1 += t) : N[0].slice(N.position0, N.position0 -= t)) : ft;
      // "never-used", return special object to denote that
      case 194:
        return !1;
      case 195:
        return !0;
      case 196:
        if (t = x[i++], t === void 0)
          throw new Error("Unexpected end of buffer");
        return Se(t);
      case 197:
        return t = B.getUint16(i), i += 2, Se(t);
      case 198:
        return t = B.getUint32(i), i += 4, Se(t);
      case 199:
        return v(x[i++]);
      case 200:
        return t = B.getUint16(i), i += 2, v(t);
      case 201:
        return t = B.getUint32(i), i += 4, v(t);
      case 202:
        if (t = B.getFloat32(i), M.useFloat32 > 2) {
          let r = Re[(x[i] & 127) << 1 | x[i + 1] >> 7];
          return i += 4, (r * t + (t > 0 ? 0.5 : -0.5) >> 0) / r;
        }
        return i += 4, t;
      case 203:
        return t = B.getFloat64(i), i += 8, t;
      // uint handlers
      case 204:
        return x[i++];
      case 205:
        return t = B.getUint16(i), i += 2, t;
      case 206:
        return t = B.getUint32(i), i += 4, t;
      case 207:
        return M.int64AsType === "number" ? (t = B.getUint32(i) * 4294967296, t += B.getUint32(i + 4)) : M.int64AsType === "string" ? t = B.getBigUint64(i).toString() : M.int64AsType === "auto" ? (t = B.getBigUint64(i), t <= BigInt(2) << BigInt(52) && (t = Number(t))) : t = B.getBigUint64(i), i += 8, t;
      // int handlers
      case 208:
        return B.getInt8(i++);
      case 209:
        return t = B.getInt16(i), i += 2, t;
      case 210:
        return t = B.getInt32(i), i += 4, t;
      case 211:
        return M.int64AsType === "number" ? (t = B.getInt32(i) * 4294967296, t += B.getUint32(i + 4)) : M.int64AsType === "string" ? t = B.getBigInt64(i).toString() : M.int64AsType === "auto" ? (t = B.getBigInt64(i), t >= BigInt(-2) << BigInt(52) && t <= BigInt(2) << BigInt(52) && (t = Number(t))) : t = B.getBigInt64(i), i += 8, t;
      case 212:
        if (t = x[i++], t == 114)
          return Ge(x[i++] & 63);
        {
          let r = j[t];
          if (r)
            return r.read ? (i++, r.read(P())) : r.noBuffer ? (i++, r()) : r(x.subarray(i, ++i));
          throw new Error("Unknown extension " + t);
        }
      case 213:
        return t = x[i], t == 114 ? (i++, Ge(x[i++] & 63, x[i++])) : v(2);
      case 214:
        return v(4);
      case 215:
        return v(8);
      case 216:
        return v(16);
      case 217:
        return t = x[i++], z >= i ? K.slice(i - $, (i += t) - $) : Qt(t);
      case 218:
        return t = B.getUint16(i), i += 2, z >= i ? K.slice(i - $, (i += t) - $) : Yt(t);
      case 219:
        return t = B.getUint32(i), i += 4, z >= i ? K.slice(i - $, (i += t) - $) : Gt(t);
      case 220:
        return t = B.getUint16(i), i += 2, Je(t);
      case 221:
        return t = B.getUint32(i), i += 4, Je(t);
      case 222:
        return t = B.getUint16(i), i += 2, He(t);
      case 223:
        return t = B.getUint32(i), i += 4, He(t);
      default:
        if (e >= 224)
          return e - 256;
        if (e === void 0) {
          let r = new Error("Unexpected end of MessagePack data");
          throw r.incomplete = !0, r;
        }
        throw new Error("Unknown MessagePack token " + e);
    }
  }
}
const Ht = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function Me(e, t) {
  function r() {
    if (r.count++ > at) {
      let s = e.read = new Function("r", "return function(){return " + (M.freezeData ? "Object.freeze" : "") + "({" + e.map((c) => c === "__proto__" ? "__proto_:r()" : Ht.test(c) ? c + ":r()" : "[" + JSON.stringify(c) + "]:r()").join(",") + "})}")(P);
      return e.highByte === 0 && (e.read = ze(t, e.read)), s();
    }
    let n = {};
    for (let s = 0, c = e.length; s < c; s++) {
      let l = e[s];
      l === "__proto__" && (l = "__proto_"), n[l] = P();
    }
    return M.freezeData ? Object.freeze(n) : n;
  }
  return r.count = 0, e.highByte === 0 ? ze(t, r) : r;
}
const ze = (e, t) => function() {
  let r = x[i++];
  if (r === 0)
    return t();
  let n = e < 32 ? -(e + (r << 5)) : e + (r << 5), s = E[n] || ot()[n];
  if (!s)
    throw new Error("Record id is not defined for " + n);
  return s.read || (s.read = Me(s, e)), s.read();
};
function ot() {
  let e = xt(() => (x = null, M.getStructures()));
  return E = M._mergeStructures(e, E);
}
var me = fe, Qt = fe, Yt = fe, Gt = fe;
function fe(e) {
  let t;
  if (e < 16 && (t = _e(e)))
    return t;
  if (e > 64 && be)
    return be.decode(x.subarray(i, i += e));
  const r = i + e, n = [];
  for (t = ""; i < r; ) {
    const s = x[i++];
    if ((s & 128) === 0)
      n.push(s);
    else if ((s & 224) === 192) {
      const c = x[i++] & 63;
      n.push((s & 31) << 6 | c);
    } else if ((s & 240) === 224) {
      const c = x[i++] & 63, l = x[i++] & 63;
      n.push((s & 31) << 12 | c << 6 | l);
    } else if ((s & 248) === 240) {
      const c = x[i++] & 63, l = x[i++] & 63, h = x[i++] & 63;
      let w = (s & 7) << 18 | c << 12 | l << 6 | h;
      w > 65535 && (w -= 65536, n.push(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), n.push(w);
    } else
      n.push(s);
    n.length >= 4096 && (t += D.apply(String, n), n.length = 0);
  }
  return n.length > 0 && (t += D.apply(String, n)), t;
}
function Je(e) {
  let t = new Array(e);
  for (let r = 0; r < e; r++)
    t[r] = P();
  return M.freezeData ? Object.freeze(t) : t;
}
function He(e) {
  if (M.mapsAsObjects) {
    let t = {};
    for (let r = 0; r < e; r++) {
      let n = lt();
      n === "__proto__" && (n = "__proto_"), t[n] = P();
    }
    return t;
  } else {
    let t = /* @__PURE__ */ new Map();
    for (let r = 0; r < e; r++)
      t.set(P(), P());
    return t;
  }
}
var D = String.fromCharCode;
function ct(e) {
  let t = i, r = new Array(e);
  for (let n = 0; n < e; n++) {
    const s = x[i++];
    if ((s & 128) > 0) {
      i = t;
      return;
    }
    r[n] = s;
  }
  return D.apply(String, r);
}
function _e(e) {
  if (e < 4)
    if (e < 2) {
      if (e === 0)
        return "";
      {
        let t = x[i++];
        if ((t & 128) > 1) {
          i -= 1;
          return;
        }
        return D(t);
      }
    } else {
      let t = x[i++], r = x[i++];
      if ((t & 128) > 0 || (r & 128) > 0) {
        i -= 2;
        return;
      }
      if (e < 3)
        return D(t, r);
      let n = x[i++];
      if ((n & 128) > 0) {
        i -= 3;
        return;
      }
      return D(t, r, n);
    }
  else {
    let t = x[i++], r = x[i++], n = x[i++], s = x[i++];
    if ((t & 128) > 0 || (r & 128) > 0 || (n & 128) > 0 || (s & 128) > 0) {
      i -= 4;
      return;
    }
    if (e < 6) {
      if (e === 4)
        return D(t, r, n, s);
      {
        let c = x[i++];
        if ((c & 128) > 0) {
          i -= 5;
          return;
        }
        return D(t, r, n, s, c);
      }
    } else if (e < 8) {
      let c = x[i++], l = x[i++];
      if ((c & 128) > 0 || (l & 128) > 0) {
        i -= 6;
        return;
      }
      if (e < 7)
        return D(t, r, n, s, c, l);
      let h = x[i++];
      if ((h & 128) > 0) {
        i -= 7;
        return;
      }
      return D(t, r, n, s, c, l, h);
    } else {
      let c = x[i++], l = x[i++], h = x[i++], w = x[i++];
      if ((c & 128) > 0 || (l & 128) > 0 || (h & 128) > 0 || (w & 128) > 0) {
        i -= 8;
        return;
      }
      if (e < 10) {
        if (e === 8)
          return D(t, r, n, s, c, l, h, w);
        {
          let A = x[i++];
          if ((A & 128) > 0) {
            i -= 9;
            return;
          }
          return D(t, r, n, s, c, l, h, w, A);
        }
      } else if (e < 12) {
        let A = x[i++], p = x[i++];
        if ((A & 128) > 0 || (p & 128) > 0) {
          i -= 10;
          return;
        }
        if (e < 11)
          return D(t, r, n, s, c, l, h, w, A, p);
        let b = x[i++];
        if ((b & 128) > 0) {
          i -= 11;
          return;
        }
        return D(t, r, n, s, c, l, h, w, A, p, b);
      } else {
        let A = x[i++], p = x[i++], b = x[i++], I = x[i++];
        if ((A & 128) > 0 || (p & 128) > 0 || (b & 128) > 0 || (I & 128) > 0) {
          i -= 12;
          return;
        }
        if (e < 14) {
          if (e === 12)
            return D(t, r, n, s, c, l, h, w, A, p, b, I);
          {
            let L = x[i++];
            if ((L & 128) > 0) {
              i -= 13;
              return;
            }
            return D(t, r, n, s, c, l, h, w, A, p, b, I, L);
          }
        } else {
          let L = x[i++], q = x[i++];
          if ((L & 128) > 0 || (q & 128) > 0) {
            i -= 14;
            return;
          }
          if (e < 15)
            return D(t, r, n, s, c, l, h, w, A, p, b, I, L, q);
          let V = x[i++];
          if ((V & 128) > 0) {
            i -= 15;
            return;
          }
          return D(t, r, n, s, c, l, h, w, A, p, b, I, L, q, V);
        }
      }
    }
  }
}
function Qe() {
  let e = x[i++], t;
  if (e < 192)
    t = e - 160;
  else
    switch (e) {
      case 217:
        t = x[i++];
        break;
      case 218:
        t = B.getUint16(i), i += 2;
        break;
      case 219:
        t = B.getUint32(i), i += 4;
        break;
      default:
        throw new Error("Expected string");
    }
  return fe(t);
}
function Se(e) {
  return M.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(x, i, i += e)
  ) : x.subarray(i, i += e);
}
function v(e) {
  let t = x[i++];
  if (j[t]) {
    let r;
    return j[t](x.subarray(i, r = i += e), (n) => {
      i = n;
      try {
        return P();
      } finally {
        i = r;
      }
    });
  } else
    throw new Error("Unknown extension type " + t);
}
var Ye = new Array(4096);
function lt() {
  let e = x[i++];
  if (e >= 160 && e < 192) {
    if (e = e - 160, z >= i)
      return K.slice(i - $, (i += e) - $);
    if (!(z == 0 && J < 180))
      return me(e);
  } else
    return i--, ut(P());
  let t = (e << 5 ^ (e > 1 ? B.getUint16(i) : e > 0 ? x[i] : 0)) & 4095, r = Ye[t], n = i, s = i + e - 3, c, l = 0;
  if (r && r.bytes == e) {
    for (; n < s; ) {
      if (c = B.getUint32(n), c != r[l++]) {
        n = 1879048192;
        break;
      }
      n += 4;
    }
    for (s += 3; n < s; )
      if (c = x[n++], c != r[l++]) {
        n = 1879048192;
        break;
      }
    if (n === s)
      return i = n, r.string;
    s -= 3, n = i;
  }
  for (r = [], Ye[t] = r, r.bytes = e; n < s; )
    c = B.getUint32(n), r.push(c), n += 4;
  for (s += 3; n < s; )
    c = x[n++], r.push(c);
  let h = e < 16 ? _e(e) : ct(e);
  return h != null ? r.string = h : r.string = me(e);
}
function ut(e) {
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return e.toString();
  if (e == null) return e + "";
  throw new Error("Invalid property type for record", typeof e);
}
const Ge = (e, t) => {
  let r = P().map(ut), n = e;
  t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, r.highByte = t);
  let s = E[e];
  return s && (s.isShared || Z) && ((E.restoreStructures || (E.restoreStructures = []))[e] = s), E[e] = r, r.read = Me(r, n), r.read();
};
j[0] = () => {
};
j[0].noBuffer = !0;
j[66] = (e) => {
  let t = e.length, r = BigInt(e[0] & 128 ? e[0] - 256 : e[0]);
  for (let n = 1; n < t; n++)
    r <<= BigInt(8), r += BigInt(e[n]);
  return r;
};
let Kt = { Error, TypeError, ReferenceError };
j[101] = () => {
  let e = P();
  return (Kt[e[0]] || Error)(e[1], { cause: e[2] });
};
j[105] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4);
  H || (H = /* @__PURE__ */ new Map());
  let r = x[i], n;
  r >= 144 && r < 160 || r == 220 || r == 221 ? n = [] : n = {};
  let s = { target: n };
  H.set(t, s);
  let c = P();
  return s.used ? Object.assign(n, c) : (s.target = c, c);
};
j[112] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4), r = H.get(t);
  return r.used = !0, r.target;
};
j[115] = () => new Set(P());
const dt = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((e) => e + "Array");
let Zt = typeof globalThis == "object" ? globalThis : window;
j[116] = (e) => {
  let t = e[0], r = dt[t];
  if (!r) {
    if (t === 16) {
      let n = new ArrayBuffer(e.length - 1);
      return new Uint8Array(n).set(e.subarray(1)), n;
    }
    throw new Error("Could not find typed array for code " + t);
  }
  return new Zt[r](Uint8Array.prototype.slice.call(e, 1).buffer);
};
j[120] = () => {
  let e = P();
  return new RegExp(e[0], e[1]);
};
const vt = [];
j[98] = (e) => {
  let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], r = i;
  return i += t - e.length, N = vt, N = [Qe(), Qe()], N.position0 = 0, N.position1 = 0, N.postBundlePosition = i, i = r, P();
};
j[255] = (e) => e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(
  ((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3
) : e.length == 12 ? new Date(
  ((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3
) : /* @__PURE__ */ new Date("invalid");
function xt(e) {
  let t = J, r = i, n = $, s = z, c = K, l = H, h = N, w = new Uint8Array(x.slice(0, J)), A = E, p = E.slice(0, E.length), b = M, I = Z, L = e();
  return J = t, i = r, $ = n, z = s, K = c, H = l, N = h, x = w, Z = I, E = A, E.splice(0, E.length, ...p), M = b, B = new DataView(x.buffer, x.byteOffset, x.byteLength), L;
}
function Ae() {
  x = null, H = null, E = null;
}
const Re = new Array(147);
for (let e = 0; e < 256; e++)
  Re[e] = +("1e" + Math.floor(45.15 - e * 0.30103));
var he = new se({ useRecords: !1 });
he.unpack;
he.unpackMultiple;
he.unpack;
let Xt = new Float32Array(1);
new Uint8Array(Xt.buffer, 0, 4);
let ue;
try {
  ue = new TextEncoder();
} catch {
}
let Be, gt;
const ye = typeof Buffer < "u", le = ye ? function(e) {
  return Buffer.allocUnsafeSlow(e);
} : Uint8Array, ht = ye ? Buffer : Uint8Array, Ke = ye ? 4294967296 : 2144337920;
let a, ne, O, f = 0, C, _ = null, Wt;
const er = 21760, tr = /[\u0080-\uFFFF]/, X = Symbol("record-id");
class Pe extends se {
  constructor(t) {
    super(t), this.offset = 0;
    let r, n, s, c, l = ht.prototype.utf8Write ? function(o, y) {
      return a.utf8Write(o, y, a.byteLength - y);
    } : ue && ue.encodeInto ? function(o, y) {
      return ue.encodeInto(o, a.subarray(y)).written;
    } : !1, h = this;
    t || (t = {});
    let w = t && t.sequential, A = t.structures || t.saveStructures, p = t.maxSharedStructures;
    if (p == null && (p = A ? 32 : 0), p > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    t.structuredClone && t.moreTypes == null && (this.moreTypes = !0);
    let b = t.maxOwnStructures;
    b == null && (b = A ? 32 : 64), !this.structures && t.useRecords != !1 && (this.structures = []);
    let I = p > 32 || b + p > 64, L = p + 64, q = p + b + 64;
    if (q > 8256)
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    let V = [], te = 0, ae = 0;
    this.pack = this.encode = function(o, y) {
      if (a || (a = new le(8192), O = a.dataView || (a.dataView = new DataView(a.buffer, 0, 8192)), f = 0), C = a.length - 10, C - f < 2048 ? (a = new le(a.length), O = a.dataView || (a.dataView = new DataView(a.buffer, 0, a.length)), C = a.length - 10, f = 0) : f = f + 7 & 2147483640, r = f, y & ar && (f += y & 255), c = h.structuredClone ? /* @__PURE__ */ new Map() : null, h.bundleStrings && typeof o != "string" ? (_ = [], _.size = 1 / 0) : _ = null, s = h.structures, s) {
        s.uninitialized && (s = h._mergeStructures(h.getStructures()));
        let u = s.sharedLength || 0;
        if (u > p)
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + s.sharedLength);
        if (!s.transitions) {
          s.transitions = /* @__PURE__ */ Object.create(null);
          for (let g = 0; g < u; g++) {
            let S = s[g];
            if (!S)
              continue;
            let U, m = s.transitions;
            for (let T = 0, k = S.length; T < k; T++) {
              let F = S[T];
              U = m[F], U || (U = m[F] = /* @__PURE__ */ Object.create(null)), m = U;
            }
            m[X] = g + 64;
          }
          this.lastNamedStructuresLength = u;
        }
        w || (s.nextId = u + 64);
      }
      n && (n = !1);
      let d;
      try {
        h.randomAccessStructure && o && o.constructor && o.constructor === Object ? Bt(o) : R(o);
        let u = _;
        if (_ && Xe(r, R, 0), c && c.idsToInsert) {
          let g = c.idsToInsert.sort((T, k) => T.offset > k.offset ? 1 : -1), S = g.length, U = -1;
          for (; u && S > 0; ) {
            let T = g[--S].offset + r;
            T < u.stringsPosition + r && U === -1 && (U = 0), T > u.position + r ? U >= 0 && (U += 6) : (U >= 0 && (O.setUint32(
              u.position + r,
              O.getUint32(u.position + r) + U
            ), U = -1), u = u.previous, S++);
          }
          U >= 0 && u && O.setUint32(
            u.position + r,
            O.getUint32(u.position + r) + U
          ), f += g.length * 6, f > C && Q(f), h.offset = f;
          let m = nr(a.subarray(r, f), g);
          return c = null, m;
        }
        return h.offset = f, y & ir ? (a.start = r, a.end = f, a) : a.subarray(r, f);
      } catch (u) {
        throw d = u, u;
      } finally {
        if (s && (Ne(), n && h.saveStructures)) {
          let u = s.sharedLength || 0, g = a.subarray(r, f), S = sr(s, h);
          if (!d)
            return h.saveStructures(S, S.isCompatible) === !1 ? h.pack(o, y) : (h.lastNamedStructuresLength = u, a.length > 1073741824 && (a = null), g);
        }
        a.length > 1073741824 && (a = null), y & fr && (f = r);
      }
    };
    const Ne = () => {
      ae < 10 && ae++;
      let o = s.sharedLength || 0;
      if (s.length > o && !w && (s.length = o), te > 1e4)
        s.transitions = null, ae = 0, te = 0, V.length > 0 && (V = []);
      else if (V.length > 0 && !w) {
        for (let y = 0, d = V.length; y < d; y++)
          V[y][X] = 0;
        V = [];
      }
    }, we = (o) => {
      var y = o.length;
      y < 16 ? a[f++] = 144 | y : y < 65536 ? (a[f++] = 220, a[f++] = y >> 8, a[f++] = y & 255) : (a[f++] = 221, O.setUint32(f, y), f += 4);
      for (let d = 0; d < y; d++)
        R(o[d]);
    }, R = (o) => {
      f > C && (a = Q(f));
      var y = typeof o, d;
      if (y === "string") {
        let u = o.length;
        if (_ && u >= 4 && u < 4096) {
          if ((_.size += u) > er) {
            let m, T = (_[0] ? _[0].length * 3 + _[1].length : 0) + 10;
            f + T > C && (a = Q(f + T));
            let k;
            _.position ? (k = _, a[f] = 200, f += 3, a[f++] = 98, m = f - r, f += 4, Xe(r, R, 0), O.setUint16(m + r - 3, f - r - m)) : (a[f++] = 214, a[f++] = 98, m = f - r, f += 4), _ = ["", ""], _.previous = k, _.size = 0, _.position = m;
          }
          let U = tr.test(o);
          _[U ? 0 : 1] += o, a[f++] = 193, R(U ? -u : u);
          return;
        }
        let g;
        u < 32 ? g = 1 : u < 256 ? g = 2 : u < 65536 ? g = 3 : g = 5;
        let S = u * 3;
        if (f + S > C && (a = Q(f + S)), u < 64 || !l) {
          let U, m, T, k = f + g;
          for (U = 0; U < u; U++)
            m = o.charCodeAt(U), m < 128 ? a[k++] = m : m < 2048 ? (a[k++] = m >> 6 | 192, a[k++] = m & 63 | 128) : (m & 64512) === 55296 && ((T = o.charCodeAt(U + 1)) & 64512) === 56320 ? (m = 65536 + ((m & 1023) << 10) + (T & 1023), U++, a[k++] = m >> 18 | 240, a[k++] = m >> 12 & 63 | 128, a[k++] = m >> 6 & 63 | 128, a[k++] = m & 63 | 128) : (a[k++] = m >> 12 | 224, a[k++] = m >> 6 & 63 | 128, a[k++] = m & 63 | 128);
          d = k - f - g;
        } else
          d = l(o, f + g);
        d < 32 ? a[f++] = 160 | d : d < 256 ? (g < 2 && a.copyWithin(f + 2, f + 1, f + 1 + d), a[f++] = 217, a[f++] = d) : d < 65536 ? (g < 3 && a.copyWithin(f + 3, f + 2, f + 2 + d), a[f++] = 218, a[f++] = d >> 8, a[f++] = d & 255) : (g < 5 && a.copyWithin(f + 5, f + 3, f + 3 + d), a[f++] = 219, O.setUint32(f, d), f += 4), f += d;
      } else if (y === "number")
        if (o >>> 0 === o)
          o < 32 || o < 128 && this.useRecords === !1 || o < 64 && !this.randomAccessStructure ? a[f++] = o : o < 256 ? (a[f++] = 204, a[f++] = o) : o < 65536 ? (a[f++] = 205, a[f++] = o >> 8, a[f++] = o & 255) : (a[f++] = 206, O.setUint32(f, o), f += 4);
        else if (o >> 0 === o)
          o >= -32 ? a[f++] = 256 + o : o >= -128 ? (a[f++] = 208, a[f++] = o + 256) : o >= -32768 ? (a[f++] = 209, O.setInt16(f, o), f += 2) : (a[f++] = 210, O.setInt32(f, o), f += 4);
        else {
          let u;
          if ((u = this.useFloat32) > 0 && o < 4294967296 && o >= -2147483648) {
            a[f++] = 202, O.setFloat32(f, o);
            let g;
            if (u < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (g = o * Re[(a[f] & 127) << 1 | a[f + 1] >> 7]) >> 0 === g) {
              f += 4;
              return;
            } else
              f--;
          }
          a[f++] = 203, O.setFloat64(f, o), f += 8;
        }
      else if (y === "object" || y === "function")
        if (!o)
          a[f++] = 192;
        else {
          if (c) {
            let g = c.get(o);
            if (g) {
              if (!g.id) {
                let S = c.idsToInsert || (c.idsToInsert = []);
                g.id = S.push(g);
              }
              a[f++] = 214, a[f++] = 112, O.setUint32(f, g.id), f += 4;
              return;
            } else
              c.set(o, { offset: f - r });
          }
          let u = o.constructor;
          if (u === Object)
            oe(o);
          else if (u === Array)
            we(o);
          else if (u === Map)
            if (this.mapAsEmptyObject) a[f++] = 128;
            else {
              d = o.size, d < 16 ? a[f++] = 128 | d : d < 65536 ? (a[f++] = 222, a[f++] = d >> 8, a[f++] = d & 255) : (a[f++] = 223, O.setUint32(f, d), f += 4);
              for (let [g, S] of o)
                R(g), R(S);
            }
          else {
            for (let g = 0, S = Be.length; g < S; g++) {
              let U = gt[g];
              if (o instanceof U) {
                let m = Be[g];
                if (m.write) {
                  m.type && (a[f++] = 212, a[f++] = m.type, a[f++] = 0);
                  let re = m.write.call(this, o);
                  re === o ? Array.isArray(o) ? we(o) : oe(o) : R(re);
                  return;
                }
                let T = a, k = O, F = f;
                a = null;
                let Y;
                try {
                  Y = m.pack.call(this, o, (re) => (a = T, T = null, f += re, f > C && Q(f), {
                    target: a,
                    targetView: O,
                    position: f - re
                  }), R);
                } finally {
                  T && (a = T, O = k, f = F, C = a.length - 10);
                }
                Y && (Y.length + f > C && Q(Y.length + f), f = rr(Y, a, f, m.type));
                return;
              }
            }
            if (Array.isArray(o))
              we(o);
            else {
              if (o.toJSON) {
                const g = o.toJSON();
                if (g !== o)
                  return R(g);
              }
              if (y === "function")
                return R(this.writeFunction && this.writeFunction(o));
              oe(o);
            }
          }
        }
      else if (y === "boolean")
        a[f++] = o ? 195 : 194;
      else if (y === "bigint") {
        if (o < BigInt(1) << BigInt(63) && o >= -(BigInt(1) << BigInt(63)))
          a[f++] = 211, O.setBigInt64(f, o);
        else if (o < BigInt(1) << BigInt(64) && o > 0)
          a[f++] = 207, O.setBigUint64(f, o);
        else if (this.largeBigIntToFloat)
          a[f++] = 203, O.setFloat64(f, Number(o));
        else {
          if (this.largeBigIntToString)
            return R(o.toString());
          if (this.useBigIntExtension && o < BigInt(2) ** BigInt(1023) && o > -(BigInt(2) ** BigInt(1023))) {
            a[f++] = 199, f++, a[f++] = 66;
            let u = [], g;
            do {
              let S = o & BigInt(255);
              g = (S & BigInt(128)) === (o < BigInt(0) ? BigInt(128) : BigInt(0)), u.push(S), o >>= BigInt(8);
            } while (!((o === BigInt(0) || o === BigInt(-1)) && g));
            a[f - 2] = u.length;
            for (let S = u.length; S > 0; )
              a[f++] = Number(u[--S]);
            return;
          } else
            throw new RangeError(o + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
        }
        f += 8;
      } else if (y === "undefined")
        this.encodeUndefinedAsNil ? a[f++] = 192 : (a[f++] = 212, a[f++] = 0, a[f++] = 0);
      else
        throw new Error("Unknown type: " + y);
    }, Ve = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (o) => {
      let y;
      if (this.skipValues) {
        y = [];
        for (let g in o)
          (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(g)) && !this.skipValues.includes(o[g]) && y.push(g);
      } else
        y = Object.keys(o);
      let d = y.length;
      d < 16 ? a[f++] = 128 | d : d < 65536 ? (a[f++] = 222, a[f++] = d >> 8, a[f++] = d & 255) : (a[f++] = 223, O.setUint32(f, d), f += 4);
      let u;
      if (this.coercibleKeyAsNumber)
        for (let g = 0; g < d; g++) {
          u = y[g];
          let S = Number(u);
          R(isNaN(S) ? u : S), R(o[u]);
        }
      else
        for (let g = 0; g < d; g++)
          R(u = y[g]), R(o[u]);
    } : (o) => {
      a[f++] = 222;
      let y = f - r;
      f += 2;
      let d = 0;
      for (let u in o)
        (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(u)) && (R(u), R(o[u]), d++);
      if (d > 65535)
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      a[y++ + r] = d >> 8, a[y + r] = d & 255;
    }, Ce = this.useRecords === !1 ? Ve : t.progressiveRecords && !I ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (o) => {
        let y, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = f++ - r, g;
        for (let S in o)
          if (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(S)) {
            if (y = d[S], y)
              d = y;
            else {
              let U = Object.keys(o), m = d;
              d = s.transitions;
              let T = 0;
              for (let k = 0, F = U.length; k < F; k++) {
                let Y = U[k];
                y = d[Y], y || (y = d[Y] = /* @__PURE__ */ Object.create(null), T++), d = y;
              }
              u + r + 1 == f ? (f--, pe(d, U, T)) : qe(d, U, u, T), g = !0, d = m[S];
            }
            R(o[S]);
          }
        if (!g) {
          let S = d[X];
          S ? a[u + r] = S : qe(d, Object.keys(o), u, 0);
        }
      }
    ) : (o) => {
      let y, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = 0;
      for (let S in o) (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(S)) && (y = d[S], y || (y = d[S] = /* @__PURE__ */ Object.create(null), u++), d = y);
      let g = d[X];
      g ? g >= 96 && I ? (a[f++] = ((g -= 96) & 31) + 96, a[f++] = g >> 5) : a[f++] = g : pe(d, d.__keys__ || Object.keys(o), u);
      for (let S in o)
        (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(S)) && R(o[S]);
    }, je = typeof this.useRecords == "function" && this.useRecords, oe = je ? (o) => {
      je(o) ? Ce(o) : Ve(o);
    } : Ce, Q = (o) => {
      let y;
      if (o > 16777216) {
        if (o - r > Ke)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        y = Math.min(
          Ke,
          Math.round(Math.max((o - r) * (o > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        y = (Math.max(o - r << 2, a.length - 1) >> 12) + 1 << 12;
      let d = new le(y);
      return O = d.dataView || (d.dataView = new DataView(d.buffer, 0, y)), o = Math.min(o, a.length), a.copy ? a.copy(d, 0, r, o) : d.set(a.slice(r, o)), f -= r, r = 0, C = d.length - 10, a = d;
    }, pe = (o, y, d) => {
      let u = s.nextId;
      u || (u = 64), u < L && this.shouldShareStructure && !this.shouldShareStructure(y) ? (u = s.nextOwnId, u < q || (u = L), s.nextOwnId = u + 1) : (u >= q && (u = L), s.nextId = u + 1);
      let g = y.highByte = u >= 96 && I ? u - 96 >> 5 : -1;
      o[X] = u, o.__keys__ = y, s[u - 64] = y, u < L ? (y.isShared = !0, s.sharedLength = u - 63, n = !0, g >= 0 ? (a[f++] = (u & 31) + 96, a[f++] = g) : a[f++] = u) : (g >= 0 ? (a[f++] = 213, a[f++] = 114, a[f++] = (u & 31) + 96, a[f++] = g) : (a[f++] = 212, a[f++] = 114, a[f++] = u), d && (te += ae * d), V.length >= b && (V.shift()[X] = 0), V.push(o), R(y));
    }, qe = (o, y, d, u) => {
      let g = a, S = f, U = C, m = r;
      a = ne, f = 0, r = 0, a || (ne = a = new le(8192)), C = a.length - 10, pe(o, y, u), ne = a;
      let T = f;
      if (a = g, f = S, C = U, r = m, T > 1) {
        let k = f + T - 1;
        k > C && Q(k);
        let F = d + r;
        a.copyWithin(F + T, F + 1, f), a.set(ne.slice(0, T), F), f = k;
      } else
        a[d + r] = ne[0];
    }, Bt = (o) => {
      let y = Wt(o, a, r, f, s, Q, (d, u, g) => {
        if (g)
          return n = !0;
        f = u;
        let S = a;
        return R(d), Ne(), S !== a ? { position: f, targetView: O, target: a } : f;
      }, this);
      if (y === 0)
        return oe(o);
      f = y;
    };
  }
  useBuffer(t) {
    a = t, a.dataView || (a.dataView = new DataView(a.buffer, a.byteOffset, a.byteLength)), f = 0;
  }
  set position(t) {
    f = t;
  }
  get position() {
    return f;
  }
  clearSharedData() {
    this.structures && (this.structures = []), this.typedStructs && (this.typedStructs = []);
  }
}
gt = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, it];
Be = [{
  pack(e, t, r) {
    let n = e.getTime() / 1e3;
    if ((this.useTimestamp32 || e.getMilliseconds() === 0) && n >= 0 && n < 4294967296) {
      let { target: s, targetView: c, position: l } = t(6);
      s[l++] = 214, s[l++] = 255, c.setUint32(l, n);
    } else if (n > 0 && n < 4294967296) {
      let { target: s, targetView: c, position: l } = t(10);
      s[l++] = 215, s[l++] = 255, c.setUint32(l, e.getMilliseconds() * 4e6 + (n / 1e3 / 4294967296 >> 0)), c.setUint32(l + 4, n);
    } else if (isNaN(n)) {
      if (this.onInvalidDate)
        return t(0), r(this.onInvalidDate());
      let { target: s, targetView: c, position: l } = t(3);
      s[l++] = 212, s[l++] = 255, s[l++] = 255;
    } else {
      let { target: s, targetView: c, position: l } = t(15);
      s[l++] = 199, s[l++] = 12, s[l++] = 255, c.setUint32(l, e.getMilliseconds() * 1e6), c.setBigInt64(l + 4, BigInt(Math.floor(n)));
    }
  }
}, {
  pack(e, t, r) {
    if (this.setAsEmptyObject)
      return t(0), r({});
    let n = Array.from(e), { target: s, position: c } = t(this.moreTypes ? 3 : 0);
    this.moreTypes && (s[c++] = 212, s[c++] = 115, s[c++] = 0), r(n);
  }
}, {
  pack(e, t, r) {
    let { target: n, position: s } = t(this.moreTypes ? 3 : 0);
    this.moreTypes && (n[s++] = 212, n[s++] = 101, n[s++] = 0), r([e.name, e.message, e.cause]);
  }
}, {
  pack(e, t, r) {
    let { target: n, position: s } = t(this.moreTypes ? 3 : 0);
    this.moreTypes && (n[s++] = 212, n[s++] = 120, n[s++] = 0), r([e.source, e.flags]);
  }
}, {
  pack(e, t) {
    this.moreTypes ? Ze(e, 16, t) : ve(ye ? Buffer.from(e) : new Uint8Array(e), t);
  }
}, {
  pack(e, t) {
    let r = e.constructor;
    r !== ht && this.moreTypes ? Ze(e, dt.indexOf(r.name), t) : ve(e, t);
  }
}, {
  pack(e, t) {
    let { target: r, position: n } = t(1);
    r[n] = 193;
  }
}];
function Ze(e, t, r, n) {
  let s = e.byteLength;
  if (s + 1 < 256) {
    var { target: c, position: l } = r(4 + s);
    c[l++] = 199, c[l++] = s + 1;
  } else if (s + 1 < 65536) {
    var { target: c, position: l } = r(5 + s);
    c[l++] = 200, c[l++] = s + 1 >> 8, c[l++] = s + 1 & 255;
  } else {
    var { target: c, position: l, targetView: h } = r(7 + s);
    c[l++] = 201, h.setUint32(l, s + 1), l += 4;
  }
  c[l++] = 116, c[l++] = t, e.buffer || (e = new Uint8Array(e)), c.set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), l);
}
function ve(e, t) {
  let r = e.byteLength;
  var n, s;
  if (r < 256) {
    var { target: n, position: s } = t(r + 2);
    n[s++] = 196, n[s++] = r;
  } else if (r < 65536) {
    var { target: n, position: s } = t(r + 3);
    n[s++] = 197, n[s++] = r >> 8, n[s++] = r & 255;
  } else {
    var { target: n, position: s, targetView: c } = t(r + 5);
    n[s++] = 198, c.setUint32(s, r), s += 4;
  }
  n.set(e, s);
}
function rr(e, t, r, n) {
  let s = e.length;
  switch (s) {
    case 1:
      t[r++] = 212;
      break;
    case 2:
      t[r++] = 213;
      break;
    case 4:
      t[r++] = 214;
      break;
    case 8:
      t[r++] = 215;
      break;
    case 16:
      t[r++] = 216;
      break;
    default:
      s < 256 ? (t[r++] = 199, t[r++] = s) : s < 65536 ? (t[r++] = 200, t[r++] = s >> 8, t[r++] = s & 255) : (t[r++] = 201, t[r++] = s >> 24, t[r++] = s >> 16 & 255, t[r++] = s >> 8 & 255, t[r++] = s & 255);
  }
  return t[r++] = n, t.set(e, r), r += s, r;
}
function nr(e, t) {
  let r, n = t.length * 6, s = e.length - n;
  for (; r = t.pop(); ) {
    let c = r.offset, l = r.id;
    e.copyWithin(c + n, c, s), n -= 6;
    let h = c + n;
    e[h++] = 214, e[h++] = 105, e[h++] = l >> 24, e[h++] = l >> 16 & 255, e[h++] = l >> 8 & 255, e[h++] = l & 255, s = c;
  }
  return e;
}
function Xe(e, t, r) {
  if (_.length > 0) {
    O.setUint32(_.position + e, f + r - _.position - e), _.stringsPosition = f - e;
    let n = _;
    _ = null, t(n[0]), t(n[1]);
  }
}
function sr(e, t) {
  return e.isCompatible = (r) => {
    let n = !r || (t.lastNamedStructuresLength || 0) === r.length;
    return n || t._mergeStructures(r), n;
  }, e;
}
let yt = new Pe({ useRecords: !1 });
yt.pack;
yt.pack;
const ir = 512, fr = 1024, ar = 2048, or = (e) => new Pe({ structuredClone: !0 }).unpack(new Uint8Array(e));
function cr(e) {
  return Ie(e) ? ur(e) : lr(e);
}
async function lr(e) {
  const t = await ee(e);
  return ke(t);
}
function ur(e) {
  const t = Oe(e);
  return ke(t);
}
const wt = (e, t = "application/octet-stream") => e instanceof Blob ? e : e instanceof ArrayBuffer ? new Blob([e], { type: t }) : typeof e == "string" ? new Blob([e], { type: t }) : ArrayBuffer.isView(e) ? new Blob([e], { type: t }) : Array.isArray(e) ? new Blob([Te(e)], { type: t }) : new Blob([]), dr = async (e) => {
  const t = wt(e), r = new FileReader();
  return new Promise((n, s) => {
    const c = (l) => typeof l == "string" ? n(l) : (console.log({ bytes: e }), s("Unable to convert to data URL"));
    r.onload = function(l) {
      c(l.target?.result);
    }, r.readAsDataURL(t);
  });
}, xr = (e) => {
  const t = new Pe({ structuredClone: !0 });
  return new Uint8Array(t.encode(e));
}, gr = (e) => {
  if (e instanceof Blob)
    return "Blob";
  if (e instanceof ArrayBuffer)
    return "ArrayBuffer";
  if (typeof e == "string")
    return "string";
  if (ArrayBuffer.isView(e))
    return "ArrayBufferView";
  if (Array.isArray(e))
    return "Array";
}, hr = (e) => new TextEncoder().encode(e), G = {
  toMsgPack: xr,
  msgPackToObject: or,
  typeOfBytes: gr,
  toDataUrl: dr,
  dataUrlToBlob: qt,
  lengthOf: zt,
  isByteLike: Ft,
  isImmediateByteLike: Ie,
  hashOf: ge,
  immediateHashOf: $t,
  addressStringOf: de,
  toArrayBuffer: ee,
  immediateToArrayBuffer: Oe,
  toBlob: wt,
  toText: st,
  toBase64: cr,
  encodeAsString: nt,
  test: Dt,
  assignMediaTypeToBlob: Ct,
  utf8ToUint8Array: hr,
  base64ToArrayBuffer: jt,
  arrayBufferToHex: Nt,
  arrayBufferToUtf8: Vt,
  arrayBufferToBase64: ke,
  ALL_ALGORITHMS: Ee,
  ALGORITHM_BYTE_LENGTHS: tt
}, yr = (e) => typeof e == "function", pt = (e) => e == null || Number.isNaN(e), St = (e) => !pt(e), wr = (e) => yr(e) ? e() : e, pr = (e, t = {}) => {
  const { quiet: r = !1, def: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (c) {
    return r || (console.error(c), St(s) && console.log(wr(s))), n;
  }
}, Sr = {
  isDefined: St,
  isUndefined: pt,
  safe: pr
}, { isDefined: Le, isUndefined: br, safe: bt } = Sr, De = (e) => {
  const { message: t, stack: r, extra: n, cause: s } = e, c = s ? `
Caused by: ${De(s)}` : "", l = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(Le).join(`
`) + l + c;
}, mt = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? De(e) : bt(() => JSON.stringify(e, void 0, 2)) ?? "", mr = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? De(e) : bt(() => JSON.stringify(e, void 0, 2)) ?? "";
}, At = ({ error: e, extra: t, stack: r }) => {
  if (e instanceof Error) {
    const n = Le(e.cause) ? At({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? r,
      extra: t,
      cause: n
    };
  }
  return {
    message: mt(e),
    stack: r,
    extra: t
  };
}, Ar = {
  errorToErrorDetail: At,
  errorToText: mt,
  errorToTextAsync: mr
}, We = async ({
  channel: e,
  subject: t,
  connectionListener: r,
  options: n = {}
}) => {
  const { log: s = () => {
  }, signal: c } = n;
  s("connectConnectionListenerToSubject: subject: ", t);
  for await (const l of e.listenOn(t, {
    callback: async (h) => {
      const w = G.msgPackToObject(h), { data: A, meta: p } = w;
      if (kt(w))
        throw console.error("Error in message: ", w), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${w?.data?.message}`
        );
      try {
        const b = await r(A, {
          headers: p?.headers,
          signal: c
        });
        return G.toMsgPack({
          data: b
        });
      } catch (b) {
        const I = Ar.errorToErrorDetail({ error: b });
        return G.toMsgPack({
          data: I,
          meta: {
            hasError: !0,
            code: 500,
            status: I.message
          }
        });
      }
    }
  }))
    ;
}, Tr = async ({
  channel: e,
  subscribers: t = {},
  options: r = {}
}) => {
  const { log: n = () => {
  }, defaultTimeoutMs: s = 60 * 1e3, signal: c } = r, l = Object.entries(t);
  n("connect: subscribers: ", l);
  for (const [h, w] of l)
    br(w) || We({
      channel: e,
      subject: h,
      connectionListener: w,
      options: r
    });
  return {
    requestMany: async (h, w, A = {}) => {
      const { timeoutMs: p = 60 * 1e3, headers: b, callback: I } = A, L = G.toMsgPack({
        data: w,
        meta: { headers: b }
      }), q = await e.requestMany(
        h,
        L,
        {
          timeoutMs: p
        }
      );
      for await (const V of q) {
        if (c?.aborted)
          return;
        const te = G.msgPackToObject(V);
        await I?.(te);
      }
    },
    request: async (h, w, A = {}) => {
      const { timeoutMs: p = s, headers: b } = A, I = G.toMsgPack({
        data: w,
        meta: { headers: b }
      }), L = await e.request(h, I, {
        timeoutMs: p
      });
      return G.msgPackToObject(L);
    },
    publish: async (h, w, A = {}) => {
      const { headers: p } = A, b = G.toMsgPack({
        data: w,
        meta: { headers: p }
      });
      return e.postOn(h, b);
    },
    subscribe: async (h, w, A = {}) => We({
      channel: e,
      subject: h,
      connectionListener: w,
      options: A
    })
  };
}, Br = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const r = {
    postOn: (n, s, c = {}) => {
      const { signal: l, reply: h } = c;
      e(l)({ subject: n, data: s, reply: h });
    },
    listenOn: function(n, s = {}) {
      const { signal: c, once: l, callback: h } = s, w = new AbortController();
      if (c?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      c?.addEventListener("abort", () => {
        w.abort();
      });
      const A = t(w.signal)(async (p) => {
        if (typeof n == "string" ? p.subject === n : n.test(p.subject)) {
          l && w.abort();
          const b = await h?.(p.data, {
            finished: p.finished ?? !1
          });
          if (p.reply && b && (et(b) ? (async () => {
            for await (const I of b)
              e(w.signal)({
                subject: p.reply,
                data: I
              });
            e(w.signal)({
              subject: p.reply,
              data: void 0,
              finished: !0
            });
          })() : e(w.signal)({
            subject: p.reply,
            data: b,
            finished: !0
          })), b && !et(b))
            return { ...p, data: b };
        }
        return p;
      });
      return async function* () {
        for await (const p of A)
          yield p.data;
      }();
    },
    request: async (n, s, c = {}) => {
      const { signal: l, timeoutMs: h } = c, w = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((A, p) => {
        l?.aborted && p(
          new Error(`request: Signal is already aborted for ${n}`)
        ), l?.addEventListener("abort", () => {
          p(new Error("Request aborted"));
        });
        let b;
        h && (b = setTimeout(() => {
          p(
            new Error(
              `request: Request timed out after ${h}ms for ${n}`
            )
          );
        }, h)), r.listenOn(w, {
          callback: (I) => {
            clearTimeout(b), A(I);
          },
          signal: l,
          once: !0
        }), r.postOn(n, s, { reply: w, signal: l });
      });
    },
    requestMany: async (n, s, c = {}) => {
      const { signal: l, timeoutMs: h, callback: w } = c, A = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((p, b) => {
        l?.aborted && b(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), l?.addEventListener("abort", () => {
          b(new Error("Request aborted"));
        });
        let I;
        h && (I = setTimeout(() => {
          b(
            new Error(
              `requestMany: Request timed out after ${h}ms for ${n}`
            )
          );
        }, h));
        const L = r.listenOn(A, {
          callback: (q, V) => {
            if (q !== void 0 && w?.(q), V.finished)
              return clearTimeout(I), p(L);
          },
          signal: l
        });
        return r.postOn(n, s, { reply: A, signal: l }), L;
      });
    }
  };
  return r;
};
function et(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const kr = (e, t = "channel_message") => Br({
  posterProducer: (r) => (n) => {
    r?.aborted || e.emit(t, n);
  },
  listenerProducer: (r) => (n) => {
    const s = [], c = {
      resolve: void 0
    }, l = async (h) => {
      if (r?.aborted)
        return;
      const w = await n?.(h), A = Le(w) ? w : h;
      s.push(A), c.resolve?.();
    };
    return r?.addEventListener("abort", () => {
      e.off(t, l);
    }), e.on(t, l), {
      [Symbol.asyncIterator]: async function* () {
        for (; !r?.aborted; )
          s.length > 0 ? yield s.shift() : await new Promise((h) => {
            c.resolve = h;
          });
      }
    };
  }
});
export {
  Br as Channel,
  kr as EmitterChannel,
  Tr as MessageBus,
  Ut as isError,
  kt as isErrorMsg,
  Tt as isMsg,
  Et as isValue,
  Ur as isValueOrError,
  Er as parseSubject
};

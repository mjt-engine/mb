const $r = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, Ot = (e) => "value" in e && e.value !== void 0, Mt = (e) => "error" in e && e.error !== void 0, jr = (e) => Ot(e) || Mt(e), Rt = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, Lt = (e) => {
  const t = e;
  return Rt(e) && t.meta?.hasError || !1;
}, st = {
  "SHA-256": 32,
  "SHA-512": 64
}, ke = ["SHA-256", "SHA-512"];
function Ie(e) {
  if (typeof e == "string")
    return e;
  const t = e();
  return typeof t == "string" ? t : (console.error("ASSERTION FAIL VALUE", t), "Assertion Failed");
}
function we(e, t = "Assertion failed") {
  if (!e)
    throw new Error(Ie(t));
}
const it = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => {
  throw new Error("assertEqualElements: Bitrotted");
}, _t = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => Array.isArray(e) && Array.isArray(t) ? it(e, t, r) : we(e === t, r), Pt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is equal to ${JSON.stringify(t)}`)) => we(e !== t, r);
function Dt(e, t, r = "Assertion failed: Required value is not of correct type") {
  if (!t(e))
    throw new Error(Ie(r));
  return e;
}
function qt(e, t = "Assertion failed: Reached what should be an unreachable section of code") {
  throw new Error(Ie(t));
}
function Nt(e) {
  return e != null && !Number.isNaN(e);
}
function Ct(e, t = "Assertion failed: Required value not defined") {
  return we(Nt(e), t), e;
}
const te = {
  assert: we,
  assertUnreachable: qt,
  assertValue: Ct,
  assertEqual: _t,
  assertNotEqual: Pt,
  assertEqualElements: it,
  assertType: Dt
}, Oe = (e) => {
  const t = e.flatMap((r) => typeof r == "number" ? [r] : JSON.stringify(r).split("").map((n) => n.codePointAt(0)));
  return new Float64Array(t.length).map((r, n) => t[n]);
}, re = async (e) => e instanceof ArrayBuffer ? e : e instanceof Blob ? e.arrayBuffer() : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? Oe(e) : new ArrayBuffer(0), pe = async ({ bytes: e, algorithm: t = "SHA-512" }) => {
  const r = await re(e);
  return crypto.subtle.digest(t, r);
}, at = async (e, t = 16) => {
  const r = await re(e);
  return [...new Uint8Array(r)].map((n) => n.toString(t).padStart(2, "0")).join("");
}, he = async ({ bytes: e, algorithm: t = "SHA-512", radix: r = 16 }) => {
  const n = await pe({ bytes: e, algorithm: t }), s = await at(n, r);
  return `${t}:${s}`;
}, Vt = ({ id: e }) => {
  const t = e.split(":");
  te.assert(t.length === 2);
  const [r, n] = t, s = atob(n), f = new Uint8Array(s.length);
  return s.split("").map((l) => l.charCodeAt(0)).forEach((l, x) => {
    f[x] = l;
  }), f;
}, ft = async (e) => {
  if (typeof e == "string")
    return e;
  const t = await re(e);
  return new TextDecoder().decode(t);
}, fe = [];
fe.push(async () => {
  const e = "test", t = await re(e), r = await ft(t);
  return te.assertEqual(e, r);
});
fe.push(async () => ke.map(async (e) => {
  const t = await pe({ bytes: "test", algorithm: e });
  return te.assertEqual(t.byteLength, st[e]);
}));
fe.push(async () => {
  {
    const e = await he({
      bytes: "test",
      algorithm: "SHA-256"
    });
    te.assertEqual(e, "SHA-256:n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=");
  }
  {
    const e = await he({
      bytes: "test",
      algorithm: "SHA-512"
    });
    te.assertEqual(e, "SHA-512:7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==");
  }
});
fe.push(async () => ke.map(async (e) => {
  const t = "test", r = await he({ bytes: t, algorithm: e }), n = new Uint8Array(await pe({ bytes: t, algorithm: e })), s = Vt({ id: r });
  return te.assertEqualElements(s, n);
}));
const $t = async () => {
  if ((await Promise.all(fe.map(async (t) => {
    try {
      return await t(), !0;
    } catch (r) {
      return console.error(r), !1;
    }
  }))).find((t) => t === !1))
    throw new Error("TESTS FAILED");
  return console.log("TESTS PASS"), !0;
};
function Me(e) {
  const t = new Uint8Array(e.slice(0));
  let r = "";
  for (let n = 0; n < t.length; n++)
    r += String.fromCharCode(t[n]);
  return btoa(r);
}
const jt = (e) => {
  const t = new Uint8Array(e), r = [];
  for (let n = 0; n < t.length; ++n)
    r.push(t[n].toString(16).padStart(2, "0"));
  return r.join("");
}, zt = (e) => new TextDecoder().decode(new Uint8Array(e)), Ft = (e, t) => e.slice(0, e.size, t), Jt = (e) => {
  const t = globalThis.atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}, Ht = (e) => {
  if (!e)
    return;
  const t = e.split(","), n = (t[0].match(/:(.*?);/) ?? [])[1], s = atob(t[1]);
  let f = s.length;
  const l = new Uint8Array(f);
  for (; f--; )
    l[f] = s.charCodeAt(f);
  return new Blob([l], { type: n });
}, Re = (e) => e instanceof ArrayBuffer ? e : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? Oe(e) : new ArrayBuffer(0), Kt = async (e, t) => {
  const r = Re(e);
  return crypto.subtle.digest(t, r);
}, Le = (e) => {
  const t = e;
  return !!(t instanceof ArrayBuffer || typeof t == "string" || ArrayBuffer.isView(t) || Array.isArray(t));
}, Qt = (e) => e instanceof Blob ? !0 : Le(e), Yt = (e) => {
  if (typeof e == "string")
    return e.length;
  if (e instanceof Blob)
    return e.size;
  if (e instanceof ArrayBuffer || ArrayBuffer.isView(e))
    return e.byteLength;
};
var Be;
try {
  Be = new TextDecoder();
} catch {
}
var g, J, i = 0, M = {}, E, v, j = 0, F = 0, N, H, $ = [], B, Fe = {
  useRecords: !1,
  mapsAsObjects: !0
};
class ot {
}
const ct = new ot();
ct.name = "MessagePack 0xC1";
var G = !1, lt = 2, vt;
try {
  new Function("");
} catch {
  lt = 1 / 0;
}
class ae {
  constructor(t) {
    t && (t.useRecords === !1 && t.mapsAsObjects === void 0 && (t.mapsAsObjects = !0), t.sequential && t.trusted !== !1 && (t.trusted = !0, !t.structures && t.useRecords != !1 && (t.structures = [], t.maxSharedStructures || (t.maxSharedStructures = 0))), t.structures ? t.structures.sharedLength = t.structures.length : t.getStructures && ((t.structures = []).uninitialized = !0, t.structures.sharedLength = 0), t.int64AsNumber && (t.int64AsType = "number")), Object.assign(this, t);
  }
  unpack(t, r) {
    if (g)
      return yt(() => (Ue(), this ? this.unpack(t, r) : ae.prototype.unpack.call(Fe, t, r)));
    !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < "u" ? Buffer.from(t) : new Uint8Array(t)), typeof r == "object" ? (J = r.end || t.length, i = r.start || 0) : (i = 0, J = r > -1 ? r : t.length), F = 0, v = null, N = null, g = t;
    try {
      B = t.dataView || (t.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength));
    } catch (n) {
      throw g = null, t instanceof Uint8Array ? n : new Error("Source must be a Uint8Array or Buffer but was a " + (t && typeof t == "object" ? t.constructor.name : typeof t));
    }
    if (this instanceof ae) {
      if (M = this, this.structures)
        return E = this.structures, ue(r);
      (!E || E.length > 0) && (E = []);
    } else
      M = Fe, (!E || E.length > 0) && (E = []);
    return ue(r);
  }
  unpackMultiple(t, r) {
    let n, s = 0;
    try {
      G = !0;
      let f = t.length, l = this ? this.unpack(t, f) : me.unpack(t, f);
      if (r) {
        if (r(l, s, i) === !1) return;
        for (; i < f; )
          if (s = i, r(ue(), s, i) === !1)
            return;
      } else {
        for (n = [l]; i < f; )
          s = i, n.push(ue());
        return n;
      }
    } catch (f) {
      throw f.lastPosition = s, f.values = n, f;
    } finally {
      G = !1, Ue();
    }
  }
  _mergeStructures(t, r) {
    t = t || [], Object.isFrozen(t) && (t = t.map((n) => n.slice(0)));
    for (let n = 0, s = t.length; n < s; n++) {
      let f = t[n];
      f && (f.isShared = !0, n >= 32 && (f.highByte = n - 32 >> 5));
    }
    t.sharedLength = t.length;
    for (let n in r || [])
      if (n >= 0) {
        let s = t[n], f = r[n];
        f && (s && ((t.restoreStructures || (t.restoreStructures = []))[n] = s), t[n] = f);
      }
    return this.structures = t;
  }
  decode(t, r) {
    return this.unpack(t, r);
  }
}
function ue(e) {
  try {
    if (!M.trusted && !G) {
      let r = E.sharedLength || 0;
      r < E.length && (E.length = r);
    }
    let t;
    if (M.randomAccessStructure && g[i] < 64 && g[i] >= 32 && vt || (t = _()), N && (i = N.postBundlePosition, N = null), G && (E.restoreStructures = null), i == J)
      E && E.restoreStructures && Je(), E = null, g = null, H && (H = null);
    else {
      if (i > J)
        throw new Error("Unexpected end of MessagePack data");
      if (!G) {
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
    throw E && E.restoreStructures && Je(), Ue(), (t instanceof RangeError || t.message.startsWith("Unexpected end of buffer") || i > J) && (t.incomplete = !0), t;
  }
}
function Je() {
  for (let e in E.restoreStructures)
    E[e] = E.restoreStructures[e];
  E.restoreStructures = null;
}
function _() {
  let e = g[i++];
  if (e < 160)
    if (e < 128) {
      if (e < 64)
        return e;
      {
        let t = E[e & 63] || M.getStructures && ut()[e & 63];
        return t ? (t.read || (t.read = _e(t, e & 63)), t.read()) : e;
      }
    } else if (e < 144)
      if (e -= 128, M.mapsAsObjects) {
        let t = {};
        for (let r = 0; r < e; r++) {
          let n = xt();
          n === "__proto__" && (n = "__proto_"), t[n] = _();
        }
        return t;
      } else {
        let t = /* @__PURE__ */ new Map();
        for (let r = 0; r < e; r++)
          t.set(_(), _());
        return t;
      }
    else {
      e -= 144;
      let t = new Array(e);
      for (let r = 0; r < e; r++)
        t[r] = _();
      return M.freezeData ? Object.freeze(t) : t;
    }
  else if (e < 192) {
    let t = e - 160;
    if (F >= i)
      return v.slice(i - j, (i += t) - j);
    if (F == 0 && J < 140) {
      let r = t < 16 ? Pe(t) : dt(t);
      if (r != null)
        return r;
    }
    return Ee(t);
  } else {
    let t;
    switch (e) {
      case 192:
        return null;
      case 193:
        return N ? (t = _(), t > 0 ? N[1].slice(N.position1, N.position1 += t) : N[0].slice(N.position0, N.position0 -= t)) : ct;
      // "never-used", return special object to denote that
      case 194:
        return !1;
      case 195:
        return !0;
      case 196:
        if (t = g[i++], t === void 0)
          throw new Error("Unexpected end of buffer");
        return Ae(t);
      case 197:
        return t = B.getUint16(i), i += 2, Ae(t);
      case 198:
        return t = B.getUint32(i), i += 4, Ae(t);
      case 199:
        return X(g[i++]);
      case 200:
        return t = B.getUint16(i), i += 2, X(t);
      case 201:
        return t = B.getUint32(i), i += 4, X(t);
      case 202:
        if (t = B.getFloat32(i), M.useFloat32 > 2) {
          let r = De[(g[i] & 127) << 1 | g[i + 1] >> 7];
          return i += 4, (r * t + (t > 0 ? 0.5 : -0.5) >> 0) / r;
        }
        return i += 4, t;
      case 203:
        return t = B.getFloat64(i), i += 8, t;
      // uint handlers
      case 204:
        return g[i++];
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
        if (t = g[i++], t == 114)
          return Ge(g[i++] & 63);
        {
          let r = $[t];
          if (r)
            return r.read ? (i++, r.read(_())) : r.noBuffer ? (i++, r()) : r(g.subarray(i, ++i));
          throw new Error("Unknown extension " + t);
        }
      case 213:
        return t = g[i], t == 114 ? (i++, Ge(g[i++] & 63, g[i++])) : X(2);
      case 214:
        return X(4);
      case 215:
        return X(8);
      case 216:
        return X(16);
      case 217:
        return t = g[i++], F >= i ? v.slice(i - j, (i += t) - j) : Zt(t);
      case 218:
        return t = B.getUint16(i), i += 2, F >= i ? v.slice(i - j, (i += t) - j) : Xt(t);
      case 219:
        return t = B.getUint32(i), i += 4, F >= i ? v.slice(i - j, (i += t) - j) : Wt(t);
      case 220:
        return t = B.getUint16(i), i += 2, Ke(t);
      case 221:
        return t = B.getUint32(i), i += 4, Ke(t);
      case 222:
        return t = B.getUint16(i), i += 2, Qe(t);
      case 223:
        return t = B.getUint32(i), i += 4, Qe(t);
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
const Gt = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function _e(e, t) {
  function r() {
    if (r.count++ > lt) {
      let s = e.read = new Function("r", "return function(){return " + (M.freezeData ? "Object.freeze" : "") + "({" + e.map((f) => f === "__proto__" ? "__proto_:r()" : Gt.test(f) ? f + ":r()" : "[" + JSON.stringify(f) + "]:r()").join(",") + "})}")(_);
      return e.highByte === 0 && (e.read = He(t, e.read)), s();
    }
    let n = {};
    for (let s = 0, f = e.length; s < f; s++) {
      let l = e[s];
      l === "__proto__" && (l = "__proto_"), n[l] = _();
    }
    return M.freezeData ? Object.freeze(n) : n;
  }
  return r.count = 0, e.highByte === 0 ? He(t, r) : r;
}
const He = (e, t) => function() {
  let r = g[i++];
  if (r === 0)
    return t();
  let n = e < 32 ? -(e + (r << 5)) : e + (r << 5), s = E[n] || ut()[n];
  if (!s)
    throw new Error("Record id is not defined for " + n);
  return s.read || (s.read = _e(s, e)), s.read();
};
function ut() {
  let e = yt(() => (g = null, M.getStructures()));
  return E = M._mergeStructures(e, E);
}
var Ee = oe, Zt = oe, Xt = oe, Wt = oe;
function oe(e) {
  let t;
  if (e < 16 && (t = Pe(e)))
    return t;
  if (e > 64 && Be)
    return Be.decode(g.subarray(i, i += e));
  const r = i + e, n = [];
  for (t = ""; i < r; ) {
    const s = g[i++];
    if ((s & 128) === 0)
      n.push(s);
    else if ((s & 224) === 192) {
      const f = g[i++] & 63;
      n.push((s & 31) << 6 | f);
    } else if ((s & 240) === 224) {
      const f = g[i++] & 63, l = g[i++] & 63;
      n.push((s & 31) << 12 | f << 6 | l);
    } else if ((s & 248) === 240) {
      const f = g[i++] & 63, l = g[i++] & 63, x = g[i++] & 63;
      let w = (s & 7) << 18 | f << 12 | l << 6 | x;
      w > 65535 && (w -= 65536, n.push(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), n.push(w);
    } else
      n.push(s);
    n.length >= 4096 && (t += q.apply(String, n), n.length = 0);
  }
  return n.length > 0 && (t += q.apply(String, n)), t;
}
function Ke(e) {
  let t = new Array(e);
  for (let r = 0; r < e; r++)
    t[r] = _();
  return M.freezeData ? Object.freeze(t) : t;
}
function Qe(e) {
  if (M.mapsAsObjects) {
    let t = {};
    for (let r = 0; r < e; r++) {
      let n = xt();
      n === "__proto__" && (n = "__proto_"), t[n] = _();
    }
    return t;
  } else {
    let t = /* @__PURE__ */ new Map();
    for (let r = 0; r < e; r++)
      t.set(_(), _());
    return t;
  }
}
var q = String.fromCharCode;
function dt(e) {
  let t = i, r = new Array(e);
  for (let n = 0; n < e; n++) {
    const s = g[i++];
    if ((s & 128) > 0) {
      i = t;
      return;
    }
    r[n] = s;
  }
  return q.apply(String, r);
}
function Pe(e) {
  if (e < 4)
    if (e < 2) {
      if (e === 0)
        return "";
      {
        let t = g[i++];
        if ((t & 128) > 1) {
          i -= 1;
          return;
        }
        return q(t);
      }
    } else {
      let t = g[i++], r = g[i++];
      if ((t & 128) > 0 || (r & 128) > 0) {
        i -= 2;
        return;
      }
      if (e < 3)
        return q(t, r);
      let n = g[i++];
      if ((n & 128) > 0) {
        i -= 3;
        return;
      }
      return q(t, r, n);
    }
  else {
    let t = g[i++], r = g[i++], n = g[i++], s = g[i++];
    if ((t & 128) > 0 || (r & 128) > 0 || (n & 128) > 0 || (s & 128) > 0) {
      i -= 4;
      return;
    }
    if (e < 6) {
      if (e === 4)
        return q(t, r, n, s);
      {
        let f = g[i++];
        if ((f & 128) > 0) {
          i -= 5;
          return;
        }
        return q(t, r, n, s, f);
      }
    } else if (e < 8) {
      let f = g[i++], l = g[i++];
      if ((f & 128) > 0 || (l & 128) > 0) {
        i -= 6;
        return;
      }
      if (e < 7)
        return q(t, r, n, s, f, l);
      let x = g[i++];
      if ((x & 128) > 0) {
        i -= 7;
        return;
      }
      return q(t, r, n, s, f, l, x);
    } else {
      let f = g[i++], l = g[i++], x = g[i++], w = g[i++];
      if ((f & 128) > 0 || (l & 128) > 0 || (x & 128) > 0 || (w & 128) > 0) {
        i -= 8;
        return;
      }
      if (e < 10) {
        if (e === 8)
          return q(t, r, n, s, f, l, x, w);
        {
          let b = g[i++];
          if ((b & 128) > 0) {
            i -= 9;
            return;
          }
          return q(t, r, n, s, f, l, x, w, b);
        }
      } else if (e < 12) {
        let b = g[i++], p = g[i++];
        if ((b & 128) > 0 || (p & 128) > 0) {
          i -= 10;
          return;
        }
        if (e < 11)
          return q(t, r, n, s, f, l, x, w, b, p);
        let m = g[i++];
        if ((m & 128) > 0) {
          i -= 11;
          return;
        }
        return q(t, r, n, s, f, l, x, w, b, p, m);
      } else {
        let b = g[i++], p = g[i++], m = g[i++], I = g[i++];
        if ((b & 128) > 0 || (p & 128) > 0 || (m & 128) > 0 || (I & 128) > 0) {
          i -= 12;
          return;
        }
        if (e < 14) {
          if (e === 12)
            return q(t, r, n, s, f, l, x, w, b, p, m, I);
          {
            let P = g[i++];
            if ((P & 128) > 0) {
              i -= 13;
              return;
            }
            return q(t, r, n, s, f, l, x, w, b, p, m, I, P);
          }
        } else {
          let P = g[i++], C = g[i++];
          if ((P & 128) > 0 || (C & 128) > 0) {
            i -= 14;
            return;
          }
          if (e < 15)
            return q(t, r, n, s, f, l, x, w, b, p, m, I, P, C);
          let D = g[i++];
          if ((D & 128) > 0) {
            i -= 15;
            return;
          }
          return q(t, r, n, s, f, l, x, w, b, p, m, I, P, C, D);
        }
      }
    }
  }
}
function Ye() {
  let e = g[i++], t;
  if (e < 192)
    t = e - 160;
  else
    switch (e) {
      case 217:
        t = g[i++];
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
  return oe(t);
}
function Ae(e) {
  return M.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(g, i, i += e)
  ) : g.subarray(i, i += e);
}
function X(e) {
  let t = g[i++];
  if ($[t]) {
    let r;
    return $[t](g.subarray(i, r = i += e), (n) => {
      i = n;
      try {
        return _();
      } finally {
        i = r;
      }
    });
  } else
    throw new Error("Unknown extension type " + t);
}
var ve = new Array(4096);
function xt() {
  let e = g[i++];
  if (e >= 160 && e < 192) {
    if (e = e - 160, F >= i)
      return v.slice(i - j, (i += e) - j);
    if (!(F == 0 && J < 180))
      return Ee(e);
  } else
    return i--, gt(_());
  let t = (e << 5 ^ (e > 1 ? B.getUint16(i) : e > 0 ? g[i] : 0)) & 4095, r = ve[t], n = i, s = i + e - 3, f, l = 0;
  if (r && r.bytes == e) {
    for (; n < s; ) {
      if (f = B.getUint32(n), f != r[l++]) {
        n = 1879048192;
        break;
      }
      n += 4;
    }
    for (s += 3; n < s; )
      if (f = g[n++], f != r[l++]) {
        n = 1879048192;
        break;
      }
    if (n === s)
      return i = n, r.string;
    s -= 3, n = i;
  }
  for (r = [], ve[t] = r, r.bytes = e; n < s; )
    f = B.getUint32(n), r.push(f), n += 4;
  for (s += 3; n < s; )
    f = g[n++], r.push(f);
  let x = e < 16 ? Pe(e) : dt(e);
  return x != null ? r.string = x : r.string = Ee(e);
}
function gt(e) {
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return e.toString();
  if (e == null) return e + "";
  throw new Error("Invalid property type for record", typeof e);
}
const Ge = (e, t) => {
  let r = _().map(gt), n = e;
  t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, r.highByte = t);
  let s = E[e];
  return s && (s.isShared || G) && ((E.restoreStructures || (E.restoreStructures = []))[e] = s), E[e] = r, r.read = _e(r, n), r.read();
};
$[0] = () => {
};
$[0].noBuffer = !0;
$[66] = (e) => {
  let t = e.length, r = BigInt(e[0] & 128 ? e[0] - 256 : e[0]);
  for (let n = 1; n < t; n++)
    r <<= BigInt(8), r += BigInt(e[n]);
  return r;
};
let er = { Error, TypeError, ReferenceError };
$[101] = () => {
  let e = _();
  return (er[e[0]] || Error)(e[1], { cause: e[2] });
};
$[105] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4);
  H || (H = /* @__PURE__ */ new Map());
  let r = g[i], n;
  r >= 144 && r < 160 || r == 220 || r == 221 ? n = [] : n = {};
  let s = { target: n };
  H.set(t, s);
  let f = _();
  return s.used ? Object.assign(n, f) : (s.target = f, f);
};
$[112] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4), r = H.get(t);
  return r.used = !0, r.target;
};
$[115] = () => new Set(_());
const ht = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((e) => e + "Array");
let tr = typeof globalThis == "object" ? globalThis : window;
$[116] = (e) => {
  let t = e[0], r = ht[t];
  if (!r) {
    if (t === 16) {
      let n = new ArrayBuffer(e.length - 1);
      return new Uint8Array(n).set(e.subarray(1)), n;
    }
    throw new Error("Could not find typed array for code " + t);
  }
  return new tr[r](Uint8Array.prototype.slice.call(e, 1).buffer);
};
$[120] = () => {
  let e = _();
  return new RegExp(e[0], e[1]);
};
const rr = [];
$[98] = (e) => {
  let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], r = i;
  return i += t - e.length, N = rr, N = [Ye(), Ye()], N.position0 = 0, N.position1 = 0, N.postBundlePosition = i, i = r, _();
};
$[255] = (e) => e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(
  ((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3
) : e.length == 12 ? new Date(
  ((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3
) : /* @__PURE__ */ new Date("invalid");
function yt(e) {
  let t = J, r = i, n = j, s = F, f = v, l = H, x = N, w = new Uint8Array(g.slice(0, J)), b = E, p = E.slice(0, E.length), m = M, I = G, P = e();
  return J = t, i = r, j = n, F = s, v = f, H = l, N = x, g = w, G = I, E = b, E.splice(0, E.length, ...p), M = m, B = new DataView(g.buffer, g.byteOffset, g.byteLength), P;
}
function Ue() {
  g = null, H = null, E = null;
}
const De = new Array(147);
for (let e = 0; e < 256; e++)
  De[e] = +("1e" + Math.floor(45.15 - e * 0.30103));
var me = new ae({ useRecords: !1 });
me.unpack;
me.unpackMultiple;
me.unpack;
let nr = new Float32Array(1);
new Uint8Array(nr.buffer, 0, 4);
let ge;
try {
  ge = new TextEncoder();
} catch {
}
let Te, wt;
const Se = typeof Buffer < "u", de = Se ? function(e) {
  return Buffer.allocUnsafeSlow(e);
} : Uint8Array, pt = Se ? Buffer : Uint8Array, Ze = Se ? 4294967296 : 2144337920;
let o, ie, O, a = 0, V, R = null, sr;
const ir = 21760, ar = /[\u0080-\uFFFF]/, ee = Symbol("record-id");
class qe extends ae {
  constructor(t) {
    super(t), this.offset = 0;
    let r, n, s, f, l = pt.prototype.utf8Write ? function(c, y) {
      return o.utf8Write(c, y, o.byteLength - y);
    } : ge && ge.encodeInto ? function(c, y) {
      return ge.encodeInto(c, o.subarray(y)).written;
    } : !1, x = this;
    t || (t = {});
    let w = t && t.sequential, b = t.structures || t.saveStructures, p = t.maxSharedStructures;
    if (p == null && (p = b ? 32 : 0), p > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    t.structuredClone && t.moreTypes == null && (this.moreTypes = !0);
    let m = t.maxOwnStructures;
    m == null && (m = b ? 32 : 64), !this.structures && t.useRecords != !1 && (this.structures = []);
    let I = p > 32 || m + p > 64, P = p + 64, C = p + m + 64;
    if (C > 8256)
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    let D = [], Z = 0, W = 0;
    this.pack = this.encode = function(c, y) {
      if (o || (o = new de(8192), O = o.dataView || (o.dataView = new DataView(o.buffer, 0, 8192)), a = 0), V = o.length - 10, V - a < 2048 ? (o = new de(o.length), O = o.dataView || (o.dataView = new DataView(o.buffer, 0, o.length)), V = o.length - 10, a = 0) : a = a + 7 & 2147483640, r = a, y & dr && (a += y & 255), f = x.structuredClone ? /* @__PURE__ */ new Map() : null, x.bundleStrings && typeof c != "string" ? (R = [], R.size = 1 / 0) : R = null, s = x.structures, s) {
        s.uninitialized && (s = x._mergeStructures(x.getStructures()));
        let u = s.sharedLength || 0;
        if (u > p)
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + s.sharedLength);
        if (!s.transitions) {
          s.transitions = /* @__PURE__ */ Object.create(null);
          for (let h = 0; h < u; h++) {
            let S = s[h];
            if (!S)
              continue;
            let U, A = s.transitions;
            for (let T = 0, k = S.length; T < k; T++) {
              let z = S[T];
              U = A[z], U || (U = A[z] = /* @__PURE__ */ Object.create(null)), A = U;
            }
            A[ee] = h + 64;
          }
          this.lastNamedStructuresLength = u;
        }
        w || (s.nextId = u + 64);
      }
      n && (n = !1);
      let d;
      try {
        x.randomAccessStructure && c && c.constructor && c.constructor === Object ? It(c) : L(c);
        let u = R;
        if (R && et(r, L, 0), f && f.idsToInsert) {
          let h = f.idsToInsert.sort((T, k) => T.offset > k.offset ? 1 : -1), S = h.length, U = -1;
          for (; u && S > 0; ) {
            let T = h[--S].offset + r;
            T < u.stringsPosition + r && U === -1 && (U = 0), T > u.position + r ? U >= 0 && (U += 6) : (U >= 0 && (O.setUint32(
              u.position + r,
              O.getUint32(u.position + r) + U
            ), U = -1), u = u.previous, S++);
          }
          U >= 0 && u && O.setUint32(
            u.position + r,
            O.getUint32(u.position + r) + U
          ), a += h.length * 6, a > V && K(a), x.offset = a;
          let A = or(o.subarray(r, a), h);
          return f = null, A;
        }
        return x.offset = a, y & lr ? (o.start = r, o.end = a, o) : o.subarray(r, a);
      } catch (u) {
        throw d = u, u;
      } finally {
        if (s && (ce(), n && x.saveStructures)) {
          let u = s.sharedLength || 0, h = o.subarray(r, a), S = cr(s, x);
          if (!d)
            return x.saveStructures(S, S.isCompatible) === !1 ? x.pack(c, y) : (x.lastNamedStructuresLength = u, o.length > 1073741824 && (o = null), h);
        }
        o.length > 1073741824 && (o = null), y & ur && (a = r);
      }
    };
    const ce = () => {
      W < 10 && W++;
      let c = s.sharedLength || 0;
      if (s.length > c && !w && (s.length = c), Z > 1e4)
        s.transitions = null, W = 0, Z = 0, D.length > 0 && (D = []);
      else if (D.length > 0 && !w) {
        for (let y = 0, d = D.length; y < d; y++)
          D[y][ee] = 0;
        D = [];
      }
    }, ne = (c) => {
      var y = c.length;
      y < 16 ? o[a++] = 144 | y : y < 65536 ? (o[a++] = 220, o[a++] = y >> 8, o[a++] = y & 255) : (o[a++] = 221, O.setUint32(a, y), a += 4);
      for (let d = 0; d < y; d++)
        L(c[d]);
    }, L = (c) => {
      a > V && (o = K(a));
      var y = typeof c, d;
      if (y === "string") {
        let u = c.length;
        if (R && u >= 4 && u < 4096) {
          if ((R.size += u) > ir) {
            let A, T = (R[0] ? R[0].length * 3 + R[1].length : 0) + 10;
            a + T > V && (o = K(a + T));
            let k;
            R.position ? (k = R, o[a] = 200, a += 3, o[a++] = 98, A = a - r, a += 4, et(r, L, 0), O.setUint16(A + r - 3, a - r - A)) : (o[a++] = 214, o[a++] = 98, A = a - r, a += 4), R = ["", ""], R.previous = k, R.size = 0, R.position = A;
          }
          let U = ar.test(c);
          R[U ? 0 : 1] += c, o[a++] = 193, L(U ? -u : u);
          return;
        }
        let h;
        u < 32 ? h = 1 : u < 256 ? h = 2 : u < 65536 ? h = 3 : h = 5;
        let S = u * 3;
        if (a + S > V && (o = K(a + S)), u < 64 || !l) {
          let U, A, T, k = a + h;
          for (U = 0; U < u; U++)
            A = c.charCodeAt(U), A < 128 ? o[k++] = A : A < 2048 ? (o[k++] = A >> 6 | 192, o[k++] = A & 63 | 128) : (A & 64512) === 55296 && ((T = c.charCodeAt(U + 1)) & 64512) === 56320 ? (A = 65536 + ((A & 1023) << 10) + (T & 1023), U++, o[k++] = A >> 18 | 240, o[k++] = A >> 12 & 63 | 128, o[k++] = A >> 6 & 63 | 128, o[k++] = A & 63 | 128) : (o[k++] = A >> 12 | 224, o[k++] = A >> 6 & 63 | 128, o[k++] = A & 63 | 128);
          d = k - a - h;
        } else
          d = l(c, a + h);
        d < 32 ? o[a++] = 160 | d : d < 256 ? (h < 2 && o.copyWithin(a + 2, a + 1, a + 1 + d), o[a++] = 217, o[a++] = d) : d < 65536 ? (h < 3 && o.copyWithin(a + 3, a + 2, a + 2 + d), o[a++] = 218, o[a++] = d >> 8, o[a++] = d & 255) : (h < 5 && o.copyWithin(a + 5, a + 3, a + 3 + d), o[a++] = 219, O.setUint32(a, d), a += 4), a += d;
      } else if (y === "number")
        if (c >>> 0 === c)
          c < 32 || c < 128 && this.useRecords === !1 || c < 64 && !this.randomAccessStructure ? o[a++] = c : c < 256 ? (o[a++] = 204, o[a++] = c) : c < 65536 ? (o[a++] = 205, o[a++] = c >> 8, o[a++] = c & 255) : (o[a++] = 206, O.setUint32(a, c), a += 4);
        else if (c >> 0 === c)
          c >= -32 ? o[a++] = 256 + c : c >= -128 ? (o[a++] = 208, o[a++] = c + 256) : c >= -32768 ? (o[a++] = 209, O.setInt16(a, c), a += 2) : (o[a++] = 210, O.setInt32(a, c), a += 4);
        else {
          let u;
          if ((u = this.useFloat32) > 0 && c < 4294967296 && c >= -2147483648) {
            o[a++] = 202, O.setFloat32(a, c);
            let h;
            if (u < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (h = c * De[(o[a] & 127) << 1 | o[a + 1] >> 7]) >> 0 === h) {
              a += 4;
              return;
            } else
              a--;
          }
          o[a++] = 203, O.setFloat64(a, c), a += 8;
        }
      else if (y === "object" || y === "function")
        if (!c)
          o[a++] = 192;
        else {
          if (f) {
            let h = f.get(c);
            if (h) {
              if (!h.id) {
                let S = f.idsToInsert || (f.idsToInsert = []);
                h.id = S.push(h);
              }
              o[a++] = 214, o[a++] = 112, O.setUint32(a, h.id), a += 4;
              return;
            } else
              f.set(c, { offset: a - r });
          }
          let u = c.constructor;
          if (u === Object)
            le(c);
          else if (u === Array)
            ne(c);
          else if (u === Map)
            if (this.mapAsEmptyObject) o[a++] = 128;
            else {
              d = c.size, d < 16 ? o[a++] = 128 | d : d < 65536 ? (o[a++] = 222, o[a++] = d >> 8, o[a++] = d & 255) : (o[a++] = 223, O.setUint32(a, d), a += 4);
              for (let [h, S] of c)
                L(h), L(S);
            }
          else {
            for (let h = 0, S = Te.length; h < S; h++) {
              let U = wt[h];
              if (c instanceof U) {
                let A = Te[h];
                if (A.write) {
                  A.type && (o[a++] = 212, o[a++] = A.type, o[a++] = 0);
                  let se = A.write.call(this, c);
                  se === c ? Array.isArray(c) ? ne(c) : le(c) : L(se);
                  return;
                }
                let T = o, k = O, z = a;
                o = null;
                let Q;
                try {
                  Q = A.pack.call(this, c, (se) => (o = T, T = null, a += se, a > V && K(a), {
                    target: o,
                    targetView: O,
                    position: a - se
                  }), L);
                } finally {
                  T && (o = T, O = k, a = z, V = o.length - 10);
                }
                Q && (Q.length + a > V && K(Q.length + a), a = fr(Q, o, a, A.type));
                return;
              }
            }
            if (Array.isArray(c))
              ne(c);
            else {
              if (c.toJSON) {
                const h = c.toJSON();
                if (h !== c)
                  return L(h);
              }
              if (y === "function")
                return L(this.writeFunction && this.writeFunction(c));
              le(c);
            }
          }
        }
      else if (y === "boolean")
        o[a++] = c ? 195 : 194;
      else if (y === "bigint") {
        if (c < BigInt(1) << BigInt(63) && c >= -(BigInt(1) << BigInt(63)))
          o[a++] = 211, O.setBigInt64(a, c);
        else if (c < BigInt(1) << BigInt(64) && c > 0)
          o[a++] = 207, O.setBigUint64(a, c);
        else if (this.largeBigIntToFloat)
          o[a++] = 203, O.setFloat64(a, Number(c));
        else {
          if (this.largeBigIntToString)
            return L(c.toString());
          if (this.useBigIntExtension && c < BigInt(2) ** BigInt(1023) && c > -(BigInt(2) ** BigInt(1023))) {
            o[a++] = 199, a++, o[a++] = 66;
            let u = [], h;
            do {
              let S = c & BigInt(255);
              h = (S & BigInt(128)) === (c < BigInt(0) ? BigInt(128) : BigInt(0)), u.push(S), c >>= BigInt(8);
            } while (!((c === BigInt(0) || c === BigInt(-1)) && h));
            o[a - 2] = u.length;
            for (let S = u.length; S > 0; )
              o[a++] = Number(u[--S]);
            return;
          } else
            throw new RangeError(c + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
        }
        a += 8;
      } else if (y === "undefined")
        this.encodeUndefinedAsNil ? o[a++] = 192 : (o[a++] = 212, o[a++] = 0, o[a++] = 0);
      else
        throw new Error("Unknown type: " + y);
    }, Ve = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (c) => {
      let y;
      if (this.skipValues) {
        y = [];
        for (let h in c)
          (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(h)) && !this.skipValues.includes(c[h]) && y.push(h);
      } else
        y = Object.keys(c);
      let d = y.length;
      d < 16 ? o[a++] = 128 | d : d < 65536 ? (o[a++] = 222, o[a++] = d >> 8, o[a++] = d & 255) : (o[a++] = 223, O.setUint32(a, d), a += 4);
      let u;
      if (this.coercibleKeyAsNumber)
        for (let h = 0; h < d; h++) {
          u = y[h];
          let S = Number(u);
          L(isNaN(S) ? u : S), L(c[u]);
        }
      else
        for (let h = 0; h < d; h++)
          L(u = y[h]), L(c[u]);
    } : (c) => {
      o[a++] = 222;
      let y = a - r;
      a += 2;
      let d = 0;
      for (let u in c)
        (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(u)) && (L(u), L(c[u]), d++);
      if (d > 65535)
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      o[y++ + r] = d >> 8, o[y + r] = d & 255;
    }, $e = this.useRecords === !1 ? Ve : t.progressiveRecords && !I ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (c) => {
        let y, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = a++ - r, h;
        for (let S in c)
          if (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(S)) {
            if (y = d[S], y)
              d = y;
            else {
              let U = Object.keys(c), A = d;
              d = s.transitions;
              let T = 0;
              for (let k = 0, z = U.length; k < z; k++) {
                let Q = U[k];
                y = d[Q], y || (y = d[Q] = /* @__PURE__ */ Object.create(null), T++), d = y;
              }
              u + r + 1 == a ? (a--, be(d, U, T)) : ze(d, U, u, T), h = !0, d = A[S];
            }
            L(c[S]);
          }
        if (!h) {
          let S = d[ee];
          S ? o[u + r] = S : ze(d, Object.keys(c), u, 0);
        }
      }
    ) : (c) => {
      let y, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = 0;
      for (let S in c) (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(S)) && (y = d[S], y || (y = d[S] = /* @__PURE__ */ Object.create(null), u++), d = y);
      let h = d[ee];
      h ? h >= 96 && I ? (o[a++] = ((h -= 96) & 31) + 96, o[a++] = h >> 5) : o[a++] = h : be(d, d.__keys__ || Object.keys(c), u);
      for (let S in c)
        (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(S)) && L(c[S]);
    }, je = typeof this.useRecords == "function" && this.useRecords, le = je ? (c) => {
      je(c) ? $e(c) : Ve(c);
    } : $e, K = (c) => {
      let y;
      if (c > 16777216) {
        if (c - r > Ze)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        y = Math.min(
          Ze,
          Math.round(Math.max((c - r) * (c > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        y = (Math.max(c - r << 2, o.length - 1) >> 12) + 1 << 12;
      let d = new de(y);
      return O = d.dataView || (d.dataView = new DataView(d.buffer, 0, y)), c = Math.min(c, o.length), o.copy ? o.copy(d, 0, r, c) : d.set(o.slice(r, c)), a -= r, r = 0, V = d.length - 10, o = d;
    }, be = (c, y, d) => {
      let u = s.nextId;
      u || (u = 64), u < P && this.shouldShareStructure && !this.shouldShareStructure(y) ? (u = s.nextOwnId, u < C || (u = P), s.nextOwnId = u + 1) : (u >= C && (u = P), s.nextId = u + 1);
      let h = y.highByte = u >= 96 && I ? u - 96 >> 5 : -1;
      c[ee] = u, c.__keys__ = y, s[u - 64] = y, u < P ? (y.isShared = !0, s.sharedLength = u - 63, n = !0, h >= 0 ? (o[a++] = (u & 31) + 96, o[a++] = h) : o[a++] = u) : (h >= 0 ? (o[a++] = 213, o[a++] = 114, o[a++] = (u & 31) + 96, o[a++] = h) : (o[a++] = 212, o[a++] = 114, o[a++] = u), d && (Z += W * d), D.length >= m && (D.shift()[ee] = 0), D.push(c), L(y));
    }, ze = (c, y, d, u) => {
      let h = o, S = a, U = V, A = r;
      o = ie, a = 0, r = 0, o || (ie = o = new de(8192)), V = o.length - 10, be(c, y, u), ie = o;
      let T = a;
      if (o = h, a = S, V = U, r = A, T > 1) {
        let k = a + T - 1;
        k > V && K(k);
        let z = d + r;
        o.copyWithin(z + T, z + 1, a), o.set(ie.slice(0, T), z), a = k;
      } else
        o[d + r] = ie[0];
    }, It = (c) => {
      let y = sr(c, o, r, a, s, K, (d, u, h) => {
        if (h)
          return n = !0;
        a = u;
        let S = o;
        return L(d), ce(), S !== o ? { position: a, targetView: O, target: o } : a;
      }, this);
      if (y === 0)
        return le(c);
      a = y;
    };
  }
  useBuffer(t) {
    o = t, o.dataView || (o.dataView = new DataView(o.buffer, o.byteOffset, o.byteLength)), a = 0;
  }
  set position(t) {
    a = t;
  }
  get position() {
    return a;
  }
  clearSharedData() {
    this.structures && (this.structures = []), this.typedStructs && (this.typedStructs = []);
  }
}
wt = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, ot];
Te = [{
  pack(e, t, r) {
    let n = e.getTime() / 1e3;
    if ((this.useTimestamp32 || e.getMilliseconds() === 0) && n >= 0 && n < 4294967296) {
      let { target: s, targetView: f, position: l } = t(6);
      s[l++] = 214, s[l++] = 255, f.setUint32(l, n);
    } else if (n > 0 && n < 4294967296) {
      let { target: s, targetView: f, position: l } = t(10);
      s[l++] = 215, s[l++] = 255, f.setUint32(l, e.getMilliseconds() * 4e6 + (n / 1e3 / 4294967296 >> 0)), f.setUint32(l + 4, n);
    } else if (isNaN(n)) {
      if (this.onInvalidDate)
        return t(0), r(this.onInvalidDate());
      let { target: s, targetView: f, position: l } = t(3);
      s[l++] = 212, s[l++] = 255, s[l++] = 255;
    } else {
      let { target: s, targetView: f, position: l } = t(15);
      s[l++] = 199, s[l++] = 12, s[l++] = 255, f.setUint32(l, e.getMilliseconds() * 1e6), f.setBigInt64(l + 4, BigInt(Math.floor(n)));
    }
  }
}, {
  pack(e, t, r) {
    if (this.setAsEmptyObject)
      return t(0), r({});
    let n = Array.from(e), { target: s, position: f } = t(this.moreTypes ? 3 : 0);
    this.moreTypes && (s[f++] = 212, s[f++] = 115, s[f++] = 0), r(n);
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
    this.moreTypes ? Xe(e, 16, t) : We(Se ? Buffer.from(e) : new Uint8Array(e), t);
  }
}, {
  pack(e, t) {
    let r = e.constructor;
    r !== pt && this.moreTypes ? Xe(e, ht.indexOf(r.name), t) : We(e, t);
  }
}, {
  pack(e, t) {
    let { target: r, position: n } = t(1);
    r[n] = 193;
  }
}];
function Xe(e, t, r, n) {
  let s = e.byteLength;
  if (s + 1 < 256) {
    var { target: f, position: l } = r(4 + s);
    f[l++] = 199, f[l++] = s + 1;
  } else if (s + 1 < 65536) {
    var { target: f, position: l } = r(5 + s);
    f[l++] = 200, f[l++] = s + 1 >> 8, f[l++] = s + 1 & 255;
  } else {
    var { target: f, position: l, targetView: x } = r(7 + s);
    f[l++] = 201, x.setUint32(l, s + 1), l += 4;
  }
  f[l++] = 116, f[l++] = t, e.buffer || (e = new Uint8Array(e)), f.set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), l);
}
function We(e, t) {
  let r = e.byteLength;
  var n, s;
  if (r < 256) {
    var { target: n, position: s } = t(r + 2);
    n[s++] = 196, n[s++] = r;
  } else if (r < 65536) {
    var { target: n, position: s } = t(r + 3);
    n[s++] = 197, n[s++] = r >> 8, n[s++] = r & 255;
  } else {
    var { target: n, position: s, targetView: f } = t(r + 5);
    n[s++] = 198, f.setUint32(s, r), s += 4;
  }
  n.set(e, s);
}
function fr(e, t, r, n) {
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
function or(e, t) {
  let r, n = t.length * 6, s = e.length - n;
  for (; r = t.pop(); ) {
    let f = r.offset, l = r.id;
    e.copyWithin(f + n, f, s), n -= 6;
    let x = f + n;
    e[x++] = 214, e[x++] = 105, e[x++] = l >> 24, e[x++] = l >> 16 & 255, e[x++] = l >> 8 & 255, e[x++] = l & 255, s = f;
  }
  return e;
}
function et(e, t, r) {
  if (R.length > 0) {
    O.setUint32(R.position + e, a + r - R.position - e), R.stringsPosition = a - e;
    let n = R;
    R = null, t(n[0]), t(n[1]);
  }
}
function cr(e, t) {
  return e.isCompatible = (r) => {
    let n = !r || (t.lastNamedStructuresLength || 0) === r.length;
    return n || t._mergeStructures(r), n;
  }, e;
}
let mt = new qe({ useRecords: !1 });
mt.pack;
mt.pack;
const lr = 512, ur = 1024, dr = 2048, xr = (e) => new qe({ structuredClone: !0 }).unpack(new Uint8Array(e));
function gr(e) {
  return Le(e) ? yr(e) : hr(e);
}
async function hr(e) {
  const t = await re(e);
  return Me(t);
}
function yr(e) {
  const t = Re(e);
  return Me(t);
}
const St = (e, t = "application/octet-stream") => e instanceof Blob ? e : e instanceof ArrayBuffer ? new Blob([e], { type: t }) : typeof e == "string" ? new Blob([e], { type: t }) : ArrayBuffer.isView(e) ? new Blob([e], { type: t }) : Array.isArray(e) ? new Blob([Oe(e)], { type: t }) : new Blob([]), wr = async (e) => {
  const t = St(e), r = new FileReader();
  return new Promise((n, s) => {
    const f = (l) => typeof l == "string" ? n(l) : (console.log({ bytes: e }), s("Unable to convert to data URL"));
    r.onload = function(l) {
      f(l.target?.result);
    }, r.readAsDataURL(t);
  });
}, pr = (e) => {
  const t = new qe({ structuredClone: !0 });
  return new Uint8Array(t.encode(e));
}, mr = (e) => {
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
}, Sr = (e) => new TextEncoder().encode(e), Y = {
  toMsgPack: pr,
  msgPackToObject: xr,
  typeOfBytes: mr,
  toDataUrl: wr,
  dataUrlToBlob: Ht,
  lengthOf: Yt,
  isByteLike: Qt,
  isImmediateByteLike: Le,
  hashOf: pe,
  immediateHashOf: Kt,
  addressStringOf: he,
  toArrayBuffer: re,
  immediateToArrayBuffer: Re,
  toBlob: St,
  toText: ft,
  toBase64: gr,
  encodeAsString: at,
  test: $t,
  assignMediaTypeToBlob: Ft,
  utf8ToUint8Array: Sr,
  base64ToArrayBuffer: Jt,
  arrayBufferToHex: jt,
  arrayBufferToUtf8: zt,
  arrayBufferToBase64: Me,
  ALL_ALGORITHMS: ke,
  ALGORITHM_BYTE_LENGTHS: st
}, br = (e) => typeof e == "function", bt = (e) => e == null || Number.isNaN(e), At = (e) => !bt(e), Ar = (e) => br(e) ? e() : e, Br = (e, t = {}) => {
  const { quiet: r = !1, def: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (f) {
    return r || (console.error(f), At(s) && console.log(Ar(s))), n;
  }
}, Er = {
  isDefined: At,
  isUndefined: bt,
  safe: Br
}, { isDefined: Ne, isUndefined: Ur, safe: Bt } = Er, Et = (e) => e == null || Number.isNaN(e), Tr = (e) => !Et(e), kr = {
  isDefined: Tr,
  isUndefined: Et
}, { isDefined: ye, isUndefined: Ir } = kr, Or = (e, t, r) => {
  if (Ir(e))
    return;
  const n = t.get(e);
  if (ye(n))
    return n;
  if (ye(r)) {
    const s = r();
    return t.set(e, s), s;
  }
}, Mr = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const r = {
    get: (n, s) => Or(n, e, s),
    set: (n, s) => (e.set(n, s), r),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([s, f]) => f === n).map(([s, f]) => s),
    lastUpdate: () => t
  };
  return r;
}, Rr = {
  create: Mr
}, Lr = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: f = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !f(t.timestamp) || t.extra && !s(t.extra));
}, _r = (e) => (t) => {
  for (const r of e)
    if (Lr(r)(t))
      return r;
  return !1;
}, Pr = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, xe = (e) => {
  const t = [], r = {
    length: 0,
    push: (n) => {
      t.length >= e && t.shift(), t.push(n), r.length = t.length;
    },
    get: () => t,
    clear: () => {
      t.length = 0, r.length = 0;
    },
    last: () => t[t.length - 1]
  };
  return r;
}, tt = () => {
  let e = performance.now(), t;
  const r = {
    end: () => (ye(t) || (t = performance.now()), r),
    getDuration: () => (t ?? performance.now()) - e
  };
  return r;
}, Dr = (e = 100) => {
  let t = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = xe(e), f = {
    time: () => {
      const l = s.last();
      ye(l) && l.end();
      const x = tt();
      return s.push(x), x;
    },
    getTimes: () => s.get(),
    timer: (l) => {
      const x = n.get(l) ?? xe(e);
      n.set(l, x);
      const w = tt();
      return x.push(w), w;
    },
    counter: (l, x = 1) => {
      const w = r.get(l) ?? 0;
      r.set(l, w + x);
    },
    getCounters: () => new Map(r),
    getCounter: (l) => r.get(l) ?? 0,
    count: (l = 1) => {
      t += l;
    },
    getCount: () => t,
    clearCount: () => (t = 0, f),
    getTimers: (l) => (n.get(l) ?? xe(e)).get(),
    clearTimers: (l) => ((n.get(l) ?? xe(e)).clear(), f)
  };
  return f;
}, qr = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance
} = {}) => {
  const n = Rr.create(), s = {
    getTraceIds: () => n.entries().map(([f]) => f),
    start: (f, ...l) => {
      s.getStats(f).count(), s.getStats(f).time(), s.addLog({ traceId: f, message: "start", extra: l });
    },
    getStats: (f) => n.get(f, () => Dr()),
    addLog: ({ traceId: f, message: l, timestamp: x = r.now(), extra: w = [] }) => {
      const b = {
        traceId: f,
        message: l,
        timestamp: x,
        extra: w
      }, p = _r(e)(b);
      if (!p)
        return;
      const m = Pr(p)(b);
      t(
        `${m.timestamp} ${m.traceId}: ${m.message}`,
        ...m.extra ?? []
      );
    },
    end: (f, ...l) => {
      s.addLog({ traceId: f, message: "end", extra: l });
    }
  };
  return s;
}, Ut = (e = "", t = qr()) => {
  t.start(e);
  const r = {
    span: (n) => Ut(`${e}.${n}`, t),
    counter: (n, s = 1) => (t.getStats(e).counter(n, s), r),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), r),
    log: (n, ...s) => (t.addLog({ traceId: e, message: n, extra: s }), r)
  };
  return r;
}, Ce = (e) => {
  const { message: t, stack: r, extra: n, cause: s } = e, f = s ? `
Caused by: ${Ce(s)}` : "", l = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(Ne).join(`
`) + l + f;
}, Tt = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? Ce(e) : Bt(() => JSON.stringify(e, void 0, 2)) ?? "", Nr = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? Ce(e) : Bt(() => JSON.stringify(e, void 0, 2)) ?? "";
}, kt = ({ error: e, extra: t, stack: r }) => {
  if (e instanceof Error) {
    const n = Ne(e.cause) ? kt({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? r,
      extra: t,
      cause: n
    };
  }
  return {
    message: Tt(e),
    stack: r,
    extra: t
  };
}, Cr = {
  errorToErrorDetail: kt,
  errorToText: Tt,
  errorToTextAsync: Nr
}, rt = async ({
  channel: e,
  subject: t,
  connectionListener: r,
  options: n = {}
}) => {
  const { log: s = () => {
  }, signal: f } = n;
  s("connectConnectionListenerToSubject: subject: ", t);
  for await (const l of e.listenOn(t, {
    callback: async (x) => {
      const w = Y.msgPackToObject(x), { data: b, meta: p } = w;
      if (Lt(w))
        throw console.error("Error in message: ", w), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${w?.data?.message}`
        );
      try {
        const m = await r(b, {
          headers: p?.headers,
          signal: f
        });
        return Y.toMsgPack({
          data: m
        });
      } catch (m) {
        const I = Cr.errorToErrorDetail({ error: m });
        return Y.toMsgPack({
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
}, zr = async ({
  channel: e,
  subscribers: t = {},
  options: r = {},
  obs: n = Ut()
}) => {
  const s = n.span("MessageBus"), { defaultTimeoutMs: f = 60 * 1e3, signal: l } = r, x = Object.entries(t);
  s.log("connect: subscribers: ", x);
  for (const [w, b] of x)
    Ur(b) || rt({
      channel: e,
      subject: w,
      connectionListener: b,
      options: r
    });
  return {
    requestMany: async (w, b, p = {}) => {
      const m = s.span("requestMany"), { timeoutMs: I = 60 * 1e3, headers: P, callback: C } = p, D = Y.toMsgPack({
        data: b,
        meta: { headers: P }
      }), Z = m.span("channel requestMany").log("start requestMany", w), W = await e.requestMany(
        w,
        D,
        {
          timeoutMs: I
        }
      );
      for await (const ce of W) {
        if (l?.aborted)
          return;
        const ne = Y.msgPackToObject(ce);
        await C?.(ne);
      }
      Z.end(), m.end();
    },
    request: async (w, b, p = {}) => {
      const m = s.span("request").log("subject", w), { timeoutMs: I = f, headers: P } = p, C = Y.toMsgPack({
        data: b,
        meta: { headers: P }
      }), D = m.span("channel request").log("requestData", C), Z = await e.request(w, C, {
        timeoutMs: I
      });
      return D.end(), m.end(), Y.msgPackToObject(Z);
    },
    publish: async (w, b, p = {}) => {
      const { headers: m } = p, I = Y.toMsgPack({
        data: b,
        meta: { headers: m }
      });
      return s.span("publish").log("subject", w), e.postOn(w, I);
    },
    subscribe: async (w, b, p = {}) => (s.span("subscribe").log("subject", w), rt({
      channel: e,
      subject: w,
      connectionListener: b,
      options: p
    }))
  };
}, Vr = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const r = {
    postOn: (n, s, f = {}) => {
      const { signal: l, reply: x } = f;
      e(l)(n)({ subject: n, data: s, reply: x });
    },
    listenOn: function(n, s = {}) {
      const { signal: f, once: l, callback: x } = s, w = new AbortController();
      if (f?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      f?.addEventListener("abort", () => {
        w.abort();
      });
      const b = t(w.signal)(n)(
        async (p) => {
          if (p.subject === n) {
            l && w.abort();
            const m = await x?.(p.data, {
              finished: p.finished ?? !1
            });
            if (p.reply && m && (nt(m) ? (async () => {
              for await (const I of m)
                e(w.signal)(p.reply)({
                  subject: p.reply,
                  data: I
                });
              e(w.signal)(p.reply)({
                subject: p.reply,
                data: void 0,
                finished: !0
              });
            })() : e(w.signal)(p.reply)({
              subject: p.reply,
              data: m,
              finished: !0
            })), m && !nt(m))
              return { ...p, data: m };
          }
          return p;
        }
      );
      return async function* () {
        for await (const p of b)
          yield p.data;
      }();
    },
    request: async (n, s, f = {}) => {
      const { signal: l, timeoutMs: x } = f, w = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((b, p) => {
        l?.aborted && p(
          new Error(`request: Signal is already aborted for ${n}`)
        ), l?.addEventListener("abort", () => {
          p(new Error("Request aborted"));
        });
        let m;
        x && (m = setTimeout(() => {
          p(
            new Error(
              `request: Request timed out after ${x}ms for ${n}`
            )
          );
        }, x)), r.listenOn(w, {
          callback: (I) => {
            clearTimeout(m), b(I);
          },
          signal: l,
          once: !0
        }), r.postOn(n, s, { reply: w, signal: l });
      });
    },
    requestMany: async (n, s, f = {}) => {
      const { signal: l, timeoutMs: x, callback: w } = f, b = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((p, m) => {
        l?.aborted && m(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), l?.addEventListener("abort", () => {
          m(new Error("Request aborted"));
        });
        let I;
        x && (I = setTimeout(() => {
          m(
            new Error(
              `requestMany: Request timed out after ${x}ms for ${n}`
            )
          );
        }, x));
        const P = r.listenOn(b, {
          callback: (C, D) => {
            if (C !== void 0 && w?.(C), D.finished)
              return clearTimeout(I), p(P);
          },
          signal: l
        });
        return r.postOn(n, s, { reply: b, signal: l }), P;
      });
    }
  };
  return r;
};
function nt(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const Fr = (e) => Vr({
  posterProducer: (t) => (r) => (n) => {
    t?.aborted || e.emit(r, n);
  },
  listenerProducer: (t) => (r) => (n) => {
    const s = [], f = {
      resolve: void 0
    }, l = async (x) => {
      if (t?.aborted)
        return;
      const w = await n?.(x), b = Ne(w) ? w : x;
      s.push(b), f.resolve?.();
    };
    return t?.addEventListener("abort", () => {
      e.off(r, l);
    }), e.on(r, l), {
      [Symbol.asyncIterator]: async function* () {
        for (; !t?.aborted; )
          s.length > 0 ? yield s.shift() : await new Promise((x) => {
            f.resolve = x;
          });
      }
    };
  }
});
export {
  Vr as Channel,
  Fr as EmitterChannel,
  zr as MessageBus,
  Mt as isError,
  Lt as isErrorMsg,
  Rt as isMsg,
  Ot as isValue,
  jr as isValueOrError,
  $r as parseSubject
};

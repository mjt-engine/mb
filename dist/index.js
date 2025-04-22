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
function de(e, t = "Assertion failed") {
  if (!e)
    throw new Error(Ue(t));
}
const rt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => {
  throw new Error("assertEqualElements: Bitrotted");
}, Ot = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => Array.isArray(e) && Array.isArray(t) ? rt(e, t, r) : de(e === t, r), It = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is equal to ${JSON.stringify(t)}`)) => de(e !== t, r);
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
  return de(Rt(e), t), e;
}
const W = {
  assert: de,
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
}, xe = async ({ bytes: e, algorithm: t = "SHA-512", radix: r = 16 }) => {
  const n = await ge({ bytes: e, algorithm: t }), s = await nt(n, r);
  return `${t}:${s}`;
}, Lt = ({ id: e }) => {
  const t = e.split(":");
  W.assert(t.length === 2);
  const [r, n] = t, s = atob(n), c = new Uint8Array(s.length);
  return s.split("").map((u) => u.charCodeAt(0)).forEach((u, y) => {
    c[y] = u;
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
    const e = await xe({
      bytes: "test",
      algorithm: "SHA-256"
    });
    W.assertEqual(e, "SHA-256:n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=");
  }
  {
    const e = await xe({
      bytes: "test",
      algorithm: "SHA-512"
    });
    W.assertEqual(e, "SHA-512:7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==");
  }
});
ie.push(async () => Ee.map(async (e) => {
  const t = "test", r = await xe({ bytes: t, algorithm: e }), n = new Uint8Array(await ge({ bytes: t, algorithm: e })), s = Lt({ id: r });
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
const jt = (e) => {
  const t = new Uint8Array(e), r = [];
  for (let n = 0; n < t.length; ++n)
    r.push(t[n].toString(16).padStart(2, "0"));
  return r.join("");
}, Nt = (e) => new TextDecoder().decode(new Uint8Array(e)), Vt = (e, t) => e.slice(0, e.size, t), Ct = (e) => {
  const t = globalThis.atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}, qt = (e) => {
  if (!e)
    return;
  const t = e.split(","), n = (t[0].match(/:(.*?);/) ?? [])[1], s = atob(t[1]);
  let c = s.length;
  const u = new Uint8Array(c);
  for (; c--; )
    u[c] = s.charCodeAt(c);
  return new Blob([u], { type: n });
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
var d, J, i = 0, M = {}, E, K, $ = 0, z = 0, j, H, C = [], B, $e = {
  useRecords: !1,
  mapsAsObjects: !0
};
class it {
}
const ft = new it();
ft.name = "MessagePack 0xC1";
var Z = !1, ot = 2, Jt;
try {
  new Function("");
} catch {
  ot = 1 / 0;
}
class se {
  constructor(t) {
    t && (t.useRecords === !1 && t.mapsAsObjects === void 0 && (t.mapsAsObjects = !0), t.sequential && t.trusted !== !1 && (t.trusted = !0, !t.structures && t.useRecords != !1 && (t.structures = [], t.maxSharedStructures || (t.maxSharedStructures = 0))), t.structures ? t.structures.sharedLength = t.structures.length : t.getStructures && ((t.structures = []).uninitialized = !0, t.structures.sharedLength = 0), t.int64AsNumber && (t.int64AsType = "number")), Object.assign(this, t);
  }
  unpack(t, r) {
    if (d)
      return dt(() => (Ae(), this ? this.unpack(t, r) : se.prototype.unpack.call($e, t, r)));
    !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < "u" ? Buffer.from(t) : new Uint8Array(t)), typeof r == "object" ? (J = r.end || t.length, i = r.start || 0) : (i = 0, J = r > -1 ? r : t.length), z = 0, K = null, j = null, d = t;
    try {
      B = t.dataView || (t.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength));
    } catch (n) {
      throw d = null, t instanceof Uint8Array ? n : new Error("Source must be a Uint8Array or Buffer but was a " + (t && typeof t == "object" ? t.constructor.name : typeof t));
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
      let c = t.length, u = this ? this.unpack(t, c) : he.unpack(t, c);
      if (r) {
        if (r(u, s, i) === !1) return;
        for (; i < c; )
          if (s = i, r(ce(), s, i) === !1)
            return;
      } else {
        for (n = [u]; i < c; )
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
    if (M.randomAccessStructure && d[i] < 64 && d[i] >= 32 && Jt || (t = P()), j && (i = j.postBundlePosition, j = null), Z && (E.restoreStructures = null), i == J)
      E && E.restoreStructures && Fe(), E = null, d = null, H && (H = null);
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
  let e = d[i++];
  if (e < 160)
    if (e < 128) {
      if (e < 64)
        return e;
      {
        let t = E[e & 63] || M.getStructures && at()[e & 63];
        return t ? (t.read || (t.read = Me(t, e & 63)), t.read()) : e;
      }
    } else if (e < 144)
      if (e -= 128, M.mapsAsObjects) {
        let t = {};
        for (let r = 0; r < e; r++) {
          let n = ut();
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
        return j ? (t = P(), t > 0 ? j[1].slice(j.position1, j.position1 += t) : j[0].slice(j.position0, j.position0 -= t)) : ft;
      // "never-used", return special object to denote that
      case 194:
        return !1;
      case 195:
        return !0;
      case 196:
        if (t = d[i++], t === void 0)
          throw new Error("Unexpected end of buffer");
        return Se(t);
      case 197:
        return t = B.getUint16(i), i += 2, Se(t);
      case 198:
        return t = B.getUint32(i), i += 4, Se(t);
      case 199:
        return v(d[i++]);
      case 200:
        return t = B.getUint16(i), i += 2, v(t);
      case 201:
        return t = B.getUint32(i), i += 4, v(t);
      case 202:
        if (t = B.getFloat32(i), M.useFloat32 > 2) {
          let r = Re[(d[i] & 127) << 1 | d[i + 1] >> 7];
          return i += 4, (r * t + (t > 0 ? 0.5 : -0.5) >> 0) / r;
        }
        return i += 4, t;
      case 203:
        return t = B.getFloat64(i), i += 8, t;
      // uint handlers
      case 204:
        return d[i++];
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
        if (t = d[i++], t == 114)
          return Ge(d[i++] & 63);
        {
          let r = C[t];
          if (r)
            return r.read ? (i++, r.read(P())) : r.noBuffer ? (i++, r()) : r(d.subarray(i, ++i));
          throw new Error("Unknown extension " + t);
        }
      case 213:
        return t = d[i], t == 114 ? (i++, Ge(d[i++] & 63, d[i++])) : v(2);
      case 214:
        return v(4);
      case 215:
        return v(8);
      case 216:
        return v(16);
      case 217:
        return t = d[i++], z >= i ? K.slice(i - $, (i += t) - $) : Qt(t);
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
    if (r.count++ > ot) {
      let s = e.read = new Function("r", "return function(){return " + (M.freezeData ? "Object.freeze" : "") + "({" + e.map((c) => c === "__proto__" ? "__proto_:r()" : Ht.test(c) ? c + ":r()" : "[" + JSON.stringify(c) + "]:r()").join(",") + "})}")(P);
      return e.highByte === 0 && (e.read = ze(t, e.read)), s();
    }
    let n = {};
    for (let s = 0, c = e.length; s < c; s++) {
      let u = e[s];
      u === "__proto__" && (u = "__proto_"), n[u] = P();
    }
    return M.freezeData ? Object.freeze(n) : n;
  }
  return r.count = 0, e.highByte === 0 ? ze(t, r) : r;
}
const ze = (e, t) => function() {
  let r = d[i++];
  if (r === 0)
    return t();
  let n = e < 32 ? -(e + (r << 5)) : e + (r << 5), s = E[n] || at()[n];
  if (!s)
    throw new Error("Record id is not defined for " + n);
  return s.read || (s.read = Me(s, e)), s.read();
};
function at() {
  let e = dt(() => (d = null, M.getStructures()));
  return E = M._mergeStructures(e, E);
}
var me = fe, Qt = fe, Yt = fe, Gt = fe;
function fe(e) {
  let t;
  if (e < 16 && (t = _e(e)))
    return t;
  if (e > 64 && be)
    return be.decode(d.subarray(i, i += e));
  const r = i + e, n = [];
  for (t = ""; i < r; ) {
    const s = d[i++];
    if ((s & 128) === 0)
      n.push(s);
    else if ((s & 224) === 192) {
      const c = d[i++] & 63;
      n.push((s & 31) << 6 | c);
    } else if ((s & 240) === 224) {
      const c = d[i++] & 63, u = d[i++] & 63;
      n.push((s & 31) << 12 | c << 6 | u);
    } else if ((s & 248) === 240) {
      const c = d[i++] & 63, u = d[i++] & 63, y = d[i++] & 63;
      let w = (s & 7) << 18 | c << 12 | u << 6 | y;
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
      let n = ut();
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
    const s = d[i++];
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
        let t = d[i++];
        if ((t & 128) > 1) {
          i -= 1;
          return;
        }
        return D(t);
      }
    } else {
      let t = d[i++], r = d[i++];
      if ((t & 128) > 0 || (r & 128) > 0) {
        i -= 2;
        return;
      }
      if (e < 3)
        return D(t, r);
      let n = d[i++];
      if ((n & 128) > 0) {
        i -= 3;
        return;
      }
      return D(t, r, n);
    }
  else {
    let t = d[i++], r = d[i++], n = d[i++], s = d[i++];
    if ((t & 128) > 0 || (r & 128) > 0 || (n & 128) > 0 || (s & 128) > 0) {
      i -= 4;
      return;
    }
    if (e < 6) {
      if (e === 4)
        return D(t, r, n, s);
      {
        let c = d[i++];
        if ((c & 128) > 0) {
          i -= 5;
          return;
        }
        return D(t, r, n, s, c);
      }
    } else if (e < 8) {
      let c = d[i++], u = d[i++];
      if ((c & 128) > 0 || (u & 128) > 0) {
        i -= 6;
        return;
      }
      if (e < 7)
        return D(t, r, n, s, c, u);
      let y = d[i++];
      if ((y & 128) > 0) {
        i -= 7;
        return;
      }
      return D(t, r, n, s, c, u, y);
    } else {
      let c = d[i++], u = d[i++], y = d[i++], w = d[i++];
      if ((c & 128) > 0 || (u & 128) > 0 || (y & 128) > 0 || (w & 128) > 0) {
        i -= 8;
        return;
      }
      if (e < 10) {
        if (e === 8)
          return D(t, r, n, s, c, u, y, w);
        {
          let A = d[i++];
          if ((A & 128) > 0) {
            i -= 9;
            return;
          }
          return D(t, r, n, s, c, u, y, w, A);
        }
      } else if (e < 12) {
        let A = d[i++], S = d[i++];
        if ((A & 128) > 0 || (S & 128) > 0) {
          i -= 10;
          return;
        }
        if (e < 11)
          return D(t, r, n, s, c, u, y, w, A, S);
        let b = d[i++];
        if ((b & 128) > 0) {
          i -= 11;
          return;
        }
        return D(t, r, n, s, c, u, y, w, A, S, b);
      } else {
        let A = d[i++], S = d[i++], b = d[i++], I = d[i++];
        if ((A & 128) > 0 || (S & 128) > 0 || (b & 128) > 0 || (I & 128) > 0) {
          i -= 12;
          return;
        }
        if (e < 14) {
          if (e === 12)
            return D(t, r, n, s, c, u, y, w, A, S, b, I);
          {
            let L = d[i++];
            if ((L & 128) > 0) {
              i -= 13;
              return;
            }
            return D(t, r, n, s, c, u, y, w, A, S, b, I, L);
          }
        } else {
          let L = d[i++], q = d[i++];
          if ((L & 128) > 0 || (q & 128) > 0) {
            i -= 14;
            return;
          }
          if (e < 15)
            return D(t, r, n, s, c, u, y, w, A, S, b, I, L, q);
          let N = d[i++];
          if ((N & 128) > 0) {
            i -= 15;
            return;
          }
          return D(t, r, n, s, c, u, y, w, A, S, b, I, L, q, N);
        }
      }
    }
  }
}
function Qe() {
  let e = d[i++], t;
  if (e < 192)
    t = e - 160;
  else
    switch (e) {
      case 217:
        t = d[i++];
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
    Uint8Array.prototype.slice.call(d, i, i += e)
  ) : d.subarray(i, i += e);
}
function v(e) {
  let t = d[i++];
  if (C[t]) {
    let r;
    return C[t](d.subarray(i, r = i += e), (n) => {
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
function ut() {
  let e = d[i++];
  if (e >= 160 && e < 192) {
    if (e = e - 160, z >= i)
      return K.slice(i - $, (i += e) - $);
    if (!(z == 0 && J < 180))
      return me(e);
  } else
    return i--, lt(P());
  let t = (e << 5 ^ (e > 1 ? B.getUint16(i) : e > 0 ? d[i] : 0)) & 4095, r = Ye[t], n = i, s = i + e - 3, c, u = 0;
  if (r && r.bytes == e) {
    for (; n < s; ) {
      if (c = B.getUint32(n), c != r[u++]) {
        n = 1879048192;
        break;
      }
      n += 4;
    }
    for (s += 3; n < s; )
      if (c = d[n++], c != r[u++]) {
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
    c = d[n++], r.push(c);
  let y = e < 16 ? _e(e) : ct(e);
  return y != null ? r.string = y : r.string = me(e);
}
function lt(e) {
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return e.toString();
  if (e == null) return e + "";
  throw new Error("Invalid property type for record", typeof e);
}
const Ge = (e, t) => {
  let r = P().map(lt), n = e;
  t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, r.highByte = t);
  let s = E[e];
  return s && (s.isShared || Z) && ((E.restoreStructures || (E.restoreStructures = []))[e] = s), E[e] = r, r.read = Me(r, n), r.read();
};
C[0] = () => {
};
C[0].noBuffer = !0;
C[66] = (e) => {
  let t = e.length, r = BigInt(e[0] & 128 ? e[0] - 256 : e[0]);
  for (let n = 1; n < t; n++)
    r <<= BigInt(8), r += BigInt(e[n]);
  return r;
};
let Kt = { Error, TypeError, ReferenceError };
C[101] = () => {
  let e = P();
  return (Kt[e[0]] || Error)(e[1], { cause: e[2] });
};
C[105] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4);
  H || (H = /* @__PURE__ */ new Map());
  let r = d[i], n;
  r >= 144 && r < 160 || r == 220 || r == 221 ? n = [] : n = {};
  let s = { target: n };
  H.set(t, s);
  let c = P();
  return s.used ? Object.assign(n, c) : (s.target = c, c);
};
C[112] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4), r = H.get(t);
  return r.used = !0, r.target;
};
C[115] = () => new Set(P());
const xt = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((e) => e + "Array");
let Zt = typeof globalThis == "object" ? globalThis : window;
C[116] = (e) => {
  let t = e[0], r = xt[t];
  if (!r) {
    if (t === 16) {
      let n = new ArrayBuffer(e.length - 1);
      return new Uint8Array(n).set(e.subarray(1)), n;
    }
    throw new Error("Could not find typed array for code " + t);
  }
  return new Zt[r](Uint8Array.prototype.slice.call(e, 1).buffer);
};
C[120] = () => {
  let e = P();
  return new RegExp(e[0], e[1]);
};
const vt = [];
C[98] = (e) => {
  let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], r = i;
  return i += t - e.length, j = vt, j = [Qe(), Qe()], j.position0 = 0, j.position1 = 0, j.postBundlePosition = i, i = r, P();
};
C[255] = (e) => e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(
  ((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3
) : e.length == 12 ? new Date(
  ((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3
) : /* @__PURE__ */ new Date("invalid");
function dt(e) {
  let t = J, r = i, n = $, s = z, c = K, u = H, y = j, w = new Uint8Array(d.slice(0, J)), A = E, S = E.slice(0, E.length), b = M, I = Z, L = e();
  return J = t, i = r, $ = n, z = s, K = c, H = u, j = y, d = w, Z = I, E = A, E.splice(0, E.length, ...S), M = b, B = new DataView(d.buffer, d.byteOffset, d.byteLength), L;
}
function Ae() {
  d = null, H = null, E = null;
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
let le;
try {
  le = new TextEncoder();
} catch {
}
let Be, gt;
const ye = typeof Buffer < "u", ue = ye ? function(e) {
  return Buffer.allocUnsafeSlow(e);
} : Uint8Array, ht = ye ? Buffer : Uint8Array, Ke = ye ? 4294967296 : 2144337920;
let o, ne, O, f = 0, V, _ = null, Wt;
const er = 21760, tr = /[\u0080-\uFFFF]/, X = Symbol("record-id");
class Pe extends se {
  constructor(t) {
    super(t), this.offset = 0;
    let r, n, s, c, u = ht.prototype.utf8Write ? function(a, h) {
      return o.utf8Write(a, h, o.byteLength - h);
    } : le && le.encodeInto ? function(a, h) {
      return le.encodeInto(a, o.subarray(h)).written;
    } : !1, y = this;
    t || (t = {});
    let w = t && t.sequential, A = t.structures || t.saveStructures, S = t.maxSharedStructures;
    if (S == null && (S = A ? 32 : 0), S > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    t.structuredClone && t.moreTypes == null && (this.moreTypes = !0);
    let b = t.maxOwnStructures;
    b == null && (b = A ? 32 : 64), !this.structures && t.useRecords != !1 && (this.structures = []);
    let I = S > 32 || b + S > 64, L = S + 64, q = S + b + 64;
    if (q > 8256)
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    let N = [], te = 0, oe = 0;
    this.pack = this.encode = function(a, h) {
      if (o || (o = new ue(8192), O = o.dataView || (o.dataView = new DataView(o.buffer, 0, 8192)), f = 0), V = o.length - 10, V - f < 2048 ? (o = new ue(o.length), O = o.dataView || (o.dataView = new DataView(o.buffer, 0, o.length)), V = o.length - 10, f = 0) : f = f + 7 & 2147483640, r = f, h & or && (f += h & 255), c = y.structuredClone ? /* @__PURE__ */ new Map() : null, y.bundleStrings && typeof a != "string" ? (_ = [], _.size = 1 / 0) : _ = null, s = y.structures, s) {
        s.uninitialized && (s = y._mergeStructures(y.getStructures()));
        let l = s.sharedLength || 0;
        if (l > S)
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + s.sharedLength);
        if (!s.transitions) {
          s.transitions = /* @__PURE__ */ Object.create(null);
          for (let g = 0; g < l; g++) {
            let p = s[g];
            if (!p)
              continue;
            let U, m = s.transitions;
            for (let T = 0, k = p.length; T < k; T++) {
              let F = p[T];
              U = m[F], U || (U = m[F] = /* @__PURE__ */ Object.create(null)), m = U;
            }
            m[X] = g + 64;
          }
          this.lastNamedStructuresLength = l;
        }
        w || (s.nextId = l + 64);
      }
      n && (n = !1);
      let x;
      try {
        y.randomAccessStructure && a && a.constructor && a.constructor === Object ? Bt(a) : R(a);
        let l = _;
        if (_ && Xe(r, R, 0), c && c.idsToInsert) {
          let g = c.idsToInsert.sort((T, k) => T.offset > k.offset ? 1 : -1), p = g.length, U = -1;
          for (; l && p > 0; ) {
            let T = g[--p].offset + r;
            T < l.stringsPosition + r && U === -1 && (U = 0), T > l.position + r ? U >= 0 && (U += 6) : (U >= 0 && (O.setUint32(
              l.position + r,
              O.getUint32(l.position + r) + U
            ), U = -1), l = l.previous, p++);
          }
          U >= 0 && l && O.setUint32(
            l.position + r,
            O.getUint32(l.position + r) + U
          ), f += g.length * 6, f > V && Q(f), y.offset = f;
          let m = nr(o.subarray(r, f), g);
          return c = null, m;
        }
        return y.offset = f, h & ir ? (o.start = r, o.end = f, o) : o.subarray(r, f);
      } catch (l) {
        throw x = l, l;
      } finally {
        if (s && (je(), n && y.saveStructures)) {
          let l = s.sharedLength || 0, g = o.subarray(r, f), p = sr(s, y);
          if (!x)
            return y.saveStructures(p, p.isCompatible) === !1 ? y.pack(a, h) : (y.lastNamedStructuresLength = l, o.length > 1073741824 && (o = null), g);
        }
        o.length > 1073741824 && (o = null), h & fr && (f = r);
      }
    };
    const je = () => {
      oe < 10 && oe++;
      let a = s.sharedLength || 0;
      if (s.length > a && !w && (s.length = a), te > 1e4)
        s.transitions = null, oe = 0, te = 0, N.length > 0 && (N = []);
      else if (N.length > 0 && !w) {
        for (let h = 0, x = N.length; h < x; h++)
          N[h][X] = 0;
        N = [];
      }
    }, we = (a) => {
      var h = a.length;
      h < 16 ? o[f++] = 144 | h : h < 65536 ? (o[f++] = 220, o[f++] = h >> 8, o[f++] = h & 255) : (o[f++] = 221, O.setUint32(f, h), f += 4);
      for (let x = 0; x < h; x++)
        R(a[x]);
    }, R = (a) => {
      f > V && (o = Q(f));
      var h = typeof a, x;
      if (h === "string") {
        let l = a.length;
        if (_ && l >= 4 && l < 4096) {
          if ((_.size += l) > er) {
            let m, T = (_[0] ? _[0].length * 3 + _[1].length : 0) + 10;
            f + T > V && (o = Q(f + T));
            let k;
            _.position ? (k = _, o[f] = 200, f += 3, o[f++] = 98, m = f - r, f += 4, Xe(r, R, 0), O.setUint16(m + r - 3, f - r - m)) : (o[f++] = 214, o[f++] = 98, m = f - r, f += 4), _ = ["", ""], _.previous = k, _.size = 0, _.position = m;
          }
          let U = tr.test(a);
          _[U ? 0 : 1] += a, o[f++] = 193, R(U ? -l : l);
          return;
        }
        let g;
        l < 32 ? g = 1 : l < 256 ? g = 2 : l < 65536 ? g = 3 : g = 5;
        let p = l * 3;
        if (f + p > V && (o = Q(f + p)), l < 64 || !u) {
          let U, m, T, k = f + g;
          for (U = 0; U < l; U++)
            m = a.charCodeAt(U), m < 128 ? o[k++] = m : m < 2048 ? (o[k++] = m >> 6 | 192, o[k++] = m & 63 | 128) : (m & 64512) === 55296 && ((T = a.charCodeAt(U + 1)) & 64512) === 56320 ? (m = 65536 + ((m & 1023) << 10) + (T & 1023), U++, o[k++] = m >> 18 | 240, o[k++] = m >> 12 & 63 | 128, o[k++] = m >> 6 & 63 | 128, o[k++] = m & 63 | 128) : (o[k++] = m >> 12 | 224, o[k++] = m >> 6 & 63 | 128, o[k++] = m & 63 | 128);
          x = k - f - g;
        } else
          x = u(a, f + g);
        x < 32 ? o[f++] = 160 | x : x < 256 ? (g < 2 && o.copyWithin(f + 2, f + 1, f + 1 + x), o[f++] = 217, o[f++] = x) : x < 65536 ? (g < 3 && o.copyWithin(f + 3, f + 2, f + 2 + x), o[f++] = 218, o[f++] = x >> 8, o[f++] = x & 255) : (g < 5 && o.copyWithin(f + 5, f + 3, f + 3 + x), o[f++] = 219, O.setUint32(f, x), f += 4), f += x;
      } else if (h === "number")
        if (a >>> 0 === a)
          a < 32 || a < 128 && this.useRecords === !1 || a < 64 && !this.randomAccessStructure ? o[f++] = a : a < 256 ? (o[f++] = 204, o[f++] = a) : a < 65536 ? (o[f++] = 205, o[f++] = a >> 8, o[f++] = a & 255) : (o[f++] = 206, O.setUint32(f, a), f += 4);
        else if (a >> 0 === a)
          a >= -32 ? o[f++] = 256 + a : a >= -128 ? (o[f++] = 208, o[f++] = a + 256) : a >= -32768 ? (o[f++] = 209, O.setInt16(f, a), f += 2) : (o[f++] = 210, O.setInt32(f, a), f += 4);
        else {
          let l;
          if ((l = this.useFloat32) > 0 && a < 4294967296 && a >= -2147483648) {
            o[f++] = 202, O.setFloat32(f, a);
            let g;
            if (l < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (g = a * Re[(o[f] & 127) << 1 | o[f + 1] >> 7]) >> 0 === g) {
              f += 4;
              return;
            } else
              f--;
          }
          o[f++] = 203, O.setFloat64(f, a), f += 8;
        }
      else if (h === "object" || h === "function")
        if (!a)
          o[f++] = 192;
        else {
          if (c) {
            let g = c.get(a);
            if (g) {
              if (!g.id) {
                let p = c.idsToInsert || (c.idsToInsert = []);
                g.id = p.push(g);
              }
              o[f++] = 214, o[f++] = 112, O.setUint32(f, g.id), f += 4;
              return;
            } else
              c.set(a, { offset: f - r });
          }
          let l = a.constructor;
          if (l === Object)
            ae(a);
          else if (l === Array)
            we(a);
          else if (l === Map)
            if (this.mapAsEmptyObject) o[f++] = 128;
            else {
              x = a.size, x < 16 ? o[f++] = 128 | x : x < 65536 ? (o[f++] = 222, o[f++] = x >> 8, o[f++] = x & 255) : (o[f++] = 223, O.setUint32(f, x), f += 4);
              for (let [g, p] of a)
                R(g), R(p);
            }
          else {
            for (let g = 0, p = Be.length; g < p; g++) {
              let U = gt[g];
              if (a instanceof U) {
                let m = Be[g];
                if (m.write) {
                  m.type && (o[f++] = 212, o[f++] = m.type, o[f++] = 0);
                  let re = m.write.call(this, a);
                  re === a ? Array.isArray(a) ? we(a) : ae(a) : R(re);
                  return;
                }
                let T = o, k = O, F = f;
                o = null;
                let Y;
                try {
                  Y = m.pack.call(this, a, (re) => (o = T, T = null, f += re, f > V && Q(f), {
                    target: o,
                    targetView: O,
                    position: f - re
                  }), R);
                } finally {
                  T && (o = T, O = k, f = F, V = o.length - 10);
                }
                Y && (Y.length + f > V && Q(Y.length + f), f = rr(Y, o, f, m.type));
                return;
              }
            }
            if (Array.isArray(a))
              we(a);
            else {
              if (a.toJSON) {
                const g = a.toJSON();
                if (g !== a)
                  return R(g);
              }
              if (h === "function")
                return R(this.writeFunction && this.writeFunction(a));
              ae(a);
            }
          }
        }
      else if (h === "boolean")
        o[f++] = a ? 195 : 194;
      else if (h === "bigint") {
        if (a < BigInt(1) << BigInt(63) && a >= -(BigInt(1) << BigInt(63)))
          o[f++] = 211, O.setBigInt64(f, a);
        else if (a < BigInt(1) << BigInt(64) && a > 0)
          o[f++] = 207, O.setBigUint64(f, a);
        else if (this.largeBigIntToFloat)
          o[f++] = 203, O.setFloat64(f, Number(a));
        else {
          if (this.largeBigIntToString)
            return R(a.toString());
          if (this.useBigIntExtension && a < BigInt(2) ** BigInt(1023) && a > -(BigInt(2) ** BigInt(1023))) {
            o[f++] = 199, f++, o[f++] = 66;
            let l = [], g;
            do {
              let p = a & BigInt(255);
              g = (p & BigInt(128)) === (a < BigInt(0) ? BigInt(128) : BigInt(0)), l.push(p), a >>= BigInt(8);
            } while (!((a === BigInt(0) || a === BigInt(-1)) && g));
            o[f - 2] = l.length;
            for (let p = l.length; p > 0; )
              o[f++] = Number(l[--p]);
            return;
          } else
            throw new RangeError(a + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
        }
        f += 8;
      } else if (h === "undefined")
        this.encodeUndefinedAsNil ? o[f++] = 192 : (o[f++] = 212, o[f++] = 0, o[f++] = 0);
      else
        throw new Error("Unknown type: " + h);
    }, Ne = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (a) => {
      let h;
      if (this.skipValues) {
        h = [];
        for (let g in a)
          (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(g)) && !this.skipValues.includes(a[g]) && h.push(g);
      } else
        h = Object.keys(a);
      let x = h.length;
      x < 16 ? o[f++] = 128 | x : x < 65536 ? (o[f++] = 222, o[f++] = x >> 8, o[f++] = x & 255) : (o[f++] = 223, O.setUint32(f, x), f += 4);
      let l;
      if (this.coercibleKeyAsNumber)
        for (let g = 0; g < x; g++) {
          l = h[g];
          let p = Number(l);
          R(isNaN(p) ? l : p), R(a[l]);
        }
      else
        for (let g = 0; g < x; g++)
          R(l = h[g]), R(a[l]);
    } : (a) => {
      o[f++] = 222;
      let h = f - r;
      f += 2;
      let x = 0;
      for (let l in a)
        (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(l)) && (R(l), R(a[l]), x++);
      if (x > 65535)
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      o[h++ + r] = x >> 8, o[h + r] = x & 255;
    }, Ve = this.useRecords === !1 ? Ne : t.progressiveRecords && !I ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (a) => {
        let h, x = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), l = f++ - r, g;
        for (let p in a)
          if (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(p)) {
            if (h = x[p], h)
              x = h;
            else {
              let U = Object.keys(a), m = x;
              x = s.transitions;
              let T = 0;
              for (let k = 0, F = U.length; k < F; k++) {
                let Y = U[k];
                h = x[Y], h || (h = x[Y] = /* @__PURE__ */ Object.create(null), T++), x = h;
              }
              l + r + 1 == f ? (f--, pe(x, U, T)) : qe(x, U, l, T), g = !0, x = m[p];
            }
            R(a[p]);
          }
        if (!g) {
          let p = x[X];
          p ? o[l + r] = p : qe(x, Object.keys(a), l, 0);
        }
      }
    ) : (a) => {
      let h, x = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), l = 0;
      for (let p in a) (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(p)) && (h = x[p], h || (h = x[p] = /* @__PURE__ */ Object.create(null), l++), x = h);
      let g = x[X];
      g ? g >= 96 && I ? (o[f++] = ((g -= 96) & 31) + 96, o[f++] = g >> 5) : o[f++] = g : pe(x, x.__keys__ || Object.keys(a), l);
      for (let p in a)
        (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(p)) && R(a[p]);
    }, Ce = typeof this.useRecords == "function" && this.useRecords, ae = Ce ? (a) => {
      Ce(a) ? Ve(a) : Ne(a);
    } : Ve, Q = (a) => {
      let h;
      if (a > 16777216) {
        if (a - r > Ke)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        h = Math.min(
          Ke,
          Math.round(Math.max((a - r) * (a > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        h = (Math.max(a - r << 2, o.length - 1) >> 12) + 1 << 12;
      let x = new ue(h);
      return O = x.dataView || (x.dataView = new DataView(x.buffer, 0, h)), a = Math.min(a, o.length), o.copy ? o.copy(x, 0, r, a) : x.set(o.slice(r, a)), f -= r, r = 0, V = x.length - 10, o = x;
    }, pe = (a, h, x) => {
      let l = s.nextId;
      l || (l = 64), l < L && this.shouldShareStructure && !this.shouldShareStructure(h) ? (l = s.nextOwnId, l < q || (l = L), s.nextOwnId = l + 1) : (l >= q && (l = L), s.nextId = l + 1);
      let g = h.highByte = l >= 96 && I ? l - 96 >> 5 : -1;
      a[X] = l, a.__keys__ = h, s[l - 64] = h, l < L ? (h.isShared = !0, s.sharedLength = l - 63, n = !0, g >= 0 ? (o[f++] = (l & 31) + 96, o[f++] = g) : o[f++] = l) : (g >= 0 ? (o[f++] = 213, o[f++] = 114, o[f++] = (l & 31) + 96, o[f++] = g) : (o[f++] = 212, o[f++] = 114, o[f++] = l), x && (te += oe * x), N.length >= b && (N.shift()[X] = 0), N.push(a), R(h));
    }, qe = (a, h, x, l) => {
      let g = o, p = f, U = V, m = r;
      o = ne, f = 0, r = 0, o || (ne = o = new ue(8192)), V = o.length - 10, pe(a, h, l), ne = o;
      let T = f;
      if (o = g, f = p, V = U, r = m, T > 1) {
        let k = f + T - 1;
        k > V && Q(k);
        let F = x + r;
        o.copyWithin(F + T, F + 1, f), o.set(ne.slice(0, T), F), f = k;
      } else
        o[x + r] = ne[0];
    }, Bt = (a) => {
      let h = Wt(a, o, r, f, s, Q, (x, l, g) => {
        if (g)
          return n = !0;
        f = l;
        let p = o;
        return R(x), je(), p !== o ? { position: f, targetView: O, target: o } : f;
      }, this);
      if (h === 0)
        return ae(a);
      f = h;
    };
  }
  useBuffer(t) {
    o = t, o.dataView || (o.dataView = new DataView(o.buffer, o.byteOffset, o.byteLength)), f = 0;
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
      let { target: s, targetView: c, position: u } = t(6);
      s[u++] = 214, s[u++] = 255, c.setUint32(u, n);
    } else if (n > 0 && n < 4294967296) {
      let { target: s, targetView: c, position: u } = t(10);
      s[u++] = 215, s[u++] = 255, c.setUint32(u, e.getMilliseconds() * 4e6 + (n / 1e3 / 4294967296 >> 0)), c.setUint32(u + 4, n);
    } else if (isNaN(n)) {
      if (this.onInvalidDate)
        return t(0), r(this.onInvalidDate());
      let { target: s, targetView: c, position: u } = t(3);
      s[u++] = 212, s[u++] = 255, s[u++] = 255;
    } else {
      let { target: s, targetView: c, position: u } = t(15);
      s[u++] = 199, s[u++] = 12, s[u++] = 255, c.setUint32(u, e.getMilliseconds() * 1e6), c.setBigInt64(u + 4, BigInt(Math.floor(n)));
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
    r !== ht && this.moreTypes ? Ze(e, xt.indexOf(r.name), t) : ve(e, t);
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
    var { target: c, position: u } = r(4 + s);
    c[u++] = 199, c[u++] = s + 1;
  } else if (s + 1 < 65536) {
    var { target: c, position: u } = r(5 + s);
    c[u++] = 200, c[u++] = s + 1 >> 8, c[u++] = s + 1 & 255;
  } else {
    var { target: c, position: u, targetView: y } = r(7 + s);
    c[u++] = 201, y.setUint32(u, s + 1), u += 4;
  }
  c[u++] = 116, c[u++] = t, e.buffer || (e = new Uint8Array(e)), c.set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), u);
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
    let c = r.offset, u = r.id;
    e.copyWithin(c + n, c, s), n -= 6;
    let y = c + n;
    e[y++] = 214, e[y++] = 105, e[y++] = u >> 24, e[y++] = u >> 16 & 255, e[y++] = u >> 8 & 255, e[y++] = u & 255, s = c;
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
const ir = 512, fr = 1024, or = 2048, ar = (e) => new Pe({ structuredClone: !0 }).unpack(new Uint8Array(e));
function cr(e) {
  return Ie(e) ? lr(e) : ur(e);
}
async function ur(e) {
  const t = await ee(e);
  return ke(t);
}
function lr(e) {
  const t = Oe(e);
  return ke(t);
}
const wt = (e, t = "application/octet-stream") => e instanceof Blob ? e : e instanceof ArrayBuffer ? new Blob([e], { type: t }) : typeof e == "string" ? new Blob([e], { type: t }) : ArrayBuffer.isView(e) ? new Blob([e], { type: t }) : Array.isArray(e) ? new Blob([Te(e)], { type: t }) : new Blob([]), xr = async (e) => {
  const t = wt(e), r = new FileReader();
  return new Promise((n, s) => {
    const c = (u) => typeof u == "string" ? n(u) : (console.log({ bytes: e }), s("Unable to convert to data URL"));
    r.onload = function(u) {
      c(u.target?.result);
    }, r.readAsDataURL(t);
  });
}, dr = (e) => {
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
  toMsgPack: dr,
  msgPackToObject: ar,
  typeOfBytes: gr,
  toDataUrl: xr,
  dataUrlToBlob: qt,
  lengthOf: zt,
  isByteLike: Ft,
  isImmediateByteLike: Ie,
  hashOf: ge,
  immediateHashOf: $t,
  addressStringOf: xe,
  toArrayBuffer: ee,
  immediateToArrayBuffer: Oe,
  toBlob: wt,
  toText: st,
  toBase64: cr,
  encodeAsString: nt,
  test: Dt,
  assignMediaTypeToBlob: Vt,
  utf8ToUint8Array: hr,
  base64ToArrayBuffer: Ct,
  arrayBufferToHex: jt,
  arrayBufferToUtf8: Nt,
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
Caused by: ${De(s)}` : "", u = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(Le).join(`
`) + u + c;
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
  for await (const u of e.listenOn(t, {
    callback: async (y) => {
      const w = G.msgPackToObject(y), { data: A, meta: S } = w;
      if (kt(w))
        throw console.error("Error in message: ", w), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${w?.data?.message}`
        );
      try {
        const b = await r(A, {
          headers: S?.headers,
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
  }, defaultTimeoutMs: s = 60 * 1e3, signal: c } = r, u = Object.entries(t);
  n("connect: subscribers: ", u);
  for (const [y, w] of u)
    br(w) || We({
      channel: e,
      subject: y,
      connectionListener: w,
      options: r
    });
  return {
    requestMany: async (y, w, A = {}) => {
      const { timeoutMs: S = 60 * 1e3, headers: b, callback: I } = A, L = G.toMsgPack({
        data: w,
        meta: { headers: b }
      }), q = await e.requestMany(
        y,
        L,
        {
          timeoutMs: S
        }
      );
      for await (const N of q) {
        if (c?.aborted)
          return;
        const te = G.msgPackToObject(N);
        await I?.(te);
      }
    },
    request: async (y, w, A = {}) => {
      const { timeoutMs: S = s, headers: b } = A, I = G.toMsgPack({
        data: w,
        meta: { headers: b }
      }), L = await e.request(y, I, {
        timeoutMs: S
      });
      return G.msgPackToObject(L);
    },
    publish: async (y, w, A = {}) => {
      const { headers: S } = A, b = G.toMsgPack({
        data: w,
        meta: { headers: S }
      });
      return e.postOn(y, b);
    },
    subscribe: async (y, w, A = {}) => We({
      channel: e,
      subject: y,
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
      const { signal: u, reply: y } = c;
      e(u)({ subject: n, data: s, reply: y });
    },
    listenOn: function(n, s = {}) {
      const { signal: c, once: u, callback: y } = s, w = new AbortController();
      c?.addEventListener("abort", () => {
        w.abort();
      });
      const A = t(w.signal)(async (S) => {
        if (typeof n == "string" ? S.subject === n : n.test(S.subject)) {
          const b = await y?.(S.data, {
            finished: S.finished ?? !1
          });
          if (S.reply && b && (et(b) ? (async () => {
            for await (const I of b)
              e(w.signal)({
                subject: S.reply,
                data: I
              });
            e(w.signal)({
              subject: S.reply,
              data: void 0,
              finished: !0
            });
          })() : e(w.signal)({
            subject: S.reply,
            data: b,
            finished: !0
          }), u && w.abort()), b && !et(b))
            return { ...S, data: b };
        }
        return S;
      });
      return async function* () {
        for await (const S of A)
          yield S.data;
      }();
    },
    request: async (n, s, c = {}) => {
      const { signal: u, timeoutMs: y } = c, w = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((A, S) => {
        u?.addEventListener("abort", () => {
          S(new Error("Request aborted"));
        });
        let b;
        y && (b = setTimeout(() => {
          S(new Error(`Request timed out for ${n}`));
        }, y)), r.listenOn(w, {
          callback: (I) => {
            clearTimeout(b), A(I);
          },
          signal: u,
          once: !0
        }), r.postOn(n, s, { reply: w, signal: u });
      });
    },
    requestMany: async (n, s, c = {}) => {
      const { signal: u, timeoutMs: y, callback: w } = c, A = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((S, b) => {
        u?.addEventListener("abort", () => {
          b(new Error("Request aborted"));
        });
        let I;
        y && (I = setTimeout(() => {
          b(new Error(`Request timed out for ${n}`));
        }, y));
        const L = r.listenOn(A, {
          callback: (q, N) => {
            if (q !== void 0 && w?.(q), N.finished)
              return clearTimeout(I), S(L);
          },
          signal: u
        });
        return r.postOn(n, s, { reply: A, signal: u }), L;
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
    }, u = async (y) => {
      if (r?.aborted)
        return;
      const w = await n?.(y), A = Le(w) ? w : y;
      s.push(A), c.resolve?.();
    };
    return r?.addEventListener("abort", () => {
      e.off(t, u);
    }), e.on(t, u), {
      [Symbol.asyncIterator]: async function* () {
        for (; !r?.aborted; )
          s.length > 0 ? yield s.shift() : await new Promise((y) => {
            c.resolve = y;
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

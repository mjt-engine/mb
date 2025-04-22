const Er = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, Bt = (e) => "value" in e && e.value !== void 0, Et = (e) => "error" in e && e.error !== void 0, Ur = (e) => Bt(e) || Et(e), Ut = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, kt = (e) => {
  const t = e;
  return Ut(e) && t.meta?.hasError || !1;
}, et = {
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
const tt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => {
  throw new Error("assertEqualElements: Bitrotted");
}, Tt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => Array.isArray(e) && Array.isArray(t) ? tt(e, t, r) : de(e === t, r), Ot = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is equal to ${JSON.stringify(t)}`)) => de(e !== t, r);
function It(e, t, r = "Assertion failed: Required value is not of correct type") {
  if (!t(e))
    throw new Error(Ue(r));
  return e;
}
function Mt(e, t = "Assertion failed: Reached what should be an unreachable section of code") {
  throw new Error(Ue(t));
}
function _t(e) {
  return e != null && !Number.isNaN(e);
}
function Pt(e, t = "Assertion failed: Required value not defined") {
  return de(_t(e), t), e;
}
const W = {
  assert: de,
  assertUnreachable: Mt,
  assertValue: Pt,
  assertEqual: Tt,
  assertNotEqual: Ot,
  assertEqualElements: tt,
  assertType: It
}, ke = (e) => {
  const t = e.flatMap((r) => typeof r == "number" ? [r] : JSON.stringify(r).split("").map((n) => n.codePointAt(0)));
  return new Float64Array(t.length).map((r, n) => t[n]);
}, ee = async (e) => e instanceof ArrayBuffer ? e : e instanceof Blob ? e.arrayBuffer() : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? ke(e) : new ArrayBuffer(0), he = async ({ bytes: e, algorithm: t = "SHA-512" }) => {
  const r = await ee(e);
  return crypto.subtle.digest(t, r);
}, rt = async (e, t = 16) => {
  const r = await ee(e);
  return [...new Uint8Array(r)].map((n) => n.toString(t).padStart(2, "0")).join("");
}, xe = async ({ bytes: e, algorithm: t = "SHA-512", radix: r = 16 }) => {
  const n = await he({ bytes: e, algorithm: t }), s = await rt(n, r);
  return `${t}:${s}`;
}, Rt = ({ id: e }) => {
  const t = e.split(":");
  W.assert(t.length === 2);
  const [r, n] = t, s = atob(n), c = new Uint8Array(s.length);
  return s.split("").map((u) => u.charCodeAt(0)).forEach((u, y) => {
    c[y] = u;
  }), c;
}, nt = async (e) => {
  if (typeof e == "string")
    return e;
  const t = await ee(e);
  return new TextDecoder().decode(t);
}, ie = [];
ie.push(async () => {
  const e = "test", t = await ee(e), r = await nt(t);
  return W.assertEqual(e, r);
});
ie.push(async () => Ee.map(async (e) => {
  const t = await he({ bytes: "test", algorithm: e });
  return W.assertEqual(t.byteLength, et[e]);
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
  const t = "test", r = await xe({ bytes: t, algorithm: e }), n = new Uint8Array(await he({ bytes: t, algorithm: e })), s = Rt({ id: r });
  return W.assertEqualElements(s, n);
}));
const Lt = async () => {
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
function Te(e) {
  const t = new Uint8Array(e.slice(0));
  let r = "";
  for (let n = 0; n < t.length; n++)
    r += String.fromCharCode(t[n]);
  return btoa(r);
}
const Dt = (e) => {
  const t = new Uint8Array(e), r = [];
  for (let n = 0; n < t.length; ++n)
    r.push(t[n].toString(16).padStart(2, "0"));
  return r.join("");
}, jt = (e) => new TextDecoder().decode(new Uint8Array(e)), Nt = (e, t) => e.slice(0, e.size, t), Vt = (e) => {
  const t = globalThis.atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}, Ct = (e) => {
  if (!e)
    return;
  const t = e.split(","), n = (t[0].match(/:(.*?);/) ?? [])[1], s = atob(t[1]);
  let c = s.length;
  const u = new Uint8Array(c);
  for (; c--; )
    u[c] = s.charCodeAt(c);
  return new Blob([u], { type: n });
}, Oe = (e) => e instanceof ArrayBuffer ? e : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? ke(e) : new ArrayBuffer(0), qt = async (e, t) => {
  const r = Oe(e);
  return crypto.subtle.digest(t, r);
}, Ie = (e) => {
  const t = e;
  return !!(t instanceof ArrayBuffer || typeof t == "string" || ArrayBuffer.isView(t) || Array.isArray(t));
}, $t = (e) => e instanceof Blob ? !0 : Ie(e), Ft = (e) => {
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
var d, J, i = 0, M = {}, B, G, $ = 0, z = 0, j, Q, C = [], A, $e = {
  useRecords: !1,
  mapsAsObjects: !0
};
class st {
}
const it = new st();
it.name = "MessagePack 0xC1";
var K = !1, ft = 2, zt;
try {
  new Function("");
} catch {
  ft = 1 / 0;
}
class se {
  constructor(t) {
    t && (t.useRecords === !1 && t.mapsAsObjects === void 0 && (t.mapsAsObjects = !0), t.sequential && t.trusted !== !1 && (t.trusted = !0, !t.structures && t.useRecords != !1 && (t.structures = [], t.maxSharedStructures || (t.maxSharedStructures = 0))), t.structures ? t.structures.sharedLength = t.structures.length : t.getStructures && ((t.structures = []).uninitialized = !0, t.structures.sharedLength = 0), t.int64AsNumber && (t.int64AsType = "number")), Object.assign(this, t);
  }
  unpack(t, r) {
    if (d)
      return xt(() => (Ae(), this ? this.unpack(t, r) : se.prototype.unpack.call($e, t, r)));
    !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < "u" ? Buffer.from(t) : new Uint8Array(t)), typeof r == "object" ? (J = r.end || t.length, i = r.start || 0) : (i = 0, J = r > -1 ? r : t.length), z = 0, G = null, j = null, d = t;
    try {
      A = t.dataView || (t.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength));
    } catch (n) {
      throw d = null, t instanceof Uint8Array ? n : new Error("Source must be a Uint8Array or Buffer but was a " + (t && typeof t == "object" ? t.constructor.name : typeof t));
    }
    if (this instanceof se) {
      if (M = this, this.structures)
        return B = this.structures, ce(r);
      (!B || B.length > 0) && (B = []);
    } else
      M = $e, (!B || B.length > 0) && (B = []);
    return ce(r);
  }
  unpackMultiple(t, r) {
    let n, s = 0;
    try {
      K = !0;
      let c = t.length, u = this ? this.unpack(t, c) : ge.unpack(t, c);
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
      K = !1, Ae();
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
    if (!M.trusted && !K) {
      let r = B.sharedLength || 0;
      r < B.length && (B.length = r);
    }
    let t;
    if (M.randomAccessStructure && d[i] < 64 && d[i] >= 32 && zt || (t = R()), j && (i = j.postBundlePosition, j = null), K && (B.restoreStructures = null), i == J)
      B && B.restoreStructures && Fe(), B = null, d = null, Q && (Q = null);
    else {
      if (i > J)
        throw new Error("Unexpected end of MessagePack data");
      if (!K) {
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
    throw B && B.restoreStructures && Fe(), Ae(), (t instanceof RangeError || t.message.startsWith("Unexpected end of buffer") || i > J) && (t.incomplete = !0), t;
  }
}
function Fe() {
  for (let e in B.restoreStructures)
    B[e] = B.restoreStructures[e];
  B.restoreStructures = null;
}
function R() {
  let e = d[i++];
  if (e < 160)
    if (e < 128) {
      if (e < 64)
        return e;
      {
        let t = B[e & 63] || M.getStructures && ot()[e & 63];
        return t ? (t.read || (t.read = Me(t, e & 63)), t.read()) : e;
      }
    } else if (e < 144)
      if (e -= 128, M.mapsAsObjects) {
        let t = {};
        for (let r = 0; r < e; r++) {
          let n = ct();
          n === "__proto__" && (n = "__proto_"), t[n] = R();
        }
        return t;
      } else {
        let t = /* @__PURE__ */ new Map();
        for (let r = 0; r < e; r++)
          t.set(R(), R());
        return t;
      }
    else {
      e -= 144;
      let t = new Array(e);
      for (let r = 0; r < e; r++)
        t[r] = R();
      return M.freezeData ? Object.freeze(t) : t;
    }
  else if (e < 192) {
    let t = e - 160;
    if (z >= i)
      return G.slice(i - $, (i += t) - $);
    if (z == 0 && J < 140) {
      let r = t < 16 ? _e(t) : at(t);
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
        return j ? (t = R(), t > 0 ? j[1].slice(j.position1, j.position1 += t) : j[0].slice(j.position0, j.position0 -= t)) : it;
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
        return t = A.getUint16(i), i += 2, Se(t);
      case 198:
        return t = A.getUint32(i), i += 4, Se(t);
      case 199:
        return Z(d[i++]);
      case 200:
        return t = A.getUint16(i), i += 2, Z(t);
      case 201:
        return t = A.getUint32(i), i += 4, Z(t);
      case 202:
        if (t = A.getFloat32(i), M.useFloat32 > 2) {
          let r = Pe[(d[i] & 127) << 1 | d[i + 1] >> 7];
          return i += 4, (r * t + (t > 0 ? 0.5 : -0.5) >> 0) / r;
        }
        return i += 4, t;
      case 203:
        return t = A.getFloat64(i), i += 8, t;
      // uint handlers
      case 204:
        return d[i++];
      case 205:
        return t = A.getUint16(i), i += 2, t;
      case 206:
        return t = A.getUint32(i), i += 4, t;
      case 207:
        return M.int64AsType === "number" ? (t = A.getUint32(i) * 4294967296, t += A.getUint32(i + 4)) : M.int64AsType === "string" ? t = A.getBigUint64(i).toString() : M.int64AsType === "auto" ? (t = A.getBigUint64(i), t <= BigInt(2) << BigInt(52) && (t = Number(t))) : t = A.getBigUint64(i), i += 8, t;
      // int handlers
      case 208:
        return A.getInt8(i++);
      case 209:
        return t = A.getInt16(i), i += 2, t;
      case 210:
        return t = A.getInt32(i), i += 4, t;
      case 211:
        return M.int64AsType === "number" ? (t = A.getInt32(i) * 4294967296, t += A.getUint32(i + 4)) : M.int64AsType === "string" ? t = A.getBigInt64(i).toString() : M.int64AsType === "auto" ? (t = A.getBigInt64(i), t >= BigInt(-2) << BigInt(52) && t <= BigInt(2) << BigInt(52) && (t = Number(t))) : t = A.getBigInt64(i), i += 8, t;
      case 212:
        if (t = d[i++], t == 114)
          return ve(d[i++] & 63);
        {
          let r = C[t];
          if (r)
            return r.read ? (i++, r.read(R())) : r.noBuffer ? (i++, r()) : r(d.subarray(i, ++i));
          throw new Error("Unknown extension " + t);
        }
      case 213:
        return t = d[i], t == 114 ? (i++, ve(d[i++] & 63, d[i++])) : Z(2);
      case 214:
        return Z(4);
      case 215:
        return Z(8);
      case 216:
        return Z(16);
      case 217:
        return t = d[i++], z >= i ? G.slice(i - $, (i += t) - $) : Ht(t);
      case 218:
        return t = A.getUint16(i), i += 2, z >= i ? G.slice(i - $, (i += t) - $) : Qt(t);
      case 219:
        return t = A.getUint32(i), i += 4, z >= i ? G.slice(i - $, (i += t) - $) : Yt(t);
      case 220:
        return t = A.getUint16(i), i += 2, Je(t);
      case 221:
        return t = A.getUint32(i), i += 4, Je(t);
      case 222:
        return t = A.getUint16(i), i += 2, He(t);
      case 223:
        return t = A.getUint32(i), i += 4, He(t);
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
const Jt = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function Me(e, t) {
  function r() {
    if (r.count++ > ft) {
      let s = e.read = new Function("r", "return function(){return " + (M.freezeData ? "Object.freeze" : "") + "({" + e.map((c) => c === "__proto__" ? "__proto_:r()" : Jt.test(c) ? c + ":r()" : "[" + JSON.stringify(c) + "]:r()").join(",") + "})}")(R);
      return e.highByte === 0 && (e.read = ze(t, e.read)), s();
    }
    let n = {};
    for (let s = 0, c = e.length; s < c; s++) {
      let u = e[s];
      u === "__proto__" && (u = "__proto_"), n[u] = R();
    }
    return M.freezeData ? Object.freeze(n) : n;
  }
  return r.count = 0, e.highByte === 0 ? ze(t, r) : r;
}
const ze = (e, t) => function() {
  let r = d[i++];
  if (r === 0)
    return t();
  let n = e < 32 ? -(e + (r << 5)) : e + (r << 5), s = B[n] || ot()[n];
  if (!s)
    throw new Error("Record id is not defined for " + n);
  return s.read || (s.read = Me(s, e)), s.read();
};
function ot() {
  let e = xt(() => (d = null, M.getStructures()));
  return B = M._mergeStructures(e, B);
}
var me = fe, Ht = fe, Qt = fe, Yt = fe;
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
    t[r] = R();
  return M.freezeData ? Object.freeze(t) : t;
}
function He(e) {
  if (M.mapsAsObjects) {
    let t = {};
    for (let r = 0; r < e; r++) {
      let n = ct();
      n === "__proto__" && (n = "__proto_"), t[n] = R();
    }
    return t;
  } else {
    let t = /* @__PURE__ */ new Map();
    for (let r = 0; r < e; r++)
      t.set(R(), R());
    return t;
  }
}
var D = String.fromCharCode;
function at(e) {
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
          let E = d[i++];
          if ((E & 128) > 0) {
            i -= 9;
            return;
          }
          return D(t, r, n, s, c, u, y, w, E);
        }
      } else if (e < 12) {
        let E = d[i++], S = d[i++];
        if ((E & 128) > 0 || (S & 128) > 0) {
          i -= 10;
          return;
        }
        if (e < 11)
          return D(t, r, n, s, c, u, y, w, E, S);
        let b = d[i++];
        if ((b & 128) > 0) {
          i -= 11;
          return;
        }
        return D(t, r, n, s, c, u, y, w, E, S, b);
      } else {
        let E = d[i++], S = d[i++], b = d[i++], I = d[i++];
        if ((E & 128) > 0 || (S & 128) > 0 || (b & 128) > 0 || (I & 128) > 0) {
          i -= 12;
          return;
        }
        if (e < 14) {
          if (e === 12)
            return D(t, r, n, s, c, u, y, w, E, S, b, I);
          {
            let L = d[i++];
            if ((L & 128) > 0) {
              i -= 13;
              return;
            }
            return D(t, r, n, s, c, u, y, w, E, S, b, I, L);
          }
        } else {
          let L = d[i++], q = d[i++];
          if ((L & 128) > 0 || (q & 128) > 0) {
            i -= 14;
            return;
          }
          if (e < 15)
            return D(t, r, n, s, c, u, y, w, E, S, b, I, L, q);
          let N = d[i++];
          if ((N & 128) > 0) {
            i -= 15;
            return;
          }
          return D(t, r, n, s, c, u, y, w, E, S, b, I, L, q, N);
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
        t = A.getUint16(i), i += 2;
        break;
      case 219:
        t = A.getUint32(i), i += 4;
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
function Z(e) {
  let t = d[i++];
  if (C[t]) {
    let r;
    return C[t](d.subarray(i, r = i += e), (n) => {
      i = n;
      try {
        return R();
      } finally {
        i = r;
      }
    });
  } else
    throw new Error("Unknown extension type " + t);
}
var Ye = new Array(4096);
function ct() {
  let e = d[i++];
  if (e >= 160 && e < 192) {
    if (e = e - 160, z >= i)
      return G.slice(i - $, (i += e) - $);
    if (!(z == 0 && J < 180))
      return me(e);
  } else
    return i--, ut(R());
  let t = (e << 5 ^ (e > 1 ? A.getUint16(i) : e > 0 ? d[i] : 0)) & 4095, r = Ye[t], n = i, s = i + e - 3, c, u = 0;
  if (r && r.bytes == e) {
    for (; n < s; ) {
      if (c = A.getUint32(n), c != r[u++]) {
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
    c = A.getUint32(n), r.push(c), n += 4;
  for (s += 3; n < s; )
    c = d[n++], r.push(c);
  let y = e < 16 ? _e(e) : at(e);
  return y != null ? r.string = y : r.string = me(e);
}
function ut(e) {
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return e.toString();
  if (e == null) return e + "";
  throw new Error("Invalid property type for record", typeof e);
}
const ve = (e, t) => {
  let r = R().map(ut), n = e;
  t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, r.highByte = t);
  let s = B[e];
  return s && (s.isShared || K) && ((B.restoreStructures || (B.restoreStructures = []))[e] = s), B[e] = r, r.read = Me(r, n), r.read();
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
let vt = { Error, TypeError, ReferenceError };
C[101] = () => {
  let e = R();
  return (vt[e[0]] || Error)(e[1], { cause: e[2] });
};
C[105] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = A.getUint32(i - 4);
  Q || (Q = /* @__PURE__ */ new Map());
  let r = d[i], n;
  r >= 144 && r < 160 || r == 220 || r == 221 ? n = [] : n = {};
  let s = { target: n };
  Q.set(t, s);
  let c = R();
  return s.used ? Object.assign(n, c) : (s.target = c, c);
};
C[112] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = A.getUint32(i - 4), r = Q.get(t);
  return r.used = !0, r.target;
};
C[115] = () => new Set(R());
const lt = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((e) => e + "Array");
let Gt = typeof globalThis == "object" ? globalThis : window;
C[116] = (e) => {
  let t = e[0], r = lt[t];
  if (!r) {
    if (t === 16) {
      let n = new ArrayBuffer(e.length - 1);
      return new Uint8Array(n).set(e.subarray(1)), n;
    }
    throw new Error("Could not find typed array for code " + t);
  }
  return new Gt[r](Uint8Array.prototype.slice.call(e, 1).buffer);
};
C[120] = () => {
  let e = R();
  return new RegExp(e[0], e[1]);
};
const Kt = [];
C[98] = (e) => {
  let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], r = i;
  return i += t - e.length, j = Kt, j = [Qe(), Qe()], j.position0 = 0, j.position1 = 0, j.postBundlePosition = i, i = r, R();
};
C[255] = (e) => e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(
  ((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3
) : e.length == 12 ? new Date(
  ((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3
) : /* @__PURE__ */ new Date("invalid");
function xt(e) {
  let t = J, r = i, n = $, s = z, c = G, u = Q, y = j, w = new Uint8Array(d.slice(0, J)), E = B, S = B.slice(0, B.length), b = M, I = K, L = e();
  return J = t, i = r, $ = n, z = s, G = c, Q = u, j = y, d = w, K = I, B = E, B.splice(0, B.length, ...S), M = b, A = new DataView(d.buffer, d.byteOffset, d.byteLength), L;
}
function Ae() {
  d = null, Q = null, B = null;
}
const Pe = new Array(147);
for (let e = 0; e < 256; e++)
  Pe[e] = +("1e" + Math.floor(45.15 - e * 0.30103));
var ge = new se({ useRecords: !1 });
ge.unpack;
ge.unpackMultiple;
ge.unpack;
let Zt = new Float32Array(1);
new Uint8Array(Zt.buffer, 0, 4);
let le;
try {
  le = new TextEncoder();
} catch {
}
let Be, dt;
const ye = typeof Buffer < "u", ue = ye ? function(e) {
  return Buffer.allocUnsafeSlow(e);
} : Uint8Array, ht = ye ? Buffer : Uint8Array, Ge = ye ? 4294967296 : 2144337920;
let o, ne, O, f = 0, V, _ = null, Xt;
const Wt = 21760, er = /[\u0080-\uFFFF]/, X = Symbol("record-id");
class Re extends se {
  constructor(t) {
    super(t), this.offset = 0;
    let r, n, s, c, u = ht.prototype.utf8Write ? function(a, g) {
      return o.utf8Write(a, g, o.byteLength - g);
    } : le && le.encodeInto ? function(a, g) {
      return le.encodeInto(a, o.subarray(g)).written;
    } : !1, y = this;
    t || (t = {});
    let w = t && t.sequential, E = t.structures || t.saveStructures, S = t.maxSharedStructures;
    if (S == null && (S = E ? 32 : 0), S > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    t.structuredClone && t.moreTypes == null && (this.moreTypes = !0);
    let b = t.maxOwnStructures;
    b == null && (b = E ? 32 : 64), !this.structures && t.useRecords != !1 && (this.structures = []);
    let I = S > 32 || b + S > 64, L = S + 64, q = S + b + 64;
    if (q > 8256)
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    let N = [], te = 0, oe = 0;
    this.pack = this.encode = function(a, g) {
      if (o || (o = new ue(8192), O = o.dataView || (o.dataView = new DataView(o.buffer, 0, 8192)), f = 0), V = o.length - 10, V - f < 2048 ? (o = new ue(o.length), O = o.dataView || (o.dataView = new DataView(o.buffer, 0, o.length)), V = o.length - 10, f = 0) : f = f + 7 & 2147483640, r = f, g & fr && (f += g & 255), c = y.structuredClone ? /* @__PURE__ */ new Map() : null, y.bundleStrings && typeof a != "string" ? (_ = [], _.size = 1 / 0) : _ = null, s = y.structures, s) {
        s.uninitialized && (s = y._mergeStructures(y.getStructures()));
        let l = s.sharedLength || 0;
        if (l > S)
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + s.sharedLength);
        if (!s.transitions) {
          s.transitions = /* @__PURE__ */ Object.create(null);
          for (let h = 0; h < l; h++) {
            let p = s[h];
            if (!p)
              continue;
            let U, m = s.transitions;
            for (let k = 0, T = p.length; k < T; k++) {
              let F = p[k];
              U = m[F], U || (U = m[F] = /* @__PURE__ */ Object.create(null)), m = U;
            }
            m[X] = h + 64;
          }
          this.lastNamedStructuresLength = l;
        }
        w || (s.nextId = l + 64);
      }
      n && (n = !1);
      let x;
      try {
        y.randomAccessStructure && a && a.constructor && a.constructor === Object ? At(a) : P(a);
        let l = _;
        if (_ && Xe(r, P, 0), c && c.idsToInsert) {
          let h = c.idsToInsert.sort((k, T) => k.offset > T.offset ? 1 : -1), p = h.length, U = -1;
          for (; l && p > 0; ) {
            let k = h[--p].offset + r;
            k < l.stringsPosition + r && U === -1 && (U = 0), k > l.position + r ? U >= 0 && (U += 6) : (U >= 0 && (O.setUint32(
              l.position + r,
              O.getUint32(l.position + r) + U
            ), U = -1), l = l.previous, p++);
          }
          U >= 0 && l && O.setUint32(
            l.position + r,
            O.getUint32(l.position + r) + U
          ), f += h.length * 6, f > V && Y(f), y.offset = f;
          let m = rr(o.subarray(r, f), h);
          return c = null, m;
        }
        return y.offset = f, g & sr ? (o.start = r, o.end = f, o) : o.subarray(r, f);
      } catch (l) {
        throw x = l, l;
      } finally {
        if (s && (je(), n && y.saveStructures)) {
          let l = s.sharedLength || 0, h = o.subarray(r, f), p = nr(s, y);
          if (!x)
            return y.saveStructures(p, p.isCompatible) === !1 ? y.pack(a, g) : (y.lastNamedStructuresLength = l, o.length > 1073741824 && (o = null), h);
        }
        o.length > 1073741824 && (o = null), g & ir && (f = r);
      }
    };
    const je = () => {
      oe < 10 && oe++;
      let a = s.sharedLength || 0;
      if (s.length > a && !w && (s.length = a), te > 1e4)
        s.transitions = null, oe = 0, te = 0, N.length > 0 && (N = []);
      else if (N.length > 0 && !w) {
        for (let g = 0, x = N.length; g < x; g++)
          N[g][X] = 0;
        N = [];
      }
    }, we = (a) => {
      var g = a.length;
      g < 16 ? o[f++] = 144 | g : g < 65536 ? (o[f++] = 220, o[f++] = g >> 8, o[f++] = g & 255) : (o[f++] = 221, O.setUint32(f, g), f += 4);
      for (let x = 0; x < g; x++)
        P(a[x]);
    }, P = (a) => {
      f > V && (o = Y(f));
      var g = typeof a, x;
      if (g === "string") {
        let l = a.length;
        if (_ && l >= 4 && l < 4096) {
          if ((_.size += l) > Wt) {
            let m, k = (_[0] ? _[0].length * 3 + _[1].length : 0) + 10;
            f + k > V && (o = Y(f + k));
            let T;
            _.position ? (T = _, o[f] = 200, f += 3, o[f++] = 98, m = f - r, f += 4, Xe(r, P, 0), O.setUint16(m + r - 3, f - r - m)) : (o[f++] = 214, o[f++] = 98, m = f - r, f += 4), _ = ["", ""], _.previous = T, _.size = 0, _.position = m;
          }
          let U = er.test(a);
          _[U ? 0 : 1] += a, o[f++] = 193, P(U ? -l : l);
          return;
        }
        let h;
        l < 32 ? h = 1 : l < 256 ? h = 2 : l < 65536 ? h = 3 : h = 5;
        let p = l * 3;
        if (f + p > V && (o = Y(f + p)), l < 64 || !u) {
          let U, m, k, T = f + h;
          for (U = 0; U < l; U++)
            m = a.charCodeAt(U), m < 128 ? o[T++] = m : m < 2048 ? (o[T++] = m >> 6 | 192, o[T++] = m & 63 | 128) : (m & 64512) === 55296 && ((k = a.charCodeAt(U + 1)) & 64512) === 56320 ? (m = 65536 + ((m & 1023) << 10) + (k & 1023), U++, o[T++] = m >> 18 | 240, o[T++] = m >> 12 & 63 | 128, o[T++] = m >> 6 & 63 | 128, o[T++] = m & 63 | 128) : (o[T++] = m >> 12 | 224, o[T++] = m >> 6 & 63 | 128, o[T++] = m & 63 | 128);
          x = T - f - h;
        } else
          x = u(a, f + h);
        x < 32 ? o[f++] = 160 | x : x < 256 ? (h < 2 && o.copyWithin(f + 2, f + 1, f + 1 + x), o[f++] = 217, o[f++] = x) : x < 65536 ? (h < 3 && o.copyWithin(f + 3, f + 2, f + 2 + x), o[f++] = 218, o[f++] = x >> 8, o[f++] = x & 255) : (h < 5 && o.copyWithin(f + 5, f + 3, f + 3 + x), o[f++] = 219, O.setUint32(f, x), f += 4), f += x;
      } else if (g === "number")
        if (a >>> 0 === a)
          a < 32 || a < 128 && this.useRecords === !1 || a < 64 && !this.randomAccessStructure ? o[f++] = a : a < 256 ? (o[f++] = 204, o[f++] = a) : a < 65536 ? (o[f++] = 205, o[f++] = a >> 8, o[f++] = a & 255) : (o[f++] = 206, O.setUint32(f, a), f += 4);
        else if (a >> 0 === a)
          a >= -32 ? o[f++] = 256 + a : a >= -128 ? (o[f++] = 208, o[f++] = a + 256) : a >= -32768 ? (o[f++] = 209, O.setInt16(f, a), f += 2) : (o[f++] = 210, O.setInt32(f, a), f += 4);
        else {
          let l;
          if ((l = this.useFloat32) > 0 && a < 4294967296 && a >= -2147483648) {
            o[f++] = 202, O.setFloat32(f, a);
            let h;
            if (l < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (h = a * Pe[(o[f] & 127) << 1 | o[f + 1] >> 7]) >> 0 === h) {
              f += 4;
              return;
            } else
              f--;
          }
          o[f++] = 203, O.setFloat64(f, a), f += 8;
        }
      else if (g === "object" || g === "function")
        if (!a)
          o[f++] = 192;
        else {
          if (c) {
            let h = c.get(a);
            if (h) {
              if (!h.id) {
                let p = c.idsToInsert || (c.idsToInsert = []);
                h.id = p.push(h);
              }
              o[f++] = 214, o[f++] = 112, O.setUint32(f, h.id), f += 4;
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
              for (let [h, p] of a)
                P(h), P(p);
            }
          else {
            for (let h = 0, p = Be.length; h < p; h++) {
              let U = dt[h];
              if (a instanceof U) {
                let m = Be[h];
                if (m.write) {
                  m.type && (o[f++] = 212, o[f++] = m.type, o[f++] = 0);
                  let re = m.write.call(this, a);
                  re === a ? Array.isArray(a) ? we(a) : ae(a) : P(re);
                  return;
                }
                let k = o, T = O, F = f;
                o = null;
                let v;
                try {
                  v = m.pack.call(this, a, (re) => (o = k, k = null, f += re, f > V && Y(f), {
                    target: o,
                    targetView: O,
                    position: f - re
                  }), P);
                } finally {
                  k && (o = k, O = T, f = F, V = o.length - 10);
                }
                v && (v.length + f > V && Y(v.length + f), f = tr(v, o, f, m.type));
                return;
              }
            }
            if (Array.isArray(a))
              we(a);
            else {
              if (a.toJSON) {
                const h = a.toJSON();
                if (h !== a)
                  return P(h);
              }
              if (g === "function")
                return P(this.writeFunction && this.writeFunction(a));
              ae(a);
            }
          }
        }
      else if (g === "boolean")
        o[f++] = a ? 195 : 194;
      else if (g === "bigint") {
        if (a < BigInt(1) << BigInt(63) && a >= -(BigInt(1) << BigInt(63)))
          o[f++] = 211, O.setBigInt64(f, a);
        else if (a < BigInt(1) << BigInt(64) && a > 0)
          o[f++] = 207, O.setBigUint64(f, a);
        else if (this.largeBigIntToFloat)
          o[f++] = 203, O.setFloat64(f, Number(a));
        else {
          if (this.largeBigIntToString)
            return P(a.toString());
          if (this.useBigIntExtension && a < BigInt(2) ** BigInt(1023) && a > -(BigInt(2) ** BigInt(1023))) {
            o[f++] = 199, f++, o[f++] = 66;
            let l = [], h;
            do {
              let p = a & BigInt(255);
              h = (p & BigInt(128)) === (a < BigInt(0) ? BigInt(128) : BigInt(0)), l.push(p), a >>= BigInt(8);
            } while (!((a === BigInt(0) || a === BigInt(-1)) && h));
            o[f - 2] = l.length;
            for (let p = l.length; p > 0; )
              o[f++] = Number(l[--p]);
            return;
          } else
            throw new RangeError(a + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
        }
        f += 8;
      } else if (g === "undefined")
        this.encodeUndefinedAsNil ? o[f++] = 192 : (o[f++] = 212, o[f++] = 0, o[f++] = 0);
      else
        throw new Error("Unknown type: " + g);
    }, Ne = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (a) => {
      let g;
      if (this.skipValues) {
        g = [];
        for (let h in a)
          (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(h)) && !this.skipValues.includes(a[h]) && g.push(h);
      } else
        g = Object.keys(a);
      let x = g.length;
      x < 16 ? o[f++] = 128 | x : x < 65536 ? (o[f++] = 222, o[f++] = x >> 8, o[f++] = x & 255) : (o[f++] = 223, O.setUint32(f, x), f += 4);
      let l;
      if (this.coercibleKeyAsNumber)
        for (let h = 0; h < x; h++) {
          l = g[h];
          let p = Number(l);
          P(isNaN(p) ? l : p), P(a[l]);
        }
      else
        for (let h = 0; h < x; h++)
          P(l = g[h]), P(a[l]);
    } : (a) => {
      o[f++] = 222;
      let g = f - r;
      f += 2;
      let x = 0;
      for (let l in a)
        (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(l)) && (P(l), P(a[l]), x++);
      if (x > 65535)
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      o[g++ + r] = x >> 8, o[g + r] = x & 255;
    }, Ve = this.useRecords === !1 ? Ne : t.progressiveRecords && !I ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (a) => {
        let g, x = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), l = f++ - r, h;
        for (let p in a)
          if (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(p)) {
            if (g = x[p], g)
              x = g;
            else {
              let U = Object.keys(a), m = x;
              x = s.transitions;
              let k = 0;
              for (let T = 0, F = U.length; T < F; T++) {
                let v = U[T];
                g = x[v], g || (g = x[v] = /* @__PURE__ */ Object.create(null), k++), x = g;
              }
              l + r + 1 == f ? (f--, pe(x, U, k)) : qe(x, U, l, k), h = !0, x = m[p];
            }
            P(a[p]);
          }
        if (!h) {
          let p = x[X];
          p ? o[l + r] = p : qe(x, Object.keys(a), l, 0);
        }
      }
    ) : (a) => {
      let g, x = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), l = 0;
      for (let p in a) (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(p)) && (g = x[p], g || (g = x[p] = /* @__PURE__ */ Object.create(null), l++), x = g);
      let h = x[X];
      h ? h >= 96 && I ? (o[f++] = ((h -= 96) & 31) + 96, o[f++] = h >> 5) : o[f++] = h : pe(x, x.__keys__ || Object.keys(a), l);
      for (let p in a)
        (typeof a.hasOwnProperty != "function" || a.hasOwnProperty(p)) && P(a[p]);
    }, Ce = typeof this.useRecords == "function" && this.useRecords, ae = Ce ? (a) => {
      Ce(a) ? Ve(a) : Ne(a);
    } : Ve, Y = (a) => {
      let g;
      if (a > 16777216) {
        if (a - r > Ge)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        g = Math.min(
          Ge,
          Math.round(Math.max((a - r) * (a > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        g = (Math.max(a - r << 2, o.length - 1) >> 12) + 1 << 12;
      let x = new ue(g);
      return O = x.dataView || (x.dataView = new DataView(x.buffer, 0, g)), a = Math.min(a, o.length), o.copy ? o.copy(x, 0, r, a) : x.set(o.slice(r, a)), f -= r, r = 0, V = x.length - 10, o = x;
    }, pe = (a, g, x) => {
      let l = s.nextId;
      l || (l = 64), l < L && this.shouldShareStructure && !this.shouldShareStructure(g) ? (l = s.nextOwnId, l < q || (l = L), s.nextOwnId = l + 1) : (l >= q && (l = L), s.nextId = l + 1);
      let h = g.highByte = l >= 96 && I ? l - 96 >> 5 : -1;
      a[X] = l, a.__keys__ = g, s[l - 64] = g, l < L ? (g.isShared = !0, s.sharedLength = l - 63, n = !0, h >= 0 ? (o[f++] = (l & 31) + 96, o[f++] = h) : o[f++] = l) : (h >= 0 ? (o[f++] = 213, o[f++] = 114, o[f++] = (l & 31) + 96, o[f++] = h) : (o[f++] = 212, o[f++] = 114, o[f++] = l), x && (te += oe * x), N.length >= b && (N.shift()[X] = 0), N.push(a), P(g));
    }, qe = (a, g, x, l) => {
      let h = o, p = f, U = V, m = r;
      o = ne, f = 0, r = 0, o || (ne = o = new ue(8192)), V = o.length - 10, pe(a, g, l), ne = o;
      let k = f;
      if (o = h, f = p, V = U, r = m, k > 1) {
        let T = f + k - 1;
        T > V && Y(T);
        let F = x + r;
        o.copyWithin(F + k, F + 1, f), o.set(ne.slice(0, k), F), f = T;
      } else
        o[x + r] = ne[0];
    }, At = (a) => {
      let g = Xt(a, o, r, f, s, Y, (x, l, h) => {
        if (h)
          return n = !0;
        f = l;
        let p = o;
        return P(x), je(), p !== o ? { position: f, targetView: O, target: o } : f;
      }, this);
      if (g === 0)
        return ae(a);
      f = g;
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
dt = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, st];
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
    this.moreTypes ? Ke(e, 16, t) : Ze(ye ? Buffer.from(e) : new Uint8Array(e), t);
  }
}, {
  pack(e, t) {
    let r = e.constructor;
    r !== ht && this.moreTypes ? Ke(e, lt.indexOf(r.name), t) : Ze(e, t);
  }
}, {
  pack(e, t) {
    let { target: r, position: n } = t(1);
    r[n] = 193;
  }
}];
function Ke(e, t, r, n) {
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
function Ze(e, t) {
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
function tr(e, t, r, n) {
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
function rr(e, t) {
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
function nr(e, t) {
  return e.isCompatible = (r) => {
    let n = !r || (t.lastNamedStructuresLength || 0) === r.length;
    return n || t._mergeStructures(r), n;
  }, e;
}
let gt = new Re({ useRecords: !1 });
gt.pack;
gt.pack;
const sr = 512, ir = 1024, fr = 2048, or = (e) => new Re({ structuredClone: !0 }).unpack(new Uint8Array(e));
function ar(e) {
  return Ie(e) ? ur(e) : cr(e);
}
async function cr(e) {
  const t = await ee(e);
  return Te(t);
}
function ur(e) {
  const t = Oe(e);
  return Te(t);
}
const yt = (e, t = "application/octet-stream") => e instanceof Blob ? e : e instanceof ArrayBuffer ? new Blob([e], { type: t }) : typeof e == "string" ? new Blob([e], { type: t }) : ArrayBuffer.isView(e) ? new Blob([e], { type: t }) : Array.isArray(e) ? new Blob([ke(e)], { type: t }) : new Blob([]), lr = async (e) => {
  const t = yt(e), r = new FileReader();
  return new Promise((n, s) => {
    const c = (u) => typeof u == "string" ? n(u) : (console.log({ bytes: e }), s("Unable to convert to data URL"));
    r.onload = function(u) {
      c(u.target?.result);
    }, r.readAsDataURL(t);
  });
}, xr = (e) => {
  const t = new Re({ structuredClone: !0 });
  return new Uint8Array(t.encode(e));
}, dr = (e) => {
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
}, hr = (e) => new TextEncoder().encode(e), H = {
  toMsgPack: xr,
  msgPackToObject: or,
  typeOfBytes: dr,
  toDataUrl: lr,
  dataUrlToBlob: Ct,
  lengthOf: Ft,
  isByteLike: $t,
  isImmediateByteLike: Ie,
  hashOf: he,
  immediateHashOf: qt,
  addressStringOf: xe,
  toArrayBuffer: ee,
  immediateToArrayBuffer: Oe,
  toBlob: yt,
  toText: nt,
  toBase64: ar,
  encodeAsString: rt,
  test: Lt,
  assignMediaTypeToBlob: Nt,
  utf8ToUint8Array: hr,
  base64ToArrayBuffer: Vt,
  arrayBufferToHex: Dt,
  arrayBufferToUtf8: jt,
  arrayBufferToBase64: Te,
  ALL_ALGORITHMS: Ee,
  ALGORITHM_BYTE_LENGTHS: et
}, gr = (e) => typeof e == "function", wt = (e) => e == null || Number.isNaN(e), pt = (e) => !wt(e), yr = (e) => gr(e) ? e() : e, wr = (e, t = {}) => {
  const { quiet: r = !1, def: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (c) {
    return r || (console.error(c), pt(s) && console.log(yr(s))), n;
  }
}, pr = {
  isDefined: pt,
  isUndefined: wt,
  safe: wr
}, { isDefined: Le, isUndefined: Sr, safe: St } = pr, De = (e) => {
  const { message: t, stack: r, extra: n, cause: s } = e, c = s ? `
Caused by: ${De(s)}` : "", u = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(Le).join(`
`) + u + c;
}, bt = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? De(e) : St(() => JSON.stringify(e, void 0, 2)) ?? "", br = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? De(e) : St(() => JSON.stringify(e, void 0, 2)) ?? "";
}, mt = ({ error: e, extra: t, stack: r }) => {
  if (e instanceof Error) {
    const n = Le(e.cause) ? mt({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? r,
      extra: t,
      cause: n
    };
  }
  return {
    message: bt(e),
    stack: r,
    extra: t
  };
}, mr = {
  errorToErrorDetail: mt,
  errorToText: bt,
  errorToTextAsync: br
}, Ar = async ({
  channel: e,
  subject: t,
  connectionListener: r,
  options: n = {},
  signal: s
}) => {
  const { log: c = () => {
  } } = n;
  c("connectConnectionListenerToSubject: subject: ", t);
  for await (const u of e.listenOn(t, {
    callback: async (y) => {
      const w = H.msgPackToObject(y), { data: E, meta: S } = w;
      if (kt(w))
        throw console.error("Error in message: ", w), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${w?.data?.message}`
        );
      try {
        const b = await r(E, {
          headers: S?.headers,
          signal: s
        });
        return H.toMsgPack({
          data: b
        });
      } catch (b) {
        const I = mr.errorToErrorDetail({ error: b });
        return H.toMsgPack({
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
}, kr = async ({
  channel: e,
  subscribers: t = {},
  options: r = {},
  signal: n
}) => {
  const { log: s = () => {
  }, defaultTimeoutMs: c = 60 * 1e3 } = r, u = Object.entries(t);
  s("connect: subscribers: ", u);
  for (const [y, w] of u)
    Sr(w) || Ar({
      channel: e,
      subject: y,
      connectionListener: w,
      options: r,
      signal: n
    });
  return {
    requestMany: async (y, w, E = {}) => {
      const { timeoutMs: S = 60 * 1e3, headers: b, callback: I } = E, L = H.toMsgPack({
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
        if (n?.aborted)
          return;
        const te = H.msgPackToObject(N);
        await I?.(te);
      }
    },
    request: async (y, w, E = {}) => {
      const { timeoutMs: S = c, headers: b } = E, I = H.toMsgPack({
        data: w,
        meta: { headers: b }
      }), L = await e.request(y, I, {
        timeoutMs: S
      });
      return H.msgPackToObject(L);
    },
    publish: async (y, w, E = {}) => {
      const { headers: S } = E;
      H.toMsgPack({
        value: w
      });
      const b = H.toMsgPack({
        data: w,
        meta: { headers: S }
      });
      return e.postOn(y, b);
    }
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
      const E = t(w.signal)(async (S) => {
        if (typeof n == "string" ? S.subject === n : n.test(S.subject)) {
          const b = await y?.(S.data, {
            finished: S.finished ?? !1
          });
          if (S.reply && b && (We(b) ? (async () => {
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
          }), u && w.abort()), b && !We(b))
            return { ...S, data: b };
        }
        return S;
      });
      return async function* () {
        for await (const S of E)
          yield S.data;
      }();
    },
    request: async (n, s, c = {}) => {
      const { signal: u, timeoutMs: y } = c, w = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((E, S) => {
        u?.addEventListener("abort", () => {
          S(new Error("Request aborted"));
        });
        let b;
        y && (b = setTimeout(() => {
          S(new Error("Request timed out"));
        }, y)), r.listenOn(w, {
          callback: (I) => {
            clearTimeout(b), E(I);
          },
          signal: u,
          once: !0
        }), r.postOn(n, s, { reply: w, signal: u });
      });
    },
    requestMany: async (n, s, c = {}) => {
      const { signal: u, timeoutMs: y, callback: w } = c, E = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((S, b) => {
        u?.addEventListener("abort", () => {
          b(new Error("Request aborted"));
        });
        let I;
        y && (I = setTimeout(() => {
          b(new Error("Request timed out"));
        }, y));
        const L = r.listenOn(E, {
          callback: (q, N) => {
            if (q !== void 0 && w?.(q), N.finished)
              return clearTimeout(I), S(L);
          },
          signal: u
        });
        return r.postOn(n, s, { reply: E, signal: u }), L;
      });
    }
  };
  return r;
};
function We(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const Tr = (e, t = "channel_message") => Br({
  posterProducer: (r) => (n) => {
    r?.aborted || e.emit(t, n);
  },
  listenerProducer: (r) => (n) => {
    const s = [], c = {
      resolve: void 0
    }, u = async (y) => {
      if (r?.aborted)
        return;
      const w = await n?.(y), E = Le(w) ? w : y;
      s.push(E), c.resolve?.();
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
  Tr as EmitterChannel,
  kr as MessageBus,
  Et as isError,
  kt as isErrorMsg,
  Ut as isMsg,
  Bt as isValue,
  Ur as isValueOrError,
  Er as parseSubject
};

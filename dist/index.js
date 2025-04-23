const Tr = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, Ut = (e) => "value" in e && e.value !== void 0, kt = (e) => "error" in e && e.error !== void 0, Or = (e) => Ut(e) || kt(e), Tt = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, Ot = (e) => {
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
}, It = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => Array.isArray(e) && Array.isArray(t) ? rt(e, t, r) : xe(e === t, r), Mt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is equal to ${JSON.stringify(t)}`)) => xe(e !== t, r);
function Lt(e, t, r = "Assertion failed: Required value is not of correct type") {
  if (!t(e))
    throw new Error(Ue(r));
  return e;
}
function Rt(e, t = "Assertion failed: Reached what should be an unreachable section of code") {
  throw new Error(Ue(t));
}
function _t(e) {
  return e != null && !Number.isNaN(e);
}
function Pt(e, t = "Assertion failed: Required value not defined") {
  return xe(_t(e), t), e;
}
const ee = {
  assert: xe,
  assertUnreachable: Rt,
  assertValue: Pt,
  assertEqual: It,
  assertNotEqual: Mt,
  assertEqualElements: rt,
  assertType: Lt
}, ke = (e) => {
  const t = e.flatMap((r) => typeof r == "number" ? [r] : JSON.stringify(r).split("").map((n) => n.codePointAt(0)));
  return new Float64Array(t.length).map((r, n) => t[n]);
}, te = async (e) => e instanceof ArrayBuffer ? e : e instanceof Blob ? e.arrayBuffer() : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? ke(e) : new ArrayBuffer(0), ge = async ({ bytes: e, algorithm: t = "SHA-512" }) => {
  const r = await te(e);
  return crypto.subtle.digest(t, r);
}, nt = async (e, t = 16) => {
  const r = await te(e);
  return [...new Uint8Array(r)].map((n) => n.toString(t).padStart(2, "0")).join("");
}, de = async ({ bytes: e, algorithm: t = "SHA-512", radix: r = 16 }) => {
  const n = await ge({ bytes: e, algorithm: t }), s = await nt(n, r);
  return `${t}:${s}`;
}, Dt = ({ id: e }) => {
  const t = e.split(":");
  ee.assert(t.length === 2);
  const [r, n] = t, s = atob(n), l = new Uint8Array(s.length);
  return s.split("").map((c) => c.charCodeAt(0)).forEach((c, y) => {
    l[y] = c;
  }), l;
}, st = async (e) => {
  if (typeof e == "string")
    return e;
  const t = await te(e);
  return new TextDecoder().decode(t);
}, fe = [];
fe.push(async () => {
  const e = "test", t = await te(e), r = await st(t);
  return ee.assertEqual(e, r);
});
fe.push(async () => Ee.map(async (e) => {
  const t = await ge({ bytes: "test", algorithm: e });
  return ee.assertEqual(t.byteLength, tt[e]);
}));
fe.push(async () => {
  {
    const e = await de({
      bytes: "test",
      algorithm: "SHA-256"
    });
    ee.assertEqual(e, "SHA-256:n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=");
  }
  {
    const e = await de({
      bytes: "test",
      algorithm: "SHA-512"
    });
    ee.assertEqual(e, "SHA-512:7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==");
  }
});
fe.push(async () => Ee.map(async (e) => {
  const t = "test", r = await de({ bytes: t, algorithm: e }), n = new Uint8Array(await ge({ bytes: t, algorithm: e })), s = Dt({ id: r });
  return ee.assertEqualElements(s, n);
}));
const qt = async () => {
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
function Te(e) {
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
}, Vt = (e) => new TextDecoder().decode(new Uint8Array(e)), Ct = (e, t) => e.slice(0, e.size, t), $t = (e) => {
  const t = globalThis.atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++)
    n[s] = t.charCodeAt(s);
  return n.buffer;
}, jt = (e) => {
  if (!e)
    return;
  const t = e.split(","), n = (t[0].match(/:(.*?);/) ?? [])[1], s = atob(t[1]);
  let l = s.length;
  const c = new Uint8Array(l);
  for (; l--; )
    c[l] = s.charCodeAt(l);
  return new Blob([c], { type: n });
}, Oe = (e) => e instanceof ArrayBuffer ? e : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? ke(e) : new ArrayBuffer(0), Ft = async (e, t) => {
  const r = Oe(e);
  return crypto.subtle.digest(t, r);
}, Ie = (e) => {
  const t = e;
  return !!(t instanceof ArrayBuffer || typeof t == "string" || ArrayBuffer.isView(t) || Array.isArray(t));
}, zt = (e) => e instanceof Blob ? !0 : Ie(e), Jt = (e) => {
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
var x, J, i = 0, M = {}, E, G, j = 0, z = 0, N, H, $ = [], B, je = {
  useRecords: !1,
  mapsAsObjects: !0
};
class it {
}
const ft = new it();
ft.name = "MessagePack 0xC1";
var K = !1, at = 2, Ht;
try {
  new Function("");
} catch {
  at = 1 / 0;
}
class ie {
  constructor(t) {
    t && (t.useRecords === !1 && t.mapsAsObjects === void 0 && (t.mapsAsObjects = !0), t.sequential && t.trusted !== !1 && (t.trusted = !0, !t.structures && t.useRecords != !1 && (t.structures = [], t.maxSharedStructures || (t.maxSharedStructures = 0))), t.structures ? t.structures.sharedLength = t.structures.length : t.getStructures && ((t.structures = []).uninitialized = !0, t.structures.sharedLength = 0), t.int64AsNumber && (t.int64AsType = "number")), Object.assign(this, t);
  }
  unpack(t, r) {
    if (x)
      return xt(() => (Ae(), this ? this.unpack(t, r) : ie.prototype.unpack.call(je, t, r)));
    !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < "u" ? Buffer.from(t) : new Uint8Array(t)), typeof r == "object" ? (J = r.end || t.length, i = r.start || 0) : (i = 0, J = r > -1 ? r : t.length), z = 0, G = null, N = null, x = t;
    try {
      B = t.dataView || (t.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength));
    } catch (n) {
      throw x = null, t instanceof Uint8Array ? n : new Error("Source must be a Uint8Array or Buffer but was a " + (t && typeof t == "object" ? t.constructor.name : typeof t));
    }
    if (this instanceof ie) {
      if (M = this, this.structures)
        return E = this.structures, le(r);
      (!E || E.length > 0) && (E = []);
    } else
      M = je, (!E || E.length > 0) && (E = []);
    return le(r);
  }
  unpackMultiple(t, r) {
    let n, s = 0;
    try {
      K = !0;
      let l = t.length, c = this ? this.unpack(t, l) : he.unpack(t, l);
      if (r) {
        if (r(c, s, i) === !1) return;
        for (; i < l; )
          if (s = i, r(le(), s, i) === !1)
            return;
      } else {
        for (n = [c]; i < l; )
          s = i, n.push(le());
        return n;
      }
    } catch (l) {
      throw l.lastPosition = s, l.values = n, l;
    } finally {
      K = !1, Ae();
    }
  }
  _mergeStructures(t, r) {
    t = t || [], Object.isFrozen(t) && (t = t.map((n) => n.slice(0)));
    for (let n = 0, s = t.length; n < s; n++) {
      let l = t[n];
      l && (l.isShared = !0, n >= 32 && (l.highByte = n - 32 >> 5));
    }
    t.sharedLength = t.length;
    for (let n in r || [])
      if (n >= 0) {
        let s = t[n], l = r[n];
        l && (s && ((t.restoreStructures || (t.restoreStructures = []))[n] = s), t[n] = l);
      }
    return this.structures = t;
  }
  decode(t, r) {
    return this.unpack(t, r);
  }
}
function le(e) {
  try {
    if (!M.trusted && !K) {
      let r = E.sharedLength || 0;
      r < E.length && (E.length = r);
    }
    let t;
    if (M.randomAccessStructure && x[i] < 64 && x[i] >= 32 && Ht || (t = P()), N && (i = N.postBundlePosition, N = null), K && (E.restoreStructures = null), i == J)
      E && E.restoreStructures && Fe(), E = null, x = null, H && (H = null);
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
          let n = ct();
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
      return G.slice(i - j, (i += t) - j);
    if (z == 0 && J < 140) {
      let r = t < 16 ? Le(t) : lt(t);
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
        return Z(x[i++]);
      case 200:
        return t = B.getUint16(i), i += 2, Z(t);
      case 201:
        return t = B.getUint32(i), i += 4, Z(t);
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
          return ve(x[i++] & 63);
        {
          let r = $[t];
          if (r)
            return r.read ? (i++, r.read(P())) : r.noBuffer ? (i++, r()) : r(x.subarray(i, ++i));
          throw new Error("Unknown extension " + t);
        }
      case 213:
        return t = x[i], t == 114 ? (i++, ve(x[i++] & 63, x[i++])) : Z(2);
      case 214:
        return Z(4);
      case 215:
        return Z(8);
      case 216:
        return Z(16);
      case 217:
        return t = x[i++], z >= i ? G.slice(i - j, (i += t) - j) : Yt(t);
      case 218:
        return t = B.getUint16(i), i += 2, z >= i ? G.slice(i - j, (i += t) - j) : vt(t);
      case 219:
        return t = B.getUint32(i), i += 4, z >= i ? G.slice(i - j, (i += t) - j) : Gt(t);
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
const Qt = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function Me(e, t) {
  function r() {
    if (r.count++ > at) {
      let s = e.read = new Function("r", "return function(){return " + (M.freezeData ? "Object.freeze" : "") + "({" + e.map((l) => l === "__proto__" ? "__proto_:r()" : Qt.test(l) ? l + ":r()" : "[" + JSON.stringify(l) + "]:r()").join(",") + "})}")(P);
      return e.highByte === 0 && (e.read = ze(t, e.read)), s();
    }
    let n = {};
    for (let s = 0, l = e.length; s < l; s++) {
      let c = e[s];
      c === "__proto__" && (c = "__proto_"), n[c] = P();
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
var me = ae, Yt = ae, vt = ae, Gt = ae;
function ae(e) {
  let t;
  if (e < 16 && (t = Le(e)))
    return t;
  if (e > 64 && be)
    return be.decode(x.subarray(i, i += e));
  const r = i + e, n = [];
  for (t = ""; i < r; ) {
    const s = x[i++];
    if ((s & 128) === 0)
      n.push(s);
    else if ((s & 224) === 192) {
      const l = x[i++] & 63;
      n.push((s & 31) << 6 | l);
    } else if ((s & 240) === 224) {
      const l = x[i++] & 63, c = x[i++] & 63;
      n.push((s & 31) << 12 | l << 6 | c);
    } else if ((s & 248) === 240) {
      const l = x[i++] & 63, c = x[i++] & 63, y = x[i++] & 63;
      let w = (s & 7) << 18 | l << 12 | c << 6 | y;
      w > 65535 && (w -= 65536, n.push(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), n.push(w);
    } else
      n.push(s);
    n.length >= 4096 && (t += q.apply(String, n), n.length = 0);
  }
  return n.length > 0 && (t += q.apply(String, n)), t;
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
      let n = ct();
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
var q = String.fromCharCode;
function lt(e) {
  let t = i, r = new Array(e);
  for (let n = 0; n < e; n++) {
    const s = x[i++];
    if ((s & 128) > 0) {
      i = t;
      return;
    }
    r[n] = s;
  }
  return q.apply(String, r);
}
function Le(e) {
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
        return q(t);
      }
    } else {
      let t = x[i++], r = x[i++];
      if ((t & 128) > 0 || (r & 128) > 0) {
        i -= 2;
        return;
      }
      if (e < 3)
        return q(t, r);
      let n = x[i++];
      if ((n & 128) > 0) {
        i -= 3;
        return;
      }
      return q(t, r, n);
    }
  else {
    let t = x[i++], r = x[i++], n = x[i++], s = x[i++];
    if ((t & 128) > 0 || (r & 128) > 0 || (n & 128) > 0 || (s & 128) > 0) {
      i -= 4;
      return;
    }
    if (e < 6) {
      if (e === 4)
        return q(t, r, n, s);
      {
        let l = x[i++];
        if ((l & 128) > 0) {
          i -= 5;
          return;
        }
        return q(t, r, n, s, l);
      }
    } else if (e < 8) {
      let l = x[i++], c = x[i++];
      if ((l & 128) > 0 || (c & 128) > 0) {
        i -= 6;
        return;
      }
      if (e < 7)
        return q(t, r, n, s, l, c);
      let y = x[i++];
      if ((y & 128) > 0) {
        i -= 7;
        return;
      }
      return q(t, r, n, s, l, c, y);
    } else {
      let l = x[i++], c = x[i++], y = x[i++], w = x[i++];
      if ((l & 128) > 0 || (c & 128) > 0 || (y & 128) > 0 || (w & 128) > 0) {
        i -= 8;
        return;
      }
      if (e < 10) {
        if (e === 8)
          return q(t, r, n, s, l, c, y, w);
        {
          let A = x[i++];
          if ((A & 128) > 0) {
            i -= 9;
            return;
          }
          return q(t, r, n, s, l, c, y, w, A);
        }
      } else if (e < 12) {
        let A = x[i++], p = x[i++];
        if ((A & 128) > 0 || (p & 128) > 0) {
          i -= 10;
          return;
        }
        if (e < 11)
          return q(t, r, n, s, l, c, y, w, A, p);
        let b = x[i++];
        if ((b & 128) > 0) {
          i -= 11;
          return;
        }
        return q(t, r, n, s, l, c, y, w, A, p, b);
      } else {
        let A = x[i++], p = x[i++], b = x[i++], O = x[i++];
        if ((A & 128) > 0 || (p & 128) > 0 || (b & 128) > 0 || (O & 128) > 0) {
          i -= 12;
          return;
        }
        if (e < 14) {
          if (e === 12)
            return q(t, r, n, s, l, c, y, w, A, p, b, O);
          {
            let _ = x[i++];
            if ((_ & 128) > 0) {
              i -= 13;
              return;
            }
            return q(t, r, n, s, l, c, y, w, A, p, b, O, _);
          }
        } else {
          let _ = x[i++], C = x[i++];
          if ((_ & 128) > 0 || (C & 128) > 0) {
            i -= 14;
            return;
          }
          if (e < 15)
            return q(t, r, n, s, l, c, y, w, A, p, b, O, _, C);
          let D = x[i++];
          if ((D & 128) > 0) {
            i -= 15;
            return;
          }
          return q(t, r, n, s, l, c, y, w, A, p, b, O, _, C, D);
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
  return ae(t);
}
function Se(e) {
  return M.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(x, i, i += e)
  ) : x.subarray(i, i += e);
}
function Z(e) {
  let t = x[i++];
  if ($[t]) {
    let r;
    return $[t](x.subarray(i, r = i += e), (n) => {
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
function ct() {
  let e = x[i++];
  if (e >= 160 && e < 192) {
    if (e = e - 160, z >= i)
      return G.slice(i - j, (i += e) - j);
    if (!(z == 0 && J < 180))
      return me(e);
  } else
    return i--, ut(P());
  let t = (e << 5 ^ (e > 1 ? B.getUint16(i) : e > 0 ? x[i] : 0)) & 4095, r = Ye[t], n = i, s = i + e - 3, l, c = 0;
  if (r && r.bytes == e) {
    for (; n < s; ) {
      if (l = B.getUint32(n), l != r[c++]) {
        n = 1879048192;
        break;
      }
      n += 4;
    }
    for (s += 3; n < s; )
      if (l = x[n++], l != r[c++]) {
        n = 1879048192;
        break;
      }
    if (n === s)
      return i = n, r.string;
    s -= 3, n = i;
  }
  for (r = [], Ye[t] = r, r.bytes = e; n < s; )
    l = B.getUint32(n), r.push(l), n += 4;
  for (s += 3; n < s; )
    l = x[n++], r.push(l);
  let y = e < 16 ? Le(e) : lt(e);
  return y != null ? r.string = y : r.string = me(e);
}
function ut(e) {
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return e.toString();
  if (e == null) return e + "";
  throw new Error("Invalid property type for record", typeof e);
}
const ve = (e, t) => {
  let r = P().map(ut), n = e;
  t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, r.highByte = t);
  let s = E[e];
  return s && (s.isShared || K) && ((E.restoreStructures || (E.restoreStructures = []))[e] = s), E[e] = r, r.read = Me(r, n), r.read();
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
let Kt = { Error, TypeError, ReferenceError };
$[101] = () => {
  let e = P();
  return (Kt[e[0]] || Error)(e[1], { cause: e[2] });
};
$[105] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4);
  H || (H = /* @__PURE__ */ new Map());
  let r = x[i], n;
  r >= 144 && r < 160 || r == 220 || r == 221 ? n = [] : n = {};
  let s = { target: n };
  H.set(t, s);
  let l = P();
  return s.used ? Object.assign(n, l) : (s.target = l, l);
};
$[112] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4), r = H.get(t);
  return r.used = !0, r.target;
};
$[115] = () => new Set(P());
const dt = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((e) => e + "Array");
let Zt = typeof globalThis == "object" ? globalThis : window;
$[116] = (e) => {
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
$[120] = () => {
  let e = P();
  return new RegExp(e[0], e[1]);
};
const Xt = [];
$[98] = (e) => {
  let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], r = i;
  return i += t - e.length, N = Xt, N = [Qe(), Qe()], N.position0 = 0, N.position1 = 0, N.postBundlePosition = i, i = r, P();
};
$[255] = (e) => e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(
  ((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3
) : e.length == 12 ? new Date(
  ((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3
) : /* @__PURE__ */ new Date("invalid");
function xt(e) {
  let t = J, r = i, n = j, s = z, l = G, c = H, y = N, w = new Uint8Array(x.slice(0, J)), A = E, p = E.slice(0, E.length), b = M, O = K, _ = e();
  return J = t, i = r, j = n, z = s, G = l, H = c, N = y, x = w, K = O, E = A, E.splice(0, E.length, ...p), M = b, B = new DataView(x.buffer, x.byteOffset, x.byteLength), _;
}
function Ae() {
  x = null, H = null, E = null;
}
const Re = new Array(147);
for (let e = 0; e < 256; e++)
  Re[e] = +("1e" + Math.floor(45.15 - e * 0.30103));
var he = new ie({ useRecords: !1 });
he.unpack;
he.unpackMultiple;
he.unpack;
let Wt = new Float32Array(1);
new Uint8Array(Wt.buffer, 0, 4);
let ue;
try {
  ue = new TextEncoder();
} catch {
}
let Be, gt;
const ye = typeof Buffer < "u", ce = ye ? function(e) {
  return Buffer.allocUnsafeSlow(e);
} : Uint8Array, ht = ye ? Buffer : Uint8Array, Ge = ye ? 4294967296 : 2144337920;
let a, se, I, f = 0, V, L = null, er;
const tr = 21760, rr = /[\u0080-\uFFFF]/, W = Symbol("record-id");
class _e extends ie {
  constructor(t) {
    super(t), this.offset = 0;
    let r, n, s, l, c = ht.prototype.utf8Write ? function(o, h) {
      return a.utf8Write(o, h, a.byteLength - h);
    } : ue && ue.encodeInto ? function(o, h) {
      return ue.encodeInto(o, a.subarray(h)).written;
    } : !1, y = this;
    t || (t = {});
    let w = t && t.sequential, A = t.structures || t.saveStructures, p = t.maxSharedStructures;
    if (p == null && (p = A ? 32 : 0), p > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    t.structuredClone && t.moreTypes == null && (this.moreTypes = !0);
    let b = t.maxOwnStructures;
    b == null && (b = A ? 32 : 64), !this.structures && t.useRecords != !1 && (this.structures = []);
    let O = p > 32 || b + p > 64, _ = p + 64, C = p + b + 64;
    if (C > 8256)
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    let D = [], re = 0, X = 0;
    this.pack = this.encode = function(o, h) {
      if (a || (a = new ce(8192), I = a.dataView || (a.dataView = new DataView(a.buffer, 0, 8192)), f = 0), V = a.length - 10, V - f < 2048 ? (a = new ce(a.length), I = a.dataView || (a.dataView = new DataView(a.buffer, 0, a.length)), V = a.length - 10, f = 0) : f = f + 7 & 2147483640, r = f, h & or && (f += h & 255), l = y.structuredClone ? /* @__PURE__ */ new Map() : null, y.bundleStrings && typeof o != "string" ? (L = [], L.size = 1 / 0) : L = null, s = y.structures, s) {
        s.uninitialized && (s = y._mergeStructures(y.getStructures()));
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
            for (let k = 0, T = S.length; k < T; k++) {
              let F = S[k];
              U = m[F], U || (U = m[F] = /* @__PURE__ */ Object.create(null)), m = U;
            }
            m[W] = g + 64;
          }
          this.lastNamedStructuresLength = u;
        }
        w || (s.nextId = u + 64);
      }
      n && (n = !1);
      let d;
      try {
        y.randomAccessStructure && o && o.constructor && o.constructor === Object ? Et(o) : R(o);
        let u = L;
        if (L && Xe(r, R, 0), l && l.idsToInsert) {
          let g = l.idsToInsert.sort((k, T) => k.offset > T.offset ? 1 : -1), S = g.length, U = -1;
          for (; u && S > 0; ) {
            let k = g[--S].offset + r;
            k < u.stringsPosition + r && U === -1 && (U = 0), k > u.position + r ? U >= 0 && (U += 6) : (U >= 0 && (I.setUint32(
              u.position + r,
              I.getUint32(u.position + r) + U
            ), U = -1), u = u.previous, S++);
          }
          U >= 0 && u && I.setUint32(
            u.position + r,
            I.getUint32(u.position + r) + U
          ), f += g.length * 6, f > V && Q(f), y.offset = f;
          let m = sr(a.subarray(r, f), g);
          return l = null, m;
        }
        return y.offset = f, h & fr ? (a.start = r, a.end = f, a) : a.subarray(r, f);
      } catch (u) {
        throw d = u, u;
      } finally {
        if (s && (qe(), n && y.saveStructures)) {
          let u = s.sharedLength || 0, g = a.subarray(r, f), S = ir(s, y);
          if (!d)
            return y.saveStructures(S, S.isCompatible) === !1 ? y.pack(o, h) : (y.lastNamedStructuresLength = u, a.length > 1073741824 && (a = null), g);
        }
        a.length > 1073741824 && (a = null), h & ar && (f = r);
      }
    };
    const qe = () => {
      X < 10 && X++;
      let o = s.sharedLength || 0;
      if (s.length > o && !w && (s.length = o), re > 1e4)
        s.transitions = null, X = 0, re = 0, D.length > 0 && (D = []);
      else if (D.length > 0 && !w) {
        for (let h = 0, d = D.length; h < d; h++)
          D[h][W] = 0;
        D = [];
      }
    }, we = (o) => {
      var h = o.length;
      h < 16 ? a[f++] = 144 | h : h < 65536 ? (a[f++] = 220, a[f++] = h >> 8, a[f++] = h & 255) : (a[f++] = 221, I.setUint32(f, h), f += 4);
      for (let d = 0; d < h; d++)
        R(o[d]);
    }, R = (o) => {
      f > V && (a = Q(f));
      var h = typeof o, d;
      if (h === "string") {
        let u = o.length;
        if (L && u >= 4 && u < 4096) {
          if ((L.size += u) > tr) {
            let m, k = (L[0] ? L[0].length * 3 + L[1].length : 0) + 10;
            f + k > V && (a = Q(f + k));
            let T;
            L.position ? (T = L, a[f] = 200, f += 3, a[f++] = 98, m = f - r, f += 4, Xe(r, R, 0), I.setUint16(m + r - 3, f - r - m)) : (a[f++] = 214, a[f++] = 98, m = f - r, f += 4), L = ["", ""], L.previous = T, L.size = 0, L.position = m;
          }
          let U = rr.test(o);
          L[U ? 0 : 1] += o, a[f++] = 193, R(U ? -u : u);
          return;
        }
        let g;
        u < 32 ? g = 1 : u < 256 ? g = 2 : u < 65536 ? g = 3 : g = 5;
        let S = u * 3;
        if (f + S > V && (a = Q(f + S)), u < 64 || !c) {
          let U, m, k, T = f + g;
          for (U = 0; U < u; U++)
            m = o.charCodeAt(U), m < 128 ? a[T++] = m : m < 2048 ? (a[T++] = m >> 6 | 192, a[T++] = m & 63 | 128) : (m & 64512) === 55296 && ((k = o.charCodeAt(U + 1)) & 64512) === 56320 ? (m = 65536 + ((m & 1023) << 10) + (k & 1023), U++, a[T++] = m >> 18 | 240, a[T++] = m >> 12 & 63 | 128, a[T++] = m >> 6 & 63 | 128, a[T++] = m & 63 | 128) : (a[T++] = m >> 12 | 224, a[T++] = m >> 6 & 63 | 128, a[T++] = m & 63 | 128);
          d = T - f - g;
        } else
          d = c(o, f + g);
        d < 32 ? a[f++] = 160 | d : d < 256 ? (g < 2 && a.copyWithin(f + 2, f + 1, f + 1 + d), a[f++] = 217, a[f++] = d) : d < 65536 ? (g < 3 && a.copyWithin(f + 3, f + 2, f + 2 + d), a[f++] = 218, a[f++] = d >> 8, a[f++] = d & 255) : (g < 5 && a.copyWithin(f + 5, f + 3, f + 3 + d), a[f++] = 219, I.setUint32(f, d), f += 4), f += d;
      } else if (h === "number")
        if (o >>> 0 === o)
          o < 32 || o < 128 && this.useRecords === !1 || o < 64 && !this.randomAccessStructure ? a[f++] = o : o < 256 ? (a[f++] = 204, a[f++] = o) : o < 65536 ? (a[f++] = 205, a[f++] = o >> 8, a[f++] = o & 255) : (a[f++] = 206, I.setUint32(f, o), f += 4);
        else if (o >> 0 === o)
          o >= -32 ? a[f++] = 256 + o : o >= -128 ? (a[f++] = 208, a[f++] = o + 256) : o >= -32768 ? (a[f++] = 209, I.setInt16(f, o), f += 2) : (a[f++] = 210, I.setInt32(f, o), f += 4);
        else {
          let u;
          if ((u = this.useFloat32) > 0 && o < 4294967296 && o >= -2147483648) {
            a[f++] = 202, I.setFloat32(f, o);
            let g;
            if (u < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (g = o * Re[(a[f] & 127) << 1 | a[f + 1] >> 7]) >> 0 === g) {
              f += 4;
              return;
            } else
              f--;
          }
          a[f++] = 203, I.setFloat64(f, o), f += 8;
        }
      else if (h === "object" || h === "function")
        if (!o)
          a[f++] = 192;
        else {
          if (l) {
            let g = l.get(o);
            if (g) {
              if (!g.id) {
                let S = l.idsToInsert || (l.idsToInsert = []);
                g.id = S.push(g);
              }
              a[f++] = 214, a[f++] = 112, I.setUint32(f, g.id), f += 4;
              return;
            } else
              l.set(o, { offset: f - r });
          }
          let u = o.constructor;
          if (u === Object)
            oe(o);
          else if (u === Array)
            we(o);
          else if (u === Map)
            if (this.mapAsEmptyObject) a[f++] = 128;
            else {
              d = o.size, d < 16 ? a[f++] = 128 | d : d < 65536 ? (a[f++] = 222, a[f++] = d >> 8, a[f++] = d & 255) : (a[f++] = 223, I.setUint32(f, d), f += 4);
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
                  let ne = m.write.call(this, o);
                  ne === o ? Array.isArray(o) ? we(o) : oe(o) : R(ne);
                  return;
                }
                let k = a, T = I, F = f;
                a = null;
                let Y;
                try {
                  Y = m.pack.call(this, o, (ne) => (a = k, k = null, f += ne, f > V && Q(f), {
                    target: a,
                    targetView: I,
                    position: f - ne
                  }), R);
                } finally {
                  k && (a = k, I = T, f = F, V = a.length - 10);
                }
                Y && (Y.length + f > V && Q(Y.length + f), f = nr(Y, a, f, m.type));
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
              if (h === "function")
                return R(this.writeFunction && this.writeFunction(o));
              oe(o);
            }
          }
        }
      else if (h === "boolean")
        a[f++] = o ? 195 : 194;
      else if (h === "bigint") {
        if (o < BigInt(1) << BigInt(63) && o >= -(BigInt(1) << BigInt(63)))
          a[f++] = 211, I.setBigInt64(f, o);
        else if (o < BigInt(1) << BigInt(64) && o > 0)
          a[f++] = 207, I.setBigUint64(f, o);
        else if (this.largeBigIntToFloat)
          a[f++] = 203, I.setFloat64(f, Number(o));
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
      } else if (h === "undefined")
        this.encodeUndefinedAsNil ? a[f++] = 192 : (a[f++] = 212, a[f++] = 0, a[f++] = 0);
      else
        throw new Error("Unknown type: " + h);
    }, Ne = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (o) => {
      let h;
      if (this.skipValues) {
        h = [];
        for (let g in o)
          (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(g)) && !this.skipValues.includes(o[g]) && h.push(g);
      } else
        h = Object.keys(o);
      let d = h.length;
      d < 16 ? a[f++] = 128 | d : d < 65536 ? (a[f++] = 222, a[f++] = d >> 8, a[f++] = d & 255) : (a[f++] = 223, I.setUint32(f, d), f += 4);
      let u;
      if (this.coercibleKeyAsNumber)
        for (let g = 0; g < d; g++) {
          u = h[g];
          let S = Number(u);
          R(isNaN(S) ? u : S), R(o[u]);
        }
      else
        for (let g = 0; g < d; g++)
          R(u = h[g]), R(o[u]);
    } : (o) => {
      a[f++] = 222;
      let h = f - r;
      f += 2;
      let d = 0;
      for (let u in o)
        (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(u)) && (R(u), R(o[u]), d++);
      if (d > 65535)
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      a[h++ + r] = d >> 8, a[h + r] = d & 255;
    }, Ve = this.useRecords === !1 ? Ne : t.progressiveRecords && !O ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (o) => {
        let h, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = f++ - r, g;
        for (let S in o)
          if (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(S)) {
            if (h = d[S], h)
              d = h;
            else {
              let U = Object.keys(o), m = d;
              d = s.transitions;
              let k = 0;
              for (let T = 0, F = U.length; T < F; T++) {
                let Y = U[T];
                h = d[Y], h || (h = d[Y] = /* @__PURE__ */ Object.create(null), k++), d = h;
              }
              u + r + 1 == f ? (f--, pe(d, U, k)) : $e(d, U, u, k), g = !0, d = m[S];
            }
            R(o[S]);
          }
        if (!g) {
          let S = d[W];
          S ? a[u + r] = S : $e(d, Object.keys(o), u, 0);
        }
      }
    ) : (o) => {
      let h, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = 0;
      for (let S in o) (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(S)) && (h = d[S], h || (h = d[S] = /* @__PURE__ */ Object.create(null), u++), d = h);
      let g = d[W];
      g ? g >= 96 && O ? (a[f++] = ((g -= 96) & 31) + 96, a[f++] = g >> 5) : a[f++] = g : pe(d, d.__keys__ || Object.keys(o), u);
      for (let S in o)
        (typeof o.hasOwnProperty != "function" || o.hasOwnProperty(S)) && R(o[S]);
    }, Ce = typeof this.useRecords == "function" && this.useRecords, oe = Ce ? (o) => {
      Ce(o) ? Ve(o) : Ne(o);
    } : Ve, Q = (o) => {
      let h;
      if (o > 16777216) {
        if (o - r > Ge)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        h = Math.min(
          Ge,
          Math.round(Math.max((o - r) * (o > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        h = (Math.max(o - r << 2, a.length - 1) >> 12) + 1 << 12;
      let d = new ce(h);
      return I = d.dataView || (d.dataView = new DataView(d.buffer, 0, h)), o = Math.min(o, a.length), a.copy ? a.copy(d, 0, r, o) : d.set(a.slice(r, o)), f -= r, r = 0, V = d.length - 10, a = d;
    }, pe = (o, h, d) => {
      let u = s.nextId;
      u || (u = 64), u < _ && this.shouldShareStructure && !this.shouldShareStructure(h) ? (u = s.nextOwnId, u < C || (u = _), s.nextOwnId = u + 1) : (u >= C && (u = _), s.nextId = u + 1);
      let g = h.highByte = u >= 96 && O ? u - 96 >> 5 : -1;
      o[W] = u, o.__keys__ = h, s[u - 64] = h, u < _ ? (h.isShared = !0, s.sharedLength = u - 63, n = !0, g >= 0 ? (a[f++] = (u & 31) + 96, a[f++] = g) : a[f++] = u) : (g >= 0 ? (a[f++] = 213, a[f++] = 114, a[f++] = (u & 31) + 96, a[f++] = g) : (a[f++] = 212, a[f++] = 114, a[f++] = u), d && (re += X * d), D.length >= b && (D.shift()[W] = 0), D.push(o), R(h));
    }, $e = (o, h, d, u) => {
      let g = a, S = f, U = V, m = r;
      a = se, f = 0, r = 0, a || (se = a = new ce(8192)), V = a.length - 10, pe(o, h, u), se = a;
      let k = f;
      if (a = g, f = S, V = U, r = m, k > 1) {
        let T = f + k - 1;
        T > V && Q(T);
        let F = d + r;
        a.copyWithin(F + k, F + 1, f), a.set(se.slice(0, k), F), f = T;
      } else
        a[d + r] = se[0];
    }, Et = (o) => {
      let h = er(o, a, r, f, s, Q, (d, u, g) => {
        if (g)
          return n = !0;
        f = u;
        let S = a;
        return R(d), qe(), S !== a ? { position: f, targetView: I, target: a } : f;
      }, this);
      if (h === 0)
        return oe(o);
      f = h;
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
      let { target: s, targetView: l, position: c } = t(6);
      s[c++] = 214, s[c++] = 255, l.setUint32(c, n);
    } else if (n > 0 && n < 4294967296) {
      let { target: s, targetView: l, position: c } = t(10);
      s[c++] = 215, s[c++] = 255, l.setUint32(c, e.getMilliseconds() * 4e6 + (n / 1e3 / 4294967296 >> 0)), l.setUint32(c + 4, n);
    } else if (isNaN(n)) {
      if (this.onInvalidDate)
        return t(0), r(this.onInvalidDate());
      let { target: s, targetView: l, position: c } = t(3);
      s[c++] = 212, s[c++] = 255, s[c++] = 255;
    } else {
      let { target: s, targetView: l, position: c } = t(15);
      s[c++] = 199, s[c++] = 12, s[c++] = 255, l.setUint32(c, e.getMilliseconds() * 1e6), l.setBigInt64(c + 4, BigInt(Math.floor(n)));
    }
  }
}, {
  pack(e, t, r) {
    if (this.setAsEmptyObject)
      return t(0), r({});
    let n = Array.from(e), { target: s, position: l } = t(this.moreTypes ? 3 : 0);
    this.moreTypes && (s[l++] = 212, s[l++] = 115, s[l++] = 0), r(n);
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
    r !== ht && this.moreTypes ? Ke(e, dt.indexOf(r.name), t) : Ze(e, t);
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
    var { target: l, position: c } = r(4 + s);
    l[c++] = 199, l[c++] = s + 1;
  } else if (s + 1 < 65536) {
    var { target: l, position: c } = r(5 + s);
    l[c++] = 200, l[c++] = s + 1 >> 8, l[c++] = s + 1 & 255;
  } else {
    var { target: l, position: c, targetView: y } = r(7 + s);
    l[c++] = 201, y.setUint32(c, s + 1), c += 4;
  }
  l[c++] = 116, l[c++] = t, e.buffer || (e = new Uint8Array(e)), l.set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), c);
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
    var { target: n, position: s, targetView: l } = t(r + 5);
    n[s++] = 198, l.setUint32(s, r), s += 4;
  }
  n.set(e, s);
}
function nr(e, t, r, n) {
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
function sr(e, t) {
  let r, n = t.length * 6, s = e.length - n;
  for (; r = t.pop(); ) {
    let l = r.offset, c = r.id;
    e.copyWithin(l + n, l, s), n -= 6;
    let y = l + n;
    e[y++] = 214, e[y++] = 105, e[y++] = c >> 24, e[y++] = c >> 16 & 255, e[y++] = c >> 8 & 255, e[y++] = c & 255, s = l;
  }
  return e;
}
function Xe(e, t, r) {
  if (L.length > 0) {
    I.setUint32(L.position + e, f + r - L.position - e), L.stringsPosition = f - e;
    let n = L;
    L = null, t(n[0]), t(n[1]);
  }
}
function ir(e, t) {
  return e.isCompatible = (r) => {
    let n = !r || (t.lastNamedStructuresLength || 0) === r.length;
    return n || t._mergeStructures(r), n;
  }, e;
}
let yt = new _e({ useRecords: !1 });
yt.pack;
yt.pack;
const fr = 512, ar = 1024, or = 2048, lr = (e) => new _e({ structuredClone: !0 }).unpack(new Uint8Array(e));
function cr(e) {
  return Ie(e) ? dr(e) : ur(e);
}
async function ur(e) {
  const t = await te(e);
  return Te(t);
}
function dr(e) {
  const t = Oe(e);
  return Te(t);
}
const wt = (e, t = "application/octet-stream") => e instanceof Blob ? e : e instanceof ArrayBuffer ? new Blob([e], { type: t }) : typeof e == "string" ? new Blob([e], { type: t }) : ArrayBuffer.isView(e) ? new Blob([e], { type: t }) : Array.isArray(e) ? new Blob([ke(e)], { type: t }) : new Blob([]), xr = async (e) => {
  const t = wt(e), r = new FileReader();
  return new Promise((n, s) => {
    const l = (c) => typeof c == "string" ? n(c) : (console.log({ bytes: e }), s("Unable to convert to data URL"));
    r.onload = function(c) {
      l(c.target?.result);
    }, r.readAsDataURL(t);
  });
}, gr = (e) => {
  const t = new _e({ structuredClone: !0 });
  return new Uint8Array(t.encode(e));
}, hr = (e) => {
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
}, yr = (e) => new TextEncoder().encode(e), v = {
  toMsgPack: gr,
  msgPackToObject: lr,
  typeOfBytes: hr,
  toDataUrl: xr,
  dataUrlToBlob: jt,
  lengthOf: Jt,
  isByteLike: zt,
  isImmediateByteLike: Ie,
  hashOf: ge,
  immediateHashOf: Ft,
  addressStringOf: de,
  toArrayBuffer: te,
  immediateToArrayBuffer: Oe,
  toBlob: wt,
  toText: st,
  toBase64: cr,
  encodeAsString: nt,
  test: qt,
  assignMediaTypeToBlob: Ct,
  utf8ToUint8Array: yr,
  base64ToArrayBuffer: $t,
  arrayBufferToHex: Nt,
  arrayBufferToUtf8: Vt,
  arrayBufferToBase64: Te,
  ALL_ALGORITHMS: Ee,
  ALGORITHM_BYTE_LENGTHS: tt
}, wr = (e) => typeof e == "function", pt = (e) => e == null || Number.isNaN(e), St = (e) => !pt(e), pr = (e) => wr(e) ? e() : e, Sr = (e, t = {}) => {
  const { quiet: r = !1, def: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (l) {
    return r || (console.error(l), St(s) && console.log(pr(s))), n;
  }
}, br = {
  isDefined: St,
  isUndefined: pt,
  safe: Sr
}, { isDefined: Pe, isUndefined: mr, safe: bt } = br, De = (e) => {
  const { message: t, stack: r, extra: n, cause: s } = e, l = s ? `
Caused by: ${De(s)}` : "", c = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(Pe).join(`
`) + c + l;
}, mt = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? De(e) : bt(() => JSON.stringify(e, void 0, 2)) ?? "", Ar = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? De(e) : bt(() => JSON.stringify(e, void 0, 2)) ?? "";
}, At = ({ error: e, extra: t, stack: r }) => {
  if (e instanceof Error) {
    const n = Pe(e.cause) ? At({ error: e.cause }) : void 0;
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
}, Br = {
  errorToErrorDetail: At,
  errorToText: mt,
  errorToTextAsync: Ar
}, We = async ({
  channel: e,
  subject: t,
  connectionListener: r,
  options: n = {}
}) => {
  const { log: s = () => {
  }, signal: l } = n;
  s("connectConnectionListenerToSubject: subject: ", t);
  for await (const c of e.listenOn(t, {
    callback: async (y) => {
      const w = v.msgPackToObject(y), { data: A, meta: p } = w;
      if (Ot(w))
        throw console.error("Error in message: ", w), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${w?.data?.message}`
        );
      try {
        const b = await r(A, {
          headers: p?.headers,
          signal: l
        });
        return v.toMsgPack({
          data: b
        });
      } catch (b) {
        const O = Br.errorToErrorDetail({ error: b });
        return v.toMsgPack({
          data: O,
          meta: {
            hasError: !0,
            code: 500,
            status: O.message
          }
        });
      }
    }
  }))
    ;
}, Er = (e) => (t) => {
  if (e.length === 0)
    return !1;
  const r = e.map((n) => new RegExp(n));
  for (const n of r)
    if (n.test(t))
      return !0;
  return !1;
}, Ur = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance
} = {}) => {
  const n = {
    start: (s, ...l) => {
      n.addLog({ traceId: s, message: "start", extra: l });
    },
    addLog: ({ traceId: s, message: l, timestamp: c = r.now(), extra: y = [] }) => {
      Er(e)(s) && t(`${c} ${s}: ${l}`, ...y);
    },
    end: (s, ...l) => {
      n.addLog({ traceId: s, message: "end", extra: l });
    }
  };
  return n;
}, Bt = (e = "", t = Ur()) => {
  t.start(e);
  const r = {
    span: (n) => Bt(`${e}.${n}`, t),
    end: () => (t.end(e), r),
    log: (n, ...s) => (t.addLog({ traceId: e, message: n, extra: s }), r)
  };
  return r;
}, Ir = async ({
  channel: e,
  subscribers: t = {},
  options: r = {},
  obs: n = Bt()
}) => {
  let s = n.span("MessageBus");
  console.log("MessageBus span", s);
  const { defaultTimeoutMs: l = 60 * 1e3, signal: c } = r, y = Object.entries(t);
  s.log("connect: subscribers: ", y);
  for (const [w, A] of y)
    mr(A) || We({
      channel: e,
      subject: w,
      connectionListener: A,
      options: r
    });
  return {
    requestMany: async (w, A, p = {}) => {
      s = s.span("requestMany");
      const { timeoutMs: b = 60 * 1e3, headers: O, callback: _ } = p, C = v.toMsgPack({
        data: A,
        meta: { headers: O }
      });
      s = s.span("channel requestMany").log("start requestMany", w);
      const D = await e.requestMany(
        w,
        C,
        {
          timeoutMs: b
        }
      );
      for await (const re of D) {
        if (c?.aborted)
          return;
        const X = v.msgPackToObject(re);
        await _?.(X);
      }
      s.end();
    },
    request: async (w, A, p = {}) => {
      s = s.span("request").log("subject", w);
      const { timeoutMs: b = l, headers: O } = p, _ = v.toMsgPack({
        data: A,
        meta: { headers: O }
      }), C = s.span("channel request").log("requestData", _), D = await e.request(w, _, {
        timeoutMs: b
      });
      return C.end(), s.end(), v.msgPackToObject(D);
    },
    publish: async (w, A, p = {}) => {
      const { headers: b } = p, O = v.toMsgPack({
        data: A,
        meta: { headers: b }
      });
      return s.span("publish").log("subject", w), e.postOn(w, O);
    },
    subscribe: async (w, A, p = {}) => (s.span("subscribe").log("subject", w), We({
      channel: e,
      subject: w,
      connectionListener: A,
      options: p
    }))
  };
}, kr = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const r = {
    postOn: (n, s, l = {}) => {
      const { signal: c, reply: y } = l;
      e(c)(n)({ subject: n, data: s, reply: y });
    },
    listenOn: function(n, s = {}) {
      const { signal: l, once: c, callback: y } = s, w = new AbortController();
      if (l?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      l?.addEventListener("abort", () => {
        w.abort();
      });
      const A = t(w.signal)(n)(
        async (p) => {
          if (p.subject === n) {
            c && w.abort();
            const b = await y?.(p.data, {
              finished: p.finished ?? !1
            });
            if (p.reply && b && (et(b) ? (async () => {
              for await (const O of b)
                e(w.signal)(p.reply)({
                  subject: p.reply,
                  data: O
                });
              e(w.signal)(p.reply)({
                subject: p.reply,
                data: void 0,
                finished: !0
              });
            })() : e(w.signal)(p.reply)({
              subject: p.reply,
              data: b,
              finished: !0
            })), b && !et(b))
              return { ...p, data: b };
          }
          return p;
        }
      );
      return async function* () {
        for await (const p of A)
          yield p.data;
      }();
    },
    request: async (n, s, l = {}) => {
      const { signal: c, timeoutMs: y } = l, w = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((A, p) => {
        c?.aborted && p(
          new Error(`request: Signal is already aborted for ${n}`)
        ), c?.addEventListener("abort", () => {
          p(new Error("Request aborted"));
        });
        let b;
        y && (b = setTimeout(() => {
          p(
            new Error(
              `request: Request timed out after ${y}ms for ${n}`
            )
          );
        }, y)), r.listenOn(w, {
          callback: (O) => {
            clearTimeout(b), A(O);
          },
          signal: c,
          once: !0
        }), r.postOn(n, s, { reply: w, signal: c });
      });
    },
    requestMany: async (n, s, l = {}) => {
      const { signal: c, timeoutMs: y, callback: w } = l, A = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((p, b) => {
        c?.aborted && b(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), c?.addEventListener("abort", () => {
          b(new Error("Request aborted"));
        });
        let O;
        y && (O = setTimeout(() => {
          b(
            new Error(
              `requestMany: Request timed out after ${y}ms for ${n}`
            )
          );
        }, y));
        const _ = r.listenOn(A, {
          callback: (C, D) => {
            if (C !== void 0 && w?.(C), D.finished)
              return clearTimeout(O), p(_);
          },
          signal: c
        });
        return r.postOn(n, s, { reply: A, signal: c }), _;
      });
    }
  };
  return r;
};
function et(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const Mr = (e) => kr({
  posterProducer: (t) => (r) => (n) => {
    t?.aborted || e.emit(r, n);
  },
  listenerProducer: (t) => (r) => (n) => {
    const s = [], l = {
      resolve: void 0
    }, c = async (y) => {
      if (t?.aborted)
        return;
      const w = await n?.(y), A = Pe(w) ? w : y;
      s.push(A), l.resolve?.();
    };
    return t?.addEventListener("abort", () => {
      e.off(r, c);
    }), e.on(r, c), {
      [Symbol.asyncIterator]: async function* () {
        for (; !t?.aborted; )
          s.length > 0 ? yield s.shift() : await new Promise((y) => {
            l.resolve = y;
          });
      }
    };
  }
});
export {
  kr as Channel,
  Mr as EmitterChannel,
  Ir as MessageBus,
  kt as isError,
  Ot as isErrorMsg,
  Tt as isMsg,
  Ut as isValue,
  Or as isValueOrError,
  Tr as parseSubject
};

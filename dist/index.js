const Ir = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, Ut = (e) => "value" in e && e.value !== void 0, kt = (e) => "error" in e && e.error !== void 0, Or = (e) => Ut(e) || kt(e), Tt = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, It = (e) => {
  const t = e;
  return Tt(e) && t.meta?.hasError || !1;
}, tt = {
  "SHA-256": 32,
  "SHA-512": 64
}, Ue = ["SHA-256", "SHA-512"];
function ke(e) {
  if (typeof e == "string")
    return e;
  const t = e();
  return typeof t == "string" ? t : (console.error("ASSERTION FAIL VALUE", t), "Assertion Failed");
}
function he(e, t = "Assertion failed") {
  if (!e)
    throw new Error(ke(t));
}
const rt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => {
  throw new Error("assertEqualElements: Bitrotted");
}, Ot = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is not equal to ${JSON.stringify(t)}`)) => Array.isArray(e) && Array.isArray(t) ? rt(e, t, r) : he(e === t, r), Mt = (e, t, r = () => (console.error(e, t), `Assertion failed: ${JSON.stringify(e)} is equal to ${JSON.stringify(t)}`)) => he(e !== t, r);
function Rt(e, t, r = "Assertion failed: Required value is not of correct type") {
  if (!t(e))
    throw new Error(ke(r));
  return e;
}
function Lt(e, t = "Assertion failed: Reached what should be an unreachable section of code") {
  throw new Error(ke(t));
}
function _t(e) {
  return e != null && !Number.isNaN(e);
}
function Pt(e, t = "Assertion failed: Required value not defined") {
  return he(_t(e), t), e;
}
const te = {
  assert: he,
  assertUnreachable: Lt,
  assertValue: Pt,
  assertEqual: Ot,
  assertNotEqual: Mt,
  assertEqualElements: rt,
  assertType: Rt
}, Te = (e) => {
  const t = e.flatMap((r) => typeof r == "number" ? [r] : JSON.stringify(r).split("").map((n) => n.codePointAt(0)));
  return new Float64Array(t.length).map((r, n) => t[n]);
}, re = async (e) => e instanceof ArrayBuffer ? e : e instanceof Blob ? e.arrayBuffer() : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? Te(e) : new ArrayBuffer(0), ye = async ({ bytes: e, algorithm: t = "SHA-512" }) => {
  const r = await re(e);
  return crypto.subtle.digest(t, r);
}, nt = async (e, t = 16) => {
  const r = await re(e);
  return [...new Uint8Array(r)].map((n) => n.toString(t).padStart(2, "0")).join("");
}, ge = async ({ bytes: e, algorithm: t = "SHA-512", radix: r = 16 }) => {
  const n = await ye({ bytes: e, algorithm: t }), s = await nt(n, r);
  return `${t}:${s}`;
}, Dt = ({ id: e }) => {
  const t = e.split(":");
  te.assert(t.length === 2);
  const [r, n] = t, s = atob(n), o = new Uint8Array(s.length);
  return s.split("").map((l) => l.charCodeAt(0)).forEach((l, y) => {
    o[y] = l;
  }), o;
}, st = async (e) => {
  if (typeof e == "string")
    return e;
  const t = await re(e);
  return new TextDecoder().decode(t);
}, fe = [];
fe.push(async () => {
  const e = "test", t = await re(e), r = await st(t);
  return te.assertEqual(e, r);
});
fe.push(async () => Ue.map(async (e) => {
  const t = await ye({ bytes: "test", algorithm: e });
  return te.assertEqual(t.byteLength, tt[e]);
}));
fe.push(async () => {
  {
    const e = await ge({
      bytes: "test",
      algorithm: "SHA-256"
    });
    te.assertEqual(e, "SHA-256:n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=");
  }
  {
    const e = await ge({
      bytes: "test",
      algorithm: "SHA-512"
    });
    te.assertEqual(e, "SHA-512:7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==");
  }
});
fe.push(async () => Ue.map(async (e) => {
  const t = "test", r = await ge({ bytes: t, algorithm: e }), n = new Uint8Array(await ye({ bytes: t, algorithm: e })), s = Dt({ id: r });
  return te.assertEqualElements(s, n);
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
function Ie(e) {
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
  let o = s.length;
  const l = new Uint8Array(o);
  for (; o--; )
    l[o] = s.charCodeAt(o);
  return new Blob([l], { type: n });
}, Oe = (e) => e instanceof ArrayBuffer ? e : typeof e == "string" ? new TextEncoder().encode(e) : ArrayBuffer.isView(e) ? e.buffer : Array.isArray(e) ? Te(e) : new ArrayBuffer(0), Ft = async (e, t) => {
  const r = Oe(e);
  return crypto.subtle.digest(t, r);
}, Me = (e) => {
  const t = e;
  return !!(t instanceof ArrayBuffer || typeof t == "string" || ArrayBuffer.isView(t) || Array.isArray(t));
}, zt = (e) => e instanceof Blob ? !0 : Me(e), Jt = (e) => {
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
const at = new it();
at.name = "MessagePack 0xC1";
var K = !1, ft = 2, Ht;
try {
  new Function("");
} catch {
  ft = 1 / 0;
}
class ae {
  constructor(t) {
    t && (t.useRecords === !1 && t.mapsAsObjects === void 0 && (t.mapsAsObjects = !0), t.sequential && t.trusted !== !1 && (t.trusted = !0, !t.structures && t.useRecords != !1 && (t.structures = [], t.maxSharedStructures || (t.maxSharedStructures = 0))), t.structures ? t.structures.sharedLength = t.structures.length : t.getStructures && ((t.structures = []).uninitialized = !0, t.structures.sharedLength = 0), t.int64AsNumber && (t.int64AsType = "number")), Object.assign(this, t);
  }
  unpack(t, r) {
    if (x)
      return xt(() => (Be(), this ? this.unpack(t, r) : ae.prototype.unpack.call(je, t, r)));
    !t.buffer && t.constructor === ArrayBuffer && (t = typeof Buffer < "u" ? Buffer.from(t) : new Uint8Array(t)), typeof r == "object" ? (J = r.end || t.length, i = r.start || 0) : (i = 0, J = r > -1 ? r : t.length), z = 0, G = null, N = null, x = t;
    try {
      B = t.dataView || (t.dataView = new DataView(t.buffer, t.byteOffset, t.byteLength));
    } catch (n) {
      throw x = null, t instanceof Uint8Array ? n : new Error("Source must be a Uint8Array or Buffer but was a " + (t && typeof t == "object" ? t.constructor.name : typeof t));
    }
    if (this instanceof ae) {
      if (M = this, this.structures)
        return E = this.structures, ue(r);
      (!E || E.length > 0) && (E = []);
    } else
      M = je, (!E || E.length > 0) && (E = []);
    return ue(r);
  }
  unpackMultiple(t, r) {
    let n, s = 0;
    try {
      K = !0;
      let o = t.length, l = this ? this.unpack(t, o) : we.unpack(t, o);
      if (r) {
        if (r(l, s, i) === !1) return;
        for (; i < o; )
          if (s = i, r(ue(), s, i) === !1)
            return;
      } else {
        for (n = [l]; i < o; )
          s = i, n.push(ue());
        return n;
      }
    } catch (o) {
      throw o.lastPosition = s, o.values = n, o;
    } finally {
      K = !1, Be();
    }
  }
  _mergeStructures(t, r) {
    t = t || [], Object.isFrozen(t) && (t = t.map((n) => n.slice(0)));
    for (let n = 0, s = t.length; n < s; n++) {
      let o = t[n];
      o && (o.isShared = !0, n >= 32 && (o.highByte = n - 32 >> 5));
    }
    t.sharedLength = t.length;
    for (let n in r || [])
      if (n >= 0) {
        let s = t[n], o = r[n];
        o && (s && ((t.restoreStructures || (t.restoreStructures = []))[n] = s), t[n] = o);
      }
    return this.structures = t;
  }
  decode(t, r) {
    return this.unpack(t, r);
  }
}
function ue(e) {
  try {
    if (!M.trusted && !K) {
      let r = E.sharedLength || 0;
      r < E.length && (E.length = r);
    }
    let t;
    if (M.randomAccessStructure && x[i] < 64 && x[i] >= 32 && Ht || (t = _()), N && (i = N.postBundlePosition, N = null), K && (E.restoreStructures = null), i == J)
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
    throw E && E.restoreStructures && Fe(), Be(), (t instanceof RangeError || t.message.startsWith("Unexpected end of buffer") || i > J) && (t.incomplete = !0), t;
  }
}
function Fe() {
  for (let e in E.restoreStructures)
    E[e] = E.restoreStructures[e];
  E.restoreStructures = null;
}
function _() {
  let e = x[i++];
  if (e < 160)
    if (e < 128) {
      if (e < 64)
        return e;
      {
        let t = E[e & 63] || M.getStructures && ot()[e & 63];
        return t ? (t.read || (t.read = Re(t, e & 63)), t.read()) : e;
      }
    } else if (e < 144)
      if (e -= 128, M.mapsAsObjects) {
        let t = {};
        for (let r = 0; r < e; r++) {
          let n = lt();
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
    if (z >= i)
      return G.slice(i - j, (i += t) - j);
    if (z == 0 && J < 140) {
      let r = t < 16 ? Le(t) : ct(t);
      if (r != null)
        return r;
    }
    return Ae(t);
  } else {
    let t;
    switch (e) {
      case 192:
        return null;
      case 193:
        return N ? (t = _(), t > 0 ? N[1].slice(N.position1, N.position1 += t) : N[0].slice(N.position0, N.position0 -= t)) : at;
      // "never-used", return special object to denote that
      case 194:
        return !1;
      case 195:
        return !0;
      case 196:
        if (t = x[i++], t === void 0)
          throw new Error("Unexpected end of buffer");
        return me(t);
      case 197:
        return t = B.getUint16(i), i += 2, me(t);
      case 198:
        return t = B.getUint32(i), i += 4, me(t);
      case 199:
        return X(x[i++]);
      case 200:
        return t = B.getUint16(i), i += 2, X(t);
      case 201:
        return t = B.getUint32(i), i += 4, X(t);
      case 202:
        if (t = B.getFloat32(i), M.useFloat32 > 2) {
          let r = _e[(x[i] & 127) << 1 | x[i + 1] >> 7];
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
            return r.read ? (i++, r.read(_())) : r.noBuffer ? (i++, r()) : r(x.subarray(i, ++i));
          throw new Error("Unknown extension " + t);
        }
      case 213:
        return t = x[i], t == 114 ? (i++, ve(x[i++] & 63, x[i++])) : X(2);
      case 214:
        return X(4);
      case 215:
        return X(8);
      case 216:
        return X(16);
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
function Re(e, t) {
  function r() {
    if (r.count++ > ft) {
      let s = e.read = new Function("r", "return function(){return " + (M.freezeData ? "Object.freeze" : "") + "({" + e.map((o) => o === "__proto__" ? "__proto_:r()" : Qt.test(o) ? o + ":r()" : "[" + JSON.stringify(o) + "]:r()").join(",") + "})}")(_);
      return e.highByte === 0 && (e.read = ze(t, e.read)), s();
    }
    let n = {};
    for (let s = 0, o = e.length; s < o; s++) {
      let l = e[s];
      l === "__proto__" && (l = "__proto_"), n[l] = _();
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
  return s.read || (s.read = Re(s, e)), s.read();
};
function ot() {
  let e = xt(() => (x = null, M.getStructures()));
  return E = M._mergeStructures(e, E);
}
var Ae = oe, Yt = oe, vt = oe, Gt = oe;
function oe(e) {
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
      const o = x[i++] & 63;
      n.push((s & 31) << 6 | o);
    } else if ((s & 240) === 224) {
      const o = x[i++] & 63, l = x[i++] & 63;
      n.push((s & 31) << 12 | o << 6 | l);
    } else if ((s & 248) === 240) {
      const o = x[i++] & 63, l = x[i++] & 63, y = x[i++] & 63;
      let w = (s & 7) << 18 | o << 12 | l << 6 | y;
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
    t[r] = _();
  return M.freezeData ? Object.freeze(t) : t;
}
function He(e) {
  if (M.mapsAsObjects) {
    let t = {};
    for (let r = 0; r < e; r++) {
      let n = lt();
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
        let o = x[i++];
        if ((o & 128) > 0) {
          i -= 5;
          return;
        }
        return q(t, r, n, s, o);
      }
    } else if (e < 8) {
      let o = x[i++], l = x[i++];
      if ((o & 128) > 0 || (l & 128) > 0) {
        i -= 6;
        return;
      }
      if (e < 7)
        return q(t, r, n, s, o, l);
      let y = x[i++];
      if ((y & 128) > 0) {
        i -= 7;
        return;
      }
      return q(t, r, n, s, o, l, y);
    } else {
      let o = x[i++], l = x[i++], y = x[i++], w = x[i++];
      if ((o & 128) > 0 || (l & 128) > 0 || (y & 128) > 0 || (w & 128) > 0) {
        i -= 8;
        return;
      }
      if (e < 10) {
        if (e === 8)
          return q(t, r, n, s, o, l, y, w);
        {
          let A = x[i++];
          if ((A & 128) > 0) {
            i -= 9;
            return;
          }
          return q(t, r, n, s, o, l, y, w, A);
        }
      } else if (e < 12) {
        let A = x[i++], p = x[i++];
        if ((A & 128) > 0 || (p & 128) > 0) {
          i -= 10;
          return;
        }
        if (e < 11)
          return q(t, r, n, s, o, l, y, w, A, p);
        let m = x[i++];
        if ((m & 128) > 0) {
          i -= 11;
          return;
        }
        return q(t, r, n, s, o, l, y, w, A, p, m);
      } else {
        let A = x[i++], p = x[i++], m = x[i++], I = x[i++];
        if ((A & 128) > 0 || (p & 128) > 0 || (m & 128) > 0 || (I & 128) > 0) {
          i -= 12;
          return;
        }
        if (e < 14) {
          if (e === 12)
            return q(t, r, n, s, o, l, y, w, A, p, m, I);
          {
            let P = x[i++];
            if ((P & 128) > 0) {
              i -= 13;
              return;
            }
            return q(t, r, n, s, o, l, y, w, A, p, m, I, P);
          }
        } else {
          let P = x[i++], V = x[i++];
          if ((P & 128) > 0 || (V & 128) > 0) {
            i -= 14;
            return;
          }
          if (e < 15)
            return q(t, r, n, s, o, l, y, w, A, p, m, I, P, V);
          let D = x[i++];
          if ((D & 128) > 0) {
            i -= 15;
            return;
          }
          return q(t, r, n, s, o, l, y, w, A, p, m, I, P, V, D);
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
  return oe(t);
}
function me(e) {
  return M.copyBuffers ? (
    // specifically use the copying slice (not the node one)
    Uint8Array.prototype.slice.call(x, i, i += e)
  ) : x.subarray(i, i += e);
}
function X(e) {
  let t = x[i++];
  if ($[t]) {
    let r;
    return $[t](x.subarray(i, r = i += e), (n) => {
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
var Ye = new Array(4096);
function lt() {
  let e = x[i++];
  if (e >= 160 && e < 192) {
    if (e = e - 160, z >= i)
      return G.slice(i - j, (i += e) - j);
    if (!(z == 0 && J < 180))
      return Ae(e);
  } else
    return i--, ut(_());
  let t = (e << 5 ^ (e > 1 ? B.getUint16(i) : e > 0 ? x[i] : 0)) & 4095, r = Ye[t], n = i, s = i + e - 3, o, l = 0;
  if (r && r.bytes == e) {
    for (; n < s; ) {
      if (o = B.getUint32(n), o != r[l++]) {
        n = 1879048192;
        break;
      }
      n += 4;
    }
    for (s += 3; n < s; )
      if (o = x[n++], o != r[l++]) {
        n = 1879048192;
        break;
      }
    if (n === s)
      return i = n, r.string;
    s -= 3, n = i;
  }
  for (r = [], Ye[t] = r, r.bytes = e; n < s; )
    o = B.getUint32(n), r.push(o), n += 4;
  for (s += 3; n < s; )
    o = x[n++], r.push(o);
  let y = e < 16 ? Le(e) : ct(e);
  return y != null ? r.string = y : r.string = Ae(e);
}
function ut(e) {
  if (typeof e == "string") return e;
  if (typeof e == "number" || typeof e == "boolean" || typeof e == "bigint") return e.toString();
  if (e == null) return e + "";
  throw new Error("Invalid property type for record", typeof e);
}
const ve = (e, t) => {
  let r = _().map(ut), n = e;
  t !== void 0 && (e = e < 32 ? -((t << 5) + e) : (t << 5) + e, r.highByte = t);
  let s = E[e];
  return s && (s.isShared || K) && ((E.restoreStructures || (E.restoreStructures = []))[e] = s), E[e] = r, r.read = Re(r, n), r.read();
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
  let e = _();
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
  let o = _();
  return s.used ? Object.assign(n, o) : (s.target = o, o);
};
$[112] = (e) => {
  if (M.structuredClone === !1) throw new Error("Structured clone extension is disabled");
  let t = B.getUint32(i - 4), r = H.get(t);
  return r.used = !0, r.target;
};
$[115] = () => new Set(_());
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
  let e = _();
  return new RegExp(e[0], e[1]);
};
const Xt = [];
$[98] = (e) => {
  let t = (e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3], r = i;
  return i += t - e.length, N = Xt, N = [Qe(), Qe()], N.position0 = 0, N.position1 = 0, N.postBundlePosition = i, i = r, _();
};
$[255] = (e) => e.length == 4 ? new Date((e[0] * 16777216 + (e[1] << 16) + (e[2] << 8) + e[3]) * 1e3) : e.length == 8 ? new Date(
  ((e[0] << 22) + (e[1] << 14) + (e[2] << 6) + (e[3] >> 2)) / 1e6 + ((e[3] & 3) * 4294967296 + e[4] * 16777216 + (e[5] << 16) + (e[6] << 8) + e[7]) * 1e3
) : e.length == 12 ? new Date(
  ((e[0] << 24) + (e[1] << 16) + (e[2] << 8) + e[3]) / 1e6 + ((e[4] & 128 ? -281474976710656 : 0) + e[6] * 1099511627776 + e[7] * 4294967296 + e[8] * 16777216 + (e[9] << 16) + (e[10] << 8) + e[11]) * 1e3
) : /* @__PURE__ */ new Date("invalid");
function xt(e) {
  let t = J, r = i, n = j, s = z, o = G, l = H, y = N, w = new Uint8Array(x.slice(0, J)), A = E, p = E.slice(0, E.length), m = M, I = K, P = e();
  return J = t, i = r, j = n, z = s, G = o, H = l, N = y, x = w, K = I, E = A, E.splice(0, E.length, ...p), M = m, B = new DataView(x.buffer, x.byteOffset, x.byteLength), P;
}
function Be() {
  x = null, H = null, E = null;
}
const _e = new Array(147);
for (let e = 0; e < 256; e++)
  _e[e] = +("1e" + Math.floor(45.15 - e * 0.30103));
var we = new ae({ useRecords: !1 });
we.unpack;
we.unpackMultiple;
we.unpack;
let Wt = new Float32Array(1);
new Uint8Array(Wt.buffer, 0, 4);
let xe;
try {
  xe = new TextEncoder();
} catch {
}
let Ee, gt;
const pe = typeof Buffer < "u", de = pe ? function(e) {
  return Buffer.allocUnsafeSlow(e);
} : Uint8Array, ht = pe ? Buffer : Uint8Array, Ge = pe ? 4294967296 : 2144337920;
let f, ie, O, a = 0, C, R = null, er;
const tr = 21760, rr = /[\u0080-\uFFFF]/, ee = Symbol("record-id");
class Pe extends ae {
  constructor(t) {
    super(t), this.offset = 0;
    let r, n, s, o, l = ht.prototype.utf8Write ? function(c, h) {
      return f.utf8Write(c, h, f.byteLength - h);
    } : xe && xe.encodeInto ? function(c, h) {
      return xe.encodeInto(c, f.subarray(h)).written;
    } : !1, y = this;
    t || (t = {});
    let w = t && t.sequential, A = t.structures || t.saveStructures, p = t.maxSharedStructures;
    if (p == null && (p = A ? 32 : 0), p > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    t.structuredClone && t.moreTypes == null && (this.moreTypes = !0);
    let m = t.maxOwnStructures;
    m == null && (m = A ? 32 : 64), !this.structures && t.useRecords != !1 && (this.structures = []);
    let I = p > 32 || m + p > 64, P = p + 64, V = p + m + 64;
    if (V > 8256)
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    let D = [], Z = 0, W = 0;
    this.pack = this.encode = function(c, h) {
      if (f || (f = new de(8192), O = f.dataView || (f.dataView = new DataView(f.buffer, 0, 8192)), a = 0), C = f.length - 10, C - a < 2048 ? (f = new de(f.length), O = f.dataView || (f.dataView = new DataView(f.buffer, 0, f.length)), C = f.length - 10, a = 0) : a = a + 7 & 2147483640, r = a, h & or && (a += h & 255), o = y.structuredClone ? /* @__PURE__ */ new Map() : null, y.bundleStrings && typeof c != "string" ? (R = [], R.size = 1 / 0) : R = null, s = y.structures, s) {
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
            let U, b = s.transitions;
            for (let k = 0, T = S.length; k < T; k++) {
              let F = S[k];
              U = b[F], U || (U = b[F] = /* @__PURE__ */ Object.create(null)), b = U;
            }
            b[ee] = g + 64;
          }
          this.lastNamedStructuresLength = u;
        }
        w || (s.nextId = u + 64);
      }
      n && (n = !1);
      let d;
      try {
        y.randomAccessStructure && c && c.constructor && c.constructor === Object ? Et(c) : L(c);
        let u = R;
        if (R && Xe(r, L, 0), o && o.idsToInsert) {
          let g = o.idsToInsert.sort((k, T) => k.offset > T.offset ? 1 : -1), S = g.length, U = -1;
          for (; u && S > 0; ) {
            let k = g[--S].offset + r;
            k < u.stringsPosition + r && U === -1 && (U = 0), k > u.position + r ? U >= 0 && (U += 6) : (U >= 0 && (O.setUint32(
              u.position + r,
              O.getUint32(u.position + r) + U
            ), U = -1), u = u.previous, S++);
          }
          U >= 0 && u && O.setUint32(
            u.position + r,
            O.getUint32(u.position + r) + U
          ), a += g.length * 6, a > C && Q(a), y.offset = a;
          let b = sr(f.subarray(r, a), g);
          return o = null, b;
        }
        return y.offset = a, h & ar ? (f.start = r, f.end = a, f) : f.subarray(r, a);
      } catch (u) {
        throw d = u, u;
      } finally {
        if (s && (ce(), n && y.saveStructures)) {
          let u = s.sharedLength || 0, g = f.subarray(r, a), S = ir(s, y);
          if (!d)
            return y.saveStructures(S, S.isCompatible) === !1 ? y.pack(c, h) : (y.lastNamedStructuresLength = u, f.length > 1073741824 && (f = null), g);
        }
        f.length > 1073741824 && (f = null), h & fr && (a = r);
      }
    };
    const ce = () => {
      W < 10 && W++;
      let c = s.sharedLength || 0;
      if (s.length > c && !w && (s.length = c), Z > 1e4)
        s.transitions = null, W = 0, Z = 0, D.length > 0 && (D = []);
      else if (D.length > 0 && !w) {
        for (let h = 0, d = D.length; h < d; h++)
          D[h][ee] = 0;
        D = [];
      }
    }, ne = (c) => {
      var h = c.length;
      h < 16 ? f[a++] = 144 | h : h < 65536 ? (f[a++] = 220, f[a++] = h >> 8, f[a++] = h & 255) : (f[a++] = 221, O.setUint32(a, h), a += 4);
      for (let d = 0; d < h; d++)
        L(c[d]);
    }, L = (c) => {
      a > C && (f = Q(a));
      var h = typeof c, d;
      if (h === "string") {
        let u = c.length;
        if (R && u >= 4 && u < 4096) {
          if ((R.size += u) > tr) {
            let b, k = (R[0] ? R[0].length * 3 + R[1].length : 0) + 10;
            a + k > C && (f = Q(a + k));
            let T;
            R.position ? (T = R, f[a] = 200, a += 3, f[a++] = 98, b = a - r, a += 4, Xe(r, L, 0), O.setUint16(b + r - 3, a - r - b)) : (f[a++] = 214, f[a++] = 98, b = a - r, a += 4), R = ["", ""], R.previous = T, R.size = 0, R.position = b;
          }
          let U = rr.test(c);
          R[U ? 0 : 1] += c, f[a++] = 193, L(U ? -u : u);
          return;
        }
        let g;
        u < 32 ? g = 1 : u < 256 ? g = 2 : u < 65536 ? g = 3 : g = 5;
        let S = u * 3;
        if (a + S > C && (f = Q(a + S)), u < 64 || !l) {
          let U, b, k, T = a + g;
          for (U = 0; U < u; U++)
            b = c.charCodeAt(U), b < 128 ? f[T++] = b : b < 2048 ? (f[T++] = b >> 6 | 192, f[T++] = b & 63 | 128) : (b & 64512) === 55296 && ((k = c.charCodeAt(U + 1)) & 64512) === 56320 ? (b = 65536 + ((b & 1023) << 10) + (k & 1023), U++, f[T++] = b >> 18 | 240, f[T++] = b >> 12 & 63 | 128, f[T++] = b >> 6 & 63 | 128, f[T++] = b & 63 | 128) : (f[T++] = b >> 12 | 224, f[T++] = b >> 6 & 63 | 128, f[T++] = b & 63 | 128);
          d = T - a - g;
        } else
          d = l(c, a + g);
        d < 32 ? f[a++] = 160 | d : d < 256 ? (g < 2 && f.copyWithin(a + 2, a + 1, a + 1 + d), f[a++] = 217, f[a++] = d) : d < 65536 ? (g < 3 && f.copyWithin(a + 3, a + 2, a + 2 + d), f[a++] = 218, f[a++] = d >> 8, f[a++] = d & 255) : (g < 5 && f.copyWithin(a + 5, a + 3, a + 3 + d), f[a++] = 219, O.setUint32(a, d), a += 4), a += d;
      } else if (h === "number")
        if (c >>> 0 === c)
          c < 32 || c < 128 && this.useRecords === !1 || c < 64 && !this.randomAccessStructure ? f[a++] = c : c < 256 ? (f[a++] = 204, f[a++] = c) : c < 65536 ? (f[a++] = 205, f[a++] = c >> 8, f[a++] = c & 255) : (f[a++] = 206, O.setUint32(a, c), a += 4);
        else if (c >> 0 === c)
          c >= -32 ? f[a++] = 256 + c : c >= -128 ? (f[a++] = 208, f[a++] = c + 256) : c >= -32768 ? (f[a++] = 209, O.setInt16(a, c), a += 2) : (f[a++] = 210, O.setInt32(a, c), a += 4);
        else {
          let u;
          if ((u = this.useFloat32) > 0 && c < 4294967296 && c >= -2147483648) {
            f[a++] = 202, O.setFloat32(a, c);
            let g;
            if (u < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
            (g = c * _e[(f[a] & 127) << 1 | f[a + 1] >> 7]) >> 0 === g) {
              a += 4;
              return;
            } else
              a--;
          }
          f[a++] = 203, O.setFloat64(a, c), a += 8;
        }
      else if (h === "object" || h === "function")
        if (!c)
          f[a++] = 192;
        else {
          if (o) {
            let g = o.get(c);
            if (g) {
              if (!g.id) {
                let S = o.idsToInsert || (o.idsToInsert = []);
                g.id = S.push(g);
              }
              f[a++] = 214, f[a++] = 112, O.setUint32(a, g.id), a += 4;
              return;
            } else
              o.set(c, { offset: a - r });
          }
          let u = c.constructor;
          if (u === Object)
            le(c);
          else if (u === Array)
            ne(c);
          else if (u === Map)
            if (this.mapAsEmptyObject) f[a++] = 128;
            else {
              d = c.size, d < 16 ? f[a++] = 128 | d : d < 65536 ? (f[a++] = 222, f[a++] = d >> 8, f[a++] = d & 255) : (f[a++] = 223, O.setUint32(a, d), a += 4);
              for (let [g, S] of c)
                L(g), L(S);
            }
          else {
            for (let g = 0, S = Ee.length; g < S; g++) {
              let U = gt[g];
              if (c instanceof U) {
                let b = Ee[g];
                if (b.write) {
                  b.type && (f[a++] = 212, f[a++] = b.type, f[a++] = 0);
                  let se = b.write.call(this, c);
                  se === c ? Array.isArray(c) ? ne(c) : le(c) : L(se);
                  return;
                }
                let k = f, T = O, F = a;
                f = null;
                let Y;
                try {
                  Y = b.pack.call(this, c, (se) => (f = k, k = null, a += se, a > C && Q(a), {
                    target: f,
                    targetView: O,
                    position: a - se
                  }), L);
                } finally {
                  k && (f = k, O = T, a = F, C = f.length - 10);
                }
                Y && (Y.length + a > C && Q(Y.length + a), a = nr(Y, f, a, b.type));
                return;
              }
            }
            if (Array.isArray(c))
              ne(c);
            else {
              if (c.toJSON) {
                const g = c.toJSON();
                if (g !== c)
                  return L(g);
              }
              if (h === "function")
                return L(this.writeFunction && this.writeFunction(c));
              le(c);
            }
          }
        }
      else if (h === "boolean")
        f[a++] = c ? 195 : 194;
      else if (h === "bigint") {
        if (c < BigInt(1) << BigInt(63) && c >= -(BigInt(1) << BigInt(63)))
          f[a++] = 211, O.setBigInt64(a, c);
        else if (c < BigInt(1) << BigInt(64) && c > 0)
          f[a++] = 207, O.setBigUint64(a, c);
        else if (this.largeBigIntToFloat)
          f[a++] = 203, O.setFloat64(a, Number(c));
        else {
          if (this.largeBigIntToString)
            return L(c.toString());
          if (this.useBigIntExtension && c < BigInt(2) ** BigInt(1023) && c > -(BigInt(2) ** BigInt(1023))) {
            f[a++] = 199, a++, f[a++] = 66;
            let u = [], g;
            do {
              let S = c & BigInt(255);
              g = (S & BigInt(128)) === (c < BigInt(0) ? BigInt(128) : BigInt(0)), u.push(S), c >>= BigInt(8);
            } while (!((c === BigInt(0) || c === BigInt(-1)) && g));
            f[a - 2] = u.length;
            for (let S = u.length; S > 0; )
              f[a++] = Number(u[--S]);
            return;
          } else
            throw new RangeError(c + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
        }
        a += 8;
      } else if (h === "undefined")
        this.encodeUndefinedAsNil ? f[a++] = 192 : (f[a++] = 212, f[a++] = 0, f[a++] = 0);
      else
        throw new Error("Unknown type: " + h);
    }, Ne = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (c) => {
      let h;
      if (this.skipValues) {
        h = [];
        for (let g in c)
          (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(g)) && !this.skipValues.includes(c[g]) && h.push(g);
      } else
        h = Object.keys(c);
      let d = h.length;
      d < 16 ? f[a++] = 128 | d : d < 65536 ? (f[a++] = 222, f[a++] = d >> 8, f[a++] = d & 255) : (f[a++] = 223, O.setUint32(a, d), a += 4);
      let u;
      if (this.coercibleKeyAsNumber)
        for (let g = 0; g < d; g++) {
          u = h[g];
          let S = Number(u);
          L(isNaN(S) ? u : S), L(c[u]);
        }
      else
        for (let g = 0; g < d; g++)
          L(u = h[g]), L(c[u]);
    } : (c) => {
      f[a++] = 222;
      let h = a - r;
      a += 2;
      let d = 0;
      for (let u in c)
        (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(u)) && (L(u), L(c[u]), d++);
      if (d > 65535)
        throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
      f[h++ + r] = d >> 8, f[h + r] = d & 255;
    }, Ve = this.useRecords === !1 ? Ne : t.progressiveRecords && !I ? (
      // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
      (c) => {
        let h, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = a++ - r, g;
        for (let S in c)
          if (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(S)) {
            if (h = d[S], h)
              d = h;
            else {
              let U = Object.keys(c), b = d;
              d = s.transitions;
              let k = 0;
              for (let T = 0, F = U.length; T < F; T++) {
                let Y = U[T];
                h = d[Y], h || (h = d[Y] = /* @__PURE__ */ Object.create(null), k++), d = h;
              }
              u + r + 1 == a ? (a--, Se(d, U, k)) : $e(d, U, u, k), g = !0, d = b[S];
            }
            L(c[S]);
          }
        if (!g) {
          let S = d[ee];
          S ? f[u + r] = S : $e(d, Object.keys(c), u, 0);
        }
      }
    ) : (c) => {
      let h, d = s.transitions || (s.transitions = /* @__PURE__ */ Object.create(null)), u = 0;
      for (let S in c) (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(S)) && (h = d[S], h || (h = d[S] = /* @__PURE__ */ Object.create(null), u++), d = h);
      let g = d[ee];
      g ? g >= 96 && I ? (f[a++] = ((g -= 96) & 31) + 96, f[a++] = g >> 5) : f[a++] = g : Se(d, d.__keys__ || Object.keys(c), u);
      for (let S in c)
        (typeof c.hasOwnProperty != "function" || c.hasOwnProperty(S)) && L(c[S]);
    }, Ce = typeof this.useRecords == "function" && this.useRecords, le = Ce ? (c) => {
      Ce(c) ? Ve(c) : Ne(c);
    } : Ve, Q = (c) => {
      let h;
      if (c > 16777216) {
        if (c - r > Ge)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        h = Math.min(
          Ge,
          Math.round(Math.max((c - r) * (c > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
        );
      } else
        h = (Math.max(c - r << 2, f.length - 1) >> 12) + 1 << 12;
      let d = new de(h);
      return O = d.dataView || (d.dataView = new DataView(d.buffer, 0, h)), c = Math.min(c, f.length), f.copy ? f.copy(d, 0, r, c) : d.set(f.slice(r, c)), a -= r, r = 0, C = d.length - 10, f = d;
    }, Se = (c, h, d) => {
      let u = s.nextId;
      u || (u = 64), u < P && this.shouldShareStructure && !this.shouldShareStructure(h) ? (u = s.nextOwnId, u < V || (u = P), s.nextOwnId = u + 1) : (u >= V && (u = P), s.nextId = u + 1);
      let g = h.highByte = u >= 96 && I ? u - 96 >> 5 : -1;
      c[ee] = u, c.__keys__ = h, s[u - 64] = h, u < P ? (h.isShared = !0, s.sharedLength = u - 63, n = !0, g >= 0 ? (f[a++] = (u & 31) + 96, f[a++] = g) : f[a++] = u) : (g >= 0 ? (f[a++] = 213, f[a++] = 114, f[a++] = (u & 31) + 96, f[a++] = g) : (f[a++] = 212, f[a++] = 114, f[a++] = u), d && (Z += W * d), D.length >= m && (D.shift()[ee] = 0), D.push(c), L(h));
    }, $e = (c, h, d, u) => {
      let g = f, S = a, U = C, b = r;
      f = ie, a = 0, r = 0, f || (ie = f = new de(8192)), C = f.length - 10, Se(c, h, u), ie = f;
      let k = a;
      if (f = g, a = S, C = U, r = b, k > 1) {
        let T = a + k - 1;
        T > C && Q(T);
        let F = d + r;
        f.copyWithin(F + k, F + 1, a), f.set(ie.slice(0, k), F), a = T;
      } else
        f[d + r] = ie[0];
    }, Et = (c) => {
      let h = er(c, f, r, a, s, Q, (d, u, g) => {
        if (g)
          return n = !0;
        a = u;
        let S = f;
        return L(d), ce(), S !== f ? { position: a, targetView: O, target: f } : a;
      }, this);
      if (h === 0)
        return le(c);
      a = h;
    };
  }
  useBuffer(t) {
    f = t, f.dataView || (f.dataView = new DataView(f.buffer, f.byteOffset, f.byteLength)), a = 0;
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
gt = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, it];
Ee = [{
  pack(e, t, r) {
    let n = e.getTime() / 1e3;
    if ((this.useTimestamp32 || e.getMilliseconds() === 0) && n >= 0 && n < 4294967296) {
      let { target: s, targetView: o, position: l } = t(6);
      s[l++] = 214, s[l++] = 255, o.setUint32(l, n);
    } else if (n > 0 && n < 4294967296) {
      let { target: s, targetView: o, position: l } = t(10);
      s[l++] = 215, s[l++] = 255, o.setUint32(l, e.getMilliseconds() * 4e6 + (n / 1e3 / 4294967296 >> 0)), o.setUint32(l + 4, n);
    } else if (isNaN(n)) {
      if (this.onInvalidDate)
        return t(0), r(this.onInvalidDate());
      let { target: s, targetView: o, position: l } = t(3);
      s[l++] = 212, s[l++] = 255, s[l++] = 255;
    } else {
      let { target: s, targetView: o, position: l } = t(15);
      s[l++] = 199, s[l++] = 12, s[l++] = 255, o.setUint32(l, e.getMilliseconds() * 1e6), o.setBigInt64(l + 4, BigInt(Math.floor(n)));
    }
  }
}, {
  pack(e, t, r) {
    if (this.setAsEmptyObject)
      return t(0), r({});
    let n = Array.from(e), { target: s, position: o } = t(this.moreTypes ? 3 : 0);
    this.moreTypes && (s[o++] = 212, s[o++] = 115, s[o++] = 0), r(n);
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
    this.moreTypes ? Ke(e, 16, t) : Ze(pe ? Buffer.from(e) : new Uint8Array(e), t);
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
    var { target: o, position: l } = r(4 + s);
    o[l++] = 199, o[l++] = s + 1;
  } else if (s + 1 < 65536) {
    var { target: o, position: l } = r(5 + s);
    o[l++] = 200, o[l++] = s + 1 >> 8, o[l++] = s + 1 & 255;
  } else {
    var { target: o, position: l, targetView: y } = r(7 + s);
    o[l++] = 201, y.setUint32(l, s + 1), l += 4;
  }
  o[l++] = 116, o[l++] = t, e.buffer || (e = new Uint8Array(e)), o.set(new Uint8Array(e.buffer, e.byteOffset, e.byteLength), l);
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
    var { target: n, position: s, targetView: o } = t(r + 5);
    n[s++] = 198, o.setUint32(s, r), s += 4;
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
    let o = r.offset, l = r.id;
    e.copyWithin(o + n, o, s), n -= 6;
    let y = o + n;
    e[y++] = 214, e[y++] = 105, e[y++] = l >> 24, e[y++] = l >> 16 & 255, e[y++] = l >> 8 & 255, e[y++] = l & 255, s = o;
  }
  return e;
}
function Xe(e, t, r) {
  if (R.length > 0) {
    O.setUint32(R.position + e, a + r - R.position - e), R.stringsPosition = a - e;
    let n = R;
    R = null, t(n[0]), t(n[1]);
  }
}
function ir(e, t) {
  return e.isCompatible = (r) => {
    let n = !r || (t.lastNamedStructuresLength || 0) === r.length;
    return n || t._mergeStructures(r), n;
  }, e;
}
let yt = new Pe({ useRecords: !1 });
yt.pack;
yt.pack;
const ar = 512, fr = 1024, or = 2048, cr = (e) => new Pe({ structuredClone: !0 }).unpack(new Uint8Array(e));
function lr(e) {
  return Me(e) ? dr(e) : ur(e);
}
async function ur(e) {
  const t = await re(e);
  return Ie(t);
}
function dr(e) {
  const t = Oe(e);
  return Ie(t);
}
const wt = (e, t = "application/octet-stream") => e instanceof Blob ? e : e instanceof ArrayBuffer ? new Blob([e], { type: t }) : typeof e == "string" ? new Blob([e], { type: t }) : ArrayBuffer.isView(e) ? new Blob([e], { type: t }) : Array.isArray(e) ? new Blob([Te(e)], { type: t }) : new Blob([]), xr = async (e) => {
  const t = wt(e), r = new FileReader();
  return new Promise((n, s) => {
    const o = (l) => typeof l == "string" ? n(l) : (console.log({ bytes: e }), s("Unable to convert to data URL"));
    r.onload = function(l) {
      o(l.target?.result);
    }, r.readAsDataURL(t);
  });
}, gr = (e) => {
  const t = new Pe({ structuredClone: !0 });
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
  msgPackToObject: cr,
  typeOfBytes: hr,
  toDataUrl: xr,
  dataUrlToBlob: jt,
  lengthOf: Jt,
  isByteLike: zt,
  isImmediateByteLike: Me,
  hashOf: ye,
  immediateHashOf: Ft,
  addressStringOf: ge,
  toArrayBuffer: re,
  immediateToArrayBuffer: Oe,
  toBlob: wt,
  toText: st,
  toBase64: lr,
  encodeAsString: nt,
  test: qt,
  assignMediaTypeToBlob: Ct,
  utf8ToUint8Array: yr,
  base64ToArrayBuffer: $t,
  arrayBufferToHex: Nt,
  arrayBufferToUtf8: Vt,
  arrayBufferToBase64: Ie,
  ALL_ALGORITHMS: Ue,
  ALGORITHM_BYTE_LENGTHS: tt
}, wr = (e) => typeof e == "function", pt = (e) => e == null || Number.isNaN(e), St = (e) => !pt(e), pr = (e) => wr(e) ? e() : e, Sr = (e, t = {}) => {
  const { quiet: r = !1, def: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (o) {
    return r || (console.error(o), St(s) && console.log(pr(s))), n;
  }
}, mr = {
  isDefined: St,
  isUndefined: pt,
  safe: Sr
}, { isDefined: De, isUndefined: br, safe: mt } = mr, Ar = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: o = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !o(t.timestamp) || t.extra && !s(t.extra));
}, Br = (e) => (t) => {
  for (const r of e)
    if (Ar(r)(t))
      return !0;
  return !1;
}, Er = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance
} = {}) => {
  const n = {
    start: (s, ...o) => {
      n.addLog({ traceId: s, message: "start", extra: o });
    },
    addLog: ({ traceId: s, message: o, timestamp: l = r.now(), extra: y = [] }) => {
      Br(e)({
        traceId: s,
        message: o,
        timestamp: l,
        extra: y
      }) && t(`${l} ${s}: ${o}`, ...y);
    },
    end: (s, ...o) => {
      n.addLog({ traceId: s, message: "end", extra: o });
    }
  };
  return n;
}, bt = (e = "", t = Er()) => {
  t.start(e);
  const r = {
    span: (n) => bt(`${e}.${n}`, t),
    end: () => (t.end(e), r),
    log: (n, ...s) => (t.addLog({ traceId: e, message: n, extra: s }), r)
  };
  return r;
}, qe = (e) => {
  const { message: t, stack: r, extra: n, cause: s } = e, o = s ? `
Caused by: ${qe(s)}` : "", l = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(De).join(`
`) + l + o;
}, At = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? qe(e) : mt(() => JSON.stringify(e, void 0, 2)) ?? "", Ur = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? qe(e) : mt(() => JSON.stringify(e, void 0, 2)) ?? "";
}, Bt = ({ error: e, extra: t, stack: r }) => {
  if (e instanceof Error) {
    const n = De(e.cause) ? Bt({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? r,
      extra: t,
      cause: n
    };
  }
  return {
    message: At(e),
    stack: r,
    extra: t
  };
}, kr = {
  errorToErrorDetail: Bt,
  errorToText: At,
  errorToTextAsync: Ur
}, We = async ({
  channel: e,
  subject: t,
  connectionListener: r,
  options: n = {}
}) => {
  const { log: s = () => {
  }, signal: o } = n;
  s("connectConnectionListenerToSubject: subject: ", t);
  for await (const l of e.listenOn(t, {
    callback: async (y) => {
      const w = v.msgPackToObject(y), { data: A, meta: p } = w;
      if (It(w))
        throw console.error("Error in message: ", w), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${w?.data?.message}`
        );
      try {
        const m = await r(A, {
          headers: p?.headers,
          signal: o
        });
        return v.toMsgPack({
          data: m
        });
      } catch (m) {
        const I = kr.errorToErrorDetail({ error: m });
        return v.toMsgPack({
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
}, Mr = async ({
  channel: e,
  subscribers: t = {},
  options: r = {},
  obs: n = bt()
}) => {
  const s = n.span("MessageBus"), { defaultTimeoutMs: o = 60 * 1e3, signal: l } = r, y = Object.entries(t);
  s.log("connect: subscribers: ", y);
  for (const [w, A] of y)
    br(A) || We({
      channel: e,
      subject: w,
      connectionListener: A,
      options: r
    });
  return {
    requestMany: async (w, A, p = {}) => {
      const m = s.span("requestMany"), { timeoutMs: I = 60 * 1e3, headers: P, callback: V } = p, D = v.toMsgPack({
        data: A,
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
        const ne = v.msgPackToObject(ce);
        await V?.(ne);
      }
      Z.end(), m.end();
    },
    request: async (w, A, p = {}) => {
      const m = s.span("request").log("subject", w), { timeoutMs: I = o, headers: P } = p, V = v.toMsgPack({
        data: A,
        meta: { headers: P }
      }), D = m.span("channel request").log("requestData", V), Z = await e.request(w, V, {
        timeoutMs: I
      });
      return D.end(), m.end(), v.msgPackToObject(Z);
    },
    publish: async (w, A, p = {}) => {
      const { headers: m } = p, I = v.toMsgPack({
        data: A,
        meta: { headers: m }
      });
      return s.span("publish").log("subject", w), e.postOn(w, I);
    },
    subscribe: async (w, A, p = {}) => (s.span("subscribe").log("subject", w), We({
      channel: e,
      subject: w,
      connectionListener: A,
      options: p
    }))
  };
}, Tr = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const r = {
    postOn: (n, s, o = {}) => {
      const { signal: l, reply: y } = o;
      e(l)(n)({ subject: n, data: s, reply: y });
    },
    listenOn: function(n, s = {}) {
      const { signal: o, once: l, callback: y } = s, w = new AbortController();
      if (o?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      o?.addEventListener("abort", () => {
        w.abort();
      });
      const A = t(w.signal)(n)(
        async (p) => {
          if (p.subject === n) {
            l && w.abort();
            const m = await y?.(p.data, {
              finished: p.finished ?? !1
            });
            if (p.reply && m && (et(m) ? (async () => {
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
            })), m && !et(m))
              return { ...p, data: m };
          }
          return p;
        }
      );
      return async function* () {
        for await (const p of A)
          yield p.data;
      }();
    },
    request: async (n, s, o = {}) => {
      const { signal: l, timeoutMs: y } = o, w = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((A, p) => {
        l?.aborted && p(
          new Error(`request: Signal is already aborted for ${n}`)
        ), l?.addEventListener("abort", () => {
          p(new Error("Request aborted"));
        });
        let m;
        y && (m = setTimeout(() => {
          p(
            new Error(
              `request: Request timed out after ${y}ms for ${n}`
            )
          );
        }, y)), r.listenOn(w, {
          callback: (I) => {
            clearTimeout(m), A(I);
          },
          signal: l,
          once: !0
        }), r.postOn(n, s, { reply: w, signal: l });
      });
    },
    requestMany: async (n, s, o = {}) => {
      const { signal: l, timeoutMs: y, callback: w } = o, A = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((p, m) => {
        l?.aborted && m(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), l?.addEventListener("abort", () => {
          m(new Error("Request aborted"));
        });
        let I;
        y && (I = setTimeout(() => {
          m(
            new Error(
              `requestMany: Request timed out after ${y}ms for ${n}`
            )
          );
        }, y));
        const P = r.listenOn(A, {
          callback: (V, D) => {
            if (V !== void 0 && w?.(V), D.finished)
              return clearTimeout(I), p(P);
          },
          signal: l
        });
        return r.postOn(n, s, { reply: A, signal: l }), P;
      });
    }
  };
  return r;
};
function et(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const Rr = (e) => Tr({
  posterProducer: (t) => (r) => (n) => {
    t?.aborted || e.emit(r, n);
  },
  listenerProducer: (t) => (r) => (n) => {
    const s = [], o = {
      resolve: void 0
    }, l = async (y) => {
      if (t?.aborted)
        return;
      const w = await n?.(y), A = De(w) ? w : y;
      s.push(A), o.resolve?.();
    };
    return t?.addEventListener("abort", () => {
      e.off(r, l);
    }), e.on(r, l), {
      [Symbol.asyncIterator]: async function* () {
        for (; !t?.aborted; )
          s.length > 0 ? yield s.shift() : await new Promise((y) => {
            o.resolve = y;
          });
      }
    };
  }
});
export {
  Tr as Channel,
  Rr as EmitterChannel,
  Mr as MessageBus,
  kt as isError,
  It as isErrorMsg,
  Tt as isMsg,
  Ut as isValue,
  Or as isValueOrError,
  Ir as parseSubject
};

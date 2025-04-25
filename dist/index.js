const ae = (e) => {
  const t = e.split("."), s = t.shift(), n = t.join(".");
  return {
    root: s,
    segments: t,
    subpath: n
  };
}, k = (e) => "value" in e && e.value !== void 0, v = (e) => "error" in e && e.error !== void 0, oe = (e) => k(e) || v(e), j = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, N = (e) => {
  const t = e;
  return j(e) && t.meta?.hasError || !1;
}, A = (e) => typeof e == "function", M = (e) => e == null || Number.isNaN(e), T = (e) => !M(e), J = (e) => A(e) ? e() : e, B = (e, t = {}) => {
  const { quiet: s = !1, def: n = void 0, onError: r } = t;
  try {
    return e();
  } catch (o) {
    return s || (console.error(o), T(r) && console.log(J(r))), n;
  }
}, P = {
  isDefined: T,
  isUndefined: M,
  safe: B
}, { isDefined: $, isUndefined: V, safe: D } = P, I = (e) => e == null || Number.isNaN(e), K = (e) => !I(e), Q = {
  isDefined: K,
  isUndefined: I
}, { isDefined: b, isUndefined: F } = Q, G = (e, t, s) => {
  if (F(e))
    return;
  const n = t.get(e);
  if (b(n))
    return n;
  if (b(s)) {
    const r = s();
    return t.set(e, r), r;
  }
}, H = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const s = {
    get: (n, r) => G(n, e, r),
    set: (n, r) => (e.set(n, r), s),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([r, o]) => o === n).map(([r, o]) => r),
    lastUpdate: () => t
  };
  return s;
}, W = {
  create: H
}, X = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: s,
    message: n,
    extra: r = () => !0,
    timestamp: o = () => !0
  } = e;
  return !(s && !new RegExp(s).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !o(t.timestamp) || t.extra && !r(t.extra));
}, Y = (e) => (t) => {
  for (const s of e)
    if (X(s)(t))
      return s;
  return !1;
}, Z = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, y = (e) => {
  const t = [], s = {
    length: 0,
    push: (n) => {
      t.length >= e && t.shift(), t.push(n), s.length = t.length;
    },
    get: () => t,
    clear: () => {
      t.length = 0, s.length = 0;
    },
    last: () => t[t.length - 1]
  };
  return s;
}, S = () => {
  let e = performance.now(), t;
  const s = {
    end: () => (b(t) || (t = performance.now()), s),
    getDuration: () => (t ?? performance.now()) - e
  };
  return s;
}, _ = (e = 100) => {
  let t = 0;
  const s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = y(e), o = {
    time: () => {
      const a = r.last();
      b(a) && a.end();
      const c = S();
      return r.push(c), c;
    },
    getTimes: () => r.get(),
    timer: (a) => {
      const c = n.get(a) ?? y(e);
      n.set(a, c);
      const d = S();
      return c.push(d), d;
    },
    counter: (a, c = 1) => {
      const d = s.get(a) ?? 0;
      s.set(a, d + c);
    },
    getCounters: () => new Map(s),
    getCounter: (a) => s.get(a) ?? 0,
    count: (a = 1) => {
      t += a;
    },
    getCount: () => t,
    clearCount: () => (t = 0, o),
    getTimers: (a) => (n.get(a) ?? y(e)).get(),
    clearTimers: (a) => ((n.get(a) ?? y(e)).clear(), o)
  };
  return o;
}, ee = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: s = performance
} = {}) => {
  const n = W.create(), r = {
    getTraceIds: () => n.entries().map(([o]) => o),
    start: (o, ...a) => {
      r.getStats(o).count(), r.getStats(o).time(), r.addLog({ traceId: o, message: "start", extra: a });
    },
    getStats: (o) => n.get(o, () => _()),
    addLog: ({ traceId: o, message: a, timestamp: c = s.now(), extra: d = [] }) => {
      const u = {
        traceId: o,
        message: a,
        timestamp: c,
        extra: d
      }, i = Y(e)(u);
      if (!i)
        return;
      const l = Z(i)(u);
      t(
        `${l.timestamp} ${l.traceId}: ${l.message}`,
        ...l.extra ?? []
      );
    },
    end: (o, ...a) => {
      r.addLog({ traceId: o, message: "end", extra: a });
    }
  };
  return r;
}, O = (e = "", t = ee()) => {
  t.start(e);
  const s = {
    span: (n) => O(`${e}.${n}`, t),
    counter: (n, r = 1) => (t.getStats(e).counter(n, r), s),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), s),
    log: (n, ...r) => (t.addLog({ traceId: e, message: n, extra: r }), s)
  };
  return s;
}, q = (e) => {
  const { message: t, stack: s, extra: n, cause: r } = e, o = r ? `
Caused by: ${q(r)}` : "", a = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, s].filter($).join(`
`) + a + o;
}, C = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? q(e) : D(() => JSON.stringify(e, void 0, 2)) ?? "", te = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? q(e) : D(() => JSON.stringify(e, void 0, 2)) ?? "";
}, L = ({ error: e, extra: t, stack: s }) => {
  if (e instanceof Error) {
    const n = $(e.cause) ? L({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? s,
      extra: t,
      cause: n
    };
  }
  return {
    message: C(e),
    stack: s,
    extra: t
  };
}, ne = {
  errorToErrorDetail: L,
  errorToText: C,
  errorToTextAsync: te
}, E = async ({
  channel: e,
  subject: t,
  connectionListener: s,
  serializer: n,
  options: r = {}
}) => {
  const { log: o = () => {
  }, signal: a } = r;
  o("connectConnectionListenerToSubject: subject: ", t);
  for await (const c of e.listenOn(t, {
    callback: async (d) => {
      const u = n.deserialize(d), { data: i, meta: l } = u;
      if (N(u))
        throw console.error("Error in message: ", u), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${u?.data?.message}`
        );
      try {
        const f = await s(i, {
          headers: l?.headers,
          signal: a
        });
        return n.serialize({
          data: f
        });
      } catch (f) {
        const g = ne.errorToErrorDetail({ error: f });
        return n.serialize({
          data: g,
          meta: {
            hasError: !0,
            code: 500,
            status: g.message
          }
        });
      }
    }
  }))
    ;
}, se = () => ({
  serialize: (e) => e,
  deserialize: (e) => e
}), ie = async ({
  channel: e,
  subscribers: t = {},
  options: s = {},
  obs: n = O()
}) => {
  const r = n.span("MessageBus"), {
    defaultTimeoutMs: o = 60 * 1e3,
    signal: a,
    serializer: c = se()
  } = s, d = Object.entries(t);
  r.log("connect: subscribers: ", d);
  for (const [u, i] of d)
    V(i) || E({
      serializer: c,
      channel: e,
      subject: u,
      connectionListener: i,
      options: s
    });
  return {
    requestMany: async (u, i, l = {}) => {
      const f = r.span("requestMany"), { timeoutMs: g = 60 * 1e3, headers: p, callback: m } = l, h = c.serialize({
        data: i,
        meta: { headers: p }
      }), w = f.span("channel requestMany").log("start requestMany", u), z = await e.requestMany(
        u,
        h,
        {
          timeoutMs: g
        }
      );
      for await (const U of z) {
        if (a?.aborted)
          return;
        const R = c.deserialize(U);
        await m?.(R);
      }
      w.end(), f.end();
    },
    request: async (u, i, l = {}) => {
      const f = r.span("request").log("subject", u), { timeoutMs: g = o, headers: p } = l, m = c.serialize({
        data: i,
        meta: { headers: p }
      }), h = f.span("channel request").log("requestData", m), w = await e.request(u, m, {
        timeoutMs: g
      });
      return h.end(), f.end(), c.deserialize(w);
    },
    publish: async (u, i, l = {}) => {
      const { headers: f } = l, g = c.serialize({
        data: i,
        meta: { headers: f }
      });
      return r.span("publish").log("subject", u), e.postOn(u, g);
    },
    subscribe: async (u, i, l = {}) => (r.span("subscribe").log("subject", u), E({
      channel: e,
      serializer: c,
      subject: u,
      connectionListener: i,
      options: l
    }))
  };
}, re = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const s = {
    postOn: (n, r, o = {}) => {
      const { signal: a, reply: c } = o;
      e(a)(n)({ subject: n, data: r, reply: c });
    },
    listenOn: function(n, r = {}) {
      const { signal: o, once: a, callback: c } = r, d = new AbortController();
      if (o?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      o?.addEventListener("abort", () => {
        d.abort();
      });
      const u = t(d.signal)(n)(
        async (i) => {
          if (i.subject === n) {
            a && d.abort();
            const l = await c?.(i.data, {
              finished: i.finished ?? !1
            });
            if (i.reply && l && (x(l) ? (async () => {
              for await (const f of l)
                e(d.signal)(i.reply)({
                  subject: i.reply,
                  data: f
                });
              e(d.signal)(i.reply)({
                subject: i.reply,
                data: void 0,
                finished: !0
              });
            })() : e(d.signal)(i.reply)({
              subject: i.reply,
              data: l,
              finished: !0
            })), l && !x(l))
              return { ...i, data: l };
          }
          return i;
        }
      );
      return async function* () {
        for await (const i of u)
          yield i.data;
      }();
    },
    request: async (n, r, o = {}) => {
      const { signal: a, timeoutMs: c } = o, d = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((u, i) => {
        a?.aborted && i(
          new Error(`request: Signal is already aborted for ${n}`)
        ), a?.addEventListener("abort", () => {
          i(new Error("Request aborted"));
        });
        let l;
        c && (l = setTimeout(() => {
          i(
            new Error(
              `request: Request timed out after ${c}ms for ${n}`
            )
          );
        }, c)), s.listenOn(d, {
          callback: (f) => {
            clearTimeout(l), u(f);
          },
          signal: a,
          once: !0
        }), s.postOn(n, r, { reply: d, signal: a });
      });
    },
    requestMany: async (n, r, o = {}) => {
      const { signal: a, timeoutMs: c, callback: d } = o, u = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((i, l) => {
        a?.aborted && l(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), a?.addEventListener("abort", () => {
          l(new Error("Request aborted"));
        });
        let f;
        c && (f = setTimeout(() => {
          l(
            new Error(
              `requestMany: Request timed out after ${c}ms for ${n}`
            )
          );
        }, c));
        const g = s.listenOn(u, {
          callback: (p, m) => {
            if (p !== void 0 && d?.(p), m.finished)
              return clearTimeout(f), i(g);
          },
          signal: a
        });
        return s.postOn(n, r, { reply: u, signal: a }), g;
      });
    }
  };
  return s;
};
function x(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const ce = (e) => re({
  posterProducer: (t) => (s) => (n) => {
    t?.aborted || e.emit(s, n);
  },
  listenerProducer: (t) => (s) => (n) => {
    const r = [], o = {
      resolve: void 0
    }, a = async (c) => {
      if (t?.aborted)
        return;
      const d = await n?.(c), u = $(d) ? d : c;
      r.push(u), o.resolve?.();
    };
    return t?.addEventListener("abort", () => {
      e.off(s, a);
    }), e.on(s, a), {
      [Symbol.asyncIterator]: async function* () {
        for (; !t?.aborted; )
          r.length > 0 ? yield r.shift() : await new Promise((c) => {
            o.resolve = c;
          });
      }
    };
  }
});
export {
  re as Channel,
  ce as EmitterChannel,
  ie as MessageBus,
  v as isError,
  N as isErrorMsg,
  j as isMsg,
  k as isValue,
  oe as isValueOrError,
  ae as parseSubject
};

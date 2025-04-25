const ae = (e) => {
  const t = e.split("."), s = t.shift(), n = t.join(".");
  return {
    root: s,
    segments: t,
    subpath: n
  };
}, k = (e) => "value" in e && e.value !== void 0, L = (e) => "error" in e && e.error !== void 0, oe = (e) => k(e) || L(e), j = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, N = (e) => {
  const t = e;
  return j(e) && t.meta?.hasError || !1;
}, A = (e) => typeof e == "function", E = (e) => e == null || Number.isNaN(e), T = (e) => !E(e), J = (e) => A(e) ? e() : e, B = (e, t = {}) => {
  const { quiet: s = !1, def: n = void 0, onError: r } = t;
  try {
    return e();
  } catch (i) {
    return s || (console.error(i), T(r) && console.log(J(r))), n;
  }
}, G = {
  isDefined: T,
  isUndefined: E,
  safe: B
}, { isDefined: S, isUndefined: P, safe: D } = G, I = (e) => e == null || Number.isNaN(e), V = (e) => !I(e), K = {
  isDefined: V,
  isUndefined: I
}, { isDefined: y, isUndefined: Q } = K, F = (e, t, s) => {
  if (Q(e))
    return;
  const n = t.get(e);
  if (y(n))
    return n;
  if (y(s)) {
    const r = s();
    return t.set(e, r), r;
  }
}, H = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const s = {
    get: (n, r) => F(n, e, r),
    set: (n, r) => (e.set(n, r), s),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([r, i]) => i === n).map(([r, i]) => r),
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
    timestamp: i = () => !0
  } = e;
  return !(s && !new RegExp(s).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !i(t.timestamp) || t.extra && !r(t.extra));
}, Y = (e) => (t) => {
  for (const s of e)
    if (X(s)(t))
      return s;
  return !1;
}, Z = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, w = (e) => {
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
}, q = () => {
  let e = performance.now(), t;
  const s = {
    end: () => (y(t) || (t = performance.now()), s),
    getDuration: () => (t ?? performance.now()) - e
  };
  return s;
}, _ = (e = 100) => {
  let t = 0;
  const s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = w(e), o = {
    clear: () => (t = 0, s.clear(), n.clear(), r.clear(), i.clear(), o),
    lastTime: () => i.last(),
    time: () => {
      const a = o.lastTime();
      y(a) && a.end();
      const l = q();
      return i.push(l), l;
    },
    getTimes: () => i.get(),
    timer: (a) => {
      const l = r.get(a) ?? w(e);
      r.set(a, l);
      const u = q();
      return l.push(u), u;
    },
    increment: (a, l = 1) => {
      const u = s.get(a) ?? 0;
      s.set(a, u + l);
    },
    gauge: (a, l = 0) => {
      n.set(a, l);
    },
    getCounters: () => new Map(s),
    getCounter: (a) => s.get(a) ?? 0,
    getGauge: (a) => n.get(a) ?? 0,
    getGauges: () => new Map(n),
    count: (a = 1) => {
      t += a;
    },
    getCount: () => t,
    getTimers: (a) => (r.get(a) ?? w(e)).get()
  };
  return o;
}, ee = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: s = performance,
  maxSampleSize: n = 100
} = {}) => {
  const r = W.create(), i = {
    getTraceIds: () => r.entries().map(([o]) => o),
    start: (o, ...a) => {
      i.getStats(o).count(), i.getStats(o).time(), i.log({ traceId: o, message: "start", extra: a });
    },
    getStats: (o) => r.get(o, () => _(n)),
    log: ({ traceId: o, message: a, timestamp: l = s.now(), extra: u = [] }) => {
      const c = {
        traceId: o,
        message: a,
        timestamp: l,
        extra: u
      }, f = Y(e)(c);
      if (!f)
        return;
      const d = Z(f)(c);
      t(
        `${d.timestamp} ${d.traceId}: ${d.message}`,
        ...d.extra ?? []
      );
    },
    end: (o, ...a) => {
      i.getStats(o).lastTime()?.end(), i.log({ traceId: o, message: "end", extra: a });
    }
  };
  return i;
}, O = (e = "", t = ee()) => {
  t.start(e);
  const s = {
    span: (n) => O(`${e}.${n}`, t),
    increment: (n, r = 1) => (t.getStats(e).increment(n, r), s),
    sample: (n, r, i) => {
      if (Math.random() < n) {
        const o = i();
        s.gauge(r, o);
      }
      return s;
    },
    when: (n, r, i) => {
      if (n()) {
        const o = i();
        s.gauge(r, o);
      }
      return s;
    },
    gauge: (n, r) => (t.getStats(e).gauge(n, r), s),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), s),
    log: (n, ...r) => (t.log({ traceId: e, message: n, extra: r }), s)
  };
  return s;
}, $ = (e) => {
  const { message: t, stack: s, extra: n, cause: r } = e, i = r ? `
Caused by: ${$(r)}` : "", o = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, s].filter(S).join(`
`) + o + i;
}, z = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? $(e) : D(() => JSON.stringify(e, void 0, 2)) ?? "", te = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? $(e) : D(() => JSON.stringify(e, void 0, 2)) ?? "";
}, C = ({ error: e, extra: t, stack: s }) => {
  if (e instanceof Error) {
    const n = S(e.cause) ? C({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? s,
      extra: t,
      cause: n
    };
  }
  return {
    message: z(e),
    stack: s,
    extra: t
  };
}, ne = {
  errorToErrorDetail: C,
  errorToText: z,
  errorToTextAsync: te
}, M = async ({
  channel: e,
  subject: t,
  connectionListener: s,
  serializer: n,
  options: r = {}
}) => {
  const { log: i = () => {
  }, signal: o } = r;
  i("connectConnectionListenerToSubject: subject: ", t);
  for await (const a of e.listenOn(t, {
    callback: async (l) => {
      const u = n.deserialize(l), { data: c, meta: f } = u;
      if (N(u))
        throw console.error("Error in message: ", u), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${u?.data?.message}`
        );
      try {
        const d = await s(c, {
          headers: f?.headers,
          signal: o
        });
        return n.serialize({
          data: d
        });
      } catch (d) {
        const g = ne.errorToErrorDetail({ error: d });
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
    defaultTimeoutMs: i = 60 * 1e3,
    signal: o,
    serializer: a = se()
  } = s, l = Object.entries(t);
  r.log("connect: subscribers: ", l);
  for (const [u, c] of l)
    P(c) || M({
      serializer: a,
      channel: e,
      subject: u,
      connectionListener: c,
      options: s
    });
  return {
    requestMany: async (u, c, f = {}) => {
      const d = r.span("requestMany"), { timeoutMs: g = 60 * 1e3, headers: m, callback: p } = f, b = a.serialize({
        data: c,
        meta: { headers: m }
      }), h = d.span("channel requestMany").log("start requestMany", u), U = await e.requestMany(
        u,
        b,
        {
          timeoutMs: g
        }
      );
      for await (const R of U) {
        if (o?.aborted)
          return;
        const v = a.deserialize(R);
        await p?.(v);
      }
      h.end(), d.end();
    },
    request: async (u, c, f = {}) => {
      const d = r.span("request").log("subject", u), { timeoutMs: g = i, headers: m } = f, p = a.serialize({
        data: c,
        meta: { headers: m }
      }), b = d.span("channel request").log("requestData", p), h = await e.request(u, p, {
        timeoutMs: g
      });
      return b.end(), d.end(), a.deserialize(h);
    },
    publish: async (u, c, f = {}) => {
      const { headers: d } = f, g = a.serialize({
        data: c,
        meta: { headers: d }
      });
      return r.span("publish").log("subject", u), e.postOn(u, g);
    },
    subscribe: async (u, c, f = {}) => (r.span("subscribe").log("subject", u), M({
      channel: e,
      serializer: a,
      subject: u,
      connectionListener: c,
      options: f
    }))
  };
}, re = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const s = {
    postOn: (n, r, i = {}) => {
      const { signal: o, reply: a } = i;
      e(o)(n)({ subject: n, data: r, reply: a });
    },
    listenOn: function(n, r = {}) {
      const { signal: i, once: o, callback: a } = r, l = new AbortController();
      if (i?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      i?.addEventListener("abort", () => {
        l.abort();
      });
      const u = t(l.signal)(n)(
        async (c) => {
          if (c.subject === n) {
            o && l.abort();
            const f = await a?.(c.data, {
              finished: c.finished ?? !1
            });
            if (c.reply && f && (x(f) ? (async () => {
              for await (const d of f)
                e(l.signal)(c.reply)({
                  subject: c.reply,
                  data: d
                });
              e(l.signal)(c.reply)({
                subject: c.reply,
                data: void 0,
                finished: !0
              });
            })() : e(l.signal)(c.reply)({
              subject: c.reply,
              data: f,
              finished: !0
            })), f && !x(f))
              return { ...c, data: f };
          }
          return c;
        }
      );
      return async function* () {
        for await (const c of u)
          yield c.data;
      }();
    },
    request: async (n, r, i = {}) => {
      const { signal: o, timeoutMs: a } = i, l = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((u, c) => {
        o?.aborted && c(
          new Error(`request: Signal is already aborted for ${n}`)
        ), o?.addEventListener("abort", () => {
          c(new Error("Request aborted"));
        });
        let f;
        a && (f = setTimeout(() => {
          c(
            new Error(
              `request: Request timed out after ${a}ms for ${n}`
            )
          );
        }, a)), s.listenOn(l, {
          callback: (d) => {
            clearTimeout(f), u(d);
          },
          signal: o,
          once: !0
        }), s.postOn(n, r, { reply: l, signal: o });
      });
    },
    requestMany: async (n, r, i = {}) => {
      const { signal: o, timeoutMs: a, callback: l } = i, u = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((c, f) => {
        o?.aborted && f(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), o?.addEventListener("abort", () => {
          f(new Error("Request aborted"));
        });
        let d;
        a && (d = setTimeout(() => {
          f(
            new Error(
              `requestMany: Request timed out after ${a}ms for ${n}`
            )
          );
        }, a));
        const g = s.listenOn(u, {
          callback: (m, p) => {
            if (m !== void 0 && l?.(m), p.finished)
              return clearTimeout(d), c(g);
          },
          signal: o
        });
        return s.postOn(n, r, { reply: u, signal: o }), g;
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
    const r = [], i = {
      resolve: void 0
    }, o = async (a) => {
      if (t?.aborted)
        return;
      const l = await n?.(a), u = S(l) ? l : a;
      r.push(u), i.resolve?.();
    };
    return t?.addEventListener("abort", () => {
      e.off(s, o);
    }), e.on(s, o), {
      [Symbol.asyncIterator]: async function* () {
        for (; !t?.aborted; )
          r.length > 0 ? yield r.shift() : await new Promise((a) => {
            i.resolve = a;
          });
      }
    };
  }
});
export {
  re as Channel,
  ce as EmitterChannel,
  ie as MessageBus,
  L as isError,
  N as isErrorMsg,
  j as isMsg,
  k as isValue,
  oe as isValueOrError,
  ae as parseSubject
};

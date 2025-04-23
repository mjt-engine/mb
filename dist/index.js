const K = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, P = (e) => "value" in e && e.value !== void 0, R = (e) => "error" in e && e.error !== void 0, W = (e) => P(e) || R(e), v = (e) => {
  const t = e;
  return typeof t == "object" && t !== null && "data" in t;
}, C = (e) => {
  const t = e;
  return v(e) && t.meta?.hasError || !1;
}, U = (e) => typeof e == "function", M = (e) => e == null || Number.isNaN(e), x = (e) => !M(e), B = (e) => U(e) ? e() : e, N = (e, t = {}) => {
  const { quiet: r = !1, def: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (c) {
    return r || (console.error(c), x(s) && console.log(B(s))), n;
  }
}, A = {
  isDefined: x,
  isUndefined: M,
  safe: N
}, { isDefined: h, isUndefined: J, safe: T } = A, V = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: c = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !c(t.timestamp) || t.extra && !s(t.extra));
}, F = (e) => (t) => {
  for (const r of e)
    if (V(r)(t))
      return !0;
  return !1;
}, Q = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance
} = {}) => {
  const n = {
    start: (s, ...c) => {
      n.addLog({ traceId: s, message: "start", extra: c });
    },
    addLog: ({ traceId: s, message: c, timestamp: u = r.now(), extra: l = [] }) => {
      F(e)({
        traceId: s,
        message: c,
        timestamp: u,
        extra: l
      }) && t(`${u} ${s}: ${c}`, ...l);
    },
    end: (s, ...c) => {
      n.addLog({ traceId: s, message: "end", extra: c });
    }
  };
  return n;
}, k = (e = "", t = Q()) => {
  t.start(e);
  const r = {
    span: (n) => k(`${e}.${n}`, t),
    end: () => (t.end(e), r),
    log: (n, ...s) => (t.addLog({ traceId: e, message: n, extra: s }), r)
  };
  return r;
}, $ = (e) => {
  const { message: t, stack: r, extra: n, cause: s } = e, c = s ? `
Caused by: ${$(s)}` : "", u = n ? `
Extra: ${JSON.stringify(n, void 0, 2)}` : "";
  return [t, r].filter(h).join(`
`) + u + c;
}, S = (e) => typeof e == "string" ? e : e instanceof Response ? `${e.url} ${e.status} ${e.statusText}` : typeof e == "object" && e !== null && "message" in e ? $(e) : T(() => JSON.stringify(e, void 0, 2)) ?? "", z = async (e) => {
  if (typeof e == "string")
    return e;
  if (e instanceof Response) {
    const t = await e.text();
    return `${e.url} ${e.status} ${e.statusText} ${t}`;
  }
  return typeof e == "object" && e !== null && "message" in e ? $(e) : T(() => JSON.stringify(e, void 0, 2)) ?? "";
}, O = ({ error: e, extra: t, stack: r }) => {
  if (e instanceof Error) {
    const n = h(e.cause) ? O({ error: e.cause }) : void 0;
    return {
      message: e.message,
      stack: e.stack ?? r,
      extra: t,
      cause: n
    };
  }
  return {
    message: S(e),
    stack: r,
    extra: t
  };
}, G = {
  errorToErrorDetail: O,
  errorToText: S,
  errorToTextAsync: z
}, D = () => ({
  msgPackToObject: (e) => e,
  toMsgPack: (e) => e
}), w = D(), q = async ({
  channel: e,
  subject: t,
  connectionListener: r,
  options: n = {}
}) => {
  const { log: s = () => {
  }, signal: c } = n;
  s("connectConnectionListenerToSubject: subject: ", t);
  for await (const u of e.listenOn(t, {
    callback: async (l) => {
      const a = w.msgPackToObject(l), { data: d, meta: o } = a;
      if (C(a))
        throw console.error("Error in message: ", a), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${a?.data?.message}`
        );
      try {
        const i = await r(d, {
          headers: o?.headers,
          signal: c
        });
        return w.toMsgPack({
          data: i
        });
      } catch (i) {
        const f = G.errorToErrorDetail({ error: i });
        return w.toMsgPack({
          data: f,
          meta: {
            hasError: !0,
            code: 500,
            status: f.message
          }
        });
      }
    }
  }))
    ;
}, m = D(), X = async ({
  channel: e,
  subscribers: t = {},
  options: r = {},
  obs: n = k()
}) => {
  const s = n.span("MessageBus"), { defaultTimeoutMs: c = 60 * 1e3, signal: u } = r, l = Object.entries(t);
  s.log("connect: subscribers: ", l);
  for (const [a, d] of l)
    J(d) || q({
      channel: e,
      subject: a,
      connectionListener: d,
      options: r
    });
  return {
    requestMany: async (a, d, o = {}) => {
      const i = s.span("requestMany"), { timeoutMs: f = 60 * 1e3, headers: g, callback: y } = o, p = m.toMsgPack({
        data: d,
        meta: { headers: g }
      }), b = i.span("channel requestMany").log("start requestMany", a), I = await e.requestMany(
        a,
        p,
        {
          timeoutMs: f
        }
      );
      for await (const j of I) {
        if (u?.aborted)
          return;
        const L = m.msgPackToObject(j);
        await y?.(L);
      }
      b.end(), i.end();
    },
    request: async (a, d, o = {}) => {
      const i = s.span("request").log("subject", a), { timeoutMs: f = c, headers: g } = o, y = m.toMsgPack({
        data: d,
        meta: { headers: g }
      }), p = i.span("channel request").log("requestData", y), b = await e.request(a, y, {
        timeoutMs: f
      });
      return p.end(), i.end(), m.msgPackToObject(b);
    },
    publish: async (a, d, o = {}) => {
      const { headers: i } = o, f = m.toMsgPack({
        data: d,
        meta: { headers: i }
      });
      return s.span("publish").log("subject", a), e.postOn(a, f);
    },
    subscribe: async (a, d, o = {}) => (s.span("subscribe").log("subject", a), q({
      channel: e,
      subject: a,
      connectionListener: d,
      options: o
    }))
  };
}, H = ({
  posterProducer: e,
  listenerProducer: t
}) => {
  const r = {
    postOn: (n, s, c = {}) => {
      const { signal: u, reply: l } = c;
      e(u)(n)({ subject: n, data: s, reply: l });
    },
    listenOn: function(n, s = {}) {
      const { signal: c, once: u, callback: l } = s, a = new AbortController();
      if (c?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${n}`);
      c?.addEventListener("abort", () => {
        a.abort();
      });
      const d = t(a.signal)(n)(
        async (o) => {
          if (o.subject === n) {
            u && a.abort();
            const i = await l?.(o.data, {
              finished: o.finished ?? !1
            });
            if (o.reply && i && (E(i) ? (async () => {
              for await (const f of i)
                e(a.signal)(o.reply)({
                  subject: o.reply,
                  data: f
                });
              e(a.signal)(o.reply)({
                subject: o.reply,
                data: void 0,
                finished: !0
              });
            })() : e(a.signal)(o.reply)({
              subject: o.reply,
              data: i,
              finished: !0
            })), i && !E(i))
              return { ...o, data: i };
          }
          return o;
        }
      );
      return async function* () {
        for await (const o of d)
          yield o.data;
      }();
    },
    request: async (n, s, c = {}) => {
      const { signal: u, timeoutMs: l } = c, a = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((d, o) => {
        u?.aborted && o(
          new Error(`request: Signal is already aborted for ${n}`)
        ), u?.addEventListener("abort", () => {
          o(new Error("Request aborted"));
        });
        let i;
        l && (i = setTimeout(() => {
          o(
            new Error(
              `request: Request timed out after ${l}ms for ${n}`
            )
          );
        }, l)), r.listenOn(a, {
          callback: (f) => {
            clearTimeout(i), d(f);
          },
          signal: u,
          once: !0
        }), r.postOn(n, s, { reply: a, signal: u });
      });
    },
    requestMany: async (n, s, c = {}) => {
      const { signal: u, timeoutMs: l, callback: a } = c, d = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((o, i) => {
        u?.aborted && i(
          new Error(`requestMany: Signal is already aborted for ${n}`)
        ), u?.addEventListener("abort", () => {
          i(new Error("Request aborted"));
        });
        let f;
        l && (f = setTimeout(() => {
          i(
            new Error(
              `requestMany: Request timed out after ${l}ms for ${n}`
            )
          );
        }, l));
        const g = r.listenOn(d, {
          callback: (y, p) => {
            if (y !== void 0 && a?.(y), p.finished)
              return clearTimeout(f), o(g);
          },
          signal: u
        });
        return r.postOn(n, s, { reply: d, signal: u }), g;
      });
    }
  };
  return r;
};
function E(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const Y = (e) => H({
  posterProducer: (t) => (r) => (n) => {
    t?.aborted || e.emit(r, n);
  },
  listenerProducer: (t) => (r) => (n) => {
    const s = [], c = {
      resolve: void 0
    }, u = async (l) => {
      if (t?.aborted)
        return;
      const a = await n?.(l), d = h(a) ? a : l;
      s.push(d), c.resolve?.();
    };
    return t?.addEventListener("abort", () => {
      e.off(r, u);
    }), e.on(r, u), {
      [Symbol.asyncIterator]: async function* () {
        for (; !t?.aborted; )
          s.length > 0 ? yield s.shift() : await new Promise((l) => {
            c.resolve = l;
          });
      }
    };
  }
});
export {
  H as Channel,
  Y as EmitterChannel,
  X as MessageBus,
  R as isError,
  C as isErrorMsg,
  v as isMsg,
  P as isValue,
  W as isValueOrError,
  K as parseSubject
};

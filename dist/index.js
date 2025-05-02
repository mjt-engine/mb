import { isUndefined as S, isDefined as $ } from "@mjt-engine/object";
import { Observe as O } from "@mjt-engine/observe";
import { Errors as v } from "@mjt-engine/error";
const j = (e) => {
  const c = e.split("."), l = c.shift(), u = c.join(".");
  return {
    root: l,
    segments: c,
    subpath: u
  };
}, D = (e) => "value" in e && e.value !== void 0, z = (e) => "error" in e && e.error !== void 0, P = (e) => D(e) || z(e), T = (e) => {
  const c = e;
  return typeof c == "object" && c !== null && "data" in c;
}, C = (e) => {
  const c = e;
  return T(e) && c.meta?.hasError || !1;
}, w = async ({
  channel: e,
  subject: c,
  connectionListener: l,
  serializer: u,
  options: s = {}
}) => {
  const { log: f = () => {
  }, signal: p } = s;
  f("connectConnectionListenerToSubject: subject: ", c);
  for await (const i of e.listenOn(c, {
    callback: async (a) => {
      const t = u.deserialize(a), { data: r, meta: d } = t;
      if (C(t))
        throw console.error("Error in message: ", t), new Error(
          `connectConnectionListenerToSubject: Unexpected error in request message: ${t?.data?.message}`
        );
      try {
        const n = await l(r, {
          headers: d?.headers,
          signal: p
        });
        return u.serialize({
          data: n
        });
      } catch (n) {
        const o = v.errorToErrorDetail({ error: n });
        return u.serialize({
          data: o,
          meta: {
            hasError: !0,
            code: 500,
            status: o.message
          }
        });
      }
    }
  }))
    ;
}, I = () => ({
  serialize: (e) => e,
  deserialize: (e) => e
}), x = async ({
  channel: e,
  subscribers: c = {},
  options: l = {},
  obs: u = O()
}) => {
  const s = u.span("MessageBus"), {
    defaultTimeoutMs: f = 60 * 1e3,
    signal: p,
    serializer: i = I()
  } = l, a = Object.entries(c);
  s.log("connect: subscribers: ", a);
  for (const [t, r] of a)
    S(r) || w({
      serializer: i,
      channel: e,
      subject: t,
      connectionListener: r,
      options: l
    });
  return {
    requestMany: async (t, r, d = {}) => {
      const n = s.span("requestMany"), { timeoutMs: o = 60 * 1e3, headers: y, callback: b } = d, m = i.serialize({
        data: r,
        meta: { headers: y }
      }), h = n.span("channel requestMany").log("start requestMany", t), g = await e.requestMany(
        t,
        m,
        {
          timeoutMs: o
        }
      );
      for await (const M of g) {
        if (p?.aborted)
          return;
        const E = i.deserialize(M);
        await b?.(E);
      }
      h.end(), n.end();
    },
    request: async (t, r, d = {}) => {
      const n = s.span("request").log("subject", t), { timeoutMs: o = f, headers: y } = d, b = i.serialize({
        data: r,
        meta: { headers: y }
      }), m = n.span(`channel:request:${t}`), h = await e.request(t, b, {
        timeoutMs: o
      });
      return m.end(), n.end(), i.deserialize(h);
    },
    publish: async (t, r, d = {}) => {
      const { headers: n } = d, o = i.serialize({
        data: r,
        meta: { headers: n }
      });
      return s.span("publish").log("subject", t), e.postOn(t, o);
    },
    subscribe: async (t, r, d = {}) => (s.span("subscribe").log("subject", t), w({
      channel: e,
      serializer: i,
      subject: t,
      connectionListener: r,
      options: d
    }))
  };
}, L = ({
  posterProducer: e,
  listenerProducer: c,
  obs: l
}) => {
  const u = {
    postOn: (s, f, p = {}) => {
      const i = l.span("postOn"), { signal: a, reply: t } = p;
      e(a)(s)({ subject: s, data: f, reply: t }), i.end();
    },
    listenOn: function(s, f = {}) {
      const p = l.span("listenOn"), { signal: i, once: a, callback: t } = f, r = new AbortController();
      if (i?.aborted)
        throw new Error(`listenOn: Signal is already aborted for ${s}`);
      i?.addEventListener("abort", () => {
        r.abort();
      });
      const d = c(r.signal)(s)(
        async (n) => {
          if (n.subject === s) {
            a && r.abort();
            const o = await t?.(n.data, {
              finished: n.finished ?? !1
            });
            if (n.reply && o && (q(o) ? (async () => {
              for await (const y of o)
                e(r.signal)(n.reply)({
                  subject: n.reply,
                  data: y
                });
              e(r.signal)(n.reply)({
                subject: n.reply,
                data: void 0,
                finished: !0
              });
            })() : e(r.signal)(n.reply)({
              subject: n.reply,
              data: o,
              finished: !0
            })), o && !q(o))
              return { ...n, data: o };
          }
          return n;
        }
      );
      return p.end(), async function* () {
        for await (const n of d)
          yield n.data;
      }();
    },
    request: async (s, f, p = {}) => {
      const i = l.span(`request:${s}`), { signal: a, timeoutMs: t } = p, r = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((d, n) => {
        a?.aborted && n(
          new Error(`request: Signal is already aborted for ${s}`)
        ), a?.addEventListener("abort", () => {
          n(new Error("Request aborted"));
        });
        let o;
        t && (o = setTimeout(() => {
          n(
            new Error(
              `request: Request timed out after ${t}ms for ${s}`
            )
          );
        }, t)), u.listenOn(r, {
          callback: (y) => {
            clearTimeout(o), i.end(), d(y);
          },
          signal: a,
          once: !0
        }), u.postOn(s, f, { reply: r, signal: a });
      });
    },
    requestMany: async (s, f, p = {}) => {
      const i = l.span(`requestMany:${s}`), { signal: a, timeoutMs: t, callback: r } = p, d = `response-${Date.now()}-${crypto.randomUUID()}`;
      return new Promise((n, o) => {
        a?.aborted && o(
          new Error(`requestMany: Signal is already aborted for ${s}`)
        ), a?.addEventListener("abort", () => {
          o(new Error("Request aborted"));
        });
        let y;
        t && (y = setTimeout(() => {
          o(
            new Error(
              `requestMany: Request timed out after ${t}ms for ${s}`
            )
          );
        }, t));
        const b = u.listenOn(d, {
          callback: (m, h) => {
            if (m !== void 0 && r?.(m), h.finished)
              return clearTimeout(y), i.end(), n(b);
          },
          signal: a
        });
        return u.postOn(s, f, { reply: d, signal: a }), b;
      });
    }
  };
  return u;
};
function q(e) {
  return e != null && typeof e[Symbol.asyncIterator] == "function";
}
const A = (e, c) => L({
  obs: c,
  posterProducer: (l) => (u) => (s) => {
    l?.aborted || e.emit(u, s);
  },
  listenerProducer: (l) => (u) => (s) => {
    const f = [], p = {
      resolve: void 0
    }, i = async (a) => {
      if (l?.aborted)
        return;
      const t = await s?.(a), r = $(t) ? t : a;
      f.push(r), p.resolve?.();
    };
    return l?.addEventListener("abort", () => {
      e.off(u, i);
    }), e.on(u, i), {
      [Symbol.asyncIterator]: async function* () {
        for (; !l?.aborted; )
          f.length > 0 ? yield f.shift() : await new Promise((a) => {
            p.resolve = a;
          });
      }
    };
  }
});
export {
  L as Channel,
  A as EmitterChannel,
  x as MessageBus,
  z as isError,
  C as isErrorMsg,
  T as isMsg,
  D as isValue,
  P as isValueOrError,
  j as parseSubject
};

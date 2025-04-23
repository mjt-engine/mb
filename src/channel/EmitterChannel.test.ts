import { describe, expect, test } from "vitest";
import { EmitterChannel } from "./EmitterChannel";
import { EventEmitter } from "node:events";

// test("regex listen/post", async () => {
//   const elc = EmitterChannel<string>(new EventEmitter());
//   const result = await new Promise((resolve) => {
//     elc.listenOn(/t.*/, {
//       callback: (data) => {
//         resolve("got:" + data);
//       },
//     });
//     elc.postOn("test", "Hello, world!");
//   });
//   expect(result).toBe("got:Hello, world!");
// });

describe("EventEmmitterChannel", () => {
  test("nothing", async () => {});
  test("listen/post", async () => {
    const elc = EmitterChannel<string>(new EventEmitter());
    const result = await new Promise((resolve) => {
      elc.listenOn("test", {
        callback: (data) => {
          resolve("got:" + data);
        },
      });
      elc.postOn("test", "Hello, world!");
    });
    expect(result).toBe("got:Hello, world!");
  });
  test("async itr listen/post", async () => {
    const elc = EmitterChannel<string>(new EventEmitter());
    const promise = new Promise(async (resolve) => {
      for await (const data of elc.listenOn("test", {
        callback: (d, meta) => {
          return `transformed:` + d;
        },
      })) {
        if (data === "3") {
          resolve("got:" + data);
        }
        if (data === "transformed:3") {
          resolve("got:" + data);
        }
      }
    });
    elc.postOn("test", "1");
    elc.postOn("test", "2");
    elc.postOn("test", "3");
    expect(await promise).toBe("got:transformed:3");
  });
  test("req/rep", async () => {
    const elc = EmitterChannel<string>(new EventEmitter());
    elc.listenOn("test", {
      callback: (data) => {
        return `Hello, ${data}`;
      },
    });
    const resp = await elc.request("test", "123");
    expect(resp).toBe("Hello, 123");
  });
  test("req/rep many", async () => {
    const elc = EmitterChannel<string>(new EventEmitter());
    elc.listenOn("test", {
      callback: async function* (data) {
        yield `${data} 1`;
        yield `${data} 2`;
        yield `${data} 3`;
      },
    });
    const results: string[] = [];
    await elc.requestMany("test", "123", {
      callback: (data) => {
        results.push(data);
      },
    });
    expect(results).toEqual(["123 1", "123 2", "123 3"]);
  });
  test("req/rep many on non-iter", async () => {
    const elc = EmitterChannel<string>(new EventEmitter());
    elc.listenOn("test", {
      callback: (data) => {
        return `${data} 1`;
      },
    });
    const results: string[] = [];
    await elc.requestMany("test", "123", {
      callback: (data) => {
        console.log("callback", data);
        results.push(data);
      },
    });
    expect(results).toEqual(["123 1"]);
  });
});

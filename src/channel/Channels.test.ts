import { describe, expect, test } from "vitest";
import { EventEmitterChannel } from "./EventEmitterChannel";

describe("EventEmmitterChannel", () => {
  test("listen/post", async () => {
    const elc = EventEmitterChannel<string>();
    const result = await new Promise((resolve) => {
      elc.listenOn("test", (data) => {
        resolve(data);
      });
      elc.postOn("test", "Hello, world!");
    });
    expect(result).toBe("Hello, world!");
  });
  test("regex listen/post", async () => {
    const elc = EventEmitterChannel<string>();
    const result = await new Promise((resolve) => {
      elc.listenOn(/t.*/, (data) => {
        resolve(data);
      });
      elc.postOn("test", "Hello, world!");
    });
    expect(result).toBe("Hello, world!");
  });
  test("async listen/post", async () => {
    const elc = EventEmitterChannel<string>();
    const promise = new Promise(async (resolve) => {
      for await (const data of elc.listenOn("test")()) {
        if (data === "2") {
          resolve(data);
        }
      }
    });
    elc.postOn("test", "1");
    elc.postOn("test", "2");
    elc.postOn("test", "3");
    expect(await promise).toBe("2");
  });
  test("req/rep", async () => {
    const elc = EventEmitterChannel<string>();
    elc.listenOn("test", (data) => {
      return `Hello, ${data}`;
    });
    const resp = await elc.request("test", "123");
    expect(resp).toBe("Hello, 123");
  });
  test("req/rep many", async () => {
    const elc = EventEmitterChannel<string>();
    elc.listenOn("test", async function* (data) {
      yield `${data} 1`;
      yield `${data} 2`;
      yield `${data} 3`;
    });
    const results: string[] = [];
    await elc.requestMany({
      operation: "test",
      request: "123",
      callback: (data) => {
        results.push(data);
      },
    });
    expect(results).toEqual(["123 1", "123 2", "123 3"]);
  });
  test("req/rep many on non-iter", async () => {
    const elc = EventEmitterChannel<string>();
    elc.listenOn("test", (data) => {
      return `${data} 1`;
    });
    const results: string[] = [];
    await elc.requestMany({
      operation: "test",
      request: "123",
      callback: (data) => {
        console.log("callback", data);
        results.push(data);
      },
    });
    expect(results).toEqual(["123 1"]);
  });
});

import { describe, expect, test } from "vitest";
import { EmitterChannel } from "../channel/EmitterChannel";
import { MessageBus } from "./MessageBus";
import EventEmitter from "node:events";

describe("Mbs", () => {
  test("basic pubsub", async () => {
    const expected = "hello world";
    const bus = await MessageBus({
      channel: EmitterChannel(new EventEmitter()),
      options: {
        log: console.log,
      },
      subscribers: {
        test: (request) => {
          return `${request} world`;
        },
      },
    });
    const resp = await bus.request("test", "hello");
    console.log("resp", resp);
    expect(resp.data).toEqual(expected);
  });
  test("subscribe", async () => {
    const expected = "hello world";
    const bus = await MessageBus({
      channel: EmitterChannel(new EventEmitter()),
      options: {
        log: console.log,
      },
    });
    bus.subscribe("test-sub", (request) => {
      return `${request} world`;
    });
    const resp = await bus.request("test-sub", "hello");
    console.log("resp", resp);
    expect(resp.data).toEqual(expected);
  });
});

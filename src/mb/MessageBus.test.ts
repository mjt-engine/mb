import { describe, expect, test } from "vitest";
import { EmitterChannel } from "../channel/EmitterChannel";
import { MessageBus } from "./MessageBus";
import EventEmitter from "node:events";
import { Observe, ObserveAgent } from "@mjt-engine/observe";

describe("Mbs", () => {
  let timeStep = 0;
  const obs = Observe(
    "test",
    ObserveAgent({
      // logMatchers: [".*channel"],
      // logMatchers: [".*"],
      clock: { now: () => timeStep++ },
    })
  );
  test("basic pubsub", async () => {
    const expected = "hello world";

    const bus = await MessageBus({
      obs,
      channel: EmitterChannel(new EventEmitter()),
      subscribers: {
        test: (request) => {
          return `${request} world`;
        },
      },
    });
    const resp = await bus.request("test", "hello");
    expect(resp.data).toEqual(expected);
  });
  test("subscribe", async () => {
    const expected = "hello world";
    const bus = await MessageBus({
      obs,
      channel: EmitterChannel(new EventEmitter()),
    });
    bus.subscribe("test-sub", (request) => {
      return `${request} world`;
    });
    const resp = await bus.request("test-sub", "hello");
    expect(resp.data).toEqual(expected);
  });
});

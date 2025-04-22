import { describe, expect, test } from "vitest";
import { EmitterChannel } from "../channel/EmitterChannel";
import { MessageBus } from "./MessageBus";
import EventEmitter from "node:events";

describe("Mbs", () => {
  test("basic pubsub", async () => {
    const expected = "hello world";
    const connection = await MessageBus({
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
    const resp = await connection.request("test", "hello");
    console.log("resp", resp);
    expect(resp.data).toEqual(expected);
  });
});

import { describe, expect, test } from "vitest";
import { EmitterChannel } from "../channel/EmitterChannel";
import { connect } from "./connect";
import EventEmitter from "node:events";

describe("Mqs", () => {
  test("basic pubsub", async () => {
    const expected = "hello world";
    const connection = await connect({
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
    const resp = await connection.request({
      subject: "test",
      request: "hello",
    });
    console.log("resp", resp);
    expect(resp.data).toEqual(expected);
  });
});

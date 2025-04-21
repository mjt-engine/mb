import { describe, expect, test } from "vitest";
import { EventEmitterChannel } from "../channel/EventEmitterChannel";
import { connect } from "./connect";

describe("Mqs", () => {
  test("basic pubsub", async () => {
    const expected = "hello world";
    const connection = await connect({
      channel: EventEmitterChannel(),
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
    expect(resp).toEqual(expected);
  });
});

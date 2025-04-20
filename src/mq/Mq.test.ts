import { describe, expect, test } from "vitest";
import { EventEmitterChannel } from "../channel/EventEmitterChannel";
import { TsMqRuntime } from "./TsMqRuntime";
import { connect } from "./connect";

describe("Mqs", () => {
  test("basic pubsub", async () => {
    // console.log("--------------------------------------------");
    // const expected = "hello world";
    // const connection = await connect({
    //   runtime: TsMqRuntime(EventEmitterChannel()),
    //   options: {
    //     log: console.log,
    //   },
    //   subscribers: {
    //     test: ({ detail, send }) => {
    //       // send(`${detail} world`);
    //       return `${detail} world`;
    //     },
    //   },
    // });
    // console.log("--------------------------------------------");
    // const resp = await connection.request({
    //   subject: "test",
    //   request: "hello",
    // });
    // expect(resp).toEqual(expected);
  });
});

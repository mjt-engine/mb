import { describe, test } from "vitest";
import { EventEmitterChannel } from "../channel/EventEmitterChannel";
import { TsMqRuntime } from "./TsMqRuntime";
import { connect } from "./connect";

describe("Mqs", () => {
  test("basic pubsub", async () => {
    console.log("--------------------------------------------");
    const connection = await connect({
      runtime: TsMqRuntime(EventEmitterChannel()),
      options: {
        log: console.log,
      },
      subscribers: {
        test: ({ detail, send}) => {
          // console.log("!!!!!!!!!!!!Received message:", msg);
          // return "Yes 123";
          send("Yes 123");
        },
      },
    });
    // connection.publish({
    //   subject: "test",
    //   payload: "hello world",
    //   // data: "hello world",
    // });
    console.log("--------------------------------------------");
    const resp = await connection.request({
      subject: "test",
      request: "hello world",
    });
    console.log("!!!!!Response:", resp);
    // const runtime = TsMqRuntime();
    // const sub = runtime.subscribe("test");
    // for await (const msg of sub) {
    //   console.log("Received message:", msg);
    //   expect(msg.subject).toEqual("test");
    // }
    // console.log("Subscription ended");
  });
});

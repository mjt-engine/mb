import { describe, expect, test } from "vitest";
import { Mqs } from "./Mq";

describe("Mqs", async () => {
  const client = await Mqs.connect({
    runtime: {} as any,
  });

  test("should return an object", () => {
    expect(client).toBeDefined();
  });
});

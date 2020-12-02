import { mockUuid } from "../src";
import { validate } from "uuid";

describe("Mock UUID tests", () => {
  test("Render valid uuids", () => {
    let errorCount = 0;
    for (let i = 0; i < 1e3; i++) {
      errorCount += validate(mockUuid.get(i)) ? 0 : 1;
    }
    expect(errorCount).toBe(0);
  });

  test("All variants of settings render valid uuids", () => {
    let errorCount = 0;
    for (let seed = 0; seed < 1e4; seed += 1e3) {
      for (let version = 2; version < 5; version++) {
        for (let variant = 1; variant < 4; variant++) {
          errorCount += validate(mockUuid.get(1, seed, version, variant))
            ? 0
            : 1;
        }
      }
    }
    expect(errorCount).toBe(0);
  });

  test("MockUUID.get throws expected errors", () => {
    expect(() => mockUuid.get(1, 1, 1)).toThrow(Error);
    try {
      mockUuid.get(1, 6, 1);
    } catch (e) {
      expect(e.message).toContain("Version");
    }
    expect(() => mockUuid.get(1, 1, 2, -1)).toThrow(Error);
    try {
      mockUuid.get(1, 1, 2, 5);
    } catch (e) {
      expect(e.message).toContain("Variant");
    }
  });

  test("MockUUID.getGenerator render valid uuids", () => {
    let errorCount = 0;
    const generator = mockUuid.getGenerator();
    for (let i = 0; i < 1e3; i++) {
      errorCount += validate(generator(i)) ? 0 : 1;
    }
    expect(errorCount).toBe(0);
  });

  test("MockUUID.getIncrementalGenerator is consistent", () => {
    let errorCount = 0;
    const generator1 = mockUuid.getIncrementalGenerator();
    const generator2 = mockUuid.getIncrementalGenerator();
    for (let i = 0; i < 1e3; i++) {
      errorCount += generator1() === generator2() ? 0 : 1;
    }
    expect(errorCount).toBe(0);
  });

  test("MockUUID.getIncrementalGenerator incremention make unique uuids", () => {
    const generator = mockUuid.getIncrementalGenerator();
    expect(generator() === generator()).toBeFalsy();
  });
});

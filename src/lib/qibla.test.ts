import { describe, expect, it } from "vitest";
import { angleDiff, magneticToTrue, qiblaBearing } from "./qibla";

describe("qibla bearing (Kaaba 21.4225, 39.8262)", () => {
  it("London is about 119°", () => expect(qiblaBearing(51.5074, -0.1278)).toBeCloseTo(119, 0));
  it("New York is about 58°", () => expect(qiblaBearing(40.7128, -74.006)).toBeCloseTo(58.5, 0));
  it("Jakarta (southern hemisphere) is about 295°", () => expect(qiblaBearing(-6.2088, 106.8456)).toBeCloseTo(295, 0));
  it("Addis Ababa rounds to 5°", () => expect(Math.round(qiblaBearing(9.03, 38.74))).toBe(5));
});

describe("heading maths", () => {
  it("wraps the difference across north", () => expect(angleDiff(350, 10)).toBe(20));
  it("turn left is negative", () => expect(angleDiff(10, 350)).toBe(-20));
  it("adds east declination and wraps to 0-360", () => expect(magneticToTrue(359, 2.2)).toBeCloseTo(1.2, 5));
});

import { describe, it, expect } from "vitest";
import { validateApplication } from "./application";

describe("validateApplication", () => {
  it("accepts a valid application and normalises email to lowercase", () => {
    const result = validateApplication({
      name: "  Ada Lovelace  ",
      email: "  ADA@Example.COM ",
      phone: "+201012345678",
      interests: ["AI & Machine Learning"],
      motivation: "I want to build things.",
      heardFrom: "friend",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Ada Lovelace");
      expect(result.value.email).toBe("ada@example.com");
      expect(result.value.interests).toEqual(["AI & Machine Learning"]);
      expect(result.value.motivation).toBe("I want to build things.");
      expect(result.value.heardFrom).toBe("friend");
    }
  });

  it("folds customInterest into interests", () => {
    const result = validateApplication({
      name: "Ada",
      email: "ada@example.com",
      phone: "+201012345678",
      interests: ["Cloud & DevOps"],
      customInterest: "Robotics",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.interests).toContain("Robotics");
      expect(result.value.interests).toContain("Cloud & DevOps");
    }
  });

  it("rejects missing name", () => {
    const result = validateApplication({
      name: "   ",
      email: "ada@example.com",
      phone: "+201012345678",
      interests: ["Cloud"],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeTruthy();
  });

  it("rejects malformed email", () => {
    const result = validateApplication({
      name: "Ada",
      email: "not-an-email",
      phone: "+201012345678",
      interests: ["Cloud"],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeTruthy();
  });

  it("rejects an application with no interests and no custom interest", () => {
    const result = validateApplication({
      name: "Ada",
      email: "ada@example.com",
      phone: "+201012345678",
      interests: [],
      customInterest: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.interests).toBeTruthy();
  });

  it("rejects a name over 120 characters", () => {
    const result = validateApplication({
      name: "a".repeat(121),
      email: "ada@example.com",
      phone: "+201012345678",
      interests: ["Cloud"],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeTruthy();
  });

  it("rejects a motivation over 3000 characters", () => {
    const result = validateApplication({
      name: "Ada",
      email: "ada@example.com",
      phone: "+201012345678",
      interests: ["Cloud"],
      motivation: "x".repeat(3001),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.motivation).toBeTruthy();
  });

  it("coerces non-string inputs to empty strings instead of throwing", () => {
    const result = validateApplication({
      name: 123,
      email: null,
      interests: "not-an-array",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.interests).toBeTruthy();
    }
  });
});

describe("phone and configurable recruitment answers", () => {
  it("accepts international phone formatting and retains the submitted value", () => {
    const result = validateApplication({
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+20 (10) 1234-5678",
      interests: ["AI & Machine Learning"],
      answers: { "550e8400-e29b-41d4-a716-446655440000": "I build learning tools." },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.phone).toBe("+20 (10) 1234-5678");
      expect(result.value.answers["550e8400-e29b-41d4-a716-446655440000"]).toBe("I build learning tools.");
    }
  });

  it("rejects missing and malformed phone numbers", () => {
    const missing = validateApplication({ name: "Ada", email: "ada@example.com", interests: ["Cloud"] });
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.errors.phone).toBeTruthy();

    const malformed = validateApplication({ name: "Ada", email: "ada@example.com", phone: "call-me-maybe", interests: ["Cloud"] });
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.errors.phone).toBeTruthy();
  });

  it("drops malformed answer IDs and limits answer length", () => {
    const result = validateApplication({
      name: "Ada",
      email: "ada@example.com",
      phone: "+201012345678",
      interests: ["Cloud"],
      answers: {
        "550e8400-e29b-41d4-a716-446655440000": "A".repeat(2500),
        "not-a-uuid": "should not be saved",
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.answers["550e8400-e29b-41d4-a716-446655440000"]).toHaveLength(2000);
      expect(result.value.answers).not.toHaveProperty("not-a-uuid");
    }
  });
});

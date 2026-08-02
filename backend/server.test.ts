import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, generateToken } from "./server.ts";

describe("Backend Auth Security Suite", () => {
  it("should generate valid salt:hash format when hashing password", () => {
    const hashed = hashPassword("testSecret123");
    assert.ok(hashed.includes(":"));
    const parts = hashed.split(":");
    assert.equal(parts.length, 2);
    assert.equal(parts[0].length, 32); // 16 bytes hex salt
    assert.equal(parts[1].length, 128); // 64 bytes hex hash
  });

  it("should correctly verify matching password", () => {
    const raw = "mySecurePassword!9";
    const hashed = hashPassword(raw);
    assert.equal(verifyPassword(raw, hashed), true);
  });

  it("should reject incorrect password", () => {
    const raw = "correctPassword";
    const hashed = hashPassword(raw);
    assert.equal(verifyPassword("wrongPassword", hashed), false);
  });

  it("should generate 64-character hex session token", () => {
    const token = generateToken();
    assert.equal(typeof token, "string");
    assert.equal(token.length, 64); // 32 bytes hex
  });
});

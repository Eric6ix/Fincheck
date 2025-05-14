import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app.js"

const token =""

describe("GET /api/transactions", () => {
  it("Deve retornar status 200 e um array de transações", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

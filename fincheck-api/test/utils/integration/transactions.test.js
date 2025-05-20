import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

let token

beforeAll(async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: "zenkai@gmail.com",
    password: "123123",
  });

   token = response.body.token;
});

describe("GET /api/transactions", () => {
  it("Deve retornar status 200 e um array de transações", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

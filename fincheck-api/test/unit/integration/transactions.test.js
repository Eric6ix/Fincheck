import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app.js"


// Token de teste (pega do Thunder Client ou gera manualmente no login)
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTl2dHJ6bWIwMDAweGFkc3RtcmJvd2NoIiwicm9sZSI6IkRFViIsImlhdCI6MTc0NTcxNjkwNSwiZXhwIjoxNzQ4MzA4OTA1fQ.70IcVlNXN8uLgMYaxCn6hPaqaaFFpCcVz3NCrahBiIg";

describe("GET /api/transactions", () => {
  it("Deve retornar status 200 e um array de transações", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`); // 👈 adicionando o token no header

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

describe("Testes de autenticação", () => {
  it("deve fazer login com sucesso", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "zenkai@gmail.com",
        password: "123123"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});

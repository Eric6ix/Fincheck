import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

let token;

beforeAll(async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "zenkai@gmail.com",
      password: "123123",
    });

  token = response.body.token;
});

describe("Testes de Usuário", () => {
  it("deve retornar informações do usuário logado", async () => {
    const response = await request(app)
      .get("/api/user/") // ajuste aqui conforme sua rota
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });
});

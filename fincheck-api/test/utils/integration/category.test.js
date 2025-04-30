import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";

let token;

beforeAll(async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "zenkai@gmail.com",    // troca pelos dados reais
      password: "123123",      // troca pelos dados reais
    });

  token = response.body.token;  // pega o token certinho

});

describe("Testes de Categorias", () => {
  it("deve listar categorias existentes", async () => {
    const response = await request(app)
      .get("/api/category")       // sua rota
      .set("Authorization", `Bearer ${token}`); // manda o token aqui!

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

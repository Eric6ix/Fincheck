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
  it("deve retornar lista de usuários", async () => {
    const response = await request(app)
      .get("/api/user/") // ajuste conforme sua rota
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); 
    expect(response.body.length).toBeGreaterThan(0); 
    expect(response.body[0]).toHaveProperty("id");    
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("email");
  });
});


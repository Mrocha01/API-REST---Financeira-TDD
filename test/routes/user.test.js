const request = require("supertest");

const app = require("../../src/app.js");

test("Deve listar todos os usuarios", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Deve inserir usuario com sucesso", () => {
  const mail = `${Date.now()}@mail.com`;
  
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", email: mail, passwd:"12345"})
    .then((res) => {
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Walter Mitty");
    });
});

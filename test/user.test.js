const request = require("supertest");

const app = require("../src/app.js");

test("Deve listar todos os usuarios", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty("name", "John Doe");
    });
});

test("Deve inserir usuario com sucesso", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", mail: "walter@mail.com" })
    .then((res) => {
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Walter Mitty");
    });
});

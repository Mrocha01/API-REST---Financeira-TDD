const request = require("supertest");

const app = require("../../src/app.js");

const mail = `${Date.now()}@mail.com`;

test("Deve listar todos os usuarios", () => {
  return request(app)
    .get("/users")
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test("Deve inserir usuario com sucesso", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", email: mail, passwd:"12345"})
    .then((res) => {
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Walter Mitty");
      expect(res.body).not.toHaveProperty("passwd");
    });
});

test("Deve armazenar senha criptografada", async () => {
  const res = await request(app)
  .post("/users")
  .send({ name: "Walter Mitty", email: `${Date.now()}@mail.com`, passwd:"12345"});
  expect(res.status).toBe(201);

  const {id} = res.body;
  const userDB = await app.services.user.findOne({id});
  
  expect(userDB.passwd).not.toBeUndefined();
  expect(userDB.passwd).not.toBe("12345");
});

test("Não deve inserir um usuario sem nome", () => {
  return request(app)
  .post("/users")
  .send({ email: "walter@mail.com", passwd:"12345"})
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Nome é um atributo obrigatório!")
  });
});

test("Não deve inserir um usuario sem email", async () => {
  const result = await request(app)
  .post("/users")
  .send({ name: "Walter Mitty", passwd:"12345"});
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("Email é um atributo obrigatório!");
});

test("Não deve inserir um usuario sem senha", (done) => {
  request(app)
  .post("/users")
  .send({ name: "Walter Mitty", email: "walter@mail.com" })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Senha é um atributo obrigatório!");
    done();
  })
  .catch((err) => {done.fail(err)});
});

test("Não deve inserir um usuario com e-mail existente", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter Mitty", email: mail, passwd:"12345"})
    .then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("E-mail já cadastrado!");
    });
})
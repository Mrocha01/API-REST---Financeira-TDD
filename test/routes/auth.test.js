const request = require("supertest");
const app = require("../../src/app");

test("Deve receber token ao logar", () => {
    const mail = `${Date.now()}@mail.com`;

    return app.services.user
    .save({
         name: "Walter",
         email: mail,
         passwd: "123456"
    })
    .then(() => request(app)
    .post("/auth/signin")
    .send({email: mail, passwd: "123456"}))
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});

test("Não deve autenticar usuario com senha errada", () => {
    const mail = `${Date.now()}@mail.com`;

    return app.services.user
    .save({
         name: "Walter",
         email: mail,
         passwd: "654321"
    })
    .then(() => request(app)
    .post("/auth/signin")
    .send({email: mail, passwd: "123456"}))
    .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Usuario ou senha inválidos!");
    });
});
const request = require("supertest");
const app = require("../../src/app");



test("Deve criar usuario via signup", () => {
    const mail = `${Date.now()}@mail.com`;

    return request(app)
    .post("/auth/signup")
    .send({
         name: "Walter",
         email: mail,
         passwd: "123456"
    })
    .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Walter");
        expect(res.body).toHaveProperty("email");
        expect(res.body).not.toHaveProperty("passwd");
    })
});

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

test("Não deve autenticar usuario inexistente", () => {
    return request(app)
    .post("/auth/signin")
    .send({email: "nãoExiste@gmail.com", passwd: "123456"})
    .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Usuario ou senha inválidos!");
    });
});

test("Não deve acessar uma rota protegida sem token", () => {
    return request(app)
    .get("/users")
    .then((res) => {
        expect(res.status).toBe(401);
    })
});
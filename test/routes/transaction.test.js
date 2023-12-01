const request = require("supertest");
const app = require("../../src/app");
const jwt = require("jwt-simple");

const MAIN_ROUTE = "/v1/transactions";

let user;
let user2;
let accUser;
let accUser2;

beforeAll( async () => {
    await app.db("transactions").del();
    await app.db("accounts").del();
    await app.db("users").del();    
    const users = await app.db("users").insert([
        {name:"User #1", email: "user@mail.com", passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"},
        {name:"User #2", email: "user2@mail.com", passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"},
    ], '*');

    [user, user2] = users;
    delete users.passwd;
    user.token = jwt.encode(user, "Segredo!");

    const accs = await app.db("accounts").insert([
        {name:"Acc #1", user_id: user.id,},
        {name:"Acc #2", user_id: user2.id,},
    ], '*');

    [accUser, accUser2] = accs;
});

test("Deve listar apenas as transações do usuario", () => {
    return app.db("transactions").insert([
        { description: "T1", date: new Date(), amount: 100, type: "I", acc_id: accUser.id},
        { description: "T2", date: new Date(), amount: 300, type: "O", acc_id: accUser2.id},
    ])
    .then(() => 
        request(app)
            .get(MAIN_ROUTE)
                .set("authorization", `bearer ${user.token}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe("T1");
        }));
});

test("Deve inserir uma transação com sucesso", () => {
    return request(app).post(MAIN_ROUTE)
        .set("authorization", `bearer ${user.token}`)
            .send({ description: "New T", date: new Date(), amount: 100, type: "I", acc_id: accUser.id})
    .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body[0].acc_id).toBe(accUser.id);
    });
});

//! Essa versão não me agradou muito, portanto refatorei logo abaixo
// test("Deve retornar uma rota pelo ID", () => {
//     return app.db('transactions')
//     .insert({description: "T ID", date: new Date(), amount: 500, type: "I", acc_id: accUser.id}, ["id"])
//         .then((transf) => // sem chaves {} "retorno implicito" do request(app)
//             request(app)
//                 .get(`${MAIN_ROUTE}/${transf[0].id}`)
//                     .set("authorization", `bearer ${user.token}`)  
//         .then((res) => {
//             expect(res.status).toBe(200);
//             expect(res.body.description).toBe("T ID");
//             expect(res.body.id).toBe(transf[0].id);        
//      }));
// });

//? Código ficou bem mais limpo e facil de ler sem os "thens" aninhados.
test("Deve retornar uma transação pelo ID", async () => {
    const transf = await app.db('transactions').insert({
        description: "T ID",
        date: new Date(),
        amount: 500,
        type: "I",
        acc_id: accUser.id
    }, ["id"]);

    const res = await request(app)
        .get(`${MAIN_ROUTE}/${transf[0].id}`)
        .set("authorization", `bearer ${user.token}`);

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("T ID");
    expect(res.body.id).toBe(transf[0].id);
});

test('Deve alterar uma transação', async () => {
    const transf = await app.db('transactions').insert({
        description: "To update",
        date: new Date(),
        amount: 300,
        type: "I",
        acc_id: accUser.id
    }, ["id"]);

    const res = await request(app)
        .put(`${MAIN_ROUTE}/${transf[0].id}`)
        .set("authorization", `bearer ${user.token}`)
        .send({ description: "Updated D"})

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Updated D");
    expect(res.body.id).toBe(transf[0].id);
});
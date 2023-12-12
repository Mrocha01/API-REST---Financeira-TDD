const request = require("supertest");
const app = require("../../src/app");
const moment = require("moment");

const MAIN_ROUTE = "/v1/balance";
const ROUTE_TRANSACTION = "/v1/transactions";
const ROUTE_TRANSFERS = "/v1/transfers";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMTAwIiwibmFtZSI6IlVzZXIgIzMiLCJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIn0.j_DMRh4L6rQZnFwIV6mdhlbgU7r_R9yLLH2fCetJEkk"

beforeAll(async () => {
    // await app.db.migrate.rollback();
    // await app.db.migrate.latest();
    await app.db.seed.run();
})

describe("Ao calcular o saldo do usuario...", () => {

    test('Deve retornar apenas as contas com alguma transação', () => {
        return request(app)
            .get(MAIN_ROUTE)
                .set("authorization", `bearer ${TOKEN}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
        });
    });

    test('Deve adicionar valores de entrada', () => {
        return request(app)
            .post(ROUTE_TRANSACTION)
                .send({
                    description: "1",
                    date: new Date(),
                    amount: 100, 
                    type: "I", 
                    acc_id: 10100,
                    status: true
                })
                    .set("authorization", `bearer ${TOKEN}`)
    .then(() => {
        return request(app)
            .get(MAIN_ROUTE)
                .set("authorization", `bearer ${TOKEN}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe("100.00");
            });
        });
    });

    // test('Deve subtrair valores de saida', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSACTION)
    //             .send({
    //                 description: "1",
    //                 date: new Date(),
    //                 amount: 200, 
    //                 type: "O", 
    //                 acc_id: 10100,
    //                 status: true
    //                 })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(async() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(1);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("-100.00");
    //         });
    //     });
    // });

    // test('Não deve considerar transações pendentes', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSACTION)
    //             .send({
    //                 description: "1",
    //                 date: new Date(),
    //                 amount: 200, 
    //                 type: "O", 
    //                 acc_id: 10100,
    //                 status: false
    //                 })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(1);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("-100.00");
    //         });
    //     });
    // });

    // test('Não deve considerar saldo de contas distintas', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSACTION)
    //             .send({
    //                 description: "1",
    //                 date: new Date(),
    //                 amount: 50, 
    //                 type: "O", 
    //                 acc_id: 10101,
    //                 status: true
    //                 })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(2);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("-100.00");
    //     expect(res.body[1].id).toBe(10101);
    //     expect(res.body[1].sum).toBe("50.00");
    //         });
    //     });
    // });

    // test('Não deve considerar saldo de contas de outros usuarios', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSACTION)
    //             .send({
    //                 description: "1",
    //                 date: new Date(),
    //                 amount: 200, 
    //                 type: "O", 
    //                 acc_id: 10102,
    //                 status: true
    //                 })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(2);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("-100.00");
    //     expect(res.body[1].id).toBe(10101);
    //     expect(res.body[1].sum).toBe("50.00");
    //         });
    //     });
    // });

    // test('Deve considerar uma transação passada', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSACTION)
    //             .send({
    //                 description: "1",
    //                 date: moment().subtract({days: 5}),
    //                 amount: 250, 
    //                 type: "I", 
    //                 acc_id: 10100,
    //                 status: true
    //                 })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(2);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("150.00");
    //     expect(res.body[1].id).toBe(10101);
    //     expect(res.body[1].sum).toBe("50.00");
    //         });
    //     });
    // });

    // test('Não deve considerar uma transação futura', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSACTION)
    //             .send({
    //             description: "1",
    //             date: moment().add({days: 5}),
    //             amount: 250, 
    //             type: "I", 
    //             acc_id: 10100,
    //             status: true
    //             })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(2);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("150.00");
    //     expect(res.body[1].id).toBe(10101);
    //     expect(res.body[1].sum).toBe("50.00");
    //         });
    //     });
    // });

    // test('Deve considerar transferencias', () => {
    //     return request(app)
    //         .post(ROUTE_TRANSFERS)
    //             .send({
    //                 description: "1",
    //                 date: new Date(),
    //                 amount: 250, 
    //                 acc_ori_id: 10100,
    //                 acc_dest_id: 10101,
    //                 })
    //                 .set("authorization", `bearer ${TOKEN}`)
    // .then(() => {
    //     return request(app)
    //         .get(MAIN_ROUTE)
    //             .set("authorization", `bearer ${TOKEN}`)
    // .then((res) => {
    //     expect(res.status).toBe(200);
    //     expect(res.body).toHaveLength(2);
    //     expect(res.body[0].id).toBe(10100);
    //     expect(res.body[0].sum).toBe("-100.00");
    //     expect(res.body[1].id).toBe(10101);
    //     expect(res.body[1].sum).toBe("200.00");
    //         });
    //     });
    // });
});
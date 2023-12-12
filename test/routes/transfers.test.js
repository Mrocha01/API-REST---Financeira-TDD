const request = require("supertest");
const app = require("../../src/app");

const MAIN_ROUTE = "/v1/transfers";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJVc2VyICMxIiwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSJ9.LSXgfLMIV4ibFB9yEDopTZeTwesVfX0byzos5eiawus"

beforeAll(async () => {
    // await app.db.migrate.rollback();
    // await app.db.migrate.latest();
    await app.db.seed.run();
})

test('Deve listar apenas as transferências do usuario', () => {
    return request(app)
            .get(MAIN_ROUTE)
                .set("authorization", `bearer ${TOKEN}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe("Transfer #1");
        });
});

test('Deve inserir uma transferência com sucesso', () => {
    return request(app).post(MAIN_ROUTE)
    .set("authorization", `bearer ${TOKEN}`)
        .send({ 
            description: "Regular Transfer",
            user_id: 10000, 
             acc_ori_id: 10000, 
             acc_dest_id: 10001, 
             amount: 100, 
             date: new Date()
            })
    .then( async (res) => {
        expect(res.status).toBe(201);
        expect(res.body[0].description).toBe("Regular Transfer");

        const transactions = await app.db('transactions').where({transfer_id: res.body[0].id});

        expect(transactions).toHaveLength(2);
        expect(transactions[0].description).toBe("Transfer to acc # 10001");
        expect(transactions[1].description).toBe("Transfer from acc # 10000");
        expect(transactions[0].amount).toBe("-100.00");
        expect(transactions[1].amount).toBe("100.00");
        expect(transactions[0].acc_id).toBe(10000);
        expect(transactions[1].acc_id).toBe(10001);
        });
});

describe("Ao salvar uma transferencia válida...", () => {
    let transferId;
    let income;
    let outcome;

    test('Deve retornar o status 201 e os dados da transferência', () => {
        return request(app).post(MAIN_ROUTE)
        .set("authorization", `bearer ${TOKEN}`)
            .send({ 
                description: "Regular Transfer",
                user_id: 10000, 
                 acc_ori_id: 10000, 
                 acc_dest_id: 10001, 
                 amount: 100, 
                 date: new Date()
                })
        .then((res) => {
            expect(res.status).toBe(201);
            expect(res.body[0].description).toBe("Regular Transfer");

            transferId = res.body[0].id;
            });
    });

    test('As transações equivalentes devem ter sidos geradas', async () => {
        
        const transactions = await app.db('transactions')
            .where({transfer_id: transferId})
            .orderBy("amount");

        expect(transactions).toHaveLength(2);

        [outcome, income] = transactions;
    });

    test('A transação de saída deve ser negativa', () => {
        expect(outcome.description).toBe("Transfer to acc # 10001");
        expect(outcome.amount).toBe("-100.00");
        expect(outcome.acc_id).toBe(10000);
        expect(outcome.type).toBe("O");
    });

    test('A transação de entrada deve ser positiva', () => {
        expect(income.description).toBe("Transfer from acc # 10000");
        expect(income.amount).toBe("100.00");
        expect(income.acc_id).toBe(10001);
        expect(income.type).toBe("I");
    });

    test('Ambas devem referenciar a transferencia que as originou', () => {
        expect(income.transfer_id).toBe(transferId)
        expect(outcome.transfer_id).toBe(transferId)
    });
});

describe('Ao tentar salvar uma transferencia inválida', () => {

    let validTransfer;

    beforeAll( async () => {
        validTransfer = { 
            description: "Regular Transfer",
            user_id: 10000, 
             acc_ori_id: 10000, 
             acc_dest_id: 10001, 
             amount: 100, 
             date: new Date()
            };
    })

    const testTemplate = (newData, errorMessage) => {
        return request(app).post(MAIN_ROUTE)
        .set("authorization", `bearer ${TOKEN}`)
        .send({...validTransfer, ...newData})
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe(errorMessage)
        })
    };

    test('Não deve inserir sem descrição', () => 
        testTemplate({ description:null}, "A descrição é obrigatória!"));

    test('Não deve inserir sem valor', () => 
        testTemplate({ amount:null}, "O valor é obrigatório!"));

    test('Não deve inserir sem data', () => 
        testTemplate({ date:null}, "A data é obrigatória!"));

    test('Não deve inserir sem conta de origem', () => 
        testTemplate({ acc_ori_id: null}, "A conta de origem ou destino é inválida"));

    test('Não deve inserir sem conta de destino', () => 
        testTemplate({ acc_dest_id: null}, "A conta de origem ou destino é inválida"));

    test('Não deve inserir se as contas de destino e origem forem as mesmas', () => 
        testTemplate({ acc_dest_id: 10000 }, "A conta de origem ou destino é inválida")
    );

    test('Não deve inserir se as contas pertencerem a outro usuario', () => 
        testTemplate({ acc_ori_id: 10002}, "Conta #10002 não pertence ao usuario!")
    );
});

test('Deve retornar uma transferencia por ID', () => {
    return request(app)
            .get(`${MAIN_ROUTE}/10000`)
                .set("authorization", `bearer ${TOKEN}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.description).toBe("Transfer #1");
        });
});

describe("Ao alterar uma transferencia válida...", () => {
    let transferId;
    let income;
    let outcome;

    test('Deve retornar o status 200 e os dados da transferência', () => {
        return request(app).put(`${MAIN_ROUTE}/10000`)
        .set("authorization", `bearer ${TOKEN}`)
            .send({ 
                description: "Transfer Updated",
                user_id: 10000, 
                 acc_ori_id: 10000, 
                 acc_dest_id: 10001, 
                 amount: 500, 
                 date: new Date()
                })
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body[0].description).toBe("Transfer Updated");
            expect(res.body[0].amount).toBe("500.00");

            transferId = res.body[0].id;
            });
    });

    test('As transações equivalentes devem ter sidos geradas', async () => {
        
        const transactions = await app.db('transactions')
            .where({transfer_id: transferId})
            .orderBy("amount");

        expect(transactions).toHaveLength(2);

        [outcome, income] = transactions;
    });

    test('A transação de saída deve ser negativa', () => {
        expect(outcome.description).toBe("Transfer to acc # 10001");
        expect(outcome.amount).toBe("-500.00");
        expect(outcome.acc_id).toBe(10000);
        expect(outcome.type).toBe("O");
    });

    test('A transação de entrada deve ser positiva', () => {
        expect(income.description).toBe("Transfer from acc # 10000");
        expect(income.amount).toBe("500.00");
        expect(income.acc_id).toBe(10001);
        expect(income.type).toBe("I");
    });

    test('Ambas devem referenciar a transferencia que as originou', () => {
        expect(income.transfer_id).toBe(transferId)
        expect(outcome.transfer_id).toBe(transferId)
    });
});


describe('Ao tentar alterar uma transferencia inválida', () => {

    let validTransfer;

    beforeAll( async () => {
        validTransfer = { 
            description: "Regular Transfer",
            user_id: 10000, 
             acc_ori_id: 10000, 
             acc_dest_id: 10001, 
             amount: 100, 
             date: new Date()
            };
    })

    const testTemplate = (newData, errorMessage) => {
        return request(app).put(`${MAIN_ROUTE}/10000`)
        .set("authorization", `bearer ${TOKEN}`)
        .send({...validTransfer, ...newData})
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe(errorMessage)
        })
    };

    test('Não deve inserir sem descrição', () => 
        testTemplate({ description:null}, "A descrição é obrigatória!"));

    test('Não deve inserir sem valor', () => 
        testTemplate({ amount:null}, "O valor é obrigatório!"));

    test('Não deve inserir sem data', () => 
        testTemplate({ date:null}, "A data é obrigatória!"));

    test('Não deve inserir sem conta de origem', () => 
        testTemplate({ acc_ori_id: null}, "A conta de origem ou destino é inválida"));

    test('Não deve inserir sem conta de destino', () => 
        testTemplate({ acc_dest_id: null}, "A conta de origem ou destino é inválida"));

    test('Não deve inserir se as contas de destino e origem forem as mesmas', () => 
        testTemplate({ acc_dest_id: 10000 }, "A conta de origem ou destino é inválida")
    );

    test('Não deve inserir se as contas pertencerem a outro usuario', () => 
        testTemplate({ acc_ori_id: 10002}, "Conta #10002 não pertence ao usuario!")
    );

});

describe('Ao remover uma transferencia', () => {

    test('Deve retornar o status 204', () => {
        return request(app).delete(`${MAIN_ROUTE}/10000`)
        .set("authorization", `bearer ${TOKEN}`)
        .then((res) => {
            expect(res.status).toBe(204);
            });
    });

    test('O registro deve ter sido removido do banco', () => {
        return app.db("transfers").where({id:10000})
        .then((res) => {
            expect(res).toHaveLength(0);
        });
    });

    test('As transações associadas devem ter sido removidas do banco', () => {
        return app.db("transactions").where({transfer_id:10000})
        .then((res) => {
            expect(res).toHaveLength(0);
        });
    });
});

test('Não deve retornar transferencia de outro usuário', () => {
    return request(app).get(`${MAIN_ROUTE}/10001`)
    .set("authorization", `bearer ${TOKEN}`)
    .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Este recurso não pertence ao usuário!")
        });
});
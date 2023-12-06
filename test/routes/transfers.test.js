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
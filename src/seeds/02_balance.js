/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = (knex) => {
  return knex('users').insert([
    {id: 10100, name: 'User #3', email: 'user3@example.com', passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"},
    {id: 10101, name: 'User #4', email: 'user4@example.com', passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"}
  ])
  .then(() => knex('accounts').insert([
    {id: 10100, name: "Acc Saldo Principal", user_id: 10100},
    {id: 10101, name: "Acc Saldo Secundario", user_id: 10100},
    {id: 10102, name: "Acc Alternativa 1", user_id: 10101},
    {id: 10103, name: "Acc Alternativa 2", user_id: 10101},
  ]));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const moment = require("moment");

exports.seed = (knex) => {
  return knex('users').insert([
    {id: 10100, name: 'User #3', email: 'user3@example.com', passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"},
    {id: 10101, name: 'User #4', email: 'user4@example.com', passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"},
    {id: 10102, name: 'User #5', email: 'user5@example.com', passwd:"$2b$10$XHQ9iKlafRansEIm9STTaOtYwciVxxyboDrMeFeXwOJPuvjU.rVn2"}

  ])
  .then(() => knex('accounts').insert([
    {id: 10100, name: "Acc Saldo Principal", user_id: 10100},
    {id: 10101, name: "Acc Saldo Secundario", user_id: 10100},
    {id: 10102, name: "Acc Alternativa 1", user_id: 10101},
    {id: 10103, name: "Acc Alternativa 2", user_id: 10101},
    {id: 10104, name: "Acc Geral Principal", user_id: 10102},
    {id: 10105, name: "Acc Geral Secundario", user_id: 10102},
  ]))
  .then(() => knex('transfers').insert([
    { id: 10100, 
      description: "Transfer #1", 
      user_id: 10102, 
      acc_ori_id: 10105,
      acc_dest_id: 10104, 
      amount: 256,
      date: new Date()
      },
      { id: 10101, 
        description: "Transfer #2", 
        user_id: 10101, 
        acc_ori_id: 10102,
        acc_dest_id: 10103, 
        amount: 512,
        date: new Date()
        },
  ]))
  .then(() => knex('transactions').insert([
    // Transação positiva / Saldo = 2;
    {description: '#1', date: new Date(), amount: 2, type: "I", acc_id: 10104, status: true},
    // Transação usuario errado / Saldo = 2;
    {description: '#1', date: new Date(), amount: 4, type: "I", acc_id: 10102, status: true},
    // Transação outra conta  / Saldo = 2 / Saldo = 8
    {description: '#1', date: new Date(), amount: 8, type: "I", acc_id: 10105, status: true},
    // Transação pendente / Saldo = 2 / Saldo = 8
    {description: '#1', date: new Date(), amount: 16, type: "I", acc_id: 10104, status: false},
    // Transação passada / Saldo = 34 / Saldo = 8
    {description: '#1', date: moment().subtract({days: 5}), amount: 32, type: "I", acc_id: 10104, status: true},
    // Transação futura / Saldo = 34 / Saldo = 8
    {description: '#1', date: moment().add({days: 5}), amount: 64, type: "I", acc_id: 10104, status: true},
    // Transação negativa / Saldo = -94 / Saldo = 8
    {description: '#1', date: new Date(), amount: -128, type: "O", acc_id: 10104, status: true},
    // Transferencia / Saldo = 162 / Saldo = 8
    {description: '#1', date: new Date(), amount: 256, type: "I", acc_id: 10104, status: true},
    // Transferencia / Saldo = -162 / Saldo = -248
    {description: '#1', date: new Date(), amount: -256, type: "O", acc_id: 10105, status: true},
    // Transferencia outro usuario
    {description: '#1', date: new Date(), amount: 512, type: "I", acc_id: 10103, status: true},
    {description: '#1', date: new Date(), amount: -512, type: "O", acc_id: 10102, status: true},

  ]));
};

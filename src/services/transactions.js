const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
    const find = (userId, filter = {}) => {
        return app.db("transactions")
            .join("accounts", "accounts.id", "acc_id")
                .where(filter)
                    .andWhere("accounts.user_id", "=", userId)
                        .select();
    };

    const findOne = (id) => {
        return app.db("transactions")
        .where({id})
        .first();
    }

    const save = (transaction) => {
        if(!transaction.description || transaction.description == "") {
            throw new ValidationError("A descrição é obrigatória!");
        }

        if(!transaction.amount || transaction.amount == "") {
            throw new ValidationError("O valor é obrigatório!");
        }

        if(!transaction.date || transaction.date == "") {
            throw new ValidationError("A data é obrigatória!");
        }

        if(!transaction.type || (transaction.type !== "I" && transaction.type !== "O")) {
            throw new ValidationError("O tipo é obrigatório e deve ser válido!");
        }

        if(!transaction.acc_id) {
            throw new ValidationError("Conta inválida ou não localizada!");
        }

        const newTransaction = { ...transaction };

        if((transaction.type === "I" && transaction.amount < 0) ||
        (transaction.type === "O" && transaction.amount > 0)) {
            newTransaction.amount *= -1;
        }
        
        return app.db("transactions")
        .insert(newTransaction, '*');
    };

    const updateOne = (id, transaction) => {
        return app.db('transactions')
        .where({id})
        .update(transaction, '*');
    };

    const deleteOne = (id) => {
        return app.db("transactions")
        .where({id})
        .del();
    };

    return { find, save, findOne, updateOne, deleteOne };
};
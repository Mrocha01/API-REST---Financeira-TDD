const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
  
    const find = (userId) => {
        return app.db('accounts').where({ user_id: userId });
    };

    const findAny = (filter = {}) => {
        return app.db('accounts')
        .where(filter)
        .first();
    }

    const findOne = (id) => {
        return app.db('accounts')
        .where({id})
        .first();
    };

    const save = async (account) => {
        if(!account.name) {
            throw new ValidationError("Nome é um atributo obrigatório!");
        }

        const accountName = await findAny({name: account.name, user_id: account.user_id})

        if(accountName) {
            throw new ValidationError("Já existe uma conta com este nome!");
        }

        return app.db('accounts')
        .insert(account, '*');
    };

    const updateOne = (id, account) => {
        return app.db('accounts')
        .where({id})
        .update(account, '*');
    };

    const deleteOne = async (id) => {
        const transaction = await app.services.transactions.findAny({acc_id: id});

        if(transaction) {
            throw new ValidationError("Essa conta possui transações associadas!")
        }

        return app.db('accounts')
        .where({id})
        .del();
    };

    return { save, find, findOne, updateOne, deleteOne, findAny };
}; 
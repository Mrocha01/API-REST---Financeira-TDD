const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
    const save = async (account) => {
        if(!account.name) {
            throw new ValidationError("Nome é um atributo obrigatório!");
        }

        return app.db('accounts')
        .insert(account, '*');
    };

    const find = (userId) => {
        return app.db('accounts').where({ user_id: userId });
    };

    const findOne = (id) => {
        return app.db('accounts')
        .where({id})
        .first();
    };

    const updateOne = (id, account) => {
        return app.db('accounts')
        .where({id})
        .update(account, '*');
    };

    const deleteOne = (id) => {
        return app.db('accounts')
        .where({id})
        .del();
    };

    return { save, find, findOne, updateOne, deleteOne };
}; 
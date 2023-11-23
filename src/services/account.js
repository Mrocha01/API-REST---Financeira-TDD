const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
    const save = async (account) => {
        if(!account.name) {
            throw new ValidationError("Nome é um atributo obrigatório!");
        }

        return app.db('accounts')
        .insert(account, '*');
    };

    const findAll = () => {
        return app.db('accounts');
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

    return { save, findAll, findOne, updateOne, deleteOne };
}; 
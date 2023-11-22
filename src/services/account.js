module.exports = (app) => {
    const save = (account) => {
        return app.db('accounts')
        .insert(account, '*');
    }

    const findAll = () => {
        return app.db('accounts');
    }

    const findOne = (filter = {}) => {
        return app.db('accounts')
        .where(filter)
        .first();
    }

    const updateOne = (id, account) => {
        return app.db('accounts')
        .where({id})
        .update(account, '*');
    }

    return { save, findAll, findOne, updateOne };
}; 
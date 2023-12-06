// const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
  
    const find = (filter = {}) => {
        return app.db('transfers')
        .where(filter)
        .select();
    }
   

    return { find };
}; 
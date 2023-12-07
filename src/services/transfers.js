const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
  
    const find = (filter = {}) => {
        return app.db('transfers')
        .where(filter)
        .select();
    }

    const save = (transfer) => {
        if(!transfer.description || transfer.description == "") {
            throw new ValidationError("A descrição é obrigatória!");
        }

        if(!transfer.amount || transfer.amount == "") {
            throw new ValidationError("O valor é obrigatório!");
        }

        if(!transfer.date || transfer.date == "") {
            throw new ValidationError("A data é obrigatória!");
        }

        if(!transfer.acc_ori_id) {
            throw new ValidationError("A conta de origem ou destino é inválida");
        }

        if(!transfer.acc_dest_id) {
            throw new ValidationError("A conta de origem ou destino é inválida");
        }

        const newTransfer = { ...transfer };
        
        return app.db("transfers")
        .insert(newTransfer, '*');
    };
   

    return { find, save };
}; 
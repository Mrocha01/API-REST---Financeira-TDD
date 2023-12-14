const ValidationError = require('../errors/ValidatonError');

module.exports = (app) => {
  
    const find = (filter = {}) => {
        return app.db('transfers')
        .where(filter)
        .select();
    }

    const findOne = (filter = {}) => {
        return app.db('transfers')
        .where(filter)
        .first();
    }

    const validate = async (transfer) => {
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

        if(transfer.acc_dest_id === transfer.acc_ori_id) {
            throw new ValidationError("A conta de origem ou destino é inválida");
        }

        const account = await app.db('accounts').where("id", transfer.acc_ori_id).first();

        if (!account || account.user_id !== parseInt(transfer.user_id, 10)) {
            throw new ValidationError(`Conta #${transfer.acc_ori_id} não pertence ao usuario!`);
        }

        // const accounts = await app.db("accounts").whereIn("id", [transfer.acc_dest_id, transfer.acc_ori_id]);

        // accounts.forEach((acc) => {
        //     if(acc.user_id !== parseInt(transfer.user_id, 10)) {
        //         throw new ValidationError(`Conta #${transfer.acc_ori_id} não pertence ao usuario!`)
        //     }
        // });
    };
    
    const save = async (transfer) => {
        
        const result = await app.db("transfers")
        .insert(transfer, '*');

        const transferId = result[0].id;

        const transactions = [
            {
                description: `Transfer to acc # ${transfer.acc_dest_id}`,
                date: transfer.date,
                amount: transfer.amount * -1,
                type: "O",
                acc_id: transfer.acc_ori_id,
                transfer_id: transferId,
                status: true
            },
            {
                description: `Transfer from acc # ${transfer.acc_ori_id}`,
                date: transfer.date,
                amount: transfer.amount,
                type: "I",
                acc_id: transfer.acc_dest_id,
                transfer_id: transferId,
                status: true
            }
        ]

        await app.db("transactions").insert(transactions);

        return result;
    };

    const updateOne = async (id, transfer) => {

        const result = await app.db('transfers')
        .where({id})
        .update(transfer, '*');

        const transactions = [
            {
                description: `Transfer to acc # ${transfer.acc_dest_id}`,
                date: transfer.date,
                amount: transfer.amount * -1,
                type: "O",
                acc_id: transfer.acc_ori_id,
                transfer_id: id,
                status: true
            },
            {
                description: `Transfer from acc # ${transfer.acc_ori_id}`,
                date: transfer.date,
                amount: transfer.amount,
                type: "I",
                acc_id: transfer.acc_dest_id,
                transfer_id: id,
                status: true
            }
        ]

        await app.db("transactions").where({transfer_id: id}).del();

        await app.db("transactions").insert(transactions);

        return result;
    };

    const deleteOne = async (id) => {
        await app.db("transactions")
        .where({transfer_id: id})
        .del();

        return app.db("transfers")
        .where({id})
        .del();
    };
   

    return { find, save, findOne, updateOne, validate, deleteOne };
}; 
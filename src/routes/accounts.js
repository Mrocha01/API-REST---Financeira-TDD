// Controller

module.exports = (app) => {  
    const create = (req, res) => {
        app.services.account.save(req.body)
            .then((result) => {
                return res.status(201).json(result[0]);
            })
            .catch((err) => {
                res.status(400).json({error: err.message});
            });
    };

    const getAll = (req, res) => {
        app.services.account.findAll()
            .then((result) => {
                return res.status(200).json(result);
            });
    };

    const getById = (req, res) => {
        app.services.account.findOne(req.params.id)
            .then((result) => {
                return res.status(200).json(result);
            });
    };

    const update = (req, res) => {
        app.services.account.updateOne(req.params.id, req.body)
            .then((result) => {
                return res.status(200).json(result[0]);
            });
    };

    const deleteById = (req, res) => {
        app.services.account.deleteOne(req.params.id)
            .then(() => {
                return res.status(204).send();
            });
    };
  
    return { create, getAll, getById, update, deleteById };
  };
  
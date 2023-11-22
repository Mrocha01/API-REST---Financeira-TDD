// Controller

module.exports = (app) => {  
    const create = (req, res) => {
        app.services.account.save(req.body)
            .then((result) => {
                return res.status(201).json(result[0])
            });
    };

    const getAll = (req, res) => {
        app.services.account.findAll()
            .then((result) => {
                return res.status(200).json(result)
            });
    };

    const getById = (req, res) => {
        app.services.account.findOne({id: req.params.id})
            .then((result) => {
                return res.status(200).json(result)
            });
    };

    const update = (req, res) => {
        app.services.account.updateOne(req.params.id, req.body)
            .then((result) => {
                return res.status(200).json(result[0])
            });
    };
  
    return { create, getAll, getById, update };
  };
  
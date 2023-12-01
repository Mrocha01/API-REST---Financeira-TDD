const express = require('express');
const RecursoIndevidoError = require("../errors/RecursoIndevidoError");

module.exports = (app) => {
    const router = express.Router();

    router.param("id", (req, res, next) => {
        app.services.transactions.find(req.user.id, { 'transactions.id': req.params.id})
        .then((result) => {
            if(result.length > 0){
                return next();
            } else throw new RecursoIndevidoError();
        })
        .catch((err) => {
            return next(err);
        });
    });

    router.get('/', (req, res, next) => {
        app.services.transactions.find(req.user.id)
        .then(result => res.status(200).json(result))
        .catch(err => next(err));
    });

    router.post("/", (req, res, next) => {
        app.services.transactions.save(req.body)
            .then(result => res.status(201).json(result))
            .catch(err => next(err));
    });

    router.get("/:id",(req, res, next) => {
        app.services.transactions.findOne(req.params.id)
            .then(result => res.status(200).json(result))
            .catch(err=> next(err));
    });

    router.put("/:id",(req, res, next) => {
        app.services.transactions.updateOne(req.params.id, req.body)
            .then(result => res.status(200).json(result[0]))
            .catch(err=> next(err));
    });

    router.delete("/:id",(req, res, next) => {
        app.services.transactions.deleteOne(req.params.id)
            .then(() => res.status(204).send())
            .catch(err=> next(err));
    });

    return router;
};
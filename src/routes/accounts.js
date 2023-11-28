// Controller
const express = require('express');

module.exports = (app) => {  
    const router = express.Router();

    router.post("/", (req, res, next) => {
        app.services.account.save({ ...req.body, user_id: req.user.id })
            .then((result) => {
                return res.status(201).json(result[0]);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.get("/", (req, res, next) => {
        app.services.account.findAll()
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.get("/:id",(req, res, next) => {
        app.services.account.findOne(req.params.id)
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.put("/:id",(req, res, next) => {
        app.services.account.updateOne(req.params.id, req.body)
            .then((result) => {
                return res.status(200).json(result[0]);
            })
            .catch((err) => {
                next(err);
            });
    });

    router.delete("/:id", (req, res, next) => {
        app.services.account.deleteOne(req.params.id)
            .then(() => {
                return res.status(204).send();
            })
            .catch((err) => {
                next(err);
            });
    });
  
    return router;
  };
  
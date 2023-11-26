const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const ValidationError = require('../errors/ValidatonError');
const express = require('express');


const secret = "Segredo!";

module.exports = (app) => {
    const router = express.Router();

    router.post("/signin", (req, res, next) => {
        app.services.user
        .findOne({email: req.body.email})
        .then((user) => {
            if(!user) {
                throw new ValidationError("Usuario ou senha inválidos!");
            }
            
            if(bcrypt.compareSync(req.body.passwd, user.passwd)){
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
                const token = jwt.encode(payload, secret);
                res.status(200).json({token});
            } else {
                throw new ValidationError("Usuario ou senha inválidos!");
            }
        })
        .catch((err) => {
            return next(err);
        });
    });

    router.post("/signup", async(req, res, next) => {
        try {
          const result = await app.services.user.save(req.body);
    
          return res.status(201).json(result[0]);      
    
        } catch (err) {
            return next(err);
        }
      });

    return router;
};
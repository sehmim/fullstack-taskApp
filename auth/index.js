const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');

const users = db.get('users');
users.createIndex('username', { unique : true })
// FROM JOI DOCUMENTATION

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

router.get('/', (req, res) => {
    res.json({
        message: "Lock"
    })
})


// POST /auth/signup

router.post('/signup', (req, res,next) => {
    const result = Joi.validate(req.body, schema);
    if(result.error === null){
        // username unique
        users.findOne({
            username: req.body.username
        }).then( user => {
            if (user) {
                const error = new Error('Error, username not Available');
                next(error);
            } else {
                bcrypt.hash(req.body.password, 8).then(hashedPassword => {
                    // res.json({hashedPassword});
                    const newUser = {
                        username : req.body.username,
                        password : hashedPassword
                    };

                    users.insert(newUser).then( insertedUser => {
                        res.json(insertedUser);
                    });
                });
            }
        });
    } else {
        next(result.error);
    }
})

module.exports = router;
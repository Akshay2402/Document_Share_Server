const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mailer = require('../controllers/mailer');

router.post('/login', async (req, res, next) => {
    try {
        
    } catch (error) {
        return next(error);
    }
});


router.post('/register', async (req, res, next) => {
    try {
        // if (!req.body.name || !req.body.email || !req.body.password) {
        //     throw { status: 400, message: 'Missing fields, Please fill all the details!' };
        // }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            otp: otp
        };

        // Send the otp in mail
        const mailPayload = mailer.constructMailPayload(userObj.name, 'CREATE_USER', userObj);
        await mailer.sendMail([req.body.email], mailPayload);

        //save the user
        // const userInstance = new User(userObj);
        // const savedUser = await userInstance.save();
        // return res.json(savedUser);
        return res.json(userObj);

    } catch (error) {
        return next(error);
    }
});

module.exports = router;
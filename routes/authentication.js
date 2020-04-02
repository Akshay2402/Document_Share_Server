const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mailer = require('../controllers/mailer');
const authCont = require('../controllers/auth');

router.post('/login', async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw { status: 400, message: 'Missing email or password!' };
        }
        const user = await User.findOne({email: req.body.email, is_verified: true}).select('name email password is_verified is_online last_seen_at').exec();
        if (!user) {
            throw { status: 400, message: 'User Not Found!' };
        }
        if (!user.is_verified) {
            throw { status: 400, message: 'Please verify the OTP!' };
        }
        const isMatch = await user.authenticate(req.body.password);
        if (!isMatch) {
            throw { status: 400, message: 'Invalid email or password!' }
        }

        req.user = user;
        // generate token here
        const token = await authCont.generateToken(user);
        req.generatedToken = token;
        return res.json({ token: req.generatedToken, user: req.user });
    } catch (error) {
        return next(error);
    }
});

router.post('/resend_otp', async (req, res, next) => {
    try {
        if (!req.body.email) {
            throw { status: 400, message: 'Missing email!' };
        }
        const user = await User.findOne({email: req.body.email}).select('name email otp is_verified').exec();
        if (!user) {
            throw { status: 400, message: 'User Not Found!' };
        }
        if (user.is_verified) {
            throw { status: 400, message: 'User is Already Verified!' };
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = {
            otp,
            createdAt: new Date()
        };
        user.markModified('otp');

        const mailPayload = mailer.constructMailPayload(user.name, 'CREATE_USER', user.toObject());
        await mailer.sendMail([req.body.email], mailPayload);
        await user.save();
        return res.json({success: 1});
    } catch (error) {
        return next(error);
    }
});

router.post('/validate_otp', async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.otp) {
            throw { status: 400, message: 'Missing email or OTP!' };
        }
        const user = await User.findOne({email: req.body.email}).select('otp is_verified').exec();
        if (!user) {
            throw { status: 400, message: 'User Not Found!' };
        }
        const otpObj = user.otp;
        const timeDiff = (new Date() - new Date(otpObj.createdAt)) / (1000*60); // in mins
        if ( timeDiff > 15 || req.body.otp !== otpObj.otp) {
            throw { status: 400, message: 'OTP is invalid or has been expired, please try again' };
        }
        user.is_verified = true;
        user.markModified('is_verified');
        await user.save();
        return res.json({success: 1});

    } catch (error) {
        return next(error);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            throw { status: 400, message: 'Missing fields, Please fill all the details!' };
        }
        const email_regular_expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email_regular_expression.test(req.body.email)) {
            throw { status: 400, message: "Invalid Email!" };
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            otp: {
                otp,
                createdAt: new Date()
            }
        };

        // Send the otp in mail
        const mailPayload = mailer.constructMailPayload(userObj.name, 'CREATE_USER', userObj);
        await mailer.sendMail([req.body.email], mailPayload);

        //save the user
        const userInstance = new User(userObj);
        const savedUser = await userInstance.save();
        return res.json({
            name: savedUser.name,   
            email: savedUser.email,
            createdAt: savedUser.createdAt
        });

    } catch (error) {
        return next(error);
    }
});

module.exports = router;
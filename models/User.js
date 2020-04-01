const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String 
    },
    email: {
        type: String,
        required: true,
        sparse: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                if (v == null || v == "") {
                    return true;
                } else {
                    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(v);
                }
            },
            message: "{VALUE} is not a valid Email. for ex- someone@domain.com"
        }
    },
    password: {
        type: String,
        select: false
    },
    otp: {
        type: Number
    },
    is_online: {
        type: Boolean,
        default: false
    },
    last_seen_at: {
        type: Date,
        default: new Date()
    }
}, {timestamps: true});

module.exports = { UserSchema };
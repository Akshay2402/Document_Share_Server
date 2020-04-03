const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    otp: {
        type: {
            otp: Number,
            createdAt: Date
        },
        select: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_online: {
        type: Boolean,
        default: false
    },
    last_seen_at: {
        type: Date,
        default: new Date()
    },
    documents: [{
        type: mongoose.Types.ObjectId,
        ref: 'Document'
    }]
}, { timestamps: true });


UserSchema.pre("save", function (next) {
    var user = this;
    if (!user.isModified("password")) {
      return next();
    }
    bcrypt.genSalt(5, function (err, salt) {
      if (err) {
        return next(err);
      }
  
      bcrypt.hash(user.password, salt, "", function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  });
  
  UserSchema.methods.authenticate = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            return resolve(isMatch);
        });
    });
};

module.exports = { UserSchema };
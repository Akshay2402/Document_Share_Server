'use strict';

const jwt = require('jsonwebtoken');

class TokenService {
    constructor(headers){
        this.token = this._extractTokenFromHeaders(headers);
        this.payload = {};
        this.validToken= false;
        
        this._verifyToken()
    }
    static createToken(options,cb){
        const payload = {
            email: options.user.email,
            _id: options.user._id,
            name: options.user.name,
            is_verified: options.user.is_verified
        };
        
        jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: options.expireTime || 60*60*24 // expires in 24 hours
        }, cb);
    }

    
    getPayload(){
        return this.payload;
    }
     isAuthenticated() {
        return this.validToken;
    }
    _verifyToken(){
        if(!this.token) return; 
        try{
            
            this.payload = jwt.verify(this.token, process.env.TOKEN_SECRET);
            
            this.validToken = true;

        } catch(err){
            this.payload = {};
            this.validToken = false;
        }
    }
}

module.exports = TokenService;
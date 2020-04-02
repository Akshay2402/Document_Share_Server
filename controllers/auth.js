const TokenService = require('../helpers/tokenService');

const generateToken = async (userObj) => {
    return new Promise((resolve, reject) => { 
        // 2 months time as expiry time.
        TokenService.createToken(
          { user: userObj, expireTime: 86400 },
          (err, token) => {
            if (err) {
                return reject({ status: 0, err: "User validation Failed" }); 
            }
            return resolve(token);
          }
        );
    });
};

module.exports = {
    generateToken
};
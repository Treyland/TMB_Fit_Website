const jwt = require("jsonwebtoken");
require('dotenv').config();


function jwtGenerator(id) {
    const payload = {
        user: id 
    }


    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "1h"})
};

module.exports = jwtGenerator;
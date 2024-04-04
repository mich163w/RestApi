const Joi = require('joi');
const jwt = require('jsonwebtoken');

//validating registration
const registerValidation = (data) => {
    const schema = Joi.object(
        {
        name: Joi.string().min(2).max(255).required(),
        username: Joi.string().min(4).max(255).required(),
        email: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(8).max(255).required()
        });
    return schema.validate(data);
}

//validating login
const loginValidation = (data) => {
    const schema = Joi.object(
        {
        username: Joi.string().min(4).max(255).required(),
        password: Joi.string().min(8).max(255).required()
        });
    return schema.validate(data);
}

//logic to verify our token (JWT)
//request, response
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) //if dont have a token
        return res.status(401).json({error: "Access Denied"});
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;    
        next(); //pass control to the next middleware

    } catch (error) {
        res.status(400).json({error: "Invalid token"}); //res = response
    }
}


module.exports = { registerValidation, loginValidation, verifyToken };
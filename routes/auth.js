const router = require('express').Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require("../validation");
const application = require('express'); //import express

// /registration
router.post('/register', async (req, res) => {

    //validate the user input(name, email, password)
    const { error } = registerValidation(req.body);

    if (error) { //400 Bad Request + json response
        return res.status(400).json({ error: error.details[0].message});
    }

    //check if the email already registered
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
        return res.status(400).json({ error: "This E-mail already exists" });
    }

    //hash the password
    //salt is a random string that is used to hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);


    //create a user object and save in the database
    const userObjects = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });

    try {
        const savedUser = await userObjects.save();
        res.json({ error: null, data: savedUser._id });
    } catch (error) {
        res.status(400).json({ error })
    }
  
});

// /login
router.post('/login', async (req, res) => {

    //validate the user info
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    } // 400 Bad Request

    //if login info is valid, find the user
    const user = await User.findOne({ email: req.body.email });

    //throw an error if email is wrong (user does not exist in the database)
    if (!user) {
        return res.status(400).json({ error: "Email is wrong" });
    }

    //user exists, now check the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    //throw error if the password is wrong

    if (!validPassword) {
        return res.status(400).json({ error: "Password is wrong" });
    }

    //create authentication token with username and id
    const token = jwt.sign
    (
        //playload data
        {
            name: user.name,
            id: user._id
        },
        //TOKEN_SECRET
        process.env.TOKEN_SECRET,
         //EXPIRATION TIME
        { expiresIn: process.env.JWT_EXPIRES_IN },
       
    );
    
    //attach auth token to the header
    res.header("auth-token", token).json({ error: null, data: { token } });

});

module.exports = router;
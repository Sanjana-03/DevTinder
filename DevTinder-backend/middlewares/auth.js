const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        //Read the token from cookies
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            return res.status(401).send('Please login!');
        }
        //Validate the token 
        const decodedData = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedData;

        //Find the user by id
        const user = await User.findById(_id);
        if (!user) {
            throw new Error(`User doesn't exists`);
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send('Error: ' + err.message);
    }   
}

module.exports = userAuth;
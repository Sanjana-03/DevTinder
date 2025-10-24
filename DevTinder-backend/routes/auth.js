const express = require('express');
const router = new express.Router();
const { validationSignUpData, validateLoginData } = require('../utils/validations');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/signup', async (req, res) => {
  //Creating a new instance of User model
  // const user = new User({
  //   firstName: "Sanjana",
  //   lastName: "Raghuwanshi",
  //   emailId: "sanjana123@gmail.com",
  //   password: "Sanjana@123",
  //   age: 25
  // });
  try {
    //Validation of Password
    validationSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });

    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('Error saving user: ' + err.message);
  }
});
router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    
    validateLoginData(emailId, password);
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('Invalid Credentials');
    }
    isPasswordValid = await user.verifyPassword(password);
    
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token,{
        expires: new Date(Date.now() + 7*24*60*60*1000),
      })
      res.send('Login successful!');
    }
    else {
        console.log('eeeeeeeee');
        
      throw new Error('Invalid Credentials');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
router.post('/logout', async (req, res) => {
  res.cookie("token", null,{
    expires: new Date(Date.now())
  });
  res.send('Logout successful');
});

module.exports = router;
const express = require('express');
const router = new express.Router();
const userAuth = require('../middlewares/auth');
const { validateProfileData } = require('../utils/validations');

router.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send('Error: ' + err.message)
    }
});

router.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileData(req)) {
            throw new Error('Invalid edit fields');
        }
        const user = req.user;
        Object.keys(req.body).forEach(key=> (user[key] = req.body[key]));
        await user.save();
        res.json({
            message: 'Profile updated successfully',
            data: user
        })
        
    } catch (err) {
        res.status(400).send('Error: ' + err.message)
    }
});

module.exports = router;
const express = require('express');
const router = new express.Router();
const userAuth = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

router.post('/request/send/:status/:toUserId',userAuth, async(req, res)=>{
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      
      const allowedStatus = ['ignored', 'interested'];
      if(!allowedStatus.includes(status)){
        return res.status(400).send('Invalid status type: '+status);
      }

      //If there is existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ],
      });
      if(existingConnectionRequest){
        return  res.status(400).send(
            {message:'Connection request already exists between users'});
      }
    const usertoConnect = await User.findById(toUserId);
    if(!usertoConnect){
        return res.status(404).json({message: 'User to connect not found'});
    }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      });
      const data = await connectionRequest.save(); 
      res.json({
        message:'Connection request sent successfully',
        data
      });

    } catch(err){
        res.status(400).send('Error: ' + err.message);
    }
});

router.post('/request/review/:status/:requestId', userAuth, async(req, res)=>{
    try{
      const loggedInUser = req.user;
      const {requestId, status} = req.params;

      const allowedStatus = ['accepted', 'rejected'];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message: 'Invalid status type: ' + status});
      }

      //Checking request is Valid or not
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
    });
    if(!connectionRequest){
        return res.status(404).json({message: 'No valid connection request found!'});
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({message: `Connection request ${status} successfully`, data});

    }catch(err){
        res.status(400).send('Error: ' + err.message);
    }
});
module.exports = router;
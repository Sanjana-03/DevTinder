const express = require('express');
const router = new express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userAuth = require('../middlewares/auth');

const USER_SAFE_DATA = 'firstName lastName age gender about skills';

router.get('/user/requests/received', userAuth, async(req, res) => {
    try{
      const loggedInUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: 'interested',
    }).populate('fromUserId',USER_SAFE_DATA);
    // }).populate('fromUserId',['firstName', 'lastName']);
      if(connectionRequests.length === 0){
        return res.status(404).json({message: 'No connection requests found'});
      }
      res.status(200).json({message: 'Connection requests fetched successfully',data: connectionRequests});

    }catch(err){
        res.status(400).send('Error: ' + err.message)
    }
});

router.get('/user/connections', userAuth, async(req, res) => {
  try{
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or:[
        {toUserId: loggedInUser._id, status: 'accepted'},
        {fromUserId: loggedInUser._id, status: 'accepted'}
      ]
    }).populate('fromUserId',USER_SAFE_DATA).populate('toUserId',USER_SAFE_DATA);
    const connections = connectionRequest.map((conn)=> {
      if(conn.fromUserId._id.toString() === loggedInUser._id.toString()){
        return conn.toUserId;
      }
      return conn.fromUserId
    });

    res.status(200).json({connections});
  } catch(err){
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/feed', userAuth, async(req, res) => {
  try{
    const loggedInUser = req.user;  

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit;

    //Find all the connection requests (sent + recieved)
    const connectionRequests = await ConnectionRequest.find({
      $or:[
        {fromUserId: loggedInUser._id}, 
        {toUserId: loggedInUser._id}
      ]
    }).select('fromUserId toUserId status');

    // Extract all users whome we need to exclude from feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and:[
      {_id: { $nin: Array.from(hideUsersFromFeed)}},
      {_id: { $ne: loggedInUser._id}}
    ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(users);
  } catch(err){
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;
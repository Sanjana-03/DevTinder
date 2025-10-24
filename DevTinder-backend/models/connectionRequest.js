const mongoose = require('mongoose');
const validator = require('validator');

const connectRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //reference to User model
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:{
            values: ['ignored', 'accepted', 'interested', 'rejected'],
            message: `{VALUE} is incorrect status type.`
        }
    }
},
{
    timestamps: true
});

connectRequestSchema.index({fromUserId:1, toUserId:1});

connectRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('Cannot send connection request to same user');
    }
    next();
});

module.exports = mongoose.model('ConnectionRequest', connectRequestSchema);
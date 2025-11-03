const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('./sendEmail');
const ConnectRequestModel = require('../models/connectionRequest');

cron.schedule("0 8 * * * ", async() =>{
    try{
      const yesterday = subDays(new Date(), 1); // this one means today's date - 1 i.e. yesterday
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);

      const pendingRequests = await ConnectRequestModel.find({
        status: 'interested',
        createdAt: {
            $gte: yesterdayStart,
            $lt: yesterdayEnd
        },
      }).populate("fromUserId toUserId");

      const listOfEmails = [ ...new Set(pendingRequests.map((req)=> req.toUserId.emailId))];
      for(const email of listOfEmails){
        try{
          const res = await sendEmail.run("New Friend Requests pending for "+ email,
            "There are so many frined reuests pending, please login to DevTinder.in and accept or reject the requests. "
          );
          console.log(res);
        } catch(err){
            console.log(err);
        }
      }
    } catch(err){
        console.error(err);
    }
}) 

const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);  
app.use("/",userRouter);  

connectDB().then(() => {
  console.log("DB connected");
  app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
  });
}).catch((err) => {
  console.log("DB connection error", err);
});



// app.get('/user', async (req, res) => {
//   try {
//     const user = await User.findOne({ emailId: req.body.emailId });
//     // const user = await User.findById('68de4bb9f542b35842981a44');
//     // const users = await User.find({ emailId: req.body.emailId });
//     // if (!users.length === 0) {
//     if (!user) {
//       res.status(404).send('No user found');
//       return;
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send('Error fetching user: ' + err.message);
//   }
// });
// app.delete('/user', async (req, res) => {
//   const userId = await User.findByIdAndDelete(req.body.userId);
//   try {
//     if (!userId) {
//       res.status(404).send('No user found');
//       return;
//     } else {
//       res.send('User deleted successfully');
//     }
//   } catch (err) {
//     res.status(400).send('Error deleting user: ' + err.message);
//   }
// })
// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (err) {
//     res.status(400).send('Error fetching user: ' + err.message);
//   }
// })
// app.patch('/user/:userId', async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) => {
//       ALLOWED_UPDATES.includes(k)
//     });
//     if (!isUpdateAllowed) {
//       throw new Error("Update is not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }

//     await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//       returnDocument: "after"
//     });
//     res.send('User updated successfully');
//   } catch (err) {
//     res.status(400).send('Error updating user: ' + err.message);
//   }
// });
// app.patch('/user', async (req, res) => {
//   const emailId = req.body.emailId;
//   const data = req.body;
//   try {
//     await User.findOneAndUpdate({ emailId: emailId }, data);
//     res.send('User updated successfully');
//   } catch (err) {
//     res.status(400).send('Error updating user: ' + err.message);
//   }
// });

// app.get('/user',(req,res)=>{
//     res.send({name:"Sanjana",last_name:"Raghuwanshi"});
// })
// //this will match all the http method api calls to /test endpoint
// app.use('/test', (req, res,next) => {
//   console.log("This is first callback function");
//   // res.send('Hello from Express!');
//   next(); // Call the next middleware function
// },
// (req,res)=>{
//   res.send("Hello from second callback function");
//     console.log("This is second callback function")
// });


const mongoose = require('mongoose');
const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://raghuneha2803:qKDhdSeGcdgWyT2p@cluster0.zlsqh.mongodb.net/devTinder')
}

module.exports = connectDB;
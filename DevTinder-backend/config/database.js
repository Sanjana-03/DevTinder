const mongoose = require('mongoose');
const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://raghuneha2803:Neha1111@cluster0.zlsqh.mongodb.net/devTinder')
}

module.exports = connectDB;
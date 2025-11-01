const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index:true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true, // this bydefault creates an index
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Enter a strong password');
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["female", "male", "others"].includes(value)) {
                throw new Error('Gender is not valid')
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('URL is invalid');
            }
        },
        default: 'https://th.bing.com/th/id/OIP.Gy4xTnZ6lXpE7Y-ZLG2QmAHaHa?w=163&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3'
    },
    about: {
        type: String,
        default: 'This is a default value for the user!'
    },
    skills: {
        type: [String]
    }
},
    {
        timestamps: true,
    },
);

userSchema.index({firstName:1});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{
        expiresIn: '7d'
      });
      return token;
}

userSchema.methods.verifyPassword = async function(password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
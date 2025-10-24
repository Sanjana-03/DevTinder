const validator = require('validator');
const validationSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error('Name is not valid!');
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error('Invalid email address');
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Please enter a strong password');
    }
}

const validateProfileData = (req) =>{
   const allowedEditFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];
   const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
   console.log(isEditAllowed);
   
   return isEditAllowed;
}

const validateLoginData = (email, password) =>{
   if(!email || !password){
    throw new Error('Invalid email id or password');
   } else if(!validator.isEmail(email) || !validator.isStrongPassword(password)){
    throw new Error('Invalid email or password format');
   }
}

module.exports = {
    validationSignUpData, validateLoginData, validateProfileData
}

// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reqired:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select: false
    },

    businessName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
 
} , {timestamps: true})

module.exports = mongoose.model("User" , userSchema);
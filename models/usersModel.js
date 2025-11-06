const { verify } = require("jsonwebtoken");

const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    email:{
        type: String,
        required:[true, 'Email is required!'],
        trim: true,
        unique: [true, 'Email must be unique'],
        minLength:[5, 'Email must be at least 5 characters long'],
        lowerCase: true,
    },
    password:{
        type: String,
        require: [true, 'Password is required!'],
        trim: true,
        select: false,

    },
    verify:{
        type: Boolean,
        default: false,

    },
    verificationCode:{
        type: String,
        select: false,

    },

    verificationCodeValidation:{
        type: Number,
        select: false,

    },


    forgotPasswordCode:{
        type: String,
        select: false,
    },
    forgotPasswordCodeValidation:{
        type: Number,
        select: false,
    }
},{

    timestamps: true,
})

module.exports = mongoose.model("User", userSchema )
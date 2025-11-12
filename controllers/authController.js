const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel');
const {signupSchema, signinSchema, acceptCodeSchema} = require('../middlewares/validator');
const { doHash, doHashValidation, hmacProcess } = require('../utils/hashing');
const transport = require('../middlewares/sendMail');
exports.signup = async (req, res) => {
    const {email, password} = req.body;
    try {
        const {error, value } = signupSchema.validate({email, password});
        if(error){
            return res.status(401).json({success:false, message: error.details[0].message})
        }
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(401)
            .json({success:false, message:"User already exists!"})
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword,
        })
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success:true, message:"Your account has been created successfully!", 
            result,
        });
    }catch(error){
        console.log(error);
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res
            .status(401)
            .json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "User does not exist!" });
        }
        const result = await doHashValidation(password, existingUser.password);
        if (!result) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
        }, process.env.TOKEN_SECRET,
        {
            expiresIn: '8h',
        });
        
        return res.json({
            success: true,
            token,
            message: "You have signed in successfully!",
        });
    } catch (error) {
        return res
        .status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.signout = async (req, res) =>{
    res.clearCookie('Authorization')
    .status(200)
    .json({success:true, message:"You have signed out successfully!"})
};

exports.sendVerificationCode = async (req,res)=>{
    const {email} = req.body;
    try{
        const existingUser = await User.findOne({email})
        if (!existingUser) {
            return res
            .status(404)
            .json({ success: false, message: "User does not exist!" });
        }
        if (existingUser.verified){
            return res
            .status(400)
            .json({ success: false, message: "User already verified!" });
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to:existingUser.email,
            subject:"Verification Code",
            html:"<h1>" + codeValue + "</h1>"
        })
        if(info.accepted[0] ===existingUser.email){
            const hashedCodeValue = hmacProcess(codeValue, process.env.
                HMAC_VERIFICATION_CODE_SECRET
            )
            existingUser.sendVerificationCode = hashedCodeValue;
            existingUser.sendVerificationCodeValidation = Date.now()
            await existingUser.save()
            return res.status(200).json({
                success:true,
                message:"Verification code sent to your email address",
            });
            res.status(400).json({
                success:false,
                message:"Verification code not sent",
            });
        }
    } catch (error){
        console.log(error);
    }
}


exports.verifyVerificationCode = async (req,res) =>{
    const {email, providedCode} = req.body;
    try {
         const { error, value } = acceptCodeSchema.validate({ email, providedCode });
        if (error) {
            return res
            .status(401)
            .json({ success: false, message: error.details[0].message });
        }
        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({email}).select("+verificationCode+verificationCodeValidation");

        if (!existingUser) {
            return res
            .status(401)
            .json({ success: false, message: "User does not exist!" });
        }
        if (existingUser.verified){
            return res.status(400).json({success: false, message:"You are already verified!"})
        }

        if (!existingUser.verifyVerificationCode || !existingUser.verificationCodeValidation){
            return res
            .status(400)
            .json({success: false, message:"Something is wrong with the code!"})
        }
         if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000){
            return res
            .status(400)
            .json({success: false, message:"The code has expired!"})

         }
         const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)

         if (hashedCodeValue === existingUser.verificationCode){
            existingUser.verified = true;
            existingUser.verificationCode = undefined;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save()
            return res
            .status(200)
            .json({success: true, message:"Your account has been verified!"})
         }
         return res
            .status(400)
            .json({success: false, message:"Unexpected error occured!"})
    }catch (error){
        console.log(error);
    }
}

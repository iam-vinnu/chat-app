import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/user.model.js";


export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;

    // Ratelimiter for user
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests , Please wait before requesting new otp"
        })
        return;
    };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;

    // saving the otp in the radis
    await redisClient.set(otpKey, otp, { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });

    const message = {
        to: email,
        subject: "Your OTP",
        body: `This is your OTP ${otp}. This is valid for 5min.`
    };

    await publishToQueue("send-otp", message);

    res.status(201).json({
        message: "OTP sent to your mail."  
    })
});

export const verifyUser = TryCatch(async (req, res) => {

    const { email, otp: enterdOtp } = req.body;
    if (!email || !enterdOtp) {
        return res.status(400).json({
            message: "Email & OTP required"
        })
    };

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp || enterdOtp !== storedOtp) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    };

    await redisClient.del(otpKey);

    let user = await User.findOne({ email });
    if (!user) {
        let name = email.slice(0, 8);
        await User.create({ name, email });
    }

    const token = generateToken(user);


    res.status(200)
    //    .cookie("token", token, {httpOnly: true,  sameSite: "strict", maxAge: 15 * 24 * 60 * 60 * 1000,})
       .json({
                message:"User Verified",
                user,
                token
            }); 


});


export const myProfile = TryCatch(async(req:AuthenticatedRequest, res)=>{
    const user = req.user;

    res.json(user);
});

export const updateName = TryCatch(async(req:AuthenticatedRequest, res)=>{
    const user = await User.findById(req.user?._id);
    if(!user){
        return res.status(404).json({
            message:"Please Login..."
        });
    }

    user.name = req.body.name ;

    const token = generateToken(user);

    return res.status(200).json({
        message:"User Updated",
        user,
        token
    });
});

export const getAllUsers = TryCatch(async (req:AuthenticatedRequest, res) => {
    const user = await User.find();
    return res.status(200).json(user);
});

export const getUser = TryCatch(async (req,res) => {   //here my route doesn't touch req.user so it is ok to TS infer 
    const user = await User.findById(req.params.id);
    return res.json(user);
});
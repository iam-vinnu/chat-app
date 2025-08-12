import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";


export const loginUser = TryCatch(async(req,res)=>{
    const {email} = req.body;

    // Ratelimiter for user
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if(rateLimit){
           res.status(429).json({
            message:"Too many requests , Please wait before requesting new otp"
           })
           return;
    };

    const otp = Math.floor(100000 + Math.random()* 900000).toString();
    const otpKey = `opt:${otp}` ;

    // saving the otp in the radis
    await redisClient.set(otpKey,otp,{EX:300});
    await redisClient.set(rateLimitKey,"true",{EX:60});

    const message = {
        to:email,
        subject : "Your OTP",
        body:`This is your OTP ${otp}. This is valid for 5min.`
    };

    await publishToQueue("send-otp" , message);

    res.status(201).json({
        message:"OTP sent to your mail."
    })
});
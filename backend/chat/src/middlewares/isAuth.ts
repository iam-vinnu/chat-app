import { NextFunction, Request, Response } from "express";
import TryCatch from "../config/TryCatch.js";
import  jwt, { JwtPayload }  from "jsonwebtoken";

export interface IUser extends Document{
    _id : string;
    name: string;
    email:string;
}

export interface AuthenticatedRequest extends Request{
    user?: IUser | null ;
}

export const isAuth = TryCatch(async(req:AuthenticatedRequest , res:Response , next:NextFunction)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({
                message:"Please Login - No auth header"
            });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decodedValue = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload ;

        if(!decodedValue || !decodedValue.user){
            res.status(402).json({
                message:"Invalid Token"
            })
            return;
        }

        req.user = decodedValue.user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Please Login - jwt error " });
    }
})